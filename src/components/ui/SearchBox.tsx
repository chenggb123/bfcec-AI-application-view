import { forwardRef } from 'react'
import { Input } from './Input'

interface SearchBoxProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'leftIcon'> {
  className?: string
}

const SearchIcon = () => (
  <svg
    width="16"
    height="16"
    viewBox="0 0 16 16"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.6"
    strokeLinecap="round"
  >
    <circle cx="7" cy="7" r="4.5" />
    <path d="M10.5 10.5L14 14" />
  </svg>
)

export const SearchBox = forwardRef<HTMLInputElement, SearchBoxProps>(
  ({ className, ...rest }, ref) => {
    return (
      <Input
        ref={ref}
        leftIcon={<SearchIcon />}
        className={className}
        {...rest}
      />
    )
  }
)

SearchBox.displayName = 'SearchBox'
