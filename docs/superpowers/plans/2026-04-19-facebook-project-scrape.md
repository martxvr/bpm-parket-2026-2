# Facebook Project Scrape & Gallery Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Scrape 100 recent Facebook posts from kunstgrasachterhoek.nl via Apify, filter for relevant floor/curtain projects, download all images locally as WebP, and insert as portfolio projects. Also fix admin project editing and add multi-image gallery support.

**Architecture:** Schema migration adds `images` JSONB + `fb_post_id` to projects table. Admin edit page gets fixed + multi-image upload. ProjectDetail component gets a lightbox gallery. A one-time Node script calls Apify REST API, filters results, downloads + converts images to WebP, and inserts into Supabase.

**Tech Stack:** Supabase (migration via MCP), TypeScript, Next.js, `@supabase/supabase-js`, `sharp` (for WebP conversion), Apify REST API.

---

## File Structure

### Database (Task 1)
- Migration via Supabase MCP (no local file)

### Type + data layer (Task 2)
- Modify: `src/types.ts` — add `images` to Project interface
- Modify: `src/lib/site-data.ts` — map `images` in getProjects/getProject
- Modify: `src/lib/admin-data.ts` — map `images` where needed

### Admin edit page fix (Task 3)
- Modify: `src/app/(admin)/admin/projecten/[id]/page.tsx` — load existing project, show multi-image manager
- Modify: `src/app/(admin)/admin/projecten/actions.ts` — handle multi-image save + delete

### Public gallery (Task 4)
- Modify: `src/components/ProjectDetail.tsx` — add thumbnail strip + lightbox with prev/next

### Apify scrape script (Task 5)
- Create: `scripts/scrape-facebook-projects.ts` — one-off scrape + import script
- Create: `scripts/README.md` — how to run

---

## Reference: existing patterns

### Brand detail lightbox pattern (follow this)
See `src/app/(site)/producten/[category]/[brand]/page.tsx` — uses `selectedImageIndex`, prev/next callbacks, keyboard handler with ArrowLeft/ArrowRight/Escape, and a counter.

### Project type (current)
```typescript
export interface Project {
  id: string;
  title: string;
  description: string;
  imageUrl?: string;
  imageUpload?: any;
  areaSize: number;
  location: string;
  date: string;
  category?: string;
  brand?: string;
  brandSlug?: string;
  longDescription?: string;
  techniques?: string[];
}
```

### Supabase projects table (current columns)
`id, title, description, long_description, image_url, category, location, area_size, date, techniques, brand, brand_slug, created_at`

---

## Task 1: Database migration

**Goal:** Add `images` JSONB and `fb_post_id` columns to projects table.

- [ ] **Step 1: Apply migration via Supabase MCP**

  Use `mcp__plugin_supabase_supabase__apply_migration` with project_id `satvtrhhcpxjkerhnqdk`:

  ```sql
  ALTER TABLE projects ADD COLUMN IF NOT EXISTS images JSONB DEFAULT '[]'::jsonb;
  ALTER TABLE projects ADD COLUMN IF NOT EXISTS fb_post_id TEXT;
  CREATE UNIQUE INDEX IF NOT EXISTS idx_projects_fb_post_id ON projects (fb_post_id) WHERE fb_post_id IS NOT NULL;
  ```

- [ ] **Step 2: Backfill `images` from existing `image_url`**

  ```sql
  UPDATE projects
  SET images = jsonb_build_array(image_url)
  WHERE image_url IS NOT NULL
    AND (images IS NULL OR images = '[]'::jsonb);
  ```

  Expected: all existing projects now have `images: [current_image_url]`.

- [ ] **Step 3: Verify**

  ```sql
  SELECT id, title, image_url, images FROM projects LIMIT 3;
  ```

  Expected: `images` is a JSON array containing the `image_url`.

---

## Task 2: Type + data layer updates

**Goal:** Project type and data fetchers surface `images` array.

**Files:**
- Modify: `src/types.ts`
- Modify: `src/lib/site-data.ts`
- Modify: `src/lib/admin-data.ts`

- [ ] **Step 1: Update Project interface**

  In `src/types.ts`, update the `Project` interface:
  ```typescript
  export interface Project {
    id: string;
    title: string;
    description: string;
    imageUrl?: string;
    imageUpload?: any;
    images?: string[];
    areaSize: number;
    location: string;
    date: string;
    category?: string;
    brand?: string;
    brandSlug?: string;
    longDescription?: string;
    techniques?: string[];
  }
  ```

- [ ] **Step 2: Update `getProjects` mapping**

  In `src/lib/site-data.ts`, find the `getProjects` cache function. Update the return map to include `images`:
  ```typescript
  return data.map(doc => ({
      id: doc.id,
      title: doc.title,
      description: doc.description,
      imageUrl: doc.image_url,
      images: Array.isArray(doc.images) ? doc.images : [],
      category: doc.category,
      brand: doc.brand || '',
      brandSlug: doc.brand_slug || '',
      date: doc.date ? new Date(doc.date).toLocaleDateString('nl-NL', { day: 'numeric', month: 'short', year: 'numeric' }) : '',
      location: doc.location || 'Achterhoek',
      areaSize: doc.area_size || 0,
      longDescription: doc.long_description || '',
      techniques: doc.techniques || []
  }))
  ```

- [ ] **Step 3: Update `getProject` mapping**

  Same file, find `getProject`. Update the return object to include `images: Array.isArray(data.images) ? data.images : []`.

- [ ] **Step 4: Verify TypeScript compiles**

  ```bash
  cd /Users/martijnvervoort/Desktop/Code/pvcvloerenachterhoek && npx tsc --noEmit
  ```
  Expected: no errors.

- [ ] **Step 5: Commit**

  ```bash
  git add src/types.ts src/lib/site-data.ts src/lib/admin-data.ts
  git commit -m "feat: add images array to Project type and data fetchers"
  ```

---

## Task 3: Admin project edit page fix + multi-image support

**Goal:** Fix the broken admin edit flow and allow managing multiple images per project.

**Files:**
- Modify: `src/app/(admin)/admin/projecten/[id]/page.tsx`
- Modify: `src/app/(admin)/admin/projecten/actions.ts`

- [ ] **Step 1: Load existing project in edit page**

  Read `src/app/(admin)/admin/projecten/[id]/page.tsx`. It's currently rendering an empty form. Update to:
  1. Accept `params: Promise<{ id: string }>`
  2. If `id === 'nieuw'` → render empty form (create mode)
  3. Else → fetch project via `getProject(id)`, pass to form as initial values

  Template:
  ```typescript
  import { getProject } from '@/lib/admin-data'
  import { notFound } from 'next/navigation'
  import ProjectEditForm from './ProjectEditForm'

  export default async function ProjectEditPage({ params }: { params: Promise<{ id: string }> }) {
      const { id } = await params
      if (id === 'nieuw') {
          return <ProjectEditForm />
      }
      const project = await getProject(id)
      if (!project) return notFound()
      return <ProjectEditForm data={project} />
  }
  ```

  (Extract existing form JSX into `ProjectEditForm.tsx` in the same directory if not already split. If it's inline, split it out.)

- [ ] **Step 2: Add multi-image manager to the form**

  In the form component (client component with `"use client"`):

  ```typescript
  const [images, setImages] = useState<string[]>(data?.images || [])

  // Inside form JSX, add an "Foto's" section:
  ```

  ```tsx
  <div className="space-y-3">
    <label className="block text-xs font-bold text-gray-700 uppercase tracking-widest">Foto's</label>

    {images.length > 0 && (
      <div className="grid grid-cols-4 gap-2">
        {images.map((img, idx) => (
          <div key={idx} className="relative group aspect-square rounded-lg overflow-hidden border border-gray-200">
            <img src={img} alt="" className="w-full h-full object-cover" />
            <button
              type="button"
              onClick={() => setImages(prev => prev.filter((_, i) => i !== idx))}
              className="absolute top-1 right-1 bg-red-500 text-white w-6 h-6 rounded-full text-xs opacity-0 group-hover:opacity-100 transition-opacity"
            >
              ×
            </button>
            {idx === 0 && (
              <span className="absolute bottom-1 left-1 bg-brand-primary text-white text-[10px] font-bold px-1.5 py-0.5 rounded">Hoofd</span>
            )}
          </div>
        ))}
      </div>
    )}

    <input
      type="file"
      accept="image/*"
      multiple
      onChange={async (e) => {
        const files = Array.from(e.target.files || [])
        for (const file of files) {
          const formData = new FormData()
          formData.append('file', file)
          const res = await fetch('/api/upload-project-image', { method: 'POST', body: formData })
          if (res.ok) {
            const { url } = await res.json()
            setImages(prev => [...prev, url])
          }
        }
        e.target.value = ''
      }}
      className="text-sm"
    />

    {/* Hidden input for form submission */}
    <input type="hidden" name="images" value={JSON.stringify(images)} />
  </div>
  ```

- [ ] **Step 3: Create image upload API route**

  Create `src/app/api/upload-project-image/route.ts`:

  ```typescript
  import { NextResponse } from 'next/server'
  import { requireAuth } from '@/lib/supabase/require-auth'
  import sharp from 'sharp'

  export async function POST(req: Request) {
      const { supabase } = await requireAuth()
      const formData = await req.formData()
      const file = formData.get('file') as File
      if (!file) return NextResponse.json({ error: 'No file' }, { status: 400 })

      const buffer = Buffer.from(await file.arrayBuffer())
      const webp = await sharp(buffer).webp({ quality: 85 }).toBuffer()

      const filename = `projects/${Date.now()}-${Math.random().toString(36).slice(2)}.webp`
      const { error } = await supabase.storage.from('media').upload(filename, webp, {
          contentType: 'image/webp',
      })
      if (error) return NextResponse.json({ error: error.message }, { status: 500 })

      const { data: { publicUrl } } = supabase.storage.from('media').getPublicUrl(filename)
      return NextResponse.json({ url: publicUrl })
  }
  ```

- [ ] **Step 4: Update `saveProject` server action**

  In `src/app/(admin)/admin/projecten/actions.ts`, update `saveProject` to accept the `images` JSON array:

  ```typescript
  const imagesRaw = formData.get('images') as string
  const images: string[] = imagesRaw ? JSON.parse(imagesRaw) : []

  // image_url = first image (for backwards compat + cards that don't use gallery yet)
  const primaryImage = images[0] || image_url  // image_url from existing single upload

  const projectData = {
      title,
      description,
      long_description,
      category,
      location,
      area_size,
      date: date || null,
      image_url: primaryImage,
      images,
      techniques,
      brand,
      brand_slug,
  }
  ```

- [ ] **Step 5: Install sharp if not installed**

  ```bash
  cd /Users/martijnvervoort/Desktop/Code/pvcvloerenachterhoek && npm ls sharp || npm install sharp --legacy-peer-deps
  ```

- [ ] **Step 6: Verify TypeScript compiles**

  ```bash
  npx tsc --noEmit
  ```

- [ ] **Step 7: Commit**

  ```bash
  git add -A
  git commit -m "feat: fix admin project edit and add multi-image gallery support"
  ```

---

## Task 4: ProjectDetail gallery + lightbox

**Goal:** Public-facing project detail modal shows a gallery with thumbnails and a full-screen lightbox with prev/next navigation.

**Files:**
- Modify: `src/components/ProjectDetail.tsx`

- [ ] **Step 1: Read existing ProjectDetail and understand structure**

  Read `src/components/ProjectDetail.tsx` to understand the current layout.

- [ ] **Step 2: Replace single image with gallery**

  Add state:
  ```typescript
  const allImages = project.images && project.images.length > 0
      ? project.images
      : project.imageUrl ? [project.imageUrl] : []
  const [mainIdx, setMainIdx] = useState(0)
  const [lightboxIdx, setLightboxIdx] = useState<number | null>(null)
  ```

  Replace the single `<img>` element with:
  ```tsx
  {allImages.length > 0 && (
      <>
          <div
              className="relative rounded-2xl overflow-hidden cursor-zoom-in"
              onClick={() => setLightboxIdx(mainIdx)}
          >
              <img src={allImages[mainIdx]} alt={project.title} className="w-full h-full object-cover" />
          </div>
          {allImages.length > 1 && (
              <div className="flex gap-2 mt-3 overflow-x-auto no-scrollbar">
                  {allImages.map((img, idx) => (
                      <button
                          key={idx}
                          onClick={() => setMainIdx(idx)}
                          className={`relative h-20 w-20 rounded-lg overflow-hidden flex-shrink-0 transition-all ${
                              idx === mainIdx ? 'ring-2 ring-brand-primary' : 'opacity-60 hover:opacity-100'
                          }`}
                      >
                          <img src={img} alt="" className="w-full h-full object-cover" />
                      </button>
                  ))}
              </div>
          )}
      </>
  )}
  ```

- [ ] **Step 3: Add lightbox with keyboard + arrow navigation**

  Add useCallback functions and useEffect for keyboard:

  ```typescript
  const lightboxGoNext = useCallback(() => {
      if (lightboxIdx === null || allImages.length === 0) return
      setLightboxIdx((lightboxIdx + 1) % allImages.length)
  }, [lightboxIdx, allImages.length])

  const lightboxGoPrev = useCallback(() => {
      if (lightboxIdx === null || allImages.length === 0) return
      setLightboxIdx((lightboxIdx - 1 + allImages.length) % allImages.length)
  }, [lightboxIdx, allImages.length])

  useEffect(() => {
      if (lightboxIdx === null) return
      const handler = (e: KeyboardEvent) => {
          if (e.key === 'ArrowRight') lightboxGoNext()
          else if (e.key === 'ArrowLeft') lightboxGoPrev()
          else if (e.key === 'Escape') setLightboxIdx(null)
      }
      window.addEventListener('keydown', handler)
      return () => window.removeEventListener('keydown', handler)
  }, [lightboxIdx, lightboxGoNext, lightboxGoPrev])
  ```

  Add lightbox JSX (before the closing element of the component, copy pattern from brand detail page):

  ```tsx
  {lightboxIdx !== null && allImages[lightboxIdx] && (
      <div
          className="fixed inset-0 z-[60] flex items-center justify-center bg-black/95 p-4 sm:p-8 backdrop-blur-sm"
          onClick={() => setLightboxIdx(null)}
      >
          <button
              className="absolute top-6 right-6 text-white/50 hover:text-white bg-white/10 hover:bg-brand-primary p-3 rounded-full backdrop-blur-md z-50"
              onClick={(e) => { e.stopPropagation(); setLightboxIdx(null) }}
          >
              <XIcon size={24} />
          </button>
          {allImages.length > 1 && (
              <>
                  <button
                      className="absolute left-4 sm:left-8 top-1/2 -translate-y-1/2 text-white/50 hover:text-white bg-white/10 hover:bg-white/20 p-3 rounded-full backdrop-blur-md z-50"
                      onClick={(e) => { e.stopPropagation(); lightboxGoPrev() }}
                  >
                      <ChevronLeft className="w-6 h-6" />
                  </button>
                  <button
                      className="absolute right-4 sm:right-8 top-1/2 -translate-y-1/2 text-white/50 hover:text-white bg-white/10 hover:bg-white/20 p-3 rounded-full backdrop-blur-md z-50"
                      onClick={(e) => { e.stopPropagation(); lightboxGoNext() }}
                  >
                      <ChevronRight className="w-6 h-6" />
                  </button>
              </>
          )}
          <div className="relative w-full max-w-7xl max-h-[90vh]" onClick={(e) => e.stopPropagation()}>
              <img src={allImages[lightboxIdx]} alt="" className="max-w-full max-h-[90vh] object-contain rounded-xl shadow-2xl" />
          </div>
          {allImages.length > 1 && (
              <div className="absolute bottom-6 left-1/2 -translate-x-1/2 text-white/40 text-sm font-medium bg-white/10 backdrop-blur-md px-4 py-2 rounded-full">
                  {lightboxIdx + 1} / {allImages.length}
              </div>
          )}
      </div>
  )}
  ```

  Add imports at top:
  ```typescript
  import { ChevronLeft, ChevronRight } from 'lucide-react'
  import XIcon from '@/components/ui/x-icon'
  ```
  (Check what's already imported — some may already exist.)

- [ ] **Step 4: Verify TypeScript compiles**

  ```bash
  npx tsc --noEmit
  ```

- [ ] **Step 5: Commit**

  ```bash
  git add src/components/ProjectDetail.tsx
  git commit -m "feat: add image gallery with thumbnails and lightbox to project detail"
  ```

---

## Task 5: Apify scrape script + execution

**Goal:** One-off script that scrapes 100 Facebook posts, filters for relevant, downloads + converts images, inserts as projects.

**Files:**
- Create: `scripts/scrape-facebook-projects.ts`
- Create: `scripts/README.md`
- Modify: `.env.local` (add APIFY_TOKEN)

- [ ] **Step 1: Add APIFY_TOKEN to .env.local**

  Add line:
  ```
  APIFY_TOKEN=apify_api_<YOUR_TOKEN_HERE>
  ```

- [ ] **Step 2: Install dependencies if needed**

  ```bash
  npm ls @supabase/supabase-js sharp tsx dotenv || npm install tsx dotenv --save-dev --legacy-peer-deps
  ```
  (`@supabase/supabase-js` and `sharp` should already be installed)

- [ ] **Step 3: Create the scrape script**

  Create `scripts/scrape-facebook-projects.ts`:

  ```typescript
  import 'dotenv/config'
  import { createClient } from '@supabase/supabase-js'
  import sharp from 'sharp'
  import fs from 'fs/promises'
  import path from 'path'

  const APIFY_TOKEN = process.env.APIFY_TOKEN!
  const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL!
  const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY!

  if (!APIFY_TOKEN || !SUPABASE_URL || !SUPABASE_SERVICE_KEY) {
      console.error('Missing env vars: APIFY_TOKEN, NEXT_PUBLIC_SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY')
      process.exit(1)
  }

  const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY)

  const INCLUDE_KEYWORDS = ['pvc', 'vloer', 'trap', 'gordijn', 'raamdec', 'tapijt', 'vloerbedekking', 'rolgordijn', 'vouwgordijn', 'jaloezie', 'duette', 'plissé', 'plisse', 'visgraat', 'laminaat']
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
      const t = text.toLowerCase()
      const hasInclude = INCLUDE_KEYWORDS.some(k => t.includes(k))
      if (!hasInclude) return false
      const hasOnlyExclude = EXCLUDE_KEYWORDS.some(k => t.includes(k)) && !hasInclude
      return hasInclude && !hasOnlyExclude
  }

  async function runApifyScrape(): Promise<any[]> {
      console.log('Starting Apify actor...')
      const runRes = await fetch(`https://api.apify.com/v2/acts/apify~facebook-posts-scraper/run-sync-get-dataset-items?token=${APIFY_TOKEN}`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
              startUrls: [{ url: 'https://www.facebook.com/kunstgrasachterhoek.nl' }],
              resultsLimit: 100,
          }),
      })
      if (!runRes.ok) {
          console.error('Apify run failed:', runRes.status, await runRes.text())
          process.exit(1)
      }
      const posts = await runRes.json()
      console.log(`Scraped ${posts.length} posts`)
      return posts
  }

  async function downloadAndConvert(url: string, outPath: string): Promise<void> {
      const res = await fetch(url)
      if (!res.ok) throw new Error(`Download failed: ${res.status}`)
      const buf = Buffer.from(await res.arrayBuffer())
      const webp = await sharp(buf).webp({ quality: 85 }).toBuffer()
      await fs.writeFile(outPath, webp)
  }

  async function uploadImageToSupabase(filePath: string, storagePath: string): Promise<string> {
      const buf = await fs.readFile(filePath)
      const { error } = await supabase.storage.from('media').upload(storagePath, buf, {
          contentType: 'image/webp',
          upsert: true,
      })
      if (error) throw new Error(`Upload failed: ${error.message}`)
      const { data: { publicUrl } } = supabase.storage.from('media').getPublicUrl(storagePath)
      return publicUrl
  }

  async function main() {
      const posts = await runApifyScrape()

      const relevant = posts.filter((p: any) => {
          const text: string = p.text || p.caption || ''
          return isRelevant(text)
      })
      console.log(`${relevant.length}/${posts.length} posts passed filter`)

      let imported = 0
      let skipped = 0

      for (const post of relevant) {
          const postId = post.id || post.postId || post.url?.split('/').pop()
          if (!postId) { skipped++; continue }

          // Skip if already exists
          const { data: existing } = await supabase
              .from('projects')
              .select('id')
              .eq('fb_post_id', postId)
              .maybeSingle()
          if (existing) { console.log(`Skip ${postId} (exists)`); skipped++; continue }

          const text: string = post.text || post.caption || ''
          const title = text.length > 60 ? text.substring(0, 57).trim() + '...' : text.substring(0, 60).trim() || 'Project'
          const category = categorize(text)

          // Extract images — Apify returns them in various fields; check media array
          const mediaUrls: string[] = []
          if (Array.isArray(post.media)) {
              for (const m of post.media) {
                  if (m.url) mediaUrls.push(m.url)
                  else if (typeof m === 'string') mediaUrls.push(m)
              }
          }
          if (post.mediaUrl) mediaUrls.push(post.mediaUrl)
          if (Array.isArray(post.images)) mediaUrls.push(...post.images)

          const uniqueUrls = [...new Set(mediaUrls)].filter(u => u && typeof u === 'string')
          if (uniqueUrls.length === 0) { console.log(`Skip ${postId} (no images)`); skipped++; continue }

          // Download + upload each image
          const imagePaths: string[] = []
          const tmpDir = path.join('/tmp', `fb-${postId}`)
          await fs.mkdir(tmpDir, { recursive: true })

          for (let i = 0; i < uniqueUrls.length; i++) {
              try {
                  const localPath = path.join(tmpDir, `${i}.webp`)
                  await downloadAndConvert(uniqueUrls[i], localPath)
                  const storagePath = `projects/fb-${postId}-${i}.webp`
                  const publicUrl = await uploadImageToSupabase(localPath, storagePath)
                  imagePaths.push(publicUrl)
                  await new Promise(r => setTimeout(r, 100))
              } catch (e: any) {
                  console.warn(`Image ${i} failed for ${postId}:`, e.message)
              }
          }

          await fs.rm(tmpDir, { recursive: true, force: true })

          if (imagePaths.length === 0) { console.log(`Skip ${postId} (no images downloaded)`); skipped++; continue }

          const projectData = {
              title,
              description: text,
              category,
              location: 'Achterhoek',
              area_size: null,
              date: post.time || post.date || new Date().toISOString(),
              image_url: imagePaths[0],
              images: imagePaths,
              fb_post_id: postId,
              techniques: [],
          }

          const { error } = await supabase.from('projects').insert([projectData])
          if (error) {
              console.error(`Insert failed for ${postId}:`, error.message)
              skipped++
              continue
          }

          imported++
          console.log(`Imported ${postId}: ${title} (${imagePaths.length} images, category: ${category})`)
      }

      console.log(`\nDONE. Imported: ${imported}, Skipped: ${skipped}, Total relevant: ${relevant.length}`)
  }

  main().catch(e => { console.error(e); process.exit(1) })
  ```

- [ ] **Step 4: Add SUPABASE_SERVICE_ROLE_KEY to .env.local**

  Get the service_role key from Supabase project settings and add to `.env.local`:
  ```
  SUPABASE_SERVICE_ROLE_KEY=<service_role_key>
  ```

  (Can also fetch programmatically via Management API with the personal access token if needed.)

- [ ] **Step 5: Create scripts/README.md**

  ```markdown
  # Scripts

  One-off scripts for data import and maintenance.

  ## scrape-facebook-projects

  Scrapes Facebook posts from kunstgrasachterhoek.nl via Apify, filters for vloer/trap/gordijn posts, downloads images, and imports as portfolio projects.

  Requires env vars: `APIFY_TOKEN`, `NEXT_PUBLIC_SUPABASE_URL`, `SUPABASE_SERVICE_ROLE_KEY`

  Run:
  ```
  npx tsx scripts/scrape-facebook-projects.ts
  ```
  ```

- [ ] **Step 6: Run the script**

  ```bash
  cd /Users/martijnvervoort/Desktop/Code/pvcvloerenachterhoek && npx tsx scripts/scrape-facebook-projects.ts
  ```

  Watch the logs. Expected output: number of posts scraped, number passed filter, per-post import logs, final summary.

  **If Apify response shape differs from assumptions:** adjust `mediaUrls` extraction and `text` field access. Log a sample post with `console.log(JSON.stringify(posts[0], null, 2))` if needed to inspect.

- [ ] **Step 7: Verify in the admin**

  Navigate to `/admin/projecten` and check that new projects are visible.
  Check the public `/projecten` page — projects should appear with thumbnails.
  Click one — gallery should show all images with lightbox.

- [ ] **Step 8: Commit**

  ```bash
  git add scripts/ .env.local
  git commit -m "feat: add Facebook post scraper script for portfolio projects"
  ```

  Note: `.env.local` is in `.gitignore`, so the token won't be committed.

  ```bash
  git add scripts/
  git commit -m "feat: add Facebook post scraper script for portfolio projects"
  ```
