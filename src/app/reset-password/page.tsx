"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { KeyRound, ArrowLeft, CheckCircle2, AlertCircle, Eye, EyeOff } from "lucide-react";
import { createClient } from "@/lib/supabase/client";

export default function ResetPasswordPage() {
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (password.length < 6) {
      setError("পাসওয়ার্ড কমপক্ষে ৬ অক্ষরের হতে হবে।");
      return;
    }

    if (password !== confirmPassword) {
      setError("পাসওয়ার্ড দুটি মিলছে না। আবার চেষ্টা করুন।");
      return;
    }

    setLoading(true);

    try {
      const supabase = createClient();

      const { error: updateError } = await supabase.auth.updateUser({
        password: password,
      });

      if (updateError) {
        console.error("Password update error:", updateError);
        setError("পাসওয়ার্ড আপডেট করতে সমস্যা হয়েছে। লিংকটি মেয়াদোত্তীর্ণ হতে পারে। আবার রিসেট করুন।");
        return;
      }

      setSuccess(true);
      // Redirect to dashboard after 3 seconds
      setTimeout(() => router.push("/dashboard"), 3000);
    } catch (err) {
      console.error("Reset password exception:", err);
      setError("একটি অপ্রত্যাশিত সমস্যা হয়েছে।");
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
              নতুন পাসওয়ার্ড সেট করুন
            </h1>
            <p className="text-xs text-text-muted font-bengali">
              আপনার অ্যাকাউন্টের জন্য একটি নতুন পাসওয়ার্ড নির্ধারণ করুন
            </p>
          </div>

          {success ? (
            <div className="bg-secondary/10 border border-secondary/20 rounded-lg p-6 text-center space-y-3">
              <CheckCircle2 className="w-10 h-10 text-secondary mx-auto" />
              <h4 className="font-bold text-base text-text font-bengali">
                পাসওয়ার্ড সফলভাবে আপডেট হয়েছে!
              </h4>
              <p className="text-xs text-text-muted font-bengali leading-relaxed">
                আপনার নতুন পাসওয়ার্ড সেট হয়ে গেছে। এখনই ড্যাশবোর্ডে নিয়ে যাওয়া হচ্ছে...
              </p>
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
                  নতুন পাসওয়ার্ড *
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    required
                    minLength={6}
                    placeholder="কমপক্ষে ৬ অক্ষর"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="input text-sm font-sans w-full pr-10"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-text-muted hover:text-text transition-colors"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-text font-bengali mb-1.5">
                  পাসওয়ার্ড নিশ্চিত করুন *
                </label>
                <input
                  type="password"
                  required
                  minLength={6}
                  placeholder="আবার পাসওয়ার্ড লিখুন"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="input text-sm font-sans w-full"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="btn btn-primary font-bengali font-bold w-full py-3 flex items-center justify-center gap-2"
              >
                <span>{loading ? "আপডেট হচ্ছে..." : "পাসওয়ার্ড আপডেট করুন"}</span>
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
