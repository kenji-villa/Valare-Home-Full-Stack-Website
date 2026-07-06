import ProductCard from "../common/ProductCard";

const products = [
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

export default function Bestsellers() {
  return (
    <section className="py-12 md:py-16 bg-white" id="shop">
      <div className="container">
        <div className="flex justify-between items-center mb-8">
          <h2 className="section-title">Our Bestsellers</h2>
          <a href="/home-furniture" className="btn-link">
            <span>Shop All Products</span>
            <i className="bx bx-right-arrow-alt text-xl"></i>
          </a>
        </div>
        <div className="has-scrollbar">
          {products.map((product) => (
            <div key={product.id} className="scrollbar-item">
              <ProductCard {...product} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
