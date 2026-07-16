'use client'

import { useState, useRef, useEffect } from 'react'
import { Modal } from '@/components/ui/Modal'
import { Tabs } from '@/components/ui/Tabs'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { useI18n } from '@/lib/i18n'
import type { Product, Benefit } from '@/types'

interface Scenario { zh: string; en: string }

interface ProductEditorProps {
  product: Product | null
  categories: string[]
  scenarios: Scenario[]
  onSave: (product: Product) => void
  onClose: () => void
}

const emptyProduct: Product = {
  id: '',
  name: '',
  nameEn: '',
  excerpt: '',
  excerptEn: '',
  description: '',
  descriptionEn: '',
  category: '',
  categoryEn: '',
  scenario: '',
  scenarioEn: '',
  status: 'draft',
  recommended: false,
  screenshots: [],
  videoUrl: '',
  benefits: [],
  before: '',
  beforeEn: '',
  after: '',
  afterEn: '',
  painPoints: '',
  painPointsEn: '',
  solution: '',
  solutionEn: '',
  thumb: '',
}

const TABS = [
  { id: 'basic', label: '基本信息' },
  { id: 'detail', label: '详细描述' },
  { id: 'media', label: '媒体素材' },
  { id: 'benefits', label: '收益数据' },
  { id: 'compare', label: '对比信息' },
]

// Shared form field styles
const fieldLabelStyle: React.CSSProperties = {
  fontSize: '12px',
  fontWeight: 600,
  color: 'var(--muted)',
  textTransform: 'uppercase',
  letterSpacing: '0.04em',
  marginBottom: '4px',
}

const formInputStyle: React.CSSProperties = {
  background: 'var(--bg)',
  border: '1px solid var(--border)',
  borderRadius: '6px',
  color: 'var(--fg)',
  fontSize: '13px',
  outline: 'none',
  width: '100%',
}

function safe<T>(arr: T[] | undefined | null): T[] { return arr || [] }

export function ProductEditor({ product, categories, scenarios, onSave, onClose }: ProductEditorProps) {
  const { isZh } = useI18n()
  const [activeTab, setActiveTab] = useState('basic')
  const [form, setForm] = useState<Product>(
    product
      ? { ...product, benefits: product.benefits || [], screenshots: product.screenshots || [] }
      : { ...emptyProduct, id: `prod_${Date.now()}` }
  )

  useEffect(() => {
    if (product) {
      setForm({ ...product, benefits: product.benefits || [], screenshots: product.screenshots || [] })
    }
  }, [product])

  const update = (key: keyof Product, value: string | string[] | Benefit[] | boolean) => {
    setForm((prev) => ({ ...prev, [key]: value }))
  }

  const handleSave = () => {
    onSave(form)
  }

  const [uploading, setUploading] = useState(false)
  const thumbInputRef = useRef<HTMLInputElement>(null)
  const screenshotInputRef = useRef<HTMLInputElement>(null)

  // ── Media helpers ──
  const uploadFile = async (file: File, type: 'thumbnail' | 'screenshots' | 'video'): Promise<string> => {
    const formData = new FormData()
    formData.append('file', file)
    formData.append('type', type)
    const res = await fetch('/api/upload', { method: 'POST', body: formData })
    if (!res.ok) throw new Error('Upload failed')
    const data = await res.json()
    return data.url
  }

  const handleThumbUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    try {
      setUploading(true)
      const url = await uploadFile(file, 'thumbnail')
      update('thumb', url)
    } catch {
      alert('上传失败，请重试')
    } finally {
      setUploading(false)
      // Reset input so same file can be re-uploaded
      if (thumbInputRef.current) thumbInputRef.current.value = ''
    }
  }

  const removeThumb = () => {
    update('thumb', '')
  }

  const handleScreenshotUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    try {
      setUploading(true)
      const url = await uploadFile(file, 'screenshots')
      update('screenshots', [...form.screenshots, url])
    } catch {
      alert('上传失败，请重试')
    } finally {
      setUploading(false)
      // Reset input so same file can be re-uploaded
      if (screenshotInputRef.current) screenshotInputRef.current.value = ''
    }
  }

  const removeScreenshot = (idx: number) => {
    const next = form.screenshots.filter((_, i) => i !== idx)
    update('screenshots', next)
  }

  // ── Benefits helpers ──
  const addBenefit = () => {
    update('benefits', [
      ...form.benefits,
      { label: '', labelEn: '', value: 0, unit: '%', unitEn: '%' },
    ])
  }

  const updateBenefit = (idx: number, key: keyof Benefit, val: string | number) => {
    const next = [...form.benefits]
    next[idx] = { ...next[idx], [key]: key === 'value' ? Number(val) : val }
    update('benefits', next)
  }

  const removeBenefit = (idx: number) => {
    update('benefits', form.benefits.filter((_, i) => i !== idx))
  }

  const isNew = !product

  return (
    <Modal
      open={true}
      onClose={onClose}
      title={isNew ? (isZh ? '新建产品' : 'New Product') : (isZh ? '编辑产品' : 'Edit Product')}
    >
      <Tabs tabs={TABS} activeId={activeTab} onChange={setActiveTab} />

      {/* Tab 1: 基本信息 */}
      {activeTab === 'basic' && (
        <div
          className="grid gap-[16px]"
          style={{ gridTemplateColumns: 'repeat(2, 1fr)' }}
        >
          {/* name (zh) */}
          <div>
            <div style={fieldLabelStyle}>{isZh ? '产品名称' : 'Name (ZH)'}</div>
            <input
              type="text"
              value={form.name}
              onChange={(e) => update('name', e.target.value)}
              required
              style={{ ...formInputStyle, padding: '8px 12px' }}
              onFocus={(e) => (e.target.style.borderColor = 'var(--accent)')}
              onBlur={(e) =>
                (e.target.style.borderColor = 'var(--border)')
              }
            />
          </div>

          {/* nameEn */}
          <div>
            <div style={fieldLabelStyle}>{isZh ? '英文名称' : 'Name (EN)'}</div>
            <input
              type="text"
              value={form.nameEn}
              onChange={(e) => update('nameEn', e.target.value)}
              style={{ ...formInputStyle, padding: '8px 12px' }}
              onFocus={(e) => (e.target.style.borderColor = 'var(--accent)')}
              onBlur={(e) =>
                (e.target.style.borderColor = 'var(--border)')
              }
            />
          </div>

          {/* excerpt (zh) */}
          <div>
            <div style={fieldLabelStyle}>{isZh ? '摘要 (中文)' : 'Excerpt (ZH)'}</div>
            <textarea
              value={form.excerpt}
              onChange={(e) => update('excerpt', e.target.value)}
              rows={3}
              style={{
                ...formInputStyle,
                padding: '8px 12px',
                minHeight: '80px',
                resize: 'vertical',
              }}
              onFocus={(e) => (e.target.style.borderColor = 'var(--accent)')}
              onBlur={(e) =>
                (e.target.style.borderColor = 'var(--border)')
              }
            />
          </div>

          {/* excerptEn */}
          <div>
            <div style={fieldLabelStyle}>{isZh ? '摘要 (英文)' : 'Excerpt (EN)'}</div>
            <textarea
              value={form.excerptEn}
              onChange={(e) => update('excerptEn', e.target.value)}
              rows={3}
              style={{
                ...formInputStyle,
                padding: '8px 12px',
                minHeight: '80px',
                resize: 'vertical',
              }}
              onFocus={(e) => (e.target.style.borderColor = 'var(--accent)')}
              onBlur={(e) =>
                (e.target.style.borderColor = 'var(--border)')
              }
            />
          </div>

          {/* category */}
          <div>
            <div style={fieldLabelStyle}>{isZh ? '分类' : 'Category'}</div>
            <select
              value={form.category}
              onChange={(e) => {
                update('category', e.target.value)
                // Also set categoryEn if needed
                update('categoryEn', e.target.value)
              }}
              style={{ ...formInputStyle, padding: '8px 12px' }}
            >
              <option value="">{isZh ? '请选择分类' : 'Select category'}</option>
              {safe(categories).map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </div>

          {/* scenario */}
          <div>
            <div style={fieldLabelStyle}>{isZh ? '关联场景' : 'Scenario'}</div>
            <select
              value={form.scenario}
              onChange={(e) => {
                const sel = safe(scenarios).find((s: Scenario) => s.zh === e.target.value)
                update('scenario', e.target.value)
                update('scenarioEn', sel?.en || e.target.value)
              }}
              style={{ ...formInputStyle, padding: '8px 12px' }}
            >
              <option value="">{isZh ? '请选择场景' : 'Select scenario'}</option>
              {safe(scenarios).map((s: Scenario) => (
                <option key={s.zh} value={s.zh}>{s.zh}</option>
              ))}
            </select>
          </div>

          {/* status */}
          <div>
            <div style={fieldLabelStyle}>{isZh ? '状态' : 'Status'}</div>
            <select
              value={form.status}
              onChange={(e) =>
                update('status', e.target.value as 'draft' | 'published')
              }
              style={{ ...formInputStyle, padding: '8px 12px' }}
            >
              <option value="draft">{isZh ? '草稿' : 'Draft'}</option>
              <option value="published">{isZh ? '已发布' : 'Published'}</option>
            </select>
          </div>

          {/* recommended */}
          <div>
            <div style={fieldLabelStyle}>{isZh ? '首页推荐' : 'Featured'}</div>
            <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', padding: '8px 0' }}>
              <input
                type="checkbox"
                checked={form.recommended}
                onChange={(e) => update('recommended', e.target.checked)}
                style={{ accentColor: 'var(--accent)', width: '16px', height: '16px' }}
              />
              <span style={{ fontSize: '13px', color: 'var(--fg)' }}>
                {isZh ? '在首页精选区域展示' : 'Show in homepage featured section'}
              </span>
            </label>
          </div>

        </div>
      )}

      {/* Tab 2: 详细描述 */}
      {activeTab === 'detail' && (
        <div className="flex flex-col gap-[16px]">
          <div>
            <div style={fieldLabelStyle}>{isZh ? '详细描述 (中文)' : 'Description (ZH)'}</div>
            <textarea
              value={form.description}
              onChange={(e) => update('description', e.target.value)}
              rows={6}
              style={{
                ...formInputStyle,
                padding: '8px 12px',
                minHeight: '160px',
                resize: 'vertical',
              }}
              onFocus={(e) => (e.target.style.borderColor = 'var(--accent)')}
              onBlur={(e) =>
                (e.target.style.borderColor = 'var(--border)')
              }
            />
          </div>
          <div>
            <div style={fieldLabelStyle}>{isZh ? '详细描述 (英文)' : 'Description (EN)'}</div>
            <textarea
              value={form.descriptionEn}
              onChange={(e) => update('descriptionEn', e.target.value)}
              rows={6}
              style={{
                ...formInputStyle,
                padding: '8px 12px',
                minHeight: '160px',
                resize: 'vertical',
              }}
              onFocus={(e) => (e.target.style.borderColor = 'var(--accent)')}
              onBlur={(e) =>
                (e.target.style.borderColor = 'var(--border)')
              }
            />
          </div>
        </div>
      )}

      {/* Tab 3: 媒体素材 */}
      {activeTab === 'media' && (
        <div className="flex flex-col gap-[20px]">
          {/* Thumb upload */}
          <div>
            <div style={fieldLabelStyle}>{isZh ? '缩略图' : 'Thumbnail'}</div>
            {form.thumb ? (
              <div className="relative" style={{ aspectRatio: '2/1', width: '100%', maxWidth: '400px', position: 'relative' }}>
                <img
                  src={form.thumb}
                  alt="Thumbnail"
                  className="w-full h-full object-cover rounded-[8px]"
                  style={{
                    border: '1px solid var(--border)',
                  }}
                  onError={(e) => {
                    const target = e.currentTarget
                    target.style.display = 'none'
                    const placeholder = target.parentElement?.querySelector('.img-error-placeholder') as HTMLElement | null
                    if (placeholder) placeholder.style.display = 'flex'
                  }}
                />
                <div
                  className="img-error-placeholder flex-col items-center justify-center gap-[8px] absolute inset-0"
                  style={{ display: 'none', background: 'var(--bg)', color: 'var(--muted)', fontSize: '12px' }}
                >
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" style={{ opacity: 0.5 }}>
                    <rect x="3" y="3" width="18" height="18" rx="2" />
                    <circle cx="8.5" cy="8.5" r="1.5" />
                    <path d="M21 15l-5-5L5 21" />
                  </svg>
                  <span>{isZh ? '图片加载失败' : 'Image load failed'}</span>
                </div>
                <Button
                  variant="danger"
                  size="sm"
                  onClick={removeThumb}
                  className="absolute top-[8px] right-[8px]"
                >
                  {isZh ? '移除' : 'Remove'}
                </Button>
              </div>
            ) : (
              <label
                className="flex items-center justify-center cursor-pointer"
                style={{
                  aspectRatio: '2/1',
                  width: '100%',
                  maxWidth: '400px',
                  background: 'var(--bg)',
                  border: '2px dashed var(--surface-tint)',
                  borderRadius: '8px',
                }}
              >
                <span style={{ color: 'var(--muted)', fontSize: '13px' }}>
                  {uploading ? (isZh ? '上传中...' : 'Uploading...') : (isZh ? '点击上传缩略图' : 'Click to upload thumbnail')}
                </span>
                <input
                  type="file"
                  accept="image/*"
                  ref={thumbInputRef}
                  onChange={handleThumbUpload}
                  className="hidden"
                />
              </label>
            )}
          </div>

          {/* Screenshots grid */}
          <div>
            <div style={fieldLabelStyle}>{isZh ? '产品截图' : 'Screenshots'}</div>
            <div
              className="grid gap-[12px]"
              style={{ gridTemplateColumns: 'repeat(4, 1fr)' }}
            >
              {safe(form.screenshots).map((url, idx) => (
                <div
                  key={idx}
                  className="relative"
                  style={{
                    aspectRatio: '16/9',
                    borderRadius: '8px',
                    overflow: 'hidden',
                    background: 'var(--bg)',
                    border: '1px solid var(--border)',
                  }}
                >
                  <img
                    src={url}
                    alt={`Screenshot ${idx + 1}`}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      const target = e.currentTarget
                      target.style.display = 'none'
                      const placeholder = target.parentElement?.querySelector('.ss-error-placeholder') as HTMLElement | null
                      if (placeholder) placeholder.style.display = 'flex'
                    }}
                  />
                  <div
                    className="ss-error-placeholder flex-col items-center justify-center gap-[4px] absolute inset-0"
                    style={{ display: 'none', background: 'var(--bg)', color: 'var(--muted)', fontSize: '11px' }}
                  >
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" style={{ opacity: 0.4 }}>
                      <rect x="3" y="3" width="18" height="18" rx="2" />
                      <circle cx="8.5" cy="8.5" r="1.5" />
                      <path d="M21 15l-5-5L5 21" />
                    </svg>
                    <span>{isZh ? '加载失败' : 'Failed'}</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => removeScreenshot(idx)}
                    className="absolute top-[4px] right-[4px] flex items-center justify-center cursor-pointer rounded-full border-none"
                    style={{
                      width: '24px',
                      height: '24px',
                      background: 'rgba(0,0,0,0.7)',
                      color: 'var(--fg)',
                      fontSize: '14px',
                      lineHeight: 1,
                    }}
                  >
                    &times;
                  </button>
                </div>
              ))}

              {/* Add screenshot button */}
              <label
                className="flex items-center justify-center cursor-pointer"
                style={{
                  aspectRatio: '16/9',
                  borderRadius: '8px',
                  background: 'var(--bg)',
                  border: '1px solid var(--border)',
                }}
              >
                <span
                  className="text-[28px] font-light"
                  style={{ color: 'var(--muted)' }}
                >
                  +
                </span>
                <input
                  type="file"
                  accept="image/*"
                  ref={screenshotInputRef}
                  onChange={handleScreenshotUpload}
                  className="hidden"
                />
              </label>
            </div>
          </div>

          {/* Video upload */}
          <div>
            <div style={fieldLabelStyle}>{isZh ? '演示视频' : 'Demo Video'}</div>
            {form.videoUrl ? (
              <div style={{ marginBottom: '8px' }}>
                <video
                  src={form.videoUrl}
                  controls
                  style={{
                    width: '100%',
                    maxWidth: '400px',
                    borderRadius: '8px',
                    border: '1px solid var(--border)',
                    background: '#000',
                  }}
                />
                <div style={{ marginTop: '8px' }}>
                  <Button variant="danger" size="sm" onClick={() => update('videoUrl', '')}>
                    {isZh ? '移除视频' : 'Remove Video'}
                  </Button>
                </div>
              </div>
            ) : (
              <label
                className="flex items-center justify-center cursor-pointer"
                style={{
                  width: '100%',
                  maxWidth: '400px',
                  height: '100px',
                  background: 'var(--bg)',
                  border: '2px dashed var(--surface-tint)',
                  borderRadius: '8px',
                }}
              >
                <span style={{ color: 'var(--muted)', fontSize: '13px' }}>
                  {uploading ? (isZh ? '上传中...' : 'Uploading...') : (isZh ? '点击上传视频 (MP4/WebM, ≤200MB)' : 'Click to upload video (MP4/WebM, ≤200MB)')}
                </span>
                <input
                  type="file"
                  accept="video/mp4,video/webm"
                  onChange={async (e) => {
                    const file = e.target.files?.[0]
                    if (!file) return
                    try {
                      setUploading(true)
                      const url = await uploadFile(file, 'video')
                      update('videoUrl', url)
                    } catch {
                      alert(isZh ? '上传失败，请重试' : 'Upload failed, please retry')
                    } finally {
                      setUploading(false)
                    }
                  }}
                  className="hidden"
                />
              </label>
            )}
          </div>
        </div>
      )}

      {/* Tab 4: 收益数据 */}
      {activeTab === 'benefits' && (
        <div className="flex flex-col gap-[16px]">
          {safe(form.benefits).map((b, idx) => (
            <div
              key={idx}
              className="flex items-center gap-[10px] flex-wrap"
            >
              <input
                type="text"
                placeholder={isZh ? '指标 (中文)' : 'Label (ZH)'}
                value={b.label}
                onChange={(e) => updateBenefit(idx, 'label', e.target.value)}
                style={{
                  ...formInputStyle,
                  padding: '8px 12px',
                  flex: '1 1 140px',
                  minWidth: '120px',
                }}
                onFocus={(e) => (e.target.style.borderColor = 'var(--accent)')}
                onBlur={(e) =>
                  (e.target.style.borderColor = 'var(--border)')
                }
              />
              <input
                type="text"
                placeholder={isZh ? '指标 (英文)' : 'Label (EN)'}
                value={b.labelEn}
                onChange={(e) => updateBenefit(idx, 'labelEn', e.target.value)}
                style={{
                  ...formInputStyle,
                  padding: '8px 12px',
                  flex: '1 1 140px',
                  minWidth: '120px',
                }}
                onFocus={(e) => (e.target.style.borderColor = 'var(--accent)')}
                onBlur={(e) =>
                  (e.target.style.borderColor = 'var(--border)')
                }
              />
              <input
                type="number"
                placeholder={isZh ? '数值' : 'Value'}
                value={b.value}
                onChange={(e) => updateBenefit(idx, 'value', e.target.value)}
                style={{
                  ...formInputStyle,
                  padding: '8px 12px',
                  flex: '0 1 90px',
                  minWidth: '70px',
                }}
                onFocus={(e) => (e.target.style.borderColor = 'var(--accent)')}
                onBlur={(e) =>
                  (e.target.style.borderColor = 'var(--border)')
                }
              />
              <input
                type="text"
                placeholder={isZh ? '单位 (中)' : 'Unit (ZH)'}
                value={b.unit}
                onChange={(e) => updateBenefit(idx, 'unit', e.target.value)}
                style={{
                  ...formInputStyle,
                  padding: '8px 12px',
                  flex: '0 1 60px',
                  minWidth: '40px',
                }}
                onFocus={(e) => (e.target.style.borderColor = 'var(--accent)')}
                onBlur={(e) =>
                  (e.target.style.borderColor = 'var(--border)')
                }
              />
              <input
                type="text"
                placeholder={isZh ? '单位 (英)' : 'Unit (EN)'}
                value={b.unitEn ?? ''}
                onChange={(e) => updateBenefit(idx, 'unitEn', e.target.value)}
                style={{
                  ...formInputStyle,
                  padding: '8px 12px',
                  flex: '0 1 60px',
                  minWidth: '40px',
                }}
                onFocus={(e) => (e.target.style.borderColor = 'var(--accent)')}
                onBlur={(e) =>
                  (e.target.style.borderColor = 'var(--border)')
                }
              />
              <Button
                variant="danger"
                size="sm"
                onClick={() => removeBenefit(idx)}
              >
                {isZh ? '删除' : 'Del'}
              </Button>
            </div>
          ))}

          <div>
            <Button variant="ghost" size="sm" onClick={addBenefit}>
              + {isZh ? '添加收益指标' : 'Add Benefit'}
            </Button>
          </div>
        </div>
      )}

      {/* Tab 5: 对比信息 */}
      {activeTab === 'compare' && (
        <div className="flex flex-col gap-[24px]">
          {/* Pain Points */}
          <div>
            <div style={{ ...fieldLabelStyle, fontSize: '14px', color: 'var(--accent)' }}>{isZh ? '痛点分析' : 'Pain Points'}</div>
            <div className="grid gap-[16px]" style={{ gridTemplateColumns: 'repeat(2, 1fr)' }}>
              <div>
                <div style={fieldLabelStyle}>{isZh ? '痛点 (中文)' : 'Pain Points (ZH)'}</div>
                <textarea value={form.painPoints} onChange={(e) => update('painPoints', e.target.value)} rows={4}
                  style={{ ...formInputStyle, padding: '8px 12px', minHeight: '80px', resize: 'vertical' }}
                  onFocus={(e) => (e.target.style.borderColor = 'var(--accent)')}
                  onBlur={(e) => (e.target.style.borderColor = 'var(--border)')} />
              </div>
              <div>
                <div style={fieldLabelStyle}>{isZh ? '痛点 (英文)' : 'Pain Points (EN)'}</div>
                <textarea value={form.painPointsEn} onChange={(e) => update('painPointsEn', e.target.value)} rows={4}
                  style={{ ...formInputStyle, padding: '8px 12px', minHeight: '80px', resize: 'vertical' }}
                  onFocus={(e) => (e.target.style.borderColor = 'var(--accent)')}
                  onBlur={(e) => (e.target.style.borderColor = 'var(--border)')} />
              </div>
            </div>
          </div>

          {/* Solution */}
          <div>
            <div style={{ ...fieldLabelStyle, fontSize: '14px', color: 'var(--accent)' }}>{isZh ? '解决方案' : 'Solution'}</div>
            <div className="grid gap-[16px]" style={{ gridTemplateColumns: 'repeat(2, 1fr)' }}>
              <div>
                <div style={fieldLabelStyle}>{isZh ? '方案 (中文)' : 'Solution (ZH)'}</div>
                <textarea value={form.solution} onChange={(e) => update('solution', e.target.value)} rows={4}
                  style={{ ...formInputStyle, padding: '8px 12px', minHeight: '80px', resize: 'vertical' }}
                  onFocus={(e) => (e.target.style.borderColor = 'var(--accent)')}
                  onBlur={(e) => (e.target.style.borderColor = 'var(--border)')} />
              </div>
              <div>
                <div style={fieldLabelStyle}>{isZh ? '方案 (英文)' : 'Solution (EN)'}</div>
                <textarea value={form.solutionEn} onChange={(e) => update('solutionEn', e.target.value)} rows={4}
                  style={{ ...formInputStyle, padding: '8px 12px', minHeight: '80px', resize: 'vertical' }}
                  onFocus={(e) => (e.target.style.borderColor = 'var(--accent)')}
                  onBlur={(e) => (e.target.style.borderColor = 'var(--border)')} />
              </div>
            </div>
          </div>

          <div style={{ borderTop: '1px solid var(--border)', paddingTop: '16px' }}>
            <div style={{ ...fieldLabelStyle, fontSize: '14px', color: 'var(--accent)', marginBottom: '12px' }}>{isZh ? '实施前后对比' : 'Before & After'}</div>
            <div className="grid gap-[16px]" style={{ gridTemplateColumns: 'repeat(2, 1fr)' }}>
          <div>
            <div style={fieldLabelStyle}>{isZh ? '实施前 (中文)' : 'Before (ZH)'}</div>
            <textarea
              value={form.before}
              onChange={(e) => update('before', e.target.value)}
              rows={4}
              style={{
                ...formInputStyle,
                padding: '8px 12px',
                minHeight: '80px',
                resize: 'vertical',
              }}
              onFocus={(e) => (e.target.style.borderColor = 'var(--accent)')}
              onBlur={(e) =>
                (e.target.style.borderColor = 'var(--border)')
              }
            />
          </div>
          <div>
            <div style={fieldLabelStyle}>{isZh ? '实施前 (英文)' : 'Before (EN)'}</div>
            <textarea
              value={form.beforeEn}
              onChange={(e) => update('beforeEn', e.target.value)}
              rows={4}
              style={{
                ...formInputStyle,
                padding: '8px 12px',
                minHeight: '80px',
                resize: 'vertical',
              }}
              onFocus={(e) => (e.target.style.borderColor = 'var(--accent)')}
              onBlur={(e) =>
                (e.target.style.borderColor = 'var(--border)')
              }
            />
          </div>
          <div>
            <div style={fieldLabelStyle}>{isZh ? '实施后 (中文)' : 'After (ZH)'}</div>
            <textarea
              value={form.after}
              onChange={(e) => update('after', e.target.value)}
              rows={4}
              style={{
                ...formInputStyle,
                padding: '8px 12px',
                minHeight: '80px',
                resize: 'vertical',
              }}
              onFocus={(e) => (e.target.style.borderColor = 'var(--accent)')}
              onBlur={(e) =>
                (e.target.style.borderColor = 'var(--border)')
              }
            />
          </div>
          <div>
            <div style={fieldLabelStyle}>{isZh ? '实施后 (英文)' : 'After (EN)'}</div>
            <textarea
              value={form.afterEn}
              onChange={(e) => update('afterEn', e.target.value)}
              rows={4}
              style={{
                ...formInputStyle,
                padding: '8px 12px',
                minHeight: '80px',
                resize: 'vertical',
              }}
              onFocus={(e) => (e.target.style.borderColor = 'var(--accent)')}
              onBlur={(e) =>
                (e.target.style.borderColor = 'var(--border)')
              }
            />
          </div>
            </div>
          </div>
        </div>
      )}

      {/* Footer */}
      <div
        className="flex justify-end gap-[10px]"
        style={{
          marginTop: '24px',
          paddingTop: '20px',
          borderTop: '1px solid var(--border)',
        }}
      >
        <Button variant="ghost" onClick={onClose}>
          {isZh ? '取消' : 'Cancel'}
        </Button>
        <Button variant="primary" onClick={handleSave}>
          {isZh ? '保存' : 'Save'}
        </Button>
      </div>
    </Modal>
  )
}
