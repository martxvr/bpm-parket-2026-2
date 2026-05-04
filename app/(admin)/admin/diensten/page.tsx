import type { Metadata } from 'next';
import Link from 'next/link';
import { ChevronRight } from 'lucide-react';
import { getServices } from '@/lib/db/services';

export const metadata: Metadata = { title: 'Diensten' };

export default async function ServicesListPage() {
  const services = await getServices();

  return (
    <div>
      <h1 className="text-2xl font-semibold">Diensten</h1>
      <p className="text-sm text-black/60 mt-1">
        Bewerk de service-pagina&apos;s op de site.
      </p>

      <ul className="mt-6 space-y-2">
        {services.map((s) => (
          <li key={s.id}>
            <Link
              href={`/admin/diensten/${s.slug}`}
              className="flex items-center justify-between rounded-2xl bg-white p-5 shadow-sm hover:shadow-md transition"
            >
              <div>
                <h3 className="font-medium">{s.title}</h3>
                <p className="text-xs text-black/50 mt-0.5">/{s.slug}</p>
              </div>
              <ChevronRight className="h-5 w-5 text-black/30" />
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
