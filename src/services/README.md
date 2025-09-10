# Serviços da Aplicação - Vitalis Gestor de Pedidos

Esta pasta contém todos os serviços da aplicação organizados de forma profissional por categoria e funcionalidade. Cada serviço é responsável por uma área específica da aplicação, seguindo os princípios de responsabilidade única e separação de concerns.

## 📁 Estrutura de Pastas

```
services/
├── api/                    # Serviços de comunicação com APIs
│   ├── authService.ts      # Autenticação e autorização
│   ├── orderService.ts     # Gerenciamento de pedidos
│   ├── productService.ts   # Gerenciamento de produtos
│   ├── patientService.ts   # Gerenciamento de pacientes
│   ├── settingsService.ts  # Configurações do sistema
│   ├── dashboardService.ts # Dados do dashboard
│   └── index.ts           # Exportações da pasta API
│
├── business/               # Serviços de lógica de negócio
│   ├── validationService.ts     # Validações de negócio
│   ├── calculationService.ts    # Cálculos e fórmulas
│   ├── businessRulesService.ts  # Regras de negócio
│   ├── dataProcessingService.ts # Processamento de dados
│   └── index.ts           # Exportações da pasta Business
│
├── integration/            # Serviços de integração
│   ├── externalIntegrationService.ts  # Integrações externas
│   ├── motoboyIntegrationService.ts   # Integração com motoboys
│   ├── paymentIntegrationService.ts   # Integração com pagamentos
│   ├── deliveryIntegrationService.ts  # Integração com entregas
│   └── index.ts           # Exportações da pasta Integration
│
├── notifications/          # Serviços de notificações
│   ├── notificationService.ts    # Sistema de notificações
│   └── index.ts           # Exportações da pasta Notifications
│
├── utils/                  # Serviços utilitários
│   ├── formattingService.ts      # Formatação de dados
│   ├── cacheService.ts           # Cache e armazenamento
│   ├── storageService.ts         # Gerenciamento de storage
│   ├── conversionService.ts      # Conversões de dados
│   ├── dateTimeService.ts        # Manipulação de data/hora
│   └── index.ts           # Exportações da pasta Utils
│
├── index.ts               # Exportações principais
└── README.md              # Esta documentação
```

## 🔧 Categorias de Serviços

### 🔌 API Services
Serviços responsáveis pela comunicação com APIs e backends.

**Características:**
- Gerenciamento de requisições HTTP
- Tratamento de erros de API
- Interceptação de requisições
- Cache de dados
- Transformação de dados

**Serviços Disponíveis:**
- `authService` - Autenticação e autorização
- `orderService` - Gerenciamento de pedidos
- `productService` - Gerenciamento de produtos
- `patientService` - Gerenciamento de pacientes
- `settingsService` - Configurações do sistema
- `dashboardService` - Dados do dashboard

### 🏢 Business Services
Serviços que contêm a lógica de negócio específica da farmácia.

**Características:**
- Validações de negócio
- Cálculos específicos do domínio
- Regras de negócio
- Processamento de dados
- Transformações de dados

**Serviços Disponíveis:**
- `validationService` - Validações de dados e regras
- `calculationService` - Cálculos e fórmulas
- `businessRulesService` - Regras de negócio
- `dataProcessingService` - Processamento de dados

### 🔗 Integration Services
Serviços para integração com sistemas externos e APIs de terceiros.

**Características:**
- Integração com sistemas externos
- APIs de terceiros
- Webhooks
- Sincronização de dados
- Mapeamento de dados

**Serviços Disponíveis:**
- `externalIntegrationService` - Integrações gerais
- `motoboyIntegrationService` - Sistema de motoboys
- `paymentIntegrationService` - Sistema de pagamentos
- `deliveryIntegrationService` - Sistema de entregas

### 🔔 Notification Services
Serviços relacionados ao sistema de notificações.

**Características:**
- Notificações em tempo real
- Push notifications
- Sistema de alertas
- Configurações de som
- Histórico de notificações

**Serviços Disponíveis:**
- `notificationService` - Sistema principal de notificações

### 🛠️ Utility Services
Serviços utilitários e auxiliares utilizados em toda a aplicação.

**Características:**
- Formatação de dados
- Cache e armazenamento
- Conversões de dados
- Manipulação de data/hora
- Funções auxiliares

**Serviços Disponíveis:**
- `formattingService` - Formatação de dados
- `cacheService` - Cache e armazenamento
- `storageService` - Gerenciamento de storage
- `conversionService` - Conversões de dados
- `dateTimeService` - Manipulação de data/hora

## 📖 Como Usar

### Importação por Categoria

```typescript
// Importar todos os serviços de uma categoria
import { authService, orderService } from '@/services/api';
import { validationService } from '@/services/business';
import { notificationService } from '@/services/notifications';
import { formattingService } from '@/services/utils';
```

### Importação Específica

```typescript
// Importar serviços específicos
import { authService } from '@/services/api/authService';
import { validationService } from '@/services/business/validationService';
import { notificationService } from '@/services/notifications/notificationService';
```

### Importação Global

```typescript
// Importar do índice principal
import {
  authService,
  orderService,
  validationService,
  notificationService,
  formattingService
} from '@/services';
```

## 🎯 Exemplos de Uso

### Serviço de Autenticação

```typescript
import { authService } from '@/services';

// Login
const loginData = await authService.login({
  email: 'user@example.com',
  password: 'password123'
});

// Verificar autenticação
if (authService.isAuthenticated()) {
  console.log('Usuário autenticado');
}

// Logout
await authService.logout();
```

### Serviço de Validação

```typescript
import { validationService } from '@/services';

// Validar pedido
const orderData = { /* dados do pedido */ };
const validation = validationService.validateOrder(orderData);

if (!validation.isValid) {
  console.error('Erros:', validation.errors);
}
```

### Serviço de Notificações

```typescript
import { notificationService } from '@/services';

// Notificação de sucesso
notificationService.success('Sucesso!', 'Pedido criado com sucesso');

// Notificação específica da farmácia
notificationService.newOrder('12345', 'João Silva');
```

### Serviço de Formatação

```typescript
import { formattingService } from '@/services';

// Formatar moeda
const price = formattingService.formatCurrency(29.90); // R$ 29,90

// Formatar data
const date = formattingService.formatDate(new Date()); // 15/12/2023

// Formatar CPF
const cpf = formattingService.formatCPF('12345678901'); // 123.456.789-01
```

## 🏗️ Criando Novos Serviços

### 1. Estrutura Básica

```typescript
/**
 * Serviço de Exemplo
 * 
 * Descrição do que o serviço faz e sua responsabilidade.
 */

export interface ExampleServiceConfig {
  // Configurações do serviço
}

class ExampleService {
  private config: ExampleServiceConfig;

  constructor(config?: Partial<ExampleServiceConfig>) {
    this.config = {
      // Configurações padrão
      ...config
    };
  }

  /**
   * Método público do serviço
   */
  async exampleMethod(): Promise<any> {
    try {
      // Implementação do método
      return result;
    } catch (error) {
      console.error('Erro no serviço:', error);
      throw error;
    }
  }
}

// Instância singleton
export const exampleService = new ExampleService();
export default exampleService;
```

### 2. Adicionar ao Índice

```typescript
// No arquivo index.ts da pasta apropriada
export { exampleService } from './exampleService';
```

### 3. Documentar o Serviço

Adicione documentação JSDoc para todos os métodos públicos e interfaces.

## 🔒 Princípios e Boas Práticas

### 1. Responsabilidade Única
Cada serviço deve ter uma responsabilidade específica e bem definida.

### 2. Singleton Pattern
Todos os serviços são implementados como singletons para garantir uma única instância.

### 3. Error Handling
Todos os serviços devem tratar erros adequadamente e fornecer mensagens claras.

### 4. TypeScript
Use TypeScript estrito com interfaces bem definidas.

### 5. Documentação
Documente todos os métodos públicos com JSDoc.

### 6. Testes
Cada serviço deve ser testável e ter testes unitários.

### 7. Configuração
Use configurações flexíveis e valores padrão sensatos.

## 🚀 Benefícios da Organização

- **Manutenibilidade**: Fácil localização e manutenção de código
- **Reutilização**: Serviços reutilizáveis em toda a aplicação
- **Escalabilidade**: Estrutura preparada para crescimento
- **Consistência**: Padrões uniformes em toda a aplicação
- **Performance**: Importações otimizadas com barrel exports
- **Type Safety**: TypeScript completo em todos os módulos
- **Testabilidade**: Serviços isolados e testáveis
- **Documentação**: Documentação clara e organizada

## 📚 Recursos Adicionais

- [Documentação da API](./api/README.md)
- [Documentação de Negócio](./business/README.md)
- [Documentação de Integração](./integration/README.md)
- [Documentação de Notificações](./notifications/README.md)
- [Documentação de Utilitários](./utils/README.md)

---

**Última atualização**: Dezembro 2023  
**Versão**: 1.0.0  
**Autor**: Equipe Vitalis

