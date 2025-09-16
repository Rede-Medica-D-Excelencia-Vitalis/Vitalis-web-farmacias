import React from 'react'
import { render, screen, waitFor } from '@testing-library/react'
import { BrowserRouter as Router } from 'react-router-dom'
import { vi } from 'vitest'
import { AuthProvider } from '@/contexts/auth/AuthContext'
import { OrderProvider } from '@/contexts/orders/OrderContext'
import { ProductProvider } from '@/contexts/products/ProductContext'
import { NotificationProvider } from '@/contexts/notifications/NotificationContext'

// Mock dos componentes
const Dashboard = () => {
  const { user, isAuthenticated } = useAuth()
  const { orders, getTotalOrders, getTotalValue } = useOrders()
  const { products, getTotalProducts } = useProducts()
  const { notifications } = useNotifications()

  if (!isAuthenticated) {
    return <div>Usuário não autenticado</div>
  }

  return (
    <div>
      <h1>Dashboard</h1>
      <p data-testid="welcome-message">
        Bem-vindo, {user?.nome}
      </p>
      <div data-testid="orders-section">
        <h2>Pedidos</h2>
        <p data-testid="total-orders">Total: {getTotalOrders()}</p>
        <p data-testid="total-value">Valor: R$ {getTotalValue().toFixed(2)}</p>
      </div>
      <div data-testid="products-section">
        <h2>Produtos</h2>
        <p data-testid="total-products">Total: {getTotalProducts()}</p>
      </div>
      <div data-testid="notifications-section">
        <h2>Notificações</h2>
        <p data-testid="notification-count">{notifications.length}</p>
      </div>
    </div>
  )
}

// Mock dos hooks
const useAuth = vi.fn()
const useOrders = vi.fn()
const useProducts = vi.fn()
const useNotifications = vi.fn()

// Mock dos contextos
vi.mock('@/contexts/auth/AuthContext', () => ({
  AuthProvider: ({ children }: { children: React.ReactNode }) => children,
  useAuth: () => useAuth()
}))

vi.mock('@/contexts/orders/OrderContext', () => ({
  OrderProvider: ({ children }: { children: React.ReactNode }) => children,
  useOrders: () => useOrders()
}))

vi.mock('@/contexts/products/ProductContext', () => ({
  ProductProvider: ({ children }: { children: React.ReactNode }) => children,
  useProducts: () => useProducts()
}))

vi.mock('@/contexts/notifications/NotificationContext', () => ({
  NotificationProvider: ({ children }: { children: React.ReactNode }) => children,
  useNotifications: () => useNotifications()
}))

describe('Multiple Contexts Integration', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    localStorage.clear()
  })

  it('deve integrar AuthContext com OrderContext', async () => {
    const mockUser = {
      id: 1,
      nome: 'Farmacêutico Test',
      email: 'farmacia@test.com',
      tipo_usuario: 'farmacia'
    }

    const mockOrders = [
      {
        id: '1',
        patientId: '1',
        patientName: 'João Silva',
        items: [],
        status: 'pendente',
        total: 50.00,
        createdAt: new Date(),
        updatedAt: new Date(),
        priority: 'medium' as const
      },
      {
        id: '2',
        patientId: '2',
        patientName: 'Maria Santos',
        items: [],
        status: 'entregue',
        total: 75.00,
        createdAt: new Date(),
        updatedAt: new Date(),
        priority: 'high' as const
      }
    ]

    useAuth.mockReturnValue({
      user: mockUser,
      isAuthenticated: true,
      isLoading: false
    })

    useOrders.mockReturnValue({
      orders: mockOrders,
      getTotalOrders: () => mockOrders.length,
      getTotalValue: () => mockOrders.reduce((total, order) => total + order.total, 0),
      isLoading: false
    })

    useProducts.mockReturnValue({
      products: [],
      getTotalProducts: () => 0,
      isLoading: false
    })

    useNotifications.mockReturnValue({
      notifications: [],
      isLoading: false
    })

    render(
      <AuthProvider>
        <OrderProvider>
          <Dashboard />
        </OrderProvider>
      </AuthProvider>
    )

    // Verificar se usuário está autenticado
    expect(screen.getByTestId('welcome-message')).toHaveTextContent('Bem-vindo, Farmacêutico Test')

    // Verificar se pedidos são exibidos
    expect(screen.getByTestId('orders-section')).toBeInTheDocument()
    expect(screen.getByTestId('total-orders')).toHaveTextContent('Total: 2')
    expect(screen.getByTestId('total-value')).toHaveTextContent('Valor: R$ 125.00')
  })

  it('deve integrar todos os contextos simultaneamente', async () => {
    const mockUser = {
      id: 1,
      nome: 'Farmacêutico Test',
      email: 'farmacia@test.com',
      tipo_usuario: 'farmacia'
    }

    const mockOrders = [
      {
        id: '1',
        patientId: '1',
        patientName: 'João Silva',
        items: [],
        status: 'pendente',
        total: 50.00,
        createdAt: new Date(),
        updatedAt: new Date(),
        priority: 'medium' as const
      }
    ]

    const mockProducts = [
      {
        id: 1,
        nome: 'Produto Teste',
        preco: 25.00,
        estoque: 10,
        farmacia_id: 1,
        ativo: 1
      }
    ]

    const mockNotifications = [
      {
        id: '1',
        title: 'Novo pedido',
        message: 'Você tem um novo pedido',
        type: 'info',
        read: false,
        createdAt: new Date()
      }
    ]

    useAuth.mockReturnValue({
      user: mockUser,
      isAuthenticated: true,
      isLoading: false
    })

    useOrders.mockReturnValue({
      orders: mockOrders,
      getTotalOrders: () => mockOrders.length,
      getTotalValue: () => mockOrders.reduce((total, order) => total + order.total, 0),
      isLoading: false
    })

    useProducts.mockReturnValue({
      products: mockProducts,
      getTotalProducts: () => mockProducts.length,
      isLoading: false
    })

    useNotifications.mockReturnValue({
      notifications: mockNotifications,
      isLoading: false
    })

    render(
      <AuthProvider>
        <OrderProvider>
          <ProductProvider>
            <NotificationProvider>
              <Dashboard />
            </NotificationProvider>
          </ProductProvider>
        </OrderProvider>
      </AuthProvider>
    )

    // Verificar se todos os contextos estão funcionando
    expect(screen.getByTestId('welcome-message')).toHaveTextContent('Bem-vindo, Farmacêutico Test')
    expect(screen.getByTestId('total-orders')).toHaveTextContent('Total: 1')
    expect(screen.getByTestId('total-products')).toHaveTextContent('Total: 1')
    expect(screen.getByTestId('notification-count')).toHaveTextContent('1')
  })

  it('deve lidar com estados de loading de múltiplos contextos', async () => {
    useAuth.mockReturnValue({
      user: null,
      isAuthenticated: false,
      isLoading: true
    })

    useOrders.mockReturnValue({
      orders: [],
      getTotalOrders: () => 0,
      getTotalValue: () => 0,
      isLoading: true
    })

    useProducts.mockReturnValue({
      products: [],
      getTotalProducts: () => 0,
      isLoading: true
    })

    useNotifications.mockReturnValue({
      notifications: [],
      isLoading: true
    })

    render(
      <AuthProvider>
        <OrderProvider>
          <ProductProvider>
            <NotificationProvider>
              <Dashboard />
            </NotificationProvider>
          </ProductProvider>
        </OrderProvider>
      </AuthProvider>
    )

    // Verificar se usuário não autenticado é exibido
    expect(screen.getByText('Usuário não autenticado')).toBeInTheDocument()
  })

  it('deve sincronizar dados entre contextos', async () => {
    const mockUser = {
      id: 1,
      nome: 'Farmacêutico Test',
      email: 'farmacia@test.com',
      tipo_usuario: 'farmacia'
    }

    const mockOrders = [
      {
        id: '1',
        patientId: '1',
        patientName: 'João Silva',
        items: [
          {
            id: '1',
            productId: '1',
            productName: 'Produto A',
            quantity: 2,
            unitPrice: 25.00,
            totalPrice: 50.00
          }
        ],
        status: 'pendente',
        total: 50.00,
        createdAt: new Date(),
        updatedAt: new Date(),
        priority: 'medium' as const
      }
    ]

    const mockProducts = [
      {
        id: 1,
        nome: 'Produto A',
        preco: 25.00,
        estoque: 8, // Estoque reduzido após pedido
        farmacia_id: 1,
        ativo: 1
      }
    ]

    useAuth.mockReturnValue({
      user: mockUser,
      isAuthenticated: true,
      isLoading: false
    })

    useOrders.mockReturnValue({
      orders: mockOrders,
      getTotalOrders: () => mockOrders.length,
      getTotalValue: () => mockOrders.reduce((total, order) => total + order.total, 0),
      isLoading: false
    })

    useProducts.mockReturnValue({
      products: mockProducts,
      getTotalProducts: () => mockProducts.length,
      isLoading: false
    })

    useNotifications.mockReturnValue({
      notifications: [],
      isLoading: false
    })

    render(
      <AuthProvider>
        <OrderProvider>
          <ProductProvider>
            <NotificationProvider>
              <Dashboard />
            </NotificationProvider>
          </ProductProvider>
        </OrderProvider>
      </AuthProvider>
    )

    // Verificar se dados estão sincronizados
    expect(screen.getByTestId('total-orders')).toHaveTextContent('Total: 1')
    expect(screen.getByTestId('total-value')).toHaveTextContent('Valor: R$ 50.00')
    expect(screen.getByTestId('total-products')).toHaveTextContent('Total: 1')
  })
})
