import 'server-only';
import { cache } from 'react';
import { createClient } from '@/lib/supabase/server';

export type KnowledgeItem = { id: string; topic: string; content: string };

export const getKnowledge = cache(async (): Promise<KnowledgeItem[]> => {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from('knowledge')
    .select('id, topic, content')
    .order('topic');
  if (error) throw error;
  return data ?? [];
});
