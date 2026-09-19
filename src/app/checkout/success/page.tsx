"use client";

import { Suspense, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import {
  Clock,
  CheckCircle2,
  Receipt,
  LayoutDashboard,
  ShieldCheck,
  BookOpen,
  PhoneCall,
  MessageCircle,
  Copy,
  Check,
  ArrowRight,
  AlertCircle,
} from "lucide-react";
import { getCourseBySlug, COURSES, type Course } from "@/lib/data/courses";
import { createClient } from "@/lib/supabase/client";
import { mapDbCourseToAppCourse } from "@/lib/supabase/course-mapper";

function SuccessContent() {
  const searchParams = useSearchParams();
  const orderId = searchParams.get("orderId") || "ORM-292682";
  const txId = searchParams.get("txId") || "TXN53788124";
  const courseSlug = searchParams.get("course") || "test-course";
  const amount = searchParams.get("amount") || "1999";
  const method = searchParams.get("method") || "bkash";
  const sender = searchParams.get("sender") || "";

  const [course, setCourse] = useState<Course>(() => getCourseBySlug(courseSlug) || COURSES[0]);
  const [copiedTx, setCopiedTx] = useState(false);
  const [dbStatus, setDbStatus] = useState<string>("pending");

  useEffect(() => {
    const supabase = createClient();

    async function loadCourseAndStatus() {
      try {
        const { data: dbCourse } = await supabase
          .from("courses")
          .select(`
            *,
            categories:category_id (*),
            instructors:instructor_id (*)
          `)
          .eq("slug", courseSlug)
          .maybeSingle();

        if (dbCourse) {
          setCourse(mapDbCourseToAppCourse(dbCourse));
        }

        // Check if order exists in DB to get real-time status
        const { data: orderData } = await supabase
          .from("orders")
          .select("status")
          .ilike("notes", `%${orderId}%`)
          .maybeSingle();

        if (orderData?.status) {
          setDbStatus(orderData.status);
        }
      } catch (e) {
        console.error("Error loading success course data:", e);
      }
    }

    loadCourseAndStatus();
  }, [courseSlug, orderId]);

  const copyTxId = () => {
    navigator.clipboard.writeText(txId);
    setCopiedTx(true);
    setTimeout(() => setCopiedTx(false), 2000);
  };

  const getMethodBadge = (m: string) => {
    switch (m.toLowerCase()) {
      case "bkash":
        return <span className="text-[#E2136E] font-bold">bKash (বিকাশ)</span>;
      case "nagad":
        return <span className="text-[#F7941D] font-bold">Nagad (নগদ)</span>;
      case "rocket":
        return <span className="text-[#8C3494] font-bold">Rocket (রকেট)</span>;
      default:
        return <span className="text-primary font-bold">ম্যানুয়াল ওয়ালেট</span>;
    }
  };

  const isApproved = dbStatus === "paid" || dbStatus === "completed";

  return (
    <div className="relative min-h-screen bg-background py-12 lg:py-20 flex items-center justify-center overflow-hidden px-4">
      {/* Ambient background glows */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-96 h-96 bg-amber-500/10 dark:bg-amber-500/5 rounded-full blur-3xl pointer-events-none -z-10" />

      <div className="container-main max-w-xl w-full">
        <div className="relative bg-surface/95 backdrop-blur-xl rounded-2xl border border-border p-6 sm:p-8 shadow-xl text-center">
          {/* Status Animated Icon */}
          <div className="relative w-20 h-20 rounded-full bg-amber-500/15 text-amber-600 dark:text-amber-400 flex items-center justify-center mx-auto mb-4 shadow-xs">
            {isApproved ? (
              <CheckCircle2 className="w-11 h-11 text-emerald-500 stroke-[2.2]" />
            ) : (
              <Clock className="w-11 h-11 text-amber-500 animate-pulse stroke-[2.2]" />
            )}
            <div className="absolute -top-1 -right-1 w-6 h-6 rounded-full bg-primary text-white flex items-center justify-center shadow-xs text-xs font-bold">
              ✓
            </div>
          </div>

          {/* Status Pill Badge */}
          <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-amber-500/10 border border-amber-500/25 text-amber-600 dark:text-amber-400 text-xs font-bold font-bengali mb-3">
            <span className="w-2 h-2 rounded-full bg-amber-500 animate-ping" />
            <span>
              {isApproved ? "পেমেন্ট অনুমোদিত ও সক্রিয়" : "পেমেন্ট ভেরিফিকেশন প্রক্রিয়াধীন (অপেক্ষমান)"}
            </span>
          </div>

          {/* Heading */}
          <h1 className="text-2xl sm:text-3xl font-extrabold text-text font-bengali tracking-tight mb-2.5">
            {isApproved ? "অভিনন্দন! ভর্তি সম্পন্ন হয়েছে" : "পেমেন্ট রিকোয়েস্ট সফলভাবে জমা হয়েছে!"}
          </h1>

          <p className="text-xs sm:text-sm text-text-muted font-bengali mb-6 max-w-md mx-auto leading-relaxed">
            {isApproved ? (
              "আপনার পেমেন্ট ভেরিফিকেশন সফলভাবে সম্পন্ন হয়েছে এবং কোর্সের পূর্ণাঙ্গ এক্সেস চালু করা হয়েছে।"
            ) : (
              <>
                আমাদের টিম আপনার ট্রানজাকশন আইডি (TrxID) ও প্রেরক নম্বরটি স্টেটমেন্টের সাথে মিলিয়ে যাচাই করছে।
                ভেরিফিকেশন সম্পন্ন হওয়া মাত্রই আপনার কোর্স ক্লাসরুম চালু হয়ে যাবে{" "}
                <strong className="text-text font-medium">(সাধারণত ১৫-৩০ মিনিটের মধ্যে)</strong>।
              </>
            )}
          </p>

          {/* 3-Step Verification Timeline */}
          <div className="bg-surface-secondary/70 rounded-xl border border-border p-4 mb-6 text-left font-bengali">
            <p className="text-xs font-bold text-text mb-3 flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-primary" />
              <span>ভেরিফিকেশন প্রক্রিয়া ও বর্তমান অবস্থা</span>
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 text-xs">
              {/* Step 1 */}
              <div className="flex items-start gap-2 p-2.5 rounded-lg bg-surface border border-emerald-500/30">
                <div className="w-5 h-5 rounded-full bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 flex items-center justify-center font-bold text-[11px] shrink-0 mt-0.5">
                  ✓
                </div>
                <div>
                  <p className="font-bold text-text">তথ্য জমাদান</p>
                  <p className="text-[10px] text-emerald-600 dark:text-emerald-400">সফলভাবে সম্পন্ন</p>
                </div>
              </div>

              {/* Step 2 */}
              <div className="flex items-start gap-2 p-2.5 rounded-lg bg-amber-500/10 border border-amber-500/30">
                <div className="w-5 h-5 rounded-full bg-amber-500 text-white flex items-center justify-center font-bold text-[11px] shrink-0 mt-0.5 animate-pulse">
                  ২
                </div>
                <div>
                  <p className="font-bold text-amber-700 dark:text-amber-300">লেনদেন যাচাইকরণ</p>
                  <p className="text-[10px] text-amber-600 dark:text-amber-400 font-semibold">
                    {isApproved ? "যাচাই সম্পন্ন ✓" : "অ্যাডমিন রিভিউ চলছে..."}
                  </p>
                </div>
              </div>

              {/* Step 3 */}
              <div className="flex items-start gap-2 p-2.5 rounded-lg bg-surface border border-border/80 opacity-85">
                <div className="w-5 h-5 rounded-full bg-surface-secondary text-text-muted flex items-center justify-center font-bold text-[11px] shrink-0 mt-0.5">
                  ৩
                </div>
                <div>
                  <p className="font-bold text-text">কোর্স ক্লাসরুম</p>
                  <p className="text-[10px] text-text-muted">
                    {isApproved ? "আনলকড ✓" : "অনুমোদনের পর সক্রিয়"}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Receipt Card */}
          <div className="bg-surface-secondary/60 rounded-xl border border-border/80 p-4 text-left text-xs mb-6 space-y-2.5">
            <div className="flex items-center justify-between pb-2 border-b border-border/60">
              <span className="text-text-muted font-bengali">অর্ডার নম্বর</span>
              <span className="font-bold text-text font-sans bg-surface px-2.5 py-0.5 rounded border border-border/60">
                {orderId}
              </span>
            </div>

            <div className="flex items-center justify-between pb-2 border-b border-border/60">
              <span className="text-text-muted font-bengali">ট্রানজাকশন আইডি (TrxID)</span>
              <div className="flex items-center gap-1.5">
                <span className="font-bold text-text font-sans font-mono bg-surface px-2 py-0.5 rounded border border-border/60">
                  {txId}
                </span>
                <button
                  type="button"
                  onClick={copyTxId}
                  title="কপি করুন"
                  className="p-1 rounded hover:bg-surface text-text-muted hover:text-text transition-colors"
                >
                  {copiedTx ? (
                    <Check className="w-3.5 h-3.5 text-emerald-500" />
                  ) : (
                    <Copy className="w-3.5 h-3.5" />
                  )}
                </button>
              </div>
            </div>

            {sender && (
              <div className="flex items-center justify-between pb-2 border-b border-border/60">
                <span className="text-text-muted font-bengali">টাকা পাঠানোর নম্বর</span>
                <span className="font-bold text-text font-sans">{sender}</span>
              </div>
            )}

            <div className="flex items-center justify-between pb-2 border-b border-border/60">
              <span className="text-text-muted font-bengali">কোর্সের নাম</span>
              <span className="font-bold text-text font-bengali max-w-[240px] truncate text-right">
                {course.titleBn || course.title}
              </span>
            </div>

            <div className="flex items-center justify-between pb-2 border-b border-border/60">
              <span className="text-text-muted font-bengali">পেমেন্ট মাধ্যম</span>
              <span>{getMethodBadge(method)}</span>
            </div>

            <div className="flex items-center justify-between pb-2 border-b border-border/60">
              <span className="text-text-muted font-bengali">ভেরিফিকেশন স্ট্যাটাস</span>
              <span
                className={`px-2 py-0.5 rounded text-[11px] font-bold font-bengali ${
                  isApproved
                    ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20"
                    : "bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20"
                }`}
              >
                {isApproved ? "অনুমোদিত (Approved)" : "অপেক্ষমান (Pending Review)"}
              </span>
            </div>

            <div className="flex items-center justify-between font-bold text-sm text-text pt-1">
              <span className="font-bengali">পরিশোধিত মোট অর্থ</span>
              <span className="text-xl font-extrabold text-primary font-sans">
                ৳{Number(amount).toLocaleString("en-US")}
              </span>
            </div>
          </div>

          {/* Action CTAs */}
          <div className="space-y-2.5 font-bengali">
            {isApproved ? (
              <Link
                href={`/course/${course.slug}/learn`}
                className="w-full py-3 px-5 rounded-xl font-bold text-sm text-white bg-gradient-to-r from-primary to-orange-500 hover:from-primary-hover hover:to-orange-600 flex items-center justify-center gap-2 shadow-md hover:shadow-lg transition-all"
              >
                <span>কোর্সের ক্লাস শুরু করুন</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            ) : (
              <Link
                href="/dashboard/orders"
                className="w-full py-3 px-5 rounded-xl font-bold text-sm text-white bg-slate-900 hover:bg-slate-800 dark:bg-white dark:text-slate-900 dark:hover:bg-slate-100 flex items-center justify-center gap-2 shadow-sm transition-all"
              >
                <Receipt className="w-4 h-4" />
                <span>আমার অর্ডার ও পেমেন্ট হিস্ট্রি দেখুন</span>
              </Link>
            )}

            <div className="grid grid-cols-2 gap-2">
              <Link
                href="/dashboard"
                className="py-2.5 px-4 rounded-xl font-semibold text-xs text-text bg-surface border border-border hover:bg-surface-secondary flex items-center justify-center gap-1.5 transition-colors"
              >
                <LayoutDashboard className="w-3.5 h-3.5 text-primary" />
                <span>ড্যাশবোর্ডে যান</span>
              </Link>

              <Link
                href="/courses"
                className="py-2.5 px-4 rounded-xl font-semibold text-xs text-text bg-surface border border-border hover:bg-surface-secondary flex items-center justify-center gap-1.5 transition-colors"
              >
                <BookOpen className="w-3.5 h-3.5 text-text-muted" />
                <span>অন্যান্য কোর্সসমূহ</span>
              </Link>
            </div>
          </div>

          {/* Helpline & WhatsApp support note */}
          <div className="mt-6 pt-4 border-t border-border/80 bg-surface-secondary/40 rounded-xl p-3 text-[11px] text-text-muted font-bengali flex flex-col sm:flex-row items-center justify-between gap-2">
            <div className="flex items-center gap-1.5">
              <PhoneCall className="w-3.5 h-3.5 text-primary shrink-0" />
              <span>জরুরি প্রয়োজনে হেল্পলাইন: <strong>০১৭২৮-৪৭৭০৯৫</strong></span>
            </div>
            <a
              href={`https://wa.me/8801728477095?text=${encodeURIComponent(`আসসালামু আলাইকুম, আমি অর্মিশনে একটি কোর্সের পেমেন্ট সম্পন্ন করেছি। অর্ডার নম্বর: ${orderId}, TrxID: ${txId}`)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 text-emerald-600 dark:text-emerald-400 font-bold hover:underline"
            >
              <MessageCircle className="w-3.5 h-3.5 text-emerald-500" />
              <span>হোয়াটসঅ্যাপে দ্রুত ভেরিফাই চান?</span>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function CheckoutSuccessPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center bg-background">
          <p className="text-sm font-bengali text-text-muted">লোড হচ্ছে...</p>
        </div>
      }
    >
      <SuccessContent />
    </Suspense>
  );
}
