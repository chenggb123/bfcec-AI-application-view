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
    <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:gap-4 sm:flex-wrap" style={{ marginBottom: '24px' }}>
      {/* Search — full width on mobile */}
      <div className="w-full sm:flex-1 sm:min-w-[200px] sm:max-w-[400px]">
        <SearchBox
          placeholder={t('searchPlaceholder')}
          value={searchQuery}
          onChange={handleSearch}
          className="w-full"
        />
      </div>

      {/* Chips row: horizontal scroll on mobile */}
      <div className="flex items-center gap-2 flex-nowrap overflow-x-auto pb-1 sm:pb-0 sm:flex-wrap sm:overflow-visible"
        style={{ scrollbarWidth: 'none', WebkitOverflowScrolling: 'touch' }}>
        <Chip active={activeZh === ''} onClick={() => handleCategory('')}>
          {t('allFilter')}
        </Chip>

        {categories.map(({ zh, en }) => (
          <Chip key={zh} active={activeZh === zh} onClick={() => handleCategory(zh)}>
            {isZh ? zh : en}
          </Chip>
        ))}

        <span
          className="font-mono text-[13px] tracking-[0.04em] whitespace-nowrap ml-2 sm:ml-auto shrink-0"
          style={{ color: 'var(--muted)' }}
        >
          {count} / {products.length}
        </span>
      </div>
    </div>
  )
}
