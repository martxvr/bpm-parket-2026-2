import {
  Html,
  Head,
  Body,
  Container,
  Section,
  Text,
  Link,
  Hr,
} from '@react-email/components';
import type { ReactNode } from 'react';
import { companyConfig } from '@/lib/company';

const main = {
  backgroundColor: '#faf7f2',
  fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
  color: '#1f1f1f',
};

const container = {
  backgroundColor: '#ffffff',
  margin: '24px auto',
  padding: '32px',
  maxWidth: '560px',
  borderRadius: '12px',
};

const headerBrand = { fontSize: '20px', fontWeight: 600, color: '#1f1f1f' };
const footer = { fontSize: '12px', color: '#888', marginTop: '24px' };

export function EmailLayout({
  preview: _preview,
  children,
}: {
  preview?: string;
  children: ReactNode;
}) {
  return (
    <Html>
      <Head />
      <Body style={main}>
        <Container style={container}>
          <Section>
            <Text style={headerBrand}>{companyConfig.name}</Text>
          </Section>
          <Hr style={{ borderColor: '#eee' }} />
          {children}
          <Hr style={{ borderColor: '#eee', marginTop: '24px' }} />
          <Section style={footer}>
            <Text>
              {companyConfig.legalName} · {companyConfig.contact.address},{' '}
              {companyConfig.contact.zipCity}
            </Text>
            <Text>
              <Link
                href={`tel:${companyConfig.contact.phone.replace(/\s/g, '')}`}
              >
                {companyConfig.contact.phone}
              </Link>
              {' · '}
              <Link href={`mailto:${companyConfig.contact.email}`}>
                {companyConfig.contact.email}
              </Link>
            </Text>
          </Section>
        </Container>
      </Body>
    </Html>
  );
}

export { Section, Text, Link };
