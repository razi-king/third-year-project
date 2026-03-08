import api from './api';

export interface CartItem {
  productId: string;
  productName: string;
  price: number;
  quantity: number;
  imageUrl?: string;
}

export interface Cart {
  items: CartItem[];
  totalAmount: number;
}

const cartService = {
  getCart: async (): Promise<Cart> => {
    const response = await api.get<Cart>('/api/cart');
    return response.data;
  },

  addItem: async (productId: string, quantity: number): Promise<Cart> => {
    const response = await api.post<Cart>('/api/cart/items', { productId, quantity });
    return response.data;
  },

  updateQuantity: async (productId: string, quantity: number): Promise<Cart> => {
    const response = await api.patch<Cart>(`/api/cart/items/${productId}`, { quantity });
    return response.data;
  },

  removeItem: async (productId: string): Promise<Cart> => {
    const response = await api.delete<Cart>(`/api/cart/items/${productId}`);
    return response.data;
  },

  clearCart: async (): Promise<void> => {
    await api.delete('/api/cart');
  },
};

export default cartService;
