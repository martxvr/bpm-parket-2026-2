"use client"

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import Button from '@/components/Button';
import ProjectDetail from '@/components/ProjectDetail';
import {
  LayoutGrid, ChevronsUp, ChevronLeft, ChevronRight, Layers, Wrench, Sun, Hammer
} from 'lucide-react';
import StarIcon from '@/components/ui/star-icon';
import ShieldCheck from '@/components/ui/shield-check';
import TrophyIcon from '@/components/ui/trophy-icon';
import CheckedIcon from '@/components/ui/checked-icon';
import PenIcon from '@/components/ui/pen-icon';
import ArrowNarrowRightIcon from '@/components/ui/arrow-narrow-right-icon';
import { Project } from '@/types';
import StatCounter from '@/components/StatCounter';
import { DateTimePicker } from '@/components/ui/date-time-picker';
import { submitShowroomAppointment } from './actions';
import { checkAvailability } from '@/app/api/chat/chat-actions';
import { getFeaturedBrands, categories } from '@/data/brands';
import PlugConnectedIcon from '@/components/icons/plug-connected-icon';

type Testimonial = {
  name: string;
  text: string;
  stars: number;
}

export default function HomePageClient({ initialProjects, testimonials }: { initialProjects: Project[], testimonials: Testimonial[] }) {
  const router = useRouter();
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);

  const [isSubmittingHeroForm, setIsSubmittingHeroForm] = useState(false);
  const [heroFormSubmitted, setHeroFormSubmitted] = useState(false);
  const [heroForm, setHeroForm] = useState({
    name: '',
    email: '',
    phone: '',
    date: '',
    message: ''
  });
  const [bookedTimes, setBookedTimes] = useState<string[]>([]);

  const selectedDateStr = heroForm.date ? heroForm.date.substring(0, 10) : "";

  useEffect(() => {
    if (selectedDateStr) {
      checkAvailability(selectedDateStr).then(res => {
        if (res.bookedTimes) {
          setBookedTimes(res.bookedTimes);
        }
      });
    } else {
      setBookedTimes([]);
    }
  }, [selectedDateStr]);

  const handleHeroSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmittingHeroForm(true);
    try {
      await submitShowroomAppointment(heroForm);
      setHeroFormSubmitted(true);
    } catch (error) {
      console.error('Failed to submit hero appointment:', error);
    } finally {
      setIsSubmittingHeroForm(false);
    }
  };

  const featuredBrands = getFeaturedBrands();
  const brandNames = featuredBrands.map(b => b.name);

  const heroImages = [
    { src: '/images/brands/art-of-living/sfeer-taol-01.webp', alt: 'Art of Living sfeer interieur 1', brand: 'Art of Living' },
    { src: '/images/brands/art-of-living/sfeer-taol-02.webp', alt: 'Art of Living sfeer interieur 2', brand: 'Art of Living' },
    { src: '/images/brands/art-of-living/sfeer-taol-03.webp', alt: 'Art of Living sfeer interieur 3', brand: 'Art of Living' },
    { src: '/images/brands/art-of-living/sfeer-taol-04.webp', alt: 'Art of Living sfeer interieur 4', brand: 'Art of Living' },
  ];

  const [heroSlide, setHeroSlide] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setHeroSlide(prev => (prev + 1) % heroImages.length);
    }, 6000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {


    const observerOptions = {
      threshold: 0.1,
      rootMargin: "0px 0px -50px 0px"
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('reveal-active');
          observer.unobserve(entry.target);
        }
      });
    }, observerOptions);

    const elements = document.querySelectorAll('.reveal');
    elements.forEach(el => observer.observe(el));

    return () => observer.disconnect();
  }, [initialProjects]);

  return (
    <div className="flex flex-col w-full overflow-hidden bg-white text-brand-dark">

      {/* Hero Section */}
      <section className="relative w-full h-[100svh] min-h-[640px] flex items-center overflow-hidden reveal reveal-active">
        {/* Background Slideshow */}
        <div className="absolute inset-0 z-0">
          {heroImages.map((img, i) => (
            <div
              key={i}
              className={`absolute inset-0 transition-opacity duration-[2000ms] ease-in-out ${i === heroSlide ? 'opacity-100' : 'opacity-0'}`}
            >
              <img
                src={img.src}
                alt={img.alt}
                className={`w-full h-full object-cover transition-transform duration-[7000ms] ease-in-out ${i === heroSlide ? 'scale-100' : 'scale-[1.07]'}`}
              />
            </div>
          ))}
          {/* Dark gradient overlays */}
          <div className="absolute inset-0 bg-gradient-to-t from-brand-dark via-brand-dark/70 to-brand-dark/30 z-10"></div>
          <div className="absolute inset-0 bg-gradient-to-r from-brand-dark/80 via-transparent to-transparent z-10"></div>
        </div>

        {/* Decorative accent line */}
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-brand-primary via-brand-secondary to-transparent z-20"></div>

        {/* Content */}
        <div className="relative z-10 w-full pt-20 pb-8 lg:pt-24 lg:pb-12">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-center">

              {/* Main text column */}
              <div className="lg:col-span-7 space-y-4 lg:space-y-5">
                <div className="flex items-center space-x-3 mb-2">
                  <div className="h-px w-10 bg-brand-primary"></div>
                  <div className="flex text-brand-primary">
                    {[...Array(5)].map((_, i) => (
                      <StarIcon key={i} size={14} className="fill-current" />
                    ))}
                  </div>
                  <span className="text-sm font-medium text-white/70">49+ beoordelingen</span>
                </div>

                <h1 className="text-4xl sm:text-5xl lg:text-6xl xl:text-[5.5rem] font-bold tracking-tight text-white leading-[1.02]">
                  Uw specialist in{' '}
                  <span className="text-brand-primary">Traditioneel Parket</span>{' '}
                  sinds 1992
                </h1>

                <p className="text-lg text-white/60 max-w-xl leading-relaxed">
                  Al ruim 30 jaar leveren wij niet alleen hoogwaardige parketvloeren, maar gaan we verder dan dat. PVC, laminaat, stijlvolle radiator-ombouwen, duurzame buitenparket en maatwerk interieurwerken — BPM Parket is uw vertrouwde partner.
                </p>

                <div className="pt-1 flex flex-wrap gap-3 lg:gap-4">
                  <Button size="lg" withIcon onClick={() => router.push('/offerte')}>
                    Gratis Offerte
                  </Button>
                  <button
                    onClick={() => router.push('/projecten')}
                    className="px-8 py-4 rounded-[5px] font-bold text-white border border-white/20 hover:bg-white/10 transition-all text-lg"
                  >
                    Bekijk Projecten
                  </button>
                </div>

                {/* Subtle USP badges */}
                <div className="flex flex-wrap items-center gap-x-6 gap-y-2 pt-1">
                  {[
                    { icon: TrophyIcon, text: '30+ jaar vakmanschap' },
                    { icon: ShieldCheck, text: 'Eigen legservice' },
                    { icon: PlugConnectedIcon, text: 'Maatwerk op maat' },
                  ].map((usp, i) => (
                    <div key={i} className="flex items-center space-x-2 text-white/50 group">
                      <usp.icon size={20} className="text-brand-primary/70" />
                      <span className="text-sm">{usp.text}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Showroom Appointment Form */}
              <div className="lg:col-span-5 flex justify-end">
                <div className="bg-white/10 backdrop-blur-xl border border-white/10 rounded-2xl p-5 lg:p-7 w-full lg:max-w-sm">
                  {heroFormSubmitted ? (
                    <div className="text-center py-8">
                      <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-brand-primary text-white mb-4">
                        <CheckedIcon size={32} />
                      </div>
                      <h3 className="text-xl font-bold text-white mb-2">Aanvraag Ontvangen!</h3>
                      <p className="text-sm text-white/70">
                        Bedankt {heroForm.name}, we nemen snel contact op om uw afspraak te bevestigen.
                      </p>
                    </div>
                  ) : (
                    <>
                      <h3 className="text-lg font-bold text-white mb-1">Showroom Bezoek</h3>
                      <p className="text-sm text-white/50 mb-4">Plan een gratis afspraak in Geldrop</p>
                      <form className="space-y-3" onSubmit={handleHeroSubmit}>
                        <input
                          type="text"
                          placeholder="Uw naam"
                          required
                          value={heroForm.name}
                          onChange={(e) => setHeroForm(prev => ({ ...prev, name: e.target.value }))}
                          className="w-full bg-white/10 border border-white/10 rounded-[5px] px-4 py-3 text-sm text-white placeholder-white/40 focus:outline-none focus:border-brand-primary/50 focus:ring-1 focus:ring-brand-primary/30 transition-all"
                        />
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                          <input
                            type="email"
                            placeholder="E-mailadres"
                            required
                            value={heroForm.email}
                            onChange={(e) => setHeroForm(prev => ({ ...prev, email: e.target.value }))}
                            className="w-full bg-white/10 border border-white/10 rounded-[5px] px-4 py-3 text-sm text-white placeholder-white/40 focus:outline-none focus:border-brand-primary/50 focus:ring-1 focus:ring-brand-primary/30 transition-all"
                          />
                          <input
                            type="tel"
                            placeholder="Telefoonnummer"
                            required
                            value={heroForm.phone}
                            onChange={(e) => setHeroForm(prev => ({ ...prev, phone: e.target.value }))}
                            className="w-full bg-white/10 border border-white/10 rounded-[5px] px-4 py-3 text-sm text-white placeholder-white/40 focus:outline-none focus:border-brand-primary/50 focus:ring-1 focus:ring-brand-primary/30 transition-all"
                          />
                        </div>
                        <div className="w-full text-brand-dark">
                          <DateTimePicker
                            value={heroForm.date ? new Date(heroForm.date.replace('Z', '')) : undefined}
                            onChange={(d) => {
                              const pad = (n: number) => n.toString().padStart(2, '0');
                              const localIso = `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}:00Z`;
                              setHeroForm(prev => ({ ...prev, date: localIso }));
                            }}
                            required
                            disabledTimes={bookedTimes}
                          />
                        </div>
                        <textarea
                          placeholder="Bericht (Optioneel)"
                          rows={2}
                          value={heroForm.message}
                          onChange={(e) => setHeroForm(prev => ({ ...prev, message: e.target.value }))}
                          className="w-full bg-white/10 border border-white/10 rounded-[5px] px-4 py-3 text-sm text-white placeholder-white/40 focus:outline-none focus:border-brand-primary/50 focus:ring-1 focus:ring-brand-primary/30 transition-all resize-none"
                        />
                        <button
                          type="submit"
                          disabled={isSubmittingHeroForm}
                          className="w-full bg-brand-primary text-white font-bold py-3 rounded-[5px] hover:bg-brand-secondary transition-all text-sm uppercase tracking-wider mt-1 disabled:opacity-50"
                        >
                          {isSubmittingHeroForm ? 'Bezig met inplannen...' : 'Afspraak Inplannen'}
                        </button>
                      </form>
                      <p className="text-xs text-white/30 mt-3 text-center">Reactie binnen 24 uur</p>
                    </>
                  )}
                </div>
              </div>

            </div>
          </div>
        </div>
      </section>

      {/* Brand Logos Carousel Strip */}
      <section className="py-12 border-y border-gray-100 reveal delay-100 overflow-hidden bg-white">
          <div className="overflow-hidden relative w-full flex items-center">
            <div className="animate-marquee flex items-center w-max gap-12 sm:gap-24 pl-12 sm:pl-24">
              {[...featuredBrands, ...featuredBrands, ...featuredBrands, ...featuredBrands].filter(b => b.logoUrl).map((brand, i) => (
                <div key={i} className="relative h-12 sm:h-16 md:h-20 w-32 sm:w-40 md:w-48 flex items-center justify-center flex-shrink-0 grayscale opacity-40 hover:grayscale-0 hover:opacity-100 transition-all duration-500">
                  <img src={brand.logoUrl} alt={`${brand.name} logo`} className="max-w-full max-h-full object-contain" />
                </div>
              ))}
            </div>
          </div>
      </section>

      {/* Premium Merken Showcase */}
      <section className="py-20 bg-white reveal">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header with inline arrows on desktop */}
          <div className="mb-12 lg:flex lg:items-end lg:justify-between gap-8">
            <div className="text-center lg:text-left max-w-2xl mx-auto lg:mx-0">
              <span className="text-xs font-bold tracking-[0.2em] text-brand-primary uppercase mb-4 block">Onze Diensten</span>
              <h2 className="text-4xl lg:text-5xl font-bold text-brand-dark mb-4">
                Vakmanschap tot in <span className="text-brand-primary">detail</span>
              </h2>
              <p className="text-gray-400">
                Van traditioneel parket tot interieurwerken — wij leveren en leggen alles zelf.
              </p>
            </div>

            {/* Desktop arrows (top-right of section) */}
            <div className="hidden lg:flex items-center gap-3 shrink-0 mt-8 lg:mt-0">
              <button
                onClick={() => {
                  const el = document.getElementById('partners-slider');
                  if (el) el.scrollBy({ left: -340, behavior: 'smooth' });
                }}
                aria-label="Vorige"
                className="w-12 h-12 rounded-full border-2 border-gray-200 hover:border-brand-primary hover:bg-brand-primary hover:text-white flex items-center justify-center text-gray-700 transition-all"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <button
                onClick={() => {
                  const el = document.getElementById('partners-slider');
                  if (el) el.scrollBy({ left: 340, behavior: 'smooth' });
                }}
                aria-label="Volgende"
                className="w-12 h-12 rounded-full border-2 border-brand-primary bg-brand-primary text-white hover:bg-brand-secondary hover:border-brand-secondary flex items-center justify-center transition-all"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          </div>

          {(() => {
            const filteredCats = categories;
            const bgImages: Record<string, string> = {
              'parket-en-multiplanken': 'https://images.unsplash.com/photo-1615971677499-5467cbab01c0?q=80&w=800&auto=format&fit=crop',
              'pvc-en-laminaat': 'https://images.unsplash.com/photo-1519947486511-46149fa0a254?q=80&w=800&auto=format&fit=crop',
              'legservice': 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?q=80&w=800&auto=format&fit=crop',
              'traprenovatie': 'https://images.unsplash.com/photo-1503174971373-b1f69850bded?q=80&w=800&auto=format&fit=crop',
              'buitenparket': 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?q=80&w=800&auto=format&fit=crop',
              'interieurwerken': 'https://images.unsplash.com/photo-1600607687644-aac4c3eac7f4?q=80&w=800&auto=format&fit=crop',
            };
            return (
              <div className="relative">
                <div
                  id="partners-slider"
                  className="overflow-x-auto no-scrollbar scroll-smooth snap-x snap-mandatory -mx-4 px-4 sm:-mx-6 sm:px-6 lg:-mx-8 lg:px-8 pb-4"
                >
                  <div className="flex gap-6" style={{ minWidth: 'max-content' }}>
                    {filteredCats.map((cat) => (
                      <Link
                        key={cat.slug}
                        href={`/producten/${cat.slug}`}
                        className="group relative overflow-hidden rounded-2xl h-[420px] w-[280px] sm:w-[300px] flex-shrink-0 snap-start flex flex-col justify-end p-8 transition-all duration-500 shadow-sm hover:shadow-2xl hover:-translate-y-1.5"
                      >
                        <div className="absolute inset-0 z-0">
                          <img
                            src={bgImages[cat.slug] || 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&q=80&w=800'}
                            alt={cat.name}
                            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-black/10 transition-opacity duration-500 group-hover:opacity-95"></div>
                        </div>

                        <div className="relative z-10">
                          <h3 className="text-2xl font-bold uppercase tracking-wider text-white pb-4 border-b border-brand-primary/40 mb-4 transition-transform duration-500 group-hover:-translate-y-1">
                            {cat.name}
                          </h3>

                          <div className="space-y-2 opacity-70 group-hover:opacity-100 transition-opacity duration-400">
                            {cat.brands.length > 0 ? (
                              <>
                                {cat.brands.slice(0, 4).map(b => (
                                  <div key={b.slug} className="flex items-center space-x-2 text-white/90">
                                    <div className="w-1.5 h-1.5 rounded-full bg-brand-primary"></div>
                                    <span className="text-sm font-medium">{b.name}</span>
                                  </div>
                                ))}
                                {cat.brands.length > 4 && (
                                  <p className="text-xs italic text-brand-primary mt-3">+{cat.brands.length - 4} meer topmerken</p>
                                )}
                              </>
                            ) : (
                              <p className="text-sm text-white/80 leading-relaxed">{cat.description}</p>
                            )}
                          </div>

                          <div className="mt-6 flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-brand-primary/70 group-hover:text-brand-primary transition-colors duration-300">
                            {cat.brands.length > 0 ? 'Ontdek Collectie' : 'Meer Info'} <ArrowNarrowRightIcon size={16} className="ml-1 transition-transform duration-300 group-hover:translate-x-1" />
                          </div>
                        </div>
                      </Link>
                    ))}
                  </div>
                </div>

                {/* Mobile swipe indicator */}
                <div className="flex items-center justify-center gap-2 mt-6 lg:hidden text-xs text-gray-400 font-medium">
                  <ChevronLeft className="w-3 h-3 animate-pulse" />
                  <span>Swipe voor meer categorieën</span>
                  <ChevronRight className="w-3 h-3 animate-pulse" />
                </div>
              </div>
            );
          })()}
        </div>
      </section>

      {/* About Section */}
      <section className="py-24 lg:py-32 bg-brand-bg-light reveal">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <span className="text-xs font-bold tracking-widest text-gray-400 uppercase mb-4 block">Onze Passie</span>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
            <h2 className="text-4xl lg:text-5xl font-bold text-brand-primary leading-tight max-w-xl">
              Vakmanschap tot in detail.
            </h2>
            <div className="space-y-8">
              <p className="text-gray-500 text-lg leading-relaxed">
                Bij BPM Parket geloven we dat een sterke basis essentieel is voor uw woongenot. Al ruim 30 jaar realiseren wij traditioneel parket, PVC, laminaat, traprenovaties, buitenparket en interieurwerken met oog voor detail en authentiek vakmanschap — vanuit Geldrop, voor heel Brabant.
              </p>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-8">
                {[
                  { value: 30, suffix: '+', label: 'Jaar ervaring' },
                  { value: 1000, suffix: '+', label: 'Projecten gerealiseerd' },
                  { value: 6, suffix: '', label: 'Specialismen' },
                  { value: 100, suffix: '%', label: 'Vakmanschap' },
                ].map((stat, i) => (
                  <div key={i}>
                    <div className="text-4xl font-bold text-brand-primary mb-1">
                      <StatCounter end={stat.value} suffix={stat.suffix} />
                    </div>
                    <p className="text-sm text-gray-400">{stat.label}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="mt-20 relative rounded-[3rem] overflow-hidden h-[500px] w-full group reveal delay-100">
            <img
              src="/images/brands/riviera-maison/mood-3.webp"
              alt="Luxe Riviera Maison stijl interieur"
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
            />
            <div className="absolute top-10 left-10 bg-white px-4 py-2 rounded-full flex items-center shadow-lg">
              <PenIcon size={16} className="mr-2 text-black" />
              <span className="text-sm font-semibold">Handgemaakt</span>
            </div>
            <div className="absolute bottom-10 right-10 bg-white px-4 py-2 rounded-full flex items-center shadow-lg">
              <TrophyIcon size={16} className="mr-2 text-black" />
              <span className="text-sm font-semibold">Premium Kwaliteit</span>
            </div>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section className="py-24 bg-brand-bg-light reveal">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <span className="text-xs font-bold tracking-widest text-gray-400 uppercase mb-4 block">Specialisaties</span>
          <h2 className="text-4xl font-bold text-brand-primary mb-16 max-w-2xl">
            Van traditioneel parket tot interieurwerken: alles in één hand
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              { icon: Layers, title: "Parket en Multiplanken", desc: "Traditioneel parket en multiplanken — onze kernspecialiteit sinds 1992." },
              { icon: LayoutGrid, title: "PVC en Laminaat", desc: "Duurzame, onderhoudsvriendelijke vloeren met houten of steenlook." },
              { icon: Wrench, title: "Legservice", desc: "Vakkundige legservice door ons eigen team — van voorbereiding tot afwerking." },
              { icon: ChevronsUp, title: "Traprenovatie", desc: "Geef uw trap een nieuwe look met hoogwaardige houtsoorten en vakmanschap." },
              { icon: Sun, title: "Buitenparket", desc: "Weer- en UV-bestendig buitenparket voor terras, vlonder en tuin." },
              { icon: Hammer, title: "Interieurwerken", desc: "Maatwerk radiator-ombouwen, plinten, drempels en meer." }
            ].map((service, i) => (
              <div key={i} className={`bg-white p-8 rounded-xl hover:shadow-xl transition-all duration-300 reveal delay-${(i + 1) * 100} border border-gray-100`}>
                <div className="w-10 h-10 bg-brand-dark rounded-full flex items-center justify-center mb-6 text-white text-brand-primary">
                  <service.icon className="w-5 h-5" />
                </div>
                <h3 className="text-lg font-bold mb-3 text-brand-secondary">{service.title}</h3>
                <p className="text-sm text-brand-text leading-relaxed">{service.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Projects Section */}
      <section className="py-24 bg-white reveal">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <span className="text-xs font-bold tracking-widest text-brand-primary uppercase mb-4 block">Portfolio</span>
            <h2 className="text-4xl font-bold text-brand-primary">Vakmanschap in beeld</h2>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {initialProjects.map((project, idx) => (
              <div
                key={project.id}
                onClick={() => setSelectedProject(project)}
                className={`group cursor-pointer reveal delay-${(idx + 1) * 100}`}
              >
                <div className="relative overflow-hidden rounded-xl h-[400px] mb-6 border border-gray-100 shadow-sm transition-transform duration-300 hover:scale-[1.02]">
                  <img
                    src={project.imageUrl}
                    alt={project.title}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-300"></div>
                  <div className="absolute bottom-6 left-6 flex flex-wrap gap-2">
                    <div className="bg-white px-4 py-2 rounded-full flex items-center text-xs font-semibold shadow-sm">
                      <PenIcon size={12} className="mr-2" /> Detailwerk
                    </div>
                    <div className="bg-white px-4 py-2 rounded-full flex items-center text-xs font-semibold shadow-sm">
                      <CheckedIcon size={12} className="mr-2" /> {project.location}
                    </div>
                  </div>
                </div>
                <div className="px-2">
                  <div className="flex justify-between items-center mb-2">
                    <h3 className="text-2xl font-bold text-brand-dark">{project.title}</h3>
                    <span className="text-sm text-brand-primary">{project.date}</span>
                  </div>
                  <div className="flex items-center text-brand-dark opacity-70 text-sm">
                    <div className="w-2 h-2 rounded-full bg-brand-primary mr-2"></div>
                    {project.description}
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div className="flex justify-center mt-12">
            <Button variant="primary" withIcon onClick={() => router.push('/projecten')}>Onze Projecten</Button>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-24 bg-white reveal">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <span className="text-xs font-bold tracking-widest text-brand-primary uppercase mb-4 block">Reviews</span>
            <h2 className="text-4xl font-bold text-brand-primary mb-4">Wat zeggen onze klanten over ons?</h2>
          </div>
          <div className="space-y-12">
            {testimonials.map((testimonial, idx) => (
              <div key={idx} className={`flex flex-col border-b border-gray-100 pb-12 reveal delay-${(idx + 1) * 100} last:border-0`}>
                <div className="flex text-brand-primary mb-4">
                  {[...Array(testimonial.stars)].map((_, i) => (
                    <StarIcon key={i} size={20} className="fill-current" />
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

      {/* CTA Banner */}
      <section className="py-12 px-4 sm:px-6 lg:px-8 reveal">
        <div className="max-w-7xl mx-auto rounded-xl relative overflow-hidden text-white bg-brand-dark">
          <div className="absolute inset-0 z-0">
            <img
              src="/images/homepage/cta-banner.png"
              alt="Luxe interieur texturen"
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
                Kies voor de <span className="text-brand-primary">kwaliteit</span> van een echte specialist.
              </h2>
              <p className="text-lg text-brand-light opacity-80 max-w-lg mb-8">
                Vraag vandaag nog een vrijblijvende offerte aan voor uw nieuwe parketvloer, PVC, traprenovatie of interieurwerken in Geldrop, Brabant en omgeving.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <button
                  onClick={() => router.push('/offerte')}
                  className="bg-brand-primary text-white px-8 py-4 rounded-[5px] font-bold text-lg hover:bg-brand-secondary transition-colors flex items-center justify-center shadow-lg hover:shadow-brand-primary/20"
                >
                  Offerte Aanvragen <ArrowNarrowRightIcon size={20} className="ml-2" />
                </button>
                <button
                  onClick={() => router.push('/projecten')}
                  className="bg-transparent border border-white/20 text-white px-8 py-4 rounded-[5px] font-bold text-lg hover:bg-white/10 transition-colors"
                >
                  Bekijk Portfolio
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Project Detail Modal */}
      {selectedProject && (
        <ProjectDetail
          project={selectedProject}
          onClose={() => setSelectedProject(null)}
        />
      )}
    </div>
  );
}