import React, { useEffect } from 'react';
import { Layers, Star, CheckCircle2 } from 'lucide-react';
import Button from '../../components/Button';

const Parket = () => {
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
                    <img src="https://images.unsplash.com/photo-1541123437800-1bb1317badc2?auto=format&fit=crop&q=80&w=2000" alt="" className="w-full h-full object-cover opacity-30" />
                </div>
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                    <div className="max-w-3xl reveal">
                        <span className="text-xs font-bold tracking-widest text-brand-red uppercase mb-4 block">Traditie & Vakmanschap</span>
                        <h1 className="text-5xl lg:text-7xl font-bold text-white mb-8 leading-tight">
                            Parket en <span className="text-brand-red">Multiplanken</span>
                        </h1>
                        <p className="text-xl text-white/70 leading-relaxed mb-10">
                            Een parketvloer is meer dan een vloer; het is een levenslange investering in comfort, stijl en warmte.
                        </p>
                        <Button size="lg" withIcon onClick={() => window.location.hash = 'quote'}>Advies Gepland</Button>
                    </div>
                </div>
            </section>

            <section className="py-24 bg-white reveal">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
                        <div>
                            <h2 className="text-4xl font-bold mb-8">Traditioneel Parket</h2>
                            <div className="space-y-6 text-gray-500 text-lg leading-relaxed">
                                <p>
                                    Parketvloeren zijn niet zomaar een keuze; ze zijn een levenslange investering in comfort en stijl. Door hun natuurlijke samenstelling hebben parketvloeren een intrinsieke isolerende werking, waardoor uw voeten altijd een warm en behaaglijk gevoel ervaren, ongeacht het seizoen.
                                </p>
                                <p>
                                    De ware charms van een parketvloer zit echter in de afwerking. Deze bepaalt de unieke esthetiek en uitstraling van de vloer. Wij bieden diverse afwerkingsmogelijkheden, zoals beitsen gecombineerd met oliën, lakken of speciale kleurolie.
                                </p>
                            </div>
                        </div>
                        <div className="rounded-[3rem] overflow-hidden aspect-square">
                            <img src="https://images.unsplash.com/photo-1541123437800-1bb1317badc2?auto=format&fit=crop&q=80&w=2000" alt="Traditioneel Parket" className="w-full h-full object-cover" />
                        </div>
                    </div>
                </div>
            </section>

            <section className="py-24 bg-gray-50 reveal">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
                        <div className="order-2 lg:order-1 rounded-[3rem] overflow-hidden aspect-square">
                            <img src="https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&q=80&w=2000" alt="Multiplanken" className="w-full h-full object-cover" />
                        </div>
                        <div className="order-1 lg:order-2">
                            <h2 className="text-4xl font-bold mb-8">Multiplanken</h2>
                            <div className="space-y-6 text-gray-500 text-lg leading-relaxed">
                                <p>
                                    Multiplanken vertegenwoordigen het perfecte samenspel tussen traditioneel vakmanschap en moderne technologie. Deze vloeren zijn zorgvuldig geconstrueerd met een robuuste multiplex onderlaag, gecomplementeerd door een prachtige toplaag van echt parket.
                                </p>
                                <p>
                                    In de regel verlijmen wij de multiplanken direct op de ondervloer. Dit minimaliseert contactgeluid en beperkt de natuurlijke werking van de planken, wat bijdraagt aan de levensduur van uw vloer.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default Parket;
