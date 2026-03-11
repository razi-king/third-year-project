import api from './api';
import { UserRole } from '@/context/AuthContext';

export interface LoginRequest {
  email: string;
  password: string;
  role: UserRole;
}

export interface RegisterRequest {
  email: string;
  password: string;
  name: string;
  role: UserRole;
  storeName?: string;
}

export interface AuthResponse {
  token: string;
  userId: string;
  role: UserRole;
  user: {
    id: string;
    email: string;
    name: string;
    role: UserRole;
    avatar?: string;
  };
}

const authService = {
  login: async (data: LoginRequest): Promise<AuthResponse> => {
    const response = await api.post<AuthResponse>('/api/auth/login', data);
    return response.data;
  },

  register: async (data: RegisterRequest): Promise<AuthResponse> => {
    const response = await api.post<AuthResponse>('/api/auth/register', data);
    return response.data;
  },

  getProfile: async (): Promise<AuthResponse['user']> => {
    const response = await api.get<AuthResponse['user']>('/api/auth/profile');
    return response.data;
  },

  logout: async (): Promise<void> => {
    await api.post('/api/auth/logout');
  },

  updateProfile: async (data: { name: string, email: string }): Promise<AuthResponse['user']> => {
    const response = await api.put<AuthResponse['user']>('/api/auth/profile', data);
    return response.data;
  },

  updatePassword: async (data: { currentPassword: string, newPassword: string }): Promise<void> => {
    await api.put('/api/auth/password', data);
  },

  updateSettings: async (data: any): Promise<void> => {
    await api.put('/api/auth/settings', data);
  }
};

export default authService;
