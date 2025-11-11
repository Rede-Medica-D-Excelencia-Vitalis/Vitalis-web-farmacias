import axios from 'axios';
import { config } from '@/config/environment/env';

// Criar instância do axios para integração com motoboys
export const motoboyApi = axios.create({
  baseURL: config.API_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor para adicionar token de autenticação
motoboyApi.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('authToken');
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
motoboyApi.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('authToken');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Tipos para integração com motoboys
export interface Motoboy {
  id: number;
  nome: string;
  email: string;
  telefone: string;
  status_conta: 'ativo' | 'inativo' | 'suspenso';
  status_online: boolean;
  avaliacao_media: number;
  total_entregas: number;
  total_ganhos_historico: number;
  localizacao?: {
    latitude: number;
    longitude: number;
    ultima_atualizacao: string;
  };
  veiculos: Veiculo[];
  disponibilidade: {
    segunda: boolean;
    terca: boolean;
    quarta: boolean;
    quinta: boolean;
    sexta: boolean;
    sabado: boolean;
    domingo: boolean;
    horarios: {
      inicio: string;
      fim: string;
    };
  };
}

export interface Veiculo {
  id: number;
  tipo: 'moto' | 'carro' | 'bicicleta';
  marca: string;
  modelo: string;
  ano: string;
  placa: string;
  cor: string;
  ativo: boolean;
}

export interface Entrega {
  id: number;
  pedido_id: number;
  motoboy_id?: number;
  status: 'disponivel' | 'aceita' | 'em_rota' | 'entregue' | 'cancelada';
  endereco_origem: string;
  endereco_destino: string;
  distancia_km: number;
  tempo_estimado_minutos: number;
  taxa_entrega: number;
  comissao_motoboy: number;
  data_criacao: string;
  data_aceitacao?: string;
  data_inicio_entrega?: string;
  data_entrega?: string;
  observacoes?: string;
  rastreamento?: {
    latitude: number;
    longitude: number;
    timestamp: string;
    velocidade?: number;
  };
}

export interface PedidoComEntrega {
  id: number;
  numero_pedido: string;
  farmacia_id: number;
  paciente_id: number;
  total: number;
  subtotal: number;
  taxa_entrega: number;
  desconto: number;
  status: 'pendente' | 'aceito' | 'rejeitado' | 'em_entrega' | 'entregue';
  endereco_entrega: string;
  forma_pagamento: string;
  observacoes_entrega?: string;
  observacoes_pedido?: string;
  data_criacao: string;
  data_atualizacao: string;
  farmacia_nome?: string;
  paciente_nome?: string;
  paciente_telefone?: string;
  itens?: any[];
  entrega?: Entrega;
  motoboy?: Motoboy;
  status_entrega?: string | null;
}

export interface NotificacaoEntrega {
  id: number;
  tipo: 'nova_entrega' | 'entrega_aceita' | 'entrega_em_rota' | 'entrega_entregue' | 'entrega_cancelada';
  titulo: string;
  mensagem: string;
  dados: {
    pedido_id: number;
    entrega_id: number;
    motoboy_id?: number;
    status: string;
  };
  timestamp: string;
  lida: boolean;
}

// Serviço de integração com motoboys
export const motoboyIntegrationService = {
  // === MOTOBOYS ===
  
  /**
   * Listar motoboys disponíveis para entrega
   */
  async listarMotoboysDisponiveis(): Promise<Motoboy[]> {
    try {
      const response = await motoboyApi.get('/motoboys/disponiveis');
      return response.data.data || [];
    } catch (error) {
      console.error('Erro ao listar motoboys disponíveis:', error);
      throw new Error('Não foi possível carregar motoboys disponíveis');
    }
  },

  /**
   * Buscar motoboy por ID
   */
  async buscarMotoboy(id: number): Promise<Motoboy> {
    try {
      const response = await motoboyApi.get(`/motoboys/${id}`);
      return response.data.data;
    } catch (error) {
      console.error('Erro ao buscar motoboy:', error);
      throw new Error('Não foi possível carregar dados do motoboy');
    }
  },

  /**
   * Atualizar status online/offline do motoboy
   */
  async atualizarStatusMotoboy(id: number, status: boolean): Promise<void> {
    try {
      await motoboyApi.put(`/motoboys/${id}/status-online`, { online: status });
    } catch (error) {
      console.error('Erro ao atualizar status do motoboy:', error);
      throw new Error('Não foi possível atualizar status do motoboy');
    }
  },

  // === ENTREGAS ===

  /**
   * Listar entregas disponíveis
   */
  async listarEntregasDisponiveis(): Promise<Entrega[]> {
    try {
      const response = await motoboyApi.get('/entregas/disponiveis');
      return response.data.data || [];
    } catch (error) {
      console.error('Erro ao listar entregas disponíveis:', error);
      throw new Error('Não foi possível carregar entregas disponíveis');
    }
  },

  /**
   * Aceitar entrega (para motoboys)
   */
  async aceitarEntrega(entregaId: number, motoboyId: number): Promise<Entrega> {
    try {
      const response = await motoboyApi.post('/entregas/aceitar', {
        entrega_id: entregaId,
        motoboy_id: motoboyId
      });
      return response.data.data;
    } catch (error) {
      console.error('Erro ao aceitar entrega:', error);
      throw new Error('Não foi possível aceitar a entrega');
    }
  },

  /**
   * Atualizar status da entrega
   */
  async atualizarStatusEntrega(entregaId: number, status: string, observacoes?: string): Promise<Entrega> {
    try {
      const response = await motoboyApi.put(`/entregas/${entregaId}/status`, {
        status,
        observacoes
      });
      return response.data.data;
    } catch (error) {
      console.error('Erro ao atualizar status da entrega:', error);
      throw new Error('Não foi possível atualizar status da entrega');
    }
  },

  /**
   * Cancelar entrega
   */
  async cancelarEntrega(entregaId: number, motivo: string): Promise<void> {
    try {
      await motoboyApi.put(`/entregas/${entregaId}/cancelar`, { motivo });
    } catch (error) {
      console.error('Erro ao cancelar entrega:', error);
      throw new Error('Não foi possível cancelar a entrega');
    }
  },

  /**
   * Confirmar devolução após problema na entrega
   */
  async confirmarDevolucao(entregaId: number): Promise<void> {
    try {
      await motoboyApi.post(`/entregas/${entregaId}/confirmar-devolucao`);
    } catch (error) {
      console.error('Erro ao confirmar devolução:', error);
      throw new Error('Não foi possível confirmar a devolução');
    }
  },

  // === PEDIDOS COM ENTREGA ===

  /**
   * Listar pedidos com informações de entrega
   */
  async listarPedidosComEntrega(): Promise<PedidoComEntrega[]> {
    try {
      const response = await motoboyApi.get('/pedidos/com-entrega');
      return response.data.data || [];
    } catch (error) {
      console.error('Erro ao listar pedidos com entrega:', error);
      throw new Error('Não foi possível carregar pedidos com entrega');
    }
  },

  /**
   * Buscar pedido específico com entrega
   */
  async buscarPedidoComEntrega(pedidoId: number): Promise<PedidoComEntrega> {
    try {
      const response = await motoboyApi.get(`/pedidos/${pedidoId}/com-entrega`);
      return response.data.data;
    } catch (error) {
      console.error('Erro ao buscar pedido com entrega:', error);
      throw new Error('Não foi possível carregar dados do pedido');
    }
  },

  // === NOTIFICAÇÕES ===

  /**
   * Listar notificações de entrega
   */
  async listarNotificacoesEntrega(): Promise<NotificacaoEntrega[]> {
    try {
      const response = await motoboyApi.get('/notificacoes/entregas');
      return response.data.data || [];
    } catch (error) {
      console.error('Erro ao listar notificações de entrega:', error);
      throw new Error('Não foi possível carregar notificações');
    }
  },

  /**
   * Marcar notificação como lida
   */
  async marcarNotificacaoComoLida(notificacaoId: number): Promise<void> {
    try {
      await motoboyApi.put(`/notificacoes/${notificacaoId}/ler`);
    } catch (error) {
      console.error('Erro ao marcar notificação como lida:', error);
    }
  },

  // === RASTREAMENTO ===

  /**
   * Atualizar localização do motoboy
   */
  async atualizarLocalizacao(motoboyId: number, latitude: number, longitude: number): Promise<void> {
    try {
      await motoboyApi.put(`/motoboys/${motoboyId}/localizacao`, {
        latitude,
        longitude
      });
    } catch (error) {
      console.error('Erro ao atualizar localização:', error);
      throw new Error('Não foi possível atualizar localização');
    }
  },

  /**
   * Rastrear entrega em tempo real
   */
  async rastrearEntrega(entregaId: number): Promise<any> {
    try {
      const response = await motoboyApi.get(`/rastreamento/entrega/${entregaId}`);
      return response.data.data;
    } catch (error) {
      console.error('Erro ao rastrear entrega:', error);
      throw new Error('Não foi possível rastrear a entrega');
    }
  },

  // === RELATÓRIOS ===

  /**
   * Gerar relatório de entregas
   */
  async gerarRelatorioEntregas(dataInicio: string, dataFim: string): Promise<any> {
    try {
      const response = await motoboyApi.get('/relatorios/entregas', {
        params: { data_inicio: dataInicio, data_fim: dataFim }
      });
      return response.data.data;
    } catch (error) {
      console.error('Erro ao gerar relatório de entregas:', error);
      throw new Error('Não foi possível gerar relatório');
    }
  }
};

export default motoboyIntegrationService;
