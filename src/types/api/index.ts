/**
 * Tipos de API
 * 
 * Esta pasta contém todos os tipos relacionados às APIs,
 * requisições, respostas e configurações de comunicação.
 */

export interface ApiResponse<T = any> {
  success: boolean;
  data: T;
  message?: string;
  errors?: string[];
  meta?: ApiMeta;
}

export interface ApiMeta {
  page?: number;
  limit?: number;
  total?: number;
  totalPages?: number;
  hasNextPage?: boolean;
  hasPrevPage?: boolean;
}

export interface ApiError {
  code: string;
  message: string;
  details?: Record<string, any>;
  field?: string;
}

export interface ApiErrorResponse {
  success: false;
  error: ApiError;
  errors?: ApiError[];
  message: string;
}

export interface PaginationParams {
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

export interface SearchParams {
  search?: string;
  filters?: Record<string, any>;
}

export interface ApiRequestConfig {
  timeout?: number;
  retries?: number;
  retryDelay?: number;
  headers?: Record<string, string>;
}

export interface ApiEndpoint {
  method: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';
  path: string;
  requiresAuth?: boolean;
  permissions?: string[];
}

export interface ApiConfig {
  baseURL: string;
  timeout: number;
  retries: number;
  retryDelay: number;
  headers: Record<string, string>;
  endpoints: Record<string, ApiEndpoint>;
}

export interface UploadResponse {
  id: string;
  filename: string;
  originalName: string;
  mimeType: string;
  size: number;
  url: string;
  uploadedAt: string;
}

export interface UploadProgress {
  loaded: number;
  total: number;
  percentage: number;
}

export interface ApiCacheConfig {
  enabled: boolean;
  ttl: number; // Time to live in seconds
  maxSize: number;
  strategy: 'memory' | 'localStorage' | 'sessionStorage';
}

export interface ApiMetrics {
  requestCount: number;
  successCount: number;
  errorCount: number;
  averageResponseTime: number;
  lastRequestAt?: string;
}

export interface ApiHealthCheck {
  status: 'healthy' | 'degraded' | 'unhealthy';
  timestamp: string;
  responseTime: number;
  version: string;
  dependencies: Record<string, DependencyHealth>;
}

export interface DependencyHealth {
  status: 'healthy' | 'degraded' | 'unhealthy';
  responseTime?: number;
  lastCheck: string;
  error?: string;
}

export interface WebSocketMessage<T = any> {
  type: string;
  data: T;
  timestamp: string;
  id?: string;
}

export interface WebSocketConfig {
  url: string;
  protocols?: string[];
  reconnectInterval?: number;
  maxReconnectAttempts?: number;
  heartbeatInterval?: number;
}

export interface ApiInterceptor {
  request?: (config: any) => any | Promise<any>;
  response?: (response: any) => any | Promise<any>;
  error?: (error: any) => any | Promise<any>;
}































