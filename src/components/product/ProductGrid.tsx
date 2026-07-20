import { ProductCard } from './ProductCard'
import { Reveal } from '@/components/ui/Reveal'
import { useI18n } from '@/lib/i18n'
import type { Product } from '@/types'

interface ProductGridProps {
  products: Product[]
}

export function ProductGrid({ products }: ProductGridProps) {
  const { t } = useI18n()

  if (products.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-24 text-center">
        <svg
          width="48"
          height="48"
          viewBox="0 0 48 48"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
          style={{ opacity: 0.06 }}
        >
          <rect x="4" y="4" width="40" height="40" rx="8" />
          <line x1="16" y1="16" x2="32" y2="32" />
          <line x1="32" y1="16" x2="16" y2="32" />
        </svg>
        <h3 className="mt-6 text-lg font-semibold text-fg-primary font-display">
          {t('emptyTitle')}
        </h3>
        <p className="mt-2 text-[13px] text-fg-muted">{t('emptyDesc')}</p>
      </div>
    )
  }

  return (
    <>
      <style>{`
        .product-grid {
          display: grid;
          gap: 24px;
          grid-template-columns: repeat(3, 1fr);
        }
        .product-grid > * {
          min-width: 0;
        }
        @media (max-width: 1024px) {
          .product-grid {
            grid-template-columns: 1fr !important;
            gap: 16px;
          }
        }
      `}</style>
      <div className="product-grid">
        {products.map((product, i) => (
          <Reveal key={product.id} delay={((i % 5) + 1) as 1 | 2 | 3 | 4 | 5}>
            <ProductCard product={product} />
          </Reveal>
        ))}
      </div>
    </>
  )
}
