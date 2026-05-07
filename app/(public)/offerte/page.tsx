import { Suspense } from 'react';
import type { Metadata } from 'next';
import { LeadFormWizard } from '@/components/forms/LeadFormWizard';

export const metadata: Metadata = {
  title: 'Offerte aanvragen',
  description:
    'Vraag vrijblijvend een offerte aan voor je vloer of traprenovatie. Reactie binnen 24 uur.',
};

export default function QuotePage() {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4 sm:px-6">
      <div className="bg-white w-full max-w-6xl rounded-[2rem] shadow-2xl overflow-hidden flex flex-col lg:flex-row min-h-[700px]">
        <Suspense fallback={null}>
          <LeadFormWizard />
        </Suspense>
      </div>
    </div>
  );
}
