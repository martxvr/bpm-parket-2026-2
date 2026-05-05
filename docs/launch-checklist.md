# BPM Parket Launch Checklist

## Pre-launch (Plan 4 code complete, before DNS switch)

### Code
- [ ] `next-migration` branch builds + typechecks + tests pass
- [ ] Lighthouse on Vercel Preview ≥ 90 Performance, 100 SEO, ≥ 95 Accessibility, ≥ 95 Best Practices
- [ ] Smoke test on Preview URL — 10 items in "Launch day" section below

### Vercel
- [ ] Custom domain `bpmparket.nl` + `www.bpmparket.nl` added in Vercel project Settings → Domains
- [ ] Apex DNS A record → `76.76.21.21`
- [ ] `www` DNS CNAME → `cname.vercel-dns.com`
- [ ] SSL cert verified (~5-10 min after DNS propagates)
- [ ] All Production env vars set (table below)

| Env var | Source |
|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` | Worktree `.env.local` |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Worktree `.env.local` |
| `SUPABASE_SERVICE_ROLE_KEY` | Supabase dashboard → Settings → API → service_role |
| `NEXT_PUBLIC_SITE_URL` | `https://bpmparket.nl` |
| `ANTHROPIC_API_KEY` | Anthropic console |
| `RESEND_API_KEY` | Resend dashboard (after domain verified) |
| `SUPABASE_AUTH_EMAIL_HOOK_SECRET` | Supabase dashboard → Auth → Hooks |
| `UPSTASH_REDIS_REST_URL` | Upstash dashboard |
| `UPSTASH_REDIS_REST_TOKEN` | Upstash dashboard |
| `HASH_SALT` | `openssl rand -hex 32` (random per environment) |
| `NEXT_PUBLIC_GA_ID` | GA4 (after client meeting) |
| `NEXT_PUBLIC_GADS_ID` | Google Ads (after client meeting) |

### Supabase
- [ ] Authentication → URL Configuration → Site URL = `https://bpmparket.nl`
- [ ] Authentication → URL Configuration → Redirect URLs include:
  - `https://bpmparket.nl/wachtwoord-reset/bevestigen`
  - `https://bpmparket.nl/auth/v1/verify`
- [ ] Authentication → Hooks → Send Email Hook enabled
  - URL: `https://bpmparket.nl/api/auth/email-hook`
  - Signing secret added as Vercel env var
- [ ] Authentication → Email Templates → all built-in templates disabled

### Resend
- [ ] Domain `bpmparket.nl` added and verified (DNS records)
- [ ] Production API key created
- [ ] `RESEND_API_KEY` set in Vercel
- [ ] Test email sent + delivered to a real inbox

### Analytics (after client meeting)
- [ ] GA4 property created — `NEXT_PUBLIC_GA_ID` set in Vercel
- [ ] Google Ads account created — `NEXT_PUBLIC_GADS_ID` set in Vercel
- [ ] Conversion actions created in Google Ads:
  - lead_submit
  - appointment_booked
  - phone_click (when tracked)
- [ ] GA4 ↔ Google Ads link active (data sharing for Smart Bidding)

### SEO
- [ ] Search Console property `https://bpmparket.nl` verified (DNS TXT)
- [ ] Sitemap submitted: `https://bpmparket.nl/sitemap.xml`
- [ ] Bing Webmaster Tools property added (imports SC verification)
- [ ] Validate JSON-LD with https://search.google.com/test/rich-results

### Content
- [ ] Bodhi has uploaded ≥ 6 real project photos via `/admin/projecten`
- [ ] Knowledge base has ≥ 5 entries (openingstijden, levertijden, prijsbeleid, etc.) via `/admin/kennisbank`
- [ ] Algemene voorwaarden filled in via `/admin/diensten` (or via Supabase directly for `policies` table)
- [ ] Bodhi changed temporary admin password
- [ ] Service pages reviewed for content accuracy by Bodhi

## Launch day

- [ ] Final verification on `next-migration`: typecheck + build + tests pass
- [ ] Merge `next-migration` → `main`:
  ```bash
  git checkout main
  git merge --no-ff origin/next-migration -m "feat: merge Next.js 16 migration (Plans 1-4)"
  git push origin main
  ```
- [ ] Switch DNS to Vercel (record propagation ~5-30 min)
- [ ] Wait for Vercel SSL cert
- [ ] **Production smoke test on `https://bpmparket.nl` (10 items):**
  1. `/` loads with Hero, USPs, Services, Projects, Reviews, CTA
  2. All 6 service pages load with content
  3. Submit test lead via `/offerte` → green confirmation + email arrives at info@bpmparket.nl
  4. Open chatbot → ask "openingstijden" → reasonable Dutch response within 5s
  5. Login at `/login` as Bodhi → admin dashboard shows real stats
  6. Lead from step 3 visible in `/admin/leads`
  7. Cookie banner appears on first visit (incognito window)
  8. "Voorkeuren aanpassen" shows 4 toggles
  9. Mobile viewport — menu, chatbot, forms all responsive
  10. Lighthouse production run → Performance ≥ 90, SEO 100, Accessibility ≥ 95
- [ ] Submit sitemap in Search Console (re-submit if first attempt was on Preview)

## Day-1 monitoring

- [ ] Vercel Logs — no 500 spam, no env-var errors
- [ ] Resend dashboard — emails delivering, no bounces
- [ ] Supabase Logs — no policy-violation errors (would indicate RLS bug)
- [ ] Upstash dashboard — rate limit counters within free tier (10k/day)
- [ ] Search Console — sitemap accepted, "Submitted but not indexed" is normal initially
- [ ] Send a real lead form submission yourself — verify Bodhi receives email
- [ ] Test chatbot booking flow yourself end-to-end

## Week 1 post-launch

- [ ] Verify GA4 receiving data (Realtime view)
- [ ] Verify Google Ads conversions tracking (lead_submit firing)
- [ ] Check Vercel Web Vitals — real-user LCP/CLS/INP percentiles
- [ ] Monitor Anthropic dashboard — chatbot token usage realistic (< €5/week typical)
- [ ] Bodhi has practiced admin paneel for ≥ 30 min
- [ ] First organic Search Console impressions/clicks

## Common issues + fixes

| Issue | Cause | Fix |
|---|---|---|
| 500 on `/admin` | `SUPABASE_SERVICE_ROLE_KEY` missing in Vercel | Add to Production env, redeploy |
| Lead emails not arriving | Resend domain not verified | Check DNS records propagated, verify in Resend dashboard |
| Auth password reset email stuck on Supabase default | Auth Email Hook not configured | Enable hook in Supabase Auth settings |
| CSP errors in browser console | New external service added | Add origin to `next.config.ts` connect-src/script-src/img-src |
| Chatbot returns 503 | `ANTHROPIC_API_KEY` missing | Add to Production env, redeploy |
| Rate limiting not working in production | `UPSTASH_REDIS_REST_*` missing | Add to Production env (in-memory fallback only works locally) |
