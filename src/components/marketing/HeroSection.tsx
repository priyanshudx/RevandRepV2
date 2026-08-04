import Link from "next/link";
import { ArrowRight, ChevronDown } from "lucide-react";
import { ROUTES } from "@/lib/constants";
import { BackgroundVideo } from "@/components/dashboard/BackgroundVideo";

export function HeroSection() {
  return (
    <section
      className="relative min-h-screen flex flex-col items-center justify-center text-center overflow-hidden"
      aria-label="Hero"
    >
      {/* Background Video Animation */}
      <BackgroundVideo opacityClassName="opacity-70" />
      {/* Background grid */}
      <div
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage: `linear-gradient(#c41e3a 1px, transparent 1px), linear-gradient(90deg, #c41e3a 1px, transparent 1px)`,
          backgroundSize: "60px 60px",
        }}
      />

      {/* Red glow orb */}
      <div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[400px] rounded-full opacity-[0.06] blur-[120px] pointer-events-none"
        style={{ background: "#c41e3a" }}
      />

      <div className="container relative z-10">
        {/* Badge */}
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-[#2a2a2a] bg-[#141414] mb-8 animate-fade-in">
          <span className="w-1.5 h-1.5 rounded-full bg-[#c41e3a] animate-pulse" />
          <span className="text-[#a0a0a0] text-xs font-medium tracking-wide">
            Personalized Indian Diet Plans — Only ₹19
          </span>
        </div>

        {/* Headline */}
        <h1
          className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-black text-white leading-[0.95] tracking-tighter mb-6 animate-fade-in-up"
          style={{ animationDelay: "0.1s" }}
        >
          Rev Your Body.
          <br />
          <span className="text-[#c41e3a]">Fuel Your Life.</span>
        </h1>

        {/* Subheadline */}
        <p
          className="text-[#a0a0a0] text-lg md:text-xl max-w-2xl mx-auto leading-relaxed mb-10 animate-fade-in-up"
          style={{ animationDelay: "0.2s" }}
        >
          Get your personalized Indian diet plan based on your goals,
          lifestyle, and eating habits.{" "}
          <span className="text-white font-semibold">Only ₹19.</span>{" "}
          Delivered within 24 hours.
        </p>

        {/* CTAs */}
        <div
          className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-14 animate-fade-in-up"
          style={{ animationDelay: "0.3s" }}
        >
          <Link
            href={ROUTES.login}
            className="btn-primary text-base px-8 py-3.5 animate-pulse-red"
            id="hero-cta-primary"
          >
            Get My Diet Plan – ₹19
            <ArrowRight size={18} />
          </Link>
          <a
            href="#how-it-works"
            className="btn-secondary text-base px-8 py-3.5"
            id="hero-cta-secondary"
          >
            Learn More
          </a>
        </div>

        {/* Trust indicators */}
        <div
          className="flex flex-wrap items-center justify-center gap-6 text-sm text-[#5a5a5a] animate-fade-in"
          style={{ animationDelay: "0.4s" }}
        >
          {[
            "✓ 1000+ Plans Delivered",
            "✓ 24h Delivery",
            "✓ 100% Indian Foods",
            "✓ Expert Crafted",
          ].map((item) => (
            <span key={item}>{item}</span>
          ))}
        </div>
      </div>

      {/* Scroll indicator */}
      <a
        href="#features"
        className="absolute bottom-8 left-1/2 -translate-x-1/2 text-[#3a3a3a] hover:text-[#5a5a5a] transition-colors animate-bounce"
        aria-label="Scroll down"
      >
        <ChevronDown size={24} />
      </a>
    </section>
  );
}
