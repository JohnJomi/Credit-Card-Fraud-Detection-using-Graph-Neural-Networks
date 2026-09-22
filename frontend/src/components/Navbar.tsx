import { Link, NavLink } from 'react-router-dom'
import ButtonLink from './ButtonLink'

export default function Navbar() {
  return (
    <header className="sticky top-4 z-50 px-4">
      <nav
        aria-label="Main"
        className="mx-auto flex max-w-6xl items-center justify-between gap-4 rounded-full border border-border-soft bg-white/72 px-6 py-3 shadow-elevated backdrop-blur-md"
      >
        <Link to="/" className="text-sm font-semibold tracking-wide text-ink">
          FraudGraph
        </Link>

        <div className="hidden md:flex items-center gap-1 text-sm text-ink-dim">
          <a
            href="/#how-it-works"
            className="rounded-full px-3 py-1.5 transition-colors duration-200 hover:bg-black/5 hover:text-ink"
          >
            How It Works
          </a>
          <a
            href="/#architecture"
            className="rounded-full px-3 py-1.5 transition-colors duration-200 hover:bg-black/5 hover:text-ink"
          >
            Architecture
          </a>
          <NavLink
            to="/dashboard"
            className={({ isActive }) =>
              `rounded-full px-3 py-1.5 transition-colors duration-200 ${
                isActive ? 'bg-dark text-white' : 'hover:bg-black/5 hover:text-ink'
              }`
            }
          >
            Dashboard
          </NavLink>
        </div>

        <ButtonLink to="/signin" variant="secondary">
          Sign In
        </ButtonLink>
      </nav>
    </header>
  )
}
