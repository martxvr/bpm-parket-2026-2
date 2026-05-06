import type { Metadata } from 'next';
import Link from 'next/link';
import Image from 'next/image';
import { Container } from '@/components/ui/Container';
import { getActiveBrands } from '@/lib/db/brands';

const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL || 'https://bpmparket.nl';

export const metadata: Metadata = {
  title: 'Merken',
  description:
    'De merken die wij voeren — Sense, Joka, Douwes Dekker, Otium en meer.',
  alternates: { canonical: `${SITE_URL}/merken` },
};

export default async function BrandsIndexPage() {
  const brands = await getActiveBrands();

  return (
    <Container className="py-16 md:py-24">
      <h1 className="heading-display text-4xl md:text-5xl">Onze merken</h1>
      <p className="mt-3 text-black/70 max-w-2xl">
        We werken alleen met merken waar we zelf in geloven. Hieronder vind je
        de merken waarvan we vloeren leveren en leggen.
      </p>

      {brands.length === 0 ? (
        <div className="mt-12 rounded-2xl border border-dashed border-black/10 p-12 text-center text-sm text-black/60">
          Brand-overzicht volgt binnenkort.
        </div>
      ) : (
        <div className="mt-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {brands.map((b) => (
            <Link
              key={b.id}
              href={`/merken/${b.slug}`}
              className="group block rounded-2xl bg-white p-6 shadow-sm hover:shadow-md transition"
            >
              {b.logo_url ? (
                <div className="relative h-16 mb-4">
                  <Image
                    src={b.logo_url}
                    alt={b.name}
                    fill
                    sizes="200px"
                    className="object-contain object-left"
                  />
                </div>
              ) : (
                <div className="h-16 mb-4 flex items-center text-2xl font-semibold">
                  {b.name}
                </div>
              )}
              <h2 className="font-medium text-lg">{b.name}</h2>
              {b.description && (
                <p className="text-sm text-black/60 mt-1 line-clamp-2">
                  {b.description.replace(/[#*_]/g, '').slice(0, 120)}…
                </p>
              )}
            </Link>
          ))}
        </div>
      )}
    </Container>
  );
}
