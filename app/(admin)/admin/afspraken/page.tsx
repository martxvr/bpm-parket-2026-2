import type { Metadata } from 'next';
import Link from 'next/link';
import { createClient } from '@/lib/supabase/server';
import { StatusBadge } from '@/components/admin/StatusBadge';

export const metadata: Metadata = { title: 'Afspraken' };

export default async function AppointmentsPage() {
  const supabase = await createClient();
  const { data: appointments } = await supabase
    .from('appointments')
    .select('id,customer_name,customer_email,date,source,status,notes')
    .order('date', { ascending: true })
    .limit(100);

  const list = appointments ?? [];

  return (
    <div>
      <h1 className="text-2xl font-semibold">Afspraken</h1>
      <p className="text-sm text-black/60 mt-1">Showroombezoeken en consults.</p>

      {list.length === 0 ? (
        <div className="mt-6 rounded-2xl border border-dashed border-black/10 p-12 text-center text-sm text-black/60">
          Nog geen afspraken.
        </div>
      ) : (
        <div className="mt-6 rounded-2xl bg-white shadow-sm overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-black/[0.02] text-xs uppercase tracking-wider text-black/50">
              <tr>
                <th className="text-left px-4 py-3">Wanneer</th>
                <th className="text-left px-4 py-3">Klant</th>
                <th className="text-left px-4 py-3">Source</th>
                <th className="text-left px-4 py-3">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-black/5">
              {list.map((a) => (
                <tr key={a.id} className="hover:bg-black/[0.02]">
                  <td className="px-4 py-3 font-medium">
                    <Link
                      href={`/admin/afspraken/${a.id}`}
                      className="hover:underline"
                    >
                      {new Date(a.date).toLocaleString('nl-NL', {
                        weekday: 'short',
                        day: 'numeric',
                        month: 'short',
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </Link>
                  </td>
                  <td className="px-4 py-3">
                    <div>{a.customer_name}</div>
                    <a
                      href={`mailto:${a.customer_email}`}
                      className="text-xs text-black/50 hover:underline"
                    >
                      {a.customer_email}
                    </a>
                  </td>
                  <td className="px-4 py-3 text-xs text-black/50">{a.source}</td>
                  <td className="px-4 py-3">
                    <StatusBadge status={a.status} />
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
