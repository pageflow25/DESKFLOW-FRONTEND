import { createContext, useContext, useState, useEffect, useMemo } from 'react'

const ThemeContext = createContext(null)

// ============================================
// PALETAS DE CORES
// ============================================
const lightColors = {
  // Backgrounds
  pageBg: '#f1f5f9',
  headerBg: '#ffffff',
  cardBg: '#ffffff',
  sectionBg: '#f8fafc',
  inputBg: '#ffffff',
  modalOverlay: 'rgba(0,0,0,0.5)',
  modalBg: '#ffffff',

  // Borders
  border: '#e2e8f0',
  borderLight: '#f1f5f9',
  borderSubtle: '#f1f5f9',

  // Text
  textPrimary: '#0f172a',
  textSecondary: '#334155',
  textMuted: '#64748b',
  textSubtle: '#94a3b8',
  textOnPrimary: '#ffffff',

  // Accent / Brand
  accent: '#3b82f6',
  accentHover: '#2563eb',
  accentBg: '#eff6ff',
  accentBgStrong: '#dbeafe',
  accentText: '#1d4ed8',

  // Status
  success: '#10b981',
  successBg: '#f0fdf4',
  successBg2: '#10b981',
  successBorder: '#bbf7d0',
  successText: '#16a34a',
  error: '#dc2626',
  errorBg: '#fef2f2',
  errorBorder: '#fecaca',
  errorText: '#dc2626',
  warningBg: '#fffbeb',
  warningBorder: '#f59e0b',
  warningText: '#92400e',
  warningBadgeBg: '#fef3c7',

  // Tree / Table
  rowHover: '#f8fafc',
  rowSelected: 'bg-blue-50',
  rowAlt: '#fafafa',
  rowDeep: '#f8f9fa',
  rowDeepest: '#fdfdfd',
  divGradient: 'bg-gradient-to-r from-slate-100 to-slate-50',
  divSelectedBg: 'bg-blue-50 border-blue-300',
  treeSelectedBg: '#eff6ff',
  treeSelectedBorder: '#93c5fd',
  treePartialBg: '#fffbeb',
  treePartialBorder: '#f59e0b',
  treePartialBadgeBg: '#fef3c7',
  treePartialText: '#92400e',

  // Icons
  iconFolder: '#f59e0b',
  iconPackage: '#6366f1',
  iconCalendar: '#10b981',
  iconDocument: '#ef4444',
  iconBuilding: '#8b5cf6',
  iconChevron: '#6b7280',
  iconChevronSub: '#9ca3af',

  // Badges
  badgeBg: '#e0e7ff',
  badgeText: '#4338ca',
  selectionBadgeBg: '#dbeafe',
  selectionBadgeText: '#1d4ed8',
  emptyBadgeBg: '#f1f5f9',
  emptyBadgeText: '#64748b',

  // Misc
  disabledBg: '#e2e8f0',
  disabledText: '#94a3b8',
  toggleOff: '#cbd5e1',
  loginBadgeBg: '#eff6ff',
  loginBadgeText: '#3b82f6',
  emptyIcon: '#cbd5e1',
  emptyIconLarge: '#d1d5db',

  // Focus ring on input (twind class portion)
  focusRing: 'focus:ring-blue-500',
  hoverBg: 'hover:bg-gray-100',
  hoverBgSubtle: 'hover:bg-gray-50',
  hoverBgSlate: 'hover:bg-slate-50',
}

const darkColors = {
  // Backgrounds
  pageBg: '#0f172a',
  headerBg: '#1e293b',
  cardBg: '#1e293b',
  sectionBg: '#1e293b',
  inputBg: '#0f172a',
  modalOverlay: 'rgba(0,0,0,0.7)',
  modalBg: '#1e293b',

  // Borders
  border: '#334155',
  borderLight: '#334155',
  borderSubtle: '#1e293b',

  // Text
  textPrimary: '#f1f5f9',
  textSecondary: '#e2e8f0',
  textMuted: '#94a3b8',
  textSubtle: '#64748b',
  textOnPrimary: '#ffffff',

  // Accent / Brand
  accent: '#60a5fa',
  accentHover: '#3b82f6',
  accentBg: '#1e3a5f',
  accentBgStrong: '#1e3a8a',
  accentText: '#93c5fd',

  // Status
  success: '#34d399',
  successBg: '#064e3b',
  successBg2: '#059669',
  successBorder: '#065f46',
  successText: '#6ee7b7',
  error: '#f87171',
  errorBg: '#450a0a',
  errorBorder: '#7f1d1d',
  errorText: '#fca5a5',
  warningBg: '#451a03',
  warningBorder: '#b45309',
  warningText: '#fbbf24',
  warningBadgeBg: '#451a03',

  // Tree / Table
  rowHover: '#1e293b',
  rowSelected: 'bg-blue-900/30',
  rowAlt: '#162032',
  rowDeep: '#1a2436',
  rowDeepest: '#162032',
  divGradient: 'bg-gradient-to-r from-slate-800 to-slate-700',
  divSelectedBg: 'bg-blue-900/40 border-blue-700',
  treeSelectedBg: '#1e3a5f',
  treeSelectedBorder: '#60a5fa',
  treePartialBg: '#451a03',
  treePartialBorder: '#b45309',
  treePartialBadgeBg: '#78350f',
  treePartialText: '#fbbf24',

  // Icons
  iconFolder: '#fbbf24',
  iconPackage: '#818cf8',
  iconCalendar: '#34d399',
  iconDocument: '#f87171',
  iconBuilding: '#a78bfa',
  iconChevron: '#9ca3af',
  iconChevronSub: '#6b7280',

  // Badges
  badgeBg: '#312e81',
  badgeText: '#a5b4fc',
  selectionBadgeBg: '#1e3a8a',
  selectionBadgeText: '#93c5fd',
  emptyBadgeBg: '#1e293b',
  emptyBadgeText: '#94a3b8',

  // Misc
  disabledBg: '#334155',
  disabledText: '#64748b',
  toggleOff: '#475569',
  loginBadgeBg: '#1e3a5f',
  loginBadgeText: '#60a5fa',
  emptyIcon: '#475569',
  emptyIconLarge: '#374151',

  // Focus ring on input
  focusRing: 'focus:ring-blue-400',
  hoverBg: 'hover:bg-slate-700',
  hoverBgSubtle: 'hover:bg-slate-700',
  hoverBgSlate: 'hover:bg-slate-700',
}

// ============================================
// PROVIDER
// ============================================
export const ThemeProvider = ({ children }) => {
  const [isDark, setIsDark] = useState(() => {
    try {
      const saved = localStorage.getItem('deskflow-theme')
      return saved === 'dark'
    } catch {
      return false
    }
  })

  useEffect(() => {
    try {
      localStorage.setItem('deskflow-theme', isDark ? 'dark' : 'light')
    } catch {
      // ignore
    }
  }, [isDark])

  const toggleTheme = () => setIsDark(prev => !prev)

  const colors = useMemo(() => (isDark ? darkColors : lightColors), [isDark])

  const value = useMemo(() => ({
    isDark,
    toggleTheme,
    colors
  }), [isDark, colors])

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
}

export const useTheme = () => {
  const context = useContext(ThemeContext)
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider')
  }
  return context
}
