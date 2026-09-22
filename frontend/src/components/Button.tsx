import type { ButtonHTMLAttributes, ReactNode } from 'react'

interface Props extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost'
  children: ReactNode
}

const base =
  'inline-flex items-center justify-center gap-2 rounded-md px-5 py-2.5 text-sm font-medium transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent disabled:opacity-50 disabled:pointer-events-none'

const variants = {
  primary: 'bg-accent text-white hover:bg-blue-500',
  secondary: 'bg-surface-2 text-ink border border-border hover:border-accent-border',
  ghost: 'text-ink-dim hover:text-ink',
}

export default function Button({ variant = 'primary', className = '', children, ...rest }: Props) {
  return (
    <button className={`${base} ${variants[variant]} ${className}`} {...rest}>
      {children}
    </button>
  )
}
