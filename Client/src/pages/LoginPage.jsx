import { Eye, EyeOff, CheckCircle } from "lucide-react";
import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [showRegisterPassword, setShowRegisterPassword] = useState(false);
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    loginEmail: "",
    loginPassword: "",
    registerUsername: "",
    registerEmail: "",
    registerPassword: "",
    agreeTerms: false,
    rememberMe: false,
  });
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const { login, user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const form = params.get("form");
    if (form === "register") {
      setIsLogin(false);
    } else if (form === "login") {
      setIsLogin(true);
    }
  }, [location]);

  useEffect(() => {
    if (user) {
      navigate("/");
    }
  }, [user, navigate]);

  const handleInputChange = (e) => {
    const { id, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [id]: type === "checkbox" ? checked : value,
    }));
    if (errors[id]) {
      setErrors((prev) => ({ ...prev, [id]: "" }));
    }
  };

  const validateEmail = (email) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  const validateUsername = (username) => {
    return username.length >= 3 && /^[A-Za-z0-9_]+$/.test(username);
  };

  const validatePassword = (password) => {
    return (
      password.length >= 8 &&
      /[A-Z]/.test(password) &&
      /[0-9]/.test(password) &&
      /[@$!%*?&]/.test(password)
    );
  };

  const validateLoginForm = () => {
    const newErrors = {};
    if (!formData.loginEmail) {
      newErrors.loginEmail = "Email is required";
    } else if (!validateEmail(formData.loginEmail)) {
      newErrors.loginEmail = "Enter a valid email address";
    }
    if (!formData.loginPassword) {
      newErrors.loginPassword = "Password is required";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validateRegisterForm = () => {
    const newErrors = {};
    if (!formData.registerUsername) {
      newErrors.registerUsername = "Username is required";
    } else if (!validateUsername(formData.registerUsername)) {
      newErrors.registerUsername =
        "Username must be at least 3 characters and contain only letters, numbers, and underscores";
    }
    if (!formData.registerEmail) {
      newErrors.registerEmail = "Email is required";
    } else if (!validateEmail(formData.registerEmail)) {
      newErrors.registerEmail = "Enter a valid email address";
    }
    if (!formData.registerPassword) {
      newErrors.registerPassword = "Password is required";
    } else if (!validatePassword(formData.registerPassword)) {
      newErrors.registerPassword =
        "Password must be at least 8 characters and include uppercase, number, and special character";
    }
    if (!formData.agreeTerms) {
      newErrors.agreeTerms = "You must agree to the terms & conditions";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    if (!validateLoginForm()) return;

    setIsLoading(true);
    setErrors({});
    try {
      const response = await fetch("http://localhost:3001/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: formData.loginEmail,
          password: formData.loginPassword,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Login failed");
      }

      localStorage.setItem("authToken", data.token);
      localStorage.setItem("userData", JSON.stringify(data.user));

      alert(`Welcome ${data.user.username}!`);

      if (data.user.role === "admin") {
        window.location.href = "/admin";
      } else {
        window.location.href = "/";
      }
    } catch (error) {
      console.error("Login error:", error);
      setErrors({ submit: error.message || "Login failed. Please try again." });
    } finally {
      setIsLoading(false);
    }
  };

  const handleRegisterSubmit = async (e) => {
    e.preventDefault();
    if (!validateRegisterForm()) return;

    setIsLoading(true);
    setErrors({});
    try {
      const response = await fetch("http://localhost:3001/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          username: formData.registerUsername,
          email: formData.registerEmail,
          password: formData.registerPassword,
        }),
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.message || "Registration failed");

      setSuccessMessage("Registration successful! Please login.");
      setTimeout(() => {
        setIsLogin(true);
        setFormData((prev) => ({
          ...prev,
          registerUsername: "",
          registerEmail: "",
          registerPassword: "",
          agreeTerms: false,
        }));
        setSuccessMessage("");
      }, 2000);
    } catch (error) {
      setErrors({ submit: error.message });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#E2D5C2] p-4">
      <div className="relative bg-white rounded-2xl shadow-xl w-full max-w-md p-8 pt-24 border border-[#DA4C2F] transition-all">
        {/* Form Header */}
        <div
          className="absolute top-0 left-1/2 -translate-x-1/2 w-36 h-[70px] bg-[#DA4C2F] rounded-b-2xl flex items-center justify-center
          before:absolute before:top-0 before:-left-[30px] before:w-[30px] before:h-[30px] before:rounded-tr-[50%] before:shadow-[15px_0_0_#DA4C2F]
          after:absolute after:top-0 after:-right-[30px] after:w-[30px] after:h-[30px] after:rounded-tl-[50%] after:shadow-[-15px_0_0_#DA4C2F]"
        >
          <h2 className="text-white text-2xl font-bold">
            {isLogin ? "Login" : "Register"}
          </h2>
        </div>

        {successMessage && (
          <div className="mb-4 p-3 bg-green-100 text-green-700 rounded-lg flex items-center gap-2 text-sm">
            <CheckCircle className="w-5 h-5 flex-shrink-0" />
            {successMessage}
          </div>
        )}

        {errors.submit && (
          <div className="mb-4 p-3 bg-red-100 text-red-600 rounded-lg text-sm">
            {errors.submit}
          </div>
        )}

        {/* LOGIN FORM */}
        <form
          onSubmit={handleLoginSubmit}
          className={isLogin ? "block" : "hidden"}
        >
          {/* Login Email */}
          <div className="mb-4">
            <div className="relative">
              <input
                type="email"
                id="loginEmail"
                value={formData.loginEmail}
                onChange={handleInputChange}
                className={`w-full px-4 py-3 pr-12 border rounded-lg focus:outline-none focus:border-[#DA4C2F] focus:ring-2 focus:ring-[#DA4C2F]/20 transition-all ${
                  errors.loginEmail ? "border-red-500" : "border-gray-300"
                }`}
                placeholder="Enter your email"
              />
              <i className="bx bx-envelope absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 text-xl"></i>
            </div>
            {errors.loginEmail && (
              <p className="text-red-500 text-xs mt-1 ml-4">
                {errors.loginEmail}
              </p>
            )}
          </div>

          {/* Login Password */}
          <div className="mb-4">
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                id="loginPassword"
                value={formData.loginPassword}
                onChange={handleInputChange}
                className={`w-full px-4 py-3 pr-12 border rounded-lg focus:outline-none focus:border-[#DA4C2F] focus:ring-2 focus:ring-[#DA4C2F]/20 transition-all ${
                  errors.loginPassword ? "border-red-500" : "border-gray-300"
                }`}
                placeholder="Enter your password"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
              >
                {showPassword ? (
                  <EyeOff className="w-5 h-5" />
                ) : (
                  <Eye className="w-5 h-5" />
                )}
              </button>
            </div>
            {errors.loginPassword && (
              <p className="text-red-500 text-xs mt-1 ml-4">
                {errors.loginPassword}
              </p>
            )}
          </div>

          <div className="flex justify-between items-center text-sm mb-6">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                id="rememberMe"
                checked={formData.rememberMe}
                onChange={handleInputChange}
                className="w-4 h-4 accent-[#DA4C2F]"
              />
              <span className="text-gray-600">Remember me</span>
            </label>
            <a href="#" className="text-[#DA4C2F] hover:underline text-sm">
              Forgot password?
            </a>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-[#DA4C2F] text-white py-3 rounded-full font-medium hover:bg-[#1a2d5e] transition-colors flex items-center justify-center gap-2 disabled:opacity-70"
          >
            {isLoading ? "Signing In..." : "Sign In"}
          </button>

          <p className="text-center mt-4 text-sm text-gray-600">
            Don't have an account?{" "}
            <button
              type="button"
              onClick={() => {
                setIsLogin(false);
                setErrors({});
              }}
              className="text-[#DA4C2F] hover:underline font-medium"
            >
              Register
            </button>
          </p>
        </form>

        {/* REGISTER FORM */}
        <form
          onSubmit={handleRegisterSubmit}
          className={!isLogin ? "block" : "hidden"}
        >
          {/* Register Username */}
          <div className="mb-4">
            <div className="relative">
              <input
                type="text"
                id="registerUsername"
                value={formData.registerUsername}
                onChange={handleInputChange}
                className={`w-full px-4 py-3 pr-12 border rounded-lg focus:outline-none focus:border-[#DA4C2F] focus:ring-2 focus:ring-[#DA4C2F]/20 transition-all ${
                  errors.registerUsername ? "border-red-500" : "border-gray-300"
                }`}
                placeholder="Choose a username"
              />
              <i className="bx bx-user absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 text-xl"></i>
            </div>
            {errors.registerUsername && (
              <p className="text-red-500 text-xs mt-1 ml-4">
                {errors.registerUsername}
              </p>
            )}
          </div>

          {/* Register Email */}
          <div className="mb-4">
            <div className="relative">
              <input
                type="email"
                id="registerEmail"
                value={formData.registerEmail}
                onChange={handleInputChange}
                className={`w-full px-4 py-3 pr-12 border rounded-lg focus:outline-none focus:border-[#DA4C2F] focus:ring-2 focus:ring-[#DA4C2F]/20 transition-all ${
                  errors.registerEmail ? "border-red-500" : "border-gray-300"
                }`}
                placeholder="Enter your email"
              />
              <i className="bx bx-envelope absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 text-xl"></i>
            </div>
            {errors.registerEmail && (
              <p className="text-red-500 text-xs mt-1 ml-4">
                {errors.registerEmail}
              </p>
            )}
          </div>

          {/* Register Password */}
          <div className="mb-4">
            <div className="relative">
              <input
                type={showRegisterPassword ? "text" : "password"}
                id="registerPassword"
                value={formData.registerPassword}
                onChange={handleInputChange}
                className={`w-full px-4 py-3 pr-12 border rounded-lg focus:outline-none focus:border-[#DA4C2F] focus:ring-2 focus:ring-[#DA4C2F]/20 transition-all ${
                  errors.registerPassword ? "border-red-500" : "border-gray-300"
                }`}
                placeholder="Create a password"
              />
              <button
                type="button"
                onClick={() => setShowRegisterPassword(!showRegisterPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
              >
                {showRegisterPassword ? (
                  <EyeOff className="w-5 h-5" />
                ) : (
                  <Eye className="w-5 h-5" />
                )}
              </button>
            </div>
            {errors.registerPassword && (
              <p className="text-red-500 text-xs mt-1 ml-4">
                {errors.registerPassword}
              </p>
            )}
            <p className="text-xs text-gray-500 mt-1 ml-4">
              Must be 8+ chars with uppercase, number, and special character
            </p>
          </div>

          {/* Agree Terms */}
          <div className="mb-6">
            <label className="flex items-center gap-2 text-sm cursor-pointer">
              <input
                type="checkbox"
                id="agreeTerms"
                checked={formData.agreeTerms}
                onChange={handleInputChange}
                className="w-4 h-4 accent-[#DA4C2F]"
              />
              <span className="text-gray-600">
                I agree to terms & conditions
              </span>
            </label>
            {errors.agreeTerms && (
              <p className="text-red-500 text-xs mt-1">{errors.agreeTerms}</p>
            )}
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-[#DA4C2F] text-white py-3 rounded-full font-medium hover:bg-[#1a2d5e] transition-colors flex items-center justify-center gap-2 disabled:opacity-70"
          >
            {isLoading ? "Creating Account..." : "Sign Up"}
          </button>

          <p className="text-center mt-4 text-sm text-gray-600">
            Already have an account?{" "}
            <button
              type="button"
              onClick={() => {
                setIsLogin(true);
                setErrors({});
              }}
              className="text-[#DA4C2F] hover:underline font-medium"
            >
              Login
            </button>
          </p>
        </form>
      </div>
    </div>
  );
}
