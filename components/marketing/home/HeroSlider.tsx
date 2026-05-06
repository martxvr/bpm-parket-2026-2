'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { ArrowUpRight, CheckCircle2, Star } from 'lucide-react';
import DatePicker from '@/components/ui/DatePicker';

const IMAGES = [
  'https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&q=80&w=2000',
  'https://images.unsplash.com/photo-1599809275671-b5942cabc7a2?auto=format&fit=crop&q=80&w=2000',
  'https://images.unsplash.com/photo-1541123437800-1bb1317badc2?auto=format&fit=crop&q=80&w=2000',
];

export function HeroSlider() {
  const [currentImage, setCurrentImage] = useState(0);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentImage((prev) => (prev + 1) % IMAGES.length);
    }, 6000);
    return () => clearInterval(timer);
  }, []);

  return (
    <section className="relative w-full min-h-[90vh] flex items-center pt-24 pb-24 overflow-hidden">
      {/* Background Slideshow */}
      <div className="absolute inset-0 z-0 bg-black">
        {IMAGES.map((img, idx) => (
          <div
            key={idx}
            className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
              idx === currentImage ? 'opacity-100 z-10' : 'opacity-0 z-0'
            }`}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={img}
              alt="Background Slide"
              className="w-full h-full object-cover origin-center"
              style={{
                transform: idx === currentImage ? 'scale(1)' : 'scale(1.1)',
                transition: 'transform 8s ease-out',
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
              Vakmanschap
              <br />
              in Parket &amp;
              <br />
              <span className="text-brand-brown">Vloeren</span>
            </h1>

            <p className="text-lg text-white/80 max-w-lg leading-relaxed">
              De specialist in traditioneel parket, PVC en traprenovaties. Wij combineren jarenlange ervaring met passie voor het vak in Geldrop en omgeving.
            </p>

            <div className="pt-2 flex flex-wrap gap-4">
              <Link
                href="/offerte"
                className="group inline-flex items-center justify-center rounded-full font-medium transition-all duration-300 focus:outline-none bg-brand-red text-white hover:bg-brand-red/90 border border-transparent px-9 py-4 text-base"
              >
                Offerte aanvragen
                <ArrowUpRight className="ml-2 w-4 h-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
              </Link>
              <Link
                href="/projecten"
                className="bg-white/10 hover:bg-white/20 border border-white/20 text-white px-8 py-4 rounded-full font-bold transition-all backdrop-blur-sm"
              >
                Bekijk Projecten
              </Link>
            </div>

            <div className="flex flex-wrap gap-x-6 gap-y-2 pt-2">
              {['Gratis inmeting', '20+ jaar ervaring', 'Binnen 1 dag geplaatst'].map((usp) => (
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
              <p className="text-white/70 text-sm mb-6">
                Plan direct een afspraak in. De koffie in Geldrop staat klaar!
              </p>

              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  alert(
                    'Bedankt voor je aanvraag! We nemen zo spoedig mogelijk contact met je op.',
                  );
                }}
                className="space-y-4"
              >
                <div>
                  <label className="sr-only">Naam</label>
                  <input
                    required
                    type="text"
                    placeholder="Uw Naam"
                    className="w-full p-4 rounded-xl bg-white/5 border border-white/10 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-brand-red/50 transition-all"
                  />
                </div>
                <div>
                  <label className="sr-only">Telefoon</label>
                  <input
                    required
                    type="tel"
                    placeholder="Telefoonnummer"
                    className="w-full p-4 rounded-xl bg-white/5 border border-white/10 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-brand-red/50 transition-all"
                  />
                </div>
                <div>
                  <label className="sr-only">Datum</label>
                  <DatePicker value={selectedDate} onChange={setSelectedDate} />
                </div>
                <button
                  type="submit"
                  className="w-full bg-brand-red text-white py-4 rounded-xl font-bold hover:bg-brand-red/90 transition-all shadow-lg shadow-brand-red/20 active:scale-[0.98]"
                >
                  Plan Afspraak
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
