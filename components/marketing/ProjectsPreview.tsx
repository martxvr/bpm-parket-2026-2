import Link from 'next/link';
import Image from 'next/image';
import { Container } from '@/components/ui/Container';
import { Button } from '@/components/ui/Button';
import { getFeaturedProjects } from '@/lib/db/projects';

export async function ProjectsPreview() {
  const projects = await getFeaturedProjects();
  if (projects.length === 0) return null;

  return (
    <section className="bg-white py-16 md:py-24">
      <Container>
        <div className="flex items-end justify-between mb-10">
          <div>
            <h2 className="heading-display text-3xl md:text-4xl">
              Recente projecten
            </h2>
            <p className="text-black/70 mt-2">Een greep uit ons werk.</p>
          </div>
          <Button href="/projecten" variant="ghost">
            Alle projecten →
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {projects.slice(0, 6).map((p) => (
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
                <h3 className="font-medium">{p.title}</h3>
                {p.location && (
                  <p className="text-xs text-black/50 mt-0.5">{p.location}</p>
                )}
              </div>
            </Link>
          ))}
        </div>
      </Container>
    </section>
  );
}
