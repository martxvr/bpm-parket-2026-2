import 'server-only';
import { cache } from 'react';
import { createClient } from '@/lib/supabase/server';

export type Policy = {
  id: string;
  slug: string;
  title: string;
  content_md: string;
  last_updated: string;
};

export const getPolicyBySlug = cache(
  async (slug: string): Promise<Policy | null> => {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from('policies')
      .select('*')
      .eq('slug', slug)
      .maybeSingle();
    if (error) throw error;
    return data;
  },
);
