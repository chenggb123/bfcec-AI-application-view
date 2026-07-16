'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Input } from '@/components/ui/Input'

export default function LoginPage() {
  const [user, setUser] = useState('')
  const [pass, setPass] = useState('')
  const [error, setError] = useState(false)
  const router = useRouter()

  async function doLogin() {
    const res = await fetch('/api/auth', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username: user, password: pass }),
    })
    const data = await res.json()
    if (data.success) {
      // Session cookie is set HttpOnly by the API; just navigate.
      router.push('/admin')
    } else {
      setError(true)
    }
  }

  return (
    <div
      style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 20,
      }}
    >
      <div
        style={{
          background: 'var(--surface)',
          border: '1px solid var(--border)',
          borderRadius: 12,
          padding: '48px 40px',
          width: '100%',
          maxWidth: 400,
          textAlign: 'center',
        }}
      >
        {/* Cummins logo SVG */}
        <svg
          width="40"
          height="29"
          viewBox="0 0 560 400"
          xmlns="http://www.w3.org/2000/svg"
          style={{ filter: 'brightness(0) invert(1)' }}
        >
          <path
            clipRule="evenodd"
            strokeLinejoin="round"
            strokeMiterlimit="1.41421"
            d="m100.722 1239.93-1.238-1.76c-.217-.29-.512-.55-.868-.3-.564.39-.06.96-.036.99l1.21 1.73-1.134.79-1.565-2.23c-.188-.27-.319-.45-.575-.75l1.122-.78.368.49.012-.01c-.079-.56.209-1 .658-1.31.364-.26.91-.35 1.291-.08-.048-.5.225-.99.668-1.32.644-.45 1.415-.37 1.879.3l1.406 2.01-1.133.79-1.235-1.76c-.217-.29-.51-.55-.865-.31-.565.4-.063.96-.04 1l1.208 1.72zm-3.532 2.48-.251-.32c-.049.48-.267.81-.651 1.08-.644.45-1.414.37-1.877-.29l-1.409-2.02 1.133-.79 1.237 1.77c.218.28.512.55.868.3.564-.4.062-.96.036-1l-1.209-1.72 1.133-.8 1.565 2.24c.188.27.319.44.575.74zm-3.931 2.74c-1.183.83-2.805.54-3.628-.64-.824-1.18-.532-2.81.651-3.63l1.545-1.08.853 1.22-1.376.96c-.508.35-.633 1.05-.28 1.56.355.51 1.054.63 1.563.28l1.379-.97.849 1.22zm10.071-11.52.368.49.012-.01c-.079-.56.209-.99.66-1.31.362-.25.909-.35 1.289-.07-.048-.5.225-1 .668-1.33.644-.45 1.415-.36 1.879.3l1.406 2.01-1.133.8-1.235-1.77c-.216-.28-.51-.55-.865-.3-.565.4-.063.96-.04.99l1.208 1.73-1.133.79-1.238-1.77c-.217-.28-.512-.55-.866-.3-.566.4-.062.96-.038 1l1.21 1.73-1.134.79-1.565-2.24c-.188-.27-.319-.44-.575-.74zm4.762-5.29.562.8-1.146.8-.561-.8zm3.019 4.32-1.133.79-2.104-3 1.133-.79zm-.623-4.04.251.32c.049-.48.265-.81.651-1.08.644-.45 1.414-.37 1.876.29l1.409 2.01-1.132.8-1.239-1.77c-.217-.28-.512-.55-.866-.3-.566.39-.062.96-.036 1l1.208 1.72-1.134.79-1.564-2.23c-.188-.27-.32-.44-.574-.75zm-4.146 9.06h13.749v-11.66h-3.927l-.914.65c-.072-.1-.152-.18-.247-.2-.107-.03-.232 0-.388.11-.168.12-.203.28-.081.46.154.22.608-.12 1.476-.4.437-.13.837-.08 1.181.41.556.79-.049 1.52-.737 2-.736.52-1.559.87-2.194-.05l1.076-.75c.046.1.147.18.267.21.121.03.259.03.367-.05.221-.16.325-.35.19-.54-.372-.54-1.928 1.02-2.69-.06-.467-.67.01-1.36.546-1.79h-9.157s-7.335-.21-12 4.94c0 0-4.359 3.87-4.359 10.93 0 .34.011.66.031.99.003.11.072.83.121 1.22.783 5.67 4.33 8.87 4.33 8.87 4.941 4.94 11.785 4.73 11.785 4.73h15.324v-11.67h-13.811s-4.604-.03-4.604-4.17c0-4.08 4.666-4.18 4.666-4.18"
            fillRule="nonzero"
            transform="matrix(8.52308 0 0 8.52308 -608.92 -10384.5)"
          />
        </svg>

        <h1 style={{ fontSize: 22, fontWeight: 700, marginTop: 20, marginBottom: 4 }}>
          管理后台
        </h1>
        <p style={{ color: 'var(--muted)', fontSize: 14, marginBottom: 32 }}>
          BFCEC AI Center
        </p>

        {/* Username field */}
        <div style={{ marginBottom: 16, textAlign: 'left' }}>
          <label
            style={{
              display: 'block',
              fontSize: 12,
              fontWeight: 600,
              color: 'var(--muted)',
              textTransform: 'uppercase',
              letterSpacing: '0.04em',
              marginBottom: 6,
            }}
          >
            用户名
          </label>
          <Input
            type="text"
            value={user}
            onChange={(e) => {
              setUser(e.target.value)
              setError(false)
            }}
            placeholder="请输入用户名"
            autoComplete="off"
          />
        </div>

        {/* Password field */}
        <div style={{ marginBottom: 16, textAlign: 'left' }}>
          <label
            style={{
              display: 'block',
              fontSize: 12,
              fontWeight: 600,
              color: 'var(--muted)',
              textTransform: 'uppercase',
              letterSpacing: '0.04em',
              marginBottom: 6,
            }}
          >
            密码
          </label>
          <Input
            type="password"
            value={pass}
            onChange={(e) => {
              setPass(e.target.value)
              setError(false)
            }}
            placeholder="···"
            onKeyDown={(e) => {
              if (e.key === 'Enter') doLogin()
            }}
          />
        </div>

        {/* Login button */}
        <button
          onClick={doLogin}
          style={{
            width: '100%',
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 8,
            padding: '11px 24px',
            borderRadius: 8,
            fontSize: 14,
            fontWeight: 600,
            cursor: 'pointer',
            border: 'none',
            background: 'linear-gradient(135deg, #E84030, var(--accent))',
            color: '#fff',
            boxShadow: '0 2px 12px rgba(218,41,28,0.2)',
            transition: 'all 0.2s',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.filter = 'brightness(1.1)'
            e.currentTarget.style.boxShadow = '0 4px 20px rgba(218,41,28,0.35)'
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.filter = ''
            e.currentTarget.style.boxShadow = '0 2px 12px rgba(218,41,28,0.2)'
          }}
        >
          登 录
        </button>

        {/* Error message */}
        {error && (
          <p style={{ color: 'var(--accent)', fontSize: 13, marginTop: 8 }}>
            用户名或密码错误
          </p>
        )}

        {/* Back to front */}
        <Link
          href="/"
          style={{
            display: 'block',
            marginTop: 20,
            color: 'var(--muted)',
            fontSize: 13,
            textDecoration: 'none',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.color = 'var(--fg)'
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.color = 'var(--muted)'
          }}
        >
          ← 返回前台
        </Link>
      </div>
    </div>
  )
}
