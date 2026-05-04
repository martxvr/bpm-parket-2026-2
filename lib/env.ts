import { z } from 'zod';

/**
 * Server-side environment variables.
 *
 * This module validates and types env vars at import time. It MUST only be
 * imported from server contexts (server components, server actions, route
 * handlers, middleware). For client components, use `process.env.NEXT_PUBLIC_*`
 * directly — Next.js statically inlines those at build time.
 */
const schema = z.object({
  NODE_ENV: z.enum(['development', 'test', 'production']).default('development'),

  NEXT_PUBLIC_SUPABASE_URL: z.string().url(),
  NEXT_PUBLIC_SUPABASE_ANON_KEY: z.string().min(20),

  // Optional in schema so dev/build doesn't fail when the value is missing
  // from .env.local. Use `requireServiceRoleKey()` from this module before
  // performing any service-role operation so the failure mode is loud.
  SUPABASE_SERVICE_ROLE_KEY: z.preprocess(
    (v) => (v === '' ? undefined : v),
    z.string().min(20).optional(),
  ),

  ANTHROPIC_API_KEY: z.preprocess(
    (v) => (v === '' ? undefined : v),
    z.string().startsWith('sk-ant-').optional(),
  ),

  RESEND_API_KEY: z.preprocess(
    (v) => (v === '' ? undefined : v),
    z.string().startsWith('re_').optional(),
  ),

  SUPABASE_AUTH_EMAIL_HOOK_SECRET: z.preprocess(
    (v) => (v === '' ? undefined : v),
    z.string().min(20).optional(),
  ),

  NEXT_PUBLIC_SITE_URL: z.string().url().default('http://localhost:3000'),
});

const parsed = schema.safeParse(process.env);

if (!parsed.success) {
  console.error(
    'Invalid environment variables:',
    parsed.error.flatten().fieldErrors,
  );
  throw new Error('Invalid environment variables');
}

export const env = parsed.data;

/**
 * Returns the Supabase service-role key, throwing a clear error if it is
 * missing. Use this from any server context that needs to bypass RLS
 * (admin operations, seed scripts, audit logs).
 */
export function requireServiceRoleKey(): string {
  if (!env.SUPABASE_SERVICE_ROLE_KEY) {
    throw new Error(
      'SUPABASE_SERVICE_ROLE_KEY is missing from environment. Add it to ' +
        '.env.local (find it in Supabase dashboard → Settings → API → service_role).',
    );
  }
  return env.SUPABASE_SERVICE_ROLE_KEY;
}
