import React from 'react'
import Link from 'next/link'
import ArrowBackIcon from '@/components/ui/arrow-back-icon'
import SaveIcon from '@/components/ui/save-icon'
import UserIcon from '@/components/ui/user-icon'
import MailFilledIcon from '@/components/ui/mail-filled-icon'
import TelephoneIcon from '@/components/ui/telephone-icon'
import FileDescriptionIcon from '@/components/ui/file-description-icon'
import RightChevron from '@/components/ui/right-chevron'
import SparklesIcon from '@/components/ui/sparkles-icon'
import TriangleAlertIcon from '@/components/ui/triangle-alert-icon'
import ClockIcon from '@/components/ui/clock-icon'
import CheckedIcon from '@/components/ui/checked-icon'
import DownChevron from '@/components/ui/down-chevron'
import { saveOfferte } from '../actions'
import { getOfferte } from '@/lib/admin-data'

export default async function AanvraagEditorPage(props: {
    params: Promise<{ id: string }>
}) {
    const params = await props.params;
    const isNew = !params?.id || params.id === 'new'
    const offerte = isNew ? null : await getOfferte(params.id)

    return (
        <div className="max-w-5xl mx-auto space-y-12 pb-24 animate-fade-in">
            {/* Header Section */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                <div className="flex items-center gap-6 animate-slide-up">
                    <Link
                        href="/admin/aanvragen"
                        className="w-10 h-10 bg-white border border-gray-100 rounded-xl flex items-center justify-center text-gray-400 hover:text-brand-primary hover:border-brand-primary/20 hover:shadow-xl hover:shadow-gray-200/50 transition-all group"
                    >
                        <ArrowBackIcon size={24} className="group-hover:-translate-x-1 transition-transform" />
                    </Link>
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900 tracking-tight flex items-center gap-3">
                            {isNew ? 'Nieuwe Aanvraag' : 'Aanvraag Details'}
                            <FileDescriptionIcon size={16} className="text-brand-primary" />
                        </h1>
                        <p className="text-gray-500 mt-2 text-sm font-medium">Beheer en reageer op inkomende offerte aanvragen.</p>
                    </div>
                </div>
            </div>

            <form action={saveOfferte} className="space-y-10">
                {offerte && <input type="hidden" name="id" value={offerte.id} />}

                <div className="max-w-4xl mx-auto bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden animate-slide-up">
                    <div className="p-6 border-b border-gray-100 bg-gray-50/50 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                        <div className="flex items-center gap-3">
                            <div className="p-1.5 bg-brand-primary/10 rounded-lg">
                                <FileDescriptionIcon size={16} className="text-brand-primary" />
                            </div>
                            <h3 className="text-base font-bold text-gray-900">1. Aanvraag Gegevens</h3>
                        </div>
                    </div>

                    <div className="p-6 space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-3 ml-1">Klantnaam</label>
                                <div className="relative">
                                    <input
                                        type="text"
                                        name="customer_name"
                                        defaultValue={offerte?.customer_name}
                                        required
                                        className="w-full px-4 py-2 text-sm bg-gray-50 border border-gray-100 rounded-xl focus:ring-4 focus:ring-brand-primary/10 focus:border-brand-primary focus:bg-white transition-all outline-none font-bold text-gray-900 pr-9"
                                        placeholder="Naam van de klant"
                                    />
                                    <UserIcon className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-300" />
                                </div>
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-3 ml-1">Gewenste Service</label>
                                <div className="relative">
                                    <select
                                        name="service"
                                        defaultValue={offerte?.service || 'pvc-vloeren'}
                                        required
                                        className="w-full appearance-none px-4 py-2 text-sm bg-gray-50 border border-gray-100 rounded-xl focus:ring-4 focus:ring-brand-primary/10 focus:border-brand-primary focus:bg-white transition-all outline-none font-bold text-gray-900"
                                    >
                                        <option value="pvc-vloeren">PVC-vloeren</option>
                                        <option value="traprenovatie">Traprenovatie</option>
                                        <option value="vloerbedekking">Vloerbedekking</option>
                                        <option value="raamdecoratie">Raamdecoratie</option>
                                        <option value="gordijnen">Gordijnen</option>
                                        <option value="andere">Andere</option>
                                    </select>
                                    <DownChevron className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-300 pointer-events-none" />
                                </div>
                            </div>
                        </div>

                        <div>
                            <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-3 ml-1">Bericht / Toelichting van de klant</label>
                            <textarea
                                name="message"
                                defaultValue={offerte?.message}
                                rows={4}
                                className="w-full px-4 py-2 text-sm bg-gray-50 border border-gray-100 rounded-xl focus:ring-4 focus:ring-brand-primary/10 focus:border-brand-primary focus:bg-white transition-all outline-none font-medium text-gray-700 leading-relaxed italic"
                                placeholder="Geen toelichting opgegeven..."
                            />
                        </div>
                    </div>

                    <div className="p-6 border-y border-gray-100 bg-gray-50/50 flex items-center gap-3">
                        <div className="p-1.5 bg-brand-primary/10 rounded-lg">
                            <MailFilledIcon size={16} className="text-brand-primary" />
                        </div>
                        <h3 className="text-base font-bold text-gray-900">2. Contact & Communicatie</h3>
                    </div>

                    <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-3 ml-1">E-mailadres</label>
                            <div className="relative">
                                <input
                                    type="email"
                                    name="email"
                                    defaultValue={offerte?.email}
                                    required
                                    className="w-full px-4 py-2 text-sm bg-gray-50 border border-gray-100 rounded-xl focus:ring-4 focus:ring-brand-primary/10 focus:border-brand-primary focus:bg-white transition-all outline-none font-bold text-gray-900 pr-9"
                                    placeholder="klant@voorbeeld.nl"
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
                                    defaultValue={offerte?.phone}
                                    className="w-full px-4 py-2 text-sm bg-gray-50 border border-gray-100 rounded-xl focus:ring-4 focus:ring-brand-primary/10 focus:border-brand-primary focus:bg-white transition-all outline-none font-bold text-gray-900 pr-9"
                                    placeholder="+31 6 ..."
                                />
                                <TelephoneIcon className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-300" />
                            </div>
                        </div>
                    </div>

                    <div className="p-6 border-y border-gray-100 bg-gray-50/50 flex items-center gap-3">
                        <div className="p-1.5 bg-brand-primary/10 rounded-lg">
                            <ClockIcon size={16} className="text-brand-primary" />
                        </div>
                        <h3 className="text-base font-bold text-gray-900">3. Status Beheer</h3>
                    </div>

                    <div className="p-6 space-y-6">
                        <div>
                            <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-3 ml-1">Huidige Fase</label>
                            <div className="relative">
                                <select
                                    name="status"
                                    defaultValue={offerte?.status || 'nieuw'}
                                    required
                                    className="w-full appearance-none px-4 py-2 text-sm bg-gray-50 border border-gray-100 rounded-xl focus:ring-4 focus:ring-brand-primary/10 focus:border-brand-primary focus:bg-white transition-all outline-none font-bold text-gray-900 ring-2 ring-brand-primary/5"
                                >
                                    <option value="nieuw">Nieuw</option>
                                    <option value="behandeling">In Behandeling</option>
                                    <option value="verzonden">Offerte Verzonden</option>
                                    <option value="gesloten">Gesloten</option>
                                </select>
                                <DownChevron className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-300 pointer-events-none" />
                            </div>
                        </div>

                        {!isNew && (
                            <div className="p-5 bg-gray-50 rounded-xl space-y-3 border border-gray-100">
                                <div className="flex items-center justify-between text-[10px] font-black uppercase tracking-widest text-gray-400">
                                    <span>Ontvangen</span>
                                    <span className="text-gray-900">{new Date(offerte.created_at).toLocaleDateString('nl-NL')}</span>
                                </div>
                                <div className="flex items-center justify-between text-[10px] font-black uppercase tracking-widest text-gray-400">
                                    <span>Bewerkt</span>
                                    <span className="text-gray-900">{new Date(offerte.updated_at).toLocaleDateString('nl-NL')}</span>
                                </div>
                            </div>
                        )}

                        <div className="p-4 bg-amber-50 rounded-xl border border-amber-100 flex items-start gap-4">
                            <TriangleAlertIcon size={20} className="text-amber-500 shrink-0" />
                            <p className="text-sm font-medium text-amber-700 leading-relaxed">
                                <span className="font-bold block mb-1">Tip:</span>
                                Neem binnen 24 uur contact op voor een hogere kans op conversie!
                            </p>
                        </div>
                    </div>

                    <div className="p-6 bg-gray-50 border-t border-gray-100 flex flex-col-reverse sm:flex-row items-center justify-end gap-3">
                        <Link
                            href="/admin/aanvragen"
                            className="w-full sm:w-auto px-6 py-2.5 text-sm bg-white text-gray-600 font-bold rounded-xl border border-gray-200 hover:bg-gray-50 transition-colors text-center"
                        >
                            Annuleren
                        </Link>
                        <button
                            type="submit"
                            className="w-full sm:w-auto px-8 py-2.5 text-sm bg-brand-primary text-white rounded-xl font-black shadow-lg shadow-brand-primary/20 hover:scale-105 active:scale-95 transition-all flex items-center justify-center gap-2"
                        >
                            <SaveIcon size={20} />
                            Wijzigingen Opslaan
                        </button>
                    </div>
                </div>
            </form>
        </div>
    )
}

