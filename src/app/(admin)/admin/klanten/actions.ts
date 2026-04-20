'use server'

import { requireAuth } from '@/lib/supabase/require-auth'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'

export async function saveCustomer(formData: FormData) {
    const { supabase } = await requireAuth()

    const id = formData.get('id') as string
    const name = formData.get('name') as string
    const email = formData.get('email') as string
    const phone = formData.get('phone') as string
    const address = formData.get('address') as string
    const city = formData.get('city') as string
    const zip = formData.get('zip') as string
    const company_name = formData.get('company_name') as string
    const notes = formData.get('notes') as string

    const customerData = {
        name,
        email: email || null,
        phone,
        address,
        city,
        zip,
        company_name,
        notes,
    }

    if (id) {
        const { error } = await supabase
            .from('customers')
            .update(customerData)
            .eq('id', id)

        if (error) throw error
    } else {
        const { error } = await supabase
            .from('customers')
            .insert([customerData])

        if (error) throw error
    }

    revalidatePath('/admin/klanten')
    redirect('/admin/klanten')
}

export async function deleteCustomer(id: string) {
    const { supabase } = await requireAuth()
    const { error } = await supabase
        .from('customers')
        .delete()
        .eq('id', id)

    if (error) throw error

    revalidatePath('/admin/klanten')
}
