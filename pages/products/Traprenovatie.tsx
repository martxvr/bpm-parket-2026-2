import React, { useEffect } from 'react';
import { Zap, CheckCircle2 } from 'lucide-react';
import Button from '../../components/Button';

const Traprenovatie = () => {
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
            <section className="relative pt-24 pb-32 bg-black overflow-hidden">
                <div className="absolute inset-0">
                    <img src="https://images.unsplash.com/photo-1558618666-fcd25c85cd64?auto=format&fit=crop&q=80&w=2000" alt="" className="w-full h-full object-cover opacity-30" />
                </div>
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                    <div className="max-w-3xl reveal">
                        <span className="text-xs font-bold tracking-widest text-brand-red uppercase mb-4 block">Snel & Stijlvol</span>
                        <h1 className="text-5xl lg:text-7xl font-bold text-white mb-8 leading-tight">
                            Trap <span className="text-brand-red">Renovatie</span>
                        </h1>
                        <p className="text-xl text-white/70 leading-relaxed mb-10">
                            Transformeer uw trap binnen één dag tot een prachtig pronkstuk in uw woning.
                        </p>
                        <Button size="lg" withIcon onClick={() => window.location.hash = 'quote'}>Gratis Check</Button>
                    </div>
                </div>
            </section>

            <section className="py-24 reveal">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
                        <div>
                            <h2 className="text-4xl font-bold mb-8">Nieuwe glans voor uw trap</h2>
                            <div className="space-y-6 text-gray-500 text-lg leading-relaxed">
                                <p>
                                    Als uw trap tekenen van slijtage vertoont of zijn vroegere glans heeft verloren, hebben wij de ideale oplossing voor u. Met onze gespecialiseerde traprenovatiediensten toveren we uw oude, versleten trap om tot een stijlvol en functioneel pronkstuk.
                                </p>
                                <p>
                                    Door gebruik te maken van hoogwaardige overzet treden, beschikbaar in diverse houtsoorten en kleurenopties, garanderen we een naadloze afwerking die past bij elk interieur.
                                </p>
                                <div className="bg-brand-brown/10 p-8 rounded-3xl border border-brand-brown/20">
                                    <p className="font-bold text-brand-dark italic">
                                        "Binnen slechts één dag kan uw trap een complete transformatie ondergaan, met minimale verstoring voor uw dagelijkse routine."
                                    </p>
                                </div>
                            </div>
                        </div>
                        <div className="rounded-[3rem] overflow-hidden aspect-[4/5] shadow-2xl">
                            <img src="https://images.unsplash.com/photo-1560185007-cde436f6a4d0?auto=format&fit=crop&q=80&w=2000" alt="Trap Renovatie" className="w-full h-full object-cover" />
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default Traprenovatie;
