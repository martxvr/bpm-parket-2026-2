'use client'

import React, { useState } from 'react'
import { Calendar, Plus } from 'lucide-react'
import LayoutDashboardIcon from '@/components/ui/layout-dashboard-icon'
import Link from 'next/link'
import CalendarView from './CalendarView'
import DeleteButton from './DeleteButton'
import { deleteAppointment } from '../afspraken/actions'

interface Appointment {
    id: string
    name: string
    email: string
    phone: string
    date: string
    time: string
    status: string
    service: string
    customers?: { name: string }
}

interface AppointmentsClientProps {
    initialAppointments: any[]
}

export default function AppointmentsClient({ initialAppointments }: AppointmentsClientProps) {
    const [view, setView] = useState<'list' | 'calendar'>('calendar')

    const getStatusStyles = (status: string) => {
        switch (status) {
            case 'nieuw': return { bg: 'bg-blue-50', text: 'text-blue-700', dot: 'bg-blue-500' }
            case 'bevestigd': return { bg: 'bg-brand-primary/10', text: 'text-brand-primary', dot: 'bg-brand-primary' }
            case 'afgerond': return { bg: 'bg-gray-50', text: 'text-gray-700', dot: 'bg-gray-500' }
            case 'afgezegd': return { bg: 'bg-red-50', text: 'text-red-700', dot: 'bg-red-500' }
            default: return { bg: 'bg-gray-50', text: 'text-gray-700', dot: 'bg-gray-500' }
        }
    }

    // Map DB objects to Appointment interface
    const appointments: Appointment[] = initialAppointments.map(app => {
        const fullDate = app.date ? new Date(app.date) : new Date()
        const isoDateStr = fullDate.toISOString()
        const parsedDate = isoDateStr.split('T')[0]
        const parsedTime = app.time || isoDateStr.split('T')[1].substring(0, 5)

        return {
            id: app.id,
            name: app.customers?.name || 'Onbekende klant',
            email: app.customers?.email || '',
            phone: app.customers?.phone || '',
            date: parsedDate,
            time: parsedTime,
            status: app.status || 'nieuw',
            service: app.service || 'bezichtiging'
        }
    })

    return (
        <div className="space-y-10 animate-fade-in">
            {/* Header Section */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                <div className="animate-slide-up">
                    <h1 className="text-4xl font-extrabold text-gray-900 tracking-tight">Agenda</h1>
                    <p className="text-gray-500 mt-2 text-lg">Beheer al je afspraken in een handig overzicht.</p>
                </div>

                <div className="flex items-center gap-4 animate-slide-up delay-100">
                    {/* View Toggle */}
                    <div className="bg-gray-100 p-1 rounded-2xl flex items-center gap-1 shadow-inner">
                        <button
                            onClick={() => setView('calendar')}
                            className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-bold transition-all ${view === 'calendar' ? 'bg-white text-brand-primary shadow-sm' : 'text-gray-500 hover:text-gray-900'
                                }`}
                        >
                            <Calendar className="w-4 h-4" />
                            Kalender
                        </button>
                        <button
                            onClick={() => setView('list')}
                            className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-bold transition-all ${view === 'list' ? 'bg-white text-brand-primary shadow-sm' : 'text-gray-500 hover:text-gray-900'
                                }`}
                        >
                            <LayoutDashboardIcon size={16} />
                            Lijst
                        </button>
                    </div>

                    <button
                        onClick={() => alert('Google Calendar koppeling wordt later toegevoegd.')}
                        className="group flex items-center gap-2 px-5 py-3 rounded-xl text-sm font-bold border border-gray-100 bg-white text-gray-600 hover:border-brand-primary/20 hover:text-brand-primary transition-all active:scale-95 whitespace-nowrap shadow-sm"
                    >
                        <svg viewBox="0 0 24 24" className="w-4 h-4 transition-transform group-hover:scale-110" xmlns="http://www.w3.org/2000/svg">
                            <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                            <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                            <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" fill="#FBBC05"/>
                            <path d="M12 5.38c1.62 0 3.06.56 4.21 1.66l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                        </svg>
                        Connect Google
                    </button>

                    <Link
                        href="/admin/afspraken/new"
                        className="bg-brand-primary hover:bg-brand-secondary text-white px-6 py-3.5 rounded-2xl flex items-center gap-2 transition-all duration-300 shadow-lg shadow-brand-primary/20 hover:scale-105 active:scale-95 font-bold"
                    >
                        <Plus className="w-5 h-5 stroke-[3px]" />
                        Nieuwe Afspraak
                    </Link>
                </div>
            </div>

            {/* Content Section */}
            {view === 'calendar' ? (
                <CalendarView appointments={appointments} />
            ) : (
                <div className="grid gap-6">
                    {appointments.length === 0 ? (
                        <div className="bg-white rounded-2xl p-20 text-center border-2 border-dashed border-gray-100 animate-blur-in">
                            <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-6">
                                <Calendar className="w-10 h-10 text-gray-300" />
                            </div>
                            <h3 className="text-xl font-bold text-gray-900">Geen geplande afspraken</h3>
                            <p className="text-gray-500 mt-2 max-w-xs mx-auto">Je agenda is momenteel leeg.</p>
                        </div>
                    ) : (
                        appointments.map((appointment, index) => {
                            const style = getStatusStyles(appointment.status)
                            const appointmentDate = new Date(appointment.date)

                            return (
                                <div
                                    key={appointment.id}
                                    className="group bg-white rounded-xl border border-gray-100 hover:border-brand-primary/20 hover:shadow-2xl hover:shadow-gray-200/50 transition-all duration-500 flex flex-col md:flex-row items-stretch animate-slide-up overflow-hidden"
                                    style={{ animationDelay: `${index * 50}ms` }}
                                >
                                    {/* Date Section */}
                                    <div className="md:w-48 bg-gray-50/50 md:bg-gray-50/30 flex flex-col items-center justify-center p-6 border-b md:border-b-0 md:border-r border-gray-100 group-hover:bg-brand-primary group-hover:text-white transition-colors duration-500">
                                        <span className="text-sm font-bold uppercase tracking-widest opacity-60 group-hover:opacity-100 transition-opacity">
                                            {appointmentDate.toLocaleDateString('nl-NL', { weekday: 'short' })}
                                        </span>
                                        <span className="text-5xl font-black my-1">
                                            {appointmentDate.getDate()}
                                        </span>
                                        <span className="text-sm font-bold opacity-60 group-hover:opacity-100 transition-opacity">
                                            {appointmentDate.toLocaleDateString('nl-NL', { month: 'short' }).toUpperCase()}
                                        </span>
                                    </div>

                                    {/* Content Section */}
                                    <div className="flex-1 p-8 flex flex-col sm:flex-row items-center gap-8">
                                        <div className="flex-1 text-center sm:text-left space-y-4">
                                            <div className="flex flex-col sm:flex-row sm:items-center gap-3">
                                                <h3 className="font-bold text-gray-900 text-2xl group-hover:text-brand-primary transition-colors">
                                                    {appointment.name}
                                                </h3>
                                                <span className={`inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-[0.2em] ${style.bg} ${style.text} w-fit mx-auto sm:mx-0`}>
                                                    <div className={`w-1.5 h-1.5 rounded-full ${style.dot}`} />
                                                    {appointment.status}
                                                </span>
                                            </div>

                                            <div className="flex items-center justify-center sm:justify-start gap-4">
                                                <div className="bg-gray-50 px-4 py-2 rounded-xl text-gray-600 font-bold flex items-center gap-2 shadow-sm">
                                                    <Calendar className="w-4 h-4 text-brand-primary" />
                                                    {appointment.time}
                                                </div>
                                                <div className="text-gray-400 font-medium">
                                                    {appointment.service.replace('-', ' ')}
                                                </div>
                                            </div>
                                        </div>

                                        <div className="flex items-center gap-2">
                                            <Link
                                                href={`/admin/afspraken/${appointment.id}`}
                                                className="p-4 bg-gray-50 hover:bg-brand-primary hover:text-white rounded-2xl transition-all duration-300 text-gray-400"
                                            >
                                                <RightChevron size={24} />
                                            </Link>
                                            <DeleteButton
                                                onDelete={async () => {
                                                    await deleteAppointment(appointment.id)
                                                }}
                                                className="p-4 bg-gray-50 hover:bg-red-50 hover:text-red-500 rounded-2xl transition-all duration-300 text-gray-400"
                                            />
                                        </div>
                                    </div>
                                </div>
                            )
                        })
                    )}
                </div>
            )}
        </div>
    )
}

import RightChevron from '@/components/ui/right-chevron'
