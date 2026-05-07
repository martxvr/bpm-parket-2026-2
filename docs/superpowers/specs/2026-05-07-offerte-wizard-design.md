# Offerte Wizard — Design Spec

**Date:** 2026-05-07
**Status:** Approved, ready for implementation
**Owner:** Martijn (dev), Bodhi van Baar (klant)

## 1. Goal

Vervang de single-form `/offerte` pagina door een 5-stappen wizard, geïnspireerd
op screenshots van PVC Vloeren Achterhoek, met BPM Parket Vite styling
(brand-red `#E21E26`, brand-dark, Outfit). Multi-step flow leidt gebruiker
gestructureerd door type vloer → merk → variant → oppervlakte → contactgegevens.

## 2. Stappen + skip-logica

| # | Stap            | Skip-conditie                                                    |
|---|-----------------|------------------------------------------------------------------|
| 1 | Type Vloer      | nooit                                                             |
| 2 | Kies Merk       | floorType = "anders" OF service heeft geen merken (traprenovatie, schuren) |
| 3 | Kies Variant    | stap 2 geskipt OF brand = "nog geen idee" OF brand heeft geen producten in service |
| 4 | Oppervlakte     | nooit                                                             |
| 5 | Contactgegevens | nooit                                                             |

Sidebar toont altijd 5 stappen. Overgeslagen stappen worden niet weergegeven als
"check" maar als grijze pending state — user passeert ze gewoon programmatic.

## 3. Stap details

### Stap 1: Type Vloer

7 kaarten in 2-col (mobile) / 3-col (desktop) grid:

| value             | service slug         | label                  | sub                                  | lucide icon         |
|-------------------|----------------------|------------------------|--------------------------------------|---------------------|
| pvc               | pvc-vloeren          | PVC Vloeren            | Stijlvol en onderhoudsvriendelijk    | `LayoutGrid`        |
| traditioneel      | traditioneel-parket  | Traditioneel Parket    | Tijdloze warmte van echt hout        | `TreePine`          |
| multiplanken      | multiplanken         | Multiplanken           | Brede planken, robuuste look         | `AlignJustify`      |
| laminaat          | laminaat             | Laminaat               | Betaalbaar en duurzaam               | `Layers`            |
| traprenovatie     | traprenovatie        | Traprenovatie          | Geef uw trap een nieuw leven         | `ArrowUpFromLine`   |
| schuren           | schuren-onderhoud    | Schuren & Onderhoud    | Maak uw vloer weer als nieuw         | `Sparkles`          |
| anders            | (none)               | Anders / weet ik nog niet | We helpen u graag verder           | `HelpCircle`        |

Selected state: rood border + rood gevuld icon-bolletje + check-vinkje rechtsboven.

### Stap 2: Kies Merk

Grid 2-col / 3-col met logo-cards. Brands worden gefetcht via bestaande
`/api/brands/by-service?service={slug}` route. Cards tonen logo (of brand-naam
fallback). Plus laatste tegel: "Nog geen idee" met `Package` icon.

Empty state: als service geen merken heeft (`brands.length === 0`), wordt deze
stap programmatic geskipt — sidebar springt door naar Oppervlakte.

### Stap 3: Kies Variant

Grid 2-col / 3-col met product-variant cards: foto + naam + sub (legsysteem uit
`product.specs.Legsysteem` of fallback "Bekijk variant"). Producten gefilterd op
`brand_id × service_id` via dezelfde API response (al ingebed in brand opt).

### Stap 4: Oppervlakte

Centered slider 10-500+ m², default 50. Grote groene/rode `{value} m²` boven.
Info-card eronder: "Meerdere ruimtes of trappen? Geef dit straks aan in stap 5."

### Stap 5: Contactgegevens

- Choice summary chip bovenaan: `KEUZE: {Brand} / {Variant}` (alleen tonen velden
  die geselecteerd zijn)
- Form: voornaam + achternaam (samen → `name` veld voor backend), email, telefoon,
  bericht (optioneel, placeholder "Bijv. plinten gewenst, vloerverwarming, ...")
- Submit → `createLeadAction` (existing) met:
  - `name`: `${voornaam} ${achternaam}`
  - `email`, `phone`, `message`
  - `floor_type`: floor value (string)
  - `area_size`: number from slider
  - `brand_id`, `product_id`: hidden, from state
  - `source`: `'quote-wizard'`
  - `website`: honeypot

## 4. Layout

Screenshot-style centered card:
- Outer: `min-h-screen bg-gray-50 flex items-center justify-center py-12`
- Card: `bg-white max-w-6xl rounded-[2rem] shadow-2xl overflow-hidden flex flex-col lg:flex-row min-h-[700px]`

### Left sidebar (lg:w-1/3, bg-gray-50)

```
┌─────────────────────────────┐
│ {SERVICE TITEL UPPERCASE}   │  ← rood, dynamisch bij stap 2-4
│                             │     (e.g. "PVC VLOEREN", anders blank)
│ Jouw Offerte                │  ← grote heading
│ Stel eenvoudig je ideale    │  ← subtitle
│ droomvloer samen. Wij ...   │
│                             │
│ ① Type Vloer                │  ← circle: rood (active) /
│ ② Kies Merk                 │     dark+check (done) / gray (pending)
│ ③ Kies Variant              │
│ ④ Oppervlakte               │
│ ⑤ Contactgegevens           │
│                             │
│ ┌────────────────────┐      │
│ │ HEB JE EEN VRAAG?  │      │  ← contact card
│ │ 06 - xxx xxx xx    │      │     uses companyConfig
│ │ info@bpmparket.nl  │      │
│ └────────────────────┘      │
└─────────────────────────────┘
```

Step-circle states (visualized links):
- Active (current): `bg-brand-red text-white` met nummer
- Completed: `bg-brand-dark text-white` met `<Check />` icon
- Pending: `bg-gray-200 text-gray-500` met nummer

### Right pane (lg:w-2/3)

Header: `text-3xl/4xl font-bold` heading + subtitle paragraaf.
Body: stap-specifieke content (cards/grid/slider/form).
Footer: bottom row met `Vorige stap ←` (text-only, links) en `Volgende stap →`
(filled `bg-brand-dark text-white rounded-full px-6 py-3`, rechts).

Op stap 1: geen "Vorige stap" knop. Op stap 5: knop wordt "Verstuur aanvraag"
(rood `bg-brand-red`).

## 5. Tech

- Single client component `components/forms/LeadFormWizard.tsx`
- State: `useState` hooks voor step, floorType, brandSlug, productSlug, area, contact fields
- Brand/product fetch via existing `/api/brands/by-service` route
- Submission via existing `createLeadAction` server action (geen wijziging)
- URL prefill nog steeds ondersteund: `?floor_type=pvc`, `?brand=sense`,
  `?product=sense-pvc-collectie` — wizard skipt automatisch naar de juiste stap
  als alles is meegegeven (defaults applied via useState initializer)

## 6. Wat blijft, wat gaat weg

### Behoud
- `actions/leads.ts` `createLeadAction` ongewijzigd
- `/api/brands/by-service` route ongewijzigd
- Honeypot, rate limiting, email side-effects via bestaande pipeline
- `Suspense` wrapper op `useSearchParams`

### Vervangen
- `app/(public)/offerte/page.tsx` — sidebar layout blijft, maar steps worden
  dynamisch (1-5 ipv 1-3), heading-tekst weg uit page (live nu in wizard)
- `components/forms/LeadForm.tsx` blijft bestaan voor andere pagina's
  (contact, landing-pvc) — niet aanraken
- Nieuw: `components/forms/LeadFormWizard.tsx`

## 7. URL prefill matrix

| URL                              | Initial step                  |
|----------------------------------|-------------------------------|
| `/offerte`                       | 1 (Type Vloer)                |
| `/offerte?floor_type=pvc`        | 2 (Kies Merk, PVC preselected)|
| `/offerte?brand=sense`           | 1 (geen floor_type → start)   |
| `/offerte?floor_type=pvc&brand=sense` | 3 (Kies Variant)         |
| `/offerte?floor_type=pvc&brand=sense&product=sense-pvc-collectie` | 4 (Oppervlakte) |

Brand-detail page CTAs werken zonder wijziging (linken al naar
`/offerte?brand=${slug}` — wizard moet floor_type uit brand's first product
aanleiden? Nee — als brand zonder floor_type komt, gewoon op stap 1 starten en
brand-pre-select bewaren in state).

## 8. Out of scope

- Geen DB schema wijziging
- Geen wijziging aan andere LeadForm gebruikers (contact, landing-pvc)
- Geen confetti animatie of visuele easter eggs (gebruik gewoon "Bijna klaar! 🎉" emoji per screenshot)
- Geen GA4 step-tracking (alleen final `lead_submit` zoals nu)
- Geen save-progress / resume — refresh = restart

## 9. Estimated work

- 1 wizard component (~500-700 regels)
- 1 page rewrite (~80 regels)
- 7 stap-componenten inline of als sub-components (judgment call van implementer)

**Tijd: ~3 uur in subagent-driven flow.**
