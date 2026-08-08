import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY || 're_placeholder');

export interface SendEmailPayload {
  to: string;
  subject: string;
  html: string;
  from?: string;
}

/**
 * Internal sendEmail abstraction for Resend
 */
export async function sendEmail({ to, subject, html, from }: SendEmailPayload) {
  if (!process.env.RESEND_API_KEY) {
    console.warn(`[sendEmail] Mocking email send to ${to}: ${subject}`);
    return { id: 'mock_email_id' };
  }

  return resend.emails.send({
    from: from || 'SaaS Decision Engine <noreply@keepswitchbuild.com>',
    to,
    subject,
    html,
  });
}
