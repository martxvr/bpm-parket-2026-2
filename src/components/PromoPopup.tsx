"use client"

import { useState, useEffect } from 'react'
import { Tag } from 'lucide-react'
import XIcon from '@/components/ui/x-icon'

type PromoPopupProps = {
    title?: string
    body?: string
    enabled?: boolean
    display_style?: 'center' | 'bottom-left' | 'bottom-right'
}

export default function PromoPopup({ title, body, enabled, display_style = 'center' }: PromoPopupProps) {
    const [isVisible, setIsVisible] = useState(false)

    const [isExpanded, setIsExpanded] = useState(false)

    useEffect(() => {
        if (!enabled || !title) return

        const dismissed = sessionStorage.getItem('promo_popup_dismissed')
        if (dismissed) return

        const timer = setTimeout(() => setIsVisible(true), 2000)
        return () => clearTimeout(timer)
    }, [enabled, title])

    const handleClose = () => {
        setIsVisible(false)
        sessionStorage.setItem('promo_popup_dismissed', 'true')
    }

    if (!isVisible || !enabled || !title) return null

    if (display_style === 'bottom-right' || display_style === 'bottom-left') {
        const positionClass = display_style === 'bottom-right' ? 'bottom-24 right-6' : 'bottom-6 left-6'
        
        return (
            <div className={`fixed ${positionClass} z-[9999] max-w-[320px] w-full pointer-events-none animate-fade-in`}>
                <div 
                    className="relative bg-white rounded-2xl shadow-2xl pointer-events-auto overflow-hidden border border-brand-primary/10 transition-all duration-300 ease-in-out"
                    style={{ 
                        animation: 'popupSlideUp 0.4s cubic-bezier(0.16, 1, 0.3, 1) forwards',
                        maxHeight: isExpanded ? '600px' : '300px'
                    }}
                >
                    <div className="h-1 bg-brand-primary" />
                    
                    <button
                        onClick={handleClose}
                        className="absolute top-2 right-2 w-6 h-6 flex items-center justify-center rounded-full bg-gray-50 text-gray-400 hover:bg-gray-100 transition-all z-10"
                    >
                        <XIcon size={12} />
                    </button>

                    <div className="p-5">
                        <div className="flex items-start gap-3 mb-3">
                            <div className="p-1.5 bg-brand-primary/10 rounded-lg shrink-0">
                                <Tag className="w-4 h-4 text-brand-primary" />
                            </div>
                            <h3 className="text-sm font-bold text-gray-900 leading-tight pr-4">{title}</h3>
                        </div>
                        <div className={`text-gray-600 text-[13px] leading-relaxed transition-all duration-300 ${isExpanded ? '' : 'line-clamp-4'}`}>
                            {body}
                        </div>
                        
                        {body && body.length > 100 && (
                            <button
                                onClick={() => setIsExpanded(!isExpanded)}
                                className="mt-2 text-brand-primary text-xs font-bold hover:underline transition-all"
                            >
                                {isExpanded ? 'Lees minder' : 'Lees meer...'}
                            </button>
                        )}

                        <button
                            onClick={handleClose}
                            className="mt-4 w-full py-2 bg-brand-primary text-white text-xs font-bold rounded-lg hover:bg-brand-secondary transition-colors shadow-sm"
                        >
                            Begrepen
                        </button>
                    </div>
                </div>
                <style jsx>{`
                    @keyframes popupSlideUp {
                        from { opacity: 0; transform: translateY(20px) scale(0.98); }
                        to { opacity: 1; transform: translateY(0) scale(1); }
                    }
                `}</style>
            </div>
        )
    }

    return (
        <>
            <div
                className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[9998] animate-fade-in cursor-pointer"
                onClick={handleClose}
            />

            <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 pointer-events-none animate-fade-in">
                <div
                    className="relative bg-white rounded-2xl shadow-2xl max-w-lg w-full pointer-events-auto overflow-hidden"
                    style={{ animation: 'popupSlideIn 0.4s cubic-bezier(0.16, 1, 0.3, 1) forwards' }}
                >
                    {/* Top accent bar */}
                    <div className="h-1.5 bg-gradient-to-r from-brand-primary via-brand-secondary to-brand-primary" />

                    {/* Close button */}
                    <button
                        onClick={handleClose}
                        className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center rounded-full bg-gray-100 text-gray-400 hover:bg-gray-200 hover:text-gray-600 transition-all z-10"
                        aria-label="Sluiten"
                    >
                        <XIcon size={16} />
                    </button>

                    {/* Content */}
                    <div className="p-8 pt-6">
                        <div className="flex items-center gap-3 mb-4">
                            <div className="p-2 bg-brand-primary/10 rounded-xl">
                                <Tag className="w-5 h-5 text-brand-primary" />
                            </div>
                            <h3 className="text-xl font-bold text-gray-900 leading-tight">{title}</h3>
                        </div>

                        <div className="text-gray-600 text-[15px] leading-relaxed whitespace-pre-line">
                            {body}
                        </div>
                    </div>

                    {/* Footer */}
                    <div className="px-8 pb-6">
                        <button
                            onClick={handleClose}
                            className="w-full py-3 bg-brand-primary text-white font-bold rounded-xl hover:bg-brand-secondary transition-colors text-sm"
                        >
                            Begrepen!
                        </button>
                    </div>
                </div>
            </div>

            <style jsx>{`
                @keyframes popupSlideIn {
                    from {
                        opacity: 0;
                        transform: translateY(20px) scale(0.96);
                    }
                    to {
                        opacity: 1;
                        transform: translateY(0) scale(1);
                    }
                }
            `}</style>
        </>
    )
}
