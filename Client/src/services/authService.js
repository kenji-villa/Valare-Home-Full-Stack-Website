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

// Toggle wishlist (add/remove)
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

// Get user's wishlist
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