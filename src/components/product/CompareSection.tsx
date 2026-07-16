import { useI18n } from '@/lib/i18n'

interface CompareSectionProps {
  before: string
  beforeEn: string
  after: string
  afterEn: string
}

export function CompareSection({ before, beforeEn, after, afterEn }: CompareSectionProps) {
  const { t, isZh } = useI18n()

  const beforeText = isZh ? before : beforeEn
  const afterText = isZh ? after : afterEn

  return (
    <>
      <style>{`
        .compare-grid {
          display: grid;
          grid-template-columns: 1fr auto 1fr;
          gap: 24px;
          align-items: start;
        }
        @media (max-width: 640px) {
          .compare-grid {
            grid-template-columns: 1fr;
          }
          .compare-arrow {
            transform: rotate(90deg);
          }
        }
      `}</style>

      <div className="compare-grid">
        {/* Before */}
        <div
          className="relative"
          style={{
            background: 'var(--surface-tint)',
            border: '1px solid var(--border)',
            borderRadius: '16px',
            padding: '24px',
          }}
        >
          <span
            className="inline-block px-3 py-[3px] rounded-full text-[10px] font-semibold uppercase font-mono tracking-[0.08em] mb-3"
            style={{
              background: 'var(--surface-tint)',
              color: 'var(--muted)',
              border: '1px solid var(--border)',
            }}
          >
            {t('beforeLabel')}
          </span>
          <p className="text-[14px] mt-3" style={{ color: 'var(--muted)', whiteSpace: 'pre-line', lineHeight: '1.75' }}>
            {beforeText}
          </p>
        </div>

        {/* Arrow */}
        <div className="compare-arrow flex items-center justify-center self-center">
          {/* Gradient line */}
          <div
            style={{
              width: '48px',
              height: '3px',
              background:
                'linear-gradient(90deg, transparent, rgba(218,41,28,0.5), transparent)',
            }}
          />
          {/* Triangle */}
          <div
            style={{
              width: 0,
              height: 0,
              borderTop: '6px solid transparent',
              borderBottom: '6px solid transparent',
              borderLeft: '8px solid rgba(218,41,28,0.6)',
            }}
          />
        </div>

        {/* After */}
        <div
          className="relative"
          style={{
            background: 'rgba(218,41,28,0.04)',
            border: '1px solid rgba(218,41,28,0.12)',
            borderRadius: '16px',
            padding: '24px',
          }}
        >
          <span
            className="inline-block px-3 py-[3px] rounded-full text-[10px] font-semibold uppercase font-mono tracking-[0.08em] mb-3"
            style={{
              background: 'rgba(218,41,28,0.12)',
              color: 'var(--accent)',
              border: '1px solid rgba(218,41,28,0.2)',
            }}
          >
            {t('afterLabel')}
          </span>
          <p className="text-[14px] mt-3 text-fg-primary" style={{ whiteSpace: 'pre-line', lineHeight: '1.75' }}>
            {afterText}
          </p>
        </div>
      </div>
    </>
  )
}
