/**
 * One-shot cleanup: hard-delete 12 promo / non-project posts that were
 * imported from Facebook by mistake. Removes Supabase storage files,
 * deletes DB rows, and writes the FB post IDs to an exclusion list so
 * `import-fb-projects.ts` skips them on re-runs.
 */
import { createClient } from '@supabase/supabase-js';
import { config } from 'dotenv';
import { mkdir, writeFile } from 'node:fs/promises';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

config({ path: '.env.local' });

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const SERVICE_ROLE = process.env.SUPABASE_SERVICE_ROLE_KEY!;
const BUCKET = 'media';

const supabase = createClient(SUPABASE_URL, SERVICE_ROLE, { auth: { persistSession: false } });

const __dirname = dirname(fileURLToPath(import.meta.url));
const EXCLUSIONS_FILE = join(__dirname, 'data', 'fb-projects', 'excluded-post-ids.json');

const TO_DELETE: { id: string; postId: string; reason: string }[] = [
  { id: '9c5bf653-87c6-4357-896e-849f6ddc0aed', postId: '729958783823940_1208222788036175', reason: 'Showroom update' },
  { id: '80df48da-c6e8-42c9-8a79-09f75c1c7f3c', postId: '729958783823940_1187494806775640', reason: 'Reviews collage' },
  { id: '75f50f13-25eb-40b8-bcf1-bc49a70db82b', postId: '729958783823940_984599933731796',  reason: 'Actie alert' },
  { id: 'a8e61d90-885a-4292-aadd-5a569686a635', postId: '729958783823940_895332009325256',  reason: 'Sales pitch' },
  { id: 'cf9861fb-bf3a-4efc-aa72-4708d7ceb97e', postId: '729958783823940_874424441416013',  reason: 'Showroom display DD' },
  { id: '595a7b3d-f1c5-4db9-89a5-f51ba269a4ef', postId: '729958783823940_877369187788205',  reason: 'Trap content marketing' },
  { id: '12968b87-21bf-46dd-a888-7c9fd05c2a98', postId: '729958783823940_868773938647730',  reason: 'Sales pitch (dup)' },
  { id: '348b4fd5-5ad5-4f80-be55-d89f003f4696', postId: '729958783823940_794189609439497',  reason: 'Vlonder/kunstgras (off-topic)' },
  { id: 'd3292268-85ef-4e6f-bdf0-7b00c8d17cbc', postId: '729958783823940_767580488767076',  reason: 'Voorjaarsactie' },
  { id: '65290f05-61dc-48c6-bd52-4f087f4e65f5', postId: '729958783823940_2182490955237375', reason: 'Kunstwerk Remon Baan' },
  { id: '00b62457-9c3d-4e70-9783-88fba9bcd936', postId: '729958783823940_1407987672687711', reason: 'Vinyl product launch' },
  { id: '177f691b-2537-4bfb-ab79-ed4a44eefcd3', postId: '729958783823940_747029092116909',  reason: 'Voorjaarsaanbieding' },
];

const PUBLIC_PREFIX = `${SUPABASE_URL}/storage/v1/object/public/${BUCKET}/`;

function urlToStoragePath(url: string): string | null {
  if (!url.startsWith(PUBLIC_PREFIX)) return null;
  return url.slice(PUBLIC_PREFIX.length);
}

async function main() {
  const ids = TO_DELETE.map((p) => p.id);

  // 1. Fetch all image URLs we need to remove from storage
  const { data: rows, error: selectErr } = await supabase
    .from('projects')
    .select('id, image_url, gallery_image_urls')
    .in('id', ids);
  if (selectErr) throw selectErr;

  const storagePaths: string[] = [];
  for (const r of rows ?? []) {
    if (r.image_url) {
      const p = urlToStoragePath(r.image_url);
      if (p) storagePaths.push(p);
    }
    for (const g of (r.gallery_image_urls ?? []) as string[]) {
      const p = urlToStoragePath(g);
      if (p) storagePaths.push(p);
    }
  }
  console.log(`Found ${rows?.length ?? 0}/${ids.length} rows. ${storagePaths.length} storage files to remove.`);

  // 2. Delete from storage in batches (Supabase remove() handles many at once but stay safe)
  if (storagePaths.length > 0) {
    const batchSize = 50;
    for (let i = 0; i < storagePaths.length; i += batchSize) {
      const batch = storagePaths.slice(i, i + batchSize);
      const { error } = await supabase.storage.from(BUCKET).remove(batch);
      if (error) throw new Error(`Storage delete batch ${i}: ${error.message}`);
      console.log(`  deleted ${Math.min(i + batchSize, storagePaths.length)}/${storagePaths.length}`);
    }
  }

  // 3. Delete DB rows
  const { error: deleteErr, count } = await supabase
    .from('projects')
    .delete({ count: 'exact' })
    .in('id', ids);
  if (deleteErr) throw deleteErr;
  console.log(`Deleted ${count} project rows.`);

  // 4. Persist exclusion list so re-imports skip these posts
  await mkdir(dirname(EXCLUSIONS_FILE), { recursive: true });
  await writeFile(
    EXCLUSIONS_FILE,
    JSON.stringify(
      {
        generated_at: new Date().toISOString(),
        note: 'FB post IDs to skip on re-import (promo / non-project content).',
        excluded: TO_DELETE.map(({ postId, reason }) => ({ postId, reason })),
      },
      null,
      2,
    ),
  );
  console.log(`Wrote exclusion list to ${EXCLUSIONS_FILE}`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
