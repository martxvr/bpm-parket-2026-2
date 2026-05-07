'use client';

import { useActionState } from 'react';
import { updatePasswordAction, type UpdateState } from './actions';

const initialState: UpdateState = {};

export default function PasswordResetConfirmPage() {
  const [state, formAction, pending] = useActionState(
    updatePasswordAction,
    initialState,
  );

  return (
    <div className="min-h-screen flex items-center justify-center bg-[var(--color-brand-light)] px-6">
      <form
        action={formAction}
        className="w-full max-w-sm space-y-4 rounded-2xl bg-white p-8 shadow-sm"
      >
        <h1 className="text-2xl font-semibold">Nieuw wachtwoord</h1>
        <p className="text-sm text-black/60">
          Kies een sterk wachtwoord van minimaal 12 tekens.
        </p>

        <label className="block">
          <span className="text-sm font-medium">Nieuw wachtwoord</span>
          <input
            type="password"
            name="password"
            required
            minLength={12}
            autoComplete="new-password"
            className="mt-1 w-full rounded-lg border border-black/10 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-brand-red)]"
          />
        </label>

        <label className="block">
          <span className="text-sm font-medium">Bevestig wachtwoord</span>
          <input
            type="password"
            name="passwordConfirm"
            required
            minLength={12}
            autoComplete="new-password"
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
          {pending ? 'Bezig…' : 'Wachtwoord opslaan'}
        </button>
      </form>
    </div>
  );
}
