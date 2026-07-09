import { useCart } from "../../context/CartContext";
import { ShoppingBag, Star, Repeat, Heart } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function ProductCard({
  id,
  name,
  price,
  originalPrice,
  image,
  rating,
  reviews,
  discount,
}) {
  const { addToCart, toggleFavorite, favorites } = useCart();
  const navigate = useNavigate();
  const isFavorite = favorites.includes(id);

  // Generate star rating
  const renderStars = () => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0 && rating % 1 >= 0.3;

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

  const handleAddToCart = () => {
    addToCart({
      id: productId,
      name: productName,
      price: productPrice,
      image: productImage,
    });
  };

  // Parse price for display
  const displayPrice = price.replace("ETB", "").trim();
  const displayOriginalPrice = originalPrice
    ? originalPrice.replace("ETB", "").trim()
    : "";

  const handleCardClick = () => {
    navigate(`/product/${id}`);
  };

  return (
    <div className="product-card cursor-pointer" onClick={handleCardClick}>
      <div
        className="relative overflow-hidden"
        style={{ paddingBottom: "100%" }}
      >
        <img
          src={image}
          alt={name}
          className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          loading="lazy"
        />

        {discount && <span className="badge">{discount}</span>}

        {/* Action buttons - slide from right */}
        <div className="product-actions">
          <button
            onClick={(e) => {
              e.stopPropagation();
              addToCart({ id, name, price, image });
            }}
            className="action-btn"
            aria-label="Add to cart"
          >
            <ShoppingBag className="w-5 h-5" />
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              toggleFavorite(id);
            }}
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
          {originalPrice && (
            <del className="text-sm text-gray-400">
              ETB {displayOriginalPrice}
            </del>
          )}
          <span className="font-bold text-[#DA4C2F] text-lg">
            ETB {displayPrice}
          </span>
        </div>
        <h3 className="font-medium text-gray-800 mb-2 text-base line-clamp-2">
          {name}
        </h3>
        <div className="flex items-center gap-2 flex-wrap">
          <div className="flex items-center gap-0.5">{renderStars()}</div>
          <span className="text-sm text-gray-500">
            {reviews.toLocaleString()} reviews
          </span>
        </div>
      </div>
    </div>
  );
}
