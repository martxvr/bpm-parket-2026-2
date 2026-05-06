import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowUpRight } from 'lucide-react';
import { BrandCards } from '@/components/marketing/BrandCards';
import { RevealOnScroll } from '@/components/marketing/home/RevealOnScroll';
import { StructuredData } from '@/components/marketing/StructuredData';
import { getServiceBySlug } from '@/lib/db/services';
import { serviceSchema } from '@/lib/seo';

const SLUG = 'schuren-onderhoud';
const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://bpmparket.nl';

const FALLBACK_TITLE = 'Schuren & Onderhoud';
const FALLBACK_DESCRIPTION =
  'Onze experts zorgen voor een perfecte installatie en onderhoud van uw vloer, met oog voor elk detail.';

export async function generateMetadata(): Promise<Metadata> {
  const s = await getServiceBySlug(SLUG);
  return {
    title: s?.meta_title ?? s?.title ?? FALLBACK_TITLE,
    description: s?.meta_description ?? FALLBACK_DESCRIPTION,
    alternates: { canonical: `${SITE_URL}/${SLUG}` },
  };
}

export default async function Page() {
  const service = await getServiceBySlug(SLUG);
  return (
    <>
      <StructuredData
        schema={serviceSchema({
          name: service?.title ?? FALLBACK_TITLE,
          description: service?.meta_description ?? FALLBACK_DESCRIPTION,
          slug: SLUG,
          imageUrl: service?.hero_image ?? undefined,
        })}
      />
      <RevealOnScroll />

      <div className="flex flex-col w-full bg-white text-brand-dark">
        <section className="relative pt-24 pb-32 bg-black overflow-hidden">
          <div className="absolute inset-0">
            <Image
              src="https://images.unsplash.com/photo-1504307651254-35680f356dfd?auto=format&fit=crop&q=80&w=2000"
              alt=""
              fill
              priority
              sizes="100vw"
              className="object-cover opacity-30"
            />
          </div>
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            <div className="max-w-3xl reveal">
              <span className="text-xs font-bold tracking-widest text-brand-red uppercase mb-4 block">
                Vakmanschap
              </span>
              <h1 className="text-5xl lg:text-7xl font-bold text-white mb-8 leading-tight">
                Schuren & <span className="text-brand-red">Onderhoud</span>
              </h1>
              <p className="text-xl text-white/70 leading-relaxed mb-10">
                Onze experts zorgen voor een perfecte installatie van uw nieuwe vloer, met oog voor elk detail.
              </p>
              <Link
                href="/offerte"
                className="inline-flex items-center justify-center rounded-full font-medium transition-all duration-300 bg-brand-red text-white hover:bg-brand-red/90 px-9 py-4 text-base group"
              >
                Plan uw installatie
                <ArrowUpRight className="ml-2 w-4 h-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
              </Link>
            </div>
          </div>
        </section>

        <section className="py-24 reveal">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-4xl font-bold mb-8">Zorgeloze Installatie</h2>
            <p className="text-xl text-gray-500 leading-relaxed mb-12">
              Van het egaliseren van de ondervloer tot het plaatsen van de laatste plint; wij nemen het volledige traject uit handen. Onze interieurwerken combineren esthetiek met vakmanschap voor naadloze vloeren.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[
                { title: 'Egaliseren', desc: 'Een perfect gladde basis voor uw nieuwe vloer.' },
                { title: 'Vakkundig Leggen', desc: 'Precisiewerk door ervaren parketteurs.' },
                { title: 'Afwerking', desc: 'Plinten en profielen voor een strak resultaat.' },
              ].map((step) => (
                <div
                  key={step.title}
                  className="bg-white p-8 rounded-[2rem] border border-gray-100 shadow-sm"
                >
                  <h3 className="text-xl font-bold mb-4">{step.title}</h3>
                  <p className="text-gray-500">{step.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      </div>

      <BrandCards serviceSlug={SLUG} />
    </>
  );
}
