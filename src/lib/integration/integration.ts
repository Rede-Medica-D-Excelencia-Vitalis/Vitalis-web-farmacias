import axios from 'axios';
import { config } from '@/config/environment/env';

// Criar instância do axios para integração
export const integrationApi = axios.create({
  baseURL: config.API_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor para adicionar token de autenticação
integrationApi.interceptors.request.use(
  (config) => {
    // Tentar buscar token de diferentes chaves do localStorage
    const token = localStorage.getItem('authToken') || localStorage.getItem('token');
    console.log('🔐 Integration API - Token:', token ? 'Presente' : 'Ausente');
    console.log('🔐 Integration API - URL:', config.url);
    console.log('🔐 Integration API - Headers:', config.headers);
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Interceptor para tratamento de erros
integrationApi.interceptors.response.use(
  (response) => {
    console.log('✅ Integration API - Resposta:', response.status, response.config.url);
    return response;
  },
  (error) => {
    console.log('❌ Integration API - Erro:', error.response?.status, error.config?.url);
    console.log('❌ Integration API - Erro detalhes:', error.response?.data);
    if (error.response?.status === 401) {
      // Token expirado ou inválido
      localStorage.removeItem('authToken');
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      localStorage.removeItem('usuario');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Tipos para integração
export interface IntegratedOrder {
  id: number;
  numero_pedido: string;
  farmacia_id: number;
  paciente_id: number;
  total: number;
  subtotal: number;
  taxa_entrega: number;
  desconto: number;
  status: 'pendente' | 'em_preparo' | 'pronto_entrega' | 'em_entrega' | 'entregue' | 'cancelado';
  endereco_entrega: string;
  forma_pagamento: string;
  observacoes_entrega?: string;
  data_criacao: string;
  data_atualizacao: string;
  farmacia_nome?: string;
  paciente_nome?: string;
  paciente_telefone?: string;
  itens?: IntegratedOrderItem[];
}

export interface IntegratedOrderItem {
  id: number;
  pedido_id: number;
  produto_id: number;
  quantidade: number;
  preco_unitario: number;
  produto_nome?: string;
  produto_imagem?: string;
}

export interface PatientInfo {
  id: number;
  nome: string;
  email: string;
  telefone: string;
  endereco?: string;
  cidade?: string;
  estado?: string;
  cep?: string;
}

export interface NotificationData {
  id: number;
  usuario_id: number;
  tipo: string;
  titulo: string;
  mensagem: string;
  dados_adicional?: string;
  lida: boolean;
  data_criacao: string;
}

// Serviço de integração
export const integrationService = {
  // Buscar pedidos da farmácia
  getPharmacyOrders: async (
    pharmacyId: number,
    status?: string,
    page: number = 1,
    limit: number = 10
  ): Promise<{
    data: IntegratedOrder[];
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  }> => {
    try {
      console.log('🔍 Integration - Buscando pedidos para farmácia:', pharmacyId);
      console.log('🔍 Integration - Status:', status);
      console.log('🔍 Integration - Page:', page);
      console.log('🔍 Integration - Limit:', limit);
      
      const params = new URLSearchParams();
      if (status && status !== 'todos') params.append('status', status);
      params.append('page', page.toString());
      params.append('limit', limit.toString());

      const url = `/integration/orders/pharmacy/${pharmacyId}?${params}`;
      console.log('🔍 Integration - URL:', url);

      const response = await integrationApi.get(url);
      console.log('🔍 Integration - Resposta:', response.data);
      return response.data.data;
    } catch (error) {
      console.error('Erro ao buscar pedidos da farmácia:', error);
      throw error;
    }
  },

  // Buscar pedido específico
  getOrder: async (orderId: number): Promise<IntegratedOrder> => {
    try {
      const response = await integrationApi.get(`/integration/orders/${orderId}`);
      return response.data.data;
    } catch (error) {
      console.error('Erro ao buscar pedido:', error);
      throw error;
    }
  },

  // Atualizar status do pedido
  updateOrderStatus: async (orderId: number, status: string, observacoes?: string): Promise<void> => {
    try {
      await integrationApi.put(`/integration/orders/${orderId}/status`, { status, observacoes });
    } catch (error) {
      console.error('Erro ao atualizar status do pedido:', error);
      throw error;
    }
  },

  // Buscar informações do paciente
  getPatientInfo: async (patientId: number): Promise<PatientInfo> => {
    try {
      const response = await integrationApi.get(`/usuarios/${patientId}`);
      return response.data.data;
    } catch (error) {
      console.error('Erro ao buscar informações do paciente:', error);
      throw error;
    }
  },

  // Buscar notificações da farmácia
  getPharmacyNotifications: async (pharmacyId: number): Promise<NotificationData[]> => {
    try {
      const response = await integrationApi.get(`/notificacoes/farmacia/${pharmacyId}`);
      console.log('🔍 Debug - Resposta das notificações:', response.data);
      
      // O backend retorna { sucesso: true, notificacoes: [], naoLidas: 0 }
      if (response.data && response.data.sucesso && Array.isArray(response.data.notificacoes)) {
        return response.data.notificacoes;
      } else if (Array.isArray(response.data)) {
        // Fallback para formato direto
        return response.data;
      } else {
        console.warn('Formato inesperado de notificações:', response.data);
        return [];
      }
    } catch (error) {
      console.error('Erro ao buscar notificações:', error);
      throw error;
    }
  },

  // Buscar ID da farmácia baseado no usuário
  getPharmacyIdByUserId: async (userId: number): Promise<number> => {
    try {
      const response = await integrationApi.get(`/farmacias/minha`);
      return response.data.id; // Retorna o ID da farmácia
    } catch (error) {
      console.error('Erro ao buscar ID da farmácia:', error);
      throw error;
    }
  },

  // Marcar notificação como lida
  markNotificationAsRead: async (notificationId: number): Promise<void> => {
    try {
      await integrationApi.put(`/notificacoes/${notificationId}/lida`);
    } catch (error) {
      console.error('Erro ao marcar notificação como lida:', error);
      throw error;
    }
  },

  // Enviar notificação para o paciente
  sendNotificationToPatient: async (
    patientId: number,
    title: string,
    message: string,
    additionalData?: any
  ): Promise<void> => {
    try {
      await integrationApi.post('/notificacoes', {
        usuario_id: patientId,
        tipo: 'pedido_farmacia',
        titulo: title,
        mensagem: message,
        dados_adicional: additionalData ? JSON.stringify(additionalData) : undefined
      });
    } catch (error) {
      console.error('Erro ao enviar notificação para o paciente:', error);
      throw error;
    }
  },

  // Buscar estatísticas da farmácia
  getPharmacyStats: async (pharmacyId: number): Promise<{
    totalPedidos: number;
    pedidosPendentes: number;
    pedidosEmPreparo: number;
    pedidosEntregues: number;
    faturamentoTotal: number;
    faturamentoMes: number;
  }> => {
    try {
      const response = await integrationApi.get(`/integration/pharmacy/${pharmacyId}/stats`);
      return response.data.data;
    } catch (error) {
      console.error('Erro ao buscar estatísticas da farmácia:', error);
      throw error;
    }
  },

  // Buscar produtos da farmácia
  getPharmacyProducts: async (
    pharmacyId: number,
    category?: string,
    search?: string,
    page: number = 1,
    limit: number = 20
  ): Promise<{
    data: any[];
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  }> => {
    try {
      const params = new URLSearchParams();
      if (category && category !== 'all') params.append('category', category);
      if (search) params.append('search', search);
      params.append('page', page.toString());
      params.append('limit', limit.toString());

      const response = await integrationApi.get(`/integration/pharmacies/${pharmacyId}/products?${params}`);
      return response.data.data;
    } catch (error) {
      console.error('Erro ao buscar produtos da farmácia:', error);
      throw error;
    }
  }
}; 