import React from 'react'

type ButtonVariant = 'primary' | 'secondary' | 'outline' | 'ghost'
type ButtonSize = 'sm' | 'md' | 'lg'

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant
  size?: ButtonSize
  fullWidth?: boolean
  loading?: boolean
  iconLeft?: React.ReactNode
}

const baseClasses =
  'inline-flex items-center justify-center rounded-md font-medium transition-colors transition-transform focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-blue-500 disabled:opacity-60 disabled:cursor-not-allowed active:scale-95'

const variantClasses: Record<ButtonVariant, string> = {
  primary: 'bg-blue-600 text-white hover:bg-blue-700 shadow-sm hover:shadow-md',
  secondary: 'bg-gray-100 text-gray-900 hover:bg-gray-200',
  outline: 'border border-gray-200 text-gray-800 hover:bg-gray-50',
  ghost: 'text-gray-600 hover:bg-gray-100',
}

const sizeClasses: Record<ButtonSize, string> = {
  sm: 'px-2.5 py-1.5 text-sm',
  md: 'px-4 py-2 text-sm',
  lg: 'px-5 py-2.5 text-base',
}

export const Button: React.FC<ButtonProps> = ({
  variant = 'primary',
  size = 'md',
  fullWidth,
  loading,
  iconLeft,
  className,
  children,
  disabled,
  ...props
}) => {
  const classes = [
    baseClasses,
    variantClasses[variant],
    sizeClasses[size],
    fullWidth ? 'w-full' : '',
    className ?? '',
  ]
    .filter(Boolean)
    .join(' ')

  return (
    <button className={classes} disabled={disabled || loading} {...props}>
      {loading && (
        <span className="mr-2 inline-flex h-4 w-4 items-center justify-center">
          <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/60 border-t-white" />
        </span>
      )}
      {iconLeft && !loading && <span className="mr-2 inline-flex h-4 w-4 items-center justify-center">{iconLeft}</span>}
      <span>{children}</span>
    </button>
  )
}

export default Button

