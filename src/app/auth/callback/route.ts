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
      const userAgent = request.headers.get("user-agent") || "";
      const isMobileAndroid = /android/i.test(userAgent);
      const isAppExplicit = searchParams.get("is_app") === "true" || searchParams.get("from_app") === "true";
      const shouldBridgeToApp = (isAppExplicit || isMobileAndroid) && Boolean(data?.session);

      // If user came from mobile app (or mobile Android), bridge session back into Android app via ormission:// scheme
      if (shouldBridgeToApp && data?.session) {
        const accessToken = data.session.access_token;
        const refreshToken = data.session.refresh_token;
        const deepLink = `ormission://auth/callback?access_token=${encodeURIComponent(accessToken)}&refresh_token=${encodeURIComponent(refreshToken)}&redirect=${encodeURIComponent(targetPath)}`;
        const intentUri = `intent://auth/callback?access_token=${encodeURIComponent(accessToken)}&refresh_token=${encodeURIComponent(refreshToken)}&redirect=${encodeURIComponent(targetPath)}#Intent;scheme=ormission;package=com.ormission.app;end`;
        const fallbackUrl = `${origin}${targetPath}${separator}verified=true`;

        const bridgeHtml = `<!DOCTYPE html>
<html lang="bn">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>লগইন সফল - Ormission</title>
  <style>
    body {
      margin: 0;
      padding: 0;
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
      background: #020617;
      color: #f8fafc;
      display: flex;
      align-items: center;
      justify-content: center;
      min-height: 100vh;
      text-align: center;
    }
    .card {
      background: #0f172a;
      border: 1px solid #1e293b;
      border-radius: 24px;
      padding: 36px 24px;
      max-width: 380px;
      margin: 16px;
      box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.7);
    }
    .spinner {
      width: 46px;
      height: 46px;
      border: 4px solid #1e293b;
      border-top-color: #3b82f6;
      border-radius: 50%;
      animation: spin 0.8s linear infinite;
      margin: 0 auto 20px;
    }
    @keyframes spin { to { transform: rotate(360deg); } }
    h2 { margin: 0 0 10px; font-size: 20px; font-weight: 700; color: #fff; }
    p { margin: 0 0 24px; font-size: 13.5px; color: #94a3b8; line-height: 1.6; }
    .btn {
      display: block;
      width: 100%;
      padding: 13px 20px;
      background: linear-gradient(135deg, #2563eb, #1d4ed8);
      color: #fff;
      font-weight: 700;
      font-size: 14px;
      border-radius: 14px;
      text-decoration: none;
      box-sizing: border-box;
      box-shadow: 0 10px 15px -3px rgba(37, 99, 235, 0.3);
      cursor: pointer;
    }
    .btn-secondary {
      display: inline-block;
      margin-top: 14px;
      font-size: 12.5px;
      color: #64748b;
      text-decoration: underline;
      background: none;
      border: none;
      cursor: pointer;
    }
  </style>
</head>
<body>
  <div class="card">
    <div class="spinner"></div>
    <h2>লগইন সফল হয়েছে!</h2>
    <p>আপনাকে Ormission অ্যাপে ফিরিয়ে নেওয়া হচ্ছে...<br>স্বয়ংক্রিয়ভাবে অ্যাপ না খুললে নিচের বাটনে চাপ দিন।</p>
    <a href="${deepLink}" id="launchBtn" class="btn">অ্যাপে ফিরে যান</a>
    <a href="${fallbackUrl}" class="btn-secondary">ব্রাউজারেই ড্যাশবোর্ড দেখুন</a>
  </div>
  <script>
    // Trigger launch to Ormission App
    try {
      window.location.href = "${deepLink}";
    } catch(e) {}

    // Fallback via intent if scheme not caught
    setTimeout(function() {
      try {
        window.location.href = "${intentUri}";
      } catch(e) {}
    }, 500);

    // If app not installed or user wants browser, redirect after 3s
    setTimeout(function() {
      window.location.href = "${fallbackUrl}";
    }, 3200);
  </script>
</body>
</html>`;

        return new NextResponse(bridgeHtml, {
          headers: {
            "Content-Type": "text/html; charset=utf-8",
          },
        });
      }

      return NextResponse.redirect(`${origin}${targetPath}${separator}verified=true`);
    }
  }

  // Verification failed or no code
  return NextResponse.redirect(`${origin}/login?error=verification_failed`);
}
