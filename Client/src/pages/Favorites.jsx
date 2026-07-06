import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Header from "../components/layout/Header";
import Footer from "../components/layout/Footer";
import ProductCard from "../components/common/ProductCard";
import { Heart, ShoppingBag, Trash2 } from "lucide-react";
import { useCart } from "../context/CartContext";

export default function Favorites() {
  const { favorites, toggleFavorite, cartItems } = useCart();
  const [favoriteProducts, setFavoriteProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  // Mock favorite products - In production, fetch from API
  useEffect(() => {
    const mockProducts = [
      {
        id: 1,
        name: "Modern Sectional Sofa",
        price: "ETB 25,000.00",
        originalPrice: "ETB 45,000.00",
        image: "/assets/images/p1.jpg",
        rating: 4.5,
        reviews: 3240,
        discount: "-20%",
        category: "Living Room",
      },
      {
        id: 3,
        name: "Luxury Couch",
        price: "ETB 45,000",
        originalPrice: "ETB 60,000",
        image: "/assets/images/p3.jpg",
        rating: 4.3,
        reviews: 3720,
        category: "Living Room",
      },
      {
        id: 5,
        name: "Modern Sofa",
        price: "ETB 85,000",
        originalPrice: "ETB 95,000",
        image: "/assets/images/p5.jpg",
        rating: 4.3,
        reviews: 2333,
        discount: "-10%",
        category: "Living Room",
      },
    ];

    // Filter products based on favorites array
    const filtered = mockProducts.filter((p) => favorites.includes(p.id));
    setFavoriteProducts(filtered);
    setLoading(false);
  }, [favorites]);

  const handleRemoveFavorite = (productId) => {
    toggleFavorite(productId);
  };

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
              <button
                onClick={() => {
                  if (window.confirm("Remove all items from favorites?")) {
                    favoriteProducts.forEach((p) => toggleFavorite(p.id));
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
          {loading ? (
            <div className="flex flex-col items-center justify-center py-20">
              <div className="w-12 h-12 border-4 border-[#DA4C2F] border-t-transparent rounded-full animate-spin"></div>
              <p className="mt-4 text-gray-600">Loading favorites...</p>
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
                <div key={product.id} className="relative">
                  <ProductCard {...product} />
                  <button
                    onClick={() => handleRemoveFavorite(product.id)}
                    className="absolute top-3 right-3 z-20 w-8 h-8 bg-white rounded-full shadow-md flex items-center justify-center hover:bg-red-50 transition-colors group"
                    title="Remove from favorites"
                  >
                    <Heart className="w-4 h-4 text-[#DA4C2F] fill-[#DA4C2F] group-hover:scale-110 transition-transform" />
                  </button>
                </div>
              ))}
            </div>
          )}

          {/* Recommendations */}
          {favoriteProducts.length > 0 && (
            <div className="mt-12 bg-white rounded-lg p-6 shadow-sm">
              <h2 className="text-xl font-bold text-[#1a2d5e] mb-4">
                You Might Also Like
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {[2, 4, 6, 7].map((id) => (
                  <div
                    key={id}
                    className="bg-gray-50 rounded-lg p-4 text-center"
                  >
                    <div className="w-full h-40 bg-gray-200 rounded-lg mb-3"></div>
                    <h4 className="font-medium text-gray-800">Product Name</h4>
                    <p className="text-[#DA4C2F] font-bold">ETB 45,000</p>
                    <button className="mt-2 text-sm text-[#DA4C2F] font-medium hover:underline">
                      View Product
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </>
  );
}
