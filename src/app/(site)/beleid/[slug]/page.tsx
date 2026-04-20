import React from 'react'
import { notFound } from 'next/navigation'
import { getDynamicPolicies } from '@/lib/site-data'
import { Calendar } from 'lucide-react'

// This generates static routes at build time for better SEO & performance
export async function generateStaticParams() {
    const policies = await getDynamicPolicies()
    return policies.map((policy) => ({
        slug: policy.id,
    }))
}

export const revalidate = 3600 // Revalidate every hour

export default async function BeleidPage(props: {
    params: Promise<{ slug: string }>
}) {
    const params = await props.params
    const policies = await getDynamicPolicies()
    const policy = policies.find(p => p.id === params.slug)

    if (!policy) {
        notFound()
    }

    const lastUpdated = new Date(policy.lastUpdated).toLocaleDateString('nl-NL', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    })

    return (
        <div className="bg-white min-h-screen pt-32 pb-24">
            <div className="max-w-4xl mx-auto px-6 sm:px-8 lg:px-12">
                {/* Header */}
                <div className="mb-12 border-b border-gray-100 pb-8">
                    <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 tracking-tight mb-4">
                        {policy.title}
                    </h1>
                    <div className="flex items-center gap-2 text-gray-500 text-sm font-medium mt-6">
                        <Calendar className="w-4 h-4" />
                        <span>Laatst gewijzigd: {lastUpdated}</span>
                    </div>
                </div>

                {/* Content */}
                <div 
                    className="prose prose-lg prose-gray max-w-none prose-headings:font-extrabold prose-headings:text-gray-900 prose-a:text-brand-primary hover:prose-a:text-brand-secondary prose-strong:text-gray-900"
                    dangerouslySetInnerHTML={{ __html: policy.content }}
                />
            </div>
        </div>
    )
}
