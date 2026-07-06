import { Link, useLocation } from "react-router-dom";

export default function Footer() {
  const location = useLocation();

  const handleLinkClick = (e, path) => {
    if (location.pathname === path) {
      e.preventDefault();
      window.scrollTo({
        top: 0,
        left: 0,
        behavior: "smooth",
      });
    }
  };

  return (
    <footer className="bg-[#f0efed] text-gray-700 border-t border-gray-200">
      <div className="container py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Company Info */}
          <div>
            <h4 className="text-lg font-bold mb-4 text-gray-800">Company</h4>
            <p className="text-sm text-gray-600 mb-2">
              Find a location nearest you. See{" "}
              <Link
                to="#"
                className="text-[#DA4C2F] hover:underline transition-colors"
              >
                Our Stores
              </Link>
            </p>
            <p className="text-sm font-bold mb-1 text-gray-800">
              +251 (9)28 9558 3370
            </p>
            <p className="text-sm text-gray-600">Velaré@home.com</p>
          </div>

          {/* Useful Links */}
          <div>
            <h4 className="text-lg font-bold mb-4 text-gray-800">
              Useful links
            </h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link
                  to="/home-furniture"
                  className="text-gray-600 hover:text-[#DA4C2F] transition-colors"
                >
                  New Products
                </Link>
              </li>
              <li>
                <Link
                  to="/specials"
                  className="text-gray-600 hover:text-[#DA4C2F] transition-colors"
                >
                  Best Sellers
                </Link>
              </li>
              <li>
                <Link
                  to="/bundle-save"
                  className="text-gray-600 hover:text-[#DA4C2F] transition-colors"
                >
                  Bundle & Save
                </Link>
              </li>
              <li>
                <Link
                  to="/gift-card"
                  className="text-gray-600 hover:text-[#DA4C2F] transition-colors"
                >
                  Online Gift Card
                </Link>
              </li>
            </ul>
          </div>

          {/* Information */}
          <div>
            <h4 className="text-lg font-bold mb-4 text-gray-800">
              Information
            </h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link
                  to="/services"
                  className="text-gray-600 hover:text-[#DA4C2F] transition-colors"
                >
                  Services
                </Link>
              </li>
              <li>
                <Link
                  to="/contact"
                  className="text-gray-600 hover:text-[#DA4C2F] transition-colors"
                >
                  Contact Us
                </Link>
              </li>
              <li>
                <Link
                  to="/shipping"
                  className="text-gray-600 hover:text-[#DA4C2F] transition-colors"
                >
                  Shipping FAQ
                </Link>
              </li>
              <li>
                <Link
                  to="/terms"
                  className="text-gray-600 hover:text-[#DA4C2F] transition-colors"
                >
                  Terms & Conditions
                </Link>
              </li>
              <li>
                <Link
                  to="/privacy"
                  className="text-gray-600 hover:text-[#DA4C2F] transition-colors"
                >
                  Privacy Policy
                </Link>
              </li>
            </ul>
          </div>

          {/* Newsletter */}
          <div className="lg:pl-2">
            <h4 className="text-lg font-bold mb-2 text-gray-800">
              Your emails.
            </h4>
            <p className="text-sm text-gray-600 mb-4 max-w-xs">
              Enter your email below to be the first to know about new
              collections and product launches.
            </p>
            <form className="flex flex-col sm:flex-row gap-3">
              <input
                type="email"
                placeholder="Enter your email address"
                className="flex-1 min-w-[140px] px-4 py-2.5 rounded border border-gray-300 text-gray-800 focus:outline-none focus:ring-2 focus:ring-[#DA4C2F] focus:border-transparent text-sm bg-white"
              />
              <button
                type="submit"
                className="btn-primary whitespace-nowrap px-5 py-2.5 text-sm"
              >
                Subscribe
              </button>
            </form>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-gray-300 py-6">
        <div className="container">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-sm text-gray-600">&copy; 2025 Velaré Home</p>
            <div className="flex items-center gap-6 flex-wrap justify-center">
              <img
                src="/assets/images/pay.png"
                width="313"
                height="28"
                alt="Payment methods"
                className="h-6 w-auto"
              />
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
