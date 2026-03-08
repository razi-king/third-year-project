import api from './api';

export interface DashboardStats {
  totalRevenue: number;
  totalOrders: number;
  totalProducts: number;
  totalCustomers: number;
  revenueChange: number;
  ordersChange: number;
}

export interface SalesData {
  date: string;
  revenue: number;
  orders: number;
}

export interface TopProduct {
  productId: string;
  productName: string;
  totalSold: number;
  revenue: number;
}

const analyticsService = {
  getDashboardStats: async (): Promise<DashboardStats> => {
    const response = await api.get<DashboardStats>('/api/analytics/dashboard');
    return response.data;
  },

  getSalesData: async (period: 'week' | 'month' | 'year'): Promise<SalesData[]> => {
    const response = await api.get<SalesData[]>('/api/analytics/sales', { params: { period } });
    return response.data;
  },

  getTopProducts: async (limit?: number): Promise<TopProduct[]> => {
    const response = await api.get<TopProduct[]>('/api/analytics/top-products', { params: { limit } });
    return response.data;
  },

  // Admin-only
  getAdminStats: async (): Promise<DashboardStats & { totalVendors: number }> => {
    const response = await api.get('/api/admin/analytics/dashboard');
    return response.data;
  },
};

export default analyticsService;
