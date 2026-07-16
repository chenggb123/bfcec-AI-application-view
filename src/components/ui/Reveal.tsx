'use client'

import { useScrollReveal } from '@/hooks/useScrollReveal'
import { cn } from '@/lib/cn'

interface RevealProps {
  children: React.ReactNode
  delay?: 1 | 2 | 3 | 4 | 5
  className?: string
}

export function Reveal({ children, delay, className }: RevealProps) {
  const ref = useScrollReveal()

  const delayClass = delay ? `reveal-d${delay}` : undefined

  return (
    <div ref={ref} className={cn('reveal', delayClass, className)}>
      {children}
    </div>
  )
}
