# Next.js Migration — Plan 1: Foundation

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Werkende Next.js 15+ scaffold op feature branch `next-migration` met Supabase backend, RLS-protected schema, email/wachtwoord auth voor Bodhi, en een lege admin shell — klaar als platform voor Plan 2 (public site + chatbot).

**Architecture:** Feature branch op dezelfde repo; Vite-app blijft live op master. App Router met Server Components by default, Tailwind v4 CSS-first, `@supabase/ssr` voor cookie-based auth, defense-in-depth admin protection (middleware + layout + server-action checks). Bestaande Vite-code naar `_legacy/` verplaatst zodat Next.js 'm negeert maar componenten beschikbaar blijven voor migratie in Plan 2.

**Tech Stack:** Next.js 15+, React 19, TypeScript 5, Tailwind v4, Supabase (Postgres + Auth + RLS), `@supabase/ssr`, Zod, Playwright, Vercel.

**Spec reference:** [docs/superpowers/specs/2026-05-02-vite-to-nextjs-migration-design.md](../specs/2026-05-02-vite-to-nextjs-migration-design.md)

---

## File structure (after Plan 1)

```
.                                                          NEW/CHANGED
├── _legacy/                                               # MOVED
│   ├── App.tsx, index.tsx, index.html
│   ├── pages/, components/, services/
│   ├── vite.config.ts, vite-env.d.ts
│   └── tsconfig.json (oude versie hier verplaatst)
├── app/
│   ├── layout.tsx                                         CREATE
│   ├── globals.css                                        CREATE
│   ├── (admin)/
│   │   ├── layout.tsx                                     CREATE
│   │   ├── admin/
│   │   │   └── page.tsx                                   CREATE
│   │   ├── login/
│   │   │   ├── page.tsx                                   CREATE
│   │   │   └── actions.ts                                 CREATE
│   │   └── wachtwoord-reset/
│   │       ├── page.tsx                                   CREATE
│   │       ├── actions.ts                                 CREATE
│   │       └── bevestigen/
│   │           └── page.tsx                               CREATE
│   └── (public)/
│       ├── layout.tsx                                     CREATE (placeholder)
│       └── page.tsx                                       CREATE (placeholder)
├── components/
│   ├── admin/Sidebar.tsx                                  CREATE
│   └── ui/Button.tsx                                      CREATE
├── lib/
│   ├── supabase/
│   │   ├── server.ts                                      CREATE
│   │   ├── client.ts                                      CREATE
│   │   └── middleware.ts                                  CREATE
│   ├── auth.ts                                            CREATE
│   ├── env.ts                                             CREATE
│   └── auth.test.ts                                       CREATE
├── supabase/
│   ├── migrations/
│   │   ├── 20260504120000_initial_schema.sql              CREATE
│   │   ├── 20260504120100_rls_policies.sql                CREATE
│   │   └── 20260504120200_storage_buckets.sql             CREATE
│   ├── seed.sql                                           CREATE
│   └── config.toml                                        CREATE
├── scripts/
│   └── seed-admin-user.ts                                 CREATE
├── tests/e2e/
│   └── auth.spec.ts                                       CREATE
├── middleware.ts                                          CREATE
├── next.config.ts                                         CREATE
├── postcss.config.mjs                                     CREATE
├── playwright.config.ts                                   CREATE
├── tsconfig.json                                          REPLACE
├── package.json                                           REPLACE
├── .env.example                                           CREATE
├── .env.local                                             UPDATE
├── .gitignore                                             UPDATE
├── README.md                                              UPDATE
└── vitest.config.ts                                       CREATE
```

**Verantwoordelijkheid per file:**

- `lib/env.ts` — typed env validation (Zod) voor alle env vars; faalt build bij ontbrekende vars
- `lib/supabase/server.ts` — server-side Supabase client (RSC, server actions, route handlers)
- `lib/supabase/client.ts` — browser client (alleen voor admin reactiviteit later)
- `lib/supabase/middleware.ts` — session refresh helper voor `middleware.ts`
- `lib/auth.ts` — `assertAdmin()` helper + `getUser()` wrapper
- `middleware.ts` — runs on every request, refreshes session, redirects `/admin/*` zonder sessie
- `(admin)/layout.tsx` — 2e auth check (defense-in-depth) + sidebar shell
- `(public)/layout.tsx` — placeholder voor Plan 2
- `supabase/migrations/*` — DB schema + RLS policies + storage buckets

---

## Phase 0: Project setup

### Task 1: Create feature branch and prepare workspace

**Files:**
- N/A (git operation)

- [ ] **Step 1: Verify clean working tree on master**

```bash
git status
```
Expected output: `nothing to commit, working tree clean` (untracked build artifacts zoals `.next/` mogen blijven).

- [ ] **Step 2: Pull latest from origin and create feature branch**

```bash
git fetch origin
git checkout -b next-migration origin/master
```
Expected: `Switched to a new branch 'next-migration'` op origin/master HEAD.

- [ ] **Step 3: Push branch to remote and set upstream**

```bash
git push -u origin next-migration
```
Expected: branch tracked on `origin/next-migration`.

---

### Task 2: Move legacy code to `_legacy/`

**Files:**
- Move: alle bestaande Vite-files naar `_legacy/`

- [ ] **Step 1: Create `_legacy/` directory and move files**

```bash
mkdir -p _legacy
git mv App.tsx index.tsx index.html metadata.json _legacy/
git mv pages components services _legacy/
git mv vite.config.ts vite-env.d.ts next-env.d.ts _legacy/
git mv tsconfig.json _legacy/tsconfig.legacy.json
```
Expected: `git status` toont alle bestanden als `renamed:`.

- [ ] **Step 2: Move build artifacts that conflict**

```bash
rm -rf .next .playwright-mcp tsconfig.tsbuildinfo build.log
```
(Deze waren niet getrackt; ze veroorzaken anders rommel bij scaffold.)

- [ ] **Step 3: Verify only `_legacy/`, docs, README, package.json en config files staan in root**

```bash
ls -la | grep -v "^d" | awk '{print $NF}' | sort
```
Expected: `.env.local`, `.gitignore`, `config.ts`, `package-lock.json`, `package.json`, `README.md`, `types.ts` zichtbaar in root. Geen `App.tsx`, geen `pages/`.

- [ ] **Step 4: Move `config.ts` and `types.ts` to `_legacy/` ook**

```bash
git mv config.ts types.ts _legacy/
```
Expected: schoon root, alleen package.json + lockfile + README + .env.local + .gitignore.

- [ ] **Step 5: Commit**

```bash
git add -A
git commit -m "chore: move legacy Vite code to _legacy/ for clean Next.js scaffold"
```

---

### Task 3: Replace package.json with Next.js setup

**Files:**
- Replace: `package.json`

- [ ] **Step 1: Write new package.json**

Create `package.json` with this exact content:

```json
{
  "name": "bpm-parket",
  "version": "1.0.0",
  "private": true,
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start",
    "lint": "next lint",
    "typecheck": "tsc --noEmit",
    "test": "vitest run",
    "test:watch": "vitest",
    "test:e2e": "playwright test",
    "supabase:start": "supabase start",
    "supabase:reset": "supabase db reset",
    "supabase:push": "supabase db push",
    "seed:admin": "tsx scripts/seed-admin-user.ts"
  },
  "dependencies": {
    "@supabase/ssr": "^0.5.2",
    "@supabase/supabase-js": "^2.45.0",
    "lucide-react": "^0.562.0",
    "next": "15.1.0",
    "react": "19.0.0",
    "react-dom": "19.0.0",
    "zod": "^3.23.8"
  },
  "devDependencies": {
    "@playwright/test": "^1.48.0",
    "@tailwindcss/postcss": "^4.0.0",
    "@types/node": "^22.10.0",
    "@types/react": "^19.0.0",
    "@types/react-dom": "^19.0.0",
    "eslint": "^9.0.0",
    "eslint-config-next": "15.1.0",
    "tailwindcss": "^4.0.0",
    "tsx": "^4.19.0",
    "typescript": "^5.7.0",
    "vitest": "^2.1.0"
  }
}
```

- [ ] **Step 2: Remove old lockfile and install fresh**

```bash
rm package-lock.json
npm install
```
Expected: clean install. May see peer-dep warnings around React 19 — OK.

- [ ] **Step 3: Verify npm scripts work**

```bash
npx next --version
```
Expected: `15.x.x`

- [ ] **Step 4: Commit**

```bash
git add package.json package-lock.json
git commit -m "chore: replace Vite deps with Next.js 15, Supabase SSR, Tailwind v4"
```

---

### Task 4: Create base TypeScript and Next.js config

**Files:**
- Create: `tsconfig.json`
- Create: `next.config.ts`
- Create: `next-env.d.ts` (auto-generated, but commit gitignored version)

- [ ] **Step 1: Write tsconfig.json**

Create `tsconfig.json`:

```json
{
  "compilerOptions": {
    "target": "ES2022",
    "lib": ["dom", "dom.iterable", "esnext"],
    "allowJs": true,
    "skipLibCheck": true,
    "strict": true,
    "noEmit": true,
    "esModuleInterop": true,
    "module": "esnext",
    "moduleResolution": "bundler",
    "resolveJsonModule": true,
    "isolatedModules": true,
    "jsx": "preserve",
    "incremental": true,
    "plugins": [{ "name": "next" }],
    "paths": {
      "@/*": ["./*"]
    }
  },
  "include": ["next-env.d.ts", "**/*.ts", "**/*.tsx", ".next/types/**/*.ts"],
  "exclude": ["node_modules", "_legacy", "tests/e2e"]
}
```

- [ ] **Step 2: Write next.config.ts with security headers**

Create `next.config.ts`:

```ts
import type { NextConfig } from 'next';

const securityHeaders = [
  {
    key: 'Strict-Transport-Security',
    value: 'max-age=63072000; includeSubDomains; preload',
  },
  { key: 'X-Content-Type-Options', value: 'nosniff' },
  { key: 'X-Frame-Options', value: 'DENY' },
  { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
  {
    key: 'Permissions-Policy',
    value: 'camera=(), microphone=(), geolocation=()',
  },
];

const nextConfig: NextConfig = {
  reactStrictMode: true,
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**.supabase.co',
        pathname: '/storage/v1/object/public/**',
      },
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
    ],
  },
  async headers() {
    return [
      {
        source: '/:path*',
        headers: securityHeaders,
      },
    ];
  },
};

export default nextConfig;
```

- [ ] **Step 3: Run typecheck to generate next-env.d.ts**

```bash
npm run typecheck
```
Expected: PASS (creates `next-env.d.ts` automatically). Geen errors.

- [ ] **Step 4: Commit**

```bash
git add tsconfig.json next.config.ts next-env.d.ts
git commit -m "chore: add Next.js + TypeScript config with security headers"
```

---

### Task 5: Configure Tailwind v4

**Files:**
- Create: `postcss.config.mjs`
- Create: `app/globals.css`

- [ ] **Step 1: Write postcss.config.mjs**

Create `postcss.config.mjs`:

```js
export default {
  plugins: {
    '@tailwindcss/postcss': {},
  },
};
```

- [ ] **Step 2: Write app/globals.css with Tailwind v4 import + brand tokens**

Create `app/globals.css`:

```css
@import "tailwindcss";

@theme {
  --color-brand-primary: oklch(0.55 0.13 50);
  --color-brand-primary-dark: oklch(0.42 0.13 50);
  --color-brand-cream: oklch(0.97 0.01 80);
  --color-brand-charcoal: oklch(0.25 0 0);

  --font-sans: ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont,
    "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
}

html, body {
  background: var(--color-brand-cream);
  color: var(--color-brand-charcoal);
}
```

(Brand kleuren zijn placeholders — Plan 2 vult de exacte BPM warm-brown palette aan obv huidige Vite tokens.)

- [ ] **Step 3: Commit**

```bash
git add postcss.config.mjs app/globals.css
git commit -m "feat: configure Tailwind v4 with placeholder brand tokens"
```

---

### Task 6: Typed env validation

**Files:**
- Create: `lib/env.ts`
- Create: `.env.example`
- Update: `.env.local` (add new vars)

- [ ] **Step 1: Write lib/env.ts with Zod validation**

Create `lib/env.ts`:

```ts
import { z } from 'zod';

const serverSchema = z.object({
  NODE_ENV: z.enum(['development', 'test', 'production']).default('development'),

  NEXT_PUBLIC_SUPABASE_URL: z.string().url(),
  NEXT_PUBLIC_SUPABASE_ANON_KEY: z.string().min(20),

  SUPABASE_SERVICE_ROLE_KEY: z.string().min(20),

  ANTHROPIC_API_KEY: z.string().startsWith('sk-ant-').optional(),

  RESEND_API_KEY: z.string().startsWith('re_').optional(),

  NEXT_PUBLIC_SITE_URL: z.string().url().default('http://localhost:3000'),
});

const clientSchema = z.object({
  NEXT_PUBLIC_SUPABASE_URL: z.string().url(),
  NEXT_PUBLIC_SUPABASE_ANON_KEY: z.string().min(20),
  NEXT_PUBLIC_SITE_URL: z.string().url(),
});

const isServer = typeof window === 'undefined';

const parsed = isServer
  ? serverSchema.safeParse(process.env)
  : clientSchema.safeParse({
      NEXT_PUBLIC_SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL,
      NEXT_PUBLIC_SUPABASE_ANON_KEY: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
      NEXT_PUBLIC_SITE_URL: process.env.NEXT_PUBLIC_SITE_URL,
    });

if (!parsed.success) {
  console.error('Invalid environment variables:', parsed.error.flatten().fieldErrors);
  throw new Error('Invalid environment variables');
}

export const env = parsed.data;
```

- [ ] **Step 2: Write .env.example (commit-able template)**

Create `.env.example`:

```bash
# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key

# Anthropic (Plan 2)
ANTHROPIC_API_KEY=sk-ant-...

# Resend (Plan 2)
RESEND_API_KEY=re_...

# Site
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

- [ ] **Step 3: Update .env.local met nieuwe vars**

Voeg toe aan `.env.local` (bestaat al; voeg ontbrekende keys toe):

```bash
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

(Andere keys staan al in `.env.local` — `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`, `SUPABASE_SERVICE_ROLE_KEY`, `ANTHROPIC_API_KEY` — verifiëren dat ze er staan.)

- [ ] **Step 4: Verify .env.local is gitignored**

```bash
grep "^\.env" .gitignore
```
Expected: regel die `.env*` of specifiek `.env.local` matcht. Indien afwezig, voeg toe:

Update `.gitignore` (append):
```
# env files
.env*.local
.env

# next.js
.next/
out/

# legacy
_legacy/.next/

# misc
.DS_Store
```

- [ ] **Step 5: Run typecheck to verify env.ts**

```bash
npm run typecheck
```
Expected: PASS.

- [ ] **Step 6: Commit**

```bash
git add lib/env.ts .env.example .gitignore
git commit -m "feat: add typed env validation with Zod schema"
```

---

### Task 7: Vitest setup

**Files:**
- Create: `vitest.config.ts`

- [ ] **Step 1: Write vitest.config.ts**

Create `vitest.config.ts`:

```ts
import { defineConfig } from 'vitest/config';
import path from 'node:path';

export default defineConfig({
  test: {
    environment: 'node',
    include: ['lib/**/*.test.ts', 'app/**/*.test.ts'],
    exclude: ['_legacy/**', 'tests/e2e/**', 'node_modules/**'],
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, '.'),
    },
  },
});
```

- [ ] **Step 2: Verify vitest can run (no tests yet)**

```bash
npx vitest run
```
Expected: `No test files found` — exits 0 of 1, beide OK voor nu.

- [ ] **Step 3: Commit**

```bash
git add vitest.config.ts
git commit -m "chore: add Vitest config for unit tests"
```

---

## Phase 1: Foundation

### Task 8: Supabase server client

**Files:**
- Create: `lib/supabase/server.ts`

- [ ] **Step 1: Write lib/supabase/server.ts**

Create `lib/supabase/server.ts`:

```ts
import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';
import { env } from '@/lib/env';

export async function createClient() {
  const cookieStore = await cookies();

  return createServerClient(
    env.NEXT_PUBLIC_SUPABASE_URL,
    env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options),
            );
          } catch {
            // Called from a Server Component — safe to ignore;
            // middleware refreshes the session.
          }
        },
      },
    },
  );
}

export function createServiceClient() {
  // Bypass-RLS client. Use ONLY in admin server actions / route handlers
  // for explicitly admin-bypass operations (audit logs, seed scripts).
  // Never expose this client to the browser.
  const cookieStore = {
    getAll: () => [],
    setAll: () => {},
  };

  return createServerClient(
    env.NEXT_PUBLIC_SUPABASE_URL,
    env.SUPABASE_SERVICE_ROLE_KEY,
    {
      cookies: cookieStore,
      auth: { persistSession: false, autoRefreshToken: false },
    },
  );
}
```

- [ ] **Step 2: Run typecheck**

```bash
npm run typecheck
```
Expected: PASS.

- [ ] **Step 3: Commit**

```bash
git add lib/supabase/server.ts
git commit -m "feat: add Supabase server client with anon and service-role variants"
```

---

### Task 9: Supabase browser client

**Files:**
- Create: `lib/supabase/client.ts`

- [ ] **Step 1: Write lib/supabase/client.ts**

Create `lib/supabase/client.ts`:

```ts
'use client';

import { createBrowserClient } from '@supabase/ssr';
import { env } from '@/lib/env';

export function createClient() {
  return createBrowserClient(
    env.NEXT_PUBLIC_SUPABASE_URL,
    env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
  );
}
```

- [ ] **Step 2: Commit**

```bash
git add lib/supabase/client.ts
git commit -m "feat: add Supabase browser client for admin reactivity"
```

---

### Task 10: Supabase middleware helper

**Files:**
- Create: `lib/supabase/middleware.ts`

- [ ] **Step 1: Write lib/supabase/middleware.ts**

Create `lib/supabase/middleware.ts`:

```ts
import { createServerClient } from '@supabase/ssr';
import { NextResponse, type NextRequest } from 'next/server';
import { env } from '@/lib/env';

export async function updateSession(request: NextRequest) {
  let supabaseResponse = NextResponse.next({ request });

  const supabase = createServerClient(
    env.NEXT_PUBLIC_SUPABASE_URL,
    env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value));
          supabaseResponse = NextResponse.next({ request });
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options),
          );
        },
      },
    },
  );

  // Refresh the session cookie if needed.
  const {
    data: { user },
  } = await supabase.auth.getUser();

  // Protect /admin/* routes.
  if (
    request.nextUrl.pathname.startsWith('/admin') &&
    !user
  ) {
    const url = request.nextUrl.clone();
    url.pathname = '/login';
    url.searchParams.set('redirectedFrom', request.nextUrl.pathname);
    return NextResponse.redirect(url);
  }

  // Redirect logged-in users away from /login.
  if (request.nextUrl.pathname === '/login' && user) {
    const url = request.nextUrl.clone();
    url.pathname = '/admin';
    return NextResponse.redirect(url);
  }

  return supabaseResponse;
}
```

- [ ] **Step 2: Commit**

```bash
git add lib/supabase/middleware.ts
git commit -m "feat: add Supabase session middleware with admin route protection"
```

---

### Task 11: Root middleware.ts

**Files:**
- Create: `middleware.ts`

- [ ] **Step 1: Write middleware.ts**

Create `middleware.ts` in project root:

```ts
import type { NextRequest } from 'next/server';
import { updateSession } from '@/lib/supabase/middleware';

export async function middleware(request: NextRequest) {
  return await updateSession(request);
}

export const config = {
  matcher: [
    // Run on all routes except static assets, API, and _next internals.
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico)$).*)',
  ],
};
```

- [ ] **Step 2: Commit**

```bash
git add middleware.ts
git commit -m "feat: wire root middleware to refresh Supabase session"
```

---

### Task 12: Auth helper with TDD

**Files:**
- Create: `lib/auth.test.ts`
- Create: `lib/auth.ts`

- [ ] **Step 1: Write failing test for assertAdmin**

Create `lib/auth.test.ts`:

```ts
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { assertAdmin } from './auth';

vi.mock('@/lib/supabase/server', () => ({
  createClient: vi.fn(),
}));

describe('assertAdmin', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('returns the user when authenticated', async () => {
    const { createClient } = await import('@/lib/supabase/server');
    const mockUser = { id: 'user-123', email: 'bodhi@bpmparket.nl' };
    vi.mocked(createClient).mockResolvedValue({
      auth: {
        getUser: vi.fn().mockResolvedValue({ data: { user: mockUser }, error: null }),
      },
    } as never);

    const user = await assertAdmin();

    expect(user).toEqual(mockUser);
  });

  it('throws AuthError when no user is present', async () => {
    const { createClient } = await import('@/lib/supabase/server');
    vi.mocked(createClient).mockResolvedValue({
      auth: {
        getUser: vi.fn().mockResolvedValue({ data: { user: null }, error: null }),
      },
    } as never);

    await expect(assertAdmin()).rejects.toThrow('Not authenticated');
  });

  it('throws AuthError when getUser returns an error', async () => {
    const { createClient } = await import('@/lib/supabase/server');
    vi.mocked(createClient).mockResolvedValue({
      auth: {
        getUser: vi.fn().mockResolvedValue({
          data: { user: null },
          error: { message: 'JWT expired' },
        }),
      },
    } as never);

    await expect(assertAdmin()).rejects.toThrow('Not authenticated');
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

```bash
npm test
```
Expected: FAIL with `Cannot find module './auth'`.

- [ ] **Step 3: Write lib/auth.ts**

Create `lib/auth.ts`:

```ts
import { createClient } from '@/lib/supabase/server';
import type { User } from '@supabase/supabase-js';

export class AuthError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'AuthError';
  }
}

export async function getUser(): Promise<User | null> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  return user;
}

export async function assertAdmin(): Promise<User> {
  const supabase = await createClient();
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  if (error || !user) {
    throw new AuthError('Not authenticated');
  }

  return user;
}
```

- [ ] **Step 4: Run test to verify it passes**

```bash
npm test
```
Expected: PASS — 3 tests pass.

- [ ] **Step 5: Commit**

```bash
git add lib/auth.ts lib/auth.test.ts
git commit -m "feat: add assertAdmin auth helper with unit tests"
```

---

### Task 13: Initialize Supabase CLI for migrations

**Files:**
- Create: `supabase/config.toml`

- [ ] **Step 1: Install Supabase CLI if missing**

```bash
which supabase || brew install supabase/tap/supabase
```
Expected: `supabase` command available.

- [ ] **Step 2: Initialize Supabase config**

```bash
npx supabase init
```
This creates `supabase/config.toml` and `supabase/.gitignore`. Accept defaults.

- [ ] **Step 3: Link to existing Supabase project**

Get the project ref from the existing `NEXT_PUBLIC_SUPABASE_URL` in `.env.local` (the subdomain before `.supabase.co`):

```bash
npx supabase link --project-ref <your-project-ref>
```
You'll be prompted for the database password (from Supabase dashboard → Settings → Database).

Expected: `Finished supabase link`.

- [ ] **Step 4: Commit**

```bash
git add supabase/config.toml supabase/.gitignore
git commit -m "chore: initialize Supabase CLI and link to project"
```

---

### Task 14: Initial database schema migration

**Files:**
- Create: `supabase/migrations/20260504120000_initial_schema.sql`

- [ ] **Step 1: Write initial schema migration**

Create `supabase/migrations/20260504120000_initial_schema.sql`:

```sql
-- ============================================================
-- Initial schema for BPM Parket
-- ============================================================

-- Enable UUID generation
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ----- services -----
CREATE TABLE services (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  slug text UNIQUE NOT NULL,
  title text NOT NULL,
  hero_image text,
  body_md text,
  meta_title text,
  meta_description text,
  sort_order int DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- ----- projects -----
CREATE TABLE projects (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  slug text UNIQUE NOT NULL,
  title text NOT NULL,
  description text,
  long_description text,
  image_url text,
  gallery_image_urls text[] DEFAULT '{}',
  area_size int,
  location text,
  completed_date date,
  techniques text[] DEFAULT '{}',
  floor_type text,
  is_featured bool DEFAULT false,
  sort_order int DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- ----- gallery -----
CREATE TABLE gallery (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  image_url text NOT NULL,
  caption text,
  sort_order int DEFAULT 0,
  created_at timestamptz DEFAULT now()
);

-- ----- knowledge -----
CREATE TABLE knowledge (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  topic text NOT NULL,
  content text NOT NULL,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- ----- policies (privacy/cookies/terms content) -----
CREATE TABLE policies (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  slug text UNIQUE NOT NULL,
  title text NOT NULL,
  content_md text NOT NULL,
  last_updated timestamptz DEFAULT now()
);

-- ----- leads -----
CREATE TABLE leads (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  name text NOT NULL,
  email text NOT NULL,
  phone text NOT NULL,
  floor_type text,
  area_size int,
  message text,
  source text,
  status text DEFAULT 'new'
    CHECK (status IN ('new', 'contacted', 'completed')),
  ip_hash text,
  user_agent_hash text,
  created_at timestamptz DEFAULT now()
);

-- ----- appointments -----
CREATE TABLE appointments (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  customer_name text NOT NULL,
  customer_email text NOT NULL,
  customer_phone text,
  date timestamptz NOT NULL,
  notes text,
  source text
    CHECK (source IN ('chatbot', 'website', 'manual')),
  status text DEFAULT 'pending'
    CHECK (status IN ('pending', 'confirmed', 'cancelled')),
  ip_hash text,
  created_at timestamptz DEFAULT now()
);

-- ----- admin_settings (single-row) -----
CREATE TABLE admin_settings (
  id int PRIMARY KEY DEFAULT 1,
  chatbot_enabled bool DEFAULT true,
  system_prompt_extra text,
  phone text,
  whatsapp text,
  CHECK (id = 1)
);

INSERT INTO admin_settings (id) VALUES (1);

-- ----- updated_at trigger helper -----
CREATE OR REPLACE FUNCTION set_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER set_updated_at_services BEFORE UPDATE ON services
  FOR EACH ROW EXECUTE FUNCTION set_updated_at();

CREATE TRIGGER set_updated_at_projects BEFORE UPDATE ON projects
  FOR EACH ROW EXECUTE FUNCTION set_updated_at();

CREATE TRIGGER set_updated_at_knowledge BEFORE UPDATE ON knowledge
  FOR EACH ROW EXECUTE FUNCTION set_updated_at();

-- ----- indexes -----
CREATE INDEX idx_projects_slug ON projects(slug);
CREATE INDEX idx_projects_featured ON projects(is_featured, sort_order);
CREATE INDEX idx_services_slug ON services(slug);
CREATE INDEX idx_leads_status ON leads(status, created_at DESC);
CREATE INDEX idx_appointments_date ON appointments(date);
```

- [ ] **Step 2: Push migration to Supabase**

```bash
npx supabase db push
```
Expected: `Finished supabase db push`.

- [ ] **Step 3: Verify tables exist**

```bash
npx supabase db dump --schema public --data-only=false 2>&1 | grep "CREATE TABLE" | head -20
```
Expected: alle 8 tabellen zichtbaar.

- [ ] **Step 4: Commit**

```bash
git add supabase/migrations/20260504120000_initial_schema.sql
git commit -m "feat(db): initial schema for services, projects, gallery, leads, appointments"
```

---

### Task 15: RLS policies migration

**Files:**
- Create: `supabase/migrations/20260504120100_rls_policies.sql`

- [ ] **Step 1: Write RLS policies migration**

Create `supabase/migrations/20260504120100_rls_policies.sql`:

```sql
-- ============================================================
-- Row Level Security policies
-- ============================================================

-- ----- Public-readable, admin-managed -----

ALTER TABLE services ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public read services" ON services
  FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY "Authenticated write services" ON services
  FOR ALL TO authenticated USING (true) WITH CHECK (true);

ALTER TABLE projects ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public read projects" ON projects
  FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY "Authenticated write projects" ON projects
  FOR ALL TO authenticated USING (true) WITH CHECK (true);

ALTER TABLE gallery ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public read gallery" ON gallery
  FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY "Authenticated write gallery" ON gallery
  FOR ALL TO authenticated USING (true) WITH CHECK (true);

ALTER TABLE knowledge ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public read knowledge" ON knowledge
  FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY "Authenticated write knowledge" ON knowledge
  FOR ALL TO authenticated USING (true) WITH CHECK (true);

ALTER TABLE policies ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public read policies" ON policies
  FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY "Authenticated write policies" ON policies
  FOR ALL TO authenticated USING (true) WITH CHECK (true);

-- ----- Public can submit, authenticated manages -----

ALTER TABLE leads ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public can submit leads" ON leads
  FOR INSERT TO anon WITH CHECK (true);
CREATE POLICY "Authenticated read leads" ON leads
  FOR SELECT TO authenticated USING (true);
CREATE POLICY "Authenticated update leads" ON leads
  FOR UPDATE TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Authenticated delete leads" ON leads
  FOR DELETE TO authenticated USING (true);

ALTER TABLE appointments ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public can submit appointments" ON appointments
  FOR INSERT TO anon WITH CHECK (true);
CREATE POLICY "Authenticated read appointments" ON appointments
  FOR SELECT TO authenticated USING (true);
CREATE POLICY "Authenticated update appointments" ON appointments
  FOR UPDATE TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Authenticated delete appointments" ON appointments
  FOR DELETE TO authenticated USING (true);

-- ----- Admin only -----

ALTER TABLE admin_settings ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Authenticated read admin_settings" ON admin_settings
  FOR SELECT TO authenticated USING (true);
CREATE POLICY "Authenticated update admin_settings" ON admin_settings
  FOR UPDATE TO authenticated USING (true) WITH CHECK (true);
-- Public read for chatbot_enabled flag is handled via a server-side
-- function in Plan 2 that uses service role; the table itself remains
-- locked to authenticated.
```

- [ ] **Step 2: Push migration**

```bash
npx supabase db push
```
Expected: `Finished supabase db push`.

- [ ] **Step 3: Verify RLS is enabled on all tables**

```bash
npx supabase db dump --schema public --data-only=false 2>&1 | grep "ENABLE ROW LEVEL SECURITY"
```
Expected: 8 regels (één per tabel).

- [ ] **Step 4: Commit**

```bash
git add supabase/migrations/20260504120100_rls_policies.sql
git commit -m "feat(db): add RLS policies for all tables (vibe-security baseline)"
```

---

### Task 16: Storage buckets migration

**Files:**
- Create: `supabase/migrations/20260504120200_storage_buckets.sql`

- [ ] **Step 1: Write storage buckets migration**

Create `supabase/migrations/20260504120200_storage_buckets.sql`:

```sql
-- ============================================================
-- Storage buckets and policies
-- ============================================================

-- Public media bucket
INSERT INTO storage.buckets (id, name, public)
VALUES ('media', 'media', true)
ON CONFLICT (id) DO NOTHING;

-- Public read for media bucket
CREATE POLICY "Public can read media" ON storage.objects
  FOR SELECT TO anon, authenticated
  USING (bucket_id = 'media');

CREATE POLICY "Authenticated can upload media" ON storage.objects
  FOR INSERT TO authenticated
  WITH CHECK (bucket_id = 'media');

CREATE POLICY "Authenticated can update media" ON storage.objects
  FOR UPDATE TO authenticated
  USING (bucket_id = 'media') WITH CHECK (bucket_id = 'media');

CREATE POLICY "Authenticated can delete media" ON storage.objects
  FOR DELETE TO authenticated
  USING (bucket_id = 'media');
```

- [ ] **Step 2: Push migration**

```bash
npx supabase db push
```
Expected: `Finished supabase db push`.

- [ ] **Step 3: Commit**

```bash
git add supabase/migrations/20260504120200_storage_buckets.sql
git commit -m "feat(db): add public media storage bucket with RLS"
```

---

### Task 17: Seed admin user script

**Files:**
- Create: `scripts/seed-admin-user.ts`

- [ ] **Step 1: Write seed script**

Create `scripts/seed-admin-user.ts`:

```ts
/**
 * Seeds Bodhi as the admin user.
 *
 * Usage: npm run seed:admin
 *
 * Requires: SUPABASE_SERVICE_ROLE_KEY in .env.local
 *
 * Idempotent: re-running is safe; existing user is left untouched.
 */
import 'dotenv/config';
import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SERVICE_ROLE = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!SUPABASE_URL || !SERVICE_ROLE) {
  console.error('Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY');
  process.exit(1);
}

const ADMIN_EMAIL = process.env.SEED_ADMIN_EMAIL || 'bodhi@bpmparket.nl';
const ADMIN_PASSWORD = process.env.SEED_ADMIN_PASSWORD;

if (!ADMIN_PASSWORD) {
  console.error(
    'Missing SEED_ADMIN_PASSWORD env var. Set a strong temporary password:\n' +
    '  SEED_ADMIN_PASSWORD=temp-strong-password-change-on-first-login npm run seed:admin\n' +
    'Bodhi must change this on first login.',
  );
  process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SERVICE_ROLE, {
  auth: { persistSession: false, autoRefreshToken: false },
});

async function main() {
  const { data: existing } = await supabase.auth.admin.listUsers();
  const found = existing?.users.find((u) => u.email === ADMIN_EMAIL);

  if (found) {
    console.log(`✓ Admin user ${ADMIN_EMAIL} already exists (id: ${found.id})`);
    return;
  }

  const { data, error } = await supabase.auth.admin.createUser({
    email: ADMIN_EMAIL,
    password: ADMIN_PASSWORD,
    email_confirm: true,
  });

  if (error) {
    console.error('Failed to create admin user:', error.message);
    process.exit(1);
  }

  console.log(`✓ Created admin user ${ADMIN_EMAIL} (id: ${data.user.id})`);
  console.log('  Bodhi must change this password on first login.');
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
```

- [ ] **Step 2: Add dotenv as dev dependency**

```bash
npm install -D dotenv
```

- [ ] **Step 3: Run seed (with strong temp password)**

```bash
SEED_ADMIN_PASSWORD='Tijdelijk-Wachtwoord-2026!' npm run seed:admin
```
Expected: `✓ Created admin user bodhi@bpmparket.nl (id: ...)`.

- [ ] **Step 4: Verify in Supabase dashboard**

Open Supabase dashboard → Authentication → Users. Verifieer dat `bodhi@bpmparket.nl` bestaat.

- [ ] **Step 5: Commit**

```bash
git add scripts/seed-admin-user.ts package.json package-lock.json
git commit -m "feat: add idempotent admin user seed script"
```

---

### Task 18: Root layout

**Files:**
- Create: `app/layout.tsx`

- [ ] **Step 1: Write root layout**

Create `app/layout.tsx`:

```tsx
import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: { default: 'BPM Parket', template: '%s | BPM Parket' },
  description: 'Specialist in traditioneel parket, PVC vloeren en traprenovatie in Geldrop.',
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'),
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="nl">
      <body className="antialiased">{children}</body>
    </html>
  );
}
```

- [ ] **Step 2: Commit**

```bash
git add app/layout.tsx
git commit -m "feat: add root layout with default metadata"
```

---

### Task 19: Public layout + home placeholder

**Files:**
- Create: `app/(public)/layout.tsx`
- Create: `app/(public)/page.tsx`

- [ ] **Step 1: Write placeholder public layout**

Create `app/(public)/layout.tsx`:

```tsx
export default function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen flex flex-col">
      <header className="border-b border-black/10 px-6 py-4">
        <span className="font-semibold">BPM Parket</span>
        <span className="ml-3 text-sm text-black/60">— site komt eraan</span>
      </header>
      <main className="flex-1">{children}</main>
      <footer className="border-t border-black/10 px-6 py-4 text-sm text-black/60">
        © {new Date().getFullYear()} BPM Parket
      </footer>
    </div>
  );
}
```

- [ ] **Step 2: Write home placeholder page**

Create `app/(public)/page.tsx`:

```tsx
export default function HomePage() {
  return (
    <div className="mx-auto max-w-2xl px-6 py-24">
      <h1 className="text-3xl font-semibold">BPM Parket</h1>
      <p className="mt-4 text-black/70">
        De nieuwe site komt binnenkort. Ondertussen blijft de huidige Vite-versie
        beschikbaar tot de migratie klaar is.
      </p>
    </div>
  );
}
```

- [ ] **Step 3: Run dev server and verify it loads**

```bash
npm run dev
```
Open http://localhost:3000 — placeholder zichtbaar. Stop met Ctrl+C.

- [ ] **Step 4: Commit**

```bash
git add app/\(public\)
git commit -m "feat: add placeholder public layout and home page"
```

---

### Task 20: Login page + server action

**Files:**
- Create: `app/(admin)/login/page.tsx`
- Create: `app/(admin)/login/actions.ts`

- [ ] **Step 1: Write login server action**

Create `app/(admin)/login/actions.ts`:

```ts
'use server';

import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import { revalidatePath } from 'next/cache';
import { z } from 'zod';

const loginSchema = z.object({
  email: z.string().email('Ongeldig emailadres'),
  password: z.string().min(8, 'Wachtwoord moet minimaal 8 tekens zijn'),
  redirectTo: z.string().optional(),
});

export type LoginState = { error?: string };

export async function loginAction(
  _prev: LoginState,
  formData: FormData,
): Promise<LoginState> {
  const parsed = loginSchema.safeParse({
    email: formData.get('email'),
    password: formData.get('password'),
    redirectTo: formData.get('redirectTo') || undefined,
  });

  if (!parsed.success) {
    return { error: parsed.error.issues[0].message };
  }

  const supabase = await createClient();
  const { error } = await supabase.auth.signInWithPassword({
    email: parsed.data.email,
    password: parsed.data.password,
  });

  if (error) {
    return { error: 'Onjuist emailadres of wachtwoord' };
  }

  revalidatePath('/', 'layout');
  redirect(parsed.data.redirectTo && parsed.data.redirectTo.startsWith('/admin')
    ? parsed.data.redirectTo
    : '/admin');
}
```

- [ ] **Step 2: Write login page**

Create `app/(admin)/login/page.tsx`:

```tsx
'use client';

import { useActionState } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { loginAction, type LoginState } from './actions';

const initialState: LoginState = {};

export default function LoginPage() {
  const searchParams = useSearchParams();
  const redirectedFrom = searchParams.get('redirectedFrom') || '/admin';
  const [state, formAction, pending] = useActionState(loginAction, initialState);

  return (
    <div className="min-h-screen flex items-center justify-center bg-[var(--color-brand-cream)] px-6">
      <form
        action={formAction}
        className="w-full max-w-sm space-y-4 rounded-2xl bg-white p-8 shadow-sm"
      >
        <h1 className="text-2xl font-semibold">Inloggen</h1>
        <p className="text-sm text-black/60">Admin paneel BPM Parket</p>

        <input type="hidden" name="redirectTo" value={redirectedFrom} />

        <label className="block">
          <span className="text-sm font-medium">Email</span>
          <input
            type="email"
            name="email"
            required
            autoComplete="email"
            className="mt-1 w-full rounded-lg border border-black/10 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-brand-primary)]"
          />
        </label>

        <label className="block">
          <span className="text-sm font-medium">Wachtwoord</span>
          <input
            type="password"
            name="password"
            required
            autoComplete="current-password"
            className="mt-1 w-full rounded-lg border border-black/10 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-brand-primary)]"
          />
        </label>

        {state.error && (
          <p role="alert" className="text-sm text-red-700">
            {state.error}
          </p>
        )}

        <button
          type="submit"
          disabled={pending}
          className="w-full rounded-lg bg-[var(--color-brand-primary)] px-4 py-2.5 text-sm font-medium text-white disabled:opacity-50"
        >
          {pending ? 'Bezig…' : 'Inloggen'}
        </button>

        <p className="text-center text-sm">
          <Link href="/wachtwoord-reset" className="text-black/60 hover:text-black">
            Wachtwoord vergeten?
          </Link>
        </p>
      </form>
    </div>
  );
}
```

- [ ] **Step 3: Manual smoke test**

```bash
npm run dev
```
Open http://localhost:3000/login. Probeer in te loggen met `bodhi@bpmparket.nl` + het wachtwoord uit Task 17. Verwacht: redirect naar `/admin` (404 voor nu — die page volgt in Task 22).

Probeer ook fout wachtwoord. Verwacht: error message "Onjuist emailadres of wachtwoord".

Stop dev server.

- [ ] **Step 4: Commit**

```bash
git add app/\(admin\)/login
git commit -m "feat: add login page with email/password and redirectedFrom support"
```

---

### Task 21: Logout server action

**Files:**
- Create: `app/(admin)/logout/actions.ts`

- [ ] **Step 1: Write logout action**

Create `app/(admin)/logout/actions.ts`:

```ts
'use server';

import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import { revalidatePath } from 'next/cache';

export async function logoutAction() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  revalidatePath('/', 'layout');
  redirect('/login');
}
```

- [ ] **Step 2: Commit**

```bash
git add app/\(admin\)/logout
git commit -m "feat: add logout server action"
```

---

### Task 22: Admin layout (defense-in-depth) + dashboard placeholder + sidebar

**Files:**
- Create: `app/(admin)/layout.tsx`
- Create: `components/admin/Sidebar.tsx`
- Create: `app/(admin)/admin/page.tsx`

- [ ] **Step 1: Write Sidebar component**

Create `components/admin/Sidebar.tsx`:

```tsx
import Link from 'next/link';
import { logoutAction } from '@/app/(admin)/logout/actions';
import { LayoutDashboard, MessageSquare, Calendar, BookOpen, FolderOpen, Image, Settings, LogOut } from 'lucide-react';

const NAV = [
  { href: '/admin', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/admin/leads', label: 'Leads', icon: MessageSquare },
  { href: '/admin/afspraken', label: 'Afspraken', icon: Calendar },
  { href: '/admin/kennisbank', label: 'Kennisbank', icon: BookOpen },
  { href: '/admin/projecten', label: 'Projecten', icon: FolderOpen },
  { href: '/admin/gallery', label: 'Gallery', icon: Image },
  { href: '/admin/instellingen', label: 'Instellingen', icon: Settings },
];

export function Sidebar({ userEmail }: { userEmail: string }) {
  return (
    <aside className="w-60 shrink-0 border-r border-black/10 bg-white flex flex-col">
      <div className="px-5 py-5">
        <span className="font-semibold">BPM Parket</span>
        <span className="block text-xs text-black/50">Admin</span>
      </div>

      <nav className="flex-1 px-3 space-y-1">
        {NAV.map(({ href, label, icon: Icon }) => (
          <Link
            key={href}
            href={href}
            className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm text-black/70 hover:bg-black/5 hover:text-black"
          >
            <Icon className="h-4 w-4" />
            {label}
          </Link>
        ))}
      </nav>

      <div className="border-t border-black/10 p-4">
        <p className="text-xs text-black/60 truncate">{userEmail}</p>
        <form action={logoutAction} className="mt-2">
          <button
            type="submit"
            className="flex items-center gap-2 text-sm text-black/70 hover:text-black"
          >
            <LogOut className="h-4 w-4" />
            Uitloggen
          </button>
        </form>
      </div>
    </aside>
  );
}
```

- [ ] **Step 2: Write admin layout with auth gate**

Create `app/(admin)/layout.tsx`:

```tsx
import { redirect } from 'next/navigation';
import { getUser } from '@/lib/auth';
import { Sidebar } from '@/components/admin/Sidebar';

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await getUser();

  // Defense-in-depth: middleware already redirects, but layout-level
  // check protects against middleware bypass and ensures user is loaded
  // for sidebar display.
  if (!user) {
    redirect('/login');
  }

  return (
    <div className="min-h-screen flex bg-[var(--color-brand-cream)]">
      <Sidebar userEmail={user.email ?? ''} />
      <main className="flex-1 p-8">{children}</main>
    </div>
  );
}
```

**Note:** Login en wachtwoord-reset pagina's zitten ook in `(admin)` group voor co-locatie, maar moeten NIET door de auth gate. Daarom check `getUser()` hier maar redirect alleen op admin-routes — wait, dat klopt niet, deze layout omhult ALLES in `(admin)/`. We moeten login/reset pagina's daarbuiten zetten.

**Correctie:** Verplaats login en wachtwoord-reset naar root level (geen group), of gebruik twee aparte groups:
- `(admin)` — beschermd
- `(auth)` — login + wachtwoord-reset

- [ ] **Step 3: Restructure login + wachtwoord-reset to (auth) group**

```bash
mkdir -p "app/(auth)"
git mv "app/(admin)/login" "app/(auth)/login"
```

Update `app/(auth)/login/actions.ts` import paths if needed (none in this case — relative imports unchanged since both still under app/(auth)/login/).

- [ ] **Step 4: Add (auth) layout**

Create `app/(auth)/layout.tsx`:

```tsx
export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
```

- [ ] **Step 5: Write admin dashboard placeholder page**

Create `app/(admin)/admin/page.tsx`:

```tsx
import { getUser } from '@/lib/auth';

export default async function AdminDashboardPage() {
  const user = await getUser();

  return (
    <div>
      <h1 className="text-2xl font-semibold">Dashboard</h1>
      <p className="mt-2 text-sm text-black/60">
        Welkom, {user?.email}. De admin features volgen in Plan 3.
      </p>
    </div>
  );
}
```

- [ ] **Step 6: Manual smoke test**

```bash
npm run dev
```
1. Open http://localhost:3000/admin → redirect naar `/login` (geen sessie).
2. Log in met `bodhi@bpmparket.nl` → redirect naar `/admin`. Dashboard zichtbaar met sidebar.
3. Klik "Uitloggen" in sidebar → terug naar `/login`.
4. Open http://localhost:3000/login terwijl ingelogd → redirect naar `/admin` (middleware doet dit).

Stop dev server.

- [ ] **Step 7: Commit**

```bash
git add app/\(admin\) app/\(auth\) components/admin
git commit -m "feat: add admin layout with sidebar, defense-in-depth auth, and dashboard placeholder"
```

---

### Task 23: Password reset request page

**Files:**
- Create: `app/(auth)/wachtwoord-reset/page.tsx`
- Create: `app/(auth)/wachtwoord-reset/actions.ts`

- [ ] **Step 1: Write password reset action**

Create `app/(auth)/wachtwoord-reset/actions.ts`:

```ts
'use server';

import { createClient } from '@/lib/supabase/server';
import { env } from '@/lib/env';
import { z } from 'zod';

const resetSchema = z.object({
  email: z.string().email(),
});

export type ResetState = { error?: string; success?: boolean };

export async function requestResetAction(
  _prev: ResetState,
  formData: FormData,
): Promise<ResetState> {
  const parsed = resetSchema.safeParse({ email: formData.get('email') });

  if (!parsed.success) {
    return { error: 'Ongeldig emailadres' };
  }

  const supabase = await createClient();
  const { error } = await supabase.auth.resetPasswordForEmail(parsed.data.email, {
    redirectTo: `${env.NEXT_PUBLIC_SITE_URL}/wachtwoord-reset/bevestigen`,
  });

  // Always return success to prevent email enumeration.
  if (error) {
    console.error('Password reset error (not exposed to client):', error);
  }

  return { success: true };
}
```

- [ ] **Step 2: Write password reset page**

Create `app/(auth)/wachtwoord-reset/page.tsx`:

```tsx
'use client';

import { useActionState } from 'react';
import Link from 'next/link';
import { requestResetAction, type ResetState } from './actions';

const initialState: ResetState = {};

export default function PasswordResetPage() {
  const [state, formAction, pending] = useActionState(requestResetAction, initialState);

  return (
    <div className="min-h-screen flex items-center justify-center bg-[var(--color-brand-cream)] px-6">
      <form
        action={formAction}
        className="w-full max-w-sm space-y-4 rounded-2xl bg-white p-8 shadow-sm"
      >
        <h1 className="text-2xl font-semibold">Wachtwoord vergeten</h1>
        <p className="text-sm text-black/60">
          Vul je email in. We sturen je een link om je wachtwoord opnieuw in te stellen.
        </p>

        {state.success ? (
          <p className="text-sm text-green-700">
            Als dit emailadres bekend is bij ons, ontvang je binnen enkele minuten een
            reset-link.
          </p>
        ) : (
          <>
            <label className="block">
              <span className="text-sm font-medium">Email</span>
              <input
                type="email"
                name="email"
                required
                autoComplete="email"
                className="mt-1 w-full rounded-lg border border-black/10 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-brand-primary)]"
              />
            </label>

            {state.error && (
              <p role="alert" className="text-sm text-red-700">
                {state.error}
              </p>
            )}

            <button
              type="submit"
              disabled={pending}
              className="w-full rounded-lg bg-[var(--color-brand-primary)] px-4 py-2.5 text-sm font-medium text-white disabled:opacity-50"
            >
              {pending ? 'Bezig…' : 'Stuur reset-link'}
            </button>
          </>
        )}

        <p className="text-center text-sm">
          <Link href="/login" className="text-black/60 hover:text-black">
            Terug naar inloggen
          </Link>
        </p>
      </form>
    </div>
  );
}
```

- [ ] **Step 3: Commit**

```bash
git add app/\(auth\)/wachtwoord-reset/page.tsx app/\(auth\)/wachtwoord-reset/actions.ts
git commit -m "feat: add password reset request page (anti-enumeration)"
```

---

### Task 24: Password reset confirmation page

**Files:**
- Create: `app/(auth)/wachtwoord-reset/bevestigen/page.tsx`
- Create: `app/(auth)/wachtwoord-reset/bevestigen/actions.ts`

- [ ] **Step 1: Write reset-confirm action**

Create `app/(auth)/wachtwoord-reset/bevestigen/actions.ts`:

```ts
'use server';

import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import { revalidatePath } from 'next/cache';
import { z } from 'zod';

const updateSchema = z
  .object({
    password: z.string().min(12, 'Minimaal 12 tekens'),
    passwordConfirm: z.string(),
  })
  .refine((d) => d.password === d.passwordConfirm, {
    message: 'Wachtwoorden komen niet overeen',
    path: ['passwordConfirm'],
  });

export type UpdateState = { error?: string };

export async function updatePasswordAction(
  _prev: UpdateState,
  formData: FormData,
): Promise<UpdateState> {
  const parsed = updateSchema.safeParse({
    password: formData.get('password'),
    passwordConfirm: formData.get('passwordConfirm'),
  });

  if (!parsed.success) {
    return { error: parsed.error.issues[0].message };
  }

  const supabase = await createClient();

  // User session is set by Supabase via the magic link cookie.
  const { error } = await supabase.auth.updateUser({ password: parsed.data.password });

  if (error) {
    return { error: 'Sessie verlopen — vraag een nieuwe reset-link aan.' };
  }

  revalidatePath('/', 'layout');
  redirect('/admin');
}
```

- [ ] **Step 2: Write reset-confirm page**

Create `app/(auth)/wachtwoord-reset/bevestigen/page.tsx`:

```tsx
'use client';

import { useActionState } from 'react';
import { updatePasswordAction, type UpdateState } from './actions';

const initialState: UpdateState = {};

export default function PasswordResetConfirmPage() {
  const [state, formAction, pending] = useActionState(updatePasswordAction, initialState);

  return (
    <div className="min-h-screen flex items-center justify-center bg-[var(--color-brand-cream)] px-6">
      <form
        action={formAction}
        className="w-full max-w-sm space-y-4 rounded-2xl bg-white p-8 shadow-sm"
      >
        <h1 className="text-2xl font-semibold">Nieuw wachtwoord</h1>
        <p className="text-sm text-black/60">Kies een sterk wachtwoord van minimaal 12 tekens.</p>

        <label className="block">
          <span className="text-sm font-medium">Nieuw wachtwoord</span>
          <input
            type="password"
            name="password"
            required
            minLength={12}
            autoComplete="new-password"
            className="mt-1 w-full rounded-lg border border-black/10 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-brand-primary)]"
          />
        </label>

        <label className="block">
          <span className="text-sm font-medium">Bevestig wachtwoord</span>
          <input
            type="password"
            name="passwordConfirm"
            required
            minLength={12}
            autoComplete="new-password"
            className="mt-1 w-full rounded-lg border border-black/10 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-brand-primary)]"
          />
        </label>

        {state.error && (
          <p role="alert" className="text-sm text-red-700">
            {state.error}
          </p>
        )}

        <button
          type="submit"
          disabled={pending}
          className="w-full rounded-lg bg-[var(--color-brand-primary)] px-4 py-2.5 text-sm font-medium text-white disabled:opacity-50"
        >
          {pending ? 'Bezig…' : 'Wachtwoord opslaan'}
        </button>
      </form>
    </div>
  );
}
```

- [ ] **Step 3: Manual smoke test**

```bash
npm run dev
```
1. Open http://localhost:3000/wachtwoord-reset
2. Vul `bodhi@bpmparket.nl` in → success message verschijnt
3. Check Supabase dashboard → Authentication → Users → bodhi → kopieer reset link uit logs OF check inbox indien Supabase SMTP al werkt
4. Open reset link → kom op `/wachtwoord-reset/bevestigen` → vul nieuw wachtwoord in → redirect naar `/admin`

(Als Supabase email niet aankomt: dat is normaal in Plan 1; we configureren SMTP via Resend Auth Hook in Plan 2.)

Stop dev server.

- [ ] **Step 4: Commit**

```bash
git add app/\(auth\)/wachtwoord-reset/bevestigen
git commit -m "feat: add password reset confirmation page with strong password validation"
```

---

### Task 25: Playwright E2E test for auth flow

**Files:**
- Create: `playwright.config.ts`
- Create: `tests/e2e/auth.spec.ts`

- [ ] **Step 1: Install Playwright browsers**

```bash
npx playwright install chromium
```
Expected: chromium binary download.

- [ ] **Step 2: Write playwright.config.ts**

Create `playwright.config.ts`:

```ts
import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './tests/e2e',
  timeout: 30_000,
  expect: { timeout: 5_000 },
  fullyParallel: false,
  retries: 0,
  workers: 1,
  reporter: 'list',
  use: {
    baseURL: process.env.PLAYWRIGHT_BASE_URL || 'http://localhost:3000',
    trace: 'retain-on-failure',
  },
  projects: [
    { name: 'chromium', use: { ...devices['Desktop Chrome'] } },
  ],
  webServer: {
    command: 'npm run dev',
    url: 'http://localhost:3000',
    reuseExistingServer: !process.env.CI,
    timeout: 60_000,
  },
});
```

- [ ] **Step 3: Write E2E auth test**

Create `tests/e2e/auth.spec.ts`:

```ts
import { test, expect } from '@playwright/test';

const ADMIN_EMAIL = process.env.E2E_ADMIN_EMAIL || 'bodhi@bpmparket.nl';
const ADMIN_PASSWORD = process.env.E2E_ADMIN_PASSWORD;

test.describe('admin auth', () => {
  test.skip(!ADMIN_PASSWORD, 'E2E_ADMIN_PASSWORD not set — skipping login flow');

  test('redirects unauthenticated user from /admin to /login', async ({ page }) => {
    await page.goto('/admin');
    await expect(page).toHaveURL(/\/login/);
    await expect(page.getByRole('heading', { name: 'Inloggen' })).toBeVisible();
  });

  test('shows error on invalid credentials', async ({ page }) => {
    await page.goto('/login');
    await page.getByLabel('Email').fill(ADMIN_EMAIL);
    await page.getByLabel('Wachtwoord').fill('wrong-password-123');
    await page.getByRole('button', { name: 'Inloggen' }).click();
    await expect(page.getByRole('alert')).toContainText('Onjuist');
  });

  test('successful login redirects to /admin', async ({ page }) => {
    await page.goto('/login');
    await page.getByLabel('Email').fill(ADMIN_EMAIL);
    await page.getByLabel('Wachtwoord').fill(ADMIN_PASSWORD!);
    await page.getByRole('button', { name: 'Inloggen' }).click();
    await expect(page).toHaveURL(/\/admin$/);
    await expect(page.getByRole('heading', { name: 'Dashboard' })).toBeVisible();
  });

  test('logout returns to login page', async ({ page }) => {
    await page.goto('/login');
    await page.getByLabel('Email').fill(ADMIN_EMAIL);
    await page.getByLabel('Wachtwoord').fill(ADMIN_PASSWORD!);
    await page.getByRole('button', { name: 'Inloggen' }).click();
    await expect(page).toHaveURL(/\/admin$/);

    await page.getByRole('button', { name: 'Uitloggen' }).click();
    await expect(page).toHaveURL(/\/login/);
  });
});
```

- [ ] **Step 4: Run E2E test**

```bash
E2E_ADMIN_PASSWORD='Tijdelijk-Wachtwoord-2026!' npm run test:e2e
```
Expected: 4 tests pass (or 3 + 1 skipped if password not set, but we set it).

- [ ] **Step 5: Commit**

```bash
git add playwright.config.ts tests/e2e
git commit -m "test: add Playwright E2E tests for admin auth flow"
```

---

### Task 26: Configure Vercel project + env vars

**Files:**
- Modify: Vercel dashboard (no file changes)

- [ ] **Step 1: Link branch to Vercel**

Open Vercel dashboard → het bestaande BPM Parket project → Settings → Git. Verifieer dat `next-migration` branch automatisch preview deployments krijgt. Indien nodig: enable "Preview Deployments" voor alle branches.

- [ ] **Step 2: Add env vars on Vercel**

Vercel dashboard → Project → Settings → Environment Variables. Voeg deze toe (Production + Preview + Development scope):

| Name | Value |
|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` | (kopieer uit `.env.local`) |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | (kopieer uit `.env.local`) |
| `SUPABASE_SERVICE_ROLE_KEY` | (kopieer uit `.env.local`) |
| `NEXT_PUBLIC_SITE_URL` | `https://next-migration-...vercel.app` (Preview) en jouw productie domein (Production) |

`ANTHROPIC_API_KEY` en `RESEND_API_KEY` toevoegen in Plan 2.

- [ ] **Step 3: Push branch and verify preview deploy**

```bash
git push
```
Vercel triggert automatisch een Preview build. Wacht tot deployment klaar is (~2 min).

- [ ] **Step 4: Smoke test preview URL**

Open de Preview URL die Vercel teruggeeft. Verifieer:
1. `/` toont placeholder home
2. `/admin` redirect naar `/login`
3. Login werkt met Bodhi credentials
4. `/admin` toont dashboard

- [ ] **Step 5: No commit needed** (Vercel config is dashboard-side)

---

### Task 27: README update + Plan 1 closeout

**Files:**
- Update: `README.md`

- [ ] **Step 1: Write new README content**

Replace contents of `README.md`:

```markdown
# BPM Parket

Marketing website + admin paneel voor BPM Parket (Geldrop). Specialist in
traditioneel parket, PVC vloeren, laminaat, en traprenovatie.

## Stack

- **Next.js 15+** (App Router, React 19)
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

# 4. Seed admin user
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

- `app/` — Next.js App Router pages (public + admin)
- `components/` — shared React components
- `lib/` — Supabase clients, auth helpers, env validation
- `supabase/migrations/` — database schema and RLS
- `tests/e2e/` — Playwright tests
- `_legacy/` — old Vite codebase, kept for component reference during migration

## Status

Migration in progress. See:
- [Design spec](docs/superpowers/specs/2026-05-02-vite-to-nextjs-migration-design.md)
- [Plan 1: Foundation](docs/superpowers/plans/2026-05-04-nextjs-migration-plan-1-foundation.md) — current

The old Vite version remains live on `master` branch until migration completes.
```

- [ ] **Step 2: Final typecheck + lint + tests**

```bash
npm run typecheck && npm run lint && npm test
```
Expected: alles PASS.

- [ ] **Step 3: Commit and push**

```bash
git add README.md
git commit -m "docs: update README for Next.js + Supabase setup"
git push
```

- [ ] **Step 4: Verify Vercel preview is green**

Open Vercel dashboard → next-migration deployments → laatste deploy is "Ready". Klik door naar Preview URL en doe nog een korte smoke test.

---

## Self-Review Notes

**Spec coverage check:**
- ✅ Sectie 2 (architecture, folder structure) — Tasks 4, 8-11, 18-22
- ✅ Sectie 3 (URLs) — Login + admin URLs in place; rest in Plan 2
- ✅ Sectie 4 (data model + RLS) — Tasks 14, 15
- ✅ Sectie 5 (auth) — Tasks 12, 17, 20, 21, 23, 24
- ✅ Sectie 12 (vibe-security baseline) — RLS in T15, security headers in T4, env validation in T6, defense-in-depth in T22
- ⏭️ Sectie 6 (chatbot) — Plan 2
- ⏭️ Sectie 7 (lead capture) — Plan 2
- ⏭️ Sectie 8 (email) — Plan 2 (auth emails work via Supabase default during Plan 1)
- ⏭️ Sectie 9 (image storage) — Plan 1 buckets created (T16); upload UI in Plan 3
- ⏭️ Sectie 10 (SEO) — Plan 4
- ⏭️ Sectie 11 (analytics + GDPR) — Plan 4
- ✅ Sectie 13 (testing) — Vitest in T7, Playwright in T25
- ✅ Sectie 14 (migration sequence Phase 0+1) — Tasks 1-27

**Placeholder scan:** Geen "TODO", "TBD", of vage "implement later" stappen. Alle code blokken zijn compleet.

**Type consistency:** `LoginState`, `ResetState`, `UpdateState` types zijn consistent gedefinieerd. `assertAdmin` / `getUser` signatures matchen tussen `lib/auth.ts` en `lib/auth.test.ts`. Sidebar interface matcht admin layout call.

**Open punten voor uitvoering:**
- Bodhi moet temp password wijzigen na eerste login (zie T17 output message)
- Resend SMTP voor Supabase Auth emails wordt in Plan 2 geconfigureerd; tot dan komen reset emails uit Supabase default sender en moeten Bodhi het link uit Supabase dashboard logs halen indien email niet aankomt
- DNS / domein wisselen gebeurt pas in Plan 4 (Launch); preview URL is voldoende voor Plan 1 verificatie
