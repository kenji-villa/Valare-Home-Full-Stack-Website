import ProductCard from "../common/ProductCard";

export default function Bestsellers({
  products = [],
  loading = false,
  error = null,
}) {
  // Fallback products if API fails
  const fallbackProducts = [
    {
      id: 1,
      name: "Minimal Closet",
      price: "ETB 25,000.00",
      originalPrice: "ETB 45,000.00",
      image: "/assets/images/p1.jpg",
      rating: 4.5,
      reviews: 3240,
      discount: "-20%",
    },
    {
      id: 2,
      name: "Master Bed",
      price: "ETB 110,000",
      originalPrice: "ETB 150,000",
      image: "/assets/images/p2.jpg",
      rating: 4.8,
      reviews: 5210,
    },
    {
      id: 3,
      name: "Luxury Couch",
      price: "ETB 45,000",
      originalPrice: "ETB 60,000",
      image: "/assets/images/p3.jpg",
      rating: 4.3,
      reviews: 3720,
    },
    {
      id: 4,
      name: "Leather Sofa",
      price: "ETB 60,000",
      originalPrice: "ETB 80,000",
      image: "/assets/images/p4.jpg",
      rating: 4.2,
      reviews: 1852,
      discount: "-20%",
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
    },
    {
      id: 6,
      name: "Dinning Table",
      price: "ETB 25,000",
      originalPrice: "ETB 35,000",
      image: "/assets/images/p6.jpg",
      rating: 4.0,
      reviews: 1660,
    },
  ];

  const displayProducts = products.length > 0 ? products : fallbackProducts;

  if (loading) {
    return (
      <section className="py-12 md:py-16">
        <div className="container">
          <div className="flex justify-between items-center mb-8">
            <h2 className="section-title">Our Bestsellers</h2>
          </div>
          <div className="flex justify-center py-12">
            <div className="w-12 h-12 border-4 border-[#DA4C2F] border-t-transparent rounded-full animate-spin"></div>
          </div>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="py-12 md:py-16">
        <div className="container">
          <div className="flex justify-between items-center mb-8">
            <h2 className="section-title">Our Bestsellers</h2>
          </div>
          <div className="text-center py-8 text-gray-500">
            <p>Unable to load products. Please try again later.</p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-12 md:py-16" id="shop">
      <div className="container">
        <div className="flex justify-between items-center mb-8">
          <h2 className="section-title">Our Bestsellers</h2>
          <a href="/home-furniture" className="btn-link">
            <span>Shop All Products</span>
            <i className="bx bx-right-arrow-alt text-xl"></i>
          </a>
        </div>

        <div className="has-scrollbar">
          {displayProducts.slice(0, 10).map((product) => (
            <div key={product._id || product.id} className="scrollbar-item">
              <ProductCard
                {...product}
                rating={product.averageRating || product.rating || 0}
                reviews={product.reviewCount || product.reviews || 0}
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
