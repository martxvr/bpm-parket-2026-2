import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Image from 'next/image';
import { Container } from '@/components/ui/Container';
import { Button } from '@/components/ui/Button';
import { StructuredData } from '@/components/marketing/StructuredData';
import { getProjectBySlug } from '@/lib/db/projects';
import { projectSchema } from '@/lib/seo';

type Props = { params: Promise<{ slug: string }> };

const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL || 'https://bpmparket.nl';

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const p = await getProjectBySlug(slug);
  return {
    title: p?.title ?? 'Project',
    description: p?.description ?? undefined,
    alternates: { canonical: `${SITE_URL}/projecten/${slug}` },
  };
}

export default async function ProjectDetailPage({ params }: Props) {
  const { slug } = await params;
  const project = await getProjectBySlug(slug);
  if (!project) notFound();

  return (
    <>
      <StructuredData
        schema={projectSchema({
          title: project.title,
          description: project.description ?? project.title,
          slug: project.slug,
          imageUrl: project.image_url,
          completedDate: project.completed_date,
          location: project.location,
        })}
      />
      {project.image_url && (
        <div className="relative h-72 md:h-[480px]">
          <Image
            src={project.image_url}
            alt={project.title}
            fill
            sizes="100vw"
            className="object-cover"
            priority
          />
        </div>
      )}

      <Container size="narrow" className="py-12 md:py-16">
        <h1 className="heading-display text-3xl md:text-4xl">{project.title}</h1>
        {project.location && (
          <p className="mt-2 text-sm text-black/60">{project.location}</p>
        )}

        <dl className="mt-8 grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
          {project.area_size && (
            <div>
              <dt className="text-black/50">Oppervlak</dt>
              <dd className="font-medium">{project.area_size} m²</dd>
            </div>
          )}
          {project.floor_type && (
            <div>
              <dt className="text-black/50">Type</dt>
              <dd className="font-medium">{project.floor_type}</dd>
            </div>
          )}
          {project.completed_date && (
            <div>
              <dt className="text-black/50">Opgeleverd</dt>
              <dd className="font-medium">
                {new Date(project.completed_date).toLocaleDateString('nl-NL', {
                  month: 'long',
                  year: 'numeric',
                })}
              </dd>
            </div>
          )}
        </dl>

        {project.long_description && (
          <p className="mt-8 text-base leading-relaxed text-black/80 whitespace-pre-line">
            {project.long_description}
          </p>
        )}

        {project.gallery_image_urls.length > 0 && (
          <div className="mt-12 grid grid-cols-2 gap-3">
            {project.gallery_image_urls.map((url, i) => (
              <div key={i} className="relative aspect-square rounded-xl overflow-hidden">
                <Image src={url} alt="" fill sizes="50vw" className="object-cover" />
              </div>
            ))}
          </div>
        )}

        <div className="mt-12 pt-8 border-t border-black/10 text-center">
          <p className="text-black/70">Wil je iets soortgelijks?</p>
          <Button href="/offerte" className="mt-3">Vraag een offerte aan</Button>
        </div>
      </Container>
    </>
  );
}
