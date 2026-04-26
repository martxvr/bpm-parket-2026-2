# PVC Vloeren Landing Page — Hormozi Direct Response Design

## Goal

Build a single-page Google Ads landing funnel focused on PVC vloeren for BPM Parket. The one and only conversion action is booking a free showroom appointment. No navigation, no exit links, no distractions.

## Context

- **Company:** BPM Parket, Hooge Akker 19, Geldrop — vader & zoon (Bodhi & Wil van Baar)
- **Phone:** 040 123 4567
- **Social proof:** 5/5 Google rating, 25 reviews
- **Target audience:** Google Ads visitors actively searching for PVC vloeren in the Geldrop/Eindhoven region
- **Primary offer:** Gratis vrijblijvend showroombezoek + offerte op maat
- **Lead capture:** Inline form (naam, telefoonnummer, gewenste datum)

## Approach

Hormozi Direct Response (Option A). High-intent paid traffic needs zero friction — the form is visible above the fold, one clear offer, no competing CTAs. Inspired by Alex Hormozi's "Grand Slam Offer" principles: make the offer so specific and frictionless that saying no feels unreasonable.

## Architecture

New page component at `pages/LandingPVC.tsx`, registered as route `#landing-pvc` in `App.tsx`. The page renders **without** the global Navbar, Footer, AnnouncementBar, or Chatbot — it is a fully self-contained conversion page. Lead submissions write to the existing `mockDatabase` leads store via `createLead()`.

## Page Sections (top to bottom)

### 1. Sticky Mini-bar
- Logo (left) + phone number `040 123 4567` as a `tel:` link (right)
- Dark background (`bg-brand-dark`), no navigation links
- Stays fixed at top (`sticky top-0 z-50`)

### 2. Hero — above the fold
- Full-width dark background (`bg-brand-dark`) with a PVC visgraat floor photo as a subtle overlay (`opacity-20`)
- Review badge: `★★★★★  5/5 · 25 Google reviews` (brand-red pill)
- **Headline:** `PVC vloer laten leggen in Geldrop & omgeving?`
- **Subheadline:** `Bekijk de mooiste PVC vloeren in onze showroom — en ga weg met een vrijblijvende offerte op maat.`
- Inline lead form (white card):
  - Fields: Naam (text), Telefoonnummer (tel), E-mailadres (email, optional), Gewenste datum (date)
  - Submit button: `Afspraak inplannen →` (brand-red)
  - Disclaimer below button: `Vrijblijvend · Geen verplichtingen`
- On submit: calls `createLead()`, shows a thank-you state in the form card ("We bellen je zo snel mogelijk terug!")

### 3. Trust Bar
- Sand/warm background (`bg-brand-sand/20`)
- 4 icon + text bullets in a horizontal row:
  - ✓ Vader & zoon vakmannen
  - ✓ Legservice vaak in 1 dag
  - ✓ Persoonlijk advies op maat
  - ✓ Gratis vrijblijvende offerte
- Icons from lucide-react (`Users`, `Clock`, `MessageSquare`, `FileText`)

### 4. Zo werkt het (3 steps)
- White background, centered
- Section heading: `Zo werkt het`
- 3 numbered steps in a row (stacked on mobile):
  1. Plan je gratis showroombezoek
  2. Bekijk & voel de vloeren in het echt, krijg advies op maat
  3. Ontvang je vrijblijvende offerte — zonder verplichtingen
- Step numbers in brand-red circles

### 5. Reviews (3 quotes)
- Warm sand background (`bg-brand-sand/10`)
- Section heading: `Wat klanten zeggen`
- 3 hand-picked Google reviews, all about PVC:
  1. **Ingrid Zwart** — *"We zijn ontzettend tevreden met onze PVC vloer. Vakkundig gelegd door vader en zoon. Alles netjes afgewerkt en opgeruimd. Top service."*
  2. **Rick Adriaanslaan** — *"Misschien wel de mooiste vloer die ik ooit in mijn woning heb gehad!"*
  3. **Anja Kardol** — *"Zo blij met mijn nieuwe pvc vloer. Ze zijn erg vakkundig, werken zeer netjes en geven je absoluut mooie en goede adviezen."*
- Each card: left brand-red border, italic quote, name + ★★★★★

### 6. Final CTA
- Dark background (`bg-brand-dark`), white text
- Heading: `Klaar om je nieuwe vloer te kiezen?`
- Subtext: `Plan je gratis showroombezoek — vrijblijvend, geen verplichtingen`
- CTA button scrolls to hero form (smooth scroll, `#hero-form` anchor)

## Lead Form Behaviour

- **Validation:** Naam, telefoonnummer, en datum zijn verplicht. Email is optioneel. Date must be in the future. Phone must be at least 10 digits.
- **Submit flow:**
  1. Button shows loading spinner
  2. Calls `createLead({ name, email: email || '', phone, floorType: 'pvc', areaSize: 0, message: `Showroomafspraak gewenst op ${date}` })`
  3. Form card replaced by thank-you message: `"Top! We bellen je zo snel mogelijk terug om je afspraak te bevestigen."`
- **No page reload**, no redirect.

## Routing

- Route: `#landing-pvc` added to `App.tsx` switch
- This page bypasses the normal layout (no Navbar, Footer, AnnouncementBar, Chatbot, CookieBanner)
- The `isFullscreenPage` logic in App.tsx is extended to include `landing-pvc`

## Files

| File | Action |
|------|--------|
| `pages/LandingPVC.tsx` | Create — full page component |
| `App.tsx` | Modify — add route + exclude from global layout |
| `types/index.ts` | Verify — `Lead` type supports `source` and `phone` fields |

## Out of Scope

- A/B testing
- UTM parameter tracking (nice-to-have, not required)
- Integration with external CRM or email service
- Cookie banner on this page (not needed — no tracking pixels)
- The existing Chatbot (not shown on this page)
