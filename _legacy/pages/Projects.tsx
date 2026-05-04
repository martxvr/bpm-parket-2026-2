import React, { useEffect, useState, useRef } from 'react';
import { getProjects, getSettings, getGallery } from '../services/mockDatabase';
import { Project, GalleryImage } from '../types';
import { ArrowUpRight, MapPin, Maximize2 } from 'lucide-react';

interface ProjectsProps {
  onProjectSelect: (project: Project) => void;
}

const Projects: React.FC<ProjectsProps> = ({ onProjectSelect }) => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [gallery, setGallery] = useState<GalleryImage[]>([]);
  const [enableGallery, setEnableGallery] = useState(false);
  const [loading, setLoading] = useState(true);
  const observerRef = useRef<IntersectionObserver | null>(null);

  useEffect(() => {
    Promise.all([
        getProjects(),
        getSettings(),
        getGallery()
    ]).then(([projectsData, settingsData, galleryData]) => {
      setProjects(projectsData);
      setEnableGallery(settingsData.enablePhotoGallery);
      setGallery(galleryData);
      setLoading(false);
    });
  }, []);

  useEffect(() => {
    if (loading) return;

    const observerOptions = {
      threshold: 0.1,
      rootMargin: "0px 0px -50px 0px"
    };

    observerRef.current = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('reveal-active');
          observerRef.current?.unobserve(entry.target);
        }
      });
    }, observerOptions);

    const elements = document.querySelectorAll('.reveal');
    elements.forEach(el => observerRef.current?.observe(el));

    return () => observerRef.current?.disconnect();
  }, [loading, projects, gallery]);

  return (
    <div className="bg-white min-h-screen py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Projects Section */}
        <div className="text-center mb-16 reveal">
          <span className="text-sm font-semibold tracking-wider text-gray-900 uppercase">Portfolio</span>
          <h2 className="mt-2 text-4xl font-bold text-gray-900">Ontdek ons meest impactvolle werk</h2>
          <p className="mt-4 text-xl text-gray-600 max-w-2xl mx-auto">
            Van strakke woonkamers tot robuuste fabriekshallen. Bekijk hieronder een selectie van onze projecten.
          </p>
        </div>

        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {projects.map((project, idx) => (
              <div 
                key={project.id} 
                onClick={() => onProjectSelect(project)}
                className={`group relative bg-white rounded-3xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 reveal delay-${(idx % 2 + 1) * 100} cursor-pointer`}
              >
                {/* Image */}
                <div className="relative h-[400px] overflow-hidden">
                  <img 
                    src={project.imageUrl} 
                    alt={project.title} 
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-black/10 group-hover:bg-black/20 transition-colors" />
                  
                  {/* Floating Tags on Image */}
                  <div className="absolute bottom-6 left-6 flex space-x-3">
                    <div className="bg-white/90 backdrop-blur px-3 py-1.5 rounded-full text-xs font-semibold flex items-center">
                       <MapPin className="w-3 h-3 mr-1" /> {project.location}
                    </div>
                    <div className="bg-white/90 backdrop-blur px-3 py-1.5 rounded-full text-xs font-semibold flex items-center">
                       <Maximize2 className="w-3 h-3 mr-1" /> {project.areaSize} m²
                    </div>
                  </div>
                </div>

                {/* Content */}
                <div className="p-8">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="text-2xl font-bold text-gray-900 mb-2">{project.title}</h3>
                      <p className="text-gray-500 text-sm">{project.date}</p>
                    </div>
                    <button className="bg-gray-900 text-white p-3 rounded-full opacity-0 group-hover:opacity-100 transform translate-y-4 group-hover:translate-y-0 transition-all duration-300">
                      <ArrowUpRight className="h-5 w-5" />
                    </button>
                  </div>
                  <p className="text-gray-600 leading-relaxed line-clamp-2">
                    {project.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Optional Gallery Section */}
        {enableGallery && gallery.length > 0 && (
            <div className="mt-32 border-t border-gray-100 pt-24">
                <div className="text-center mb-12 reveal">
                    <span className="text-xs font-bold tracking-widest text-gray-400 uppercase">Impressie</span>
                    <h2 className="mt-2 text-3xl font-bold text-gray-900">Fotogalerij</h2>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                    {gallery.map((img, idx) => (
                        <div key={img.id} className={`reveal delay-${(idx % 4) * 100} group relative rounded-2xl overflow-hidden aspect-square cursor-zoom-in`}>
                            <img 
                                src={img.imageUrl} 
                                alt={img.caption || 'Gallery Image'} 
                                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                            />
                            {img.caption && (
                                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-4">
                                    <p className="text-white text-sm font-medium">{img.caption}</p>
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            </div>
        )}

      </div>
    </div>
  );
};

export default Projects;