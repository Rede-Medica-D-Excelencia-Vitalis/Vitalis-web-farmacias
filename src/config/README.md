# Configurações do Sistema - Vitalis Gestor de Pedidos

Esta pasta contém todas as configurações do sistema organizadas de forma profissional por categoria e responsabilidade.

## 📁 Estrutura de Pastas

### 🌍 `environment/`
Configurações relacionadas ao ambiente de execução.
- **env.ts** - Configurações de ambiente padrão
- **env.local.ts** - Configurações de ambiente local
- **index.ts** - Exportações das configurações de ambiente

### 🚀 `app/`
Configurações principais da aplicação.
- **app.config.ts** - Configurações gerais do app (nome, versão, features, UI, performance)
- **index.ts** - Exportações das configurações da aplicação

### 🔌 `api/`
Configurações relacionadas à API e comunicação com o backend.
- **api.config.ts** - Endpoints, timeouts, headers, retry, cache
- **index.ts** - Exportações das configurações da API

### 📋 `constants/`
Constantes e valores fixos da aplicação.
- **index.ts** - Status codes, enums, limites, validações, temas, localização

## 🔧 Como Usar as Configurações

### Importação por Categoria

```typescript
// Configurações de ambiente
import { config, getConfig } from '@/config/environment';

// Configurações da aplicação
import { appConfig, getAppConfig, isFeatureEnabled } from '@/config/app';

// Configurações da API
import { apiConfig, getApiUrl, getEndpoint } from '@/config/api';

// Constantes
import { ORDER_STATUS, HTTP_STATUS, LIMITS } from '@/config/constants';
```

### Importação Global

```typescript
import {
  // Environment
  config,
  getConfig,
  
  // App
  appConfig,
  getAppConfig,
  isFeatureEnabled,
  
  // API
  apiConfig,
  getApiUrl,
  getEndpoint,
  
  // Constants
  ORDER_STATUS,
  HTTP_STATUS,
  LIMITS,
  THEME,
  LOCALE
} from '@/config';
```

## 📊 Exemplos de Uso

### Configurações de Ambiente
```typescript
import { config } from '@/config/environment';

console.log(config.API_URL); // http://localhost:3001/api
console.log(config.APP_NAME); // Vitalis - Gestor de Pedidos
```

### Verificar Features
```typescript
import { isFeatureEnabled } from '@/config/app';

if (isFeatureEnabled('notifications')) {
  // Habilitar sistema de notificações
}
```

### Usar Endpoints da API
```typescript
import { getApiUrl, getEndpoint } from '@/config/api';

const ordersUrl = getApiUrl('/orders'); // http://localhost:3001/api/orders
const orderUrl = getEndpoint('/orders/:id', { id: 123 }); // /orders/123
```

### Usar Constantes
```typescript
import { ORDER_STATUS, HTTP_STATUS, LIMITS } from '@/config/constants';

if (order.status === ORDER_STATUS.PENDING) {
  // Processar pedido pendente
}

if (response.status === HTTP_STATUS.OK) {
  // Requisição bem-sucedida
}

const maxFileSize = LIMITS.MAX_FILE_SIZE; // 5MB
```

## 🎯 Benefícios da Organização

1. **Separação Clara** - Configurações organizadas por responsabilidade
2. **Facilita Manutenção** - Estrutura lógica e intuitiva
3. **Reutilização** - Constantes e configurações centralizadas
4. **Type Safety** - TypeScript com tipos bem definidos
5. **Escalabilidade** - Fácil adicionar novas configurações
6. **Documentação** - JSDoc em todas as funções e configurações

## 🔄 Migração da Estrutura Antiga

### ❌ Antes
```typescript
// Configurações espalhadas
import { config } from '@/config/env';
import { localConfig } from '@/config/env.local';
```

### ✅ Depois
```typescript
// Configurações organizadas
import { config, localConfig } from '@/config/environment';
// ou
import { config, localConfig } from '@/config';
```

## 📝 Convenções de Nomenclatura

- **camelCase** para nomes de funções e variáveis
- **UPPER_SNAKE_CASE** para constantes
- **kebab-case** para nomes de pastas
- **PascalCase** para tipos TypeScript
- Sufixo `.config.ts` para arquivos de configuração
- Sufixo `.ts` para arquivos TypeScript

## 🚀 Próximos Passos

1. Implementar validação de configurações em runtime
2. Adicionar configurações específicas por ambiente (dev, staging, prod)
3. Implementar sistema de configurações dinâmicas
4. Adicionar testes unitários para configurações
5. Implementar sistema de configurações por usuário
6. Adicionar configurações de segurança e criptografia

## 📋 Notas de Desenvolvimento

- Mantenha configurações sensíveis em variáveis de ambiente
- Use TypeScript strict mode para type safety
- Documente todas as configurações com JSDoc
- Implemente validação de configurações obrigatórias
- Mantenha configurações de desenvolvimento separadas das de produção
- Use constantes para valores mágicos e limites
