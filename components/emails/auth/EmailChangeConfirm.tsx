import {
  EmailLayout,
  Section,
  Text,
  Link,
} from '@/components/emails/layout/EmailLayout';

export function EmailChangeConfirm({ confirmUrl }: { confirmUrl: string }) {
  return (
    <EmailLayout preview="Bevestig je nieuwe emailadres">
      <Section>
        <Text style={{ fontSize: '18px', fontWeight: 600 }}>
          Bevestig je nieuwe emailadres
        </Text>
        <Text>
          Klik op de link hieronder om je nieuwe emailadres voor het admin-paneel
          te bevestigen.
        </Text>
        <Text style={{ marginTop: '16px' }}>
          <Link
            href={confirmUrl}
            style={{
              backgroundColor: '#7d4f2d',
              color: '#fff',
              padding: '12px 20px',
              borderRadius: '6px',
              textDecoration: 'none',
              display: 'inline-block',
            }}
          >
            Email bevestigen
          </Link>
        </Text>
      </Section>
    </EmailLayout>
  );
}
