import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Header from "../components/layout/Header";
import Footer from "../components/layout/Footer";
import Hero from "../components/home/Hero";
import Collection from "../components/home/Collection";
import Bestsellers from "../components/home/Bestsellers";
import Collections from "../components/home/Collections";
import Banner from "../components/home/Banner";
import Features from "../components/home/Features";
import Blog from "../components/home/Blog";
import {
  getProducts,
  getFeaturedProducts,
  getSpecialProducts,
} from "../services/productService";

export default function Home() {
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [specialProducts, setSpecialProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);

        // Fetch featured products
        const featuredResponse = await getFeaturedProducts();
        if (featuredResponse.success) {
          setFeaturedProducts(featuredResponse.products);
        }

        // Fetch special products
        const specialResponse = await getSpecialProducts();
        if (specialResponse.success) {
          setSpecialProducts(specialResponse.products);
        }

        setError(null);
      } catch (err) {
        console.error("Error fetching products:", err);
        setError("Failed to load products");
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  return (
    <>
      <Header />
      <main>
        <Hero />
        <Collection />
        <Bestsellers
          products={featuredProducts}
          loading={loading}
          error={error}
        />
        <Collections
          products={specialProducts}
          loading={loading}
          error={error}
        />
        <Banner />
        <Features />
        <Blog />
      </main>
      <Footer />
    </>
  );
}
