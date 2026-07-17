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
import { getProductById, getRelatedProducts } from "../services/productService";

export default function ProductDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart, toggleFavorite, favorites } = useCart();
  const { user } = useAuth();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
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

  // Fetch product from API
  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true);
        setError(null);

        // Log the ID to debug
        console.log("Fetching product with ID:", id);

        // Check if ID is valid
        if (!id) {
          setError("No product ID provided");
          setLoading(false);
          return;
        }

        const response = await getProductById(id);
        console.log("API Response:", response);

        if (response.success && response.product) {
          const productData = response.product;
          setProduct(productData);

          // Set main image and thumbnails
          const mainImg =
            productData.coverImage ||
            productData.images?.[0] ||
            "/assets/images/placeholder.jpg";
          setMainImage(mainImg);

          const thumbs =
            productData.images && productData.images.length > 0
              ? productData.images
              : [mainImg];
          setThumbnails(thumbs);

          // Set selected color
          if (productData.color) {
            setSelectedColor(productData.color);
          }

          // Check if product is in wishlist
          const isFav = favorites.includes(productData._id);
          setIsWishlist(isFav);

          // Fetch related products
          try {
            const relatedResponse = await getRelatedProducts(id);
            if (relatedResponse.success) {
              setRelatedProducts(relatedResponse.products || []);
            }
          } catch (relatedError) {
            console.error("Error fetching related products:", relatedError);
          }
        } else {
          setError(response.message || "Product not found");
        }
      } catch (err) {
        console.error("Error fetching product:", err);
        setError(err.message || "Failed to load product. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchProduct();
    }
  }, [id, favorites]);

  const handleQuantityChange = (delta) => {
    setQuantity((prev) => Math.max(1, prev + delta));
  };

  const handleAddToCart = () => {
    if (product) {
      const price =
        typeof product.price === "number"
          ? `ETB ${product.price.toFixed(2)}`
          : product.price;
      addToCart({
        id: product._id,
        name: product.name,
        price: price,
        image: mainImage,
        quantity: quantity,
      });
      setIsAddedToCart(true);
      setTimeout(() => setIsAddedToCart(false), 2000);
    }
  };

  const handleWishlistToggle = () => {
    if (product) {
      toggleFavorite(product._id);
      setIsWishlist(!isWishlist);
    }
  };

  const handleThumbnailClick = (imageUrl) => {
    setMainImage(imageUrl);
  };

  const renderStars = (rating) => {
    const stars = [];
    const fullStars = Math.floor(rating || 0);
    const hasHalfStar = (rating || 0) % 1 !== 0 && (rating || 0) % 1 >= 0.3;

    for (let i = 0; i < fullStars; i++) {
      stars.push(
        <Star
          key={`full-${i}`}
          className="w-4 h-4 fill-yellow-400 text-yellow-400"
        />,
      );
    }
    if (hasHalfStar) {
      stars.push(
        <Star
          key="half"
          className="w-4 h-4 fill-yellow-400 text-yellow-400"
          style={{ clipPath: "inset(0 50% 0 0)" }}
        />,
      );
    }
    const remainingStars = 5 - stars.length;
    for (let i = 0; i < remainingStars; i++) {
      stars.push(<Star key={`empty-${i}`} className="w-4 h-4 text-gray-300" />);
    }
    return stars;
  };

  // Helper to get image URL
  const getImageUrl = (imagePath) => {
    if (!imagePath) return "/assets/images/placeholder.jpg";
    if (imagePath.startsWith("http")) return imagePath;
    if (imagePath.startsWith("/uploads")) {
      return `http://localhost:3001${imagePath}`;
    }
    return imagePath;
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

  if (error || !product) {
    return (
      <>
        <Header />
        <div className="container py-20 text-center">
          <div className="text-6xl mb-4">🔍</div>
          <h2 className="text-2xl font-bold mb-2">Product Not Found</h2>
          <p className="text-gray-600 mb-6">
            {error ||
              "The product you're looking for doesn't exist or has been removed."}
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

  // Format price display
  const displayPrice =
    typeof product.price === "number"
      ? product.price.toFixed(2)
      : product.price;
  const displayOriginalPrice = product.originalPrice
    ? typeof product.originalPrice === "number"
      ? product.originalPrice.toFixed(2)
      : product.originalPrice
    : null;
  const discount = product.discount || 0;

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
                {product.category === "Office"
                  ? "Office Furniture"
                  : "Home Furniture"}
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
              <div>
                <div className="bg-gray-100 rounded-lg overflow-hidden mb-4">
                  <img
                    src={getImageUrl(mainImage)}
                    alt={product.name}
                    className="w-full h-[400px] md:h-[500px] object-cover transition-all duration-300"
                    onError={(e) => {
                      e.target.src = "/assets/images/placeholder.jpg";
                    }}
                  />
                </div>
                <div className="flex gap-3 overflow-x-auto pb-2">
                  {thumbnails.map((img, index) => (
                    <img
                      key={index}
                      src={getImageUrl(img)}
                      alt={`Thumbnail ${index + 1}`}
                      className={`w-20 h-20 object-cover rounded-lg border-2 cursor-pointer flex-shrink-0 transition-all duration-200 hover:scale-105 ${
                        mainImage === img
                          ? "border-[#DA4C2F] shadow-md"
                          : "border-transparent hover:border-gray-300"
                      }`}
                      onClick={() => handleThumbnailClick(img)}
                      onError={(e) => {
                        e.target.src = "/assets/images/placeholder.jpg";
                      }}
                    />
                  ))}
                </div>
              </div>

              {/* Product Info */}
              <div>
                {discount > 0 && (
                  <span className="inline-block bg-[#DA4C2F] text-white text-sm font-bold px-3 py-1 rounded mb-3">
                    -{discount}%
                  </span>
                )}
                <h1 className="text-3xl md:text-4xl font-bold text-gray-800 mb-3">
                  {product.name}
                </h1>

                {/* Rating */}
                <div className="flex items-center gap-3 mb-4">
                  <div className="flex items-center gap-1">
                    {renderStars(product.averageRating)}
                  </div>
                  <span className="text-sm text-gray-600">
                    ({product.reviewCount || 0} reviews)
                  </span>
                </div>

                {/* Price */}
                <div className="flex items-center gap-3 mb-4">
                  <span className="text-3xl font-bold text-[#DA4C2F]">
                    ETB {displayPrice}
                  </span>
                  {displayOriginalPrice && (
                    <span className="text-lg text-gray-400 line-through">
                      ETB {displayOriginalPrice}
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
                    <span
                      className={
                        product.stock > 0 ? "text-green-600" : "text-red-600"
                      }
                    >
                      {product.stock > 0 ? "In Stock" : "Out of Stock"}
                    </span>
                  </div>
                  {product.sku && (
                    <div className="flex items-center gap-2 text-sm">
                      <span className="font-medium">SKU:</span>
                      <span className="text-gray-600">{product.sku}</span>
                    </div>
                  )}
                  <div className="flex items-center gap-2 text-sm">
                    <span className="font-medium">Category:</span>
                    <span className="text-gray-600">{product.category}</span>
                  </div>
                  {product.subcategory && (
                    <div className="flex items-center gap-2 text-sm">
                      <span className="font-medium">Subcategory:</span>
                      <span className="text-gray-600">
                        {product.subcategory}
                      </span>
                    </div>
                  )}
                </div>

                {/* Color Selection */}
                {product.color && (
                  <div className="mb-6">
                    <span className="font-medium block mb-2">Color:</span>
                    <div className="flex gap-3">
                      {product.color.split(",").map((color) => (
                        <button
                          key={color}
                          onClick={() => setSelectedColor(color.trim())}
                          className={`w-10 h-10 rounded-full border-2 transition-all ${
                            selectedColor === color.trim()
                              ? "border-[#DA4C2F] ring-2 ring-[#DA4C2F]/30"
                              : "border-gray-300 hover:border-gray-400"
                          }`}
                          style={{
                            backgroundColor: color.trim().toLowerCase(),
                            borderColor:
                              color.trim().toLowerCase() === "white"
                                ? "#d1d5db"
                                : undefined,
                          }}
                          title={color.trim()}
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
                <div className="flex flex-col sm:flex-row gap-3 mb-6">
                  <button
                    onClick={handleAddToCart}
                    disabled={product.stock === 0}
                    className={`flex-1 py-3 rounded-lg font-medium transition-all duration-300 flex items-center justify-center gap-2 ${
                      isAddedToCart
                        ? "bg-green-500 hover:bg-green-600 text-white"
                        : product.stock === 0
                          ? "bg-gray-400 cursor-not-allowed text-white"
                          : "bg-[#DA4C2F] hover:bg-[#c43d22] text-white"
                    }`}
                  >
                    {isAddedToCart ? (
                      <>
                        <CheckCircle className="w-5 h-5" />
                        Added to Cart ✓
                      </>
                    ) : product.stock === 0 ? (
                      "Out of Stock"
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

                {/* Share */}
                <div>
                  <span className="font-medium block mb-2">Share:</span>
                  <div className="flex gap-2">
                    <button className="w-10 h-10 rounded-full bg-gray-100 hover:bg-[#1877f2] hover:text-white transition-colors flex items-center justify-center">
                      <Facebook className="w-5 h-5" />
                    </button>
                    <button className="w-10 h-10 rounded-full bg-gray-100 hover:bg-[#1da1f2] hover:text-white transition-colors flex items-center justify-center">
                      <Twitter className="w-5 h-5" />
                    </button>
                    <button className="w-10 h-10 rounded-full bg-gray-100 hover:bg-[#e4405f] hover:text-white transition-colors flex items-center justify-center">
                      <Instagram className="w-5 h-5" />
                    </button>
                    <button className="w-10 h-10 rounded-full bg-gray-100 hover:bg-[#0a66c2] hover:text-white transition-colors flex items-center justify-center">
                      <Linkedin className="w-5 h-5" />
                    </button>
                    <button className="w-10 h-10 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors flex items-center justify-center">
                      <Share2 className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Product Tabs */}
            <div className="mt-12 border-t border-gray-200 pt-8">
              <div className="flex gap-6 border-b border-gray-200">
                <button
                  onClick={() => setActiveTab("description")}
                  className={`pb-3 font-medium transition-colors ${
                    activeTab === "description"
                      ? "text-[#DA4C2F] border-b-2 border-[#DA4C2F]"
                      : "text-gray-600 hover:text-gray-800"
                  }`}
                >
                  Description
                </button>
                <button
                  onClick={() => setActiveTab("specifications")}
                  className={`pb-3 font-medium transition-colors ${
                    activeTab === "specifications"
                      ? "text-[#DA4C2F] border-b-2 border-[#DA4C2F]"
                      : "text-gray-600 hover:text-gray-800"
                  }`}
                >
                  Specifications
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
                      <li>Premium quality {product.material || "materials"}</li>
                      {product.color && <li>Available in {product.color}</li>}
                      <li>Durable construction for long-lasting use</li>
                      <li>Perfect for {product.category} settings</li>
                      {product.averageRating > 0 && (
                        <li>
                          Rated {product.averageRating}/5 by{" "}
                          {product.reviewCount || 0} customers
                        </li>
                      )}
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
                            {product.specifications?.material ||
                              product.material ||
                              "Not specified"}
                          </span>
                        </div>
                        <div className="flex border-b border-gray-100 pb-2">
                          <span className="font-medium w-1/2">Color</span>
                          <span className="text-gray-600 w-1/2">
                            {product.specifications?.color ||
                              product.color ||
                              "Not specified"}
                          </span>
                        </div>
                        <div className="flex border-b border-gray-100 pb-2">
                          <span className="font-medium w-1/2">Category</span>
                          <span className="text-gray-600 w-1/2">
                            {product.category}
                          </span>
                        </div>
                        {product.subcategory && (
                          <div className="flex border-b border-gray-100 pb-2">
                            <span className="font-medium w-1/2">
                              Subcategory
                            </span>
                            <span className="text-gray-600 w-1/2">
                              {product.subcategory}
                            </span>
                          </div>
                        )}
                      </div>
                      <div className="space-y-3">
                        <div className="flex border-b border-gray-100 pb-2">
                          <span className="font-medium w-1/2">Style</span>
                          <span className="text-gray-600 w-1/2">
                            {product.specifications?.style || "Modern"}
                          </span>
                        </div>
                        <div className="flex border-b border-gray-100 pb-2">
                          <span className="font-medium w-1/2">Assembly</span>
                          <span className="text-gray-600 w-1/2">
                            {product.specifications?.assembly || "Required"}
                          </span>
                        </div>
                        <div className="flex border-b border-gray-100 pb-2">
                          <span className="font-medium w-1/2">
                            Weight Capacity
                          </span>
                          <span className="text-gray-600 w-1/2">
                            {product.specifications?.weightCapacity ||
                              "Not specified"}
                          </span>
                        </div>
                        <div className="flex border-b border-gray-100 pb-2">
                          <span className="font-medium w-1/2">Warranty</span>
                          <span className="text-gray-600 w-1/2">
                            {product.specifications?.warranty ||
                              "Standard warranty"}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Related Products */}
            {relatedProducts.length > 0 && (
              <div className="mt-12">
                <h3 className="text-2xl font-bold mb-6">You May Also Like</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {relatedProducts.slice(0, 3).map((related) => (
                    <ProductCard key={related._id || related.id} {...related} />
                  ))}
                </div>
              </div>
            )}
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
