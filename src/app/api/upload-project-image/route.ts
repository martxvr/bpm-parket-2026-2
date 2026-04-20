import { NextResponse } from 'next/server'
import { requireAuth } from '@/lib/supabase/require-auth'
import sharp from 'sharp'

export async function POST(req: Request) {
    const { supabase } = await requireAuth()
    const formData = await req.formData()
    const file = formData.get('file') as File | null
    if (!file) return NextResponse.json({ error: 'No file' }, { status: 400 })

    const buffer = Buffer.from(await file.arrayBuffer())
    const webp = await sharp(buffer).webp({ quality: 85 }).toBuffer()

    const filename = `projects/${Date.now()}-${Math.random().toString(36).slice(2, 8)}.webp`
    const { error } = await supabase.storage.from('media').upload(filename, webp, {
        contentType: 'image/webp',
    })
    if (error) return NextResponse.json({ error: error.message }, { status: 500 })

    const { data: { publicUrl } } = supabase.storage.from('media').getPublicUrl(filename)
    return NextResponse.json({ url: publicUrl })
}
