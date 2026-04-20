import { Metadata } from 'next'
import OfferteClient from './OfferteClient';
import { getBedrijfsgegevens } from '@/lib/site-data';

export const metadata: Metadata = {
    title: 'Vraag een vrijblijvende offerte aan',
    description: 'Vraag een gratis en vrijblijvende offerte aan voor parket, PVC, laminaat, traprenovatie, buitenparket of interieurwerken bij BPM Parket.',
    alternates: { canonical: '/offerte' },
}

export default async function OffertePage() {
    const bedrijfsgegevens = await getBedrijfsgegevens();
    return <OfferteClient bedrijfsgegevens={bedrijfsgegevens} />
}
