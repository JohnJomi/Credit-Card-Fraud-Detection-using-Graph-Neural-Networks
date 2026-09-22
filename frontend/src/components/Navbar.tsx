import { Link } from 'react-router-dom'
import ButtonLink from './ButtonLink'

export default function Navbar() {
  return (
    <header className="sticky top-0 z-50 border-b border-border-soft bg-bg/85 backdrop-blur">
      <nav
        aria-label="Main"
        className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4"
      >
        <Link to="/" className="text-sm font-semibold tracking-wide text-ink">
          FraudGraph
        </Link>

        <div className="hidden md:flex items-center gap-8 text-sm text-ink-dim">
          <a href="/#how-it-works" className="hover:text-ink transition-colors">
            How It Works
          </a>
          <a href="/#architecture" className="hover:text-ink transition-colors">
            Architecture
          </a>
          <Link to="/dashboard" className="hover:text-ink transition-colors">
            Dashboard
          </Link>
        </div>

        <ButtonLink to="/signin" variant="secondary">
          Sign In
        </ButtonLink>
      </nav>
    </header>
  )
}
