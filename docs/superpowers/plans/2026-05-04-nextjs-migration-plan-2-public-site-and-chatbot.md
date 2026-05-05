# Next.js Migration — Plan 2: Public Site + Chatbot + Email

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Migrate the public-facing site (Home, all service pages, Showroom, Over Ons, Contact, projects, ad landing, policies) plus lead capture forms, transactional + auth email infrastructure (Resend + React Email), and the server-side chatbot proxy (Upstash-rate-limited agent loop). Result: a fully functional marketing site with working chatbot and lead capture, ready for Plan 3 (admin features).

**Architecture:** Builds on Plan 1's Next.js 16 + Supabase + auth foundation. Public pages are React Server Components fetching content from Supabase. Forms use Server Actions with Zod validation, honeypot, and Upstash rate limiting. Chatbot is a server-side route handler implementing an Anthropic agent loop with tool use (bookAppointment, checkAvailability) executed entirely server-side. All emails go through Resend with React Email templates, including Supabase Auth emails via the Email Hook webhook. Markdown content (service descriptions, policies) is rendered via `react-markdown` with a strict allowed-tag whitelist — no raw HTML injection.

**Tech Stack:** Next.js 16, React 19, Tailwind v4, Supabase, `@supabase/ssr`, Zod, React Email, Resend, Upstash Redis, Anthropic SDK, react-markdown, Playwright, Vitest.

**Spec reference:** [docs/superpowers/specs/2026-05-02-vite-to-nextjs-migration-design.md](../specs/2026-05-02-vite-to-nextjs-migration-design.md)

**Plan 1 outputs this plan builds on:**
- Branch `next-migration` with Next.js 16 scaffold
- `lib/supabase/{server,client,middleware}.ts`
- `lib/auth.ts`, `lib/env.ts` (with `requireServiceRoleKey()`)
- `app/(admin)/layout.tsx` defense-in-depth auth gate
- Database schema + RLS in `supabase/migrations/`
- `_legacy/` folder with original Vite components for reference

---

## File structure (new/changed in Plan 2)

```
app/
  (public)/
    layout.tsx                                          MODIFY
    page.tsx                                            REPLACE
    pvc-vloeren/page.tsx                                CREATE
    traditioneel-parket/page.tsx                        CREATE
    multiplanken/page.tsx                               CREATE
    laminaat/page.tsx                                   CREATE
    traprenovatie/page.tsx                              CREATE
    schuren-onderhoud/page.tsx                          CREATE
    projecten/page.tsx                                  CREATE
    projecten/[slug]/page.tsx                           CREATE
    showroom/page.tsx                                   CREATE
    over-ons/page.tsx                                   CREATE
    contact/page.tsx                                    CREATE
    offerte/page.tsx                                    CREATE
    privacy/page.tsx                                    CREATE
    cookies/page.tsx                                    CREATE
    algemene-voorwaarden/page.tsx                       CREATE
    pvc-laten-leggen/{layout,page}.tsx                  CREATE
  not-found.tsx                                         CREATE
  globals.css                                           MODIFY
  api/chat/route.ts                                     CREATE
  api/auth/email-hook/route.ts                          CREATE
components/
  layout/{Navbar,Footer,AnnouncementBar,CookieBanner}.tsx
  ui/{Button,Container,DatePicker}.tsx
  marketing/{Hero,USPRow,ServicesGrid,ProjectsPreview,
    ReviewsRow,CtaSection,ServicePageTemplate,
    PolicyPage,Markdown}.tsx
  forms/LeadForm.tsx
  chatbot/Chatbot.tsx
  emails/
    layout/EmailLayout.tsx
    transactional/{LeadConfirmation,AdminLeadNotification,
      AppointmentConfirmation,AdminAppointmentNotification}.tsx
    auth/{PasswordReset,EmailChangeConfirm}.tsx
lib/
  db/{services,projects,policies,leads,
    appointments,knowledge}.ts
  validation/{forms,chat}.ts
  rate-limit.ts
  resend.ts
  hash.ts
  cn.ts
  company.ts
actions/leads.ts
supabase/seed.sql
tests/e2e/{lead-form,chatbot}.spec.ts
```

---

## Phase 2: Public Site

### Task 1: Brand tokens + companyConfig

**Files:**
- Modify: `app/globals.css`
- Create: `lib/company.ts`

- [ ] **Step 1: Write `lib/company.ts`**

```ts
export const companyConfig = {
  name: 'BPM Parket',
  legalName: 'BPM Parket B.V.',
  contact: {
    phone: '040 123 4567',
    email: 'info@bpmparket.nl',
    address: 'Hooge Akker 19',
    zipCity: '5661 NG Geldrop',
    mapsUrl: 'https://maps.google.com/?q=Hooge+Akker+19,+5661+NG+Geldrop',
    kvk: '12345678',
    btw: 'NL123456789B01',
    iban: 'NL01RABO0123456789',
  },
  socials: {
    facebook: 'https://facebook.com/bpmparket',
    instagram: 'https://instagram.com/bpmparket',
    linkedin: 'https://linkedin.com/company/bpmparket',
  },
  hours: {
    monday: 'Op afspraak',
    tuesday: '10:00 - 17:00',
    wednesday: '10:00 - 17:00',
    thursday: '10:00 - 17:00',
    friday: '10:00 - 17:00',
    saturday: '10:00 - 16:00',
    sunday: 'Gesloten',
  },
} as const;
```

- [ ] **Step 2: Replace `app/globals.css`**

```css
@import "tailwindcss";

@theme {
  --color-brand-primary: oklch(0.45 0.06 50);
  --color-brand-primary-dark: oklch(0.32 0.07 50);
  --color-brand-primary-light: oklch(0.62 0.05 50);
  --color-brand-accent: oklch(0.60 0.15 40);
  --color-brand-cream: oklch(0.97 0.01 80);
  --color-brand-charcoal: oklch(0.20 0.01 0);
  --color-brand-muted: oklch(0.50 0.01 0);

  --color-success: oklch(0.55 0.12 145);
  --color-warning: oklch(0.70 0.15 75);
  --color-danger: oklch(0.55 0.18 25);

  --font-sans: ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont,
    "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
  --font-display: "Cormorant Garamond", "Times New Roman", Georgia, serif;
}

html, body {
  background: var(--color-brand-cream);
  color: var(--color-brand-charcoal);
}

.heading-display {
  font-family: var(--font-display);
  font-weight: 500;
  letter-spacing: -0.01em;
}
```

- [ ] **Step 3: Verify + commit**

```bash
npm run typecheck && \
git add app/globals.css lib/company.ts && \
git commit -m "feat(brand): add BPM warm-brown palette and companyConfig"
```

---

### Task 2: UI primitives — Container + Button + cn helper

**Files:**
- Create: `lib/cn.ts`
- Create: `components/ui/Container.tsx`
- Create: `components/ui/Button.tsx`

- [ ] **Step 1: `lib/cn.ts`**

```ts
type ClassValue = string | undefined | null | false | 0;

export function cn(...inputs: ClassValue[]): string {
  return inputs.filter(Boolean).join(' ');
}
```

- [ ] **Step 2: Container**

```tsx
import { cn } from '@/lib/cn';
import type { ReactNode } from 'react';

type Props = {
  children: ReactNode;
  className?: string;
  size?: 'narrow' | 'default' | 'wide';
};

const SIZE = { narrow: 'max-w-2xl', default: 'max-w-6xl', wide: 'max-w-7xl' };

export function Container({ children, className, size = 'default' }: Props) {
  return (
    <div className={cn('mx-auto px-6', SIZE[size], className)}>{children}</div>
  );
}
```

- [ ] **Step 3: Button**

```tsx
import Link from 'next/link';
import type { AnchorHTMLAttributes, ButtonHTMLAttributes, ReactNode } from 'react';
import { cn } from '@/lib/cn';

type Variant = 'primary' | 'secondary' | 'outline' | 'ghost';
type Size = 'sm' | 'md' | 'lg';

const BASE =
  'inline-flex items-center justify-center gap-2 rounded-full font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed';

const VARIANTS: Record<Variant, string> = {
  primary: 'bg-[var(--color-brand-primary)] text-white hover:bg-[var(--color-brand-primary-dark)]',
  secondary: 'bg-white text-[var(--color-brand-charcoal)] hover:bg-black/5',
  outline: 'border border-[var(--color-brand-charcoal)]/20 hover:bg-black/5',
  ghost: 'hover:bg-black/5',
};

const SIZES: Record<Size, string> = {
  sm: 'text-xs px-3 py-1.5',
  md: 'text-sm px-5 py-2.5',
  lg: 'text-base px-7 py-3',
};

type CommonProps = {
  variant?: Variant;
  size?: Size;
  className?: string;
  children: ReactNode;
};

type AsButton = CommonProps & ButtonHTMLAttributes<HTMLButtonElement> & { href?: undefined };
type AsLink = CommonProps & AnchorHTMLAttributes<HTMLAnchorElement> & { href: string };

export function Button(props: AsButton | AsLink) {
  const { variant = 'primary', size = 'md', className, children, ...rest } = props;
  const classes = cn(BASE, VARIANTS[variant], SIZES[size], className);

  if ('href' in rest && rest.href !== undefined) {
    return (
      <Link href={rest.href} className={classes} {...(rest as AnchorHTMLAttributes<HTMLAnchorElement>)}>
        {children}
      </Link>
    );
  }

  return (
    <button className={classes} {...(rest as ButtonHTMLAttributes<HTMLButtonElement>)}>
      {children}
    </button>
  );
}
```

- [ ] **Step 4: Verify + commit**

```bash
npm run typecheck && \
git add lib/cn.ts components/ui/Container.tsx components/ui/Button.tsx && \
git commit -m "feat(ui): add cn helper, Container, and Button primitives"
```

---

### Task 3: Footer (RSC)

**Files:**
- Create: `components/layout/Footer.tsx`
- Reference: `_legacy/components/Footer.tsx`

- [ ] **Step 1: Write Footer**

```tsx
import Link from 'next/link';
import Image from 'next/image';
import { Phone, Mail, MapPin, Facebook, Instagram, Linkedin } from 'lucide-react';
import { Container } from '@/components/ui/Container';
import { companyConfig } from '@/lib/company';

const SERVICE_LINKS = [
  { href: '/pvc-vloeren', label: 'PVC vloeren' },
  { href: '/traditioneel-parket', label: 'Traditioneel parket' },
  { href: '/multiplanken', label: 'Multiplanken' },
  { href: '/laminaat', label: 'Laminaat' },
  { href: '/traprenovatie', label: 'Traprenovatie' },
  { href: '/schuren-onderhoud', label: 'Schuren & onderhoud' },
];

const INFO_LINKS = [
  { href: '/over-ons', label: 'Over ons' },
  { href: '/projecten', label: 'Projecten' },
  { href: '/showroom', label: 'Showroom' },
  { href: '/contact', label: 'Contact' },
];

const POLICY_LINKS = [
  { href: '/privacy', label: 'Privacy' },
  { href: '/algemene-voorwaarden', label: 'Algemene voorwaarden' },
  { href: '/cookies', label: 'Cookies' },
];

export function Footer() {
  return (
    <footer className="bg-[var(--color-brand-charcoal)] text-white/80 mt-24">
      <Container className="py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10">
          <div>
            <Image src="/logo.png" alt={companyConfig.name} width={140} height={48}
              className="mb-4 invert opacity-90" />
            <p className="text-sm leading-relaxed">
              Specialist in traditioneel parket, PVC vloeren, laminaat en
              traprenovatie. Gevestigd in Geldrop.
            </p>
            <div className="flex gap-3 mt-4">
              <Link href={companyConfig.socials.facebook} aria-label="Facebook">
                <Facebook className="h-5 w-5" />
              </Link>
              <Link href={companyConfig.socials.instagram} aria-label="Instagram">
                <Instagram className="h-5 w-5" />
              </Link>
              <Link href={companyConfig.socials.linkedin} aria-label="LinkedIn">
                <Linkedin className="h-5 w-5" />
              </Link>
            </div>
          </div>

          <div>
            <h3 className="text-white font-medium mb-3">Diensten</h3>
            <ul className="space-y-2 text-sm">
              {SERVICE_LINKS.map((l) => (
                <li key={l.href}>
                  <Link href={l.href} className="hover:text-white">{l.label}</Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-white font-medium mb-3">Bedrijf</h3>
            <ul className="space-y-2 text-sm">
              {INFO_LINKS.map((l) => (
                <li key={l.href}>
                  <Link href={l.href} className="hover:text-white">{l.label}</Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-white font-medium mb-3">Contact</h3>
            <ul className="space-y-2 text-sm">
              <li className="flex items-center gap-2">
                <Phone className="h-4 w-4" />
                <a href={`tel:${companyConfig.contact.phone.replace(/\s/g, '')}`}>
                  {companyConfig.contact.phone}
                </a>
              </li>
              <li className="flex items-center gap-2">
                <Mail className="h-4 w-4" />
                <a href={`mailto:${companyConfig.contact.email}`}>
                  {companyConfig.contact.email}
                </a>
              </li>
              <li className="flex items-start gap-2">
                <MapPin className="h-4 w-4 mt-0.5" />
                <span>{companyConfig.contact.address}<br />{companyConfig.contact.zipCity}</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-white/10 flex flex-col sm:flex-row justify-between gap-4 text-xs text-white/50">
          <span>© {new Date().getFullYear()} {companyConfig.legalName}. Alle rechten voorbehouden.</span>
          <ul className="flex gap-4">
            {POLICY_LINKS.map((l) => (
              <li key={l.href}>
                <Link href={l.href} className="hover:text-white">{l.label}</Link>
              </li>
            ))}
          </ul>
        </div>
      </Container>
    </footer>
  );
}
```

- [ ] **Step 2: Commit**

```bash
git add components/layout/Footer.tsx && \
git commit -m "feat(layout): add Footer as Server Component"
```

---

### Task 4: Navbar (client, mega menu + mobile)

**Files:** `components/layout/Navbar.tsx`

```tsx
'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { Menu, X, Phone } from 'lucide-react';
import { Container } from '@/components/ui/Container';
import { Button } from '@/components/ui/Button';
import { companyConfig } from '@/lib/company';
import { cn } from '@/lib/cn';

const SERVICES = [
  { href: '/pvc-vloeren', label: 'PVC vloeren', desc: 'Look en voelt als hout' },
  { href: '/traditioneel-parket', label: 'Traditioneel parket', desc: 'Met band & bies' },
  { href: '/multiplanken', label: 'Multiplanken', desc: 'Eikenhouten planken' },
  { href: '/laminaat', label: 'Laminaat', desc: 'Snel en betaalbaar' },
  { href: '/traprenovatie', label: 'Traprenovatie', desc: 'Nieuwe trap zonder slopen' },
  { href: '/schuren-onderhoud', label: 'Schuren & onderhoud', desc: 'Bestaand parket' },
];

const NAV = [
  { href: '/projecten', label: 'Projecten' },
  { href: '/showroom', label: 'Showroom' },
  { href: '/over-ons', label: 'Over ons' },
  { href: '/contact', label: 'Contact' },
];

export function Navbar() {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [megaOpen, setMegaOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 bg-[var(--color-brand-cream)]/90 backdrop-blur border-b border-black/5">
      <Container className="flex items-center justify-between h-16">
        <Link href="/"><Image src="/logo.png" alt={companyConfig.name} width={120} height={40} priority /></Link>

        <nav className="hidden lg:flex items-center gap-6 text-sm">
          <button
            onMouseEnter={() => setMegaOpen(true)}
            onClick={() => setMegaOpen((s) => !s)}
            className="hover:text-[var(--color-brand-primary)]"
          >
            Diensten
          </button>
          {NAV.map((l) => (
            <Link key={l.href} href={l.href}
              className={cn('hover:text-[var(--color-brand-primary)]',
                pathname === l.href && 'text-[var(--color-brand-primary)]')}>
              {l.label}
            </Link>
          ))}
        </nav>

        <div className="hidden lg:flex items-center gap-3">
          <a href={`tel:${companyConfig.contact.phone.replace(/\s/g, '')}`}
            className="text-sm flex items-center gap-2 hover:text-[var(--color-brand-primary)]">
            <Phone className="h-4 w-4" /> {companyConfig.contact.phone}
          </a>
          <Button href="/offerte" size="sm">Offerte aanvragen</Button>
        </div>

        <button className="lg:hidden p-2" onClick={() => setMobileOpen((s) => !s)}
          aria-label={mobileOpen ? 'Menu sluiten' : 'Menu openen'}>
          {mobileOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </Container>

      {megaOpen && (
        <div onMouseLeave={() => setMegaOpen(false)} className="absolute inset-x-0 bg-white shadow-lg border-b border-black/5">
          <Container className="py-8">
            <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
              {SERVICES.map((s) => (
                <Link key={s.href} href={s.href} onClick={() => setMegaOpen(false)}
                  className="block rounded-lg p-4 hover:bg-[var(--color-brand-cream)]">
                  <span className="font-medium">{s.label}</span>
                  <span className="block text-xs text-black/60 mt-1">{s.desc}</span>
                </Link>
              ))}
            </div>
          </Container>
        </div>
      )}

      {mobileOpen && (
        <div className="lg:hidden border-t border-black/5">
          <Container className="py-4 space-y-1">
            <details className="group">
              <summary className="flex justify-between items-center py-2 cursor-pointer text-sm">
                Diensten <span className="group-open:rotate-180 transition">▾</span>
              </summary>
              <div className="pl-4 space-y-1 mt-1">
                {SERVICES.map((s) => (
                  <Link key={s.href} href={s.href} onClick={() => setMobileOpen(false)}
                    className="block py-2 text-sm text-black/70 hover:text-black">
                    {s.label}
                  </Link>
                ))}
              </div>
            </details>
            {NAV.map((l) => (
              <Link key={l.href} href={l.href} onClick={() => setMobileOpen(false)}
                className="block py-2 text-sm hover:text-[var(--color-brand-primary)]">
                {l.label}
              </Link>
            ))}
            <div className="pt-3 border-t border-black/5 mt-3">
              <Button href="/offerte" size="md" className="w-full">Offerte aanvragen</Button>
            </div>
          </Container>
        </div>
      )}
    </header>
  );
}
```

Commit: `git add components/layout/Navbar.tsx && git commit -m "feat(layout): migrate Navbar with mega menu and mobile menu"`

---

### Task 5: AnnouncementBar + CookieBanner stub

**Files:**
- `components/layout/AnnouncementBar.tsx`
- `components/layout/CookieBanner.tsx`

- [ ] **AnnouncementBar.tsx:**

```tsx
'use client';

import { useState, useEffect } from 'react';
import { X } from 'lucide-react';

const STORAGE_KEY = 'bpm_announcement_dismissed_v1';
const MESSAGES = [
  'Gratis inmeting bij offerte',
  'Bel direct voor advies: 040 123 4567',
  'Showroom in Geldrop, kom langs',
];

export function AnnouncementBar() {
  const [dismissed, setDismissed] = useState(true);
  const [index, setIndex] = useState(0);

  useEffect(() => { setDismissed(localStorage.getItem(STORAGE_KEY) === 'true'); }, []);
  useEffect(() => {
    if (dismissed) return;
    const t = setInterval(() => setIndex((i) => (i + 1) % MESSAGES.length), 5000);
    return () => clearInterval(t);
  }, [dismissed]);

  if (dismissed) return null;

  return (
    <div className="bg-[var(--color-brand-charcoal)] text-white text-xs">
      <div className="mx-auto max-w-6xl px-6 py-2 flex items-center justify-between">
        <span aria-live="polite">{MESSAGES[index]}</span>
        <button
          onClick={() => { localStorage.setItem(STORAGE_KEY, 'true'); setDismissed(true); }}
          aria-label="Sluit aankondiging"
          className="opacity-70 hover:opacity-100"
        >
          <X className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}
```

- [ ] **CookieBanner.tsx (stub — full impl in Plan 4):**

```tsx
'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

const STORAGE_KEY = 'bpm_cookie_consent_v1';

export function CookieBanner() {
  const [shown, setShown] = useState(false);

  useEffect(() => { setShown(!localStorage.getItem(STORAGE_KEY)); }, []);
  if (!shown) return null;

  const dismiss = (consent: 'all' | 'necessary') => {
    localStorage.setItem(STORAGE_KEY, consent);
    setShown(false);
  };

  return (
    <div className="fixed bottom-4 inset-x-4 sm:inset-x-auto sm:right-4 sm:max-w-sm z-50 rounded-2xl bg-white shadow-2xl border border-black/10 p-5 text-sm">
      <h3 className="font-semibold mb-2">Cookies op deze site</h3>
      <p className="text-black/70 mb-3 text-xs">
        We gebruiken cookies voor essentiële functies en — met je toestemming — om
        de site te verbeteren en advertenties te tonen.{' '}
        <Link href="/cookies" className="underline">Meer info</Link>.
      </p>
      <div className="flex gap-2">
        <button onClick={() => dismiss('necessary')}
          className="flex-1 rounded-lg border border-black/10 px-3 py-2 text-xs font-medium hover:bg-black/5">
          Alleen noodzakelijk
        </button>
        <button onClick={() => dismiss('all')}
          className="flex-1 rounded-lg bg-[var(--color-brand-primary)] text-white px-3 py-2 text-xs font-medium hover:bg-[var(--color-brand-primary-dark)]">
          Alles accepteren
        </button>
      </div>
    </div>
  );
}
```

Commit: `git add components/layout && git commit -m "feat(layout): add AnnouncementBar and CookieBanner stub"`

---

### Task 6: DatePicker (client) — migrate from legacy

**Files:** `components/ui/DatePicker.tsx`
**Reference:** `_legacy/components/DatePicker.tsx`

- [ ] **Step 1: Copy legacy with adaptations**

```bash
cp _legacy/components/DatePicker.tsx components/ui/DatePicker.tsx
```

Then edit `components/ui/DatePicker.tsx`:
1. Make `'use client';` the very first line
2. Replace any `import ReactDOM from 'react-dom'` with `import { createPortal } from 'react-dom';` and update usages (`ReactDOM.createPortal(...)` → `createPortal(...)`)
3. Replace any `from '../config'` with `from '@/lib/company'` and adapt usage
4. Verify no other imports point outside of `components/`, `lib/`, or stdlib

- [ ] **Step 2: Verify**

```bash
npm run typecheck
```
Fix any surfaced type errors.

- [ ] **Step 3: Commit**

```bash
git add components/ui/DatePicker.tsx
git commit -m "feat(ui): migrate DatePicker as client component"
```

---

### Task 7: Public layout with all chrome

**File:** `app/(public)/layout.tsx`

Replace contents:

```tsx
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { AnnouncementBar } from '@/components/layout/AnnouncementBar';
import { CookieBanner } from '@/components/layout/CookieBanner';

export default function PublicLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <AnnouncementBar />
      <Navbar />
      <main>{children}</main>
      <Footer />
      <CookieBanner />
    </>
  );
}
```

Smoke test: `npm run dev` → http://localhost:3000/ shows real chrome. Stop server. Commit.

```bash
git add app/\(public\)/layout.tsx
git commit -m "feat(layout): wire chrome into public layout"
```

---

### Task 8: Database fetch helpers

**Files:** `lib/db/{services,projects,policies,knowledge,leads,appointments}.ts`

Install:
```bash
npm install -D server-only
```

- [ ] **`lib/db/services.ts`:**

```ts
import 'server-only';
import { cache } from 'react';
import { createClient } from '@/lib/supabase/server';

export type Service = {
  id: string;
  slug: string;
  title: string;
  hero_image: string | null;
  body_md: string | null;
  meta_title: string | null;
  meta_description: string | null;
  sort_order: number;
};

export const getServices = cache(async (): Promise<Service[]> => {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from('services')
    .select('*')
    .order('sort_order', { ascending: true });
  if (error) throw error;
  return data ?? [];
});

export const getServiceBySlug = cache(async (slug: string): Promise<Service | null> => {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from('services')
    .select('*')
    .eq('slug', slug)
    .maybeSingle();
  if (error) throw error;
  return data;
});
```

- [ ] **`lib/db/projects.ts`:**

```ts
import 'server-only';
import { cache } from 'react';
import { createClient } from '@/lib/supabase/server';

export type Project = {
  id: string;
  slug: string;
  title: string;
  description: string | null;
  long_description: string | null;
  image_url: string | null;
  gallery_image_urls: string[];
  area_size: number | null;
  location: string | null;
  completed_date: string | null;
  techniques: string[];
  floor_type: string | null;
  is_featured: boolean;
  sort_order: number;
};

export const getProjects = cache(async (): Promise<Project[]> => {
  const supabase = await createClient();
  const { data, error } = await supabase.from('projects').select('*')
    .order('sort_order', { ascending: true });
  if (error) throw error;
  return data ?? [];
});

export const getFeaturedProjects = cache(async (): Promise<Project[]> => {
  const supabase = await createClient();
  const { data, error } = await supabase.from('projects').select('*')
    .eq('is_featured', true).order('sort_order').limit(6);
  if (error) throw error;
  return data ?? [];
});

export const getProjectBySlug = cache(async (slug: string): Promise<Project | null> => {
  const supabase = await createClient();
  const { data, error } = await supabase.from('projects').select('*')
    .eq('slug', slug).maybeSingle();
  if (error) throw error;
  return data;
});
```

- [ ] **`lib/db/policies.ts`:**

```ts
import 'server-only';
import { cache } from 'react';
import { createClient } from '@/lib/supabase/server';

export type Policy = {
  id: string;
  slug: string;
  title: string;
  content_md: string;
  last_updated: string;
};

export const getPolicyBySlug = cache(async (slug: string): Promise<Policy | null> => {
  const supabase = await createClient();
  const { data, error } = await supabase.from('policies').select('*')
    .eq('slug', slug).maybeSingle();
  if (error) throw error;
  return data;
});
```

- [ ] **`lib/db/knowledge.ts`:**

```ts
import 'server-only';
import { cache } from 'react';
import { createClient } from '@/lib/supabase/server';

export type KnowledgeItem = { id: string; topic: string; content: string };

export const getKnowledge = cache(async (): Promise<KnowledgeItem[]> => {
  const supabase = await createClient();
  const { data, error } = await supabase.from('knowledge')
    .select('id, topic, content').order('topic');
  if (error) throw error;
  return data ?? [];
});
```

- [ ] **`lib/db/leads.ts`:**

```ts
import 'server-only';
import { createClient } from '@/lib/supabase/server';

export type LeadInsert = {
  name: string;
  email: string;
  phone: string;
  floor_type?: string;
  area_size?: number;
  message?: string;
  source: string;
  ip_hash?: string;
  user_agent_hash?: string;
};

export async function insertLead(input: LeadInsert) {
  const supabase = await createClient();
  const { data, error } = await supabase.from('leads').insert(input).select().single();
  if (error) throw error;
  return data;
}
```

- [ ] **`lib/db/appointments.ts`:**

```ts
import 'server-only';
import { createClient } from '@/lib/supabase/server';

export type AppointmentInsert = {
  customer_name: string;
  customer_email: string;
  customer_phone?: string;
  date: string;
  notes?: string;
  source: 'chatbot' | 'website' | 'manual';
  ip_hash?: string;
};

export async function insertAppointment(input: AppointmentInsert) {
  const supabase = await createClient();
  const { data, error } = await supabase.from('appointments').insert(input).select().single();
  if (error) throw error;
  return data;
}

export async function countAppointmentsForDate(dateYyyyMmDd: string): Promise<number> {
  const supabase = await createClient();
  const start = `${dateYyyyMmDd}T00:00:00.000Z`;
  const end = `${dateYyyyMmDd}T23:59:59.999Z`;
  const { count, error } = await supabase.from('appointments')
    .select('id', { count: 'exact', head: true })
    .gte('date', start).lte('date', end);
  if (error) throw error;
  return count ?? 0;
}
```

Verify + commit:
```bash
npm run typecheck && \
git add lib/db package.json package-lock.json && \
git commit -m "feat(db): add typed fetch helpers for all tables"
```

---

### Task 9: Seed initial services + policies content

**File:** `supabase/seed.sql`

```sql
-- Idempotent seed for services and policies
INSERT INTO services (slug, title, meta_title, meta_description, body_md, sort_order) VALUES
  ('pvc-vloeren', 'PVC vloeren',
   'PVC vloer laten leggen in Geldrop',
   'Hoogwaardige PVC vloeren bij BPM Parket. Look van hout, gemak van PVC. Showroom in Geldrop.',
   E'## PVC met de uitstraling van echt hout\n\nVoor een hoogwaardig oogje en bewezen duurzaamheid is PVC dé moderne keuze. We werken met click-PVC, lijm-PVC en visgraat-patronen.\n\n## Voordelen\n- Slijtvast, krasbestendig\n- Comfortabel met vloerverwarming\n- Geluidsdempend\n- Onderhoud is een nat doekje\n\n## Onze werkwijze\n1. Kosteloze inmeting aan huis\n2. Advies in de showroom over kleuren en patronen\n3. Vakkundig gelegd door eigen team\n4. Garantie op werk en materiaal',
   1),
  ('traditioneel-parket', 'Traditioneel parket',
   'Traditioneel parket met band en bies — BPM Parket Geldrop',
   'Klassiek parket met band en bies door specialisten. Eikenhouten visgraat, hongaarse punt en patronen op maat.',
   E'## Vakmanschap dat een leven meegaat\n\nTraditioneel parket is meer dan een vloer — het is een investering. Met band-en-bies, hongaarse punt of een patroon op maat maken we van je vloer een statement.\n\n## Wat we leggen\n- Visgraat klein en groot\n- Hongaarse punt\n- Tegelpatronen met inlegrand\n- Schip- en blokpatroon\n\n## Materialen\nWe werken alleen met Europees eikenhout van duurzame bossen.',
   2),
  ('multiplanken', 'Multiplanken',
   'Multiplanken laten leggen — BPM Parket',
   'Brede eikenhouten multiplanken. Stabiel, mooi en geschikt voor vloerverwarming.',
   E'## Brede planken, warme uitstraling\n\nMultiplanken combineren de schoonheid van massief eiken met de stabiliteit van een gelaagde constructie — ideaal voor vloerverwarming.\n\n## Specs\n- Breedtes 180 - 300 mm\n- Lengtes tot 2.5 m\n- Geschikt voor vloerverwarming\n- Diverse afwerkingen',
   3),
  ('laminaat', 'Laminaat',
   'Laminaat leggen — BPM Parket Geldrop',
   'Snelle, betaalbare laminaatvloeren met een natuurlijke uitstraling.',
   E'## De budgetvriendelijke optie\n\nLaminaat is sneller te leggen en goedkoper dan parket of PVC, terwijl moderne laminaten steeds dichter bij het echte werk komen qua uitstraling.\n\n## Wanneer kies je laminaat?\n- Snel project\n- Lager budget\n- Drukbelopen ruimtes',
   4),
  ('traprenovatie', 'Traprenovatie',
   'Traprenovatie — BPM Parket Geldrop',
   'Maak je trap nieuw zonder te slopen.',
   E'## Een nieuwe trap zonder verbouwing\n\nWaarom een hele nieuwe trap als wij hem kunnen renoveren? We monteren nieuwe treden direct over de bestaande trap.\n\n## Opties\n- Massief eikenhout\n- Topfineer\n- PVC treden\n- Anti-slip strips',
   5),
  ('schuren-onderhoud', 'Schuren & onderhoud',
   'Parket schuren en onderhouden — BPM Parket',
   'Parket weer als nieuw. Schuren, oliën, lakken en onderhoudsservice.',
   E'## Parket weer als nieuw\n\nGeen vloer hoeft uit. We schuren bestaand parket op locatie, herstellen beschadigingen en geven een passende afwerking.\n\n## Wat we doen\n- Diepschuren\n- Schuren tussen lagen door\n- Bijwerken van krassen en deuken\n- Onderhoudsservice 1x per jaar',
   6)
ON CONFLICT (slug) DO UPDATE SET
  title = EXCLUDED.title, meta_title = EXCLUDED.meta_title,
  meta_description = EXCLUDED.meta_description, body_md = EXCLUDED.body_md,
  sort_order = EXCLUDED.sort_order, updated_at = now();

INSERT INTO policies (slug, title, content_md) VALUES
  ('privacy', 'Privacyverklaring',
   E'## Privacyverklaring\n\nBPM Parket B.V. (KvK 12345678) hecht waarde aan jouw privacy.\n\n### Welke gegevens\n- Contactgegevens via formulieren of chatbot\n- Technische gegevens (IP, browser) — gehasht voor audit\n- Cookies (alleen na toestemming)\n\n### Waarvoor\n- Beantwoorden van je aanvraag\n- Plannen van een afspraak\n- Site-verbetering (alleen met consent)\n\n### Bewaartermijn\nLeads max 2 jaar tenzij klant. Klantgegevens 7 jaar.\n\n### Jouw rechten\nInzage, correctie of verwijdering: info@bpmparket.nl.'),
  ('algemene-voorwaarden', 'Algemene voorwaarden',
   E'## Algemene voorwaarden\n\n[Bodhi vult dit aan via admin in Plan 3]'),
  ('cookies', 'Cookieverklaring',
   E'## Cookies\n\n### Noodzakelijk\nVoor inlog, sessie en CSRF. Altijd actief.\n\n### Analytisch\nGoogle Analytics 4. Alleen na toestemming.\n\n### Marketing\nGoogle Ads conversiemeting. Alleen na toestemming.\n\nKlik onderaan op "Cookie-voorkeuren beheren" om je keuze aan te passen.')
ON CONFLICT (slug) DO UPDATE SET
  title = EXCLUDED.title, content_md = EXCLUDED.content_md, last_updated = now();
```

Commit:
```bash
git add supabase/seed.sql
git commit -m "feat(db): seed services and policies content"
```

---

### Task 10: Markdown renderer (react-markdown with allowed components)

**Files:** `components/marketing/Markdown.tsx`

- [ ] **Step 1: Install react-markdown**

```bash
npm install react-markdown
```

- [ ] **Step 2: Write Markdown component**

```tsx
import ReactMarkdown from 'react-markdown';

/**
 * Renders Supabase-stored markdown via react-markdown with a strict
 * allowed-component map. Any tag not in this map is silently dropped —
 * this is the XSS boundary. Raw HTML in the source is NOT supported
 * (we don't pass `rehypeRaw`).
 */
const COMPONENTS = {
  h1: (p: React.HTMLAttributes<HTMLHeadingElement>) => (
    <h1 className="heading-display text-3xl mt-8 mb-3" {...p} />
  ),
  h2: (p: React.HTMLAttributes<HTMLHeadingElement>) => (
    <h2 className="heading-display text-2xl mt-8 mb-2" {...p} />
  ),
  h3: (p: React.HTMLAttributes<HTMLHeadingElement>) => (
    <h3 className="font-semibold text-lg mt-6 mb-2" {...p} />
  ),
  h4: (p: React.HTMLAttributes<HTMLHeadingElement>) => (
    <h4 className="font-semibold mt-4 mb-2" {...p} />
  ),
  p: (p: React.HTMLAttributes<HTMLParagraphElement>) => (
    <p className="my-3 leading-relaxed" {...p} />
  ),
  a: ({ href, ...rest }: React.AnchorHTMLAttributes<HTMLAnchorElement>) => (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="text-[var(--color-brand-primary)] underline hover:text-[var(--color-brand-primary-dark)]"
      {...rest}
    />
  ),
  ul: (p: React.HTMLAttributes<HTMLUListElement>) => (
    <ul className="list-disc pl-5 my-3 space-y-1" {...p} />
  ),
  ol: (p: React.HTMLAttributes<HTMLOListElement>) => (
    <ol className="list-decimal pl-5 my-3 space-y-1" {...p} />
  ),
  li: (p: React.HTMLAttributes<HTMLLIElement>) => <li {...p} />,
  strong: (p: React.HTMLAttributes<HTMLElement>) => (
    <strong className="font-semibold" {...p} />
  ),
  em: (p: React.HTMLAttributes<HTMLElement>) => <em {...p} />,
  code: (p: React.HTMLAttributes<HTMLElement>) => (
    <code className="bg-black/5 px-1 rounded text-sm" {...p} />
  ),
  blockquote: (p: React.HTMLAttributes<HTMLQuoteElement>) => (
    <blockquote className="border-l-4 border-black/10 pl-4 italic my-4" {...p} />
  ),
  hr: () => <hr className="my-6 border-black/10" />,
};

export function Markdown({ children }: { children: string }) {
  return <ReactMarkdown components={COMPONENTS}>{children}</ReactMarkdown>;
}
```

Commit:
```bash
git add components/marketing/Markdown.tsx package.json package-lock.json
git commit -m "feat: add react-markdown renderer with strict allowed-tag map"
```

---

### Task 11: Service pages (template + 6 routes)

**Files:**
- `components/marketing/ServicePageTemplate.tsx`
- `app/(public)/{pvc-vloeren,traditioneel-parket,multiplanken,laminaat,traprenovatie,schuren-onderhoud}/page.tsx`

- [ ] **Step 1: ServicePageTemplate**

```tsx
import { notFound } from 'next/navigation';
import Image from 'next/image';
import { Container } from '@/components/ui/Container';
import { Button } from '@/components/ui/Button';
import { Markdown } from '@/components/marketing/Markdown';
import { getServiceBySlug } from '@/lib/db/services';

export async function ServicePage({ slug }: { slug: string }) {
  const service = await getServiceBySlug(slug);
  if (!service) notFound();

  return (
    <>
      <section className="bg-[var(--color-brand-charcoal)] text-white">
        <Container className="py-16 md:py-24">
          <h1 className="heading-display text-4xl md:text-5xl">{service.title}</h1>
          <p className="mt-4 max-w-2xl text-white/70">{service.meta_description}</p>
          <div className="mt-6 flex gap-3">
            <Button href="/offerte">Vraag offerte aan</Button>
            <Button href="/showroom" variant="outline"
              className="border-white/20 text-white hover:bg-white/10">
              Plan showroombezoek
            </Button>
          </div>
        </Container>
      </section>

      {service.hero_image && (
        <div className="relative h-72 md:h-96">
          <Image src={service.hero_image} alt={service.title} fill sizes="100vw"
            className="object-cover" priority />
        </div>
      )}

      <Container size="narrow" className="py-12 md:py-16">
        {service.body_md && <Markdown>{service.body_md}</Markdown>}
      </Container>
    </>
  );
}
```

- [ ] **Step 2: Six page files**

For each `<slug>` in `pvc-vloeren`, `traditioneel-parket`, `multiplanken`, `laminaat`, `traprenovatie`, `schuren-onderhoud`, create `app/(public)/<slug>/page.tsx`:

```tsx
import type { Metadata } from 'next';
import { ServicePage } from '@/components/marketing/ServicePageTemplate';
import { getServiceBySlug } from '@/lib/db/services';

const SLUG = '<slug>';

export async function generateMetadata(): Promise<Metadata> {
  const s = await getServiceBySlug(SLUG);
  return {
    title: s?.meta_title ?? s?.title,
    description: s?.meta_description ?? undefined,
  };
}

export default function Page() {
  return <ServicePage slug={SLUG} />;
}
```

- [ ] **Step 3: Verify + commit**

```bash
npm run typecheck && \
git add components/marketing/ServicePageTemplate.tsx "app/(public)/pvc-vloeren" "app/(public)/traditioneel-parket" "app/(public)/multiplanken" "app/(public)/laminaat" "app/(public)/traprenovatie" "app/(public)/schuren-onderhoud" && \
git commit -m "feat(public): 6 service pages backed by Supabase services table"
```

---

### Task 12: Home page (Hero + USP + ServicesGrid + ProjectsPreview + Reviews + CTA)

**Files:**
- `components/marketing/{Hero,USPRow,ServicesGrid,ProjectsPreview,ReviewsRow,CtaSection}.tsx`
- Replace: `app/(public)/page.tsx`

Each component is small. Reference: `_legacy/pages/Home.tsx`.

- [ ] **`components/marketing/Hero.tsx`:**

```tsx
import Image from 'next/image';
import { Container } from '@/components/ui/Container';
import { Button } from '@/components/ui/Button';

export function Hero() {
  return (
    <section className="relative h-[80vh] min-h-[500px] flex items-center text-white">
      <Image src="https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&q=80&w=2000"
        alt="Parketvloer" fill sizes="100vw" className="object-cover" priority />
      <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/40 to-black/20" />
      <Container className="relative z-10">
        <h1 className="heading-display text-4xl md:text-6xl max-w-3xl">
          Vloeren met karakter, gelegd door vakmensen
        </h1>
        <p className="mt-4 text-lg max-w-xl text-white/85">
          Traditioneel parket, PVC, laminaat en traprenovatie — al meer dan 20 jaar
          vakmanschap uit Geldrop.
        </p>
        <div className="mt-8 flex flex-wrap gap-3">
          <Button href="/offerte" size="lg">Vraag offerte aan</Button>
          <Button href="/showroom" variant="outline" size="lg"
            className="border-white/30 text-white hover:bg-white/10">
            Bezoek de showroom
          </Button>
        </div>
      </Container>
    </section>
  );
}
```

- [ ] **`components/marketing/USPRow.tsx`:**

```tsx
import { ShieldCheck, Hammer, Award, Users } from 'lucide-react';
import { Container } from '@/components/ui/Container';

const USPS = [
  { icon: ShieldCheck, title: 'Garantie op werk', desc: 'Tot 5 jaar' },
  { icon: Hammer, title: 'Eigen team', desc: 'Geen onderaannemers' },
  { icon: Award, title: '20+ jaar ervaring', desc: 'Sinds 2003' },
  { icon: Users, title: '500+ projecten', desc: 'In Zuidoost-Brabant' },
];

export function USPRow() {
  return (
    <Container className="py-12">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
        {USPS.map(({ icon: Icon, title, desc }) => (
          <div key={title} className="flex items-start gap-3">
            <Icon className="h-6 w-6 text-[var(--color-brand-primary)] shrink-0 mt-0.5" />
            <div>
              <p className="font-medium text-sm">{title}</p>
              <p className="text-xs text-black/60">{desc}</p>
            </div>
          </div>
        ))}
      </div>
    </Container>
  );
}
```

- [ ] **`components/marketing/ServicesGrid.tsx`:**

```tsx
import Link from 'next/link';
import Image from 'next/image';
import { Container } from '@/components/ui/Container';
import { getServices } from '@/lib/db/services';

export async function ServicesGrid() {
  const services = await getServices();

  return (
    <Container className="py-16 md:py-24">
      <h2 className="heading-display text-3xl md:text-4xl">Onze diensten</h2>
      <p className="mt-3 text-black/70 max-w-2xl">
        Van traditioneel parket tot PVC: alles in eigen huis.
      </p>

      <div className="mt-10 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {services.map((s) => (
          <Link key={s.id} href={`/${s.slug}`}
            className="group block rounded-2xl overflow-hidden bg-white shadow-sm hover:shadow-md transition">
            {s.hero_image && (
              <div className="relative h-48">
                <Image src={s.hero_image} alt={s.title} fill
                  sizes="(max-width: 768px) 100vw, 33vw"
                  className="object-cover group-hover:scale-105 transition-transform" />
              </div>
            )}
            <div className="p-5">
              <h3 className="font-medium text-lg">{s.title}</h3>
              <p className="text-sm text-black/60 mt-1 line-clamp-2">{s.meta_description}</p>
            </div>
          </Link>
        ))}
      </div>
    </Container>
  );
}
```

- [ ] **`components/marketing/ProjectsPreview.tsx`:**

```tsx
import Link from 'next/link';
import Image from 'next/image';
import { Container } from '@/components/ui/Container';
import { Button } from '@/components/ui/Button';
import { getFeaturedProjects } from '@/lib/db/projects';

export async function ProjectsPreview() {
  const projects = await getFeaturedProjects();
  if (projects.length === 0) return null;

  return (
    <section className="bg-white py-16 md:py-24">
      <Container>
        <div className="flex items-end justify-between mb-10">
          <div>
            <h2 className="heading-display text-3xl md:text-4xl">Recente projecten</h2>
            <p className="text-black/70 mt-2">Een greep uit ons werk.</p>
          </div>
          <Button href="/projecten" variant="ghost">Alle projecten →</Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {projects.slice(0, 6).map((p) => (
            <Link key={p.id} href={`/projecten/${p.slug}`}
              className="group block rounded-2xl overflow-hidden">
              {p.image_url && (
                <div className="relative aspect-[4/3]">
                  <Image src={p.image_url} alt={p.title} fill
                    sizes="(max-width: 768px) 100vw, 33vw"
                    className="object-cover group-hover:scale-105 transition-transform" />
                </div>
              )}
              <div className="pt-3">
                <h3 className="font-medium">{p.title}</h3>
                {p.location && <p className="text-xs text-black/50 mt-0.5">{p.location}</p>}
              </div>
            </Link>
          ))}
        </div>
      </Container>
    </section>
  );
}
```

- [ ] **`components/marketing/ReviewsRow.tsx`:**

```tsx
import { Star } from 'lucide-react';
import { Container } from '@/components/ui/Container';

const REVIEWS = [
  { author: 'Anneke v. d. K.', text: 'Prachtige visgraat in onze woonkamer. Vakwerk!', stars: 5 },
  { author: 'Jeroen B.', text: 'PVC vloer ligt al 3 jaar perfect. Top advies en service.', stars: 5 },
  { author: 'Familie van Dijk', text: 'Onze trap heeft een tweede leven gekregen. Bedankt!', stars: 5 },
];

export function ReviewsRow() {
  return (
    <Container className="py-16 md:py-20">
      <h2 className="heading-display text-3xl md:text-4xl">Wat klanten zeggen</h2>
      <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
        {REVIEWS.map((r) => (
          <div key={r.author} className="rounded-2xl bg-white p-6 shadow-sm">
            <div className="flex gap-0.5 mb-2 text-[var(--color-brand-accent)]">
              {Array.from({ length: r.stars }).map((_, i) => (
                <Star key={i} className="h-4 w-4 fill-current" />
              ))}
            </div>
            <p className="text-sm">{r.text}</p>
            <p className="mt-3 text-xs text-black/50">— {r.author}</p>
          </div>
        ))}
      </div>
    </Container>
  );
}
```

- [ ] **`components/marketing/CtaSection.tsx`:**

```tsx
import { Container } from '@/components/ui/Container';
import { Button } from '@/components/ui/Button';

export function CtaSection() {
  return (
    <section className="bg-[var(--color-brand-primary)] text-white py-16 md:py-20">
      <Container className="text-center">
        <h2 className="heading-display text-3xl md:text-4xl">Klaar voor je nieuwe vloer?</h2>
        <p className="mt-3 text-white/85 max-w-xl mx-auto">
          Vraag een vrijblijvende offerte aan of plan een bezoek aan onze showroom.
        </p>
        <div className="mt-6 flex justify-center gap-3">
          <Button href="/offerte" variant="secondary" size="lg">Offerte aanvragen</Button>
          <Button href="/showroom" variant="outline" size="lg"
            className="border-white/30 text-white hover:bg-white/10">
            Plan showroombezoek
          </Button>
        </div>
      </Container>
    </section>
  );
}
```

- [ ] **`app/(public)/page.tsx` (replace):**

```tsx
import { Hero } from '@/components/marketing/Hero';
import { USPRow } from '@/components/marketing/USPRow';
import { ServicesGrid } from '@/components/marketing/ServicesGrid';
import { ProjectsPreview } from '@/components/marketing/ProjectsPreview';
import { ReviewsRow } from '@/components/marketing/ReviewsRow';
import { CtaSection } from '@/components/marketing/CtaSection';

export default function HomePage() {
  return (
    <>
      <Hero />
      <USPRow />
      <ServicesGrid />
      <ProjectsPreview />
      <ReviewsRow />
      <CtaSection />
    </>
  );
}
```

Verify + commit:
```bash
npm run typecheck && npm run build && \
git add components/marketing app/\(public\)/page.tsx && \
git commit -m "feat(public): home page from RSC sections"
```

---

### Task 13: Projects listing + detail

**Files:**
- `app/(public)/projecten/page.tsx`
- `app/(public)/projecten/[slug]/page.tsx`

- [ ] **Listing:**

```tsx
import type { Metadata } from 'next';
import Link from 'next/link';
import Image from 'next/image';
import { Container } from '@/components/ui/Container';
import { getProjects } from '@/lib/db/projects';

export const metadata: Metadata = {
  title: 'Projecten',
  description: 'Bekijk een greep uit onze recente projecten.',
};

export default async function ProjectsListingPage() {
  const projects = await getProjects();

  return (
    <Container className="py-16 md:py-24">
      <h1 className="heading-display text-4xl md:text-5xl">Projecten</h1>
      <p className="mt-3 text-black/70 max-w-2xl">Een greep uit ons werk in Zuidoost-Brabant.</p>

      <div className="mt-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {projects.map((p) => (
          <Link key={p.id} href={`/projecten/${p.slug}`}
            className="group block rounded-2xl overflow-hidden">
            {p.image_url && (
              <div className="relative aspect-[4/3]">
                <Image src={p.image_url} alt={p.title} fill
                  sizes="(max-width: 768px) 100vw, 33vw"
                  className="object-cover group-hover:scale-105 transition-transform" />
              </div>
            )}
            <div className="pt-3">
              <h2 className="font-medium">{p.title}</h2>
              {p.location && <p className="text-xs text-black/50 mt-0.5">{p.location}</p>}
            </div>
          </Link>
        ))}
      </div>
    </Container>
  );
}
```

- [ ] **Detail:**

```tsx
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Image from 'next/image';
import { Container } from '@/components/ui/Container';
import { Button } from '@/components/ui/Button';
import { getProjectBySlug } from '@/lib/db/projects';

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const p = await getProjectBySlug(slug);
  return {
    title: p?.title ?? 'Project',
    description: p?.description ?? undefined,
  };
}

export default async function ProjectDetailPage({ params }: Props) {
  const { slug } = await params;
  const project = await getProjectBySlug(slug);
  if (!project) notFound();

  return (
    <>
      {project.image_url && (
        <div className="relative h-72 md:h-[480px]">
          <Image src={project.image_url} alt={project.title} fill sizes="100vw"
            className="object-cover" priority />
        </div>
      )}

      <Container size="narrow" className="py-12 md:py-16">
        <h1 className="heading-display text-3xl md:text-4xl">{project.title}</h1>
        {project.location && <p className="mt-2 text-sm text-black/60">{project.location}</p>}

        <dl className="mt-8 grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
          {project.area_size && (
            <div>
              <dt className="text-black/50">Oppervlak</dt>
              <dd className="font-medium">{project.area_size} m²</dd>
            </div>
          )}
          {project.floor_type && (
            <div>
              <dt className="text-black/50">Type</dt>
              <dd className="font-medium">{project.floor_type}</dd>
            </div>
          )}
          {project.completed_date && (
            <div>
              <dt className="text-black/50">Opgeleverd</dt>
              <dd className="font-medium">
                {new Date(project.completed_date).toLocaleDateString('nl-NL', {
                  month: 'long', year: 'numeric',
                })}
              </dd>
            </div>
          )}
        </dl>

        {project.long_description && (
          <p className="mt-8 text-base leading-relaxed text-black/80 whitespace-pre-line">
            {project.long_description}
          </p>
        )}

        {project.gallery_image_urls.length > 0 && (
          <div className="mt-12 grid grid-cols-2 gap-3">
            {project.gallery_image_urls.map((url, i) => (
              <div key={i} className="relative aspect-square rounded-xl overflow-hidden">
                <Image src={url} alt="" fill sizes="50vw" className="object-cover" />
              </div>
            ))}
          </div>
        )}

        <div className="mt-12 pt-8 border-t border-black/10 text-center">
          <p className="text-black/70">Wil je iets soortgelijks?</p>
          <Button href="/offerte" className="mt-3">Vraag een offerte aan</Button>
        </div>
      </Container>
    </>
  );
}
```

Commit: `git add app/\(public\)/projecten && git commit -m "feat(public): projects listing and detail"`

---

### Task 14: Showroom + Over Ons + Contact

**Files:**
- `app/(public)/showroom/page.tsx`
- `app/(public)/over-ons/page.tsx`
- `app/(public)/contact/page.tsx`

(Reference: `_legacy/pages/Showroom.tsx`, `_legacy/pages/AboutUs.tsx`, `_legacy/pages/Contact.tsx` for design intent.)

- [ ] **Showroom:**

```tsx
import type { Metadata } from 'next';
import Image from 'next/image';
import { Phone, Mail, MapPin, Clock } from 'lucide-react';
import { Container } from '@/components/ui/Container';
import { Button } from '@/components/ui/Button';
import { companyConfig } from '@/lib/company';

export const metadata: Metadata = {
  title: 'Showroom',
  description: 'Bezoek onze showroom in Geldrop. Bekijk de vloeren in het echt.',
};

const HOURS = Object.entries(companyConfig.hours);

export default function ShowroomPage() {
  return (
    <>
      <section className="relative h-72">
        <Image src="https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&q=80&w=2000"
          alt="Showroom" fill sizes="100vw" className="object-cover" priority />
        <div className="absolute inset-0 bg-black/40" />
        <Container className="absolute inset-0 flex items-end pb-10 text-white">
          <h1 className="heading-display text-4xl md:text-5xl">Onze showroom</h1>
        </Container>
      </section>

      <Container className="py-12 md:py-16 grid grid-cols-1 lg:grid-cols-2 gap-12">
        <div>
          <h2 className="heading-display text-2xl">Kom langs in Geldrop</h2>
          <p className="mt-3 text-black/70">
            In onze showroom kun je de vloeren in het echt zien en voelen. Onze
            vakmensen geven je persoonlijk advies — zonder verkooppraatjes, mét
            inzicht uit ruim 20 jaar ervaring.
          </p>

          <div className="mt-8 space-y-4 text-sm">
            <div className="flex items-start gap-3">
              <MapPin className="h-5 w-5 text-[var(--color-brand-primary)] shrink-0 mt-0.5" />
              <div>
                <p className="font-medium">Adres</p>
                <p className="text-black/70">
                  {companyConfig.contact.address}, {companyConfig.contact.zipCity}
                </p>
                <a href={companyConfig.contact.mapsUrl}
                  className="text-[var(--color-brand-primary)] underline mt-1 inline-block">
                  Open in Google Maps
                </a>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <Phone className="h-5 w-5 text-[var(--color-brand-primary)] shrink-0 mt-0.5" />
              <div>
                <p className="font-medium">Telefoon</p>
                <a href={`tel:${companyConfig.contact.phone.replace(/\s/g, '')}`}>
                  {companyConfig.contact.phone}
                </a>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <Mail className="h-5 w-5 text-[var(--color-brand-primary)] shrink-0 mt-0.5" />
              <div>
                <p className="font-medium">Email</p>
                <a href={`mailto:${companyConfig.contact.email}`}>
                  {companyConfig.contact.email}
                </a>
              </div>
            </div>
          </div>

          <Button href="/offerte" className="mt-8">Plan een afspraak</Button>
        </div>

        <div>
          <h2 className="heading-display text-2xl flex items-center gap-2">
            <Clock className="h-6 w-6" /> Openingstijden
          </h2>
          <dl className="mt-4 rounded-2xl bg-white p-6 shadow-sm divide-y divide-black/5">
            {HOURS.map(([day, hours]) => (
              <div key={day} className="flex justify-between py-2 text-sm">
                <dt className="capitalize text-black/70">{day}</dt>
                <dd className="font-medium">{hours}</dd>
              </div>
            ))}
          </dl>
          <p className="text-xs text-black/50 mt-3">
            Tip: bel even voor je komt — dan staat er koffie klaar.
          </p>
        </div>
      </Container>
    </>
  );
}
```

- [ ] **Over Ons:**

```tsx
import type { Metadata } from 'next';
import Image from 'next/image';
import { Container } from '@/components/ui/Container';
import { Button } from '@/components/ui/Button';

export const metadata: Metadata = {
  title: 'Over ons',
  description: 'Twintig jaar vakmanschap in parket en PVC, vanuit Geldrop.',
};

export default function AboutPage() {
  return (
    <>
      <section className="relative h-72">
        <Image src="https://images.unsplash.com/photo-1585129777188-94600bc7b4b3?auto=format&fit=crop&q=80&w=2000"
          alt="Werkplaats" fill sizes="100vw" className="object-cover" />
        <div className="absolute inset-0 bg-black/40" />
        <Container className="absolute inset-0 flex items-end pb-10 text-white">
          <h1 className="heading-display text-4xl md:text-5xl">Over BPM Parket</h1>
        </Container>
      </section>

      <Container size="narrow" className="py-12 md:py-16 space-y-8 text-black/80 leading-relaxed">
        <p className="text-lg">
          BPM Parket bestaat al ruim 20 jaar. Wat ooit begon met traditioneel parket
          legt nu ook PVC, laminaat, multiplanken en complete traprenovaties.
        </p>
        <p>
          We zijn een familiebedrijf met een eigen team. Geen onderaannemers, geen
          verkooppraatjes — alleen vakmanschap dat we zelf in handen hebben.
        </p>
        <h2 className="heading-display text-2xl pt-4">Het team</h2>
        <p>
          Bodhi en Wil van Baar runnen het bedrijf samen. Bodhi doet de offertes en
          inmetingen; Wil leidt het team in de werkplaats en op locatie. Daarnaast
          hebben we drie vaste vakmensen.
        </p>

        <div className="pt-6 text-center">
          <Button href="/showroom">Kom langs in de showroom</Button>
        </div>
      </Container>
    </>
  );
}
```

- [ ] **Contact (uses LeadForm from Task 18):**

```tsx
import type { Metadata } from 'next';
import { Phone, Mail, MapPin } from 'lucide-react';
import { Container } from '@/components/ui/Container';
import { LeadForm } from '@/components/forms/LeadForm';
import { companyConfig } from '@/lib/company';

export const metadata: Metadata = {
  title: 'Contact',
  description: 'Neem contact op met BPM Parket in Geldrop.',
};

export default function ContactPage() {
  return (
    <Container className="py-12 md:py-16 grid grid-cols-1 lg:grid-cols-2 gap-12">
      <div>
        <h1 className="heading-display text-4xl md:text-5xl">Contact</h1>
        <p className="mt-3 text-black/70">
          Vragen, een offerte of gewoon een goed gesprek? We staan voor je klaar.
        </p>

        <div className="mt-8 space-y-4 text-sm">
          <div className="flex items-start gap-3">
            <Phone className="h-5 w-5 text-[var(--color-brand-primary)] shrink-0 mt-0.5" />
            <div>
              <p className="font-medium">Telefoon</p>
              <a href={`tel:${companyConfig.contact.phone.replace(/\s/g, '')}`}>
                {companyConfig.contact.phone}
              </a>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <Mail className="h-5 w-5 text-[var(--color-brand-primary)] shrink-0 mt-0.5" />
            <div>
              <p className="font-medium">Email</p>
              <a href={`mailto:${companyConfig.contact.email}`}>{companyConfig.contact.email}</a>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <MapPin className="h-5 w-5 text-[var(--color-brand-primary)] shrink-0 mt-0.5" />
            <div>
              <p className="font-medium">Showroom</p>
              <p className="text-black/70">
                {companyConfig.contact.address}, {companyConfig.contact.zipCity}
              </p>
            </div>
          </div>
        </div>
      </div>

      <div>
        <h2 className="heading-display text-2xl">Stuur ons een bericht</h2>
        <div className="mt-4">
          <LeadForm source="contact-form" />
        </div>
      </div>
    </Container>
  );
}
```

(`LeadForm` is created in Task 18; this page won't compile until Task 18 is done.)

Commit:
```bash
git add app/\(public\)/showroom app/\(public\)/over-ons app/\(public\)/contact
git commit -m "feat(public): Showroom, Over Ons, Contact pages"
```

---

### Task 15: PVC ad landing (own layout)

**Files:**
- `app/(public)/pvc-laten-leggen/layout.tsx`
- `app/(public)/pvc-laten-leggen/page.tsx`

- [ ] **layout.tsx:**

```tsx
// Override public chrome — pure ad-landing intent.
import type { ReactNode } from 'react';

export default function LandingLayout({ children }: { children: ReactNode }) {
  return <div className="min-h-screen bg-white">{children}</div>;
}
```

- [ ] **page.tsx:**

```tsx
import type { Metadata } from 'next';
import Image from 'next/image';
import { Phone, CheckCircle, Clock, Users } from 'lucide-react';
import { LeadForm } from '@/components/forms/LeadForm';
import { Container } from '@/components/ui/Container';
import { companyConfig } from '@/lib/company';

export const metadata: Metadata = {
  title: 'PVC vloer laten leggen in Geldrop — gratis offerte',
  description: 'Hoogwaardige PVC vloeren door BPM Parket. Gratis inmeting, vaste prijs.',
  robots: { index: false, follow: true },
};

const PHONE = companyConfig.contact.phone;

export default function PvcLandingPage() {
  return (
    <Container className="py-10 grid grid-cols-1 lg:grid-cols-2 gap-12">
      <div>
        <a href={`tel:${PHONE.replace(/\s/g, '')}`}
          className="inline-flex items-center gap-2 text-sm text-[var(--color-brand-primary)] mb-6">
          <Phone className="h-4 w-4" /> Direct bellen: {PHONE}
        </a>

        <h1 className="heading-display text-4xl md:text-5xl">
          PVC vloer laten leggen in Geldrop
        </h1>
        <p className="mt-4 text-black/70">
          Hoogwaardige PVC vloeren — look van hout, gemak van PVC. Gratis inmeting,
          vaste prijs, gelegd door ons eigen team.
        </p>

        <ul className="mt-8 space-y-3 text-sm">
          {[
            'Gratis inmeting aan huis',
            'Vaste prijs vooraf — geen verrassingen',
            'Eigen team, geen onderaannemers',
            'Garantie op werk en materiaal',
            '20+ jaar ervaring',
          ].map((b) => (
            <li key={b} className="flex items-center gap-2">
              <CheckCircle className="h-5 w-5 text-[var(--color-brand-primary)]" />
              {b}
            </li>
          ))}
        </ul>

        <div className="relative h-64 mt-10 rounded-2xl overflow-hidden">
          <Image src="https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?auto=format&fit=crop&q=80&w=2000"
            alt="PVC vloer" fill sizes="(max-width: 1024px) 100vw, 50vw"
            className="object-cover" priority />
        </div>

        <div className="mt-8 grid grid-cols-2 gap-4 text-sm">
          <div className="flex items-center gap-2">
            <Clock className="h-5 w-5 text-[var(--color-brand-primary)]" />
            Reactie binnen 24u
          </div>
          <div className="flex items-center gap-2">
            <Users className="h-5 w-5 text-[var(--color-brand-primary)]" />
            500+ tevreden klanten
          </div>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-sm p-6 lg:p-8 lg:sticky lg:top-6 self-start">
        <h2 className="heading-display text-2xl">Vraag je offerte aan</h2>
        <p className="text-sm text-black/60 mt-1">
          Vul dit formulier in en we nemen binnen 24 uur contact op.
        </p>
        <div className="mt-5">
          <LeadForm source="landing-pvc" floorType="pvc" defaultMessage="PVC vloer aanvraag via landingspagina" />
        </div>
      </div>
    </Container>
  );
}
```

Commit:
```bash
git add app/\(public\)/pvc-laten-leggen
git commit -m "feat(public): PVC ad landing page with own layout"
```

---

### Task 16: Policy pages + 404

**Files:**
- `components/marketing/PolicyPage.tsx`
- `app/(public)/{privacy,cookies,algemene-voorwaarden}/page.tsx`
- `app/not-found.tsx`

- [ ] **PolicyPage.tsx:**

```tsx
import { notFound } from 'next/navigation';
import { Container } from '@/components/ui/Container';
import { Markdown } from '@/components/marketing/Markdown';
import { getPolicyBySlug } from '@/lib/db/policies';

export async function PolicyPage({ slug }: { slug: string }) {
  const policy = await getPolicyBySlug(slug);
  if (!policy) notFound();

  return (
    <Container size="narrow" className="py-12 md:py-16">
      <h1 className="heading-display text-3xl md:text-4xl">{policy.title}</h1>
      <p className="mt-2 text-xs text-black/50">
        Laatst bijgewerkt:{' '}
        {new Date(policy.last_updated).toLocaleDateString('nl-NL', {
          day: 'numeric', month: 'long', year: 'numeric',
        })}
      </p>
      <article className="mt-8">
        <Markdown>{policy.content_md}</Markdown>
      </article>
    </Container>
  );
}
```

- [ ] **Three policy page files (replace `<slug>` per file):**

```tsx
import type { Metadata } from 'next';
import { PolicyPage } from '@/components/marketing/PolicyPage';
import { getPolicyBySlug } from '@/lib/db/policies';

const SLUG = '<slug>';

export async function generateMetadata(): Promise<Metadata> {
  const p = await getPolicyBySlug(SLUG);
  return { title: p?.title ?? 'Beleid' };
}

export default function Page() {
  return <PolicyPage slug={SLUG} />;
}
```

Three files: `privacy/page.tsx`, `cookies/page.tsx`, `algemene-voorwaarden/page.tsx`.

- [ ] **`app/not-found.tsx`:**

```tsx
import { Container } from '@/components/ui/Container';
import { Button } from '@/components/ui/Button';

export default function NotFound() {
  return (
    <Container className="py-24 text-center">
      <p className="text-sm text-black/50">404</p>
      <h1 className="heading-display text-3xl md:text-4xl mt-2">Pagina niet gevonden</h1>
      <p className="mt-3 text-black/70">
        We konden deze pagina niet vinden. Misschien werkt deze nog wel:
      </p>
      <div className="mt-8 flex justify-center gap-3">
        <Button href="/">Naar home</Button>
        <Button href="/contact" variant="outline">Contact opnemen</Button>
      </div>
    </Container>
  );
}
```

Commit:
```bash
git add components/marketing/PolicyPage.tsx app/\(public\)/privacy app/\(public\)/cookies app/\(public\)/algemene-voorwaarden app/not-found.tsx
git commit -m "feat(public): policy pages and 404"
```

---

### Task 17: Form validation + lead Server Action (no email yet)

**Files:**
- `lib/validation/forms.ts`
- `lib/hash.ts`
- `lib/rate-limit.ts`
- `actions/leads.ts`

- [ ] **`lib/validation/forms.ts`:**

```ts
import { z } from 'zod';

export const leadSchema = z.object({
  name: z.string().min(2, 'Naam is verplicht').max(100),
  email: z.string().email('Ongeldig emailadres').max(200),
  phone: z.string().min(10, 'Telefoonnummer is te kort').max(20)
    .regex(/^[0-9 +()-]+$/, 'Alleen cijfers en spaties toegestaan'),
  floor_type: z.string().max(50).optional(),
  area_size: z.coerce.number().int().min(0).max(10000).optional(),
  message: z.string().max(2000).optional(),
  source: z.string().max(50),
  // Honeypot — must be empty
  website: z.string().max(0, 'Bot detected').optional(),
});

export type LeadInput = z.infer<typeof leadSchema>;
```

- [ ] **`lib/hash.ts`:**

```ts
import 'server-only';
import { createHash } from 'node:crypto';

const SALT = process.env.HASH_SALT || 'bpm-parket-salt-change-in-production';

export function hashIdentifier(value: string): string {
  return createHash('sha256').update(`${SALT}:${value}`).digest('hex').slice(0, 32);
}
```

- [ ] **`lib/rate-limit.ts`:**

```ts
import 'server-only';

type Result = { allowed: boolean; remaining: number; resetAt: number };

const memoryStore = new Map<string, { count: number; resetAt: number }>();

export async function rateLimit(
  key: string, limit: number, windowSeconds: number,
): Promise<Result> {
  const url = process.env.UPSTASH_REDIS_REST_URL;
  const token = process.env.UPSTASH_REDIS_REST_TOKEN;

  if (!url || !token) {
    // Dev fallback — in-memory
    const now = Date.now();
    const entry = memoryStore.get(key);
    if (!entry || now > entry.resetAt) {
      memoryStore.set(key, { count: 1, resetAt: now + windowSeconds * 1000 });
      return { allowed: true, remaining: limit - 1, resetAt: now + windowSeconds * 1000 };
    }
    if (entry.count >= limit) {
      return { allowed: false, remaining: 0, resetAt: entry.resetAt };
    }
    entry.count += 1;
    return { allowed: true, remaining: limit - entry.count, resetAt: entry.resetAt };
  }

  const pipeline = [
    ['INCR', key],
    ['EXPIRE', key, windowSeconds, 'NX'],
    ['PTTL', key],
  ];
  const res = await fetch(`${url}/pipeline`, {
    method: 'POST',
    headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
    body: JSON.stringify(pipeline),
  });
  if (!res.ok) {
    return { allowed: true, remaining: limit, resetAt: Date.now() + windowSeconds * 1000 };
  }
  const json = (await res.json()) as Array<{ result: number }>;
  const count = json[0]?.result ?? 0;
  const ttl = json[2]?.result ?? windowSeconds * 1000;
  return {
    allowed: count <= limit,
    remaining: Math.max(0, limit - count),
    resetAt: Date.now() + ttl,
  };
}
```

- [ ] **`actions/leads.ts`** (email side-effects added in Task 23):

```ts
'use server';

import { headers } from 'next/headers';
import { revalidatePath } from 'next/cache';
import { leadSchema } from '@/lib/validation/forms';
import { insertLead } from '@/lib/db/leads';
import { hashIdentifier } from '@/lib/hash';
import { rateLimit } from '@/lib/rate-limit';

export type CreateLeadState =
  | { status: 'idle' }
  | { status: 'success' }
  | { status: 'error'; message: string };

export async function createLeadAction(
  _prev: CreateLeadState,
  formData: FormData,
): Promise<CreateLeadState> {
  const headerStore = await headers();
  const ip = headerStore.get('x-forwarded-for')?.split(',')[0].trim() ?? 'unknown';
  const ua = headerStore.get('user-agent') ?? 'unknown';

  const rl = await rateLimit(`lead:${ip}`, 5, 60 * 60);
  if (!rl.allowed) {
    return { status: 'error', message: 'Te veel aanvragen — probeer het over een uur opnieuw.' };
  }

  const parsed = leadSchema.safeParse({
    name: formData.get('name'),
    email: formData.get('email'),
    phone: formData.get('phone'),
    floor_type: formData.get('floor_type') || undefined,
    area_size: formData.get('area_size') || undefined,
    message: formData.get('message') || undefined,
    source: formData.get('source') ?? 'unknown',
    website: formData.get('website') || undefined,
  });

  if (!parsed.success) {
    return { status: 'error', message: parsed.error.issues[0].message };
  }

  // Honeypot caught — silently report success to fool the bot
  if (parsed.data.website) {
    return { status: 'success' };
  }

  try {
    await insertLead({
      name: parsed.data.name,
      email: parsed.data.email,
      phone: parsed.data.phone,
      floor_type: parsed.data.floor_type,
      area_size: parsed.data.area_size,
      message: parsed.data.message,
      source: parsed.data.source,
      ip_hash: hashIdentifier(ip),
      user_agent_hash: hashIdentifier(ua),
    });

    // Email side-effects added in Task 23 (after Resend setup).

    revalidatePath('/admin/leads');
    return { status: 'success' };
  } catch (e) {
    console.error('Lead insert error:', e);
    return {
      status: 'error',
      message: 'Er is iets misgegaan. Probeer het later nog eens of bel ons.',
    };
  }
}
```

Commit:
```bash
git add lib/validation lib/hash.ts lib/rate-limit.ts actions/leads.ts
git commit -m "feat(forms): add validation, hash, rate limit, createLead action"
```

---

### Task 18: LeadForm + Quote page

**Files:**
- `components/forms/LeadForm.tsx`
- `app/(public)/offerte/page.tsx`

- [ ] **LeadForm:**

```tsx
'use client';

import { useActionState } from 'react';
import { createLeadAction, type CreateLeadState } from '@/actions/leads';

const initialState: CreateLeadState = { status: 'idle' };

type Props = {
  source: string;
  floorType?: string;
  defaultMessage?: string;
};

const FLOOR_TYPES = [
  { value: '', label: 'Kies type' },
  { value: 'pvc', label: 'PVC' },
  { value: 'parket', label: 'Parket' },
  { value: 'multiplanken', label: 'Multiplanken' },
  { value: 'laminaat', label: 'Laminaat' },
  { value: 'traprenovatie', label: 'Traprenovatie' },
  { value: 'schuren', label: 'Schuren / onderhoud' },
  { value: 'anders', label: 'Anders / weet ik nog niet' },
];

export function LeadForm({ source, floorType = '', defaultMessage = '' }: Props) {
  const [state, formAction, pending] = useActionState(createLeadAction, initialState);

  if (state.status === 'success') {
    return (
      <div className="rounded-xl bg-green-50 border border-green-200 p-6 text-sm text-green-900">
        <p className="font-medium">Bedankt voor je aanvraag!</p>
        <p className="mt-1">We nemen binnen 24 uur contact op. Spoed? Bel direct.</p>
      </div>
    );
  }

  return (
    <form action={formAction} className="space-y-3">
      <input type="text" name="website" tabIndex={-1} autoComplete="off"
        className="absolute opacity-0 -left-[9999px] h-0 w-0" aria-hidden="true" />

      <input type="hidden" name="source" value={source} />

      <label className="block">
        <span className="text-sm font-medium">Naam</span>
        <input type="text" name="name" required autoComplete="name"
          className="mt-1 w-full rounded-lg border border-black/10 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-brand-primary)]" />
      </label>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <label className="block">
          <span className="text-sm font-medium">Email</span>
          <input type="email" name="email" required autoComplete="email"
            className="mt-1 w-full rounded-lg border border-black/10 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-brand-primary)]" />
        </label>
        <label className="block">
          <span className="text-sm font-medium">Telefoon</span>
          <input type="tel" name="phone" required autoComplete="tel"
            className="mt-1 w-full rounded-lg border border-black/10 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-brand-primary)]" />
        </label>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <label className="block">
          <span className="text-sm font-medium">Type vloer</span>
          <select name="floor_type" defaultValue={floorType}
            className="mt-1 w-full rounded-lg border border-black/10 px-3 py-2 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-[var(--color-brand-primary)]">
            {FLOOR_TYPES.map((t) => (
              <option key={t.value} value={t.value}>{t.label}</option>
            ))}
          </select>
        </label>
        <label className="block">
          <span className="text-sm font-medium">Oppervlak (m²)</span>
          <input type="number" name="area_size" min={0}
            className="mt-1 w-full rounded-lg border border-black/10 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-brand-primary)]" />
        </label>
      </div>

      <label className="block">
        <span className="text-sm font-medium">Bericht</span>
        <textarea name="message" rows={3} defaultValue={defaultMessage}
          className="mt-1 w-full rounded-lg border border-black/10 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-brand-primary)]" />
      </label>

      {state.status === 'error' && (
        <p role="alert" className="text-sm text-red-700">{state.message}</p>
      )}

      <button type="submit" disabled={pending}
        className="w-full rounded-lg bg-[var(--color-brand-primary)] px-4 py-2.5 text-sm font-medium text-white disabled:opacity-50">
        {pending ? 'Versturen…' : 'Verstuur aanvraag'}
      </button>
    </form>
  );
}
```

- [ ] **Quote page:**

```tsx
import type { Metadata } from 'next';
import { Container } from '@/components/ui/Container';
import { LeadForm } from '@/components/forms/LeadForm';

export const metadata: Metadata = {
  title: 'Offerte aanvragen',
  description: 'Vraag vrijblijvend een offerte aan. Reactie binnen 24 uur.',
};

export default function QuotePage() {
  return (
    <Container size="narrow" className="py-12 md:py-16">
      <h1 className="heading-display text-3xl md:text-4xl">Offerte aanvragen</h1>
      <p className="mt-3 text-black/70">
        Vrijblijvend en op maat. Reactie binnen 24 uur.
      </p>
      <div className="mt-8 rounded-2xl bg-white p-6 lg:p-8 shadow-sm">
        <LeadForm source="quote-form" />
      </div>
    </Container>
  );
}
```

Verify + commit:
```bash
npm run typecheck && npm run build && \
git add components/forms app/\(public\)/offerte && \
git commit -m "feat(forms): LeadForm and Quote page"
```

---

## Phase 3: Email + Chatbot

### Task 19: Resend client wrapper

**Files:** `lib/resend.ts`

```bash
npm install resend @react-email/components @react-email/render
```

`lib/resend.ts`:

```ts
import 'server-only';
import { Resend } from 'resend';
import { env } from '@/lib/env';
import { companyConfig } from '@/lib/company';

export const resend = env.RESEND_API_KEY ? new Resend(env.RESEND_API_KEY) : null;

const FROM = `BPM Parket <noreply@bpmparket.nl>`;
export const ADMIN_EMAIL = companyConfig.contact.email;

export async function sendEmail(input: {
  to: string;
  subject: string;
  html: string;
  text?: string;
  replyTo?: string;
}): Promise<void> {
  if (!resend) {
    console.warn('[email] RESEND_API_KEY missing — would have sent:',
      `to=${input.to} subject="${input.subject}"`);
    return;
  }
  const result = await resend.emails.send({
    from: FROM,
    to: input.to,
    subject: input.subject,
    html: input.html,
    text: input.text,
    replyTo: input.replyTo,
  });
  if (result.error) {
    console.error('[email] Resend error:', result.error);
    throw new Error(`Failed to send email: ${result.error.message}`);
  }
}
```

Commit: `git add lib/resend.ts package.json package-lock.json && git commit -m "feat(email): Resend client wrapper with dev fallback"`

---

### Task 20: EmailLayout (React Email)

**File:** `components/emails/layout/EmailLayout.tsx`

```tsx
import { Html, Head, Body, Container, Section, Text, Link, Hr } from '@react-email/components';
import type { ReactNode } from 'react';
import { companyConfig } from '@/lib/company';

const main = {
  backgroundColor: '#faf7f2',
  fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
  color: '#1f1f1f',
};

const container = {
  backgroundColor: '#ffffff',
  margin: '24px auto',
  padding: '32px',
  maxWidth: '560px',
  borderRadius: '12px',
};

const headerBrand = { fontSize: '20px', fontWeight: 600, color: '#1f1f1f' };
const footer = { fontSize: '12px', color: '#888', marginTop: '24px' };

export function EmailLayout({ preview: _preview, children }: { preview?: string; children: ReactNode }) {
  return (
    <Html>
      <Head />
      <Body style={main}>
        <Container style={container}>
          <Section><Text style={headerBrand}>{companyConfig.name}</Text></Section>
          <Hr style={{ borderColor: '#eee' }} />
          {children}
          <Hr style={{ borderColor: '#eee', marginTop: '24px' }} />
          <Section style={footer}>
            <Text>{companyConfig.legalName} · {companyConfig.contact.address}, {companyConfig.contact.zipCity}</Text>
            <Text>
              <Link href={`tel:${companyConfig.contact.phone.replace(/\s/g, '')}`}>{companyConfig.contact.phone}</Link>{' · '}
              <Link href={`mailto:${companyConfig.contact.email}`}>{companyConfig.contact.email}</Link>
            </Text>
          </Section>
        </Container>
      </Body>
    </Html>
  );
}

export { Section, Text, Link };
```

Commit: `git add components/emails/layout && git commit -m "feat(email): EmailLayout component"`

---

### Task 21: Transactional email templates (4)

**Files:** 4 templates in `components/emails/transactional/`

- [ ] **LeadConfirmation.tsx (to visitor):**

```tsx
import { EmailLayout, Section, Text } from '@/components/emails/layout/EmailLayout';

export function LeadConfirmation({ name }: { name: string }) {
  return (
    <EmailLayout preview="We hebben je aanvraag ontvangen">
      <Section>
        <Text style={{ fontSize: '18px', fontWeight: 600 }}>
          Bedankt voor je aanvraag, {name}!
        </Text>
        <Text>We hebben je bericht ontvangen en nemen binnen 24 uur contact op.</Text>
        <Text>Heb je in de tussentijd vragen? Bel ons gerust.</Text>
      </Section>
    </EmailLayout>
  );
}
```

- [ ] **AdminLeadNotification.tsx (to Bodhi):**

```tsx
import { EmailLayout, Section, Text, Link } from '@/components/emails/layout/EmailLayout';

type Props = {
  name: string; email: string; phone: string;
  floorType?: string; areaSize?: number; message?: string; source: string;
};

export function AdminLeadNotification(p: Props) {
  return (
    <EmailLayout preview={`Nieuwe lead via ${p.source}`}>
      <Section>
        <Text style={{ fontSize: '18px', fontWeight: 600 }}>Nieuwe lead binnen</Text>
        <Text>Source: {p.source}</Text>
        <Text>
          <strong>Naam:</strong> {p.name}<br />
          <strong>Email:</strong> <Link href={`mailto:${p.email}`}>{p.email}</Link><br />
          <strong>Telefoon:</strong> <Link href={`tel:${p.phone.replace(/\s/g, '')}`}>{p.phone}</Link><br />
          {p.floorType && <><strong>Type vloer:</strong> {p.floorType}<br /></>}
          {p.areaSize && <><strong>Oppervlak:</strong> {p.areaSize} m²<br /></>}
        </Text>
        {p.message && (
          <>
            <Text style={{ fontWeight: 600, marginTop: '16px' }}>Bericht:</Text>
            <Text>{p.message}</Text>
          </>
        )}
      </Section>
    </EmailLayout>
  );
}
```

- [ ] **AppointmentConfirmation.tsx:**

```tsx
import { EmailLayout, Section, Text } from '@/components/emails/layout/EmailLayout';
import { companyConfig } from '@/lib/company';

export function AppointmentConfirmation({ name, date }: { name: string; date: string }) {
  const formatted = new Date(date).toLocaleString('nl-NL', {
    weekday: 'long', day: 'numeric', month: 'long', year: 'numeric',
    hour: '2-digit', minute: '2-digit',
  });

  return (
    <EmailLayout preview="Showroomafspraak bevestigd">
      <Section>
        <Text style={{ fontSize: '18px', fontWeight: 600 }}>
          Tot ziens in onze showroom, {name}!
        </Text>
        <Text>Je afspraak staat ingepland voor:</Text>
        <Text style={{ fontSize: '16px', fontWeight: 600 }}>{formatted}</Text>
        <Text>Adres: {companyConfig.contact.address}, {companyConfig.contact.zipCity}</Text>
        <Text>Tussendoor verandert? Bel ons even op {companyConfig.contact.phone}.</Text>
      </Section>
    </EmailLayout>
  );
}
```

- [ ] **AdminAppointmentNotification.tsx:**

```tsx
import { EmailLayout, Section, Text, Link } from '@/components/emails/layout/EmailLayout';

type Props = {
  name: string; email: string; date: string;
  notes?: string; source: 'chatbot' | 'website' | 'manual';
};

export function AdminAppointmentNotification(p: Props) {
  const formatted = new Date(p.date).toLocaleString('nl-NL', {
    weekday: 'long', day: 'numeric', month: 'long', year: 'numeric',
    hour: '2-digit', minute: '2-digit',
  });

  return (
    <EmailLayout preview={`Nieuwe afspraak via ${p.source}`}>
      <Section>
        <Text style={{ fontSize: '18px', fontWeight: 600 }}>Nieuwe afspraak</Text>
        <Text>Geboekt via: {p.source}</Text>
        <Text>
          <strong>Naam:</strong> {p.name}<br />
          <strong>Email:</strong> <Link href={`mailto:${p.email}`}>{p.email}</Link><br />
          <strong>Datum:</strong> {formatted}<br />
        </Text>
        {p.notes && (
          <>
            <Text style={{ fontWeight: 600, marginTop: '16px' }}>Notities:</Text>
            <Text>{p.notes}</Text>
          </>
        )}
      </Section>
    </EmailLayout>
  );
}
```

Commit: `git add components/emails/transactional && git commit -m "feat(email): 4 transactional templates"`

---

### Task 22: Auth email templates (2)

**Files:** `components/emails/auth/PasswordReset.tsx`, `components/emails/auth/EmailChangeConfirm.tsx`

- [ ] **PasswordReset.tsx:**

```tsx
import { EmailLayout, Section, Text, Link } from '@/components/emails/layout/EmailLayout';

export function PasswordReset({ resetUrl }: { resetUrl: string }) {
  return (
    <EmailLayout preview="Reset je BPM Parket admin wachtwoord">
      <Section>
        <Text style={{ fontSize: '18px', fontWeight: 600 }}>Wachtwoord opnieuw instellen</Text>
        <Text>Klik op de link hieronder om een nieuw wachtwoord in te stellen. De link is 1 uur geldig.</Text>
        <Text style={{ marginTop: '16px' }}>
          <Link href={resetUrl} style={{
            backgroundColor: '#7d4f2d', color: '#fff', padding: '12px 20px',
            borderRadius: '6px', textDecoration: 'none', display: 'inline-block',
          }}>
            Wachtwoord opnieuw instellen
          </Link>
        </Text>
        <Text style={{ marginTop: '16px', fontSize: '12px', color: '#888' }}>
          Heb je hier geen reset voor aangevraagd? Negeer dan deze mail.
        </Text>
      </Section>
    </EmailLayout>
  );
}
```

- [ ] **EmailChangeConfirm.tsx:**

```tsx
import { EmailLayout, Section, Text, Link } from '@/components/emails/layout/EmailLayout';

export function EmailChangeConfirm({ confirmUrl }: { confirmUrl: string }) {
  return (
    <EmailLayout preview="Bevestig je nieuwe emailadres">
      <Section>
        <Text style={{ fontSize: '18px', fontWeight: 600 }}>Bevestig je nieuwe emailadres</Text>
        <Text>Klik op de link om je nieuwe email te bevestigen.</Text>
        <Text style={{ marginTop: '16px' }}>
          <Link href={confirmUrl} style={{
            backgroundColor: '#7d4f2d', color: '#fff', padding: '12px 20px',
            borderRadius: '6px', textDecoration: 'none', display: 'inline-block',
          }}>
            Email bevestigen
          </Link>
        </Text>
      </Section>
    </EmailLayout>
  );
}
```

Commit: `git add components/emails/auth && git commit -m "feat(email): auth email templates"`

---

### Task 23: Wire emails into createLeadAction

**File:** `actions/leads.ts` (modify)

Add at top of file:
```ts
import { render } from '@react-email/render';
import { sendEmail, ADMIN_EMAIL } from '@/lib/resend';
import { LeadConfirmation } from '@/components/emails/transactional/LeadConfirmation';
import { AdminLeadNotification } from '@/components/emails/transactional/AdminLeadNotification';
```

In the `try` block, after `await insertLead(...)` and before `revalidatePath('/admin/leads')`, add:

```ts
    await Promise.all([
      sendEmail({
        to: parsed.data.email,
        subject: 'We hebben je aanvraag ontvangen — BPM Parket',
        html: await render(LeadConfirmation({ name: parsed.data.name })),
      }).catch((e) => console.error('Lead confirmation email failed:', e)),
      sendEmail({
        to: ADMIN_EMAIL,
        replyTo: parsed.data.email,
        subject: `Nieuwe lead: ${parsed.data.name} (${parsed.data.source})`,
        html: await render(AdminLeadNotification({
          name: parsed.data.name,
          email: parsed.data.email,
          phone: parsed.data.phone,
          floorType: parsed.data.floor_type,
          areaSize: parsed.data.area_size,
          message: parsed.data.message,
          source: parsed.data.source,
        })),
      }).catch((e) => console.error('Admin notification email failed:', e)),
    ]);
```

Verify + commit:
```bash
npm run typecheck && npm run build && \
git add actions/leads.ts && \
git commit -m "feat(forms): wire LeadConfirmation and AdminLeadNotification emails"
```

---

### Task 24: Supabase Auth Email Hook route

**Files:** `app/api/auth/email-hook/route.ts`, modify `lib/env.ts`

- [ ] **Step 1: Add hook secret to env**

In `lib/env.ts`, add to schema:
```ts
  SUPABASE_AUTH_EMAIL_HOOK_SECRET: z.preprocess(
    (v) => (v === '' ? undefined : v),
    z.string().min(20).optional(),
  ),
```

- [ ] **Step 2: Install standardwebhooks**

```bash
npm install standardwebhooks
```

- [ ] **Step 3: Write route handler**

```ts
import { NextResponse, type NextRequest } from 'next/server';
import { Webhook } from 'standardwebhooks';
import { render } from '@react-email/render';
import { env } from '@/lib/env';
import { sendEmail } from '@/lib/resend';
import { PasswordReset } from '@/components/emails/auth/PasswordReset';
import { EmailChangeConfirm } from '@/components/emails/auth/EmailChangeConfirm';

type EmailType =
  | 'signup' | 'recovery' | 'invite'
  | 'magiclink' | 'email_change' | 'email_change_current';

type Payload = {
  user: { email: string };
  email_data: {
    token: string;
    token_hash: string;
    redirect_to: string;
    email_action_type: EmailType;
    site_url: string;
  };
};

export async function POST(req: NextRequest) {
  const secret = env.SUPABASE_AUTH_EMAIL_HOOK_SECRET;
  if (!secret) {
    return NextResponse.json({ error: 'Email hook not configured' }, { status: 500 });
  }

  const headers = Object.fromEntries(req.headers.entries());
  const body = await req.text();

  let payload: Payload;
  try {
    const wh = new Webhook(Buffer.from(secret, 'base64').toString('utf-8'));
    payload = wh.verify(body, headers) as Payload;
  } catch (e) {
    console.error('Email hook signature verification failed:', e);
    return NextResponse.json({ error: 'Invalid signature' }, { status: 401 });
  }

  const { user, email_data } = payload;
  const actionUrl = `${email_data.site_url}/auth/v1/verify?token=${email_data.token_hash}&type=${email_data.email_action_type}&redirect_to=${email_data.redirect_to}`;

  let subject: string;
  let html: string;

  switch (email_data.email_action_type) {
    case 'recovery':
      subject = 'Reset je BPM Parket admin wachtwoord';
      html = await render(PasswordReset({ resetUrl: actionUrl }));
      break;
    case 'email_change':
    case 'email_change_current':
      subject = 'Bevestig je nieuwe emailadres';
      html = await render(EmailChangeConfirm({ confirmUrl: actionUrl }));
      break;
    default:
      console.warn('Unhandled auth email type:', email_data.email_action_type);
      return NextResponse.json({ ok: true });
  }

  try {
    await sendEmail({ to: user.email, subject, html });
    return NextResponse.json({ ok: true });
  } catch (e) {
    console.error('Failed to send auth email:', e);
    return NextResponse.json({ error: 'Email send failed' }, { status: 500 });
  }
}
```

Verify + commit:
```bash
npm run typecheck && npm run build && \
git add app/api/auth/email-hook lib/env.ts package.json package-lock.json && \
git commit -m "feat(auth): Supabase Auth email hook with React Email templates"
```

**Configuration handoff** (cannot be automated):
1. Supabase dashboard → Authentication → Hooks → Send Email Hook → Enable
2. URL: `https://bpmparket.nl/api/auth/email-hook`
3. Generate signing secret, add as `SUPABASE_AUTH_EMAIL_HOOK_SECRET`
4. Authentication → Email Templates → disable built-ins after hook verified working

---

### Task 25: Chatbot route handler

**Files:**
- `lib/validation/chat.ts`
- `app/api/chat/route.ts`

- [ ] **Step 1: Validation schema**

```ts
import { z } from 'zod';

export const chatHistorySchema = z.array(
  z.object({
    role: z.enum(['user', 'assistant']),
    text: z.string().max(4000),
  }),
).max(50);

export const chatRequestSchema = z.object({
  history: chatHistorySchema,
  message: z.string().min(1).max(1000),
  sessionId: z.string().uuid(),
});
```

- [ ] **Step 2: Install Anthropic SDK**

```bash
npm install @anthropic-ai/sdk
```

- [ ] **Step 3: Route handler**

```ts
import { NextResponse, type NextRequest } from 'next/server';
import { headers } from 'next/headers';
import { render } from '@react-email/render';
import Anthropic from '@anthropic-ai/sdk';
import { env } from '@/lib/env';
import { chatRequestSchema } from '@/lib/validation/chat';
import { rateLimit } from '@/lib/rate-limit';
import { hashIdentifier } from '@/lib/hash';
import { getKnowledge } from '@/lib/db/knowledge';
import { insertAppointment, countAppointmentsForDate } from '@/lib/db/appointments';
import { sendEmail, ADMIN_EMAIL } from '@/lib/resend';
import { AppointmentConfirmation } from '@/components/emails/transactional/AppointmentConfirmation';
import { AdminAppointmentNotification } from '@/components/emails/transactional/AdminAppointmentNotification';
import { companyConfig } from '@/lib/company';

const MODEL = 'claude-haiku-4-5-20251001';
const MAX_LOOP_ITERATIONS = 5;

const TOOLS: Anthropic.Tool[] = [
  {
    name: 'bookAppointment',
    description: 'Boek een showroomafspraak voor een bezoeker.',
    input_schema: {
      type: 'object',
      properties: {
        customerName: { type: 'string' },
        customerEmail: { type: 'string' },
        datetime: { type: 'string', description: 'ISO datetime' },
        notes: { type: 'string' },
      },
      required: ['customerName', 'customerEmail', 'datetime'],
    },
  },
  {
    name: 'checkAvailability',
    description: 'Controleer of er nog plek is op een specifieke datum.',
    input_schema: {
      type: 'object',
      properties: { date: { type: 'string', description: 'YYYY-MM-DD' } },
      required: ['date'],
    },
  },
];

export async function POST(req: NextRequest) {
  if (!env.ANTHROPIC_API_KEY) {
    return NextResponse.json({ error: 'Chatbot is currently disabled.' }, { status: 503 });
  }

  const headerStore = await headers();
  const ip = headerStore.get('x-forwarded-for')?.split(',')[0].trim() ?? 'unknown';

  const body = await req.json().catch(() => null);
  const parsed = chatRequestSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: 'Invalid request' }, { status: 400 });
  }
  const { history, message, sessionId } = parsed.data;

  const rl = await rateLimit(`chat:${ip}:${sessionId}`, 30, 10 * 60);
  if (!rl.allowed) {
    return NextResponse.json({
      error: 'Even rustig — je hebt veel berichten gestuurd. Probeer over een paar minuten opnieuw.',
    }, { status: 429 });
  }

  const knowledge = await getKnowledge();
  const knowledgeText = knowledge.map((k) => `[${k.topic}]: ${k.content}`).join('\n');

  const phone = companyConfig.contact.phone;
  const address = `${companyConfig.contact.address}, ${companyConfig.contact.zipCity}`;
  const today = new Date().toLocaleDateString('nl-NL', {
    weekday: 'long', year: 'numeric', month: 'long', day: 'numeric',
  });

  const systemPrompt = `Je bent een vriendelijke, korte assistent van BPM Parket. Je HOOFDDOEL is om bezoekers naar onze SHOWROOM in Geldrop te krijgen (${address}). Bellen naar ${phone} is een goede tweede optie.

COMMUNICATIESTIJL:
- Informeel Nederlands (je/jij), warm en persoonlijk.
- KORT: maximaal 2-3 zinnen per antwoord. Nooit lange opsommingen.
- Stel maximaal één vraag per bericht.
- Gebruik NOOIT emoji's.

WAT JE BEANTWOORDT:
- Locatie: ${address}.
- Diensten: traditioneel parket (band en bies), multiplanken, PVC, laminaat, traprenovatie, schuren en onderhoud.
- Heel simpele ja/nee vragen.
- Showroomafspraak inplannen via tools.

WAT JE DOORVERWIJST:
- Prijsvragen → "Voor een eerlijke prijsindicatie laten we je graag de vloeren in het echt zien. Zal ik een afspraak inplannen?"
- Technisch advies → "Onze vakmensen leggen het je het beste persoonlijk uit. Zal ik een afspraak inplannen?"
- Klachten → "Bel even ${phone}, dan zoeken we samen een oplossing."

AFSPRAAK INPLANNEN:
1. Vraag naam.
2. Vraag datum & tijd. Gebruik ALTIJD eerst checkAvailability.
3. Vraag emailadres.
4. Optioneel notities.
5. Bevestig en gebruik bookAppointment.

Geef NOOIT prijzen. Verzin geen feiten buiten de kennisbank.

Datum vandaag: ${today}.

KENNISBANK:
${knowledgeText}`;

  const client = new Anthropic({ apiKey: env.ANTHROPIC_API_KEY });

  const messages: Anthropic.MessageParam[] = [
    ...history.map((h) => ({
      role: h.role === 'assistant' ? ('assistant' as const) : ('user' as const),
      content: h.text,
    })),
    { role: 'user' as const, content: message },
  ];

  for (let i = 0; i < MAX_LOOP_ITERATIONS; i++) {
    const response = await client.messages.create({
      model: MODEL, max_tokens: 1024, system: systemPrompt, tools: TOOLS, messages,
    });

    if (response.stop_reason === 'end_turn' || response.stop_reason === 'max_tokens') {
      const text = response.content
        .filter((b): b is Anthropic.TextBlock => b.type === 'text')
        .map((b) => b.text).join('\n');
      return NextResponse.json({ text });
    }

    if (response.stop_reason === 'tool_use') {
      const toolUseBlocks = response.content.filter(
        (b): b is Anthropic.ToolUseBlock => b.type === 'tool_use',
      );
      messages.push({ role: 'assistant', content: response.content });
      const toolResults: Anthropic.ToolResultBlockParam[] = [];

      for (const tool of toolUseBlocks) {
        let result: string;
        if (tool.name === 'checkAvailability') {
          const input = tool.input as { date: string };
          const count = await countAppointmentsForDate(input.date);
          result = count > 3
            ? 'Helaas zit deze dag vol. Stel een andere dag voor.'
            : 'Deze dag is beschikbaar.';
        } else if (tool.name === 'bookAppointment') {
          const input = tool.input as {
            customerName: string; customerEmail: string;
            datetime: string; notes?: string;
          };
          await insertAppointment({
            customer_name: input.customerName,
            customer_email: input.customerEmail,
            date: input.datetime,
            notes: input.notes,
            source: 'chatbot',
            ip_hash: hashIdentifier(ip),
          });

          await Promise.all([
            sendEmail({
              to: input.customerEmail,
              subject: 'Showroomafspraak bevestigd — BPM Parket',
              html: await render(AppointmentConfirmation({ name: input.customerName, date: input.datetime })),
            }).catch((e) => console.error('Appointment confirmation email failed:', e)),
            sendEmail({
              to: ADMIN_EMAIL,
              replyTo: input.customerEmail,
              subject: `Nieuwe afspraak: ${input.customerName}`,
              html: await render(AdminAppointmentNotification({
                name: input.customerName,
                email: input.customerEmail,
                date: input.datetime,
                notes: input.notes,
                source: 'chatbot',
              })),
            }).catch((e) => console.error('Admin appointment notification failed:', e)),
          ]);
          result = `Afspraak geboekt voor ${input.datetime}. Bevestig dit aan de gebruiker.`;
        } else {
          result = 'Onbekende tool';
        }

        toolResults.push({
          type: 'tool_result', tool_use_id: tool.id, content: result,
        });
      }

      messages.push({ role: 'user', content: toolResults });
    } else {
      return NextResponse.json({
        text: 'Sorry, ik begreep dat niet helemaal. Probeer het anders te formuleren?',
      });
    }
  }

  return NextResponse.json({
    text: 'Ik heb wat moeite met deze vraag. Bel ons even op ' + phone + '.',
  });
}
```

Commit:
```bash
git add lib/validation/chat.ts app/api/chat package.json package-lock.json
git commit -m "feat(chatbot): server-side /api/chat with agent loop, tools, rate limit, emails"
```

---

### Task 26: Chatbot UI component + wire into public layout

**Files:**
- `components/chatbot/Chatbot.tsx`
- Modify: `app/(public)/layout.tsx`

- [ ] **Chatbot.tsx:**

```tsx
'use client';

import { useState, useEffect, useRef } from 'react';
import { MessageCircle, Send, X } from 'lucide-react';

type Msg = { role: 'user' | 'assistant'; text: string };

const SESSION_KEY = 'bpm_chat_session_v1';
const HISTORY_KEY = 'bpm_chat_history_v1';

function getSessionId(): string {
  if (typeof window === 'undefined') return crypto.randomUUID();
  const existing = localStorage.getItem(SESSION_KEY);
  if (existing) return existing;
  const id = crypto.randomUUID();
  localStorage.setItem(SESSION_KEY, id);
  return id;
}

export function Chatbot() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Msg[]>([]);
  const [input, setInput] = useState('');
  const [pending, setPending] = useState(false);
  const sessionId = useRef<string>('');
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    sessionId.current = getSessionId();
    const saved = localStorage.getItem(HISTORY_KEY);
    if (saved) {
      try { setMessages(JSON.parse(saved)); } catch {}
    } else {
      setMessages([{
        role: 'assistant',
        text: 'Hoi! Ik ben de assistent van BPM Parket. Vragen over PVC, parket of een showroomafspraak? Stel ze gerust.',
      }]);
    }
  }, []);

  useEffect(() => {
    if (messages.length > 0) {
      localStorage.setItem(HISTORY_KEY, JSON.stringify(messages));
    }
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight });
  }, [messages]);

  async function send() {
    const trimmed = input.trim();
    if (!trimmed || pending) return;

    const newHistory: Msg[] = [...messages, { role: 'user', text: trimmed }];
    setMessages(newHistory);
    setInput('');
    setPending(true);

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          history: messages, message: trimmed, sessionId: sessionId.current,
        }),
      });
      const data = (await res.json()) as { text?: string; error?: string };
      const reply = data.text ?? data.error ?? 'Sorry, er ging iets mis.';
      setMessages([...newHistory, { role: 'assistant', text: reply }]);
    } catch {
      setMessages([
        ...newHistory,
        { role: 'assistant', text: 'Geen verbinding. Probeer het over een minuutje opnieuw of bel ons.' },
      ]);
    } finally {
      setPending(false);
    }
  }

  return (
    <>
      <button onClick={() => setOpen((s) => !s)}
        aria-label={open ? 'Sluit chat' : 'Open chat'}
        className="fixed bottom-6 right-6 z-50 h-14 w-14 rounded-full bg-[var(--color-brand-primary)] text-white shadow-lg flex items-center justify-center hover:bg-[var(--color-brand-primary-dark)]">
        {open ? <X className="h-6 w-6" /> : <MessageCircle className="h-6 w-6" />}
      </button>

      {open && (
        <div className="fixed bottom-24 right-6 z-50 w-80 max-w-[calc(100vw-32px)] h-[28rem] rounded-2xl bg-white shadow-2xl border border-black/10 flex flex-col overflow-hidden">
          <div className="bg-[var(--color-brand-charcoal)] text-white px-4 py-3 text-sm font-medium">
            Vraag het de assistent
          </div>

          <div ref={scrollRef} className="flex-1 overflow-y-auto p-3 space-y-2">
            {messages.map((m, i) => (
              <div key={i} className={
                m.role === 'user'
                  ? 'text-sm bg-[var(--color-brand-primary)] text-white px-3 py-2 rounded-2xl rounded-br-sm ml-8'
                  : 'text-sm bg-black/5 px-3 py-2 rounded-2xl rounded-bl-sm mr-8'
              }>
                {m.text}
              </div>
            ))}
            {pending && <div className="text-xs text-black/50 italic px-3">aan het typen…</div>}
          </div>

          <form onSubmit={(e) => { e.preventDefault(); void send(); }}
            className="border-t border-black/5 p-2 flex gap-2">
            <input type="text" value={input} onChange={(e) => setInput(e.target.value)}
              placeholder="Stel je vraag…" disabled={pending}
              className="flex-1 rounded-full border border-black/10 px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-brand-primary)]" />
            <button type="submit" disabled={pending || !input.trim()}
              className="rounded-full bg-[var(--color-brand-primary)] text-white p-2 disabled:opacity-50"
              aria-label="Verstuur">
              <Send className="h-4 w-4" />
            </button>
          </form>
        </div>
      )}
    </>
  );
}
```

- [ ] **Wire into public layout:**

Edit `app/(public)/layout.tsx` — add `Chatbot` import and place between Footer and CookieBanner:

```tsx
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { AnnouncementBar } from '@/components/layout/AnnouncementBar';
import { CookieBanner } from '@/components/layout/CookieBanner';
import { Chatbot } from '@/components/chatbot/Chatbot';

export default function PublicLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <AnnouncementBar />
      <Navbar />
      <main>{children}</main>
      <Footer />
      <Chatbot />
      <CookieBanner />
    </>
  );
}
```

Verify + commit:
```bash
npm run typecheck && npm run build && \
git add components/chatbot app/\(public\)/layout.tsx && \
git commit -m "feat(chatbot): UI component wired into public layout"
```

---

### Task 27: E2E smoke tests

**Files:**
- `tests/e2e/lead-form.spec.ts`
- `tests/e2e/chatbot.spec.ts`

- [ ] **lead-form.spec.ts:**

```ts
import { test, expect } from '@playwright/test';

test.describe('lead form', () => {
  test('quote page renders form', async ({ page }) => {
    await page.goto('/offerte');
    await expect(page.getByRole('heading', { name: 'Offerte aanvragen' })).toBeVisible();
    await expect(page.getByLabel('Naam')).toBeVisible();
    await expect(page.getByLabel('Email')).toBeVisible();
    await expect(page.getByLabel('Telefoon')).toBeVisible();
  });

  test('shows validation error on missing fields', async ({ page }) => {
    await page.goto('/offerte');
    await page.getByLabel('Naam').fill('A');
    await page.getByLabel('Email').fill('not-an-email');
    await page.getByLabel('Telefoon').fill('123');
    await page.getByRole('button', { name: /Verstuur/ }).click();
    await expect(page.getByRole('alert')).toBeVisible();
  });
});
```

- [ ] **chatbot.spec.ts:**

```ts
import { test, expect } from '@playwright/test';

test.describe('chatbot', () => {
  test('opens and shows greeting', async ({ page }) => {
    await page.goto('/');
    await page.getByRole('button', { name: 'Open chat' }).click();
    await expect(page.getByText('assistent van BPM Parket')).toBeVisible();
  });

  test('sends a message and gets a response or rate-limit error', async ({ page }) => {
    test.skip(!process.env.ANTHROPIC_API_KEY, 'requires ANTHROPIC_API_KEY for live response');

    await page.goto('/');
    await page.getByRole('button', { name: 'Open chat' }).click();
    await page.getByPlaceholder('Stel je vraag…').fill('Wat zijn jullie openingstijden?');
    await page.getByRole('button', { name: 'Verstuur' }).click();
    await expect(
      page.locator('div').filter({ hasText: /openings|rustig|verbinding/i }).first(),
    ).toBeVisible({ timeout: 15_000 });
  });
});
```

Commit:
```bash
git add tests/e2e/lead-form.spec.ts tests/e2e/chatbot.spec.ts
git commit -m "test: smoke tests for lead form and chatbot"
```

---

### Task 28: README update + Plan 2 closeout

**File:** modify `README.md`

Replace the "Status" section:

```markdown
## Status

Migration in progress. See:
- [Design spec](docs/superpowers/specs/2026-05-02-vite-to-nextjs-migration-design.md)
- [Plan 1: Foundation](docs/superpowers/plans/2026-05-04-nextjs-migration-plan-1-foundation.md) — done
- [Plan 2: Public Site + Chatbot](docs/superpowers/plans/2026-05-04-nextjs-migration-plan-2-public-site-and-chatbot.md) — current
- Plan 3 (Admin) — pending
- Plan 4 (SEO + GDPR + Launch) — pending

## Required env vars (Plan 2)

In addition to Plan 1's Supabase env vars, Plan 2 requires:

- `ANTHROPIC_API_KEY` (chatbot — `sk-ant-...`)
- `RESEND_API_KEY` (email — `re_...`)
- `SUPABASE_AUTH_EMAIL_HOOK_SECRET` (auth email hook signing — base64 string from Supabase dashboard)
- `UPSTASH_REDIS_REST_URL` and `UPSTASH_REDIS_REST_TOKEN` (rate limiting — fallback to in-memory if missing in dev)
- `HASH_SALT` (random string for IP/UA hashing — `openssl rand -hex 32`)
```

Final verify + push:
```bash
npm run typecheck && npm run build && \
git add README.md && \
git commit -m "docs: README updated for Plan 2 env requirements" && \
git push
```

---

## Self-Review Notes

**Spec coverage:**
- ✅ Sectie 3 URLs — 17 public routes wired (T11-T18)
- ✅ Sectie 6 chatbot — server-side agent loop with rate limit (T25-26)
- ✅ Sectie 7 lead capture — honeypot, rate limit, Zod, emails (T17-18, T23)
- ✅ Sectie 8 Resend + React Email + auth hook (T19-T24)
- ⏭️ Sectie 9 image storage — bucket created in Plan 1; admin upload UI is Plan 3
- ⏭️ Sectie 10 SEO metadata + sitemap + JSON-LD — basic metadata done, sitemap/JSON-LD in Plan 4
- ⏭️ Sectie 11 Consent Mode v2 granular — stub here (T5), full in Plan 4
- ✅ Vibe-security — rate limiting, IP hashing, Zod, honeypot, server-only

**Placeholder scan:** No "TBD" / "TODO". All file content fully specified.

**Type consistency:**
- `LeadInput` derived from `leadSchema`, used in `createLeadAction`
- `Service`, `Project`, `Policy`, `KnowledgeItem` types live in `lib/db/*.ts`
- `CreateLeadState` matches between action and form
- Tool names (`bookAppointment`, `checkAvailability`) match between system prompt, TOOLS array, and route handler switch
- Email template props match between callers and component definitions

**Open handoff items (require user / Supabase consolidation):**
- Add Plan 2 env vars to `.env.local` and Vercel
- Create Resend account; verify `bpmparket.nl` domain via DNS
- Create Upstash Redis instance (free tier)
- Configure Supabase Auth Email Hook (URL + signing secret)
- Disable Supabase built-in auth email templates after hook is verified
