import { Navigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import { tw } from '@twind/core'

export default function ProtectedRoute({ children }) {
  const { isAuthenticated, isAdmin, loading } = useAuth()

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
        <div className={tw`bg-white p-8 rounded-lg shadow-md`}>
          <h1 className={tw`text-2xl font-bold text-red-600 mb-4`}>Acesso Negado</h1>
          <p className={tw`text-gray-700`}>
            Apenas administradores podem acessar este recurso.
          </p>
        </div>
      </div>
    )
  }

  return children
}
