export const companyConfig = {
  name: 'BPM Parket',
  legalName: 'BPM Parket B.V.',
  contact: {
    phone: '040 123 4567',
    email: 'info@bpmparket.nl',
    address: 'Hooge Akker 19',
    zipCity: '5661 NG Geldrop',
    mapsUrl: 'https://maps.google.com/?q=Hooge+Akker+19,+5661+NG+Geldrop',
    kvk: '12345678',
    btw: 'NL123456789B01',
    iban: 'NL01RABO0123456789',
  },
  socials: {
    facebook: 'https://facebook.com/bpmparket',
    instagram: 'https://instagram.com/bpmparket',
    linkedin: 'https://linkedin.com/company/bpmparket',
  },
  hours: {
    monday: 'Op afspraak',
    tuesday: '10:00 - 17:00',
    wednesday: '10:00 - 17:00',
    thursday: '10:00 - 17:00',
    friday: '10:00 - 17:00',
    saturday: '10:00 - 16:00',
    sunday: 'Gesloten',
  },
} as const;
