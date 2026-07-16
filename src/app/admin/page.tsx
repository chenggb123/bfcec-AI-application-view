'use client'
import { useEffect, useState } from 'react'
import { PageHeader } from '@/components/layout/PageHeader'
import { StatsGrid } from '@/components/admin/StatsGrid'
import { Product } from '@/types'

export default function AdminDashboardPage() {
  const [products, setProducts] = useState<Product[]>([])
  const [categories, setCategories] = useState<string[]>([])

  useEffect(() => {
    fetch('/api/products').then(r => r.json()).then(d => setProducts(Array.isArray(d) ? d : [])).catch(() => {})
    fetch('/api/categories').then(r => r.json()).then(d => setCategories(Array.isArray(d) ? d : [])).catch(() => {})
  }, [])

  const pub = products.filter(p => p.status === 'published').length
  const draft = products.filter(p => p.status !== 'published').length

  return (
    <>
      <PageHeader title="仪表盘" description="系统数据概览" />
      <StatsGrid items={[
        { value: String(products.length), label: '产品总数' },
        { value: String(pub), label: '已发布' },
        { value: String(draft), label: '草稿' },
        { value: String(categories.length), label: '产品分类' },
      ]} />

      <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 8, overflow: 'hidden', marginTop: 32 }}>
        <div style={{ padding: '16px 20px', borderBottom: '1px solid var(--border)', fontWeight: 600, fontSize: 14 }}>最近产品</div>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <tbody>
            {products.slice(0, 6).map(p => (
              <tr key={p.id} style={{ borderBottom: '1px solid var(--border)' }}>
                <td style={{ padding: '12px 20px', width: 56 }}>
                  {p.thumb ? <img src={p.thumb} style={{ width: 48, height: 30, borderRadius: 4, objectFit: 'cover', background: 'var(--surface-tint)', border: '1px solid var(--border)' }} /> :
                    <div style={{ width: 48, height: 30, borderRadius: 4, background: 'var(--surface-tint)', border: '1px solid var(--border)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 10, color: 'var(--muted)' }}>—</div>}
                </td>
                <td style={{ padding: '12px 20px' }}>
                  <strong>{p.name}</strong><br />
                  <span style={{ color: 'var(--muted)', fontSize: 11 }}>{p.nameEn || ''}</span>
                </td>
                <td style={{ padding: '12px 20px' }}>{p.category || '—'}</td>
                <td style={{ padding: '12px 20px' }}>
                  <span style={{
                    display: 'inline-block', padding: '2px 10px', borderRadius: 999, fontSize: 11, fontWeight: 600, letterSpacing: '0.04em',
                    color: p.status === 'published' ? '#22c55e' : '#f59e0b',
                    background: p.status === 'published' ? 'rgba(34,197,94,0.1)' : 'rgba(245,158,11,0.1)',
                    border: `1px solid ${p.status === 'published' ? 'rgba(34,197,94,0.2)' : 'rgba(245,158,11,0.2)'}`
                  }}>{p.status === 'published' ? '已发布' : '草稿'}</span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  )
}
