import type { Metadata } from "next";
import Link from "next/link";
import { CheckCircle, Clock, ArrowRight } from "lucide-react";
import { ROUTES } from "@/lib/constants";
import { Logo } from "@/components/shared/Logo";

export const metadata: Metadata = {
  title: "Payment Submitted — Rev & Rep",
  description: "Your payment has been submitted and is awaiting verification.",
};

export default function PaymentSuccessPage() {
  return (
    <div className="min-h-screen bg-[#080808] flex flex-col">
      {/* Header */}
      <header className="border-b border-[#1e1e1e] bg-[#080808]/90 backdrop-blur-md">
        <div className="container h-14 flex items-center">
          <Logo size={34} />
        </div>
      </header>

      <div className="flex-1 flex items-center justify-center px-4 py-16">
        <div className="max-w-md w-full text-center">
          {/* Success Icon */}
          <div
            className="w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6 relative"
            style={{
              background: "rgba(34,197,94,0.1)",
              border: "2px solid rgba(34,197,94,0.3)",
            }}
          >
            <CheckCircle size={36} className="text-[#22c55e]" />
            <div
              className="absolute -inset-2 rounded-full"
              style={{
                background: "radial-gradient(circle, rgba(34,197,94,0.06) 0%, transparent 70%)",
              }}
            />
          </div>

          <h1 className="text-white font-black text-3xl mb-3">
            Payment Submitted!
          </h1>
          <p className="text-[#a0a0a0] text-sm mb-8 max-w-xs mx-auto">
            We've received your payment details. Your diet plan will be created
            after our team verifies the payment.
          </p>

          {/* Status card */}
          <div
            className="rounded-2xl p-6 mb-8 text-left"
            style={{
              background: "#141414",
              border: "1px solid #1e1e1e",
            }}
          >
            <p className="text-[#5a5a5a] text-xs font-medium uppercase tracking-wide mb-4">
              What Happens Next
            </p>

            <div className="space-y-4">
              {[
                {
                  icon: CheckCircle,
                  color: "text-[#22c55e]",
                  bg: "bg-[rgba(34,197,94,0.1)]",
                  title: "Payment Submitted",
                  desc: "Your UTR has been recorded.",
                  done: true,
                },
                {
                  icon: Clock,
                  color: "text-[#f59e0b]",
                  bg: "bg-[rgba(245,158,11,0.1)]",
                  title: "Admin Verification",
                  desc: "We'll verify your payment within a few hours.",
                  done: false,
                },
                {
                  icon: Clock,
                  color: "text-[#3b82f6]",
                  bg: "bg-[rgba(59,130,246,0.1)]",
                  title: "Diet Plan Creation",
                  desc: "Your personalized plan will be crafted.",
                  done: false,
                },
                {
                  icon: Clock,
                  color: "text-[#c41e3a]",
                  bg: "bg-[rgba(196,30,58,0.1)]",
                  title: "Plan Delivered",
                  desc: "Download from your dashboard when ready.",
                  done: false,
                },
              ].map((step, i) => {
                const Icon = step.icon;
                return (
                  <div key={i} className="flex items-start gap-3">
                    <div
                      className={`w-8 h-8 rounded-lg ${step.bg} flex items-center justify-center flex-shrink-0 mt-0.5`}
                    >
                      <Icon size={15} className={step.color} />
                    </div>
                    <div>
                      <p
                        className={`text-sm font-semibold ${step.done ? "text-white" : "text-[#5a5a5a]"}`}
                      >
                        {step.title}
                      </p>
                      <p className="text-[#3a3a3a] text-xs">{step.desc}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <Link
            href={ROUTES.dashboard}
            className="btn-primary inline-flex justify-center w-full"
            id="go-to-dashboard"
          >
            Go to My Dashboard
            <ArrowRight size={16} />
          </Link>

          <p className="text-[#3a3a3a] text-xs mt-4">
            Track your request status from the dashboard at any time.
          </p>
        </div>
      </div>
    </div>
  );
}
