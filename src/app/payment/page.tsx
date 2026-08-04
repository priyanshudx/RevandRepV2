import type { Metadata } from "next";
import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { Check, Lock } from "lucide-react";
import { PRODUCT, ROUTES } from "@/lib/constants";
import { Logo } from "@/components/shared/Logo";
import { getPaymentOrderAction } from "@/actions/payment";
import { UpiPaymentForm } from "@/components/payment/UpiPaymentForm";

export const metadata: Metadata = {
  title: "Complete Payment — Rev & Rep",
  description: "Pay ₹19 via UPI for your personalized Indian diet plan.",
};

interface Props {
  searchParams: Promise<{ orderId?: string }>;
}

export default async function PaymentPage({ searchParams }: Props) {
  const { orderId } = await searchParams;

  if (!orderId) redirect(ROUTES.questionnaire);

  const order = await getPaymentOrderAction(orderId);
  if (!order) redirect(ROUTES.dashboard);

  // If already submitted or beyond, redirect to dashboard
  if (
    order.status !== "QUESTIONNAIRE_SUBMITTED" &&
    order.status !== "PAYMENT_REJECTED"
  ) {
    redirect(ROUTES.dashboard);
  }

  const isResubmit = order.status === "PAYMENT_REJECTED";

  return (
    <div className="min-h-screen bg-[#080808]">
      {/* Header */}
      <header className="border-b border-[#1e1e1e] sticky top-0 bg-[#080808]/90 backdrop-blur-md z-10">
        <div className="container h-14 flex items-center justify-between">
          <Logo size={34} />
          <div className="flex items-center gap-1.5 text-[#5a5a5a] text-xs">
            <Lock size={12} />
            Secure Manual Verification
          </div>
        </div>
      </header>

      <div className="container py-10 max-w-4xl">
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
          {/* Left: Payment UI */}
          <div className="lg:col-span-3">
            <div className="card p-6 md:p-8">
              <h1 className="text-white font-bold text-xl mb-2">
                {isResubmit ? "Resubmit Payment" : "Complete Your Payment"}
              </h1>
              <p className="text-[#5a5a5a] text-sm mb-6">
                Scan the QR code or copy the UPI ID, pay ₹19, then enter your UTR below.
              </p>

              <UpiPaymentForm
                orderId={orderId}
                isResubmit={isResubmit}
                rejectionReason={order.payment?.rejectionReason}
              />
            </div>
          </div>

          {/* Right: Order Summary */}
          <div className="lg:col-span-2">
            <div
              className="rounded-2xl p-6 sticky top-24"
              style={{
                background: "#141414",
                border: "1px solid rgba(196,30,58,0.2)",
              }}
            >
              <div
                className="h-[2px] -mx-6 -mt-6 mb-6 rounded-t-2xl"
                style={{ background: "#c41e3a" }}
              />

              <h2 className="text-white font-bold text-base mb-5">Order Summary</h2>

              {/* Product */}
              <div className="flex items-start gap-3 mb-5">
                <div className="w-8 h-8 rounded-lg bg-[#1a0509] border border-[#3a0a14] flex items-center justify-center flex-shrink-0">
                  <span className="text-[#c41e3a] text-sm">📋</span>
                </div>
                <div className="flex-1">
                  <p className="text-white text-sm font-semibold">{PRODUCT.name}</p>
                  {order.questionnaire && (
                    <p className="text-[#5a5a5a] text-xs">
                      {order.questionnaire.fitnessGoal.replace(/_/g, " ")} ·{" "}
                      {order.questionnaire.foodPreference.replace(/_/g, " ")}
                    </p>
                  )}
                </div>
                <span className="text-white font-bold">₹19</span>
              </div>

              <div className="divider mb-4" />

              {/* Includes */}
              <ul className="space-y-2.5 mb-5">
                {PRODUCT.includes.map((item) => (
                  <li key={item} className="flex items-start gap-2">
                    <Check size={12} className="text-[#c41e3a] mt-0.5 flex-shrink-0" />
                    <span className="text-[#a0a0a0] text-xs">{item}</span>
                  </li>
                ))}
              </ul>

              <div className="divider mb-4" />

              {/* How it works */}
              <div className="space-y-3">
                <p className="text-[#a0a0a0] text-xs font-medium uppercase tracking-wide">
                  What Happens Next
                </p>
                {[
                  "Pay ₹19 via UPI",
                  "Submit your UTR number",
                  "Admin verifies payment (few hours)",
                  "Diet plan created & delivered",
                ].map((step, i) => (
                  <div key={step} className="flex items-center gap-3">
                    <span className="w-5 h-5 rounded-full bg-[#1a0509] border border-[#3a0a14] text-[#c41e3a] text-xs font-bold flex items-center justify-center flex-shrink-0">
                      {i + 1}
                    </span>
                    <span className="text-[#5a5a5a] text-xs">{step}</span>
                  </div>
                ))}
              </div>

              <div className="divider my-4" />

              <div className="flex items-center justify-between">
                <span className="text-[#a0a0a0] text-sm">Total</span>
                <span className="text-white font-black text-2xl">₹19</span>
              </div>
              <p className="text-[#3a3a3a] text-xs mt-3 text-center">
                One-time payment · No hidden fees
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
