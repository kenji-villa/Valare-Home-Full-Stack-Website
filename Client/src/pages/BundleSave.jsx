import { useState } from "react";
import { Link } from "react-router-dom";
import Header from "../components/layout/Header";
import Footer from "../components/layout/Footer";
import {
  ShoppingBag,
  Percent,
  CheckCircle,
  ArrowRight,
  Sparkles,
  Tag,
  Package,
  Truck,
} from "lucide-react";

export default function BundleSave() {
  const [selectedBundle, setSelectedBundle] = useState(null);

  const bundles = [
    {
      id: 1,
      name: "Living Room Bundle",
      description:
        "Complete your living space with our curated collection of premium furniture.",
      items: [
        "Modern Sectional Sofa",
        "Coffee Table",
        "Floor Lamp",
        "Area Rug",
      ],
      originalPrice: 2450,
      bundlePrice: 1999,
      savings: 451,
      discount: 18,
      image: "/assets/images/p1.jpg",
    },
    {
      id: 2,
      name: "Office Pro Bundle",
      description:
        "Create the ultimate home office with ergonomic and stylish furniture.",
      items: [
        "Ergonomic Chair",
        "Executive Desk",
        "Desk Organizer",
        "Task Lamp",
      ],
      originalPrice: 1850,
      bundlePrice: 1499,
      savings: 351,
      discount: 19,
      image: "/assets/images/Office1.jpg",
    },
    {
      id: 3,
      name: "Bedroom Suite Bundle",
      description:
        "Transform your bedroom into a sanctuary with our matching collection.",
      items: ["Master Bed Frame", "Nightstand (2)", "Dresser", "Mirror"],
      originalPrice: 3200,
      bundlePrice: 2599,
      savings: 601,
      discount: 19,
      image: "/assets/images/p2.jpg",
    },
    {
      id: 4,
      name: "Dining Set Bundle",
      description: "Enjoy memorable meals with our elegant dining collection.",
      items: ["Dining Table", "Dining Chairs (6)", "Sideboard", "Chandelier"],
      originalPrice: 2800,
      bundlePrice: 2299,
      savings: 501,
      discount: 18,
      image: "/assets/images/p6.jpg",
    },
    {
      id: 5,
      name: "Outdoor Living Bundle",
      description:
        "Extend your living space outdoors with our durable patio collection.",
      items: [
        "Outdoor Sofa Set",
        "Coffee Table",
        "Outdoor Rug",
        "Patio Heater",
      ],
      originalPrice: 2100,
      bundlePrice: 1699,
      savings: 401,
      discount: 19,
      image: "/assets/images/Kids_furniture.jpg",
    },
    {
      id: 6,
      name: "Study & Reading Bundle",
      description:
        "Create a cozy reading nook or study space with these essentials.",
      items: ["Bookshelf", "Reading Chair", "Floor Lamp", "Side Table"],
      originalPrice: 1600,
      bundlePrice: 1299,
      savings: 301,
      discount: 19,
      image: "/assets/images/Shelves.jpg",
    },
  ];

  return (
    <>
      <Header />
      <main className="bg-gray-50 min-h-screen">
        {/* Hero Section */}
        <section className="relative py-16 min-h-[350px] flex items-center">
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
            <div className="max-w-3xl mx-auto text-center">
              <Tag className="w-16 h-16 mx-auto mb-4 text-[#DA4C2F]" />
              <h1 className="text-4xl md:text-5xl font-bold mb-4 text-white">
                Bundle & Save
              </h1>
              <p className="text-lg text-gray-200">
                Save up to 20% when you purchase furniture bundles. The perfect
                way to furnish your space.
              </p>
            </div>
          </div>
        </section>

        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 max-w-3xl mx-auto">
          <div className="bg-white rounded-lg p-6 shadow-sm text-center border border-gray-100">
            <div className="text-3xl font-bold text-[#DA4C2F]">6</div>
            <div className="text-sm text-gray-600 mt-1">Curated Bundles</div>
          </div>
          <div className="bg-white rounded-lg p-6 shadow-sm text-center border border-gray-100">
            <div className="text-3xl font-bold text-[#DA4C2F]">30+</div>
            <div className="text-sm text-gray-600 mt-1">Premium Items</div>
          </div>
          <div className="bg-white rounded-lg p-6 shadow-sm text-center border border-gray-100">
            <div className="text-3xl font-bold text-[#DA4C2F]">100%</div>
            <div className="text-sm text-gray-600 mt-1">
              Satisfaction Guaranteed
            </div>
          </div>
        </div>

        {/* Bundles Grid */}
        <div className="container py-12">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {bundles.map((bundle) => (
              <div
                key={bundle.id}
                className="bg-white rounded-lg overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 group"
              >
                <div className="relative">
                  <img
                    src={bundle.image}
                    alt={bundle.name}
                    className="w-full h-56 object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute top-3 right-3 bg-[#DA4C2F] text-white px-3 py-1 rounded-full text-sm font-bold">
                    Save {bundle.discount}%
                  </div>
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-bold text-[#1a2d5e] mb-2">
                    {bundle.name}
                  </h3>
                  <p className="text-sm text-gray-600 mb-4">
                    {bundle.description}
                  </p>

                  <div className="mb-4">
                    <p className="text-sm font-medium text-gray-700 mb-2">
                      Includes:
                    </p>
                    <ul className="space-y-1">
                      {bundle.items.map((item, index) => (
                        <li
                          key={index}
                          className="flex items-center gap-2 text-sm text-gray-600"
                        >
                          <CheckCircle className="w-4 h-4 text-green-500" />
                          {item}
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="flex items-end justify-between pt-4 border-t border-gray-100">
                    <div>
                      <div className="text-sm text-gray-400 line-through">
                        ETB {bundle.originalPrice.toLocaleString()}
                      </div>
                      <div className="text-2xl font-bold text-[#DA4C2F]">
                        ETB {bundle.bundlePrice.toLocaleString()}
                      </div>
                      <div className="text-xs text-green-600">
                        Save ETB {bundle.savings.toLocaleString()}
                      </div>
                    </div>
                    <button
                      onClick={() => setSelectedBundle(bundle.id)}
                      className="bg-[#DA4C2F] text-white px-4 py-2 rounded-lg font-medium hover:bg-[#c43d22] transition-colors flex items-center gap-2"
                    >
                      <ShoppingBag className="w-4 h-4" />
                      Select
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* How It Works */}
        <section className="bg-white py-12">
          <div className="container">
            <h2 className="text-2xl font-bold text-[#1a2d5e] text-center mb-8">
              How It Works
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="text-center">
                <div className="w-16 h-16 mx-auto bg-[#DA4C2F]/10 rounded-full flex items-center justify-center mb-4">
                  <span className="text-2xl font-bold text-[#DA4C2F]">1</span>
                </div>
                <h4 className="font-semibold text-gray-800 mb-2">
                  Choose Your Bundle
                </h4>
                <p className="text-sm text-gray-600">
                  Select from our curated furniture bundles
                </p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 mx-auto bg-[#DA4C2F]/10 rounded-full flex items-center justify-center mb-4">
                  <span className="text-2xl font-bold text-[#DA4C2F]">2</span>
                </div>
                <h4 className="font-semibold text-gray-800 mb-2">
                  Customize & Save
                </h4>
                <p className="text-sm text-gray-600">
                  Enjoy instant savings on your bundle purchase
                </p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 mx-auto bg-[#DA4C2F]/10 rounded-full flex items-center justify-center mb-4">
                  <span className="text-2xl font-bold text-[#DA4C2F]">3</span>
                </div>
                <h4 className="font-semibold text-gray-800 mb-2">
                  Delivery & Setup
                </h4>
                <p className="text-sm text-gray-600">
                  We'll deliver and set up your new furniture
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Why Bundle */}
        <section className="container py-12">
          <div className="bg-gradient-to-r from-[#1a2d5e] to-[#243b7a] rounded-lg p-8 text-white">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center">
                <Package className="w-10 h-10 mx-auto mb-3 text-[#DA4C2F]" />
                <h4 className="font-semibold mb-2">Curated Collections</h4>
                <p className="text-sm text-gray-300">
                  Designed by experts for perfect harmony
                </p>
              </div>
              <div className="text-center">
                <Percent className="w-10 h-10 mx-auto mb-3 text-[#DA4C2F]" />
                <h4 className="font-semibold mb-2">Exclusive Savings</h4>
                <p className="text-sm text-gray-300">
                  Save more when you bundle
                </p>
              </div>
              <div className="text-center">
                <Truck className="w-10 h-10 mx-auto mb-3 text-[#DA4C2F]" />
                <h4 className="font-semibold mb-2">Free Delivery</h4>
                <p className="text-sm text-gray-300">On all bundle orders</p>
              </div>
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="container pb-12">
          <div className="bg-[#DA4C2F]/10 rounded-lg p-8 text-center border border-[#DA4C2F]/20">
            <h3 className="text-2xl font-bold text-[#1a2d5e] mb-3">
              Can't Find What You're Looking For?
            </h3>
            <p className="text-gray-600 mb-4">
              Create your own custom bundle and get personalized savings
            </p>
            <Link
              to="/contact"
              className="inline-flex items-center gap-2 bg-[#DA4C2F] text-white px-6 py-3 rounded-lg font-medium hover:bg-[#c43d22] transition-colors"
            >
              Contact Us <ArrowRight className="w-5 h-5" />
            </Link>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
