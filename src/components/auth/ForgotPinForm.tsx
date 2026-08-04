"use client";

import { useRef, useState, useTransition } from "react";
import Link from "next/link";
import { Mail, ArrowRight, Loader2, AlertCircle, CheckCircle } from "lucide-react";
import { ROUTES } from "@/lib/constants";
import { Logo } from "@/components/shared/Logo";
import { forgotPinSchema } from "@/lib/validations";

export function ForgotPinForm() {
  const emailRef = useRef<HTMLInputElement>(null);

  const [submittedEmail, setSubmittedEmail] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  function handleSendReset() {
    const email = emailRef.current?.value.trim() ?? "";

    const validation = forgotPinSchema.safeParse({ email });
    if (!validation.success) {
      setError(validation.error.errors[0]?.message ?? "Please enter a valid email address");
      return;
    }

    startTransition(async () => {
      setError(null);

      try {
        const { getSupabase } = await import("@/services/supabase");
        const supabase = getSupabase();

        const redirectUrl = `${window.location.origin}${ROUTES.resetPin}`;

        const { error: resetErr } = await supabase.auth.resetPasswordForEmail(email, {
          redirectTo: redirectUrl,
        });

        if (resetErr) {
          setError(resetErr.message);
          return;
        }

        setSubmittedEmail(email);
      } catch (err: unknown) {
        const msg = err instanceof Error ? err.message : "Failed to send reset link.";
        setError(msg);
      }
    });
  }

  function handleKeyDown(e: React.KeyboardEvent) {
    if (e.key === "Enter") handleSendReset();
  }

  return (
    <div className="min-h-screen bg-[#080808] flex flex-col">
      <div className="p-6">
        <Logo size={40} />
      </div>

      <div className="flex-1 flex items-center justify-center px-4 py-8">
        <div className="w-full max-w-sm">
          <div className="rounded-2xl border border-[#1e1e1e] bg-[#141414] p-8">
            {!submittedEmail ? (
              <>
                <h1 className="text-white font-bold text-2xl mb-1">Forgot Pass PIN</h1>
                <p className="text-[#5a5a5a] text-sm mb-6">
                  Enter your registered email address and we&apos;ll send you a link to reset your 6-digit Pass PIN.
                </p>

                <div className="mb-4">
                  <label
                    htmlFor="forgot-email"
                    className="block text-[#a0a0a0] text-xs font-medium mb-1.5 uppercase tracking-wide"
                  >
                    Email Address
                  </label>
                  <input
                    id="forgot-email"
                    ref={emailRef}
                    type="email"
                    autoComplete="email"
                    autoFocus
                    className="input-base w-full"
                    onKeyDown={handleKeyDown}
                    disabled={isPending}
                  />
                </div>

                {error && (
                  <div className="flex items-start gap-2 mb-4 p-3 rounded-lg bg-[rgba(196,30,58,0.08)] border border-[rgba(196,30,58,0.2)]">
                    <AlertCircle size={14} className="text-[#c41e3a] mt-0.5 flex-shrink-0" />
                    <p className="text-[#c41e3a] text-xs">{error}</p>
                  </div>
                )}

                <button
                  type="button"
                  className="btn-primary w-full text-base py-3.5 justify-center"
                  id="forgot-submit"
                  onClick={handleSendReset}
                  disabled={isPending}
                >
                  {isPending ? (
                    <Loader2 size={16} className="animate-spin" />
                  ) : (
                    <ArrowRight size={16} />
                  )}
                  {isPending ? "Sending Link…" : "Send Reset Link"}
                </button>
              </>
            ) : (
              <>
                <h1 className="text-white font-bold text-2xl mb-1">Check Your Email</h1>
                <p className="text-[#5a5a5a] text-sm mb-4">
                  We sent a Pass PIN reset link to:
                </p>
                <p className="text-white font-semibold text-sm mb-6 bg-[#1a1a1a] border border-[#2a2a2a] rounded-lg px-4 py-2.5 break-all">
                  {submittedEmail}
                </p>
                <p className="text-[#a0a0a0] text-xs leading-relaxed mb-6">
                  Click the link inside the email to set your new 6-digit Pass PIN.
                </p>
              </>
            )}

            <p className="text-center text-[#5a5a5a] text-xs mt-6">
              Remember your PIN?{" "}
              <Link href={ROUTES.login} className="text-[#c41e3a] font-semibold hover:underline">
                Sign In
              </Link>
            </p>
          </div>

          <p className="text-center text-[#3a3a3a] text-xs mt-6">
            <Link href={ROUTES.home} className="hover:text-[#5a5a5a] transition-colors">
              ← Back to homepage
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
