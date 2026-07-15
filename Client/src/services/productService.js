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

    // Try to parse JSON response
    let data;
    try {
      data = await response.json();
    } catch (e) {
      // If response is not JSON, create error object
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

// Get all products with filters
export const getProducts = async (filters = {}) => {
  const queryParams = new URLSearchParams();
  
  Object.keys(filters).forEach(key => {
    if (filters[key] !== undefined && filters[key] !== '' && filters[key] !== 'All') {
      queryParams.append(key, filters[key]);
    }
  });
  
  const url = queryParams.toString() 
    ? `${API_ENDPOINTS.PRODUCTS.ALL}?${queryParams}` 
    : API_ENDPOINTS.PRODUCTS.ALL;
  
  const response = await fetch(url);
  return response.json();
};

// Get single product
export const getProductById = async (id) => {
  const response = await fetch(API_ENDPOINTS.PRODUCTS.SINGLE(id));
  return response.json();
};

// Get featured products
export const getFeaturedProducts = async () => {
  const response = await fetch(API_ENDPOINTS.PRODUCTS.FEATURED);
  return response.json();
};

// Get special products
export const getSpecialProducts = async () => {
  const response = await fetch(API_ENDPOINTS.PRODUCTS.SPECIAL);
  return response.json();
};

// Get related products
export const getRelatedProducts = async (id) => {
  const response = await fetch(API_ENDPOINTS.PRODUCTS.RELATED(id));
  return response.json();
};

// Create product (Admin only)
export const createProduct = async (productData) => {
  try {
    const token = getAuthToken();
    const response = await fetch(API_ENDPOINTS.PRODUCTS.ALL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify(productData),
    });
    
    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.message || 'Failed to create product');
    }
    return data;
  } catch (error) {
    console.error('Create product error:', error);
    throw error;
  }
};

// Update product (Admin only)
export const updateProduct = async (id, productData) => {
  if (!id) {
    throw new Error('Product ID is required for update');
  }
  return fetchWithAuth(API_ENDPOINTS.PRODUCTS.SINGLE(id), {
    method: 'PUT',
    body: JSON.stringify(productData),
  });
};

// Delete product (Admin only)
export const deleteProduct = async (id) => {
  if (!id) {
    throw new Error('Product ID is required for deletion');
  }
  
  console.log(`Attempting to delete product with ID: ${id}`);
  
  try {
    const result = await fetchWithAuth(API_ENDPOINTS.PRODUCTS.SINGLE(id), {
      method: 'DELETE',
    });
    console.log('Delete response:', result);
    return result;
  } catch (error) {
    console.error('Delete product service error:', error);
    throw error;
  }
};

// Add product rating
export const addProductRating = async (id, ratingData) => {
  return fetchWithAuth(API_ENDPOINTS.PRODUCTS.RATE(id), {
    method: 'POST',
    body: JSON.stringify(ratingData),
  });
};

// Upload product images
export const uploadProductImages = async (files) => {
  const token = localStorage.getItem('authToken');
  
  if (!token) {
    throw new Error('Authentication required. Please login again.');
  }
  
  const formData = new FormData();
  
  files.forEach(file => {
    formData.append('images', file);
  });
  
  const response = await fetch(`${API_ENDPOINTS.PRODUCTS.ALL}/upload`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
    },
    body: formData,
  });
  
  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.message || 'Upload failed');
  }
  return data;
};