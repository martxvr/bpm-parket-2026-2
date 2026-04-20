# BPM Parket — Site Enhancements Design

**Date:** 2026-04-20  
**Status:** Approved

---

## Overview

Five UI enhancements to the BPM Parket React/TypeScript website:

1. Announcement Bar
2. Hero USPs
3. Over Ons pagina
4. GDPR Cookie Banner
5. Full-width Mega Menu

---

## 1. Announcement Bar

**Component:** `components/AnnouncementBar.tsx`  
**Location in layout:** Rendered in `App.tsx` above `<Navbar>`, outside sticky nav.

**Content:**  
`"🎉 Tijdelijke actie: Gratis inmeting bij elke vloeropdracht boven €500 — Bel nu: 040-123 4567"`

**Behaviour:**
- Dismissible via × button
- On dismiss: write `announcement_dismissed=true` to `localStorage`
- On mount: check `localStorage`; if set, render nothing
- Dark background (`bg-black`), white text, brand-red accent on the phone number link

---

## 2. Hero USPs

**Location:** `pages/Home.tsx` — inside `HeroSlider`, directly below the CTA buttons (`<div className="pt-2 flex flex-wrap gap-4">`).

**Items (4):**
- ✓ Gratis inmeting
- ✓ 20+ jaar ervaring
- ✓ Binnen 1 dag geplaatst
- ✓ Geldrop & omgeving

**Styling:** Small inline flex row, white text, `CheckCircle2` icon from lucide-react, subtle opacity (80%), no separate section or card.

---

## 3. Over Ons Pagina

**File:** `pages/AboutUs.tsx`  
**Route:** `over-ons` — added to `App.tsx` switch + imported  
**Navbar:** Add "Over Ons" link between "Home" and "Producten" in `navLinks` array and mobile menu

**Page sections (top to bottom):**

### Hero
- Full-width dark hero with background image (reuse existing parket image)
- Tagline: "Vakmanschap met een verhaal"
- Subtitle: kort intro over BPM Parket

### Verhaal (2-kolom)
- Links: kop + broodtekst (placeholder — oprichting, passie, ambacht)
- Rechts: foto placeholder (bestaande afbeelding)

### Kernwaarden (3 cards)
1. Vakmanschap — "Ieder project behandelen we als ons eigen huis."
2. Betrouwbaarheid — "We komen onze afspraken na, altijd."
3. Duurzaamheid — "We werken met materialen die generaties meegaan."
Icons from lucide-react.

### Statistieken
- 20+ Jaar ervaring
- 500+ Projecten
- 100% Maatwerk
- 49+ 5-sterren reviews

### Team
- 2–3 placeholder medewerkers met naam, rol, korte bio, avatar placeholder

### CTA
- Knop naar `quote` pagina: "Vraag een vrijblijvende offerte aan"

---

## 4. GDPR Cookie Banner

**Component:** `components/CookieBanner.tsx`  
**Location:** Rendered in `App.tsx` at root level (above everything else or as overlay)

**Behaviour:**
- On mount: check `localStorage` for key `cookie_consent`
- If not set: render banner
- "Accepteren" → set `cookie_consent=all`, hide banner
- "Alleen noodzakelijk" → set `cookie_consent=necessary`, hide banner
- No granular toggles (overkill for this business size)

**Styling:**
- Fixed bottom bar, full width, white background, subtle shadow
- Short copy: "Wij gebruiken cookies om uw ervaring te verbeteren. Lees ons [privacybeleid]."
- Two buttons: primary "Accepteren", ghost "Alleen noodzakelijk"

---

## 5. Full-width Mega Menu

**File:** `components/Navbar.tsx`

**Change:** Products dropdown goes from a small `w-64` absolute box to a full-viewport-width mega menu.

**Layout:**
- `position: fixed; left: 0; width: 100vw` — detached from navbar flow
- Top aligned to bottom of navbar (use `top` offset matching navbar height ~96px)
- Inner grid: 2 columns of product links (3 each) + 1 right column with a featured image/CTA card
- Each product link has name + short description (1 line)
- Featured card: dark background, "Bekijk alle producten" CTA button

**Trigger:** Same mouseEnter/mouseLeave with 200ms delay as current implementation.

---

## File Changes Summary

| Action | File |
|--------|------|
| Create | `components/AnnouncementBar.tsx` |
| Create | `components/CookieBanner.tsx` |
| Create | `pages/AboutUs.tsx` |
| Modify | `pages/Home.tsx` — add USPs in HeroSlider |
| Modify | `components/Navbar.tsx` — mega menu + Over Ons link |
| Modify | `App.tsx` — add AnnouncementBar, CookieBanner, over-ons route |
