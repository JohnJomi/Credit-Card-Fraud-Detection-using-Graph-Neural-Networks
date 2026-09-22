import type { ReactNode } from 'react'
import { Link } from 'react-router-dom'

interface Props {
  to: string
  variant?: 'primary' | 'secondary' | 'ghost'
  className?: string
  children: ReactNode
}

const base =
  'inline-flex items-center justify-center gap-2 rounded-md px-5 py-2.5 text-sm font-medium transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent'

const variants = {
  primary: 'bg-accent text-white hover:bg-blue-500',
  secondary: 'bg-surface-2 text-ink border border-border hover:border-accent-border',
  ghost: 'text-ink-dim hover:text-ink',
}

export default function ButtonLink({ to, variant = 'primary', className = '', children }: Props) {
  return (
    <Link to={to} className={`${base} ${variants[variant]} ${className}`}>
      {children}
    </Link>
  )
}
