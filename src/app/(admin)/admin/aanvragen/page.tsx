import React from 'react'
import { getOffertes } from '@/lib/admin-data'
import AanvragenClient from './_components/AanvragenClient'

export default async function AanvragenPage() {
    const offertes = await getOffertes()

    return <AanvragenClient initialOffertes={offertes} />
}
