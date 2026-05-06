import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { BrandForm } from '@/components/admin/BrandForm';

export default function NewBrandPage() {
  return (
    <div>
      <Link
        href="/admin/merken"
        className="inline-flex items-center gap-2 text-sm text-black/60 hover:text-black mb-4"
      >
        <ArrowLeft className="h-4 w-4" />
        Merken
      </Link>
      <h1 className="text-2xl font-semibold mb-6">Nieuw merk</h1>
      <BrandForm />
    </div>
  );
}
