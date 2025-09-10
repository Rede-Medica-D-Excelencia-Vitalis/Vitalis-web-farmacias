# Contextos do Sistema - Vitalis Gestor de Pedidos

Esta pasta contém todos os contextos React organizados de forma profissional por funcionalidade e responsabilidade.

## 📁 Estrutura de Pastas

### 🔐 `auth/`
Contextos relacionados à autenticação e autorização.
- **AuthContext.tsx** - Gerenciamento de autenticação, login, logout, verificação de usuário
- **index.ts** - Exportações do contexto de autenticação

### 🎨 `ui/`
Contextos relacionados à interface do usuário.
- **ThemeContext.tsx** - Gerenciamento de tema (claro/escuro)
- **index.ts** - Exportações do contexto de UI

### 🔔 `notifications/`
Contextos relacionados ao sistema de notificações.
- **NotificationContext.tsx** - Gerenciamento de notificações, toasts, configurações
- **index.ts** - Exportações do contexto de notificações

### 📦 `orders/`
Contextos relacionados ao gerenciamento de pedidos.
- **OrderContext.tsx** - Gerenciamento de pedidos, filtros, paginação, ações
- **index.ts** - Exportações do contexto de pedidos

### 👥 `patients/`
Contextos relacionados ao gerenciamento de pacientes.
- **PatientContext.tsx** - Gerenciamento de pacientes, filtros, paginação, ações
- **index.ts** - Exportações do contexto de pacientes

### 💊 `products/`
Contextos relacionados ao gerenciamento de produtos.
- **ProductContext.tsx** - Gerenciamento de produtos, estoque, filtros, ações
- **index.ts** - Exportações do contexto de produtos

### ⚙️ `settings/`
Contextos relacionados às configurações do sistema.
- **SettingsContext.tsx** - Configurações da farmácia, usuário e sistema
- **index.ts** - Exportações do contexto de configurações

## 🔧 Como Usar os Contextos

### Importação por Categoria

```typescript
// Contexto de autenticação
import { AuthProvider, useAuth } from '@/contexts/auth';

// Contexto de UI
import { ThemeProvider, useTheme } from '@/contexts/ui';

// Contexto de notificações
import { NotificationProvider, useNotifications } from '@/contexts/notifications';

// Contexto de pedidos
import { OrderProvider, useOrders } from '@/contexts/orders';

// Contexto de pacientes
import { PatientProvider, usePatients } from '@/contexts/patients';

// Contexto de produtos
import { ProductProvider, useProducts } from '@/contexts/products';

// Contexto de configurações
import { SettingsProvider, useSettings } from '@/contexts/settings';
```

### Importação Global

```typescript
import {
  // Auth
  AuthProvider,
  useAuth,
  
  // UI
  ThemeProvider,
  useTheme,
  
  // Notifications
  NotificationProvider,
  useNotifications,
  
  // Orders
  OrderProvider,
  useOrders,
  
  // Patients
  PatientProvider,
  usePatients,
  
  // Products
  ProductProvider,
  useProducts,
  
  // Settings
  SettingsProvider,
  useSettings
} from '@/contexts';
```

## 📊 Exemplos de Uso

### Contexto de Autenticação
```typescript
import { useAuth } from '@/contexts/auth';

const MyComponent = () => {
  const { user, isAuthenticated, login, logout } = useAuth();

  if (!isAuthenticated) {
    return <LoginForm onLogin={login} />;
  }

  return (
    <div>
      <p>Bem-vindo, {user?.name}!</p>
      <button onClick={logout}>Sair</button>
    </div>
  );
};
```

### Contexto de Notificações
```typescript
import { useNotifications } from '@/contexts/notifications';

const MyComponent = () => {
  const { 
    notifications, 
    unreadCount, 
    addNotification, 
    showSuccess, 
    showError 
  } = useNotifications();

  const handleSuccess = () => {
    showSuccess('Operação realizada com sucesso!');
  };

  const handleError = () => {
    showError('Erro ao realizar operação');
  };

  return (
    <div>
      <p>Notificações não lidas: {unreadCount}</p>
      <button onClick={handleSuccess}>Sucesso</button>
      <button onClick={handleError}>Erro</button>
    </div>
  );
};
```

### Contexto de Pedidos
```typescript
import { useOrders } from '@/contexts/orders';

const OrdersList = () => {
  const { 
    orders, 
    filteredOrders, 
    isLoading, 
    loadOrders, 
    updateOrderStatus 
  } = useOrders();

  useEffect(() => {
    loadOrders();
  }, []);

  if (isLoading) {
    return <div>Carregando...</div>;
  }

  return (
    <div>
      {filteredOrders.map(order => (
        <div key={order.id}>
          <h3>Pedido #{order.id}</h3>
          <p>Status: {order.status}</p>
          <button onClick={() => updateOrderStatus(order.id, 'accepted')}>
            Aceitar
          </button>
        </div>
      ))}
    </div>
  );
};
```

### Contexto de Configurações
```typescript
import { useSettings } from '@/contexts/settings';

const SettingsPanel = () => {
  const { 
    pharmacy, 
    user, 
    system, 
    updateUserSettings, 
    updatePharmacySettings 
  } = useSettings();

  const handleThemeChange = (theme: 'light' | 'dark') => {
    updateUserSettings({ theme });
  };

  return (
    <div>
      <h2>Configurações da Farmácia</h2>
      <p>Nome: {pharmacy.name}</p>
      <p>CNPJ: {pharmacy.cnpj}</p>
      
      <h2>Configurações do Usuário</h2>
      <select 
        value={user.theme} 
        onChange={(e) => handleThemeChange(e.target.value as 'light' | 'dark')}
      >
        <option value="light">Claro</option>
        <option value="dark">Escuro</option>
      </select>
    </div>
  );
};
```

## 🎯 Benefícios da Organização

1. **Separação Clara** - Contextos organizados por responsabilidade
2. **Facilita Manutenção** - Estrutura lógica e intuitiva
3. **Reutilização** - Contextos centralizados e bem definidos
4. **Type Safety** - TypeScript com tipos bem definidos
5. **Escalabilidade** - Fácil adicionar novos contextos
6. **Documentação** - JSDoc em todas as funções e interfaces

## 🔄 Migração da Estrutura Antiga

### ❌ Antes
```typescript
// Contextos espalhados
import { AuthProvider } from '@/contexts';
import { ThemeProvider } from '@/contexts';
```

### ✅ Depois
```typescript
// Contextos organizados
import { AuthProvider } from '@/contexts/auth';
import { ThemeProvider } from '@/contexts/ui';
// ou
import { AuthProvider, ThemeProvider } from '@/contexts';
```

## 📝 Convenções de Nomenclatura

- **PascalCase** para nomes de contextos e providers
- **camelCase** para nomes de hooks e funções
- **kebab-case** para nomes de pastas
- **PascalCase** para tipos TypeScript
- Sufixo `.tsx` para arquivos de contexto
- Sufixo `.ts` para arquivos de exportação

## 🚀 Próximos Passos

1. Implementar contextos para outras funcionalidades (relatórios, analytics, etc.)
2. Adicionar testes unitários para cada contexto
3. Implementar persistência de estado com localStorage/sessionStorage
4. Adicionar middleware para interceptação de ações
5. Implementar contextos para funcionalidades específicas (chat, upload, etc.)
6. Adicionar validação de dados nos contextos

## 📋 Notas de Desenvolvimento

- Mantenha contextos pequenos e focados em uma responsabilidade
- Use TypeScript strict mode para type safety
- Documente todas as interfaces e funções com JSDoc
- Implemente error boundaries onde apropriado
- Mantenha estado local quando possível, use contexto apenas para estado global
- Implemente loading states e error handling em todos os contextos
- Use React.memo e useMemo para otimização de performance
