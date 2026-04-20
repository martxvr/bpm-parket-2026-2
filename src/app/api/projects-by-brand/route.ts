import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/static';

export async function GET(req: Request) {
    const { searchParams } = new URL(req.url);
    const brandSlug = searchParams.get('brand');
    if (!brandSlug) return NextResponse.json([]);

    const supabase = createClient();
    const { data, error } = await supabase
        .from('projects')
        .select('*')
        .eq('brand_slug', brandSlug)
        .order('date', { ascending: false })
        .limit(4);

    if (error) return NextResponse.json([]);
    return NextResponse.json(data);
}
