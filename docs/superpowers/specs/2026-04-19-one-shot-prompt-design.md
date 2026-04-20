# One-Shot Prompt Generator voor Klant-Websites — Design Spec

## Doel

Eén markdown-bestand dat ik kan kopiëren, variabelen invullen, en aan Claude Code geven om een volledige werkende klant-website te bouwen op basis van de architectuur van deze site (PVC Vloeren Achterhoek).

## Doelgebruiker

Developer (ik) die snel een nieuwe klant-site wil opzetten met exact dezelfde features en look-and-feel.

## Doelplatform

**Claude Code (agent in lege project map).**

De gebruiker:
1. Opent een nieuwe lege directory
2. Start Claude Code
3. Kopieert de one-shot prompt
4. Vult de variabelen in de prompt in
5. Plakt de prompt in Claude Code
6. Claude Code bouwt bestand voor bestand de complete site

## Output

Één markdown-bestand: `docs/NEW-CLIENT-PROMPT.md`

Structuur:
1. **Variabelen sectie** bovenaan — template voor gebruiker om in te vullen
2. **Instructies voor Claude Code** — volledig instructieset om de site te bouwen

---

## Input variabelen

De gebruiker vult bovenaan de prompt in:

**Bedrijfsgegevens:**
- Bedrijfsnaam
- Tagline (1 zin)
- Telefoon, e-mail
- Adres (straat, postcode, stad)
- KvK-nummer, BTW-nummer
- Openingstijden (7 dagen)
- Social URLs (FB, IG, LinkedIn)

**Branding:**
- Primaire kleur (hex)
- Secundaire accent kleur (hex)
- Donkere brand kleur (hex)
- Logo URL of "later via admin"

**Diensten (3-6 stuks):**
- Naam
- Slug
- Korte beschrijving
- Lucide-react icon naam

**USP's (4-6 kreten)**

**Garanties (3-5)**

**Statistieken (4 stuks):** label + getal + suffix

**Domein + SEO:** productie domein, 5-10 keywords, verzorgingsgebied

**API keys (env vars):**
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `SUPABASE_SERVICE_ROLE_KEY`
- `ANTHROPIC_API_KEY`
- `APIFY_TOKEN` (optioneel)

**Feature toggles:**
- Actievloeren — standaard **uit**
- Site-wachtwoord gate — standaard **uit**
- Promo popup — standaard **uit**
- Chatbot — standaard **aan**
- Announcement bar — standaard **aan**

---

## Features die in de gegenereerde site komen

### Publieke site

- **Homepage:** hero, USP badges, partners slider, diensten grid, stats counter, over-ons intro, reviews, showroom booking CTA, footer CTA's
- **Over ons:** hero, bedrijfsverhaal, stats, kernwaarden, CTA
- **Showroom:** hero, info (adres/uren/telefoon), Google Maps embed, afspraak booking form
- **Contact:** hero, contactgegevens, formulier, socials
- **Offerte:** multi-step formulier met serviceselectie, maten, opmerkingen
- **Projecten:** filter bar (dienst → merk), project cards met multi-image gallery lightbox
- **Product category pages:** per categorie (pvc-vloeren, traprenovatie, etc.)
- **Brand detail pages:** `/producten/[category]/[brand]` met producten grid + sfeerbeelden
- **Type filter pages (alleen gordijnen/raamdecoratie):** `/producten/[category]/type/[typeSlug]` toont merken die dat type aanbieden
- **Actievloeren (optioneel):** grid met korting-badges
- **Beleidspagina's:** `/beleid/[slug]` voor privacy, voorwaarden, cookies

### Admin panel

- **Dashboard** met stats
- **Projecten** CRUD met multi-image manager
- **Aanvragen** (offerteverzoeken) pipeline
- **Afspraken** agenda met kalenderweergave
- **Klanten** CRM
- **AI Kennisbank** voor chatbot context
- **Beleid & Pagina's** (privacybeleid, algemene voorwaarden, cookiebeleid, etc.)
- **Instellingen** met 6 tabs: Bedrijf, SEO, Chatbot, Popup, Balk, Wachtwoord (+ Actievloeren indien toggle aan)
- **Actievloeren (optioneel)** CRUD

### Techniek

- **Auth:** Supabase Auth met "eerste admin registreren" flow
- **AI chatbot:** Claude Haiku via `@anthropic-ai/sdk`, met kennisbank context
- **Afspraak tools:** `check_availability` en `create_appointment` tool calls voor de chatbot
- **Image upload:** sharp → WebP q85 → Supabase storage
- **Multi-image projecten:** JSONB `images` array, thumbnails + lightbox op publieke site
- **Facebook scrape script (optioneel):** `scripts/scrape-facebook-projects.ts` met Apify API
- **SEO:** metadata per pagina, sitemap, schema.org LocalBusiness JSON-LD
- **Cookiebanner:** GDPR-compliant banner met functioneel/analytisch/tracking differentiatie
- **Dynamic policies:** 3 beleid-templates worden automatisch geseed (privacy, voorwaarden, cookies)

### Database (Supabase)

Tabellen:
- `projects` (met images JSONB, fb_post_id, brand, brand_slug)
- `customers`
- `appointments`
- `offertes`
- `testimonials`
- `ai_kennisbank`
- `settings` (key/value JSON)
- `actievloeren` (alleen als toggle aan)

RLS: publieke leesrechten voor projects/testimonials/actievloeren/settings (waar relevant), authenticated users volledig toegang.

### Seed (via `npx tsx scripts/init-supabase.ts`)

- Alle tabellen + RLS policies
- Bedrijfsgegevens settings (uit prompt variabelen)
- 3 beleid-templates (Privacybeleid, Algemene Voorwaarden, Cookiebeleid)
- 5-10 AI kennisbank items afgestemd op diensten uit de prompt
- Chatbot system prompt template (gebaseerd op bedrijfsnaam + diensten)
- Announcement bar: uitgeschakeld, leeg (klant vult zelf)
- Popup: uitgeschakeld
- SEO settings (uit prompt variabelen)

**Niet** geseed:
- Projecten (klant voegt zelf toe)
- Reviews (klant voegt zelf toe)
- Actievloeren (klant voegt zelf toe)

---

## Design & styling

- **Volledig gelocked op deze site's look.** Geen flexibiliteit in layouts.
- **Alleen kleuren verschillen:** klant geeft 3 hex waarden, deze komen in `tailwind.config.ts` als `brand-primary`, `brand-secondary`, `brand-dark`.
- **Font:** Outfit (Google Font), zoals deze site.
- **Border radius:** `rounded-2xl` / `rounded-3xl` patronen blijven identiek.
- **Icons:** lucide-react (geen itshover in de nieuwe site — scheelt shadcn CLI installs).

---

## Niet in scope

- **Test coverage** — de prompt genereert een werkende site, maar geen test suite
- **CI/CD** — geen GitHub Actions templates
- **Vercel deploy** — gebruiker doet zelf via Vercel dashboard
- **Itshover icons** — alleen lucide-react (simpeler installatie)
- **Individuele product varianten per dessin (Invictus-style)** — Brand heeft wel `products: BrandProduct[]`, maar klant vult dit zelf aan via admin (of via Facebook scrape)
- **Custom product types beheren via admin** — hardcoded in data file zoals hier

---

## Structuur van het prompt-document

```markdown
# One-Shot Prompt: [Bedrijfsnaam] Website Generator

## Instructies voor gebruiker

1. Vul de variabelen in onder "INVOER"
2. Kopieer het volledige document naar Claude Code in een lege directory
3. Laat Claude Code de site bouwen (duurt 30-60 min)
4. Run `npx tsx scripts/init-supabase.ts` om de database te seeden
5. Run `npm run dev` om de site te starten

## INVOER — vul hieronder in

BEDRIJFSNAAM=...
PRIMAIRE_KLEUR=...
DIENSTEN=[...]
API_KEYS=[...]
FEATURE_TOGGLES=[...]

## INSTRUCTIES VOOR CLAUDE CODE

Je bent een Claude Code agent. Bouw een Next.js website op basis van de architectuur beschreven in deze prompt. Volg de instructies exact.

### Tech stack
- Next.js 16 App Router, TypeScript, Tailwind
- Supabase (@supabase/supabase-js), Anthropic SDK
- sharp, dotenv, tsx

### Setup stappen
1. Initialize project
2. Install dependencies
3. Tailwind config met brand kleuren
4. Create env file

### File-voor-file instructies
[per file: doel, structuur, code template]

### Database init script
[seed script implementatie]

### Publicatie checklist
[hoe klant deployen]
```

---

## Risico's

- **Lengte van de prompt** — dit wordt een zeer lang document (5000+ regels). Claude Code context moet groot genoeg zijn.
- **Onderhoud** — als deze source-site evolueert, moet de prompt bijgewerkt worden
- **API drift** — Next.js 16 features kunnen wijzigen, dan moet de prompt up-to-date blijven
- **Claude Code consistentie** — agent maakt mogelijk afwijkende keuzes ondanks instructies. Testen is essentieel.

## Success criteria

Na uitvoering van de prompt op een lege directory:
- [ ] `npm run dev` start zonder errors
- [ ] Homepage toont met alle secties + brand kleuren correct
- [ ] Admin login werkt (eerste admin registreren)
- [ ] Projecten toevoegen via admin werkt
- [ ] Chatbot werkt
- [ ] Offerte/contact formulier werkt
- [ ] TypeScript compileert clean
- [ ] Build slaagt (`npm run build`)
