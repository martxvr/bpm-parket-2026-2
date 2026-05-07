import type { LucideIcon } from 'lucide-react';

type Props = {
  label: string;
  value: string | number;
  hint?: string;
  icon: LucideIcon;
};

export function StatCard({ label, value, hint, icon: Icon }: Props) {
  return (
    <div className="rounded-2xl bg-white p-5 shadow-sm">
      <div className="flex items-center justify-between">
        <span className="text-xs uppercase tracking-wider text-black/50">
          {label}
        </span>
        <Icon className="h-5 w-5 text-[var(--color-brand-red)]" />
      </div>
      <p className="mt-3 text-3xl font-semibold">{value}</p>
      {hint && <p className="mt-1 text-xs text-black/50">{hint}</p>}
    </div>
  );
}
