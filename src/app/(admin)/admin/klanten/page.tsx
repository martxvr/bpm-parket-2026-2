import React from 'react'
import Link from 'next/link'
import { Plus, Pencil } from 'lucide-react'
import UserIcon from '@/components/ui/user-icon'
import { getCustomers } from '@/lib/admin-data'
import { deleteCustomer } from './actions'
import DeleteButton from '../_components/DeleteButton'

export default async function CustomersPage() {
    const customers = await getCustomers()

    return (
        <div className="space-y-8 animate-fade-in">
            {/* Header */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">Klanten</h1>
                    <p className="text-gray-400 mt-1">Beheer je klantenbestand en contactgegevens.</p>
                </div>
                <Link
                    href="/admin/klanten/new"
                    className="bg-brand-primary hover:bg-brand-secondary text-white px-5 py-2.5 rounded-xl flex items-center gap-2 transition-all duration-200 shadow-md hover:shadow-lg font-semibold text-sm"
                >
                    <Plus className="w-4 h-4 stroke-[3px]" />
                    Nieuwe Klant
                </Link>
            </div>

            {/* Table */}
            {customers.length === 0 ? (
                <div className="bg-white rounded-2xl p-20 text-center border border-gray-100">
                    <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-5">
                        <UserIcon size={32} className="text-gray-300" />
                    </div>
                    <h3 className="text-lg font-bold text-gray-900">Nog geen klanten</h3>
                    <p className="text-gray-400 mt-1.5 text-sm">Start met het opbouwen van je klantenkring.</p>
                    <Link
                        href="/admin/klanten/new"
                        className="mt-6 inline-flex items-center text-brand-primary font-semibold text-sm hover:underline"
                    >
                        Voeg een klant toe →
                    </Link>
                </div>
            ) : (
                <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
                    <table className="w-full">
                        <thead>
                            <tr className="border-b border-gray-100">
                                <th className="text-left py-4 px-6 text-xs font-semibold text-gray-400 uppercase tracking-wider">Naam</th>
                                <th className="text-left py-4 px-6 text-xs font-semibold text-gray-400 uppercase tracking-wider">Contact</th>
                                <th className="text-left py-4 px-6 text-xs font-semibold text-gray-400 uppercase tracking-wider hidden md:table-cell">Adres</th>
                                <th className="text-right py-4 px-6 text-xs font-semibold text-gray-400 uppercase tracking-wider">Acties</th>
                            </tr>
                        </thead>
                        <tbody>
                            {customers.map((customer, index) => (
                                <tr
                                    key={customer.id}
                                    className="border-b border-gray-50 last:border-b-0 hover:bg-gray-50/50 transition-colors group animate-slide-up"
                                    style={{ animationDelay: `${index * 30}ms` }}
                                >
                                    <td className="py-5 px-6">
                                        <div>
                                            <p className="font-bold text-gray-900">{customer.name}</p>
                                            {customer.company_name && (
                                                <p className="text-sm text-gray-400 mt-0.5">{customer.company_name}</p>
                                            )}
                                        </div>
                                    </td>
                                    <td className="py-5 px-6">
                                        <div className="space-y-0.5">
                                            {customer.email && (
                                                <p className="text-sm text-gray-600">{customer.email}</p>
                                            )}
                                            {customer.phone && (
                                                <p className="text-sm text-gray-400">{customer.phone}</p>
                                            )}
                                        </div>
                                    </td>
                                    <td className="py-5 px-6 hidden md:table-cell">
                                        <p className="text-sm text-gray-600">
                                            {[customer.address, customer.city].filter(Boolean).join(', ') || '—'}
                                        </p>
                                    </td>
                                    <td className="py-5 px-6">
                                        <div className="flex items-center gap-1.5 justify-end">
                                            <Link
                                                href={`/admin/klanten/${customer.id}`}
                                                className="p-2 text-gray-300 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-all"
                                                title="Bewerken"
                                            >
                                                <Pencil className="w-4 h-4" />
                                            </Link>
                                            <DeleteButton
                                                onDelete={async () => {
                                                    'use server'
                                                    await deleteCustomer(customer.id)
                                                }}
                                                confirmMessage="Weet je zeker dat je deze klant wilt verwijderen?"
                                                className="p-2 text-gray-300 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all"
                                            />
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    )
}
