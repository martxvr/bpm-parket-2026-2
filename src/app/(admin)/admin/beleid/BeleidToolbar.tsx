'use client'

import React, { useState } from 'react'
import { Bold, Italic, Underline, Link as LinkIcon, AlignLeft, AlignCenter, AlignRight } from 'lucide-react'
import DownChevron from '@/components/ui/down-chevron'
import { Editor } from '@tiptap/react'

interface BeleidToolbarProps {
    editor: Editor | null
}

export default function BeleidToolbar({ editor }: BeleidToolbarProps) {
    const [showTypeDropdown, setShowTypeDropdown] = useState(false)
    const [showColorPicker, setShowColorPicker] = useState(false)

    if (!editor) {
        return null
    }

    const setLink = () => {
        const previousUrl = editor.getAttributes('link').href
        const url = window.prompt('URL', previousUrl)

        if (url === null) {
            return
        }

        if (url === '') {
            editor.chain().focus().extendMarkRange('link').unsetLink().run()
            return
        }

        editor.chain().focus().extendMarkRange('link').setLink({ href: url }).run()
    }

    const applyColor = (color: string) => {
        setShowColorPicker(false)
        editor.chain().focus().setColor(color).run()
    }

    const activeBtnClass = "bg-[#84cc16]/20 text-[#84cc16] hover:bg-[#84cc16]/30"
    const defaultBtnClass = "text-gray-400 hover:text-gray-600 hover:bg-gray-50"
    
    // Extracted logic for button rendering
    const ToolbarButton = ({ 
        icon: Icon, active, onClick, title 
    }: { 
        icon: React.ElementType, active?: boolean, onClick: () => void, title: string 
    }) => (
        <button 
            type="button" 
            title={title} 
            onClick={(e) => { e.preventDefault(); onClick(); }} 
            className={`p-1.5 rounded-xl transition-all flex items-center justify-center w-8 h-8 ${active ? activeBtnClass : defaultBtnClass}`}
        >
            <Icon className="w-[18px] h-[18px] stroke-[2.5px]" />
        </button>
    )

    const dividerClass = "w-px h-5 bg-gray-200 mx-1.5"

    // Helper text for Type Dropdown
    const getActiveTypeLabel = () => {
        if (editor.isActive('heading', { level: 1 })) return 'Kop 1 (H1)'
        if (editor.isActive('heading', { level: 2 })) return 'Kop 2 (H2)'
        if (editor.isActive('heading', { level: 3 })) return 'Kop 3 (H3)'
        return 'Body 2'
    }

    return (
        <div className="bg-white/95 backdrop-blur-xl border border-gray-100 shadow-[0_4px_16px_rgba(0,0,0,0.06)] rounded-2xl p-1.5 flex items-center gap-0.5 pointer-events-auto">
            
            {/* Typography Dropdown */}
            <div className="relative">
                <button 
                    type="button"
                    onClick={(e) => { e.preventDefault(); setShowTypeDropdown(!showTypeDropdown) }}
                    className="flex items-center gap-2 pl-3 pr-2 h-8 bg-gray-50/80 hover:bg-gray-100 rounded-[10px] text-[13px] font-bold text-gray-700 transition-all mr-1"
                >
                    <span className="min-w-16 text-left">{getActiveTypeLabel()}</span>
                    <DownChevron size={14} className="text-gray-400" />
                </button>

                {showTypeDropdown && (
                    <div className="absolute top-10 left-0 min-w-40 bg-white border border-gray-100 shadow-xl rounded-xl p-1.5 z-20 animate-slide-up">
                        <button type="button" onClick={() => { setShowTypeDropdown(false); editor.chain().focus().setParagraph().run() }} className={`w-full text-left px-3 py-2 rounded-lg hover:bg-gray-50 text-sm font-medium ${editor.isActive('paragraph') ? 'text-brand-primary bg-brand-primary/5' : 'text-gray-700'}`}>Body Tekst</button>
                        <button type="button" onClick={() => { setShowTypeDropdown(false); editor.chain().focus().toggleHeading({ level: 1 }).run() }} className={`w-full text-left px-3 py-2 rounded-lg hover:bg-gray-50 text-lg font-bold ${editor.isActive('heading', { level: 1 }) ? 'text-brand-primary bg-brand-primary/5' : 'text-gray-900'}`}>Kop 1 (H1)</button>
                        <button type="button" onClick={() => { setShowTypeDropdown(false); editor.chain().focus().toggleHeading({ level: 2 }).run() }} className={`w-full text-left px-3 py-2 rounded-lg hover:bg-gray-50 text-base font-bold ${editor.isActive('heading', { level: 2 }) ? 'text-brand-primary bg-brand-primary/5' : 'text-gray-800'}`}>Kop 2 (H2)</button>
                        <button type="button" onClick={() => { setShowTypeDropdown(false); editor.chain().focus().toggleHeading({ level: 3 }).run() }} className={`w-full text-left px-3 py-2 rounded-lg hover:bg-gray-50 text-sm font-bold ${editor.isActive('heading', { level: 3 }) ? 'text-brand-primary bg-brand-primary/5' : 'text-gray-700'}`}>Kop 3 (H3)</button>
                    </div>
                )}
            </div>

            <div className={dividerClass} />

            <ToolbarButton icon={Bold} title="Bold ⌘+B" active={editor.isActive('bold')} onClick={() => editor.chain().focus().toggleBold().run()} />
            <ToolbarButton icon={Italic} title="Italic ⌘+I" active={editor.isActive('italic')} onClick={() => editor.chain().focus().toggleItalic().run()} />
            <ToolbarButton icon={Underline} title="Underline ⌘+U" active={editor.isActive('underline')} onClick={() => editor.chain().focus().toggleUnderline().run()} />

            <div className={dividerClass} />

            <ToolbarButton icon={LinkIcon} title="Link" active={editor.isActive('link')} onClick={setLink} />

            <div className="relative">
                <button type="button" title="Kleur" onClick={(e) => { e.preventDefault(); setShowColorPicker(!showColorPicker) }} className={`p-1.5 rounded-xl transition-all flex items-center justify-center w-8 h-8 ${editor.getAttributes('textStyle').color ? activeBtnClass : defaultBtnClass}`}>
                    <div className="w-4 h-4 rounded-full bg-gradient-to-tr from-[#1f2937] to-[#4b5563] shadow-sm border border-black/10" style={{ background: editor.getAttributes('textStyle').color ? editor.getAttributes('textStyle').color : '' }} />
                </button>
                {showColorPicker && (
                    <div className="absolute top-10 left-1/2 -translate-x-1/2 bg-white border border-gray-100 shadow-xl rounded-2xl p-2 z-20 animate-slide-up flex gap-1.5">
                        {['#111827', '#dc2626', '#16a34a', '#2563eb', '#ca8a04', '#9333ea'].map(color => (
                            <button
                                key={color}
                                type="button"
                                onClick={() => applyColor(color)}
                                className="w-7 h-7 rounded-full shadow-inner border border-black/5 hover:scale-110 transition-transform"
                                style={{ backgroundColor: color }}
                            />
                        ))}
                    </div>
                )}
            </div>

            <div className={dividerClass} />

            <ToolbarButton icon={AlignLeft} title="Align Left" active={editor.isActive({ textAlign: 'left' })} onClick={() => editor.chain().focus().setTextAlign('left').run()} />
            <ToolbarButton icon={AlignCenter} title="Align Center" active={editor.isActive({ textAlign: 'center' })} onClick={() => editor.chain().focus().setTextAlign('center').run()} />
            <ToolbarButton icon={AlignRight} title="Align Right" active={editor.isActive({ textAlign: 'right' })} onClick={() => editor.chain().focus().setTextAlign('right').run()} />
        </div>
    )
}
