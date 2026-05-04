# Next.js Migration — Plan 4: SEO + GDPR + Launch

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Take the working platform (Plans 1-3) to production: full SEO setup (per-page metadata, JSON-LD structured data, sitemap, robots), GDPR-compliant Consent Mode v2 cookie banner, GA4 + Google Ads conversion tracking gated by consent, performance polish driven by Lighthouse, vibe-security audit pass, and launch checklist (DNS, Resend domain, Supabase Auth Email Hook, Vercel custom domain). Result: live BPM Parket site at `https://bpmparket.nl`, indexable, conversion-tracked, ready for Google Ads.

**Architecture:** Builds on Plans 1-3 — no new core systems, mostly metadata, structured data, consent state, and operational config. Cookie consent is a small client-side state machine that drives `gtag('consent', 'update', ...)` calls; analytics scripts only load when consent is granted. SEO is mostly RSC-side: each page gets `generateMetadata` and embeds `<script type="application/ld+json">` with the relevant Schema.org structured data. Performance work is iterative — use Lighthouse to find the biggest issues.

**Tech Stack:** Next.js 16, React 19, Tailwind v4, Supabase, GA4 + Google Ads gtag, Schema.org (JSON-LD), Lighthouse CI.

**Spec reference:** [docs/superpowers/specs/2026-05-02-vite-to-nextjs-migration-design.md](../specs/2026-05-02-vite-to-nextjs-migration-design.md)

**Plans 1-3 outputs this plan builds on:**
- Live Supabase: 8 tables seeded (services, policies)
- Live admin paneel: Bodhi can self-manage all content
- Server-side chatbot, lead forms, Upstash rate limiting
- 36 routes building cleanly
- `lib/company.ts`, `companyConfig` everywhere
- Stub `CookieBanner` component (Plan 2 Task 5) — replaced in this plan

---

## Note on inline script injection

This plan uses Next.js's `<Script>` component (from `next/script`) for inline gtag/Consent Mode scripts and React's standard JSON-LD pattern for Schema.org structured data. JSON-LD content is fully server-controlled — the values come from `companyConfig` and Supabase rows that the admin paneel writes (which themselves were validated via Zod). Markdown rendering uses react-markdown with strict component allowlist (Plan 2). No user-derived strings reach any HTML-injection sink.

---

## File structure (new/changed in Plan 4)

```
app/
  layout.tsx                                            MODIFY (LocalBusiness JSON-LD + ConsentInit + AnalyticsLoader)
  sitemap.ts                                            CREATE
  robots.ts                                             CREATE
  (public)/
    pvc-vloeren/page.tsx                                MODIFY (Service schema + canonical)
    traditioneel-parket/page.tsx                        MODIFY
    multiplanken/page.tsx                               MODIFY
    laminaat/page.tsx                                   MODIFY
    traprenovatie/page.tsx                              MODIFY
    schuren-onderhoud/page.tsx                          MODIFY
    projecten/[slug]/page.tsx                           MODIFY (Project schema + canonical)
components/
  layout/CookieBanner.tsx                               REPLACE (granular Consent Mode v2)
  layout/CookiePrefsButton.tsx                          CREATE
  layout/ConsentInit.tsx                                CREATE (default consent state in <head>)
  marketing/StructuredData.tsx                          CREATE (JSON-LD wrapper)
  analytics/AnalyticsLoader.tsx                         CREATE (gtag, consent-gated)
lib/
  consent.ts                                            CREATE (state + dispatcher)
  analytics.ts                                          CREATE (trackConversion helper)
  seo.ts                                                CREATE (Schema.org generators)
docs/
  launch-checklist.md                                   CREATE
```

---

## Phase 5a: SEO Foundation

### Task 1: Site-wide LocalBusiness JSON-LD

**Files:** `lib/seo.ts`, `components/marketing/StructuredData.tsx`, modify `app/layout.tsx`

- [ ] **lib/seo.ts** generates `localBusinessSchema()`, `serviceSchema(...)`, `projectSchema(...)` returning Schema.org objects with all NAP, hours, geo coordinates (Geldrop: 51.4202, 5.5594), socials, image, priceRange, openingHoursSpecification mapped from `companyConfig.hours`.

- [ ] **StructuredData.tsx** is a tiny RSC component that takes a `schema` prop (object or array) and renders a `<script type="application/ld+json">` with `JSON.stringify(schema)` as innerHTML. Type=application/ld+json is non-executable; content is server-controlled.

- [ ] **Wire into root layout** — render `<StructuredData schema={localBusinessSchema()} />` once, near top of `<body>`.

Verify: view-source of `/` contains the LocalBusiness schema. Validate at https://search.google.com/test/rich-results.

Commit: `feat(seo): site-wide LocalBusiness JSON-LD`

---

### Task 2: Service page Service schema + canonical

For each of the 6 service pages, modify the page to fetch the service, render `<StructuredData schema={serviceSchema(...)}>` before `<ServicePage>`, and add `alternates.canonical` to `generateMetadata`.

The 6 slugs: `pvc-vloeren`, `traditioneel-parket`, `multiplanken`, `laminaat`, `traprenovatie`, `schuren-onderhoud`. Same code shape, different SLUG constant per file.

Commit: `feat(seo): Service schema per service page + canonical URL`

---

### Task 3: Project detail Schema + canonical

Modify `app/(public)/projecten/[slug]/page.tsx` analogously: render `projectSchema(project)` before the JSX, add canonical to metadata.

Commit: `feat(seo): Project schema + canonical on project detail`

---

### Task 4: Sitemap

`app/sitemap.ts` — Next.js's MetadataRoute.Sitemap export. Fetches `getServices()` + `getProjects()`, returns combined static + DB-driven sitemap. `lastModified` = now, sensible `changeFrequency` and `priority` per route type.

Commit: `feat(seo): auto-generated sitemap.xml from DB + static routes`

Verify: `curl http://localhost:3000/sitemap.xml` returns valid XML.

---

### Task 5: robots.txt

`app/robots.ts` — disallows `/admin/`, `/api/`, `/login`, `/wachtwoord-reset`. Allows everything else. References `/sitemap.xml`.

Commit: `feat(seo): robots.txt`

---

## Phase 5b: GDPR Consent Mode v2

### Task 6: Consent state lib

`lib/consent.ts`:
- Types `ConsentCategories` (necessary always true; functional, analytics, marketing as booleans)
- `getConsent()` reads localStorage `bpm_consent_v2` (versioned), returns `null` if absent or wrong version
- `setConsent(partial)` merges with default-denied state, writes to localStorage AND mirrors as cookie (13-month expiry)
- `acceptAll()` / `rejectAll()` convenience functions
- Internal `dispatchGtagUpdate(c)` calls `window.gtag('consent', 'update', { ... })` mapping our 4 categories to Google's 7 storage types (ad_storage, ad_user_data, ad_personalization, analytics_storage, functionality_storage, personalization_storage, security_storage)
- After write, dispatches `CustomEvent('bpm:consent-changed', { detail: categories })` so React components can react

Commit: `feat(consent): typed consent state + gtag dispatcher`

---

### Task 7: ConsentInit (default-denied state in head)

`components/layout/ConsentInit.tsx`:
- Uses `<Script id="consent-init" strategy="beforeInteractive">` from next/script
- Sets `gtag('consent', 'default', { ... })` with all categories denied except `security_storage` and `wait_for_update: 500`
- Reads localStorage `bpm_consent_v2` synchronously; if found, immediately calls `gtag('consent', 'update', ...)` with stored values

This MUST run before AnalyticsLoader so default state is set before any tag fires.

Add `<ConsentInit />` to `app/layout.tsx` inside `<html>` but before `<body>`.

Commit: `feat(consent): Consent Mode v2 default-denied state in head`

---

### Task 8: Granular CookieBanner v2

REPLACE the stub from Plan 2. New banner has:
- Default view: 2 buttons "Alleen noodzakelijk" / "Alles accepteren" + "Voorkeuren aanpassen" toggle link
- Detail view: 4 toggles (Necessary disabled+checked, Functional, Analytics, Marketing) + "Voorkeuren opslaan" button
- Listens for `window.event('bpm:open-cookie-banner')` to reopen (footer button triggers this)

Also create `components/layout/CookiePrefsButton.tsx` — small client component that fires the reopen event.

Update `components/layout/Footer.tsx` POLICY_LINKS to include the CookiePrefsButton.

Commit: `feat(consent): granular CookieBanner v2 with category toggles + reopen`

---

### Task 9: Analytics loader

`components/analytics/AnalyticsLoader.tsx`:
- Reads `process.env.NEXT_PUBLIC_GA_ID` and `NEXT_PUBLIC_GADS_ID`
- If neither set, returns null
- If set, renders two `<Script strategy="afterInteractive">` tags: gtag.js loader + gtag init
- Both gtag config calls fire — Consent Mode v2 handles gating internally

Add `NEXT_PUBLIC_GA_ID` and `NEXT_PUBLIC_GADS_ID` (both optional) to `lib/env.ts`.

Add `<AnalyticsLoader />` to `app/layout.tsx` body.

**Note:** GA4 + Google Ads IDs come AFTER the client meeting (parked in the spec). Until env vars are set, the loader is a no-op. This task creates the wiring so it activates by env var alone.

Commit: `feat(analytics): GA4 + Google Ads gtag loader (consent-gated)`

---

### Task 10: Conversion tracking helper

`lib/analytics.ts` exports `trackConversion(event)` where event is a discriminated union: `{ name: 'lead_submit', source }`, `{ name: 'appointment_booked', source: 'chatbot' | 'website' }`, `{ name: 'phone_click' }`, `{ name: 'whatsapp_click' }`. Calls `window.gtag('event', name, props)`. No-op if gtag not present (Consent Mode v2 handles denied case).

Wire `trackConversion({ name: 'lead_submit', source })` into `LeadForm.tsx` via useEffect on success state.

(Phone/WhatsApp click tracking can be added when those buttons get explicit handlers — minor follow-up.)

Commit: `feat(analytics): conversion event helper + lead_submit tracking`

---

## Phase 6: Polish + Audit

### Task 11: Performance — next/font + Lighthouse

- [ ] Switch to `next/font/google`: `Inter` for `--font-sans-loaded`, `Cormorant_Garamond` (weight 500) for `--font-display-loaded`. Both with `display: 'swap'`. Apply class names to `<html>`.
- [ ] Update `app/globals.css` `@theme` to point `--font-sans` and `--font-display` at the loaded variables (with system fallbacks).
- [ ] Audit `priority` prop on hero images — must be set on home/services/projects/showroom/about/landing-pvc.
- [ ] Run Lighthouse on Vercel Preview URL. Target: Performance ≥ 95, SEO 100, Accessibility ≥ 95, Best Practices ≥ 95.
- [ ] Address top 3 issues if any.

Commit: `perf: next/font for Inter+Cormorant, image priority audit, Lighthouse fixes`

---

### Task 12: Vibe-security audit

- [ ] Invoke the `vibe-security` skill against the codebase. Focus on `app/api/*/route.ts`, all `actions/*.ts` and `app/**/actions.ts`, `lib/storage/*`, `lib/env.ts`, RLS policies.
- [ ] Manual sanity checks:
  - `grep -r "SUPABASE_SERVICE_ROLE\|sk-ant-\|re_" .next/static/` → expect empty (no secrets in client bundle)
  - `grep -L "assertAdmin" app/\(admin\)/admin/**/actions.ts` → expect empty (every admin action calls assertAdmin)
  - `grep -rn "createServiceClient\|requireServiceRoleKey" app/ lib/ actions/` → expect: only `lib/storage/upload.ts` and `scripts/seed-admin-user.ts`
- [ ] Apply mitigations for any findings.

Commit: `security: vibe-security audit fixes`

---

### Task 13: Dependency audit + CSP

- [ ] `npm audit --audit-level=high` — fix anything critical/high (avoid `--force`)
- [ ] Add `Content-Security-Policy` header to `next.config.ts`: allowlist `self`, googletagmanager.com, google-analytics.com, supabase.co, anthropic.com, fonts.gstatic.com, images.unsplash.com. `frame-ancestors 'none'`. `'unsafe-inline'` for scripts (next/script inline blocks) — tighten to nonces post-launch.
- [ ] Deploy to Preview and watch DevTools console for "Refused to load …" CSP errors. Adjust until clean.

Commit: `security: CSP header + dep audit fixes`

---

## Phase 7: Launch Prep

### Task 14: Resend setup + Auth Email Hook (operational)

- [ ] Resend account on `info@bpmparket.nl`
- [ ] Add domain `bpmparket.nl`, configure DNS records (3 TXT, 1 MX), wait for verification
- [ ] Create production API key, add to Vercel env: `RESEND_API_KEY`
- [ ] Supabase dashboard → Auth → Hooks → Send Email Hook → URL `https://bpmparket.nl/api/auth/email-hook` + signing secret
- [ ] Add `SUPABASE_AUTH_EMAIL_HOOK_SECRET` to Vercel env
- [ ] Disable Supabase's built-in email templates
- [ ] Test password reset flow on Vercel Preview — verify branded email arrives via Resend

(No code commits — purely operational.)

---

### Task 15: Vercel custom domain + production env

- [ ] Vercel project → Domains → Add `bpmparket.nl` and `www.bpmparket.nl`
- [ ] Update DNS at registrar (A record `76.76.21.21` for apex, CNAME `cname.vercel-dns.com` for `www`)
- [ ] Wait for SSL cert (~5-10 min)
- [ ] Set all Production env vars (full list in launch-checklist.md, Task 18)
- [ ] Supabase Auth → URL Configuration: Site URL `https://bpmparket.nl`, add redirect URLs for production wachtwoord-reset path

---

### Task 16: Search Console + sitemap submission

- [ ] Search Console → Add property `https://bpmparket.nl` → verify via DNS TXT
- [ ] Sitemaps → submit `https://bpmparket.nl/sitemap.xml`
- [ ] (Optional) Bing Webmaster Tools — imports Search Console verification

---

### Task 17: Merge to main + smoke test

- [ ] Final verification: `npm run typecheck && npm run build && npm test` on `next-migration` branch
- [ ] `git checkout main && git merge --no-ff origin/next-migration -m "feat: merge Next.js 16 migration (Plans 1-4)"`
- [ ] `git push origin main` — Vercel auto-deploys
- [ ] Monitor Vercel deploy logs for first 30 min
- [ ] **Production smoke test (10 items):**
  1. `/` loads with Hero, USPs, Services, Projects, Reviews, CTA
  2. All 6 service pages load with content
  3. Submit test lead via `/offerte` → see green confirmation + email arrives
  4. Open chatbot → ask "openingstijden" → reasonable Dutch response within 5s
  5. Login at `/login` as Bodhi → admin dashboard shows real stats
  6. Lead from step 3 visible in `/admin/leads`
  7. Cookie banner appears on first visit (incognito)
  8. "Voorkeuren aanpassen" shows 4 toggles
  9. Mobile viewport — menu, chatbot, forms all responsive
  10. Lighthouse production run → Performance ≥ 90, SEO 100, Accessibility ≥ 95

---

### Task 18: Launch checklist document

Create `docs/launch-checklist.md` with the comprehensive pre-launch / launch-day / week-1 monitoring checklist (see plan body — full content lives in that file).

Sections:
- Pre-launch (Code, Vercel, Supabase, Resend, Analytics, SEO, Content)
- Launch day
- Day-1 monitoring
- Week 1 post-launch

Commit: `docs: production launch checklist`

---

### Task 19: Final README + push

- [ ] Update README Status section: Plan 4 → done
- [ ] Final commit + push

```bash
git add README.md
git commit -m "docs: README updated for Plan 4 completion"
git push
```

---

## Self-Review Notes

**Spec coverage:**
- ✅ Sectie 10 (SEO metadata + JSON-LD + sitemap + robots) — Tasks 1-5
- ✅ Sectie 11 (Consent Mode v2 granular + GA4 + Google Ads gtag) — Tasks 6-10
- ✅ Sectie 12 (vibe-security final audit + CSP) — Tasks 12-13
- ✅ Sectie 13 (testing — Lighthouse CI added) — Task 11
- ✅ Sectie 14 Phase 7 (Launch — DNS, Resend domain, Supabase Auth Hook, Search Console) — Tasks 14-17

**Placeholder scan:** No "TBD". Operational tasks are explicit step-by-step. Code tasks reference the patterns already in use.

**Type consistency:**
- `ConsentCategories` shape consistent: `lib/consent.ts` defines, `ConsentInit.tsx` inline script reads same shape from localStorage, `CookieBanner.tsx` writes through `setConsent()`
- `MetadataRoute.Sitemap` and `MetadataRoute.Robots` from Next types
- Schema.org JSON-LD shape verified against schema.org/LocalBusiness, Service, CreativeWork
- gtag consent storage names match Google's Consent Mode v2 spec

**Open handoff items (require client meeting / external setup):**
- GA4 property creation + ID (after client meeting)
- Google Ads account + conversion IDs
- Resend domain DNS verification (needs DNS access for `bpmparket.nl`)
- Vercel custom domain (needs DNS access)
- Bodhi practical onboarding (admin paneel walkthrough, password rotation)
- Real photos uploaded by Bodhi via `/admin/projecten` and `/admin/gallery`

**Estimated execution time:** 3-5 working days
- Code (Tasks 1-13): ~2-3 days
- Operational + DNS propagation waits (Tasks 14-17): ~1-2 days
