import Image from 'next/image';
import Link from 'next/link';
import type { Brand } from '@/lib/db/brands';

type Props = {
  brand: Brand;
  serviceTags: { slug: string; title: string }[];
  heroVisualUrl: string | null;
};

export function BrandHeroSection({ brand, serviceTags, heroVisualUrl }: Props) {
  return (
    <section className="relative bg-black text-white overflow-hidden">
      {brand.hero_image && (
        <div className="absolute inset-0 pointer-events-none">
          <Image
            src={brand.hero_image}
            alt=""
            fill
            sizes="100vw"
            className="object-cover opacity-20"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black via-black/80 to-black/40" />
        </div>
      )}

      <div className="relative max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 py-20 md:py-24">
        <div className="grid lg:grid-cols-2 gap-12 items-center min-h-[600px]">
          {/* Left column */}
          <div>
            <nav
              aria-label="Breadcrumb"
              className="text-xs text-white/50 uppercase tracking-widest"
            >
              <Link href="/" className="hover:text-white">
                Home
              </Link>
              <span className="mx-2">/</span>
              <Link href="/merken" className="hover:text-white">
                Merken
              </Link>
              <span className="mx-2">/</span>
              <span className="text-white/80">{brand.name}</span>
            </nav>

            {serviceTags.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-6">
                {serviceTags.map((tag) => (
                  <span
                    key={tag.slug}
                    className="bg-white/10 text-white/80 px-3 py-1 rounded-full text-xs font-medium"
                  >
                    {tag.title}
                  </span>
                ))}
              </div>
            )}

            <h1 className="text-5xl md:text-7xl font-bold text-white tracking-tight mt-6">
              {brand.name}
            </h1>

            {brand.description && (
              <p className="text-lg text-white/70 max-w-xl mt-6 leading-relaxed">
                {brand.description}
              </p>
            )}

            <div className="flex flex-col sm:flex-row gap-4 mt-10">
              <Link
                href={`/offerte?brand=${brand.slug}`}
                className="inline-flex items-center justify-center bg-brand-red text-white px-8 py-4 rounded-full font-bold hover:bg-brand-red/90 transition-colors"
              >
                Offerte aanvragen
              </Link>
              <Link
                href="/showroom"
                className="inline-flex items-center justify-center border border-white/30 text-white px-8 py-4 rounded-full font-bold hover:bg-white hover:text-black transition-colors"
              >
                Plan showroombezoek
              </Link>
            </div>
          </div>

          {/* Right column */}
          <div className="relative">
            {heroVisualUrl ? (
              <div className="relative">
                <div className="relative aspect-[4/5] rounded-2xl overflow-hidden bg-white/5">
                  <Image
                    src={heroVisualUrl}
                    alt={`${brand.name} sfeerbeeld`}
                    fill
                    sizes="(max-width: 1024px) 100vw, 50vw"
                    className="object-cover"
                    priority
                  />
                </div>
                <div className="absolute -bottom-6 -left-6 sm:bottom-8 sm:left-8 bg-white p-6 rounded-2xl shadow-xl flex items-center justify-center min-w-[180px] min-h-[80px]">
                  {brand.logo_url ? (
                    <Image
                      src={brand.logo_url}
                      alt={brand.name}
                      width={140}
                      height={60}
                      className="object-contain max-h-12"
                    />
                  ) : (
                    <span className="text-2xl font-bold text-black tracking-tight">
                      {brand.name}
                    </span>
                  )}
                </div>
              </div>
            ) : (
              <div className="aspect-[4/5] rounded-2xl border border-white/10 bg-white/[0.02] flex items-center justify-center p-8">
                <span className="text-5xl md:text-6xl font-bold text-white/30 text-center tracking-tight leading-tight">
                  {brand.name}
                </span>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
