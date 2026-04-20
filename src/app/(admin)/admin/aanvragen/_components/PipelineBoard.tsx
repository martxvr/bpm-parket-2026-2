'use client'

import React, { useState, useEffect } from 'react'
import { DragDropContext, Droppable, Draggable, DropResult } from '@hello-pangea/dnd'
import { Calendar } from 'lucide-react'
import ClockIcon from '@/components/ui/clock-icon'
import TriangleAlertIcon from '@/components/ui/triangle-alert-icon'
import CheckedIcon from '@/components/ui/checked-icon'
import MessageCircleIcon from '@/components/ui/message-circle-icon'
import DotsVerticalIcon from '@/components/ui/dots-vertical-icon'
import UserIcon from '@/components/ui/user-icon'
import RightChevron from '@/components/ui/right-chevron'
import TrashIcon from '@/components/ui/trash-icon'
import { useRouter } from 'next/navigation'
import { updateOfferteStatus, deleteOfferte } from '../actions'
import DeleteButton from '../../_components/DeleteButton'

interface Offerte {
    id: string
    customer_name: string
    service?: string
    status: string
    created_at: string
}

interface PipelineBoardProps {
    initialOffertes: Offerte[]
}

const COLUMNS = [
    { id: 'nieuw', title: 'Nieuw', icon: ClockIcon, color: 'blue' },
    { id: 'behandeling', title: 'In Behandeling', icon: TriangleAlertIcon, color: 'amber' },
    { id: 'verzonden', title: 'Verzonden', icon: CheckedIcon, color: 'green' },
    { id: 'gesloten', title: 'Afgerond / Gesloten', icon: MessageCircleIcon, color: 'gray' }
]

export default function PipelineBoard({ initialOffertes }: PipelineBoardProps) {
    const [offertes, setOffertes] = useState<Offerte[]>([])
    // Enable client-side only rendering for DnD
    const [isMounted, setIsMounted] = useState(false)
    const router = useRouter()

    useEffect(() => {
        setOffertes(initialOffertes)
        setIsMounted(true)
    }, [initialOffertes])

    if (!isMounted) return null

    const handleDragEnd = async (result: DropResult) => {
        const { source, destination, draggableId } = result

        // Dropped outside a valid column
        if (!destination) return

        // No column or order change
        if (
            source.droppableId === destination.droppableId &&
            source.index === destination.index
        ) {
            return
        }

        const newStatus = destination.droppableId

        // Optimistically update UI
        setOffertes(prev => {
            const updated = [...prev]
            const index = updated.findIndex(o => o.id === draggableId)
            if (index !== -1) {
                updated[index].status = newStatus
            }
            return updated
        })

        // Call Server Action
        try {
            await updateOfferteStatus(draggableId, newStatus)
        } catch (error) {
            console.error('Failed to update status:', error)
            // Revert on failure by re-syncing with initial prop (or fetching)
            // In a real app you might want to show a toast message here
            setOffertes(initialOffertes)
        }
    }

    const getIconColorClasses = (color: string) => {
        switch (color) {
            case 'blue': return 'text-blue-500'
            case 'amber': return 'text-amber-500'
            case 'green': return 'text-green-500'
            default: return 'text-gray-500'
        }
    }

    return (
        <DragDropContext onDragEnd={handleDragEnd}>
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 items-start h-full">
                {COLUMNS.map(column => {
                    const columnOffertes = offertes.filter(
                        o => (o.status || 'nieuw') === column.id
                    )

                    return (
                        <div key={column.id} className="flex flex-col h-full bg-gray-50/30 rounded-2xl border border-gray-200 overflow-hidden">
                            {/* Column Header */}
                            <div className="p-4 border-b border-gray-200 flex items-center justify-between bg-white">
                                <div className="flex items-center gap-2">
                                    <column.icon className={`w-5 h-5 flex-shrink-0 ${getIconColorClasses(column.color)}`} />
                                    <h3 className="font-bold text-sm text-gray-900 uppercase tracking-wider">{column.title}</h3>
                                </div>
                                <span className="bg-gray-100 text-gray-500 px-2 py-0.5 rounded-full text-xs font-bold">
                                    {columnOffertes.length}
                                </span>
                            </div>

                            {/* Droppable Area */}
                            <Droppable droppableId={column.id}>
                                {(provided, snapshot) => (
                                    <div
                                        {...provided.droppableProps}
                                        ref={provided.innerRef}
                                        className={`flex-1 p-4 min-h-[500px] transition-colors ${
                                            snapshot.isDraggingOver ? 'bg-gray-100/80' : ''
                                        }`}
                                    >
                                        <div className="space-y-4">
                                            {columnOffertes.map((offerte, index) => (
                                                <Draggable
                                                    key={offerte.id}
                                                    draggableId={offerte.id}
                                                    index={index}
                                                >
                                                    {(provided, snapshot) => (
                                                        <div
                                                            ref={provided.innerRef}
                                                            {...provided.draggableProps}
                                                            {...provided.dragHandleProps}
                                                            onClick={() => router.push(`/admin/aanvragen/${offerte.id}`)}
                                                            className={`bg-white rounded-xl border transition-all cursor-pointer ${
                                                                snapshot.isDragging 
                                                                    ? 'shadow-xl shadow-brand-primary/10 border-brand-primary/30 scale-105 z-50' 
                                                                    : 'shadow-sm border-gray-200 hover:border-brand-primary/30 hover:shadow-md'
                                                            }`}
                                                        >
                                                            <div className="block p-4">
                                                                <div className="flex justify-between items-start mb-3">
                                                                    <h4 className="font-bold text-gray-900 group-hover:text-brand-primary line-clamp-1 flex-1 pr-2">
                                                                        {offerte.customer_name}
                                                                    </h4>
                                                                    <div className="text-gray-300 hover:text-gray-500 p-1 -mt-1 -mr-1">
                                                                        <DotsVerticalIcon size={16} />
                                                                    </div>
                                                                </div>
                                                                
                                                                <div className="space-y-2 mb-4">
                                                                    <div className="flex items-center gap-2 text-xs text-gray-500">
                                                                        <UserIcon size={14} />
                                                                        <span className="truncate">{offerte.service?.replace('-', ' ') || 'Algemeen'}</span>
                                                                    </div>
                                                                    <div className="flex items-center gap-2 text-xs text-gray-400">
                                                                        <Calendar className="w-3.5 h-3.5" />
                                                                        {new Date(offerte.created_at).toLocaleDateString('nl-NL')}
                                                                    </div>
                                                                </div>

                                                                <div className="pt-3 border-t border-gray-100 flex justify-between items-center">
                                                                    <div 
                                                                        onClick={(e) => {
                                                                            e.stopPropagation()
                                                                        }}
                                                                        className="flex items-center"
                                                                    >
                                                                        <DeleteButton
                                                                            onDelete={async () => {
                                                                                await deleteOfferte(offerte.id)
                                                                            }}
                                                                            confirmMessage="Weet je zeker dat je deze aanvraag wilt verwijderen?"
                                                                            className="p-1.5 text-gray-300 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all"
                                                                        />
                                                                    </div>
                                                                    <div
                                                                        className="text-xs font-bold text-gray-400 flex items-center gap-1 group-hover:text-brand-primary transition-colors"
                                                                    >
                                                                        Openen <RightChevron size={12} />
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    )}
                                                </Draggable>
                                            ))}
                                            {provided.placeholder}
                                        </div>
                                    </div>
                                )}
                            </Droppable>
                        </div>
                    )
                })}
            </div>
        </DragDropContext>
    )
}
