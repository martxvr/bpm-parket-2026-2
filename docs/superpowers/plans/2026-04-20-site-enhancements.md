# BPM Parket Site Enhancements Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add announcement bar, hero USPs, Over Ons page, GDPR cookie banner, and full-width mega menu to the BPM Parket website.

**Architecture:** All components are self-contained React/TypeScript files following existing project patterns (functional components, Tailwind CSS, lucide-react icons). localStorage is used for persisting dismissal/consent state. No new dependencies required.

**Tech Stack:** React 18, TypeScript, Tailwind CSS, lucide-react, localStorage

---

## File Map

| Action | File | Responsibility |
|--------|------|---------------|
| Create | `components/AnnouncementBar.tsx` | Dismissible promo bar above navbar |
| Create | `components/CookieBanner.tsx` | GDPR consent overlay fixed to bottom |
| Create | `pages/AboutUs.tsx` | Full Over Ons page with all sections |
| Modify | `pages/Home.tsx` | Add USP row below hero CTA buttons |
| Modify | `components/Navbar.tsx` | Full-width mega menu + Over Ons link |
| Modify | `components/Footer.tsx` | Fix logo path to /logo.png |
| Modify | `App.tsx` | Wire AnnouncementBar, CookieBanner, over-ons route |

---

## Task 1: AnnouncementBar component

**Files:**
- Create: `components/AnnouncementBar.tsx`

- [ ] **Step 1: Create the component**

```tsx
// components/AnnouncementBar.tsx
import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';

const STORAGE_KEY = 'announcement_dismissed';

const AnnouncementBar: React.FC = () => {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (!localStorage.getItem(STORAGE_KEY)) {
      setVisible(true);
    }
  }, []);

  const dismiss = () => {
    localStorage.setItem(STORAGE_KEY, 'true');
    setVisible(false);
  };

  if (!visible) return null;

  return (
    <div className="bg-black text-white text-sm py-2.5 px-4 flex items-center justify-center gap-3 relative">
      <span>
        🎉 Tijdelijke actie: Gratis inmeting bij elke vloeropdracht boven €500 —{' '}
        <a href="tel:0401234567" className="font-bold text-brand-red hover:underline">
          Bel nu: 040 123 4567
        </a>
      </span>
      <button
        onClick={dismiss}
        aria-label="Sluiten"
        className="absolute right-4 top-1/2 -translate-y-1/2 text-white/60 hover:text-white transition-colors"
      >
        <X className="h-4 w-4" />
      </button>
    </div>
  );
};

export default AnnouncementBar;
```

- [ ] **Step 2: Commit**

```bash
git add components/AnnouncementBar.tsx
git commit -m "feat: add AnnouncementBar component with localStorage dismiss"
```

---

## Task 2: CookieBanner component

**Files:**
- Create: `components/CookieBanner.tsx`

- [ ] **Step 1: Create the component**

```tsx
// components/CookieBanner.tsx
import React, { useState, useEffect } from 'react';

const STORAGE_KEY = 'cookie_consent';

const CookieBanner: React.FC = () => {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (!localStorage.getItem(STORAGE_KEY)) {
      setVisible(true);
    }
  }, []);

  const accept = () => {
    localStorage.setItem(STORAGE_KEY, 'all');
    setVisible(false);
  };

  const necessary = () => {
    localStorage.setItem(STORAGE_KEY, 'necessary');
    setVisible(false);
  };

  if (!visible) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-[9999] bg-white border-t border-gray-200 shadow-2xl px-4 py-5 sm:px-8">
      <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <p className="text-sm text-gray-600 max-w-2xl">
          Wij gebruiken cookies om uw ervaring te verbeteren en onze website te analyseren.{' '}
          <a href="#policy-privacy" className="underline hover:text-black transition-colors">
            Lees ons privacybeleid
          </a>
          .
        </p>
        <div className="flex gap-3 flex-shrink-0">
          <button
            onClick={necessary}
            className="px-5 py-2 rounded-full border border-gray-300 text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors whitespace-nowrap"
          >
            Alleen noodzakelijk
          </button>
          <button
            onClick={accept}
            className="px-5 py-2 rounded-full bg-black text-white text-sm font-medium hover:bg-gray-800 transition-colors whitespace-nowrap"
          >
            Accepteren
          </button>
        </div>
      </div>
    </div>
  );
};

export default CookieBanner;
```

- [ ] **Step 2: Commit**

```bash
git add components/CookieBanner.tsx
git commit -m "feat: add GDPR CookieBanner component"
```

---

## Task 3: Wire AnnouncementBar and CookieBanner into App.tsx

**Files:**
- Modify: `App.tsx`

- [ ] **Step 1: Add imports at top of App.tsx** (after existing imports)

```tsx
import AnnouncementBar from './components/AnnouncementBar';
import CookieBanner from './components/CookieBanner';
```

- [ ] **Step 2: Add AnnouncementBar above Navbar and CookieBanner at root level**

Find this block in the return:
```tsx
      {!isFullscreenPage && currentPage !== 'admin' && <Navbar onNavigate={navigate} currentPage={currentPage} />}
```

Replace with:
```tsx
      {!isFullscreenPage && currentPage !== 'admin' && <AnnouncementBar />}
      {!isFullscreenPage && currentPage !== 'admin' && <Navbar onNavigate={navigate} currentPage={currentPage} />}
```

Then before the closing `</div>` of the root div, add:
```tsx
      <CookieBanner />
```

- [ ] **Step 3: Verify the app renders without errors**

Run: `npm run dev`
Expected: App loads, announcement bar shows above navbar, cookie banner shows at bottom on fresh localStorage.

- [ ] **Step 4: Commit**

```bash
git add App.tsx
git commit -m "feat: wire AnnouncementBar and CookieBanner into App"
```

---

## Task 4: Hero USPs in Home.tsx

**Files:**
- Modify: `pages/Home.tsx`

- [ ] **Step 1: Add USP row below CTA buttons in HeroSlider**

Find this block inside `HeroSlider`:
```tsx
            <div className="pt-2 flex flex-wrap gap-4">
              <Button size="lg" withIcon onClick={() => onNavigate('quote')}>
                Offerte aanvragen
              </Button>
              <button
                onClick={() => onNavigate('projects')}
                className="bg-white/10 hover:bg-white/20 border border-white/20 text-white px-8 py-4 rounded-full font-bold transition-all backdrop-blur-sm"
              >
                Bekijk Projecten
              </button>
            </div>
```

Replace with:
```tsx
            <div className="pt-2 flex flex-wrap gap-4">
              <Button size="lg" withIcon onClick={() => onNavigate('quote')}>
                Offerte aanvragen
              </Button>
              <button
                onClick={() => onNavigate('projects')}
                className="bg-white/10 hover:bg-white/20 border border-white/20 text-white px-8 py-4 rounded-full font-bold transition-all backdrop-blur-sm"
              >
                Bekijk Projecten
              </button>
            </div>

            <div className="flex flex-wrap gap-x-6 gap-y-2 pt-2">
              {[
                'Gratis inmeting',
                '20+ jaar ervaring',
                'Binnen 1 dag geplaatst',
                'Geldrop & omgeving',
              ].map((usp) => (
                <span key={usp} className="flex items-center gap-1.5 text-sm text-white/80">
                  <CheckCircle2 className="h-4 w-4 text-brand-red flex-shrink-0" />
                  {usp}
                </span>
              ))}
            </div>
```

- [ ] **Step 2: Verify CheckCircle2 is already imported**

Check line 2 of `pages/Home.tsx` — `CheckCircle2` is already in the lucide-react import. No change needed.

- [ ] **Step 3: Commit**

```bash
git add pages/Home.tsx
git commit -m "feat: add USP row below hero CTA buttons"
```

---

## Task 5: AboutUs page

**Files:**
- Create: `pages/AboutUs.tsx`

- [ ] **Step 1: Create the full page**

```tsx
// pages/AboutUs.tsx
import React from 'react';
import { Award, ShieldCheck, Leaf, Star } from 'lucide-react';
import Button from '../components/Button';

interface AboutUsProps {
  onNavigate: (page: string) => void;
}

const team = [
  {
    name: 'Bas van den Berg',
    role: 'Oprichter & Meester-Parketteur',
    bio: 'Met meer dan 20 jaar ervaring in het leggen van traditioneel parket is Bas de drijvende kracht achter BPM Parket. Zijn passie voor ambacht is in elk project zichtbaar.',
  },
  {
    name: 'Milan Pietersen',
    role: 'Uitvoerder & PVC Specialist',
    bio: 'Milan is gespecialiseerd in moderne PVC-vloeren en laminaat. Zijn nauwkeurigheid en werksnelheid zorgen ervoor dat projecten altijd op tijd en foutloos worden opgeleverd.',
  },
  {
    name: 'Robin de Vries',
    role: 'Traprenovatie & Interieur',
    bio: 'Robin combineert technisch inzicht met een gevoel voor interieur. Van traprenovatie tot maatwerk interieurwerken — hij maakt elk detail af.',
  },
];

const stats = [
  { value: '20+', label: 'Jaar ervaring' },
  { value: '500+', label: 'Projecten afgerond' },
  { value: '100%', label: 'Maatwerk' },
  { value: '49+', label: '5-sterren reviews' },
];

const values = [
  {
    icon: Award,
    title: 'Vakmanschap',
    desc: 'Ieder project behandelen we als ons eigen huis. Van voorbereiding tot eindresultaat werken we met de precisie van een meester-parketteur.',
  },
  {
    icon: ShieldCheck,
    title: 'Betrouwbaarheid',
    desc: 'We komen onze afspraken na, altijd. U weet vooraf wat u kunt verwachten: eerlijke prijzen, duidelijke planning en geen verrassingen.',
  },
  {
    icon: Leaf,
    title: 'Duurzaamheid',
    desc: 'We werken met materialen die generaties meegaan. Kwaliteit boven kwantiteit — een vloer van BPM Parket is een investering voor de lange termijn.',
  },
];

const AboutUs: React.FC<AboutUsProps> = ({ onNavigate }) => {
  return (
    <div className="flex flex-col w-full overflow-hidden bg-white text-brand-dark">

      {/* Hero */}
      <section className="relative w-full min-h-[60vh] flex items-center overflow-hidden bg-black">
        <div className="absolute inset-0">
          <img
            src="https://www.bpmparket.nl/wp-content/uploads/2023/10/2023-10-02-12_27_45-WhatsApp-en-nog-9-andere-paginas-Werk-Microsoft%E2%80%8B-Edge-e1696335757551.png"
            alt="BPM Parket vakmanschap"
            className="w-full h-full object-cover opacity-40"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black/80 to-black/40" />
        </div>
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-32">
          <span className="text-xs font-bold tracking-widest text-brand-red uppercase mb-4 block">Over ons</span>
          <h1 className="text-5xl lg:text-7xl font-bold text-white leading-tight mb-6">
            Vakmanschap<br />met een verhaal
          </h1>
          <p className="text-lg text-white/70 max-w-xl">
            BPM Parket is een familiebedrijf uit Geldrop met meer dan 20 jaar ervaring in parket, PVC-vloeren en traprenovaties. Wij werken met passie voor het vak en trots op elk project.
          </p>
        </div>
      </section>

      {/* Verhaal */}
      <section className="py-24 lg:py-32 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div className="space-y-6">
              <span className="text-xs font-bold tracking-widest text-gray-400 uppercase">Ons verhaal</span>
              <h2 className="text-4xl lg:text-5xl font-bold text-black leading-tight">
                Begonnen met één vloer. Gebleven voor het vakmanschap.
              </h2>
              <p className="text-gray-500 text-lg leading-relaxed">
                BPM Parket is ruim 20 jaar geleden opgericht vanuit een eenvoudige overtuiging: een vloer is meer dan een ondergrond. Het is het fundament van uw thuis. Oprichter Bas begon als zelfstandig parketteur en bouwde het bedrijf langzaam op, gedreven door kwaliteit en persoonlijk contact.
              </p>
              <p className="text-gray-500 text-lg leading-relaxed">
                Vandaag werken we met een hecht team van specialisten die elk hun eigen discipline meesterlijk beheersen. Van traditioneel visgraat parket tot moderne PVC-vloeren en traprenovaties — bij BPM Parket doet iedereen waar hij het beste in is.
              </p>
            </div>
            <div className="relative rounded-[3rem] overflow-hidden h-[500px]">
              <img
                src="https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&q=80&w=1200"
                alt="Parketteur aan het werk"
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Statistieken */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            {stats.map((stat) => (
              <div key={stat.label} className="text-center">
                <p className="text-5xl font-bold text-black mb-2">{stat.value}</p>
                <p className="text-sm text-gray-500 uppercase tracking-widest">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Kernwaarden */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <span className="text-xs font-bold tracking-widest text-gray-400 uppercase mb-4 block">Onze waarden</span>
            <h2 className="text-4xl font-bold text-black">Waar wij voor staan</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {values.map((val) => (
              <div key={val.title} className="bg-gray-50 p-10 rounded-[2rem]">
                <div className="w-12 h-12 bg-black rounded-full flex items-center justify-center mb-6">
                  <val.icon className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-xl font-bold mb-4">{val.title}</h3>
                <p className="text-gray-500 leading-relaxed">{val.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Team */}
      <section className="py-24 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <span className="text-xs font-bold tracking-widest text-gray-400 uppercase mb-4 block">Het team</span>
            <h2 className="text-4xl font-bold text-black">De mensen achter BPM Parket</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {team.map((member) => (
              <div key={member.name} className="bg-white rounded-[2rem] overflow-hidden shadow-sm hover:shadow-xl transition-shadow duration-300">
                <div className="h-64 bg-gradient-to-br from-gray-200 to-gray-300 flex items-center justify-center">
                  <span className="text-6xl font-bold text-white/50">{member.name.charAt(0)}</span>
                </div>
                <div className="p-8">
                  <h3 className="text-xl font-bold mb-1">{member.name}</h3>
                  <p className="text-brand-red text-sm font-semibold mb-4">{member.role}</p>
                  <p className="text-gray-500 text-sm leading-relaxed">{member.bio}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Reviews teaser */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="flex justify-center mb-4">
            {[...Array(5)].map((_, i) => (
              <Star key={i} className="h-7 w-7 text-brand-red fill-current" />
            ))}
          </div>
          <p className="text-2xl font-bold text-black mb-2">49+ tevreden klanten gingen u voor</p>
          <p className="text-gray-500 mb-8">Bekijk onze beoordelingen op Werkspot en Google.</p>
          <Button variant="primary" withIcon onClick={() => onNavigate('quote')}>
            Vraag een vrijblijvende offerte aan
          </Button>
        </div>
      </section>

    </div>
  );
};

export default AboutUs;
```

- [ ] **Step 2: Commit**

```bash
git add pages/AboutUs.tsx
git commit -m "feat: add AboutUs page with hero, story, stats, values, team, and CTA sections"
```

---

## Task 6: Wire AboutUs into App.tsx and Navbar

**Files:**
- Modify: `App.tsx`
- Modify: `components/Navbar.tsx`

- [ ] **Step 1: Add import and route in App.tsx**

Add import after existing page imports:
```tsx
import AboutUs from './pages/AboutUs';
```

In the `renderPage` switch, add before `case 'admin':`:
```tsx
      case 'over-ons': return <AboutUs onNavigate={navigate} />;
```

- [ ] **Step 2: Add "Over Ons" to Navbar navLinks**

In `components/Navbar.tsx`, find:
```tsx
  const navLinks = [
    { name: 'Home', id: 'home' },
    { name: 'Showroom', id: 'showroom' },
    { name: 'Projecten', id: 'projects' },
    { name: 'Contact', id: 'contact' },
  ];
```

Replace with:
```tsx
  const navLinks = [
    { name: 'Home', id: 'home' },
    { name: 'Over Ons', id: 'over-ons' },
    { name: 'Showroom', id: 'showroom' },
    { name: 'Projecten', id: 'projects' },
    { name: 'Contact', id: 'contact' },
  ];
```

- [ ] **Step 3: Commit**

```bash
git add App.tsx components/Navbar.tsx
git commit -m "feat: wire AboutUs page into router and add Over Ons to navbar"
```

---

## Task 7: Full-width mega menu in Navbar

**Files:**
- Modify: `components/Navbar.tsx`

- [ ] **Step 1: Add product descriptions for the mega menu**

In `components/Navbar.tsx`, replace the existing `productLinks` array:
```tsx
  const productLinks = [
    { name: 'PVC en Laminaat', id: 'producten-pvc' },
    { name: 'Parket en Multiplanken', id: 'producten-parket' },
    { name: 'Legservice', id: 'producten-legservice' },
    { name: 'Trap renovatie', id: 'producten-trap' },
    { name: 'Buitenparket', id: 'producten-buitenparket' },
    { name: 'Interieurwerken', id: 'producten-interieur' },
  ];
```

With:
```tsx
  const productLinks = [
    { name: 'PVC en Laminaat', id: 'producten-pvc', desc: 'Stijlvol, duurzaam en onderhoudsvriendelijk' },
    { name: 'Parket en Multiplanken', id: 'producten-parket', desc: 'Traditioneel vakmanschap in massief hout' },
    { name: 'Legservice', id: 'producten-legservice', desc: 'Professionele plaatsing door onze specialisten' },
    { name: 'Trap renovatie', id: 'producten-trap', desc: 'Nieuwe uitstraling, vaak binnen één dag' },
    { name: 'Buitenparket', id: 'producten-buitenparket', desc: 'Robuuste houten vloeren voor buiten' },
    { name: 'Interieurwerken', id: 'producten-interieur', desc: 'Maatwerk meubels en interieurafwerking' },
  ];
```

- [ ] **Step 2: Replace the dropdown div with the full-width mega menu**

Find and replace the entire `{/* Dropdown Menu */}` div (the one with `w-64`):

```tsx
              {/* Mega Menu */}
              <div
                className={`fixed left-0 w-screen bg-white border-b border-gray-100 shadow-2xl transform transition-all duration-200 origin-top ${isProductsOpen ? 'opacity-100 scale-y-100 translate-y-0' : 'opacity-0 scale-y-95 -translate-y-2 pointer-events-none'}`}
                style={{ top: '96px' }}
                onMouseEnter={handleMouseEnter}
                onMouseLeave={handleMouseLeave}
              >
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
                  <div className="grid grid-cols-3 gap-8">
                    {/* Column 1 */}
                    <div className="space-y-1">
                      {productLinks.slice(0, 3).map((product) => (
                        <button
                          key={product.id}
                          onClick={() => handleNav(product.id)}
                          className="w-full text-left px-4 py-3 rounded-xl hover:bg-gray-50 transition-colors group"
                        >
                          <p className="font-semibold text-brand-dark group-hover:text-brand-red transition-colors">{product.name}</p>
                          <p className="text-xs text-gray-400 mt-0.5">{product.desc}</p>
                        </button>
                      ))}
                    </div>
                    {/* Column 2 */}
                    <div className="space-y-1">
                      {productLinks.slice(3).map((product) => (
                        <button
                          key={product.id}
                          onClick={() => handleNav(product.id)}
                          className="w-full text-left px-4 py-3 rounded-xl hover:bg-gray-50 transition-colors group"
                        >
                          <p className="font-semibold text-brand-dark group-hover:text-brand-red transition-colors">{product.name}</p>
                          <p className="text-xs text-gray-400 mt-0.5">{product.desc}</p>
                        </button>
                      ))}
                    </div>
                    {/* Featured card */}
                    <div className="bg-black rounded-2xl p-8 flex flex-col justify-between min-h-[200px] relative overflow-hidden">
                      <div className="absolute inset-0 opacity-20">
                        <img
                          src="https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&q=80&w=600"
                          alt=""
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="relative z-10">
                        <p className="text-xs font-bold tracking-widest text-brand-red uppercase mb-2">Specialisaties</p>
                        <h3 className="text-xl font-bold text-white leading-snug">Alle producten & diensten van BPM Parket</h3>
                      </div>
                      <button
                        onClick={() => handleNav('producten-parket')}
                        className="relative z-10 mt-6 bg-white text-black px-5 py-2.5 rounded-full text-sm font-bold hover:bg-gray-100 transition-colors w-fit"
                      >
                        Bekijk alle producten
                      </button>
                    </div>
                  </div>
                </div>
              </div>
```

- [ ] **Step 3: Verify the mega menu opens correctly**

Run: `npm run dev`  
Open the site, hover "Producten" — the full-width panel should open with 2 columns of links and a featured card on the right.

- [ ] **Step 4: Commit**

```bash
git add components/Navbar.tsx
git commit -m "feat: replace products dropdown with full-width mega menu"
```

---

## Task 8: Fix Footer logo path

**Files:**
- Modify: `components/Footer.tsx`

- [ ] **Step 1: Update the logo src**

Find in `components/Footer.tsx`:
```tsx
                src="/2023-10-02_12_09_56-BPM_Parket___Parket__PVC__Houten_Vloeren_en_nog_6_andere_pagina_s_-_Werk_-_Micro-removebg-preview.png"
```

Replace with:
```tsx
                src="/logo.png"
```

- [ ] **Step 2: Commit**

```bash
git add components/Footer.tsx
git commit -m "fix: update footer logo path to /logo.png"
```

---

## Self-Review

**Spec coverage:**
- ✅ Announcement bar — Task 1 + Task 3
- ✅ Hero USPs — Task 4
- ✅ Over Ons pagina (all sections: hero, verhaal, stats, waarden, team, CTA) — Task 5 + Task 6
- ✅ GDPR cookie banner — Task 2 + Task 3
- ✅ Full-width mega menu — Task 7
- ✅ Navbar Over Ons link — Task 6

**Placeholder scan:** No TBDs or incomplete steps. All code blocks are complete.

**Type consistency:**
- `productLinks` array gains `desc` field in Task 7 Step 1 before it's consumed in Step 2 — consistent.
- `AboutUsProps` interface matches usage in App.tsx Task 6 Step 1.
- `AnnouncementBar` and `CookieBanner` take no props — consistent with App.tsx usage.
