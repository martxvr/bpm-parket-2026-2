'use client'

import { useRef, useState } from 'react'
import { Bold, Italic, Underline } from 'lucide-react'
import LinkIcon from '@/components/ui/link-icon'
import SimpleCheckedIcon from '@/components/ui/simple-checked-icon'
import XIcon from '@/components/ui/x-icon'

type Props = {
    name: string
    defaultValue?: string
    placeholder?: string
    className?: string
}

export default function MarkdownEditor({ name, defaultValue = '', placeholder, className }: Props) {
    const inputRef = useRef<HTMLInputElement>(null)
    const [value, setValue] = useState(defaultValue)
    const [linkPopover, setLinkPopover] = useState(false)
    const [linkUrl, setLinkUrl] = useState('https://')
    const [savedSelection, setSavedSelection] = useState<{ start: number; end: number } | null>(null)

    function wrapSelection(before: string, after: string) {
        const el = inputRef.current
        if (!el) return
        const start = el.selectionStart ?? value.length
        const end = el.selectionEnd ?? value.length
        const selected = value.slice(start, end)
        const newValue = value.slice(0, start) + before + selected + after + value.slice(end)
        setValue(newValue)
        requestAnimationFrame(() => {
            el.focus()
            const cursor = start + before.length + selected.length + after.length
            el.setSelectionRange(cursor, cursor)
        })
    }

    function handleLinkClick() {
        const el = inputRef.current
        if (!el) return
        setSavedSelection({ start: el.selectionStart ?? 0, end: el.selectionEnd ?? 0 })
        setLinkUrl('https://')
        setLinkPopover(true)
    }

    function handleLinkConfirm() {
        const el = inputRef.current
        if (!el || !savedSelection) return
        const { start, end } = savedSelection
        const selected = value.slice(start, end) || 'link tekst'
        const newValue = value.slice(0, start) + `[${selected}](${linkUrl})` + value.slice(end)
        setValue(newValue)
        setLinkPopover(false)
        requestAnimationFrame(() => el.focus())
    }

    const toolbarBtn = "flex items-center justify-center w-8 h-8 rounded-md text-gray-500 hover:text-gray-900 hover:bg-gray-100 transition-colors"

    return (
        <div>
            {/* Toolbar */}
            <div className="flex items-center gap-0.5 mb-1.5">
                <button type="button" title="Vet" onClick={() => wrapSelection('**', '**')} className={toolbarBtn}>
                    <Bold className="w-4 h-4" strokeWidth={2.5} />
                </button>
                <button type="button" title="Schuin" onClick={() => wrapSelection('*', '*')} className={toolbarBtn}>
                    <Italic className="w-4 h-4" strokeWidth={2.5} />
                </button>
                <button type="button" title="Onderstrepen" onClick={() => wrapSelection('<u>', '</u>')} className={toolbarBtn}>
                    <Underline className="w-4 h-4" strokeWidth={2.5} />
                </button>

                <div className="w-px h-5 bg-gray-200 mx-1" />

                <button type="button" title="Link toevoegen (selecteer tekst eerst)" onClick={handleLinkClick} className={toolbarBtn}>
                    <LinkIcon size={16} />
                </button>

                {/* Link popover */}
                {linkPopover && (
                    <div className="flex items-center gap-1.5 ml-1 bg-white border border-gray-200 shadow-lg rounded-lg px-2 py-1.5 animate-fade-in z-10">
                        <input
                            autoFocus
                            type="text"
                            value={linkUrl}
                            onChange={e => setLinkUrl(e.target.value)}
                            onKeyDown={e => {
                                if (e.key === 'Enter') { e.preventDefault(); handleLinkConfirm() }
                                if (e.key === 'Escape') setLinkPopover(false)
                            }}
                            placeholder="https://... of /pad"
                            className="text-xs w-52 outline-none text-gray-800 font-medium placeholder:text-gray-400"
                        />
                        <button type="button" onClick={handleLinkConfirm} className="p-1 rounded hover:bg-green-50 text-green-600 transition-colors">
                            <SimpleCheckedIcon size={14} />
                        </button>
                        <button type="button" onClick={() => setLinkPopover(false)} className="p-1 rounded hover:bg-red-50 text-red-400 transition-colors">
                            <XIcon size={14} />
                        </button>
                    </div>
                )}
            </div>

            {/* Input */}
            <input
                ref={inputRef}
                type="text"
                name={name}
                value={value}
                onChange={e => setValue(e.target.value)}
                placeholder={placeholder}
                className={className}
            />
        </div>
    )
}
