import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ArrowLeft, ArrowRight, MapPin, Calendar, Maximize2, CheckCircle2 } from 'lucide-react';
import { StructuredData } from '@/components/marketing/StructuredData';
import { getProjectBySlug } from '@/lib/db/projects';
import { projectSchema } from '@/lib/seo';

type Props = { params: Promise<{ slug: string }> };

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://bpmparket.nl';

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

  const description =
    project.long_description ||
    (project.description
      ? `${project.description} Dit project vertegenwoordigt onze toewijding aan kwaliteit en detail.`
      : 'Dit project vertegenwoordigt onze toewijding aan kwaliteit en detail.');

  const techniques = project.techniques?.length
    ? project.techniques
    : [
        'Voorbereiding ondervloer',
        'Primer applicatie',
        'Gietvloer applicatie',
        'Topcoating afwerking',
      ];

  const dateLabel = project.completed_date
    ? new Date(project.completed_date).toLocaleDateString('nl-NL', {
        month: 'long',
        year: 'numeric',
      })
    : null;

  return (
    <div className="bg-white">
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

      {/* Hero Image */}
      <div className="relative h-[40vh] sm:h-[50vh] w-full">
        {project.image_url && (
          /* eslint-disable-next-line @next/next/no-img-element */
          <img
            src={project.image_url}
            alt={project.title}
            className="w-full h-full object-cover"
          />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />

        <div className="absolute top-6 left-6 sm:left-12">
          <Link
            href="/projecten"
            className="inline-flex items-center gap-2 bg-white/50 hover:bg-white backdrop-blur-md px-4 py-2 rounded-full text-black text-sm font-medium transition-all shadow-sm"
          >
            <ArrowLeft size={16} /> Terug
          </Link>
        </div>

        <div className="absolute bottom-8 left-6 sm:left-12 text-white max-w-3xl">
          <span className="inline-block py-1 px-3 rounded-full bg-white/20 backdrop-blur-md border border-white/20 text-xs font-bold uppercase tracking-wider mb-4">
            Project Uitgelicht
          </span>
          <h1 className="text-3xl sm:text-5xl font-bold leading-tight">{project.title}</h1>
        </div>
      </div>

      {/* Content Body */}
      <div className="max-w-6xl mx-auto p-6 sm:p-12 grid grid-cols-1 lg:grid-cols-3 gap-12">

        {/* Left: Description */}
        <div className="lg:col-span-2 space-y-8">
          <div>
            <h3 className="text-xl font-bold text-gray-900 mb-4">Over dit project</h3>
            <p className="text-gray-500 leading-relaxed text-lg whitespace-pre-line">
              {description}
            </p>
          </div>

          <div className="bg-gray-50 rounded-2xl p-8 border border-gray-100">
            <h4 className="font-bold text-gray-900 mb-4">Toegepaste Technieken</h4>
            <ul className="space-y-3">
              {techniques.map((tech, index) => (
                <li key={index} className="flex items-start text-gray-600">
                  <CheckCircle2 className="w-5 h-5 text-black mr-3 shrink-0" />
                  <span>{tech}</span>
                </li>
              ))}
            </ul>
          </div>

          {project.gallery_image_urls && project.gallery_image_urls.length > 0 && (
            <div className="grid grid-cols-2 gap-3">
              {project.gallery_image_urls.map((url, i) => (
                <div key={i} className="relative aspect-square rounded-xl overflow-hidden">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={url} alt="" className="w-full h-full object-cover" />
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Right: Stats & CTA */}
        <div className="space-y-8">
          <div className="bg-white border border-gray-100 shadow-xl shadow-gray-100 rounded-2xl p-6 space-y-6">
            {project.location && (
              <>
                <div>
                  <div className="flex items-center text-gray-400 text-xs font-bold uppercase tracking-wider mb-1">
                    <MapPin className="w-4 h-4 mr-2" /> Locatie
                  </div>
                  <p className="text-lg font-bold text-gray-900">{project.location}</p>
                </div>
                <div className="h-px bg-gray-100 w-full"></div>
              </>
            )}

            {project.area_size && (
              <>
                <div>
                  <div className="flex items-center text-gray-400 text-xs font-bold uppercase tracking-wider mb-1">
                    <Maximize2 className="w-4 h-4 mr-2" /> Oppervlakte
                  </div>
                  <p className="text-lg font-bold text-gray-900">{project.area_size} m²</p>
                </div>
                <div className="h-px bg-gray-100 w-full"></div>
              </>
            )}

            {dateLabel && (
              <div>
                <div className="flex items-center text-gray-400 text-xs font-bold uppercase tracking-wider mb-1">
                  <Calendar className="w-4 h-4 mr-2" /> Oplevering
                </div>
                <p className="text-lg font-bold text-gray-900">{dateLabel}</p>
              </div>
            )}
          </div>

          <div className="bg-black text-white rounded-2xl p-8 text-center">
            <h4 className="text-xl font-bold mb-2">Interesse in zo&apos;n vloer?</h4>
            <p className="text-gray-400 text-sm mb-6">Wij realiseren dit ook graag voor uw project.</p>
            <Link
              href="/offerte"
              className="inline-flex w-full items-center justify-center gap-2 bg-white text-black hover:bg-gray-200 transition-colors font-bold rounded-full px-6 py-3"
            >
              Offerte Aanvragen <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>

      </div>
    </div>
  );
}
