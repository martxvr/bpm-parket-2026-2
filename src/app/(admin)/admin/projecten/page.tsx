import React from 'react'
import Link from 'next/link'
import { Plus, Pencil, Calendar } from 'lucide-react'
import TrashIcon from '@/components/ui/trash-icon'
import ExternalLinkIcon from '@/components/ui/external-link-icon'
import MapPinIcon from '@/components/ui/map-pin-icon'
import ExpandIcon from '@/components/ui/expand-icon'
import CameraIcon from '@/components/ui/camera-icon'
import { getProjects } from '@/lib/admin-data'
import { deleteProject } from './actions'
import DeleteButton from '../_components/DeleteButton'

export default async function ProjectsPage() {
    const projects = await getProjects()

    return (
        <div className="space-y-10 animate-fade-in">
            {/* Header Section */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                <div className="animate-slide-up">
                    <h1 className="text-4xl font-extrabold text-gray-900 tracking-tight">Projecten</h1>
                    <p className="text-gray-500 mt-2 text-lg">Beheer uw portfolio items en showcase resultaten.</p>
                </div>
                <Link
                    href="/admin/projecten/new"
                    className="bg-brand-primary hover:bg-brand-secondary text-white px-6 py-3 rounded-2xl flex items-center gap-2 transition-all duration-300 shadow-lg shadow-brand-primary/20 hover:scale-105 active:scale-95 animate-slide-up delay-100 font-bold"
                >
                    <Plus className="w-5 h-5 stroke-[3px]" />
                    Project Toevoegen
                </Link>
            </div>

            {/* List Section */}
            <div className="grid gap-6">
                {projects.length === 0 ? (
                    <div className="bg-white rounded-2xl p-20 text-center border-2 border-dashed border-gray-100 animate-blur-in">
                        <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-6">
                            <Plus className="w-10 h-10 text-gray-300" />
                        </div>
                        <h3 className="text-xl font-bold text-gray-900">Nog geen projecten</h3>
                        <p className="text-gray-500 mt-2 max-w-xs mx-auto">Start met het toevoegen van je eerste succesvolle project aan de portfolio.</p>
                        <Link
                            href="/admin/projecten/new"
                            className="mt-8 inline-flex items-center text-brand-primary font-bold hover:underline"
                        >
                            Voeg nu toe →
                        </Link>
                    </div>
                ) : (
                    <div className="space-y-4">
                        {projects.map((project, index) => (
                            <div
                                key={project.id}
                                className="group bg-white rounded-xl p-4 pr-8 border border-gray-100 hover:border-brand-primary/20 hover:shadow-2xl hover:shadow-gray-200/50 transition-all duration-500 flex flex-col sm:flex-row items-center gap-6 animate-slide-up"
                                style={{ animationDelay: `${index * 100}ms` }}
                            >
                                {/* Thumbnail */}
                                <div className="relative w-full sm:w-48 h-32 rounded-2xl overflow-hidden bg-gray-50 flex-shrink-0 border border-gray-50">
                                    {project.image_url ? (
                                        <img
                                            src={project.image_url}
                                            alt=""
                                            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                                        />
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center text-gray-300">
                                            <CameraIcon size={32} />
                                        </div>
                                    )}
                                    <div className="absolute top-2 left-2 px-3 py-1 bg-white/90 backdrop-blur-sm rounded-full text-[10px] font-bold text-gray-700 shadow-sm uppercase tracking-wider">
                                        {project.category}
                                    </div>
                                </div>

                                {/* Content */}
                                <div className="flex-1 min-w-0 py-2">
                                    <h3 className="text-xl font-bold text-gray-900 truncate group-hover:text-brand-primary transition-colors duration-300">
                                        {project.title}
                                    </h3>
                                    <p className="text-sm text-gray-500 mt-1 line-clamp-1 max-w-2xl">
                                        {project.description || 'Geen beschrijving beschikbaar.'}
                                    </p>

                                    {/* Stats/Meta */}
                                    <div className="flex flex-wrap items-center gap-6 mt-4">
                                        <div className="flex items-center gap-2 text-xs font-medium text-gray-400">
                                            <ExpandIcon size={16} className="text-brand-primary/60" />
                                            <span>{project.area_size || '0'} m²</span>
                                        </div>
                                        <div className="flex items-center gap-2 text-xs font-medium text-gray-400">
                                            <MapPinIcon size={16} className="text-brand-primary/60" />
                                            <span>{project.location || 'Onbekend'}</span>
                                        </div>
                                        <div className="flex items-center gap-2 text-xs font-medium text-gray-400">
                                            <Calendar className="w-4 h-4 text-brand-primary/60" />
                                            <span>{project.date ? new Date(project.date).toLocaleDateString('nl-NL') : 'Recent'}</span>
                                        </div>
                                    </div>
                                </div>

                                {/* Actions */}
                                <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-x-4 group-hover:translate-x-0">
                                    <Link
                                        href={`/projecten/${project.id}`}
                                        target="_blank"
                                        className="p-3 bg-gray-50 hover:bg-white hover:shadow-md text-gray-400 hover:text-brand-primary rounded-xl transition-all"
                                        title="Bekijk op site"
                                    >
                                        <ExternalLinkIcon size={20} />
                                    </Link>
                                    <Link
                                        href={`/admin/projecten/${project.id}`}
                                        className="p-3 bg-gray-50 hover:bg-white hover:shadow-md text-gray-400 hover:text-blue-600 rounded-xl transition-all"
                                        title="Bewerken"
                                    >
                                        <Pencil className="w-5 h-5" />
                                    </Link>
                                    <DeleteButton
                                        onDelete={async () => {
                                            'use server'
                                            await deleteProject(project.id)
                                        }}
                                        confirmMessage="Weet je zeker dat je dit project wilt verwijderen?"
                                    />
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    )
}
