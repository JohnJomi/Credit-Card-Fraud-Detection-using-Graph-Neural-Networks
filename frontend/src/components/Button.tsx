import type { ButtonHTMLAttributes, ReactNode } from 'react'

interface Props extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost'
  children: ReactNode
}

const base =
  'inline-flex items-center justify-center gap-2 rounded-full px-5 py-2.5 text-sm font-medium transition-all duration-200 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-dark disabled:opacity-50 disabled:pointer-events-none'

const variants = {
  primary:
    'bg-dark text-white hover:bg-dark-hover hover:-translate-y-px hover:shadow-hover active:translate-y-0',
  secondary:
    'bg-white/65 text-dark border border-border hover:bg-white hover:border-border-hover hover:-translate-y-px',
  ghost: 'text-ink-dim hover:text-ink',
}

export default function Button({ variant = 'primary', className = '', children, ...rest }: Props) {
  return (
    <button className={`${base} ${variants[variant]} ${className}`} {...rest}>
      {children}
    </button>
  )
}
