'use client';

import { useActionState } from 'react';
import {
  upsertKnowledgeAction,
  type KnowledgeState,
} from '@/app/(admin)/admin/kennisbank/actions';
import { FormField } from '@/components/admin/FormField';

const initialState: KnowledgeState = { status: 'idle' };

type Props = {
  item?: { id: string; topic: string; content: string };
};

export function KnowledgeForm({ item }: Props) {
  const [state, formAction, pending] = useActionState(
    upsertKnowledgeAction,
    initialState,
  );
  const errMsg = state.status === 'error' ? state.message : undefined;

  return (
    <form
      action={formAction}
      className="space-y-4 rounded-2xl bg-white p-6 shadow-sm"
    >
      {item && <input type="hidden" name="id" value={item.id} />}

      <FormField
        label="Onderwerp"
        hint="Bijv. 'Openingstijden' of 'Levertijden'"
        error={errMsg}
      >
        <input
          type="text"
          name="topic"
          defaultValue={item?.topic}
          required
          maxLength={200}
          className="w-full rounded-lg border border-black/10 px-3 py-2 text-sm"
        />
      </FormField>

      <FormField label="Inhoud" hint="Wat moet de chatbot vertellen?">
        <textarea
          name="content"
          defaultValue={item?.content}
          required
          maxLength={5000}
          rows={8}
          className="w-full rounded-lg border border-black/10 px-3 py-2 text-sm"
        />
      </FormField>

      <button
        type="submit"
        disabled={pending}
        className="rounded-lg bg-[var(--color-brand-primary)] text-white px-5 py-2 text-sm font-medium disabled:opacity-50"
      >
        {pending ? 'Opslaan…' : 'Opslaan'}
      </button>
    </form>
  );
}
