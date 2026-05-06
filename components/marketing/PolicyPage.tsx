import { notFound } from 'next/navigation';
import { Markdown } from '@/components/marketing/Markdown';
import { getPolicyBySlug } from '@/lib/db/policies';

export async function PolicyPage({ slug }: { slug: string }) {
  const policy = await getPolicyBySlug(slug);
  if (!policy) notFound();

  const lastUpdated = new Date(policy.last_updated).toLocaleDateString('nl-NL', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });

  return (
    <div className="bg-white min-h-screen pt-32 pb-20">
      <div className="max-w-4xl mx-auto px-6 sm:px-8">
        <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">{policy.title}</h1>
        <p className="text-sm text-gray-400 mb-12">Laatst bijgewerkt: {lastUpdated}</p>

        <div className="prose prose-lg prose-gray max-w-none">
          <Markdown>{policy.content_md}</Markdown>
        </div>
      </div>
    </div>
  );
}
