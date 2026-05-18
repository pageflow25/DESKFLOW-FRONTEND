import { Navigate } from 'react-router-dom'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import { tw } from '@twind/core'

export default function ProtectedRoute({ children }) {
  const { isAuthenticated, isAdmin, loading, logout } = useAuth()
  const navigate = useNavigate()

  const handleReturnToLogin = () => {
    logout()
    navigate('/login', { replace: true })
  }

  if (loading) {
    return (
      <div className={tw`min-h-screen flex items-center justify-center`}>
        <div className={tw`text-center`}>
          <div className={tw`inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600`}></div>
          <p className={tw`mt-4 text-gray-600`}>Carregando...</p>
        </div>
      </div>
    )
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />
  }

  if (!isAdmin()) {
    return (
      <div className={tw`min-h-screen flex items-center justify-center bg-gray-100`}>
        <div className={tw`bg-white p-8 rounded-lg shadow-md max-w-md text-center`}>
          <h1 className={tw`text-2xl font-bold text-red-600 mb-4`}>Acesso Negado</h1>
          <p className={tw`text-gray-700`}>
            Apenas administradores podem acessar este recurso.
          </p>
          <button
            type="button"
            onClick={handleReturnToLogin}
            className={tw`mt-6 inline-flex items-center justify-center rounded-lg bg-primary-600 px-4 py-2 font-semibold text-white transition-colors hover:bg-primary-700`}
          >
            Voltar para o login
          </button>
        </div>
      </div>
    )
  }

  return children
}
