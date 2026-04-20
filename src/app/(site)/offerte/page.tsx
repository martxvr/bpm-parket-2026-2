import { Metadata } from 'next'
import OfferteClient from './OfferteClient';
import { getBedrijfsgegevens } from '@/lib/site-data';

export const metadata: Metadata = {
    title: 'Gratis Offerte Aanvragen',
    description: 'Vraag een gratis en vrijblijvende offerte aan voor PVC-vloeren, traprenovatie, vloerbedekking, raamdecoratie of gordijnen bij PVC Vloeren Achterhoek.',
    alternates: { canonical: '/offerte' },
}

export default async function OffertePage() {
    const bedrijfsgegevens = await getBedrijfsgegevens();
    return <OfferteClient bedrijfsgegevens={bedrijfsgegevens} />
}
