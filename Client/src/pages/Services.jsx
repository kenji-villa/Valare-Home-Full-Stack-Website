import Header from "../components/layout/Header";
import Footer from "../components/layout/Footer";
import {
  Hammer,
  Paintbrush,
  Wrench,
  Truck,
  Brush,
  Plug,
  CheckCircle,
} from "lucide-react";

const services = [
  {
    icon: Hammer,
    title: "Custom Furniture",
    description:
      "Handcrafted furniture tailored to your style and space, built with premium wood and lasting durability.",
    color: "#DA4C2F",
  },
  {
    icon: Paintbrush,
    title: "Furniture Painting",
    description:
      "Professional repainting and polishing services to give your old furniture a brand-new look.",
    color: "#8B5CF6",
  },
  {
    icon: Wrench,
    title: "Repair & Restoration",
    description:
      "Expert repair of broken chairs, tables, and sofas to restore comfort and elegance.",
    color: "#059669",
  },
  {
    icon: Truck,
    title: "Home Delivery",
    description:
      "Safe and reliable delivery of all furniture items directly to your doorstep.",
    color: "#2563EB",
  },
  {
    icon: Brush,
    title: "Cleaning Services",
    description:
      "Deep cleaning of sofas, cushions, and wooden furniture to maintain freshness and hygiene.",
    color: "#D97706",
  },
  {
    icon: Plug,
    title: "Smart Furniture Setup",
    description:
      "Installation of smart furniture with lighting, charging ports, and modern features for convenience.",
    color: "#7C3AED",
  },
];

export default function Services() {
  return (
    <>
      <Header />
      <main className="bg-gray-50 min-h-screen">
        {/* Hero Section */}
        <section className="relative py-16 min-h-[350px] flex items-center">
          <div
            className="absolute inset-0 bg-cover bg-center bg-no-repeat"
            style={{
              backgroundImage: "url('/assets/images/servicesbanner.png')",
              backgroundPosition: "center 35%",
            }}
          >
            <div className="absolute inset-0 bg-black/55"></div>
          </div>
          <div className="container relative z-10">
            <div className="max-w-3xl mx-auto text-center">
              <h1 className="text-4xl md:text-5xl font-bold mb-4 text-white">
                Our Services
              </h1>
              <p className="text-lg text-gray-200">
                From custom creations to expert repairs, we bring your furniture
                dreams to life
              </p>
            </div>
          </div>
        </section>

        {/* Services Grid */}
        <section className="container py-12">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {services.map((service, index) => {
              const Icon = service.icon;
              return (
                <div
                  key={index}
                  className="bg-white rounded-lg p-8 shadow-sm hover:shadow-xl transition-all duration-300 group border-t-4"
                  style={{ borderTopColor: service.color }}
                >
                  <div
                    className="w-16 h-16 rounded-full flex items-center justify-center mb-4 transition-colors group-hover:scale-110"
                    style={{ backgroundColor: `${service.color}15` }}
                  >
                    <Icon
                      className="w-8 h-8"
                      style={{ color: service.color }}
                    />
                  </div>
                  <h3 className="text-xl font-bold text-gray-800 mb-3">
                    {service.title}
                  </h3>
                  <p className="text-gray-600 leading-relaxed">
                    {service.description}
                  </p>
                  <div
                    className="mt-4 flex items-center gap-2 text-sm font-medium"
                    style={{ color: service.color }}
                  >
                    <span>Learn More</span>
                    <span className="group-hover:translate-x-1 transition-transform">
                      →
                    </span>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Why Choose Us */}
          <div className="mt-16 bg-white rounded-lg p-8 shadow-sm">
            <h2 className="text-2xl font-bold text-[#1a2d5e] text-center mb-8">
              Why Choose Velaré Services?
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center">
                <div className="w-12 h-12 mx-auto bg-[#DA4C2F]/10 rounded-full flex items-center justify-center mb-3">
                  <CheckCircle className="w-6 h-6 text-[#DA4C2F]" />
                </div>
                <h4 className="font-semibold text-gray-800 mb-1">
                  Expert Craftsmanship
                </h4>
                <p className="text-sm text-gray-600">
                  Skilled artisans with years of experience
                </p>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 mx-auto bg-[#DA4C2F]/10 rounded-full flex items-center justify-center mb-3">
                  <CheckCircle className="w-6 h-6 text-[#DA4C2F]" />
                </div>
                <h4 className="font-semibold text-gray-800 mb-1">
                  Quality Guaranteed
                </h4>
                <p className="text-sm text-gray-600">
                  Premium materials and workmanship
                </p>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 mx-auto bg-[#DA4C2F]/10 rounded-full flex items-center justify-center mb-3">
                  <CheckCircle className="w-6 h-6 text-[#DA4C2F]" />
                </div>
                <h4 className="font-semibold text-gray-800 mb-1">
                  Satisfaction Promise
                </h4>
                <p className="text-sm text-gray-600">
                  We stand behind every service we provide
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
