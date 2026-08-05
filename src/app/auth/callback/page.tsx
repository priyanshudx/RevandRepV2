"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Loader2, AlertCircle } from "lucide-react";
import { verifySupabaseTokenAction } from "@/actions/auth";
import { ROUTES } from "@/lib/constants";
import { Logo } from "@/components/shared/Logo";

export default function AuthCallbackPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const rawRedirect = searchParams.get("redirect");
  const redirectTo = rawRedirect ? decodeURIComponent(rawRedirect) : ROUTES.dashboard;

  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;

    async function handleAuthCallback() {
      try {
        const { getSupabase } = await import("@/services/supabase");
        const supabase = getSupabase();

        // Check if this callback is for password recovery
        const typeParam = searchParams.get("type");
        const nextParam = searchParams.get("next");
        const isRecovery = typeParam === "recovery" || nextParam?.includes("reset-pin");

        // 1. Check if there's a code or token_hash parameter in the URL query string
        const code = searchParams.get("code");
        const tokenHash = searchParams.get("token_hash");

        if (code) {
          const { data, error: exchangeErr } = await supabase.auth.exchangeCodeForSession(code);
          if (exchangeErr || !data.session) {
            if (mounted) setError(exchangeErr?.message ?? "Failed to verify reset link.");
            return;
          }

          if (isRecovery) {
            router.replace(ROUTES.resetPin);
            return;
          }

          const res = await verifySupabaseTokenAction(data.session.access_token);
          if (!res.success) {
            if (mounted) setError(res.error);
            return;
          }

          const target = res.user.role === "ADMIN" ? ROUTES.admin : redirectTo;
          router.replace(target);
          return;
        }

        if (tokenHash && typeParam) {
          const { data, error: verifyErr } = await supabase.auth.verifyOtp({
            token_hash: tokenHash,
            type: typeParam as any,
          });
          if (verifyErr || !data.session) {
            if (mounted) setError(verifyErr?.message ?? "Failed to verify email link.");
            return;
          }

          if (isRecovery) {
            router.replace(ROUTES.resetPin);
            return;
          }

          const res = await verifySupabaseTokenAction(data.session.access_token);
          if (!res.success) {
            if (mounted) setError(res.error);
            return;
          }

          const target = res.user.role === "ADMIN" ? ROUTES.admin : redirectTo;
          router.replace(target);
          return;
        }

        // 2. Otherwise check existing active session (e.g. from hash fragment or implicit flow)
        const { data: sessionData, error: sessionErr } = await supabase.auth.getSession();
        if (sessionErr || !sessionData.session) {
          // Listen to onAuthStateChange for hash fragment token parsing
          const { data: authListener } = supabase.auth.onAuthStateChange(async (event, session) => {
            if (session?.access_token) {
              if (event === "PASSWORD_RECOVERY" || isRecovery) {
                router.replace(ROUTES.resetPin);
                return;
              }

              const res = await verifySupabaseTokenAction(session.access_token);
              if (res.success) {
                const target = res.user.role === "ADMIN" ? ROUTES.admin : redirectTo;
                router.replace(target);
              } else if (mounted) {
                setError(res.error);
              }
            }
          });

          // Timeout fallback if no token found
          setTimeout(() => {
            authListener.subscription.unsubscribe();
            if (mounted && !error) {
              setError("Authentication link expired or invalid. Please try logging in again.");
            }
          }, 6000);
          return;
        }

        // 3. Verify session access token on server & set session cookie
        const res = await verifySupabaseTokenAction(sessionData.session.access_token);
        if (!res.success) {
          if (mounted) setError(res.error);
          return;
        }

        const target = res.user.role === "ADMIN" ? ROUTES.admin : redirectTo;
        router.replace(target);
      } catch (err: unknown) {
        if (mounted) {
          setError(err instanceof Error ? err.message : "Authentication error.");
        }
      }
    }

    handleAuthCallback();

    return () => {
      mounted = false;
    };
  }, [router, searchParams, redirectTo, error]);

  return (
    <div className="min-h-screen bg-[#080808] flex items-center justify-center p-4">
      <div className="w-full max-w-sm rounded-2xl border border-[#1e1e1e] bg-[#141414] p-8 text-center">
        <div className="flex justify-center mb-6">
          <Logo size={40} />
        </div>

        {error ? (
          <div className="space-y-4">
            <div className="w-12 h-12 rounded-xl bg-[rgba(196,30,58,0.1)] border border-[rgba(196,30,58,0.2)] flex items-center justify-center mx-auto text-[#c41e3a]">
              <AlertCircle size={22} />
            </div>
            <h1 className="text-white font-bold text-lg">Verification Failed</h1>
            <p className="text-[#a0a0a0] text-xs leading-relaxed">{error}</p>
            <button
              onClick={() => router.replace(ROUTES.login)}
              className="btn-primary w-full py-2.5 text-sm justify-center mt-4"
            >
              Back to Login
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            <Loader2 size={32} className="animate-spin text-[#c41e3a] mx-auto" />
            <h1 className="text-white font-bold text-lg">Verifying your login…</h1>
            <p className="text-[#5a5a5a] text-xs">
              Please wait while we log you into Rev &amp; Rep.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
