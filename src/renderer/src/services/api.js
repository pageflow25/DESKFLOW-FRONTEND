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

export const parseApiError = (error, fallbackMessage = 'Ocorreu um erro inesperado') => {
  if (!error) {
    return {
      type: 'unknown',
      message: fallbackMessage,
      detail: null,
      statusCode: null
    }
  }

  if (error.isDeskflowBusinessError) {
    return {
      type: error.type || 'validation',
      message: error.userMessage || fallbackMessage,
      detail: error.detail || null,
      statusCode: null
    }
  }

  const status = error.response?.status
  const payload = error.response?.data
  const detail = payload?.detail || payload?.message || null

  if (!error.response) {
    return {
      type: 'communication',
      message: 'Falha de comunicação com a API. Verifique conexão/rede e tente novamente.',
      detail: error.message || null,
      statusCode: null
    }
  }

  if (status === 400 || status === 409 || status === 422) {
    return {
      type: 'validation',
      message: detail || 'Não foi possível processar o envio devido a dados inválidos.',
      detail,
      statusCode: status
    }
  }

  if (status >= 500) {
    return {
      type: 'server',
      message: detail || 'Erro interno no servidor durante o envio para integração.',
      detail,
      statusCode: status
    }
  }

  return {
    type: 'unknown',
    message: detail || fallbackMessage,
    detail,
    statusCode: status || null
  }
}

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
  getPedidosEscolaCascata: async (escolaId, tipoFormulario = null, idsFormularios = null, statusIds = null) => {
    const params = {}
    if (tipoFormulario && String(tipoFormulario).trim()) {
      params.tipo_formulario = tipoFormulario
    }
    if (idsFormularios && idsFormularios.length > 0) {
      params.ids_formularios = idsFormularios.join(',')
    }
    if (statusIds && statusIds.length > 0) {
      params.status_ids = statusIds.join(',')
    }
    const response = await api.get(`/api/pedidos/escola/${escolaId}/cascata`, { params })
    return response.data
  },

  getStatusDeskflow: async () => {
    const response = await api.get('/api/pedidos/status-deskflow')
    return response.data
  }
}

// Serviço de orçamento
export const orcamentoService = {
  gerarOrcamento: async (escolaId, idsProdutos, datasSaida, divisoesLogistica = null, diasUteisFiltro = null, dataEntrega = null, modoAgrupamento = 'unidade', gerarOp = true, idsFormularios = null, statusIds = null, baixarArquivos = false, idsUnidades = null, idsArquivos = null) => {
    const payload = {
      escola_id: escolaId,
      ids_produtos: idsProdutos,
      datas_saida: datasSaida,
      modo_agrupamento: modoAgrupamento,
      gerar_op: gerarOp,
      baixar_arquivos: baixarArquivos
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
    if (idsUnidades && idsUnidades.length > 0) {
      payload.ids_unidades = idsUnidades
    }
    if (idsArquivos && idsArquivos.length > 0) {
      payload.ids_arquivos = idsArquivos
    }
    
    const response = await api.post('/api/orcamento/gerar', payload)
    const result = response.data

    if (Array.isArray(result?.erros) && result.erros.length > 0) {
      const err = new Error(result.erros[0])
      err.isDeskflowBusinessError = true
      err.type = 'validation'
      err.detail = result.erros.join(' | ')
      err.userMessage = `Falha no envio de pedidos: ${result.erros[0]}`
      throw err
    }

    return result
  },

  getLotesDisparo: async (limit = 10, offset = 0) => {
    const response = await api.get('/api/orcamento/lotes/disparos', {
      params: { limit, offset }
    })
    return response.data
  }
}

export default api
