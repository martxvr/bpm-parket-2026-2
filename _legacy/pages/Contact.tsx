"use client"

import React, { useState, useEffect, useRef } from 'react';

import { Phone, Facebook, Instagram, Linkedin, ArrowUpRight } from 'lucide-react';
import { companyConfig } from '@/config';

export default function ContactPage() {
    const [formData, setFormData] = useState({ name: '', phone: '', message: '' });
    const observerRef = useRef<IntersectionObserver | null>(null);

    useEffect(() => {
        const observerOptions = {
            threshold: 0.1,
            rootMargin: "0px 0px -50px 0px"
        };

        observerRef.current = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('reveal-active');
                    observerRef.current?.unobserve(entry.target);
                }
            });
        }, observerOptions);

        const elements = document.querySelectorAll('.reveal');
        elements.forEach(el => observerRef.current?.observe(el));

        return () => observerRef.current?.disconnect();
    }, []);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        alert(`Bedankt ${formData.name}, we nemen spoedig contact op!`);
        setFormData({ name: '', phone: '', message: '' });
    };

    return (
        <div className="bg-white min-h-screen pt-12 pb-20">
            <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">

                {/* Breadcrumb */}
                <div className="text-[10px] font-bold tracking-[0.2em] text-gray-400 uppercase mb-12 flex items-center gap-2 reveal">
                    <a href="#home" className="hover:text-black transition-colors">Home</a>
                    <span className="text-gray-300">/</span>
                    <span>Contact</span>
                </div>

                {/* Hero / Main Layout */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24 mb-24">

                    {/* Left: Content & Form */}
                    <div className="flex flex-col justify-center reveal">
                        <h1 className="text-5xl md:text-7xl font-bold text-gray-900 mb-16 tracking-tight leading-[1.05]">
                            Laten we uw<br />interieur<br />transformeren
                        </h1>

                        <form onSubmit={handleSubmit} className="space-y-8 max-w-lg">
                            <div className="space-y-2">
                                <label className="text-xs font-bold text-gray-700 uppercase tracking-wide">Uw Naam *</label>
                                <input
                                    type="text"
                                    required
                                    className="w-full p-4 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-black/10 focus:border-black transition-all"
                                    placeholder="Vul uw naam in"
                                    value={formData.name}
                                    onChange={e => setFormData({ ...formData, name: e.target.value })}
                                />
                            </div>

                            <div className="space-y-2">
                                <label className="text-xs font-bold text-gray-700 uppercase tracking-wide">Telefoonnummer *</label>
                                <input
                                    type="tel"
                                    required
                                    className="w-full p-4 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-black/10 focus:border-black transition-all"
                                    placeholder="+31 6 12345678"
                                    value={formData.phone}
                                    onChange={e => setFormData({ ...formData, phone: e.target.value })}
                                />
                            </div>

                            <div className="space-y-2">
                                <label className="text-xs font-bold text-gray-700 uppercase tracking-wide">Bericht *</label>
                                <textarea
                                    required
                                    rows={4}
                                    className="w-full p-4 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-black/10 focus:border-black transition-all resize-none"
                                    placeholder="Vertel ons over uw project..."
                                    value={formData.message}
                                    onChange={e => setFormData({ ...formData, message: e.target.value })}
                                />
                            </div>

                            <div className="pt-4">
                                <button
                                    type="submit"
                                    className="bg-black text-white px-8 py-4 rounded-full font-bold text-xs hover:bg-gray-800 transition-all uppercase tracking-widest shadow-lg hover:shadow-xl hover:-translate-y-1"
                                >
                                    Verstuur Bericht
                                </button>
                            </div>
                        </form>
                    </div>

                    {/* Right: Image */}
                    <div className="relative hidden lg:block reveal delay-100">
                        <div className="aspect-[4/5] rounded-[2.5rem] overflow-hidden bg-gray-100 relative shadow-2xl">
                            <img
                                src="https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&q=80&w=1000"
                                alt="Houten interieur"
                                className="w-full h-full object-cover transition-transform duration-1000 hover:scale-105"
                            />
                            <div className="absolute top-8 right-8 bg-white/90 backdrop-blur-md px-6 py-3 rounded-full flex items-center gap-3 shadow-sm border border-white/50">
                                <Phone size={16} className="text-gray-900" />
                                <span className="text-xs font-bold text-gray-900">{companyConfig.contact.phone}</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Info Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 border-t border-gray-100 pt-20 mb-24 reveal delay-200">
                    <div className="space-y-4 group">
                        <h3 className="text-xl font-bold text-gray-900">E-mail</h3>
                        <p className="text-sm text-gray-500 leading-relaxed">Stuur ons uw vragen en wij reageren binnen 24 uur.</p>
                        <a href={`mailto:${companyConfig.contact.email}`} className="text-sm font-bold border-b border-gray-200 pb-0.5 group-hover:text-black group-hover:border-black transition-all inline-block">
                            {companyConfig.contact.email}
                        </a>
                    </div>

                    <div className="space-y-4 group">
                        <h3 className="text-xl font-bold text-gray-900">Infoline</h3>
                        <p className="text-sm text-gray-500 leading-relaxed">Bel ons voor direct advies bij vragen over uw project.</p>
                        <a href={`tel:${companyConfig.contact.phone}`} className="text-sm font-bold border-b border-gray-200 pb-0.5 group-hover:text-black group-hover:border-black transition-all inline-block">
                            {companyConfig.contact.phone}
                        </a>
                    </div>

                    <div className="space-y-4">
                        <h3 className="text-xl font-bold text-gray-900">Socials</h3>
                        <p className="text-sm text-gray-500 leading-relaxed">Volg ons online voor inspiratie en de laatste updates.</p>
                        <div className="flex gap-3 pt-1">
                            <a href={companyConfig.socials.facebook} target="_blank" rel="noopener noreferrer" className="bg-black text-white p-2.5 rounded-full hover:bg-gray-800 transition-colors"><Facebook size={16} /></a>
                            <a href={companyConfig.socials.instagram} target="_blank" rel="noopener noreferrer" className="bg-black text-white p-2.5 rounded-full hover:bg-gray-800 transition-colors"><Instagram size={16} /></a>
                            <a href={companyConfig.socials.linkedin} target="_blank" rel="noopener noreferrer" className="bg-black text-white p-2.5 rounded-full hover:bg-gray-800 transition-colors"><Linkedin size={16} /></a>
                        </div>
                    </div>

                    <div className="space-y-4 group">
                        <h3 className="text-xl font-bold text-gray-900">Adres</h3>
                        <p className="text-sm text-gray-500 leading-relaxed">Bezoek onze showroom voor stalen.</p>
                        <a href={companyConfig.contact.mapsUrl} target="_blank" rel="noreferrer" className="text-sm font-bold border-b border-gray-200 pb-0.5 group-hover:text-black group-hover:border-black transition-all inline-flex items-center">
                            {companyConfig.contact.address}, {companyConfig.contact.zipCity.split(' ')[1]} <ArrowUpRight size={12} className="ml-1" />
                        </a>
                    </div>
                </div>

                {/* Map Section */}
                <div className="w-full h-[400px] lg:h-[500px] bg-gray-100 rounded-[3rem] overflow-hidden relative grayscale hover:grayscale-0 transition-all duration-1000 shadow-inner reveal delay-300">
                    <iframe
                        src="https://maps.google.com/maps?q=Hooge+Akker+19,+5661+NG+Geldrop&output=embed"
                        width="100%"
                        height="100%"
                        style={{ border: 0 }}
                        allowFullScreen
                        loading="lazy"
                        className="absolute inset-0 w-full h-full opacity-80 hover:opacity-100 transition-opacity"
                    />
                    <div className="absolute bottom-8 left-8 bg-white px-6 py-4 rounded-2xl shadow-xl z-10 hidden md:block">
                        <p className="font-bold text-gray-900">{companyConfig.name} HQ</p>
                        <p className="text-xs text-gray-500">{companyConfig.contact.address}, {companyConfig.contact.zipCity}</p>
                    </div>
                </div>

            </div>
        </div>
    );
}