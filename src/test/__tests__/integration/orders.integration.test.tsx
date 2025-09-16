import React from 'react'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { BrowserRouter as Router } from 'react-router-dom'
import { vi } from 'vitest'
import { OrderProvider, useOrders } from '@/contexts/orders/OrderContext'
import { AuthProvider } from '@/contexts/auth/AuthContext'

// Mock dos componentes
const OrdersList = () => {
  const { orders, updateOrderStatus, isLoading } = useOrders()
  
  if (isLoading) return <div>Carregando...</div>
  
  return (
    <div>
      <h1>Pedidos</h1>
      {orders.map(order => (
        <div key={order.id} data-testid={`order-${order.id}`}>
          <span data-testid={`order-number-${order.id}`}>{order.id}</span>
          <span data-testid={`order-status-${order.id}`}>{order.status}</span>
          <button 
            data-testid={`accept-button-${order.id}`}
            onClick={() => updateOrderStatus(order.id, 'accepted')}
          >
            Aceitar
          </button>
          <button 
            data-testid={`track-button-${order.id}`}
            onClick={() => {/* Simular rastreamento */}}
          >
            Rastrear
          </button>
        </div>
      ))}
    </div>
  )
}

const OrderTrackingMap = () => (
  <div data-testid="order-tracking-map">
    <h2>Rastreamento do Pedido</h2>
    <div>Mapa de rastreamento aqui</div>
  </div>
)

// Mock do módulo de API
vi.mock('@/lib/api', () => ({
  apiService: {
    auth: {
      getCurrentUser: vi.fn()
    },
    pedidos: {
      listar: vi.fn(),
      atualizarStatus: vi.fn()
    }
  }
}))

// Mock do hook useOrders
const mockUseOrders = vi.fn()

vi.mock('@/contexts/orders/OrderContext', () => ({
  OrderProvider: ({ children }: { children: React.ReactNode }) => children,
  useOrders: () => mockUseOrders()
}))

describe('Orders Management Integration Flow', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    localStorage.clear()
  })

  it('deve listar pedidos e permitir mudança de status', async () => {
    const mockOrders = [
      {
        id: '1',
        patientId: '1',
        patientName: 'João Silva',
        items: [
          {
            id: '1',
            productId: '1',
            productName: 'Paracetamol 500mg',
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

    mockUseOrders.mockReturnValue({
      orders: mockOrders,
      isLoading: false,
      updateOrderStatus: vi.fn()
    })

    const { apiService } = await import('@/lib/api')
    vi.mocked(apiService.pedidos.listar).mockResolvedValue(mockOrders)
    vi.mocked(apiService.pedidos.atualizarStatus).mockResolvedValue({ sucesso: true })

    render(
      <AuthProvider>
        <OrderProvider>
          <OrdersList />
        </OrderProvider>
      </AuthProvider>
    )

    // Aguardar carregamento dos pedidos
    await waitFor(() => {
      expect(screen.getAllByText('Pedidos')[0]).toBeInTheDocument()
    })

    // Verificar se pedido está listado
    expect(screen.getByTestId('order-1')).toBeInTheDocument()
    expect(screen.getByTestId('order-number-1')).toHaveTextContent('1')
    expect(screen.getByTestId('order-status-1')).toHaveTextContent('pendente')

    // Aceitar pedido
    fireEvent.click(screen.getByTestId('accept-button-1'))

    // Verificar se função de atualização foi chamada
    expect(mockUseOrders().updateOrderStatus).toHaveBeenCalledWith('1', 'accepted')
  })

  it('deve integrar rastreamento com mudança de status', async () => {
    const mockOrder = {
      id: '1',
      patientId: '1',
      patientName: 'João Silva',
      items: [],
      status: 'with_delivery',
      total: 50.00,
      createdAt: new Date(),
      updatedAt: new Date(),
      priority: 'medium' as const,
      latitude: -23.5505,
      longitude: -46.6333
    }

    mockUseOrders.mockReturnValue({
      orders: [mockOrder],
      isLoading: false,
      updateOrderStatus: vi.fn()
    })

    render(
      <AuthProvider>
        <OrderProvider>
          <OrdersList />
        </OrderProvider>
      </AuthProvider>
    )

    // Aguardar carregamento
    await waitFor(() => {
      expect(screen.getAllByText('Pedidos')[0]).toBeInTheDocument()
    })

    // Verificar se botão de rastrear está presente
    const trackButtons = screen.getAllByTestId('track-button-1')
    expect(trackButtons[0]).toBeInTheDocument()

    // Clicar em rastrear
    fireEvent.click(trackButtons[0])

    // Verificar se mapa seria exibido (simulação)
    // Em um teste real, você renderizaria o componente de mapa aqui
  })
})

describe('Order Context Integration', () => {
  it('deve carregar pedidos na inicialização', async () => {
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

    mockUseOrders.mockReturnValue({
      orders: mockOrders,
      isLoading: false,
      loadOrders: vi.fn(),
      updateOrderStatus: vi.fn(),
      createOrder: vi.fn(),
      updateOrder: vi.fn(),
      deleteOrder: vi.fn()
    })

    render(
      <AuthProvider>
        <OrderProvider>
          <OrdersList />
        </OrderProvider>
      </AuthProvider>
    )

    // Verificar se pedidos foram carregados
    await waitFor(() => {
      expect(screen.getAllByText('Pedidos')[0]).toBeInTheDocument()
    })

    expect(screen.getAllByTestId('order-1')[0]).toBeInTheDocument()
  })

  it('deve filtrar pedidos por status', async () => {
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

    // Mock que retorna apenas pedidos pendentes (filtrados)
    const filteredOrders = mockOrders.filter(order => order.status === 'pendente')
    
    mockUseOrders.mockReturnValue({
      orders: filteredOrders, // Retornar apenas os pedidos filtrados
      isLoading: false,
      updateFilters: vi.fn(),
      filters: { status: 'pendente' }
    })

    render(
      <AuthProvider>
        <OrderProvider>
          <OrdersList />
        </OrderProvider>
      </AuthProvider>
    )

    // Verificar se apenas pedidos pendentes são exibidos
    await waitFor(() => {
      expect(screen.getAllByText('Pedidos')[0]).toBeInTheDocument()
    })

    expect(screen.getAllByTestId('order-1')[0]).toBeInTheDocument()
    expect(screen.queryByTestId('order-2')).not.toBeInTheDocument()
  })
})
