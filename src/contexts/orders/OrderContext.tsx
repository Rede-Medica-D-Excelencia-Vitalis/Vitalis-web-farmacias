/**
 * Contexto de Pedidos
 * 
 * Gerencia o estado global dos pedidos da aplicação,
 * incluindo lista de pedidos, filtros, paginação e ações.
 */

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { ORDER_STATUS } from '@/config/constants';
import { apiService } from '@/lib/api';

// Tipos
export type OrderStatus = typeof ORDER_STATUS[keyof typeof ORDER_STATUS];

// Interface do pedido
export interface Order {
  id: string;
  patientId: string;
  patientName: string;
  items: OrderItem[];
  status: OrderStatus;
  total: number;
  createdAt: Date;
  updatedAt: Date;
  deliveryAddress?: string;
  deliveryInstructions?: string;
  estimatedDelivery?: Date;
  actualDelivery?: Date;
  notes?: string;
  priority: 'low' | 'medium' | 'high' | 'urgent';
}

// Interface do item do pedido
export interface OrderItem {
  id: string;
  productId: string;
  productName: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
  prescription?: string;
}

// Filtros de pedido
export interface OrderFilters {
  status?: OrderStatus;
  dateRange?: {
    start: Date;
    end: Date;
  };
  patientName?: string;
  priority?: Order['priority'];
  minTotal?: number;
  maxTotal?: number;
}

// Interface do contexto
interface OrderContextType {
  // Estado
  orders: Order[];
  filteredOrders: Order[];
  selectedOrder: Order | null;
  isLoading: boolean;
  error: string | null;
  
  // Filtros e paginação
  filters: OrderFilters;
  pagination: {
    page: number;
    pageSize: number;
    total: number;
    totalPages: number;
  };
  
  // Ações
  loadOrders: () => Promise<void>;
  loadOrder: (id: string) => Promise<void>;
  createOrder: (order: Omit<Order, 'id' | 'createdAt' | 'updatedAt'>) => Promise<Order>;
  updateOrder: (id: string, updates: Partial<Order>) => Promise<void>;
  deleteOrder: (id: string) => Promise<void>;
  updateOrderStatus: (id: string, status: OrderStatus) => Promise<void>;
  
  // Seleção
  selectOrder: (order: Order | null) => void;
  
  // Filtros
  updateFilters: (filters: Partial<OrderFilters>) => void;
  clearFilters: () => void;
  
  // Paginação
  setPage: (page: number) => void;
  setPageSize: (pageSize: number) => void;
  
  // Utilitários
  getOrderById: (id: string) => Order | undefined;
  getOrdersByStatus: (status: OrderStatus) => Order[];
  getOrdersByPatient: (patientId: string) => Order[];
  getTotalOrders: () => number;
  getTotalValue: () => number;
  getPendingOrders: () => Order[];
  getDeliveredOrders: () => Order[];
}

// Contexto
const OrderContext = createContext<OrderContextType | undefined>(undefined);

// Provider
interface OrderProviderProps {
  children: ReactNode;
}

export const OrderProvider: React.FC<OrderProviderProps> = ({ children }) => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const [filters, setFilters] = useState<OrderFilters>({});
  const [pagination, setPagination] = useState({
    page: 1,
    pageSize: 20,
    total: 0,
    totalPages: 0,
  });

  // Computed values
  const filteredOrders = React.useMemo(() => {
    let filtered = [...orders];

    // Aplicar filtros
    if (filters.status) {
      filtered = filtered.filter(order => order.status === filters.status);
    }

    if (filters.patientName) {
      filtered = filtered.filter(order => 
        order.patientName.toLowerCase().includes(filters.patientName!.toLowerCase())
      );
    }

    if (filters.priority) {
      filtered = filtered.filter(order => order.priority === filters.priority);
    }

    if (filters.minTotal) {
      filtered = filtered.filter(order => order.total >= filters.minTotal!);
    }

    if (filters.maxTotal) {
      filtered = filtered.filter(order => order.total <= filters.maxTotal!);
    }

    if (filters.dateRange) {
      filtered = filtered.filter(order => {
        const orderDate = new Date(order.createdAt);
        return orderDate >= filters.dateRange!.start && orderDate <= filters.dateRange!.end;
      });
    }

    return filtered;
  }, [orders, filters]);

  // Carregar pedidos
  const loadOrders = async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      // Verificar se apiService está disponível
      if (apiService?.pedidos?.listar) {
        const response = await apiService.pedidos.listar();
        setOrders(response);
        setPagination(prev => ({
          ...prev,
          total: response.length,
          totalPages: Math.ceil(response.length / prev.pageSize),
        }));
      } else {
        // Fallback para dados mock se apiService não estiver disponível
        const mockOrders: Order[] = [
          {
            id: '1',
            patientId: '1',
            patientName: 'João Silva',
            items: [
              {
                id: '1',
                productId: '1',
                productName: 'Paracetamol 500mg',
                quantity: 2,
                unitPrice: 5.50,
                totalPrice: 11.00,
              }
            ],
            status: ORDER_STATUS.PENDING,
            total: 11.00,
            createdAt: new Date(),
            updatedAt: new Date(),
            priority: 'medium',
          }
        ];
        
        setOrders(mockOrders);
        setPagination(prev => ({
          ...prev,
          total: mockOrders.length,
          totalPages: Math.ceil(mockOrders.length / prev.pageSize),
        }));
      }
    } catch (err: any) {
      setError(err.message || 'Erro ao carregar pedidos');
    } finally {
      setIsLoading(false);
    }
  };

  // Carregar pedido específico
  const loadOrder = async (id: string) => {
    try {
      setIsLoading(true);
      setError(null);
      
      // Simular chamada à API
      // const response = await apiService.orders.getOrder(id);
      // const order = response.data;
      
      const order = orders.find(o => o.id === id);
      if (order) {
        setSelectedOrder(order);
      } else {
        setError('Pedido não encontrado');
      }
    } catch (err: any) {
      setError(err.message || 'Erro ao carregar pedido');
    } finally {
      setIsLoading(false);
    }
  };

  // Criar pedido
  const createOrder = async (orderData: Omit<Order, 'id' | 'createdAt' | 'updatedAt'>): Promise<Order> => {
    try {
      setIsLoading(true);
      setError(null);
      
      const newOrder: Order = {
        ...orderData,
        id: `order_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      
      // Simular chamada à API
      // const response = await apiService.orders.createOrder(newOrder);
      // const createdOrder = response.data;
      
      setOrders(prev => [newOrder, ...prev]);
      return newOrder;
    } catch (err: any) {
      setError(err.message || 'Erro ao criar pedido');
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  // Atualizar pedido
  const updateOrder = async (id: string, updates: Partial<Order>) => {
    try {
      setIsLoading(true);
      setError(null);
      
      // Verificar se apiService está disponível
      if (apiService?.pedidos?.atualizarStatus) {
        await apiService.pedidos.atualizarStatus(id, updates.status || '');
      }
      
      setOrders(prev => 
        prev.map(order => 
          order.id === id 
            ? { ...order, ...updates, updatedAt: new Date() }
            : order
        )
      );
      
      // Atualizar pedido selecionado se for o mesmo
      if (selectedOrder?.id === id) {
        setSelectedOrder(prev => prev ? { ...prev, ...updates, updatedAt: new Date() } : null);
      }
    } catch (err: any) {
      setError(err.message || 'Erro ao atualizar pedido');
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  // Deletar pedido
  const deleteOrder = async (id: string) => {
    try {
      setIsLoading(true);
      setError(null);
      
      // Simular chamada à API
      // await apiService.orders.deleteOrder(id);
      
      setOrders(prev => prev.filter(order => order.id !== id));
      
      // Limpar seleção se for o pedido selecionado
      if (selectedOrder?.id === id) {
        setSelectedOrder(null);
      }
    } catch (err: any) {
      setError(err.message || 'Erro ao deletar pedido');
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  // Atualizar status do pedido
  const updateOrderStatus = async (id: string, status: OrderStatus) => {
    await updateOrder(id, { status });
  };

  // Selecionar pedido
  const selectOrder = (order: Order | null) => {
    setSelectedOrder(order);
  };

  // Atualizar filtros
  const updateFilters = (newFilters: Partial<OrderFilters>) => {
    setFilters(prev => ({ ...prev, ...newFilters }));
    setPagination(prev => ({ ...prev, page: 1 })); // Reset para primeira página
  };

  // Limpar filtros
  const clearFilters = () => {
    setFilters({});
    setPagination(prev => ({ ...prev, page: 1 }));
  };

  // Definir página
  const setPage = (page: number) => {
    setPagination(prev => ({ ...prev, page }));
  };

  // Definir tamanho da página
  const setPageSize = (pageSize: number) => {
    setPagination(prev => ({ 
      ...prev, 
      pageSize, 
      page: 1,
      totalPages: Math.ceil(prev.total / pageSize),
    }));
  };

  // Utilitários
  const getOrderById = (id: string) => orders.find(order => order.id === id);
  
  const getOrdersByStatus = (status: OrderStatus) => 
    orders.filter(order => order.status === status);
  
  const getOrdersByPatient = (patientId: string) => 
    orders.filter(order => order.patientId === patientId);
  
  const getTotalOrders = () => orders.length;
  
  const getTotalValue = () => 
    orders.reduce((total, order) => total + order.total, 0);
  
  const getPendingOrders = () => 
    orders.filter(order => order.status === ORDER_STATUS.PENDING);
  
  const getDeliveredOrders = () => 
    orders.filter(order => order.status === ORDER_STATUS.DELIVERED);

  // Carregar pedidos na inicialização
  useEffect(() => {
    loadOrders();
  }, []);

  const value: OrderContextType = {
    orders,
    filteredOrders,
    selectedOrder,
    isLoading,
    error,
    filters,
    pagination,
    loadOrders,
    loadOrder,
    createOrder,
    updateOrder,
    deleteOrder,
    updateOrderStatus,
    selectOrder,
    updateFilters,
    clearFilters,
    setPage,
    setPageSize,
    getOrderById,
    getOrdersByStatus,
    getOrdersByPatient,
    getTotalOrders,
    getTotalValue,
    getPendingOrders,
    getDeliveredOrders,
  };

  return (
    <OrderContext.Provider value={value}>
      {children}
    </OrderContext.Provider>
  );
};

// Hook personalizado
export const useOrders = (): OrderContextType => {
  const context = useContext(OrderContext);
  if (context === undefined) {
    throw new Error('useOrders deve ser usado dentro de um OrderProvider');
  }
  return context;
};
