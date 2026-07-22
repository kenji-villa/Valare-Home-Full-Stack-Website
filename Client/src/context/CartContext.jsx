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
      } catch (e) {
        console.error("Error loading favorites:", e);
        setFavorites([]);
      }
    }
  }, []);

  // Listen for wishlist updates from AuthContext
  useEffect(() => {
    const handleWishlistUpdate = (event) => {
      if (event.detail && event.detail.wishlist) {
        setFavorites(event.detail.wishlist);
        localStorage.setItem(
          "favorites",
          JSON.stringify(event.detail.wishlist),
        );
      }
    };

    window.addEventListener("wishlistUpdated", handleWishlistUpdate);
    return () =>
      window.removeEventListener("wishlistUpdated", handleWishlistUpdate);
  }, []);

  // Save favorites to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem("favorites", JSON.stringify(favorites));
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

  // Toggle favorite - syncs with database if logged in
  const toggleFavorite = async (productId) => {
    const token = localStorage.getItem("authToken");

    if (token) {
      // User is logged in - sync with database
      try {
        const response = await toggleWishlist(productId);
        if (response.success) {
          // Update local state from server response
          const wishlistIds = response.wishlist.map((item) =>
            typeof item === "object" ? item._id : item,
          );
          setFavorites(wishlistIds);
          localStorage.setItem("favorites", JSON.stringify(wishlistIds));
        }
      } catch (error) {
        console.error("Toggle wishlist error:", error);
        // Fallback: toggle locally
        toggleLocalFavorite(productId);
      }
    } else {
      // Guest user - local only
      toggleLocalFavorite(productId);
    }
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
