/**
 * Constantes da aplicação
 * Contém valores fixos, enums, status codes, etc.
 */

// Status de pedidos
export const ORDER_STATUS = {
  PENDING: 'pending',
  ACCEPTED: 'accepted',
  REJECTED: 'rejected',
  WITH_DELIVERY: 'with_delivery',
  DELIVERED: 'delivered',
  CANCELLED: 'cancelled',
} as const;

export type OrderStatus = typeof ORDER_STATUS[keyof typeof ORDER_STATUS];

// Status de pacientes
export const PATIENT_STATUS = {
  ACTIVE: 'active',
  INACTIVE: 'inactive',
  SUSPENDED: 'suspended',
} as const;

export type PatientStatus = typeof PATIENT_STATUS[keyof typeof PATIENT_STATUS];

// Status de produtos
export const PRODUCT_STATUS = {
  AVAILABLE: 'available',
  OUT_OF_STOCK: 'out_of_stock',
  DISCONTINUED: 'discontinued',
} as const;

export type ProductStatus = typeof PRODUCT_STATUS[keyof typeof PRODUCT_STATUS];

// Tipos de notificação
export const NOTIFICATION_TYPES = {
  ORDER: 'order',
  PATIENT: 'patient',
  PRODUCT: 'product',
  SYSTEM: 'system',
  ALERT: 'alert',
} as const;

export type NotificationType = typeof NOTIFICATION_TYPES[keyof typeof NOTIFICATION_TYPES];

// Prioridades de notificação
export const NOTIFICATION_PRIORITIES = {
  LOW: 'low',
  MEDIUM: 'medium',
  HIGH: 'high',
  URGENT: 'urgent',
} as const;

export type NotificationPriority = typeof NOTIFICATION_PRIORITIES[keyof typeof NOTIFICATION_PRIORITIES];

// Categorias de produtos
export const PRODUCT_CATEGORIES = {
  MEDICINE: 'medicine',
  COSMETIC: 'cosmetic',
  PERSONAL_CARE: 'personal_care',
  SUPPLEMENT: 'supplement',
  MEDICAL_DEVICE: 'medical_device',
  OTHER: 'other',
} as const;

export type ProductCategory = typeof PRODUCT_CATEGORIES[keyof typeof PRODUCT_CATEGORIES];

// Status codes HTTP
export const HTTP_STATUS = {
  OK: 200,
  CREATED: 201,
  NO_CONTENT: 204,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  CONFLICT: 409,
  UNPROCESSABLE_ENTITY: 422,
  INTERNAL_SERVER_ERROR: 500,
  SERVICE_UNAVAILABLE: 503,
} as const;

// Limites e configurações
export const LIMITS = {
  // Paginação
  DEFAULT_PAGE_SIZE: 20,
  MAX_PAGE_SIZE: 100,
  
  // Uploads
  MAX_FILE_SIZE: 5 * 1024 * 1024, // 5MB
  ALLOWED_IMAGE_TYPES: ['image/jpeg', 'image/png', 'image/webp'],
  ALLOWED_DOCUMENT_TYPES: ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'],
  
  // Validação
  MIN_PASSWORD_LENGTH: 8,
  MAX_NAME_LENGTH: 100,
  MAX_DESCRIPTION_LENGTH: 500,
  
  // Cache
  CACHE_TTL: 5 * 60 * 1000, // 5 minutos
  MAX_CACHE_SIZE: 100,
  
  // Rate limiting
  MAX_REQUESTS_PER_MINUTE: 60,
  MAX_REQUESTS_PER_HOUR: 1000,
} as const;

// Configurações de validação
export const VALIDATION = {
  // Regex patterns
  EMAIL_PATTERN: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  CPF_PATTERN: /^\d{3}\.\d{3}\.\d{3}-\d{2}$/,
  PHONE_PATTERN: /^\(\d{2}\) \d{4,5}-\d{4}$/,
  CEP_PATTERN: /^\d{5}-\d{3}$/,
  
  // Mensagens de erro
  MESSAGES: {
    REQUIRED: 'Este campo é obrigatório',
    INVALID_EMAIL: 'Email inválido',
    INVALID_CPF: 'CPF inválido',
    INVALID_PHONE: 'Telefone inválido',
    INVALID_CEP: 'CEP inválido',
    MIN_LENGTH: (min: number) => `Mínimo de ${min} caracteres`,
    MAX_LENGTH: (max: number) => `Máximo de ${max} caracteres`,
    INVALID_FILE_TYPE: 'Tipo de arquivo não permitido',
    FILE_TOO_LARGE: 'Arquivo muito grande',
  },
} as const;

// Configurações de tema
export const THEME = {
  COLORS: {
    PRIMARY: '#2563eb',
    SECONDARY: '#64748b',
    SUCCESS: '#16a34a',
    WARNING: '#ca8a04',
    ERROR: '#dc2626',
    INFO: '#0891b2',
  },
  
  BREAKPOINTS: {
    SM: '640px',
    MD: '768px',
    LG: '1024px',
    XL: '1280px',
    '2XL': '1536px',
  },
  
  SPACING: {
    XS: '0.25rem',
    SM: '0.5rem',
    MD: '1rem',
    LG: '1.5rem',
    XL: '2rem',
    '2XL': '3rem',
  },
} as const;

// Configurações de localização
export const LOCALE = {
  DEFAULT: 'pt-BR',
  SUPPORTED: ['pt-BR', 'en-US', 'es-ES'],
  
  DATE_FORMATS: {
    'pt-BR': {
      short: 'dd/MM/yyyy',
      long: 'dd/MM/yyyy HH:mm',
      time: 'HH:mm',
    },
    'en-US': {
      short: 'MM/dd/yyyy',
      long: 'MM/dd/yyyy h:mm a',
      time: 'h:mm a',
    },
  },
  
  CURRENCY: {
    'pt-BR': 'BRL',
    'en-US': 'USD',
    'es-ES': 'EUR',
  },
} as const;

// Configurações de storage
export const STORAGE_KEYS = {
  AUTH_TOKEN: 'vitalis_auth_token',
  REFRESH_TOKEN: 'vitalis_refresh_token',
  USER_DATA: 'vitalis_user_data',
  THEME: 'vitalis_theme',
  LANGUAGE: 'vitalis_language',
  SETTINGS: 'vitalis_settings',
  CACHE: 'vitalis_cache',
} as const;

// Configurações de eventos
export const EVENTS = {
  AUTH: {
    LOGIN: 'auth:login',
    LOGOUT: 'auth:logout',
    TOKEN_REFRESH: 'auth:token_refresh',
  },
  
  ORDERS: {
    CREATED: 'orders:created',
    UPDATED: 'orders:updated',
    STATUS_CHANGED: 'orders:status_changed',
  },
  
  NOTIFICATIONS: {
    NEW: 'notifications:new',
    READ: 'notifications:read',
  },
  
  WEBSOCKET: {
    CONNECTED: 'websocket:connected',
    DISCONNECTED: 'websocket:disconnected',
    MESSAGE: 'websocket:message',
  },
} as const;
