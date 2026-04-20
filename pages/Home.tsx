import React, { useEffect, useState, useRef } from 'react';
import Button from '../components/Button';
import { Star, ShieldCheck, Zap, Award, Layers, ArrowUpRight, CheckCircle2, Users, HardHat, PenTool, ArrowRight, ExternalLink, ChevronLeft, ChevronRight, Calendar } from 'lucide-react';
import { getProjects } from '../services/mockDatabase';
import { Project } from '../types';

interface HomeProps {
  onNavigate: (page: string) => void;
  onProjectSelect: (project: Project) => void;
}

const DAYS = ['Ma', 'Di', 'Wo', 'Do', 'Vr', 'Za', 'Zo'];
const MONTHS = ['Januari', 'Februari', 'Maart', 'April', 'Mei', 'Juni', 'Juli', 'Augustus', 'September', 'Oktober', 'November', 'December'];
const TIME_SLOTS = ['09:00', '09:30', '10:00', '10:30', '11:00', '11:30', '12:00', '12:30', '13:00', '13:30', '14:00', '14:30', '15:00', '15:30', '16:00', '16:30', '17:00'];

const DatePicker = ({ value, onChange }: { value: Date | null; onChange: (d: Date) => void }) => {
  const [open, setOpen] = useState(false);
  const [view, setView] = useState(() => value ?? new Date());
  const [pickedDate, setPickedDate] = useState<Date | null>(value);
  const [pickedTime, setPickedTime] = useState<string | null>(
    value ? `${String(value.getHours()).padStart(2, '0')}:${String(value.getMinutes()).padStart(2, '0')}` : null
  );
  const [dropdownStyle, setDropdownStyle] = useState<{ top: number; left: number; width: number }>({ top: 0, left: 0, width: 0 });
  const triggerRef = useRef<HTMLButtonElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (
        triggerRef.current && !triggerRef.current.contains(e.target as Node) &&
        dropdownRef.current && !dropdownRef.current.contains(e.target as Node)
      ) setOpen(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const openPicker = () => {
    if (triggerRef.current) {
      const r = triggerRef.current.getBoundingClientRect();
      setDropdownStyle({ top: r.bottom + 8, left: r.left, width: r.width });
    }
    setOpen(o => !o);
  };

  const firstDay = new Date(view.getFullYear(), view.getMonth(), 1);
  const startOffset = (firstDay.getDay() + 6) % 7;
  const daysInMonth = new Date(view.getFullYear(), view.getMonth() + 1, 0).getDate();
  const today = new Date();

  const prevMonth = () => setView(v => new Date(v.getFullYear(), v.getMonth() - 1, 1));
  const nextMonth = () => setView(v => new Date(v.getFullYear(), v.getMonth() + 1, 1));

  const cells: (number | null)[] = [
    ...Array(startOffset).fill(null),
    ...Array.from({ length: daysInMonth }, (_, i) => i + 1),
  ];

  const isSelectedDay = (d: number) =>
    pickedDate?.getFullYear() === view.getFullYear() &&
    pickedDate?.getMonth() === view.getMonth() &&
    pickedDate?.getDate() === d;

  const isToday = (d: number) =>
    today.getFullYear() === view.getFullYear() &&
    today.getMonth() === view.getMonth() &&
    today.getDate() === d;

  const isPast = (d: number) => {
    const date = new Date(view.getFullYear(), view.getMonth(), d);
    date.setHours(0, 0, 0, 0);
    const t = new Date(); t.setHours(0, 0, 0, 0);
    return date < t;
  };

  const selectDay = (day: number) => {
    const d = new Date(view.getFullYear(), view.getMonth(), day);
    setPickedDate(d);
    setPickedTime(null);
  };

  const selectTime = (time: string) => {
    if (!pickedDate) return;
    const [h, m] = time.split(':').map(Number);
    const d = new Date(pickedDate);
    d.setHours(h, m, 0, 0);
    setPickedTime(time);
    onChange(d);
    setOpen(false);
  };

  const label = pickedDate
    ? pickedDate.toLocaleDateString('nl-NL', { weekday: 'short', day: 'numeric', month: 'long' }) +
      (pickedTime ? ` — ${pickedTime}` : '')
    : 'Kies een datum & tijd';

  return (
    <div className="relative">
      <button
        ref={triggerRef}
        type="button"
        onClick={openPicker}
        className="w-full p-4 rounded-xl bg-white/5 border border-white/10 text-left flex items-center justify-between focus:outline-none focus:ring-2 focus:ring-brand-red/50 transition-all"
      >
        <span className={(pickedDate && pickedTime) ? 'text-white' : 'text-white/50'}>{label}</span>
        <Calendar className="h-4 w-4 text-white/40 flex-shrink-0" />
      </button>

      {open && (
        <div
          ref={dropdownRef}
          className="fixed bg-[#1a1a1a] border border-white/10 rounded-2xl p-4 shadow-2xl z-[9998] overflow-y-auto max-h-[80vh]"
          style={{ top: dropdownStyle.top, left: dropdownStyle.left, width: dropdownStyle.width }}
        >
          {/* Month header */}
          <div className="flex items-center justify-between mb-4">
            <button type="button" onClick={prevMonth} className="p-1.5 rounded-lg hover:bg-white/10 text-white/60 hover:text-white transition-colors">
              <ChevronLeft className="h-4 w-4" />
            </button>
            <span className="text-sm font-semibold text-white">
              {MONTHS[view.getMonth()]} {view.getFullYear()}
            </span>
            <button type="button" onClick={nextMonth} className="p-1.5 rounded-lg hover:bg-white/10 text-white/60 hover:text-white transition-colors">
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>

          {/* Day labels */}
          <div className="grid grid-cols-7 mb-2">
            {DAYS.map(d => (
              <span key={d} className="text-center text-[10px] font-bold text-white/30 uppercase tracking-wider py-1">{d}</span>
            ))}
          </div>

          {/* Day cells */}
          <div className="grid grid-cols-7 gap-y-1">
            {cells.map((day, i) => {
              if (!day) return <div key={i} />;
              const past = isPast(day);
              return (
                <button
                  key={i}
                  type="button"
                  disabled={past}
                  onClick={() => selectDay(day)}
                  className={`
                    h-8 w-full rounded-lg text-sm font-medium transition-colors
                    ${past ? 'text-white/20 cursor-not-allowed' : 'hover:bg-white/10 cursor-pointer'}
                    ${isSelectedDay(day) ? 'bg-brand-red text-white hover:bg-brand-red/90' : ''}
                    ${isToday(day) && !isSelectedDay(day) ? 'text-brand-red font-bold' : 'text-white/80'}
                  `}
                >
                  {day}
                </button>
              );
            })}
          </div>

          {/* Time slots — shown after a date is picked */}
          {pickedDate && (
            <div className="mt-4 pt-4 border-t border-white/10">
              <p className="text-[10px] font-bold text-white/30 uppercase tracking-wider mb-3">Kies een tijd</p>
              <div className="grid grid-cols-4 gap-1.5">
                {TIME_SLOTS.map(slot => (
                  <button
                    key={slot}
                    type="button"
                    onClick={() => selectTime(slot)}
                    className={`
                      py-2 rounded-lg text-xs font-semibold transition-colors
                      ${pickedTime === slot ? 'bg-brand-red text-white' : 'bg-white/5 text-white/70 hover:bg-white/10 hover:text-white'}
                    `}
                  >
                    {slot}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

const HeroSlider = ({ onNavigate }: { onNavigate: (page: string) => void }) => {
  const images = [
    "https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&q=80&w=2000",
    "https://images.unsplash.com/photo-1581850518616-bcb8186c243c?auto=format&fit=crop&q=80&w=2000",
    "https://images.unsplash.com/photo-1541123437800-1bb1317badc2?auto=format&fit=crop&q=80&w=2000"
  ];
  const [currentImage, setCurrentImage] = useState(0);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentImage((prev) => (prev + 1) % images.length);
    }, 6000);
    return () => clearInterval(timer);
  }, [images.length]);

  return (
    <section className="relative w-full min-h-[90vh] flex items-center pt-24 pb-24 overflow-hidden">
      {/* Background Slideshow */}
      <div className="absolute inset-0 z-0 bg-black">
        {images.map((img, idx) => (
          <div
            key={idx}
            className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${idx === currentImage ? 'opacity-100 z-10' : 'opacity-0 z-0'}`}
          >
            <img 
              src={img} 
              alt="Background Slide" 
              className="w-full h-full object-cover origin-center"
              style={{
                transform: idx === currentImage ? 'scale(1)' : 'scale(1.1)',
                transition: 'transform 8s ease-out'
              }}
            />
          </div>
        ))}
        {/* Overlay to make text readable */}
        <div className="absolute inset-0 bg-gradient-to-r from-black/90 via-black/60 to-black/30 z-20"></div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-30 w-full">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-24 items-center">
          
          {/* Left Text Layer */}
          <div className="space-y-8 max-w-2xl text-white">
            <div className="flex items-center space-x-2">
              <div className="flex text-brand-red">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="h-4 w-4 fill-current" />
                ))}
              </div>
              <span className="text-sm font-semibold text-white/90">49+ 5 Sterren</span>
            </div>

            <h1 className="text-5xl lg:text-7xl font-bold tracking-tight text-white leading-[1.05]">
              Vakmanschap<br />
              in Parket &<br />
              <span className="text-brand-sand">Vloeren</span>
            </h1>

            <p className="text-lg text-white/80 max-w-lg leading-relaxed">
              De specialist in traditioneel parket, PVC en traprenovaties. Wij combineren jarenlange ervaring met passie voor het vak in Geldrop en omgeving.
            </p>

            <div className="pt-2 flex flex-wrap gap-4">
              <Button size="lg" withIcon onClick={() => onNavigate('quote')}>
                Offerte aanvragen
              </Button>
              <button
                onClick={() => onNavigate('projects')}
                className="bg-white/10 hover:bg-white/20 border border-white/20 text-white px-8 py-4 rounded-full font-bold transition-all backdrop-blur-sm"
              >
                Bekijk Projecten
              </button>
            </div>

            <div className="flex flex-wrap gap-x-6 gap-y-2 pt-2">
              {[
                'Gratis inmeting',
                '20+ jaar ervaring',
                'Binnen 1 dag geplaatst',
              ].map((usp) => (
                <span key={usp} className="flex items-center gap-1.5 text-sm text-white/80">
                  <CheckCircle2 className="h-4 w-4 text-brand-red flex-shrink-0" />
                  {usp}
                </span>
              ))}
            </div>
          </div>

          {/* Right Form Layer */}
          <div className="w-full max-w-md ml-auto">
            <div className="bg-black/40 backdrop-blur-xl p-8 rounded-[2rem] border border-white/10 shadow-2xl relative z-10">
              <h3 className="text-2xl font-bold text-white mb-2">Showroom Bezoek</h3>
              <p className="text-white/70 text-sm mb-6">Plan direct een afspraak in. De koffie in Geldrop staat klaar!</p>
              
              <form onSubmit={(e) => { e.preventDefault(); alert('Bedankt voor je aanvraag! We nemen zo spoedig mogelijk contact met je op.'); }} className="space-y-4">
                <div>
                  <label className="sr-only">Naam</label>
                  <input required type="text" placeholder="Uw Naam" className="w-full p-4 rounded-xl bg-white/5 border border-white/10 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-brand-red/50 transition-all" />
                </div>
                <div>
                  <label className="sr-only">Telefoon</label>
                  <input required type="tel" placeholder="Telefoonnummer" className="w-full p-4 rounded-xl bg-white/5 border border-white/10 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-brand-red/50 transition-all" />
                </div>
                <div>
                  <label className="sr-only">Datum</label>
                  <DatePicker value={selectedDate} onChange={setSelectedDate} />
                </div>
                <button type="submit" className="w-full bg-brand-red text-white py-4 rounded-xl font-bold hover:bg-brand-red/90 transition-all shadow-lg shadow-brand-red/20 active:scale-[0.98]">
                  Plan Afspraak
                </button>
              </form>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};

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
      <HeroSlider onNavigate={onNavigate} />

      {/* Logos Strip */}
      <section className="py-12 border-y border-gray-100 reveal delay-100 overflow-hidden">
        <div className="w-full relative opacity-50 grayscale hover:opacity-100 transition-opacity duration-500">
          <div className="animate-marquee flex items-center">
            {/* Repeat the logos array completely symmetrical so translateX(-50%) loops perfectly */}
            {[...logos, ...logos, ...logos, ...logos, ...logos, ...logos, ...logos, ...logos].map((logo, i) => (
              <span key={i} className="text-xl font-bold font-sans text-brand-dark tracking-widest mx-12 whitespace-nowrap">{logo}</span>
            ))}
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