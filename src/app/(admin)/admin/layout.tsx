import React from 'react'
import Sidebar from './_components/Sidebar'

export default function AdminLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return (
        <div className="flex h-screen bg-gray-50/50">
            {/* Sidebar */}
            <Sidebar />

            {/* Main Content */}
            <div className="flex-1 flex flex-col overflow-hidden animate-blur-in">
                <main className="flex-1 overflow-y-auto p-4 md:p-8 lg:p-12">
                    <div className="max-w-7xl mx-auto space-y-8 animate-slide-up delay-100">
                        {children}
                    </div>
                </main>
            </div>
        </div>
    )
}
