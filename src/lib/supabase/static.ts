import { createClient as createSupabaseClient } from '@supabase/supabase-js'

/**
 * A simple, non-cookie based Supabase client for public data fetching.
 * Safe to use during static generation (build time / revalidation).
 */
export function createClient() {
    return createSupabaseClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    )
}
