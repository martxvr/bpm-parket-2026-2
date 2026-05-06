import { Suspense } from 'react';
import type { Metadata } from 'next';
import { Phone, Users, Clock, MessageSquare, FileText } from 'lucide-react';
import { LeadForm } from '@/components/forms/LeadForm';
import { companyConfig } from '@/lib/company';

export const metadata: Metadata = {
  title: 'PVC vloer laten leggen in Geldrop — gratis offerte',
  description:
    'Hoogwaardige PVC vloeren door BPM Parket. Gratis inmeting, vaste prijs, gelegd door eigen team.',
  robots: { index: false, follow: true },
};

const PHONE = companyConfig.contact.phone;
const PVC_IMAGE =
  'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?auto=format&fit=crop&q=80&w=2000';

export default function LandingPVCPage() {
  return (
    <div className="flex flex-col min-h-screen bg-white text-brand-dark">

      {/* ── 1. Sticky mini-bar ── */}
      <div className="sticky top-0 z-50 bg-brand-dark flex items-center justify-between px-4 sm:px-8 py-3">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/logo.png" alt="BPM Parket" className="h-8 w-auto" />
        <a
          href={`tel:${PHONE.replace(/\s/g, '')}`}
          className="flex items-center gap-2 bg-brand-red text-white text-sm font-semibold px-4 py-2 rounded-full hover:bg-brand-red/90 transition-colors"
        >
          <Phone className="h-4 w-4" />
          {PHONE}
        </a>
      </div>

      {/* ── 2. Hero ── */}
      <section className="relative bg-brand-dark overflow-hidden">
        <div className="absolute inset-0">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={PVC_IMAGE} alt="" className="w-full h-full object-cover opacity-20" />
        </div>
        <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-8 py-16 lg:py-24 flex flex-col lg:flex-row gap-12 items-center">
          {/* Left: copy */}
          <div className="flex-1 text-center lg:text-left">
            <span className="inline-block bg-brand-red text-white text-xs font-bold px-3 py-1 rounded-full mb-6">
              ★★★★★ &nbsp;5/5 · 25 Google reviews
            </span>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white leading-tight mb-6">
              PVC vloer laten<br />leggen in Geldrop<br />
              <span className="text-brand-red">&amp; omgeving?</span>
            </h1>
            <p className="text-white/70 text-lg leading-relaxed max-w-lg mx-auto lg:mx-0">
              Bekijk de mooiste PVC vloeren in onze showroom — en ga weg met een{' '}
              <strong className="text-white">vrijblijvende offerte op maat.</strong>
            </p>
          </div>
          {/* Right: form */}
          <div id="hero-form" className="w-full max-w-sm flex-shrink-0">
            <div className="bg-white rounded-2xl p-6 shadow-2xl">
              <h3 className="font-bold text-brand-dark text-base mb-3">Plan je gratis showroombezoek</h3>
              <Suspense fallback={null}>
                <LeadForm
                  source="landing-pvc"
                  floorType="pvc"
                  defaultMessage="Showroomafspraak via PVC-landingspagina."
                />
              </Suspense>
              <p className="text-center text-xs text-gray-400 mt-3">Vrijblijvend · Geen verplichtingen</p>
            </div>
          </div>
        </div>
      </section>

      {/* ── 3. Trust bar ── */}
      <section className="bg-brand-sand/20 py-8 px-4" aria-label="Waarom BPM Parket">
        <div className="max-w-4xl mx-auto grid grid-cols-2 sm:grid-cols-4 gap-6 text-center">
          {[
            { icon: <Users className="h-5 w-5" />, label: 'Vader & zoon vakmannen' },
            { icon: <Clock className="h-5 w-5" />, label: 'Legservice vaak in 1 dag' },
            { icon: <MessageSquare className="h-5 w-5" />, label: 'Persoonlijk advies op maat' },
            { icon: <FileText className="h-5 w-5" />, label: 'Gratis vrijblijvende offerte' },
          ].map(({ icon, label }) => (
            <div key={label} className="flex flex-col items-center gap-2">
              <div className="text-brand-brown">{icon}</div>
              <span className="text-sm font-medium text-brand-dark">{label}</span>
            </div>
          ))}
        </div>
      </section>

      {/* ── 4. Zo werkt het ── */}
      <section className="bg-white py-16 px-4">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-3xl font-bold text-brand-dark mb-12">Zo werkt het</h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-8">
            {[
              { n: '1', title: 'Plan je bezoek', desc: 'Vul het formulier in — je kiest zelf een datum die je uitkomt.' },
              { n: '2', title: 'Bekijk & voel', desc: 'Kom langs in onze showroom, zie de vloeren in het echt en krijg advies op maat.' },
              { n: '3', title: 'Ontvang je offerte', desc: 'Je gaat weg met een vrijblijvende offerte — zonder verplichtingen.' },
            ].map(({ n, title, desc }) => (
              <div key={n} className="flex flex-col items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-brand-red text-white font-bold text-lg flex items-center justify-center flex-shrink-0">
                  {n}
                </div>
                <h3 className="font-bold text-brand-dark">{title}</h3>
                <p className="text-gray-500 text-sm leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── 5. Reviews ── */}
      <section className="bg-brand-sand/10 py-16 px-4">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold text-brand-dark text-center mb-10">Wat klanten zeggen</h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            {[
              {
                quote:
                  'We zijn ontzettend tevreden met onze PVC vloer. Vakkundig gelegd door vader en zoon. Alles netjes afgewerkt en opgeruimd. Top service.',
                name: 'Ingrid Zwart',
              },
              {
                quote: 'Misschien wel de mooiste vloer die ik ooit in mijn woning heb gehad!',
                name: 'Rick Adriaanslaan',
              },
              {
                quote:
                  'Zo blij met mijn nieuwe pvc vloer. Ze zijn erg vakkundig, werken zeer netjes en geven je absoluut mooie en goede adviezen.',
                name: 'Anja Kardol',
              },
            ].map(({ quote, name }, i) => (
              <div key={i} className="bg-white rounded-xl p-5 shadow-sm border-l-4 border-brand-red">
                <p className="text-gray-600 text-sm italic leading-relaxed mb-4">&quot;{quote}&quot;</p>
                <p className="text-brand-dark font-semibold text-sm">{name}</p>
                <p className="text-brand-red text-xs mt-0.5" aria-label="5 sterren">★★★★★</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── 6. Final CTA ── */}
      <section className="bg-brand-dark py-16 px-4 text-center">
        <h2 className="text-3xl font-bold text-white mb-3">Klaar om je nieuwe vloer te kiezen?</h2>
        <p className="text-white/60 text-base mb-8">Plan je gratis showroombezoek — vrijblijvend, geen verplichtingen.</p>
        <a
          href="#hero-form"
          className="inline-block bg-brand-red text-white font-semibold px-10 py-4 rounded-full hover:bg-brand-red/90 transition-colors text-base"
        >
          Afspraak inplannen →
        </a>
      </section>

    </div>
  );
}
