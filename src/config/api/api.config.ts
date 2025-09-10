/**
 * Configurações da API
 * Contém endpoints, timeouts, headers padrão, etc.
 */

export const apiConfig = {
  // URL base da API
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:3001/api',
  
  // Timeouts
  timeout: {
    request: 30000, // 30 segundos
    upload: 60000,  // 1 minuto
    download: 120000, // 2 minutos
  },
  
  // Headers padrão
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
    'X-Requested-With': 'XMLHttpRequest',
  },
  
  // Endpoints principais
  endpoints: {
    // Autenticação
    auth: {
      login: '/auth/login',
      logout: '/auth/logout',
      refresh: '/auth/refresh',
      profile: '/auth/profile',
    },
    
    // Pedidos
    orders: {
      list: '/orders',
      create: '/orders',
      update: '/orders/:id',
      delete: '/orders/:id',
      status: '/orders/:id/status',
      track: '/orders/:id/track',
    },
    
    // Pacientes
    patients: {
      list: '/patients',
      create: '/patients',
      update: '/patients/:id',
      delete: '/patients/:id',
      status: '/patients/:id/status',
    },
    
    // Produtos
    products: {
      list: '/products',
      create: '/products',
      update: '/products/:id',
      delete: '/products/:id',
      categories: '/products/categories',
      stock: '/products/:id/stock',
    },
    
    // Notificações
    notifications: {
      list: '/notifications',
      markRead: '/notifications/:id/read',
      markAllRead: '/notifications/read-all',
      settings: '/notifications/settings',
    },
    
    // Configurações
    settings: {
      store: '/settings/store',
      pharmacy: '/settings/pharmacy',
      user: '/settings/user',
    },
    
    // Dashboard
    dashboard: {
      stats: '/dashboard/stats',
      charts: '/dashboard/charts',
      recent: '/dashboard/recent',
    },
    
    // Uploads
    uploads: {
      images: '/uploads/images',
      documents: '/uploads/documents',
    },
  },
  
  // Configurações de retry
  retry: {
    maxAttempts: 3,
    delay: 1000, // 1 segundo
    backoffMultiplier: 2,
  },
  
  // Configurações de cache
  cache: {
    enabled: true,
    ttl: 5 * 60 * 1000, // 5 minutos
    maxSize: 100, // máximo de 100 itens em cache
  },
  
  // Configurações de interceptors
  interceptors: {
    request: true,
    response: true,
    error: true,
  },
};

/**
 * Função para obter configuração da API
 * @returns Configuração da API
 */
export function getApiConfig() {
  return apiConfig;
}

/**
 * Função para obter URL completa de um endpoint
 * @param endpoint - Endpoint relativo
 * @returns URL completa
 */
export function getApiUrl(endpoint: string): string {
  return `${apiConfig.baseURL}${endpoint}`;
}

/**
 * Função para obter endpoint com parâmetros substituídos
 * @param endpoint - Endpoint com placeholders
 * @param params - Parâmetros para substituição
 * @returns Endpoint com parâmetros substituídos
 */
export function getEndpoint(endpoint: string, params: Record<string, string | number> = {}): string {
  let result = endpoint;
  
  Object.entries(params).forEach(([key, value]) => {
    result = result.replace(`:${key}`, String(value));
  });
  
  return result;
}

/**
 * Função para obter headers padrão
 * @returns Headers padrão
 */
export function getDefaultHeaders(): Record<string, string> {
  return { ...apiConfig.headers };
}

/**
 * Função para obter timeout baseado no tipo de requisição
 * @param type - Tipo de requisição
 * @returns Timeout em milissegundos
 */
export function getTimeout(type: 'request' | 'upload' | 'download' = 'request'): number {
  return apiConfig.timeout[type];
}
