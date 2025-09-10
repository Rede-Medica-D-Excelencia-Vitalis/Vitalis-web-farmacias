// Configurações de ambiente local
// Este arquivo pode ser usado para sobrescrever configurações padrão
export const localConfig = {
  API_URL: 'http://localhost:3001/api',
  APP_NAME: 'Vitalis - Gestor de Pedidos (Local)',
  VERSION: '1.0.0',
  DEBUG: true,
};

// Função para obter configuração baseada no ambiente
export function getConfig() {
  // Em desenvolvimento, usar configuração local
  if (import.meta.env.DEV) {
    return {
      ...localConfig,
      API_URL: import.meta.env.VITE_API_URL || localConfig.API_URL,
    };
  }
  
  // Em produção, usar variáveis de ambiente
  return {
    API_URL: import.meta.env.VITE_API_URL || 'http://localhost:3001/api',
    APP_NAME: 'Vitalis - Gestor de Pedidos',
    VERSION: '1.0.0',
    DEBUG: false,
  };
}
