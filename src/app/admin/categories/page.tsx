'use client'
import { useEffect, useState } from 'react'
import { PageHeader } from '@/components/layout/PageHeader'
import { CategoryManager, type CategoryPair } from '@/components/admin/CategoryManager'

export default function AdminCategoriesPage() {
  const [categories, setCategories] = useState<CategoryPair[]>([])

  async function loadData() {
    const res = await fetch('/api/categories')
    const data = await res.json()
    setCategories(Array.isArray(data) ? data : [])
  }

  useEffect(() => { loadData() }, [])

  async function handleAdd(zh: string, en: string) {
    await fetch('/api/categories', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ zh, en }),
    })
    loadData()
  }

  async function handleUpdate(oldZh: string, zh: string, en: string) {
    await fetch(`/api/categories?old=${encodeURIComponent(oldZh)}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ zh, en }),
    })
    loadData()
  }

  async function handleDelete(zh: string) {
    await fetch(`/api/categories?zh=${encodeURIComponent(zh)}`, { method: 'DELETE' })
    loadData()
  }

  return (
    <>
      <PageHeader title="分类管理" description={`共 ${categories.length} 个分类`} />
      <CategoryManager categories={categories} onAdd={handleAdd} onUpdate={handleUpdate} onDelete={handleDelete} />
    </>
  )
}
