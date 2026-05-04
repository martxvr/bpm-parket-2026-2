import type { ReactNode } from 'react';

type Props = {
  label: string;
  htmlFor?: string;
  error?: string;
  hint?: string;
  children: ReactNode;
};

export function FormField({ label, htmlFor, error, hint, children }: Props) {
  return (
    <label htmlFor={htmlFor} className="block">
      <span className="text-sm font-medium">{label}</span>
      <div className="mt-1">{children}</div>
      {hint && !error && <p className="mt-1 text-xs text-black/50">{hint}</p>}
      {error && (
        <p className="mt-1 text-xs text-red-700" role="alert">
          {error}
        </p>
      )}
    </label>
  );
}
