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
- [Plan 1: Foundation](docs/superpowers/plans/2026-05-04-nextjs-migration-plan-1-foundation.md)

The old Vite version remains live on `master` branch until migration completes.
This Next.js work lives on the `next-migration` branch.
