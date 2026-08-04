import { Suspense } from "react";
import type { Metadata } from "next";
import { ResetPinForm } from "@/components/auth/ResetPinForm";

export const metadata: Metadata = {
  title: "Reset Pass PIN — Rev & Rep",
  description: "Set a new 6-digit Pass PIN for your Rev & Rep account.",
};

export default function ResetPinPage() {
  return (
    <Suspense fallback={<ResetPinFallback />}>
      <ResetPinForm />
    </Suspense>
  );
}

function ResetPinFallback() {
  return (
    <div className="min-h-screen bg-[#080808] flex items-center justify-center">
      <div className="w-8 h-8 rounded-full border-2 border-[#c41e3a] border-t-transparent animate-spin" />
    </div>
  );
}
