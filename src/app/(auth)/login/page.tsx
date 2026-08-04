import { Suspense } from "react";
import type { Metadata } from "next";
import { LoginForm } from "@/components/auth/LoginForm";

export const metadata: Metadata = {
  title: "Login — Rev & Rep",
  description:
    "Sign in to Rev & Rep with your email to access your personalized diet plan.",
};

export default function LoginPage() {
  return (
    // Suspense is required because LoginForm reads useSearchParams()
    <Suspense fallback={<LoginFallback />}>
      <LoginForm />
    </Suspense>
  );
}

function LoginFallback() {
  return (
    <div className="min-h-screen bg-[#080808] flex items-center justify-center">
      <div className="w-8 h-8 rounded-full border-2 border-[#c41e3a] border-t-transparent animate-spin" />
    </div>
  );
}
