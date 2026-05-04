import { notFound } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { createClient } from '@/lib/supabase/server';
import { KnowledgeForm } from '@/components/admin/KnowledgeForm';

type Props = { params: Promise<{ id: string }> };

export default async function EditKnowledgePage({ params }: Props) {
  const { id } = await params;
  const supabase = await createClient();
  const { data: item } = await supabase
    .from('knowledge')
    .select('*')
    .eq('id', id)
    .maybeSingle();
  if (!item) notFound();

  return (
    <div>
      <Link
        href="/admin/kennisbank"
        className="inline-flex items-center gap-2 text-sm text-black/60 hover:text-black mb-4"
      >
        <ArrowLeft className="h-4 w-4" />
        Kennisbank
      </Link>
      <h1 className="text-2xl font-semibold mb-6">Bewerk: {item.topic}</h1>
      <KnowledgeForm item={item} />
    </div>
  );
}
