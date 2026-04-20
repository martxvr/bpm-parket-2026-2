# Facebook Project Scrape & Project Gallery — Design Spec

## Doel

Eenmalig Facebook posts van `kunstgrasachterhoek.nl` scrapen via Apify, filteren op vloer/trap/raamdecoratie-gerelateerde posts (keyword match), alle foto's lokaal opslaan als WebP, en als projecten in de portfolio plaatsen. Daarnaast de admin-projectenpagina fixen zodat edit werkt en meerdere foto's per project ondersteund worden.

## Scope

### 1. Database wijzigingen

Nieuwe kolom op `projects` tabel:
- `images` JSONB — array van lokale image paden (eerste = hoofdafbeelding)
- `image_url` blijft bestaan (wordt automatisch de eerste uit `images` wanneer die array gevuld is)

Geen RLS wijzigingen — bestaand beleid blijft geldig.

### 2. Type + data layer

- `Project` interface (`src/types.ts`) krijgt `images?: string[]`
- `getProjects()` en `getProject()` in `src/lib/site-data.ts` mappen `images` mee
- Admin data functies in `src/lib/admin-data.ts` mappen `images` mee

### 3. Admin — Project edit fix

**Probleem:** `src/app/(admin)/admin/projecten/[id]/page.tsx` toont nu een leeg formulier in plaats van het bestaande project.

**Oplossing:**
- Haal het project op via `getProject(id)` met `params.id`
- Vul formulier met bestaande waarden
- Voeg een afbeeldingenbeheer-sectie toe: lijst van huidige foto's met verwijder-knoppen + upload voor nieuwe
- Verwijder een foto = `images` array updaten
- Upload nieuwe foto = WebP conversie + append aan `images`

**Server action update:**
- `saveProject` accepteert nu `images` array via form data
- Bij upload: converteer naar WebP, upload naar Supabase storage, append aan array
- `image_url` = `images[0]` (backwards compatibility)

### 4. Publieke kant — Gallery in ProjectDetail

**Bestand:** `src/components/ProjectDetail.tsx`

- Als `project.images.length > 1`: toon hoofdafbeelding + horizontale thumbnail-strip eronder
- Klik op thumbnail → swap hoofdafbeelding
- Klik op hoofdafbeelding → open lightbox met pijltjes (links/rechts) en keyboard navigatie (Escape, Arrow keys), zelfde patroon als brand detail page sfeerbeelden lightbox

### 5. Apify scrape script

**Locatie:** `scripts/scrape-facebook-projects.ts` (nieuwe map + bestand)

**Stappen:**

1. Roep Apify `apify/facebook-posts-scraper` actor aan via REST API met:
   - `startUrls`: `[{ url: "https://www.facebook.com/kunstgrasachterhoek.nl" }]`
   - `maxPosts`: 100
   - Wacht op completion, haal dataset op

2. Filter posts:
   - **Include:** post tekst bevat (case-insensitive) een van: `pvc`, `vloer`, `trap`, `gordijn`, `raamdec`, `tapijt`, `vloerbedekking`, `rolgordijn`, `vouwgordijn`, `jaloezie`, `duette`, `plissé`, `visgraat`, `laminaat`
   - **Exclude:** post tekst bevat (case-insensitive) `kunstgras`, `kunstmatig gras`, `hockey`, `voetbalveld`, `tuin kunstgras` EN geen van de include-keywords

3. Per gefilterde post:
   - Download alle `mediaUrl`/`images` parallel
   - Converteer naar WebP quality 85 met `cwebp` (of gebruik `sharp` als cwebp niet beschikbaar)
   - Opslaan in `public/images/projects/fb-[postId]/[index].webp`
   - **Titel:** eerste 50-60 tekens van post tekst (bij spatie afkappen)
   - **Beschrijving:** volledige post tekst
   - **Category:** auto-detecteer uit keywords:
     - `trap` → `traprenovatie`
     - `gordijn`/`rolgordijn`/`vouwgordijn` → `gordijnen`
     - `jaloezie`/`raamdec`/`duette`/`plissé` → `raamdecoratie`
     - `tapijt`/`vloerbedekking` → `vloerbedekking`
     - `pvc`/`vloer`/`visgraat` (default) → `pvc-vloeren`
   - **Date:** post timestamp
   - **Location:** `Achterhoek` (default) — Facebook location veld meenemen als aanwezig
   - Insert in Supabase met `images: [paden...]` en `image_url: images[0]`

4. Script output: aantal gescraped, gefilterd, geïmporteerd, eventuele errors

## Technische overwegingen

- **Apify API**: gebruik direct REST (`POST /v2/acts/apify~facebook-posts-scraper/runs`) met token in env
- **Image compressie**: WebP quality 85 is visueel verliesvrij en ~30-50% kleiner dan JPEG
- **Duplicate detectie**: check op Facebook post ID voordat we inserten (voorkomen dat re-runs duplicaten maken) — `fb_post_id` kolom toevoegen
- **Rate limits**: download foto's met kleine delay (100ms) om Facebook CDN niet te overbelasten

## Niet in scope

- AI classificatie (keyword match is genoeg voor MVP)
- Handmatige review in admin (direct publiceren, user verwijdert later)
- Terugkerende scrape of admin-knop (eenmalig script)
- Facebook video scraping (alleen image posts)
