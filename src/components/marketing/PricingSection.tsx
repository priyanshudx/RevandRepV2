import Link from "next/link";
import { Check } from "lucide-react";
import { PRODUCT, ROUTES } from "@/lib/constants";

export function PricingSection() {
  return (
    <section
      id="pricing"
      className="section bg-[#080808]"
      aria-label="Pricing"
    >
      <div className="container">
        {/* Header */}
        <div className="text-center mb-14">
          <div className="divider-red mx-auto mb-4" />
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-black text-white tracking-tight mb-4">
            Simple Pricing
          </h2>
          <p className="text-[#a0a0a0] text-lg max-w-xl mx-auto">
            One plan. Everything included. No hidden fees.
          </p>
        </div>

        {/* Single Card */}
        <div className="max-w-sm mx-auto">
          <div
            className="rounded-2xl p-8 text-center relative overflow-hidden"
            style={{
              background: "#141414",
              border: "1px solid rgba(196,30,58,0.3)",
              boxShadow: "0 0 60px rgba(196,30,58,0.08)",
            }}
          >
            {/* Top accent line */}
            <div
              className="absolute top-0 left-0 right-0 h-[2px]"
              style={{ background: "#c41e3a" }}
            />

            {/* Label */}
            <span className="text-[#c41e3a] text-xs font-bold tracking-widest uppercase mb-4 block">
              {PRODUCT.name}
            </span>

            {/* Price */}
            <div className="mb-2">
              <span className="text-7xl font-black text-white">₹19</span>
            </div>
            <p className="text-[#5a5a5a] text-sm mb-8">
              One-time · No subscription
            </p>

            {/* Divider */}
            <div className="divider mb-8" />

            {/* Includes */}
            <ul className="space-y-4 text-left mb-8">
              {PRODUCT.includes.map((item) => (
                <li key={item} className="flex items-start gap-3">
                  <div className="w-5 h-5 rounded-full bg-[#1a0509] border border-[#c41e3a]/30 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <Check size={11} className="text-[#c41e3a]" />
                  </div>
                  <span className="text-[#a0a0a0] text-sm">{item}</span>
                </li>
              ))}
            </ul>

            {/* CTA */}
            <Link
              href={ROUTES.login}
              className="btn-primary w-full text-base py-3.5 justify-center"
              id="pricing-cta"
            >
              Buy Now – ₹19
            </Link>

            <p className="text-[#3a3a3a] text-xs mt-4">
              Secure payment · UPI · Card · Net Banking
            </p>
          </div>

          {/* Guarantees below card */}
          <div className="grid grid-cols-3 gap-3 mt-6">
            {["Secure Payment", "24h Delivery", "Indian Foods"].map((g) => (
              <div
                key={g}
                className="rounded-lg border border-[#1e1e1e] bg-[#111111] p-3 text-center"
              >
                <p className="text-[#5a5a5a] text-xs">{g}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
