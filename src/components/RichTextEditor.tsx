'use client'

import { useRef, useState, useEffect, useCallback } from 'react'
import { Bold, Italic, Underline } from 'lucide-react'
import LinkIcon from '@/components/ui/link-icon'
import SimpleCheckedIcon from '@/components/ui/simple-checked-icon'
import XIcon from '@/components/ui/x-icon'
import TrashIcon from '@/components/ui/trash-icon'

type Props = {
    name: string
    defaultValue?: string
    placeholder?: string
    inputClassName?: string
}

type ActiveFormats = {
    bold: boolean
    italic: boolean
    underline: boolean
    link: boolean
}

export default function RichTextEditor({ name, defaultValue = '', placeholder, inputClassName }: Props) {
    const editorRef = useRef<HTMLDivElement>(null)
    const [htmlValue, setHtmlValue] = useState(defaultValue)
    const [linkPopover, setLinkPopover] = useState(false)
    const [linkUrl, setLinkUrl] = useState('https://')
    const [savedRange, setSavedRange] = useState<Range | null>(null)
    const [editingAnchor, setEditingAnchor] = useState<HTMLAnchorElement | null>(null)
    const [active, setActive] = useState<ActiveFormats>({ bold: false, italic: false, underline: false, link: false })

    useEffect(() => {
        if (editorRef.current) {
            editorRef.current.innerHTML = defaultValue
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    // Track active formats on every selection change
    const updateActiveFormats = useCallback(() => {
        const isBold = document.queryCommandState('bold')
        const isItalic = document.queryCommandState('italic')
        const isUnderline = document.queryCommandState('underline')

        // Check if cursor is inside an <a>
        const sel = window.getSelection()
        let anchor: HTMLAnchorElement | null = null
        if (sel && sel.rangeCount > 0) {
            let node: Node | null = sel.getRangeAt(0).commonAncestorContainer
            while (node && node !== editorRef.current) {
                if (node.nodeName === 'A') { anchor = node as HTMLAnchorElement; break }
                node = node.parentNode
            }
        }

        setActive({ bold: isBold, italic: isItalic, underline: isUnderline, link: !!anchor })
    }, [])

    useEffect(() => {
        document.addEventListener('selectionchange', updateActiveFormats)
        return () => document.removeEventListener('selectionchange', updateActiveFormats)
    }, [updateActiveFormats])

    function syncValue() {
        setHtmlValue(editorRef.current?.innerHTML ?? '')
    }

    function exec(command: string, value?: string) {
        editorRef.current?.focus()
        document.execCommand(command, false, value)
        syncValue()
        updateActiveFormats()
    }

    function saveRange() {
        const sel = window.getSelection()
        if (sel && sel.rangeCount > 0) setSavedRange(sel.getRangeAt(0).cloneRange())
    }

    function restoreRange() {
        if (!savedRange) return
        const sel = window.getSelection()
        sel?.removeAllRanges()
        sel?.addRange(savedRange)
    }

    function getAnchorAtCursor(): HTMLAnchorElement | null {
        const sel = window.getSelection()
        if (!sel || sel.rangeCount === 0) return null
        let node: Node | null = sel.getRangeAt(0).commonAncestorContainer
        while (node && node !== editorRef.current) {
            if (node.nodeName === 'A') return node as HTMLAnchorElement
            node = node.parentNode
        }
        return null
    }

    function handleLinkClick() {
        const anchor = getAnchorAtCursor()
        if (anchor) {
            // Edit existing link
            setEditingAnchor(anchor)
            setLinkUrl(anchor.getAttribute('href') ?? 'https://')
        } else {
            // Create new link — save selection first
            saveRange()
            setEditingAnchor(null)
            setLinkUrl('https://')
        }
        setLinkPopover(true)
    }

    function handleLinkConfirm() {
        if (editingAnchor) {
            // Update href on existing anchor
            editingAnchor.setAttribute('href', linkUrl)
            if (linkUrl.startsWith('http')) {
                editingAnchor.setAttribute('target', '_blank')
                editingAnchor.setAttribute('rel', 'noopener noreferrer')
            } else {
                editingAnchor.removeAttribute('target')
                editingAnchor.removeAttribute('rel')
            }
        } else {
            restoreRange()
            editorRef.current?.focus()
            document.execCommand('createLink', false, linkUrl)
            editorRef.current?.querySelectorAll('a:not([data-set])').forEach(a => {
                a.setAttribute('data-set', '1')
                if (linkUrl.startsWith('http')) {
                    a.setAttribute('target', '_blank')
                    a.setAttribute('rel', 'noopener noreferrer')
                }
            })
        }
        setLinkPopover(false)
        setEditingAnchor(null)
        syncValue()
        updateActiveFormats()
    }

    function handleLinkRemove() {
        if (editingAnchor) {
            // Unwrap the anchor — keep its text content
            const parent = editingAnchor.parentNode
            while (editingAnchor.firstChild) parent?.insertBefore(editingAnchor.firstChild, editingAnchor)
            parent?.removeChild(editingAnchor)
        } else {
            restoreRange()
            editorRef.current?.focus()
            document.execCommand('unlink')
        }
        setLinkPopover(false)
        setEditingAnchor(null)
        syncValue()
        updateActiveFormats()
    }

    function btn(isActive: boolean) {
        return `flex items-center justify-center w-8 h-8 rounded-md transition-colors ${
            isActive
                ? 'bg-brand-primary/10 text-brand-primary'
                : 'text-gray-500 hover:text-gray-900 hover:bg-gray-100'
        }`
    }

    return (
        <div>
            {/* Toolbar */}
            <div className="flex items-center gap-0.5 mb-1.5">
                <button type="button" title="Vet" onMouseDown={e => { e.preventDefault(); exec('bold') }} className={btn(active.bold)}>
                    <Bold className="w-4 h-4" strokeWidth={2.5} />
                </button>
                <button type="button" title="Schuin" onMouseDown={e => { e.preventDefault(); exec('italic') }} className={btn(active.italic)}>
                    <Italic className="w-4 h-4" strokeWidth={2.5} />
                </button>
                <button type="button" title="Onderstrepen" onMouseDown={e => { e.preventDefault(); exec('underline') }} className={btn(active.underline)}>
                    <Underline className="w-4 h-4" strokeWidth={2.5} />
                </button>

                <div className="w-px h-5 bg-gray-200 mx-1" />

                <button type="button" title={active.link ? 'Link bewerken' : 'Link toevoegen'} onMouseDown={e => { e.preventDefault(); handleLinkClick() }} className={btn(active.link)}>
                    <LinkIcon size={16} />
                </button>

                {linkPopover && (
                    <div className="flex items-center gap-1.5 ml-1 bg-white border border-gray-200 shadow-lg rounded-lg px-2 py-1.5 z-10">
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
                            className="text-xs w-48 outline-none text-gray-800 font-medium placeholder:text-gray-400"
                        />
                        <button type="button" onMouseDown={e => { e.preventDefault(); handleLinkConfirm() }} className="p-1 rounded hover:bg-green-50 text-green-600 transition-colors" title="Bevestigen">
                            <SimpleCheckedIcon size={14} />
                        </button>
                        {(editingAnchor || active.link) && (
                            <button type="button" onMouseDown={e => { e.preventDefault(); handleLinkRemove() }} className="p-1 rounded hover:bg-red-50 text-red-400 transition-colors" title="Link verwijderen">
                                <TrashIcon size={14} />
                            </button>
                        )}
                        <button type="button" onMouseDown={e => { e.preventDefault(); setLinkPopover(false) }} className="p-1 rounded hover:bg-gray-100 text-gray-400 transition-colors" title="Annuleren">
                            <XIcon size={14} />
                        </button>
                    </div>
                )}
            </div>

            {/* Contenteditable editor */}
            <div
                ref={editorRef}
                contentEditable
                suppressContentEditableWarning
                onInput={syncValue}
                data-placeholder={placeholder}
                className={`${inputClassName} rich-text-editor [&_a]:text-brand-primary [&_a]:underline [&_a]:underline-offset-2 [&_a:hover]:opacity-70`}
            />

            {/* Hidden input for form submission */}
            <input type="hidden" name={name} value={htmlValue} />
        </div>
    )
}
