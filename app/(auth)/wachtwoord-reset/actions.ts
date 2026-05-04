'use server';

import { createClient } from '@/lib/supabase/server';
import { env } from '@/lib/env';
import { z } from 'zod';

const resetSchema = z.object({
  email: z.string().email(),
});

export type ResetState = { error?: string; success?: boolean };

export async function requestResetAction(
  _prev: ResetState,
  formData: FormData,
): Promise<ResetState> {
  const parsed = resetSchema.safeParse({ email: formData.get('email') });

  if (!parsed.success) {
    return { error: 'Ongeldig emailadres' };
  }

  const supabase = await createClient();
  const { error } = await supabase.auth.resetPasswordForEmail(parsed.data.email, {
    redirectTo: `${env.NEXT_PUBLIC_SITE_URL}/wachtwoord-reset/bevestigen`,
  });

  // Always return success to prevent email enumeration.
  if (error) {
    console.error('Password reset error (not exposed to client):', error);
  }

  return { success: true };
}
