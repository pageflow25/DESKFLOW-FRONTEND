/* eslint-disable react/prop-types */
import { useState, useCallback, useEffect, useMemo, useRef } from 'react'
import { tw } from '@twind/core'
import { useTheme } from '../contexts/ThemeContext'

// ============================================
// ICONES SVG INLINE
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

const LEVEL_CONFIG = {
  divisao: { indent: 0, minHeight: 54, iconSize: 20, icon: Icons.Folder, iconKey: 'iconFolder', label: 'divisao_logistica' },
  produto: { indent: 24, minHeight: 48, iconSize: 16, icon: Icons.Package, iconKey: 'iconPackage', label: 'produto' },
  data: { indent: 56, minHeight: 44, iconSize: 16, icon: Icons.Calendar, iconKey: 'iconCalendar', label: 'data_saida' },
  unidade: { indent: 76, minHeight: 42, iconSize: 16, icon: Icons.Building, iconKey: 'iconBuilding', label: 'unidade' },
  arquivo: { indent: 108, minHeight: 40, iconSize: 16, icon: Icons.Document, iconKey: 'iconDocument', label: 'arquivo' }
}

const getChildCollection = (node) => node?.produtos || node?.datas || node?.unidades || node?.arquivos || []

const getChildrenKey = (node) => {
  if (node?.produtos) return 'produtos'
  if (node?.datas) return 'datas'
  if (node?.unidades) return 'unidades'
  if (node?.arquivos) return 'arquivos'
  return null
}

const formatDate = (dateStr) => {
  if (!dateStr || dateStr === 'Sem data saida') return 'Sem data'
  try {
    const date = new Date(`${dateStr}T00:00:00`)
    return date.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit', year: 'numeric' })
  } catch {
    return dateStr
  }
}

const buildTreeIndex = (data) => {
  const nodes = new Map()
  const rootIds = []
  const expandableIds = []
  const allIds = []

  const addNode = ({ id, type, node, parentId, path }) => {
    const children = getChildCollection(node)
    const childrenKey = getChildrenKey(node)
    const childrenIds = []

    nodes.set(id, { id, type, node, parentId, path, childrenIds, childrenKey })
    allIds.push(id)

    if (children.length > 0) {
      expandableIds.push(id)
    }

    const childType = {
      produtos: 'produto',
      datas: 'data',
      unidades: 'unidade',
      arquivos: 'arquivo'
    }[childrenKey]

    children.forEach((child, index) => {
      const childId = `${id}-${childType}-${index}`
      childrenIds.push(childId)
      addNode({
        id: childId,
        type: childType,
        node: child,
        parentId: id,
        path: { ...path, [childType]: index }
      })
    })
  }

  data.forEach((divisao, index) => {
    const id = `div-${index}`
    rootIds.push(id)
    addNode({ id, type: 'divisao', node: divisao, parentId: null, path: { divisao: index } })
  })

  return { nodes, rootIds, expandableIds, allIds }
}

const Checkbox = ({ checked, indeterminate, onChange, label }) => {
  const ref = useRef(null)

  useEffect(() => {
    if (ref.current) {
      ref.current.indeterminate = indeterminate
    }
  }, [indeterminate])

  return (
    <input
      ref={ref}
      type="checkbox"
      checked={checked}
      aria-checked={indeterminate ? 'mixed' : checked}
      aria-label={label}
      onChange={(event) => onChange(event.target.checked)}
      className={tw`w-5 h-5 rounded border-gray-300 text-blue-600 focus:ring-2 focus:ring-blue-500 cursor-pointer transition-transform active:scale-95`}
    />
  )
}

// ============================================
// COMPONENTE PRINCIPAL
// ============================================
export default function TreeGrid({ data = [], onSelectionChange, expandCommand }) {
  const [expanded, setExpanded] = useState(new Set())
  const [checked, setChecked] = useState(new Set())
  const { colors: c } = useTheme()

  const treeIndex = useMemo(() => buildTreeIndex(data), [data])

  useEffect(() => {
    setExpanded(new Set(treeIndex.rootIds))
    setChecked(new Set())
  }, [treeIndex])

  useEffect(() => {
    if (!expandCommand?.type) return

    setExpanded(expandCommand.type === 'expand-all'
      ? new Set(treeIndex.expandableIds)
      : new Set())
  }, [expandCommand, treeIndex.expandableIds])

  const getDescendantIds = useCallback((nodeId) => {
    const descendants = []
    const visit = (id) => {
      const meta = treeIndex.nodes.get(id)
      if (!meta) return
      meta.childrenIds.forEach((childId) => {
        descendants.push(childId)
        visit(childId)
      })
    }
    visit(nodeId)
    return descendants
  }, [treeIndex.nodes])

  const getAncestorIds = useCallback((nodeId) => {
    const ancestors = []
    let current = treeIndex.nodes.get(nodeId)?.parentId

    while (current) {
      ancestors.push(current)
      current = treeIndex.nodes.get(current)?.parentId
    }

    return ancestors
  }, [treeIndex.nodes])

  const hasCheckedDescendant = useCallback((nodeId, selectionSet) => {
    const meta = treeIndex.nodes.get(nodeId)
    if (!meta) return false

    return meta.childrenIds.some((childId) => selectionSet.has(childId) || hasCheckedDescendant(childId, selectionSet))
  }, [treeIndex.nodes])

  const getSelectionState = useCallback((nodeId, selectionSet = checked) => {
    if (selectionSet.has(nodeId)) return 'checked'
    if (hasCheckedDescendant(nodeId, selectionSet)) return 'partial'
    return 'unchecked'
  }, [checked, hasCheckedDescendant])

  const reconcileAncestors = useCallback((selectionSet, nodeId) => {
    getAncestorIds(nodeId).forEach((ancestorId) => {
      const ancestor = treeIndex.nodes.get(ancestorId)
      const allChildrenChecked = ancestor?.childrenIds.length > 0 && ancestor.childrenIds.every(childId => selectionSet.has(childId))

      if (allChildrenChecked) {
        selectionSet.add(ancestorId)
      } else {
        selectionSet.delete(ancestorId)
      }
    })
  }, [getAncestorIds, treeIndex.nodes])

  const toggleExpand = useCallback((nodeId) => {
    setExpanded(prev => {
      const next = new Set(prev)
      if (next.has(nodeId)) {
        next.delete(nodeId)
      } else {
        next.add(nodeId)
      }
      return next
    })
  }, [])

  const toggleSelection = useCallback((nodeId, shouldCheck) => {
    setChecked(prev => {
      const next = new Set(prev)
      const targetIds = [nodeId, ...getDescendantIds(nodeId)]

      if (shouldCheck) {
        targetIds.forEach(id => next.add(id))
      } else {
        targetIds.forEach(id => next.delete(id))
      }

      reconcileAncestors(next, nodeId)
      return next
    })
  }, [getDescendantIds, reconcileAncestors])

  const selectionSummary = useMemo(() => {
    const partialIds = new Set()
    const checkedNodes = []
    const selectedLeaves = []

    treeIndex.allIds.forEach((id) => {
      const meta = treeIndex.nodes.get(id)
      const state = getSelectionState(id)

      if (state === 'partial') {
        partialIds.add(id)
      }

      if (checked.has(id)) {
        checkedNodes.push(meta)

        if (meta.childrenIds.length === 0) {
          selectedLeaves.push(meta)
        }
      }
    })

    return {
      checkedIds: new Set(checked),
      partialIds,
      checkedNodes,
      selectedLeaves,
      checkedCount: checked.size,
      partialCount: partialIds.size,
      activeCount: checked.size + partialIds.size
    }
  }, [checked, getSelectionState, treeIndex.allIds, treeIndex.nodes])

  useEffect(() => {
    onSelectionChange?.(selectionSummary)
  }, [onSelectionChange, selectionSummary])

  const getRowBackground = (type, state) => {
    if (state === 'checked') return c.treeSelectedBg || c.accentBg
    if (state === 'partial') return c.treePartialBg || c.warningBadgeBg

    return {
      divisao: undefined,
      produto: c.cardBg,
      data: c.rowAlt,
      unidade: c.rowDeep,
      arquivo: c.rowDeepest
    }[type]
  }

  const getRowBorder = (type, state) => {
    if (state === 'checked') return c.treeSelectedBorder || c.accent
    if (state === 'partial') return c.treePartialBorder || c.warningBorder

    return type === 'divisao' ? c.border : c.borderSubtle
  }

  const renderMetaInfo = (meta) => {
    const { type, node } = meta

    if (type === 'divisao') {
      return (
        <div className={tw`flex items-center gap-5 px-4`}>
          <div className={tw`text-right`}>
            <span className={tw`text-xs`} style={{ color: c.textMuted }}>Dias úteis</span>
            <p className={tw`font-medium text-sm`} style={{ color: c.textSecondary }}>{node.dias_uteis}</p>
          </div>
          <div className={tw`text-right min-w-[80px]`}>
            <span className={tw`text-xs`} style={{ color: c.textMuted }}>Quantidade</span>
            <p className={tw`font-bold text-lg`} style={{ color: c.textPrimary }}>{node.quantidade_total}</p>
          </div>
        </div>
      )
    }

    if (type === 'produto') {
      return (
        <>
          <span className={tw`ml-2 text-xs px-2 py-0.5 rounded-full`} style={{ backgroundColor: c.badgeBg, color: c.badgeText }}>
            ID: {node.id_produto}
          </span>
          <span className={tw`px-4 text-right min-w-[100px] font-semibold text-sm`} style={{ color: c.textPrimary }}>{node.quantidade}</span>
        </>
      )
    }

    if (type === 'data') {
      return (
        <>
          <span className={tw`ml-3 text-xs`} style={{ color: c.textSubtle }}>
            ({node.unidades?.length || 0} unidades)
          </span>
          <span className={tw`px-4 text-right min-w-[100px] text-sm font-medium`} style={{ color: c.textSecondary }}>{node.quantidade}</span>
        </>
      )
    }

    if (type === 'unidade') {
      return (
        <>
          <span className={tw`ml-3 text-xs`} style={{ color: c.textSubtle }}>
            ({node.arquivos?.length || 0} arquivos)
          </span>
          <span className={tw`px-4 text-right min-w-[100px] text-sm font-medium`} style={{ color: c.textSecondary }}>{node.quantidade}</span>
        </>
      )
    }

    return (
      <>
        {node.paginas && (
          <span className={tw`ml-2 text-xs px-1.5 py-0.5 rounded`} style={{ backgroundColor: c.warningBadgeBg, color: c.warningText }}>
            {node.paginas} pág.
          </span>
        )}
        <span className={tw`px-4 text-right min-w-[100px] text-sm`} style={{ color: c.textMuted }}>{node.copias} cópias</span>
      </>
    )
  }

  const renderLabel = (meta) => {
    const { type, node } = meta

    if (type === 'data') {
      return (
        <span className={tw`text-sm`} style={{ color: c.textMuted }}>
          Data de saída: <strong style={{ color: c.textPrimary }}>{formatDate(node.data_saida)}</strong>
        </span>
      )
    }

    return (
      <span
        className={tw`${type === 'arquivo' ? 'text-sm font-mono' : 'text-sm font-medium'} truncate`}
        style={{ color: type === 'arquivo' ? c.textMuted : c.textSecondary, fontSize: type === 'arquivo' ? '12px' : undefined }}
        title={node[LEVEL_CONFIG[type].label]}
      >
        {node[LEVEL_CONFIG[type].label]}
      </span>
    )
  }

  const renderNode = (nodeId) => {
    const meta = treeIndex.nodes.get(nodeId)
    if (!meta) return null

    const config = LEVEL_CONFIG[meta.type]
    const Icon = config.icon
    const state = getSelectionState(nodeId)
    const isChecked = state === 'checked'
    const isPartial = state === 'partial'
    const hasChildren = meta.childrenIds.length > 0
    const nodeExpanded = expanded.has(nodeId)
    const rowBackground = getRowBackground(meta.type, state)
    const rowBorder = getRowBorder(meta.type, state)
    const isDivisao = meta.type === 'divisao'

    return (
      <div key={nodeId} className={tw`${isDivisao ? 'mb-3' : ''}`}>
        <div
          className={tw`group flex items-center border-b transition-all duration-150 ${isDivisao ? 'rounded-lg border' : ''}`}
          style={{
            paddingLeft: `${config.indent}px`,
            minHeight: `${config.minHeight}px`,
            borderColor: rowBorder,
            backgroundColor: rowBackground,
            boxShadow: state === 'checked' ? `inset 3px 0 0 ${c.accent}` : state === 'partial' ? `inset 3px 0 0 ${c.warningBorder}` : 'none'
          }}
          onMouseEnter={event => { event.currentTarget.style.backgroundColor = state === 'unchecked' ? c.rowHover : rowBackground }}
          onMouseLeave={event => { event.currentTarget.style.backgroundColor = rowBackground || '' }}
        >
          <button
            type="button"
            onClick={() => hasChildren && toggleExpand(nodeId)}
            className={tw`w-11 h-11 flex items-center justify-center rounded-md transition-all duration-150 ${hasChildren ? 'hover:scale-105 active:scale-95' : 'cursor-default'}`}
            style={{ color: hasChildren ? c.iconChevron : c.textSubtle }}
            title={hasChildren ? (nodeExpanded ? 'Recolher' : 'Expandir') : undefined}
            aria-label={hasChildren ? (nodeExpanded ? 'Recolher nível' : 'Expandir nível') : 'Sem filhos'}
            aria-expanded={hasChildren ? nodeExpanded : undefined}
          >
            {hasChildren && (
              nodeExpanded
                ? <Icons.ChevronDown className={tw`w-4 h-4`} />
                : <Icons.ChevronRight className={tw`w-4 h-4`} />
            )}
          </button>

          <label className={tw`h-11 w-11 flex items-center justify-center cursor-pointer rounded-md transition-colors hover:bg-black/5`} title="Selecionar item">
            <Checkbox
              checked={isChecked}
              indeterminate={isPartial}
              onChange={(value) => toggleSelection(nodeId, value)}
              label={`Selecionar ${meta.type}`}
            />
          </label>

          <div className={tw`flex items-center flex-1 min-w-0 px-2`}>
            <Icon
              className={tw`${isDivisao ? 'mr-3' : 'mr-2'} flex-shrink-0`}
              style={{
                color: c[config.iconKey],
                width: `${config.iconSize}px`,
                height: `${config.iconSize}px`,
                minWidth: `${config.iconSize}px`,
                maxWidth: `${config.iconSize}px`,
                minHeight: `${config.iconSize}px`,
                maxHeight: `${config.iconSize}px`
              }}
            />
            {renderLabel(meta)}
            {isPartial && (
              <span className={tw`ml-3 text-xs px-2 py-0.5 rounded-full font-medium`} style={{ backgroundColor: c.treePartialBadgeBg || c.warningBadgeBg, color: c.treePartialText || c.warningText }}>
                Parcial
              </span>
            )}
          </div>

          <div className={tw`flex items-center flex-shrink-0`}>{renderMetaInfo(meta)}</div>
        </div>

        {hasChildren && nodeExpanded && (
          <div className={tw`overflow-hidden transition-all duration-200 ease-out`} style={{ animation: 'deskflow-tree-reveal 160ms ease-out' }}>
            {meta.childrenIds.map(renderNode)}
          </div>
        )}
      </div>
    )
  }

  return (
    <div className={tw`rounded-lg shadow-sm border overflow-hidden`} style={{ backgroundColor: c.cardBg, borderColor: c.border }}>
      <style>{`
        @keyframes deskflow-tree-reveal {
          from { opacity: 0; transform: translateY(-4px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>

      <div
        className={tw`flex items-center px-4 py-3 border-b`}
        style={{ backgroundColor: c.sectionBg, borderColor: c.border }}
      >
        <div className={tw`w-11`}></div>
        <div className={tw`w-11`}></div>
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

      <div className={tw`overflow-auto`} style={{ maxHeight: 'calc(100vh - 300px)' }}>
        {data.length === 0 ? (
          <div className={tw`text-center py-16`}>
            <Icons.Folder className={tw`w-12 h-12 mx-auto mb-4`} style={{ color: c.emptyIconLarge }} />
            <p className={tw`text-sm`} style={{ color: c.textSubtle }}>Nenhum dado disponível</p>
          </div>
        ) : (
          <div className={tw`p-3`}>
            {treeIndex.rootIds.map(renderNode)}
          </div>
        )}
      </div>

      <div
        className={tw`flex items-center justify-between px-4 py-3 border-t`}
        style={{ backgroundColor: c.sectionBg, borderColor: c.border }}
      >
        <div className={tw`flex items-center gap-3`}>
          <span className={tw`text-sm font-medium`} style={{ color: c.textSecondary }}>
            {selectionSummary.checkedCount} {selectionSummary.checkedCount === 1 ? 'item marcado' : 'itens marcados'}
          </span>
          {selectionSummary.partialCount > 0 && (
            <span className={tw`text-xs px-2 py-1 rounded-full font-medium`} style={{ backgroundColor: c.treePartialBadgeBg || c.warningBadgeBg, color: c.treePartialText || c.warningText }}>
              {selectionSummary.partialCount} parcial{selectionSummary.partialCount === 1 ? '' : 'is'}
            </span>
          )}
        </div>
        <div className={tw`text-xs`} style={{ color: c.textSubtle }}>
          {data.length} {data.length === 1 ? 'divisão' : 'divisões'} • {data.reduce((acc, d) => acc + (d.produtos?.length || 0), 0)} produtos
        </div>
      </div>
    </div>
  )
}