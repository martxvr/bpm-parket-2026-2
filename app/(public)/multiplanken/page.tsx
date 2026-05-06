import type { Metadata } from 'next';
import { BrandCards } from '@/components/marketing/BrandCards';
import { ServicePage } from '@/components/marketing/ServicePageTemplate';
import { StructuredData } from '@/components/marketing/StructuredData';
import { getServiceBySlug } from '@/lib/db/services';
import { serviceSchema } from '@/lib/seo';

const SLUG = 'multiplanken';
const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://bpmparket.nl';

export async function generateMetadata(): Promise<Metadata> {
  const s = await getServiceBySlug(SLUG);
  return {
    title: s?.meta_title ?? s?.title,
    description: s?.meta_description ?? undefined,
    alternates: { canonical: `${SITE_URL}/${SLUG}` },
  };
}

export default async function Page() {
  const service = await getServiceBySlug(SLUG);
  return (
    <>
      {service && (
        <StructuredData
          schema={serviceSchema({
            name: service.title,
            description: service.meta_description ?? service.title,
            slug: SLUG,
            imageUrl: service.hero_image ?? undefined,
          })}
        />
      )}
      <ServicePage slug={SLUG} />
      <BrandCards serviceSlug={SLUG} />
    </>
  );
}
