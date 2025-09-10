# Exemplos de Importações - Nova Estrutura Organizada

Este arquivo demonstra como usar a nova estrutura organizacional dos componentes.

## 🔄 Antes vs Depois

### ❌ Antes (Estrutura Antiga)
```typescript
// Importações espalhadas e desorganizadas
import { PatientList } from '@/components/PatientList';
import { OrdersList } from '@/components/OrdersList';
import { DashboardCharts } from '@/components/DashboardCharts';
import { Sidebar } from '@/components/Sidebar';
import { Notifications } from '@/components/Notifications';
```

### ✅ Depois (Estrutura Organizada)
```typescript
// Importações organizadas por categoria
import { PatientList } from '@/components/patients';
import { OrdersList } from '@/components/orders';
import { DashboardCharts } from '@/components/dashboard';
import { Sidebar } from '@/components/layout';
import { Notifications } from '@/components/notifications';
```

## 📦 Importações por Categoria

### 🏗️ Layout
```typescript
import { Sidebar } from '@/components/layout';
```

### 🔐 Autenticação
```typescript
import { ProtectedRoute, AccessDenied } from '@/components/auth';
```

### 📊 Dashboard
```typescript
import { 
  DashboardCharts, 
  EntregaTracker, 
  CustomerReviews 
} from '@/components/dashboard';
```

### 📦 Pedidos
```typescript
import { 
  OrdersList, 
  OrderChat, 
  OrderTrackingMap 
} from '@/components/orders';
```

### 👥 Pacientes
```typescript
import { PatientList } from '@/components/patients';
```

### 💊 Produtos
```typescript
import { ProductsList, ProductImage } from '@/components/products';
```

### 🔔 Notificações
```typescript
import { Notifications, NotificationDemo } from '@/components/notifications';
```

### ⚙️ Configurações
```typescript
import { 
  SettingsForm, 
  StoreSettings, 
  SoundCustomizer 
} from '@/components/settings';
```

### 🚀 Funcionalidades
```typescript
import { MotoboySelector } from '@/components/features';
```

## 🎯 Importação Global (Opcional)

Se preferir importar tudo de uma vez:

```typescript
import {
  // Layout
  Sidebar,
  
  // Auth
  ProtectedRoute,
  AccessDenied,
  
  // Dashboard
  DashboardCharts,
  EntregaTracker,
  CustomerReviews,
  
  // Orders
  OrdersList,
  OrderChat,
  OrderTrackingMap,
  
  // Patients
  PatientList,
  
  // Products
  ProductsList,
  ProductImage,
  
  // Notifications
  Notifications,
  NotificationDemo,
  
  // Settings
  SettingsForm,
  StoreSettings,
  SoundCustomizer,
  
  // Features
  MotoboySelector
} from '@/components';
```

## 🔧 Exemplo de Uso em um Componente

```typescript
import React from 'react';
import { 
  Sidebar, 
  PatientList, 
  OrdersList, 
  DashboardCharts,
  Notifications 
} from '@/components';

const PharmacyDashboard: React.FC = () => {
  return (
    <div className="flex h-screen">
      <Sidebar />
      <main className="flex-1 p-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <DashboardCharts />
          <OrdersList />
        </div>
        <div className="mt-6">
          <PatientList />
        </div>
        <Notifications />
      </main>
    </div>
  );
};

export default PharmacyDashboard;
```

## 🚀 Benefícios da Nova Estrutura

1. **Organização Clara** - Componentes relacionados ficam juntos
2. **Importações Intuitivas** - Fácil de encontrar o que você precisa
3. **Manutenção Simplificada** - Estrutura lógica facilita manutenção
4. **Escalabilidade** - Fácil adicionar novos componentes
5. **Trabalho em Equipe** - Estrutura clara para todos os desenvolvedores

## 📝 Dicas de Uso

- Use importações específicas por categoria para melhor performance
- Mantenha a consistência nas importações em todo o projeto
- Documente novos componentes seguindo a estrutura estabelecida
- Use o arquivo `index.ts` principal apenas quando necessário importar muitos componentes
