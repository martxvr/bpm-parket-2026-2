import {
  EmailLayout,
  Section,
  Text,
  Link,
} from '@/components/emails/layout/EmailLayout';

type Props = {
  name: string;
  email: string;
  date: string;
  notes?: string;
  source: 'chatbot' | 'website' | 'manual';
};

export function AdminAppointmentNotification(p: Props) {
  const formatted = new Date(p.date).toLocaleString('nl-NL', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });

  return (
    <EmailLayout preview={`Nieuwe afspraak via ${p.source}`}>
      <Section>
        <Text style={{ fontSize: '18px', fontWeight: 600 }}>Nieuwe afspraak</Text>
        <Text>Geboekt via: {p.source}</Text>
        <Text>
          <strong>Naam:</strong> {p.name}
          <br />
          <strong>Email:</strong>{' '}
          <Link href={`mailto:${p.email}`}>{p.email}</Link>
          <br />
          <strong>Datum:</strong> {formatted}
          <br />
        </Text>
        {p.notes && (
          <>
            <Text style={{ fontWeight: 600, marginTop: '16px' }}>Notities:</Text>
            <Text>{p.notes}</Text>
          </>
        )}
      </Section>
    </EmailLayout>
  );
}
