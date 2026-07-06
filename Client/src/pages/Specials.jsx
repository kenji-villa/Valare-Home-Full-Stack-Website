import { useState, useEffect } from "react";
import Header from "../components/layout/Header";
import Footer from "../components/layout/Footer";
import { Sparkles, Eye, Award, Clock, Star } from "lucide-react";

const specialProducts = [
  {
    id: 1,
    name: "Artisan Oak Dining Table",
    description:
      "Hand-carved from 200-year-old oak, this masterpiece combines rustic charm with modern elegance. Each piece tells a unique story through its natural grain patterns.",
    image: "/assets/images/p6.jpg",
    category: "Limited Edition",
    designer: "Elena V.",
    year: "2025",
    price: "Display Only",
  },
  {
    id: 2,
    name: "Velvet Royal Lounge Chair",
    description:
      "Inspired by 18th-century French design, this chair features hand-tufted velvet and solid mahogany legs. A true statement piece for the discerning collector.",
    image: "/assets/images/p3.jpg",
    category: "Collector's Item",
    designer: "Marcus T.",
    year: "2024",
    price: "Display Only",
  },
  {
    id: 3,
    name: "Minimalist Marble Coffee Table",
    description:
      "A perfect fusion of form and function. The Carrara marble top sits on a geometric brass base, creating a sculpture that doubles as furniture.",
    image: "/assets/images/p5.jpg",
    category: "Designer Series",
    designer: "Sophia L.",
    year: "2025",
    price: "Display Only",
  },
  {
    id: 4,
    name: "Bamboo Zen Bookshelf",
    description:
      "Sustainable bamboo construction meets minimalist design. This bookshelf features an asymmetrical design that creates visual interest while maintaining perfect balance.",
    image: "/assets/images/Shelves.jpg",
    category: "Eco Collection",
    designer: "Hiroshi N.",
    year: "2024",
    price: "Display Only",
  },
  {
    id: 5,
    name: "Industrial Loft Desk",
    description:
      "Raw steel and reclaimed wood combine to create a workspace that's both rugged and refined. Each piece is hand-finished with a protective matte coating.",
    image: "/assets/images/Office1.jpg",
    category: "Urban Collection",
    designer: "Alex R.",
    year: "2025",
    price: "Display Only",
  },
  {
    id: 6,
    name: "Sculptural Floor Lamp",
    description:
      "More than just lighting—this is a sculptural piece that casts beautiful shadows. The hand-blown glass shade creates a warm, ambient glow.",
    image: "/assets/images/File Cabinet.jpg",
    category: "Artisan Series",
    designer: "Isabella M.",
    year: "2024",
    price: "Display Only",
  },
];

export default function Specials() {
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [filteredProducts, setFilteredProducts] = useState(specialProducts);

  const categories = [
    "All",
    "Limited Edition",
    "Collector's Item",
    "Designer Series",
    "Eco Collection",
    "Urban Collection",
    "Artisan Series",
  ];

  useEffect(() => {
    if (selectedCategory === "All") {
      setFilteredProducts(specialProducts);
    } else {
      setFilteredProducts(
        specialProducts.filter((p) => p.category === selectedCategory),
      );
    }
  }, [selectedCategory]);

  return (
    <>
      <Header />
      <main className="bg-gray-50 min-h-screen">
        {/* Hero Section */}
        <section className="relative py-16 min-h-[350px] flex items-center">
          <div
            className="absolute inset-0 bg-cover bg-center bg-no-repeat"
            style={{
              backgroundImage: "url('/assets/images/specialsbanner.png')",
              backgroundPosition: "center 30%",
            }}
          >
            <div className="absolute inset-0 bg-black/50"></div>
          </div>
          <div className="container relative z-10">
            <div className="max-w-3xl mx-auto text-center">
              <Sparkles className="w-16 h-16 mx-auto mb-4 text-[#DA4C2F]" />
              <h1 className="text-4xl md:text-5xl font-bold mb-4 text-white">
                Exclusive Specials
              </h1>
              <p className="text-lg text-gray-200">
                Discover unique, one-of-a-kind pieces crafted by master
                artisans. These exclusive creations are available for viewing
                and inspiration.
              </p>
              <div className="flex flex-wrap items-center justify-center gap-4 mt-6 text-sm">
                <span className="flex items-center gap-2 bg-white/10 px-4 py-2 rounded-full text-white">
                  <Award className="w-4 h-4 text-[#DA4C2F]" />
                  Curated Collection
                </span>
                <span className="flex items-center gap-2 bg-white/10 px-4 py-2 rounded-full text-white">
                  <Clock className="w-4 h-4 text-[#DA4C2F]" />
                  Limited Availability
                </span>
                <span className="flex items-center gap-2 bg-white/10 px-4 py-2 rounded-full text-white">
                  <Star className="w-4 h-4 text-[#DA4C2F]" />
                  Master Craftsmanship
                </span>
              </div>
            </div>
          </div>
        </section>

        {/* Filters */}
        <div className="container py-6">
          <div className="flex flex-wrap justify-center gap-2">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                  selectedCategory === category
                    ? "bg-[#DA4C2F] text-white shadow-md"
                    : "bg-white text-gray-600 hover:bg-gray-100"
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        </div>

        {/* Products Grid */}
        <div className="container pb-12">
          {filteredProducts.length === 0 ? (
            <div className="text-center py-12 bg-white rounded-lg shadow-sm">
              <div className="text-6xl mb-4">🔍</div>
              <h3 className="text-xl font-semibold text-gray-800 mb-2">
                No products in this category
              </h3>
              <p className="text-gray-600">
                Check back later for new additions.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredProducts.map((product) => (
                <div
                  key={product.id}
                  className="bg-white rounded-lg overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 group"
                >
                  <div className="relative overflow-hidden">
                    <img
                      src={product.image}
                      alt={product.name}
                      className="w-full h-64 object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute top-3 left-3">
                      <span className="bg-[#DA4C2F] text-white text-xs font-bold px-3 py-1 rounded-full">
                        {product.category}
                      </span>
                    </div>
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-all flex items-center justify-center opacity-0 group-hover:opacity-100">
                      <div className="bg-white rounded-full p-3 shadow-lg">
                        <Eye className="w-6 h-6 text-[#DA4C2F]" />
                      </div>
                    </div>
                    <div className="absolute top-3 right-3 bg-black/50 text-white px-3 py-1 rounded-full text-xs font-medium">
                      Display Only
                    </div>
                  </div>
                  <div className="p-6">
                    <div className="flex items-start justify-between mb-2">
                      <h3 className="text-lg font-bold text-gray-800">
                        {product.name}
                      </h3>
                    </div>
                    <p className="text-sm text-gray-600 mb-3">
                      {product.description}
                    </p>
                    <div className="flex flex-wrap items-center gap-3 text-sm text-gray-500">
                      <span className="flex items-center gap-1">
                        <Award className="w-4 h-4 text-[#DA4C2F]" />
                        {product.designer}
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock className="w-4 h-4 text-[#DA4C2F]" />
                        {product.year}
                      </span>
                    </div>
                    <div className="mt-3 pt-3 border-t border-gray-100 flex items-center justify-between">
                      <span className="text-xs text-gray-400">
                        For Display Only • Not For Sale
                      </span>
                      <span className="text-sm font-medium text-[#DA4C2F]">
                        View Details →
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Info Banner */}
        <div className="bg-[#DA4C2F]/10 border-t border-b border-[#DA4C2F]/20 py-8">
          <div className="container text-center">
            <p className="text-gray-700 max-w-2xl mx-auto">
              <span className="font-semibold">💡 Did you know?</span> These
              special pieces are part of our curated collection. While they're
              display-only, they represent the pinnacle of our craftsmanship.
              <span className="block mt-2 text-sm text-[#DA4C2F] font-medium">
                Want something similar? Our design team can create a custom
                piece just for you!
              </span>
            </p>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
