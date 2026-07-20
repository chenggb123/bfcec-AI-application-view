'use client'

import { useI18n } from '@/lib/i18n'
import { Reveal } from '@/components/ui/Reveal'
import { ProductCard } from '@/components/product/ProductCard'
import type { Product } from '@/types'

interface FeaturedProductsProps {
  products: Product[]
}

export function FeaturedProducts({ products }: FeaturedProductsProps) {
  const { t } = useI18n()

  return (
    <>
      <style>{`
        .feat-grid > * { min-width: 0; }
        @media (max-width: 1024px) {
          .feat-grid { grid-template-columns: 1fr !important; gap: 16px; }
        }
      `}</style>

      <section
        className="feat-section section relative z-[1] px-4 sm:px-8 lg:px-10 pt-16 sm:pt-20 pb-16 sm:pb-24 max-w-[1200px] mx-auto"
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
            {t('featLabel')}
          </span>
        </Reveal>
        <Reveal delay={2}>
          <h2
            className="font-display text-[26px] sm:text-[32px] lg:text-[38px] font-bold tracking-[-0.025em] leading-[1.18] mb-4"
          >
            {t('featTitle')}
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
            {t('featDesc')}
          </p>
        </Reveal>

        <div
          className="feat-grid"
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(3, 1fr)',
            gap: '24px',
          }}
        >
          {products.map((product, i) => (
            <Reveal key={product.id} delay={((i % 5) + 1) as 1 | 2 | 3 | 4 | 5}>
              <ProductCard product={product} delay={i} />
            </Reveal>
          ))}
        </div>
      </section>
    </>
  )
}
