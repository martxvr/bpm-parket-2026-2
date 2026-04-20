'use server'

import { createClient } from '@/lib/supabase/server'

// --- O F F E R T E S ---
export async function submitOfferte(formData: any) {
    const supabase = await createClient()

    // 1. Map service to allowed enum: ('pvc-vloeren', 'traprenovatie', 'vloerbedekking', 'raamdecoratie', 'gordijnen', 'andere')
    let serviceEnum = 'andere';
    if (formData.floorType === 'PVC-vloeren') serviceEnum = 'pvc-vloeren';
    if (formData.floorType === 'Traprenovatie') serviceEnum = 'traprenovatie';
    if (formData.floorType === 'Vloerbedekking') serviceEnum = 'vloerbedekking';
    if (formData.floorType === 'Raamdecoratie') serviceEnum = 'raamdecoratie';
    if (formData.floorType === 'Gordijnen') serviceEnum = 'gordijnen';

    // 2. Include areaSize in the message since there's no oppervlakte column
    const formattedMessage = `Oppervlakte: ${formData.areaSize || 0}m2\n\n${formData.message || ''}`.trim();

    // 3. Insert Offerte
    const { data, error } = await supabase
        .from('offertes')
        .insert([{
            customer_name: `${formData.name} ${formData.lastName}`.trim(),
            email: formData.email,
            phone: formData.phone || null,
            service: serviceEnum,
            message: formattedMessage,
            status: 'nieuw'
        }]);

    if (error) {
        console.error('Error submitting offerte:', error);
        throw new Error(`Failed to submit offerte: ${error.message}`);
    }

    return { success: true };
}

// --- A F S P R A K E N ---
export async function submitShowroomAppointment(formData: any) {
    const supabase = await createClient()

    let customer_id = null;
    if (formData.email || formData.name) {
        let existingCustomer = null;
        if (formData.email) {
            const { data } = await supabase
                .from('customers')
                .select('id')
                .eq('email', formData.email)
                .single();
            existingCustomer = data;
        }

        if (existingCustomer) {
            customer_id = existingCustomer.id;
            
            // Update customer with the new submitted name and phone numbers
            await supabase
                .from('customers')
                .update({ 
                    name: formData.name, 
                    phone: formData.phone || null 
                })
                .eq('id', customer_id);
                
        } else {
            const { data: newCustomer, error: custError } = await supabase
                .from('customers')
                .insert([{
                    name: formData.name,
                    email: formData.email,
                    phone: formData.phone || null,
                }])
                .select('id')
                .single();
            
            if (!custError && newCustomer) {
                customer_id = newCustomer.id;
            }
        }
    }

    // Insert Appointment
    // Allowed services: 'pvc-vloeren', 'traprenovatie', 'vloerbedekking', 'raamdecoratie', 'gordijnen', 'anders'
    // Allowed sources: 'chatbot', 'handmatig'
    const { data, error } = await supabase
        .from('appointments')
        .insert([{
            customer_id: customer_id,
            date: formData.date,
            service: 'anders', // Default for general showroom visit
            status: 'nieuw',
            notes: formData.message || '',
            source: 'handmatig' // 'website' is not an allowed enum value
        }]);

    if (error) {
        console.error('Error submitting appointment:', error);
        throw new Error(`Failed to submit appointment: ${error.message}`);
    }

    return { success: true };
}
