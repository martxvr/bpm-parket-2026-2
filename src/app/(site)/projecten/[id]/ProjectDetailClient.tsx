"use client"

import React from 'react';
import { useRouter } from 'next/navigation';
import { Calendar } from 'lucide-react';
import MapPinIcon from '@/components/ui/map-pin-icon';
import ExpandIcon from '@/components/ui/expand-icon';
import ArrowNarrowRightIcon from '@/components/ui/arrow-narrow-right-icon';
import ArrowBackIcon from '@/components/ui/arrow-back-icon';
import { Project } from '@/types';
import Button from '@/components/Button';

export default function ProjectDetailClient({ project }: { project: Project }) {
    const router = useRouter();

    if (!project) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center gap-4">
                <h1 className="text-2xl font-bold">Project niet gevonden</h1>
                <button onClick={() => router.push('/projecten')} className="text-gray-500 hover:text-black underline">
                    Terug naar projecten
                </button>
            </div>
        );
    }

    const description = project.longDescription || project.description;

    let ctaText = "Interesse in zo'n vloer?";
    if (project.category?.toLowerCase() === 'traprenovatie') {
        ctaText = "Interesse in zo'n traprenovatie?";
    } else if (project.category?.toLowerCase() === 'vloerbedekking') {
        ctaText = "Interesse in zo'n vloerbedekking?";
    } else if (project.category?.toLowerCase() === 'raamdecoratie') {
        ctaText = "Interesse in raamdecoratie?";
    } else if (project.category?.toLowerCase() === 'gordijnen') {
        ctaText = "Interesse in gordijnen?";
    }

    return (
        <div className="bg-white min-h-screen">

            {/* Hero Image */}
            <div className="relative h-[50vh] w-full">
                <img
                    src={project.imageUrl}
                    alt={project.title}
                    className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />

                {/* Back button */}
                <button
                    onClick={() => router.push('/projecten')}
                    className="absolute top-6 left-6 z-20 bg-white/80 backdrop-blur-md px-4 py-2 rounded-full text-black text-sm font-medium flex items-center gap-2 hover:bg-white transition-all"
                >
                    <ArrowBackIcon size={16} /> Alle Projecten
                </button>

                <div className="absolute bottom-8 left-6 sm:left-12 text-white">
                    <span className="inline-block py-1 px-3 rounded-full bg-white/20 backdrop-blur-md border border-white/20 text-xs font-bold uppercase tracking-wider mb-4">
                        Project Uitgelicht
                    </span>
                    <h1 className="text-3xl sm:text-5xl font-bold leading-tight">{project.title}</h1>
                </div>
            </div>

            {/* Content */}
            <div className="max-w-6xl mx-auto px-6 py-16 grid grid-cols-1 lg:grid-cols-3 gap-12">

                {/* Left: Description */}
                <div className="lg:col-span-2 space-y-8">
                    <div>
                        <h2 className="text-xl font-bold text-gray-900 mb-4">Over dit project</h2>
                        <p className="text-gray-500 leading-relaxed text-lg whitespace-pre-line">
                            {description}
                        </p>
                    </div>

                    {project.techniques && project.techniques.length > 0 && (
                        <div className="bg-gray-50 rounded-2xl p-8 border border-gray-100">
                            <h3 className="font-bold text-gray-900 mb-4">Toegepaste Technieken</h3>
                            <ul className="space-y-3">
                                {project.techniques.map((tech: string, index: number) => (
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

                        <div className="h-px bg-gray-100 w-full" />

                        <div>
                            <div className="flex items-center text-gray-400 text-xs font-bold uppercase tracking-wider mb-1">
                                <ExpandIcon size={16} className="mr-2" /> Oppervlakte
                            </div>
                            <p className="text-lg font-bold text-gray-900">{project.areaSize} m²</p>
                        </div>

                        <div className="h-px bg-gray-100 w-full" />

                        <div>
                            <div className="flex items-center text-gray-400 text-xs font-bold uppercase tracking-wider mb-1">
                                <Calendar className="w-4 h-4 mr-2" /> Oplevering
                            </div>
                            <p className="text-lg font-bold text-gray-900">{project.date}</p>
                        </div>
                    </div>

                    <div className="bg-black text-white rounded-2xl p-8 text-center">
                        <h4 className="text-xl font-bold mb-2">{ctaText}</h4>
                        <p className="text-gray-400 text-sm mb-6">Wij realiseren dit ook graag voor uw project.</p>
                        <Button
                            variant="primary"
                            fullWidth
                            className="bg-white text-black hover:bg-gray-200"
                            onClick={() => router.push('/offerte')}
                        >
                            Offerte Aanvragen <ArrowNarrowRightIcon size={16} className="ml-2" />
                        </Button>
                    </div>
                </div>

            </div>
        </div>
    );
}