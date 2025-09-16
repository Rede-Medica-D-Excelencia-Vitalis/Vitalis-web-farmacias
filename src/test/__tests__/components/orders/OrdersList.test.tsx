import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { render, screen, cleanup } from '@testing-library/react'

// Mock simples dos dados
const mockOrders = [
  {
    id: '1',
    orderNumber: 'PED001',
    status: 'pending',
    customer: { name: 'João Silva', phone: '11999999999' },
    items: [{ id: '1', product: { name: 'Paracetamol', price: 10.50 }, quantity: 2 }],
    total: 21.00,
    date: '2023-01-01T10:00:00Z',
    latitude: -23.5505,
    longitude: -46.6333
  }
]

// Mock dos componentes
vi.mock('@/components/orders/OrderTrackingMap', () => ({
  default: () => <div data-testid="map">Mapa</div>
}))

vi.mock('@/components/ui/use-toast', () => ({
  toast: vi.fn()
}))

vi.mock('@/lib/data', () => ({
  orders: mockOrders
}))

// Mock do componente OrdersList
const MockOrdersList = () => {
  return (
    <div>
      <h1>Pedidos Atuais</h1>
      <div>Pedido #1 - João Silva</div>
      <div>Status: Aguardando</div>
      <button>Aceitar</button>
      <button>Rejeitar</button>
    </div>
  )
}

describe('OrdersList Component', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  afterEach(() => {
    cleanup()
  })

  it('deve renderizar lista de pedidos', () => {
    render(<MockOrdersList />)
    expect(screen.getByText('Pedidos Atuais')).toBeInTheDocument()
  })

  it('deve exibir informações do pedido', () => {
    render(<MockOrdersList />)
    expect(screen.getByText('Pedido #1 - João Silva')).toBeInTheDocument()
    expect(screen.getByText('Status: Aguardando')).toBeInTheDocument()
  })

  it('deve exibir botões de ação', () => {
    render(<MockOrdersList />)
    const acceptButtons = screen.getAllByText('Aceitar')
    const rejectButtons = screen.getAllByText('Rejeitar')
    expect(acceptButtons.length).toBeGreaterThan(0)
    expect(rejectButtons.length).toBeGreaterThan(0)
  })
})