import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowUpRight, Layers } from 'lucide-react';
import { BrandCards } from '@/components/marketing/BrandCards';
import { RevealOnScroll } from '@/components/marketing/home/RevealOnScroll';
import { StructuredData } from '@/components/marketing/StructuredData';
import { getServiceBySlug } from '@/lib/db/services';
import { serviceSchema } from '@/lib/seo';

const SLUG = 'laminaat';
const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://bpmparket.nl';

const FALLBACK_TITLE = 'Laminaat Vloeren';
const FALLBACK_DESCRIPTION =
  'Stijlvol, duurzaam en onderhoudsvriendelijk. De perfecte vloeroplossing voor elk modern interieur.';

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
        {/* Hero */}
        <section className="relative pt-24 pb-32 bg-black overflow-hidden">
          <div className="absolute inset-0">
            <Image
              src="https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?auto=format&fit=crop&q=80&w=2000"
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
                Onze Collectie
              </span>
              <h1 className="text-5xl lg:text-7xl font-bold text-white mb-8 leading-tight">
                Laminaat <span className="text-brand-red">Vloeren</span>
              </h1>
              <p className="text-xl text-white/70 leading-relaxed mb-10">
                Stijlvol, duurzaam en onderhoudsvriendelijk. De perfecte vloeroplossing voor elk modern interieur.
              </p>
              <Link
                href="/offerte"
                className="inline-flex items-center justify-center rounded-full font-medium transition-all duration-300 bg-brand-red text-white hover:bg-brand-red/90 px-9 py-4 text-base group"
              >
                Gratis Offerte
                <ArrowUpRight className="ml-2 w-4 h-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
              </Link>
            </div>
          </div>
        </section>

        {/* Content Section: Laminaat */}
        <section className="py-24 bg-brand-brown/5 reveal">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
              <div className="order-2 lg:order-1 relative rounded-[3rem] overflow-hidden aspect-square shadow-2xl">
                <Image
                  src="https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&q=80&w=2000"
                  alt="Laminaat Vloer"
                  fill
                  sizes="(max-width: 1024px) 100vw, 50vw"
                  className="object-cover"
                />
              </div>
              <div className="order-1 lg:order-2">
                <div className="w-12 h-12 bg-black rounded-full flex items-center justify-center mb-6 text-white">
                  <Layers className="w-6 h-6" />
                </div>
                <h2 className="text-4xl font-bold mb-8">Laminaat Vloeren</h2>
                <div className="space-y-6 text-gray-500 text-lg leading-relaxed">
                  <p>
                    Laminaatvloeren hebben zich door de jaren heen bewezen als een favoriete keuze voor velen. Deze bekende vloeroplossing bestaat uit robuuste planken met een geavanceerd clicksysteem. Wat ze echt uniek maakt, is de realistische fotoprint van hout of tegels die ze dragen, afgetopt met een duurzame melamine toplaag.
                  </p>
                  <p>
                    We zijn trots om samen te werken met gerenommeerde merken zoals Meister. Deze samenwerking stelt ons in staat om onze klanten de allernieuwste innovaties in laminaatvloeren aan te bieden, zoals de verfijnde collecties LINDURA en NADURA.
                  </p>
                  <p>
                    Deze collecties belichamen het summum van design en duurzaamheid, waardoor uw woonruimte met gemak en stijl transformeert.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="py-24 px-4 sm:px-6 lg:px-8 reveal">
          <div className="max-w-7xl mx-auto rounded-[3rem] bg-black p-12 lg:p-24 text-center text-white relative overflow-hidden">
            <div className="relative z-10 max-w-2xl mx-auto">
              <h2 className="text-4xl lg:text-5xl font-bold mb-8">
                Klaar voor een nieuwe <span className="text-brand-red">vloer</span>?
              </h2>
              <p className="text-lg opacity-80 mb-10">
                Neem contact met ons op voor een vrijblijvend adviesgesprek in onze showroom of bij u op locatie.
              </p>
              <Link
                href="/offerte"
                className="inline-flex items-center justify-center rounded-full font-medium transition-all duration-300 bg-brand-red text-white hover:bg-brand-red/90 px-9 py-4 text-base group"
              >
                Offerte Aanvragen
                <ArrowUpRight className="ml-2 w-4 h-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
              </Link>
            </div>
          </div>
        </section>
      </div>

      <BrandCards serviceSlug={SLUG} />
    </>
  );
}
