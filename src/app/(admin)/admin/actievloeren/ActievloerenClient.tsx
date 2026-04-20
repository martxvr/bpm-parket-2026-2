'use client'

import React, { useState, useTransition } from 'react'
import Link from 'next/link'
import TrashIcon from '@/components/ui/trash-icon'
import PenIcon from '@/components/ui/pen-icon'
import EyeIcon from '@/components/ui/eye-icon'
import EyeOffIcon from '@/components/ui/eye-off-icon'
import { deleteActievloer, toggleActievloer } from './actions'

type Actievloer = {
    id: string
    name: string
    brand: string
    collection: string | null
    image_url: string
    discount_percentage: number
    description: string | null
    specs: Record<string, string> | null
    active: boolean
    sort_order: number
    created_at: string
}

export default function ActievloerenClient({ initialData }: { initialData: Actievloer[] }) {
    const [items, setItems] = useState(initialData)
    const [isPending, startTransition] = useTransition()

    const handleDelete = (id: string) => {
        if (!confirm('Weet je zeker dat je deze actievloer wilt verwijderen?')) return
        setItems(prev => prev.filter(i => i.id !== id))
        startTransition(() => deleteActievloer(id))
    }

    const handleToggle = (id: string, currentActive: boolean) => {
        setItems(prev => prev.map(i => i.id === id ? { ...i, active: !currentActive } : i))
        startTransition(() => toggleActievloer(id, !currentActive))
    }

    return (
        <div className="space-y-6">
            {/* Grid */}
            {items.length === 0 ? (
                <div className="bg-white rounded-2xl p-24 text-center border-2 border-dashed border-gray-100">
                    <p className="text-gray-400 font-medium">Nog geen actievloeren toegevoegd.</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {items.map(item => (
                        <div
                            key={item.id}
                            className={`group bg-white rounded-2xl border border-gray-100 overflow-hidden hover:shadow-xl transition-all duration-300 ${
                                !item.active ? 'opacity-50' : ''
                            }`}
                        >
                            {/* Image */}
                            <div className="relative h-48 overflow-hidden">
                                {item.image_url ? (
                                    <img
                                        src={item.image_url}
                                        alt={item.name}
                                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                                    />
                                ) : (
                                    <div className="w-full h-full bg-gray-100 flex items-center justify-center">
                                        <span className="text-gray-300 text-sm">Geen afbeelding</span>
                                    </div>
                                )}
                                {/* Brand tag top-left */}
                                <div className="absolute top-3 left-3">
                                    <span className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full bg-white/90 text-gray-700">
                                        {item.brand}
                                    </span>
                                </div>
                                {/* Discount badge top-right */}
                                <div className="absolute top-3 right-3">
                                    <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-red-500 text-white">
                                        -{item.discount_percentage}%
                                    </span>
                                </div>
                                {!item.active && (
                                    <div className="absolute bottom-3 right-3">
                                        <span className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full bg-red-50 text-red-600">
                                            Inactief
                                        </span>
                                    </div>
                                )}
                            </div>

                            {/* Info */}
                            <div className="p-5">
                                <h3 className="font-bold text-gray-900 mb-1">{item.name}</h3>
                                {item.collection && (
                                    <p className="text-xs text-gray-500 mb-1">{item.collection}</p>
                                )}
                                <p className="text-xs text-gray-400">Volgorde: {item.sort_order}</p>

                                {/* Actions */}
                                <div className="flex items-center gap-2 mt-4 pt-4 border-t border-gray-50">
                                    <Link
                                        href={`/admin/actievloeren/${item.id}`}
                                        className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold text-gray-500 hover:text-brand-primary hover:bg-brand-primary/5 rounded-lg transition-all"
                                    >
                                        <PenIcon size={14} />
                                        Bewerk
                                    </Link>
                                    <button
                                        onClick={() => handleToggle(item.id, item.active)}
                                        className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold text-gray-500 hover:text-amber-600 hover:bg-amber-50 rounded-lg transition-all"
                                    >
                                        {item.active ? <EyeOffIcon size={14} /> : <EyeIcon size={14} />}
                                        {item.active ? 'Deactiveer' : 'Activeer'}
                                    </button>
                                    <button
                                        onClick={() => handleDelete(item.id)}
                                        className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold text-red-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all ml-auto"
                                    >
                                        <TrashIcon size={14} />
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    )
}
