import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import type { Brand } from '@/lib/db/brands';

type Props = {
  serviceTitle: string;
  serviceSlug: string;
  brands: Brand[];
};

export function PeerBrandsSection({ serviceTitle, serviceSlug, brands }: Props) {
  if (brands.length === 0) return null;

  return (
    <section className="bg-brand-light py-24">
      <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
        <div className="flex justify-between items-end gap-6">
          <div>
            <span className="inline-block bg-brand-red/10 text-brand-red text-xs font-bold uppercase tracking-widest px-3 py-1 rounded-full">
              Ontdek meer
            </span>
            <h2 className="text-3xl md:text-4xl font-bold text-brand-dark mt-4 tracking-tight">
              Andere merken in {serviceTitle}
            </h2>
          </div>
          <Link
            href={`/${serviceSlug}`}
            className="hidden md:inline-flex items-center text-brand-red font-bold hover:underline whitespace-nowrap pb-2"
          >
            Bekijk alle
            <ArrowRight className="ml-1 w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 mt-12">
          {brands.map((peer) => (
            <Link
              key={peer.id}
              href={`/merken/${peer.slug}`}
              className="group bg-white rounded-2xl p-8 flex items-center justify-center aspect-square hover:shadow-lg transition-shadow"
            >
              {peer.logo_url ? (
                <Image
                  src={peer.logo_url}
                  alt={peer.name}
                  width={120}
                  height={60}
                  className="object-contain max-h-16 group-hover:scale-105 transition-transform"
                />
              ) : (
                <span className="text-xl font-bold text-brand-dark text-center tracking-tight">
                  {peer.name}
                </span>
              )}
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
