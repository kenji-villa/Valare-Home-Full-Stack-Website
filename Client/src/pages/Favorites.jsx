import { useState, useEffect, useMemo } from "react";
import { Link } from "react-router-dom";
import Header from "../components/layout/Header";
import Footer from "../components/layout/Footer";
import ProductCard from "../components/common/ProductCard";
import { Heart, ShoppingBag, Trash2, ArrowLeft } from "lucide-react";
import { useCart } from "../context/CartContext";
import { getProducts } from "../services/productService";

export default function Favorites() {
  const { favorites, toggleFavorite, clearFavorites } = useCart();
  const [favoriteProducts, setFavoriteProducts] = useState([]);
  const [allProducts, setAllProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showClearConfirm, setShowClearConfirm] = useState(false);

  // Fetch favorite products from API
  useEffect(() => {
    const fetchFavoriteProducts = async () => {
      try {
        setLoading(true);
        setError(null);

        if (favorites.length === 0) {
          setFavoriteProducts([]);
          setLoading(false);
          return;
        }

        const response = await getProducts({ limit: 100 });

        if (response.success) {
          const filtered = response.products.filter(
            (p) => favorites.includes(p._id) || favorites.includes(p.id),
          );
          setFavoriteProducts(filtered);
        }
      } catch (err) {
        console.error("Error fetching favorite products:", err);
        setError("Failed to load favorite products");
      } finally {
        setLoading(false);
      }
    };

    fetchFavoriteProducts();
  }, [favorites]);

  const handleRemoveFromWishlist = (productId) => {
    console.log("Removing from wishlist:", productId);
    toggleFavorite(productId);
  };

  const clearAllFavorites = () => {
    if (window.confirm("Remove all items from favorites?")) {
      clearFavorites();
    }
  };

  <ConfirmModal
    isOpen={showClearConfirm}
    onClose={() => setShowClearConfirm(false)}
    onConfirm={() => {
      favoriteProducts.forEach((p) => toggleFavorite(p._id));
      addToast("Favorites cleared", "success");
    }}
    title="Clear Favorites"
    message="Are you sure you want to remove all items from your favorites?"
    confirmText="Clear All"
  />;

  return (
    <>
      <Header />
      <main className="bg-gray-50 min-h-screen py-8">
        <div className="container">
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
              <button onClick={() => setShowClearConfirm(true)}>
                Clear All
              </button>
            )}
          </div>

          {/* Content */}
          {loading ? (
            <div className="flex flex-col items-center justify-center py-20">
              <div className="w-12 h-12 border-4 border-[#DA4C2F] border-t-transparent rounded-full animate-spin"></div>
              <p className="mt-4 text-gray-600">Loading favorites...</p>
            </div>
          ) : error ? (
            <div className="text-center py-20 bg-white rounded-lg shadow-sm">
              <div className="text-6xl mb-4">⚠️</div>
              <h3 className="text-xl font-semibold text-gray-800 mb-2">
                Something went wrong
              </h3>
              <p className="text-gray-600">{error}</p>
              <button
                onClick={() => window.location.reload()}
                className="mt-4 btn-primary inline-flex items-center gap-2"
              >
                Try Again
              </button>
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
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {favoriteProducts.map((product) => (
                <div key={product._id || product.id} className="relative group">
                  <ProductCard {...product} />
                  <button
                    onClick={() =>
                      handleRemoveFromWishlist(product._id || product.id)
                    }
                    className="absolute top-3 right-3 z-20 w-8 h-8 bg-white rounded-full shadow-md flex items-center justify-center hover:bg-red-50 transition-colors group-hover:scale-110"
                    title="Remove from favorites"
                  >
                    <Heart className="w-4 h-4 text-[#DA4C2F] fill-[#DA4C2F]" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
      <Footer />
    </>
  );
}
