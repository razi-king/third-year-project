import api from './api';

export interface OrderItem {
  productId: string;
  productName: string;
  quantity: number;
  price: number;
}

export interface Order {
  id: string;
  customerId: string;
  customerName: string;
  items: OrderItem[];
  totalAmount: number;
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  shippingAddress: string;
  createdAt: string;
  updatedAt: string;
}

export interface OrderFilters {
  status?: string;
  startDate?: string;
  endDate?: string;
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

const orderService = {
  getAll: async (filters?: OrderFilters): Promise<PageResponse<Order>> => {
    const response = await api.get<PageResponse<Order>>('/api/orders', { params: filters });
    return response.data;
  },

  getById: async (id: string): Promise<Order> => {
    const response = await api.get<Order>(`/api/orders/${id}`);
    return response.data;
  },

  create: async (order: { items: OrderItem[]; shippingAddress: string }): Promise<Order> => {
    const response = await api.post<Order>('/api/orders', order);
    return response.data;
  },

  updateStatus: async (id: string, status: Order['status']): Promise<Order> => {
    const response = await api.patch<Order>(`/api/orders/${id}/status`, { status });
    return response.data;
  },

  cancel: async (id: string): Promise<void> => {
    await api.patch(`/api/orders/${id}/cancel`);
  },

  getByCustomer: async (customerId: string, filters?: OrderFilters): Promise<PageResponse<Order>> => {
    const response = await api.get<PageResponse<Order>>(`/api/customers/${customerId}/orders`, { params: filters });
    return response.data;
  },

  getByVendor: async (vendorId: string, filters?: OrderFilters): Promise<PageResponse<Order>> => {
    const response = await api.get<PageResponse<Order>>(`/api/vendors/${vendorId}/orders`, { params: filters });
    return response.data;
  },
};

export default orderService;
