import Link from 'next/link';
import Image from 'next/image';
import type { Product } from '@/lib/db/products';
import type { Brand } from '@/lib/db/brands';

export function ProductCard({ product, brand }: { product: Product; brand: Brand }) {
  return (
    <Link
      href={`/merken/${brand.slug}/${product.slug}`}
      className="group block rounded-2xl overflow-hidden bg-white shadow-sm hover:shadow-md transition"
    >
      {product.hero_image ? (
        <div className="relative aspect-[4/3]">
          <Image
            src={product.hero_image}
            alt={product.name}
            fill
            sizes="(max-width: 768px) 100vw, 33vw"
            className="object-cover group-hover:scale-105 transition-transform"
          />
        </div>
      ) : (
        <div className="aspect-[4/3] bg-gradient-to-br from-[var(--color-brand-red-light)]/30 to-[var(--color-brand-light)]" />
      )}
      <div className="p-4">
        <h3 className="font-medium">{product.name}</h3>
        {product.description && (
          <p className="text-sm text-black/60 mt-1 line-clamp-2">
            {product.description.replace(/[#*_]/g, '').slice(0, 100)}…
          </p>
        )}
      </div>
    </Link>
  );
}
