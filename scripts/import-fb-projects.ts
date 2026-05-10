/**
 * Import Facebook Page posts into the `projects` table.
 *
 * Pipeline:
 *   1. Paginate `GET /{page-id}/posts` with attachments tree
 *   2. For each post with photos: download → WebP → Supabase storage
 *   3. Insert row into `projects` (idempotent via UNIQUE source_post_id)
 *
 * Inputs (.env.local):
 *   META_PAGE_ID, META_PAGE_ACCESS_TOKEN
 *   NEXT_PUBLIC_SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY
 *
 * Re-running is safe: existing posts are skipped via ON CONFLICT.
 */
import { createClient } from '@supabase/supabase-js';
import { config } from 'dotenv';
import { createHash } from 'node:crypto';
import { mkdir, readFile, writeFile, access } from 'node:fs/promises';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import sharp from 'sharp';

config({ path: '.env.local' });

const PAGE_ID = process.env.META_PAGE_ID!;
const PAGE_TOKEN = process.env.META_PAGE_ACCESS_TOKEN!;
const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const SERVICE_ROLE = process.env.SUPABASE_SERVICE_ROLE_KEY!;
const BUCKET = 'media';
const STORAGE_PREFIX = 'site/projects';

if (!PAGE_ID || !PAGE_TOKEN || !SUPABASE_URL || !SERVICE_ROLE) {
  console.error('Missing env vars — need META_PAGE_ID, META_PAGE_ACCESS_TOKEN, NEXT_PUBLIC_SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY');
  process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SERVICE_ROLE, { auth: { persistSession: false } });

const __dirname = dirname(fileURLToPath(import.meta.url));
const DATA_DIR = join(__dirname, 'data', 'fb-projects');
const CACHE_DIR = join(DATA_DIR, '_local');

type FbMedia = { image?: { src: string; width: number; height: number } };
type FbAttachment = {
  type?: string;
  media_type?: string;
  media?: FbMedia;
  subattachments?: { data: FbAttachment[] };
};
type FbPost = {
  id: string;
  message?: string;
  story?: string;
  created_time: string;
  permalink_url?: string;
  attachments?: { data: FbAttachment[] };
};

async function exists(p: string): Promise<boolean> {
  try { await access(p); return true; } catch { return false; }
}

function slugify(s: string): string {
  return s
    .toLowerCase()
    .normalize('NFKD').replace(/[̀-ͯ]/g, '')
    .replace(/[^a-z0-9\s-]/g, '')
    .trim()
    .replace(/\s+/g, '-')
    .slice(0, 60);
}

function hash(s: string): string {
  return createHash('sha256').update(s).digest('hex').slice(0, 16);
}

/** Pull all unique photo URLs out of a post's attachments tree (de-dupe by FB CDN file ID). */
function photoUrls(post: FbPost): string[] {
  const urls = new Set<string>();
  const visit = (a: FbAttachment | undefined): void => {
    if (!a) return;
    if (a.media?.image?.src) urls.add(a.media.image.src);
    if (a.subattachments?.data) for (const sub of a.subattachments.data) visit(sub);
  };
  for (const a of post.attachments?.data ?? []) visit(a);
  return Array.from(urls);
}

function deriveTitle(message: string | undefined, fallbackDate: string): string {
  if (!message) return `Project ${fallbackDate.slice(0, 10)}`;
  const firstLine = message.split('\n').map((l) => l.trim()).find((l) => l.length > 0) || '';
  // Drop trailing emojis + clean up
  const cleaned = firstLine.replace(/[\u{1F300}-\u{1FAFF}\u{2600}-\u{27BF}]/gu, '').trim();
  return cleaned.slice(0, 90) || `Project ${fallbackDate.slice(0, 10)}`;
}

function deriveLocation(story: string | undefined): string | null {
  if (!story) return null;
  const m = story.match(/in\s+(.+?)\.?$/i);
  return m ? m[1].trim() : null;
}

function deriveFloorType(message: string | undefined): string | null {
  if (!message) return null;
  const m = message.toLowerCase();
  if (/\bvisgraat\b/.test(m)) return 'visgraat';
  if (/\btraprenovatie\b|\btrap\b/.test(m)) return 'traprenovatie';
  if (/\bpvc\s*tegel\b|\btegel\b/.test(m)) return 'pvc-tegel';
  if (/\bpvc\b/.test(m)) return 'pvc';
  if (/\blaminaat\b/.test(m)) return 'laminaat';
  if (/\bparket\b|\bmultiplank/.test(m)) return 'parket';
  return null;
}

function deriveTechniques(message: string | undefined): string[] {
  if (!message) return [];
  const m = message.toLowerCase();
  const techs = new Set<string>();
  if (/visgraat/.test(m)) techs.add('visgraat');
  if (/dryback|verlijmd/.test(m)) techs.add('dryback');
  if (/click\s*-?\s*pvc|pvc\s*klik/.test(m)) techs.add('click-pvc');
  if (/traprenovatie/.test(m)) techs.add('traprenovatie');
  if (/plinten/.test(m)) techs.add('plinten');
  if (/onderlaag|egaliseren|geëgaliseerd|geegaliseerd/.test(m)) techs.add('egaliseren');
  return Array.from(techs);
}

function deriveAreaSize(message: string | undefined): number | null {
  if (!message) return null;
  // Look for patterns like "140 m²", "60m2", "±50 m2"
  const match = message.match(/[±~]?\s*(\d{2,4})\s*m[²2]/i);
  return match ? parseInt(match[1], 10) : null;
}

async function fetchAllPosts(): Promise<FbPost[]> {
  const cachePath = join(DATA_DIR, 'raw-posts.json');
  if (await exists(cachePath)) {
    console.log('Using cached posts (delete data/fb-projects/raw-posts.json to refetch)');
    return JSON.parse(await readFile(cachePath, 'utf8'));
  }

  await mkdir(DATA_DIR, { recursive: true });

  const fields = encodeURIComponent(
    'id,message,story,created_time,permalink_url,attachments{type,media_type,media,subattachments{type,media_type,media}}',
  );
  let url: string | null = `https://graph.facebook.com/v21.0/${PAGE_ID}/posts?fields=${fields}&limit=100&access_token=${PAGE_TOKEN}`;
  const all: FbPost[] = [];
  while (url) {
    const res = await fetch(url);
    if (!res.ok) throw new Error(`FB API ${res.status}: ${await res.text()}`);
    const json = (await res.json()) as { data: FbPost[]; paging?: { next?: string } };
    all.push(...json.data);
    process.stdout.write(`fetched ${all.length}…\r`);
    url = json.paging?.next ?? null;
  }
  console.log(`\nfetched ${all.length} posts total`);

  await writeFile(cachePath, JSON.stringify(all, null, 2));
  return all;
}

async function downloadAndUpload(srcUrl: string): Promise<string> {
  const key = `${hash(srcUrl)}.webp`;
  const localPath = join(CACHE_DIR, key);

  let buffer: Buffer;
  if (await exists(localPath)) {
    buffer = await readFile(localPath);
  } else {
    const res = await fetch(srcUrl, { headers: { 'User-Agent': 'BPM-Parket-FB-Sync/1.0', Accept: 'image/*' } });
    if (!res.ok) throw new Error(`Image fetch ${res.status}: ${srcUrl.slice(0, 80)}…`);
    const input = Buffer.from(await res.arrayBuffer());
    buffer = await sharp(input)
      .resize({ width: 1600, height: 1600, fit: 'inside', withoutEnlargement: true })
      .webp({ quality: 90 })
      .toBuffer();
    await mkdir(CACHE_DIR, { recursive: true });
    await writeFile(localPath, buffer);
  }

  const path = `${STORAGE_PREFIX}/${key}`;
  const { error } = await supabase.storage.from(BUCKET).upload(path, buffer, {
    contentType: 'image/webp',
    upsert: true,
  });
  if (error) throw new Error(`Upload ${path}: ${error.message}`);
  return `${SUPABASE_URL}/storage/v1/object/public/${BUCKET}/${path}`;
}

async function existingPostIds(): Promise<Set<string>> {
  const { data, error } = await supabase.from('projects').select('source_post_id').not('source_post_id', 'is', null);
  if (error) throw error;
  return new Set(data.map((r) => r.source_post_id as string));
}

/** Posts manually excluded as promo / non-project (see scripts/cleanup-promo-projects.ts). */
async function excludedPostIds(): Promise<Set<string>> {
  const path = join(DATA_DIR, 'excluded-post-ids.json');
  if (!(await exists(path))) return new Set();
  const json = JSON.parse(await readFile(path, 'utf8')) as { excluded: { postId: string }[] };
  return new Set(json.excluded.map((e) => e.postId));
}

async function main() {
  await mkdir(CACHE_DIR, { recursive: true });

  const posts = await fetchAllPosts();
  const photoPosts = posts.filter((p) => photoUrls(p).length > 0);
  console.log(`${photoPosts.length}/${posts.length} posts have photos`);

  const [skip, excluded] = await Promise.all([existingPostIds(), excludedPostIds()]);
  const toImport = photoPosts.filter((p) => !skip.has(p.id) && !excluded.has(p.id));
  console.log(
    `${toImport.length} new posts to import ` +
      `(skipping ${photoPosts.length - toImport.length}: ` +
      `${[...skip].filter((id) => photoPosts.some((p) => p.id === id)).length} already in DB, ` +
      `${[...excluded].filter((id) => photoPosts.some((p) => p.id === id)).length} on exclusion list)`,
  );

  let i = 0;
  for (const post of toImport) {
    i += 1;
    const urls = photoUrls(post);
    process.stdout.write(`[${i}/${toImport.length}] ${post.id} (${urls.length} photos)…`);

    const supabaseUrls: string[] = [];
    for (const u of urls) {
      try {
        supabaseUrls.push(await downloadAndUpload(u));
      } catch (e) {
        console.log(`\n  ✗ image failed: ${(e as Error).message}`);
      }
    }
    if (supabaseUrls.length === 0) {
      console.log(' ✗ no images survived');
      continue;
    }

    const title = deriveTitle(post.message, post.created_time);
    const baseSlug = slugify(title);
    const slug = `${baseSlug}-${post.id.split('_')[1]?.slice(-6) ?? hash(post.id).slice(0, 6)}`;
    const description = post.message?.split('\n\n')[0]?.slice(0, 400) ?? null;

    const { error } = await supabase.from('projects').insert({
      slug,
      title,
      description,
      long_description: post.message ?? null,
      image_url: supabaseUrls[0],
      gallery_image_urls: supabaseUrls.slice(1),
      location: deriveLocation(post.story),
      completed_date: post.created_time.slice(0, 10),
      techniques: deriveTechniques(post.message),
      floor_type: deriveFloorType(post.message),
      area_size: deriveAreaSize(post.message),
      is_featured: false,
      sort_order: 1000 - i,
      source_post_id: post.id,
    });
    if (error) {
      console.log(` ✗ insert: ${error.message}`);
      continue;
    }
    console.log(` ✓ ${supabaseUrls.length} photos`);
  }

  console.log('\nDone.');
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
