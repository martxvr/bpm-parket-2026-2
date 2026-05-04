import { EmailLayout, Section, Text } from '@/components/emails/layout/EmailLayout';

export function LeadConfirmation({ name }: { name: string }) {
  return (
    <EmailLayout preview="We hebben je aanvraag ontvangen">
      <Section>
        <Text style={{ fontSize: '18px', fontWeight: 600 }}>
          Bedankt voor je aanvraag, {name}!
        </Text>
        <Text>
          We hebben je bericht ontvangen en nemen binnen 24 uur contact met je op om
          de details door te nemen.
        </Text>
        <Text>Heb je in de tussentijd vragen? Bel ons gerust.</Text>
      </Section>
    </EmailLayout>
  );
}
