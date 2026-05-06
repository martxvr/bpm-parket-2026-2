import { Suspense } from 'react';
import type { Metadata } from 'next';
import { Container } from '@/components/ui/Container';
import { LeadForm } from '@/components/forms/LeadForm';

export const metadata: Metadata = {
  title: 'Offerte aanvragen',
  description:
    'Vraag vrijblijvend een offerte aan voor je vloer of traprenovatie. Reactie binnen 24 uur.',
};

export default function QuotePage() {
  return (
    <Container size="narrow" className="py-12 md:py-16">
      <h1 className="heading-display text-3xl md:text-4xl">Offerte aanvragen</h1>
      <p className="mt-3 text-black/70">
        Vrijblijvend en op maat. We nemen binnen 24 uur contact op om de details door
        te nemen.
      </p>
      <div className="mt-8 rounded-2xl bg-white p-6 lg:p-8 shadow-sm">
        <Suspense fallback={null}>
          <LeadForm source="quote-form" />
        </Suspense>
      </div>
    </Container>
  );
}
