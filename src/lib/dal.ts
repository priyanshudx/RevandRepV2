import "server-only";

import { cache } from "react";
import { redirect } from "next/navigation";
import { getSession } from "@/lib/session";
import { prisma } from "@/services/prisma";
import type { SessionPayload } from "@/lib/session";
import type { AuthUser } from "@/types";

// ── Session verification ───────────────────────────────────────────────────

/**
 * Verifies the current user's session cookie.
 * Redirects to /login if the session is missing or invalid.
 * Memoized per React render pass so multiple calls don't re-decrypt.
 */
export const verifySession = cache(async (): Promise<SessionPayload> => {
  const session = await getSession();

  if (!session?.userId) {
    redirect("/login");
  }

  return session;
});

/**
 * Returns the session payload WITHOUT redirecting.
 * Use this in layouts/pages that need optional auth (e.g., landing page).
 */
export const getOptionalSession = cache(
  async (): Promise<SessionPayload | null> => {
    return getSession();
  }
);

// ── User fetching ──────────────────────────────────────────────────────────

/**
 * Returns the full user record from the DB for the authenticated user.
 * Redirects to /login if the session is invalid.
 * Memoized per React render pass.
 */
export const getCurrentUser = cache(async (): Promise<AuthUser> => {
  const session = await verifySession();

  const user = await prisma.user.findUnique({
    where: { id: session.userId },
    select: {
      id: true,
      email: true,
      role: true,
      name: true,
      supabaseId: true,
    },
  });

  if (!user) {
    // Session exists but user was deleted — clean up and redirect
    redirect("/login");
  }

  return {
    id: user.id,
    email: user.email,
    role: user.role,
    name: user.name,
    supabaseId: user.supabaseId,
  };
});

/**
 * Verifies the session and checks if the user is an ADMIN.
 * Redirects to / if the user is not an admin.
 */
export const requireAdmin = cache(async (): Promise<AuthUser> => {
  const user = await getCurrentUser();

  if (user.role !== "ADMIN") {
    redirect("/");
  }

  return user;
});
