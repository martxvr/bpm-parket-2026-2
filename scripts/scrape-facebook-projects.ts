import dotenv from 'dotenv'
dotenv.config({ path: '.env.local' })
import { createClient } from '@supabase/supabase-js'
import sharp from 'sharp'
import fs from 'fs/promises'
import path from 'path'

const APIFY_TOKEN = process.env.APIFY_TOKEN
const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!APIFY_TOKEN || !SUPABASE_URL || !SUPABASE_SERVICE_KEY) {
    console.error('Missing env vars: APIFY_TOKEN, NEXT_PUBLIC_SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY')
    process.exit(1)
}

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY)

const INCLUDE_KEYWORDS = [
    'pvc', 'vloer', 'trap', 'gordijn', 'raamdec', 'tapijt',
    'vloerbedekking', 'rolgordijn', 'vouwgordijn', 'jaloezie',
    'duette', 'plissé', 'plisse', 'visgraat', 'laminaat', 'parket'
]
const EXCLUDE_KEYWORDS = ['kunstgras', 'kunstmatig gras', 'hockey', 'voetbalveld']

function categorize(text: string): string {
    const t = text.toLowerCase()
    if (t.includes('trap')) return 'traprenovatie'
    if (t.match(/rolgordijn|vouwgordijn|gordijn/)) return 'gordijnen'
    if (t.match(/jaloezie|raamdec|duette|plissé|plisse/)) return 'raamdecoratie'
    if (t.match(/tapijt|vloerbedekking/)) return 'vloerbedekking'
    return 'pvc-vloeren'
}

function isRelevant(text: string): boolean {
    if (!text) return false
    const t = text.toLowerCase()
    const hasInclude = INCLUDE_KEYWORDS.some(k => t.includes(k))
    const hasExclude = EXCLUDE_KEYWORDS.some(k => t.includes(k))
    return hasInclude && !hasExclude
}

async function runApifyScrape(): Promise<any[]> {
    console.log('Starting Apify actor (this may take 1-3 minutes)...')
    const url = `https://api.apify.com/v2/acts/apify~facebook-posts-scraper/run-sync-get-dataset-items?token=${APIFY_TOKEN}`
    const res = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            startUrls: [{ url: 'https://www.facebook.com/kunstgrasachterhoek.nl' }],
            resultsLimit: 100,
        }),
    })
    if (!res.ok) {
        console.error('Apify run failed:', res.status, await res.text())
        process.exit(1)
    }
    const posts = await res.json()
    console.log(`Scraped ${posts.length} posts`)
    return posts
}

async function downloadAndConvert(url: string, outPath: string): Promise<void> {
    const res = await fetch(url)
    if (!res.ok) throw new Error(`Download failed: ${res.status}`)
    const buf = Buffer.from(await res.arrayBuffer())
    const contentType = res.headers.get('content-type') || ''
    if (!contentType.startsWith('image/')) {
        throw new Error(`Not an image (content-type: ${contentType})`)
    }
    // Quality 95 WebP + effort 6 + smartSubsample for maximum detail preservation
    const webp = await sharp(buf)
        .webp({ quality: 95, effort: 6, smartSubsample: true })
        .toBuffer()
    await fs.writeFile(outPath, webp)
}

async function uploadToSupabase(filePath: string, storagePath: string): Promise<string> {
    const buf = await fs.readFile(filePath)
    const { error } = await supabase.storage.from('media').upload(storagePath, buf, {
        contentType: 'image/webp',
        upsert: true,
    })
    if (error) throw new Error(`Upload failed: ${error.message}`)
    const { data: { publicUrl } } = supabase.storage.from('media').getPublicUrl(storagePath)
    return publicUrl
}

function extractImages(post: any): string[] {
    const urls: string[] = []
    // Apify facebook-posts-scraper: post.media is array where photo entries have image.uri
    // Entries WITHOUT image.uri (like the post link wrapper) should be skipped
    if (Array.isArray(post.media)) {
        for (const m of post.media) {
            // Only photo entries — these have __typename: "Photo" and an image.uri
            if (m?.image?.uri) urls.push(m.image.uri)
            else if (m?.photo_image?.uri) urls.push(m.photo_image.uri)
            // Don't use m.url (that's the post link) or m.thumbnail alone (that's also a low-res)
        }
    }
    if (Array.isArray(post.images)) {
        for (const m of post.images) {
            if (typeof m === 'string' && m.startsWith('http') && m.includes('fbcdn')) urls.push(m)
            else if (m?.uri) urls.push(m.uri)
            else if (m?.url && m.url.includes('fbcdn')) urls.push(m.url)
        }
    }
    // Only include Facebook CDN URLs
    return [...new Set(urls)].filter(u =>
        u && typeof u === 'string' && u.startsWith('http') && u.includes('fbcdn')
    )
}

function extractText(post: any): string {
    return post.text || post.caption || post.message || post.story || ''
}

function extractPostId(post: any): string | null {
    return post.id || post.postId || post.post_id
        || (post.url?.match(/posts\/(\d+)/)?.[1])
        || (post.url?.match(/photos\/[^/]+\/(\d+)/)?.[1])
        || post.url
        || null
}

async function main() {
    const posts = await runApifyScrape()

    if (posts.length === 0) {
        console.log('No posts returned. Check Apify run or Facebook page URL.')
        return
    }

    // Log first post structure for debugging
    console.log('\nFirst post structure (for debugging):')
    console.log(JSON.stringify(posts[0], null, 2).slice(0, 2000))
    console.log('\n---\n')

    const relevant = posts.filter((p: any) => isRelevant(extractText(p)))
    console.log(`${relevant.length}/${posts.length} posts passed filter\n`)

    let imported = 0
    let skipped = 0

    for (const post of relevant) {
        const postId = extractPostId(post)
        if (!postId) {
            console.log('Skip: no post ID')
            skipped++
            continue
        }

        // Skip if already exists
        const { data: existing } = await supabase
            .from('projects')
            .select('id')
            .eq('fb_post_id', String(postId))
            .maybeSingle()
        if (existing) {
            console.log(`Skip ${postId} (already exists)`)
            skipped++
            continue
        }

        const text = extractText(post)
        const title = text.length > 60
            ? text.substring(0, 57).trim() + '...'
            : text.substring(0, 60).trim() || 'Project'
        const category = categorize(text)
        const imageUrls = extractImages(post)

        if (imageUrls.length === 0) {
            console.log(`Skip ${postId} (no images)`)
            skipped++
            continue
        }

        // Download + upload images
        const imagePaths: string[] = []
        const tmpDir = path.join('/tmp', `fb-${postId}`)
        await fs.mkdir(tmpDir, { recursive: true })

        for (let i = 0; i < imageUrls.length; i++) {
            try {
                const localPath = path.join(tmpDir, `${i}.webp`)
                await downloadAndConvert(imageUrls[i], localPath)
                const storagePath = `projects/fb-${postId}-${i}.webp`
                const publicUrl = await uploadToSupabase(localPath, storagePath)
                imagePaths.push(publicUrl)
                await new Promise(r => setTimeout(r, 100))
            } catch (e: any) {
                console.warn(`  Image ${i} failed for ${postId}:`, e.message)
            }
        }

        await fs.rm(tmpDir, { recursive: true, force: true })

        if (imagePaths.length === 0) {
            console.log(`Skip ${postId} (all image downloads failed)`)
            skipped++
            continue
        }

        const projectDate = post.time || post.date || post.timestamp || new Date().toISOString()
        const projectData: any = {
            title,
            description: text,
            category,
            location: 'Achterhoek',
            area_size: null,
            date: projectDate,
            image_url: imagePaths[0],
            images: imagePaths,
            fb_post_id: String(postId),
            techniques: [],
        }

        const { error } = await supabase.from('projects').insert([projectData])
        if (error) {
            console.error(`Insert failed for ${postId}:`, error.message)
            skipped++
            continue
        }

        imported++
        console.log(`✓ Imported ${postId}: "${title}" (${imagePaths.length} images, category: ${category})`)
    }

    console.log(`\n=== DONE ===`)
    console.log(`Total scraped:  ${posts.length}`)
    console.log(`Passed filter:  ${relevant.length}`)
    console.log(`Imported:       ${imported}`)
    console.log(`Skipped:        ${skipped}`)
}

main().catch(e => {
    console.error(e)
    process.exit(1)
})
