import { API_ENDPOINTS } from '../config/api';

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

// Get user's wishlist
export const getWishlist = async () => {
  try {
    const response = await fetchWithAuth(`${API_ENDPOINTS.AUTH.ME}/wishlist`);
    return response;
  } catch (error) {
    console.error('Get wishlist error:', error);
    throw error;
  }
};

// Add to wishlist
export const addToWishlist = async (productId) => {
  try {
    const response = await fetchWithAuth(`${API_ENDPOINTS.AUTH.ME}/wishlist/${productId}`, {
      method: 'POST',
    });
    return response;
  } catch (error) {
    console.error('Add to wishlist error:', error);
    throw error;
  }
};

// Remove from wishlist
export const removeFromWishlist = async (productId) => {
  try {
    const response = await fetchWithAuth(`${API_ENDPOINTS.AUTH.ME}/wishlist/${productId}`, {
      method: 'DELETE',
    });
    return response;
  } catch (error) {
    console.error('Remove from wishlist error:', error);
    throw error;
  }
};