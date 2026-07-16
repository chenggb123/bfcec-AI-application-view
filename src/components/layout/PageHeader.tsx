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
            style={{
              fontFamily: 'var(--font-display)',
              fontSize: '44px',
              fontWeight: 700,
              letterSpacing: '-0.03em',
              lineHeight: 1.12,
              marginBottom: '10px',
            }}
            className="max-sm:text-[30px]"
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
