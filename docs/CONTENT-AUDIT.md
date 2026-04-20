# Website Content Audit

Een overzicht van alle content die nog aangepast/ingevuld moet worden op de website.

Sommige dingen kun je **zelf aanpassen via de admin** (`/admin`). Andere dingen staan nog **hardcoded in de code** en vereisen een kleine technische aanpassing.

---

## Deel 1: Dingen die je ZELF kunt aanpassen in de admin

### 1. Bedrijfsgegevens

**Waar:** Admin → Instellingen → Bedrijf

Vul deze in zodat ze door de hele website worden gebruikt (footer, contactpagina, showroom, chatbot, etc.):
- Bedrijfsnaam
- Adres, postcode, stad
- Telefoonnummer
- E-mailadres
- KvK-nummer
- BTW-nummer

### 2. SEO (Zoekmachineoptimalisatie)

**Waar:** Admin → Instellingen → SEO

- Meta titel (wat er in Google staat)
- Meta beschrijving
- Keywords
- Google Search Console verificatiecode

### 3. Chatbot

**Waar:** Admin → Instellingen → Chatbot

- Welkomstbericht
- Extra instructies voor de AI (bijvoorbeeld: "altijd de klant vragen om te bellen bij prijsvragen")
- Aan/uit zetten

### 4. Popup

**Waar:** Admin → Instellingen → Popup

- Titel en tekst van de popup die bezoekers zien
- Positie (midden, linksonder, rechtsonder)
- Aan/uit

### 5. Aankondigingsbalk (boven navigatie)

**Waar:** Admin → Instellingen → Balk

- Meerdere teksten die roteren (bijvoorbeeld aanbiedingen)
- Achtergrondkleur

### 6. Site-breed wachtwoord

**Waar:** Admin → Instellingen → Wachtwoord

Voor als de site nog niet publiek moet zijn.

### 7. Projecten (Portfolio)

**Waar:** Admin → Projecten

Voeg eigen projecten toe met foto, titel, categorie, merk, locatie, oppervlakte, beschrijving.

**Huidig:** 8 voorbeeldprojecten staan erin — vervang deze door echte projecten.

### 8. Reviews

**Waar:** Admin → (via de reviews admin — `/admin/reviews`)

**Huidig:** 10 voorbeeldreviews staan erin — vervang deze door echte klantreviews.

### 9. Fotogalerij (algemene sfeer/foto's)

**Waar:** Admin → Galerij

Upload losse projectfoto's en sfeerbeelden.

### 10. Sfeerbeelden per pagina

**Waar:** Admin → Sfeerbeelden

Koppel sfeerbeelden aan specifieke pagina's (homepage, showroom, over-ons, etc.).

### 11. Actievloeren

**Waar:** Admin → Actievloeren

Voeg vloeren in de aanbieding toe met kortingspercentage.

### 12. AI Kennisbank

**Waar:** Admin → AI Kennisbank

Voeg FAQ-items toe waar de chatbot uit kan putten.

### 13. Beleidspagina's en losse pagina's

**Waar:** Admin → Beleid & Pagina's

Privacybeleid, algemene voorwaarden, cookiestatement, etc.

### 14. Afspraken

**Waar:** Admin → Agenda

Bekijk alle showroomafspraken.

### 15. Offerte-aanvragen

**Waar:** Admin → Offerte aanvragen

Bekijk binnenkomende offerte-aanvragen.

### 16. Klanten

**Waar:** Admin → Klanten

CRM met klantgegevens.

---

## Deel 2: Stock/dummy afbeeldingen in de merkendata

Deze merken hebben nog Unsplash-stockfoto's. Ideaal is echte productfoto's van de leveranciers gebruiken.

### Merken met Unsplash sfeerbeelden (3 per merk)

- **Gerflor** (PVC Vloeren)
- **Castell** (PVC Vloeren)
- **HyWood (by Ter Hürne)** (Houten Vloeren)

### Merken met Unsplash productfoto's

- **Gerflor** — Creation 30 en Creation 55 collecties
- **HyWood** — Classic, Noblesse en Visgraat collecties

**Actie:** Download echte product- en sfeerbeelden bij de leveranciers en vervang de Unsplash-afbeeldingen. Dit vereist een kleine code-aanpassing.

---

## Deel 3: Generieke beschrijvingen

Deze merken/producten hebben korte of sjabloonmatige beschrijvingen die uitgebreid kunnen worden:

- **IPC Flooring** — Nature collectie (~6 producten met erg korte beschrijvingen zoals "Warme mediterrane tint...")

**Actie:** Schrijf langere, verkoopgerichte productbeschrijvingen.

---

## Deel 4: Dingen die HARDCODED in de code staan

Deze teksten en instellingen kunnen nu nog NIET via de admin aangepast worden. Hiervoor is een kleine technische aanpassing nodig:

### Homepage (HomePageClient.tsx)

- **Hero-titel:** "Vakmanschap in Vloeren & Interieur"
- **Hero-beschrijving:** "Dé specialist in PVC-vloeren..."
- **USP badges:** "20+ jaar ervaring", "50+ tevreden klanten", "Gratis advies"
- **Statistieken:** 20+ jaar, 100% maatwerk, 50+ klanten
- **5 service-kaarten** (PVC, Traprenovatie, etc. — met titels en beschrijvingen)

### Over Ons pagina

- **Hero-kop:** "Vakmanschap uit Doetinchem"
- **Volledige bedrijfsverhaal** (enkele alinea's)
- **Statistieken:** 20 jaar ervaring, 500 klanten, 100 producten, 150 projecten per jaar

### Showroom pagina

- **Hero-beschrijving:** "Kom langs in Doetinchem en laat u inspireren..."
- **Google Maps adres** (staat in iframe URL)

### Contact pagina

- **Hero-kop:** "Laten we uw interieur transformeren"
- **Sectie-teksten** bij het contactformulier

### Footer

- **CTA tekst:** "Uw interieur, ons vakmanschap."
- **"Vrijblijvende offerte binnen 24 uur"**
- **Menu structuur** (Over ons, Showroom, Projecten, Contact)
- **"Wij werken uitsluitend met premium merken..."**

### Navbar (menu)

- Alle menu-items (Over ons, Showroom, Projecten, Contact)
- Actievloeren link

### Openingstijden (config.ts)

Staan nu hardcoded in de code, maar zouden via `Admin → Instellingen → Bedrijf` bewerkbaar moeten zijn.

### Social media links

Facebook, Instagram, LinkedIn — zijn placeholders (`#`). Moeten ingevuld worden.

### Houten Vloeren, Raamdecoratie categorieën

Deze categorieën hebben nog weinig of geen echte merkdata.

---

## Snelle actielijst voor de eigenaar

**Wat je direct kunt doen (via admin):**

1. Log in op `/admin` met je account
2. Ga naar **Instellingen → Bedrijf** en vul alle bedrijfsgegevens in
3. Ga naar **Instellingen → SEO** en vul de SEO-gegevens in
4. Ga naar **Projecten** → verwijder de 8 voorbeelden en voeg eigen projecten toe
5. Ga naar **Reviews** → verwijder de 10 voorbeelden en voeg echte reviews toe
6. Ga naar **Instellingen → Popup** als je een actie-popup wilt tonen
7. Ga naar **Instellingen → Balk** voor een aankondigingsbalk boven de site

**Wat de ontwikkelaar nog moet aanpassen:**

1. Social media links invullen (Facebook/Instagram/LinkedIn)
2. Stockfoto's vervangen door echte productfoto's bij Gerflor, Castell, HyWood
3. IPC Nature productbeschrijvingen uitbreiden
4. (Optioneel) Homepage hero-teksten, Over Ons tekst, en statistieken bewerkbaar maken via de admin
