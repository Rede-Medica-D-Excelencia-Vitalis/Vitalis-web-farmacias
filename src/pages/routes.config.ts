/**
 * Configuração de Rotas das Páginas
 * 
 * Este arquivo centraliza a configuração de todas as rotas da aplicação,
 * organizadas por categoria funcional.
 */

import { lazy } from 'react';

// Lazy loading para melhor performance
const Login = lazy(() => import('./auth/Login'));
const Cadastro = lazy(() => import('./auth/Cadastro'));
const CadastroConcluido = lazy(() => import('./auth/CadastroConcluido'));

const Dashboard = lazy(() => import('./business/Dashboard'));
const Orders = lazy(() => import('./business/Orders'));
const Products = lazy(() => import('./business/Products'));
const Pharmacy = lazy(() => import('./business/Pharmacy'));
const Reports = lazy(() => import('./business/Reports'));
const RastreamentoPedido = lazy(() => import('./business/RastreamentoPedido'));

const Settings = lazy(() => import('./system/Settings'));
const Profile = lazy(() => import('./system/Profile'));
const Help = lazy(() => import('./system/Help'));
const NotFound = lazy(() => import('./system/NotFound'));

const TermosCondicao = lazy(() => import('./legal/TermosCondicao'));
const TermosConduta = lazy(() => import('./legal/TermosConduta'));

/**
 * Configuração das rotas organizadas por categoria
 */
export const routesConfig = {
  // Rotas de Autenticação
  auth: {
    login: {
      path: '/login',
      component: Login,
      title: 'Login',
      description: 'Acesse sua conta'
    },
    cadastro: {
      path: '/cadastro',
      component: Cadastro,
      title: 'Cadastro',
      description: 'Crie sua conta'
    },
    cadastroConcluido: {
      path: '/cadastro-concluido',
      component: CadastroConcluido,
      title: 'Cadastro Concluído',
      description: 'Confirmação de cadastro'
    }
  },

  // Rotas de Negócio
  business: {
    dashboard: {
      path: '/dashboard',
      component: Dashboard,
      title: 'Dashboard',
      description: 'Painel de controle',
      requiresAuth: true
    },
    orders: {
      path: '/pedidos',
      component: Orders,
      title: 'Pedidos',
      description: 'Gerenciamento de pedidos',
      requiresAuth: true
    },
    products: {
      path: '/produtos',
      component: Products,
      title: 'Produtos',
      description: 'Catálogo de produtos',
      requiresAuth: true
    },
    pharmacy: {
      path: '/farmacia',
      component: Pharmacy,
      title: 'Farmácia',
      description: 'Configurações da farmácia',
      requiresAuth: true
    },
    reports: {
      path: '/relatorios',
      component: Reports,
      title: 'Relatórios',
      description: 'Relatórios e análises',
      requiresAuth: true
    },
    rastreamento: {
      path: '/rastreamento/:entregaId',
      component: RastreamentoPedido,
      title: 'Rastreamento de Entrega',
      description: 'Rastreamento em tempo real da entrega',
      requiresAuth: true
    }
  },

  // Rotas do Sistema
  system: {
    settings: {
      path: '/configuracoes',
      component: Settings,
      title: 'Configurações',
      description: 'Configurações do sistema',
      requiresAuth: true
    },
    profile: {
      path: '/perfil',
      component: Profile,
      title: 'Perfil',
      description: 'Gerenciar perfil',
      requiresAuth: true
    },
    help: {
      path: '/ajuda',
      component: Help,
      title: 'Ajuda',
      description: 'Central de ajuda'
    }
  },

  // Rotas Legais
  legal: {
    termosCondicao: {
      path: '/termos-condicao',
      component: TermosCondicao,
      title: 'Termos e Condições',
      description: 'Termos de uso da plataforma'
    },
    termosConduta: {
      path: '/termos-conduta',
      component: TermosConduta,
      title: 'Código de Conduta',
      description: 'Código de conduta da plataforma'
    }
  },

  // Rota 404
  notFound: {
    path: '*',
    component: NotFound,
    title: 'Página não encontrada',
    description: 'Erro 404'
  }
};

/**
 * Função para obter todas as rotas em formato plano
 */
export const getAllRoutes = () => {
  const allRoutes = [];
  
  Object.values(routesConfig).forEach(category => {
    if (typeof category === 'object' && category !== null) {
      Object.values(category).forEach(route => {
        if (route && typeof route === 'object' && 'path' in route) {
          allRoutes.push(route);
        }
      });
    }
  });
  
  return allRoutes;
};

/**
 * Função para obter rotas que requerem autenticação
 */
export const getProtectedRoutes = () => {
  return getAllRoutes().filter(route => route.requiresAuth);
};

/**
 * Função para obter rotas públicas
 */
export const getPublicRoutes = () => {
  return getAllRoutes().filter(route => !route.requiresAuth);
};

/**
 * Função para buscar rota por path
 */
export const getRouteByPath = (path: string) => {
  return getAllRoutes().find(route => route.path === path);
};

/**
 * Função para obter breadcrumbs baseado no path atual
 */
export const getBreadcrumbs = (currentPath: string) => {
  const route = getRouteByPath(currentPath);
  if (!route) return [];
  
  const breadcrumbs = [
    { label: 'Início', path: '/' }
  ];
  
  // Adicionar breadcrumbs baseado na categoria
  if (currentPath.startsWith('/dashboard')) {
    breadcrumbs.push({ label: 'Dashboard', path: '/dashboard' });
  } else if (currentPath.startsWith('/pedidos')) {
    breadcrumbs.push({ label: 'Pedidos', path: '/pedidos' });
  } else if (currentPath.startsWith('/produtos')) {
    breadcrumbs.push({ label: 'Produtos', path: '/produtos' });
  } else if (currentPath.startsWith('/farmacia')) {
    breadcrumbs.push({ label: 'Farmácia', path: '/farmacia' });
  } else if (currentPath.startsWith('/relatorios')) {
    breadcrumbs.push({ label: 'Relatórios', path: '/relatorios' });
  } else if (currentPath.startsWith('/configuracoes')) {
    breadcrumbs.push({ label: 'Configurações', path: '/configuracoes' });
  } else if (currentPath.startsWith('/perfil')) {
    breadcrumbs.push({ label: 'Perfil', path: '/perfil' });
  }
  
  return breadcrumbs;
};
