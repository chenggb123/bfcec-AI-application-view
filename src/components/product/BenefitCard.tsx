'use client'

import { useEffect, useRef } from 'react'
import { useI18n } from '@/lib/i18n'
import type { Benefit } from '@/types'

interface BenefitCardProps {
  benefit: Benefit
  index: number
}

export function BenefitCard({ benefit, index }: BenefitCardProps) {
  const fillRef = useRef<HTMLDivElement>(null)
  const { isZh } = useI18n()

  useEffect(() => {
    if (fillRef.current) {
      // Animate width on mount
      const target = fillRef.current.dataset.width
      if (target) {
        // Small delay so the CSS transition takes effect
        requestAnimationFrame(() => {
          if (fillRef.current) {
            fillRef.current.style.width = target
          }
        })
      }
    }
  }, [])

  return (
    <div
      className="group transition-all duration-300"
      style={{
        background: 'var(--surface-tint)',
        border: '1px solid var(--border)',
        borderRadius: '16px',
        padding: '32px',
      }}
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
    >
      {/* Number */}
      <div className="flex items-baseline gap-[4px]">
        <span
          className="font-mono text-[46px] font-bold tracking-[-0.04em] leading-none tabular-nums"
          style={{ color: 'var(--accent)' }}
        >
          {benefit.value}
        </span>
        <span
          className="font-mono text-[20px] font-medium"
          style={{ color: 'var(--accent)' }}
        >
          {isZh ? benefit.unit : (benefit.unitEn || benefit.unit)}
        </span>
      </div>

      {/* Label */}
      <p className="text-[14px] mt-[10px]" style={{ color: 'var(--muted)' }}>
        {isZh ? benefit.label : benefit.labelEn}
      </p>

      {/* Progress bar */}
      <div
        className="mt-[14px] h-[4px] rounded-[2px] overflow-hidden"
        style={{ background: 'var(--surface-tint)' }}
      >
        <div
          ref={fillRef}
          className="h-full rounded-[2px] transition-all duration-[1200ms] ease-out"
          data-width={`${Math.min(benefit.value, 100)}%`}
          style={{
            width: '0%',
            background:
              'linear-gradient(90deg, #B60005, var(--accent), #E84030)',
            boxShadow: '0 0 10px rgba(218,41,28,0.4)',
          }}
        />
      </div>
    </div>
  )
}
