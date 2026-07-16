'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Sidebar } from '@/components/layout/Sidebar'

type AdminView = 'dashboard' | 'products' | 'categories' | 'scenarios'

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter()
  const [view, setView] = useState<AdminView>('dashboard')

  // Auth is enforced server-side by middleware (HttpOnly signed cookie).
  // If a request reaches here without a valid session, middleware has
  // already redirected to /login, so no client-side auth check is needed.

  function handleNavigate(v: AdminView) {
    setView(v)
    if (v === 'dashboard') router.push('/admin')
    else if (v === 'products') router.push('/admin/products')
    else if (v === 'categories') router.push('/admin/categories')
    else if (v === 'scenarios') router.push('/admin/scenarios')
  }

  return (
    <div className="admin-shell" style={{ display: 'flex', minHeight: '100vh', position: 'relative', zIndex: 1 }}>
      <Sidebar currentView={view} onNavigate={handleNavigate} />
      <main style={{ flex: 1, padding: 32, overflowY: 'auto', maxHeight: '100vh' }}>
        {children}
      </main>
    </div>
  )
}
