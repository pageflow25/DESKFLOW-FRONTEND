import axios from 'axios'

// Carregar todas as variáveis de ambiente do preload
const ENV = window.api?.env || {}
const API_BASE_URL = ENV.apiBaseUrl || 'http://localhost:8000'

console.log('[API Config] Base URL:', API_BASE_URL)

// Criar instância do axios
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
})

// Interceptor para adicionar token em todas as requisições
api.interceptors.request.use(
  (config) => {
    console.log('[API Request]', config.method?.toUpperCase(), config.url)
    const token = localStorage.getItem('token')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
      console.log('[API Request] Token adicionado')
    }
    return config
  },
  (error) => {
    console.error('[API Request Error]', error)
    return Promise.reject(error)
  }
)

// Interceptor para tratar erros de autenticação
api.interceptors.response.use(
  (response) => {
    console.log('[API Response]', response.status, response.config.url)
    return response
  },
  (error) => {
    console.error('[API Response Error]', error.response?.status, error.message)
    if (error.response?.status === 401) {
      // Token inválido ou expirado
      localStorage.removeItem('token')
      localStorage.removeItem('user')
      // Disparar evento personalizado para o app redirecionar
      window.dispatchEvent(new CustomEvent('auth:unauthorized'))
    }
    return Promise.reject(error)
  }
)

// Serviço de autenticação
export const authService = {
  login: async (username, password) => {
    const response = await api.post('/api/auth/login', { username, password })
    if (response.data.access_token) {
      localStorage.setItem('token', response.data.access_token)
      localStorage.setItem('user', JSON.stringify({
        id: response.data.user_id,
        name: response.data.user_name,
        roles: response.data.roles
      }))
    }
    return response.data
  },

  logout: () => {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
  },

  getCurrentUser: () => {
    const userStr = localStorage.getItem('user')
    return userStr ? JSON.parse(userStr) : null
  },

  isAuthenticated: () => {
    return !!localStorage.getItem('token')
  },

  isAdmin: () => {
    const user = authService.getCurrentUser()
    if (!user || !user.roles) return false
    const roles = user.roles.toLowerCase().split(',').map(r => r.trim())
    return roles.includes('admin')
  }
}

// Serviço de dashboard
export const dashboardService = {
  getEscolas: async () => {
    const response = await api.get('/api/dashboard/escolas')
    return response.data
  }
}

// Serviço de pedidos em cascata
export const pedidoService = {
  getPedidosEscolaCascata: async (escolaId, tipoFormulario = 'MEMOREX', idsFormularios = null, statusIds = null) => {
    const params = { tipo_formulario: tipoFormulario }
    if (idsFormularios && idsFormularios.length > 0) {
      params.ids_formularios = idsFormularios.join(',')
    }
    if (statusIds && statusIds.length > 0) {
      params.status_ids = statusIds.join(',')
    }
    const response = await api.get(`/api/pedidos/escola/${escolaId}/cascata`, { params })
    return response.data
  }
}

// Serviço de orçamento
export const orcamentoService = {
  gerarOrcamento: async (escolaId, idsProdutos, datasSaida, divisoesLogistica = null, diasUteisFiltro = null, dataEntrega = null, modoAgrupamento = 'unidade', gerarOp = true, idsFormularios = null, statusIds = null) => {
    const payload = {
      escola_id: escolaId,
      ids_produtos: idsProdutos,
      datas_saida: datasSaida,
      modo_agrupamento: modoAgrupamento,
      gerar_op: gerarOp
    }
    
    // Adicionar parâmetros opcionais se fornecidos
    if (divisoesLogistica && divisoesLogistica.length > 0) {
      payload.divisoes_logistica = divisoesLogistica
    }
    if (diasUteisFiltro && diasUteisFiltro.length > 0) {
      payload.dias_uteis_filtro = diasUteisFiltro
    }
    if (dataEntrega) {
      payload.data_entrega = dataEntrega
    }
    if (idsFormularios && idsFormularios.length > 0) {
      payload.ids_formularios = idsFormularios
    }
    if (statusIds && statusIds.length > 0) {
      payload.status_ids = statusIds
    }
    
    const response = await api.post('/api/orcamento/gerar', payload)
    return response.data
  }
}

export default api
