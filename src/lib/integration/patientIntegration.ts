import axios from 'axios';

// Configuração da API baseada no backend real
const API_BASE = import.meta.env.DEV ? 'http://localhost:3001/api' : 'https://vitalis-backend.herokuapp.com/api';

// Log da configuração
console.log('🏥 Patient Integration for Pharmacies - API_BASE configurado:', API_BASE);
console.log('🔧 DEV:', import.meta.env.DEV);

// Criar instância do axios para integração com pacientes
export const patientApi = axios.create({
  baseURL: API_BASE,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor para adicionar token de autenticação
patientApi.interceptors.request.use(
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
patientApi.interceptors.response.use(
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

// Tipos para integração com pacientes
export interface Patient {
  id: number;
  name: string;
  email: string;
  phone: string;
  birthDate: string;
  gender: 'masculino' | 'feminino' | 'outro';
  cpf: string;
  address: {
    street: string;
    number: string;
    complement?: string;
    neighborhood: string;
    city: string;
    state: string;
    zipCode: string;
  };
  emergencyContact: {
    name: string;
    phone: string;
    relationship: string;
  };
  medicalHistory: {
    allergies: string[];
    chronicDiseases: string[];
    medications: string[];
    surgeries: string[];
  };
  status: 'ativo' | 'inativo' | 'suspenso';
  createdAt: string;
  lastVisit?: string;
  location?: {
    latitude: number;
    longitude: number;
  };
}

export interface PatientOrder {
  id: number;
  patientId: number;
  pharmacyId: number;
  patient: Patient;
  status: 'pendente' | 'confirmado' | 'preparando' | 'pronto' | 'em_entrega' | 'entregue' | 'cancelado';
  items: PatientOrderItem[];
  total: number;
  deliveryFee: number;
  deliveryAddress: {
    street: string;
    number: string;
    complement?: string;
    neighborhood: string;
    city: string;
    state: string;
    zipCode: string;
  };
  deliveryInstructions?: string;
  paymentMethod: 'pix' | 'cartao' | 'dinheiro';
  paymentStatus: 'pendente' | 'pago' | 'falhou';
  estimatedDeliveryTime?: string;
  actualDeliveryTime?: string;
  createdAt: string;
  updatedAt: string;
  notes?: string;
}

export interface PatientOrderItem {
  id: number;
  orderId: number;
  productId: number;
  product: {
    id: number;
    name: string;
    description?: string;
    category: string;
    brand: string;
    price: number;
    unit: string;
  };
  quantity: number;
  unitPrice: number;
  totalPrice: number;
  notes?: string;
}

export interface PatientPrescription {
  id: number;
  patientId: number;
  pharmacyId: number;
  doctorId: number;
  doctor: {
    id: number;
    name: string;
    specialty: string;
    crm: string;
  };
  status: 'pendente' | 'analisando' | 'aprovada' | 'rejeitada' | 'dispensada';
  prescriptionDate: string;
  expirationDate: string;
  medications: PrescriptionMedication[];
  notes?: string;
  rejectionReason?: string;
  createdAt: string;
  updatedAt: string;
}

export interface PrescriptionMedication {
  id: number;
  prescriptionId: number;
  medicationName: string;
  dosage: string;
  frequency: string;
  duration: string;
  quantity: number;
  instructions?: string;
}

export interface PatientNotification {
  id: number;
  patientId: number;
  pharmacyId: number;
  type: 'order_status' | 'prescription_status' | 'delivery_update' | 'promotion' | 'reminder';
  title: string;
  message: string;
  data?: any;
  read: boolean;
  createdAt: string;
}

export interface PatientStatus {
  patientId: number;
  status: 'online' | 'offline' | 'busy';
  lastSeen: string;
  currentOrder?: number;
  location?: {
    latitude: number;
    longitude: number;
    address: string;
  };
}

// Serviço de integração com pacientes
export const patientIntegrationService = {
  // === PACIENTES ===
  
  /**
   * Listar pacientes da farmácia
   */
  async listPharmacyPatients(): Promise<Patient[]> {
    try {
      const response = await patientApi.get('/pharmacy/patients');
      return response.data.data || [];
    } catch (error: any) {
      console.error('Erro ao listar pacientes:', error);
      throw new Error('Não foi possível carregar pacientes da farmácia');
    }
  },

  /**
   * Buscar paciente específico
   */
  async getPatient(id: number): Promise<Patient> {
    try {
      const response = await patientApi.get(`/pharmacy/patients/${id}`);
      return response.data.data;
    } catch (error: any) {
      console.error('Erro ao buscar paciente:', error);
      throw new Error('Não foi possível carregar dados do paciente');
    }
  },

  /**
   * Buscar pacientes por nome ou CPF
   */
  async searchPatients(query: string): Promise<Patient[]> {
    try {
      const response = await patientApi.get(`/pharmacy/patients/search?q=${encodeURIComponent(query)}`);
      return response.data.data || [];
    } catch (error: any) {
      console.error('Erro ao buscar pacientes:', error);
      throw new Error('Não foi possível buscar pacientes');
    }
  },

  /**
   * Obter histórico de pedidos do paciente
   */
  async getPatientOrderHistory(patientId: number): Promise<PatientOrder[]> {
    try {
      const response = await patientApi.get(`/pharmacy/patients/${patientId}/orders`);
      return response.data.data || [];
    } catch (error: any) {
      console.error('Erro ao buscar histórico de pedidos:', error);
      throw new Error('Não foi possível carregar histórico de pedidos');
    }
  },

  // === PEDIDOS ===

  /**
   * Listar pedidos da farmácia
   */
  async listPharmacyOrders(status?: string): Promise<PatientOrder[]> {
    try {
      const params = new URLSearchParams();
      if (status) {
        params.append('status', status);
      }

      const response = await patientApi.get(`/pharmacy/orders?${params.toString()}`);
      return response.data.data || [];
    } catch (error: any) {
      console.error('Erro ao listar pedidos:', error);
      throw new Error('Não foi possível carregar pedidos da farmácia');
    }
  },

  /**
   * Buscar pedido específico
   */
  async getOrder(orderId: number): Promise<PatientOrder> {
    try {
      const response = await patientApi.get(`/pharmacy/orders/${orderId}`);
      return response.data.data;
    } catch (error: any) {
      console.error('Erro ao buscar pedido:', error);
      throw new Error('Não foi possível carregar dados do pedido');
    }
  },

  /**
   * Atualizar status do pedido
   */
  async updateOrderStatus(orderId: number, status: string, notes?: string): Promise<PatientOrder> {
    try {
      const response = await patientApi.put(`/pharmacy/orders/${orderId}/status`, {
        status,
        notes
      });
      return response.data.data;
    } catch (error: any) {
      console.error('Erro ao atualizar status do pedido:', error);
      throw new Error('Não foi possível atualizar status do pedido');
    }
  },

  /**
   * Confirmar pedido
   */
  async confirmOrder(orderId: number, estimatedDeliveryTime?: string): Promise<PatientOrder> {
    try {
      const response = await patientApi.put(`/pharmacy/orders/${orderId}/confirm`, {
        estimatedDeliveryTime
      });
      return response.data.data;
    } catch (error: any) {
      console.error('Erro ao confirmar pedido:', error);
      throw new Error('Não foi possível confirmar o pedido');
    }
  },

  /**
   * Marcar pedido como pronto
   */
  async markOrderAsReady(orderId: number): Promise<PatientOrder> {
    try {
      const response = await patientApi.put(`/pharmacy/orders/${orderId}/ready`);
      return response.data.data;
    } catch (error: any) {
      console.error('Erro ao marcar pedido como pronto:', error);
      throw new Error('Não foi possível marcar pedido como pronto');
    }
  },

  /**
   * Cancelar pedido
   */
  async cancelOrder(orderId: number, reason: string): Promise<void> {
    try {
      await patientApi.put(`/pharmacy/orders/${orderId}/cancel`, { reason });
    } catch (error: any) {
      console.error('Erro ao cancelar pedido:', error);
      throw new Error('Não foi possível cancelar o pedido');
    }
  },

  // === RECEITAS ===

  /**
   * Listar receitas da farmácia
   */
  async listPharmacyPrescriptions(status?: string): Promise<PatientPrescription[]> {
    try {
      const params = new URLSearchParams();
      if (status) {
        params.append('status', status);
      }

      const response = await patientApi.get(`/pharmacy/prescriptions?${params.toString()}`);
      return response.data.data || [];
    } catch (error: any) {
      console.error('Erro ao listar receitas:', error);
      throw new Error('Não foi possível carregar receitas da farmácia');
    }
  },

  /**
   * Buscar receita específica
   */
  async getPrescription(prescriptionId: number): Promise<PatientPrescription> {
    try {
      const response = await patientApi.get(`/pharmacy/prescriptions/${prescriptionId}`);
      return response.data.data;
    } catch (error: any) {
      console.error('Erro ao buscar receita:', error);
      throw new Error('Não foi possível carregar dados da receita');
    }
  },

  /**
   * Atualizar status da receita
   */
  async updatePrescriptionStatus(prescriptionId: number, status: string, notes?: string, rejectionReason?: string): Promise<PatientPrescription> {
    try {
      const response = await patientApi.put(`/pharmacy/prescriptions/${prescriptionId}/status`, {
        status,
        notes,
        rejectionReason
      });
      return response.data.data;
    } catch (error: any) {
      console.error('Erro ao atualizar status da receita:', error);
      throw new Error('Não foi possível atualizar status da receita');
    }
  },

  /**
   * Aprovar receita
   */
  async approvePrescription(prescriptionId: number, notes?: string): Promise<PatientPrescription> {
    try {
      const response = await patientApi.put(`/pharmacy/prescriptions/${prescriptionId}/approve`, {
        notes
      });
      return response.data.data;
    } catch (error: any) {
      console.error('Erro ao aprovar receita:', error);
      throw new Error('Não foi possível aprovar a receita');
    }
  },

  /**
   * Rejeitar receita
   */
  async rejectPrescription(prescriptionId: number, reason: string): Promise<PatientPrescription> {
    try {
      const response = await patientApi.put(`/pharmacy/prescriptions/${prescriptionId}/reject`, {
        reason
      });
      return response.data.data;
    } catch (error: any) {
      console.error('Erro ao rejeitar receita:', error);
      throw new Error('Não foi possível rejeitar a receita');
    }
  },

  // === NOTIFICAÇÕES ===

  /**
   * Listar notificações da farmácia
   */
  async listPharmacyNotifications(): Promise<PatientNotification[]> {
    try {
      const response = await patientApi.get('/pharmacy/notifications');
      return response.data.data || [];
    } catch (error: any) {
      console.error('Erro ao listar notificações:', error);
      throw new Error('Não foi possível carregar notificações');
    }
  },

  /**
   * Marcar notificação como lida
   */
  async markNotificationAsRead(notificationId: number): Promise<void> {
    try {
      await patientApi.put(`/pharmacy/notifications/${notificationId}/read`);
    } catch (error: any) {
      console.error('Erro ao marcar notificação como lida:', error);
    }
  },

  /**
   * Enviar notificação para paciente
   */
  async sendNotificationToPatient(patientId: number, notificationData: {
    type: string;
    title: string;
    message: string;
    data?: any;
  }): Promise<void> {
    try {
      await patientApi.post(`/pharmacy/notifications/patient/${patientId}`, notificationData);
    } catch (error: any) {
      console.error('Erro ao enviar notificação para paciente:', error);
      throw new Error('Não foi possível enviar notificação');
    }
  },

  // === STATUS DOS PACIENTES ===

  /**
   * Obter status dos pacientes
   */
  async getPatientsStatus(patientIds: number[]): Promise<PatientStatus[]> {
    try {
      const response = await patientApi.post('/pharmacy/patients/status', { patient_ids: patientIds });
      return response.data.data || [];
    } catch (error: any) {
      console.error('Erro ao obter status dos pacientes:', error);
      throw new Error('Não foi possível obter status dos pacientes');
    }
  },

  /**
   * Atualizar status da farmácia
   */
  async updatePharmacyStatus(status: 'open' | 'closed' | 'maintenance'): Promise<void> {
    try {
      await patientApi.put('/pharmacy/status', { status });
    } catch (error: any) {
      console.error('Erro ao atualizar status da farmácia:', error);
      throw new Error('Não foi possível atualizar status da farmácia');
    }
  },

  // === RELATÓRIOS ===

  /**
   * Gerar relatório de pedidos
   */
  async generateOrdersReport(startDate: string, endDate: string): Promise<any> {
    try {
      const response = await patientApi.post('/pharmacy/reports/orders', {
        start_date: startDate,
        end_date: endDate
      });
      return response.data.data;
    } catch (error: any) {
      console.error('Erro ao gerar relatório de pedidos:', error);
      throw new Error('Não foi possível gerar relatório');
    }
  },

  /**
   * Gerar relatório de pacientes
   */
  async generatePatientsReport(): Promise<any> {
    try {
      const response = await patientApi.get('/pharmacy/reports/patients');
      return response.data.data;
    } catch (error: any) {
      console.error('Erro ao gerar relatório de pacientes:', error);
      throw new Error('Não foi possível gerar relatório');
    }
  },

  /**
   * Gerar relatório de receitas
   */
  async generatePrescriptionsReport(startDate: string, endDate: string): Promise<any> {
    try {
      const response = await patientApi.post('/pharmacy/reports/prescriptions', {
        start_date: startDate,
        end_date: endDate
      });
      return response.data.data;
    } catch (error: any) {
      console.error('Erro ao gerar relatório de receitas:', error);
      throw new Error('Não foi possível gerar relatório');
    }
  },

  // === ENTREGAS ===

  /**
   * Calcular frete de entrega
   */
  async calculateDeliveryFee(patientId: number, deliveryAddress: {
    latitude: number;
    longitude: number;
  }): Promise<{
    fee: number;
    estimatedTime: number; // em minutos
    distance: number; // em km
  }> {
    try {
      const response = await patientApi.post('/pharmacy/delivery/calculate', {
        patientId,
        deliveryAddress,
      });
      return response.data.data;
    } catch (error: any) {
      console.error('Erro ao calcular frete:', error);
      throw new Error('Não foi possível calcular o frete');
    }
  },

  /**
   * Atualizar status de entrega
   */
  async updateDeliveryStatus(orderId: number, status: string, location?: {
    latitude: number;
    longitude: number;
    address: string;
  }): Promise<void> {
    try {
      await patientApi.put(`/pharmacy/orders/${orderId}/delivery-status`, {
        status,
        location
      });
    } catch (error: any) {
      console.error('Erro ao atualizar status de entrega:', error);
      throw new Error('Não foi possível atualizar status de entrega');
    }
  },

  // === UTILITÁRIOS ===

  /**
   * Verificar se o usuário está autenticado
   */
  isAuthenticated(): boolean {
    const token = localStorage.getItem('authToken');
    return !!token;
  },

  /**
   * Fazer logout
   */
  logout(): void {
    localStorage.removeItem('authToken');
    localStorage.removeItem('user');
    window.location.href = '/login';
  },
};

export default patientIntegrationService;
