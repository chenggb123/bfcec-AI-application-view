'use client'

import { useEffect, useState } from 'react'
import { PageHeader } from '@/components/layout/PageHeader'
import { Button } from '@/components/ui/Button'

interface Scenario { zh: string; en: string }

export default function AdminScenariosPage() {
  const [scenarios, setScenarios] = useState<Scenario[]>([])
  const [newZh, setNewZh] = useState('')
  const [newEn, setNewEn] = useState('')
  const [editing, setEditing] = useState<string | null>(null)
  const [editZh, setEditZh] = useState('')
  const [editEn, setEditEn] = useState('')

  async function load() {
    try {
      const res = await fetch('/api/scenarios')
      setScenarios(await res.json())
    } catch {}
  }

  useEffect(() => { load() }, [])

  async function handleAdd() {
    if (!newZh.trim()) return
    await fetch('/api/scenarios', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ zh: newZh.trim(), en: newEn.trim() || newZh.trim() }),
    })
    setNewZh(''); setNewEn(''); load()
  }

  async function handleUpdate(oldZh: string) {
    if (!editZh.trim()) return
    await fetch('/api/scenarios', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ oldZh, zh: editZh.trim(), en: editEn.trim() }),
    })
    setEditing(null); load()
  }

  async function handleDelete(zh: string) {
    if (!confirm(`确定删除「${zh}」？`)) return
    await fetch(`/api/scenarios?zh=${encodeURIComponent(zh)}`, { method: 'DELETE' })
    load()
  }

  const inputStyle: React.CSSProperties = {
    background: 'var(--bg)',
    border: '1px solid var(--border)',
    borderRadius: '6px',
    color: 'var(--fg)',
    fontSize: '13px',
    outline: 'none',
    padding: '8px 12px',
    width: '100%',
  }

  return (
    <>
      <PageHeader title="场景管理" description={`共 ${scenarios.length} 个场景`} />

      <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: '8px', overflow: 'hidden', maxWidth: '700px' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ borderBottom: '1px solid var(--border)' }}>
              <th style={{ padding: '12px 20px', textAlign: 'left', fontSize: '12px', fontWeight: 600, color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>场景名称</th>
              <th style={{ padding: '12px 20px', textAlign: 'left', fontSize: '12px', fontWeight: 600, color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>英文名称</th>
              <th style={{ padding: '12px 20px', textAlign: 'right', fontSize: '12px', fontWeight: 600, color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>操作</th>
            </tr>
          </thead>
          <tbody>
            {scenarios.map((s) => (
              <tr key={s.zh} style={{ borderBottom: '1px solid var(--border)' }}>
                {editing === s.zh ? (
                  <>
                    <td style={{ padding: '8px 20px' }}><input value={editZh} onChange={e => setEditZh(e.target.value)} style={inputStyle} /></td>
                    <td style={{ padding: '8px 20px' }}><input value={editEn} onChange={e => setEditEn(e.target.value)} style={inputStyle} /></td>
                    <td style={{ padding: '8px 20px', textAlign: 'right', display: 'flex', gap: '6px', justifyContent: 'flex-end' }}>
                      <Button variant="success" size="sm" onClick={() => handleUpdate(s.zh)}>保存</Button>
                      <Button variant="ghost" size="sm" onClick={() => setEditing(null)}>取消</Button>
                    </td>
                  </>
                ) : (
                  <>
                    <td style={{ padding: '12px 20px', fontSize: '13px', color: 'var(--fg)', fontWeight: 600 }}>{s.zh}</td>
                    <td style={{ padding: '12px 20px', fontSize: '13px', color: 'var(--muted)' }}>{s.en}</td>
                    <td style={{ padding: '12px 20px', textAlign: 'right', display: 'flex', gap: '6px', justifyContent: 'flex-end' }}>
                      <Button variant="ghost" size="sm" onClick={() => { setEditing(s.zh); setEditZh(s.zh); setEditEn(s.en) }}>编辑</Button>
                      <Button variant="danger" size="sm" onClick={() => handleDelete(s.zh)}>删除</Button>
                    </td>
                  </>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div style={{ marginTop: '16px', display: 'flex', gap: '8px', maxWidth: '700px' }}>
        <input
          value={newZh}
          onChange={e => setNewZh(e.target.value)}
          placeholder="场景名称（中文）"
          style={{ ...inputStyle, flex: 1 }}
          onKeyDown={e => { if (e.key === 'Enter') handleAdd() }}
        />
        <input
          value={newEn}
          onChange={e => setNewEn(e.target.value)}
          placeholder="场景名称（英文）"
          style={{ ...inputStyle, flex: 1 }}
          onKeyDown={e => { if (e.key === 'Enter') handleAdd() }}
        />
        <Button variant="primary" onClick={handleAdd}>添加</Button>
      </div>
    </>
  )
}
