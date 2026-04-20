"use client"

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import ClockIcon from '@/components/ui/clock-icon';
import MapPinIcon from '@/components/ui/map-pin-icon';
import TelephoneIcon from '@/components/ui/telephone-icon';
import CheckedIcon from '@/components/ui/checked-icon';
import { companyConfig } from '@/config';
import Button from '@/components/Button';
import { DateTimePicker } from '@/components/ui/date-time-picker';
import { submitShowroomAppointment } from '../actions';
import { checkAvailability } from '@/app/api/chat/chat-actions';

export default function ShowroomClient({ bedrijfsgegevens }: { bedrijfsgegevens?: any }) {
    const router = useRouter();
    const [submitted, setSubmitted] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        date: '',
        message: ''
    });
    const [bookedTimes, setBookedTimes] = useState<string[]>([]);

    const selectedDateStr = formData.date ? formData.date.substring(0, 10) : "";

    useEffect(() => {
        if (selectedDateStr) {
            checkAvailability(selectedDateStr).then(res => {
                if (res.bookedTimes) {
                    setBookedTimes(res.bookedTimes);
                }
            });
        } else {
            setBookedTimes([]);
        }
    }, [selectedDateStr]);

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

    const address = bedrijfsgegevens?.address || companyConfig.contact.address;
    const zipCity = bedrijfsgegevens?.postcode && bedrijfsgegevens?.city
        ? `${bedrijfsgegevens.postcode} ${bedrijfsgegevens.city}`
        : companyConfig.contact.zipCity;
    const companyPhone = bedrijfsgegevens?.phone || companyConfig.contact.phone;

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await submitShowroomAppointment(formData);
            setSubmitted(true);
        } catch (error) {
            console.error('Failed to submit appointment', error);
        }
    };

    const updateData = (key: string, value: string) => {
        setFormData(prev => ({ ...prev, [key]: value }));
    };

    if (submitted) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
                <div className="bg-white rounded-[2.5rem] shadow-xl p-12 text-center max-w-lg w-full">
                    <div className="mx-auto flex items-center justify-center h-20 w-20 rounded-full bg-brand-primary text-white mb-6">
                        <CheckedIcon size={40} />
                    </div>
                    <h2 className="text-3xl font-bold text-brand-dark mb-4">Afspraak Bevestigd!</h2>
                    <p className="text-gray-500 mb-8">
                        Bedankt {formData.name}. We hebben uw verzoek voor een showroom bezoek ontvangen. We nemen spoedig contact met u op om de afspraak definitief te bevestigen.
                    </p>
                    <Button onClick={() => router.push('/')}>
                        Terug naar Home
                    </Button>
                </div>
            </div>
        );
    }

    return (
        <div className="bg-white min-h-screen">

            {/* Hero Header */}
            <section className="bg-brand-dark text-white py-16 lg:py-24 relative overflow-hidden reveal reveal-active">
                <div className="absolute inset-0 opacity-40">
                    <img
                        src="/images/showroom-groen.jpg.webp"
                        alt="Onze luxe showroom in Doetinchem"
                        className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-r from-brand-dark via-brand-dark/60 to-transparent"></div>
                </div>
                <div className="max-w-7xl mx-auto px-6 relative z-10">
                    <span className="text-brand-primary font-bold tracking-widest uppercase text-xs mb-4 block decoration-brand-primary/30 decoration-4 underline-offset-8">Beleef onze producten</span>
                    <h1 className="text-5xl md:text-[5.5rem] font-bold tracking-tight mb-8 leading-[1.1]">Onze <span className="text-brand-primary">Showroom</span></h1>
                    <p className="text-xl text-gray-300 max-w-2xl leading-relaxed font-light opacity-90">
                        Kom langs in Doetinchem en laat u inspireren door onze uitgebreide collectie PVC-vloeren, vloerbedekking, raamdecoratie en gordijnen. Wij staan klaar met persoonlijk advies en een goede kop koffie.
                    </p>
                </div>
            </section>

            <section className="py-16 lg:py-20 max-w-7xl mx-auto px-6">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16">

                    {/* Left: Info & Map */}
                    <div className="space-y-12">
                        <div>
                            <h2 className="text-3xl font-bold text-brand-dark mb-8">Bezoekinformatie</h2>
                            <div className="space-y-6">
                                <div className="flex items-start gap-4">
                                    <div className="bg-brand-primary/10 p-3 rounded-xl text-brand-primary">
                                        <MapPinIcon size={24} />
                                    </div>
                                    <div>
                                        <h4 className="font-bold">Locatie</h4>
                                        <p className="text-gray-500">{address}<br />{zipCity}</p>
                                    </div>
                                </div>

                                <div className="flex items-start gap-4">
                                    <div className="bg-brand-primary/10 p-3 rounded-xl text-brand-primary">
                                        <ClockIcon size={24} />
                                    </div>
                                    <div>
                                        <h4 className="font-bold">Openingstijden</h4>
                                        <ul className="text-gray-500 text-sm space-y-1">
                                            <li className="flex justify-between w-64"><span>Maandag:</span> <span>{companyConfig.openingHours.monday}</span></li>
                                            <li className="flex justify-between w-64"><span>Dinsdag:</span> <span>{companyConfig.openingHours.tuesday}</span></li>
                                            <li className="flex justify-between w-64"><span>Woensdag:</span> <span>{companyConfig.openingHours.wednesday}</span></li>
                                            <li className="flex justify-between w-64"><span>Donderdag:</span> <span>{companyConfig.openingHours.thursday}</span></li>
                                            <li className="flex justify-between w-64"><span>Vrijdag:</span> <span>{companyConfig.openingHours.friday}</span></li>
                                            <li className="flex justify-between w-64"><span>Zaterdag:</span> <span>{companyConfig.openingHours.saturday}</span></li>
                                            <li className="flex justify-between w-64"><span>Zondag:</span> <span>{companyConfig.openingHours.sunday}</span></li>
                                        </ul>
                                    </div>
                                </div>

                                <div className="flex items-start gap-4">
                                    <div className="bg-brand-primary/10 p-3 rounded-xl text-brand-primary">
                                        <TelephoneIcon size={24} />
                                    </div>
                                    <div>
                                        <h4 className="font-bold">Telefoon</h4>
                                        <a href={`tel:${companyPhone}`} className="text-gray-500 hover:text-brand-primary transition-colors">
                                            {companyPhone}
                                        </a>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Map */}
                        <div className="rounded-[2rem] overflow-hidden h-[350px] shadow-lg border border-gray-100 grayscale hover:grayscale-0 transition-all duration-700">
                            <iframe
                                src="https://maps.google.com/maps?q=Logistiekweg+20,+7007+CJ+Doetinchem&output=embed"
                                width="100%"
                                height="100%"
                                style={{ border: 0 }}
                                allowFullScreen
                                loading="lazy"
                                title="Locatie PVC Vloeren Achterhoek"
                            />
                        </div>
                    </div>

                    {/* Right: Booking Form */}
                    <div className="bg-gray-50 rounded-[3rem] p-8 lg:p-12 border border-gray-100 shadow-sm">
                        <h2 className="text-3xl font-bold text-brand-dark mb-2">Afspraak plannen</h2>
                        <p className="text-gray-500 mb-8 font-medium">Plan direct een showroom bezoek in met een van onze adviseurs.</p>

                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div className="space-y-2">
                                <label htmlFor="showroom-name" className="text-xs font-bold text-gray-700 uppercase tracking-widest">Volledige Naam</label>
                                <input
                                    id="showroom-name"
                                    type="text"
                                    required
                                    className="w-full p-4 bg-white border border-gray-200 rounded-[5px] focus:outline-none focus:ring-2 focus:ring-brand-primary/20 focus:border-brand-primary transition-all"
                                    placeholder="Jan Jansen"
                                    value={formData.name}
                                    onChange={e => updateData('name', e.target.value)}
                                />
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <label htmlFor="showroom-email" className="text-xs font-bold text-gray-700 uppercase tracking-widest">E-mailadres</label>
                                    <input
                                        id="showroom-email"
                                        type="email"
                                        required
                                        className="w-full p-4 bg-white border border-gray-200 rounded-[5px] focus:outline-none focus:ring-2 focus:ring-brand-primary/20 focus:border-brand-primary transition-all"
                                        placeholder="mail@voorbeeld.nl"
                                        value={formData.email}
                                        onChange={e => updateData('email', e.target.value)}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label htmlFor="showroom-phone" className="text-xs font-bold text-gray-700 uppercase tracking-widest">Telefoonnummer</label>
                                    <input
                                        id="showroom-phone"
                                        type="tel"
                                        required
                                        className="w-full p-4 bg-white border border-gray-200 rounded-[5px] focus:outline-none focus:ring-2 focus:ring-brand-primary/20 focus:border-brand-primary transition-all"
                                        placeholder="06 12345678"
                                        value={formData.phone}
                                        onChange={e => updateData('phone', e.target.value)}
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-2 md:col-span-2">
                                    <label className="text-xs font-bold text-gray-700 uppercase tracking-widest">Datum & Tijdstip</label>
                                    <DateTimePicker
                                        value={formData.date ? new Date(formData.date.replace('Z', '')) : undefined}
                                        onChange={(d) => {
                                            const pad = (n: number) => n.toString().padStart(2, '0');
                                            const localIso = `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}:00Z`;
                                            updateData('date', localIso);
                                        }}
                                        required
                                        disabledTimes={bookedTimes}
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label htmlFor="showroom-message" className="text-xs font-bold text-gray-700 uppercase tracking-widest">Bericht (Optioneel)</label>
                                <textarea
                                    id="showroom-message"
                                    rows={3}
                                    className="w-full p-4 bg-white border border-gray-200 rounded-[5px] focus:outline-none focus:ring-2 focus:ring-brand-primary/20 focus:border-brand-primary transition-all resize-none"
                                    placeholder="Heeft u specifieke wensen of vragen?"
                                    value={formData.message}
                                    onChange={e => updateData('message', e.target.value)}
                                />
                            </div>

                            <Button
                                type="submit"
                                fullWidth
                                size="lg"
                                withIcon
                            >
                                Bevestig Aanvraag
                            </Button>
                        </form>
                    </div>

                </div>
            </section>

            {/* Visual Showcase Section - Refined Staggered Layout */}
            <section className="py-20 lg:py-28 bg-gray-50 reveal">
                <div className="max-w-7xl mx-auto px-6">
                    <div className="flex flex-col md:grid md:grid-cols-12 gap-8 lg:gap-16 items-start">
                        {/* Image 1 - Larger & Featured */}
                        <div className="md:col-span-7 relative rounded-[4rem] overflow-hidden shadow-2xl group h-[500px] lg:h-[700px]">
                            <img
                                src="/images/brands/art-of-living/sfeer-woonkamer-fauteuil.webp"
                                alt="Showroom sfeer interieur"
                                className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105"
                            />
                            <div className="absolute inset-x-0 bottom-0 p-10 bg-gradient-to-t from-black/60 to-transparent flex flex-col justify-end">
                                <h4 className="text-white font-bold text-2xl mb-2">Inspirerende Traprenovatie</h4>
                                <p className="text-white/70 text-sm max-w-sm">Hoogwaardige materialen gemonteerd door onze eigen specialisten.</p>
                            </div>
                        </div>

                        <div className="md:col-span-5 relative rounded-[3rem] overflow-hidden shadow-xl group h-[400px] lg:h-[550px] md:mt-24">
                            <img
                                src="/images/brands/invictus/mood-2.webp"
                                alt="Showroom sfeer vloer"
                                className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105"
                            />
                            <div className="absolute inset-x-0 bottom-0 p-8 bg-gradient-to-t from-black/60 to-transparent flex flex-col justify-end">
                                <h4 className="text-white font-bold text-xl mb-1">Passie voor Interieur</h4>
                                <p className="text-white/70 text-xs font-medium">Beleef de sfeer van een modern interieur.</p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
}