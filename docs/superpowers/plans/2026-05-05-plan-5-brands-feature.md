# Plan 5: Brands Feature

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add a brands layer to BPM Parket: `/merken` index, `/merken/[brand]` detail with product lines and mood gallery, `/merken/[brand]/[product]` product detail with specs and decors. LeadForm cascades Type → Brand → Product. Bodhi self-manages everything via admin paneel. After execution: 4 seeded brands (Sense, Joka, Douwes Dekker, Otium) with their PVC + laminate product lines.

**Architecture:** Pure extension on Plans 1-4. New tables `brands`, `products`, `brand_images` with RLS following established public-read/auth-write pattern. Public pages are RSC fetching from Supabase. Admin uses existing image upload pipeline (sharp + WebP + Supabase Storage). LeadForm gets cascading dropdowns powered by one new read-only API route. No new infrastructure.

**Tech Stack:** Next.js 16, Supabase (Postgres + RLS + Storage), `@supabase/ssr`, Zod, sharp (existing), react-markdown (existing).

**Spec reference:** [docs/superpowers/specs/2026-05-05-brands-feature-design.md](../specs/2026-05-05-brands-feature-design.md)

**Plans 1-4 outputs this plan builds on:**
- Live Supabase with `media` storage bucket + RLS
- Admin paneel with assertAdmin pattern, ImageUploader, GalleryUploader
- LeadForm with Zod validation + honeypot + rate limit + email side-effects
- `lib/seo.ts` with StructuredData wrapper
- Existing service pages with markdown rendering

---

## File structure (new/changed in Plan 5)

```
supabase/migrations/
  20260505120000_brands_schema.sql                      CREATE
  20260505120100_brands_rls.sql                         CREATE
  20260505120200_brands_seed.sql                        CREATE (after research)
app/
  (public)/
    merken/
      page.tsx                                          CREATE (index)
      [brand]/
        page.tsx                                        CREATE (brand detail)
        [product]/
          page.tsx                                      CREATE (product detail)
    pvc-vloeren/page.tsx                                MODIFY (add brand cards)
    traditioneel-parket/page.tsx                        MODIFY
    multiplanken/page.tsx                               MODIFY
    laminaat/page.tsx                                   MODIFY
    traprenovatie/page.tsx                              MODIFY
    schuren-onderhoud/page.tsx                          MODIFY
  (admin)/
    admin/
      merken/
        page.tsx                                        CREATE
        actions.ts                                      CREATE
        nieuw/page.tsx                                  CREATE
        [id]/page.tsx                                   CREATE
        [id]/producten/
          actions.ts                                    CREATE
          nieuw/page.tsx                                CREATE
          [pid]/page.tsx                                CREATE
  api/
    brands/by-service/route.ts                          CREATE
components/
  layout/Navbar.tsx                                     MODIFY (Merken mega menu)
  marketing/
    BrandCards.tsx                                      CREATE (brand-cards section for service pages)
    BrandHero.tsx                                       CREATE
    ProductCard.tsx                                     CREATE
    ProductSpecs.tsx                                    CREATE
    DecorGrid.tsx                                       CREATE
  admin/
    BrandForm.tsx                                       CREATE
    BrandMoodGalleryUploader.tsx                        CREATE
    ProductForm.tsx                                     CREATE (note: separate from existing /admin/projecten ProjectForm)
    SpecsEditor.tsx                                     CREATE
    DecorsEditor.tsx                                    CREATE
  forms/LeadForm.tsx                                    MODIFY (cascade dropdowns)
lib/
  db/
    brands.ts                                           CREATE
    products.ts                                         CREATE (note: distinct from existing projects.ts)
  validation/
    admin-forms.ts                                      MODIFY (add brand + product schemas)
    forms.ts                                            MODIFY (leadSchema accept brand_id + product_id)
  seo.ts                                                MODIFY (add brandSchema + productSchema)
  analytics.ts                                          MODIFY (trackConversion accepts brand + product)
actions/leads.ts                                        MODIFY (insert brand_id + product_id)
app/(admin)/admin/leads/[id]/page.tsx                   MODIFY (show brand + product)
app/sitemap.ts                                          MODIFY (add brand + product URLs)
components/admin/Sidebar.tsx                            MODIFY (Merken nav entry)
```

---

## Phase A: Database

### Task 1: Schema migration

**Files:** `supabase/migrations/20260505120000_brands_schema.sql`

Apply via Supabase MCP `apply_migration` (project_id `pkgcvvpqflnyzjbowuej`).

```sql
CREATE TABLE brands (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  slug text UNIQUE NOT NULL,
  name text NOT NULL,
  logo_url text,
  description text,
  internal_notes text,
  website_url text,
  hero_image text,
  sort_order int DEFAULT 0,
  is_active bool DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

CREATE TABLE products (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  brand_id uuid NOT NULL REFERENCES brands(id) ON DELETE CASCADE,
  service_id uuid NOT NULL REFERENCES services(id),
  slug text NOT NULL,
  name text NOT NULL,
  description text,
  hero_image text,
  gallery_image_urls text[] DEFAULT '{}',
  specs jsonb DEFAULT '{}',
  decors jsonb DEFAULT '[]',
  spec_sheet_url text,
  sort_order int DEFAULT 0,
  is_active bool DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  UNIQUE (brand_id, slug)
);

CREATE TABLE brand_images (
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

CREATE TRIGGER set_updated_at_brands BEFORE UPDATE ON brands
  FOR EACH ROW EXECUTE FUNCTION set_updated_at();
CREATE TRIGGER set_updated_at_products BEFORE UPDATE ON products
  FOR EACH ROW EXECUTE FUNCTION set_updated_at();
```

Verify with `list_tables` after.

---

### Task 2: RLS policies

**Files:** `supabase/migrations/20260505120100_brands_rls.sql`

```sql
ALTER TABLE brands ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public read brands" ON brands
  FOR SELECT TO anon, authenticated USING (is_active = true);
CREATE POLICY "Authenticated full brands" ON brands
  FOR ALL TO authenticated USING (true) WITH CHECK (true);

ALTER TABLE products ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public read products" ON products
  FOR SELECT TO anon, authenticated USING (is_active = true);
CREATE POLICY "Authenticated full products" ON products
  FOR ALL TO authenticated USING (true) WITH CHECK (true);

ALTER TABLE brand_images ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public read brand_images" ON brand_images
  FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY "Authenticated full brand_images" ON brand_images
  FOR ALL TO authenticated USING (true) WITH CHECK (true);
```

Apply via Supabase MCP. Verify with `get_advisors` (should return no critical RLS warnings for new tables).

---

## Phase B: Types + Fetchers

### Task 3: lib/db/brands.ts

```ts
import 'server-only';
import { cache } from 'react';
import { createClient } from '@/lib/supabase/server';

export type Brand = {
  id: string;
  slug: string;
  name: string;
  logo_url: string | null;
  description: string | null;
  website_url: string | null;
  hero_image: string | null;
  sort_order: number;
  is_active: boolean;
};

export type BrandWithInternals = Brand & {
  internal_notes: string | null;
};

export type BrandImage = {
  id: string;
  brand_id: string;
  image_url: string;
  caption: string | null;
  sort_order: number;
};

const PUBLIC_FIELDS = 'id,slug,name,logo_url,description,website_url,hero_image,sort_order,is_active';

export const getActiveBrands = cache(async (): Promise<Brand[]> => {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from('brands')
    .select(PUBLIC_FIELDS)
    .eq('is_active', true)
    .order('sort_order');
  if (error) throw error;
  return data ?? [];
});

export const getBrandBySlug = cache(async (slug: string): Promise<Brand | null> => {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from('brands')
    .select(PUBLIC_FIELDS)
    .eq('slug', slug)
    .eq('is_active', true)
    .maybeSingle();
  if (error) throw error;
  return data;
});

export const getBrandImagesForBrand = cache(
  async (brandId: string): Promise<BrandImage[]> => {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from('brand_images')
      .select('*')
      .eq('brand_id', brandId)
      .order('sort_order');
    if (error) throw error;
    return data ?? [];
  },
);

export const getBrandsByService = cache(
  async (serviceSlug: string): Promise<Brand[]> => {
    const supabase = await createClient();
    const { data: service } = await supabase
      .from('services')
      .select('id')
      .eq('slug', serviceSlug)
      .maybeSingle();
    if (!service) return [];

    const { data: products } = await supabase
      .from('products')
      .select('brand_id')
      .eq('service_id', service.id)
      .eq('is_active', true);
    const brandIds = [...new Set((products ?? []).map((p) => p.brand_id))];
    if (brandIds.length === 0) return [];

    const { data: brands, error } = await supabase
      .from('brands')
      .select(PUBLIC_FIELDS)
      .in('id', brandIds)
      .eq('is_active', true)
      .order('sort_order');
    if (error) throw error;
    return brands ?? [];
  },
);

// Admin-only helper (selects internal_notes — only call from /admin routes)
export async function getBrandWithInternalsById(
  id: string,
): Promise<BrandWithInternals | null> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from('brands')
    .select('*')
    .eq('id', id)
    .maybeSingle();
  if (error) throw error;
  return data;
}
```

Verify + commit:
```bash
npm run typecheck && \
git add lib/db/brands.ts && \
git commit -m "feat(db): brands fetchers with internal_notes hidden in public path"
```

---

### Task 4: lib/db/products.ts

(Distinct from existing `projects.ts` — different domain.)

```ts
import 'server-only';
import { cache } from 'react';
import { createClient } from '@/lib/supabase/server';

export type ProductSpec = string;

export type Decor = {
  name: string;
  image_url: string;
};

export type Product = {
  id: string;
  brand_id: string;
  service_id: string;
  slug: string;
  name: string;
  description: string | null;
  hero_image: string | null;
  gallery_image_urls: string[];
  specs: Record<string, ProductSpec>;
  decors: Decor[];
  spec_sheet_url: string | null;
  sort_order: number;
  is_active: boolean;
};

export const getProductsForBrand = cache(
  async (brandId: string): Promise<Product[]> => {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .eq('brand_id', brandId)
      .eq('is_active', true)
      .order('sort_order');
    if (error) throw error;
    return data ?? [];
  },
);

export const getProductsForBrandByServiceSlug = cache(
  async (brandId: string, serviceSlug: string): Promise<Product[]> => {
    const supabase = await createClient();
    const { data: service } = await supabase
      .from('services')
      .select('id')
      .eq('slug', serviceSlug)
      .maybeSingle();
    if (!service) return [];
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .eq('brand_id', brandId)
      .eq('service_id', service.id)
      .eq('is_active', true)
      .order('sort_order');
    if (error) throw error;
    return data ?? [];
  },
);

export const getProductBySlugs = cache(
  async (brandSlug: string, productSlug: string): Promise<Product | null> => {
    const supabase = await createClient();
    const { data: brand } = await supabase
      .from('brands')
      .select('id')
      .eq('slug', brandSlug)
      .eq('is_active', true)
      .maybeSingle();
    if (!brand) return null;
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .eq('brand_id', brand.id)
      .eq('slug', productSlug)
      .eq('is_active', true)
      .maybeSingle();
    if (error) throw error;
    return data;
  },
);

// Admin: full list including inactive
export async function getAllProductsForBrandAdmin(
  brandId: string,
): Promise<Product[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from('products')
    .select('*')
    .eq('brand_id', brandId)
    .order('sort_order');
  if (error) throw error;
  return data ?? [];
}
```

Commit: `feat(db): products fetchers (brand product lines)`

---

## Phase C: Validation schemas

### Task 5: Brand + product Zod schemas

**Files:** `lib/validation/admin-forms.ts` (extend existing)

Add at end of file:

```ts
const slugRegex = /^[a-z0-9-]+$/;

export const brandUpsertSchema = z.object({
  id: z.string().uuid().optional(),
  slug: z.string().min(1).max(80).regex(slugRegex, 'Alleen kleine letters, cijfers en streepjes'),
  name: z.string().min(1).max(200),
  logo_url: z.string().url().optional().or(z.literal('')),
  hero_image: z.string().url().optional().or(z.literal('')),
  description: z.string().max(5000).optional(),
  internal_notes: z.string().max(2000).optional(),
  website_url: z.string().url().optional().or(z.literal('')),
  sort_order: z.coerce.number().int().min(0).optional(),
  is_active: z.coerce.boolean().optional(),
});

export const productUpsertSchema = z.object({
  id: z.string().uuid().optional(),
  brand_id: z.string().uuid(),
  service_id: z.string().uuid(),
  slug: z.string().min(1).max(80).regex(slugRegex, 'Alleen kleine letters, cijfers en streepjes'),
  name: z.string().min(1).max(200),
  description: z.string().max(10000).optional(),
  hero_image: z.string().url().optional().or(z.literal('')),
  gallery_image_urls: z.array(z.string().url()).optional(),
  specs: z.record(z.string()).optional(),                      // { "Dikte": "5 mm", ... }
  decors: z.array(z.object({
    name: z.string().min(1).max(100),
    image_url: z.string().url(),
  })).optional(),
  spec_sheet_url: z.string().url().optional().or(z.literal('')),
  sort_order: z.coerce.number().int().min(0).optional(),
  is_active: z.coerce.boolean().optional(),
});

export const brandImageInsertSchema = z.object({
  brand_id: z.string().uuid(),
  image_url: z.string().url(),
  caption: z.string().max(200).optional(),
});
```

Commit: `feat(validation): brand and product Zod schemas`

---

## Phase D: Admin paneel

### Task 6: Brand actions (server actions)

**Files:** `app/(admin)/admin/merken/actions.ts`

```ts
'use server';

import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { assertAdmin } from '@/lib/auth';
import { createClient } from '@/lib/supabase/server';
import { brandUpsertSchema, brandImageInsertSchema } from '@/lib/validation/admin-forms';
import { uploadImage, deleteImage } from '@/lib/storage/upload';

export type BrandState =
  | { status: 'idle' }
  | { status: 'success' }
  | { status: 'error'; message: string };

export async function uploadBrandImageAction(formData: FormData) {
  await assertAdmin();
  const file = formData.get('file') as File | null;
  if (!file) return { error: 'Geen bestand' };
  try {
    const { url } = await uploadImage(file, 'site'); // brands stored under media/site/brands by convention; using 'site' folder is fine
    return { url };
  } catch (e) {
    return { error: e instanceof Error ? e.message : 'Upload mislukt' };
  }
}

export async function upsertBrandAction(
  _prev: BrandState,
  formData: FormData,
): Promise<BrandState> {
  await assertAdmin();
  const parsed = brandUpsertSchema.safeParse({
    id: formData.get('id') || undefined,
    slug: formData.get('slug'),
    name: formData.get('name'),
    logo_url: formData.get('logo_url') || undefined,
    hero_image: formData.get('hero_image') || undefined,
    description: formData.get('description') || undefined,
    internal_notes: formData.get('internal_notes') || undefined,
    website_url: formData.get('website_url') || undefined,
    sort_order: formData.get('sort_order') || undefined,
    is_active: formData.get('is_active') === 'on',
  });
  if (!parsed.success) {
    return { status: 'error', message: parsed.error.issues[0].message };
  }

  const supabase = await createClient();
  const { id, ...rest } = parsed.data;
  if (id) {
    const { error } = await supabase.from('brands').update(rest).eq('id', id);
    if (error) return { status: 'error', message: error.message };
  } else {
    const { error } = await supabase.from('brands').insert(rest);
    if (error) return { status: 'error', message: error.message };
  }

  revalidatePath('/admin/merken');
  revalidatePath('/merken');
  redirect('/admin/merken');
}

export async function deleteBrandAction(id: string) {
  await assertAdmin();
  const supabase = await createClient();
  const { error } = await supabase.from('brands').delete().eq('id', id);
  if (error) throw new Error(error.message);
  revalidatePath('/admin/merken');
}

export async function addBrandImageAction(formData: FormData) {
  await assertAdmin();
  const brand_id = formData.get('brand_id') as string;
  const caption = (formData.get('caption') as string) || undefined;
  const file = formData.get('file') as File | null;
  if (!file) return { error: 'Geen bestand' };

  try {
    const { url } = await uploadImage(file, 'site');
    const parsed = brandImageInsertSchema.safeParse({ brand_id, image_url: url, caption });
    if (!parsed.success) return { error: parsed.error.issues[0].message };

    const supabase = await createClient();
    const { error } = await supabase.from('brand_images').insert(parsed.data);
    if (error) return { error: error.message };
    revalidatePath(`/admin/merken/${brand_id}`);
    revalidatePath('/merken');
    return { url };
  } catch (e) {
    return { error: e instanceof Error ? e.message : 'Upload mislukt' };
  }
}

export async function deleteBrandImageAction(id: string, imageUrl: string, brandId: string) {
  await assertAdmin();
  const match = imageUrl.match(/\/storage\/v1\/object\/public\/media\/(.+)$/);
  if (match) {
    await deleteImage(match[1]).catch((e) => console.error('Storage delete failed:', e));
  }
  const supabase = await createClient();
  const { error } = await supabase.from('brand_images').delete().eq('id', id);
  if (error) throw new Error(error.message);
  revalidatePath(`/admin/merken/${brandId}`);
}
```

Commit: `feat(admin): brand actions (CRUD + mood image upload)`

---

### Task 7: Admin brand list + form

**Files:**
- `app/(admin)/admin/merken/page.tsx` (list)
- `app/(admin)/admin/merken/nieuw/page.tsx` (new form)
- `app/(admin)/admin/merken/[id]/page.tsx` (edit form + nested products list)
- `components/admin/BrandForm.tsx`

**BrandForm.tsx:**

```tsx
'use client';

import { useActionState } from 'react';
import {
  upsertBrandAction,
  uploadBrandImageAction,
  type BrandState,
} from '@/app/(admin)/admin/merken/actions';
import { FormField } from '@/components/admin/FormField';
import { ImageUploader } from '@/components/admin/ImageUploader';
import type { BrandWithInternals } from '@/lib/db/brands';

const initialState: BrandState = { status: 'idle' };

export function BrandForm({ brand }: { brand?: BrandWithInternals }) {
  const [state, formAction, pending] = useActionState(upsertBrandAction, initialState);
  const errMsg = state.status === 'error' ? state.message : undefined;

  return (
    <form action={formAction} className="space-y-4 rounded-2xl bg-white p-6 shadow-sm">
      {brand && <input type="hidden" name="id" value={brand.id} />}

      <FormField label="Slug" hint="URL: /merken/[slug]" error={errMsg}>
        <input
          type="text"
          name="slug"
          required
          defaultValue={brand?.slug}
          pattern="[a-z0-9-]+"
          className="w-full rounded-lg border border-black/10 px-3 py-2 text-sm font-mono"
        />
      </FormField>

      <FormField label="Naam">
        <input
          type="text"
          name="name"
          required
          defaultValue={brand?.name}
          className="w-full rounded-lg border border-black/10 px-3 py-2 text-sm"
        />
      </FormField>

      <FormField label="Logo">
        <ImageUploader
          name="logo_url"
          defaultUrl={brand?.logo_url ?? ''}
          uploadAction={uploadBrandImageAction}
          folder="site"
        />
      </FormField>

      <FormField label="Hero image" hint="Groot sfeerbeeld bovenaan brand-pagina">
        <ImageUploader
          name="hero_image"
          defaultUrl={brand?.hero_image ?? ''}
          uploadAction={uploadBrandImageAction}
          folder="site"
        />
      </FormField>

      <FormField label="Beschrijving" hint="Markdown, 1-2 alinea's voor brand-pagina">
        <textarea
          name="description"
          defaultValue={brand?.description ?? ''}
          rows={5}
          className="w-full rounded-lg border border-black/10 px-3 py-2 text-sm"
        />
      </FormField>

      <FormField label="Interne notities" hint="ALLEEN ZICHTBAAR HIER — niet op publieke site">
        <textarea
          name="internal_notes"
          defaultValue={brand?.internal_notes ?? ''}
          rows={3}
          className="w-full rounded-lg border border-amber-300 bg-amber-50 px-3 py-2 text-sm"
          placeholder="Bijv. inkoopkanaal, contactpersoon bij wholesaler"
        />
      </FormField>

      <FormField label="Officiële website" hint="https://www.brand.nl">
        <input
          type="url"
          name="website_url"
          defaultValue={brand?.website_url ?? ''}
          className="w-full rounded-lg border border-black/10 px-3 py-2 text-sm"
        />
      </FormField>

      <div className="grid grid-cols-2 gap-4">
        <FormField label="Volgorde">
          <input
            type="number"
            name="sort_order"
            defaultValue={brand?.sort_order ?? 0}
            className="w-32 rounded-lg border border-black/10 px-3 py-2 text-sm"
          />
        </FormField>
        <label className="flex items-center gap-2 text-sm">
          <input
            type="checkbox"
            name="is_active"
            defaultChecked={brand?.is_active ?? true}
            className="rounded"
          />
          Actief (zichtbaar op site)
        </label>
      </div>

      <button
        type="submit"
        disabled={pending}
        className="rounded-lg bg-[var(--color-brand-primary)] text-white px-5 py-2 text-sm font-medium disabled:opacity-50"
      >
        {pending ? 'Opslaan…' : brand ? 'Brand bijwerken' : 'Brand aanmaken'}
      </button>
    </form>
  );
}
```

**list page.tsx:**

Same pattern as `/admin/projecten/page.tsx`. Cards van merken met logo + n products + edit/delete.

**nieuw/page.tsx:**

Wraps `<BrandForm />`.

**[id]/page.tsx:**

Loads brand via `getBrandWithInternalsById(id)`. Shows `<BrandForm brand={brand} />`. Below form: nested products list (link to `/admin/merken/[id]/producten/nieuw` and per-product edit). Plus a "Sfeerbeelden" section with `<BrandMoodGalleryUploader brandId={id} />`.

Commit: `feat(admin): brand list + new + edit pages`

---

### Task 8: Brand mood gallery uploader

**Files:** `components/admin/BrandMoodGalleryUploader.tsx`

Mirror of existing `GalleryUploader.tsx` but calls `addBrandImageAction` and shows existing brand's images with delete.

```tsx
'use client';

import { useState, useRef } from 'react';
import Image from 'next/image';
import { Upload } from 'lucide-react';
import {
  addBrandImageAction,
  deleteBrandImageAction,
} from '@/app/(admin)/admin/merken/actions';
import { DeleteButton } from '@/components/admin/DeleteButton';
import type { BrandImage } from '@/lib/db/brands';

type Props = {
  brandId: string;
  images: BrandImage[];
};

export function BrandMoodGalleryUploader({ brandId, images }: Props) {
  const [pending, setPending] = useState(false);
  const [error, setError] = useState('');
  const [caption, setCaption] = useState('');
  const fileRef = useRef<HTMLInputElement>(null);

  async function handleFile(file: File) {
    setError('');
    setPending(true);
    try {
      const fd = new FormData();
      fd.append('brand_id', brandId);
      fd.append('file', file);
      if (caption) fd.append('caption', caption);
      const result = await addBrandImageAction(fd);
      if (result.error) setError(result.error);
      else {
        setCaption('');
        if (fileRef.current) fileRef.current.value = '';
      }
    } finally {
      setPending(false);
    }
  }

  return (
    <div className="space-y-4">
      <div className="rounded-2xl bg-white p-6 shadow-sm space-y-3">
        <input
          type="text"
          value={caption}
          onChange={(e) => setCaption(e.target.value)}
          placeholder="Onderschrift (optioneel)"
          className="w-full rounded-lg border border-black/10 px-3 py-2 text-sm"
        />
        <div
          onDragOver={(e) => e.preventDefault()}
          onDrop={(e) => {
            e.preventDefault();
            const file = e.dataTransfer.files[0];
            if (file) handleFile(file);
          }}
          onClick={() => fileRef.current?.click()}
          className="rounded-xl border-2 border-dashed border-black/15 p-6 flex flex-col items-center justify-center gap-2 text-sm text-black/60 cursor-pointer hover:bg-black/[0.02]"
        >
          <Upload className="h-6 w-6" />
          <span>{pending ? 'Bezig…' : 'Sleep een foto hier of klik om te kiezen'}</span>
        </div>
        <input
          ref={fileRef}
          type="file"
          accept="image/jpeg,image/png,image/webp"
          className="hidden"
          onChange={(e) => {
            const file = e.target.files?.[0];
            if (file) handleFile(file);
          }}
        />
        {error && <p className="text-xs text-red-700" role="alert">{error}</p>}
      </div>

      <div className="grid grid-cols-3 sm:grid-cols-4 gap-3">
        {images.map((img) => (
          <div key={img.id} className="relative group">
            <div className="relative aspect-square rounded-xl overflow-hidden bg-black/5">
              <Image src={img.image_url} alt={img.caption ?? ''} fill sizes="200px" className="object-cover" />
            </div>
            <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition rounded-full bg-white/95 p-1 shadow">
              <DeleteButton
                action={async () => {
                  'use server';
                  await deleteBrandImageAction(img.id, img.image_url, brandId);
                }}
                confirmMessage="Foto verwijderen?"
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
```

Commit: `feat(admin): brand mood gallery uploader`

---

### Task 9: Specs + Decors editors

**Files:** `components/admin/SpecsEditor.tsx`, `components/admin/DecorsEditor.tsx`

**SpecsEditor.tsx** — UI om key-value pairs toe te voegen, value als string:

```tsx
'use client';

import { useState } from 'react';
import { Plus, X } from 'lucide-react';

type Props = {
  name: string; // form field name; will serialize JSON to hidden input
  defaultValue?: Record<string, string>;
};

export function SpecsEditor({ name, defaultValue = {} }: Props) {
  const [rows, setRows] = useState<Array<[string, string]>>(
    Object.entries(defaultValue),
  );

  const update = (i: number, key: 'k' | 'v', val: string) => {
    setRows((r) => {
      const copy = [...r];
      const [k, v] = copy[i];
      copy[i] = key === 'k' ? [val, v] : [k, val];
      return copy;
    });
  };

  const json = JSON.stringify(
    Object.fromEntries(rows.filter(([k]) => k.trim().length > 0)),
  );

  return (
    <div className="space-y-2">
      <input type="hidden" name={name} value={json} />
      {rows.map((row, i) => (
        <div key={i} className="flex gap-2 items-center">
          <input
            type="text"
            placeholder="Naam (bijv. Dikte)"
            value={row[0]}
            onChange={(e) => update(i, 'k', e.target.value)}
            className="flex-1 rounded-lg border border-black/10 px-3 py-2 text-sm"
          />
          <input
            type="text"
            placeholder="Waarde (bijv. 5 mm)"
            value={row[1]}
            onChange={(e) => update(i, 'v', e.target.value)}
            className="flex-1 rounded-lg border border-black/10 px-3 py-2 text-sm"
          />
          <button
            type="button"
            onClick={() => setRows((r) => r.filter((_, j) => j !== i))}
            className="text-black/40 hover:text-red-700"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      ))}
      <button
        type="button"
        onClick={() => setRows((r) => [...r, ['', '']])}
        className="text-xs text-[var(--color-brand-primary)] hover:underline inline-flex items-center gap-1"
      >
        <Plus className="h-3 w-3" /> Spec toevoegen
      </button>
    </div>
  );
}
```

**DecorsEditor.tsx** — list met name + image upload per decor:

```tsx
'use client';

import { useState, useRef } from 'react';
import Image from 'next/image';
import { Plus, X, Upload } from 'lucide-react';
import { uploadBrandImageAction } from '@/app/(admin)/admin/merken/actions';

type Decor = { name: string; image_url: string };

type Props = {
  name: string;
  defaultValue?: Decor[];
};

export function DecorsEditor({ name, defaultValue = [] }: Props) {
  const [decors, setDecors] = useState<Decor[]>(defaultValue);

  const json = JSON.stringify(decors.filter((d) => d.name.trim() && d.image_url));

  return (
    <div className="space-y-3">
      <input type="hidden" name={name} value={json} />
      {decors.map((d, i) => (
        <DecorRow
          key={i}
          decor={d}
          onChange={(updated) =>
            setDecors((curr) => curr.map((x, j) => (j === i ? updated : x)))
          }
          onRemove={() => setDecors((curr) => curr.filter((_, j) => j !== i))}
        />
      ))}
      <button
        type="button"
        onClick={() => setDecors((curr) => [...curr, { name: '', image_url: '' }])}
        className="text-xs text-[var(--color-brand-primary)] hover:underline inline-flex items-center gap-1"
      >
        <Plus className="h-3 w-3" /> Decor toevoegen
      </button>
    </div>
  );
}

function DecorRow({
  decor,
  onChange,
  onRemove,
}: {
  decor: Decor;
  onChange: (d: Decor) => void;
  onRemove: () => void;
}) {
  const [pending, setPending] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  async function handleFile(file: File) {
    setPending(true);
    try {
      const fd = new FormData();
      fd.append('file', file);
      const result = await uploadBrandImageAction(fd);
      if (result.url) onChange({ ...decor, image_url: result.url });
    } finally {
      setPending(false);
    }
  }

  return (
    <div className="flex gap-2 items-start rounded-lg border border-black/10 p-3">
      <div
        onClick={() => fileRef.current?.click()}
        className="relative h-16 w-16 shrink-0 rounded-lg bg-black/5 flex items-center justify-center cursor-pointer overflow-hidden"
      >
        {decor.image_url ? (
          <Image src={decor.image_url} alt="" fill sizes="64px" className="object-cover" />
        ) : (
          <Upload className="h-5 w-5 text-black/30" />
        )}
      </div>
      <input
        type="file"
        ref={fileRef}
        accept="image/jpeg,image/png,image/webp"
        className="hidden"
        onChange={(e) => {
          const f = e.target.files?.[0];
          if (f) handleFile(f);
        }}
      />
      <input
        type="text"
        placeholder="Decor-naam (bijv. Eiken Naturel)"
        value={decor.name}
        onChange={(e) => onChange({ ...decor, name: e.target.value })}
        className="flex-1 rounded-lg border border-black/10 px-3 py-2 text-sm"
      />
      <button
        type="button"
        onClick={onRemove}
        className="text-black/40 hover:text-red-700"
        disabled={pending}
      >
        <X className="h-4 w-4" />
      </button>
    </div>
  );
}
```

Commit: `feat(admin): SpecsEditor + DecorsEditor with inline image upload`

---

### Task 10: Product actions + form + pages

**Files:**
- `app/(admin)/admin/merken/[id]/producten/actions.ts`
- `app/(admin)/admin/merken/[id]/producten/nieuw/page.tsx`
- `app/(admin)/admin/merken/[id]/producten/[pid]/page.tsx`
- `components/admin/ProductForm.tsx` (Plan 5 — distinct from `/admin/projecten` ProjectForm)

**actions.ts:**

```ts
'use server';

import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { assertAdmin } from '@/lib/auth';
import { createClient } from '@/lib/supabase/server';
import { productUpsertSchema } from '@/lib/validation/admin-forms';
import { uploadImage } from '@/lib/storage/upload';

export type ProductState =
  | { status: 'idle' }
  | { status: 'success' }
  | { status: 'error'; message: string };

export async function uploadProductImageAction(formData: FormData) {
  await assertAdmin();
  const file = formData.get('file') as File | null;
  if (!file) return { error: 'Geen bestand' };
  try {
    const { url } = await uploadImage(file, 'site');
    return { url };
  } catch (e) {
    return { error: e instanceof Error ? e.message : 'Upload mislukt' };
  }
}

export async function upsertProductAction(
  _prev: ProductState,
  formData: FormData,
): Promise<ProductState> {
  await assertAdmin();

  let specs = {};
  try { specs = JSON.parse((formData.get('specs') as string) || '{}'); } catch {}
  let decors = [];
  try { decors = JSON.parse((formData.get('decors') as string) || '[]'); } catch {}

  const parsed = productUpsertSchema.safeParse({
    id: formData.get('id') || undefined,
    brand_id: formData.get('brand_id'),
    service_id: formData.get('service_id'),
    slug: formData.get('slug'),
    name: formData.get('name'),
    description: formData.get('description') || undefined,
    hero_image: formData.get('hero_image') || undefined,
    specs,
    decors,
    spec_sheet_url: formData.get('spec_sheet_url') || undefined,
    sort_order: formData.get('sort_order') || undefined,
    is_active: formData.get('is_active') === 'on',
  });
  if (!parsed.success) {
    return { status: 'error', message: parsed.error.issues[0].message };
  }

  const supabase = await createClient();
  const { id, brand_id, ...rest } = parsed.data;
  if (id) {
    const { error } = await supabase
      .from('products')
      .update({ ...rest, brand_id })
      .eq('id', id);
    if (error) return { status: 'error', message: error.message };
  } else {
    const { error } = await supabase
      .from('products')
      .insert({ ...rest, brand_id });
    if (error) return { status: 'error', message: error.message };
  }

  revalidatePath(`/admin/merken/${brand_id}`);
  revalidatePath('/merken');
  redirect(`/admin/merken/${brand_id}`);
}

export async function deleteProductAction(id: string, brandId: string) {
  await assertAdmin();
  const supabase = await createClient();
  const { error } = await supabase.from('products').delete().eq('id', id);
  if (error) throw new Error(error.message);
  revalidatePath(`/admin/merken/${brandId}`);
}
```

**ProductForm.tsx** — uses SpecsEditor + DecorsEditor + ImageUploader. Service dropdown gevuld via `getServices()` server-side, passed in als prop.

**nieuw + [pid] pages**: same pattern als bestaande nested patterns.

Commit: `feat(admin): product CRUD with specs and decors editors`

---

### Task 11: Sidebar + Brands list

**Files:**
- `components/admin/Sidebar.tsx` (modify — add Merken entry with Tag icon)
- `app/(admin)/admin/merken/page.tsx` (list)

Add to Sidebar NAV array (between Projecten and Gallery):

```tsx
{ href: '/admin/merken', label: 'Merken', icon: Tag },
```

Plus `import { Tag } from 'lucide-react';`.

**list page.tsx:**

Cards van active+inactive brands met logo, name, count of products, edit link, delete button.

Commit: `feat(admin): Merken sidebar nav + brands list page`

---

## Phase E: Public pages

### Task 12: /merken index page

**Files:** `app/(public)/merken/page.tsx`

```tsx
import type { Metadata } from 'next';
import Link from 'next/link';
import Image from 'next/image';
import { Container } from '@/components/ui/Container';
import { getActiveBrands } from '@/lib/db/brands';

export const metadata: Metadata = {
  title: 'Merken',
  description:
    'De merken die wij voeren — Sense, Joka, Douwes Dekker, Otium en meer.',
  alternates: {
    canonical: `${process.env.NEXT_PUBLIC_SITE_URL ?? 'https://bpmparket.nl'}/merken`,
  },
};

export default async function BrandsIndexPage() {
  const brands = await getActiveBrands();

  return (
    <Container className="py-16 md:py-24">
      <h1 className="heading-display text-4xl md:text-5xl">Onze merken</h1>
      <p className="mt-3 text-black/70 max-w-2xl">
        We werken alleen met merken waar we zelf in geloven. Hieronder vind je de
        merken waarvan we vloeren leveren en leggen.
      </p>

      {brands.length === 0 ? (
        <div className="mt-12 rounded-2xl border border-dashed border-black/10 p-12 text-center text-sm text-black/60">
          Brand-overzicht volgt binnenkort.
        </div>
      ) : (
        <div className="mt-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {brands.map((b) => (
            <Link
              key={b.id}
              href={`/merken/${b.slug}`}
              className="group block rounded-2xl bg-white p-6 shadow-sm hover:shadow-md transition"
            >
              {b.logo_url && (
                <div className="relative h-16 mb-4">
                  <Image src={b.logo_url} alt={b.name} fill sizes="200px" className="object-contain object-left" />
                </div>
              )}
              <h2 className="font-medium text-lg">{b.name}</h2>
              {b.description && (
                <p className="text-sm text-black/60 mt-1 line-clamp-2">
                  {b.description.replace(/[#*_]/g, '').slice(0, 120)}…
                </p>
              )}
            </Link>
          ))}
        </div>
      )}
    </Container>
  );
}
```

Commit: `feat(public): /merken index page`

---

### Task 13: /merken/[brand] detail page

**Files:**
- `app/(public)/merken/[brand]/page.tsx`
- `components/marketing/BrandHero.tsx`
- `components/marketing/ProductCard.tsx`

**BrandHero.tsx:**

```tsx
import Image from 'next/image';
import Link from 'next/link';
import { Button } from '@/components/ui/Button';
import { Container } from '@/components/ui/Container';
import { Markdown } from '@/components/marketing/Markdown';
import { ExternalLink } from 'lucide-react';
import type { Brand } from '@/lib/db/brands';

export function BrandHero({ brand }: { brand: Brand }) {
  return (
    <section className="relative bg-[var(--color-brand-charcoal)] text-white">
      {brand.hero_image && (
        <div className="absolute inset-0">
          <Image
            src={brand.hero_image}
            alt=""
            fill
            sizes="100vw"
            className="object-cover opacity-40"
            priority
          />
        </div>
      )}
      <Container className="relative py-16 md:py-24">
        {brand.logo_url && (
          <div className="relative h-12 w-48 mb-4">
            <Image
              src={brand.logo_url}
              alt={brand.name}
              fill
              sizes="200px"
              className="object-contain object-left brightness-0 invert"
            />
          </div>
        )}
        <h1 className="heading-display text-4xl md:text-5xl">{brand.name}</h1>
        {brand.description && (
          <div className="mt-4 max-w-2xl text-white/85 prose-invert">
            <Markdown>{brand.description}</Markdown>
          </div>
        )}
        <div className="mt-6 flex flex-wrap gap-3">
          <Button href={`/offerte?brand=${brand.slug}`}>
            Vraag offerte aan voor {brand.name}
          </Button>
          {brand.website_url && (
            <Link
              href={brand.website_url}
              target="_blank"
              rel="noopener noreferrer nofollow"
              className="inline-flex items-center gap-2 px-5 py-2.5 text-sm border border-white/20 rounded-full hover:bg-white/10"
            >
              Officiële website <ExternalLink className="h-4 w-4" />
            </Link>
          )}
        </div>
      </Container>
    </section>
  );
}
```

**ProductCard.tsx:**

```tsx
import Link from 'next/link';
import Image from 'next/image';
import type { Product } from '@/lib/db/products';
import type { Brand } from '@/lib/db/brands';

export function ProductCard({ product, brand }: { product: Product; brand: Brand }) {
  return (
    <Link
      href={`/merken/${brand.slug}/${product.slug}`}
      className="group block rounded-2xl overflow-hidden bg-white shadow-sm hover:shadow-md transition"
    >
      {product.hero_image && (
        <div className="relative aspect-[4/3]">
          <Image
            src={product.hero_image}
            alt={product.name}
            fill
            sizes="(max-width: 768px) 100vw, 33vw"
            className="object-cover group-hover:scale-105 transition-transform"
          />
        </div>
      )}
      <div className="p-4">
        <h3 className="font-medium">{product.name}</h3>
        {product.description && (
          <p className="text-sm text-black/60 mt-1 line-clamp-2">
            {product.description.replace(/[#*_]/g, '').slice(0, 100)}…
          </p>
        )}
      </div>
    </Link>
  );
}
```

**page.tsx:**

```tsx
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Image from 'next/image';
import { Container } from '@/components/ui/Container';
import { Button } from '@/components/ui/Button';
import { BrandHero } from '@/components/marketing/BrandHero';
import { ProductCard } from '@/components/marketing/ProductCard';
import {
  getBrandBySlug,
  getBrandImagesForBrand,
} from '@/lib/db/brands';
import { getProductsForBrand } from '@/lib/db/products';
import { getServices } from '@/lib/db/services';
import { StructuredData } from '@/components/marketing/StructuredData';
import { brandSchema } from '@/lib/seo';

type Props = { params: Promise<{ brand: string }> };

const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL || 'https://bpmparket.nl';

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { brand: slug } = await params;
  const brand = await getBrandBySlug(slug);
  return {
    title: brand?.name ?? 'Merk',
    description: brand?.description?.slice(0, 160) ?? undefined,
    alternates: { canonical: `${SITE_URL}/merken/${slug}` },
  };
}

export default async function BrandDetailPage({ params }: Props) {
  const { brand: slug } = await params;
  const brand = await getBrandBySlug(slug);
  if (!brand) notFound();

  const [images, products, services] = await Promise.all([
    getBrandImagesForBrand(brand.id),
    getProductsForBrand(brand.id),
    getServices(),
  ]);

  // Group products by service
  const byService: Record<string, typeof products> = {};
  const serviceById = new Map(services.map((s) => [s.id, s]));
  for (const p of products) {
    const sid = p.service_id;
    (byService[sid] ??= []).push(p);
  }

  return (
    <>
      <StructuredData schema={brandSchema(brand)} />

      <BrandHero brand={brand} />

      {images.length > 0 && (
        <Container className="py-12">
          <h2 className="heading-display text-2xl mb-6">Sfeerbeelden</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
            {images.map((img) => (
              <div key={img.id} className="relative aspect-square rounded-xl overflow-hidden bg-black/5">
                <Image src={img.image_url} alt={img.caption ?? ''} fill sizes="300px" className="object-cover" />
              </div>
            ))}
          </div>
        </Container>
      )}

      {Object.entries(byService).map(([sid, prods]) => {
        const service = serviceById.get(sid);
        if (!service) return null;
        return (
          <Container key={sid} className="py-12">
            <h2 className="heading-display text-2xl mb-6">
              {brand.name} {service.title.toLowerCase()}
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {prods.map((p) => (
                <ProductCard key={p.id} product={p} brand={brand} />
              ))}
            </div>
          </Container>
        );
      })}

      <section className="bg-[var(--color-brand-cream)] py-16">
        <Container className="text-center">
          <h2 className="heading-display text-2xl md:text-3xl">
            Geïnteresseerd in {brand.name}?
          </h2>
          <p className="mt-3 text-black/70">
            Plan een showroombezoek of vraag vrijblijvend een offerte aan.
          </p>
          <div className="mt-6 flex justify-center gap-3">
            <Button href={`/offerte?brand=${brand.slug}`}>Offerte aanvragen</Button>
            <Button href="/showroom" variant="outline">Plan showroombezoek</Button>
          </div>
        </Container>
      </section>
    </>
  );
}
```

Commit: `feat(public): /merken/[brand] detail page with grouped products + mood gallery`

---

### Task 14: /merken/[brand]/[product] detail page

**Files:**
- `app/(public)/merken/[brand]/[product]/page.tsx`
- `components/marketing/ProductSpecs.tsx`
- `components/marketing/DecorGrid.tsx`

**ProductSpecs.tsx:**

```tsx
type Props = {
  specs: Record<string, string>;
};

export function ProductSpecs({ specs }: Props) {
  const entries = Object.entries(specs);
  if (entries.length === 0) return null;
  return (
    <dl className="rounded-2xl bg-white p-6 shadow-sm divide-y divide-black/5">
      {entries.map(([key, value]) => (
        <div key={key} className="flex justify-between py-3 text-sm gap-4">
          <dt className="text-black/60">{key}</dt>
          <dd className="font-medium text-right">{value}</dd>
        </div>
      ))}
    </dl>
  );
}
```

**DecorGrid.tsx:**

```tsx
import Image from 'next/image';
import type { Decor } from '@/lib/db/products';

export function DecorGrid({ decors }: { decors: Decor[] }) {
  if (decors.length === 0) return null;
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
      {decors.map((d) => (
        <div key={d.name} className="text-center">
          <div className="relative aspect-square rounded-xl overflow-hidden bg-black/5">
            <Image
              src={d.image_url}
              alt={d.name}
              fill
              sizes="200px"
              className="object-cover"
            />
          </div>
          <p className="mt-2 text-xs">{d.name}</p>
        </div>
      ))}
    </div>
  );
}
```

**page.tsx:**

```tsx
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowLeft, Download } from 'lucide-react';
import { Container } from '@/components/ui/Container';
import { Button } from '@/components/ui/Button';
import { Markdown } from '@/components/marketing/Markdown';
import { ProductSpecs } from '@/components/marketing/ProductSpecs';
import { DecorGrid } from '@/components/marketing/DecorGrid';
import { StructuredData } from '@/components/marketing/StructuredData';
import { getBrandBySlug } from '@/lib/db/brands';
import { getProductBySlugs } from '@/lib/db/products';
import { productSchema } from '@/lib/seo';

type Props = { params: Promise<{ brand: string; product: string }> };

const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL || 'https://bpmparket.nl';

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { brand: brandSlug, product: productSlug } = await params;
  const product = await getProductBySlugs(brandSlug, productSlug);
  const brand = await getBrandBySlug(brandSlug);
  return {
    title: product ? `${brand?.name ?? ''} ${product.name}`.trim() : 'Product',
    description: product?.description?.slice(0, 160) ?? undefined,
    alternates: {
      canonical: `${SITE_URL}/merken/${brandSlug}/${productSlug}`,
    },
  };
}

export default async function ProductDetailPage({ params }: Props) {
  const { brand: brandSlug, product: productSlug } = await params;
  const [brand, product] = await Promise.all([
    getBrandBySlug(brandSlug),
    getProductBySlugs(brandSlug, productSlug),
  ]);
  if (!brand || !product) notFound();

  return (
    <>
      <StructuredData schema={productSchema(product, brand)} />

      <Container className="py-8">
        <Link
          href={`/merken/${brand.slug}`}
          className="inline-flex items-center gap-2 text-sm text-black/60 hover:text-black"
        >
          <ArrowLeft className="h-4 w-4" /> Alle {brand.name} producten
        </Link>
      </Container>

      <Container className="grid grid-cols-1 lg:grid-cols-2 gap-12 pb-12">
        {product.hero_image && (
          <div className="relative aspect-[4/3] rounded-2xl overflow-hidden">
            <Image
              src={product.hero_image}
              alt={product.name}
              fill
              sizes="(max-width: 1024px) 100vw, 50vw"
              className="object-cover"
              priority
            />
          </div>
        )}
        <div>
          <p className="text-sm text-[var(--color-brand-primary)]">{brand.name}</p>
          <h1 className="heading-display text-3xl md:text-4xl mt-1">{product.name}</h1>
          {product.description && (
            <div className="mt-4 prose prose-stone max-w-none">
              <Markdown>{product.description}</Markdown>
            </div>
          )}

          <div className="mt-6 flex flex-wrap gap-3">
            <Button href={`/offerte?brand=${brand.slug}&product=${product.slug}`}>
              Vraag offerte aan
            </Button>
            <Button href="/showroom" variant="outline">Bezoek showroom</Button>
            {product.spec_sheet_url && (
              <Link
                href={product.spec_sheet_url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-5 py-2.5 text-sm hover:underline"
              >
                <Download className="h-4 w-4" /> Productblad PDF
              </Link>
            )}
          </div>
        </div>
      </Container>

      {Object.keys(product.specs).length > 0 && (
        <Container size="narrow" className="py-12">
          <h2 className="heading-display text-2xl mb-6">Specificaties</h2>
          <ProductSpecs specs={product.specs} />
        </Container>
      )}

      {product.decors.length > 0 && (
        <Container className="py-12">
          <h2 className="heading-display text-2xl mb-6">Kleuren & decors</h2>
          <DecorGrid decors={product.decors} />
          <p className="text-xs text-black/50 mt-4">
            Kom langs in de showroom om alle decors in het echt te bekijken.
          </p>
        </Container>
      )}

      {product.gallery_image_urls.length > 0 && (
        <Container className="py-12">
          <h2 className="heading-display text-2xl mb-6">In gebruik</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {product.gallery_image_urls.map((url, i) => (
              <div key={i} className="relative aspect-[4/3] rounded-xl overflow-hidden bg-black/5">
                <Image src={url} alt="" fill sizes="400px" className="object-cover" />
              </div>
            ))}
          </div>
        </Container>
      )}
    </>
  );
}
```

Commit: `feat(public): /merken/[brand]/[product] detail page`

---

### Task 15: Brand cards section on service pages

**Files:**
- `components/marketing/BrandCards.tsx`
- Modify each `app/(public)/<service>/page.tsx`

**BrandCards.tsx:**

```tsx
import Link from 'next/link';
import Image from 'next/image';
import { Container } from '@/components/ui/Container';
import { getBrandsByService } from '@/lib/db/brands';

export async function BrandCards({ serviceSlug }: { serviceSlug: string }) {
  const brands = await getBrandsByService(serviceSlug);
  if (brands.length === 0) return null;

  return (
    <Container className="py-12 md:py-16 border-t border-black/5 mt-12">
      <h2 className="heading-display text-2xl md:text-3xl">
        Merken die we voor deze categorie voeren
      </h2>
      <p className="mt-2 text-sm text-black/60">
        Bekijk de collectie per merk.
      </p>
      <div className="mt-6 grid grid-cols-2 md:grid-cols-4 gap-4">
        {brands.map((b) => (
          <Link
            key={b.id}
            href={`/merken/${b.slug}`}
            className="group block rounded-2xl bg-white p-5 shadow-sm hover:shadow-md transition"
          >
            {b.logo_url && (
              <div className="relative h-12 mb-3">
                <Image src={b.logo_url} alt={b.name} fill sizes="160px" className="object-contain object-left" />
              </div>
            )}
            <p className="font-medium text-sm">{b.name}</p>
          </Link>
        ))}
      </div>
    </Container>
  );
}
```

**Modify each service page** (6 files: pvc-vloeren, traditioneel-parket, multiplanken, laminaat, traprenovatie, schuren-onderhoud) — append `<BrandCards serviceSlug={SLUG} />` after `<ServicePage>`:

```tsx
import { BrandCards } from '@/components/marketing/BrandCards';

// inside the JSX, after <ServicePage>:
<BrandCards serviceSlug={SLUG} />
```

Commit: `feat(public): brand cards section on all 6 service pages`

---

## Phase F: Navbar + LeadForm

### Task 16: Navbar Variant 2b (Merken mega menu)

**Files:** `components/layout/Navbar.tsx` (modify)

Add second mega menu state + links. Read existing file first; add:

1. New state: `const [brandsMegaOpen, setBrandsMegaOpen] = useState(false);`
2. New nav button "Merken" with hover handler that fetches/uses cached brand list
3. Mega menu render block similar to Diensten one
4. Fetch top 4-6 brands at server level — make Navbar a server component? Currently it's `'use client'`. To get SSR-safe: pass brands list as a prop from a small server-component wrapper.

**Recommended pattern:** Create `components/layout/NavbarServer.tsx` (RSC) that fetches top brands and passes to existing client `<Navbar>`:

```tsx
// components/layout/NavbarServer.tsx
import { getActiveBrands } from '@/lib/db/brands';
import { Navbar } from './Navbar';

export async function NavbarServer() {
  const brands = (await getActiveBrands()).slice(0, 4);
  return <Navbar brands={brands} />;
}
```

Then `app/(public)/layout.tsx` uses `<NavbarServer />` instead of `<Navbar />`.

Modify `Navbar` to accept `brands: Brand[]` prop and render the second mega menu using it.

Commit: `feat(layout): Merken mega menu (Variant 2b) with brand logos`

---

### Task 17: /api/brands/by-service route

**Files:** `app/api/brands/by-service/route.ts`

```ts
import { NextResponse, type NextRequest } from 'next/server';
import { z } from 'zod';
import { createClient } from '@/lib/supabase/server';

const querySchema = z.object({
  service: z.string().min(1).max(100),
});

export async function GET(req: NextRequest) {
  const url = new URL(req.url);
  const parsed = querySchema.safeParse({ service: url.searchParams.get('service') });
  if (!parsed.success) {
    return NextResponse.json({ error: 'Invalid query' }, { status: 400 });
  }

  const supabase = await createClient();
  const { data: service } = await supabase
    .from('services')
    .select('id')
    .eq('slug', parsed.data.service)
    .maybeSingle();
  if (!service) return NextResponse.json({ brands: [] });

  // Fetch all active products for this service, plus their brand info
  const { data: products } = await supabase
    .from('products')
    .select('id, slug, name, brand_id, brands!inner(id, slug, name, is_active)')
    .eq('service_id', service.id)
    .eq('is_active', true)
    .eq('brands.is_active', true)
    .order('sort_order');

  // Group by brand
  type ProductRow = {
    id: string;
    slug: string;
    name: string;
    brand_id: string;
    brands: { id: string; slug: string; name: string; is_active: boolean } | null;
  };
  const brandMap = new Map<
    string,
    { id: string; slug: string; name: string; products: Array<{ id: string; slug: string; name: string }> }
  >();
  for (const row of (products ?? []) as ProductRow[]) {
    if (!row.brands) continue;
    const brand = brandMap.get(row.brand_id) ?? {
      id: row.brands.id,
      slug: row.brands.slug,
      name: row.brands.name,
      products: [],
    };
    brand.products.push({ id: row.id, slug: row.slug, name: row.name });
    brandMap.set(row.brand_id, brand);
  }

  return NextResponse.json({ brands: Array.from(brandMap.values()) });
}
```

Commit: `feat(api): /api/brands/by-service for LeadForm cascade`

---

### Task 18: LeadForm cascade

**Files:**
- `components/forms/LeadForm.tsx` (modify)
- `lib/validation/forms.ts` (modify — accept brand_id + product_id)
- `actions/leads.ts` (modify — insert brand_id + product_id)
- `lib/analytics.ts` (modify — accept brand + product in event)

**lib/validation/forms.ts** — extend leadSchema:

```ts
// Replace existing leadSchema with:
export const leadSchema = z.object({
  name: z.string().min(2, 'Naam is verplicht').max(100),
  email: z.string().email('Ongeldig emailadres').max(200),
  phone: z.string().min(10).max(20).regex(/^[0-9 +()-]+$/, '...'),
  floor_type: z.string().max(50).optional(),
  area_size: z.coerce.number().int().min(0).max(10000).optional(),
  message: z.string().max(2000).optional(),
  source: z.string().max(50),
  brand_id: z.string().uuid().optional(),
  product_id: z.string().uuid().optional(),
  website: z.string().max(0).optional(),
});
```

**actions/leads.ts** — accept + persist new fields:

In the `safeParse({...})` block, add:
```ts
brand_id: formData.get('brand_id') || undefined,
product_id: formData.get('product_id') || undefined,
```

In the `insertLead({...})` call, add:
```ts
brand_id: parsed.data.brand_id,
product_id: parsed.data.product_id,
```

(`lib/db/leads.ts` `LeadInsert` type also needs `brand_id?: string; product_id?: string;` added.)

**lib/analytics.ts** — extend event union:

```ts
type ConversionEvent =
  | { name: 'lead_submit'; source: string; brand?: string; product?: string }
  | ...
```

**LeadForm.tsx** — add cascade:

```tsx
'use client';

import { useActionState, useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { createLeadAction, type CreateLeadState } from '@/actions/leads';
import { trackConversion } from '@/lib/analytics';

const initialState: CreateLeadState = { status: 'idle' };

const FLOOR_TYPES = [
  { value: '', label: 'Kies type', service_slug: '' },
  { value: 'pvc', label: 'PVC', service_slug: 'pvc-vloeren' },
  { value: 'parket', label: 'Parket', service_slug: 'traditioneel-parket' },
  { value: 'multiplanken', label: 'Multiplanken', service_slug: 'multiplanken' },
  { value: 'laminaat', label: 'Laminaat', service_slug: 'laminaat' },
  { value: 'traprenovatie', label: 'Traprenovatie', service_slug: 'traprenovatie' },
  { value: 'schuren', label: 'Schuren / onderhoud', service_slug: 'schuren-onderhoud' },
  { value: 'anders', label: 'Anders / weet ik nog niet', service_slug: '' },
];

type BrandOpt = { id: string; slug: string; name: string; products: Array<{ id: string; slug: string; name: string }> };

type Props = { source: string; floorType?: string; defaultMessage?: string };

export function LeadForm({ source, floorType = '', defaultMessage = '' }: Props) {
  const [state, formAction, pending] = useActionState(createLeadAction, initialState);
  const searchParams = useSearchParams();

  // Cascade state
  const [selectedFloor, setSelectedFloor] = useState(floorType);
  const [brands, setBrands] = useState<BrandOpt[]>([]);
  const [brandSlug, setBrandSlug] = useState(searchParams.get('brand') ?? '');
  const [productSlug, setProductSlug] = useState(searchParams.get('product') ?? '');

  const floorEntry = FLOOR_TYPES.find((f) => f.value === selectedFloor);
  const serviceSlug = floorEntry?.service_slug ?? '';

  useEffect(() => {
    if (!serviceSlug) { setBrands([]); return; }
    fetch(`/api/brands/by-service?service=${serviceSlug}`)
      .then((r) => r.json())
      .then((data: { brands: BrandOpt[] }) => setBrands(data.brands))
      .catch(() => setBrands([]));
  }, [serviceSlug]);

  // Reset brand/product when floor changes (unless URL-prefilled)
  useEffect(() => {
    if (searchParams.get('brand')) return; // keep prefill
    setBrandSlug('');
    setProductSlug('');
  }, [selectedFloor, searchParams]);

  const selectedBrand = brands.find((b) => b.slug === brandSlug);

  // Conversion tracking
  useEffect(() => {
    if (state.status === 'success') {
      trackConversion({
        name: 'lead_submit',
        source,
        brand: brandSlug || undefined,
        product: productSlug || undefined,
      });
    }
  }, [state.status, source, brandSlug, productSlug]);

  if (state.status === 'success') {
    return (
      <div className="rounded-xl bg-green-50 border border-green-200 p-6 text-sm text-green-900">
        <p className="font-medium">Bedankt voor je aanvraag!</p>
        <p className="mt-1">We nemen binnen 24 uur contact op.</p>
      </div>
    );
  }

  return (
    <form action={formAction} className="space-y-3">
      <input type="text" name="website" tabIndex={-1} autoComplete="off"
        className="absolute opacity-0 -left-[9999px] h-0 w-0" aria-hidden="true" />
      <input type="hidden" name="source" value={source} />
      {/* Hidden fields for brand_id/product_id resolved from slug */}
      <input
        type="hidden"
        name="brand_id"
        value={selectedBrand?.id ?? ''}
      />
      <input
        type="hidden"
        name="product_id"
        value={selectedBrand?.products.find((p) => p.slug === productSlug)?.id ?? ''}
      />

      <label className="block">
        <span className="text-sm font-medium">Naam</span>
        <input type="text" name="name" required autoComplete="name"
          className="mt-1 w-full rounded-lg border border-black/10 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-brand-primary)]" />
      </label>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <label className="block">
          <span className="text-sm font-medium">Email</span>
          <input type="email" name="email" required autoComplete="email"
            className="mt-1 w-full rounded-lg border border-black/10 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-brand-primary)]" />
        </label>
        <label className="block">
          <span className="text-sm font-medium">Telefoon</span>
          <input type="tel" name="phone" required autoComplete="tel"
            className="mt-1 w-full rounded-lg border border-black/10 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-brand-primary)]" />
        </label>
      </div>

      <label className="block">
        <span className="text-sm font-medium">Type vloer</span>
        <select
          name="floor_type"
          value={selectedFloor}
          onChange={(e) => setSelectedFloor(e.target.value)}
          className="mt-1 w-full rounded-lg border border-black/10 px-3 py-2 text-sm bg-white"
        >
          {FLOOR_TYPES.map((t) => (
            <option key={t.value} value={t.value}>{t.label}</option>
          ))}
        </select>
      </label>

      {brands.length > 0 && (
        <label className="block">
          <span className="text-sm font-medium">Merkvoorkeur (optioneel)</span>
          <select
            value={brandSlug}
            onChange={(e) => {
              setBrandSlug(e.target.value);
              setProductSlug('');
            }}
            className="mt-1 w-full rounded-lg border border-black/10 px-3 py-2 text-sm bg-white"
          >
            <option value="">Weet ik nog niet</option>
            {brands.map((b) => (
              <option key={b.slug} value={b.slug}>{b.name}</option>
            ))}
          </select>
        </label>
      )}

      {selectedBrand && selectedBrand.products.length > 0 && (
        <label className="block">
          <span className="text-sm font-medium">Product-lijn (optioneel)</span>
          <select
            value={productSlug}
            onChange={(e) => setProductSlug(e.target.value)}
            className="mt-1 w-full rounded-lg border border-black/10 px-3 py-2 text-sm bg-white"
          >
            <option value="">Weet ik nog niet</option>
            {selectedBrand.products.map((p) => (
              <option key={p.slug} value={p.slug}>{p.name}</option>
            ))}
          </select>
        </label>
      )}

      <label className="block">
        <span className="text-sm font-medium">Oppervlak (m²)</span>
        <input type="number" name="area_size" min={0}
          className="mt-1 w-full rounded-lg border border-black/10 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-brand-primary)]" />
      </label>

      <label className="block">
        <span className="text-sm font-medium">Bericht</span>
        <textarea name="message" rows={3} defaultValue={defaultMessage}
          className="mt-1 w-full rounded-lg border border-black/10 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-brand-primary)]" />
      </label>

      {state.status === 'error' && (
        <p role="alert" className="text-sm text-red-700">{state.message}</p>
      )}

      <button type="submit" disabled={pending}
        className="w-full rounded-lg bg-[var(--color-brand-primary)] px-4 py-2.5 text-sm font-medium text-white disabled:opacity-50">
        {pending ? 'Versturen…' : 'Verstuur aanvraag'}
      </button>
    </form>
  );
}
```

Commit: `feat(forms): LeadForm cascade type→brand→product with URL prefill`

---

## Phase G: SEO + admin lead detail update

### Task 19: Brand + Product Schema.org generators

**Files:** `lib/seo.ts` (extend)

```ts
import type { Brand } from '@/lib/db/brands';
import type { Product } from '@/lib/db/products';

export function brandSchema(brand: Brand) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Brand',
    name: brand.name,
    url: `${SITE_URL}/merken/${brand.slug}`,
    logo: brand.logo_url ?? undefined,
    description: brand.description ?? undefined,
  };
}

export function productSchema(product: Product, brand: Brand) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: product.name,
    description: product.description ?? undefined,
    image: product.hero_image ? [product.hero_image, ...product.gallery_image_urls] : product.gallery_image_urls,
    brand: { '@type': 'Brand', name: brand.name },
    url: `${SITE_URL}/merken/${brand.slug}/${product.slug}`,
    offers: {
      '@type': 'Offer',
      availability: 'https://schema.org/InStock',
      priceCurrency: 'EUR',
      price: '0',
      // No public price; placeholder for Schema.org compliance.
      // Real pricing happens in showroom — Schema doesn't allow null price.
    },
  };
}
```

(Note on `price: '0'`: Schema.org Product/Offer requires a price. Setting 0 keeps Schema valid without misleading users. Google may show "Price not set" — acceptable for showroom-driven business.)

Commit: `feat(seo): brand + product Schema.org generators`

---

### Task 20: Sitemap update

**Files:** `app/sitemap.ts` (modify)

Add inside the function:

```ts
const { data: brands } = await supabase.from('brands').select('slug, updated_at').eq('is_active', true);
const { data: products } = await supabase.from('products').select('slug, updated_at, brands!inner(slug, is_active)').eq('is_active', true).eq('brands.is_active', true);

const brandRoutes: MetadataRoute.Sitemap = (brands ?? []).map((b) => ({
  url: `${SITE_URL}/merken/${b.slug}`,
  lastModified: new Date(b.updated_at),
  changeFrequency: 'monthly' as const,
  priority: 0.8,
}));

const productRoutes: MetadataRoute.Sitemap = (products ?? []).map((p) => ({
  url: `${SITE_URL}/merken/${(p.brands as unknown as { slug: string }).slug}/${p.slug}`,
  lastModified: new Date(p.updated_at),
  changeFrequency: 'monthly' as const,
  priority: 0.7,
}));

return [...staticRoutes, ...serviceRoutes, ...projectRoutes, ...brandRoutes, ...productRoutes];
```

Add `/merken` itself to staticRoutes:
```ts
{ url: `${SITE_URL}/merken`, changeFrequency: 'weekly', priority: 0.85 },
```

Commit: `feat(seo): sitemap includes /merken + brand + product URLs`

---

### Task 21: Admin lead detail update

**Files:** `app/(admin)/admin/leads/[id]/page.tsx` (modify)

Update the lead fetch to also resolve brand + product names:

```ts
const { data: lead } = await supabase
  .from('leads')
  .select('*, brand:brands(slug, name), product:products(slug, name)')
  .eq('id', id)
  .maybeSingle();
```

In the JSX "Aanvraag" section, add after `{lead.floor_type}` block:

```tsx
{lead.brand && (
  <div>
    <dt className="text-black/50 text-xs">Merkvoorkeur</dt>
    <dd>
      <Link href={`/admin/merken/${lead.brand_id}`} className="hover:underline">
        {lead.brand.name}
      </Link>
    </dd>
  </div>
)}
{lead.product && lead.brand && (
  <div>
    <dt className="text-black/50 text-xs">Product-lijn</dt>
    <dd>
      <Link
        href={`/admin/merken/${lead.brand_id}/producten/${lead.product_id}`}
        className="hover:underline"
      >
        {lead.product.name}
      </Link>
    </dd>
  </div>
)}
```

Commit: `feat(admin): lead detail shows brand + product with deep links`

---

## Phase H: Build + Data Acquisition

### Task 22: Final build + smoke test

```bash
cd ../bpm-parket-next-migration
npm run typecheck && npm run build
```

Expected routes added:
- `/merken` (static or dynamic)
- `/merken/[brand]` (dynamic)
- `/merken/[brand]/[product]` (dynamic)
- `/admin/merken` + nested
- `/api/brands/by-service`

Smoke test (after seed in Task 23):
```bash
PORT=3030 npm run dev &
sleep 8
curl -s -o /dev/null -w "/merken %{http_code}\n" http://localhost:3030/merken
curl -s -o /dev/null -w "/merken/joka %{http_code}\n" http://localhost:3030/merken/joka
curl -s http://localhost:3030/sitemap.xml | grep -c '<loc>'
pkill -f "next dev"
```

Commit: `chore: Plan 5 build verified`

---

### Task 23: Data acquisition + seed

**Files:** `supabase/migrations/20260505120200_brands_seed.sql`

Workflow:

1. **Sense**: locate official URL via Google. Likely PVC-only brand of a Dutch wholesaler. Find logo + 3-5 mood photos + product line photos. Paraphrase brand description.

2. **Joka**: joka.de or NL portal. Focus on Lijn 350 (and 340 if available). Specs: thickness, click/glue, suitable for underfloor heating, wear class. Decors: pick ~10 representative.

3. **Douwes Dekker**: douwesdekker.nl. Both PVC and laminaat collecties — find their main product lines, paraphrase descriptions, fetch images.

4. **Otium**: otiumvloeren.nl or via plintenenprofielencentrale.nl portal (if accessible). Both PVC + laminate.

For each:
- Use `WebFetch` tool for descriptions/specs (paraphrase, don't copy verbatim)
- Use `Bash` (`curl -o`) to download representative images
- Upload via Supabase MCP `apply_migration` with INSERT statements that include image URLs already uploaded to Supabase Storage via the existing pipeline

Image upload script (one-off):

```ts
// scripts/seed-brand-images.ts
import { config } from 'dotenv';
config({ path: '.env.local' });
import { readFile } from 'node:fs/promises';
import { createClient } from '@supabase/supabase-js';
import sharp from 'sharp';
import { createHash } from 'node:crypto';

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const SERVICE_ROLE = process.env.SUPABASE_SERVICE_ROLE_KEY!;
const supabase = createClient(SUPABASE_URL, SERVICE_ROLE);

async function uploadLocal(filepath: string, folder: string): Promise<string> {
  const buffer = await readFile(filepath);
  const processed = await sharp(buffer)
    .rotate()
    .resize({ width: 1920, withoutEnlargement: true })
    .webp({ quality: 85 })
    .toBuffer();
  const hash = createHash('sha256').update(processed).digest('hex').slice(0, 16);
  const path = `${folder}/${hash}.webp`;
  await supabase.storage.from('media').upload(path, processed, {
    contentType: 'image/webp',
    upsert: true,
  });
  return supabase.storage.from('media').getPublicUrl(path).data.publicUrl;
}

// Walk a downloads folder + upload, log resulting URLs
// Usage: tsx scripts/seed-brand-images.ts ./downloads/joka site/brands/joka
const [, , localDir, folder] = process.argv;
// ...glob through localDir, upload each, print mapping
```

After uploads, gather URLs and write the seed migration:

```sql
-- Brands
INSERT INTO brands (slug, name, logo_url, hero_image, description, internal_notes, website_url, sort_order) VALUES
  ('sense', 'Sense', '<storage url>', '<storage url>',
   E'## Sense...\n\n...', 'Source: ...', 'https://...', 1),
  ('joka', 'Joka', '...', '...', E'## Joka...', 'Via Jordan vloeren', 'https://www.joka.de', 2),
  ('douwes-dekker', 'Douwes Dekker', '...', '...', E'## Douwes Dekker...', 'Via plintenenprofielencentrale.nl', 'https://www.douwesdekker.nl', 3),
  ('otium', 'Otium', '...', '...', E'## Otium...', 'Via plintenenprofielencentrale.nl', 'https://...', 4)
ON CONFLICT (slug) DO UPDATE SET
  name = EXCLUDED.name, ..., updated_at = now();

-- Products (one per brand × service combo)
WITH s AS (SELECT id, slug FROM services), b AS (SELECT id, slug FROM brands)
INSERT INTO products (brand_id, service_id, slug, name, description, hero_image, specs, decors, sort_order) VALUES
  ((SELECT id FROM b WHERE slug = 'joka'),
   (SELECT id FROM s WHERE slug = 'pvc-vloeren'),
   'lijn-350', 'PVC Lijn 350',
   E'## Joka Lijn 350...',
   '<storage url>',
   '{"Dikte":"5 mm","Click of lijm":"Click","Vloerverwarming":"Geschikt","Slijtklasse":"33","Afmeting":"1220 × 180 mm"}'::jsonb,
   '[{"name":"Eiken Naturel","image_url":"..."}, ...]'::jsonb,
   1),
  -- ... more products
ON CONFLICT (brand_id, slug) DO UPDATE SET
  name = EXCLUDED.name, ..., updated_at = now();

-- Brand mood images
INSERT INTO brand_images (brand_id, image_url, caption, sort_order) VALUES
  ((SELECT id FROM brands WHERE slug = 'joka'), '<storage url>', NULL, 1),
  -- ... 3-5 per brand
;
```

Apply via Supabase MCP `apply_migration` with name `brands_seed_v1`.

Commit: `feat(db): seed initial 4 brands with product lines + mood photos`

---

### Task 24: Final smoke test + push

```bash
cd ../bpm-parket-next-migration
npm run typecheck && npm run build
PORT=3030 npm run dev &
sleep 7
# verify pages render with seeded data
/usr/bin/curl -s http://localhost:3030/merken | grep -c "<a href=\"/merken/"
/usr/bin/curl -s http://localhost:3030/merken/joka | grep -c "Lijn 350"
/usr/bin/curl -s http://localhost:3030/merken/joka/lijn-350 | grep -c "Specificaties"
/usr/bin/curl -s http://localhost:3030/pvc-vloeren | grep -c "Merken die we"
pkill -f "next dev"

git push
```

Commit: `chore: Plan 5 closeout — brands feature live with seeded data`

---

## Self-Review Notes

**Spec coverage:**
- ✅ Sectie 3 (data model) — Tasks 1, 2 (schema + RLS)
- ✅ Sectie 4 (URL structure) — Tasks 12, 13, 14
- ✅ Sectie 5 (Navbar Variant 2b) — Task 16
- ✅ Sectie 6, 7 (page layouts) — Tasks 13, 14
- ✅ Sectie 8 (LeadForm cascade + URL prefill) — Tasks 17, 18
- ✅ Sectie 9 (conversion tracking) — Task 18
- ✅ Sectie 10 (Schema.org) — Task 19
- ✅ Sectie 11 (admin) — Tasks 6-11
- ✅ Sectie 12 (data acquisition) — Task 23
- ✅ Sectie 13 (implementation order) — phases A-H
- ✅ Sectie 14 (vibe-security) — assertAdmin in every action, internal_notes via SELECT-projection
- ✅ Sectie 15 open questions — addressed in Task 23 (Sense URL research, Lijn 340 included)

**Placeholder scan:** No "TBD" / "TODO". One nuance noted explicitly: Schema.org Product/Offer `price: '0'` to satisfy schema validation (real prices not public).

**Type consistency:**
- `Brand`, `Product`, `BrandImage`, `Decor`, `BrandWithInternals` types defined once in `lib/db/*` and reused everywhere
- Validation schemas (`brandUpsertSchema`, `productUpsertSchema`) align with insert/update payloads
- `BrandState`, `ProductState` consistent with existing `LeadState` pattern
- ConversionEvent extended (not replaced) so existing call sites unaffected
- Cascade in LeadForm: brand_id and product_id resolved from slug to UUID via brand-list cache — IDs match between client form and DB FK

**Open handoff items:**
- Bodhi's image input: if any wholesaler-only assets exist that I can't find publicly, Bodhi adds via `/admin/merken` after launch
- Sense URL: documented as research-time discovery; if not found, Sense brand goes in with logo + name + mood photos only (no website link)
- Spec sheets PDF: optional per product, only if publicly available

**Estimated execution time:** 4-6 working days
- Code (Phases A-G, Tasks 1-21): ~3 days
- Build + smoke (Task 22): ~0.5 day
- Data acquisition + seed (Task 23): ~1.5-2 days
- Final smoke + push (Task 24): ~0.25 day
