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

export default function HomeFurniture() {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState({
    categories: ["Living Room", "Bedroom", "Dining", "Outdoor"],
    priceRange: { min: 0, max: 5000 },
    colors: [],
    materials: [],
    ratings: [],
    search: "",
  });
  const [sortBy, setSortBy] = useState("featured");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(12);

  // Mock product data - In production, this would come from an API
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
        color: "Brown",
        material: "Fabric",
      },
      {
        id: 2,
        name: "Master Bed",
        price: "ETB 110,000",
        originalPrice: "ETB 150,000",
        image: "/assets/images/p2.jpg",
        rating: 4.8,
        reviews: 5210,
        category: "Bedroom",
        color: "Wood",
        material: "Wood",
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
        color: "Gray",
        material: "Fabric",
      },
      {
        id: 4,
        name: "Leather Sofa",
        price: "ETB 60,000",
        originalPrice: "ETB 80,000",
        image: "/assets/images/p4.jpg",
        rating: 4.2,
        reviews: 1852,
        discount: "-20%",
        category: "Living Room",
        color: "Black",
        material: "Leather",
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
        color: "Silver",
        material: "Fabric",
      },
      {
        id: 6,
        name: "Dining Table",
        price: "ETB 25,000",
        originalPrice: "ETB 35,000",
        image: "/assets/images/p6.jpg",
        rating: 4.0,
        reviews: 1660,
        category: "Dining",
        color: "Wood",
        material: "Wood",
      },
      {
        id: 7,
        name: "Minimal Closet",
        price: "ETB 35,000",
        originalPrice: "ETB 50,000",
        image: "/assets/images/File Cabinet.jpg",
        rating: 4.1,
        reviews: 2100,
        discount: "-15%",
        category: "Bedroom",
        color: "White",
        material: "Wood",
      },
      {
        id: 8,
        name: "Outdoor Lounge Set",
        price: "ETB 55,000",
        originalPrice: "ETB 70,000",
        image: "/assets/images/Kids_furniture.jpg",
        rating: 4.4,
        reviews: 890,
        category: "Outdoor",
        color: "Gray",
        material: "Metal",
      },
      {
        id: 9,
        name: "Study Desk",
        price: "ETB 18,000",
        originalPrice: "ETB 25,000",
        image: "/assets/images/Office1.jpg",
        rating: 4.6,
        reviews: 450,
        category: "Bedroom",
        color: "Wood",
        material: "Wood",
      },
      {
        id: 10,
        name: "Dining Chairs Set",
        price: "ETB 32,000",
        originalPrice: "ETB 42,000",
        image: "/assets/images/Chair.jpg",
        rating: 4.2,
        reviews: 1200,
        category: "Dining",
        color: "Brown",
        material: "Wood",
      },
      {
        id: 11,
        name: "Bookshelf",
        price: "ETB 15,000",
        originalPrice: "ETB 20,000",
        image: "/assets/images/Shelves.jpg",
        rating: 4.7,
        reviews: 780,
        discount: "-10%",
        category: "Living Room",
        color: "Wood",
        material: "Wood",
      },
      {
        id: 12,
        name: "Nightstand Set",
        price: "ETB 8,500",
        originalPrice: "ETB 12,000",
        image: "/assets/images/Office5.jpg",
        rating: 4.0,
        reviews: 340,
        category: "Bedroom",
        color: "White",
        material: "Wood",
      },
    ];

    setTimeout(() => {
      setProducts(mockProducts);
      setFilteredProducts(mockProducts);
      setLoading(false);
    }, 500);
  }, []);

  useEffect(() => {
    applyFilters();
  }, [filters, sortBy]);

  const applyFilters = () => {
    let filtered = [...products];

    // Search filter
    if (filters.search) {
      filtered = filtered.filter(
        (p) =>
          p.name.toLowerCase().includes(filters.search.toLowerCase()) ||
          p.category.toLowerCase().includes(filters.search.toLowerCase()),
      );
    }

    // Category filter
    if (filters.categories.length > 0) {
      filtered = filtered.filter((p) =>
        filters.categories.includes(p.category),
      );
    }

    // Price filter
    filtered = filtered.filter((p) => {
      const price = parseFloat(p.price.replace(/[^0-9.]/g, ""));
      return price >= filters.priceRange.min && price <= filters.priceRange.max;
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
        return p.rating >= minRating;
      });
    }

    // Sort
    switch (sortBy) {
      case "price_low":
        filtered.sort(
          (a, b) =>
            parseFloat(a.price.replace(/[^0-9.]/g, "")) -
            parseFloat(b.price.replace(/[^0-9.]/g, "")),
        );
        break;
      case "price_high":
        filtered.sort(
          (a, b) =>
            parseFloat(b.price.replace(/[^0-9.]/g, "")) -
            parseFloat(a.price.replace(/[^0-9.]/g, "")),
        );
        break;
      case "rating":
        filtered.sort((a, b) => b.rating - a.rating);
        break;
      case "newest":
        filtered.sort((a, b) => b.id - a.id);
        break;
      default:
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
      categories: ["Living Room", "Bedroom", "Dining", "Outdoor"],
      priceRange: { min: 0, max: 5000 },
      colors: [],
      materials: [],
      ratings: [],
      search: "",
    });
    setSortBy("featured");
  };

  // Pagination
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredProducts.slice(
    indexOfFirstItem,
    indexOfLastItem,
  );
  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);

  const categories = ["Living Room", "Bedroom", "Dining", "Outdoor"];
  const colors = ["Black", "White", "Brown", "Silver", "Wood", "Gray"];
  const materials = ["Wood", "Metal", "Fabric", "Leather", "Plastic"];
  const ratings = [5, 4, 3, 2];

  return (
    <>
      <Header />
      <main>
        {/* Hero Section */}
        {/* Hero Section */}
        <section className="relative py-16 min-h-[400px] flex items-center">
          <div
            className="absolute inset-0 bg-cover bg-center bg-no-repeat"
            style={{
              backgroundImage: "url('/assets/images/Homebanner.png')",
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
                    className="w-full px-4 py-3 pr-12 rounded-lg bg-transparent border border-white text-white placeholder-white focus:outline-none focus:ring-2 focus:ring-[#DA4C2F]"
                  />
                  <Search className="absolute right-4 top-1/2 -translate-y-1/2 text-white-400 w-5 h-5" />
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
                              min: parseInt(e.target.value) || 0,
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
                              max: parseInt(e.target.value) || 5000,
                            },
                          }))
                        }
                        className="w-1/2 px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#DA4C2F]"
                      />
                    </div>
                  </div>

                  {/* Colors */}
                  <div className="mb-6">
                    <h4 className="font-semibold mb-3">Colors</h4>
                    <div className="flex flex-wrap gap-2">
                      {colors.map((color) => (
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

                  {/* Materials */}
                  <div className="mb-6">
                    <h4 className="font-semibold mb-3">Materials</h4>
                    <div className="space-y-2">
                      {materials.map((mat) => (
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
                      <option value="featured">Featured</option>
                      <option value="price_low">Price: Low to High</option>
                      <option value="price_high">Price: High to Low</option>
                      <option value="rating">Customer Rating</option>
                      <option value="newest">Newest Arrivals</option>
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
                        <ProductCard key={product.id} {...product} />
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
                          {Array.from({ length: totalPages }, (_, i) => (
                            <button
                              key={i}
                              onClick={() => setCurrentPage(i + 1)}
                              className={`px-3 py-1.5 border rounded-lg text-sm transition-colors ${
                                currentPage === i + 1
                                  ? "bg-[#DA4C2F] text-white border-[#DA4C2F]"
                                  : "border-gray-300 hover:bg-gray-50"
                              }`}
                            >
                              {i + 1}
                            </button>
                          ))}
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
