import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { StructuredData } from '@/components/marketing/StructuredData';
import { BrandHeroSection } from '@/components/marketing/brand/BrandHeroSection';
import { ProductGridCard } from '@/components/marketing/brand/ProductGridCard';
import { MoodGalleryStrip } from '@/components/marketing/brand/MoodGalleryStrip';
import { PortfolioCTASection } from '@/components/marketing/brand/PortfolioCTASection';
import { TrustBadgesSection } from '@/components/marketing/brand/TrustBadgesSection';
import { PeerBrandsSection } from '@/components/marketing/brand/PeerBrandsSection';
import { BrandCTASection } from '@/components/marketing/brand/BrandCTASection';
import {
  getBrandBySlug,
  getBrandImagesForBrand,
  getPeerBrandsByServiceId,
} from '@/lib/db/brands';
import { getProductsForBrand } from '@/lib/db/products';
import { getServices } from '@/lib/db/services';
import { brandSchema } from '@/lib/seo';

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

  const serviceById = new Map(services.map((s) => [s.id, s]));

  // Unique services this brand sells in (preserve sort order from services list)
  const brandServiceIds = [...new Set(products.map((p) => p.service_id))];
  const brandServices = brandServiceIds
    .map((id) => serviceById.get(id))
    .filter((s): s is NonNullable<typeof s> => Boolean(s));

  // Peer brands per service (parallel)
  const peerBrandsByService = await Promise.all(
    brandServices.map(async (s) => ({
      service: s,
      peers: await getPeerBrandsByServiceId(brand.id, s.id),
    })),
  );

  const heroVisualUrl = images[0]?.image_url ?? null;
  const moodImages =
    images.length > 1 ? images.slice(1, 5) : images.slice(0, 4);

  return (
    <>
      <StructuredData schema={brandSchema(brand)} />

      <BrandHeroSection
        brand={brand}
        serviceTags={brandServices.map((s) => ({
          slug: s.slug,
          title: s.title,
        }))}
        heroVisualUrl={heroVisualUrl}
      />

      {products.length > 0 && (
        <section className="bg-white py-24">
          <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
            <h2 className="text-4xl md:text-5xl font-bold text-brand-dark tracking-tight">
              {brand.name} <span className="text-brand-red">producten</span>
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10 mt-16">
              {products.map((p) => (
                <ProductGridCard
                  key={p.id}
                  product={p}
                  brandSlug={brand.slug}
                />
              ))}
            </div>
          </div>
        </section>
      )}

      <MoodGalleryStrip brandName={brand.name} images={moodImages} />

      <PortfolioCTASection brandName={brand.name} />

      <TrustBadgesSection brandName={brand.name} />

      {peerBrandsByService.map(({ service, peers }) => (
        <PeerBrandsSection
          key={service.id}
          serviceTitle={service.title}
          serviceSlug={service.slug}
          brands={peers}
        />
      ))}

      <BrandCTASection brandName={brand.name} brandSlug={brand.slug} />
    </>
  );
}
