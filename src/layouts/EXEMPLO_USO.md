# Exemplos de Uso dos Layouts

Este arquivo demonstra como usar os diferentes layouts organizados na aplicação.

## Antes da Organização

```typescript
// ❌ Antes: Importação direta do arquivo
import MainLayout from '@/layouts/MainLayout';

// ❌ Antes: Uso limitado a um único layout
function App() {
  return (
    <MainLayout>
      <h1>Conteúdo</h1>
    </MainLayout>
  );
}
```

## Depois da Organização

### 1. Importações Organizadas

```typescript
// ✅ Agora: Importação específica por categoria
import { MainLayout } from '@/layouts/main';
import { AuthLayout } from '@/layouts/auth';
import { DashboardLayout } from '@/layouts/dashboard';
import { AdminLayout } from '@/layouts/admin';
import { PublicLayout } from '@/layouts/public';

// ✅ Agora: Importação geral centralizada
import { 
  MainLayout, 
  AuthLayout, 
  DashboardLayout, 
  AdminLayout, 
  PublicLayout 
} from '@/layouts';
```

### 2. Layout Principal (MainLayout)

```typescript
// ✅ Uso do layout principal para páginas autenticadas
import { MainLayout } from '@/layouts';

function PedidosPage() {
  return (
    <MainLayout>
      <div className="space-y-6">
        <h1 className="text-2xl font-bold">Gerenciar Pedidos</h1>
        <PedidosList />
      </div>
    </MainLayout>
  );
}

function PacientesPage() {
  return (
    <MainLayout>
      <div className="space-y-6">
        <h1 className="text-2xl font-bold">Pacientes</h1>
        <PacientesList />
      </div>
    </MainLayout>
  );
}
```

### 3. Layout de Autenticação (AuthLayout)

```typescript
// ✅ Uso do layout de autenticação
import { AuthLayout } from '@/layouts';

function LoginPage() {
  return (
    <AuthLayout 
      title="Entrar no Vitalis"
      subtitle="Acesse sua conta da farmácia"
      showLogo={true}
    >
      <LoginForm />
    </AuthLayout>
  );
}

function RegisterPage() {
  return (
    <AuthLayout 
      title="Criar Conta"
      subtitle="Cadastre sua farmácia no Vitalis"
      showLogo={true}
    >
      <RegisterForm />
    </AuthLayout>
  );
}

function ForgotPasswordPage() {
  return (
    <AuthLayout 
      title="Recuperar Senha"
      subtitle="Digite seu email para receber o link de recuperação"
      showLogo={false}
    >
      <ForgotPasswordForm />
    </AuthLayout>
  );
}
```

### 4. Layout de Dashboard (DashboardLayout)

```typescript
// ✅ Uso do layout de dashboard com métricas
import { DashboardLayout } from '@/layouts';

function DashboardPage() {
  return (
    <DashboardLayout 
      title="Dashboard da Farmácia"
      subtitle="Visão geral dos pedidos e pacientes"
      showMetrics={true}
      showNotifications={true}
    >
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <PedidosChart />
        <PacientesChart />
      </div>
    </DashboardLayout>
  );
}

function AnalyticsPage() {
  return (
    <DashboardLayout 
      title="Analytics"
      subtitle="Análises detalhadas e relatórios"
      showMetrics={false}
      showNotifications={true}
    >
      <AnalyticsContent />
    </DashboardLayout>
  );
}
```

### 5. Layout Administrativo (AdminLayout)

```typescript
// ✅ Uso do layout administrativo
import { AdminLayout } from '@/layouts';

function UserManagementPage() {
  const customActions = (
    <button className="bg-red-600 text-white px-4 py-2 rounded-md">
      Excluir Usuário
    </button>
  );

  return (
    <AdminLayout 
      title="Gerenciar Usuários"
      subtitle="Controle de acesso e permissões"
      showBreadcrumbs={true}
      showActions={true}
      actions={customActions}
    >
      <UserManagementTable />
    </AdminLayout>
  );
}

function SystemSettingsPage() {
  return (
    <AdminLayout 
      title="Configurações do Sistema"
      subtitle="Configurações gerais da aplicação"
      showBreadcrumbs={true}
      showActions={false}
    >
      <SystemSettingsForm />
    </AdminLayout>
  );
}
```

### 6. Layout Público (PublicLayout)

```typescript
// ✅ Uso do layout público
import { PublicLayout } from '@/layouts';

function LandingPage() {
  return (
    <PublicLayout 
      title="Vitalis"
      description="Sistema de Gestão para Farmácias"
      showHeader={true}
      showFooter={true}
    >
      <HeroSection />
      <FeaturesSection />
      <PricingSection />
    </PublicLayout>
  );
}

function AboutPage() {
  return (
    <PublicLayout 
      title="Sobre o Vitalis"
      description="Conheça nossa história e missão"
      showHeader={true}
      showFooter={true}
    >
      <AboutContent />
    </PublicLayout>
  );
}

function TermsPage() {
  return (
    <PublicLayout 
      title="Termos de Uso"
      description="Termos e condições do serviço"
      showHeader={false}
      showFooter={true}
    >
      <TermsContent />
    </PublicLayout>
  );
}
```

### 7. Uso com React Router

```typescript
// ✅ Configuração de rotas com layouts organizados
import { createBrowserRouter } from 'react-router-dom';
import { 
  MainLayout, 
  AuthLayout, 
  DashboardLayout, 
  AdminLayout, 
  PublicLayout 
} from '@/layouts';

const router = createBrowserRouter([
  {
    path: '/',
    element: <PublicLayout />,
    children: [
      { path: '/', element: <LandingPage /> },
      { path: '/sobre', element: <AboutPage /> },
      { path: '/contato', element: <ContactPage /> },
    ]
  },
  {
    path: '/auth',
    element: <AuthLayout />,
    children: [
      { path: '/auth/login', element: <LoginPage /> },
      { path: '/auth/register', element: <RegisterPage /> },
      { path: '/auth/forgot-password', element: <ForgotPasswordPage /> },
    ]
  },
  {
    path: '/app',
    element: <MainLayout />,
    children: [
      { path: '/app/pedidos', element: <PedidosPage /> },
      { path: '/app/pacientes', element: <PacientesPage /> },
      { path: '/app/produtos', element: <ProdutosPage /> },
    ]
  },
  {
    path: '/dashboard',
    element: <DashboardLayout />,
    children: [
      { path: '/dashboard', element: <DashboardPage /> },
      { path: '/dashboard/analytics', element: <AnalyticsPage /> },
    ]
  },
  {
    path: '/admin',
    element: <AdminLayout />,
    children: [
      { path: '/admin/users', element: <UserManagementPage /> },
      { path: '/admin/settings', element: <SystemSettingsPage /> },
    ]
  }
]);
```

### 8. Uso com Context API

```typescript
// ✅ Integração com contextos
import { useAuth } from '@/contexts/auth';
import { useTheme } from '@/contexts/ui';
import { MainLayout } from '@/layouts';

function App() {
  const { user } = useAuth();
  const { theme } = useTheme();

  if (!user) {
    return <AuthLayout><LoginPage /></AuthLayout>;
  }

  return (
    <MainLayout>
      <Router />
    </MainLayout>
  );
}
```

## Benefícios Práticos

### 1. **Organização Clara**
- Cada layout tem uma responsabilidade específica
- Fácil localização e manutenção
- Código mais limpo e legível

### 2. **Reutilização**
- Layouts podem ser reutilizados em diferentes páginas
- Props customizáveis para diferentes contextos
- Consistência visual em toda a aplicação

### 3. **Escalabilidade**
- Fácil adição de novos layouts
- Estrutura preparada para crescimento
- Padrões estabelecidos para novos desenvolvedores

### 4. **Performance**
- Importações otimizadas com barrel exports
- Lazy loading de layouts quando necessário
- Bundle splitting automático

### 5. **Manutenibilidade**
- Mudanças em um layout afetam todas as páginas que o usam
- Debugging mais fácil com estrutura organizada
- Documentação clara e exemplos práticos
