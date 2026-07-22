// src/services/authService.js
const API_BASE_URL = 'http://localhost:3001/api';

// Helper to get auth token
const getAuthToken = () => localStorage.getItem('authToken');

// Helper for fetch with auth
const fetchWithAuth = async (url, options = {}) => {
  try {
    const token = getAuthToken();
    const headers = {
      'Content-Type': 'application/json',
      ...(token && { 'Authorization': `Bearer ${token}` }),
      ...options.headers,
    };

    const response = await fetch(url, {
      ...options,
      headers,
    });

    let data;
    try {
      data = await response.json();
    } catch (e) {
      const text = await response.text();
      data = { success: false, message: text || 'Server error' };
    }
    
    if (!response.ok) {
      throw new Error(data.message || `HTTP error! status: ${response.status}`);
    }
    
    return data;
  } catch (error) {
    console.error('fetchWithAuth error:', error);
    throw error;
  }
};

// Auth functions
export const register = async (userData) => {
  return fetchWithAuth(`${API_BASE_URL}/auth/register`, {
    method: 'POST',
    body: JSON.stringify(userData),
  });
};

export const login = async (credentials) => {
  return fetchWithAuth(`${API_BASE_URL}/auth/login`, {
    method: 'POST',
    body: JSON.stringify(credentials),
  });
};

export const getCurrentUser = async () => {
  return fetchWithAuth(`${API_BASE_URL}/auth/me`, {
    method: 'GET',
  });
};

// Wishlist functions
export const addToWishlist = async (productId) => {
  try {
    if (!productId) {
      throw new Error('Product ID is required');
    }
    return await fetchWithAuth(`${API_BASE_URL}/auth/wishlist/add`, {
      method: 'POST',
      body: JSON.stringify({ productId }),
    });
  } catch (error) {
    console.error('Add to wishlist error:', error);
    throw error;
  }
};

export const removeFromWishlist = async (productId) => {
  try {
    if (!productId) {
      throw new Error('Product ID is required');
    }
    return await fetchWithAuth(`${API_BASE_URL}/auth/wishlist/remove`, {
      method: 'DELETE',
      body: JSON.stringify({ productId }),
    });
  } catch (error) {
    console.error('Remove from wishlist error:', error);
    throw error;
  }
};

export const toggleWishlist = async (productId) => {
  try {
    if (!productId) {
      throw new Error('Product ID is required');
    }
    return await fetchWithAuth(`${API_BASE_URL}/auth/wishlist/toggle`, {
      method: 'POST',
      body: JSON.stringify({ productId }),
    });
  } catch (error) {
    console.error('Toggle wishlist error:', error);
    throw error;
  }
};

export const getWishlist = async () => {
  try {
    return await fetchWithAuth(`${API_BASE_URL}/auth/wishlist`, {
      method: 'GET',
    });
  } catch (error) {
    console.error('Get wishlist error:', error);
    throw error;
  }
};