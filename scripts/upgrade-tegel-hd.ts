/**
 * Upgrade tegel decor images to HD by re-fetching from douwesdekker.nl / otiumathome.com.
 * Brand sites carry 1200x1200 originals while PPC tops out at 800x800.
 *
 * Uploads to the same Supabase paths as the existing PPC images, so DB URLs do not change.
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

type Upgrade = {
  brand: 'douwes-dekker' | 'otium';
  /** Existing Supabase storage filename (kept identical so DB URLs don't change). */
  storageKey: string;
  /** HD source on the brand's own Magento site (unscaled original). */
  sourceUrl: string;
  decorName: string;
};

const UPGRADES: Upgrade[] = [
  // Douwes Dekker tegels — DD's own site has 1200x1200 originals.
  { brand: 'douwes-dekker', storageKey: 'ae3ce82a61e09058.webp', sourceUrl: 'https://www.douwesdekker.nl/media/catalog/product/0/4/04763.jpg', decorName: 'Flinke tegel brownie' },
  { brand: 'douwes-dekker', storageKey: 'ea1c69a9281aa243.webp', sourceUrl: 'https://www.douwesdekker.nl/media/catalog/product/1/0/10858-10862-meloen_1.jpg', decorName: 'Tegel meloen' },
  { brand: 'douwes-dekker', storageKey: '2413873e72c39813.webp', sourceUrl: 'https://www.douwesdekker.nl/media/catalog/product/d/o/douwes_04760.jpg', decorName: 'Flinke tegel bitterkoek' },
  { brand: 'douwes-dekker', storageKey: '8d8b1e5ca42927a1.webp', sourceUrl: 'https://www.douwesdekker.nl/media/catalog/product/1/0/10856-10860-ananas_1.jpg', decorName: 'Tegel ananas' },
  { brand: 'douwes-dekker', storageKey: '7b15d51b1ff37c1c.webp', sourceUrl: 'https://www.douwesdekker.nl/media/catalog/product/1/0/10857-10861-citroen_1.jpg', decorName: 'Tegel citroen' },
  { brand: 'douwes-dekker', storageKey: '01092b6f7ae36fa6.webp', sourceUrl: 'https://www.douwesdekker.nl/media/catalog/product/d/o/douwes_04762.jpg', decorName: 'Flinke tegel macaron' },
  { brand: 'douwes-dekker', storageKey: 'e419bad1c651371f.webp', sourceUrl: 'https://www.douwesdekker.nl/media/catalog/product/d/o/douwes_04761.jpg', decorName: 'Flinke tegel muffin' },
  { brand: 'douwes-dekker', storageKey: 'd16761e6760a1a55.webp', sourceUrl: 'https://www.douwesdekker.nl/media/catalog/product/1/0/10859-10863-passievrucht_1.jpg', decorName: 'Tegel passievrucht' },

  // Otium tegels — otiumathome.com has 1200x1200 originals.
  { brand: 'otium', storageKey: '98c244594a2936e4.webp', sourceUrl: 'https://www.otiumathome.com/media/catalog/product/9/4/94656_pirin_tile_1.jpg', decorName: 'Pirin Tile' },
  { brand: 'otium', storageKey: '58e857fccd93dbca.webp', sourceUrl: 'https://www.otiumathome.com/media/catalog/product/o/9/o94651.jpg', decorName: 'Himalaya Tile' },
  { brand: 'otium', storageKey: '8ebe4012862cbad9.webp', sourceUrl: 'https://www.otiumathome.com/media/catalog/product/o/9/o94653.jpg', decorName: 'Kilimanjaro Tile' },
  { brand: 'otium', storageKey: 'df3e97f5b06995d0.webp', sourceUrl: 'https://www.otiumathome.com/media/catalog/product/o/9/o94655.jpg', decorName: 'Jura Tile' },
  { brand: 'otium', storageKey: '2ccbec8afcd38dce.webp', sourceUrl: 'https://www.otiumathome.com/media/catalog/product/1/0/10756-10760-andes_1.jpg', decorName: 'Andes tile' },
  { brand: 'otium', storageKey: '14e78886e97b2fb1.webp', sourceUrl: 'https://www.otiumathome.com/media/catalog/product/1/0/10758-10762-denali_1.jpg', decorName: 'Denali tile' },
  { brand: 'otium', storageKey: '459da7d6c97f4430.webp', sourceUrl: 'https://www.otiumathome.com/media/catalog/product/1/0/10757-10761-atlas_1.jpg', decorName: 'Atlas tile' },
  { brand: 'otium', storageKey: '0741432740d545f1.webp', sourceUrl: 'https://www.otiumathome.com/media/catalog/product/1/0/10759-10763-eldor_1.jpg', decorName: 'Eldor tile' },
];

async function main() {
  await mkdir(join(CACHE_DIR, 'douwes-dekker'), { recursive: true });
  await mkdir(join(CACHE_DIR, 'otium'), { recursive: true });

  let i = 0;
  for (const u of UPGRADES) {
    i += 1;
    process.stdout.write(`[${i}/${UPGRADES.length}] ${u.brand} ${u.decorName}…`);

    const res = await fetch(u.sourceUrl, {
      headers: { 'User-Agent': 'Mozilla/5.0 (BPM Parket decor sync)', Accept: 'image/*' },
    });
    if (!res.ok) {
      console.log(` ✗ source ${res.status}`);
      continue;
    }
    const input = Buffer.from(await res.arrayBuffer());

    const buffer = await sharp(input)
      .resize({ width: 1600, height: 1600, fit: 'inside', withoutEnlargement: true })
      .webp({ quality: 92 })
      .toBuffer();

    // Local cache (overwrite previous PPC version with the new HD one).
    await writeFile(join(CACHE_DIR, u.brand, u.storageKey), buffer);

    const path = `site/${u.brand}/${u.storageKey}`;
    const { error } = await supabase.storage.from(BUCKET).upload(path, buffer, {
      contentType: 'image/webp',
      upsert: true,
    });
    if (error) {
      console.log(` ✗ upload ${error.message}`);
      continue;
    }

    // Read back dimensions for confirmation.
    const meta = await sharp(buffer).metadata();
    console.log(` ✓ ${meta.width}x${meta.height} (${(buffer.length / 1024).toFixed(0)}KB)`);
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
