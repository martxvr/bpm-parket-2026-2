import type { Metadata } from 'next';
import Image from 'next/image';
import { Phone, CheckCircle, Clock, Users } from 'lucide-react';
import { LeadForm } from '@/components/forms/LeadForm';
import { Container } from '@/components/ui/Container';
import { companyConfig } from '@/lib/company';

export const metadata: Metadata = {
  title: 'PVC vloer laten leggen in Geldrop — gratis offerte',
  description:
    'Hoogwaardige PVC vloeren door BPM Parket. Gratis inmeting, vaste prijs, gelegd door eigen team.',
  robots: { index: false, follow: true },
};

const PHONE = companyConfig.contact.phone;

export default function PvcLandingPage() {
  return (
    <Container className="py-10 grid grid-cols-1 lg:grid-cols-2 gap-12">
      <div>
        <a
          href={`tel:${PHONE.replace(/\s/g, '')}`}
          className="inline-flex items-center gap-2 text-sm text-[var(--color-brand-primary)] mb-6"
        >
          <Phone className="h-4 w-4" />
          Direct bellen: {PHONE}
        </a>

        <h1 className="heading-display text-4xl md:text-5xl">
          PVC vloer laten leggen in Geldrop
        </h1>
        <p className="mt-4 text-black/70">
          Hoogwaardige PVC vloeren — look van hout, gemak van PVC. Gratis inmeting,
          vaste prijs, gelegd door ons eigen team.
        </p>

        <ul className="mt-8 space-y-3 text-sm">
          {[
            'Gratis inmeting aan huis',
            'Vaste prijs vooraf — geen verrassingen',
            'Eigen team, geen onderaannemers',
            'Garantie op werk en materiaal',
            '20+ jaar ervaring in Zuidoost-Brabant',
          ].map((b) => (
            <li key={b} className="flex items-center gap-2">
              <CheckCircle className="h-5 w-5 text-[var(--color-brand-primary)]" />
              {b}
            </li>
          ))}
        </ul>

        <div className="relative h-64 mt-10 rounded-2xl overflow-hidden">
          <Image
            src="https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?auto=format&fit=crop&q=80&w=2000"
            alt="PVC vloer"
            fill
            sizes="(max-width: 1024px) 100vw, 50vw"
            className="object-cover"
            priority
          />
        </div>

        <div className="mt-8 grid grid-cols-2 gap-4 text-sm">
          <div className="flex items-center gap-2">
            <Clock className="h-5 w-5 text-[var(--color-brand-primary)]" />
            Reactie binnen 24u
          </div>
          <div className="flex items-center gap-2">
            <Users className="h-5 w-5 text-[var(--color-brand-primary)]" />
            500+ tevreden klanten
          </div>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-sm p-6 lg:p-8 lg:sticky lg:top-6 self-start">
        <h2 className="heading-display text-2xl">Vraag je offerte aan</h2>
        <p className="text-sm text-black/60 mt-1">
          Vul dit formulier in en we nemen binnen 24 uur contact op.
        </p>
        <div className="mt-5">
          <LeadForm
            source="landing-pvc"
            floorType="pvc"
            defaultMessage="PVC vloer aanvraag via landingspagina"
          />
        </div>
      </div>
    </Container>
  );
}
