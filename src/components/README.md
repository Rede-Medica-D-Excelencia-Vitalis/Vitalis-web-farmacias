# Estrutura de Componentes - Sistema de Farmácias

Esta pasta contém todos os componentes React/TypeScript organizados de forma profissional por funcionalidade e responsabilidade.

## 📁 Estrutura de Pastas

### 🏗️ `layout/`
Componentes relacionados ao layout e estrutura da aplicação.
- **Sidebar.tsx** - Barra lateral de navegação

### 🔐 `auth/`
Componentes relacionados à autenticação e autorização.
- **ProtectedRoute.tsx** - Rota protegida que verifica autenticação
- **AccessDenied.tsx** - Página de acesso negado

### 📊 `dashboard/`
Componentes específicos do dashboard e análises.
- **DashboardCharts.tsx** - Gráficos e visualizações do dashboard
- **EntregaTracker.tsx** - Rastreador de entregas
- **CustomerReviews.tsx** - Avaliações de clientes

### 📦 `orders/`
Componentes relacionados ao gerenciamento de pedidos.
- **OrdersList.tsx** - Lista de pedidos
- **OrderChat.tsx** - Chat de comunicação do pedido
- **OrderTrackingMap.tsx** - Mapa de rastreamento do pedido

### 👥 `patients/`
Componentes relacionados ao gerenciamento de pacientes.
- **PatientList.tsx** - Lista de pacientes

### 💊 `products/`
Componentes relacionados ao gerenciamento de produtos.
- **ProductsList.tsx** - Lista de produtos
- **ProductImage.tsx** - Exibição de imagem do produto

### 🔔 `notifications/`
Componentes relacionados ao sistema de notificações.
- **Notifications.tsx** - Sistema de notificações
- **NotificationDemo.tsx** - Demonstração de notificações

### ⚙️ `settings/`
Componentes relacionados às configurações do sistema.
- **SettingsForm.tsx** - Formulário de configurações
- **StoreSettings.tsx** - Configurações da loja
- **SoundCustomizer.tsx** - Personalizador de sons

### 🚀 `features/`
Componentes de funcionalidades específicas.
- **MotoboySelector.tsx** - Seletor de motoboys

### 🎨 `ui/`
Componentes de interface do usuário reutilizáveis (shadcn/ui).
- Todos os componentes base do design system

### 🔗 `ui-shared/`
Componentes de interface compartilhados entre diferentes módulos.
- Componentes customizados reutilizáveis

## 📋 Convenções de Nomenclatura

- **PascalCase** para nomes de componentes
- **camelCase** para nomes de arquivos de utilitários
- **kebab-case** para nomes de pastas
- Sufixo `.tsx` para componentes React
- Sufixo `.ts` para utilitários TypeScript

## 🔄 Como Importar Componentes

### Importação Direta
```typescript
import { PatientList } from '@/components/patients/PatientList';
import { OrdersList } from '@/components/orders/OrdersList';
```

### Importação via Index (Recomendado)
```typescript
import { PatientList } from '@/components/patients';
import { OrdersList } from '@/components/orders';
```

## 🎯 Benefícios da Organização

1. **Facilita a Manutenção** - Componentes relacionados ficam juntos
2. **Melhora a Escalabilidade** - Estrutura clara para novos componentes
3. **Reduz a Complexidade** - Separação clara de responsabilidades
4. **Facilita o Trabalho em Equipe** - Estrutura intuitiva para novos desenvolvedores
5. **Otimiza as Importações** - Organização lógica reduz caminhos complexos

## 🚀 Próximos Passos

1. Criar arquivos `index.ts` em cada pasta para facilitar importações
2. Implementar lazy loading para componentes pesados
3. Adicionar testes unitários para cada componente
4. Documentar props e interfaces de cada componente
5. Implementar storybook para documentação visual

## 📝 Notas de Desenvolvimento

- Mantenha a consistência na nomenclatura
- Documente componentes complexos com JSDoc
- Use TypeScript strict mode
- Implemente error boundaries onde apropriado
- Mantenha componentes pequenos e focados em uma responsabilidade
