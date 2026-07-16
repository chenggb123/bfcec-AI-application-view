'use client'

import { useState, useMemo } from 'react'
import { SearchBox } from '@/components/ui/SearchBox'
import { Chip } from '@/components/ui/Chip'
import { useI18n } from '@/lib/i18n'
import type { Product } from '@/types'

interface ProductToolbarProps {
  products: Product[]
  categories: { zh: string; en: string }[]
  onFilter: (filtered: Product[]) => void
}

export function ProductToolbar({ products, categories, onFilter }: ProductToolbarProps) {
  const { t, isZh } = useI18n()
  const [activeZh, setActiveZh] = useState<string>('')
  const [searchQuery, setSearchQuery] = useState('')

  const apply = (zh: string, q: string) => {
    let filtered = products

    if (zh) {
      filtered = filtered.filter((p) => p.category === zh)
    }

    if (q.trim()) {
      const lower = q.toLowerCase()
      filtered = filtered.filter((p) => {
        const name = isZh ? p.name : p.nameEn
        const excerpt = isZh ? p.excerpt : p.excerptEn
        return name.toLowerCase().includes(lower) || excerpt.toLowerCase().includes(lower)
      })
    }

    onFilter(filtered)
  }

  const handleCategory = (zh: string) => {
    setActiveZh(zh)
    apply(zh, searchQuery)
  }

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const q = e.target.value
    setSearchQuery(q)
    apply(activeZh, q)
  }

  const count = useMemo(() => {
    let c = products
    if (activeZh) c = c.filter((p) => p.category === activeZh)
    if (searchQuery.trim()) {
      const lower = searchQuery.toLowerCase()
      c = c.filter((p) => {
        const name = isZh ? p.name : p.nameEn
        const excerpt = isZh ? p.excerpt : p.excerptEn
        return name.toLowerCase().includes(lower) || excerpt.toLowerCase().includes(lower)
      })
    }
    return c.length
  }, [products, activeZh, searchQuery, isZh])

  return (
    <div className="flex items-center gap-[16px] flex-wrap" style={{ marginBottom: '24px' }}>
      <SearchBox
        placeholder={t('searchPlaceholder')}
        value={searchQuery}
        onChange={handleSearch}
        className="flex-1 min-w-[240px] max-w-[400px]"
      />

      <Chip active={activeZh === ''} onClick={() => handleCategory('')}>
        {t('allFilter')}
      </Chip>

      {categories.map(({ zh, en }) => (
        <Chip key={zh} active={activeZh === zh} onClick={() => handleCategory(zh)}>
          {isZh ? zh : en}
        </Chip>
      ))}

      <span className="font-mono text-[13px] tracking-[0.04em] ml-auto whitespace-nowrap" style={{ color: 'var(--muted)' }}>
        {count} / {products.length}
      </span>
    </div>
  )
}
