"use client";
import { useState, Suspense } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  User,
  Mail,
  Lock,
  ArrowRight,
  ShieldCheck,
  Eye,
  EyeOff,
  Sparkles,
  ExternalLink,
  RefreshCw,
  GraduationCap,
  BookOpen,
  AlertCircle,
  Check,
} from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { GoogleSignInButton } from "@/components/auth/google-sign-in-button";

function RegisterContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const targetDestination = searchParams.get("redirect") || "/dashboard?welcome=true";
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
    academicLevel: "hsc-science",
    agreed: true,
  });

  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Email verification states
  const [verificationPending, setVerificationPending] = useState(false);
  const [resendTimer, setResendTimer] = useState(0);
  const [resending, setResending] = useState(false);

  // Password strength calculation
  const calculateStrength = (pass: string) => {
    if (!pass) return 0;
    let score = 0;
    if (pass.length >= 6) score += 1;
    if (pass.length >= 8) score += 1;
    if (/[A-Z]/.test(pass) || /[0-9]/.test(pass)) score += 1;
    if (/[^A-Za-z0-9]/.test(pass)) score += 1;
    return score;
  };

  const strength = calculateStrength(formData.password);
  const strengthLabels = ["খুবই দুর্বল", "চলতি মানের", "ভালো মানের", "অত্যন্ত শক্তিশালী"];
  const strengthColors = ["bg-rose-500", "bg-amber-500", "bg-blue-500", "bg-emerald-500"];

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    if (!formData.name.trim()) {
      setErrorMessage("অনুগ্রহ করে আপনার পূর্ণ নাম লিখুন।");
      return;
    }

    if (!formData.email.trim() || !formData.email.includes("@")) {
      setErrorMessage("অনুগ্রহ করে একটি সঠিক ইমেইল ঠিকানা দিন।");
      return;
    }

    if (formData.password.length < 6) {
      setErrorMessage("পাসওয়ার্ড কমপক্ষে ৬ অক্ষরের হতে হবে।");
      return;
    }

    if (!formData.agreed) {
      setErrorMessage("শর্তাবলী ও গোপনীয়তা নীতিতে সম্মতি প্রদান করুন।");
      return;
    }

    setLoading(true);

    try {
      const supabase = createClient();
      const emailCallbackUrl = `${window.location.origin}/auth/callback?redirect=${encodeURIComponent(targetDestination)}`;

      const { data, error } = await supabase.auth.signUp({
        email: formData.email.trim(),
        password: formData.password,
        options: {
          data: {
            full_name: formData.name.trim(),
            phone: formData.phone.trim(),
            academic_level: formData.academicLevel,
          },
          emailRedirectTo: emailCallbackUrl,
        },
      });

      if (error) throw error;

      if (data.session) {
        router.push(targetDestination);
        return;
      }

      setVerificationPending(true);
      startResendCountdown();
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "নিবন্ধন প্রক্রিয়া ব্যর্থ হয়েছে";
      if (msg.includes("User already registered") || msg.includes("already exists")) {
        setErrorMessage("এই ইমেইল দিয়ে ইতিমধ্যে একটি অ্যাকাউন্ট তৈরি করা আছে। অনুগ্রহ করে লগইন করুন।");
      } else {
        setErrorMessage(msg);
      }
    } finally {
      setLoading(false);
    }
  };

  const startResendCountdown = () => {
    setResendTimer(60);
    const interval = setInterval(() => {
      setResendTimer((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  const handleResendVerificationEmail = async () => {
    if (resendTimer > 0 || resending) return;
    setResending(true);
    setErrorMessage(null);
    try {
      const supabase = createClient();
      const emailCallbackUrl = `${window.location.origin}/auth/callback?redirect=${encodeURIComponent(targetDestination)}`;
      const { error } = await supabase.auth.resend({
        type: "signup",
        email: formData.email.trim(),
        options: {
          emailRedirectTo: emailCallbackUrl,
        },
      });
      if (error) throw error;
      startResendCountdown();
      alert("ভেরিফিকেশন কনফার্মেশন ইমেইল পুনরায় পাঠানো হয়েছে! ইনবক্স বা স্প্যাম ফোল্ডার চেক করুন।");
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "ইমেইল পুনরায় পাঠাতে সমস্যা হয়েছে";
      setErrorMessage(msg);
    } finally {
      setResending(false);
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

      <div className="container-main max-w-6xl w-full px-4 sm:px-6 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-14 items-center">
          {/* Left Column: Visual Showcase & Trust Factors */}
          <motion.div
            initial={{ opacity: 0, x: -25 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
            className="hidden lg:flex lg:col-span-5 flex-col space-y-7"
          >
            {/* Live Indicator Pill */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-50 dark:bg-blue-500/10 border border-blue-200 dark:border-blue-500/25 backdrop-blur-md text-blue-700 dark:text-blue-400 text-xs font-semibold font-bengali w-fit shadow-xs">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
              </span>
              <span>ভর্তি চলছে • ২০২৬ স্পেশাল একাডেমিক ব্যাচ</span>
            </div>

            <div>
              <h2 className="text-3xl xl:text-4xl font-extrabold font-bengali tracking-tight leading-[1.2] text-slate-900 dark:text-transparent dark:bg-gradient-to-b dark:from-white dark:via-slate-100 dark:to-slate-400 dark:bg-clip-text">
                কাঙ্ক্ষিত বিশ্ববিদ্যালয় ও স্বপ্নের ক্যারিয়ারে আপনার বিশ্বস্ত সঙ্গী
              </h2>
              <p className="text-sm text-slate-600 dark:text-slate-400 font-bengali mt-3.5 leading-relaxed">
                দেশসেরা মেন্টরদের তত্ত্বাবধানে সাজানো লাইভ ক্লাস, ২০ বছরের প্রশ্ন সমাধান এবং স্পেশাল সাজেশন সমৃদ্ধ একমাত্র পূর্ণাঙ্গ এডটেক পোর্টাল।
              </p>
            </div>

            {/* Dynamic Interactive Feature Cards */}
            <div className="space-y-3.5">
              <div className="flex items-center gap-4 p-3.5 rounded-2xl bg-white/80 dark:bg-slate-900/60 border border-slate-200/90 dark:border-slate-800/90 shadow-xs backdrop-blur-md transition-all">
                <div className="w-11 h-11 rounded-xl bg-blue-50 dark:bg-blue-500/20 border border-blue-200/80 dark:border-blue-500/30 text-blue-600 dark:text-blue-400 flex items-center justify-center shrink-0">
                  <GraduationCap className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-slate-800 dark:text-slate-100 font-bengali">ফুল এইচডি লাইভ ও ব্যাকআপ ক্লাস</h4>
                  <p className="text-xs text-slate-500 dark:text-slate-400 font-bengali mt-0.5">যেকোনো ডিভাইসে আনলিমিটেড দেখার সুবিধা</p>
                </div>
              </div>

              <div className="flex items-center gap-4 p-3.5 rounded-2xl bg-white/80 dark:bg-slate-900/60 border border-slate-200/90 dark:border-slate-800/90 shadow-xs backdrop-blur-md transition-all">
                <div className="w-11 h-11 rounded-xl bg-indigo-50 dark:bg-indigo-500/20 border border-indigo-200/80 dark:border-indigo-500/30 text-indigo-600 dark:text-indigo-400 flex items-center justify-center shrink-0">
                  <BookOpen className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-slate-800 dark:text-slate-100 font-bengali">অধ্যায়ভিত্তিক প্র্যাকটিস বুক ও PDF</h4>
                  <p className="text-xs text-slate-500 dark:text-slate-400 font-bengali mt-0.5">টপিক অনুযায়ী সাজানো প্রশ্নব্যাংক ও নোট</p>
                </div>
              </div>

              <div className="flex items-center gap-4 p-3.5 rounded-2xl bg-white/80 dark:bg-slate-900/60 border border-slate-200/90 dark:border-slate-800/90 shadow-xs backdrop-blur-md transition-all">
                <div className="w-11 h-11 rounded-xl bg-teal-50 dark:bg-teal-500/20 border border-teal-200/80 dark:border-teal-500/30 text-teal-600 dark:text-teal-400 flex items-center justify-center shrink-0">
                  <ShieldCheck className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-slate-800 dark:text-slate-100 font-bengali">২৪/৭ সরাসরি মেন্টর সাপোর্ট</h4>
                  <p className="text-xs text-slate-500 dark:text-slate-400 font-bengali mt-0.5">যেকোনো ডাউট সলভ ও পার্সোনালাইজড গাইডলাইন</p>
                </div>
              </div>
            </div>

            {/* Stats Ribbon */}
            <div className="grid grid-cols-3 gap-3 pt-2">
              <div className="p-3 rounded-xl bg-white dark:bg-slate-900/50 border border-slate-200 dark:border-slate-800/80 shadow-xs text-center">
                <div className="text-lg font-extrabold text-blue-600 dark:text-blue-400 font-sans">
                  ৫২,০০০+
                </div>
                <div className="text-[11px] text-slate-500 dark:text-slate-400 font-bengali mt-0.5">রেজিস্টার্ড শিক্ষার্থী</div>
              </div>

              <div className="p-3 rounded-xl bg-white dark:bg-slate-900/50 border border-slate-200 dark:border-slate-800/80 shadow-xs text-center">
                <div className="text-lg font-extrabold text-amber-600 dark:text-amber-400 font-sans">
                  ৪.৯৫ / ৫
                </div>
                <div className="text-[11px] text-slate-500 dark:text-slate-400 font-bengali mt-0.5">শিক্ষার্থী রেটিং</div>
              </div>

              <div className="p-3 rounded-xl bg-white dark:bg-slate-900/50 border border-slate-200 dark:border-slate-800/80 shadow-xs text-center">
                <div className="text-lg font-extrabold text-emerald-600 dark:text-emerald-400 font-sans">
                  ১০০%
                </div>
                <div className="text-[11px] text-slate-500 dark:text-slate-400 font-bengali mt-0.5">সুরক্ষিত সিস্টেম</div>
              </div>
            </div>
          </motion.div>

          {/* Right Column: Auth Panel Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: "easeOut", delay: 0.1 }}
            className="lg:col-span-7"
          >
            <div className="relative rounded-3xl bg-white dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800/80 p-6 sm:p-9 shadow-sm dark:shadow-md overflow-hidden transition-colors duration-300">
              <AnimatePresence mode="wait">
                {verificationPending ? (
                  /* =================================================== */
                  /* EMAIL VERIFICATION WAITING SCREEN                   */
                  /* =================================================== */
                  <motion.div
                    key="verification-screen"
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    className="text-center py-4 space-y-6 font-bengali"
                  >
                    <div className="w-16 h-16 rounded-2xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center mx-auto text-blue-600 dark:text-blue-400 relative">
                      <Mail className="w-8 h-8 animate-bounce" />
                      <span className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-emerald-500 text-white flex items-center justify-center text-xs shadow-sm">
                        <Check className="w-3 h-3 stroke-[3]" />
                      </span>
                    </div>

                    <div>
                      <span className="inline-block px-3 py-1 rounded-full text-xs font-bold bg-blue-50 dark:bg-blue-500/10 text-blue-700 dark:text-blue-400 border border-blue-200 dark:border-blue-500/20 mb-2">
                        কনফার্মেশন ইমেইল পাঠানো হয়েছে
                      </span>
                      <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
                        আপনার ইমেইল ভেরিফাই করুন
                      </h2>
                      <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 mt-2 max-w-md mx-auto leading-relaxed">
                        আমরা আপনার এই ঠিকানায় একটি অ্যাক্টিভেশন লিংক পাঠিয়েছি:
                      </p>
                      <div className="inline-block px-4 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-950/80 border border-slate-200 dark:border-slate-800 mt-2 text-sm font-bold text-blue-700 dark:text-blue-300 font-sans select-all shadow-inner">
                        {formData.email}
                      </div>
                    </div>

                    {errorMessage && (
                      <div className="p-3 rounded-xl bg-rose-50 dark:bg-rose-500/10 border border-rose-200 dark:border-rose-500/20 text-xs text-rose-600 dark:text-rose-400 font-medium flex items-center gap-2 max-w-md mx-auto text-left">
                        <AlertCircle className="w-4 h-4 shrink-0" />
                        <span>{errorMessage}</span>
                      </div>
                    )}

                    {/* Step-by-Step Instructions Box */}
                    <div className="max-w-md mx-auto text-left p-4 rounded-2xl bg-slate-50 dark:bg-slate-950/60 border border-slate-200 dark:border-slate-800 space-y-2.5 text-xs text-slate-700 dark:text-slate-300">
                      <div className="flex items-start gap-2.5">
                        <div className="w-5 h-5 rounded-full bg-blue-500/10 text-blue-600 dark:text-blue-400 font-bold flex items-center justify-center shrink-0 text-[11px]">
                          ১
                        </div>
                        <p className="pt-0.5">
                          আপনার ইমেইল ইনবক্স চেক করুন (অথবা নিচের বাটনে ক্লিক করে Gmail খুলুন)।
                        </p>
                      </div>
                      <div className="flex items-start gap-2.5">
                        <div className="w-5 h-5 rounded-full bg-blue-500/10 text-blue-600 dark:text-blue-400 font-bold flex items-center justify-center shrink-0 text-[11px]">
                          ২
                        </div>
                        <p className="pt-0.5">
                          Ormission থেকে আসা ইমেইলের ভেতরের <strong className="text-blue-600 dark:text-blue-400 font-bold">&quot;Verify Email Address&quot;</strong> বাটনে ক্লিক করুন।
                        </p>
                      </div>
                      <div className="flex items-start gap-2.5">
                        <div className="w-5 h-5 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-bold flex items-center justify-center shrink-0 text-[11px]">
                          ৩
                        </div>
                        <p className="pt-0.5">
                          ক্লিক করার সাথে সাথে অ্যাকাউন্ট সক্রিয় হবে এবং সরাসরি কোর্সের চেকআউট পাতায় নিয়ে যাবে।
                        </p>
                      </div>
                    </div>

                    {/* 1-Click Open Webmail Buttons */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-w-md mx-auto pt-1">
                      <a
                        href="https://mail.google.com"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center justify-center gap-2 py-3 px-4 rounded-xl font-bold text-xs shadow-xs transition-all hover:-translate-y-0.5 bg-slate-950 text-white hover:bg-slate-800 dark:bg-white dark:text-slate-950 dark:hover:bg-slate-100 cursor-pointer"
                      >
                        <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                          <path d="M24 5.457v13.909c0 .904-.732 1.636-1.636 1.636h-3.819V11.73L12 16.64l-6.545-4.91v9.273H1.636A1.636 1.636 0 0 1 0 19.366V5.457c0-2.023 2.309-3.178 3.927-1.964L5.455 4.64 12 9.548l6.545-4.91 1.528-1.145C21.69 2.28 24 3.434 24 5.457z" />
                        </svg>
                        <span>Gmail ইনবক্স খুলুন</span>
                        <ExternalLink className="w-3.5 h-3.5 opacity-70" />
                      </a>

                      <a
                        href="https://outlook.live.com"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800/80 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200 font-bold text-xs transition-all hover:-translate-y-0.5 cursor-pointer"
                      >
                        <Mail className="w-4 h-4 text-slate-500 dark:text-slate-400" />
                        <span>অন্যান্য ইমেইল ইনবক্স</span>
                        <ExternalLink className="w-3.5 h-3.5 opacity-70" />
                      </a>
                    </div>

                    {/* Resend & Help */}
                    <div className="pt-2 text-xs text-slate-600 dark:text-slate-400 space-y-2.5">
                      <p>
                        ইমেইল খুঁজে না পেলে অনুগ্রহ করে আপনার{" "}
                        <strong className="text-slate-900 dark:text-slate-200 font-semibold">Spam / Junk / Promotions</strong> ফোল্ডার চেক করুন।
                      </p>

                      <div>
                        <button
                          type="button"
                          disabled={resendTimer > 0 || resending}
                          onClick={handleResendVerificationEmail}
                          className="inline-flex items-center gap-1.5 text-blue-600 dark:text-blue-400 hover:underline font-bold disabled:text-slate-400 dark:disabled:text-slate-500 disabled:no-underline cursor-pointer"
                        >
                          <RefreshCw className={`w-3.5 h-3.5 ${resending ? "animate-spin" : ""}`} />
                          <span>
                            {resendTimer > 0
                              ? `পুনরায় ইমেইল পাঠাতে অপেক্ষা করুন (${resendTimer} সেকেন্ড)`
                              : "পুনরায় কনফার্মেশন ইমেইল পাঠান"}
                          </span>
                        </button>
                      </div>

                      <div className="pt-1">
                        <button
                          type="button"
                          onClick={() => setVerificationPending(false)}
                          className="text-slate-500 hover:text-slate-700 dark:hover:text-slate-300 underline text-[11px] cursor-pointer"
                        >
                          ভুল ইমেইল দিয়েছেন? পুনরায় তথ্য পরিবর্তন করুন
                        </button>
                      </div>
                    </div>
                  </motion.div>
                ) : (
                  /* =================================================== */
                  /* REGISTRATION FORM                                   */
                  /* =================================================== */
                  <motion.div
                    key="register-form"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                  >
                    {/* Header */}
                    <div className="flex items-start justify-between gap-4 mb-6">
                      <div>
                        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 dark:bg-blue-500/10 border border-blue-200 dark:border-blue-500/20 text-blue-700 dark:text-blue-400 text-xs font-bold font-bengali mb-2">
                          <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                          <span>১ মিনিটে ফ্রি রেজিস্ট্রেশন</span>
                        </div>
                        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white font-bengali tracking-tight">
                          নতুন অ্যাকাউন্ট তৈরি করুন
                        </h1>
                        <p className="text-xs text-slate-500 dark:text-slate-400 font-bengali mt-1">
                          আপনার সঠিক তথ্য দিয়ে ভর্তি প্রস্তুতিতে যুক্ত হোন
                        </p>
                      </div>

                      <Link
                        href={searchParams.get("redirect") ? `/login?redirect=${encodeURIComponent(searchParams.get("redirect")!)}` : "/login"}
                        className="hidden sm:inline-flex items-center gap-1 text-xs font-bold text-blue-600 dark:text-blue-400 hover:underline font-bengali shrink-0 pt-2"
                      >
                        <span>লগইন করুন</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </Link>
                    </div>

                    {/* Error Banner */}
                    {errorMessage && (
                      <div className="mb-5 p-3.5 rounded-xl bg-rose-50 dark:bg-rose-500/10 border border-rose-200 dark:border-rose-500/20 text-xs text-rose-600 dark:text-rose-400 font-medium flex items-center gap-2 font-bengali">
                        <AlertCircle className="w-4 h-4 shrink-0" />
                        <span>{errorMessage}</span>
                      </div>
                    )}

                    {/* Google One-Click Register */}
                    <div className="mb-5 space-y-4">
                      <GoogleSignInButton
                        text="গুগল দিয়ে রেজিস্ট্রেশন করুন"
                        redirectUrl={targetDestination}
                        onError={(err) => setErrorMessage(err)}
                      />

                      <div className="relative flex items-center justify-center">
                        <div className="absolute inset-0 flex items-center">
                          <div className="w-full border-t border-slate-200 dark:border-slate-800" />
                        </div>
                        <div className="relative px-3 bg-white dark:bg-slate-900 text-[11px] font-bold text-slate-400 dark:text-slate-500 font-bengali uppercase tracking-wider">
                          অথবা তথ্য দিয়ে অ্যাকাউন্ট খুলুন
                        </div>
                      </div>
                    </div>

                    {/* Form */}
                    <form onSubmit={handleRegister} className="space-y-4 font-bengali">
                      {/* Name */}
                      <div>
                        <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                          আপনার পূর্ণ নাম <span className="text-rose-500">*</span>
                        </label>
                        <div className="relative">
                          <User className="w-4 h-4 text-slate-400 dark:text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                          <input
                            type="text"
                            required
                            placeholder="উদা: সাদমান ইসলাম"
                            value={formData.name}
                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                            className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-950/70 border border-slate-200 dark:border-slate-800 text-xs sm:text-sm text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-600 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500/20 transition-all"
                          />
                        </div>
                      </div>

                      {/* Email & Phone */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
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
                              value={formData.email}
                              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                              className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-950/70 border border-slate-200 dark:border-slate-800 text-xs sm:text-sm text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-600 font-sans focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500/20 transition-all"
                            />
                          </div>
                        </div>

                        {/* Phone */}
                        <div>
                          <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                            মোবাইল নম্বর <span className="text-rose-500">*</span>
                          </label>
                          <div className="relative">
                            <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-xs font-bold text-slate-400 dark:text-slate-500 font-sans pointer-events-none">
                              +88
                            </span>
                            <input
                              type="tel"
                              required
                              placeholder="017XXXXXXXX"
                              value={formData.phone}
                              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                              className="w-full pl-12 pr-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-950/70 border border-slate-200 dark:border-slate-800 text-xs sm:text-sm text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-600 font-sans focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500/20 transition-all"
                            />
                          </div>
                        </div>
                      </div>

                      {/* Academic Level */}
                      <div>
                        <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                          আপনার বর্তমান শিক্ষাস্তর (বিভাগ)
                        </label>
                        <select
                          value={formData.academicLevel}
                          onChange={(e) => setFormData({ ...formData, academicLevel: e.target.value })}
                          className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-950/70 border border-slate-200 dark:border-slate-800 text-xs sm:text-sm text-slate-900 dark:text-white focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500/20 transition-all cursor-pointer"
                        >
                          <option value="hsc-science" className="bg-white dark:bg-slate-900 text-slate-900 dark:text-white">এইচএসসি বিজ্ঞান (HSC Science)</option>
                          <option value="medical-admission" className="bg-white dark:bg-slate-900 text-slate-900 dark:text-white">মেডিকেল ভর্তি প্রস্তুতি (Medical Prep)</option>
                          <option value="engineering-admission" className="bg-white dark:bg-slate-900 text-slate-900 dark:text-white">ইঞ্জিনিয়ারিং ও বুয়েট (BUET/Engineering)</option>
                          <option value="university-admission" className="bg-white dark:bg-slate-900 text-slate-900 dark:text-white">বিশ্ববিদ্যালয় 'ক' ও 'খ' ইউনিট</option>
                          <option value="hsc-arts" className="bg-white dark:bg-slate-900 text-slate-900 dark:text-white">এইচএসসি মানবিক ও ব্যবসায় শিক্ষা</option>
                          <option value="ssc-academic" className="bg-white dark:bg-slate-900 text-slate-900 dark:text-white">এসএসসি বোর্ড প্রস্তুতি (SSC)</option>
                        </select>
                      </div>

                      {/* Password */}
                      <div>
                        <div className="flex items-center justify-between mb-1.5">
                          <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                            পাসওয়ার্ড <span className="text-rose-500">*</span>
                          </label>
                          {formData.password && (
                            <span className="text-[10px] font-bold text-slate-500 dark:text-slate-400">
                              পাসওয়ার্ড স্তর:{" "}
                              <span className="text-blue-600 dark:text-blue-400 font-bold">
                                {strengthLabels[strength - 1] || "খুবই দুর্বল"}
                              </span>
                            </span>
                          )}
                        </div>
                        <div className="relative">
                          <Lock className="w-4 h-4 text-slate-400 dark:text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                          <input
                            type={showPassword ? "text" : "password"}
                            required
                            placeholder="কমপক্ষে ৬ অক্ষরের পাসওয়ার্ড"
                            value={formData.password}
                            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
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

                        {/* Password strength dynamic indicator */}
                        {formData.password && (
                          <div className="grid grid-cols-4 gap-1.5 mt-2">
                            {[0, 1, 2, 3].map((step) => (
                              <div
                                key={step}
                                className={`h-1.5 rounded-full transition-all duration-300 ${strength > step ? strengthColors[strength - 1] : "bg-slate-200 dark:bg-slate-800"
                                  }`}
                              />
                            ))}
                          </div>
                        )}
                      </div>

                      {/* Terms Agreement */}
                      <div className="pt-1">
                        <label className="flex items-start gap-2.5 cursor-pointer text-xs text-slate-600 dark:text-slate-400 leading-snug select-none">
                          <input
                            type="checkbox"
                            checked={formData.agreed}
                            onChange={(e) => setFormData({ ...formData, agreed: e.target.checked })}
                            className="mt-0.5 rounded border-slate-300 dark:border-slate-700 text-blue-600 focus:ring-blue-500 accent-blue-600 w-4 h-4"
                          />
                          <span>
                            আমি Ormission-এর{" "}
                            <Link href="/terms-and-conditions" className="text-blue-600 dark:text-blue-400 font-bold hover:underline">
                              শর্তাবলী
                            </Link>{" "}
                            ও{" "}
                            <Link href="/privacy-policy" className="text-blue-600 dark:text-blue-400 font-bold hover:underline">
                              গোপনীয়তা নীতি
                            </Link>{" "}
                            মেনে অ্যাকাউন্ট তৈরি করছি।
                          </span>
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
                            <span>অ্যাকাউন্ট তৈরি হচ্ছে...</span>
                          </>
                        ) : (
                          <>
                            <span>নিবন্ধন সম্পন্ন করুন</span>
                            <ArrowRight className="w-4 h-4" />
                          </>
                        )}
                      </button>

                      {/* Mobile Login Link */}
                      <div className="text-center pt-2 sm:hidden">
                        <span className="text-xs text-slate-500 dark:text-slate-400">ইতিমধ্যে অ্যাকাউন্ট আছে? </span>
                        <Link
                          href={searchParams.get("redirect") ? `/login?redirect=${encodeURIComponent(searchParams.get("redirect")!)}` : "/login"}
                          className="text-xs font-bold text-blue-600 dark:text-blue-400 hover:underline"
                        >
                          লগইন করুন
                        </Link>
                      </div>
                    </form>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}

export default function RegisterPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center bg-background">
          <p className="text-sm font-bengali text-text-muted">লোড হচ্ছে...</p>
        </div>
      }
    >
      <RegisterContent />
    </Suspense>
  );
}
