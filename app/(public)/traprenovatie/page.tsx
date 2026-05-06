import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowUpRight } from 'lucide-react';
import { BrandCards } from '@/components/marketing/BrandCards';
import { RevealOnScroll } from '@/components/marketing/home/RevealOnScroll';
import { StructuredData } from '@/components/marketing/StructuredData';
import { getServiceBySlug } from '@/lib/db/services';
import { serviceSchema } from '@/lib/seo';

const SLUG = 'traprenovatie';
const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://bpmparket.nl';

const FALLBACK_TITLE = 'Trap Renovatie';
const FALLBACK_DESCRIPTION =
  'Transformeer uw trap binnen één dag tot een prachtig pronkstuk in uw woning.';

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
              src="https://images.unsplash.com/photo-1558618666-fcd25c85cd64?auto=format&fit=crop&q=80&w=2000"
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
                Snel & Stijlvol
              </span>
              <h1 className="text-5xl lg:text-7xl font-bold text-white mb-8 leading-tight">
                Trap <span className="text-brand-red">Renovatie</span>
              </h1>
              <p className="text-xl text-white/70 leading-relaxed mb-10">
                Transformeer uw trap binnen één dag tot een prachtig pronkstuk in uw woning.
              </p>
              <Link
                href="/offerte"
                className="inline-flex items-center justify-center rounded-full font-medium transition-all duration-300 bg-brand-red text-white hover:bg-brand-red/90 px-9 py-4 text-base group"
              >
                Gratis Check
                <ArrowUpRight className="ml-2 w-4 h-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
              </Link>
            </div>
          </div>
        </section>

        <section className="py-24 reveal">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
              <div>
                <h2 className="text-4xl font-bold mb-8">Nieuwe glans voor uw trap</h2>
                <div className="space-y-6 text-gray-500 text-lg leading-relaxed">
                  <p>
                    Als uw trap tekenen van slijtage vertoont of zijn vroegere glans heeft verloren, hebben wij de ideale oplossing voor u. Met onze gespecialiseerde traprenovatiediensten toveren we uw oude, versleten trap om tot een stijlvol en functioneel pronkstuk.
                  </p>
                  <p>
                    Door gebruik te maken van hoogwaardige overzet treden, beschikbaar in diverse houtsoorten en kleurenopties, garanderen we een naadloze afwerking die past bij elk interieur.
                  </p>
                  <div className="bg-brand-brown/10 p-8 rounded-3xl border border-brand-brown/20">
                    <p className="font-bold text-brand-dark italic">
                      &ldquo;Binnen slechts één dag kan uw trap een complete transformatie ondergaan, met minimale verstoring voor uw dagelijkse routine.&rdquo;
                    </p>
                  </div>
                </div>
              </div>
              <div className="relative rounded-[3rem] overflow-hidden aspect-[4/5] shadow-2xl">
                <Image
                  src="https://images.unsplash.com/photo-1560185007-cde436f6a4d0?auto=format&fit=crop&q=80&w=2000"
                  alt="Trap Renovatie"
                  fill
                  sizes="(max-width: 1024px) 100vw, 50vw"
                  className="object-cover"
                />
              </div>
            </div>
          </div>
        </section>
      </div>

      <BrandCards serviceSlug={SLUG} />
    </>
  );
}
