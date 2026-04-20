import { createClient } from '@/lib/supabase/server'
import { notFound } from 'next/navigation'
import ActievloerForm from '../ActievloerForm'

export default async function EditActievloerPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params
    const supabase = await createClient()
    const { data, error } = await supabase
        .from('actievloeren')
        .select('*')
        .eq('id', id)
        .single()

    if (error || !data) return notFound()

    return <ActievloerForm data={data} />
}
