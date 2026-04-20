"use client"

import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Zap } from 'lucide-react';
import ArrowNarrowRightIcon from '@/components/ui/arrow-narrow-right-icon';
import CheckedIcon from '@/components/ui/checked-icon';
import TrophyIcon from '@/components/ui/trophy-icon';
import UsersIcon from '@/components/ui/users-icon';
import GlobeIcon from '@/components/ui/globe-icon';
import Button from '@/components/Button';
import StatCounter from '@/components/StatCounter';

export default function OverOnsPage() {
    const router = useRouter();

    useEffect(() => {
        const observerOptions = {
            threshold: 0.1,
            rootMargin: "0px 0px -50px 0px"
        };

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
        <div className="bg-white min-h-screen">
            {/* Hero Section */}
            <section className="relative h-[60vh] flex items-center overflow-hidden bg-brand-dark">
                <div className="absolute inset-0 z-0">
                    <img
                        src="https://kunstgrasachterhoek.com/wp-content/uploads/2021/01/website-1024x624.png.webp"
                        alt="Over ons achtergrond"
                        className="w-full h-full object-cover opacity-30 scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-brand-dark via-transparent to-transparent"></div>
                </div>

                <div className="relative z-10 max-w-7xl mx-auto px-6 w-full">
                    <span className="text-brand-primary font-bold tracking-widest uppercase text-xs mb-4 block animate-fade-in">Wie wij zijn</span>
                    <h1 className="text-5xl md:text-7xl font-bold tracking-tight text-white mb-6 animate-slide-up">
                        Over <span className="text-brand-primary">ons</span>
                    </h1>
                    <p className="text-xl text-gray-300 max-w-2xl leading-relaxed animate-slide-up delay-100">
                        Passie voor vakmanschap en een frisse blik op interieur — dat is PVC Vloeren Achterhoek.
                    </p>
                </div>
            </section>

            {/* Main Content */}
            <section className="py-24 max-w-7xl mx-auto px-6 reveal">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center animate-slide-up">

                    {/* Image Side */}
                    <div className="relative">
                        <div className="aspect-[4/5] rounded-[3rem] overflow-hidden shadow-2xl">
                            <img
                                src="/images/brands/art-of-living/sfeer-penthouse-visgraat.webp"
                                alt="Vakmanschap PVC Vloeren Achterhoek"
                                className="w-full h-full object-cover transition-transform duration-700 hover:scale-110"
                            />
                        </div>
                    </div>

                    {/* Text Side */}
                    <div className="space-y-8 reveal delay-100">
                        <div className="space-y-4">
                            <h2 className="text-3xl md:text-4xl font-bold text-brand-dark leading-tight">
                                Vakmanschap uit <span className="text-brand-primary">Doetinchem</span>
                            </h2>
                        </div>

                        <div className="space-y-6 text-lg text-gray-600 leading-relaxed">
                            <p>
                                PVC Vloeren Achterhoek is gevestigd in Doetinchem en actief voor particulieren door heel Nederland en vlak over de grens. Als jong bedrijf brengen we fris enthousiasme in het spel. Tegelijkertijd hebben wij de afgelopen twintig jaar ruime ervaring opgebouwd in de vloeren- en interieurbranche.
                            </p>
                            <p className="font-medium text-brand-dark">
                                Een keuze voor PVC Vloeren Achterhoek is daarmee ook een keuze voor uitgebreide expertise en een groot netwerk.
                            </p>
                            <p>
                                Wij zijn de afgelopen jaren ontzettend gegroeid en bieden inmiddels een breed aanbod: <strong>PVC-vloeren, traprenovatie, vloerbedekking, raamdecoratie en gordijnen.</strong>
                            </p>
                            <p>
                                Onze producten worden ontwikkeld op Nederlandse bodem. Daarbij gaan wij graag uitdagingen aan die maatwerk vereisen. Benieuwd naar onze mogelijkheden?
                            </p>
                        </div>

                        <div className="grid grid-cols-2 gap-6 pt-4">
                            <div className="flex items-start space-x-3">
                                <div className="bg-brand-primary/10 p-2 rounded-lg text-brand-primary">
                                    <GlobeIcon size={20} />
                                </div>
                                <div>
                                    <h4 className="font-bold text-sm text-brand-dark">Nederlands product</h4>
                                    <p className="text-xs text-gray-500">Ontwikkeld op eigen bodem</p>
                                </div>
                            </div>
                            <div className="flex items-start space-x-3">
                                <div className="bg-brand-primary/10 p-2 rounded-lg text-brand-primary">
                                    <Zap className="w-5 h-5" />
                                </div>
                                <div>
                                    <h4 className="font-bold text-sm text-brand-dark">Maatwerk</h4>
                                    <p className="text-xs text-gray-500">Altijd een passende oplossing</p>
                                </div>
                            </div>
                        </div>

                        <div className="pt-8">
                            <Button size="lg" withIcon onClick={() => router.push('/contact')}>
                                Neem contact op
                            </Button>
                        </div>
                    </div>
                </div>
            </section>

            {/* Stats Section */}
            <section className="bg-brand-dark py-24 relative overflow-hidden reveal">
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-brand-primary via-brand-secondary to-transparent"></div>
                <div className="max-w-7xl mx-auto px-6 relative z-10">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-12">
                        {[
                            { label: 'Ervaring', value: 20, sub: 'jaar vakmanschap', icon: TrophyIcon },
                            { label: 'Klanten', value: 500, sub: 'tevreden klanten', icon: UsersIcon },
                            { label: 'Producten', value: 100, sub: 'soorten & maten', icon: CheckedIcon },
                            { label: 'Projecten', value: 150, sub: 'per jaar', icon: ArrowNarrowRightIcon },
                        ].map((stat, i) => (
                            <div key={i} className="text-center group">
                                <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-white/5 text-brand-primary mb-4 transition-all group-hover:bg-brand-primary group-hover:text-white">
                                    <stat.icon size={24} />
                                </div>
                                <div className="text-4xl md:text-5xl font-bold text-white mb-2">
                                    <StatCounter end={stat.value} suffix="+" />
                                </div>
                                <p className="text-xs text-brand-primary font-bold uppercase tracking-widest mb-1">{stat.label}</p>
                                <p className="text-sm text-gray-500">{stat.sub}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="py-24 bg-gray-50 reveal">
                <div className="max-w-4xl mx-auto px-6 text-center space-y-8 animate-slide-up">
                    <h2 className="text-4xl font-bold text-brand-dark leading-tight">
                        Klaar voor uw <span className="text-brand-primary">nieuwe inrichting?</span>
                    </h2>
                    <p className="text-lg text-gray-600 italic">
                        "Wij gaan graag uitdagingen aan die maatwerk vereisen. Ongeacht de omvang van uw project."
                    </p>
                    <div className="flex flex-wrap justify-center gap-4">
                        <Button size="lg" variant="primary" onClick={() => router.push('/offerte')}>
                            Gratis Offerte Aanvragen
                        </Button>
                        <Button size="lg" variant="outline" onClick={() => router.push('/showroom')}>
                            Bezoek onze Showroom
                        </Button>
                    </div>
                </div>
            </section>
        </div>
    );
}
