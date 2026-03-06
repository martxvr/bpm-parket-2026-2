import React, { useEffect } from 'react';
import { Hammer, CheckCircle2 } from 'lucide-react';
import Button from '../../components/Button';

const Legservice = () => {
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
            <section className="relative pt-24 pb-32 bg-gray-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="max-w-3xl reveal">
                        <span className="text-xs font-bold tracking-widest text-brand-sand uppercase mb-4 block">Vakmanschap</span>
                        <h1 className="text-5xl lg:text-7xl font-bold text-brand-dark mb-8 leading-tight">
                            Professionele <span className="text-brand-red">Legservice</span>
                        </h1>
                        <p className="text-xl text-gray-500 leading-relaxed mb-10">
                            Onze experts zorgen voor een perfecte installatie van uw nieuwe vloer, met oog voor elk detail.
                        </p>
                        <Button size="lg" withIcon onClick={() => window.location.hash = 'quote'}>Plan uw installatie</Button>
                    </div>
                </div>
            </section>

            <section className="py-24 reveal">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center max-w-4xl mx-auto">
                    <h2 className="text-4xl font-bold mb-8">Zorgeloze Installatie</h2>
                    <p className="text-xl text-gray-500 leading-relaxed mb-12">
                        Van het egaliseren van de ondervloer tot het plaatsen van de laatste plint; wij nemen het volledige traject uit handen. Onze interieurwerken combineren esthetiek met vakmanschap voor naadloze vloeren.
                    </p>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {[
                            { title: 'Egaliseren', desc: 'Een perfect gladde basis voor uw nieuwe vloer.' },
                            { title: 'Vakkundig Leggen', desc: 'Precisiewerk door ervaren parketteurs.' },
                            { title: 'Afwerking', desc: 'Plinten en profielen voor een strak resultaat.' }
                        ].map((step, i) => (
                            <div key={i} className="bg-white p-8 rounded-[2rem] border border-gray-100 shadow-sm">
                                <h3 className="text-xl font-bold mb-4">{step.title}</h3>
                                <p className="text-gray-500">{step.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>
        </div>
    );
};

export default Legservice;
