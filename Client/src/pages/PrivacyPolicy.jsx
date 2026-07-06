import { useState, useEffect } from "react";
import Header from "../components/layout/Header";
import Footer from "../components/layout/Footer";
import {
  Shield,
  User,
  Database,
  Cookie,
  CheckCircle,
  Mail,
  Phone,
  MapPin,
} from "lucide-react";

export default function PrivacyPolicy() {
  const [activeSection, setActiveSection] = useState("data-collection");

  const scrollToSection = (id) => {
    setActiveSection(id);
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  return (
    <>
      <Header />
      <main className="bg-gray-50 min-h-screen">
        {/* Hero Section */}
        <section className="relative py-16 min-h-[350px] flex items-center">
          <div
            className="absolute inset-0 bg-cover bg-center bg-no-repeat"
            style={{
              backgroundImage: "url('/assets/images/privacybanner.jpg')",
              backgroundPosition: "center 30%",
            }}
          >
            <div className="absolute inset-0 bg-black/60"></div>
          </div>
          <div className="container relative z-10">
            <div className="max-w-3xl mx-auto text-center">
              <Shield className="w-16 h-16 mx-auto mb-4 text-[#DA4C2F]" />
              <h1 className="text-4xl md:text-5xl font-bold mb-4 text-white">
                Your Privacy Matters at Velaré Home
              </h1>
              <p className="text-lg text-gray-200 mb-3">
                We're committed to protecting your personal information and
                being transparent about what we collect
              </p>
              <span className="inline-block bg-[#DA4C2F] px-4 py-1.5 rounded-full text-sm font-medium text-white">
                Last Updated: August 15, 2025
              </span>
            </div>
          </div>
        </section>

        {/* Navigation Tabs */}
        <div className="bg-white border-b border-gray-200 sticky top-0 z-10 shadow-sm">
          <div className="container">
            <div className="flex overflow-x-auto gap-2 py-3 scrollbar-thin">
              {[
                { id: "data-collection", label: "What We Collect" },
                { id: "data-use", label: "How We Use Data" },
                { id: "data-protection", label: "Data Protection" },
                { id: "cookies", label: "Cookies" },
                { id: "rights", label: "Your Rights" },
              ].map((item) => (
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
            {/* Highlight Box */}
            <div className="bg-[#DA4C2F]/10 border-l-4 border-[#DA4C2F] p-6 rounded-r-lg mb-10">
              <p className="text-gray-700 leading-relaxed">
                At Velaré Home, we believe in furniture that lasts and privacy
                that protects. Your trust is the foundation of our business, and
                we're committed to safeguarding your personal information with
                the same care we put into crafting our furniture.
              </p>
            </div>

            {/* Section: Data Collection */}
            <div
              id="data-collection"
              className="bg-white rounded-lg p-8 shadow-sm mb-8 scroll-mt-20"
            >
              <h2 className="text-2xl font-bold text-[#1a2d5e] mb-4 flex items-center gap-3">
                <Database className="w-6 h-6 text-[#DA4C2F]" />
                What Information We Collect
              </h2>
              <p className="text-gray-600 mb-6">
                To provide you with the best furniture shopping experience, we
                collect certain information:
              </p>

              <div className="space-y-6">
                <div>
                  <h3 className="font-semibold text-gray-800 mb-2 flex items-center gap-2">
                    <User className="w-5 h-5 text-[#DA4C2F]" />
                    Personal Information
                  </h3>
                  <ul className="list-disc list-inside text-gray-600 space-y-1 ml-6">
                    <li>
                      Contact details (name, email, phone number, shipping
                      address)
                    </li>
                    <li>
                      Payment information (processed securely through our
                      payment partners)
                    </li>
                    <li>Communication preferences</li>
                  </ul>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-800 mb-2 flex items-center gap-2">
                    <Database className="w-5 h-5 text-[#DA4C2F]" />
                    Usage Data
                  </h3>
                  <ul className="list-disc list-inside text-gray-600 space-y-1 ml-6">
                    <li>Browsing behavior on our website</li>
                    <li>Products you've viewed or searched for</li>
                    <li>Device and browser information</li>
                    <li>IP address and general location data</li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Section: Data Use */}
            <div
              id="data-use"
              className="bg-white rounded-lg p-8 shadow-sm mb-8 scroll-mt-20"
            >
              <h2 className="text-2xl font-bold text-[#1a2d5e] mb-4 flex items-center gap-3">
                <Database className="w-6 h-6 text-[#DA4C2F]" />
                How We Use Your Information
              </h2>
              <p className="text-gray-600 mb-6">
                We use your data to enhance your experience with Velaré Home:
              </p>

              <div className="space-y-6">
                <div>
                  <h3 className="font-semibold text-gray-800 mb-2">
                    🛒 Order Processing & Delivery
                  </h3>
                  <p className="text-gray-600 ml-2">
                    To process your orders, arrange delivery, and provide
                    customer support for your furniture purchases.
                  </p>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-800 mb-2">
                    💬 Personalized Communication
                  </h3>
                  <p className="text-gray-600 ml-2">
                    To send you information about products, promotions, and
                    design tips that match your style preferences.
                  </p>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-800 mb-2">
                    📈 Improving Our Services
                  </h3>
                  <p className="text-gray-600 ml-2">
                    To analyze how customers use our website and services,
                    helping us create better furniture shopping experiences.
                  </p>
                </div>
              </div>
            </div>

            {/* Section: Data Protection */}
            <div
              id="data-protection"
              className="bg-white rounded-lg p-8 shadow-sm mb-8 scroll-mt-20"
            >
              <h2 className="text-2xl font-bold text-[#1a2d5e] mb-4 flex items-center gap-3">
                <Shield className="w-6 h-6 text-[#DA4C2F]" />
                How We Protect Your Data
              </h2>
              <p className="text-gray-600 mb-6">
                We implement robust security measures to protect your
                information:
              </p>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h3 className="font-semibold text-gray-800 mb-2">
                    🔒 Encryption & Security
                  </h3>
                  <p className="text-sm text-gray-600">
                    All data transmitted between your browser and our website is
                    encrypted using SSL technology.
                  </p>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h3 className="font-semibold text-gray-800 mb-2">
                    👥 Limited Access
                  </h3>
                  <p className="text-sm text-gray-600">
                    Only authorized personnel have access to your personal
                    information when necessary.
                  </p>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h3 className="font-semibold text-gray-800 mb-2">
                    🖥️ Secure Storage
                  </h3>
                  <p className="text-sm text-gray-600">
                    Your data is stored on secure servers with appropriate
                    technical measures in place.
                  </p>
                </div>
              </div>
            </div>

            {/* Section: Cookies */}
            <div
              id="cookies"
              className="bg-white rounded-lg p-8 shadow-sm mb-8 scroll-mt-20"
            >
              <h2 className="text-2xl font-bold text-[#1a2d5e] mb-4 flex items-center gap-3">
                <Cookie className="w-6 h-6 text-[#DA4C2F]" />
                Our Use of Cookies
              </h2>
              <p className="text-gray-600 mb-6">
                Like most furniture retailers, we use cookies to enhance your
                shopping experience:
              </p>

              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-green-500 mt-0.5" />
                  <div>
                    <h4 className="font-semibold text-gray-800">
                      Essential Cookies
                    </h4>
                    <p className="text-sm text-gray-600">
                      Required for basic site functionality, such as adding
                      items to your cart and proceeding through checkout.
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-green-500 mt-0.5" />
                  <div>
                    <h4 className="font-semibold text-gray-800">
                      Analytics Cookies
                    </h4>
                    <p className="text-sm text-gray-600">
                      Help us understand how visitors interact with our website,
                      allowing us to improve navigation and product displays.
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-green-500 mt-0.5" />
                  <div>
                    <h4 className="font-semibold text-gray-800">
                      Preference Cookies
                    </h4>
                    <p className="text-sm text-gray-600">
                      Remember your preferences, such as recently viewed items
                      and location settings for delivery estimates.
                    </p>
                  </div>
                </div>
              </div>
              <p className="text-sm text-gray-600 mt-4 bg-gray-50 p-3 rounded-lg">
                You can control cookies through your browser settings, though
                this may affect your shopping experience.
              </p>
            </div>

            {/* Section: Your Rights */}
            <div
              id="rights"
              className="bg-white rounded-lg p-8 shadow-sm mb-8 scroll-mt-20"
            >
              <h2 className="text-2xl font-bold text-[#1a2d5e] mb-4 flex items-center gap-3">
                <Shield className="w-6 h-6 text-[#DA4C2F]" />
                Your Privacy Rights
              </h2>
              <p className="text-gray-600 mb-6">
                You have control over your personal information:
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h4 className="font-semibold text-gray-800">
                    👁️ Access & Portability
                  </h4>
                  <p className="text-sm text-gray-600">
                    Request a copy of the personal data we hold about you.
                  </p>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h4 className="font-semibold text-gray-800">
                    ✏️ Correction & Deletion
                  </h4>
                  <p className="text-sm text-gray-600">
                    Update or request deletion of your personal information.
                  </p>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h4 className="font-semibold text-gray-800">
                    📧 Marketing Preferences
                  </h4>
                  <p className="text-sm text-gray-600">
                    Opt out of marketing communications at any time.
                  </p>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h4 className="font-semibold text-gray-800">
                    ⚙️ Cookie Settings
                  </h4>
                  <p className="text-sm text-gray-600">
                    Adjust your cookie preferences through your browser
                    settings.
                  </p>
                </div>
              </div>
            </div>

            {/* Contact Section */}
            <div className="bg-gradient-to-r from-[#1a2d5e] to-[#243b7a] text-white rounded-lg p-8 text-center">
              <h2 className="text-2xl font-bold mb-4">
                Questions About Your Privacy?
              </h2>
              <p className="text-gray-300 mb-4">
                We're here to help you understand how we protect and use your
                information.
              </p>
              <div className="flex flex-col md:flex-row items-center justify-center gap-4 text-sm">
                <span className="flex items-center gap-2">
                  <Mail className="w-5 h-5 text-[#DA4C2F]" />
                  privacy@velarehome.com
                </span>
                <span className="flex items-center gap-2">
                  <Phone className="w-5 h-5 text-[#DA4C2F]" />
                  (251) 905-PRIV
                </span>
                <span className="flex items-center gap-2">
                  <MapPin className="w-5 h-5 text-[#DA4C2F]" />
                  Monday-Friday 9am-6pm EST
                </span>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
