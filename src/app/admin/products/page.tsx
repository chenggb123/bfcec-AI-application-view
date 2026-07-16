'use client'
import { useEffect, useState } from 'react'
import { PageHeader } from '@/components/layout/PageHeader'
import { Button } from '@/components/ui/Button'
import { ProductTable } from '@/components/admin/ProductTable'
import { ProductEditor } from '@/components/admin/ProductEditor'
import { Product } from '@/types'

export default function AdminProductsPage() {
  const [products, setProducts] = useState<Product[]>([])
  const [categories, setCategories] = useState<string[]>([])
  const [scenarios, setScenarios] = useState<{zh:string;en:string}[]>([])
  const [editingProduct, setEditingProduct] = useState<Product | null>(null)
  const [showEditor, setShowEditor] = useState(false)

  async function loadData() {
    try {
      const [pRes, cRes, sRes] = await Promise.all([fetch('/api/products'), fetch('/api/categories'), fetch('/api/scenarios')])
      if (!pRes.ok || !cRes.ok || !sRes.ok) throw new Error('API error')
      const prods = await pRes.json()
      const cats = await cRes.json()
      const scens = await sRes.json()
      const sorted = Array.isArray(prods) ? [...prods].sort((a, b) => {
        if (a.status === b.status) return 0
        return a.status === 'published' ? -1 : 1
      }) : []
      setProducts(sorted)
      // Extract Chinese names for the editor dropdown
      setCategories(Array.isArray(cats) ? cats.map((c: any) => c.zh || c) : [])
      setScenarios(Array.isArray(scens) ? scens : [])
    } catch (err) {
      console.error('Failed to load data:', err)
    }
  }

  useEffect(() => { loadData() }, [])

  function handleEdit(id: string) {
    const p = products.find(x => x.id === id) || null
    setEditingProduct(p)
    setShowEditor(true)
  }

  function handleNew() {
    setEditingProduct(null)
    setShowEditor(true)
  }

  async function handleToggleStatus(id: string) {
    const p = products.find(x => x.id === id)
    if (!p) return
    const updated = { ...p, status: p.status === 'published' ? 'draft' as const : 'published' as const }
    await fetch(`/api/products/${id}`, { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(updated) })
    loadData()
  }

  async function handleDelete(id: string) {
    if (!confirm('确定删除该产品？')) return
    await fetch(`/api/products/${id}`, { method: 'DELETE' })
    loadData()
  }

  async function handleSave(product: Product) {
    if (editingProduct) {
      await fetch(`/api/products/${product.id}`, { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(product) })
    } else {
      await fetch('/api/products', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(product) })
    }
    setShowEditor(false)
    loadData()
  }

  return (
    <>
      <PageHeader title="产品管理" description={`共 ${products.length} 个产品`}>
        <Button variant="primary" leftIcon={<span>+</span>} onClick={handleNew}>新增产品</Button>
      </PageHeader>
      <ProductTable products={products} onEdit={handleEdit} onToggleStatus={handleToggleStatus} onDelete={handleDelete} />
      {showEditor && (
        <ProductEditor product={editingProduct} categories={categories} scenarios={scenarios} onSave={handleSave} onClose={() => setShowEditor(false)} />
      )}
    </>
  )
}
