# Sub-project B: Nieuwe Merken & Actievloeren — Design Spec

## Doel

Vijf nieuwe merken toevoegen aan `src/data/brands.ts` met individuele productvarianten en lokaal opgeslagen afbeeldingen. Daarnaast een admin-beheerd "Actievloeren" systeem bouwen voor afgeprijsde vloeren.

## Scope

| Merk | Categorie | Aanpak | Geschat aantal producten |
|---|---|---|---|
| Douwes Dekker | PVC Vloeren | Individuele dessins, lokale images | ~20-30 (scrapen via Playwright) |
| Gelasta | Vloerbedekking | Selectie van ~15-20 tapijtvarianten uit 678 | ~15-20 |
| DC-Line | Gordijnen | Productvarianten per type (rolgordijnen, vouwgordijnen, duo, duette, jaloezieën) | ~15-25 |
| Hamicon | Gordijnen | Merkpagina met producttypen + sfeerbeelden (geen individuele dessins) | ~6 producttypen |
| Core | Gordijnen | Afwachten — naam onbekend. Niet in deze iteratie. |  |
| Actievloeren | Nieuw concept | Admin-beheerd, Supabase-tabel, eigen pagina | N/A (dynamisch) |

---

## 1. Nieuwe Merken in brands.ts

### 1.1 Douwes Dekker PVC

**Categorie:** PVC Vloeren (toegevoegd aan bestaande `pvc-vloeren` category)

**Bron:** `https://www.plintenenprofielencentrale.nl/vloeren/pvc-per-merk/douwes-dekker-pvc` (JS-rendered, vereist Playwright)

**Aanpak:**
- Scrape de productenlijst met Playwright (pagina laadt dynamisch)
- Selecteer alle beschikbare dessins/collecties
- Download productafbeeldingen lokaal naar `public/images/brands/douwes-dekker/`
- Schrijf individuele `BrandProduct` entries in brands.ts

**BrandProduct entry patroon:**
```typescript
{
  name: 'Dessin Naam – Kleur',
  slug: 'douwes-dekker-dessin-kleur',
  description: 'Nederlandse beschrijving van het dessin...',
  imageUrl: '/images/brands/douwes-dekker/dessin-kleur.webp',
  specs: {
    'Collectie': '...',
    'Afmeting': '... × ... mm',
    'Topslijtlaag': '...',
    'Installatie': 'Dryback / Click',
    // overige specs van de productpagina
  }
}
```

**Brand metadata:**
```typescript
{
  name: 'Douwes Dekker',
  slug: 'douwes-dekker',
  logoUrl: '...', // scrapen of zoeken
  website: 'https://www.douwesdekker.nl',
  description: '...',
  shortDescription: '...',
  featured: false,
  materials: ['PVC'],
  moodImages: [...], // sfeerbeelden van website
  products: [...]
}
```

### 1.2 Gelasta Tapijt

**Categorie:** Vloerbedekking

**Bron:** `https://www.gelasta.nl/tapijt`

**Aanpak:**
- Gelasta heeft 678 tapijtvarianten — we selecteren ~15-20 uit de belangrijkste collecties
- Focus op collecties: Atlas (~5 kleuren), Impress SDN (~4 kleuren), en 2-3 andere populaire collecties
- Download productafbeeldingen naar `public/images/brands/gelasta/`

**BrandProduct entry patroon:**
```typescript
{
  name: 'Atlas 174 – Donkergrijs',
  slug: 'gelasta-atlas-174-donkergrijs',
  description: 'Hoogwaardig tapijt in donkergrijze kleurstelling...',
  imageUrl: '/images/brands/gelasta/atlas-174-donkergrijs.webp',
  specs: {
    'Collectie': 'Atlas',
    'Kleur': 'Donkergrijs (174)',
    'Type': 'Bouclé / Frisé / SDN',
    // overige specs
  }
}
```

### 1.3 DC-Line Gordijnen

**Categorie:** Gordijnen

**Bron:** `https://dc-line.nl`

**Producttypen om te scrapen:**
- Rolgordijnen
- Vouwgordijnen
- Duo rolgordijnen
- Duette
- Jaloezieën

**Aanpak:**
- Scrape per producttype de beschikbare varianten
- Selecteer ~3-5 varianten per type
- Download afbeeldingen naar `public/images/brands/dc-line/`

**BrandProduct entry patroon:**
```typescript
{
  name: 'Rolgordijn – Kleur/Stof',
  slug: 'dc-line-rolgordijn-kleur',
  description: '...',
  imageUrl: '/images/brands/dc-line/rolgordijn-kleur.webp',
  specs: {
    'Type': 'Rolgordijn',
    'Stof': '...',
    'Kleur': '...',
    'Bediening': 'Ketting / Motor',
    // overige specs
  }
}
```

### 1.4 Hamicon Gordijnen

**Categorie:** Gordijnen

**Bron:** `https://www.hamicon.nl/gordijnen/`

**Aanpak:** Geen individuele dessins — merkpagina met producttypen als BrandProduct entries.

**Producttypen als entries:**
```typescript
{
  name: 'Vouwgordijnen',
  slug: 'hamicon-vouwgordijnen',
  description: 'Maatwerk vouwgordijnen van Hamicon Gordijnenatelier...',
  imageUrl: '/images/brands/hamicon/vouwgordijnen.webp',
  specs: {
    'Type': 'Vouwgordijnen',
    'Uitvoering': 'Maatwerk',
    'Bediening': 'Koord / Motor',
  }
}
```

**Producttypen:** Vouwgordijnen, Overgordijnen, Vitrage, Paneelgordijnen, Rolgordijnen, Plissé (~6 entries)

**Sfeerbeelden:** Download 3-4 sfeerbeelden van de Hamicon website naar `public/images/brands/hamicon/`

---

## 2. Actievloeren — Admin-beheerd systeem

### Concept
Een speciale pagina (`/actievloeren`) met vloeren die in de aanbieding zijn. Beheerbaar vanuit de admin — niet hardcoded in brands.ts.

### Database (Supabase)
Nieuwe tabel `actievloeren`:

| Kolom | Type | Beschrijving |
|---|---|---|
| id | UUID | Primary key |
| name | TEXT | Productnaam |
| brand | TEXT | Merknaam (bijv. "Gelasta") |
| collection | TEXT | Collectienaam (optioneel) |
| image_url | TEXT | Productafbeelding |
| discount_percentage | INTEGER | Korting in procenten (bijv. 30) |
| description | TEXT | Korte beschrijving |
| specs | JSONB | Specificaties als key-value |
| active | BOOLEAN | Zichtbaar op de website |
| sort_order | INTEGER | Sorteervolgorde |
| created_at | TIMESTAMPTZ | Aanmaakdatum |

RLS: publiek lezen (active=true), authenticated schrijven.

### Admin pagina (`/admin/actievloeren`)
- Overzicht met actievloeren cards (foto, naam, merk, korting%)
- Toevoegen/bewerken formulier: naam, merk, collectie, afbeelding upload/URL, korting%, beschrijving, specs
- Activeren/deactiveren toggle
- Verwijderen

### Publieke pagina (`/actievloeren`)
- Hero met titel "Actievloeren" en subtitel
- Grid met actievloer-cards:
  - Productfoto
  - Korting-badge (bijv. "-30%") in rood/oranje
  - Productnaam + merk
  - Beschrijving
  - Specs
  - CTA: "Offerte aanvragen" of "Bel voor meer info"

### Sidebar link
Toevoegen aan admin sidebar onder "MAIN" groep.

---

## 3. Technische overwegingen

### Images
- Alle productafbeeldingen lokaal opslaan als WebP in `public/images/brands/[merknaam]/`
- Sfeerbeelden ook lokaal waar mogelijk

### Scraping
- Douwes Dekker: Playwright vereist (JS-rendered pagina)
- Gelasta: Gewoon HTTP fetch (server-rendered HTML)
- DC-Line: Te bepalen bij scraping
- Hamicon: Handmatig — sfeerbeelden downloaden, producttypen zijn bekend

### Bestaande code
- Merken worden toegevoegd aan de `categories` array in `src/data/brands.ts`
- Actievloeren is een apart Supabase-systeem (niet in brands.ts)
- Geen wijzigingen aan bestaande merken of categorieën

---

## 4. Niet in scope

- **Core gordijnen** — naam onbekend, wachten op klant
- **Mega menu wijzigingen** — apart sub-project (A)
- **Projecten ↔ merken koppeling** — apart sub-project (C)
- **Lightbox pijltjes** — apart sub-project (D)
