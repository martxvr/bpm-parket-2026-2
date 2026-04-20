"use client"

import React, { useEffect, useState, useCallback } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';
import ArrowBackIcon from '@/components/ui/arrow-back-icon';
import CheckedIcon from '@/components/ui/checked-icon';
import ArrowNarrowRightIcon from '@/components/ui/arrow-narrow-right-icon';
import RightChevron from '@/components/ui/right-chevron';
import XIcon from '@/components/ui/x-icon';
import ExpandIcon from '@/components/ui/expand-icon';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import Button from '@/components/Button';
import { getCategoryBySlug, getBrandBySlug } from '@/data/brands';

const getProxyUrl = (url?: string) => {
    if (!url) return '';
    return url.includes('ipcvloeren.nl') || url.includes('invictus.eu') ? `/api/image-proxy?url=${encodeURIComponent(url)}` : url;
};

export default function BrandDetailPage() {
    const [selectedImageIndex, setSelectedImageIndex] = useState<number | null>(null);
    const router = useRouter();
    const params = useParams();
    const categorySlug = params.category as string;
    const brandSlug = params.brand as string;

    const category = getCategoryBySlug(categorySlug);
    const brand = getBrandBySlug(categorySlug, brandSlug);

    const filteredProducts = brand?.products || [];

    const [brandProjects, setBrandProjects] = useState<any[]>([]);

    const moodImages = brand?.moodImages || [];
    const selectedImage = selectedImageIndex !== null ? moodImages[selectedImageIndex] : null;

    const goNext = useCallback(() => {
        if (selectedImageIndex === null || moodImages.length === 0) return;
        setSelectedImageIndex((selectedImageIndex + 1) % moodImages.length);
    }, [selectedImageIndex, moodImages.length]);

    const goPrev = useCallback(() => {
        if (selectedImageIndex === null || moodImages.length === 0) return;
        setSelectedImageIndex((selectedImageIndex - 1 + moodImages.length) % moodImages.length);
    }, [selectedImageIndex, moodImages.length]);

    useEffect(() => {
        if (selectedImageIndex === null) return;
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === 'ArrowRight') goNext();
            else if (e.key === 'ArrowLeft') goPrev();
            else if (e.key === 'Escape') setSelectedImageIndex(null);
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [selectedImageIndex, goNext, goPrev]);

    useEffect(() => {
        if (brandSlug) {
            fetch(`/api/projects-by-brand?brand=${brandSlug}`)
                .then(r => r.json())
                .then(data => setBrandProjects(data));
        }
    }, [brandSlug]);

    useEffect(() => {
        const observerOptions = { threshold: 0, rootMargin: "0px 0px -50px 0px" };
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('reveal-active');
                    observer.unobserve(entry.target);
                }
            });
        }, observerOptions);
        const elements = document.querySelectorAll('.reveal');
        elements.forEach(el => observer.observe(el));
        return () => observer.disconnect();
    }, []);

    if (!category || !brand) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[60vh] text-center px-4">
                <h1 className="text-4xl font-bold text-brand-dark mb-4">Merk niet gevonden</h1>
                <p className="text-gray-400 mb-8">Het gevraagde merk kon niet worden gevonden.</p>
                <Button onClick={() => router.back()} withIcon>Terug</Button>
            </div>
        );
    }

    const otherBrands = category.brands.filter(b => b.slug !== brand.slug);

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
                        <span className="text-brand-dark font-medium">{brand.name}</span>
                    </div>
                </div>
            </div>

            {/* Brand Hero */}
            <section className="relative pt-16 pb-20 lg:pt-24 lg:pb-28 bg-brand-dark overflow-hidden reveal reveal-active">
                {brand.moodImages && brand.moodImages.length > 0 && (
                    <div className="absolute inset-0">
                        <img
                            src={getProxyUrl(brand.moodImages[0])}
                            alt={`${brand.name} sfeerbeeld`}
                            className="w-full h-full object-cover"
                        />
                        <div className="absolute inset-0 bg-brand-dark/80" />
                        <div className="absolute inset-0 bg-gradient-to-r from-brand-dark via-brand-dark/60 to-transparent" />
                    </div>
                )}
                {(!brand.moodImages || brand.moodImages.length === 0) && (
                    <div className="absolute inset-0 bg-gradient-to-br from-brand-primary/5 via-transparent to-brand-secondary/5" />
                )}
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
                        <div>
                            <button
                                onClick={() => router.push(`/producten/${categorySlug}`)}
                                className="flex items-center gap-2 text-sm text-white/40 hover:text-white transition-colors mb-8 group"
                            >
                                <ArrowBackIcon size={16} className="group-hover:-translate-x-1 transition-transform" />
                                Terug naar {category.name}
                            </button>

                            <div className="flex items-center gap-3 mb-6">
                                {brand.featured && (
                                    <span className="bg-brand-primary text-white text-[10px] font-bold uppercase tracking-wider px-3 py-1 rounded-full">
                                        Premium Merk
                                    </span>
                                )}
                                <div className="flex gap-2">
                                    {brand.materials.map(m => (
                                        <span key={m} className="text-[10px] font-bold uppercase tracking-wider text-white/40 bg-white/5 px-2 py-1 rounded border border-white/10">
                                            {m}
                                        </span>
                                    ))}
                                </div>
                            </div>

                            <h1 className="text-5xl lg:text-6xl font-bold text-white mb-6 leading-tight tracking-tight">
                                {brand.name}
                            </h1>
                            <p className="text-lg text-white/50 leading-relaxed mb-10 max-w-xl">
                                {brand.description}
                            </p>
                            <div className="flex flex-wrap items-center gap-4">
                                <Button size="lg" withIcon onClick={() => router.push('/offerte')}>
                                    Offerte Aanvragen
                                </Button>
                                <button
                                    onClick={() => router.push('/showroom')}
                                    className="px-8 py-4 rounded-[5px] font-bold text-white border border-white/20 hover:bg-white/10 transition-all text-lg"
                                >
                                    Bekijk in Showroom
                                </button>
                                {brand.website && (
                                    <a href={brand.website} target="_blank" rel="noopener noreferrer" className="text-sm text-white/50 hover:text-brand-primary transition-colors underline underline-offset-4">
                                        Bezoek website
                                    </a>
                                )}
                            </div>
                        </div>

                        <div className="flex items-center justify-center">
                            {brand.logoUrl ? (
                                <div className="w-full max-w-md p-8 bg-white/10 border border-white/20 rounded-3xl backdrop-blur-sm flex items-center justify-center">
                                    <img src={getProxyUrl(brand.logoUrl)} alt={`${brand.name} logo`} className="w-full h-auto object-contain max-h-48 drop-shadow-lg" />
                                </div>
                            ) : (
                                <div className="w-full max-w-md aspect-square rounded-3xl bg-white/5 border border-white/10 flex items-center justify-center backdrop-blur-sm">
                                    <span className="text-5xl font-bold text-white/10 tracking-widest text-center px-8">
                                        {brand.name}
                                    </span>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </section>

            {/* Products / Collectie */}
            {brand.products.length > 0 && (
                <section className="py-20 lg:py-28 bg-white reveal">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="text-center mb-16">
                            <span className="text-xs font-bold tracking-[0.2em] text-brand-primary uppercase mb-4 block">Collectie</span>
                            <h2 className="text-4xl lg:text-5xl font-bold text-brand-dark mb-4">
                                {brand.name} <span className="text-brand-primary">producten</span>
                            </h2>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                            {filteredProducts.map((product, idx) => (
                                <div
                                    key={product.slug}
                                    className={`group bg-white border border-gray-100 rounded-2xl overflow-hidden hover:shadow-xl transition-all duration-500 reveal delay-${(idx % 3 + 1) * 100}`}
                                >
                                    <div className="relative h-56 bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center overflow-hidden">
                                    <img
                                        src={getProxyUrl(product.imageUrl)}
                                        alt={product.name}
                                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                                    />
                                    </div>

                                    {/* Product Info */}
                                    <div className="p-6">
                                        <h3 className="text-lg font-bold text-brand-dark mb-2">{product.name}</h3>
                                        <p className="text-sm text-gray-400 leading-relaxed mb-4">{product.description}</p>

                                        {/* Specs */}
                                        <div className="border-t border-gray-100 pt-4 mt-4">
                                            <h4 className="text-xs font-bold uppercase tracking-wider text-gray-300 mb-3">Specificaties</h4>
                                            <div className="space-y-2">
                                                {Object.entries(product.specs).map(([key, value]) => (
                                                    <div key={key} className="flex items-center justify-between text-sm">
                                                        <span className="text-gray-400">{key}</span>
                                                        <span className="font-medium text-brand-dark">{value}</span>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>
            )}

            {/* Sfeerbeelden / Mood Images */}
            {moodImages.length > 0 && (
                <section className="py-20 lg:py-28 bg-brand-accent/5 reveal">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="text-center mb-16">
                            <span className="text-xs font-bold tracking-[0.2em] text-brand-primary uppercase mb-4 block">Inspiratie</span>
                            <h2 className="text-3xl lg:text-4xl font-bold text-brand-dark mb-4">
                                Sfeerbeelden
                            </h2>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                            {moodImages.map((imgUrl, idx) => (
                                <div
                                    key={idx}
                                    className="relative aspect-square rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-500 reveal group cursor-pointer"
                                    onClick={() => setSelectedImageIndex(idx)}
                                >
                                    <img src={getProxyUrl(imgUrl)} alt={`${brand.name} sfeerbeeld ${idx + 1}`} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-all duration-300 flex items-center justify-center opacity-0 group-hover:opacity-100">
                                        <div className="bg-white/20 backdrop-blur-md p-3 rounded-full border border-white/30 transform translate-y-4 group-hover:translate-y-0 transition-transform duration-500">
                                            <ExpandIcon size={24} className="text-white" />
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>
            )}

            {/* Brand Projects */}
            {brandProjects.length > 0 && (
                <section className="py-16 bg-white reveal">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="text-center mb-12">
                            <span className="text-xs font-bold tracking-[0.2em] text-brand-primary uppercase mb-4 block">Onze projecten</span>
                            <h2 className="text-3xl font-bold text-brand-dark">
                                Projecten met <span className="text-brand-primary">{brand.name}</span>
                            </h2>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            {brandProjects.map((project: any) => (
                                <div key={project.id} className="group bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100">
                                    {project.image_url && (
                                        <div className="h-56 overflow-hidden">
                                            <img src={project.image_url} alt={project.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                                        </div>
                                    )}
                                    <div className="p-6">
                                        <h3 className="text-lg font-bold text-brand-dark mb-2">{project.title}</h3>
                                        <p className="text-sm text-gray-400 line-clamp-2">{project.description}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>
            )}

            {/* Why this brand */}
            <section className="py-16 bg-gray-50 reveal">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="max-w-3xl mx-auto text-center">
                        <span className="text-xs font-bold tracking-[0.2em] text-brand-primary uppercase mb-4 block">Waarom {brand.name}?</span>
                        <h2 className="text-3xl lg:text-4xl font-bold text-brand-dark mb-6">
                            Kwaliteit die u <span className="text-brand-primary">kunt vertrouwen</span>
                        </h2>
                        <p className="text-gray-500 text-lg leading-relaxed mb-10">
                            {brand.description}
                        </p>
                        <div className="flex flex-wrap justify-center gap-6">
                            {['Vakkundige montage', 'Gratis advies', 'Showroom beschikbaar', 'Scherpe prijzen'].map((item, i) => (
                                <div key={i} className="flex items-center gap-2 text-sm text-brand-dark font-medium">
                                    <CheckedIcon size={16} className="text-brand-primary" />
                                    {item}
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </section>

            {/* Other Brands */}
            {otherBrands.length > 0 && (
                <section className="py-16 bg-white reveal">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="text-center mb-12">
                            <h2 className="text-2xl font-bold text-brand-dark">
                                Andere merken in <span className="text-brand-primary">{category.name}</span>
                            </h2>
                        </div>
                        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
                            {otherBrands.map((b) => (
                                <Link
                                    key={b.slug}
                                    href={`/producten/${categorySlug}/${b.slug}`}
                                    className="group bg-gray-50 border border-transparent rounded-xl p-4 text-center hover:bg-white hover:border-brand-primary hover:shadow-md transition-all duration-300 flex flex-col items-center justify-center min-h-[100px]"
                                >
                                    {b.logoUrl ? (
                                        <div className="h-12 w-full relative mb-2">
                                            <img 
                                                src={getProxyUrl(b.logoUrl)} 
                                                alt={`${b.name} logo`} 
                                                className="w-full h-full object-contain mix-blend-multiply group-hover:scale-105 transition-transform duration-300" 
                                            />
                                        </div>
                                    ) : (
                                        <span className="text-sm font-bold group-hover:text-brand-primary transition-colors">
                                            {b.name}
                                        </span>
                                    )}
                                </Link>
                            ))}
                        </div>
                    </div>
                </section>
            )}

            {/* CTA */}
            <section className="py-16 px-4 sm:px-6 lg:px-8 reveal">
                <div className="max-w-7xl mx-auto rounded-2xl bg-brand-dark p-12 lg:p-20 text-white relative overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-br from-brand-primary/10 via-transparent to-brand-secondary/10" />
                    <div className="relative z-10 max-w-2xl">
                        <h2 className="text-4xl lg:text-5xl font-bold mb-6">
                            Interesse in <span className="text-brand-primary">{brand.name}</span>?
                        </h2>
                        <p className="text-lg opacity-60 mb-10">
                            Bekijk de volledige collectie in onze showroom in Geldrop of vraag direct een vrijblijvende offerte aan.
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

            {/* Lightbox / Modal */}
            {selectedImage && selectedImageIndex !== null && (
                <div
                    className="fixed inset-0 z-50 flex items-center justify-center bg-black/95 p-4 sm:p-8 animate-in fade-in duration-300 backdrop-blur-sm"
                    onClick={() => setSelectedImageIndex(null)}
                >
                    {/* Close */}
                    <button
                        className="absolute top-6 right-6 sm:top-10 sm:right-10 text-white/50 hover:text-white bg-white/10 hover:bg-brand-primary p-3 rounded-full transition-all duration-300 z-50 cursor-pointer backdrop-blur-md"
                        onClick={(e) => {
                            e.stopPropagation();
                            setSelectedImageIndex(null);
                        }}
                    >
                        <XIcon size={24} />
                    </button>

                    {/* Prev */}
                    {moodImages.length > 1 && (
                        <button
                            className="absolute left-4 sm:left-8 top-1/2 -translate-y-1/2 text-white/50 hover:text-white bg-white/10 hover:bg-white/20 p-3 rounded-full transition-all duration-300 z-50 backdrop-blur-md"
                            onClick={(e) => { e.stopPropagation(); goPrev(); }}
                        >
                            <ChevronLeft className="w-6 h-6" />
                        </button>
                    )}

                    {/* Next */}
                    {moodImages.length > 1 && (
                        <button
                            className="absolute right-4 sm:right-8 top-1/2 -translate-y-1/2 text-white/50 hover:text-white bg-white/10 hover:bg-white/20 p-3 rounded-full transition-all duration-300 z-50 backdrop-blur-md"
                            onClick={(e) => { e.stopPropagation(); goNext(); }}
                        >
                            <ChevronRight className="w-6 h-6" />
                        </button>
                    )}

                    {/* Image */}
                    <div
                        className="relative w-full max-w-7xl max-h-[90vh] flex items-center justify-center animate-in zoom-in-95 duration-300"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <img
                            src={getProxyUrl(selectedImage)}
                            alt={`Sfeerbeeld ${selectedImageIndex + 1} van ${moodImages.length}`}
                            className="max-w-full max-h-[90vh] object-contain rounded-xl shadow-2xl"
                        />
                    </div>

                    {/* Counter */}
                    {moodImages.length > 1 && (
                        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 text-white/40 text-sm font-medium bg-white/10 backdrop-blur-md px-4 py-2 rounded-full">
                            {selectedImageIndex + 1} / {moodImages.length}
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}
