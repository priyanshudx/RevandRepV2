"use client";

import { useRef, useState, useTransition } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Upload, Loader2, AlertCircle, Shield } from "lucide-react";
import { submitUpiPaymentAction } from "@/actions/payment";
import { UPI_AMOUNT } from "@/lib/constants";

interface Props {
  orderId: string;
  isResubmit?: boolean;
  rejectionReason?: string | null;
}

export function UpiPaymentForm({ orderId, isResubmit, rejectionReason }: Props) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [utr, setUtr] = useState("");
  const [screenshot, setScreenshot] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0] ?? null;
    setScreenshot(file);
    if (file) {
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);
    } else {
      setPreviewUrl(null);
    }
  }

  function handleUtrChange(e: React.ChangeEvent<HTMLInputElement>) {
    const cleaned = e.target.value.replace(/\D/g, "").slice(0, 12);
    setUtr(cleaned);
    if (error) setError(null);
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    const cleanUtr = utr.trim();

    if (!cleanUtr) {
      setError("Please enter your 12-digit UTR / Transaction ID.");
      return;
    }

    if (cleanUtr.length !== 12) {
      setError(`UTR number must be exactly 12 digits (currently ${cleanUtr.length} digits). Please check your payment receipt.`);
      return;
    }

    const fd = new FormData();
    fd.append("orderId", orderId);
    fd.append("utrNumber", cleanUtr);
    if (screenshot) fd.append("screenshot", screenshot);

    startTransition(async () => {
      const res = await submitUpiPaymentAction(fd);
      if (res.success) {
        router.replace(`/payment/success?orderId=${orderId}`);
      } else {
        setError(res.error ?? "Something went wrong. Please try again.");
      }
    });
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-0">
      {/* Rejection notice */}
      {isResubmit && rejectionReason && (
        <div className="mb-6 p-4 rounded-xl bg-[rgba(196,30,58,0.08)] border border-[rgba(196,30,58,0.25)]">
          <p className="text-[#c41e3a] text-xs font-bold uppercase tracking-wide mb-1">
            Payment Rejected
          </p>
          <p className="text-[#a0a0a0] text-sm">{rejectionReason}</p>
          <p className="text-[#5a5a5a] text-xs mt-2">
            Please pay again and submit a new UTR below.
          </p>
        </div>
      )}

      {/* QR Code */}
      <div className="flex flex-col items-center mb-8">
        <p className="text-[#a0a0a0] text-xs font-medium uppercase tracking-wide mb-4">
          Scan QR Code to Pay
        </p>
        <div
          className="rounded-2xl p-3 mb-4 relative"
          style={{ background: "#fff", width: 200, height: 200 }}
        >
          <Image
            src="/qr-code.png"
            alt="Rev & Rep UPI QR Code"
            fill
            className="rounded-xl object-contain p-1"
            priority
          />
        </div>

        <p className="text-[#3a3a3a] text-xs mt-2">
          Pay exactly <span className="text-white font-bold">₹{UPI_AMOUNT}</span> — no more, no less
        </p>
      </div>

      <div className="divider mb-6" />

      {/* UTR Input */}
      <div className="mb-5">
        <div className="flex items-center justify-between mb-1.5">
          <label htmlFor="utr-number" className="block text-[#a0a0a0] text-xs font-medium uppercase tracking-wide">
            12-Digit UTR / Transaction ID <span className="text-[#c41e3a]">*</span>
          </label>
          <span className={`text-xs font-mono ${utr.length === 12 ? "text-[#22c55e] font-semibold" : "text-[#5a5a5a]"}`}>
            {utr.length}/12 digits
          </span>
        </div>
        <input
          id="utr-number"
          type="text"
          inputMode="numeric"
          pattern="[0-9]*"
          maxLength={12}
          value={utr}
          onChange={handleUtrChange}
          placeholder="e.g. 423456789012"
          className={`input-base font-mono tracking-widest text-center text-base w-full ${
            error ? "border-[#c41e3a]/60 bg-[rgba(196,30,58,0.03)]" : ""
          }`}
          autoComplete="off"
        />
        <p className="text-[#5a5a5a] text-xs mt-2 leading-relaxed">
          GPay: <span className="text-[#a0a0a0]">UPI Transaction ID</span> · PhonePe: <span className="text-[#a0a0a0]">UTR</span> · Paytm: <span className="text-[#a0a0a0]">UPI Ref No.</span>
        </p>
      </div>

      {/* Screenshot Upload */}
      <div className="mb-6">
        <label className="form-label">
          Payment Screenshot <span className="text-[#5a5a5a] font-normal">(Optional)</span>
        </label>
        <div
          onClick={() => fileRef.current?.click()}
          className={`mt-2 rounded-xl border-2 border-dashed cursor-pointer transition-all p-5 text-center ${screenshot
              ? "border-[#c41e3a]/40 bg-[rgba(196,30,58,0.04)]"
              : "border-[#2a2a2a] hover:border-[#3a3a3a] bg-[#0e0e0e]"
            }`}
        >
          {previewUrl ? (
            <div className="flex flex-col items-center gap-2">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={previewUrl}
                alt="Screenshot preview"
                className="max-h-28 max-w-full rounded-lg object-contain"
              />
              <p className="text-[#5a5a5a] text-xs">{screenshot?.name}</p>
              <p className="text-[#c41e3a] text-xs">Click to change</p>
            </div>
          ) : (
            <div className="flex flex-col items-center gap-2 text-[#5a5a5a]">
              <Upload size={20} />
              <p className="text-sm">Click to upload screenshot</p>
              <p className="text-xs">JPG, PNG or WebP · Max 5 MB</p>
            </div>
          )}
        </div>
        <input
          ref={fileRef}
          type="file"
          accept="image/jpeg,image/png,image/webp"
          onChange={handleFileChange}
          className="hidden"
        />
      </div>

      {/* Error */}
      {error && (
        <div className="flex items-start gap-2 mb-4 p-3 rounded-xl bg-[rgba(196,30,58,0.08)] border border-[rgba(196,30,58,0.2)] text-[#c41e3a]">
          <AlertCircle size={15} className="mt-0.5 flex-shrink-0" />
          <p className="text-xs leading-relaxed">{error}</p>
        </div>
      )}

      {/* Submit */}
      <button
        type="submit"
        disabled={isPending || utr.length !== 12}
        className="btn-primary w-full justify-center text-base py-4 disabled:opacity-50 disabled:cursor-not-allowed"
        id="submit-utr"
      >
        {isPending ? (
          <>
            <Loader2 size={18} className="animate-spin" />
            Submitting…
          </>
        ) : (
          <>
            <Shield size={18} />
            {isResubmit ? "Resubmit Payment" : "Submit Payment for Verification"}
          </>
        )}
      </button>

      <p className="text-[#3a3a3a] text-xs text-center mt-4">
        Your payment will be manually verified within a few hours.
      </p>
    </form>
  );
}
