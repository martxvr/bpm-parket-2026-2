'use server'

import { requireAuth } from '@/lib/supabase/require-auth'
import { revalidatePath } from 'next/cache'

export async function saveSettings(key: string, value: any) {
    const { supabase } = await requireAuth()

    const { error } = await supabase
        .from('settings')
        .upsert({ key, value }, { onConflict: 'key' })

    if (error) throw error

    revalidatePath('/admin/instellingen')
    revalidatePath('/') // Revalidate home for globals
}

export async function saveBedrijfsgegevens(formData: FormData) {
    const data = {
        name: formData.get('name'),
        address: formData.get('address'),
        postcode: formData.get('postcode'),
        city: formData.get('city'),
        phone: formData.get('phone'),
        email: formData.get('email'),
        kvk: formData.get('kvk'),
        btw: formData.get('btw'),
        iban: formData.get('iban'),
    }
    await saveSettings('bedrijfsgegevens', data)
}

export async function saveChatbotSettings(formData: FormData) {
    const data = {
        welcome_message: formData.get('welcome_message'),
        system_prompt: formData.get('system_prompt'),
        enabled: formData.get('enabled') === 'on',
    }
    await saveSettings('chatbot_settings', data)
}

export async function savePromoPopup(formData: FormData) {
    const data = {
        enabled: formData.get('popup_enabled') === 'on',
        title: formData.get('popup_title'),
        body: formData.get('popup_body'),
        display_style: formData.get('display_style'),
    }
    await saveSettings('promo_popup', data)
}

export async function saveAnnouncementBar(formData: FormData) {
    const data = {
        enabled: formData.get('announcement_enabled') === 'on',
        texts: formData.getAll('announcement_texts').filter(Boolean),
        bgColor: formData.get('announcement_bg_color'),
    }
    await saveSettings('announcement_bar', data)
}

export async function saveSeoSettings(formData: FormData) {
    const data = {
        meta_title: formData.get('meta_title'),
        meta_description: formData.get('meta_description'),
        keywords: formData.get('keywords'),
        google_verification: formData.get('google_verification'),
    }
    await saveSettings('seo_settings', data)
}

export async function saveSitePassword(formData: FormData) {
    const data = {
        enabled: formData.get('enabled') === 'on',
        password: formData.get('password'),
        backgroundImage: formData.get('backgroundImage'),
    }
    await saveSettings('site_password', data)
}
