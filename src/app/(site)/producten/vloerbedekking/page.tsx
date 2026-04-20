"use client"

import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import CheckedIcon from '@/components/ui/checked-icon';
import LayersIcon from '@/components/ui/layers-icon';
import ShieldCheck from '@/components/ui/shield-check';
import HeartIcon from '@/components/ui/heart-icon';
import Button from '@/components/Button';

export default function VloerbedekkingPage() {
    const router = useRouter();

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
                        src="/images/Interieur-1-vloerbedekking-best.jpg.webp"
                        alt="Vloerbedekking sfeerbeeld"
                        className="w-full h-full object-cover opacity-15"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-brand-dark via-brand-dark/80 to-brand-dark/50" />
                </div>
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                    <div className="max-w-3xl">
                        <div className="flex items-center gap-2 mb-6">
                            <div className="h-px w-8 bg-brand-primary" />
                            <span className="text-xs font-bold tracking-[0.2em] text-brand-primary uppercase">Comfort & Luxe</span>
                        </div>
                        <h1 className="text-5xl lg:text-7xl font-bold text-white mb-6 leading-[1.05] tracking-tight">
                            Hoogwaardige <span className="text-brand-primary">Vloerbedekking</span>
                        </h1>
                        <p className="text-lg text-white/50 leading-relaxed mb-10 max-w-xl">
                            Breng ultiem comfort en warmte in uw interieur met kamerbreed tapijt of een op maat gemaakt karpet. Zacht voor de voeten, aangenaam voor de akoestiek.
                        </p>
                        <Button size="lg" withIcon onClick={() => router.push('/offerte')}>Gratis Offerte</Button>
                    </div>
                </div>
            </section>

            {/* Tapijt vs Karpet */}
            <section className="py-20 lg:py-28 bg-white reveal">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-16">
                        
                        {/* Tapijt */}
                        <div className="group bg-gray-50 rounded-3xl p-8 lg:p-12 hover:shadow-2xl hover:shadow-brand-primary/5 transition-all duration-500 overflow-hidden relative">
                            <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-brand-primary/10 to-transparent rounded-bl-full -mr-20 -mt-20 opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none" />
                            <div className="relative z-10">
                                <span className="text-xs font-bold tracking-[0.2em] text-brand-primary uppercase mb-4 block">Kamerbreed</span>
                                <h2 className="text-3xl lg:text-4xl font-bold text-brand-dark mb-6">
                                    Tapijt
                                </h2>
                                <p className="text-gray-500 leading-relaxed mb-8">
                                    Niets overtreft het luxe en warme gevoel van kamerbreed tapijt. Het is comfortabel, isolerend, geluiddempend en bovendien erg veilig dankzij de stroeve structuur.
                                </p>
                                <ul className="space-y-4 mb-8">
                                    {[
                                        'Ideaal voor slaapkamer en woonkamer',
                                        'Verbetert de akoestiek aanzienlijk',
                                        'Houdt warmte vast, bespaart energie',
                                        'Zacht en veilig voor (klein)kinderen'
                                    ].map((item, i) => (
                                        <li key={i} className="flex items-center text-brand-dark font-medium">
                                            <CheckedIcon size={20} className="mr-3 text-brand-primary shrink-0" />
                                            {item}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </div>

                        {/* Karpetten */}
                        <div className="group bg-brand-dark rounded-3xl p-8 lg:p-12 hover:shadow-2xl transition-all duration-500 overflow-hidden relative text-white">
                            <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-brand-primary/20 to-transparent rounded-bl-full -mr-20 -mt-20 opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none" />
                            <div className="relative z-10">
                                <span className="text-xs font-bold tracking-[0.2em] text-brand-primary uppercase mb-4 block">Op Maat Gemakt</span>
                                <h2 className="text-3xl lg:text-4xl font-bold text-white mb-6">
                                    Vloerkleden
                                </h2>
                                <p className="text-white/60 leading-relaxed mb-8">
                                    Een kleed verbindt meubels met elkaar en creëert een knus eiland in uw zithoek. Wij maken vloerkleden precies op de maat die u wenst, in eindeloos veel materialen en kleuren.
                                </p>
                                <ul className="space-y-4 mb-8">
                                    {[
                                        'Volledig maatwerk mogelijk',
                                        'Diverse randafwerkingen (bijv. blindfestonneren)',
                                        'Verbindt uw interieur',
                                        'Eenvoudig te vernieuwen en verplaatsen'
                                    ].map((item, i) => (
                                        <li key={i} className="flex items-center text-white/80">
                                            <CheckedIcon size={20} className="mr-3 text-brand-primary shrink-0" />
                                            {item}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </div>

                    </div>
                </div>
            </section>

            {/* USPs */}
            <section className="py-16 bg-gray-50 reveal">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="max-w-3xl mx-auto text-center mb-16">
                        <span className="text-xs font-bold tracking-[0.2em] text-brand-primary uppercase mb-4 block">Waarom kiezen voor tapijt?</span>
                        <h2 className="text-3xl lg:text-4xl font-bold text-brand-dark mb-6">
                            Meer dan <span className="text-brand-primary">zachtheid</span>
                        </h2>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {[
                            { icon: LayersIcon, title: 'Geluiddempend', desc: 'Tapijt absorbeert geluid als geen ander. Ideaal voor appartementen of gehorige woningen.' },
                            { icon: Hearth, title: 'Energiebesparend', desc: 'Dankzij de isolerende eigenschappen van tapijt blijft de warmte beter in de ruimte hangen.' },
                            { icon: ShieldCheck, title: 'Veilig & Anti-slip', desc: 'Tapijt is van nature stroef. De kans op uitglijden is minimaal, wat het perfect maakt voor op de trap of speelkamer.' }
                        ].map((item, i) => (
                            <div key={i} className="bg-white border border-gray-100 rounded-2xl p-8 text-center hover:border-brand-primary transition-colors duration-300">
                                <div className="w-12 h-12 bg-red-50/50 rounded-xl flex items-center justify-center mx-auto mb-6 group-hover:bg-brand-primary/10">
                                    <item.icon size={24} className="text-brand-primary" />
                                </div>
                                <h3 className="text-lg font-bold text-brand-dark mb-3">{item.title}</h3>
                                <p className="text-sm text-gray-500 leading-relaxed">{item.desc}</p>
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
                        <span className="text-xs font-bold tracking-[0.2em] text-brand-primary uppercase mb-4 block">Showroom</span>
                        <h2 className="text-4xl lg:text-5xl font-bold mb-6">Kies uw favoriete <span className="text-brand-primary">structuur</span></h2>
                        <p className="text-lg opacity-60 mb-10">We hebben stalen in allerlei materialen—van robuust sisal tot boterzachte polyamide. Kom ze ervaren in onze showroom.</p>
                        <div className="flex flex-wrap gap-4 justify-center">
                            <Button size="lg" withIcon onClick={() => router.push('/offerte')}>Offerte Request</Button>
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
    );
}

// Kleine typo fix voor de Hearth icon
const Hearth = HeartIcon;
