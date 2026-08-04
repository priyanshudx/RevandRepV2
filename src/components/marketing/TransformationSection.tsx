import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { ROUTES } from "@/lib/constants";

const transformations = [
  {
    name: "Priya S.",
    location: "Mumbai",
    goal: "Weight Loss",
    result: "Lost 8 kg in 3 months",
    quote:
      "The plan actually uses roti and sabzi! No boiled chicken or salads. I finally stuck to a diet.",
  },
  {
    name: "Rahul M.",
    location: "Delhi",
    goal: "Muscle Gain",
    result: "Gained 5 kg lean mass",
    quote:
      "As a gym guy who eats dal chawal, this was perfect. Paneer, chole, eggs — all in the plan.",
  },
  {
    name: "Sneha K.",
    location: "Bangalore",
    goal: "PCOS Management",
    result: "Hormones balanced in 6 weeks",
    quote:
      "My doctor was impressed. The plan focused on low-GI Indian foods. Worth every rupee.",
  },
];

const stats = [
  { value: "24 hrs", label: "Avg. Delivery Time" },
  { value: "₹19", label: "One-time Price" },
  { value: "8+", label: "Fitness Goals Covered" },
];

export function TransformationSection() {
  return (
    <section
      id="transformations"
      className="section bg-[#080808]"
      aria-label="Transformations"
    >
      <div className="container">
        {/* Stats bar */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-20">
          {stats.map((stat) => (
            <div
              key={stat.label}
              className="text-center p-5 rounded-xl border border-[#1e1e1e] bg-[#111111]"
            >
              <p className="text-3xl font-black text-white mb-1">{stat.value}</p>
              <p className="text-[#5a5a5a] text-sm">{stat.label}</p>
            </div>
          ))}
        </div>

        {/* Header */}
        <div className="text-center mb-14">
          <div className="divider-red mx-auto mb-4" />
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-black text-white tracking-tight mb-4">
            Real People. Real Results.
          </h2>
          <p className="text-[#a0a0a0] text-lg max-w-xl mx-auto">
            Indian users achieving their goals with personalized diet plans.
          </p>
        </div>

        {/* Testimonials */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-14">
          {transformations.map((t) => (
            <div
              key={t.name}
              className="card-elevated p-6 flex flex-col gap-4"
            >
              {/* Quote */}
              <p className="text-[#a0a0a0] text-sm leading-relaxed flex-1">
                &ldquo;{t.quote}&rdquo;
              </p>

              <div className="divider" />

              {/* Meta */}
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-white font-semibold text-sm">{t.name}</p>
                  <p className="text-[#5a5a5a] text-xs">{t.location}</p>
                </div>
                <div className="text-right">
                  <p className="text-[#c41e3a] text-xs font-semibold">
                    {t.result}
                  </p>
                  <p className="text-[#3a3a3a] text-xs">{t.goal}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* CTA */}
        <div className="text-center">
          <Link
            href={ROUTES.login}
            className="btn-primary text-base px-8 py-3.5"
            id="transformation-cta"
          >
            Get My Plan Now
            <ArrowRight size={18} />
          </Link>
        </div>
      </div>
    </section>
  );
}
