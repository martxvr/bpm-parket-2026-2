'use server'

import { requireAuth } from '@/lib/supabase/require-auth'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'

export async function saveReview(formData: FormData) {
    const { supabase } = await requireAuth()

    const id = formData.get('id') as string
    const name = formData.get('name') as string
    const location = formData.get('location') as string
    const text = formData.get('text') as string
    const stars = Number(formData.get('stars'))

    const reviewData = {
        name,
        location,
        text,
        stars,
    }

    if (id) {
        const { error } = await supabase
            .from('testimonials')
            .update(reviewData)
            .eq('id', id)

        if (error) throw error
    } else {
        const { error } = await supabase
            .from('testimonials')
            .insert([reviewData])

        if (error) throw error
    }

    revalidatePath('/admin/reviews')
    revalidatePath('/')
    redirect('/admin/reviews')
}

export async function deleteReview(id: string) {
    const { supabase } = await requireAuth()
    const { error } = await supabase
        .from('testimonials')
        .delete()
        .eq('id', id)

    if (error) throw error

    revalidatePath('/admin/reviews')
    revalidatePath('/')
}
