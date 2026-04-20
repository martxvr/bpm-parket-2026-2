import { NextResponse } from 'next/server'
import { getSitePassword } from '@/lib/site-data'

export async function POST(req: Request) {
    const { password } = await req.json()
    const settings = await getSitePassword()

    if (!settings?.enabled || !settings?.password) {
        return NextResponse.json({ ok: true })
    }

    if (password === settings.password) {
        return NextResponse.json({ ok: true })
    }

    return NextResponse.json({ error: 'Incorrect password' }, { status: 401 })
}
