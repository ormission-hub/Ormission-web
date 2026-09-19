"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { RefreshCw } from "lucide-react";

interface GoogleSignInButtonProps {
  text?: string;
  redirectUrl?: string;
  className?: string;
  onError?: (message: string) => void;
}

export function GoogleSignInButton({
  text = "গুগল দিয়ে চালিয়ে যান",
  redirectUrl = "/dashboard",
  className = "",
  onError,
}: GoogleSignInButtonProps) {
  const [loading, setLoading] = useState(false);

  const handleGoogleSignIn = async () => {
    setLoading(true);
    try {
      const supabase = createClient();
      const origin = typeof window !== "undefined" ? window.location.origin : "";
      const targetRedirect = redirectUrl.startsWith("/") ? redirectUrl : `/${redirectUrl}`;
      const callbackUrl = `${origin}/auth/callback?redirect=${encodeURIComponent(targetRedirect)}`;

      const { error } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: {
          redirectTo: callbackUrl,
          queryParams: {
            access_type: "offline",
            prompt: "consent",
          },
        },
      });

      if (error) {
        throw error;
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "গুগল সাইন-ইন প্রক্রিয়া ব্যর্থ হয়েছে";
      if (onError) {
        onError(msg);
      }
      setLoading(false);
    }
  };

  return (
    <button
      type="button"
      onClick={handleGoogleSignIn}
      disabled={loading}
      className={`w-full py-3 px-4 rounded-xl font-bengali font-bold text-xs sm:text-sm border transition-all duration-200 flex items-center justify-center gap-3 shadow-xs hover:shadow-md cursor-pointer hover:-translate-y-0.5 active:translate-y-0 active:scale-[0.99] disabled:opacity-60 disabled:cursor-not-allowed bg-white dark:bg-slate-900/90 text-slate-700 dark:text-slate-100 border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/80 ${className}`}
    >
      {loading ? (
        <>
          <RefreshCw className="w-4 h-4 animate-spin text-blue-500" />
          <span>গুগল কানেক্ট হচ্ছে...</span>
        </>
      ) : (
        <>
          {/* Official 4-Color Google "G" Icon */}
          <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path
              d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              fill="#4285F4"
            />
            <path
              d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              fill="#34A853"
            />
            <path
              d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
              fill="#FBBC05"
            />
            <path
              d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
              fill="#EA4335"
            />
          </svg>
          <span>{text}</span>
        </>
      )}
    </button>
  );
}
