import { createContext, useState, useContext, useEffect } from "react";
import {
  toggleWishlist,
  getWishlist,
  syncWishlist,
} from "../services/authService";

const CartContext = createContext();

export function CartProvider({ children }) {
  const [cartItems, setCartItems] = useState([]);
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(false);

  // Load favorites from localStorage on mount
  useEffect(() => {
    const savedFavorites = localStorage.getItem("favorites");
    if (savedFavorites) {
      try {
        const parsed = JSON.parse(savedFavorites);
        setFavorites(Array.isArray(parsed) ? parsed : []);
        console.log("Loaded favorites from localStorage:", parsed);
      } catch (e) {
        console.error("Error loading favorites:", e);
        setFavorites([]);
      }
    }
  }, []);

  // Save favorites to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem("favorites", JSON.stringify(favorites));
    console.log("Favorites saved to localStorage:", favorites);
  }, [favorites]);

  const addToCart = (product) => {
    setCartItems((prev) => {
      const existing = prev.find((item) => item.id === product.id);
      if (existing) {
        return prev.map((item) =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item,
        );
      }
      return [...prev, { ...product, quantity: 1 }];
    });
  };

  const removeFromCart = (productId) => {
    setCartItems((prev) => prev.filter((item) => item.id !== productId));
  };

  const updateQuantity = (productId, quantity) => {
    if (quantity <= 0) {
      removeFromCart(productId);
      return;
    }
    setCartItems((prev) =>
      prev.map((item) =>
        item.id === productId ? { ...item, quantity } : item,
      ),
    );
  };

  const getCartTotal = () => {
    return cartItems.reduce((total, item) => {
      const priceStr = item.price.replace(/[^0-9.-]+/g, "");
      const price = parseFloat(priceStr);
      return total + (isNaN(price) ? 0 : price * item.quantity);
    }, 0);
  };

  const getTotalItems = () => {
    return cartItems.reduce((total, item) => total + item.quantity, 0);
  };

  // Toggle favorite - persists to localStorage
  const toggleFavorite = (productId) => {
    console.log("Toggling favorite for product:", productId);
    console.log("Current favorites:", favorites);

    setFavorites((prev) => {
      const isFavorite = prev.includes(productId);
      let newFavorites;

      if (isFavorite) {
        newFavorites = prev.filter((id) => id !== productId);
        console.log("Removed from favorites:", productId);
      } else {
        newFavorites = [...prev, productId];
        console.log("Added to favorites:", productId);
      }

      // Save to localStorage
      localStorage.setItem("favorites", JSON.stringify(newFavorites));
      console.log("New favorites saved:", newFavorites);

      return newFavorites;
      console.log("Toggle favorite called for:", productId);
      console.log("Current favorites before toggle:", favorites);
    });
  };

  // Local toggle (for guest users or fallback)
  const toggleLocalFavorite = (productId) => {
    setFavorites((prev) => {
      const isFavorite = prev.includes(productId);
      const newFavorites = isFavorite
        ? prev.filter((id) => id !== productId)
        : [...prev, productId];
      localStorage.setItem("favorites", JSON.stringify(newFavorites));
      return newFavorites;
    });
  };

  // Check if product is in favorites
  const isFavorite = (productId) => {
    return favorites.includes(productId);
  };

  // Clear all favorites
  const clearFavorites = () => {
    setFavorites([]);
    localStorage.removeItem("favorites");
  };

  // Sync favorites with server (used after login)
  const syncFavoritesFromServer = async () => {
    try {
      const token = localStorage.getItem("authToken");
      if (!token) return;

      const response = await getWishlist();
      if (response.success && response.wishlist) {
        const wishlistIds = response.wishlist.map((item) =>
          typeof item === "object" ? item._id : item,
        );
        setFavorites(wishlistIds);
        localStorage.setItem("favorites", JSON.stringify(wishlistIds));
      }
    } catch (error) {
      console.error("Sync favorites error:", error);
    }
  };

  const value = {
    cartItems,
    favorites,
    loading,
    addToCart,
    removeFromCart,
    updateQuantity,
    getCartTotal,
    getTotalItems,
    toggleFavorite,
    isFavorite,
    clearFavorites,
    syncFavoritesFromServer,
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
}
