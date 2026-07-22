// API Base URL
export const API_BASE_URL = 'http://localhost:3001/api';

// API Endpoints
export const API_ENDPOINTS = {
  // Auth
  AUTH: {
    REGISTER: `${API_BASE_URL}/auth/register`,
    LOGIN: `${API_BASE_URL}/auth/login`,
    LOGOUT: `${API_BASE_URL}/auth/logout`,
    ME: `${API_BASE_URL}/auth/me`,
    PROFILE: `${API_BASE_URL}/auth/profile`,
    CHANGE_PASSWORD: `${API_BASE_URL}/auth/change-password`,
    WISHLIST: `${API_BASE_URL}/auth/me/wishlist`,
  },
  // Products
  PRODUCTS: {
    ALL: `${API_BASE_URL}/products`,
    FEATURED: `${API_BASE_URL}/products/featured`,
    SPECIAL: `${API_BASE_URL}/products/special`,
    SINGLE: (id) => `${API_BASE_URL}/products/${id}`,
    RELATED: (id) => `${API_BASE_URL}/products/${id}/related`,
    RATE: (id) => `${API_BASE_URL}/products/${id}/rate`,
  },
  // Orders
  ORDERS: {
    ALL: `${API_BASE_URL}/orders`,
    SINGLE: (id) => `${API_BASE_URL}/orders/${id}`,
  }
};