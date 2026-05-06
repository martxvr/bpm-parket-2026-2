import { notFound } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { createClient } from '@/lib/supabase/server';
import { StatusBadge } from '@/components/admin/StatusBadge';
import { DeleteButton } from '@/components/admin/DeleteButton';
import { updateLeadStatusAction, deleteLeadAction } from './actions';

type Props = { params: Promise<{ id: string }> };

export default async function LeadDetailPage({ params }: Props) {
  const { id } = await params;
  const supabase = await createClient();
  const { data: lead } = await supabase
    .from('leads')
    .select('*, brand:brands(slug, name), product:products(slug, name)')
    .eq('id', id)
    .maybeSingle();
  if (!lead) notFound();

  return (
    <div>
      <Link
        href="/admin/leads"
        className="inline-flex items-center gap-2 text-sm text-black/60 hover:text-black mb-4"
      >
        <ArrowLeft className="h-4 w-4" />
        Alle leads
      </Link>

      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-semibold">{lead.name}</h1>
          <p className="text-sm text-black/60 mt-1">
            Binnen via {lead.source ?? 'onbekend'} op{' '}
            {new Date(lead.created_at).toLocaleString('nl-NL')}
          </p>
        </div>
        <StatusBadge status={lead.status} />
      </div>

      <div className="mt-8 grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <section className="rounded-2xl bg-white p-6 shadow-sm">
            <h2 className="font-semibold mb-3">Contact</h2>
            <dl className="text-sm space-y-2">
              <div>
                <dt className="text-black/50 text-xs">Email</dt>
                <dd>
                  <a href={`mailto:${lead.email}`} className="hover:underline">
                    {lead.email}
                  </a>
                </dd>
              </div>
              <div>
                <dt className="text-black/50 text-xs">Telefoon</dt>
                <dd>
                  <a
                    href={`tel:${lead.phone.replace(/\s/g, '')}`}
                    className="hover:underline"
                  >
                    {lead.phone}
                  </a>
                </dd>
              </div>
            </dl>
          </section>

          <section className="rounded-2xl bg-white p-6 shadow-sm">
            <h2 className="font-semibold mb-3">Aanvraag</h2>
            <dl className="text-sm space-y-2">
              {lead.floor_type && (
                <div>
                  <dt className="text-black/50 text-xs">Type vloer</dt>
                  <dd>{lead.floor_type}</dd>
                </div>
              )}
              {lead.area_size != null && (
                <div>
                  <dt className="text-black/50 text-xs">Oppervlak</dt>
                  <dd>{lead.area_size} m²</dd>
                </div>
              )}
              {lead.message && (
                <div>
                  <dt className="text-black/50 text-xs">Bericht</dt>
                  <dd className="whitespace-pre-line">{lead.message}</dd>
                </div>
              )}
              {lead.brand && (
                <div>
                  <dt className="text-black/50 text-xs">Merkvoorkeur</dt>
                  <dd>
                    <Link
                      href={`/admin/merken/${lead.brand_id}`}
                      className="hover:underline"
                    >
                      {(Array.isArray(lead.brand) ? lead.brand[0] : lead.brand)?.name}
                    </Link>
                  </dd>
                </div>
              )}
              {lead.product && lead.brand && (
                <div>
                  <dt className="text-black/50 text-xs">Product-lijn</dt>
                  <dd>
                    <Link
                      href={`/admin/merken/${lead.brand_id}/producten/${lead.product_id}`}
                      className="hover:underline"
                    >
                      {(Array.isArray(lead.product) ? lead.product[0] : lead.product)?.name}
                    </Link>
                  </dd>
                </div>
              )}
            </dl>
          </section>
        </div>

        <aside className="space-y-4">
          <form
            action={updateLeadStatusAction}
            className="rounded-2xl bg-white p-6 shadow-sm space-y-3"
          >
            <h2 className="font-semibold">Status wijzigen</h2>
            <input type="hidden" name="id" value={lead.id} />
            <select
              name="status"
              defaultValue={lead.status}
              className="w-full rounded-lg border border-black/10 px-3 py-2 text-sm bg-white"
            >
              <option value="new">Nieuw</option>
              <option value="contacted">Gecontacteerd</option>
              <option value="completed">Afgerond</option>
            </select>
            <button
              type="submit"
              className="w-full rounded-lg bg-[var(--color-brand-primary)] text-white px-3 py-2 text-sm font-medium"
            >
              Opslaan
            </button>
          </form>

          <div className="rounded-2xl bg-white p-6 shadow-sm">
            <h2 className="font-semibold mb-3">Acties</h2>
            <DeleteButton
              action={async () => {
                'use server';
                await deleteLeadAction(lead.id);
              }}
              confirmMessage="Lead permanent verwijderen?"
            />
          </div>
        </aside>
      </div>
    </div>
  );
}
