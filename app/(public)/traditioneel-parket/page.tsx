import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowUpRight } from 'lucide-react';
import { BrandCards } from '@/components/marketing/BrandCards';
import { RevealOnScroll } from '@/components/marketing/home/RevealOnScroll';
import { StructuredData } from '@/components/marketing/StructuredData';
import { getServiceBySlug } from '@/lib/db/services';
import { serviceSchema } from '@/lib/seo';

const SLUG = 'traditioneel-parket';
const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://bpmparket.nl';

const FALLBACK_TITLE = 'Traditioneel Parket';
const FALLBACK_DESCRIPTION =
  'Een parketvloer is meer dan een vloer; het is een levenslange investering in comfort, stijl en warmte.';

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
              src="https://images.unsplash.com/photo-1541123437800-1bb1317badc2?auto=format&fit=crop&q=80&w=2000"
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
                Traditie & Vakmanschap
              </span>
              <h1 className="text-5xl lg:text-7xl font-bold text-white mb-8 leading-tight">
                Traditioneel <span className="text-brand-red">Parket</span>
              </h1>
              <p className="text-xl text-white/70 leading-relaxed mb-10">
                Een parketvloer is meer dan een vloer; het is een levenslange investering in comfort, stijl en warmte.
              </p>
              <Link
                href="/offerte"
                className="inline-flex items-center justify-center rounded-full font-medium transition-all duration-300 bg-brand-red text-white hover:bg-brand-red/90 px-9 py-4 text-base group"
              >
                Advies Gepland
                <ArrowUpRight className="ml-2 w-4 h-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
              </Link>
            </div>
          </div>
        </section>

        <section className="py-24 bg-white reveal">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
              <div>
                <h2 className="text-4xl font-bold mb-8">Traditioneel Parket</h2>
                <div className="space-y-6 text-gray-500 text-lg leading-relaxed">
                  <p>
                    Parketvloeren zijn niet zomaar een keuze; ze zijn een levenslange investering in comfort en stijl. Door hun natuurlijke samenstelling hebben parketvloeren een intrinsieke isolerende werking, waardoor uw voeten altijd een warm en behaaglijk gevoel ervaren, ongeacht het seizoen.
                  </p>
                  <p>
                    De ware charms van een parketvloer zit echter in de afwerking. Deze bepaalt de unieke esthetiek en uitstraling van de vloer. Wij bieden diverse afwerkingsmogelijkheden, zoals beitsen gecombineerd met oliën, lakken of speciale kleurolie.
                  </p>
                </div>
              </div>
              <div className="relative rounded-[3rem] overflow-hidden aspect-square">
                <Image
                  src="https://images.unsplash.com/photo-1541123437800-1bb1317badc2?auto=format&fit=crop&q=80&w=2000"
                  alt="Traditioneel Parket"
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
