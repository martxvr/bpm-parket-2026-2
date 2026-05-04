import {
  EmailLayout,
  Section,
  Text,
  Link,
} from '@/components/emails/layout/EmailLayout';

type Props = {
  name: string;
  email: string;
  phone: string;
  floorType?: string;
  areaSize?: number;
  message?: string;
  source: string;
};

export function AdminLeadNotification(p: Props) {
  return (
    <EmailLayout preview={`Nieuwe lead via ${p.source}`}>
      <Section>
        <Text style={{ fontSize: '18px', fontWeight: 600 }}>
          Nieuwe lead binnen
        </Text>
        <Text>Source: {p.source}</Text>
        <Text>
          <strong>Naam:</strong> {p.name}
          <br />
          <strong>Email:</strong>{' '}
          <Link href={`mailto:${p.email}`}>{p.email}</Link>
          <br />
          <strong>Telefoon:</strong>{' '}
          <Link href={`tel:${p.phone.replace(/\s/g, '')}`}>{p.phone}</Link>
          <br />
          {p.floorType && (
            <>
              <strong>Type vloer:</strong> {p.floorType}
              <br />
            </>
          )}
          {p.areaSize && (
            <>
              <strong>Oppervlak:</strong> {p.areaSize} m²
              <br />
            </>
          )}
        </Text>
        {p.message && (
          <>
            <Text style={{ fontWeight: 600, marginTop: '16px' }}>Bericht:</Text>
            <Text>{p.message}</Text>
          </>
        )}
      </Section>
    </EmailLayout>
  );
}
