import { useState, useEffect } from "react";
import Header from "../components/layout/Header";
import Footer from "../components/layout/Footer";
import ProductCard from "../components/common/ProductCard";
import { Search, SlidersHorizontal, X } from "lucide-react";

export default function Office() {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState({
    categories: ["Desks", "Chairs", "Storage", "Conference", "Accessories"],
    priceRange: { min: 0, max: 5000 },
    colors: [],
    materials: [],
    ratings: [],
    search: "",
  });
  const [sortBy, setSortBy] = useState("featured");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(12);

  // Mock product data for office
  useEffect(() => {
    const mockProducts = [
      {
        id: 1,
        name: "Executive Desk",
        price: "ETB 85,000",
        originalPrice: "ETB 105,000",
        image: "/assets/images/Office1.jpg",
        rating: 4.0,
        reviews: 4733,
        discount: "-20%",
        category: "Desks",
        color: "Wood",
        material: "Wood",
      },
      {
        id: 2,
        name: "Classic Office Desk",
        price: "ETB 90,000",
        originalPrice: "ETB 115,000",
        image: "/assets/images/Office2.jpg",
        rating: 3.5,
        reviews: 2753,
        category: "Desks",
        color: "Brown",
        material: "Wood",
      },
      {
        id: 3,
        name: "File Cabinet",
        price: "ETB 17,500",
        originalPrice: "ETB 25,000",
        image: "/assets/images/File Cabinet.jpg",
        rating: 4.3,
        reviews: 1810,
        category: "Storage",
        color: "Silver",
        material: "Metal",
      },
      {
        id: 4,
        name: "Ergonomic Chair",
        price: "ETB 14,000",
        originalPrice: "ETB 16,000",
        image: "/assets/images/Chair.jpg",
        rating: 4.3,
        reviews: 2052,
        discount: "-20%",
        category: "Chairs",
        color: "Gray",
        material: "Fabric",
      },
      {
        id: 5,
        name: "Modern Shelves",
        price: "ETB 10,350",
        originalPrice: "ETB 11,500",
        image: "/assets/images/Shelves.jpg",
        rating: 5.0,
        reviews: 2540,
        discount: "-10%",
        category: "Storage",
        color: "Silver",
        material: "Metal",
      },
      {
        id: 6,
        name: "Office Desk",
        price: "ETB 75,000",
        originalPrice: "ETB 85,000",
        image: "/assets/images/Office5.jpg",
        rating: 4.3,
        reviews: 3450,
        category: "Desks",
        color: "Gray",
        material: "Metal",
      },
      {
        id: 7,
        name: "Conference Table",
        price: "ETB 120,000",
        originalPrice: "ETB 150,000",
        image: "/assets/images/Office4.jpg",
        rating: 4.6,
        reviews: 890,
        discount: "-10%",
        category: "Conference",
        color: "Wood",
        material: "Wood",
      },
      {
        id: 8,
        name: "Office Chair",
        price: "ETB 22,000",
        originalPrice: "ETB 28,000",
        image: "/assets/images/Chair.jpg",
        rating: 4.1,
        reviews: 1200,
        category: "Chairs",
        color: "Black",
        material: "Leather",
      },
      {
        id: 9,
        name: "Bookcase",
        price: "ETB 18,500",
        originalPrice: "ETB 24,000",
        image: "/assets/images/Shelves.jpg",
        rating: 4.4,
        reviews: 560,
        category: "Storage",
        color: "Wood",
        material: "Wood",
      },
      {
        id: 10,
        name: "Laptop Stand",
        price: "ETB 5,500",
        originalPrice: "ETB 7,500",
        image: "/assets/images/Office1.jpg",
        rating: 4.8,
        reviews: 340,
        discount: "-15%",
        category: "Accessories",
        color: "Silver",
        material: "Metal",
      },
      {
        id: 11,
        name: "Meeting Table",
        price: "ETB 95,000",
        originalPrice: "ETB 115,000",
        image: "/assets/images/Office5.jpg",
        rating: 4.2,
        reviews: 430,
        category: "Conference",
        color: "Brown",
        material: "Wood",
      },
      {
        id: 12,
        name: "Desk Organizer",
        price: "ETB 3,500",
        originalPrice: "ETB 4,500",
        image: "/assets/images/File Cabinet.jpg",
        rating: 4.7,
        reviews: 210,
        discount: "-10%",
        category: "Accessories",
        color: "Black",
        material: "Plastic",
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

    if (filters.search) {
      filtered = filtered.filter(
        (p) =>
          p.name.toLowerCase().includes(filters.search.toLowerCase()) ||
          p.category.toLowerCase().includes(filters.search.toLowerCase()),
      );
    }

    if (filters.categories.length > 0) {
      filtered = filtered.filter((p) =>
        filters.categories.includes(p.category),
      );
    }

    filtered = filtered.filter((p) => {
      const price = parseFloat(p.price.replace(/[^0-9.]/g, ""));
      return price >= filters.priceRange.min && price <= filters.priceRange.max;
    });

    if (filters.colors.length > 0) {
      filtered = filtered.filter((p) => filters.colors.includes(p.color));
    }

    if (filters.materials.length > 0) {
      filtered = filtered.filter((p) => filters.materials.includes(p.material));
    }

    if (filters.ratings.length > 0) {
      filtered = filtered.filter((p) => {
        const minRating = Math.min(...filters.ratings);
        return p.rating >= minRating;
      });
    }

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
      default:
        break;
    }

    setFilteredProducts(filtered);
    setCurrentPage(1);
  };

  const categories = [
    "Desks",
    "Chairs",
    "Storage",
    "Conference",
    "Accessories",
  ];
  const colors = ["Black", "White", "Brown", "Silver", "Gray", "Blue"];
  const materials = ["Wood", "Metal", "Fabric", "Leather", "Plastic"];
  const ratings = [5, 4, 3, 2];

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredProducts.slice(
    indexOfFirstItem,
    indexOfLastItem,
  );
  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);

  return (
    <>
      <Header />
      <main>
        {/* Hero Section */}
        <section className="relative py-16 min-h-[400px] flex items-center">
          <div
            className="absolute inset-0 bg-cover bg-center bg-no-repeat"
            style={{
              backgroundImage: "url('/assets/images/Officebanner.png')",
              backgroundPosition: "center 40%",
            }}
          >
            <div className="absolute inset-0 bg-black/50"></div>
          </div>
          <div className="container relative z-10">
            <div className="max-w-3xl">
              <h1 className="text-4xl md:text-5xl font-bold mb-4 text-white">
                Professional Office Furniture
              </h1>
              <p className="text-lg text-gray-200 mb-6">
                Discover ergonomic and stylish office furniture designed to
                enhance productivity and comfort.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="relative flex-1 max-w-md">
                  <input
                    type="search"
                    placeholder="Search office furniture..."
                    value={filters.search}
                    onChange={(e) =>
                      setFilters((prev) => ({
                        ...prev,
                        search: e.target.value,
                      }))
                    }
                    className="w-full px-4 py-3 pr-12 rounded-lg bg-transparent border border-white text-white placeholder-white focus:outline-none focus:ring-2 focus:ring-[#DA4C2F]"
                  />
                  <Search className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
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
                            onChange={() => {
                              setFilters((prev) => {
                                const categories = prev.categories.includes(cat)
                                  ? prev.categories.filter((c) => c !== cat)
                                  : [...prev.categories, cat];
                                return { ...prev, categories };
                              });
                            }}
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
                          onClick={() => {
                            setFilters((prev) => {
                              const colors = prev.colors.includes(color)
                                ? prev.colors.filter((c) => c !== color)
                                : [...prev.colors, color];
                              return { ...prev, colors };
                            });
                          }}
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
                            onChange={() => {
                              setFilters((prev) => {
                                const materials = prev.materials.includes(mat)
                                  ? prev.materials.filter((m) => m !== mat)
                                  : [...prev.materials, mat];
                                return { ...prev, materials };
                              });
                            }}
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
                            onChange={() => {
                              setFilters((prev) => {
                                const ratings = prev.ratings.includes(rating)
                                  ? prev.ratings.filter((r) => r !== rating)
                                  : [...prev.ratings, rating];
                                return { ...prev, ratings };
                              });
                            }}
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
                      onClick={() => {
                        setFilters({
                          categories: [
                            "Desks",
                            "Chairs",
                            "Storage",
                            "Conference",
                            "Accessories",
                          ],
                          priceRange: { min: 0, max: 5000 },
                          colors: [],
                          materials: [],
                          ratings: [],
                          search: "",
                        });
                        setSortBy("featured");
                      }}
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
                  style={{
                    backgroundImage: "url('/assets/images/Office4.jpg')",
                  }}
                ></div>
                <div className="banner-overlay"></div>
                <div className="banner-content">
                  <p className="text-sm uppercase tracking-wider mb-2 opacity-80">
                    Ergonomic Solutions
                  </p>
                  <h2 className="text-2xl md:text-3xl font-bold mb-4 leading-tight">
                    Boost Productivity & Comfort
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
                  style={{
                    backgroundImage: "url('/assets/images/Office5.jpg')",
                  }}
                ></div>
                <div className="banner-overlay"></div>
                <div className="banner-content">
                  <h2 className="text-2xl md:text-3xl font-bold mb-3 leading-tight">
                    Custom Office Solutions
                  </h2>
                  <p className="text-sm opacity-90 mb-4 max-w-sm">
                    Need furniture for a specific office layout? Our design team
                    can create custom solutions for your workspace.
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
