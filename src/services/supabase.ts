import { createClient, type SupabaseClient } from "@supabase/supabase-js";

// ── Lazy client singletons ─────────────────────────────────────────────────
// Clients are instantiated on first use, not at module load time.
// This prevents build-time failures when env vars are not yet set.

let _supabase: SupabaseClient | null = null;
let _supabaseAdmin: SupabaseClient | null = null;

export const DIET_BUCKET = process.env.SUPABASE_DIET_BUCKET ?? "diet-plans";

function getSupabaseUrl(): string {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  if (!url) throw new Error("NEXT_PUBLIC_SUPABASE_URL is not set.");
  return url;
}

/** Public Supabase client — safe for browser usage */
export function getSupabase(): SupabaseClient {
  if (!_supabase) {
    const anonKey =
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
      process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;
    if (!anonKey)
      throw new Error(
        "Neither NEXT_PUBLIC_SUPABASE_ANON_KEY nor NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY is set."
      );
    _supabase = createClient(getSupabaseUrl(), anonKey);
  }
  return _supabase;
}

/** Admin Supabase client — server-side only, bypasses RLS */
export function getSupabaseAdmin(): SupabaseClient {
  if (!_supabaseAdmin) {
    const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
    if (!serviceKey) throw new Error("SUPABASE_SERVICE_ROLE_KEY is not set.");
    _supabaseAdmin = createClient(getSupabaseUrl(), serviceKey, {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    });
  }
  return _supabaseAdmin;
}

// ── Legacy named exports (kept for backward compatibility) ─────────────────
// These are getters so they also don't instantiate until accessed.

export const supabase = new Proxy({} as SupabaseClient, {
  get(_target, prop) {
    return (getSupabase() as unknown as Record<string | symbol, unknown>)[prop];
  },
});

export const supabaseAdmin = new Proxy({} as SupabaseClient, {
  get(_target, prop) {
    return (getSupabaseAdmin() as unknown as Record<string | symbol, unknown>)[prop];
  },
});

// ── Storage helpers ────────────────────────────────────────────────────────

/**
 * Generate a signed download URL for a diet file.
 * Expires in 1 hour by default.
 */
export async function getSignedUrl(
  path: string,
  expiresInSeconds = 3600
): Promise<string> {
  const { data, error } = await getSupabaseAdmin().storage
    .from(DIET_BUCKET)
    .createSignedUrl(path, expiresInSeconds);

  if (error || !data?.signedUrl) {
    throw new Error(`Failed to generate signed URL: ${error?.message}`);
  }

  return data.signedUrl;
}

/**
 * Delete a file from Supabase Storage.
 */
export async function deleteFile(path: string): Promise<void> {
  const { error } = await getSupabaseAdmin().storage
    .from(DIET_BUCKET)
    .remove([path]);

  if (error) {
    throw new Error(`Failed to delete file: ${error.message}`);
  }
}
