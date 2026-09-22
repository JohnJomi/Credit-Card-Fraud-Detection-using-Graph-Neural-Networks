import type { ReactNode } from 'react'
import { Link } from 'react-router-dom'

interface Props {
  to: string
  variant?: 'primary' | 'secondary' | 'ghost'
  className?: string
  children: ReactNode
}

const base =
  'inline-flex items-center justify-center gap-2 rounded-full px-5 py-2.5 text-sm font-medium transition-all duration-200 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-dark'

const variants = {
  primary:
    'bg-dark text-white hover:bg-dark-hover hover:-translate-y-px hover:shadow-hover active:translate-y-0',
  secondary:
    'bg-white/65 text-dark border border-border hover:bg-white hover:border-border-hover hover:-translate-y-px',
  ghost: 'text-ink-dim hover:text-ink',
}

export default function ButtonLink({ to, variant = 'primary', className = '', children }: Props) {
  return (
    <Link to={to} className={`${base} ${variants[variant]} ${className}`}>
      {children}
    </Link>
  )
}
