import {
  EmailLayout,
  Section,
  Text,
  Link,
} from '@/components/emails/layout/EmailLayout';

export function PasswordReset({ resetUrl }: { resetUrl: string }) {
  return (
    <EmailLayout preview="Reset je BPM Parket admin wachtwoord">
      <Section>
        <Text style={{ fontSize: '18px', fontWeight: 600 }}>
          Wachtwoord opnieuw instellen
        </Text>
        <Text>
          Klik op de link hieronder om een nieuw wachtwoord in te stellen voor het
          admin-paneel. De link is 1 uur geldig.
        </Text>
        <Text style={{ marginTop: '16px' }}>
          <Link
            href={resetUrl}
            style={{
              backgroundColor: '#7d4f2d',
              color: '#fff',
              padding: '12px 20px',
              borderRadius: '6px',
              textDecoration: 'none',
              display: 'inline-block',
            }}
          >
            Wachtwoord opnieuw instellen
          </Link>
        </Text>
        <Text style={{ marginTop: '16px', fontSize: '12px', color: '#888' }}>
          Heb je hier geen reset voor aangevraagd? Negeer dan deze mail.
        </Text>
      </Section>
    </EmailLayout>
  );
}
