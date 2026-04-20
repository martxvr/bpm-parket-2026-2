import React from 'react'
import Link from 'next/link'
import { Plus, Pencil } from 'lucide-react'
import QuestionMark from '@/components/ui/question-mark'
import BrainCircuitIcon from '@/components/ui/brain-circuit-icon'
import { getAIKennisbank } from '@/lib/admin-data'
import { deleteAIKennisitem } from './actions'
import DeleteButton from '../_components/DeleteButton'

export default async function KennisbankPage() {
    const items = await getAIKennisbank()

    return (
        <div className="space-y-8 animate-fade-in">
            {/* Header */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">AI Kennisbank</h1>
                    <p className="text-gray-400 mt-1">Beheer de kennis van de chatbot</p>
                </div>
                <Link
                    href="/admin/kennisbank/new"
                    className="bg-brand-primary hover:bg-brand-secondary text-white px-5 py-2.5 rounded-xl flex items-center gap-2 transition-all duration-200 shadow-md hover:shadow-lg font-semibold text-sm"
                >
                    <Plus className="w-4 h-4 stroke-[3px]" />
                    Item Toevoegen
                </Link>
            </div>

            {/* Cards Grid */}
            {items.length === 0 ? (
                <div className="bg-white rounded-2xl p-20 text-center border border-gray-100">
                    <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-5">
                        <BrainCircuitIcon size={32} className="text-gray-300" />
                    </div>
                    <h3 className="text-lg font-bold text-gray-900">Nog geen kennis items</h3>
                    <p className="text-gray-400 mt-1.5 text-sm">Train je chatbot door kennisitems toe te voegen.</p>
                    <Link
                        href="/admin/kennisbank/new"
                        className="mt-6 inline-flex items-center text-brand-primary font-semibold text-sm hover:underline"
                    >
                        Voeg item toe →
                    </Link>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    {items.map((item, index) => (
                        <div
                            key={item.id}
                            className="group bg-white rounded-2xl p-6 border border-gray-100 hover:shadow-lg transition-all duration-300 animate-slide-up relative"
                            style={{ animationDelay: `${index * 40}ms` }}
                        >
                            {/* Edit/Delete actions — top right, visible on hover */}
                            <div className="absolute top-5 right-5 flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                <Link
                                    href={`/admin/kennisbank/${item.id}`}
                                    className="p-1.5 text-gray-300 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-all"
                                    title="Bewerken"
                                >
                                    <Pencil className="w-3.5 h-3.5" />
                                </Link>
                                <DeleteButton
                                    onDelete={async () => {
                                        'use server'
                                        await deleteAIKennisitem(item.id)
                                    }}
                                    confirmMessage="Weet je zeker dat je dit kennisitem wilt verwijderen?"
                                    className="p-1.5 text-gray-300 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all"
                                />
                            </div>

                            {/* Icon + Title */}
                            <div className="flex items-center gap-3 mb-4">
                                <div className="w-9 h-9 rounded-full bg-blue-50 flex items-center justify-center flex-shrink-0">
                                    <QuestionMark size={20} className="text-blue-400" />
                                </div>
                                <h3 className="font-bold text-gray-900 text-[15px] leading-snug pr-16">{item.title}</h3>
                            </div>

                            {/* Content */}
                            <p className="text-sm text-gray-400 leading-relaxed line-clamp-3 pl-12">
                                {item.content}
                            </p>
                        </div>
                    ))}
                </div>
            )}
        </div>
    )
}
