'use server'

import { requireAuth } from '@/lib/supabase/require-auth'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'

export async function saveActievloer(formData: FormData) {
    const { supabase } = await requireAuth()

    const id = formData.get('id') as string
    const name = formData.get('name') as string
    const brand = formData.get('brand') as string
    const collection = formData.get('collection') as string
    const discount_percentage = Number(formData.get('discount_percentage') || 0)
    const description = formData.get('description') as string
    const sort_order = Number(formData.get('sort_order') || 0)
    const active = formData.get('active') === 'on'
    let image_url = formData.get('image_url') as string
    const image_file = formData.get('image_file') as File

    // Handle image upload
    if (image_file && image_file.size > 0) {
        const fileExt = image_file.name.split('.').pop()
        const fileName = `actievloeren/${Math.random().toString(36).substring(2)}.${fileExt}`

        const { error: storageError } = await supabase.storage
            .from('media')
            .upload(fileName, image_file)

        if (storageError) throw storageError

        const { data: { publicUrl } } = supabase.storage
            .from('media')
            .getPublicUrl(fileName)

        image_url = publicUrl
    }

    // Parse specs from repeatable key-value rows
    const specKeys = formData.getAll('spec_key') as string[]
    const specValues = formData.getAll('spec_value') as string[]
    const specs: Record<string, string> = {}
    for (let i = 0; i < specKeys.length; i++) {
        const key = specKeys[i]?.trim()
        const value = specValues[i]?.trim()
        if (key && value) {
            specs[key] = value
        }
    }

    const actievloerData = {
        name,
        brand,
        collection: collection || null,
        image_url,
        discount_percentage,
        description: description || null,
        specs: Object.keys(specs).length > 0 ? specs : null,
        sort_order,
        active,
    }

    if (id) {
        const { error } = await supabase
            .from('actievloeren')
            .update(actievloerData)
            .eq('id', id)
        if (error) throw error
    } else {
        const { error } = await supabase
            .from('actievloeren')
            .insert([actievloerData])
        if (error) throw error
    }

    revalidatePath('/admin/actievloeren')
    revalidatePath('/actievloeren')
    redirect('/admin/actievloeren')
}

export async function deleteActievloer(id: string) {
    const { supabase } = await requireAuth()
    const { error } = await supabase
        .from('actievloeren')
        .delete()
        .eq('id', id)

    if (error) throw error

    revalidatePath('/admin/actievloeren')
    revalidatePath('/actievloeren')
}

export async function toggleActievloer(id: string, active: boolean) {
    const { supabase } = await requireAuth()
    const { error } = await supabase
        .from('actievloeren')
        .update({ active })
        .eq('id', id)

    if (error) throw error

    revalidatePath('/admin/actievloeren')
    revalidatePath('/actievloeren')
}
