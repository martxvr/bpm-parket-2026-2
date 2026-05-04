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

  SUPABASE_SERVICE_ROLE_KEY: z.string().min(20),

  ANTHROPIC_API_KEY: z.string().startsWith('sk-ant-').optional(),

  RESEND_API_KEY: z.string().startsWith('re_').optional(),

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
