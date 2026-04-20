"use client"

import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Wind } from 'lucide-react';
import CheckedIcon from '@/components/ui/checked-icon';
import EyeIcon from '@/components/ui/eye-icon';
import ShieldCheck from '@/components/ui/shield-check';
import Button from '@/components/Button';

export default function GordijnenPage() {
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
                        src="/images/gordijn-kopen-doetinchem.jpg.webp"
                        alt="Gordijnen sfeerbeeld"
                        className="w-full h-full object-cover opacity-15"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-brand-dark via-brand-dark/80 to-brand-dark/50" />
                </div>
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                    <div className="max-w-3xl">
                        <div className="flex items-center gap-2 mb-6">
                            <div className="h-px w-8 bg-brand-primary" />
                            <span className="text-xs font-bold tracking-[0.2em] text-brand-primary uppercase">Sfeermakers op maat</span>
                        </div>
                        <h1 className="text-5xl lg:text-7xl font-bold text-white mb-6 leading-[1.05] tracking-tight">
                            Elegante <span className="text-brand-primary">Gordijnen</span>
                        </h1>
                        <p className="text-lg text-white/50 leading-relaxed mb-10 max-w-xl">
                            Gordijnen zijn de ultieme sfeermakers in huis. Van lichte inbetweens tot rijke verduisterende stoffen — wij leveren maatwerk voor elk raam.
                        </p>
                        <Button size="lg" withIcon onClick={() => router.push('/offerte')}>Gratis Advies</Button>
                    </div>
                </div>
            </section>

            {/* Types Info */}
            <section className="py-20 lg:py-28 bg-white reveal">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-16">
                        <span className="text-xs font-bold tracking-[0.2em] text-brand-primary uppercase mb-4 block">Onze Collectie</span>
                        <h2 className="text-4xl lg:text-5xl font-bold text-brand-dark mb-4">
                            Voor elk raam de <span className="text-brand-primary">perfecte stof</span>
                        </h2>
                        <p className="text-gray-400 max-w-2xl mx-auto">
                            Ontdek de mogelijkheden van onze maatwerk gordijnen. Wij helpen u graag bij het maken van de juiste keuze.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {[
                            { title: 'Vitrage', desc: 'Licht, luchtig en elegant. Vitrages filteren het zonlicht subtiel en bieden overdag privacy zonder het zicht naar buiten volledig te belemmeren.' },
                            { title: 'Inbetweens', desc: 'De perfecte middenweg tussen vitrage en overgordijn. Mooie, soepele stoffen die warmte bieden en inkijk tegengaan.' },
                            { title: 'Overgordijnen', desc: 'Rijke, zware stoffen voor maximale sfeer, isolatie en verduistering. Ideaal voor de slaapkamer of een knusse woonkamer.' }
                        ].map((type, idx) => (
                            <div key={idx} className={`bg-gray-50 border border-gray-100 rounded-2xl p-8 hover:shadow-xl transition-all duration-300 reveal delay-${(idx + 1) * 100}`}>
                                <h3 className="text-xl font-bold text-brand-dark mb-4">{type.title}</h3>
                                <p className="text-gray-500 leading-relaxed">{type.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* USPs / Waarom */}
            <section className="py-16 lg:py-24 bg-brand-dark text-white reveal">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
                        <div className="space-y-8">
                            <div>
                                <span className="text-xs font-bold tracking-widest text-brand-primary uppercase mb-4 block">Maatwerk</span>
                                <h2 className="text-4xl lg:text-5xl font-bold leading-tight">
                                    Gordijnen tot in de <span className="text-brand-primary">perfectie</span>
                               </h2>
                            </div>
                            <p className="text-lg text-white/60 leading-relaxed font-light">
                                Bij ons kiest u niet alleen de stof. U bepaalt ook de plooi (enkel, dubbel of wave), de afwerking en het ophangsysteem. Alles wordt perfect op maat gemaakt.
                            </p>
                            <ul className="space-y-4 pt-4">
                                {[
                                    'Gratis inmeten bij u thuis',
                                    'Ruime keuze uit honderden prachtige stoffen',
                                    'Keuze uit diverse plooien en afwerkingen',
                                    'Inclusief rails of roedes, vakkundig gemonteerd'
                                ].map((item, i) => (
                                    <li key={i} className="flex items-center text-white/80">
                                        <CheckedIcon size={20} className="mr-3 text-brand-primary shrink-0" />
                                        <span className="font-medium text-sm lg:text-base">{item}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            {[
                                { icon: Wind, title: 'Kamerhoog', desc: 'Naadloze afwerking zonder zichtbare naden.' },
                                { icon: ShieldCheck, title: 'Kwaliteit', desc: 'Kleurvaste en krimpvrije stoffen van A-merken.' },
                                { icon: EyeIcon, title: 'Black-out', desc: '100% verduisterende voeringen mogelijk.' }
                            ].map((item, i) => (
                                <div key={i} className="bg-white/5 border border-white/10 rounded-xl p-6 text-center hover:bg-white/10 transition-colors">
                                    <item.icon size={32} className="text-brand-primary mx-auto mb-4" />
                                    <h3 className="font-bold text-white mb-2">{item.title}</h3>
                                    <p className="text-xs text-white/60 leading-relaxed">{item.desc}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </section>

            {/* CTA */}
            <section className="py-16 px-4 sm:px-6 lg:px-8 reveal">
                <div className="max-w-7xl mx-auto rounded-2xl bg-gray-50 p-12 lg:p-24 text-center relative overflow-hidden">
                    <div className="relative z-10 max-w-2xl mx-auto">
                        <span className="text-xs font-bold tracking-[0.2em] text-brand-primary uppercase mb-4 block">Bezoek Ons</span>
                        <h2 className="text-4xl lg:text-5xl font-bold text-brand-dark mb-6">Voel de <span className="text-brand-primary">stoffen</span> in onze showroom</h2>
                        <p className="text-lg text-gray-500 mb-10">Ontdek onze complete stofcollectie in Doetinchem en laat u adviseren door onze stylisten.</p>
                        <div className="flex flex-wrap justify-center gap-4">
                            <Button size="lg" withIcon onClick={() => router.push('/offerte')}>Offerte Aanvragen</Button>
                            <button
                                onClick={() => router.push('/showroom')}
                                className="px-8 py-4 rounded-[5px] font-bold text-brand-dark border border-gray-200 hover:border-brand-primary hover:text-brand-primary transition-all text-lg"
                            >
                                Bekijk Showroom
                            </button>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
}
