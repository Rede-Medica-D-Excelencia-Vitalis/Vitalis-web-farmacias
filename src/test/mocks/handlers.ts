import { http, HttpResponse } from 'msw'

export const handlers = [
  // Autenticação
  http.post('/auth/login', () => {
    return HttpResponse.json({
      sucesso: true,
      token: 'mock-token-12345',
      usuario: {
        id: 1,
        nome: 'Farmacêutico Teste',
        email: 'farmacia@test.com',
        tipo_usuario: 'farmacia'
      }
    })
  }),

  // Pedidos
  http.get('/pedidos', () => {
    return HttpResponse.json([
      {
        id: 1,
        numero_pedido: 'PED001',
        farmacia_id: 1,
        paciente_id: 1,
        total: 50.00,
        subtotal: 45.00,
        taxa_entrega: 5.00,
        desconto: 0,
        status: 'pendente',
        endereco_entrega: 'Rua Teste, 123',
        forma_pagamento: 'pix',
        data_criacao: '2024-01-01T10:00:00Z',
        data_atualizacao: '2024-01-01T10:00:00Z',
        farmacia_nome: 'Farmácia Test',
        paciente_nome: 'João Silva',
        itens: [
          {
            id: 1,
            pedido_id: 1,
            produto_id: 1,
            quantidade: 2,
            preco_unitario: 25.00,
            produto_nome: 'Paracetamol 500mg'
          }
        ]
      }
    ])
  }),

  http.put('/pedidos/:id/status', ({ params, request }) => {
    const { id } = params
    return HttpResponse.json({
      sucesso: true,
      mensagem: 'Status atualizado com sucesso',
      pedido_id: id
    })
  }),

  // Produtos
  http.get('/produtos', () => {
    return HttpResponse.json([
      {
        id: 1,
        nome: 'Paracetamol 500mg',
        descricao: 'Analgésico e antitérmico',
        preco: 25.00,
        estoque: 100,
        farmacia_id: 1,
        ativo: 1,
        concentracao: '500mg',
        unidade_medida: 'mg',
        fabricante: 'Fabricante Test',
        principio_ativo: 'Paracetamol'
      }
    ])
  }),

  http.post('/produtos', async ({ request }) => {
    const body = await request.json()
    return HttpResponse.json({
      id: 2,
      ...body,
      farmacia_id: 1,
      ativo: 1
    })
  }),

  http.put('/produtos/:id', async ({ params, request }) => {
    const { id } = params
    const body = await request.json()
    return HttpResponse.json({
      id,
      ...body
    })
  }),

  http.delete('/produtos/:id', ({ params }) => {
    const { id } = params
    return HttpResponse.json({
      sucesso: true,
      mensagem: 'Produto deletado com sucesso',
      produto_id: id
    })
  }),

  // Farmácia
  http.get('/farmacias/minha', () => {
    return HttpResponse.json({
      id: 1,
      nome: 'Farmácia Test',
      cnpj: '12.345.678/0001-90',
      email: 'farmacia@test.com',
      telefone: '(11) 99999-9999',
      endereco: 'Rua Teste, 123',
      cidade: 'São Paulo',
      estado: 'SP',
      cep: '01234-567',
      status: 'ativo'
    })
  }),

  // Dashboard
  http.get('/farmacias/estatisticas', () => {
    return HttpResponse.json({
      total_pedidos: 150,
      pedidos_pendentes: 5,
      pedidos_entregues: 140,
      receita_total: 15000.00,
      avaliacao_media: 4.5
    })
  }),

  // Interceptador de erro 401
  http.get('/auth/protected', () => {
    return HttpResponse.json(
      { erro: 'Token inválido' },
      { status: 401 }
    )
  })
]
