'use client'

import Link from 'next/link'
import { useI18n } from '@/lib/i18n'
import { Reveal } from '@/components/ui/Reveal'
import { Chip } from '@/components/ui/Chip'
import { Badge } from '@/components/ui/Badge'
import { Carousel } from '@/components/ui/Carousel'
import { CompareSection } from '@/components/product/CompareSection'
import { BenefitCard } from '@/components/product/BenefitCard'
import type { Product } from '@/types'

interface ProductDetailClientProps {
  product: Product | undefined
}

export default function ProductDetailClient({ product }: ProductDetailClientProps) {
  const { t, isZh } = useI18n()

  /* ── Not-found state ── */
  if (!product) {
    return (
      <div className="detail" style={{ maxWidth: '1200px', margin: '0 auto', padding: '56px 40px 80px' }}>
        <div className="not-found" style={{ textAlign: 'center', padding: '80px 0' }}>
          <h2
            style={{
              fontFamily: 'var(--font-display)',
              fontSize: '32px',
              fontWeight: 700,
              letterSpacing: '-0.025em',
              marginBottom: '12px',
            }}
          >
            {t('notFoundTitle')}
          </h2>
          <p style={{ color: 'var(--muted)', fontSize: '14px', marginBottom: '28px' }}>
            {t('notFoundDesc')}
          </p>
          <Link
            href="/products"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              color: 'var(--accent)',
              fontSize: '14px',
              fontWeight: 500,
              textDecoration: 'none',
              transition: 'gap 0.2s',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.gap = '12px'
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.gap = '8px'
            }}
          >
            {t('notFoundLink')} →
          </Link>
        </div>
      </div>
    )
  }

  /* ── Data ── */
  const title = isZh ? product.name : product.nameEn
  const description = isZh ? product.description : product.descriptionEn
  const categoryLabel = isZh ? product.category : product.categoryEn
  const statusVariant = product.status === 'published' ? ('published' as const) : ('draft' as const)
  const statusLabel = product.status === 'published' ? t('statusPublished') : t('statusDraft')

  const hasScreenshots = product.screenshots && product.screenshots.length > 0
  const autoPlay = hasScreenshots && product.screenshots.length > 1

  return (
    <>
      <style>{`
        .detail {
          max-width: 1200px;
          margin: 0 auto;
          padding: 56px 40px 80px;
        }
        .back-link {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          font-size: 14px;
          color: var(--muted);
          text-decoration: none;
          margin-bottom: 36px;
          transition: color 0.2s;
        }
        .back-link:hover {
          color: var(--accent);
        }
        .back-link:hover .back-arrow {
          transform: translateX(-4px);
        }
        .back-arrow {
          transition: transform 0.2s;
        }
        .detail-title {
          font-family: var(--font-display);
          font-size: 44px;
          font-weight: 700;
          letter-spacing: -0.03em;
          margin-bottom: 16px;
        }
        .detail-meta {
          display: flex;
          align-items: center;
          gap: 12px;
          margin-bottom: 32px;
        }
        .detail-desc {
          font-size: 16px;
          color: var(--muted);
          line-height: 1.75;
          margin-bottom: 48px;
        }
        .detail-section-title {
          font-family: var(--font-display);
          font-size: 28px;
          font-weight: 700;
          letter-spacing: -0.02em;
          margin-bottom: 24px;
        }
        .detail-section {
          margin-bottom: 56px;
        }
        .benefits-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 24px;
        }
        .video-container {
          position: relative;
          border-radius: 16px;
          overflow: hidden;
          background: var(--surface-tint);
          border: 1px solid var(--border);
        }
        .video-container iframe,
        .video-container video {
          width: 100%;
          aspect-ratio: 16 / 9;
          border: none;
        }
        .video-placeholder {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          gap: 12px;
          padding: 80px 40px;
          color: var(--muted);
          font-size: 13px;
        }
        .no-data {
          color: var(--muted);
          font-size: 14px;
          font-style: italic;
        }

        @media (max-width: 1024px) {
          .benefits-grid {
            grid-template-columns: repeat(2, 1fr);
          }
        }
        @media (max-width: 640px) {
          .detail {
            padding: 32px 16px 64px;
          }
          .detail-title {
            font-size: 28px;
          }
          .benefits-grid {
            grid-template-columns: 1fr;
          }
        }
      `}</style>

      <div className="detail">
        {/* Back link */}
        <Reveal>
          <Link href="/products" className="back-link">
            <svg
              className="back-arrow"
              width="16"
              height="16"
              viewBox="0 0 16 16"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.6"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M7 4L3 8l4 4M3 8h10" />
            </svg>
            {t('back')}
          </Link>
        </Reveal>

        {/* Title + meta */}
        <Reveal delay={1}>
          <h1 className="detail-title">{title}</h1>
          <div className="detail-meta">
            <Chip active>{categoryLabel}</Chip>
            <Badge variant={statusVariant}>{statusLabel}</Badge>
          </div>
        </Reveal>

        {/* Description */}
        <Reveal delay={2}>
          <p className="detail-desc">{description}</p>
        </Reveal>

        {/* Pain Points */}
        {product.painPoints && (
          <Reveal delay={3}>
            <div className="detail-section">
              <h2 className="detail-section-title">{t('painPoints')}</h2>
              <p className="detail-desc" style={{ color: 'var(--muted)', fontSize: '16px', lineHeight: '1.75', whiteSpace: 'pre-line' }}>
                {isZh ? product.painPoints : product.painPointsEn || product.painPoints}
              </p>
            </div>
          </Reveal>
        )}

        {/* Solution */}
        {product.solution && (
          <Reveal delay={3}>
            <div className="detail-section">
              <h2 className="detail-section-title">{t('solution')}</h2>
              <p className="detail-desc" style={{ color: 'var(--muted)', fontSize: '16px', lineHeight: '1.75', whiteSpace: 'pre-line' }}>
                {isZh ? product.solution : product.solutionEn || product.solution}
              </p>
            </div>
          </Reveal>
        )}

        {/* CompareSection */}
        {(product.before || product.after) && (
          <Reveal delay={3}>
            <div className="detail-section">
              <h2 className="detail-section-title">{t('compareTitle')}</h2>
              <CompareSection
                before={product.before}
                beforeEn={product.beforeEn}
                after={product.after}
                afterEn={product.afterEn}
              />
            </div>
          </Reveal>
        )}

        {/* Benefits */}
        <Reveal delay={2}>
          <div className="detail-section">
            <h2 className="detail-section-title">{t('benefits')}</h2>
            {product.benefits && product.benefits.length > 0 ? (
              <div className="benefits-grid">
                {product.benefits.map((benefit, i) => (
                  <BenefitCard key={benefit.label} benefit={benefit} index={i} />
                ))}
              </div>
            ) : (
              <p className="no-data">{t('noBenefits')}</p>
            )}
          </div>
        </Reveal>

        {/* Screenshots — only show if uploaded */}
        {hasScreenshots && (
        <Reveal delay={3}>
          <div className="detail-section">
            <h2 className="detail-section-title">{t('screenshots')}</h2>
            <Carousel
              autoPlay={autoPlay}
              items={product.screenshots.map((src, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: '100%', padding: '20px' }}>
                  <img
                    src={src}
                    alt={`${t('screenshotLabel')} ${i + 1}`}
                    style={{
                      maxWidth: '100%',
                      maxHeight: '600px',
                      objectFit: 'contain',
                      borderRadius: '4px',
                    }}
                  />
                </div>
              ))}
            />
          </div>
        </Reveal>
        )}

        {/* Video — only show if uploaded */}
        {product.videoUrl && (
        <Reveal delay={4}>
          <div className="detail-section">
            <h2 className="detail-section-title">{t('video')}</h2>
            <div className="video-container">
              {/^https?:\/\//.test(product.videoUrl) ? (
                <iframe
                  src={product.videoUrl}
                  title={t('video')}
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              ) : (
                <video
                  src={product.videoUrl}
                  controls
                  style={{ width: '100%', aspectRatio: '16/9', objectFit: 'contain', background: '#000' }}
                />
              )}
            </div>
          </div>
        </Reveal>
        )}

      </div>
    </>
  )
}
