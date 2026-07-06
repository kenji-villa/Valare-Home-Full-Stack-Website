import { FaArrowRight } from "react-icons/fa";

const heroData = [
  {
    image: "/assets/images/Banner.jpg",
    title: "Your Comfort <br /> is Our Happiness",
    description:
      "Our commitment to quality extends far beyond the furniture itself. We believe that exceptional service is the cornerstone of a truly refined experience.",
    price: "Starting at ETB 65,000",
  },
  {
    image: "/assets/images/KF.jpg",
    title: "Your Comfort <br /> is Our Happiness",
    description:
      "Our commitment to quality extends far beyond the furniture itself. We believe that exceptional service is the cornerstone of a truly refined experience.",
    price: "Starting at ETB 75,000",
  },
  {
    image: "/assets/images/Banner_Ch.jpg",
    title: "Your Comfort <br /> is Our Happiness",
    description:
      "Our commitment to quality extends far beyond the furniture itself. We believe that exceptional service is the cornerstone of a truly refined experience.",
    price: "Starting at ETB 80,000",
  },
];

export default function Hero() {
  return (
    <section className="py-8 md:py-12" aria-label="hero">
      <div className="container">
        <div className="has-scrollbar no-scrollbar">
          {heroData.map((slide, index) => (
            <div
              key={index}
              className="scrollbar-item w-full min-w-[280px] md:min-w-[400px]"
            >
              <div className="hero-card">
                <div
                  className="hero-bg"
                  style={{ backgroundImage: `url(${slide.image})` }}
                ></div>
                <div className="hero-overlay"></div>
                <div className="hero-content">
                  <h1
                    className="text-3xl md:text-5xl font-bold mb-4 leading-tight"
                    dangerouslySetInnerHTML={{ __html: slide.title }}
                  />
                  <p className="text-sm md:text-base mb-4 opacity-90 leading-relaxed max-w-md">
                    {slide.description}
                  </p>
                  <p className="text-lg md:text-xl font-semibold mb-6">
                    {slide.price}
                  </p>
                  <a
                    href="#"
                    className="btn-primary inline-flex items-center gap-2"
                  >
                    Shop Now <FaArrowRight className="w-5 h-5" />
                  </a>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
