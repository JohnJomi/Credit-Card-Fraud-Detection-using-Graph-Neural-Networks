import { useState, type FormEvent } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import Button from '../components/Button'
import MiniGraph from '../components/MiniGraph'
import { useAuth } from '../lib/auth'

export default function SignIn() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const { signIn, signInAsDemo } = useAuth()
  const navigate = useNavigate()

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault()
    if (!email) return
    signIn(email)
    navigate('/dashboard')
  }

  const handleDemo = () => {
    signInAsDemo()
    navigate('/dashboard')
  }

  return (
    <div className="min-h-screen bg-bg text-ink grid md:grid-cols-2">
      <div className="hidden md:flex flex-col justify-between border-r border-border-soft p-10">
        <Link to="/" className="text-sm font-semibold tracking-wide text-ink">
          FraudGraph
        </Link>

        <div>
          <MiniGraph className="w-full max-w-sm" />
        </div>

        <p className="text-ink-dim text-lg max-w-xs leading-relaxed">
          Understand the graph behind the prediction.
        </p>
      </div>

      <div className="flex items-center justify-center p-8">
        <div className="relative w-full max-w-sm">
          <div
            aria-hidden="true"
            className="pointer-events-none absolute -inset-10 -z-10"
            style={{
              background:
                'radial-gradient(circle, rgba(168,118,62,0.14), transparent 65%)',
            }}
          />

          <div className="flex flex-col gap-6 rounded-card border border-border bg-surface-elevated p-8 shadow-card">
            <div>
              <Link
                to="/"
                className="md:hidden text-sm font-semibold tracking-wide text-ink block mb-8"
              >
                FraudGraph
              </Link>
              <h1 className="text-2xl font-semibold text-ink tracking-tight">Welcome back</h1>
              <p className="text-ink-dim text-sm mt-1">Sign in to continue to FraudGraph.</p>
            </div>

            <form onSubmit={handleSubmit} className="flex flex-col gap-4" noValidate>
              <div className="flex flex-col gap-1.5">
                <label htmlFor="email" className="text-xs text-ink-dim">
                  Email
                </label>
                <input
                  id="email"
                  type="email"
                  autoComplete="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="rounded-2xl border border-border bg-white/75 px-3.5 py-2.5 text-sm text-ink placeholder:text-ink-faint outline-none transition-[border-color,box-shadow] duration-200 focus:border-accent focus:shadow-[0_0_0_3px_rgba(168,118,62,0.18)]"
                  placeholder="you@example.com"
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label htmlFor="password" className="text-xs text-ink-dim">
                  Password
                </label>
                <input
                  id="password"
                  type="password"
                  autoComplete="current-password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="rounded-2xl border border-border bg-white/75 px-3.5 py-2.5 text-sm text-ink placeholder:text-ink-faint outline-none transition-[border-color,box-shadow] duration-200 focus:border-accent focus:shadow-[0_0_0_3px_rgba(168,118,62,0.18)]"
                  placeholder="••••••••"
                />
              </div>

              <Button type="submit" className="mt-2">
                Sign In
              </Button>
            </form>

            <div className="flex items-center gap-3 text-xs text-ink-faint">
              <span className="h-px flex-1 bg-border" />
              Demo access
              <span className="h-px flex-1 bg-border" />
            </div>

            <Button variant="secondary" onClick={handleDemo}>
              Continue as Demo
            </Button>

            <p className="text-xs text-ink-faint text-center">
              This is a local demo authentication flow — no account data is sent anywhere.
            </p>

            <p className="text-sm text-ink-dim text-center">
              Don&apos;t have an account?{' '}
              <span
                className="text-ink-faint cursor-not-allowed"
                title="Account creation is not available in this demo"
              >
                Create one
              </span>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
