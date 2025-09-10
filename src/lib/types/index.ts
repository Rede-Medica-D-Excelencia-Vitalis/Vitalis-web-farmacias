/**
 * Tipos TypeScript compartilhados para toda a aplicação
 * 
 * Este arquivo contém interfaces e tipos que são utilizados
 * em múltiplos componentes e serviços da aplicação.
 */

// Tipos de usuário
export type { User, PharmacyUser } from './index';

// Tipos de pedidos
export type { 
  Order, 
  OrderStatus, 
  PaymentMethod, 
  OrderItem 
} from './index';

// Tipos de produtos
export type { Product, ProductCategory } from './index';

// Tipos de pacientes
export type { 
  Patient, 
  Address, 
  EmergencyContact, 
  MedicalHistory, 
  Location 
} from './index';

// Tipos de motoboys
export type { 
  Motoboy, 
  MotoboyLocation, 
  Vehicle, 
  Availability 
} from './index';

// Tipos de entregas
export type { Delivery, DeliveryStatus } from './index';

// Tipos de notificações
export type { Notification, NotificationType } from './index';

// Tipos de configurações
export type { 
  AppSettings, 
  PharmacySettings, 
  UserSettings, 
  SystemSettings 
} from './index';

// Tipos de respostas de API
export type { 
  ApiResponse, 
  PaginatedResponse, 
  LoginResponse 
} from './index';

// Tipos de filtros e busca
export type { 
  OrderFilters, 
  ProductFilters, 
  PatientFilters 
} from './index';

// Tipos de estatísticas e relatórios
export type { 
  DashboardStats, 
  ChartData, 
  SalesReport 
} from './index';
