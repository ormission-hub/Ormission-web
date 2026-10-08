import { createClient as createSupabaseClient } from "@supabase/supabase-js";

let publicClient: any = null;

export function createPublicClient(): any {
  if (!publicClient) {
    publicClient = createSupabaseClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL || "https://oorovtqwyfrfjfwuufyi.supabase.co",
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        auth: {
          persistSession: false,
          autoRefreshToken: false,
        },
      }
    );
  }
  return publicClient;
}
