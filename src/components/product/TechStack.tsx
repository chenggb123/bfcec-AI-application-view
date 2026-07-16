interface TechStackProps {
  items: string[]
}

export function TechStack({ items }: TechStackProps) {
  if (!items || items.length === 0) return null

  return (
    <div className="flex flex-wrap gap-[10px]">
      {items.map((item) => (
        <span
          key={item}
          className="font-mono text-[13px] tracking-[0.03em] rounded-[6px] transition-all duration-200"
          style={{
            padding: '7px 18px',
            border: '1px solid var(--border)',
            color: 'var(--muted)',
            background: 'var(--surface-tint)',
          }}
          onMouseEnter={(e) => {
            const el = e.currentTarget
            el.style.borderColor = 'var(--accent)'
            el.style.color = 'var(--accent)'
            el.style.background = 'rgba(218,41,28,0.10)'
          }}
          onMouseLeave={(e) => {
            const el = e.currentTarget
            el.style.borderColor = 'var(--border)'
            el.style.color = 'var(--muted)'
            el.style.background = 'var(--surface-tint)'
          }}
        >
          {item}
        </span>
      ))}
    </div>
  )
}
