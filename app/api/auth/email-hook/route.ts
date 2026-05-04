import { NextResponse, type NextRequest } from 'next/server';
import { Webhook } from 'standardwebhooks';
import { render } from '@react-email/render';
import { env } from '@/lib/env';
import { sendEmail } from '@/lib/resend';
import { PasswordReset } from '@/components/emails/auth/PasswordReset';
import { EmailChangeConfirm } from '@/components/emails/auth/EmailChangeConfirm';

type EmailType =
  | 'signup'
  | 'recovery'
  | 'invite'
  | 'magiclink'
  | 'email_change'
  | 'email_change_current';

type Payload = {
  user: { email: string };
  email_data: {
    token: string;
    token_hash: string;
    redirect_to: string;
    email_action_type: EmailType;
    site_url: string;
  };
};

export async function POST(req: NextRequest) {
  const secret = env.SUPABASE_AUTH_EMAIL_HOOK_SECRET;
  if (!secret) {
    return NextResponse.json(
      { error: 'Email hook not configured' },
      { status: 500 },
    );
  }

  const headers = Object.fromEntries(req.headers.entries());
  const body = await req.text();

  let payload: Payload;
  try {
    const wh = new Webhook(Buffer.from(secret, 'base64').toString('utf-8'));
    payload = wh.verify(body, headers) as Payload;
  } catch (e) {
    console.error('Email hook signature verification failed:', e);
    return NextResponse.json({ error: 'Invalid signature' }, { status: 401 });
  }

  const { user, email_data } = payload;
  const actionUrl = `${email_data.site_url}/auth/v1/verify?token=${email_data.token_hash}&type=${email_data.email_action_type}&redirect_to=${email_data.redirect_to}`;

  let subject: string;
  let html: string;

  switch (email_data.email_action_type) {
    case 'recovery':
      subject = 'Reset je BPM Parket admin wachtwoord';
      html = await render(PasswordReset({ resetUrl: actionUrl }));
      break;
    case 'email_change':
    case 'email_change_current':
      subject = 'Bevestig je nieuwe emailadres';
      html = await render(EmailChangeConfirm({ confirmUrl: actionUrl }));
      break;
    default:
      console.warn('Unhandled auth email type:', email_data.email_action_type);
      return NextResponse.json({ ok: true });
  }

  try {
    await sendEmail({ to: user.email, subject, html });
    return NextResponse.json({ ok: true });
  } catch (e) {
    console.error('Failed to send auth email:', e);
    return NextResponse.json({ error: 'Email send failed' }, { status: 500 });
  }
}
