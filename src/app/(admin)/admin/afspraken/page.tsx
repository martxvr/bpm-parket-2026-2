import React from 'react'
import { getAppointments } from '@/lib/admin-data'
import AppointmentsClient from '../_components/AppointmentsClient'

export default async function AppointmentsPage() {
    const appointments = await getAppointments()

    return <AppointmentsClient initialAppointments={appointments} />
}
