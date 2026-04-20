import React, { useEffect } from 'react';
import { Layers, ShieldCheck, CheckCircle2, ArrowRight } from 'lucide-react';
import Button from '../../components/Button';

const PVCLaminaat = () => {
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
            <section className="relative pt-24 pb-32 bg-black overflow-hidden">
                <div className="absolute inset-0">
                    <img src="https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?auto=format&fit=crop&q=80&w=2000" alt="" className="w-full h-full object-cover opacity-30" />
                </div>
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                    <div className="max-w-3xl reveal">
                        <span className="text-xs font-bold tracking-widest text-brand-red uppercase mb-4 block">Onze Collectie</span>
                        <h1 className="text-5xl lg:text-7xl font-bold text-white mb-8 leading-tight">
                            PVC en <span className="text-brand-red">Laminaat</span>
                        </h1>
                        <p className="text-xl text-white/70 leading-relaxed mb-10">
                            Stijlvol, duurzaam en onderhoudsvriendelijk. De perfecte vloeroplossing voor elk modern interieur.
                        </p>
                        <Button size="lg" withIcon onClick={() => window.location.hash = 'quote'}>
                            Gratis Offerte
                        </Button>
                    </div>
                </div>
            </section>

            {/* Content Section 1: PVC */}
            <section className="py-24 bg-white reveal">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
                        <div>
                            <div className="w-12 h-12 bg-black rounded-full flex items-center justify-center mb-6 text-white">
                                <ShieldCheck className="w-6 h-6" />
                            </div>
                            <h2 className="text-4xl font-bold mb-8">PVC Vloeren</h2>
                            <div className="space-y-6 text-gray-500 text-lg leading-relaxed">
                                <p>
                                    PVC vloeren zijn de perfecte samensmelting van esthetiek en functionaliteit. Deze kunststof vloeren zijn ontworpen met het oog op het nabootsen van de natuurlijke schoonheid van een traditionele parketvloer, maar zonder het bijbehorende onderhoud en de kosten. Ze zijn een uitstekende keuze voor moderne huishoudens die op zoek zijn naar zowel stijl als gebruiksgemak.
                                </p>
                                <p>
                                    Een van de vele voordelen van PVC vloeren is de installatieoptie. Ze zijn leverbaar met een handig clicksysteem, waardoor doe-het-zelvers de mogelijkheid hebben om de vloer zelf te leggen. Daarnaast bieden we ook stroken van 2,5 mm aan, die door ons team van vakkundige professionals worden geïnstalleerd.
                                </p>
                                <ul className="space-y-4 pt-4">
                                    {['Waterbestendig', 'Geluiddempend', 'Geschikt voor vloerverwarming', 'Makkelijk in onderhoud'].map((item, i) => (
                                        <li key={i} className="flex items-center text-brand-dark font-medium">
                                            <CheckCircle2 className="w-5 h-5 mr-3 text-brand-red" />
                                            {item}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </div>
                        <div className="relative rounded-[3rem] overflow-hidden aspect-square shadow-2xl">
                            <img
                                src="https://images.unsplash.com/photo-1541123437800-1bb1317badc2?auto=format&fit=crop&q=80&w=2000"
                                alt="PVC Vloer Detail"
                                className="w-full h-full object-cover"
                            />
                        </div>
                    </div>
                </div>
            </section>

            {/* Content Section 2: Laminaat */}
            <section className="py-24 bg-gray-50 reveal">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
                        <div className="order-2 lg:order-1 relative rounded-[3rem] overflow-hidden aspect-square shadow-2xl">
                            <img
                                src="https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&q=80&w=2000"
                                alt="Laminaat Vloer"
                                className="w-full h-full object-cover"
                            />
                        </div>
                        <div className="order-1 lg:order-2">
                            <div className="w-12 h-12 bg-black rounded-full flex items-center justify-center mb-6 text-white">
                                <Layers className="w-6 h-6" />
                            </div>
                            <h2 className="text-4xl font-bold mb-8">Laminaat Vloeren</h2>
                            <div className="space-y-6 text-gray-500 text-lg leading-relaxed">
                                <p>
                                    Laminaatvloeren hebben zich door de jaren heen bewezen als een favoriete keuze voor velen. Deze bekende vloeroplossing bestaat uit robuuste planken met een geavanceerd clicksysteem. Wat ze echt uniek maakt, is de realistische fotoprint van hout of tegels die ze dragen, afgetopt met een duurzame melamine toplaag.
                                </p>
                                <p>
                                    We zijn trots om samen te werken met gerenommeerde merken zoals Meister. Deze samenwerking stelt ons in staat om onze klanten de allernieuwste innovaties in laminaatvloeren aan te bieden, zoals de verfijnde collecties LINDURA en NADURA.
                                </p>
                                <p>
                                    Deze collecties belichamen het summum van design en duurzaamheid, waardoor uw woonruimte met gemak en stijl transformeert.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* CTA */}
            <section className="py-24 px-4 sm:px-6 lg:px-8 reveal">
                <div className="max-w-7xl mx-auto rounded-[3rem] bg-black p-12 lg:p-24 text-center text-white relative overflow-hidden">
                    <div className="relative z-10 max-w-2xl mx-auto">
                        <h2 className="text-4xl lg:text-5xl font-bold mb-8">Klaar voor een nieuwe <span className="text-brand-red">vloer</span>?</h2>
                        <p className="text-lg opacity-80 mb-10">Neem contact met ons op voor een vrijblijvend adviesgesprek in onze showroom of bij u op locatie.</p>
                        <Button size="lg" withIcon onClick={() => window.location.hash = 'quote'}>Offerte Aanvragen</Button>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default PVCLaminaat;
