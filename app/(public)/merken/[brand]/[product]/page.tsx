import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowLeft, Download } from 'lucide-react';
import { Container } from '@/components/ui/Container';
import { Button } from '@/components/ui/Button';
import { Markdown } from '@/components/marketing/Markdown';
import { ProductSpecs } from '@/components/marketing/ProductSpecs';
import { DecorGrid } from '@/components/marketing/DecorGrid';
import { getBrandBySlug } from '@/lib/db/brands';
import { getProductBySlugs } from '@/lib/db/products';

type Props = { params: Promise<{ brand: string; product: string }> };

const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL || 'https://bpmparket.nl';

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { brand: brandSlug, product: productSlug } = await params;
  const product = await getProductBySlugs(brandSlug, productSlug);
  const brand = await getBrandBySlug(brandSlug);
  return {
    title: product ? `${brand?.name ?? ''} ${product.name}`.trim() : 'Product',
    description: product?.description?.slice(0, 160) ?? undefined,
    alternates: {
      canonical: `${SITE_URL}/merken/${brandSlug}/${productSlug}`,
    },
  };
}

export default async function ProductDetailPage({ params }: Props) {
  const { brand: brandSlug, product: productSlug } = await params;
  const [brand, product] = await Promise.all([
    getBrandBySlug(brandSlug),
    getProductBySlugs(brandSlug, productSlug),
  ]);
  if (!brand || !product) notFound();

  return (
    <>
      {/* Product JSON-LD wordt toegevoegd in Task 19 */}

      <Container className="py-8">
        <Link
          href={`/merken/${brand.slug}`}
          className="inline-flex items-center gap-2 text-sm text-black/60 hover:text-black"
        >
          <ArrowLeft className="h-4 w-4" /> Alle {brand.name} producten
        </Link>
      </Container>

      <Container className="grid grid-cols-1 lg:grid-cols-2 gap-12 pb-12">
        {product.hero_image && (
          <div className="relative aspect-[4/3] rounded-2xl overflow-hidden">
            <Image
              src={product.hero_image}
              alt={product.name}
              fill
              sizes="(max-width: 1024px) 100vw, 50vw"
              className="object-cover"
              priority
            />
          </div>
        )}
        <div>
          <p className="text-sm text-[var(--color-brand-primary)]">{brand.name}</p>
          <h1 className="heading-display text-3xl md:text-4xl mt-1">
            {product.name}
          </h1>
          {product.description && (
            <div className="mt-4">
              <Markdown>{product.description}</Markdown>
            </div>
          )}

          <div className="mt-6 flex flex-wrap gap-3">
            <Button href={`/offerte?brand=${brand.slug}&product=${product.slug}`}>
              Vraag offerte aan
            </Button>
            <Button href="/showroom" variant="outline">
              Bezoek showroom
            </Button>
            {product.spec_sheet_url && (
              <Link
                href={product.spec_sheet_url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-5 py-2.5 text-sm hover:underline"
              >
                <Download className="h-4 w-4" /> Productblad PDF
              </Link>
            )}
          </div>
        </div>
      </Container>

      {Object.keys(product.specs).length > 0 && (
        <Container size="narrow" className="py-12">
          <h2 className="heading-display text-2xl mb-6">Specificaties</h2>
          <ProductSpecs specs={product.specs} />
        </Container>
      )}

      {product.decors.length > 0 && (
        <Container className="py-12">
          <h2 className="heading-display text-2xl mb-6">Kleuren & decors</h2>
          <DecorGrid decors={product.decors} />
          <p className="text-xs text-black/50 mt-4">
            Kom langs in de showroom om alle decors in het echt te bekijken.
          </p>
        </Container>
      )}

      {product.gallery_image_urls.length > 0 && (
        <Container className="py-12">
          <h2 className="heading-display text-2xl mb-6">In gebruik</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {product.gallery_image_urls.map((url, i) => (
              <div
                key={i}
                className="relative aspect-[4/3] rounded-xl overflow-hidden bg-black/5"
              >
                <Image
                  src={url}
                  alt=""
                  fill
                  sizes="(max-width: 768px) 50vw, 400px"
                  className="object-cover"
                />
              </div>
            ))}
          </div>
        </Container>
      )}
    </>
  );
}
