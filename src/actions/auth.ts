"use server";

import { redirect } from "next/navigation";
import { getSupabaseAdmin } from "@/services/supabase";
import { prisma } from "@/services/prisma";
import { createSession, deleteSession, getSession } from "@/lib/session";
import { isAdminEmail } from "@/lib/utils";
import type { AuthUser } from "@/types";

// ── signUpUserAction ──────────────────────────────────────────────────────

/**
 * Creates and auto-confirms a user in Supabase Auth using the Admin SDK,
 * creates their record in Prisma Postgres DB, and sets the HttpOnly session cookie.
 */
export async function signUpUserAction(
  name: string,
  email: string,
  pin: string
): Promise<{ success: true; user: AuthUser } | { success: false; error: string }> {
  try {
    const admin = getSupabaseAdmin();
    const cleanEmail = email.trim().toLowerCase();

    // 1. Create user in Supabase Auth with auto-confirmed email
    const { data: createdData, error: createErr } = await admin.auth.admin.createUser({
      email: cleanEmail,
      password: pin,
      email_confirm: true,
      user_metadata: { name: name.trim() },
    });

    let supabaseId = createdData?.user?.id;

    if (createErr || !supabaseId) {
      // If user already exists in Supabase Auth, check if they exist and update password/confirm email
      const { data: listData } = await admin.auth.admin.listUsers();
      const existingUser = listData.users.find(
        (u) => u.email?.toLowerCase() === cleanEmail
      );

      if (existingUser) {
        supabaseId = existingUser.id;
        await admin.auth.admin.updateUserById(supabaseId, {
          password: pin,
          email_confirm: true,
          user_metadata: { name: name.trim() },
        });
      } else {
        return {
          success: false,
          error: createErr?.message ?? "Failed to create account. Please try again.",
        };
      }
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
 * Server-side login helper that auto-confirms user's email if unconfirmed
 * before attempting login.
 */
export async function loginUserWithPinAction(
  email: string,
  pin: string
): Promise<{ success: true; user: AuthUser } | { success: false; error: string }> {
  try {
    const admin = getSupabaseAdmin();
    const cleanEmail = email.trim().toLowerCase();

    // Auto-confirm user email if it exists in Supabase Auth but is not confirmed yet
    const { data: listData } = await admin.auth.admin.listUsers();
    const existingUser = listData.users.find(
      (u) => u.email?.toLowerCase() === cleanEmail
    );

    if (existingUser && !existingUser.email_confirmed_at) {
      await admin.auth.admin.updateUserById(existingUser.id, {
        email_confirm: true,
      });
    }

    // Now verify credentials by signing in
    const { getSupabase } = await import("@/services/supabase");
    const { data, error } = await getSupabase().auth.signInWithPassword({
      email: cleanEmail,
      password: pin,
    });

    if (error || !data.session) {
      return {
        success: false,
        error: error?.message ?? "Invalid email or 6-digit Pass PIN.",
      };
    }

    return await verifySupabaseTokenAction(data.session.access_token);
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
