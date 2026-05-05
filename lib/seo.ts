import { companyConfig } from '@/lib/company';

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://bpmparket.nl';

const HOURS_SCHEMA = [
  { dayOfWeek: 'Tuesday', opens: '10:00', closes: '17:00' },
  { dayOfWeek: 'Wednesday', opens: '10:00', closes: '17:00' },
  { dayOfWeek: 'Thursday', opens: '10:00', closes: '17:00' },
  { dayOfWeek: 'Friday', opens: '10:00', closes: '17:00' },
  { dayOfWeek: 'Saturday', opens: '10:00', closes: '16:00' },
];

export function localBusinessSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'LocalBusiness',
    '@id': `${SITE_URL}/#localbusiness`,
    name: companyConfig.name,
    legalName: companyConfig.legalName,
    url: SITE_URL,
    telephone: companyConfig.contact.phone,
    email: companyConfig.contact.email,
    address: {
      '@type': 'PostalAddress',
      streetAddress: companyConfig.contact.address,
      postalCode: companyConfig.contact.zipCity.split(' ').slice(0, 2).join(' '),
      addressLocality: 'Geldrop',
      addressCountry: 'NL',
    },
    geo: {
      '@type': 'GeoCoordinates',
      latitude: 51.4202,
      longitude: 5.5594,
    },
    image: `${SITE_URL}/logo.png`,
    priceRange: '€€',
    sameAs: [
      companyConfig.socials.facebook,
      companyConfig.socials.instagram,
      companyConfig.socials.linkedin,
    ],
    openingHoursSpecification: HOURS_SCHEMA.map((h) => ({
      '@type': 'OpeningHoursSpecification',
      dayOfWeek: `https://schema.org/${h.dayOfWeek}`,
      opens: h.opens,
      closes: h.closes,
    })),
  };
}

export function serviceSchema(input: {
  name: string;
  description: string;
  slug: string;
  imageUrl?: string;
}) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Service',
    name: input.name,
    description: input.description,
    url: `${SITE_URL}/${input.slug}`,
    image: input.imageUrl,
    provider: { '@id': `${SITE_URL}/#localbusiness` },
    areaServed: { '@type': 'City', name: 'Geldrop' },
  };
}

export function projectSchema(input: {
  title: string;
  description: string;
  slug: string;
  imageUrl: string | null;
  completedDate: string | null;
  location: string | null;
}) {
  return {
    '@context': 'https://schema.org',
    '@type': 'CreativeWork',
    name: input.title,
    description: input.description,
    url: `${SITE_URL}/projecten/${input.slug}`,
    image: input.imageUrl ?? undefined,
    dateCreated: input.completedDate ?? undefined,
    locationCreated: input.location
      ? { '@type': 'Place', name: input.location }
      : undefined,
    creator: { '@id': `${SITE_URL}/#localbusiness` },
  };
}
