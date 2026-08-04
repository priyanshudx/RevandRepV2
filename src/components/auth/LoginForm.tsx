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
    <div className="min-h-screen bg-[#080808] flex flex-col">
      {/* Top bar */}
      <div className="p-6">
        <Logo size={40} />
      </div>

      {/* Center form */}
      <div className="flex-1 flex items-center justify-center px-4 py-8">
        <div className="w-full max-w-sm">
          {/* Card */}
          <div className="rounded-2xl border border-[#1e1e1e] bg-[#141414] p-8">
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
