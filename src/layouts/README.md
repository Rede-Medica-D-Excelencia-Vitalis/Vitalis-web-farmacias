# Layouts

Esta pasta contém todos os layouts da aplicação, organizados por categoria e funcionalidade.

## Estrutura

```
layouts/
├── main/           # Layouts principais da aplicação
├── auth/           # Layouts para páginas de autenticação
├── dashboard/      # Layouts para dashboards e métricas
├── admin/          # Layouts para área administrativa
├── public/         # Layouts para páginas públicas
└── index.ts        # Exportações centralizadas
```

## Categorias

### 📋 Main
Layouts principais usados na aplicação autenticada.

- **MainLayout**: Layout principal com sidebar, área de conteúdo e notificações

### 🔐 Auth
Layouts específicos para páginas de autenticação.

- **AuthLayout**: Layout limpo e focado para login, registro, recuperação de senha

### 📊 Dashboard
Layouts otimizados para exibição de dashboards e métricas.

- **DashboardLayout**: Layout com métricas rápidas, gráficos e widgets

### ⚙️ Admin
Layouts para área administrativa com controles avançados.

- **AdminLayout**: Layout com breadcrumbs, ações administrativas e gerenciamento

### 🌐 Public
Layouts para páginas públicas e informativas.

- **PublicLayout**: Layout para landing pages, termos de uso, política de privacidade

## Uso

### Importação

```typescript
// Importação específica
import { MainLayout } from '@/layouts/main';
import { AuthLayout } from '@/layouts/auth';
import { DashboardLayout } from '@/layouts/dashboard';
import { AdminLayout } from '@/layouts/admin';
import { PublicLayout } from '@/layouts/public';

// Importação geral
import { MainLayout, AuthLayout, DashboardLayout, AdminLayout, PublicLayout } from '@/layouts';
```

### Exemplos de Uso

#### MainLayout
```typescript
import { MainLayout } from '@/layouts';

function App() {
  return (
    <MainLayout>
      <h1>Conteúdo da página</h1>
    </MainLayout>
  );
}
```

#### AuthLayout
```typescript
import { AuthLayout } from '@/layouts';

function LoginPage() {
  return (
    <AuthLayout 
      title="Entrar no Vitalis"
      subtitle="Acesse sua conta"
    >
      <LoginForm />
    </AuthLayout>
  );
}
```

#### DashboardLayout
```typescript
import { DashboardLayout } from '@/layouts';

function DashboardPage() {
  return (
    <DashboardLayout 
      title="Dashboard da Farmácia"
      subtitle="Visão geral dos pedidos e pacientes"
      showMetrics={true}
    >
      <DashboardContent />
    </DashboardLayout>
  );
}
```

#### AdminLayout
```typescript
import { AdminLayout } from '@/layouts';

function AdminPage() {
  return (
    <AdminLayout 
      title="Gerenciar Usuários"
      subtitle="Controle de acesso e permissões"
      showBreadcrumbs={true}
      showActions={true}
    >
      <UserManagement />
    </AdminLayout>
  );
}
```

#### PublicLayout
```typescript
import { PublicLayout } from '@/layouts';

function LandingPage() {
  return (
    <PublicLayout 
      title="Vitalis"
      description="Sistema de Gestão para Farmácias"
      showHeader={true}
      showFooter={true}
    >
      <LandingContent />
    </PublicLayout>
  );
}
```

## Características dos Layouts

### Props Comuns
- `children`: Conteúdo a ser renderizado
- `title`: Título da página
- `subtitle`: Subtítulo da página

### Funcionalidades
- **Responsividade**: Todos os layouts são responsivos
- **Notificações**: Integração com sistema de notificações
- **Navegação**: Breadcrumbs e navegação contextual
- **Acessibilidade**: Suporte a ARIA labels e navegação por teclado
- **Tema**: Consistência visual com o design system

### Integração
- **React Router**: Suporte ao `Outlet` para roteamento
- **Context API**: Integração com contextos de autenticação e tema
- **API Service**: Integração com serviços de API
- **Toast**: Sistema de notificações toast

## Convenções

1. **Nomenclatura**: Use PascalCase para nomes de componentes
2. **Props**: Use interfaces TypeScript para definir props
3. **Documentação**: Inclua JSDoc para todos os componentes
4. **Responsividade**: Sempre considere mobile-first
5. **Acessibilidade**: Inclua atributos ARIA quando necessário

## Desenvolvimento

### Criando um Novo Layout

1. Crie o arquivo na pasta apropriada
2. Defina a interface TypeScript para props
3. Implemente o componente com JSDoc
4. Crie/atualize o `index.ts` da pasta
5. Atualize este README se necessário

### Exemplo de Estrutura

```typescript
/**
 * Descrição do layout
 * 
 * Este layout é usado para...
 */

import { Outlet } from 'react-router-dom';
import { Toaster } from '@/components/ui/toaster';

interface LayoutProps {
  children?: React.ReactNode;
  // outras props...
}

/**
 * Componente de layout
 * 
 * @param children - Componentes filhos
 * @returns JSX.Element
 */
const Layout = ({ children }: LayoutProps) => {
  return (
    <div className="min-h-screen">
      {/* Estrutura do layout */}
      {children || <Outlet />}
      <Toaster />
    </div>
  );
};

export default Layout;
```

## Benefícios da Organização

- **Manutenibilidade**: Fácil localização e manutenção
- **Reutilização**: Layouts específicos para diferentes contextos
- **Escalabilidade**: Estrutura preparada para crescimento
- **Consistência**: Padrões uniformes em toda a aplicação
- **Performance**: Importações otimizadas com barrel exports
