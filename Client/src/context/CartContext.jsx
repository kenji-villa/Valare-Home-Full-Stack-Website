import { createContext, useState, useContext, useEffect } from "react";
import {
  getWishlist,
  addToWishlist,
  removeFromWishlist,
} from "../services/authService";

const CartContext = createContext();

export function CartProvider({ children }) {
  const [cartItems, setCartItems] = useState([]);
  const [favorites, setFavorites] = useState([]);
  const [user, setUser] = useState(null);

  // Load wishlist from API when user logs in
  useEffect(() => {
    const token = localStorage.getItem("authToken");
    const userData = localStorage.getItem("userData");

    if (token && userData) {
      const parsedUser = JSON.parse(userData);
      setUser(parsedUser);
      loadWishlist();
    }
  }, []);

  const loadWishlist = async () => {
    try {
      const response = await getWishlist();
      if (response.success) {
        const wishlistIds = response.wishlist.map((p) => p._id);
        setFavorites(wishlistIds);
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
    try {
      const isFavorite = favorites.includes(productId);

      if (isFavorite) {
        await removeFromWishlist(productId);
        setFavorites((prev) => prev.filter((id) => id !== productId));
      } else {
        await addToWishlist(productId);
        setFavorites((prev) => [...prev, productId]);
      }
    } catch (error) {
      console.error("Toggle wishlist error:", error);
      // Revert UI state if API call fails
      // You might want to show an error message here
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
