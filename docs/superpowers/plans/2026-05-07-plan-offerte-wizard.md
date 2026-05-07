# Plan: Offerte Wizard

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Vervang `/offerte` single-form door een 5-stappen wizard (Type Vloer → Merk → Variant → Oppervlakte → Contact), screenshot-geïnspireerd, met BPM Parket Vite styling. Skip-logica voor stappen 2 en 3 op basis van data en gebruikerskeuzes. Bestaande server action en validatie ongewijzigd.

**Architecture:** Eén nieuwe client component `LeadFormWizard.tsx` met intern useState-driven step machine. Page-laag rendert sidebar (dynamisch step-state via prop callback OF via context — keep it simple: alles in wizard, page is alleen layout-shell). Submit via bestaande `createLeadAction`.

**Tech Stack:** Next.js 16 client components, Tailwind v4 met Vite tokens, lucide-react.

**Spec reference:** [docs/superpowers/specs/2026-05-07-offerte-wizard-design.md](../specs/2026-05-07-offerte-wizard-design.md)

**Working directory:** `/Users/martijnvervoort/Desktop/Code/bpm-parket-next-migration` op `vite-design-port` branch.

---

## File structure

```
components/forms/
  LeadFormWizard.tsx                CREATE  (5-step wizard, single client component)
app/(public)/offerte/
  page.tsx                          REWRITE (layout shell, renders LeadFormWizard)
```

**Niet aanraken:**
- `components/forms/LeadForm.tsx` (gebruikt door contact, landing-pvc)
- `actions/leads.ts`
- `app/api/brands/by-service/route.ts`
- `lib/validation/forms.ts`

---

## Phase A: Wizard component scaffold

### Task 1: Create LeadFormWizard.tsx skeleton

**Files:** `components/forms/LeadFormWizard.tsx` (CREATE)

- [ ] `'use client'`
- [ ] Imports: `useActionState`, `useEffect`, `useMemo`, `useState`, `useSearchParams`, `lucide-react` icons (see spec table), `createLeadAction`, `trackConversion`, `companyConfig`
- [ ] Define types:

```ts
type FloorType = {
  value: string;          // 'pvc', 'traditioneel', etc.
  service_slug: string;   // matches services.slug, '' for 'anders'
  label: string;
  sub: string;
  Icon: LucideIcon;
};

type BrandOpt = {
  id: string;
  slug: string;
  name: string;
  logo_url?: string | null;
  products: Array<{ id: string; slug: string; name: string; hero_image?: string | null; specs?: Record<string,string> }>;
};
```

> Note: `/api/brands/by-service` currently only returns `id, slug, name, products[id,slug,name]`. We need richer data (logo_url, hero_image, specs) for the wizard cards. **Extend the API response in Task 2.**

- [ ] Constant `FLOOR_TYPES: FloorType[]` per spec table (LayoutGrid, TreePine, AlignJustify, Layers, ArrowUpFromLine, Sparkles, HelpCircle)
- [ ] State hooks:
  ```ts
  const searchParams = useSearchParams();
  const [step, setStep] = useState(1);
  const [floorValue, setFloorValue] = useState(searchParams.get('floor_type') ?? '');
  const [brandSlug, setBrandSlug] = useState(searchParams.get('brand') ?? '');
  const [productSlug, setProductSlug] = useState(searchParams.get('product') ?? '');
  const [area, setArea] = useState(50);
  const [voornaam, setVoornaam] = useState('');
  const [achternaam, setAchternaam] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [message, setMessage] = useState('');
  const [brands, setBrands] = useState<BrandOpt[]>([]);
  ```
- [ ] Memo `floorEntry`, `serviceSlug`, `selectedBrand`, `selectedProduct`
- [ ] Effect: when `serviceSlug` changes, fetch brands (same as existing LeadForm)
- [ ] Effect: URL-prefill auto-advance — initial step calculation (one-time), see spec section 7
- [ ] Render: outer flex layout (sidebar + main pane). For now return placeholder text per step. We'll fill in later tasks.
- [ ] `pnpm tsc --noEmit` — must compile

---

### Task 2: Extend /api/brands/by-service response

**Files:** `app/api/brands/by-service/route.ts` (MODIFY)

- [ ] Read current implementation
- [ ] Update select clause to include `logo_url` on brands and `hero_image, specs` on products
- [ ] Update returned shape:
  ```ts
  brands: [
    {
      id, slug, name, logo_url,
      products: [{ id, slug, name, hero_image, specs }]
    }
  ]
  ```
- [ ] Keep public read (no auth required), keep filter on `is_active`
- [ ] Existing LeadForm.tsx consumes only `id, slug, name, products[id,slug,name]` — extra fields are additive, no breakage

---

## Phase B: Sidebar + step navigation

### Task 3: Sidebar component

**Inline in LeadFormWizard.tsx** (do not create separate file).

- [ ] Component `<Sidebar>` (or inline JSX block), props: `currentStep`, `serviceLabel` (e.g. "PVC VLOEREN ACHTERHOEK" or empty)
- [ ] Layout per spec section 4:
  - Top: service-label uppercase rood (`text-brand-red font-bold tracking-wide`) — empty string → render nothing
  - "Jouw Offerte" h2 `text-4xl font-bold text-brand-dark`
  - Sub paragraph `text-sm text-brand-dark/60`
  - 5 step rows: circle (40px) + label
  - Step states:
    - Active (`step === currentStep`): `bg-brand-red text-white` + nummer
    - Completed (`step < currentStep`): `bg-brand-dark text-white` + `<Check size={16} />`
    - Pending (`step > currentStep`): `bg-gray-200 text-gray-500` + nummer
  - Active label: `font-bold text-brand-dark`. Inactive: `text-gray-400`
- [ ] Bottom contact card: `bg-white border border-gray-200 rounded-xl p-4 mt-auto`
  - "HEB JE EEN VRAAG?" caption rood `text-xs font-bold uppercase text-brand-red`
  - Phone (`companyConfig.contact.phone`) bold
  - Email (`companyConfig.contact.email`) text-gray
- [ ] Service-label derivation: bij stap 2-4, toon huidige service title uppercase + " ACHTERHOEK"? **Beslissing**: gebruik gewoon brand-naam ("BPM PARKET") of laat leeg op stap 1+5 — pragmatic: laat leeg, helemaal weg. Spec is niet hard hierin. Implementer mag oordelen; default = leeg.

---

### Task 4: Footer nav buttons

**Inline in LeadFormWizard.tsx** below the right-pane content.

- [ ] Layout: `flex justify-between items-center pt-8 border-t border-gray-100 mt-12`
- [ ] Left: "← Vorige stap" — `text-sm font-medium text-brand-dark/60 hover:text-brand-dark`
  - Hidden on step 1
  - onClick: `setStep(prevStepWithSkip(step, ...))` — see helper below
- [ ] Right: "Volgende stap →" rounded-full button
  - Steps 1-4: `bg-brand-dark text-white px-6 py-3 rounded-full font-bold`. Disabled style if no selection
  - Step 5: text wordt "Verstuur aanvraag", color `bg-brand-red`. Disabled while pending
- [ ] Helper functions inside component:
  ```ts
  const canAdvance = (s: number): boolean => {
    if (s === 1) return Boolean(floorValue);
    if (s === 2) return Boolean(brandSlug);  // includes 'nog-geen-idee' sentinel
    if (s === 3) return Boolean(productSlug); // includes 'nog-geen-idee'
    if (s === 4) return area > 0;
    return true;
  };
  const nextStep = (s: number): number => {
    let n = s + 1;
    if (n === 2 && (floorValue === 'anders' || brands.length === 0)) n = 3;
    if (n === 3 && (brandSlug === 'nog-geen-idee' || !selectedBrand?.products.length)) n = 4;
    return Math.min(n, 5);
  };
  const prevStep = (s: number): number => {
    let n = s - 1;
    if (n === 3 && (brandSlug === 'nog-geen-idee' || !selectedBrand?.products.length)) n = 2;
    if (n === 2 && (floorValue === 'anders' || brands.length === 0)) n = 1;
    return Math.max(n, 1);
  };
  ```
- [ ] Use sentinel string `'nog-geen-idee'` for "Nog geen idee" tile selection. Hidden form field translates this to empty `brand_id`/`product_id`

---

## Phase C: Step content

### Task 5: Step 1 — Type Vloer cards

- [ ] Heading: `Waar ben je naar op zoek?` `text-3xl md:text-4xl font-bold text-brand-dark`
- [ ] Sub: `Kies de hoofdcategorie van je gewenste renovatie.` `text-base text-brand-dark/60 mt-2`
- [ ] Grid `grid-cols-2 md:grid-cols-3 gap-4 mt-10`
- [ ] Per card (button):
  - Layout: `p-6 rounded-2xl border-2 transition-all`
  - Default: `border-gray-200 hover:border-brand-red/40 bg-white`
  - Selected: `border-brand-red bg-brand-red/5`
  - Inside: icon-bolletje (`w-12 h-12 rounded-full flex items-center justify-center`)
    - Default: `bg-gray-100 text-brand-dark/60`
    - Selected: `bg-brand-red text-white`
  - `<Icon size={24} />`
  - Title: `text-lg font-bold text-brand-dark mt-6`
  - Sub: `text-sm text-brand-dark/60 mt-1`
  - Selected check (top-right absolute): `<CheckCircle2 className="text-brand-red" />`
- [ ] onClick: `setFloorValue(t.value); resetDownstream()`

---

### Task 6: Step 2 — Kies Merk grid

- [ ] Heading: `Heb je een voorkeur voor een merk?`
- [ ] Sub: `Kies een van onze {service title} merken of sla deze stap over.`
- [ ] Grid `grid-cols-2 md:grid-cols-3 gap-4 mt-10`
- [ ] Per brand card (button):
  - `aspect-[3/2] flex items-center justify-center bg-white rounded-2xl border-2 p-6 transition-all`
  - Default border `border-gray-200 hover:border-brand-red/40`
  - Selected `border-brand-red bg-brand-red/5`
  - Inside: `<Image src={b.logo_url} alt={b.name} width={140} height={70} className="object-contain max-h-12">` of fallback `<span className="text-xl font-bold text-brand-dark">{b.name}</span>`
- [ ] Last card: "Nog geen idee" with `<Package size={32} className="text-gray-400 mb-2" /> <span>Nog geen idee</span>`. onClick: `setBrandSlug('nog-geen-idee')`. Selected = same red border treatment
- [ ] onClick brand: `setBrandSlug(b.slug); setProductSlug('')`

---

### Task 7: Step 3 — Kies Variant grid

- [ ] Heading: `Kies de uitstraling!`
- [ ] Sub: `Welke collectie of specifieke variant van {selectedBrand.name} vind je het mooist?`
- [ ] Grid `grid-cols-2 md:grid-cols-3 gap-4 mt-10`
- [ ] Per product card (button):
  - `rounded-2xl border-2 overflow-hidden bg-white transition-all`
  - Default `border-gray-200 hover:border-brand-red/40`
  - Selected `border-brand-red`
  - Image: `<div className="aspect-[4/3] relative bg-gray-100"><Image src={p.hero_image ?? FALLBACK} fill className="object-cover" /></div>`
  - Footer: `p-4`
    - Title: `font-bold text-brand-dark`
    - Sub: `text-xs uppercase text-brand-dark/50 tracking-wide mt-1` — `{specs.Legsysteem ?? 'Bekijk variant'}`
- [ ] FALLBACK constante voor product zonder image: gebruik 1px transparent or grijs vlak (`bg-gray-200`)
- [ ] Last card optie: "Nog geen idee" met `<Package />` icon — `setProductSlug('nog-geen-idee')`

---

### Task 8: Step 4 — Oppervlakte slider

- [ ] Heading: `Hoe groot is de oppervlakte?`
- [ ] Sub: `Geef een schatting van het aantal vierkante meters in totaal.`
- [ ] Centered display:
  ```jsx
  <div className="text-center py-12">
    <span className="text-7xl md:text-8xl font-bold text-brand-red">{area}</span>
    <span className="text-2xl text-brand-red/70 ml-2">m²</span>
  </div>
  ```
- [ ] Slider:
  ```jsx
  <input
    type="range"
    min={10}
    max={500}
    step={5}
    value={area}
    onChange={(e) => setArea(Number(e.target.value))}
    className="w-full accent-brand-red"
  />
  <div className="flex justify-between text-xs text-brand-dark/60 mt-2">
    <span>10 M²</span><span>250 M²</span><span>500+ M²</span>
  </div>
  ```
- [ ] Info card below:
  ```jsx
  <div className="mt-12 bg-blue-50 border border-blue-100 rounded-xl p-4 flex gap-3">
    <CheckCircle2 className="text-blue-500 mt-0.5 shrink-0" size={20} />
    <div>
      <p className="font-bold text-brand-dark">Meerdere ruimtes of trappen?</p>
      <p className="text-sm text-brand-dark/70 mt-1">Je kunt dit straks in de laatste stap eenvoudig doorgeven via het opmerkingenveld!</p>
    </div>
  </div>
  ```

---

### Task 9: Step 5 — Contactgegevens form

- [ ] Heading: `Bijna klaar! 🎉`
- [ ] Sub: `Laat je gegevens achter en we maken een prachtige offerte op maat voor je.`
- [ ] Choice summary chip (alleen tonen als floorValue is gekozen):
  ```jsx
  <div className="bg-gray-50 rounded-xl p-4 mt-6 text-sm">
    <span className="text-brand-dark/50 uppercase font-bold tracking-wide mr-2">Keuze:</span>
    <span className="font-bold text-brand-dark">{floorEntry.label}</span>
    {selectedBrand && brandSlug !== 'nog-geen-idee' && (
      <>
        <span className="text-brand-dark/30 mx-2">/</span>
        <span className="font-bold text-brand-dark">{selectedBrand.name}</span>
      </>
    )}
    {selectedProduct && productSlug !== 'nog-geen-idee' && (
      <>
        <span className="text-brand-dark/30 mx-2">/</span>
        <span className="font-bold text-brand-red">{selectedProduct.name}</span>
      </>
    )}
  </div>
  ```
- [ ] Form fields (controlled inputs, NOT inside a `<form>` with action — submit via button onClick → FormData construct → `formAction`):

  Actually use `useActionState` with a `<form>` element and hidden inputs for the wizard state. Simpler. Wrap step 5 contents in a `<form action={formAction}>`:
  ```jsx
  <form action={formAction}>
    {/* honeypot */}
    <input type="text" name="website" tabIndex={-1} autoComplete="off"
      className="absolute opacity-0 -left-[9999px]" aria-hidden />
    <input type="hidden" name="source" value="quote-wizard" />
    <input type="hidden" name="brand_id" value={selectedBrand && brandSlug !== 'nog-geen-idee' ? selectedBrand.id : ''} />
    <input type="hidden" name="product_id" value={selectedProduct && productSlug !== 'nog-geen-idee' ? selectedProduct.id : ''} />
    <input type="hidden" name="floor_type" value={floorValue} />
    <input type="hidden" name="area_size" value={area} />
    <input type="hidden" name="name" value={`${voornaam} ${achternaam}`.trim()} />

    <div className="grid grid-cols-2 gap-4 mt-6">
      <Input label="Voornaam *" value={voornaam} onChange={setVoornaam} required />
      <Input label="Achternaam *" value={achternaam} onChange={setAchternaam} required />
    </div>
    <Input label="Emailadres *" type="email" name="email" value={email} onChange={setEmail} required />
    <Input label="Telefoonnummer *" type="tel" name="phone" value={phone} onChange={setPhone} required />
    <Textarea label="Aanvullende wensen (optioneel)" name="message" value={message} onChange={setMessage} placeholder="Bijv. plinten gewenst, we hebben vloerverwarming, etc..." />

    {/* Submit button is the wizard's "Verstuur aanvraag" — render it inside the form,
        but layout it via the footer nav. Simplest: render submit button inside form,
        keep "vorige stap" button outside but in same flex row via grid trick.
        OR: keep <form> wrapping the entire right-pane on step 5 only. */}
  </form>
  ```

  **Decision:** wrap the entire step-5 right-pane (heading + chip + form + footer-nav) in `<form action={formAction}>`. On steps 1-4, render footer-nav as plain buttons. Submit button on step 5 = `<button type="submit">Verstuur aanvraag</button>`.

- [ ] Inputs: rounded-xl border `border-gray-200 px-4 py-3 text-base focus:border-brand-red outline-none`
- [ ] Labels: `text-xs font-bold uppercase tracking-widest text-brand-dark/60 mb-2`

---

### Task 10: Success + error states

- [ ] If `state.status === 'success'`: full-pane success card:
  ```jsx
  <div className="bg-green-50 border-2 border-green-200 rounded-2xl p-12 text-center">
    <h2 className="text-3xl font-bold text-brand-dark">Bedankt! 🎉</h2>
    <p className="mt-4 text-brand-dark/70">We nemen binnen 24 uur contact op.</p>
  </div>
  ```
  Sidebar should show all 5 steps as completed (dark + check).
- [ ] If `state.status === 'error'`: error message above submit button on step 5:
  ```jsx
  <p className="text-sm text-red-700 mt-4" role="alert">{state.message}</p>
  ```
- [ ] On success: `trackConversion({ name: 'lead_submit', source: 'quote-wizard', brand: brandSlug !== 'nog-geen-idee' ? brandSlug : undefined, product: productSlug !== 'nog-geen-idee' ? productSlug : undefined })`

---

## Phase D: Page rewrite + verify

### Task 11: Rewrite /offerte page

**Files:** `app/(public)/offerte/page.tsx` (REWRITE)

- [ ] Strip the static sidebar — it's now inside the wizard
- [ ] Page becomes minimal shell:

```tsx
import { Suspense } from 'react';
import type { Metadata } from 'next';
import { LeadFormWizard } from '@/components/forms/LeadFormWizard';

export const metadata: Metadata = {
  title: 'Offerte aanvragen',
  description:
    'Vraag vrijblijvend een offerte aan voor je vloer of traprenovatie. Reactie binnen 24 uur.',
};

export default function QuotePage() {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4 sm:px-6">
      <div className="bg-white w-full max-w-6xl rounded-[2rem] shadow-2xl overflow-hidden flex flex-col lg:flex-row min-h-[700px]">
        <Suspense fallback={null}>
          <LeadFormWizard />
        </Suspense>
      </div>
    </div>
  );
}
```

- [ ] LeadFormWizard component is responsible for rendering BOTH sidebar and main pane (so it can share state). Internal layout: `<aside>` + `<main>` inside one `<>`.

---

### Task 12: Build + smoke test

- [ ] `pnpm tsc --noEmit` clean
- [ ] `pnpm build` clean
- [ ] `pnpm dev` — visit `/offerte`:
  - Stap 1 → kies "PVC Vloeren" → Volgende → moet stap 2 met merken tonen
  - Stap 2 → kies een merk (bv. "Sense") → Volgende → stap 3 met varianten
  - Stap 3 → kies een variant → Volgende → stap 4 oppervlakte slider
  - Slider werkt, "Volgende" → stap 5 contactgegevens
  - Choice summary chip toont brand + variant
  - Vul form in → Verstuur → success state
  - Vorige stap-knop werkt achterwaarts via skip-logica
- [ ] Test skip-pad: stap 1 → "Anders / weet ik nog niet" → moet direct naar stap 4
- [ ] Test skip-pad: stap 1 → "Traprenovatie" (geen merken) → direct naar stap 4
- [ ] Test skip-pad: stap 2 → "Nog geen idee" → direct naar stap 4
- [ ] Test URL prefill: `/offerte?floor_type=pvc&brand=sense` → moet starten op stap 3
- [ ] Test brand-detail link: visit `/merken/sense`, klik "Offerte aanvragen" CTA, moet `/offerte?brand=sense` openen — wizard start op stap 1, brand bewaard in state. Bij stap 2 moet sense al geselecteerd zijn (mits floor_type ook in URL of pre-selectie via brand → first product service)
- [ ] Use Playwright MCP to take screenshots of stap 1 / 2 / 3 / 4 / 5 op desktop (1280px) en mobile (375px)
- [ ] Responsive check: sidebar stacked op mobile, content scrollt

---

### Task 13: Commit + push

- [ ] `git status` — verwacht: 1 nieuwe component + 1 modified page + 1 modified API route
- [ ] `git add components/forms/LeadFormWizard.tsx app/\(public\)/offerte/page.tsx app/api/brands/by-service/route.ts`
- [ ] Commit:

```
feat: 5-step offerte wizard with brand/variant cascade

Replace single-form /offerte page with multi-step wizard inspired by
Bodhi's reference screenshots (Type Vloer → Merk → Variant → Oppervlakte
→ Contact). Skip-logic for floors without brands and "weet ik nog niet"
choices. URL prefill supported. Existing createLeadAction unchanged.
Extended /api/brands/by-service to include logo_url and product
hero_image + specs for richer cards.

Spec: docs/superpowers/specs/2026-05-07-offerte-wizard-design.md
```

- [ ] `git push origin vite-design-port`

---

## Out of scope

- Geen wijziging aan `LeadForm.tsx` (contact, landing-pvc blijven gewoon)
- Geen nieuwe DB velden, geen migration
- Geen save-progress / resume na refresh
- Geen GA4 step-tracking (alleen final lead_submit)
- Geen confetti animatie

---

## Estimated work

- 1 wizard component: ~500-700 regels
- 1 page rewrite: ~25 regels
- 1 API route extension: ~10 regels delta

**Tijd: 2-3 uur subagent-driven flow.**
