import Image from 'next/image';
import type { BrandImage } from '@/lib/db/brands';

type Props = {
  brandName: string;
  images: BrandImage[];
};

export function MoodGalleryStrip({ brandName, images }: Props) {
  if (images.length === 0) return null;

  return (
    <section className="bg-white py-20">
      <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
        <span className="inline-block bg-brand-red/10 text-brand-red text-xs font-bold uppercase tracking-widest px-3 py-1 rounded-full">
          Inspiratie
        </span>
        <h2 className="text-4xl md:text-5xl font-bold text-brand-dark mt-4 tracking-tight">
          Sfeerbeelden
        </h2>
        <p className="text-base text-brand-dark/60 mt-3 max-w-2xl leading-relaxed">
          Zo komt {brandName} tot leven in een Nederlands interieur.
        </p>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-12">
          {images.slice(0, 4).map((img) => (
            <div
              key={img.id}
              className="relative aspect-[4/5] rounded-2xl overflow-hidden bg-brand-light"
            >
              <Image
                src={img.image_url}
                alt={img.caption ?? `${brandName} sfeerbeeld`}
                fill
                sizes="(max-width: 768px) 50vw, 25vw"
                className="object-cover"
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
