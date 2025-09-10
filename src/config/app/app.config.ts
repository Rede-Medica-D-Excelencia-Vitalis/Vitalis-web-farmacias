/**
 * Configurações principais da aplicação
 * Contém informações básicas sobre o app, versão, nome, etc.
 */

export const appConfig = {
  // Informações básicas da aplicação
  name: 'Vitalis - Gestor de Pedidos',
  version: '1.0.0',
  description: 'Sistema de gestão de pedidos para farmácias',
  
  // Configurações de desenvolvimento
  debug: import.meta.env.DEV,
  environment: import.meta.env.MODE,
  
  // Configurações de build
  buildTime: import.meta.env.VITE_BUILD_TIME || new Date().toISOString(),
  commitHash: import.meta.env.VITE_COMMIT_HASH || 'unknown',
  
  // Configurações de features
  features: {
    notifications: true,
    realTimeUpdates: true,
    offlineMode: false,
    analytics: true,
  },
  
  // Configurações de UI/UX
  ui: {
    theme: 'light', // 'light' | 'dark' | 'auto'
    language: 'pt-BR',
    timezone: 'America/Sao_Paulo',
    dateFormat: 'dd/MM/yyyy',
    timeFormat: 'HH:mm',
  },
  
  // Configurações de performance
  performance: {
    enableLazyLoading: true,
    enableCodeSplitting: true,
    enableServiceWorker: true,
    cacheTimeout: 5 * 60 * 1000, // 5 minutos
  },
};

/**
 * Função para obter configuração da aplicação
 * @returns Configuração da aplicação
 */
export function getAppConfig() {
  return appConfig;
}

/**
 * Função para verificar se uma feature está habilitada
 * @param feature - Nome da feature
 * @returns true se a feature estiver habilitada
 */
export function isFeatureEnabled(feature: keyof typeof appConfig.features): boolean {
  return appConfig.features[feature] || false;
}

/**
 * Função para obter configuração de UI
 * @returns Configuração de UI
 */
export function getUIConfig() {
  return appConfig.ui;
}

/**
 * Função para obter configuração de performance
 * @returns Configuração de performance
 */
export function getPerformanceConfig() {
  return appConfig.performance;
}
