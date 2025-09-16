/**
 * Contexto de Produtos
 * 
 * Gerencia o estado global dos produtos da aplicação,
 * incluindo lista de produtos, filtros, paginação e ações.
 */

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { PRODUCT_STATUS, PRODUCT_CATEGORIES } from '@/config/constants';
import { apiService } from '@/lib/api';

// Tipos
export type ProductStatus = typeof PRODUCT_STATUS[keyof typeof PRODUCT_STATUS];
export type ProductCategory = typeof PRODUCT_CATEGORIES[keyof typeof PRODUCT_CATEGORIES];

// Interface do produto
export interface Product {
  id: string;
  name: string;
  description: string;
  category: ProductCategory;
  status: ProductStatus;
  price: number;
  costPrice: number;
  stock: number;
  minStock: number;
  maxStock: number;
  barcode?: string;
  sku: string;
  manufacturer: string;
  prescriptionRequired: boolean;
  imageUrl?: string;
  createdAt: Date;
  updatedAt: Date;
  tags?: string[];
  activeIngredients?: string[];
  dosageForm?: string;
  strength?: string;
  packageSize?: string;
  expirationDate?: Date;
  supplier?: {
    name: string;
    contact: string;
    email: string;
  };
}

// Filtros de produto
export interface ProductFilters {
  status?: ProductStatus;
  category?: ProductCategory;
  name?: string;
  manufacturer?: string;
  prescriptionRequired?: boolean;
  inStock?: boolean;
  lowStock?: boolean;
  outOfStock?: boolean;
  priceRange?: {
    min: number;
    max: number;
  };
  tags?: string[];
}

// Interface do contexto
interface ProductContextType {
  // Estado
  products: Product[];
  filteredProducts: Product[];
  selectedProduct: Product | null;
  isLoading: boolean;
  error: string | null;
  
  // Filtros e paginação
  filters: ProductFilters;
  pagination: {
    page: number;
    pageSize: number;
    total: number;
    totalPages: number;
  };
  
  // Ações
  loadProducts: () => Promise<void>;
  loadProduct: (id: string) => Promise<void>;
  createProduct: (product: Omit<Product, 'id' | 'createdAt' | 'updatedAt'>) => Promise<Product>;
  updateProduct: (id: string, updates: Partial<Product>) => Promise<void>;
  deleteProduct: (id: string) => Promise<void>;
  updateProductStatus: (id: string, status: ProductStatus) => Promise<void>;
  updateStock: (id: string, quantity: number) => Promise<void>;
  
  // Seleção
  selectProduct: (product: Product | null) => void;
  
  // Filtros
  updateFilters: (filters: Partial<ProductFilters>) => void;
  clearFilters: () => void;
  
  // Paginação
  setPage: (page: number) => void;
  setPageSize: (pageSize: number) => void;
  
  // Utilitários
  getProductById: (id: string) => Product | undefined;
  getProductsByStatus: (status: ProductStatus) => Product[];
  getProductsByCategory: (category: ProductCategory) => Product[];
  getProductsByManufacturer: (manufacturer: string) => Product[];
  getTotalProducts: () => number;
  getAvailableProducts: () => Product[];
  getOutOfStockProducts: () => Product[];
  getLowStockProducts: () => Product[];
  searchProducts: (query: string) => Product[];
  getProductsByTag: (tag: string) => Product[];
  getPrescriptionProducts: () => Product[];
  getOverTheCounterProducts: () => Product[];
}

// Contexto
const ProductContext = createContext<ProductContextType | undefined>(undefined);

// Provider
interface ProductProviderProps {
  children: ReactNode;
}

export const ProductProvider: React.FC<ProductProviderProps> = ({ children }) => {
  const [products, setProducts] = useState<Product[]>([]);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const [filters, setFilters] = useState<ProductFilters>({});
  const [pagination, setPagination] = useState({
    page: 1,
    pageSize: 20,
    total: 0,
    totalPages: 0,
  });

  // Computed values
  const filteredProducts = React.useMemo(() => {
    let filtered = [...products];

    // Aplicar filtros
    if (filters.status) {
      filtered = filtered.filter(product => product.status === filters.status);
    }

    if (filters.category) {
      filtered = filtered.filter(product => product.category === filters.category);
    }

    if (filters.name) {
      filtered = filtered.filter(product => 
        product.name.toLowerCase().includes(filters.name!.toLowerCase())
      );
    }

    if (filters.manufacturer) {
      filtered = filtered.filter(product => 
        product.manufacturer.toLowerCase().includes(filters.manufacturer!.toLowerCase())
      );
    }

    if (filters.prescriptionRequired !== undefined) {
      filtered = filtered.filter(product => 
        product.prescriptionRequired === filters.prescriptionRequired
      );
    }

    if (filters.inStock !== undefined) {
      filtered = filtered.filter(product => 
        filters.inStock ? product.stock > 0 : product.stock === 0
      );
    }

    if (filters.lowStock !== undefined) {
      filtered = filtered.filter(product => 
        filters.lowStock ? product.stock <= product.minStock && product.stock > 0 : product.stock > product.minStock
      );
    }

    if (filters.outOfStock !== undefined) {
      filtered = filtered.filter(product => 
        filters.outOfStock ? product.stock === 0 : product.stock > 0
      );
    }

    if (filters.priceRange) {
      filtered = filtered.filter(product => 
        product.price >= filters.priceRange!.min && product.price <= filters.priceRange!.max
      );
    }

    if (filters.tags && filters.tags.length > 0) {
      filtered = filtered.filter(product => 
        product.tags?.some(tag => filters.tags!.includes(tag))
      );
    }

    return filtered;
  }, [products, filters]);

  // Carregar produtos
  const loadProducts = async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      // Verificar se apiService está disponível
      if (apiService?.produtos?.listar) {
        const response = await apiService.produtos.listar();
        setProducts(response);
        setPagination(prev => ({
          ...prev,
          total: response.length,
          totalPages: Math.ceil(response.length / prev.pageSize),
        }));
      } else {
        // Fallback para dados mock se apiService não estiver disponível
        const mockProducts: Product[] = [
          {
            id: '1',
            name: 'Paracetamol 500mg',
            description: 'Analgésico e antitérmico',
            category: PRODUCT_CATEGORIES.MEDICINE,
            status: PRODUCT_STATUS.AVAILABLE,
            price: 5.50,
            costPrice: 3.50,
            stock: 100,
            minStock: 20,
            maxStock: 200,
            sku: 'PARA500',
            manufacturer: 'Laboratório ABC',
            prescriptionRequired: false,
            tags: ['analgésico', 'antitérmico'],
            activeIngredients: ['Paracetamol'],
            dosageForm: 'Comprimido',
            strength: '500mg',
            packageSize: '20 comprimidos',
            createdAt: new Date(),
            updatedAt: new Date(),
          }
        ];
        
        setProducts(mockProducts);
        setPagination(prev => ({
          ...prev,
          total: mockProducts.length,
          totalPages: Math.ceil(mockProducts.length / prev.pageSize),
        }));
      }
    } catch (err: any) {
      setError(err.message || 'Erro ao carregar produtos');
    } finally {
      setIsLoading(false);
    }
  };

  // Carregar produto específico
  const loadProduct = async (id: string) => {
    try {
      setIsLoading(true);
      setError(null);
      
      const product = products.find(p => p.id === id);
      if (product) {
        setSelectedProduct(product);
      } else {
        setError('Produto não encontrado');
      }
    } catch (err: any) {
      setError(err.message || 'Erro ao carregar produto');
    } finally {
      setIsLoading(false);
    }
  };

  // Criar produto
  const createProduct = async (productData: Omit<Product, 'id' | 'createdAt' | 'updatedAt'>): Promise<Product> => {
    try {
      setIsLoading(true);
      setError(null);
      
      let newProduct: Product;
      
      if (apiService?.produtos?.criar) {
        const response = await apiService.produtos.criar(productData);
        newProduct = response;
      } else {
        // Fallback para criação local
        newProduct = {
          ...productData,
          id: `product_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
          createdAt: new Date(),
          updatedAt: new Date(),
        };
      }
      
      setProducts(prev => [newProduct, ...prev]);
      return newProduct;
    } catch (err: any) {
      setError(err.message || 'Erro ao criar produto');
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  // Atualizar produto
  const updateProduct = async (id: string, updates: Partial<Product>) => {
    try {
      setIsLoading(true);
      setError(null);
      
      if (apiService?.produtos?.atualizar) {
        await apiService.produtos.atualizar(id, updates);
      }
      
      setProducts(prev => 
        prev.map(product => 
          product.id === id 
            ? { ...product, ...updates, updatedAt: new Date() }
            : product
        )
      );
      
      if (selectedProduct?.id === id) {
        setSelectedProduct(prev => prev ? { ...prev, ...updates, updatedAt: new Date() } : null);
      }
    } catch (err: any) {
      setError(err.message || 'Erro ao atualizar produto');
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  // Deletar produto
  const deleteProduct = async (id: string) => {
    try {
      setIsLoading(true);
      setError(null);
      
      if (apiService?.produtos?.deletar) {
        await apiService.produtos.deletar(id);
      }
      
      setProducts(prev => prev.filter(product => product.id !== id));
      
      if (selectedProduct?.id === id) {
        setSelectedProduct(null);
      }
    } catch (err: any) {
      setError(err.message || 'Erro ao deletar produto');
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  // Atualizar status do produto
  const updateProductStatus = async (id: string, status: ProductStatus) => {
    await updateProduct(id, { status });
  };

  // Atualizar estoque
  const updateStock = async (id: string, quantity: number) => {
    const product = products.find(p => p.id === id);
    if (product) {
      const newStock = Math.max(0, product.stock + quantity);
      await updateProduct(id, { stock: newStock });
    }
  };

  // Selecionar produto
  const selectProduct = (product: Product | null) => {
    setSelectedProduct(product);
  };

  // Atualizar filtros
  const updateFilters = (newFilters: Partial<ProductFilters>) => {
    setFilters(prev => ({ ...prev, ...newFilters }));
    setPagination(prev => ({ ...prev, page: 1 }));
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
  const getProductById = (id: string) => products.find(product => product.id === id);
  
  const getProductsByStatus = (status: ProductStatus) => 
    products.filter(product => product.status === status);
  
  const getProductsByCategory = (category: ProductCategory) => 
    products.filter(product => product.category === category);
  
  const getProductsByManufacturer = (manufacturer: string) => 
    products.filter(product => 
      product.manufacturer.toLowerCase().includes(manufacturer.toLowerCase())
    );
  
  const getTotalProducts = () => products.length;
  
  const getAvailableProducts = () => 
    products.filter(product => product.status === PRODUCT_STATUS.AVAILABLE);
  
  const getOutOfStockProducts = () => 
    products.filter(product => product.stock === 0);
  
  const getLowStockProducts = () => 
    products.filter(product => product.stock <= product.minStock && product.stock > 0);
  
  const searchProducts = (query: string) => {
    const lowerQuery = query.toLowerCase();
    return products.filter(product => 
      product.name.toLowerCase().includes(lowerQuery) ||
      product.description.toLowerCase().includes(lowerQuery) ||
      product.sku.toLowerCase().includes(lowerQuery) ||
      product.barcode?.includes(query)
    );
  };
  
  const getProductsByTag = (tag: string) => 
    products.filter(product => product.tags?.includes(tag));
  
  const getPrescriptionProducts = () => 
    products.filter(product => product.prescriptionRequired);
  
  const getOverTheCounterProducts = () => 
    products.filter(product => !product.prescriptionRequired);

  // Carregar produtos na inicialização
  useEffect(() => {
    loadProducts();
  }, []);

  const value: ProductContextType = {
    products,
    filteredProducts,
    selectedProduct,
    isLoading,
    error,
    filters,
    pagination,
    loadProducts,
    loadProduct,
    createProduct,
    updateProduct,
    deleteProduct,
    updateProductStatus,
    updateStock,
    selectProduct,
    updateFilters,
    clearFilters,
    setPage,
    setPageSize,
    getProductById,
    getProductsByStatus,
    getProductsByCategory,
    getProductsByManufacturer,
    getTotalProducts,
    getAvailableProducts,
    getOutOfStockProducts,
    getLowStockProducts,
    searchProducts,
    getProductsByTag,
    getPrescriptionProducts,
    getOverTheCounterProducts,
  };

  return (
    <ProductContext.Provider value={value}>
      {children}
    </ProductContext.Provider>
  );
};

// Hook personalizado
export const useProducts = (): ProductContextType => {
  const context = useContext(ProductContext);
  if (context === undefined) {
    throw new Error('useProducts deve ser usado dentro de um ProductProvider');
  }
  return context;
};
