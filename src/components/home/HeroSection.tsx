'use client'

import { useRef, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { useI18n } from '@/lib/i18n'
import { Button } from '@/components/ui/Button'
import dynamic from 'next/dynamic'

const Aurora = dynamic(() => import('@/components/home/Aurora'), { ssr: false })

export function HeroSection() {
  const heroRef = useRef<HTMLDivElement>(null)
  const router = useRouter()
  const { t } = useI18n()

  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    if (!heroRef.current) return
    const rect = heroRef.current.getBoundingClientRect()
    const x = ((e.clientX - rect.left) / rect.width) * 100
    const y = ((e.clientY - rect.top) / rect.height) * 100
    heroRef.current.style.setProperty('--hx', x + '%')
    heroRef.current.style.setProperty('--hy', y + '%')
  }, [])

  return (
    <>
      <style>{`
        @keyframes lineShimmer {
          0%, 100% { width: 48px; opacity: 0.7; }
          50% { width: 64px; opacity: 1; }
        }
        @keyframes textShimmer {
          0% { background-position: 200% center; }
          100% { background-position: 0% center; }
        }
        .hero-glow {
          position: absolute;
          width: 700px;
          height: 700px;
          background: radial-gradient(
            circle at var(--hx, 50%) var(--hy, 50%),
            rgba(218, 41, 28, 0.10) 0%,
            transparent 60%
          );
          border-radius: 50%;
          pointer-events: none;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          transition: background 0.6s ease-out;
        }
        .hero-eyebrow-line {
          width: 48px;
          height: 2px;
          background: linear-gradient(90deg, transparent, #DA291C, #DA291C, transparent);
          background-size: 200% 100%;
          margin: 10px auto 0;
          border-radius: 1px;
          animation: lineShimmer 3s ease-in-out infinite;
        }
        .hero-title {
          font-family: var(--font-display);
          font-size: clamp(44px, 5.5vw, 72px);
          font-weight: 700;
          letter-spacing: -0.03em;
          line-height: 1.08;
          background: var(--text-gradient-hero);
          background-size: 200% auto;
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          animation: textShimmer 5s ease-in-out infinite;
          margin-bottom: 28px;
          text-wrap: pretty;
        }
        .hero-cta-wrapper:hover .hero-arrow {
          transform: translateX(4px);
        }
        .hero-arrow {
          transition: transform 0.2s;
        }

        @media (max-width: 640px) {
          .hero-title {
            font-size: clamp(28px, 8vw, 34px);
          }
        }
      `}</style>

      {/* Full-width Aurora background */}
      <div
        style={{
          position: 'relative',
          width: '100%',
          overflow: 'hidden',
        }}
      >
        <div
          style={{
            position: 'absolute',
            inset: 0,
            zIndex: 0,
            pointerEvents: 'none',
          }}
        >
          <Aurora
            colorStops={['#005587', '#5227FF', '#DA291C']}
            blend={0.5}
            amplitude={1.0}
            speed={0.5}
          />
        </div>

        {/* Mouse-tracking glow */}
        <div className="hero-glow" style={{ zIndex: 1 }} />

        {/* Content */}
        <div
          ref={heroRef}
          className="hero-container relative z-[2] px-4 sm:px-8 lg:px-10 pt-[100px] pb-[80px] sm:pt-[120px] sm:pb-[100px] lg:pt-[140px] lg:pb-[120px] max-w-[1000px] mx-auto text-center"
          onMouseMove={handleMouseMove}
        >
          {/* Eyebrow */}
          <div style={{ marginBottom: '28px' }}>
            <span
              style={{
                fontFamily: 'var(--font-mono)',
                fontSize: '12px',
                fontWeight: 600,
                letterSpacing: '0.12em',
                textTransform: 'uppercase',
                color: '#DA291C',
              }}
            >
              {t('heroEyebrow')}
            </span>
            <div className="hero-eyebrow-line" />
          </div>

          {/* Title */}
          <h1 className="hero-title">{t('heroTitle')}</h1>

          {/* Description */}
          <p
            className="text-[15px] sm:text-[18px] leading-[1.65] max-w-[620px] mx-auto mb-10 sm:mb-11 text-pretty"
            style={{ color: 'var(--muted)' }}
          >
            {t('heroDesc')}
          </p>

          {/* CTA Button */}
          <span className="hero-cta-wrapper inline-flex">
          <Button
            variant="primary"
            size="lg"
            rightIcon={
              <svg
                className="hero-arrow"
                width="16"
                height="16"
                viewBox="0 0 16 16"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.8"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M3 8h10 M9 4l4 4-4 4" />
              </svg>
            }
            style={{
              padding: '14px 36px',
              fontSize: '15px',
            }}
            onClick={() => router.push('/products')}
          >
            {t('heroCta')}
          </Button>
        </span>
        </div>
      </div>
    </>
  )
}
