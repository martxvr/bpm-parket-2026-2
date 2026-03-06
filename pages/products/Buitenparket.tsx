import React, { useEffect } from 'react';
import { Sun, CheckCircle2 } from 'lucide-react';
import Button from '../../components/Button';

const Buitenparket = () => {
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
            <section className="relative pt-24 pb-32 bg-gray-50 overflow-hidden">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                    <div className="max-w-3xl reveal">
                        <span className="text-xs font-bold tracking-widest text-brand-sand uppercase mb-4 block">Exclusief Buitenleven</span>
                        <h1 className="text-5xl lg:text-7xl font-bold text-brand-dark mb-8 leading-tight">
                            Premium <span className="text-brand-red">Buitenparket</span>
                        </h1>
                        <p className="text-xl text-gray-500 leading-relaxed mb-10">
                            Transformeer uw terras of tuin tot een natuurlijk en warm verlengstuk van uw woning.
                        </p>
                        <Button size="lg" withIcon onClick={() => window.location.hash = 'quote'}>Ontwerp uw terras</Button>
                    </div>
                </div>
            </section>

            <section className="py-24 reveal">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
                        <div className="group rounded-[3rem] overflow-hidden shadow-2xl">
                            <img src="https://images.unsplash.com/photo-1562664377-709f2c337eb2?auto=format&fit=crop&q=80&w=2000" alt="Buitenparket" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
                        </div>
                        <div>
                            <h2 className="text-4xl font-bold mb-8">Elegance in de buitenlucht</h2>
                            <div className="space-y-6 text-gray-500 text-lg leading-relaxed">
                                <p>
                                    Ons buitenparket combineert het beste van esthetiek en functionaliteit. Gemaakt van hoogwaardige materialen, is het ontworpen om weerbestendig te zijn en jarenlang mee te gaan.
                                </p>
                                <p>
                                    Of u nu de natuurlijke warmte van hardhout waardeert of de weerbestendige kwaliteiten van composiet, wij hebben de perfecte keuze voor uw terras of vlonder.
                                </p>
                                <ul className="space-y-4 pt-4">
                                    {['Hoogwaardig hardhout', 'Weerbestendig design', 'Minimaal onderhoud', 'Lange levensduur'].map((item, i) => (
                                        <li key={i} className="flex items-center text-brand-dark font-medium">
                                            <CheckCircle2 className="w-5 h-5 mr-3 text-brand-red" />
                                            {item}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default Buitenparket;
