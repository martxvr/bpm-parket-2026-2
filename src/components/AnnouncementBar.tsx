'use client'

import { useState, useEffect } from 'react'
import XIcon from '@/components/ui/x-icon'

type Props = {
    texts: string[]
    bgColor?: string
}

function getLuminance(hex: string): number {
    const clean = hex.replace('#', '')
    const r = parseInt(clean.slice(0, 2), 16) / 255
    const g = parseInt(clean.slice(2, 4), 16) / 255
    const b = parseInt(clean.slice(4, 6), 16) / 255
    const toLinear = (c: number) => c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4
    return 0.2126 * toLinear(r) + 0.7152 * toLinear(g) + 0.0722 * toLinear(b)
}

function getAccessibleTextColor(bgHex: string): string {
    const L = getLuminance(bgHex)
    const whiteContrast = (1 + 0.05) / (L + 0.05)
    const blackContrast = (L + 0.05) / (0 + 0.05)
    return whiteContrast >= blackContrast ? '#ffffff' : '#000000'
}

export default function AnnouncementBar({ texts, bgColor = '#1a6b3a' }: Props) {
    const [dismissed, setDismissed] = useState(false)
    const [index, setIndex] = useState(0)
    const [visible, setVisible] = useState(true)

    useEffect(() => {
        if (texts.length <= 1) return
        const interval = setInterval(() => {
            setVisible(false)
            setTimeout(() => {
                setIndex(i => (i + 1) % texts.length)
                setVisible(true)
            }, 400)
        }, 5000)
        return () => clearInterval(interval)
    }, [texts.length])

    if (dismissed || texts.length === 0) return null

    const textColor = getAccessibleTextColor(bgColor)
    const isDark = textColor === '#ffffff'

    return (
        <div
            className="w-full text-sm py-2 px-10 flex items-center justify-center relative overflow-hidden"
            style={{ backgroundColor: bgColor, color: textColor }}
        >
            <div
                style={{
                    opacity: visible ? 1 : 0,
                    transform: visible ? 'translateY(0)' : 'translateY(-6px)',
                    transition: 'opacity 0.4s ease, transform 0.4s ease',
                }}
                className={`font-semibold text-center leading-snug [&_a]:underline [&_a]:underline-offset-2 [&_a]:font-bold [&_a:hover]:opacity-70 [&_strong]:font-extrabold [&_em]:italic ${isDark ? '[&_a]:text-white' : '[&_a]:text-black'}`}
                dangerouslySetInnerHTML={{ __html: texts[index] }}
            />
            <button
                onClick={() => setDismissed(true)}
                aria-label="Sluiten"
                className={`absolute right-3 top-1/2 -translate-y-1/2 p-1 rounded transition-colors ${isDark ? 'hover:bg-white/20' : 'hover:bg-black/10'}`}
            >
                <XIcon size={16} />
            </button>
        </div>
    )
}
