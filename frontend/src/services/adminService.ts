import api from './api';

export interface UserDto {
  id: string;
  name: string;
  email: string;
  role: 'CUSTOMER' | 'VENDOR' | 'ADMIN';
  avatar?: string;
  createdAt: string;
}

export interface VendorDto {
  id: string;
  storeName: string;
  storeDescription: string;
  businessRegistrationNumber?: string;
  taxId?: string;
  storeLogo?: string;
  contactPhone?: string;
  businessAddress?: string;
  userId: string;
  name: string;
  email: string;
  role: string;
  userCreatedAt: string;
}

export interface PageResponse<T> {
  content: T[];
  totalElements: number;
  totalPages: number;
  page: number;
  size: number;
}

export const adminService = {
  getAllUsers: async (params?: { role?: string }): Promise<UserDto[]> => {
    const response = await api.get('/api/admin/users', { params });
    return response.data;
  },

  getAllVendors: async (): Promise<VendorDto[]> => {
    const response = await api.get('/api/admin/vendors');
    return response.data;
  },

  updateUserRole: async (userId: string, newRole: string): Promise<UserDto> => {
    const response = await api.patch(`/api/admin/users/${userId}/role`, { role: newRole });
    return response.data;
  },

  getDashboardStats: async (): Promise<{ totalUsers: number, totalVendors: number, totalProducts: number, totalOrders: number, pendingApprovals: number }> => {
    const response = await api.get('/api/admin/dashboard');
    return response.data;
  },

  approveVendor: async (vendorId: string): Promise<VendorDto> => {
    const response = await api.patch(`/api/admin/vendors/${vendorId}/approve`);
    return response.data;
  },

  rejectVendor: async (vendorId: string): Promise<VendorDto> => {
    const response = await api.patch(`/api/admin/vendors/${vendorId}/reject`);
    return response.data;
  },

  getSecurityLogs: async (): Promise<any[]> => {
    const response = await api.get('/api/admin/security/logs');
    return response.data;
  },

  getDisputes: async (): Promise<any[]> => {
    const response = await api.get('/api/admin/disputes');
    return response.data;
  },

  getMessages: async (): Promise<any[]> => {
    const response = await api.get('/api/admin/messages');
    return response.data;
  },

  getSettings: async (): Promise<Record<string, boolean>> => {
    const response = await api.get('/api/admin/settings');
    return response.data;
  },

  updateSettings: async (settings: Record<string, boolean>): Promise<Record<string, boolean>> => {
    const response = await api.put('/api/admin/settings', settings);
    return response.data;
  },

  generateReport: async (type: string): Promise<{ status: string, message: string }> => {
    const response = await api.post('/api/admin/reports/generate', { type });
    return response.data;
  }
};
