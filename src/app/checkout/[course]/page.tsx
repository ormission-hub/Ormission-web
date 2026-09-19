"use client";

import { useState, useEffect, use } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import {
  ShieldCheck,
  Lock,
  ArrowRight,
  Check,
  Tag,
  ArrowLeft,
  AlertCircle,
  Sparkles,
  Zap,
  CheckCircle2,
  Clock,
  Headphones,
  Shield,
  BadgeCheck,
  Loader2,
  Copy,
  LogOut,
  Wallet,
  Gift,
  BookOpen,
  Play,
} from "lucide-react";
import { getCourseBySlug, COURSES, type Course } from "@/lib/data/courses";
import { createClient } from "@/lib/supabase/client";
import { mapDbCourseToAppCourse } from "@/lib/supabase/course-mapper";

interface CheckoutPageProps {
  params: Promise<{ course: string }>;
}

type PaymentMethodType = "bkash" | "nagad" | "rocket";

interface AdminWalletInfo {
  enabled: boolean;
  accountType: "merchant" | "personal" | "agent";
  number: string;
  instruction: string;
}

interface AdminPaymentSettings {
  mode: "automatic" | "manual" | "both";
  bkash: AdminWalletInfo;
  nagad: AdminWalletInfo;
  rocket: AdminWalletInfo;
}

const defaultAdminPaymentSettings: AdminPaymentSettings = {
  mode: "both",
  bkash: {
    enabled: true,
    accountType: "merchant",
    number: "01712345678",
    instruction: "বিকাশ অ্যাপে গিয়ে 'Payment' অপশনে নম্বরটি দিন অথবা 'Send Money' করে ট্রানজ্যাকশন আইডি (TrxID) নিচে ইনপুট দিন।",
  },
  nagad: {
    enabled: true,
    accountType: "merchant",
    number: "01812345678",
    instruction: "নগদ অ্যাপ থেকে 'মার্চেন্ট পে' অথবা 'সেন্ড মানি' করে সফল ট্রানজ্যাকশন আইডি (TrxID) দিন।",
  },
  rocket: {
    enabled: true,
    accountType: "personal",
    number: "01912345678-9",
    instruction: "ডাচ-বাংলা রকেট ওয়ালেট থেকে সেন্ড মানি করুন এবং ট্রানজ্যাকশন আইডি সংরক্ষণ করে নিচে দিন।",
  },
};

export default function CheckoutPage({ params }: CheckoutPageProps) {
  const router = useRouter();
  const resolvedParams = use(params);
  const courseSlug = resolvedParams.course;
  const [course, setCourse] = useState<Course>(() => getCourseBySlug(courseSlug) || COURSES[0]);

  // Auth States
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [authChecked, setAuthChecked] = useState(false);

  // Admin Payment Settings State
  const [adminPaymentSettings, setAdminPaymentSettings] = useState<AdminPaymentSettings>(
    defaultAdminPaymentSettings
  );

  // Student Form & Payment Data
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethodType>("bkash");
  const [senderPhone, setSenderPhone] = useState("");
  const [trxId, setTrxId] = useState("");
  const [copiedNumber, setCopiedNumber] = useState(false);

  // Coupon States
  const [couponCode, setCouponCode] = useState("");
  const [discountAmount, setDiscountAmount] = useState(0);
  const [couponApplied, setCouponApplied] = useState(false);
  const [couponError, setCouponError] = useState("");
  const [couponLoading, setCouponLoading] = useState(false);
  const [appliedCouponName, setAppliedCouponName] = useState("");
  const [submitting, setSubmitting] = useState(false);

  // Enrollment & Order Status Check
  const [enrollmentStatus, setEnrollmentStatus] = useState<{
    checking: boolean;
    isEnrolled: boolean;
    isPending: boolean;
    pendingOrder?: any;
  }>({
    checking: true,
    isEnrolled: false,
    isPending: false,
  });

  // 1. Check Auth & Load Course & Admin Payment Settings
  useEffect(() => {
    let isMounted = true;
    const supabase = createClient();

    async function initializeCheckout() {
      try {
        // A. Check user session - Industrial standard: redirect immediately if not logged in
        const {
          data: { session },
        } = await supabase.auth.getSession();

        if (!session?.user) {
          router.replace(`/register?redirect=${encodeURIComponent(`/checkout/${courseSlug}`)}`);
          return;
        }

        if (isMounted) {
          setCurrentUser(session.user);
          const meta = session.user.user_metadata || {};
          setSenderPhone(meta.phone || "");
          setAuthChecked(true);
        }

        // B. Load course details from Supabase
        const { data: dbCourse, error: courseErr } = await supabase
          .from("courses")
          .select(`
            *,
            categories:category_id (*),
            instructors:instructor_id (*)
          `)
          .eq("slug", courseSlug)
          .maybeSingle();

        if (isMounted && !courseErr && dbCourse) {
          setCourse(mapDbCourseToAppCourse(dbCourse));
        }

        // C. Check if student already enrolled or has pending payment order
        try {
          const accessRes = await fetch(`/api/course/access?courseSlug=${courseSlug}`, {
            headers: session?.access_token ? { Authorization: `Bearer ${session.access_token}` } : {},
          });
          const accessData = await accessRes.json();
          if (isMounted && accessData.success) {
            setEnrollmentStatus({
              checking: false,
              isEnrolled: !!accessData.isEnrolled,
              isPending: !!accessData.isPending,
              pendingOrder: accessData.pendingOrder,
            });
          } else if (isMounted) {
            setEnrollmentStatus((prev) => ({ ...prev, checking: false }));
          }
        } catch {
          if (isMounted) setEnrollmentStatus((prev) => ({ ...prev, checking: false }));
        }

        // C. Load Admin Payment Settings from site_settings
        const { data: paySettingsData } = await supabase
          .from("site_settings")
          .select("value")
          .eq("key", "payment_settings")
          .maybeSingle();

        if (isMounted && paySettingsData?.value) {
          let parsed = paySettingsData.value;
          if (typeof parsed === "string") {
            try {
              parsed = JSON.parse(parsed);
            } catch (e) {
              // use default
            }
          }
          setAdminPaymentSettings((prev) => ({
            ...prev,
            ...parsed,
            bkash: { ...prev.bkash, ...(parsed.bkash || {}) },
            nagad: { ...prev.nagad, ...(parsed.nagad || {}) },
            rocket: { ...prev.rocket, ...(parsed.rocket || {}) },
          }));
        }
      } catch (err) {
        console.error("Checkout init error:", err);
      }
    }

    initializeCheckout();

    return () => {
      isMounted = false;
    };
  }, [courseSlug, router]);

  // Handle Logout / Switch Account
  const handleLogout = async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.replace(`/login?redirect=${encodeURIComponent(`/checkout/${courseSlug}`)}`);
  };

  // Handle DB-Driven Coupon Verification
  const handleApplyCoupon = async (e: React.FormEvent) => {
    e.preventDefault();
    setCouponError("");

    const code = couponCode.trim().toUpperCase();
    if (!code) {
      setCouponError("অনুগ্রহ করে একটি কুপন কোড লিখুন।");
      return;
    }

    setCouponLoading(true);

    try {
      const supabase = createClient();
      const { data: dbCoupon, error } = await supabase
        .from("coupons")
        .select("*")
        .eq("code", code)
        .eq("is_active", true)
        .maybeSingle();

      if (error || !dbCoupon) {
        setCouponError("কুপন কোডটি সঠিক নয় বা মেয়াদ শেষ হয়ে গেছে।");
        setCouponApplied(false);
        setDiscountAmount(0);
        setAppliedCouponName("");
      } else {
        if (dbCoupon.expires_at && new Date(dbCoupon.expires_at) < new Date()) {
          setCouponError("কুপনটির মেয়াদ শেষ হয়ে গেছে।");
          setCouponApplied(false);
          setDiscountAmount(0);
          return;
        }

        let discount = 0;
        const discountType = dbCoupon.discount_type || dbCoupon.type || "fixed";
        const val = Number(dbCoupon.discount_value || dbCoupon.value || dbCoupon.amount || 0);

        if (discountType === "percentage") {
          discount = Math.round((course.price * val) / 100);
        } else {
          discount = Math.min(course.price, val);
        }

        setDiscountAmount(discount);
        setCouponApplied(true);
        setAppliedCouponName(code);
      }
    } catch (err) {
      console.error("Coupon check error:", err);
      setCouponError("কুপন কোডটি সঠিক নয় বা মেয়াদ শেষ হয়ে গেছে।");
    } finally {
      setCouponLoading(false);
    }
  };

  const handleRemoveCoupon = () => {
    setCouponApplied(false);
    setDiscountAmount(0);
    setAppliedCouponName("");
    setCouponCode("");
    setCouponError("");
  };

  const finalPrice = Math.max(0, course.price - discountAmount);
  const savingsTotal = Math.max(0, (course.originalPrice || course.price) - finalPrice);

  // Active Wallet Data based on user selection
  const currentWallet = adminPaymentSettings[paymentMethod] || adminPaymentSettings.bkash;

  const copyWalletNumber = () => {
    navigator.clipboard.writeText(currentWallet.number);
    setCopiedNumber(true);
    setTimeout(() => setCopiedNumber(false), 2000);
  };

  // Submit Payment / Order
  const handlePayment = async (e: React.FormEvent) => {
    e.preventDefault();

    // Check if user is logged in
    if (!currentUser) {
      alert("কোর্সে ভর্তি সম্পন্ন করতে অনুগ্রহ করে আগে রেজিস্ট্রেশন বা লগইন করুন।");
      const authCard = document.getElementById("auth-requirement-card");
      if (authCard) {
        authCard.scrollIntoView({ behavior: "smooth", block: "center" });
      }
      return;
    }

    if (!senderPhone.trim()) {
      alert("অনুগ্রহ করে যে নম্বর থেকে টাকা পাঠিয়েছেন সেই মোবাইল নম্বরটি দিন।");
      return;
    }

    if (!trxId.trim()) {
      alert("অনুগ্রহ করে আপনার বিকাশ/নগদ/রকেট ট্রানজাকশন আইডি (TrxID) দিন।");
      return;
    }

    setSubmitting(true);

    const orderNumber = `ORM-${Math.floor(100000 + Math.random() * 900000)}`;
    const txIdValue = trxId.trim();

    try {
      const res = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: currentUser.id,
          courseId: course.id,
          courseSlug: course.slug,
          courseTitle: course.titleBn || course.title,
          studentName: studentDisplayName,
          studentPhone: senderPhone,
          studentEmail: currentUser.email,
          originalAmount: course.originalPrice || course.price,
          discountAmount: (course.originalPrice ? course.originalPrice - course.price : 0) + discountAmount,
          finalAmount: finalPrice,
          paymentMethod: paymentMethod,
          senderNumber: senderPhone,
          transactionId: txIdValue,
          orderNumber,
        }),
      });

      const result = await res.json();
      if (!res.ok || !result.success) {
        alert(result?.error || "অর্ডার প্রক্রিয়াকরণে সমস্যা হয়েছে। অনুগ্রহ করে আবার চেষ্টা করুন।");
        setSubmitting(false);
        return;
      }

      setSubmitting(false);
      router.push(
        `/checkout/success?orderId=${orderNumber}&txId=${encodeURIComponent(txIdValue)}&course=${course.slug}&amount=${finalPrice}&method=${paymentMethod}&sender=${encodeURIComponent(senderPhone)}&status=pending`
      );
    } catch (e: unknown) {
      console.error("Order submission error:", e);
      const msg = e instanceof Error ? e.message : "নেটওয়ার্ক সমস্যা হয়েছে। অনুগ্রহ করে আবার চেষ্টা করুন।";
      alert(msg);
      setSubmitting(false);
    }
  };

  const userMeta = currentUser?.user_metadata || {};
  const studentDisplayName = userMeta.full_name || userMeta.name || currentUser?.email?.split("@")[0] || "শিক্ষার্থী";

  // If auth is not checked or user is not logged in (waiting for redirect), show sleek checking state
  if (!authChecked || !currentUser || enrollmentStatus.checking) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-background px-4 font-bengali">
        <div className="flex flex-col items-center gap-3 p-8 rounded-2xl bg-surface border border-border shadow-lg max-w-sm w-full text-center">
          <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-primary animate-pulse">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <h2 className="text-base font-bold text-text">অ্যাকাউন্ট ও কোর্স স্ট্যাটাস যাচাই করা হচ্ছে...</h2>
          <p className="text-xs text-text-muted">
            অনুগ্রহ করে অপেক্ষা করুন, নিরাপদ চেকআউটে প্রবেশ করা হচ্ছে।
          </p>
          <Loader2 className="w-5 h-5 text-primary animate-spin mt-1" />
        </div>
      </div>
    );
  }

  // ALREADY ENROLLED GUARD SCREEN - DIRECT ACCESS TO CLASSROOM
  if (enrollmentStatus.isEnrolled) {
    return (
      <div className="min-h-screen bg-background text-text flex items-center justify-center px-4 py-12 relative overflow-hidden font-bengali">
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="relative max-w-md w-full bg-surface/95 backdrop-blur-xl rounded-3xl border border-emerald-500/30 p-6 sm:p-8 text-center shadow-2xl space-y-5 animate-in fade-in zoom-in-95 duration-200">
          <div className="w-16 h-16 rounded-2xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-500 flex items-center justify-center mx-auto shadow-lg shadow-emerald-500/20">
            <CheckCircle2 className="w-9 h-9 animate-bounce" />
          </div>

          <div className="space-y-2">
            <span className="px-3 py-1 rounded-full text-xs font-black bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border border-emerald-500/25">
              ইতিমধ্যে সক্রিয় শিক্ষার্থী
            </span>
            <h2 className="text-xl sm:text-2xl font-black text-text">
              আপনি ইতিমধ্যে এই কোর্সে ভর্তি আছেন!
            </h2>
            <p className="text-xs sm:text-sm text-text-muted leading-relaxed">
              <strong className="text-text">{course.titleBn || course.title}</strong>-এর সকল ক্লাস, স্টাডি ম্যাটেরিয়াল ও সাপোর্ট আপনার অ্যাকাউন্টে সক্রিয় রয়েছে। পুনরায় পেমেন্ট করার প্রয়োজন নেই।
            </p>
          </div>

          <div className="pt-3 space-y-3">
            <Link
              href={`/course/${course.slug}/learn`}
              className="w-full py-3.5 px-6 rounded-2xl bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-500 text-white font-bold text-sm sm:text-base flex items-center justify-center gap-2 shadow-lg shadow-emerald-500/25 hover:shadow-emerald-500/40 hover:scale-[1.02] active:scale-[0.98] transition-all cursor-pointer"
            >
              <Play className="w-4 h-4 fill-white" />
              <span>সরাসরি ক্লাসরুমে প্রবেশ করুন</span>
              <ArrowRight className="w-4 h-4" />
            </Link>

            <Link
              href="/dashboard/my-courses"
              className="w-full py-3 px-6 rounded-2xl border border-border/80 hover:border-primary/50 bg-surface-secondary/70 hover:bg-surface-secondary text-text font-bold text-xs sm:text-sm flex items-center justify-center gap-2 transition-all cursor-pointer"
            >
              <BookOpen className="w-4 h-4 text-primary" />
              <span>আমার কোর্স ড্যাশবোর্ডে যান</span>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // PENDING VERIFICATION GUARD SCREEN - AVOID DUPLICATE PURCHASES
  if (enrollmentStatus.isPending) {
    return (
      <div className="min-h-screen bg-background text-text flex items-center justify-center px-4 py-12 relative overflow-hidden font-bengali">
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="relative max-w-md w-full bg-surface/95 backdrop-blur-xl rounded-3xl border border-amber-500/30 p-6 sm:p-8 text-center shadow-2xl space-y-5 animate-in fade-in zoom-in-95 duration-200">
          <div className="w-16 h-16 rounded-2xl bg-amber-500/15 border border-amber-500/30 text-amber-500 flex items-center justify-center mx-auto shadow-lg shadow-amber-500/20">
            <Clock className="w-9 h-9 animate-pulse" />
          </div>

          <div className="space-y-2">
            <span className="px-3 py-1 rounded-full text-xs font-black bg-amber-500/15 text-amber-600 dark:text-amber-400 border border-amber-500/25">
              পেমেন্ট যাচাইকরণ অপেক্ষারত
            </span>
            <h2 className="text-xl sm:text-2xl font-black text-text">
              একটি অর্ডার ইতিমধ্যে প্রক্রিয়াধীন রয়েছে!
            </h2>
            <p className="text-xs sm:text-sm text-text-muted leading-relaxed">
              <strong className="text-text">{course.titleBn || course.title}</strong>-এর জন্য আপনার একটি পেমেন্ট রিকোয়েস্ট অ্যাডমিন টিম যাচাই করছে। অনুগ্রহ করে অনুমোদন হওয়া পর্যন্ত অপেক্ষা করুন, ডুপ্লিকেট পেমেন্ট করবেন না।
            </p>
          </div>

          {(enrollmentStatus.pendingOrder?.order_number || enrollmentStatus.pendingOrder?.transaction_id) && (
            <div className="bg-surface-secondary/70 border border-amber-500/20 rounded-2xl p-3.5 text-xs text-text-muted space-y-1.5 font-sans">
              {enrollmentStatus.pendingOrder?.order_number && (
                <div className="flex justify-between items-center">
                  <span className="text-text-muted font-bengali">অর্ডার নম্বর:</span>
                  <span className="font-bold text-text font-mono">#{enrollmentStatus.pendingOrder.order_number}</span>
                </div>
              )}
              {enrollmentStatus.pendingOrder?.transaction_id && (
                <div className="flex justify-between items-center">
                  <span className="text-text-muted font-bengali">ট্রানজ্যাকশন আইডি (TrxID):</span>
                  <span className="font-bold text-primary font-mono">{enrollmentStatus.pendingOrder.transaction_id}</span>
                </div>
              )}
              {enrollmentStatus.pendingOrder?.payment_method && (
                <div className="flex justify-between items-center">
                  <span className="text-text-muted font-bengali">পেমেন্ট মেথড:</span>
                  <span className="font-bold text-text uppercase">{enrollmentStatus.pendingOrder.payment_method}</span>
                </div>
              )}
            </div>
          )}

          <div className="pt-3 space-y-3">
            <Link
              href="/dashboard/my-courses"
              className="w-full py-3.5 px-6 rounded-2xl bg-gradient-to-r from-amber-500 via-orange-500 to-amber-600 text-white font-bold text-sm sm:text-base flex items-center justify-center gap-2 shadow-lg shadow-amber-500/25 hover:shadow-amber-500/40 hover:scale-[1.02] active:scale-[0.98] transition-all cursor-pointer"
            >
              <span>অর্ডারের অবস্থা দেখুন</span>
              <ArrowRight className="w-4 h-4" />
            </Link>

            <Link
              href={`/course/${course.slug}`}
              className="w-full py-3 px-6 rounded-2xl border border-border/80 hover:border-primary/50 bg-surface-secondary/70 hover:bg-surface-secondary text-text font-bold text-xs sm:text-sm flex items-center justify-center gap-2 transition-all cursor-pointer"
            >
              <span>কোর্স বিবরণীতে ফিরে যান</span>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen bg-background text-text py-6 md:py-10 lg:py-14 overflow-hidden">
      {/* Background Ambient Glows */}
      <div className="absolute top-10 left-1/4 -translate-x-1/2 w-96 h-96 bg-primary/10 rounded-full blur-3xl pointer-events-none -z-10" />
      <div className="absolute top-80 right-10 w-96 h-96 bg-secondary/10 rounded-full blur-3xl pointer-events-none -z-10" />

      <div className="container-main max-w-5xl px-3.5 sm:px-6">
        {/* Navigation & Breadcrumb */}
        <div className="flex flex-wrap items-center justify-between gap-3 mb-5 sm:mb-7">
          <Link
            href={`/course/${course.slug}`}
            className="inline-flex items-center gap-2 text-xs sm:text-sm font-medium text-text-muted hover:text-primary transition-all group font-bengali"
          >
            <div className="w-7 h-7 rounded-full bg-surface border border-border flex items-center justify-center group-hover:border-primary/50 group-hover:bg-primary/5 transition-all">
              <ArrowLeft className="w-3.5 h-3.5 text-text-muted group-hover:text-primary group-hover:-translate-x-0.5 transition-transform" />
            </div>
            <span>কোর্স বিস্তারিত পাতায় ফিরে যান</span>
          </Link>

          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400 text-xs font-semibold font-bengali">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
            <span>১০০% নিরাপদ ও এনক্রিপ্টেড পেমেন্ট</span>
          </div>
        </div>

        {/* Page Title & Intro */}
        <div className="mb-6 sm:mb-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-3 sm:gap-4">
            <div>
              <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-md bg-primary/10 text-primary text-[10px] sm:text-[11px] font-bold font-bengali uppercase tracking-wider mb-1.5">
                <Sparkles className="w-3 h-3" />
                <span>Express Enrollment</span>
              </div>
              <h1 className="text-xl sm:text-2xl lg:text-3xl font-extrabold text-text font-bengali tracking-normal">
                নিরাপদ চেকআউট ও কোর্স ভর্তি
              </h1>
              <p className="text-xs text-text-muted font-bengali mt-1 max-w-xl">
                আপনার সঠিক তথ্য ও পছন্দের পেমেন্ট মেথড দিয়ে কোর্সে ভর্তি সম্পন্ন করুন।
              </p>
            </div>

            <div className="hidden sm:flex items-center gap-3 bg-surface/85 backdrop-blur border border-border/80 px-3.5 py-2 rounded-xl shadow-xs">
              <div className="w-7 h-7 rounded-lg bg-primary/10 text-primary flex items-center justify-center shrink-0">
                <ShieldCheck className="w-4 h-4 text-primary" />
              </div>
              <div>
                <p className="text-xs font-bold text-text font-bengali leading-none">২৫৬-বিট SSL সিকিউরিটি</p>
                <p className="text-[10px] text-text-muted font-bengali mt-0.5">ব্যাংক গ্রেড এনক্রিপ্টেড</p>
              </div>
            </div>
          </div>
        </div>

        {/* Main Grid: Left Form & Right Sticky Summary */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 lg:gap-7 items-start">
          {/* LEFT COLUMN: Student Details + Payment Selection */}
          <div className="lg:col-span-7 space-y-5">
            {/* STEP 1: Student Account Info (Clean Verified Card) */}
            <div className="relative bg-surface/85 backdrop-blur-md rounded-2xl border border-border/90 p-4 sm:p-6 shadow-xs hover:shadow-md transition-all duration-300">
              <div className="flex items-center justify-between gap-3 mb-4 pb-3 border-b border-border/80">
                <div className="flex items-center gap-2.5">
                  <div className="w-7 h-7 rounded-lg bg-gradient-to-tr from-primary to-orange-500 text-white flex items-center justify-center font-bold text-xs shadow-xs">
                    ১
                  </div>
                  <div>
                    <h2 className="font-bold text-sm sm:text-base text-text font-bengali">
                      শিক্ষার্থীর তথ্য (নিবন্ধিত অ্যাকাউন্ট)
                    </h2>
                    <p className="text-[10px] sm:text-[11px] text-text-muted font-bengali">
                      এই অ্যাকাউন্টে কোর্সের পূর্ণাঙ্গ অ্যাক্সেস সক্রিয় হবে
                    </p>
                  </div>
                </div>

                <span className="inline-flex items-center gap-1 text-[11px] font-medium text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 px-2.5 py-0.5 rounded-full font-bengali">
                  <BadgeCheck className="w-3.5 h-3.5" />
                  লগইনকৃত
                </span>
              </div>

              <div className="space-y-3.5">
                <div className="p-3.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex flex-col sm:flex-row sm:items-center justify-between gap-2.5">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-primary to-emerald-500 text-white flex items-center justify-center font-bold text-base shadow-xs shrink-0">
                      {studentDisplayName.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <div className="flex items-center gap-1.5">
                        <span className="font-bold text-xs sm:text-sm text-text font-bengali">
                          {studentDisplayName}
                        </span>
                        <span className="text-[10px] font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-500/20 px-1.5 py-0.2 rounded font-sans">
                          VERIFIED
                        </span>
                      </div>
                      <p className="text-xs text-text-muted font-sans mt-0.5">
                        {currentUser.email} {userMeta.phone ? `· ${userMeta.phone}` : ""}
                      </p>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={handleLogout}
                    className="text-[11px] font-semibold text-text-muted hover:text-primary font-bengali flex items-center gap-1 self-start sm:self-center transition-colors cursor-pointer px-2.5 py-1 rounded-lg border border-border hover:border-primary/40 bg-surface"
                  >
                    <LogOut className="w-3 h-3" />
                    <span>অন্য অ্যাকাউন্টে লগইন</span>
                  </button>
                </div>

                <div className="p-2.5 rounded-xl bg-surface-secondary/60 border border-border/70 flex items-start gap-2 text-xs text-text-muted font-bengali">
                  <Shield className="w-3.5 h-3.5 text-secondary shrink-0 mt-0.5" />
                  <span className="text-[11px] leading-snug">
                    কোর্সের সকল লেকচার, অনলাইন এক্সাম ও সার্টিফিকেট সরাসরি আপনার এই নিবন্ধিত অ্যাকাউন্টে আনলক হবে।
                  </span>
                </div>
              </div>
            </div>

            {/* STEP 2: Compact Payment Method Selection (bKash, Nagad, Rocket in 1 Row) */}
            <div className="relative bg-surface/85 backdrop-blur-md rounded-2xl border border-border/90 p-4 sm:p-6 shadow-xs hover:shadow-md transition-all duration-300">
              <div className="flex items-center justify-between gap-3 mb-3.5 pb-2.5 border-b border-border/80">
                <div className="flex items-center gap-2.5">
                  <div className="w-7 h-7 rounded-lg bg-gradient-to-tr from-primary to-orange-500 text-white flex items-center justify-center font-bold text-xs shadow-xs">
                    ২
                  </div>
                  <div>
                    <h2 className="font-bold text-sm sm:text-base text-text font-bengali">
                      পেমেন্ট মাধ্যম বেছে নিন
                    </h2>
                    <p className="text-[10px] sm:text-[11px] text-text-muted font-bengali">
                      এডমিনের সেট করা বিকাশ, নগদ বা রকেট ওয়ালেটে ফি পরিশোধ করুন
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-1 text-[11px] font-semibold text-primary font-bengali">
                  <Zap className="w-3 h-3" />
                  <span>তাৎক্ষণিক অ্যাক্টিভেশন</span>
                </div>
              </div>

              {/* Compact 3-in-1-Row Grid for bKash, Nagad, Rocket */}
              <div className="grid grid-cols-3 gap-2 sm:gap-3.5 mb-4">
                {/* 1. bKash */}
                <button
                  type="button"
                  onClick={() => setPaymentMethod("bkash")}
                  className={`group relative text-center p-2 sm:p-3 rounded-xl border-2 transition-all duration-200 cursor-pointer flex flex-col items-center justify-between min-h-[92px] sm:min-h-[102px] ${
                    paymentMethod === "bkash"
                      ? "border-[#E2136E] bg-[#E2136E]/8 ring-2 ring-[#E2136E]/20 shadow-xs"
                      : "border-border/80 hover:border-[#E2136E]/40 bg-surface hover:bg-[#E2136E]/[0.02]"
                  }`}
                >
                  <div
                    className={`absolute top-1.5 right-1.5 w-4 h-4 rounded-full flex items-center justify-center transition-all ${
                      paymentMethod === "bkash"
                        ? "bg-[#E2136E] text-white scale-100 shadow-xs"
                        : "border border-border/80 text-transparent opacity-0 group-hover:opacity-100"
                    }`}
                  >
                    <Check className="w-2.5 h-2.5 stroke-[3]" />
                  </div>

                  <div className="h-7 sm:h-8 px-2 py-0.5 bg-white rounded-lg shadow-2xs border border-slate-200/90 flex items-center justify-center w-full max-w-[85px] mt-0.5">
                    <Image
                      src="/images/payment/bkash.svg"
                      alt="bKash Logo"
                      width={65}
                      height={24}
                      className="h-5 sm:h-6 w-auto object-contain"
                    />
                  </div>

                  <div className="mt-1">
                    <span className="text-xs sm:text-sm font-bold text-text font-bengali block leading-tight">
                      বিকাশ
                    </span>
                    <span className="text-[10px] text-[#E2136E] font-bold font-bengali block mt-0.5">
                      {adminPaymentSettings.bkash.accountType === "merchant" ? "মার্চেন্ট পে" : "সেন্ড মানি"}
                    </span>
                  </div>
                </button>

                {/* 2. Nagad */}
                <button
                  type="button"
                  onClick={() => setPaymentMethod("nagad")}
                  className={`group relative text-center p-2 sm:p-3 rounded-xl border-2 transition-all duration-200 cursor-pointer flex flex-col items-center justify-between min-h-[92px] sm:min-h-[102px] ${
                    paymentMethod === "nagad"
                      ? "border-[#F7941D] bg-[#F7941D]/8 ring-2 ring-[#F7941D]/20 shadow-xs"
                      : "border-border/80 hover:border-[#F7941D]/40 bg-surface hover:bg-[#F7941D]/[0.02]"
                  }`}
                >
                  <div
                    className={`absolute top-1.5 right-1.5 w-4 h-4 rounded-full flex items-center justify-center transition-all ${
                      paymentMethod === "nagad"
                        ? "bg-[#F7941D] text-white scale-100 shadow-xs"
                        : "border border-border/80 text-transparent opacity-0 group-hover:opacity-100"
                    }`}
                  >
                    <Check className="w-2.5 h-2.5 stroke-[3]" />
                  </div>

                  <div className="h-7 sm:h-8 px-2 py-0.5 bg-white rounded-lg shadow-2xs border border-slate-200/90 flex items-center justify-center w-full max-w-[85px] mt-0.5">
                    <Image
                      src="/images/payment/nagad.svg"
                      alt="Nagad Logo"
                      width={65}
                      height={24}
                      className="h-5 sm:h-6 w-auto object-contain"
                    />
                  </div>

                  <div className="mt-1">
                    <span className="text-xs sm:text-sm font-bold text-text font-bengali block leading-tight">
                      নগদ
                    </span>
                    <span className="text-[10px] text-[#F7941D] font-bold font-bengali block mt-0.5">
                      {adminPaymentSettings.nagad.accountType === "merchant" ? "মার্চেন্ট পে" : "সেন্ড মানি"}
                    </span>
                  </div>
                </button>

                {/* 3. Rocket */}
                <button
                  type="button"
                  onClick={() => setPaymentMethod("rocket")}
                  className={`group relative text-center p-2 sm:p-3 rounded-xl border-2 transition-all duration-200 cursor-pointer flex flex-col items-center justify-between min-h-[92px] sm:min-h-[102px] ${
                    paymentMethod === "rocket"
                      ? "border-[#8C3494] bg-[#8C3494]/8 ring-2 ring-[#8C3494]/20 shadow-xs"
                      : "border-border/80 hover:border-[#8C3494]/40 bg-surface hover:bg-[#8C3494]/[0.02]"
                  }`}
                >
                  <div
                    className={`absolute top-1.5 right-1.5 w-4 h-4 rounded-full flex items-center justify-center transition-all ${
                      paymentMethod === "rocket"
                        ? "bg-[#8C3494] text-white scale-100 shadow-xs"
                        : "border border-border/80 text-transparent opacity-0 group-hover:opacity-100"
                    }`}
                  >
                    <Check className="w-2.5 h-2.5 stroke-[3]" />
                  </div>

                  <div className="h-7 sm:h-8 px-2 py-0.5 bg-white rounded-lg shadow-2xs border border-slate-200/90 flex items-center justify-center w-full max-w-[85px] mt-0.5">
                    <Image
                      src="/images/payment/rocket.svg"
                      alt="Rocket Logo"
                      width={65}
                      height={24}
                      className="h-5 sm:h-6 w-auto object-contain"
                    />
                  </div>

                  <div className="mt-1">
                    <span className="text-xs sm:text-sm font-bold text-text font-bengali block leading-tight">
                      রকেট
                    </span>
                    <span className="text-[10px] text-[#8C3494] font-bold font-bengali block mt-0.5">
                      DBBL ওয়ালেট
                    </span>
                  </div>
                </button>
              </div>

              {/* Dynamic Admin Payment Instructions & Number Card */}
              <div className="p-3.5 sm:p-4 rounded-xl bg-surface-secondary/70 border border-border space-y-3">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2.5 border-b border-border/70">
                  <div>
                    <span className="text-[10px] font-bold text-primary uppercase font-sans tracking-wider block">
                      Official {paymentMethod.toUpperCase()} Details
                    </span>
                    <span className="text-xs font-bold text-text font-bengali">
                      অ্যাডমিনের {paymentMethod === "bkash" ? "বিকাশ" : paymentMethod === "nagad" ? "নগদ" : "রকেট"} নম্বর:
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="font-mono font-black text-sm sm:text-base text-text bg-surface px-2.5 py-1 rounded-lg border border-border">
                      {currentWallet.number}
                    </span>
                    <button
                      type="button"
                      onClick={copyWalletNumber}
                      className="px-2.5 py-1 rounded-lg bg-surface border border-border hover:border-primary/50 text-xs font-bengali font-semibold flex items-center gap-1 transition-all cursor-pointer"
                    >
                      {copiedNumber ? (
                        <>
                          <Check className="w-3.5 h-3.5 text-emerald-500" />
                          <span className="text-emerald-600 dark:text-emerald-400">কপি হয়েছে!</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-3.5 h-3.5" />
                          <span>কপি করুন</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>

                {/* Instruction */}
                <p className="text-xs text-text-muted font-bengali leading-relaxed">
                  {currentWallet.instruction}
                </p>

                {/* TrxID Input & Sender Phone inputs for payment verification */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                  <div>
                    <label className="block text-[11px] font-bold text-text font-bengali mb-1">
                      যে নম্বর থেকে টাকা পাঠিয়েছেন *
                    </label>
                    <input
                      type="tel"
                      placeholder="017XXXXXXXX"
                      value={senderPhone}
                      onChange={(e) => setSenderPhone(e.target.value)}
                      className="w-full px-3 py-2 rounded-lg border border-border bg-surface text-xs font-sans outline-none focus:border-primary focus:ring-1 focus:ring-primary"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-text font-bengali mb-1">
                      ট্রানজ্যাকশন আইডি (TrxID) *
                    </label>
                    <input
                      type="text"
                      placeholder="উদা: 9A8B7C6D"
                      value={trxId}
                      onChange={(e) => setTrxId(e.target.value.toUpperCase())}
                      className="w-full px-3 py-2 rounded-lg border border-border bg-surface text-xs font-sans uppercase font-bold outline-none focus:border-primary focus:ring-1 focus:ring-primary"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* RIGHT COLUMN: Order Summary Card (Sticky) */}
          <div className="lg:col-span-5">
            <div className="sticky top-20 space-y-4">
              <div className="relative bg-surface/90 backdrop-blur-xl rounded-2xl border border-border/90 p-4 sm:p-5 shadow-md hover:shadow-lg transition-all duration-300">
                <div className="flex items-center justify-between pb-3 mb-3.5 border-b border-border/80">
                  <h3 className="font-extrabold text-sm sm:text-base text-text font-bengali flex items-center gap-2">
                    <Wallet className="w-4 h-4 text-primary" />
                    <span>অর্ডার বিবরণী</span>
                  </h3>
                  <span className="text-[10px] font-bold text-primary bg-primary/10 px-2 py-0.5 rounded-full font-sans">
                    1 Item
                  </span>
                </div>

                {/* Course Mini Card */}
                <div className="flex gap-3 p-2.5 rounded-xl bg-surface-secondary/50 border border-border/70 mb-4">
                  <div className="relative w-20 h-14 sm:w-22 sm:h-16 rounded-lg overflow-hidden shrink-0 bg-slate-900 border border-border/80 shadow-xs">
                    <Image
                      src={
                        course.thumbnail ||
                        (course as any).thumbnail_url ||
                        "https://images.unsplash.com/photo-1636466497217-26a8cbeaf0aa?q=80&w=800&auto=format&fit=crop"
                      }
                      alt={course.titleBn || course.title}
                      fill
                      unoptimized={Boolean(course.thumbnail?.startsWith("http"))}
                      className="object-cover transition-transform duration-300 hover:scale-105"
                    />
                  </div>

                  <div className="flex-1 min-w-0 flex flex-col justify-between py-0.5">
                    <div>
                      <span className="text-[10px] font-bold text-secondary bg-secondary/10 px-1.5 py-0.5 rounded font-bengali inline-block mb-0.5">
                        {course.categoryNameBn || "একাডেমিক কোর্স"}
                      </span>
                      <h4 className="font-bold text-xs sm:text-sm text-text font-bengali line-clamp-2 leading-snug">
                        {course.titleBn || course.title}
                      </h4>
                    </div>

                    <div className="flex items-center gap-2 text-[10px] text-text-muted font-bengali mt-0.5">
                      <span className="inline-flex items-center gap-1 text-emerald-600 dark:text-emerald-400 font-semibold">
                        <Check className="w-3 h-3" /> আজীবন অ্যাক্সেস
                      </span>
                    </div>
                  </div>
                </div>

                {/* Clean DB-Driven Coupon Box (No fake/hardcoded suggestions) */}
                <div className="border-t border-border/80 pt-3.5 mb-3.5">
                  <div className="flex items-center justify-between mb-1.5">
                    <label className="text-xs font-bold text-text font-bengali flex items-center gap-1.5">
                      <Tag className="w-3.5 h-3.5 text-primary" />
                      <span>কুপন কোড (যদি থাকে)</span>
                    </label>
                    {couponApplied && (
                      <button
                        type="button"
                        onClick={handleRemoveCoupon}
                        className="text-[11px] font-medium text-error hover:underline font-bengali cursor-pointer"
                      >
                        কুপন সরান
                      </button>
                    )}
                  </div>

                  <form onSubmit={handleApplyCoupon} className="flex gap-2">
                    <div className="relative flex-1">
                      <input
                        type="text"
                        placeholder="কুপন কোড লিখুন"
                        value={couponCode}
                        disabled={couponApplied || couponLoading}
                        onChange={(e) => setCouponCode(e.target.value)}
                        className="w-full px-3 py-2 rounded-xl border border-border bg-surface-secondary/40 focus:bg-surface focus:border-primary focus:ring-2 focus:ring-primary/20 text-xs font-sans uppercase font-bold tracking-wider transition-all outline-none text-text disabled:opacity-60"
                      />
                    </div>
                    <button
                      type="submit"
                      disabled={couponApplied || !couponCode.trim() || couponLoading}
                      className="px-3.5 py-2 rounded-xl bg-surface border border-border font-bengali font-bold text-xs text-text hover:text-primary hover:border-primary/50 transition-all disabled:opacity-40 disabled:cursor-not-allowed shrink-0 cursor-pointer shadow-xs active:scale-95 flex items-center gap-1.5"
                    >
                      {couponLoading ? (
                        <Loader2 className="w-3.5 h-3.5 animate-spin" />
                      ) : couponApplied ? (
                        "প্রযুক্ত ✓"
                      ) : (
                        "প্রয়োগ"
                      )}
                    </button>
                  </form>

                  {couponError && (
                    <p className="text-[11px] text-error font-bengali mt-1.5 flex items-center gap-1 bg-error/10 px-2.5 py-1 rounded-lg border border-error/20">
                      <AlertCircle className="w-3 h-3 shrink-0" />
                      <span>{couponError}</span>
                    </p>
                  )}

                  {couponApplied && (
                    <div className="text-[11px] text-emerald-600 dark:text-emerald-400 font-bengali mt-1.5 flex items-center justify-between bg-emerald-500/10 px-2.5 py-1.5 rounded-lg border border-emerald-500/20">
                      <div className="flex items-center gap-1">
                        <CheckCircle2 className="w-3.5 h-3.5 shrink-0" />
                        <span>
                          <strong>{appliedCouponName}</strong> যুক্ত হয়েছে!
                        </span>
                      </div>
                      <span className="font-sans font-bold">-৳{discountAmount.toLocaleString("en-US")}</span>
                    </div>
                  )}
                </div>

                {/* Price Breakdown Table */}
                <div className="space-y-2.5 text-xs border-t border-border/80 pt-3 mb-5">
                  <div className="flex items-center justify-between text-text-muted font-bengali">
                    <span>মূল কোর্স ফি</span>
                    <span className="font-sans line-through text-text-muted/80">
                      ৳{(course.originalPrice || course.price + 1500).toLocaleString("en-US")}
                    </span>
                  </div>

                  <div className="flex items-center justify-between font-bengali">
                    <span className="text-text-muted">ওয়েব ডিসকাউন্ট</span>
                    <span className="font-sans text-emerald-600 dark:text-emerald-400 font-bold bg-emerald-500/10 px-1.5 py-0.5 rounded text-[11px]">
                      -৳{Math.max(0, (course.originalPrice || course.price + 1500) - course.price).toLocaleString("en-US")}
                    </span>
                  </div>

                  {discountAmount > 0 && (
                    <div className="flex items-center justify-between text-primary font-bengali font-bold">
                      <span className="flex items-center gap-1">
                        <Gift className="w-3.5 h-3.5" />
                        <span>কুপন ডিসকাউন্ট</span>
                      </span>
                      <span className="font-sans bg-primary/10 px-1.5 py-0.5 rounded text-[11px]">
                        -৳{discountAmount.toLocaleString("en-US")}
                      </span>
                    </div>
                  )}

                  {/* Total Savings Badge */}
                  {savingsTotal > 0 && (
                    <div className="flex items-center justify-between text-[11px] text-text-muted font-bengali bg-surface-secondary/60 px-2.5 py-1 rounded-lg border border-border/60">
                      <span>মোট সাশ্রয়:</span>
                      <span className="font-sans font-extrabold text-emerald-600 dark:text-emerald-400">
                        ৳{savingsTotal.toLocaleString("en-US")}
                      </span>
                    </div>
                  )}

                  {/* Grand Total Row */}
                  <div className="flex items-center justify-between text-sm sm:text-base font-extrabold text-text font-bengali border-t-2 border-dashed border-border/90 pt-3">
                    <div>
                      <span>সর্বমোট প্রদেয়</span>
                      <p className="text-[10px] text-text-muted font-normal">সকল ফি অন্তর্ভুক্ত</p>
                    </div>
                    <div className="text-right">
                      <span className="text-2xl sm:text-3xl font-black text-primary font-sans tracking-tight">
                        ৳{finalPrice.toLocaleString("en-US")}
                      </span>
                    </div>
                  </div>
                </div>

                {/* High Converting Pay CTA Button */}
                <button
                  type="button"
                  onClick={handlePayment}
                  disabled={submitting}
                  className="group relative w-full py-3.5 px-5 rounded-xl font-bold font-bengali text-base sm:text-lg text-white bg-gradient-to-r from-primary via-orange-500 to-amber-500 hover:from-primary-hover hover:via-orange-600 hover:to-amber-600 shadow-md hover:shadow-xl hover:shadow-primary/25 active:scale-[0.99] transition-all duration-200 cursor-pointer overflow-hidden flex items-center justify-center gap-2 disabled:opacity-75 disabled:cursor-wait"
                >
                  <div className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-1000 bg-gradient-to-r from-transparent via-white/20 to-transparent pointer-events-none" />

                  {submitting ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      <span>ভর্তি প্রক্রিয়া সম্পন্ন হচ্ছে...</span>
                    </>
                  ) : (
                    <>
                      <Lock className="w-4 h-4 text-white/90" />
                      <span>৳{finalPrice.toLocaleString("en-US")} পরিশোধ করে ভর্তি নিশ্চিত করুন</span>
                      <ArrowRight className="w-4 h-4 text-white/90 group-hover:translate-x-1 transition-transform" />
                    </>
                  )}
                </button>

                {/* Guarantees & Features */}
                <div className="mt-4 pt-3.5 border-t border-border/80 space-y-1.5 text-[10px] sm:text-[11px] text-text-muted font-bengali">
                  <div className="flex items-center gap-2">
                    <Clock className="w-3.5 h-3.5 text-secondary shrink-0" />
                    <span>পেমেন্টের সাথে সাথেই ক্লাসরুম আনলক হবে</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                    <span>৪৮ ঘণ্টার শর্তসাপেক্ষ মানি-ব্যাক রিফান্ড গ্যারান্টি</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Headphones className="w-3.5 h-3.5 text-primary shrink-0" />
                    <span>যেকোনো সমস্যায় সরাসরি লাইভ সাপোর্ট হেল্পলাইন</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
