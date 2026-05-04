import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { KnowledgeForm } from '@/components/admin/KnowledgeForm';

export default function NewKnowledgePage() {
  return (
    <div>
      <Link
        href="/admin/kennisbank"
        className="inline-flex items-center gap-2 text-sm text-black/60 hover:text-black mb-4"
      >
        <ArrowLeft className="h-4 w-4" />
        Kennisbank
      </Link>
      <h1 className="text-2xl font-semibold mb-6">Nieuw kennisbank item</h1>
      <KnowledgeForm />
    </div>
  );
}
