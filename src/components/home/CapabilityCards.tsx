'use client'

import { useI18n } from '@/lib/i18n'
import { Card } from '@/components/ui/Card'
import { Reveal } from '@/components/ui/Reveal'

export function CapabilityCards() {
  const { t } = useI18n()

  return (
    <>
      <style>{`
        @media (max-width: 1200px) {
          .caps-grid { grid-template-columns: repeat(3, 1fr) !important; }
        }
        @media (max-width: 1024px) {
          .caps-grid { grid-template-columns: repeat(2, 1fr) !important; }
        }
        @media (max-width: 640px) {
          .caps-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>

      <section
        className="section relative z-[1] py-24 px-10 max-w-[1400px] mx-auto"
        style={{ padding: '96px 40px' }}
      >
        <Reveal>
          <span
            style={{
              fontFamily: 'var(--font-mono)',
              fontSize: '11px',
              fontWeight: 600,
              letterSpacing: '0.12em',
              textTransform: 'uppercase',
              color: '#DA291C',
              marginBottom: '14px',
              display: 'block',
            }}
          >
            {t('capLabel')}
          </span>
        </Reveal>
        <Reveal delay={2}>
          <h2
            style={{
              fontFamily: 'var(--font-display)',
              fontSize: '38px',
              fontWeight: 700,
              letterSpacing: '-0.025em',
              lineHeight: 1.18,
              marginBottom: '16px',
            }}
          >
            {t('capTitle')}
          </h2>
        </Reveal>
        <Reveal delay={3}>
          <p
            className="section-lead"
            style={{
              fontSize: '16px',
              color: 'var(--muted)',
              maxWidth: '720px',
              lineHeight: 1.6,
              marginBottom: '52px',
            }}
          >
            {t('capDesc')}
          </p>
        </Reveal>

        <div
          className="caps-grid"
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(5, 1fr)',
            gap: '24px',
          }}
        >
          {/* Card 1: 碎片化流程 → 端到端整合 */}
          <Reveal delay={1}>
            <Card hover="glow" padding="lg">
              <svg width="44" height="44" viewBox="0 0 44 44" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" style={{ color: '#DA291C', marginBottom: '22px' }}>
                <path d="M8 22h28M28 14l8 8-8 8" />
                <circle cx="8" cy="22" r="3" />
              </svg>
              <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '18px', fontWeight: 600, letterSpacing: '-0.01em', marginBottom: '10px' }}>
                {t('cap1Title')}
              </h3>
              <p style={{ fontSize: '14px', color: 'var(--muted)', lineHeight: 1.6 }}>
                {t('cap1Desc')}
              </p>
            </Card>
          </Reveal>

          {/* Card 2: 重复性工作 → 释放创新 */}
          <Reveal delay={2}>
            <Card hover="glow" padding="lg">
              <svg width="44" height="44" viewBox="0 0 44 44" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" style={{ color: '#DA291C', marginBottom: '22px' }}>
                <path d="M22 6v4M22 34v4M6 22h4M34 22h4" />
                <circle cx="22" cy="22" r="8" />
                <path d="M22 14v8l5 3" />
              </svg>
              <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '18px', fontWeight: 600, letterSpacing: '-0.01em', marginBottom: '10px' }}>
                {t('cap2Title')}
              </h3>
              <p style={{ fontSize: '14px', color: 'var(--muted)', lineHeight: 1.6 }}>
                {t('cap2Desc')}
              </p>
            </Card>
          </Reveal>

          {/* Card 3: 经验驱动 → 数据决策 */}
          <Reveal delay={3}>
            <Card hover="glow" padding="lg">
              <svg width="44" height="44" viewBox="0 0 44 44" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" style={{ color: '#DA291C', marginBottom: '22px' }}>
                <rect x="6" y="28" width="8" height="12" rx="1" />
                <rect x="18" y="18" width="8" height="22" rx="1" />
                <rect x="30" y="8" width="8" height="32" rx="1" />
                <path d="M2 22h40" />
              </svg>
              <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '18px', fontWeight: 600, letterSpacing: '-0.01em', marginBottom: '10px' }}>
                {t('cap3Title')}
              </h3>
              <p style={{ fontSize: '14px', color: 'var(--muted)', lineHeight: 1.6 }}>
                {t('cap3Desc')}
              </p>
            </Card>
          </Reveal>

          {/* Card 4: 专家依赖 → 知识结构化 */}
          <Reveal delay={4}>
            <Card hover="glow" padding="lg">
              <svg width="44" height="44" viewBox="0 0 44 44" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" style={{ color: '#DA291C', marginBottom: '22px' }}>
                <circle cx="22" cy="14" r="6" />
                <path d="M8 36v-4a8 8 0 018-8h12a8 8 0 018 8v4" />
                <circle cx="22" cy="14" r="2" fill="currentColor" />
                <path d="M22 20v4M18 28l2 2 4-4" />
              </svg>
              <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '18px', fontWeight: 600, letterSpacing: '-0.01em', marginBottom: '10px' }}>
                {t('cap4Title')}
              </h3>
              <p style={{ fontSize: '14px', color: 'var(--muted)', lineHeight: 1.6 }}>
                {t('cap4Desc')}
              </p>
            </Card>
          </Reveal>

          {/* Card 5: 知识沉睡 → 资产激活 */}
          <Reveal delay={5}>
            <Card hover="glow" padding="lg">
              <svg width="44" height="44" viewBox="0 0 44 44" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" style={{ color: '#DA291C', marginBottom: '22px' }}>
                <path d="M6 8h20a4 4 0 014 4v20a4 4 0 01-4 4H6a4 4 0 01-4-4V12a4 4 0 014-4z" />
                <path d="M10 16h12M10 22h8" />
                <circle cx="32" cy="32" r="10" />
                <path d="M28 28l8 8M36 28l-8 8" />
              </svg>
              <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '18px', fontWeight: 600, letterSpacing: '-0.01em', marginBottom: '10px' }}>
                {t('cap5Title')}
              </h3>
              <p style={{ fontSize: '14px', color: 'var(--muted)', lineHeight: 1.6 }}>
                {t('cap5Desc')}
              </p>
            </Card>
          </Reveal>
        </div>
      </section>

      <style>{`
        @media (max-width: 640px) {
          .section { padding: 56px 16px; }
          .section h2 { font-size: 26px; }
        }
      `}</style>
    </>
  )
}
