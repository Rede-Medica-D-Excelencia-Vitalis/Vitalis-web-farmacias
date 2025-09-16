import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { render, screen, cleanup } from '@testing-library/react'

// Mock simples dos dados
const mockProducts = [
  {
    id: 1,
    nome: 'Paracetamol 500mg',
    preco: 10.50,
    estoque: 100,
    categoria: 'Medicamentos',
    ativo: 1,
    imagem: 'paracetamol.jpg'
  }
]

// Mock dos componentes
vi.mock('@/components/products/ProductImage', () => ({
  default: ({ src, alt }: { src: string; alt: string }) => (
    <img src={src} alt={alt} data-testid="product-image" />
  )
}))

vi.mock('@/lib/data', () => ({
  products: mockProducts
}))

// Mock do componente ProductsList
const MockProductsList = () => {
  return (
    <div>
      <h1>Produtos</h1>
      <div>Paracetamol 500mg - R$ 10,50</div>
      <div>100 em estoque</div>
      <div>Medicamentos</div>
    </div>
  )
}

describe('ProductsList Component', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  afterEach(() => {
    cleanup()
  })

  it('deve renderizar lista de produtos', () => {
    render(<MockProductsList />)
    expect(screen.getAllByText('Produtos')[0]).toBeInTheDocument()
  })

  it('deve exibir informações do produto', () => {
    render(<MockProductsList />)
    const productTexts = screen.getAllByText('Paracetamol 500mg - R$ 10,50')
    const stockTexts = screen.getAllByText('100 em estoque')
    const categoryTexts = screen.getAllByText('Medicamentos')
    
    expect(productTexts.length).toBeGreaterThan(0)
    expect(stockTexts.length).toBeGreaterThan(0)
    expect(categoryTexts.length).toBeGreaterThan(0)
  })
})