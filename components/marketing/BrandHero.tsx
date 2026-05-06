import Image from 'next/image';
import Link from 'next/link';
import { Button } from '@/components/ui/Button';
import { Container } from '@/components/ui/Container';
import { Markdown } from '@/components/marketing/Markdown';
import { ExternalLink } from 'lucide-react';
import type { Brand } from '@/lib/db/brands';

export function BrandHero({ brand }: { brand: Brand }) {
  return (
    <section className="relative bg-[var(--color-brand-charcoal)] text-white overflow-hidden">
      {brand.hero_image && (
        <div className="absolute inset-0">
          <Image
            src={brand.hero_image}
            alt=""
            fill
            sizes="100vw"
            className="object-cover opacity-40"
            priority
          />
        </div>
      )}
      <Container className="relative py-16 md:py-24">
        {brand.logo_url && (
          <div className="relative h-12 w-48 mb-4">
            <Image
              src={brand.logo_url}
              alt={brand.name}
              fill
              sizes="200px"
              className="object-contain object-left brightness-0 invert"
            />
          </div>
        )}
        <h1 className="heading-display text-4xl md:text-5xl">{brand.name}</h1>
        {brand.description && (
          <div className="mt-4 max-w-2xl text-white/85">
            <Markdown>{brand.description}</Markdown>
          </div>
        )}
        <div className="mt-6 flex flex-wrap gap-3">
          <Button href={`/offerte?brand=${brand.slug}`}>
            Vraag offerte aan voor {brand.name}
          </Button>
          {brand.website_url && (
            <Link
              href={brand.website_url}
              target="_blank"
              rel="noopener noreferrer nofollow"
              className="inline-flex items-center gap-2 px-5 py-2.5 text-sm border border-white/20 rounded-full hover:bg-white/10"
            >
              Officiële website <ExternalLink className="h-4 w-4" />
            </Link>
          )}
        </div>
      </Container>
    </section>
  );
}
