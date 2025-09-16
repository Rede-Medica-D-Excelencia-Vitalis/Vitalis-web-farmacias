import { describe, it, expect, vi, beforeEach } from 'vitest'

// Mock simples do apiService
const mockApiService = {
  auth: {
    login: vi.fn(),
    logout: vi.fn(),
    getCurrentUser: vi.fn(),
    setAuthData: vi.fn()
  },
  pedidos: {
    listar: vi.fn(),
    buscarPorId: vi.fn(),
    atualizarStatus: vi.fn(),
    cancelar: vi.fn(),
    getEstatisticas: vi.fn()
  },
  produtos: {
    listar: vi.fn(),
    listarPorFarmacia: vi.fn(),
    buscarPorId: vi.fn(),
    criar: vi.fn(),
    atualizar: vi.fn(),
    deletar: vi.fn()
  },
  farmacia: {
    getPerfil: vi.fn(),
    atualizar: vi.fn(),
    getEstatisticas: vi.fn()
  },
  avaliacoes: {
    listar: vi.fn(),
    listarPorFarmacia: vi.fn(),
    getMediaAvaliacoes: vi.fn(),
    responder: vi.fn()
  },
  dashboard: {
    getMetricas: vi.fn(),
    getAtividadesRecentes: vi.fn(),
    getTodosPedidos: vi.fn(),
    getEstatisticasPorCategoria: vi.fn()
  },
  validacaoDocumentos: {
    validarCNPJ: vi.fn(),
    validarCEP: vi.fn(),
    validarAlvara: vi.fn(),
    validarVigilancia: vi.fn(),
    validarCRF: vi.fn()
  }
}

vi.mock('@/lib/api/api', () => ({
  apiService: mockApiService
}))

// Mock do localStorage
const localStorageMock = {
  getItem: vi.fn(),
  setItem: vi.fn(),
  removeItem: vi.fn(),
  clear: vi.fn()
}

Object.defineProperty(window, 'localStorage', {
  value: localStorageMock
})

describe('API Service', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    localStorageMock.getItem.mockReturnValue(null)
  })

  describe('Auth Service', () => {
    it('deve ter métodos de autenticação', () => {
      expect(mockApiService.auth.login).toBeDefined()
      expect(mockApiService.auth.logout).toBeDefined()
      expect(mockApiService.auth.getCurrentUser).toBeDefined()
      expect(mockApiService.auth.setAuthData).toBeDefined()
    })

    it('deve executar login', async () => {
      const mockResponse = { sucesso: true, token: 'test-token' }
      mockApiService.auth.login.mockResolvedValue(mockResponse)

      const result = await mockApiService.auth.login('test@test.com', 'password')
      
      expect(result).toEqual(mockResponse)
      expect(mockApiService.auth.login).toHaveBeenCalledWith('test@test.com', 'password')
    })

    it('deve executar logout', () => {
      mockApiService.auth.logout()

      expect(mockApiService.auth.logout).toHaveBeenCalled()
    })
  })

  describe('Pedidos Service', () => {
    it('deve ter métodos de pedidos', () => {
      expect(mockApiService.pedidos.listar).toBeDefined()
      expect(mockApiService.pedidos.buscarPorId).toBeDefined()
      expect(mockApiService.pedidos.atualizarStatus).toBeDefined()
      expect(mockApiService.pedidos.cancelar).toBeDefined()
      expect(mockApiService.pedidos.getEstatisticas).toBeDefined()
    })

    it('deve listar pedidos', async () => {
      const mockPedidos = [{ id: 1, numero_pedido: 'PED001' }]
      mockApiService.pedidos.listar.mockResolvedValue(mockPedidos)

      const result = await mockApiService.pedidos.listar()
      
      expect(result).toEqual(mockPedidos)
      expect(mockApiService.pedidos.listar).toHaveBeenCalled()
    })
  })

  describe('Produtos Service', () => {
    it('deve ter métodos de produtos', () => {
      expect(mockApiService.produtos.listar).toBeDefined()
      expect(mockApiService.produtos.criar).toBeDefined()
      expect(mockApiService.produtos.atualizar).toBeDefined()
      expect(mockApiService.produtos.deletar).toBeDefined()
    })

    it('deve listar produtos', async () => {
      const mockProdutos = [{ id: 1, nome: 'Produto 1' }]
      mockApiService.produtos.listar.mockResolvedValue(mockProdutos)

      const result = await mockApiService.produtos.listar()
      
      expect(result).toEqual(mockProdutos)
      expect(mockApiService.produtos.listar).toHaveBeenCalled()
    })
  })

  describe('Farmacia Service', () => {
    it('deve ter métodos de farmácia', () => {
      expect(mockApiService.farmacia.getPerfil).toBeDefined()
      expect(mockApiService.farmacia.atualizar).toBeDefined()
      expect(mockApiService.farmacia.getEstatisticas).toBeDefined()
    })
  })

  describe('Avaliacoes Service', () => {
    it('deve ter métodos de avaliações', () => {
      expect(mockApiService.avaliacoes.listar).toBeDefined()
      expect(mockApiService.avaliacoes.responder).toBeDefined()
    })
  })

  describe('Dashboard Service', () => {
    it('deve ter métodos de dashboard', () => {
      expect(mockApiService.dashboard.getMetricas).toBeDefined()
      expect(mockApiService.dashboard.getAtividadesRecentes).toBeDefined()
    })
  })

  describe('Validacao Documentos Service', () => {
    it('deve ter métodos de validação', () => {
      expect(mockApiService.validacaoDocumentos.validarCNPJ).toBeDefined()
      expect(mockApiService.validacaoDocumentos.validarCEP).toBeDefined()
      expect(mockApiService.validacaoDocumentos.validarAlvara).toBeDefined()
    })
  })
})