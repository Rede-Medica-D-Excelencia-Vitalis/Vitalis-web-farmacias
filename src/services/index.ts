/**
 * Serviços da Aplicação - Vitalis Gestor de Pedidos
 * 
 * Esta pasta contém todos os serviços organizados por categoria e funcionalidade.
 * Cada serviço é responsável por uma área específica da aplicação.
 * 
 * Estrutura:
 * - api/          - Serviços de comunicação com APIs
 * - business/     - Serviços de lógica de negócio
 * - integration/  - Serviços de integração com sistemas externos
 * - notifications/ - Serviços de notificações
 * - utils/        - Serviços utilitários
 */

// ===== SERVIÇOS DE API =====
export * from './api';

// ===== SERVIÇOS DE NEGÓCIO =====
export * from './business';

// ===== SERVIÇOS DE INTEGRAÇÃO =====
export * from './integration';

// ===== SERVIÇOS DE NOTIFICAÇÕES =====
export * from './notifications';

// ===== SERVIÇOS UTILITÁRIOS =====
export * from './utils';

// ===== EXPORTAÇÕES PRINCIPAIS =====

// Serviços de API
export { authService } from './api/authService';
export { orderService } from './api/orderService';

// Serviços de Negócio
export { validationService } from './business/validationService';

// Serviços de Notificações
export { notificationService } from './notifications/notificationService';

// Serviços Utilitários
export { formattingService } from './utils/formattingService';

