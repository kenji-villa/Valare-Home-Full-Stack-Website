import { FaArrowRight } from "react-icons/fa";

export default function Banner() {
  return (
    <section className="py-12 md:py-16">
      <div className="container">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Banner 1 */}
          <div className="banner-card">
            <div
              className="banner-bg"
              style={{ backgroundImage: "url('/assets/images/Banner.jpg')" }}
            ></div>
            <div className="banner-overlay"></div>
            <div className="banner-content">
              <p className="text-sm uppercase tracking-wider mb-2 opacity-80">
                New Collection
              </p>
              <h2 className="text-2xl md:text-3xl font-bold mb-4 leading-tight">
                Long lasting <br />
                Seamless Beauty
              </h2>
              <a
                href="/services"
                className="btn-secondary inline-flex items-center gap-2"
              >
                Explore More <FaArrowRight className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Banner 2 */}
          <div className="banner-card">
            <div
              className="banner-bg"
              style={{ backgroundImage: "url('/assets/images/Banner_2.jpg')" }}
            ></div>
            <div className="banner-overlay"></div>
            <div className="banner-content">
              <h2 className="text-2xl md:text-3xl font-bold mb-3 leading-tight">
                Meticulous Craftsmanship
              </h2>
              <p className="text-sm opacity-90 mb-4 max-w-sm">
                Our knowledgeable team guides you through every selection,
                ensuring each piece perfectly complements your vision and
                lifestyle.
              </p>
              <a
                href="/contact"
                className="btn-secondary inline-flex items-center gap-2"
              >
                Shop Sale <FaArrowRight className="w-5 h-5" />
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
