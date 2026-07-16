'use client'

import { useEffect, useCallback } from 'react'
import { createPortal } from 'react-dom'
import { cn } from '@/lib/cn'

interface ModalProps {
  open: boolean
  onClose: () => void
  title?: string
  children: React.ReactNode
}

export function Modal({ open, onClose, title, children }: ModalProps) {
  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    },
    [onClose]
  )

  useEffect(() => {
    if (open) {
      document.addEventListener('keydown', handleKeyDown)
      document.body.style.overflow = 'hidden'
    }
    return () => {
      document.removeEventListener('keydown', handleKeyDown)
      document.body.style.overflow = ''
    }
  }, [open, handleKeyDown])

  if (!open) return null

  return createPortal(
    <div
      className="fixed inset-0 z-[200] bg-[rgba(0,0,0,0.75)] flex items-start justify-center px-5 py-10 overflow-y-auto"
      style={{ animation: 'modalOverlayIn 0.2s ease-out' }}
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose()
      }}
    >
      <style>{`
        @keyframes modalOverlayIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes modalCardIn {
          from { opacity: 0; transform: translateY(16px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
      <div
        className="bg-surface border border-border rounded-xl w-full max-w-[780px] p-8"
        style={{ animation: 'modalCardIn 0.25s ease-out' }}
      >
        {title && (
          <h3 className="text-lg font-bold mb-6 font-display">{title}</h3>
        )}
        {children}
      </div>
    </div>,
    document.body
  )
}
