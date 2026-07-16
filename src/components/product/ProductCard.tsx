import Link from 'next/link'
import { useI18n } from '@/lib/i18n'
import { Badge } from '@/components/ui/Badge'
import { Chip } from '@/components/ui/Chip'
import type { Product } from '@/types'

interface ProductCardProps {
  product: Product
  delay?: number
}

export function ProductCard({ product, delay = 0 }: ProductCardProps) {
  const { t, isZh } = useI18n()

  const statusVariant = product.status === 'published' ? ('published' as const) : ('draft' as const)
  const statusLabel = product.status === 'published' ? t('statusPublished') : t('statusDraft')
  const categoryLabel = isZh ? product.category : product.categoryEn
  const title = isZh ? product.name : product.nameEn
  const description = isZh ? product.excerpt : product.excerptEn

  return (
    <>
      {/* Inject keyframes once; scoped by component instance but harmless */}
      <style>{`
        @keyframes productCardBeam {
          0%   { background-position: 0% 0%; }
          100% { background-position: 300% 300%; }
        }
      `}</style>

      <Link
        href={`/products/${product.id}`}
        className="block"
        style={{
          textDecoration: 'none',
          color: 'inherit',
        }}
      >
        {/* Card container */}
        <div
          className="group relative block cursor-pointer overflow-hidden rounded-[16px] transition-all duration-300"
          style={{
            background: 'var(--surface-tint)',
            border: '1px solid var(--border)',
          }}
          onMouseEnter={(e) => {
            const el = e.currentTarget
            el.style.borderColor = 'var(--accent)'
            el.style.transform = 'translateY(-6px)'
            el.style.boxShadow =
              '0 20px 50px rgba(0,0,0,0.55), 0 0 30px rgba(218,41,28,0.12)'
          }}
          onMouseLeave={(e) => {
            const el = e.currentTarget
            el.style.borderColor = 'var(--border)'
            el.style.transform = ''
            el.style.boxShadow = ''
          }}
          onMouseDown={(e) => {
            const el = e.currentTarget
            el.style.transform = 'translateY(-2px) scale(0.985)'
            el.style.transition =
              'transform 0.1s ease-out, border-color 0.3s, box-shadow 0.3s'
          }}
          onMouseUp={(e) => {
            const el = e.currentTarget
            el.style.transform = 'translateY(-6px)'
            el.style.boxShadow =
              '0 20px 50px rgba(0,0,0,0.55), 0 0 30px rgba(218,41,28,0.12)'
            el.style.transition =
              'transform 0.2s, border-color 0.3s, box-shadow 0.3s'
          }}
        >
          {/* Border beam (::after equivalent) */}
          <div
            className="card-beam pointer-events-none absolute inset-[-1px] rounded-[16px] opacity-0"
            style={{
              background:
                'linear-gradient(135deg, transparent 30%, rgba(218,41,28,0.3) 50%, transparent 70%)',
              backgroundSize: '300% 300%',
              backgroundPosition: '0% 0%',
              zIndex: 0,
            }}
          />
          <style>{`
            .group:hover .card-beam {
              opacity: 1;
              animation: productCardBeam 2s linear infinite;
            }
          `}</style>

          {/* Content (z-index above beam) */}
          <div className="relative z-[1]">
            {/* Thumbnail area */}
            <div className="relative h-[190px] overflow-hidden">
              {/* Grid pattern (::before equivalent) */}
              <div
                className="absolute inset-0 z-10 pointer-events-none"
                style={{
                  backgroundImage:
                    'linear-gradient(var(--surface-tint) 1px, transparent 1px), linear-gradient(90deg, var(--surface-tint) 1px, transparent 1px)',
                  backgroundSize: '20px 20px',
                }}
              />

              {/* Image */}
              {product.thumb ? (
                <img
                  src={product.thumb}
                  alt={title}
                  className="absolute inset-0 w-full h-full object-cover transition-[filter] duration-400"
                  style={{
                    filter: 'brightness(0.6) saturate(0.8)',
                  }}
                />
              ) : (
                <div
                  className="absolute inset-0"
                  style={{
                    background:
                      'linear-gradient(135deg, rgba(218,41,28,0.15) 0%, rgba(0,0,0,0.3) 100%)',
                  }}
                />
              )}

              {/* Hover brighten image via group */}
              <style>{`
                .group:hover img {
                  filter: brightness(0.75) saturate(1) !important;
                }
              `}</style>

              {/* Dark gradient overlay (::after equivalent) */}
              <div
                className="absolute inset-0 z-[5] pointer-events-none"
                style={{
                  background:
                    'linear-gradient(180deg, transparent 50%, rgba(10,10,10,0.6) 100%)',
                }}
              />

              {/* Accent line at bottom */}
              <div
                className="absolute bottom-0 left-0 right-0 z-20"
                style={{
                  height: '2px',
                  background:
                    'linear-gradient(90deg, transparent 0%, var(--accent) 50%, transparent 100%)',
                }}
              />
            </div>

            {/* Card body */}
            <div style={{ padding: '22px' }}>
              {/* Top row: category chip + status badge */}
              <div className="flex items-center justify-between mb-[10px]">
                <Chip active>{categoryLabel}</Chip>
                <Badge variant={statusVariant}>{statusLabel}</Badge>
              </div>

              {/* Title */}
              <h3
                title={title}
                className="font-display text-[17px] font-semibold tracking-[-0.01em] mb-[8px] text-fg-primary overflow-hidden text-ellipsis whitespace-nowrap"
              >
                {title}
              </h3>

              {/* Description — clamp to 2 lines with ellipsis */}
              <p
                className="text-[13px] leading-[1.55] text-fg-muted"
                style={{
                  display: '-webkit-box',
                  WebkitLineClamp: 2,
                  WebkitBoxOrient: 'vertical',
                  overflow: 'hidden',
                }}
              >
                {description}
              </p>
            </div>
          </div>
        </div>
      </Link>
    </>
  )
}
