'use client'

import React, { useState, useTransition, useEffect } from 'react'
import { Bot, Megaphone, Plus } from 'lucide-react'
import SaveIcon from '@/components/ui/save-icon'
import HomeIcon from '@/components/ui/home-icon'
import SparklesIcon from '@/components/ui/sparkles-icon'
import MagnifierIcon from '@/components/ui/magnifier-icon'
import GearIcon from '@/components/ui/gear-icon'
import SimpleCheckedIcon from '@/components/ui/simple-checked-icon'
import FilledBellIcon from '@/components/ui/filled-bell-icon'
import TrashIcon from '@/components/ui/trash-icon'
import { Lock } from 'lucide-react'
import { saveBedrijfsgegevens, saveChatbotSettings, savePromoPopup, saveSeoSettings, saveAnnouncementBar, saveSitePassword } from './actions'
import RichTextEditor from '@/components/RichTextEditor'

function getAccessibleTextColor(hex: string): string {
    const clean = hex.replace('#', '')
    if (clean.length !== 6) return '#ffffff'
    const r = parseInt(clean.slice(0, 2), 16) / 255
    const g = parseInt(clean.slice(2, 4), 16) / 255
    const b = parseInt(clean.slice(4, 6), 16) / 255
    const toLinear = (c: number) => c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4
    const L = 0.2126 * toLinear(r) + 0.7152 * toLinear(g) + 0.0722 * toLinear(b)
    return (1.05 / (L + 0.05)) >= ((L + 0.05) / 0.05) ? '#ffffff' : '#000000'
}

type TabId = 'bedrijf' | 'seo' | 'chatbot' | 'popup' | 'announcement' | 'sitepassword'

const tabs: { id: TabId; label: string; icon: React.ComponentType<any> }[] = [
    { id: 'bedrijf', label: 'Bedrijf', icon: HomeIcon },
    { id: 'seo', label: 'SEO', icon: MagnifierIcon },
    { id: 'chatbot', label: 'Chatbot', icon: Bot },
    { id: 'popup', label: 'Popup', icon: Megaphone },
    { id: 'announcement', label: 'Balk', icon: FilledBellIcon },
    { id: 'sitepassword', label: 'Wachtwoord', icon: Lock },
]

const inputClass = "w-full px-3.5 py-2 text-sm bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-brand-primary/20 focus:border-brand-primary focus:bg-white transition-all outline-none font-medium text-gray-900"
const textareaClass = "w-full px-3.5 py-2 text-sm bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-brand-primary/20 focus:border-brand-primary focus:bg-white transition-all outline-none font-medium text-gray-600"
const labelClass = "block text-[11px] font-bold text-gray-400 uppercase tracking-widest mb-1.5"
const btnClass = "bg-brand-primary hover:bg-brand-secondary text-white px-5 py-2 text-sm rounded-lg flex items-center gap-2 font-bold shadow-md shadow-brand-primary/15 transition-all hover:scale-[1.02] active:scale-95"

type Props = {
    bedrijfsgegevens: any
    chatbotSettings: any
    promoPopup: any
    seoSettings: any
    announcementBar: any
    sitePassword: any
}

export default function InstellingenClient({ bedrijfsgegevens, chatbotSettings, promoPopup, seoSettings, announcementBar, sitePassword }: Props) {
    const [activeTab, setActiveTab] = useState<TabId>('bedrijf')
    const [isPending, startTransition] = useTransition()
    const [lastSaved, setLastSaved] = useState<TabId | null>(null)
    const [chatbotEnabled, setChatbotEnabled] = useState<boolean>(chatbotSettings?.enabled ?? false)
    const [popupEnabled, setPopupEnabled] = useState<boolean>(promoPopup?.enabled ?? false)
    const [announcementEnabled, setAnnouncementEnabled] = useState<boolean>(announcementBar?.enabled ?? false)
    const [announcementBgColor, setAnnouncementBgColor] = useState<string>(announcementBar?.bgColor || '#1a6b3a')
    const [announcementError, setAnnouncementError] = useState<string | null>(null)
    const [sitePasswordEnabled, setSitePasswordEnabled] = useState<boolean>(sitePassword?.enabled ?? false)
    const [sitePasswordBg, setSitePasswordBg] = useState<string>(sitePassword?.backgroundImage || '/images/brands/art-of-living/sfeer-woonkamer-chique.webp')

    // Texts: array of { id, html }. Backwards compat: old data had single `text`.
    const initTexts = (): { id: number; html: string }[] => {
        const arr: string[] = announcementBar?.texts?.length
            ? announcementBar.texts
            : announcementBar?.text ? [announcementBar.text] : ['']
        return arr.map((html, i) => ({ id: i + 1, html }))
    }
    const [announcementTexts, setAnnouncementTexts] = useState<{ id: number; html: string }[]>(initTexts)
    const [nextId, setNextId] = useState<number>((announcementBar?.texts?.length ?? 1) + 1)

    // Sync with server-rendered props after revalidatePath re-renders
    useEffect(() => { setChatbotEnabled(chatbotSettings?.enabled ?? false) }, [chatbotSettings?.enabled])
    useEffect(() => { setPopupEnabled(promoPopup?.enabled ?? false) }, [promoPopup?.enabled])
    useEffect(() => { setAnnouncementEnabled(announcementBar?.enabled ?? false) }, [announcementBar?.enabled])

    function stripHtml(html: string) {
        return html.replace(/<[^>]*>/g, '').replace(/&nbsp;/g, ' ').trim()
    }

    function handleAnnouncementSubmit(fd: FormData) {
        const texts = fd.getAll('announcement_texts') as string[]
        const emptyCount = texts.filter(t => !stripHtml(t)).length
        if (emptyCount > 0) {
            setAnnouncementError(
                texts.length === 1
                    ? 'Het tekstveld mag niet leeg zijn.'
                    : `${emptyCount} tekstveld${emptyCount > 1 ? 'en zijn' : ' is'} leeg. Vul ze in of verwijder ze.`
            )
            return
        }
        setAnnouncementError(null)
        handleFormAction(fd, saveAnnouncementBar, 'announcement')
    }

    const handleFormAction = async (formData: FormData, action: (fd: FormData) => Promise<void>, tab: TabId) => {
        startTransition(async () => {
            try {
                await action(formData)
                setLastSaved(tab)
                setTimeout(() => setLastSaved(null), 3000)
            } catch (error) {
                console.error('Failed to save settings:', error)
                alert('Er is een fout opgetreden bij het opslaan.')
            }
        })
    }

    return (
        <div className="space-y-6 pb-20 animate-fade-in">
            {/* Header */}
            <div className="animate-slide-up">
                <h1 className="text-2xl font-bold text-gray-900 tracking-tight flex items-center gap-2">
                    Instellingen
                    <GearIcon size={20} className="text-brand-primary" />
                </h1>
                <p className="text-gray-500 mt-1 text-sm">Beheer de globale configuratie van uw platform.</p>
            </div>

            {/* Card with Tabs */}
            <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden animate-slide-up delay-100">
                {/* Tab Bar */}
                <div className="flex border-b border-gray-100 bg-gray-50/60 overflow-x-auto">
                    {tabs.map((tab) => {
                        const Icon = tab.icon
                        const isActive = activeTab === tab.id
                        return (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id)}
                                className={`flex items-center gap-2 px-5 py-3 text-sm font-semibold whitespace-nowrap transition-all relative ${isActive
                                        ? 'text-brand-primary bg-white border-b-2 border-brand-primary -mb-px'
                                        : 'text-gray-400 hover:text-gray-600 hover:bg-white/50'
                                    }`}
                            >
                                <Icon className="w-4 h-4" />
                                {tab.label}
                            </button>
                        )
                    })}
                </div>

                {/* Tab Content */}
                <div className="p-6">
                    {/* Bedrijfsgegevens */}
                    {activeTab === 'bedrijf' && (
                        <form action={(fd) => handleFormAction(fd, saveBedrijfsgegevens, 'bedrijf')} className="space-y-4 animate-fade-in">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="md:col-span-2">
                                    <label className={labelClass}>Bedrijfsnaam</label>
                                    <input type="text" name="name" defaultValue={bedrijfsgegevens?.name} className={inputClass} placeholder="PVC Vloeren Achterhoek" />
                                </div>
                                <div className="md:col-span-2">
                                    <label className={labelClass}>Adres</label>
                                    <input type="text" name="address" defaultValue={bedrijfsgegevens?.address} className={inputClass} placeholder="Straatnaam 123" />
                                </div>
                                <div>
                                    <label className={labelClass}>Postcode</label>
                                    <input type="text" name="postcode" defaultValue={bedrijfsgegevens?.postcode} className={inputClass} placeholder="1234 AB" />
                                </div>
                                <div>
                                    <label className={labelClass}>Woonplaats</label>
                                    <input type="text" name="city" defaultValue={bedrijfsgegevens?.city} className={inputClass} placeholder="Doetinchem" />
                                </div>
                                <div>
                                    <label className={labelClass}>Telefoon</label>
                                    <input type="text" name="phone" defaultValue={bedrijfsgegevens?.phone} className={inputClass} placeholder="+31 6 12345678" />
                                </div>
                                <div>
                                    <label className={labelClass}>E-mail</label>
                                    <input type="email" name="email" defaultValue={bedrijfsgegevens?.email} className={inputClass} placeholder="info@voorbeeld.nl" />
                                </div>
                                <div>
                                    <label className={labelClass}>KvK Nummer</label>
                                    <input type="text" name="kvk" defaultValue={bedrijfsgegevens?.kvk} className={inputClass} placeholder="12345678" />
                                </div>
                                <div>
                                    <label className={labelClass}>BTW Nummer</label>
                                    <input type="text" name="btw" defaultValue={bedrijfsgegevens?.btw} className={inputClass} placeholder="NL123456789B01" />
                                </div>
                            </div>
                            <div className="flex justify-end pt-3 border-t border-gray-50 items-center gap-4">
                                {lastSaved === activeTab && (
                                    <span className="text-xs font-bold text-brand-primary flex items-center gap-1 animate-fade-in text-nowrap">
                                        <SimpleCheckedIcon size={14} /> Opgeslagen
                                    </span>
                                )}
                                <button type="submit" disabled={isPending} className={`${btnClass} ${isPending ? 'opacity-50 cursor-not-allowed' : ''}`}>
                                    <SaveIcon size={16} /> {isPending ? 'Bezig...' : 'Opslaan'}
                                </button>
                            </div>
                        </form>
                    )}

                    {/* SEO */}
                    {activeTab === 'seo' && (
                        <form action={(fd) => handleFormAction(fd, saveSeoSettings, 'seo')} className="space-y-4 animate-fade-in">
                            <div>
                                <label className={labelClass}>Standaard Meta Titel</label>
                                <input type="text" name="meta_title" defaultValue={seoSettings?.meta_title} className={inputClass} placeholder="PVC Vloeren Achterhoek" />
                            </div>
                            <div>
                                <label className={labelClass}>Meta Omschrijving</label>
                                <textarea name="meta_description" defaultValue={seoSettings?.meta_description} rows={3} className={textareaClass} placeholder="Uw specialist in PVC-vloeren, traprenovatie, vloerbedekking..." />
                            </div>
                            <div>
                                <label className={labelClass}>Zoekwoorden (komma-gescheiden)</label>
                                <input type="text" name="keywords" defaultValue={seoSettings?.keywords} className={inputClass} placeholder="pvc vloeren, traprenovatie, Doetinchem" />
                            </div>
                            <div>
                                <label className={labelClass}>Google Verificatie Code</label>
                                <input type="text" name="google_verification" defaultValue={seoSettings?.google_verification} className={inputClass} placeholder="Voer uw Google Search Console verificatiecode in" />
                            </div>
                            <div className="flex justify-end pt-3 border-t border-gray-50 items-center gap-4">
                                {lastSaved === activeTab && (
                                    <span className="text-xs font-bold text-brand-primary flex items-center gap-1 animate-fade-in text-nowrap">
                                        <SimpleCheckedIcon size={14} /> Opgeslagen
                                    </span>
                                )}
                                <button type="submit" disabled={isPending} className={`${btnClass} ${isPending ? 'opacity-50 cursor-not-allowed' : ''}`}>
                                    <SaveIcon size={16} /> {isPending ? 'Bezig...' : 'Opslaan'}
                                </button>
                            </div>
                        </form>
                    )}

                    {/* Chatbot */}
                    {activeTab === 'chatbot' && (
                        <form action={(fd) => handleFormAction(fd, saveChatbotSettings, 'chatbot')} className="space-y-4 animate-fade-in">
                            <label className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg border border-gray-100 cursor-pointer select-none">
                                <div className="relative inline-flex items-center shrink-0">
                                    <input
                                        type="checkbox"
                                        name="enabled"
                                        checked={chatbotEnabled}
                                        onChange={e => setChatbotEnabled(e.target.checked)}
                                        className="sr-only peer"
                                    />
                                    <div className="w-10 h-[22px] bg-gray-200 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-[18px] after:w-[18px] after:transition-all peer-checked:bg-brand-primary shadow-inner transition-colors" />
                                </div>
                                <span className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                                    Chatbot Inschakelen
                                    <SparklesIcon size={14} className="text-amber-400" />
                                </span>
                            </label>
                            <div>
                                <label className={labelClass}>Welkomstbericht</label>
                                <input type="text" name="welcome_message" defaultValue={chatbotSettings?.welcome_message} className={inputClass} />
                            </div>
                            <div>
                                <label className={labelClass}>Systeem Prompt</label>
                                <textarea name="system_prompt" defaultValue={chatbotSettings?.system_prompt} rows={5} className={textareaClass + " font-mono text-xs"} />
                            </div>
                            <div className="flex justify-end pt-3 border-t border-gray-50 items-center gap-4">
                                {lastSaved === activeTab && (
                                    <span className="text-xs font-bold text-brand-primary flex items-center gap-1 animate-fade-in text-nowrap">
                                        <SimpleCheckedIcon size={14} /> Opgeslagen
                                    </span>
                                )}
                                <button type="submit" disabled={isPending} className={`${btnClass} ${isPending ? 'opacity-50 cursor-not-allowed' : ''}`}>
                                    <SaveIcon size={16} /> {isPending ? 'Bezig...' : 'Opslaan'}
                                </button>
                            </div>
                        </form>
                    )}

                    {/* Promo Popup */}
                    {activeTab === 'popup' && (
                        <form action={(fd) => handleFormAction(fd, savePromoPopup, 'popup')} className="space-y-4 animate-fade-in">
                            <label className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg border border-gray-100 cursor-pointer select-none">
                                <div className="relative inline-flex items-center shrink-0">
                                    <input
                                        type="checkbox"
                                        name="popup_enabled"
                                        checked={popupEnabled}
                                        onChange={e => setPopupEnabled(e.target.checked)}
                                        className="sr-only peer"
                                    />
                                    <div className="w-10 h-[22px] bg-gray-200 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-[18px] after:w-[18px] after:transition-all peer-checked:bg-brand-primary shadow-inner transition-colors" />
                                </div>
                                <span className="text-sm font-semibold text-gray-700">Popup Weergeven op Website</span>
                            </label>
                            <div>
                                <label className={labelClass}>Popup Titel</label>
                                <input type="text" name="popup_title" defaultValue={promoPopup?.title} className={inputClass} placeholder="Bijv. 10% korting op traprenovatie" />
                            </div>
                            <div>
                                <label className={labelClass}>Popup Tekst</label>
                                <textarea name="popup_body" defaultValue={promoPopup?.body} rows={5} className={textareaClass} placeholder="Typ hier de volledige tekst van de popup..." />
                            </div>
                            <div>
                                <label className={labelClass}>Display Stijl</label>
                                <select 
                                    name="display_style" 
                                    defaultValue={promoPopup?.display_style || 'center'} 
                                    className={inputClass}
                                >
                                    <option value="center">Centraal (Groot)</option>
                                    <option value="bottom-left">Linksonder (Subtiel)</option>
                                    <option value="bottom-right">Rechtsonder (Subtiel)</option>
                                </select>
                            </div>
                            <div className="flex justify-end pt-3 border-t border-gray-50 items-center gap-4">
                                {lastSaved === activeTab && (
                                    <span className="text-xs font-bold text-brand-primary flex items-center gap-1 animate-fade-in text-nowrap">
                                        <SimpleCheckedIcon size={14} /> Opgeslagen
                                    </span>
                                )}
                                <button type="submit" disabled={isPending} className={`${btnClass} ${isPending ? 'opacity-50 cursor-not-allowed' : ''}`}>
                                    <SaveIcon size={16} /> {isPending ? 'Bezig...' : 'Opslaan'}
                                </button>
                            </div>
                        </form>
                    )}
                    {/* Announcement Bar */}
                    {activeTab === 'announcement' && (
                        <form action={handleAnnouncementSubmit} className="space-y-4 animate-fade-in">
                            <label className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg border border-gray-100 cursor-pointer select-none">
                                <div className="relative inline-flex items-center shrink-0">
                                    <input
                                        type="checkbox"
                                        name="announcement_enabled"
                                        checked={announcementEnabled}
                                        onChange={e => setAnnouncementEnabled(e.target.checked)}
                                        className="sr-only peer"
                                    />
                                    <div className="w-10 h-[22px] bg-gray-200 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-[18px] after:w-[18px] after:transition-all peer-checked:bg-brand-primary shadow-inner transition-colors" />
                                </div>
                                <span className="text-sm font-semibold text-gray-700">Aankondigingsbalk Weergeven</span>
                            </label>

                            {/* Multiple texts */}
                            <div className="space-y-3">
                                <label className={labelClass}>Teksten {announcementTexts.length > 1 && <span className="normal-case font-normal text-gray-400">— wisselen elke 5 seconden</span>}</label>
                                {announcementTexts.map((item, idx) => (
                                    <div key={item.id} className="flex gap-2 items-start">
                                        {announcementTexts.length > 1 && (
                                            <span className="mt-2.5 text-[11px] font-bold text-gray-300 w-4 shrink-0 text-center">{idx + 1}</span>
                                        )}
                                        <div className="flex-1">
                                            <RichTextEditor
                                                name="announcement_texts"
                                                defaultValue={item.html}
                                                placeholder="Bijv. Nieuwe collectie binnen! Bekijk nu →"
                                                inputClassName={inputClass}
                                            />
                                        </div>
                                        {announcementTexts.length > 1 && (
                                            <button
                                                type="button"
                                                onClick={() => setAnnouncementTexts(ts => ts.filter(t => t.id !== item.id))}
                                                className="mt-2 p-1.5 rounded-lg text-gray-300 hover:text-red-400 hover:bg-red-50 transition-colors shrink-0"
                                                title="Verwijderen"
                                            >
                                                <TrashIcon size={16} />
                                            </button>
                                        )}
                                    </div>
                                ))}
                                <button
                                    type="button"
                                    onClick={() => { setAnnouncementTexts(ts => [...ts, { id: nextId, html: '' }]); setNextId(n => n + 1) }}
                                    className="flex items-center gap-1.5 text-xs font-bold text-brand-primary hover:text-brand-secondary transition-colors py-1"
                                >
                                    <Plus className="w-3.5 h-3.5" /> Tekst toevoegen
                                </button>
                            </div>

                            <div>
                                <label className={labelClass}>Achtergrondkleur</label>
                                <div className="flex items-center gap-3">
                                    <input
                                        type="color"
                                        name="announcement_bg_color"
                                        value={announcementBgColor}
                                        onChange={e => setAnnouncementBgColor(e.target.value)}
                                        className="h-10 w-16 rounded-lg border border-gray-200 cursor-pointer bg-gray-50 p-1"
                                    />
                                    <div
                                        className="flex-1 rounded-lg px-3 py-1.5 text-xs font-semibold text-center transition-colors"
                                        style={{ backgroundColor: announcementBgColor, color: getAccessibleTextColor(announcementBgColor) }}
                                    >
                                        Voorbeeld tekstkleur
                                    </div>
                                </div>
                            </div>

                            {announcementError && (
                                <p className="text-xs font-semibold text-red-500 bg-red-50 border border-red-100 rounded-lg px-3 py-2 animate-fade-in">
                                    {announcementError}
                                </p>
                            )}

                            <div className="flex justify-end pt-3 border-t border-gray-50 items-center gap-4">
                                {lastSaved === activeTab && (
                                    <span className="text-xs font-bold text-brand-primary flex items-center gap-1 animate-fade-in text-nowrap">
                                        <SimpleCheckedIcon size={14} /> Opgeslagen
                                    </span>
                                )}
                                <button type="submit" disabled={isPending} className={`${btnClass} ${isPending ? 'opacity-50 cursor-not-allowed' : ''}`}>
                                    <SaveIcon size={16} /> {isPending ? 'Bezig...' : 'Opslaan'}
                                </button>
                            </div>
                        </form>
                    )}
                    {/* Site Password */}
                    {activeTab === 'sitepassword' && (
                        <form action={(formData) => {
                            startTransition(async () => {
                                await saveSitePassword(formData)
                                setLastSaved('sitepassword')
                                setTimeout(() => setLastSaved(null), 2000)
                            })
                        }} className="space-y-4 animate-fade-in">
                            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl border border-gray-100">
                                <div>
                                    <p className="text-sm font-bold text-gray-900">Wachtwoordbeveiliging</p>
                                    <p className="text-xs text-gray-400 mt-0.5">Bezoekers moeten een wachtwoord invoeren om de site te bekijken</p>
                                </div>
                                <label className="relative inline-flex items-center cursor-pointer">
                                    <input type="checkbox" name="enabled" checked={sitePasswordEnabled} onChange={e => setSitePasswordEnabled(e.target.checked)} className="sr-only peer" />
                                    <div className="w-11 h-6 bg-gray-200 rounded-full peer peer-checked:bg-brand-primary transition-colors peer-focus:ring-2 peer-focus:ring-brand-primary/20 after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:after:translate-x-full" />
                                </label>
                            </div>

                            {sitePasswordEnabled && (
                                <div className="space-y-4 p-4 bg-amber-50/50 border border-amber-100 rounded-xl">
                                    <div className="flex items-start gap-2 text-amber-700 text-xs font-bold">
                                        <Lock className="w-4 h-4 mt-0.5 shrink-0" />
                                        Let op: wanneer ingeschakeld, is de hele website alleen toegankelijk met dit wachtwoord. De admin-pagina blijft altijd bereikbaar.
                                    </div>
                                </div>
                            )}

                            <div>
                                <label className={labelClass}>Wachtwoord</label>
                                <input type="text" name="password" defaultValue={sitePassword?.password || ''} placeholder="Kies een wachtwoord" className={inputClass} />
                            </div>

                            <div>
                                <label className={labelClass}>Achtergrondafbeelding URL</label>
                                <input type="text" name="backgroundImage" value={sitePasswordBg} onChange={e => setSitePasswordBg(e.target.value)} placeholder="/images/brands/..." className={inputClass} />
                            </div>

                            {sitePasswordBg && (
                                <div className="rounded-xl overflow-hidden h-40 border border-gray-100">
                                    <img src={sitePasswordBg} alt="Preview" className="w-full h-full object-cover" />
                                </div>
                            )}

                            <div className="flex items-center gap-3 pt-2">
                                {lastSaved === 'sitepassword' && (
                                    <span className="text-xs font-bold text-brand-primary flex items-center gap-1">
                                        <SimpleCheckedIcon size={14} /> Opgeslagen
                                    </span>
                                )}
                                <button type="submit" disabled={isPending} className={`${btnClass} ${isPending ? 'opacity-50 cursor-not-allowed' : ''}`}>
                                    <SaveIcon size={16} /> {isPending ? 'Bezig...' : 'Opslaan'}
                                </button>
                            </div>
                        </form>
                    )}
                </div>
            </div>
        </div>
    )
}
