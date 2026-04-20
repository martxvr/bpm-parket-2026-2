import React from 'react'
import Link from 'next/link'
import { Calendar } from 'lucide-react'
import ArrowBackIcon from '@/components/ui/arrow-back-icon'
import SaveIcon from '@/components/ui/save-icon'
import SparklesIcon from '@/components/ui/sparkles-icon'
import CameraIcon from '@/components/ui/camera-icon'
import InfoCircleIcon from '@/components/ui/info-circle-icon'
import MapPinIcon from '@/components/ui/map-pin-icon'
import ExpandIcon from '@/components/ui/expand-icon'
import GearIcon from '@/components/ui/gear-icon'
import DownChevron from '@/components/ui/down-chevron'
import { saveProject } from '../actions'
import { getProject } from '@/lib/admin-data'
import ProjectImagesField from '../../_components/ProjectImagesField'
import { categories } from '@/data/brands'

const allBrands = categories.flatMap(c => c.brands.map(b => ({ name: b.name, slug: b.slug, category: c.name })));

export default async function ProjectEditorPage({
    params,
}: {
    params: Promise<{ id?: string }>
}) {
    const { id } = await params
    const isNew = !id || id === 'new'
    const project = isNew ? null : await getProject(id)

    return (
        <div className="max-w-5xl mx-auto space-y-12 pb-24 animate-fade-in">
            {/* Header Section */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                <div className="flex items-center gap-6 animate-slide-up">
                    <Link
                        href="/admin/projecten"
                        className="w-10 h-10 bg-white border border-gray-100 rounded-xl flex items-center justify-center text-gray-400 hover:text-brand-primary hover:border-brand-primary/20 hover:shadow-xl hover:shadow-gray-200/50 transition-all group"
                    >
                        <ArrowBackIcon size={24} className="group-hover:-translate-x-1 transition-transform" />
                    </Link>
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900 tracking-tight flex items-center gap-3">
                            {isNew ? 'Nieuw Project' : 'Project Bewerken'}
                            <SparklesIcon size={16} className="text-brand-primary" />
                        </h1>
                        <p className="text-gray-500 mt-2 text-sm font-medium">Pas de details en visuele presentatie van je project aan.</p>
                    </div>
                </div>
            </div>

            <form action={saveProject} className="space-y-10">
                {project && <input type="hidden" name="id" value={project.id} />}

                <div className="max-w-4xl mx-auto bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden animate-slide-up">
                    <div className="p-6 border-b border-gray-100 bg-gray-50/50 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                        <div className="flex items-center gap-3">
                            <div className="p-1.5 bg-brand-primary/10 rounded-lg">
                                <InfoCircleIcon size={16} className="text-brand-primary" />
                            </div>
                            <h3 className="text-base font-bold text-gray-900">1. Basis Informatie</h3>
                        </div>
                    </div>

                    <div className="p-6 space-y-6">
                        <div>
                            <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-3 ml-1">Titel van het project</label>
                            <input
                                type="text"
                                name="title"
                                defaultValue={project?.title}
                                required
                                className="w-full px-4 py-2 text-sm bg-gray-50 border border-gray-100 rounded-xl focus:ring-4 focus:ring-brand-primary/10 focus:border-brand-primary focus:bg-white transition-all outline-none font-bold text-gray-900"
                                placeholder="Bijv. Moderne PVC Vloer in Woonkamer"
                            />
                        </div>

                        <div>
                            <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-3 ml-1">Omschrijving</label>
                            <textarea
                                name="description"
                                defaultValue={project?.description}
                                required
                                rows={3}
                                className="w-full px-4 py-2 text-sm bg-gray-50 border border-gray-100 rounded-xl focus:ring-4 focus:ring-brand-primary/10 focus:border-brand-primary focus:bg-white transition-all outline-none font-medium text-gray-700 leading-relaxed"
                                placeholder="Beschrijf de werkzaamheden, materialen en het resultaat..."
                            />
                        </div>
                    </div>

                    <div className="p-6 border-y border-gray-100 bg-gray-50/50 flex items-center gap-3">
                        <div className="p-1.5 bg-brand-primary/10 rounded-lg">
                            <GearIcon size={16} className="text-brand-primary" />
                        </div>
                        <h3 className="text-base font-bold text-gray-900">2. Specificaties</h3>
                    </div>

                    <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-3 ml-1">Categorie</label>
                            <div className="relative">
                                <select
                                    name="category"
                                    defaultValue={project?.category || 'pvc-vloeren'}
                                    required
                                    className="w-full appearance-none px-4 py-2 text-sm bg-gray-50 border border-gray-100 rounded-xl focus:ring-2 focus:ring-brand-primary/20 focus:border-brand-primary focus:bg-white transition-all outline-none font-bold text-gray-800"
                                >
                                    <option value="pvc-vloeren">PVC-vloeren</option>
                                    <option value="traprenovatie">Traprenovatie</option>
                                    <option value="vloerbedekking">Vloerbedekking</option>
                                    <option value="raamdecoratie">Raamdecoratie</option>
                                    <option value="gordijnen">Gordijnen</option>
                                </select>
                                <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400">
                                    <DownChevron size={20} />
                                </div>
                            </div>
                        </div>

                        <div>
                            <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-3 ml-1">Merk</label>
                            <div className="relative">
                                <select
                                    name="brand_slug"
                                    defaultValue={project?.brand_slug || ''}
                                    className="w-full appearance-none px-4 py-2 text-sm bg-gray-50 border border-gray-100 rounded-xl focus:ring-2 focus:ring-brand-primary/20 focus:border-brand-primary focus:bg-white transition-all outline-none font-bold text-gray-800"
                                >
                                    <option value="">Geen merk</option>
                                    {allBrands.map(b => (
                                        <option key={`${b.slug}-${b.category}`} value={b.slug}>{b.name} ({b.category})</option>
                                    ))}
                                </select>
                                <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400">
                                    <DownChevron size={20} />
                                </div>
                            </div>
                        </div>

                        <div>
                            <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-3 ml-1 flex items-center gap-1.5">
                                <MapPinIcon size={12} /> Locatie
                            </label>
                            <input
                                type="text"
                                name="location"
                                defaultValue={project?.location}
                                className="w-full px-4 py-2 text-sm bg-gray-50 border border-gray-100 rounded-xl focus:ring-2 focus:ring-brand-primary/20 focus:border-brand-primary focus:bg-white transition-all outline-none font-bold text-gray-800"
                                placeholder="Bijv. Doetinchem"
                            />
                        </div>

                        <div>
                            <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-3 ml-1 flex items-center gap-1.5">
                                <ExpandIcon size={12} /> Oppervlakte (m²)
                            </label>
                            <input
                                type="number"
                                name="area_size"
                                defaultValue={project?.area_size}
                                className="w-full px-4 py-2 text-sm bg-gray-50 border border-gray-100 rounded-xl focus:ring-4 focus:ring-brand-primary/10 focus:border-brand-primary focus:bg-white transition-all outline-none font-bold text-gray-800"
                                placeholder="Bijv. 45"
                            />
                        </div>

                        <div>
                            <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-3 ml-1 flex items-center gap-1.5">
                                <Calendar className="w-3 h-3" /> Datum
                            </label>
                            <input
                                type="date"
                                name="date"
                                defaultValue={project?.date ? new Date(project.date).toISOString().split('T')[0] : ''}
                                className="w-full px-4 py-2 text-sm bg-gray-50 border border-gray-100 rounded-xl focus:ring-4 focus:ring-brand-primary/10 focus:border-brand-primary focus:bg-white transition-all outline-none font-bold text-gray-800"
                            />
                        </div>
                    </div>

                    <div className="p-6 border-y border-gray-100 bg-gray-50/50 flex items-center gap-3">
                        <div className="p-1.5 bg-brand-primary/10 rounded-lg">
                            <CameraIcon size={16} className="text-brand-primary" />
                        </div>
                        <h3 className="text-base font-bold text-gray-900">3. Media & Technieken</h3>
                    </div>

                    <div className="p-6 space-y-6">
                        <ProjectImagesField initialImages={project?.images || (project?.image_url ? [project.image_url] : [])} />

                        <div>
                            <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-3 ml-1">Gebruikte Technieken & Materialen</label>
                            <input
                                type="text"
                                name="techniques"
                                defaultValue={project?.techniques?.join(', ')}
                                className="w-full px-4 py-2 text-sm bg-gray-50 border border-gray-100 rounded-xl focus:ring-2 focus:ring-brand-primary/20 focus:border-brand-primary focus:bg-white transition-all outline-none font-semibold text-gray-700"
                                placeholder="Bijv. Egaliseren, Plak PVC, Plinten"
                            />
                            <p className="mt-2 text-[10px] text-gray-400 font-bold uppercase tracking-wider ml-1">Gebruik komma's om tags te scheiden</p>
                        </div>
                    </div>

                    {/* Footer Actions */}
                    <div className="p-6 bg-gray-50 border-t border-gray-100 flex flex-col-reverse sm:flex-row items-center justify-end gap-3">
                        <Link
                            href="/admin/projecten"
                            className="w-full sm:w-auto px-6 py-2.5 text-sm bg-white text-gray-600 font-bold rounded-xl border border-gray-200 hover:bg-gray-50 transition-colors text-center"
                        >
                            Annuleren
                        </Link>
                        <button
                            type="submit"
                            className="w-full sm:w-auto px-8 py-2.5 text-sm bg-brand-primary text-white rounded-xl font-black shadow-lg shadow-brand-primary/20 hover:scale-105 active:scale-95 transition-all flex items-center justify-center gap-2"
                        >
                            <SaveIcon size={20} />
                            Opslaan & Publiceren
                        </button>
                    </div>
                </div>
            </form>
        </div>
    )
}
