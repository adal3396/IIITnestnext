import { createClient } from "@supabase/supabase-js";

/**
 * Admin Supabase client for use in server-side API routes ONLY.
 * It uses the service_role key to bypass rate limits and auto-confirm users.
 */
export function getSupabaseAdmin() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseUrl || !supabaseServiceRoleKey) {
    throw new Error("Supabase Admin credentials (URL or Service Role Key) are missing from environment.");
  }

  return createClient(supabaseUrl, supabaseServiceRoleKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false
    }
  });
}
