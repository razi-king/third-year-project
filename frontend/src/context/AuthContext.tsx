import React, { createContext, useContext, useState, useEffect } from 'react';
import authService, { AuthResponse } from '../services/authService';

export type UserRole = 'CUSTOMER' | 'VENDOR' | 'ADMIN';

export interface User {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  avatar?: string;
}

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string, role: UserRole) => Promise<boolean>;
  register: (email: string, password: string, name: string, role: UserRole, storeName?: string) => Promise<boolean>;
  logout: () => void;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Check for saved user on app start
  useEffect(() => {
    const checkAuth = async () => {
      const savedUser = localStorage.getItem('vendorhub_user');
      const token = localStorage.getItem('vendorhub_token');
      
      if (savedUser && token) {
        try {
          const profile = await authService.getProfile();
          setUser(profile);
        } catch (error) {
          console.error("Token invalid or expired", error);
          setUser(null);
          localStorage.removeItem('vendorhub_user');
          localStorage.removeItem('vendorhub_token');
          localStorage.removeItem('vendorhub_role');
          localStorage.removeItem('vendorhub_userId');
        }
      }
      setIsLoading(false);
    };
    checkAuth();
  }, []);

  // Real login function
  const login = async (email: string, password: string, role: UserRole): Promise<boolean> => {
    setIsLoading(true);
    try {
      const response = await authService.login({ email, password, role });
      setUser(response.user);
      localStorage.setItem('vendorhub_token', response.token);
      localStorage.setItem('vendorhub_userId', response.userId);
      localStorage.setItem('vendorhub_role', response.role);
      localStorage.setItem('vendorhub_user', JSON.stringify(response.user));
      return true;
    } catch (error) {
      console.error('Login failed', error);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  // Real register function
  const register = async (email: string, password: string, name: string, role: UserRole, storeName?: string): Promise<boolean> => {
    setIsLoading(true);
    try {
      const response = await authService.register({ email, password, name, role, storeName });
      setUser(response.user);
      localStorage.setItem('vendorhub_token', response.token);
      localStorage.setItem('vendorhub_userId', response.userId);
      localStorage.setItem('vendorhub_role', response.role);
      localStorage.setItem('vendorhub_user', JSON.stringify(response.user));
      return true;
    } catch (error) {
      console.error('Registration failed', error);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    try {
      await authService.logout();
    } catch (error) {
      console.error('Logout failed', error);
    } finally {
      setUser(null);
      localStorage.removeItem('vendorhub_user');
      localStorage.removeItem('vendorhub_token');
      localStorage.removeItem('vendorhub_role');
      localStorage.removeItem('vendorhub_userId');
    }
  };

  return (
    <AuthContext.Provider value={{ user, login, register, logout, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};