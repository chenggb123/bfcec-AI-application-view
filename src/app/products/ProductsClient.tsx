'use client'

import { useState, useCallback } from 'react'
import { useI18n } from '@/lib/i18n'
import { PageHeader } from '@/components/layout/PageHeader'
import { ProductToolbar } from '@/components/product/ProductToolbar'
import { ProductGrid } from '@/components/product/ProductGrid'
import type { Product } from '@/types'

interface ProductsClientProps {
  products: Product[]
  categories: { zh: string; en: string }[]
}

export default function ProductsClient({ products, categories }: ProductsClientProps) {
  const { t } = useI18n()
  const [filtered, setFiltered] = useState<Product[]>(products)

  const handleFilter = useCallback((f: Product[]) => {
    setFiltered(f)
  }, [])

  return (
    <>
      <PageHeader title={t('pageTitle')} description={t('pageDesc')} />

      <div
        style={{
          maxWidth: '1200px',
          margin: '0 auto',
          padding: '0 40px 80px',
        }}
        className="max-sm:px-4"
      >
        <ProductToolbar
          products={products}
          categories={categories}
          onFilter={handleFilter}
        />

        <ProductGrid products={filtered} />
      </div>
    </>
  )
}
