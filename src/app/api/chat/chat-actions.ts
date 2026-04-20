'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'

/**
 * Checks available slots for a given date.
 */
export async function checkAvailability(dateStr: string) {
    try {
        const supabase = await createClient()
        
        // Start and end of the day in UTC
        const startOfDay = `${dateStr}T00:00:00Z`
        const endOfDay = `${dateStr}T23:59:59Z`

        const { data, error } = await supabase
            .from('appointments')
            .select('date')
            .gte('date', startOfDay)
            .lte('date', endOfDay)
            .neq('status', 'geannuleerd')

        if (error) throw error
        
        // Extract times from the timestamp column
        const bookedTimes = data.map(app => {
            const d = new Date(app.date)
            return d.toISOString().split('T')[1].substring(0, 5) // HH:mm
        })

        return { bookedTimes }
    } catch (error) {
        console.error('Error checking availability:', error)
        return { error: 'Kon beschikbaarheid niet controleren' }
    }
}

/**
 * Creates a customer (if not exists) and an appointment.
 */
export async function createAppointmentTool(data: {
    name: string;
    phone: string;
    email?: string;
    date: string;
    time: string;
    service: string;
}) {
    try {
        const supabase = await createClient()

        // Combine date (YYYY-MM-DD) and time (HH:MM) into an ISO string
        const combinedDateTime = `${data.date}T${data.time}:00Z`

        // 1. Find or create customer
        let customerId: string | null = null
        
        const { data: customerData } = await supabase
            .from('customers')
            .select('id')
            .eq('phone', data.phone)
            .maybeSingle()

        if (customerData) {
            customerId = customerData.id
        } else {
            const { data: newCustomer, error: createError } = await supabase
                .from('customers')
                .insert([{
                    name: data.name,
                    phone: data.phone,
                    email: data.email || null,
                }])
                .select()
                .single()

            if (createError) throw createError
            customerId = newCustomer.id
        }

        // 2. Create appointment
        const { error: appError } = await supabase
            .from('appointments')
            .insert([{
                customer_id: customerId,
                date: combinedDateTime,
                service: data.service,
                status: 'nieuw',
                source: 'chatbot'
            }])

        if (appError) throw appError

        revalidatePath('/admin/afspraken')
        return { success: true }
    } catch (error) {
        console.error('Error creating appointment via tool:', error)
        return { error: 'Kon afspraak niet inplannen' }
    }
}
