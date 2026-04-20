"use client"

import React, { useEffect } from 'react'
import Link from 'next/link'
import { useRouter, useParams } from 'next/navigation'
import ArrowBackIcon from '@/components/ui/arrow-back-icon'
import RightChevron from '@/components/ui/right-chevron'
import ArrowNarrowRightIcon from '@/components/ui/arrow-narrow-right-icon'
import Button from '@/components/Button'
import {
    getCategoryBySlug,
    getTypeBySlug,
    getBrandsByType,
    getProductsByType,
} from '@/data/brands'

export default function TypeBrandsPage() {
    const router = useRouter()
    const params = useParams()
    const categorySlug = params.category as string
    const typeSlug = params.typeSlug as string

    const category = getCategoryBySlug(categorySlug)
    const type = getTypeBySlug(categorySlug, typeSlug)
    const brands = getBrandsByType(categorySlug, typeSlug)
    const productMatches = getProductsByType(typeSlug)
    const uniqueBrandSlugsFromProducts = Array.from(new Set(productMatches.map(m => `${m.categorySlug}/${m.brand.slug}`)))

    // Map brand slug -> its home categorySlug so brand links go to the correct brand detail page
    const brandCategoryMap = new Map<string, string>()
    for (const match of productMatches) {
        if (!brandCategoryMap.has(match.brand.slug)) {
            brandCategoryMap.set(match.brand.slug, match.categorySlug)
        }
    }

    useEffect(() => {
        const observerOptions = { threshold: 0, rootMargin: '0px 0px -50px 0px' }
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

    if (!category || !type) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[60vh] text-center px-4">
                <h1 className="text-4xl font-bold text-brand-dark mb-4">Niet gevonden</h1>
                <p className="text-gray-400 mb-8">Deze categorie of product type bestaat niet.</p>
                <Button onClick={() => router.back()} withIcon>Terug</Button>
            </div>
        )
    }

    return (
        <div className="flex flex-col w-full bg-white text-brand-dark">

            {/* Breadcrumb */}
            <div className="bg-gray-50 border-b border-gray-100">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
                    <div className="flex items-center gap-2 text-sm text-gray-400">
                        <Link href="/" className="hover:text-brand-primary transition-colors">Home</Link>
                        <RightChevron size={12} />
                        <Link href={`/producten/${categorySlug}`} className="hover:text-brand-primary transition-colors">{category.name}</Link>
                        <RightChevron size={12} />
                        <span className="text-brand-dark font-medium">{type.name}</span>
                    </div>
                </div>
            </div>

            {/* Hero */}
            <section className="relative pt-16 pb-20 lg:pt-24 lg:pb-28 bg-brand-dark overflow-hidden reveal reveal-active">
                <div className="absolute inset-0 bg-gradient-to-br from-brand-primary/5 via-transparent to-brand-secondary/5" />
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                    <button
                        onClick={() => router.push(`/producten/${categorySlug}`)}
                        className="flex items-center gap-2 text-sm text-white/40 hover:text-white transition-colors mb-8 group"
                    >
                        <ArrowBackIcon size={16} className="group-hover:-translate-x-1 transition-transform" />
                        Terug naar {category.name}
                    </button>

                    <span className="text-xs font-bold tracking-[0.2em] text-brand-primary uppercase mb-4 block">{category.name}</span>
                    <h1 className="text-5xl lg:text-6xl font-bold text-white mb-6 leading-tight tracking-tight">
                        {type.name}
                    </h1>
                    <p className="text-lg text-white/50 leading-relaxed max-w-xl">
                        Ontdek de merken die {type.name.toLowerCase()} aanbieden. Kies uw favoriete merk voor de volledige collectie.
                    </p>
                </div>
            </section>

            {/* Brands Grid */}
            {brands.length > 0 ? (
                <section className="py-20 lg:py-28 bg-white reveal">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="text-center mb-16">
                            <span className="text-xs font-bold tracking-[0.2em] text-brand-primary uppercase mb-4 block">Kies een merk</span>
                            <h2 className="text-3xl lg:text-4xl font-bold text-brand-dark">
                                {brands.length} {brands.length === 1 ? 'merk' : 'merken'} met <span className="text-brand-primary">{type.name.toLowerCase()}</span>
                            </h2>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                            {brands.map((brand) => {
                                const matchingProducts = productMatches.filter(m => m.brand.slug === brand.slug)
                                const brandHomeCategory = brandCategoryMap.get(brand.slug) || categorySlug
                                return (
                                    <Link
                                        key={brand.slug}
                                        href={`/producten/${brandHomeCategory}/${brand.slug}?type=${type.slug}`}
                                        className="group relative bg-white border border-gray-100 rounded-2xl p-8 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col"
                                    >
                                        {brand.logoUrl && (
                                            <div className="h-20 mb-6 flex items-center">
                                                <img
                                                    src={brand.logoUrl}
                                                    alt={`${brand.name} logo`}
                                                    className="max-h-full w-auto object-contain mix-blend-multiply group-hover:scale-105 transition-transform duration-300"
                                                />
                                            </div>
                                        )}
                                        <h3 className="text-xl font-bold text-brand-dark mb-2">{brand.name}</h3>
                                        <p className="text-sm text-gray-400 leading-relaxed mb-4 flex-grow">
                                            {brand.shortDescription}
                                        </p>
                                        <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                                            <span className="text-xs font-bold text-gray-500">
                                                {matchingProducts.length} {matchingProducts.length === 1 ? 'variant' : 'varianten'}
                                            </span>
                                            <span className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-brand-primary group-hover:text-brand-secondary transition-colors">
                                                Bekijk collectie
                                                <ArrowNarrowRightIcon size={14} className="group-hover:translate-x-1 transition-transform" />
                                            </span>
                                        </div>
                                    </Link>
                                )
                            })}
                        </div>
                    </div>
                </section>
            ) : (
                <section className="py-24 bg-white">
                    <div className="max-w-3xl mx-auto px-4 text-center">
                        <h2 className="text-3xl font-bold text-brand-dark mb-4">
                            Geen merken gevonden
                        </h2>
                        <p className="text-gray-500 mb-8">
                            Er zijn momenteel geen merken die <strong>{type.name.toLowerCase()}</strong> aanbieden in onze collectie.
                        </p>
                        <Button size="lg" withIcon onClick={() => router.push(`/producten/${categorySlug}`)}>
                            Terug naar {category.name}
                        </Button>
                    </div>
                </section>
            )}

            {/* CTA */}
            <section className="py-16 px-4 sm:px-6 lg:px-8 reveal">
                <div className="max-w-7xl mx-auto rounded-2xl bg-brand-dark p-12 lg:p-20 text-white relative overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-br from-brand-primary/10 via-transparent to-brand-secondary/10" />
                    <div className="relative z-10 max-w-2xl">
                        <h2 className="text-4xl lg:text-5xl font-bold mb-6">
                            Vragen over <span className="text-brand-primary">{type.name.toLowerCase()}</span>?
                        </h2>
                        <p className="text-lg opacity-60 mb-10">
                            Bezoek onze showroom in Doetinchem of vraag een vrijblijvende offerte aan. Onze specialisten adviseren u graag.
                        </p>
                        <div className="flex flex-wrap gap-4">
                            <Button size="lg" withIcon onClick={() => router.push('/offerte')}>Offerte Aanvragen</Button>
                            <button
                                onClick={() => router.push('/showroom')}
                                className="px-8 py-4 rounded-[5px] font-bold text-white border border-white/20 hover:bg-white/10 transition-all text-lg"
                            >
                                Bezoek Showroom
                            </button>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    )
}
