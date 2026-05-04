import type { Metadata } from 'next';
import { ServicePage } from '@/components/marketing/ServicePageTemplate';
import { getServiceBySlug } from '@/lib/db/services';

const SLUG = 'traprenovatie';

export async function generateMetadata(): Promise<Metadata> {
  const s = await getServiceBySlug(SLUG);
  return {
    title: s?.meta_title ?? s?.title,
    description: s?.meta_description ?? undefined,
  };
}

export default function Page() {
  return <ServicePage slug={SLUG} />;
}
