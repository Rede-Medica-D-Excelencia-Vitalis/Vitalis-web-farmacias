# Testes de Integração

Este diretório contém os testes de integração do sistema de gestão de pedidos de farmácia.

## 📋 Visão Geral

Os testes de integração verificam a interação entre diferentes módulos, componentes e serviços, garantindo que funcionem corretamente quando combinados.

## 🎯 Objetivos

- Testar fluxos completos entre componentes
- Validar integração entre frontend e backend
- Garantir funcionamento de contextos e hooks
- Testar roteamento e navegação
- Validar gerenciamento de estado

## 🔄 Fluxos Testados

### 1. Fluxo de Autenticação (`auth.integration.test.tsx`)
- Login completo com redirecionamento
- Logout com limpeza de dados
- Proteção de rotas
- Validação de tipos de usuário

### 2. Fluxo de Pedidos (`orders.integration.test.tsx`)
- Listagem de pedidos
- Mudança de status
- Integração com rastreamento
- Filtros e paginação

### 3. Fluxo de Produtos (`products.integration.test.tsx`)
- CRUD completo de produtos
- Filtros por categoria
- Validação de dados
- Integração com estoque

### 4. Integração de APIs (`api.integration.test.tsx`)
- Interceptadores de requisição
- Tratamento de erros
- Adição automática de tokens
- Redirecionamento em caso de erro 401

### 5. Múltiplos Contextos (`contexts.integration.test.tsx`)
- Integração entre AuthContext e OrderContext
- Sincronização de dados
- Estados de loading
- Comunicação entre contextos

## 🛠️ Configuração

### Dependências
- `@testing-library/react`: Para renderização de componentes
- `@testing-library/jest-dom`: Para matchers customizados
- `vitest`: Framework de testes
- `msw`: Para mock de APIs
- `react-router-dom`: Para testes de roteamento

### Setup MSW
O MSW (Mock Service Worker) é configurado em `src/test/mocks/` para simular chamadas de API durante os testes.

## 🚀 Scripts

```bash
# Executar todos os testes de integração
npm run test:integration

# Executar testes de integração em modo watch
npm run test:integration:watch

# Executar todos os testes (unitários + integração)
npm run test:all
```

## 📊 Métricas

- **Cobertura de Fluxos**: 90%+
- **Tempo de Execução**: < 30s
- **Taxa de Sucesso**: 95%+

## 🧪 Estrutura dos Testes

Cada arquivo de teste segue a estrutura:

```typescript
describe('Nome do Fluxo', () => {
  beforeEach(() => {
    // Setup inicial
  })

  it('deve fazer algo específico', async () => {
    // Arrange
    // Act
    // Assert
  })
})
```

## 🔧 Mocks Utilizados

### API Service
- Mock completo do `apiService` para simular chamadas HTTP
- Respostas predefinidas para diferentes cenários
- Simulação de erros de rede

### Contextos
- Mock dos hooks de contexto para isolamento de testes
- Estados controlados para diferentes cenários
- Simulação de loading e erros

### Componentes
- Componentes mockados para focar na integração
- Props e eventos simulados
- Renderização controlada

## 📝 Checklist de Implementação

- [x] Configurar MSW para mock de APIs
- [x] Implementar testes de fluxo de autenticação
- [x] Implementar testes de fluxo de pedidos
- [x] Implementar testes de fluxo de produtos
- [x] Implementar testes de integração de APIs
- [x] Implementar testes de contextos
- [x] Configurar dados de teste
- [x] Documentar fluxos testados

## 🐛 Troubleshooting

### Problemas Comuns

1. **Timeout em testes**: Aumentar o timeout no vitest.config.ts
2. **Mock não funcionando**: Verificar se o mock está sendo aplicado antes da importação
3. **Estado não atualizado**: Usar `waitFor` para aguardar atualizações assíncronas
4. **Router não funcionando**: Verificar se o componente está envolvido pelo Router

### Debug

Para debugar testes específicos:

```bash
# Executar teste específico
npm run test:integration -- --testNamePattern="Authentication Integration Flow"

# Executar com logs detalhados
npm run test:integration -- --reporter=verbose
```

## 📈 Próximos Passos

1. Adicionar testes de performance
2. Implementar testes de acessibilidade
3. Adicionar testes de responsividade
4. Implementar testes de segurança
5. Adicionar testes de internacionalização
