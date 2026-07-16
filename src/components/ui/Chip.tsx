import { cn } from '@/lib/cn'

interface ChipProps {
  active?: boolean
  className?: string
  children: React.ReactNode
  onClick?: () => void
}

export function Chip({ active = false, className, children, onClick }: ChipProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        'px-[18px] py-[7px] border border-border rounded-full text-[13px] font-medium text-fg-muted bg-[var(--surface-tint)] cursor-pointer transition-all duration-200 tracking-[0.02em] whitespace-nowrap',
        'hover:border-brand-red hover:text-brand-red',
        active && 'border-brand-red text-brand-red bg-brand-subtle',
        className
      )}
    >
      {children}
    </button>
  )
}
