# Design — Rebrand naar BPM Parket

**Datum:** 2026-04-20
**Status:** Design approved, wachten op implementation plan
**Scope:** Volledige rebrand van de bestaande "PVC Vloeren Achterhoek" Next.js site naar "B.P.M. Parket & Interieur" (BPM Parket).

---

## Doel

De huidige Next.js 16 site, oorspronkelijk gebouwd voor PVC Vloeren Achterhoek (Doetinchem), omzetten naar een volledig werkende site voor BPM Parket (Geldrop). Gebruik de visuele identiteit, dienstenstructuur en content van hun bestaande site bpmparket.nl. De template-architectuur (Next.js 16, Supabase, admin-panel, chatbot) blijft intact.

## Bron-materiaal

Geëxtraheerd uit bpmparket.nl:

- **Bedrijfsnaam:** B.P.M. van Baar Parket Montage (korte vorm: BPM Parket, branding "B.P.M. Parket & Interieur")
- **Locatie:** De Hooge Akker 19, 5661 NG Geldrop (Brabant)
- **Telefoon:** 06-53499361 (primair), 06-11289094 (secundair)
- **Email:** info@bpmparket.nl
- **KvK:** 91700981, BTW: NL865742625B01
- **Tagline:** "Uw specialist in Traditioneel Parket sinds 1992"
- **6 diensten:** Parket en Multiplanken, PVC en Laminaat, Legservice, Traprenovatie, Buitenparket, Interieurwerken
- **Socials:** Facebook + Instagram (@bpmparket)
- **Partners:** Werkspot.nl
- **3 echte reviews** (Demi/Goleen, Maarten/Den Bosch, Paul/Eindhoven)

---

## 1. Branding & identiteit

### Kleurenpalet

Geëxtraheerd uit computed styles bpmparket.nl:

| Token | Hex | Gebruik |
|---|---|---|
| `brand-primary` | `#865D41` | Warmbruin — CTA-knoppen, links, icon-accenten, section headings |
| `brand-secondary` | `#F0AD4E` | Amber goud — highlights, secondary CTAs, stats |
| `brand-dark` | `#192A3D` | Diep donkerblauw — navbar, footer, hero overlay, dark sections |
| `brand-accent` | `#F5EEE6` | Crème — section backgrounds, cards |
| `brand-bg-light` | `#FAFBFC` | Light grey — page background |

### Typografie

- **Font:** Roboto (via `next/font/google`) — vervangt huidige Outfit
- Variable CSS `--font-roboto` → Tailwind `font-sans`

### Logo

- Text-logo: "B.P.M. Parket & Interieur" als placeholder (in `<span>` met brand-primary kleur + parquet-lijn motief)
- Klant levert later echte SVG/PNG → upload naar `public/logo.png`

### Tone of voice

Ambachtelijk, warm, vertrouwen wekkend, traditioneel Nederlands. Nadruk op:
- "Sinds 1992" ervaring
- Vakmanschap & precisie
- Persoonlijk contact
- Maatwerk

---

## 2. Bedrijfsgegevens (`src/config.ts`)

```ts
export const companyConfig = {
  name: "BPM Parket",
  legalName: "B.P.M. van Baar Parket Montage",
  tagline: "Uw specialist in Traditioneel Parket sinds 1992",
  description: "BPM Parket is uw vertrouwde specialist in traditioneel parket, PVC, laminaat, traprenovatie, buitenparket en interieurwerken. Al ruim 30 jaar vakmanschap vanuit Geldrop.",

  contact: {
    phone: "06 - 534 993 61",
    phoneSecondary: "06 - 112 890 94",
    email: "info@bpmparket.nl",
    address: "De Hooge Akker 19",
    zipCity: "5661 NG Geldrop",
    mapsUrl: "https://maps.google.com/?q=De+Hooge+Akker+19,+5661+NG+Geldrop",
    kvk: "91700981",
    btw: "NL865742625B01",
    iban: "" // klant levert later
  },

  openingHours: {
    monday: "Op afspraak",
    tuesday: "Op afspraak",
    wednesday: "Op afspraak",
    thursday: "Op afspraak",
    friday: "Op afspraak",
    saturday: "Op afspraak",
    sunday: "Gesloten"
  },

  socials: {
    facebook: "https://facebook.com/bpmparket",
    instagram: "https://instagram.com/bpmparket",
    linkedin: "" // geen linkedin
  },

  colors: {
    primary: "#865D41",
    secondary: "#F0AD4E",
    dark: "#192A3D",
    accent: "#F5EEE6",
    background: "#FAFBFC",
    text: "#192A3D"
  }
};
```

---

## 3. Navigatie & dienstenstructuur

### Hoofdmenu (6 items, exact bpmparket.nl)

Per dienst een slug onder `/producten/[slug]`:

| # | Dienst | Slug | Type | Merken-grid? |
|---|---|---|---|---|
| 1 | Parket en Multiplanken | `parket-en-multiplanken` | Product | Ja |
| 2 | PVC en Laminaat | `pvc-en-laminaat` | Product | Ja |
| 3 | Legservice | `legservice` | Service | Nee (marketing page) |
| 4 | Traprenovatie | `traprenovatie` | Product/Service | Ja |
| 5 | Buitenparket | `buitenparket` | Product | Ja |
| 6 | Interieurwerken | `interieurwerken` | Service | Nee (marketing page) |

### Mega-menu (desktop)

Navbar toont per categorie een 6-kolom grid. Voor product-categorieën: merken als link-items. Voor service-categorieën: direct link naar landing (geen sub-items).

### Te verwijderen routes

- `/producten/raamdecoratie/` (incl. type-filter sub-route)
- `/producten/gordijnen/` (incl. type-filter sub-route)
- `/producten/houten-vloeren/`
- `/producten/vloerbedekking/`
- `/producten/pvc-vloeren/`
- `/producten/[category]/type/[typeSlug]/` — volledige dynamische route
- `/actievloeren/` + admin tegenhanger
- Actievloeren feature flag + toggle + seed data

---

## 4. Datamodel & brands.ts rewrite

### Structuur (ongewijzigd)

```ts
interface Brand {
  name: string;
  slug: string;
  logo: string;
  description: string;
  website?: string;
  moodImage: string;
  moodImages?: string[];
  usps?: string[];
  products: BrandProduct[];
}

interface Category {
  name: string;
  slug: string;
  description: string;
  imageUrl: string;
  icon: string;
  brands: Brand[];
  // raamdecoratieTypes: RaamdecoratieType[];  // VERWIJDEREN
  // isService?: boolean;                      // NIEUW
}
```

### Types verwijderen

- `RaamdecoratieType`
- `ProductType` (indien alleen voor raamdecoratie gebruikt)
- Alle helpers: `getProductTypesForCategory`, `getBrandsByType`, `getTypeBySlug`

### Nieuwe helper

```ts
// voor service-categorieën zonder brand-grid
export function isServiceCategory(slug: string): boolean {
  return slug === "legservice" || slug === "interieurwerken";
}
```

### Placeholder merken

**Parket en Multiplanken (3)**
- `Ter Hürne` — Duits kwaliteitsparket — 3 producten (Eiken Natuur, Eiken Rustiek, Multiplank Noten)
- `Junckers` — Deens massief parket — 2 producten (Classic Beuken, Premium Eiken)
- `Bauwerk` — Zwitsers premium parket — 2 producten (Cleverpark, Monopark)

**PVC en Laminaat (3)**
- `Quick-Step` — 2 producten (Impressive laminaat, Alpha hybride)
- `Moduleo` — 2 producten (Transform, Roots klik)
- `Forbo Novilon` — 2 producten (Viva dryback, Novilon klikvinyl)

**Buitenparket (2)**
- `Bangkirai Hardhout` — 2 producten (Standaard 145mm, Premium 195mm)
- `Millboard Composiet` — 2 producten (Enhanced Grain, Weathered)

**Traprenovatie (2)**
- `StairSmart` — 2 producten (Eiken trede, Fineer trede)
- `Maatwerk Eikenhout` — 2 producten (Massief eiken stootbord, Eiken trapleuning)

Per product: specs (houtsoort, afmeting, finish, prijsindicatie-range), 1-2 thumbnail images (Unsplash parket/hout URLs — gebruik bestaande patroon met `photo-` URLs).

Sfeerbeelden per merk: 3-4 Unsplash parket-interieur URLs.

### Service-categorieën (zonder brands)

Voor `legservice` en `interieurwerken`: `brands: []` en `isService: true`. Hun per-dienst pagina is een marketing-page met hero, uitleg, USPs, werkwijze-stappen, project-voorbeelden via `getProjectsByCategory`, CTA.

---

## 5. Pagina-aanpassingen

### 5.1 Homepage (`HomePageClient.tsx`)

Secties blijven structureel, content vervangen:

1. **Hero** — `h1`: "Uw specialist in Traditioneel Parket sinds 1992". Sub-tekst: BPM intro-alinea. 3 USP-badges: "30+ jaar vakmanschap · Eigen legservice · Maatwerk". Hero background: showroom/parket interieur image.
2. **Brand marquee** — 6 BPM merken uit placeholder data
3. **Premium Partners slider** → hernoemen naar **"Onze Diensten"** — 6 BPM diensten met category info
4. **Stats** — `30+ jaar ervaring · 1000+ projecten · 6 specialismen · Heel NL`
5. **Over-ons intro** — 2-kolom foto+tekst met BPM verhaal preview + CTA naar `/over-ons`
6. **Reviews carousel** — 3 echte BPM reviews (Demi, Maarten, Paul)
7. **Showroom afspraak booking** — form met adres De Hooge Akker 19
8. **CTA sectie** — offerte-knop

### 5.2 Over Ons (`over-ons/page.tsx`)

Nieuwe content (300-400 woorden, 3-5 alinea's):
- Oprichting 1992 door B.P.M. van Baar
- Traditioneel parket als kernvak, uitbreiding naar PVC/Laminaat/interieur
- Vakmanschap, precisie, persoonlijk contact
- Verzorgingsgebied Brabant / heel Nederland
- Motto: *"Vakmanschap tot in detail"*
- 4 kernwaarden tegels: Traditioneel · Persoonlijk · Duurzaam · Maatwerk

### 5.3 Showroom (`showroom/page.tsx`)

- Hero + "Bezoek onze showroom in Geldrop"
- Adres: De Hooge Akker 19, 5661 NG Geldrop
- Google Maps embed/link
- Afspraak-booking form (bestaand component)
- Showroom foto's (placeholder Unsplash parket-interieur)

### 5.4 Per-dienst landing pages

Elke dienst krijgt:
- Hero met categorie-naam + BPM-stijl intro
- 2-kolom: uitleg + specificaties/features
- Voordelen-lijst (3-5 items)
- Werkwijze stappen (3)
- Product-merken grid (alleen product-categorieën)
- Gerelateerde projecten sectie
- CTA: offerte of bellen

Intro-teksten gebaseerd op bpmparket.nl-copy (parafraseren, geen 1:1 kopie om duplicate content te voorkomen).

### 5.5 Brand detail (`producten/[category]/[brand]/page.tsx`)

Blijft qua structuur hetzelfde, maar filtert nu projects op nieuwe categorie-slugs.

---

## 6. SEO & metadata

### Layout metadata (`src/app/(site)/layout.tsx`)

```ts
const BASE_URL = 'https://bpmparket.nl'

export const metadata = {
  metadataBase: new URL(BASE_URL),
  title: {
    default: 'BPM Parket | Traditioneel Parket sinds 1992 — Geldrop',
    template: '%s | BPM Parket',
  },
  description: 'Uw specialist in parket, PVC, laminaat, traprenovatie, buitenparket en interieurwerken. Al ruim 30 jaar vakmanschap uit Geldrop.',
  keywords: [
    'parket', 'traditioneel parket', 'parket leggen', 'multiplanken',
    'pvc vloer', 'laminaat', 'traprenovatie', 'buitenparket',
    'interieurwerken', 'legservice', 'Geldrop', 'Eindhoven', 'Brabant'
  ],
  // ...
}
```

### JSON-LD LocalBusiness

```ts
{
  '@type': 'LocalBusiness',
  name: 'BPM Parket',
  address: { addressLocality: 'Geldrop', postalCode: '5661 NG', streetAddress: 'De Hooge Akker 19' },
  areaServed: 'Brabant, Noord-Brabant, Nederland',
  priceRange: '€€'
}
```

### Sitemap (`app/sitemap.ts`)

- Statische routes: `/`, `/over-ons`, `/showroom`, `/contact`, `/offerte`, `/projecten`
- 6 diensten: `/producten/{slug}`
- Placeholder merken: `/producten/{cat}/{brand}`
- Policies: `/beleid/{slug}`
- Type-filter routes: **verwijderen uit sitemap**
- Actievloeren routes: **verwijderen**

---

## 7. Database & seed scripts

### `.env.local`

Blijft leeg voor Supabase (user vult eigen instance later). `.env.local` ongewijzigd voor nu.

### `scripts/init-supabase.ts`

Re-seed met BPM data:
- `settings.bedrijfsgegevens` → BPM config
- `settings.seo_settings` → nieuwe title/desc/keywords
- `settings.chatbot_settings` → nieuwe welcome message + system prompt met BPM info
- `settings.announcement_bar` → leeg/uit
- `settings.promo_popup` → uit
- `ai_kennisbank` → 6-8 items over BPM diensten (niet 5-10 PVC items)
- `dynamic_policies` → 3 policies (Privacy, AV, Cookies) met BPM naam/adres/KvK

### Chatbot system prompt

```
Je bent een vriendelijke assistent van BPM Parket. Je HOOFDDOEL is om bezoekers
te laten bellen naar 06-53499361 voor persoonlijk advies.

COMMUNICATIESTIJL:
- Informeel Nederlands, warm en vakkundig
- KORT: max 2-3 zinnen
- Gebruik NOOIT emojis

WAT JE WEL BEANTWOORDT:
- Openingstijden: op afspraak (bel voor afspraak)
- Locatie: De Hooge Akker 19, 5661 NG Geldrop
- 6 diensten: Parket, PVC/Laminaat, Legservice, Traprenovatie, Buitenparket, Interieurwerken
- Simpele ja/nee vragen
- Afspraak inplannen via tools

WAT JE DOORVERWIJST NAAR BELLEN:
- Prijzen, technisch advies, offertes, klachten
- Alles behalve basisfeiten: Bel 06-53499361 voor persoonlijk advies

Tools: check_availability, create_appointment
```

---

## 8. Tailwind config (`tailwind.config.ts`)

```ts
theme: {
  extend: {
    colors: {
      'brand-primary': '#865D41',
      'brand-secondary': '#F0AD4E',
      'brand-dark': '#192A3D',
      'brand-accent': '#F5EEE6',
      'brand-bg-light': '#FAFBFC',
    },
    fontFamily: {
      sans: ['var(--font-roboto)', 'system-ui', 'sans-serif'],
    },
  }
}
```

Alle bestaande `bg-brand-*` / `text-brand-*` / `border-brand-*` classes blijven werken — enkel de onderliggende hex-waarden veranderen.

---

## 9. Feature flags

| Flag | Huidig | Nieuw | Actie |
|---|---|---|---|
| `CHATBOT_AAN` | true | true | Aanpassen system prompt |
| `ANNOUNCEMENT_BAR_AAN` | true | true | Leeg zetten, klant vult later |
| `POPUP_AAN` | false | false | Blijft uit |
| `ACTIEVLOEREN_AAN` | false | **weg** | Volledig verwijderen (code + toggle + admin-tab) |
| `FACEBOOK_SCRAPE_AAN` | false | false | Script blijft bestaan voor later |
| `WACHTWOORD_GATE_AAN` | false | false | Blijft uit |

---

## 10. Bestandenlijst (volledig)

### Wijzigen
- `src/config.ts`
- `src/app/(site)/layout.tsx`
- `src/app/(site)/HomePageClient.tsx`
- `src/app/(site)/RootLayoutContent.tsx`
- `src/app/(site)/over-ons/page.tsx`
- `src/app/(site)/showroom/page.tsx` (+ `ShowroomClient.tsx`)
- `src/app/(site)/contact/page.tsx` (+ `ContactClient.tsx`)
- `src/app/(site)/offerte/page.tsx` (+ `OfferteClient.tsx`)
- `src/app/(site)/producten/traprenovatie/page.tsx`
- `src/components/Navbar.tsx`
- `src/components/Footer.tsx`
- `src/components/AnnouncementBar.tsx`
- `src/components/Chatbot.tsx` (welcome message)
- `src/data/brands.ts` (volledige rewrite)
- `tailwind.config.ts`
- `src/app/(site)/globals.css` (indien nodig)
- `src/app/robots.ts`
- `src/app/sitemap.ts`
- `scripts/init-supabase.ts`
- `seed.ts`
- `seed-prod.ts`
- `src/app/api/chat/route.ts` (system prompt)

### Toevoegen (nieuwe dienst-pagina's)
- `src/app/(site)/producten/parket-en-multiplanken/page.tsx`
- `src/app/(site)/producten/pvc-en-laminaat/page.tsx`
- `src/app/(site)/producten/legservice/page.tsx`
- `src/app/(site)/producten/buitenparket/page.tsx`
- `src/app/(site)/producten/interieurwerken/page.tsx`

### Verwijderen
- `src/app/(site)/producten/raamdecoratie/` (hele directory)
- `src/app/(site)/producten/gordijnen/` (hele directory)
- `src/app/(site)/producten/houten-vloeren/` (hele directory)
- `src/app/(site)/producten/vloerbedekking/` (hele directory)
- `src/app/(site)/producten/pvc-vloeren/` (hele directory)
- `src/app/(site)/producten/[category]/type/` (volledige dynamic route)
- `src/app/(site)/actievloeren/` (hele directory)
- `src/app/(admin)/admin/actievloeren/` (hele directory)
- Navigatie-items naar actievloeren in `Navbar.tsx` en admin Sidebar

### Niet aanraken
- Admin panel kerncomponenten (dashboard, projecten, aanvragen, agenda, klanten, kennisbank, beleid, instellingen — behalve waar config-waarden vandaan komen)
- Supabase clients (`src/lib/supabase/*`)
- Middleware auth
- API routes structureel (alleen content)
- Button/StatCounter/RichTextEditor/DateTimePicker componenten

---

## 11. Acceptatiecriteria

De rebrand is klaar wanneer:

1. `npm run dev` start zonder fouten
2. `npx tsc --noEmit` passeert zonder TS-errors
3. Homepage toont BPM tagline, 6 BPM diensten, BPM kleuren, BPM contactinfo
4. Alle 6 dienst-pagina's renderen correct zonder 404s
5. Navbar mega-menu toont 6 BPM diensten zonder raamdecoratie-types
6. Footer toont BPM adres/telefoon/mail/socials
7. `/producten/raamdecoratie`, `/gordijnen`, `/houten-vloeren`, `/vloerbedekking`, `/pvc-vloeren`, `/actievloeren` geven 404
8. Brand-detail pagina's voor placeholder-merken renderen
9. Over-ons, Showroom (adres Geldrop), Contact, Offerte tonen BPM content
10. Metadata: `<title>` bevat "BPM Parket" op alle pagina's
11. JSON-LD LocalBusiness bevat BPM naam, adres, phone, areaServed
12. Sitemap bevat nieuwe routes, geen verwijderde routes
13. Zoek op "PVC Vloeren Achterhoek" in codebase → alleen in `docs/` en archief-bestanden (geen actieve code)
14. Zoek op "Doetinchem" → alleen in `docs/` of archief
15. Tailwind: `bg-brand-primary` rendert als `#865D41`

---

## 12. Out of scope (voor deze rebrand)

Niet gedaan in deze ronde — later door klant/vervolgopdracht:
- Echte logo (SVG/PNG) — placeholder blijft
- Definitieve openingstijden — "Op afspraak" placeholder
- Echte productfoto's per merk — Unsplash placeholders
- Echte BPM-projectfoto's — lege projects tabel (Facebook scrape optioneel)
- iban op facturen
- LinkedIn URL
- Google Analytics / Search Console verificatie
- Live Supabase koppeling (`.env.local` blijft leeg)
- Productie deploy naar bpmparket.nl domein

---

## 13. Risico's & overwegingen

1. **Duplicate content met bpmparket.nl live site** — vermijden door BPM-teksten te parafraseren i.p.v. letterlijk over te nemen. SEO-risico als bpmparket.nl blijft bestaan.
2. **Broken deeplinks** — iemand kan `/producten/pvc-vloeren` gebookmarkt hebben. Optioneel: 301-redirects naar nieuwe slugs. **Besluit:** niet nodig omdat dit een nieuwe site is (nog geen traffic).
3. **Type-filter route verwijderen** breekt links vanuit oud mega-menu als iets blijft hangen — volledig uitkammen nodig.
4. **brands.ts rewrite is groot** (160KB → ~30KB) — diff zal onleesbaar zijn. Acceptabel omdat dit een template-vulling is.
5. **Placeholder-merken met echte namen** (Ter Hürne, Junckers, etc.) — juridisch is het gebruik van merknamen als "we verkopen dit" gevoelig als BPM ze niet daadwerkelijk levert. **Mitigatie:** markeren als placeholder in commit-message + admin kan ze wijzigen. Klant valideert voor productie.
