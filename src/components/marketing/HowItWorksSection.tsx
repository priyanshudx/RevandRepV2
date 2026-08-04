import Link from "next/link";
import { ROUTES } from "@/lib/constants";

const steps = [
  {
    number: "01",
    title: "Fill the Questionnaire",
    description:
      "Answer questions about your body, goals, food preferences, daily routine, and health conditions. Takes 3–5 minutes.",
    detail: "Personal info · Fitness goals · Indian food choices · Daily schedule",
  },
  {
    number: "02",
    title: "Pay ₹19",
    description:
      "Secure payment via UPI, Google Pay, PhonePe, Paytm, card or net banking. One-time payment. No subscriptions.",
    detail: "UPI · GPay · PhonePe · Paytm · Card · Net Banking",
  },
  {
    number: "03",
    title: "Receive Your Plan",
    description:
      "Our nutritionist crafts your personalized Indian diet plan and uploads it to your dashboard within 24 hours.",
    detail: "Delivered as PDF · Downloadable anytime · Mobile friendly",
  },
];

export function HowItWorksSection() {
  return (
    <section
      id="how-it-works"
      className="section bg-[#0a0a0a]"
      aria-label="How It Works"
    >
      <div className="container">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="divider-red mx-auto mb-4" />
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-black text-white tracking-tight mb-4">
            How It Works
          </h2>
          <p className="text-[#a0a0a0] text-lg max-w-xl mx-auto">
            Three simple steps. Your plan delivered in 24 hours.
          </p>
        </div>

        {/* Steps */}
        <div className="relative">
          {/* Connecting line (desktop) */}
          <div
            className="hidden lg:block absolute top-[52px] left-[calc(16.67%+24px)] right-[calc(16.67%+24px)] h-[1px] bg-[#1e1e1e]"
            aria-hidden="true"
          />

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-6">
            {steps.map((step, i) => (
              <div key={step.number} className="flex flex-col items-center text-center lg:items-start lg:text-left">
                {/* Number badge */}
                <div className="relative mb-6">
                  <div className="w-12 h-12 rounded-full border-2 border-[#c41e3a] bg-[#080808] flex items-center justify-center">
                    <span className="text-[#c41e3a] font-black text-sm font-mono">
                      {step.number}
                    </span>
                  </div>
                  {/* Glow */}
                  <div
                    className="absolute inset-0 rounded-full blur-md opacity-30"
                    style={{ background: "#c41e3a" }}
                  />
                </div>

                <div className="card p-6 w-full">
                  <h3 className="text-white font-bold text-lg mb-3">
                    {step.title}
                  </h3>
                  <p className="text-[#a0a0a0] text-sm leading-relaxed mb-4">
                    {step.description}
                  </p>
                  <p className="text-[#3d3d3d] text-xs font-mono">
                    {step.detail}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* CTA */}
        <div className="text-center mt-14">
          <Link
            href={ROUTES.login}
            className="btn-primary text-base px-8 py-3.5"
            id="how-it-works-cta"
          >
            Start Now — ₹19
          </Link>
          <p className="text-[#3a3a3a] text-xs mt-3">
            No subscription. One-time payment. Cancel anytime.
          </p>
        </div>
      </div>
    </section>
  );
}
