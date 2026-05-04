import { z } from 'zod';

const serverSchema = z.object({
  NODE_ENV: z.enum(['development', 'test', 'production']).default('development'),

  NEXT_PUBLIC_SUPABASE_URL: z.string().url(),
  NEXT_PUBLIC_SUPABASE_ANON_KEY: z.string().min(20),

  SUPABASE_SERVICE_ROLE_KEY: z.string().min(20),

  ANTHROPIC_API_KEY: z.string().startsWith('sk-ant-').optional(),

  RESEND_API_KEY: z.string().startsWith('re_').optional(),

  NEXT_PUBLIC_SITE_URL: z.string().url().default('http://localhost:3000'),
});

const clientSchema = z.object({
  NEXT_PUBLIC_SUPABASE_URL: z.string().url(),
  NEXT_PUBLIC_SUPABASE_ANON_KEY: z.string().min(20),
  NEXT_PUBLIC_SITE_URL: z.string().url(),
});

const isServer = typeof window === 'undefined';

const parsed = isServer
  ? serverSchema.safeParse(process.env)
  : clientSchema.safeParse({
      NEXT_PUBLIC_SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL,
      NEXT_PUBLIC_SUPABASE_ANON_KEY: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
      NEXT_PUBLIC_SITE_URL: process.env.NEXT_PUBLIC_SITE_URL,
    });

if (!parsed.success) {
  console.error('Invalid environment variables:', parsed.error.flatten().fieldErrors);
  throw new Error('Invalid environment variables');
}

export const env = parsed.data;
