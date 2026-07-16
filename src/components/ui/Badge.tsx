import { cn } from '@/lib/cn'

type BadgeVariant = 'published' | 'draft'

interface BadgeProps {
  variant: BadgeVariant
  className?: string
  children: React.ReactNode
}

const variantStyles: Record<BadgeVariant, string> = {
  published: 'text-success bg-[rgba(34,197,94,0.10)] border-[rgba(34,197,94,0.2)]',
  draft: 'text-warn bg-[rgba(245,158,11,0.10)] border-[rgba(245,158,11,0.2)]',
}

export function Badge({ variant, className, children }: BadgeProps) {
  return (
    <span
      className={cn(
        'inline-block px-3 py-[3px] rounded-full text-[10px] font-semibold tracking-[0.08em] uppercase font-mono border',
        variantStyles[variant],
        className
      )}
    >
      {children}
    </span>
  )
}
