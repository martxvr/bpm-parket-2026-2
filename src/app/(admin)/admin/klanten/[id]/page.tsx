import React from 'react'
import Link from 'next/link'
import ArrowBackIcon from '@/components/ui/arrow-back-icon'
import SaveIcon from '@/components/ui/save-icon'
import UserIcon from '@/components/ui/user-icon'
import HomeIcon from '@/components/ui/home-icon'
import MailFilledIcon from '@/components/ui/mail-filled-icon'
import TelephoneIcon from '@/components/ui/telephone-icon'
import MapPinIcon from '@/components/ui/map-pin-icon'
import CheckedIcon from '@/components/ui/checked-icon'
import InfoCircleIcon from '@/components/ui/info-circle-icon'
import MessageCircleIcon from '@/components/ui/message-circle-icon'
import { saveCustomer } from '../actions'
import { getCustomer } from '@/lib/admin-data'

export default async function CustomerEditorPage(props: {
    params: Promise<{ id: string }>
}) {
    const params = await props.params;
    const isNew = !params?.id || params.id === 'new'
    const customer = isNew ? null : await getCustomer(params.id)

    return (
        <div className="max-w-5xl mx-auto space-y-12 pb-24 animate-fade-in">
            {/* Header Section */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                <div className="flex items-center gap-6 animate-slide-up">
                    <Link
                        href="/admin/klanten"
                        className="w-10 h-10 bg-white border border-gray-100 rounded-xl flex items-center justify-center text-gray-400 hover:text-brand-primary hover:border-brand-primary/20 hover:shadow-xl hover:shadow-gray-200/50 transition-all group"
                    >
                        <ArrowBackIcon size={24} className="group-hover:-translate-x-1 transition-transform" />
                    </Link>
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900 tracking-tight flex items-center gap-3">
                            {isNew ? 'Nieuwe Klant' : 'Klant Bewerken'}
                            <UserIcon size={16} className="text-brand-primary" />
                        </h1>
                        <p className="text-gray-500 mt-2 text-sm font-medium">Beheer alle gegevens en contracten van je relaties.</p>
                    </div>
                </div>
            </div>

            <form action={saveCustomer} className="space-y-10">
                {customer && <input type="hidden" name="id" value={customer.id} />}

                <div className="max-w-4xl mx-auto bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden animate-slide-up">
                    <div className="p-6 border-b border-gray-100 bg-gray-50/50 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                        <div className="flex items-center gap-3">
                            <div className="p-1.5 bg-brand-primary/10 rounded-lg">
                                <UserIcon size={16} className="text-brand-primary" />
                            </div>
                            <h3 className="text-base font-bold text-gray-900">1. Persoonlijke Gegevens</h3>
                        </div>
                    </div>

                    <div className="p-6 space-y-8">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="md:col-span-2">
                                <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-3 ml-1">Volledige Naam</label>
                                <div className="relative">
                                    <input
                                        type="text"
                                        name="name"
                                        defaultValue={customer?.name}
                                        required
                                        className="w-full px-4 py-2 text-sm bg-gray-50 border border-gray-100 rounded-xl focus:ring-4 focus:ring-brand-primary/10 focus:border-brand-primary focus:bg-white transition-all outline-none font-bold text-gray-900 pr-9"
                                        placeholder="Jan Janssen"
                                    />
                                    <UserIcon className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-300" />
                                </div>
                            </div>

                            <div className="md:col-span-2">
                                <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-3 ml-1">Bedrijfsnaam (Optioneel)</label>
                                <div className="relative">
                                    <input
                                        type="text"
                                        name="company_name"
                                        defaultValue={customer?.company_name}
                                        className="w-full px-4 py-2 text-sm bg-gray-50 border border-gray-100 rounded-xl focus:ring-4 focus:ring-brand-primary/10 focus:border-brand-primary focus:bg-white transition-all outline-none font-bold text-gray-900 pr-9"
                                        placeholder="Janssen B.V."
                                    />
                                    <HomeIcon className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-300" />
                                </div>
                            </div>

                            <div>
                                <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-3 ml-1">E-mailadres</label>
                                <div className="relative">
                                    <input
                                        type="email"
                                        name="email"
                                        defaultValue={customer?.email}
                                        className="w-full px-4 py-2 text-sm bg-gray-50 border border-gray-100 rounded-xl focus:ring-4 focus:ring-brand-primary/10 focus:border-brand-primary focus:bg-white transition-all outline-none font-bold text-gray-900 pr-9"
                                        placeholder="jan@voorbeeld.nl"
                                    />
                                    <MailFilledIcon className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-300" />
                                </div>
                            </div>

                            <div>
                                <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-3 ml-1">Telefoonnummer</label>
                                <div className="relative">
                                    <input
                                        type="text"
                                        name="phone"
                                        defaultValue={customer?.phone}
                                        className="w-full px-4 py-2 text-sm bg-gray-50 border border-gray-100 rounded-xl focus:ring-4 focus:ring-brand-primary/10 focus:border-brand-primary focus:bg-white transition-all outline-none font-bold text-gray-900 pr-9"
                                        placeholder="06 12345678"
                                    />
                                    <TelephoneIcon className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-300" />
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="p-6 border-y border-gray-100 bg-gray-50/50 flex items-center gap-3">
                        <div className="p-1.5 bg-brand-primary/10 rounded-lg">
                            <MapPinIcon size={16} className="text-brand-primary" />
                        </div>
                        <h3 className="text-base font-bold text-gray-900">2. Locatie & Adres</h3>
                    </div>

                    <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="md:col-span-2">
                            <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-3 ml-1">Straat en Huisnummer</label>
                            <input
                                type="text"
                                name="address"
                                defaultValue={customer?.address}
                                className="w-full px-4 py-2 text-sm bg-gray-50 border border-gray-100 rounded-xl focus:ring-4 focus:ring-brand-primary/10 focus:border-brand-primary focus:bg-white transition-all outline-none font-bold text-gray-900"
                                placeholder="Hoofdstraat 1"
                            />
                        </div>

                        <div>
                            <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-3 ml-1">Postcode</label>
                            <input
                                type="text"
                                name="zip"
                                defaultValue={customer?.zip}
                                className="w-full px-4 py-2 text-sm bg-gray-50 border border-gray-100 rounded-xl focus:ring-4 focus:ring-brand-primary/10 focus:border-brand-primary focus:bg-white transition-all outline-none font-bold text-gray-900 text-center uppercase"
                                placeholder="1234 AB"
                            />
                        </div>

                        <div>
                            <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-3 ml-1">Woonplaats</label>
                            <input
                                type="text"
                                name="city"
                                defaultValue={customer?.city}
                                className="w-full px-4 py-2 text-sm bg-gray-50 border border-gray-100 rounded-xl focus:ring-4 focus:ring-brand-primary/10 focus:border-brand-primary focus:bg-white transition-all outline-none font-bold text-gray-900"
                                placeholder="Doetinchem"
                            />
                        </div>
                    </div>

                    <div className="p-6 border-y border-gray-100 bg-gray-50/50 flex items-center gap-3">
                        <div className="p-1.5 bg-brand-primary/10 rounded-lg">
                            <MessageCircleIcon size={16} className="text-brand-primary" />
                        </div>
                        <h3 className="text-base font-bold text-gray-900">3. Extra Notities</h3>
                    </div>

                    <div className="p-6 relative">
                        <div>
                            <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-3 ml-1">Bijzonderheden</label>
                            <textarea
                                name="notes"
                                defaultValue={customer?.notes}
                                rows={3}
                                className="w-full px-4 py-2 text-sm bg-gray-50 border border-gray-100 rounded-xl focus:ring-4 focus:ring-brand-primary/10 focus:border-brand-primary focus:bg-white transition-all outline-none font-medium text-gray-700 leading-relaxed resize-none"
                                placeholder="Handige informatie over deze klant, zoals voorkeuren of afspraken..."
                            />
                            <p className="text-[10px] text-gray-400 font-medium mt-4 leading-relaxed">
                                Deze notities zijn alleen zichtbaar in het admin panel en bedoeld voor intern gebruik.
                            </p>
                        </div>
                    </div>

                    <div className="p-6 bg-gray-50 border-t border-gray-100 flex flex-col-reverse sm:flex-row items-center justify-end gap-3">
                        <Link
                            href="/admin/klanten"
                            className="w-full sm:w-auto px-6 py-2.5 text-sm bg-white text-gray-600 font-bold rounded-xl border border-gray-200 hover:bg-gray-50 transition-colors text-center"
                        >
                            Annuleren
                        </Link>
                        <button
                            type="submit"
                            className="w-full sm:w-auto px-8 py-2.5 text-sm bg-brand-primary text-white rounded-xl font-black shadow-lg shadow-brand-primary/20 hover:scale-105 active:scale-95 transition-all flex items-center justify-center gap-2"
                        >
                            <SaveIcon size={20} />
                            Klant Opslaan
                        </button>
                    </div>
                </div>
            </form>
        </div>
    )
}
