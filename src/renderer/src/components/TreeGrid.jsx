import { useState, useCallback, useEffect } from 'react'
import { tw } from '@twind/core'

// ============================================
// ÍCONES SVG INLINE
// ============================================
const Icons = {
  ChevronRight: ({ className, style }) => (
    <svg className={className} style={style} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
    </svg>
  ),
  ChevronDown: ({ className, style }) => (
    <svg className={className} style={style} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
    </svg>
  ),
  Folder: ({ className, style }) => (
    <svg className={className} style={style} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 12.75V12A2.25 2.25 0 014.5 9.75h15A2.25 2.25 0 0121.75 12v.75m-8.69-6.44l-2.12-2.12a1.5 1.5 0 00-1.061-.44H4.5A2.25 2.25 0 002.25 6v12a2.25 2.25 0 002.25 2.25h15A2.25 2.25 0 0021.75 18V9a2.25 2.25 0 00-2.25-2.25h-5.379a1.5 1.5 0 01-1.06-.44z" />
    </svg>
  ),
  Package: ({ className, style }) => (
    <svg className={className} style={style} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M20.25 7.5l-.625 10.632a2.25 2.25 0 01-2.247 2.118H6.622a2.25 2.25 0 01-2.247-2.118L3.75 7.5M10 11.25h4M3.375 7.5h17.25c.621 0 1.125-.504 1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125H3.375c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125z" />
    </svg>
  ),
  Calendar: ({ className, style }) => (
    <svg className={className} style={style} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5" />
    </svg>
  ),
  Document: ({ className, style }) => (
    <svg className={className} style={style} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m2.25 0H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
    </svg>
  )
}

// ============================================
// COMPONENTE PRINCIPAL
// ============================================
export default function TreeGrid({ data = [], onSelectionChange }) {
  const [expanded, setExpanded] = useState(new Set())
  const [selected, setSelected] = useState(new Set())

  // Expandir todas as divisões por padrão
  useEffect(() => {
    const initialExpanded = new Set()
    data.forEach((_, idx) => {
      initialExpanded.add(`div-${idx}`)
    })
    setExpanded(initialExpanded)
  }, [data])

  // Callback quando seleção muda
  useEffect(() => {
    if (onSelectionChange) {
      onSelectionChange(selected)
    }
  }, [selected, onSelectionChange])

  const toggleExpand = useCallback((nodeId) => {
    setExpanded(prev => {
      const newSet = new Set(prev)
      if (newSet.has(nodeId)) {
        newSet.delete(nodeId)
      } else {
        newSet.add(nodeId)
      }
      return newSet
    })
  }, [])

  const toggleSelection = useCallback((nodeId, node, shouldSelect) => {
    setSelected(prev => {
      const newSet = new Set(prev)
      
      const updateNodeAndChildren = (id, nodeData, select) => {
        if (select) {
          newSet.add(id)
        } else {
          newSet.delete(id)
        }

        if (nodeData.produtos) {
          nodeData.produtos.forEach((produto, pIdx) => {
            updateNodeAndChildren(`${id}-produto-${pIdx}`, produto, select)
          })
        } else if (nodeData.datas) {
          nodeData.datas.forEach((data, dIdx) => {
            updateNodeAndChildren(`${id}-data-${dIdx}`, data, select)
          })
        } else if (nodeData.arquivos) {
          nodeData.arquivos.forEach((_, aIdx) => {
            if (select) {
              newSet.add(`${id}-arquivo-${aIdx}`)
            } else {
              newSet.delete(`${id}-arquivo-${aIdx}`)
            }
          })
        }
      }

      updateNodeAndChildren(nodeId, node, shouldSelect)
      return newSet
    })
  }, [])

  const isExpanded = useCallback((nodeId) => expanded.has(nodeId), [expanded])
  const isSelected = useCallback((nodeId) => selected.has(nodeId), [selected])

  // Formatar data para exibição
  const formatDate = (dateStr) => {
    if (!dateStr || dateStr === 'Sem data saida') return 'Sem data'
    try {
      const date = new Date(dateStr + 'T00:00:00')
      return date.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit', year: 'numeric' })
    } catch {
      return dateStr
    }
  }

  // ============================================
  // RENDERIZAÇÃO DAS LINHAS
  // ============================================

  // Divisão Logística (Nível 0) - Aparência de seção/header
  const renderDivisao = (divisao, divIndex) => {
    const divId = `div-${divIndex}`
    const hasChildren = divisao.produtos && divisao.produtos.length > 0
    const nodeExpanded = isExpanded(divId)
    const nodeSelected = isSelected(divId)

    return (
      <div key={divId} className={tw`mb-3`}>
        {/* Header da Divisão */}
        <div 
          className={tw`flex items-center rounded-t-lg border border-gray-200 ${nodeSelected ? 'bg-blue-50 border-blue-300' : 'bg-gradient-to-r from-slate-100 to-slate-50'}`}
          style={{ minHeight: '48px' }}
        >
          {/* Expand/Collapse */}
          <button
            onClick={() => toggleExpand(divId)}
            className={tw`w-10 h-12 flex items-center justify-center hover:bg-gray-200 rounded-l-lg transition-colors`}
          >
            {hasChildren && (
              nodeExpanded 
                ? <Icons.ChevronDown className={tw`w-4 h-4`} style={{ color: '#6b7280' }} />
                : <Icons.ChevronRight className={tw`w-4 h-4`} style={{ color: '#6b7280' }} />
            )}
          </button>

          {/* Checkbox */}
          <div className={tw`px-2`}>
            <input
              type="checkbox"
              checked={nodeSelected}
              onChange={(e) => toggleSelection(divId, divisao, e.target.checked)}
              className={tw`w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500 cursor-pointer`}
            />
          </div>

          {/* Ícone + Nome */}
          <div className={tw`flex items-center flex-1 px-3`}>
            <Icons.Folder className={tw`w-5 h-5 mr-3 flex-shrink-0`} style={{ color: '#f59e0b' }} />
            <span className={tw`font-semibold text-sm`} style={{ color: '#1e293b' }}>
              {divisao.divisao_logistica}
            </span>
          </div>

          {/* Info */}
          <div className={tw`flex items-center gap-6 px-4`}>
            <div className={tw`text-right`}>
              <span className={tw`text-xs`} style={{ color: '#64748b' }}>Dias úteis</span>
              <p className={tw`font-medium text-sm`} style={{ color: '#334155' }}>{divisao.dias_uteis}</p>
            </div>
            <div className={tw`text-right min-w-[80px]`}>
              <span className={tw`text-xs`} style={{ color: '#64748b' }}>Quantidade</span>
              <p className={tw`font-bold text-lg`} style={{ color: '#0f172a' }}>{divisao.quantidade_total}</p>
            </div>
          </div>
        </div>

        {/* Produtos (filhos) */}
        {nodeExpanded && hasChildren && (
          <div className={tw`border-l border-r border-b border-gray-200 rounded-b-lg bg-white`}>
            {divisao.produtos.map((produto, pIdx) => renderProduto(produto, pIdx, divId))}
          </div>
        )}
      </div>
    )
  }

  // Produto (Nível 1)
  const renderProduto = (produto, pIdx, parentId) => {
    const prodId = `${parentId}-produto-${pIdx}`
    const hasChildren = produto.datas && produto.datas.length > 0
    const nodeExpanded = isExpanded(prodId)
    const nodeSelected = isSelected(prodId)

    return (
      <div key={prodId}>
        <div 
          className={tw`flex items-center border-b border-gray-100 hover:bg-slate-50 transition-colors ${nodeSelected ? 'bg-blue-50' : ''}`}
          style={{ paddingLeft: '24px', minHeight: '44px' }}
        >
          {/* Expand/Collapse */}
          <button
            onClick={() => toggleExpand(prodId)}
            className={tw`w-8 h-10 flex items-center justify-center hover:bg-gray-200 rounded transition-colors`}
          >
            {hasChildren && (
              nodeExpanded 
                ? <Icons.ChevronDown className={tw`w-3.5 h-3.5`} style={{ color: '#9ca3af' }} />
                : <Icons.ChevronRight className={tw`w-3.5 h-3.5`} style={{ color: '#9ca3af' }} />
            )}
          </button>

          {/* Checkbox */}
          <div className={tw`px-2`}>
            <input
              type="checkbox"
              checked={nodeSelected}
              onChange={(e) => toggleSelection(prodId, produto, e.target.checked)}
              className={tw`w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500 cursor-pointer`}
            />
          </div>

          {/* Ícone + Nome */}
          <div className={tw`flex items-center flex-1 px-2`}>
            <Icons.Package className={tw`w-4 h-4 mr-2 flex-shrink-0`} style={{ color: '#6366f1' }} />
            <span className={tw`text-sm font-medium`} style={{ color: '#374151' }}>
              {produto.produto}
            </span>
            <span className={tw`ml-2 text-xs px-2 py-0.5 rounded-full`} style={{ backgroundColor: '#e0e7ff', color: '#4338ca' }}>
              ID: {produto.id_produto}
            </span>
          </div>

          {/* Quantidade */}
          <div className={tw`px-4 text-right min-w-[100px]`}>
            <span className={tw`font-semibold text-sm`} style={{ color: '#1f2937' }}>{produto.quantidade}</span>
          </div>
        </div>

        {/* Datas (filhos) */}
        {nodeExpanded && hasChildren && (
          <div>
            {produto.datas.map((data, dIdx) => renderData(data, dIdx, prodId))}
          </div>
        )}
      </div>
    )
  }

  // Data de Saída (Nível 2)
  const renderData = (data, dIdx, parentId) => {
    const dataId = `${parentId}-data-${dIdx}`
    const hasChildren = data.arquivos && data.arquivos.length > 0
    const nodeExpanded = isExpanded(dataId)
    const nodeSelected = isSelected(dataId)

    return (
      <div key={dataId}>
        <div 
          className={tw`flex items-center border-b border-gray-50 hover:bg-gray-50 transition-colors ${nodeSelected ? 'bg-blue-50' : ''}`}
          style={{ paddingLeft: '56px', minHeight: '40px', backgroundColor: nodeSelected ? undefined : '#fafafa' }}
        >
          {/* Expand/Collapse */}
          <button
            onClick={() => toggleExpand(dataId)}
            className={tw`w-7 h-9 flex items-center justify-center hover:bg-gray-200 rounded transition-colors`}
          >
            {hasChildren && (
              nodeExpanded 
                ? <Icons.ChevronDown className={tw`w-3 h-3`} style={{ color: '#9ca3af' }} />
                : <Icons.ChevronRight className={tw`w-3 h-3`} style={{ color: '#9ca3af' }} />
            )}
          </button>

          {/* Checkbox */}
          <div className={tw`px-2`}>
            <input
              type="checkbox"
              checked={nodeSelected}
              onChange={(e) => toggleSelection(dataId, data, e.target.checked)}
              className={tw`w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500 cursor-pointer`}
            />
          </div>

          {/* Ícone + Data */}
          <div className={tw`flex items-center flex-1 px-2`}>
            <Icons.Calendar className={tw`w-4 h-4 mr-2 flex-shrink-0`} style={{ color: '#10b981' }} />
            <span className={tw`text-sm`} style={{ color: '#4b5563' }}>
              Data de saída: <strong style={{ color: '#111827' }}>{formatDate(data.data_saida)}</strong>
            </span>
            <span className={tw`ml-3 text-xs`} style={{ color: '#9ca3af' }}>
              ({data.arquivos?.length || 0} arquivos)
            </span>
          </div>

          {/* Quantidade */}
          <div className={tw`px-4 text-right min-w-[100px]`}>
            <span className={tw`text-sm font-medium`} style={{ color: '#374151' }}>{data.quantidade}</span>
          </div>
        </div>

        {/* Arquivos (filhos) */}
        {nodeExpanded && hasChildren && (
          <div>
            {data.arquivos.map((arquivo, aIdx) => renderArquivo(arquivo, aIdx, dataId))}
          </div>
        )}
      </div>
    )
  }

  // Arquivo PDF (Nível 3)
  const renderArquivo = (arquivo, aIdx, parentId) => {
    const arquivoId = `${parentId}-arquivo-${aIdx}`
    const nodeSelected = isSelected(arquivoId)

    return (
      <div 
        key={arquivoId}
        className={tw`flex items-center border-b border-gray-50 hover:bg-gray-50 transition-colors ${nodeSelected ? 'bg-blue-50' : ''}`}
        style={{ paddingLeft: '88px', minHeight: '36px', backgroundColor: nodeSelected ? undefined : '#fdfdfd' }}
      >
        {/* Espaço para alinhamento */}
        <div className={tw`w-7`}></div>

        {/* Checkbox */}
        <div className={tw`px-2`}>
          <input
            type="checkbox"
            checked={nodeSelected}
            onChange={(e) => {
              setSelected(prev => {
                const newSet = new Set(prev)
                if (e.target.checked) {
                  newSet.add(arquivoId)
                } else {
                  newSet.delete(arquivoId)
                }
                return newSet
              })
            }}
            className={tw`w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500 cursor-pointer`}
          />
        </div>

        {/* Ícone + Nome */}
        <div className={tw`flex items-center flex-1 px-2`}>
          <Icons.Document className={tw`w-4 h-4 mr-2 flex-shrink-0`} style={{ color: '#ef4444' }} />
          <span className={tw`text-sm font-mono`} style={{ color: '#6b7280', fontSize: '12px' }}>
            {arquivo.arquivo}
          </span>
          {arquivo.paginas && (
            <span className={tw`ml-2 text-xs px-1.5 py-0.5 rounded`} style={{ backgroundColor: '#fef3c7', color: '#92400e' }}>
              {arquivo.paginas} pág.
            </span>
          )}
        </div>

        {/* Cópias */}
        <div className={tw`px-4 text-right min-w-[100px]`}>
          <span className={tw`text-sm`} style={{ color: '#6b7280' }}>{arquivo.copias} cópias</span>
        </div>
      </div>
    )
  }

  // ============================================
  // RENDER PRINCIPAL
  // ============================================
  return (
    <div className={tw`bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden`}>
      {/* Header da Tabela */}
      <div 
        className={tw`flex items-center px-4 py-3 border-b border-gray-200`}
        style={{ backgroundColor: '#f8fafc' }}
      >
        <div className={tw`w-10`}></div>
        <div className={tw`w-8`}></div>
        <div className={tw`flex-1 px-3`}>
          <span className={tw`text-xs font-semibold uppercase tracking-wider`} style={{ color: '#64748b' }}>
            Nome / Descrição
          </span>
        </div>
        <div className={tw`px-4 text-right min-w-[100px]`}>
          <span className={tw`text-xs font-semibold uppercase tracking-wider`} style={{ color: '#64748b' }}>
            Quantidade
          </span>
        </div>
      </div>

      {/* Conteúdo */}
      <div className={tw`overflow-auto`} style={{ maxHeight: 'calc(100vh - 280px)' }}>
        {data.length === 0 ? (
          <div className={tw`text-center py-16`}>
            <Icons.Folder className={tw`w-12 h-12 mx-auto mb-4`} style={{ color: '#d1d5db' }} />
            <p className={tw`text-sm`} style={{ color: '#9ca3af' }}>Nenhum dado disponível</p>
          </div>
        ) : (
          <div className={tw`p-3`}>
            {data.map((divisao, divIndex) => renderDivisao(divisao, divIndex))}
          </div>
        )}
      </div>

      {/* Footer */}
      <div 
        className={tw`flex items-center justify-between px-4 py-3 border-t border-gray-200`}
        style={{ backgroundColor: '#f8fafc' }}
      >
        <div className={tw`flex items-center gap-4`}>
          <span className={tw`text-sm font-medium`} style={{ color: '#374151' }}>
            {selected.size} {selected.size === 1 ? 'item selecionado' : 'itens selecionados'}
          </span>
        </div>
        <div className={tw`text-xs`} style={{ color: '#9ca3af' }}>
          {data.length} {data.length === 1 ? 'divisão' : 'divisões'} • 
          {data.reduce((acc, d) => acc + (d.produtos?.length || 0), 0)} produtos
        </div>
      </div>
    </div>
  )
}
