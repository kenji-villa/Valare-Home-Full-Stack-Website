import Header from "../components/layout/Header";
import Footer from "../components/layout/Footer";
import Hero from "../components/home/Hero";
import Collection from "../components/home/Collection";
import Bestsellers from "../components/home/Bestsellers";
import Collections from "../components/home/Collections";
import Banner from "../components/home/Banner";
import Features from "../components/home/Features";
import Blog from "../components/home/Blog";

export default function Home() {
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
