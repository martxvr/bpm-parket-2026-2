'use server'

import { requireAuth } from '@/lib/supabase/require-auth'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'

export async function saveOfferte(formData: FormData) {
    const { supabase } = await requireAuth()

    const id = formData.get('id') as string
    const customer_name = formData.get('customer_name') as string
    const email = formData.get('email') as string
    const phone = formData.get('phone') as string
    const service = formData.get('service') as string
    const message = formData.get('message') as string
    const status = formData.get('status') as string

    const offerteData = {
        customer_name,
        email,
        phone,
        service,
        message,
        status,
    }

    if (id) {
        const { error } = await supabase
            .from('offertes')
            .update(offerteData)
            .eq('id', id)

        if (error) throw error
    } else {
        const { error } = await supabase
            .from('offertes')
            .insert([offerteData])

        if (error) throw error
    }

    revalidatePath('/admin/aanvragen')
    redirect('/admin/aanvragen')
}

export async function deleteOfferte(id: string) {
    const { supabase } = await requireAuth()
    const { error } = await supabase
        .from('offertes')
        .delete()
        .eq('id', id)

    if (error) throw error

    revalidatePath('/admin/aanvragen')
}

export async function updateOfferteStatus(id: string, status: string) {
    const { supabase } = await requireAuth()

    const { error } = await supabase
        .from('offertes')
        .update({ status })
        .eq('id', id)

    if (error) {
        console.error('Error updating offerte status:', error)
        throw new Error('Failed to update status')
    }

    revalidatePath('/admin/aanvragen')
}
