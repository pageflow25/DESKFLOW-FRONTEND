import { tw } from '@twind/core'

/**
 * ToggleGerarOP — Componente toggle reutilizável para controle de geração de OP.
 *
 * Props:
 *   value    (bool)     — Estado atual do toggle (true = gerar OP)
 *   onChange  (fn)      — Callback chamado com o novo valor (true/false)
 *   disabled (bool)     — Se o toggle está desabilitado
 *   label    (string)   — Label customizado (opcional)
 */
export default function ToggleGerarOP({
    value = true,
    onChange,
    disabled = false,
    label = 'Gerar OP (Ordem de Produção)'
}) {
    const handleToggle = () => {
        if (!disabled && onChange) {
            onChange(!value)
        }
    }

    return (
        <div className={tw`flex items-center justify-between`}>
            <div className={tw`flex-1`}>
                <span
                    className={tw`text-sm font-medium`}
                    style={{ color: disabled ? '#94a3b8' : '#334155' }}
                >
                    {label}
                </span>
                <p className={tw`text-xs mt-0.5`} style={{ color: '#94a3b8' }}>
                    {value
                        ? 'A OP será gerada automaticamente ao aprovar'
                        : 'A aprovação será feita sem gerar OP'}
                </p>
            </div>

            <button
                type="button"
                role="switch"
                aria-checked={value}
                disabled={disabled}
                onClick={handleToggle}
                className={tw`
          relative inline-flex h-6 w-11 flex-shrink-0 rounded-full 
          border-2 border-transparent transition-colors duration-200 ease-in-out
          focus:outline-none focus:ring-2 focus:ring-offset-2
          ${disabled ? 'cursor-not-allowed opacity-50' : 'cursor-pointer'}
        `}
                style={{
                    backgroundColor: value ? '#10b981' : '#cbd5e1',
                    focusRingColor: '#3b82f6'
                }}
            >
                <span
                    className={tw`
            pointer-events-none inline-block h-5 w-5 rounded-full 
            bg-white shadow transform ring-0 transition duration-200 ease-in-out
          `}
                    style={{
                        transform: value ? 'translateX(20px)' : 'translateX(0px)'
                    }}
                />
            </button>
        </div>
    )
}
