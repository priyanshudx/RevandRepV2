"use client";

import Link from "next/link";
import { CheckCircle, Clock, AlertCircle, ChevronRight } from "lucide-react";
import { ROUTES } from "@/lib/constants";
import type { OrderStatus } from "@/types";

interface Props {
  orderId: string;
  status: OrderStatus;
  rejectionReason?: string | null;
  goalLabel?: string;
}

const STEPS: { key: OrderStatus | "PAYMENT_SUBMITTED"; label: string; desc: string }[] = [
  {
    key: "QUESTIONNAIRE_SUBMITTED",
    label: "Questionnaire Completed",
    desc: "Your diet preferences have been recorded.",
  },
  {
    key: "PAYMENT_PENDING",
    label: "Payment Submitted",
    desc: "Your UTR is under review.",
  },
  {
    key: "PAYMENT_VERIFIED",
    label: "Payment Verified",
    desc: "Payment confirmed by our team.",
  },
  {
    key: "DIET_IN_PROGRESS",
    label: "Diet Being Created",
    desc: "Our dietitian is crafting your personalized plan.",
  },
  {
    key: "DIET_PUBLISHED",
    label: "Diet Plan Ready",
    desc: "Your plan is ready to download!",
  },
];

const STATUS_ORDER: Record<string, number> = {
  QUESTIONNAIRE_SUBMITTED: 0,
  PAYMENT_PENDING: 1,
  PAYMENT_REJECTED: 1,
  PAYMENT_VERIFIED: 2,
  DIET_IN_PROGRESS: 3,
  DIET_PUBLISHED: 4,
};

export function StatusTimeline({ orderId, status, rejectionReason, goalLabel }: Props) {
  const currentIdx = STATUS_ORDER[status] ?? 0;
  const isRejected = status === "PAYMENT_REJECTED";

  return (
    <div
      className="rounded-2xl p-6 relative overflow-hidden"
      style={{ background: "#141414", border: "1px solid #1e1e1e" }}
    >
      {/* Subtle top accent */}
      <div
        className="absolute top-0 left-0 right-0 h-[2px] rounded-t-2xl"
        style={{ background: isRejected ? "#c41e3a" : "linear-gradient(90deg,#c41e3a,#ff6b6b20)" }}
      />

      <div className="flex items-center justify-between mb-5">
        <div>
          <p className="text-white font-semibold text-sm">{goalLabel ?? "Diet Plan"}</p>
          <p className="text-[#5a5a5a] text-xs">Order #{orderId.slice(-8).toUpperCase()}</p>
        </div>
        {isRejected && (
          <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-[rgba(196,30,58,0.12)] border border-[rgba(196,30,58,0.3)] text-[#c41e3a]">
            Payment Rejected
          </span>
        )}
      </div>

      {/* Rejection reason */}
      {isRejected && rejectionReason && (
        <div className="mb-5 p-3 rounded-xl bg-[rgba(196,30,58,0.06)] border border-[rgba(196,30,58,0.2)]">
          <div className="flex items-start gap-2">
            <AlertCircle size={14} className="text-[#c41e3a] mt-0.5 flex-shrink-0" />
            <div>
              <p className="text-[#c41e3a] text-xs font-semibold mb-0.5">Reason</p>
              <p className="text-[#a0a0a0] text-xs">{rejectionReason}</p>
            </div>
          </div>
        </div>
      )}

      {/* Timeline */}
      <div className="space-y-0">
        {STEPS.map((step, i) => {
          const isDone = currentIdx > i || (status === "DIET_PUBLISHED" && i === 4);
          const isActive = currentIdx === i && !isRejected;
          const isCurrentRejected = isRejected && i === 1;

          return (
            <div key={step.key} className="flex gap-3">
              {/* Line + dot */}
              <div className="flex flex-col items-center">
                <div
                  className={`w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 z-10 transition-all ${
                    isCurrentRejected
                      ? "bg-[rgba(196,30,58,0.15)] border border-[#c41e3a]"
                      : isDone
                      ? "bg-[rgba(196,30,58,0.15)] border border-[#c41e3a]"
                      : isActive
                      ? "bg-[rgba(245,158,11,0.15)] border border-[#f59e0b]"
                      : "bg-[#1a1a1a] border border-[#2a2a2a]"
                  }`}
                >
                  {isCurrentRejected ? (
                    <AlertCircle size={12} className="text-[#c41e3a]" />
                  ) : isDone ? (
                    <CheckCircle size={12} className="text-[#c41e3a]" />
                  ) : isActive ? (
                    <Clock size={12} className="text-[#f59e0b]" />
                  ) : (
                    <span className="text-[#3a3a3a] text-[10px] font-bold">{i + 1}</span>
                  )}
                </div>
                {i < STEPS.length - 1 && (
                  <div
                    className={`w-[1px] flex-1 my-1 ${isDone ? "bg-[#c41e3a]/30" : "bg-[#1e1e1e]"}`}
                    style={{ minHeight: 20 }}
                  />
                )}
              </div>

              {/* Content */}
              <div className="pb-5 flex-1">
                <p
                  className={`text-sm font-semibold leading-tight ${
                    isCurrentRejected
                      ? "text-[#c41e3a]"
                      : isDone || isActive
                      ? "text-white"
                      : "text-[#3a3a3a]"
                  }`}
                >
                  {isCurrentRejected ? "Payment Rejected" : step.label}
                </p>
                <p className="text-[#5a5a5a] text-xs mt-0.5">
                  {isCurrentRejected ? (rejectionReason ?? step.desc) : step.desc}
                </p>
              </div>
            </div>
          );
        })}
      </div>

      {/* CTAs */}
      {isRejected && (
        <Link
          href={`/payment?orderId=${orderId}`}
          className="btn-primary w-full justify-center mt-2"
          id={`resubmit-${orderId}`}
        >
          Resubmit Payment
          <ChevronRight size={16} />
        </Link>
      )}
      {status === "QUESTIONNAIRE_SUBMITTED" && (
        <Link
          href={`/payment?orderId=${orderId}`}
          className="btn-primary w-full justify-center mt-2"
          id={`pay-${orderId}`}
        >
          Complete Payment
          <ChevronRight size={16} />
        </Link>
      )}
    </div>
  );
}
