# Scripts

One-off scripts for data import and maintenance.

## scrape-facebook-projects

Scrapes Facebook posts from kunstgrasachterhoek.nl via Apify, filters for vloer/trap/gordijn posts, downloads images (converts to WebP), and imports as portfolio projects.

**Required env vars (in `.env.local`):**
- `APIFY_TOKEN`
- `NEXT_PUBLIC_SUPABASE_URL`
- `SUPABASE_SERVICE_ROLE_KEY`

**Run:**
```bash
npx tsx scripts/scrape-facebook-projects.ts
```

**What it does:**
1. Calls Apify `apify/facebook-posts-scraper` for up to 100 recent posts
2. Filters posts by keywords (pvc, vloer, trap, gordijn, etc., excludes kunstgras)
3. For each relevant post: downloads all images, converts to WebP q85, uploads to Supabase storage
4. Inserts as portfolio project with `fb_post_id` for duplicate prevention
5. Auto-categorizes to pvc-vloeren / traprenovatie / gordijnen / raamdecoratie / vloerbedekking

**Safe to re-run:** duplicate detection via `fb_post_id` means re-runs only import new posts.
