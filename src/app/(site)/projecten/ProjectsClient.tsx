"use client"

import React, { useEffect, useState, useRef } from 'react';
import { Project } from '@/types';
import ExternalLinkIcon from '@/components/ui/external-link-icon';
import MapPinIcon from '@/components/ui/map-pin-icon';
import ExpandIcon from '@/components/ui/expand-icon';
import ProjectDetail from '@/components/ProjectDetail';

const categoryFilters = [
    { label: 'Alle', slug: '' },
    { label: 'PVC Vloeren', slug: 'pvc-vloeren' },
    { label: 'Traprenovatie', slug: 'traprenovatie' },
    { label: 'Vloerbedekking', slug: 'vloerbedekking' },
    { label: 'Raamdecoratie', slug: 'raamdecoratie' },
    { label: 'Gordijnen', slug: 'gordijnen' },
];

export default function ProjectsClient({ initialProjects }: { initialProjects: Project[] }) {
    const [projects] = useState<Project[]>(initialProjects);
    const [selectedProject, setSelectedProject] = useState<Project | null>(null);
    const observerRef = useRef<IntersectionObserver | null>(null);
    const [filterCategory, setFilterCategory] = useState<string>('');
    const [filterBrand, setFilterBrand] = useState<string>('');

    useEffect(() => {
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
    }, [projects, filterCategory, filterBrand]);

    // Get unique brands for the selected category
    const brandsForCategory = filterCategory
        ? [...new Set(projects.filter(p => p.category === filterCategory && p.brand).map(p => p.brand!))]
            .sort()
        : [];

    const filtered = projects.filter(p => {
        if (filterCategory && p.category !== filterCategory) return false;
        if (filterBrand && p.brand !== filterBrand) return false;
        return true;
    });

    return (
        <div className="bg-white min-h-screen py-20">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

                <div className="text-center mb-16 reveal">
                    <span className="text-sm font-semibold tracking-wider text-gray-900 uppercase">Portfolio</span>
                    <h2 className="mt-2 text-4xl font-bold text-gray-900">Ontdek ons meest impactvolle werk</h2>
                    <p className="mt-4 text-xl text-gray-600 max-w-2xl mx-auto">
                        Van strakke woonkamers tot robuuste fabriekshallen. Bekijk hieronder een selectie van onze projecten.
                    </p>
                </div>

                {/* Category filter */}
                <div className="flex flex-wrap gap-2 mb-4">
                    {categoryFilters.map(cat => (
                        <button
                            key={cat.slug}
                            onClick={() => { setFilterCategory(cat.slug); setFilterBrand(''); }}
                            className={`px-4 py-2 text-sm font-bold rounded-xl transition-all ${
                                filterCategory === cat.slug ? 'bg-gray-900 text-white' : 'bg-gray-100 text-gray-500 hover:bg-gray-200'
                            }`}
                        >
                            {cat.label}
                        </button>
                    ))}
                </div>

                {/* Brand filter (only when category is selected and brands exist) */}
                {filterCategory && brandsForCategory.length > 0 && (
                    <div className="flex flex-wrap gap-2 mb-8">
                        <button
                            onClick={() => setFilterBrand('')}
                            className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-all ${
                                filterBrand === '' ? 'bg-brand-primary text-white' : 'bg-gray-50 text-gray-400 hover:bg-gray-100'
                            }`}
                        >
                            Alle merken
                        </button>
                        {brandsForCategory.map(brand => (
                            <button
                                key={brand}
                                onClick={() => setFilterBrand(brand)}
                                className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-all ${
                                    filterBrand === brand ? 'bg-brand-primary text-white' : 'bg-gray-50 text-gray-400 hover:bg-gray-100'
                                }`}
                            >
                                {brand}
                            </button>
                        ))}
                    </div>
                )}

                {/* Empty filter spacing when no brand filter */}
                {(!filterCategory || brandsForCategory.length === 0) && <div className="mb-4" />}

                {/* Empty state */}
                {filtered.length === 0 && (
                    <div className="text-center py-24 bg-gray-50 rounded-2xl border-2 border-dashed border-gray-100">
                        <p className="text-gray-400 font-medium text-lg">Geen projecten gevonden voor dit filter.</p>
                        <button
                            onClick={() => { setFilterCategory(''); setFilterBrand(''); }}
                            className="mt-4 text-brand-primary font-bold text-sm hover:underline"
                        >
                            Alle projecten tonen
                        </button>
                    </div>
                )}

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {filtered.map((project, idx) => (
                        <div
                            key={project.id}
                            onClick={() => setSelectedProject(project)}
                            className={`group relative bg-white rounded-3xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 reveal delay-${(idx % 2 + 1) * 100} cursor-pointer`}
                        >
                            <div className="relative h-[400px] overflow-hidden">
                                <img
                                    src={project.imageUrl}
                                    alt={project.title}
                                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                                />
                                <div className="absolute inset-0 bg-black/10 group-hover:bg-black/20 transition-colors" />
                                <div className="absolute bottom-6 left-6 flex space-x-3">
                                    <div className="bg-white/90 backdrop-blur px-3 py-1.5 rounded-full text-xs font-semibold flex items-center">
                                        <MapPinIcon size={12} className="mr-1" /> {project.location}
                                    </div>
                                    <div className="bg-white/90 backdrop-blur px-3 py-1.5 rounded-full text-xs font-semibold flex items-center">
                                        <ExpandIcon size={12} className="mr-1" /> {project.areaSize} m²
                                    </div>
                                </div>
                            </div>

                            <div className="p-8">
                                <div className="flex justify-between items-start mb-4">
                                    <div>
                                        <h3 className="text-2xl font-bold text-gray-900 mb-2">{project.title}</h3>
                                        <p className="text-gray-500 text-sm">{project.date}</p>
                                    </div>
                                    <button className="bg-gray-900 text-white p-3 rounded-full opacity-0 group-hover:opacity-100 transform translate-y-4 group-hover:translate-y-0 transition-all duration-300">
                                        <ExternalLinkIcon size={20} />
                                    </button>
                                </div>
                                <p className="text-gray-600 leading-relaxed line-clamp-2">
                                    {project.description}
                                </p>
                            </div>
                        </div>
                    ))}
                </div>

            </div>

            {/* Project Detail Modal */}
            {selectedProject && (
                <ProjectDetail
                    project={selectedProject}
                    onClose={() => setSelectedProject(null)}
                />
            )}
        </div>
    );
}