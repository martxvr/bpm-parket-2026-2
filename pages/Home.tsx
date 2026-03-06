import React, { useEffect, useState, useRef } from 'react';
import Button from '../components/Button';
import { Star, ShieldCheck, Zap, Award, Layers, ArrowUpRight, CheckCircle2, Users, HardHat, PenTool, ArrowRight, ExternalLink } from 'lucide-react';
import { getProjects } from '../services/mockDatabase';
import { Project } from '../types';

interface HomeProps {
  onNavigate: (page: string) => void;
  onProjectSelect: (project: Project) => void;
}

const Home: React.FC<HomeProps> = ({ onNavigate, onProjectSelect }) => {
  const [featuredProjects, setFeaturedProjects] = useState<Project[]>([]);

  const testimonials = [
    {
      name: "Demi, uit Geleen",
      text: "Komen hun afspraken na, snel en vakkundig een pvc visgraat vloer gelegd. Wij zijn zeer tevreden en raden dit bedrijf zeker aan! Dankjewel jongens.",
      stars: 5
    },
    {
      name: "Maarten, uit Den Bosch",
      text: "Zeer goed werk en erg behulpzaam! Dachten ook mee over bepaalde dingen !",
      stars: 5
    },
    {
      name: "Paul, uit Eindhoven",
      text: "Geweldig gedaan, hij komt uitstekend zijn afspraken na en hij mag de volgende keer graag weer komen. Zijn prijs is trouwens ook uitstekend",
      stars: 5
    }
  ];

  // Logos for marquee
  const logos = [
    "LOGO", "LOGO", "LOGO", "LOGO", "LOGO",
    "LOGO", "LOGO", "LOGO"
  ];

  useEffect(() => {
    getProjects().then(data => {
      setFeaturedProjects(data.slice(0, 3));
    });

    // Intersection Observer for Scroll Animations
    const observerOptions = {
      threshold: 0.1,
      rootMargin: "0px 0px -50px 0px"
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('reveal-active');
          observer.unobserve(entry.target); // Only animate once
        }
      });
    }, observerOptions);

    const elements = document.querySelectorAll('.reveal');
    elements.forEach(el => observer.observe(el));

    return () => observer.disconnect();
  }, [featuredProjects]); // Re-run if projects load to catch those elements

  return (
    <div className="flex flex-col w-full overflow-hidden bg-white text-brand-dark">

      {/* Hero Section */}
      <section className="relative w-full pt-16 pb-24 lg:pt-24 lg:pb-32 reveal reveal-active">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-24 items-center">

            {/* Left: Text */}
            <div className="space-y-8 max-w-2xl">
              <div className="flex items-center space-x-2">
                <div className="flex text-brand-red">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="h-4 w-4 fill-current" />
                  ))}
                </div>
                <span className="text-sm font-semibold text-brand-dark">49+ 5 Sterren</span>
              </div>

              <h1 className="text-5xl lg:text-7xl font-bold tracking-tight text-brand-dark leading-[1.05]">
                Vakmanschap<br />
                in Parket &<br />
                <span className="text-brand-sand">Vloeren</span>
              </h1>

              <p className="text-lg text-gray-500 max-w-lg leading-relaxed">
                De specialist in traditioneel parket, PVC en traprenovaties. Wij combineren jarenlange ervaring met passie voor het vak in Geldrop en omgeving.
              </p>

              <div className="pt-2 flex gap-4">
                <Button size="lg" withIcon onClick={() => onNavigate('quote')}>
                  Plan Afspraak
                </Button>
                <Button size="lg" variant="ghost" onClick={() => onNavigate('projects')}>
                  Onze Projecten
                </Button>
              </div>
            </div>

            {/* Right: Image Grid */}
            <div className="relative lg:pl-10">
              <div className="relative rounded-[2.5rem] overflow-hidden aspect-[4/5] lg:aspect-[3/4]">
                <img
                  src="https://www.bpmparket.nl/wp-content/uploads/2023/10/2023-10-02-12_27_45-WhatsApp-en-nog-9-andere-paginas-Werk-Microsoft%E2%80%8B-Edge-e1696335757551.png"
                  alt="Wooden interior"
                  className="w-full h-full object-cover"
                />
              </div>

              {/* Floating Card: Happy Clients - Moved outside overflow-hidden wrapper */}
              <div className="absolute bottom-12 left-8 lg:-left-8 bg-white p-6 rounded-3xl shadow-2xl max-w-[240px] z-10 border border-brand-light">
                <p className="text-xs text-brand-sand mb-2 font-medium uppercase tracking-wider">Tevreden Klanten</p>
                <h3 className="text-4xl font-bold text-brand-red mb-4">50+</h3>
                <div className="flex items-center justify-between">
                  <div className="text-xs text-gray-500">Passie voor<br />Vakmanschap</div>
                  <div className="flex -space-x-2">
                    {[10, 11, 12].map((i) => (
                      <img key={i} className="w-8 h-8 rounded-full border-2 border-white" src={`https://picsum.photos/seed/${i}/100/100`} alt="Avatar" />
                    ))}
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* Logos Strip */}
      <section className="py-12 border-y border-gray-100 reveal delay-100 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Desktop View: Static Grid */}
          <div className="hidden md:flex flex-wrap justify-between items-center gap-8 opacity-40 grayscale hover:opacity-100 transition-opacity duration-500">
            {["LOGO", "LOGO", "LOGO", "LOGO", "LOGO"].map((logo, i) => (
              <span key={i} className="text-xl font-bold font-sans tracking-widest">{logo}</span>
            ))}
          </div>

          {/* Mobile View: Sliding Marquee */}
          <div className="md:hidden overflow-hidden relative w-full opacity-50 grayscale">
            <div className="animate-marquee flex items-center">
              {/* Duplicate list for seamless loop */}
              {[...logos, ...logos].map((logo, i) => (
                <span key={i} className="text-xl font-bold font-sans tracking-widest mx-8 whitespace-nowrap">{logo}</span>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section className="py-24 lg:py-32 bg-white reveal">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <span className="text-xs font-bold tracking-widest text-gray-400 uppercase mb-4 block">Onze Passie</span>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
            <h2 className="text-4xl lg:text-5xl font-bold text-black leading-tight max-w-xl">
              De kunst van traditioneel parket, bij u thuis.
            </h2>

            <div className="space-y-8">
              <p className="text-gray-500 text-lg leading-relaxed">
                Bij BPM Parket geloven we dat een vloer de basis is van uw woongenot. Met oog voor detail en liefde voor authentiek vakmanschap realiseren wij vloeren en trappen die generaties lang meegaan. Van klassiek visgraat tot modern PVC.
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
      <section className="py-24 bg-gray-50 reveal">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <span className="text-xs font-bold tracking-widest text-gray-400 uppercase mb-4 block">Specialisaties</span>
          <h2 className="text-4xl font-bold text-black mb-16 max-w-2xl">
            Van vloer tot meubel: alles voor uw houten interieur
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { icon: Layers, title: "Traditioneel Parket", desc: "Visgraat, Hongaarse punt of band en bies. Wij beheersen de oude ambacht tot in de puntjes." },
              { icon: Zap, title: "Traprenovatie", desc: "Verander uw trap in een eyecatcher met onze massief eiken overzettreden, vaak binnen één dag." },
              { icon: ShieldCheck, title: "PVC & Laminaat", desc: "Stijlvolle en onderhoudsvriendelijke vloeren die perfect passen bij een modern interieur." },
              { icon: Star, title: "Onderhoud", desc: "Is uw vloer toe aan een opknapbeurt? Wij schuren en oliën uw parket weer als nieuw." }
            ].map((service, i) => (
              <div key={i} className={`bg-white p-8 rounded-[2rem] hover:shadow-xl transition-all duration-300 reveal delay-${(i + 1) * 100}`}>
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
            <span className="text-xs font-bold tracking-widest text-brand-sand uppercase mb-4 block">Portfolio</span>
            <h2 className="text-4xl font-bold text-brand-dark">Vakmanschap in beeld</h2>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {featuredProjects.map((project, idx) => (
              <div
                key={project.id}
                className={`group cursor-pointer reveal delay-${(idx + 1) * 100}`}
                onClick={() => onProjectSelect(project)}
              >
                <div className="relative overflow-hidden rounded-[2.5rem] h-[400px] mb-6">
                  <img
                    src={project.imageUrl}
                    alt={project.title}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-300"></div>

                  {/* Project Pills Bottom */}
                  <div className="absolute bottom-6 left-6 flex flex-wrap gap-2">
                    <div className="bg-white px-4 py-2 rounded-full flex items-center text-xs font-semibold shadow-sm">
                      <PenTool className="w-3 h-3 mr-2" /> Detailwerk
                    </div>
                    <div className="bg-white px-4 py-2 rounded-full flex items-center text-xs font-semibold shadow-sm">
                      <CheckCircle2 className="w-3 h-3 mr-2" /> {project.location}
                    </div>
                  </div>
                </div>
                <div className="px-2">
                  <div className="flex justify-between items-center mb-2">
                    <h3 className="text-2xl font-bold text-brand-dark">{project.title}</h3>
                    <span className="text-sm text-brand-sand">{project.date}</span>
                  </div>
                  <div className="flex items-center text-brand-dark opacity-70 text-sm">
                    <div className="w-2 h-2 rounded-full bg-brand-sand mr-2"></div>
                    {project.description}
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="flex justify-center mt-12">
            <Button variant="primary" withIcon onClick={() => onNavigate('projects')}>Onze Projecten</Button>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-24 bg-white reveal">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <span className="text-xs font-bold tracking-widest text-brand-sand uppercase mb-4 block">Reviews</span>
            <h2 className="text-4xl font-bold text-brand-dark mb-4">Wat zeggen onze klanten over ons?</h2>
          </div>

          <div className="space-y-12">
            {testimonials.map((testimonial, idx) => (
              <div
                key={idx}
                className={`flex flex-col border-b border-gray-100 pb-12 reveal delay-${(idx + 1) * 100} last:border-0`}
              >
                <div className="flex text-brand-sand mb-4">
                  {[...Array(testimonial.stars)].map((_, i) => (
                    <Star key={i} className="h-5 w-5 fill-current" />
                  ))}
                </div>
                <h4 className="text-xl font-bold text-brand-dark mb-3">{testimonial.name}</h4>
                <p className="text-gray-500 text-lg italic leading-relaxed max-w-4xl">
                  "{testimonial.text}"
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
            <div className="absolute top-0 right-0 w-64 h-64 bg-brand-sand/10 rounded-full -mr-32 -mt-32 blur-3xl"></div>

            {/* Logo Part */}
            <div className="w-full lg:w-1/3 flex flex-col items-center relative z-10">
              <div className="relative group">
                <div className="absolute -inset-4 bg-brand-sand/10 rounded-full blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>
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
                <span className="text-xs font-bold uppercase tracking-widest text-brand-sand">Geverifieerde Vakman</span>
              </div>
            </div>

            {/* Content Part */}
            <div className="flex-1 space-y-8 text-center lg:text-left relative z-10">
              <div className="space-y-4">
                <h2 className="text-4xl lg:text-5xl font-bold text-brand-dark leading-tight">
                  Vind ons ook op <span className="text-brand-brown">Werkspot</span>
                </h2>
                <p className="text-lg text-gray-500 leading-relaxed max-w-xl">
                  Op zoek naar betrouwbare beoordelingen en gedetailleerde projectinformatie? B.P.M. parket is trots aanwezig op <span className="font-bold underline decoration-brand-sand/30 underline-offset-8">Werkspot.nl</span>. Hier kunt u onze eerdere projecten bekijken en recensies van tevreden klanten.
                </p>
              </div>

              <div className="flex flex-col sm:flex-row gap-4 pt-2 justify-center lg:justify-start">
                <Button
                  variant="secondary"
                  size="lg"
                  withIcon
                  onClick={() => window.open('https://www.werkspot.nl/profiel/b-p-m-parket', '_blank')}
                >
                  Bezoek ons profiel op Werkspot.nl
                </Button>
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
                Kies voor de <span className="text-brand-red">kwaliteit</span> van een echte parketteur.
              </h2>
              <p className="text-lg text-brand-light opacity-80 max-w-lg mb-8">
                Vraag vandaag nog een vrijblijvende offerte aan voor uw nieuwe vloer of traprenovatie in Geldrop en omgeving.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <button
                  onClick={() => onNavigate('quote')}
                  className="bg-brand-red text-white px-8 py-4 rounded-full font-bold text-lg hover:bg-brand-red/90 transition-colors flex items-center justify-center shadow-lg hover:shadow-brand-red/20"
                >
                  Offerte Aanvragen <ArrowRight className="ml-2 w-5 h-5" />
                </button>
                <button
                  onClick={() => onNavigate('projects')}
                  className="bg-transparent border border-white/20 text-white px-8 py-4 rounded-full font-bold text-lg hover:bg-white/10 transition-colors"
                >
                  Bekijk Portfolio
                </button>
              </div>
            </div>

          </div>
        </div>
      </section>

    </div>
  );
};

export default Home;