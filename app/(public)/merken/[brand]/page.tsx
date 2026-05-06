import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Image from 'next/image';
import { Container } from '@/components/ui/Container';
import { Button } from '@/components/ui/Button';
import { BrandHero } from '@/components/marketing/BrandHero';
import { ProductCard } from '@/components/marketing/ProductCard';
import {
  getBrandBySlug,
  getBrandImagesForBrand,
} from '@/lib/db/brands';
import { getProductsForBrand } from '@/lib/db/products';
import { getServices } from '@/lib/db/services';

type Props = { params: Promise<{ brand: string }> };

const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL || 'https://bpmparket.nl';

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { brand: slug } = await params;
  const brand = await getBrandBySlug(slug);
  return {
    title: brand?.name ?? 'Merk',
    description: brand?.description?.slice(0, 160) ?? undefined,
    alternates: { canonical: `${SITE_URL}/merken/${slug}` },
  };
}

export default async function BrandDetailPage({ params }: Props) {
  const { brand: slug } = await params;
  const brand = await getBrandBySlug(slug);
  if (!brand) notFound();

  const [images, products, services] = await Promise.all([
    getBrandImagesForBrand(brand.id),
    getProductsForBrand(brand.id),
    getServices(),
  ]);

  // Group products by service id
  const byService: Record<string, typeof products> = {};
  const serviceById = new Map(services.map((s) => [s.id, s]));
  for (const p of products) {
    (byService[p.service_id] ??= []).push(p);
  }

  return (
    <>
      {/* Brand JSON-LD wordt toegevoegd in Task 19 */}

      <BrandHero brand={brand} />

      {images.length > 0 && (
        <Container className="py-12">
          <h2 className="heading-display text-2xl mb-6">Sfeerbeelden</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
            {images.map((img) => (
              <div
                key={img.id}
                className="relative aspect-square rounded-xl overflow-hidden bg-black/5"
              >
                <Image
                  src={img.image_url}
                  alt={img.caption ?? ''}
                  fill
                  sizes="(max-width: 1024px) 33vw, 300px"
                  className="object-cover"
                />
              </div>
            ))}
          </div>
        </Container>
      )}

      {Object.entries(byService).map(([sid, prods]) => {
        const service = serviceById.get(sid);
        if (!service) return null;
        return (
          <Container key={sid} className="py-12">
            <h2 className="heading-display text-2xl mb-6">
              {brand.name} {service.title.toLowerCase()}
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {prods.map((p) => (
                <ProductCard key={p.id} product={p} brand={brand} />
              ))}
            </div>
          </Container>
        );
      })}

      {products.length === 0 && (
        <Container className="py-12">
          <div className="rounded-2xl border border-dashed border-black/10 p-12 text-center text-sm text-black/60">
            Productinformatie volgt binnenkort. Bel of mail ons voor de actuele
            collectie van {brand.name}.
          </div>
        </Container>
      )}

      <section className="bg-[var(--color-brand-cream)] py-16">
        <Container className="text-center">
          <h2 className="heading-display text-2xl md:text-3xl">
            Geïnteresseerd in {brand.name}?
          </h2>
          <p className="mt-3 text-black/70">
            Plan een showroombezoek of vraag vrijblijvend een offerte aan.
          </p>
          <div className="mt-6 flex justify-center gap-3">
            <Button href={`/offerte?brand=${brand.slug}`}>
              Offerte aanvragen
            </Button>
            <Button href="/showroom" variant="outline">
              Plan showroombezoek
            </Button>
          </div>
        </Container>
      </section>
    </>
  );
}
