import { useState, useRef, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { useCart } from "../../context/CartContext";
import { getProducts } from "../../services/productService";
import {
  CircleUser,
  Star,
  ShoppingCart,
  Search,
  LogIn,
  UserPlus,
  LogOut,
  X,
  Menu,
  Minus,
  Plus,
  Trash2,
  LayoutDashboard,
  User,
} from "lucide-react";

export default function Header() {
  const [isNavOpen, setIsNavOpen] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isUserDropdownOpen, setIsUserDropdownOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [showSuggestions, setShowSuggestions] = useState(false);
  const { user, logout } = useAuth();
  const [isSearching, setIsSearching] = useState(false);
  const {
    cartItems,
    getCartTotal,
    getTotalItems,
    favorites,
    updateQuantity,
    removeFromCart,
  } = useCart();
  const dropdownRef = useRef(null);
  const cartRef = useRef(null);
  const searchRef = useRef(null);
  const navigate = useNavigate();
  const location = useLocation();

  const toggleNav = () => setIsNavOpen(!isNavOpen);
  const toggleCart = () => setIsCartOpen(!isCartOpen);
  const toggleUserDropdown = () => setIsUserDropdownOpen(!isUserDropdownOpen);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsUserDropdownOpen(false);
      }
      if (cartRef.current && !cartRef.current.contains(event.target)) {
        setIsCartOpen(false);
      }
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setShowSuggestions(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Sync search query with URL when on shop pages
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const searchParam = params.get("search");
    if (searchParam) {
      setSearchQuery(searchParam);
    }
  }, [location]);

  const handleLogout = () => {
    logout();
    navigate("/");
    setIsUserDropdownOpen(false);
  };

  const handleAdminNavigate = () => {
    setIsUserDropdownOpen(false);
    navigate("/admin");
  };

  // Handle search submission
  const handleSearch = async (e) => {
    e.preventDefault();
    const query = searchQuery.trim();
    if (!query) return;

    setIsSearching(true);
    setShowSuggestions(false);

    try {
      // Fetch all products to check which category matches
      const response = await getProducts({ search: query, limit: 100 });

      if (response.success && response.products.length > 0) {
        // Check if any Office products match
        const officeMatch = response.products.some(
          (p) =>
            p.category === "Office" ||
            p.category === "office" ||
            p.subcategory === "Chairs" ||
            p.subcategory === "Storage" ||
            p.subcategory === "Outdoor" ||
            p.subcategory === "Accessories" ||
            p.subcategory === "Conference" ||
            p.subcategory === "Desks",
        );

        // Check if any Home products match
        const homeMatch = response.products.some(
          (p) =>
            p.category === "Home" ||
            p.category === "Living Room" ||
            p.category === "Bedroom" ||
            p.category === "Dining" ||
            p.category === "Kids" ||
            p.subcategory === "Living Room" ||
            p.subcategory === "Bedroom" ||
            p.subcategory === "Dining" ||
            p.subcategory === "Kids",
        );

        // Route based on which has more matches
        if (officeMatch && !homeMatch) {
          // Only Office products match
          navigate(`/office?search=${encodeURIComponent(query)}`);
        } else if (homeMatch && !officeMatch) {
          // Only Home products match
          navigate(`/home-furniture?search=${encodeURIComponent(query)}`);
        } else if (officeMatch && homeMatch) {
          // Both match - count results in each category
          const officeCount = response.products.filter(
            (p) =>
              p.category === "Office" ||
              p.category === "office" ||
              p.subcategory === "Chairs" ||
              p.subcategory === "Storage" ||
              p.subcategory === "Outdoor" ||
              p.subcategory === "Accessories" ||
              p.subcategory === "Conference" ||
              p.subcategory === "Desks",
          ).length;

          const homeCount = response.products.length - officeCount;

          // Navigate to the category with more matches
          if (officeCount > homeCount) {
            navigate(`/office?search=${encodeURIComponent(query)}`);
          } else {
            navigate(`/home-furniture?search=${encodeURIComponent(query)}`);
          }
        } else {
          // No specific category - default to home furniture
          navigate(`/home-furniture?search=${encodeURIComponent(query)}`);
        }
      } else {
        // No products found - go to home furniture with empty result
        navigate(`/home-furniture?search=${encodeURIComponent(query)}`);
      }
    } catch (error) {
      console.error("Search error:", error);
      // Fallback - go to home furniture
      navigate(`/home-furniture?search=${encodeURIComponent(query)}`);
    } finally {
      setIsSearching(false);
    }
  };

  // Handle search input change
  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
    if (e.target.value.length > 0) {
      setShowSuggestions(true);
    } else {
      setShowSuggestions(false);
    }
  };

  // Handle key press (Enter)
  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      handleSearch(e);
    }
  };

  // Popular search suggestions
  const popularSearches = [
    "Sofa",
    "Bed",
    "Table",
    "Chair",
    "Office Desk",
    "Bookshelf",
    "Recliner",
  ];

  const navLinks = [
    { path: "/", label: "Home" },
    { path: "/home-furniture", label: "Home Furniture" },
    { path: "/office", label: "Office" },
    { path: "/specials", label: "Specials" },
    { path: "/services", label: "Services" },
  ];

  return (
    <header className="relative z-50 bg-white shadow-sm">
      <div className="container">
        <div className="flex items-center justify-between py-4">
          {/* Left section: Mobile Menu + Logo */}
          <div className="flex items-center gap-4">
            <button
              onClick={toggleNav}
              className="lg:hidden p-2 hover:bg-gray-100 rounded transition-colors"
              aria-label="Open menu"
            >
              <Menu className="w-5 h-5 text-gray-700" />
            </button>

            <Link to="/" className="flex-shrink-0">
              <img
                src="/assets/images/Logo_1.png"
                width="179"
                height="26"
                alt="Velaré Home - Designed to Dwell"
                className="h-8 w-auto"
              />
            </Link>
          </div>

          {/* Center: Search Bar - Desktop */}
          <div
            className="hidden md:flex flex-1 max-w-xl mx-8 relative"
            ref={searchRef}
          >
            <form onSubmit={handleSearch} className="w-full relative">
              <input
                type="search"
                placeholder="Search product"
                value={searchQuery}
                onChange={handleSearchChange}
                onKeyDown={handleKeyDown}
                onFocus={() =>
                  searchQuery.length > 0 && setShowSuggestions(true)
                }
                className="w-full px-4 py-2.5 pr-12 border border-gray-300 rounded-lg focus:outline-none focus:border-[#DA4C2F] focus:ring-2 focus:ring-[#DA4C2F]/20 transition-all text-sm bg-gray-50"
              />
              <button
                type="submit"
                disabled={isSearching}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-[#DA4C2F] transition-colors disabled:opacity-50"
                aria-label="Search"
              >
                {isSearching ? (
                  <div className="w-5 h-5 border-2 border-[#DA4C2F] border-t-transparent rounded-full animate-spin"></div>
                ) : (
                  <Search className="w-5 h-5" />
                )}
              </button>
            </form>

            {/* Search Suggestions Dropdown */}
            {showSuggestions && (
              <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg z-50 overflow-hidden">
                {searchQuery.length > 0 && (
                  <button
                    onClick={handleSearch}
                    disabled={isSearching}
                    className="w-full px-4 py-3 text-left hover:bg-gray-50 transition-colors border-b border-gray-100 flex items-center gap-3 disabled:opacity-50"
                  >
                    <Search className="w-4 h-4 text-gray-400" />
                    <span className="text-sm text-gray-700">
                      Search for "
                      <span className="font-medium">{searchQuery}</span>"
                    </span>
                    {isSearching && (
                      <div className="ml-auto w-4 h-4 border-2 border-[#DA4C2F] border-t-transparent rounded-full animate-spin"></div>
                    )}
                  </button>
                )}
                <div className="p-3">
                  <p className="text-xs text-gray-400 mb-2 px-1">
                    Popular searches
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {popularSearches.map((term) => (
                      <button
                        key={term}
                        onClick={async () => {
                          setSearchQuery(term);
                          setShowSuggestions(false);

                          try {
                            const response = await getProducts({
                              search: term,
                              limit: 100,
                            });

                            if (
                              response.success &&
                              response.products.length > 0
                            ) {
                              const officeMatch = response.products.some(
                                (p) =>
                                  p.category === "Office" ||
                                  p.category === "office" ||
                                  p.subcategory === "Chairs" ||
                                  p.subcategory === "Storage" ||
                                  p.subcategory === "Outdoor" ||
                                  p.subcategory === "Accessories" ||
                                  p.subcategory === "Conference" ||
                                  p.subcategory === "Desks",
                              );

                              if (officeMatch) {
                                navigate(
                                  `/office?search=${encodeURIComponent(term)}`,
                                );
                              } else {
                                navigate(
                                  `/home-furniture?search=${encodeURIComponent(term)}`,
                                );
                              }
                            } else {
                              navigate(
                                `/home-furniture?search=${encodeURIComponent(term)}`,
                              );
                            }
                          } catch (error) {
                            navigate(
                              `/home-furniture?search=${encodeURIComponent(term)}`,
                            );
                          }
                        }}
                        className="px-3 py-1.5 bg-gray-50 hover:bg-[#DA4C2F]/10 hover:text-[#DA4C2F] rounded-full text-xs font-medium text-gray-600 transition-colors"
                      >
                        {term}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Right section: User Actions */}
          <div className="flex items-center gap-3 md:gap-4">
            {/* User Dropdown */}
            <div className="relative" ref={dropdownRef}>
              <button
                onClick={toggleUserDropdown}
                className="text-gray-600 hover:text-[#DA4C2F] transition-colors"
                aria-label="user"
              >
                <CircleUser className="w-7 h-7 md:w-8 md:h-8" />
              </button>
              {isUserDropdownOpen && (
                <div className="absolute right-0 mt-2 w-56 bg-white rounded shadow-lg py-2 z-50 border border-gray-200">
                  {user ? (
                    <>
                      <div className="px-4 py-2 border-b border-gray-100">
                        <p className="font-medium text-gray-800 text-sm">
                          {user.username}
                        </p>
                        <p className="text-xs text-gray-500 truncate">
                          {user.email}
                        </p>
                        {user.role === "admin" && (
                          <span className="inline-block mt-1 text-[10px] font-bold text-white bg-[#DA4C2F] px-2 py-0.5 rounded-full">
                            Admin
                          </span>
                        )}
                      </div>

                      {user.role === "admin" && (
                        <button
                          onClick={handleAdminNavigate}
                          className="w-full text-left px-4 py-2 hover:bg-gray-50 flex items-center gap-2 text-gray-700 transition-colors border-b border-gray-100"
                        >
                          <LayoutDashboard className="w-4 h-4 text-[#DA4C2F]" />
                          <span className="text-sm">Admin Dashboard</span>
                          <span className="ml-auto text-xs text-gray-400">
                            →
                          </span>
                        </button>
                      )}

                      <button
                        onClick={() => {
                          setIsUserDropdownOpen(false);
                          navigate("/profile");
                        }}
                        className="w-full text-left px-4 py-2 hover:bg-gray-50 flex items-center gap-2 text-gray-700 transition-colors"
                      >
                        <User className="w-4 h-4" />
                        <span className="text-sm">My Profile</span>
                      </button>

                      <button
                        onClick={handleLogout}
                        className="w-full text-left px-4 py-2 hover:bg-gray-50 flex items-center gap-2 text-red-600 transition-colors border-t border-gray-100 mt-1 pt-2"
                      >
                        <LogOut className="w-4 h-4" />
                        <span className="text-sm">Logout</span>
                      </button>
                    </>
                  ) : (
                    <>
                      <Link
                        to="/login?form=login"
                        className="block px-4 py-2 hover:bg-gray-50 flex items-center gap-2 text-gray-700 transition-colors"
                        onClick={() => setIsUserDropdownOpen(false)}
                      >
                        <LogIn className="w-4 h-4" />
                        <span>Login</span>
                      </Link>
                      <Link
                        to="/login?form=register"
                        className="block px-4 py-2 hover:bg-gray-50 flex items-center gap-2 text-gray-700 transition-colors"
                        onClick={() => setIsUserDropdownOpen(false)}
                      >
                        <UserPlus className="w-4 h-4" />
                        <span>Sign Up</span>
                      </Link>
                    </>
                  )}
                </div>
              )}
            </div>

            {/* Favorites */}
            <Link
              to="/favorites"
              className="relative text-gray-600 hover:text-[#DA4C2F] transition-colors"
            >
              <Star
                className="w-5 h-5 md:w-6 md:h-6"
                fill={favorites.length > 0 ? "#DA4C2F" : "none"}
              />
              {favorites.length > 0 && (
                <span className="absolute -top-1 -right-1 bg-[#DA4C2F] text-white text-[9px] font-bold rounded-full w-4 h-4 md:w-5 md:h-5 flex items-center justify-center">
                  {favorites.length}
                </span>
              )}
            </Link>

            {/* Cart */}
            <div className="relative" ref={cartRef}>
              <button
                onClick={toggleCart}
                className="flex items-center gap-1.5 md:gap-2 text-gray-700 hover:text-[#DA4C2F] transition-colors"
              >
                <span className="text-xs md:text-sm font-semibold">
                  ${getCartTotal().toFixed(2)}
                </span>
                <div className="relative">
                  <ShoppingCart className="w-5 h-5 md:w-6 md:h-6" />
                  {getTotalItems() > 0 && (
                    <span className="absolute -top-1 -right-1 bg-[#DA4C2F] text-white text-[9px] font-bold rounded-full w-4 h-4 md:w-5 md:h-5 flex items-center justify-center">
                      {getTotalItems()}
                    </span>
                  )}
                </div>
              </button>

              {/* Cart Dropdown - Keep as is */}
              {isCartOpen && (
                <div className="absolute right-0 mt-2 w-72 md:w-96 bg-white rounded shadow-xl z-50 max-h-[500px] flex flex-col border border-gray-200">
                  {/* ... existing cart content ... */}
                  <div className="p-4 border-b border-gray-100 flex justify-between items-center">
                    <h3 className="font-bold text-base md:text-lg text-gray-800">
                      Your Cart
                    </h3>
                    <button
                      onClick={toggleCart}
                      className="text-gray-400 hover:text-gray-600 transition-colors"
                    >
                      <X className="w-5 h-5" />
                    </button>
                  </div>
                  <div className="flex-1 overflow-y-auto p-4">
                    {cartItems.length === 0 ? (
                      <p className="text-center text-gray-500 py-8 text-sm">
                        Your cart is empty
                      </p>
                    ) : (
                      <ul className="space-y-3">
                        {cartItems.map((item) => (
                          <li key={item.id} className="flex gap-3 items-center">
                            <img
                              src={item.image}
                              alt={item.name}
                              className="w-14 h-14 md:w-16 md:h-16 object-cover"
                            />
                            <div className="flex-1 min-w-0">
                              <h4 className="font-medium text-xs md:text-sm text-gray-800 truncate">
                                {item.name}
                              </h4>
                              <p className="text-xs md:text-sm text-[#DA4C2F] font-semibold">
                                {item.price}
                              </p>
                              <div className="flex items-center gap-2 mt-1">
                                <button
                                  onClick={() =>
                                    updateQuantity(item.id, item.quantity - 1)
                                  }
                                  className="w-5 h-5 md:w-6 md:h-6 rounded border border-gray-300 flex items-center justify-center hover:bg-gray-100 transition-colors text-xs"
                                >
                                  <Minus className="w-2.5 h-2.5" />
                                </button>
                                <span className="text-xs md:text-sm w-5 md:w-6 text-center font-medium">
                                  {item.quantity}
                                </span>
                                <button
                                  onClick={() =>
                                    updateQuantity(item.id, item.quantity + 1)
                                  }
                                  className="w-5 h-5 md:w-6 md:h-6 rounded border border-gray-300 flex items-center justify-center hover:bg-gray-100 transition-colors text-xs"
                                >
                                  <Plus className="w-2.5 h-2.5" />
                                </button>
                              </div>
                            </div>
                            <button
                              onClick={() => removeFromCart(item.id)}
                              className="text-red-400 hover:text-red-600 transition-colors"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                  {cartItems.length > 0 && (
                    <div className="p-4 border-t border-gray-100">
                      <div className="flex justify-between font-bold mb-3 text-gray-800 text-sm md:text-base">
                        <span>Total:</span>
                        <span>${getCartTotal().toFixed(2)}</span>
                      </div>
                      <Link
                        to="/checkout"
                        className="w-full bg-[#DA4C2F] text-white py-2.5 md:py-3 rounded font-medium hover:bg-[#c43d22] transition-colors text-sm md:text-base block text-center"
                        onClick={toggleCart}
                      >
                        Proceed to Checkout
                      </Link>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Mobile Search - Visible only on mobile */}
        <div className="md:hidden pb-3">
          <form onSubmit={handleSearch} className="relative">
            <input
              type="search"
              placeholder="Search product"
              value={searchQuery}
              onChange={handleSearchChange}
              onKeyDown={handleKeyDown}
              className="w-full px-4 py-2 pr-10 border border-gray-300 rounded focus:outline-none focus:border-[#DA4C2F] focus:ring-2 focus:ring-[#DA4C2F]/20 transition-all text-sm bg-gray-50"
            />
            <button
              type="submit"
              disabled={isSearching}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-[#DA4C2F] transition-colors disabled:opacity-50"
              aria-label="Search"
            >
              {isSearching ? (
                <div className="w-4 h-4 border-2 border-[#DA4C2F] border-t-transparent rounded-full animate-spin"></div>
              ) : (
                <Search className="w-4 h-4" />
              )}
            </button>
          </form>
        </div>

        {/* Navigation - Desktop */}
        <nav className="hidden lg:block border-t border-gray-200">
          <ul className="flex justify-center gap-8 py-3">
            {navLinks.map((link) => (
              <li key={link.path}>
                <Link
                  to={link.path}
                  className="header-nav-link text-sm font-medium text-gray-700"
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </div>

      {/* Mobile Sidebar */}
      <div
        className={`fixed inset-0 z-50 transition-transform duration-300 ${isNavOpen ? "translate-x-0" : "-translate-x-full"}`}
      >
        <div className="absolute inset-0 bg-black/50" onClick={toggleNav}></div>
        <div className="relative w-80 h-full bg-white shadow-xl p-6 overflow-y-auto">
          <div className="flex justify-between items-center mb-8">
            <img
              src="/assets/images/Logo_1.png"
              width="179"
              height="26"
              alt="Velaré"
              className="h-8 w-auto"
            />
            <button
              onClick={toggleNav}
              className="text-gray-400 hover:text-gray-600 transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
          <ul className="space-y-4">
            {navLinks.map((link) => (
              <li key={link.path}>
                <Link
                  to={link.path}
                  onClick={toggleNav}
                  className="block text-base font-medium text-gray-700 hover:text-[#DA4C2F] transition-colors"
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </header>
  );
}
