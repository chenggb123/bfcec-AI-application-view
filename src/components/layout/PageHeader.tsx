import { cn } from '@/lib/cn'

interface PageHeaderProps {
  title: string
  description?: string
  children?: React.ReactNode
  className?: string
}

export function PageHeader({
  title,
  description,
  children,
  className,
}: PageHeaderProps) {
  return (
    <div
      className={cn(
        'pt-[72px] pb-9 px-10',
        'max-w-[1200px] mx-auto',
        'max-sm:pt-12 max-sm:pb-6 max-sm:px-4',
        className
      )}
      style={
        {
          paddingLeft: '40px',
          paddingRight: '40px',
        } as React.CSSProperties
      }
    >
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '12px',
        }}
      >
        {/* Title + description group */}
        <div>
          <h1
            className="font-display text-[30px] sm:text-[38px] lg:text-[44px] font-bold tracking-[-0.03em] leading-[1.12] mb-[10px]"
          >
            {title}
          </h1>
          {description && (
            <p
              style={{
                fontSize: '16px',
                color: 'var(--muted)',
                maxWidth: '520px',
              }}
            >
              {description}
            </p>
          )}
        </div>

        {/* Action buttons slot */}
        {children && <div style={{ display: 'flex', gap: '10px' }}>{children}</div>}
      </div>
    </div>
  )
}
