'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import { Plus, Kanban } from 'lucide-react'
import LayoutDashboardIcon from '@/components/ui/layout-dashboard-icon'
import MessageCircleIcon from '@/components/ui/message-circle-icon'
import RightChevron from '@/components/ui/right-chevron'
import CheckedIcon from '@/components/ui/checked-icon'
import TriangleAlertIcon from '@/components/ui/triangle-alert-icon'
import ClockIcon from '@/components/ui/clock-icon'
import PipelineBoard from './PipelineBoard'
import DeleteButton from '../../_components/DeleteButton'
import { deleteOfferte } from '../actions'

interface AanvragenClientProps {
    initialOffertes: any[]
}

export default function AanvragenClient({ initialOffertes }: AanvragenClientProps) {
    const [view, setView] = useState<'list' | 'board'>('board')

    const getStatusStyles = (status: string) => {
        switch (status) {
            case 'nieuw':
                return { bg: 'bg-blue-50', text: 'text-blue-700', dot: 'bg-blue-500', icon: ClockIcon }
            case 'behandeling':
                return { bg: 'bg-amber-50', text: 'text-amber-700', dot: 'bg-amber-500', icon: TriangleAlertIcon }
            case 'verzonden':
                return { bg: 'bg-green-50', text: 'text-green-700', dot: 'bg-green-500', icon: CheckedIcon }
            default:
                return { bg: 'bg-gray-50', text: 'text-gray-700', dot: 'bg-gray-500', icon: MessageCircleIcon }
        }
    }

    return (
        <div className="space-y-10 animate-fade-in h-[calc(100vh-12rem)] flex flex-col">
            {/* Header Section */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 shrink-0">
                <div className="animate-slide-up">
                    <h1 className="text-4xl font-extrabold text-gray-900 tracking-tight">Offerte Aanvragen</h1>
                    <p className="text-gray-500 mt-2 text-lg">Beheer alle binnengekomen aanvragen via de website.</p>
                </div>

                <div className="flex items-center gap-4 animate-slide-up delay-100">
                    {/* View Toggle */}
                    <div className="bg-gray-100 p-1 rounded-2xl flex items-center gap-1 shadow-inner">
                        <button
                            onClick={() => setView('board')}
                            className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-bold transition-all ${
                                view === 'board' ? 'bg-white text-brand-primary shadow-sm' : 'text-gray-500 hover:text-gray-900'
                            }`}
                        >
                            <Kanban className="w-4 h-4" />
                            Pipeline
                        </button>
                        <button
                            onClick={() => setView('list')}
                            className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-bold transition-all ${
                                view === 'list' ? 'bg-white text-brand-primary shadow-sm' : 'text-gray-500 hover:text-gray-900'
                            }`}
                        >
                            <LayoutDashboardIcon size={16} />
                            Lijst
                        </button>
                    </div>

                    <Link
                        href="/admin/aanvragen/new"
                        className="bg-brand-primary hover:bg-brand-secondary text-white px-6 py-3.5 rounded-2xl flex items-center gap-2 transition-all duration-300 shadow-lg shadow-brand-primary/20 hover:scale-105 active:scale-95 font-bold shrink-0"
                    >
                        <Plus className="w-5 h-5 stroke-[3px]" />
                        <span className="hidden sm:inline">Nieuwe Aanvraag</span>
                    </Link>
                </div>
            </div>

            {/* Content Section */}
            <div className="flex-1 min-h-0">
                {initialOffertes.length === 0 ? (
                    <div className="bg-white rounded-2xl p-20 text-center border-2 border-dashed border-gray-100 animate-blur-in h-auto mt-10">
                        <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-6">
                            <MessageCircleIcon size={40} className="text-gray-300" />
                        </div>
                        <h3 className="text-xl font-bold text-gray-900">Geen actieve aanvragen</h3>
                        <p className="text-gray-500 mt-2 max-w-xs mx-auto">Momenten rust! Er zijn op dit moment geen nieuwe aanvragen.</p>
                    </div>
                ) : view === 'board' ? (
                    <div className="h-full pr-2 pb-8 overflow-x-auto">
                        <div className="min-w-[1000px] h-full">
                            <PipelineBoard initialOffertes={initialOffertes} />
                        </div>
                    </div>
                ) : (
                    <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden shadow-sm h-full overflow-y-auto">
                        <table className="w-full">
                            <thead className="sticky top-0 bg-white z-10">
                                <tr className="border-b border-gray-100">
                                    <th className="text-left py-4 px-6 text-xs font-bold text-gray-400 uppercase tracking-wider bg-gray-50/50">Details</th>
                                    <th className="text-left py-4 px-6 text-xs font-bold text-gray-400 uppercase tracking-wider bg-gray-50/50">Status</th>
                                    <th className="text-left py-4 px-6 text-xs font-bold text-gray-400 uppercase tracking-wider hidden md:table-cell bg-gray-50/50">Datum</th>
                                    <th className="text-right py-4 px-6 text-xs font-bold text-gray-400 uppercase tracking-wider bg-gray-50/50">Acties</th>
                                </tr>
                            </thead>
                            <tbody>
                                {initialOffertes.map((offerte, index) => {
                                    const style = getStatusStyles(offerte.status || 'nieuw')
                                    return (
                                        <tr
                                            key={offerte.id}
                                            className="border-b border-gray-50 last:border-b-0 hover:bg-gray-50/50 transition-colors group animate-slide-up"
                                            style={{ animationDelay: `${index * 30}ms` }}
                                        >
                                            <td className="py-4 px-6">
                                                <div className="flex items-center gap-4">
                                                    <div className={`${style.bg} ${style.text} p-3 rounded-xl flex-shrink-0 transition-transform duration-500 group-hover:scale-110`}>
                                                        <style.icon className="w-5 h-5 stroke-[2.5px]" />
                                                    </div>
                                                    <div>
                                                        <Link href={`/admin/aanvragen/${offerte.id}`} className="font-bold text-gray-900 group-hover:text-brand-primary transition-colors cursor-pointer">
                                                            {offerte.customer_name}
                                                        </Link>
                                                        <p className="text-sm text-gray-500 mt-0.5 font-medium">
                                                            {offerte.service?.replace('-', ' ') || 'Algemene aanvraag'}
                                                        </p>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="py-4 px-6">
                                                <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${style.bg} ${style.text}`}>
                                                    <div className={`w-1.5 h-1.5 rounded-full ${style.dot}`} />
                                                    {offerte.status}
                                                </span>
                                            </td>
                                            <td className="py-4 px-6 hidden md:table-cell">
                                                <p className="text-sm text-gray-600 font-medium">
                                                    {new Date(offerte.created_at).toLocaleDateString('nl-NL', {
                                                        day: 'numeric',
                                                        month: 'long',
                                                        year: 'numeric'
                                                    })}
                                                </p>
                                            </td>
                                            <td className="py-4 px-6">
                                                <div className="flex items-center justify-end gap-2">
                                                    <Link
                                                        href={`/admin/aanvragen/${offerte.id}`}
                                                        className="px-4 py-2 bg-gray-50 hover:bg-brand-primary hover:text-white rounded-xl text-sm font-bold text-gray-500 transition-all duration-300"
                                                    >
                                                        Details
                                                    </Link>
                                                    <DeleteButton
                                                        onDelete={async () => {
                                                            await deleteOfferte(offerte.id)
                                                        }}
                                                        confirmMessage="Weet je zeker dat je deze aanvraag wilt verwijderen?"
                                                        className="p-2 text-gray-300 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all"
                                                    />
                                                </div>
                                            </td>
                                        </tr>
                                    )
                                })}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </div>
    )
}
