import React from 'react'

export interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string
  error?: string
  helperText?: string
}

export const Select: React.FC<SelectProps> = ({ label, error, helperText, className, id, children, ...props }) => {
  const selectId = id || (label ? label.toLowerCase().replace(/\s+/g, '-') : undefined)

  const baseClasses =
    'block w-full rounded-md border px-3 py-2.5 text-sm shadow-sm bg-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:border-blue-500'
  const normalBorder = 'border-gray-300 bg-white'
  const errorBorder = 'border-red-500 bg-red-50'

  const classes = [baseClasses, error ? errorBorder : normalBorder, className ?? ''].filter(Boolean).join(' ')

  return (
    <div className="space-y-1">
      {label && (
        <label htmlFor={selectId} className="block text-sm font-medium text-gray-700">
          {label}
        </label>
      )}
      <select id={selectId} className={classes} {...props}>
        {children}
      </select>
      {helperText && !error && <p className="text-xs text-gray-500">{helperText}</p>}
      {error && <p className="text-xs text-red-600">{error}</p>}
    </div>
  )
}

export default Select

