# Brand Detail Page Redesign — Design Spec

**Date:** 2026-05-05
**Status:** Approved, ready for implementation planning
**Owner:** Martijn (dev), Bodhi van Baar (klant)

## 1. Goal

Redesign de brand detail pagina (`/merken/[brand]`) volgens het screenshot dat
Bodhi heeft gedeeld (Rivièra Maison Flooring), met **BPM Parket eigen styling**
(brand-red palette + Outfit font, niet de groene accentkleur uit het mockup).
Behoudt 100% backward-compat: geen schema wijziging, geen nieuwe admin velden,
Bodhi's huidige data blijft direct werken.

## 2. Sectievolgorde nieuwe brand detail pagina

```
┌─────────────────────────────────────────────────────────────────┐
│ 1. HERO (donker bg)                                              │
│    Breadcrumb · Service-tag · Brand naam · Description · CTAs   │
│    Rechts: framed lifestyle-foto + logo-kaart                   │
├─────────────────────────────────────────────────────────────────┤
│ 2. PRODUCTEN (white bg)                                          │
│    "[Brand] producten" titel                                     │
│    Grid (3 kolommen): foto + titel + omschrijving + INLINE specs│
├─────────────────────────────────────────────────────────────────┤
│ 3. SFEERBEELDEN (white bg)                                       │
│    "Inspiratie" tag + "Sfeerbeelden" titel                       │
│    Horizontale rij (4 kolommen) van brand_images                 │
├─────────────────────────────────────────────────────────────────┤
│ 4. PORTFOLIO / PROJECTEN                                         │
│    "Portfolio" tag + "Zie [Brand] in echte woningen"             │
│    Description + "Bekijk Projecten" button                       │
├─────────────────────────────────────────────────────────────────┤
│ 5. GARANTIES (light gray bg)                                     │
│    "Waarom [Brand]" tag + "Kwaliteit die u kunt vertrouwen"      │
│    4 trust-badges: Vakkundige montage / Gratis advies /          │
│    Showroom bezichtigen / Scherpe prijzen                        │
├─────────────────────────────────────────────────────────────────┤
│ 6. ANDERE MERKEN IN [SERVICE]                                    │
│    Eén sectie per service waarin het merk producten heeft        │
│    Grid (5 kolommen) van merk-logo-cards                         │
├─────────────────────────────────────────────────────────────────┤
│ 7. CTA (donker bg)                                               │
│    "Interesse in [Brand]?" + 2 CTAs (Offerte / Showroom)         │
└─────────────────────────────────────────────────────────────────┘
```

## 3. Drie kritische ontwerpkeuzes (goedgekeurd)

### Andere merken sectie — Optie D (per service-categorie)

Brands die meerdere services bedienen (Douwes Dekker, Otium met PVC + laminaat)
krijgen **twee** secties: "Andere merken in PVC Vloeren" en "Andere merken in
Laminaat". Single-service brands (Joka, Sense — alleen PVC) krijgen één sectie.

Implementatie: voor elke unieke service uit het brand's products, query peer
brands die ook in die service producten hebben. Cross-merken-discovery binnen
relevante context.

### Tags ("PVC", "Premium merk") — Optie C

**Skip "PREMIUM MERK"-handmatige badge.** Auto-derived service-tags vanuit
products (zoals "PVC", "Laminaat") zijn voldoende. Houdt admin simpel,
content-driven, geen nieuw DB-veld nodig.

Implementatie: per brand de unieke service-titels uit zijn products afleiden,
toon als kleine badges in hero (en eventueel als context-info elders).

### Hero rechter zijde — Optie A (slim hergebruiken)

Geen schema wijziging. Bestaande velden hergebruiken:

| Screenshot-element | Onze data |
|---|---|
| Subtiel achtergrondbeeld in donkere hero | `brands.hero_image` |
| Ingelijste lifestyle-foto rechts | **Eerste `brand_images[0]`** (eerste sfeerbeeld) |
| Logo-kaart | `brands.logo_url` (fallback: gestileerde brand-naam als tekst) |

Brands zonder logo (Joka, Sense in huidige data): tonen brand-naam in display
typografie als fallback — geen broken image.

## 4. Styling — BPM Parket Vite design

Niet de groene accent uit het mockup. Wel de bestaande Vite palette:

- **Primaire CTA**: `bg-brand-red` (#E21E26) met witte tekst
- **Secundaire CTA**: outline / `border-brand-dark`
- **Tags / badges**: subtiel, `bg-brand-light` of `bg-white/10` (op donkere bg)
- **Hero achtergrond**: `bg-black` of `bg-brand-dark` met overlay over hero_image
- **Section titles**: `font-bold` Outfit, gradient highlight via accent kleur
  (zoals "[Brand] **producten**" met red accent op tweede woord — matcht screenshot)
- **Trust-badge icons**: `text-brand-red` of bronstinten
- **CTA section bg**: `bg-brand-dark` of `bg-black` (zoals huidige Footer)

## 5. Wat blijft, wat gaat weg

### Behoud uit huidige `/merken/[brand]`

- DB queries (getBrandBySlug, getBrandImagesForBrand, getProductsForBrand,
  getServices)
- Schema.org Brand JSON-LD
- generateMetadata
- Auth gate (geen — publieke pagina)
- BrandCards op service pagina's (dat is een andere component, blijft)

### Vervangen / herontwerpen

- `BrandHero` component → vervangen door nieuwe Hero (met right-side framed
  visual + logo card)
- Layout van producten sectie → grid 3-col met inline specs (was: ProductCard
  met enkel titel + description, klik door naar detail page)
- Sfeerbeelden sectie → naar 4-col horizontale rij
- Verwijder huidige eind-CTA (`bg-[var(--color-brand-cream)]` met "Geïnteresseerd
  in {brand.name}?") — vervangen door donkere CTA matchend screenshot

### Nieuwe sub-components

- `components/marketing/brand/BrandHeroSection.tsx` — nieuwe hero met right-side
- `components/marketing/brand/ProductGridCard.tsx` — product card met inline specs table
- `components/marketing/brand/MoodGalleryStrip.tsx` — 4-col horizontale strip
- `components/marketing/brand/PortfolioCTASection.tsx` — Bekijk Projecten teaser
- `components/marketing/brand/TrustBadgesSection.tsx` — 4-badge guarantees row
- `components/marketing/brand/PeerBrandsSection.tsx` — "Andere merken in [service]"
- `components/marketing/brand/BrandCTASection.tsx` — eind CTA donker

(allemaal RSC waar mogelijk; alleen client-component als interactie nodig.)

## 6. Trust badges (Garanties sectie)

**Hardcoded** in component, niet brand-specifiek (BPM Parket eigen garanties):

| Icon (lucide) | Label |
|---|---|
| `Wrench` of `HardHat` | Vakkundige montage |
| `MessageCircle` | Gratis advies |
| `Eye` of `Store` | Showroom bezichtigen |
| `Tag` of `BadgePercent` | Scherpe prijzen |

Description boven de badges: dynamisch met brand-naam.

## 7. Inline specs format

Op de productkaarten in de "Producten" sectie tonen we **alle product specs**
(uit `products.specs` JSONB) als kleine label-value tabel onder de description.

Format zoals screenshot:
```
SPECIFICATIES
Longboard          1524 × 230 mm
Visgraat           770 × 154 mm
Dikte              2,5 mm
Toplaag            0,55 mm + 2 keramische lagen
Legsysteem         Dryback (verlijmd)
Vloerverwarming    Ja
Gebruiksklasse     23/33
```

Onze `specs` JSONB struct: `{ "Dikte": "2,5 mm", "Toplaag": "0,55 mm + 2 keramische lagen", ... }` — direct iterabel, geen schema wijziging.

Gedrag: alle specs tonen, max ~8 (laat overflow weg of toon "+ N meer specs").

## 8. Cross-cutting changes

### Voor productdetail pagina (`/merken/[brand]/[product]`)

Aangezien de specs nu inline op de brand-pagina zichtbaar zijn, blijft de
product-detail-pagina nog nuttig voor:
- Decors gallery (kleurvarianten)
- Spec sheet PDF download
- Grotere product photo gallery
- Aparte SEO URL per product

Geen wijziging nodig, blijft zoals nu. We verwijzen vanuit brand-pagina niet
meer expliciet door (geen "Bekijk meer" link op product cards), maar de cards
zelf zijn klikbaar naar de detail-pagina.

### Voor service pagina's

Geen wijziging. BrandCards sectie onderaan blijft ongewijzigd.

## 9. SEO impact

- `Brand` JSON-LD blijft (Plan 5 Task 19) — geen wijziging
- Per-product schema komt niet meer mee op brand-pagina (was er ook niet) —
  geen wijziging
- Sitemap blijft hetzelfde — geen wijziging

## 10. Vibe-Security

Geen nieuwe data flows, geen nieuwe forms, geen nieuwe API. Pure visuele
herstructurering van bestaande RSC-pagina. Geen security review nodig boven
huidige setup.

## 11. Estimated work

- 7 nieuwe sub-components (~80-150 regels elk)
- 1 grote rewrite van `app/(public)/merken/[brand]/page.tsx` (compositie laag)
- ~700-1000 regels nieuwe code
- Geen DB migration
- Geen nieuwe dependencies
- Visuele alignment met Vite design system (brand-red etc)

**Tijdschatting: 2-3 uur werk in subagent-driven flow.**

## 12. Out of scope

- Geen wijziging aan `/merken/[brand]/[product]` (product detail pagina)
- Geen wijziging aan `/merken` (index pagina)
- Geen schema wijziging
- Geen admin paneel uitbreiding
- Geen wijziging aan service-pagina BrandCards sectie
