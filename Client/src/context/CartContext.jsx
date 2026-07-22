import { createContext, useState, useContext, useEffect } from "react";
import {
  getWishlist,
  addToWishlist,
  removeFromWishlist,
} from "../services/authService";
import { useAuth } from "./AuthContext";

const CartContext = createContext();

export function CartProvider({ children }) {
  const { user } = useAuth();
  const [cartItems, setCartItems] = useState([]);
  const [favorites, setFavorites] = useState([]);

  // Load wishlist when user logs in
  useEffect(() => {
    if (user) {
      loadWishlist();
    } else {
      setFavorites([]);
    }
  }, [user]);

  const loadWishlist = async () => {
    try {
      const response = await getWishlist();
      if (response.success && response.wishlist) {
        const productIds = response.wishlist.map((p) => p._id);
        setFavorites(productIds);
      }
    } catch (error) {
      console.error("Error loading wishlist:", error);
    }
  };

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

  const toggleFavorite = async (productId) => {
    if (!user) {
      alert("Please login to save favorites.");
      return;
    }

    const isFavorite = favorites.includes(productId);

    try {
      if (isFavorite) {
        await removeFromWishlist(productId);
        setFavorites((prev) => prev.filter((id) => id !== productId));
      } else {
        await addToWishlist(productId);
        setFavorites((prev) => [...prev, productId]);
      }
    } catch (error) {
      console.error("Toggle favorite error:", error);
      alert("Failed to update favorites. Please try again.");
    }
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
