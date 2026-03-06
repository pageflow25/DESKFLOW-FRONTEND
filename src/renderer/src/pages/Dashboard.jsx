import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import { useTheme } from '../contexts/ThemeContext'
import { dashboardService } from '../services/api'
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
  Logout: ({ className, style }) => (
    <svg className={className} style={style} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15m3 0l3-3m0 0l-3-3m3 3H9" />
    </svg>
  ),
  Spinner: ({ className, style }) => (
    <svg className={className} style={style} fill="none" viewBox="0 0 24 24">
      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
    </svg>
  ),
  ChartBar: ({ className, style }) => (
    <svg className={className} style={style} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 013 19.875v-6.75zM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V8.625zM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V4.125z" />
    </svg>
  ),
  ExclamationCircle: ({ className, style }) => (
    <svg className={className} style={style} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z" />
    </svg>
  ),
  Building: ({ className, style }) => (
    <svg className={className} style={style} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 21h19.5m-18-18v18m10.5-18v18m6-13.5V21M6.75 6.75h.75m-.75 3h.75m-.75 3h.75m3-6h.75m-.75 3h.75m-.75 3h.75M6.75 21v-3.375c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21M3 3h12m-.75 4.5H21m-3.75 3.75h.008v.008h-.008v-.008zm0 3h.008v.008h-.008v-.008zm0 3h.008v.008h-.008v-.008z" />
    </svg>
  ),
  ChevronRight: ({ className, style }) => (
    <svg className={className} style={style} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
    </svg>
  ),
  Refresh: ({ className, style }) => (
    <svg className={className} style={style} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182m0-4.991v4.99" />
    </svg>
  ),
  Sun: ({ className, style }) => (
    <svg className={className} style={style} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v2.25m6.364.386l-1.591 1.591M21 12h-2.25m-.386 6.364l-1.591-1.591M12 18.75V21m-4.773-4.227l-1.591 1.591M5.25 12H3m4.227-4.773L5.636 5.636M15.75 12a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0z" />
    </svg>
  ),
  Moon: ({ className, style }) => (
    <svg className={className} style={style} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M21.752 15.002A9.718 9.718 0 0118 15.75c-5.385 0-9.75-4.365-9.75-9.75 0-1.33.266-2.597.748-3.752A9.753 9.753 0 003 11.25C3 16.635 7.365 21 12.75 21a9.753 9.753 0 009.002-5.998z" />
    </svg>
  )
}

export default function Dashboard() {
  const [escolas, setEscolas] = useState([])
  const [loading, setLoading] = useState(true)
  const [refreshing, setRefreshing] = useState(false)
  const [error, setError] = useState('')
  const [checkingUpdates, setCheckingUpdates] = useState(false)
  const { user, logout } = useAuth()
  const { isDark, toggleTheme, colors: c } = useTheme()
  const navigate = useNavigate()

  useEffect(() => {
    loadEscolas()
  }, [])

  const loadEscolas = async () => {
    try {
      setLoading(true)
      setError('')
      const data = await dashboardService.getEscolas()
      setEscolas(data.escolas)
    } catch (err) {
      console.error('Erro ao carregar escolas:', err)
      setError(err.response?.data?.detail || 'Erro ao carregar escolas')
    } finally {
      setLoading(false)
      setRefreshing(false)
    }
  }

  const handleRefresh = () => {
    setRefreshing(true)
    loadEscolas()
  }

  const handleEscolaClick = (escola) => {
    navigate(`/escola/${escola.escola_id}`, { state: { nomeEscola: escola.nome_escola } })
  }

  const handleCheckForUpdates = async () => {
    setCheckingUpdates(true)
    try {
      await window.api?.updates?.checkNow()
    } catch (err) {
      console.error('Erro ao verificar atualizações:', err)
    } finally {
      // Mantém o spinner por um tempo mínimo para feedback visual
      setTimeout(() => setCheckingUpdates(false), 1500)
    }
  }

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  // Calcular estatísticas
  const totalPedidos = escolas.reduce((acc, e) => acc + (e.total_pedidos || 0), 0)

  return (
    <div className={tw`h-screen flex flex-col`} style={{ backgroundColor: c.pageBg }}>
      {/* ============================================ */}
      {/* HEADER PRINCIPAL */}
      {/* ============================================ */}
      <header
        className={tw`flex-shrink-0 border-b`}
        style={{ backgroundColor: c.headerBg, borderColor: c.border }}
      >
        <div className={tw`flex items-center justify-between px-6 py-3`}>
          {/* Logo / Título */}
          <div className={tw`flex items-center gap-3`}>
            <div
              className={tw`w-9 h-9 rounded-lg flex items-center justify-center`}
              style={{ backgroundColor: c.accent }}
            >
              <Icons.School className={tw`w-5 h-5`} style={{ color: '#ffffff' }} />
            </div>
            <div>
              <h1 className={tw`text-lg font-bold`} style={{ color: c.textPrimary }}>DESKFLOW</h1>
              <p className={tw`text-xs`} style={{ color: c.textMuted }}>Sistema de Gestão de Pedidos</p>
            </div>
          </div>

          {/* User Info + Logout */}
          <div className={tw`flex items-center gap-4`}>
            <div className={tw`text-right`}>
              <p className={tw`text-sm font-medium`} style={{ color: c.textSecondary }}>{user?.name || 'Usuário'}</p>
              <p className={tw`text-xs`} style={{ color: c.textSubtle }}>Logado</p>
            </div>
            <button
              onClick={toggleTheme}
              className={tw`p-2 rounded-lg transition-colors`}
              title={isDark ? 'Modo claro' : 'Modo escuro'}
            >
              {isDark
                ? <Icons.Sun className={tw`w-5 h-5`} style={{ color: '#fbbf24' }} />
                : <Icons.Moon className={tw`w-5 h-5`} style={{ color: c.textMuted }} />
              }
            </button>
            <button
              onClick={handleCheckForUpdates}
              disabled={checkingUpdates}
              className={tw`p-2 rounded-lg transition-colors disabled:opacity-50`}
              title="Verificar atualizações"
            >
              <Icons.Refresh
                className={tw`w-5 h-5 ${checkingUpdates ? 'animate-spin' : ''}`}
                style={{ color: c.accent }}
              />
            </button>
            <button
              onClick={handleLogout}
              className={tw`p-2 rounded-lg transition-colors`}
              title="Sair"
            >
              <Icons.Logout className={tw`w-5 h-5`} style={{ color: c.textMuted }} />
            </button>
          </div>
        </div>
      </header>

      {/* ============================================ */}
      {/* TÍTULO DA PÁGINA + STATS */}
      {/* ============================================ */}
      <div
        className={tw`flex-shrink-0 border-b px-6 py-4`}
        style={{ backgroundColor: c.headerBg, borderColor: c.border }}
      >
        <div className={tw`flex items-center justify-between`}>
          <div className={tw`flex items-center gap-4`}>
            <div
              className={tw`p-2 rounded-lg`}
              style={{ backgroundColor: c.sectionBg }}
            >
              <Icons.ChartBar className={tw`w-6 h-6`} style={{ color: c.accent }} />
            </div>
            <div>
              <h2 className={tw`text-xl font-bold`} style={{ color: c.textPrimary }}>
                Dashboard
              </h2>
              <p className={tw`text-sm`} style={{ color: c.textMuted }}>
                Bem-vindo, {user?.name || 'Usuário'}
              </p>
            </div>
          </div>

          {/* Stats rápidos */}
          {!loading && escolas.length > 0 && (
            <div className={tw`flex items-center gap-6`}>
              <div className={tw`text-center`}>
                <p className={tw`text-2xl font-bold`} style={{ color: c.textPrimary }}>{escolas.length}</p>
                <p className={tw`text-xs`} style={{ color: c.textMuted }}>Escolas</p>
              </div>
              <div className={tw`text-center`}>
                <p className={tw`text-2xl font-bold`} style={{ color: c.accent }}>{totalPedidos}</p>
                <p className={tw`text-xs`} style={{ color: c.textMuted }}>Total Pedidos</p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* ============================================ */}
      {/* CONTEÚDO PRINCIPAL */}
      {/* ============================================ */}
      <main className={tw`flex-1 overflow-auto px-6 py-6`}>
        {/* Seção Título */}
        <div className={tw`mb-6 flex items-center justify-between`}>
          <div>
            <h3 className={tw`text-lg font-semibold mb-1`} style={{ color: c.textPrimary }}>Escolas Disponíveis</h3>
            <p className={tw`text-sm`} style={{ color: c.textMuted }}>Clique em uma escola para ver os detalhes dos pedidos</p>
          </div>
          <button
            onClick={handleRefresh}
            disabled={loading || refreshing}
            className={tw`flex items-center gap-2 px-4 py-2 rounded-lg font-medium text-sm border transition-all active:scale-[0.97] disabled:opacity-50`}
            style={{ borderColor: c.border, color: c.accent, backgroundColor: c.cardBg }}
            title="Recarregar dados"
          >
            <Icons.Refresh
              className={tw`w-4 h-4 ${refreshing ? 'animate-spin' : ''}`}
              style={{ color: c.accent }}
            />
            Recarregar
          </button>
        </div>

        {/* Loading State */}
        {loading && (
          <div className={tw`flex flex-col items-center justify-center py-20`}>
            <Icons.Spinner className={tw`w-10 h-10 animate-spin mb-4`} style={{ color: c.accent }} />
            <p className={tw`text-sm font-medium`} style={{ color: c.textMuted }}>Carregando escolas...</p>
          </div>
        )}

        {/* Error State */}
        {error && (
          <div
            className={tw`flex items-center gap-3 px-4 py-3 rounded-lg mb-6`}
            style={{ backgroundColor: c.errorBg, border: `1px solid ${c.errorBorder}` }}
          >
            <Icons.ExclamationCircle className={tw`w-5 h-5 flex-shrink-0`} style={{ color: c.errorText }} />
            <p className={tw`text-sm`} style={{ color: c.errorText }}>{error}</p>
          </div>
        )}

        {/* Grid de Escolas */}
        {!loading && !error && escolas.length > 0 && (
          <div className={tw`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4`}>
            {escolas.map((escola) => (
              <div
                key={escola.escola_id}
                onClick={() => handleEscolaClick(escola)}
                className={tw`rounded-lg border cursor-pointer transition-all hover:shadow-lg hover:scale-[1.02] active:scale-[0.98]`}
                style={{
                  backgroundColor: c.cardBg,
                  borderColor: c.border
                }}
              >
                {/* Card Header */}
                <div
                  className={tw`px-5 py-4 border-b flex items-start justify-between`}
                  style={{ borderColor: c.borderLight }}
                >
                  <div className={tw`flex items-start gap-3 flex-1`}>
                    <div
                      className={tw`p-2.5 rounded-lg flex-shrink-0`}
                      style={{ backgroundColor: c.accentBg }}
                    >
                      <Icons.Building className={tw`w-5 h-5`} style={{ color: c.accent }} />
                    </div>
                    <div className={tw`flex-1 min-w-0`}>
                      <h3 className={tw`font-semibold text-base mb-1 truncate`} style={{ color: c.textPrimary }}>
                        {escola.nome_escola}
                      </h3>
                      {escola.codigo_escola && (
                        <p className={tw`text-xs`} style={{ color: c.textSubtle }}>
                          Código: {escola.codigo_escola}
                        </p>
                      )}
                    </div>
                  </div>
                </div>

                {/* Card Body */}
                <div className={tw`px-5 py-4`}>
                  <div className={tw`flex items-center justify-between`}>
                    <span className={tw`text-sm font-medium`} style={{ color: c.textMuted }}>Total de pedidos</span>
                    <span className={tw`text-2xl font-bold`} style={{ color: c.accent }}>
                      {escola.total_pedidos}
                    </span>
                  </div>
                </div>

                {/* Card Footer */}
                <div
                  className={tw`px-5 py-3 flex items-center justify-end border-t`}
                  style={{ backgroundColor: c.sectionBg, borderColor: c.border }}
                >
                  <span
                    className={tw`text-xs font-medium flex items-center gap-1`}
                    style={{ color: c.accent }}
                  >
                    Ver detalhes
                    <Icons.ChevronRight className={tw`w-3 h-3`} />
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Empty State */}
        {!loading && !error && escolas.length === 0 && (
          <div className={tw`flex flex-col items-center justify-center py-20`}>
            <div
              className={tw`w-20 h-20 rounded-full flex items-center justify-center mb-6`}
              style={{ backgroundColor: c.sectionBg }}
            >
              <Icons.Building className={tw`w-10 h-10`} style={{ color: c.emptyIcon }} />
            </div>
            <h3 className={tw`text-lg font-semibold mb-2`} style={{ color: c.textSecondary }}>
              Nenhuma escola encontrada
            </h3>
            <p className={tw`text-sm text-center max-w-md`} style={{ color: c.textMuted }}>
              Não há escolas cadastradas no sistema no momento.
            </p>
          </div>
        )}
      </main>
    </div>
  )
}
