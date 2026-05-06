import Image from 'next/image';
import Link from 'next/link';
import type { Product } from '@/lib/db/products';

type Props = {
  product: Product;
  brandSlug: string;
};

const MAX_SPECS = 8;

export function ProductGridCard({ product, brandSlug }: Props) {
  const specEntries = Object.entries(product.specs ?? {});
  const visibleSpecs = specEntries.slice(0, MAX_SPECS);
  const overflowCount = Math.max(0, specEntries.length - MAX_SPECS);
  const heroSrc = product.hero_image ?? product.gallery_image_urls?.[0] ?? null;

  return (
    <Link
      href={`/merken/${brandSlug}/${product.slug}`}
      className="group block"
    >
      <div className="relative aspect-[4/3] rounded-2xl overflow-hidden bg-brand-light">
        {heroSrc ? (
          <Image
            src={heroSrc}
            alt={product.name}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
            className="object-cover transition-transform duration-500 group-hover:scale-105"
          />
        ) : (
          <div className="w-full h-full bg-brand-light" />
        )}
      </div>

      <h3 className="text-2xl font-bold text-brand-dark mt-6 tracking-tight">
        {product.name}
      </h3>

      {product.description && (
        <p className="text-sm text-brand-dark/70 mt-2 line-clamp-3 leading-relaxed">
          {product.description}
        </p>
      )}

      {visibleSpecs.length > 0 && (
        <div className="mt-6">
          <p className="text-xs font-bold uppercase tracking-widest text-brand-red mb-3">
            Specificaties
          </p>
          <dl className="grid grid-cols-[auto_1fr] gap-x-4 gap-y-2 text-sm">
            {visibleSpecs.map(([key, value]) => (
              <div key={key} className="contents">
                <dt className="text-brand-dark/60">{key}</dt>
                <dd className="text-brand-dark font-medium">{value}</dd>
              </div>
            ))}
          </dl>
          {overflowCount > 0 && (
            <p className="text-xs text-brand-red font-medium mt-3 group-hover:underline">
              + {overflowCount} meer specs
            </p>
          )}
        </div>
      )}
    </Link>
  );
}
