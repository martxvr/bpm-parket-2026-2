/**
 * Download PPC decor images, convert to WebP, upload to Supabase storage.
 * Outputs a manifest JSON with `{ name, image_url }` decors per product, ready to feed into a migration.
 *
 * Usage:
 *   pnpm tsx scripts/upload-ppc-decors.ts
 *
 * Reads:
 *   scripts/data/ppc-decors/{douwes-dekker,otium}-raw.json
 * Writes:
 *   scripts/data/ppc-decors/decors-manifest.json
 *   scripts/data/ppc-decors/_local/<brand>/<hash>.webp  (cached downloads)
 */
import { createClient } from '@supabase/supabase-js';
import { config } from 'dotenv';
import { createHash } from 'node:crypto';
import { mkdir, readFile, writeFile, access } from 'node:fs/promises';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import sharp from 'sharp';

config({ path: '.env.local' });

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const SERVICE_ROLE = process.env.SUPABASE_SERVICE_ROLE_KEY!;
const BUCKET = 'media';

if (!SUPABASE_URL || !SERVICE_ROLE) {
  console.error('Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY in .env.local');
  process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SERVICE_ROLE, {
  auth: { persistSession: false },
});

const __dirname = dirname(fileURLToPath(import.meta.url));
const DATA_DIR = join(__dirname, 'data', 'ppc-decors');
const CACHE_DIR = join(DATA_DIR, '_local');

type RawItem = { name: string; url: string; img: string; sku: string; labels: string[] };
type RawDump = { brand: string; items: RawItem[] };

type Decor = { name: string; image_url: string };
type Manifest = {
  generated_at: string;
  bucket: string;
  products: Record<string, { brand: string; product_slug: string; decors: Decor[] }>;
};

/** Strip "DD PVC dryback" / "OTIUM" prefixes and "Dryback" / "UM" suffixes for a clean display name. */
function cleanName(raw: string, brand: string): string {
  let s = raw.replace(/\s+/g, ' ').trim();
  if (brand === 'douwes-dekker') {
    s = s.replace(/^DD\s+PVC\s+dryback\s+/i, '');
  } else if (brand === 'otium') {
    s = s.replace(/^OTIUM\s+/i, '');
  }
  s = s.replace(/\s+UM$/i, '');
  s = s.replace(/\s+Dryback$/i, '');
  // Title case first letter of each word for visual consistency
  return s.charAt(0).toUpperCase() + s.slice(1);
}

function isTegel(name: string): boolean {
  return /\b(tegel|tile)\b/i.test(name);
}

function hashFor(url: string): string {
  return createHash('sha256').update(url).digest('hex').slice(0, 16);
}

async function exists(p: string): Promise<boolean> {
  try {
    await access(p);
    return true;
  } catch {
    return false;
  }
}

/**
 * PPC serves Magento-resized thumbnails under /media/catalog/product/cache/<hash>/...
 * Strip the cache segment to get the original (HD) source image.
 */
function originalImageUrl(cachedUrl: string): string {
  return cachedUrl.replace(/\/media\/catalog\/product\/cache\/[a-f0-9]+\//, '/media/catalog/product/');
}

async function fetchBytes(url: string): Promise<Buffer | null> {
  const res = await fetch(url, {
    headers: {
      'User-Agent': 'Mozilla/5.0 (BPM Parket decor sync)',
      Accept: 'image/*',
    },
  });
  if (!res.ok) return null;
  const arrayBuffer = await res.arrayBuffer();
  return Buffer.from(arrayBuffer);
}

async function downloadAndConvert(item: RawItem, brand: string): Promise<{ buffer: Buffer; key: string }> {
  // Cache key is based on the catalog filename (stable across cached/original variants).
  const hash = hashFor(item.img);
  const key = `${hash}.webp`;
  const localPath = join(CACHE_DIR, brand, key);

  if (await exists(localPath)) {
    const buffer = await readFile(localPath);
    return { buffer, key };
  }

  // Try the original (HD) URL first; fall back to the cached thumbnail if it 404s.
  const hdUrl = originalImageUrl(item.img);
  let input = await fetchBytes(hdUrl);
  if (!input) input = await fetchBytes(item.img);
  if (!input) throw new Error(`Failed to download ${item.name}: both ${hdUrl} and ${item.img} returned non-OK`);

  // Resize to max 1600px (HD product photo). Keep WebP quality high — these are decor swatches users zoom into.
  const buffer = await sharp(input)
    .resize({ width: 1600, height: 1600, fit: 'inside', withoutEnlargement: true })
    .webp({ quality: 92 })
    .toBuffer();

  await mkdir(join(CACHE_DIR, brand), { recursive: true });
  await writeFile(localPath, buffer);
  return { buffer, key };
}

async function uploadIfNeeded(buffer: Buffer, brand: string, key: string): Promise<string> {
  const path = `site/${brand}/${key}`;
  const { error } = await supabase.storage.from(BUCKET).upload(path, buffer, {
    contentType: 'image/webp',
    upsert: true,
  });
  if (error) throw new Error(`Upload failed for ${path}: ${error.message}`);
  return `${SUPABASE_URL}/storage/v1/object/public/${BUCKET}/${path}`;
}

async function processBrand(brand: string): Promise<{ plank: Decor[]; tegel: Decor[] }> {
  const raw: RawDump = JSON.parse(await readFile(join(DATA_DIR, `${brand}-raw.json`), 'utf8'));
  const plank: Decor[] = [];
  const tegel: Decor[] = [];

  let i = 0;
  for (const item of raw.items) {
    i += 1;
    process.stdout.write(`[${brand}] ${i}/${raw.items.length} ${item.name}…`);
    const { buffer, key } = await downloadAndConvert(item, brand);
    const publicUrl = await uploadIfNeeded(buffer, brand, key);
    const decor: Decor = { name: cleanName(item.name, brand), image_url: publicUrl };
    if (isTegel(item.name)) tegel.push(decor);
    else plank.push(decor);
    console.log(' ✓');
  }

  return { plank, tegel };
}

async function main() {
  await mkdir(CACHE_DIR, { recursive: true });
  const manifest: Manifest = {
    generated_at: new Date().toISOString(),
    bucket: BUCKET,
    products: {},
  };

  for (const brand of ['douwes-dekker', 'otium']) {
    const { plank, tegel } = await processBrand(brand);
    const plankSlug = brand === 'douwes-dekker' ? 'pvc-rechte-plank' : 'pvc-plank';
    manifest.products[`${brand}/${plankSlug}`] = { brand, product_slug: plankSlug, decors: plank };
    if (tegel.length > 0) {
      manifest.products[`${brand}/pvc-tegel`] = { brand, product_slug: 'pvc-tegel', decors: tegel };
    }
    console.log(`\n[${brand}] plank=${plank.length}, tegel=${tegel.length}\n`);
  }

  const manifestPath = join(DATA_DIR, 'decors-manifest.json');
  await writeFile(manifestPath, JSON.stringify(manifest, null, 2));
  console.log(`\nManifest written to ${manifestPath}`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
