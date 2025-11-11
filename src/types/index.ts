/**
 * Tipos da Aplicação - Vitalis Gestor de Pedidos
 * 
 * Esta pasta contém todos os tipos TypeScript organizados por categoria e funcionalidade.
 * Cada categoria é responsável por um domínio específico da aplicação.
 * 
 * Estrutura:
 * - auth/          - Tipos de autenticação e usuários
 * - orders/        - Tipos de pedidos e operações
 * - products/      - Tipos de produtos e categorias
 * - patients/      - Tipos de pacientes e informações
 * - notifications/ - Tipos de notificações e alertas
 * - api/           - Tipos de API e comunicação
 * - business/      - Tipos de lógica de negócio
 * - utils/         - Tipos utilitários e auxiliares
 * - common/        - Tipos comuns e compartilhados
 */

// ===== TIPOS DE AUTENTICAÇÃO =====
export * from './auth';

// ===== TIPOS DE PEDIDOS =====
export * from './orders';

// ===== TIPOS DE PRODUTOS =====
export * from './products';

// ===== TIPOS DE PACIENTES =====
export * from './patients';

// ===== TIPOS DE NOTIFICAÇÕES =====
export * from './notifications';

// ===== TIPOS DE API =====
export * from './api';

// ===== TIPOS DE NEGÓCIO =====
export * from './business';

// ===== TIPOS UTILITÁRIOS =====
export * from './utils';

// ===== TIPOS COMUNS =====
export * from './common';

// ===== EXPORTAÇÕES PRINCIPAIS =====

// Tipos de Autenticação
export type {
  User,
  UserRole,
  LoginRequest,
  LoginResponse,
  AuthState
} from './auth';

// Tipos de Pedidos
export type {
  Order,
  OrderItem,
  OrderStatus,
  PaymentStatus,
  PaymentMethod,
  OrderCreateRequest,
  OrderUpdateRequest,
  OrderFilters,
  OrderListResponse,
  OrderStats
} from './orders';

// Tipos de Produtos
export type {
  Product,
  ProductCategory,
  ProductCreateRequest,
  ProductUpdateRequest,
  ProductFilters,
  ProductListResponse,
  ProductStats
} from './products';

// Tipos de Pacientes
export type {
  Patient,
  Gender,
  PatientCreateRequest,
  PatientUpdateRequest,
  PatientFilters,
  PatientListResponse,
  PatientStats
} from './patients';

// Tipos de Notificações
export type {
  Notification,
  NotificationType,
  NotificationPriority,
  NotificationCategory,
  NotificationCreateRequest,
  NotificationListResponse,
  NotificationSettings
} from './notifications';

// Tipos de API
export type {
  ApiResponse,
  ApiError,
  ApiErrorResponse,
  PaginationParams,
  SearchParams
} from './api';

// Tipos de Negócio
export type {
  BusinessRule,
  BusinessRuleCategory,
  ValidationRule,
  ValidationResult,
  BusinessProcess,
  BusinessMetric
} from './business';

// Tipos Utilitários
export type {
  SelectOption,
  TableColumn,
  TableConfig,
  FormField,
  FormConfig,
  ModalConfig,
  ToastConfig,
  LoadingState,
  ErrorState
} from './utils';

// Tipos Comuns
export type {
  BaseEntity,
  SoftDeleteEntity,
  Timestamp,
  UserInfo,
  AuditLog,
  SystemInfo,
  FeatureFlag,
  SystemSettings,
  MenuItem,
  BreadcrumbItem
} from './common';

// ===== TIPOS LEGADOS (para compatibilidade) =====
// Estes tipos são mantidos para compatibilidade com o código existente
// e serão gradualmente migrados para a nova estrutura

export interface Customer {
  id: string;
  name: string;
  email: string;
  phone: string;
  address: string;
}

export interface Review {
  id: string;
  customer: Customer;
  rating: number;
  comment: string;
  date: string;
  orderNumber: string;
}

export interface ChartData {
  labels: string[];
  datasets: {
    label: string;
    data: number[];
    backgroundColor: string[];
    borderColor: string[];
    borderWidth: number;
  }[];
}

export interface StoreInfo {
  name: string;
  address: string;
  phone: string;
  email: string;
  openingHours: {
    open: string;
    close: string;
  };
  isOpen: boolean;
  logo: string;
}



