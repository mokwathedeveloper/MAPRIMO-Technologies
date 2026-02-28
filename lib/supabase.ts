import { createClient } from "@supabase/supabase-js";
import { logger } from "./logger";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  // We log but do not throw at module level to prevent total application crash on import.
  // Server Components using this will receive a descriptive error during the actual fetch call.
  if (process.env.NODE_ENV === 'production') {
    logger.error("CRITICAL: Supabase environment variables are missing in production.");
  }
}

// Fallback to a valid URL format if missing, to allow client initialization without immediate crash during build/prerender.
// Actual requests will fail gracefully with a connection error or be caught by middleware.
export const supabase = createClient(
  supabaseUrl || "https://disabled.supabase.co", 
  supabaseAnonKey || "disabled"
);

/**
 * Helper for creating a Supabase client in Server Components with proper error handling.
 */
export function createServerSupabase(cookieStore: any) {
  if (!supabaseUrl || !supabaseAnonKey) {
    return null;
  }

  return createServerClient(
    supabaseUrl,
    supabaseAnonKey,
    {
      cookies: {
        get(name: string) {
          return cookieStore.get(name)?.value;
        },
      },
    }
  );
}

import { createServerClient } from "@supabase/auth-helpers-nextjs";
