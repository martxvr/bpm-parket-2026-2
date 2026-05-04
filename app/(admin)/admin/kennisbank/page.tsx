import type { Metadata } from 'next';
import Link from 'next/link';
import { Plus } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { createClient } from '@/lib/supabase/server';
import { DeleteButton } from '@/components/admin/DeleteButton';
import { deleteKnowledgeAction } from './actions';

export const metadata: Metadata = { title: 'Kennisbank' };

export default async function KnowledgeListPage() {
  const supabase = await createClient();
  const { data: items } = await supabase.from('knowledge').select('*').order('topic');

  const list = items ?? [];

  return (
    <div>
      <header className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-semibold">Kennisbank</h1>
          <p className="text-sm text-black/60 mt-1">
            Inhoud die de chatbot gebruikt om vragen te beantwoorden.
          </p>
        </div>
        <Button href="/admin/kennisbank/nieuw" size="sm">
          <Plus className="h-4 w-4" /> Nieuw item
        </Button>
      </header>

      {list.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-black/10 p-12 text-center text-sm text-black/60">
          Nog geen items. Voeg er eentje toe om de chatbot te trainen.
        </div>
      ) : (
        <ul className="space-y-3">
          {list.map((k) => (
            <li
              key={k.id}
              className="rounded-2xl bg-white p-5 shadow-sm flex items-start justify-between gap-4"
            >
              <Link href={`/admin/kennisbank/${k.id}`} className="flex-1 min-w-0">
                <h3 className="font-medium">{k.topic}</h3>
                <p className="mt-1 text-sm text-black/60 line-clamp-2">
                  {k.content}
                </p>
              </Link>
              <DeleteButton
                action={async () => {
                  'use server';
                  await deleteKnowledgeAction(k.id);
                }}
                confirmMessage={`Item "${k.topic}" verwijderen?`}
              />
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
