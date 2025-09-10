/**
 * Tipos Comuns
 * 
 * Esta pasta contém todos os tipos comuns e compartilhados
 * utilizados em toda a aplicação.
 */

export interface BaseEntity {
  id: string;
  createdAt: string;
  updatedAt: string;
  createdBy?: string;
  updatedBy?: string;
}

export interface SoftDeleteEntity extends BaseEntity {
  deletedAt?: string;
  deletedBy?: string;
  isDeleted: boolean;
}

export interface Timestamp {
  createdAt: string;
  updatedAt: string;
}

export interface UserInfo {
  id: string;
  name: string;
  email: string;
  avatar?: string;
}

export interface AuditLog extends BaseEntity {
  entityType: string;
  entityId: string;
  action: AuditAction;
  changes: Record<string, any>;
  userId: string;
  user: UserInfo;
  ipAddress?: string;
  userAgent?: string;
}

export type AuditAction = 
  | 'create'
  | 'update'
  | 'delete'
  | 'restore'
  | 'login'
  | 'logout'
  | 'export'
  | 'import';

export interface SystemInfo {
  version: string;
  build: string;
  environment: Environment;
  uptime: number;
  lastRestart: string;
  features: Record<string, boolean>;
}

export type Environment = 'development' | 'staging' | 'production' | 'test';

export interface FeatureFlag {
  name: string;
  enabled: boolean;
  description?: string;
  conditions?: Record<string, any>;
  createdAt: string;
  updatedAt: string;
}

export interface SystemSettings {
  id: string;
  key: string;
  value: any;
  type: SettingType;
  category: string;
  description?: string;
  isPublic: boolean;
  isEditable: boolean;
  updatedAt: string;
  updatedBy: string;
}

export type SettingType = 
  | 'string'
  | 'number'
  | 'boolean'
  | 'json'
  | 'array'
  | 'object'
  | 'file'
  | 'url';

export interface MenuItem {
  id: string;
  title: string;
  icon?: string;
  path?: string;
  children?: MenuItem[];
  permissions?: string[];
  isActive?: boolean;
  isVisible?: boolean;
  order?: number;
  badge?: MenuBadge;
}

export interface MenuBadge {
  text: string;
  type: 'primary' | 'secondary' | 'success' | 'warning' | 'error' | 'info';
  count?: number;
}

export interface BreadcrumbItem {
  title: string;
  path?: string;
  icon?: string;
}

export interface TabItem {
  key: string;
  label: string;
  icon?: string;
  disabled?: boolean;
  closable?: boolean;
  content: React.ReactNode;
}

export interface StepItem {
  title: string;
  description?: string;
  icon?: string;
  status: StepStatus;
  disabled?: boolean;
}

export type StepStatus = 'wait' | 'process' | 'finish' | 'error';

export interface StatusConfig {
  label: string;
  color: string;
  icon?: string;
  description?: string;
}

export interface StatusMap {
  [key: string]: StatusConfig;
}

export interface FilterOption {
  label: string;
  value: any;
  count?: number;
  disabled?: boolean;
}

export interface SortOption {
  key: string;
  label: string;
  direction: 'asc' | 'desc';
}

export interface ExportConfig {
  format: ExportFormat;
  filename?: string;
  includeHeaders?: boolean;
  dateRange?: DateRange;
  filters?: Record<string, any>;
  columns?: string[];
}

export type ExportFormat = 'csv' | 'xlsx' | 'pdf' | 'json';

export interface ImportConfig {
  format: ImportFormat;
  validateData?: boolean;
  skipErrors?: boolean;
  updateExisting?: boolean;
  mapping?: Record<string, string>;
}

export type ImportFormat = 'csv' | 'xlsx' | 'json';

export interface ImportResult {
  total: number;
  success: number;
  errors: number;
  warnings: number;
  errorsList: ImportError[];
  warningsList: ImportWarning[];
}

export interface ImportError {
  row: number;
  field: string;
  message: string;
  value?: any;
}

export interface ImportWarning {
  row: number;
  field: string;
  message: string;
  value?: any;
}

export interface SearchResult<T = any> {
  items: T[];
  total: number;
  query: string;
  filters?: Record<string, any>;
  suggestions?: string[];
  took: number; // Time in milliseconds
}

export interface SearchSuggestion {
  text: string;
  type: 'recent' | 'popular' | 'suggestion';
  count?: number;
}

export interface KeyboardShortcut {
  key: string;
  ctrlKey?: boolean;
  shiftKey?: boolean;
  altKey?: boolean;
  metaKey?: boolean;
  action: () => void;
  description?: string;
  global?: boolean;
}

export interface ContextMenuItem {
  key: string;
  label: string;
  icon?: string;
  disabled?: boolean;
  danger?: boolean;
  onClick: () => void;
  children?: ContextMenuItem[];
}

export interface TooltipConfig {
  title: string;
  placement?: TooltipPlacement;
  trigger?: TooltipTrigger;
  delay?: number;
  arrow?: boolean;
}

export type TooltipPlacement = 
  | 'top'
  | 'topLeft'
  | 'topRight'
  | 'bottom'
  | 'bottomLeft'
  | 'bottomRight'
  | 'left'
  | 'leftTop'
  | 'leftBottom'
  | 'right'
  | 'rightTop'
  | 'rightBottom';

export type TooltipTrigger = 'hover' | 'focus' | 'click' | 'contextMenu';

export interface AnimationConfig {
  duration: number;
  easing: string;
  delay?: number;
  fill?: 'forwards' | 'backwards' | 'both' | 'none';
}

export interface ResponsiveConfig {
  xs?: number;
  sm?: number;
  md?: number;
  lg?: number;
  xl?: number;
  xxl?: number;
}

export interface BreakpointConfig {
  xs: number;
  sm: number;
  md: number;
  lg: number;
  xl: number;
  xxl: number;
}

export interface DeviceInfo {
  type: 'mobile' | 'tablet' | 'desktop';
  os: string;
  browser: string;
  version: string;
  screen: {
    width: number;
    height: number;
  };
  viewport: {
    width: number;
    height: number;
  };
}

export interface PerformanceMetrics {
  loadTime: number;
  renderTime: number;
  memoryUsage: number;
  networkLatency: number;
  timestamp: number;
}

export interface ErrorBoundaryState {
  hasError: boolean;
  error?: Error;
  errorInfo?: React.ErrorInfo;
}

export interface ErrorBoundaryProps {
  children: React.ReactNode;
  fallback?: React.ComponentType<ErrorBoundaryState>;
  onError?: (error: Error, errorInfo: React.ErrorInfo) => void;
}














