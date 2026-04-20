// ============================================================
// Brand & Category Data
// ============================================================

export type Brand = {
  name: string;
  slug: string;
  logoUrl: string;
  website?: string;
  description: string;
  shortDescription: string;
  featured: boolean;
  materials: string[];
  moodImages?: string[];
  products: BrandProduct[];
};

export type BrandProduct = {
  name: string;
  slug: string;
  description: string;
  imageUrl?: string;
  specs: Record<string, string>;
};

export type RaamdecoratieType = {
  name: string;
  slug: string;
  description: string;
  imageUrl?: string;
  materials: string[];
  specs?: Record<string, string>;
};

export type Category = {
  name: string;
  slug: string;
  description: string;
  imageUrl: string;
  icon: string; // lucide icon name
  brands: Brand[];
  raamdecoratieTypes?: RaamdecoratieType[];
};

// ────────────────────────────────────────────
// PVC Vloeren Merken
// ────────────────────────────────────────────

const pvcBrands: Brand[] = [
  {
    name: 'Rivièra Maison Flooring',
    slug: 'riviera-maison-flooring',
    logoUrl: 'https://rivieramaisonflooring.com/wp-content/uploads/2025/02/LOGO_Riviera_Maison_Flooring-1.svg',
    website: 'https://rivieramaisonflooring.com',
    description: 'De Long Island Collection — Premium Dryback (plak) PVC. Geïnspireerd op de sfeer van Long Island, New York. Gold line kwaliteit. TÜV gecertificeerd. Elke kleur beschikbaar als Longboard (1524×230 mm) én Visgraat (770×154 mm).',
    shortDescription: 'Premium Dryback PVC. Geïnspireerd op Long Island, New York.',
    featured: true,
    materials: ['PVC'],
    moodImages: [
      '/images/brands/riviera-maison/mood-1.webp',
      '/images/brands/riviera-maison/mood-2.webp',
      '/images/brands/riviera-maison/mood-3.webp',
      '/images/brands/riviera-maison/mood-4.webp'
    ],
    products: [
      {
        name: 'Long Beach Sand',
        slug: 'long-beach-sand',
        description: 'De warme, zandkleurige tinten van deze vloer brengen een ontspannen en natuurlijke sfeer in huis. Geïnspireerd door de zonovergoten stranden, straalt Long Beach Sand een zachte, organische warmte uit die elke ruimte een uitnodigende charme geeft.',
        imageUrl: '/images/brands/riviera-maison/long-beach-sand.webp',
        specs: { 'Longboard': '1524 × 230 mm', 'Visgraat': '770 × 154 mm', 'Dikte': '2,5 mm', 'Topslijtlaag': '0,55 mm + 2 keramische laklagen', 'Legsysteem': 'Dryback (verlijmd)', 'Vloerverwarming': 'Ja', 'Gebruiksklasse': '23/33' }
      },
      {
        name: 'Hempstead Grey',
        slug: 'hempstead-grey',
        description: 'Een verfijnde, zachte grijstint met warme ondertonen die een subtiele elegantie uitstraalt. De rustieke uitstraling van verweerd hout wordt gecombineerd met een moderne twist, waardoor deze vloer perfect is voor een tijdloos interieur met karakter.',
        imageUrl: '/images/brands/riviera-maison/hempstead-grey.webp',
        specs: { 'Longboard': '1524 × 230 mm', 'Visgraat': '770 × 154 mm', 'Dikte': '2,5 mm', 'Topslijtlaag': '0,55 mm + 2 keramische laklagen', 'Legsysteem': 'Dryback (verlijmd)', 'Vloerverwarming': 'Ja', 'Gebruiksklasse': '23/33' }
      },
      {
        name: 'Bayville Wood',
        slug: 'bayville-wood',
        description: 'Met zijn natuurlijke houtkleur en subtiele nerftekeningen brengt Bayville Wood een harmonieuze en evenwichtige uitstraling. De warme beige tinten zorgen voor een serene en tijdloze basis, ideaal voor een interieur met een verfijnde en pure uitstraling.',
        imageUrl: '/images/brands/riviera-maison/bayville-wood.webp',
        specs: { 'Longboard': '1524 × 230 mm', 'Visgraat': '770 × 154 mm', 'Dikte': '2,5 mm', 'Topslijtlaag': '0,55 mm + 2 keramische laklagen', 'Legsysteem': 'Dryback (verlijmd)', 'Vloerverwarming': 'Ja', 'Gebruiksklasse': '23/33' }
      },
      {
        name: 'Gibson Beach',
        slug: 'gibson-beach',
        description: 'Licht van kleur maar met een subtiele warme gloed die een gevoel van rust en openheid creëert. Gibson Beach ademt een luxe eenvoud uit en laat zich moeiteloos combineren met zowel klassieke als moderne interieurs.',
        imageUrl: '/images/brands/riviera-maison/gibson-beach.webp',
        specs: { 'Longboard': '1524 × 230 mm', 'Visgraat': '770 × 154 mm', 'Dikte': '2,5 mm', 'Topslijtlaag': '0,55 mm + 2 keramische laklagen', 'Legsysteem': 'Dryback (verlijmd)', 'Vloerverwarming': 'Ja', 'Gebruiksklasse': '23/33' }
      },
      {
        name: 'Riverside Oak',
        slug: 'riverside-oak',
        description: 'Een diepe, warme bruintint met een rijke houtstructuur die klasse en warmte toevoegt aan iedere ruimte. De donkere schakeringen en levendige nerven geven Riverside Oak een chique en natuurlijke uitstraling, ideaal voor een elegant en sfeervol interieur.',
        imageUrl: '/images/brands/riviera-maison/riverside-oak.webp',
        specs: { 'Longboard': '1524 × 230 mm', 'Visgraat': '770 × 154 mm', 'Dikte': '2,5 mm', 'Topslijtlaag': '0,55 mm + 2 keramische laklagen', 'Legsysteem': 'Dryback (verlijmd)', 'Vloerverwarming': 'Ja', 'Gebruiksklasse': '23/33' }
      },
      {
        name: 'Montauk Dark',
        slug: 'montauk-dark',
        description: 'Stoer, karaktervol en mysterieus. Montauk Dark combineert diepe houttonen met een verfijnde nerf-structuur, waardoor de vloer een zeer luxueuze uitstraling krijgt. Perfect voor wie op zoek is naar een krachtige en stijlvolle basis in het interieur.',
        imageUrl: '/images/brands/riviera-maison/montauk-dark.webp',
        specs: { 'Longboard': '1524 × 230 mm', 'Visgraat': '770 × 154 mm', 'Dikte': '2,5 mm', 'Topslijtlaag': '0,55 mm + 2 keramische laklagen', 'Legsysteem': 'Dryback (verlijmd)', 'Vloerverwarming': 'Ja', 'Gebruiksklasse': '23/33' }
      }
    ]
  },
  {
    name: 'The Art of Living',
    slug: 'the-art-of-living',
    logoUrl: 'https://flooring.theartofliving.eu/wp-content/uploads/2023/07/cropped-cropped-TAOL-Luxury-Vinyl-Flooring_goud-wit.png',
    website: 'https://www.theartofliving-flooring.com',
    description: 'Gecertificeerde virgin PVC vloer. 100% veilig voor mens en natuur. Dryback systeem. Matte finish, nauwelijks van echt hout te onderscheiden. Drie sorteringen: Rustique (karakter en rustieke look), Select (chique met subtiele knoesten) en Premier (elegant, rustig en verfijnd).',
    shortDescription: 'Gecertificeerde virgin PVC. Matte finish, nauwelijks van echt hout te onderscheiden.',
    featured: false,
    materials: ['PVC'],
    moodImages: [
      '/images/brands/art-of-living/sfeer-taol-01.webp',
      '/images/brands/art-of-living/sfeer-taol-02.webp',
      '/images/brands/art-of-living/sfeer-taol-03.webp',
      '/images/brands/art-of-living/sfeer-taol-04.webp',
      '/images/brands/art-of-living/sfeer-taol-05.webp',
      '/images/brands/art-of-living/sfeer-taol-06.webp',
      '/images/brands/art-of-living/sfeer-taol-07.webp',
      '/images/brands/art-of-living/sfeer-taol-08.webp',
    ],
    products: [
      {
        name: 'Rustique — Amber',
        slug: 'rustique-amber',
        description: 'Stoere vloer in zachte kleur met levendige noesten en diepe reliëfstructuur. Rustique Amber combineert karakter en warmte — perfect voor een authentiek interieur met een rustieke uitstraling.',
        imageUrl: '/images/brands/art-of-living/rustique-amber.webp',
        specs: { 'Sortering': 'Rustique', 'Elegante Planken': '1219,2 × 228,6 mm', 'Visgraat': '765 × 153 mm', 'Dikte': '2,5 mm', 'Topslijtlaag': '0,55 mm', 'Legsysteem': 'Dryback (verlijmd)', 'Garantie': '20 jaar' }
      },
      {
        name: 'Rustique — Natural',
        slug: 'rustique-natural',
        description: 'Authentiek en tijdloos. De naturaltint van Rustique Natural brengt de eerlijke schoonheid van hout naar binnen, met expressieve nerven en knoesten voor een stoer en karaktervol interieur.',
        imageUrl: '/images/brands/art-of-living/rustique-natural.webp',
        specs: { 'Sortering': 'Rustique', 'Elegante Planken': '1219,2 × 228,6 mm', 'Visgraat': '765 × 153 mm', 'Dikte': '2,5 mm', 'Topslijtlaag': '0,55 mm', 'Legsysteem': 'Dryback (verlijmd)', 'Garantie': '20 jaar' }
      },
      {
        name: 'Select — Black',
        slug: 'select-black',
        description: 'Helemaal trendy. Select Black is de gedurfde keuze voor wie een statement wil maken — diepzwart met subtiele nerftekeningen voor een strak en eigentijds interieur.',
        imageUrl: '/images/brands/art-of-living/select-black.webp',
        specs: { 'Sortering': 'Select', 'Elegante Planken': '1219,2 × 228,6 mm', 'Visgraat': '765 × 153 mm', 'Dikte': '2,5 mm', 'Topslijtlaag': '0,55 mm', 'Legsysteem': 'Dryback (verlijmd)', 'Garantie': '20 jaar' }
      },
      {
        name: 'Select — Brown',
        slug: 'select-brown',
        description: 'Pure verfijning. Select Brown biedt het ultieme evenwicht tussen stoer en chic — warme bruintinten met minimale knoesten voor een rustig en stijlvol interieur.',
        imageUrl: '/images/brands/art-of-living/select-brown.webp',
        specs: { 'Sortering': 'Select', 'Elegante Planken': '1219,2 × 228,6 mm', 'Visgraat': '765 × 153 mm', 'Dikte': '2,5 mm', 'Topslijtlaag': '0,55 mm', 'Legsysteem': 'Dryback (verlijmd)', 'Garantie': '20 jaar' }
      },
      {
        name: 'Select — Dark Brown',
        slug: 'select-dark-brown',
        description: 'Diepte en warmte. Select Dark Brown straalt klasse uit met zijn diepe bruintinten en subtiele houtstructuur — ideaal voor wie een rijke, sfeervol interieur ambieert.',
        imageUrl: '/images/brands/art-of-living/select-dark-brown.webp',
        specs: { 'Sortering': 'Select', 'Elegante Planken': '1219,2 × 228,6 mm', 'Visgraat': '765 × 153 mm', 'Dikte': '2,5 mm', 'Topslijtlaag': '0,55 mm', 'Legsysteem': 'Dryback (verlijmd)', 'Garantie': '20 jaar' }
      },
      {
        name: 'Select — Honey',
        slug: 'select-honey',
        description: 'Zacht en tijdloos. Select Honey combineert chique met een warme honingtint — een lichte, verzorgde uitstraling die elke ruimte een open en uitnodigend karakter geeft.',
        imageUrl: '/images/brands/art-of-living/select-honey.webp',
        specs: { 'Sortering': 'Select', 'Elegante Planken': '1219,2 × 228,6 mm', 'Visgraat': '765 × 153 mm', 'Dikte': '2,5 mm', 'Topslijtlaag': '0,55 mm', 'Legsysteem': 'Dryback (verlijmd)', 'Garantie': '20 jaar' }
      },
      {
        name: 'Premier — Light Natural',
        slug: 'premier-light-natural',
        description: 'Voor een frisse look. Premier Light Natural brengt een heldere, luchtige sfeer met zachte houtlijnen en een tijdloze elegantie die moeiteloos past in elk modern interieur.',
        imageUrl: '/images/brands/art-of-living/premier-light-natural.webp',
        specs: { 'Sortering': 'Premier', 'Elegante Planken': '1219,2 × 228,6 mm', 'Visgraat': '765 × 153 mm', 'Dikte': '2,5 mm', 'Topslijtlaag': '0,55 mm', 'Legsysteem': 'Dryback (verlijmd)', 'Garantie': '20 jaar' }
      },
      {
        name: 'Premier — Natural',
        slug: 'premier-natural',
        description: 'Een klassieker. Premier Natural is de tijdloze keuze — een warme, evenwichtige houtkleur met strakke lijnen die rust en verfijning uitstraalt in elk interieur.',
        imageUrl: '/images/brands/art-of-living/premier-natural.webp',
        specs: { 'Sortering': 'Premier', 'Elegante Planken': '1219,2 × 228,6 mm', 'Visgraat': '765 × 153 mm', 'Dikte': '2,5 mm', 'Topslijtlaag': '0,55 mm', 'Legsysteem': 'Dryback (verlijmd)', 'Garantie': '20 jaar' }
      },
      {
        name: 'Premier — Dark Natural',
        slug: 'premier-dark-natural',
        description: 'Extra warm en chic. Premier Dark Natural geeft iedere ruimte een warme diepte — rijke houtkleur met verfijnde tekeningen die een gevoel van luxe en geborgenheid creëert.',
        imageUrl: '/images/brands/art-of-living/premier-dark-natural.webp',
        specs: { 'Sortering': 'Premier', 'Elegante Planken': '1219,2 × 228,6 mm', 'Visgraat': '765 × 153 mm', 'Dikte': '2,5 mm', 'Topslijtlaag': '0,55 mm', 'Legsysteem': 'Dryback (verlijmd)', 'Garantie': '20 jaar' }
      },
      {
        name: 'Premier — Light Beige',
        slug: 'premier-light-beige',
        description: 'Helemaal met de tijd mee. Premier Light Beige is een lichte, serene kleur die rust en ruimte uitstraalt — de perfecte neutrale basis voor een eigentijds en elegant interieur.',
        imageUrl: '/images/brands/art-of-living/premier-light-beige.webp',
        specs: { 'Sortering': 'Premier', 'Elegante Planken': '1219,2 × 228,6 mm', 'Visgraat': '765 × 153 mm', 'Dikte': '2,5 mm', 'Topslijtlaag': '0,55 mm', 'Legsysteem': 'Dryback (verlijmd)', 'Garantie': '20 jaar' }
      },
      {
        name: 'Premier — Beige',
        slug: 'premier-beige',
        description: 'Elegant, sereen, veelzijdig. Premier Beige is de veelzijdige keuze die naadloos samengaat met elk kleurenpalet — tijdloze warme tint die rust en klasse uitstraalt.',
        imageUrl: '/images/brands/art-of-living/premier-beige.webp',
        specs: { 'Sortering': 'Premier', 'Elegante Planken': '1219,2 × 228,6 mm', 'Visgraat': '765 × 153 mm', 'Dikte': '2,5 mm', 'Topslijtlaag': '0,55 mm', 'Legsysteem': 'Dryback (verlijmd)', 'Garantie': '20 jaar' }
      },
      {
        name: 'Premier — Dark Beige',
        slug: 'premier-dark-beige',
        description: 'Zachte warme uitstraling. Premier Dark Beige combineert elegantie met diepte — een rijke beige tint die warmte en luxe toevoegt aan elk verfijnd interieur.',
        imageUrl: '/images/brands/art-of-living/premier-dark-beige.webp',
        specs: { 'Sortering': 'Premier', 'Elegante Planken': '1219,2 × 228,6 mm', 'Visgraat': '765 × 153 mm', 'Dikte': '2,5 mm', 'Topslijtlaag': '0,55 mm', 'Legsysteem': 'Dryback (verlijmd)', 'Garantie': '20 jaar' }
      }
    ]
  },
  {
    name: 'IPC Flooring',
    slug: 'ipc-flooring',
    logoUrl: 'https://ipcvloeren.nl/wp-content/uploads/2020/11/ipc-2020.png',
    website: 'https://ipcvloeren.nl',
    description: 'Duits merk. De veiligste PVC vloer op de markt. TÜV getest. Proficert Premium keurmerk. Vrij van ftalaten, formaldehyde en zware metalen. 9 keurmerken. Biologische weekmakers. Collecties: Nature, Opal Visgraat, Opal XXL Plank, Hongaarse Punt, Tiles, Ceramic Touch 30 en Ceramic Touch 55.',
    shortDescription: 'De veiligste PVC vloer. TÜV getest. 9 keurmerken. Biologische weekmakers.',
    featured: true,
    materials: ['PVC'],
    moodImages: [
      '/images/brands/ipc/mood-1.webp',
      '/images/brands/ipc/mood-2.webp',
      '/images/brands/ipc/mood-3.webp',
      '/images/brands/ipc/mood-4.webp'
    ],
    products: [
      // ── NATURE COLLECTIE (8 kleuren) ──
      {
        name: 'Nature — Porto',
        slug: 'nature-porto',
        description: '8 nieuwe kleurtinten met 0,55 mm topslijtlaag + 2 keramische laklagen. Minder krasgevoelig, prachtige matte uitstraling.',
        imageUrl: '/images/brands/ipc/nature-porto.webp',
        specs: { 'Collectie': 'Nature', 'Topslijtlaag': '0,55 mm + 2 keramische laklagen', 'Legsysteem': 'Dryback & Click', 'Garantie wonen': '15 jaar', 'Garantie project': '10 jaar' }
      },
      {
        name: 'Nature — Nizza',
        slug: 'nature-nizza',
        description: 'Aantrekkelijk geprijsd met topkwaliteit bescherming.',
        imageUrl: '/images/brands/ipc/nature-nizza.webp',
        specs: { 'Collectie': 'Nature', 'Topslijtlaag': '0,55 mm + 2 keramische laklagen', 'Legsysteem': 'Dryback & Click', 'Garantie wonen': '15 jaar', 'Garantie project': '10 jaar' }
      },
      {
        name: 'Nature — Sevilla',
        slug: 'nature-sevilla',
        description: 'Warme mediterrane tint uit de Nature collectie.',
        imageUrl: '/images/brands/ipc/nature-sevilla.webp',
        specs: { 'Collectie': 'Nature', 'Topslijtlaag': '0,55 mm + 2 keramische laklagen', 'Legsysteem': 'Dryback & Click', 'Garantie wonen': '15 jaar', 'Garantie project': '10 jaar' }
      },
      {
        name: 'Nature — Malaga',
        slug: 'nature-malaga',
        description: 'Stijlvolle kleur met keramische bescherming.',
        imageUrl: '/images/brands/ipc/nature-malaga.webp',
        specs: { 'Collectie': 'Nature', 'Topslijtlaag': '0,55 mm + 2 keramische laklagen', 'Legsysteem': 'Dryback & Click', 'Garantie wonen': '15 jaar', 'Garantie project': '10 jaar' }
      },
      {
        name: 'Nature — Capri',
        slug: 'nature-capri',
        description: 'Frisse tint geïnspireerd door de Italiaanse kust.',
        imageUrl: '/images/brands/ipc/nature-capri.webp',
        specs: { 'Collectie': 'Nature', 'Topslijtlaag': '0,55 mm + 2 keramische laklagen', 'Legsysteem': 'Dryback & Click', 'Garantie wonen': '15 jaar', 'Garantie project': '10 jaar' }
      },
      {
        name: 'Nature — Florenz',
        slug: 'nature-florenz',
        description: 'Elegante kleur uit het hart van Toscane.',
        imageUrl: '/images/brands/ipc/nature-florenz.webp',
        specs: { 'Collectie': 'Nature', 'Topslijtlaag': '0,55 mm + 2 keramische laklagen', 'Legsysteem': 'Dryback & Click', 'Garantie wonen': '15 jaar', 'Garantie project': '10 jaar' }
      },
      {
        name: 'Nature — Milano',
        slug: 'nature-milano',
        description: 'Verfijnde, moderne kleur.',
        imageUrl: '/images/brands/ipc/nature-milano.webp',
        specs: { 'Collectie': 'Nature', 'Topslijtlaag': '0,55 mm + 2 keramische laklagen', 'Legsysteem': 'Dryback & Click', 'Garantie wonen': '15 jaar', 'Garantie project': '10 jaar' }
      },
      {
        name: 'Nature — Madrid',
        slug: 'nature-madrid',
        description: 'Warme, tijdloze uitstraling.',
        imageUrl: '/images/brands/ipc/nature-madrid.webp',
        specs: { 'Collectie': 'Nature', 'Topslijtlaag': '0,55 mm + 2 keramische laklagen', 'Legsysteem': 'Dryback & Click', 'Garantie wonen': '15 jaar', 'Garantie project': '10 jaar' }
      },
      // ── OPAL COLLECTIE — VISGRAAT (XS) ──
      {
        name: 'Opal Visgraat — Zen',
        slug: 'opal-zen-visgraat',
        description: 'Eiken look, bijna niet van echt hout te onderscheiden. Visgraat formaat.',
        imageUrl: '/images/brands/ipc/opal-vg-zen.webp',
        specs: { 'Collectie': 'Opal', 'Variant': 'Visgraat (XS)', 'Afmetingen': '77 × 15,4 cm', 'Dikte': '2,5 mm', 'Topslijtlaag': '0,55 mm + 2 keramische laklagen', 'Legsysteem': 'Dryback' }
      },
      {
        name: 'Opal Visgraat — Delft',
        slug: 'opal-delft-visgraat',
        description: 'Stijlvolle eiken look in visgraat.',
        imageUrl: '/images/brands/ipc/opal-vg-delft.webp',
        specs: { 'Collectie': 'Opal', 'Variant': 'Visgraat (XS)', 'Afmetingen': '77 × 15,4 cm', 'Dikte': '2,5 mm', 'Topslijtlaag': '0,55 mm + 2 keramische laklagen', 'Legsysteem': 'Dryback' }
      },
      {
        name: 'Opal Visgraat — Den Bosch',
        slug: 'opal-den-bosch-visgraat',
        description: 'Warme eiken tint in visgraat formaat.',
        imageUrl: '/images/brands/ipc/opal-vg-den-bosch.webp',
        specs: { 'Collectie': 'Opal', 'Variant': 'Visgraat (XS)', 'Afmetingen': '77 × 15,4 cm', 'Dikte': '2,5 mm', 'Topslijtlaag': '0,55 mm + 2 keramische laklagen', 'Legsysteem': 'Dryback' }
      },
      {
        name: 'Opal Visgraat — Maastricht',
        slug: 'opal-maastricht-visgraat',
        description: 'Natuurlijke tint met karakter.',
        imageUrl: '/images/brands/ipc/opal-vg-maastricht.webp',
        specs: { 'Collectie': 'Opal', 'Variant': 'Visgraat (XS)', 'Afmetingen': '77 × 15,4 cm', 'Dikte': '2,5 mm', 'Topslijtlaag': '0,55 mm + 2 keramische laklagen', 'Legsysteem': 'Dryback' }
      },
      {
        name: 'Opal Visgraat — Deventer',
        slug: 'opal-deventer-visgraat',
        description: 'Rustige eiken uitstraling.',
        imageUrl: '/images/brands/ipc/opal-vg-deventer.webp',
        specs: { 'Collectie': 'Opal', 'Variant': 'Visgraat (XS)', 'Afmetingen': '77 × 15,4 cm', 'Dikte': '2,5 mm', 'Topslijtlaag': '0,55 mm + 2 keramische laklagen', 'Legsysteem': 'Dryback' }
      },
      {
        name: 'Opal Visgraat — Amsterdam',
        slug: 'opal-amsterdam-visgraat',
        description: 'Moderne eiken look in visgraat.',
        imageUrl: '/images/brands/ipc/opal-vg-amsterdam.webp',
        specs: { 'Collectie': 'Opal', 'Variant': 'Visgraat (XS)', 'Afmetingen': '77 × 15,4 cm', 'Dikte': '2,5 mm', 'Topslijtlaag': '0,55 mm + 2 keramische laklagen', 'Legsysteem': 'Dryback' }
      },
      {
        name: 'Opal Visgraat — Alkmaar',
        slug: 'opal-alkmaar-visgraat',
        description: 'Lichte eiken tint in visgraat.',
        imageUrl: '/images/brands/ipc/opal-vg-alkmaar.webp',
        specs: { 'Collectie': 'Opal', 'Variant': 'Visgraat (XS)', 'Afmetingen': '77 × 15,4 cm', 'Dikte': '2,5 mm', 'Topslijtlaag': '0,55 mm + 2 keramische laklagen', 'Legsysteem': 'Dryback' }
      },
      {
        name: 'Opal Visgraat — Utrecht',
        slug: 'opal-utrecht-visgraat',
        description: 'Klassieke eiken uitstraling in visgraat.',
        imageUrl: '/images/brands/ipc/opal-vg-utrecht.webp',
        specs: { 'Collectie': 'Opal', 'Variant': 'Visgraat (XS)', 'Afmetingen': '77 × 15,4 cm', 'Dikte': '2,5 mm', 'Topslijtlaag': '0,55 mm + 2 keramische laklagen', 'Legsysteem': 'Dryback' }
      },
      // ── OPAL COLLECTIE — PLANKEN (XXL) ──
      {
        name: 'Opal XXL Plank — Delft',
        slug: 'opal-delft-xxl',
        description: 'Extra brede en lange plank in eiken look.',
        imageUrl: '/images/brands/ipc/opal-xxl-delft.webp',
        specs: { 'Collectie': 'Opal', 'Variant': 'XXL Plank', 'Afmetingen': '152 × 23,8 cm', 'Dikte': '2,5 mm', 'Topslijtlaag': '0,55 mm + 2 keramische laklagen', 'Legsysteem': 'Dryback' }
      },
      {
        name: 'Opal XXL Plank — Den Bosch',
        slug: 'opal-den-bosch-xxl',
        description: 'Warme brede plank.',
        imageUrl: '/images/brands/ipc/opal-xxl-den-bosch.webp',
        specs: { 'Collectie': 'Opal', 'Variant': 'XXL Plank', 'Afmetingen': '152 × 23,8 cm', 'Dikte': '2,5 mm', 'Topslijtlaag': '0,55 mm + 2 keramische laklagen', 'Legsysteem': 'Dryback' }
      },
      {
        name: 'Opal XXL Plank — Maastricht',
        slug: 'opal-maastricht-xxl',
        description: 'Natuurlijk ogende brede plank.',
        imageUrl: '/images/brands/ipc/opal-xxl-maastricht.webp',
        specs: { 'Collectie': 'Opal', 'Variant': 'XXL Plank', 'Afmetingen': '152 × 23,8 cm', 'Dikte': '2,5 mm', 'Topslijtlaag': '0,55 mm + 2 keramische laklagen', 'Legsysteem': 'Dryback' }
      },
      {
        name: 'Opal XXL Plank — Deventer',
        slug: 'opal-deventer-xxl',
        description: 'Rustige brede plank in eiken.',
        imageUrl: '/images/brands/ipc/opal-xxl-deventer.webp',
        specs: { 'Collectie': 'Opal', 'Variant': 'XXL Plank', 'Afmetingen': '152 × 23,8 cm', 'Dikte': '2,5 mm', 'Topslijtlaag': '0,55 mm + 2 keramische laklagen', 'Legsysteem': 'Dryback' }
      },
      {
        name: 'Opal XXL Plank — Amsterdam',
        slug: 'opal-amsterdam-xxl',
        description: 'Moderne brede eiken plank.',
        imageUrl: '/images/brands/ipc/opal-xxl-amsterdam.webp',
        specs: { 'Collectie': 'Opal', 'Variant': 'XXL Plank', 'Afmetingen': '152 × 23,8 cm', 'Dikte': '2,5 mm', 'Topslijtlaag': '0,55 mm + 2 keramische laklagen', 'Legsysteem': 'Dryback' }
      },
      {
        name: 'Opal XXL Plank — Alkmaar',
        slug: 'opal-alkmaar-xxl',
        description: 'Lichte brede eiken plank.',
        imageUrl: '/images/brands/ipc/opal-xxl-alkmaar.webp',
        specs: { 'Collectie': 'Opal', 'Variant': 'XXL Plank', 'Afmetingen': '152 × 23,8 cm', 'Dikte': '2,5 mm', 'Topslijtlaag': '0,55 mm + 2 keramische laklagen', 'Legsysteem': 'Dryback' }
      },
      {
        name: 'Opal XXL Plank — Utrecht',
        slug: 'opal-utrecht-xxl',
        description: 'Klassieke brede eiken plank.',
        imageUrl: '/images/brands/ipc/opal-xxl-utrecht.webp',
        specs: { 'Collectie': 'Opal', 'Variant': 'XXL Plank', 'Afmetingen': '152 × 23,8 cm', 'Dikte': '2,5 mm', 'Topslijtlaag': '0,55 mm + 2 keramische laklagen', 'Legsysteem': 'Dryback' }
      },
      // ── OPAL HONGAARSE PUNT (4 kleuren) ──
      {
        name: 'Opal Hongaarse Punt — Maastricht',
        slug: 'opal-hp-maastricht',
        description: 'Rustiger dan visgraat, mooie snijlijn in plaats van kruisende hoeken. Ideaal voor grotere ruimtes.',
        imageUrl: '/images/brands/ipc/hp-maastricht.webp',
        specs: { 'Collectie': 'Opal Hongaarse Punt', 'Topslijtlaag': '0,55 mm + 2 keramische laklagen', 'Dikte': '2,5 mm', 'Legsysteem': 'Dryback', 'Garantie wonen': '15 jaar' }
      },
      {
        name: 'Opal Hongaarse Punt — Delft',
        slug: 'opal-hp-delft',
        description: 'Populair Hongaars punt patroon in lichte tint.',
        imageUrl: '/images/brands/ipc/hp-delft.webp',
        specs: { 'Collectie': 'Opal Hongaarse Punt', 'Topslijtlaag': '0,55 mm + 2 keramische laklagen', 'Dikte': '2,5 mm', 'Legsysteem': 'Dryback', 'Garantie wonen': '15 jaar' }
      },
      {
        name: 'Opal Hongaarse Punt — Alkmaar',
        slug: 'opal-hp-alkmaar',
        description: 'Fris en modern Hongaars punt patroon.',
        imageUrl: '/images/brands/ipc/hp-alkmaar.webp',
        specs: { 'Collectie': 'Opal Hongaarse Punt', 'Topslijtlaag': '0,55 mm + 2 keramische laklagen', 'Dikte': '2,5 mm', 'Legsysteem': 'Dryback', 'Garantie wonen': '15 jaar' }
      },
      {
        name: 'Opal Hongaarse Punt — Den Bosch',
        slug: 'opal-hp-den-bosch',
        description: 'Warme tint in elegant Hongaars punt.',
        imageUrl: '/images/brands/ipc/hp-den-bosch.webp',
        specs: { 'Collectie': 'Opal Hongaarse Punt', 'Topslijtlaag': '0,55 mm + 2 keramische laklagen', 'Dikte': '2,5 mm', 'Legsysteem': 'Dryback', 'Garantie wonen': '15 jaar' }
      },
      // ── TILES COLLECTIE (6 kleuren) ──
      {
        name: 'Tiles — Betonlook Donkergrijs',
        slug: 'tiles-betonlook-donkergrijs',
        description: 'PVC tegels met mooie natuurlijke betonlook. 45 × 90 cm formaat.',
        imageUrl: '/images/brands/ipc/tiles-donkergrijs.webp',
        specs: { 'Collectie': 'Tiles', 'Afmetingen': '45 × 90 cm', 'Topslijtlaag': '0,55 mm', 'Legsysteem': 'Dryback & Click', 'Garantie wonen': '15 jaar' }
      },
      {
        name: 'Tiles — Betonlook Grijs',
        slug: 'tiles-betonlook-grijs',
        description: 'Veelzijdige grijze betonlook tegel.',
        imageUrl: '/images/brands/ipc/tiles-grijs.webp',
        specs: { 'Collectie': 'Tiles', 'Afmetingen': '45 × 90 cm', 'Topslijtlaag': '0,55 mm', 'Legsysteem': 'Dryback & Click', 'Garantie wonen': '15 jaar' }
      },
      {
        name: 'Tiles — Betonlook Lichtgrijs',
        slug: 'tiles-betonlook-lichtgrijs',
        description: 'Lichte frisse betonlook tegel.',
        imageUrl: '/images/brands/ipc/tiles-lichtgrijs.webp',
        specs: { 'Collectie': 'Tiles', 'Afmetingen': '45 × 90 cm', 'Topslijtlaag': '0,55 mm', 'Legsysteem': 'Dryback & Click', 'Garantie wonen': '15 jaar' }
      },
      {
        name: 'Tiles — XXL Betonlook Antraciet',
        slug: 'tiles-xxl-betonlook-antraciet',
        description: 'Extra groot formaat in stoer antraciet.',
        imageUrl: '/images/brands/ipc/tiles-xxl-antraciet.webp',
        specs: { 'Collectie': 'Tiles', 'Afmetingen': '60 × 90 cm', 'Topslijtlaag': '0,55 mm', 'Legsysteem': 'Dryback & Click', 'Garantie wonen': '15 jaar' }
      },
      {
        name: 'Tiles — XXL Betonlook Muisgrijs',
        slug: 'tiles-xxl-betonlook-muisgrijs',
        description: 'Zacht grijs in XXL formaat.',
        imageUrl: '/images/brands/ipc/tiles-xxl-muisgrijs.webp',
        specs: { 'Collectie': 'Tiles', 'Afmetingen': '60 × 90 cm', 'Topslijtlaag': '0,55 mm', 'Legsysteem': 'Dryback & Click', 'Garantie wonen': '15 jaar' }
      },
      {
        name: 'Tiles — XXL Betonlook Warmgrijs',
        slug: 'tiles-xxl-betonlook-warmgrijs',
        description: 'Warm grijze XXL betonlook tegel.',
        imageUrl: '/images/brands/ipc/tiles-xxl-warmgrijs.webp',
        specs: { 'Collectie': 'Tiles', 'Afmetingen': '60 × 90 cm', 'Topslijtlaag': '0,55 mm', 'Legsysteem': 'Dryback & Click', 'Garantie wonen': '15 jaar' }
      },
      // ── CERAMIC TOUCH 30 (7 kleuren) ──
      {
        name: 'Ceramic Touch 30 — Whitewash Eiken',
        slug: 'ct30-whitewash-eiken',
        description: 'Voordeligste IPC vloer. 0,30 mm toplaag + 2 keramische laklagen. Ideaal voor appartementen of bovenverdieping.',
        imageUrl: '/images/brands/ipc/ct30-whitewash.webp',
        specs: { 'Collectie': 'Ceramic Touch 30', 'Afmetingen': '118 × 18,1 cm', 'Dikte': '4 mm', 'Topslijtlaag': '0,30 mm + 2 keramische laklagen', 'Legsysteem': 'Click & Dryback' }
      },
      {
        name: 'Ceramic Touch 30 — Gerookt Eiken',
        slug: 'ct30-gerookt-eiken',
        description: 'Donkere gerookte eiken look met voelbare houtstructuur.',
        imageUrl: '/images/brands/ipc/ct30-gerookt.webp',
        specs: { 'Collectie': 'Ceramic Touch 30', 'Afmetingen': '118 × 18,1 cm', 'Dikte': '4 mm', 'Topslijtlaag': '0,30 mm + 2 keramische laklagen', 'Legsysteem': 'Click & Dryback' }
      },
      {
        name: 'Ceramic Touch 30 — Natuur Eiken',
        slug: 'ct30-natuur-eiken',
        description: 'Natuurlijke eiken uitstraling.',
        imageUrl: '/images/brands/ipc/ct30-natuur.webp',
        specs: { 'Collectie': 'Ceramic Touch 30', 'Afmetingen': '118 × 18,1 cm', 'Dikte': '4 mm', 'Topslijtlaag': '0,30 mm + 2 keramische laklagen', 'Legsysteem': 'Click & Dryback' }
      },
      {
        name: 'Ceramic Touch 30 — Warm Eiken',
        slug: 'ct30-warm-eiken',
        description: 'Warme tint voor een gezellig interieur.',
        imageUrl: '/images/brands/ipc/ct30-warm.webp',
        specs: { 'Collectie': 'Ceramic Touch 30', 'Afmetingen': '118 × 18,1 cm', 'Dikte': '4 mm', 'Topslijtlaag': '0,30 mm + 2 keramische laklagen', 'Legsysteem': 'Click & Dryback' }
      },
      {
        name: 'Ceramic Touch 30 — Oud Grijs Eiken',
        slug: 'ct30-oud-grijs-eiken',
        description: 'Vergrijsd eiken met karakter.',
        imageUrl: '/images/brands/ipc/ct30-oud-grijs.webp',
        specs: { 'Collectie': 'Ceramic Touch 30', 'Afmetingen': '118 × 18,1 cm', 'Dikte': '4 mm', 'Topslijtlaag': '0,30 mm + 2 keramische laklagen', 'Legsysteem': 'Click & Dryback' }
      },
      {
        name: 'Ceramic Touch 30 — Wit Grijs Eiken',
        slug: 'ct30-wit-grijs-eiken',
        description: 'Licht wit-grijze eiken tint.',
        imageUrl: '/images/brands/ipc/ct30-wit-grijs.webp',
        specs: { 'Collectie': 'Ceramic Touch 30', 'Afmetingen': '118 × 18,1 cm', 'Dikte': '4 mm', 'Topslijtlaag': '0,30 mm + 2 keramische laklagen', 'Legsysteem': 'Click & Dryback' }
      },
      {
        name: 'Ceramic Touch 30 — Grijs Eiken',
        slug: 'ct30-grijs-eiken',
        description: 'Stijlvol grijs eiken desssin.',
        imageUrl: '/images/brands/ipc/ct30-grijs.webp',
        specs: { 'Collectie': 'Ceramic Touch 30', 'Afmetingen': '118 × 18,1 cm', 'Dikte': '4 mm', 'Topslijtlaag': '0,30 mm + 2 keramische laklagen', 'Legsysteem': 'Click & Dryback' }
      },
      // ── CERAMIC TOUCH 55 (7 kleuren) ──
      {
        name: 'Ceramic Touch 55 — Bruin Eiken',
        slug: 'ct55-bruin-eiken',
        description: 'Absolute winnaar qua kwaliteit en prijs. 0,55 mm toplaag + 2 keramische laklagen. Perfect voor alle situaties.',
        imageUrl: '/images/brands/ipc/ct55-bruin.webp',
        specs: { 'Collectie': 'Ceramic Touch 55', 'Afmetingen': '118 × 18,1 cm', 'Dikte': '4,5 mm', 'Topslijtlaag': '0,55 mm + 2 keramische laklagen', 'Legsysteem': 'Click & Dryback' }
      },
      {
        name: 'Ceramic Touch 55 — Eiken Taupe',
        slug: 'ct55-eiken-taupe',
        description: 'Zachte taupe tint met voelbare houtstructuur.',
        imageUrl: '/images/brands/ipc/ct55-taupe.webp',
        specs: { 'Collectie': 'Ceramic Touch 55', 'Afmetingen': '118 × 18,1 cm', 'Dikte': '4,5 mm', 'Topslijtlaag': '0,55 mm + 2 keramische laklagen', 'Legsysteem': 'Click & Dryback' }
      },
      {
        name: 'Ceramic Touch 55 — Wit Eiken',
        slug: 'ct55-wit-eiken',
        description: 'Fris wit eiken voor een lichte ruimte.',
        imageUrl: '/images/brands/ipc/ct55-wit.webp',
        specs: { 'Collectie': 'Ceramic Touch 55', 'Afmetingen': '118 × 18,1 cm', 'Dikte': '4,5 mm', 'Topslijtlaag': '0,55 mm + 2 keramische laklagen', 'Legsysteem': 'Click & Dryback' }
      },
      {
        name: 'Ceramic Touch 55 — Rustiek Eiken',
        slug: 'ct55-rustiek-eiken',
        description: 'Stoere rustieke eiken look.',
        imageUrl: '/images/brands/ipc/ct55-rustiek.webp',
        specs: { 'Collectie': 'Ceramic Touch 55', 'Afmetingen': '118 × 18,1 cm', 'Dikte': '4,5 mm', 'Topslijtlaag': '0,55 mm + 2 keramische laklagen', 'Legsysteem': 'Click & Dryback' }
      },
      {
        name: 'Ceramic Touch 55 — Grijs Bruin Eiken',
        slug: 'ct55-grijs-bruin-eiken',
        description: 'Veelzijdige grijs-bruine tint.',
        imageUrl: '/images/brands/ipc/ct55-grijs-bruin.webp',
        specs: { 'Collectie': 'Ceramic Touch 55', 'Afmetingen': '118 × 18,1 cm', 'Dikte': '4,5 mm', 'Topslijtlaag': '0,55 mm + 2 keramische laklagen', 'Legsysteem': 'Click & Dryback' }
      },
      {
        name: 'Ceramic Touch 55 — Staal Grijs Eiken',
        slug: 'ct55-staal-grijs-eiken',
        description: 'Stoer staalgrijs eiken dessin.',
        imageUrl: '/images/brands/ipc/ct55-staal-grijs.webp',
        specs: { 'Collectie': 'Ceramic Touch 55', 'Afmetingen': '118 × 18,1 cm', 'Dikte': '4,5 mm', 'Topslijtlaag': '0,55 mm + 2 keramische laklagen', 'Legsysteem': 'Click & Dryback' }
      },
      {
        name: 'Ceramic Touch 55 — Eiken Naturel',
        slug: 'ct55-eiken-naturel',
        description: 'Puur en natuurlijk eiken.',
        imageUrl: '/images/brands/ipc/ct55-naturel.webp',
        specs: { 'Collectie': 'Ceramic Touch 55', 'Afmetingen': '118 × 18,1 cm', 'Dikte': '4,5 mm', 'Topslijtlaag': '0,55 mm + 2 keramische laklagen', 'Legsysteem': 'Click & Dryback' }
      }
    ]
  },
  {
    name: 'ROOM5',
    slug: 'room5',
    logoUrl: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQAuvW6uEF0-j6v8Su2UwXxG40lyQBIgeBoEw&s',
    website: 'https://room-5.com',
    description: 'Ontworpen door Nederlandse interieurarchitecten. Hotel Chique concept. Esthetische perfectie gecombineerd met duurzaamheid en eenvoudig onderhoud. Uniek oppervlak met de look en feel van echt geschuurd hout. Elke kleur verkrijgbaar in stijlvolle planken én grote visgraat. Ook beschikbaar in 10dB Click.',
    shortDescription: '10 exclusieve kleuren — planken én visgraat. Hotel Chique met levenslange garantie.',
    featured: true,
    materials: ['PVC'],
    moodImages: [
      'https://room-5.com/wp-content/uploads/2024/03/Presidential-Ebony-1.jpg',
      'https://room-5.com/wp-content/uploads/2024/03/Executive-Gold-1.jpg',
      'https://room-5.com/wp-content/uploads/2024/03/Ambassador-Oak-3.jpg',
      'https://room-5.com/wp-content/uploads/2024/03/Superior-Beige-2.jpg'
    ],
    products: [
      {
        name: 'Royal Champagne',
        slug: 'royal-champagne',
        description: 'Geniet van de sfeer van \'s werelds meest exclusieve bubbels. Ook in 10dB Click.',
        imageUrl: 'https://room-5.com/wp-content/uploads/2024/03/HTF_Straight1.jpg',
        specs: { 'Varianten': 'Planken & Visgraat', 'Topslijtlaag': '0,55 mm', 'Legsysteem': 'Dryback & 10dB Click', 'Garantie': 'Levenslang', 'Vloerverwarming': 'Ja' }
      },
      {
        name: 'Superior Beige',
        slug: 'superior-beige',
        description: 'Omarmt je interieur als een warme deken. Ook in 10dB Click.',
        imageUrl: 'https://room-5.com/wp-content/uploads/2024/03/HTF_Straight2.jpg',
        specs: { 'Varianten': 'Planken & Visgraat', 'Topslijtlaag': '0,55 mm', 'Legsysteem': 'Dryback & 10dB Click', 'Garantie': 'Levenslang', 'Vloerverwarming': 'Ja' }
      },
      {
        name: 'Ambassador Oak',
        slug: 'ambassador-oak',
        description: 'Ontdek de heerlijk ontspannen sfeer van tijdloze charme.',
        imageUrl: 'https://room-5.com/wp-content/uploads/2024/03/HTF_Straight3.jpg',
        specs: { 'Varianten': 'Planken & Visgraat', 'Topslijtlaag': '0,55 mm', 'Legsysteem': 'Dryback', 'Garantie': 'Levenslang', 'Vloerverwarming': 'Ja' }
      },
      {
        name: 'Executive Gold',
        slug: 'executive-gold',
        description: 'Brengt een vleugje extravagantie naar je interieur.',
        imageUrl: 'https://room-5.com/wp-content/uploads/2024/03/HTF_Straight4.jpg',
        specs: { 'Varianten': 'Planken & Visgraat', 'Topslijtlaag': '0,55 mm', 'Legsysteem': 'Dryback', 'Garantie': 'Levenslang', 'Vloerverwarming': 'Ja' }
      },
      {
        name: 'Presidential Oak',
        slug: 'presidential-oak',
        description: 'Stap in de wereld van exclusieve allure. Ook in 10dB Click.',
        imageUrl: 'https://room-5.com/wp-content/uploads/2025/09/StudioPlanks_555_100111-1.jpg',
        specs: { 'Varianten': 'Planken & Visgraat', 'Topslijtlaag': '0,55 mm', 'Legsysteem': 'Dryback & 10dB Click', 'Garantie': 'Levenslang', 'Vloerverwarming': 'Ja' }
      },
      {
        name: 'Charming Suite',
        slug: 'charming-suite',
        description: 'Betreed een wereld van comfort en verfijning.',
        imageUrl: 'https://room-5.com/wp-content/uploads/2025/01/Room5_Charming-Suite_Planks_benger.jpg',
        specs: { 'Varianten': 'Planken & Visgraat', 'Topslijtlaag': '0,55 mm', 'Legsysteem': 'Dryback', 'Garantie': 'Levenslang', 'Vloerverwarming': 'Ja' }
      },
      {
        name: 'Regency Wood',
        slug: 'regency-wood',
        description: 'Brengt een vleugje natuurlijke verfijning naar je interieur. Ook in 10dB Click.',
        imageUrl: 'https://room-5.com/wp-content/uploads/2025/01/Room5_Regency-Wood_Planks_benger.jpg',
        specs: { 'Varianten': 'Planken & Visgraat', 'Topslijtlaag': '0,55 mm', 'Legsysteem': 'Dryback & 10dB Click', 'Garantie': 'Levenslang', 'Vloerverwarming': 'Ja' }
      },
      {
        name: 'Western Hemlock',
        slug: 'western-hemlock',
        description: 'Laat je meevoeren naar de serene bossen van Canada. Ook in 10dB Click.',
        imageUrl: 'https://room-5.com/wp-content/uploads/2025/01/Room5_Western-Hemlock_Planks_benger.jpg',
        specs: { 'Varianten': 'Planken & Visgraat', 'Topslijtlaag': '0,55 mm', 'Legsysteem': 'Dryback & 10dB Click', 'Garantie': 'Levenslang', 'Vloerverwarming': 'Ja' }
      },
      {
        name: 'Hemmingway Oak',
        slug: 'hemmingway-oak',
        description: 'Ontdek de tijdloze aantrekkingskracht van Hemmingway Oak.',
        imageUrl: 'https://room-5.com/wp-content/uploads/2025/01/Room5_Hemmingway-Oak_Planks_benger.jpg',
        specs: { 'Varianten': 'Planken & Visgraat', 'Topslijtlaag': '0,55 mm', 'Legsysteem': 'Dryback', 'Garantie': 'Levenslang', 'Vloerverwarming': 'Ja' }
      },
      {
        name: 'The Grand Walnut',
        slug: 'the-grand-walnut',
        description: 'Brengt een luxueus gevoel naar elke ruimte. Ook in 10dB Click.',
        imageUrl: 'https://room-5.com/wp-content/uploads/2025/01/Room5_The-Grand-Walnut_Planks_benger.jpg',
        specs: { 'Varianten': 'Planken & Visgraat', 'Topslijtlaag': '0,55 mm', 'Legsysteem': 'Dryback & 10dB Click', 'Garantie': 'Levenslang', 'Vloerverwarming': 'Ja' }
      }
    ]
  },
  {
    name: 'Invictus',
    slug: 'invictus',
    logoUrl: 'https://www.tete.nl/wp-content/uploads/2023/09/Invictus_Logo_Web_Tagline-goud-op-wit.webp',
    website: 'https://invictus.eu/nl-nl',
    description: '"Invincible flooring". Scratchmaster® toplaag exclusief voor Invictus. Weekmakers op basis van soja-extracten (geen ftalaten). 100% recyclebaar. Geluiddempend. Beschikbaar in 5 collecties: Maximus Dryback, Maximus Click, Maximus Looselay, Primus Dryback en Primus Click.',
    shortDescription: 'Onoverwinnelijke vloeren met duurzame soja-extract weekmakers en Scratchmaster® toplaag.',
    featured: false,
    materials: ['PVC'],
    moodImages: [
      '/images/brands/invictus/mood-1.webp',
      '/images/brands/invictus/mood-2.webp',
      '/images/brands/invictus/mood-3.webp',
      '/images/brands/invictus/mood-4.webp',
    ],
    products: [
      {
        name: 'Riverside Oak – Sunshine',
        slug: 'maximus-dryback-riverside-oak-sunshine',
        description: 'Warme eikenhouttint in een zonnige Sunshine-kleurstelling. Verkrijgbaar als plank (228×1500mm). Topsegment verlijmde vinylvloer met 0,55 mm Scratchmaster® slijtlaag.',
        imageUrl: '/images/brands/invictus/maximus-dryback/riverside-oak-sunshine.webp',
        specs: { 'Collectie': 'Maximus Dryback', 'Afmeting': '228 × 1500 mm', 'Topslijtlaag': '0,55 mm + Scratchmaster®', 'Installatie': 'Dryback (verlijmd)', 'Geluidsisolatie': '3 dB', 'Waterbestendig': 'Ja', 'Vloerverwarming': 'Ja', 'Garantie wonen': '25 jaar', 'Garantie project': '15 jaar' }
      },
      {
        name: 'Belrose Oak – Truffle',
        slug: 'maximus-dryback-belrose-oak-truffle-plank',
        description: 'Rijke eikenlook in donkere Truffle-tinten, uitgevoerd als plankvloer (241×1517mm). Geschikt voor woon- én projectomgevingen met hoog verkeersintensiteit.',
        imageUrl: '/images/brands/invictus/maximus-dryback/belrose-oak-truffle-plank.webp',
        specs: { 'Collectie': 'Maximus Dryback', 'Afmeting': '241 × 1517 mm', 'Topslijtlaag': '0,55 mm + Scratchmaster®', 'Installatie': 'Dryback (verlijmd)', 'Geluidsisolatie': '3 dB', 'Waterbestendig': 'Ja', 'Vloerverwarming': 'Ja', 'Garantie wonen': '25 jaar', 'Garantie project': '15 jaar' }
      },
      {
        name: 'Belrose Oak – Truffle (Herringbone)',
        slug: 'maximus-dryback-belrose-oak-truffle-herringbone',
        description: 'Hetzelfde Truffle-dessin van Belrose Oak, nu in een elegante visgraatindeling (150×749mm). Tijdloos en sfeervol voor woon- en kantoorruimtes.',
        imageUrl: '/images/brands/invictus/maximus-dryback/belrose-oak-truffle-herringbone.webp',
        specs: { 'Collectie': 'Maximus Dryback', 'Afmeting': '150 × 749 mm', 'Patroon': 'Visgraat', 'Topslijtlaag': '0,55 mm + Scratchmaster®', 'Installatie': 'Dryback (verlijmd)', 'Geluidsisolatie': '3 dB', 'Waterbestendig': 'Ja', 'Vloerverwarming': 'Ja', 'Garantie wonen': '25 jaar', 'Garantie project': '15 jaar' }
      },
      {
        name: 'Sienna Oak – Authentique',
        slug: 'maximus-dryback-sienna-oak-authentique',
        description: 'Authentieke eikenlook met warme, aardse tinten in Authentique-kleurstelling (241×1517mm). Ideaal voor woonruimtes en projecten die een klassieke uitstraling vereisen.',
        imageUrl: '/images/brands/invictus/maximus-dryback/sienna-oak-authentique.webp',
        specs: { 'Collectie': 'Maximus Dryback', 'Afmeting': '241 × 1517 mm', 'Topslijtlaag': '0,55 mm + Scratchmaster®', 'Installatie': 'Dryback (verlijmd)', 'Geluidsisolatie': '3 dB', 'Waterbestendig': 'Ja', 'Vloerverwarming': 'Ja', 'Garantie wonen': '25 jaar', 'Garantie project': '15 jaar' }
      },
      {
        name: 'Regency Oak – Scone',
        slug: 'maximus-dryback-regency-oak-scone',
        description: 'Verfijnde eikenlook in zachte Scone-tinten (241×1517mm). Een stijlvolle keuze voor representatieve ruimtes en hoge verkeersbelasting.',
        imageUrl: '/images/brands/invictus/maximus-dryback/regency-oak-scone.webp',
        specs: { 'Collectie': 'Maximus Dryback', 'Afmeting': '241 × 1517 mm', 'Topslijtlaag': '0,55 mm + Scratchmaster®', 'Installatie': 'Dryback (verlijmd)', 'Geluidsisolatie': '3 dB', 'Waterbestendig': 'Ja', 'Vloerverwarming': 'Ja', 'Garantie wonen': '25 jaar', 'Garantie project': '15 jaar' }
      },
      {
        name: 'Premium Oak – Ecru',
        slug: 'maximus-dryback-premium-oak-ecru',
        description: 'Lichte, crèmekleurige eikenlook in Ecru-tint (228×1500mm). Geeft ruimtes een frisse, luchtige uitstraling met maximale slijtvastheid.',
        imageUrl: '/images/brands/invictus/maximus-dryback/premium-oak-ecru.webp',
        specs: { 'Collectie': 'Maximus Dryback', 'Afmeting': '228 × 1500 mm', 'Topslijtlaag': '0,55 mm + Scratchmaster®', 'Installatie': 'Dryback (verlijmd)', 'Geluidsisolatie': '3 dB', 'Waterbestendig': 'Ja', 'Vloerverwarming': 'Ja', 'Garantie wonen': '25 jaar', 'Garantie project': '15 jaar' }
      },
      {
        name: 'Velvet Oak – Celeste',
        slug: 'maximus-dryback-velvet-oak-celeste-plank',
        description: 'Fluweelzachte eikenlook in hemelsblauwe Celeste-tinten, als slanke plank (178×1219mm). Combineert stijl met topkwaliteit slijtlaag voor dagelijks gebruik.',
        imageUrl: '/images/brands/invictus/maximus-dryback/velvet-oak-celeste-plank.webp',
        specs: { 'Collectie': 'Maximus Dryback', 'Afmeting': '178 × 1219 mm', 'Topslijtlaag': '0,55 mm + Scratchmaster®', 'Installatie': 'Dryback (verlijmd)', 'Geluidsisolatie': '3 dB', 'Waterbestendig': 'Ja', 'Vloerverwarming': 'Ja', 'Garantie wonen': '25 jaar', 'Garantie project': '15 jaar' }
      },
      {
        name: 'Velvet Oak – Celeste (Parquet)',
        slug: 'maximus-dryback-velvet-oak-celeste-parquet',
        description: 'Velvet Oak in Celeste-kleurstelling, nu als compact parketformaat (102×406mm). Perfect voor een klassieke parketvloer met moderne duurzaamheid.',
        imageUrl: '/images/brands/invictus/maximus-dryback/velvet-oak-celeste-parquet.webp',
        specs: { 'Collectie': 'Maximus Dryback', 'Afmeting': '102 × 406 mm', 'Patroon': 'Parquet', 'Topslijtlaag': '0,55 mm + Scratchmaster®', 'Installatie': 'Dryback (verlijmd)', 'Geluidsisolatie': '3 dB', 'Waterbestendig': 'Ja', 'Vloerverwarming': 'Ja', 'Garantie wonen': '25 jaar', 'Garantie project': '15 jaar' }
      },
      {
        name: 'Victorian Treasure – Smoke',
        slug: 'maximus-dryback-victorian-treasure-smoke',
        description: 'Stijlvolle steentegel in rokerige Smoke-kleurstelling (229×229mm). Victoriaanse charme met de duurzaamheid van moderne vinylvloer — ideaal voor hal en badkamer.',
        imageUrl: '/images/brands/invictus/maximus-dryback/victorian-treasure-smoke.webp',
        specs: { 'Collectie': 'Maximus Dryback', 'Afmeting': '229 × 229 mm', 'Patroon': 'Tegel', 'Topslijtlaag': '0,55 mm + Scratchmaster®', 'Installatie': 'Dryback (verlijmd)', 'Geluidsisolatie': '3 dB', 'Waterbestendig': 'Ja', 'Vloerverwarming': 'Ja', 'Garantie wonen': '25 jaar', 'Garantie project': '15 jaar' }
      },
      {
        name: 'Divine Oak Herringbone – Pure',
        slug: 'maximus-dryback-divine-oak-herringbone-pure',
        description: 'Goddelijke eikenlook in zuivere Pure-tinten, gelegd in visgraatpatroon (150×749mm). Een statement voor elke woonkamer of kantoorruimte.',
        imageUrl: '/images/brands/invictus/maximus-dryback/divine-oak-herringbone-pure.webp',
        specs: { 'Collectie': 'Maximus Dryback', 'Afmeting': '150 × 749 mm', 'Patroon': 'Visgraat', 'Topslijtlaag': '0,55 mm + Scratchmaster®', 'Installatie': 'Dryback (verlijmd)', 'Geluidsisolatie': '3 dB', 'Waterbestendig': 'Ja', 'Vloerverwarming': 'Ja', 'Garantie wonen': '25 jaar', 'Garantie project': '15 jaar' }
      },
      {
        name: 'Divine Oak – Champagne',
        slug: 'maximus-dryback-divine-oak-champagne',
        description: 'Weelderige eikenlook in verfijnde Champagne-tinten (241×1517mm). Brengt warmte en elegantie in elke ruimte dankzij de realistische houtstructuur.',
        imageUrl: '/images/brands/invictus/maximus-dryback/divine-oak-champagne.webp',
        specs: { 'Collectie': 'Maximus Dryback', 'Afmeting': '241 × 1517 mm', 'Topslijtlaag': '0,55 mm + Scratchmaster®', 'Installatie': 'Dryback (verlijmd)', 'Geluidsisolatie': '3 dB', 'Waterbestendig': 'Ja', 'Vloerverwarming': 'Ja', 'Garantie wonen': '25 jaar', 'Garantie project': '15 jaar' }
      },
      {
        name: 'Highland Oak Herringbone – Classic',
        slug: 'maximus-dryback-highland-oak-herringbone-classic',
        description: 'Hooglander eikenlook in tijdloze Classic-kleurstelling, gelegd als visgraatpatroon (150×749mm). Robuust karakter met Scratchmaster® bescherming.',
        imageUrl: '/images/brands/invictus/maximus-dryback/highland-oak-herringbone-classic.webp',
        specs: { 'Collectie': 'Maximus Dryback', 'Afmeting': '150 × 749 mm', 'Patroon': 'Visgraat', 'Topslijtlaag': '0,55 mm + Scratchmaster®', 'Installatie': 'Dryback (verlijmd)', 'Geluidsisolatie': '3 dB', 'Waterbestendig': 'Ja', 'Vloerverwarming': 'Ja', 'Garantie wonen': '25 jaar', 'Garantie project': '15 jaar' }
      },
      {
        name: 'Highland Oak Parquet – Sunrise',
        slug: 'maximus-dryback-highland-oak-parquet-sunrise',
        description: 'Highland Oak in zonsopgang-Sunrise tinten, uitgevoerd als klassiek parketblokje (102×406mm). Sfeervolle combinatie van traditioneel vakmanschap en moderne vinylkwaliteit.',
        imageUrl: '/images/brands/invictus/maximus-dryback/highland-oak-parquet-sunrise.webp',
        specs: { 'Collectie': 'Maximus Dryback', 'Afmeting': '102 × 406 mm', 'Patroon': 'Parquet', 'Topslijtlaag': '0,55 mm + Scratchmaster®', 'Installatie': 'Dryback (verlijmd)', 'Geluidsisolatie': '3 dB', 'Waterbestendig': 'Ja', 'Vloerverwarming': 'Ja', 'Garantie wonen': '25 jaar', 'Garantie project': '15 jaar' }
      },
      {
        name: 'New England Oak Parquet – Sand',
        slug: 'maximus-dryback-new-england-oak-parquet-sand',
        description: 'New England eikenlook in zandkleurige Sand-tint als parketformaat (102×406mm). Landelijke charme met hoge gebruiksklasse voor wonen en werken.',
        imageUrl: '/images/brands/invictus/maximus-dryback/new-england-oak-parquet-sand.webp',
        specs: { 'Collectie': 'Maximus Dryback', 'Afmeting': '102 × 406 mm', 'Patroon': 'Parquet', 'Topslijtlaag': '0,55 mm + Scratchmaster®', 'Installatie': 'Dryback (verlijmd)', 'Geluidsisolatie': '3 dB', 'Waterbestendig': 'Ja', 'Vloerverwarming': 'Ja', 'Garantie wonen': '25 jaar', 'Garantie project': '15 jaar' }
      },
      {
        name: 'Groovy Granite – Alabaster (305×610)',
        slug: 'maximus-dryback-groovy-granite-alabaster-small',
        description: 'Krachtig granietdessin in stralend Alabaster-wit (305×610mm). Geeft badkamers, keukens en commerciële ruimtes een luxe steenlook met optimale slijtvastheid.',
        imageUrl: '/images/brands/invictus/maximus-dryback/groovy-granite-alabaster-small.webp',
        specs: { 'Collectie': 'Maximus Dryback', 'Afmeting': '305 × 610 mm', 'Patroon': 'Tegel', 'Topslijtlaag': '0,55 mm + Scratchmaster®', 'Installatie': 'Dryback (verlijmd)', 'Geluidsisolatie': '3 dB', 'Waterbestendig': 'Ja', 'Vloerverwarming': 'Ja', 'Garantie wonen': '25 jaar', 'Garantie project': '15 jaar' }
      },
      {
        name: 'Highland Oak – Sunrise',
        slug: 'maximus-dryback-highland-oak-sunrise',
        description: 'Brede plank in Highland Oak-dessin met warme Sunrise-kleurstelling (178×1219mm). Uitgesproken houtstructuur met een levendige, open uitstraling.',
        imageUrl: '/images/brands/invictus/maximus-dryback/highland-oak-sunrise.webp',
        specs: { 'Collectie': 'Maximus Dryback', 'Afmeting': '178 × 1219 mm', 'Topslijtlaag': '0,55 mm + Scratchmaster®', 'Installatie': 'Dryback (verlijmd)', 'Geluidsisolatie': '3 dB', 'Waterbestendig': 'Ja', 'Vloerverwarming': 'Ja', 'Garantie wonen': '25 jaar', 'Garantie project': '15 jaar' }
      },
      {
        name: 'Concrete Crush – Smoke',
        slug: 'maximus-dryback-concrete-crush-smoke',
        description: 'Industrieel betondessin in diepgrijze Smoke-kleurstelling (305×610mm). Geeft elke ruimte een urban, stoere uitstraling met maximale gebruiksklasse.',
        imageUrl: '/images/brands/invictus/maximus-dryback/concrete-crush-smoke.webp',
        specs: { 'Collectie': 'Maximus Dryback', 'Afmeting': '305 × 610 mm', 'Patroon': 'Tegel', 'Topslijtlaag': '0,55 mm + Scratchmaster®', 'Installatie': 'Dryback (verlijmd)', 'Geluidsisolatie': '3 dB', 'Waterbestendig': 'Ja', 'Vloerverwarming': 'Ja', 'Garantie wonen': '25 jaar', 'Garantie project': '15 jaar' }
      },
      {
        name: 'Silk Oak – Latte',
        slug: 'maximus-dryback-silk-oak-latte',
        description: 'Zijdezachte eikenlook in warme Latte-koffietinten (228×1219mm). Creëert een gezellige, huiselijke sfeer met uitstekende slijtbestendigheid.',
        imageUrl: '/images/brands/invictus/maximus-dryback/silk-oak-latte.webp',
        specs: { 'Collectie': 'Maximus Dryback', 'Afmeting': '228 × 1219 mm', 'Topslijtlaag': '0,55 mm + Scratchmaster®', 'Installatie': 'Dryback (verlijmd)', 'Geluidsisolatie': '3 dB', 'Waterbestendig': 'Ja', 'Vloerverwarming': 'Ja', 'Garantie wonen': '25 jaar', 'Garantie project': '15 jaar' }
      },
      {
        name: 'Hudson Stone – Silver',
        slug: 'maximus-dryback-hudson-stone-silver',
        description: 'Koele steenlook in zilvergrijs Hudson Stone-dessin (457×914mm). Een moderne, stijlvolle keuze voor badkamers, keukens en commerciële projecten.',
        imageUrl: '/images/brands/invictus/maximus-dryback/hudson-stone-silver.webp',
        specs: { 'Collectie': 'Maximus Dryback', 'Afmeting': '457 × 914 mm', 'Patroon': 'Tegel', 'Topslijtlaag': '0,55 mm + Scratchmaster®', 'Installatie': 'Dryback (verlijmd)', 'Geluidsisolatie': '3 dB', 'Waterbestendig': 'Ja', 'Vloerverwarming': 'Ja', 'Garantie wonen': '25 jaar', 'Garantie project': '15 jaar' }
      },
      {
        name: 'French Oak – Polar',
        slug: 'maximus-dryback-french-oak-polar',
        description: 'Frans eikenhout in ijskoude Polar-wittinten (178×1219mm). Lichte, ruimtelijke uitstraling voor slaapkamers en woonruimtes met een Scandinavische touch.',
        imageUrl: '/images/brands/invictus/maximus-dryback/french-oak-polar.webp',
        specs: { 'Collectie': 'Maximus Dryback', 'Afmeting': '178 × 1219 mm', 'Topslijtlaag': '0,55 mm + Scratchmaster®', 'Installatie': 'Dryback (verlijmd)', 'Geluidsisolatie': '3 dB', 'Waterbestendig': 'Ja', 'Vloerverwarming': 'Ja', 'Garantie wonen': '25 jaar', 'Garantie project': '15 jaar' }
      },
      {
        name: 'New England Oak – Sand',
        slug: 'maximus-dryback-new-england-oak-sand',
        description: 'New England eikenlook als brede plank (178×1219mm) in zandkleurige Sand-tint. Rustieke charme met moderne vinylkwaliteit voor woon- en kantooromgevingen.',
        imageUrl: '/images/brands/invictus/maximus-dryback/new-england-oak-sand.webp',
        specs: { 'Collectie': 'Maximus Dryback', 'Afmeting': '178 × 1219 mm', 'Topslijtlaag': '0,55 mm + Scratchmaster®', 'Installatie': 'Dryback (verlijmd)', 'Geluidsisolatie': '3 dB', 'Waterbestendig': 'Ja', 'Vloerverwarming': 'Ja', 'Garantie wonen': '25 jaar', 'Garantie project': '15 jaar' }
      },
      {
        name: 'Bella Noce – Walnut',
        slug: 'maximus-dryback-bella-noce-walnut',
        description: 'Rijke walnoothoutlook in Bella Noce-dessin (150×749mm). Donkere, warme tinten geven ruimtes een luxueuze uitstraling met topkwaliteit slijtlaag.',
        imageUrl: '/images/brands/invictus/maximus-dryback/bella-noce-walnut.webp',
        specs: { 'Collectie': 'Maximus Dryback', 'Afmeting': '150 × 749 mm', 'Patroon': 'Visgraat', 'Topslijtlaag': '0,55 mm + Scratchmaster®', 'Installatie': 'Dryback (verlijmd)', 'Geluidsisolatie': '3 dB', 'Waterbestendig': 'Ja', 'Vloerverwarming': 'Ja', 'Garantie wonen': '25 jaar', 'Garantie project': '15 jaar' }
      },
      {
        name: 'Groovy Granite – Alabaster (457×914)',
        slug: 'maximus-dryback-groovy-granite-alabaster-large',
        description: 'Groot formaat granietdessin in stralend Alabaster (457×914mm). Ideaal voor ruimere commerciële en woonprojecten die een naadloze steenlook wensen.',
        imageUrl: '/images/brands/invictus/maximus-dryback/groovy-granite-alabaster-large.webp',
        specs: { 'Collectie': 'Maximus Dryback', 'Afmeting': '457 × 914 mm', 'Patroon': 'Tegel', 'Topslijtlaag': '0,55 mm + Scratchmaster®', 'Installatie': 'Dryback (verlijmd)', 'Geluidsisolatie': '3 dB', 'Waterbestendig': 'Ja', 'Vloerverwarming': 'Ja', 'Garantie wonen': '25 jaar', 'Garantie project': '15 jaar' }
      },
      {
        name: 'Cosmopolitan – Golden Cream',
        slug: 'maximus-dryback-cosmopolitan-golden-cream',
        description: 'Chique steentegel in warme Golden Cream-tint (610×610mm). Een cosmopolitische, tijdloze keuze voor representatieve woon- en projectruimtes.',
        imageUrl: '/images/brands/invictus/maximus-dryback/cosmopolitan-golden-cream.webp',
        specs: { 'Collectie': 'Maximus Dryback', 'Afmeting': '610 × 610 mm', 'Patroon': 'Tegel', 'Topslijtlaag': '0,55 mm + Scratchmaster®', 'Installatie': 'Dryback (verlijmd)', 'Geluidsisolatie': '3 dB', 'Waterbestendig': 'Ja', 'Vloerverwarming': 'Ja', 'Garantie wonen': '25 jaar', 'Garantie project': '15 jaar' }
      },
      {
        name: 'Nativa – Sandshell',
        slug: 'maximus-dryback-nativa-sandshell',
        description: 'Organisch steendessin in zachte Sandshell-kleurstelling (457×914mm). Natuurlijke uitstraling met de duurzaamheid van Invictus Maximus — perfect voor badkamers en keukens.',
        imageUrl: '/images/brands/invictus/maximus-dryback/nativa-sandshell.webp',
        specs: { 'Collectie': 'Maximus Dryback', 'Afmeting': '457 × 914 mm', 'Patroon': 'Tegel', 'Topslijtlaag': '0,55 mm + Scratchmaster®', 'Installatie': 'Dryback (verlijmd)', 'Geluidsisolatie': '3 dB', 'Waterbestendig': 'Ja', 'Vloerverwarming': 'Ja', 'Garantie wonen': '25 jaar', 'Garantie project': '15 jaar' }
      },
      {
        name: 'Tropical Forest – Havana',
        slug: 'maximus-dryback-tropical-forest-havana',
        description: 'Exotisch tropisch houtdessin in rijke Havana-tinten (228×1219mm). Brengt de warmte van het regenwoud in huis met maximale slijtbestendigheid.',
        imageUrl: '/images/brands/invictus/maximus-dryback/tropical-forest-havana.webp',
        specs: { 'Collectie': 'Maximus Dryback', 'Afmeting': '228 × 1219 mm', 'Topslijtlaag': '0,55 mm + Scratchmaster®', 'Installatie': 'Dryback (verlijmd)', 'Geluidsisolatie': '3 dB', 'Waterbestendig': 'Ja', 'Vloerverwarming': 'Ja', 'Garantie wonen': '25 jaar', 'Garantie project': '15 jaar' }
      },
      {
        name: 'Riverside Oak – Sunshine',
        slug: 'maximus-click-riverside-oak-sunshine',
        description: 'Warme eikenhouttint in Sunshine-kleurstelling (225×1500mm). Rigid click-systeem met 20 dB geluidsisolatie en 0,55 mm Scratchmaster® slijtlaag.',
        imageUrl: '/images/brands/invictus/maximus-click/riverside-oak-sunshine.webp',
        specs: {
          'Collectie': 'Maximus Click',
          'Afmeting': '225 × 1500 mm',
          'Topslijtlaag': '0,55 mm + Scratchmaster®',
          'Installatie': 'Rigid Click',
          'Geluidsisolatie': '20 dB',
          'Waterbestendig': 'Ja',
          'Vloerverwarming': 'Ja',
          'Garantie wonen': '25 jaar',
          'Garantie project': '15 jaar',
        }
      },
      {
        name: 'Divine Oak – Pure',
        slug: 'maximus-click-divine-oak-pure',
        description: 'Goddelijke eikenlook in zuivere Pure-tinten, gelegd in visgraatpatroon (145×743mm). Rigid click voor snelle installatie met 20 dB geluidsisolatie.',
        imageUrl: '/images/brands/invictus/maximus-click/divine-oak-pure.webp',
        specs: {
          'Collectie': 'Maximus Click',
          'Afmeting': '145 × 743 mm',
          'Patroon': 'Visgraat',
          'Topslijtlaag': '0,55 mm + Scratchmaster®',
          'Installatie': 'Rigid Click',
          'Geluidsisolatie': '20 dB',
          'Waterbestendig': 'Ja',
          'Vloerverwarming': 'Ja',
          'Garantie wonen': '25 jaar',
          'Garantie project': '15 jaar',
        }
      },
      {
        name: 'Belrose Oak – Truffle',
        slug: 'maximus-click-belrose-oak-truffle',
        description: 'Rijke eikenlook in donkere Truffle-tinten (241×1518mm). Geschikt voor woon- én projectomgevingen met hoog verkeersintensiteit dankzij rigid click-systeem.',
        imageUrl: '/images/brands/invictus/maximus-click/belrose-oak-truffle.webp',
        specs: {
          'Collectie': 'Maximus Click',
          'Afmeting': '241 × 1518 mm',
          'Topslijtlaag': '0,55 mm + Scratchmaster®',
          'Installatie': 'Rigid Click',
          'Geluidsisolatie': '20 dB',
          'Waterbestendig': 'Ja',
          'Vloerverwarming': 'Ja',
          'Garantie wonen': '25 jaar',
          'Garantie project': '15 jaar',
        }
      },
      {
        name: 'Silk Oak – Latte',
        slug: 'maximus-click-silk-oak-latte',
        description: 'Zijdezachte eikenlook in warme Latte-koffietinten (228×1210mm). Creëert een gezellige sfeer met uitstekende slijtbestendigheid en eenvoudig click-systeem.',
        imageUrl: '/images/brands/invictus/maximus-click/silk-oak-latte.webp',
        specs: {
          'Collectie': 'Maximus Click',
          'Afmeting': '228 × 1210 mm',
          'Topslijtlaag': '0,55 mm + Scratchmaster®',
          'Installatie': 'Rigid Click',
          'Geluidsisolatie': '20 dB',
          'Waterbestendig': 'Ja',
          'Vloerverwarming': 'Ja',
          'Garantie wonen': '25 jaar',
          'Garantie project': '15 jaar',
        }
      },
      {
        name: 'Nativa – Sandshell',
        slug: 'maximus-click-nativa-sandshell',
        description: 'Organisch steendessin in zachte Sandshell-kleurstelling (450×907mm). Natuurlijke uitstraling met de duurzaamheid van Invictus Maximus — perfect voor badkamers en keukens.',
        imageUrl: '/images/brands/invictus/maximus-click/nativa-sandshell.webp',
        specs: {
          'Collectie': 'Maximus Click',
          'Afmeting': '450 × 907 mm',
          'Patroon': 'Tegel',
          'Topslijtlaag': '0,55 mm + Scratchmaster®',
          'Installatie': 'Rigid Click',
          'Geluidsisolatie': '20 dB',
          'Waterbestendig': 'Ja',
          'Vloerverwarming': 'Ja',
          'Garantie wonen': '25 jaar',
          'Garantie project': '15 jaar',
        }
      },
      {
        name: 'Regency Oak – Scone',
        slug: 'maximus-click-regency-oak-scone',
        description: 'Verfijnde eikenlook in zachte Scone-tinten (241×1518mm). Een stijlvolle keuze voor representatieve ruimtes met rigid click-installatie en 20 dB geluidsisolatie.',
        imageUrl: '/images/brands/invictus/maximus-click/regency-oak-scone.webp',
        specs: {
          'Collectie': 'Maximus Click',
          'Afmeting': '241 × 1518 mm',
          'Topslijtlaag': '0,55 mm + Scratchmaster®',
          'Installatie': 'Rigid Click',
          'Geluidsisolatie': '20 dB',
          'Waterbestendig': 'Ja',
          'Vloerverwarming': 'Ja',
          'Garantie wonen': '25 jaar',
          'Garantie project': '15 jaar',
        }
      },
      {
        name: 'Premium Oak – Ecru',
        slug: 'maximus-click-premium-oak-ecru',
        description: 'Lichte, crèmekleurige eikenlook in Ecru-tint (225×1500mm). Geeft ruimtes een frisse, luchtige uitstraling met maximale slijtvastheid en rigid click-comfort.',
        imageUrl: '/images/brands/invictus/maximus-click/premium-oak-ecru.webp',
        specs: {
          'Collectie': 'Maximus Click',
          'Afmeting': '225 × 1500 mm',
          'Topslijtlaag': '0,55 mm + Scratchmaster®',
          'Installatie': 'Rigid Click',
          'Geluidsisolatie': '20 dB',
          'Waterbestendig': 'Ja',
          'Vloerverwarming': 'Ja',
          'Garantie wonen': '25 jaar',
          'Garantie project': '15 jaar',
        }
      },
      {
        name: 'Tropical Forest – Havana',
        slug: 'maximus-click-tropical-forest-havana',
        description: 'Exotisch tropisch houtdessin in rijke Havana-tinten (228×1210mm). Brengt de warmte van het regenwoud in huis met maximale slijtbestendigheid en eenvoudige click-installatie.',
        imageUrl: '/images/brands/invictus/maximus-click/tropical-forest-havana.webp',
        specs: {
          'Collectie': 'Maximus Click',
          'Afmeting': '228 × 1210 mm',
          'Topslijtlaag': '0,55 mm + Scratchmaster®',
          'Installatie': 'Rigid Click',
          'Geluidsisolatie': '20 dB',
          'Waterbestendig': 'Ja',
          'Vloerverwarming': 'Ja',
          'Garantie wonen': '25 jaar',
          'Garantie project': '15 jaar',
        }
      },
      {
        name: 'Velvet Oak – Celeste',
        slug: 'maximus-click-velvet-oak-celeste',
        description: 'Fluweelzachte eikenlook in hemelsblauwe Celeste-tinten als slanke plank (177×1210mm). Combineert stijl met topkwaliteit slijtlaag voor dagelijks gebruik.',
        imageUrl: '/images/brands/invictus/maximus-click/velvet-oak-celeste.webp',
        specs: {
          'Collectie': 'Maximus Click',
          'Afmeting': '177 × 1210 mm',
          'Topslijtlaag': '0,55 mm + Scratchmaster®',
          'Installatie': 'Rigid Click',
          'Geluidsisolatie': '20 dB',
          'Waterbestendig': 'Ja',
          'Vloerverwarming': 'Ja',
          'Garantie wonen': '25 jaar',
          'Garantie project': '15 jaar',
        }
      },
      {
        name: 'Groovy Granite – Alabaster',
        slug: 'maximus-click-groovy-granite-alabaster',
        description: 'Krachtig granietdessin in stralend Alabaster-wit (467×908mm). Geeft badkamers, keukens en commerciële ruimtes een luxe steenlook met optimale slijtvastheid.',
        imageUrl: '/images/brands/invictus/maximus-click/groovy-granite-alabaster.webp',
        specs: {
          'Collectie': 'Maximus Click',
          'Afmeting': '467 × 908 mm',
          'Patroon': 'Tegel',
          'Topslijtlaag': '0,55 mm + Scratchmaster®',
          'Installatie': 'Rigid Click',
          'Geluidsisolatie': '20 dB',
          'Waterbestendig': 'Ja',
          'Vloerverwarming': 'Ja',
          'Garantie wonen': '25 jaar',
          'Garantie project': '15 jaar',
        }
      },
      {
        name: 'Hudson Stone – Silver',
        slug: 'maximus-click-hudson-stone-silver',
        description: 'Koele steenlook in zilvergrijs Hudson Stone-dessin (450×907mm). Een moderne, stijlvolle keuze voor badkamers, keukens en commerciële projecten met rigid click.',
        imageUrl: '/images/brands/invictus/maximus-click/hudson-stone-silver.webp',
        specs: {
          'Collectie': 'Maximus Click',
          'Afmeting': '450 × 907 mm',
          'Patroon': 'Tegel',
          'Topslijtlaag': '0,55 mm + Scratchmaster®',
          'Installatie': 'Rigid Click',
          'Geluidsisolatie': '20 dB',
          'Waterbestendig': 'Ja',
          'Vloerverwarming': 'Ja',
          'Garantie wonen': '25 jaar',
          'Garantie project': '15 jaar',
        }
      },
      {
        name: 'French Oak – Polar',
        slug: 'maximus-click-french-oak-polar',
        description: 'Frans eikenhout in ijskoude Polar-wittinten (178×1213mm). Lichte, ruimtelijke uitstraling voor slaapkamers en woonruimtes met een Scandinavische touch.',
        imageUrl: '/images/brands/invictus/maximus-click/french-oak-polar.webp',
        specs: {
          'Collectie': 'Maximus Click',
          'Afmeting': '178 × 1213 mm',
          'Topslijtlaag': '0,55 mm + Scratchmaster®',
          'Installatie': 'Rigid Click',
          'Geluidsisolatie': '20 dB',
          'Waterbestendig': 'Ja',
          'Vloerverwarming': 'Ja',
          'Garantie wonen': '25 jaar',
          'Garantie project': '15 jaar',
        }
      },
      {
        name: 'Concrete Crush – Smoke',
        slug: 'maximus-click-concrete-crush-smoke',
        description: 'Industrieel betondessin in diepgrijze Smoke-kleurstelling (298×603mm). Geeft elke ruimte een urban, stoere uitstraling met maximale gebruiksklasse en rigid click-gemak.',
        imageUrl: '/images/brands/invictus/maximus-click/concrete-crush-smoke.webp',
        specs: {
          'Collectie': 'Maximus Click',
          'Afmeting': '298 × 603 mm',
          'Patroon': 'Tegel',
          'Topslijtlaag': '0,55 mm + Scratchmaster®',
          'Installatie': 'Rigid Click',
          'Geluidsisolatie': '20 dB',
          'Waterbestendig': 'Ja',
          'Vloerverwarming': 'Ja',
          'Garantie wonen': '25 jaar',
          'Garantie project': '15 jaar',
        }
      },
      {
        name: 'Cosmopolitan – Golden Cream',
        slug: 'maximus-click-cosmopolitan-golden-cream',
        description: 'Chique steentegel in warme Golden Cream-tint (406×806mm). Een cosmopolitische, tijdloze keuze voor representatieve woon- en projectruimtes met rigid click-installatie.',
        imageUrl: '/images/brands/invictus/maximus-click/cosmopolitan-golden-cream.webp',
        specs: {
          'Collectie': 'Maximus Click',
          'Afmeting': '406 × 806 mm',
          'Patroon': 'Tegel',
          'Topslijtlaag': '0,55 mm + Scratchmaster®',
          'Installatie': 'Rigid Click',
          'Geluidsisolatie': '20 dB',
          'Waterbestendig': 'Ja',
          'Vloerverwarming': 'Ja',
          'Garantie wonen': '25 jaar',
          'Garantie project': '15 jaar',
        }
      },
      {
        name: 'Highland Oak – Classic',
        slug: 'maximus-click-highland-oak-classic',
        description: 'Hooglander eikenlook in tijdloze Classic-kleurstelling, gelegd in visgraatpatroon (145×743mm). Robuust karakter met Scratchmaster® bescherming en rigid click-installatie.',
        imageUrl: '/images/brands/invictus/maximus-click/highland-oak-classic.webp',
        specs: {
          'Collectie': 'Maximus Click',
          'Afmeting': '145 × 743 mm',
          'Patroon': 'Visgraat',
          'Topslijtlaag': '0,55 mm + Scratchmaster®',
          'Installatie': 'Rigid Click',
          'Geluidsisolatie': '20 dB',
          'Waterbestendig': 'Ja',
          'Vloerverwarming': 'Ja',
          'Garantie wonen': '25 jaar',
          'Garantie project': '15 jaar',
        }
      },
      {
        name: 'Cashmere Oak – Sunny',
        slug: 'maximus-looselay-cashmere-oak-sunny',
        description: 'Zachte eikenlook in zonnige Sunny-kleurstelling (229×1219mm). Losleg-systeem zonder lijm of klik — ideaal voor snelle renovaties met 7 dB geluidsisolatie.',
        imageUrl: '/images/brands/invictus/maximus-looselay/cashmere-oak-sunny.webp',
        specs: { 'Collectie': 'Maximus Looselay', 'Afmeting': '229 × 1219 mm', 'Topslijtlaag': '0,55 mm + Scratchmaster®', 'Installatie': 'Loose Lay (losleg)', 'Geluidsisolatie': '7 dB', 'Waterbestendig': 'Ja', 'Vloerverwarming': 'Ja', 'Garantie wonen': '25 jaar', 'Garantie project': '15 jaar' }
      },
      {
        name: 'Divine Oak – Champagne',
        slug: 'maximus-looselay-divine-oak-champagne',
        description: 'Weelderige eikenlook in verfijnde Champagne-tinten (229×1219mm). Losleg-systeem voor snelle installatie met maximale slijtvastheid en 7 dB geluidsisolatie.',
        imageUrl: '/images/brands/invictus/maximus-looselay/divine-oak-champagne.webp',
        specs: { 'Collectie': 'Maximus Looselay', 'Afmeting': '229 × 1219 mm', 'Topslijtlaag': '0,55 mm + Scratchmaster®', 'Installatie': 'Loose Lay (losleg)', 'Geluidsisolatie': '7 dB', 'Waterbestendig': 'Ja', 'Vloerverwarming': 'Ja', 'Garantie wonen': '25 jaar', 'Garantie project': '15 jaar' }
      },
      {
        name: 'Manhattan – Sky',
        slug: 'maximus-looselay-manhattan-sky',
        description: 'Moderne steenlook in Sky-kleurstelling (457×914mm). Losleg-systeem zonder lijm of klik — ideaal voor snelle renovaties met 7 dB geluidsisolatie.',
        imageUrl: '/images/brands/invictus/maximus-looselay/manhattan-sky.webp',
        specs: { 'Collectie': 'Maximus Looselay', 'Afmeting': '457 × 914 mm', 'Patroon': 'Tegel', 'Topslijtlaag': '0,55 mm + Scratchmaster®', 'Installatie': 'Loose Lay (losleg)', 'Geluidsisolatie': '7 dB', 'Waterbestendig': 'Ja', 'Vloerverwarming': 'Ja', 'Garantie wonen': '25 jaar', 'Garantie project': '15 jaar' }
      },
      {
        name: 'Nativa – Moon',
        slug: 'maximus-looselay-nativa-moon',
        description: 'Organisch steendessin in maanwitte Moon-kleurstelling (457×914mm). Losleg-tegel voor snelle installatie in badkamers en keukens met 7 dB geluidsisolatie.',
        imageUrl: '/images/brands/invictus/maximus-looselay/nativa-moon.webp',
        specs: { 'Collectie': 'Maximus Looselay', 'Afmeting': '457 × 914 mm', 'Patroon': 'Tegel', 'Topslijtlaag': '0,55 mm + Scratchmaster®', 'Installatie': 'Loose Lay (losleg)', 'Geluidsisolatie': '7 dB', 'Waterbestendig': 'Ja', 'Vloerverwarming': 'Ja', 'Garantie wonen': '25 jaar', 'Garantie project': '15 jaar' }
      },
      {
        name: 'Premium Oak – Flax',
        slug: 'maximus-looselay-premium-oak-flax',
        description: 'Hoogwaardige eikenlook in warme Flax-tint (229×1219mm). Losleg-plank voor snelle renovaties met 0,55 mm Scratchmaster® slijtlaag en 7 dB geluidsisolatie.',
        imageUrl: '/images/brands/invictus/maximus-looselay/premium-oak-flax.webp',
        specs: { 'Collectie': 'Maximus Looselay', 'Afmeting': '229 × 1219 mm', 'Topslijtlaag': '0,55 mm + Scratchmaster®', 'Installatie': 'Loose Lay (losleg)', 'Geluidsisolatie': '7 dB', 'Waterbestendig': 'Ja', 'Vloerverwarming': 'Ja', 'Garantie wonen': '25 jaar', 'Garantie project': '15 jaar' }
      },
      {
        name: 'Tropical Forest – Havana',
        slug: 'maximus-looselay-tropical-forest-havana',
        description: 'Exotisch tropisch houtdessin in rijke Havana-tinten (229×1219mm). Losleg-systeem brengt de warmte van het regenwoud in huis zonder lijm of klik.',
        imageUrl: '/images/brands/invictus/maximus-looselay/tropical-forest-havana.webp',
        specs: { 'Collectie': 'Maximus Looselay', 'Afmeting': '229 × 1219 mm', 'Topslijtlaag': '0,55 mm + Scratchmaster®', 'Installatie': 'Loose Lay (losleg)', 'Geluidsisolatie': '7 dB', 'Waterbestendig': 'Ja', 'Vloerverwarming': 'Ja', 'Garantie wonen': '25 jaar', 'Garantie project': '15 jaar' }
      },
      {
        name: 'Saxon Oak – Fuego',
        slug: 'primus-dryback-saxon-oak-fuego',
        description: 'Robuste eikenhouttint in Fuego-kleurstelling (228×1500mm). Verlijmde vinylvloer met 0,30 mm Scratchmaster® slijtlaag — uitstekende prijs-kwaliteitverhouding.',
        imageUrl: '/images/brands/invictus/primus-dryback/saxon-oak-fuego.webp',
        specs: { 'Collectie': 'Primus Dryback', 'Afmeting': '228 × 1500 mm', 'Topslijtlaag': '0,30 mm + Scratchmaster®', 'Installatie': 'Dryback (verlijmd)', 'Geluidsisolatie': '3 dB', 'Waterbestendig': 'Ja', 'Vloerverwarming': 'Ja', 'Garantie wonen': '20 jaar', 'Garantie project': '10 jaar' }
      },
      {
        name: 'Sherwood Oak – Natural',
        slug: 'primus-dryback-sherwood-oak-natural',
        description: 'Klassieke eikenhouttint in Natural-kleurstelling (178×1219mm). Tijdloze uitstraling met verlijmde installatie en 0,30 mm Scratchmaster® slijtlaag.',
        imageUrl: '/images/brands/invictus/primus-dryback/sherwood-oak-natural.webp',
        specs: { 'Collectie': 'Primus Dryback', 'Afmeting': '178 × 1219 mm', 'Topslijtlaag': '0,30 mm + Scratchmaster®', 'Installatie': 'Dryback (verlijmd)', 'Geluidsisolatie': '3 dB', 'Waterbestendig': 'Ja', 'Vloerverwarming': 'Ja', 'Garantie wonen': '20 jaar', 'Garantie project': '10 jaar' }
      },
      {
        name: 'Royal Oak – Blonde',
        slug: 'primus-dryback-royal-oak-blonde',
        description: 'Lichte, blondekleurige eikenlook in Royal Oak-dessin (178×1219mm). Frisse, moderne uitstraling voor woonruimtes met een budgetvriendelijke vinyloplossing.',
        imageUrl: '/images/brands/invictus/primus-dryback/royal-oak-blonde.webp',
        specs: { 'Collectie': 'Primus Dryback', 'Afmeting': '178 × 1219 mm', 'Topslijtlaag': '0,30 mm + Scratchmaster®', 'Installatie': 'Dryback (verlijmd)', 'Geluidsisolatie': '3 dB', 'Waterbestendig': 'Ja', 'Vloerverwarming': 'Ja', 'Garantie wonen': '20 jaar', 'Garantie project': '10 jaar' }
      },
      {
        name: 'York Stone – Powder',
        slug: 'primus-dryback-york-stone-powder',
        description: 'Steentegel in zacht Powder-kleurstelling (305×610mm). Subtiele steenlook voor badkamers, keukens en natte ruimtes met waterbestendige verlijmde installatie.',
        imageUrl: '/images/brands/invictus/primus-dryback/york-stone-powder.webp',
        specs: { 'Collectie': 'Primus Dryback', 'Afmeting': '305 × 610 mm', 'Patroon': 'Tegel', 'Topslijtlaag': '0,30 mm + Scratchmaster®', 'Installatie': 'Dryback (verlijmd)', 'Geluidsisolatie': '3 dB', 'Waterbestendig': 'Ja', 'Vloerverwarming': 'Ja', 'Garantie wonen': '20 jaar', 'Garantie project': '10 jaar' }
      },
      {
        name: 'Cashmere Oak – Beach',
        slug: 'primus-dryback-cashmere-oak-beach',
        description: 'Zachte eikenhouttint in warme Beach-kleurstelling (228×1500mm). Geeft woonkamers en slaapkamers een zomerse, ontspannen sfeer tegen een scherpe prijs.',
        imageUrl: '/images/brands/invictus/primus-dryback/cashmere-oak-beach.webp',
        specs: { 'Collectie': 'Primus Dryback', 'Afmeting': '228 × 1500 mm', 'Topslijtlaag': '0,30 mm + Scratchmaster®', 'Installatie': 'Dryback (verlijmd)', 'Geluidsisolatie': '3 dB', 'Waterbestendig': 'Ja', 'Vloerverwarming': 'Ja', 'Garantie wonen': '20 jaar', 'Garantie project': '10 jaar' }
      },
      {
        name: 'Bourbon Oak – Granola',
        slug: 'primus-dryback-bourbon-oak-granola',
        description: 'Warme eikenlook in aardse Granola-tinten (178×1219mm). Gezellige, landelijke uitstraling met de praktische voordelen van een verlijmde vinylvloer.',
        imageUrl: '/images/brands/invictus/primus-dryback/bourbon-oak-granola.webp',
        specs: { 'Collectie': 'Primus Dryback', 'Afmeting': '178 × 1219 mm', 'Topslijtlaag': '0,30 mm + Scratchmaster®', 'Installatie': 'Dryback (verlijmd)', 'Geluidsisolatie': '3 dB', 'Waterbestendig': 'Ja', 'Vloerverwarming': 'Ja', 'Garantie wonen': '20 jaar', 'Garantie project': '10 jaar' }
      },
      {
        name: 'Manhattan – Sky',
        slug: 'primus-dryback-manhattan-sky',
        description: 'Urbane tegellook in hemelblauwe Sky-kleurstelling (457×914mm). Modern en stijlvol voor badkamers en keukens met een grote formaat tegel-uitstraling.',
        imageUrl: '/images/brands/invictus/primus-dryback/manhattan-sky.webp',
        specs: { 'Collectie': 'Primus Dryback', 'Afmeting': '457 × 914 mm', 'Patroon': 'Tegel', 'Topslijtlaag': '0,30 mm + Scratchmaster®', 'Installatie': 'Dryback (verlijmd)', 'Geluidsisolatie': '3 dB', 'Waterbestendig': 'Ja', 'Vloerverwarming': 'Ja', 'Garantie wonen': '20 jaar', 'Garantie project': '10 jaar' }
      },
      {
        name: 'Pure Marble – Snow',
        slug: 'primus-dryback-pure-marble-snow',
        description: 'Strakke marmerlook in witte Snow-kleurstelling (457×914mm). Geeft badkamers en woonruimtes een luxueuze uitstraling tegen een aantrekkelijke prijs.',
        imageUrl: '/images/brands/invictus/primus-dryback/pure-marble-snow.webp',
        specs: { 'Collectie': 'Primus Dryback', 'Afmeting': '457 × 914 mm', 'Patroon': 'Tegel', 'Topslijtlaag': '0,30 mm + Scratchmaster®', 'Installatie': 'Dryback (verlijmd)', 'Geluidsisolatie': '3 dB', 'Waterbestendig': 'Ja', 'Vloerverwarming': 'Ja', 'Garantie wonen': '20 jaar', 'Garantie project': '10 jaar' }
      },
      {
        name: 'Riviera Oak – Caramel',
        slug: 'primus-dryback-riviera-oak-caramel',
        description: 'Zonnige eikenhouttint in warme Caramel-kleurstelling (178×1219mm). Mediterrane sfeer voor woonkamers en keukens met een betaalbare verlijmde vinylvloer.',
        imageUrl: '/images/brands/invictus/primus-dryback/riviera-oak-caramel.webp',
        specs: { 'Collectie': 'Primus Dryback', 'Afmeting': '178 × 1219 mm', 'Topslijtlaag': '0,30 mm + Scratchmaster®', 'Installatie': 'Dryback (verlijmd)', 'Geluidsisolatie': '3 dB', 'Waterbestendig': 'Ja', 'Vloerverwarming': 'Ja', 'Garantie wonen': '20 jaar', 'Garantie project': '10 jaar' }
      },
      {
        name: 'Manhattan – Sky',
        slug: 'primus-click-manhattan-sky',
        description: 'Moderne steenlook in Sky-kleurstelling (450×907mm). Rigid click-systeem met 17 dB geluidsisolatie en 0,30 mm Scratchmaster® slijtlaag.',
        imageUrl: '/images/brands/invictus/primus-click/manhattan-sky.webp',
        specs: { 'Collectie': 'Primus Click', 'Afmeting': '450 × 907 mm', 'Patroon': 'Tegel', 'Topslijtlaag': '0,30 mm + Scratchmaster®', 'Installatie': 'Rigid Click', 'Geluidsisolatie': '17 dB', 'Waterbestendig': 'Ja', 'Vloerverwarming': 'Ja', 'Garantie wonen': '20 jaar', 'Garantie project': '10 jaar' }
      },
      {
        name: 'Riviera Oak – Caramel',
        slug: 'primus-click-riviera-oak-caramel',
        description: 'Warme eikenhouttint in Caramel-kleurstelling (177×1210mm). Rigid click-systeem met 17 dB geluidsisolatie en 0,30 mm Scratchmaster® slijtlaag.',
        imageUrl: '/images/brands/invictus/primus-click/riviera-oak-caramel.webp',
        specs: { 'Collectie': 'Primus Click', 'Afmeting': '177 × 1210 mm', 'Topslijtlaag': '0,30 mm + Scratchmaster®', 'Installatie': 'Rigid Click', 'Geluidsisolatie': '17 dB', 'Waterbestendig': 'Ja', 'Vloerverwarming': 'Ja', 'Garantie wonen': '20 jaar', 'Garantie project': '10 jaar' }
      },
      {
        name: 'Pure Marble – Snow',
        slug: 'primus-click-pure-marble-snow',
        description: 'Strakke marmerlook in Snow-kleurstelling (450×907mm). Rigid click-systeem met 17 dB geluidsisolatie en 0,30 mm Scratchmaster® slijtlaag.',
        imageUrl: '/images/brands/invictus/primus-click/pure-marble-snow.webp',
        specs: { 'Collectie': 'Primus Click', 'Afmeting': '450 × 907 mm', 'Patroon': 'Tegel', 'Topslijtlaag': '0,30 mm + Scratchmaster®', 'Installatie': 'Rigid Click', 'Geluidsisolatie': '17 dB', 'Waterbestendig': 'Ja', 'Vloerverwarming': 'Ja', 'Garantie wonen': '20 jaar', 'Garantie project': '10 jaar' }
      },
      {
        name: 'Sherwood Oak – Natural',
        slug: 'primus-click-sherwood-oak-natural',
        description: 'Klassieke eikenhouttint in Natural-kleurstelling (177×1210mm). Rigid click-systeem met 17 dB geluidsisolatie en 0,30 mm Scratchmaster® slijtlaag.',
        imageUrl: '/images/brands/invictus/primus-click/sherwood-oak-natural.webp',
        specs: { 'Collectie': 'Primus Click', 'Afmeting': '177 × 1210 mm', 'Topslijtlaag': '0,30 mm + Scratchmaster®', 'Installatie': 'Rigid Click', 'Geluidsisolatie': '17 dB', 'Waterbestendig': 'Ja', 'Vloerverwarming': 'Ja', 'Garantie wonen': '20 jaar', 'Garantie project': '10 jaar' }
      },
      {
        name: 'Bourbon Oak – Granola',
        slug: 'primus-click-bourbon-oak-granola',
        description: 'Rijke eikenhouttint in Granola-kleurstelling (177×1210mm). Rigid click-systeem met 17 dB geluidsisolatie en 0,30 mm Scratchmaster® slijtlaag.',
        imageUrl: '/images/brands/invictus/primus-click/bourbon-oak-granola.webp',
        specs: { 'Collectie': 'Primus Click', 'Afmeting': '177 × 1210 mm', 'Topslijtlaag': '0,30 mm + Scratchmaster®', 'Installatie': 'Rigid Click', 'Geluidsisolatie': '17 dB', 'Waterbestendig': 'Ja', 'Vloerverwarming': 'Ja', 'Garantie wonen': '20 jaar', 'Garantie project': '10 jaar' }
      },
      {
        name: 'Royal Oak – Blonde',
        slug: 'primus-click-royal-oak-blonde',
        description: 'Lichte, blondekleurige eikenlook in Royal Oak-dessin (181×1213mm). Rigid click-systeem met 17 dB geluidsisolatie en 0,30 mm Scratchmaster® slijtlaag.',
        imageUrl: '/images/brands/invictus/primus-click/royal-oak-blonde.webp',
        specs: { 'Collectie': 'Primus Click', 'Afmeting': '181 × 1213 mm', 'Topslijtlaag': '0,30 mm + Scratchmaster®', 'Installatie': 'Rigid Click', 'Geluidsisolatie': '17 dB', 'Waterbestendig': 'Ja', 'Vloerverwarming': 'Ja', 'Garantie wonen': '20 jaar', 'Garantie project': '10 jaar' }
      },
      {
        name: 'Cashmere Oak – Beach',
        slug: 'primus-click-cashmere-oak-beach',
        description: 'Zachte, lichte eikenhouttint in Beach-kleurstelling (225×1500mm). Rigid click-systeem met 17 dB geluidsisolatie en 0,30 mm Scratchmaster® slijtlaag.',
        imageUrl: '/images/brands/invictus/primus-click/cashmere-oak-beach.webp',
        specs: { 'Collectie': 'Primus Click', 'Afmeting': '225 × 1500 mm', 'Topslijtlaag': '0,30 mm + Scratchmaster®', 'Installatie': 'Rigid Click', 'Geluidsisolatie': '17 dB', 'Waterbestendig': 'Ja', 'Vloerverwarming': 'Ja', 'Garantie wonen': '20 jaar', 'Garantie project': '10 jaar' }
      },
      {
        name: 'Saxon Oak – Fuego',
        slug: 'primus-click-saxon-oak-fuego',
        description: 'Robuste eikenhouttint in Fuego-kleurstelling (225×1500mm). Rigid click-systeem met 17 dB geluidsisolatie en 0,30 mm Scratchmaster® slijtlaag.',
        imageUrl: '/images/brands/invictus/primus-click/saxon-oak-fuego.webp',
        specs: { 'Collectie': 'Primus Click', 'Afmeting': '225 × 1500 mm', 'Topslijtlaag': '0,30 mm + Scratchmaster®', 'Installatie': 'Rigid Click', 'Geluidsisolatie': '17 dB', 'Waterbestendig': 'Ja', 'Vloerverwarming': 'Ja', 'Garantie wonen': '20 jaar', 'Garantie project': '10 jaar' }
      },
      {
        name: 'York Stone – Powder',
        slug: 'primus-click-york-stone-powder',
        description: 'Subtiele steenlook in Powder-kleurstelling (309×603mm). Rigid click-systeem met 17 dB geluidsisolatie en 0,30 mm Scratchmaster® slijtlaag.',
        imageUrl: '/images/brands/invictus/primus-click/york-stone-powder.webp',
        specs: { 'Collectie': 'Primus Click', 'Afmeting': '309 × 603 mm', 'Patroon': 'Tegel', 'Topslijtlaag': '0,30 mm + Scratchmaster®', 'Installatie': 'Rigid Click', 'Geluidsisolatie': '17 dB', 'Waterbestendig': 'Ja', 'Vloerverwarming': 'Ja', 'Garantie wonen': '20 jaar', 'Garantie project': '10 jaar' }
      }
    ]
  },
  {
    name: 'Gerflor – Creation Collectie',
    slug: 'gerflor-creation',
    logoUrl: 'https://floorsandmore.eu/wp-content/uploads/gerflor-logo-960x353.png',
    website: 'https://www.gerflor.nl',
    description: 'Frans merk, opgericht 1937. Milieubewust: geen zware metalen of formaldehyde. Antistatisch, antibacterieel, vuilafstotend. PUR-oppervlaktebehandeling.',
    shortDescription: 'Milieubewust Frans merk met PUR-oppervlaktebehandeling.',
    featured: false,
    materials: ['PVC'],
    moodImages: [
      'https://images.unsplash.com/photo-1598928506311-c55ded91a20c?auto=format&fit=crop&q=80&w=1200',
      'https://images.unsplash.com/photo-1560448205-4d9b3e6bb6db?auto=format&fit=crop&q=80&w=1200',
      'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&q=80&w=1200'
    ],
    products: [
      {
        name: 'Creation 30',
        slug: 'creation-30',
        description: 'Geschikt voor wonen en licht project en bestaat uit 35% gerecyclede materialen.',
        imageUrl: 'https://images.unsplash.com/photo-1616486029423-aaa4789e8c9a?auto=format&fit=crop&q=80&w=600',
        specs: { 'Topslijtlaag': '0,30 mm', 'Legsysteem': 'Dryback / Rigid Acoustic Click', 'Vloerverwarming': 'Ja', 'Waterbestendig': 'Ja' }
      },
      {
        name: 'Creation 55 / Virtuo 55',
        slug: 'creation-55',
        description: 'Geschikt voor intensief wonen en commercieel gebruik.',
        imageUrl: 'https://images.unsplash.com/photo-1589939705384-5185137a7f0f?auto=format&fit=crop&q=80&w=600',
        specs: { 'Topslijtlaag': '0,55 mm', 'Legsysteem': 'Dryback / Rigid Acoustic Click', 'Vloerverwarming': 'Ja', 'Waterbestendig': 'Ja' }
      }
    ]
  },
  {
    name: 'Castell',
    slug: 'castell',
    logoUrl: 'https://www.tete.nl/wp-content/uploads/2024/06/Castell-logo-Luxury-pvc-flooring-witte-achtergrond-1.webp',
    website: 'https://hetvloerenmagazijn.nl/merk/castell/',
    description: 'Exclusief PVC merk. A+ klasse kwaliteit. Ultra matte toplaag van 0,70 mm. EIR techniek (Embossed in Register). Ftalaat-vrij. Minimaal 10 jaar garantie.',
    shortDescription: 'Exclusief merk, ultra mat met een 0,70 mm sterke toplaag.',
    featured: true,
    materials: ['PVC'],
    moodImages: [
      'https://images.unsplash.com/photo-1598928506311-c55ded91a20c?auto=format&fit=crop&q=80&w=1200',
      'https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&q=80&w=1200',
      'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&q=80&w=1200'
    ],
    products: [
      // ── Castell Premium – Rechte plank XL ──
      {
        name: 'Premium – Ranch',
        slug: 'castell-premium-ranch',
        description: 'Rechte plank XL in kleur Ranch (0456). Ultra matte 0,70 mm toplaag met EIR-reliëf voor een natuurgetrouwe houtuitstraling. Dryback (verlijmd) legsysteem.',
        imageUrl: '/images/brands/castell/premium-ranch.webp',
        specs: {
          'Serie': 'Castell Premium',
          'Kleur': 'Ranch (0456)',
          'Patroon': 'Rechte plank XL',
          'Topslijtlaag': '0,70 mm',
          'Legsysteem': 'Dryback (verlijmd)',
          'Technologie': 'EIR',
          'Milieu': 'Ftalaat-vrij',
          'Garantie': 'Minimaal 10 jaar',
        }
      },
      {
        name: 'Premium – Silk Oat',
        slug: 'castell-premium-silk-oat',
        description: 'Rechte plank XL in kleur Silk Oat (532). Ultra matte 0,70 mm toplaag met EIR-reliëf. Dryback (verlijmd) legsysteem.',
        imageUrl: '/images/brands/castell/premium-silk-oat.webp',
        specs: {
          'Serie': 'Castell Premium',
          'Kleur': 'Silk Oat (532)',
          'Patroon': 'Rechte plank XL',
          'Topslijtlaag': '0,70 mm',
          'Legsysteem': 'Dryback (verlijmd)',
          'Technologie': 'EIR',
          'Milieu': 'Ftalaat-vrij',
          'Garantie': 'Minimaal 10 jaar',
        }
      },
      {
        name: 'Premium – Chatillon Ginger',
        slug: 'castell-premium-chatillon-ginger',
        description: 'Rechte plank XL in kleur Chatillon Ginger (992). Ultra matte 0,70 mm toplaag met EIR-reliëf. Dryback (verlijmd) legsysteem.',
        imageUrl: '/images/brands/castell/premium-chatillon-ginger.webp',
        specs: {
          'Serie': 'Castell Premium',
          'Kleur': 'Chatillon Ginger (992)',
          'Patroon': 'Rechte plank XL',
          'Topslijtlaag': '0,70 mm',
          'Legsysteem': 'Dryback (verlijmd)',
          'Technologie': 'EIR',
          'Milieu': 'Ftalaat-vrij',
          'Garantie': 'Minimaal 10 jaar',
        }
      },
      // ── Castell Premium – Visgraat XL ──
      {
        name: 'Premium Visgraat – 8017',
        slug: 'castell-premium-visgraat-8017',
        description: 'Visgraat XL in kleur 8017. Tijdloos visgraatpatroon met ultra matte 0,70 mm toplaag en EIR-reliëf. Dryback (verlijmd) legsysteem.',
        imageUrl: '/images/brands/castell/premium-visgraat-8017.webp',
        specs: {
          'Serie': 'Castell Premium',
          'Kleur': '8017',
          'Patroon': 'Visgraat XL',
          'Topslijtlaag': '0,70 mm',
          'Legsysteem': 'Dryback (verlijmd)',
          'Technologie': 'EIR',
          'Milieu': 'Ftalaat-vrij',
          'Garantie': 'Minimaal 10 jaar',
        }
      },
      {
        name: 'Premium Visgraat – Quartet',
        slug: 'castell-premium-visgraat-quartet',
        description: 'Visgraat XL in kleur Quartet (0503). Klassiek visgraatpatroon met ultra matte 0,70 mm toplaag en EIR-reliëf. Dryback (verlijmd) legsysteem.',
        imageUrl: '/images/brands/castell/premium-visgraat-quartet.webp',
        specs: {
          'Serie': 'Castell Premium',
          'Kleur': 'Quartet (0503)',
          'Patroon': 'Visgraat XL',
          'Topslijtlaag': '0,70 mm',
          'Legsysteem': 'Dryback (verlijmd)',
          'Technologie': 'EIR',
          'Milieu': 'Ftalaat-vrij',
          'Garantie': 'Minimaal 10 jaar',
        }
      },
      // ── Castell Supreme – Rechte plank XXL ──
      {
        name: 'Supreme – Caramel (Plank)',
        slug: 'castell-supreme-caramel-plank',
        description: 'Supreme XXL rechte plank in kleur Caramel (132). Topmodel met ultra matte 0,70 mm toplaag en EIR-reliëf. Dryback (verlijmd) legsysteem.',
        imageUrl: '/images/brands/castell/supreme-caramel-plank.webp',
        specs: {
          'Serie': 'Castell Supreme',
          'Kleur': 'Caramel (132)',
          'Patroon': 'Rechte plank XXL',
          'Topslijtlaag': '0,70 mm',
          'Legsysteem': 'Dryback (verlijmd)',
          'Technologie': 'EIR',
          'Milieu': 'Ftalaat-vrij',
          'Garantie': 'Minimaal 10 jaar',
        }
      },
      {
        name: 'Supreme – Coffee (Plank)',
        slug: 'castell-supreme-coffee-plank',
        description: 'Supreme XXL rechte plank in kleur Coffee (133). Warme donkere tint met ultra matte 0,70 mm toplaag en EIR-reliëf. Dryback (verlijmd) legsysteem.',
        imageUrl: '/images/brands/castell/supreme-coffee-plank.webp',
        specs: {
          'Serie': 'Castell Supreme',
          'Kleur': 'Coffee (133)',
          'Patroon': 'Rechte plank XXL',
          'Topslijtlaag': '0,70 mm',
          'Legsysteem': 'Dryback (verlijmd)',
          'Technologie': 'EIR',
          'Milieu': 'Ftalaat-vrij',
          'Garantie': 'Minimaal 10 jaar',
        }
      },
      {
        name: 'Supreme – Mokka (Plank)',
        slug: 'castell-supreme-mokka-plank',
        description: 'Supreme XXL rechte plank in kleur Mokka (135). Rijke aardse tint met ultra matte 0,70 mm toplaag en EIR-reliëf. Dryback (verlijmd) legsysteem.',
        imageUrl: '/images/brands/castell/supreme-mokka-plank.webp',
        specs: {
          'Serie': 'Castell Supreme',
          'Kleur': 'Mokka (135)',
          'Patroon': 'Rechte plank XXL',
          'Topslijtlaag': '0,70 mm',
          'Legsysteem': 'Dryback (verlijmd)',
          'Technologie': 'EIR',
          'Milieu': 'Ftalaat-vrij',
          'Garantie': 'Minimaal 10 jaar',
        }
      },
      {
        name: 'Supreme – Walnut (Plank)',
        slug: 'castell-supreme-walnut-plank',
        description: 'Supreme XXL rechte plank in kleur Walnut (119). Klassieke walnoot-uitstraling met ultra matte 0,70 mm toplaag en EIR-reliëf. Dryback (verlijmd) legsysteem.',
        imageUrl: '/images/brands/castell/supreme-walnut-plank.webp',
        specs: {
          'Serie': 'Castell Supreme',
          'Kleur': 'Walnut (119)',
          'Patroon': 'Rechte plank XXL',
          'Topslijtlaag': '0,70 mm',
          'Legsysteem': 'Dryback (verlijmd)',
          'Technologie': 'EIR',
          'Milieu': 'Ftalaat-vrij',
          'Garantie': 'Minimaal 10 jaar',
        }
      },
      // ── Castell Supreme – Walvisgraat (Herringbone XL) ──
      {
        name: 'Supreme – Caramel (Walvisgraat)',
        slug: 'castell-supreme-caramel-walvisgraat',
        description: 'Supreme walvisgraat XL in kleur Caramel (232). Topmodel herringbone-patroon met ultra matte 0,70 mm toplaag en EIR-reliëf. Dryback (verlijmd) legsysteem.',
        imageUrl: '/images/brands/castell/supreme-caramel-walvisgraat.webp',
        specs: {
          'Serie': 'Castell Supreme',
          'Kleur': 'Caramel (232)',
          'Patroon': 'Walvisgraat (Herringbone XL)',
          'Topslijtlaag': '0,70 mm',
          'Legsysteem': 'Dryback (verlijmd)',
          'Technologie': 'EIR',
          'Milieu': 'Ftalaat-vrij',
          'Garantie': 'Minimaal 10 jaar',
        }
      },
      {
        name: 'Supreme – Walnut (Walvisgraat)',
        slug: 'castell-supreme-walnut-walvisgraat',
        description: 'Supreme walvisgraat XL in kleur Walnut (219). Elegante herringbone-uitstraling met ultra matte 0,70 mm toplaag en EIR-reliëf. Dryback (verlijmd) legsysteem.',
        imageUrl: '/images/brands/castell/supreme-walnut-walvisgraat.webp',
        specs: {
          'Serie': 'Castell Supreme',
          'Kleur': 'Walnut (219)',
          'Patroon': 'Walvisgraat (Herringbone XL)',
          'Topslijtlaag': '0,70 mm',
          'Legsysteem': 'Dryback (verlijmd)',
          'Technologie': 'EIR',
          'Milieu': 'Ftalaat-vrij',
          'Garantie': 'Minimaal 10 jaar',
        }
      },
      {
        name: 'Supreme – Mokka (Walvisgraat)',
        slug: 'castell-supreme-mokka-walvisgraat',
        description: 'Supreme walvisgraat XL in kleur Mokka (235). Dieprijke mokka-tint in herringbone-patroon met ultra matte 0,70 mm toplaag en EIR-reliëf. Dryback (verlijmd) legsysteem.',
        imageUrl: '/images/brands/castell/supreme-mokka-walvisgraat.webp',
        specs: {
          'Serie': 'Castell Supreme',
          'Kleur': 'Mokka (235)',
          'Patroon': 'Walvisgraat (Herringbone XL)',
          'Topslijtlaag': '0,70 mm',
          'Legsysteem': 'Dryback (verlijmd)',
          'Technologie': 'EIR',
          'Milieu': 'Ftalaat-vrij',
          'Garantie': 'Minimaal 10 jaar',
        }
      },
      {
        name: 'Supreme – Coffee (Walvisgraat)',
        slug: 'castell-supreme-coffee-walvisgraat',
        description: 'Supreme walvisgraat XL in kleur Coffee (233). Warme koffietint in herringbone-patroon met ultra matte 0,70 mm toplaag en EIR-reliëf. Dryback (verlijmd) legsysteem.',
        imageUrl: '/images/brands/castell/supreme-coffee-walvisgraat.webp',
        specs: {
          'Serie': 'Castell Supreme',
          'Kleur': 'Coffee (233)',
          'Patroon': 'Walvisgraat (Herringbone XL)',
          'Topslijtlaag': '0,70 mm',
          'Legsysteem': 'Dryback (verlijmd)',
          'Technologie': 'EIR',
          'Milieu': 'Ftalaat-vrij',
          'Garantie': 'Minimaal 10 jaar',
        }
      },
      {
        name: 'Supreme – Sienna (Walvisgraat)',
        slug: 'castell-supreme-sienna-walvisgraat',
        description: 'Supreme walvisgraat XL in kleur Sienna (218). Warme terra-tint in herringbone-patroon met ultra matte 0,70 mm toplaag en EIR-reliëf. Dryback (verlijmd) legsysteem.',
        imageUrl: '/images/brands/castell/supreme-sienna-walvisgraat.webp',
        specs: {
          'Serie': 'Castell Supreme',
          'Kleur': 'Sienna (218)',
          'Patroon': 'Walvisgraat (Herringbone XL)',
          'Topslijtlaag': '0,70 mm',
          'Legsysteem': 'Dryback (verlijmd)',
          'Technologie': 'EIR',
          'Milieu': 'Ftalaat-vrij',
          'Garantie': 'Minimaal 10 jaar',
        }
      },
    ]
  },
  {
    name: 'Douwes Dekker',
    slug: 'douwes-dekker',
    logoUrl: '/images/brands/douwes-dekker/logo.webp',
    website: 'https://www.douwesdekker.nl',
    description: 'Douwes Dekker staat voor stijlvolle PVC-vloeren met een unieke, door Nederlandse lekkernijen geïnspireerde kleurcollectie. De vloeren zijn 100% waterbestendig, geschikt voor vloerverwarming en voorzien van een sterke 0,55 mm slijtlaag. Verkrijgbaar in klik- en plakvarianten, in formaten zoals riante planken, brede visgraat, Hongaarse punt en tegels.',
    shortDescription: 'Stijlvolle, 100% waterbestendige PVC-vloeren in unieke dessins — van visgraat tot Hongaarse punt.',
    featured: false,
    materials: ['PVC'],
    moodImages: [
      '/images/brands/douwes-dekker/mood-1.webp',
      '/images/brands/douwes-dekker/mood-2.webp',
      '/images/brands/douwes-dekker/mood-3.webp',
    ],
    products: [
      // ── Ambitieus – Brede Visgraat (Klik) ──
      {
        name: 'Brede Visgraat – Boterkoek (Klik)',
        slug: 'douwes-dekker-visgraat-boterkoek-klik',
        description: 'Warme, goudblonde eikenlook in visgraatpatroon. PVC-klikvloer uit de Ambitieus-collectie met geïntegreerde ondervloer en Micro 4V-vellingkant. Geschikt voor zwaar huishoudelijk én commercieel gebruik.',
        imageUrl: '/images/brands/douwes-dekker/visgraat-boterkoek.webp',
        specs: { 'Collectie': 'Ambitieus', 'Dessin': 'Boterkoek', 'Patroon': 'Brede visgraat', 'Afmeting': '720 × 180 mm', 'Dikte': '7 mm', 'Topslijtlaag': '0,55 mm', 'Installatie': 'Klik (zwevend)', 'Gebruiksklasse': '23 / 33', 'Waterbestendig': 'Ja (100%)', 'Vloerverwarming': 'Ja' }
      },
      {
        name: 'Brede Visgraat – Spekkoek (Klik)',
        slug: 'douwes-dekker-visgraat-spekkoek-klik',
        description: 'Donker, gelaagd eikendessin in visgraatpatroon. PVC-klikvloer met rijke kleurschakeringen en natuurgetrouwe houtstructuur. Ideaal voor sfeervolle woonruimtes.',
        imageUrl: '/images/brands/douwes-dekker/visgraat-spekkoek.webp',
        specs: { 'Collectie': 'Ambitieus', 'Dessin': 'Spekkoek', 'Patroon': 'Brede visgraat', 'Afmeting': '720 × 180 mm', 'Dikte': '7 mm', 'Topslijtlaag': '0,55 mm', 'Installatie': 'Klik (zwevend)', 'Gebruiksklasse': '23 / 33', 'Waterbestendig': 'Ja (100%)', 'Vloerverwarming': 'Ja' }
      },
      {
        name: 'Brede Visgraat – Honing (Klik)',
        slug: 'douwes-dekker-visgraat-honing-klik',
        description: 'Warme honingtint in visgraatpatroon. PVC-klikvloer met natuurlijke houtstructuur en geïntegreerde ondervloer. Creëert een gezellige, lichte sfeer in elke ruimte.',
        imageUrl: '/images/brands/douwes-dekker/visgraat-honing.webp',
        specs: { 'Collectie': 'Ambitieus', 'Dessin': 'Honing', 'Patroon': 'Brede visgraat', 'Afmeting': '720 × 180 mm', 'Dikte': '7 mm', 'Topslijtlaag': '0,55 mm', 'Installatie': 'Klik (zwevend)', 'Gebruiksklasse': '23 / 33', 'Waterbestendig': 'Ja (100%)', 'Vloerverwarming': 'Ja' }
      },
      {
        name: 'Brede Visgraat – Pepermunt (Klik)',
        slug: 'douwes-dekker-visgraat-pepermunt-klik',
        description: 'Koele, grijze eikenlook in visgraatpatroon. PVC-klikvloer met moderne uitstraling en Micro 4V-vellingkant. Perfect voor strakke, eigentijdse interieurs.',
        imageUrl: '/images/brands/douwes-dekker/visgraat-pepermunt.webp',
        specs: { 'Collectie': 'Ambitieus', 'Dessin': 'Pepermunt', 'Patroon': 'Brede visgraat', 'Afmeting': '720 × 180 mm', 'Dikte': '7 mm', 'Topslijtlaag': '0,55 mm', 'Installatie': 'Klik (zwevend)', 'Gebruiksklasse': '23 / 33', 'Waterbestendig': 'Ja (100%)', 'Vloerverwarming': 'Ja' }
      },
      {
        name: 'Brede Visgraat – Crème Brûlée (Klik)',
        slug: 'douwes-dekker-visgraat-creme-brulee-klik',
        description: 'Verfijnd, licht crèmekleurig eikendessin in visgraatpatroon. PVC-klikvloer met warme ondertoon en elegante uitstraling voor woon- en werkruimtes.',
        imageUrl: '/images/brands/douwes-dekker/visgraat-creme-brulee.webp',
        specs: { 'Collectie': 'Ambitieus', 'Dessin': 'Crème Brûlée', 'Patroon': 'Brede visgraat', 'Afmeting': '720 × 180 mm', 'Dikte': '7 mm', 'Topslijtlaag': '0,55 mm', 'Installatie': 'Klik (zwevend)', 'Gebruiksklasse': '23 / 33', 'Waterbestendig': 'Ja (100%)', 'Vloerverwarming': 'Ja' }
      },
      {
        name: 'Brede Visgraat – Cheesecake (Klik)',
        slug: 'douwes-dekker-visgraat-cheesecake-klik',
        description: 'Subtiel, lichtbruin eikendessin in visgraatpatroon. PVC-klikvloer met een rustige, neutrale uitstraling. Tijdloos design voor elk interieur.',
        imageUrl: '/images/brands/douwes-dekker/visgraat-cheesecake.webp',
        specs: { 'Collectie': 'Ambitieus', 'Dessin': 'Cheesecake', 'Patroon': 'Brede visgraat', 'Afmeting': '720 × 180 mm', 'Dikte': '7 mm', 'Topslijtlaag': '0,55 mm', 'Installatie': 'Klik (zwevend)', 'Gebruiksklasse': '23 / 33', 'Waterbestendig': 'Ja (100%)', 'Vloerverwarming': 'Ja' }
      },
      {
        name: 'Brede Visgraat – Panna Cotta (Klik)',
        slug: 'douwes-dekker-visgraat-panna-cotta-klik',
        description: 'Zacht, roomwit eikendessin in visgraatpatroon. PVC-klikvloer met lichte, luchtige uitstraling en natuurgetrouwe houtstructuur.',
        imageUrl: '/images/brands/douwes-dekker/visgraat-panna-cotta.webp',
        specs: { 'Collectie': 'Ambitieus', 'Dessin': 'Panna Cotta', 'Patroon': 'Brede visgraat', 'Afmeting': '720 × 180 mm', 'Dikte': '7 mm', 'Topslijtlaag': '0,55 mm', 'Installatie': 'Klik (zwevend)', 'Gebruiksklasse': '23 / 33', 'Waterbestendig': 'Ja (100%)', 'Vloerverwarming': 'Ja' }
      },
      {
        name: 'Brede Visgraat – Brioche (Klik)',
        slug: 'douwes-dekker-visgraat-brioche-klik',
        description: 'Warm, middenbruin eikendessin in visgraatpatroon. PVC-klikvloer met levendige kleurschakeringen en Micro 4V-vellingkant.',
        imageUrl: '/images/brands/douwes-dekker/visgraat-brioche.webp',
        specs: { 'Collectie': 'Ambitieus', 'Dessin': 'Brioche', 'Patroon': 'Brede visgraat', 'Afmeting': '720 × 180 mm', 'Dikte': '7 mm', 'Topslijtlaag': '0,55 mm', 'Installatie': 'Klik (zwevend)', 'Gebruiksklasse': '23 / 33', 'Waterbestendig': 'Ja (100%)', 'Vloerverwarming': 'Ja' }
      },
      {
        name: 'Brede Visgraat – Croissant (Klik)',
        slug: 'douwes-dekker-visgraat-croissant-klik',
        description: 'Licht, zandkleurig eikendessin in visgraatpatroon. PVC-klikvloer met subtiele nerftekening en warme ondertoon.',
        imageUrl: '/images/brands/douwes-dekker/visgraat-croissant.webp',
        specs: { 'Collectie': 'Ambitieus', 'Dessin': 'Croissant', 'Patroon': 'Brede visgraat', 'Afmeting': '720 × 180 mm', 'Dikte': '7 mm', 'Topslijtlaag': '0,55 mm', 'Installatie': 'Klik (zwevend)', 'Gebruiksklasse': '23 / 33', 'Waterbestendig': 'Ja (100%)', 'Vloerverwarming': 'Ja' }
      },
      {
        name: 'Brede Visgraat – Tarte Tatin (Klik)',
        slug: 'douwes-dekker-visgraat-tarte-tatin-klik',
        description: 'Diepbruin eikendessin in visgraatpatroon met karamelachtige tinten. PVC-klikvloer met rijke, warme uitstraling.',
        imageUrl: '/images/brands/douwes-dekker/visgraat-tarte-tatin.webp',
        specs: { 'Collectie': 'Ambitieus', 'Dessin': 'Tarte Tatin', 'Patroon': 'Brede visgraat', 'Afmeting': '720 × 180 mm', 'Dikte': '7 mm', 'Topslijtlaag': '0,55 mm', 'Installatie': 'Klik (zwevend)', 'Gebruiksklasse': '23 / 33', 'Waterbestendig': 'Ja (100%)', 'Vloerverwarming': 'Ja' }
      },
      {
        name: 'Brede Visgraat – Tompouce (Klik)',
        slug: 'douwes-dekker-visgraat-tompouce-klik',
        description: 'Middenbruin eikendessin in visgraatpatroon met roze-bruine ondertoon. PVC-klikvloer met karaktervolle kleurschakeringen.',
        imageUrl: '/images/brands/douwes-dekker/visgraat-tompouce.webp',
        specs: { 'Collectie': 'Ambitieus', 'Dessin': 'Tompouce', 'Patroon': 'Brede visgraat', 'Afmeting': '720 × 180 mm', 'Dikte': '7 mm', 'Topslijtlaag': '0,55 mm', 'Installatie': 'Klik (zwevend)', 'Gebruiksklasse': '23 / 33', 'Waterbestendig': 'Ja (100%)', 'Vloerverwarming': 'Ja' }
      },
      // ── Ambitieus – Brede Visgraat (Plak / Dryback) ──
      {
        name: 'Brede Visgraat – Pepermunt (Plak)',
        slug: 'douwes-dekker-visgraat-pepermunt-plak',
        description: 'Koele, grijze eikenlook in visgraatpatroon. Verlijmde PVC-plakvloer (dryback) met slanke 2,5 mm dikte — ideaal in combinatie met vloerverwarming.',
        imageUrl: '/images/brands/douwes-dekker/visgraat-pepermunt-plak.webp',
        specs: { 'Collectie': 'Ambitieus', 'Dessin': 'Pepermunt', 'Patroon': 'Brede visgraat', 'Afmeting': '762 × 152 mm', 'Dikte': '2,5 mm', 'Topslijtlaag': '0,55 mm', 'Installatie': 'Dryback (verlijmd)', 'Gebruiksklasse': '23 / 33', 'Waterbestendig': 'Ja (100%)', 'Vloerverwarming': 'Ja' }
      },
      {
        name: 'Brede Visgraat – Spekkoek (Plak)',
        slug: 'douwes-dekker-visgraat-spekkoek-plak',
        description: 'Donker, gelaagd eikendessin in visgraatpatroon. Verlijmde PVC-plakvloer met dunne opbouw voor optimale warmtegeleiding bij vloerverwarming.',
        imageUrl: '/images/brands/douwes-dekker/visgraat-spekkoek-plak.webp',
        specs: { 'Collectie': 'Ambitieus', 'Dessin': 'Spekkoek', 'Patroon': 'Brede visgraat', 'Afmeting': '762 × 152 mm', 'Dikte': '2,5 mm', 'Topslijtlaag': '0,55 mm', 'Installatie': 'Dryback (verlijmd)', 'Gebruiksklasse': '23 / 33', 'Waterbestendig': 'Ja (100%)', 'Vloerverwarming': 'Ja' }
      },
      {
        name: 'Brede Visgraat – Brioche (Plak)',
        slug: 'douwes-dekker-visgraat-brioche-plak',
        description: 'Warm, middenbruin eikendessin in visgraatpatroon. Verlijmde dryback-uitvoering met 0,55 mm slijtlaag en Micro 4V-vellingkant.',
        imageUrl: '/images/brands/douwes-dekker/visgraat-brioche-plak.webp',
        specs: { 'Collectie': 'Ambitieus', 'Dessin': 'Brioche', 'Patroon': 'Brede visgraat', 'Afmeting': '762 × 152 mm', 'Dikte': '2,5 mm', 'Topslijtlaag': '0,55 mm', 'Installatie': 'Dryback (verlijmd)', 'Gebruiksklasse': '23 / 33', 'Waterbestendig': 'Ja (100%)', 'Vloerverwarming': 'Ja' }
      },
      {
        name: 'Brede Visgraat – Croissant (Plak)',
        slug: 'douwes-dekker-visgraat-croissant-plak',
        description: 'Licht, zandkleurig eikendessin in visgraatpatroon. Verlijmde PVC-plakvloer met subtiele nerftekening. Dun profiel voor perfecte warmteoverdracht.',
        imageUrl: '/images/brands/douwes-dekker/visgraat-croissant-plak.webp',
        specs: { 'Collectie': 'Ambitieus', 'Dessin': 'Croissant', 'Patroon': 'Brede visgraat', 'Afmeting': '762 × 152 mm', 'Dikte': '2,5 mm', 'Topslijtlaag': '0,55 mm', 'Installatie': 'Dryback (verlijmd)', 'Gebruiksklasse': '23 / 33', 'Waterbestendig': 'Ja (100%)', 'Vloerverwarming': 'Ja' }
      },
      {
        name: 'Brede Visgraat – Tarte Tatin (Plak)',
        slug: 'douwes-dekker-visgraat-tarte-tatin-plak',
        description: 'Diepbruin eikendessin in visgraatpatroon. Verlijmde dryback-uitvoering met karamelachtige tinten en stevige 0,55 mm slijtlaag.',
        imageUrl: '/images/brands/douwes-dekker/visgraat-tarte-tatin-plak.webp',
        specs: { 'Collectie': 'Ambitieus', 'Dessin': 'Tarte Tatin', 'Patroon': 'Brede visgraat', 'Afmeting': '762 × 152 mm', 'Dikte': '2,5 mm', 'Topslijtlaag': '0,55 mm', 'Installatie': 'Dryback (verlijmd)', 'Gebruiksklasse': '23 / 33', 'Waterbestendig': 'Ja (100%)', 'Vloerverwarming': 'Ja' }
      },
      {
        name: 'Brede Visgraat – Tompouce (Plak)',
        slug: 'douwes-dekker-visgraat-tompouce-plak',
        description: 'Middenbruin eikendessin in visgraatpatroon. Verlijmde PVC-plakvloer met karaktervolle kleurschakeringen en roze-bruine ondertoon.',
        imageUrl: '/images/brands/douwes-dekker/visgraat-tompouce-plak.webp',
        specs: { 'Collectie': 'Ambitieus', 'Dessin': 'Tompouce', 'Patroon': 'Brede visgraat', 'Afmeting': '762 × 152 mm', 'Dikte': '2,5 mm', 'Topslijtlaag': '0,55 mm', 'Installatie': 'Dryback (verlijmd)', 'Gebruiksklasse': '23 / 33', 'Waterbestendig': 'Ja (100%)', 'Vloerverwarming': 'Ja' }
      },
      // ── Ambitieus – Riante Plank (Klik) ──
      {
        name: 'Riante Plank – Boterkoek (Klik)',
        slug: 'douwes-dekker-riante-plank-boterkoek-klik',
        description: 'Brede, riante plank in warme goudblonde Boterkoek-tint. PVC-klikvloer met 7,5 mm dikte, geïntegreerde ondervloer en tot 16 unieke plankdessins per decor.',
        imageUrl: '/images/brands/douwes-dekker/riante-plank-boterkoek.webp',
        specs: { 'Collectie': 'Ambitieus', 'Dessin': 'Boterkoek', 'Patroon': 'Riante plank', 'Afmeting': '1510 × 220 mm', 'Dikte': '7,5 mm', 'Topslijtlaag': '0,55 mm', 'Installatie': 'Klik (zwevend)', 'Gebruiksklasse': '23 / 33', 'Waterbestendig': 'Ja (100%)', 'Vloerverwarming': 'Ja' }
      },
      {
        name: 'Riante Plank – Spekkoek (Klik)',
        slug: 'douwes-dekker-riante-plank-spekkoek-klik',
        description: 'Brede, riante plank in donker, gelaagd Spekkoek-dessin. PVC-klikvloer met rijke, warme kleurschakeringen en natuurgetrouwe houtstructuur.',
        imageUrl: '/images/brands/douwes-dekker/riante-plank-spekkoek.webp',
        specs: { 'Collectie': 'Ambitieus', 'Dessin': 'Spekkoek', 'Patroon': 'Riante plank', 'Afmeting': '1510 × 220 mm', 'Dikte': '7,5 mm', 'Topslijtlaag': '0,55 mm', 'Installatie': 'Klik (zwevend)', 'Gebruiksklasse': '23 / 33', 'Waterbestendig': 'Ja (100%)', 'Vloerverwarming': 'Ja' }
      },
      {
        name: 'Riante Plank – Pepermunt (Plak)',
        slug: 'douwes-dekker-riante-plank-pepermunt-plak',
        description: 'Brede plank in koele, grijze Pepermunt-tint. Verlijmde dryback PVC-vloer met slanke 2,5 mm dikte en optimale warmtegeleiding voor vloerverwarming.',
        imageUrl: '/images/brands/douwes-dekker/riante-plank-pepermunt.webp',
        specs: { 'Collectie': 'Ambitieus', 'Dessin': 'Pepermunt', 'Patroon': 'Riante plank', 'Afmeting': '1524 × 228 mm', 'Dikte': '2,5 mm', 'Topslijtlaag': '0,55 mm', 'Installatie': 'Dryback (verlijmd)', 'Gebruiksklasse': '23 / 33', 'Waterbestendig': 'Ja (100%)', 'Vloerverwarming': 'Ja' }
      },
      {
        name: 'Riante Plank – Cheesecake (Klik)',
        slug: 'douwes-dekker-riante-plank-cheesecake-klik',
        description: 'Brede, riante plank in subtiel lichtbruin Cheesecake-dessin. PVC-klikvloer met rustige, neutrale uitstraling en Micro 4V-vellingkant.',
        imageUrl: '/images/brands/douwes-dekker/riante-plank-cheesecake.webp',
        specs: { 'Collectie': 'Ambitieus', 'Dessin': 'Cheesecake', 'Patroon': 'Riante plank', 'Afmeting': '1510 × 220 mm', 'Dikte': '7,5 mm', 'Topslijtlaag': '0,55 mm', 'Installatie': 'Klik (zwevend)', 'Gebruiksklasse': '23 / 33', 'Waterbestendig': 'Ja (100%)', 'Vloerverwarming': 'Ja' }
      },
      {
        name: 'Riante Plank – Crème Brûlée (Klik)',
        slug: 'douwes-dekker-riante-plank-creme-brulee-klik',
        description: 'Brede, riante plank in verfijnd crèmekleurig eikendessin. PVC-klikvloer met warme ondertoon en elegante uitstraling.',
        imageUrl: '/images/brands/douwes-dekker/riante-plank-creme-brulee.webp',
        specs: { 'Collectie': 'Ambitieus', 'Dessin': 'Crème Brûlée', 'Patroon': 'Riante plank', 'Afmeting': '1510 × 220 mm', 'Dikte': '7,5 mm', 'Topslijtlaag': '0,55 mm', 'Installatie': 'Klik (zwevend)', 'Gebruiksklasse': '23 / 33', 'Waterbestendig': 'Ja (100%)', 'Vloerverwarming': 'Ja' }
      },
      {
        name: 'Riante Plank – Panna Cotta (Klik)',
        slug: 'douwes-dekker-riante-plank-panna-cotta-klik',
        description: 'Brede, riante plank in zacht roomwit Panna Cotta-dessin. PVC-klikvloer met lichte, luchtige uitstraling en geïntegreerde geluidsdemping.',
        imageUrl: '/images/brands/douwes-dekker/riante-plank-panna-cotta.webp',
        specs: { 'Collectie': 'Ambitieus', 'Dessin': 'Panna Cotta', 'Patroon': 'Riante plank', 'Afmeting': '1510 × 220 mm', 'Dikte': '7,5 mm', 'Topslijtlaag': '0,55 mm', 'Installatie': 'Klik (zwevend)', 'Gebruiksklasse': '23 / 33', 'Waterbestendig': 'Ja (100%)', 'Vloerverwarming': 'Ja' }
      },
      // ── Ambitieus – Hongaarse Punt ──
      {
        name: 'Hongaarse Punt – Boterkoek (Klik)',
        slug: 'douwes-dekker-hongaarse-punt-boterkoek-klik',
        description: 'Warme, goudblonde eikenlook in Hongaarse punt-patroon (60°-hoek). PVC-klikvloer met strak, symmetrisch legpatroon en geïntegreerde ondervloer.',
        imageUrl: '/images/brands/douwes-dekker/hongaarse-punt-boterkoek.webp',
        specs: { 'Collectie': 'Ambitieus', 'Dessin': 'Boterkoek', 'Patroon': 'Hongaarse punt', 'Afmeting': '700 × 140 mm', 'Dikte': '8 mm', 'Topslijtlaag': '0,55 mm', 'Installatie': 'Klik (zwevend)', 'Gebruiksklasse': '23 / 33', 'Waterbestendig': 'Ja (100%)', 'Vloerverwarming': 'Ja' }
      },
      {
        name: 'Hongaarse Punt – Spekkoek (Plak)',
        slug: 'douwes-dekker-hongaarse-punt-spekkoek-plak',
        description: 'Donker, gelaagd eikendessin in Hongaarse punt-patroon. Verlijmde PVC-plakvloer met slanke 2,5 mm dikte en EIR-houtstructuur.',
        imageUrl: '/images/brands/douwes-dekker/hongaarse-punt-spekkoek.webp',
        specs: { 'Collectie': 'Ambitieus', 'Dessin': 'Spekkoek', 'Patroon': 'Hongaarse punt', 'Afmeting': '700 × 151 mm', 'Dikte': '2,5 mm', 'Topslijtlaag': '0,55 mm', 'Installatie': 'Dryback (verlijmd)', 'Gebruiksklasse': '23 / 33', 'Waterbestendig': 'Ja (100%)', 'Vloerverwarming': 'Ja' }
      },
    ]
  }
];

// ────────────────────────────────────────────
// Hout Merken
// ────────────────────────────────────────────

const houtBrands: Brand[] = [
  {
    name: 'HyWood (by Ter Hürne)',
    slug: 'hywood',
    logoUrl: 'https://headlam.nl/wp-content/uploads/2022/02/headlambruin-1.png',
    website: 'https://www.terhuerne.com',
    description: 'Hybride houten vloer: 100% echt hout gecombineerd met innovatieve technologieën. FSC® en PEFC-gecertificeerd. 3x drukbestendiger dan conventioneel parket en 24/7 waterbestendig.',
    shortDescription: '100% echt hout, ultra kras- en waterbestendig (24 uur).',
    featured: false,
    materials: ['Hout/Hybride'],
    moodImages: [
      'https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&q=80&w=1200',
      'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&q=80&w=1200',
      'https://images.unsplash.com/photo-1598928506311-c55ded91a20c?auto=format&fit=crop&q=80&w=1200'
    ],
    products: [
      {
        name: 'Classic (Serie A)',
        slug: 'classic-serie-a',
        description: 'Eiken, Essen, of Walnoot uitvoeringen in ruime landhuisdelen.',
        imageUrl: 'https://images.unsplash.com/photo-1581858326456-f6ccceaa3e35?auto=format&fit=crop&q=80&w=600',
        specs: { 'Formaat': '219,7 × 23,3 cm (eiken)', 'Dikte': '11 mm', 'Installatie': 'CLICKitEASY', 'Waterbestendig': '24 uur', 'Garantie': 'Levenslang (woonkamer)' }
      },
      {
        name: 'Noblesse (Serie B)',
        slug: 'noblesse-serie-b',
        description: 'Extra grote planken in eikenhout.',
        imageUrl: 'https://images.unsplash.com/photo-1542385150-f726cbff77dd?auto=format&fit=crop&q=80&w=600',
        specs: { 'Formaat': '237,5 × 27 cm', 'Dikte': '11 mm', 'Installatie': 'CLICKitEASY', 'Waterbestendig': '24 uur', 'Garantie': 'Levenslang (woonkamer)' }
      },
      {
        name: 'Visgraat',
        slug: 'visgraat',
        description: 'Visgraat formaat planken in eiken. Voorbeeldkleur: Nordens Ark.',
        imageUrl: 'https://images.unsplash.com/photo-1622398925373-3f91b1e275f5?auto=format&fit=crop&q=80&w=600',
        specs: { 'Formaat': '77,4 × 12,7 cm', 'Dikte': '11 mm', 'Installatie': 'CLICKitEASY', 'Waterbestendig': '24 uur', 'Garantie': 'Levenslang (woonkamer)' }
      }
    ]
  }
];

// ────────────────────────────────────────────
// Traprenovatie Merken
// ────────────────────────────────────────────

const traprenovatieBrands: Brand[] = [
  {
    name: 'MexForm Traprenovatie',
    slug: 'mexform',
    logoUrl: 'https://vandijk-staircasesolutions.com/wp-content/uploads/2025/02/logo-MexForm.png',
    website: 'https://vandijk-staircasesolutions.com/nl/collecties/mexform/',
    description: 'Nederlands merk. Geschikt voor open en gesloten trappen tot 364 cm breed. Werkbaar op hout, beton en metaal. Twee productlijnen: Classic & LVT.',
    shortDescription: 'Nederlandse specialisten in PVC- en CPL-traprenovatie, passend op (bijna) elke trap.',
    featured: true,
    materials: ['CPL', 'PVC / LVT'],
    moodImages: [
      'https://vandijk-staircasesolutions.com/wp-content/uploads/2025/02/Mexform-header.jpg',
      'https://vandijk-staircasesolutions.com/wp-content/uploads/2025/02/Mexform-Classic-header.jpg',
      'https://vandijk-staircasesolutions.com/wp-content/uploads/2025/02/Mexform-LVT.jpg'
    ],
    products: [
      {
        name: 'Vesuvius Zwart Houtnerf (Classic)',
        slug: 'vesuvius-zwart',
        description: 'Onderdeel van de Classic serie. R9 / AC4 anti-slip toplaag.',
        imageUrl: 'https://vandijk-staircasesolutions.com/wp-content/uploads/2025/02/Vesuvius-Zwart-Houtnerf.png',
        specs: { 'Kern': '10 mm MDF/HDF', 'Toplaag': '0,6 mm CPL', 'Antislip': 'R9', 'Garantie': '12 jaar' }
      },
      {
        name: 'Orleans Eik Zand (Classic)',
        slug: 'orleans-eik-zand',
        description: 'Warme tint in de Classic collectie.',
        imageUrl: 'https://vandijk-staircasesolutions.com/wp-content/uploads/2025/02/Orleans-Oak.png',
        specs: { 'Kern': '10 mm MDF/HDF', 'Toplaag': '0,6 mm CPL', 'Antislip': 'R9', 'Garantie': '12 jaar' }
      },
      {
        name: 'Beton Antraciet (LVT)',
        slug: 'beton-antraciet',
        description: 'Een stoere betonlook trap aus de LVT lijn.',
        imageUrl: 'https://vandijk-staircasesolutions.com/wp-content/uploads/2025/02/Beton-Antraciet.png',
        specs: { 'Kern': 'Rigide paneel', 'Toplaag': '0,55 mm PVC + PUR', 'Antislip': 'R10', 'Garantie': '12 jaar' }
      },
      {
        name: 'Donker Eiken (LVT)',
        slug: 'donker-eiken',
        description: 'Tijdloos en stevig eikendessin in rigide LVT.',
        imageUrl: 'https://vandijk-staircasesolutions.com/wp-content/uploads/2025/02/Donker-Eiken.png',
        specs: { 'Kern': 'Rigide paneel', 'Toplaag': '0,55 mm PVC + PUR', 'Antislip': 'R10', 'Garantie': '12 jaar' }
      }
    ]
  },
  {
    name: 'Floorlife Traprenovatie',
    slug: 'floorlife-traprenovatie',
    logoUrl: 'https://floorlife.nl/wp-content/themes/floorlife/assets/img/logo/floorlife-logo.svg',
    website: 'https://floorlife.nl/collectie/traprenovatie/',
    description: 'Breed assortiment PVC en parket traprenovatie. Meestal binnen 1 werkdag te realiseren. Bijpassende vloer vaak in hetzelfde decor verkrijgbaar.',
    shortDescription: 'Meestal klaar in 1 dag. Trededikte is 2,5 mm, passend bij hun reguliere PVC vloeren.',
    featured: false,
    materials: ['PVC', 'Parket'],
    moodImages: [
      'https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&q=80&w=1200',
      'https://images.unsplash.com/photo-1598928506311-c55ded91a20c?auto=format&fit=crop&q=80&w=1200',
      'https://images.unsplash.com/photo-1560448205-4d9b3e6bb6db?auto=format&fit=crop&q=80&w=1200'
    ],
    products: [
      {
        name: 'Floorlife Victoria Serie',
        slug: 'victoria',
        description: 'Beschikbare kleuren: Anthracite, Grey. (PVC basis).',
        imageUrl: 'https://images.unsplash.com/photo-1505691938895-1758d7feb511?auto=format&fit=crop&q=80&w=600',
        specs: { 'Dikte treden': '2,5 mm', 'Waterbestendig': 'Ja', 'Antislip': 'Ja', 'Set': '4 treden incl. stootborden' }
      },
      {
        name: 'Floorlife Fulham Serie',
        slug: 'fulham',
        description: 'Hout decors (Beige + 3 bruintinten).',
        imageUrl: 'https://images.unsplash.com/photo-1620626011761-996317b8d101?auto=format&fit=crop&q=80&w=600',
        specs: { 'Dikte treden': '2,5 mm', 'Waterbestendig': 'Ja', 'Antislip': 'Ja', 'Set': '4 treden incl. stootborden' }
      }
    ]
  }
];

// ────────────────────────────────────────────
// Raamdecoratie Types (geen merken, per user)
// ────────────────────────────────────────────

const raamdecoratieTypes: RaamdecoratieType[] = [
  {
    name: 'Jaloezieën',
    slug: 'jaloezieen',
    description: 'De klassieke manier om met de lichtinval te spelen, met warm & naturel hout, eco bamboe of praktisch pvc.',
    materials: ['Hout', 'Kunststof (PVC)', 'Bamboe'],
    specs: { 'Lamelbreedtes': '25, 35, 50 mm', 'Vochtbestendig': 'Verschilt per materiaal' }
  },
  {
    name: 'Duette',
    slug: 'duette',
    description: 'Honingraat (single of double cell). Deze isoleren fantastisch, beschermen tegen de hitte in de zomer en houden warmte vast in de winter.',
    materials: ['Stof'],
    specs: { 'Bediening': 'Koord (top-down / bottom-up), koordloos, elektrisch', 'Filtering': 'Transparant, lichtdoorlatend of verduisterend' }
  },
  {
    name: 'Vouwgordijnen',
    slug: 'vouwgordijnen',
    description: 'Bestaat uit een enkelvoudige plooi, dubbele plooi of Japanse stijl. Beschikbaar met decoratieve of verduisterende stoffen.',
    materials: ['Stof'],
    specs: { 'Bediening': 'Koord, koordloos' }
  },
  {
    name: 'Rolgordijnen',
    slug: 'rolgordijnen',
    description: 'Kies voor verduisterend, lichtdoorlatend of vochtwerend. Breed assortiment bedieningen zoals ketting, elektrisch of veilig koordloos.',
    materials: ['Stof', 'Verduisterend', 'Screen'],
    specs: { 'Bediening': 'Ketting (L/R), elektrisch, koordloos', 'Montage': 'Plafond, wand, in kozijn (inbouw)' }
  },
  {
    name: 'Duorolgordijnen',
    slug: 'duorolgordijnen',
    description: 'Twee lagen doek (transparant + ondoorzichtig) die traploos langs elkaar kunnen schuiven voor perfecte lichtregulering.',
    materials: ['Stof'],
    specs: { 'Bediening': 'Ketting, elektrisch' }
  },
  {
    name: 'Horren',
    slug: 'horren',
    description: 'Bescherming tegen insecten zonder uw uitzicht te verstoren. Verkrijgbaar als rolhor, plissé of vast frame — in vele kleuren en uitvoeringen.',
    materials: ['Aluminium', 'Fiberglas'],
    specs: { 'Type': 'Rolhor, Plissé hor, Vast frame', 'Montage': 'In kozijn of op raam' }
  }
];

const gordijnenTypes: RaamdecoratieType[] = [
  {
    name: 'Gordijnen',
    slug: 'gordijnen',
    description: 'Klassieke overgordijnen op maat — van rijke verduisterende stoffen tot luchtige linnen kwaliteiten. Perfect voor warmte, sfeer en geluidsdemping.',
    materials: ['Stof', 'Linnen', 'Velours', 'Katoen'],
    specs: { 'Plooien': 'Enkele, dubbele of driedubbele plooi', 'Bediening': 'Koord, rails of wave systeem' }
  },
  {
    name: 'Inbetweens',
    slug: 'inbetweens',
    description: 'De perfecte balans tussen vitrage en overgordijn. Filteren het licht subtiel, bieden privacy overdag en voegen sfeer toe zonder de ruimte te verduisteren.',
    materials: ['Voile', 'Transparante stof'],
    specs: { 'Plooien': 'Enkele of dubbele plooi', 'Bediening': 'Koord of rails' }
  }
];

// ────────────────────────────────────────────
// Vloerbedekking Merken
// ────────────────────────────────────────────

const vloerbedekkingBrands: Brand[] = [
  {
    name: 'Gelasta',
    slug: 'gelasta',
    logoUrl: '/images/brands/gelasta/logo.webp',
    website: 'https://www.gelasta.nl',
    description: 'Gelasta is een toonaangevend Nederlands tapijtmerk dat bekendstaat om hoogwaardige tapijtkwaliteiten met een breed scala aan kleuren en texturen. Van de luxueuze Auroria SDN met Solution Dyed Nylon tot de betaalbare Adventure-collectie — Gelasta biedt voor elk interieur en budget een passende vloerbedekking. Alle collecties zijn trapgeschikt en beschikbaar in breedtes tot 500 cm.',
    shortDescription: 'Nederlands tapijtmerk met een breed assortiment van bouclé tot velours in Solution Dyed Nylon en polyester.',
    featured: true,
    materials: ['Tapijt'],
    moodImages: [
      '/images/brands/gelasta/mood-1.webp',
      '/images/brands/gelasta/mood-2.webp',
      '/images/brands/gelasta/mood-3.webp',
    ],
    products: [
      // ── Atlas (Bouclé, 100% PES) ──
      {
        name: 'Atlas 174 – Donkergrijs',
        slug: 'gelasta-atlas-174-donkergrijs',
        description: 'Tijdloze donkergrijze bouclé met een robuuste uitstraling. Geschikt voor intensief woongebruik en trappen.',
        imageUrl: '/images/brands/gelasta/atlas-174-donkergrijs.webp',
        specs: { 'Collectie': 'Atlas', 'Kleurcode': '174', 'Kleur': 'Donkergrijs', 'Poolmateriaal': '100% PES', 'Rug': 'Actionback', 'Breedte': '400 cm', 'Totale hoogte': '14 mm', 'Gewicht': '2.400 gr/m²', 'Gebruiksklasse': '23', 'Thermische weerstand': '0,14 m² K/W', 'Trapgeschikt': 'Ja' },
      },
      {
        name: 'Atlas 71 – Zand',
        slug: 'gelasta-atlas-71-zand',
        description: 'Warme zandtint in bouclé-structuur. Perfect voor een natuurlijke, lichte uitstraling in woon- en slaapkamers.',
        imageUrl: '/images/brands/gelasta/atlas-71-zand.webp',
        specs: { 'Collectie': 'Atlas', 'Kleurcode': '71', 'Kleur': 'Zand', 'Poolmateriaal': '100% PES', 'Rug': 'Actionback', 'Breedte': '400 cm', 'Totale hoogte': '14 mm', 'Gewicht': '2.400 gr/m²', 'Gebruiksklasse': '23', 'Thermische weerstand': '0,14 m² K/W', 'Trapgeschikt': 'Ja' },
      },
      {
        name: 'Atlas 73 – Tarwe',
        slug: 'gelasta-atlas-73-tarwe',
        description: 'Zachte tarwekleur met een subtiele bouclé-textuur. Veelzijdig en tijdloos voor elk interieur.',
        imageUrl: '/images/brands/gelasta/atlas-73-tarwe.webp',
        specs: { 'Collectie': 'Atlas', 'Kleurcode': '73', 'Kleur': 'Tarwe', 'Poolmateriaal': '100% PES', 'Rug': 'Actionback', 'Breedte': '400 cm', 'Totale hoogte': '14 mm', 'Gewicht': '2.400 gr/m²', 'Gebruiksklasse': '23', 'Thermische weerstand': '0,14 m² K/W', 'Trapgeschikt': 'Ja' },
      },
      {
        name: 'Atlas 76 – Warm Grijs',
        slug: 'gelasta-atlas-76-warm-grijs',
        description: 'Elegant warm grijs met bouclé-structuur. Combineert moeiteloos met zowel moderne als klassieke meubels.',
        imageUrl: '/images/brands/gelasta/atlas-76-warm-grijs.webp',
        specs: { 'Collectie': 'Atlas', 'Kleurcode': '76', 'Kleur': 'Warm grijs', 'Poolmateriaal': '100% PES', 'Rug': 'Actionback', 'Breedte': '400 cm', 'Totale hoogte': '14 mm', 'Gewicht': '2.400 gr/m²', 'Gebruiksklasse': '23', 'Thermische weerstand': '0,14 m² K/W', 'Trapgeschikt': 'Ja' },
      },
      {
        name: 'Atlas 77 – Antraciet',
        slug: 'gelasta-atlas-77-antraciet',
        description: 'Diepe antraciet bouclé voor een stoere, moderne look. Ideaal voor drukke woonruimtes.',
        imageUrl: '/images/brands/gelasta/atlas-77-antraciet.webp',
        specs: { 'Collectie': 'Atlas', 'Kleurcode': '77', 'Kleur': 'Antraciet', 'Poolmateriaal': '100% PES', 'Rug': 'Actionback', 'Breedte': '400 cm', 'Totale hoogte': '14 mm', 'Gewicht': '2.400 gr/m²', 'Gebruiksklasse': '23', 'Thermische weerstand': '0,14 m² K/W', 'Trapgeschikt': 'Ja' },
      },
      // ── Impress SDN (Solution Dyed Nylon) ──
      {
        name: 'Impress SDN 150 – Zalm',
        slug: 'gelasta-impress-sdn-150-zalm',
        description: 'Subtiele zalmtint in Solution Dyed Nylon. Kleurvast, vlekbestendig en geschikt voor projectmatig gebruik.',
        imageUrl: '/images/brands/gelasta/impress-sdn-150-zalm.webp',
        specs: { 'Collectie': 'Impress SDN', 'Kleurcode': '150', 'Kleur': 'Zalm', 'Poolmateriaal': '100% Polyamide SDN', 'Rug': 'Actionback', 'Breedte': '400 cm', 'Totale hoogte': '12 mm', 'Gewicht': '1.840 gr/m²', 'Gebruiksklasse': '31', 'Thermische weerstand': '0,10 m² K/W', 'Kleurvast': 'Ja (SDN)' },
      },
      {
        name: 'Impress SDN 205 – Ecru',
        slug: 'gelasta-impress-sdn-205-ecru',
        description: 'Lichte ecru kleur in slijtvast Solution Dyed Nylon. Perfect voor kantoren en drukbezochte ruimtes.',
        imageUrl: '/images/brands/gelasta/impress-sdn-205-ecru.webp',
        specs: { 'Collectie': 'Impress SDN', 'Kleurcode': '205', 'Kleur': 'Ecru', 'Poolmateriaal': '100% Polyamide SDN', 'Rug': 'Actionback', 'Breedte': '400 cm', 'Totale hoogte': '12 mm', 'Gewicht': '1.840 gr/m²', 'Gebruiksklasse': '31', 'Thermische weerstand': '0,10 m² K/W', 'Kleurvast': 'Ja (SDN)' },
      },
      {
        name: 'Impress SDN 430 – Tijm',
        slug: 'gelasta-impress-sdn-430-tijm',
        description: 'Warme tijmgroene tint in Solution Dyed Nylon. Brengt een natuurlijk accent in elk interieur.',
        imageUrl: '/images/brands/gelasta/impress-sdn-430-tijm.webp',
        specs: { 'Collectie': 'Impress SDN', 'Kleurcode': '430', 'Kleur': 'Tijm', 'Poolmateriaal': '100% Polyamide SDN', 'Rug': 'Actionback', 'Breedte': '400 cm', 'Totale hoogte': '12 mm', 'Gewicht': '1.840 gr/m²', 'Gebruiksklasse': '31', 'Thermische weerstand': '0,10 m² K/W', 'Kleurvast': 'Ja (SDN)' },
      },
      {
        name: 'Impress SDN 690 – Linnen',
        slug: 'gelasta-impress-sdn-690-linnen',
        description: 'Natuurlijke linnentint in Solution Dyed Nylon. Tijdloos en onderhoudsvriendelijk.',
        imageUrl: '/images/brands/gelasta/impress-sdn-690-linnen.webp',
        specs: { 'Collectie': 'Impress SDN', 'Kleurcode': '690', 'Kleur': 'Linnen', 'Poolmateriaal': '100% Polyamide SDN', 'Rug': 'Actionback', 'Breedte': '400 cm', 'Totale hoogte': '12 mm', 'Gewicht': '1.840 gr/m²', 'Gebruiksklasse': '31', 'Thermische weerstand': '0,10 m² K/W', 'Kleurvast': 'Ja (SDN)' },
      },
      {
        name: 'Impress SDN 750 – Cement',
        slug: 'gelasta-impress-sdn-750-cement',
        description: 'Stoer cementgrijs in Solution Dyed Nylon. Bestand tegen bleek- en reinigingsmiddelen.',
        imageUrl: '/images/brands/gelasta/impress-sdn-750-cement.webp',
        specs: { 'Collectie': 'Impress SDN', 'Kleurcode': '750', 'Kleur': 'Cement', 'Poolmateriaal': '100% Polyamide SDN', 'Rug': 'Actionback', 'Breedte': '400 cm', 'Totale hoogte': '12 mm', 'Gewicht': '1.840 gr/m²', 'Gebruiksklasse': '31', 'Thermische weerstand': '0,10 m² K/W', 'Kleurvast': 'Ja (SDN)' },
      },
      // ── Adventure (100% PES, velours) ──
      {
        name: 'Adventure 40 – Groen',
        slug: 'gelasta-adventure-40-groen',
        description: 'Frisse groene velours met een indrukwekkende uitstraling. Aantrekkelijk geprijsd in 14 hedendaagse kleuren.',
        imageUrl: '/images/brands/gelasta/adventure-40-groen.webp',
        specs: { 'Collectie': 'Adventure', 'Kleurcode': '40', 'Kleur': 'Groen', 'Poolmateriaal': '100% PES', 'Rug': 'Actionback', 'Breedte': '400 cm', 'Totale hoogte': '13 mm', 'Gewicht': '2.500 gr/m²', 'Thermische weerstand': '0,135 m² K/W', 'Trapgeschikt': 'Ja' },
      },
      {
        name: 'Adventure 72 – Beige',
        slug: 'gelasta-adventure-72-beige',
        description: 'Klassieke beige velours die warmte en comfort brengt. Ideaal voor slaapkamers en woonkamers.',
        imageUrl: '/images/brands/gelasta/adventure-72-beige.webp',
        specs: { 'Collectie': 'Adventure', 'Kleurcode': '72', 'Kleur': 'Beige', 'Poolmateriaal': '100% PES', 'Rug': 'Actionback', 'Breedte': '400 cm', 'Totale hoogte': '13 mm', 'Gewicht': '2.500 gr/m²', 'Thermische weerstand': '0,135 m² K/W', 'Trapgeschikt': 'Ja' },
      },
      {
        name: 'Adventure 75 – Grijs',
        slug: 'gelasta-adventure-75-grijs',
        description: 'Veelzijdig grijs in zachte velours. Combineert eenvoudig met elke interieurstijl.',
        imageUrl: '/images/brands/gelasta/adventure-75-grijs.webp',
        specs: { 'Collectie': 'Adventure', 'Kleurcode': '75', 'Kleur': 'Grijs', 'Poolmateriaal': '100% PES', 'Rug': 'Actionback', 'Breedte': '400 cm', 'Totale hoogte': '13 mm', 'Gewicht': '2.500 gr/m²', 'Thermische weerstand': '0,135 m² K/W', 'Trapgeschikt': 'Ja' },
      },
      {
        name: 'Adventure 77 – Antraciet',
        slug: 'gelasta-adventure-77-antraciet',
        description: 'Donkere antraciet velours met een luxueuze uitstraling. Praktisch en stijlvol.',
        imageUrl: '/images/brands/gelasta/adventure-77-antraciet.webp',
        specs: { 'Collectie': 'Adventure', 'Kleurcode': '77', 'Kleur': 'Antraciet', 'Poolmateriaal': '100% PES', 'Rug': 'Actionback', 'Breedte': '400 cm', 'Totale hoogte': '13 mm', 'Gewicht': '2.500 gr/m²', 'Thermische weerstand': '0,135 m² K/W', 'Trapgeschikt': 'Ja' },
      },
      // ── Auroria SDN (Premium, 100% Polyamide SDN) ──
      {
        name: 'Auroria SDN 69 – Ivoor',
        slug: 'gelasta-auroria-sdn-69-ivoor',
        description: 'Luxueuze ivoorkleurige hoogpolige vloerbedekking in Solution Dyed Nylon. Ultiem comfort met superieure kleurvastheid.',
        imageUrl: '/images/brands/gelasta/auroria-sdn-69-ivoor.webp',
        specs: { 'Collectie': 'Auroria SDN', 'Kleurcode': '69', 'Kleur': 'Ivoor', 'Poolmateriaal': '100% Polyamide SDN', 'Rug': 'Actionback', 'Breedte': '400 cm', 'Totale hoogte': '22 mm', 'Gewicht': '3.450 gr/m²', 'Thermische weerstand': '0,18 m² K/W', 'Kleurvast': 'Ja (SDN)', 'Vlekbestendig': 'Ja' },
      },
      {
        name: 'Auroria SDN 72 – Haver',
        slug: 'gelasta-auroria-sdn-72-haver',
        description: 'Warme havertint in premium hoogpolig tapijt. Ongeëvenaard zacht loopcomfort dankzij 22 mm poolhoogte.',
        imageUrl: '/images/brands/gelasta/auroria-sdn-72-haver.webp',
        specs: { 'Collectie': 'Auroria SDN', 'Kleurcode': '72', 'Kleur': 'Haver', 'Poolmateriaal': '100% Polyamide SDN', 'Rug': 'Actionback', 'Breedte': '400 cm', 'Totale hoogte': '22 mm', 'Gewicht': '3.450 gr/m²', 'Thermische weerstand': '0,18 m² K/W', 'Kleurvast': 'Ja (SDN)', 'Vlekbestendig': 'Ja' },
      },
      {
        name: 'Auroria SDN 76 – Antraciet',
        slug: 'gelasta-auroria-sdn-76-antraciet',
        description: 'Diep antraciet in premium Solution Dyed Nylon. UV-bestendig en bestand tegen bleekmiddelen.',
        imageUrl: '/images/brands/gelasta/auroria-sdn-76-antraciet.webp',
        specs: { 'Collectie': 'Auroria SDN', 'Kleurcode': '76', 'Kleur': 'Antraciet', 'Poolmateriaal': '100% Polyamide SDN', 'Rug': 'Actionback', 'Breedte': '400 cm', 'Totale hoogte': '22 mm', 'Gewicht': '3.450 gr/m²', 'Thermische weerstand': '0,18 m² K/W', 'Kleurvast': 'Ja (SDN)', 'Vlekbestendig': 'Ja' },
      },
      {
        name: 'Auroria SDN 78 – Steenkool',
        slug: 'gelasta-auroria-sdn-78-steenkool',
        description: 'Donkere steenkooltint in de meest luxueuze Gelasta-collectie. Maximale kleurvastheid en vlekbestendigheid.',
        imageUrl: '/images/brands/gelasta/auroria-sdn-78-steenkool.webp',
        specs: { 'Collectie': 'Auroria SDN', 'Kleurcode': '78', 'Kleur': 'Steenkool', 'Poolmateriaal': '100% Polyamide SDN', 'Rug': 'Actionback', 'Breedte': '400 cm', 'Totale hoogte': '22 mm', 'Gewicht': '3.450 gr/m²', 'Thermische weerstand': '0,18 m² K/W', 'Kleurvast': 'Ja (SDN)', 'Vlekbestendig': 'Ja' },
      },
    ],
  },
];

// ────────────────────────────────────────────
// Gordijnen Merken
// ────────────────────────────────────────────

const gordijnenBrands: Brand[] = [
  {
    name: 'DC-Line',
    slug: 'dc-line',
    logoUrl: '/images/brands/dc-line/logo.webp',
    website: 'https://dc-line.nl',
    description: 'DC-Line biedt een uitgebreid assortiment raambekleding op maat, van stijlvolle rolgordijnen en vouwgordijnen tot moderne duo rolgordijnen, honeycomb plissés en jaloezieën. Alle producten worden op maat gemaakt met hoogwaardige stoffen en materialen, en zijn leverbaar met handmatige of elektrische bediening.',
    shortDescription: 'Raambekleding op maat: rolgordijnen, vouwgordijnen, duo rolgordijnen, honeycomb en jaloezieën.',
    featured: true,
    materials: ['Gordijnen'],
    moodImages: [
      '/images/brands/dc-line/mood-1.webp',
      '/images/brands/dc-line/mood-2.webp',
      '/images/brands/dc-line/mood-3.webp',
      '/images/brands/dc-line/mood-4.webp',
    ],
    products: [
      // ── Rolgordijnen ──
      {
        name: 'Rolgordijn Magna – Wit',
        slug: 'dc-line-rolgordijn-magna-wit',
        description: 'Volledig verduisterend rolgordijn uit de Magna-collectie in een tijdloze witte uitvoering. Ideaal voor slaapkamers en ruimtes waar volledige lichtblokkering gewenst is.',
        imageUrl: '/images/brands/dc-line/rolgordijn-wit.webp',
        specs: { 'Type': 'Rolgordijn', 'Collectie': 'Magna', 'Kleur': 'Wit', 'Materiaal': '100% Polyester', 'Lichtdoorlatendheid': 'Verduisterend', 'Breedte': '35–400 cm', 'Bediening': 'Ketting / Motor' },
      },
      {
        name: 'Rolgordijn Magna – Crème',
        slug: 'dc-line-rolgordijn-magna-creme',
        description: 'Warme crèmekleurige verduisteringsstof uit de Magna-collectie. Brengt een zachte, natuurlijke sfeer in uw interieur terwijl het licht volledig buiten wordt gehouden.',
        imageUrl: '/images/brands/dc-line/rolgordijn-creme.webp',
        specs: { 'Type': 'Rolgordijn', 'Collectie': 'Magna', 'Kleur': 'Crème', 'Materiaal': '100% Polyester', 'Lichtdoorlatendheid': 'Verduisterend', 'Breedte': '35–400 cm', 'Bediening': 'Ketting / Motor' },
      },
      {
        name: 'Rolgordijn Magna – Antraciet',
        slug: 'dc-line-rolgordijn-magna-antraciet',
        description: 'Stijlvol donker rolgordijn in antraciet uit de Magna-collectie. De diepe kleur geeft een moderne en strakke uitstraling aan elke ruimte.',
        imageUrl: '/images/brands/dc-line/rolgordijn-antraciet.webp',
        specs: { 'Type': 'Rolgordijn', 'Collectie': 'Magna', 'Kleur': 'Antraciet', 'Materiaal': '100% Polyester', 'Lichtdoorlatendheid': 'Verduisterend', 'Breedte': '35–400 cm', 'Bediening': 'Ketting / Motor' },
      },
      {
        name: 'Rolgordijn Basic – Grijs',
        slug: 'dc-line-rolgordijn-basic-grijs',
        description: 'Functioneel en betaalbaar rolgordijn in een neutrale grijstint. Semi-transparante stof filtert het licht op een aangename manier en biedt overdag voldoende privacy.',
        imageUrl: '/images/brands/dc-line/rolgordijn-grijs.webp',
        specs: { 'Type': 'Rolgordijn', 'Collectie': 'Basic', 'Kleur': 'Grijs', 'Materiaal': '100% Polyester', 'Lichtdoorlatendheid': 'Semi-transparant', 'Breedte': '35–400 cm', 'Bediening': 'Ketting' },
      },
      {
        name: 'Rolgordijn Basic – Zwart',
        slug: 'dc-line-rolgordijn-basic-zwart',
        description: 'Minimalistisch rolgordijn in het zwart uit de Basic-collectie. Perfect voor een stoere, industriële look met optimale verduistering.',
        imageUrl: '/images/brands/dc-line/rolgordijn-zwart.webp',
        specs: { 'Type': 'Rolgordijn', 'Collectie': 'Basic', 'Kleur': 'Zwart', 'Materiaal': '100% Polyester', 'Lichtdoorlatendheid': 'Verduisterend', 'Breedte': '35–400 cm', 'Bediening': 'Ketting' },
      },
      // ── Vouwgordijnen ──
      {
        name: 'Vouwgordijn Basic – Wit',
        slug: 'dc-line-vouwgordijn-basic-wit',
        description: 'Lichtdoorlatend vouwgordijn van gerecycled polyester in een frisse witte kleur. De horizontale plooien geven het gordijn een stijlvolle uitstraling wanneer het is opgetrokken.',
        imageUrl: '/images/brands/dc-line/vouwgordijn-wit.webp',
        specs: { 'Type': 'Vouwgordijn', 'Collectie': 'Basic', 'Kleur': 'Wit', 'Materiaal': '100% Gerecycled Polyester', 'Lichtdoorlatendheid': 'Lichtdoorlatend', 'Bediening': 'Ketting / Motor' },
      },
      {
        name: 'Vouwgordijn Basic – Naturel',
        slug: 'dc-line-vouwgordijn-basic-naturel',
        description: 'Warm en natuurlijk vouwgordijn in een zandkleurige tint. Past uitstekend in een Scandinavisch of landelijk interieur.',
        imageUrl: '/images/brands/dc-line/vouwgordijn-naturel.webp',
        specs: { 'Type': 'Vouwgordijn', 'Collectie': 'Basic', 'Kleur': 'Naturel', 'Materiaal': '100% Gerecycled Polyester', 'Lichtdoorlatendheid': 'Lichtdoorlatend', 'Bediening': 'Ketting / Motor' },
      },
      {
        name: 'Vouwgordijn Deluxe – Linnen',
        slug: 'dc-line-vouwgordijn-deluxe-linnen',
        description: 'Premium vouwgordijn met een fijne linnenlook en subtiele glans. De Deluxe-collectie biedt een luxueuze uitstraling met verbeterde isolatie en privacy.',
        imageUrl: '/images/brands/dc-line/vouwgordijn-linnen.webp',
        specs: { 'Type': 'Vouwgordijn', 'Collectie': 'Deluxe', 'Kleur': 'Linnen naturel', 'Materiaal': 'Polyester / Linnen blend', 'Lichtdoorlatendheid': 'Semi-transparant', 'Bediening': 'Ketting / Motor' },
      },
      {
        name: 'Vouwgordijn Klassiek – Grijs',
        slug: 'dc-line-vouwgordijn-klassiek-grijs',
        description: 'Klassiek vouwgordijn met baleinen in een tijdloze grijstint. Vervaardigd met natuurlijke materialen voor een warme, authentieke look.',
        imageUrl: '/images/brands/dc-line/vouwgordijn-grijs.webp',
        specs: { 'Type': 'Vouwgordijn', 'Collectie': 'Klassiek', 'Kleur': 'Grijs', 'Materiaal': 'Katoen / Polyester blend', 'Lichtdoorlatendheid': 'Semi-transparant', 'Bediening': 'Ketting' },
      },
      // ── Duo Rolgordijnen ──
      {
        name: 'Duo Rolgordijn Magna – Wit',
        slug: 'dc-line-duo-rolgordijn-magna-wit',
        description: 'Modern duo rolgordijn met afwisselend transparante en lichtfilterende stroken. Biedt optimale lichtregulatie en privacy in een strakke witte uitvoering.',
        imageUrl: '/images/brands/dc-line/duo-rolgordijn-wit.webp',
        specs: { 'Type': 'Duo Rolgordijn', 'Collectie': 'Magna', 'Kleur': 'Wit', 'Materiaal': '100% Polyester', 'Breedte': '35–250 cm', 'Bediening': 'Ketting / Motor' },
      },
      {
        name: 'Duo Rolgordijn Magna – Crème',
        slug: 'dc-line-duo-rolgordijn-magna-creme',
        description: 'Duo rolgordijn in een warme crèmetint uit de Magna-collectie. Combineert een elegante uitstraling met praktische lichtcontrole.',
        imageUrl: '/images/brands/dc-line/duo-rolgordijn-creme.webp',
        specs: { 'Type': 'Duo Rolgordijn', 'Collectie': 'Magna', 'Kleur': 'Crème', 'Materiaal': '100% Polyester', 'Breedte': '35–250 cm', 'Bediening': 'Ketting / Motor' },
      },
      {
        name: 'Duo Rolgordijn Basic – Grijs',
        slug: 'dc-line-duo-rolgordijn-basic-grijs',
        description: 'Betaalbaar duo rolgordijn in grijs uit de Basic-collectie. Ideaal voor wie een stijlvolle en functionele raamoplossing zoekt zonder hoge kosten.',
        imageUrl: '/images/brands/dc-line/duo-rolgordijn-grijs.webp',
        specs: { 'Type': 'Duo Rolgordijn', 'Collectie': 'Basic', 'Kleur': 'Grijs', 'Materiaal': '100% Polyester', 'Breedte': '35–250 cm', 'Bediening': 'Ketting' },
      },
      {
        name: 'Duo Rolgordijn Basic – Antraciet',
        slug: 'dc-line-duo-rolgordijn-basic-antraciet',
        description: 'Stijlvol duo rolgordijn in antraciet dat een moderne, industriële sfeer creëert. De afwisselende stroken bieden flexibele lichtregulatie.',
        imageUrl: '/images/brands/dc-line/duo-rolgordijn-antraciet.webp',
        specs: { 'Type': 'Duo Rolgordijn', 'Collectie': 'Basic', 'Kleur': 'Antraciet', 'Materiaal': '100% Polyester', 'Breedte': '35–250 cm', 'Bediening': 'Ketting' },
      },
      // ── Honeycomb / Duette ──
      {
        name: 'Honeycomb Plissé – Wit',
        slug: 'dc-line-honeycomb-wit',
        description: 'Honeycomb plissé gordijn met isolerende honingraatstructuur in wit. De top-down / bottom-up bediening biedt maximale flexibiliteit in lichtregulatie en privacy.',
        imageUrl: '/images/brands/dc-line/honeycomb-wit.webp',
        specs: { 'Type': 'Honeycomb / Duette', 'Kleur': 'Wit', 'Materiaal': '100% Polyester', 'Lichtdoorlatendheid': 'Lichtdoorlatend', 'Isolerend': 'Ja (honingraatstructuur)', 'Bediening': 'Top-down / Bottom-up / Motor' },
      },
      {
        name: 'Honeycomb Plissé – Grijs',
        slug: 'dc-line-honeycomb-grijs',
        description: 'Elegante grijze honeycomb plissé met uitstekende warmte- en geluidsisolatie dankzij de dubbele honingraatcelstructuur.',
        imageUrl: '/images/brands/dc-line/honeycomb-grijs.webp',
        specs: { 'Type': 'Honeycomb / Duette', 'Kleur': 'Grijs', 'Materiaal': '100% Polyester', 'Lichtdoorlatendheid': 'Semi-transparant', 'Isolerend': 'Ja (honingraatstructuur)', 'Bediening': 'Top-down / Bottom-up / Motor' },
      },
      {
        name: 'Honeycomb Plissé – Beige',
        slug: 'dc-line-honeycomb-beige',
        description: 'Warme beige honeycomb plissé die een zachte sfeer creëert. Ideaal voor woon- en slaapkamers waar zowel isolatie als stijl belangrijk zijn.',
        imageUrl: '/images/brands/dc-line/honeycomb-beige.webp',
        specs: { 'Type': 'Honeycomb / Duette', 'Kleur': 'Beige', 'Materiaal': '100% Polyester', 'Lichtdoorlatendheid': 'Lichtdoorlatend', 'Isolerend': 'Ja (honingraatstructuur)', 'Bediening': 'Top-down / Bottom-up / Motor' },
      },
      {
        name: 'Honeycomb Plissé Verduisterend – Antraciet',
        slug: 'dc-line-honeycomb-verduisterend-antraciet',
        description: 'Verduisterende honeycomb plissé in antraciet voor volledige lichtblokkering. Combineert superieure isolatie met een strakke, donkere look.',
        imageUrl: '/images/brands/dc-line/honeycomb-antraciet.webp',
        specs: { 'Type': 'Honeycomb / Duette', 'Kleur': 'Antraciet', 'Materiaal': '100% Polyester', 'Lichtdoorlatendheid': 'Verduisterend', 'Isolerend': 'Ja (honingraatstructuur)', 'Bediening': 'Top-down / Bottom-up / Motor' },
      },
      // ── Jaloezieën ──
      {
        name: 'Jaloezie Aluminium 25 mm – Wit',
        slug: 'dc-line-jaloezie-aluminium-25-wit',
        description: 'Strakke aluminium jaloezie met 25 mm lamellen in wit. Vochtbestendig en ideaal voor keukens, badkamers en moderne interieurs.',
        imageUrl: '/images/brands/dc-line/jaloezie-aluminium-wit.webp',
        specs: { 'Type': 'Jaloezie', 'Materiaal': 'Aluminium', 'Lamelbreedte': '25 mm', 'Kleur': 'Wit', 'Bediening': 'Koord en draaistang', 'Vochtbestendig': 'Ja' },
      },
      {
        name: 'Jaloezie Aluminium 50 mm – Antraciet',
        slug: 'dc-line-jaloezie-aluminium-50-antraciet',
        description: 'Brede aluminium jaloezie met 50 mm lamellen in een stoere antracietkleur. De bredere lamellen geven een luxe uitstraling en bieden meer uitzicht wanneer geopend.',
        imageUrl: '/images/brands/dc-line/jaloezie-aluminium-antraciet.webp',
        specs: { 'Type': 'Jaloezie', 'Materiaal': 'Aluminium', 'Lamelbreedte': '50 mm', 'Kleur': 'Antraciet', 'Bediening': 'Koord en draaistang / Motor', 'Vochtbestendig': 'Ja' },
      },
      {
        name: 'Jaloezie Hout 50 mm – Naturel',
        slug: 'dc-line-jaloezie-hout-50-naturel',
        description: 'Houten jaloezie met 50 mm lamellen in een warme, natuurlijke houtkleur. Geeft een landelijke en sfeervolle uitstraling aan uw ramen.',
        imageUrl: '/images/brands/dc-line/jaloezie-hout-naturel.webp',
        specs: { 'Type': 'Jaloezie', 'Materiaal': 'Hout', 'Lamelbreedte': '50 mm', 'Kleur': 'Naturel', 'Bediening': 'Koord en draaistang', 'Vochtbestendig': 'Nee' },
      },
      {
        name: 'Jaloezie Hout 50 mm – Wit',
        slug: 'dc-line-jaloezie-hout-50-wit',
        description: 'Witte houten jaloezie met 50 mm lamellen voor een frisse, lichte uitstraling. Combineert de warmte van hout met een moderne witte afwerking.',
        imageUrl: '/images/brands/dc-line/jaloezie-hout-wit.webp',
        specs: { 'Type': 'Jaloezie', 'Materiaal': 'Hout', 'Lamelbreedte': '50 mm', 'Kleur': 'Wit', 'Bediening': 'Koord en draaistang', 'Vochtbestendig': 'Nee' },
      },
    ],
  },
  {
    name: 'Hamicon Gordijnenatelier',
    slug: 'hamicon',
    logoUrl: '/images/brands/hamicon/logo.webp',
    website: 'https://www.hamicon.nl',
    description: 'Hamicon Gordijnenatelier levert hoogwaardig maatwerk gordijnen, vitrages en raambekleding. Elk product wordt op maat gemaakt met oog voor detail en kwaliteit.',
    shortDescription: 'Maatwerk gordijnenatelier voor elk interieur.',
    featured: false,
    materials: ['Gordijnen'],
    moodImages: [
      '/images/brands/hamicon/mood-1.webp',
      '/images/brands/hamicon/mood-2.webp',
      '/images/brands/hamicon/mood-3.webp',
    ],
    products: [
      {
        name: 'Vouwgordijnen',
        slug: 'hamicon-vouwgordijnen',
        description: 'Maatwerk vouwgordijnen in diverse stoffen en kleuren. Beschikbaar met enkelvoudige plooi, dubbele plooi of Japanse stijl.',
        imageUrl: '/images/brands/hamicon/vouwgordijnen.webp',
        specs: { 'Type': 'Vouwgordijnen', 'Uitvoering': 'Maatwerk', 'Bediening': 'Koord / Motor' },
      },
      {
        name: 'Overgordijnen',
        slug: 'hamicon-overgordijnen',
        description: 'Klassieke overgordijnen op maat. Verkrijgbaar met plooien, zeilringen of als wavegordijn.',
        imageUrl: '/images/brands/hamicon/overgordijnen.webp',
        specs: { 'Type': 'Overgordijnen', 'Uitvoering': 'Maatwerk', 'Stijlen': 'Plooien, Zeilringen, Wave, Specials' },
      },
      {
        name: 'Vitrage',
        slug: 'hamicon-vitrage',
        description: 'Transparante vitrages op maat voor een lichte, luchtige sfeer.',
        imageUrl: '/images/brands/hamicon/vitrage.webp',
        specs: { 'Type': 'Vitrage', 'Uitvoering': 'Maatwerk', 'Plooien': 'Naar keuze' },
      },
      {
        name: 'Paneelgordijnen',
        slug: 'hamicon-paneelgordijnen',
        description: 'Strakke paneelgordijnen, ideaal voor grote raampartijen en als roomdivider.',
        imageUrl: '/images/brands/hamicon/paneelgordijnen.webp',
        specs: { 'Type': 'Paneelgordijnen', 'Uitvoering': 'Maatwerk', 'Bediening': 'Schuifrail' },
      },
      {
        name: 'Rolgordijnen',
        slug: 'hamicon-rolgordijnen',
        description: 'Functionele rolgordijnen op maat in verduisterende, lichtdoorlatende of screen stoffen.',
        imageUrl: '/images/brands/hamicon/rolgordijnen.webp',
        specs: { 'Type': 'Rolgordijnen', 'Uitvoering': 'Maatwerk', 'Bediening': 'Ketting / Motor' },
      },
      {
        name: 'Plissé',
        slug: 'hamicon-plisse',
        description: 'Plissé gordijnen met top-down/bottom-up optie. Isolerend en decoratief.',
        imageUrl: '/images/brands/hamicon/plisse.webp',
        specs: { 'Type': 'Plissé', 'Uitvoering': 'Maatwerk', 'Bediening': 'Koord, koordloos, elektrisch' },
      },
    ],
  },
];

// ────────────────────────────────────────────
// Alle Categorieën
// ────────────────────────────────────────────

export const categories: Category[] = [
  {
    name: 'PVC Vloeren',
    slug: 'pvc-vloeren',
    description: 'Stijlvol, duurzaam en onderhoudsvriendelijk. De perfecte vloeroplossing voor elk modern interieur.',
    imageUrl: '/images/categories/pvc-vloeren.jpg',
    icon: 'Layers',
    brands: pvcBrands,
  },
  {
    name: 'Traprenovatie',
    slug: 'traprenovatie',
    description: 'Geef uw trap een compleet nieuwe uitstraling zonder de kosten van een volledige vervanging.',
    imageUrl: '/images/categories/traprenovatie.jpg',
    icon: 'ArrowUpDown',
    brands: traprenovatieBrands,
  },
  {
    name: 'Raamdecoratie',
    slug: 'raamdecoratie',
    description: 'Van rolgordijnen tot jaloezieën: sfeervolle oplossingen voor elk raam in hout, kunststof en bamboe.',
    imageUrl: '/images/categories/raamdecoratie.jpg',
    icon: 'Sun',
    brands: [],
    raamdecoratieTypes: raamdecoratieTypes,
  },
  {
    name: 'Vloerbedekking',
    slug: 'vloerbedekking',
    description: 'Breng warmte en comfort in uw huis met onze hoogwaardige vloerbedekking en karpetten op maat.',
    imageUrl: '/images/categories/vloerbedekking.jpg',
    icon: 'ShieldCheck',
    brands: vloerbedekkingBrands,
  },
  {
    name: 'Gordijnen',
    slug: 'gordijnen',
    description: 'Maak uw interieur compleet met prachtige gordijnen op maat.',
    imageUrl: '/images/categories/gordijnen.jpg',
    icon: 'Wind',
    brands: gordijnenBrands,
    raamdecoratieTypes: gordijnenTypes,
  },
  {
    name: 'Houten Vloeren',
    slug: 'houten-vloeren',
    description: 'Authentieke houten vloeren met karakter. Duurzaam gesourced hout voor een warm en tijdloos interieur.',
    imageUrl: '/images/categories/houten-vloeren.jpg',
    icon: 'TreePine',
    brands: houtBrands,
  },
];

// ────────────────────────────────────────────
// Helper functions
// ────────────────────────────────────────────

export function getCategoryBySlug(slug: string): Category | undefined {
  return categories.find(c => c.slug === slug);
}

export function getBrandBySlug(categorySlug: string, brandSlug: string): Brand | undefined {
  const category = getCategoryBySlug(categorySlug);
  return category?.brands.find(b => b.slug === brandSlug);
}

export function getAllBrands(): Brand[] {
  return categories.flatMap(c => c.brands);
}

export function getFeaturedBrands(): Brand[] {
  return getAllBrands().filter(b => b.featured);
}

export function getAllMaterials(): string[] {
  const materials = new Set<string>();
  getAllBrands().forEach(b => b.materials.forEach(m => materials.add(m)));
  return Array.from(materials);
}

export function getCategoriesWithBrands(): Category[] {
  return categories.filter(c => c.brands.length > 0);
}

// ────────────────────────────────────────────
// Product Types (for gordijnen + raamdecoratie menu flow)
// ────────────────────────────────────────────

export type ProductType = {
  name: string;
  slug: string;
};

function slugify(s: string): string {
  return s.toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/\s*\/\s*/g, '-')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');
}

// Normalize singular/plural variants so Rolgordijn + Rolgordijnen → same type
function normalizeTypeName(name: string): string {
  const lower = name.toLowerCase().trim();
  const map: Record<string, string> = {
    'rolgordijn': 'Rolgordijnen',
    'rolgordijnen': 'Rolgordijnen',
    'vouwgordijn': 'Vouwgordijnen',
    'vouwgordijnen': 'Vouwgordijnen',
    'duo rolgordijn': 'Duo Rolgordijnen',
    'duo rolgordijnen': 'Duo Rolgordijnen',
    'overgordijn': 'Overgordijnen',
    'overgordijnen': 'Overgordijnen',
    'paneelgordijn': 'Paneelgordijnen',
    'paneelgordijnen': 'Paneelgordijnen',
    'jaloezie': 'Jaloezieën',
    'jaloezieen': 'Jaloezieën',
    'jaloezieën': 'Jaloezieën',
    'honeycomb / duette': 'Duette',
    'duette': 'Duette',
    'duette gordijnen': 'Duette',
    'plisse': 'Plissé',
    'plissé': 'Plissé',
    'vitrage': 'Vitrage',
  };
  return map[lower] || name;
}

export function getProductTypesForCategory(categorySlug: string): ProductType[] {
  const category = getCategoryBySlug(categorySlug);
  if (!category) return [];

  // Category has explicit raamdecoratie types
  if (category.raamdecoratieTypes && category.raamdecoratieTypes.length > 0) {
    return category.raamdecoratieTypes.map(t => ({ name: t.name, slug: t.slug }));
  }

  // Extract unique Type specs from brand products
  const typeMap = new Map<string, string>(); // slug → display name
  for (const brand of category.brands) {
    for (const product of brand.products) {
      const rawType = product.specs['Type'];
      if (rawType) {
        const normalized = normalizeTypeName(rawType);
        const slug = slugify(normalized);
        if (!typeMap.has(slug)) typeMap.set(slug, normalized);
      }
    }
  }
  return Array.from(typeMap.entries())
    .map(([slug, name]) => ({ name, slug }))
    .sort((a, b) => a.name.localeCompare(b.name, 'nl'));
}

// Get brands that offer a specific product type (cross-category via TYPE_MATCHERS).
// Falls back to all brands in the category if none match anywhere.
export function getBrandsByType(categorySlug: string, typeSlug: string): Brand[] {
  const matcher = TYPE_MATCHERS[typeSlug];
  const seen = new Set<string>();
  const results: Brand[] = [];

  if (matcher) {
    for (const cat of categories) {
      for (const brand of cat.brands) {
        if (seen.has(brand.slug)) continue;
        const hasMatch = brand.products.some(p => {
          const rawType = p.specs['Type'];
          return rawType ? matcher(rawType) : false;
        });
        if (hasMatch) {
          seen.add(brand.slug);
          results.push(brand);
        }
      }
    }
  }

  if (results.length > 0) return results;

  // Fallback: all brands in the selected category
  const category = getCategoryBySlug(categorySlug);
  return category?.brands ?? [];
}

export function getTypeBySlug(categorySlug: string, typeSlug: string): ProductType | undefined {
  return getProductTypesForCategory(categorySlug).find(t => t.slug === typeSlug);
}

// Type slug → matcher predicate for product Type specs (cross-category)
const TYPE_MATCHERS: Record<string, (type: string) => boolean> = {
  'rolgordijnen': (t) => /rolgordijn/i.test(t) && !/duo/i.test(t),
  'vouwgordijnen': (t) => /vouwgordijn/i.test(t),
  'duorolgordijnen': (t) => /duo[\s-]*rolgordijn/i.test(t),
  'duo-rolgordijnen': (t) => /duo[\s-]*rolgordijn/i.test(t),
  'duette': (t) => /duette|honeycomb/i.test(t),
  'jaloezieen': (t) => /jaloezie/i.test(t),
  'horren': (t) => /\bhor(ren)?\b/i.test(t),
  'gordijnen': (t) => /overgordijn|paneelgordijn/i.test(t),
  'inbetweens': (t) => /vitrage|inbetween/i.test(t),
};

export type ProductMatch = {
  product: BrandProduct;
  brand: Brand;
  categorySlug: string;
  categoryName: string;
};

// Check if a single product spec Type matches a type slug
export function productMatchesType(product: BrandProduct, typeSlug: string): boolean {
  const matcher = TYPE_MATCHERS[typeSlug];
  if (!matcher) return false;
  const rawType = product.specs['Type'];
  return rawType ? matcher(rawType) : false;
}

// Cross-category product search by type slug
export function getProductsByType(typeSlug: string): ProductMatch[] {
  const matcher = TYPE_MATCHERS[typeSlug];
  if (!matcher) return [];

  const results: ProductMatch[] = [];
  for (const category of categories) {
    for (const brand of category.brands) {
      for (const product of brand.products) {
        const rawType = product.specs['Type'];
        if (rawType && matcher(rawType)) {
          results.push({ product, brand, categorySlug: category.slug, categoryName: category.name });
        }
      }
    }
  }
  return results;
}
