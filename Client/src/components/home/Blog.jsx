import { useState } from "react";
import {
  ArrowRight,
  MapPin,
  Phone,
  Mail,
  Clock,
  ExternalLink,
  Navigation,
} from "lucide-react";

export default function Blog() {
  const [selectedStore, setSelectedStore] = useState(0);

  const stores = [
    {
      id: 0,
      name: "Velaré Home - Bole",
      address: "Bole Road, Near Bole Medhanialem Church, Addis Ababa",
      phone: "+251 911 234 567",
      email: "bole@velarehome.com",
      hours: "Mon-Sat: 9:00 AM - 8:00 PM | Sun: 10:00 AM - 6:00 PM",
      lat: 9.0,
      lng: 38.75,
      description:
        "Our flagship showroom featuring our complete collection of home and office furniture.",
    },
    {
      id: 1,
      name: "Velaré Home - Piassa",
      address: "Piassa, Behind Commercial Bank, Addis Ababa",
      phone: "+251 922 345 678",
      email: "piassa@velarehome.com",
      hours: "Mon-Sat: 9:00 AM - 7:00 PM | Sun: Closed",
      lat: 9.03,
      lng: 38.76,
      description:
        "Located in the heart of the city, this showroom specializes in modern and contemporary designs.",
    },
    {
      id: 2,
      name: "Velaré Home - CMC",
      address: "CMC, Near Lem Hotel, Addis Ababa",
      phone: "+251 933 456 789",
      email: "cmc@velarehome.com",
      hours: "Mon-Sat: 10:00 AM - 9:00 PM | Sun: 11:00 AM - 7:00 PM",
      lat: 9.01,
      lng: 38.8,
      description:
        "Our largest showroom featuring our premium collection, custom furniture, and design consultation services.",
    },
  ];

  return (
    <section className="py-12 md:py-16 bg-[#f5f0eb]" id="blog">
      <div className="container">
        <h2 className="text-center text-3xl md:text-5xl font-bold text-[#1a2d5e] mb-8">
          More to Discover
        </h2>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Store Cards */}
          {stores.map((store) => (
            <div
              key={store.id}
              className="bg-white overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 group cursor-pointer"
              onClick={() => setSelectedStore(store.id)}
            >
              <div className="relative h-48 bg-gradient-to-br from-[#1a2d5e] to-[#243b7a] flex items-center justify-center">
                <div className="absolute inset-0 bg-[url('/assets/images/map-pattern.svg')] opacity-10"></div>
                <div className="relative z-10 text-center">
                  <MapPin className="w-12 h-12 text-[#DA4C2F] mx-auto mb-2" />
                  <p className="text-white font-semibold text-sm">
                    Find Our Store
                  </p>
                </div>
                <div className="absolute bottom-0 left-0 right-0 h-1 bg-[#DA4C2F]"></div>
              </div>
              <div className="p-6">
                <h3 className="text-xl font-bold text-[#1a2d5e] mb-2">
                  {store.name}
                </h3>
                <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                  {store.description}
                </p>
                <div className="space-y-1.5 text-sm text-gray-500">
                  <p className="flex items-start gap-2">
                    <MapPin className="w-4 h-4 text-[#DA4C2F] mt-0.5 flex-shrink-0" />
                    <span>{store.address}</span>
                  </p>
                  <p className="flex items-center gap-2">
                    <Phone className="w-4 h-4 text-[#DA4C2F]" />
                    <span>{store.phone}</span>
                  </p>
                </div>
                <div className="mt-4 pt-4 border-t border-gray-100 flex items-center justify-between">
                  <span className="text-xs text-gray-400 flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    {store.hours}
                  </span>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedStore(store.id);
                      document
                        .getElementById("store-map")
                        ?.scrollIntoView({ behavior: "smooth" });
                    }}
                    className="text-[#DA4C2F] font-medium text-sm inline-flex items-center gap-1 hover:gap-2 transition-all"
                  >
                    <span>View Map</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Map Section - Shows when a store is selected */}
        {selectedStore !== null && (
          <div
            id="store-map"
            className="mt-8 bg-white rounded-lg overflow-hidden shadow-lg border border-gray-200"
          >
            <div className="grid grid-cols-1 md:grid-cols-3">
              {/* Store Info */}
              <div className="p-6 bg-[#1a2d5e] text-white md:col-span-1">
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="text-xl font-bold mb-2">
                      {stores[selectedStore].name}
                    </h3>
                    <p className="text-sm text-gray-300 mb-4">
                      {stores[selectedStore].description}
                    </p>
                  </div>
                  <button
                    onClick={() => setSelectedStore(null)}
                    className="text-gray-400 hover:text-white transition-colors"
                  >
                    ×
                  </button>
                </div>

                <div className="space-y-3 text-sm">
                  <div className="flex items-start gap-3">
                    <MapPin className="w-5 h-5 text-[#DA4C2F] mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="font-medium text-white">Address</p>
                      <p className="text-gray-300">
                        {stores[selectedStore].address}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <Phone className="w-5 h-5 text-[#DA4C2F] mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="font-medium text-white">Phone</p>
                      <p className="text-gray-300">
                        {stores[selectedStore].phone}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <Mail className="w-5 h-5 text-[#DA4C2F] mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="font-medium text-white">Email</p>
                      <p className="text-gray-300">
                        {stores[selectedStore].email}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <Clock className="w-5 h-5 text-[#DA4C2F] mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="font-medium text-white">Business Hours</p>
                      <p className="text-gray-300">
                        {stores[selectedStore].hours}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="mt-6 pt-6 border-t border-white/10">
                  <a
                    href={`https://www.google.com/maps/dir//${stores[selectedStore].lat},${stores[selectedStore].lng}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 bg-[#DA4C2F] text-white px-4 py-2.5 rounded-lg hover:bg-[#c43d22] transition-colors w-full justify-center text-sm font-medium"
                  >
                    <Navigation className="w-4 h-4" />
                    Get Directions
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
              </div>

              {/* Map Display */}
              <div className="md:col-span-2 h-[400px] relative bg-gray-100">
                {/* Embedded Map - Using OpenStreetMap via iframe */}
                <iframe
                  title="Store Location"
                  src={`https://www.openstreetmap.org/export/embed.html?bbox=${stores[selectedStore].lng - 0.01}%2C${stores[selectedStore].lat - 0.01}%2C${stores[selectedStore].lng + 0.01}%2C${stores[selectedStore].lat + 0.01}&layer=mapnik&marker=${stores[selectedStore].lat}%2C${stores[selectedStore].lng}`}
                  className="w-full h-full"
                  style={{ border: 0 }}
                  allowFullScreen
                  loading="lazy"
                ></iframe>

                {/* Store Marker Overlay */}
                <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-white shadow-lg rounded-lg px-6 py-3 flex items-center gap-3 border border-gray-200">
                  <div className="w-3 h-3 rounded-full bg-[#DA4C2F] animate-pulse"></div>
                  <span className="text-sm font-medium text-gray-800">
                    📍 {stores[selectedStore].name}
                  </span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Store Selector Pills */}
        <div className="flex flex-wrap justify-center gap-3 mt-6">
          {stores.map((store, index) => (
            <button
              key={store.id}
              onClick={() => {
                setSelectedStore(index);
                document
                  .getElementById("store-map")
                  ?.scrollIntoView({ behavior: "smooth" });
              }}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                selectedStore === index
                  ? "bg-[#DA4C2F] text-white shadow-md"
                  : "bg-white text-gray-600 hover:bg-gray-100"
              }`}
            >
              {store.name}
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}
