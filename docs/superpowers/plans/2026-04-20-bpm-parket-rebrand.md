# BPM Parket Rebrand Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Rebrand de bestaande Next.js 16 template van "PVC Vloeren Achterhoek" naar "BPM Parket" (De Hooge Akker 19, Geldrop) met BPM's 6 diensten, kleuren, content en SEO.

**Architecture:** In-place transformatie van de bestaande codebase. Template-architectuur (App Router, Supabase, admin-panel, chatbot) blijft ongewijzigd. Wijzigingen zitten in: brand tokens (kleuren/font), config, navigatie, data layer (brands.ts), per-dienst pagina's, global components (Navbar/Footer/AnnouncementBar), SEO metadata en seed scripts.

**Tech Stack:** Next.js 16 (App Router), React 19, TypeScript, Tailwind CSS v4, Supabase (SSR), lucide-react, Roboto font.

**Source of truth:** `docs/superpowers/specs/2026-04-20-bpm-parket-rebrand-design.md`.

**Working directory:** `/Users/martijnvervoort/Desktop/Code/BPM-PARKET-2026-2` — fresh git repo op `origin = github.com/martxvr/bpm-parket-2026-2`.

---

## Uitvoeringsvolgorde (waarom deze volgorde)

1. **Foundations eerst** (tailwind, font, config) — alle latere tasks leunen hierop.
2. **Oude routes verwijderen vóór data-layer rewrite** — zo vermijden we dead imports.
3. **Data-layer rewrite** — onderliggende bron voor Navbar/Footer/homepage/dienst-pages.
4. **Globale componenten** (Navbar, Footer) — afhankelijk van nieuwe data en config.
5. **Pagina-content** — leunt op componenten.
6. **Per-dienst landing pages** — leunen op data layer.
7. **SEO & seeds** — sluitstuk.
8. **Verificatie** — `tsc --noEmit` + `next dev` smoke-test.

## Conventies voor commits

Gebruik het patroon dat in het bestaande seed-project werd gebruikt:
- `feat:` — nieuwe feature/pagina
- `refactor:` — herstructurering
- `chore:` — config/tooling
- `fix:` — bugfix
- `docs:` — docs only

Voeg elke commit `Co-Authored-By: Claude Opus 4.7 (1M context) <noreply@anthropic.com>` trailer toe.

**Verificatie na elke Task:**
- `npx tsc --noEmit` moet zonder fouten passeren (of met exact dezelfde fouten als vóór de task — noteer dat)
- Waar aangegeven: `npm run dev` starten + URL bekijken

---

## Phase 1 — Foundations

### Task 1: Update Tailwind brand colors

**Files:**
- Modify: `tailwind.config.ts`

- [ ] **Step 1.1: Vervang het `colors` object**

  Vervang regels 11-20 in `tailwind.config.ts` met:

  ```ts
  colors: {
      brand: {
          primary: '#865D41',      // Warmbruin — BPM hoofdkleur
          secondary: '#F0AD4E',    // Amber goud — accent/CTA
          dark: '#192A3D',         // Diep donkerblauw — navbar, footer, dark surfaces
          accent: '#F5EEE6',       // Crème — section backgrounds
          text: '#192A3D',         // Tekst
          'bg-light': '#FAFBFC',   // Page background
      }
  }
  ```

  Het volledige `tailwind.config.ts` wordt:

  ```ts
  import type { Config } from 'tailwindcss'

  const config: Config = {
      content: [
          './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
          './src/components/**/*.{js,ts,jsx,tsx,mdx}',
          './src/app/**/*.{js,ts,jsx,tsx,mdx}',
      ],
      theme: {
          extend: {
              colors: {
                  brand: {
                      primary: '#865D41',
                      secondary: '#F0AD4E',
                      dark: '#192A3D',
                      accent: '#F5EEE6',
                      text: '#192A3D',
                      'bg-light': '#FAFBFC',
                  }
              },
              fontFamily: {
                  sans: ['var(--font-roboto)', 'system-ui', '-apple-system', 'sans-serif'],
              }
          }
      },
      plugins: [],
  }

  export default config
  ```

- [ ] **Step 1.2: Verify TypeScript compiles**

  Run: `npx tsc --noEmit`
  Expected: Zelfde error-count als baseline (geen nieuwe errors).

- [ ] **Step 1.3: Commit**

  ```bash
  git add tailwind.config.ts
  git commit -m "$(cat <<'EOF'
  chore: update Tailwind brand colors voor BPM Parket

  - brand-primary: #865D41 (warmbruin)
  - brand-secondary: #F0AD4E (amber goud)
  - brand-dark: #192A3D (donkerblauw)
  - brand-accent: #F5EEE6 (crème)
  - Roboto font via CSS variable

  Co-Authored-By: Claude Opus 4.7 (1M context) <noreply@anthropic.com>
  EOF
  )"
  ```

---

### Task 2: Switch Outfit → Roboto in layout

**Files:**
- Modify: `src/app/(site)/layout.tsx`

- [ ] **Step 2.1: Vervang font import**

  In `src/app/(site)/layout.tsx`:
  - Regel 1: `import { Outfit } from 'next/font/google'` → `import { Roboto } from 'next/font/google'`
  - Regels 7-11: Vervang de Outfit-config door:

  ```ts
  const roboto = Roboto({
    subsets: ['latin'],
    weight: ['300', '400', '500', '700'],
    display: 'swap',
    variable: '--font-roboto',
  })
  ```

  - Regel 88: `<html lang="nl" className={outfit.variable}>` → `<html lang="nl" className={roboto.variable}>`

- [ ] **Step 2.2: Verify compile**

  Run: `npx tsc --noEmit`

- [ ] **Step 2.3: Commit**

  ```bash
  git add src/app/\(site\)/layout.tsx
  git commit -m "chore: switch font Outfit naar Roboto voor BPM Parket

  Co-Authored-By: Claude Opus 4.7 (1M context) <noreply@anthropic.com>"
  ```

---

### Task 3: Update `src/config.ts`

**Files:**
- Modify: `src/config.ts`

- [ ] **Step 3.1: Volledige vervanging**

  Overschrijf `src/config.ts` met:

  ```ts
  import { Facebook, Instagram, Linkedin } from 'lucide-react'
  import MapPinIcon from '@/components/ui/map-pin-icon'
  import TelephoneIcon from '@/components/ui/telephone-icon'
  import MailFilledIcon from '@/components/ui/mail-filled-icon';

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
      iban: ""
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
      linkedin: ""
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

- [ ] **Step 3.2: Verify**

  Run: `npx tsc --noEmit`

- [ ] **Step 3.3: Commit**

  ```bash
  git add src/config.ts
  git commit -m "feat: update companyConfig met BPM Parket bedrijfsgegevens

  Co-Authored-By: Claude Opus 4.7 (1M context) <noreply@anthropic.com>"
  ```

---

### Task 4: Update layout metadata + JSON-LD

**Files:**
- Modify: `src/app/(site)/layout.tsx`

- [ ] **Step 4.1: Vervang metadata block en JSON-LD**

  Vervang regels 13-85 in `src/app/(site)/layout.tsx` met:

  ```ts
  const BASE_URL = 'https://bpmparket.nl'

  export const metadata: Metadata = {
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
    authors: [{ name: 'BPM Parket' }],
    creator: 'BPM Parket',
    openGraph: {
      type: 'website',
      locale: 'nl_NL',
      url: BASE_URL,
      siteName: 'BPM Parket',
      title: 'BPM Parket | Traditioneel Parket sinds 1992 — Geldrop',
      description: 'Uw specialist in parket, PVC, laminaat, traprenovatie, buitenparket en interieurwerken.',
    },
    twitter: {
      card: 'summary_large_image',
      title: 'BPM Parket',
      description: 'Specialist in traditioneel parket, PVC/laminaat, traprenovatie en interieurwerken — Geldrop.',
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        'max-video-preview': -1,
        'max-image-preview': 'large' as const,
        'max-snippet': -1,
      },
    },
    alternates: {
      canonical: BASE_URL,
    },
  }

  export default async function RootLayout({
    children,
  }: {
    children: React.ReactNode
  }) {
    const [bedrijfsgegevens, promoPopup, policies, chatbotSettings, announcementBar, sitePassword] = await Promise.all([
      getBedrijfsgegevens(),
      getPromoPopup(),
      getDynamicPolicies(),
      getChatbotSettings(),
      getAnnouncementBar(),
      getSitePassword(),
    ])

    const jsonLd = {
      '@context': 'https://schema.org',
      '@type': 'LocalBusiness',
      name: bedrijfsgegevens?.name || 'BPM Parket',
      description: 'Specialist in traditioneel parket, PVC/laminaat, traprenovatie, buitenparket, legservice en interieurwerken in Geldrop en omgeving.',
      url: BASE_URL,
      telephone: bedrijfsgegevens?.phone || '06-53499361',
      email: bedrijfsgegevens?.email || 'info@bpmparket.nl',
      address: {
        '@type': 'PostalAddress',
        streetAddress: bedrijfsgegevens?.address || 'De Hooge Akker 19',
        addressLocality: bedrijfsgegevens?.city || 'Geldrop',
        postalCode: bedrijfsgegevens?.postcode || '5661 NG',
        addressCountry: 'NL',
      },
      areaServed: 'Noord-Brabant, Nederland',
      priceRange: '€€',
    }
  ```

  (Laat de `return ( ... )` JSX hieronder ongewijzigd — alleen de metadata/JSON-LD wijzigt.)

- [ ] **Step 4.2: Verify**

  Run: `npx tsc --noEmit`

- [ ] **Step 4.3: Commit**

  ```bash
  git add src/app/\(site\)/layout.tsx
  git commit -m "feat: update layout metadata + JSON-LD voor BPM Parket SEO

  Co-Authored-By: Claude Opus 4.7 (1M context) <noreply@anthropic.com>"
  ```

---

## Phase 2 — Verwijder oude routes & features

### Task 5: Verwijder oude product-categorieën

**Files:**
- Delete: `src/app/(site)/producten/raamdecoratie/`
- Delete: `src/app/(site)/producten/gordijnen/`
- Delete: `src/app/(site)/producten/houten-vloeren/`
- Delete: `src/app/(site)/producten/vloerbedekking/`
- Delete: `src/app/(site)/producten/pvc-vloeren/`

- [ ] **Step 5.1: Verwijder directories**

  ```bash
  rm -rf src/app/\(site\)/producten/raamdecoratie
  rm -rf src/app/\(site\)/producten/gordijnen
  rm -rf src/app/\(site\)/producten/houten-vloeren
  rm -rf src/app/\(site\)/producten/vloerbedekking
  rm -rf src/app/\(site\)/producten/pvc-vloeren
  ```

- [ ] **Step 5.2: Verifieer geen bestanden meer**

  ```bash
  ls src/app/\(site\)/producten/
  ```
  Expected: alleen `[category]` directory + evt `traprenovatie`.

- [ ] **Step 5.3: Commit**

  ```bash
  git add -A src/app/\(site\)/producten/
  git commit -m "refactor: verwijder oude product-categorieën (niet in BPM scope)

  Verwijderd: raamdecoratie, gordijnen, houten-vloeren, vloerbedekking, pvc-vloeren

  Co-Authored-By: Claude Opus 4.7 (1M context) <noreply@anthropic.com>"
  ```

---

### Task 6: Verwijder type-filter dynamic route

**Files:**
- Delete: `src/app/(site)/producten/[category]/type/`

- [ ] **Step 6.1: Verwijder directory**

  ```bash
  rm -rf src/app/\(site\)/producten/\[category\]/type
  ```

- [ ] **Step 6.2: Commit**

  ```bash
  git add -A
  git commit -m "refactor: verwijder type-filter route (raamdecoratie-specifiek)

  Co-Authored-By: Claude Opus 4.7 (1M context) <noreply@anthropic.com>"
  ```

---

### Task 7: Verwijder actievloeren feature

**Files:**
- Delete: `src/app/(site)/actievloeren/`
- Delete: `src/app/(admin)/admin/actievloeren/`

- [ ] **Step 7.1: Verwijder beide directories**

  ```bash
  rm -rf src/app/\(site\)/actievloeren
  rm -rf src/app/\(admin\)/admin/actievloeren
  ```

- [ ] **Step 7.2: Zoek + verwijder resterende actievloeren-referenties**

  ```bash
  grep -rn "actievloeren" src/ 2>/dev/null
  ```

  Verwacht resultaat: misschien links in Navbar/Sidebar/sitemap. Voor elke match: verwijder de regel. Noteer welke bestanden nog referenties bevatten (worden in latere tasks behandeld — Navbar in Task 11, Sidebar in deze task).

  Check de admin Sidebar:

  ```bash
  grep -n "actievloeren" src/app/\(admin\)/admin/_components/Sidebar.tsx 2>/dev/null
  ```

  Als er matches zijn: open het bestand, verwijder het bijbehorende menu-item (compleet `<li>` of navigation entry).

- [ ] **Step 7.3: Verify TypeScript compileert**

  Run: `npx tsc --noEmit`

- [ ] **Step 7.4: Commit**

  ```bash
  git add -A
  git commit -m "refactor: verwijder actievloeren feature (niet in BPM scope)

  Verwijderd: site-pagina, admin-pagina, sidebar-link.

  Co-Authored-By: Claude Opus 4.7 (1M context) <noreply@anthropic.com>"
  ```

---

## Phase 3 — Data layer

### Task 8: Rewrite `src/data/brands.ts`

**Files:**
- Modify: `src/data/brands.ts` (volledige rewrite — was 2584 regels, wordt ~400 regels)

- [ ] **Step 8.1: Volledige vervanging**

  Overschrijf `src/data/brands.ts` met:

  ```ts
  // ============================================================
  // Brand & Category Data — BPM Parket
  // ============================================================

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

  export type BrandProduct = {
    name: string;
    slug: string;
    description: string;
    imageUrl?: string;
    specs: Record<string, string>;
  };

  export type Category = {
    name: string;
    slug: string;
    description: string;
    imageUrl: string;
    icon: string; // lucide icon name
    isService?: boolean; // true voor diensten zonder product-grid (Legservice, Interieurwerken)
    brands: Brand[];
  };

  // ────────────────────────────────────────────
  // Parket en Multiplanken
  // ────────────────────────────────────────────

  const parketBrands: Brand[] = [
    {
      name: 'Ter Hürne',
      slug: 'ter-hurne',
      logoUrl: 'https://images.unsplash.com/photo-1615971677499-5467cbab01c0?q=80&w=400&auto=format&fit=crop',
      website: 'https://www.terhurne.com',
      description: 'Duitse kwaliteitsfabrikant van houten vloeren met meer dan 60 jaar ervaring. Ter Hürne staat voor duurzaamheid, innovatie en klassiek vakmanschap.',
      shortDescription: 'Duits kwaliteitsparket met 60+ jaar ervaring.',
      featured: true,
      materials: ['Eiken', 'Noten', 'Esdoorn'],
      moodImages: [
        'https://images.unsplash.com/photo-1615971677499-5467cbab01c0?q=80&w=1600&auto=format&fit=crop',
        'https://images.unsplash.com/photo-1618220179428-22790b461013?q=80&w=1600&auto=format&fit=crop',
        'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?q=80&w=1600&auto=format&fit=crop'
      ],
      products: [
        {
          name: 'Eiken Natuur',
          slug: 'eiken-natuur',
          description: 'Natuurlijke eikenvloer met levendige nerfstructuur en warme kleurnuances. Geolied voor een matte, zijdezachte uitstraling.',
          imageUrl: 'https://images.unsplash.com/photo-1615971677499-5467cbab01c0?q=80&w=800&auto=format&fit=crop',
          specs: { 'Houtsoort': 'Eiken', 'Dikte': '14 mm', 'Breedte': '190 mm', 'Afwerking': 'Natuurlijk geolied', 'Legsysteem': 'Click' }
        },
        {
          name: 'Eiken Rustiek',
          slug: 'eiken-rustiek',
          description: 'Rustieke eikenvloer met zichtbare knoesten en kieren. Karakteristieke, landelijke uitstraling.',
          imageUrl: 'https://images.unsplash.com/photo-1618220179428-22790b461013?q=80&w=800&auto=format&fit=crop',
          specs: { 'Houtsoort': 'Eiken rustiek', 'Dikte': '14 mm', 'Breedte': '220 mm', 'Afwerking': 'Geborsteld & geolied', 'Legsysteem': 'Click' }
        },
        {
          name: 'Multiplank Noten',
          slug: 'multiplank-noten',
          description: 'Warme notenhouten multiplank met rijke bruintint en karakteristieke nerf. Ideaal voor klassieke interieurs.',
          imageUrl: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?q=80&w=800&auto=format&fit=crop',
          specs: { 'Houtsoort': 'Noten', 'Dikte': '15 mm', 'Breedte': '180 mm', 'Afwerking': 'Gelakt', 'Legsysteem': 'Lijm / click' }
        }
      ]
    },
    {
      name: 'Junckers',
      slug: 'junckers',
      logoUrl: 'https://images.unsplash.com/photo-1598300042247-d088f8ab3a91?q=80&w=400&auto=format&fit=crop',
      website: 'https://www.junckers.com',
      description: 'Deens fabrikant van massief parket sinds 1930. Junckers combineert Scandinavisch design met ambachtelijke productie en maximale duurzaamheid.',
      shortDescription: 'Deens massief parket — Scandinavisch design.',
      featured: true,
      materials: ['Beuken', 'Eiken', 'Essen'],
      moodImages: [
        'https://images.unsplash.com/photo-1598300042247-d088f8ab3a91?q=80&w=1600&auto=format&fit=crop',
        'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?q=80&w=1600&auto=format&fit=crop'
      ],
      products: [
        {
          name: 'Classic Beuken',
          slug: 'classic-beuken',
          description: 'Massief beuken parket met lichte tint en rustige nerf. Duurzaam en makkelijk te onderhouden.',
          imageUrl: 'https://images.unsplash.com/photo-1598300042247-d088f8ab3a91?q=80&w=800&auto=format&fit=crop',
          specs: { 'Houtsoort': 'Beuken', 'Dikte': '22 mm', 'Breedte': '129 mm', 'Afwerking': 'Gelakt', 'Legsysteem': 'Tand & groef' }
        },
        {
          name: 'Premium Eiken',
          slug: 'premium-eiken',
          description: 'Premium massief eiken met diepe structuur en intense uitstraling. Een leven lang mee te schuren.',
          imageUrl: 'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?q=80&w=800&auto=format&fit=crop',
          specs: { 'Houtsoort': 'Eiken', 'Dikte': '22 mm', 'Breedte': '140 mm', 'Afwerking': 'Geolied', 'Legsysteem': 'Tand & groef' }
        }
      ]
    },
    {
      name: 'Bauwerk Parkett',
      slug: 'bauwerk-parkett',
      logoUrl: 'https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?q=80&w=400&auto=format&fit=crop',
      website: 'https://www.bauwerk-parkett.com',
      description: 'Zwitsers premium parket met uitzonderlijke kwaliteit. Bauwerk staat voor precisie, vakmanschap en duurzaam design sinds 1935.',
      shortDescription: 'Zwitsers premium parket met precisie-vakmanschap.',
      featured: true,
      materials: ['Eiken', 'Es', 'Kers'],
      moodImages: [
        'https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?q=80&w=1600&auto=format&fit=crop',
        'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?q=80&w=1600&auto=format&fit=crop'
      ],
      products: [
        {
          name: 'Cleverpark',
          slug: 'cleverpark',
          description: 'Cleverpark-parket — compact en efficiënt, ideaal voor kleinere ruimtes met karaktervolle uitstraling.',
          imageUrl: 'https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?q=80&w=800&auto=format&fit=crop',
          specs: { 'Houtsoort': 'Eiken', 'Dikte': '11 mm', 'Breedte': '135 mm', 'Afwerking': 'Geolied', 'Legsysteem': 'Click' }
        },
        {
          name: 'Monopark',
          slug: 'monopark',
          description: 'Monopark — brede eiken plank met tijdloze elegantie. Voor ruime interieurs en klassieke woningen.',
          imageUrl: 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?q=80&w=800&auto=format&fit=crop',
          specs: { 'Houtsoort': 'Eiken', 'Dikte': '14 mm', 'Breedte': '220 mm', 'Afwerking': 'Gelakt', 'Legsysteem': 'Tand & groef' }
        }
      ]
    }
  ];

  // ────────────────────────────────────────────
  // PVC en Laminaat
  // ────────────────────────────────────────────

  const pvcLaminaatBrands: Brand[] = [
    {
      name: 'Quick-Step',
      slug: 'quick-step',
      logoUrl: 'https://images.unsplash.com/photo-1556228720-195a672e8a03?q=80&w=400&auto=format&fit=crop',
      website: 'https://www.quick-step.com',
      description: 'Belgische fabrikant van laminaat en hybride vloeren. Innovatief, duurzaam en moeiteloos te leggen.',
      shortDescription: 'Belgisch laminaat en hybride — innovatief en duurzaam.',
      featured: true,
      materials: ['Laminaat', 'Hybride'],
      moodImages: [
        'https://images.unsplash.com/photo-1556228720-195a672e8a03?q=80&w=1600&auto=format&fit=crop',
        'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?q=80&w=1600&auto=format&fit=crop'
      ],
      products: [
        {
          name: 'Impressive',
          slug: 'impressive',
          description: 'Laminaat met authentieke houtlook en V-groeven voor een realistische planken-ervaring.',
          imageUrl: 'https://images.unsplash.com/photo-1556228720-195a672e8a03?q=80&w=800&auto=format&fit=crop',
          specs: { 'Materiaal': 'Laminaat', 'Dikte': '8 mm', 'Breedte': '190 mm', 'Afwerking': 'V-groef', 'Legsysteem': 'Uniclic' }
        },
        {
          name: 'Alpha Hybride',
          slug: 'alpha-hybride',
          description: 'Hybride vloer (laminaat-PVC mix) — waterdicht, slijtvast en stil.',
          imageUrl: 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?q=80&w=800&auto=format&fit=crop',
          specs: { 'Materiaal': 'Hybride', 'Dikte': '5 mm', 'Breedte': '209 mm', 'Afwerking': 'Waterdicht', 'Legsysteem': 'Click' }
        }
      ]
    },
    {
      name: 'Moduleo',
      slug: 'moduleo',
      logoUrl: 'https://images.unsplash.com/photo-1519947486511-46149fa0a254?q=80&w=400&auto=format&fit=crop',
      website: 'https://www.moduleo.com',
      description: 'Luxe design-PVC met een breed kleurpalet. Ideaal voor woonkamer, slaapkamer en badkamer.',
      shortDescription: 'Luxe design PVC — klik & dryback.',
      featured: true,
      materials: ['PVC'],
      moodImages: [
        'https://images.unsplash.com/photo-1519947486511-46149fa0a254?q=80&w=1600&auto=format&fit=crop',
        'https://images.unsplash.com/photo-1565182999561-18d7dc61c393?q=80&w=1600&auto=format&fit=crop'
      ],
      products: [
        {
          name: 'Transform',
          slug: 'transform',
          description: 'Transform-collectie met realistische houtlook en matte finish.',
          imageUrl: 'https://images.unsplash.com/photo-1519947486511-46149fa0a254?q=80&w=800&auto=format&fit=crop',
          specs: { 'Materiaal': 'PVC Dryback', 'Dikte': '2,5 mm', 'Breedte': '132 mm', 'Topslijtlaag': '0,55 mm', 'Legsysteem': 'Dryback (verlijmd)' }
        },
        {
          name: 'Roots Klik',
          slug: 'roots-klik',
          description: 'Roots klikvinyl — eenvoudig zelf te leggen, ideaal voor renovatie.',
          imageUrl: 'https://images.unsplash.com/photo-1565182999561-18d7dc61c393?q=80&w=800&auto=format&fit=crop',
          specs: { 'Materiaal': 'PVC Klik', 'Dikte': '5 mm', 'Breedte': '178 mm', 'Topslijtlaag': '0,40 mm', 'Legsysteem': 'Click' }
        }
      ]
    },
    {
      name: 'Forbo Novilon',
      slug: 'forbo-novilon',
      logoUrl: 'https://images.unsplash.com/photo-1574362848149-11496d93a7c7?q=80&w=400&auto=format&fit=crop',
      website: 'https://www.forbo.com',
      description: 'Forbo Novilon — Nederlands PVC van hoge kwaliteit. Veelzijdig, duurzaam en betaalbaar.',
      shortDescription: 'Nederlands PVC — duurzaam en veelzijdig.',
      featured: false,
      materials: ['PVC'],
      moodImages: [
        'https://images.unsplash.com/photo-1574362848149-11496d93a7c7?q=80&w=1600&auto=format&fit=crop'
      ],
      products: [
        {
          name: 'Viva Dryback',
          slug: 'viva-dryback',
          description: 'Viva Dryback — premium PVC met uitzonderlijke slijtvastheid voor drukbelopen ruimtes.',
          imageUrl: 'https://images.unsplash.com/photo-1574362848149-11496d93a7c7?q=80&w=800&auto=format&fit=crop',
          specs: { 'Materiaal': 'PVC Dryback', 'Dikte': '2,5 mm', 'Breedte': '184 mm', 'Topslijtlaag': '0,55 mm', 'Legsysteem': 'Dryback' }
        },
        {
          name: 'Novilon Klik',
          slug: 'novilon-klik',
          description: 'Klikvinyl met waterdichte kern — onderhoudsarm en geschikt voor alle vertrekken.',
          imageUrl: 'https://images.unsplash.com/photo-1574362848149-11496d93a7c7?q=80&w=800&auto=format&fit=crop',
          specs: { 'Materiaal': 'PVC Klik', 'Dikte': '4 mm', 'Breedte': '178 mm', 'Topslijtlaag': '0,33 mm', 'Legsysteem': 'Click' }
        }
      ]
    }
  ];

  // ────────────────────────────────────────────
  // Buitenparket
  // ────────────────────────────────────────────

  const buitenparketBrands: Brand[] = [
    {
      name: 'Bangkirai Hardhout',
      slug: 'bangkirai-hardhout',
      logoUrl: 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?q=80&w=400&auto=format&fit=crop',
      description: 'Tropisch hardhout met uitzonderlijke duurzaamheid buitenshuis. Bangkirai is bestand tegen weer en wind.',
      shortDescription: 'Tropisch hardhout — duurzaam buitenparket.',
      featured: true,
      materials: ['Bangkirai'],
      moodImages: [
        'https://images.unsplash.com/photo-1500382017468-9049fed747ef?q=80&w=1600&auto=format&fit=crop',
        'https://images.unsplash.com/photo-1449844908441-8829872d2607?q=80&w=1600&auto=format&fit=crop'
      ],
      products: [
        {
          name: 'Bangkirai 145mm',
          slug: 'bangkirai-145mm',
          description: 'Standaard bangkirai-plank met glad of geribbeld oppervlak. Ideaal voor terras en vlonder.',
          imageUrl: 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?q=80&w=800&auto=format&fit=crop',
          specs: { 'Houtsoort': 'Bangkirai', 'Dikte': '25 mm', 'Breedte': '145 mm', 'Lengte': 'Tot 3 m', 'Toepassing': 'Terras, vlonder' }
        },
        {
          name: 'Bangkirai 195mm Premium',
          slug: 'bangkirai-195mm-premium',
          description: 'Premium brede bangkirai voor ruime terrassen. FSC-gecertificeerd uit duurzaam beheerd bos.',
          imageUrl: 'https://images.unsplash.com/photo-1449844908441-8829872d2607?q=80&w=800&auto=format&fit=crop',
          specs: { 'Houtsoort': 'Bangkirai FSC', 'Dikte': '25 mm', 'Breedte': '195 mm', 'Lengte': 'Tot 4 m', 'Toepassing': 'Premium terras' }
        }
      ]
    },
    {
      name: 'Millboard Composiet',
      slug: 'millboard-composiet',
      logoUrl: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?q=80&w=400&auto=format&fit=crop',
      website: 'https://www.millboard.com',
      description: 'Millboard — composiet terrasdelen die eruitzien als hout maar nooit hoeven geolied te worden. Weer- en vlekbestendig.',
      shortDescription: 'Composiet buitendek — onderhoudsvrij.',
      featured: false,
      materials: ['Composiet'],
      moodImages: [
        'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?q=80&w=1600&auto=format&fit=crop'
      ],
      products: [
        {
          name: 'Enhanced Grain',
          slug: 'enhanced-grain',
          description: 'Realistische hout-textuur met diepe nerfstructuur. Antislip en kleurvast.',
          imageUrl: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?q=80&w=800&auto=format&fit=crop',
          specs: { 'Materiaal': 'Composiet', 'Dikte': '32 mm', 'Breedte': '176 mm', 'Kleur': 'Diverse tinten', 'Garantie': '25 jaar' }
        },
        {
          name: 'Weathered',
          slug: 'weathered',
          description: 'Verweerde-look terrasdeel met grijstinten voor een moderne uitstraling.',
          imageUrl: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?q=80&w=800&auto=format&fit=crop',
          specs: { 'Materiaal': 'Composiet', 'Dikte': '32 mm', 'Breedte': '176 mm', 'Kleur': 'Driftwood / Vintage Oak', 'Garantie': '25 jaar' }
        }
      ]
    }
  ];

  // ────────────────────────────────────────────
  // Traprenovatie
  // ────────────────────────────────────────────

  const traprenovatieBrands: Brand[] = [
    {
      name: 'StairSmart',
      slug: 'stairsmart',
      logoUrl: 'https://images.unsplash.com/photo-1503174971373-b1f69850bded?q=80&w=400&auto=format&fit=crop',
      description: 'Traprenovatie-specialist met overzettreden voor elke trapvorm. Snelle installatie, duurzaam resultaat.',
      shortDescription: 'Overzettreden voor traprenovatie.',
      featured: true,
      materials: ['Eiken', 'Fineer'],
      moodImages: [
        'https://images.unsplash.com/photo-1503174971373-b1f69850bded?q=80&w=1600&auto=format&fit=crop',
        'https://images.unsplash.com/photo-1523413555775-4c5b2f3a8e11?q=80&w=1600&auto=format&fit=crop'
      ],
      products: [
        {
          name: 'Eiken Overzettreden',
          slug: 'eiken-overzettreden',
          description: 'Massieve eiken overzettreden — op maat gemaakt voor uw trap. Geolied of gelakt.',
          imageUrl: 'https://images.unsplash.com/photo-1503174971373-b1f69850bded?q=80&w=800&auto=format&fit=crop',
          specs: { 'Houtsoort': 'Eiken', 'Dikte': '20 mm', 'Afwerking': 'Geolied / gelakt', 'Installatie': '1 dag per trap' }
        },
        {
          name: 'Fineer Overzettreden',
          slug: 'fineer-overzettreden',
          description: 'Budgetvriendelijk fineer — diverse houtlooks. Perfect voor renovatie op beperkt budget.',
          imageUrl: 'https://images.unsplash.com/photo-1523413555775-4c5b2f3a8e11?q=80&w=800&auto=format&fit=crop',
          specs: { 'Materiaal': 'HDF met fineer', 'Dikte': '15 mm', 'Afwerking': 'Diverse houtlooks', 'Installatie': '1 dag per trap' }
        }
      ]
    },
    {
      name: 'Maatwerk Eikenhout',
      slug: 'maatwerk-eikenhout',
      logoUrl: 'https://images.unsplash.com/photo-1600566753051-6057f3c89b2f?q=80&w=400&auto=format&fit=crop',
      description: 'Volledig maatwerk in eiken — voor trappen met bijzondere vormen of wensen. Elke stoot en trede wordt op maat gemaakt.',
      shortDescription: 'Maatwerk eiken — volledig op maat.',
      featured: false,
      materials: ['Eiken'],
      moodImages: [
        'https://images.unsplash.com/photo-1600566753051-6057f3c89b2f?q=80&w=1600&auto=format&fit=crop'
      ],
      products: [
        {
          name: 'Massief Eiken Stootbord',
          slug: 'massief-eiken-stootbord',
          description: 'Massief eiken stootborden — volledig op maat gezaagd en afgewerkt.',
          imageUrl: 'https://images.unsplash.com/photo-1600566753051-6057f3c89b2f?q=80&w=800&auto=format&fit=crop',
          specs: { 'Houtsoort': 'Massief eiken', 'Dikte': '20 mm', 'Afwerking': 'Geolied', 'Maatwerk': 'Ja' }
        },
        {
          name: 'Eiken Trapleuning',
          slug: 'eiken-trapleuning',
          description: 'Handgedraaide eiken trapleuning op maat — volledig passend bij uw nieuwe traptreden.',
          imageUrl: 'https://images.unsplash.com/photo-1600566753051-6057f3c89b2f?q=80&w=800&auto=format&fit=crop',
          specs: { 'Houtsoort': 'Eiken', 'Afwerking': 'Geolied / gelakt', 'Maatwerk': 'Ja' }
        }
      ]
    }
  ];

  // ────────────────────────────────────────────
  // Categories export
  // ────────────────────────────────────────────

  export const categories: Category[] = [
    {
      name: 'Parket en Multiplanken',
      slug: 'parket-en-multiplanken',
      description: 'Traditioneel parket en multiplanken — de kernspecialiteit van BPM Parket sinds 1992.',
      imageUrl: 'https://images.unsplash.com/photo-1615971677499-5467cbab01c0?q=80&w=1600&auto=format&fit=crop',
      icon: 'Layers',
      brands: parketBrands
    },
    {
      name: 'PVC en Laminaat',
      slug: 'pvc-en-laminaat',
      description: 'PVC en laminaat — duurzame, onderhoudsvriendelijke vloeren met een houten of steenlook.',
      imageUrl: 'https://images.unsplash.com/photo-1519947486511-46149fa0a254?q=80&w=1600&auto=format&fit=crop',
      icon: 'LayoutGrid',
      brands: pvcLaminaatBrands
    },
    {
      name: 'Legservice',
      slug: 'legservice',
      description: 'Vakkundige legservice door ons eigen team — van voorbereiding tot plinten en afwerking.',
      imageUrl: 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?q=80&w=1600&auto=format&fit=crop',
      icon: 'Wrench',
      isService: true,
      brands: []
    },
    {
      name: 'Traprenovatie',
      slug: 'traprenovatie',
      description: 'Geef uw trap een nieuw leven — vakkundige traprenovatie met hoogwaardige houtsoorten.',
      imageUrl: 'https://images.unsplash.com/photo-1503174971373-b1f69850bded?q=80&w=1600&auto=format&fit=crop',
      icon: 'ArrowUpDown',
      brands: traprenovatieBrands
    },
    {
      name: 'Buitenparket',
      slug: 'buitenparket',
      description: 'Weer- en UV-bestendig buitenparket voor terras, vlonder en tuin. Hardhout of composiet.',
      imageUrl: 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?q=80&w=1600&auto=format&fit=crop',
      icon: 'Sun',
      brands: buitenparketBrands
    },
    {
      name: 'Interieurwerken',
      slug: 'interieurwerken',
      description: 'Maatwerk interieurwerken — radiatorombouwen, plinten, drempels en meer.',
      imageUrl: 'https://images.unsplash.com/photo-1600607687644-aac4c3eac7f4?q=80&w=1600&auto=format&fit=crop',
      icon: 'Hammer',
      isService: true,
      brands: []
    }
  ];

  // ────────────────────────────────────────────
  // Helpers
  // ────────────────────────────────────────────

  export function getCategoryBySlug(slug: string): Category | undefined {
    return categories.find(c => c.slug === slug);
  }

  export function getBrandBySlug(categorySlug: string, brandSlug: string): Brand | undefined {
    return getCategoryBySlug(categorySlug)?.brands.find(b => b.slug === brandSlug);
  }

  export function getAllBrands(): Brand[] {
    return categories.flatMap(c => c.brands);
  }

  export function getFeaturedBrands(): Brand[] {
    return getAllBrands().filter(b => b.featured);
  }

  export function getAllMaterials(): string[] {
    const set = new Set<string>();
    getAllBrands().forEach(b => b.materials.forEach(m => set.add(m)));
    return Array.from(set).sort();
  }

  export function getCategoriesWithBrands(): Category[] {
    return categories.filter(c => !c.isService);
  }

  export function isServiceCategory(slug: string): boolean {
    return !!getCategoryBySlug(slug)?.isService;
  }
  ```

- [ ] **Step 8.2: Verifieer compile**

  Run: `npx tsc --noEmit`

  **Verwachte errors:** import-fouten in:
  - `src/components/Navbar.tsx` — importeert `getProductTypesForCategory` (niet meer bestaat)
  - `src/app/(site)/offerte/OfferteClient.tsx` — mogelijk zelfde
  - `src/app/(site)/producten/[category]/[brand]/page.tsx` — kan `raamdecoratieTypes` gebruiken

  Noteer deze errors — worden opgelost in Tasks 10-11.

- [ ] **Step 8.3: Commit**

  ```bash
  git add src/data/brands.ts
  git commit -m "refactor: rewrite brands.ts voor BPM Parket

  - 6 categorieën: Parket, PVC/Laminaat, Legservice, Traprenovatie, Buitenparket, Interieurwerken
  - 10 placeholder-merken (Ter Hürne, Junckers, Bauwerk, Quick-Step, Moduleo, Forbo, Bangkirai, Millboard, StairSmart, Maatwerk Eiken)
  - Service-categorieën (Legservice, Interieurwerken) met isService flag
  - Verwijderd: raamdecoratieTypes, ProductType, getProductTypesForCategory, getBrandsByType, getTypeBySlug

  Co-Authored-By: Claude Opus 4.7 (1M context) <noreply@anthropic.com>"
  ```

---

### Task 9: Fix OfferteClient (verwijder raamdecoratie-logica)

**Files:**
- Modify: `src/app/(site)/offerte/OfferteClient.tsx`

- [ ] **Step 9.1: Zoek `getProductTypesForCategory` gebruik**

  ```bash
  grep -n "getProductTypesForCategory\|raamdecoratieTypes\|getBrandsByType\|getTypeBySlug" src/app/\(site\)/offerte/OfferteClient.tsx
  ```

- [ ] **Step 9.2: Vervang referenties**

  Voor elke match in OfferteClient.tsx:
  - Verwijder de `import { getProductTypesForCategory, ... } from '@/data/brands'` — laat alleen wat wél nog bestaat (categories, getCategoryBySlug).
  - Verwijder JSX-blokken die type-filter knoppen renderen.
  - Vervang conditionele logica zoals `if (category.raamdecoratieTypes)` door direct de brands tonen.

  Concrete substitutie als je regel `const types = getProductTypesForCategory(selectedCategory)` tegenkomt: vervang door gewoon de dienst selector (alleen `categories` lijst in de form).

- [ ] **Step 9.3: Verifieer compile**

  Run: `npx tsc --noEmit`

- [ ] **Step 9.4: Commit**

  ```bash
  git add src/app/\(site\)/offerte/OfferteClient.tsx
  git commit -m "refactor: remove raamdecoratie type-filter logic from OfferteClient

  Co-Authored-By: Claude Opus 4.7 (1M context) <noreply@anthropic.com>"
  ```

---

### Task 10: Fix brand detail page (verwijder raamdecoratie references)

**Files:**
- Modify: `src/app/(site)/producten/[category]/[brand]/page.tsx`

- [ ] **Step 10.1: Zoek gebruik**

  ```bash
  grep -n "raamdecoratieTypes\|getProductTypesForCategory" src/app/\(site\)/producten/\[category\]/\[brand\]/page.tsx
  ```

- [ ] **Step 10.2: Verwijder referenties**

  Open het bestand en:
  - Verwijder imports van verwijderde helpers
  - Verwijder JSX waarin type-filter of raamdecoratie wordt getoond
  - Behoud de hoofdstructuur (hero, products grid, sfeerbeelden lightbox, CTA)

- [ ] **Step 10.3: Verifieer compile**

  Run: `npx tsc --noEmit`
  Expected: Navbar-errors blijven (worden in Task 11 opgelost). Brand-detail errors moeten weg zijn.

- [ ] **Step 10.4: Commit**

  ```bash
  git add src/app/\(site\)/producten/\[category\]/\[brand\]/page.tsx
  git commit -m "refactor: remove raamdecoratie references in brand detail page

  Co-Authored-By: Claude Opus 4.7 (1M context) <noreply@anthropic.com>"
  ```

---

## Phase 4 — Globale componenten

### Task 11: Navbar — 6 BPM diensten, geen type-filter logica

**Files:**
- Modify: `src/components/Navbar.tsx`

- [ ] **Step 11.1: Update import**

  Regel 13: Vervang:
  ```ts
  import { categories, getProductTypesForCategory } from '@/data/brands';
  ```
  met:
  ```ts
  import { categories } from '@/data/brands';
  ```

- [ ] **Step 11.2: Strip type-filter mega-menu logica**

  Zoek alle JSX waarin `getProductTypesForCategory(...)` wordt aangeroepen. Dit zit in de mega-menu rendering. Vervang de conditionele tak met directe brand-rendering.

  Concrete patronen om op te zoeken:
  ```tsx
  const types = getProductTypesForCategory(category.slug);
  {types.length > 0 ? (
    // render type items
  ) : (
    // render brands
  )}
  ```

  Vervang door gewoon de brands-variant zonder conditional:
  ```tsx
  {category.brands.length > 0 ? (
    category.brands.slice(0, 6).map(brand => (
      <Link
        key={brand.slug}
        href={`/producten/${category.slug}/${brand.slug}`}
        className="text-sm text-gray-300 hover:text-white transition-colors"
      >
        {brand.name}
      </Link>
    ))
  ) : (
    <Link
      href={`/producten/${category.slug}`}
      className="text-sm text-gray-300 hover:text-white italic"
    >
      Meer info →
    </Link>
  )}
  ```

- [ ] **Step 11.3: Verwijder actievloeren-link**

  ```bash
  grep -n "actievloeren\|Actievloeren" src/components/Navbar.tsx
  ```
  Voor elke match: verwijder de hele `<Link>` of menu-entry regel.

- [ ] **Step 11.4: Update navLinks array (regels 24-29)**

  De huidige `navLinks` array is:
  ```ts
  const navLinks = [
    { name: 'Over ons', href: '/over-ons' },
    { name: 'Showroom', href: '/showroom' },
    { name: 'Projecten', href: '/projecten' },
    { name: 'Contact', href: '/contact' },
  ];
  ```
  Kan blijven — geen wijziging nodig, maar controleer of "Actualiteit" moet worden toegevoegd (matcht bpmparket.nl). Voor nu: **geen Actualiteit toevoegen** (out of scope).

- [ ] **Step 11.5: Verifieer compile**

  Run: `npx tsc --noEmit`
  Expected: geen errors meer in Navbar.tsx.

- [ ] **Step 11.6: Commit**

  ```bash
  git add src/components/Navbar.tsx
  git commit -m "refactor: Navbar toont 6 BPM diensten zonder type-filter logic

  - Verwijderd: getProductTypesForCategory import + usage
  - Verwijderd: actievloeren menu link
  - Mega-menu toont brands direct per categorie

  Co-Authored-By: Claude Opus 4.7 (1M context) <noreply@anthropic.com>"
  ```

---

### Task 12: Footer — nieuwe diensten, BPM contact

**Files:**
- Modify: `src/components/Footer.tsx`

- [ ] **Step 12.1: Update footer-logo alt text (regel 45-46)**

  Vervang:
  ```tsx
  alt="PVC Vloeren Achterhoek Logo"
  ```
  met:
  ```tsx
  alt="BPM Parket Logo"
  ```

  Note: het bestand `public/footer-logo.png` blijft het oude PVC-logo. Voor nu staat er een placeholder logo. Klant levert echt BPM-logo later. Laat de referentie naar `/footer-logo.png` staan.

- [ ] **Step 12.2: Update de Diensten sectie (regels 77-87)**

  Vervang de hele `<div>` met de diensten lijst:
  ```tsx
  <div>
    <h3 className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-6">Diensten</h3>
    <ul className="space-y-4 text-sm text-gray-400">
      <li><Link href="/producten/parket-en-multiplanken" className="hover:text-white transition-colors">Parket en Multiplanken</Link></li>
      <li><Link href="/producten/pvc-en-laminaat" className="hover:text-white transition-colors">PVC en Laminaat</Link></li>
      <li><Link href="/producten/legservice" className="hover:text-white transition-colors">Legservice</Link></li>
      <li><Link href="/producten/traprenovatie" className="hover:text-white transition-colors">Traprenovatie</Link></li>
      <li><Link href="/producten/buitenparket" className="hover:text-white transition-colors">Buitenparket</Link></li>
      <li><Link href="/producten/interieurwerken" className="hover:text-white transition-colors">Interieurwerken</Link></li>
    </ul>
  </div>
  ```

- [ ] **Step 12.3: Update CTA slogan (regel 39-41)**

  Vervang:
  ```tsx
  <h2 className="text-5xl md:text-6xl font-bold tracking-tight mb-6 leading-tight">
    Uw interieur, <span className="text-brand-primary">ons vakmanschap.</span>
  </h2>
  ```
  met:
  ```tsx
  <h2 className="text-5xl md:text-6xl font-bold tracking-tight mb-6 leading-tight">
    Vakmanschap <span className="text-brand-primary">tot in detail.</span>
  </h2>
  ```

- [ ] **Step 12.4: LinkedIn conditional render**

  `companyConfig.socials.linkedin` is nu leeg. Vervang regels 120-123 (de LinkedIn `<a>`) met conditional:

  ```tsx
  {companyConfig.socials.linkedin && (
    <a href={companyConfig.socials.linkedin} target="_blank" rel="noopener noreferrer" className="bg-white/10 p-2 rounded-full hover:bg-white hover:text-black transition-all">
      <Linkedin className="h-4 w-4" />
    </a>
  )}
  ```

- [ ] **Step 12.5: Verifieer compile**

  Run: `npx tsc --noEmit`

- [ ] **Step 12.6: Commit**

  ```bash
  git add src/components/Footer.tsx
  git commit -m "feat: update Footer met BPM diensten en slogan

  - 6 BPM diensten i.p.v. 6 PVC-diensten
  - Slogan: 'Vakmanschap tot in detail'
  - LinkedIn conditional (leeg voor BPM)

  Co-Authored-By: Claude Opus 4.7 (1M context) <noreply@anthropic.com>"
  ```

---

### Task 13: AnnouncementBar — BPM default tekst

**Files:**
- Modify: `src/components/AnnouncementBar.tsx`

- [ ] **Step 13.1: Update default teksten**

  Open `src/components/AnnouncementBar.tsx`. Zoek de default `texts` array of fallback. Vervang PVC-gerelateerde teksten met:

  ```ts
  const defaultTexts = [
    "Uw specialist in Traditioneel Parket sinds 1992",
    "Showroom op De Hooge Akker 19, Geldrop — op afspraak",
    "Vakkundige legservice door ons eigen team",
  ];
  ```

  Als de AnnouncementBar puur DB-driven is (leest uit Supabase settings): skip deze task en markeer als klaar. De echte teksten komen via `scripts/` seed of admin panel.

- [ ] **Step 13.2: Verifieer compile**

  Run: `npx tsc --noEmit`

- [ ] **Step 13.3: Commit**

  ```bash
  git add src/components/AnnouncementBar.tsx
  git commit -m "chore: update AnnouncementBar default teksten voor BPM Parket

  Co-Authored-By: Claude Opus 4.7 (1M context) <noreply@anthropic.com>"
  ```

---

### Task 14: Chatbot system prompt

**Files:**
- Modify: `src/app/api/chat/route.ts`

- [ ] **Step 14.1: Update system prompt**

  Open `src/app/api/chat/route.ts`. Zoek de `systemPrompt` string (gewoonlijk een template literal die bedrijfsnaam, openingstijden, diensten bevat).

  Vervang de PVC-versie met:

  ```ts
  const systemPrompt = `Je bent een vriendelijke assistent van ${companyName}. Je HOOFDDOEL is om bezoekers te laten bellen naar ${companyPhone} voor persoonlijk advies.

  COMMUNICATIESTIJL:
  - Informeel Nederlands, warm en vakkundig
  - KORT: max 2-3 zinnen
  - Gebruik NOOIT emojis

  WAT JE WEL BEANTWOORDT:
  - Openingstijden: op afspraak (bel voor afspraak)
  - Locatie: ${companyAddress}, ${companyCity}
  - 6 diensten: Parket en Multiplanken, PVC en Laminaat, Legservice, Traprenovatie, Buitenparket, Interieurwerken
  - Simpele ja/nee vragen
  - Afspraak inplannen via tools

  WAT JE DOORVERWIJST NAAR BELLEN:
  - Prijzen, technisch advies, offertes, klachten
  - Alles behalve basisfeiten: Bel ${companyPhone} voor persoonlijk advies

  ${kennisbankContext}

  Tools: check_availability, create_appointment`;
  ```

  Behoud de bestaande variabelen voor `companyName`, `companyPhone`, etc. als die al bestonden. Als ze niet bestonden, haal ze op via `companyConfig` of de bedrijfsgegevens uit de DB.

- [ ] **Step 14.2: Verifieer compile**

  Run: `npx tsc --noEmit`

- [ ] **Step 14.3: Commit**

  ```bash
  git add src/app/api/chat/route.ts
  git commit -m "feat: chatbot system prompt aangepast voor BPM Parket

  6 BPM-diensten, 'Op afspraak' openingstijden, BPM-telefoonnummer als CTA.

  Co-Authored-By: Claude Opus 4.7 (1M context) <noreply@anthropic.com>"
  ```

---

## Phase 5 — Publieke pagina's content

### Task 15: Homepage (HomePageClient)

**Files:**
- Modify: `src/app/(site)/HomePageClient.tsx` (598 regels — gerichte edits)

- [ ] **Step 15.1: Update hero sectie**

  Zoek de hero `h1` en subkop. Vervang teksten met:
  - H1: `Uw specialist in Traditioneel Parket sinds 1992`
  - Subkop: `Al ruim 30 jaar leveren wij niet alleen hoogwaardige parketvloeren, maar gaan we verder dan dat. PVC, laminaat, stijlvolle radiator-ombouwen, duurzame buitenparket en maatwerk interieurwerken — BPM Parket is uw vertrouwde partner.`
  - 3 USP-badges tekst: `30+ jaar vakmanschap` · `Eigen legservice` · `Maatwerk op maat`

- [ ] **Step 15.2: Update stats sectie**

  Zoek de stats-array. Vervang met:
  ```ts
  const stats = [
    { value: 30, suffix: '+', label: 'Jaar ervaring' },
    { value: 1000, suffix: '+', label: 'Projecten gerealiseerd' },
    { value: 6, suffix: '', label: 'Specialismen' },
    { value: 100, suffix: '%', label: 'Vakmanschap' },
  ];
  ```

- [ ] **Step 15.3: Update "Premium Partners" sectie**

  Zoek de sectie-titel "Premium Partners" of vergelijkbaar. Vervang door:
  - Sectie-titel: `Onze Diensten`
  - Subtitel: `Van traditioneel parket tot interieurwerken — wij leveren en leggen alles zelf`
  - Partners-array komt nu uit `getCategoriesWithBrands()` of `categories` — herschrijf de map zodat elke tile een category is met `/producten/${slug}` link.

- [ ] **Step 15.4: Update reviews sectie**

  Als de reviews uit de DB komen: skip deze stap. De seed update (Task 27-28) vult echte reviews.

  Als de reviews hardcoded zijn in HomePageClient: vervang met:
  ```ts
  const testimonials = [
    { name: 'Demi', city: 'Goleen', text: 'Komen hun afspraken na, snel en vakkundig een pvc visgraat vloer gelegd. Wij zijn zeer tevreden en raden dit bedrijf zeker aan!', rating: 5 },
    { name: 'Maarten', city: 'Den Bosch', text: 'Zeer goed werk en erg behulpzaam! Dachten ook mee over bepaalde dingen!', rating: 5 },
    { name: 'Paul', city: 'Eindhoven', text: 'Geweldig gedaan, hij komt uitstekend zijn afspraken na. Zijn prijs is trouwens ook uitstekend.', rating: 5 },
  ];
  ```

- [ ] **Step 15.5: Update showroom-booking sectie (indien aanwezig)**

  Sectie die afspraak bookt — adres referentie updaten naar Geldrop. Meestal haalt deze data uit `companyConfig` — dus mogelijk geen directe edit nodig.

- [ ] **Step 15.6: Update CTA kopregels**

  Zoek "Uw interieur" of "Doetinchem" of "Achterhoek" in het bestand:
  ```bash
  grep -n "Doetinchem\|Achterhoek\|Uw interieur" src/app/\(site\)/HomePageClient.tsx
  ```
  Vervang elke match met BPM-equivalent (Geldrop, Brabant, "Uw parket").

- [ ] **Step 15.7: Verifieer compile**

  Run: `npx tsc --noEmit`

- [ ] **Step 15.8: Start dev server + visuele check**

  ```bash
  npm run dev
  ```
  Open http://localhost:3000 — controleer dat:
  - Hero toont BPM tagline
  - Stats tonen 30+ jaar, 1000+ projecten, etc.
  - Diensten-grid toont 6 BPM diensten
  - Geen 404 op iconen
  - Kleuren zijn warmbruin, niet het oude PVC-groen

  Stop dev server (Ctrl+C).

- [ ] **Step 15.9: Commit**

  ```bash
  git add src/app/\(site\)/HomePageClient.tsx
  git commit -m "feat: homepage content aangepast voor BPM Parket

  - Hero: 'Specialist in Traditioneel Parket sinds 1992'
  - Stats: 30+ jaar, 1000+ projecten, 6 specialismen
  - Diensten: 6 BPM-diensten i.p.v. premium partners
  - Reviews: Demi, Maarten, Paul (uit bpmparket.nl)

  Co-Authored-By: Claude Opus 4.7 (1M context) <noreply@anthropic.com>"
  ```

---

### Task 16: Over-ons pagina

**Files:**
- Modify: `src/app/(site)/over-ons/page.tsx`

- [ ] **Step 16.1: Vervang hoofdcontent**

  Open `src/app/(site)/over-ons/page.tsx`. Zoek de hero, intro, verhaal en waarden-secties.

  Vervang verhaal-content met:

  ```tsx
  // Hero
  <h1>Vakmanschap uit Geldrop — sinds 1992</h1>
  <p>Al ruim 30 jaar leveren wij niet alleen hoogwaardige parketvloeren, maar gaan we verder dan dat.</p>

  // Verhaal (3-4 alinea's)
  <p>
    BPM Parket werd opgericht in 1992 door B.P.M. van Baar als specialist in traditioneel parket.
    Vanuit onze werkplaats in Geldrop bedienen wij klanten in heel Noord-Brabant en daarbuiten.
  </p>

  <p>
    Wat begon als pure parket-montage is uitgegroeid tot een compleet interieur-vakmanschap.
    Naast parket leveren en leggen wij PVC, laminaat, buitenparket, renoveren we trappen
    en voeren we interieurwerken uit zoals radiator-ombouwen en maatwerk plinten.
  </p>

  <p>
    Elke opdracht begint met een persoonlijk gesprek. We komen bij u thuis, nemen de ruimte op,
    bespreken uw wensen en geven vakkundig advies over de beste oplossing. Geen druk, geen haast —
    wij werken tot in het kleinste detail.
  </p>

  <p>
    Bij BPM Parket krijgt u altijd dezelfde vakman aan huis. Geen wisselende ploegen, geen onderaannemers.
    Dat is hoe wij kwaliteit waarborgen en al meer dan 1000 tevreden klanten hebben bediend.
  </p>
  ```

- [ ] **Step 16.2: Update kernwaarden tegels**

  Als de pagina 4 kernwaarden/iconen heeft, vervang met:
  ```ts
  const values = [
    { icon: 'Hammer', title: 'Traditioneel', desc: 'Ambachtelijk parket sinds 1992' },
    { icon: 'Users', title: 'Persoonlijk', desc: 'Altijd dezelfde vakman, persoonlijk advies' },
    { icon: 'Leaf', title: 'Duurzaam', desc: 'Houtsoorten uit verantwoorde bron' },
    { icon: 'Wrench', title: 'Maatwerk', desc: 'Elke oplossing op maat van uw ruimte' },
  ];
  ```

- [ ] **Step 16.3: Motto/quote**

  Zoek de quote-sectie. Vervang met: `Vakmanschap tot in detail.`

- [ ] **Step 16.4: Verifieer compile**

  Run: `npx tsc --noEmit`

- [ ] **Step 16.5: Commit**

  ```bash
  git add src/app/\(site\)/over-ons/page.tsx
  git commit -m "feat: Over Ons pagina BPM-verhaal sinds 1992

  Co-Authored-By: Claude Opus 4.7 (1M context) <noreply@anthropic.com>"
  ```

---

### Task 17: Showroom pagina

**Files:**
- Modify: `src/app/(site)/showroom/page.tsx` + `src/app/(site)/showroom/ShowroomClient.tsx`

- [ ] **Step 17.1: Update adres en teksten**

  In beide bestanden, zoek het adres "Logistiekweg" of "Doetinchem" en vervang met "De Hooge Akker 19, 5661 NG Geldrop".

  Update hero-tekst naar:
  ```
  Bezoek onze showroom in Geldrop
  ```

  Update subtitel:
  ```
  Zie onze collectie parket, PVC, laminaat en buitendek live — op afspraak.
  ```

- [ ] **Step 17.2: Maps URL**

  Zoek `maps.google.com` links. Vervang met:
  ```
  https://maps.google.com/?q=De+Hooge+Akker+19,+5661+NG+Geldrop
  ```

  Of gebruik `companyConfig.contact.mapsUrl` als het al dynamisch is.

- [ ] **Step 17.3: "Wat kunt u ervaren" lijst**

  Als de pagina een lijst heeft: vervang met:
  ```ts
  const experiences = [
    'Massief eiken parket uit Duitsland, Denemarken en Zwitserland',
    'PVC en laminaat samples in meer dan 50 kleuren',
    'Buitenparket in hardhout en composiet',
    'Traprenovatie-voorbeelden in diverse houtsoorten',
    'Persoonlijk advies van onze parket-specialist',
  ];
  ```

- [ ] **Step 17.4: Verifieer compile + dev**

  ```bash
  npx tsc --noEmit
  ```

- [ ] **Step 17.5: Commit**

  ```bash
  git add src/app/\(site\)/showroom/
  git commit -m "feat: Showroom pagina wijst naar Geldrop (De Hooge Akker 19)

  Co-Authored-By: Claude Opus 4.7 (1M context) <noreply@anthropic.com>"
  ```

---

### Task 18: Contact pagina

**Files:**
- Modify: `src/app/(site)/contact/page.tsx` + `src/app/(site)/contact/ContactClient.tsx`

- [ ] **Step 18.1: Update hero**

  Vervang hero-tekst met:
  ```
  Neem contact op met BPM Parket
  ```
  Subtitel:
  ```
  Vragen over parket, een offerte, of wilt u de showroom bezoeken? Bel of mail ons — we reageren binnen 24 uur.
  ```

- [ ] **Step 18.2: Adres/telefoon blokken**

  Meestal haalt de contact-pagina uit `companyConfig` — dus automatisch correct na Task 3. Alleen verify.

  Als er hardcoded strings zijn (Doetinchem, pvcvloerenachterhoek.nl): vervang naar Geldrop, bpmparket.nl.

- [ ] **Step 18.3: Update "Wat te verwachten" tekst**

  Zoek de tekst over reactietijd. Vervang met:
  ```
  We reageren binnen 24 uur. Voor urgente zaken bel ons direct op 06 - 534 993 61.
  ```

- [ ] **Step 18.4: Verifieer compile**

- [ ] **Step 18.5: Commit**

  ```bash
  git add src/app/\(site\)/contact/
  git commit -m "feat: Contact pagina teksten aangepast voor BPM Parket

  Co-Authored-By: Claude Opus 4.7 (1M context) <noreply@anthropic.com>"
  ```

---

### Task 19: Offerte pagina

**Files:**
- Modify: `src/app/(site)/offerte/OfferteClient.tsx` (al aangeraakt in Task 9)

- [ ] **Step 19.1: Update service-opties in form**

  Zoek de array/options voor service-keuze. Vervang met BPM-diensten:
  ```ts
  const serviceOptions = [
    { value: 'parket-en-multiplanken', label: 'Parket en Multiplanken' },
    { value: 'pvc-en-laminaat', label: 'PVC en Laminaat' },
    { value: 'legservice', label: 'Legservice' },
    { value: 'traprenovatie', label: 'Traprenovatie' },
    { value: 'buitenparket', label: 'Buitenparket' },
    { value: 'interieurwerken', label: 'Interieurwerken' },
  ];
  ```

- [ ] **Step 19.2: Update hero teksten**

  Zoek hero-H1. Vervang met:
  ```
  Vraag een vrijblijvende offerte aan
  ```

- [ ] **Step 19.3: Verifieer compile**

- [ ] **Step 19.4: Commit**

  ```bash
  git add src/app/\(site\)/offerte/
  git commit -m "feat: offerte form diensten aangepast naar 6 BPM-services

  Co-Authored-By: Claude Opus 4.7 (1M context) <noreply@anthropic.com>"
  ```

---

## Phase 6 — Per-dienst landing pages

### Task 20: Traprenovatie landing page (update)

**Files:**
- Modify: `src/app/(site)/producten/traprenovatie/page.tsx`

- [ ] **Step 20.1: Vervang content met BPM-copy**

  Update de hero H1 naar `Traprenovatie` en subkop:
  ```
  Geef uw trap een nieuw leven. Vakkundige renovatie met massief eiken of fineer — zonder u dagen op te zadelen.
  ```

  Intro-alinea (2-3 zinnen):
  ```
  Traprenovatie is de perfecte oplossing om uw oude, versleten trap nieuw leven in te blazen.
  Onze service transformeert uw trap snel en vakkundig met hoogwaardige overzettreden —
  beschikbaar in diverse houtsoorten en kleuren.
  ```

  Voordelen-lijst (3-4):
  ```ts
  const voordelen = [
    'Snel resultaat — meestal in 1 dag per trap',
    'Geen sloopwerk of rommel',
    'Hoogwaardige houtsoorten: eiken of fineer',
    'Garantie op montage en materiaal',
  ];
  ```

- [ ] **Step 20.2: Verifieer compile**

- [ ] **Step 20.3: Commit**

  ```bash
  git add src/app/\(site\)/producten/traprenovatie/
  git commit -m "feat: Traprenovatie landing page BPM-copy

  Co-Authored-By: Claude Opus 4.7 (1M context) <noreply@anthropic.com>"
  ```

---

### Task 21: Parket en Multiplanken landing page

**Files:**
- Create: `src/app/(site)/producten/parket-en-multiplanken/page.tsx`

- [ ] **Step 21.1: Template voor per-dienst page**

  Deze template wordt hergebruikt in Tasks 22-25. Schrijf:

  ```tsx
  import { getCategoryBySlug, getProjects } from '@/data/brands'
  import { Metadata } from 'next'
  import Link from 'next/link'
  import Image from 'next/image'
  import Button from '@/components/Button'
  import { Hammer, Leaf, Users, Wrench } from 'lucide-react'

  export const metadata: Metadata = {
    title: 'Parket en Multiplanken',
    description: 'Traditioneel parket en multiplanken van BPM Parket — Duitse, Deense en Zwitserse topkwaliteit uit Geldrop.',
  }

  export default function ParketPage() {
    const category = getCategoryBySlug('parket-en-multiplanken')
    if (!category) return null

    const voordelen = [
      'Massief of multiplank — uw keuze, onze expertise',
      'Houtsoorten uit verantwoorde bronnen (FSC)',
      'Een leven lang mee te schuren',
      'Vakkundig gelegd door ons eigen team',
    ]

    const werkwijze = [
      { title: '1. Adviesgesprek', desc: 'We komen bij u thuis, bekijken de ruimte en adviseren over houtsoort, afwerking en legpatroon.' },
      { title: '2. Maatwerk offerte', desc: 'Binnen 24 uur ontvangt u een vrijblijvende offerte met duidelijke prijsopbouw.' },
      { title: '3. Vakkundige montage', desc: 'Ons eigen team legt uw vloer — van egaliseren tot plinten. Zonder stress, zonder rommel.' },
    ]

    return (
      <main className="min-h-screen bg-brand-bg-light">
        {/* Hero */}
        <section className="relative h-[60vh] min-h-[500px] bg-brand-dark overflow-hidden">
          <Image
            src={category.imageUrl}
            alt={category.name}
            fill
            className="object-cover opacity-40"
            priority
          />
          <div className="relative z-10 flex flex-col justify-center h-full max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
            <p className="text-brand-secondary uppercase tracking-widest text-sm mb-4">Onze Specialiteit</p>
            <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 max-w-3xl">{category.name}</h1>
            <p className="text-xl text-gray-200 max-w-2xl">{category.description}</p>
          </div>
        </section>

        {/* Intro */}
        <section className="max-w-4xl mx-auto px-6 py-20">
          <h2 className="text-3xl md:text-4xl font-bold text-brand-dark mb-6">
            Traditioneel parket — onze kernspecialiteit sinds 1992
          </h2>
          <div className="prose prose-lg text-brand-text">
            <p>
              Welkom bij uw vertrouwde specialist in Geldrop. Als expert in traditioneel parket leveren
              wij al ruim 30 jaar hoogwaardige parketvloeren voor woningen, bedrijfsruimtes en showrooms.
              Elk project nemen wij aan met de precisie en zorg die uw woning verdient.
            </p>
            <p>
              Onze toewijding is duidelijk zichtbaar in het vakmanschap dat uw woning of bedrijfsruimte
              transformeert. Ontdek de kwaliteit en elegantie van ons werk en laat u inspireren voor uw
              volgende project.
            </p>
          </div>
        </section>

        {/* Voordelen */}
        <section className="bg-brand-accent py-20">
          <div className="max-w-7xl mx-auto px-6">
            <h2 className="text-3xl md:text-4xl font-bold text-brand-dark mb-12 text-center">Waarom BPM Parket voor uw parketvloer?</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {voordelen.map((v, i) => (
                <div key={i} className="bg-white p-8 rounded-2xl flex items-start">
                  <div className="bg-brand-primary/10 p-3 rounded-full mr-4">
                    <Hammer className="w-6 h-6 text-brand-primary" />
                  </div>
                  <p className="text-brand-dark font-medium">{v}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Merken */}
        <section className="max-w-7xl mx-auto px-6 py-20">
          <h2 className="text-3xl md:text-4xl font-bold text-brand-dark mb-4">Onze merken</h2>
          <p className="text-lg text-brand-text mb-12">We werken met toonaangevende fabrikanten uit Europa.</p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {category.brands.map(brand => (
              <Link
                key={brand.slug}
                href={`/producten/${category.slug}/${brand.slug}`}
                className="group bg-white rounded-2xl overflow-hidden shadow hover:shadow-xl transition"
              >
                <div className="aspect-video relative overflow-hidden">
                  <Image src={brand.moodImages?.[0] || brand.logoUrl} alt={brand.name} fill className="object-cover group-hover:scale-105 transition" />
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-bold text-brand-dark mb-2">{brand.name}</h3>
                  <p className="text-sm text-brand-text">{brand.shortDescription}</p>
                </div>
              </Link>
            ))}
          </div>
        </section>

        {/* Werkwijze */}
        <section className="bg-brand-dark text-white py-20">
          <div className="max-w-7xl mx-auto px-6">
            <h2 className="text-3xl md:text-4xl font-bold mb-12 text-center">Zo werken wij</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {werkwijze.map((stap, i) => (
                <div key={i} className="bg-white/5 p-8 rounded-2xl">
                  <h3 className="text-xl font-bold mb-4 text-brand-secondary">{stap.title}</h3>
                  <p className="text-gray-300">{stap.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="max-w-4xl mx-auto px-6 py-20 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-brand-dark mb-6">Klaar voor uw nieuwe parketvloer?</h2>
          <p className="text-lg text-brand-text mb-8">Vraag een vrijblijvende offerte aan of bezoek onze showroom in Geldrop.</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button href="/offerte" variant="primary">Vraag offerte aan</Button>
            <Button href="/showroom" variant="outline">Bezoek showroom</Button>
          </div>
        </section>
      </main>
    )
  }
  ```

- [ ] **Step 21.2: Verifieer compile + visuele check**

  ```bash
  npx tsc --noEmit
  npm run dev
  ```

  Open http://localhost:3000/producten/parket-en-multiplanken — controleer dat pagina rendert.

- [ ] **Step 21.3: Commit**

  ```bash
  git add src/app/\(site\)/producten/parket-en-multiplanken/
  git commit -m "feat: create Parket en Multiplanken landing page

  Hero, intro BPM-copy, 4 voordelen, 3 merken grid, werkwijze, CTA.

  Co-Authored-By: Claude Opus 4.7 (1M context) <noreply@anthropic.com>"
  ```

---

### Task 22: PVC en Laminaat landing page

**Files:**
- Create: `src/app/(site)/producten/pvc-en-laminaat/page.tsx`

- [ ] **Step 22.1: Gebruik Task 21 template met deze substituties**

  Kopieer het volledige bestand uit Task 21 (`src/app/(site)/producten/parket-en-multiplanken/page.tsx`) naar `src/app/(site)/producten/pvc-en-laminaat/page.tsx` en pas deze velden aan:

  ```diff
  - const category = getCategoryBySlug('parket-en-multiplanken')
  + const category = getCategoryBySlug('pvc-en-laminaat')

  - title: 'Parket en Multiplanken',
  - description: 'Traditioneel parket en multiplanken van BPM Parket — Duitse, Deense en Zwitserse topkwaliteit uit Geldrop.',
  + title: 'PVC en Laminaat',
  + description: 'PVC en laminaat met duurzaamheid voor een perfecte woningafwerking — BPM Parket Geldrop.',

  - <p className="text-brand-secondary uppercase tracking-widest text-sm mb-4">Onze Specialiteit</p>
  + <p className="text-brand-secondary uppercase tracking-widest text-sm mb-4">Moderne Vloeren</p>

  - <h2>Traditioneel parket — onze kernspecialiteit sinds 1992</h2>
  + <h2>PVC en Laminaat — duurzaamheid en stijl gecombineerd</h2>

  (intro-paragrafen vervangen met:)
  + <p>PVC vloeren combineren stijl met duurzaamheid voor een perfecte woningafwerking.
  +   Of u nu kiest voor een modern laminaat, duurzame PVC-vinyl of een waterdichte hybride vloer —
  +   wij leveren en leggen alles met hetzelfde vakmanschap dat u van BPM Parket verwacht.</p>
  + <p>Van Belgische Quick-Step tot Nederlands Forbo Novilon — onze collectie dekt elk budget en elke stijl.</p>

  voordelen:
  + const voordelen = [
  +   'Waterdicht en slijtvast',
  +   'Eenvoudig onderhoud',
  +   'Diverse klik- en lijmsystemen',
  +   'Geschikt voor vloerverwarming',
  + ]

  icon in voordelen tiles: Hammer → LayoutGrid (ook import updaten)

  - <h2>Waarom BPM Parket voor uw parketvloer?</h2>
  + <h2>Waarom BPM Parket voor uw PVC of laminaat?</h2>

  - <h2>Klaar voor uw nieuwe parketvloer?</h2>
  + <h2>Klaar voor uw nieuwe PVC of laminaat vloer?</h2>
  ```

- [ ] **Step 22.2: Verifieer compile + visueel**

- [ ] **Step 22.3: Commit**

  ```bash
  git add src/app/\(site\)/producten/pvc-en-laminaat/
  git commit -m "feat: create PVC en Laminaat landing page

  Co-Authored-By: Claude Opus 4.7 (1M context) <noreply@anthropic.com>"
  ```

---

### Task 23: Buitenparket landing page

**Files:**
- Create: `src/app/(site)/producten/buitenparket/page.tsx`

- [ ] **Step 23.1: Kopieer template uit Task 21 met deze substituties**

  ```diff
  + const category = getCategoryBySlug('buitenparket')

  + title: 'Buitenparket',
  + description: 'Duurzaam buitenparket in hardhout of composiet — voor terras, vlonder en tuin. BPM Parket Geldrop.',

  icon import: import { Sun } from 'lucide-react'  (gebruik Sun i.p.v. Hammer)

  <p className="text-brand-secondary uppercase tracking-widest text-sm mb-4">Buiten Leven</p>

  <h2>Buitenparket — schoonheid en functionaliteit voor uw tuin</h2>

  Intro:
  Ons buitenparket combineert het beste van esthetiek en functionaliteit, waardoor uw terras of tuin
  een natuurlijke en warme uitstraling krijgt. Gemaakt van hoogwaardige materialen, is het ontworpen
  om weerbestendig te zijn en de elementen te trotseren, ongeacht het seizoen.

  voordelen:
  - 'FSC-gecertificeerd hardhout uit verantwoorde bron'
  - 'Composiet: onderhoudsvrij en 25 jaar garantie'
  - 'Weerbestendig — bestand tegen regen, vorst en UV'
  - 'Antislip oppervlak voor veiligheid'

  Merken sectie blijft (2 merken: Bangkirai Hardhout, Millboard Composiet)
  ```

- [ ] **Step 23.2: Verifieer + commit**

  ```bash
  git add src/app/\(site\)/producten/buitenparket/
  git commit -m "feat: create Buitenparket landing page

  Co-Authored-By: Claude Opus 4.7 (1M context) <noreply@anthropic.com>"
  ```

---

### Task 24: Legservice landing page (service — geen merken)

**Files:**
- Create: `src/app/(site)/producten/legservice/page.tsx`

- [ ] **Step 24.1: Service-variant van de template**

  Schrijf:

  ```tsx
  import { getCategoryBySlug } from '@/data/brands'
  import { Metadata } from 'next'
  import Image from 'next/image'
  import Button from '@/components/Button'
  import { Wrench, Check } from 'lucide-react'

  export const metadata: Metadata = {
    title: 'Legservice',
    description: 'Vakkundige legservice door ons eigen team — BPM Parket legt parket, PVC, laminaat en traprenovatie met precisie. Geldrop.',
  }

  export default function LegservicePage() {
    const category = getCategoryBySlug('legservice')
    if (!category) return null

    const wat = [
      'Egaliseren en voorbereiden van uw ondervloer',
      'Leggen van parket, PVC, laminaat en buitenparket',
      'Naadloos aansluiten op deuren, plinten en trappen',
      'Plinten op maat: recht, ogee, of volledig maatwerk',
      'Afwerken met kit, drempels en overgangsprofielen',
      'Opruimen en opleveren — geen troep achtergelaten',
    ]

    return (
      <main className="min-h-screen bg-brand-bg-light">
        <section className="relative h-[60vh] min-h-[500px] bg-brand-dark overflow-hidden">
          <Image src={category.imageUrl} alt={category.name} fill className="object-cover opacity-40" priority />
          <div className="relative z-10 flex flex-col justify-center h-full max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
            <p className="text-brand-secondary uppercase tracking-widest text-sm mb-4">Ons Vak</p>
            <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 max-w-3xl">{category.name}</h1>
            <p className="text-xl text-gray-200 max-w-2xl">{category.description}</p>
          </div>
        </section>

        <section className="max-w-4xl mx-auto px-6 py-20">
          <h2 className="text-3xl md:text-4xl font-bold text-brand-dark mb-6">
            Vakmanschap dat het verschil maakt
          </h2>
          <div className="prose prose-lg text-brand-text">
            <p>
              Onze legservice staat voor precisie en oog voor detail. Wij beheersen niet alleen
              de basistechnieken maar zijn gespecialiseerd in de afwerking — van naadloze overgangen
              tot stijlvolle radiator-ombouwen.
            </p>
            <p>
              Ons eigen team legt uw vloer van A tot Z. Geen onderaannemers, geen wisselende ploegen —
              dezelfde vakman van begin tot einde.
            </p>
          </div>
        </section>

        <section className="bg-brand-accent py-20">
          <div className="max-w-4xl mx-auto px-6">
            <h2 className="text-3xl md:text-4xl font-bold text-brand-dark mb-12 text-center">Wat wij voor u doen</h2>
            <ul className="space-y-4">
              {wat.map((item, i) => (
                <li key={i} className="bg-white p-6 rounded-2xl flex items-start">
                  <div className="bg-brand-primary/10 p-2 rounded-full mr-4 flex-shrink-0">
                    <Check className="w-5 h-5 text-brand-primary" />
                  </div>
                  <span className="text-brand-dark font-medium">{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </section>

        <section className="max-w-4xl mx-auto px-6 py-20 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-brand-dark mb-6">Uw vloer door vakmannen gelegd?</h2>
          <p className="text-lg text-brand-text mb-8">Vraag een vrijblijvende offerte aan of bel 06 - 534 993 61.</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button href="/offerte" variant="primary">Vraag offerte aan</Button>
            <Button href="/contact" variant="outline">Neem contact op</Button>
          </div>
        </section>
      </main>
    )
  }
  ```

- [ ] **Step 24.2: Verifieer + commit**

  ```bash
  git add src/app/\(site\)/producten/legservice/
  git commit -m "feat: create Legservice landing page (service, geen merken)

  Co-Authored-By: Claude Opus 4.7 (1M context) <noreply@anthropic.com>"
  ```

---

### Task 25: Interieurwerken landing page (service — geen merken)

**Files:**
- Create: `src/app/(site)/producten/interieurwerken/page.tsx`

- [ ] **Step 25.1: Kopieer Legservice template uit Task 24 met deze substituties**

  ```diff
  + const category = getCategoryBySlug('interieurwerken')

  + title: 'Interieurwerken',
  + description: 'Maatwerk interieurwerken — radiatorombouwen, plinten op maat, drempels en inbouwkasten. BPM Parket Geldrop.',

  <p className="text-brand-secondary uppercase tracking-widest text-sm mb-4">Maatwerk</p>

  <h2>Interieurwerken — precisie voor elke ruimte</h2>

  Intro (2 alinea's):
  Onze interieurwerken combineren esthetiek met vakmanschap. Van maatwerk radiator-ombouwen
  tot stijlvolle plinten, drempels en op maat gemaakte inbouwkasten — wij realiseren uw visie
  met precisie.

  Elk interieurwerk wordt op locatie gemaakt of aangepast. Dat garandeert dat het exact past,
  zonder compromis. We werken met massief hout, MDF en combinaties — afhankelijk van stijl en budget.

  wat lijst:
  - 'Radiatorombouwen in elke stijl (klassiek, modern, ingebouwd)'
  - 'Plinten op maat: recht, ogee, profielplinten'
  - 'Drempels in passend hout of onzichtbare overgang'
  - 'Maatwerk kastwanden en inbouwkasten'
  - 'Handgedraaide trapleuningen en balustrades'
  - 'Restauratie van bestaand houtwerk'

  Hero CTA-tekst:
  <h2>Maatwerk voor uw interieur?</h2>
  ```

- [ ] **Step 25.2: Verifieer + commit**

  ```bash
  git add src/app/\(site\)/producten/interieurwerken/
  git commit -m "feat: create Interieurwerken landing page (service, geen merken)

  Co-Authored-By: Claude Opus 4.7 (1M context) <noreply@anthropic.com>"
  ```

---

## Phase 7 — SEO

### Task 26: Update sitemap.ts + robots.ts

**Files:**
- Modify: `src/app/sitemap.ts`
- Modify: `src/app/robots.ts`

- [ ] **Step 26.1: Herschrijf sitemap.ts**

  Overschrijf `src/app/sitemap.ts` met:

  ```ts
  import { MetadataRoute } from 'next'
  import { getProjects, getDynamicPolicies } from '@/lib/site-data'
  import { categories } from '@/data/brands'

  const BASE_URL = 'https://bpmparket.nl'

  export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
      const [projects, policies] = await Promise.all([
          getProjects(100),
          getDynamicPolicies()
      ])

      const staticPages: MetadataRoute.Sitemap = [
          { url: BASE_URL, lastModified: new Date(), changeFrequency: 'weekly', priority: 1.0 },
          { url: `${BASE_URL}/over-ons`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.8 },
          { url: `${BASE_URL}/projecten`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.9 },
          { url: `${BASE_URL}/contact`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.7 },
          { url: `${BASE_URL}/offerte`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.8 },
          { url: `${BASE_URL}/showroom`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.7 },
          { url: `${BASE_URL}/privacy`, lastModified: new Date(), changeFrequency: 'yearly', priority: 0.3 },
      ]

      const categoryPages: MetadataRoute.Sitemap = categories.map(cat => ({
          url: `${BASE_URL}/producten/${cat.slug}`,
          lastModified: new Date(),
          changeFrequency: 'monthly' as const,
          priority: 0.8,
      }))

      const brandPages: MetadataRoute.Sitemap = categories.flatMap(cat =>
          cat.brands.map(brand => ({
              url: `${BASE_URL}/producten/${cat.slug}/${brand.slug}`,
              lastModified: new Date(),
              changeFrequency: 'monthly' as const,
              priority: 0.6,
          }))
      )

      const projectPages: MetadataRoute.Sitemap = projects.map((project) => ({
          url: `${BASE_URL}/projecten/${project.id}`,
          lastModified: new Date(),
          changeFrequency: 'monthly' as const,
          priority: 0.6,
      }))

      const policyPages: MetadataRoute.Sitemap = policies.map((policy) => ({
          url: `${BASE_URL}/beleid/${policy.id}`,
          lastModified: new Date(),
          changeFrequency: 'yearly' as const,
          priority: 0.4,
      }))

      return [...staticPages, ...categoryPages, ...brandPages, ...projectPages, ...policyPages]
  }
  ```

- [ ] **Step 26.2: Update robots.ts**

  Open `src/app/robots.ts`, update host/base URL naar `https://bpmparket.nl`.

- [ ] **Step 26.3: Verifieer compile**

  Run: `npx tsc --noEmit`

- [ ] **Step 26.4: Commit**

  ```bash
  git add src/app/sitemap.ts src/app/robots.ts
  git commit -m "feat: update sitemap + robots voor BPM Parket

  - Dynamic categories + brands uit data layer
  - Base URL: bpmparket.nl
  - Geen verwijderde routes meer

  Co-Authored-By: Claude Opus 4.7 (1M context) <noreply@anthropic.com>"
  ```

---

## Phase 8 — Seed scripts

### Task 27: Update seed.ts

**Files:**
- Modify: `seed.ts`

- [ ] **Step 27.1: Inspect current seed.ts**

  ```bash
  cat seed.ts
  ```

- [ ] **Step 27.2: Update project-seed data**

  Zoek de `projects` insert-array. Vervang hardcoded PVC-projecten met BPM-projecten:

  ```ts
  const bpmProjects = [
    { title: 'Klassieke Parketvloer Villa', description: 'Volledige woonkamer voorzien van eiken multiplank in visgraatmotief.', image_url: 'https://images.unsplash.com/photo-1615971677499-5467cbab01c0?q=80&w=2070&auto=format&fit=crop', category: 'parket-en-multiplanken', location: 'Eindhoven', area_size: 85, date: '2026-01-20', techniques: ['Egaliseren', 'Visgraat leggen', 'Geolied afwerken'] },
    { title: 'Modern PVC Appartement', description: 'Strak PVC in hele appartement met naadloze overgangen.', image_url: 'https://images.unsplash.com/photo-1519947486511-46149fa0a254?q=80&w=2070&auto=format&fit=crop', category: 'pvc-en-laminaat', location: 'Geldrop', area_size: 95, date: '2026-02-10', techniques: ['Egaliseren', 'PVC-klik leggen'] },
    { title: 'Traprenovatie Massief Eiken', description: 'Oude tapijt-trap vervangen door massief eiken overzettreden.', image_url: 'https://images.unsplash.com/photo-1503174971373-b1f69850bded?q=80&w=2070&auto=format&fit=crop', category: 'traprenovatie', location: 'Nuenen', area_size: 0, date: '2026-02-25', techniques: ['Demontage tapijt', 'Overzettreden monteren'] },
    { title: 'Buitenparket Terras', description: 'Bangkirai terras 50m² — volledig op maat gezaagd.', image_url: 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?q=80&w=2070&auto=format&fit=crop', category: 'buitenparket', location: 'Waalre', area_size: 50, date: '2026-03-15', techniques: ['Fundering', 'Bangkirai leggen', 'Olie-afwerking'] },
  ]
  ```

  Vervang ook eventuele testimonials-seeds met BPM-reviews uit Task 15.5.

- [ ] **Step 27.3: Verifieer compile**

- [ ] **Step 27.4: Commit**

  ```bash
  git add seed.ts
  git commit -m "feat: update seed.ts met BPM project voorbeelden

  Co-Authored-By: Claude Opus 4.7 (1M context) <noreply@anthropic.com>"
  ```

---

### Task 28: Update seed-prod.ts

**Files:**
- Modify: `seed-prod.ts`

- [ ] **Step 28.1: Update content**

  Zelfde substituties als Task 27 — vervang PVC-projecten door BPM-projecten (zie Task 27 array). Zorg dat Supabase URL en key via env vars komen (al gedaan in eerder fix).

- [ ] **Step 28.2: Verifieer compile**

- [ ] **Step 28.3: Commit**

  ```bash
  git add seed-prod.ts
  git commit -m "feat: update seed-prod.ts met BPM project voorbeelden

  Co-Authored-By: Claude Opus 4.7 (1M context) <noreply@anthropic.com>"
  ```

---

## Phase 9 — Verificatie

### Task 29: Full smoke test

**Files:**
- None (alleen verificatie)

- [ ] **Step 29.1: TypeScript check**

  ```bash
  npx tsc --noEmit
  ```

  Expected: geen errors.

- [ ] **Step 29.2: Lint check**

  ```bash
  npm run lint 2>&1 | tail -20
  ```

  Expected: geen errors (waarschuwingen acceptabel).

- [ ] **Step 29.3: Dev server start**

  ```bash
  npm run dev
  ```

  Wacht tot je ziet: "✓ Ready in ..."

- [ ] **Step 29.4: Smoke-test alle routes**

  Open in browser:
  - http://localhost:3000/ → homepage met BPM branding
  - http://localhost:3000/over-ons → verhaal sinds 1992
  - http://localhost:3000/showroom → Geldrop adres
  - http://localhost:3000/contact → BPM contactgegevens
  - http://localhost:3000/offerte → form met 6 BPM-diensten
  - http://localhost:3000/projecten → projecten lijst
  - http://localhost:3000/producten/parket-en-multiplanken → 3 merken + werkwijze
  - http://localhost:3000/producten/pvc-en-laminaat → 3 merken
  - http://localhost:3000/producten/legservice → service pagina zonder merken-grid
  - http://localhost:3000/producten/traprenovatie → 2 merken
  - http://localhost:3000/producten/buitenparket → 2 merken
  - http://localhost:3000/producten/interieurwerken → service pagina
  - http://localhost:3000/producten/parket-en-multiplanken/ter-hurne → brand detail

  Controleer dat:
  - Alle pagina's renderen zonder errors
  - Kleuren zijn warmbruin (#865D41) niet PVC-groen
  - Navbar mega-menu toont 6 BPM-diensten
  - Footer heeft BPM adres, 6 diensten, slogan "Vakmanschap tot in detail"

- [ ] **Step 29.5: Verwijderde routes geven 404**

  Open (moeten 404 geven):
  - http://localhost:3000/producten/pvc-vloeren → 404
  - http://localhost:3000/producten/raamdecoratie → 404
  - http://localhost:3000/producten/gordijnen → 404
  - http://localhost:3000/producten/houten-vloeren → 404
  - http://localhost:3000/producten/vloerbedekking → 404
  - http://localhost:3000/actievloeren → 404

- [ ] **Step 29.6: Zoek op oude client-content**

  ```bash
  grep -rn "PVC Vloeren Achterhoek\|Doetinchem\|Logistiekweg" src/ 2>/dev/null | head -20
  ```

  Expected: geen hits in src/. Als er hits zijn: fix en commit als bug-fix.

  ```bash
  grep -rn "pvcvloerenachterhoek.nl" src/ 2>/dev/null | head -10
  ```

  Expected: geen hits.

- [ ] **Step 29.7: Stop dev server + commit finale check**

  Ctrl+C to stop. Dan:

  ```bash
  git status
  ```

  Als er nog untracked of modified files zijn: stage en commit. Anders: done.

- [ ] **Step 29.8: Push naar origin**

  ```bash
  git push origin main
  ```

  Verifieer in browser: https://github.com/martxvr/bpm-parket-2026-2 toont alle commits.

- [ ] **Step 29.9: Finale task-lijst voor klant (out-of-scope)**

  Noteer in session-transcript de nog uitstaande klant-acties:
  - Echte logo (SVG/PNG) leveren → `public/logo.png` + `public/footer-logo.png`
  - Definitieve openingstijden
  - Echte productfoto's per merk (vervang Unsplash URLs)
  - Echte BPM-projectfoto's toevoegen via admin
  - Linkedin URL (optioneel)
  - Supabase project aanmaken + env vars vullen + `seed.ts` runnen
  - Domein `bpmparket.nl` koppelen aan Vercel deployment
  - Apify API token + Anthropic API key roteren (waren al exposed in oude repo)

---

## Done Criteria

- [ ] Alle 29 tasks voltooid
- [ ] `npx tsc --noEmit` passeert
- [ ] `npm run lint` passeert (waarschuwingen OK)
- [ ] `npm run dev` start zonder fouten
- [ ] Alle 6 dienst-pages renderen
- [ ] Alle verwijderde routes geven 404
- [ ] Geen references naar "PVC Vloeren Achterhoek", "Doetinchem", "Achterhoek", "Logistiekweg" in src/
- [ ] `git push origin main` gelukt
- [ ] Commit log toont chronologische, logisch gegroepeerde commits

## Commit-log verwacht aantal

Ongeveer **20-25 commits**: elke task 1 commit (sommige tasks zijn split).
