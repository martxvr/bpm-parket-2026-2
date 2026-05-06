import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowUpRight, MapPin, Maximize2 } from 'lucide-react';
import { RevealOnScroll } from '@/components/marketing/home/RevealOnScroll';
import { getProjects } from '@/lib/db/projects';

export const metadata: Metadata = {
  title: 'Projecten',
  description:
    'Bekijk een greep uit onze recente parket-, PVC- en traprenovatieprojecten in Zuidoost-Brabant.',
};

export default async function ProjectsListingPage() {
  const projects = await getProjects();

  return (
    <div className="bg-white min-h-screen py-20">
      <RevealOnScroll />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Projects Section */}
        <div className="text-center mb-16 reveal">
          <span className="text-sm font-semibold tracking-wider text-gray-900 uppercase">Portfolio</span>
          <h2 className="mt-2 text-4xl font-bold text-gray-900">Ontdek ons meest impactvolle werk</h2>
          <p className="mt-4 text-xl text-gray-600 max-w-2xl mx-auto">
            Van strakke woonkamers tot robuuste fabriekshallen. Bekijk hieronder een selectie van onze projecten.
          </p>
        </div>

        {projects.length === 0 ? (
          <div className="rounded-2xl border border-black/10 p-12 text-center reveal">
            <p className="text-black/60">Onze nieuwste projecten worden binnenkort hier getoond.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {projects.map((project, idx) => {
              const delay = `delay-${(idx % 2 + 1) * 100}`;
              const dateLabel = project.completed_date
                ? new Date(project.completed_date).toLocaleDateString('nl-NL', {
                    month: 'long',
                    year: 'numeric',
                  })
                : '';

              return (
                <Link
                  key={project.id}
                  href={`/projecten/${project.slug}`}
                  className={`group relative bg-white rounded-3xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 reveal ${delay} cursor-pointer block`}
                >
                  {/* Image */}
                  <div className="relative h-[400px] overflow-hidden">
                    {project.image_url && (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={project.image_url}
                        alt={project.title}
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                      />
                    )}
                    <div className="absolute inset-0 bg-black/10 group-hover:bg-black/20 transition-colors" />

                    {/* Floating Tags on Image */}
                    <div className="absolute bottom-6 left-6 flex space-x-3">
                      {project.location && (
                        <div className="bg-white/90 backdrop-blur px-3 py-1.5 rounded-full text-xs font-semibold flex items-center">
                          <MapPin className="w-3 h-3 mr-1" /> {project.location}
                        </div>
                      )}
                      {project.area_size && (
                        <div className="bg-white/90 backdrop-blur px-3 py-1.5 rounded-full text-xs font-semibold flex items-center">
                          <Maximize2 className="w-3 h-3 mr-1" /> {project.area_size} m²
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Content */}
                  <div className="p-8">
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <h3 className="text-2xl font-bold text-gray-900 mb-2">{project.title}</h3>
                        {dateLabel && <p className="text-gray-500 text-sm">{dateLabel}</p>}
                      </div>
                      <span className="bg-gray-900 text-white p-3 rounded-full opacity-0 group-hover:opacity-100 transform translate-y-4 group-hover:translate-y-0 transition-all duration-300">
                        <ArrowUpRight className="h-5 w-5" />
                      </span>
                    </div>
                    {project.description && (
                      <p className="text-gray-600 leading-relaxed line-clamp-2">
                        {project.description}
                      </p>
                    )}
                  </div>
                </Link>
              );
            })}
          </div>
        )}

      </div>
    </div>
  );
}
