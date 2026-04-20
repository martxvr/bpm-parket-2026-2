# Nieuwe Merken & Actievloeren Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add 4 new brands (Douwes Dekker, Gelasta, DC-Line, Hamicon) with individual product variants and local images, plus build an admin-managed Actievloeren system for discounted floors.

**Architecture:** Brand data is added directly to `src/data/brands.ts` following the existing pattern (Invictus, Rivièra Maison). Each brand gets scraped for product info and images, which are downloaded locally to `public/images/brands/`. Actievloeren is a separate Supabase-backed system with its own admin CRUD pages and a public page at `/actievloeren`.

**Tech Stack:** TypeScript data file, Playwright/WebFetch for scraping, Supabase (table + RLS), Next.js App Router pages, Server Actions.

---

## File Structure

### Brand data (Tasks 1-4)
- Modify: `src/data/brands.ts` — add 4 new Brand entries to their respective category arrays
- Create: `public/images/brands/douwes-dekker/*.webp` — ~20-30 product images
- Create: `public/images/brands/gelasta/*.webp` — ~15-20 product images
- Create: `public/images/brands/dc-line/*.webp` — ~15-25 product images
- Create: `public/images/brands/hamicon/*.webp` — ~6 product type images + 3-4 mood images

### Actievloeren system (Tasks 5-7)
- Create: `src/app/(admin)/admin/actievloeren/page.tsx` — admin overview
- Create: `src/app/(admin)/admin/actievloeren/ActievloerenClient.tsx` — client component with grid + actions
- Create: `src/app/(admin)/admin/actievloeren/actions.ts` — server actions (save, delete, toggle)
- Create: `src/app/(admin)/admin/actievloeren/ActievloerForm.tsx` — shared create/edit form
- Create: `src/app/(admin)/admin/actievloeren/nieuw/page.tsx` — new actievloer page
- Create: `src/app/(admin)/admin/actievloeren/[id]/page.tsx` — edit actievloer page
- Create: `src/app/(site)/actievloeren/page.tsx` — public page (server component, data fetching)
- Create: `src/app/(site)/actievloeren/ActievloerenPageClient.tsx` — public page client component
- Modify: `src/lib/admin-data.ts` — add `getActievloeren()` function
- Modify: `src/lib/site-data.ts` — add `getPublicActievloeren()` function
- Modify: `src/app/(admin)/admin/_components/Sidebar.tsx` — add Actievloeren nav item

---

## Reference: Existing patterns

### BrandProduct type (do not change)
```typescript
export type BrandProduct = {
  name: string;
  slug: string;
  description: string;
  imageUrl?: string;
  specs: Record<string, string>;
};
```

### Brand type (do not change)
```typescript
export type Brand = {
  name: string;
  slug: string;
  logoUrl: string;
  website?: string;
  description: string;
  shortDescription: string;
  featured: boolean;
  materials: string[];
  moodImages?: string[];
  products: BrandProduct[];
};
```

### Categories array structure (in brands.ts, line ~1740)
```typescript
export const categories: Category[] = [
  { name: 'PVC Vloeren', slug: 'pvc-vloeren', brands: pvcBrands, ... },
  { name: 'Houten Vloeren', slug: 'houten-vloeren', brands: houtBrands, ... },
  { name: 'Traprenovatie', slug: 'traprenovatie', brands: traprenovatieBrands, ... },
  { name: 'Raamdecoratie', slug: 'raamdecoratie', brands: [], raamdecoratieTypes, ... },
  { name: 'Vloerbedekking', slug: 'vloerbedekking', brands: [], ... },
  { name: 'Gordijnen', slug: 'gordijnen', brands: [], ... },
];
```

Vloerbedekking and Gordijnen currently have `brands: []` — we need to create brand arrays for them and wire them into the categories array, following the same pattern as `pvcBrands`, `houtBrands`, `traprenovatieBrands`.

---

## Task 1: Douwes Dekker PVC (~20-30 dessins)

**Files:**
- Modify: `src/data/brands.ts` — add Douwes Dekker brand to pvcBrands array
- Create: `public/images/brands/douwes-dekker/*.webp` — product images

**Context:** Douwes Dekker is a Dutch PVC flooring brand. Source page (`plintenenprofielencentrale.nl/vloeren/pvc-per-merk/douwes-dekker-pvc`) is JS-rendered — use Playwright to scrape. Also try the official site `douwesdekker.nl` for product data.

- [ ] **Step 1: Scrape Douwes Dekker product data**

  Use Playwright to navigate to the product pages. Try these URLs:
  - `https://www.plintenenprofielencentrale.nl/vloeren/pvc-per-merk/douwes-dekker-pvc`
  - `https://www.douwesdekker.nl` (official site, may have better product data)
  
  For each product, extract: name, color/dessin, dimensions, wear layer thickness, installation type, image URL, and any other specs.

- [ ] **Step 2: Download product images locally**

  ```bash
  mkdir -p public/images/brands/douwes-dekker/
  ```
  
  Download each product image as WebP to `public/images/brands/douwes-dekker/[slug].webp`.
  Slug format: kebab-case of collection + color, e.g. `sympathie-warm-eiken.webp`.

- [ ] **Step 3: Find/download logo and mood images**

  Search for the Douwes Dekker logo (WebP/PNG with visible brand name). Download to `public/images/brands/douwes-dekker/logo.webp`.
  Download 3-4 mood/sfeer images to `public/images/brands/douwes-dekker/mood-1.webp` etc.

- [ ] **Step 4: Write Brand entry in brands.ts**

  Add the Douwes Dekker brand to the `pvcBrands` array in `src/data/brands.ts`. Place it after the last existing PVC brand (currently Castell, ending around line 1563).

  Brand metadata:
  ```typescript
  {
    name: 'Douwes Dekker',
    slug: 'douwes-dekker',
    logoUrl: '/images/brands/douwes-dekker/logo.webp',
    website: 'https://www.douwesdekker.nl',
    description: '...', // Dutch description based on scraped data
    shortDescription: '...',
    featured: false,
    materials: ['PVC'],
    moodImages: [
      '/images/brands/douwes-dekker/mood-1.webp',
      '/images/brands/douwes-dekker/mood-2.webp',
      '/images/brands/douwes-dekker/mood-3.webp',
    ],
    products: [
      // ~20-30 BrandProduct entries, each following this pattern:
      {
        name: 'Collectie – Kleur',
        slug: 'douwes-dekker-collectie-kleur',
        description: 'Nederlandse beschrijving...',
        imageUrl: '/images/brands/douwes-dekker/collectie-kleur.webp',
        specs: {
          'Collectie': '...',
          'Afmeting': '... × ... mm',
          'Topslijtlaag': '...',
          'Installatie': 'Dryback / Click',
          // other specs from product page
        }
      },
    ]
  }
  ```

- [ ] **Step 5: Verify TypeScript compiles**

  ```bash
  cd /Users/martijnvervoort/Desktop/Code/pvcvloerenachterhoek && npx tsc --noEmit
  ```

- [ ] **Step 6: Commit**

  ```bash
  git add src/data/brands.ts public/images/brands/douwes-dekker/
  git commit -m "feat: add Douwes Dekker PVC brand with individual product variants and local images"
  ```

---

## Task 2: Gelasta Tapijt (~15-20 variants)

**Files:**
- Modify: `src/data/brands.ts` — create `vloerbedekkingBrands` array, add Gelasta, wire into categories
- Create: `public/images/brands/gelasta/*.webp` — product images

**Context:** Gelasta has 678 carpet products at `gelasta.nl/tapijt`. We select ~15-20 from key collections: Atlas, Impress SDN, and 2-3 others. The site is server-rendered HTML, so WebFetch works.

- [ ] **Step 1: Scrape Gelasta product data**

  Fetch `https://www.gelasta.nl/tapijt` and subsequent pages. The first page shows 15 products. Navigate pagination or specific collection pages to find representative products from:
  - Atlas collection (~5 colors)
  - Impress SDN collection (~4 colors)
  - 2-3 other popular collections (~3 colors each)

  For each product extract: name, color code, color name, price (for reference only — don't show on site), image URL.

- [ ] **Step 2: Download product images locally**

  ```bash
  mkdir -p public/images/brands/gelasta/
  ```
  
  Download each product image from `gelasta.nl/image/cache/catalog/Tapijt/...` as WebP to `public/images/brands/gelasta/[slug].webp`.
  Slug format: `atlas-174-donkergrijs.webp`, `impress-sdn-150-zalm.webp`.

- [ ] **Step 3: Find/download logo and mood images**

  Find the Gelasta logo. Download to `public/images/brands/gelasta/logo.webp`.
  Download 3-4 mood images to `public/images/brands/gelasta/mood-1.webp` etc.

- [ ] **Step 4: Create vloerbedekkingBrands array and write Gelasta Brand entry**

  In `src/data/brands.ts`, create a new `const vloerbedekkingBrands: Brand[] = [...]` array (similar to `pvcBrands`, `houtBrands`, etc.) and add the Gelasta brand entry.

  Then update the categories array to use it:
  ```typescript
  // Change from:
  { name: 'Vloerbedekking', slug: 'vloerbedekking', brands: [], ... },
  // To:
  { name: 'Vloerbedekking', slug: 'vloerbedekking', brands: vloerbedekkingBrands, ... },
  ```

  Brand metadata:
  ```typescript
  {
    name: 'Gelasta',
    slug: 'gelasta',
    logoUrl: '/images/brands/gelasta/logo.webp',
    website: 'https://www.gelasta.nl',
    description: 'Nederlands tapijt merk met een breed assortiment...',
    shortDescription: '...',
    featured: true,
    materials: ['Tapijt'],
    moodImages: [...],
    products: [
      // ~15-20 entries following BrandProduct pattern
      {
        name: 'Atlas 174 – Donkergrijs',
        slug: 'gelasta-atlas-174-donkergrijs',
        description: 'Hoogwaardig tapijt in donkergrijze kleurstelling...',
        imageUrl: '/images/brands/gelasta/atlas-174-donkergrijs.webp',
        specs: {
          'Collectie': 'Atlas',
          'Kleur': 'Donkergrijs (174)',
          'Type': 'Bouclé',
        }
      },
    ]
  }
  ```

- [ ] **Step 5: Verify TypeScript compiles**

  ```bash
  npx tsc --noEmit
  ```

- [ ] **Step 6: Commit**

  ```bash
  git add src/data/brands.ts public/images/brands/gelasta/
  git commit -m "feat: add Gelasta tapijt brand to Vloerbedekking with ~15-20 product variants"
  ```

---

## Task 3: DC-Line Gordijnen (~15-25 variants)

**Files:**
- Modify: `src/data/brands.ts` — create `gordijnenBrands` array, add DC-Line, wire into categories
- Create: `public/images/brands/dc-line/*.webp` — product images

**Context:** DC-Line sells curtain products at `dc-line.nl`. We want: rolgordijnen, vouwgordijnen, duo rolgordijnen, duette, jaloezieën. Select ~3-5 variants per type.

- [ ] **Step 1: Scrape DC-Line product data**

  Use Playwright or WebFetch on `https://dc-line.nl`. Navigate to each product type section:
  - Rolgordijnen
  - Vouwgordijnen
  - Duo rolgordijnen
  - Duette
  - Jaloezieën
  
  For each product: name, color/fabric, image URL, specs (bedieningstype, materiaal, etc.).

- [ ] **Step 2: Download product images locally**

  ```bash
  mkdir -p public/images/brands/dc-line/
  ```
  
  Download each product image as WebP. Slug format: `rolgordijn-[kleur].webp`, `vouwgordijn-[kleur].webp`.

- [ ] **Step 3: Find/download logo and mood images**

  Download DC-Line logo and 3-4 mood images to `public/images/brands/dc-line/`.

- [ ] **Step 4: Create gordijnenBrands array and write DC-Line Brand entry**

  In `src/data/brands.ts`, create `const gordijnenBrands: Brand[] = [...]` and add DC-Line.

  Update the categories array:
  ```typescript
  // Change from:
  { name: 'Gordijnen', slug: 'gordijnen', brands: [], ... },
  // To:
  { name: 'Gordijnen', slug: 'gordijnen', brands: gordijnenBrands, ... },
  ```

  Brand metadata:
  ```typescript
  {
    name: 'DC-Line',
    slug: 'dc-line',
    logoUrl: '/images/brands/dc-line/logo.webp',
    website: 'https://dc-line.nl',
    description: '...',
    shortDescription: '...',
    featured: true,
    materials: ['Gordijnen'],
    moodImages: [...],
    products: [
      // ~15-25 entries, each with Type spec
      {
        name: 'Rolgordijn – [Kleur]',
        slug: 'dc-line-rolgordijn-kleur',
        description: '...',
        imageUrl: '/images/brands/dc-line/rolgordijn-kleur.webp',
        specs: {
          'Type': 'Rolgordijn',
          'Stof': '...',
          'Kleur': '...',
          'Bediening': 'Ketting / Motor',
        }
      },
    ]
  }
  ```

- [ ] **Step 5: Verify TypeScript compiles**

  ```bash
  npx tsc --noEmit
  ```

- [ ] **Step 6: Commit**

  ```bash
  git add src/data/brands.ts public/images/brands/dc-line/
  git commit -m "feat: add DC-Line gordijnen brand with ~15-25 product variants"
  ```

---

## Task 4: Hamicon Gordijnen (~6 product types + mood images)

**Files:**
- Modify: `src/data/brands.ts` — add Hamicon to gordijnenBrands array (created in Task 3)
- Create: `public/images/brands/hamicon/*.webp` — product type + mood images

**Context:** Hamicon is a custom curtain atelier. No individual dessins — just product types as BrandProduct entries. Source: `hamicon.nl/gordijnen/`.

- [ ] **Step 1: Download product type images and mood images from Hamicon website**

  ```bash
  mkdir -p public/images/brands/hamicon/
  ```

  Use Playwright or WebFetch to navigate `https://www.hamicon.nl/gordijnen/index.php?home` and its sub-pages. Download:
  - Representative image per product type (vouwgordijnen, overgordijnen, vitrage, paneelgordijnen, rolgordijnen, plissé)
  - 3-4 mood/sfeer images
  - The Hamicon logo

  Save as `public/images/brands/hamicon/vouwgordijnen.webp`, `overgordijnen.webp`, etc.
  Mood images: `mood-1.webp`, `mood-2.webp`, etc.
  Logo: `logo.webp`.

- [ ] **Step 2: Write Hamicon Brand entry in brands.ts**

  Add Hamicon to the `gordijnenBrands` array (created in Task 3):

  ```typescript
  {
    name: 'Hamicon Gordijnenatelier',
    slug: 'hamicon',
    logoUrl: '/images/brands/hamicon/logo.webp',
    website: 'https://www.hamicon.nl',
    description: 'Hamicon Gordijnenatelier levert hoogwaardig maatwerk gordijnen...',
    shortDescription: 'Maatwerk gordijnenatelier voor elk interieur.',
    featured: false,
    materials: ['Gordijnen'],
    moodImages: [
      '/images/brands/hamicon/mood-1.webp',
      '/images/brands/hamicon/mood-2.webp',
      '/images/brands/hamicon/mood-3.webp',
    ],
    products: [
      {
        name: 'Vouwgordijnen',
        slug: 'hamicon-vouwgordijnen',
        description: 'Maatwerk vouwgordijnen in diverse stoffen en kleuren. Beschikbaar met enkelvoudige plooi, dubbele plooi of Japanse stijl.',
        imageUrl: '/images/brands/hamicon/vouwgordijnen.webp',
        specs: { 'Type': 'Vouwgordijnen', 'Uitvoering': 'Maatwerk', 'Bediening': 'Koord / Motor' }
      },
      {
        name: 'Overgordijnen',
        slug: 'hamicon-overgordijnen',
        description: 'Klassieke overgordijnen op maat. Verkrijgbaar met plooien, zeilringen of als wavegordijn.',
        imageUrl: '/images/brands/hamicon/overgordijnen.webp',
        specs: { 'Type': 'Overgordijnen', 'Uitvoering': 'Maatwerk', 'Stijlen': 'Plooien, Zeilringen, Wave, Specials' }
      },
      {
        name: 'Vitrage',
        slug: 'hamicon-vitrage',
        description: 'Transparante vitrages op maat voor een lichte, luchtige sfeer.',
        imageUrl: '/images/brands/hamicon/vitrage.webp',
        specs: { 'Type': 'Vitrage', 'Uitvoering': 'Maatwerk', 'Plooien': 'Naar keuze' }
      },
      {
        name: 'Paneelgordijnen',
        slug: 'hamicon-paneelgordijnen',
        description: 'Strakke paneelgordijnen, ideaal voor grote raampartijen en als roomdivider.',
        imageUrl: '/images/brands/hamicon/paneelgordijnen.webp',
        specs: { 'Type': 'Paneelgordijnen', 'Uitvoering': 'Maatwerk', 'Bediening': 'Schuifrail' }
      },
      {
        name: 'Rolgordijnen',
        slug: 'hamicon-rolgordijnen',
        description: 'Functionele rolgordijnen op maat in verduisterende, lichtdoorlatende of screen stoffen.',
        imageUrl: '/images/brands/hamicon/rolgordijnen.webp',
        specs: { 'Type': 'Rolgordijnen', 'Uitvoering': 'Maatwerk', 'Bediening': 'Ketting / Motor' }
      },
      {
        name: 'Plissé',
        slug: 'hamicon-plisse',
        description: 'Plissé gordijnen met top-down/bottom-up optie. Isolerend en decoratief.',
        imageUrl: '/images/brands/hamicon/plisse.webp',
        specs: { 'Type': 'Plissé', 'Uitvoering': 'Maatwerk', 'Bediening': 'Koord, koordloos, elektrisch' }
      },
    ]
  }
  ```

- [ ] **Step 3: Verify TypeScript compiles**

  ```bash
  npx tsc --noEmit
  ```

- [ ] **Step 4: Commit**

  ```bash
  git add src/data/brands.ts public/images/brands/hamicon/
  git commit -m "feat: add Hamicon gordijnenatelier brand with product types and mood images"
  ```

---

## Task 5: Actievloeren — Supabase table

**Files:**
- No file changes — Supabase migration only

- [ ] **Step 1: Create the `actievloeren` table using Supabase MCP**

  Use `mcp__plugin_supabase_supabase__apply_migration` with project_id `satvtrhhcpxjkerhnqdk`:

  ```sql
  CREATE TABLE actievloeren (
    id UUID PRIMARY KEY DEFAULT extensions.uuid_generate_v4(),
    name TEXT NOT NULL,
    brand TEXT NOT NULL,
    collection TEXT,
    image_url TEXT NOT NULL,
    discount_percentage INTEGER NOT NULL DEFAULT 0,
    description TEXT,
    specs JSONB DEFAULT '{}',
    active BOOLEAN NOT NULL DEFAULT true,
    sort_order INTEGER NOT NULL DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT now()
  );

  ALTER TABLE actievloeren ADD CONSTRAINT actievloeren_discount_check
    CHECK (discount_percentage >= 0 AND discount_percentage <= 100);

  ALTER TABLE actievloeren ENABLE ROW LEVEL SECURITY;

  CREATE POLICY "Public can view active actievloeren" ON actievloeren
    FOR SELECT USING (active = true);

  CREATE POLICY "Authenticated users full access" ON actievloeren
    FOR ALL USING (auth.role() = 'authenticated');

  CREATE INDEX idx_actievloeren_active ON actievloeren (active, sort_order);
  ```

- [ ] **Step 2: Verify table was created**

  Use `mcp__plugin_supabase_supabase__execute_sql` to run:
  ```sql
  SELECT column_name, data_type FROM information_schema.columns WHERE table_name = 'actievloeren' ORDER BY ordinal_position;
  ```

---

## Task 6: Actievloeren — Admin pages

**Files:**
- Create: `src/app/(admin)/admin/actievloeren/actions.ts`
- Create: `src/app/(admin)/admin/actievloeren/page.tsx`
- Create: `src/app/(admin)/admin/actievloeren/ActievloerenClient.tsx`
- Create: `src/app/(admin)/admin/actievloeren/ActievloerForm.tsx`
- Create: `src/app/(admin)/admin/actievloeren/nieuw/page.tsx`
- Create: `src/app/(admin)/admin/actievloeren/[id]/page.tsx`
- Modify: `src/lib/admin-data.ts` — add `getActievloeren()` function
- Modify: `src/app/(admin)/admin/_components/Sidebar.tsx` — add nav item

- [ ] **Step 1: Add data function to admin-data.ts**

  Add to `src/lib/admin-data.ts` (after `getSfeerbeelden`):

  ```typescript
  export async function getActievloeren() {
      const supabase = await createClient()
      const { data, error } = await supabase
          .from('actievloeren')
          .select('*')
          .order('sort_order', { ascending: true })

      if (error) throw error
      return data
  }
  ```

- [ ] **Step 2: Create server actions**

  Create `src/app/(admin)/admin/actievloeren/actions.ts`:

  ```typescript
  'use server'

  import { requireAuth } from '@/lib/supabase/require-auth'
  import { revalidatePath } from 'next/cache'
  import { redirect } from 'next/navigation'

  export async function saveActievloer(formData: FormData) {
      const { supabase } = await requireAuth()

      const id = formData.get('id') as string
      const name = formData.get('name') as string
      const brand = formData.get('brand') as string
      const collection = formData.get('collection') as string
      const discount_percentage = Number(formData.get('discount_percentage') || 0)
      const description = formData.get('description') as string
      const sort_order = Number(formData.get('sort_order') || 0)
      const active = formData.get('active') === 'on'
      let image_url = formData.get('image_url') as string
      const image_file = formData.get('image_file') as File

      // Parse specs from form (key-value pairs)
      const specKeys = formData.getAll('spec_key') as string[]
      const specValues = formData.getAll('spec_value') as string[]
      const specs: Record<string, string> = {}
      specKeys.forEach((key, i) => {
          if (key && specValues[i]) specs[key] = specValues[i]
      })

      if (image_file && image_file.size > 0) {
          const fileExt = image_file.name.split('.').pop()
          const fileName = `actievloeren/${Math.random().toString(36).substring(2)}.${fileExt}`
          const { error: storageError } = await supabase.storage.from('media').upload(fileName, image_file)
          if (storageError) throw storageError
          const { data: { publicUrl } } = supabase.storage.from('media').getPublicUrl(fileName)
          image_url = publicUrl
      }

      const actievloerData = { name, brand, collection, image_url, discount_percentage, description, specs, active, sort_order }

      if (id) {
          const { error } = await supabase.from('actievloeren').update(actievloerData).eq('id', id)
          if (error) throw error
      } else {
          const { error } = await supabase.from('actievloeren').insert([actievloerData])
          if (error) throw error
      }

      revalidatePath('/admin/actievloeren')
      revalidatePath('/actievloeren')
      redirect('/admin/actievloeren')
  }

  export async function deleteActievloer(id: string) {
      const { supabase } = await requireAuth()
      const { error } = await supabase.from('actievloeren').delete().eq('id', id)
      if (error) throw error
      revalidatePath('/admin/actievloeren')
      revalidatePath('/actievloeren')
  }

  export async function toggleActievloer(id: string, active: boolean) {
      const { supabase } = await requireAuth()
      const { error } = await supabase.from('actievloeren').update({ active }).eq('id', id)
      if (error) throw error
      revalidatePath('/admin/actievloeren')
      revalidatePath('/actievloeren')
  }
  ```

- [ ] **Step 3: Create ActievloerenClient.tsx**

  Create `src/app/(admin)/admin/actievloeren/ActievloerenClient.tsx`:

  A client component showing a grid of actievloer cards. Each card shows:
  - Product image (h-48)
  - Discount badge (red, top-right, e.g. "-30%")
  - Brand name (small tag, top-left)
  - Product name, collection
  - Action buttons: Edit (link to `/admin/actievloeren/[id]`), Toggle active, Delete

  Follow the same pattern as `SfeerbeeldenClient.tsx` — use `useTransition` for optimistic updates on delete/toggle. Import icons from `@/components/ui/`.

- [ ] **Step 4: Create admin overview page**

  Create `src/app/(admin)/admin/actievloeren/page.tsx`:

  ```typescript
  import React from 'react'
  import Link from 'next/link'
  import { getActievloeren } from '@/lib/admin-data'
  import ActievloerenClient from './ActievloerenClient'

  export default async function ActievloerenPage() {
      const actievloeren = await getActievloeren()
      return (
          <div className="space-y-10 animate-fade-in">
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                  <div className="animate-slide-up">
                      <h1 className="text-4xl font-extrabold text-gray-900 tracking-tight">Actievloeren</h1>
                      <p className="text-gray-500 mt-2 text-lg font-medium">Beheer vloeren in de aanbieding</p>
                  </div>
                  <Link href="/admin/actievloeren/nieuw" className="bg-brand-primary text-white px-6 py-3 rounded-xl font-bold hover:bg-brand-secondary transition-colors text-sm">
                      + Nieuwe actievloer
                  </Link>
              </div>
              <ActievloerenClient initialData={actievloeren} />
          </div>
      )
  }
  ```

- [ ] **Step 5: Create ActievloerForm.tsx**

  Create `src/app/(admin)/admin/actievloeren/ActievloerForm.tsx`:

  A shared form component used by both create and edit pages. Fields:
  - `name` (text, required)
  - `brand` (text, required — e.g. "Gelasta")
  - `collection` (text, optional — e.g. "Atlas")
  - `image_file` (file upload) OR `image_url` (text) — with live preview
  - `discount_percentage` (number 0-100, required)
  - `description` (textarea)
  - Dynamic specs: repeatable key-value rows with + button to add more. Input names: `spec_key` and `spec_value`.
  - `sort_order` (number)
  - `active` (checkbox)

  Follow the same pattern as `SfeerbeeldForm.tsx`. Use `saveActievloer` as form action.

- [ ] **Step 6: Create nieuw and [id] pages**

  Create `src/app/(admin)/admin/actievloeren/nieuw/page.tsx`:
  ```typescript
  import ActievloerForm from '../ActievloerForm'
  export default function NieuweActievloerPage() {
      return <ActievloerForm />
  }
  ```

  Create `src/app/(admin)/admin/actievloeren/[id]/page.tsx`:
  ```typescript
  import { createClient } from '@/lib/supabase/server'
  import { notFound } from 'next/navigation'
  import ActievloerForm from '../ActievloerForm'

  export default async function EditActievloerPage({ params }: { params: Promise<{ id: string }> }) {
      const { id } = await params
      const supabase = await createClient()
      const { data, error } = await supabase.from('actievloeren').select('*').eq('id', id).single()
      if (error || !data) return notFound()
      return <ActievloerForm data={data} />
  }
  ```

- [ ] **Step 7: Add to admin sidebar**

  In `src/app/(admin)/admin/_components/Sidebar.tsx`, add a new import and nav item:

  ```typescript
  // Add import at top:
  import StarIcon from '@/components/ui/star-icon'

  // Add to MAIN items array (after Sfeerbeelden):
  { name: 'Actievloeren', href: '/admin/actievloeren', icon: StarIcon },
  ```

- [ ] **Step 8: Verify TypeScript compiles**

  ```bash
  npx tsc --noEmit
  ```

- [ ] **Step 9: Commit**

  ```bash
  git add -A
  git commit -m "feat: add Actievloeren admin CRUD pages with Supabase backend"
  ```

---

## Task 7: Actievloeren — Public page

**Files:**
- Create: `src/app/(site)/actievloeren/page.tsx` — server component
- Create: `src/app/(site)/actievloeren/ActievloerenPageClient.tsx` — client component
- Modify: `src/lib/site-data.ts` — add `getPublicActievloeren()` function

- [ ] **Step 1: Add data function to site-data.ts**

  Add to `src/lib/site-data.ts` (after `getSitePassword`):

  ```typescript
  export const getPublicActievloeren = cache(async () => {
      const supabase = createStaticClient()
      const { data, error } = await supabase
          .from('actievloeren')
          .select('*')
          .eq('active', true)
          .order('sort_order', { ascending: true })

      if (error) {
          console.error('Error fetching actievloeren:', error)
          return []
      }
      return data
  })
  ```

- [ ] **Step 2: Create public page server component**

  Create `src/app/(site)/actievloeren/page.tsx`:

  ```typescript
  import { getPublicActievloeren } from '@/lib/site-data'
  import ActievloerenPageClient from './ActievloerenPageClient'

  export default async function ActievloerenPage() {
      const actievloeren = await getPublicActievloeren()
      return <ActievloerenPageClient actievloeren={actievloeren} />
  }
  ```

- [ ] **Step 3: Create ActievloerenPageClient.tsx**

  Create `src/app/(site)/actievloeren/ActievloerenPageClient.tsx`:

  A client component with:

  **Hero section:** Dark background with title "Actievloeren" and subtitle. Same style as other category pages (brand-dark bg, gradient).

  **Product grid:** 3-column responsive grid. Each card:
  - Product image (h-56, object-cover, hover scale)
  - Korting badge: absolute positioned, top-right, red/orange bg, bold white text "-30%"
  - Brand name as small tag
  - Product name (bold)
  - Collection name (if set)
  - Description (2 lines, truncated)
  - Specs (key-value pairs, small text)
  - CTA button: "Offerte aanvragen" linking to `/offerte`

  **Empty state:** If no actievloeren, show a message "Momenteel geen actievloeren beschikbaar."

  **CTA section at bottom:** Same pattern as brand pages — "Interesse? Bel voor meer info" with phone number.

  Use `useEffect` for IntersectionObserver reveal animations (same pattern as other pages). Use `useRouter` for navigation.

- [ ] **Step 4: Verify TypeScript compiles**

  ```bash
  npx tsc --noEmit
  ```

- [ ] **Step 5: Commit**

  ```bash
  git add -A
  git commit -m "feat: add public Actievloeren page with discount badges and CTA"
  ```

---

## Task 8: Final verification

- [ ] **Step 1: TypeScript check**

  ```bash
  npx tsc --noEmit
  ```

- [ ] **Step 2: Verify brand counts**

  Check that `src/data/brands.ts`:
  - PVC Vloeren: now includes Douwes Dekker (previous brands + 1)
  - Vloerbedekking: now has `vloerbedekkingBrands` with Gelasta
  - Gordijnen: now has `gordijnenBrands` with DC-Line + Hamicon

- [ ] **Step 3: Verify image directories**

  ```bash
  ls public/images/brands/douwes-dekker/ | wc -l
  ls public/images/brands/gelasta/ | wc -l
  ls public/images/brands/dc-line/ | wc -l
  ls public/images/brands/hamicon/ | wc -l
  ```

  All should have images.

- [ ] **Step 4: Push to GitHub**

  ```bash
  git push origin main
  ```
