'use client'

import { useCallback, useRef } from 'react'
import { cn } from '@/lib/cn'
import styles from './Card.module.css'

type CardHover = 'none' | 'lift' | 'glow'
type CardPadding = 'sm' | 'md' | 'lg'

interface CardProps {
  hover?: CardHover
  padding?: CardPadding
  className?: string
  children: React.ReactNode
  onClick?: () => void
}

const paddingClasses: Record<CardPadding, string> = {
  sm: 'p-4',
  md: 'p-6',
  lg: 'py-[36px] px-[32px]',
}

const hoverClasses: Record<CardHover, string> = {
  none: '',
  lift: 'hover:-translate-y-[3px] hover:shadow-[0_8px_32px_rgba(0,0,0,0.4)]',
  glow: '',
}

export function Card({
  hover = 'none',
  padding = 'md',
  className,
  children,
  onClick,
}: CardProps) {
  const cardRef = useRef<HTMLDivElement>(null)

  const handleMouseMove = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      if (hover !== 'glow' || !cardRef.current) return
      const rect = cardRef.current.getBoundingClientRect()
      const x = ((e.clientX - rect.left) / rect.width) * 100
      const y = ((e.clientY - rect.top) / rect.height) * 100
      cardRef.current.style.setProperty('--mx', x + '%')
      cardRef.current.style.setProperty('--my', y + '%')
    },
    [hover]
  )

  const isGlow = hover === 'glow'

  return (
    <div
      ref={cardRef}
      onClick={onClick}
      onMouseMove={handleMouseMove}
      className={cn(
        'relative overflow-hidden bg-[rgba(255,255,255,0.02)] border border-[rgba(255,255,255,0.07)] rounded-[16px] transition-all duration-300',
        isGlow
          ? cn(styles.cardGlow, 'hover:border-[rgba(255,255,255,0.14)]')
          : hoverClasses[hover],
        paddingClasses[padding],
        onClick && 'cursor-pointer',
        className
      )}
    >
      {children}
    </div>
  )
}
