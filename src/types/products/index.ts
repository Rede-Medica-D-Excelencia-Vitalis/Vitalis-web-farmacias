/**
 * Tipos de Produtos
 * 
 * Esta pasta contém todos os tipos relacionados aos produtos,
 * categorias, estoque e operações de produtos.
 */

export interface Product {
  id: string;
  name: string;
  description: string;
  shortDescription?: string;
  price: number;
  costPrice?: number;
  stock: number;
  minStock: number;
  maxStock?: number;
  images: ProductImage[];
  category: ProductCategory;
  brand?: string;
  barcode?: string;
  sku: string;
  weight?: number;
  dimensions?: ProductDimensions;
  active: boolean;
  requiresPrescription: boolean;
  prescriptionType?: PrescriptionType;
  tags: string[];
  createdAt: string;
  updatedAt: string;
}

export interface ProductImage {
  id: string;
  url: string;
  alt: string;
  isPrimary: boolean;
  order: number;
}

export interface ProductCategory {
  id: string;
  name: string;
  description?: string;
  parentId?: string;
  parent?: ProductCategory;
  children?: ProductCategory[];
  icon?: string;
  color?: string;
  active: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface ProductDimensions {
  length: number;
  width: number;
  height: number;
  unit: 'cm' | 'mm' | 'm';
}

export type PrescriptionType = 
  | 'none'           // Não requer receita
  | 'white'          // Receita branca
  | 'blue'           // Receita azul
  | 'yellow'         // Receita amarela
  | 'red';           // Receita vermelha

export interface ProductCreateRequest {
  name: string;
  description: string;
  shortDescription?: string;
  price: number;
  costPrice?: number;
  stock: number;
  minStock: number;
  maxStock?: number;
  categoryId: string;
  brand?: string;
  barcode?: string;
  sku: string;
  weight?: number;
  dimensions?: ProductDimensions;
  requiresPrescription: boolean;
  prescriptionType?: PrescriptionType;
  tags?: string[];
  images?: ProductImageCreateRequest[];
}

export interface ProductImageCreateRequest {
  url: string;
  alt: string;
  isPrimary?: boolean;
  order?: number;
}

export interface ProductUpdateRequest {
  name?: string;
  description?: string;
  shortDescription?: string;
  price?: number;
  costPrice?: number;
  stock?: number;
  minStock?: number;
  maxStock?: number;
  categoryId?: string;
  brand?: string;
  barcode?: string;
  sku?: string;
  weight?: number;
  dimensions?: ProductDimensions;
  active?: boolean;
  requiresPrescription?: boolean;
  prescriptionType?: PrescriptionType;
  tags?: string[];
}

export interface ProductFilters {
  categoryId?: string;
  brand?: string;
  minPrice?: number;
  maxPrice?: number;
  inStock?: boolean;
  lowStock?: boolean;
  requiresPrescription?: boolean;
  active?: boolean;
  search?: string;
  tags?: string[];
}

export interface ProductListResponse {
  products: Product[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface ProductStats {
  total: number;
  active: number;
  inactive: number;
  lowStock: number;
  outOfStock: number;
  totalValue: number;
  averagePrice: number;
  categories: number;
  brands: number;
}

export interface StockMovement {
  id: string;
  productId: string;
  product: Product;
  type: StockMovementType;
  quantity: number;
  previousStock: number;
  newStock: number;
  reason: string;
  reference?: string; // ID do pedido, compra, etc.
  createdBy: string;
  createdAt: string;
}

export type StockMovementType = 
  | 'in'        // Entrada
  | 'out'       // Saída
  | 'adjustment' // Ajuste
  | 'transfer'  // Transferência
  | 'loss'      // Perda
  | 'return';   // Devolução

export interface CategoryCreateRequest {
  name: string;
  description?: string;
  parentId?: string;
  icon?: string;
  color?: string;
}

export interface CategoryUpdateRequest {
  name?: string;
  description?: string;
  parentId?: string;
  icon?: string;
  color?: string;
  active?: boolean;
}

