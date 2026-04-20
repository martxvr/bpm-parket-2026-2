'use server'

import { createClient } from '@/lib/supabase/server'
import { requireAuth } from '@/lib/supabase/require-auth'
import { revalidatePath } from 'next/cache'
import { Policy } from '@/types'

// Retrieve dynamic policies from the settings table (public read — no auth required)
export async function getDynamicPolicies(): Promise<Policy[]> {
    const supabase = await createClient()
    const { data, error } = await supabase
        .from('settings')
        .select('value')
        .eq('key', 'dynamic_policies')
        .single()

    if (error || !data?.value) return []
    return data.value as Policy[]
}

// Generate a slug from the title
function generateSlug(title: string): string {
    return title
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)+/g, '') || Date.now().toString()
}

// Save or update a dynamic policy
export async function saveDynamicPolicy(formData: FormData) {
    const { supabase } = await requireAuth()

    const id = formData.get('id') as string | null
    const title = formData.get('title') as string
    const content = formData.get('content') as string

    const existingPolicies = await getDynamicPolicies()
    let updatedPolicies = [...existingPolicies]

    if (id && id !== 'new') {
        updatedPolicies = updatedPolicies.map(p =>
            p.id === id ? { ...p, title, content, lastUpdated: new Date().toISOString() } : p
        )
    } else {
        const newSlug = generateSlug(title)
        let finalSlug = newSlug
        let count = 1
        while (updatedPolicies.some(p => p.id === finalSlug)) {
            finalSlug = `${newSlug}-${count}`
            count++
        }

        const newPolicy: Policy = {
            id: finalSlug,
            title,
            content,
            lastUpdated: new Date().toISOString()
        }
        updatedPolicies.push(newPolicy)
    }

    const { error } = await supabase
        .from('settings')
        .upsert({ key: 'dynamic_policies', value: updatedPolicies }, { onConflict: 'key' })

    if (error) throw error
    revalidatePath('/admin/beleid')
    revalidatePath('/')
}

export async function deleteDynamicPolicy(id: string) {
    const { supabase } = await requireAuth()

    const existingPolicies = await getDynamicPolicies()
    const updatedPolicies = existingPolicies.filter(p => p.id !== id)

    const { error } = await supabase
        .from('settings')
        .upsert({ key: 'dynamic_policies', value: updatedPolicies }, { onConflict: 'key' })

    if (error) throw error
    revalidatePath('/admin/beleid')
    revalidatePath('/')
}
