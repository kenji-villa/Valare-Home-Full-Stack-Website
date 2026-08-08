import { createContext, useState, useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getWishlist } from "../services/authService";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const initializeAuth = async () => {
      const storedToken = localStorage.getItem("authToken");
      const storedUser = localStorage.getItem("userData");

      if (storedToken && storedUser) {
        try {
          const parsedUser = JSON.parse(storedUser);
          setToken(storedToken);
          setUser(parsedUser);
          await loadUserWishlist(storedToken);
        } catch (error) {
          console.error("Error parsing user data:", error);
          localStorage.removeItem("authToken");
          localStorage.removeItem("userData");
        }
      }
      setIsLoading(false);
    };

    initializeAuth();
  }, []);

  const login = async (userData, authToken) => {
    setUser(userData);
    setToken(authToken);
    localStorage.setItem("authToken", authToken);
    localStorage.setItem("userData", JSON.stringify(userData));

    // Load wishlist from database after login
    await loadUserWishlist(authToken);

    // Redirect based on role
    if (userData.role === "admin") {
      navigate("/admin");
    } else {
      navigate("/");
    }
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem("authToken");
    localStorage.removeItem("userData");
    localStorage.removeItem("favorites");
    localStorage.removeItem("cart");
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
