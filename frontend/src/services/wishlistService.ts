import api from './api';

export interface WishlistItem {
  id: string;
  productId: string;
  productName: string;
  price: number;
  imageUrl?: string;
  createdAt?: string;
}

const wishlistService = {
  getWishlist: async () => {
    try {
      const response = await api.get('/api/wishlist');
      return response.data;
    } catch (error: any) {
      if (error.response && error.response.status === 404) {
        return [];
      }
      throw error;
    }
  },
  addToWishlist: async (productId: string) => {
    const response = await api.post(`/api/wishlist/${productId}`);
    return response.data;
  },
  removeFromWishlist: async (productId: string) => {
    const response = await api.delete(`/api/wishlist/${productId}`);
    return response.data;
  }
};

export default wishlistService;
