import { useState, useEffect } from 'react'
import { useParams, useNavigate, useLocation } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import { pedidoService, orcamentoService } from '../services/api'
import { tw } from '@twind/core'
import TreeGrid from '../components/TreeGrid'

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
  )
}

// ============================================
// COMPONENTE PRINCIPAL
// ============================================
export default function SchoolDetails() {
  const { escolaId } = useParams()
  const navigate = useNavigate()
  const location = useLocation()
  const { logout, user } = useAuth()
  const nomeEscola = location.state?.nomeEscola || 'MEMOREX'
  
  const [divisoes, setDivisoes] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [selectedItems, setSelectedItems] = useState(new Set())
  const [generatingBudget, setGeneratingBudget] = useState(false)
  const [successMessage, setSuccessMessage] = useState('')

  useEffect(() => {
    loadPedidos()
  }, [escolaId])

  const loadPedidos = async () => {
    try {
      setLoading(true)
      setError('')
      const data = await pedidoService.getPedidosEscolaCascata(parseInt(escolaId), nomeEscola.toUpperCase())
      setDivisoes(data.dashboard_completo || [])
    } catch (err) {
      console.error('Erro ao carregar pedidos:', err)
      setError(err.response?.data?.detail || 'Erro ao carregar pedidos')
    } finally {
      setLoading(false)
    }
  }

  const handleSelectionChange = (selection) => {
    setSelectedItems(selection)
  }

  const handleGenerateBudget = async () => {
    if (selectedItems.size === 0) return

    try {
      setGeneratingBudget(true)
      setSuccessMessage('')
      
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
            
            // Capturar divisão logística e dias úteis
            if (divisao.divisao_logistica && divisao.divisao_logistica !== 'Sem divisão') {
              divisoesLogistica.add(divisao.divisao_logistica)
            }
            if (divisao.dias_uteis && divisao.dias_uteis !== 'Sem dias uteis') {
              // Converter para número se possível
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
            } else {
              produto.datas.forEach(data => {
                if (data.data_saida !== 'Sem data saida') {
                  datasSaida.add(data.data_saida)
                }
              })
            }
          }
        }
      })
      
      const result = await orcamentoService.gerarOrcamento(
        parseInt(escolaId),
        Array.from(idsProdutos),
        Array.from(datasSaida),
        divisoesLogistica.size > 0 ? Array.from(divisoesLogistica) : null,
        diasUteis.size > 0 ? Array.from(diasUteis) : null
      )
      
      setSuccessMessage(`Orçamento gerado com sucesso! ${result.total_unidades} unidade(s)`)
      setTimeout(() => setSuccessMessage(''), 5000)
      
    } catch (err) {
      console.error('Erro ao gerar orçamento:', err)
      setError(err.response?.data?.detail || 'Erro ao gerar orçamento')
    } finally {
      setGeneratingBudget(false)
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

          {/* User Info + Logout */}
          <div className={tw`flex items-center gap-4`}>
            <div className={tw`text-right`}>
              <p className={tw`text-sm font-medium`} style={{ color: '#334155' }}>{user?.name || 'Usuário'}</p>
              <p className={tw`text-xs`} style={{ color: '#94a3b8' }}>Logado</p>
            </div>
            <button
              onClick={handleLogout}
              className={tw`p-2 rounded-lg hover:bg-gray-100 transition-colors`}
              title="Sair"
            >
              <Icons.Logout className={tw`w-5 h-5`} style={{ color: '#64748b' }} />
            </button>
          </div>
        </div>
      </header>

      {/* ============================================ */}
      {/* BREADCRUMB + TÍTULO DA PÁGINA */}
      {/* ============================================ */}
      <div 
        className={tw`flex-shrink-0 border-b px-6 py-4`}
        style={{ backgroundColor: '#ffffff', borderColor: '#e2e8f0' }}
      >
        {/* Breadcrumb */}
        <div className={tw`flex items-center gap-2 text-sm mb-3`}>
          <button 
            onClick={() => navigate('/dashboard')}
            className={tw`flex items-center gap-1 hover:underline`}
            style={{ color: '#3b82f6' }}
          >
            <Icons.Home className={tw`w-4 h-4`} />
            Dashboard
          </button>
          <span style={{ color: '#cbd5e1' }}>/</span>
          <span style={{ color: '#64748b' }}>Escola #{escolaId}</span>
        </div>

        {/* Título + Ações */}
        <div className={tw`flex items-center justify-between`}>
          <div className={tw`flex items-center gap-4`}>
            <button
              onClick={() => navigate('/dashboard')}
              className={tw`p-2 rounded-lg border hover:bg-gray-50 transition-colors`}
              style={{ borderColor: '#e2e8f0' }}
              title="Voltar"
            >
              <Icons.ArrowLeft className={tw`w-5 h-5`} style={{ color: '#64748b' }} />
            </button>
            <div>
              <h2 className={tw`text-xl font-bold`} style={{ color: '#0f172a' }}>
                Detalhes da Escola
              </h2>
              <p className={tw`text-sm`} style={{ color: '#64748b' }}>
                Selecione os itens para gerar orçamento
              </p>
            </div>
          </div>

          {/* Stats rápidos */}
          {!loading && divisoes.length > 0 && (
            <div className={tw`flex items-center gap-6`}>
              <div className={tw`text-center`}>
                <p className={tw`text-2xl font-bold`} style={{ color: '#0f172a' }}>{totalDivisoes}</p>
                <p className={tw`text-xs`} style={{ color: '#64748b' }}>Divisões</p>
              </div>
              <div className={tw`text-center`}>
                <p className={tw`text-2xl font-bold`} style={{ color: '#0f172a' }}>{totalProdutos}</p>
                <p className={tw`text-xs`} style={{ color: '#64748b' }}>Produtos</p>
              </div>
              <div className={tw`text-center`}>
                <p className={tw`text-2xl font-bold`} style={{ color: '#3b82f6' }}>{totalQuantidade}</p>
                <p className={tw`text-xs`} style={{ color: '#64748b' }}>Total Qtd</p>
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
          style={{ backgroundColor: '#f8fafc', borderColor: '#e2e8f0' }}
        >
          {/* Contador de seleção */}
          <div className={tw`flex items-center gap-3`}>
            <div 
              className={tw`px-3 py-1.5 rounded-full text-sm font-medium`}
              style={{ 
                backgroundColor: selectedItems.size > 0 ? '#dbeafe' : '#f1f5f9',
                color: selectedItems.size > 0 ? '#1d4ed8' : '#64748b'
              }}
            >
              {selectedItems.size} {selectedItems.size === 1 ? 'item selecionado' : 'itens selecionados'}
            </div>
          </div>

          {/* Botão de Ação Principal */}
          <button
            onClick={handleGenerateBudget}
            disabled={selectedItems.size === 0 || generatingBudget}
            className={tw`flex items-center gap-2 px-5 py-2.5 rounded-lg font-medium text-sm transition-all ${
              selectedItems.size === 0 || generatingBudget
                ? 'cursor-not-allowed'
                : 'hover:shadow-md active:scale-[0.98]'
            }`}
            style={{
              backgroundColor: selectedItems.size === 0 ? '#e2e8f0' : '#10b981',
              color: selectedItems.size === 0 ? '#94a3b8' : '#ffffff'
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
      )}

      {/* ============================================ */}
      {/* MENSAGENS DE FEEDBACK */}
      {/* ============================================ */}
      {(error || successMessage) && (
        <div className={tw`flex-shrink-0 px-6 py-3`}>
          {error && (
            <div 
              className={tw`flex items-center gap-3 px-4 py-3 rounded-lg`}
              style={{ backgroundColor: '#fef2f2', border: '1px solid #fecaca' }}
            >
              <Icons.ExclamationCircle className={tw`w-5 h-5 flex-shrink-0`} style={{ color: '#dc2626' }} />
              <p className={tw`text-sm`} style={{ color: '#dc2626' }}>{error}</p>
            </div>
          )}
          {successMessage && (
            <div 
              className={tw`flex items-center gap-3 px-4 py-3 rounded-lg`}
              style={{ backgroundColor: '#f0fdf4', border: '1px solid #bbf7d0' }}
            >
              <Icons.CheckCircle className={tw`w-5 h-5 flex-shrink-0`} style={{ color: '#16a34a' }} />
              <p className={tw`text-sm font-medium`} style={{ color: '#16a34a' }}>{successMessage}</p>
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
            <Icons.Spinner className={tw`w-10 h-10 animate-spin mb-4`} style={{ color: '#3b82f6' }} />
            <p className={tw`text-sm font-medium`} style={{ color: '#64748b' }}>Carregando pedidos...</p>
          </div>
        )}

        {/* Empty State */}
        {!loading && !error && divisoes.length === 0 && (
          <div className={tw`flex flex-col items-center justify-center h-full`}>
            <div 
              className={tw`w-20 h-20 rounded-full flex items-center justify-center mb-6`}
              style={{ backgroundColor: '#f1f5f9' }}
            >
              <Icons.School className={tw`w-10 h-10`} style={{ color: '#cbd5e1' }} />
            </div>
            <h3 className={tw`text-lg font-semibold mb-2`} style={{ color: '#334155' }}>
              Nenhum pedido encontrado
            </h3>
            <p className={tw`text-sm mb-6 text-center max-w-md`} style={{ color: '#64748b' }}>
              Esta escola não possui pedidos do tipo "Elite" cadastrados no sistema.
            </p>
            <button
              onClick={() => navigate('/dashboard')}
              className={tw`flex items-center gap-2 px-4 py-2 rounded-lg font-medium text-sm`}
              style={{ backgroundColor: '#3b82f6', color: '#ffffff' }}
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
    </div>
  )
}
