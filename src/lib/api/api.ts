import axios from 'axios';
import { config } from '@/config/environment/env';

// Criar instância do axios
const api = axios.create({
  baseURL: config.API_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor para adicionar token de autenticação
api.interceptors.request.use(
  (config) => {
    // Tentar buscar token de diferentes chaves do localStorage
    const token = localStorage.getItem('authToken') || localStorage.getItem('token');
    console.log('🔐 API - Token:', token ? 'Presente' : 'Ausente');
    console.log('🔐 API - URL:', config.url);
    console.log('🔐 API - Headers:', config.headers);
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
api.interceptors.response.use(
  (response) => {
    console.log('✅ API - Resposta:', response.status, response.config.url);
    return response;
  },
  (error) => {
    console.log('❌ API - Erro:', error.response?.status, error.config?.url);
    console.log('❌ API - Erro detalhes:', error.response?.data);
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

// Tipos para as respostas da API
export interface LoginResponse {
  sucesso: boolean;
  mensagem?: string;
  token: string;
  usuario: {
    id: number;
    nome: string;
    email: string;
    tipo_usuario: 'farmacia' | 'paciente' | 'medico' | 'admin';
  };
}

export interface Pedido {
  id: number;
  numero_pedido: string;
  farmacia_id: number;
  paciente_id: number;
  medico_id?: number;
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
  medico_nome?: string;
  status_entrega?: string;
  motoboy_id?: number;
  motoboy_nome?: string;
  itens?: ItemPedido[];
}

export interface ItemPedido {
  id: number;
  pedido_id: number;
  produto_id: number;
  quantidade: number;
  preco_unitario: number;
  produto_nome?: string;
  produto_preco?: number;
}

export interface Produto {
  id: number;
  nome: string;
  descricao?: string;
  preco: number;
  preco_original?: number;
  preco_custo?: number;
  desconto?: number;
  estoque: number;
  estoque_minimo?: number;
  estoque_maximo?: number;
  categoria_id?: number;
  farmacia_id: number;
  ativo: number; // 0 = inativo, 1 = ativo
  imagem?: string; // Campo correto retornado pelo backend
  // Novos campos
  concentracao?: string;
  unidade_medida?: string;
  fabricante?: string;
  codigo_barras?: string;
  principio_ativo?: string;
  forma_farmaceutica?: string;
  receita_obrigatoria?: boolean;
  data_validade?: string;
}

export interface Farmacia {
  id: number;
  nome: string;
  cnpj: string;
  email: string;
  telefone: string;
  endereco: string;
  cidade: string;
  estado: string;
  cep: string;
  status: 'ativo' | 'inativo';
  data_criacao: string;
  foto?: string;
  avaliacao?: number;
  usuario_id?: number;
}

export interface Avaliacao {
  id: number;
  farmacia_id: number;
  paciente_id: number;
  pedido_id?: number;
  nota: number;
  comentario?: string;
  data_criacao: string;
  paciente_nome?: string;
  resposta?: string;
  data_resposta?: string;
  tipo?: string;
  avaliado_id?: number;
  avaliador_id?: number;
}

// Métodos da API
export const apiService = {
  // Autenticação
  auth: {
    login: async (email: string, senha: string): Promise<LoginResponse> => {
      console.log('🌐 Fazendo requisição de login...');
      try {
        const response = await api.post('/auth/login', { email, senha });
        console.log('📥 Resposta da API:', response.data);
        return response.data;
      } catch (error: any) {
        console.error('❌ Erro na requisição de login:', error);
        // Re-lançar o erro para que seja tratado pelo contexto
        throw error;
      }
    },

    logout: () => {
      console.log('🚪 Fazendo logout...');
      localStorage.removeItem('authToken');
      localStorage.removeItem('user');
      console.log('🧹 Dados removidos do localStorage');
    },

    getCurrentUser: () => {
      const user = localStorage.getItem('user');
      console.log('👤 Buscando usuário no localStorage:', user);
      return user ? JSON.parse(user) : null;
    },

    setAuthData: (token: string, user: any) => {
      console.log('💾 Salvando dados de autenticação...', { token: token ? 'Presente' : 'Ausente', user });
      localStorage.setItem('authToken', token);
      localStorage.setItem('user', JSON.stringify(user));
      localStorage.setItem('tokenExpiry', (Date.now() + 3600000).toString()); // 1 hora
      console.log('✅ Dados salvos com sucesso');
    },

    refreshToken: async (): Promise<{ token: string }> => {
      console.log('🔄 Renovando token...');
      try {
        const response = await api.post('/auth/refresh');
        const { token } = response.data;
        localStorage.setItem('authToken', token);
        localStorage.setItem('tokenExpiry', (Date.now() + 3600000).toString()); // 1 hora
        console.log('✅ Token renovado com sucesso');
        return { token };
      } catch (error) {
        console.error('❌ Erro ao renovar token:', error);
        throw error;
      }
    },
  },

  // Pedidos
  pedidos: {
    listar: async (filtros?: {
      status?: string;
      data_inicio?: string;
      data_fim?: string;
    }): Promise<Pedido[]> => {
      const response = await api.get('/pedidos', { params: filtros });
      return response.data;
    },

    buscarPorId: async (id: number): Promise<Pedido> => {
      const response = await api.get(`/pedidos/${id}`);
      return response.data;
    },

    atualizarStatus: async (id: number, status: string, observacoes?: string) => {
      const response = await api.put(`/pedidos/${id}/status`, { status, observacoes });
      return response.data;
    },

    cancelar: async (id: number, motivo?: string) => {
      const response = await api.put(`/pedidos/${id}/cancelar`, { motivo });
      return response.data;
    },

    // Estatísticas de pedidos
    getEstatisticas: async () => {
      const response = await api.get('/pedidos/estatisticas');
      return response.data;
    },
  },

  // Categorias
  categorias: {
    listar: async () => {
      const response = await api.get('/categorias-produtos');
      return response.data;
    },

    buscarPorId: async (id: number) => {
      const response = await api.get(`/categorias-produtos/${id}`);
      return response.data;
    },

    criar: async (categoria: { nome: string; descricao?: string; categoria_pai_id?: number }) => {
      const response = await api.post('/categorias-produtos', categoria);
      return response.data;
    },

    atualizar: async (id: number, categoria: Partial<{ nome: string; descricao?: string; categoria_pai_id?: number }>) => {
      const response = await api.put(`/categorias-produtos/${id}`, categoria);
      return response.data;
    },

    deletar: async (id: number) => {
      const response = await api.delete(`/categorias-produtos/${id}`);
      return response.data;
    },
  },

  // Produtos
  produtos: {
    listar: async (filtros?: {
      categoria_id?: number;
      status?: string;
      busca?: string;
    }): Promise<Produto[]> => {
      const response = await api.get('/produtos', { params: filtros });
      return response.data;
    },

    listarPorFarmacia: async (): Promise<Produto[]> => {
      const response = await api.get('/produtos/farmacia');
      return response.data;
    },

    buscarPorId: async (id: number): Promise<Produto> => {
      const response = await api.get(`/produtos/${id}`);
      return response.data;
    },

    criar: async (produto: Omit<Produto, 'id' | 'data_criacao'>) => {
      const response = await api.post('/produtos', produto);
      return response.data;
    },

    atualizar: async (id: number, produto: Partial<Produto>) => {
      const response = await api.put(`/produtos/${id}`, produto);
      return response.data;
    },

    deletar: async (id: number) => {
      const response = await api.delete(`/produtos/${id}`);
      return response.data;
    },
  },

  // Farmácia
  farmacia: {
    getPerfil: async (): Promise<Farmacia> => {
      const response = await api.get('/farmacias/minha');
      return response.data;
    },

    atualizar: async (dados: Partial<Farmacia>) => {
      const response = await api.put('/farmacias/minha', dados);
      return response.data;
    },

    getEstatisticas: async () => {
      const response = await api.get('/farmacias/estatisticas');
      return response.data;
    },
  },

  // Avaliações
  avaliacoes: {
    listar: async (filtros?: {
      nota?: number;
      data_inicio?: string;
      data_fim?: string;
    }): Promise<Avaliacao[]> => {
      const response = await api.get('/avaliacoes', { params: filtros });
      return response.data;
    },

    listarPorFarmacia: async (farmacia_id: number): Promise<Avaliacao[]> => {
      const response = await api.get(`/avaliacoes/farmacia/${farmacia_id}`);
      return response.data;
    },

    getMediaAvaliacoes: async (farmacia_id: number) => {
      const response = await api.get(`/avaliacoes/media/farmacia/${farmacia_id}`);
      return response.data;
    },

    responder: async (id: number, resposta: string) => {
      const response = await api.put(`/avaliacoes/${id}/responder`, { resposta });
      return response.data;
    },
  },

  // Dashboard
  dashboard: {
    getMetricas: async () => {
      const response = await api.get('/farmacias/estatisticas');
      return response.data;
    },

    getAtividadesRecentes: async () => {
      const response = await api.get('/farmacias/atividades-recentes');
      return response.data;
    },

    getTodosPedidos: async () => {
      const response = await api.get('/farmacias/todos-pedidos');
      return response.data;
    },

    getEstatisticasPorCategoria: async (periodo?: number) => {
      const response = await api.get('/farmacias/estatisticas-por-categoria', {
        params: { periodo }
      });
      return response.data;
    },
  },

  // Validação de Documentos
  validacaoDocumentos: {
    validarCNPJ: async (cnpj: string) => {
      const response = await api.get(`/validacao-documentos/cnpj/${cnpj}`);
      return response.data;
    },

    validarCEP: async (cep: string) => {
      const response = await api.get(`/validacao-documentos/cep/${cep}`);
      return response.data;
    },

    validarAlvara: async (numero: string, estado: string) => {
      const response = await api.post('/validacao-documentos/alvara', { numero, estado });
      return response.data;
    },

    validarVigilancia: async (numero: string, estado: string) => {
      const response = await api.post('/validacao-documentos/vigilancia', { numero, estado });
      return response.data;
    },

    validarCRF: async (registro: string, estado: string) => {
      const response = await api.post('/validacao-documentos/crf', { registro, estado });
      return response.data;
    },
  },
};

export { api };
export default api; 