import mascoteCompleto from '../assets/mascotes/01-flow-mascote-completo.svg'
import mascoteIsolado from '../assets/mascotes/02-flow-mascote-isolado.svg'
import mascoteAcenando from '../assets/mascotes/03-pose-acenando.svg'
import mascoteAprovado from '../assets/mascotes/04-pose-pedido-aprovado.svg'
import mascoteProcessando from '../assets/mascotes/05-pose-processando.svg'
import mascoteAtencao from '../assets/mascotes/06-pose-atencao.svg'
import mascotePensando from '../assets/mascotes/07-pose-pensando.svg'
import mascoteApontando from '../assets/mascotes/08-pose-apontando.svg'
import mascoteManutencao from '../assets/mascotes/09-pose-manutencao.svg'
import mascoteEntrega from '../assets/mascotes/10-pose-entrega-pronta.svg'
import mascoteAvatar from '../assets/mascotes/11-avatar-icone.svg'

const POSES = {
  completo: mascoteCompleto,
  isolado: mascoteIsolado,
  acenando: mascoteAcenando,
  aprovado: mascoteAprovado,
  processando: mascoteProcessando,
  atencao: mascoteAtencao,
  pensando: mascotePensando,
  apontando: mascoteApontando,
  manutencao: mascoteManutencao,
  entrega: mascoteEntrega,
  avatar: mascoteAvatar,
}

const LABELS = {
  completo: 'Flow — mascote completo',
  isolado: 'Flow — mascote isolado',
  acenando: 'Flow acenando — boas-vindas',
  aprovado: 'Flow — pedido aprovado',
  processando: 'Flow — processando',
  atencao: 'Flow — atenção',
  pensando: 'Flow — pensando',
  apontando: 'Flow — apontando',
  manutencao: 'Flow — manutenção',
  entrega: 'Flow — entrega pronta',
  avatar: 'Flow — avatar',
}

/**
 * Componente do mascote Flow.
 *
 * @param {object}   props
 * @param {string}   props.pose      - Nome da pose (acenando, aprovado, processando, etc.)
 * @param {number}   [props.size=160] - Tamanho em px (largura e altura)
 * @param {string}   [props.className]
 * @param {object}   [props.style]
 */
export default function Mascote({ pose = 'completo', size = 160, className = '', style = {} }) {
  const src = POSES[pose]
  if (!src) return null

  return (
    <img
      src={src}
      alt={LABELS[pose] || `Flow — ${pose}`}
      width={size}
      height={size}
      className={className}
      style={{ objectFit: 'contain', userSelect: 'none', ...style }}
      draggable={false}
    />
  )
}
