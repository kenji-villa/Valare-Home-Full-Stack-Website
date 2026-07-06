import { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import Header from "../components/layout/Header";
import Footer from "../components/layout/Footer";
import ProductCard from "../components/common/ProductCard";
import {
  Star,
  Heart,
  CheckCircle,
  ShoppingCart,
  Minus,
  Plus,
  Share2,
  Check,
  Truck,
  Shield,
  RefreshCw,
  User,
  Calendar,
  ThumbsUp,
  MessageCircle,
} from "lucide-react";
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";

export default function ProductDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart, toggleFavorite, favorites } = useCart();
  const { user } = useAuth();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [selectedColor, setSelectedColor] = useState("");
  const [activeTab, setActiveTab] = useState("description");
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [isWishlist, setIsWishlist] = useState(false);
  const [isAddedToCart, setIsAddedToCart] = useState(false);
  const [mainImage, setMainImage] = useState("");
  const [thumbnails, setThumbnails] = useState([]);

  // Review states
  const [reviews, setReviews] = useState([]);
  const [reviewRating, setReviewRating] = useState(0);
  const [reviewComment, setReviewComment] = useState("");
  const [reviewName, setReviewName] = useState("");
  const [reviewEmail, setReviewEmail] = useState("");
  const [hoverRating, setHoverRating] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [reviewSubmitted, setReviewSubmitted] = useState(false);

  // Mock product data - In production, fetch from API
  useEffect(() => {
    const mockProducts = {
      1: {
        id: 1,
        name: "Modern Sectional Sofa",
        price: 639.2,
        originalPrice: 799.0,
        discount: 20,
        image: "/assets/images/p1.jpg",
        additionalImages: [
          "/assets/images/p2.jpg",
          "/assets/images/p3.jpg",
          "/assets/images/p4.jpg",
        ],
        rating: 4.5,
        reviews: 128,
        category: "Living Room",
        color: "Brown",
        material: "Fabric",
        sku: "VLR-SF-2025",
        inStock: true,
        description:
          "Elevate your living space with our modern sectional sofa. Designed for both comfort and style, this piece features premium upholstery, sturdy construction, and a sleek design that complements any contemporary home decor.",
        features: [
          "Premium quality fabric upholstery that is both durable and soft to the touch",
          "High-density foam cushions for optimal comfort and support",
          "Solid wood frame construction for long-lasting durability",
          "Modular design allows for flexible configuration to suit your space",
          "Easy to clean and maintain with removable cushion covers",
          "Available in multiple colors to match your decor",
        ],
        specifications: {
          material: "Premium fabric, solid wood frame",
          color: "Brown, Gray, Black",
          style: "Modern, Contemporary",
          assembly: "Required (tools included)",
          weightCapacity: "600 lbs",
          warranty: "2 years limited",
        },
        colors: ["Brown", "Gray", "Black"],
      },
      2: {
        id: 2,
        name: "Ergonomic Office Chair",
        price: 450.0,
        originalPrice: 550.0,
        discount: 10,
        image: "/assets/images/Chair.jpg",
        additionalImages: [
          "/assets/images/Office1.jpg",
          "/assets/images/Office2.jpg",
        ],
        rating: 4.8,
        reviews: 89,
        category: "Chairs",
        color: "Black",
        material: "Leather",
        sku: "VLR-CH-2025",
        inStock: true,
        description:
          "Experience ultimate comfort with our ergonomic office chair. Designed to support your posture during long work hours, this chair features adjustable height, lumbar support, and premium leather upholstery.",
        features: [
          "Adjustable height and armrests for personalized comfort",
          "Built-in lumbar support for proper posture",
          "Premium leather upholstery for durability and style",
          "360-degree swivel and smooth-rolling casters",
          "Weight capacity of 300 lbs",
        ],
        specifications: {
          material: "Leather, Aluminum",
          color: "Black, Gray",
          style: "Modern, Ergonomic",
          assembly: "Minimal assembly required",
          weightCapacity: "300 lbs",
          warranty: "3 years limited",
        },
        colors: ["Black", "Gray"],
      },
      3: {
        id: 3,
        name: "Solid Wood Dining Table",
        price: 850.0,
        originalPrice: 1050.0,
        discount: 15,
        image: "/assets/images/p6.jpg",
        additionalImages: ["/assets/images/p5.jpg", "/assets/images/p4.jpg"],
        rating: 4.6,
        reviews: 56,
        category: "Dining",
        color: "Wood",
        material: "Wood",
        sku: "VLR-DT-2025",
        inStock: true,
        description:
          "Crafted from premium solid wood, this dining table brings warmth and elegance to your dining space. The natural wood grain adds character while the sturdy construction ensures years of use.",
        features: [
          "Solid wood construction for durability",
          "Natural wood grain finish",
          "Seats up to 6 people comfortably",
          "Easy to clean and maintain",
          "Timeless design that complements any decor",
        ],
        specifications: {
          material: "Solid Oak Wood",
          color: "Natural Wood, Walnut",
          style: "Rustic, Modern",
          assembly: "Required (tools included)",
          weightCapacity: "400 lbs",
          warranty: "2 years limited",
        },
        colors: ["Natural Wood", "Walnut"],
      },
    };

    const productId = parseInt(id);
    const foundProduct = mockProducts[productId];

    if (foundProduct) {
      setProduct(foundProduct);
      setSelectedColor(foundProduct.colors?.[0] || "");
      setMainImage(foundProduct.image);
      setThumbnails([
        foundProduct.image,
        ...(foundProduct.additionalImages || []),
      ]);

      // Check if product is in wishlist
      const isFav = favorites.includes(productId);
      setIsWishlist(isFav);
    }

    setRelatedProducts([
      {
        id: 4,
        name: "Leather Sofa",
        price: "ETB 60,000",
        originalPrice: "ETB 80,000",
        image: "/assets/images/p4.jpg",
        rating: 4.2,
        reviews: 1852,
        discount: "-20%",
        category: "Living Room",
      },
      {
        id: 5,
        name: "Modern Sofa",
        price: "ETB 85,000",
        originalPrice: "ETB 95,000",
        image: "/assets/images/p5.jpg",
        rating: 4.3,
        reviews: 2333,
        discount: "-10%",
        category: "Living Room",
      },
      {
        id: 6,
        name: "Dining Table",
        price: "ETB 25,000",
        originalPrice: "ETB 35,000",
        image: "/assets/images/p6.jpg",
        rating: 4.0,
        reviews: 1660,
        category: "Dining",
      },
    ]);

    // Mock reviews
    setReviews([
      {
        id: 1,
        name: "Sarah Johnson",
        rating: 5,
        date: "2025-06-15",
        comment:
          "Absolutely love this sofa! It's incredibly comfortable and looks stunning in my living room. The quality is top-notch and the delivery was fast.",
        helpful: 24,
        avatar: "SJ",
      },
      {
        id: 2,
        name: "Michael Chen",
        rating: 4,
        date: "2025-06-10",
        comment:
          "Great product overall. The design is modern and the fabric feels premium. Only reason I didn't give 5 stars is because assembly took a bit longer than expected.",
        helpful: 12,
        avatar: "MC",
      },
      {
        id: 3,
        name: "Emily Davis",
        rating: 5,
        date: "2025-06-05",
        comment:
          "Best investment for my home! The sofa is perfect for movie nights and the kids love it too. Highly recommend to anyone looking for quality furniture.",
        helpful: 18,
        avatar: "ED",
      },
    ]);

    setLoading(false);
  }, [id]);

  const handleQuantityChange = (delta) => {
    setQuantity((prev) => Math.max(1, prev + delta));
  };

  const handleAddToCart = () => {
    if (product) {
      addToCart({
        id: product.id,
        name: product.name,
        price: `ETB ${product.price.toFixed(2)}`,
        image: product.image,
        quantity: quantity,
      });
      setIsAddedToCart(true);
      setTimeout(() => setIsAddedToCart(false), 2000);
    }
  };

  const handleWishlistToggle = () => {
    if (product) {
      toggleFavorite(product.id);
      setIsWishlist(!isWishlist);
    }
  };

  const handleThumbnailClick = (imageUrl) => {
    setMainImage(imageUrl);
  };

  const handleSubmitReview = (e) => {
    e.preventDefault();

    // Validation
    if (reviewRating === 0) {
      alert("Please select a rating");
      return;
    }
    if (!reviewComment.trim()) {
      alert("Please write a comment");
      return;
    }
    if (!reviewName.trim()) {
      alert("Please enter your name");
      return;
    }

    setIsSubmitting(true);

    // Simulate API call
    setTimeout(() => {
      const newReview = {
        id: reviews.length + 1,
        name: reviewName,
        rating: reviewRating,
        date: new Date().toISOString().split("T")[0],
        comment: reviewComment,
        helpful: 0,
        avatar: reviewName
          .split(" ")
          .map((n) => n[0])
          .join("")
          .toUpperCase()
          .slice(0, 2),
      };

      setReviews([newReview, ...reviews]);
      setReviewSubmitted(true);
      setIsSubmitting(false);

      // Reset form
      setReviewRating(0);
      setReviewComment("");
      setReviewName("");
      setReviewEmail("");

      // Reset success message after 5 seconds
      setTimeout(() => {
        setReviewSubmitted(false);
      }, 5000);
    }, 1000);
  };

  const renderStars = (
    rating,
    size = "w-4 h-4",
    interactive = false,
    onHover = null,
  ) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0 && rating % 1 >= 0.3;

    for (let i = 0; i < fullStars; i++) {
      stars.push(
        <Star
          key={`full-${i}`}
          className={`${size} fill-yellow-400 text-yellow-400 ${interactive ? "cursor-pointer hover:scale-110 transition-transform" : ""}`}
          onMouseEnter={() => interactive && onHover && onHover(i + 1)}
          onClick={() => interactive && setReviewRating(i + 1)}
        />,
      );
    }
    if (hasHalfStar) {
      stars.push(
        <Star
          key="half"
          className={`${size} fill-yellow-400 text-yellow-400`}
          style={{ clipPath: "inset(0 50% 0 0)" }}
        />,
      );
    }
    const remainingStars = 5 - stars.length;
    for (let i = 0; i < remainingStars; i++) {
      stars.push(
        <Star
          key={`empty-${i}`}
          className={`${size} text-gray-300 ${interactive ? "cursor-pointer hover:scale-110 transition-transform" : ""}`}
          onMouseEnter={() =>
            interactive &&
            onHover &&
            onHover(fullStars + (hasHalfStar ? 1 : 0) + i + 1)
          }
          onClick={() =>
            interactive &&
            setReviewRating(fullStars + (hasHalfStar ? 1 : 0) + i + 1)
          }
        />,
      );
    }
    return stars;
  };

  const calculateAverageRating = () => {
    if (reviews.length === 0) return 0;
    const total = reviews.reduce((sum, r) => sum + r.rating, 0);
    return (total / reviews.length).toFixed(1);
  };

  const getRatingDistribution = () => {
    const distribution = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };
    reviews.forEach((r) => {
      if (distribution[r.rating] !== undefined) {
        distribution[r.rating]++;
      }
    });
    return distribution;
  };

  if (loading) {
    return (
      <>
        <Header />
        <div className="flex flex-col items-center justify-center min-h-[400px]">
          <div className="w-12 h-12 border-4 border-[#DA4C2F] border-t-transparent rounded-full animate-spin"></div>
          <p className="mt-4 text-gray-600">Loading product details...</p>
        </div>
        <Footer />
      </>
    );
  }

  if (!product) {
    return (
      <>
        <Header />
        <div className="container py-20 text-center">
          <div className="text-6xl mb-4">🔍</div>
          <h2 className="text-2xl font-bold mb-2">Product Not Found</h2>
          <p className="text-gray-600 mb-6">
            The product you're looking for doesn't exist or has been removed.
          </p>
          <Link
            to="/home-furniture"
            className="btn-primary inline-flex items-center gap-2"
          >
            Back to Products
          </Link>
        </div>
        <Footer />
      </>
    );
  }

  const ratingDistribution = getRatingDistribution();
  const averageRating = calculateAverageRating();

  return (
    <>
      <Header />
      <main>
        {/* Breadcrumb */}
        <div className="bg-gray-50 py-4 border-b border-gray-200">
          <div className="container">
            <nav className="flex items-center gap-2 text-sm">
              <Link
                to="/"
                className="text-gray-600 hover:text-[#DA4C2F] transition-colors"
              >
                Home
              </Link>
              <span className="text-gray-400">/</span>
              <Link
                to="/home-furniture"
                className="text-gray-600 hover:text-[#DA4C2F] transition-colors"
              >
                Home Furniture
              </Link>
              <span className="text-gray-400">/</span>
              <span className="text-gray-800 font-medium">{product.name}</span>
            </nav>
          </div>
        </div>

        {/* Product Details */}
        <section className="py-8 md:py-12">
          <div className="container">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
              {/* Product Gallery */}
              {/* Product Gallery */}
              <div>
                <div className="bg-gray-100 rounded-lg overflow-hidden mb-4">
                  <img
                    src={mainImage || product.image}
                    alt={product.name}
                    className="w-full h-[400px] md:h-[500px] object-cover transition-all duration-300"
                  />
                </div>
                <div className="flex gap-3 overflow-x-auto pb-2">
                  {thumbnails.map((img, index) => (
                    <img
                      key={index}
                      src={img}
                      alt={`Thumbnail ${index + 1}`}
                      className={`w-20 h-20 object-cover rounded-lg border-2 cursor-pointer flex-shrink-0 transition-all duration-200 hover:scale-105 ${
                        mainImage === img
                          ? "border-[#DA4C2F] shadow-md"
                          : "border-transparent hover:border-gray-300"
                      }`}
                      onClick={() => handleThumbnailClick(img)}
                    />
                  ))}
                </div>
              </div>

              {/* Product Info */}
              <div>
                {product.discount > 0 && (
                  <span className="inline-block bg-[#DA4C2F] text-white text-sm font-bold px-3 py-1 rounded mb-3">
                    -{product.discount}%
                  </span>
                )}
                <h1 className="text-3xl md:text-4xl font-bold text-gray-800 mb-3">
                  {product.name}
                </h1>

                {/* Rating */}
                <div className="flex items-center gap-3 mb-4">
                  <div className="flex items-center gap-1">
                    {renderStars(product.rating)}
                  </div>
                  <span className="text-sm text-gray-600">
                    ({product.reviews} reviews)
                  </span>
                </div>

                {/* Price */}
                <div className="flex items-center gap-3 mb-4">
                  <span className="text-3xl font-bold text-[#DA4C2F]">
                    ETB {product.price.toFixed(2)}
                  </span>
                  {product.originalPrice && (
                    <span className="text-lg text-gray-400 line-through">
                      ETB {product.originalPrice.toFixed(2)}
                    </span>
                  )}
                </div>

                {/* Description */}
                <p className="text-gray-600 mb-6 leading-relaxed">
                  {product.description}
                </p>

                {/* Product Details */}
                <div className="border-y border-gray-200 py-4 mb-6 space-y-2">
                  <div className="flex items-center gap-2 text-sm">
                    <Check className="w-4 h-4 text-green-500" />
                    <span className="font-medium">Availability:</span>
                    <span className="text-green-600">In Stock</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <span className="font-medium">SKU:</span>
                    <span className="text-gray-600">{product.sku}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <span className="font-medium">Category:</span>
                    <span className="text-gray-600">{product.category}</span>
                  </div>
                </div>

                {/* Color Selection */}
                {product.colors && product.colors.length > 0 && (
                  <div className="mb-6">
                    <span className="font-medium block mb-2">Color:</span>
                    <div className="flex gap-3">
                      {product.colors.map((color) => (
                        <button
                          key={color}
                          onClick={() => setSelectedColor(color)}
                          className={`w-10 h-10 rounded-full border-2 transition-all ${
                            selectedColor === color
                              ? "border-[#DA4C2F] ring-2 ring-[#DA4C2F]/30"
                              : "border-gray-300 hover:border-gray-400"
                          }`}
                          style={{
                            backgroundColor: color.toLowerCase(),
                            borderColor:
                              color === "White" ? "#d1d5db" : undefined,
                          }}
                          title={color}
                        />
                      ))}
                    </div>
                  </div>
                )}

                {/* Quantity */}
                <div className="flex items-center gap-4 mb-6">
                  <span className="font-medium">Quantity:</span>
                  <div className="flex items-center border border-gray-300 rounded-lg overflow-hidden">
                    <button
                      onClick={() => handleQuantityChange(-1)}
                      className="px-3 py-2 hover:bg-gray-100 transition-colors"
                    >
                      <Minus className="w-4 h-4" />
                    </button>
                    <span className="w-12 text-center py-2 text-sm font-medium">
                      {quantity}
                    </span>
                    <button
                      onClick={() => handleQuantityChange(1)}
                      className="px-3 py-2 hover:bg-gray-100 transition-colors"
                    >
                      <Plus className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* Action Buttons */}
                {/* Action Buttons */}
                <div className="flex flex-col sm:flex-row gap-3 mb-6">
                  <button
                    onClick={handleAddToCart}
                    className={`flex-1 py-3 rounded-lg font-medium transition-all duration-300 flex items-center justify-center gap-2 ${
                      isAddedToCart
                        ? "bg-green-500 hover:bg-green-600 text-white"
                        : "bg-[#DA4C2F] hover:bg-[#c43d22] text-white"
                    }`}
                  >
                    {isAddedToCart ? (
                      <>
                        <CheckCircle className="w-5 h-5" />
                        Added to Cart ✓
                      </>
                    ) : (
                      <>
                        <ShoppingCart className="w-5 h-5" />
                        Add to Cart
                      </>
                    )}
                  </button>
                  <button
                    onClick={handleWishlistToggle}
                    className={`px-6 py-3 rounded-lg border-2 transition-all duration-300 flex items-center justify-center gap-2 ${
                      isWishlist
                        ? "border-[#DA4C2F] bg-[#DA4C2F]/10 text-[#DA4C2F] hover:bg-[#DA4C2F]/20"
                        : "border-gray-300 hover:border-[#DA4C2F] hover:bg-gray-50"
                    }`}
                  >
                    <Heart
                      className="w-5 h-5"
                      fill={isWishlist ? "#DA4C2F" : "none"}
                    />
                    {isWishlist ? "Liked" : "Like"}
                  </button>
                </div>
              </div>
            </div>

            {/* Product Tabs */}
            <div className="mt-12 border-t border-gray-200 pt-8">
              <div className="flex gap-6 border-b border-gray-200 overflow-x-auto">
                <button
                  onClick={() => setActiveTab("description")}
                  className={`pb-3 font-medium transition-colors whitespace-nowrap ${
                    activeTab === "description"
                      ? "text-[#DA4C2F] border-b-2 border-[#DA4C2F]"
                      : "text-gray-600 hover:text-gray-800"
                  }`}
                >
                  Description
                </button>
                <button
                  onClick={() => setActiveTab("specifications")}
                  className={`pb-3 font-medium transition-colors whitespace-nowrap ${
                    activeTab === "specifications"
                      ? "text-[#DA4C2F] border-b-2 border-[#DA4C2F]"
                      : "text-gray-600 hover:text-gray-800"
                  }`}
                >
                  Specifications
                </button>
                <button
                  onClick={() => setActiveTab("reviews")}
                  className={`pb-3 font-medium transition-colors whitespace-nowrap ${
                    activeTab === "reviews"
                      ? "text-[#DA4C2F] border-b-2 border-[#DA4C2F]"
                      : "text-gray-600 hover:text-gray-800"
                  }`}
                >
                  Reviews ({reviews.length})
                </button>
              </div>

              <div className="py-6">
                {activeTab === "description" && (
                  <div>
                    <h3 className="text-xl font-bold mb-3">
                      Product Description
                    </h3>
                    <p className="text-gray-600 leading-relaxed mb-4">
                      {product.description}
                    </p>
                    <h4 className="font-semibold mb-2">Features:</h4>
                    <ul className="list-disc list-inside space-y-1 text-gray-600">
                      {product.features?.map((feature, index) => (
                        <li key={index}>{feature}</li>
                      ))}
                    </ul>
                  </div>
                )}

                {activeTab === "specifications" && (
                  <div>
                    <h3 className="text-xl font-bold mb-4">
                      Technical Specifications
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-3">
                        <div className="flex border-b border-gray-100 pb-2">
                          <span className="font-medium w-1/2">Material</span>
                          <span className="text-gray-600 w-1/2">
                            {product.specifications?.material}
                          </span>
                        </div>
                        <div className="flex border-b border-gray-100 pb-2">
                          <span className="font-medium w-1/2">Color</span>
                          <span className="text-gray-600 w-1/2">
                            {product.specifications?.color}
                          </span>
                        </div>
                        <div className="flex border-b border-gray-100 pb-2">
                          <span className="font-medium w-1/2">Style</span>
                          <span className="text-gray-600 w-1/2">
                            {product.specifications?.style}
                          </span>
                        </div>
                      </div>
                      <div className="space-y-3">
                        <div className="flex border-b border-gray-100 pb-2">
                          <span className="font-medium w-1/2">Assembly</span>
                          <span className="text-gray-600 w-1/2">
                            {product.specifications?.assembly}
                          </span>
                        </div>
                        <div className="flex border-b border-gray-100 pb-2">
                          <span className="font-medium w-1/2">
                            Weight Capacity
                          </span>
                          <span className="text-gray-600 w-1/2">
                            {product.specifications?.weightCapacity}
                          </span>
                        </div>
                        <div className="flex border-b border-gray-100 pb-2">
                          <span className="font-medium w-1/2">Warranty</span>
                          <span className="text-gray-600 w-1/2">
                            {product.specifications?.warranty}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {activeTab === "reviews" && (
                  <div>
                    {/* Review Summary */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                      <div className="bg-gray-50 rounded-lg p-6 text-center">
                        <div className="text-4xl font-bold text-[#DA4C2F]">
                          {averageRating}
                        </div>
                        <div className="flex justify-center gap-1 my-2">
                          {renderStars(parseFloat(averageRating))}
                        </div>
                        <div className="text-sm text-gray-600">
                          Based on {reviews.length} reviews
                        </div>
                      </div>
                      <div className="md:col-span-2">
                        <div className="space-y-2">
                          {[5, 4, 3, 2, 1].map((star) => (
                            <div key={star} className="flex items-center gap-3">
                              <span className="text-sm w-8">{star}★</span>
                              <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
                                <div
                                  className="h-full bg-[#DA4C2F] rounded-full transition-all"
                                  style={{
                                    width: `${reviews.length > 0 ? (ratingDistribution[star] / reviews.length) * 100 : 0}%`,
                                  }}
                                />
                              </div>
                              <span className="text-sm text-gray-600 w-10">
                                {ratingDistribution[star] || 0}
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>

                    {/* Write Review Form */}
                    <div className="bg-gray-50 rounded-lg p-6 mb-8">
                      <h4 className="text-lg font-bold mb-4">Write a Review</h4>
                      {reviewSubmitted ? (
                        <div className="bg-green-50 border border-green-200 rounded-lg p-4 text-green-700">
                          <Check className="w-5 h-5 inline mr-2" />
                          Thank you for your review! It has been submitted
                          successfully.
                        </div>
                      ) : (
                        <form onSubmit={handleSubmitReview}>
                          <div className="mb-4">
                            <label className="block text-sm font-medium mb-2">
                              Your Rating
                            </label>
                            <div className="flex gap-1 text-2xl">
                              {[1, 2, 3, 4, 5].map((star) => (
                                <button
                                  key={star}
                                  type="button"
                                  onMouseEnter={() => setHoverRating(star)}
                                  onMouseLeave={() => setHoverRating(0)}
                                  onClick={() => setReviewRating(star)}
                                  className="focus:outline-none transition-transform hover:scale-110"
                                >
                                  <Star
                                    className={`w-8 h-8 ${
                                      star <= (hoverRating || reviewRating)
                                        ? "fill-yellow-400 text-yellow-400"
                                        : "text-gray-300"
                                    }`}
                                  />
                                </button>
                              ))}
                              <span className="text-sm text-gray-500 ml-2 self-center">
                                {reviewRating > 0
                                  ? `${reviewRating} ★`
                                  : "Select rating"}
                              </span>
                            </div>
                          </div>

                          <div className="mb-4">
                            <label
                              htmlFor="reviewName"
                              className="block text-sm font-medium mb-2"
                            >
                              Your Name
                            </label>
                            <input
                              type="text"
                              id="reviewName"
                              value={reviewName}
                              onChange={(e) => setReviewName(e.target.value)}
                              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#DA4C2F] focus:border-transparent"
                              placeholder="Enter your name"
                              required
                            />
                          </div>

                          <div className="mb-4">
                            <label
                              htmlFor="reviewEmail"
                              className="block text-sm font-medium mb-2"
                            >
                              Email (optional)
                            </label>
                            <input
                              type="email"
                              id="reviewEmail"
                              value={reviewEmail}
                              onChange={(e) => setReviewEmail(e.target.value)}
                              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#DA4C2F] focus:border-transparent"
                              placeholder="Enter your email"
                            />
                          </div>

                          <div className="mb-4">
                            <label
                              htmlFor="reviewComment"
                              className="block text-sm font-medium mb-2"
                            >
                              Your Review
                            </label>
                            <textarea
                              id="reviewComment"
                              value={reviewComment}
                              onChange={(e) => setReviewComment(e.target.value)}
                              rows={4}
                              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#DA4C2F] focus:border-transparent resize-none"
                              placeholder="Share your experience with this product..."
                              required
                            />
                          </div>

                          <button
                            type="submit"
                            disabled={isSubmitting}
                            className="bg-[#DA4C2F] text-white px-6 py-2 rounded-lg font-medium hover:bg-[#c43d22] transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                          >
                            {isSubmitting ? "Submitting..." : "Submit Review"}
                          </button>
                        </form>
                      )}
                    </div>

                    {/* Reviews List */}
                    <div className="space-y-6">
                      {reviews.length === 0 ? (
                        <p className="text-gray-500 text-center py-8">
                          No reviews yet. Be the first to review!
                        </p>
                      ) : (
                        reviews.map((review) => (
                          <div
                            key={review.id}
                            className="border-b border-gray-200 pb-6"
                          >
                            <div className="flex items-start gap-4">
                              <div className="w-10 h-10 rounded-full bg-[#DA4C2F]/10 text-[#DA4C2F] flex items-center justify-center font-bold text-sm flex-shrink-0">
                                {review.avatar || review.name.charAt(0)}
                              </div>
                              <div className="flex-1">
                                <div className="flex flex-wrap items-center justify-between gap-2 mb-1">
                                  <div>
                                    <span className="font-medium">
                                      {review.name}
                                    </span>
                                    <div className="flex items-center gap-1">
                                      {renderStars(review.rating, "w-3 h-3")}
                                    </div>
                                  </div>
                                  <div className="flex items-center gap-3 text-sm text-gray-500">
                                    <span className="flex items-center gap-1">
                                      <Calendar className="w-3 h-3" />
                                      {new Date(
                                        review.date,
                                      ).toLocaleDateString()}
                                    </span>
                                  </div>
                                </div>
                                <p className="text-gray-600 mt-2">
                                  {review.comment}
                                </p>
                                <button className="mt-2 text-sm text-gray-500 hover:text-[#DA4C2F] transition-colors flex items-center gap-1">
                                  <ThumbsUp className="w-3 h-3" />
                                  Helpful ({review.helpful || 0})
                                </button>
                              </div>
                            </div>
                          </div>
                        ))
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Related Products */}
            <div className="mt-12">
              <h3 className="text-2xl font-bold mb-6">You May Also Like</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {relatedProducts.map((related) => (
                  <ProductCard key={related.id} {...related} />
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Trust Badges */}
        <section className="bg-gray-50 py-12 border-t border-gray-200">
          <div className="container">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-8">
              <div className="flex items-center gap-4 justify-center">
                <Truck className="w-10 h-10 text-[#DA4C2F]" />
                <div>
                  <h4 className="font-semibold">Free Shipping</h4>
                  <p className="text-sm text-gray-600">
                    On orders over ETB 1000
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-4 justify-center">
                <Shield className="w-10 h-10 text-[#DA4C2F]" />
                <div>
                  <h4 className="font-semibold">Secure Payment</h4>
                  <p className="text-sm text-gray-600">100% secure checkout</p>
                </div>
              </div>
              <div className="flex items-center gap-4 justify-center">
                <RefreshCw className="w-10 h-10 text-[#DA4C2F]" />
                <div>
                  <h4 className="font-semibold">Easy Returns</h4>
                  <p className="text-sm text-gray-600">30-day return policy</p>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
