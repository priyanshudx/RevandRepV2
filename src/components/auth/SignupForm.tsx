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
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
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
      setSuccessMsg(null);

      try {
        const res = await signUpUserAction(name, email, pin, redirectTo);

        if (!res.success) {
          setError(res.error);
          return;
        }

        if (res.message) {
          // Email verification required
          setSuccessMsg(res.message);
          // Optional: clear form
          if (pinRef.current) pinRef.current.value = "";
          if (confirmPinRef.current) confirmPinRef.current.value = "";
          return;
        }

        if (res.user) {
          const destination = res.user.role === "ADMIN" ? ROUTES.admin : redirectTo;
          router.replace(destination);
        }
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
    <div className="min-h-screen bg-[#080808] flex flex-col md:flex-row relative overflow-hidden">
      {/* Background Image for mobile/tablet */}
      <div
        className="absolute inset-0 bg-cover bg-center opacity-20 md:hidden pointer-events-none"
        style={{ backgroundImage: `url('/auth-bg-car-workout.png')` }}
      />

      {/* Desktop Left Side Banner with Car-Engine Gym Image */}
      <div className="hidden md:flex md:w-1/2 lg:w-3/5 relative bg-[#080808] flex-col justify-between p-12 overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center opacity-65 transition-transform duration-700 hover:scale-105"
          style={{ backgroundImage: `url('/auth-bg-car-workout.png')` }}
        />
        {/* Soft edge blend overlays */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#080808] via-[#080808]/30 to-[#080808]/80 pointer-events-none" />
        <div className="absolute inset-0 bg-gradient-to-r from-[#080808]/50 via-transparent to-[#080808] pointer-events-none" />

        <div className="relative z-10">
          <Logo size={44} />
        </div>

        <div className="relative z-10 max-w-xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#c41e3a]/20 border border-[#c41e3a]/40 text-[#c41e3a] text-xs font-semibold uppercase tracking-wider mb-4">
            Engineered Excellence
          </div>
          <h2 className="text-white font-black text-3xl lg:text-4xl tracking-tight leading-tight mb-3">
            RAW POWER. <br />
            <span className="text-[#c41e3a]">PURE PRECISION.</span>
          </h2>
          <p className="text-[#a0a0a0] text-sm leading-relaxed">
            Create your account to unlock your customized Indian diet plan delivered directly to your dashboard.
          </p>
        </div>
      </div>

      {/* Right Side Form Container */}
      <div className="flex-1 flex flex-col justify-between p-6 md:p-12 relative z-10 bg-[#080808]/90 md:bg-[#080808] backdrop-blur-md md:backdrop-blur-none">
        <div className="md:hidden mb-6">
          <Logo size={40} />
        </div>

        <div className="my-auto w-full max-w-sm mx-auto">
          {/* Card */}
          <div className="rounded-2xl border border-[#1e1e1e] bg-[#141414]/90 md:bg-[#141414] p-8 shadow-2xl">
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

            {/* Success */}
            {successMsg && (
              <div className="flex items-start gap-2 mb-4 p-3 rounded-lg bg-[rgba(34,197,94,0.08)] border border-[rgba(34,197,94,0.2)]">
                <AlertCircle size={14} className="text-green-500 mt-0.5 flex-shrink-0" />
                <p className="text-green-500 text-xs">{successMsg}</p>
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
