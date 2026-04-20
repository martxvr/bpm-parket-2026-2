"use client"

import React, { useState, useEffect } from 'react'
import { companyConfig } from '@/config'

export default function SitePasswordGate({
    children,
    backgroundImage,
}: {
    children: React.ReactNode
    backgroundImage?: string
}) {
    const [unlocked, setUnlocked] = useState<boolean | null>(null)
    const [password, setPassword] = useState('')
    const [error, setError] = useState(false)
    const [loading, setLoading] = useState(false)

    useEffect(() => {
        const stored = sessionStorage.getItem('site_unlocked')
        setUnlocked(stored === 'true')
    }, [])

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)
        setError(false)

        const res = await fetch('/api/site-password', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ password }),
        })

        if (res.ok) {
            sessionStorage.setItem('site_unlocked', 'true')
            setUnlocked(true)
        } else {
            setError(true)
        }
        setLoading(false)
    }

    // Still loading initial state
    if (unlocked === null) {
        return (
            <div className="min-h-screen bg-brand-dark flex items-center justify-center">
                <div className="w-8 h-8 border-2 border-white/20 border-t-white rounded-full animate-spin" />
            </div>
        )
    }

    if (unlocked) return <>{children}</>

    return (
        <div className="min-h-screen relative flex items-center justify-center p-6">
            {/* Background image */}
            {backgroundImage && (
                <div className="absolute inset-0">
                    <img
                        src={backgroundImage}
                        alt=""
                        className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />
                </div>
            )}
            {!backgroundImage && <div className="absolute inset-0 bg-brand-dark" />}

            <div className="relative z-10 w-full max-w-md">
                <div className="bg-white/10 backdrop-blur-2xl border border-white/20 rounded-3xl p-10 lg:p-12 shadow-2xl space-y-8">
                    {/* Logo */}
                    <div className="text-center space-y-4">
                        <div className="inline-flex items-center justify-center">
                            <img src="/logo.png" alt={companyConfig.name} className="h-14 w-auto object-contain drop-shadow-lg" />
                        </div>
                        <div>
                            <h1 className="text-2xl font-bold text-white tracking-tight">
                                Binnenkort beschikbaar
                            </h1>
                            <p className="text-white/50 text-sm mt-2">
                                Voer het wachtwoord in om de website te bekijken.
                            </p>
                        </div>
                    </div>

                    {/* Form */}
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="space-y-2">
                            <input
                                type="password"
                                value={password}
                                onChange={e => { setPassword(e.target.value); setError(false) }}
                                placeholder="Wachtwoord"
                                required
                                autoFocus
                                className={`w-full px-5 py-4 bg-white/10 border rounded-xl text-white placeholder-white/30 focus:outline-none focus:ring-2 focus:ring-brand-primary/50 focus:border-brand-primary transition-all text-sm font-medium ${
                                    error ? 'border-red-400 ring-2 ring-red-400/20' : 'border-white/20'
                                }`}
                            />
                            {error && (
                                <p className="text-red-300 text-xs font-bold pl-1">
                                    Onjuist wachtwoord. Probeer het opnieuw.
                                </p>
                            )}
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full py-4 bg-brand-primary text-white rounded-xl font-bold text-sm shadow-lg shadow-brand-primary/30 hover:bg-brand-secondary transition-all disabled:opacity-50"
                        >
                            {loading ? 'Controleren...' : 'Toegang'}
                        </button>
                    </form>
                </div>

                <p className="text-center text-white/20 text-xs mt-6 font-medium">
                    {companyConfig.name}
                </p>
            </div>
        </div>
    )
}
