import React, { useEffect } from 'react';
import { X, MapPin, Calendar, Maximize2, ArrowRight, CheckCircle2 } from 'lucide-react';
import { Project } from '../types';
import Button from './Button';

interface ProjectDetailProps {
  project: Project;
  onClose: () => void;
  onRequestQuote: () => void;
}

const ProjectDetail: React.FC<ProjectDetailProps> = ({ project, onClose, onRequestQuote }) => {
  
  // Lock body scroll when modal is open
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, []);

  // Fallback data if not provided
  const description = project.longDescription || project.description + " Dit project vertegenwoordigt onze toewijding aan kwaliteit en detail.";
  const techniques = project.techniques || [
    "Voorbereiding ondervloer",
    "Primer applicatie",
    "Gietvloer applicatie",
    "Topcoating afwerking"
  ];

  return (
    <div className="fixed inset-0 z-[60] flex items-end sm:items-center justify-center">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity animate-in fade-in duration-300" 
        onClick={onClose}
      ></div>

      {/* Modal Content */}
      <div className="relative w-full max-w-5xl h-[90vh] sm:h-[85vh] bg-white sm:rounded-3xl shadow-2xl overflow-y-auto overflow-x-hidden animate-in slide-in-from-bottom-10 duration-500 flex flex-col">
        
        {/* Close Button */}
        <button 
          onClick={onClose}
          className="absolute top-6 right-6 z-20 bg-white/50 hover:bg-white backdrop-blur-md p-3 rounded-full text-black transition-all hover:scale-110 shadow-sm"
        >
          <X size={24} />
        </button>

        {/* Hero Image */}
        <div className="relative h-[40vh] sm:h-[50vh] w-full shrink-0">
          <img 
            src={project.imageUrl} 
            alt={project.title} 
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
          
          <div className="absolute bottom-8 left-6 sm:left-12 text-white">
            <span className="inline-block py-1 px-3 rounded-full bg-white/20 backdrop-blur-md border border-white/20 text-xs font-bold uppercase tracking-wider mb-4">
              Project Uitgelicht
            </span>
            <h2 className="text-3xl sm:text-5xl font-bold leading-tight shadow-sm">{project.title}</h2>
          </div>
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
            </div>

            {/* Right: Stats & CTA */}
            <div className="space-y-8">
                <div className="bg-white border border-gray-100 shadow-xl shadow-gray-100 rounded-2xl p-6 space-y-6">
                    <div>
                        <div className="flex items-center text-gray-400 text-xs font-bold uppercase tracking-wider mb-1">
                            <MapPin className="w-4 h-4 mr-2" /> Locatie
                        </div>
                        <p className="text-lg font-bold text-gray-900">{project.location}</p>
                    </div>
                    
                    <div className="h-px bg-gray-100 w-full"></div>

                    <div>
                        <div className="flex items-center text-gray-400 text-xs font-bold uppercase tracking-wider mb-1">
                            <Maximize2 className="w-4 h-4 mr-2" /> Oppervlakte
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

                <div className="bg-black text-white rounded-2xl p-8 text-center">
                    <h4 className="text-xl font-bold mb-2">Interesse in zo'n vloer?</h4>
                    <p className="text-gray-400 text-sm mb-6">Wij realiseren dit ook graag voor uw project.</p>
                    <Button 
                      variant="primary" 
                      fullWidth 
                      className="bg-white text-black hover:bg-gray-200"
                      onClick={() => {
                        onClose();
                        onRequestQuote();
                      }}
                    >
                        Offerte Aanvragen <ArrowRight className="ml-2 w-4 h-4" />
                    </Button>
                </div>
            </div>

        </div>

      </div>
    </div>
  );
};

export default ProjectDetail;