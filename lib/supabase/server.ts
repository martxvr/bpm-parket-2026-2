import {
  createServerClient,
  type CookieMethodsServer,
} from '@supabase/ssr';
import { cookies } from 'next/headers';
import { env } from '@/lib/env';

export async function createClient() {
  const cookieStore = await cookies();

  return createServerClient(
    env.NEXT_PUBLIC_SUPABASE_URL,
    env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    {
      cookies: {
        getAll: () => cookieStore.getAll(),
        setAll: (cookiesToSet) => {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options),
            );
          } catch {
            // Called from a Server Component — safe to ignore;
            // middleware refreshes the session.
          }
        },
      } satisfies CookieMethodsServer,
    },
  );
}

export function createServiceClient() {
  // Bypass-RLS client. Use ONLY in admin server actions / route handlers
  // for explicitly admin-bypass operations (audit logs, seed scripts).
  // Never expose this client to the browser.
  return createServerClient(
    env.NEXT_PUBLIC_SUPABASE_URL,
    env.SUPABASE_SERVICE_ROLE_KEY,
    {
      cookies: {
        getAll: () => [],
        setAll: () => {},
      } satisfies CookieMethodsServer,
      auth: { persistSession: false, autoRefreshToken: false },
    },
  );
}
