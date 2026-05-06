import Link from 'next/link';
import Image from 'next/image';
import { Container } from '@/components/ui/Container';
import { getBrandsByService } from '@/lib/db/brands';

export async function BrandCards({ serviceSlug }: { serviceSlug: string }) {
  const brands = await getBrandsByService(serviceSlug);
  if (brands.length === 0) return null;

  return (
    <Container className="py-12 md:py-16 border-t border-black/5 mt-12">
      <h2 className="heading-display text-2xl md:text-3xl">
        Merken die we voor deze categorie voeren
      </h2>
      <p className="mt-2 text-sm text-black/60">Bekijk de collectie per merk.</p>
      <div className="mt-6 grid grid-cols-2 md:grid-cols-4 gap-4">
        {brands.map((b) => (
          <Link
            key={b.id}
            href={`/merken/${b.slug}`}
            className="group block rounded-2xl bg-white p-5 shadow-sm hover:shadow-md transition"
          >
            {b.logo_url ? (
              <div className="relative h-12 mb-3">
                <Image
                  src={b.logo_url}
                  alt={b.name}
                  fill
                  sizes="160px"
                  className="object-contain object-left"
                />
              </div>
            ) : (
              <div className="h-12 mb-3 flex items-center text-lg font-semibold">
                {b.name}
              </div>
            )}
            <p className="font-medium text-sm">{b.name}</p>
          </Link>
        ))}
      </div>
    </Container>
  );
}
