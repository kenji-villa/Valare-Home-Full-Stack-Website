import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Header from "../components/layout/Header";
import Footer from "../components/layout/Footer";
import ProductCard from "../components/common/ProductCard";
import { Heart, ShoppingBag, Trash2 } from "lucide-react";
import { useCart } from "../context/CartContext";
import { getWishlist } from "../services/authService";

export default function Favorites() {
  const { favorites, toggleFavorite, loadWishlist } = useCart();
  const [favoriteProducts, setFavoriteProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchWishlist = async () => {
      try {
        setLoading(true);
        setError(null);

        const response = await getWishlist();

        if (response.success) {
          // Map the wishlist products to the format expected by ProductCard
          const products = response.wishlist.map((p) => ({
            ...p,
            id: p._id,
            rating: p.averageRating || 0,
            reviews: p.reviewCount || 0,
            image:
              p.coverImage || p.images?.[0] || "/assets/images/placeholder.jpg",
          }));
          setFavoriteProducts(products);
        } else {
          setError("Failed to load favorites");
        }
      } catch (err) {
        console.error("Error fetching wishlist:", err);
        setError("Failed to load your favorites. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchWishlist();
  }, [favorites]); // Re-fetch when favorites change

  const handleRemoveFavorite = async (productId) => {
    await toggleFavorite(productId);
    // The state will update via the effect above
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
          <section className="relative py-12 min-h-[200px] flex items-center rounded-lg overflow-hidden mb-8">
            <div
              className="absolute inset-0 bg-cover bg-center bg-no-repeat"
              style={{
                backgroundImage: "url('/assets/images/bx3.jpg')",
                backgroundPosition: "center 40%",
              }}
            >
              <div className="absolute inset-0 bg-black/50"></div>
            </div>
            <div className="container relative z-10">
              <div className="flex flex-col md:flex-row items-start md:items-center justify-between">
                <div>
                  <h1 className="text-3xl md:text-4xl font-bold text-white flex items-center gap-3">
                    <Heart className="w-8 h-8 text-[#DA4C2F]" fill="#DA4C2F" />
                    Your Favorites
                  </h1>
                  <p className="text-gray-200 mt-1">
                    {favoriteProducts.length} items saved for later
                  </p>
                </div>
                {favoriteProducts.length > 0 && (
                  <button
                    onClick={handleClearAll}
                    className="mt-4 md:mt-0 text-red-400 hover:text-red-300 transition-colors flex items-center gap-2 text-sm font-medium bg-black/30 px-4 py-2 rounded-lg"
                  >
                    <Trash2 className="w-4 h-4" />
                    Clear All
                  </button>
                )}
              </div>
            </div>
          </section>

          {/* Content */}
          {loading ? (
            <div className="flex flex-col items-center justify-center py-20">
              <div className="w-12 h-12 border-4 border-[#DA4C2F] border-t-transparent rounded-full animate-spin"></div>
              <p className="mt-4 text-gray-600">Loading your favorites...</p>
            </div>
          ) : error ? (
            <div className="text-center py-20 bg-white rounded-lg shadow-sm">
              <div className="text-6xl mb-4">😕</div>
              <h3 className="text-xl font-semibold text-gray-800 mb-2">
                Something went wrong
              </h3>
              <p className="text-gray-600">{error}</p>
              <button
                onClick={() => window.location.reload()}
                className="mt-4 text-[#DA4C2F] hover:underline"
              >
                Try again
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
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {favoriteProducts.map((product) => (
                  <div key={product._id} className="relative group">
                    <ProductCard
                      {...product}
                      rating={product.averageRating || 0}
                      reviews={product.reviewCount || 0}
                      image={getImageUrl(
                        product.coverImage || product.images?.[0],
                      )}
                    />
                    <button
                      onClick={() => handleRemoveFavorite(product._id)}
                      className="absolute top-3 right-3 z-20 w-8 h-8 bg-white rounded-full shadow-md flex items-center justify-center hover:bg-red-50 transition-colors group-hover:scale-110"
                      title="Remove from favorites"
                    >
                      <Heart className="w-4 h-4 text-[#DA4C2F] fill-[#DA4C2F]" />
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
