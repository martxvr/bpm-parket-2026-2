'use client';

import { useActionState } from 'react';
import {
  updateSettingsAction,
  type SettingsState,
} from '@/app/(admin)/admin/instellingen/actions';
import { FormField } from '@/components/admin/FormField';
import type { AdminSettings } from '@/lib/db/admin-settings';

const initialState: SettingsState = { status: 'idle' };

export function SettingsForm({ settings }: { settings: AdminSettings }) {
  const [state, formAction, pending] = useActionState(
    updateSettingsAction,
    initialState,
  );
  const errMsg = state.status === 'error' ? state.message : undefined;

  return (
    <form
      action={formAction}
      className="space-y-4 rounded-2xl bg-white p-6 shadow-sm"
    >
      <label className="flex items-center gap-3">
        <input
          type="checkbox"
          name="chatbot_enabled"
          defaultChecked={settings.chatbot_enabled}
        />
        <div>
          <span className="font-medium">Chatbot ingeschakeld</span>
          <p className="text-xs text-black/60">
            Toont de chat-widget rechtsonder op de site.
          </p>
        </div>
      </label>

      <FormField
        label="Extra chatbot instructies"
        hint="Wordt toegevoegd aan de system prompt — bijvoorbeeld vakantie-melding"
        error={errMsg}
      >
        <textarea
          name="system_prompt_extra"
          defaultValue={settings.system_prompt_extra ?? ''}
          maxLength={2000}
          rows={4}
          className="w-full rounded-lg border border-black/10 px-3 py-2 text-sm"
        />
      </FormField>

      <FormField
        label="Telefoon override"
        hint="Optioneel — overschrijft het standaard telefoonnummer"
      >
        <input
          type="text"
          name="phone"
          defaultValue={settings.phone ?? ''}
          className="w-full rounded-lg border border-black/10 px-3 py-2 text-sm"
        />
      </FormField>

      <FormField label="WhatsApp">
        <input
          type="text"
          name="whatsapp"
          defaultValue={settings.whatsapp ?? ''}
          className="w-full rounded-lg border border-black/10 px-3 py-2 text-sm"
        />
      </FormField>

      <div className="flex items-center gap-3">
        <button
          type="submit"
          disabled={pending}
          className="rounded-lg bg-[var(--color-brand-red)] text-white px-5 py-2 text-sm font-medium disabled:opacity-50"
        >
          {pending ? 'Opslaan…' : 'Opslaan'}
        </button>
        {state.status === 'success' && (
          <span className="text-sm text-green-700">✓ Opgeslagen</span>
        )}
      </div>
    </form>
  );
}
