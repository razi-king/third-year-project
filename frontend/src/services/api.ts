import axios from 'axios';

// ⚠️ Note: Both Vite and Spring Boot default to port 8080.
// Change this to your Spring Boot port (e.g., 9090) or update Spring Boot's server.port
const API_BASE_URL = import.meta.env?.VITE_API_BASE_URL || 'http://localhost:8080';

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
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('vendorhub_token');
      localStorage.removeItem('vendorhub_user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default api;
