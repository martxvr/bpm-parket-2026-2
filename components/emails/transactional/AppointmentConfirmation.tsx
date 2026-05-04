import { EmailLayout, Section, Text } from '@/components/emails/layout/EmailLayout';
import { companyConfig } from '@/lib/company';

export function AppointmentConfirmation({
  name,
  date,
}: {
  name: string;
  date: string;
}) {
  const formatted = new Date(date).toLocaleString('nl-NL', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });

  return (
    <EmailLayout preview="Showroomafspraak bevestigd">
      <Section>
        <Text style={{ fontSize: '18px', fontWeight: 600 }}>
          Tot ziens in onze showroom, {name}!
        </Text>
        <Text>Je afspraak staat ingepland voor:</Text>
        <Text style={{ fontSize: '16px', fontWeight: 600 }}>{formatted}</Text>
        <Text>
          Adres: {companyConfig.contact.address}, {companyConfig.contact.zipCity}
        </Text>
        <Text>
          Tussendoor verandert? Bel ons even op {companyConfig.contact.phone}, dan
          plannen we het anders.
        </Text>
      </Section>
    </EmailLayout>
  );
}
