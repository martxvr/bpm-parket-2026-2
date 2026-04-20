"use client"

import React, { useEffect, useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { Calendar, ChevronLeft, ChevronRight } from 'lucide-react';
import XIcon from '@/components/ui/x-icon';
import MapPinIcon from '@/components/ui/map-pin-icon';
import ExpandIcon from '@/components/ui/expand-icon';
import ArrowNarrowRightIcon from '@/components/ui/arrow-narrow-right-icon';
import { Project } from '@/types';
import Button from '@/components/Button';

interface ProjectDetailProps {
  project: Project;
  onClose: () => void;
}

const ProjectDetail: React.FC<ProjectDetailProps> = ({ project, onClose }) => {
  const router = useRouter();

  const allImages = project.images && project.images.length > 0
    ? project.images
    : project.imageUrl ? [project.imageUrl] : [];

  const [mainIdx, setMainIdx] = useState(0);
  const [lightboxIdx, setLightboxIdx] = useState<number | null>(null);

  const lightboxGoNext = useCallback(() => {
    if (lightboxIdx === null || allImages.length === 0) return;
    setLightboxIdx((lightboxIdx + 1) % allImages.length);
  }, [lightboxIdx, allImages.length]);

  const lightboxGoPrev = useCallback(() => {
    if (lightboxIdx === null || allImages.length === 0) return;
    setLightboxIdx((lightboxIdx - 1 + allImages.length) % allImages.length);
  }, [lightboxIdx, allImages.length]);

  useEffect(() => {
    if (lightboxIdx === null) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight') lightboxGoNext();
      else if (e.key === 'ArrowLeft') lightboxGoPrev();
      else if (e.key === 'Escape') setLightboxIdx(null);
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [lightboxIdx, lightboxGoNext, lightboxGoPrev]);

  // Lock body scroll when modal is open
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, []);

  const description = project.longDescription || project.description;

  return (
    <div className="fixed inset-0 z-[60] flex items-end sm:items-center justify-center">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      ></div>

      {/* Modal Content */}
      <div className="relative w-full max-w-5xl h-[90vh] sm:h-[85vh] bg-white sm:rounded-3xl shadow-2xl overflow-y-auto overflow-x-hidden flex flex-col"
        style={{ animation: 'slideUp 0.5s cubic-bezier(0.16, 1, 0.3, 1)' }}
      >

        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-6 right-6 z-20 bg-white/50 hover:bg-white backdrop-blur-md p-3 rounded-full text-black transition-all hover:scale-110 shadow-sm"
        >
          <XIcon size={24} />
        </button>

        {/* Hero Image + Gallery */}
        <div className="shrink-0">
          <div
            className="relative h-[40vh] sm:h-[50vh] w-full cursor-zoom-in group/main"
            onClick={() => allImages.length > 0 && setLightboxIdx(mainIdx)}
          >
            {allImages[mainIdx] && (
              <img
                src={allImages[mainIdx]}
                alt={project.title}
                className="w-full h-full object-cover transition-transform duration-700 group-hover/main:scale-[1.02]"
              />
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent pointer-events-none"></div>

            {/* Prev/Next arrows on main image */}
            {allImages.length > 1 && (
              <>
                <button
                  onClick={(e) => { e.stopPropagation(); setMainIdx((mainIdx - 1 + allImages.length) % allImages.length); }}
                  className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white p-2 rounded-full shadow-md transition-all z-10"
                >
                  <ChevronLeft className="w-5 h-5 text-gray-900" />
                </button>
                <button
                  onClick={(e) => { e.stopPropagation(); setMainIdx((mainIdx + 1) % allImages.length); }}
                  className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white p-2 rounded-full shadow-md transition-all z-10"
                >
                  <ChevronRight className="w-5 h-5 text-gray-900" />
                </button>
                <div className="absolute top-4 left-4 bg-white/80 backdrop-blur-md px-3 py-1 rounded-full text-xs font-bold text-gray-900 shadow-sm">
                  {mainIdx + 1} / {allImages.length}
                </div>
              </>
            )}

            <div className="absolute bottom-8 left-6 sm:left-12 text-white pointer-events-none">
              <span className="inline-block py-1 px-3 rounded-full bg-white/20 backdrop-blur-md border border-white/20 text-xs font-bold uppercase tracking-wider mb-4">
                Project Uitgelicht
              </span>
              <h2 className="text-3xl sm:text-5xl font-bold leading-tight">{project.title}</h2>
            </div>
          </div>

          {/* Thumbnail strip */}
          {allImages.length > 1 && (
            <div className="px-6 sm:px-12 py-4 bg-gray-50 border-y border-gray-100">
              <div className="flex gap-2 overflow-x-auto no-scrollbar">
                {allImages.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setMainIdx(idx)}
                    className={`relative h-16 w-20 sm:h-20 sm:w-24 rounded-lg overflow-hidden flex-shrink-0 transition-all ${
                      idx === mainIdx ? 'ring-2 ring-brand-primary scale-105' : 'opacity-60 hover:opacity-100'
                    }`}
                  >
                    <img src={img} alt="" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Content Body */}
        <div className="p-6 sm:p-12 grid grid-cols-1 lg:grid-cols-3 gap-12 bg-white">

          {/* Left: Description */}
          <div className="lg:col-span-2 space-y-8">
            <div>
              <h3 className="text-xl font-bold text-gray-900 mb-4">Over dit project</h3>
              <p className="text-gray-500 leading-relaxed text-lg whitespace-pre-line">
                {description}
              </p>
            </div>

            {project.techniques && project.techniques.length > 0 && (
              <div className="bg-gray-50 rounded-2xl p-8 border border-gray-100">
                <h4 className="font-bold text-gray-900 mb-4">Toegepaste Technieken</h4>
                <ul className="space-y-3">
                  {project.techniques.map((tech, index) => (
                    <li key={index} className="flex items-start text-gray-600">
                      <span className="w-1.5 h-1.5 rounded-full bg-brand-primary mt-2.5 mr-3 shrink-0" />
                      <span>{tech}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          {/* Right: Stats & CTA */}
          <div className="space-y-8">
            <div className="bg-white border border-gray-100 shadow-xl shadow-gray-100 rounded-2xl p-6 space-y-6">
              <div>
                <div className="flex items-center text-gray-400 text-xs font-bold uppercase tracking-wider mb-1">
                  <MapPinIcon size={16} className="mr-2" /> Locatie
                </div>
                <p className="text-lg font-bold text-gray-900">{project.location}</p>
              </div>

              <div className="h-px bg-gray-100 w-full"></div>

              <div>
                <div className="flex items-center text-gray-400 text-xs font-bold uppercase tracking-wider mb-1">
                  <ExpandIcon size={16} className="mr-2" /> Oppervlakte
                </div>
                <p className="text-lg font-bold text-gray-900">{project.areaSize} m²</p>
              </div>

              <div className="h-px bg-gray-100 w-full"></div>

              <div>
                <div className="flex items-center text-gray-400 text-xs font-bold uppercase tracking-wider mb-1">
                  <Calendar className="w-4 h-4 mr-2" /> Oplevering
                </div>
                <p className="text-lg font-bold text-gray-900">{project.date}</p>
              </div>
            </div>

            <div className="bg-black text-white rounded-3xl p-8 text-center border border-white/10 shadow-2xl">
              <h4 className="text-2xl font-bold mb-3">Interesse in zo&apos;n vloer?</h4>
              <p className="text-gray-300 text-sm mb-8 leading-relaxed">
                Wij realiseren dit ook graag voor uw project. Vraag vandaag nog een vrijblijvende offerte aan.
              </p>
              <Button
                variant="primary"
                size="lg"
                fullWidth
                className="shadow-lg shadow-brand-primary/20 transform hover:scale-[1.02] active:scale-[0.98]"
                onClick={() => {
                  onClose();
                  router.push('/offerte');
                }}
              >
                Offerte Aanvragen <ArrowNarrowRightIcon size={20} className="ml-2" />
              </Button>
            </div>
          </div>

        </div>

      </div>

      {/* Lightbox */}
      {lightboxIdx !== null && allImages[lightboxIdx] && (
        <div
          className="fixed inset-0 z-[70] flex items-center justify-center bg-black/95 p-4 sm:p-8 backdrop-blur-sm"
          onClick={() => setLightboxIdx(null)}
        >
          <button
            className="absolute top-6 right-6 text-white/50 hover:text-white bg-white/10 hover:bg-brand-primary p-3 rounded-full backdrop-blur-md z-50 transition-all"
            onClick={(e) => { e.stopPropagation(); setLightboxIdx(null); }}
          >
            <XIcon size={24} />
          </button>

          {allImages.length > 1 && (
            <>
              <button
                className="absolute left-4 sm:left-8 top-1/2 -translate-y-1/2 text-white/50 hover:text-white bg-white/10 hover:bg-white/20 p-3 rounded-full backdrop-blur-md z-50 transition-all"
                onClick={(e) => { e.stopPropagation(); lightboxGoPrev(); }}
              >
                <ChevronLeft className="w-6 h-6" />
              </button>
              <button
                className="absolute right-4 sm:right-8 top-1/2 -translate-y-1/2 text-white/50 hover:text-white bg-white/10 hover:bg-white/20 p-3 rounded-full backdrop-blur-md z-50 transition-all"
                onClick={(e) => { e.stopPropagation(); lightboxGoNext(); }}
              >
                <ChevronRight className="w-6 h-6" />
              </button>
            </>
          )}

          <div className="relative w-full max-w-7xl max-h-[90vh] flex items-center justify-center" onClick={(e) => e.stopPropagation()}>
            <img
              src={allImages[lightboxIdx]}
              alt={`${project.title} ${lightboxIdx + 1}`}
              className="max-w-full max-h-[90vh] object-contain rounded-xl shadow-2xl"
            />
          </div>

          {allImages.length > 1 && (
            <div className="absolute bottom-6 left-1/2 -translate-x-1/2 text-white/60 text-sm font-medium bg-white/10 backdrop-blur-md px-4 py-2 rounded-full">
              {lightboxIdx + 1} / {allImages.length}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default ProjectDetail;