import { NextResponse } from 'next/server';

const ALLOWED_HOSTS = [
  'satvtrhhcpxjkerhnqdk.supabase.co',
  'tgnxthcgpjlndzvtpgjh.supabase.co',
  'images.unsplash.com',
  'cdn.sanity.io',
  'lh3.googleusercontent.com',
  'www.floer.nl',
  'www.floorify.com',
  'invictus-floors.com',
  'www.ipcflooring.com',
  'artofliving.nl',
  'www.rivieraplaids.nl',
]

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const url = searchParams.get('url');

  if (!url) return new Response('Missing url', { status: 400 });

  let parsed: URL;
  try {
    parsed = new URL(url);
  } catch {
    return new Response('Invalid url', { status: 400 });
  }

  if (!ALLOWED_HOSTS.includes(parsed.hostname)) {
    return new Response('Forbidden', { status: 403 });
  }

  try {
    const res = await fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'Accept': 'image/avif,image/webp,image/apng,image/svg+xml,image/*,*/*;q=0.8',
        'Referer': new URL(url).origin + '/',
      },
      cache: 'force-cache'
    });

    if (!res.ok) {
        throw new Error(`Failed to fetch image: ${res.status} ${res.statusText}`);
    }
    
    // Passthrough the response
    return new Response(res.body, {
      headers: {
        'Content-Type': res.headers.get('content-type') || 'image/jpeg',
        'Cache-Control': 'public, max-age=31536000, immutable',
      }
    });
  } catch (error) {
    console.error('Image proxy error:', error);
    return new Response('Error fetching image', { status: 500 });
  }
}
