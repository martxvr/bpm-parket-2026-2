import type { Metadata } from 'next';
import Link from 'next/link';
import Image from 'next/image';
import { Container } from '@/components/ui/Container';
import { getProjects } from '@/lib/db/projects';

export const metadata: Metadata = {
  title: 'Projecten',
  description: 'Bekijk een greep uit onze recente parket-, PVC- en traprenovatieprojecten.',
};

export default async function ProjectsListingPage() {
  const projects = await getProjects();

  return (
    <Container className="py-16 md:py-24">
      <h1 className="heading-display text-4xl md:text-5xl">Projecten</h1>
      <p className="mt-3 text-black/70 max-w-2xl">
        Een greep uit ons werk in Zuidoost-Brabant.
      </p>

      {projects.length === 0 ? (
        <div className="mt-12 rounded-2xl border border-black/10 p-12 text-center">
          <p className="text-black/60">
            Onze nieuwste projecten worden binnenkort hier getoond.
          </p>
        </div>
      ) : (
        <div className="mt-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {projects.map((p) => (
            <Link
              key={p.id}
              href={`/projecten/${p.slug}`}
              className="group block rounded-2xl overflow-hidden"
            >
              {p.image_url && (
                <div className="relative aspect-[4/3]">
                  <Image
                    src={p.image_url}
                    alt={p.title}
                    fill
                    sizes="(max-width: 768px) 100vw, 33vw"
                    className="object-cover group-hover:scale-105 transition-transform"
                  />
                </div>
              )}
              <div className="pt-3">
                <h2 className="font-medium">{p.title}</h2>
                {p.location && (
                  <p className="text-xs text-black/50 mt-0.5">{p.location}</p>
                )}
              </div>
            </Link>
          ))}
        </div>
      )}
    </Container>
  );
}
