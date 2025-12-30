import { createClient } from "@supabase/supabase-js";

const supabaseUrl =
  process.env.NEXT_PUBLIC_SUPABASE_URL ?? process.env.VITE_SUPABASE_URL;
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

/**
 * Server-only Supabase admin client with service role key.
 * This client has admin privileges and should NEVER be used on the client side.
 */
export const supabaseAdmin = (() => {
  if (!supabaseUrl || !supabaseServiceRoleKey) {
    // Return a mock client that will throw when used
    // This allows the module to load during build time
    return createClient("https://placeholder.supabase.co", "placeholder-key", {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    });
  }

  return createClient(supabaseUrl, supabaseServiceRoleKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  });
})();

export function validateSupabaseAdminConfig() {
  if (!supabaseUrl || !supabaseServiceRoleKey) {
    throw new Error(
      "Missing Supabase env vars: NEXT_PUBLIC_SUPABASE_URL (or VITE_SUPABASE_URL) and SUPABASE_SERVICE_ROLE_KEY"
    );
  }
}
