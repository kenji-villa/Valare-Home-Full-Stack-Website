import { useState, useEffect } from "react";
import Header from "../components/layout/Header";
import Footer from "../components/layout/Footer";
import ProductCard from "../components/common/ProductCard";
import {
  Search,
  SlidersHorizontal,
  X,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import { getProducts } from "../services/productService";

export default function HomeFurniture() {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState({
    categories: [],
    priceRange: { min: 0, max: 10000 },
    colors: [],
    materials: [],
    ratings: [],
    search: "",
  });
  const [sortBy, setSortBy] = useState("featured");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(12);
  const [totalProducts, setTotalProducts] = useState(0);
  const [categories, setCategories] = useState([]);
  const [availableColors, setAvailableColors] = useState([]);
  const [availableMaterials, setAvailableMaterials] = useState([]);

  // Fetch products from API
  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const response = await getProducts({ limit: 100 });
      if (response.success) {
        // Filter to ONLY show Home products (exclude Office)
        const homeProducts = response.products.filter(
          (product) =>
            product.category !== "Office" &&
            product.category !== "office" &&
            product.category !== "Accessories" &&
            product.category !== "Chairs" &&
            product.subcategory !== "Office",
        );

        setProducts(homeProducts);
        setFilteredProducts(homeProducts);
        setTotalProducts(homeProducts.length);

        // Extract unique subcategories from home products
        // Look at subCategory first, then fallback to category
        const cats = [
          ...new Set(
            homeProducts
              .map((p) => (p.subcategory || p.category || "").trim())
              .filter(Boolean),
          ),
        ];

        // Filter out 'Home' and 'Office' from categories
        const filteredCats = cats.filter(
          (cat) =>
            cat !== "Home" &&
            cat !== "Office" &&
            cat !== "office" &&
            !cat.includes("Office"),
        );

        if (filteredCats.length > 0) {
          setCategories(filteredCats);
        } else {
          setCategories(["Living Room", "Bedroom", "Dining", "Kids"]);
        }

        const colors = [
          ...new Set(homeProducts.map((p) => p.color).filter(Boolean)),
        ];
        setAvailableColors(colors);

        const materials = [
          ...new Set(homeProducts.map((p) => p.material).filter(Boolean)),
        ];
        setAvailableMaterials(materials);
      }
    } catch (error) {
      console.error("Error fetching products:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    applyFilters();
  }, [filters, sortBy, products]);

  const applyFilters = () => {
    let filtered = [...products];

    // Search filter
    if (filters.search) {
      filtered = filtered.filter(
        (p) =>
          p.name.toLowerCase().includes(filters.search.toLowerCase()) ||
          (p.subCategory || p.category)
            .toLowerCase()
            .includes(filters.search.toLowerCase()),
      );
    }

    // Category filter - NOW uses subCategory if available
    if (filters.categories.length > 0) {
      filtered = filtered.filter((p) => {
        // Use subCategory if it exists, otherwise use category
        const productCategory = (p.subcategory || p.category || "")
          .trim()
          .toLowerCase();

        return filters.categories.some(
          (cat) => cat.trim().toLowerCase() === productCategory,
        );
      });
    }

    // Price filter
    filtered = filtered.filter((p) => {
      const price = p.price || 0;
      const min = filters.priceRange.min === "" ? 0 : filters.priceRange.min;
      const max =
        filters.priceRange.max === "" ? Infinity : filters.priceRange.max;

      return price >= min && price <= max;
    });

    // Color filter
    if (filters.colors.length > 0) {
      filtered = filtered.filter((p) => filters.colors.includes(p.color));
    }

    // Material filter
    if (filters.materials.length > 0) {
      filtered = filtered.filter((p) => filters.materials.includes(p.material));
    }

    // Rating filter
    if (filters.ratings.length > 0) {
      filtered = filtered.filter((p) => {
        const minRating = Math.min(...filters.ratings);
        return (p.averageRating || 0) >= minRating;
      });
    }

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
      case "featured":
        filtered.sort(
          (a, b) => (b.isFeatured ? 1 : 0) - (a.isFeatured ? 1 : 0),
        );
        break;
      default:
        filtered.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        break;
    }

    setFilteredProducts(filtered);
    setCurrentPage(1);
  };

  const handleCategoryToggle = (category) => {
    setFilters((prev) => {
      const categories = prev.categories.includes(category)
        ? prev.categories.filter((c) => c !== category)
        : [...prev.categories, category];
      return { ...prev, categories };
    });
  };

  const handleColorToggle = (color) => {
    setFilters((prev) => {
      const colors = prev.colors.includes(color)
        ? prev.colors.filter((c) => c !== color)
        : [...prev.colors, color];
      return { ...prev, colors };
    });
  };

  const handleMaterialToggle = (material) => {
    setFilters((prev) => {
      const materials = prev.materials.includes(material)
        ? prev.materials.filter((m) => m !== material)
        : [...prev.materials, material];
      return { ...prev, materials };
    });
  };

  const handleRatingToggle = (rating) => {
    setFilters((prev) => {
      const ratings = prev.ratings.includes(rating)
        ? prev.ratings.filter((r) => r !== rating)
        : [...prev.ratings, rating];
      return { ...prev, ratings };
    });
  };

  const resetFilters = () => {
    setFilters({
      categories: [],
      priceRange: { min: 0, max: 10000 },
      colors: [],
      materials: [],
      ratings: [],
      search: "",
    });
    setSortBy("newest");
  };

  // Pagination
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredProducts.slice(
    indexOfFirstItem,
    indexOfLastItem,
  );
  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);

  const ratings = [5, 4, 3, 2];

  return (
    <>
      <Header />
      <main>
        {/* Hero Section */}
        <section className="relative py-16 min-h-[400px] flex items-center">
          <div
            className="absolute inset-0 bg-cover bg-center bg-no-repeat"
            style={{
              backgroundImage: "url('/assets/images/Banner.jpg')",
              backgroundPosition: "center 30%",
            }}
          >
            <div className="absolute inset-0 bg-black/50"></div>
          </div>
          <div className="container relative z-10">
            <div className="max-w-3xl">
              <h1 className="text-4xl md:text-5xl font-bold mb-4 text-white">
                Premium Furniture For Every Space
              </h1>
              <p className="text-lg text-gray-200 mb-6">
                Discover our curated collection of high-quality furniture
                designed to elevate your home.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="relative flex-1 max-w-md">
                  <input
                    type="search"
                    placeholder="Search furniture..."
                    value={filters.search}
                    onChange={(e) =>
                      setFilters((prev) => ({
                        ...prev,
                        search: e.target.value,
                      }))
                    }
                    className="w-full px-4 py-3 pr-12 rounded-lg
               bg-white/10 border border-white/50
               text-white placeholder:text-white/70
               focus:outline-none focus:ring-2 focus:ring-[#DA4C2F]"
                  />
                  <Search className="absolute right-4 top-1/2 -translate-y-1/2 text-white w-5 h-5" />
                </div>
                <button
                  onClick={() => setShowFilters(!showFilters)}
                  className="inline-flex items-center gap-2 bg-[#DA4C2F] text-white px-6 py-3 rounded-lg hover:bg-[#c43d22] transition-colors"
                >
                  <SlidersHorizontal className="w-5 h-5" />
                  Filters
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* Product Section */}
        <section className="py-8 md:py-12">
          <div className="container">
            <div className="flex flex-col lg:flex-row gap-8">
              {/* Filters Sidebar */}
              <div
                className={`lg:w-72 flex-shrink-0 ${showFilters ? "block" : "hidden lg:block"}`}
              >
                <div className="bg-white border border-gray-200 rounded-lg p-6 sticky top-24">
                  <div className="flex justify-between items-center mb-6">
                    <h3 className="font-bold text-lg">Filters</h3>
                    <button
                      onClick={() => setShowFilters(false)}
                      className="lg:hidden text-gray-500 hover:text-gray-700"
                    >
                      <X className="w-5 h-5" />
                    </button>
                  </div>

                  {/* Categories */}
                  <div className="mb-6">
                    <h4 className="font-semibold mb-3">Categories</h4>
                    <div className="space-y-2">
                      {categories.map((cat) => (
                        <label
                          key={cat}
                          className="flex items-center gap-2 cursor-pointer"
                        >
                          <input
                            type="checkbox"
                            checked={filters.categories.includes(cat)}
                            onChange={() => handleCategoryToggle(cat)}
                            className="w-4 h-4 accent-[#DA4C2F]"
                          />
                          <span className="text-sm text-gray-700">{cat}</span>
                        </label>
                      ))}
                    </div>
                  </div>

                  {/* Price Range */}
                  <div className="mb-6">
                    <h4 className="font-semibold mb-3">Price Range</h4>
                    <div className="flex gap-2">
                      <input
                        type="number"
                        placeholder="Min"
                        value={filters.priceRange.min}
                        onChange={(e) =>
                          setFilters((prev) => ({
                            ...prev,
                            priceRange: {
                              ...prev.priceRange,
                              min:
                                e.target.value === ""
                                  ? ""
                                  : Number(e.target.value),
                            },
                          }))
                        }
                        className="w-1/2 px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#DA4C2F]"
                      />
                      <input
                        type="number"
                        placeholder="Max"
                        value={filters.priceRange.max}
                        onChange={(e) =>
                          setFilters((prev) => ({
                            ...prev,
                            priceRange: {
                              ...prev.priceRange,
                              max:
                                e.target.value === ""
                                  ? ""
                                  : Number(e.target.value),
                            },
                          }))
                        }
                        className="w-1/2 px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#DA4C2F]"
                      />
                    </div>
                  </div>

                  {/* Colors */}
                  {availableColors.length > 0 && (
                    <div className="mb-6">
                      <h4 className="font-semibold mb-3">Colors</h4>
                      <div className="flex flex-wrap gap-2">
                        {availableColors.map((color) => (
                          <button
                            key={color}
                            onClick={() => handleColorToggle(color)}
                            className={`w-8 h-8 rounded-full border-2 transition-all ${
                              filters.colors.includes(color)
                                ? "border-[#DA4C2F] ring-2 ring-[#DA4C2F]/30"
                                : "border-gray-300"
                            }`}
                            style={{
                              backgroundColor: color.toLowerCase(),
                              borderColor:
                                color === "White" ? "#d1d5db" : undefined,
                            }}
                            title={color}
                          />
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Materials */}
                  {availableMaterials.length > 0 && (
                    <div className="mb-6">
                      <h4 className="font-semibold mb-3">Materials</h4>
                      <div className="space-y-2">
                        {availableMaterials.map((mat) => (
                          <label
                            key={mat}
                            className="flex items-center gap-2 cursor-pointer"
                          >
                            <input
                              type="checkbox"
                              checked={filters.materials.includes(mat)}
                              onChange={() => handleMaterialToggle(mat)}
                              className="w-4 h-4 accent-[#DA4C2F]"
                            />
                            <span className="text-sm text-gray-700">{mat}</span>
                          </label>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Ratings */}
                  <div className="mb-6">
                    <h4 className="font-semibold mb-3">Customer Rating</h4>
                    <div className="space-y-2">
                      {ratings.map((rating) => (
                        <label
                          key={rating}
                          className="flex items-center gap-2 cursor-pointer"
                        >
                          <input
                            type="checkbox"
                            checked={filters.ratings.includes(rating)}
                            onChange={() => handleRatingToggle(rating)}
                            className="w-4 h-4 accent-[#DA4C2F]"
                          />
                          <span className="text-sm text-gray-700 flex items-center gap-1">
                            {Array.from({ length: 5 }, (_, i) => (
                              <span
                                key={i}
                                className={
                                  i < rating
                                    ? "text-yellow-400"
                                    : "text-gray-300"
                                }
                              >
                                ★
                              </span>
                            ))}
                            {rating}+
                          </span>
                        </label>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <button
                      onClick={applyFilters}
                      className="w-full bg-[#DA4C2F] text-white py-2.5 rounded-lg font-medium hover:bg-[#c43d22] transition-colors"
                    >
                      Apply Filters
                    </button>
                    <button
                      onClick={resetFilters}
                      className="w-full text-[#DA4C2F] py-2.5 rounded-lg font-medium hover:bg-gray-50 transition-colors"
                    >
                      Reset All
                    </button>
                  </div>
                </div>
              </div>

              {/* Product Grid */}
              <div className="flex-1">
                {/* Toolbar */}
                <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
                  <div className="flex items-center gap-3">
                    <span className="text-sm text-gray-600">Show:</span>
                    <select
                      value={itemsPerPage}
                      onChange={(e) =>
                        setItemsPerPage(parseInt(e.target.value))
                      }
                      className="px-3 py-1.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#DA4C2F]"
                    >
                      <option value={6}>6</option>
                      <option value={12}>12</option>
                      <option value={24}>24</option>
                      <option value={48}>48</option>
                    </select>
                  </div>

                  <div className="flex items-center gap-3">
                    <span className="text-sm text-gray-600">Sort by:</span>
                    <select
                      value={sortBy}
                      onChange={(e) => setSortBy(e.target.value)}
                      className="px-3 py-1.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#DA4C2F]"
                    >
                      <option value="newest">Newest Arrivals</option>
                      <option value="featured">Featured</option>
                      <option value="price_low">Price: Low to High</option>
                      <option value="price_high">Price: High to Low</option>
                      <option value="rating">Customer Rating</option>
                    </select>
                  </div>

                  <span className="text-sm text-gray-500">
                    {filteredProducts.length} products found
                  </span>
                </div>

                {/* Loading State */}
                {loading && (
                  <div className="flex flex-col items-center justify-center py-20">
                    <div className="w-12 h-12 border-4 border-[#DA4C2F] border-t-transparent rounded-full animate-spin"></div>
                    <p className="mt-4 text-gray-600">Loading products...</p>
                  </div>
                )}

                {/* No Products */}
                {!loading && filteredProducts.length === 0 && (
                  <div className="text-center py-20">
                    <div className="text-6xl mb-4">📦</div>
                    <h3 className="text-xl font-semibold mb-2">
                      No products found
                    </h3>
                    <p className="text-gray-600">
                      Try adjusting your filters or search terms.
                    </p>
                  </div>
                )}

                {/* Products Grid */}
                {!loading && filteredProducts.length > 0 && (
                  <>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                      {currentItems.map((product) => (
                        <ProductCard
                          key={product._id || product.id}
                          {...product}
                        />
                      ))}
                    </div>

                    {/* Pagination */}
                    {totalPages > 1 && (
                      <div className="flex flex-wrap items-center justify-between gap-4 mt-8 pt-6 border-t border-gray-200">
                        <div className="text-sm text-gray-600">
                          Showing {indexOfFirstItem + 1} to{" "}
                          {Math.min(indexOfLastItem, filteredProducts.length)}{" "}
                          of {filteredProducts.length} entries
                        </div>
                        <div className="flex gap-1">
                          <button
                            onClick={() =>
                              setCurrentPage((prev) => Math.max(prev - 1, 1))
                            }
                            disabled={currentPage === 1}
                            className="px-3 py-1.5 border border-gray-300 rounded-lg text-sm hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                          >
                            Previous
                          </button>
                          {Array.from(
                            { length: Math.min(totalPages, 5) },
                            (_, i) => {
                              const pageNum = i + 1;
                              return (
                                <button
                                  key={i}
                                  onClick={() => setCurrentPage(pageNum)}
                                  className={`px-3 py-1.5 border rounded-lg text-sm transition-colors ${
                                    currentPage === pageNum
                                      ? "bg-[#DA4C2F] text-white border-[#DA4C2F]"
                                      : "border-gray-300 hover:bg-gray-50"
                                  }`}
                                >
                                  {pageNum}
                                </button>
                              );
                            },
                          )}
                          {totalPages > 5 && (
                            <span className="px-2 py-1.5 text-gray-500">
                              ...
                            </span>
                          )}
                          <button
                            onClick={() =>
                              setCurrentPage((prev) =>
                                Math.min(prev + 1, totalPages),
                              )
                            }
                            disabled={currentPage === totalPages}
                            className="px-3 py-1.5 border border-gray-300 rounded-lg text-sm hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                          >
                            Next
                          </button>
                        </div>
                      </div>
                    )}
                  </>
                )}
              </div>
            </div>
          </div>
        </section>

        {/* Banner Section */}
        <section className="py-12 md:py-16 bg-white">
          <div className="container">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="banner-card">
                <div
                  className="banner-bg"
                  style={{ backgroundImage: "url('/assets/images/p3.jpg')" }}
                ></div>
                <div className="banner-overlay"></div>
                <div className="banner-content">
                  <p className="text-sm uppercase tracking-wider mb-2 opacity-80">
                    New Arrivals
                  </p>
                  <h2 className="text-2xl md:text-3xl font-bold mb-4 leading-tight">
                    Spring Collection 2025
                  </h2>
                  <a
                    href="#"
                    className="btn-secondary inline-flex items-center gap-2"
                  >
                    Explore More
                  </a>
                </div>
              </div>
              <div className="banner-card">
                <div
                  className="banner-bg"
                  style={{ backgroundImage: "url('/assets/images/p6.jpg')" }}
                ></div>
                <div className="banner-overlay"></div>
                <div className="banner-content">
                  <h2 className="text-2xl md:text-3xl font-bold mb-3 leading-tight">
                    Custom Furniture Solutions
                  </h2>
                  <p className="text-sm opacity-90 mb-4 max-w-sm">
                    Can't find exactly what you're looking for? Our design team
                    can create custom pieces tailored to your space.
                  </p>
                  <a
                    href="#"
                    className="btn-secondary inline-flex items-center gap-2"
                  >
                    Learn More
                  </a>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
