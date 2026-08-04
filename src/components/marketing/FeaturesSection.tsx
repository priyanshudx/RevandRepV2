import { Zap, Leaf, Clock, FileText, Smartphone, Star } from "lucide-react";

const features = [
  {
    icon: Zap,
    title: "Fully Personalized",
    description:
      "Your plan is built from scratch based on your body, goals, and daily routine. No copy-paste diets.",
  },
  {
    icon: Leaf,
    title: "100% Indian Foods",
    description:
      "Roti, rice, dal, paneer, sabzi — your plan uses foods you already eat and love. No exotic ingredients.",
  },
  {
    icon: Clock,
    title: "Delivered in 24 Hours",
    description:
      "Fill out the questionnaire, pay ₹19, and receive your personalized PDF within 24 hours.",
  },
  {
    icon: FileText,
    title: "Detailed PDF Plan",
    description:
      "Morning to night, every meal planned out with portions, timings, and Indian alternatives.",
  },
  {
    icon: Smartphone,
    title: "Mobile Friendly",
    description:
      "Your PDF opens perfectly on any phone. Reference your meal plan anywhere, anytime.",
  },
  {
    icon: Star,
    title: "Expert Crafted",
    description:
      "Every plan is reviewed by certified nutritionists familiar with Indian eating patterns.",
  },
];

export function FeaturesSection() {
  return (
    <section
      id="features"
      className="section bg-[#080808]"
      aria-label="Features"
    >
      <div className="container">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="divider-red mx-auto mb-4" />
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-black text-white tracking-tight mb-4">
            Why Rev & Rep?
          </h2>
          <p className="text-[#a0a0a0] text-lg max-w-xl mx-auto">
            Not just another diet app. A real, personalized plan built for the
            Indian lifestyle.
          </p>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {features.map((feature, i) => {
            const Icon = feature.icon;
            return (
              <div
                key={feature.title}
                className="card-elevated p-6 group"
                style={{ animationDelay: `${i * 0.1}s` }}
              >
                {/* Icon */}
                <div className="w-10 h-10 rounded-lg bg-[#1a0509] border border-[#3a0a14] flex items-center justify-center mb-4 group-hover:border-[#c41e3a]/40 transition-colors">
                  <Icon size={18} className="text-[#c41e3a]" />
                </div>

                <h3 className="text-white font-semibold text-base mb-2">
                  {feature.title}
                </h3>
                <p className="text-[#5a5a5a] text-sm leading-relaxed">
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
