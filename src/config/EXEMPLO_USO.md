# Exemplos de Uso - Nova Estrutura de Configurações

Este arquivo demonstra como usar a nova estrutura organizacional das configurações.

## 🔄 Antes vs Depois

### ❌ Antes (Estrutura Antiga)
```typescript
// Importações desorganizadas
import { config } from '@/config/env';
import { localConfig } from '@/config/env.local';

// Uso direto sem organização
const apiUrl = config.API_URL;
const appName = config.APP_NAME;
```

### ✅ Depois (Estrutura Organizada)
```typescript
// Importações organizadas por categoria
import { config } from '@/config/environment';
import { appConfig, isFeatureEnabled } from '@/config/app';
import { getApiUrl, getEndpoint } from '@/config/api';
import { ORDER_STATUS, HTTP_STATUS } from '@/config/constants';

// Uso organizado e tipado
const apiUrl = getApiUrl('/orders');
const appName = appConfig.name;
const isNotificationsEnabled = isFeatureEnabled('notifications');
```

## 📦 Exemplos por Categoria

### 🌍 Configurações de Ambiente
```typescript
import { config, getConfig } from '@/config/environment';

// Usar configuração padrão
console.log(config.API_URL); // http://localhost:3001/api
console.log(config.APP_NAME); // Vitalis - Gestor de Pedidos

// Usar função de configuração
const currentConfig = getConfig();
console.log(currentConfig.VERSION); // 1.0.0
```

### 🚀 Configurações da Aplicação
```typescript
import { 
  appConfig, 
  getAppConfig, 
  isFeatureEnabled, 
  getUIConfig, 
  getPerformanceConfig 
} from '@/config/app';

// Informações básicas
console.log(appConfig.name); // Vitalis - Gestor de Pedidos
console.log(appConfig.version); // 1.0.0

// Verificar features
if (isFeatureEnabled('notifications')) {
  // Habilitar sistema de notificações
}

if (isFeatureEnabled('realTimeUpdates')) {
  // Habilitar atualizações em tempo real
}

// Configurações de UI
const uiConfig = getUIConfig();
console.log(uiConfig.theme); // light
console.log(uiConfig.language); // pt-BR

// Configurações de performance
const perfConfig = getPerformanceConfig();
console.log(perfConfig.cacheTimeout); // 300000 (5 minutos)
```

### 🔌 Configurações da API
```typescript
import { 
  apiConfig, 
  getApiConfig, 
  getApiUrl, 
  getEndpoint, 
  getDefaultHeaders, 
  getTimeout 
} from '@/config/api';

// URL base da API
console.log(apiConfig.baseURL); // http://localhost:3001/api

// Obter URL completa
const ordersUrl = getApiUrl('/orders'); // http://localhost:3001/api/orders

// Obter endpoint com parâmetros
const orderUrl = getEndpoint('/orders/:id', { id: 123 }); // /orders/123

// Headers padrão
const headers = getDefaultHeaders();
// { 'Content-Type': 'application/json', 'Accept': 'application/json', ... }

// Timeouts
const requestTimeout = getTimeout('request'); // 30000
const uploadTimeout = getTimeout('upload'); // 60000

// Endpoints organizados
const authEndpoints = apiConfig.endpoints.auth;
console.log(authEndpoints.login); // /auth/login
console.log(authEndpoints.logout); // /auth/logout

const orderEndpoints = apiConfig.endpoints.orders;
console.log(orderEndpoints.list); // /orders
console.log(orderEndpoints.create); // /orders
```

### 📋 Constantes da Aplicação
```typescript
import { 
  ORDER_STATUS, 
  PATIENT_STATUS, 
  PRODUCT_STATUS,
  NOTIFICATION_TYPES,
  HTTP_STATUS,
  LIMITS,
  VALIDATION,
  THEME,
  LOCALE,
  STORAGE_KEYS,
  EVENTS
} from '@/config/constants';

// Status de pedidos
if (order.status === ORDER_STATUS.PENDING) {
  // Processar pedido pendente
}

if (order.status === ORDER_STATUS.DELIVERED) {
  // Pedido entregue
}

// Status de pacientes
if (patient.status === PATIENT_STATUS.ACTIVE) {
  // Paciente ativo
}

// Status de produtos
if (product.status === PRODUCT_STATUS.OUT_OF_STOCK) {
  // Produto sem estoque
}

// Tipos de notificação
if (notification.type === NOTIFICATION_TYPES.ORDER) {
  // Notificação de pedido
}

// Status codes HTTP
if (response.status === HTTP_STATUS.OK) {
  // Requisição bem-sucedida
}

if (response.status === HTTP_STATUS.UNAUTHORIZED) {
  // Usuário não autorizado
}

// Limites
const maxFileSize = LIMITS.MAX_FILE_SIZE; // 5MB
const defaultPageSize = LIMITS.DEFAULT_PAGE_SIZE; // 20
const maxNameLength = LIMITS.MAX_NAME_LENGTH; // 100

// Validação
const emailPattern = VALIDATION.EMAIL_PATTERN;
const cpfPattern = VALIDATION.CPF_PATTERN;
const requiredMessage = VALIDATION.MESSAGES.REQUIRED; // "Este campo é obrigatório"

// Tema
const primaryColor = THEME.COLORS.PRIMARY; // #2563eb
const successColor = THEME.COLORS.SUCCESS; // #16a34a

// Localização
const defaultLocale = LOCALE.DEFAULT; // pt-BR
const supportedLocales = LOCALE.SUPPORTED; // ['pt-BR', 'en-US', 'es-ES']

// Storage keys
const authTokenKey = STORAGE_KEYS.AUTH_TOKEN; // vitalis_auth_token
const userDataKey = STORAGE_KEYS.USER_DATA; // vitalis_user_data

// Eventos
const loginEvent = EVENTS.AUTH.LOGIN; // auth:login
const orderCreatedEvent = EVENTS.ORDERS.CREATED; // orders:created
```

## 🔧 Exemplo Prático em um Componente

```typescript
import React, { useEffect, useState } from 'react';
import { 
  getApiUrl, 
  getEndpoint,
  ORDER_STATUS,
  HTTP_STATUS,
  LIMITS,
  isFeatureEnabled 
} from '@/config';

interface Order {
  id: number;
  status: typeof ORDER_STATUS[keyof typeof ORDER_STATUS];
  // ... outros campos
}

const OrdersList: React.FC = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        setLoading(true);
        
        // Usar configurações da API
        const ordersUrl = getApiUrl('/orders');
        const response = await fetch(ordersUrl, {
          headers: {
            'Content-Type': 'application/json',
          },
          timeout: 30000, // Usar timeout da configuração
        });

        if (response.status === HTTP_STATUS.OK) {
          const data = await response.json();
          setOrders(data.slice(0, LIMITS.DEFAULT_PAGE_SIZE));
        }
      } catch (error) {
        console.error('Erro ao carregar pedidos:', error);
      } finally {
        setLoading(false);
      }
    };

    // Verificar se feature está habilitada
    if (isFeatureEnabled('realTimeUpdates')) {
      fetchOrders();
    }
  }, []);

  const updateOrderStatus = async (orderId: number, newStatus: typeof ORDER_STATUS[keyof typeof ORDER_STATUS]) => {
    try {
      // Usar endpoint com parâmetros
      const updateUrl = getEndpoint('/orders/:id/status', { id: orderId });
      const fullUrl = getApiUrl(updateUrl);
      
      const response = await fetch(fullUrl, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status: newStatus }),
      });

      if (response.status === HTTP_STATUS.OK) {
        // Atualizar lista de pedidos
        setOrders(prev => prev.map(order => 
          order.id === orderId ? { ...order, status: newStatus } : order
        ));
      }
    } catch (error) {
      console.error('Erro ao atualizar status:', error);
    }
  };

  return (
    <div>
      <h2>Lista de Pedidos</h2>
      {loading ? (
        <p>Carregando...</p>
      ) : (
        <div>
          {orders.map(order => (
            <div key={order.id}>
              <span>Pedido #{order.id}</span>
              <span>Status: {order.status}</span>
              {order.status === ORDER_STATUS.PENDING && (
                <button onClick={() => updateOrderStatus(order.id, ORDER_STATUS.ACCEPTED)}>
                  Aceitar
                </button>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default OrdersList;
```

## 🎯 Benefícios da Nova Estrutura

1. **Organização Clara** - Configurações separadas por responsabilidade
2. **Type Safety** - TypeScript com tipos bem definidos
3. **Reutilização** - Constantes e configurações centralizadas
4. **Manutenibilidade** - Estrutura lógica e intuitiva
5. **Escalabilidade** - Fácil adicionar novas configurações
6. **Documentação** - JSDoc em todas as funções e configurações

## 📝 Dicas de Uso

- Use importações específicas por categoria para melhor performance
- Mantenha a consistência nas importações em todo o projeto
- Use as funções utilitárias para obter configurações
- Aproveite o type safety do TypeScript
- Documente novas configurações seguindo o padrão estabelecido
