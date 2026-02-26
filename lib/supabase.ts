import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

// During build time on CI/CD platforms, these variables might be missing.
// We use a placeholder to allow the build to complete, but we must ensure
// that components handle null data gracefully.
const isBuildTime = process.env.NODE_ENV === 'production' && !supabaseUrl;

export const supabase = createClient(
  supabaseUrl || "https://placeholder.supabase.co",
  supabaseAnonKey || "placeholder"
);

if (!isBuildTime && (!supabaseUrl || !supabaseAnonKey)) {
  console.warn("Supabase environment variables are missing. Database features will not work.");
}
