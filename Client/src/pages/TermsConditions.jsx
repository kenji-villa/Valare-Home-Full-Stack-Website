import { useState } from "react";
import Header from "../components/layout/Header";
import Footer from "../components/layout/Footer";
import {
  Shield,
  CheckCircle,
  AlertCircle,
  FileText,
  Scale,
  CreditCard,
  Truck,
  RefreshCw,
} from "lucide-react";

export default function TermsConditions() {
  const [activeSection, setActiveSection] = useState("introduction");

  const scrollToSection = (id) => {
    setActiveSection(id);
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  const sections = [
    { id: "introduction", label: "Introduction" },
    { id: "purchases", label: "Purchases" },
    { id: "returns", label: "Returns & Refunds" },
    { id: "shipping", label: "Shipping" },
    { id: "intellectual", label: "Intellectual Property" },
    { id: "limitations", label: "Limitations" },
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
              backgroundImage: "url('/assets/images/termsbanner.jpg')",
              backgroundPosition: "center 35%",
            }}
          >
            <div className="absolute inset-0 bg-black/60"></div>
          </div>
          <div className="container relative z-10">
            <div className="max-w-3xl mx-auto text-center">
              <FileText className="w-16 h-16 mx-auto mb-4 text-[#DA4C2F]" />
              <h1 className="text-4xl md:text-5xl font-bold mb-4 text-white">
                Terms & Conditions
              </h1>
              <p className="text-lg text-gray-200 mb-3">
                Please read these terms carefully before using our services
              </p>
              <span className="inline-block bg-[#DA4C2F] px-4 py-1.5 rounded-full text-sm font-medium text-white">
                Last Updated: August 15, 2025
              </span>
            </div>
          </div>
        </section>

        {/* Navigation */}
        <div className="bg-white border-b border-gray-200 sticky top-0 z-10 shadow-sm">
          <div className="container">
            <div className="flex overflow-x-auto gap-2 py-3 scrollbar-thin">
              {sections.map((item) => (
                <button
                  key={item.id}
                  onClick={() => scrollToSection(item.id)}
                  className={`px-4 py-2 rounded-lg whitespace-nowrap text-sm font-medium transition-colors ${
                    activeSection === item.id
                      ? "bg-[#DA4C2F] text-white"
                      : "text-gray-600 hover:bg-gray-100"
                  }`}
                >
                  {item.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="container py-12">
          <div className="max-w-4xl mx-auto">
            {/* Introduction */}
            <div
              id="introduction"
              className="bg-white rounded-lg p-8 shadow-sm mb-8 scroll-mt-20"
            >
              <h2 className="text-2xl font-bold text-[#1a2d5e] mb-4 flex items-center gap-3">
                <FileText className="w-6 h-6 text-[#DA4C2F]" />
                Introduction
              </h2>
              <p className="text-gray-600 leading-relaxed mb-4">
                Welcome to Velaré Home. These Terms and Conditions govern your
                use of our website and services. By accessing or using our
                website, you agree to be bound by these terms.
              </p>
              <p className="text-gray-600 leading-relaxed">
                If you do not agree with any part of these terms, please do not
                use our website or services.
              </p>
            </div>

            {/* Purchases */}
            <div
              id="purchases"
              className="bg-white rounded-lg p-8 shadow-sm mb-8 scroll-mt-20"
            >
              <h2 className="text-2xl font-bold text-[#1a2d5e] mb-4 flex items-center gap-3">
                <CreditCard className="w-6 h-6 text-[#DA4C2F]" />
                Purchases
              </h2>
              <p className="text-gray-600 leading-relaxed mb-4">
                When you make a purchase on our website, you agree to provide
                accurate and complete information.
              </p>
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                  <div>
                    <h4 className="font-semibold text-gray-800">Pricing</h4>
                    <p className="text-sm text-gray-600">
                      All prices are listed in ETB and are subject to change
                      without notice. We reserve the right to modify or
                      discontinue products at any time.
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                  <div>
                    <h4 className="font-semibold text-gray-800">Payment</h4>
                    <p className="text-sm text-gray-600">
                      We accept various payment methods. All payments are
                      processed securely through our payment partners.
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                  <div>
                    <h4 className="font-semibold text-gray-800">
                      Order Confirmation
                    </h4>
                    <p className="text-sm text-gray-600">
                      After placing an order, you will receive an email
                      confirmation. This confirmation does not guarantee order
                      acceptance.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Returns & Refunds */}
            <div
              id="returns"
              className="bg-white rounded-lg p-8 shadow-sm mb-8 scroll-mt-20"
            >
              <h2 className="text-2xl font-bold text-[#1a2d5e] mb-4 flex items-center gap-3">
                <RefreshCw className="w-6 h-6 text-[#DA4C2F]" />
                Returns & Refunds
              </h2>
              <div className="space-y-4">
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h4 className="font-semibold text-gray-800 mb-2">
                    30-Day Return Policy
                  </h4>
                  <p className="text-sm text-gray-600">
                    We offer a 30-day return policy for unused items in their
                    original packaging. Custom-made items are non-returnable
                    unless defective.
                  </p>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h4 className="font-semibold text-gray-800 mb-2">
                    Refund Process
                  </h4>
                  <p className="text-sm text-gray-600">
                    Refunds are processed within 5-7 business days after we
                    receive and inspect the returned item. Refunds will be
                    issued to the original payment method.
                  </p>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h4 className="font-semibold text-gray-800 mb-2">
                    Return Shipping
                  </h4>
                  <p className="text-sm text-gray-600">
                    Return shipping costs are the responsibility of the customer
                    unless the item is defective or we made an error with your
                    order.
                  </p>
                </div>
              </div>
            </div>

            {/* Shipping */}
            <div
              id="shipping"
              className="bg-white rounded-lg p-8 shadow-sm mb-8 scroll-mt-20"
            >
              <h2 className="text-2xl font-bold text-[#1a2d5e] mb-4 flex items-center gap-3">
                <Truck className="w-6 h-6 text-[#DA4C2F]" />
                Shipping
              </h2>
              <p className="text-gray-600 leading-relaxed mb-4">
                We strive to deliver your furniture safely and on time. Please
                review our shipping policies:
              </p>
              <ul className="space-y-2 text-gray-600 list-disc list-inside">
                <li>Standard shipping takes 3-5 business days</li>
                <li>
                  White glove delivery service is available for an additional
                  fee
                </li>
                <li>International shipping is currently not available</li>
                <li>
                  You will receive tracking information once your order ships
                </li>
              </ul>
            </div>

            {/* Intellectual Property */}
            <div
              id="intellectual"
              className="bg-white rounded-lg p-8 shadow-sm mb-8 scroll-mt-20"
            >
              <h2 className="text-2xl font-bold text-[#1a2d5e] mb-4 flex items-center gap-3">
                <Scale className="w-6 h-6 text-[#DA4C2F]" />
                Intellectual Property
              </h2>
              <p className="text-gray-600 leading-relaxed mb-4">
                All content on our website, including images, text, logos, and
                designs, is the property of Velaré Home and is protected by
                copyright laws.
              </p>
              <div className="bg-yellow-50 border border-yellow-200 p-4 rounded-lg flex items-start gap-3">
                <AlertCircle className="w-5 h-5 text-yellow-600 mt-0.5 flex-shrink-0" />
                <p className="text-sm text-yellow-700">
                  You may not reproduce, distribute, or create derivative works
                  from our content without explicit written permission.
                </p>
              </div>
            </div>

            {/* Limitations */}
            <div
              id="limitations"
              className="bg-white rounded-lg p-8 shadow-sm mb-8 scroll-mt-20"
            >
              <h2 className="text-2xl font-bold text-[#1a2d5e] mb-4 flex items-center gap-3">
                <Shield className="w-6 h-6 text-[#DA4C2F]" />
                Limitations of Liability
              </h2>
              <p className="text-gray-600 leading-relaxed mb-4">
                Velaré Home is not liable for any damages arising from the use
                of our products or services, to the fullest extent permitted by
                law.
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h4 className="font-semibold text-gray-800 mb-1">
                    No Warranty
                  </h4>
                  <p className="text-sm text-gray-600">
                    Products are provided "as is" without warranties of any
                    kind.
                  </p>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h4 className="font-semibold text-gray-800 mb-1">
                    Indemnification
                  </h4>
                  <p className="text-sm text-gray-600">
                    You agree to indemnify Velaré Home from any claims arising
                    from your use of our products.
                  </p>
                </div>
              </div>
            </div>

            {/* Contact Section */}
            <div className="bg-gradient-to-r from-[#1a2d5e] to-[#243b7a] text-white rounded-lg p-8 text-center">
              <h2 className="text-2xl font-bold mb-3">
                Questions About Our Terms?
              </h2>
              <p className="text-gray-300 mb-4">
                If you have any questions about these Terms & Conditions, please
                contact us.
              </p>
              <a
                href="/contact"
                className="inline-block bg-[#DA4C2F] px-6 py-3 rounded-lg font-medium hover:bg-[#c43d22] transition-colors"
              >
                Contact Us
              </a>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
