import { Suspense } from "react";
import type { Metadata } from "next";
import { ForgotPinForm } from "@/components/auth/ForgotPinForm";

export const metadata: Metadata = {
  title: "Forgot Pass PIN — Rev & Rep",
  description: "Reset your 6-digit Pass PIN for Rev & Rep.",
};

export default function ForgotPinPage() {
  return (
    <Suspense fallback={<ForgotPinFallback />}>
      <ForgotPinForm />
    </Suspense>
  );
}

function ForgotPinFallback() {
  return (
    <div className="min-h-screen bg-[#080808] flex items-center justify-center">
      <div className="w-8 h-8 rounded-full border-2 border-[#c41e3a] border-t-transparent animate-spin" />
    </div>
  );
}
