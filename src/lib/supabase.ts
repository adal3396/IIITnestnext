import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

/**
 * Shared Supabase client for use in client components.
 * Import this wherever you need to query the database.
 *
 * @example
 * import { supabase } from "@/lib/supabase";
 * const { data, error } = await supabase.from("children").select("*");
 */
export const supabase = createClient(supabaseUrl, supabaseAnonKey);
