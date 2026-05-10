/**
 * Build a SQL migration from decors-manifest.json. Idempotent: UPDATE existing plank products,
 * INSERT pvc-tegel only when missing.
 *
 * Usage:
 *   pnpm tsx scripts/build-decor-migration.ts > supabase/migrations/<timestamp>_extend_dd_otium_decors.sql
 */
import { readFile } from 'node:fs/promises';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));

type Decor = { name: string; image_url: string };
type Manifest = {
  products: Record<string, { brand: string; product_slug: string; decors: Decor[] }>;
};

function jsonbLiteral(decors: Decor[]): string {
  // Escape single quotes by doubling them (Postgres convention).
  const json = JSON.stringify(decors).replace(/'/g, "''");
  return `'${json}'::jsonb`;
}

const TEGEL_PRODUCT_DEFAULTS = {
  'douwes-dekker': {
    name: 'PVC Tegel',
    description:
      'De Douwes Dekker PVC tegel-collectie biedt natuurgetrouwe steen- en cement-uitstraling in dryback (verlijmd) uitvoering. Verkrijgbaar in standaard tegel- en flinke tegel-formaten met een ultra matte embossed-in-register toplaag voor een levensechte structuur. Geschikt voor zwaar huishoudelijk gebruik en vloerverwarming/-koeling.',
    specs: {
      Dikte: '2,5 / 6 / 6,5 mm',
      'Click of lijm': 'Dryback (verlijmd)',
      Vloerverwarming: 'Geschikt (ook koeling)',
      Slijtklasse: '23 (woon) / 33 (commercieel)',
      Afmeting: 'Tegel- en flinke tegel-formaten',
      Oppervlak: 'Ultra mat, embossed in register',
    },
    sort_order: 3,
  },
  otium: {
    name: 'PVC Tegel (NXT & Original)',
    description:
      'De Otium PVC tegel-collectie omvat de NXT- en Original-series in steen- en betonlook met dryback (verlijmd) uitvoering. Ultra matte afwerking met embossed-in-register textuur. Geschikt voor vloerverwarming en -koeling met 25 jaar woongarantie.',
    specs: {
      Dikte: '2,5 / 5,2 mm',
      'Click of lijm': 'Dryback (verlijmd)',
      Vloerverwarming: 'Geschikt (ook koeling)',
      Slijtklasse: '33',
      Afmeting: 'Tegel-formaat',
      Oppervlak: 'Ultra mat, embossed-in-register',
      Garantie: '25 jaar (woon)',
    },
    sort_order: 3,
  },
} as const;

async function main() {
  const manifestPath = join(__dirname, 'data', 'ppc-decors', 'decors-manifest.json');
  const manifest: Manifest = JSON.parse(await readFile(manifestPath, 'utf8'));

  const lines: string[] = [];
  lines.push('-- Extend decors for Douwes Dekker + Otium with all PPC dryback variants.');
  lines.push('-- Source: scripts/data/ppc-decors/decors-manifest.json (scraped 2026-05-10).');
  lines.push('-- ClickUp ticket: https://app.clickup.com/t/86c9qa2cw');
  lines.push('');
  lines.push('BEGIN;');
  lines.push('');

  for (const [, info] of Object.entries(manifest.products)) {
    const { brand, product_slug, decors } = info;
    if (product_slug === 'pvc-tegel') continue; // handled below

    lines.push(`-- ${brand} / ${product_slug} (${decors.length} decors)`);
    lines.push(`UPDATE products`);
    lines.push(`SET decors = ${jsonbLiteral(decors)},`);
    lines.push(`    updated_at = now()`);
    lines.push(`WHERE slug = '${product_slug}'`);
    lines.push(`  AND brand_id = (SELECT id FROM brands WHERE slug = '${brand}');`);
    lines.push('');
  }

  for (const [, info] of Object.entries(manifest.products)) {
    const { brand, product_slug, decors } = info;
    if (product_slug !== 'pvc-tegel') continue;
    const defaults = TEGEL_PRODUCT_DEFAULTS[brand as keyof typeof TEGEL_PRODUCT_DEFAULTS];
    if (!defaults) continue;
    const heroImage = decors[0]?.image_url ?? '';
    const description = defaults.description.replace(/'/g, "''");

    lines.push(`-- ${brand} / pvc-tegel (${decors.length} decors) — insert if missing`);
    lines.push(`INSERT INTO products (brand_id, service_id, slug, name, description, hero_image, gallery_image_urls, specs, decors, sort_order, is_active)`);
    lines.push(`SELECT`);
    lines.push(`  (SELECT id FROM brands WHERE slug = '${brand}'),`);
    lines.push(`  (SELECT id FROM services WHERE slug = 'pvc-vloeren'),`);
    lines.push(`  'pvc-tegel',`);
    lines.push(`  '${defaults.name.replace(/'/g, "''")}',`);
    lines.push(`  '${description}',`);
    lines.push(`  '${heroImage}',`);
    lines.push(`  ARRAY[]::text[],`);
    lines.push(`  ${jsonbLiteral([] as unknown as Decor[]).replace('[]', JSON.stringify(defaults.specs))}::jsonb,`);
    lines.push(`  ${jsonbLiteral(decors)},`);
    lines.push(`  ${defaults.sort_order},`);
    lines.push(`  true`);
    lines.push(`WHERE NOT EXISTS (`);
    lines.push(`  SELECT 1 FROM products p`);
    lines.push(`  JOIN brands b ON b.id = p.brand_id`);
    lines.push(`  WHERE p.slug = 'pvc-tegel' AND b.slug = '${brand}'`);
    lines.push(`);`);
    lines.push('');
    // Also UPDATE if it already exists (for re-runs)
    lines.push(`UPDATE products SET decors = ${jsonbLiteral(decors)}, updated_at = now()`);
    lines.push(`WHERE slug = 'pvc-tegel'`);
    lines.push(`  AND brand_id = (SELECT id FROM brands WHERE slug = '${brand}');`);
    lines.push('');
  }

  lines.push('COMMIT;');
  console.log(lines.join('\n'));
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
