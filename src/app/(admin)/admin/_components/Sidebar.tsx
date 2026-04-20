'use client'

import React from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
    LayoutDashboard,
    ShoppingBag,
    Calendar,
    BookOpen,
    Settings,
    LogOut,
    Folder
} from 'lucide-react'
import UsersIcon from '@/components/ui/users-icon'
import MessageCircleIcon from '@/components/ui/message-circle-icon'
import StarIcon from '@/components/ui/star-icon'
import GlobeIcon from '@/components/ui/globe-icon'
import FileDescriptionIcon from '@/components/ui/file-description-icon'
import { logout } from '../../login/actions'
import { companyConfig } from '@/config'

const navGroups = [
    {
        title: 'MAIN',
        items: [
            { name: 'Dashboard', href: '/admin', icon: LayoutDashboard },
            { name: 'Projecten', href: '/admin/projecten', icon: Folder },
            { name: 'Actievloeren', href: '/admin/actievloeren', icon: StarIcon },
            { name: 'Offerte aanvragen', href: '/admin/aanvragen', icon: MessageCircleIcon },
            { name: 'Agenda', href: '/admin/afspraken', icon: Calendar },
            { name: 'AI Kennisbank', href: '/admin/kennisbank', icon: BookOpen },
        ]
    },
    {
        title: 'BUSINESS',
        items: [
            { name: 'Klanten', href: '/admin/klanten', icon: UsersIcon },
        ]
    },
    {
        title: 'OTHER',
        items: [
            { name: 'Beleid & Pagina\'s', href: '/admin/beleid', icon: FileDescriptionIcon },
            { name: 'Instellingen', href: '/admin/instellingen', icon: Settings },
        ]
    }
]

export default function Sidebar() {
    const pathname = usePathname()

    return (
        <div className="w-72 bg-white border-r border-gray-100 flex flex-col h-screen h-full animate-fade-in">
            {/* User Profile */}
            <div className="p-6 border-b border-gray-50">
                <div className="flex items-center gap-3">
                    <div className="flex-1 min-w-0">
                        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Beheerder</p>
                        <p className="text-sm font-bold text-gray-900 truncate">Admin Gebruiker</p>
                    </div>
                </div>
            </div>

            {/* Navigation Groups */}
            <nav className="flex-1 overflow-y-auto p-4 py-6 space-y-8 no-scrollbar">
                {navGroups.map((group) => (
                    <div key={group.title} className="space-y-4">
                        <h3 className="px-4 text-[10px] font-bold text-gray-400 uppercase tracking-widest leading-none">
                            {group.title}
                        </h3>
                        <div className="space-y-1">
                            {group.items.map((item) => {
                                const isActive = pathname === item.href
                                return (
                                    <Link
                                        key={item.href}
                                        href={item.href}
                                        className={`group flex items-center gap-3 px-4 py-2.5 text-sm font-medium rounded-xl transition-all duration-200 ${isActive
                                                ? 'bg-brand-primary/10 text-brand-primary'
                                                : 'text-gray-500 hover:bg-gray-50 hover:text-gray-900'
                                            }`}
                                    >
                                        <item.icon size={20} className={`transition-colors ${isActive ? 'text-brand-primary' : 'text-gray-400 group-hover:text-gray-600'
                                            }`} />
                                        <span>{item.name}</span>
                                        {isActive && (
                                            <div className="ml-auto w-1.5 h-1.5 rounded-full bg-brand-primary animate-pulse" />
                                        )}
                                    </Link>
                                )
                            })}
                        </div>
                    </div>
                ))}
            </nav>

            {/* Bottom Section */}
            <div className="p-4 border-t border-gray-50 space-y-2">
                <Link
                    href="/"
                    className="flex items-center gap-3 px-4 py-2.5 text-sm font-medium text-red-500 hover:bg-red-50 rounded-xl transition-all group"
                >
                    <GlobeIcon size={20} className="group-hover:scale-110 transition-transform" />
                    <span>Terug naar Website</span>
                </Link>

                <form action={logout}>
                    <button
                        type="submit"
                        className="flex items-center gap-3 px-4 py-2.5 text-sm font-medium text-gray-500 hover:bg-gray-50 rounded-xl w-full transition-all group"
                    >
                        <LogOut className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                        <span>Uitloggen</span>
                    </button>
                </form>
            </div>
        </div>
    )
}
