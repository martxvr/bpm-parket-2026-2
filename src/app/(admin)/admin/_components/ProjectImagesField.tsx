'use client'

import React, { useState, useRef } from 'react'
import UploadIcon from '@/components/ui/upload-icon'

interface ProjectImagesFieldProps {
    initialImages?: string[]
}

export default function ProjectImagesField({ initialImages = [] }: ProjectImagesFieldProps) {
    const [images, setImages] = useState<string[]>(initialImages)
    const [uploading, setUploading] = useState(false)
    const fileInputRef = useRef<HTMLInputElement>(null)

    const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = Array.from(e.target.files || [])
        if (files.length === 0) return

        setUploading(true)
        try {
            for (const file of files) {
                const fd = new FormData()
                fd.append('file', file)
                const res = await fetch('/api/upload-project-image', {
                    method: 'POST',
                    body: fd,
                })
                if (res.ok) {
                    const { url } = await res.json()
                    setImages(prev => [...prev, url])
                } else {
                    console.error('Upload failed:', await res.text())
                }
            }
        } finally {
            setUploading(false)
            if (fileInputRef.current) fileInputRef.current.value = ''
        }
    }

    const removeImage = (index: number) => {
        setImages(prev => prev.filter((_, i) => i !== index))
    }

    const makePrimary = (index: number) => {
        if (index === 0) return
        setImages(prev => {
            const copy = [...prev]
            const [img] = copy.splice(index, 1)
            return [img, ...copy]
        })
    }

    return (
        <div className="space-y-4">
            <div className="flex items-center justify-between mb-3 ml-1">
                <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest">Foto's ({images.length})</label>
                <p className="text-[10px] text-gray-400 font-medium">Eerste foto = hoofdafbeelding</p>
            </div>

            {images.length > 0 && (
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                    {images.map((img, idx) => (
                        <div key={`${img}-${idx}`} className="relative group aspect-square rounded-xl overflow-hidden border border-gray-100 shadow-sm">
                            <img src={img} alt="" className="w-full h-full object-cover" />
                            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-colors flex items-end p-2 opacity-0 group-hover:opacity-100">
                                <div className="flex gap-1 w-full">
                                    {idx !== 0 && (
                                        <button
                                            type="button"
                                            onClick={() => makePrimary(idx)}
                                            className="flex-1 text-[10px] bg-white text-gray-900 font-bold px-2 py-1 rounded hover:bg-brand-primary hover:text-white transition-colors"
                                            title="Maak hoofdafbeelding"
                                        >
                                            Hoofd
                                        </button>
                                    )}
                                    <button
                                        type="button"
                                        onClick={() => removeImage(idx)}
                                        className="flex-1 text-[10px] bg-red-500 text-white font-bold px-2 py-1 rounded hover:bg-red-600 transition-colors"
                                    >
                                        Verwijder
                                    </button>
                                </div>
                            </div>
                            {idx === 0 && (
                                <span className="absolute top-2 left-2 bg-brand-primary text-white text-[9px] font-black uppercase tracking-wider px-2 py-1 rounded">Hoofd</span>
                            )}
                        </div>
                    ))}
                </div>
            )}

            <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                disabled={uploading}
                className="w-full px-6 py-4 bg-brand-primary/5 hover:bg-brand-primary/10 border-2 border-dashed border-brand-primary/20 hover:border-brand-primary/40 rounded-2xl transition-all flex items-center justify-center gap-3 font-bold text-brand-primary disabled:opacity-50"
            >
                <UploadIcon size={24} />
                {uploading ? 'Uploaden...' : 'Foto\'s toevoegen'}
            </button>

            <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                multiple
                className="hidden"
                onChange={handleUpload}
            />

            <input type="hidden" name="images" value={JSON.stringify(images)} />
        </div>
    )
}
