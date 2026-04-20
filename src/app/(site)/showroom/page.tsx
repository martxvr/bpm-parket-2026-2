import { Metadata } from 'next'
import ShowroomClient from './ShowroomClient';
import { getBedrijfsgegevens } from '@/lib/site-data';

export const metadata: Metadata = {
    title: 'Showroom Bezoeken',
    description: 'Bezoek onze showroom in Geldrop en bekijk ons assortiment parket, PVC, laminaat en buitenparket. Persoonlijk advies van onze parket-specialist.',
    alternates: { canonical: '/showroom' },
}

export default async function ShowroomPage() {
    const bedrijfsgegevens = await getBedrijfsgegevens();
    return <ShowroomClient bedrijfsgegevens={bedrijfsgegevens} />
}
