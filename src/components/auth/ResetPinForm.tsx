"use client";

import { useEffect, useRef, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Lock, ArrowRight, Loader2, AlertCircle, CheckCircle, Eye, EyeOff } from "lucide-react";
import { ROUTES } from "@/lib/constants";
import { Logo } from "@/components/shared/Logo";
import { resetPinSchema } from "@/lib/validations";
import { verifySupabaseTokenAction } from "@/actions/auth";

export function ResetPinForm() {
  const router = useRouter();

  const pinRef = useRef<HTMLInputElement>(null);
  const confirmPinRef = useRef<HTMLInputElement>(null);

  const [showPin, setShowPin] = useState(false);
  const [showConfirmPin, setShowConfirmPin] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [isPending, startTransition] = useTransition();

  useEffect(() => {
    // When landing on /reset-pin via reset link, Supabase parses tokens from hash or code
    async function checkAuthSession() {
      try {
        const { getSupabase } = await import("@/services/supabase");
        const supabase = getSupabase();
        const { data } = await supabase.auth.getSession();
        if (!data.session) {
          setError("Reset session expired or invalid. Please request a new reset link.");
        }
      } catch {
        setError("Error parsing reset session.");
      }
    }
    checkAuthSession();
  }, []);

  function handleResetPin() {
    const pin = pinRef.current?.value.trim() ?? "";
    const confirmPin = confirmPinRef.current?.value.trim() ?? "";

    const validation = resetPinSchema.safeParse({ pin, confirmPin });
    if (!validation.success) {
      setError(validation.error.errors[0]?.message ?? "Invalid Pass PIN");
      return;
    }

    startTransition(async () => {
      setError(null);

      try {
        const { getSupabase } = await import("@/services/supabase");
        const supabase = getSupabase();

        // Update the password in Supabase Auth to the new 6-digit PIN
        const { error: updateErr } = await supabase.auth.updateUser({
          password: pin,
        });

        if (updateErr) {
          setError(updateErr.message);
          return;
        }

        // Sign out recovery session cleanly so user logs in with new credentials
        await supabase.auth.signOut();

        setSuccess(true);
        setTimeout(() => {
          router.replace(`${ROUTES.login}?reset=success`);
        }, 2000);
      } catch (err: unknown) {
        const msg = err instanceof Error ? err.message : "Failed to reset Pass PIN.";
        setError(msg);
      }
    });
  }

  function handleKeyDown(e: React.KeyboardEvent) {
    if (e.key === "Enter") handleResetPin();
  }

  return (
    <div className="min-h-screen bg-[#080808] flex flex-col">
      <div className="p-6">
        <Logo size={40} />
      </div>

      <div className="flex-1 flex items-center justify-center px-4 py-8">
        <div className="w-full max-w-sm">
          <div className="rounded-2xl border border-[#1e1e1e] bg-[#141414] p-8">
            {!success ? (
              <>
                <h1 className="text-white font-bold text-2xl mb-1">Set New Pass PIN</h1>
                <p className="text-[#5a5a5a] text-sm mb-6">
                  Enter a new 6-digit Pass PIN for your account.
                </p>

                {/* New 6-Digit Pass PIN */}
                <div className="mb-4">
                  <label
                    htmlFor="reset-pin"
                    className="block text-[#a0a0a0] text-xs font-medium mb-1.5 uppercase tracking-wide"
                  >
                    New 6-Digit Pass PIN
                  </label>
                  <div className="relative">
                    <input
                      id="reset-pin"
                      ref={pinRef}
                      type={showPin ? "text" : "password"}
                      inputMode="numeric"
                      maxLength={6}
                      autoFocus
                      className="input-base text-center text-lg tracking-[0.4em] w-full pr-10"
                      disabled={isPending}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPin(!showPin)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-[#5a5a5a] hover:text-[#a0a0a0] transition-colors p-1"
                      aria-label={showPin ? "Hide Pass PIN" : "Show Pass PIN"}
                      tabIndex={-1}
                    >
                      {showPin ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                  </div>
                </div>

                {/* Confirm New Pass PIN */}
                <div className="mb-6">
                  <label
                    htmlFor="reset-confirm-pin"
                    className="block text-[#a0a0a0] text-xs font-medium mb-1.5 uppercase tracking-wide"
                  >
                    Confirm New Pass PIN
                  </label>
                  <div className="relative">
                    <input
                      id="reset-confirm-pin"
                      ref={confirmPinRef}
                      type={showConfirmPin ? "text" : "password"}
                      inputMode="numeric"
                      maxLength={6}
                      className="input-base text-center text-lg tracking-[0.4em] w-full pr-10"
                      onKeyDown={handleKeyDown}
                      disabled={isPending}
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPin(!showConfirmPin)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-[#5a5a5a] hover:text-[#a0a0a0] transition-colors p-1"
                      aria-label={showConfirmPin ? "Hide Pass PIN" : "Show Pass PIN"}
                      tabIndex={-1}
                    >
                      {showConfirmPin ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                  </div>
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
                  id="reset-submit"
                  onClick={handleResetPin}
                  disabled={isPending}
                >
                  {isPending ? (
                    <Loader2 size={16} className="animate-spin" />
                  ) : (
                    <ArrowRight size={16} />
                  )}
                  {isPending ? "Updating PIN…" : "Update Pass PIN"}
                </button>
              </>
            ) : (
              <div className="text-center py-4">
                <div className="w-12 h-12 rounded-full bg-[rgba(34,197,94,0.1)] border border-[rgba(34,197,94,0.2)] flex items-center justify-center mx-auto text-[#22c55e] mb-4">
                  <CheckCircle size={24} />
                </div>
                <h1 className="text-white font-bold text-2xl mb-2">Pass PIN Updated!</h1>
                <p className="text-[#a0a0a0] text-xs leading-relaxed mb-4">
                  Your 6-digit Pass PIN has been updated successfully. Redirecting you to the sign-in page…
                </p>
                <div className="w-6 h-6 rounded-full border-2 border-[#c41e3a] border-t-transparent animate-spin mx-auto mt-2" />
              </div>
            )}

            <p className="text-center text-[#5a5a5a] text-xs mt-6">
              Back to{" "}
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
