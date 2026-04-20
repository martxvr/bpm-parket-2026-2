'use client'

import React, { useState } from 'react'
import { useRouter } from 'next/navigation'
import SaveIcon from '@/components/ui/save-icon'
import ArrowBackIcon from '@/components/ui/arrow-back-icon'
import { saveActievloer } from './actions'

type ActievloerData = {
    id?: string
    name?: string
    brand?: string
    collection?: string | null
    image_url?: string
    discount_percentage?: number
    description?: string | null
    specs?: Record<string, string> | null
    sort_order?: number
    active?: boolean
}

export default function ActievloerForm({ data }: { data?: ActievloerData }) {
    const router = useRouter()
    const [preview, setPreview] = useState(data?.image_url || '')

    const existingSpecs = data?.specs ? Object.entries(data.specs) : []
    const initialRows = existingSpecs.length > 0
        ? existingSpecs.map(([key, value]) => ({ key, value }))
        : [{ key: '', value: '' }, { key: '', value: '' }, { key: '', value: '' }]

    const [specRows, setSpecRows] = useState(initialRows)

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if (file) {
            setPreview(URL.createObjectURL(file))
        }
    }

    const addSpecRow = () => {
        setSpecRows(prev => [...prev, { key: '', value: '' }])
    }

    const updateSpecRow = (index: number, field: 'key' | 'value', val: string) => {
        setSpecRows(prev => prev.map((row, i) => i === index ? { ...row, [field]: val } : row))
    }

    return (
        <div className="max-w-3xl space-y-8 animate-fade-in">
            <button
                onClick={() => router.back()}
                className="flex items-center gap-2 text-sm text-gray-400 hover:text-gray-900 transition-colors group"
            >
                <ArrowBackIcon size={16} className="group-hover:-translate-x-1 transition-transform" />
                Terug naar overzicht
            </button>

            <div>
                <h1 className="text-3xl font-extrabold text-gray-900">
                    {data?.id ? 'Actievloer bewerken' : 'Nieuwe actievloer'}
                </h1>
                <p className="text-gray-500 mt-1">Voeg een actievloer toe met korting.</p>
            </div>

            <form action={saveActievloer} className="bg-white rounded-2xl border border-gray-100 p-8 space-y-6">
                {data?.id && <input type="hidden" name="id" value={data.id} />}

                {/* Preview */}
                {preview && (
                    <div className="rounded-xl overflow-hidden h-56 bg-gray-50">
                        <img src={preview} alt="Preview" className="w-full h-full object-cover" />
                    </div>
                )}

                {/* Name + Brand */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                        <label className="text-xs font-bold text-gray-700 uppercase tracking-widest">Naam *</label>
                        <input
                            name="name"
                            type="text"
                            required
                            defaultValue={data?.name || ''}
                            placeholder="Bijv. Eiken Naturel"
                            className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-primary/20 focus:border-brand-primary text-sm"
                        />
                    </div>
                    <div className="space-y-2">
                        <label className="text-xs font-bold text-gray-700 uppercase tracking-widest">Merk *</label>
                        <input
                            name="brand"
                            type="text"
                            required
                            defaultValue={data?.brand || ''}
                            placeholder="Bijv. Floorify"
                            className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-primary/20 focus:border-brand-primary text-sm"
                        />
                    </div>
                </div>

                {/* Collection */}
                <div className="space-y-2">
                    <label className="text-xs font-bold text-gray-700 uppercase tracking-widest">Collectie</label>
                    <input
                        name="collection"
                        type="text"
                        defaultValue={data?.collection || ''}
                        placeholder="Bijv. Premium Line"
                        className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-primary/20 focus:border-brand-primary text-sm"
                    />
                </div>

                {/* Image upload or URL */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                        <label className="text-xs font-bold text-gray-700 uppercase tracking-widest">Afbeelding uploaden</label>
                        <input
                            name="image_file"
                            type="file"
                            accept="image/*"
                            onChange={handleFileChange}
                            className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl text-sm file:mr-4 file:py-1 file:px-3 file:rounded-lg file:border-0 file:text-xs file:font-bold file:bg-brand-primary/10 file:text-brand-primary"
                        />
                    </div>
                    <div className="space-y-2">
                        <label className="text-xs font-bold text-gray-700 uppercase tracking-widest">Of afbeelding URL</label>
                        <input
                            name="image_url"
                            type="text"
                            defaultValue={data?.image_url || ''}
                            placeholder="/images/..."
                            onChange={e => setPreview(e.target.value)}
                            className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-primary/20 focus:border-brand-primary text-sm"
                        />
                    </div>
                </div>

                {/* Discount + Sort */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                        <label className="text-xs font-bold text-gray-700 uppercase tracking-widest">Korting (%) *</label>
                        <input
                            name="discount_percentage"
                            type="number"
                            min={0}
                            max={100}
                            required
                            defaultValue={data?.discount_percentage ?? 0}
                            className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-primary/20 focus:border-brand-primary text-sm"
                        />
                    </div>
                    <div className="space-y-2">
                        <label className="text-xs font-bold text-gray-700 uppercase tracking-widest">Volgorde</label>
                        <input
                            name="sort_order"
                            type="number"
                            defaultValue={data?.sort_order ?? 0}
                            className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-primary/20 focus:border-brand-primary text-sm"
                        />
                    </div>
                </div>

                {/* Description */}
                <div className="space-y-2">
                    <label className="text-xs font-bold text-gray-700 uppercase tracking-widest">Beschrijving</label>
                    <textarea
                        name="description"
                        rows={3}
                        defaultValue={data?.description || ''}
                        placeholder="Korte omschrijving van de actievloer..."
                        className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-primary/20 focus:border-brand-primary text-sm resize-none"
                    />
                </div>

                {/* Specs */}
                <div className="space-y-3">
                    <label className="text-xs font-bold text-gray-700 uppercase tracking-widest">Specificaties</label>
                    {specRows.map((row, index) => (
                        <div key={index} className="grid grid-cols-2 gap-3">
                            <input
                                name="spec_key"
                                type="text"
                                value={row.key}
                                onChange={e => updateSpecRow(index, 'key', e.target.value)}
                                placeholder="Bijv. Dikte"
                                className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-primary/20 focus:border-brand-primary text-sm"
                            />
                            <input
                                name="spec_value"
                                type="text"
                                value={row.value}
                                onChange={e => updateSpecRow(index, 'value', e.target.value)}
                                placeholder="Bijv. 5mm"
                                className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-primary/20 focus:border-brand-primary text-sm"
                            />
                        </div>
                    ))}
                    <button
                        type="button"
                        onClick={addSpecRow}
                        className="text-xs font-bold text-brand-primary hover:text-brand-secondary transition-colors"
                    >
                        + Specificatie toevoegen
                    </button>
                </div>

                {/* Active toggle */}
                <div className="flex items-center gap-3">
                    <input
                        name="active"
                        type="checkbox"
                        defaultChecked={data?.active ?? true}
                        className="w-5 h-5 rounded border-gray-300 text-brand-primary focus:ring-brand-primary/20"
                    />
                    <label className="text-sm font-bold text-gray-700">Actief (zichtbaar op de website)</label>
                </div>

                {/* Submit */}
                <button
                    type="submit"
                    className="flex items-center gap-2 bg-brand-primary text-white px-6 py-3 rounded-xl font-bold hover:bg-brand-secondary transition-colors text-sm"
                >
                    <SaveIcon size={18} />
                    Opslaan
                </button>
            </form>
        </div>
    )
}
