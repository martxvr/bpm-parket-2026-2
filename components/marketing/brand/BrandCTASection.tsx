import Link from 'next/link';

type Props = {
  brandName: string;
  brandSlug: string;
};

export function BrandCTASection({ brandName, brandSlug }: Props) {
  return (
    <section className="bg-black text-white py-24">
      <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
        <div className="text-center max-w-3xl mx-auto">
          <h2 className="text-4xl md:text-6xl font-bold tracking-tight">
            Interesse in {brandName}?
          </h2>
          <p className="text-lg text-white/70 mt-6 leading-relaxed">
            Plan een vrijblijvend showroombezoek of vraag direct een offerte aan.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center mt-10">
            <Link
              href={`/offerte?brand=${brandSlug}`}
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
      </div>
    </section>
  );
}
