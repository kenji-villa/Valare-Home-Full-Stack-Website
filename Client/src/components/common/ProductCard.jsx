import { useState } from "react";
import { useCart } from "../../context/CartContext";
import { ShoppingBag, Star, Repeat, Heart, Check } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";

export default function ProductCard({
  id,
  _id,
  name,
  price,
  originalPrice,
  image,
  coverImage,
  images,
  rating,
  averageRating,
  reviews,
  reviewCount,
  discount,
  category,
  subcategory,
  isSpecial,
}) {
  const { addToCart, toggleFavorite, favorites } = useCart();
  const navigate = useNavigate();
  const [isAdding, setIsAdding] = useState(false);

  // Use the correct ID
  const productId = _id || id;
  const productName = name || "Product";
  const isFavorite = favorites.includes(productId);

  // Handle price formatting - check if price is a number or string
  let productPrice = price;
  let productOriginalPrice = originalPrice;

  // If price is a number, format it with ETB
  if (typeof price === "number") {
    productPrice = `ETB ${price.toFixed(2)}`;
  } else if (typeof price === "string" && !price.startsWith("ETB")) {
    productPrice = `ETB ${price}`;
  }

  if (typeof originalPrice === "number") {
    productOriginalPrice = `ETB ${originalPrice.toFixed(2)}`;
  } else if (
    typeof originalPrice === "string" &&
    !originalPrice.startsWith("ETB")
  ) {
    productOriginalPrice = `ETB ${originalPrice}`;
  }

  let productImage = "/assets/images/placeholder.jpg";
  const baseUrl = import.meta.env.VITE_API_URL
    ? import.meta.env.VITE_API_URL.replace("/api", "")
    : "http://localhost:3001";

  if (coverImage) {
    productImage = coverImage.startsWith("/uploads")
      ? `${baseUrl}${coverImage}`
      : coverImage;
  } else if (image) {
    productImage = image.startsWith("/uploads") ? `${baseUrl}${image}` : image;
  } else if (images && images.length > 0) {
    const firstImage = images[0];
    productImage = firstImage.startsWith("/uploads")
      ? `${baseUrl}${firstImage}`
      : firstImage;
  }

  // Get rating and review count
  const productRating = rating || averageRating || 0;
  const productReviews = reviews || reviewCount || 0;

  const toNum = (v) => parseFloat(String(v ?? "").replace(/[^0-9.]/g, ""));
  let displayDiscount = null;
  const discountNumber = toNum(discount);
  if (discountNumber > 0) {
    displayDiscount = `-${discountNumber}%`;
  } else {
    const orig = toNum(originalPrice);
    const current = toNum(price);
    if (orig > current && current > 0) {
      displayDiscount = `-${Math.round(((orig - current) / orig) * 100)}%`;
    }
  }

  // Generate star rating
  const renderStars = () => {
    const stars = [];
    // Use productRating which is already set from the API data
    const fullStars = Math.floor(productRating);
    const hasHalfStar = productRating % 1 !== 0 && productRating % 1 >= 0.3;

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

  const handleAddToCart = (e) => {
    e.preventDefault();
    e.stopPropagation();
    addToCart({
      id: productId,
      name: productName,
      price: productPrice,
      image: productImage,
    });
    setIsAdding(true);
    setTimeout(() => setIsAdding(false), 1500);
  };

  const handleToggleFavorite = (e) => {
    e.preventDefault();
    e.stopPropagation();
    toggleFavorite(productId);
    console.log("ProductCard - Toggling favorite for:", productId);
    console.log("Current isFavorite:", isFavorite);
  };

  const handleCompare = (e) => {
    e.preventDefault();
    e.stopPropagation();
    // Handle compare functionality
    console.log("Compare product:", productId);
  };

  const handleCardClick = () => {
    navigate(`/product/${productId}`);
  };

  return (
    <div className="product-card cursor-pointer" onClick={handleCardClick}>
      <div
        className="relative overflow-hidden"
        style={{ paddingBottom: "100%" }}
      >
        <img
          src={productImage}
          alt={productName}
          className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          loading="lazy"
          onError={(e) => {
            // Fallback image if loading fails
            e.target.src = "/assets/images/placeholder.jpg";
          }}
        />

        {displayDiscount && <span className="badge">{displayDiscount}</span>}

        {/* Action buttons - slide from right */}
        <div className="product-actions">
          <button
            onClick={handleAddToCart}
            className="action-btn"
            aria-label="Add to cart"
            style={
              isAdding
                ? { backgroundColor: "#16a34a", color: "#fff" }
                : undefined
            }
          >
            {isAdding ? (
              <Check className="w-5 h-5" />
            ) : (
              <ShoppingBag className="w-5 h-5" />
            )}
          </button>
          <button
            onClick={handleToggleFavorite}
            className={`action-btn ${isFavorite ? "active" : ""}`}
            aria-label="Add to wishlist"
          >
            <Heart className="w-5 h-5" fill={isFavorite ? "white" : "none"} />
          </button>
          <button
            className="action-btn"
            aria-label="Compare"
            onClick={(e) => e.stopPropagation()}
          >
            <Repeat className="w-5 h-5" />
          </button>
        </div>
      </div>

      <div className="p-4">
        <div className="flex items-center gap-2 mb-1 flex-wrap">
          {productOriginalPrice && productOriginalPrice !== productPrice && (
            <del className="text-sm text-gray-400">{productOriginalPrice}</del>
          )}
          <span className="font-bold text-[#DA4C2F] text-lg">
            {productPrice}
          </span>
        </div>
        <Link to={`/product/${_id || id}`}>
          <h3 className="font-medium text-gray-800 mb-2 text-base line-clamp-2 hover:text-[#DA4C2F] transition-colors">
            {productName}
          </h3>
        </Link>
        <div className="flex items-center gap-2 flex-wrap">
          <div className="flex items-center gap-0.5">{renderStars()}</div>
          <span className="text-sm text-gray-500">
            {productReviews} reviews
          </span>
        </div>
        {subcategory && (
          <span className="text-xs text-gray-400 mt-1 block">
            {subcategory}
          </span>
        )}
        {!subcategory && category && (
          <span className="text-xs text-gray-400 mt-1 block">{category}</span>
        )}
      </div>
    </div>
  );
}
