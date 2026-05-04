import type { Metadata } from 'next';
import { PolicyPage } from '@/components/marketing/PolicyPage';
import { getPolicyBySlug } from '@/lib/db/policies';

const SLUG = 'algemene-voorwaarden';

export async function generateMetadata(): Promise<Metadata> {
  const p = await getPolicyBySlug(SLUG);
  return { title: p?.title ?? 'Beleid' };
}

export default function Page() {
  return <PolicyPage slug={SLUG} />;
}
