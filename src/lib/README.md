# Lib

Esta pasta contém todas as bibliotecas, utilitários e serviços da aplicação, organizados por categoria e funcionalidade.

## Estrutura

```
lib/
├── api/           # Serviços de API e configurações
├── data/          # Dados mock e utilitários de dados
├── integration/   # Integrações com sistemas externos
├── utils/         # Utilitários gerais
├── types/         # Tipos TypeScript compartilhados
├── services/      # Serviços de negócio
└── index.ts       # Exportações centralizadas
```

## Categorias

### 🔌 API
Serviços de API e configurações do axios.

- **api.ts**: Configuração principal do axios com interceptors
- **Tipos**: LoginResponse, Pedido, ItemPedido, Produto

### 📊 Data
Dados mock e utilitários para desenvolvimento e testes.

- **data.ts**: Dados mock de produtos, pedidos, reviews, etc.
- **Mock Data**: products, orders, reviews, storeInfo, chartData

### 🔗 Integration
Integrações com sistemas externos e APIs de terceiros.

- **integration.ts**: API de integração geral
- **patientIntegration.ts**: Integração com sistema de pacientes
- **motoboyIntegration.ts**: Integração com sistema de motoboys

### 🛠️ Utils
Utilitários gerais e funções auxiliares.

- **utils.ts**: Função `cn` para classes CSS
- **validation.ts**: Funções de validação (email, CPF, CNPJ, etc.)

### 📝 Types
Tipos TypeScript compartilhados em toda a aplicação.

- **index.ts**: Todos os tipos organizados por categoria
- **Categorias**: Usuário, Pedidos, Produtos, Pacientes, Motoboys, etc.

### 🏢 Services
Serviços de negócio e lógica de aplicação.

- **orderService.ts**: Serviço completo para gerenciamento de pedidos

## Uso

### Importação

```typescript
// Importação específica
import { api } from '@/lib/api';
import { products, orders } from '@/lib/data';
import { patientApi, motoboyApi } from '@/lib/integration';
import { cn, isValidEmail } from '@/lib/utils';
import type { Order, Product, Patient } from '@/lib/types';
import { OrderService } from '@/lib/services';

// Importação geral
import { 
  api, 
  products, 
  patientApi, 
  cn, 
  isValidEmail,
  type Order,
  OrderService 
} from '@/lib';
```

### Exemplos de Uso

#### API Service
```typescript
import { api } from '@/lib';

// Fazer requisição
const response = await api.get('/pedidos');
const pedidos = response.data;
```

#### Dados Mock
```typescript
import { products, orders } from '@/lib';

// Usar dados mock para desenvolvimento
console.log('Produtos:', products);
console.log('Pedidos:', orders);
```

#### Integrações
```typescript
import { patientApi, motoboyApi } from '@/lib';

// Integração com pacientes
const pacientes = await patientApi.get('/pacientes');

// Integração com motoboys
const motoboys = await motoboyApi.get('/motoboys');
```

#### Utilitários
```typescript
import { cn, isValidEmail, isValidCPF } from '@/lib';

// Classes CSS
const className = cn('bg-blue-500', 'text-white', 'p-4');

// Validações
const emailValido = isValidEmail('usuario@exemplo.com');
const cpfValido = isValidCPF('123.456.789-09');
```

#### Tipos
```typescript
import type { Order, Product, Patient } from '@/lib';

// Usar tipos em componentes
interface OrderListProps {
  orders: Order[];
  onOrderClick: (order: Order) => void;
}

function OrderList({ orders, onOrderClick }: OrderListProps) {
  return (
    <div>
      {orders.map(order => (
        <div key={order.id} onClick={() => onOrderClick(order)}>
          {order.numero_pedido}
        </div>
      ))}
    </div>
  );
}
```

#### Serviços de Negócio
```typescript
import { OrderService } from '@/lib';

// Usar serviço de pedidos
const pedidos = await OrderService.getOrders();
const pedido = await OrderService.getOrderById(1);
const novoPedido = await OrderService.createOrder(orderData);

// Validar transição de status
const podeAtualizar = OrderService.validateStatusTransition(
  'pendente', 
  'em_preparo'
);
```

## Características dos Módulos

### API
- **Interceptors**: Configuração automática de tokens
- **Error Handling**: Tratamento centralizado de erros
- **Logging**: Logs detalhados para debugging
- **TypeScript**: Tipos completos para todas as respostas

### Data
- **Mock Data**: Dados realistas para desenvolvimento
- **TypeScript**: Tipos completos para todos os dados
- **Estrutura**: Organização por entidades (produtos, pedidos, etc.)

### Integration
- **APIs Específicas**: Configurações separadas para cada integração
- **Autenticação**: Tokens específicos para cada serviço
- **Error Handling**: Tratamento específico para cada API
- **TypeScript**: Tipos específicos para cada integração

### Utils
- **Validação**: Funções de validação completas
- **CSS**: Utilitários para classes CSS
- **Reutilização**: Funções genéricas e reutilizáveis
- **Performance**: Funções otimizadas

### Types
- **Organização**: Tipos organizados por categoria
- **Completude**: Cobertura completa de todos os tipos
- **Extensibilidade**: Fácil adição de novos tipos
- **Documentação**: JSDoc para todos os tipos

### Services
- **Lógica de Negócio**: Encapsulamento da lógica de aplicação
- **Reutilização**: Serviços reutilizáveis em toda a aplicação
- **TypeScript**: Tipos completos para todos os métodos
- **Error Handling**: Tratamento de erros específico

## Convenções

1. **Nomenclatura**: Use camelCase para funções e PascalCase para classes
2. **Tipos**: Use interfaces TypeScript para definir estruturas
3. **Documentação**: Inclua JSDoc para todas as funções e classes
4. **Error Handling**: Sempre trate erros adequadamente
5. **TypeScript**: Use tipos estritos e evite `any`

## Desenvolvimento

### Criando um Novo Serviço

1. Crie o arquivo na pasta `services/`
2. Defina a interface TypeScript para o serviço
3. Implemente os métodos com JSDoc
4. Crie/atualize o `index.ts` da pasta
5. Atualize este README se necessário

### Exemplo de Estrutura de Serviço

```typescript
/**
 * Serviço para gerenciamento de produtos
 */

import { api } from '../api/api';
import type { Product, ApiResponse } from '../types';

export class ProductService {
  /**
   * Busca todos os produtos
   */
  static async getProducts(): Promise<ApiResponse<Product[]>> {
    try {
      const response = await api.get('/produtos');
      return response.data;
    } catch (error) {
      console.error('Erro ao buscar produtos:', error);
      throw error;
    }
  }

  // Outros métodos...
}

export default ProductService;
```

### Criando Novos Utilitários

1. Crie o arquivo na pasta `utils/`
2. Defina a função com JSDoc
3. Adicione tipos TypeScript
4. Atualize o `index.ts` da pasta utils

### Exemplo de Utilitário

```typescript
/**
 * Formata um valor monetário
 * @param value - Valor a ser formatado
 * @param currency - Moeda (padrão: BRL)
 * @returns Valor formatado
 */
export function formatCurrency(value: number, currency = 'BRL'): string {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency
  }).format(value);
}
```

## Benefícios da Organização

- **Manutenibilidade**: Fácil localização e manutenção
- **Reutilização**: Módulos reutilizáveis em toda a aplicação
- **Escalabilidade**: Estrutura preparada para crescimento
- **Consistência**: Padrões uniformes em toda a aplicação
- **Performance**: Importações otimizadas com barrel exports
- **Type Safety**: TypeScript completo em todos os módulos
