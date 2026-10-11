import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const redirect = searchParams.get("redirect") || "/dashboard";
  const isApp = searchParams.get("is_app") || "true";

  const cookieStore = await cookies();
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            );
          } catch {}
        },
      },
    }
  );

  const callbackUrl = `${origin}/auth/callback?redirect=${encodeURIComponent(redirect)}&is_app=${isApp}`;

  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: "google",
    options: {
      redirectTo: callbackUrl,
      queryParams: {
        access_type: "offline",
        prompt: "select_account",
      },
    },
  });

  if (error || !data?.url) {
    console.error("Google OAuth initialization error:", error);
    return NextResponse.redirect(`${origin}/login?error=oauth_init_failed`);
  }

  // Redirect Chrome directly to Google OAuth with PKCE code_verifier cookie stored in Chrome
  return NextResponse.redirect(data.url);
}
