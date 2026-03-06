import React, { useEffect } from 'react';
import { PenTool, CheckCircle2 } from 'lucide-react';
import Button from '../../components/Button';

const Interieurwerken = () => {
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
            <section className="relative pt-24 pb-32 bg-brand-dark text-white overflow-hidden">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                    <div className="max-w-3xl reveal">
                        <span className="text-xs font-bold tracking-widest text-brand-sand uppercase mb-4 block">Maatwerk</span>
                        <h1 className="text-5xl lg:text-7xl font-bold mb-8 leading-tight">
                            Exclusieve <span className="text-brand-red">Interieurwerken</span>
                        </h1>
                        <p className="text-xl opacity-80 leading-relaxed mb-10">
                            Van akoestische wandpanelen tot op maat gemaakte aanpassingen; wij realiseren uw visie met precisie.
                        </p>
                        <Button size="lg" withIcon onClick={() => window.location.hash = 'quote'}>Uw droominterieur</Button>
                    </div>
                </div>
            </section>

            <section className="py-24 bg-white reveal">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
                        <div>
                            <h2 className="text-4xl font-bold mb-8">Interieur op maat</h2>
                            <p className="text-gray-500 text-lg leading-relaxed mb-8">
                                Bij ons staat uw visie centraal. We begrijpen dat elk huis uniek is en elke klant specifieke wensen heeft. Daarom nemen we de tijd om in nauw overleg met u de perfecte oplossingen te ontwerpen die resulteren in een op maat gemaakte leefruimte.
                            </p>
                            <h3 className="text-2xl font-bold mb-4">Akoestische Wandpanelen</h3>
                            <p className="text-gray-500 text-lg leading-relaxed">
                                Akoestische wandpanelen vormen de brug tussen esthetiek en comfort. Ze transformeren de geluidskwaliteit van een ruimte en voegen tegelijkertijd een verfijnde visuele flair toe met prachtige lamellenwanden.
                            </p>
                        </div>
                        <div className="bg-gray-100 rounded-[3rem] overflow-hidden aspect-video lg:aspect-square flex items-center justify-center">
                            <img src="https://images.unsplash.com/photo-1541123437800-1bb1317badc2?auto=format&fit=crop&q=80&w=2000" alt="Interieurwerk" className="w-full h-full object-cover" />
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default Interieurwerken;
