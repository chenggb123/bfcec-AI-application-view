'use client'

import { useState, useMemo } from 'react'
import { Badge } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'
import { useI18n } from '@/lib/i18n'
import type { Product } from '@/types'

interface ProductTableProps {
  products: Product[]
  onEdit: (id: string) => void
  onToggleStatus: (id: string) => void
  onDelete: (id: string) => void
}

export function ProductTable({ products, onEdit, onToggleStatus, onDelete }: ProductTableProps) {
  const { t, isZh } = useI18n()
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [featuredFilter, setFeaturedFilter] = useState('all')
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null)

  const filtered = useMemo(() => {
    if (!products || !Array.isArray(products)) return []

    let result = products

    if (statusFilter !== 'all') {
      result = result.filter((p) => p.status === statusFilter)
    }

    if (featuredFilter !== 'all') {
      result = result.filter((p) => featuredFilter === 'yes' ? p.recommended : !p.recommended)
    }

    if (search.trim()) {
      const lower = search.toLowerCase()
      result = result.filter((p) => {
        const name = isZh ? p.name : p.nameEn
        const cat = isZh ? p.category : p.categoryEn
        return (
          name.toLowerCase().includes(lower) ||
          cat.toLowerCase().includes(lower)
        )
      })
    }

    return result
  }, [products, search, statusFilter, featuredFilter, isZh])

  const handleDelete = (id: string) => {
    if (deleteConfirm === id) {
      onDelete(id)
      setDeleteConfirm(null)
    } else {
      setDeleteConfirm(id)
      // Auto-clear confirm after 3s
      setTimeout(() => setDeleteConfirm(null), 3000)
    }
  }

  return (
    <div
      style={{
        background: 'var(--surface)',
        border: '1px solid var(--border)',
        borderRadius: '8px',
        overflow: 'hidden',
      }}
    >
      {/* Toolbar */}
      <div
        className="flex items-center gap-[12px]"
        style={{
          padding: '16px 20px',
          borderBottom: '1px solid var(--border)',
        }}
      >
        <input
          type="text"
          placeholder={t('searchPlaceholder')}
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="flex-1 min-w-[180px] outline-none transition-colors duration-200"
          style={{
            padding: '8px 12px',
            background: 'var(--bg)',
            border: '1px solid var(--border)',
            borderRadius: '6px',
            color: 'var(--fg)',
            fontSize: '13px',
          }}
          onFocus={(e) => {
            e.currentTarget.style.borderColor = 'var(--accent)'
          }}
          onBlur={(e) => {
            e.currentTarget.style.borderColor = 'var(--border)'
          }}
        />

        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="outline-none transition-colors duration-200"
          style={{
            padding: '8px 12px',
            background: 'var(--bg)',
            border: '1px solid var(--border)',
            borderRadius: '6px',
            color: 'var(--fg)',
            fontSize: '13px',
          }}
        >
          <option value="all">{t('allFilter')}</option>
          <option value="published">{t('statusPublished')}</option>
          <option value="draft">{t('statusDraft')}</option>
        </select>

        <select
          value={featuredFilter}
          onChange={(e) => setFeaturedFilter(e.target.value)}
          className="outline-none transition-colors duration-200"
          style={{
            padding: '8px 12px',
            background: 'var(--bg)',
            border: '1px solid var(--border)',
            borderRadius: '6px',
            color: 'var(--fg)',
            fontSize: '13px',
          }}
        >
          <option value="all">{t('allFilter')}</option>
          <option value="yes">{t('featuredFilter')}</option>
          <option value="no">{isZh ? '非推荐' : 'Not Featured'}</option>
        </select>

        <span
          className="font-mono whitespace-nowrap"
          style={{ fontSize: '12px', color: 'var(--muted)' }}
        >
          {filtered.length} / {(products && products.length) || 0}
        </span>
      </div>

      {/* Table */}
      <div style={{ overflowX: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr>
              <th
                style={{
                  padding: '12px 20px',
                  textAlign: 'left',
                  fontSize: '12px',
                  fontWeight: 600,
                  color: 'var(--muted)',
                  textTransform: 'uppercase',
                  letterSpacing: '0.06em',
                  background: 'var(--surface-tint)',
                  borderBottom: '1px solid var(--border)',
                }}
              >
                {t('screenshotLabel')}
              </th>
              <th
                style={{
                  padding: '12px 20px',
                  textAlign: 'left',
                  fontSize: '12px',
                  fontWeight: 600,
                  color: 'var(--muted)',
                  textTransform: 'uppercase',
                  letterSpacing: '0.06em',
                  background: 'var(--surface-tint)',
                  borderBottom: '1px solid var(--border)',
                }}
              >
                {isZh ? '名称' : 'Name'}
              </th>
              <th
                style={{
                  padding: '12px 20px',
                  textAlign: 'left',
                  fontSize: '12px',
                  fontWeight: 600,
                  color: 'var(--muted)',
                  textTransform: 'uppercase',
                  letterSpacing: '0.06em',
                  background: 'var(--surface-tint)',
                  borderBottom: '1px solid var(--border)',
                }}
              >
                {isZh ? '分类' : 'Category'}
              </th>
              <th
                style={{
                  padding: '12px 20px',
                  textAlign: 'left',
                  fontSize: '12px',
                  fontWeight: 600,
                  color: 'var(--muted)',
                  textTransform: 'uppercase',
                  letterSpacing: '0.06em',
                  background: 'var(--surface-tint)',
                  borderBottom: '1px solid var(--border)',
                }}
              >
                {isZh ? '状态' : 'Status'}
              </th>
              <th
                style={{
                  padding: '12px 20px',
                  textAlign: 'left',
                  fontSize: '12px',
                  fontWeight: 600,
                  color: 'var(--muted)',
                  textTransform: 'uppercase',
                  letterSpacing: '0.06em',
                  background: 'var(--surface-tint)',
                  borderBottom: '1px solid var(--border)',
                }}
              >
                {isZh ? '推荐' : 'Featured'}
              </th>
              <th
                style={{
                  padding: '12px 20px',
                  textAlign: 'left',
                  fontSize: '12px',
                  fontWeight: 600,
                  color: 'var(--muted)',
                  textTransform: 'uppercase',
                  letterSpacing: '0.06em',
                  background: 'var(--surface-tint)',
                  borderBottom: '1px solid var(--border)',
                }}
              >
                {t('screenshots')}
              </th>
              <th
                style={{
                  padding: '12px 20px',
                  textAlign: 'left',
                  fontSize: '12px',
                  fontWeight: 600,
                  color: 'var(--muted)',
                  textTransform: 'uppercase',
                  letterSpacing: '0.06em',
                  background: 'var(--surface-tint)',
                  borderBottom: '1px solid var(--border)',
                }}
              >
                {isZh ? '操作' : 'Actions'}
              </th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((product, idx) => {
              const isLast = idx === filtered.length - 1
              const name = isZh ? product.name : product.nameEn
              const nameEn = isZh ? product.nameEn : product.name
              const cat = isZh ? product.category : product.categoryEn
              const statusVariant =
                product.status === 'published'
                  ? ('published' as const)
                  : ('draft' as const)
              const statusLabel =
                product.status === 'published'
                  ? t('statusPublished')
                  : t('statusDraft')
              const isConfirming = deleteConfirm === product.id

              return (
                <tr
                  key={product.id}
                  className="group"
                  onMouseEnter={(e) => {
                    const cells = e.currentTarget.querySelectorAll('td')
                    cells.forEach(
                      (td) =>
                        ((td as HTMLElement).style.background =
                          'var(--surface-tint)')
                    )
                  }}
                  onMouseLeave={(e) => {
                    const cells = e.currentTarget.querySelectorAll('td')
                    cells.forEach(
                      (td) =>
                        ((td as HTMLElement).style.background = '')
                    )
                  }}
                >
                  {/* Thumb */}
                  <td
                    style={{
                      padding: '12px 20px',
                      fontSize: '13px',
                      color: 'var(--fg)',
                      verticalAlign: 'middle',
                      borderBottom: isLast
                        ? 'none'
                        : '1px solid var(--border)',
                    }}
                  >
                    {product.thumb ? (
                      <img
                        src={product.thumb}
                        alt={name}
                        className="rounded object-cover"
                        style={{
                          width: '48px',
                          height: '30px',
                          background: 'var(--bg)',
                          border: '1px solid var(--border)',
                        }}
                        onError={(e) => {
                          // Replace broken thumb with empty placeholder
                          const target = e.currentTarget
                          target.style.display = 'none'
                          const placeholder = target.nextElementSibling as HTMLElement | null
                          if (placeholder && placeholder.classList.contains('thumb-fallback')) {
                            placeholder.style.display = 'block'
                          }
                        }}
                      />
                    ) : null}
                    {product.thumb ? (
                      <div
                        className="thumb-fallback rounded"
                        style={{
                          display: 'none',
                          width: '48px',
                          height: '30px',
                          background: 'var(--bg)',
                          border: '1px solid var(--border)',
                        }}
                      />
                    ) : null}
                    {!product.thumb ? (
                      <div
                        className="rounded"
                        style={{
                          width: '48px',
                          height: '30px',
                          background: 'var(--bg)',
                          border: '1px solid var(--border)',
                        }}
                      />
                    ) : null}
                  </td>

                  {/* Name */}
                  <td
                    style={{
                      padding: '12px 20px',
                      fontSize: '13px',
                      color: 'var(--fg)',
                      verticalAlign: 'middle',
                      borderBottom: isLast
                        ? 'none'
                        : '1px solid var(--border)',
                    }}
                  >
                    <span className="font-semibold">{name}</span>
                    {nameEn && nameEn !== name && (
                      <br />
                    )}
                    {nameEn && nameEn !== name && (
                      <span style={{ fontSize: '12px', color: 'var(--muted)' }}>
                        {nameEn}
                      </span>
                    )}
                  </td>

                  {/* Category */}
                  <td
                    style={{
                      padding: '12px 20px',
                      fontSize: '13px',
                      color: 'var(--fg)',
                      verticalAlign: 'middle',
                      borderBottom: isLast
                        ? 'none'
                        : '1px solid var(--border)',
                    }}
                  >
                    {cat}
                  </td>

                  {/* Status */}
                  <td
                    style={{
                      padding: '12px 20px',
                      fontSize: '13px',
                      color: 'var(--fg)',
                      verticalAlign: 'middle',
                      borderBottom: isLast
                        ? 'none'
                        : '1px solid var(--border)',
                    }}
                  >
                    <Badge variant={statusVariant}>{statusLabel}</Badge>
                  </td>

                  {/* Featured */}
                  <td
                    style={{
                      padding: '12px 20px',
                      fontSize: '13px',
                      verticalAlign: 'middle',
                      borderBottom: isLast
                        ? 'none'
                        : '1px solid var(--border)',
                    }}
                  >
                    {product.recommended ? (
                      <span
                        style={{
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '4px',
                          padding: '3px 10px',
                          borderRadius: '999px',
                          fontSize: '11px',
                          fontWeight: 600,
                          letterSpacing: '0.04em',
                          background: 'rgba(218,41,28,0.12)',
                          color: 'var(--accent)',
                          border: '1px solid rgba(218,41,28,0.25)',
                        }}
                      >
                        ★ {t('featuredLabel')}
                      </span>
                    ) : (
                      <span style={{ color: 'var(--muted)', fontSize: '12px' }}>—</span>
                    )}
                  </td>

                  {/* Screenshots count */}
                  <td
                    className="font-mono"
                    style={{
                      padding: '12px 20px',
                      fontSize: '12px',
                      color: 'var(--fg)',
                      verticalAlign: 'middle',
                      borderBottom: isLast
                        ? 'none'
                        : '1px solid var(--border)',
                    }}
                  >
                    {(product.screenshots && product.screenshots.length) || 0}
                  </td>

                  {/* Actions */}
                  <td
                    style={{
                      padding: '12px 20px',
                      fontSize: '13px',
                      color: 'var(--fg)',
                      verticalAlign: 'middle',
                      borderBottom: isLast
                        ? 'none'
                        : '1px solid var(--border)',
                    }}
                  >
                    <div className="flex gap-[6px]">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => onEdit(product.id)}
                      >
                        {isZh ? '编辑' : 'Edit'}
                      </Button>
                      <Button
                        variant={
                          product.status === 'published'
                            ? 'ghost'
                            : 'success'
                        }
                        size="sm"
                        onClick={() => onToggleStatus(product.id)}
                      >
                        {product.status === 'published'
                          ? isZh
                            ? '下架'
                            : 'Unpublish'
                          : isZh
                            ? '发布'
                            : 'Publish'}
                      </Button>
                      <Button
                        variant="danger"
                        size="sm"
                        onClick={() => handleDelete(product.id)}
                      >
                        {isConfirming
                          ? isZh
                            ? '确认删除?'
                            : 'Confirm?'
                          : isZh
                            ? '删除'
                            : 'Delete'}
                      </Button>
                    </div>
                  </td>
                </tr>
              )
            })}

            {filtered.length === 0 && (
              <tr>
                <td
                  colSpan={7}
                  className="text-center py-12"
                  style={{ color: 'var(--muted)', fontSize: '13px' }}
                >
                  {t('emptyTitle')}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}
