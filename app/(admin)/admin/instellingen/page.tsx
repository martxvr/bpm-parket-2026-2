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
