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
