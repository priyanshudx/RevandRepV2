"use server";

import { redirect } from "next/navigation";
import { getSupabaseAdmin } from "@/services/supabase";
import { prisma } from "@/services/prisma";
import { createSession, deleteSession, getSession } from "@/lib/session";
import { isAdminEmail } from "@/lib/utils";
import type { AuthUser } from "@/types";

// ── signUpUserAction ──────────────────────────────────────────────────────

/**
 * Creates a user in Supabase Auth,
 * creates their record in Prisma Postgres DB, and sets the HttpOnly session cookie if auto-confirmed.
 */
export async function signUpUserAction(
  name: string,
  email: string,
  pin: string
): Promise<{ success: true; user?: AuthUser; message?: string } | { success: false; error: string }> {
  try {
    const cleanEmail = email.trim().toLowerCase();
    const { getSupabase } = await import("@/services/supabase");
    const supabase = getSupabase();

    const { data: createdData, error: createErr } = await supabase.auth.signUp({
      email: cleanEmail,
      password: pin,
      options: {
        data: { name: name.trim() },
      },
    });

    let supabaseId = createdData?.user?.id;

    if (createErr || !supabaseId) {
      if (createErr) {
        return { success: false, error: createErr.message };
      }
      return { success: false, error: "Failed to create account. Please try again." };
    }

    // 2. Determine role
    const role = isAdminEmail(cleanEmail) ? ("ADMIN" as const) : ("USER" as const);

    // 3. Upsert user in Postgres DB by email
    const user = await prisma.user.upsert({
      where: { email: cleanEmail },
      update: {
        supabaseId,
        name: name.trim(),
        role,
        updatedAt: new Date(),
      },
      create: {
        email: cleanEmail,
        supabaseId,
        name: name.trim(),
        role,
      },
      select: {
        id: true,
        email: true,
        role: true,
        name: true,
        supabaseId: true,
      },
    });

    if (createdData.session) {
      // 4. Create HttpOnly session cookie
      await createSession(user.id, user.role, user.email);
      return {
        success: true,
        user: {
          id: user.id,
          email: user.email,
          role: user.role,
          name: user.name,
          supabaseId: user.supabaseId,
        },
      };
    } else {
      return {
        success: true,
        message: "Please check your email to verify your account.",
      };
    }
  } catch (err) {
    const message = err instanceof Error ? err.message : "Signup failed.";
    console.error("[signUpUserAction]", message);
    return { success: false, error: message };
  }
}

// ── verifySupabaseTokenAction ─────────────────────────────────────────────

/**
 * Verifies a Supabase access token on the server, upserts the user in Postgres,
 * and creates an HttpOnly session cookie.
 */
export async function verifySupabaseTokenAction(
  accessToken: string,
  userName?: string
): Promise<{ success: true; user: AuthUser } | { success: false; error: string }> {
  try {
    // 1. Verify the access token with Supabase Admin
    const {
      data: { user: supabaseUser },
      error,
    } = await getSupabaseAdmin().auth.getUser(accessToken);

    if (error || !supabaseUser) {
      return {
        success: false,
        error: error?.message ?? "Invalid or expired session. Please try again.",
      };
    }

    const cleanEmail = supabaseUser.email?.toLowerCase();
    if (!cleanEmail) {
      return { success: false, error: "Email not found in token." };
    }

    const supabaseId = supabaseUser.id;
    const resolvedName = userName || (supabaseUser.user_metadata?.name as string) || undefined;

    // 2. Determine role
    const role = isAdminEmail(cleanEmail) ? ("ADMIN" as const) : ("USER" as const);

    // 3. Upsert user in Postgres DB by email (avoids unique constraint mismatches)
    const user = await prisma.user.upsert({
      where: { email: cleanEmail },
      update: {
        supabaseId,
        role,
        ...(resolvedName ? { name: resolvedName } : {}),
        updatedAt: new Date(),
      },
      create: {
        email: cleanEmail,
        supabaseId,
        role,
        ...(resolvedName ? { name: resolvedName } : {}),
      },
      select: {
        id: true,
        email: true,
        role: true,
        name: true,
        supabaseId: true,
      },
    });

    // 4. Create server session cookie
    await createSession(user.id, user.role, user.email);

    return {
      success: true,
      user: {
        id: user.id,
        email: user.email,
        role: user.role,
        name: user.name,
        supabaseId: user.supabaseId,
      },
    };
  } catch (err) {
    const message = err instanceof Error ? err.message : "Authentication failed.";
    console.error("[verifySupabaseTokenAction]", message);
    return { success: false, error: message };
  }
}

// ── loginUserWithPinAction ────────────────────────────────────────────────

/**
 * Server-side login helper.
 */
export async function loginUserWithPinAction(
  email: string,
  pin: string
): Promise<{ success: true; user: AuthUser } | { success: false; error: string }> {
  try {
    const cleanEmail = email.trim().toLowerCase();

    // 1. Fast indexed database check (~2ms)
    const existingDbUser = await prisma.user.findUnique({
      where: { email: cleanEmail },
      select: { id: true },
    });

    if (!existingDbUser) {
      return {
        success: false,
        error: "Your account is not registered. Please create an account.",
      };
    }

    // 2. Verify credentials by signing in via Supabase
    const { getSupabase } = await import("@/services/supabase");
    const { data, error } = await getSupabase().auth.signInWithPassword({
      email: cleanEmail,
      password: pin,
    });

    if (error || !data.session) {
      const errMsg = error?.message?.toLowerCase() ?? "";
      if (errMsg.includes("email not confirmed") || errMsg.includes("not confirmed")) {
        return {
          success: false,
          error: "Please verify your email address before signing in.",
        };
      }

      return {
        success: false,
        error: "Incorrect 6-digit Pass PIN. Please try again.",
      };
    }

    const role = isAdminEmail(cleanEmail) ? ("ADMIN" as const) : ("USER" as const);

    // 3. Create server session cookie directly (avoids redundant 2nd Supabase network roundtrip)
    await createSession(existingDbUser.id, role, cleanEmail);

    return {
      success: true,
      user: {
        id: existingDbUser.id,
        email: cleanEmail,
        role,
      },
    };
  } catch (err) {
    const message = err instanceof Error ? err.message : "Login failed.";
    return { success: false, error: message };
  }
}

// ── getSessionUserAction ──────────────────────────────────────────────────

/**
 * Returns the current session payload (userId, role, email) or null.
 */
export async function getSessionUserAction(): Promise<{
  userId: string;
  role: string;
  email: string;
} | null> {
  const session = await getSession();
  if (!session) return null;
  return { userId: session.userId, role: session.role, email: session.email };
}

// ── signOutAction ─────────────────────────────────────────────────────────

/**
 * Deletes the server session cookie and redirects to /login.
 */
export async function signOutAction(): Promise<void> {
  await deleteSession();
  redirect("/login");
}
