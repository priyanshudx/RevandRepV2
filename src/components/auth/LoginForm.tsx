"use client";

import { useRef, useState, useTransition } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { Mail, Lock, ArrowRight, Loader2, AlertCircle, Eye, EyeOff } from "lucide-react";
import { ROUTES } from "@/lib/constants";
import { Logo } from "@/components/shared/Logo";
import { loginSchema } from "@/lib/validations";
import { loginUserWithPinAction } from "@/actions/auth";

export function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectTo = searchParams.get("redirect") ?? ROUTES.dashboard;

  const emailRef = useRef<HTMLInputElement>(null);
  const pinRef = useRef<HTMLInputElement>(null);

  const [showPin, setShowPin] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  function handleLogin() {
    const email = emailRef.current?.value.trim() ?? "";
    const pin = pinRef.current?.value.trim() ?? "";

    const validation = loginSchema.safeParse({ email, pin });
    if (!validation.success) {
      const firstError = validation.error.errors[0]?.message ?? "Invalid login credentials";
      setError(firstError);
      return;
    }

    startTransition(async () => {
      setError(null);

      try {
        const res = await loginUserWithPinAction(email, pin);

        if (!res.success) {
          setError(res.error);
          return;
        }

        // Redirect user based on role
        const destination = res.user.role === "ADMIN" ? ROUTES.admin : redirectTo;
        router.replace(destination);
      } catch (err: unknown) {
        const msg = err instanceof Error ? err.message : "Login failed. Please try again.";
        setError(msg);
      }
    });
  }

  function handleKeyDown(e: React.KeyboardEvent) {
    if (e.key === "Enter") handleLogin();
  }

  return (
    <div className="min-h-screen bg-[#080808] flex flex-col md:flex-row relative overflow-hidden">
      {/* Background Image for mobile/tablet */}
      <div
        className="absolute inset-0 bg-cover bg-center opacity-20 md:hidden pointer-events-none"
        style={{ backgroundImage: `url('/auth-bg-car-gym.png')` }}
      />

      {/* Desktop Left Side Banner with Car-Gym Image */}
      <div className="hidden md:flex md:w-1/2 lg:w-3/5 relative bg-[#080808] flex-col justify-between p-12 overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center opacity-65 transition-transform duration-700 hover:scale-105"
          style={{ backgroundImage: `url('/auth-bg-car-gym.png')` }}
        />
        {/* Soft edge blend overlays */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#080808] via-[#080808]/30 to-[#080808]/80 pointer-events-none" />
        <div className="absolute inset-0 bg-gradient-to-r from-[#080808]/50 via-transparent to-[#080808] pointer-events-none" />

        <div className="relative z-10">
          <Logo size={44} />
        </div>

        <div className="relative z-10 max-w-xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#c41e3a]/20 border border-[#c41e3a]/40 text-[#c41e3a] text-xs font-semibold uppercase tracking-wider mb-4">
            High Performance Fitness
          </div>
          <h2 className="text-white font-black text-3xl lg:text-4xl tracking-tight leading-tight mb-3">
            FUEL YOUR BODY. <br />
            <span className="text-[#c41e3a]">REV YOUR LIFE.</span>
          </h2>
          <p className="text-[#a0a0a0] text-sm leading-relaxed">
            Personalized Indian Diet Plans engineered for maximum power, energy, and rapid transformation.
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
            <h1 className="text-white font-bold text-2xl mb-1">Welcome Back</h1>
            <p className="text-[#5a5a5a] text-sm mb-6">
              Enter your email and 6-digit Pass PIN to sign in.
            </p>

            {/* Email input */}
            <div className="mb-4">
              <label
                htmlFor="login-email"
                className="block text-[#a0a0a0] text-xs font-medium mb-1.5 uppercase tracking-wide"
              >
                Email Address
              </label>
              <input
                id="login-email"
                ref={emailRef}
                type="email"
                autoComplete="email"
                autoFocus
                className="input-base w-full"
                disabled={isPending}
              />
            </div>

            {/* Pass PIN input */}
            <div className="mb-2">
              <div className="flex items-center justify-between mb-1.5">
                <label
                  htmlFor="login-pin"
                  className="block text-[#a0a0a0] text-xs font-medium uppercase tracking-wide"
                >
                  6-Digit Pass PIN
                </label>
                <Link
                  href={ROUTES.forgotPin}
                  className="text-xs text-[#c41e3a] hover:underline font-medium"
                >
                  Forgot PIN?
                </Link>
              </div>
              <div className="relative">
                <input
                  id="login-pin"
                  ref={pinRef}
                  type={showPin ? "text" : "password"}
                  inputMode="numeric"
                  maxLength={6}
                  className="input-base text-center text-lg tracking-[0.4em] w-full pr-10"
                  onKeyDown={handleKeyDown}
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

            {/* Error */}
            {error && (
              <div className="flex items-start gap-2 my-4 p-3 rounded-lg bg-[rgba(196,30,58,0.08)] border border-[rgba(196,30,58,0.2)]">
                <AlertCircle size={14} className="text-[#c41e3a] mt-0.5 flex-shrink-0" />
                <p className="text-[#c41e3a] text-xs">{error}</p>
              </div>
            )}

            {/* Submit button */}
            <button
              type="button"
              className="btn-primary w-full text-base py-3.5 justify-center mt-4"
              id="login-submit"
              onClick={handleLogin}
              disabled={isPending}
            >
              {isPending ? (
                <Loader2 size={16} className="animate-spin" />
              ) : (
                <ArrowRight size={16} />
              )}
              {isPending ? "Signing In…" : "Sign In"}
            </button>

            <p className="text-center text-[#5a5a5a] text-xs mt-6">
              Don&apos;t have an account?{" "}
              <Link href={ROUTES.signup} className="text-[#c41e3a] font-semibold hover:underline">
                Sign Up
              </Link>
            </p>
          </div>

          {/* Back */}
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
