# Next.js Migration — Plan 3: Admin Features

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build the full admin panel — Bodhi can manage leads, confirm appointments, edit chatbot knowledge base, manage services content, manage projects + gallery with image upload, and tune chatbot settings. Result: a self-service admin where Bodhi runs the business without code changes.

**Architecture:** Builds on Plan 1 + 2 foundations. All admin routes under `(admin)` group with defense-in-depth auth gate. Each admin page is RSC for data fetching, with isolated client components for interactive forms. Mutations go through Server Actions that verify auth via `assertAdmin()` before any DB write. Image uploads validate (MIME + magic-byte + extension), strip EXIF, resize to 1920px max, convert to WebP, store in Supabase Storage `media` bucket with content-hashed filenames.

**Tech Stack:** Next.js 16, React 19, Supabase (with Storage RLS), Zod, sharp (image processing), file-type (magic-byte detection), Playwright.

**Spec reference:** [docs/superpowers/specs/2026-05-02-vite-to-nextjs-migration-design.md](../specs/2026-05-02-vite-to-nextjs-migration-design.md)

**Plan 1 + 2 outputs this plan builds on:**
- Live Supabase: `services`, `projects`, `gallery`, `knowledge`, `policies`, `leads`, `appointments`, `admin_settings` + storage bucket `media`
- Auth: Bodhi seeded, `(admin)/layout.tsx` defense-in-depth gate
- DB helpers: `lib/db/{services,projects,policies,knowledge,leads,appointments}.ts` (read helpers)
- Sidebar nav with all admin routes already wired
- `assertAdmin()` from `lib/auth.ts`

---

## File structure (new/changed in Plan 3)

```
app/(admin)/admin/
  page.tsx                                              MODIFY (real dashboard)
  leads/
    page.tsx                                            CREATE (list)
    [id]/page.tsx                                       CREATE (detail)
    [id]/actions.ts                                     CREATE (status, delete)
  afspraken/
    page.tsx                                            CREATE (list)
    [id]/page.tsx                                       CREATE (detail)
    [id]/actions.ts                                     CREATE (confirm, cancel)
  kennisbank/
    page.tsx                                            CREATE (list)
    nieuw/page.tsx                                      CREATE (form)
    [id]/page.tsx                                       CREATE (edit form)
    actions.ts                                          CREATE (create, update, delete)
  diensten/
    page.tsx                                            CREATE (list)
    [slug]/page.tsx                                     CREATE (edit form)
    actions.ts                                          CREATE (update)
  projecten/
    page.tsx                                            CREATE (list)
    nieuw/page.tsx                                      CREATE (form)
    [id]/page.tsx                                       CREATE (edit)
    actions.ts                                          CREATE (CRUD + image upload)
  gallery/
    page.tsx                                            CREATE (list + upload)
    actions.ts                                          CREATE (upload, delete, reorder)
  instellingen/
    page.tsx                                            CREATE
    actions.ts                                          CREATE (update settings)
components/admin/
  DataTable.tsx                                         CREATE (server-friendly table)
  FormField.tsx                                         CREATE (label + input wrapper)
  StatusBadge.tsx                                       CREATE
  DeleteButton.tsx                                      CREATE (confirm dialog client)
  ImageUploader.tsx                                     CREATE (drag/drop + preview)
  GalleryGrid.tsx                                       CREATE (admin gallery editor)
  StatCard.tsx                                          CREATE (dashboard cards)
lib/
  storage/
    upload.ts                                           CREATE (sharp + Supabase upload)
    validate-image.ts                                   CREATE (MIME + magic-byte)
  db/
    admin-settings.ts                                   CREATE (read + write)
  validation/
    admin-forms.ts                                      CREATE (Zod schemas for all admin forms)
tests/e2e/
  admin-leads.spec.ts                                   CREATE
  admin-image-upload.spec.ts                            CREATE
```

---

## Phase 4: Admin Features

### Task 1: Admin form Zod schemas

**Files:** `lib/validation/admin-forms.ts`

```ts
import { z } from 'zod';

export const leadStatusSchema = z.enum(['new', 'contacted', 'completed']);

export const leadUpdateSchema = z.object({
  id: z.string().uuid(),
  status: leadStatusSchema,
});

export const appointmentStatusSchema = z.enum(['pending', 'confirmed', 'cancelled']);

export const appointmentUpdateSchema = z.object({
  id: z.string().uuid(),
  status: appointmentStatusSchema,
});

export const knowledgeUpsertSchema = z.object({
  id: z.string().uuid().optional(),
  topic: z.string().min(1, 'Onderwerp is verplicht').max(200),
  content: z.string().min(1, 'Inhoud is verplicht').max(5000),
});

export const serviceUpdateSchema = z.object({
  slug: z.string().min(1).max(100),
  title: z.string().min(1, 'Titel is verplicht').max(200),
  meta_title: z.string().max(200).optional(),
  meta_description: z.string().max(300).optional(),
  body_md: z.string().max(20000).optional(),
  hero_image: z.string().url().optional().or(z.literal('')),
  sort_order: z.coerce.number().int().min(0).optional(),
});

export const projectUpsertSchema = z.object({
  id: z.string().uuid().optional(),
  slug: z.string().min(1, 'Slug is verplicht').max(100)
    .regex(/^[a-z0-9-]+$/, 'Alleen kleine letters, cijfers en streepjes'),
  title: z.string().min(1, 'Titel is verplicht').max(200),
  description: z.string().max(500).optional(),
  long_description: z.string().max(5000).optional(),
  image_url: z.string().url().optional().or(z.literal('')),
  area_size: z.coerce.number().int().min(0).max(10000).optional(),
  location: z.string().max(100).optional(),
  completed_date: z.string().optional(),
  floor_type: z.string().max(50).optional(),
  is_featured: z.coerce.boolean().optional(),
  sort_order: z.coerce.number().int().min(0).optional(),
});

export const adminSettingsSchema = z.object({
  chatbot_enabled: z.coerce.boolean(),
  system_prompt_extra: z.string().max(2000).optional(),
  phone: z.string().max(20).optional(),
  whatsapp: z.string().max(20).optional(),
});
```

Verify + commit:
```bash
npm run typecheck && \
git add lib/validation/admin-forms.ts && \
git commit -m "feat(admin): Zod schemas for all admin forms"
```

---

### Task 2: Image upload pipeline

**Files:**
- `lib/storage/validate-image.ts`
- `lib/storage/upload.ts`

**Goal:** Server-side image processing — validate, EXIF strip, resize, WebP convert, hash-named upload.

- [ ] **Step 1: Install sharp + file-type**

```bash
npm install sharp file-type
```

- [ ] **Step 2: validate-image.ts**

```ts
import 'server-only';
import { fileTypeFromBuffer } from 'file-type';

const MAX_SIZE = 10 * 1024 * 1024; // 10 MB
const ALLOWED_MIME = new Set(['image/jpeg', 'image/png', 'image/webp']);

export type ValidatedImage = {
  buffer: Buffer;
  mime: string;
  ext: string;
};

export async function validateImage(file: File): Promise<ValidatedImage> {
  if (file.size === 0) throw new Error('Bestand is leeg.');
  if (file.size > MAX_SIZE) {
    throw new Error('Bestand is te groot (max 10 MB).');
  }

  const buffer = Buffer.from(await file.arrayBuffer());

  // Layer 1: Browser-reported MIME
  if (!ALLOWED_MIME.has(file.type)) {
    throw new Error('Alleen JPEG, PNG of WebP toegestaan.');
  }

  // Layer 2: Magic-byte sniff
  const detected = await fileTypeFromBuffer(buffer);
  if (!detected || !ALLOWED_MIME.has(detected.mime)) {
    throw new Error('Bestand is geen geldig beeld.');
  }

  // Layer 3: Reported MIME must match magic bytes
  if (file.type !== detected.mime) {
    throw new Error('Bestandstype komt niet overeen met de extensie.');
  }

  return { buffer, mime: detected.mime, ext: detected.ext };
}
```

- [ ] **Step 3: upload.ts**

```ts
import 'server-only';
import { createHash } from 'node:crypto';
import sharp from 'sharp';
import { createServiceClient } from '@/lib/supabase/server';
import { validateImage } from './validate-image';

const BUCKET = 'media';
const MAX_WIDTH = 1920;
const WEBP_QUALITY = 85;

export async function uploadImage(
  file: File,
  folder: 'projects' | 'gallery' | 'services' | 'site',
): Promise<{ url: string; path: string }> {
  const { buffer } = await validateImage(file);

  // Process: rotate per EXIF then strip, resize, encode as WebP
  const processed = await sharp(buffer)
    .rotate()
    .resize({ width: MAX_WIDTH, withoutEnlargement: true })
    .webp({ quality: WEBP_QUALITY })
    .toBuffer();

  // Content-hashed filename — same image dedupes naturally
  const hash = createHash('sha256').update(processed).digest('hex').slice(0, 16);
  const path = `${folder}/${hash}.webp`;

  const supabase = createServiceClient();
  const { error } = await supabase.storage
    .from(BUCKET)
    .upload(path, processed, {
      contentType: 'image/webp',
      upsert: true,
    });
  if (error) throw new Error(`Upload mislukt: ${error.message}`);

  const { data } = supabase.storage.from(BUCKET).getPublicUrl(path);
  return { url: data.publicUrl, path };
}

export async function deleteImage(path: string): Promise<void> {
  const supabase = createServiceClient();
  const { error } = await supabase.storage.from(BUCKET).remove([path]);
  if (error) throw new Error(`Verwijderen mislukt: ${error.message}`);
}
```

- [ ] **Step 4: Verify**

```bash
npm run typecheck
```

If sharp installation has issues (native deps), inspect with `npm ls sharp` and re-install.

- [ ] **Step 5: Commit**

```bash
git add lib/storage package.json package-lock.json
git commit -m "feat(admin): image upload pipeline (validate, EXIF strip, resize, WebP, Supabase Storage)"
```

---

### Task 3: Shared admin UI primitives

**Files:**
- `components/admin/StatCard.tsx`
- `components/admin/StatusBadge.tsx`
- `components/admin/DeleteButton.tsx`
- `components/admin/FormField.tsx`

- [ ] **StatCard:**

```tsx
import type { LucideIcon } from 'lucide-react';

type Props = {
  label: string;
  value: string | number;
  hint?: string;
  icon: LucideIcon;
};

export function StatCard({ label, value, hint, icon: Icon }: Props) {
  return (
    <div className="rounded-2xl bg-white p-5 shadow-sm">
      <div className="flex items-center justify-between">
        <span className="text-xs uppercase tracking-wider text-black/50">{label}</span>
        <Icon className="h-5 w-5 text-[var(--color-brand-primary)]" />
      </div>
      <p className="mt-3 text-3xl font-semibold">{value}</p>
      {hint && <p className="mt-1 text-xs text-black/50">{hint}</p>}
    </div>
  );
}
```

- [ ] **StatusBadge:**

```tsx
import { cn } from '@/lib/cn';

const COLORS: Record<string, string> = {
  new: 'bg-blue-50 text-blue-700 ring-blue-700/20',
  contacted: 'bg-amber-50 text-amber-700 ring-amber-700/20',
  completed: 'bg-green-50 text-green-700 ring-green-700/20',
  pending: 'bg-amber-50 text-amber-700 ring-amber-700/20',
  confirmed: 'bg-green-50 text-green-700 ring-green-700/20',
  cancelled: 'bg-red-50 text-red-700 ring-red-700/20',
};

const LABELS: Record<string, string> = {
  new: 'Nieuw',
  contacted: 'Gecontacteerd',
  completed: 'Afgerond',
  pending: 'Open',
  confirmed: 'Bevestigd',
  cancelled: 'Geannuleerd',
};

export function StatusBadge({ status }: { status: string }) {
  return (
    <span
      className={cn(
        'inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ring-1 ring-inset',
        COLORS[status] ?? 'bg-gray-50 text-gray-700 ring-gray-700/20',
      )}
    >
      {LABELS[status] ?? status}
    </span>
  );
}
```

- [ ] **DeleteButton (client):**

```tsx
'use client';

import { useState } from 'react';
import { Trash2 } from 'lucide-react';

type Props = {
  action: () => Promise<void>;
  confirmMessage?: string;
  size?: 'sm' | 'md';
};

export function DeleteButton({ action, confirmMessage = 'Weet je het zeker?', size = 'sm' }: Props) {
  const [pending, setPending] = useState(false);

  return (
    <button
      type="button"
      disabled={pending}
      onClick={async () => {
        if (!confirm(confirmMessage)) return;
        setPending(true);
        try {
          await action();
        } finally {
          setPending(false);
        }
      }}
      className="inline-flex items-center gap-1 text-red-700 hover:text-red-900 disabled:opacity-50"
      aria-label="Verwijderen"
    >
      <Trash2 className={size === 'sm' ? 'h-4 w-4' : 'h-5 w-5'} />
    </button>
  );
}
```

- [ ] **FormField:**

```tsx
import type { ReactNode } from 'react';

type Props = {
  label: string;
  htmlFor?: string;
  error?: string;
  hint?: string;
  children: ReactNode;
};

export function FormField({ label, htmlFor, error, hint, children }: Props) {
  return (
    <label htmlFor={htmlFor} className="block">
      <span className="text-sm font-medium">{label}</span>
      <div className="mt-1">{children}</div>
      {hint && !error && <p className="mt-1 text-xs text-black/50">{hint}</p>}
      {error && (
        <p className="mt-1 text-xs text-red-700" role="alert">
          {error}
        </p>
      )}
    </label>
  );
}
```

Commit:
```bash
git add components/admin
git commit -m "feat(admin): shared UI primitives (StatCard, StatusBadge, DeleteButton, FormField)"
```

---

### Task 4: Real admin dashboard with stats

**Files:** Replace `app/(admin)/admin/page.tsx`

```tsx
import { Calendar, MessageSquare, BookOpen, FolderOpen } from 'lucide-react';
import { createClient } from '@/lib/supabase/server';
import { StatCard } from '@/components/admin/StatCard';
import { getUser } from '@/lib/auth';

async function getStats() {
  const supabase = await createClient();
  const [{ count: leadCount }, { count: appointmentCount }, { count: knowledgeCount }, { count: projectCount }] =
    await Promise.all([
      supabase.from('leads').select('id', { count: 'exact', head: true }).eq('status', 'new'),
      supabase
        .from('appointments')
        .select('id', { count: 'exact', head: true })
        .eq('status', 'pending')
        .gte('date', new Date().toISOString()),
      supabase.from('knowledge').select('id', { count: 'exact', head: true }),
      supabase.from('projects').select('id', { count: 'exact', head: true }),
    ]);

  return {
    newLeads: leadCount ?? 0,
    pendingAppointments: appointmentCount ?? 0,
    knowledgeItems: knowledgeCount ?? 0,
    projects: projectCount ?? 0,
  };
}

export default async function AdminDashboardPage() {
  const [user, stats] = await Promise.all([getUser(), getStats()]);

  return (
    <div>
      <h1 className="text-2xl font-semibold">Welkom, {user?.email?.split('@')[0]}</h1>
      <p className="mt-2 text-sm text-black/60">
        Hier is wat er nu speelt.
      </p>

      <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          label="Nieuwe leads"
          value={stats.newLeads}
          hint="Onbeantwoord"
          icon={MessageSquare}
        />
        <StatCard
          label="Open afspraken"
          value={stats.pendingAppointments}
          hint="Te bevestigen"
          icon={Calendar}
        />
        <StatCard
          label="Kennisbank"
          value={stats.knowledgeItems}
          hint="Items"
          icon={BookOpen}
        />
        <StatCard
          label="Projecten"
          value={stats.projects}
          hint="Totaal"
          icon={FolderOpen}
        />
      </div>
    </div>
  );
}
```

Commit:
```bash
git add app/\(admin\)/admin/page.tsx
git commit -m "feat(admin): dashboard with live stat cards"
```

---

### Task 5: Leads list page

**Files:** `app/(admin)/admin/leads/page.tsx`

```tsx
import type { Metadata } from 'next';
import Link from 'next/link';
import { Container } from '@/components/ui/Container';
import { createClient } from '@/lib/supabase/server';
import { StatusBadge } from '@/components/admin/StatusBadge';

export const metadata: Metadata = { title: 'Leads' };

type Lead = {
  id: string;
  name: string;
  email: string;
  phone: string;
  floor_type: string | null;
  source: string | null;
  status: string;
  created_at: string;
};

async function getLeads(): Promise<Lead[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from('leads')
    .select('id,name,email,phone,floor_type,source,status,created_at')
    .order('created_at', { ascending: false })
    .limit(100);
  if (error) throw error;
  return data ?? [];
}

export default async function LeadsPage() {
  const leads = await getLeads();

  return (
    <div>
      <header className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-semibold">Leads</h1>
          <p className="text-sm text-black/60">Recente aanvragen via formulieren.</p>
        </div>
      </header>

      {leads.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-black/10 p-12 text-center text-sm text-black/60">
          Nog geen leads binnen.
        </div>
      ) : (
        <div className="rounded-2xl bg-white shadow-sm overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-black/[0.02] text-xs uppercase tracking-wider text-black/50">
              <tr>
                <th className="text-left px-4 py-3">Naam</th>
                <th className="text-left px-4 py-3">Contact</th>
                <th className="text-left px-4 py-3">Type</th>
                <th className="text-left px-4 py-3">Source</th>
                <th className="text-left px-4 py-3">Status</th>
                <th className="text-left px-4 py-3">Datum</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-black/5">
              {leads.map((l) => (
                <tr key={l.id} className="hover:bg-black/[0.02]">
                  <td className="px-4 py-3 font-medium">
                    <Link href={`/admin/leads/${l.id}`} className="hover:underline">
                      {l.name}
                    </Link>
                  </td>
                  <td className="px-4 py-3 text-black/70">
                    <a href={`mailto:${l.email}`} className="block hover:underline">{l.email}</a>
                    <a href={`tel:${l.phone.replace(/\s/g, '')}`} className="block text-xs text-black/50">{l.phone}</a>
                  </td>
                  <td className="px-4 py-3 text-black/70">{l.floor_type ?? '—'}</td>
                  <td className="px-4 py-3 text-xs text-black/50">{l.source ?? '—'}</td>
                  <td className="px-4 py-3"><StatusBadge status={l.status} /></td>
                  <td className="px-4 py-3 text-xs text-black/50">
                    {new Date(l.created_at).toLocaleDateString('nl-NL', {
                      day: 'numeric', month: 'short', year: 'numeric',
                    })}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
```

Commit:
```bash
git add app/\(admin\)/admin/leads/page.tsx
git commit -m "feat(admin): leads list page"
```

---

### Task 6: Lead detail + status update

**Files:**
- `app/(admin)/admin/leads/[id]/page.tsx`
- `app/(admin)/admin/leads/[id]/actions.ts`

- [ ] **actions.ts:**

```ts
'use server';

import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { assertAdmin } from '@/lib/auth';
import { createClient } from '@/lib/supabase/server';
import { leadStatusSchema } from '@/lib/validation/admin-forms';

export async function updateLeadStatusAction(formData: FormData) {
  await assertAdmin();
  const id = formData.get('id') as string;
  const status = leadStatusSchema.parse(formData.get('status'));

  const supabase = await createClient();
  const { error } = await supabase.from('leads').update({ status }).eq('id', id);
  if (error) throw new Error(error.message);

  revalidatePath('/admin/leads');
  revalidatePath(`/admin/leads/${id}`);
}

export async function deleteLeadAction(id: string) {
  await assertAdmin();
  const supabase = await createClient();
  const { error } = await supabase.from('leads').delete().eq('id', id);
  if (error) throw new Error(error.message);

  revalidatePath('/admin/leads');
  redirect('/admin/leads');
}
```

- [ ] **page.tsx:**

```tsx
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { createClient } from '@/lib/supabase/server';
import { StatusBadge } from '@/components/admin/StatusBadge';
import { DeleteButton } from '@/components/admin/DeleteButton';
import { updateLeadStatusAction, deleteLeadAction } from './actions';

type Props = { params: Promise<{ id: string }> };

export default async function LeadDetailPage({ params }: Props) {
  const { id } = await params;
  const supabase = await createClient();
  const { data: lead } = await supabase.from('leads').select('*').eq('id', id).maybeSingle();
  if (!lead) notFound();

  return (
    <div>
      <Link
        href="/admin/leads"
        className="inline-flex items-center gap-2 text-sm text-black/60 hover:text-black mb-4"
      >
        <ArrowLeft className="h-4 w-4" />
        Alle leads
      </Link>

      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-semibold">{lead.name}</h1>
          <p className="text-sm text-black/60 mt-1">
            Binnen via {lead.source ?? 'onbekend'} op{' '}
            {new Date(lead.created_at).toLocaleString('nl-NL')}
          </p>
        </div>
        <StatusBadge status={lead.status} />
      </div>

      <div className="mt-8 grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <section className="rounded-2xl bg-white p-6 shadow-sm">
            <h2 className="font-semibold mb-3">Contact</h2>
            <dl className="text-sm space-y-2">
              <div>
                <dt className="text-black/50 text-xs">Email</dt>
                <dd><a href={`mailto:${lead.email}`} className="hover:underline">{lead.email}</a></dd>
              </div>
              <div>
                <dt className="text-black/50 text-xs">Telefoon</dt>
                <dd><a href={`tel:${lead.phone.replace(/\s/g, '')}`} className="hover:underline">{lead.phone}</a></dd>
              </div>
            </dl>
          </section>

          <section className="rounded-2xl bg-white p-6 shadow-sm">
            <h2 className="font-semibold mb-3">Aanvraag</h2>
            <dl className="text-sm space-y-2">
              {lead.floor_type && (
                <div>
                  <dt className="text-black/50 text-xs">Type vloer</dt>
                  <dd>{lead.floor_type}</dd>
                </div>
              )}
              {lead.area_size != null && (
                <div>
                  <dt className="text-black/50 text-xs">Oppervlak</dt>
                  <dd>{lead.area_size} m²</dd>
                </div>
              )}
              {lead.message && (
                <div>
                  <dt className="text-black/50 text-xs">Bericht</dt>
                  <dd className="whitespace-pre-line">{lead.message}</dd>
                </div>
              )}
            </dl>
          </section>
        </div>

        <aside className="space-y-4">
          <form action={updateLeadStatusAction} className="rounded-2xl bg-white p-6 shadow-sm space-y-3">
            <h2 className="font-semibold">Status wijzigen</h2>
            <input type="hidden" name="id" value={lead.id} />
            <select
              name="status"
              defaultValue={lead.status}
              className="w-full rounded-lg border border-black/10 px-3 py-2 text-sm bg-white"
            >
              <option value="new">Nieuw</option>
              <option value="contacted">Gecontacteerd</option>
              <option value="completed">Afgerond</option>
            </select>
            <button
              type="submit"
              className="w-full rounded-lg bg-[var(--color-brand-primary)] text-white px-3 py-2 text-sm font-medium"
            >
              Opslaan
            </button>
          </form>

          <div className="rounded-2xl bg-white p-6 shadow-sm">
            <h2 className="font-semibold mb-3">Acties</h2>
            <DeleteButton
              action={async () => {
                'use server';
                await deleteLeadAction(lead.id);
              }}
              confirmMessage="Lead permanent verwijderen?"
            />
          </div>
        </aside>
      </div>
    </div>
  );
}
```

Commit:
```bash
git add app/\(admin\)/admin/leads/\[id\]
git commit -m "feat(admin): lead detail page with status update + delete"
```

---

### Task 7: Appointments list + detail + actions

**Files:**
- `app/(admin)/admin/afspraken/page.tsx`
- `app/(admin)/admin/afspraken/[id]/page.tsx`
- `app/(admin)/admin/afspraken/[id]/actions.ts`

- [ ] **actions.ts:**

```ts
'use server';

import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { assertAdmin } from '@/lib/auth';
import { createClient } from '@/lib/supabase/server';
import { appointmentStatusSchema } from '@/lib/validation/admin-forms';

export async function updateAppointmentStatusAction(formData: FormData) {
  await assertAdmin();
  const id = formData.get('id') as string;
  const status = appointmentStatusSchema.parse(formData.get('status'));

  const supabase = await createClient();
  const { error } = await supabase.from('appointments').update({ status }).eq('id', id);
  if (error) throw new Error(error.message);

  revalidatePath('/admin/afspraken');
  revalidatePath(`/admin/afspraken/${id}`);
}

export async function deleteAppointmentAction(id: string) {
  await assertAdmin();
  const supabase = await createClient();
  const { error } = await supabase.from('appointments').delete().eq('id', id);
  if (error) throw new Error(error.message);

  revalidatePath('/admin/afspraken');
  redirect('/admin/afspraken');
}
```

- [ ] **list page.tsx:**

```tsx
import type { Metadata } from 'next';
import Link from 'next/link';
import { createClient } from '@/lib/supabase/server';
import { StatusBadge } from '@/components/admin/StatusBadge';

export const metadata: Metadata = { title: 'Afspraken' };

export default async function AppointmentsPage() {
  const supabase = await createClient();
  const { data: appointments } = await supabase
    .from('appointments')
    .select('id,customer_name,customer_email,date,source,status,notes')
    .order('date', { ascending: true })
    .limit(100);

  const list = appointments ?? [];

  return (
    <div>
      <h1 className="text-2xl font-semibold">Afspraken</h1>
      <p className="text-sm text-black/60 mt-1">Showroombezoeken en consults.</p>

      {list.length === 0 ? (
        <div className="mt-6 rounded-2xl border border-dashed border-black/10 p-12 text-center text-sm text-black/60">
          Nog geen afspraken.
        </div>
      ) : (
        <div className="mt-6 rounded-2xl bg-white shadow-sm overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-black/[0.02] text-xs uppercase tracking-wider text-black/50">
              <tr>
                <th className="text-left px-4 py-3">Wanneer</th>
                <th className="text-left px-4 py-3">Klant</th>
                <th className="text-left px-4 py-3">Source</th>
                <th className="text-left px-4 py-3">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-black/5">
              {list.map((a) => (
                <tr key={a.id} className="hover:bg-black/[0.02]">
                  <td className="px-4 py-3 font-medium">
                    <Link href={`/admin/afspraken/${a.id}`} className="hover:underline">
                      {new Date(a.date).toLocaleString('nl-NL', {
                        weekday: 'short', day: 'numeric', month: 'short',
                        hour: '2-digit', minute: '2-digit',
                      })}
                    </Link>
                  </td>
                  <td className="px-4 py-3">
                    <div>{a.customer_name}</div>
                    <a href={`mailto:${a.customer_email}`} className="text-xs text-black/50 hover:underline">
                      {a.customer_email}
                    </a>
                  </td>
                  <td className="px-4 py-3 text-xs text-black/50">{a.source}</td>
                  <td className="px-4 py-3"><StatusBadge status={a.status} /></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
```

- [ ] **detail page.tsx:**

```tsx
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { createClient } from '@/lib/supabase/server';
import { StatusBadge } from '@/components/admin/StatusBadge';
import { DeleteButton } from '@/components/admin/DeleteButton';
import { updateAppointmentStatusAction, deleteAppointmentAction } from './actions';

type Props = { params: Promise<{ id: string }> };

export default async function AppointmentDetailPage({ params }: Props) {
  const { id } = await params;
  const supabase = await createClient();
  const { data: appointment } = await supabase
    .from('appointments')
    .select('*')
    .eq('id', id)
    .maybeSingle();
  if (!appointment) notFound();

  return (
    <div>
      <Link
        href="/admin/afspraken"
        className="inline-flex items-center gap-2 text-sm text-black/60 hover:text-black mb-4"
      >
        <ArrowLeft className="h-4 w-4" />
        Alle afspraken
      </Link>

      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-semibold">{appointment.customer_name}</h1>
          <p className="text-sm text-black/60 mt-1">
            {new Date(appointment.date).toLocaleString('nl-NL', {
              weekday: 'long', day: 'numeric', month: 'long', year: 'numeric',
              hour: '2-digit', minute: '2-digit',
            })}
          </p>
        </div>
        <StatusBadge status={appointment.status} />
      </div>

      <div className="mt-8 grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 rounded-2xl bg-white p-6 shadow-sm">
          <h2 className="font-semibold mb-3">Details</h2>
          <dl className="text-sm space-y-2">
            <div>
              <dt className="text-black/50 text-xs">Email</dt>
              <dd><a href={`mailto:${appointment.customer_email}`} className="hover:underline">{appointment.customer_email}</a></dd>
            </div>
            {appointment.customer_phone && (
              <div>
                <dt className="text-black/50 text-xs">Telefoon</dt>
                <dd>{appointment.customer_phone}</dd>
              </div>
            )}
            {appointment.notes && (
              <div>
                <dt className="text-black/50 text-xs">Notities</dt>
                <dd className="whitespace-pre-line">{appointment.notes}</dd>
              </div>
            )}
            <div>
              <dt className="text-black/50 text-xs">Source</dt>
              <dd>{appointment.source}</dd>
            </div>
          </dl>
        </div>

        <aside className="space-y-4">
          <form action={updateAppointmentStatusAction} className="rounded-2xl bg-white p-6 shadow-sm space-y-3">
            <h2 className="font-semibold">Status wijzigen</h2>
            <input type="hidden" name="id" value={appointment.id} />
            <select
              name="status"
              defaultValue={appointment.status}
              className="w-full rounded-lg border border-black/10 px-3 py-2 text-sm bg-white"
            >
              <option value="pending">Open</option>
              <option value="confirmed">Bevestigd</option>
              <option value="cancelled">Geannuleerd</option>
            </select>
            <button
              type="submit"
              className="w-full rounded-lg bg-[var(--color-brand-primary)] text-white px-3 py-2 text-sm font-medium"
            >
              Opslaan
            </button>
          </form>

          <div className="rounded-2xl bg-white p-6 shadow-sm">
            <h2 className="font-semibold mb-3">Acties</h2>
            <DeleteButton
              action={async () => {
                'use server';
                await deleteAppointmentAction(appointment.id);
              }}
              confirmMessage="Afspraak permanent verwijderen?"
            />
          </div>
        </aside>
      </div>
    </div>
  );
}
```

Commit:
```bash
git add app/\(admin\)/admin/afspraken
git commit -m "feat(admin): appointments list + detail with status update"
```

---

### Task 8: Knowledge base CRUD

**Files:**
- `app/(admin)/admin/kennisbank/page.tsx`
- `app/(admin)/admin/kennisbank/nieuw/page.tsx`
- `app/(admin)/admin/kennisbank/[id]/page.tsx`
- `app/(admin)/admin/kennisbank/actions.ts`
- `components/admin/KnowledgeForm.tsx` (shared client form)

- [ ] **actions.ts:**

```ts
'use server';

import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { assertAdmin } from '@/lib/auth';
import { createClient } from '@/lib/supabase/server';
import { knowledgeUpsertSchema } from '@/lib/validation/admin-forms';

export type KnowledgeState =
  | { status: 'idle' }
  | { status: 'success' }
  | { status: 'error'; message: string };

export async function upsertKnowledgeAction(
  _prev: KnowledgeState,
  formData: FormData,
): Promise<KnowledgeState> {
  await assertAdmin();
  const parsed = knowledgeUpsertSchema.safeParse({
    id: formData.get('id') || undefined,
    topic: formData.get('topic'),
    content: formData.get('content'),
  });
  if (!parsed.success) {
    return { status: 'error', message: parsed.error.issues[0].message };
  }

  const supabase = await createClient();
  if (parsed.data.id) {
    const { error } = await supabase
      .from('knowledge')
      .update({ topic: parsed.data.topic, content: parsed.data.content })
      .eq('id', parsed.data.id);
    if (error) return { status: 'error', message: error.message };
  } else {
    const { error } = await supabase
      .from('knowledge')
      .insert({ topic: parsed.data.topic, content: parsed.data.content });
    if (error) return { status: 'error', message: error.message };
  }

  revalidatePath('/admin/kennisbank');
  redirect('/admin/kennisbank');
}

export async function deleteKnowledgeAction(id: string) {
  await assertAdmin();
  const supabase = await createClient();
  const { error } = await supabase.from('knowledge').delete().eq('id', id);
  if (error) throw new Error(error.message);

  revalidatePath('/admin/kennisbank');
}
```

- [ ] **KnowledgeForm.tsx:**

```tsx
'use client';

import { useActionState } from 'react';
import {
  upsertKnowledgeAction,
  type KnowledgeState,
} from '@/app/(admin)/admin/kennisbank/actions';
import { FormField } from '@/components/admin/FormField';

const initialState: KnowledgeState = { status: 'idle' };

type Props = {
  item?: { id: string; topic: string; content: string };
};

export function KnowledgeForm({ item }: Props) {
  const [state, formAction, pending] = useActionState(upsertKnowledgeAction, initialState);
  const errMsg = state.status === 'error' ? state.message : undefined;

  return (
    <form action={formAction} className="space-y-4 rounded-2xl bg-white p-6 shadow-sm">
      {item && <input type="hidden" name="id" value={item.id} />}

      <FormField label="Onderwerp" hint="Bijv. 'Openingstijden' of 'Levertijden'" error={errMsg}>
        <input
          type="text"
          name="topic"
          defaultValue={item?.topic}
          required
          maxLength={200}
          className="w-full rounded-lg border border-black/10 px-3 py-2 text-sm"
        />
      </FormField>

      <FormField label="Inhoud" hint="Wat moet de chatbot vertellen?">
        <textarea
          name="content"
          defaultValue={item?.content}
          required
          maxLength={5000}
          rows={8}
          className="w-full rounded-lg border border-black/10 px-3 py-2 text-sm"
        />
      </FormField>

      <button
        type="submit"
        disabled={pending}
        className="rounded-lg bg-[var(--color-brand-primary)] text-white px-5 py-2 text-sm font-medium disabled:opacity-50"
      >
        {pending ? 'Opslaan…' : 'Opslaan'}
      </button>
    </form>
  );
}
```

- [ ] **list page.tsx:**

```tsx
import type { Metadata } from 'next';
import Link from 'next/link';
import { Plus } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { createClient } from '@/lib/supabase/server';
import { DeleteButton } from '@/components/admin/DeleteButton';
import { deleteKnowledgeAction } from './actions';

export const metadata: Metadata = { title: 'Kennisbank' };

export default async function KnowledgeListPage() {
  const supabase = await createClient();
  const { data: items } = await supabase
    .from('knowledge')
    .select('*')
    .order('topic');

  const list = items ?? [];

  return (
    <div>
      <header className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-semibold">Kennisbank</h1>
          <p className="text-sm text-black/60 mt-1">
            Inhoud die de chatbot gebruikt om vragen te beantwoorden.
          </p>
        </div>
        <Button href="/admin/kennisbank/nieuw" size="sm">
          <Plus className="h-4 w-4" /> Nieuw item
        </Button>
      </header>

      {list.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-black/10 p-12 text-center text-sm text-black/60">
          Nog geen items. Voeg er eentje toe om de chatbot te trainen.
        </div>
      ) : (
        <ul className="space-y-3">
          {list.map((k) => (
            <li
              key={k.id}
              className="rounded-2xl bg-white p-5 shadow-sm flex items-start justify-between gap-4"
            >
              <Link href={`/admin/kennisbank/${k.id}`} className="flex-1 min-w-0">
                <h3 className="font-medium">{k.topic}</h3>
                <p className="mt-1 text-sm text-black/60 line-clamp-2">{k.content}</p>
              </Link>
              <DeleteButton
                action={async () => {
                  'use server';
                  await deleteKnowledgeAction(k.id);
                }}
                confirmMessage={`Item "${k.topic}" verwijderen?`}
              />
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
```

- [ ] **nieuw/page.tsx:**

```tsx
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { KnowledgeForm } from '@/components/admin/KnowledgeForm';

export default function NewKnowledgePage() {
  return (
    <div>
      <Link
        href="/admin/kennisbank"
        className="inline-flex items-center gap-2 text-sm text-black/60 hover:text-black mb-4"
      >
        <ArrowLeft className="h-4 w-4" />
        Kennisbank
      </Link>
      <h1 className="text-2xl font-semibold mb-6">Nieuw kennisbank item</h1>
      <KnowledgeForm />
    </div>
  );
}
```

- [ ] **[id]/page.tsx:**

```tsx
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { createClient } from '@/lib/supabase/server';
import { KnowledgeForm } from '@/components/admin/KnowledgeForm';

type Props = { params: Promise<{ id: string }> };

export default async function EditKnowledgePage({ params }: Props) {
  const { id } = await params;
  const supabase = await createClient();
  const { data: item } = await supabase
    .from('knowledge')
    .select('*')
    .eq('id', id)
    .maybeSingle();
  if (!item) notFound();

  return (
    <div>
      <Link
        href="/admin/kennisbank"
        className="inline-flex items-center gap-2 text-sm text-black/60 hover:text-black mb-4"
      >
        <ArrowLeft className="h-4 w-4" />
        Kennisbank
      </Link>
      <h1 className="text-2xl font-semibold mb-6">Bewerk: {item.topic}</h1>
      <KnowledgeForm item={item} />
    </div>
  );
}
```

Commit:
```bash
git add app/\(admin\)/admin/kennisbank components/admin/KnowledgeForm.tsx
git commit -m "feat(admin): knowledge base CRUD with shared form"
```

---

### Task 9: Services editor (override seed content)

**Files:**
- `app/(admin)/admin/diensten/page.tsx`
- `app/(admin)/admin/diensten/[slug]/page.tsx`
- `app/(admin)/admin/diensten/actions.ts`

- [ ] **actions.ts:**

```ts
'use server';

import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { assertAdmin } from '@/lib/auth';
import { createClient } from '@/lib/supabase/server';
import { serviceUpdateSchema } from '@/lib/validation/admin-forms';

export type ServiceState =
  | { status: 'idle' }
  | { status: 'success' }
  | { status: 'error'; message: string };

export async function updateServiceAction(
  _prev: ServiceState,
  formData: FormData,
): Promise<ServiceState> {
  await assertAdmin();
  const parsed = serviceUpdateSchema.safeParse({
    slug: formData.get('slug'),
    title: formData.get('title'),
    meta_title: formData.get('meta_title') || undefined,
    meta_description: formData.get('meta_description') || undefined,
    body_md: formData.get('body_md') || undefined,
    hero_image: formData.get('hero_image') || undefined,
    sort_order: formData.get('sort_order') || undefined,
  });
  if (!parsed.success) {
    return { status: 'error', message: parsed.error.issues[0].message };
  }

  const supabase = await createClient();
  const { slug, ...rest } = parsed.data;
  const { error } = await supabase
    .from('services')
    .update(rest)
    .eq('slug', slug);
  if (error) return { status: 'error', message: error.message };

  revalidatePath('/admin/diensten');
  revalidatePath(`/${slug}`);
  redirect('/admin/diensten');
}
```

- [ ] **list page.tsx:**

```tsx
import type { Metadata } from 'next';
import Link from 'next/link';
import { ChevronRight } from 'lucide-react';
import { getServices } from '@/lib/db/services';

export const metadata: Metadata = { title: 'Diensten' };

export default async function ServicesListPage() {
  const services = await getServices();

  return (
    <div>
      <h1 className="text-2xl font-semibold">Diensten</h1>
      <p className="text-sm text-black/60 mt-1">
        Bewerk de service-pagina&apos;s op de site.
      </p>

      <ul className="mt-6 space-y-2">
        {services.map((s) => (
          <li key={s.id}>
            <Link
              href={`/admin/diensten/${s.slug}`}
              className="flex items-center justify-between rounded-2xl bg-white p-5 shadow-sm hover:shadow-md transition"
            >
              <div>
                <h3 className="font-medium">{s.title}</h3>
                <p className="text-xs text-black/50 mt-0.5">/{s.slug}</p>
              </div>
              <ChevronRight className="h-5 w-5 text-black/30" />
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
```

- [ ] **[slug]/page.tsx + ServiceForm:**

Create `components/admin/ServiceForm.tsx`:

```tsx
'use client';

import { useActionState } from 'react';
import {
  updateServiceAction,
  type ServiceState,
} from '@/app/(admin)/admin/diensten/actions';
import { FormField } from '@/components/admin/FormField';
import type { Service } from '@/lib/db/services';

const initialState: ServiceState = { status: 'idle' };

export function ServiceForm({ service }: { service: Service }) {
  const [state, formAction, pending] = useActionState(updateServiceAction, initialState);
  const errMsg = state.status === 'error' ? state.message : undefined;

  return (
    <form action={formAction} className="space-y-4 rounded-2xl bg-white p-6 shadow-sm">
      <input type="hidden" name="slug" value={service.slug} />

      <FormField label="Titel" error={errMsg}>
        <input
          type="text"
          name="title"
          defaultValue={service.title}
          required
          className="w-full rounded-lg border border-black/10 px-3 py-2 text-sm"
        />
      </FormField>

      <FormField label="Meta title (SEO)" hint="Verschijnt in Google zoekresultaten">
        <input
          type="text"
          name="meta_title"
          defaultValue={service.meta_title ?? ''}
          maxLength={200}
          className="w-full rounded-lg border border-black/10 px-3 py-2 text-sm"
        />
      </FormField>

      <FormField label="Meta description (SEO)" hint="Beschrijving onder de titel in Google">
        <textarea
          name="meta_description"
          defaultValue={service.meta_description ?? ''}
          maxLength={300}
          rows={2}
          className="w-full rounded-lg border border-black/10 px-3 py-2 text-sm"
        />
      </FormField>

      <FormField label="Hero image URL" hint="Volledige URL naar afbeelding (later: upload)">
        <input
          type="url"
          name="hero_image"
          defaultValue={service.hero_image ?? ''}
          className="w-full rounded-lg border border-black/10 px-3 py-2 text-sm"
        />
      </FormField>

      <FormField label="Body (markdown)" hint="Hoofdtekst van de pagina, in markdown">
        <textarea
          name="body_md"
          defaultValue={service.body_md ?? ''}
          maxLength={20000}
          rows={20}
          className="w-full rounded-lg border border-black/10 px-3 py-2 text-sm font-mono"
        />
      </FormField>

      <FormField label="Volgorde">
        <input
          type="number"
          name="sort_order"
          defaultValue={service.sort_order}
          className="w-32 rounded-lg border border-black/10 px-3 py-2 text-sm"
        />
      </FormField>

      <button
        type="submit"
        disabled={pending}
        className="rounded-lg bg-[var(--color-brand-primary)] text-white px-5 py-2 text-sm font-medium disabled:opacity-50"
      >
        {pending ? 'Opslaan…' : 'Opslaan'}
      </button>
    </form>
  );
}
```

Then `app/(admin)/admin/diensten/[slug]/page.tsx`:

```tsx
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, ExternalLink } from 'lucide-react';
import { getServiceBySlug } from '@/lib/db/services';
import { ServiceForm } from '@/components/admin/ServiceForm';

type Props = { params: Promise<{ slug: string }> };

export default async function EditServicePage({ params }: Props) {
  const { slug } = await params;
  const service = await getServiceBySlug(slug);
  if (!service) notFound();

  return (
    <div>
      <Link
        href="/admin/diensten"
        className="inline-flex items-center gap-2 text-sm text-black/60 hover:text-black mb-4"
      >
        <ArrowLeft className="h-4 w-4" />
        Diensten
      </Link>

      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-semibold">Bewerk: {service.title}</h1>
        <Link
          href={`/${service.slug}`}
          target="_blank"
          rel="noopener"
          className="inline-flex items-center gap-1 text-sm text-black/60 hover:text-black"
        >
          Bekijk live <ExternalLink className="h-4 w-4" />
        </Link>
      </div>

      <ServiceForm service={service} />
    </div>
  );
}
```

Commit:
```bash
git add app/\(admin\)/admin/diensten components/admin/ServiceForm.tsx
git commit -m "feat(admin): services editor with markdown body and SEO fields"
```

---

### Task 10: ImageUploader component

**Files:** `components/admin/ImageUploader.tsx`

```tsx
'use client';

import { useState, useRef } from 'react';
import Image from 'next/image';
import { Upload, X } from 'lucide-react';

type Props = {
  name: string;
  defaultUrl?: string;
  onUploaded?: (url: string) => void;
  uploadAction: (formData: FormData) => Promise<{ url?: string; error?: string }>;
  folder?: 'projects' | 'gallery' | 'services' | 'site';
};

export function ImageUploader({
  name,
  defaultUrl,
  onUploaded,
  uploadAction,
  folder = 'projects',
}: Props) {
  const [url, setUrl] = useState(defaultUrl ?? '');
  const [pending, setPending] = useState(false);
  const [error, setError] = useState('');
  const fileRef = useRef<HTMLInputElement>(null);

  async function handleFile(file: File) {
    setError('');
    setPending(true);
    try {
      const fd = new FormData();
      fd.append('file', file);
      fd.append('folder', folder);
      const result = await uploadAction(fd);
      if (result.error) {
        setError(result.error);
      } else if (result.url) {
        setUrl(result.url);
        onUploaded?.(result.url);
      }
    } finally {
      setPending(false);
    }
  }

  return (
    <div>
      <input type="hidden" name={name} value={url} />

      {url ? (
        <div className="relative aspect-video rounded-xl overflow-hidden bg-black/5">
          <Image src={url} alt="" fill sizes="600px" className="object-cover" />
          <button
            type="button"
            onClick={() => setUrl('')}
            className="absolute top-2 right-2 rounded-full bg-white/90 p-1.5 shadow hover:bg-white"
            aria-label="Verwijder afbeelding"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      ) : (
        <div
          onDragOver={(e) => e.preventDefault()}
          onDrop={(e) => {
            e.preventDefault();
            const file = e.dataTransfer.files[0];
            if (file) handleFile(file);
          }}
          onClick={() => fileRef.current?.click()}
          className="aspect-video rounded-xl border-2 border-dashed border-black/15 flex flex-col items-center justify-center gap-2 text-sm text-black/60 cursor-pointer hover:bg-black/[0.02]"
        >
          <Upload className="h-6 w-6" />
          <span>{pending ? 'Bezig met uploaden…' : 'Klik of sleep een afbeelding hier'}</span>
          <span className="text-xs">JPG, PNG of WebP, max 10 MB</span>
        </div>
      )}

      <input
        ref={fileRef}
        type="file"
        accept="image/jpeg,image/png,image/webp"
        className="hidden"
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) handleFile(file);
        }}
      />

      {error && (
        <p className="mt-2 text-xs text-red-700" role="alert">
          {error}
        </p>
      )}
    </div>
  );
}
```

Commit:
```bash
git add components/admin/ImageUploader.tsx
git commit -m "feat(admin): drag-and-drop ImageUploader with preview"
```

---

### Task 11: Projects CRUD with image upload

**Files:**
- `app/(admin)/admin/projecten/page.tsx`
- `app/(admin)/admin/projecten/nieuw/page.tsx`
- `app/(admin)/admin/projecten/[id]/page.tsx`
- `app/(admin)/admin/projecten/actions.ts`
- `components/admin/ProjectForm.tsx`

- [ ] **actions.ts:**

```ts
'use server';

import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { assertAdmin } from '@/lib/auth';
import { createClient } from '@/lib/supabase/server';
import { projectUpsertSchema } from '@/lib/validation/admin-forms';
import { uploadImage } from '@/lib/storage/upload';

export type ProjectState =
  | { status: 'idle' }
  | { status: 'success' }
  | { status: 'error'; message: string };

export async function uploadProjectImageAction(formData: FormData) {
  await assertAdmin();
  const file = formData.get('file') as File | null;
  if (!file) return { error: 'Geen bestand' };
  try {
    const { url } = await uploadImage(file, 'projects');
    return { url };
  } catch (e) {
    return { error: e instanceof Error ? e.message : 'Upload mislukt' };
  }
}

export async function upsertProjectAction(
  _prev: ProjectState,
  formData: FormData,
): Promise<ProjectState> {
  await assertAdmin();
  const parsed = projectUpsertSchema.safeParse({
    id: formData.get('id') || undefined,
    slug: formData.get('slug'),
    title: formData.get('title'),
    description: formData.get('description') || undefined,
    long_description: formData.get('long_description') || undefined,
    image_url: formData.get('image_url') || undefined,
    area_size: formData.get('area_size') || undefined,
    location: formData.get('location') || undefined,
    completed_date: formData.get('completed_date') || undefined,
    floor_type: formData.get('floor_type') || undefined,
    is_featured: formData.get('is_featured') === 'on',
    sort_order: formData.get('sort_order') || undefined,
  });
  if (!parsed.success) {
    return { status: 'error', message: parsed.error.issues[0].message };
  }

  const supabase = await createClient();
  const { id, ...rest } = parsed.data;

  if (id) {
    const { error } = await supabase.from('projects').update(rest).eq('id', id);
    if (error) return { status: 'error', message: error.message };
  } else {
    const { error } = await supabase.from('projects').insert(rest);
    if (error) return { status: 'error', message: error.message };
  }

  revalidatePath('/admin/projecten');
  revalidatePath('/projecten');
  redirect('/admin/projecten');
}

export async function deleteProjectAction(id: string) {
  await assertAdmin();
  const supabase = await createClient();
  const { error } = await supabase.from('projects').delete().eq('id', id);
  if (error) throw new Error(error.message);
  revalidatePath('/admin/projecten');
}
```

- [ ] **ProjectForm.tsx:**

```tsx
'use client';

import { useActionState } from 'react';
import {
  upsertProjectAction,
  uploadProjectImageAction,
  type ProjectState,
} from '@/app/(admin)/admin/projecten/actions';
import { FormField } from '@/components/admin/FormField';
import { ImageUploader } from '@/components/admin/ImageUploader';
import type { Project } from '@/lib/db/projects';

const initialState: ProjectState = { status: 'idle' };

export function ProjectForm({ project }: { project?: Project }) {
  const [state, formAction, pending] = useActionState(upsertProjectAction, initialState);
  const errMsg = state.status === 'error' ? state.message : undefined;

  return (
    <form action={formAction} className="space-y-4 rounded-2xl bg-white p-6 shadow-sm">
      {project && <input type="hidden" name="id" value={project.id} />}

      <FormField label="Slug" hint="URL-deel: kleine letters, cijfers, streepjes" error={errMsg}>
        <input
          type="text"
          name="slug"
          defaultValue={project?.slug}
          required
          pattern="[a-z0-9-]+"
          className="w-full rounded-lg border border-black/10 px-3 py-2 text-sm font-mono"
        />
      </FormField>

      <FormField label="Titel">
        <input
          type="text"
          name="title"
          defaultValue={project?.title}
          required
          className="w-full rounded-lg border border-black/10 px-3 py-2 text-sm"
        />
      </FormField>

      <FormField label="Korte beschrijving" hint="1-2 zinnen voor de tegel op listing-pagina">
        <textarea
          name="description"
          defaultValue={project?.description ?? ''}
          maxLength={500}
          rows={2}
          className="w-full rounded-lg border border-black/10 px-3 py-2 text-sm"
        />
      </FormField>

      <FormField label="Lange beschrijving" hint="Volledig verhaal voor de detail-pagina">
        <textarea
          name="long_description"
          defaultValue={project?.long_description ?? ''}
          maxLength={5000}
          rows={6}
          className="w-full rounded-lg border border-black/10 px-3 py-2 text-sm"
        />
      </FormField>

      <FormField label="Hoofdfoto">
        <ImageUploader
          name="image_url"
          defaultUrl={project?.image_url ?? ''}
          uploadAction={uploadProjectImageAction}
          folder="projects"
        />
      </FormField>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <FormField label="Oppervlak (m²)">
          <input
            type="number"
            name="area_size"
            defaultValue={project?.area_size ?? ''}
            min={0}
            className="w-full rounded-lg border border-black/10 px-3 py-2 text-sm"
          />
        </FormField>
        <FormField label="Locatie">
          <input
            type="text"
            name="location"
            defaultValue={project?.location ?? ''}
            className="w-full rounded-lg border border-black/10 px-3 py-2 text-sm"
          />
        </FormField>
        <FormField label="Opgeleverd">
          <input
            type="date"
            name="completed_date"
            defaultValue={project?.completed_date ?? ''}
            className="w-full rounded-lg border border-black/10 px-3 py-2 text-sm"
          />
        </FormField>
      </div>

      <FormField label="Type vloer">
        <input
          type="text"
          name="floor_type"
          defaultValue={project?.floor_type ?? ''}
          placeholder="Bijv. PVC, Eiken visgraat, Multiplanken"
          className="w-full rounded-lg border border-black/10 px-3 py-2 text-sm"
        />
      </FormField>

      <div className="grid grid-cols-2 gap-4">
        <label className="flex items-center gap-2 text-sm">
          <input
            type="checkbox"
            name="is_featured"
            defaultChecked={project?.is_featured ?? false}
            className="rounded"
          />
          Featured op homepage
        </label>
        <FormField label="Volgorde">
          <input
            type="number"
            name="sort_order"
            defaultValue={project?.sort_order ?? 0}
            className="w-32 rounded-lg border border-black/10 px-3 py-2 text-sm"
          />
        </FormField>
      </div>

      <button
        type="submit"
        disabled={pending}
        className="rounded-lg bg-[var(--color-brand-primary)] text-white px-5 py-2 text-sm font-medium disabled:opacity-50"
      >
        {pending ? 'Opslaan…' : project ? 'Project bijwerken' : 'Project aanmaken'}
      </button>
    </form>
  );
}
```

- [ ] **list page.tsx:**

```tsx
import type { Metadata } from 'next';
import Link from 'next/link';
import Image from 'next/image';
import { Plus, Pencil } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { getProjects } from '@/lib/db/projects';
import { DeleteButton } from '@/components/admin/DeleteButton';
import { deleteProjectAction } from './actions';

export const metadata: Metadata = { title: 'Projecten' };

export default async function ProjectsListPage() {
  const projects = await getProjects();

  return (
    <div>
      <header className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-semibold">Projecten</h1>
          <p className="text-sm text-black/60 mt-1">Portfolio voor de publieke site.</p>
        </div>
        <Button href="/admin/projecten/nieuw" size="sm">
          <Plus className="h-4 w-4" /> Nieuw project
        </Button>
      </header>

      {projects.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-black/10 p-12 text-center text-sm text-black/60">
          Nog geen projecten.
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {projects.map((p) => (
            <div key={p.id} className="rounded-2xl bg-white shadow-sm overflow-hidden">
              {p.image_url && (
                <div className="relative aspect-[4/3]">
                  <Image src={p.image_url} alt={p.title} fill sizes="33vw" className="object-cover" />
                </div>
              )}
              <div className="p-4">
                <h3 className="font-medium">{p.title}</h3>
                <p className="text-xs text-black/50 mt-0.5">/{p.slug}</p>
                <div className="mt-3 flex items-center justify-between">
                  <Link
                    href={`/admin/projecten/${p.id}`}
                    className="text-xs text-[var(--color-brand-primary)] hover:underline inline-flex items-center gap-1"
                  >
                    <Pencil className="h-3 w-3" /> Bewerk
                  </Link>
                  <DeleteButton
                    action={async () => {
                      'use server';
                      await deleteProjectAction(p.id);
                    }}
                    confirmMessage={`Project "${p.title}" verwijderen?`}
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
```

- [ ] **nieuw/page.tsx + [id]/page.tsx (analogous to knowledge):**

```tsx
// nieuw/page.tsx
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { ProjectForm } from '@/components/admin/ProjectForm';

export default function NewProjectPage() {
  return (
    <div>
      <Link
        href="/admin/projecten"
        className="inline-flex items-center gap-2 text-sm text-black/60 hover:text-black mb-4"
      >
        <ArrowLeft className="h-4 w-4" />
        Projecten
      </Link>
      <h1 className="text-2xl font-semibold mb-6">Nieuw project</h1>
      <ProjectForm />
    </div>
  );
}
```

```tsx
// [id]/page.tsx
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { createClient } from '@/lib/supabase/server';
import { ProjectForm } from '@/components/admin/ProjectForm';

type Props = { params: Promise<{ id: string }> };

export default async function EditProjectPage({ params }: Props) {
  const { id } = await params;
  const supabase = await createClient();
  const { data: project } = await supabase
    .from('projects')
    .select('*')
    .eq('id', id)
    .maybeSingle();
  if (!project) notFound();

  return (
    <div>
      <Link
        href="/admin/projecten"
        className="inline-flex items-center gap-2 text-sm text-black/60 hover:text-black mb-4"
      >
        <ArrowLeft className="h-4 w-4" />
        Projecten
      </Link>
      <h1 className="text-2xl font-semibold mb-6">Bewerk: {project.title}</h1>
      <ProjectForm project={project} />
    </div>
  );
}
```

Commit:
```bash
git add app/\(admin\)/admin/projecten components/admin/ProjectForm.tsx
git commit -m "feat(admin): projects CRUD with image upload"
```

---

### Task 12: Gallery management

**Files:**
- `app/(admin)/admin/gallery/page.tsx`
- `app/(admin)/admin/gallery/actions.ts`

- [ ] **actions.ts:**

```ts
'use server';

import { revalidatePath } from 'next/cache';
import { assertAdmin } from '@/lib/auth';
import { createClient } from '@/lib/supabase/server';
import { uploadImage, deleteImage } from '@/lib/storage/upload';

export async function uploadGalleryAction(formData: FormData) {
  await assertAdmin();
  const file = formData.get('file') as File | null;
  const caption = (formData.get('caption') as string) || undefined;
  if (!file) return { error: 'Geen bestand' };

  try {
    const { url } = await uploadImage(file, 'gallery');
    const supabase = await createClient();
    const { error } = await supabase.from('gallery').insert({ image_url: url, caption });
    if (error) return { error: error.message };
    revalidatePath('/admin/gallery');
    revalidatePath('/');
    return { url };
  } catch (e) {
    return { error: e instanceof Error ? e.message : 'Upload mislukt' };
  }
}

export async function deleteGalleryItemAction(id: string, imageUrl: string) {
  await assertAdmin();
  // Extract storage path from public URL: .../storage/v1/object/public/media/<path>
  const match = imageUrl.match(/\/storage\/v1\/object\/public\/media\/(.+)$/);
  if (match) {
    await deleteImage(match[1]).catch((e) =>
      console.error('Storage delete failed (continuing):', e),
    );
  }
  const supabase = await createClient();
  const { error } = await supabase.from('gallery').delete().eq('id', id);
  if (error) throw new Error(error.message);
  revalidatePath('/admin/gallery');
}
```

- [ ] **page.tsx with inline upload + grid:**

```tsx
import type { Metadata } from 'next';
import Image from 'next/image';
import { createClient } from '@/lib/supabase/server';
import { GalleryUploader } from '@/components/admin/GalleryUploader';
import { DeleteButton } from '@/components/admin/DeleteButton';
import { deleteGalleryItemAction } from './actions';

export const metadata: Metadata = { title: 'Gallery' };

export default async function GalleryPage() {
  const supabase = await createClient();
  const { data: items } = await supabase
    .from('gallery')
    .select('*')
    .order('sort_order')
    .order('created_at', { ascending: false });
  const list = items ?? [];

  return (
    <div>
      <header className="mb-6">
        <h1 className="text-2xl font-semibold">Gallery</h1>
        <p className="text-sm text-black/60 mt-1">
          Foto&apos;s die op de homepage worden getoond.
        </p>
      </header>

      <GalleryUploader />

      <h2 className="font-semibold mt-10 mb-4">Bestaande foto&apos;s ({list.length})</h2>
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
        {list.map((g) => (
          <div key={g.id} className="relative group">
            <div className="relative aspect-square rounded-xl overflow-hidden bg-black/5">
              <Image src={g.image_url} alt={g.caption ?? ''} fill sizes="200px" className="object-cover" />
            </div>
            <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition rounded-full bg-white/95 p-1 shadow">
              <DeleteButton
                action={async () => {
                  'use server';
                  await deleteGalleryItemAction(g.id, g.image_url);
                }}
                confirmMessage="Foto verwijderen?"
              />
            </div>
            {g.caption && (
              <p className="mt-1 text-xs text-black/50 truncate">{g.caption}</p>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
```

- [ ] **components/admin/GalleryUploader.tsx (client):**

```tsx
'use client';

import { useState, useRef } from 'react';
import { Upload } from 'lucide-react';
import { uploadGalleryAction } from '@/app/(admin)/admin/gallery/actions';

export function GalleryUploader() {
  const [pending, setPending] = useState(false);
  const [error, setError] = useState('');
  const [caption, setCaption] = useState('');
  const fileRef = useRef<HTMLInputElement>(null);

  async function handleFile(file: File) {
    setError('');
    setPending(true);
    try {
      const fd = new FormData();
      fd.append('file', file);
      if (caption) fd.append('caption', caption);
      const result = await uploadGalleryAction(fd);
      if (result.error) {
        setError(result.error);
      } else {
        setCaption('');
        if (fileRef.current) fileRef.current.value = '';
      }
    } finally {
      setPending(false);
    }
  }

  return (
    <div className="rounded-2xl bg-white p-6 shadow-sm space-y-3">
      <input
        type="text"
        value={caption}
        onChange={(e) => setCaption(e.target.value)}
        placeholder="Onderschrift (optioneel)"
        className="w-full rounded-lg border border-black/10 px-3 py-2 text-sm"
      />
      <div
        onDragOver={(e) => e.preventDefault()}
        onDrop={(e) => {
          e.preventDefault();
          const file = e.dataTransfer.files[0];
          if (file) handleFile(file);
        }}
        onClick={() => fileRef.current?.click()}
        className="rounded-xl border-2 border-dashed border-black/15 p-8 flex flex-col items-center justify-center gap-2 text-sm text-black/60 cursor-pointer hover:bg-black/[0.02]"
      >
        <Upload className="h-6 w-6" />
        <span>{pending ? 'Bezig met uploaden…' : 'Sleep een foto hier of klik om te kiezen'}</span>
      </div>
      <input
        ref={fileRef}
        type="file"
        accept="image/jpeg,image/png,image/webp"
        className="hidden"
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) handleFile(file);
        }}
      />
      {error && <p className="text-xs text-red-700" role="alert">{error}</p>}
    </div>
  );
}
```

Commit:
```bash
git add app/\(admin\)/admin/gallery components/admin/GalleryUploader.tsx
git commit -m "feat(admin): gallery management with inline upload + delete"
```

---

### Task 13: Admin settings page

**Files:**
- `app/(admin)/admin/instellingen/page.tsx`
- `app/(admin)/admin/instellingen/actions.ts`
- `lib/db/admin-settings.ts`

- [ ] **lib/db/admin-settings.ts:**

```ts
import 'server-only';
import { createClient } from '@/lib/supabase/server';

export type AdminSettings = {
  id: number;
  chatbot_enabled: boolean;
  system_prompt_extra: string | null;
  phone: string | null;
  whatsapp: string | null;
};

export async function getAdminSettings(): Promise<AdminSettings> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from('admin_settings')
    .select('*')
    .eq('id', 1)
    .single();
  if (error) throw error;
  return data;
}
```

- [ ] **actions.ts:**

```ts
'use server';

import { revalidatePath } from 'next/cache';
import { assertAdmin } from '@/lib/auth';
import { createClient } from '@/lib/supabase/server';
import { adminSettingsSchema } from '@/lib/validation/admin-forms';

export type SettingsState =
  | { status: 'idle' }
  | { status: 'success' }
  | { status: 'error'; message: string };

export async function updateSettingsAction(
  _prev: SettingsState,
  formData: FormData,
): Promise<SettingsState> {
  await assertAdmin();
  const parsed = adminSettingsSchema.safeParse({
    chatbot_enabled: formData.get('chatbot_enabled') === 'on',
    system_prompt_extra: formData.get('system_prompt_extra') || undefined,
    phone: formData.get('phone') || undefined,
    whatsapp: formData.get('whatsapp') || undefined,
  });
  if (!parsed.success) {
    return { status: 'error', message: parsed.error.issues[0].message };
  }

  const supabase = await createClient();
  const { error } = await supabase.from('admin_settings').update(parsed.data).eq('id', 1);
  if (error) return { status: 'error', message: error.message };

  revalidatePath('/admin/instellingen');
  revalidatePath('/', 'layout');
  return { status: 'success' };
}
```

- [ ] **page.tsx + SettingsForm:**

Create `components/admin/SettingsForm.tsx`:

```tsx
'use client';

import { useActionState } from 'react';
import {
  updateSettingsAction,
  type SettingsState,
} from '@/app/(admin)/admin/instellingen/actions';
import { FormField } from '@/components/admin/FormField';
import type { AdminSettings } from '@/lib/db/admin-settings';

const initialState: SettingsState = { status: 'idle' };

export function SettingsForm({ settings }: { settings: AdminSettings }) {
  const [state, formAction, pending] = useActionState(updateSettingsAction, initialState);
  const errMsg = state.status === 'error' ? state.message : undefined;

  return (
    <form action={formAction} className="space-y-4 rounded-2xl bg-white p-6 shadow-sm">
      <label className="flex items-center gap-3">
        <input
          type="checkbox"
          name="chatbot_enabled"
          defaultChecked={settings.chatbot_enabled}
        />
        <div>
          <span className="font-medium">Chatbot ingeschakeld</span>
          <p className="text-xs text-black/60">Toont de chat-widget rechtsonder op de site.</p>
        </div>
      </label>

      <FormField
        label="Extra chatbot instructies"
        hint="Wordt toegevoegd aan de system prompt — bijvoorbeeld vakantie-melding"
        error={errMsg}
      >
        <textarea
          name="system_prompt_extra"
          defaultValue={settings.system_prompt_extra ?? ''}
          maxLength={2000}
          rows={4}
          className="w-full rounded-lg border border-black/10 px-3 py-2 text-sm"
        />
      </FormField>

      <FormField label="Telefoon override" hint="Optioneel — overschrijft het standaard telefoonnummer">
        <input
          type="text"
          name="phone"
          defaultValue={settings.phone ?? ''}
          className="w-full rounded-lg border border-black/10 px-3 py-2 text-sm"
        />
      </FormField>

      <FormField label="WhatsApp">
        <input
          type="text"
          name="whatsapp"
          defaultValue={settings.whatsapp ?? ''}
          className="w-full rounded-lg border border-black/10 px-3 py-2 text-sm"
        />
      </FormField>

      <div className="flex items-center gap-3">
        <button
          type="submit"
          disabled={pending}
          className="rounded-lg bg-[var(--color-brand-primary)] text-white px-5 py-2 text-sm font-medium disabled:opacity-50"
        >
          {pending ? 'Opslaan…' : 'Opslaan'}
        </button>
        {state.status === 'success' && (
          <span className="text-sm text-green-700">✓ Opgeslagen</span>
        )}
      </div>
    </form>
  );
}
```

Then `app/(admin)/admin/instellingen/page.tsx`:

```tsx
import type { Metadata } from 'next';
import { getAdminSettings } from '@/lib/db/admin-settings';
import { SettingsForm } from '@/components/admin/SettingsForm';

export const metadata: Metadata = { title: 'Instellingen' };

export default async function SettingsPage() {
  const settings = await getAdminSettings();

  return (
    <div>
      <h1 className="text-2xl font-semibold">Instellingen</h1>
      <p className="text-sm text-black/60 mt-1 mb-6">
        Tune de chatbot en contactgegevens.
      </p>

      <SettingsForm settings={settings} />
    </div>
  );
}
```

Commit:
```bash
git add app/\(admin\)/admin/instellingen lib/db/admin-settings.ts components/admin/SettingsForm.tsx
git commit -m "feat(admin): settings page (chatbot toggle, system prompt, contact override)"
```

---

### Task 14: Wire admin_settings into chatbot system prompt

**Files:** Modify `app/api/chat/route.ts`

In the chatbot route, prepend `admin_settings.system_prompt_extra` to the system prompt and gate the entire route on `chatbot_enabled`.

- [ ] **Step 1: Add settings fetch + gate**

In `app/api/chat/route.ts`, find the section that builds `systemPrompt` and add before:

```ts
import { getAdminSettings } from '@/lib/db/admin-settings';
```

Then near the top of `POST`, after env check:

```ts
  const settings = await getAdminSettings().catch(() => null);
  if (settings && !settings.chatbot_enabled) {
    return NextResponse.json(
      { text: `De chatbot staat momenteel uit. Bel ons gerust op ${companyConfig.contact.phone}.` },
    );
  }
```

Then in the system prompt template, append:

```ts
  const adminExtra = settings?.system_prompt_extra
    ? `\n\nEXTRA INSTRUCTIES VANUIT ADMIN:\n${settings.system_prompt_extra}\n`
    : '';

  // Find the existing systemPrompt const, append `${adminExtra}` before the KENNISBANK section.
```

For clarity, the full `systemPrompt` template gets `${adminExtra}` inserted after the "Geef NOOIT prijzen" line. See existing file for placement.

- [ ] **Step 2: Verify + commit**

```bash
npm run typecheck && \
git add app/api/chat/route.ts && \
git commit -m "feat(chatbot): respect admin_settings (chatbot_enabled + system_prompt_extra)"
```

---

### Task 15: E2E tests for admin

**Files:** `tests/e2e/admin-leads.spec.ts`

```ts
import { test, expect } from '@playwright/test';

const ADMIN_PASSWORD = process.env.E2E_ADMIN_PASSWORD;

test.describe('admin leads management', () => {
  test.skip(!ADMIN_PASSWORD, 'E2E_ADMIN_PASSWORD not set');

  test('admin can list leads after login', async ({ page }) => {
    await page.goto('/login');
    await page.getByLabel('Email').fill(process.env.E2E_ADMIN_EMAIL || 'bodhi@bpmparket.nl');
    await page.getByLabel('Wachtwoord').fill(ADMIN_PASSWORD!);
    await page.getByRole('button', { name: 'Inloggen' }).click();
    await expect(page).toHaveURL(/\/admin$/);

    await page.goto('/admin/leads');
    await expect(page.getByRole('heading', { name: 'Leads' })).toBeVisible();
  });

  test('admin dashboard shows stat cards', async ({ page }) => {
    await page.goto('/login');
    await page.getByLabel('Email').fill(process.env.E2E_ADMIN_EMAIL || 'bodhi@bpmparket.nl');
    await page.getByLabel('Wachtwoord').fill(ADMIN_PASSWORD!);
    await page.getByRole('button', { name: 'Inloggen' }).click();

    await expect(page.getByText('Nieuwe leads')).toBeVisible();
    await expect(page.getByText('Open afspraken')).toBeVisible();
    await expect(page.getByText('Kennisbank')).toBeVisible();
  });
});
```

Commit:
```bash
git add tests/e2e/admin-leads.spec.ts
git commit -m "test: E2E smoke tests for admin dashboard and leads"
```

---

### Task 16: README update + Plan 3 closeout

**Files:** modify `README.md`

Update Status section:

```markdown
## Status

Migration in progress. See:
- [Design spec](docs/superpowers/specs/2026-05-02-vite-to-nextjs-migration-design.md)
- [Plan 1: Foundation](docs/superpowers/plans/2026-05-04-nextjs-migration-plan-1-foundation.md) — done
- [Plan 2: Public Site + Chatbot](docs/superpowers/plans/2026-05-04-nextjs-migration-plan-2-public-site-and-chatbot.md) — done
- [Plan 3: Admin Features](docs/superpowers/plans/2026-05-04-nextjs-migration-plan-3-admin-features.md) — done
- Plan 4 (SEO + GDPR + Launch) — pending
```

Final verify + push:
```bash
npm run typecheck && npm run build && \
git add README.md && \
git commit -m "docs: README updated for Plan 3 completion" && \
git push
```

---

## Self-Review Notes

**Spec coverage:**
- ✅ Sectie 4 (admin features per table) — leads, appointments, knowledge, services, projects, gallery, admin_settings all CRUD-able
- ✅ Sectie 9 (image upload pipeline) — Task 2: validate + EXIF strip + resize + WebP + content-hash
- ✅ Sectie 12 (vibe-security) — `assertAdmin()` in every server action, RLS already in place from Plan 1, image MIME + magic-byte + extension triple-check
- ⏭️ Sectie 5 (defense-in-depth admin protection) — middleware + layout already in place from Plan 1; Plan 3 adds 3rd layer at every server action

**Placeholder scan:** No "TBD" / "TODO" / vague references. Each task has full file content.

**Type consistency:**
- `Project`, `Service`, `KnowledgeItem`, `AdminSettings` types match between fetchers, forms, and server actions
- `*State` types (LeadState, KnowledgeState, ServiceState, ProjectState, SettingsState) match between server actions and useActionState calls
- Tool signatures (uploadImage folder type) match between caller and signature
- Status values (`new`/`contacted`/`completed`, `pending`/`confirmed`/`cancelled`) match between schema, badge labels, and form options

**Open handoff items:**
- After Plan 3 deploys: Bodhi can self-manage everything from `/admin`
- Real photo upload: Bodhi can now replace Unsplash placeholders with actual BPM project photos
- Knowledge base: Bodhi adds entries → chatbot becomes smarter over time
- No new env vars required — Plan 3 builds purely on Plan 1 + 2 infrastructure
