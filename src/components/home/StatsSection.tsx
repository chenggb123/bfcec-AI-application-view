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
        .stats-row {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 24px;
        }
        @media (max-width: 1024px) {
          .stats-row { grid-template-columns: repeat(2, 1fr); gap: 16px; }
        }
        @media (max-width: 640px) {
          .stats-row { grid-template-columns: 1fr; gap: 14px; }
        }
      `}</style>

      <section
        className="section relative z-[1] px-4 sm:px-8 lg:px-10 pt-14 sm:pt-20 pb-14 sm:pb-24 max-w-[1200px] mx-auto"
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
            className="font-display text-[26px] sm:text-[32px] lg:text-[38px] font-bold tracking-[-0.025em] leading-[1.18] mb-4"
          >
            {t('statsTitle')}
          </h2>
        </Reveal>
        <Reveal delay={3}>
          <p
            className="text-[14px] sm:text-[16px] leading-relaxed mb-10 sm:mb-[52px] max-w-[560px]"
            style={{ color: 'var(--muted)' }}
          >
            {t('statsDesc')}
          </p>
        </Reveal>

        <div className="stats-row">
          {stats.map((stat) => (
            <Reveal key={stat.label} delay={stat.delay}>
              <div
                className="stat-card text-center py-8 sm:py-[44px] px-4 sm:px-6"
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
                  background: 'var(--surface-tint)',
                  border: '1px solid var(--border)',
                  borderRadius: '16px',
                  transition: 'border-color 0.3s, transform 0.3s',
                }}
              >
                <div
                  className="font-mono text-[36px] sm:text-[44px] lg:text-[52px] font-bold tracking-[-0.04em] leading-none mb-2 tabular-nums"
                  style={{
                    background: 'var(--text-gradient-stat)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    backgroundClip: 'text',
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
    </>
  )
}
