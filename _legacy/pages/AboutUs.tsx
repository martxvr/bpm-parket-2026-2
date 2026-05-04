// pages/AboutUs.tsx
import React from 'react';
import { Award, ShieldCheck, Leaf, Star } from 'lucide-react';
import Button from '../components/Button';

interface AboutUsProps {
  onNavigate: (page: string) => void;
}

const team = [
  {
    name: 'Bodhi van Baar',
    role: 'Eigenaar & Meester-Parketteur',
    bio: 'Bodhi is de drijvende kracht achter BPM Parket. Met een aangeboren passie voor ambacht en oog voor detail zorgt hij ervoor dat elk project wordt afgeleverd als ware het zijn eigen huis.',
  },
  {
    name: 'Wil van Baar',
    role: 'Uitvoerder & Specialist',
    bio: 'Wil brengt jarenlange praktijkervaring mee op de werkvloer. Van traditioneel parket tot moderne PVC-vloeren en traprenovaties — zijn vakmanschap is in elk detail zichtbaar.',
  },
];

const stats = [
  { value: '20+', label: 'Jaar ervaring' },
  { value: '500+', label: 'Projecten afgerond' },
  { value: '100%', label: 'Maatwerk' },
  { value: '49+', label: '5-sterren reviews' },
];

const values = [
  {
    icon: Award,
    title: 'Vakmanschap',
    desc: 'Ieder project behandelen we als ons eigen huis. Van voorbereiding tot eindresultaat werken we met de precisie van een meester-parketteur.',
  },
  {
    icon: ShieldCheck,
    title: 'Betrouwbaarheid',
    desc: 'We komen onze afspraken na, altijd. U weet vooraf wat u kunt verwachten: eerlijke prijzen, duidelijke planning en geen verrassingen.',
  },
  {
    icon: Leaf,
    title: 'Duurzaamheid',
    desc: 'We werken met materialen die generaties meegaan. Kwaliteit boven kwantiteit — een vloer van BPM Parket is een investering voor de lange termijn.',
  },
];

const AboutUs: React.FC<AboutUsProps> = ({ onNavigate }) => {
  return (
    <div className="flex flex-col w-full overflow-hidden bg-white text-brand-dark">

      {/* Hero */}
      <section className="relative w-full min-h-[60vh] flex items-center overflow-hidden bg-black">
        <div className="absolute inset-0">
          <img
            src="https://www.bpmparket.nl/wp-content/uploads/2023/10/2023-10-02-12_27_45-WhatsApp-en-nog-9-andere-paginas-Werk-Microsoft%E2%80%8B-Edge-e1696335757551.png"
            alt="BPM Parket vakmanschap"
            className="w-full h-full object-cover opacity-40"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black/80 to-black/40" />
        </div>
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-32">
          <span className="text-xs font-bold tracking-widest text-brand-red uppercase mb-4 block">Over ons</span>
          <h1 className="text-5xl lg:text-7xl font-bold text-white leading-tight mb-6">
            Vakmanschap<br />met een verhaal
          </h1>
          <p className="text-lg text-white/70 max-w-xl">
            BPM Parket is een familiebedrijf uit Geldrop met meer dan 20 jaar ervaring in parket, PVC-vloeren en traprenovaties. Wij werken met passie voor het vak en trots op elk project.
          </p>
        </div>
      </section>

      {/* Verhaal */}
      <section className="py-24 lg:py-32 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div className="space-y-6">
              <span className="text-xs font-bold tracking-widest text-gray-400 uppercase">Ons verhaal</span>
              <h2 className="text-4xl lg:text-5xl font-bold text-black leading-tight">
                Begonnen met één vloer. Gebleven voor het vakmanschap.
              </h2>
              <p className="text-gray-500 text-lg leading-relaxed">
                BPM Parket is ruim 20 jaar geleden opgericht vanuit een eenvoudige overtuiging: een vloer is meer dan een ondergrond. Het is het fundament van uw thuis. Oprichter Bas begon als zelfstandig parketteur en bouwde het bedrijf langzaam op, gedreven door kwaliteit en persoonlijk contact.
              </p>
              <p className="text-gray-500 text-lg leading-relaxed">
                Vandaag werken we met een hecht team van specialisten die elk hun eigen discipline meesterlijk beheersen. Van traditioneel visgraat parket tot moderne PVC-vloeren en traprenovaties — bij BPM Parket doet iedereen waar hij het beste in is.
              </p>
            </div>
            <div className="relative rounded-[3rem] overflow-hidden h-[500px]">
              <img
                src="https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&q=80&w=1200"
                alt="Parketteur aan het werk"
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Statistieken */}
      <section className="py-20 bg-brand-brown/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            {stats.map((stat) => (
              <div key={stat.label} className="text-center">
                <p className="text-5xl font-bold text-black mb-2">{stat.value}</p>
                <p className="text-sm text-gray-500 uppercase tracking-widest">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Kernwaarden */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <span className="text-xs font-bold tracking-widest text-brand-brown uppercase mb-4 block">Onze waarden</span>
            <h2 className="text-4xl font-bold text-black">Waar wij voor staan</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {values.map((val) => (
              <div key={val.title} className="bg-brand-brown/5 p-10 rounded-[2rem]">
                <div className="w-12 h-12 bg-black rounded-full flex items-center justify-center mb-6">
                  <val.icon className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-xl font-bold mb-4">{val.title}</h3>
                <p className="text-gray-500 leading-relaxed">{val.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Team */}
      <section className="py-24 bg-brand-brown/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <span className="text-xs font-bold tracking-widest text-brand-brown uppercase mb-4 block">Het team</span>
            <h2 className="text-4xl font-bold text-black">De mensen achter BPM Parket</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {team.map((member) => (
              <div key={member.name} className="bg-white rounded-[2rem] overflow-hidden shadow-sm hover:shadow-xl transition-shadow duration-300">
                <div className="h-64 bg-gradient-to-br from-gray-200 to-gray-300 flex items-center justify-center">
                  <span className="text-6xl font-bold text-white/50">{member.name.charAt(0)}</span>
                </div>
                <div className="p-8">
                  <h3 className="text-xl font-bold mb-1">{member.name}</h3>
                  <p className="text-brand-red text-sm font-semibold mb-4">{member.role}</p>
                  <p className="text-gray-500 text-sm leading-relaxed">{member.bio}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Reviews teaser */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="flex justify-center mb-4">
            {[...Array(5)].map((_, i) => (
              <Star key={i} className="h-7 w-7 text-brand-red fill-current" />
            ))}
          </div>
          <p className="text-2xl font-bold text-black mb-2">49+ tevreden klanten gingen u voor</p>
          <p className="text-gray-500 mb-8">Bekijk onze beoordelingen op Werkspot en Google.</p>
          <Button variant="primary" withIcon onClick={() => onNavigate('quote')}>
            Vraag een vrijblijvende offerte aan
          </Button>
        </div>
      </section>

    </div>
  );
};

export default AboutUs;
