"use client"

import React, { useEffect } from 'react'
import Link from 'next/link'
import TelephoneIcon from '@/components/ui/telephone-icon'
import ArrowNarrowRightIcon from '@/components/ui/arrow-narrow-right-icon'
import { companyConfig } from '@/config'

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

export default function ActievloerenPageClient({ actievloeren }: { actievloeren: Actievloer[] }) {
    useEffect(() => {
        const observerOptions = { threshold: 0.1, rootMargin: "0px 0px -50px 0px" }
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('reveal-active')
                    observer.unobserve(entry.target)
                }
            })
        }, observerOptions)
        const elements = document.querySelectorAll('.reveal')
        elements.forEach(el => observer.observe(el))
        return () => observer.disconnect()
    }, [])

    return (
        <div className="flex flex-col w-full bg-white text-brand-dark">
            {/* Hero */}
            <section className="relative pt-24 pb-20 lg:pt-32 lg:pb-28 bg-brand-dark overflow-hidden reveal reveal-active">
                <div className="absolute inset-0 z-0">
                    <div className="absolute inset-0 bg-gradient-to-t from-brand-dark via-brand-dark/90 to-brand-dark/70" />
                </div>
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                    <div className="max-w-3xl">
                        <div className="flex items-center gap-2 mb-6">
                            <div className="h-px w-8 bg-brand-primary" />
                            <span className="text-xs font-bold tracking-[0.2em] text-brand-primary uppercase">Scherpe Aanbiedingen</span>
                        </div>
                        <h1 className="text-5xl lg:text-7xl font-bold text-white mb-6 leading-[1.05] tracking-tight">
                            Actie<span className="text-brand-primary">vloeren</span>
                        </h1>
                        <p className="text-lg text-gray-300 max-w-2xl leading-relaxed">
                            Profiteer van onze scherp geprijsde vloeren met aantrekkelijke kortingen.
                            Topkwaliteit voor de beste prijs, zolang de voorraad strekt.
                        </p>
                    </div>
                </div>
            </section>

            {/* Grid */}
            <section className="py-20 lg:py-28 reveal">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    {actievloeren.length === 0 ? (
                        <div className="text-center py-24">
                            <p className="text-2xl font-bold text-gray-300 mb-4">Momenteel geen actievloeren beschikbaar</p>
                            <p className="text-gray-400 mb-8">Neem contact met ons op voor de nieuwste aanbiedingen.</p>
                            <Link
                                href="/offerte"
                                className="inline-flex items-center gap-2 bg-brand-primary text-white px-8 py-4 rounded-[5px] font-medium hover:bg-brand-secondary transition-colors"
                            >
                                Vraag een offerte aan
                                <ArrowNarrowRightIcon size={18} />
                            </Link>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                            {actievloeren.map((item, index) => (
                                <div
                                    key={item.id}
                                    className="group bg-white rounded-2xl border border-gray-100 overflow-hidden hover:shadow-2xl transition-all duration-500 reveal"
                                    style={{ transitionDelay: `${index * 100}ms` }}
                                >
                                    {/* Image */}
                                    <div className="relative h-56 overflow-hidden">
                                        {item.image_url ? (
                                            <img
                                                src={item.image_url}
                                                alt={item.name}
                                                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                                            />
                                        ) : (
                                            <div className="w-full h-full bg-gray-100 flex items-center justify-center">
                                                <span className="text-gray-300">Geen afbeelding</span>
                                            </div>
                                        )}
                                        {/* Brand tag top-left */}
                                        <div className="absolute top-3 left-3">
                                            <span className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full bg-white/90 text-gray-700 backdrop-blur-sm">
                                                {item.brand}
                                            </span>
                                        </div>
                                        {/* Discount badge top-right */}
                                        <div className="absolute top-3 right-3">
                                            <span className="text-sm font-bold px-3 py-1.5 rounded-full bg-red-500 text-white shadow-lg">
                                                -{item.discount_percentage}%
                                            </span>
                                        </div>
                                    </div>

                                    {/* Content */}
                                    <div className="p-6">
                                        <h3 className="text-lg font-bold text-gray-900 mb-1">{item.name}</h3>
                                        {item.collection && (
                                            <p className="text-sm text-gray-500 mb-3">{item.collection}</p>
                                        )}
                                        {item.description && (
                                            <p className="text-sm text-gray-600 mb-4 line-clamp-2">{item.description}</p>
                                        )}

                                        {/* Specs */}
                                        {item.specs && Object.keys(item.specs).length > 0 && (
                                            <div className="space-y-1.5 mb-5">
                                                {Object.entries(item.specs).map(([key, value]) => (
                                                    <div key={key} className="flex justify-between text-xs">
                                                        <span className="text-gray-400">{key}</span>
                                                        <span className="text-gray-700 font-medium">{value}</span>
                                                    </div>
                                                ))}
                                            </div>
                                        )}

                                        {/* CTA */}
                                        <Link
                                            href="/offerte"
                                            className="inline-flex items-center gap-2 w-full justify-center bg-brand-primary text-white px-6 py-3 rounded-[5px] font-medium hover:bg-brand-secondary transition-colors text-sm group/btn"
                                        >
                                            Vraag offerte aan
                                            <ArrowNarrowRightIcon size={16} className="group-hover/btn:translate-x-1 transition-transform" />
                                        </Link>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </section>

            {/* Bottom CTA */}
            <section className="py-16 bg-gray-50 reveal">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
                        Meer weten over onze aanbiedingen?
                    </h2>
                    <p className="text-gray-500 mb-8 text-lg">
                        Bel ons voor persoonlijk advies of kom langs in onze showroom.
                    </p>
                    <a
                        href={`tel:${companyConfig.contact.phone.replace(/[\s-]/g, '')}`}
                        className="inline-flex items-center gap-3 bg-brand-dark text-white px-8 py-4 rounded-[5px] font-medium hover:bg-brand-dark/90 transition-colors text-lg"
                    >
                        <TelephoneIcon size={22} />
                        Bel {companyConfig.contact.phone}
                    </a>
                </div>
            </section>
        </div>
    )
}
