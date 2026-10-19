import { createContext, useState, useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  getWishlist,
  getCart,
  addToCartAPI,
  addToWishlist,
} from "../services/authService";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const storedToken = localStorage.getItem("authToken");
    const storedUser = localStorage.getItem("userData");

    if (storedToken && storedUser) {
      try {
        const parsedUser = JSON.parse(storedUser);
        setToken(storedToken);
        setUser(parsedUser);

        // Refresh wishlist/cart from the server so a page reload reflects
        // the database, not just whatever was last cached locally
        loadUserWishlist(storedToken);
        loadUserCart(storedToken);
      } catch (error) {
        console.error("Error parsing user data:", error);
        localStorage.removeItem("authToken");
        localStorage.removeItem("userData");
      }
    }
    setIsLoading(false);
  }, []);

  const login = async (userData, authToken) => {
    setUser(userData);
    setToken(authToken);
    localStorage.setItem("authToken", authToken);
    localStorage.setItem("userData", JSON.stringify(userData));

    // Merge anything added as a guest into the account's server data
    // BEFORE pulling down the server's copy - otherwise the (empty, for
    // a first-time cart/wishlist) server response would overwrite and
    // permanently erase what was added pre-login
    await mergeGuestCartIntoAccount();
    await mergeGuestWishlistIntoAccount();

    // Load wishlist and cart from database after login
    await loadUserWishlist(authToken);
    await loadUserCart(authToken);

    // Redirect based on role
    if (userData.role === "admin") {
      navigate("/admin");
    } else {
      navigate("/");
    }
  };

  const updateUser = (updatedUserData) => {
    setUser(updatedUserData);
    localStorage.setItem("userData", JSON.stringify(updatedUserData));
  };

  const mergeGuestCartIntoAccount = async () => {
    try {
      const guestCartRaw = localStorage.getItem("cart");
      if (!guestCartRaw) return;

      const guestCart = JSON.parse(guestCartRaw);
      if (!Array.isArray(guestCart) || guestCart.length === 0) return;

      for (const item of guestCart) {
        if (!item?.id) continue;
        try {
          await addToCartAPI(item.id, item.quantity || 1);
        } catch (err) {
          console.error("Error merging cart item:", item.id, err);
        }
      }
    } catch (error) {
      console.error("Error merging guest cart:", error);
    }
  };

  const mergeGuestWishlistIntoAccount = async () => {
    try {
      const guestWishlistRaw = localStorage.getItem("favorites");
      if (!guestWishlistRaw) return;

      const guestWishlist = JSON.parse(guestWishlistRaw);
      if (!Array.isArray(guestWishlist) || guestWishlist.length === 0) return;

      for (const productId of guestWishlist) {
        try {
          await addToWishlist(productId);
        } catch (err) {}
      }
    } catch (error) {
      console.error("Error merging guest wishlist:", error);
    }
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem("authToken");
    localStorage.removeItem("userData");
    localStorage.removeItem("favorites");
    localStorage.removeItem("cart");
    // Tell CartContext to reset its in-memory state too, so the next
    // guest session (or a different account) doesn't inherit this
    // user's favorites/cart until a full page reload happens
    window.dispatchEvent(new CustomEvent("userLoggedOut"));
    navigate("/login");
  };

  const loadUserWishlist = async (authToken) => {
    try {
      const tokenToUse = authToken || localStorage.getItem("authToken");
      if (!tokenToUse) return;

      const response = await getWishlist();
      if (response.success && response.wishlist) {
        // Get product IDs from wishlist
        const wishlistIds = response.wishlist.map((item) =>
          typeof item === "object" ? item._id : item,
        );
        // Save to localStorage
        localStorage.setItem("favorites", JSON.stringify(wishlistIds));
        // Trigger a custom event so CartContext can update
        window.dispatchEvent(
          new CustomEvent("wishlistUpdated", {
            detail: { wishlist: wishlistIds },
          }),
        );
      }
    } catch (error) {
      console.error("Error loading wishlist:", error);
    }
  };

  const loadUserCart = async (authToken) => {
    try {
      const tokenToUse = authToken || localStorage.getItem("authToken");
      if (!tokenToUse) return;

      const response = await getCart();
      if (response.success && response.cart) {
        // Trigger a custom event so CartContext can update
        window.dispatchEvent(
          new CustomEvent("cartUpdated", {
            detail: { cart: response.cart },
          }),
        );
      }
    } catch (error) {
      console.error("Error loading cart:", error);
    }
  };

  const isAdmin = user?.role === "admin";
  const isCustomer = user?.role === "customer";

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isLoading,
        login,
        logout,
        loadUserWishlist,
        loadUserCart,
        isAdmin,
        isCustomer,
        updateUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
