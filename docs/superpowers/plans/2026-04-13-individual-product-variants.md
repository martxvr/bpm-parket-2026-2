# Individual Product Variants Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace collection-level product entries in `brands.ts` with individual dessin/colorway entries — each with its own image URL and full specs — matching the pattern already used by Rivièra Maison Flooring.

**Architecture:** Each dessin is scraped from the brand's website to obtain its CDN image URL and exact specs. The data is written directly into `src/data/brands.ts` as individual `BrandProduct` entries under the relevant brand. No new files, no new types — the existing `BrandProduct` shape already supports everything we need.

**Tech Stack:** TypeScript data file (`src/data/brands.ts`), web scraping via WebFetch, external image URLs (Invictus CDN + hetvloerenmagazijn.nl CDN).

---

## Scope

| Brand | Collections | Dessins | Estimated entries |
|---|---|---|---|
| Invictus Maximus Dryback | 1 | 26 | 26 |
| Invictus Maximus Click | 1 | 19 | 19 |
| Invictus Maximus Looselay | 1 | 6 | 6 |
| Invictus Primus Dryback | 1 | 9 | 9 |
| Invictus Primus Click | 1 | 9 | 9 |
| Castell | Premium + Supreme | ~15 key SKUs | 15 |
| **Total** | | | **~84** |

> Castell has 50+ SKUs total but most are color variants of the same dessin. We add the ~15 most representative ones (one per distinct dessin name).

---

## Reference: BrandProduct type

```typescript
// src/data/brands.ts
export type BrandProduct = {
  name: string;       // e.g. "Riverside Oak – Sunshine"
  slug: string;       // e.g. "riverside-oak-sunshine"
  description: string;
  imageUrl?: string;  // CDN URL or local /images/... path
  specs: Record<string, string>;
};
```

## Reference: Rivièra Maison pattern (follow this exactly)

```typescript
{
  name: 'Long Beach Sand',
  slug: 'long-beach-sand',
  description: 'De warme, zandkleurige tinten ...',
  imageUrl: '/images/brands/riviera-maison/long-beach-sand.webp',
  specs: {
    'Longboard': '1524 × 230 mm',
    'Visgraat': '770 × 154 mm',
    'Dikte': '2,5 mm',
    'Topslijtlaag': '0,55 mm + 2 keramische laklagen',
    'Legsysteem': 'Dryback (verlijmd)',
    'Vloerverwarming': 'Ja',
    'Gebruiksklasse': '23/33'
  }
}
```

## Reference: Invictus product page URL pattern

Individual product pages follow this pattern:
```
https://invictus.eu/en/lvt-[collection]-[dessin-slug]-[color-slug]
```
Examples:
- `https://invictus.eu/en/lvt-maximus-silkoak-oat`
- `https://invictus.eu/en/lvt-maximus-riversideoak-sunshine`
- `https://invictus.eu/en/lvt-primus-saxonoak-fuego`

Image URLs on each page are in the form:
```
https://invictus.eu/-/media/foundation/products/product-shots/w_[code]/[code]_32.ashx?mh=280&h=280&w=280
```

---

## Task 1: Scrape Invictus Maximus Dryback (26 dessins)

**Files:**
- Modify: `src/data/brands.ts` — replace Maximus Dryback single entry with 26 individual BrandProduct entries

**Dessins to scrape** (name → URL slug → color):
```
Riverside Oak – Sunshine       → lvt-maximus-riversideoak-sunshine
Belrose Oak – Truffle          → lvt-maximus-belroseoak-truffle
Belrose Oak Herringbone – Truffle → lvt-maximus-belroseoak-herringbone-truffle
Sienna Oak – Authentique       → lvt-maximus-siennaoak-authentique
Regency Oak – Scone            → lvt-maximus-regencyoak-scone
Premium Oak – Ecru             → lvt-maximus-premiumoak-ecru
Velvet Oak – Celeste           → lvt-maximus-velvetoak-celeste
Velvet Oak Parquet             → lvt-maximus-velvetoak-parquet (check URL)
Victorian Treasure – Smoke     → lvt-maximus-victoriantreasure-smoke
Divine Oak – Champagne         → lvt-maximus-divineoak-champagne
Divine Oak Herringbone – Pure  → lvt-maximus-divineoak-herringbone-pure
Highland Oak Herringbone – Classic → lvt-maximus-highlandoak-herringbone-classic
Highland Oak Parquet – Sunrise → lvt-maximus-highlandoak-parquet-sunrise
New England Oak Parquet – Sand → lvt-maximus-newenglandoak-parquet-sand
Groovy Granite – Alabaster     → lvt-maximus-groovygranite-alabaster
(+ remaining 11 from full list on invictus.eu/en/products)
```

- [ ] **Step 1: Scrape all Maximus Dryback product pages**

  Use WebFetch on each URL above. For each page extract:
  - Full image URL (`/-/media/foundation/products/product-shots/...`)
  - Exact dimensions shown on the page
  - Any additional color names for the same dessin

  Alternatively, scrape the collection overview page first:
  ```
  https://invictus.eu/en/products?collection=maximus&installationtype=dryback
  ```
  This lists all 26 products with thumbnails and links in one request.

- [ ] **Step 2: Build BrandProduct entries**

  For each dessin, write one entry following this pattern:
  ```typescript
  {
    name: 'Riverside Oak – Sunshine',
    slug: 'maximus-dryback-riverside-oak-sunshine',
    description: 'Warme eikenhouttint in Sunshine-kleurstelling. Verkrijgbaar als plank (228×1500mm). Geschikt voor wonen en intensief projectgebruik.',
    imageUrl: 'https://invictus.eu/-/media/foundation/products/product-shots/w_[code]/[code]_32.ashx?h=280&w=280',
    specs: {
      'Collectie': 'Maximus Dryback',
      'Afmeting': '228 × 1500 mm',
      'Topslijtlaag': '0,55 mm + Scratchmaster®',
      'Installatie': 'Dryback (verlijmd)',
      'Geluidsisolatie': '3 dB',
      'Waterbestendig': 'Ja',
      'Vloerverwarming': 'Ja',
      'Garantie wonen': '25 jaar',
      'Garantie project': '15 jaar',
    }
  },
  ```

- [ ] **Step 3: Replace single Maximus Dryback entry in brands.ts**

  Find the existing entry (around line 674) and replace with the 26 individual entries.

- [ ] **Step 4: Verify TypeScript compiles**

  ```bash
  npx tsc --noEmit
  ```
  Expected: no errors.

- [ ] **Step 5: Commit**

  ```bash
  git add src/data/brands.ts
  git commit -m "feat: add 26 individual Invictus Maximus Dryback dessin variants with images"
  ```

---

## Task 2: Scrape Invictus Maximus Click (19 dessins)

**Files:**
- Modify: `src/data/brands.ts` — replace Maximus Click entry with 19 individual entries

**Dessins:**
```
Riverside Oak – Sunshine   (225×1500mm)
Divine Oak – Pure          (145×743mm)
Belrose Oak – Truffle      (241×1518mm)
Silk Oak – Latte           (228×1210mm)
Nativa – Sandshell         (450×907mm)
Regency Oak – Scone        (241×1518mm)
Premium Oak – Ecru         (225×1500mm)
Tropical Forest – Havana   (228×1210mm)
Velvet Oak – Celeste       (177×1210mm)
Groovy Granite – Alabaster (467×908mm)
Hudson Stone – Silver      (450×907mm)
French Oak – Polar         (178×1213mm)
Concrete Crush – Smoke     (298×603mm)
Cosmopolitan – Golden Cream (406×806mm)
Highland Oak – Classic     (145×743mm)
(+ 4 more from full product list)
```

- [ ] **Step 1: Scrape collection overview**

  ```
  https://invictus.eu/en/products?collection=maximus&installationtype=click
  ```
  Extract all 19 product image URLs and their page URLs.

- [ ] **Step 2: Build 19 BrandProduct entries**

  Same pattern as Task 1. Shared specs for all Maximus Click entries:
  ```typescript
  specs: {
    'Collectie': 'Maximus Click',
    'Topslijtlaag': '0,55 mm + Scratchmaster®',
    'Installatie': 'Rigid Click',
    'Geluidsisolatie': '20 dB',
    'Waterbestendig': 'Ja',
    'Vloerverwarming': 'Ja',
    'Garantie wonen': '25 jaar',
    'Garantie project': '15 jaar',
  }
  ```
  Add `'Afmeting'` per dessin from scrape results.

- [ ] **Step 3: Replace Maximus Click entry in brands.ts**

- [ ] **Step 4: `npx tsc --noEmit`**

- [ ] **Step 5: Commit**

  ```bash
  git commit -m "feat: add 19 individual Invictus Maximus Click dessin variants with images"
  ```

---

## Task 3: Scrape Invictus Maximus Looselay (6 dessins)

**Files:**
- Modify: `src/data/brands.ts` — replace Maximus Looselay entry with 6 individual entries

**Dessins:**
```
Cashmere Oak – Sunny      (229×1219mm)
Divine Oak – Champagne    (229×1219mm)
Manhattan – Sky           (457×914mm)
Nativa – Moon             (457×914mm)
Premium Oak – Flax        (229×1219mm)
Tropical Forest – Havana  (229×1219mm)
```

- [ ] **Step 1: Scrape**

  ```
  https://invictus.eu/en/products?collection=maximus&installationtype=looselay
  ```

- [ ] **Step 2: Build 6 BrandProduct entries**

  Shared specs:
  ```typescript
  specs: {
    'Collectie': 'Maximus Looselay',
    'Topslijtlaag': '0,55 mm + Scratchmaster®',
    'Installatie': 'Loose Lay (losleg)',
    'Geluidsisolatie': '7 dB',
    'Waterbestendig': 'Ja',
    'Vloerverwarming': 'Ja',
    'Garantie wonen': '25 jaar',
    'Garantie project': '15 jaar',
  }
  ```

- [ ] **Step 3: Replace entry, tsc check, commit**

  ```bash
  git commit -m "feat: add 6 individual Invictus Maximus Looselay dessin variants with images"
  ```

---

## Task 4: Scrape Invictus Primus Dryback (9 dessins)

**Files:**
- Modify: `src/data/brands.ts`

**Dessins:**
```
Saxon Oak – Fuego      (228×1500mm)
Sherwood Oak – Natural (178×1219mm)
Royal Oak – Blonde     (178×1219mm)
York Stone – Powder    (305×610mm)
Cashmere Oak – Beach   (228×1500mm)
Bourbon Oak – Granola  (178×1219mm)
Manhattan – Sky        (457×914mm)
Pure Marble – Snow     (457×914mm)
Riviera Oak – Caramel  (178×1219mm)
```

- [ ] **Step 1: Scrape**

  ```
  https://invictus.eu/en/products?collection=primus&installationtype=dryback
  ```

- [ ] **Step 2: Build 9 entries**

  Shared specs:
  ```typescript
  specs: {
    'Collectie': 'Primus Dryback',
    'Topslijtlaag': '0,30 mm + Scratchmaster®',
    'Installatie': 'Dryback (verlijmd)',
    'Geluidsisolatie': '3 dB',
    'Waterbestendig': 'Ja',
    'Vloerverwarming': 'Ja',
    'Garantie wonen': '20 jaar',
    'Garantie project': '10 jaar',
  }
  ```

- [ ] **Step 3: Replace, tsc, commit**

  ```bash
  git commit -m "feat: add 9 individual Invictus Primus Dryback dessin variants with images"
  ```

---

## Task 5: Scrape Invictus Primus Click (9 dessins)

**Files:**
- Modify: `src/data/brands.ts`

**Dessins:**
```
Manhattan – Sky        (450×907mm)
Riviera Oak – Caramel  (177×1210mm)
Pure Marble – Snow     (450×907mm)
Sherwood Oak – Natural (177×1210mm)
Bourbon Oak – Granola  (177×1210mm)
Royal Oak – Blonde     (181×1213mm)
Cashmere Oak – Beach   (225×1500mm)
Saxon Oak – Fuego      (225×1500mm)
York Stone – Powder    (309×603mm)
```

- [ ] **Step 1: Scrape**

  ```
  https://invictus.eu/en/products?collection=primus&installationtype=click
  ```

- [ ] **Step 2: Build 9 entries**

  Shared specs:
  ```typescript
  specs: {
    'Collectie': 'Primus Click',
    'Topslijtlaag': '0,30 mm + Scratchmaster®',
    'Installatie': 'Rigid Click',
    'Geluidsisolatie': '17 dB',
    'Waterbestendig': 'Ja',
    'Vloerverwarming': 'Ja',
    'Garantie wonen': '20 jaar',
    'Garantie project': '10 jaar',
  }
  ```

- [ ] **Step 3: Replace, tsc, commit**

  ```bash
  git commit -m "feat: add 9 individual Invictus Primus Click dessin variants with images"
  ```

---

## Task 6: Scrape Castell individual SKUs (~15 key dessins)

**Files:**
- Modify: `src/data/brands.ts` — replace 3 Castell series entries with ~15 individual dessin entries

**Source:** `https://hetvloerenmagazijn.nl/merk/castell/`

**Target dessins** (one entry per distinct dessin name, picking the most representative colorway):
```
Premium – Ranch              (Plank XL Dryback)
Premium – Silk Oat           (Plank XL Dryback)
Premium – Caramel (Plank)    (Plank XL Dryback)
Premium – Visgraat 8017      (Visgraat XL Dryback)
Premium – Quartet            (Visgraat XL Dryback)
Supreme – Caramel (Walvisgraat) (Herringbone XL Dryback)
Supreme – Walnut             (Herringbone XL Dryback)
Supreme – Mokka              (Herringbone XL Dryback)
Supreme – Coffee             (Herringbone XL Dryback)
Supreme – Sienna             (Herringbone XL Dryback)
Premium 876 – Chatillon Ginger (Walvisgraat Dryback)
(+ any others found during scrape)
```

- [ ] **Step 1: Scrape Castell product pages**

  Fetch `https://hetvloerenmagazijn.nl/merk/castell/` — extract all product image URLs, names, and dimensions listed. Product image URLs will be in WordPress media CDN format.

- [ ] **Step 2: Build BrandProduct entries**

  Pattern for each dessin:
  ```typescript
  {
    name: 'Supreme – Caramel Walvisgraat',
    slug: 'castell-supreme-caramel-walvisgraat',
    description: 'Luxe walvisgraat PVC in kleur Caramel (232). Ultra matte 0,70 mm toplaag met EIR reliëf. Verlijmd leggen.',
    imageUrl: 'https://hetvloerenmagazijn.nl/wp-content/uploads/...', // from scrape
    specs: {
      'Serie': 'Castell Supreme',
      'Kleur': 'Caramel (232)',
      'Patroon': 'Walvisgraat (Herringbone XL)',
      'Topslijtlaag': '0,70 mm',
      'Legsysteem': 'Dryback (verlijmd)',
      'Technologie': 'EIR',
      'Milieu': 'Ftalaat-vrij',
      'Garantie': 'Minimaal 10 jaar',
    }
  },
  ```

- [ ] **Step 3: Replace 3 Castell series entries with individual dessin entries**

- [ ] **Step 4: `npx tsc --noEmit`**

- [ ] **Step 5: Commit**

  ```bash
  git commit -m "feat: add ~15 individual Castell dessin variants with images and specs"
  ```

---

## Task 7: Final verification

- [ ] **Step 1: Check all imageUrls load**

  Start dev server and navigate to `/producten/pvc-vloeren`. Click each brand. Verify product images render correctly (no broken images).

  ```bash
  npm run dev
  ```

- [ ] **Step 2: Check brand product count displays correctly**

  The product count shown in the UI should reflect individual dessins, not collections.

- [ ] **Step 3: Final commit & push**

  ```bash
  git add src/data/brands.ts
  git commit -m "feat: individual product variants complete for Invictus and Castell"
  git push origin main
  ```

---

## Notes & risks

- **Invictus image URLs** use `.ashx` dynamic handlers — these are stable CDN paths tied to their CMS. They should remain valid long-term, but if Invictus rebuilds their site the URLs may break. Mitigation: download images locally at implementation time.
- **Castell images** come from a third-party dealer site (hetvloerenmagazijn.nl) — these are less stable. Prefer downloading and hosting locally at `/images/brands/castell/[slug].webp`.
- **Scope**: ~84 entries is significant data work. Tasks 1–5 (Invictus) take roughly 2–3 hours of agent scraping + data entry. Task 6 (Castell) takes ~45 minutes.
- **Alternative for images**: If CDN URLs prove unreliable, run a separate task to `wget` all images into `public/images/brands/invictus/` and `public/images/brands/castell/` and update the paths.
