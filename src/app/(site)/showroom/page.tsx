import { Metadata } from 'next'
import ShowroomClient from './ShowroomClient';
import { getBedrijfsgegevens } from '@/lib/site-data';

export const metadata: Metadata = {
    title: 'Showroom Bezoeken',
    description: 'Bezoek onze showroom in Doetinchem en bekijk ons assortiment PVC-vloeren, vloerbedekking, raamdecoratie en gordijnen. Gratis koffie en persoonlijk advies.',
    alternates: { canonical: '/showroom' },
}

export default async function ShowroomPage() {
    const bedrijfsgegevens = await getBedrijfsgegevens();
    return <ShowroomClient bedrijfsgegevens={bedrijfsgegevens} />
}
