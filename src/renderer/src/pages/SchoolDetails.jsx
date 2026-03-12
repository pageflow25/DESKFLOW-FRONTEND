import { useState, useEffect } from 'react'
import { useParams, useNavigate, useLocation } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import { useTheme } from '../contexts/ThemeContext'
import { pedidoService, orcamentoService, parseApiError } from '../services/api'
import { tw } from '@twind/core'
import TreeGrid from '../components/TreeGrid'
import ToggleGerarOP from '../components/ToggleGerarOP'

// ============================================
// ÍCONES SVG
// ============================================
const Icons = {
  ArrowLeft: ({ className, style }) => (
    <svg className={className} style={style} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
    </svg>
  ),
  Home: ({ className, style }) => (
    <svg className={className} style={style} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 12l8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25" />
    </svg>
  ),
  School: ({ className, style }) => (
    <svg className={className} style={style} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M4.26 10.147a60.436 60.436 0 00-.491 6.347A48.627 48.627 0 0112 20.904a48.627 48.627 0 018.232-4.41 60.46 60.46 0 00-.491-6.347m-15.482 0a50.57 50.57 0 00-2.658-.813A59.905 59.905 0 0112 3.493a59.902 59.902 0 0110.399 5.84c-.896.248-1.783.52-2.658.814m-15.482 0A50.697 50.697 0 0112 13.489a50.702 50.702 0 017.74-3.342M6.75 15a.75.75 0 100-1.5.75.75 0 000 1.5zm0 0v-3.675A55.378 55.378 0 0112 8.443m-7.007 11.55A5.981 5.981 0 006.75 15.75v-1.5" />
    </svg>
  ),
  DocumentCheck: ({ className, style }) => (
    <svg className={className} style={style} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M10.125 2.25h-4.5c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125v-12M10.125 2.25h.375a9 9 0 019 9v.375M10.125 2.25A3.375 3.375 0 0113.5 5.625v1.5c0 .621.504 1.125 1.125 1.125h1.5a3.375 3.375 0 013.375 3.375M9 15l2.25 2.25L15 12" />
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
  CheckCircle: ({ className, style }) => (
    <svg className={className} style={style} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  ),
  ExclamationCircle: ({ className, style }) => (
    <svg className={className} style={style} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z" />
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

const formatDatePtBr = (isoDate) => {
  if (!isoDate || typeof isoDate !== 'string') return isoDate
  const [year, month, day] = isoDate.slice(0, 10).split('-')
  if (!year || !month || !day) return isoDate
  return `${day}/${month}/${year}`
}

// ============================================
// COMPONENTE PRINCIPAL
// ============================================
export default function SchoolDetails() {
  const { escolaId } = useParams()
  const navigate = useNavigate()
  const location = useLocation()
  const { logout, user } = useAuth()
  const { isDark, toggleTheme, colors: c } = useTheme()
  const nomeEscola = location.state?.nomeEscola || 'MEMOREX'

  const [divisoes, setDivisoes] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [selectedItems, setSelectedItems] = useState(new Set())
  const [generatingBudget, setGeneratingBudget] = useState(false)
  const [successMessage, setSuccessMessage] = useState('')
  const [showDateModal, setShowDateModal] = useState(false)
  const [dataEntrega, setDataEntrega] = useState('')
  const [modoAgrupamento, setModoAgrupamento] = useState('unidade')
  const [gerarOp, setGerarOp] = useState(true)
  const [baixarArquivos, setBaixarArquivos] = useState(true)
  const [refreshing, setRefreshing] = useState(false)
  const [idsFormularios, setIdsFormularios] = useState('')
  const [statusIds, setStatusIds] = useState('1')

  useEffect(() => {
    loadPedidos()
  }, [escolaId])

  const loadPedidos = async () => {
    try {
      setLoading(true)
      setError('')
      // Parsear ids_formularios se fornecidos
      const parsedIds = idsFormularios
        ? idsFormularios.split(',').map(s => parseInt(s.trim())).filter(n => !isNaN(n))
        : null
      // Parsear status_ids se fornecidos
      const parsedStatusIds = statusIds
        ? statusIds.split(',').map(s => parseInt(s.trim())).filter(n => !isNaN(n))
        : null
      const data = await pedidoService.getPedidosEscolaCascata(parseInt(escolaId), nomeEscola.toUpperCase(), parsedIds, parsedStatusIds)
      setDivisoes(data.dashboard_completo || [])
    } catch (err) {
      console.error('Erro ao carregar pedidos:', err)
      setError(err.response?.data?.detail || 'Erro ao carregar pedidos')
    } finally {
      setLoading(false)
      setRefreshing(false)
    }
  }

  const handleRefresh = () => {
    setRefreshing(true)
    loadPedidos()
  }

  const handleSelectionChange = (selection) => {
    setSelectedItems(selection)
  }

  const extrairDadosSelecao = () => {
    const idsProdutos = new Set()
    const datasSaida = new Set()
    const divisoesLogistica = new Set()
    const diasUteis = new Set()

    selectedItems.forEach(nodeId => {
      const parts = nodeId.split('-')

      if (parts.includes('produto')) {
        const divIndex = parseInt(parts[1])
        const produtoIndex = parseInt(parts[3])

        if (divisoes[divIndex] && divisoes[divIndex].produtos[produtoIndex]) {
          const produto = divisoes[divIndex].produtos[produtoIndex]
          const divisao = divisoes[divIndex]

          if (divisao.divisao_logistica) {
            divisoesLogistica.add(divisao.divisao_logistica)
          }

          if (divisao.dias_uteis && divisao.dias_uteis !== 'Sem dias uteis') {
            const diasUteisNum = parseInt(divisao.dias_uteis)
            if (!isNaN(diasUteisNum)) {
              diasUteis.add(diasUteisNum)
            }
          }

          idsProdutos.add(produto.id_produto)

          if (parts.includes('data')) {
            const dataIndex = parseInt(parts[5])
            if (produto.datas[dataIndex] && produto.datas[dataIndex].data_saida !== 'Sem data saida') {
              datasSaida.add(produto.datas[dataIndex].data_saida)
            }
          }
        }
      }
    })

    return {
      idsProdutos: Array.from(idsProdutos),
      datasSaida: Array.from(datasSaida).sort(),
      divisoesLogistica: Array.from(divisoesLogistica),
      diasUteis: Array.from(diasUteis)
    }
  }

  const handleGenerateBudget = async () => {
    if (selectedItems.size === 0) return

    try {
      setGeneratingBudget(true)
      setSuccessMessage('')
      const dadosSelecao = extrairDadosSelecao()

      // Formatar data de entrega para ISO se fornecida
      const dataEntregaFormatada = dataEntrega
        ? `${dataEntrega}T12:00:00.000-03:00`
        : null

      // Parsear ids_formularios se fornecidos
      const parsedIdsFormularios = idsFormularios
        ? idsFormularios.split(',').map(s => parseInt(s.trim())).filter(n => !isNaN(n))
        : null

      // Parsear status_ids se fornecidos
      const parsedStatusIds = statusIds
        ? statusIds.split(',').map(s => parseInt(s.trim())).filter(n => !isNaN(n))
        : null

      const result = await orcamentoService.gerarOrcamento(
        parseInt(escolaId),
        dadosSelecao.idsProdutos,
        dadosSelecao.datasSaida,
        dadosSelecao.divisoesLogistica.length > 0 ? dadosSelecao.divisoesLogistica : null,
        dadosSelecao.diasUteis.length > 0 ? dadosSelecao.diasUteis : null,
        dataEntregaFormatada,
        modoAgrupamento,
        gerarOp,
        parsedIdsFormularios,
        parsedStatusIds,
        baixarArquivos
      )

      setSuccessMessage(`Orçamento gerado com sucesso! ${result.total_unidades} unidade(s) — Modo: ${modoAgrupamento === 'escola' ? 'Agrupado por Escola' : 'Por Unidade'}${result.grupo_lote_id ? ` — Lote #${result.grupo_lote_id}` : ''}`)
      setTimeout(() => setSuccessMessage(''), 5000)

      // Recarregar dados da página após processamento
      await loadPedidos()

    } catch (err) {
      console.error('Erro ao gerar orçamento:', err)
      const parsedError = parseApiError(err, 'Erro ao gerar orçamento')

      const prefixMap = {
        validation: 'Erro de validação no envio',
        communication: 'Falha de comunicação com a integração',
        server: 'Erro interno no servidor',
        unknown: 'Erro no processamento do envio'
      }

      const prefix = prefixMap[parsedError.type] || prefixMap.unknown
      const statusText = parsedError.statusCode ? ` (HTTP ${parsedError.statusCode})` : ''
      const detail = parsedError.detail && parsedError.detail !== parsedError.message
        ? ` | Detalhe: ${parsedError.detail}`
        : ''

      setError(`${prefix}${statusText}: ${parsedError.message}${detail}`)
    } finally {
      setGeneratingBudget(false)
      setShowDateModal(false)
      setDataEntrega('')
      setModoAgrupamento('unidade')
      setGerarOp(true)
      setBaixarArquivos(true)
    }
  }

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  // Calcular totais
  const totalDivisoes = divisoes.length
  const totalProdutos = divisoes.reduce((acc, d) => acc + (d.produtos?.length || 0), 0)
  const totalQuantidade = divisoes.reduce((acc, d) => acc + (d.quantidade_total || 0), 0)
  const dadosSelecaoAtual = extrairDadosSelecao()
  const datasSelecionadasFormatadas = dadosSelecaoAtual.datasSaida.map(formatDatePtBr)
  const temMultiplasDatasSelecionadas = dadosSelecaoAtual.datasSaida.length > 1

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
              <p className={tw`text-xs`} style={{ color: c.textSecondary }}>Sistema de Gestão de Pedidos</p>
            </div>
          </div>

          {/* User Info + Theme Toggle + Logout */}
          <div className={tw`flex items-center gap-4`}>
            <div className={tw`text-right`}>
              <p className={tw`text-sm font-medium`} style={{ color: c.textPrimary }}>{user?.name || 'Usuário'}</p>
              <p className={tw`text-xs`} style={{ color: c.textMuted }}>Logado</p>
            </div>
            <button
              onClick={toggleTheme}
              className={tw`p-2 rounded-lg transition-colors`}
              style={{ color: c.textSecondary }}
              title={isDark ? 'Modo claro' : 'Modo escuro'}
            >
              {isDark
                ? <Icons.Sun className={tw`w-5 h-5`} />
                : <Icons.Moon className={tw`w-5 h-5`} />
              }
            </button>
            <button
              onClick={handleLogout}
              className={tw`p-2 rounded-lg transition-colors`}
              title="Sair"
            >
              <Icons.Logout className={tw`w-5 h-5`} style={{ color: c.textSecondary }} />
            </button>
          </div>
        </div>
      </header>

      {/* ============================================ */}
      {/* BREADCRUMB + TÍTULO DA PÁGINA */}
      {/* ============================================ */}
      <div
        className={tw`flex-shrink-0 border-b px-6 py-4`}
        style={{ backgroundColor: c.cardBg, borderColor: c.border }}
      >
        {/* Breadcrumb */}
        <div className={tw`flex items-center gap-2 text-sm mb-3`}>
          <button
            onClick={() => navigate('/dashboard')}
            className={tw`flex items-center gap-1 hover:underline`}
            style={{ color: c.accent }}
          >
            <Icons.Home className={tw`w-4 h-4`} />
            Dashboard
          </button>
          <span style={{ color: c.border }}>/</span>
          <span style={{ color: c.textSecondary }}>Escola #{escolaId}</span>
        </div>

        {/* Título + Ações */}
        <div className={tw`flex items-center justify-between`}>
          <div className={tw`flex items-center gap-4`}>
            <button
              onClick={() => navigate('/dashboard')}
              className={tw`p-2 rounded-lg border transition-colors`}
              style={{ borderColor: c.border }}
              title="Voltar"
            >
              <Icons.ArrowLeft className={tw`w-5 h-5`} style={{ color: c.textSecondary }} />
            </button>
            <div>
              <h2 className={tw`text-xl font-bold`} style={{ color: c.textPrimary }}>
                Detalhes da Escola
              </h2>
              <p className={tw`text-sm`} style={{ color: c.textSecondary }}>
                Selecione os itens para gerar orçamento
              </p>
            </div>
          </div>

          {/* Stats rápidos */}
          {!loading && divisoes.length > 0 && (
            <div className={tw`flex items-center gap-6`}>
              <div className={tw`text-center`}>
                <p className={tw`text-2xl font-bold`} style={{ color: c.textPrimary }}>{totalDivisoes}</p>
                <p className={tw`text-xs`} style={{ color: c.textSecondary }}>Divisões</p>
              </div>
              <div className={tw`text-center`}>
                <p className={tw`text-2xl font-bold`} style={{ color: c.textPrimary }}>{totalProdutos}</p>
                <p className={tw`text-xs`} style={{ color: c.textSecondary }}>Produtos</p>
              </div>
              <div className={tw`text-center`}>
                <p className={tw`text-2xl font-bold`} style={{ color: c.accent }}>{totalQuantidade}</p>
                <p className={tw`text-xs`} style={{ color: c.textSecondary }}>Total Qtd</p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* ============================================ */}
      {/* BARRA DE AÇÕES */}
      {/* ============================================ */}
      {!loading && divisoes.length > 0 && (
        <div
          className={tw`flex-shrink-0 px-6 py-3 flex items-center justify-between border-b`}
          style={{ backgroundColor: c.sectionBg, borderColor: c.border }}
        >
          {/* Contador de seleção + Filtro de Formulários */}
          <div className={tw`flex items-center gap-3`}>
            <div
              className={tw`px-3 py-1.5 rounded-full text-sm font-medium`}
              style={{
                backgroundColor: selectedItems.size > 0 ? c.accentBg : c.sectionBg,
                color: selectedItems.size > 0 ? c.accentText : c.textSecondary
              }}
            >
              {selectedItems.size} {selectedItems.size === 1 ? 'item selecionado' : 'itens selecionados'}
            </div>

            {/* Filtro por IDs de Formulários */}
            <div className={tw`flex items-center gap-2`}>
              <input
                type="text"
                value={idsFormularios}
                onChange={e => setIdsFormularios(e.target.value)}
                placeholder="Filtrar por IDs formulários (ex: 1,2,3)"
                className={tw`px-3 py-1.5 rounded-lg border text-sm outline-none transition-colors`}
                style={{
                  borderColor: idsFormularios ? c.accent : c.border,
                  color: c.textPrimary,
                  width: '280px',
                  backgroundColor: idsFormularios ? c.accentBg : c.inputBg
                }}
                onFocus={e => e.target.style.borderColor = c.accent}
                onBlur={e => e.target.style.borderColor = idsFormularios ? c.accent : c.border}
                disabled={generatingBudget}
              />
              {idsFormularios && (
                <button
                  onClick={() => { setIdsFormularios(''); setTimeout(() => loadPedidos(), 100) }}
                  className={tw`px-2 py-1.5 rounded-lg text-xs font-medium border transition-colors`}
                  style={{ borderColor: c.errorBorder, color: c.errorText }}
                  title="Limpar filtro"
                >
                  ✕
                </button>
              )}
            </div>

            {/* Filtro por Status IDs */}
            <div className={tw`flex items-center gap-2`}>
              <input
                type="text"
                value={statusIds}
                onChange={e => setStatusIds(e.target.value)}
                placeholder="Status IDs (ex: 1,2,3)"
                className={tw`px-3 py-1.5 rounded-lg border text-sm outline-none transition-colors`}
                style={{
                  borderColor: statusIds && statusIds !== '1' ? c.warningText : c.border,
                  color: c.textPrimary,
                  width: '180px',
                  backgroundColor: statusIds && statusIds !== '1' ? c.warningBg : c.inputBg
                }}
                onFocus={e => e.target.style.borderColor = c.warningText}
                onBlur={e => e.target.style.borderColor = statusIds && statusIds !== '1' ? c.warningText : c.border}
                disabled={generatingBudget}
              />
              {statusIds && statusIds !== '1' && (
                <button
                  onClick={() => { setStatusIds('1'); setTimeout(() => loadPedidos(), 100) }}
                  className={tw`px-2 py-1.5 rounded-lg text-xs font-medium border transition-colors`}
                  style={{ borderColor: c.errorBorder, color: c.errorText }}
                  title="Restaurar padrão (1)"
                >
                  ✕
                </button>
              )}
              <button
                onClick={() => loadPedidos()}
                disabled={loading || generatingBudget}
                className={tw`px-3 py-1.5 rounded-lg text-sm font-medium border transition-colors disabled:opacity-50`}
                style={{ borderColor: c.accent, color: c.accentText, backgroundColor: c.accentBg }}
                title="Aplicar filtro"
              >
                Filtrar
              </button>
            </div>
          </div>

          <div className={tw`flex items-center gap-3`}>
            {/* Botão Recarregar */}
            <button
              onClick={handleRefresh}
              disabled={loading || refreshing || generatingBudget}
              className={tw`flex items-center gap-2 px-4 py-2.5 rounded-lg font-medium text-sm border transition-all active:scale-[0.97] disabled:opacity-50`}
              style={{ borderColor: c.border, color: c.accent, backgroundColor: c.cardBg }}
              title="Recarregar dados"
            >
              <Icons.Refresh
                className={tw`w-4 h-4 ${refreshing ? 'animate-spin' : ''}`}
                style={{ color: c.accent }}
              />
              Recarregar
            </button>

            {/* Botão de Ação Principal */}
            <button
              onClick={() => setShowDateModal(true)}
              disabled={selectedItems.size === 0 || generatingBudget}
              className={tw`flex items-center gap-2 px-5 py-2.5 rounded-lg font-medium text-sm transition-all ${selectedItems.size === 0 || generatingBudget
                ? 'cursor-not-allowed'
                : 'hover:shadow-md active:scale-[0.98]'
                }`}
              style={{
                backgroundColor: selectedItems.size === 0 ? c.disabledBg : c.successBg2,
                color: selectedItems.size === 0 ? c.disabledText : '#ffffff'
              }}
            >
              {generatingBudget ? (
                <>
                  <Icons.Spinner className={tw`w-4 h-4 animate-spin`} />
                  Gerando...
                </>
              ) : (
                <>
                  <Icons.DocumentCheck className={tw`w-4 h-4`} />
                  Gerar Orçamento
                </>
              )}
            </button>
          </div>
        </div>
      )}

      {!loading && divisoes.length > 0 && dadosSelecaoAtual.datasSaida.length > 0 && (
        <div
          className={tw`flex-shrink-0 px-6 py-3 border-b`}
          style={{ backgroundColor: temMultiplasDatasSelecionadas ? c.warningBg : c.cardBg, borderColor: c.border }}
        >
          <p className={tw`text-sm font-medium`} style={{ color: temMultiplasDatasSelecionadas ? c.warningText : c.textPrimary }}>
            {temMultiplasDatasSelecionadas
              ? `Atenção: você selecionou ${dadosSelecaoAtual.datasSaida.length} datas de saída.`
              : 'Você selecionou 1 data de saída.'}
          </p>
          <p className={tw`text-xs mt-1`} style={{ color: c.textSecondary }}>
            Datas: {datasSelecionadasFormatadas.join(', ')}
          </p>
        </div>
      )}

      {/* ============================================ */}
      {/* MENSAGENS DE FEEDBACK */}
      {/* ============================================ */}
      {(error || successMessage) && (
        <div className={tw`flex-shrink-0 px-6 py-3`}>
          {error && (
            <div
              className={tw`flex items-center gap-3 px-4 py-3 rounded-lg`}
              style={{ backgroundColor: c.errorBg, border: `1px solid ${c.errorBorder}` }}
            >
              <Icons.ExclamationCircle className={tw`w-5 h-5 flex-shrink-0`} style={{ color: c.errorText }} />
              <p className={tw`text-sm`} style={{ color: c.errorText }}>{error}</p>
            </div>
          )}
          {successMessage && (
            <div
              className={tw`flex items-center gap-3 px-4 py-3 rounded-lg`}
              style={{ backgroundColor: c.successBg, border: `1px solid ${c.successBorder}` }}
            >
              <Icons.CheckCircle className={tw`w-5 h-5 flex-shrink-0`} style={{ color: c.successText }} />
              <p className={tw`text-sm font-medium`} style={{ color: c.successText }}>{successMessage}</p>
            </div>
          )}
        </div>
      )}

      {/* ============================================ */}
      {/* CONTEÚDO PRINCIPAL */}
      {/* ============================================ */}
      <main className={tw`flex-1 overflow-auto px-6 py-4`}>
        {/* Loading State */}
        {loading && (
          <div className={tw`flex flex-col items-center justify-center h-full`}>
            <Icons.Spinner className={tw`w-10 h-10 animate-spin mb-4`} style={{ color: c.accent }} />
            <p className={tw`text-sm font-medium`} style={{ color: c.textSecondary }}>Carregando pedidos...</p>
          </div>
        )}

        {/* Empty State */}
        {!loading && !error && divisoes.length === 0 && (
          <div className={tw`flex flex-col items-center justify-center h-full`}>
            <div
              className={tw`w-20 h-20 rounded-full flex items-center justify-center mb-6`}
              style={{ backgroundColor: c.sectionBg }}
            >
              <Icons.School className={tw`w-10 h-10`} style={{ color: c.emptyIcon }} />
            </div>
            <h3 className={tw`text-lg font-semibold mb-2`} style={{ color: c.textPrimary }}>
              Nenhum pedido encontrado
            </h3>
            <p className={tw`text-sm mb-6 text-center max-w-md`} style={{ color: c.textSecondary }}>
              Esta escola não possui pedidos do tipo “Elite” cadastrados no sistema.
            </p>
            <button
              onClick={() => navigate('/dashboard')}
              className={tw`flex items-center gap-2 px-4 py-2 rounded-lg font-medium text-sm`}
              style={{ backgroundColor: c.accent, color: '#ffffff' }}
            >
              <Icons.ArrowLeft className={tw`w-4 h-4`} />
              Voltar ao Dashboard
            </button>
          </div>
        )}

        {/* Tree Grid */}
        {!loading && divisoes.length > 0 && (
          <TreeGrid
            data={divisoes}
            onSelectionChange={handleSelectionChange}
          />
        )}
      </main>

      {/* ============================================ */}
      {/* MODAL DATA DE SAÍDA */}
      {/* ============================================ */}
      {
        showDateModal && (
          <div
            className={tw`fixed inset-0 z-50 flex items-center justify-center`}
            style={{ backgroundColor: c.modalOverlay }}
            onClick={() => !generatingBudget && setShowDateModal(false)}
          >
            <div
              className={tw`rounded-xl shadow-2xl p-6 w-full max-w-md mx-4`}
              style={{ backgroundColor: c.modalBg }}
              onClick={e => e.stopPropagation()}
            >
              {/* Header */}
              <div className={tw`flex items-center gap-3 mb-5`}>
                <div
                  className={tw`w-10 h-10 rounded-lg flex items-center justify-center`}
                  style={{ backgroundColor: c.accentBg }}
                >
                  <Icons.DocumentCheck className={tw`w-5 h-5`} style={{ color: c.accent }} />
                </div>
                <div>
                  <h3 className={tw`text-lg font-bold`} style={{ color: c.textPrimary }}>Gerar Orçamento</h3>
                  <p className={tw`text-sm`} style={{ color: c.textSecondary }}>Defina a data de saída do pedido</p>
                </div>
              </div>

              {/* Campo de Data */}
              <div className={tw`mb-6`}>
                <label className={tw`block text-sm font-medium mb-2`} style={{ color: c.textPrimary }}>
                  Data de Saída
                </label>
                <input
                  type="date"
                  value={dataEntrega}
                  onChange={e => setDataEntrega(e.target.value)}
                  className={tw`w-full px-4 py-3 rounded-lg border text-sm outline-none transition-colors`}
                  style={{
                    borderColor: c.border,
                    color: c.textPrimary,
                    backgroundColor: c.inputBg
                  }}
                  onFocus={e => e.target.style.borderColor = c.accent}
                  onBlur={e => e.target.style.borderColor = c.border}
                  min={new Date().toISOString().split('T')[0]}
                  disabled={generatingBudget}
                />
                <p className={tw`mt-1.5 text-xs`} style={{ color: c.textMuted }}>
                  Se não informada, será usada a data de hoje + 7 dias
                </p>
              </div>

              {/* Modo de Agrupamento */}
              <div className={tw`mb-6`}>
                <label className={tw`block text-sm font-medium mb-2`} style={{ color: c.textPrimary }}>
                  Modo de Agrupamento
                </label>
                <div className={tw`flex gap-3`}>
                  <button
                    type="button"
                    onClick={() => setModoAgrupamento('unidade')}
                    disabled={generatingBudget}
                    className={tw`flex-1 px-4 py-3 rounded-lg border text-sm font-medium transition-all`}
                    style={{
                      borderColor: modoAgrupamento === 'unidade' ? c.accent : c.border,
                      backgroundColor: modoAgrupamento === 'unidade' ? c.accentBg : c.inputBg,
                      color: modoAgrupamento === 'unidade' ? c.accentText : c.textSecondary,
                      boxShadow: modoAgrupamento === 'unidade' ? `0 0 0 1px ${c.accent}` : 'none'
                    }}
                  >
                    <div className={tw`font-semibold mb-1`}>Por Unidade</div>
                    <div className={tw`text-xs`} style={{ color: c.textMuted }}>
                      1 orçamento por unidade escolar
                    </div>
                  </button>
                  <button
                    type="button"
                    onClick={() => setModoAgrupamento('escola')}
                    disabled={generatingBudget}
                    className={tw`flex-1 px-4 py-3 rounded-lg border text-sm font-medium transition-all`}
                    style={{
                      borderColor: modoAgrupamento === 'escola' ? c.accent : c.border,
                      backgroundColor: modoAgrupamento === 'escola' ? c.accentBg : c.inputBg,
                      color: modoAgrupamento === 'escola' ? c.accentText : c.textSecondary,
                      boxShadow: modoAgrupamento === 'escola' ? `0 0 0 1px ${c.accent}` : 'none'
                    }}
                  >
                    <div className={tw`font-semibold mb-1`}>Por Escola</div>
                    <div className={tw`text-xs`} style={{ color: c.textMuted }}>
                      Agrupa e soma todas as unidades
                    </div>
                  </button>
                </div>
              </div>

              {/* Toggle Gerar OP */}
              <div
                className={tw`mb-4 px-4 py-3 rounded-lg`}
                style={{ backgroundColor: c.sectionBg, border: `1px solid ${c.border}` }}
              >
                <ToggleGerarOP
                  value={gerarOp}
                  onChange={setGerarOp}
                  disabled={generatingBudget}
                />
              </div>

              {/* Toggle Baixar Arquivos */}
              <div
                className={tw`mb-6 px-4 py-3 rounded-lg`}
                style={{ backgroundColor: c.sectionBg, border: `1px solid ${c.border}` }}
              >
                <div className={tw`flex items-center justify-between gap-3`}>
                  <div>
                    <p className={tw`text-sm font-semibold`} style={{ color: c.textPrimary }}>Baixar arquivos após aprovação</p>
                    <p className={tw`text-xs mt-0.5`} style={{ color: c.textMuted }}>
                      {baixarArquivos ? 'Fase 03 será executada — download dos PDFs gerados' : 'Fase 03 ignorada — apenas gera e aprova o orçamento'}
                    </p>
                  </div>
                  <button
                    type="button"
                    disabled={generatingBudget}
                    onClick={() => setBaixarArquivos(v => !v)}
                    className={tw`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none disabled:opacity-50`}
                    style={{ backgroundColor: baixarArquivos ? c.accent : c.border }}
                    aria-pressed={baixarArquivos}
                  >
                    <span
                      className={tw`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out`}
                      style={{ transform: baixarArquivos ? 'translateX(20px)' : 'translateX(0px)' }}
                    />
                  </button>
                </div>
              </div>

              {/* Info da seleção */}
              <div
                className={tw`mb-6 px-4 py-3 rounded-lg`}
                style={{ backgroundColor: c.sectionBg, border: `1px solid ${c.border}` }}
              >
                <p className={tw`text-sm`} style={{ color: c.textSecondary }}>
                  <span className={tw`font-semibold`} style={{ color: c.textPrimary }}>{selectedItems.size}</span>
                  {' '}{selectedItems.size === 1 ? 'item selecionado' : 'itens selecionados'} para o orçamento
                </p>

                {dadosSelecaoAtual.datasSaida.length > 0 && (
                  <>
                    <p className={tw`text-sm mt-2`} style={{ color: temMultiplasDatasSelecionadas ? c.warningText : c.textPrimary }}>
                      {temMultiplasDatasSelecionadas
                        ? `⚠ ${dadosSelecaoAtual.datasSaida.length} datas selecionadas`
                        : '✓ 1 data selecionada'}
                    </p>
                    <p className={tw`text-xs mt-1`} style={{ color: c.textSecondary }}>
                      Datas selecionadas: {datasSelecionadasFormatadas.join(', ')}
                    </p>
                  </>
                )}
              </div>

              {/* Botões */}
              <div className={tw`flex gap-3`}>
                <button
                  onClick={() => { setShowDateModal(false); setDataEntrega(''); setModoAgrupamento('unidade'); setGerarOp(true); setBaixarArquivos(true) }}
                  disabled={generatingBudget}
                  className={tw`flex-1 px-4 py-2.5 rounded-lg font-medium text-sm border transition-colors`}
                  style={{ borderColor: c.border, color: c.textSecondary }}
                >
                  Cancelar
                </button>
                <button
                  onClick={handleGenerateBudget}
                  disabled={generatingBudget}
                  className={tw`flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg font-medium text-sm transition-all ${generatingBudget ? 'cursor-not-allowed' : 'hover:shadow-md active:scale-[0.98]'
                    }`}
                  style={{
                    backgroundColor: generatingBudget ? c.successBorder : c.successBg2,
                    color: '#ffffff'
                  }}
                >
                  {generatingBudget ? (
                    <>
                      <Icons.Spinner className={tw`w-4 h-4 animate-spin`} />
                      Processando...
                    </>
                  ) : (
                    <>
                      <Icons.DocumentCheck className={tw`w-4 h-4`} />
                      Confirmar e Gerar
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        )
      }
    </div >
  )
}
