/**
 * Serviço de Pedidos
 * 
 * Gerencia todas as operações relacionadas aos pedidos da farmácia,
 * incluindo criação, atualização, consulta e rastreamento.
 */

import { api } from '@/lib/api/api';
import type { Order, OrderCreateRequest, OrderUpdateRequest, OrderStatus } from '@/types';

export interface OrderFilters {
  status?: OrderStatus;
  patientId?: string;
  dateFrom?: string;
  dateTo?: string;
  search?: string;
}

export interface OrderListResponse {
  orders: Order[];
  total: number;
  page: number;
  limit: number;
}

class OrderService {
  /**
   * Lista todos os pedidos com filtros opcionais
   */
  async getOrders(filters?: OrderFilters, page = 1, limit = 10): Promise<OrderListResponse> {
    try {
      const params = new URLSearchParams();
      
      if (filters?.status) params.append('status', filters.status);
      if (filters?.patientId) params.append('patientId', filters.patientId);
      if (filters?.dateFrom) params.append('dateFrom', filters.dateFrom);
      if (filters?.dateTo) params.append('dateTo', filters.dateTo);
      if (filters?.search) params.append('search', filters.search);
      
      params.append('page', page.toString());
      params.append('limit', limit.toString());

      const response = await api.get(`/orders?${params.toString()}`);
      return response.data;
    } catch (error) {
      console.error('Erro ao buscar pedidos:', error);
      throw error;
    }
  }

  /**
   * Obtém um pedido específico por ID
   */
  async getOrderById(id: string): Promise<Order> {
    try {
      const response = await api.get(`/orders/${id}`);
      return response.data;
    } catch (error) {
      console.error('Erro ao buscar pedido:', error);
      throw error;
    }
  }

  /**
   * Cria um novo pedido
   */
  async createOrder(orderData: OrderCreateRequest): Promise<Order> {
    try {
      const response = await api.post('/orders', orderData);
      return response.data;
    } catch (error) {
      console.error('Erro ao criar pedido:', error);
      throw error;
    }
  }

  /**
   * Atualiza um pedido existente
   */
  async updateOrder(id: string, orderData: OrderUpdateRequest): Promise<Order> {
    try {
      const response = await api.put(`/orders/${id}`, orderData);
      return response.data;
    } catch (error) {
      console.error('Erro ao atualizar pedido:', error);
      throw error;
    }
  }

  /**
   * Atualiza o status de um pedido
   */
  async updateOrderStatus(id: string, status: OrderStatus, notes?: string): Promise<Order> {
    try {
      const response = await api.patch(`/orders/${id}/status`, { status, notes });
      return response.data;
    } catch (error) {
      console.error('Erro ao atualizar status do pedido:', error);
      throw error;
    }
  }

  /**
   * Cancela um pedido
   */
  async cancelOrder(id: string, reason: string): Promise<Order> {
    try {
      const response = await api.patch(`/orders/${id}/cancel`, { reason });
      return response.data;
    } catch (error) {
      console.error('Erro ao cancelar pedido:', error);
      throw error;
    }
  }

  /**
   * Obtém o histórico de um pedido
   */
  async getOrderHistory(id: string): Promise<any[]> {
    try {
      const response = await api.get(`/orders/${id}/history`);
      return response.data;
    } catch (error) {
      console.error('Erro ao buscar histórico do pedido:', error);
      throw error;
    }
  }

  /**
   * Obtém estatísticas dos pedidos
   */
  async getOrderStats(dateFrom?: string, dateTo?: string): Promise<any> {
    try {
      const params = new URLSearchParams();
      if (dateFrom) params.append('dateFrom', dateFrom);
      if (dateTo) params.append('dateTo', dateTo);

      const response = await api.get(`/orders/stats?${params.toString()}`);
      return response.data;
    } catch (error) {
      console.error('Erro ao buscar estatísticas dos pedidos:', error);
      throw error;
    }
  }

  /**
   * Obtém pedidos recentes
   */
  async getRecentOrders(limit = 5): Promise<Order[]> {
    try {
      const response = await api.get(`/orders/recent?limit=${limit}`);
      return response.data;
    } catch (error) {
      console.error('Erro ao buscar pedidos recentes:', error);
      throw error;
    }
  }

  /**
   * Obtém pedidos pendentes
   */
  async getPendingOrders(): Promise<Order[]> {
    try {
      const response = await api.get('/orders/pending');
      return response.data;
    } catch (error) {
      console.error('Erro ao buscar pedidos pendentes:', error);
      throw error;
    }
  }

  /**
   * Exporta pedidos para CSV
   */
  async exportOrders(filters?: OrderFilters): Promise<Blob> {
    try {
      const params = new URLSearchParams();
      
      if (filters?.status) params.append('status', filters.status);
      if (filters?.patientId) params.append('patientId', filters.patientId);
      if (filters?.dateFrom) params.append('dateFrom', filters.dateFrom);
      if (filters?.dateTo) params.append('dateTo', filters.dateTo);

      const response = await api.get(`/orders/export?${params.toString()}`, {
        responseType: 'blob'
      });
      
      return response.data;
    } catch (error) {
      console.error('Erro ao exportar pedidos:', error);
      throw error;
    }
  }
}

// Instância singleton
export const orderService = new OrderService();
export default orderService;

