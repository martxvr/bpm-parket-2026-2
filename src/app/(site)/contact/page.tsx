import { Metadata } from 'next'
import ContactClient from './ContactClient';
import { getBedrijfsgegevens } from '@/lib/site-data';

export const metadata: Metadata = {
    title: 'Contact',
    description: 'Neem contact op met PVC Vloeren Achterhoek in Doetinchem. Bel, mail of bezoek onze showroom voor gratis advies.',
    alternates: { canonical: '/contact' },
}

export default async function ContactPage() {
    const bedrijfsgegevens = await getBedrijfsgegevens();
    return <ContactClient bedrijfsgegevens={bedrijfsgegevens} />
}
