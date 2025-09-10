# Tipos da Aplicação - Vitalis Gestor de Pedidos

Esta pasta contém todos os tipos TypeScript da aplicação organizados de forma profissional por categoria e funcionalidade. Cada categoria é responsável por um domínio específico da aplicação, seguindo os princípios de organização e separação de concerns.

## 📁 Estrutura de Pastas

```
types/
├── auth/                    # Tipos de autenticação e usuários
│   ├── index.ts            # User, LoginRequest, AuthState, etc.
│   └── README.md           # Documentação dos tipos de auth
│
├── orders/                 # Tipos de pedidos e operações
│   ├── index.ts            # Order, OrderItem, OrderStatus, etc.
│   └── README.md           # Documentação dos tipos de pedidos
│
├── products/               # Tipos de produtos e categorias
│   ├── index.ts            # Product, ProductCategory, etc.
│   └── README.md           # Documentação dos tipos de produtos
│
├── patients/               # Tipos de pacientes e informações
│   ├── index.ts            # Patient, PatientAddress, etc.
│   └── README.md           # Documentação dos tipos de pacientes
│
├── notifications/          # Tipos de notificações e alertas
│   ├── index.ts            # Notification, NotificationType, etc.
│   └── README.md           # Documentação dos tipos de notificações
│
├── api/                    # Tipos de API e comunicação
│   ├── index.ts            # ApiResponse, ApiError, etc.
│   └── README.md           # Documentação dos tipos de API
│
├── business/               # Tipos de lógica de negócio
│   ├── index.ts            # BusinessRule, ValidationRule, etc.
│   └── README.md           # Documentação dos tipos de negócio
│
├── utils/                  # Tipos utilitários e auxiliares
│   ├── index.ts            # SelectOption, TableConfig, etc.
│   └── README.md           # Documentação dos tipos utilitários
│
├── common/                 # Tipos comuns e compartilhados
│   ├── index.ts            # BaseEntity, Timestamp, etc.
│   └── README.md           # Documentação dos tipos comuns
│
├── index.ts               # Exportações principais
└── README.md              # Esta documentação
```

## 🔧 Categorias de Tipos

### 🔐 Auth Types
Tipos relacionados à autenticação, autorização e gerenciamento de usuários.

**Principais Tipos:**
- `User` - Informações do usuário
- `UserRole` - Papéis do usuário
- `LoginRequest` - Dados de login
- `LoginResponse` - Resposta do login
- `AuthState` - Estado da autenticação
- `Permission` - Permissões do sistema
- `Role` - Papéis e permissões

### 📦 Orders Types
Tipos relacionados aos pedidos, itens, status e operações de pedidos.

**Principais Tipos:**
- `Order` - Estrutura completa do pedido
- `OrderItem` - Item do pedido
- `OrderStatus` - Status do pedido
- `PaymentStatus` - Status do pagamento
- `PaymentMethod` - Métodos de pagamento
- `DeliveryAddress` - Endereço de entrega
- `OrderCreateRequest` - Criação de pedido
- `OrderUpdateRequest` - Atualização de pedido
- `OrderFilters` - Filtros de busca
- `OrderStats` - Estatísticas de pedidos

### 💊 Products Types
Tipos relacionados aos produtos, categorias, estoque e operações de produtos.

**Principais Tipos:**
- `Product` - Estrutura completa do produto
- `ProductCategory` - Categoria do produto
- `ProductImage` - Imagem do produto
- `ProductDimensions` - Dimensões do produto
- `PrescriptionType` - Tipos de receita
- `ProductCreateRequest` - Criação de produto
- `ProductUpdateRequest` - Atualização de produto
- `ProductFilters` - Filtros de busca
- `StockMovement` - Movimentação de estoque

### 👥 Patients Types
Tipos relacionados aos pacientes, informações pessoais e histórico médico.

**Principais Tipos:**
- `Patient` - Estrutura completa do paciente
- `Gender` - Gênero do paciente
- `PatientAddress` - Endereço do paciente
- `EmergencyContact` - Contato de emergência
- `PatientCreateRequest` - Criação de paciente
- `PatientUpdateRequest` - Atualização de paciente
- `PatientFilters` - Filtros de busca
- `PatientHistory` - Histórico do paciente

### 🔔 Notifications Types
Tipos relacionados ao sistema de notificações, alertas e configurações.

**Principais Tipos:**
- `Notification` - Estrutura da notificação
- `NotificationType` - Tipos de notificação
- `NotificationPriority` - Prioridade da notificação
- `NotificationCategory` - Categoria da notificação
- `NotificationCreateRequest` - Criação de notificação
- `NotificationSettings` - Configurações de notificação
- `NotificationTemplate` - Template de notificação

### 🔌 API Types
Tipos relacionados às APIs, requisições, respostas e configurações de comunicação.

**Principais Tipos:**
- `ApiResponse` - Resposta padrão da API
- `ApiError` - Erro da API
- `ApiErrorResponse` - Resposta de erro
- `PaginationParams` - Parâmetros de paginação
- `SearchParams` - Parâmetros de busca
- `ApiConfig` - Configuração da API
- `UploadResponse` - Resposta de upload

### 🏢 Business Types
Tipos relacionados à lógica de negócio, regras, validações e operações específicas.

**Principais Tipos:**
- `BusinessRule` - Regra de negócio
- `BusinessRuleCategory` - Categoria da regra
- `ValidationRule` - Regra de validação
- `ValidationResult` - Resultado da validação
- `BusinessProcess` - Processo de negócio
- `BusinessMetric` - Métrica de negócio
- `BusinessEvent` - Evento de negócio

### 🛠️ Utils Types
Tipos utilitários e auxiliares utilizados em toda a aplicação.

**Principais Tipos:**
- `SelectOption` - Opção de seleção
- `TableColumn` - Coluna de tabela
- `TableConfig` - Configuração de tabela
- `FormField` - Campo de formulário
- `FormConfig` - Configuração de formulário
- `ModalConfig` - Configuração de modal
- `ToastConfig` - Configuração de toast
- `LoadingState` - Estado de carregamento
- `ErrorState` - Estado de erro

### 🔄 Common Types
Tipos comuns e compartilhados utilizados em toda a aplicação.

**Principais Tipos:**
- `BaseEntity` - Entidade base
- `SoftDeleteEntity` - Entidade com soft delete
- `Timestamp` - Timestamps
- `UserInfo` - Informações do usuário
- `AuditLog` - Log de auditoria
- `SystemInfo` - Informações do sistema
- `FeatureFlag` - Flag de funcionalidade
- `SystemSettings` - Configurações do sistema
- `MenuItem` - Item de menu
- `BreadcrumbItem` - Item de breadcrumb

## 📖 Como Usar

### Importação por Categoria

```typescript
// Importar todos os tipos de uma categoria
import type { User, LoginRequest, AuthState } from '@/types/auth';
import type { Order, OrderStatus, OrderCreateRequest } from '@/types/orders';
import type { Product, ProductCategory } from '@/types/products';
import type { Patient, PatientAddress } from '@/types/patients';
import type { Notification, NotificationType } from '@/types/notifications';
```

### Importação Específica

```typescript
// Importar tipos específicos
import type { User } from '@/types/auth';
import type { Order } from '@/types/orders';
import type { Product } from '@/types/products';
```

### Importação Global

```typescript
// Importar do índice principal
import type {
  User,
  Order,
  Product,
  Patient,
  Notification,
  ApiResponse,
  BaseEntity
} from '@/types';
```

## 🎯 Exemplos de Uso

### Tipos de Autenticação

```typescript
import type { User, LoginRequest, AuthState } from '@/types';

const user: User = {
  id: '1',
  name: 'João Silva',
  email: 'joao@example.com',
  role: 'pharmacist',
  isActive: true,
  createdAt: '2023-01-01T00:00:00Z',
  updatedAt: '2023-01-01T00:00:00Z'
};

const loginData: LoginRequest = {
  email: 'joao@example.com',
  password: 'password123',
  rememberMe: true
};
```

### Tipos de Pedidos

```typescript
import type { Order, OrderStatus, OrderCreateRequest } from '@/types';

const order: Order = {
  id: '1',
  orderNumber: 'ORD-001',
  patientId: '1',
  items: [],
  total: 29.90,
  status: 'pending',
  paymentStatus: 'pending',
  paymentMethod: 'pix',
  deliveryAddress: {
    street: 'Rua das Flores',
    number: '123',
    neighborhood: 'Centro',
    city: 'São Paulo',
    state: 'SP',
    zipCode: '01234-567',
    country: 'Brasil'
  },
  createdAt: '2023-01-01T00:00:00Z',
  updatedAt: '2023-01-01T00:00:00Z'
};
```

### Tipos de Produtos

```typescript
import type { Product, ProductCategory, PrescriptionType } from '@/types';

const product: Product = {
  id: '1',
  name: 'Paracetamol 500mg',
  description: 'Analgésico e antitérmico',
  price: 12.90,
  stock: 100,
  minStock: 10,
  images: [],
  category: {
    id: '1',
    name: 'Analgésicos',
    active: true,
    createdAt: '2023-01-01T00:00:00Z',
    updatedAt: '2023-01-01T00:00:00Z'
  },
  sku: 'PAR-500-001',
  active: true,
  requiresPrescription: false,
  tags: ['analgésico', 'antitérmico'],
  createdAt: '2023-01-01T00:00:00Z',
  updatedAt: '2023-01-01T00:00:00Z'
};
```

### Tipos de API

```typescript
import type { ApiResponse, ApiError, PaginationParams } from '@/types';

const apiResponse: ApiResponse<Order[]> = {
  success: true,
  data: [order],
  message: 'Pedidos carregados com sucesso',
  meta: {
    page: 1,
    limit: 10,
    total: 1,
    totalPages: 1
  }
};

const pagination: PaginationParams = {
  page: 1,
  limit: 10,
  sortBy: 'createdAt',
  sortOrder: 'desc'
};
```

## 🏗️ Criando Novos Tipos

### 1. Estrutura Básica

```typescript
/**
 * Tipo de Exemplo
 * 
 * Descrição do que o tipo representa e sua finalidade.
 */

export interface ExampleType {
  id: string;
  name: string;
  description?: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export type ExampleStatus = 'active' | 'inactive' | 'pending';

export interface ExampleCreateRequest {
  name: string;
  description?: string;
}

export interface ExampleUpdateRequest {
  name?: string;
  description?: string;
  isActive?: boolean;
}
```

### 2. Adicionar ao Índice

```typescript
// No arquivo index.ts da pasta apropriada
export type { ExampleType, ExampleStatus } from './exampleType';
```

### 3. Documentar o Tipo

Adicione documentação JSDoc para todos os tipos e interfaces.

## 🔒 Princípios e Boas Práticas

### 1. Nomenclatura Consistente
- Use PascalCase para interfaces e tipos
- Use camelCase para propriedades
- Use UPPER_CASE para constantes
- Use sufixos descritivos (Request, Response, Config, etc.)

### 2. Organização por Domínio
- Agrupe tipos relacionados no mesmo arquivo
- Separe tipos por responsabilidade
- Use pastas para organizar por domínio

### 3. Documentação
- Documente todos os tipos com JSDoc
- Explique o propósito de cada propriedade
- Forneça exemplos quando necessário

### 4. Reutilização
- Use tipos base comuns
- Evite duplicação de código
- Compartilhe tipos entre módulos

### 5. Versionamento
- Mantenha compatibilidade com versões anteriores
- Use tipos legados para transição
- Documente mudanças breaking

### 6. Validação
- Use tipos estritos
- Evite `any` quando possível
- Use union types para valores específicos

### 7. Performance
- Use tipos otimizados
- Evite tipos complexos desnecessários
- Use lazy loading quando apropriado

## 🚀 Benefícios da Organização

- **Manutenibilidade**: Fácil localização e manutenção de tipos
- **Reutilização**: Tipos reutilizáveis em toda a aplicação
- **Escalabilidade**: Estrutura preparada para crescimento
- **Consistência**: Padrões uniformes em toda a aplicação
- **Type Safety**: TypeScript completo em todos os módulos
- **Documentação**: Documentação clara e organizada
- **Colaboração**: Facilita trabalho em equipe
- **Debugging**: Facilita identificação de problemas

## 📚 Recursos Adicionais

- [Documentação de Autenticação](./auth/README.md)
- [Documentação de Pedidos](./orders/README.md)
- [Documentação de Produtos](./products/README.md)
- [Documentação de Pacientes](./patients/README.md)
- [Documentação de Notificações](./notifications/README.md)
- [Documentação de API](./api/README.md)
- [Documentação de Negócio](./business/README.md)
- [Documentação de Utilitários](./utils/README.md)
- [Documentação de Comuns](./common/README.md)

---

**Última atualização**: Dezembro 2023  
**Versão**: 1.0.0  
**Autor**: Equipe Vitalis














