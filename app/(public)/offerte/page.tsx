import { Suspense } from 'react';
import type { Metadata } from 'next';
import { CheckCircle } from 'lucide-react';
import { LeadForm } from '@/components/forms/LeadForm';
import { companyConfig } from '@/lib/company';

export const metadata: Metadata = {
  title: 'Offerte aanvragen',
  description:
    'Vraag vrijblijvend een offerte aan voor je vloer of traprenovatie. Reactie binnen 24 uur.',
};

export default function QuotePage() {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4 sm:px-6">

      {/* Main Card Container */}
      <div className="bg-white w-full max-w-6xl rounded-[2rem] shadow-2xl flex flex-col lg:flex-row overflow-hidden min-h-[600px]">

        {/* Left Sidebar (Progress & Info) */}
        <div className="w-full lg:w-1/3 bg-gray-50 p-8 lg:p-12 flex flex-col justify-between border-r border-gray-100">
          <div>
            <div className="flex items-center space-x-2 mb-12">
              <div className="h-8 w-8 bg-black rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-lg">{companyConfig.name.substring(0, 1)}</span>
              </div>
              <span className="font-bold text-xl">{companyConfig.name}</span>
            </div>

            <div className="space-y-8">
              <div className="space-y-2">
                <h3 className="font-bold text-gray-900">Offerte Aanvraag</h3>
                <p className="text-sm text-gray-500">Vul uw gegevens in om een nauwkeurige prijsindicatie te ontvangen.</p>
              </div>

              {/* Steps Indicator (static — single-form layout) */}
              <div className="space-y-4">
                {[
                  { num: 1, label: 'Type Vloer' },
                  { num: 2, label: 'Oppervlakte' },
                  { num: 3, label: 'Contactgegevens' },
                ].map((s) => (
                  <div key={s.num} className="flex items-center">
                    <div className="w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold mr-3 bg-gray-200 text-gray-500">
                      <CheckCircle size={16} />
                    </div>
                    <span className="text-sm font-medium text-gray-400">
                      {s.label}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="mt-12 lg:mt-0">
            <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100">
              <p className="text-xs text-gray-400 font-semibold uppercase mb-2">Hulp nodig?</p>
              <p className="text-sm font-medium">{companyConfig.contact.phone}</p>
              <p className="text-sm text-gray-500">{companyConfig.contact.email}</p>
            </div>
          </div>
        </div>

        {/* Right Content Area */}
        <div className="w-full lg:w-2/3 p-8 lg:p-12 flex flex-col">
          <div className="mb-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-2">Vraag uw offerte aan</h2>
            <p className="text-gray-500">Vul onderstaande gegevens in — we sturen binnen 24 uur een prijsindicatie op maat.</p>
          </div>

          <Suspense fallback={null}>
            <LeadForm source="quote-form" />
          </Suspense>
        </div>
      </div>
    </div>
  );
}
