# Vite → Next.js Migration — Design Spec

**Date:** 2026-05-02
**Status:** Approved, ready for implementation planning
**Owner:** Martijn (dev), Bodhi van Baar (klant)

## 1. Goal & Constraints

Migreer de bestaande Vite + React 19 SPA naar **Next.js 15+ (App Router)** met als drie samenhangende doelen:

1. **SEO** — server-rendered HTML, per-pagina metadata, structured data, sitemap, optimale Core Web Vitals
2. **Echte backend** — Supabase Postgres + Auth + Storage met Row-Level Security als bron van waarheid
3. **Security** — geen secrets client-side, server-side chatbot proxy, rate limiting, defense-in-depth auth

`vibe-security` is een first-class concern, niet een laatste-checkbox. Per migratie-fase verifiëren tegen de checklist (sectie 12).

### Migratie strategie

**Feature branch `next-migration`** in dezelfde repo. Vite-versie blijft live op master tot de migratie klaar is. Bij merge naar main wordt Vercel-deploy automatisch geüpgraded.

### Scope (M1 / M2 / DROP)

| Blok | Status |
|---|---|
| Public site (Home, alle service pages, Showroom, Over Ons, Contact, Policy, Ad landing) | M1 |
| Chatbot (server-side proxy, agent-loop, rate limited) | M1 |
| Lead capture (Quote/Contact → Supabase + Resend) | M1 |
| Auth (Supabase Auth, email + wachtwoord, Bodhi als enige user) | M1 |
| Admin: leads, afspraken, kennisbank | M1 |
| Admin: projecten + gallery beheer met image upload | M1 |
| Email transactional + auth via Resend + React Email | M1 |
| Cookie consent (granulair, Consent Mode v2) | M1 |
| SEO (metadata, sitemap, structured data, next/image) | M1 |
| Klantenadministratie (customers tabel + UI) | M2 |
| Invoicing / offerte generator | DROPPED |

## 2. Architectuur Overzicht

```
┌─ Frontend ─────────────────────────────────┐
│ Next.js 15+ App Router (React 19)          │
│ Tailwind CSS v4                            │
│ React Server Components by default         │
│ Client Components alleen waar nodig        │
└────────────────────────────────────────────┘
              │
              ├─ Server Actions (form mutations)
              ├─ Route Handlers (/api/chat, /api/auth/email-hook)
              │
┌─ Backend ──────────────────────────────────┐
│ Supabase Postgres   (data, RLS-protected)  │
│ Supabase Auth       (admin login)          │
│ Supabase Storage    (foto's, RLS-protected)│
└────────────────────────────────────────────┘
              │
              ├─ Resend + React Email (transactional + auth)
              ├─ Anthropic API (chatbot, server-side)
              ├─ Upstash Redis (rate limiting)
              └─ GA4 + Google Ads gtag (Consent Mode v2)
```

### Kernprincipes

1. **Server-first** — data fetching, secrets en mutations gebeuren server-side
2. **RLS als bron van waarheid** — elke tabel heeft een policy
3. **Geen secrets in de bundle** — server-only env vars zonder `NEXT_PUBLIC_` prefix
4. **Progressive enhancement** — formulieren via Server Actions

### Folder structuur

```
app/
  (public)/                  # publieke pagina's, layout met navbar/footer
    page.tsx                 # /
    pvc-vloeren/page.tsx
    traditioneel-parket/page.tsx
    multiplanken/page.tsx
    laminaat/page.tsx
    traprenovatie/page.tsx
    schuren-onderhoud/page.tsx
    projecten/page.tsx
    projecten/[slug]/page.tsx
    showroom/page.tsx
    over-ons/page.tsx
    contact/page.tsx
    offerte/page.tsx
    privacy/page.tsx
    algemene-voorwaarden/page.tsx
    cookies/page.tsx
    pvc-laten-leggen/page.tsx     # ad landing, eigen layout
  (admin)/
    layout.tsx               # auth gate, sidebar
    admin/
      page.tsx               # /admin (dashboard)
      leads/page.tsx
      afspraken/page.tsx
      kennisbank/page.tsx
      projecten/page.tsx
      gallery/page.tsx
      instellingen/page.tsx
    login/page.tsx
    wachtwoord-reset/page.tsx
  api/
    chat/route.ts            # chatbot proxy
    auth/email-hook/route.ts # Supabase Auth email hook
  sitemap.ts
  robots.ts
components/
  ui/                        # generieke UI (Button, Input, etc.)
  marketing/                 # public-site (Hero, USPs, Testimonials)
  admin/                     # admin-specifiek
  emails/                    # React Email templates
lib/
  supabase/
    server.ts
    client.ts
    middleware.ts
  auth.ts
  validation/                # Zod schemas
  consent.ts                 # GDPR consent state + Consent Mode v2 helpers
  rate-limit.ts              # Upstash wrapper
middleware.ts
```

## 3. Routing & URL Structuur (flat, SEO-first)

| Route | Doel |
|---|---|
| `/` | Home — Hero, USPs, services preview, projects preview, reviews, CTA |
| `/pvc-vloeren` | Service page (geld-zoekwoord) |
| `/traditioneel-parket` | Service page |
| `/multiplanken` | Service page |
| `/laminaat` | Service page |
| `/traprenovatie` | Service page |
| `/schuren-onderhoud` | Service page |
| `/projecten` | Project listing |
| `/projecten/[slug]` | Project detail |
| `/showroom` | Showroom info + afspraakformulier |
| `/over-ons` | About |
| `/contact` | Contact + form |
| `/offerte` | Quote form |
| `/pvc-laten-leggen` | Ad landing (eigen layout, geen navbar — vervangt huidige `/landing-pvc`) |
| `/privacy`, `/algemene-voorwaarden`, `/cookies` | Policy pages, content uit Supabase |
| `/login`, `/wachtwoord-reset` | Admin auth |
| `/admin/*` | Admin paneel (beschermd) |
| `/sitemap.xml`, `/robots.txt` | SEO infrastructuur |

## 4. Data Model & RLS

### Tabellen (Supabase Postgres)

```sql
-- Public-readable, admin-managed
projects (
  id uuid pk,
  slug text unique,
  title text not null,
  description text,
  long_description text,
  image_url text,
  gallery_image_urls text[],
  area_size int,
  location text,
  completed_date date,
  techniques text[],
  floor_type text,
  is_featured bool default false,
  sort_order int,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

gallery (
  id uuid pk,
  image_url text not null,
  caption text,
  sort_order int,
  created_at timestamptz default now()
);

knowledge (
  id uuid pk,
  topic text not null,
  content text not null,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

policies (
  id uuid pk,
  slug text unique,                 -- 'privacy', 'cookies', 'algemene-voorwaarden'
  title text not null,
  content_md text not null,
  last_updated timestamptz default now()
);

services (
  id uuid pk,
  slug text unique,                 -- 'pvc-vloeren', 'traditioneel-parket', etc.
  title text not null,
  hero_image text,
  body_md text,
  meta_title text,
  meta_description text,
  sort_order int
);

-- Public-writable (rate-limited via app, hardened via RLS)
leads (
  id uuid pk,
  name text not null,
  email text not null,
  phone text not null,
  floor_type text,
  area_size int,
  message text,
  source text,                      -- 'quote-form', 'contact-form', 'landing-pvc'
  status text default 'new'         -- 'new' | 'contacted' | 'completed'
    check (status in ('new','contacted','completed')),
  ip_hash text,
  user_agent_hash text,
  created_at timestamptz default now()
);

appointments (
  id uuid pk,
  customer_name text not null,
  customer_email text not null,
  customer_phone text,
  date timestamptz not null,
  notes text,
  source text                       -- 'chatbot' | 'website' | 'manual'
    check (source in ('chatbot','website','manual')),
  status text default 'pending',    -- 'pending' | 'confirmed' | 'cancelled'
  ip_hash text,
  created_at timestamptz default now()
);

-- Admin-only
admin_settings (
  id int primary key default 1,
  chatbot_enabled bool default true,
  system_prompt_extra text,
  -- contactgegevens optioneel als override
  phone text,
  whatsapp text,
  ...
  check (id = 1)                    -- single-row enforcement
);
```

### RLS policies

```sql
-- Public-read tabellen
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public read projects"
  ON projects FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY "Authenticated write projects"
  ON projects FOR ALL TO authenticated USING (true) WITH CHECK (true);

-- Idem voor gallery, services, policies, knowledge

-- Public-write tabellen (alleen INSERT)
ALTER TABLE leads ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public can submit leads"
  ON leads FOR INSERT TO anon WITH CHECK (true);
CREATE POLICY "Authenticated can read/manage leads"
  ON leads FOR SELECT, UPDATE, DELETE TO authenticated USING (true);

-- Idem voor appointments

-- Admin-only
ALTER TABLE admin_settings ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Admin only"
  ON admin_settings FOR ALL TO authenticated USING (true) WITH CHECK (true);
```

**Belangrijk:** `service_role` key wordt **alleen** in server actions/route handlers gebruikt voor admin-bypass operaties. Nooit naar de client.

## 5. Auth

### Flow (email + wachtwoord, Bodhi enige user)

```
1. /login → email + wachtwoord form → server action
2. supabase.auth.signInWithPassword() → HTTP-only secure session cookie
3. middleware.ts ververst cookie bij elke request, redirect naar /login
   bij /admin/* zonder geldige sessie
4. Logout → supabase.auth.signOut() → cookie cleared
5. Wachtwoord reset → email met reset link via Supabase Auth Email Hook
```

### Bescherming `/admin/*` (defense-in-depth)

1. **`middleware.ts`** — session check + redirect bij elke admin route
2. **`(admin)/layout.tsx`** — 2e check via `supabase.auth.getUser()` server-side
3. **Server actions** — 3e check via `assertAdmin()` helper vóór mutaties

### Initial seed

Migration script maakt Bodhi aan via Supabase admin API. Geen public `/signup` endpoint.

## 6. Chatbot (server-side proxy + agent-loop)

```
[Browser]                          [Server: /api/chat]              [External]
│                                  │                                │
├─ POST /api/chat                  │                                │
│   { history, message, sessionId }│                                │
│                                  │                                │
│                                  ├─ Rate limit ──→ Upstash Redis  │
│                                  │   (30 msg / 10 min / IP+session)
│                                  ├─ Validate (Zod)                │
│                                  ├─ Fetch knowledge + settings ─→ Supabase
│                                  │                                │
│                                  ├─ Loop:                         │
│                                  │   1. Anthropic call ──→ api.anthropic.com
│                                  │   2. tool_use? execute server-side
│                                  │   3. Loop tot stop_reason='end_turn'
│                                  │                                │
│ ←── Final assistant text ────────┤                                │
```

### Tools (server-side)

```ts
bookAppointment({ customerName, customerEmail, datetime, notes })
  → INSERT appointments
  → Resend: AppointmentConfirmation naar bezoeker
  → Resend: AdminAppointmentNotification naar Bodhi

checkAvailability({ date })
  → COUNT appointments op die dag, return beschikbaar/vol
```

### Security

- `ANTHROPIC_API_KEY` server-only, geen `NEXT_PUBLIC_`
- Rate limit headers terug naar client voor graceful UI
- `sessionId` is random uuid in localStorage (geen PII)
- IP gehashed opgeslagen (audit, GDPR-vriendelijk)
- Alle tool inputs Zod-gevalideerd

## 7. Lead capture & Forms

```
[Form] → Server Action → Zod validate → Supabase INSERT leads
                                    └→ Resend: LeadConfirmation (bezoeker)
                                    └→ Resend: AdminLeadNotification (Bodhi)
                                    └→ revalidatePath('/admin/leads')
```

### Spam protection

- Hidden honeypot field (vangt ~80%)
- Cloudflare Turnstile (gratis, GDPR-vriendelijk)
- Server-side rate limit: 5 submissions/uur per IP

## 8. Email infrastructuur (Resend + React Email)

**Alle emails** (transactional + auth) via React Email templates en Resend SMTP.

### Setup

1. Resend account, domain verification voor `bpmparket.nl` (DNS records)
2. Supabase Auth's eigen email versturen UIT
3. Supabase Auth Email Hook geregistreerd op `/api/auth/email-hook` (HMAC-verified)
4. Hook handler rendert juiste React Email template, stuurt via Resend

### Templates

```
components/emails/
  layout/EmailLayout.tsx          # gedeelde brand header/footer
  auth/
    PasswordReset.tsx
    EmailChangeConfirm.tsx
  transactional/
    LeadConfirmation.tsx          # → bezoeker
    AppointmentConfirmation.tsx   # → bezoeker
    AdminLeadNotification.tsx     # → Bodhi
    AdminAppointmentNotification.tsx
```

## 9. Image storage & upload

### Supabase Storage buckets

```
media (public):
  projects/[project_id]/[uuid].webp
  gallery/[uuid].webp
  services/[service_slug].webp
  site/                                # logo's, algemene assets

uploads-temp (private):
  [auto-cleanup na 24u]                # admin staging
```

### Bucket policies

```sql
CREATE POLICY "Public read media"
  ON storage.objects FOR SELECT TO anon, authenticated
  USING (bucket_id = 'media');

CREATE POLICY "Authenticated write media"
  ON storage.objects FOR INSERT, DELETE TO authenticated
  USING (bucket_id = 'media') WITH CHECK (bucket_id = 'media');
```

### Admin upload pipeline

```
Bodhi sleept foto in admin → Server Action:
  1. Validate: max 10MB, alleen jpeg/png/webp (MIME + magic-byte + extensie)
  2. Strip EXIF (privacy + smaller)
  3. Resize: 1920px max breedte (sharp)
  4. Convert to WebP (q=85)
  5. Upload naar media bucket met content-hashed filename
  6. Save URL in DB record
```

### Frontend display

- `next/image` voor alle public images
- Hero/LCP images: `priority={true}`
- Supabase Storage public URLs zijn al CDN-cached
- Tijdens migratie blijven Unsplash placeholders staan tot Bodhi vervangt

## 10. SEO

### Metadata strategie

```ts
// generateMetadata per page, vult vanuit Supabase services tabel
export async function generateMetadata(): Promise<Metadata> {
  const service = await getService('pvc-vloeren');
  return {
    title: `${service.meta_title} | BPM Parket Geldrop`,
    description: service.meta_description,
    openGraph: { /* ... */ },
    twitter: { card: 'summary_large_image' },
    alternates: { canonical: `https://bpmparket.nl/pvc-vloeren` },
  };
}
```

Bodhi kan `meta_title`/`meta_description` per service bewerken in admin.

### Structured Data (JSON-LD)

- **Site-wide:** LocalBusiness schema in root layout (Geldrop adres, openingstijden, geo, telefoon)
- **Service pages:** Service schema
- **Project detail:** Project + Image schemas
- **FAQ secties:** FAQPage schema (rich results)
- **Reviews:** AggregateRating + Review schemas (ster-snippet)

### Sitemap & robots

- `/sitemap.xml` auto-generated van statische routes + alle DB-driven content (projects, services, policies)
- `last-modified` per route uit `updated_at`
- `/robots.txt`: disallow `/admin/`, `/api/`, `/login`; sitemap reference

### Performance targets

| Metric | Target | Strategie |
|---|---|---|
| LCP | < 2.0s | `next/image priority`, font preload, server HTML |
| INP | < 200ms | RSC by default, minimaal client JS |
| CLS | < 0.05 | Vaste image dimensions, `next/font` |
| TTFB | < 600ms | Vercel Edge cache + ISR |

### NAP & Local SEO

NAP (Name, Address, Phone) consistent op alle pagina's: LocalBusiness JSON-LD, footer, Contact-pagina, `/showroom`-pagina. Google Business Profile setup tijdens launch checklist (TODO: bestaat dit al? Klantvraag.).

## 11. Analytics + GDPR Consent

### Stack

| Tool | Doel | Consent vereist |
|---|---|---|
| GA4 | Basis analytics + conversies → Google Ads | Analytics |
| Google Ads gtag | Direct conversion pixel | Marketing |
| Consent Mode v2 | EU compliance + modeled conversions | n.v.t. (verplicht) |
| Google Search Console | Organische SEO | Nee |

GA4 en Google Ads IDs worden later toegevoegd als env vars na klantbespreking.

### Cookie consent (granulair)

| Categorie | Cookies/scripts | Default |
|---|---|---|
| Necessary | Session, CSRF, consent state | Aan (geen toggle) |
| Functional | Theme/language preferences | Uit |
| Analytics | GA4 _ga | Uit |
| Marketing | Google Ads _gcl, conversion pixels | Uit |

### Banner UX

**Niet-blokkerend bottom strip** met "Alles accepteren" / "Alleen noodzakelijk" / "Voorkeuren aanpassen". Geen pre-checked boxes.

### Consent Mode v2

Default in `<head>` (vóór GA/gtag laadt):

```ts
gtag('consent', 'default', {
  ad_storage: 'denied',
  ad_user_data: 'denied',
  ad_personalization: 'denied',
  analytics_storage: 'denied',
  wait_for_update: 500,
});
```

Op consent change `gtag('consent', 'update', { ... })`. State persist in localStorage + cookie (13 maanden). Footer link "Cookie-voorkeuren beheren" heropent banner.

### Conversion events

Vanuit Server Actions getriggerd via client-side helper, vuurt alleen bij consent='granted':

- `lead_submit` (Quote/Contact form)
- `appointment_booked` (showroom afspraak)
- `phone_click`
- `whatsapp_click`

## 12. Vibe-Security checklist (per migratie-fase verifiëren)

### Geen secrets client-side
- Anthropic, Resend, Supabase service role: server-only env vars
- Alleen `NEXT_PUBLIC_SUPABASE_URL` + `NEXT_PUBLIC_SUPABASE_ANON_KEY` mogen client-side
- Pre-deploy: grep `.next/static/**` op private keys

### RLS-eerst (broken access control)
- Elke tabel heeft `ENABLE ROW LEVEL SECURITY` (verifiëren via `pg_policies`)
- Geen `SECURITY DEFINER` functies tenzij gereviewd
- `service_role` alleen in server actions met admin-only doel
- Public-write tabellen hebben **alleen INSERT** policy voor `anon`

### Auth boundaries (3 lagen)
- `middleware.ts` session check
- `(admin)/layout.tsx` 2e check via `getUser()`
- Server actions 3e check via `assertAdmin()`

### Input validation
- Zod schemas voor elke server action en route handler
- Email/phone format server-side gevalideerd
- String length limits
- File uploads: MIME + magic-byte + extensie (3 lagen)

### CSRF & secure cookies
- Server actions hebben automatisch CSRF protection
- Supabase cookies: `httpOnly`, `secure`, `sameSite=lax`
- Geen tokens in URL params

### Rate limiting
- `/api/chat`: 30/10min per IP+session
- Lead/contact: 5/uur per IP
- Login: 5 attempts/15min per IP
- Auth email hook: 1/min per email

### Output sanitization
- React handelt XSS automatisch af bij rendering
- Markdown content (Supabase `policies.content_md`) wordt server-side via een sanitizer (bijv. `sanitize-html`) met whitelist gerendeerd
- React Email auto-escapes user input

### Security headers (next.config.ts)
- HSTS (max-age 2y, includeSubDomains, preload)
- X-Content-Type-Options: nosniff
- X-Frame-Options: DENY
- Referrer-Policy: strict-origin-when-cross-origin
- Permissions-Policy: camera=(), microphone=(), geolocation=()
- Strict CSP met nonce voor gtag inline scripts

### Secrets hygiene
- `.env.local` niet in git
- Vercel env vars per environment gescheiden
- Geen secrets in commit messages of error logs
- Supabase database password rotation na initial setup

### Final audit
- Aan het einde van M1, vóór livegang: `vibe-security` skill draaien over hele codebase

## 13. Testing

### Manueel (M1)
- Smoke test per pagina (laadt, geen errors, juiste content)
- Form flows: lead, contact, offerte, afspraak (incl. emails arriveren)
- Chatbot conversation tot afspraak geboekt
- Admin login + CRUD per resource
- Image upload flow

### Geautomatiseerd (M1, beperkt)
- **Playwright E2E** voor 3 critical paths:
  1. Lead form submit + email arrives
  2. Chatbot books appointment
  3. Admin login → manage lead
- **Lighthouse CI** in GitHub Action: budget 95+ op Performance/Accessibility/SEO/Best Practices

### Pre-deploy
- TypeScript check (verplicht voor build)
- Vercel preview deploy + smoke check
- vibe-security sweep

## 14. Migratie sequence (high-level)

| Fase | Werk | Indicatie |
|---|---|---|
| 0 | Setup: branch, scaffold, Vercel/Supabase koppelen | 1 dag |
| 1 | Foundation: schema + RLS, Supabase clients, auth flow, admin layout | 2-3 dagen |
| 2 | Public site: layout, alle pages, Quote form, ad landing, policy pages | 3-4 dagen |
| 3 | Chatbot + Email infra: /api/chat, Upstash, React Email, Auth Email Hook | 2 dagen |
| 4 | Admin: leads, afspraken, kennisbank, projecten + gallery met upload | 3-4 dagen |
| 5 | SEO + GDPR: metadata, JSON-LD, sitemap, cookie banner, gtag | 2 dagen |
| 6 | Polish + audit: Lighthouse fixes, vibe-security run, deps audit, E2E | 1-2 dagen |
| 7 | Launch: DNS, Resend domain verify, Supabase prod URLs, Search Console, real photos | ½ dag |

**Totaal: ~14-19 werkdagen**

Het detailniveau implementatie-plan komt in een aparte `writing-plans`-output.

## 15. Open Questions / TODO's voor klant

- [ ] Bestaat er al een Google Business Profile voor BPM Parket?
- [ ] GA4 + Google Ads accounts: bestaande IDs of nieuw aanmaken?
- [ ] Resend account: nieuw aanmaken op `info@bpmparket.nl` of bestaande?
- [ ] Echte foto's: wanneer kan Bodhi starten met uploaden ter vervanging van Unsplash?
- [ ] DNS toegang voor `bpmparket.nl`: wie heeft die nu? (nodig voor Resend domain verification + Vercel domain switch)
