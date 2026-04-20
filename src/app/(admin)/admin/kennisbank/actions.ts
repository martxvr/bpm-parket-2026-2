'use server'

import { requireAuth } from '@/lib/supabase/require-auth'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'

export async function saveAIKennisitem(formData: FormData) {
    const { supabase } = await requireAuth()

    const id = formData.get('id') as string
    const title = formData.get('title') as string
    const category = formData.get('category') as string
    const content = formData.get('content') as string
    const icon = formData.get('icon') as string

    const itemData = {
        title,
        category,
        content,
        icon,
    }

    if (id) {
        const { error } = await supabase
            .from('ai_kennisbank')
            .update(itemData)
            .eq('id', id)

        if (error) throw error
    } else {
        const { error } = await supabase
            .from('ai_kennisbank')
            .insert([itemData])

        if (error) throw error
    }

    revalidatePath('/admin/kennisbank')
    redirect('/admin/kennisbank')
}

export async function deleteAIKennisitem(id: string) {
    const { supabase } = await requireAuth()
    const { error } = await supabase
        .from('ai_kennisbank')
        .delete()
        .eq('id', id)

    if (error) throw error

    revalidatePath('/admin/kennisbank')
}
