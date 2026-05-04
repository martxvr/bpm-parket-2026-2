import type { Metadata } from 'next';
import Image from 'next/image';
import { Phone, Mail, MapPin, Clock } from 'lucide-react';
import { Container } from '@/components/ui/Container';
import { Button } from '@/components/ui/Button';
import { companyConfig } from '@/lib/company';

export const metadata: Metadata = {
  title: 'Showroom',
  description:
    'Bezoek onze showroom in Geldrop. Bekijk en voel onze vloeren in het echt — gratis advies van een vakman.',
};

const HOURS = Object.entries(companyConfig.hours);

export default function ShowroomPage() {
  return (
    <>
      <section className="relative h-72">
        <Image
          src="https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&q=80&w=2000"
          alt="Showroom"
          fill
          sizes="100vw"
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-black/40" />
        <Container className="absolute inset-0 flex items-end pb-10 text-white">
          <h1 className="heading-display text-4xl md:text-5xl">Onze showroom</h1>
        </Container>
      </section>

      <Container className="py-12 md:py-16 grid grid-cols-1 lg:grid-cols-2 gap-12">
        <div>
          <h2 className="heading-display text-2xl">Kom langs in Geldrop</h2>
          <p className="mt-3 text-black/70">
            In onze showroom kun je de vloeren in het echt zien en voelen. Onze
            vakmensen geven je persoonlijk advies — zonder verkooppraatjes, mét
            inzicht uit ruim 20 jaar ervaring.
          </p>

          <div className="mt-8 space-y-4 text-sm">
            <div className="flex items-start gap-3">
              <MapPin className="h-5 w-5 text-[var(--color-brand-primary)] shrink-0 mt-0.5" />
              <div>
                <p className="font-medium">Adres</p>
                <p className="text-black/70">
                  {companyConfig.contact.address}, {companyConfig.contact.zipCity}
                </p>
                <a
                  href={companyConfig.contact.mapsUrl}
                  className="text-[var(--color-brand-primary)] underline mt-1 inline-block"
                >
                  Open in Google Maps
                </a>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <Phone className="h-5 w-5 text-[var(--color-brand-primary)] shrink-0 mt-0.5" />
              <div>
                <p className="font-medium">Telefoon</p>
                <a href={`tel:${companyConfig.contact.phone.replace(/\s/g, '')}`}>
                  {companyConfig.contact.phone}
                </a>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <Mail className="h-5 w-5 text-[var(--color-brand-primary)] shrink-0 mt-0.5" />
              <div>
                <p className="font-medium">Email</p>
                <a href={`mailto:${companyConfig.contact.email}`}>
                  {companyConfig.contact.email}
                </a>
              </div>
            </div>
          </div>

          <Button href="/offerte" className="mt-8">
            Plan een afspraak
          </Button>
        </div>

        <div>
          <h2 className="heading-display text-2xl flex items-center gap-2">
            <Clock className="h-6 w-6" /> Openingstijden
          </h2>
          <dl className="mt-4 rounded-2xl bg-white p-6 shadow-sm divide-y divide-black/5">
            {HOURS.map(([day, hours]) => (
              <div key={day} className="flex justify-between py-2 text-sm">
                <dt className="capitalize text-black/70">{day}</dt>
                <dd className="font-medium">{hours}</dd>
              </div>
            ))}
          </dl>
          <p className="text-xs text-black/50 mt-3">
            Tip: bel even voor je komt — dan staat er koffie klaar.
          </p>
        </div>
      </Container>
    </>
  );
}
