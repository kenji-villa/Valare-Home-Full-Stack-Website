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

// Get all orders
export const getOrders = async (filters = {}) => {
  try {
    const queryParams = new URLSearchParams();
    if (filters.status) queryParams.append('status', filters.status);
    if (filters.limit) queryParams.append('limit', filters.limit);
    if (filters.page) queryParams.append('page', filters.page);
    
    const url = queryParams.toString() 
      ? `${API_BASE_URL}/orders?${queryParams}`
      : `${API_BASE_URL}/orders`;
    
    return await fetchWithAuth(url, { method: 'GET' });
  } catch (error) {
    console.error('Get orders error:', error);
    throw error;
  }
};

// Get single order
export const getOrderById = async (id) => {
  try {
    return await fetchWithAuth(`${API_BASE_URL}/orders/${id}`, { method: 'GET' });
  } catch (error) {
    console.error('Get order error:', error);
    throw error;
  }
};

// Create order
export const createOrder = async (orderData) => {
  try {
    return await fetchWithAuth(`${API_BASE_URL}/orders`, {
      method: 'POST',
      body: JSON.stringify(orderData),
    });
  } catch (error) {
    console.error('Create order error:', error);
    throw error;
  }
};

// Update order status (admin only)
export const updateOrderStatus = async (id, status) => {
  try {
    return await fetchWithAuth(`${API_BASE_URL}/orders/${id}/status`, {
      method: 'PUT',
      body: JSON.stringify({ status }),
    });
  } catch (error) {
    console.error('Update order status error:', error);
    throw error;
  }
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