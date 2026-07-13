import { useState, useEffect } from "react";
import ProductCard from "../common/ProductCard";
import { getSpecialProducts } from "../../services/productService";

export default function Collections({
  products: propProducts,
  loading: propLoading,
  error: propError,
}) {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // If products are passed as props, use them
    if (propProducts) {
      setProducts(propProducts);
      setLoading(propLoading || false);
      setError(propError || null);
      return;
    }

    // Otherwise fetch special products
    const fetchSpecialProducts = async () => {
      try {
        setLoading(true);
        const response = await getSpecialProducts();
        if (response.success) {
          setProducts(response.products);
        }
      } catch (err) {
        console.error("Error fetching special products:", err);
        setError("Failed to load special products");
      } finally {
        setLoading(false);
      }
    };

    fetchSpecialProducts();
  }, [propProducts, propLoading, propError]);

  return (
    <section className="py-12 md:py-16" id="shop">
      <div className="container">
        <div className="flex justify-between items-center mb-8">
          <h2 className="section-title">Our Collections</h2>
          <a href="#" className="btn-link">
            <span>Shop All Products</span>
            <i className="bx bx-right-arrow-alt text-xl"></i>
          </a>
        </div>

        {loading ? (
          <div className="flex justify-center py-12">
            <div className="w-12 h-12 border-4 border-[#DA4C2F] border-t-transparent rounded-full animate-spin"></div>
          </div>
        ) : error ? (
          <div className="text-center py-8 text-gray-500">
            <p>Unable to load products. Please try again later.</p>
          </div>
        ) : products.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <p>No special products available at the moment.</p>
          </div>
        ) : (
          <div className="has-scrollbar">
            {products.map((product) => (
              <div key={product._id || product.id} className="scrollbar-item">
                <ProductCard {...product} />
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
