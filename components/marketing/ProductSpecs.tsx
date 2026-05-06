type Props = {
  specs: Record<string, string>;
};

export function ProductSpecs({ specs }: Props) {
  const entries = Object.entries(specs);
  if (entries.length === 0) return null;
  return (
    <dl className="rounded-2xl bg-white p-6 shadow-sm divide-y divide-black/5">
      {entries.map(([key, value]) => (
        <div key={key} className="flex justify-between py-3 text-sm gap-4">
          <dt className="text-black/60">{key}</dt>
          <dd className="font-medium text-right">{value}</dd>
        </div>
      ))}
    </dl>
  );
}
