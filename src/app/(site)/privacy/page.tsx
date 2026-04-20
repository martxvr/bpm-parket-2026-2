"use client"

import React from 'react';
import { useParams } from 'next/navigation';
import { Policy } from '@/types';

export default function PrivacyPage() {
    const params = useParams();
    const policies: Policy[] = [
        { id: '1', title: 'Privacyverklaring', content: 'Dit is de privacyverklaring...', lastUpdated: '10 Maart 2024' },
        { id: '2', title: 'Algemene Voorwaarden', content: 'Dit zijn de algemene voorwaarden...', lastUpdated: '10 Maart 2024' }
    ];

    const policyId = params?.id as string | undefined;
    const policy = policyId ? policies.find(p => p.id === policyId) : policies[0];

    if (!policies.length) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brand-primary"></div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-white py-24">
            <div className="max-w-3xl mx-auto px-6">
                <h1 className="text-4xl font-bold text-brand-dark mb-4">{policy?.title || 'Privacybeleid'}</h1>
                <p className="text-sm text-gray-400 mb-12">Laatst bijgewerkt: {policy?.lastUpdated}</p>
                <div className="prose prose-gray max-w-none">
                    <p className="text-gray-600 leading-relaxed">{policy?.content}</p>
                </div>
            </div>
        </div>
    );
}
