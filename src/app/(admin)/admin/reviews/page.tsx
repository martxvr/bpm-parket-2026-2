import React from 'react'
import Link from 'next/link'
import { Plus, Pencil, Quote } from 'lucide-react'
import TrashIcon from '@/components/ui/trash-icon'
import StarIcon from '@/components/ui/star-icon'
import MapPinIcon from '@/components/ui/map-pin-icon'
import RightChevron from '@/components/ui/right-chevron'
import MessageCircleIcon from '@/components/ui/message-circle-icon'
import { getTestimonials } from '@/lib/admin-data'
import { deleteReview } from './actions'
import DeleteButton from '../_components/DeleteButton'

export default async function ReviewsPage() {
    const reviews = await getTestimonials()

    return (
        <div className="space-y-10 animate-fade-in">
            {/* Header Section */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                <div className="animate-slide-up">
                    <h1 className="text-4xl font-extrabold text-gray-900 tracking-tight flex items-center gap-3">
                        Reviews
                        <StarIcon size={32} className="text-amber-400 fill-amber-400" />
                    </h1>
                    <p className="text-gray-500 mt-2 text-lg">Beheer de klantbeoordelingen op de website.</p>
                </div>
                <Link
                    href="/admin/reviews/new"
                    className="bg-brand-primary hover:bg-brand-secondary text-white px-6 py-3 rounded-2xl flex items-center gap-2 transition-all duration-300 shadow-lg shadow-brand-primary/20 hover:scale-105 active:scale-95 animate-slide-up delay-100 font-bold"
                >
                    <Plus className="w-5 h-5 stroke-[3px]" />
                    Nieuwe Review
                </Link>
            </div>

            {/* Grid Section */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {reviews.length === 0 ? (
                    <div className="col-span-full bg-white rounded-2xl p-20 text-center border-2 border-dashed border-gray-100 animate-blur-in">
                        <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-6">
                            <MessageCircleIcon size={40} className="text-gray-300" />
                        </div>
                        <h3 className="text-xl font-bold text-gray-900">Geen reviews gevonden</h3>
                        <p className="text-gray-500 mt-2 max-w-xs mx-auto">Vraag je klanten om een review en plaats deze hier om vertrouwen te winnen.</p>
                        <Link
                            href="/admin/reviews/new"
                            className="mt-8 inline-flex items-center text-brand-primary font-bold hover:underline"
                        >
                            Review toevoegen →
                        </Link>
                    </div>
                ) : (
                    reviews.map((review, index) => (
                        <div
                            key={review.id}
                            className="group bg-white p-8 rounded-2xl border border-gray-100 hover:border-brand-primary/20 hover:shadow-2xl hover:shadow-gray-200/50 transition-all duration-500 flex flex-col justify-between animate-slide-up relative overflow-hidden"
                            style={{ animationDelay: `${index * 50}ms` }}
                        >
                            {/* Quote Icon Background */}
                            <Quote className="absolute -right-4 -top-4 w-32 h-32 text-gray-50 opacity-0 group-hover:opacity-100 transition-opacity duration-700 -rotate-12" />

                            <div className="relative z-10">
                                <div className="flex justify-between items-start mb-6">
                                    <div className="flex items-center gap-4">
                                        <div className="w-12 h-12 rounded-2xl bg-brand-primary/10 flex items-center justify-center text-brand-primary font-bold text-xl transition-transform duration-500 group-hover:scale-110 group-hover:rotate-3">
                                            {review.name.charAt(0).toUpperCase()}
                                        </div>
                                        <div>
                                            <h3 className="font-bold text-gray-900 text-lg group-hover:text-brand-primary transition-colors">{review.name}</h3>
                                            <div className="flex items-center gap-1.5 text-xs text-gray-400 font-medium">
                                                <MapPinIcon size={12} />
                                                {review.location || 'Onbekende locatie'}
                                            </div>
                                        </div>
                                    </div>
                                    <div className="flex gap-0.5">
                                        {[...Array(5)].map((_, i) => (
                                            <StarIcon key={i} className={`w-4 h-4 ${i < review.stars ? 'text-amber-400 fill-amber-400' : 'text-gray-100 fill-gray-100'}`} />
                                        ))}
                                    </div>
                                </div>

                                <blockquote className="text-gray-600 leading-relaxed font-medium line-clamp-4 relative py-2">
                                    <span className="text-brand-primary/20 text-4xl absolute -left-2 -top-2 font-serif">"</span>
                                    {review.text}
                                    <span className="text-brand-primary/20 text-4xl absolute -right-2 bottom-0 font-serif">"</span>
                                </blockquote>
                            </div>

                            <div className="mt-8 pt-6 border-t border-gray-50 flex items-center justify-between relative z-10">
                                <div className="flex items-center gap-1">
                                    <Link
                                        href={`/admin/reviews/${review.id}`}
                                        className="p-3 bg-gray-50 hover:bg-white hover:shadow-md text-gray-400 hover:text-blue-600 rounded-xl transition-all"
                                        title="Bewerken"
                                    >
                                        <Pencil className="w-4 h-4" />
                                    </Link>
                                    <DeleteButton
                                        onDelete={async () => {
                                            'use server'
                                            await deleteReview(review.id)
                                        }}
                                        confirmMessage="Weet je zeker dat je deze review wilt verwijderen?"
                                    />
                                </div>
                                <Link
                                    href={`/admin/reviews/${review.id}`}
                                    className="flex items-center gap-1 text-sm font-bold text-gray-400 group-hover:text-brand-primary transition-colors"
                                >
                                    Details <RightChevron size={16} />
                                </Link>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    )
}
