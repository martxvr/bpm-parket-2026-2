import { notFound } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { createClient } from '@/lib/supabase/server';
import { StatusBadge } from '@/components/admin/StatusBadge';
import { DeleteButton } from '@/components/admin/DeleteButton';
import {
  updateAppointmentStatusAction,
  deleteAppointmentAction,
} from './actions';

type Props = { params: Promise<{ id: string }> };

export default async function AppointmentDetailPage({ params }: Props) {
  const { id } = await params;
  const supabase = await createClient();
  const { data: appointment } = await supabase
    .from('appointments')
    .select('*')
    .eq('id', id)
    .maybeSingle();
  if (!appointment) notFound();

  return (
    <div>
      <Link
        href="/admin/afspraken"
        className="inline-flex items-center gap-2 text-sm text-black/60 hover:text-black mb-4"
      >
        <ArrowLeft className="h-4 w-4" />
        Alle afspraken
      </Link>

      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-semibold">{appointment.customer_name}</h1>
          <p className="text-sm text-black/60 mt-1">
            {new Date(appointment.date).toLocaleString('nl-NL', {
              weekday: 'long',
              day: 'numeric',
              month: 'long',
              year: 'numeric',
              hour: '2-digit',
              minute: '2-digit',
            })}
          </p>
        </div>
        <StatusBadge status={appointment.status} />
      </div>

      <div className="mt-8 grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 rounded-2xl bg-white p-6 shadow-sm">
          <h2 className="font-semibold mb-3">Details</h2>
          <dl className="text-sm space-y-2">
            <div>
              <dt className="text-black/50 text-xs">Email</dt>
              <dd>
                <a
                  href={`mailto:${appointment.customer_email}`}
                  className="hover:underline"
                >
                  {appointment.customer_email}
                </a>
              </dd>
            </div>
            {appointment.customer_phone && (
              <div>
                <dt className="text-black/50 text-xs">Telefoon</dt>
                <dd>{appointment.customer_phone}</dd>
              </div>
            )}
            {appointment.notes && (
              <div>
                <dt className="text-black/50 text-xs">Notities</dt>
                <dd className="whitespace-pre-line">{appointment.notes}</dd>
              </div>
            )}
            <div>
              <dt className="text-black/50 text-xs">Source</dt>
              <dd>{appointment.source}</dd>
            </div>
          </dl>
        </div>

        <aside className="space-y-4">
          <form
            action={updateAppointmentStatusAction}
            className="rounded-2xl bg-white p-6 shadow-sm space-y-3"
          >
            <h2 className="font-semibold">Status wijzigen</h2>
            <input type="hidden" name="id" value={appointment.id} />
            <select
              name="status"
              defaultValue={appointment.status}
              className="w-full rounded-lg border border-black/10 px-3 py-2 text-sm bg-white"
            >
              <option value="pending">Open</option>
              <option value="confirmed">Bevestigd</option>
              <option value="cancelled">Geannuleerd</option>
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
                await deleteAppointmentAction(appointment.id);
              }}
              confirmMessage="Afspraak permanent verwijderen?"
            />
          </div>
        </aside>
      </div>
    </div>
  );
}
