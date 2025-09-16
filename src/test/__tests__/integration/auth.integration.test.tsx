import React from 'react'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { vi } from 'vitest'
import { AuthProvider } from '@/contexts/auth/AuthContext'

// Mock dos componentes
const Login = () => (
  <div data-testid="login-page">
    <h1>Login</h1>
    <form>
      <input data-testid="email-input" type="email" placeholder="Email" />
      <input data-testid="password-input" type="password" placeholder="Senha" />
      <button data-testid="login-button" type="submit">Entrar</button>
    </form>
  </div>
)

const Dashboard = () => (
  <div data-testid="dashboard-page">
    <h1>Dashboard</h1>
    <button data-testid="logout-button">Sair</button>
  </div>
)

// Mock do ProtectedRoute
const ProtectedRoute = ({ children, allowedTypes }: { children: React.ReactNode, allowedTypes: string[] }) => {
  const { user } = React.useContext(React.createContext({ user: null }))
  
  if (!user) {
    return <Login />
  }
  
  if (!allowedTypes.includes(user.tipo_usuario)) {
    return <Login />
  }
  
  return <>{children}</>
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
    }
  }
}))

describe('Authentication Integration Flow', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    localStorage.clear()
  })

  it('deve fazer login e redirecionar para dashboard', async () => {
    const mockUser = {
      id: 1,
      nome: 'Farmacêutico',
      email: 'farmacia@test.com',
      tipo_usuario: 'farmacia'
    }

    const mockResponse = {
      sucesso: true,
      token: 'mock-token',
      usuario: mockUser
    }

    const { apiService } = await import('@/lib/api')
    vi.mocked(apiService.auth.login).mockResolvedValue(mockResponse)
    vi.mocked(apiService.auth.setAuthData).mockImplementation(() => {
      localStorage.setItem('authToken', mockResponse.token)
      localStorage.setItem('user', JSON.stringify(mockUser))
    })
    vi.mocked(apiService.auth.getCurrentUser).mockReturnValue(null) // Inicialmente não logado

    render(
      <Router>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/dashboard" element={
            <ProtectedRoute allowedTypes={['farmacia']}>
              <Dashboard />
            </ProtectedRoute>
          } />
        </Routes>
      </Router>
    )

    // Aguardar renderização inicial
    await waitFor(() => {
      expect(screen.getByTestId('login-page')).toBeInTheDocument()
    })

    // Preencher formulário de login
    fireEvent.change(screen.getByTestId('email-input'), {
      target: { value: 'farmacia@test.com' }
    })
    fireEvent.change(screen.getByTestId('password-input'), {
      target: { value: 'password123' }
    })

    // Submeter formulário
    fireEvent.click(screen.getByTestId('login-button'))

    // Simular login bem-sucedido
    vi.mocked(apiService.auth.getCurrentUser).mockReturnValue(mockUser)

    // Aguardar redirecionamento
    await waitFor(() => {
      expect(screen.getByTestId('dashboard-page')).toBeInTheDocument()
    })

    // Verificar se dados foram salvos
    expect(localStorage.getItem('authToken')).toBe('mock-token')
    expect(localStorage.getItem('user')).toBe(JSON.stringify(mockUser))
  })

  it('deve fazer logout e redirecionar para login', async () => {
    // Simular usuário logado
    const mockUser = {
      id: 1,
      nome: 'Test',
      email: 'test@test.com',
      tipo_usuario: 'farmacia'
    }
    
    localStorage.setItem('authToken', 'mock-token')
    localStorage.setItem('user', JSON.stringify(mockUser))
    
    const { apiService } = await import('@/lib/api')
    vi.mocked(apiService.auth.getCurrentUser).mockReturnValue(mockUser)
    vi.mocked(apiService.auth.logout).mockImplementation(() => {
      localStorage.removeItem('authToken')
      localStorage.removeItem('user')
    })

    render(
      <Router>
        <Routes>
          <Route path="/dashboard" element={
            <ProtectedRoute allowedTypes={['farmacia']}>
              <Dashboard />
            </ProtectedRoute>
          } />
          <Route path="/login" element={<Login />} />
        </Routes>
      </Router>
    )

    // Aguardar renderização do dashboard
    await waitFor(() => {
      expect(screen.getByTestId('dashboard-page')).toBeInTheDocument()
    })

    // Clicar em logout
    fireEvent.click(screen.getByTestId('logout-button'))

    // Simular logout
    vi.mocked(apiService.auth.getCurrentUser).mockReturnValue(null)

    // Verificar redirecionamento
    await waitFor(() => {
      expect(screen.getByTestId('login-page')).toBeInTheDocument()
    })

    // Verificar se dados foram removidos
    expect(localStorage.getItem('authToken')).toBeNull()
    expect(localStorage.getItem('user')).toBeNull()
  })
})

describe('Route Protection Integration', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    localStorage.clear()
  })

  it('deve redirecionar usuário não autenticado', async () => {
    const { apiService } = await import('@/lib/api')
    vi.mocked(apiService.auth.getCurrentUser).mockReturnValue(null)

    render(
      <Router>
        <Routes>
          <Route path="/dashboard" element={
            <ProtectedRoute allowedTypes={['farmacia']}>
              <Dashboard />
            </ProtectedRoute>
          } />
          <Route path="/login" element={<Login />} />
        </Routes>
      </Router>
    )

    // Aguardar renderização inicial
    await waitFor(() => {
      expect(screen.getByTestId('login-page')).toBeInTheDocument()
    })
  })

  it('deve permitir acesso para usuário autenticado', async () => {
    const mockUser = {
      id: 1,
      nome: 'Test',
      email: 'test@test.com',
      tipo_usuario: 'farmacia'
    }

    localStorage.setItem('authToken', 'mock-token')
    localStorage.setItem('user', JSON.stringify(mockUser))
    
    const { apiService } = await import('@/lib/api')
    vi.mocked(apiService.auth.getCurrentUser).mockReturnValue(mockUser)

    render(
      <Router>
        <Routes>
          <Route path="/dashboard" element={
            <ProtectedRoute allowedTypes={['farmacia']}>
              <Dashboard />
            </ProtectedRoute>
          } />
        </Routes>
      </Router>
    )

    // Aguardar renderização do dashboard
    await waitFor(() => {
      expect(screen.getByTestId('dashboard-page')).toBeInTheDocument()
    })
  })

  it('deve negar acesso para tipo de usuário não permitido', async () => {
    const mockUser = {
      id: 1,
      nome: 'Test',
      email: 'test@test.com',
      tipo_usuario: 'paciente'
    }

    localStorage.setItem('authToken', 'mock-token')
    localStorage.setItem('user', JSON.stringify(mockUser))
    
    const { apiService } = await import('@/lib/api')
    vi.mocked(apiService.auth.getCurrentUser).mockReturnValue(mockUser)

    render(
      <Router>
        <Routes>
          <Route path="/dashboard" element={
            <ProtectedRoute allowedTypes={['farmacia']}>
              <Dashboard />
            </ProtectedRoute>
          } />
          <Route path="/login" element={<Login />} />
        </Routes>
      </Router>
    )

    // Aguardar redirecionamento para login
    await waitFor(() => {
      expect(screen.getByTestId('login-page')).toBeInTheDocument()
    })
  })
})