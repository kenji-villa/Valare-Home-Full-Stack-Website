// src/services/orderService.js
const API_BASE_URL = 'http://localhost:3001/api';

// Helper to get auth token
const getAuthToken = () => localStorage.getItem('authToken');

// Helper for fetch with auth
const fetchWithAuth = async (url, options = {}) => {
  try {
    const token = getAuthToken();
    const headers = {
      'Content-Type': 'application/json',
      'Cache-Control': 'no-cache',
      'Pragma': 'no-cache',
      ...(token && { 'Authorization': `Bearer ${token}` }),
      ...options.headers,
    };

    const response = await fetch(url, { 
      ...options, 
      headers,
      cache: 'no-store', // ✅ Prevent browser caching
    });
    
    let data;
    try {
      data = await response.json();
    } catch (e) {
      data = { success: false, message: 'Server error' };
    }
    
    if (!response.ok) {
      throw new Error(data.message || `HTTP error! status: ${response.status}`);
    }
    return data;
  } catch (error) {
    console.error('API error:', error);
    throw error;
  }
};


export const createOrder = async (orderData) => {
  return fetchWithAuth(`${API_BASE_URL}/orders`, {
    method: 'POST',
    body: JSON.stringify(orderData),
  });
};

export const getMyOrders = async () => {
  return fetchWithAuth(`${API_BASE_URL}/orders/my-orders`, {
    method: 'GET',
  });
};

export const getOrderById = async (id) => {
  return fetchWithAuth(`${API_BASE_URL}/orders/${id}`, {
    method: 'GET',
  });
};

export const cancelOrder = async (id) => {
  return fetchWithAuth(`${API_BASE_URL}/orders/${id}/cancel`, {
    method: 'PUT',
  });
};


// Admin
export const getAllOrders = async (filters = {}) => {
  const params = new URLSearchParams(filters);
  return fetchWithAuth(`${API_BASE_URL}/orders?${params}`, {
    method: 'GET',
  });
};

// Update order status (admin only)
export const updateOrderStatus = async (id, status, note = '') => {
  return fetchWithAuth(`${API_BASE_URL}/orders/${id}/status`, {
    method: 'PUT',
    body: JSON.stringify({ status, note }),
  });
};
export const getOrderStats = async () => {
  return fetchWithAuth(`${API_BASE_URL}/orders/stats`, {
    method: 'GET',
  });
};

// Delete order (admin only)
export const deleteOrder = async (id) => {
  try {
    return await fetchWithAuth(`${API_BASE_URL}/orders/${id}`, {
      method: 'DELETE',
    });
  } catch (error) {
    console.error('Delete order error:', error);
    throw error;
  }
};