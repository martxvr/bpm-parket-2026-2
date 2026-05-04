'use client';

import { useActionState } from 'react';
import Link from 'next/link';
import { requestResetAction, type ResetState } from './actions';

const initialState: ResetState = {};

export default function PasswordResetPage() {
  const [state, formAction, pending] = useActionState(requestResetAction, initialState);

  return (
    <div className="min-h-screen flex items-center justify-center bg-[var(--color-brand-cream)] px-6">
      <form
        action={formAction}
        className="w-full max-w-sm space-y-4 rounded-2xl bg-white p-8 shadow-sm"
      >
        <h1 className="text-2xl font-semibold">Wachtwoord vergeten</h1>
        <p className="text-sm text-black/60">
          Vul je email in. We sturen je een link om je wachtwoord opnieuw in te stellen.
        </p>

        {state.success ? (
          <p className="text-sm text-green-700">
            Als dit emailadres bekend is bij ons, ontvang je binnen enkele minuten een
            reset-link.
          </p>
        ) : (
          <>
            <label className="block">
              <span className="text-sm font-medium">Email</span>
              <input
                type="email"
                name="email"
                required
                autoComplete="email"
                className="mt-1 w-full rounded-lg border border-black/10 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-brand-primary)]"
              />
            </label>

            {state.error && (
              <p role="alert" className="text-sm text-red-700">
                {state.error}
              </p>
            )}

            <button
              type="submit"
              disabled={pending}
              className="w-full rounded-lg bg-[var(--color-brand-primary)] px-4 py-2.5 text-sm font-medium text-white disabled:opacity-50"
            >
              {pending ? 'Bezig…' : 'Stuur reset-link'}
            </button>
          </>
        )}

        <p className="text-center text-sm">
          <Link href="/login" className="text-black/60 hover:text-black">
            Terug naar inloggen
          </Link>
        </p>
      </form>
    </div>
  );
}
