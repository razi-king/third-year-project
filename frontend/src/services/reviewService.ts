import api from './api';

export interface ReviewDto {
  id: string;
  productId: string;
  productName: string;
  customerId: string;
  customerName: string;
  rating: number;
  comment: string;
  createdAt: string;
}

const reviewService = {
  getCustomerReviews: async () => {
    try {
      const response = await api.get('/api/reviews/customer');
      return response.data;
    } catch (error: any) {
      if (error.response && error.response.status === 404) {
        return [];
      }
      throw error;
    }
  },
  getProductReviews: async (productId: string) => {
    try {
      const response = await api.get(`/api/reviews/product/${productId}`);
      return response.data as ReviewDto[];
    } catch (error: any) {
      if (error.response && error.response.status === 404) {
        return [];
      }
      throw error;
    }
  },
  addReview: async (productId: string, data: { rating: number; comment: string }) => {
    const response = await api.post(`/api/reviews/product/${productId}`, data);
    return response.data;
  }
};

export default reviewService;
