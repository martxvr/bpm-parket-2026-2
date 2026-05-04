import type { Metadata } from 'next';
import { Phone, Mail, MapPin } from 'lucide-react';
import { Container } from '@/components/ui/Container';
import { LeadForm } from '@/components/forms/LeadForm';
import { companyConfig } from '@/lib/company';

export const metadata: Metadata = {
  title: 'Contact',
  description:
    'Neem contact op met BPM Parket in Geldrop. Bel, mail of vul het formulier in.',
};

export default function ContactPage() {
  return (
    <Container className="py-12 md:py-16 grid grid-cols-1 lg:grid-cols-2 gap-12">
      <div>
        <h1 className="heading-display text-4xl md:text-5xl">Contact</h1>
        <p className="mt-3 text-black/70">
          Vragen, een offerte of gewoon een goed gesprek? We staan voor je klaar.
        </p>

        <div className="mt-8 space-y-4 text-sm">
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
          <div className="flex items-start gap-3">
            <MapPin className="h-5 w-5 text-[var(--color-brand-primary)] shrink-0 mt-0.5" />
            <div>
              <p className="font-medium">Showroom</p>
              <p className="text-black/70">
                {companyConfig.contact.address}, {companyConfig.contact.zipCity}
              </p>
            </div>
          </div>
        </div>
      </div>

      <div>
        <h2 className="heading-display text-2xl">Stuur ons een bericht</h2>
        <div className="mt-4">
          <LeadForm source="contact-form" />
        </div>
      </div>
    </Container>
  );
}
