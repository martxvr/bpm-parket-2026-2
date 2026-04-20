'use client'

import React, { useState } from 'react'
import { Calendar, ChevronLeft } from 'lucide-react'
import ClockIcon from '@/components/ui/clock-icon'
import UserIcon from '@/components/ui/user-icon'
import MailFilledIcon from '@/components/ui/mail-filled-icon'
import TelephoneIcon from '@/components/ui/telephone-icon'
import RightChevron from '@/components/ui/right-chevron'
import CheckedIcon from '@/components/ui/checked-icon'
import MapPinIcon from '@/components/ui/map-pin-icon'
import SparklesIcon from '@/components/ui/sparkles-icon'

type Step = 'date' | 'time' | 'details' | 'success'

export default function BookingFlow() {
    const [step, setStep] = useState<Step>('date')
    const [selectedDate, setSelectedDate] = useState<Date | null>(null)
    const [selectedTime, setSelectedTime] = useState<string | null>(null)
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        message: ''
    })

    const timeSlots = [
        '09:00', '10:00', '11:00', '13:00', '14:00', '15:00', '16:00'
    ]

    const handleDateSelect = (date: Date) => {
        setSelectedDate(date)
        setStep('time')
    }

    const handleTimeSelect = (time: string) => {
        setSelectedTime(time)
        setStep('details')
    }

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        // In a real app, we would send this to the server action
        console.log('Booking submitted:', { selectedDate, selectedTime, ...formData })
        setStep('success')
    }

    // Simple Calendar Logic for the picker
    const today = new Date()
    const days = []
    for (let i = 0; i < 14; i++) {
        const d = new Date()
        d.setDate(today.getDate() + i)
        if (d.getDay() !== 0) { // Skip Sundays
            days.push(d)
        }
    }

    return (
        <div className="max-w-4xl mx-auto bg-white rounded-3xl shadow-2xl shadow-gray-200/50 border border-gray-100 overflow-hidden animate-blur-in">
            <div className="flex flex-col md:flex-row min-h-[600px]">
                {/* Left Side: Summary */}
                <div className="md:w-1/3 bg-gray-50/50 p-10 border-b md:border-b-0 md:border-r border-gray-100">
                    <div className="flex items-center gap-3 mb-8">
                        <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center shadow-sm border border-brand-primary/10">
                            <MapPinIcon size={24} className="text-brand-primary" />
                        </div>
                        <div>
                            <h3 className="font-black text-gray-900 leading-tight">Showroom Bezoek</h3>
                            <p className="text-gray-400 text-xs font-bold uppercase tracking-widest">30 - 45 min</p>
                        </div>
                    </div>

                    <div className="space-y-6">
                        {selectedDate && (
                            <div className="flex items-center gap-4 animate-slide-up">
                                <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center shadow-sm text-brand-primary">
                                    <Calendar className="w-5 h-5" />
                                </div>
                                <div>
                                    <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">Datum</p>
                                    <p className="font-black text-gray-900">{selectedDate.toLocaleDateString('nl-NL', { weekday: 'long', day: 'numeric', month: 'long' })}</p>
                                </div>
                            </div>
                        )}
                        {selectedTime && (
                            <div className="flex items-center gap-4 animate-slide-up">
                                <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center shadow-sm text-brand-primary">
                                    <ClockIcon size={20} />
                                </div>
                                <div>
                                    <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">Tijdstip</p>
                                    <p className="font-black text-gray-900">{selectedTime} uur</p>
                                </div>
                            </div>
                        )}
                    </div>

                    <div className="mt-12 p-6 bg-brand-primary/5 rounded-3xl border border-brand-primary/10">
                        <p className="text-sm font-medium text-gray-600 italic">
                            "Krijg persoonlijk advies en bekijk onze volledige collectie PVC vloeren in de showroom."
                        </p>
                    </div>
                </div>

                {/* Right Side: Step Content */}
                <div className="flex-1 p-10 relative">
                    {step !== 'success' && step !== 'date' && (
                        <button
                            onClick={() => setStep(step === 'time' ? 'date' : 'time')}
                            className="absolute top-10 left-10 p-2 hover:bg-gray-100 rounded-xl transition-all text-gray-400"
                        >
                            <ChevronLeft className="w-6 h-6" />
                        </button>
                    )}

                    <div className="h-full flex flex-col pt-4">
                        {step === 'date' && (
                            <div className="space-y-8 animate-fade-in">
                                <h2 className="text-3xl font-black text-gray-900 tracking-tight">Kies een datum</h2>
                                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                                    {days.map((d, i) => (
                                        <button
                                            key={i}
                                            onClick={() => handleDateSelect(d)}
                                            className="p-6 bg-white hover:bg-brand-primary hover:text-white border-2 border-gray-100 hover:border-brand-primary rounded-xl transition-all duration-300 group shadow-sm hover:shadow-xl hover:shadow-brand-primary/20 hover:-translate-y-1"
                                        >
                                            <p className="text-[10px] font-black uppercase tracking-widest text-gray-400 group-hover:text-brand-primary-light mb-1">
                                                {d.toLocaleDateString('nl-NL', { weekday: 'short' })}
                                            </p>
                                            <p className="text-2xl font-black">{d.getDate()}</p>
                                            <p className="text-[10px] font-bold opacity-60">
                                                {d.toLocaleDateString('nl-NL', { month: 'short' })}
                                            </p>
                                        </button>
                                    ))}
                                </div>
                            </div>
                        )}

                        {step === 'time' && (
                            <div className="space-y-8 animate-fade-in pl-10">
                                <h2 className="text-3xl font-black text-gray-900 tracking-tight">Hoe laat komt u?</h2>
                                <div className="grid grid-cols-1 gap-3 max-w-sm">
                                    {timeSlots.map((t, i) => (
                                        <button
                                            key={i}
                                            onClick={() => handleTimeSelect(t)}
                                            className="p-5 bg-white hover:bg-brand-primary group border-2 border-gray-100 hover:border-brand-primary rounded-2xl transition-all duration-300 flex items-center justify-between shadow-sm hover:shadow-lg hover:shadow-brand-primary/20"
                                        >
                                            <span className="font-black text-gray-900 group-hover:text-white">{t}</span>
                                            <RightChevron size={20} className="text-gray-300 group-hover:text-white group-hover:translate-x-1 transition-all" />
                                        </button>
                                    ))}
                                </div>
                            </div>
                        )}

                        {step === 'details' && (
                            <form onSubmit={handleSubmit} className="space-y-8 animate-fade-in pl-10">
                                <h2 className="text-3xl font-black text-gray-900 tracking-tight">Uw gegevens</h2>
                                <div className="grid gap-4">
                                    <div className="relative group">
                                        <UserIcon size={20} className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-brand-primary transition-colors" />
                                        <input
                                            required
                                            type="text"
                                            placeholder="Naam"
                                            value={formData.name}
                                            onChange={e => setFormData({ ...formData, name: e.target.value })}
                                            className="w-full pl-14 pr-6 py-5 bg-gray-50 border-2 border-transparent focus:border-brand-primary focus:bg-white rounded-2xl outline-none font-bold text-gray-900 transition-all shadow-inner"
                                        />
                                    </div>
                                    <div className="relative group">
                                        <MailFilledIcon size={20} className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-brand-primary transition-colors" />
                                        <input
                                            required
                                            type="email"
                                            placeholder="E-mailadres"
                                            value={formData.email}
                                            onChange={e => setFormData({ ...formData, email: e.target.value })}
                                            className="w-full pl-14 pr-6 py-5 bg-gray-50 border-2 border-transparent focus:border-brand-primary focus:bg-white rounded-2xl outline-none font-bold text-gray-900 transition-all shadow-inner"
                                        />
                                    </div>
                                    <div className="relative group">
                                        <TelephoneIcon size={20} className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-brand-primary transition-colors" />
                                        <input
                                            required
                                            type="tel"
                                            placeholder="Telefoonnummer"
                                            value={formData.phone}
                                            onChange={e => setFormData({ ...formData, phone: e.target.value })}
                                            className="w-full pl-14 pr-6 py-5 bg-gray-50 border-2 border-transparent focus:border-brand-primary focus:bg-white rounded-2xl outline-none font-bold text-gray-900 transition-all shadow-inner"
                                        />
                                    </div>
                                </div>

                                <button
                                    type="submit"
                                    className="w-full bg-brand-primary hover:bg-brand-secondary text-white py-6 rounded-xl font-black text-xl shadow-xl shadow-brand-primary/20 hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-3"
                                >
                                    Afspraak Bevestigen
                                    <SparklesIcon size={24} />
                                </button>
                            </form>
                        )}

                        {step === 'success' && (
                            <div className="h-full flex flex-col items-center justify-center text-center space-y-8 animate-blur-in">
                                <div className="w-32 h-32 bg-green-50 rounded-3xl flex items-center justify-center animate-bounce shadow-inner">
                                    <CheckedIcon size={64} className="text-green-500" />
                                </div>
                                <div>
                                    <h2 className="text-4xl font-black text-gray-900 mb-4">Bedankt!</h2>
                                    <p className="text-gray-500 font-medium text-lg max-w-sm mx-auto">
                                        Uw afspraak is ingepland. U ontvangt direct een bevestiging in uw mailbox.
                                    </p>
                                </div>
                                <button
                                    onClick={() => setStep('date')}
                                    className="px-10 py-4 border-2 border-gray-100 hover:border-brand-primary rounded-2xl font-black text-gray-500 hover:text-brand-primary transition-all"
                                >
                                    Nog een afspraak?
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    )
}
