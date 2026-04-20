// ============================================================
// Brand & Category Data — BPM Parket
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

export type Category = {
  name: string;
  slug: string;
  description: string;
  imageUrl: string;
  icon: string; // lucide icon name
  isService?: boolean; // true voor diensten zonder product-grid (Legservice, Interieurwerken)
  brands: Brand[];
};

// ────────────────────────────────────────────
// Parket en Multiplanken
// ────────────────────────────────────────────

const parketBrands: Brand[] = [
  {
    name: 'Ter Hürne',
    slug: 'ter-hurne',
    logoUrl: 'https://images.unsplash.com/photo-1615971677499-5467cbab01c0?q=80&w=400&auto=format&fit=crop',
    website: 'https://www.terhurne.com',
    description: 'Duitse kwaliteitsfabrikant van houten vloeren met meer dan 60 jaar ervaring. Ter Hürne staat voor duurzaamheid, innovatie en klassiek vakmanschap.',
    shortDescription: 'Duits kwaliteitsparket met 60+ jaar ervaring.',
    featured: true,
    materials: ['Eiken', 'Noten', 'Esdoorn'],
    moodImages: [
      'https://images.unsplash.com/photo-1615971677499-5467cbab01c0?q=80&w=1600&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1618220179428-22790b461013?q=80&w=1600&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?q=80&w=1600&auto=format&fit=crop'
    ],
    products: [
      {
        name: 'Eiken Natuur',
        slug: 'eiken-natuur',
        description: 'Natuurlijke eikenvloer met levendige nerfstructuur en warme kleurnuances. Geolied voor een matte, zijdezachte uitstraling.',
        imageUrl: 'https://images.unsplash.com/photo-1615971677499-5467cbab01c0?q=80&w=800&auto=format&fit=crop',
        specs: { 'Houtsoort': 'Eiken', 'Dikte': '14 mm', 'Breedte': '190 mm', 'Afwerking': 'Natuurlijk geolied', 'Legsysteem': 'Click' }
      },
      {
        name: 'Eiken Rustiek',
        slug: 'eiken-rustiek',
        description: 'Rustieke eikenvloer met zichtbare knoesten en kieren. Karakteristieke, landelijke uitstraling.',
        imageUrl: 'https://images.unsplash.com/photo-1618220179428-22790b461013?q=80&w=800&auto=format&fit=crop',
        specs: { 'Houtsoort': 'Eiken rustiek', 'Dikte': '14 mm', 'Breedte': '220 mm', 'Afwerking': 'Geborsteld & geolied', 'Legsysteem': 'Click' }
      },
      {
        name: 'Multiplank Noten',
        slug: 'multiplank-noten',
        description: 'Warme notenhouten multiplank met rijke bruintint en karakteristieke nerf. Ideaal voor klassieke interieurs.',
        imageUrl: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?q=80&w=800&auto=format&fit=crop',
        specs: { 'Houtsoort': 'Noten', 'Dikte': '15 mm', 'Breedte': '180 mm', 'Afwerking': 'Gelakt', 'Legsysteem': 'Lijm / click' }
      }
    ]
  },
  {
    name: 'Junckers',
    slug: 'junckers',
    logoUrl: 'https://images.unsplash.com/photo-1598300042247-d088f8ab3a91?q=80&w=400&auto=format&fit=crop',
    website: 'https://www.junckers.com',
    description: 'Deens fabrikant van massief parket sinds 1930. Junckers combineert Scandinavisch design met ambachtelijke productie en maximale duurzaamheid.',
    shortDescription: 'Deens massief parket — Scandinavisch design.',
    featured: true,
    materials: ['Beuken', 'Eiken', 'Essen'],
    moodImages: [
      'https://images.unsplash.com/photo-1598300042247-d088f8ab3a91?q=80&w=1600&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?q=80&w=1600&auto=format&fit=crop'
    ],
    products: [
      {
        name: 'Classic Beuken',
        slug: 'classic-beuken',
        description: 'Massief beuken parket met lichte tint en rustige nerf. Duurzaam en makkelijk te onderhouden.',
        imageUrl: 'https://images.unsplash.com/photo-1598300042247-d088f8ab3a91?q=80&w=800&auto=format&fit=crop',
        specs: { 'Houtsoort': 'Beuken', 'Dikte': '22 mm', 'Breedte': '129 mm', 'Afwerking': 'Gelakt', 'Legsysteem': 'Tand & groef' }
      },
      {
        name: 'Premium Eiken',
        slug: 'premium-eiken',
        description: 'Premium massief eiken met diepe structuur en intense uitstraling. Een leven lang mee te schuren.',
        imageUrl: 'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?q=80&w=800&auto=format&fit=crop',
        specs: { 'Houtsoort': 'Eiken', 'Dikte': '22 mm', 'Breedte': '140 mm', 'Afwerking': 'Geolied', 'Legsysteem': 'Tand & groef' }
      }
    ]
  },
  {
    name: 'Bauwerk Parkett',
    slug: 'bauwerk-parkett',
    logoUrl: 'https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?q=80&w=400&auto=format&fit=crop',
    website: 'https://www.bauwerk-parkett.com',
    description: 'Zwitsers premium parket met uitzonderlijke kwaliteit. Bauwerk staat voor precisie, vakmanschap en duurzaam design sinds 1935.',
    shortDescription: 'Zwitsers premium parket met precisie-vakmanschap.',
    featured: true,
    materials: ['Eiken', 'Es', 'Kers'],
    moodImages: [
      'https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?q=80&w=1600&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?q=80&w=1600&auto=format&fit=crop'
    ],
    products: [
      {
        name: 'Cleverpark',
        slug: 'cleverpark',
        description: 'Cleverpark-parket — compact en efficiënt, ideaal voor kleinere ruimtes met karaktervolle uitstraling.',
        imageUrl: 'https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?q=80&w=800&auto=format&fit=crop',
        specs: { 'Houtsoort': 'Eiken', 'Dikte': '11 mm', 'Breedte': '135 mm', 'Afwerking': 'Geolied', 'Legsysteem': 'Click' }
      },
      {
        name: 'Monopark',
        slug: 'monopark',
        description: 'Monopark — brede eiken plank met tijdloze elegantie. Voor ruime interieurs en klassieke woningen.',
        imageUrl: 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?q=80&w=800&auto=format&fit=crop',
        specs: { 'Houtsoort': 'Eiken', 'Dikte': '14 mm', 'Breedte': '220 mm', 'Afwerking': 'Gelakt', 'Legsysteem': 'Tand & groef' }
      }
    ]
  }
];

// ────────────────────────────────────────────
// PVC en Laminaat
// ────────────────────────────────────────────

const pvcLaminaatBrands: Brand[] = [
  {
    name: 'Quick-Step',
    slug: 'quick-step',
    logoUrl: 'https://images.unsplash.com/photo-1556228720-195a672e8a03?q=80&w=400&auto=format&fit=crop',
    website: 'https://www.quick-step.com',
    description: 'Belgische fabrikant van laminaat en hybride vloeren. Innovatief, duurzaam en moeiteloos te leggen.',
    shortDescription: 'Belgisch laminaat en hybride — innovatief en duurzaam.',
    featured: true,
    materials: ['Laminaat', 'Hybride'],
    moodImages: [
      'https://images.unsplash.com/photo-1556228720-195a672e8a03?q=80&w=1600&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?q=80&w=1600&auto=format&fit=crop'
    ],
    products: [
      {
        name: 'Impressive',
        slug: 'impressive',
        description: 'Laminaat met authentieke houtlook en V-groeven voor een realistische planken-ervaring.',
        imageUrl: 'https://images.unsplash.com/photo-1556228720-195a672e8a03?q=80&w=800&auto=format&fit=crop',
        specs: { 'Materiaal': 'Laminaat', 'Dikte': '8 mm', 'Breedte': '190 mm', 'Afwerking': 'V-groef', 'Legsysteem': 'Uniclic' }
      },
      {
        name: 'Alpha Hybride',
        slug: 'alpha-hybride',
        description: 'Hybride vloer (laminaat-PVC mix) — waterdicht, slijtvast en stil.',
        imageUrl: 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?q=80&w=800&auto=format&fit=crop',
        specs: { 'Materiaal': 'Hybride', 'Dikte': '5 mm', 'Breedte': '209 mm', 'Afwerking': 'Waterdicht', 'Legsysteem': 'Click' }
      }
    ]
  },
  {
    name: 'Moduleo',
    slug: 'moduleo',
    logoUrl: 'https://images.unsplash.com/photo-1519947486511-46149fa0a254?q=80&w=400&auto=format&fit=crop',
    website: 'https://www.moduleo.com',
    description: 'Luxe design-PVC met een breed kleurpalet. Ideaal voor woonkamer, slaapkamer en badkamer.',
    shortDescription: 'Luxe design PVC — klik & dryback.',
    featured: true,
    materials: ['PVC'],
    moodImages: [
      'https://images.unsplash.com/photo-1519947486511-46149fa0a254?q=80&w=1600&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1565182999561-18d7dc61c393?q=80&w=1600&auto=format&fit=crop'
    ],
    products: [
      {
        name: 'Transform',
        slug: 'transform',
        description: 'Transform-collectie met realistische houtlook en matte finish.',
        imageUrl: 'https://images.unsplash.com/photo-1519947486511-46149fa0a254?q=80&w=800&auto=format&fit=crop',
        specs: { 'Materiaal': 'PVC Dryback', 'Dikte': '2,5 mm', 'Breedte': '132 mm', 'Topslijtlaag': '0,55 mm', 'Legsysteem': 'Dryback (verlijmd)' }
      },
      {
        name: 'Roots Klik',
        slug: 'roots-klik',
        description: 'Roots klikvinyl — eenvoudig zelf te leggen, ideaal voor renovatie.',
        imageUrl: 'https://images.unsplash.com/photo-1565182999561-18d7dc61c393?q=80&w=800&auto=format&fit=crop',
        specs: { 'Materiaal': 'PVC Klik', 'Dikte': '5 mm', 'Breedte': '178 mm', 'Topslijtlaag': '0,40 mm', 'Legsysteem': 'Click' }
      }
    ]
  },
  {
    name: 'Forbo Novilon',
    slug: 'forbo-novilon',
    logoUrl: 'https://images.unsplash.com/photo-1574362848149-11496d93a7c7?q=80&w=400&auto=format&fit=crop',
    website: 'https://www.forbo.com',
    description: 'Forbo Novilon — Nederlands PVC van hoge kwaliteit. Veelzijdig, duurzaam en betaalbaar.',
    shortDescription: 'Nederlands PVC — duurzaam en veelzijdig.',
    featured: false,
    materials: ['PVC'],
    moodImages: [
      'https://images.unsplash.com/photo-1574362848149-11496d93a7c7?q=80&w=1600&auto=format&fit=crop'
    ],
    products: [
      {
        name: 'Viva Dryback',
        slug: 'viva-dryback',
        description: 'Viva Dryback — premium PVC met uitzonderlijke slijtvastheid voor drukbelopen ruimtes.',
        imageUrl: 'https://images.unsplash.com/photo-1574362848149-11496d93a7c7?q=80&w=800&auto=format&fit=crop',
        specs: { 'Materiaal': 'PVC Dryback', 'Dikte': '2,5 mm', 'Breedte': '184 mm', 'Topslijtlaag': '0,55 mm', 'Legsysteem': 'Dryback' }
      },
      {
        name: 'Novilon Klik',
        slug: 'novilon-klik',
        description: 'Klikvinyl met waterdichte kern — onderhoudsarm en geschikt voor alle vertrekken.',
        imageUrl: 'https://images.unsplash.com/photo-1574362848149-11496d93a7c7?q=80&w=800&auto=format&fit=crop',
        specs: { 'Materiaal': 'PVC Klik', 'Dikte': '4 mm', 'Breedte': '178 mm', 'Topslijtlaag': '0,33 mm', 'Legsysteem': 'Click' }
      }
    ]
  }
];

// ────────────────────────────────────────────
// Buitenparket
// ────────────────────────────────────────────

const buitenparketBrands: Brand[] = [
  {
    name: 'Bangkirai Hardhout',
    slug: 'bangkirai-hardhout',
    logoUrl: 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?q=80&w=400&auto=format&fit=crop',
    description: 'Tropisch hardhout met uitzonderlijke duurzaamheid buitenshuis. Bangkirai is bestand tegen weer en wind.',
    shortDescription: 'Tropisch hardhout — duurzaam buitenparket.',
    featured: true,
    materials: ['Bangkirai'],
    moodImages: [
      'https://images.unsplash.com/photo-1500382017468-9049fed747ef?q=80&w=1600&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1449844908441-8829872d2607?q=80&w=1600&auto=format&fit=crop'
    ],
    products: [
      {
        name: 'Bangkirai 145mm',
        slug: 'bangkirai-145mm',
        description: 'Standaard bangkirai-plank met glad of geribbeld oppervlak. Ideaal voor terras en vlonder.',
        imageUrl: 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?q=80&w=800&auto=format&fit=crop',
        specs: { 'Houtsoort': 'Bangkirai', 'Dikte': '25 mm', 'Breedte': '145 mm', 'Lengte': 'Tot 3 m', 'Toepassing': 'Terras, vlonder' }
      },
      {
        name: 'Bangkirai 195mm Premium',
        slug: 'bangkirai-195mm-premium',
        description: 'Premium brede bangkirai voor ruime terrassen. FSC-gecertificeerd uit duurzaam beheerd bos.',
        imageUrl: 'https://images.unsplash.com/photo-1449844908441-8829872d2607?q=80&w=800&auto=format&fit=crop',
        specs: { 'Houtsoort': 'Bangkirai FSC', 'Dikte': '25 mm', 'Breedte': '195 mm', 'Lengte': 'Tot 4 m', 'Toepassing': 'Premium terras' }
      }
    ]
  },
  {
    name: 'Millboard Composiet',
    slug: 'millboard-composiet',
    logoUrl: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?q=80&w=400&auto=format&fit=crop',
    website: 'https://www.millboard.com',
    description: 'Millboard — composiet terrasdelen die eruitzien als hout maar nooit hoeven geolied te worden. Weer- en vlekbestendig.',
    shortDescription: 'Composiet buitendek — onderhoudsvrij.',
    featured: false,
    materials: ['Composiet'],
    moodImages: [
      'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?q=80&w=1600&auto=format&fit=crop'
    ],
    products: [
      {
        name: 'Enhanced Grain',
        slug: 'enhanced-grain',
        description: 'Realistische hout-textuur met diepe nerfstructuur. Antislip en kleurvast.',
        imageUrl: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?q=80&w=800&auto=format&fit=crop',
        specs: { 'Materiaal': 'Composiet', 'Dikte': '32 mm', 'Breedte': '176 mm', 'Kleur': 'Diverse tinten', 'Garantie': '25 jaar' }
      },
      {
        name: 'Weathered',
        slug: 'weathered',
        description: 'Verweerde-look terrasdeel met grijstinten voor een moderne uitstraling.',
        imageUrl: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?q=80&w=800&auto=format&fit=crop',
        specs: { 'Materiaal': 'Composiet', 'Dikte': '32 mm', 'Breedte': '176 mm', 'Kleur': 'Driftwood / Vintage Oak', 'Garantie': '25 jaar' }
      }
    ]
  }
];

// ────────────────────────────────────────────
// Traprenovatie
// ────────────────────────────────────────────

const traprenovatieBrands: Brand[] = [
  {
    name: 'StairSmart',
    slug: 'stairsmart',
    logoUrl: 'https://images.unsplash.com/photo-1503174971373-b1f69850bded?q=80&w=400&auto=format&fit=crop',
    description: 'Traprenovatie-specialist met overzettreden voor elke trapvorm. Snelle installatie, duurzaam resultaat.',
    shortDescription: 'Overzettreden voor traprenovatie.',
    featured: true,
    materials: ['Eiken', 'Fineer'],
    moodImages: [
      'https://images.unsplash.com/photo-1503174971373-b1f69850bded?q=80&w=1600&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1523413555775-4c5b2f3a8e11?q=80&w=1600&auto=format&fit=crop'
    ],
    products: [
      {
        name: 'Eiken Overzettreden',
        slug: 'eiken-overzettreden',
        description: 'Massieve eiken overzettreden — op maat gemaakt voor uw trap. Geolied of gelakt.',
        imageUrl: 'https://images.unsplash.com/photo-1503174971373-b1f69850bded?q=80&w=800&auto=format&fit=crop',
        specs: { 'Houtsoort': 'Eiken', 'Dikte': '20 mm', 'Afwerking': 'Geolied / gelakt', 'Installatie': '1 dag per trap' }
      },
      {
        name: 'Fineer Overzettreden',
        slug: 'fineer-overzettreden',
        description: 'Budgetvriendelijk fineer — diverse houtlooks. Perfect voor renovatie op beperkt budget.',
        imageUrl: 'https://images.unsplash.com/photo-1523413555775-4c5b2f3a8e11?q=80&w=800&auto=format&fit=crop',
        specs: { 'Materiaal': 'HDF met fineer', 'Dikte': '15 mm', 'Afwerking': 'Diverse houtlooks', 'Installatie': '1 dag per trap' }
      }
    ]
  },
  {
    name: 'Maatwerk Eikenhout',
    slug: 'maatwerk-eikenhout',
    logoUrl: 'https://images.unsplash.com/photo-1600566753051-6057f3c89b2f?q=80&w=400&auto=format&fit=crop',
    description: 'Volledig maatwerk in eiken — voor trappen met bijzondere vormen of wensen. Elke stoot en trede wordt op maat gemaakt.',
    shortDescription: 'Maatwerk eiken — volledig op maat.',
    featured: false,
    materials: ['Eiken'],
    moodImages: [
      'https://images.unsplash.com/photo-1600566753051-6057f3c89b2f?q=80&w=1600&auto=format&fit=crop'
    ],
    products: [
      {
        name: 'Massief Eiken Stootbord',
        slug: 'massief-eiken-stootbord',
        description: 'Massief eiken stootborden — volledig op maat gezaagd en afgewerkt.',
        imageUrl: 'https://images.unsplash.com/photo-1600566753051-6057f3c89b2f?q=80&w=800&auto=format&fit=crop',
        specs: { 'Houtsoort': 'Massief eiken', 'Dikte': '20 mm', 'Afwerking': 'Geolied', 'Maatwerk': 'Ja' }
      },
      {
        name: 'Eiken Trapleuning',
        slug: 'eiken-trapleuning',
        description: 'Handgedraaide eiken trapleuning op maat — volledig passend bij uw nieuwe traptreden.',
        imageUrl: 'https://images.unsplash.com/photo-1600566753051-6057f3c89b2f?q=80&w=800&auto=format&fit=crop',
        specs: { 'Houtsoort': 'Eiken', 'Afwerking': 'Geolied / gelakt', 'Maatwerk': 'Ja' }
      }
    ]
  }
];

// ────────────────────────────────────────────
// Categories export
// ────────────────────────────────────────────

export const categories: Category[] = [
  {
    name: 'Parket en Multiplanken',
    slug: 'parket-en-multiplanken',
    description: 'Traditioneel parket en multiplanken — de kernspecialiteit van BPM Parket sinds 1992.',
    imageUrl: 'https://images.unsplash.com/photo-1615971677499-5467cbab01c0?q=80&w=1600&auto=format&fit=crop',
    icon: 'Layers',
    brands: parketBrands
  },
  {
    name: 'PVC en Laminaat',
    slug: 'pvc-en-laminaat',
    description: 'PVC en laminaat — duurzame, onderhoudsvriendelijke vloeren met een houten of steenlook.',
    imageUrl: 'https://images.unsplash.com/photo-1519947486511-46149fa0a254?q=80&w=1600&auto=format&fit=crop',
    icon: 'LayoutGrid',
    brands: pvcLaminaatBrands
  },
  {
    name: 'Legservice',
    slug: 'legservice',
    description: 'Vakkundige legservice door ons eigen team — van voorbereiding tot plinten en afwerking.',
    imageUrl: 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?q=80&w=1600&auto=format&fit=crop',
    icon: 'Wrench',
    isService: true,
    brands: []
  },
  {
    name: 'Traprenovatie',
    slug: 'traprenovatie',
    description: 'Geef uw trap een nieuw leven — vakkundige traprenovatie met hoogwaardige houtsoorten.',
    imageUrl: 'https://images.unsplash.com/photo-1503174971373-b1f69850bded?q=80&w=1600&auto=format&fit=crop',
    icon: 'ArrowUpDown',
    brands: traprenovatieBrands
  },
  {
    name: 'Buitenparket',
    slug: 'buitenparket',
    description: 'Weer- en UV-bestendig buitenparket voor terras, vlonder en tuin. Hardhout of composiet.',
    imageUrl: 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?q=80&w=1600&auto=format&fit=crop',
    icon: 'Sun',
    brands: buitenparketBrands
  },
  {
    name: 'Interieurwerken',
    slug: 'interieurwerken',
    description: 'Maatwerk interieurwerken — radiatorombouwen, plinten, drempels en meer.',
    imageUrl: 'https://images.unsplash.com/photo-1600607687644-aac4c3eac7f4?q=80&w=1600&auto=format&fit=crop',
    icon: 'Hammer',
    isService: true,
    brands: []
  }
];

// ────────────────────────────────────────────
// Helpers
// ────────────────────────────────────────────

export function getCategoryBySlug(slug: string): Category | undefined {
  return categories.find(c => c.slug === slug);
}

export function getBrandBySlug(categorySlug: string, brandSlug: string): Brand | undefined {
  return getCategoryBySlug(categorySlug)?.brands.find(b => b.slug === brandSlug);
}

export function getAllBrands(): Brand[] {
  return categories.flatMap(c => c.brands);
}

export function getFeaturedBrands(): Brand[] {
  return getAllBrands().filter(b => b.featured);
}

export function getAllMaterials(): string[] {
  const set = new Set<string>();
  getAllBrands().forEach(b => b.materials.forEach(m => set.add(m)));
  return Array.from(set).sort();
}

export function getCategoriesWithBrands(): Category[] {
  return categories.filter(c => !c.isService);
}

export function isServiceCategory(slug: string): boolean {
  return !!getCategoryBySlug(slug)?.isService;
}
