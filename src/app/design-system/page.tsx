'use client'
import { useState } from 'react'
import { Button } from '@/components/ui/Button'
import { Card } from '@/components/ui/Card'
import { Input } from '@/components/ui/Input'
import { Badge } from '@/components/ui/Badge'
import { Chip } from '@/components/ui/Chip'
import { Modal } from '@/components/ui/Modal'
import { Tabs } from '@/components/ui/Tabs'
import { Carousel } from '@/components/ui/Carousel'

// Dev-only guard
const isDev = process.env.NODE_ENV === 'development'

export default function DesignSystemPage() {
  const [modalOpen, setModalOpen] = useState(false)
  const [activeTab, setActiveTab] = useState('tab1')
  const [chipActive, setChipActive] = useState(false)

  if (!isDev) {
    return <div style={{ padding: 100, textAlign: 'center', color: '#8a8a8a' }}>
      <h1 style={{ fontSize: 24, fontWeight: 700, color: '#e8e8e8', marginBottom: 8 }}>设计系统预览</h1>
      <p>仅在开发环境可用 (NODE_ENV=development)</p>
    </div>
  }

  const sectionStyle: React.CSSProperties = {
    maxWidth: 1200, margin: '0 auto', padding: '60px 40px'
  }
  const sectionTitle: React.CSSProperties = {
    fontFamily: 'var(--font-display)', fontSize: 28, fontWeight: 700, color: '#e8e8e8', marginBottom: 24,
    borderBottom: '1px solid rgba(255,255,255,0.07)', paddingBottom: 12
  }
  const subTitle: React.CSSProperties = {
    fontSize: 16, color: '#8a8a8a', marginBottom: 20
  }

  // Color swatches
  const colors = [
    { name: 'brand-red', hex: '#DA291C' },
    { name: 'brand-red-hover', hex: '#EC001A' },
    { name: 'brand-crimson', hex: '#B60005' },
    { name: 'brand-dark-blue', hex: '#005587' },
    { name: 'brand-light-blue', hex: '#0085AD' },
    { name: 'brand-green-yellow', hex: '#808C24' },
    { name: 'brand-dark-green', hex: '#006C5B' },
    { name: 'surface-bg', hex: '#0a0a0a' },
    { name: 'surface', hex: '#141414' },
    { name: 'text-primary', hex: '#e8e8e8' },
    { name: 'text-muted', hex: '#8a8a8a' },
  ]

  const carouselSlides = [
    <div key="1" style={{ height: 300, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'linear-gradient(135deg, rgba(218,41,28,0.2), rgba(0,85,135,0.2))', color: '#8a8a8a', fontFamily: 'var(--font-mono)', fontSize: 14 }}>Slide 1 — Carousel Demo</div>,
    <div key="2" style={{ height: 300, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'linear-gradient(135deg, rgba(0,133,173,0.2), rgba(128,140,36,0.2))', color: '#8a8a8a', fontFamily: 'var(--font-mono)', fontSize: 14 }}>Slide 2 — Auto-advancing</div>,
    <div key="3" style={{ height: 300, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'linear-gradient(135deg, rgba(0,108,91,0.2), rgba(218,41,28,0.2))', color: '#8a8a8a', fontFamily: 'var(--font-mono)', fontSize: 14 }}>Slide 3 — With dot indicators</div>,
  ]

  return (
    <div style={{ padding: '40px 0 80px' }}>
      <div style={{ textAlign: 'center', padding: '60px 40px 40px', maxWidth: 800, margin: '0 auto' }}>
        <span style={{ fontFamily: 'var(--font-mono)', fontSize: 11, fontWeight: 600, letterSpacing: '0.12em', textTransform: 'uppercase', color: '#DA291C' }}>Development Only</span>
        <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 44, fontWeight: 700, letterSpacing: '-0.03em', marginTop: 12 }}>设计系统预览</h1>
        <p style={{ color: '#8a8a8a', fontSize: 16, marginTop: 8 }}>Design System Preview — 验证组件复用效果与样式还原质量</p>
      </div>

      {/* Colors */}
      <section style={sectionStyle}>
        <h2 style={sectionTitle}>🎨 颜色 Colors</h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))', gap: 16 }}>
          {colors.map(c => (
            <div key={c.name} style={{ background: '#141414', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 10, padding: 20, textAlign: 'center' }}>
              <div style={{ width: '100%', height: 60, borderRadius: 8, background: c.hex, marginBottom: 12, border: c.hex === '#0a0a0a' ? '1px solid rgba(255,255,255,0.1)' : 'none' }} />
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: '#8a8a8a', marginBottom: 4 }}>{c.name}</div>
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: 13, color: '#e8e8e8', fontWeight: 600 }}>{c.hex}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Typography */}
      <section style={sectionStyle}>
        <h2 style={sectionTitle}>🔤 字体 Typography</h2>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
          <div>
            <p style={subTitle}>font-display (Headings)</p>
            <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 44, fontWeight: 700, letterSpacing: '-0.03em', margin: '8px 0' }}>H1 标题 Heading — 44px Bold</h1>
            <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 38, fontWeight: 700, letterSpacing: '-0.025em', margin: '8px 0' }}>H2 标题 Heading — 38px Bold</h2>
            <h3 style={{ fontFamily: 'var(--font-display)', fontSize: 22, fontWeight: 600, letterSpacing: '-0.015em', margin: '8px 0' }}>H3 标题 Heading — 22px Semibold</h3>
          </div>
          <div>
            <p style={subTitle}>font-body</p>
            <p style={{ fontFamily: 'var(--font-body)', fontSize: 16, color: '#8a8a8a', lineHeight: 1.6 }}>正文 body text — 16px, muted, line-height 1.6。这是示例正文内容。</p>
            <p style={{ fontFamily: 'var(--font-body)', fontSize: 14, color: '#8a8a8a', lineHeight: 1.55 }}>小号正文 small body — 14px, muted, line-height 1.55</p>
          </div>
          <div>
            <p style={subTitle}>font-mono</p>
            <p style={{ fontFamily: 'var(--font-mono)', fontSize: 12, letterSpacing: '0.06em', color: '#DA291C', textTransform: 'uppercase' }}>MONO LABEL — 12px, 0.06em tracking, uppercase</p>
            <p style={{ fontFamily: 'var(--font-mono)', fontSize: 52, fontWeight: 700, letterSpacing: '-0.04em' }}>98<span style={{ fontSize: 22, color: '#DA291C' }}>%</span></p>
          </div>
        </div>
      </section>

      {/* Buttons */}
      <section style={sectionStyle}>
        <h2 style={sectionTitle}>🔘 按钮 Buttons</h2>
        {['md', 'sm', 'lg'].map(size => (
          <div key={size} style={{ marginBottom: 16 }}>
            <p style={subTitle}>Size: {size}</p>
            <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', alignItems: 'center' }}>
              <Button variant="primary" size={size as any}>Primary</Button>
              <Button variant="ghost" size={size as any}>Ghost</Button>
              <Button variant="danger" size={size as any}>Danger</Button>
              <Button variant="success" size={size as any}>Success</Button>
              <Button variant="primary" size={size as any} leftIcon={<span>←</span>} rightIcon={<span>→</span>}>Icons</Button>
            </div>
          </div>
        ))}
      </section>

      {/* Cards */}
      <section style={sectionStyle}>
        <h2 style={sectionTitle}>🃏 卡片 Cards</h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 24 }}>
          <Card hover="none" padding="lg"><h3 style={{ fontFamily: 'var(--font-display)', fontSize: 18, fontWeight: 600 }}>Default Card</h3><p style={{ color: '#8a8a8a', fontSize: 14, marginTop: 8 }}>No hover effect</p></Card>
          <Card hover="lift" padding="lg"><h3 style={{ fontFamily: 'var(--font-display)', fontSize: 18, fontWeight: 600 }}>Lift Card</h3><p style={{ color: '#8a8a8a', fontSize: 14, marginTop: 8 }}>Hover to see lift</p></Card>
          <Card hover="glow" padding="lg"><h3 style={{ fontFamily: 'var(--font-display)', fontSize: 18, fontWeight: 600 }}>Glow Card</h3><p style={{ color: '#8a8a8a', fontSize: 14, marginTop: 8 }}>Move mouse to see glow</p></Card>
        </div>
      </section>

      {/* Inputs */}
      <section style={sectionStyle}>
        <h2 style={sectionTitle}>📝 输入框 Inputs</h2>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16, maxWidth: 400 }}>
          <Input placeholder="Default input..." />
          <Input placeholder="With error..." error />
          <Input placeholder="Search with icon..." leftIcon={<svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.6"><circle cx="7" cy="7" r="4.5"/><path d="M10.5 10.5L14 14"/></svg>} />
        </div>
      </section>

      {/* Badges */}
      <section style={sectionStyle}>
        <h2 style={sectionTitle}>🏷️ 标签 Badges</h2>
        <div style={{ display: 'flex', gap: 12 }}>
          <Badge variant="published">已发布</Badge>
          <Badge variant="draft">草稿</Badge>
        </div>
      </section>

      {/* Chips */}
      <section style={sectionStyle}>
        <h2 style={sectionTitle}>💊 筛选 Chips</h2>
        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
          <Chip active={chipActive} onClick={() => setChipActive(!chipActive)}>可点击 Chip ({chipActive ? 'active' : 'inactive'})</Chip>
          <Chip active>智能质量</Chip>
          <Chip>问答机器人</Chip>
          <Chip>智能工厂</Chip>
          <Chip>效率工具</Chip>
        </div>
      </section>

      {/* Modal */}
      <section style={sectionStyle}>
        <h2 style={sectionTitle}>🔲 弹窗 Modal</h2>
        <Button variant="primary" onClick={() => setModalOpen(true)}>打开弹窗</Button>
        <Modal open={modalOpen} onClose={() => setModalOpen(false)} title="演示弹窗">
          <p style={{ color: '#8a8a8a', lineHeight: 1.6 }}>这是一个演示弹窗。点击遮罩层或按 Escape 键关闭。</p>
          <div style={{ marginTop: 24, paddingTop: 20, borderTop: '1px solid rgba(255,255,255,0.07)', display: 'flex', gap: 10, justifyContent: 'flex-end' }}>
            <Button variant="ghost" onClick={() => setModalOpen(false)}>取消</Button>
            <Button variant="primary" onClick={() => setModalOpen(false)}>确认</Button>
          </div>
        </Modal>
      </section>

      {/* Tabs */}
      <section style={sectionStyle}>
        <h2 style={sectionTitle}>📑 标签页 Tabs</h2>
        <Tabs tabs={[{id: 'tab1', label: '基本信息'}, {id: 'tab2', label: '详细描述'}, {id: 'tab3', label: '媒体素材'}]} activeId={activeTab} onChange={setActiveTab} />
        <div style={{ padding: 20, background: 'rgba(255,255,255,0.02)', borderRadius: 10, border: '1px solid rgba(255,255,255,0.07)', marginTop: -1 }}>
          <p style={{ color: '#8a8a8a' }}>Active tab: {activeTab}</p>
        </div>
      </section>

      {/* Carousel */}
      <section style={sectionStyle}>
        <h2 style={sectionTitle}>🎠 轮播 Carousel</h2>
        <Carousel items={carouselSlides} autoPlay interval={3000} />
      </section>

      {/* Layout */}
      <section style={sectionStyle}>
        <h2 style={sectionTitle}>📐 布局间距 Spacing</h2>
        <div style={{ display: 'flex', gap: 24, flexWrap: 'wrap' }}>
          {['6px (sm)', '10px (md)', '16px (lg)', '24px', '32px', '40px', '80px', '96px'].map(s => (
            <div key={s} style={{ textAlign: 'center' }}>
              <div style={{ background: 'rgba(218,41,28,0.15)', border: '1px solid rgba(218,41,28,0.2)', borderRadius: 4, marginBottom: 8, width: parseInt(s), height: parseInt(s) }} />
              <span style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: '#8a8a8a' }}>{s}</span>
            </div>
          ))}
        </div>
      </section>
    </div>
  )
}
