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
    <div className="min-h-screen flex bg-[var(--color-brand-light)]">
      <Sidebar userEmail={user.email ?? ''} />
      <main className="flex-1 p-8">{children}</main>
    </div>
  );
}
