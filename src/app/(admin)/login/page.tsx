import { login, registerFirstAdmin } from './actions'
import { companyConfig } from '@/config'
import { createClient } from '@/lib/supabase/server'
import MailFilledIcon from '@/components/ui/mail-filled-icon'
import TriangleAlertIcon from '@/components/ui/triangle-alert-icon'
import ShieldCheck from '@/components/ui/shield-check'
import PasswordInput from './PasswordInput'

export default async function LoginPage({
    searchParams,
}: {
    searchParams: { error?: string }
}) {
    const supabase = await createClient()
    const { data: hasNoUsers } = await supabase.rpc('has_no_users')

    return (
        <div className="min-h-screen bg-[#FDFCFB] flex items-center justify-center p-6 lg:p-12 relative overflow-hidden">
            {/* Animated Background Elements */}
            <div className="absolute top-0 -left-20 w-80 h-80 bg-brand-primary/10 rounded-full blur-3xl animate-pulse" />
            <div className="absolute bottom-0 -right-20 w-80 h-80 bg-brand-secondary/10 rounded-full blur-3xl animate-pulse delay-700" />

            <div className="w-full max-w-xl animate-fade-in relative z-10">
                <div className="bg-white/70 backdrop-blur-2xl border border-white p-10 lg:p-16 rounded-2xl shadow-2xl shadow-gray-200/50 space-y-10">
                    {/* Header Section */}
                    <div className="text-center space-y-4">
                        <div className="inline-flex items-center justify-center mb-4 animate-slide-up">
                            <img src="/logo.png" alt={companyConfig.name} className="h-16 w-auto object-contain" />
                        </div>
                        <h1 className="text-4xl font-black text-gray-900 tracking-tight animate-slide-up delay-100">
                            {hasNoUsers ? 'Welkom bij de toekomst' : 'Beheerderspaneel'}
                        </h1>
                        <p className="text-gray-500 text-lg font-medium animate-slide-up delay-200">
                            {hasNoUsers ? 'Maak je eerste admin account aan.' : `Login bij ${companyConfig.name}`}
                        </p>
                    </div>

                    {hasNoUsers && (
                        <div className="p-6 bg-brand-primary/5 rounded-2xl border border-brand-primary/10 flex gap-4 animate-slide-up delay-300">
                            <ShieldCheck size={24} className="text-brand-primary shrink-0" />
                            <p className="text-sm font-bold text-brand-primary/80 leading-relaxed italic">
                                Er zijn nog geen beheerders gevonden. Je staat op het punt de eerste eigenaar te worden van dit platform.
                            </p>
                        </div>
                    )}

                    {/* Form Section */}
                    <form className="space-y-8 animate-slide-up delay-400" action={hasNoUsers ? registerFirstAdmin : login}>
                        <div className="space-y-6">
                            <div className="space-y-3">
                                <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest ml-1">E-mailadres</label>
                                <div className="relative group">
                                    <input
                                        id="email"
                                        name="email"
                                        type="email"
                                        autoComplete="email"
                                        required
                                        className="w-full px-6 py-4 bg-gray-50 border border-gray-100 rounded-2xl focus:ring-4 focus:ring-brand-primary/10 focus:border-brand-primary focus:bg-white transition-all outline-none font-bold text-gray-900 pr-12 group-hover:border-gray-200"
                                        placeholder="beheerder@voorbeeld.nl"
                                    />
                                    <MailFilledIcon className="absolute right-5 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-300 group-hover:text-brand-primary transition-colors" />
                                </div>
                            </div>

                            <div className="space-y-3">
                                <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest ml-1">Wachtwoord</label>
                                <PasswordInput autoComplete={hasNoUsers ? 'new-password' : 'current-password'} />
                            </div>
                        </div>

                        {searchParams.error && (
                            <div className="p-5 bg-red-50 text-red-600 text-sm font-bold rounded-2xl border border-red-100 flex items-center gap-3 animate-shake">
                                <TriangleAlertIcon size={20} />
                                {searchParams.error}
                            </div>
                        )}

                        <button
                            type="submit"
                            className="w-full py-5 bg-brand-primary text-white rounded-2xl font-black text-lg shadow-xl shadow-brand-primary/30 hover:scale-[1.02] active:scale-[0.98] transition-all hover:bg-brand-secondary"
                        >
                            {hasNoUsers ? 'Account Initialiseren' : 'Inloggen'}
                        </button>
                    </form>

                    <div className="pt-6 text-center">
                        <p className="text-gray-400 text-xs font-bold uppercase tracking-[0.2em]">
                            Beveiligd door Supabase & AES-256
                        </p>
                    </div>
                </div>
            </div>
        </div>
    )
}
