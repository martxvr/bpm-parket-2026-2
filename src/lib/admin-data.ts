import { createClient } from './supabase/server'

export async function getProjects() {
    const supabase = await createClient()
    const { data, error } = await supabase
        .from('projects')
        .select('*')
        .order('created_at', { ascending: false })

    if (error) throw error
    return data
}

export async function getProject(id: string) {
    const supabase = await createClient()
    const { data, error } = await supabase
        .from('projects')
        .select('*')
        .eq('id', id)
        .single()

    if (error) throw error
    return data
}

export async function getTestimonials() {
    const supabase = await createClient()
    const { data, error } = await supabase
        .from('testimonials')
        .select('*')
        .order('created_at', { ascending: false })

    if (error) throw error
    return data
}

export async function getTestimonial(id: string) {
    const supabase = await createClient()
    const { data, error } = await supabase
        .from('testimonials')
        .select('*')
        .eq('id', id)
        .single()

    if (error) throw error
    return data
}

export async function getCustomers() {
    const supabase = await createClient()
    const { data, error } = await supabase
        .from('customers')
        .select('*')
        .order('created_at', { ascending: false })

    if (error) throw error
    return data
}

export async function getCustomer(id: string) {
    const supabase = await createClient()
    const { data, error } = await supabase
        .from('customers')
        .select('*')
        .eq('id', id)
        .single()

    if (error) throw error
    return data
}

export async function getAppointments() {
    const supabase = await createClient()
    const { data, error } = await supabase
        .from('appointments')
        .select('*, customers(name)')
        .order('date', { ascending: false })

    if (error) throw error
    return data
}

export async function getAppointment(id: string) {
    const supabase = await createClient()
    const { data, error } = await supabase
        .from('appointments')
        .select('*, customers(*)')
        .eq('id', id)
        .single()

    if (error) throw error
    return data
}

export async function getOffertes() {
    const supabase = await createClient()
    const { data, error } = await supabase
        .from('offertes')
        .select('*')
        .order('created_at', { ascending: false })

    if (error) throw error
    return data
}

export async function getOfferte(id: string) {
    const supabase = await createClient()
    const { data, error } = await supabase
        .from('offertes')
        .select('*')
        .eq('id', id)
        .single()

    if (error) throw error
    return data
}

export async function getAIKennisbank() {
    const supabase = await createClient()
    const { data, error } = await supabase
        .from('ai_kennisbank')
        .select('*')
        .order('created_at', { ascending: false })

    if (error) throw error
    return data
}

export async function getAIKennisitem(id: string) {
    const supabase = await createClient()
    const { data, error } = await supabase
        .from('ai_kennisbank')
        .select('*')
        .eq('id', id)
        .single()

    if (error) throw error
    return data
}

export async function getActievloeren() {
    const supabase = await createClient()
    const { data, error } = await supabase
        .from('actievloeren')
        .select('*')
        .order('sort_order', { ascending: true })

    if (error) throw error
    return data
}

export async function getActievloer(id: string) {
    const supabase = await createClient()
    const { data, error } = await supabase
        .from('actievloeren')
        .select('*')
        .eq('id', id)
        .single()

    if (error) throw error
    return data
}

export async function getSettings(key: string) {
    const supabase = await createClient()
    const { data, error } = await supabase
        .from('settings')
        .select('value')
        .eq('key', key)
        .single()

    if (error) return null
    return data.value
}
