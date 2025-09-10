// Configurações de ambiente
export const config = {
  API_URL: import.meta.env.VITE_API_URL || 'http://localhost:3001/api',
  APP_NAME: 'Vitalis - Gestor de Pedidos',
  VERSION: '1.0.0',
};

// Função para obter configuração com fallback
export function getConfig() {
  return {
    API_URL: import.meta.env.VITE_API_URL || 'http://localhost:3001/api',
    APP_NAME: 'Vitalis - Gestor de Pedidos',
    VERSION: '1.0.0',
  };
} 