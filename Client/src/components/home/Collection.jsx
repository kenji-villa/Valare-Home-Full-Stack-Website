import { FaArrowRight } from "react-icons/fa";

const collections = [
  {
    title: "Summer Collection",
    price: "Starting at ETB 40,000",
    image: "/assets/images/b2.jpg",
    link: "#",
  },
  {
    title: "What's New?",
    price: "Crafted for Comfort",
    image: "/assets/images/bx2.jpg",
    link: "#",
  },
  {
    title: "Designed to Dwell",
    price: "Starting at ETB 25,000",
    image: "/assets/images/bx3.jpg",
    link: "#",
  },
];

export default function Collection() {
  return (
    <section className="py-12 md:py-16" id="collection">
      <div className="container">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {collections.map((item, index) => (
            <div key={index} className="collection-card">
              <div
                className="card-bg"
                style={{ backgroundImage: `url(${item.image})` }}
              ></div>
              <div className="overlay"></div>
              <div className="card-content">
                <h2 className="text-2xl md:text-3xl font-bold mb-1">
                  {item.title}
                </h2>
                <p className="text-sm opacity-90 mb-3">{item.price}</p>
                <a
                  href={item.link}
                  className="text-white font-medium inline-flex items-center gap-2 hover:gap-4 transition-all duration-300"
                >
                  <span>Shop Now</span>
                  <FaArrowRight className="w-5 h-5" />
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
