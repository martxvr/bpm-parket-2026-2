import { notFound } from 'next/navigation';
import Image from 'next/image';
import { Container } from '@/components/ui/Container';
import { Button } from '@/components/ui/Button';
import { Markdown } from '@/components/marketing/Markdown';
import { getServiceBySlug } from '@/lib/db/services';

export async function ServicePage({ slug }: { slug: string }) {
  const service = await getServiceBySlug(slug);
  if (!service) notFound();

  return (
    <>
      <section className="bg-[var(--color-brand-charcoal)] text-white">
        <Container className="py-16 md:py-24">
          <h1 className="heading-display text-4xl md:text-5xl">{service.title}</h1>
          {service.meta_description && (
            <p className="mt-4 max-w-2xl text-white/70">
              {service.meta_description}
            </p>
          )}
          <div className="mt-6 flex gap-3">
            <Button href="/offerte">Vraag offerte aan</Button>
            <Button
              href="/showroom"
              variant="outline"
              className="border-white/20 text-white hover:bg-white/10"
            >
              Plan showroombezoek
            </Button>
          </div>
        </Container>
      </section>

      {service.hero_image && (
        <div className="relative h-72 md:h-96">
          <Image
            src={service.hero_image}
            alt={service.title}
            fill
            sizes="100vw"
            className="object-cover"
            priority
          />
        </div>
      )}

      <Container size="narrow" className="py-12 md:py-16">
        {service.body_md && <Markdown>{service.body_md}</Markdown>}
      </Container>
    </>
  );
}
