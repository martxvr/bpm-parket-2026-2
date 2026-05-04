import 'server-only';
import { Resend } from 'resend';
import { env } from '@/lib/env';
import { companyConfig } from '@/lib/company';

export const resend = env.RESEND_API_KEY ? new Resend(env.RESEND_API_KEY) : null;

const FROM = `BPM Parket <noreply@bpmparket.nl>`;
export const ADMIN_EMAIL = companyConfig.contact.email;

export async function sendEmail(input: {
  to: string;
  subject: string;
  html: string;
  text?: string;
  replyTo?: string;
}): Promise<void> {
  if (!resend) {
    console.warn(
      '[email] RESEND_API_KEY missing — would have sent:',
      `to=${input.to} subject="${input.subject}"`,
    );
    return;
  }
  const result = await resend.emails.send({
    from: FROM,
    to: input.to,
    subject: input.subject,
    html: input.html,
    text: input.text,
    replyTo: input.replyTo,
  });
  if (result.error) {
    console.error('[email] Resend error:', result.error);
    throw new Error(`Failed to send email: ${result.error.message}`);
  }
}
