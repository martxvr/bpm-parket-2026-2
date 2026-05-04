import Link from 'next/link';
import Image from 'next/image';
import { Container } from '@/components/ui/Container';
import { getServices } from '@/lib/db/services';

export async function ServicesGrid() {
  const services = await getServices();

  return (
    <Container className="py-16 md:py-24">
      <h2 className="heading-display text-3xl md:text-4xl">Onze diensten</h2>
      <p className="mt-3 text-black/70 max-w-2xl">
        Van traditioneel parket tot PVC: alles in eigen huis.
      </p>

      <div className="mt-10 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {services.map((s) => (
          <Link
            key={s.id}
            href={`/${s.slug}`}
            className="group block rounded-2xl overflow-hidden bg-white shadow-sm hover:shadow-md transition"
          >
            {s.hero_image ? (
              <div className="relative h-48">
                <Image
                  src={s.hero_image}
                  alt={s.title}
                  fill
                  sizes="(max-width: 768px) 100vw, 33vw"
                  className="object-cover group-hover:scale-105 transition-transform"
                />
              </div>
            ) : (
              <div className="h-48 bg-gradient-to-br from-[var(--color-brand-primary-light)]/30 to-[var(--color-brand-cream)]" />
            )}
            <div className="p-5">
              <h3 className="font-medium text-lg">{s.title}</h3>
              {s.meta_description && (
                <p className="text-sm text-black/60 mt-1 line-clamp-2">
                  {s.meta_description}
                </p>
              )}
            </div>
          </Link>
        ))}
      </div>
    </Container>
  );
}
