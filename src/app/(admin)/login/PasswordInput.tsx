'use client'

import { useState } from 'react'
import EyeIcon from '@/components/ui/eye-icon'
import EyeOffIcon from '@/components/ui/eye-off-icon'

export default function PasswordInput({ autoComplete }: { autoComplete?: string }) {
    const [visible, setVisible] = useState(false)

    return (
        <div className="relative group">
            <input
                id="password"
                name="password"
                type={visible ? 'text' : 'password'}
                autoComplete={autoComplete ?? 'current-password'}
                required
                className="w-full px-6 py-4 bg-gray-50 border border-gray-100 rounded-2xl focus:ring-4 focus:ring-brand-primary/10 focus:border-brand-primary focus:bg-white transition-all outline-none font-bold text-gray-900 pr-12 group-hover:border-gray-200"
                placeholder="••••••••"
            />
            <button
                type="button"
                onClick={() => setVisible(v => !v)}
                className="absolute right-5 top-1/2 -translate-y-1/2 text-gray-300 hover:text-brand-primary transition-colors"
                aria-label={visible ? 'Wachtwoord verbergen' : 'Wachtwoord tonen'}
            >
                {visible ? <EyeOffIcon size={20} /> : <EyeIcon size={20} />}
            </button>
        </div>
    )
}
