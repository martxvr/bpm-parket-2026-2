'use server'

import { requireAuth } from '@/lib/supabase/require-auth'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { categories } from '@/data/brands'

export async function saveProject(formData: FormData) {
    const { supabase } = await requireAuth()

    const id = formData.get('id') as string
    const title = formData.get('title') as string
    const description = formData.get('description') as string
    const category = formData.get('category') as string
    const location = formData.get('location') as string
    const area_size = formData.get('area_size') ? Number(formData.get('area_size')) : null
    const date = formData.get('date') as string
    // Parse images array from hidden input (new multi-image flow)
    const imagesRaw = formData.get('images') as string | null
    let images: string[] = []
    if (imagesRaw) {
        try { images = JSON.parse(imagesRaw) } catch { images = [] }
    }

    // Fallback: legacy single-file upload (image_file + image_url)
    let image_url = formData.get('image_url') as string
    const image_file = formData.get('image_file') as File | null
    if (image_file && image_file.size > 0) {
        const fileExt = image_file.name.split('.').pop()
        const fileName = `${Math.random().toString(36).substring(2)}.${fileExt}`
        const { error: storageError } = await supabase.storage.from('media').upload(fileName, image_file)
        if (storageError) throw storageError
        const { data: { publicUrl } } = supabase.storage.from('media').getPublicUrl(fileName)
        image_url = publicUrl
        await supabase.from('media').insert([{ filename: image_file.name, url: publicUrl, mime_type: image_file.type, size: image_file.size }])
        // Also add to images array if it's a new upload and not already there
        if (!images.includes(publicUrl)) images.push(publicUrl)
    }

    // Primary image = first of images array, fallback to image_url
    const primaryImage = images[0] || image_url || null

    const techniques_raw = formData.get('techniques') as string
    const techniques = techniques_raw ? techniques_raw.split(',').map(t => t.trim()).filter(Boolean) : []

    const brand_slug = (formData.get('brand_slug') as string) || null
    const allBrands = categories.flatMap(c => c.brands.map(b => ({ name: b.name, slug: b.slug })))
    const brand = brand_slug ? (allBrands.find(b => b.slug === brand_slug)?.name || null) : null

    const projectData = {
        title,
        description,
        category,
        location,
        area_size,
        date: date || null,
        image_url: primaryImage,
        images,
        techniques,
        brand,
        brand_slug,
    }

    if (id) {
        const { error } = await supabase
            .from('projects')
            .update(projectData)
            .eq('id', id)

        if (error) throw error
    } else {
        const { error } = await supabase
            .from('projects')
            .insert([projectData])

        if (error) throw error
    }

    revalidatePath('/admin/projecten')
    revalidatePath('/projecten')
    redirect('/admin/projecten')
}

export async function deleteProject(id: string) {
    const { supabase } = await requireAuth()
    const { error } = await supabase
        .from('projects')
        .delete()
        .eq('id', id)

    if (error) throw error

    revalidatePath('/admin/projecten')
    revalidatePath('/projecten')
}
