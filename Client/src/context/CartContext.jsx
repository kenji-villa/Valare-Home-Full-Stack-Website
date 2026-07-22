import { createContext, useState, useContext, useEffect } from "react";
import { toggleWishlist as apiToggleWishlist } from "../services/authService";
import { useAuth } from "./AuthContext";

const CartContext = createContext();

export function CartProvider({ children }) {
  const { user } = useAuth();
  const [cartItems, setCartItems] = useState([]);
  const [favorites, setFavorites] = useState([]);

  // Load wishlist when user logs in
  useEffect(() => {
    const savedFavorites = localStorage.getItem("favorites");
    if (savedFavorites) {
      try {
        setFavorites(JSON.parse(savedFavorites));
      } catch (e) {
        console.error("Error loading favorites:", e);
      }
    }
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
      // Remove currency symbols and commas, then parse as float
      const priceStr = item.price.replace(/[^0-9.-]+/g, "");
      const price = parseFloat(priceStr);
      return total + (isNaN(price) ? 0 : price * item.quantity);
    }, 0);
  };

  // Toggle favorite (wishlist) - Local only for now
  const toggleFavorite = async (productId) => {
    try {
      const token = localStorage.getItem("authToken");

      if (token) {
        // User is logged in - use API
        const response = await apiToggleWishlist(productId);
        if (response.success) {
          const wishlistIds = response.wishlist.map((item) =>
            typeof item === "object" ? item._id : item,
          );
          setFavorites(wishlistIds);
          localStorage.setItem("favorites", JSON.stringify(wishlistIds));
        }
      } else {
        // Guest user - local only
        setFavorites((prev) => {
          const isFavorite = prev.includes(productId);
          const newFavorites = isFavorite
            ? prev.filter((id) => id !== productId)
            : [...prev, productId];
          localStorage.setItem("favorites", JSON.stringify(newFavorites));
          return newFavorites;
        });
      }
    } catch (error) {
      console.error("Toggle favorite error:", error);
      // Fallback to local toggle
      setFavorites((prev) => {
        const isFavorite = prev.includes(productId);
        const newFavorites = isFavorite
          ? prev.filter((id) => id !== productId)
          : [...prev, productId];
        localStorage.setItem("favorites", JSON.stringify(newFavorites));
        return newFavorites;
      });
    }
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

  const loadWishlist = async () => {
    try {
      const token = localStorage.getItem("authToken");
      if (!token) return;

      const response = await getWishlist();
      if (response.success) {
        const wishlistIds = response.wishlist.map((item) =>
          typeof item === "object" ? item._id : item,
        );
        setFavorites(wishlistIds);
      }
    } catch (error) {
      console.error("Load wishlist error:", error);
    }
  };

  const value = {
    // ... existing values
    toggleFavorite,
    loadWishlist,
  };

  const getTotalItems = () => {
    return cartItems.reduce((total, item) => total + item.quantity, 0);
  };

  return (
    <CartContext.Provider
      value={{
        cartItems,
        favorites,
        addToCart,
        removeFromCart,
        updateQuantity,
        getCartTotal,
        toggleFavorite,
        getTotalItems,
        loadWishlist,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  return useContext(CartContext);
}
