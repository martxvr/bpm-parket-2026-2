'use server'

import { requireAuth } from '@/lib/supabase/require-auth'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'

export async function saveAppointment(formData: FormData) {
    const { supabase } = await requireAuth()

    const id = formData.get('id') as string
    const customer_id = formData.get('customer_id') as string
    const date = formData.get('date') as string
    const service = formData.get('service') as string
    const status = formData.get('status') as string
    const notes = formData.get('notes') as string
    const source = formData.get('source') || 'handmatig'

    const appointmentData = {
        customer_id: customer_id || null,
        date,
        service,
        status,
        notes,
        source,
    }

    if (id) {
        const { error } = await supabase
            .from('appointments')
            .update(appointmentData)
            .eq('id', id)

        if (error) throw error
    } else {
        const { error } = await supabase
            .from('appointments')
            .insert([appointmentData])

        if (error) throw error
    }

    revalidatePath('/admin/afspraken')
    redirect('/admin/afspraken')
}

export async function deleteAppointment(id: string) {
    const { supabase } = await requireAuth()
    const { error } = await supabase
        .from('appointments')
        .delete()
        .eq('id', id)

    if (error) throw error

    revalidatePath('/admin/afspraken')
}
