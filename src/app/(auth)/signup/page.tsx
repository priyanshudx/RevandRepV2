import { Suspense } from "react";
import type { Metadata } from "next";
import { SignupForm } from "@/components/auth/SignupForm";

export const metadata: Metadata = {
  title: "Sign Up — Rev & Rep",
  description: "Create an account with Rev & Rep to get your personalized Indian diet plan.",
};

export default function SignupPage() {
  return (
    <Suspense fallback={<SignupFallback />}>
      <SignupForm />
    </Suspense>
  );
}

function SignupFallback() {
  return (
    <div className="min-h-screen bg-[#080808] flex items-center justify-center">
      <div className="w-8 h-8 rounded-full border-2 border-[#c41e3a] border-t-transparent animate-spin" />
    </div>
  );
}
