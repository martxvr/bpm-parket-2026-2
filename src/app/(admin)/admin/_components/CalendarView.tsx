'use client'

import React, { useState } from 'react'
import { ChevronLeft, Calendar as CalendarIcon } from 'lucide-react'
import RightChevron from '@/components/ui/right-chevron'
import ClockIcon from '@/components/ui/clock-icon'
import MapPinIcon from '@/components/ui/map-pin-icon'
import UserIcon from '@/components/ui/user-icon'
import { deleteAppointment } from '../afspraken/actions'

interface Appointment {
    id: string
    name: string
    email: string
    phone: string
    date: string
    time: string
    service?: string
    message?: string
}

interface CalendarViewProps {
    appointments: Appointment[]
}

export default function CalendarView({ appointments }: CalendarViewProps) {
    const [currentDate, setCurrentDate] = useState(new Date())
    const [viewType, setViewType] = useState<'maand' | 'week' | 'dag'>('maand')

    const daysInMonth = (year: number, month: number) => new Date(year, month + 1, 0).getDate()
    // 0 = Sunday, 1 = Monday, etc. Adjusting so Monday is 0.
    const firstDayOfMonth = (year: number, month: number) => {
        let day = new Date(year, month, 1).getDay()
        return day === 0 ? 6 : day - 1
    }

    const prevPeriod = () => {
        if (viewType === 'maand') {
            setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1))
        } else if (viewType === 'week') {
            const next = new Date(currentDate)
            next.setDate(next.getDate() - 7)
            setCurrentDate(next)
        } else {
            const next = new Date(currentDate)
            next.setDate(next.getDate() - 1)
            setCurrentDate(next)
        }
    }

    const nextPeriod = () => {
        if (viewType === 'maand') {
            setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1))
        } else if (viewType === 'week') {
            const next = new Date(currentDate)
            next.setDate(next.getDate() + 7)
            setCurrentDate(next)
        } else {
            const next = new Date(currentDate)
            next.setDate(next.getDate() + 1)
            setCurrentDate(next)
        }
    }

    const monthName = currentDate.toLocaleString('nl-NL', { month: 'long' })
    const year = currentDate.getFullYear()

    const getAppointmentsForDate = (date: Date) => {
        const dateStr = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`
        return appointments.filter(app => app.date === dateStr).sort((a, b) => a.time.localeCompare(b.time))
    }

    // Helper to get start of the current week (Monday)
    const getStartOfWeek = (date: Date) => {
        const d = new Date(date)
        const day = d.getDay()
        const diff = d.getDate() - day + (day === 0 ? -6 : 1) // adjust when day is sunday
        return new Date(d.setDate(diff))
    }

    const renderAppointmentCard = (app: Appointment) => (
        <div
            key={app.id}
            onClick={() => window.location.href = `/admin/afspraken/${app.id}`}
            className="px-3 py-2 bg-brand-primary/10 border-l-4 border-brand-primary rounded-xl text-xs font-bold text-brand-primary hover:bg-brand-primary hover:text-white transition-all cursor-pointer shadow-sm group/app relative overflow-hidden"
            title={`${app.time} - ${app.name}`}
        >
            <div className="flex items-center justify-between gap-2 mb-1">
                <div className="flex items-center gap-1.5 truncate">
                    <ClockIcon size={14} className="shrink-0" />
                    <span className="shrink-0">{app.time}</span>
                </div>
                <button
                    onClick={async (e) => {
                        e.stopPropagation();
                        if (confirm('Weet je zeker dat je deze afspraak wilt verwijderen?')) {
                            await deleteAppointment(app.id)
                        }
                    }}
                    className="w-5 h-5 rounded-full bg-white/20 hover:bg-red-500 hover:text-white flex items-center justify-center opacity-0 group-hover/app:opacity-100 transition-opacity shrink-0"
                    title="Verwijderen"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-3 h-3"><path d="M3 6h18"/><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/></svg>
                </button>
            </div>
            <div className="truncate">{app.name}</div>
            {app.service && <div className="text-[10px] opacity-70 truncate font-medium mt-0.5">{app.service.replace('-', ' ')}</div>}
        </div>
    )

    const renderMonthView = () => {
        const days = []
        const totalDays = daysInMonth(year, currentDate.getMonth())
        const offset = firstDayOfMonth(year, currentDate.getMonth())

        for (let i = 0; i < offset; i++) days.push(null)
        for (let i = 1; i <= totalDays; i++) days.push(i)

        return (
            <>
                <div className="grid grid-cols-7 border-b border-gray-50 bg-gray-50/30">
                    {['Ma', 'Di', 'Wo', 'Do', 'Vr', 'Za', 'Zo'].map(day => (
                        <div key={day} className="py-4 text-center text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">
                            {day}
                        </div>
                    ))}
                </div>
                <div className="grid grid-cols-7 auto-rows-[160px]">
                    {days.map((day, idx) => {
                        if (day === null) return <div key={`empty-${idx}`} className="border-r border-b border-gray-50 bg-gray-50/10" />

                        const cellDate = new Date(year, currentDate.getMonth(), day)
                        const dayAppointments = getAppointmentsForDate(cellDate)
                        const isToday = new Date().toDateString() === cellDate.toDateString()

                        return (
                            <div key={day} className="border-r border-b border-gray-50 p-3 group hover:bg-gray-50/50 transition-colors relative overflow-hidden flex flex-col">
                                <span className={`inline-flex items-center justify-center w-8 h-8 text-sm font-black rounded-xl mb-2 shrink-0 ${isToday ? 'bg-brand-primary text-white shadow-lg shadow-brand-primary/20' : 'text-gray-400 group-hover:text-gray-900 group-hover:scale-110'
                                    } transition-all duration-300`}>
                                    {day}
                                </span>
                                <div className="space-y-1.5 overflow-y-auto flex-1 custom-scrollbar pr-1">
                                    {dayAppointments.map(app => renderAppointmentCard(app))}
                                </div>
                            </div>
                        )
                    })}
                </div>
            </>
        )
    }

    const renderWeekView = () => {
        const startOfWeek = getStartOfWeek(currentDate)
        const weekDays = Array.from({ length: 7 }).map((_, i) => {
            const d = new Date(startOfWeek)
            d.setDate(d.getDate() + i)
            return d
        })

        return (
            <div className="grid grid-cols-7 border-t border-gray-50">
                {weekDays.map((date, i) => {
                    const isToday = new Date().toDateString() === date.toDateString()
                    const dayAppointments = getAppointmentsForDate(date)
                    const dayName = ['Zo', 'Ma', 'Di', 'Wo', 'Do', 'Vr', 'Za'][date.getDay()]

                    return (
                        <div key={i} className="border-r border-gray-50 min-h-[500px] flex flex-col">
                            <div className="p-4 text-center border-b border-gray-50 bg-gray-50/30">
                                <div className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mb-1">{dayName}</div>
                                <div className={`inline-flex items-center justify-center w-8 h-8 text-sm font-black rounded-xl ${isToday ? 'bg-brand-primary text-white shadow-lg shadow-brand-primary/20' : 'text-gray-900'} transition-all`}>
                                    {date.getDate()}
                                </div>
                            </div>
                            <div className="p-3 space-y-2 flex-1 hover:bg-gray-50/30 transition-colors">
                                {dayAppointments.map(app => renderAppointmentCard(app))}
                            </div>
                        </div>
                    )
                })}
            </div>
        )
    }

    const renderDayView = () => {
        const dayAppointments = getAppointmentsForDate(currentDate)
        const isToday = new Date().toDateString() === currentDate.toDateString()
        const dayName = currentDate.toLocaleString('nl-NL', { weekday: 'long' })

        return (
            <div className="min-h-[400px] flex flex-col">
                <div className="p-6 border-t border-b border-gray-50 bg-gray-50/30 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <div className={`w-14 h-14 rounded-2xl flex items-center justify-center text-2xl font-black ${isToday ? 'bg-brand-primary text-white shadow-lg shadow-brand-primary/20' : 'bg-white text-gray-900 border border-gray-100 shadow-sm'}`}>
                            {currentDate.getDate()}
                        </div>
                        <div>
                            <h3 className="text-xl font-bold text-gray-900 capitalize">{dayName}</h3>
                            <p className="text-gray-500 font-medium text-sm">{monthName} {year}</p>
                        </div>
                    </div>
                </div>
                <div className="p-6 bg-white flex-1">
                    {dayAppointments.length === 0 ? (
                        <div className="text-center py-20 text-gray-400 font-medium">
                            Geen afspraken op deze dag
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                            {dayAppointments.map(app => renderAppointmentCard(app))}
                        </div>
                    )}
                </div>
            </div>
        )
    }

    // Dynamic header formatting
    let headerTitle = `${monthName} ${year}`
    if (viewType === 'week') {
        const start = getStartOfWeek(currentDate)
        const end = new Date(start)
        end.setDate(end.getDate() + 6)
        
        if (start.getMonth() === end.getMonth()) {
            headerTitle = `${start.getDate()} - ${end.getDate()} ${start.toLocaleString('nl-NL', { month: 'long' })} ${year}`
        } else {
            headerTitle = `${start.getDate()} ${start.toLocaleString('nl-NL', { month: 'short' })} - ${end.getDate()} ${end.toLocaleString('nl-NL', { month: 'short' })} ${end.getFullYear()}`
        }
    } else if (viewType === 'dag') {
        headerTitle = `${currentDate.getDate()} ${monthName} ${year}`
    }

    return (
        <div className="bg-white rounded-2xl shadow-xl shadow-gray-200/50 border border-gray-100 overflow-hidden animate-blur-in">
            {/* Calendar Header */}
            <div className="p-6 md:p-8 border-b border-gray-50 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 bg-gray-50/50">
                <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-brand-primary rounded-2xl flex items-center justify-center shadow-lg shadow-brand-primary/20 shrink-0">
                        <CalendarIcon className="w-6 h-6 text-white" />
                    </div>
                    <div>
                        <h2 className="text-2xl font-black text-gray-900 capitalize leading-tight">{headerTitle}</h2>
                        <p className="text-gray-500 font-medium text-sm mt-0.5">Beheer je planning</p>
                    </div>
                </div>

                <div className="flex flex-col sm:flex-row items-end sm:items-center gap-4 sm:gap-6 w-full sm:w-auto">
                    {/* View type toggles */}
                    <div className="flex items-center bg-gray-100 p-1 rounded-xl shadow-inner w-full sm:w-auto justify-between sm:justify-start">
                        {['dag', 'week', 'maand'].map((type) => (
                            <button
                                key={type}
                                onClick={() => setViewType(type as 'dag' | 'week' | 'maand')}
                                className={`px-4 py-1.5 rounded-lg text-xs font-bold capitalize transition-all ${viewType === type ? 'bg-white text-brand-primary shadow-sm' : 'text-gray-500 hover:text-gray-900'}`}
                            >
                                {type}
                            </button>
                        ))}
                    </div>

                    {/* Navigation */}
                    <div className="flex items-center gap-2">
                        <button
                            onClick={prevPeriod}
                            className="p-2.5 hover:bg-white rounded-xl transition-all border border-transparent hover:border-gray-100 text-gray-400 hover:text-brand-primary shadow-sm hover:shadow-md"
                        >
                            <ChevronLeft className="w-5 h-5" />
                        </button>
                        <button
                            onClick={() => setCurrentDate(new Date())}
                            className="px-5 py-2.5 bg-white hover:bg-gray-50 text-gray-700 font-bold rounded-xl border border-gray-100 transition-all shadow-sm hover:shadow-md text-xs tracking-wide"
                        >
                            Vandaag
                        </button>
                        <button
                            onClick={nextPeriod}
                            className="p-2.5 hover:bg-white rounded-xl transition-all border border-transparent hover:border-gray-100 text-gray-400 hover:text-brand-primary shadow-sm hover:shadow-md"
                        >
                            <RightChevron size={20} />
                        </button>
                    </div>
                </div>
            </div>

            {/* Calendar View Renders */}
            {viewType === 'maand' && renderMonthView()}
            {viewType === 'week' && renderWeekView()}
            {viewType === 'dag' && renderDayView()}
        </div>
    )
}
