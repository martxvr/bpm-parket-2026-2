'use client'

import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import SaveIcon from '@/components/ui/save-icon'
import ArrowBackIcon from '@/components/ui/arrow-back-icon'
import FileDescriptionIcon from '@/components/ui/file-description-icon'
import LayoutDashboardIcon from '@/components/ui/layout-dashboard-icon'
import { Policy } from '@/types'
import { saveDynamicPolicy } from '../actions'
import BeleidToolbar from '../BeleidToolbar'
import { useEditor, EditorContent } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import Underline from '@tiptap/extension-underline'
import LinkExtension from '@tiptap/extension-link'
import { TextStyle } from '@tiptap/extension-text-style'
import Color from '@tiptap/extension-color'
import TextAlign from '@tiptap/extension-text-align'

const inputClass = "w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-brand-primary/20 focus:border-brand-primary focus:bg-white transition-all outline-none font-medium text-gray-900"
const labelClass = "block text-xs font-bold text-gray-400 uppercase tracking-widest mb-2"

interface BeleidEditorProps {
    initialData: Policy | null
}

export default function BeleidEditor({ initialData }: BeleidEditorProps) {
    const router = useRouter()
    const [isSaving, setIsSaving] = useState(false)
    const [content, setContent] = useState(initialData?.content || '')

    const editor = useEditor({
        immediatelyRender: false,
        extensions: [
            StarterKit,
            Underline,
            LinkExtension.configure({ openOnClick: false }),
            TextStyle,
            Color,
            TextAlign.configure({ types: ['heading', 'paragraph'] }),
        ],
        content: initialData?.content || '',
        onUpdate: ({ editor }) => {
            setContent(editor.getHTML())
        },
        editorProps: {
            attributes: {
                class: 'w-full min-h-[500px] px-6 py-10 bg-transparent outline-none font-medium text-gray-700 prose prose-lg prose-gray max-w-none prose-headings:font-extrabold prose-headings:text-gray-900 prose-a:text-brand-primary prose-a:cursor-pointer hover:prose-a:text-brand-secondary prose-strong:text-gray-900',
            },
        },
    })

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        setIsSaving(true)
        try {
            const formData = new FormData(e.currentTarget)
            await saveDynamicPolicy(formData)
            router.push('/admin/beleid')
            router.refresh()
        } catch (error) {
            console.error('Error saving policy:', error)
            alert('Er is een fout opgetreden bij het opslaan.')
            setIsSaving(false)
        }
    }

    return (
        <div className="max-w-4xl mx-auto space-y-8 animate-fade-in pb-20">
            {/* Header */}
            <div className="flex items-center justify-between border-b border-gray-100 pb-6">
                <div className="flex items-center gap-4">
                    <Link
                        href="/admin/beleid"
                        className="p-2.5 bg-gray-50 text-gray-500 hover:text-brand-primary hover:bg-brand-primary/10 rounded-xl transition-all group"
                    >
                        <ArrowBackIcon size={20} className="group-hover:-translate-x-1 transition-transform" />
                    </Link>
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900 tracking-tight flex items-center gap-3">
                            <FileDescriptionIcon size={24} className="text-brand-primary" />
                            {initialData ? 'Pagina Bewerken' : 'Nieuwe Pagina'}
                        </h1>
                        <p className="text-gray-500 text-sm mt-1">
                            {initialData ? 'Pas de inhoud van deze pagina aan.' : 'Maak een nieuwe beleidspagina aan voor in de footer.'}
                        </p>
                    </div>
                </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6 animate-slide-up">
                {/* ID Field (Hidden) */}
                <input type="hidden" name="id" value={initialData?.id || 'new'} />
                
                {/* Hidden content for the form to submit correctly */}
                <input type="hidden" name="content" value={content} />

                {/* Main Content Card */}
                <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                    <div className="p-6 border-b border-gray-50 bg-gray-50/50 flex items-center gap-2">
                        <LayoutDashboardIcon size={20} className="text-gray-400" />
                        <h2 className="text-sm font-bold text-gray-700">Pagina Gegevens</h2>
                    </div>

                    <div className="p-6 space-y-6">
                        <div>
                            <label className={labelClass}>Titel van de pagina</label>
                            <input
                                type="text"
                                name="title"
                                required
                                defaultValue={initialData?.title}
                                className={inputClass}
                                placeholder="Bijv. Privacyverklaring, Algemene Voorwaarden..."
                            />
                            <p className="text-xs text-gray-400 mt-2">
                                De URL wordt automatisch gegenereerd op basis van de titel.
                            </p>
                        </div>

                        <div className="pt-2">
                            <label className={labelClass}>Inhoud (Visuele Editor)</label>
                            
                            <div className="relative mt-8">
                                <div className="absolute left-1/2 -top-6 -translate-x-1/2 z-10 transition-transform duration-300">
                                    <BeleidToolbar editor={editor} />
                                </div>
                                <div className="bg-white rounded-[20px] border border-gray-200 focus-within:ring-1 focus-within:ring-[#84cc16] focus-within:border-[#84cc16] transition-all overflow-hidden cursor-text" onClick={() => editor?.commands.focus()}>
                                    <EditorContent editor={editor} />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Actions */}
                <div className="flex items-center justify-end gap-3 pt-4 border-t border-gray-100">
                    <Link
                        href="/admin/beleid"
                        className="px-6 py-3 rounded-xl font-bold text-gray-500 hover:bg-gray-100 transition-colors"
                    >
                        Annuleren
                    </Link>
                    <button
                        type="submit"
                        disabled={isSaving}
                        className="bg-brand-primary hover:bg-brand-secondary text-white px-8 py-3 rounded-xl flex items-center gap-2 font-bold shadow-lg shadow-brand-primary/20 transition-all hover:scale-105 active:scale-95 disabled:opacity-70 disabled:hover:scale-100"
                    >
                        {isSaving ? (
                            <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        ) : (
                            <SaveIcon size={20} />
                        )}
                        {isSaving ? 'Bezig met opslaan...' : 'Pagina Opslaan'}
                    </button>
                </div>
            </form>
        </div>
    )
}
