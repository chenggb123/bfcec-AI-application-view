import { cn } from '@/lib/cn'

interface Tab {
  id: string
  label: string
}

interface TabsProps {
  tabs: Tab[]
  activeId: string
  onChange: (id: string) => void
  className?: string
}

export function Tabs({ tabs, activeId, onChange, className }: TabsProps) {
  return (
    <div
      className={cn(
        'flex gap-0 border-b border-border mb-6',
        className
      )}
    >
      {tabs.map((tab) => (
        <button
          key={tab.id}
          type="button"
          onClick={() => onChange(tab.id)}
          className={cn(
            'px-5 py-[10px] text-[13px] font-medium bg-none border-none border-b-2 border-transparent cursor-pointer transition-colors duration-200',
            'hover:text-fg-primary',
            activeId === tab.id
              ? 'text-brand-red border-brand-red'
              : 'text-fg-muted'
          )}
        >
          {tab.label}
        </button>
      ))}
    </div>
  )
}
