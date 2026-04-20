"use client"

import React, { useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { TreePine, Leaf } from 'lucide-react';
import CheckedIcon from '@/components/ui/checked-icon';
import ArrowNarrowRightIcon from '@/components/ui/arrow-narrow-right-icon';
import Button from '@/components/Button';
import { getCategoryBySlug } from '@/data/brands';
import type { Brand } from '@/data/brands';

export default function HoutenVloerenPage() {
    const router = useRouter();
    const category = getCategoryBySlug('houten-vloeren')!;

    useEffect(() => {
        const observerOptions = { threshold: 0.1, rootMargin: "0px 0px -50px 0px" };
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

    return (
        <div className="flex flex-col w-full bg-white text-brand-dark">

            {/* Hero */}
            <section className="relative pt-24 pb-20 lg:pt-32 lg:pb-28 bg-brand-dark overflow-hidden reveal reveal-active">
                <div className="absolute inset-0 z-0">
                    <div className="w-full h-full bg-gradient-to-br from-amber-900/30 via-brand-dark to-brand-dark" />
                </div>
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                    <div className="max-w-3xl">
                        <div className="flex items-center gap-2 mb-6">
                            <div className="h-px w-8 bg-amber-500" />
                            <span className="text-xs font-bold tracking-[0.2em] text-amber-500 uppercase">Echt Hout</span>
                        </div>
                        <h1 className="text-5xl lg:text-7xl font-bold text-white mb-6 leading-[1.05] tracking-tight">
                            Authentieke <span className="text-amber-500">Houten</span> Vloeren
                        </h1>
                        <p className="text-lg text-white/50 leading-relaxed mb-10 max-w-xl">
                            Niets evenaart de warmte en het karakter van een echte houten vloer.
                            Duurzaam gesourced, met liefde geplaatst.
                        </p>
                        <div className="flex flex-wrap gap-4">
                            <Button size="lg" withIcon onClick={() => router.push('/offerte')}>
                                Gratis Offerte
                            </Button>
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

            {/* Brand Cards */}
            <section className="py-20 lg:py-28 bg-white reveal">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-16">
                        <span className="text-xs font-bold tracking-[0.2em] text-brand-primary uppercase mb-4 block">Onze Merken</span>
                        <h2 className="text-4xl lg:text-5xl font-bold text-brand-dark mb-4">
                            Geselecteerde <span className="text-brand-primary">houtmerken</span>
                        </h2>
                        <p className="text-gray-400 max-w-2xl mx-auto">
                            Wij werken uitsluitend met merken die staan voor kwaliteit en duurzaamheid.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-4xl mx-auto">
                        {category.brands.map((brand, idx) => (
                            <Link
                                key={brand.slug}
                                href={`/producten/houten-vloeren/${brand.slug}`}
                                className={`group relative bg-white border border-gray-100 rounded-2xl overflow-hidden hover:shadow-2xl hover:shadow-amber-500/5 transition-all duration-500 hover:-translate-y-1 reveal delay-${(idx + 1) * 100}`}
                            >
                                <div className="relative h-52 bg-gradient-to-br from-amber-50 to-orange-50 flex items-center justify-center overflow-hidden p-6">
                                    {brand.logoUrl ? (
                                        <img src={brand.logoUrl} alt={`${brand.name} logo`} className="w-full h-full object-contain mix-blend-multiply group-hover:scale-105 transition-transform duration-500" />
                                    ) : (
                                        <div className="text-4xl font-bold text-amber-200 tracking-widest group-hover:scale-110 transition-transform duration-500 text-center">
                                            {brand.name}
                                        </div>
                                    )}
                                    {brand.featured && (
                                        <div className="absolute top-4 right-4 bg-amber-600 text-white text-[10px] font-bold uppercase tracking-wider px-3 py-1 rounded-full flex items-center gap-1">
                                            <Leaf className="w-3 h-3" /> Premium
                                        </div>
                                    )}
                                </div>
                                <div className="p-6">
                                    <h3 className="text-lg font-bold text-brand-dark mb-2 group-hover:text-amber-600 transition-colors">
                                        {brand.name}
                                    </h3>
                                    <p className="text-sm text-gray-400 leading-relaxed mb-4">
                                        {brand.shortDescription}
                                    </p>
                                    <div className="flex items-center justify-between">
                                        <span className="text-[10px] font-bold uppercase tracking-wider text-amber-700 bg-amber-50 px-2 py-1 rounded">
                                            Echt Hout
                                        </span>
                                        <ArrowNarrowRightIcon size={16} className="text-gray-300 group-hover:text-amber-600 group-hover:translate-x-1 transition-all" />
                                    </div>
                                </div>
                            </Link>
                        ))}
                    </div>
                </div>
            </section>

            {/* Why Wood */}
            <section className="py-20 bg-gray-50 reveal">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
                        <div>
                            <span className="text-xs font-bold tracking-[0.2em] text-brand-primary uppercase mb-4 block">Waarom Hout?</span>
                            <h2 className="text-4xl font-bold mb-8 text-brand-dark">
                                De <span className="text-brand-primary">tijdloze keuze</span> voor uw interieur
                            </h2>
                            <div className="space-y-6 text-gray-500 text-lg leading-relaxed">
                                <p>
                                    Een houten vloer is een investering in sfeer en waarde. Elke plank is uniek, met een eigen karakter dat door de jaren heen alleen maar mooier wordt. Hout ademt met uw woning mee en biedt een warmte die geen enkel ander materiaal kan evenaren.
                                </p>
                                <ul className="space-y-4 pt-4">
                                    {[
                                        'Uniek karakter per plank',
                                        'Waardevermeerdering van uw woning',
                                        'Duurzaam en jarenlang herbruikbaar',
                                        'Geschikt voor vloerverwarming',
                                        'Diverse afwerkingen: geolied, gelakt, geborsteld'
                                    ].map((item, i) => (
                                        <li key={i} className="flex items-center text-brand-dark font-medium">
                                            <CheckedIcon size={20} className="mr-3 text-brand-primary shrink-0" />
                                            {item}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </div>
                        <div className="relative rounded-3xl overflow-hidden h-[500px] shadow-2xl bg-amber-100 flex items-center justify-center">
                            <TreePine className="w-32 h-32 text-amber-200" />
                        </div>
                    </div>
                </div>
            </section>

            {/* CTA */}
            <section className="py-16 px-4 sm:px-6 lg:px-8 reveal">
                <div className="max-w-7xl mx-auto rounded-2xl bg-brand-dark p-12 lg:p-24 text-center text-white relative overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-br from-amber-900/20 via-transparent to-brand-secondary/10" />
                    <div className="relative z-10 max-w-2xl mx-auto">
                        <h2 className="text-4xl lg:text-5xl font-bold mb-6">Een echte houten vloer <span className="text-amber-500">in uw woning</span>?</h2>
                        <p className="text-lg opacity-60 mb-10">Kom langs in onze showroom en voel het verschil. Gratis advies en offerte op maat.</p>
                        <Button size="lg" withIcon onClick={() => router.push('/offerte')}>Offerte Aanvragen</Button>
                    </div>
                </div>
            </section>
        </div>
    );
}
