import React from 'react'
import {
    ShoppingBag,
    Calendar,
    TrendingUp
} from 'lucide-react'
import UsersIcon from '@/components/ui/users-icon'
import MessageCircleIcon from '@/components/ui/message-circle-icon'
import ExternalLinkIcon from '@/components/ui/external-link-icon'
import ClockIcon from '@/components/ui/clock-icon'
import RightChevron from '@/components/ui/right-chevron'
import Link from 'next/link'
import { getAppointments, getProjects, getCustomers, getOffertes } from '@/lib/admin-data'

export default async function DashboardPage() {
    const [appointments, projects, customers, offers] = await Promise.all([
        getAppointments(),
        getProjects(),
        getCustomers(),
        getOffertes()
    ])

    const stats = [
        { name: 'Totaal Projecten', value: projects.length.toString(), icon: ShoppingBag, color: 'text-blue-600', bg: 'bg-blue-50' },
        { name: 'Klanten', value: customers.length.toString(), icon: UsersIcon, color: 'text-green-600', bg: 'bg-green-50' },
        { name: 'Nieuwe Aanvragen', value: offers.length.toString(), icon: MessageCircleIcon, color: 'text-brand-primary', bg: 'bg-brand-primary/10' },
        { name: 'Totaal Afspraken', value: appointments.length.toString(), icon: Calendar, color: 'text-amber-600', bg: 'bg-amber-50' },
    ]

    const today = new Date()
    today.setHours(0, 0, 0, 0)
    
    const upcomingAppointments = (appointments as any[])
        .filter((app: any) => new Date(app.date) >= today)
        .sort((a: any, b: any) => new Date(a.date).getTime() - new Date(b.date).getTime())
        .slice(0, 3)

    return (
        <div className="space-y-12 animate-fade-in">
            {/* Welcome Section */}
            <div className="flex justify-between items-end animate-slide-up">
                <div>
                    <h1 className="text-4xl font-extrabold text-gray-900 tracking-tight">Dashboard</h1>
                    <p className="text-gray-500 mt-2 text-lg">Welkom terug! Hier is een overzicht van uw portaal.</p>
                </div>
                <div className="hidden md:flex items-center gap-2 px-4 py-2 bg-white rounded-2xl border border-gray-100 shadow-sm text-sm font-bold text-gray-400">
                    <Calendar className="w-4 h-4" />
                    {new Date().toLocaleDateString('nl-NL', { weekday: 'long', day: 'numeric', month: 'long' })}
                </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {stats.map((stat, index) => (
                    <div
                        key={stat.name}
                        className="group bg-white p-6 rounded-xl border border-gray-100 hover:border-brand-primary/20 hover:shadow-2xl hover:shadow-gray-200/50 transition-all duration-500 animate-slide-up"
                        style={{ animationDelay: `${index * 100}ms` }}
                    >
                        <div className="flex justify-between items-start mb-4">
                            <div className={`${stat.bg} ${stat.color} p-4 rounded-2xl transition-transform duration-500 group-hover:scale-110 group-hover:rotate-3`}>
                                <stat.icon size={24} />
                            </div>
                            <div className="flex items-center gap-1 text-brand-primary font-bold text-xs bg-brand-primary/10 px-2 py-1 rounded-full">
                                <TrendingUp className="w-3 h-3" />
                                <span>+12%</span>
                            </div>
                        </div>
                        <div>
                            <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">{stat.name}</p>
                            <p className="text-3xl font-black text-gray-900 mt-1">{stat.value}</p>
                        </div>
                    </div>
                ))}
            </div>

            {/* Bottom Sections */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
                {/* Recent Offers */}
                <div className="bg-white p-8 rounded-2xl border border-gray-100 shadow-sm animate-blur-in delay-300">
                    <div className="flex justify-between items-center mb-8">
                        <h3 className="text-xl font-bold text-gray-900">Recente Aanvragen</h3>
                        <Link href="/admin/aanvragen" className="text-sm font-bold text-brand-primary hover:underline flex items-center gap-1">
                            Alle aanvragen <ExternalLinkIcon size={16} />
                        </Link>
                    </div>
                    {offers.length === 0 ? (
                        <div className="flex flex-col items-center justify-center py-16 px-4 bg-gray-50/50 rounded-2xl border border-dashed border-gray-200">
                            <MessageCircleIcon size={48} className="text-gray-200 mb-4" />
                            <p className="text-gray-400 text-sm font-medium text-center">Geen nieuwe aanvragen.</p>
                        </div>
                    ) : (
                        <div className="space-y-4">
                            {(offers as any[]).slice(0, 3).map((offer: any) => (
                                <Link
                                    key={offer.id}
                                    href={`/admin/aanvragen/${offer.id}`}
                                    className="flex items-center justify-between p-4 bg-gray-50 hover:bg-brand-primary/5 rounded-2xl transition-all group"
                                >
                                    <div>
                                        <p className="font-bold text-gray-900 group-hover:text-brand-primary transition-colors">{offer.customers?.name}</p>
                                        <p className="text-xs text-gray-400 font-medium">{offer.service}</p>
                                    </div>
                                    <RightChevron size={20} className="text-gray-300 group-hover:text-brand-primary" />
                                </Link>
                            ))}
                        </div>
                    )}
                </div>

                {/* Upcoming Agenda */}
                <div className="bg-white p-8 rounded-2xl border border-gray-100 shadow-sm animate-blur-in delay-400">
                    <div className="flex justify-between items-center mb-8">
                        <h3 className="text-xl font-bold text-gray-900">Eerstvolgende Afspraken</h3>
                        <Link href="/admin/afspraken" className="text-sm font-bold text-brand-primary hover:underline flex items-center gap-1">
                            Volledige agenda <ExternalLinkIcon size={16} />
                        </Link>
                    </div>
                    {upcomingAppointments.length === 0 ? (
                        <div className="flex flex-col items-center justify-center py-16 px-4 bg-gray-50/50 rounded-2xl border border-dashed border-gray-200">
                            <Calendar className="w-12 h-12 text-gray-200 mb-4" />
                            <p className="text-gray-400 text-sm font-medium text-center">Geen geplande afspraken.</p>
                        </div>
                    ) : (
                        <div className="space-y-4">
                            {(upcomingAppointments as any[]).map((app: any) => (
                                <Link
                                    key={app.id}
                                    href={`/admin/afspraken/${app.id}`}
                                    className="flex items-center gap-4 p-4 bg-gray-50/50 hover:bg-white rounded-2xl border border-transparent hover:border-gray-200 transition-all group"
                                >
                                    {/* Date Box */}
                                    <div className="w-14 h-14 bg-white rounded-xl flex flex-col items-center justify-center shadow-[0_2px_8px_-2px_rgba(0,0,0,0.05)] border border-gray-100/50 shrink-0">
                                        <span className="text-[10px] font-black text-[#5ecc41] uppercase tracking-wider">
                                            {new Date(app.date).toLocaleDateString('nl-NL', { month: 'short' })}
                                        </span>
                                        <span className="text-xl font-black text-gray-900 leading-none mt-0.5">
                                            {new Date(app.date).getDate()}
                                        </span>
                                    </div>
                                    
                                    {/* Info */}
                                    <div className="flex-1 min-w-0">
                                        <p className="font-bold text-gray-900 text-[15px] truncate">{app.customers?.name}</p>
                                        <div className="flex items-center gap-1.5 text-[13px] text-gray-500 font-medium mt-0.5">
                                            <ClockIcon size={14} className="text-[#5ecc41]" />
                                            {app.time || (app.date?.includes('T') ? app.date.split('T')[1].substring(0, 5) : 'Tijd onbekend')}
                                        </div>
                                    </div>

                                    {/* Arrow */}
                                    <RightChevron size={20} className="text-gray-300 group-hover:text-gray-400 transition-colors shrink-0" />
                                </Link>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}
