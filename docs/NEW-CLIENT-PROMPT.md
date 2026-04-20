# One-Shot Prompt — Klant Website Generator

## Hoe te gebruiken

1. Open een nieuwe lege directory in je terminal
2. Start Claude Code: `claude` (of via de IDE extensie)
3. Vul de INVOER sectie hieronder in met klant-specifieke gegevens
4. Kopieer dit volledige document naar Claude Code
5. Claude Code bouwt de volledige site in 30-60 minuten
6. Run na afloop: `npx tsx scripts/init-supabase.ts` om de database te seeden
7. Run `npm run dev` om de site te starten op http://localhost:3000
8. Ga naar http://localhost:3000/login om de eerste admin aan te maken

## Wat wordt gebouwd

Een volledige Next.js 16 website met publieke site (homepage, over-ons, showroom met afspraak-booking, contact, offerte, projecten met filter + multi-image gallery lightbox, productcategorieen -> merken -> producten, type-filter paginas voor gordijnen/raamdecoratie, beleidspaginas, cookiebanner), admin panel (dashboard, projecten met multi-image, aanvragen, afspraken agenda, klanten CRM, AI kennisbank, beleid, instellingen 6 tabs), AI Chatbot (Claude Haiku), Supabase backend (8 tabellen + RLS + auth + seed script), SEO (metadata, sitemap, schema.org), Announcement bar, GDPR cookiebanner.

---

# INVOER - Vul hieronder in

## Bedrijfsgegevens

BEDRIJFSNAAM={Bedrijfsnaam B.V.}
TAGLINE={Korte slogan, 1 zin}
TELEFOON={0314-123456}
EMAIL={info@voorbeeld.nl}
ADRES={Straat 12}
POSTCODE={1234 AB}
STAD={Doetinchem}
KVK={00000000}
BTW={NL000000000B01}
OPENINGSTIJDEN_MAANDAG={13:00 - 17:00}
OPENINGSTIJDEN_DINSDAG={10:00 - 17:00}
OPENINGSTIJDEN_WOENSDAG={12:00 - 17:00}
OPENINGSTIJDEN_DONDERDAG={10:00 - 17:00}
OPENINGSTIJDEN_VRIJDAG={10:00 - 17:00}
OPENINGSTIJDEN_ZATERDAG={09:00 - 15:00}
OPENINGSTIJDEN_ZONDAG={Gesloten}
FACEBOOK_URL={https://facebook.com/voorbeeld}
INSTAGRAM_URL={https://instagram.com/voorbeeld}
LINKEDIN_URL={https://linkedin.com/company/voorbeeld}

## Branding

PRIMAIRE_KLEUR={#5ecc41}
SECUNDAIRE_KLEUR={#4ab82e}
BRAND_DARK_KLEUR={#1a1a1a}
LOGO_URL={/logo.png}

## Diensten (3-6 stuks)

DIENST_1_NAAM={PVC Vloeren}
DIENST_1_SLUG={pvc-vloeren}
DIENST_1_BESCHRIJVING={Stijlvol, duurzaam en onderhoudsvriendelijk}
DIENST_1_ICON={Layers}

DIENST_2_NAAM={Traprenovatie}
DIENST_2_SLUG={traprenovatie}
DIENST_2_BESCHRIJVING={Nieuwe uitstraling zonder volledige vervanging}
DIENST_2_ICON={ArrowUpDown}

DIENST_3_NAAM={Vloerbedekking}
DIENST_3_SLUG={vloerbedekking}
DIENST_3_BESCHRIJVING={Warmte en comfort met hoogwaardige vloerbedekking}
DIENST_3_ICON={ShieldCheck}

DIENST_4_NAAM={Raamdecoratie}
DIENST_4_SLUG={raamdecoratie}
DIENST_4_BESCHRIJVING={Sfeervolle oplossingen voor elk raam}
DIENST_4_ICON={Sun}

DIENST_5_NAAM={Gordijnen}
DIENST_5_SLUG={gordijnen}
DIENST_5_BESCHRIJVING={Maak uw interieur compleet met gordijnen op maat}
DIENST_5_ICON={Wind}

## USPs

USP_1={20+ jaar ervaring}
USP_2={Gratis inmeten bij u thuis}
USP_3={Showroom in [stad]}
USP_4={Scherpe prijzen}
USP_5={Vakkundige montage door eigen team}
USP_6={Maatwerk voor elk project}

## Garanties

GARANTIE_1={5 jaar fabrieksgarantie op alle vloeren}
GARANTIE_2={2 jaar montagegarantie}
GARANTIE_3={Geen verborgen kosten}
GARANTIE_4={Tevredenheidsgarantie}

## Statistieken

STAT_1_LABEL={Ervaring}
STAT_1_WAARDE={20}
STAT_1_SUFFIX={+ jaar}
STAT_2_LABEL={Klanten}
STAT_2_WAARDE={500}
STAT_2_SUFFIX={+}
STAT_3_LABEL={Producten}
STAT_3_WAARDE={100}
STAT_3_SUFFIX={+}
STAT_4_LABEL={Projecten}
STAT_4_WAARDE={150}
STAT_4_SUFFIX={/jaar}

## SEO

DOMEIN={https://voorbeeld.nl}
SEO_KEYWORDS={pvc vloeren, traprenovatie, vloerbedekking, raamdecoratie, gordijnen, doetinchem, achterhoek}
VERZORGINGSGEBIED={Doetinchem en omgeving}
META_TITLE={Bedrijfsnaam | Specialist in PVC-vloeren & Interieur}
META_DESCRIPTION={Uw specialist in PVC-vloeren en raamdecoratie. 20+ jaar ervaring. Gratis advies en offerte.}

## API Keys

NEXT_PUBLIC_SUPABASE_URL={https://xxxxxx.supabase.co}
NEXT_PUBLIC_SUPABASE_ANON_KEY={eyJhbGc...}
SUPABASE_SERVICE_ROLE_KEY={eyJhbGc...}
ANTHROPIC_API_KEY={sk-ant-api03-...}
APIFY_TOKEN={apify_api_...}

## Feature toggles

ACTIEVLOEREN_AAN={false}
WACHTWOORD_GATE_AAN={false}
POPUP_AAN={false}
CHATBOT_AAN={true}
ANNOUNCEMENT_BAR_AAN={true}
FACEBOOK_SCRAPE_AAN={false}


---

# INSTRUCTIES VOOR CLAUDE CODE

Je bent een Claude Code agent die een Next.js 16 website bouwt in de huidige lege directory. Gebruik de INVOER hierboven voor alle klant-specifieke waarden. Volg deze stappen exact.

## Stap 1: Project initialiseren

```bash
npx create-next-app@latest . --typescript --tailwind --app --no-src-dir=false --import-alias="@/*" --no-eslint
```

Accept defaults. Creates src/app, tailwind.config.ts, etc.

## Stap 2: Dependencies installeren

```bash
npm install --legacy-peer-deps @supabase/supabase-js @supabase/ssr @anthropic-ai/sdk sharp lucide-react date-fns react-day-picker @tailwindcss/typography
npm install --save-dev --legacy-peer-deps tsx dotenv
```

Maak `.npmrc` met inhoud: `legacy-peer-deps=true`

## Stap 3: Environment variabelen

Maak `.env.local` met de API_KEYS uit INVOER.
Voeg `.env.local` toe aan `.gitignore`.

## Stap 4: Tailwind config

Vervang `tailwind.config.ts` — gebruik brand kleuren uit INVOER:
- `brand-primary` = PRIMAIRE_KLEUR
- `brand-secondary` = SECUNDAIRE_KLEUR
- `brand-dark` = BRAND_DARK_KLEUR
- `brand-accent` = PRIMAIRE_KLEUR
- `brand-bg-light` = `#f9fafb`

Font: Outfit via next/font (of system fallback).

Animations toevoegen: fade-in, slide-up, marquee (40s linear infinite), shake, blur-in, bounce-subtle.

Plugin: `@tailwindcss/typography`.

## Stap 5: Global CSS (src/app/globals.css)

```css
@tailwind base;
@tailwind components;
@tailwind utilities;

.no-scrollbar::-webkit-scrollbar { display: none; }
.no-scrollbar { scrollbar-width: none; }

.reveal { opacity: 0; transform: translateY(20px); transition: opacity 0.6s ease-out, transform 0.6s ease-out; }
.reveal-active { opacity: 1; transform: translateY(0); }
```

## Stap 6: Supabase clients (src/lib/supabase/)

Maak 4 bestanden:
- `server.ts` — createServerClient met cookies
- `client.ts` — createBrowserClient voor client components
- `static.ts` — simpele createClient voor static generation (geen cookies)
- `require-auth.ts` — helper die throws als user niet ingelogd is
- `middleware.ts` — session refresh voor Supabase auth

## Stap 7: Types (src/types.ts)

Export interfaces: Project (met images array), Customer, Appointment, ChatMessage, Policy, KnowledgeItem.

Project heeft: id, title, description, imageUrl, images (string array), areaSize, location, date, category, brand, brandSlug, longDescription, techniques.

## Stap 8: Config (src/config.ts)

Export `companyConfig` object met waarden uit INVOER: name, tagline, contact (address, phone, email), openingHours, socials, stats array, usps array, guarantees array.

## Stap 9: Data layer (src/data/brands.ts)

Exporteer types: Brand, BrandProduct, RaamdecoratieType, Category, ProductType.

Exporteer array `categories` met één entry per DIENST_X uit INVOER, elk met: name, slug, description, imageUrl (placeholder `/images/categories/[slug].jpg`), icon (uit DIENST_X_ICON), brands (lege array — klant voegt zelf toe via admin of hardcoded).

**Vaste productTypes voor raamdecoratie en gordijnen (via `raamdecoratieTypes` veld op de Category):**

Raamdecoratie krijgt deze 6 types:
- Jaloezieën (slug: jaloezieen)
- Duette (slug: duette)
- Vouwgordijnen (slug: vouwgordijnen)
- Rolgordijnen (slug: rolgordijnen)
- Duorolgordijnen (slug: duorolgordijnen)
- Horren (slug: horren)

Gordijnen krijgt deze 2 types:
- Gordijnen (slug: gordijnen)
- Inbetweens (slug: inbetweens)

Beide categorieen krijgen een `raamdecoratieTypes: RaamdecoratieType[]` veld met deze vaste lijst. Elk type heeft: name, slug, description (2-3 zinnen), materials array, specs object. Gordijnen kan hiernaast ook `brands: Brand[]` hebben als merken expliciet gordijnen verkopen (bv. Hamicon).

Helper functies: getCategoryBySlug, getBrandBySlug, getAllBrands, getFeaturedBrands, getCategoriesWithBrands, getProductTypesForCategory, getBrandsByType, getTypeBySlug.

`getProductTypesForCategory(slug)`: gebruikt de `raamdecoratieTypes` array als die bestaat, anders extractie uit brand.products via `Type` spec met normalisatie (rolgordijn/rolgordijnen → Rolgordijnen).

`getBrandsByType(cat, typeSlug)`: filtert brands waarvan product.specs.Type matcht. **Fallback:** als geen brand matcht, return alle brands in de category (zodat type-pagina niet leeg is).

**Klant-specifieke aanpassingen:** als een klant andere types wil onder deze categorieen, pas de `raamdecoratieTypes` array aan. De menu + type-filter paginas gebruiken deze lijst automatisch.

## Stap 10: Data fetching

### src/lib/site-data.ts (public, cached)

Exporteer `cache()` functies: getBedrijfsgegevens, getTestimonials, getProjects, getProject, getChatbotSettings, getKennisItems, getPromoPopup, getAnnouncementBar, getSitePassword, getDynamicPolicies, getPublicActievloeren (als ACTIEVLOEREN_AAN).

### src/lib/admin-data.ts

Normale async functies voor admin (geen cache): getProjects, getProject, getCustomers, getCustomer, getAppointments, getAppointment, getOffertes, getOfferte, getTestimonials, getTestimonial, getAIKennisbank, getAIKennisitem, getActievloeren (optioneel), getSettings.

## Stap 11: Database init script (scripts/init-supabase.ts)

Maak een script dat:
1. Laadt .env.local via dotenv
2. Gebruikt SUPABASE_SERVICE_ROLE_KEY voor admin toegang
3. Runs een groot SQL block dat 8 tabellen aanmaakt met RLS policies (zie Appendix C)
4. Seedt settings: bedrijfsgegevens, seo_settings, chatbot_settings, announcement_bar, promo_popup, site_password
5. Seedt ai_kennisbank met 5-10 items gebaseerd op INVOER diensten
6. Seedt dynamic_policies met 3 policies: Privacybeleid, Algemene Voorwaarden, Cookiebeleid (zie Appendix A voor HTML templates, vervang merknaam door BEDRIJFSNAAM)
7. Maakt een `has_no_users()` RPC voor de first-admin flow
8. Maakt storage bucket `media` met public read policy

Als exec_sql RPC ontbreekt in Supabase: log het SQL block en instrueer gebruiker om handmatig in dashboard te plakken.

## Stap 12: Folder structuur

Bouw deze folders en bestanden exact:

```
src/app/
  (site)/
    layout.tsx              # Root layout met metadata, JSON-LD
    RootLayoutContent.tsx   # Navbar + content + Footer + Chatbot + CookieBanner + AnnouncementBar
    page.tsx                # Homepage entry
    HomePageClient.tsx
    actions.ts              # Server actions
    over-ons/page.tsx
    showroom/ (page.tsx, ShowroomClient.tsx)
    contact/ (page.tsx, ContactClient.tsx)
    offerte/ (page.tsx, OfferteClient.tsx)
    projecten/ (page.tsx, ProjectsClient.tsx, [id]/page.tsx + ProjectDetailClient.tsx)
    producten/
      [category]/page.tsx                        # Category listing
      [category]/[brand]/page.tsx               # Brand detail
      [category]/type/[typeSlug]/page.tsx       # Type filter
      pvc-vloeren/page.tsx                      # Per-dienst landing
      traprenovatie/page.tsx
      vloerbedekking/page.tsx
      raamdecoratie/page.tsx
      gordijnen/page.tsx
    beleid/[slug]/page.tsx
    actievloeren/ (alleen als ACTIEVLOEREN_AAN)
  (admin)/
    admin/
      layout.tsx
      page.tsx (dashboard)
      _components/ (Sidebar, AppointmentsClient, CalendarView, PipelineBoard, DeleteButton)
      projecten/ (page.tsx, actions.ts, [id]/page.tsx, ProjectImagesField.tsx)
      aanvragen/
      afspraken/
      klanten/
      kennisbank/
      beleid/
      instellingen/
      actievloeren/ (als toggle aan)
    login/ (page.tsx, actions.ts, PasswordInput.tsx)
  api/
    chat/ (route.ts, chat-actions.ts)
    site-password/route.ts
    upload-project-image/route.ts
    projects-by-brand/route.ts
  sitemap.ts
  robots.ts
src/components/
  Navbar.tsx, Footer.tsx, Chatbot.tsx, AnnouncementBar.tsx
  ProjectDetail.tsx, Button.tsx, StatCounter.tsx, CookieBanner.tsx
  PromoPopup.tsx (als toggle aan), SitePasswordGate.tsx (als toggle aan)
  RichTextEditor.tsx
  ui/date-time-picker.tsx
scripts/
  init-supabase.ts
  scrape-facebook-projects.ts (als FACEBOOK_SCRAPE_AAN)
public/
  logo.png
middleware.ts
```

## Stap 13: Publieke paginas - specificaties

### Homepage secties (HomePageClient.tsx)

1. Hero: donkere achtergrond met overlay, tagline, 3 USP badges, CTA button
2. Brand logos marquee strip (animate-marquee, featured brands)
3. Premium Partners slider: horizontale kaarten met category info, navigatie pijltjes rechtsboven
4. Stats sectie (donker): 4 stats met StatCounter
5. Over-ons intro: 2-column foto + tekst met CTA naar /over-ons
6. Reviews carousel: getTestimonials met sterren
7. Showroom afspraak booking: form met DateTimePicker en submitShowroomAppointment server action
8. CTA sectie: offerte button

### Over Ons

Hero + 2-column sectie (foto + bedrijfsverhaal placeholder) + Stats sectie + CTA.

### Showroom

Hero + 2-column layout (info/Maps links, afspraak form rechts) + visueel showcase.

### Contact

Hero + 2-column (gegevens links, formulier rechts) + social links.

### Offerte

Multi-step form: service selectie, maten/opmerkingen, contactgegevens, bevestiging. Submit naar offertes tabel.

### Projecten

Hero + filter bar (dienst tabs + brand tabs dynamisch) + grid van ProjectCards + ProjectDetail modal met multi-image gallery + lightbox (prev/next + keyboard nav).

### Brand detail

Hero met mood image achtergrond + brand logo + CTAs (incl. Bezoek website als brand.website gezet) + products grid met specs + sfeerbeelden lightbox (prev/next + keyboard) + Brand-related projects fetch + Why this brand USPs + Other brands + CTA.

### Type filter (gordijnen/raamdecoratie)

Hero met category + type naam + grid van brands die dat type aanbieden (getBrandsByType) + CTA.

### Per-dienst landing paginas

Statische marketing pagina per dienst met hero, types info, USPs, CTA.

### Beleidspaginas

Hero + prose styled HTML content via dangerouslySetInnerHTML.

## Stap 14: Admin paginas

### Layout

Sidebar + main content, requireAuth() check op elke pagina.

### Sidebar

Navigation groepen:
- MAIN: Dashboard, Projecten, Actievloeren (optioneel), Offerte aanvragen, Agenda, AI Kennisbank
- BUSINESS: Klanten
- OTHER: Beleid & Paginas, Instellingen

### Dashboard

Stats grid 4 tegels + recente aanvragen + eerstvolgende afspraken.

### Projecten

List met cards, edit pagina met ProjectImagesField (multi-image manager, upload via /api/upload-project-image), form velden (title, description, long_description, category dropdown, brand dropdown uit categories.flatMap, location, date, area_size, techniques, images hidden input). Server actions: saveProject, deleteProject.

### Aanvragen

Kanban board: nieuw, behandeling, verzonden, gesloten. Drag-drop tussen kolommen.

### Afspraken

Kalender view + lijst + detail pagina per afspraak.

### Klanten

CRM lijst + detail met history (afspraken + offertes).

### AI Kennisbank

CRUD voor kennisbank items.

### Beleid

List + editor (RichTextEditor) voor policies. Slug auto-gegenereerd.

### Instellingen (6 tabs)

- Bedrijf: alle bedrijfsgegevens velden
- SEO: meta_title, meta_description, keywords, google_verification
- Chatbot: enabled toggle, welcome_message, system_prompt
- Popup: enabled, title, body (richtext), display_style
- Balk: enabled, meerdere texts (RichTextEditor per tekst, Plus knop), bgColor met accessibility preview
- Wachtwoord: enabled, password input, backgroundImage URL

Als ACTIEVLOEREN_AAN: extra Actievloeren tab.

### Login

Check has_no_users RPC. Als geen users: register first admin form. Anders: login form. Support voor errors in URL params.

## Stap 15: API routes

### /api/chat/route.ts — Chatbot

Rate limit 15/min per IP. Haal settings + kennisbank + company op. Bouw system prompt (bedrijfsnaam, openingstijden, diensten, belverwijzing). Gebruik @anthropic-ai/sdk met claude-haiku-4-5-20251001. Tool calling loop met check_availability en create_appointment tools. Return JSON {content} of {error}.

### /api/chat/chat-actions.ts

checkAvailability(dateStr): query appointments voor date, return {bookedTimes}.
createAppointmentTool(data): insert customer + appointment.

### /api/site-password/route.ts

POST met {password}, check tegen settings.site_password, return {ok} of 401.

### /api/upload-project-image/route.ts

POST multipart, sharp WebP q85, upload naar Supabase storage media bucket, return {url}.

### /api/projects-by-brand/route.ts

GET ?brand=slug, return projecten gefilterd op brand_slug.

## Stap 16: Componenten

Navbar met desktop mega menu (6-column grid, gordijnen/raamdecoratie tonen types uit getProductTypesForCategory, andere tonen brands) + mobile drawer. PVC Vloeren heeft extra Actievloeren link (als toggle aan).

Footer met CTA sectie + diensten links + beleid links + socials + copyright.

Chatbot fixed bottom-right widget met w-96 h-500px chat window, welcome message uit settings, MessageCircle toggle icon.

AnnouncementBar met rotate texts (5s interval), WCAG contrast, dismiss knop.

ProjectDetail modal met gallery (hoofdafbeelding + thumbnail strip + lightbox met keyboard nav), info panel (locatie/oppervlakte/datum), description, techniques (alleen als aanwezig niet als fallback), CTA naar /offerte.

Button met variants (primary/outline/ghost), withIcon, fullWidth, size (sm/md/lg).

StatCounter: animated counter met IntersectionObserver trigger.

CookieBanner: fixed bottom banner met localStorage cookie_consent. 3 opties: necessary only, accept all, instellingen. Link naar /beleid/cookiebeleid.

RichTextEditor: contenteditable div met toolbar (Bold, Italic, Underline, Link popover). Active state via document.queryCommandState.

DateTimePicker: calendar popover (react-day-picker) + tijd dropdown met 30-min slots, disabledTimes prop, weekenden uit openingHours.

## Stap 17: SEO

Metadata in (site)/layout.tsx: title template, description, keywords, OpenGraph, Twitter. JSON-LD schema.org LocalBusiness via script tag.

Sitemap: statische routes + per categorie + per brand + per type + dynamic policies + actievloeren.

robots.ts: allow all.

## Stap 18: Cookiebanner + policies

CookieBanner gebruikt localStorage cookie_consent (accepted-all of necessary-only). Seed 3 policies in init script (zie Appendix A).

## Stap 19: Facebook scrape (optioneel)

Als FACEBOOK_SCRAPE_AAN: kopieer scripts/scrape-facebook-projects.ts patroon - Apify API call, filter op keywords, download images, sharp WebP conversion, Supabase insert.

## Stap 20: Run + test

```bash
npm install --legacy-peer-deps
npx tsx scripts/init-supabase.ts
npm run dev
```

Open http://localhost:3000/login, registreer eerste admin, begin met content via /admin.

## Regels voor Claude Code

1. GEEN emojis in code (wel in placeholder seed data)
2. Alleen lucide-react icons
3. Alle tekst in Nederlands
4. Bewaar formatting patterns: bg-brand-dark, rounded-2xl, py-20, etc.
5. TypeScript strict, geen any tenzij echt nodig
6. Server Components by default, "use client" alleen waar state/effects
7. Form handling via Server Actions (behalve chatbot/upload)
8. Multi-image projects: altijd images string array, image_url = images at index 0
9. Responsive mobile-first: sm, md, lg breakpoints
10. Animations minimaal: animate-fade-in, animate-slide-up, reveal class met IntersectionObserver

## Debugging

- Supabase init faalt op exec_sql: gebruiker plakt SQL handmatig in dashboard
- TypeScript errors: npx tsc --noEmit tussendoor
- Dev server errors: check .env.local

## Appendix A: Policy templates

Seed 3 policies in init-supabase.ts. Gebruik HTML content met h2, p, ul, li tags. Vervang alle merknaam/adres/telefoon/email placeholders door INVOER variabelen.

**Privacybeleid**: AVG-compliant met secties (wie zijn wij, welke gegevens, doel, grondslag, bewaartermijn, derden, rechten betrokkene, beveiliging, cookies verwijzing, wijzigingen, contact).

**Algemene Voorwaarden**: 15 artikelen (definities, toepasselijkheid, offertes, totstandkoming, prijzen, betaling, uitvoering, oplevering, garantie, aansprakelijkheid, overmacht, herroepingsrecht consumenten, eigendomsvoorbehoud, klachten/geschillen, slotbepalingen).

**Cookiebeleid**: wat zijn cookies, welke gebruiken we (functioneel, analytisch, tracking=geen), toestemming, uitschakelen instructies per browser (Chrome/Firefox/Safari/Edge), wijzigingen, contact.

## Appendix B: Chatbot system prompt template

```
Je bent een vriendelijke assistent van {BEDRIJFSNAAM}. Je HOOFDDOEL is om bezoekers te laten bellen naar {TELEFOON}.

COMMUNICATIESTIJL:
- Informeel Nederlands, warm en persoonlijk
- KORT: max 2-3 zinnen
- Gebruik NOOIT emojis

WAT JE WEL BEANTWOORDT:
- Openingstijden: [uit INVOER]
- Locatie: {ADRES}, {POSTCODE} {STAD}
- Welke diensten: [uit DIENSTEN]
- Simpele ja/nee vragen
- Afspraak inplannen via tools

WAT JE DOORVERWIJST NAAR BELLEN:
- Prijzen, technisch advies, offertes, klachten
- Alles behalve basisfeiten: Bel {TELEFOON} voor persoonlijk advies

Tools: check_availability, create_appointment
```

## Appendix C: SQL schema

Creeer 8 tabellen met RLS:

1. settings (id uuid, key text unique, value jsonb, updated_at timestamptz) - public read, auth write
2. customers (id uuid, name, email, phone, address, city, zip, company_name, notes, created_at) - auth full
3. appointments (id uuid, customer_id fk, date timestamptz, service text check, status text default nieuw, notes, source) - auth full + public insert
4. offertes (id uuid, customer_name, email, phone, service, message, status) - auth full + public insert
5. projects (id uuid, title, description, long_description, image_url, images jsonb default empty array, category, location, area_size, date, techniques text array, brand, brand_slug, fb_post_id unique when not null, created_at) - public read, auth write
6. testimonials (id uuid, name, location, text, stars int check 1-5, created_at) - public read, auth write
7. ai_kennisbank (id uuid, title, category, content, icon, created_at) - public read, auth write
8. actievloeren (indien toggle): id uuid, name, brand, collection, image_url, discount_percentage check 0-100, description, specs jsonb, active bool default true, sort_order int, created_at - public read where active, auth write

Storage bucket media public.

RPC has_no_users() returns bool, security definer, grant execute to anon.

