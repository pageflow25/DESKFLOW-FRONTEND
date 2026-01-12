import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import { tw } from '@twind/core'

// ============================================
// ÍCONES SVG
// ============================================
const Icons = {
  School: ({ className, style }) => (
    <svg className={className} style={style} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M4.26 10.147a60.436 60.436 0 00-.491 6.347A48.627 48.627 0 0112 20.904a48.627 48.627 0 018.232-4.41 60.46 60.46 0 00-.491-6.347m-15.482 0a50.57 50.57 0 00-2.658-.813A59.905 59.905 0 0112 3.493a59.902 59.902 0 0110.399 5.84c-.896.248-1.783.52-2.658.814m-15.482 0A50.697 50.697 0 0112 13.489a50.702 50.702 0 017.74-3.342M6.75 15a.75.75 0 100-1.5.75.75 0 000 1.5zm0 0v-3.675A55.378 55.378 0 0112 8.443m-7.007 11.55A5.981 5.981 0 006.75 15.75v-1.5" />
    </svg>
  ),
  User: ({ className, style }) => (
    <svg className={className} style={style} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
    </svg>
  ),
  Lock: ({ className, style }) => (
    <svg className={className} style={style} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z" />
    </svg>
  ),
  ExclamationCircle: ({ className, style }) => (
    <svg className={className} style={style} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z" />
    </svg>
  ),
  Spinner: ({ className, style }) => (
    <svg className={className} style={style} fill="none" viewBox="0 0 24 24">
      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
    </svg>
  ),
  ArrowRight: ({ className, style }) => (
    <svg className={className} style={style} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" />
    </svg>
  )
}

export default function Login() {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const { login } = useAuth()
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    const result = await login(username, password)

    if (result.success) {
      navigate('/dashboard')
    } else {
      setError(result.error)
    }

    setLoading(false)
  }

  return (
    <div className={tw`h-screen flex flex-col`} style={{ backgroundColor: '#f1f5f9' }}>
      {/* ============================================ */}
      {/* HEADER PRINCIPAL */}
      {/* ============================================ */}
      <header
        className={tw`flex-shrink-0 border-b`}
        style={{ backgroundColor: '#ffffff', borderColor: '#e2e8f0' }}
      >
        <div className={tw`flex items-center justify-between px-6 py-3`}>
          {/* Logo / Título */}
          <div className={tw`flex items-center gap-3`}>
            <div
              className={tw`w-9 h-9 rounded-lg flex items-center justify-center`}
              style={{ backgroundColor: '#3b82f6' }}
            >
              <Icons.School className={tw`w-5 h-5`} style={{ color: '#ffffff' }} />
            </div>
            <div>
              <h1 className={tw`text-lg font-bold`} style={{ color: '#0f172a' }}>DESKFLOW</h1>
              <p className={tw`text-xs`} style={{ color: '#64748b' }}>Sistema de Gestão de Pedidos</p>
            </div>
          </div>

          {/* Badge de Login */}
          <div
            className={tw`px-3 py-1.5 rounded-full text-xs font-medium`}
            style={{ backgroundColor: '#eff6ff', color: '#3b82f6' }}
          >
            Área de Login
          </div>
        </div>
      </header>

      {/* ============================================ */}
      {/* CONTEÚDO PRINCIPAL - LOGIN */}
      {/* ============================================ */}
      <main className={tw`flex-1 flex items-center justify-center px-6`}>
        <div className={tw`w-full max-w-md`}>
          {/* Card de Login */}
          <div
            className={tw`rounded-xl border overflow-hidden`}
            style={{ backgroundColor: '#ffffff', borderColor: '#e2e8f0' }}
          >
            {/* Header do Card */}
            <div
              className={tw`px-8 py-6 border-b`}
              style={{ backgroundColor: '#f8fafc', borderColor: '#e2e8f0' }}
            >
              <div className={tw`flex items-center gap-4 mb-3`}>
                <div
                  className={tw`w-12 h-12 rounded-xl flex items-center justify-center`}
                  style={{ backgroundColor: '#3b82f6' }}
                >
                  <Icons.User className={tw`w-6 h-6`} style={{ color: '#ffffff' }} />
                </div>
                <div>
                  <h2 className={tw`text-xl font-bold`} style={{ color: '#0f172a' }}>Login DESKFLOW</h2>
                  <p className={tw`text-sm`} style={{ color: '#64748b' }}>Acesso restrito ao sistema</p>
                </div>
              </div>
            </div>

            {/* Body do Card */}
            <div className={tw`px-8 py-6`}>
              {/* Mensagem de Erro */}
              {error && (
                <div
                  className={tw`flex items-start gap-3 px-4 py-3 rounded-lg mb-6`}
                  style={{ backgroundColor: '#fef2f2', border: '1px solid #fecaca' }}
                >
                  <Icons.ExclamationCircle className={tw`w-5 h-5 flex-shrink-0 mt-0.5`} style={{ color: '#dc2626' }} />
                  <p className={tw`text-sm`} style={{ color: '#dc2626' }}>{error}</p>
                </div>
              )}

              {/* Formulário */}
              <form onSubmit={handleSubmit} className={tw`space-y-5`}>
                {/* Campo Usuário */}
                <div>
                  <label
                    className={tw`block text-sm font-semibold mb-2`}
                    htmlFor="username"
                    style={{ color: '#334155' }}
                  >
                    Usuário
                  </label>
                  <div className={tw`relative`}>
                    <div className={tw`absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none`}>
                      <Icons.User className={tw`w-5 h-5`} style={{ color: '#94a3b8' }} />
                    </div>
                    <input
                      id="username"
                      type="text"
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      className={tw`w-full pl-10 pr-4 py-2.5 rounded-lg border focus:outline-none focus:ring-2 transition-all`}
                      style={{
                        backgroundColor: '#ffffff',
                        borderColor: '#e2e8f0',
                        color: '#0f172a'
                      }}
                      placeholder="Digite seu usuário"
                      required
                      disabled={loading}
                    />
                  </div>
                </div>

                {/* Campo Senha */}
                <div>
                  <label
                    className={tw`block text-sm font-semibold mb-2`}
                    htmlFor="password"
                    style={{ color: '#334155' }}
                  >
                    Senha
                  </label>
                  <div className={tw`relative`}>
                    <div className={tw`absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none`}>
                      <Icons.Lock className={tw`w-5 h-5`} style={{ color: '#94a3b8' }} />
                    </div>
                    <input
                      id="password"
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className={tw`w-full pl-10 pr-4 py-2.5 rounded-lg border focus:outline-none focus:ring-2 transition-all`}
                      style={{
                        backgroundColor: '#ffffff',
                        borderColor: '#e2e8f0',
                        color: '#0f172a'
                      }}
                      placeholder="Digite sua senha"
                      required
                      disabled={loading}
                    />
                  </div>
                </div>

                {/* Botão de Submit */}
                <button
                  type="submit"
                  disabled={loading}
                  className={tw`w-full py-3 rounded-lg font-semibold text-base flex items-center justify-center gap-2 transition-all ${loading ? 'cursor-not-allowed' : 'hover:shadow-lg active:scale-[0.98]'
                    }`}
                  style={{
                    backgroundColor: loading ? '#94a3b8' : '#3b82f6',
                    color: '#ffffff'
                  }}
                >
                  {loading ? (
                    <>
                      <Icons.Spinner className={tw`w-5 h-5 animate-spin`} />
                      Entrando...
                    </>
                  ) : (
                    <>
                      Entrar no Sistema
                      <Icons.ArrowRight className={tw`w-5 h-5`} />
                    </>
                  )}
                </button>
              </form>
            </div>

            {/* Footer do Card */}
            <div
              className={tw`px-8 py-4 border-t text-center`}
              style={{ backgroundColor: '#f8fafc', borderColor: '#e2e8f0' }}
            >
              <p className={tw`text-xs`} style={{ color: '#64748b' }}>
                🔒 Acesso restrito a administradores do sistema
              </p>
            </div>
          </div>

          {/* Informações adicionais */}
          <div className={tw`mt-6 text-center`}>
            <p className={tw`text-sm`} style={{ color: '#64748b' }}>
              DESKFLOW © {new Date().getFullYear()} - Versão 1.0.6
            </p>
          </div>
        </div>
      </main>
    </div>
  )
}
