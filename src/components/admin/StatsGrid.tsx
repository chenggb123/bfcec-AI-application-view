interface StatItem {
  value: string
  label: string
}

interface StatsGridProps {
  items: StatItem[]
}

export function StatsGrid({ items }: StatsGridProps) {
  return (
    <>
      <style>{`
        .stats-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 16px;
        }
        @media (max-width: 768px) {
          .stats-grid {
            grid-template-columns: repeat(2, 1fr);
          }
        }
        @media (max-width: 480px) {
          .stats-grid {
            grid-template-columns: 1fr;
          }
        }
      `}</style>

      <div className="stats-grid">
        {items.map((item) => (
          <div
            key={item.label}
            className="group transition-all duration-200"
            style={{
              background: 'var(--surface)',
              border: '1px solid var(--border)',
              borderRadius: '8px',
              padding: '24px',
            }}
            onMouseEnter={(e) => {
              const el = e.currentTarget
              el.style.borderColor = 'rgba(218,41,28,0.2)'
              el.style.boxShadow = '0 4px 20px rgba(218,41,28,0.06)'
            }}
            onMouseLeave={(e) => {
              const el = e.currentTarget
              el.style.borderColor = 'var(--border)'
              el.style.boxShadow = ''
            }}
          >
            <div
              className="font-mono text-[32px] font-bold bg-clip-text"
              style={{
                background:
                  'linear-gradient(135deg, #DA291C, #E84030)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
              }}
            >
              {item.value}
            </div>
            <div
              className="text-[13px] mt-[4px]"
              style={{ color: 'var(--muted)' }}
            >
              {item.label}
            </div>
          </div>
        ))}
      </div>
    </>
  )
}
