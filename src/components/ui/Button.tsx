'use client'

import { forwardRef } from 'react'
import { cn } from '@/lib/cn'
import styles from './Button.module.css'

type ButtonVariant = 'primary' | 'ghost' | 'danger' | 'success'
type ButtonSize = 'sm' | 'md' | 'lg'

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant
  size?: ButtonSize
  leftIcon?: React.ReactNode
  rightIcon?: React.ReactNode
  className?: string
  children?: React.ReactNode
}

const variantStyles: Record<ButtonVariant, React.CSSProperties> = {
  primary: {
    background: 'linear-gradient(135deg, #E84030 0%, #DA291C 50%, #B60005 100%)',
    color: '#fff',
    border: 'none',
    boxShadow: '0 4px 24px rgba(218,41,28,0.30)',
  },
  ghost: {
    background: 'rgba(255,255,255,0.04)',
    border: '1px solid var(--border)',
    color: 'var(--fg)',
  },
  danger: {
    background: 'rgba(218,41,28,0.12)',
    color: '#DA291C',
    border: '1px solid rgba(218,41,28,0.2)',
  },
  success: {
    background: 'rgba(34,197,94,0.1)',
    color: '#22c55e',
    border: '1px solid rgba(34,197,94,0.2)',
  },
}

const sizeClasses: Record<ButtonSize, string> = {
  sm: 'px-[14px] py-[5px] text-xs',
  md: 'px-[22px] py-[10px] text-sm',
  lg: 'px-[24px] py-[11px] text-sm',
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      variant = 'primary',
      size = 'md',
      leftIcon,
      rightIcon,
      className,
      children,
      ...rest
    },
    ref
  ) => {
    const isPrimary = variant === 'primary'

    return (
      <button
        ref={ref}
        className={cn(
          'relative inline-flex items-center gap-[10px] rounded-[10px] font-semibold tracking-[0.02em] cursor-pointer transition-all duration-200',
          sizeClasses[size],
          isPrimary && styles.btnPrimary,
          className
        )}
        style={{
          ...variantStyles[variant],
          borderRadius: '10px',
        }}
        onMouseEnter={(e) => {
          if (variant === 'primary') {
            const btn = e.currentTarget
            btn.style.transform = 'translateY(-2px)'
            btn.style.boxShadow = '0 8px 40px rgba(218,41,28,0.45)'
            btn.style.filter = 'brightness(1.08)'
          } else if (variant === 'ghost') {
            const btn = e.currentTarget
            btn.style.background = 'rgba(255,255,255,0.08)'
            btn.style.borderColor = '#DA291C'
          } else if (variant === 'danger') {
            const btn = e.currentTarget
            btn.style.background = '#DA291C'
            btn.style.color = '#fff'
          } else if (variant === 'success') {
            const btn = e.currentTarget
            btn.style.background = '#22c55e'
            btn.style.color = '#fff'
          }
        }}
        onMouseLeave={(e) => {
          const btn = e.currentTarget
          btn.style.transform = ''
          btn.style.boxShadow = variant === 'primary' ? '0 4px 24px rgba(218,41,28,0.30)' : ''
          btn.style.filter = ''
          btn.style.background = ''
          btn.style.color = ''
          btn.style.borderColor = ''
        }}
        onMouseDown={(e) => {
          if (variant === 'primary') {
            const btn = e.currentTarget
            btn.style.transform = 'translateY(0) scale(0.97)'
            btn.style.boxShadow = '0 0 12px rgba(218,41,28,0.25)'
            btn.style.transition = 'transform 0.1s ease-out, box-shadow 0.1s ease-out'
          }
        }}
        onMouseUp={(e) => {
          if (variant === 'primary') {
            const btn = e.currentTarget
            btn.style.transform = 'translateY(-2px)'
            btn.style.boxShadow = '0 8px 40px rgba(218,41,28,0.45)'
            btn.style.transition = 'transform 0.2s, box-shadow 0.2s, filter 0.2s'
          }
        }}
        {...rest}
      >
        {leftIcon && <span className="inline-flex shrink-0">{leftIcon}</span>}
        {children}
        {rightIcon && (
          <span className="inline-flex shrink-0 transition-transform duration-200 group-hover:translate-x-1">
            {rightIcon}
          </span>
        )}
      </button>
    )
  }
)

Button.displayName = 'Button'
