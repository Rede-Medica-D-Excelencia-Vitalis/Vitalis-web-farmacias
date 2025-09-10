/**
 * Tipos de Pedidos
 * 
 * Esta pasta contém todos os tipos relacionados aos pedidos,
 * itens de pedido, status e operações de pedidos.
 */

export interface Order {
  id: string;
  orderNumber: string;
  patientId: string;
  patient: Patient;
  items: OrderItem[];
  total: number;
  subtotal: number;
  tax: number;
  discount?: number;
  status: OrderStatus;
  paymentStatus: PaymentStatus;
  paymentMethod: PaymentMethod;
  deliveryAddress: DeliveryAddress;
  deliveryDate?: string;
  deliveryTime?: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
  completedAt?: string;
  cancelledAt?: string;
  cancellationReason?: string;
  latitude?: number;
  longitude?: number;
  estimatedDeliveryTime?: number; // em minutos
}

export interface OrderItem {
  id: string;
  orderId: string;
  productId: string;
  product: Product;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
  notes?: string;
}

export type OrderStatus = 
  | 'pending'      // Pendente
  | 'confirmed'    // Confirmado
  | 'processing'   // Processando
  | 'ready'        // Pronto para entrega
  | 'out_for_delivery' // Saiu para entrega
  | 'delivered'    // Entregue
  | 'cancelled'    // Cancelado
  | 'returned';    // Devolvido

export type PaymentStatus = 
  | 'pending'      // Pendente
  | 'paid'         // Pago
  | 'failed'       // Falhou
  | 'refunded'     // Reembolsado
  | 'cancelled';   // Cancelado

export type PaymentMethod = 
  | 'cash'         // Dinheiro
  | 'credit_card'  // Cartão de crédito
  | 'debit_card'   // Cartão de débito
  | 'pix'          // PIX
  | 'bank_transfer' // Transferência bancária
  | 'voucher';     // Vale

export interface DeliveryAddress {
  street: string;
  number: string;
  complement?: string;
  neighborhood: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
  latitude?: number;
  longitude?: number;
  instructions?: string;
}

export interface OrderCreateRequest {
  patientId: string;
  items: OrderItemCreateRequest[];
  deliveryAddress: DeliveryAddress;
  deliveryDate?: string;
  deliveryTime?: string;
  paymentMethod: PaymentMethod;
  notes?: string;
}

export interface OrderItemCreateRequest {
  productId: string;
  quantity: number;
  notes?: string;
}

export interface OrderUpdateRequest {
  status?: OrderStatus;
  deliveryAddress?: DeliveryAddress;
  deliveryDate?: string;
  deliveryTime?: string;
  notes?: string;
}

export interface OrderFilters {
  status?: OrderStatus;
  paymentStatus?: PaymentStatus;
  patientId?: string;
  dateFrom?: string;
  dateTo?: string;
  search?: string;
  paymentMethod?: PaymentMethod;
}

export interface OrderListResponse {
  orders: Order[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface OrderStats {
  total: number;
  pending: number;
  processing: number;
  delivered: number;
  cancelled: number;
  totalValue: number;
  averageValue: number;
  todayOrders: number;
  thisWeekOrders: number;
  thisMonthOrders: number;
}

export interface OrderHistory {
  id: string;
  orderId: string;
  status: OrderStatus;
  notes?: string;
  updatedBy: string;
  updatedAt: string;
}

// Re-exportações de outros tipos necessários
export type { Patient } from '../patients';
export type { Product } from '../products';

