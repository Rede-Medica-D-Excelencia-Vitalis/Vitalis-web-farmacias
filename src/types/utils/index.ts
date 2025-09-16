/**
 * Tipos Utilitários
 * 
 * Esta pasta contém todos os tipos utilitários e auxiliares
 * utilizados em toda a aplicação.
 */

export interface SelectOption<T = any> {
  label: string;
  value: T;
  disabled?: boolean;
  icon?: string;
  description?: string;
}

export interface TableColumn<T = any> {
  key: keyof T | string;
  title: string;
  sortable?: boolean;
  filterable?: boolean;
  width?: number | string;
  align?: 'left' | 'center' | 'right';
  render?: (value: any, record: T, index: number) => React.ReactNode;
}

export interface TableConfig<T = any> {
  columns: TableColumn<T>[];
  pagination?: PaginationConfig;
  sorting?: SortingConfig;
  filtering?: FilteringConfig;
  selection?: SelectionConfig;
}

export interface PaginationConfig {
  pageSize: number;
  showSizeChanger?: boolean;
  showQuickJumper?: boolean;
  showTotal?: boolean;
  pageSizeOptions?: number[];
}

export interface SortingConfig {
  defaultSortKey?: string;
  defaultSortOrder?: 'asc' | 'desc';
  multiple?: boolean;
}

export interface FilteringConfig {
  enabled: boolean;
  placeholder?: string;
  debounceMs?: number;
}

export interface SelectionConfig {
  enabled: boolean;
  type: 'single' | 'multiple';
  selectedRowKeys?: string[];
  onChange?: (selectedRowKeys: string[], selectedRows: T[]) => void;
}

export interface FormField<T = any> {
  name: keyof T | string;
  label: string;
  type: FormFieldType;
  required?: boolean;
  disabled?: boolean;
  placeholder?: string;
  options?: SelectOption[];
  validation?: FieldValidation;
  dependencies?: string[];
  render?: (value: any, onChange: (value: any) => void) => React.ReactNode;
}

export type FormFieldType = 
  | 'text'
  | 'email'
  | 'password'
  | 'number'
  | 'tel'
  | 'url'
  | 'date'
  | 'time'
  | 'datetime'
  | 'textarea'
  | 'select'
  | 'multiselect'
  | 'checkbox'
  | 'radio'
  | 'switch'
  | 'file'
  | 'image'
  | 'custom';

export interface FieldValidation {
  required?: boolean;
  minLength?: number;
  maxLength?: number;
  min?: number;
  max?: number;
  pattern?: RegExp;
  custom?: (value: any) => string | null;
}

export interface FormConfig<T = any> {
  fields: FormField<T>[];
  layout?: FormLayout;
  submitButton?: ButtonConfig;
  resetButton?: ButtonConfig;
  validation?: FormValidation;
}

export interface FormLayout {
  type: 'vertical' | 'horizontal' | 'inline';
  columns?: number;
  gutter?: number;
  labelCol?: number;
  wrapperCol?: number;
}

export interface ButtonConfig {
  text: string;
  type?: 'primary' | 'secondary' | 'danger' | 'success' | 'warning';
  size?: 'small' | 'medium' | 'large';
  disabled?: boolean;
  loading?: boolean;
  icon?: string;
}

export interface FormValidation {
  mode: 'onChange' | 'onBlur' | 'onSubmit';
  revalidateMode: 'onChange' | 'onBlur' | 'onSubmit';
}

export interface ModalConfig {
  title: string;
  content: React.ReactNode;
  width?: number | string;
  height?: number | string;
  closable?: boolean;
  maskClosable?: boolean;
  centered?: boolean;
  footer?: React.ReactNode;
  onOk?: () => void | Promise<void>;
  onCancel?: () => void;
}

export interface ToastConfig {
  type: 'success' | 'error' | 'warning' | 'info';
  title: string;
  message?: string;
  duration?: number;
  position?: ToastPosition;
  action?: ToastAction;
}

export type ToastPosition = 
  | 'top-left'
  | 'top-center'
  | 'top-right'
  | 'bottom-left'
  | 'bottom-center'
  | 'bottom-right';

export interface ToastAction {
  label: string;
  onClick: () => void;
}

export interface LoadingState {
  isLoading: boolean;
  message?: string;
  progress?: number;
}

export interface ErrorState {
  hasError: boolean;
  message?: string;
  code?: string;
  details?: Record<string, any>;
}

export interface AsyncState<T = any> {
  data: T | null;
  loading: boolean;
  error: Error | null;
  lastUpdated?: number;
}

export interface CacheConfig {
  key: string;
  ttl: number; // Time to live in milliseconds
  maxSize?: number;
  strategy: 'memory' | 'localStorage' | 'sessionStorage' | 'indexedDB';
}

export interface CacheEntry<T = any> {
  key: string;
  value: T;
  timestamp: number;
  ttl: number;
  hits: number;
}

export interface StorageConfig {
  type: 'localStorage' | 'sessionStorage' | 'indexedDB' | 'memory';
  prefix?: string;
  encryption?: boolean;
  compression?: boolean;
}

export interface DateRange {
  start: Date | string;
  end: Date | string;
}

export interface TimeRange {
  start: string; // HH:mm format
  end: string;   // HH:mm format
}

export interface Coordinate {
  latitude: number;
  longitude: number;
}

export interface Address {
  street: string;
  number: string;
  complement?: string;
  neighborhood: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
  coordinates?: Coordinate;
}

export interface Contact {
  name: string;
  email?: string;
  phone?: string;
  role?: string;
}

export interface FileInfo {
  name: string;
  size: number;
  type: string;
  lastModified: number;
  url?: string;
}

export interface UploadConfig {
  accept?: string;
  multiple?: boolean;
  maxSize?: number;
  maxFiles?: number;
  onProgress?: (progress: number) => void;
  onSuccess?: (file: FileInfo) => void;
  onError?: (error: Error) => void;
}

export interface ThemeConfig {
  name: string;
  colors: {
    primary: string;
    secondary: string;
    success: string;
    warning: string;
    error: string;
    info: string;
    background: string;
    surface: string;
    text: string;
    textSecondary: string;
  };
  fonts: {
    primary: string;
    secondary: string;
    sizes: {
      small: string;
      medium: string;
      large: string;
      xlarge: string;
    };
  };
  spacing: {
    xs: string;
    sm: string;
    md: string;
    lg: string;
    xl: string;
  };
  borderRadius: {
    small: string;
    medium: string;
    large: string;
  };
}


















