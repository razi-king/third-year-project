import axios from 'axios';
import { toast as exportedToast } from '@/hooks/use-toast';

// ⚠️ Note: Both Vite and Spring Boot default to port 8080.
// Change this to your Spring Boot port (e.g., 9090) or update Spring Boot's server.port
const API_BASE_URL = import.meta.env?.VITE_API_BASE_URL || 'http://localhost:9090';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add JWT token to every request
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('vendorhub_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Handle 401 responses (token expired)
// Handle responses and global errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Determine the error message
    let errorMessage = "An unexpected error occurred. Please try again later.";
    
    if (error.response) {
      // The request was made and the server responded with a status code
      const status = error.response.status;
      const data = error.response.data;
      
      if (data && data.message) {
        errorMessage = data.message;
      } else {
        switch (status) {
          case 400:
            errorMessage = "Invalid request. Please check your data.";
            break;
          case 401:
            errorMessage = "Your session has expired. Please log in again.";
            localStorage.removeItem('vendorhub_token');
            localStorage.removeItem('vendorhub_user');
            window.location.href = '/login';
            break;
          case 403:
            errorMessage = "You don't have permission to perform this action.";
            break;
          case 404:
            errorMessage = "The requested resource was not found.";
            break;
          case 409:
            errorMessage = "A conflict occurred (e.g., this item already exists).";
            break;
          case 500:
            errorMessage = "Server error. We're working on fixing it!";
            break;
          default:
            errorMessage = `Received error code ${status}`;
        }
      }
    } else if (error.request) {
      // The request was made but no response was received
      errorMessage = "No response from server. Check your internet connection.";
    }

    // Determine whether to show the toast (skip showing global toasts for login form validation errors maybe? But global is fine for now)
    if (error.response?.status !== 401) {
      exportedToast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      });
    }

    return Promise.reject(error);
  }
);

export default api;
