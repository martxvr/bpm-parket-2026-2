# BPM Parket

Marketing website + admin paneel voor BPM Parket (Geldrop). Specialist in
traditioneel parket, PVC vloeren, laminaat, en traprenovatie.

## Stack

- **Next.js 16** (App Router, React 19)
- **Tailwind CSS v4**
- **Supabase** (Postgres, Auth, Storage) met Row-Level Security
- **TypeScript**, **Zod**, **Playwright**, **Vitest**
- Deployment: **Vercel**

## Setup

```bash
# 1. Install deps
npm install

# 2. Copy env vars
cp .env.example .env.local
# Vul in: Supabase URL/keys, Anthropic key, Resend key

# 3. Apply database migrations
npx supabase link --project-ref <ref>
npx supabase db push

# 4. Seed admin user (one-time)
SEED_ADMIN_PASSWORD='strong-temp-password' npm run seed:admin

# 5. Run dev server
npm run dev
```

## Scripts

- `npm run dev` — start Next.js dev server
- `npm run build` — production build
- `npm run typecheck` — TypeScript check (no emit)
- `npm test` — Vitest unit tests
- `npm run test:e2e` — Playwright E2E tests
- `npm run seed:admin` — create/verify Bodhi admin user

## Project structure

- `app/` — Next.js App Router pages
  - `(public)/` — public marketing site
  - `(auth)/` — login + password reset (no auth gate)
  - `(admin)/` — admin paneel (auth-protected)
- `components/` — shared React components
- `lib/` — Supabase clients, auth helpers, env validation
- `supabase/migrations/` — database schema and RLS
- `tests/e2e/` — Playwright tests
- `_legacy/` — old Vite codebase, kept for component reference during migration

## Status

Migration in progress. See:
- [Design spec](docs/superpowers/specs/2026-05-02-vite-to-nextjs-migration-design.md)
- [Plan 1: Foundation](docs/superpowers/plans/2026-05-04-nextjs-migration-plan-1-foundation.md) — done
- [Plan 2: Public Site + Chatbot](docs/superpowers/plans/2026-05-04-nextjs-migration-plan-2-public-site-and-chatbot.md) — done
- Plan 3 (Admin) — pending
- Plan 4 (SEO + GDPR + Launch) — pending

The old Vite version remains live on `master` branch until migration completes.
This Next.js work lives on the `next-migration` branch.

## Required env vars (Plan 2 additions)

In addition to Plan 1's Supabase env vars:

- `ANTHROPIC_API_KEY` (chatbot — `sk-ant-...`)
- `RESEND_API_KEY` (email — `re_...`)
- `SUPABASE_AUTH_EMAIL_HOOK_SECRET` (auth email hook signing — base64 string from Supabase dashboard)
- `UPSTASH_REDIS_REST_URL` and `UPSTASH_REDIS_REST_TOKEN` (rate limiting — fallback to in-memory in dev)
- `HASH_SALT` (random string for IP/UA hashing — `openssl rand -hex 32`)
