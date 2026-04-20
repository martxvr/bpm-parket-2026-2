import React from 'react'
import Link from 'next/link'
import { getActievloeren } from '@/lib/admin-data'
import ActievloerenClient from './ActievloerenClient'

export default async function ActievloerenPage() {
    const actievloeren = await getActievloeren()

    return (
        <div className="space-y-10 animate-fade-in">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                <div className="animate-slide-up">
                    <h1 className="text-4xl font-extrabold text-gray-900 tracking-tight">
                        Actievloeren
                    </h1>
                    <p className="text-gray-500 mt-2 text-lg font-medium">Beheer de actievloeren met kortingen op de website</p>
                </div>
                <Link
                    href="/admin/actievloeren/nieuw"
                    className="bg-brand-primary text-white px-6 py-3 rounded-xl font-bold hover:bg-brand-secondary transition-colors text-sm"
                >
                    + Nieuwe actievloer
                </Link>
            </div>

            <ActievloerenClient initialData={actievloeren} />
        </div>
    )
}
