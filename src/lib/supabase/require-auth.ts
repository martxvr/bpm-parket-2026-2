import { createClient } from './server'

/**
 * Asserts that the current request has a valid authenticated session.
 * Throws if not authenticated. Use at the top of every admin server action.
 */
export async function requireAuth() {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) throw new Error('Unauthorized')
    return { supabase, user }
}
