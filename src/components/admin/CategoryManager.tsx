'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/Button'
import { useI18n } from '@/lib/i18n'

export interface CategoryPair {
  zh: string
  en: string
}

interface CategoryManagerProps {
  categories: CategoryPair[]
  onAdd: (zh: string, en: string) => void
  onUpdate: (oldZh: string, zh: string, en: string) => void
  onDelete: (zh: string) => void
}

export function CategoryManager({ categories, onAdd, onUpdate, onDelete }: CategoryManagerProps) {
  const { isZh } = useI18n()
  const [newZh, setNewZh] = useState('')
  const [newEn, setNewEn] = useState('')
  const [editTarget, setEditTarget] = useState<string | null>(null)
  const [editZh, setEditZh] = useState('')
  const [editEn, setEditEn] = useState('')
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null)

  const handleAdd = () => {
    const trimmed = newZh.trim()
    if (!trimmed) return
    onAdd(trimmed, newEn.trim() || trimmed)
    setNewZh('')
    setNewEn('')
  }

  const startEdit = (cat: CategoryPair) => {
    setEditTarget(cat.zh)
    setEditZh(cat.zh)
    setEditEn(cat.en)
  }

  const confirmEdit = () => {
    if (!editTarget) return
    const editedZh = editZh.trim()
    const editedEn = editEn.trim()
    if (!editedZh) return
    const original = categories.find(c => c.zh === editTarget)
    if (editedZh !== editTarget || editedEn !== (original?.en || '')) {
      onUpdate(editTarget, editedZh, editedEn || editedZh)
    }
    setEditTarget(null)
    setEditZh('')
    setEditEn('')
  }

  const cancelEdit = () => {
    setEditTarget(null)
    setEditZh('')
    setEditEn('')
  }

  const handleDelete = (zh: string) => {
    if (deleteConfirm === zh) {
      onDelete(zh)
      setDeleteConfirm(null)
    } else {
      setDeleteConfirm(zh)
      setTimeout(() => setDeleteConfirm(null), 3000)
    }
  }

  return (
    <div style={{ maxWidth: '600px' }}>
      {/* Category table */}
      <div
        style={{
          background: 'var(--surface)',
          border: '1px solid var(--border)',
          borderRadius: '8px',
          overflow: 'hidden',
          marginBottom: '16px',
        }}
      >
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr>
              <th style={thStyle} >
                {isZh ? '中文名称' : 'Chinese'}
              </th>
              <th style={thStyle} >
                {isZh ? '英文名称' : 'English'}
              </th>
              <th style={{ ...thStyle, textAlign: 'right', width: '160px' }}>
                {isZh ? '操作' : 'Actions'}
              </th>
            </tr>
          </thead>
          <tbody>
            {categories.map((cat, idx) => {
              const isLast = idx === categories.length - 1
              const isConfirming = deleteConfirm === cat.zh

              return (
                <tr key={cat.zh}>
                  <td style={{ ...tdStyle, borderBottom: isLast ? 'none' : '1px solid var(--border)' }}>
                    {editTarget === cat.zh ? (
                      <input type="text" value={editZh} onChange={(e) => setEditZh(e.target.value)}
                        onKeyDown={(e) => { if (e.key === 'Enter') confirmEdit(); if (e.key === 'Escape') cancelEdit() }}
                        autoFocus style={inputStyle} />
                    ) : (
                      <span className="font-semibold">{cat.zh}</span>
                    )}
                  </td>
                  <td style={{ ...tdStyle, borderBottom: isLast ? 'none' : '1px solid var(--border)' }}>
                    {editTarget === cat.zh ? (
                      <input type="text" value={editEn} onChange={(e) => setEditEn(e.target.value)}
                        onKeyDown={(e) => { if (e.key === 'Enter') confirmEdit(); if (e.key === 'Escape') cancelEdit() }}
                        style={inputStyle} />
                    ) : (
                      <span style={{ color: 'var(--muted)' }}>{cat.en}</span>
                    )}
                  </td>
                  <td style={{ ...tdStyle, textAlign: 'right', borderBottom: isLast ? 'none' : '1px solid var(--border)' }}>
                    {editTarget === cat.zh ? (
                      <div className="flex gap-[6px] justify-end">
                        <Button variant="success" size="sm" onClick={confirmEdit}>{isZh ? '确认' : 'OK'}</Button>
                        <Button variant="ghost" size="sm" onClick={cancelEdit}>{isZh ? '取消' : 'Cancel'}</Button>
                      </div>
                    ) : (
                      <div className="flex gap-[6px] justify-end">
                        <Button variant="ghost" size="sm" onClick={() => startEdit(cat)}>{isZh ? '编辑' : 'Edit'}</Button>
                        <Button variant="danger" size="sm" onClick={() => handleDelete(cat.zh)}>
                          {isConfirming ? (isZh ? '确认删除?' : 'Confirm?') : (isZh ? '删除' : 'Delete')}
                        </Button>
                      </div>
                    )}
                  </td>
                </tr>
              )
            })}

            {categories.length === 0 && (
              <tr>
                <td colSpan={3} className="text-center py-8" style={{ color: 'var(--muted)', fontSize: '13px' }}>
                  {isZh ? '暂无分类' : 'No categories'}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Add new category */}
      <div className="flex items-center gap-[10px]">
        <input type="text" placeholder={isZh ? '中文名称' : 'Chinese name'} value={newZh}
          onChange={(e) => setNewZh(e.target.value)}
          onKeyDown={(e) => { if (e.key === 'Enter') handleAdd() }}
          style={addInputStyle}
          onFocus={(e) => (e.target.style.borderColor = 'var(--accent)')}
          onBlur={(e) => (e.target.style.borderColor = 'var(--border)')} />
        <input type="text" placeholder={isZh ? '英文名称' : 'English name'} value={newEn}
          onChange={(e) => setNewEn(e.target.value)}
          onKeyDown={(e) => { if (e.key === 'Enter') handleAdd() }}
          style={addInputStyle}
          onFocus={(e) => (e.target.style.borderColor = 'var(--accent)')}
          onBlur={(e) => (e.target.style.borderColor = 'var(--border)')} />
        <Button variant="primary" onClick={handleAdd}>
          {isZh ? '添加' : 'Add'}
        </Button>
      </div>
    </div>
  )
}

const thStyle: React.CSSProperties = {
  padding: '12px 16px', textAlign: 'left', fontSize: '12px', fontWeight: 600,
  color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: '0.06em',
  borderBottom: '1px solid var(--border)', background: 'var(--surface-tint)',
}

const tdStyle: React.CSSProperties = {
  padding: '12px 16px', fontSize: '13px', color: 'var(--fg)', verticalAlign: 'middle',
}

const inputStyle: React.CSSProperties = {
  background: 'var(--bg)', border: '1px solid var(--accent)', borderRadius: '6px',
  color: 'var(--fg)', fontSize: '13px', padding: '6px 10px', outline: 'none', width: '100%',
}

const addInputStyle: React.CSSProperties = {
  flex: 1, background: 'var(--bg)', border: '1px solid var(--border)',
  borderRadius: '6px', color: 'var(--fg)', fontSize: '13px', padding: '8px 12px', outline: 'none',
}
