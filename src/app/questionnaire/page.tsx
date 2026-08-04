import type { Metadata } from "next";
import Link from "next/link";
import { ROUTES } from "@/lib/constants";
import { Logo } from "@/components/shared/Logo";
import { QuestionnaireForm } from "@/components/questionnaire/QuestionnaireForm";

export const metadata: Metadata = {
  title: "Your Diet Questionnaire — Rev & Rep",
  description: "Tell us about yourself so we can create your personalized Indian diet plan.",
};

export default function QuestionnairePage() {
  return (
    <div className="min-h-screen bg-[#080808]">
      {/* Top Header */}
      <header className="border-b border-[#1e1e1e] sticky top-0 bg-[#080808]/90 backdrop-blur-md z-10">
        <div className="container h-14 flex items-center justify-between">
          <Logo size={34} />
          <span className="text-[#5a5a5a] text-sm">Diet Personalization</span>
        </div>
      </header>

      {/* Dynamic Questionnaire Form */}
      <QuestionnaireForm />
    </div>
  );
}
