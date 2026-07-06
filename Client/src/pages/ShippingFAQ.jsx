import { useState } from "react";
import Header from "../components/layout/Header";
import Footer from "../components/layout/Footer";
import {
  ChevronDown,
  ChevronUp,
  Search,
  Truck,
  Clock,
  DollarSign,
  Globe,
} from "lucide-react";

const faqs = [
  {
    id: 1,
    category: "timing",
    question: "How long does delivery take?",
    answer:
      "Delivery times vary based on product availability and your location. In-stock items typically ship within 3-5 business days. Custom-made furniture may take 4-6 weeks. Once shipped, you'll receive a tracking number to monitor your delivery.",
  },
  {
    id: 2,
    category: "delivery",
    question: "Do you offer white glove delivery?",
    answer:
      "Yes! Our premium white glove service includes delivery to the room of your choice, unpacking, assembly, placement, and removal of all packaging materials. This service is available for most items for an additional fee.",
  },
  {
    id: 3,
    category: "costs",
    question: "What are your shipping costs?",
    answer:
      "Standard shipping starts at $79 for large items and $29 for smaller accessories. Orders over $2,000 qualify for free standard shipping. White glove delivery starts at $199 depending on the size and complexity of the items.",
  },
  {
    id: 4,
    category: "delivery",
    question: "What if I'm not home during delivery?",
    answer:
      "For standard deliveries, the carrier will leave a notice and attempt redelivery or hold at a local facility. For white glove service, we'll contact you to schedule a new delivery time. We recommend being present for furniture deliveries to inspect items upon arrival.",
  },
  {
    id: 5,
    category: "timing",
    question: "Can I schedule a specific delivery date?",
    answer:
      "Absolutely! Once your order is processed, our delivery team will contact you to schedule a convenient delivery date. For white glove service, we offer specific time windows to ensure we work around your schedule.",
  },
  {
    id: 6,
    category: "international",
    question: "Do you ship internationally?",
    answer:
      "We currently ship to the contiguous United States, Alaska, and Hawaii. Unfortunately, we do not offer international shipping at this time. For inquiries about special circumstances, please contact our customer service team.",
  },
  {
    id: 7,
    category: "delivery",
    question: "Do you assemble the furniture?",
    answer:
      "Assembly is included with our white glove delivery service. For standard shipping, items that require minimal assembly will include detailed instructions and all necessary tools. Complex items may require professional assembly which we can arrange for an additional fee.",
  },
  {
    id: 8,
    category: "costs",
    question: "Are there additional fees for stairs or difficult access?",
    answer:
      "For deliveries requiring more than two flights of stairs, elevator-free buildings above the 3rd floor, or difficult access situations, additional fees may apply. Our team will assess your delivery location and inform you of any extra charges before confirming your delivery date.",
  },
];

const categories = [
  { id: "all", label: "All Questions", icon: Search },
  { id: "delivery", label: "Delivery Process", icon: Truck },
  { id: "timing", label: "Timing & Scheduling", icon: Clock },
  { id: "costs", label: "Shipping Costs", icon: DollarSign },
  { id: "international", label: "International", icon: Globe },
];

export default function ShippingFAQ() {
  const [openFaq, setOpenFaq] = useState(null);
  const [activeCategory, setActiveCategory] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");

  const toggleFaq = (id) => {
    setOpenFaq(openFaq === id ? null : id);
  };

  const filteredFaqs = faqs.filter((faq) => {
    const matchesCategory =
      activeCategory === "all" || faq.category === activeCategory;
    const matchesSearch =
      faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
      faq.answer.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <>
      <Header />
      <main className="bg-gray-50 min-h-screen">
        {/* Hero Section */}
        <section className="relative py-16 min-h-[350px] flex items-center">
          <div
            className="absolute inset-0 bg-cover bg-center bg-no-repeat"
            style={{
              backgroundImage: "url('/assets/images/shippingbanner.png')",
              backgroundPosition: "center 40%",
            }}
          >
            <div className="absolute inset-0 bg-black/55"></div>
          </div>
          <div className="container relative z-10">
            <div className="max-w-3xl mx-auto text-center">
              <h1 className="text-4xl md:text-5xl font-bold mb-4 text-white">
                Shipping & Delivery FAQs
              </h1>
              <p className="text-lg text-gray-200">
                Everything you need to know about getting your furniture
                delivered safely and on time
              </p>
            </div>
          </div>
        </section>

        <div className="container py-8">
          {/* Search */}
          <div className="max-w-2xl mx-auto mb-8">
            <div className="relative">
              <input
                type="text"
                placeholder="Search shipping questions..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full px-4 py-3 pl-12 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#DA4C2F] focus:border-transparent"
              />
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
            </div>
          </div>

          {/* Categories */}
          <div className="flex flex-wrap justify-center gap-2 mb-10">
            {categories.map((cat) => {
              const Icon = cat.icon;
              return (
                <button
                  key={cat.id}
                  onClick={() => setActiveCategory(cat.id)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all ${
                    activeCategory === cat.id
                      ? "bg-[#DA4C2F] text-white shadow-md"
                      : "bg-white text-gray-600 hover:bg-gray-100"
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  {cat.label}
                </button>
              );
            })}
          </div>

          {/* Shipping Timeline */}
          <div className="bg-white rounded-lg p-8 shadow-sm mb-10">
            <h2 className="text-xl font-bold text-[#1a2d5e] text-center mb-6">
              Our Shipping Process
            </h2>
            <div className="flex flex-wrap justify-center items-center gap-4 md:gap-8">
              {[
                { step: 1, label: "Order Confirmed" },
                { step: 2, label: "Order Processed" },
                { step: 3, label: "Shipped" },
                { step: 4, label: "Delivered" },
              ].map((item, index) => (
                <div key={item.step} className="flex items-center">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-[#DA4C2F] text-white flex items-center justify-center font-bold">
                      {item.step}
                    </div>
                    <span className="text-sm font-medium text-gray-700">
                      {item.label}
                    </span>
                  </div>
                  {index < 3 && (
                    <div className="hidden md:block w-12 h-0.5 bg-gray-300 ml-4"></div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* FAQ List */}
          <div className="max-w-3xl mx-auto">
            <h2 className="text-2xl font-bold text-[#1a2d5e] text-center mb-6">
              Frequently Asked Questions
            </h2>
            <div className="space-y-3">
              {filteredFaqs.length === 0 ? (
                <p className="text-center text-gray-500 py-8">
                  No matching questions found.
                </p>
              ) : (
                filteredFaqs.map((faq) => (
                  <div
                    key={faq.id}
                    className="bg-white rounded-lg shadow-sm overflow-hidden"
                  >
                    <button
                      onClick={() => toggleFaq(faq.id)}
                      className="w-full px-6 py-4 flex items-center justify-between hover:bg-gray-50 transition-colors text-left"
                    >
                      <span className="font-medium text-gray-800">
                        {faq.question}
                      </span>
                      {openFaq === faq.id ? (
                        <ChevronUp className="w-5 h-5 text-[#DA4C2F] flex-shrink-0" />
                      ) : (
                        <ChevronDown className="w-5 h-5 text-gray-400 flex-shrink-0" />
                      )}
                    </button>
                    {openFaq === faq.id && (
                      <div className="px-6 pb-4 text-gray-600 leading-relaxed">
                        {faq.answer}
                      </div>
                    )}
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Contact Support */}
          <div className="mt-12 bg-gradient-to-r from-[#1a2d5e] to-[#243b7a] text-white rounded-lg p-8 text-center">
            <h2 className="text-2xl font-bold mb-3">Still have questions?</h2>
            <p className="text-gray-300 mb-4">
              Our customer service team is here to help with any shipping
              inquiries
            </p>
            <div className="flex flex-col md:flex-row items-center justify-center gap-4 text-sm">
              <span>📧 shipping@velarehome.com</span>
              <span>📞 (251) 905-SHIP</span>
              <span>🕐 Mon-Fri 8am-8pm EST, Sat 10am-6pm EST</span>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
