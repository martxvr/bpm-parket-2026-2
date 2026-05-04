import 'server-only';
import { cache } from 'react';
import { createClient } from '@/lib/supabase/server';

export type Project = {
  id: string;
  slug: string;
  title: string;
  description: string | null;
  long_description: string | null;
  image_url: string | null;
  gallery_image_urls: string[];
  area_size: number | null;
  location: string | null;
  completed_date: string | null;
  techniques: string[];
  floor_type: string | null;
  is_featured: boolean;
  sort_order: number;
};

export const getProjects = cache(async (): Promise<Project[]> => {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from('projects')
    .select('*')
    .order('sort_order', { ascending: true });
  if (error) throw error;
  return data ?? [];
});

export const getFeaturedProjects = cache(async (): Promise<Project[]> => {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from('projects')
    .select('*')
    .eq('is_featured', true)
    .order('sort_order')
    .limit(6);
  if (error) throw error;
  return data ?? [];
});

export const getProjectBySlug = cache(
  async (slug: string): Promise<Project | null> => {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from('projects')
      .select('*')
      .eq('slug', slug)
      .maybeSingle();
    if (error) throw error;
    return data;
  },
);
