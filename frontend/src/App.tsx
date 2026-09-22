import { BrowserRouter, Route, Routes } from 'react-router-dom'
import RequireAuth from './components/RequireAuth'
import { AuthProvider } from './lib/auth'
import Dashboard from './pages/Dashboard'
import Landing from './pages/Landing'
import SignIn from './pages/SignIn'

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/signin" element={<SignIn />} />
          <Route
            path="/dashboard"
            element={
              <RequireAuth>
                <Dashboard />
              </RequireAuth>
            }
          />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  )
}
