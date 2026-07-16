'use client'

import { useEffect, useRef, useState, useCallback } from 'react'
import { useI18n } from '@/lib/i18n'
import { Reveal } from '@/components/ui/Reveal'

/* ── CountUp sub-component ── */
function CountUp({ target, suffix = '' }: { target: number; suffix?: string }) {
  const [display, setDisplay] = useState(0)
  const ref = useRef<HTMLSpanElement>(null)
  const triggered = useRef(false)
  const animRef = useRef<number | null>(null)

  const animate = useCallback(() => {
    const duration = 1400
    const startTime = performance.now()

    const tick = (now: number) => {
      const elapsed = now - startTime
      const progress = Math.min(elapsed / duration, 1)
      // Cubic ease-out: 1 - (1 - t)^3
      const eased = 1 - Math.pow(1 - progress, 3)
      setDisplay(Math.round(eased * target))

      if (progress < 1) {
        animRef.current = requestAnimationFrame(tick)
      } else {
        animRef.current = null
      }
    }

    animRef.current = requestAnimationFrame(tick)
  }, [target])

  useEffect(() => {
    return () => {
      if (animRef.current !== null) {
        cancelAnimationFrame(animRef.current)
      }
    }
  }, [])

  useEffect(() => {
    const el = ref.current
    if (!el) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !triggered.current) {
          triggered.current = true
          animate()
        }
        // Allow re-trigger if element leaves viewport
        if (!entry.isIntersecting) {
          triggered.current = false
          setDisplay(0)
          if (animRef.current !== null) {
            cancelAnimationFrame(animRef.current)
            animRef.current = null
          }
        }
      },
      { threshold: 0.5 }
    )

    observer.observe(el)
    return () => observer.disconnect()
  }, [animate])

  return (
    <span ref={ref}>
      {display}
      {suffix}
    </span>
  )
}

interface StatsSectionProps {
  agentCount: number
  categoryCount: number
}

/* ── StatsSection ── */
export function StatsSection({ agentCount, categoryCount }: StatsSectionProps) {
  const { t } = useI18n()

  const stats = [
    { value: agentCount, suffix: '', label: t('stat1'), delay: 1 as const, animate: true },
    { value: categoryCount, suffix: '', label: t('stat2'), delay: 2 as const, animate: true },
    { value: 12, suffix: '+', label: t('stat3'), delay: 3 as const, animate: true },
    { value: 0, suffix: '30%+', label: t('stat4'), delay: 4 as const, animate: false },
  ]

  return (
    <>
      <style>{`
        @media (max-width: 1024px) {
          .stats-row { grid-template-columns: repeat(2, 1fr); }
        }
        @media (max-width: 640px) {
          .stats-row { grid-template-columns: 1fr; }
        }
      `}</style>

      <section
        className="section relative z-[1] py-24 px-10 max-w-[1200px] mx-auto"
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
              color: 'var(--accent)',
              marginBottom: '14px',
              display: 'block',
            }}
          >
            {t('statsLabel')}
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
            {t('statsTitle')}
          </h2>
        </Reveal>
        <Reveal delay={3}>
          <p
            className="section-lead"
            style={{
              fontSize: '16px',
              color: 'var(--muted)',
              maxWidth: '560px',
              lineHeight: 1.6,
              marginBottom: '52px',
            }}
          >
            {t('statsDesc')}
          </p>
        </Reveal>

        <div
          className="stats-row"
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(4, 1fr)',
            gap: '24px',
          }}
        >
          {stats.map((stat) => (
            <Reveal key={stat.label} delay={stat.delay}>
              <div
                className="stat-card"
                onMouseEnter={(e) => {
                  const el = e.currentTarget
                  el.style.borderColor = 'var(--accent)'
                  el.style.transform = 'translateY(-2px)'
                }}
                onMouseLeave={(e) => {
                  const el = e.currentTarget
                  el.style.borderColor = 'var(--border)'
                  el.style.transform = ''
                }}
                style={{
                  textAlign: 'center',
                  padding: '44px 24px',
                  background: 'var(--surface-tint)',
                  border: '1px solid var(--border)',
                  borderRadius: '16px',
                  transition: 'border-color 0.3s, transform 0.3s',
                }}
              >
                <div
                  style={{
                    fontFamily: 'var(--font-mono)',
                    fontSize: '52px',
                    fontWeight: 700,
                    letterSpacing: '-0.04em',
                    background: 'var(--text-gradient-stat)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    backgroundClip: 'text',
                    fontVariantNumeric: 'tabular-nums',
                    lineHeight: 1,
                    marginBottom: '8px',
                  }}
                >
                  {stat.animate ? (
                    <CountUp target={stat.value} suffix={stat.suffix} />
                  ) : (
                    <>{stat.suffix}</>
                  )}
                </div>
                <div
                  style={{
                    fontSize: '14px',
                    color: 'var(--muted)',
                    marginTop: '6px',
                  }}
                >
                  {stat.label}
                </div>
              </div>
            </Reveal>
          ))}
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
