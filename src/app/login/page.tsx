"use client";
import { useState, Suspense } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { motion } from "framer-motion";
import {
  Mail,
  Lock,
  ArrowRight,
  ShieldCheck,
  Eye,
  EyeOff,
  Sparkles,
  AlertCircle,
  RefreshCw,
  GraduationCap,
  Award,
  Users,
  CheckCircle2,
} from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { GoogleSignInButton } from "@/components/auth/google-sign-in-button";

function LoginContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectUrl = searchParams.get("redirect") || "/dashboard";
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);

  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isUnconfirmedEmail, setIsUnconfirmedEmail] = useState(false);
  const [resendLoading, setResendLoading] = useState(false);
  const [resendSuccess, setResendSuccess] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setIsUnconfirmedEmail(false);
    setResendSuccess(false);

    if (!email.trim() || !email.includes("@")) {
      setErrorMessage("অনুগ্রহ করে আপনার সঠিক ইমেইল ঠিকানা দিন।");
      return;
    }

    if (!password) {
      setErrorMessage("অনুগ্রহ করে আপনার পাসওয়ার্ড দিন।");
      return;
    }

    setLoading(true);

    try {
      const supabase = createClient();
      const { data, error } = await supabase.auth.signInWithPassword({
        email: email.trim(),
        password: password,
      });

      if (error) {
        if (error.message.includes("Email not confirmed")) {
          setIsUnconfirmedEmail(true);
          throw new Error("আপনার ইমেইলটি এখনও ভেরিফাই করা হয়নি। নিচে ক্লিক করে পুনরায় ভেরিফিকেশন ইমেইল পাঠান।");
        } else if (error.message.includes("Invalid login credentials")) {
          throw new Error("ইমেইল অথবা পাসওয়ার্ড সঠিক নয়। অনুগ্রহ করে পুনরায় চেষ্টা করুন।");
        }
        throw error;
      }

      if (data.session) {
        router.push(redirectUrl);
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "লগইন ব্যর্থ হয়েছে";
      setErrorMessage(msg);
    } finally {
      setLoading(false);
    }
  };

  const handleResendConfirmation = async () => {
    if (!email.trim()) return;
    setResendLoading(true);
    try {
      const supabase = createClient();
      const { error } = await supabase.auth.resend({
        type: "signup",
        email: email.trim(),
        options: {
          emailRedirectTo: `${window.location.origin}/auth/callback`,
        },
      });
      if (error) throw error;
      setResendSuccess(true);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "ইমেইল পাঠাতে সমস্যা হয়েছে";
      setErrorMessage(msg);
    } finally {
      setResendLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#060911] text-slate-900 dark:text-slate-100 py-10 lg:py-16 relative overflow-hidden flex items-center justify-center transition-colors duration-300">
      {/* Background Ambient Lighting */}
      <div className="absolute top-[-10%] left-[-10%] w-[600px] h-[600px] bg-blue-500/10 dark:bg-blue-600/15 rounded-full blur-[140px] pointer-events-none -z-10" />
      <div className="absolute top-[20%] right-[-5%] w-[550px] h-[550px] bg-indigo-500/8 dark:bg-indigo-600/12 rounded-full blur-[160px] pointer-events-none -z-10" />
      <div className="absolute bottom-[-10%] left-[25%] w-[650px] h-[500px] bg-sky-500/10 dark:bg-cyan-600/10 rounded-full blur-[150px] pointer-events-none -z-10" />

      {/* Cyber Grid Dot Pattern */}
      <div
        className="absolute inset-0 pointer-events-none opacity-20 dark:opacity-25 -z-10"
        style={{
          backgroundImage: `radial-gradient(currentColor 1px, transparent 1px)`,
          backgroundSize: "28px 28px",
        }}
      />

      <div className="container-main max-w-5xl w-full px-4 sm:px-6 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-14 items-center">
          {/* Left Column: Testimonial & Benefits */}
          <motion.div
            initial={{ opacity: 0, x: -25 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
            className="hidden lg:flex lg:col-span-5 flex-col space-y-6"
          >
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-50 dark:bg-emerald-500/10 border border-emerald-200 dark:border-emerald-500/25 backdrop-blur-md text-emerald-700 dark:text-emerald-400 text-xs font-semibold font-bengali w-fit shadow-xs">
              <ShieldCheck className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
              <span>নিরাপদ শিক্ষার্থী পোর্টাল</span>
            </div>

            <div>
              <h2 className="text-3xl xl:text-4xl font-extrabold font-bengali tracking-tight leading-[1.2] text-slate-900 dark:text-transparent dark:bg-gradient-to-b dark:from-white dark:via-slate-100 dark:to-slate-400 dark:bg-clip-text">
                স্বাগতম! আপনার অ্যাকাউন্টে প্রবেশ করুন
              </h2>
              <p className="text-sm text-slate-600 dark:text-slate-400 font-bengali mt-3.5 leading-relaxed">
                আপনার এনরোল করা কোর্স, ক্লাস প্র্যাকটিস, লেকচার শিট এবং লাইভ মেন্টরিং সেশনে এক ক্লিকেই যুক্ত হোন।
              </p>
            </div>

            {/* Testimonial Card */}
            <div className="p-5 rounded-2xl bg-white/80 dark:bg-slate-900/60 border border-slate-200/90 dark:border-slate-800/90 backdrop-blur-xl space-y-3 shadow-xs">
              <div className="flex items-center gap-1 text-amber-500 dark:text-amber-400 text-sm">
                {"★".repeat(5)}
              </div>
              <p className="text-xs text-slate-700 dark:text-slate-300 font-bengali italic leading-relaxed">
                "Ormission-এর ক্লাসের কোয়ালিটি এবং প্রশ্নব্যাংক অ্যানালাইসিস আমার বিশ্ববিদ্যালয়ের ভর্তি পরীক্ষার প্রস্তুতিকে সহজ ও সুশৃঙ্খল করেছে।"
              </p>
              <div className="flex items-center gap-3 pt-2 border-t border-slate-200/80 dark:border-slate-800/80">
                <div className="w-8 h-8 rounded-full bg-blue-600 text-white font-bold flex items-center justify-center text-xs shadow-xs">
                  তা
                </div>
                <div>
                  <div className="text-xs font-bold text-slate-900 dark:text-white font-bengali">তানভীর আহমেদ</div>
                  <div className="text-[11px] text-blue-600 dark:text-blue-400 font-bengali">বুয়েট ভর্তি প্রস্তুতি ব্যাচ</div>
                </div>
              </div>
            </div>

            {/* Platform highlights */}
            <div className="grid grid-cols-3 gap-3 pt-1">
              <div className="p-3 rounded-xl bg-white dark:bg-slate-900/50 border border-slate-200 dark:border-slate-800/80 shadow-xs text-center">
                <GraduationCap className="w-4 h-4 text-blue-600 dark:text-blue-400 mx-auto mb-1" />
                <div className="text-xs font-bold text-slate-800 dark:text-slate-200 font-bengali">সেরা মেন্টর</div>
              </div>
              <div className="p-3 rounded-xl bg-white dark:bg-slate-900/50 border border-slate-200 dark:border-slate-800/80 shadow-xs text-center">
                <Award className="w-4 h-4 text-indigo-600 dark:text-indigo-400 mx-auto mb-1" />
                <div className="text-xs font-bold text-slate-800 dark:text-slate-200 font-bengali">সার্টিফিকেট</div>
              </div>
              <div className="p-3 rounded-xl bg-white dark:bg-slate-900/50 border border-slate-200 dark:border-slate-800/80 shadow-xs text-center">
                <Users className="w-4 h-4 text-teal-600 dark:text-teal-400 mx-auto mb-1" />
                <div className="text-xs font-bold text-slate-800 dark:text-slate-200 font-bengali">কমিউনিটি</div>
              </div>
            </div>
          </motion.div>

          {/* Right Column: Login Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: "easeOut", delay: 0.1 }}
            className="lg:col-span-7"
          >
            <div className="relative rounded-3xl bg-white dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800/80 p-6 sm:p-9 shadow-sm dark:shadow-md overflow-hidden transition-colors duration-300">
              {/* Header */}
              <div className="flex items-start justify-between gap-4 mb-6">
                <div>
                  <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 dark:bg-blue-500/10 border border-blue-200 dark:border-blue-500/20 text-blue-700 dark:text-blue-400 text-xs font-bold font-bengali mb-2">
                    <Sparkles className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
                    <span>শিক্ষার্থী লগইন পোর্টাল</span>
                  </div>
                  <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white font-bengali tracking-tight">
                    অ্যাকাউন্টে প্রবেশ করুন
                  </h1>
                  <p className="text-xs text-slate-500 dark:text-slate-400 font-bengali mt-1">
                    আপনার নিবন্ধিত ইমেইল ও পাসওয়ার্ড দিন
                  </p>
                </div>

                <Link
                  href={searchParams.get("redirect") ? `/register?redirect=${encodeURIComponent(searchParams.get("redirect")!)}` : "/register"}
                  className="hidden sm:inline-flex items-center gap-1 text-xs font-bold text-blue-600 dark:text-blue-400 hover:underline font-bengali shrink-0 pt-2"
                >
                  <span>নতুন অ্যাকাউন্ট খুলুন</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>

              {/* Error Alert */}
              {errorMessage && (
                <div className="mb-5 p-3.5 rounded-xl bg-rose-50 dark:bg-rose-500/10 border border-rose-200 dark:border-rose-500/20 text-xs text-rose-600 dark:text-rose-400 font-medium space-y-2 font-bengali">
                  <div className="flex items-center gap-2">
                    <AlertCircle className="w-4 h-4 shrink-0" />
                    <span>{errorMessage}</span>
                  </div>
                  {isUnconfirmedEmail && (
                    <div className="pt-1">
                      {resendSuccess ? (
                        <div className="text-emerald-600 dark:text-emerald-400 font-bold flex items-center gap-1.5">
                          <CheckCircle2 className="w-4 h-4" />
                          <span>ভেরিফিকেশন ইমেইল পুনরায় পাঠানো হয়েছে! অনুগ্রহ করে ইনবক্স চেক করুন।</span>
                        </div>
                      ) : (
                        <button
                          type="button"
                          disabled={resendLoading}
                          onClick={handleResendConfirmation}
                          className="px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white font-bold text-xs transition-colors"
                        >
                          {resendLoading ? "পাঠানো হচ্ছে..." : "পুনরায় ভেরিফিকেশন ইমেইল পাঠান"}
                        </button>
                      )}
                    </div>
                  )}
                </div>
              )}

              {/* Google One-Click Login */}
              <div className="mb-5 space-y-4">
                <GoogleSignInButton
                  text="গুগল দিয়ে লগইন করুন"
                  redirectUrl={redirectUrl}
                  onError={(err) => setErrorMessage(err)}
                />

                <div className="relative flex items-center justify-center">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-slate-200 dark:border-slate-800" />
                  </div>
                  <div className="relative px-3 bg-white dark:bg-slate-900 text-[11px] font-bold text-slate-400 dark:text-slate-500 font-bengali uppercase tracking-wider">
                    অথবা ইমেইল দিয়ে
                  </div>
                </div>
              </div>

              {/* Form */}
              <form onSubmit={handleLogin} className="space-y-4 font-bengali">
                {/* Email */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                    ইমেইল ঠিকানা <span className="text-rose-500">*</span>
                  </label>
                  <div className="relative">
                    <Mail className="w-4 h-4 text-slate-400 dark:text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                    <input
                      type="email"
                      required
                      placeholder="student@gmail.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-950/70 border border-slate-200 dark:border-slate-800 text-xs sm:text-sm text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-600 font-sans focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500/20 transition-all"
                    />
                  </div>
                </div>

                {/* Password */}
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                      পাসওয়ার্ড <span className="text-rose-500">*</span>
                    </label>
                    <Link
                      href="/forgot-password"
                      className="text-xs font-bold text-blue-600 dark:text-blue-400 hover:underline"
                    >
                      পাসওয়ার্ড ভুলে গেছেন?
                    </Link>
                  </div>
                  <div className="relative">
                    <Lock className="w-4 h-4 text-slate-400 dark:text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                    <input
                      type={showPassword ? "text" : "password"}
                      required
                      placeholder="আপনার পাসওয়ার্ড লিখুন"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="w-full pl-10 pr-10 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-950/70 border border-slate-200 dark:border-slate-800 text-xs sm:text-sm text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-600 font-sans focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500/20 transition-all"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-700 dark:text-slate-500 dark:hover:text-slate-300 transition-colors"
                      tabIndex={-1}
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                {/* Remember Me */}
                <div className="pt-1">
                  <label className="flex items-center gap-2 cursor-pointer text-xs text-slate-600 dark:text-slate-400 select-none">
                    <input
                      type="checkbox"
                      checked={rememberMe}
                      onChange={(e) => setRememberMe(e.target.checked)}
                      className="rounded border-slate-300 dark:border-slate-700 text-blue-600 focus:ring-blue-500 accent-blue-600 w-4 h-4"
                    />
                    <span>আমাকে মনে রাখুন</span>
                  </label>
                </div>

                {/* High-Contrast Professional Submit Button */}
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-3.5 px-5 rounded-xl font-bold text-sm transition-all duration-200 shadow-xs hover:shadow flex items-center justify-center gap-2 hover:-translate-y-0.5 active:translate-y-0 active:scale-[0.99] disabled:opacity-60 disabled:cursor-not-allowed bg-slate-950 text-white hover:bg-slate-800 active:bg-slate-900 dark:bg-white dark:text-slate-950 dark:hover:bg-slate-100 dark:active:bg-slate-200"
                >
                  {loading ? (
                    <>
                      <RefreshCw className="w-4 h-4 animate-spin" />
                      <span>প্রবেশ করা হচ্ছে...</span>
                    </>
                  ) : (
                    <>
                      <span>লগইন করুন</span>
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>

                {/* Mobile Switch Link */}
                <div className="text-center pt-2 sm:hidden">
                  <span className="text-xs text-slate-500 dark:text-slate-400">নতুন শিক্ষার্থী? </span>
                  <Link
                    href={searchParams.get("redirect") ? `/register?redirect=${encodeURIComponent(searchParams.get("redirect")!)}` : "/register"}
                    className="text-xs font-bold text-blue-600 dark:text-blue-400 hover:underline"
                  >
                    রেজিস্ট্রেশন করুন
                  </Link>
                </div>
              </form>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center bg-background">
          <p className="text-sm font-bengali text-text-muted">লোড হচ্ছে...</p>
        </div>
      }
    >
      <LoginContent />
    </Suspense>
  );
}
