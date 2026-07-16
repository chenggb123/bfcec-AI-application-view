'use client'

import { useState, useEffect, useCallback, useRef } from 'react'
import { cn } from '@/lib/cn'

interface CarouselProps {
  items: React.ReactNode[]
  autoPlay?: boolean
  interval?: number
  className?: string
}

export function Carousel({
  items,
  autoPlay = false,
  interval = 5000,
  className,
}: CarouselProps) {
  const [current, setCurrent] = useState(0)
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null)

  const goTo = useCallback(
    (index: number) => {
      const len = items.length
      setCurrent(((index % len) + len) % len)
    },
    [items.length]
  )

  const prev = useCallback(() => goTo(current - 1), [current, goTo])
  const next = useCallback(() => goTo(current + 1), [current, goTo])

  useEffect(() => {
    if (!autoPlay) return
    timerRef.current = setInterval(() => {
      setCurrent((c) => (c + 1) % items.length)
    }, interval)
    return () => {
      if (timerRef.current) clearInterval(timerRef.current)
    }
  }, [autoPlay, interval, items.length])

  if (items.length === 0) return null

  return (
    <div
      className={cn(
        'relative bg-[var(--surface-tint)] border border-border rounded-[16px] overflow-hidden',
        className
      )}
    >
      <div className="overflow-hidden">
        <div
          className="flex transition-transform duration-500"
          style={{
            transform: `translateX(-${current * 100}%)`,
            transitionTimingFunction: 'cubic-bezier(0.32, 0.72, 0, 1)',
          }}
        >
          {items.map((item, i) => (
            <div
              key={i}
              className="min-w-full flex items-center justify-center bg-[rgba(255,255,255,0.015)] text-fg-muted font-mono text-[13px] tracking-[0.06em] relative"
            >
              <div className="carousel-item-wrapper w-full h-full">{item}</div>
              <div
                className="carousel-error-placeholder flex-col items-center justify-center gap-[8px] absolute inset-0"
                style={{ display: 'none', background: 'rgba(255,255,255,0.015)', color: 'var(--muted)', fontSize: '12px' }}
              >
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" style={{ opacity: 0.3 }}>
                  <rect x="3" y="3" width="18" height="18" rx="2" />
                  <circle cx="8.5" cy="8.5" r="1.5" />
                  <path d="M21 15l-5-5L5 21" />
                </svg>
                <span>Image load failed</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {items.length > 1 && (
        <>
          <button
            type="button"
            onClick={prev}
            className="absolute left-5 top-1/2 -translate-y-1/2 w-11 h-11 border border-border rounded-full bg-[rgba(20,20,20,0.85)] backdrop-blur-[12px] cursor-pointer grid place-items-center text-fg-primary transition-all duration-200 z-[2] hover:bg-brand-red hover:border-brand-red hover:text-white"
            aria-label="Previous"
          >
            <svg
              width="16"
              height="16"
              viewBox="0 0 16 16"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M10 4L6 8L10 12" />
            </svg>
          </button>
          <button
            type="button"
            onClick={next}
            className="absolute right-5 top-1/2 -translate-y-1/2 w-11 h-11 border border-border rounded-full bg-[rgba(20,20,20,0.85)] backdrop-blur-[12px] cursor-pointer grid place-items-center text-fg-primary transition-all duration-200 z-[2] hover:bg-brand-red hover:border-brand-red hover:text-white"
            aria-label="Next"
          >
            <svg
              width="16"
              height="16"
              viewBox="0 0 16 16"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M6 4L10 8L6 12" />
            </svg>
          </button>

          <div className="flex justify-center gap-[10px] py-5">
            {items.map((_, i) => (
              <button
                key={i}
                type="button"
                onClick={() => goTo(i)}
                className={cn(
                  'w-2 h-2 rounded-full border-none cursor-pointer transition-all duration-200',
                  i === current
                    ? 'bg-brand-red shadow-[0_0_8px_rgba(218,41,28,0.25)]'
                    : 'bg-[rgba(255,255,255,0.12)]'
                )}
                aria-label={`Go to slide ${i + 1}`}
              />
            ))}
          </div>
        </>
      )}
    </div>
  )
}
