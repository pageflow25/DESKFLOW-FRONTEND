import { useState, useCallback, useEffect } from 'react'
import { tw } from '@twind/core'
import { useTheme } from '../contexts/ThemeContext'

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
  ),
  Building: ({ className, style }) => (
    <svg className={className} style={style} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 21h16.5M4.5 3h15M5.25 3v18m13.5-18v18M9 6.75h1.5m-1.5 3h1.5m-1.5 3h1.5m3-6H15m-1.5 3H15m-1.5 3H15M9 21v-3.375c0-.621.504-1.125 1.125-1.125h3.75c.621 0 1.125.504 1.125 1.125V21" />
    </svg>
  )
}

// ============================================
// COMPONENTE PRINCIPAL
// ============================================
export default function TreeGrid({ data = [], onSelectionChange }) {
  const [expanded, setExpanded] = useState(new Set())
  const [selected, setSelected] = useState(new Set())
  const { colors: c } = useTheme()

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
        } else if (nodeData.unidades) {
          nodeData.unidades.forEach((unidade, uIdx) => {
            updateNodeAndChildren(`${id}-unidade-${uIdx}`, unidade, select)
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
          className={tw`flex items-center rounded-t-lg border ${nodeSelected ? c.divSelectedBg : c.divGradient}`}
          style={{ minHeight: '48px' }}
        >
          {/* Expand/Collapse */}
          <button
            onClick={() => toggleExpand(divId)}
            className={tw`w-10 h-12 flex items-center justify-center rounded-l-lg transition-colors`}
          >
            {hasChildren && (
              nodeExpanded 
                ? <Icons.ChevronDown className={tw`w-4 h-4`} style={{ color: c.iconChevron }} />
                : <Icons.ChevronRight className={tw`w-4 h-4`} style={{ color: c.iconChevron }} />
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
            <Icons.Folder className={tw`w-5 h-5 mr-3 flex-shrink-0`} style={{ color: c.iconFolder }} />
            <span className={tw`font-semibold text-sm`} style={{ color: c.textPrimary }}>
              {divisao.divisao_logistica}
            </span>
          </div>

          {/* Info */}
          <div className={tw`flex items-center gap-6 px-4`}>
            <div className={tw`text-right`}>
              <span className={tw`text-xs`} style={{ color: c.textMuted }}>Dias úteis</span>
              <p className={tw`font-medium text-sm`} style={{ color: c.textSecondary }}>{divisao.dias_uteis}</p>
            </div>
            <div className={tw`text-right min-w-[80px]`}>
              <span className={tw`text-xs`} style={{ color: c.textMuted }}>Quantidade</span>
              <p className={tw`font-bold text-lg`} style={{ color: c.textPrimary }}>{divisao.quantidade_total}</p>
            </div>
          </div>
        </div>

        {/* Produtos (filhos) */}
        {nodeExpanded && hasChildren && (
          <div className={tw`border-l border-r border-b rounded-b-lg`} style={{ borderColor: c.border, backgroundColor: c.cardBg }}>
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
          className={tw`flex items-center border-b transition-colors`}
          style={{ paddingLeft: '24px', minHeight: '44px', borderColor: c.borderLight, backgroundColor: nodeSelected ? c.accentBg : undefined }}
          onMouseEnter={e => { if (!nodeSelected) e.currentTarget.style.backgroundColor = c.rowHover }}
          onMouseLeave={e => { if (!nodeSelected) e.currentTarget.style.backgroundColor = '' }}
        >
          {/* Expand/Collapse */}
          <button
            onClick={() => toggleExpand(prodId)}
            className={tw`w-8 h-10 flex items-center justify-center rounded transition-colors`}
          >
            {hasChildren && (
              nodeExpanded 
                ? <Icons.ChevronDown className={tw`w-3.5 h-3.5`} style={{ color: c.iconChevronSub }} />
                : <Icons.ChevronRight className={tw`w-3.5 h-3.5`} style={{ color: c.iconChevronSub }} />
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
            <Icons.Package className={tw`w-4 h-4 mr-2 flex-shrink-0`} style={{ color: c.iconPackage }} />
            <span className={tw`text-sm font-medium`} style={{ color: c.textSecondary }}>
              {produto.produto}
            </span>
            <span className={tw`ml-2 text-xs px-2 py-0.5 rounded-full`} style={{ backgroundColor: c.badgeBg, color: c.badgeText }}>
              ID: {produto.id_produto}
            </span>
          </div>

          {/* Quantidade */}
          <div className={tw`px-4 text-right min-w-[100px]`}>
            <span className={tw`font-semibold text-sm`} style={{ color: c.textPrimary }}>{produto.quantidade}</span>
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
    const hasChildren = data.unidades && data.unidades.length > 0
    const nodeExpanded = isExpanded(dataId)
    const nodeSelected = isSelected(dataId)

    return (
      <div key={dataId}>
        <div 
          className={tw`flex items-center border-b transition-colors`}
          style={{ paddingLeft: '56px', minHeight: '40px', borderColor: c.borderSubtle, backgroundColor: nodeSelected ? c.accentBg : c.rowAlt }}
          onMouseEnter={e => { if (!nodeSelected) e.currentTarget.style.backgroundColor = c.rowHover }}
          onMouseLeave={e => { if (!nodeSelected) e.currentTarget.style.backgroundColor = nodeSelected ? c.accentBg : c.rowAlt }}
        >
          {/* Expand/Collapse */}
          <button
            onClick={() => toggleExpand(dataId)}
            className={tw`w-7 h-9 flex items-center justify-center rounded transition-colors`}
          >
            {hasChildren && (
              nodeExpanded 
                ? <Icons.ChevronDown className={tw`w-3 h-3`} style={{ color: c.iconChevronSub }} />
                : <Icons.ChevronRight className={tw`w-3 h-3`} style={{ color: c.iconChevronSub }} />
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
            <Icons.Calendar className={tw`w-4 h-4 mr-2 flex-shrink-0`} style={{ color: c.iconCalendar }} />
            <span className={tw`text-sm`} style={{ color: c.textMuted }}>
              Data de saída: <strong style={{ color: c.textPrimary }}>{formatDate(data.data_saida)}</strong>
            </span>
            <span className={tw`ml-3 text-xs`} style={{ color: c.textSubtle }}>
              ({data.unidades?.length || 0} unidades)
            </span>
          </div>

          {/* Quantidade */}
          <div className={tw`px-4 text-right min-w-[100px]`}>
            <span className={tw`text-sm font-medium`} style={{ color: c.textSecondary }}>{data.quantidade}</span>
          </div>
        </div>

        {/* Unidades (filhos) */}
        {nodeExpanded && hasChildren && (
          <div>
            {data.unidades.map((unidade, uIdx) => renderUnidade(unidade, uIdx, dataId))}
          </div>
        )}
      </div>
    )
  }

  // Unidade Escolar (Nível 3)
  const renderUnidade = (unidade, uIdx, parentId) => {
    const unidadeId = `${parentId}-unidade-${uIdx}`
    const hasChildren = unidade.arquivos && unidade.arquivos.length > 0
    const nodeExpanded = isExpanded(unidadeId)
    const nodeSelected = isSelected(unidadeId)

    return (
      <div key={unidadeId}>
        <div 
          className={tw`flex items-center border-b transition-colors`}
          style={{ paddingLeft: '72px', minHeight: '38px', borderColor: c.borderSubtle, backgroundColor: nodeSelected ? c.accentBg : c.rowDeep }}
          onMouseEnter={e => { if (!nodeSelected) e.currentTarget.style.backgroundColor = c.rowHover }}
          onMouseLeave={e => { if (!nodeSelected) e.currentTarget.style.backgroundColor = nodeSelected ? c.accentBg : c.rowDeep }}
        >
          {/* Expand/Collapse */}
          <button
            onClick={() => toggleExpand(unidadeId)}
            className={tw`w-7 h-9 flex items-center justify-center rounded transition-colors`}
          >
            {hasChildren && (
              nodeExpanded 
                ? <Icons.ChevronDown className={tw`w-3 h-3`} style={{ color: c.iconChevronSub }} />
                : <Icons.ChevronRight className={tw`w-3 h-3`} style={{ color: c.iconChevronSub }} />
            )}
          </button>

          {/* Checkbox */}
          <div className={tw`px-2`}>
            <input
              type="checkbox"
              checked={nodeSelected}
              onChange={(e) => toggleSelection(unidadeId, unidade, e.target.checked)}
              className={tw`w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500 cursor-pointer`}
            />
          </div>

          {/* Ícone + Nome */}
          <div className={tw`flex items-center flex-1 px-2`}>
            <Icons.Building className={tw`w-4 h-4 mr-2 flex-shrink-0`} style={{ color: c.iconBuilding }} />
            <span className={tw`text-sm font-medium`} style={{ color: c.textSecondary }}>
              {unidade.unidade}
            </span>
            <span className={tw`ml-3 text-xs`} style={{ color: c.textSubtle }}>
              ({unidade.arquivos?.length || 0} arquivos)
            </span>
          </div>

          {/* Quantidade */}
          <div className={tw`px-4 text-right min-w-[100px]`}>
            <span className={tw`text-sm font-medium`} style={{ color: c.textSecondary }}>{unidade.quantidade}</span>
          </div>
        </div>

        {/* Arquivos (filhos) */}
        {nodeExpanded && hasChildren && (
          <div>
            {unidade.arquivos.map((arquivo, aIdx) => renderArquivo(arquivo, aIdx, unidadeId))}
          </div>
        )}
      </div>
    )
  }

  // Arquivo PDF (Nível 4)
  const renderArquivo = (arquivo, aIdx, parentId) => {
    const arquivoId = `${parentId}-arquivo-${aIdx}`
    const nodeSelected = isSelected(arquivoId)

    return (
      <div 
        key={arquivoId}
        className={tw`flex items-center border-b transition-colors`}
        style={{ paddingLeft: '104px', minHeight: '36px', borderColor: c.borderSubtle, backgroundColor: nodeSelected ? c.accentBg : c.rowDeepest }}
        onMouseEnter={e => { if (!nodeSelected) e.currentTarget.style.backgroundColor = c.rowHover }}
        onMouseLeave={e => { if (!nodeSelected) e.currentTarget.style.backgroundColor = nodeSelected ? c.accentBg : c.rowDeepest }}
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
          <Icons.Document className={tw`w-4 h-4 mr-2 flex-shrink-0`} style={{ color: c.iconDocument }} />
          <span className={tw`text-sm font-mono`} style={{ color: c.textMuted, fontSize: '12px' }}>
            {arquivo.arquivo}
          </span>
          {arquivo.paginas && (
            <span className={tw`ml-2 text-xs px-1.5 py-0.5 rounded`} style={{ backgroundColor: c.warningBadgeBg, color: c.warningText }}>
              {arquivo.paginas} pág.
            </span>
          )}
        </div>

        {/* Cópias */}
        <div className={tw`px-4 text-right min-w-[100px]`}>
          <span className={tw`text-sm`} style={{ color: c.textMuted }}>{arquivo.copias} cópias</span>
        </div>
      </div>
    )
  }

  // ============================================
  // RENDER PRINCIPAL
  // ============================================
  return (
    <div className={tw`rounded-lg shadow-sm border overflow-hidden`} style={{ backgroundColor: c.cardBg, borderColor: c.border }}>
      {/* Header da Tabela */}
      <div 
        className={tw`flex items-center px-4 py-3 border-b`}
        style={{ backgroundColor: c.sectionBg, borderColor: c.border }}
      >
        <div className={tw`w-10`}></div>
        <div className={tw`w-8`}></div>
        <div className={tw`flex-1 px-3`}>
          <span className={tw`text-xs font-semibold uppercase tracking-wider`} style={{ color: c.textMuted }}>
            Nome / Descrição
          </span>
        </div>
        <div className={tw`px-4 text-right min-w-[100px]`}>
          <span className={tw`text-xs font-semibold uppercase tracking-wider`} style={{ color: c.textMuted }}>
            Quantidade
          </span>
        </div>
      </div>

      {/* Conteúdo */}
      <div className={tw`overflow-auto`} style={{ maxHeight: 'calc(100vh - 280px)' }}>
        {data.length === 0 ? (
          <div className={tw`text-center py-16`}>
            <Icons.Folder className={tw`w-12 h-12 mx-auto mb-4`} style={{ color: c.emptyIconLarge }} />
            <p className={tw`text-sm`} style={{ color: c.textSubtle }}>Nenhum dado disponível</p>
          </div>
        ) : (
          <div className={tw`p-3`}>
            {data.map((divisao, divIndex) => renderDivisao(divisao, divIndex))}
          </div>
        )}
      </div>

      {/* Footer */}
      <div 
        className={tw`flex items-center justify-between px-4 py-3 border-t`}
        style={{ backgroundColor: c.sectionBg, borderColor: c.border }}
      >
        <div className={tw`flex items-center gap-4`}>
          <span className={tw`text-sm font-medium`} style={{ color: c.textSecondary }}>
            {selected.size} {selected.size === 1 ? 'item selecionado' : 'itens selecionados'}
          </span>
        </div>
        <div className={tw`text-xs`} style={{ color: c.textSubtle }}>
          {data.length} {data.length === 1 ? 'divisão' : 'divisões'} • 
          {data.reduce((acc, d) => acc + (d.produtos?.length || 0), 0)} produtos
        </div>
      </div>
    </div>
  )
}
