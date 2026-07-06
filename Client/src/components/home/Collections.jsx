import ProductCard from "../common/ProductCard";

const officeProducts = [
  {
    id: 7,
    name: "Modern Office Desk",
    price: "ETB 85,000",
    originalPrice: "ETB 105,000",
    image: "/assets/images/Office1.jpg",
    rating: 4.0,
    reviews: 4733,
    discount: "-20%",
  },
  {
    id: 8,
    name: "Classic Office Desk",
    price: "ETB 90,000",
    originalPrice: "ETB 115,000",
    image: "/assets/images/Office2.jpg",
    rating: 3.5,
    reviews: 2753,
  },
  {
    id: 9,
    name: "File Cabinet",
    price: "ETB 17,500",
    originalPrice: "ETB 25,000",
    image: "/assets/images/File Cabinet.jpg",
    rating: 4.3,
    reviews: 1810,
  },
  {
    id: 10,
    name: "Comfortable Chair",
    price: "ETB 14,000",
    originalPrice: "ETB 16,000",
    image: "/assets/images/Chair.jpg",
    rating: 4.3,
    reviews: 2052,
    discount: "-20%",
  },
  {
    id: 11,
    name: "Modern Shelves",
    price: "ETB 10,350",
    originalPrice: "ETB 11,500",
    image: "/assets/images/Shelves.jpg",
    rating: 5.0,
    reviews: 2540,
    discount: "-10%",
  },
  {
    id: 12,
    name: "Office Desk",
    price: "ETB 75,00",
    originalPrice: "ETB 85,000",
    image: "/assets/images/Office5.jpg",
    rating: 4.3,
    reviews: 3450,
  },
];

export default function Collections() {
  return (
    <section className="py-12 md:py-16 bg-[#f8f8f8]" id="shop">
      <div className="container">
        <div className="flex justify-between items-center mb-8">
          <h2 className="section-title">Our Collections</h2>
          <a href="#" className="btn-link">
            <span>Shop All Products</span>
            <i className="bx bx-right-arrow-alt text-xl"></i>
          </a>
        </div>
        <div className="has-scrollbar">
          {officeProducts.map((product) => (
            <div key={product.id} className="scrollbar-item">
              <ProductCard {...product} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
