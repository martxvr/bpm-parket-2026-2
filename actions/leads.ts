'use server';

import { headers } from 'next/headers';
import { revalidatePath } from 'next/cache';
import { render } from '@react-email/render';
import { leadSchema } from '@/lib/validation/forms';
import { insertLead } from '@/lib/db/leads';
import { hashIdentifier } from '@/lib/hash';
import { rateLimit } from '@/lib/rate-limit';
import { sendEmail, ADMIN_EMAIL } from '@/lib/resend';
import { LeadConfirmation } from '@/components/emails/transactional/LeadConfirmation';
import { AdminLeadNotification } from '@/components/emails/transactional/AdminLeadNotification';

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
    brand_id: formData.get('brand_id') || undefined,
    product_id: formData.get('product_id') || undefined,
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
      brand_id: parsed.data.brand_id,
      product_id: parsed.data.product_id,
      ip_hash: hashIdentifier(ip),
      user_agent_hash: hashIdentifier(ua),
    });

    // Send confirmation to visitor + notification to admin.
    // Email failures don't roll back the saved lead.
    await Promise.all([
      sendEmail({
        to: parsed.data.email,
        subject: 'We hebben je aanvraag ontvangen — BPM Parket',
        html: await render(LeadConfirmation({ name: parsed.data.name })),
      }).catch((e) => console.error('Lead confirmation email failed:', e)),
      sendEmail({
        to: ADMIN_EMAIL,
        replyTo: parsed.data.email,
        subject: `Nieuwe lead: ${parsed.data.name} (${parsed.data.source})`,
        html: await render(
          AdminLeadNotification({
            name: parsed.data.name,
            email: parsed.data.email,
            phone: parsed.data.phone,
            floorType: parsed.data.floor_type,
            areaSize: parsed.data.area_size,
            message: parsed.data.message,
            source: parsed.data.source,
          }),
        ),
      }).catch((e) => console.error('Admin notification email failed:', e)),
    ]);

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
