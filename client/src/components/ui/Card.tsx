import React from 'react'

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  title?: string
  actions?: React.ReactNode
}

export const Card: React.FC<CardProps> = ({ title, actions, className, children, ...rest }) => {
  return (
    <div
      className={`rounded-md border border-gray-100 bg-white p-4 md:p-5 shadow-sm shadow-gray-100 ${className ?? ''}`}
      {...rest}
    >
      {(title || actions) && (
        <div className="mb-3 flex items-center justify-between gap-2 border-b border-gray-100 pb-2">
          {title && <h2 className="text-sm font-semibold text-gray-800">{title}</h2>}
          {actions && <div className="flex items-center gap-2">{actions}</div>}
        </div>
      )}
      {children}
    </div>
  )
}

export default Card

