import { useState, useEffect } from "react";
import { useSearchParams, Link } from "react-router-dom";
import Header from "../components/layout/Header";
import Footer from "../components/layout/Footer";
import ProductCard from "../components/common/ProductCard";
import { Search, SlidersHorizontal, X, ArrowLeft } from "lucide-react";
import { getProducts } from "../services/productService";

export default function SearchResults() {
  const [searchParams, setSearchParams] = useSearchParams();
  const query = searchParams.get("q") || "";

  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState(query);
  const [sortBy, setSortBy] = useState("featured");
  const [priceRange, setPriceRange] = useState({ min: 0, max: 10000 });
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [availableCategories, setAvailableCategories] = useState([]);

  // Fetch all products and filter
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const response = await getProducts({ limit: 200 });
        if (response.success) {
          setProducts(response.products);
          const cats = [
            ...new Set(
              response.products.map((p) => p.category).filter(Boolean),
            ),
          ];
          setAvailableCategories(cats);
        }
      } catch (error) {
        console.error("Error fetching products:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  // Filter products based on search query
  useEffect(() => {
    let filtered = [...products];

    // Search filter
    if (query.trim()) {
      const searchLower = query.toLowerCase().trim();
      filtered = filtered.filter(
        (p) =>
          p.name?.toLowerCase().includes(searchLower) ||
          p.description?.toLowerCase().includes(searchLower) ||
          p.category?.toLowerCase().includes(searchLower) ||
          p.subcategory?.toLowerCase().includes(searchLower) ||
          p.color?.toLowerCase().includes(searchLower) ||
          p.material?.toLowerCase().includes(searchLower),
      );
    }

    // Category filter
    if (selectedCategories.length > 0) {
      filtered = filtered.filter((p) =>
        selectedCategories.includes(p.category),
      );
    }

    // Price filter
    filtered = filtered.filter((p) => {
      const price = p.price || 0;
      return price >= priceRange.min && price <= priceRange.max;
    });

    // Sort
    switch (sortBy) {
      case "price_low":
        filtered.sort((a, b) => (a.price || 0) - (b.price || 0));
        break;
      case "price_high":
        filtered.sort((a, b) => (b.price || 0) - (a.price || 0));
        break;
      case "rating":
        filtered.sort(
          (a, b) => (b.averageRating || 0) - (a.averageRating || 0),
        );
        break;
      case "newest":
        filtered.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        break;
      default:
        break;
    }

    setFilteredProducts(filtered);
  }, [products, query, selectedCategories, priceRange, sortBy]);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      setSearchParams({ q: searchQuery.trim() });
    }
  };

  return (
    <>
      <Header />
      <main className="bg-gray-50 min-h-screen">
        {/* Search Hero */}
        <section className="bg-white border-b border-gray-200 py-8">
          <div className="container">
            <Link
              to="/"
              className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-[#DA4C2F] transition-colors mb-4"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Home
            </Link>

            <form onSubmit={handleSearch} className="max-w-2xl">
              <div className="relative">
                <input
                  type="search"
                  placeholder="Search for products..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full px-4 py-3 pr-12 border border-gray-300 rounded-lg focus:outline-none focus:border-[#DA4C2F] focus:ring-2 focus:ring-[#DA4C2F]/20 transition-all"
                  autoFocus
                />
                <button
                  type="submit"
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-[#DA4C2F] transition-colors"
                >
                  <Search className="w-5 h-5" />
                </button>
              </div>
            </form>

            {query && (
              <p className="text-gray-600 mt-4">
                {loading ? (
                  "Searching..."
                ) : (
                  <>
                    Found{" "}
                    <span className="font-semibold text-[#1a2d5e]">
                      {filteredProducts.length}
                    </span>{" "}
                    results for "
                    <span className="font-semibold text-[#DA4C2F]">
                      {query}
                    </span>
                    "
                  </>
                )}
              </p>
            )}
          </div>
        </section>

        {/* Results */}
        <section className="py-8">
          <div className="container">
            <div className="flex flex-col lg:flex-row gap-8">
              {/* Filters Sidebar */}
              <div className="lg:w-64 flex-shrink-0">
                <div className="bg-white border border-gray-200 rounded-lg p-6 sticky top-24">
                  <h3 className="font-bold text-lg mb-4">Refine Search</h3>

                  {/* Categories */}
                  {availableCategories.length > 0 && (
                    <div className="mb-6">
                      <h4 className="font-semibold mb-3 text-sm">Categories</h4>
                      <div className="space-y-2">
                        {availableCategories.map((cat) => (
                          <label
                            key={cat}
                            className="flex items-center gap-2 cursor-pointer"
                          >
                            <input
                              type="checkbox"
                              checked={selectedCategories.includes(cat)}
                              onChange={() => {
                                setSelectedCategories((prev) =>
                                  prev.includes(cat)
                                    ? prev.filter((c) => c !== cat)
                                    : [...prev, cat],
                                );
                              }}
                              className="w-4 h-4 accent-[#DA4C2F]"
                            />
                            <span className="text-sm text-gray-700">{cat}</span>
                          </label>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Price Range */}
                  <div className="mb-6">
                    <h4 className="font-semibold mb-3 text-sm">Price Range</h4>
                    <div className="flex gap-2">
                      <input
                        type="number"
                        placeholder="Min"
                        value={priceRange.min}
                        onChange={(e) =>
                          setPriceRange((prev) => ({
                            ...prev,
                            min: parseInt(e.target.value) || 0,
                          }))
                        }
                        className="w-1/2 px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#DA4C2F]"
                      />
                      <input
                        type="number"
                        placeholder="Max"
                        value={priceRange.max}
                        onChange={(e) =>
                          setPriceRange((prev) => ({
                            ...prev,
                            max: parseInt(e.target.value) || 10000,
                          }))
                        }
                        className="w-1/2 px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#DA4C2F]"
                      />
                    </div>
                  </div>

                  <button
                    onClick={() => {
                      setSelectedCategories([]);
                      setPriceRange({ min: 0, max: 10000 });
                    }}
                    className="w-full text-[#DA4C2F] py-2 rounded-lg font-medium hover:bg-gray-50 transition-colors text-sm"
                  >
                    Reset Filters
                  </button>
                </div>
              </div>

              {/* Product Grid */}
              <div className="flex-1">
                {/* Toolbar */}
                <div className="flex items-center justify-between mb-6">
                  <span className="text-sm text-gray-500">
                    {filteredProducts.length} products
                  </span>
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#DA4C2F]"
                  >
                    <option value="featured">Featured</option>
                    <option value="newest">Newest Arrivals</option>
                    <option value="price_low">Price: Low to High</option>
                    <option value="price_high">Price: High to Low</option>
                    <option value="rating">Customer Rating</option>
                  </select>
                </div>

                {loading ? (
                  <div className="flex flex-col items-center justify-center py-20">
                    <div className="w-12 h-12 border-4 border-[#DA4C2F] border-t-transparent rounded-full animate-spin"></div>
                    <p className="mt-4 text-gray-600">Searching...</p>
                  </div>
                ) : filteredProducts.length === 0 ? (
                  <div className="text-center py-20 bg-white rounded-lg">
                    <div className="text-6xl mb-4">🔍</div>
                    <h3 className="text-xl font-semibold mb-2">
                      No products found
                    </h3>
                    <p className="text-gray-600 mb-6">
                      We couldn't find any products matching "{query}". Try a
                      different search term.
                    </p>
                    <Link
                      to="/home-furniture"
                      className="btn-primary inline-flex items-center gap-2"
                    >
                      Browse All Products
                    </Link>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredProducts.map((product) => (
                      <ProductCard
                        key={product._id || product.id}
                        {...product}
                      />
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
