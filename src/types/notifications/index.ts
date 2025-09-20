/**
 * Tipos de Notificações
 * 
 * Esta pasta contém todos os tipos relacionados ao sistema de notificações,
 * alertas, configurações e histórico de notificações.
 */

export interface Notification {
  id: string;
  title: string;
  message: string;
  type: NotificationType;
  priority: NotificationPriority;
  category: NotificationCategory;
  isRead: boolean;
  isArchived: boolean;
  data?: Record<string, any>;
  actionUrl?: string;
  actionLabel?: string;
  expiresAt?: string;
  createdAt: string;
  readAt?: string;
  archivedAt?: string;
}

export type NotificationType = 
  | 'success'    // Sucesso
  | 'error'      // Erro
  | 'warning'    // Aviso
  | 'info'       // Informação
  | 'system';    // Sistema

export type NotificationPriority = 
  | 'low'        // Baixa
  | 'normal'     // Normal
  | 'high'       // Alta
  | 'urgent';    // Urgente

export type NotificationCategory = 
  | 'order'           // Pedido
  | 'payment'         // Pagamento
  | 'delivery'        // Entrega
  | 'stock'           // Estoque
  | 'patient'         // Paciente
  | 'product'         // Produto
  | 'system'          // Sistema
  | 'security'        // Segurança
  | 'maintenance'     // Manutenção
  | 'promotion';      // Promoção

export interface NotificationCreateRequest {
  title: string;
  message: string;
  type: NotificationType;
  priority?: NotificationPriority;
  category: NotificationCategory;
  data?: Record<string, any>;
  actionUrl?: string;
  actionLabel?: string;
  expiresAt?: string;
}

export interface NotificationUpdateRequest {
  isRead?: boolean;
  isArchived?: boolean;
}

export interface NotificationFilters {
  type?: NotificationType;
  priority?: NotificationPriority;
  category?: NotificationCategory;
  isRead?: boolean;
  isArchived?: boolean;
  dateFrom?: string;
  dateTo?: string;
  search?: string;
}

export interface NotificationListResponse {
  notifications: Notification[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
  unreadCount: number;
}

export interface NotificationSettings {
  id: string;
  userId: string;
  categories: NotificationCategorySettings[];
  soundEnabled: boolean;
  emailEnabled: boolean;
  pushEnabled: boolean;
  quietHours: QuietHours;
  createdAt: string;
  updatedAt: string;
}

export interface NotificationCategorySettings {
  category: NotificationCategory;
  enabled: boolean;
  soundEnabled: boolean;
  emailEnabled: boolean;
  pushEnabled: boolean;
}

export interface QuietHours {
  enabled: boolean;
  startTime: string; // HH:mm format
  endTime: string;   // HH:mm format
  timezone: string;
}

export interface NotificationStats {
  total: number;
  unread: number;
  read: number;
  archived: number;
  byType: Record<NotificationType, number>;
  byCategory: Record<NotificationCategory, number>;
  byPriority: Record<NotificationPriority, number>;
  todayCount: number;
  thisWeekCount: number;
  thisMonthCount: number;
}

export interface NotificationTemplate {
  id: string;
  name: string;
  title: string;
  message: string;
  type: NotificationType;
  category: NotificationCategory;
  variables: string[];
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface NotificationBatch {
  id: string;
  templateId: string;
  template: NotificationTemplate;
  recipients: string[];
  variables: Record<string, any>;
  status: BatchStatus;
  totalSent: number;
  totalFailed: number;
  createdAt: string;
  completedAt?: string;
}

export type BatchStatus = 
  | 'pending'    // Pendente
  | 'processing' // Processando
  | 'completed'  // Concluído
  | 'failed';    // Falhou































