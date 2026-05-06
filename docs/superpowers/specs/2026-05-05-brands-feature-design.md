# Brands Feature — Design Spec

**Date:** 2026-05-05
**Status:** Approved, ready for implementation planning
**Owner:** Martijn (dev), Bodhi van Baar (klant)

## 1. Goal & Constraints

Voeg een merken-laag toe aan de site zodat bezoekers per merk kunnen zien welke
product-lijnen BPM Parket voert, sfeerbeelden kunnen bekijken, en specifiek per
merk + product een offerte kunnen aanvragen. Dit is een uitbreiding op het
voltooide platform (Plans 1-4) en wordt Plan 5.

### Initiële merken (van Bodhi)

| Merk | Diensten | Source / inkoop |
|---|---|---|
| Sense | PVC | (Bodhi zoekt URL uit) |
| Joka | PVC (Lijn 350, evt 340) | via Jordan vloeren |
| Douwes Dekker | PVC + laminaat (volledige range) | via plintenenprofielencentrale.nl |
| Otium | PVC + laminaat (volledige range) | via plintenenprofielencentrale.nl |

### Constraints

- **Geen prijzen** publiek — past bij showroom-CTA model
- **Foto's lokaal** in Supabase Storage (geen hot-link naar brand-sites)
- **Internal supplier notes** (waar Bodhi de producten inkoopt) zichtbaar in admin
  paneel maar NIET op publieke site
- **Bodhi self-service**: alle brand- en product-data beheerbaar via admin paneel
  (CRUD + image upload via bestaande pipeline)
- **SEO-vriendelijk**: elke brand- en product-pagina krijgt eigen indexbare URL
  met canonical, metadata en JSON-LD

### Scope (M1)

Volledige feature in één plan:
- Database schema + RLS policies
- Public pages: `/merken`, `/merken/[brand]`, `/merken/[brand]/[product]`
- Service-pagina's: brand-cards sectie per service (filter op relevante merken)
- Navbar: tweede mega menu voor "Merken" naast bestaande "Diensten" (Variant 2b)
- Admin: brands CRUD + nested products CRUD met JSONB editors voor specs en decors
- LeadForm cascade: Type dienst → Merk → Product-lijn (met "Weet ik nog niet"
  escapes) + URL-param prefill
- Conversion tracking uitbreiding (brand + product in lead_submit event)
- Sitemap + Schema.org structured data uitbreiding
- Initiële data acquisitie: research + seed van 4 merken

## 2. Architectuur

Plan 5 voegt geen nieuwe systemen toe — pure uitbreiding op bestaand stack:

- **DB**: 3 nieuwe tabellen (`brands`, `products`, `brand_images`) + 2 nullable
  kolommen op `leads` (brand_id, product_id)
- **Storage**: nieuwe folder-structuur `media/brands/[brand]/...` binnen bestaande
  `media` bucket (RLS al ingesteld in Plan 1)
- **Public routes**: 3 nieuwe paginatypes via App Router
- **Admin routes**: 2 nieuwe sectie-paden (genest CRUD)
- **Server actions**: brands + products CRUD met `assertAdmin()` defense-in-depth
- **LeadForm**: cascade-dropdowns met dynamic fetching via één new
  read-only API route `/api/brands/by-service`

Alle bestaande infrastructure (RLS, image upload pipeline, auth gate, Markdown
renderer, JSON-LD wrapper) wordt hergebruikt.

## 3. Data Model

### Tabellen (nieuwe migratie)

```sql
CREATE TABLE brands (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  slug text UNIQUE NOT NULL,
  name text NOT NULL,
  logo_url text,
  description text,                 -- markdown, public
  internal_notes text,              -- ADMIN-ONLY (supplier source, contact info)
  website_url text,                 -- public link to brand site
  hero_image text,                  -- big mood/landscape shot
  sort_order int DEFAULT 0,
  is_active bool DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

CREATE TABLE products (             -- product-lijnen per merk per service
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  brand_id uuid NOT NULL REFERENCES brands(id) ON DELETE CASCADE,
  service_id uuid NOT NULL REFERENCES services(id),
  slug text NOT NULL,               -- 'lijn-350' (uniek per brand)
  name text NOT NULL,               -- 'PVC Lijn 350'
  description text,                 -- markdown
  hero_image text,                  -- main product photo
  gallery_image_urls text[] DEFAULT '{}',
  specs jsonb DEFAULT '{}',         -- { thickness_mm, click_or_glue, ... }
  decors jsonb DEFAULT '[]',        -- [{ name, image_url }, ...]
  spec_sheet_url text,              -- PDF link (optional)
  sort_order int DEFAULT 0,
  is_active bool DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  UNIQUE (brand_id, slug)
);

CREATE TABLE brand_images (         -- mood photos per brand
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  brand_id uuid NOT NULL REFERENCES brands(id) ON DELETE CASCADE,
  image_url text NOT NULL,
  caption text,
  sort_order int DEFAULT 0,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE leads
  ADD COLUMN brand_id uuid REFERENCES brands(id),
  ADD COLUMN product_id uuid REFERENCES products(id);

CREATE INDEX idx_products_brand_service ON products(brand_id, service_id);
CREATE INDEX idx_products_service ON products(service_id, is_active);
CREATE INDEX idx_brand_images_brand ON brand_images(brand_id, sort_order);
```

### RLS policies

```sql
-- brands: public-read, authenticated-write (zelfde patroon als bestaande tabellen)
ALTER TABLE brands ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public read brands" ON brands
  FOR SELECT TO anon, authenticated USING (is_active = true);
CREATE POLICY "Authenticated full access brands" ON brands
  FOR ALL TO authenticated USING (true) WITH CHECK (true);

-- products: idem
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public read products" ON products
  FOR SELECT TO anon, authenticated USING (is_active = true);
CREATE POLICY "Authenticated full access products" ON products
  FOR ALL TO authenticated USING (true) WITH CHECK (true);

-- brand_images: idem
ALTER TABLE brand_images ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public read brand_images" ON brand_images
  FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY "Authenticated full access brand_images" ON brand_images
  FOR ALL TO authenticated USING (true) WITH CHECK (true);
```

**Internal-notes bescherming:** RLS staat anon toe om de hele `brands` rij te
lezen (inclusief `internal_notes`). Bescherming is op application-layer:
publieke fetcher `getBrandBySlug()` selecteert expliciet zonder `internal_notes`,
admin fetcher selecteert alle velden. Defense-in-depth.

## 4. URL Structure & Routing

```
/merken                         (RSC, listing of all active brands)
/merken/[brand-slug]            (RSC, brand detail with grouped products + mood gallery)
/merken/[brand-slug]/[product-slug]  (RSC, product detail with specs + decors + photos)
```

**Brand cards sectie op service-pagina's:** onderaan elke `/<service>/page.tsx`
een nieuwe RSC sectie die `getBrandsByService(slug)` aanroept en cards rendert.

**Sitemap uitbreiding:** alle brands + products auto-generated, met
`lastModified` op `updated_at`, `changeFrequency: 'monthly'`, `priority: 0.8`
(brands) / 0.7 (products).

## 5. Navbar — Variant 2b (twee mega menu's)

Bestaande Diensten mega menu blijft ongewijzigd. Nieuwe Merken mega menu naast
het bestaande, met identiek hover/click gedrag:

```
NAV: Logo  [Diensten ▾]  [Merken ▾]  Projecten  Showroom  Over ons  Contact

Hover "Merken" toont:
┌────── 2-kolom grid ─────────────────┐
│  [logo] Sense          [logo] Joka  │
│  PVC vloeren           PVC + laminaat│
│                                       │
│  [logo] Douwes Dekker  [logo] Otium  │
│  PVC + laminaat        PVC + laminaat│
│                                       │
│       [Alle merken bekijken →]       │
└──────────────────────────────────────┘
```

Mobile menu: nieuwe `<details>` sectie "Merken" naast bestaande "Diensten".

## 6. Brand Detail Page Layout

```
┌─ Hero (background = brand.hero_image, with gradient overlay) ─┐
│  [logo]  Joka                                                  │
│          {description (markdown)}                              │
│          [Officiële website ↗]  [Vraag offerte aan voor Joka] │
└────────────────────────────────────────────────────────────────┘

┌─ Sfeerbeelden ─────────────────────────────────────────────────┐
│  [4-col masonry van brand_images]                              │
└────────────────────────────────────────────────────────────────┘

┌─ PVC-collectie (alleen als brand PVC-products heeft) ─────────┐
│  [product card: Lijn 350]  [product card: Lijn 340]            │
└────────────────────────────────────────────────────────────────┘

┌─ Laminaat-collectie (alleen als brand laminate-products heeft) ┐
│  [product cards]                                                │
└─────────────────────────────────────────────────────────────────┘

┌─ Final CTA ────────────────────────────────────────────────────┐
│  Geïnteresseerd in Joka? Plan een showroombezoek of vraag      │
│  vrijblijvend een offerte aan.                                  │
│  [Offerte aanvragen]  [Plan showroombezoek]                     │
└────────────────────────────────────────────────────────────────┘
```

## 7. Product Detail Page Layout

```
Breadcrumb: Merken > Joka > Lijn 350

┌─ Hero gallery ─────────────────────────────────────────────────┐
│  [main photo carousel]                          Joka            │
│                                                  Lijn 350       │
│                                                  {description}  │
│                                                  [Offerte aanv.]│
└────────────────────────────────────────────────────────────────┘

┌─ Specs ────────────────────────────────────────────────────────┐
│  Dikte                  | 5 mm                                  │
│  Click / lijm           | Click                                  │
│  Vloerverwarming        | Geschikt                               │
│  Slijtklasse            | 33                                     │
│  Afmeting               | 1220 × 180 mm                          │
└────────────────────────────────────────────────────────────────┘

┌─ Decors / Kleurvarianten ──────────────────────────────────────┐
│  [swatch: Eiken Naturel]  [swatch: Eiken Donker]               │
│  [swatch: Beton Grijs]    [swatch: Travertin]  ...              │
└────────────────────────────────────────────────────────────────┘

┌─ Spec sheet (alleen als spec_sheet_url) ──────────────────────┐
│  [Download productblad PDF →]                                   │
└────────────────────────────────────────────────────────────────┘

┌─ CTA ──────────────────────────────────────────────────────────┐
│  [Vraag offerte aan voor Joka Lijn 350]                         │
│  Of bekijk andere [Joka producten] / [PVC vloeren]              │
└────────────────────────────────────────────────────────────────┘
```

## 8. LeadForm Cascade

Bestaande LeadForm (`components/forms/LeadForm.tsx`) krijgt 2 nieuwe velden
tussen "Type vloer" en "Oppervlak":

```
Type vloer:    [PVC vloeren ▾]
   ↓
Merkvoorkeur:  [Sense / Joka / Douwes Dekker / Otium / Weet ik nog niet ▾]
               ← gevuld met merken die producten in geselecteerde service hebben
   ↓
Product-lijn:  [PVC Lijn 350 / Weet ik nog niet ▾]
               ← verschijnt na merk-keuze, gevuld met dat merk's producten in service
```

**Gedrag:**
- "Type vloer = (leeg)" → merk-dropdown verborgen
- "Merkvoorkeur = Weet ik nog niet" of leeg → product-dropdown verborgen
- "Type vloer" wijzigt → merk en product reset

**Data fetching client-side:**

Nieuwe route handler `/api/brands/by-service?service=<slug>` returns:
```json
{
  "brands": [
    {
      "id": "...",
      "name": "Joka",
      "slug": "joka",
      "products": [
        { "id": "...", "name": "PVC Lijn 350", "slug": "lijn-350" }
      ]
    }
  ]
}
```

LeadForm fetcht dit on service-change. Cached client-side voor de session.

**URL-param prefill:**

`/offerte?brand=joka` → brand-dropdown pre-selecteert Joka.
`/offerte?brand=joka&product=lijn-350` → beide pre-selecteren.

Brand-pagina CTA: `/offerte?brand=joka`.
Product-pagina CTA: `/offerte?brand=joka&product=lijn-350`.

**Lead opslag:**

`actions/leads.ts` server-action insert in `leads` met optionele `brand_id` en
`product_id`. Validation via Zod accepteert beide als nullable UUID.

**Admin lead detail toont:**

```
Aanvraag:
  Type vloer:    PVC vloeren
  Merkvoorkeur:  Joka            ← link naar /admin/merken/[id]
  Product-lijn:  Lijn 350        ← link naar /admin/merken/[id]/producten/[pid]
  Oppervlak:     45 m²
  Bericht:       ...
```

Admin lead-fetcher joint brands en products voor display.

## 9. Conversion Tracking

`trackConversion` in `lib/analytics.ts` event uitgebreid:

```ts
trackConversion({
  name: 'lead_submit',
  source,
  brand: brandSlug || undefined,
  product: productSlug || undefined,
});
```

Google Ads ziet welke merken/producten meeste leads opleveren → smart bidding
optimaliseert.

## 10. Schema.org Structured Data

Nieuwe schemas in `lib/seo.ts`:

```ts
brandSchema(brand)           // Schema.org Brand
productSchema(product, brand) // Schema.org Product met brand reference + image[]
```

Op brand-detail-pagina: één Brand schema.
Op product-detail-pagina: één Product schema (refereert aan brand).
Op listing pages: array van Brand/Product schemas (ItemList).

## 11. Admin Paneel Uitbreidingen

### Nieuwe routes

```
/admin/merken                                  ← list (cards met logo + n products)
/admin/merken/nieuw                            ← create form
/admin/merken/[id]                             ← edit brand + products list
/admin/merken/[id]/producten/nieuw             ← create product within brand
/admin/merken/[id]/producten/[pid]             ← edit product
```

### Nieuwe sidebar entry

```
Sidebar.tsx NAV array uitbreiden met:
  { href: '/admin/merken', label: 'Merken', icon: Tag }
```

### Brand form fields

- Slug (lowercase, hyphens, unique)
- Name
- Logo (ImageUploader → folder='brands')
- Hero image (ImageUploader → folder='brands')
- Description (textarea, markdown)
- Internal notes (textarea, **labeled "Intern — niet zichtbaar voor bezoekers"**)
- Website URL (URL input)
- Sort order
- Is active (checkbox)

Plus inline section: "Sfeerbeelden" — gallery met add/remove via existing
GalleryUploader pattern (storing in `brand_images` table).

### Product form fields

- Slug (within brand)
- Name
- Service (dropdown van bestaande services tabel — bepaalt op welke service-pagina dit product getoond wordt)
- Description (markdown textarea)
- Hero image (ImageUploader → folder='brands' subfolder by brand-slug)
- Gallery images (array — multiple ImageUploaders)
- **Specs editor** — key-value rij toevoegen UI; values zijn strings, het
  resulteert in `{ "Dikte": "5 mm", "Click of lijm": "Click", ... }`
- **Decors editor** — list van rows: name + small image upload per decor
- Spec sheet URL (URL input, optional)
- Sort order
- Is active

### Server actions

`app/(admin)/admin/merken/actions.ts`:
- `upsertBrandAction`
- `deleteBrandAction`
- `addBrandImageAction`
- `deleteBrandImageAction`

`app/(admin)/admin/merken/[id]/producten/actions.ts`:
- `upsertProductAction`
- `deleteProductAction`

Alle actions starten met `await assertAdmin()`.

## 12. Data Acquisitie & Initial Seed

Ik (de AI in deze sessie) onderzoek de 4 merken via hun publieke websites en
seed initiële content. Per merk verzamel ik:

**Brand-niveau:**
- Logo (bij voorkeur SVG; anders hi-res PNG)
- Brand description (geparafraseerd, geen verbatim copy uit brand-site)
- 3-5 sfeerbeelden
- Hero image (groot, landscape)
- Website URL

**Product-niveau (per lijn):**
- Hero foto (installatie- of productshot)
- 3-5 detail/decor foto's
- Specs (dikte, click/lijm, vloerverwarming-geschikt, slijtklasse, materiaal,
  afmeting, oppervlaktestructuur)
- Decors (naam + swatch image per decor, beperk tot ~10 representatieve decors
  per lijn — niet alles, anders te veel onderhoud)
- Spec sheet PDF link (als publiek beschikbaar)

**Voor login-only content** (wholesale-portal materiaal): overslaan in seed.
Bodhi vult later aan via admin paneel.

**Geen verbatim copy** — alle teksten paraphrased / re-written om SEO
duplicate-content te voorkomen.

**Workflow:**

1. Brand website bezoeken
2. Beelden downloaden (Save As of fetch via Bash)
3. Voor elk beeld: lokale file → upload via `lib/storage/upload.ts` (sharp
   pipeline → resize → WebP → content-hash) of via direct Supabase Storage API
4. Product info samenvatten / paraphrase
5. Insert via Supabase MCP `apply_migration` of `execute_sql` met
   geseed JSON voor specs + decors

## 13. Implementation Order (high-level)

| Fase | Werk | Indicatie |
|---|---|---|
| 1 | DB migration + RLS + storage paths | 0.5 dag |
| 2 | DB fetchers + types | 0.5 dag |
| 3 | Admin: brand CRUD + JSONB editors + image uploaders | 1 dag |
| 4 | Admin: nested product CRUD + specs/decors editors | 0.5 dag |
| 5 | Public pages: /merken, /merken/[brand], /merken/[brand]/[product] + sitemap + JSON-LD | 1 dag |
| 6 | Service-pagina brand-cards sectie | 0.25 dag |
| 7 | Navbar Variant 2b (Merken mega menu) | 0.25 dag |
| 8 | LeadForm cascade + URL-param prefill + admin lead detail update | 0.5 dag |
| 9 | trackConversion uitbreiding | 0.25 dag |
| 10 | Data acquisitie + seed (4 merken × 1-2 producten) | 1.5-2 dagen |
| 11 | Build verify + smoke test | 0.25 dag |

**Totaal: ~6 dagen werk** (code 4 dagen + research/seed 2 dagen).

## 14. Vibe-Security Considerations

Geen nieuwe security-laag nodig — Plan 5 hergebruikt:

- RLS-policies pattern (public-read voor active rijen, auth-write)
- `assertAdmin()` op alle nieuwe server actions
- Image upload via bestaande sharp-pipeline (3-laagse validatie + EXIF strip)
- Service-role client alleen via bestaande `createServiceClient()` helper
- Internal-notes hidden via expliciete SELECT-projection in publieke fetchers
- Public `/api/brands/by-service` route is read-only met query-param validation
  via Zod, geen mutaties

`vibe-security` audit aan eind van Plan 5 verifieert.

## 15. Open Questions

- [ ] Sense URL: Bodhi zoekt uit (bereken impact: zonder URL is brand-pagina alleen
      met logo + sfeerbeelden + producten — minder rijke content)
- [ ] Joka Lijn 340 of alleen 350: voorlopig beide opnemen, Bodhi kan later 340
      deactiveren via admin als hij niet meer voert
- [ ] PDF spec sheets: bij sommige brands publiek beschikbaar, bij andere niet —
      gewoon optioneel laten

## 16. Estimated Code Volume

- DB migration: ~80 regels SQL
- DB fetchers: ~150 regels
- Admin CRUD: ~600 regels (forms, list pages, actions)
- Public pages: ~400 regels (3 pages + brand cards section)
- Navbar update: ~100 regels (mega menu duplication)
- LeadForm cascade: ~150 regels (state, fetcher, dropdowns)
- API route: ~50 regels
- SEO additions: ~100 regels
- Sitemap + Schema.org additions: ~50 regels
- **Code totaal: ~1700 regels**

Plus seed data (SQL) voor 4 merken × ~10 fields elk + ~10 producten = ~600
regels SQL/JSON in seed migrations.
