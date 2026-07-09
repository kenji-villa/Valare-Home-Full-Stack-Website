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
import { getFeaturedProducts } from "../services/productService";

export default function Home() {
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchFeatured = async () => {
      try {
        const response = await getFeaturedProducts();
        if (response.success) {
          setFeaturedProducts(response.products);
        }
      } catch (err) {
        console.error("Error fetching featured products:", err);
        setError("Failed to load featured products");
      } finally {
        setLoading(false);
      }
    };

    fetchFeatured();
  }, []);
  return (
    <>
      <Header />
      <main>
        <Hero />
        <Collection />
        <Bestsellers />
        <Collections />
        <Banner />
        <Features />
        <Blog />
      </main>
      <Footer />
    </>
  );
}
