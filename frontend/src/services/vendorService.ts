import api from './api';
import { Product, ProductFilters, PageResponse } from './productService';
import { OrderDto, OrderFilters } from './orderService';

export const vendorService = {
  getProducts: async (filters?: ProductFilters): Promise<PageResponse<Product>> => {
    const response = await api.get<PageResponse<Product>>('/api/vendor/products', { params: filters });
    return response.data;
  },

  createProduct: async (product: Omit<Product, 'id' | 'createdAt' | 'updatedAt' | 'vendorId'>): Promise<Product> => {
    const response = await api.post<Product>('/api/vendor/products', product);
    return response.data;
  },

  updateProduct: async (id: string, product: Partial<Product>): Promise<Product> => {
    const response = await api.put<Product>(`/api/vendor/products/${id}`, product);
    return response.data;
  },

  deleteProduct: async (id: string): Promise<void> => {
    await api.delete(`/api/vendor/products/${id}`);
  },

  getOrders: async (filters?: OrderFilters): Promise<PageResponse<OrderDto>> => {
    const response = await api.get<PageResponse<OrderDto>>('/api/vendor/orders', { params: filters });
    return response.data;
  },

  getCustomers: async (): Promise<any[]> => {
    const response = await api.get('/api/vendor/customers');
    return response.data;
  },

  getReviews: async (): Promise<any[]> => {
    try {
      const response = await api.get('/api/vendor/reviews');
      return response.data;
    } catch (e: any) {
      if (e.response && e.response.status === 404) {
        return [];
      }
      throw e;
    }
  },

  getStoreProfile: async (): Promise<any> => {
    try {
       const response = await api.get('/api/vendor/profile');
       return response.data;
    } catch (e: any) {
       if (e.response && e.response.status === 404) {
         return {}; // Fallback to avoid breaking profile page
       }
       throw e;
    }
  },

  updateStoreProfile: async (data: any): Promise<any> => {
    const response = await api.put('/api/vendor/profile', data);
    return response.data;
  }
};

export default vendorService;
