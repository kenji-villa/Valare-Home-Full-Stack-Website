import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Header from "../components/layout/Header";
import Footer from "../components/layout/Footer";
import {
  Truck,
  Home,
  CreditCard,
  Shield,
  Lock,
  ChevronRight,
  ShoppingBag,
  Ticket,
} from "lucide-react";
import { useCart } from "../context/CartContext";

export default function Checkout() {
  const navigate = useNavigate();
  const { cartItems, getCartTotal } = useCart();
  const [deliveryMethod, setDeliveryMethod] = useState("delivery");
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    country: "",
    city: "",
    state: "",
    zipCode: "",
    agreeTerms: false,
  });
  const [discountCode, setDiscountCode] = useState("");
  const [discountApplied, setDiscountApplied] = useState(false);

  const subtotal = getCartTotal();
  const shipping = deliveryMethod === "delivery" ? 500.0 : 0;
  const discount = discountApplied ? 10.0 : 0;
  const total = subtotal + shipping - discount;

  const handleInputChange = (e) => {
    const { id, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [id]: type === "checkbox" ? checked : value,
    }));
  };

  const handleApplyDiscount = () => {
    if (discountCode.toLowerCase() === "welcome10") {
      setDiscountApplied(true);
    } else {
      alert("Invalid discount code");
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.agreeTerms) {
      alert("Please agree to the Terms and Conditions");
      return;
    }
    alert("Order placed successfully!");
    navigate("/");
  };

  return (
    <>
      <Header />
      <main className="bg-gray-50 min-h-screen py-8">
        <div className="container">
          <div className="flex items-center gap-2 text-sm text-gray-500 mb-6">
            <Link to="/" className="hover:text-[#DA4C2F]">
              Home
            </Link>
            <ChevronRight className="w-4 h-4" />
            <Link to="/cart" className="hover:text-[#DA4C2F]">
              Cart
            </Link>
            <ChevronRight className="w-4 h-4" />
            <span className="text-gray-800 font-medium">Checkout</span>
          </div>

          <div className="flex flex-col lg:flex-row gap-8">
            {/* Checkout Form */}
            <div className="flex-1">
              <div className="bg-white rounded-lg p-6 shadow-sm">
                <h1 className="text-2xl font-bold text-[#1a2d5e] mb-6">
                  Checkout
                </h1>

                <form onSubmit={handleSubmit}>
                  {/* Shipping Information */}
                  <div className="mb-8">
                    <h2 className="text-lg font-semibold text-gray-800 mb-4">
                      Shipping Information
                    </h2>

                    {/* Delivery Method */}
                    <div className="flex gap-4 mb-6">
                      <button
                        type="button"
                        onClick={() => setDeliveryMethod("delivery")}
                        className={`flex-1 p-4 border-2 rounded-lg text-center transition-all ${
                          deliveryMethod === "delivery"
                            ? "border-[#DA4C2F] bg-[#DA4C2F]/5"
                            : "border-gray-200 hover:border-gray-300"
                        }`}
                      >
                        <Truck
                          className={`w-6 h-6 mx-auto mb-2 ${deliveryMethod === "delivery" ? "text-[#DA4C2F]" : "text-gray-400"}`}
                        />
                        <span className="font-medium">Delivery</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => setDeliveryMethod("pickup")}
                        className={`flex-1 p-4 border-2 rounded-lg text-center transition-all ${
                          deliveryMethod === "pickup"
                            ? "border-[#DA4C2F] bg-[#DA4C2F]/5"
                            : "border-gray-200 hover:border-gray-300"
                        }`}
                      >
                        <Home
                          className={`w-6 h-6 mx-auto mb-2 ${deliveryMethod === "pickup" ? "text-[#DA4C2F]" : "text-gray-400"}`}
                        />
                        <span className="font-medium">Pick up</span>
                      </button>
                    </div>

                    {/* Form Fields */}
                    <div className="space-y-4">
                      <div>
                        <label
                          htmlFor="fullName"
                          className="block text-sm font-medium text-gray-700 mb-1"
                        >
                          Full name
                        </label>
                        <input
                          type="text"
                          id="fullName"
                          value={formData.fullName}
                          onChange={handleInputChange}
                          placeholder="Enter full name"
                          className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#DA4C2F] focus:border-transparent"
                          required
                        />
                      </div>
                      <div>
                        <label
                          htmlFor="email"
                          className="block text-sm font-medium text-gray-700 mb-1"
                        >
                          Email address
                        </label>
                        <input
                          type="email"
                          id="email"
                          value={formData.email}
                          onChange={handleInputChange}
                          placeholder="Enter email address"
                          className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#DA4C2F] focus:border-transparent"
                          required
                        />
                      </div>
                      <div>
                        <label
                          htmlFor="phone"
                          className="block text-sm font-medium text-gray-700 mb-1"
                        >
                          Phone number
                        </label>
                        <input
                          type="tel"
                          id="phone"
                          value={formData.phone}
                          onChange={handleInputChange}
                          placeholder="Enter phone number"
                          className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#DA4C2F] focus:border-transparent"
                          required
                        />
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label
                            htmlFor="country"
                            className="block text-sm font-medium text-gray-700 mb-1"
                          >
                            Country
                          </label>
                          <select
                            id="country"
                            value={formData.country}
                            onChange={handleInputChange}
                            className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#DA4C2F] focus:border-transparent"
                            required
                          >
                            <option value="">Choose country</option>
                            <option value="US">United States</option>
                            <option value="UK">United Kingdom</option>
                            <option value="CA">Canada</option>
                            <option value="AU">Australia</option>
                          </select>
                        </div>
                        <div>
                          <label
                            htmlFor="city"
                            className="block text-sm font-medium text-gray-700 mb-1"
                          >
                            City
                          </label>
                          <input
                            type="text"
                            id="city"
                            value={formData.city}
                            onChange={handleInputChange}
                            placeholder="Enter city"
                            className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#DA4C2F] focus:border-transparent"
                            required
                          />
                        </div>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label
                            htmlFor="state"
                            className="block text-sm font-medium text-gray-700 mb-1"
                          >
                            State
                          </label>
                          <input
                            type="text"
                            id="state"
                            value={formData.state}
                            onChange={handleInputChange}
                            placeholder="Enter state"
                            className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#DA4C2F] focus:border-transparent"
                            required
                          />
                        </div>
                        <div>
                          <label
                            htmlFor="zipCode"
                            className="block text-sm font-medium text-gray-700 mb-1"
                          >
                            ZIP Code
                          </label>
                          <input
                            type="text"
                            id="zipCode"
                            value={formData.zipCode}
                            onChange={handleInputChange}
                            placeholder="Enter ZIP code"
                            className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#DA4C2F] focus:border-transparent"
                            required
                          />
                        </div>
                      </div>
                    </div>

                    <div className="mt-4 flex items-start gap-2">
                      <input
                        type="checkbox"
                        id="agreeTerms"
                        checked={formData.agreeTerms}
                        onChange={handleInputChange}
                        className="mt-1 w-4 h-4 accent-[#DA4C2F]"
                        required
                      />
                      <label
                        htmlFor="agreeTerms"
                        className="text-sm text-gray-600"
                      >
                        I have read and agree to the Terms and Conditions.
                      </label>
                    </div>
                  </div>

                  {/* Place Order Button */}
                  <button
                    type="submit"
                    className="w-full bg-[#DA4C2F] text-white py-3 rounded-lg font-semibold hover:bg-[#c43d22] transition-colors flex items-center justify-center gap-2"
                  >
                    <Lock className="w-5 h-5" />
                    Place Order • ETB {total.toFixed(2)}
                  </button>
                </form>
              </div>
            </div>

            {/* Order Summary */}
            <div className="lg:w-96">
              <div className="bg-white rounded-lg p-6 shadow-sm sticky top-24">
                <h2 className="text-lg font-bold text-[#1a2d5e] mb-4 flex items-center gap-2">
                  <ShoppingBag className="w-5 h-5 text-[#DA4C2F]" />
                  Review your cart
                </h2>

                <div className="space-y-3 mb-4 max-h-60 overflow-y-auto">
                  {cartItems.length === 0 ? (
                    <p className="text-gray-500 text-sm">Your cart is empty</p>
                  ) : (
                    cartItems.map((item) => (
                      <div
                        key={item.id}
                        className="flex items-center justify-between py-2 border-b border-gray-100"
                      >
                        <div className="flex-1">
                          <p className="text-sm font-medium text-gray-800">
                            {item.name}
                          </p>
                          <p className="text-xs text-gray-500">
                            {item.quantity}x
                          </p>
                        </div>
                        <span className="text-sm font-semibold text-[#DA4C2F]">
                          {item.price}
                        </span>
                      </div>
                    ))
                  )}
                </div>

                {/* Discount Code */}
                <div className="flex gap-2 mb-4">
                  <input
                    type="text"
                    placeholder="Discount code"
                    value={discountCode}
                    onChange={(e) => setDiscountCode(e.target.value)}
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#DA4C2F] focus:border-transparent"
                  />
                  <button
                    type="button"
                    onClick={handleApplyDiscount}
                    className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-300 transition-colors"
                  >
                    Apply
                  </button>
                </div>

                {/* Totals */}
                <div className="space-y-2 pt-3 border-t border-gray-200">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Subtotal</span>
                    <span className="font-medium">
                      ETB {subtotal.toFixed(2)}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Shipping</span>
                    <span className="font-medium">
                      ETB {shipping.toFixed(2)}
                    </span>
                  </div>
                  {discountApplied && (
                    <div className="flex justify-between text-sm text-green-600">
                      <span>Discount</span>
                      <span>-ETB {discount.toFixed(2)}</span>
                    </div>
                  )}
                  <div className="flex justify-between text-lg font-bold pt-2 border-t border-gray-200">
                    <span>Total</span>
                    <span className="text-[#DA4C2F]">
                      ETB {total.toFixed(2)}
                    </span>
                  </div>
                </div>

                {/* Secure Checkout Badge */}
                <div className="mt-4 p-3 bg-gray-50 rounded-lg flex items-center gap-3 text-sm text-gray-600">
                  <Shield className="w-5 h-5 text-[#DA4C2F] flex-shrink-0" />
                  <span>Secure Checkout - SSL Encrypted</span>
                </div>
                <p className="text-xs text-gray-500 mt-2 text-center">
                  Ensuring your financial and personal details are secure during
                  every transaction.
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
