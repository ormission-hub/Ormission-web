import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const accessToken = searchParams.get("access_token");
  const refreshToken = searchParams.get("refresh_token");
  const redirect = searchParams.get("redirect") || "/dashboard";
  const targetPath = redirect.startsWith("/") ? redirect : `/${redirect}`;

  if (!accessToken || !refreshToken) {
    return NextResponse.redirect(`${origin}/login?error=missing_tokens`);
  }

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
          } catch {
            // Can be ignored in Server Route
          }
        },
      },
    }
  );

  try {
    const { error } = await supabase.auth.setSession({
      access_token: accessToken,
      refresh_token: refreshToken,
    });

    if (error) {
      console.error("Session set error in bridge route:", error);
      return NextResponse.redirect(`${origin}/login?error=session_failed`);
    }

    const separator = targetPath.includes("?") ? "&" : "?";
    return NextResponse.redirect(`${origin}${targetPath}${separator}app_login=true`);
  } catch (err) {
    console.error("Unexpected session bridge error:", err);
    return NextResponse.redirect(`${origin}/login?error=unknown`);
  }
}
