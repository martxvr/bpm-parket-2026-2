import React from 'react'
import { getPublicActievloeren } from '@/lib/site-data'
import ActievloerenPageClient from './ActievloerenPageClient'

export const metadata = {
    title: 'Actievloeren | PVC Vloeren Achterhoek',
    description: 'Bekijk onze actievloeren met aantrekkelijke kortingen. Hoogwaardige vloeren voor de beste prijs bij PVC Vloeren Achterhoek.',
}

export default async function ActievloerenPage() {
    const actievloeren = await getPublicActievloeren()

    return <ActievloerenPageClient actievloeren={actievloeren} />
}
