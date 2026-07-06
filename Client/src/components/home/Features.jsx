import { Truck, Headphones, Layers } from "lucide-react";

const features = [
  {
    icon: Truck,
    title: "Flawless Delivery",
    description:
      "We believe the final step of your purchase should be as perfect as the furniture itself.",
  },
  {
    icon: Headphones,
    title: "Personalized Attention",
    description:
      "Your home is a reflection of you, and our service is tailored to match. Our expert consultants are here to guide.",
  },
  {
    icon: Layers,
    title: "Curated Collection",
    description:
      "We don't just sell furniture—we hand-select it. Our curated collection is a showcase of exceptional design, quality craftsmanship, and timeless style.",
  },
];

export default function Features() {
  return (
    <section className="py-12 md:py-16 bg-white">
      <div className="container">
        <h2 className="text-center text-3xl md:text-5xl font-bold text-[#1a2d5e] mb-12">
          Why Shop with Velaré?
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <div key={index} className="text-center group">
                <div className="feature-icon-wrapper">
                  <Icon className="w-8 h-8 text-[#DA4C2F] group-hover:text-white transition-colors" />
                </div>
                <h3 className="text-xl font-bold text-[#1a2d5e] mb-3">
                  {feature.title}
                </h3>
                <p className="text-gray-600 text-sm max-w-sm mx-auto leading-relaxed">
                  {feature.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
