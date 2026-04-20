"use client"

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Zap } from 'lucide-react';
import CheckedIcon from '@/components/ui/checked-icon';
import ArrowNarrowRightIcon from '@/components/ui/arrow-narrow-right-icon';
import FilterIcon from '@/components/ui/filter-icon';
import XIcon from '@/components/ui/x-icon';
import Button from '@/components/Button';
import { getCategoryBySlug } from '@/data/brands';
import type { Brand } from '@/data/brands';

export default function TraprenovatiePage() {
    const router = useRouter();
    const category = getCategoryBySlug('traprenovatie')!;
    const [activeMaterial, setActiveMaterial] = useState<string | null>(null);

    const allMaterials = Array.from(new Set(category.brands.flatMap(b => b.materials)));
    const filteredBrands = activeMaterial
        ? category.brands.filter(b => b.materials.includes(activeMaterial))
        : category.brands;

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
                    <img
                        src="/images/trap-1.jpg.webp"
                        alt="Traprenovatie sfeerbeeld"
                        className="w-full h-full object-cover opacity-15"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-brand-dark via-brand-dark/80 to-brand-dark/50" />
                </div>
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                    <div className="max-w-3xl">
                        <div className="flex items-center gap-2 mb-6">
                            <div className="h-px w-8 bg-brand-primary" />
                            <span className="text-xs font-bold tracking-[0.2em] text-brand-primary uppercase">Totale Transformatie</span>
                        </div>
                        <h1 className="text-5xl lg:text-7xl font-bold text-white mb-6 leading-[1.05] tracking-tight">
                            Professionele <span className="text-brand-primary">Traprenovatie</span>
                        </h1>
                        <p className="text-lg text-white/50 leading-relaxed mb-10 max-w-xl">
                            Geef uw trap een compleet nieuwe uitstraling zonder de kosten van een volledige vervanging. Wij renoveren uw trap vakkundig met hoogwaardige materialen.
                        </p>
                        <Button size="lg" withIcon onClick={() => router.push('/offerte')}>Gratis Offerte</Button>
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
                            Alle merken
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

            {/* Brand Cards */}
            <section className="py-20 lg:py-28 bg-white reveal">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-16">
                        <span className="text-xs font-bold tracking-[0.2em] text-brand-primary uppercase mb-4 block">Onze Merken</span>
                        <h2 className="text-4xl lg:text-5xl font-bold text-brand-dark mb-4">
                            Traprenovatie met <span className="text-brand-primary">topmerken</span>
                        </h2>
                        <p className="text-gray-400 max-w-2xl mx-auto">
                            Elk merk is geselecteerd op kwaliteit, duurzaamheid en afwerking. Klik op een merk voor de volledige collectie.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                        {filteredBrands.map((brand, idx) => (
                            <Link
                                key={brand.slug}
                                href={`/producten/traprenovatie/${brand.slug}`}
                                className={`group relative bg-white border border-gray-100 rounded-2xl overflow-hidden hover:shadow-2xl hover:shadow-brand-primary/5 transition-all duration-500 hover:-translate-y-1 reveal delay-${(idx % 4 + 1) * 100}`}
                            >
                                <div className="relative h-44 bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center overflow-hidden p-6">
                                    {brand.logoUrl ? (
                                        <img src={brand.logoUrl} alt={`${brand.name} logo`} className="w-full h-full object-contain mix-blend-multiply group-hover:scale-105 transition-transform duration-500" />
                                    ) : (
                                        <div className="text-3xl font-bold text-gray-200 tracking-widest group-hover:scale-110 transition-transform duration-500 text-center">
                                            {brand.name}
                                        </div>
                                    )}
                                    {brand.featured && (
                                        <div className="absolute top-4 right-4 bg-brand-primary text-white text-[10px] font-bold uppercase tracking-wider px-3 py-1 rounded-full">
                                            Premium
                                        </div>
                                    )}
                                </div>
                                <div className="p-6">
                                    <h3 className="text-lg font-bold text-brand-dark mb-2 group-hover:text-brand-primary transition-colors">
                                        {brand.name}
                                    </h3>
                                    <p className="text-sm text-gray-400 leading-relaxed mb-4">{brand.shortDescription}</p>
                                    <div className="flex items-center justify-between">
                                        <div className="flex gap-2">
                                            {brand.materials.map(m => (
                                                <span key={m} className="text-[10px] font-bold uppercase tracking-wider text-gray-400 bg-gray-50 px-2 py-1 rounded">{m}</span>
                                            ))}
                                        </div>
                                        <ArrowNarrowRightIcon size={16} className="text-gray-300 group-hover:text-brand-primary group-hover:translate-x-1 transition-all" />
                                    </div>
                                </div>
                            </Link>
                        ))}
                    </div>
                </div>
            </section>

            {/* Process Section */}
            <section className="py-16 lg:py-24 bg-brand-dark text-white reveal">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
                        <div className="space-y-8">
                            <div>
                                <span className="text-xs font-bold tracking-widest text-brand-primary uppercase mb-4 block">Ons Proces</span>
                                <h2 className="text-4xl lg:text-5xl font-bold leading-tight">
                                    Van oud naar <span className="text-brand-primary">nieuw</span> in enkele stappen
                                </h2>
                            </div>
                            <p className="text-lg text-white/60 leading-relaxed font-light">
                                Onze traprenovatie is een snel en schoon proces. Wij plaatsen nieuwe treden en stootborden over uw bestaande trap.
                            </p>
                            <ul className="space-y-4 pt-4">
                                {[
                                    'Gratis inmeting en advies aan huis',
                                    'Breed assortiment materialen en kleuren',
                                    'Inclusief stootborden en neusprofielen',
                                    'Professionele montage door vakmensen',
                                    'Anti-slip afwerking mogelijk'
                                ].map((item, i) => (
                                    <li key={i} className="flex items-center text-white/80">
                                        <Zap className="w-4 h-4 mr-3 text-brand-primary shrink-0" />
                                        <span className="font-medium text-sm">{item}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>
                        <div className="relative rounded-3xl overflow-hidden h-[500px] group shadow-2xl bg-gray-800">
                            <img src="/images/PVC-vloeren-18-1.jpg.webp" alt="Traprenovatie proces" className="w-full h-full object-cover opacity-70 transition-transform duration-700 group-hover:scale-105" />
                        </div>
                    </div>
                </div>
            </section>

            {/* CTA */}
            <section className="py-16 px-4 sm:px-6 lg:px-8 reveal">
                <div className="max-w-7xl mx-auto rounded-2xl bg-brand-dark p-12 lg:p-24 text-center text-white relative overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-br from-brand-primary/10 via-transparent to-brand-secondary/10" />
                    <div className="relative z-10 max-w-2xl mx-auto">
                        <h2 className="text-4xl lg:text-5xl font-bold mb-6">Geef uw trap een <span className="text-brand-primary">tweede leven</span></h2>
                        <p className="text-lg opacity-60 mb-10">Kom langs in onze showroom en bekijk de mogelijkheden.</p>
                        <Button size="lg" withIcon onClick={() => router.push('/offerte')}>Offerte Aanvragen</Button>
                    </div>
                </div>
            </section>
        </div>
    );
}
