import { notFound } from 'next/navigation';
import { Container } from '@/components/ui/Container';
import { Markdown } from '@/components/marketing/Markdown';
import { getPolicyBySlug } from '@/lib/db/policies';

export async function PolicyPage({ slug }: { slug: string }) {
  const policy = await getPolicyBySlug(slug);
  if (!policy) notFound();

  return (
    <Container size="narrow" className="py-12 md:py-16">
      <h1 className="heading-display text-3xl md:text-4xl">{policy.title}</h1>
      <p className="mt-2 text-xs text-black/50">
        Laatst bijgewerkt:{' '}
        {new Date(policy.last_updated).toLocaleDateString('nl-NL', {
          day: 'numeric',
          month: 'long',
          year: 'numeric',
        })}
      </p>
      <article className="mt-8">
        <Markdown>{policy.content_md}</Markdown>
      </article>
    </Container>
  );
}
