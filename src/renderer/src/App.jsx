import { BrowserRouter as Router, Routes, Route, Navigate, useNavigate } from 'react-router-dom'
import { useEffect } from 'react'
import { AuthProvider } from './contexts/AuthContext'
import ProtectedRoute from './components/ProtectedRoute'
import UpdateNotice from './components/UpdateNotice'
import Login from './pages/Login'
import Dashboard from './pages/Dashboard'
import SchoolDetails from './pages/SchoolDetails'
import { install } from '@twind/core'
import config from './utils/twind.config'

// Instalar Twind globalmente
install(config)

function AuthEventListener() {
  const navigate = useNavigate()

  useEffect(() => {
    const handleUnauthorized = () => {
      navigate('/login', { replace: true })
    }

    window.addEventListener('auth:unauthorized', handleUnauthorized)

    return () => {
      window.removeEventListener('auth:unauthorized', handleUnauthorized)
    }
  }, [navigate])

  return null
}

function App() {
  return (
    <Router>
      <AuthProvider>
        <UpdateNotice />
        <AuthEventListener />
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/escola/:escolaId"
            element={
              <ProtectedRoute>
                <SchoolDetails />
              </ProtectedRoute>
            }
          />
          <Route path="/" element={<Navigate to="/dashboard" replace />} />
        </Routes>
      </AuthProvider>
    </Router>
  )
}

export default App
