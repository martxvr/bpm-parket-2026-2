import React, { useState } from 'react';
import { MapPin, Phone, Clock, CheckCircle, ArrowRight } from 'lucide-react';
import { companyConfig } from '../config';
import DatePicker from '../components/DatePicker';

const Showroom: React.FC = () => {
    const [submitted, setSubmitted] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        date: '',
        time: '',
        message: ''
    });
    const [selectedDateTime, setSelectedDateTime] = useState<Date | null>(null);

    const handleDateChange = (d: Date) => {
        setSelectedDateTime(d);
        updateData('date', d.toLocaleDateString('nl-NL'));
        updateData('time', `${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}`);
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        // In a real app, this would call an API
        console.log('Showroom Appointment Request:', formData);
        setSubmitted(true);
    };

    const updateData = (key: string, value: string) => {
        setFormData(prev => ({ ...prev, [key]: value }));
    };

    if (submitted) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
                <div className="bg-white rounded-[2.5rem] shadow-xl p-12 text-center max-w-lg w-full animate-in zoom-in duration-300">
                    <div className="mx-auto flex items-center justify-center h-20 w-20 rounded-full bg-brand-red text-white mb-6">
                        <CheckCircle className="h-10 w-10" />
                    </div>
                    <h2 className="text-3xl font-bold text-brand-dark mb-4">Afspraak Bevestigd!</h2>
                    <p className="text-gray-500 mb-8">
                        Bedankt {formData.name}. We hebben uw verzoek voor een showroom bezoek ontvangen. We nemen spoedig contact met u op om de afspraak definitief te bevestigen.
                    </p>
                    <button
                        onClick={() => window.location.hash = 'home'}
                        className="bg-brand-dark text-white px-8 py-3 rounded-full font-medium hover:bg-gray-800 transition-colors"
                    >
                        Terug naar Home
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="bg-white min-h-screen">
            {/* Hero Header */}
            <section className="bg-brand-dark text-white py-24 relative overflow-hidden">
                <div className="absolute inset-0 opacity-20">
                    <img
                        src="https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&q=80&w=2000"
                        alt="Showroom background"
                        className="w-full h-full object-cover"
                    />
                </div>
                <div className="max-w-7xl mx-auto px-6 relative z-10">
                    <span className="text-brand-sand font-bold tracking-widest uppercase text-xs mb-4 block">Beleef onze vloeren</span>
                    <h1 className="text-5xl md:text-7xl font-bold tracking-tight mb-6">Onze Showroom</h1>
                    <p className="text-xl text-gray-300 max-w-2xl leading-relaxed">
                        Kom langs in Geldrop en laat u inspireren door onze uitgebreide collectie traditioneel parket, PVC en traprenovaties. Wij staan klaar met persoonlijk advies en een goede kop koffie.
                    </p>
                </div>
            </section>

            <section className="py-24 max-w-7xl mx-auto px-6">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24">

                    {/* Left: Info & Map */}
                    <div className="space-y-12">
                        <div>
                            <h2 className="text-3xl font-bold text-brand-dark mb-8">Bezoekinformatie</h2>
                            <div className="space-y-6">
                                <div className="flex items-start gap-4">
                                    <div className="bg-brand-light p-3 rounded-xl text-brand-dark">
                                        <MapPin size={24} />
                                    </div>
                                    <div>
                                        <h4 className="font-bold">Locatie</h4>
                                        <p className="text-gray-500">{companyConfig.contact.address}<br />{companyConfig.contact.zipCity}</p>
                                    </div>
                                </div>

                                <div className="flex items-start gap-4">
                                    <div className="bg-brand-light p-3 rounded-xl text-brand-dark">
                                        <Clock size={24} />
                                    </div>
                                    <div>
                                        <h4 className="font-bold">Openingstijden</h4>
                                        <ul className="text-gray-500 text-sm space-y-1">
                                            <li className="flex justify-between w-48"><span>Ma - Vr:</span> <span>09:00 - 17:00</span></li>
                                            <li className="flex justify-between w-48"><span>Zaterdag:</span> <span>Op afspraak</span></li>
                                            <li className="flex justify-between w-48"><span>Zondag:</span> <span>Gesloten</span></li>
                                        </ul>
                                    </div>
                                </div>

                                <div className="flex items-start gap-4">
                                    <div className="bg-brand-light p-3 rounded-xl text-brand-dark">
                                        <Phone size={24} />
                                    </div>
                                    <div>
                                        <h4 className="font-bold">Telefoon</h4>
                                        <p className="text-gray-500">{companyConfig.contact.phone}</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Map */}
                        <div className="rounded-[2rem] overflow-hidden h-[350px] shadow-lg border border-brand-light grayscale hover:grayscale-0 transition-all duration-700">
                            <iframe
                                src="https://maps.google.com/maps?q=Hooge+Akker+19,+5661+NG+Geldrop&output=embed"
                                width="100%"
                                height="100%"
                                style={{ border: 0 }}
                                allowFullScreen
                                loading="lazy"
                            ></iframe>
                        </div>
                    </div>

                    {/* Right: Booking Form */}
                    <div className="bg-gray-50 rounded-[3rem] p-8 lg:p-12 border border-brand-light shadow-sm">
                        <h2 className="text-3xl font-bold text-brand-dark mb-2">Afspraak plannen</h2>
                        <p className="text-gray-500 mb-8 font-medium">Plan direct een showroom bezoek in met een van onze adviseurs.</p>

                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div className="space-y-2">
                                <label className="text-xs font-bold text-gray-700 uppercase tracking-widest">Volledige Naam</label>
                                <input
                                    type="text"
                                    required
                                    className="w-full p-4 bg-white border border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-brand-red/10 focus:border-brand-red transition-all"
                                    placeholder="Jan Jansen"
                                    value={formData.name}
                                    onChange={e => updateData('name', e.target.value)}
                                />
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <label className="text-xs font-bold text-gray-700 uppercase tracking-widest">E-mailadres</label>
                                    <input
                                        type="email"
                                        required
                                        className="w-full p-4 bg-white border border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-brand-red/10 focus:border-brand-red transition-all"
                                        placeholder="mail@voorbeeld.nl"
                                        value={formData.email}
                                        onChange={e => updateData('email', e.target.value)}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-xs font-bold text-gray-700 uppercase tracking-widest">Telefoonnummer</label>
                                    <input
                                        type="tel"
                                        required
                                        className="w-full p-4 bg-white border border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-brand-red/10 focus:border-brand-red transition-all"
                                        placeholder="06 12345678"
                                        value={formData.phone}
                                        onChange={e => updateData('phone', e.target.value)}
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-xs font-bold text-gray-700 uppercase tracking-widest">Voorkeursdatum & tijd</label>
                                <DatePicker variant="light" value={selectedDateTime} onChange={handleDateChange} />
                            </div>

                            <div className="space-y-2">
                                <label className="text-xs font-bold text-gray-700 uppercase tracking-widest">Bericht (Optioneel)</label>
                                <textarea
                                    rows={3}
                                    className="w-full p-4 bg-white border border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-brand-red/10 focus:border-brand-red transition-all resize-none"
                                    placeholder="Heeft u specifieke wensen of vragen?"
                                    value={formData.message}
                                    onChange={e => updateData('message', e.target.value)}
                                />
                            </div>

                            <button
                                type="submit"
                                className="w-full bg-brand-red text-white py-5 rounded-2xl font-bold text-lg hover:bg-brand-red/90 transition-all shadow-lg hover:shadow-brand-red/20 active:scale-[0.98] flex items-center justify-center group"
                            >
                                Bevestig Aanvraag
                                <ArrowRight className="ml-2 group-hover:translate-x-1 transition-transform" />
                            </button>
                        </form>
                    </div>

                </div>
            </section>
        </div>
    );
};

export default Showroom;
