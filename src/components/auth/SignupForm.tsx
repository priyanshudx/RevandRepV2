"use client";

import { useRef, useState, useTransition } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { User, Mail, Lock, ArrowRight, Loader2, AlertCircle, Eye, EyeOff } from "lucide-react";
import { ROUTES } from "@/lib/constants";
import { Logo } from "@/components/shared/Logo";
import { signupSchema } from "@/lib/validations";
import { signUpUserAction } from "@/actions/auth";

export function SignupForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectTo = searchParams.get("redirect") ?? ROUTES.dashboard;

  const nameRef = useRef<HTMLInputElement>(null);
  const emailRef = useRef<HTMLInputElement>(null);
  const pinRef = useRef<HTMLInputElement>(null);
  const confirmPinRef = useRef<HTMLInputElement>(null);

  const [showPin, setShowPin] = useState(false);
  const [showConfirmPin, setShowConfirmPin] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  function handleSignup() {
    const name = nameRef.current?.value.trim() ?? "";
    const email = emailRef.current?.value.trim() ?? "";
    const pin = pinRef.current?.value.trim() ?? "";
    const confirmPin = confirmPinRef.current?.value.trim() ?? "";

    const validation = signupSchema.safeParse({ name, email, pin, confirmPin });
    if (!validation.success) {
      const firstError = validation.error.errors[0]?.message ?? "Invalid form input";
      setError(firstError);
      return;
    }

    startTransition(async () => {
      setError(null);

      try {
        const res = await signUpUserAction(name, email, pin);

        if (!res.success) {
          setError(res.error);
          return;
        }

        const destination = res.user.role === "ADMIN" ? ROUTES.admin : redirectTo;
        router.replace(destination);
      } catch (err: unknown) {
        const msg = err instanceof Error ? err.message : "Signup failed. Please try again.";
        setError(msg);
      }
    });
  }

  function handleKeyDown(e: React.KeyboardEvent) {
    if (e.key === "Enter") handleSignup();
  }

  return (
    <div className="min-h-screen bg-[#080808] flex flex-col">
      <div className="p-6">
        <Logo size={40} />
      </div>

      <div className="flex-1 flex items-center justify-center px-4 py-8">
        <div className="w-full max-w-sm">
          <div className="rounded-2xl border border-[#1e1e1e] bg-[#141414] p-8">
            <h1 className="text-white font-bold text-2xl mb-1">Create Account</h1>
            <p className="text-[#5a5a5a] text-sm mb-6">
              Enter your details and choose a 6-digit Pass PIN.
            </p>

            {/* Name */}
            <div className="mb-4">
              <label
                htmlFor="signup-name"
                className="block text-[#a0a0a0] text-xs font-medium mb-1.5 uppercase tracking-wide"
              >
                Full Name
              </label>
              <input
                id="signup-name"
                ref={nameRef}
                type="text"
                autoComplete="name"
                className="input-base w-full"
                disabled={isPending}
              />
            </div>

            {/* Email */}
            <div className="mb-4">
              <label
                htmlFor="signup-email"
                className="block text-[#a0a0a0] text-xs font-medium mb-1.5 uppercase tracking-wide"
              >
                Email Address
              </label>
              <input
                id="signup-email"
                ref={emailRef}
                type="email"
                autoComplete="email"
                className="input-base w-full"
                disabled={isPending}
              />
            </div>

            {/* 6-Digit Pass PIN */}
            <div className="mb-4">
              <label
                htmlFor="signup-pin"
                className="block text-[#a0a0a0] text-xs font-medium mb-1.5 uppercase tracking-wide"
              >
                6-Digit Pass PIN
              </label>
              <div className="relative">
                <input
                  id="signup-pin"
                  ref={pinRef}
                  type={showPin ? "text" : "password"}
                  inputMode="numeric"
                  maxLength={6}
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

            {/* Confirm 6-Digit Pass PIN */}
            <div className="mb-6">
              <label
                htmlFor="signup-confirm-pin"
                className="block text-[#a0a0a0] text-xs font-medium mb-1.5 uppercase tracking-wide"
              >
                Confirm 6-Digit Pass PIN
              </label>
              <div className="relative">
                <input
                  id="signup-confirm-pin"
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

            {/* Error */}
            {error && (
              <div className="flex items-start gap-2 mb-4 p-3 rounded-lg bg-[rgba(196,30,58,0.08)] border border-[rgba(196,30,58,0.2)]">
                <AlertCircle size={14} className="text-[#c41e3a] mt-0.5 flex-shrink-0" />
                <p className="text-[#c41e3a] text-xs">{error}</p>
              </div>
            )}

            {/* Submit button */}
            <button
              type="button"
              className="btn-primary w-full text-base py-3.5 justify-center"
              id="signup-submit"
              onClick={handleSignup}
              disabled={isPending}
            >
              {isPending ? (
                <Loader2 size={16} className="animate-spin" />
              ) : (
                <ArrowRight size={16} />
              )}
              {isPending ? "Creating Account…" : "Create Account"}
            </button>

            <p className="text-center text-[#5a5a5a] text-xs mt-6">
              Already have an account?{" "}
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
