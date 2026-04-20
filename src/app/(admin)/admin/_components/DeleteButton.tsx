'use client'

import React, { useState } from 'react'
import TrashIcon from '@/components/ui/trash-icon'
import RefreshIcon from '@/components/ui/refresh-icon'

interface DeleteButtonProps {
    onDelete: () => Promise<void>
    confirmMessage?: string
    className?: string
}

export default function DeleteButton({
    onDelete,
    confirmMessage = 'Weet je zeker dat je dit wilt verwijderen?',
    className = "p-3 bg-gray-50 hover:bg-red-50 text-gray-400 hover:text-red-600 rounded-xl transition-all"
}: DeleteButtonProps) {
    const [isDeleting, setIsDeleting] = useState(false)

    const handleDelete = async (e: React.MouseEvent) => {
        e.preventDefault()

        if (!confirm(confirmMessage)) return

        setIsDeleting(true)
        try {
            await onDelete()
        } catch (error) {
            console.error('Delete failed:', error)
            alert('Er is iets misgegaan bij het verwijderen.')
            setIsDeleting(false)
        }
    }

    return (
        <button
            type="button"
            onClick={handleDelete}
            disabled={isDeleting}
            className={className}
            title="Verwijderen"
        >
            {isDeleting ? (
                <RefreshIcon size={16} className="animate-spin" />
            ) : (
                <TrashIcon size={16} />
            )}
        </button>
    )
}
