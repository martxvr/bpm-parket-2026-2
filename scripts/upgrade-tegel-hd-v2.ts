/**
 * Re-encode tegel images at near-lossless WebP quality (q95) and upload to NEW
 * Supabase paths with `-hd` suffix. The new paths force cache busts in browsers,
 * Supabase CDN, and Next.js Image optimizer.
 *
 * Source URLs are the brand-site Magento originals (no `/cache/<hash>/` prefix),
 * verified to be 1200x1200 — the highest resolution PPC/DD/Otium publishes.
 *
 * Run `scripts/build-tegel-hd-migration.ts` afterwards to generate the UPDATE SQL.
 */
import { createClient } from '@supabase/supabase-js';
import { config } from 'dotenv';
import { mkdir, writeFile } from 'node:fs/promises';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import sharp from 'sharp';

config({ path: '.env.local' });

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const SERVICE_ROLE = process.env.SUPABASE_SERVICE_ROLE_KEY!;
const BUCKET = 'media';

const supabase = createClient(SUPABASE_URL, SERVICE_ROLE, {
  auth: { persistSession: false },
});

const __dirname = dirname(fileURLToPath(import.meta.url));
const CACHE_DIR = join(__dirname, 'data', 'ppc-decors', '_local');
const MANIFEST_OUT = join(__dirname, 'data', 'ppc-decors', 'tegel-hd-v2-manifest.json');

const UA = 'Mozilla/5.0 (Macintosh; Intel Mac OS X 14_0) AppleWebKit/605.1.15 Safari/605.1.15';

type Tile = {
  brand: 'douwes-dekker' | 'otium';
  decorName: string;
  /** Existing PPC-derived storage filename (used to match the DB record). */
  oldKey: string;
  /** Brand-site Magento original (no cache hash) — verified per-tile from listing scrape. */
  sourceUrl: string;
};

const TILES: Tile[] = [
  // Douwes Dekker — verified from douwesdekker.nl/producten/pvc/tegelvloer listing
  { brand: 'douwes-dekker', decorName: 'Flinke tegel bitterkoek', oldKey: '2413873e72c39813.webp', sourceUrl: 'https://www.douwesdekker.nl/media/catalog/product/d/o/douwes_04760.jpg' },
  { brand: 'douwes-dekker', decorName: 'Flinke tegel brownie',    oldKey: 'ae3ce82a61e09058.webp', sourceUrl: 'https://www.douwesdekker.nl/media/catalog/product/0/4/04763.jpg' },
  { brand: 'douwes-dekker', decorName: 'Flinke tegel macaron',    oldKey: '01092b6f7ae36fa6.webp', sourceUrl: 'https://www.douwesdekker.nl/media/catalog/product/d/o/douwes_04762.jpg' },
  { brand: 'douwes-dekker', decorName: 'Flinke tegel muffin',     oldKey: 'e419bad1c651371f.webp', sourceUrl: 'https://www.douwesdekker.nl/media/catalog/product/d/o/douwes_04761.jpg' },
  { brand: 'douwes-dekker', decorName: 'Tegel ananas',             oldKey: '8d8b1e5ca42927a1.webp', sourceUrl: 'https://www.douwesdekker.nl/media/catalog/product/1/0/10856-10860-ananas_1.jpg' },
  { brand: 'douwes-dekker', decorName: 'Tegel citroen',            oldKey: '7b15d51b1ff37c1c.webp', sourceUrl: 'https://www.douwesdekker.nl/media/catalog/product/1/0/10857-10861-citroen_1.jpg' },
  { brand: 'douwes-dekker', decorName: 'Tegel meloen',             oldKey: 'ea1c69a9281aa243.webp', sourceUrl: 'https://www.douwesdekker.nl/media/catalog/product/1/0/10858-10862-meloen_1.jpg' },
  { brand: 'douwes-dekker', decorName: 'Tegel passievrucht',       oldKey: 'd16761e6760a1a55.webp', sourceUrl: 'https://www.douwesdekker.nl/media/catalog/product/1/0/10859-10863-passievrucht_1.jpg' },
  // Otium — verified from otiumathome.com/producten/pvc-vloeren/tiles listing
  { brand: 'otium', decorName: 'Himalaya Tile',    oldKey: '58e857fccd93dbca.webp', sourceUrl: 'https://www.otiumathome.com/media/catalog/product/o/9/o94651.jpg' },
  { brand: 'otium', decorName: 'Kilimanjaro Tile', oldKey: '8ebe4012862cbad9.webp', sourceUrl: 'https://www.otiumathome.com/media/catalog/product/o/9/o94653.jpg' },
  { brand: 'otium', decorName: 'Jura Tile',        oldKey: 'df3e97f5b06995d0.webp', sourceUrl: 'https://www.otiumathome.com/media/catalog/product/o/9/o94655.jpg' },
  { brand: 'otium', decorName: 'Pirin Tile',       oldKey: '98c244594a2936e4.webp', sourceUrl: 'https://www.otiumathome.com/media/catalog/product/9/4/94656_pirin_tile_1.jpg' },
  { brand: 'otium', decorName: 'Eldor tile',       oldKey: '0741432740d545f1.webp', sourceUrl: 'https://www.otiumathome.com/media/catalog/product/1/0/10759-10763-eldor_1.jpg' },
  { brand: 'otium', decorName: 'Denali tile',      oldKey: '14e78886e97b2fb1.webp', sourceUrl: 'https://www.otiumathome.com/media/catalog/product/1/0/10758-10762-denali_1.jpg' },
  { brand: 'otium', decorName: 'Atlas tile',       oldKey: '459da7d6c97f4430.webp', sourceUrl: 'https://www.otiumathome.com/media/catalog/product/1/0/10757-10761-atlas_1.jpg' },
  { brand: 'otium', decorName: 'Andes tile',       oldKey: '2ccbec8afcd38dce.webp', sourceUrl: 'https://www.otiumathome.com/media/catalog/product/1/0/10756-10760-andes_1.jpg' },
];

async function main() {
  await mkdir(join(CACHE_DIR, 'douwes-dekker'), { recursive: true });
  await mkdir(join(CACHE_DIR, 'otium'), { recursive: true });

  const manifest: Array<{ brand: string; decorName: string; oldKey: string; newKey: string; sourceUrl: string; sourceBytes: number; outputBytes: number; sourceWidth?: number; sourceHeight?: number }> = [];

  let i = 0;
  for (const t of TILES) {
    i += 1;
    process.stdout.write(`[${i}/${TILES.length}] ${t.brand} ${t.decorName}…`);

    const res = await fetch(t.sourceUrl, { headers: { 'User-Agent': UA, Accept: 'image/*' } });
    if (!res.ok) {
      console.log(` ✗ source ${res.status}`);
      continue;
    }
    const input = Buffer.from(await res.arrayBuffer());
    const meta = await sharp(input).metadata();

    // Encode at near-lossless WebP. effort=6 = best compression at given quality.
    const out = await sharp(input).webp({ quality: 95, effort: 6 }).toBuffer();

    const newKey = `${t.oldKey.replace(/\.webp$/, '')}-hd.webp`;
    const path = `site/${t.brand}/${newKey}`;
    await writeFile(join(CACHE_DIR, t.brand, newKey), out);

    const { error } = await supabase.storage.from(BUCKET).upload(path, out, {
      contentType: 'image/webp',
      upsert: true,
    });
    if (error) {
      console.log(` ✗ upload ${error.message}`);
      continue;
    }

    manifest.push({
      brand: t.brand,
      decorName: t.decorName,
      oldKey: t.oldKey,
      newKey,
      sourceUrl: t.sourceUrl,
      sourceBytes: input.length,
      sourceWidth: meta.width,
      sourceHeight: meta.height,
      outputBytes: out.length,
    });
    console.log(` ✓ src=${meta.width}x${meta.height} (${(input.length / 1024).toFixed(0)}KB) → out ${(out.length / 1024).toFixed(0)}KB`);
  }

  await writeFile(MANIFEST_OUT, JSON.stringify(manifest, null, 2));
  console.log(`\nManifest written to ${MANIFEST_OUT}`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
