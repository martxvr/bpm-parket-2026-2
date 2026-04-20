'use client'

import React from 'react'
import Link from 'next/link'
import { Plus } from 'lucide-react'
import FileDescriptionIcon from '@/components/ui/file-description-icon'
import RightChevron from '@/components/ui/right-chevron'
import { Policy } from '@/types'
import DeleteButton from '../_components/DeleteButton'
import { deleteDynamicPolicy } from './actions'

interface BeleidClientProps {
    initialPolicies: Policy[]
}

export default function BeleidClient({ initialPolicies }: BeleidClientProps) {
    return (
        <div className="space-y-10 animate-fade-in h-[calc(100vh-12rem)] flex flex-col">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 shrink-0">
                <div className="animate-slide-up">
                    <h1 className="text-4xl font-extrabold text-gray-900 tracking-tight">Beleid & Pagina's</h1>
                    <p className="text-gray-500 mt-2 text-lg">Beheer hier alle juridische en extra informatiepagina's.</p>
                </div>

                <div className="flex items-center gap-4 animate-slide-up delay-100">
                    <Link
                        href="/admin/beleid/new"
                        className="bg-brand-primary hover:bg-brand-secondary text-white px-6 py-3.5 rounded-2xl flex items-center gap-2 transition-all duration-300 shadow-lg shadow-brand-primary/20 hover:scale-105 active:scale-95 font-bold shrink-0"
                    >
                        <Plus className="w-5 h-5 stroke-[3px]" />
                        <span className="hidden sm:inline">Nieuwe Pagina</span>
                    </Link>
                </div>
            </div>

            <div className="flex-1 min-h-0">
                {initialPolicies.length === 0 ? (
                    <div className="bg-white rounded-2xl p-20 text-center border-2 border-dashed border-gray-100 animate-blur-in h-auto mt-10">
                        <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-6">
                            <FileDescriptionIcon size={40} className="text-gray-300" />
                        </div>
                        <h3 className="text-xl font-bold text-gray-900">Geen pagina's gevonden</h3>
                        <p className="text-gray-500 mt-2 max-w-xs mx-auto">Klik op 'Nieuwe Pagina' om een beleidspagina toe te voegen.</p>
                    </div>
                ) : (
                    <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden shadow-sm h-full overflow-y-auto">
                        <table className="w-full">
                            <thead className="sticky top-0 bg-white z-10">
                                <tr className="border-b border-gray-100">
                                    <th className="text-left py-4 px-6 text-xs font-bold text-gray-400 uppercase tracking-wider bg-gray-50/50">Titel & Link</th>
                                    <th className="text-left py-4 px-6 text-xs font-bold text-gray-400 uppercase tracking-wider hidden md:table-cell bg-gray-50/50">Laatst Gewijzigd</th>
                                    <th className="text-right py-4 px-6 text-xs font-bold text-gray-400 uppercase tracking-wider bg-gray-50/50">Acties</th>
                                </tr>
                            </thead>
                            <tbody>
                                {initialPolicies.map((policy, index) => (
                                    <tr
                                        key={policy.id}
                                        className="border-b border-gray-50 last:border-b-0 hover:bg-gray-50/50 transition-colors group animate-slide-up"
                                        style={{ animationDelay: `${index * 30}ms` }}
                                    >
                                        <td className="py-4 px-6">
                                            <div className="flex items-center gap-4">
                                                <div className="bg-gray-50 text-gray-700 p-3 rounded-xl flex-shrink-0 transition-transform duration-500 group-hover:scale-110">
                                                    <FileDescriptionIcon size={20} className="stroke-[2.5px]" />
                                                </div>
                                                <div>
                                                    <Link href={`/admin/beleid/${policy.id}`} className="font-bold text-gray-900 group-hover:text-brand-primary transition-colors cursor-pointer">
                                                        {policy.title}
                                                    </Link>
                                                    <p className="text-sm text-gray-500 mt-0.5 font-medium">
                                                        /beleid/{policy.id}
                                                    </p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="py-4 px-6 hidden md:table-cell">
                                            <p className="text-sm text-gray-600 font-medium">
                                                {new Date(policy.lastUpdated).toLocaleDateString('nl-NL', {
                                                    day: 'numeric',
                                                    month: 'long',
                                                    year: 'numeric'
                                                })}
                                            </p>
                                        </td>
                                        <td className="py-4 px-6">
                                            <div className="flex items-center justify-end gap-2">
                                                <Link
                                                    href={`/admin/beleid/${policy.id}`}
                                                    className="px-4 py-2 bg-gray-50 hover:bg-brand-primary hover:text-white rounded-xl text-sm font-bold text-gray-500 transition-all duration-300"
                                                >
                                                    Bewerken
                                                </Link>
                                                <DeleteButton
                                                    onDelete={async () => {
                                                        await deleteDynamicPolicy(policy.id)
                                                    }}
                                                    confirmMessage="Weet je zeker dat je deze pagina wilt verwijderen? Let op: links in de footer zullen ook verdwijnen."
                                                    className="p-2 text-gray-300 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all"
                                                />
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </div>
    )
}
