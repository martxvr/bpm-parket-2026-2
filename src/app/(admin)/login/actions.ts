'use server'

import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'

export async function login(formData: FormData) {
    const supabase = await createClient()

    const email = formData.get('email') as string
    const password = formData.get('password') as string

    const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
    })

    if (error) {
        redirect('/login?error=Invalid credentials')
    }

    redirect('/admin')
}

export async function logout() {
    const supabase = await createClient()
    await supabase.auth.signOut()
    redirect('/login')
}

export async function registerFirstAdmin(formData: FormData) {
    const supabase = await createClient()

    // Safety check: is it really the first user?
    const { data: hasNoUsers } = await supabase.rpc('has_no_users')

    if (!hasNoUsers) {
        redirect('/login?error=Setup already completed')
    }

    const email = formData.get('email') as string
    const password = formData.get('password') as string

    const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
            data: {
                role: 'admin'
            }
        }
    })

    if (error) {
        redirect(`/login?error=${encodeURIComponent(error.message)}`)
    }

    // Auto login might happen depending on Supabase settings, 
    // but usually sign up results in a session.
    redirect('/admin')
}
