import { createContext, useContext, useEffect, useState, type ReactNode } from 'react'

interface AuthState {
  isAuthenticated: boolean
  email: string | null
  signIn: (email: string) => void
  signInAsDemo: () => void
  signOut: () => void
}

const STORAGE_KEY = 'fraudgraph.auth'

const AuthContext = createContext<AuthState | null>(null)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [email, setEmail] = useState<string | null>(null)

  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY)
      if (stored) setEmail(stored)
    } catch {
      // localStorage unavailable — stay signed out
    }
  }, [])

  const persist = (value: string | null) => {
    setEmail(value)
    try {
      if (value) localStorage.setItem(STORAGE_KEY, value)
      else localStorage.removeItem(STORAGE_KEY)
    } catch {
      // ignore storage errors, session still works in-memory
    }
  }

  const value: AuthState = {
    isAuthenticated: email !== null,
    email,
    signIn: (value) => persist(value),
    signInAsDemo: () => persist('demo@fraudgraph.ai'),
    signOut: () => persist(null),
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}
