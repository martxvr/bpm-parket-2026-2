import Link from 'next/link';
import {
  ArrowRight,
  ArrowUpRight,
  Award,
  CheckCircle2,
  Hammer,
  Layers,
  PenTool,
  ShieldCheck,
  Sofa,
  Star,
  Sun,
  Zap,
} from 'lucide-react';
import { getFeaturedProjects, getProjects } from '@/lib/db/projects';
import { HeroSlider } from '@/components/marketing/home/HeroSlider';
import { RevealOnScroll } from '@/components/marketing/home/RevealOnScroll';

const TESTIMONIALS = [
  {
    name: 'Demi, uit Geleen',
    text: 'Komen hun afspraken na, snel en vakkundig een pvc visgraat vloer gelegd. Wij zijn zeer tevreden en raden dit bedrijf zeker aan! Dankjewel jongens.',
    stars: 5,
  },
  {
    name: 'Maarten, uit Den Bosch',
    text: 'Zeer goed werk en erg behulpzaam! Dachten ook mee over bepaalde dingen !',
    stars: 5,
  },
  {
    name: 'Paul, uit Eindhoven',
    text: 'Geweldig gedaan, hij komt uitstekend zijn afspraken na en hij mag de volgende keer graag weer komen. Zijn prijs is trouwens ook uitstekend',
    stars: 5,
  },
];

const LOGOS = ['LOGO', 'LOGO', 'LOGO', 'LOGO', 'LOGO', 'LOGO', 'LOGO', 'LOGO'];

const SERVICES = [
  { icon: Layers, title: 'PVC en Laminaat', desc: 'Stijlvol, duurzaam en onderhoudsvriendelijk.' },
  { icon: ShieldCheck, title: 'Parket en Multiplanken', desc: 'Traditioneel vakmanschap in massief hout.' },
  { icon: Hammer, title: 'Legservice', desc: 'Professionele plaatsing door onze specialisten.' },
  { icon: Zap, title: 'Trap renovatie', desc: 'Nieuwe uitstraling, vaak binnen één dag.' },
  { icon: Sun, title: 'Buitenparket', desc: 'Robuuste houten vloeren voor buiten.' },
  { icon: Sofa, title: 'Interieurwerken', desc: 'Maatwerk meubels en interieurafwerking.' },
];

export default async function HomePage() {
  // Try featured projects first; fall back to first 3 projects (mirrors Vite behaviour).
  let featured = await getFeaturedProjects();
  if (!featured.length) {
    const all = await getProjects();
    featured = all.slice(0, 3);
  }
  const featuredProjects = featured.slice(0, 2);

  return (
    <div className="flex flex-col w-full overflow-hidden bg-white text-brand-dark">
      <RevealOnScroll />

      {/* Hero Section */}
      <HeroSlider />

      {/* Logos Strip */}
      <section className="py-12 border-y border-gray-100 reveal delay-100 overflow-hidden">
        <div className="w-full relative opacity-50 grayscale hover:opacity-100 transition-opacity duration-500">
          <div className="animate-marquee flex items-center">
            {/* Repeat the logos array completely symmetrical so translateX(-50%) loops perfectly */}
            {[
              ...LOGOS,
              ...LOGOS,
              ...LOGOS,
              ...LOGOS,
              ...LOGOS,
              ...LOGOS,
              ...LOGOS,
              ...LOGOS,
            ].map((logo, i) => (
              <span
                key={i}
                className="text-xl font-bold font-sans text-brand-dark tracking-widest mx-12 whitespace-nowrap"
              >
                {logo}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* About Section */}
      <section className="py-24 lg:py-32 bg-white reveal">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <span className="text-xs font-bold tracking-widest text-gray-400 uppercase mb-4 block">
            Onze Passie
          </span>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
            <h2 className="text-4xl lg:text-5xl font-bold text-black leading-tight max-w-xl">
              De kunst van traditioneel parket, bij u thuis.
            </h2>

            <div className="space-y-8">
              <p className="text-gray-500 text-lg leading-relaxed">
                Bij BPM Parket geloven we dat een vloer de basis is van uw woongenot. Met oog
                voor detail en liefde voor authentiek vakmanschap realiseren wij vloeren en
                trappen die generaties lang meegaan. Van klassiek visgraat tot modern PVC.
              </p>
              <div className="flex gap-12">
                <div>
                  <h3 className="text-4xl font-bold text-black mb-1">20+</h3>
                  <p className="text-sm text-gray-400">Jaar Ervaring</p>
                </div>
                <div>
                  <h3 className="text-4xl font-bold text-black mb-1">100%</h3>
                  <p className="text-sm text-gray-400">Maatwerk</p>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-20 relative rounded-[3rem] overflow-hidden h-[500px] w-full group reveal delay-100">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="https://www.bpmparket.nl/wp-content/uploads/2023/10/2023-10-02-12_27_45-WhatsApp-en-nog-9-andere-paginas-Werk-Microsoft%E2%80%8B-Edge-e1696335757551.png"
              alt="Vakmanschap"
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
            />
            {/* Floating Tags on Image */}
            <div className="absolute top-10 left-10 bg-white px-4 py-2 rounded-full flex items-center shadow-lg">
              <PenTool className="w-4 h-4 mr-2 text-black" />
              <span className="text-sm font-semibold">Handgemaakt</span>
            </div>
            <div className="absolute bottom-10 right-10 bg-white px-4 py-2 rounded-full flex items-center shadow-lg">
              <Award className="w-4 h-4 mr-2 text-black" />
              <span className="text-sm font-semibold">Premium Kwaliteit</span>
            </div>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section className="py-24 bg-brand-brown/5 reveal">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <span className="text-xs font-bold tracking-widest text-brand-brown uppercase mb-4 block">
            Specialisaties
          </span>
          <h2 className="text-4xl font-bold text-black mb-16 max-w-2xl">
            Van vloer tot meubel: alles voor uw houten interieur
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {SERVICES.map((service, i) => (
              <div
                key={i}
                className={`bg-white p-8 rounded-[2rem] hover:shadow-xl transition-all duration-300 reveal delay-${(i + 1) * 100}`}
              >
                <div className="w-10 h-10 bg-black rounded-full flex items-center justify-center mb-6 text-white">
                  <service.icon className="w-5 h-5" />
                </div>
                <h3 className="text-lg font-bold mb-3">{service.title}</h3>
                <p className="text-sm text-gray-500 leading-relaxed">{service.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Projects Section */}
      <section className="py-24 bg-white reveal">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <span className="text-xs font-bold tracking-widest text-brand-brown uppercase mb-4 block">
              Portfolio
            </span>
            <h2 className="text-4xl font-bold text-brand-dark">Vakmanschap in beeld</h2>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {featuredProjects.map((project, idx) => (
              <Link
                key={project.id}
                href={`/projecten/${project.slug}`}
                className={`group cursor-pointer reveal delay-${(idx + 1) * 100}`}
              >
                <div className="relative overflow-hidden rounded-[2.5rem] h-[400px] mb-6">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={project.image_url ?? ''}
                    alt={project.title}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-300"></div>

                  {/* Project Pills Bottom */}
                  <div className="absolute bottom-6 left-6 flex flex-wrap gap-2">
                    <div className="bg-white px-4 py-2 rounded-full flex items-center text-xs font-semibold shadow-sm">
                      <PenTool className="w-3 h-3 mr-2" /> Detailwerk
                    </div>
                    {project.location && (
                      <div className="bg-white px-4 py-2 rounded-full flex items-center text-xs font-semibold shadow-sm">
                        <CheckCircle2 className="w-3 h-3 mr-2" /> {project.location}
                      </div>
                    )}
                  </div>
                </div>
                <div className="px-2">
                  <div className="flex justify-between items-center mb-2">
                    <h3 className="text-2xl font-bold text-brand-dark">{project.title}</h3>
                    {project.completed_date && (
                      <span className="text-sm text-brand-brown">{project.completed_date}</span>
                    )}
                  </div>
                  <div className="flex items-center text-brand-dark opacity-70 text-sm">
                    <div className="w-2 h-2 rounded-full bg-brand-brown mr-2"></div>
                    {project.description}
                  </div>
                </div>
              </Link>
            ))}
          </div>

          <div className="flex justify-center mt-12">
            <Link
              href="/projecten"
              className="group inline-flex items-center justify-center rounded-full font-medium transition-all duration-300 focus:outline-none bg-brand-red text-white hover:bg-brand-red/90 border border-transparent px-9 py-4 text-base"
            >
              Onze Projecten
              <ArrowUpRight className="ml-2 w-4 h-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            </Link>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-24 bg-white reveal">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <span className="text-xs font-bold tracking-widest text-brand-brown uppercase mb-4 block">
              Reviews
            </span>
            <h2 className="text-4xl font-bold text-brand-dark mb-4">
              Wat zeggen onze klanten over ons?
            </h2>
          </div>

          <div className="space-y-12">
            {TESTIMONIALS.map((testimonial, idx) => (
              <div
                key={idx}
                className={`flex flex-col border-b border-gray-100 pb-12 reveal delay-${(idx + 1) * 100} last:border-0`}
              >
                <div className="flex text-brand-brown mb-4">
                  {[...Array(testimonial.stars)].map((_, i) => (
                    <Star key={i} className="h-5 w-5 fill-current" />
                  ))}
                </div>
                <h4 className="text-xl font-bold text-brand-dark mb-3">{testimonial.name}</h4>
                <p className="text-gray-500 text-lg italic leading-relaxed max-w-4xl">
                  &ldquo;{testimonial.text}&rdquo;
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Werkspot Section - Professional Redesign */}
      <section className="py-24 bg-white reveal">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-brand-light/20 rounded-[4rem] p-10 lg:p-20 flex flex-col lg:flex-row items-center gap-16 lg:gap-24 relative overflow-hidden">
            {/* Subtle background detail */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-brand-brown/10 rounded-full -mr-32 -mt-32 blur-3xl"></div>

            {/* Logo Part */}
            <div className="w-full lg:w-1/3 flex flex-col items-center relative z-10">
              <div className="relative group">
                <div className="absolute -inset-4 bg-brand-brown/10 rounded-full blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src="https://upload.wikimedia.org/wikipedia/commons/f/fa/Werkspot_Logo.png"
                  alt="Werkspot Logo"
                  className="relative w-48 lg:w-64 h-auto transform transition-all duration-700 group-hover:scale-105"
                />
              </div>
              <div className="mt-10 flex flex-col items-center space-y-2">
                <div className="flex text-brand-red">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="h-5 w-5 fill-current" />
                  ))}
                </div>
                <span className="text-xs font-bold uppercase tracking-widest text-brand-brown">
                  Geverifieerde Vakman
                </span>
              </div>
            </div>

            {/* Content Part */}
            <div className="flex-1 space-y-8 text-center lg:text-left relative z-10">
              <div className="space-y-4">
                <h2 className="text-4xl lg:text-5xl font-bold text-brand-dark leading-tight">
                  Vind ons ook op <span className="text-brand-brown">Werkspot</span>
                </h2>
                <p className="text-lg text-gray-500 leading-relaxed max-w-xl">
                  Op zoek naar betrouwbare beoordelingen en gedetailleerde projectinformatie?
                  B.P.M. parket is trots aanwezig op{' '}
                  <span className="font-bold underline decoration-brand-brown/30 underline-offset-8">
                    Werkspot.nl
                  </span>
                  . Hier kunt u onze eerdere projecten bekijken en recensies van tevreden
                  klanten.
                </p>
              </div>

              <div className="flex flex-col sm:flex-row gap-4 pt-2 justify-center lg:justify-start">
                <a
                  href="https://www.werkspot.nl/profiel/b-p-m-parket"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group inline-flex items-center justify-center rounded-full font-medium transition-all duration-300 focus:outline-none bg-brand-brown text-white hover:bg-brand-brown/90 border border-transparent px-9 py-4 text-base"
                >
                  Bezoek ons profiel op Werkspot.nl
                  <ArrowUpRight className="ml-2 w-4 h-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Improved CTA Banner */}
      <section className="py-12 px-4 sm:px-6 lg:px-8 reveal">
        <div className="max-w-7xl mx-auto rounded-[3rem] relative overflow-hidden text-white bg-black">
          {/* Background Image Overlay */}
          <div className="absolute inset-0 z-0">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="https://www.bpmparket.nl/wp-content/uploads/2023/10/2023-10-02-12_27_45-WhatsApp-en-nog-9-andere-paginas-Werk-Microsoft%E2%80%8B-Edge-e1696335757551.png"
              alt="Wood Texture"
              className="w-full h-full object-cover opacity-30 mix-blend-overlay"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-black via-black/80 to-transparent"></div>
          </div>

          <div className="relative z-10 p-12 lg:p-24 flex flex-col lg:flex-row items-center justify-between gap-12">
            <div className="max-w-2xl">
              <span className="inline-block py-1 px-3 rounded-full bg-white/10 text-xs font-bold uppercase tracking-wider mb-6 border border-white/10">
                Geïnspireerd geraakt?
              </span>
              <h2 className="text-5xl lg:text-6xl font-bold mb-6 leading-[1.1]">
                Kies voor de <span className="text-brand-red">kwaliteit</span> van een echte
                parketteur.
              </h2>
              <p className="text-lg text-brand-light opacity-80 max-w-lg mb-8">
                Vraag vandaag nog een vrijblijvende offerte aan voor uw nieuwe vloer of
                traprenovatie in Geldrop en omgeving.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link
                  href="/offerte"
                  className="bg-brand-red text-white px-8 py-4 rounded-full font-bold text-lg hover:bg-brand-red/90 transition-colors flex items-center justify-center shadow-lg hover:shadow-brand-red/20"
                >
                  Offerte Aanvragen <ArrowRight className="ml-2 w-5 h-5" />
                </Link>
                <Link
                  href="/projecten"
                  className="bg-transparent border border-white/20 text-white px-8 py-4 rounded-full font-bold text-lg hover:bg-white/10 transition-colors text-center"
                >
                  Bekijk Portfolio
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
