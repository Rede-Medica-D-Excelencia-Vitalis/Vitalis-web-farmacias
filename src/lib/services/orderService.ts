/**
 * Serviço para gerenciamento de pedidos
 * 
 * Este serviço encapsula toda a lógica de negócio relacionada aos pedidos,
 * incluindo criação, atualização, status e integração com outros serviços.
 */

import { api } from '../api/api';
import type { 
  Order, 
  OrderStatus, 
  OrderFilters, 
  ApiResponse, 
  PaginatedResponse 
} from '../types';

/**
 * Serviço de pedidos
 */
export class OrderService {
  /**
   * Busca todos os pedidos com filtros opcionais
   */
  static async getOrders(filters?: OrderFilters, page = 1, limit = 20): Promise<PaginatedResponse<Order>> {
    try {
      const params = new URLSearchParams();
      
      if (filters) {
        if (filters.status) {
          filters.status.forEach(status => params.append('status', status));
        }
        if (filters.data_inicio) params.append('data_inicio', filters.data_inicio);
        if (filters.data_fim) params.append('data_fim', filters.data_fim);
        if (filters.paciente_id) params.append('paciente_id', filters.paciente_id.toString());
        if (filters.farmacia_id) params.append('farmacia_id', filters.farmacia_id.toString());
        if (filters.valor_min) params.append('valor_min', filters.valor_min.toString());
        if (filters.valor_max) params.append('valor_max', filters.valor_max.toString());
      }
      
      params.append('page', page.toString());
      params.append('limit', limit.toString());

      const response = await api.get(`/pedidos?${params.toString()}`);
      return response.data;
    } catch (error) {
      console.error('Erro ao buscar pedidos:', error);
      throw error;
    }
  }

  /**
   * Busca um pedido específico por ID
   */
  static async getOrderById(id: number): Promise<ApiResponse<Order>> {
    try {
      const response = await api.get(`/pedidos/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Erro ao buscar pedido ${id}:`, error);
      throw error;
    }
  }

  /**
   * Cria um novo pedido
   */
  static async createOrder(orderData: Partial<Order>): Promise<ApiResponse<Order>> {
    try {
      const response = await api.post('/pedidos', orderData);
      return response.data;
    } catch (error) {
      console.error('Erro ao criar pedido:', error);
      throw error;
    }
  }

  /**
   * Atualiza um pedido existente
   */
  static async updateOrder(id: number, orderData: Partial<Order>): Promise<ApiResponse<Order>> {
    try {
      const response = await api.put(`/pedidos/${id}`, orderData);
      return response.data;
    } catch (error) {
      console.error(`Erro ao atualizar pedido ${id}:`, error);
      throw error;
    }
  }

  /**
   * Atualiza o status de um pedido
   */
  static async updateOrderStatus(id: number, status: OrderStatus): Promise<ApiResponse<Order>> {
    try {
      const response = await api.patch(`/pedidos/${id}/status`, { status });
      return response.data;
    } catch (error) {
      console.error(`Erro ao atualizar status do pedido ${id}:`, error);
      throw error;
    }
  }

  /**
   * Cancela um pedido
   */
  static async cancelOrder(id: number, motivo?: string): Promise<ApiResponse<Order>> {
    try {
      const response = await api.post(`/pedidos/${id}/cancelar`, { motivo });
      return response.data;
    } catch (error) {
      console.error(`Erro ao cancelar pedido ${id}:`, error);
      throw error;
    }
  }

  /**
   * Remove um pedido (soft delete)
   */
  static async deleteOrder(id: number): Promise<ApiResponse<void>> {
    try {
      const response = await api.delete(`/pedidos/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Erro ao remover pedido ${id}:`, error);
      throw error;
    }
  }

  /**
   * Busca pedidos por status
   */
  static async getOrdersByStatus(status: OrderStatus): Promise<ApiResponse<Order[]>> {
    try {
      const response = await api.get(`/pedidos/status/${status}`);
      return response.data;
    } catch (error) {
      console.error(`Erro ao buscar pedidos com status ${status}:`, error);
      throw error;
    }
  }

  /**
   * Busca pedidos de hoje
   */
  static async getTodayOrders(): Promise<ApiResponse<Order[]>> {
    try {
      const response = await api.get('/pedidos/hoje');
      return response.data;
    } catch (error) {
      console.error('Erro ao buscar pedidos de hoje:', error);
      throw error;
    }
  }

  /**
   * Busca pedidos pendentes
   */
  static async getPendingOrders(): Promise<ApiResponse<Order[]>> {
    try {
      const response = await api.get('/pedidos/pendentes');
      return response.data;
    } catch (error) {
      console.error('Erro ao buscar pedidos pendentes:', error);
      throw error;
    }
  }

  /**
   * Calcula estatísticas dos pedidos
   */
  static async getOrderStats(): Promise<ApiResponse<{
    total: number;
    pendentes: number;
    em_preparo: number;
    prontos: number;
    entregues: number;
    cancelados: number;
    valor_total: number;
    valor_medio: number;
  }>> {
    try {
      const response = await api.get('/pedidos/stats');
      return response.data;
    } catch (error) {
      console.error('Erro ao buscar estatísticas dos pedidos:', error);
      throw error;
    }
  }

  /**
   * Gera relatório de pedidos
   */
  static async generateOrderReport(
    dataInicio: string, 
    dataFim: string, 
    formato: 'pdf' | 'excel' = 'pdf'
  ): Promise<ApiResponse<{ url: string }>> {
    try {
      const response = await api.post('/pedidos/relatorio', {
        data_inicio: dataInicio,
        data_fim: dataFim,
        formato
      });
      return response.data;
    } catch (error) {
      console.error('Erro ao gerar relatório de pedidos:', error);
      throw error;
    }
  }

  /**
   * Envia notificação sobre mudança de status
   */
  static async notifyStatusChange(orderId: number, status: OrderStatus): Promise<ApiResponse<void>> {
    try {
      const response = await api.post(`/pedidos/${orderId}/notificar-status`, { status });
      return response.data;
    } catch (error) {
      console.error(`Erro ao notificar mudança de status do pedido ${orderId}:`, error);
      throw error;
    }
  }

  /**
   * Valida se um pedido pode ser atualizado para um determinado status
   */
  static validateStatusTransition(currentStatus: OrderStatus, newStatus: OrderStatus): boolean {
    const validTransitions: Record<OrderStatus, OrderStatus[]> = {
      pendente: ['em_preparo', 'cancelado'],
      em_preparo: ['pronto_entrega', 'cancelado'],
      pronto_entrega: ['em_entrega', 'cancelado'],
      em_entrega: ['entregue', 'cancelado'],
      entregue: [],
      cancelado: []
    };

    return validTransitions[currentStatus]?.includes(newStatus) || false;
  }

  /**
   * Calcula o tempo estimado de entrega baseado no endereço
   */
  static calculateEstimatedDeliveryTime(enderecoEntrega: string): number {
    // Lógica simplificada - em produção seria integrada com APIs de geolocalização
    const baseTime = 30; // 30 minutos base
    const distanceFactor = Math.random() * 20; // Fator aleatório de 0-20 minutos
    return Math.round(baseTime + distanceFactor);
  }

  /**
   * Calcula a taxa de entrega baseada no endereço
   */
  static calculateDeliveryFee(enderecoEntrega: string, subtotal: number): number {
    // Lógica simplificada - em produção seria integrada com APIs de geolocalização
    const baseFee = 5; // Taxa base de R$ 5,00
    const distanceFactor = Math.random() * 3; // Fator aleatório de 0-3 reais
    
    // Desconto para pedidos acima de R$ 50,00
    const discount = subtotal > 50 ? 2 : 0;
    
    return Math.max(0, Math.round((baseFee + distanceFactor - discount) * 100) / 100);
  }
}

export default OrderService;
