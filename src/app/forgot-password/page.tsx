"use client";

import { useState } from "react";
import Link from "next/link";
import { KeyRound, ArrowRight, ArrowLeft, CheckCircle2, AlertCircle } from "lucide-react";
import { createClient } from "@/lib/supabase/client";

export default function ForgotPasswordPage() {
  const [identifier, setIdentifier] = useState("");
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const supabase = createClient();

      // Supabase resetPasswordForEmail requires an email address
      const email = identifier.trim();

      if (!email.includes("@")) {
        setError("পাসওয়ার্ড রিসেট করতে আপনার রেজিস্টার্ড ইমেইল অ্যাড্রেস দিন।");
        setLoading(false);
        return;
      }

      const { error: resetError } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/auth/callback?type=recovery`,
      });

      if (resetError) {
        console.error("Password reset error:", resetError);
        setError("রিসেট ইমেইল পাঠাতে সমস্যা হয়েছে। অনুগ্রহ করে কিছুক্ষণ পর আবার চেষ্টা করুন।");
        setLoading(false);
        return;
      }

      setSent(true);
    } catch (err) {
      console.error("Forgot password exception:", err);
      setError("একটি অপ্রত্যাশিত সমস্যা হয়েছে। অনুগ্রহ করে পরে আবার চেষ্টা করুন।");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-background min-h-screen py-12 lg:py-20 flex items-center justify-center">
      <div className="container-main max-w-md w-full">
        <div className="bg-surface rounded-xl border border-border p-6 sm:p-8 shadow-sm">
          <div className="text-center mb-6">
            <div className="w-12 h-12 rounded-full bg-primary/10 text-primary flex items-center justify-center mx-auto mb-3">
              <KeyRound className="w-6 h-6" />
            </div>
            <h1 className="text-2xl font-bold text-text font-bengali tracking-tight mb-1.5">
              পাসওয়ার্ড পুনরুদ্ধার
            </h1>
            <p className="text-xs text-text-muted font-bengali">
              আপনার নিবন্ধিত ইমেইল অ্যাড্রেস লিখুন
            </p>
          </div>

          {sent ? (
            <div className="bg-secondary/10 border border-secondary/20 rounded-lg p-6 text-center space-y-3">
              <CheckCircle2 className="w-10 h-10 text-secondary mx-auto" />
              <h4 className="font-bold text-base text-text font-bengali">
                রিসেট নির্দেশনা পাঠানো হয়েছে
              </h4>
              <p className="text-xs text-text-muted font-bengali leading-relaxed">
                আপনার ইমেইলে পাসওয়ার্ড রিসেট লিংক পাঠিয়ে দেওয়া হয়েছে। অনুগ্রহ করে ইনবক্স ও স্প্যাম ফোল্ডার চেক করুন।
              </p>
              <Link
                href="/login"
                className="btn btn-primary btn-sm font-bengali font-semibold block mt-4"
              >
                লগইন পাতায় ফিরে যান
              </Link>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              {error && (
                <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-3 flex items-start gap-2.5">
                  <AlertCircle className="w-4 h-4 text-red-500 shrink-0 mt-0.5" />
                  <p className="text-xs text-red-600 dark:text-red-400 font-bengali">{error}</p>
                </div>
              )}

              <div>
                <label className="block text-xs font-semibold text-text font-bengali mb-1.5">
                  ইমেইল অ্যাড্রেস *
                </label>
                <input
                  type="email"
                  required
                  placeholder="mail@example.com"
                  value={identifier}
                  onChange={(e) => setIdentifier(e.target.value)}
                  className="input text-sm font-sans w-full"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="btn btn-primary font-bengali font-bold w-full py-3 flex items-center justify-center gap-2"
              >
                <span>{loading ? "পাঠানো হচ্ছে..." : "রিসেট লিংক পাঠান"}</span>
                {!loading && <ArrowRight className="w-4 h-4" />}
              </button>
            </form>
          )}

          <div className="border-t border-border mt-6 pt-5 text-center">
            <Link
              href="/login"
              className="inline-flex items-center gap-1.5 text-xs text-text-muted hover:text-primary transition-colors font-bengali"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>লগইন পাতায় ফিরে যান</span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

