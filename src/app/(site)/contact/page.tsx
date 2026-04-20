import { Metadata } from 'next'
import ContactClient from './ContactClient';
import { getBedrijfsgegevens } from '@/lib/site-data';

export const metadata: Metadata = {
    title: 'Contact',
    description: 'Neem contact op met BPM Parket in Geldrop. Bel, mail of bezoek onze showroom voor gratis advies over parket, PVC en interieurwerken.',
    alternates: { canonical: '/contact' },
}

export default async function ContactPage() {
    const bedrijfsgegevens = await getBedrijfsgegevens();
    return <ContactClient bedrijfsgegevens={bedrijfsgegevens} />
}
