import { createContext, useState, useContext, useEffect } from "react";
import {
  toggleWishlist,
  getWishlist,
  syncWishlist,
  clearWishlist,
  getCart,
  addToCartAPI,
  updateCartItemAPI,
  removeFromCartAPI,
  clearCartAPI,
} from "../services/authService";

// Convert the server's cart shape ({ product: {...}, quantity }) into the
// flat shape the Ui uses ({ id, name, price, image, quantity })
const resolveImageUrl = (path) => {
  if (!path) return "/assets/images/placeholder.jpg";
  if (path.startsWith("/uploads")) return `http://localhost:3001${path}`;
  return path;
};

const mapServerCartToLocal = (serverCart) => {
  return (serverCart || [])
    .filter((item) => item.product)
    .map((item) => {
      const product = item.product;
      let price = product.price;
      if (typeof price === "number") {
        price = `ETB ${price.toFixed(2)}`;
      } else if (typeof price === "string" && !price.startsWith("ETB")) {
        price = `ETB ${price}`;
      }
      const rawImage =
        product.coverImage ||
        product.image ||
        (product.images && product.images[0]) ||
        "";
      return {
        id: product._id || product.id,
        name: product.name,
        price,
        image: resolveImageUrl(rawImage),
        quantity: item.quantity,
      };
    });
};

const CartContext = createContext();

export function CartProvider({ children }) {
  const [cartItems, setCartItems] = useState([]);
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(false);

  // Load cart from localStorage on mount (guest fallback / instant paint
  // before the server sync below completes for logged-in users)
  useEffect(() => {
    const savedCart = localStorage.getItem("cart");
    if (savedCart) {
      try {
        const parsed = JSON.parse(savedCart);
        setCartItems(Array.isArray(parsed) ? parsed : []);
      } catch (e) {
        console.error("Error loading cart:", e);
        setCartItems([]);
      }
    }
  }, []);

  // Save cart to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(cartItems));
  }, [cartItems]);

  // Sync cart whenever AuthContext loads it from the server (fires after
  useEffect(() => {
    const handleCartUpdate = (e) => {
      setCartItems(mapServerCartToLocal(e.detail?.cart));
    };
    window.addEventListener("cartUpdated", handleCartUpdate);
    return () => window.removeEventListener("cartUpdated", handleCartUpdate);
  }, []);

  // Reset local state on logout so the next session doesn't inherit
  useEffect(() => {
    const handleLogout = () => {
      setCartItems([]);
      setFavorites([]);
    };
    window.addEventListener("userLoggedOut", handleLogout);
    return () => window.removeEventListener("userLoggedOut", handleLogout);
  }, []);

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

  /// Sync favorites whenever AuthContext loads the wishlist from the server
  useEffect(() => {
    const handleWishlistUpdate = (e) => {
      setFavorites(e.detail?.wishlist || []);
    };
    window.addEventListener("wishlistUpdated", handleWishlistUpdate);
    return () =>
      window.removeEventListener("wishlistUpdated", handleWishlistUpdate);
  }, []);

  const addToCart = async (product) => {
    const token = localStorage.getItem("authToken");

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

    if (!token) return; // guest user - local only

    try {
      const response = await addToCartAPI(product.id, 1);
      if (!response.success) {
        throw new Error(response.message || "Failed to add to cart");
      }
      if (response.cart) {
        setCartItems(mapServerCartToLocal(response.cart));
      }
    } catch (error) {
      console.error("Error adding to cart on server:", error);
      setCartItems((prev) => {
        const existing = prev.find((item) => item.id === product.id);
        if (existing && existing.quantity > 1) {
          return prev.map((item) =>
            item.id === product.id
              ? { ...item, quantity: item.quantity - 1 }
              : item,
          );
        }
        return prev.filter((item) => item.id !== product.id);
      });
    }
  };

  const removeFromCart = async (productId) => {
    const previousCart = cartItems;
    const token = localStorage.getItem("authToken");

    setCartItems((prev) => prev.filter((item) => item.id !== productId));

    if (!token) return;

    try {
      const response = await removeFromCartAPI(productId);
      if (!response.success) {
        throw new Error(response.message || "Failed to remove from cart");
      }
      if (response.cart) {
        setCartItems(mapServerCartToLocal(response.cart));
      }
    } catch (error) {
      console.error("Error removing from cart on server:", error);
      setCartItems(previousCart);
    }
  };

  const updateQuantity = async (productId, quantity) => {
    if (quantity <= 0) {
      return removeFromCart(productId);
    }

    const previousCart = cartItems;
    const token = localStorage.getItem("authToken");

    setCartItems((prev) =>
      prev.map((item) =>
        item.id === productId ? { ...item, quantity } : item,
      ),
    );

    if (!token) return;

    try {
      const response = await updateCartItemAPI(productId, quantity);
      if (!response.success) {
        throw new Error(response.message || "Failed to update cart");
      }
      if (response.cart) {
        setCartItems(mapServerCartToLocal(response.cart));
      }
    } catch (error) {
      console.error("Error updating cart on server:", error);
      setCartItems(previousCart);
    }
  };

  // Clear the entire cart
  const clearCart = async () => {
    const previousCart = cartItems;
    const token = localStorage.getItem("authToken");

    setCartItems([]);

    if (!token) return;

    try {
      const response = await clearCartAPI();
      if (!response.success) {
        throw new Error(response.message || "Failed to clear cart");
      }
    } catch (error) {
      console.error("Error clearing cart on server:", error);
      setCartItems(previousCart);
    }
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

  // Toggle favorite - persists to the database when logged in, falls back
  // to local-only storage for guests
  const toggleFavorite = async (productId) => {
    const token = localStorage.getItem("authToken");
    const wasFavorite = favorites.includes(productId);

    // Optimistic UI update (localStorage sync happens via the useEffect above)
    setFavorites((prev) =>
      wasFavorite
        ? prev.filter((id) => id !== productId)
        : [...prev, productId],
    );

    // Guest user - nothing to persist to the server
    if (!token) return;

    try {
      const response = await toggleWishlist(productId);
      if (!response.success) {
        throw new Error(response.message || "Failed to update wishlist");
      }
      // Reconcile with the server's copy (source of truth)
      if (response.wishlist) {
        const ids = response.wishlist.map((item) =>
          typeof item === "object" ? item._id : item,
        );
        setFavorites(ids);
      }
    } catch (error) {
      console.error("Error syncing favorite with server:", error);
      // Revert the optimistic update since the server call failed
      setFavorites((prev) =>
        wasFavorite
          ? [...prev, productId]
          : prev.filter((id) => id !== productId),
      );
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
  const clearFavorites = async () => {
    const previousFavorites = favorites;
    const token = localStorage.getItem("authToken");

    // Optimistic UI update
    setFavorites([]);

    if (!token) return; // guest user - local only

    try {
      const response = await clearWishlist();
      if (!response.success) {
        throw new Error(response.message || "Failed to clear wishlist");
      }
    } catch (error) {
      console.error("Error clearing favorites on server:", error);
      // Revert on failure
      setFavorites(previousFavorites);
    }
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
    clearCart,
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
