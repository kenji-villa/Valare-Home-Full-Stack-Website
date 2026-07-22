import { useCart } from "../../context/CartContext";
import { ShoppingBag, Star, Repeat, Heart } from "lucide-react";
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
  const isFavorite = favorites.includes(id);

  // Use the correct ID
  const productId = _id || id;
  const productName = name || "Product";

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

  // Fix: Get the correct image path
  let productImage = "/assets/images/placeholder.jpg";

  // Check if image exists and is not null/undefined
  if (coverImage) {
    // If coverImage starts with /uploads, it's from server upload
    if (coverImage.startsWith("/uploads")) {
      productImage = `http://localhost:3001${coverImage}`;
    } else {
      productImage = coverImage;
    }
  } else if (image) {
    if (image.startsWith("/uploads")) {
      productImage = `http://localhost:3001${image}`;
    } else {
      productImage = image;
    }
  } else if (images && images.length > 0) {
    const firstImage = images[0];
    if (firstImage.startsWith("/uploads")) {
      productImage = `http://localhost:3001${firstImage}`;
    } else {
      productImage = firstImage;
    }
  }

  // Get rating and review count
  const productRating = rating || averageRating || 0;
  const productReviews = reviews || reviewCount || 0;

  // Calculate discount if not provided but originalPrice is higher than price
  let displayDiscount = discount;
  if (!displayDiscount && originalPrice && price && originalPrice > price) {
    const discountPercent = Math.round(
      ((originalPrice - price) / originalPrice) * 100,
    );
    if (discountPercent > 0) {
      displayDiscount = `-${discountPercent}%`;
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

        {discount && <span className="badge">{discount}</span>}

        {/* Action buttons - slide from right */}
        <div className="product-actions">
          <button
            onClick={(e) => {
              e.stopPropagation();
              addToCart({
                id: productId,
                name,
                price,
                image,
              });
            }}
            className="action-btn"
            aria-label="Add to cart"
          >
            <ShoppingBag className="w-5 h-5" />
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
