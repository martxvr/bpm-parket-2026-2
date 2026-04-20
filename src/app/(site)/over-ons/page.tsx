"use client"

import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Hammer, Users, Leaf, Wrench } from 'lucide-react';
import ArrowNarrowRightIcon from '@/components/ui/arrow-narrow-right-icon';
import CheckedIcon from '@/components/ui/checked-icon';
import TrophyIcon from '@/components/ui/trophy-icon';
import UsersIcon from '@/components/ui/users-icon';
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
                        src="https://images.unsplash.com/photo-1615971677499-5467cbab01c0?q=80&w=1600&auto=format&fit=crop"
                        alt="Over ons achtergrond"
                        className="w-full h-full object-cover opacity-30 scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-brand-dark via-transparent to-transparent"></div>
                </div>

                <div className="relative z-10 max-w-7xl mx-auto px-6 w-full">
                    <span className="text-brand-primary font-bold tracking-widest uppercase text-xs mb-4 block animate-fade-in">Wie wij zijn</span>
                    <h1 className="text-5xl md:text-7xl font-bold tracking-tight text-white mb-6 animate-slide-up">
                        Vakmanschap uit <span className="text-brand-primary">Geldrop</span> — sinds 1992
                    </h1>
                    <p className="text-xl text-gray-300 max-w-2xl leading-relaxed animate-slide-up delay-100">
                        Al ruim 30 jaar leveren wij niet alleen hoogwaardige parketvloeren, maar gaan we verder dan dat.
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
                                alt="Vakmanschap BPM Parket"
                                className="w-full h-full object-cover transition-transform duration-700 hover:scale-110"
                            />
                        </div>
                    </div>

                    {/* Text Side */}
                    <div className="space-y-8 reveal delay-100">
                        <div className="space-y-4">
                            <h2 className="text-3xl md:text-4xl font-bold text-brand-dark leading-tight">
                                Ons <span className="text-brand-primary">verhaal</span>
                            </h2>
                        </div>

                        <div className="space-y-6 text-lg text-gray-600 leading-relaxed">
                            <p>
                                BPM Parket werd opgericht in 1992 door B.P.M. van Baar als specialist in traditioneel parket.
                                Vanuit onze werkplaats in Geldrop bedienen wij klanten in heel Noord-Brabant en daarbuiten.
                            </p>
                            <p>
                                Wat begon als pure parket-montage is uitgegroeid tot een compleet interieur-vakmanschap.
                                Naast parket leveren en leggen wij PVC, laminaat, buitenparket, renoveren we trappen
                                en voeren we interieurwerken uit zoals radiator-ombouwen en maatwerk plinten.
                            </p>
                            <p>
                                Elke opdracht begint met een persoonlijk gesprek. We komen bij u thuis, nemen de ruimte op,
                                bespreken uw wensen en geven vakkundig advies over de beste oplossing. Geen druk, geen haast —
                                wij werken tot in het kleinste detail.
                            </p>
                            <p className="font-medium text-brand-dark">
                                Bij BPM Parket krijgt u altijd dezelfde vakman aan huis. Geen wisselende ploegen,
                                geen onderaannemers. Dat is hoe wij kwaliteit waarborgen en al meer dan 1000 tevreden
                                klanten hebben bediend.
                            </p>
                        </div>

                        <div className="pt-8">
                            <Button size="lg" withIcon onClick={() => router.push('/contact')}>
                                Neem contact op
                            </Button>
                        </div>
                    </div>
                </div>
            </section>

            {/* Kernwaarden Section */}
            <section className="py-24 bg-gray-50 reveal">
                <div className="max-w-7xl mx-auto px-6">
                    <div className="text-center mb-16">
                        <span className="text-xs font-bold tracking-widest text-brand-primary uppercase mb-4 block">Onze waarden</span>
                        <h2 className="text-4xl font-bold text-brand-dark">
                            Wat ons <span className="text-brand-primary">drijft</span>
                        </h2>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                        {[
                            { icon: Hammer, title: 'Traditioneel', desc: 'Ambachtelijk parket sinds 1992' },
                            { icon: Users, title: 'Persoonlijk', desc: 'Altijd dezelfde vakman, persoonlijk advies' },
                            { icon: Leaf, title: 'Duurzaam', desc: 'Houtsoorten uit verantwoorde bron' },
                            { icon: Wrench, title: 'Maatwerk', desc: 'Elke oplossing op maat van uw ruimte' },
                        ].map((value, i) => (
                            <div key={i} className="bg-white p-8 rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100">
                                <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-brand-primary/10 text-brand-primary mb-4">
                                    <value.icon className="w-6 h-6" />
                                </div>
                                <h3 className="text-lg font-bold text-brand-dark mb-2">{value.title}</h3>
                                <p className="text-sm text-gray-500 leading-relaxed">{value.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Stats Section */}
            <section className="bg-brand-dark py-24 relative overflow-hidden reveal">
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-brand-primary via-brand-secondary to-transparent"></div>
                <div className="max-w-7xl mx-auto px-6 relative z-10">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-12">
                        {[
                            { label: 'Ervaring', value: 30, suffix: '+', sub: 'jaar vakmanschap', icon: TrophyIcon },
                            { label: 'Klanten', value: 1000, suffix: '+', sub: 'tevreden klanten', icon: UsersIcon },
                            { label: 'Specialismen', value: 6, suffix: '', sub: 'diensten in één hand', icon: CheckedIcon },
                            { label: 'Vakmanschap', value: 100, suffix: '%', sub: 'eigen team', icon: ArrowNarrowRightIcon },
                        ].map((stat, i) => (
                            <div key={i} className="text-center group">
                                <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-white/5 text-brand-primary mb-4 transition-all group-hover:bg-brand-primary group-hover:text-white">
                                    <stat.icon size={24} />
                                </div>
                                <div className="text-4xl md:text-5xl font-bold text-white mb-2">
                                    <StatCounter end={stat.value} suffix={stat.suffix} />
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
                        Klaar voor uw <span className="text-brand-primary">nieuwe vloer?</span>
                    </h2>
                    <p className="text-lg text-gray-600 italic">
                        "Vakmanschap tot in detail."
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
