import Link from 'next/link';
import { logoutAction } from '@/app/(admin)/logout/actions';
import {
  LayoutDashboard,
  MessageSquare,
  Calendar,
  BookOpen,
  FolderOpen,
  Image as ImageIcon,
  Settings,
  LogOut,
} from 'lucide-react';

const NAV = [
  { href: '/admin', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/admin/leads', label: 'Leads', icon: MessageSquare },
  { href: '/admin/afspraken', label: 'Afspraken', icon: Calendar },
  { href: '/admin/kennisbank', label: 'Kennisbank', icon: BookOpen },
  { href: '/admin/projecten', label: 'Projecten', icon: FolderOpen },
  { href: '/admin/gallery', label: 'Gallery', icon: ImageIcon },
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
