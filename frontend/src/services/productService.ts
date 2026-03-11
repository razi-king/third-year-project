import api from './api';

export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  stock: number;
  category: string;
  imageUrl?: string;
  vendorId?: string;
  vendorName?: string;
  status: 'ACTIVE' | 'INACTIVE' | 'active' | 'inactive' | 'out_of_stock';
  rating?: number;
  reviews?: number;
  isWishlisted?: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface ProductFilters {
  category?: string;
  search?: string;
  minPrice?: number;
  maxPrice?: number;
  status?: string;
  page?: number;
  size?: number;
}

export interface PageResponse<T> {
  content: T[];
  totalElements: number;
  totalPages: number;
  page: number;
  size: number;
}

const productService = {
  getAll: async (filters?: ProductFilters): Promise<PageResponse<Product>> => {
    const response = await api.get<PageResponse<Product>>('/api/products', { params: filters });
    return response.data;
  },

  getById: async (id: string): Promise<Product> => {
    const response = await api.get<Product>(`/api/products/${id}`);
    return response.data;
  },

  create: async (product: Omit<Product, 'id' | 'createdAt' | 'updatedAt'>): Promise<Product> => {
    const response = await api.post<Product>('/api/products', product);
    return response.data;
  },

  update: async (id: string, product: Partial<Product>): Promise<Product> => {
    const response = await api.put<Product>(`/api/products/${id}`, product);
    return response.data;
  },

  delete: async (id: string): Promise<void> => {
    await api.delete(`/api/products/${id}`);
  },

  getByVendor: async (vendorId: string, filters?: ProductFilters): Promise<PageResponse<Product>> => {
    const response = await api.get<PageResponse<Product>>(`/api/vendors/${vendorId}/products`, { params: filters });
    return response.data;
  },

  createByVendor: async (product: Omit<Product, 'id' | 'createdAt' | 'updatedAt' | 'vendorId'>): Promise<Product> => {
    const response = await api.post<Product>('/api/vendor/products', product);
    return response.data;
  },
};

export default productService;
