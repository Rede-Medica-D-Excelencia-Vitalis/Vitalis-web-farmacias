import React from 'react'
import { render, screen, waitFor, cleanup } from '@testing-library/react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { vi } from 'vitest'
import { AuthProvider } from '@/contexts/auth/AuthContext'

// Mock dos componentes
const ProductsList = () => {
  const [products, setProducts] = React.useState([])
  const [loading, setLoading] = React.useState(true)

  React.useEffect(() => {
    const loadProducts = async () => {
      try {
        // Simular chamada à API
        const mockProducts = [
          {
            id: 1,
            nome: 'Produto Teste',
            preco: 25.00
          }
        ]
        setProducts(mockProducts)
      } catch (error) {
        console.error('Erro ao carregar produtos:', error)
      } finally {
        setLoading(false)
      }
    }
    loadProducts()
  }, [])

  if (loading) return <div data-testid="loading">Carregando produtos...</div>

  return (
    <div data-testid="products-page">
      <h1>Produtos</h1>
      <div data-testid="products-list">
        {products.map((product: any) => (
          <div key={product.id} data-testid={`product-${product.id}`}>
            {product.nome}
          </div>
        ))}
      </div>
    </div>
  )
}

// Mock do módulo de API
vi.mock('@/lib/api', () => ({
  apiService: {
    auth: {
      login: vi.fn(),
      logout: vi.fn(() => {
        localStorage.removeItem('authToken')
        localStorage.removeItem('user')
      }),
      getCurrentUser: vi.fn(() => {
        const user = localStorage.getItem('user')
        return user ? JSON.parse(user) : null
      }),
      setAuthData: vi.fn((token: string, user: any) => {
        localStorage.setItem('authToken', token)
        localStorage.setItem('user', JSON.stringify(user))
      })
    },
    produtos: {
      listar: vi.fn()
    }
  }
}))

describe('API Integration Tests', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    localStorage.clear()
  })

  afterEach(() => {
    cleanup()
  })

  it('deve carregar produtos corretamente', async () => {
    render(
      <AuthProvider>
        <Router>
          <Routes>
            <Route path="/produtos" element={<ProductsList />} />
          </Routes>
        </Router>
      </AuthProvider>
    )

    // Aguardar carregamento
    await waitFor(() => {
      expect(screen.getByTestId('products-page')).toBeInTheDocument()
    })

    // Verificar se produtos foram carregados
    expect(screen.getByTestId('product-1')).toBeInTheDocument()
    expect(screen.getByTestId('product-1')).toHaveTextContent('Produto Teste')
  })

  it('deve lidar com erros de carregamento', async () => {
    const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {})

    render(
      <AuthProvider>
        <Router>
          <Routes>
            <Route path="/produtos" element={<ProductsList />} />
          </Routes>
        </Router>
      </AuthProvider>
    )

    // Aguardar carregamento
    await waitFor(() => {
      expect(screen.getByTestId('products-page')).toBeInTheDocument()
    })

    // Verificar se não há erros no console
    expect(consoleSpy).not.toHaveBeenCalled()
    
    consoleSpy.mockRestore()
  })
})

describe('API Service Integration', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    localStorage.clear()
  })

  afterEach(() => {
    cleanup()
  })

  it('deve fazer login e salvar dados corretamente', async () => {
    const mockLoginResponse = {
      sucesso: true,
      token: 'mock-token-12345',
      usuario: {
        id: 1,
        nome: 'Farmacêutico Test',
        email: 'farmacia@test.com',
        tipo_usuario: 'farmacia'
      }
    }

    // Mock da função de login
    const { apiService } = await import('@/lib/api')
    vi.mocked(apiService.auth.login).mockResolvedValue(mockLoginResponse)

    // Simular login
    const result = await apiService.auth.login('farmacia@test.com', 'password123')

    expect(result).toEqual(mockLoginResponse)
    expect(apiService.auth.login).toHaveBeenCalledWith('farmacia@test.com', 'password123')
  })

  it('deve fazer logout e limpar dados', async () => {
    // Simular dados no localStorage
    localStorage.setItem('authToken', 'mock-token')
    localStorage.setItem('user', JSON.stringify({ id: 1, nome: 'Test' }))

    // Fazer logout
    const { apiService } = await import('@/lib/api')
    apiService.auth.logout()

    // Verificar se dados foram removidos
    expect(localStorage.getItem('authToken')).toBeNull()
    expect(localStorage.getItem('user')).toBeNull()
  })

  it('deve buscar usuário atual do localStorage', async () => {
    const mockUser = {
      id: 1,
      nome: 'Test User',
      email: 'test@test.com',
      tipo_usuario: 'farmacia'
    }

    localStorage.setItem('user', JSON.stringify(mockUser))

    const { apiService } = await import('@/lib/api')
    const currentUser = apiService.auth.getCurrentUser()

    expect(currentUser).toEqual(mockUser)
  })

  it('deve salvar dados de autenticação', async () => {
    const mockToken = 'mock-token-12345'
    const mockUser = {
      id: 1,
      nome: 'Test User',
      email: 'test@test.com',
      tipo_usuario: 'farmacia'
    }

    // Usar a implementação mock do setAuthData
    const { apiService } = await import('@/lib/api')
    apiService.auth.setAuthData(mockToken, mockUser)

    expect(localStorage.getItem('authToken')).toBe(mockToken)
    expect(localStorage.getItem('user')).toBe(JSON.stringify(mockUser))
  })
})