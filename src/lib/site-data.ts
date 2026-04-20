import { createClient as createStaticClient } from './supabase/static'
import { cache } from 'react'

/**
 * Site data fetching functions using Supabase.
 * These are intended for use in the public-facing frontend (Server Components).
 * We use a static-safe client here because these functions are often called
 * during static generation (build time / revalidation) where cookies aren't available.
 */

export const getBedrijfsgegevens = cache(async () => {
    const supabase = createStaticClient()
    const { data, error } = await supabase
        .from('settings')
        .select('value')
        .eq('key', 'bedrijfsgegevens')
        .maybeSingle()

    if (error) {
        console.error('Error fetching bedrijfsgegevens:', error)
        return null
    }
    return data?.value ?? null
})

export const getTestimonials = cache(async (limit = 10) => {
    const supabase = createStaticClient()
    const { data, error } = await supabase
        .from('testimonials')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(limit)

    if (error) {
        console.error('Error fetching testimonials:', error)
        return []
    }

    // Map to frontend expected format
    return data.map(doc => ({
        name: doc.location ? `${doc.name}, uit ${doc.location}` : doc.name,
        text: doc.text,
        stars: doc.stars,
    }))
})

export const getProjects = cache(async (limit = 100) => {
    const supabase = createStaticClient()
    const { data, error } = await supabase
        .from('projects')
        .select('*')
        .order('date', { ascending: false })
        .limit(limit)

    if (error) {
        console.error('Error fetching projects:', error)
        return []
    }

    // Map to Project interface from src/types.ts
    return data.map(doc => ({
        id: doc.id,
        title: doc.title,
        description: doc.description,
        imageUrl: doc.image_url,
        images: Array.isArray(doc.images) ? doc.images : [],
        category: doc.category,
        brand: doc.brand || '',
        brandSlug: doc.brand_slug || '',
        date: doc.date ? new Date(doc.date).toLocaleDateString('nl-NL', { day: 'numeric', month: 'short', year: 'numeric' }) : '',
        location: doc.location || 'Brabant',
        areaSize: doc.area_size || 0,
        longDescription: doc.long_description || '',
        techniques: doc.techniques || []
    }))
})

export const getProject = cache(async (id: string) => {
    const supabase = createStaticClient()
    const { data, error } = await supabase
        .from('projects')
        .select('*')
        .eq('id', id)
        .single()

    if (error) {
        console.error('Error fetching project:', error)
        return null
    }

    return {
        id: data.id,
        title: data.title,
        description: data.description,
        imageUrl: data.image_url,
        images: Array.isArray(data.images) ? data.images : [],
        category: data.category,
        date: data.date ? new Date(data.date).toLocaleDateString('nl-NL', { day: 'numeric', month: 'short', year: 'numeric' }) : '',
        location: data.location || 'Brabant',
        areaSize: data.area_size || 0,
        longDescription: data.long_description || '',
        techniques: data.techniques || []
    }
})

export const getChatbotSettings = cache(async () => {
    const supabase = createStaticClient()
    const { data, error } = await supabase
        .from('settings')
        .select('value')
        .eq('key', 'chatbot_settings')
        .single()

    if (error) return null
    return data.value
})

export const getKennisItems = cache(async () => {
    const supabase = createStaticClient()
    const { data, error } = await supabase
        .from('ai_kennisbank')
        .select('*')

    if (error) return []
    return data
})

export const getPromoPopup = cache(async () => {
    const supabase = createStaticClient()
    const { data, error } = await supabase
        .from('settings')
        .select('value')
        .eq('key', 'promo_popup')
        .single()

    if (error) return null
    return data.value as { enabled: boolean; title: string; body: string; display_style?: 'center' | 'bottom-left' | 'bottom-right' } | null
})

export const getAnnouncementBar = cache(async () => {
    const supabase = createStaticClient()
    const { data, error } = await supabase
        .from('settings')
        .select('value')
        .eq('key', 'announcement_bar')
        .maybeSingle()

    if (error) return null
    return data?.value as { enabled: boolean; text: string; bgColor?: string } | null
})

export const getSitePassword = cache(async () => {
    const supabase = createStaticClient()
    const { data, error } = await supabase
        .from('settings')
        .select('value')
        .eq('key', 'site_password')
        .maybeSingle()

    if (error) return null
    return data?.value as { enabled: boolean; password: string; backgroundImage?: string } | null
})

export const getDynamicPolicies = cache(async () => {
    const supabase = createStaticClient()
    const { data, error } = await supabase
        .from('settings')
        .select('value')
        .eq('key', 'dynamic_policies')
        .single()

    if (error || !data?.value) return []
    return data.value as import('@/types').Policy[]
})
