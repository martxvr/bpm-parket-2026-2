import type { Metadata } from 'next';
import Link from 'next/link';
import { createClient } from '@/lib/supabase/server';
import { StatusBadge } from '@/components/admin/StatusBadge';

export const metadata: Metadata = { title: 'Leads' };

type Lead = {
  id: string;
  name: string;
  email: string;
  phone: string;
  floor_type: string | null;
  source: string | null;
  status: string;
  created_at: string;
};

async function getLeads(): Promise<Lead[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from('leads')
    .select('id,name,email,phone,floor_type,source,status,created_at')
    .order('created_at', { ascending: false })
    .limit(100);
  if (error) throw error;
  return data ?? [];
}

export default async function LeadsPage() {
  const leads = await getLeads();

  return (
    <div>
      <header className="mb-6">
        <h1 className="text-2xl font-semibold">Leads</h1>
        <p className="text-sm text-black/60">Recente aanvragen via formulieren.</p>
      </header>

      {leads.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-black/10 p-12 text-center text-sm text-black/60">
          Nog geen leads binnen.
        </div>
      ) : (
        <div className="rounded-2xl bg-white shadow-sm overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-black/[0.02] text-xs uppercase tracking-wider text-black/50">
              <tr>
                <th className="text-left px-4 py-3">Naam</th>
                <th className="text-left px-4 py-3">Contact</th>
                <th className="text-left px-4 py-3">Type</th>
                <th className="text-left px-4 py-3">Source</th>
                <th className="text-left px-4 py-3">Status</th>
                <th className="text-left px-4 py-3">Datum</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-black/5">
              {leads.map((l) => (
                <tr key={l.id} className="hover:bg-black/[0.02]">
                  <td className="px-4 py-3 font-medium">
                    <Link href={`/admin/leads/${l.id}`} className="hover:underline">
                      {l.name}
                    </Link>
                  </td>
                  <td className="px-4 py-3 text-black/70">
                    <a href={`mailto:${l.email}`} className="block hover:underline">
                      {l.email}
                    </a>
                    <a
                      href={`tel:${l.phone.replace(/\s/g, '')}`}
                      className="block text-xs text-black/50"
                    >
                      {l.phone}
                    </a>
                  </td>
                  <td className="px-4 py-3 text-black/70">{l.floor_type ?? '—'}</td>
                  <td className="px-4 py-3 text-xs text-black/50">{l.source ?? '—'}</td>
                  <td className="px-4 py-3">
                    <StatusBadge status={l.status} />
                  </td>
                  <td className="px-4 py-3 text-xs text-black/50">
                    {new Date(l.created_at).toLocaleDateString('nl-NL', {
                      day: 'numeric',
                      month: 'short',
                      year: 'numeric',
                    })}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
