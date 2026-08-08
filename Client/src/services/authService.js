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


// ==================== CART ====================

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

// Add to wishlist
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

// Remove from wishlist
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

// Clear entire wishlist 
export const clearWishlist = async () => {
  try {
    return await fetchWithAuth(`${API_BASE_URL}/auth/wishlist/clear`, {
      method: 'DELETE',
    });
  } catch (error) {
    console.error('Clear wishlist error:', error);
    throw error;
  }
};

// Sync local wishlist with server
export const syncWishlist = async (localWishlist) => {
  try {
    const token = getAuthToken();
    if (!token) return null;
    
    return await fetchWithAuth(`${API_BASE_URL}/auth/wishlist/sync`, {
      method: 'POST',
      body: JSON.stringify({ wishlist: localWishlist }),
    });
  } catch (error) {
    console.error('Sync wishlist error:', error);
    throw error;
  }
};

// ==================== CART ====================

// Get user's cart
export const getCart = async () => {
  try {
    return await fetchWithAuth(`${API_BASE_URL}/cart`, {
      method: 'GET',
    });
  } catch (error) {
    console.error('Get cart error:', error);
    throw error;
  }
};

// Add product to cart 
export const addToCartAPI = async (productId, quantity = 1) => {
  try {
    if (!productId) {
      throw new Error('Product ID is required');
    }
    return await fetchWithAuth(`${API_BASE_URL}/cart/add`, {
      method: 'POST',
      body: JSON.stringify({ productId, quantity }),
    });
  } catch (error) {
    console.error('Add to cart error:', error);
    throw error;
  }
};

// Set the exact quantity for a product in the cart
export const updateCartItemAPI = async (productId, quantity) => {
  try {
    if (!productId) {
      throw new Error('Product ID is required');
    }
    return await fetchWithAuth(`${API_BASE_URL}/cart/update`, {
      method: 'PUT',
      body: JSON.stringify({ productId, quantity }),
    });
  } catch (error) {
    console.error('Update cart item error:', error);
    throw error;
  }
};

// Remove a single product from the cart
export const removeFromCartAPI = async (productId) => {
  try {
    if (!productId) {
      throw new Error('Product ID is required');
    }
    return await fetchWithAuth(`${API_BASE_URL}/cart/remove`, {
      method: 'DELETE',
      body: JSON.stringify({ productId }),
    });
  } catch (error) {
    console.error('Remove from cart error:', error);
    throw error;
  }
};

// Clear the entire cart in one atomic request
export const clearCartAPI = async () => {
  try {
    return await fetchWithAuth(`${API_BASE_URL}/cart/clear`, {
      method: 'DELETE',
    });
  } catch (error) {
    console.error('Clear cart error:', error);
    throw error;
  }
};