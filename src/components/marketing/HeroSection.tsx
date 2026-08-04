import Link from "next/link";
import { ArrowRight, ChevronDown, Sparkles } from "lucide-react";
import { ROUTES } from "@/lib/constants";
import { BackgroundVideo } from "@/components/dashboard/BackgroundVideo";

export function HeroSection() {
  return (
    <section
      className="relative min-h-screen flex flex-col items-center justify-center text-center overflow-hidden bg-[#080808]"
      aria-label="Hero"
    >
      {/* Background Video Animation */}
      <BackgroundVideo opacityClassName="opacity-60" />

      {/* Background grid */}
      <div
        className="absolute inset-0 opacity-[0.03] pointer-events-none"
        style={{
          backgroundImage: `linear-gradient(#c41e3a 1px, transparent 1px), linear-gradient(90deg, #c41e3a 1px, transparent 1px)`,
          backgroundSize: "60px 60px",
        }}
      />

      {/* Red glow orb */}
      <div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[400px] rounded-full opacity-[0.12] blur-[120px] pointer-events-none"
        style={{ background: "#c41e3a" }}
      />

      <div className="container relative z-10 px-4 pt-20 pb-12">
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
            href={ROUTES.questionnaire}
            className="btn-primary text-base md:text-lg px-8 py-4 w-full sm:w-auto justify-center group shadow-xl shadow-[#c41e3a]/20"
            id="hero-cta-primary"
          >
            Get My Diet Plan – ₹19
            <ArrowRight
              size={18}
              className="group-hover:translate-x-1 transition-transform"
            />
          </Link>
          <a
            href="#how-it-works"
            className="btn-secondary text-base px-8 py-4 w-full sm:w-auto justify-center"
            id="hero-cta-secondary"
          >
            Learn More
          </a>
        </div>

        {/* Trust indicators */}
        <div
          className="flex flex-wrap items-center justify-center gap-6 text-xs md:text-sm text-[#5a5a5a] uppercase tracking-wider font-medium animate-fade-in"
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
        className="absolute bottom-8 left-1/2 -translate-x-1/2 text-[#3a3a3a] hover:text-[#a0a0a0] transition-colors animate-bounce p-2 z-10"
        aria-label="Scroll down"
      >
        <ChevronDown size={24} />
      </a>
    </section>
  );
}
