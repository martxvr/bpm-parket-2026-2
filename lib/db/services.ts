import 'server-only';
import { cache } from 'react';
import { createClient } from '@/lib/supabase/server';

export type Service = {
  id: string;
  slug: string;
  title: string;
  hero_image: string | null;
  body_md: string | null;
  meta_title: string | null;
  meta_description: string | null;
  sort_order: number;
};

export const getServices = cache(async (): Promise<Service[]> => {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from('services')
    .select('*')
    .order('sort_order', { ascending: true });
  if (error) throw error;
  return data ?? [];
});

export const getServiceBySlug = cache(
  async (slug: string): Promise<Service | null> => {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from('services')
      .select('*')
      .eq('slug', slug)
      .maybeSingle();
    if (error) throw error;
    return data;
  },
);
