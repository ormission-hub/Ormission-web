import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");
  const type = searchParams.get("type");
  
  // For password recovery, redirect to reset-password page
  const defaultTarget = type === "recovery" ? "/reset-password" : "/dashboard";
  const rawTarget = searchParams.get("redirect") || searchParams.get("next") || defaultTarget;
  const targetPath = rawTarget.startsWith("/") ? rawTarget : `/${rawTarget}`;

  if (code) {
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
              // Can be ignored if called from Server Component
            }
          },
        },
      }
    );

    const { data, error } = await supabase.auth.exchangeCodeForSession(code);

    if (!error && data?.user) {
      // Upsert student profile automatically
      try {
        const metadata = data.user.user_metadata || {};
        await supabase.from("profiles").upsert(
          {
            id: data.user.id,
            full_name: metadata.full_name || metadata.name || data.user.email?.split("@")[0] || "শিক্ষার্থী",
            avatar_url: metadata.avatar_url || metadata.picture || null,
            phone: metadata.phone || null,
            role: "student",
            is_active: true,
            updated_at: new Date().toISOString(),
          },
          { onConflict: "id" }
        );
      } catch (err) {
        console.error("Profile sync error on verification:", err);
      }

      const separator = targetPath.includes("?") ? "&" : "?";
      return NextResponse.redirect(`${origin}${targetPath}${separator}verified=true`);
    }
  }

  // Verification failed or no code
  return NextResponse.redirect(`${origin}/login?error=verification_failed`);
}
