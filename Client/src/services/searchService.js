import { getProducts } from './productService';

// Search products by query
export const searchProducts = async (query, filters = {}) => {
  try {
    const response = await getProducts({ 
      search: query,
      ...filters 
    });
    
    if (response.success) {
      return {
        success: true,
        products: response.products,
        total: response.pagination?.total || response.products.length
      };
    }
    
    return { success: false, products: [], total: 0 };
  } catch (error) {
    console.error('Search error:', error);
    return { success: false, products: [], total: 0 };
  }
};

// Get search suggestions based on partial query
export const getSearchSuggestions = async (query) => {
  if (!query || query.length < 2) return [];
  
  try {
    const response = await getProducts({ search: query, limit: 5 });
    if (response.success) {
      return response.products.map(p => ({
        id: p._id,
        name: p.name,
        category: p.category,
        price: p.price,
        image: p.coverImage || p.images?.[0]
      }));
    }
    return [];
  } catch (error) {
    console.error('Suggestion error:', error);
    return [];
  }
};