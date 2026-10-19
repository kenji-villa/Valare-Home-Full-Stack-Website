import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  RefreshCw,
  Download,
  User,
  Home,
  LogOut,
  ChevronDown,
} from "lucide-react";

export default function AdminHeader({ activeTab, darkMode, user }) {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = () => {
    // Clear auth tokens
    localStorage.removeItem("authToken");
    localStorage.removeItem("userData");
    // Redirect to login page
    navigate("/login");
  };

  const handleProfileView = () => {
    setIsDropdownOpen(false);
    // Will implement later
    console.log("Profile viewer clicked");
  };

  const handleGoHome = () => {
    setIsDropdownOpen(false);
    navigate("/");
  };

  return (
    <div
      className={`${darkMode ? "bg-gray-800 border-gray-700" : "bg-white border-gray-200"} border-b px-6 py-4 flex items-center justify-between sticky top-0 z-50`}
    >
      <div>
        <h1
          className={`text-xl font-bold capitalize ${darkMode ? "text-white" : "text-gray-800"}`}
        >
          {activeTab}
        </h1>
        <p
          className={`text-sm ${darkMode ? "text-gray-400" : "text-gray-500"}`}
        >
          Welcome back, {user?.username || "Admin"}
        </p>
      </div>

      <div className="flex items-center gap-3">
        {/* Refresh Button */}
        <button
          onClick={() => window.location.reload()}
          className={`p-2 ${darkMode ? "hover:bg-gray-700" : "hover:bg-gray-100"} rounded-lg transition-colors`}
        >
          <RefreshCw
            className={`w-5 h-5 ${darkMode ? "text-gray-400" : "text-gray-500"}`}
          />
        </button>

        {/* Download Button */}
        <button
          className={`p-2 ${darkMode ? "hover:bg-gray-700" : "hover:bg-gray-100"} rounded-lg transition-colors`}
        >
          <Download
            className={`w-5 h-5 ${darkMode ? "text-gray-400" : "text-gray-500"}`}
          />
        </button>

        {/* Profile Dropdown */}
        <div className="relative z-50" ref={dropdownRef}>
          <button
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            className={`flex items-center gap-2 pl-4 border-l ${darkMode ? "border-gray-700" : "border-gray-200"} transition-colors`}
          >
            <div className="w-8 h-8 rounded-full bg-[#DA4C2F] text-white flex items-center justify-center font-semibold text-sm">
              {user?.username?.charAt(0)?.toUpperCase() || "A"}
            </div>
            <ChevronDown
              className={`w-4 h-4 ${darkMode ? "text-gray-400" : "text-gray-500"} transition-transform ${isDropdownOpen ? "rotate-180" : ""}`}
            />
          </button>

          {/* Dropdown Menu */}
          {isDropdownOpen && (
            <div
              className={`absolute right-0 mt-2 w-56 rounded-lg shadow-lg py-2 border ${darkMode ? "bg-gray-800 border-gray-700" : "bg-white border-gray-200"} z-50`}
            >
              {/* User Info */}
              <div
                className={`px-4 py-3 border-b ${darkMode ? "border-gray-700" : "border-gray-100"}`}
              >
                <p
                  className={`text-sm font-semibold ${darkMode ? "text-white" : "text-gray-800"}`}
                >
                  {user?.username || "Admin"}
                </p>
                <p
                  className={`text-xs ${darkMode ? "text-gray-400" : "text-gray-500"}`}
                >
                  {user?.email || "admin@velarehome.com"}
                </p>
                <span className="inline-block mt-1 px-2 py-0.5 bg-[#DA4C2F]/10 text-[#DA4C2F] text-xs rounded-full font-medium">
                  Administrator
                </span>
              </div>

              {/* Menu Items */}
              <div className="py-1">
                {/* Profile Viewer */}
                <button
                  onClick={handleProfileView}
                  className={`w-full flex items-center gap-3 px-4 py-2 text-sm transition-colors ${
                    darkMode
                      ? "text-gray-300 hover:bg-gray-700"
                      : "text-gray-700 hover:bg-gray-50"
                  }`}
                >
                  <User className="w-4 h-4" />
                  <span>Profile Viewer</span>
                </button>

                {/* Velaré Home */}
                <button
                  onClick={handleGoHome}
                  className={`w-full flex items-center gap-3 px-4 py-2 text-sm transition-colors ${
                    darkMode
                      ? "text-gray-300 hover:bg-gray-700"
                      : "text-gray-700 hover:bg-gray-50"
                  }`}
                >
                  <Home className="w-4 h-4" />
                  <span>Velaré Home</span>
                </button>

                {/* Divider */}
                <div
                  className={`my-1 border-t ${darkMode ? "border-gray-700" : "border-gray-100"}`}
                ></div>

                {/* Logout */}
                <button
                  onClick={handleLogout}
                  className={`w-full flex items-center gap-3 px-4 py-2 text-sm transition-colors ${
                    darkMode
                      ? "text-red-400 hover:bg-red-900/20"
                      : "text-red-600 hover:bg-red-50"
                  }`}
                >
                  <LogOut className="w-4 h-4" />
                  <span>Logout</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
