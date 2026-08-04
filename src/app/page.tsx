import type { Metadata } from "next";
import { Navbar } from "@/components/shared/Navbar";
import { Footer } from "@/components/shared/Footer";
import { HeroSection } from "@/components/marketing/HeroSection";
import { FeaturesSection } from "@/components/marketing/FeaturesSection";
import { HowItWorksSection } from "@/components/marketing/HowItWorksSection";
import { TransformationSection } from "@/components/marketing/TransformationSection";
import { PricingSection } from "@/components/marketing/PricingSection";
import { FAQSection } from "@/components/marketing/FAQSection";
import { ContactSection } from "@/components/marketing/ContactSection";

export const metadata: Metadata = {
  title: "Rev & Rep — Personalized Indian Diet Plan for ₹19",
  description:
    "Get your personalized Indian diet plan based on your goals, lifestyle, and eating habits. Only ₹19. Delivered within 24 hours. Weight loss, muscle gain, PCOS, diabetes plans.",
};

export default function HomePage() {
  return (
    <>
      <Navbar />
      <main>
        <HeroSection />
        <FeaturesSection />
        <HowItWorksSection />
        <TransformationSection />
        <PricingSection />
        <FAQSection />
        <ContactSection />
      </main>
      <Footer />
    </>
  );
}
