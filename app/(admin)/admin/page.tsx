import { Calendar, MessageSquare, BookOpen, FolderOpen } from 'lucide-react';
import { createClient } from '@/lib/supabase/server';
import { StatCard } from '@/components/admin/StatCard';
import { getUser } from '@/lib/auth';

async function getStats() {
  const supabase = await createClient();
  const [
    { count: leadCount },
    { count: appointmentCount },
    { count: knowledgeCount },
    { count: projectCount },
  ] = await Promise.all([
    supabase
      .from('leads')
      .select('id', { count: 'exact', head: true })
      .eq('status', 'new'),
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
      <h1 className="text-2xl font-semibold">
        Welkom, {user?.email?.split('@')[0]}
      </h1>
      <p className="mt-2 text-sm text-black/60">Hier is wat er nu speelt.</p>

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
