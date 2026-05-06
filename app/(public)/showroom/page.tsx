import type { Metadata } from 'next';
import { MapPin, Phone, Clock } from 'lucide-react';
import { ShowroomForm } from '@/components/forms/ShowroomForm';
import { companyConfig } from '@/lib/company';

export const metadata: Metadata = {
  title: 'Showroom',
  description:
    'Kom langs in onze showroom in Geldrop. Bekijk en voel onze vloeren in het echt — gratis advies van een vakman.',
};

export default function ShowroomPage() {
  return (
    <div className="bg-white min-h-screen">
      {/* Hero Header */}
      <section className="bg-brand-dark text-white py-24 relative overflow-hidden">
        <div className="absolute inset-0 opacity-20">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&q=80&w=2000"
            alt="Showroom background"
            className="w-full h-full object-cover"
          />
        </div>
        <div className="max-w-7xl mx-auto px-6 relative z-10">
          <span className="text-brand-brown font-bold tracking-widest uppercase text-xs mb-4 block">Beleef onze vloeren</span>
          <h1 className="text-5xl md:text-7xl font-bold tracking-tight mb-6">Onze Showroom</h1>
          <p className="text-xl text-gray-300 max-w-2xl leading-relaxed">
            Kom langs in Geldrop en laat u inspireren door onze uitgebreide collectie traditioneel parket, PVC en traprenovaties. Wij staan klaar met persoonlijk advies en een goede kop koffie.
          </p>
        </div>
      </section>

      <section className="py-24 max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24">

          {/* Left: Info & Map */}
          <div className="space-y-12">
            <div>
              <h2 className="text-3xl font-bold text-brand-dark mb-8">Bezoekinformatie</h2>
              <div className="space-y-6">
                <div className="flex items-start gap-4">
                  <div className="bg-brand-light p-3 rounded-xl text-brand-dark">
                    <MapPin size={24} />
                  </div>
                  <div>
                    <h4 className="font-bold">Locatie</h4>
                    <p className="text-gray-500">{companyConfig.contact.address}<br />{companyConfig.contact.zipCity}</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="bg-brand-light p-3 rounded-xl text-brand-dark">
                    <Clock size={24} />
                  </div>
                  <div>
                    <h4 className="font-bold">Openingstijden</h4>
                    <ul className="text-gray-500 text-sm space-y-1">
                      <li className="flex justify-between w-48"><span>Ma - Vr:</span> <span>09:00 - 17:00</span></li>
                      <li className="flex justify-between w-48"><span>Zaterdag:</span> <span>Op afspraak</span></li>
                      <li className="flex justify-between w-48"><span>Zondag:</span> <span>Gesloten</span></li>
                    </ul>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="bg-brand-light p-3 rounded-xl text-brand-dark">
                    <Phone size={24} />
                  </div>
                  <div>
                    <h4 className="font-bold">Telefoon</h4>
                    <p className="text-gray-500">{companyConfig.contact.phone}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Map */}
            <div className="rounded-[2rem] overflow-hidden h-[350px] shadow-lg border border-brand-light grayscale hover:grayscale-0 transition-all duration-700">
              <iframe
                src="https://maps.google.com/maps?q=Hooge+Akker+19,+5661+NG+Geldrop&output=embed"
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen
                loading="lazy"
              ></iframe>
            </div>
          </div>

          {/* Right: Booking Form */}
          <div className="bg-brand-brown/5 rounded-[3rem] p-8 lg:p-12 border border-brand-brown/10 shadow-sm">
            <h2 className="text-3xl font-bold text-brand-dark mb-2">Afspraak plannen</h2>
            <p className="text-gray-500 mb-8 font-medium">Plan direct een showroom bezoek in met een van onze adviseurs.</p>
            <ShowroomForm />
          </div>

        </div>
      </section>
    </div>
  );
}
