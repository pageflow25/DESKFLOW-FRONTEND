import { useEffect, useState, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import { tw } from '@twind/core'
import { useAuth } from '../contexts/AuthContext'
import { useTheme } from '../contexts/ThemeContext'
import { orcamentoService, parseApiError } from '../services/api'

const PAGE_SIZE = 10

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
  Sun: ({ className, style }) => (
    <svg className={className} style={style} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v2.25m6.364.386l-1.591 1.591M21 12h-2.25m-.386 6.364l-1.591-1.591M12 18.75V21m-4.773-4.227l-1.591 1.591M5.25 12H3m4.227-4.773L5.636 5.636M15.75 12a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0z" />
    </svg>
  ),
  Moon: ({ className, style }) => (
    <svg className={className} style={style} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M21.752 15.002A9.718 9.718 0 0118 15.75c-5.385 0-9.75-4.365-9.75-9.75 0-1.33.266-2.597.748-3.752A9.753 9.753 0 003 11.25C3 16.635 7.365 21 12.75 21a9.753 9.753 0 009.002-5.998z" />
    </svg>
  ),
  ArrowLeft: ({ className, style }) => (
    <svg className={className} style={style} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
    </svg>
  ),
  Refresh: ({ className, style }) => (
    <svg className={className} style={style} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182m0-4.991v4.99" />
    </svg>
  ),
  ChevronDown: ({ className, style }) => (
    <svg className={className} style={style} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
    </svg>
  ),
  ChevronRight: ({ className, style }) => (
    <svg className={className} style={style} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
    </svg>
  ),
  ChevronLeft: ({ className, style }) => (
    <svg className={className} style={style} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
    </svg>
  ),
  ChevronDoubleLeft: ({ className, style }) => (
    <svg className={className} style={style} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M11 19l-7-7 7-7m8 14l-7-7 7-7" />
    </svg>
  ),
  ChevronDoubleRight: ({ className, style }) => (
    <svg className={className} style={style} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M13 5l7 7-7 7M5 5l7 7-7 7" />
    </svg>
  ),
  Clock: ({ className, style }) => (
    <svg className={className} style={style} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6l4 2m6-2a10 10 0 11-20 0 10 10 0 0120 0z" />
    </svg>
  )
}

const formatDateTime = (value) => {
  if (!value) return 'N/A'
  try {
    return new Date(value).toLocaleString('pt-BR')
  } catch {
    return value
  }
}

const getStatusVisual = (item) => {
  if (item.sucesso) return { label: 'Sucesso', tone: 'success' }
  if (item.status && item.status.includes('erro')) return { label: 'Erro', tone: 'error' }
  return { label: 'Pendente', tone: 'pending' }
}

export default function DisparoMonitor() {
  const [loading, setLoading] = useState(true)
  const [refreshing, setRefreshing] = useState(false)
  const [error, setError] = useState('')
  const [lotes, setLotes] = useState([])
  const [totalGeral, setTotalGeral] = useState(0)
  const [page, setPage] = useState(1)
  const [expanded, setExpanded] = useState(new Set())
  const { user, logout } = useAuth()
  const { isDark, toggleTheme, colors: c } = useTheme()
  const navigate = useNavigate()

  const totalPages = Math.max(1, Math.ceil(totalGeral / PAGE_SIZE))

  const loadLotes = useCallback(async (targetPage) => {
    try {
      setLoading(true)
      setError('')
      const offset = (targetPage - 1) * PAGE_SIZE
      const data = await orcamentoService.getLotesDisparo(PAGE_SIZE, offset)
      setLotes(data?.lotes || [])
      setTotalGeral(data?.total_geral ?? data?.total_lotes ?? 0)
      setExpanded(new Set())
    } catch (err) {
      const parsed = parseApiError(err, 'Erro ao carregar acompanhamento de disparos')
      setError(parsed.message)
    } finally {
      setLoading(false)
      setRefreshing(false)
    }
  }, [])

  useEffect(() => {
    loadLotes(page)
  }, [page])

  const handleRefresh = () => {
    setRefreshing(true)
    loadLotes(page)
  }

  const goToPage = (p) => {
    const clamped = Math.max(1, Math.min(p, totalPages))
    if (clamped !== page) {
      setPage(clamped)
    } else {
      loadLotes(clamped)
    }
  }

  const toggleExpanded = (loteId) => {
    setExpanded((prev) => {
      const next = new Set(prev)
      if (next.has(loteId)) {
        next.delete(loteId)
      } else {
        next.add(loteId)
      }
      return next
    })
  }

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  return (
    <div className={tw`h-screen flex flex-col`} style={{ backgroundColor: c.pageBg }}>
      <header
        className={tw`flex-shrink-0 sticky top-0 z-40 border-b`}
        style={{ backgroundColor: c.headerBg, borderColor: c.border }}
      >
        <div className={tw`flex items-center justify-between px-6 py-3`}>
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
                : <Icons.Moon className={tw`w-5 h-5`} style={{ color: c.textMuted }} />}
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

      <header className={tw`flex-shrink-0 sticky top-[65px] z-30 border-b px-6 py-4`} style={{ backgroundColor: c.headerBg, borderColor: c.border }}>
        <div className={tw`flex items-center justify-between`}>
          <div className={tw`flex items-center gap-3`}>
            <button
              onClick={() => navigate('/dashboard')}
              className={tw`p-2 rounded-lg border transition-colors`}
              style={{ borderColor: c.border }}
              title="Voltar"
            >
              <Icons.ArrowLeft className={tw`w-5 h-5`} style={{ color: c.textSecondary }} />
            </button>
            <div>
              <h2 className={tw`text-xl font-bold`} style={{ color: c.textPrimary }}>Acompanhamento de Disparos</h2>
              <p className={tw`text-sm`} style={{ color: c.textSecondary }}>
                Auditoria de envios agrupados por lote
                {totalGeral > 0 && (
                  <span className={tw`ml-2 font-medium`} style={{ color: c.accent }}>
                    {totalGeral} {totalGeral === 1 ? 'lote no total' : 'lotes no total'}
                  </span>
                )}
              </p>
            </div>
          </div>

          <button
            onClick={handleRefresh}
            disabled={loading || refreshing}
            className={tw`flex items-center gap-2 px-4 py-2 rounded-lg font-medium text-sm border disabled:opacity-50`}
            style={{ borderColor: c.border, color: c.accent, backgroundColor: c.cardBg }}
          >
            <Icons.Refresh className={tw`w-4 h-4 ${refreshing ? 'animate-spin' : ''}`} style={{ color: c.accent }} />
            Recarregar
          </button>
        </div>
      </header>

      <main className={tw`flex-1 overflow-auto px-6 py-6`}>
        {error && (
          <div className={tw`mb-4 px-4 py-3 rounded-lg`} style={{ backgroundColor: c.errorBg, border: `1px solid ${c.errorBorder}`, color: c.errorText }}>
            {error}
          </div>
        )}

        {loading && (
          <div className={tw`text-sm`} style={{ color: c.textSecondary }}>Carregando lotes...</div>
        )}

        {!loading && !error && lotes.length === 0 && (
          <div className={tw`text-sm`} style={{ color: c.textSecondary }}>Nenhum lote encontrado.</div>
        )}

        {!loading && lotes.length > 0 && (
          <div className={tw`space-y-3`}>
            {lotes.map((lote) => {
              const isExpanded = expanded.has(lote.grupo_lote_id)
              return (
                <div key={lote.grupo_lote_id} className={tw`border rounded-lg`} style={{ borderColor: c.border, backgroundColor: c.cardBg }}>
                  <button
                    type="button"
                    onClick={() => toggleExpanded(lote.grupo_lote_id)}
                    className={tw`w-full px-4 py-3 flex items-center justify-between text-left`}
                  >
                    <div className={tw`flex items-center gap-3`}>
                      {isExpanded
                        ? <Icons.ChevronDown className={tw`w-4 h-4`} style={{ color: c.textSecondary }} />
                        : <Icons.ChevronRight className={tw`w-4 h-4`} style={{ color: c.textSecondary }} />}
                      <div>
                        <div className={tw`font-semibold text-sm`} style={{ color: c.textPrimary }}>
                          Lote #{lote.grupo_lote_id}
                        </div>
                        <div className={tw`text-xs`} style={{ color: c.textSecondary }}>
                          Envio: {formatDateTime(lote.data_envio)}
                        </div>
                      </div>
                    </div>

                    <div className={tw`flex items-center gap-4 text-xs`} style={{ color: c.textSecondary }}>
                      <span>Total: <strong style={{ color: c.textPrimary }}>{lote.total_pedidos}</strong></span>
                      <span>Sucesso: <strong style={{ color: c.successText }}>{lote.total_sucesso}</strong></span>
                      <span>Erro: <strong style={{ color: c.errorText }}>{lote.total_erro}</strong></span>
                    </div>
                  </button>

                  {isExpanded && (
                    <div className={tw`border-t`} style={{ borderColor: c.border }}>
                      {lote.itens.map((item) => {
                        const statusVisual = getStatusVisual(item)
                        const toneColor = statusVisual.tone === 'success'
                          ? c.successText
                          : statusVisual.tone === 'error'
                            ? c.errorText
                            : c.textSecondary

                        return (
                          <div
                            key={`${lote.grupo_lote_id}-${item.distribuicao_material_id}`}
                            className={tw`px-4 py-3 border-b last:border-b-0`}
                            style={{ borderColor: c.borderLight }}
                          >
                            <div className={tw`flex items-start justify-between gap-4`}>
                              <div className={tw`flex-1 min-w-0`}>
                                {item.escola_nome && (
                                  <div className={tw`text-sm font-semibold truncate`} style={{ color: c.textPrimary }}>
                                    {item.escola_nome}
                                  </div>
                                )}
                                {item.unidade_nome && (
                                  <div className={tw`text-xs mt-0.5 truncate`} style={{ color: c.textSecondary }}>
                                    Unidade: {item.unidade_nome}
                                  </div>
                                )}
                                {item.material_descricao && (
                                  <div className={tw`text-xs mt-0.5 truncate`} style={{ color: c.textMuted }}>
                                    Material: {item.material_descricao}
                                  </div>
                                )}
                                {!item.escola_nome && (
                                  <div className={tw`text-sm`} style={{ color: c.textPrimary }}>
                                    Distribuição #{item.distribuicao_material_id}
                                  </div>
                                )}
                                {item.escola_nome && (
                                  <div className={tw`text-xs mt-0.5`} style={{ color: c.textMuted }}>
                                    Distribuição #{item.distribuicao_material_id}
                                  </div>
                                )}
                              </div>

                              <div className={tw`flex-shrink-0 text-right`}>
                                <div className={tw`text-xs font-semibold`} style={{ color: toneColor }}>
                                  {statusVisual.label}
                                </div>
                                <div className={tw`text-xs mt-0.5`} style={{ color: c.textMuted }}>
                                  {formatDateTime(item.data_evento)}
                                </div>
                              </div>
                            </div>

                            {item.mensagem && (
                              <div className={tw`mt-1.5 text-xs`} style={{ color: statusVisual.tone === 'error' ? c.errorText : c.textSecondary }}>
                                {item.mensagem}
                              </div>
                            )}

                            {Array.isArray(item.eventos) && item.eventos.length > 0 && (
                              <div className={tw`mt-3 pt-3 border-t`} style={{ borderColor: c.borderLight }}>
                                <div className={tw`flex items-center gap-1.5 mb-2`}>
                                  <Icons.Clock className={tw`w-3.5 h-3.5`} style={{ color: c.textMuted }} />
                                  <span className={tw`text-xs font-semibold`} style={{ color: c.textSecondary }}>
                                    Timeline do pedido
                                  </span>
                                </div>

                                <div className={tw`space-y-2`}>
                                  {item.eventos.map((evento, index) => {
                                    const eventoSucesso = !!evento.sucesso
                                    const pontoCor = eventoSucesso ? c.successText : c.errorText
                                    const textoCor = eventoSucesso ? c.textSecondary : c.errorText

                                    return (
                                      <div key={`${lote.grupo_lote_id}-${item.distribuicao_material_id}-evt-${index}`} className={tw`flex items-start gap-2`}>
                                        <div className={tw`mt-1.5 w-2 h-2 rounded-full flex-shrink-0`} style={{ backgroundColor: pontoCor }} />
                                        <div className={tw`min-w-0 flex-1`}>
                                          <p className={tw`text-xs font-medium`} style={{ color: c.textPrimary }}>
                                            {evento.status || 'status_desconhecido'}
                                          </p>
                                          <p className={tw`text-xs`} style={{ color: textoCor }}>
                                            {formatDateTime(evento.data_evento)}
                                            {evento.mensagem ? ` • ${evento.mensagem}` : ''}
                                          </p>
                                        </div>
                                      </div>
                                    )
                                  })}
                                </div>
                              </div>
                            )}
                          </div>
                        )
                      })}
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        )}
      </main>

      {!loading && totalGeral > 0 && (
        <footer className={tw`flex-shrink-0 border-t px-6 py-3`} style={{ backgroundColor: c.headerBg, borderColor: c.border }}>
          <div className={tw`flex items-center justify-between gap-4`}>
            <span className={tw`text-sm`} style={{ color: c.textSecondary }}>
              Página <strong style={{ color: c.textPrimary }}>{page}</strong> de <strong style={{ color: c.textPrimary }}>{totalPages}</strong>
              {' '}— mostrando <strong style={{ color: c.textPrimary }}>{lotes.length}</strong> de <strong style={{ color: c.textPrimary }}>{totalGeral}</strong> lotes
            </span>

            <div className={tw`flex items-center gap-1`}>
              <button
                onClick={() => goToPage(1)}
                disabled={page === 1 || loading}
                className={tw`p-1.5 rounded border disabled:opacity-40 transition-colors`}
                style={{ borderColor: c.border, color: c.textSecondary }}
                title="Primeira página"
              >
                <Icons.ChevronDoubleLeft className={tw`w-4 h-4`} />
              </button>
              <button
                onClick={() => goToPage(page - 1)}
                disabled={page === 1 || loading}
                className={tw`p-1.5 rounded border disabled:opacity-40 transition-colors`}
                style={{ borderColor: c.border, color: c.textSecondary }}
                title="Página anterior"
              >
                <Icons.ChevronLeft className={tw`w-4 h-4`} />
              </button>

              {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                let p
                if (totalPages <= 5) {
                  p = i + 1
                } else if (page <= 3) {
                  p = i + 1
                } else if (page >= totalPages - 2) {
                  p = totalPages - 4 + i
                } else {
                  p = page - 2 + i
                }
                return (
                  <button
                    key={p}
                    onClick={() => goToPage(p)}
                    disabled={loading}
                    className={tw`min-w-[32px] h-8 px-2 rounded border text-sm font-medium transition-colors`}
                    style={{
                      borderColor: p === page ? c.accent : c.border,
                      backgroundColor: p === page ? c.accentBg : 'transparent',
                      color: p === page ? c.accent : c.textSecondary,
                      boxShadow: p === page ? `0 0 0 1px ${c.accent}` : 'none'
                    }}
                  >
                    {p}
                  </button>
                )
              })}

              <button
                onClick={() => goToPage(page + 1)}
                disabled={page === totalPages || loading}
                className={tw`p-1.5 rounded border disabled:opacity-40 transition-colors`}
                style={{ borderColor: c.border, color: c.textSecondary }}
                title="Próxima página"
              >
                <Icons.ChevronRight className={tw`w-4 h-4`} />
              </button>
              <button
                onClick={() => goToPage(totalPages)}
                disabled={page === totalPages || loading}
                className={tw`p-1.5 rounded border disabled:opacity-40 transition-colors`}
                style={{ borderColor: c.border, color: c.textSecondary }}
                title="Última página"
              >
                <Icons.ChevronDoubleRight className={tw`w-4 h-4`} />
              </button>
            </div>
          </div>
        </footer>
      )}
    </div>
  )
}
