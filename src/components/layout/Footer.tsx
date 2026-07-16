'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useI18n } from '@/lib/i18n'

export function Footer() {
  const { t } = useI18n()
  const [showContact, setShowContact] = useState(false)

  return (
    <footer
      style={{
        position: 'relative',
        zIndex: 1,
        borderTop: '1px solid var(--border)',
        padding: '36px 40px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        background: 'rgba(255,255,255,0.01)',
      }}
      className="max-[640px]:flex-col max-[640px]:gap-5 max-[640px]:text-center max-[640px]:px-4"
    >
      <span style={{ fontSize: '13px', color: 'var(--muted)' }}>{t('copyright')}</span>
      <ul
        style={{
          display: 'flex',
          gap: '28px',
          listStyle: 'none',
          alignItems: 'center',
        }}
      >
        <li>
          <Link
            href="/products"
            style={{
              fontSize: '13px',
              color: 'var(--muted)',
              textDecoration: 'none',
              transition: 'color 0.2s',
              cursor: 'pointer',
            }}
            onMouseEnter={(e) => { e.currentTarget.style.color = 'var(--accent)' }}
            onMouseLeave={(e) => { e.currentTarget.style.color = 'var(--muted)' }}
          >
            {t('footerProducts')}
          </Link>
        </li>
        <li style={{ position: 'relative' }}>
          <span
            style={{
              fontSize: '13px',
              color: showContact ? 'var(--accent)' : 'var(--muted)',
              textDecoration: 'none',
              transition: 'color 0.2s',
              cursor: 'pointer',
            }}
            onClick={() => setShowContact(!showContact)}
            onMouseEnter={(e) => { if (!showContact) e.currentTarget.style.color = 'var(--accent)' }}
            onMouseLeave={(e) => { if (!showContact) e.currentTarget.style.color = 'var(--muted)' }}
          >
            {t('footerContact')}
          </span>
          {showContact && (
            <div
              style={{
                position: 'absolute',
                bottom: '100%',
                right: 0,
                marginBottom: '10px',
                background: 'var(--surface)',
                border: '1px solid rgba(255,255,255,0.1)',
                borderRadius: '8px',
                padding: '12px 16px',
                fontSize: '12px',
                color: 'var(--fg)',
                whiteSpace: 'nowrap',
                zIndex: 10,
                boxShadow: '0 4px 20px rgba(0,0,0,0.5)',
              }}
            >
              <div style={{ marginBottom: '4px' }}>📞 {t('footerPhone')}</div>
              <div style={{ color: 'var(--muted)' }}>📍 {t('footerAddress')}</div>
            </div>
          )}
        </li>
        <li>
          <span
            style={{
              fontSize: '13px',
              color: 'var(--muted)',
              textDecoration: 'none',
              transition: 'color 0.2s',
              cursor: 'pointer',
            }}
            onMouseEnter={(e) => { e.currentTarget.style.color = 'var(--accent)' }}
            onMouseLeave={(e) => { e.currentTarget.style.color = 'var(--muted)' }}
          >
            {t('footerPrivacy')}
          </span>
        </li>
      </ul>
    </footer>
  )
}
