import { cn } from '@/lib/cn';

const COLORS: Record<string, string> = {
  new: 'bg-blue-50 text-blue-700 ring-blue-700/20',
  contacted: 'bg-amber-50 text-amber-700 ring-amber-700/20',
  completed: 'bg-green-50 text-green-700 ring-green-700/20',
  pending: 'bg-amber-50 text-amber-700 ring-amber-700/20',
  confirmed: 'bg-green-50 text-green-700 ring-green-700/20',
  cancelled: 'bg-red-50 text-red-700 ring-red-700/20',
};

const LABELS: Record<string, string> = {
  new: 'Nieuw',
  contacted: 'Gecontacteerd',
  completed: 'Afgerond',
  pending: 'Open',
  confirmed: 'Bevestigd',
  cancelled: 'Geannuleerd',
};

export function StatusBadge({ status }: { status: string }) {
  return (
    <span
      className={cn(
        'inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ring-1 ring-inset',
        COLORS[status] ?? 'bg-gray-50 text-gray-700 ring-gray-700/20',
      )}
    >
      {LABELS[status] ?? status}
    </span>
  );
}
