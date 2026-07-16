import { forwardRef } from 'react'
import { cn } from '@/lib/cn'

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  leftIcon?: React.ReactNode
  error?: boolean
  className?: string
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ leftIcon, error = false, className, ...rest }, ref) => {
    return (
      <div className="relative">
        {leftIcon && (
          <span className="absolute left-[14px] top-1/2 -translate-y-1/2 text-fg-muted pointer-events-none">
            {leftIcon}
          </span>
        )}
        <input
          ref={ref}
          className={cn(
            'w-full bg-surface-bg border border-border rounded-[10px] text-fg-primary text-sm outline-none py-[10px] px-[14px] transition-colors duration-200',
            'focus:border-brand-red focus:shadow-[0_0_0_3px_rgba(218,41,28,0.10)]',
            leftIcon && 'pl-[40px]',
            error && 'border-brand-red',
            className
          )}
          {...rest}
        />
      </div>
    )
  }
)

Input.displayName = 'Input'
