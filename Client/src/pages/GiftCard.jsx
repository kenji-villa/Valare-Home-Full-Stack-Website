import { useState } from "react";
import Header from "../components/layout/Header";
import Footer from "../components/layout/Footer";
import {
  Gift,
  CreditCard,
  Send,
  CheckCircle,
  Sparkles,
  Heart,
  Mail,
  Calendar,
} from "lucide-react";

export default function GiftCard() {
  const [formData, setFormData] = useState({
    recipientName: "",
    recipientEmail: "",
    senderName: "",
    senderEmail: "",
    amount: "100",
    message: "",
    deliveryDate: "",
  });
  const [step, setStep] = useState(1);
  const [submitted, setSubmitted] = useState(false);

  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData((prev) => ({ ...prev, [id]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
    setTimeout(() => {
      setStep(1);
      setSubmitted(false);
      setFormData({
        recipientName: "",
        recipientEmail: "",
        senderName: "",
        senderEmail: "",
        amount: "100",
        message: "",
        deliveryDate: "",
      });
    }, 3000);
  };

  const amounts = ["50", "100", "150", "200", "250", "500"];

  return (
    <>
      <Header />
      <main className="bg-gray-50 min-h-screen">
        {/* Hero Section */}
        <section className="relative py-16 min-h-[350px] flex items-center">
          <div
            className="absolute inset-0 bg-cover bg-center bg-no-repeat"
            style={{
              backgroundImage: "url('/assets/images/p5.jpg')",
              backgroundPosition: "center 30%",
            }}
          >
            <div className="absolute inset-0 bg-black/55"></div>
          </div>
          <div className="container relative z-10">
            <div className="max-w-3xl mx-auto text-center">
              <Gift className="w-16 h-16 mx-auto mb-4 text-[#DA4C2F]" />
              <h1 className="text-4xl md:text-5xl font-bold mb-4 text-white">
                Online Gift Card
              </h1>
              <p className="text-lg text-gray-200">
                Give the gift of beautiful furniture. Perfect for any occasion.
              </p>
            </div>
          </div>
        </section>

        <div className="container py-12">
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
            {/* Main Form */}
            <div className="lg:col-span-3">
              <div className="bg-white rounded-lg p-8 shadow-sm">
                {submitted ? (
                  <div className="text-center py-12">
                    <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <CheckCircle className="w-10 h-10 text-green-500" />
                    </div>
                    <h3 className="text-2xl font-bold text-gray-800 mb-2">
                      Gift Card Sent!
                    </h3>
                    <p className="text-gray-600">
                      Your gift card has been sent to {formData.recipientEmail}
                    </p>
                    <p className="text-sm text-gray-500 mt-4">
                      You will receive a confirmation email shortly.
                    </p>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit}>
                    <h2 className="text-2xl font-bold text-[#1a2d5e] mb-6">
                      Send a Gift Card
                    </h2>

                    {/* Step indicator */}
                    <div className="flex items-center gap-4 mb-8">
                      <div
                        className={`flex items-center gap-2 ${step >= 1 ? "text-[#DA4C2F]" : "text-gray-400"}`}
                      >
                        <span className="w-8 h-8 rounded-full border-2 flex items-center justify-center font-bold text-sm border-current">
                          1
                        </span>
                        <span className="text-sm font-medium">Details</span>
                      </div>
                      <div
                        className={`flex-1 h-0.5 ${step >= 2 ? "bg-[#DA4C2F]" : "bg-gray-300"}`}
                      ></div>
                      <div
                        className={`flex items-center gap-2 ${step >= 2 ? "text-[#DA4C2F]" : "text-gray-400"}`}
                      >
                        <span className="w-8 h-8 rounded-full border-2 flex items-center justify-center font-bold text-sm border-current">
                          2
                        </span>
                        <span className="text-sm font-medium">Amount</span>
                      </div>
                      <div
                        className={`flex-1 h-0.5 ${step >= 3 ? "bg-[#DA4C2F]" : "bg-gray-300"}`}
                      ></div>
                      <div
                        className={`flex items-center gap-2 ${step >= 3 ? "text-[#DA4C2F]" : "text-gray-400"}`}
                      >
                        <span className="w-8 h-8 rounded-full border-2 flex items-center justify-center font-bold text-sm border-current">
                          3
                        </span>
                        <span className="text-sm font-medium">Send</span>
                      </div>
                    </div>

                    <div className="space-y-4">
                      {/* Step 1: Recipient Details */}
                      <div className={step === 1 ? "block" : "hidden"}>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <label
                              htmlFor="recipientName"
                              className="block text-sm font-medium text-gray-700 mb-1"
                            >
                              Recipient Name{" "}
                              <span className="text-red-500">*</span>
                            </label>
                            <input
                              type="text"
                              id="recipientName"
                              value={formData.recipientName}
                              onChange={handleChange}
                              placeholder="Enter name"
                              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#DA4C2F] focus:border-transparent"
                              required
                            />
                          </div>
                          <div>
                            <label
                              htmlFor="recipientEmail"
                              className="block text-sm font-medium text-gray-700 mb-1"
                            >
                              Recipient Email{" "}
                              <span className="text-red-500">*</span>
                            </label>
                            <input
                              type="email"
                              id="recipientEmail"
                              value={formData.recipientEmail}
                              onChange={handleChange}
                              placeholder="Enter email"
                              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#DA4C2F] focus:border-transparent"
                              required
                            />
                          </div>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                          <div>
                            <label
                              htmlFor="senderName"
                              className="block text-sm font-medium text-gray-700 mb-1"
                            >
                              Your Name <span className="text-red-500">*</span>
                            </label>
                            <input
                              type="text"
                              id="senderName"
                              value={formData.senderName}
                              onChange={handleChange}
                              placeholder="Enter your name"
                              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#DA4C2F] focus:border-transparent"
                              required
                            />
                          </div>
                          <div>
                            <label
                              htmlFor="senderEmail"
                              className="block text-sm font-medium text-gray-700 mb-1"
                            >
                              Your Email <span className="text-red-500">*</span>
                            </label>
                            <input
                              type="email"
                              id="senderEmail"
                              value={formData.senderEmail}
                              onChange={handleChange}
                              placeholder="Enter your email"
                              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#DA4C2F] focus:border-transparent"
                              required
                            />
                          </div>
                        </div>
                        <button
                          type="button"
                          onClick={() => setStep(2)}
                          className="mt-6 bg-[#DA4C2F] text-white px-6 py-2.5 rounded-lg font-medium hover:bg-[#c43d22] transition-colors"
                        >
                          Continue →
                        </button>
                      </div>

                      {/* Step 2: Amount & Message */}
                      <div className={step === 2 ? "block" : "hidden"}>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-3">
                            Select Amount{" "}
                            <span className="text-red-500">*</span>
                          </label>
                          <div className="flex flex-wrap gap-3">
                            {amounts.map((amount) => (
                              <button
                                key={amount}
                                type="button"
                                onClick={() =>
                                  setFormData((prev) => ({ ...prev, amount }))
                                }
                                className={`px-6 py-2.5 rounded-lg border-2 font-medium transition-all ${
                                  formData.amount === amount
                                    ? "border-[#DA4C2F] bg-[#DA4C2F]/10 text-[#DA4C2F]"
                                    : "border-gray-300 hover:border-gray-400"
                                }`}
                              >
                                ETB {amount}
                              </button>
                            ))}
                          </div>
                        </div>

                        <div className="mt-4">
                          <label
                            htmlFor="message"
                            className="block text-sm font-medium text-gray-700 mb-1"
                          >
                            Personal Message
                          </label>
                          <textarea
                            id="message"
                            value={formData.message}
                            onChange={handleChange}
                            rows="3"
                            placeholder="Write a personal message..."
                            className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#DA4C2F] focus:border-transparent resize-none"
                          />
                        </div>

                        <div className="mt-4">
                          <label
                            htmlFor="deliveryDate"
                            className="block text-sm font-medium text-gray-700 mb-1"
                          >
                            Delivery Date
                          </label>
                          <input
                            type="date"
                            id="deliveryDate"
                            value={formData.deliveryDate}
                            onChange={handleChange}
                            className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#DA4C2F] focus:border-transparent"
                          />
                        </div>

                        <div className="flex gap-3 mt-6">
                          <button
                            type="button"
                            onClick={() => setStep(1)}
                            className="px-6 py-2.5 border border-gray-300 rounded-lg font-medium hover:bg-gray-50 transition-colors"
                          >
                            ← Back
                          </button>
                          <button
                            type="button"
                            onClick={() => setStep(3)}
                            className="bg-[#DA4C2F] text-white px-6 py-2.5 rounded-lg font-medium hover:bg-[#c43d22] transition-colors"
                          >
                            Review →
                          </button>
                        </div>
                      </div>

                      {/* Step 3: Review & Send */}
                      <div className={step === 3 ? "block" : "hidden"}>
                        <div className="bg-gray-50 rounded-lg p-6 space-y-3">
                          <h3 className="font-bold text-gray-800 mb-3">
                            Review Your Gift Card
                          </h3>
                          <div className="flex justify-between py-2 border-b border-gray-200">
                            <span className="text-gray-600">Recipient</span>
                            <span className="font-medium">
                              {formData.recipientName}
                            </span>
                          </div>
                          <div className="flex justify-between py-2 border-b border-gray-200">
                            <span className="text-gray-600">
                              Recipient Email
                            </span>
                            <span className="font-medium">
                              {formData.recipientEmail}
                            </span>
                          </div>
                          <div className="flex justify-between py-2 border-b border-gray-200">
                            <span className="text-gray-600">Amount</span>
                            <span className="font-bold text-[#DA4C2F]">
                              ETB {formData.amount}
                            </span>
                          </div>
                          <div className="flex justify-between py-2 border-b border-gray-200">
                            <span className="text-gray-600">From</span>
                            <span className="font-medium">
                              {formData.senderName}
                            </span>
                          </div>
                          {formData.message && (
                            <div className="py-2 border-b border-gray-200">
                              <span className="text-gray-600 block mb-1">
                                Message
                              </span>
                              <p className="text-gray-700 italic">
                                "{formData.message}"
                              </p>
                            </div>
                          )}
                          {formData.deliveryDate && (
                            <div className="flex justify-between py-2">
                              <span className="text-gray-600">
                                Delivery Date
                              </span>
                              <span className="font-medium">
                                {formData.deliveryDate}
                              </span>
                            </div>
                          )}
                        </div>

                        <div className="flex gap-3 mt-6">
                          <button
                            type="button"
                            onClick={() => setStep(2)}
                            className="px-6 py-2.5 border border-gray-300 rounded-lg font-medium hover:bg-gray-50 transition-colors"
                          >
                            ← Back
                          </button>
                          <button
                            type="submit"
                            className="flex-1 bg-[#DA4C2F] text-white px-6 py-2.5 rounded-lg font-medium hover:bg-[#c43d22] transition-colors flex items-center justify-center gap-2"
                          >
                            <Send className="w-5 h-5" />
                            Send Gift Card
                          </button>
                        </div>
                      </div>
                    </div>
                  </form>
                )}
              </div>
            </div>

            {/* Sidebar */}
            <div className="lg:col-span-2">
              <div className="bg-white rounded-lg p-6 shadow-sm sticky top-24">
                <h3 className="text-lg font-bold text-[#1a2d5e] mb-4">
                  Why Choose a Gift Card?
                </h3>
                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 rounded-full bg-[#DA4C2F]/10 flex items-center justify-center flex-shrink-0">
                      <Heart className="w-5 h-5 text-[#DA4C2F]" />
                    </div>
                    <div>
                      <h4 className="font-medium text-gray-800">
                        Perfect for Any Occasion
                      </h4>
                      <p className="text-sm text-gray-600">
                        Birthdays, anniversaries, housewarmings, or just because
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 rounded-full bg-[#DA4C2F]/10 flex items-center justify-center flex-shrink-0">
                      <CreditCard className="w-5 h-5 text-[#DA4C2F]" />
                    </div>
                    <div>
                      <h4 className="font-medium text-gray-800">
                        Instant Delivery
                      </h4>
                      <p className="text-sm text-gray-600">
                        Sent via email within minutes of purchase
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 rounded-full bg-[#DA4C2F]/10 flex items-center justify-center flex-shrink-0">
                      <Sparkles className="w-5 h-5 text-[#DA4C2F]" />
                    </div>
                    <div>
                      <h4 className="font-medium text-gray-800">
                        No Expiration
                      </h4>
                      <p className="text-sm text-gray-600">
                        Valid forever - use anytime
                      </p>
                    </div>
                  </div>
                </div>

                <div className="mt-6 p-4 bg-[#DA4C2F]/5 rounded-lg border border-[#DA4C2F]/20">
                  <p className="text-sm text-gray-700 text-center">
                    💡 Gift cards can be used on any product across our website
                  </p>
                </div>

                <div className="mt-4 flex items-center gap-2 text-sm text-gray-500">
                  <Mail className="w-4 h-4" />
                  <span>
                    Questions?{" "}
                    <a
                      href="/contact"
                      className="text-[#DA4C2F] hover:underline"
                    >
                      Contact us
                    </a>
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
