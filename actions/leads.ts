'use server';

import { headers } from 'next/headers';
import { revalidatePath } from 'next/cache';
import { leadSchema } from '@/lib/validation/forms';
import { insertLead } from '@/lib/db/leads';
import { hashIdentifier } from '@/lib/hash';
import { rateLimit } from '@/lib/rate-limit';

export type CreateLeadState =
  | { status: 'idle' }
  | { status: 'success' }
  | { status: 'error'; message: string };

export async function createLeadAction(
  _prev: CreateLeadState,
  formData: FormData,
): Promise<CreateLeadState> {
  const headerStore = await headers();
  const ip = headerStore.get('x-forwarded-for')?.split(',')[0].trim() ?? 'unknown';
  const ua = headerStore.get('user-agent') ?? 'unknown';

  const rl = await rateLimit(`lead:${ip}`, 5, 60 * 60);
  if (!rl.allowed) {
    return {
      status: 'error',
      message: 'Te veel aanvragen — probeer het over een uur opnieuw.',
    };
  }

  const parsed = leadSchema.safeParse({
    name: formData.get('name'),
    email: formData.get('email'),
    phone: formData.get('phone'),
    floor_type: formData.get('floor_type') || undefined,
    area_size: formData.get('area_size') || undefined,
    message: formData.get('message') || undefined,
    source: formData.get('source') ?? 'unknown',
    website: formData.get('website') || undefined,
  });

  if (!parsed.success) {
    return { status: 'error', message: parsed.error.issues[0].message };
  }

  // Honeypot caught — silently report success to fool the bot
  if (parsed.data.website) {
    return { status: 'success' };
  }

  try {
    await insertLead({
      name: parsed.data.name,
      email: parsed.data.email,
      phone: parsed.data.phone,
      floor_type: parsed.data.floor_type,
      area_size: parsed.data.area_size,
      message: parsed.data.message,
      source: parsed.data.source,
      ip_hash: hashIdentifier(ip),
      user_agent_hash: hashIdentifier(ua),
    });

    // Email side-effects added in Task 23 (after Resend setup).

    revalidatePath('/admin/leads');
    return { status: 'success' };
  } catch (e) {
    console.error('Lead insert error:', e);
    return {
      status: 'error',
      message: 'Er is iets misgegaan. Probeer het later nog eens of bel ons.',
    };
  }
}
