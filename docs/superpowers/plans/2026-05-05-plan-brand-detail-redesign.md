# Plan: Brand Detail Page Redesign

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Vervang de huidige `/merken/[brand]` pagina door een 7-secties layout matching Bodhi's gewenste screenshot (Rivièra Maison Flooring stijl), maar met BPM Parket Vite styling: brand-red palette + Outfit, donkere hero, inline product specs, peer-brand sectie per service. Geen schema wijziging, geen nieuwe DB-velden.

**Architecture:** Pure compositie-laag. Bestaande RSC pagina wordt opnieuw samengesteld uit 7 nieuwe sub-components in `components/marketing/brand/`. Eén nieuwe DB helper (`getPeerBrandsByServiceId`). Alle data komt uit bestaande tabellen (`brands`, `products`, `brand_images`, `services`). De product detail pagina (`/merken/[brand]/[product]`) blijft ongewijzigd.

**Tech Stack:** Next.js 16 RSC, Tailwind v4 met Vite tokens (brand-red `#E21E26`, brand-dark `#2D2D2D`, brand-sand `#B6A699`), lucide-react (al geïnstalleerd), next/image.

**Spec reference:** [docs/superpowers/specs/2026-05-05-brand-detail-redesign-design.md](../specs/2026-05-05-brand-detail-redesign-design.md)

**Plan 5 outputs this plan builds on:**
- `brands`, `products`, `brand_images`, `services` tables met seeded data
- `lib/db/brands.ts`, `lib/db/products.ts`, `lib/db/services.ts` fetchers
- `lib/seo.ts` `brandSchema()` JSON-LD
- Vite design tokens in [app/globals.css](../../../app/globals.css)
- `vite-design-port` branch met 1:1 Vite port

**Working directory:** Worktree at `/Users/martijnvervoort/Desktop/Code/bpm-parket-next-migration` op `vite-design-port` branch (of nieuwe sub-branch).

---

## File structure (new/changed)

```
components/marketing/brand/
  BrandHeroSection.tsx               CREATE  (donkere hero met framed visual + logo card)
  ProductGridCard.tsx                CREATE  (productkaart met inline specs table)
  MoodGalleryStrip.tsx               CREATE  (4-col horizontale sfeerbeelden rij)
  PortfolioCTASection.tsx            CREATE  (Bekijk Projecten teaser)
  TrustBadgesSection.tsx             CREATE  (4 hardcoded garanties)
  PeerBrandsSection.tsx              CREATE  (Andere merken in [service])
  BrandCTASection.tsx                CREATE  (donkere eind-CTA)
lib/db/brands.ts                     MODIFY  (add getPeerBrandsByServiceId)
app/(public)/merken/[brand]/page.tsx REWRITE (compositie van 7 nieuwe secties)
components/marketing/BrandHero.tsx   DELETE  (vervangen door BrandHeroSection)
```

**Niet aanraken:**
- `components/marketing/ProductCard.tsx` (nog gebruikt op andere plekken — laat staan)
- `components/marketing/ProductSpecs.tsx` (op product detail page)
- `components/marketing/DecorGrid.tsx` (op product detail page)
- `app/(public)/merken/[brand]/[product]/page.tsx`
- `app/(public)/merken/page.tsx`
- Alle service pagina's en hun BrandCards

---

## Phase A: DB helper

### Task 1: Add getPeerBrandsByServiceId

**Files:** [lib/db/brands.ts](../../../lib/db/brands.ts) (MODIFY)

Voeg helper toe die voor een gegeven brand_id + service_id alle andere active brands teruggeeft die in diezelfde service producten hebben. Cache met `react.cache`.

- [ ] Append helper aan `lib/db/brands.ts`:

```ts
export const getPeerBrandsByServiceId = cache(
  async (excludeBrandId: string, serviceId: string): Promise<Brand[]> => {
    const supabase = await createClient();
    const { data: products } = await supabase
      .from('products')
      .select('brand_id')
      .eq('service_id', serviceId)
      .eq('is_active', true);
    const brandIds = [
      ...new Set((products ?? []).map((p) => p.brand_id)),
    ].filter((id) => id !== excludeBrandId);
    if (brandIds.length === 0) return [];

    const { data, error } = await supabase
      .from('brands')
      .select(PUBLIC_FIELDS)
      .in('id', brandIds)
      .eq('is_active', true)
      .order('sort_order');
    if (error) throw error;
    return data ?? [];
  },
);
```

- [ ] Verify build: `cd /Users/martijnvervoort/Desktop/Code/bpm-parket-next-migration && pnpm tsc --noEmit`

---

## Phase B: Sub-components

> **Convention voor alle sub-components:**
> - RSC by default (geen `'use client'`) tenzij interactie nodig is — geen hook hier
> - Imports: next/image, next/link, lucide-react, types uit `@/lib/db/brands` en `@/lib/db/products`
> - Tailwind utility classes met Vite tokens (`bg-brand-red`, `text-brand-dark`, etc.)
> - Containers: `max-w-7xl mx-auto px-6 sm:px-8 lg:px-12` (consistent met Footer)
> - Section padding: `py-20` of `py-24` (consistent met Vite ritme)
> - Reveal animations: laat weg in deze versie (toevoegen later als nodig — RSC zonder useEffect)

### Task 2: BrandHeroSection

**Files:** `components/marketing/brand/BrandHeroSection.tsx` (CREATE)

Donkere hero (bg-black) met links breadcrumb + service-tags + brand naam (groot Outfit) + description + 2 CTAs (Offerte rood / Showroom outline white). Rechts: framed lifestyle-foto (eerste `brand_images[0]`) met logo-kaart bovenop OF brand-naam fallback in display typografie.

**Props:**
```ts
type Props = {
  brand: Brand;
  serviceTags: { slug: string; title: string }[];
  heroVisualUrl: string | null;  // brand_images[0].image_url ?? null
};
```

- [ ] Layout grid `lg:grid-cols-2 gap-12 items-center`, `min-h-[600px]`
- [ ] Background: `bg-black` met optionele subtiele overlay van `brand.hero_image` (background-image + opacity-20)
- [ ] Breadcrumb: `Home / Merken / {brand.name}` als `text-xs text-white/50 uppercase tracking-widest`
- [ ] Service-tags: kleine pills `bg-white/10 text-white/80 px-3 py-1 rounded-full text-xs`
- [ ] Brand naam: `text-5xl md:text-7xl font-bold text-white tracking-tight`, optioneel laatste woord in `text-brand-sand` accent
- [ ] Description: `text-lg text-white/70 max-w-xl mt-6`
- [ ] CTAs:
  - Primary: `bg-brand-red text-white px-8 py-4 rounded-full font-bold hover:bg-brand-red/90` met `Offerte aanvragen` linkend naar `/offerte?brand=${brand.slug}`
  - Secondary: `border border-white/30 text-white px-8 py-4 rounded-full font-bold hover:bg-white hover:text-black` met `Plan showroombezoek` linkend naar `/showroom`
- [ ] Right side:
  - Als `heroVisualUrl`: `<Image>` in `aspect-[4/5] rounded-2xl overflow-hidden` met `object-cover`
  - Logo card overlay (top-right of bottom-left): `bg-white p-6 rounded-2xl shadow-xl` met `<Image src={brand.logo_url}>` of fallback `<span class="text-2xl font-bold text-black">{brand.name}</span>`
  - Als geen `heroVisualUrl`: hele right side wordt grote logo-card / brand-naam display (`text-6xl font-bold text-white/30`)
- [ ] No `'use client'`
- [ ] Verify build

---

### Task 3: ProductGridCard

**Files:** `components/marketing/brand/ProductGridCard.tsx` (CREATE)

Productkaart met foto bovenin, titel, omschrijving, en inline specs-tabel. Klikbaar (Link) naar `/merken/{brand.slug}/{product.slug}`.

**Props:**
```ts
type Props = {
  product: Product;
  brandSlug: string;
};
```

- [ ] Wrap in `<Link href={`/merken/${brandSlug}/${product.slug}`} className="group block">`
- [ ] Foto: `relative aspect-[4/3] rounded-2xl overflow-hidden bg-brand-light` met `<Image src={product.hero_image} fill className="object-cover transition-transform group-hover:scale-105">` (fallback: gallery_image_urls[0] of placeholder grijs vlak)
- [ ] Titel: `text-2xl font-bold text-brand-dark mt-6 tracking-tight`
- [ ] Omschrijving: `text-sm text-brand-dark/70 mt-2 line-clamp-3`
- [ ] Specs section:
  - Heading: `text-xs font-bold uppercase tracking-widest text-brand-red mt-6 mb-3`: `Specificaties`
  - Tabel: `<dl>` grid met `grid-cols-[auto_1fr] gap-x-4 gap-y-2 text-sm`
  - Per spec: `<dt className="text-brand-dark/60">{key}</dt><dd className="text-brand-dark font-medium">{value}</dd>`
  - Iterate `Object.entries(product.specs).slice(0, 8)`; als `Object.keys(product.specs).length > 8`, toon `+ {count - 8} meer specs` als kleine link
- [ ] Geen visible "Bekijk meer" knop — kaart is volledig klikbaar
- [ ] No `'use client'`
- [ ] Verify build

---

### Task 4: MoodGalleryStrip

**Files:** `components/marketing/brand/MoodGalleryStrip.tsx` (CREATE)

4-kolom horizontale rij van `brand_images`. Tag "Inspiratie" (kleine rode badge) + heading "Sfeerbeelden".

**Props:**
```ts
type Props = {
  brandName: string;
  images: BrandImage[];
};
```

- [ ] Section `bg-white py-20`
- [ ] Container `max-w-7xl`
- [ ] Tag-pill: `inline-block bg-brand-red/10 text-brand-red text-xs font-bold uppercase tracking-widest px-3 py-1 rounded-full`: `Inspiratie`
- [ ] Heading: `text-4xl md:text-5xl font-bold text-brand-dark mt-4 tracking-tight`: `Sfeerbeelden`
- [ ] Optionele sub: `text-base text-brand-dark/60 mt-3 max-w-2xl`: `Zo komt {brandName} tot leven in een Nederlands interieur.`
- [ ] Grid `grid grid-cols-2 md:grid-cols-4 gap-4 mt-12`
- [ ] Per image: `aspect-[4/5] rounded-2xl overflow-hidden` met `<Image fill object-cover>`
- [ ] Limiteer tot eerste 4 of 8 (sla `images[0]` over als die als hero visual gebruikt is — maar pragmatic: pak gewoon eerste 4)
- [ ] Render niets (return null) als `images.length === 0`
- [ ] No `'use client'`
- [ ] Verify build

---

### Task 5: PortfolioCTASection

**Files:** `components/marketing/brand/PortfolioCTASection.tsx` (CREATE)

Tag "Portfolio" + heading + paragraaf + CTA naar `/projecten`.

**Props:**
```ts
type Props = { brandName: string };
```

- [ ] Section `bg-brand-light py-24`
- [ ] Container, `text-center max-w-3xl mx-auto`
- [ ] Tag: `Portfolio` (zelfde stijl als Mood)
- [ ] Heading: `Zie {brandName} in echte woningen` — `text-4xl md:text-5xl font-bold text-brand-dark`
- [ ] Description: `Bekijk onze afgeronde projecten waar {brandName} vloeren zijn gelegd.` — `text-lg text-brand-dark/70 mt-4`
- [ ] CTA button: `<Link href="/projecten" className="inline-flex items-center bg-brand-dark text-white px-8 py-4 rounded-full font-bold mt-8 hover:bg-black">Bekijk Projecten <ArrowRight className="ml-2 w-5 h-5" /></Link>`
- [ ] No `'use client'`
- [ ] Verify build

---

### Task 6: TrustBadgesSection

**Files:** `components/marketing/brand/TrustBadgesSection.tsx` (CREATE)

Sectie met tag `Waarom {brandName}` + heading + 4 hardcoded badges.

**Props:**
```ts
type Props = { brandName: string };
```

Badges (lucide icons):
- `Wrench` — Vakkundige montage — `Onze eigen vakmensen leggen elke vloer met aandacht`
- `MessageCircle` — Gratis advies — `Geen verkooppraat, gewoon eerlijk inhoudelijk advies`
- `Store` — Showroom bezichtigen — `Voel en zie {brandName} in onze Geldropse showroom`
- `BadgePercent` — Scherpe prijzen — `Direct van importeur, geen tussenhandel marge`

- [ ] Section `bg-white py-24`
- [ ] Tag-pill: `Waarom {brandName}` (rood, zelfde stijl)
- [ ] Heading: `Kwaliteit die u kunt vertrouwen` — `text-4xl md:text-5xl font-bold text-brand-dark`
- [ ] Grid `grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mt-16`
- [ ] Per badge: card `p-8 rounded-2xl border border-brand-dark/10 hover:shadow-lg transition-shadow`
  - Icon: `w-12 h-12 text-brand-red mb-6`
  - Label: `text-xl font-bold text-brand-dark`
  - Description: `text-sm text-brand-dark/60 mt-2`
- [ ] Beschrijvingen mogen brand-naam injecteren waar `{brandName}` staat
- [ ] No `'use client'`
- [ ] Verify build

---

### Task 7: PeerBrandsSection

**Files:** `components/marketing/brand/PeerBrandsSection.tsx` (CREATE)

Per service waarin het brand producten heeft, één sectie met `Andere merken in {service.title}` heading + grid met logo-cards van peer brands.

**Props:**
```ts
type Props = {
  serviceTitle: string;
  serviceSlug: string;
  brands: Brand[];  // peer brands (excl. current)
};
```

- [ ] Render niets (return null) als `brands.length === 0`
- [ ] Section `bg-brand-light py-24`
- [ ] Container, heading-row `flex justify-between items-end`:
  - Left: tag `Ontdek meer` + heading `Andere merken in {serviceTitle}` (`text-3xl md:text-4xl font-bold`)
  - Right: `<Link href={`/${serviceSlug}`} className="hidden md:inline-flex items-center text-brand-red font-bold hover:underline">Bekijk alle <ArrowRight className="ml-1 w-4 h-4" /></Link>`
- [ ] Grid: `grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 mt-12`
- [ ] Per peer brand: `<Link href={`/merken/${b.slug}`} className="group bg-white rounded-2xl p-8 flex items-center justify-center aspect-square hover:shadow-lg transition-shadow">`
  - Als `b.logo_url`: `<Image src={b.logo_url} alt={b.name} width={120} height={60} className="object-contain max-h-16 group-hover:scale-105 transition-transform" />`
  - Anders: `<span className="text-xl font-bold text-brand-dark">{b.name}</span>`
- [ ] No `'use client'`
- [ ] Verify build

---

### Task 8: BrandCTASection

**Files:** `components/marketing/brand/BrandCTASection.tsx` (CREATE)

Donkere eind-CTA matchend Footer kleur (bg-black).

**Props:**
```ts
type Props = { brandName: string; brandSlug: string };
```

- [ ] Section `bg-black text-white py-24`
- [ ] Container `text-center max-w-3xl mx-auto`
- [ ] Heading: `Interesse in {brandName}?` — `text-4xl md:text-6xl font-bold tracking-tight`
- [ ] Sub: `text-lg text-white/70 mt-6`: `Plan een vrijblijvend showroombezoek of vraag direct een offerte aan.`
- [ ] CTAs `flex flex-col sm:flex-row gap-4 justify-center mt-10`:
  - Primary: `bg-brand-red text-white px-8 py-4 rounded-full font-bold hover:bg-brand-red/90` → `/offerte?brand=${brandSlug}` — `Offerte aanvragen`
  - Secondary: `border border-white/30 text-white px-8 py-4 rounded-full font-bold hover:bg-white hover:text-black` → `/showroom` — `Plan showroombezoek`
- [ ] No `'use client'`
- [ ] Verify build

---

## Phase C: Compose page

### Task 9: Rewrite brand detail page

**Files:** [app/(public)/merken/[brand]/page.tsx](../../../app/(public)/merken/[brand]/page.tsx) (REWRITE)

Vervang volledig door compositie van de 7 nieuwe secties. Behoudt: `generateMetadata`, `notFound()`, `StructuredData` met `brandSchema`.

- [ ] Vervang file met:

```tsx
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { StructuredData } from '@/components/marketing/StructuredData';
import { BrandHeroSection } from '@/components/marketing/brand/BrandHeroSection';
import { ProductGridCard } from '@/components/marketing/brand/ProductGridCard';
import { MoodGalleryStrip } from '@/components/marketing/brand/MoodGalleryStrip';
import { PortfolioCTASection } from '@/components/marketing/brand/PortfolioCTASection';
import { TrustBadgesSection } from '@/components/marketing/brand/TrustBadgesSection';
import { PeerBrandsSection } from '@/components/marketing/brand/PeerBrandsSection';
import { BrandCTASection } from '@/components/marketing/brand/BrandCTASection';
import {
  getBrandBySlug,
  getBrandImagesForBrand,
  getPeerBrandsByServiceId,
} from '@/lib/db/brands';
import { getProductsForBrand } from '@/lib/db/products';
import { getServices } from '@/lib/db/services';
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

  const serviceById = new Map(services.map((s) => [s.id, s]));

  // Unique services this brand sells in (preserve sort order from services list)
  const brandServiceIds = [...new Set(products.map((p) => p.service_id))];
  const brandServices = brandServiceIds
    .map((id) => serviceById.get(id))
    .filter((s): s is NonNullable<typeof s> => Boolean(s));

  // Peer brands per service (parallel)
  const peerBrandsByService = await Promise.all(
    brandServices.map(async (s) => ({
      service: s,
      peers: await getPeerBrandsByServiceId(brand.id, s.id),
    })),
  );

  const heroVisualUrl = images[0]?.image_url ?? null;
  const moodImages = images.length > 1 ? images.slice(1, 5) : images.slice(0, 4);

  return (
    <>
      <StructuredData schema={brandSchema(brand)} />

      <BrandHeroSection
        brand={brand}
        serviceTags={brandServices.map((s) => ({ slug: s.slug, title: s.title }))}
        heroVisualUrl={heroVisualUrl}
      />

      {products.length > 0 && (
        <section className="bg-white py-24">
          <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
            <h2 className="text-4xl md:text-5xl font-bold text-brand-dark tracking-tight">
              {brand.name} <span className="text-brand-red">producten</span>
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10 mt-16">
              {products.map((p) => (
                <ProductGridCard key={p.id} product={p} brandSlug={brand.slug} />
              ))}
            </div>
          </div>
        </section>
      )}

      <MoodGalleryStrip brandName={brand.name} images={moodImages} />

      <PortfolioCTASection brandName={brand.name} />

      <TrustBadgesSection brandName={brand.name} />

      {peerBrandsByService.map(({ service, peers }) => (
        <PeerBrandsSection
          key={service.id}
          serviceTitle={service.title}
          serviceSlug={service.slug}
          brands={peers}
        />
      ))}

      <BrandCTASection brandName={brand.name} brandSlug={brand.slug} />
    </>
  );
}
```

- [ ] Verify imports resolve, `cd /Users/martijnvervoort/Desktop/Code/bpm-parket-next-migration && pnpm tsc --noEmit`

---

### Task 10: Delete obsolete BrandHero

**Files:** [components/marketing/BrandHero.tsx](../../../components/marketing/BrandHero.tsx) (DELETE)

- [ ] Confirm no imports left: `grep -r "from '@/components/marketing/BrandHero'" --include='*.tsx' --include='*.ts' /Users/martijnvervoort/Desktop/Code/bpm-parket-next-migration` — should return geen resultaten meer (alleen de oude page.tsx had dit; die hebben we vervangen)
- [ ] Delete file
- [ ] Run `pnpm tsc --noEmit` to confirm

---

## Phase D: Build + Smoke + Push

### Task 11: Build verification

- [ ] `cd /Users/martijnvervoort/Desktop/Code/bpm-parket-next-migration && pnpm build` — must pass clean
- [ ] Check no warnings about missing keys, unsafe Image src, etc.
- [ ] Output sizes: brand detail page should still be RSC (no "client-bundle" entry voor deze route)

---

### Task 12: Smoke test in browser

- [ ] `pnpm dev` op port 3030 (of beschikbaar)
- [ ] Visit `/merken/sense` — single-service brand (alleen PVC). Check:
  - Hero met framed visual + logo card
  - Service tag toont "PVC Vloeren"
  - Producten grid toont alle Sense producten met inline specs
  - Sfeerbeelden grid renders (4 thumbnails)
  - Portfolio CTA toont
  - Trust badges 4 cards
  - **Eén** PeerBrandsSection: "Andere merken in PVC Vloeren" met Joka, Otium, Douwes Dekker logos
  - Donkere eind-CTA met 2 knoppen
- [ ] Visit `/merken/douwes-dekker` — multi-service brand. Check:
  - Service tags toont meerdere (PVC + Laminaat)
  - **Twee** PeerBrandsSections: "Andere merken in PVC Vloeren" + "Andere merken in Laminaat"
- [ ] Visit `/merken/joka` (single PVC), `/merken/otium` (multi)
- [ ] Klik op een product card → moet routen naar `/merken/{brand}/{product}` zonder fout (bestaande detail page)
- [ ] Klik op een peer brand logo → moet routen naar die brand's detail page
- [ ] Klik op CTA Offerte → `/offerte?brand={slug}`
- [ ] Klik op CTA Showroom → `/showroom`
- [ ] Test responsive: mobile (375px), tablet (768px), desktop (1280px+)
- [ ] Verify donkere hero is leesbaar, brand-red CTAs duidelijk zichtbaar

---

### Task 13: Commit + push

- [ ] `git status` — verwacht: 7 nieuwe components, 1 deleted (BrandHero), 1 modified (page.tsx), 1 modified (lib/db/brands.ts)
- [ ] `git add components/marketing/brand/ app/\(public\)/merken/\[brand\]/page.tsx lib/db/brands.ts`
- [ ] `git rm components/marketing/BrandHero.tsx`
- [ ] Commit:

```
feat: redesign brand detail page (7-section layout per Bodhi screenshot)

Replace single-block layout with hero, products+specs grid, mood strip,
portfolio CTA, trust badges, peer-brands-per-service, dark closing CTA.
Uses BPM Parket Vite palette (brand-red, brand-dark, Outfit). No DB
schema change — peer brands derived live via new
getPeerBrandsByServiceId helper.

Spec: docs/superpowers/specs/2026-05-05-brand-detail-redesign-design.md
```

- [ ] `git push origin vite-design-port`

---

## Out of scope (do NOT do)

- Schema wijziging
- Admin UI wijziging
- Wijziging aan `/merken` index of `/merken/[brand]/[product]` detail pages
- Wijziging aan service pagina BrandCards
- Reveal animations / scroll observers (keep RSC simple — kan later)
- "PREMIUM MERK" handmatige badge (Optie C goedgekeurd)
- Right-side fallback met geforceerde placeholder (Joka/Sense zonder hero_image: gebruik brand-naam als display typografie, geen broken state)

---

## Estimated work

- 7 nieuwe components × ~80-150 regels = ~700 regels
- 1 page rewrite (~100 regels)
- 1 helper toevoeging (~25 regels)
- ~825 regels netto, geen dependencies, geen migrations

**Tijd: 2-3 uur in subagent-driven flow.**
