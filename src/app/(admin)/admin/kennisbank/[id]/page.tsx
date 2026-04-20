import React from 'react'
import Link from 'next/link'
import { BookOpen, Layout } from 'lucide-react'
import ArrowBackIcon from '@/components/ui/arrow-back-icon'
import SaveIcon from '@/components/ui/save-icon'
import InfoCircleIcon from '@/components/ui/info-circle-icon'
import SparklesIcon from '@/components/ui/sparkles-icon'
import DownChevron from '@/components/ui/down-chevron'
import CheckedIcon from '@/components/ui/checked-icon'
import QuestionMark from '@/components/ui/question-mark'
import TerminalIcon from '@/components/ui/terminal-icon'
import { saveAIKennisitem } from '../actions'
import { getAIKennisitem } from '@/lib/admin-data'

export default async function KennisitemEditorPage({
    params,
}: {
    params: { id: string }
}) {
    // Next.js params in server components can sometimes require awaiting or specific handling in newer versions.
    const resolvedParams = await params;
    const isNew = !resolvedParams.id || resolvedParams.id === 'new';
    const item = isNew ? null : await getAIKennisitem(resolvedParams.id);

    return (
        <div className="max-w-5xl mx-auto space-y-12 pb-24 animate-fade-in">
            {/* Header Section */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                <div className="flex items-center gap-6 animate-slide-up">
                    <Link
                        href="/admin/kennisbank"
                        className="w-10 h-10 bg-white border border-gray-100 rounded-xl flex items-center justify-center text-gray-400 hover:text-brand-primary hover:border-brand-primary/20 hover:shadow-xl hover:shadow-gray-200/50 transition-all group"
                    >
                        <ArrowBackIcon size={24} className="group-hover:-translate-x-1 transition-transform" />
                    </Link>
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900 tracking-tight flex items-center gap-3">
                            {isNew ? 'Nieuw Kennisitem' : 'Kennisitem Bewerken'}
                            <BookOpen className="w-4 h-4 text-brand-primary" />
                        </h1>
                        <p className="text-gray-500 mt-2 text-sm font-medium">Beheer de informatie die de AI chatbot gebruikt om klanten te helpen.</p>
                    </div>
                </div>
            </div>

            <form action={saveAIKennisitem} className="space-y-8">
                {item && <input type="hidden" name="id" value={item.id} />}

                <div className="max-w-4xl mx-auto bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden animate-slide-up">
                    <div className="p-6 border-b border-gray-100 bg-gray-50/50 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                        <div className="flex items-center gap-3">
                            <div className="p-1.5 bg-brand-primary/10 rounded-lg">
                                <Layout className="w-4 h-4 text-brand-primary" />
                            </div>
                            <h3 className="text-base font-bold text-gray-900">1. Inhoud & Thema</h3>
                        </div>
                    </div>

                    <div className="p-6 space-y-6">
                        <div>
                            <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-3 ml-1">Titel / Onderwerp</label>
                            <input
                                type="text"
                                name="title"
                                defaultValue={item?.title}
                                required
                                className="w-full px-4 py-2 text-sm bg-gray-50 border border-gray-100 rounded-xl focus:ring-4 focus:ring-brand-primary/10 focus:border-brand-primary focus:bg-white transition-all outline-none font-bold text-gray-900"
                                placeholder="Bijv. Garantie op PVC vloeren"
                            />
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-3 ml-1">Categorie</label>
                                <div className="relative">
                                    <select
                                        name="category"
                                        defaultValue={item?.category || 'algemeen'}
                                        required
                                        className="w-full appearance-none px-4 py-2 text-sm bg-gray-50 border border-gray-100 rounded-xl focus:ring-4 focus:ring-brand-primary/10 focus:border-brand-primary focus:bg-white transition-all outline-none font-bold text-gray-900 pr-9"
                                    >
                                        <option value="algemeen">Algemeen</option>
                                        <option value="producten">Producten</option>
                                        <option value="installatie">Installatie</option>
                                        <option value="onderhoud">Onderhoud</option>
                                        <option value="garantie">Garantie</option>
                                    </select>
                                    <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400">
                                        <DownChevron size={20} />
                                    </div>
                                </div>
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-3 ml-1">Icoon Naam (Lucide)</label>
                                <div className="relative">
                                    <input
                                        type="text"
                                        name="icon"
                                        defaultValue={item?.icon || 'HelpCircle'}
                                        className="w-full px-4 py-2 text-sm bg-gray-50 border border-gray-100 rounded-xl focus:ring-4 focus:ring-brand-primary/10 focus:border-brand-primary focus:bg-white transition-all outline-none font-bold text-gray-900 pr-9"
                                        placeholder="HelpCircle, Tool..."
                                    />
                                    <QuestionMark className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-300 pointer-events-none" />
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="p-6 border-y border-gray-100 bg-gray-50/50 flex items-center gap-3">
                        <div className="p-1.5 bg-brand-primary/10 rounded-lg">
                            <TerminalIcon size={16} className="text-brand-primary" />
                        </div>
                        <h3 className="text-base font-bold text-gray-900">2. Database Inhoud</h3>
                    </div>

                    <div className="p-6 relative">
                        <div className="absolute top-0 right-0 p-4 text-gray-50/50 pointer-events-none">
                            <TerminalIcon size={24} />
                        </div>
                        <div className="relative z-10">
                            <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-3 ml-1">Gedetailleerde Informatie</label>
                            <textarea
                                name="content"
                                defaultValue={item?.content}
                                required
                                rows={15}
                                className="w-full px-4 py-3 text-sm bg-gray-900 border border-gray-800 rounded-xl focus:ring-4 focus:ring-brand-primary/20 focus:border-brand-primary transition-all outline-none font-mono text-sm leading-relaxed text-brand-primary/90 placeholder-gray-700 shadow-inner"
                                placeholder="Schrijf hier de gedetailleerde informatie voor de AI..."
                            ></textarea>
                            <div className="mt-6 p-6 bg-brand-primary/5 rounded-xl border border-brand-primary/10 flex gap-4 text-sm text-brand-primary font-medium leading-relaxed italic">
                                <InfoCircleIcon size={24} className="flex-shrink-0" />
                                <p>Deze tekst wordt direct gebruikt door de AI chatbot om antwoorden te formuleren. Wees zo feitelijk en specifiek mogelijk voor het beste resultaat.</p>
                            </div>
                        </div>
                    </div>

                    <div className="p-6 border-y border-gray-100 bg-gray-50/50 flex flex-col md:flex-row md:items-center justify-between gap-4">
                        <div className="flex items-center gap-3">
                            <div className="p-1.5 bg-brand-primary/10 rounded-lg">
                                <SparklesIcon size={16} className="text-brand-primary" />
                            </div>
                            <h3 className="text-base font-bold text-gray-900">3. AI Status</h3>
                        </div>
                        <div className="flex items-center gap-4 text-sm font-medium">
                            <span className="text-gray-500">Live in Chatbot:</span>
                            <span className="px-3 py-1 bg-green-50 text-green-700 rounded-full flex items-center gap-1.5 border border-green-200">
                                <CheckedIcon size={16} /> Actief
                            </span>
                        </div>
                    </div>

                    <div className="p-6 bg-gray-50 border-t border-gray-100 flex flex-col-reverse sm:flex-row items-center justify-end gap-3">
                        <Link
                            href="/admin/kennisbank"
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
