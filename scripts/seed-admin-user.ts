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
    console.log(`Admin user ${ADMIN_EMAIL} already exists (id: ${found.id})`);
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

  console.log(`Created admin user ${ADMIN_EMAIL} (id: ${data.user.id})`);
  console.log('  Bodhi must change this password on first login.');
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
