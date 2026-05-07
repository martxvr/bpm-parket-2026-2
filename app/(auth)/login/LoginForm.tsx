'use client';

import { useActionState } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { loginAction, type LoginState } from './actions';

const initialState: LoginState = {};

export function LoginForm() {
  const searchParams = useSearchParams();
  const redirectedFrom = searchParams.get('redirectedFrom') || '/admin';
  const [state, formAction, pending] = useActionState(loginAction, initialState);

  return (
    <div className="min-h-screen flex items-center justify-center bg-[var(--color-brand-light)] px-6">
      <form
        action={formAction}
        className="w-full max-w-sm space-y-4 rounded-2xl bg-white p-8 shadow-sm"
      >
        <h1 className="text-2xl font-semibold">Inloggen</h1>
        <p className="text-sm text-black/60">Admin paneel BPM Parket</p>

        <input type="hidden" name="redirectTo" value={redirectedFrom} />

        <label className="block">
          <span className="text-sm font-medium">Email</span>
          <input
            type="email"
            name="email"
            required
            autoComplete="email"
            className="mt-1 w-full rounded-lg border border-black/10 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-brand-red)]"
          />
        </label>

        <label className="block">
          <span className="text-sm font-medium">Wachtwoord</span>
          <input
            type="password"
            name="password"
            required
            autoComplete="current-password"
            className="mt-1 w-full rounded-lg border border-black/10 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-brand-red)]"
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
          className="w-full rounded-lg bg-[var(--color-brand-red)] px-4 py-2.5 text-sm font-medium text-white disabled:opacity-50"
        >
          {pending ? 'Bezig…' : 'Inloggen'}
        </button>

        <p className="text-center text-sm">
          <Link href="/wachtwoord-reset" className="text-black/60 hover:text-black">
            Wachtwoord vergeten?
          </Link>
        </p>
      </form>
    </div>
  );
}
