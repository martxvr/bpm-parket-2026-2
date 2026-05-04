'use client';

import { useState } from 'react';
import { Trash2 } from 'lucide-react';

type Props = {
  action: () => Promise<void>;
  confirmMessage?: string;
  size?: 'sm' | 'md';
};

export function DeleteButton({
  action,
  confirmMessage = 'Weet je het zeker?',
  size = 'sm',
}: Props) {
  const [pending, setPending] = useState(false);

  return (
    <button
      type="button"
      disabled={pending}
      onClick={async () => {
        if (!confirm(confirmMessage)) return;
        setPending(true);
        try {
          await action();
        } finally {
          setPending(false);
        }
      }}
      className="inline-flex items-center gap-1 text-red-700 hover:text-red-900 disabled:opacity-50"
      aria-label="Verwijderen"
    >
      <Trash2 className={size === 'sm' ? 'h-4 w-4' : 'h-5 w-5'} />
    </button>
  );
}
