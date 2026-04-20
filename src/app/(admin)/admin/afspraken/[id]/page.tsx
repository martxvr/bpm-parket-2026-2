import React from 'react'
import Link from 'next/link'
import { Calendar } from 'lucide-react'
import ArrowBackIcon from '@/components/ui/arrow-back-icon'
import SaveIcon from '@/components/ui/save-icon'
import ClockIcon from '@/components/ui/clock-icon'
import UserIcon from '@/components/ui/user-icon'
import InfoCircleIcon from '@/components/ui/info-circle-icon'
import SparklesIcon from '@/components/ui/sparkles-icon'
import DownChevron from '@/components/ui/down-chevron'
import CheckedIcon from '@/components/ui/checked-icon'
import HistoryCircleIcon from '@/components/ui/history-circle-icon'
import MessageCircleIcon from '@/components/ui/message-circle-icon'
import { saveAppointment } from '../actions'
import { DateTimePicker } from '@/components/ui/date-time-picker'
import { getAppointment, getCustomers } from '@/lib/admin-data'

export default async function AppointmentEditorPage(props: {
    params: Promise<{ id: string }>
}) {
    const params = await props.params;
    const isNew = !params?.id || params.id === 'new'
    const [appointment, customers] = await Promise.all([
        isNew ? null : getAppointment(params.id),
        getCustomers(),
    ])

    return (
        <div className="max-w-5xl mx-auto space-y-12 pb-24 animate-fade-in">
            {/* Header Section */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                <div className="flex items-center gap-6 animate-slide-up">
                    <Link
                        href="/admin/afspraken"
                        className="w-10 h-10 bg-white border border-gray-100 rounded-xl flex items-center justify-center text-gray-400 hover:text-brand-primary hover:border-brand-primary/20 hover:shadow-xl hover:shadow-gray-200/50 transition-all group"
                    >
                        <ArrowBackIcon size={24} className="group-hover:-translate-x-1 transition-transform" />
                    </Link>
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900 tracking-tight flex items-center gap-3">
                            {isNew ? 'Nieuwe Afspraak' : 'Afspraak Bewerken'}
                            <Calendar className="w-4 h-4 text-brand-primary" />
                        </h1>
                        <p className="text-gray-500 mt-2 text-sm font-medium">Plan en beheer de afspraken met je klanten.</p>
                    </div>
                </div>
            </div>

            <form action={saveAppointment} className="space-y-8">
                {appointment && <input type="hidden" name="id" value={appointment.id} />}

                <div className="max-w-4xl mx-auto bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden animate-slide-up">
                    <div className="p-6 border-b border-gray-100 bg-gray-50/50 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                        <div className="flex items-center gap-3">
                            <div className="p-1.5 bg-brand-primary/10 rounded-lg">
                                <UserIcon size={16} className="text-brand-primary" />
                            </div>
                            <h3 className="text-base font-bold text-gray-900">1. Klant & Service</h3>
                        </div>
                    </div>

                    <div className="p-6 space-y-6">
                        <div>
                            <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-3 ml-1">Kies een bestaande klant</label>
                            <div className="relative">
                                <select
                                    name="customer_id"
                                    defaultValue={appointment?.customer_id || ''}
                                    required
                                    className="w-full appearance-none px-4 py-2 text-sm bg-gray-50 border border-gray-100 rounded-xl focus:ring-4 focus:ring-brand-primary/10 focus:border-brand-primary focus:bg-white transition-all outline-none font-bold text-gray-900 pr-9"
                                >
                                    <option value="" disabled>Selecteer een klant...</option>
                                    {customers.map((customer) => (
                                        <option key={customer.id} value={customer.id}>
                                            {customer.name} {customer.company_name ? `(${customer.company_name})` : ''}
                                        </option>
                                    ))}
                                </select>
                                <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400">
                                    <DownChevron size={20} />
                                </div>
                            </div>
                            <p className="text-xs text-gray-400 mt-3 flex items-center gap-1.5 font-medium ml-1">
                                <InfoCircleIcon size={12} className="text-brand-primary" />
                                Staat de klant er niet tussen? Maak deze eerst aan bij 'Klanten'.
                            </p>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-3 ml-1">Service / Dienst</label>
                                <div className="relative">
                                    <select
                                        name="service"
                                        defaultValue={appointment?.service || 'pvc-vloeren'}
                                        required
                                        className="w-full appearance-none px-4 py-2 text-sm bg-gray-50 border border-gray-100 rounded-xl focus:ring-4 focus:ring-brand-primary/10 focus:border-brand-primary focus:bg-white transition-all outline-none font-bold text-gray-900 pr-9"
                                    >
                                        <option value="pvc-vloeren">PVC-vloeren</option>
                                        <option value="traprenovatie">Traprenovatie</option>
                                        <option value="vloerbedekking">Vloerbedekking</option>
                                        <option value="raamdecoratie">Raamdecoratie</option>
                                        <option value="gordijnen">Gordijnen</option>
                                        <option value="anders">Anders / Bezichtiging</option>
                                    </select>
                                    <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400">
                                        <DownChevron size={20} />
                                    </div>
                                </div>
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-3 ml-1">Bron van Afspraak</label>
                                <div className="relative">
                                    <select
                                        name="source"
                                        defaultValue={appointment?.source || 'handmatig'}
                                        required
                                        className="w-full appearance-none px-4 py-2 text-sm bg-gray-50 border border-gray-100 rounded-xl focus:ring-4 focus:ring-brand-primary/10 focus:border-brand-primary focus:bg-white transition-all outline-none font-bold text-gray-900 pr-9 cursor-not-allowed"
                                        disabled={!isNew}
                                    >
                                        <option value="handmatig">Handmatig ingevoerd</option>
                                        <option value="chatbot">Via AI Chatbot</option>
                                    </select>
                                    <HistoryCircleIcon className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-300" />
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="p-6 border-y border-gray-100 bg-gray-50/50 flex items-center gap-3">
                        <div className="p-1.5 bg-brand-primary/10 rounded-lg">
                            <ClockIcon size={16} className="text-brand-primary" />
                        </div>
                        <h3 className="text-base font-bold text-gray-900">2. Planning & Status</h3>
                    </div>

                    <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
                        <div>
                            <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-2 ml-1">Datum & Tijdstip</label>
                            <DateTimePicker 
                                name="date"
                                value={appointment?.date ? new Date(appointment.date) : undefined}
                                required
                            />
                        </div>

                        <div>
                            <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-2 ml-1">Huidige Status</label>
                            <div className="relative">
                                <select
                                    name="status"
                                    defaultValue={appointment?.status || 'nieuw'}
                                    required
                                    className="w-full appearance-none px-4 py-2 text-sm bg-gray-50 border border-gray-100 rounded-xl focus:ring-2 focus:ring-brand-primary/20 focus:border-brand-primary focus:bg-white transition-all outline-none font-bold text-gray-900 pr-9"
                                >
                                    <option value="nieuw">Nieuw</option>
                                    <option value="bevestigd">Bevestigd</option>
                                    <option value="afgerond">Afgerond</option>
                                    <option value="geannuleerd">Geannuleerd</option>
                                </select>
                                <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400">
                                    <DownChevron size={20} />
                                </div>
                            </div>
                        </div>

                        {!isNew && appointment?.source === 'chatbot' && (
                            <div className="md:col-span-2 p-4 bg-brand-primary/5 rounded-xl border border-brand-primary/10 flex items-start gap-3 mt-2">
                                <SparklesIcon size={16} className="text-brand-primary shrink-0 mt-0.5" />
                                <p className="text-sm font-medium text-brand-primary/80 leading-relaxed">
                                    Deze afspraak is automatisch ingepland via de AI chatbot.
                                </p>
                            </div>
                        )}
                    </div>

                    <div className="p-6 border-y border-gray-100 bg-gray-50/50 flex items-center gap-3">
                        <div className="p-1.5 bg-brand-primary/10 rounded-lg">
                            <MessageCircleIcon size={16} className="text-brand-primary" />
                        </div>
                        <h3 className="text-base font-bold text-gray-900">3. Notities & Details</h3>
                    </div>

                    <div className="p-6 space-y-6">
                        <div>
                            <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-3 ml-1">Notities / Bijzonderheden</label>
                            <textarea
                                name="notes"
                                defaultValue={appointment?.notes}
                                rows={3}
                                className="w-full px-4 py-2 text-sm bg-gray-50 border border-gray-100 rounded-xl focus:ring-4 focus:ring-brand-primary/10 focus:border-brand-primary focus:bg-white transition-all outline-none font-medium text-gray-700 leading-relaxed"
                                placeholder="Bijv. Klant wil stalen bekijken van houtlook PVC, heeft voorkeur voor egaliseren in de ochtend..."
                            />
                        </div>
                    </div>

                    {/* Footer Actions */}
                    <div className="p-6 bg-gray-50 border-t border-gray-100 flex flex-col-reverse sm:flex-row items-center justify-end gap-3">
                        <Link
                            href="/admin/afspraken"
                            className="w-full sm:w-auto px-6 py-2.5 text-sm bg-white text-gray-600 font-bold rounded-xl border border-gray-200 hover:bg-gray-50 transition-colors text-center"
                        >
                            Annuleren
                        </Link>
                        <button
                            type="submit"
                            className="w-full sm:w-auto px-8 py-2.5 text-sm bg-brand-primary text-white rounded-xl font-black shadow-lg shadow-brand-primary/20 hover:scale-105 active:scale-95 transition-all flex items-center justify-center gap-2"
                        >
                            <SaveIcon size={20} />
                            Afspraak Opslaan
                        </button>
                    </div>
                </div>
            </form>
        </div>
    )
}
