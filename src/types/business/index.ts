/**
 * Tipos de Negócio
 * 
 * Esta pasta contém todos os tipos relacionados à lógica de negócio,
 * regras, validações e operações específicas do domínio da farmácia.
 */

export interface BusinessRule {
  id: string;
  name: string;
  description: string;
  category: BusinessRuleCategory;
  condition: string;
  action: string;
  priority: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export type BusinessRuleCategory = 
  | 'pricing'        // Preços
  | 'inventory'      // Estoque
  | 'orders'         // Pedidos
  | 'delivery'       // Entrega
  | 'payment'        // Pagamento
  | 'customer'       // Cliente
  | 'product'        // Produto
  | 'promotion'      // Promoção
  | 'notification'   // Notificação
  | 'security';      // Segurança

export interface ValidationRule {
  field: string;
  type: ValidationType;
  required: boolean;
  minLength?: number;
  maxLength?: number;
  min?: number;
  max?: number;
  pattern?: string;
  customValidator?: string;
  message: string;
}

export type ValidationType = 
  | 'string'
  | 'number'
  | 'email'
  | 'phone'
  | 'cpf'
  | 'cnpj'
  | 'cep'
  | 'date'
  | 'url'
  | 'custom';

export interface ValidationResult {
  isValid: boolean;
  errors: ValidationError[];
  warnings?: ValidationWarning[];
}

export interface ValidationError {
  field: string;
  message: string;
  code: string;
  value?: any;
}

export interface ValidationWarning {
  field: string;
  message: string;
  code: string;
  value?: any;
}

export interface BusinessProcess {
  id: string;
  name: string;
  description: string;
  steps: ProcessStep[];
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface ProcessStep {
  id: string;
  name: string;
  description: string;
  type: ProcessStepType;
  order: number;
  isRequired: boolean;
  conditions?: string[];
  actions?: string[];
}

export type ProcessStepType = 
  | 'validation'     // Validação
  | 'calculation'    // Cálculo
  | 'notification'   // Notificação
  | 'approval'       // Aprovação
  | 'integration'    // Integração
  | 'storage'        // Armazenamento
  | 'custom';        // Personalizado

export interface BusinessMetric {
  id: string;
  name: string;
  description: string;
  category: MetricCategory;
  value: number;
  unit: string;
  target?: number;
  period: MetricPeriod;
  calculatedAt: string;
}

export type MetricCategory = 
  | 'sales'          // Vendas
  | 'inventory'      // Estoque
  | 'customer'       // Cliente
  | 'financial'      // Financeiro
  | 'operational'    // Operacional
  | 'quality'        // Qualidade
  | 'performance';   // Performance

export type MetricPeriod = 
  | 'daily'          // Diário
  | 'weekly'         // Semanal
  | 'monthly'        // Mensal
  | 'quarterly'      // Trimestral
  | 'yearly';        // Anual

export interface BusinessEvent {
  id: string;
  type: BusinessEventType;
  entityType: string;
  entityId: string;
  data: Record<string, any>;
  userId?: string;
  timestamp: string;
  metadata?: Record<string, any>;
}

export type BusinessEventType = 
  | 'created'        // Criado
  | 'updated'        // Atualizado
  | 'deleted'        // Deletado
  | 'status_changed' // Status alterado
  | 'approved'       // Aprovado
  | 'rejected'       // Rejeitado
  | 'completed'      // Concluído
  | 'cancelled'      // Cancelado
  | 'custom';        // Personalizado

export interface BusinessConfiguration {
  id: string;
  key: string;
  value: any;
  type: ConfigurationType;
  category: string;
  description?: string;
  isEditable: boolean;
  isSystem: boolean;
  updatedAt: string;
  updatedBy: string;
}

export type ConfigurationType = 
  | 'string'
  | 'number'
  | 'boolean'
  | 'json'
  | 'array'
  | 'object';

export interface BusinessReport {
  id: string;
  name: string;
  description: string;
  type: ReportType;
  parameters: ReportParameter[];
  query: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  createdBy: string;
}

export type ReportType = 
  | 'sales'          // Vendas
  | 'inventory'      // Estoque
  | 'customer'       // Cliente
  | 'financial'      // Financeiro
  | 'operational'    // Operacional
  | 'custom';        // Personalizado

export interface ReportParameter {
  name: string;
  type: 'string' | 'number' | 'date' | 'boolean' | 'select';
  required: boolean;
  defaultValue?: any;
  options?: string[];
  description?: string;
}

export interface BusinessWorkflow {
  id: string;
  name: string;
  description: string;
  trigger: WorkflowTrigger;
  conditions: WorkflowCondition[];
  actions: WorkflowAction[];
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface WorkflowTrigger {
  type: 'event' | 'schedule' | 'manual';
  event?: string;
  schedule?: string;
  conditions?: string[];
}

export interface WorkflowCondition {
  field: string;
  operator: 'equals' | 'not_equals' | 'greater_than' | 'less_than' | 'contains' | 'not_contains';
  value: any;
}

export interface WorkflowAction {
  type: 'notification' | 'email' | 'webhook' | 'update' | 'create' | 'delete';
  config: Record<string, any>;
}


















