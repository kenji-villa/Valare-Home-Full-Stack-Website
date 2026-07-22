import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Header from "../components/layout/Header";
import Footer from "../components/layout/Footer";
import ProductCard from "../components/common/ProductCard";
import { Heart, ShoppingBag, Trash2 } from "lucide-react";
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";
import { getWishlist } from "../services/authService";

export default function Favorites() {
  const { toggleFavorite, favorites } = useCart();
  const { user } = useAuth();
  const [favoriteProducts, setFavoriteProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (user) {
      fetchWishlist();
    } else {
      setLoading(false);
      setFavoriteProducts([]);
    }
  }, [user, favorites]);

  const fetchWishlist = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await getWishlist();
      if (response.success) {
        setFavoriteProducts(response.wishlist || []);
      } else {
        setError("Failed to load wishlist");
      }
    } catch (error) {
      console.error("Error fetching wishlist:", error);
      setError("Failed to load wishlist");
    } finally {
      setLoading(false);
    }
  };

  const handleRemoveFromWishlist = async (productId) => {
    try {
      await removeFromWishlist(productId);
      toggleFavorite(productId);
      setFavoriteProducts((prev) => prev.filter((p) => p._id !== productId));
    } catch (error) {
      console.error("Error removing from wishlist:", error);
      alert("Failed to remove from wishlist");
    }
  };

  const handleClearAll = () => {
    if (window.confirm("Remove all items from favorites?")) {
      favoriteProducts.forEach((p) => toggleFavorite(p._id));
    }
  };

  // Get image URL helper
  const getImageUrl = (imagePath) => {
    if (!imagePath) return "/assets/images/placeholder.jpg";
    if (imagePath.startsWith("http")) return imagePath;
    if (imagePath.startsWith("/uploads")) {
      return `http://localhost:3001${imagePath}`;
    }
    return imagePath;
  };

  return (
    <>
      <Header />
      <main className="bg-gray-50 min-h-screen py-8">
        <div className="container">
          {/* Hero Section */}
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-3xl md:text-4xl font-bold text-[#1a2d5e] flex items-center gap-3">
                <Heart className="w-8 h-8 text-[#DA4C2F]" fill="#DA4C2F" />
                Your Favorites
              </h1>
              <p className="text-gray-600 mt-1">
                {favoriteProducts.length} items saved for later
              </p>
            </div>
            {favoriteProducts.length > 0 && (
              <button
                onClick={() => {
                  if (window.confirm("Remove all items from favorites?")) {
                    favoriteProducts.forEach((p) =>
                      handleRemoveFromWishlist(p._id),
                    );
                  }
                }}
                className="text-red-500 hover:text-red-700 transition-colors flex items-center gap-2 text-sm font-medium"
              >
                <Trash2 className="w-4 h-4" />
                Clear All
              </button>
            )}
          </div>

          {/* Content */}
          {!user ? (
            <div className="text-center py-20 bg-white rounded-lg shadow-sm">
              <div className="text-6xl mb-4">🔒</div>
              <h3 className="text-2xl font-bold text-gray-800 mb-2">
                Please Login
              </h3>
              <p className="text-gray-600 mb-6">
                Login to view your saved favorites.
              </p>
              <Link
                to="/login"
                className="btn-primary inline-flex items-center gap-2"
              >
                Login
              </Link>
            </div>
          ) : loading ? (
            <div className="flex flex-col items-center justify-center py-20">
              <div className="w-12 h-12 border-4 border-[#DA4C2F] border-t-transparent rounded-full animate-spin"></div>
              <p className="mt-4 text-gray-600">Loading favorites...</p>
            </div>
          ) : error ? (
            <div className="text-center py-20 bg-white rounded-lg shadow-sm">
              <div className="text-6xl mb-4">⚠️</div>
              <h3 className="text-xl font-bold text-gray-800 mb-2">Error</h3>
              <p className="text-gray-600">{error}</p>
            </div>
          ) : favoriteProducts.length === 0 ? (
            <div className="text-center py-20 bg-white rounded-lg shadow-sm">
              <div className="text-6xl mb-4">💔</div>
              <h3 className="text-2xl font-bold text-gray-800 mb-2">
                No favorites yet
              </h3>
              <p className="text-gray-600 mb-6">
                Start saving items you love by clicking the heart icon on
                products.
              </p>
              <Link
                to="/home-furniture"
                className="btn-primary inline-flex items-center gap-2"
              >
                <ShoppingBag className="w-5 h-5" />
                Browse Products
              </Link>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {favoriteProducts.map((product) => (
                  <div key={product._id} className="relative">
                    <ProductCard {...product} />
                    <button
                      onClick={() => handleRemoveFromWishlist(product._id)}
                      className="absolute top-3 right-3 z-20 w-8 h-8 bg-white rounded-full shadow-md flex items-center justify-center hover:bg-red-50 transition-colors group"
                      title="Remove from favorites"
                    >
                      <Heart className="w-4 h-4 text-[#DA4C2F] fill-[#DA4C2F] group-hover:scale-110 transition-transform" />
                    </button>
                  </div>
                ))}
              </div>

              {/* Recommendations */}
              {favoriteProducts.length >= 3 && (
                <div className="mt-12 bg-white rounded-lg p-6 shadow-sm">
                  <h2 className="text-xl font-bold text-[#1a2d5e] mb-4">
                    You Might Also Like
                  </h2>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    {favoriteProducts.slice(0, 4).map((product) => (
                      <div
                        key={`rec-${product._id}`}
                        className="bg-gray-50 rounded-lg p-4 text-center hover:shadow-md transition-shadow"
                      >
                        <img
                          src={getImageUrl(
                            product.coverImage || product.images?.[0],
                          )}
                          alt={product.name}
                          className="w-full h-32 object-cover rounded-lg mb-3"
                        />
                        <h4 className="font-medium text-gray-800 text-sm truncate">
                          {product.name}
                        </h4>
                        <p className="text-[#DA4C2F] font-bold text-sm">
                          ETB{" "}
                          {typeof product.price === "number"
                            ? product.price.toFixed(2)
                            : product.price}
                        </p>
                        <Link
                          to={`/product/${product._id}`}
                          className="mt-2 inline-block text-xs text-[#DA4C2F] font-medium hover:underline"
                        >
                          View Product <ArrowRight className="w-3 h-3 inline" />
                        </Link>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </main>
      <Footer />
    </>
  );
}
