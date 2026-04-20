"use client"

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Sun } from 'lucide-react';
import CheckedIcon from '@/components/ui/checked-icon';
import EyeIcon from '@/components/ui/eye-icon';
import ShieldCheck from '@/components/ui/shield-check';
import FilterIcon from '@/components/ui/filter-icon';
import XIcon from '@/components/ui/x-icon';
import ArrowNarrowRightIcon from '@/components/ui/arrow-narrow-right-icon';
import Button from '@/components/Button';
import { getCategoryBySlug } from '@/data/brands';

export default function RaamdecoratiePage() {
    const router = useRouter();
    const category = getCategoryBySlug('raamdecoratie')!;
    const types = category.raamdecoratieTypes || [];
    const [activeMaterial, setActiveMaterial] = useState<string | null>(null);

    const allMaterials = Array.from(new Set(types.flatMap(t => t.materials)));
    const filteredTypes = activeMaterial
        ? types.filter(t => t.materials.includes(activeMaterial))
        : types;

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
        <div className="flex flex-col w-full overflow-hidden bg-white text-brand-dark">

            {/* Hero */}
            <section className="relative pt-24 pb-20 lg:pt-32 lg:pb-28 bg-brand-dark overflow-hidden reveal reveal-active">
                <div className="absolute inset-0 z-0">
                    <div className="w-full h-full bg-gradient-to-br from-brand-primary/10 via-brand-dark to-brand-dark" />
                </div>
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                    <div className="max-w-3xl">
                        <div className="flex items-center gap-2 mb-6">
                            <div className="h-px w-8 bg-brand-primary" />
                            <span className="text-xs font-bold tracking-[0.2em] text-brand-primary uppercase">Sfeer & Functie</span>
                        </div>
                        <h1 className="text-5xl lg:text-7xl font-bold text-white mb-6 leading-[1.05] tracking-tight">
                            Stijlvolle <span className="text-brand-primary">Raamdecoratie</span>
                        </h1>
                        <p className="text-lg text-white/50 leading-relaxed mb-10 max-w-xl">
                            Van rolgordijnen en jaloezieën tot duette en vouwgordijnen: wij bieden een compleet assortiment raamdecoratie in hout, kunststof en bamboe.
                        </p>
                        <Button size="lg" withIcon onClick={() => router.push('/offerte')}>Gratis Advies</Button>
                    </div>
                </div>
            </section>

            {/* Filter Bar */}
            <section className="py-6 bg-gray-50 border-b border-gray-100 sticky top-20 lg:top-24 z-30 reveal">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center gap-4 flex-wrap">
                        <div className="flex items-center gap-2 text-sm text-gray-400">
                            <FilterIcon size={16} />
                            <span className="font-medium">Materiaal:</span>
                        </div>
                        <button
                            onClick={() => setActiveMaterial(null)}
                            className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${!activeMaterial ? 'bg-brand-dark text-white' : 'bg-white text-gray-500 border border-gray-200 hover:border-brand-primary hover:text-brand-primary'}`}
                        >
                            Alle types
                        </button>
                        {allMaterials.map(material => (
                            <button
                                key={material}
                                onClick={() => setActiveMaterial(activeMaterial === material ? null : material)}
                                className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${activeMaterial === material ? 'bg-brand-dark text-white' : 'bg-white text-gray-500 border border-gray-200 hover:border-brand-primary hover:text-brand-primary'}`}
                            >
                                {material}
                            </button>
                        ))}
                        {activeMaterial && (
                            <button onClick={() => setActiveMaterial(null)} className="flex items-center gap-1 text-xs text-gray-400 hover:text-red-500 transition-colors">
                                <XIcon size={12} /> Wis filter
                            </button>
                        )}
                    </div>
                </div>
            </section>

            {/* Types Grid */}
            <section className="py-20 lg:py-28 bg-white reveal">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-16">
                        <span className="text-xs font-bold tracking-[0.2em] text-brand-primary uppercase mb-4 block">Ons Assortiment</span>
                        <h2 className="text-4xl lg:text-5xl font-bold text-brand-dark mb-4">
                            Raamdecoratie voor elke <span className="text-brand-primary">stijl</span>
                        </h2>
                        <p className="text-gray-400 max-w-2xl mx-auto">
                            Ontdek onze uitgebreide collectie. Van strak en modern tot warm en natuurlijk.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {filteredTypes.map((type, idx) => (
                            <Link
                                href={`/producten/raamdecoratie/type/${type.slug}`}
                                key={type.slug}
                                className={`group bg-white border border-gray-100 rounded-2xl overflow-hidden hover:shadow-2xl hover:shadow-brand-primary/5 transition-all duration-500 hover:-translate-y-1 reveal delay-${(idx % 3 + 1) * 100}`}
                            >
                                <div className="relative h-52 bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center overflow-hidden">
                                    <div className="text-3xl font-bold text-gray-200 tracking-widest group-hover:scale-110 transition-transform duration-500">
                                        {type.name}
                                    </div>
                                </div>

                                <div className="p-6">
                                    <h3 className="text-lg font-bold text-brand-dark mb-2 group-hover:text-brand-primary transition-colors">
                                        {type.name}
                                    </h3>
                                    <p className="text-sm text-gray-400 leading-relaxed mb-4">
                                        {type.description}
                                    </p>
                                    <div className="flex items-center justify-between">
                                        <div className="flex gap-2 flex-wrap">
                                            {type.materials.map(m => (
                                                <span key={m} className="text-[10px] font-bold uppercase tracking-wider text-gray-400 bg-gray-50 px-2 py-1 rounded">
                                                    {m}
                                                </span>
                                            ))}
                                        </div>
                                        <ArrowNarrowRightIcon size={16} className="text-brand-primary opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all shrink-0" />
                                    </div>
                                </div>
                            </Link>
                        ))}
                    </div>

                    {filteredTypes.length === 0 && (
                        <div className="text-center py-16">
                            <p className="text-gray-400 text-lg">Geen types gevonden voor dit materiaal.</p>
                            <button onClick={() => setActiveMaterial(null)} className="mt-4 text-brand-primary font-medium hover:underline">
                                Toon alle types
                            </button>
                        </div>
                    )}
                </div>
            </section>

            {/* USPs */}
            <section className="py-16 lg:py-24 bg-brand-dark text-white reveal">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="max-w-3xl mx-auto text-center mb-16">
                        <span className="text-xs font-bold tracking-widest text-brand-primary uppercase mb-4 block">Waarom Raamdecoratie?</span>
                        <h2 className="text-4xl lg:text-5xl font-bold leading-tight mb-6">
                            Meer dan alleen <span className="text-brand-primary">mooi</span>
                        </h2>
                        <p className="text-lg text-white/60 leading-relaxed">
                            Goede raamdecoratie combineert functie met esthetiek.
                        </p>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {[
                            { icon: Sun, title: 'Lichtregulatie', desc: 'Bepaal zelf hoeveel licht er binnenkomt. Van volledig verduisterend tot zacht gefilterd daglicht.' },
                            { icon: ShieldCheck, title: 'Privacy & Isolatie', desc: 'Bescherm uw privacy en bespaar op energiekosten dankzij de isolerende werking.' },
                            { icon: EyeIcon, title: 'Stijl & Sfeer', desc: 'Geef uw ramen de aandacht die ze verdienen met decoratie die past bij uw interieur.' }
                        ].map((item, i) => (
                            <div key={i} className="bg-white/5 border border-white/10 rounded-2xl p-8 text-center">
                                <div className="w-12 h-12 bg-brand-primary/20 rounded-xl flex items-center justify-center mx-auto mb-6">
                                    <item.icon size={24} className="text-brand-primary" />
                                </div>
                                <h3 className="text-lg font-bold mb-3">{item.title}</h3>
                                <p className="text-sm text-white/60 leading-relaxed">{item.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* CTA */}
            <section className="py-16 px-4 sm:px-6 lg:px-8 reveal">
                <div className="max-w-7xl mx-auto rounded-2xl bg-brand-dark p-12 lg:p-24 text-center text-white relative overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-br from-brand-primary/10 via-transparent to-brand-secondary/10" />
                    <div className="relative z-10 max-w-2xl mx-auto">
                        <h2 className="text-4xl lg:text-5xl font-bold mb-6">Raamdecoratie <span className="text-brand-primary">op maat</span></h2>
                        <p className="text-lg opacity-60 mb-10">Gratis inmeting en advies aan huis. Bezoek onze showroom in Doetinchem.</p>
                        <Button size="lg" withIcon onClick={() => router.push('/offerte')}>Offerte Aanvragen</Button>
                    </div>
                </div>
            </section>
        </div>
    );
}
