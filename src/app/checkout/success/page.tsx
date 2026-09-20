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
  XCircle,
  RotateCcw,
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
    let isMounted = true;
    let activeChannel: any = null;

    async function loadCourse() {
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

        if (dbCourse && isMounted) {
          setCourse(mapDbCourseToAppCourse(dbCourse));
        }
      } catch (e) {
        console.error("Error loading course:", e);
      }
    }

    async function checkOrderStatus(): Promise<string | null> {
      try {
        let orderRow: any = null;

        // 1. Search by orderId in notes
        if (orderId) {
          const { data } = await supabase
            .from("orders")
            .select("id, status, notes, updated_at")
            .ilike("notes", `%${orderId}%`)
            .order("created_at", { ascending: false })
            .limit(1)
            .maybeSingle();
          if (data) orderRow = data;
        }

        // 2. Fallback: Search by txId in notes
        if (!orderRow && txId) {
          const { data: byTx } = await supabase
            .from("orders")
            .select("id, status, notes, updated_at")
            .ilike("notes", `%${txId}%`)
            .order("created_at", { ascending: false })
            .limit(1)
            .maybeSingle();
          if (byTx) orderRow = byTx;
        }

        if (orderRow && isMounted) {
          setDbStatus(orderRow.status);
          return orderRow.id;
        }
      } catch (e) {
        console.error("Error checking order status:", e);
      }
      return null;
    }

    loadCourse();

    // Initial check & subscribe to Realtime updates
    checkOrderStatus().then((foundId) => {
      if (!isMounted || !foundId) return;

      try {
        activeChannel = supabase
          .channel(`order-live-${foundId}`)
          .on(
            "postgres_changes",
            {
              event: "UPDATE",
              schema: "public",
              table: "orders",
              filter: `id=eq.${foundId}`,
            },
            (payload) => {
              if (payload.new && payload.new.status && isMounted) {
                setDbStatus(payload.new.status);
              }
            }
          )
          .subscribe();
      } catch (subErr) {
        console.warn("Realtime subscription notice:", subErr);
      }
    });

    // Continuous 3-second polling ensures instant live update under any network or Supabase tier
    const interval = setInterval(() => {
      checkOrderStatus();
    }, 3000);

    return () => {
      isMounted = false;
      clearInterval(interval);
      if (activeChannel) {
        supabase.removeChannel(activeChannel);
      }
    };
  }, [courseSlug, orderId, txId]);

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
  const isRejected = dbStatus === "failed" || dbStatus === "cancelled" || dbStatus === "rejected";
  const isPending = !isApproved && !isRejected;

  return (
    <div className="relative min-h-screen bg-background py-12 lg:py-20 flex items-center justify-center overflow-hidden px-4">
      {/* Ambient background glows */}
      <div
        className={`absolute top-1/4 left-1/2 -translate-x-1/2 w-96 h-96 rounded-full blur-3xl pointer-events-none -z-10 transition-colors duration-500 ${
          isApproved
            ? "bg-emerald-500/10 dark:bg-emerald-500/5"
            : isRejected
            ? "bg-rose-500/10 dark:bg-rose-500/5"
            : "bg-amber-500/10 dark:bg-amber-500/5"
        }`}
      />

      <div className="container-main max-w-xl w-full">
        <div className="relative bg-surface/95 backdrop-blur-xl rounded-2xl border border-border p-6 sm:p-8 shadow-xl text-center">
          {/* Status Animated Icon */}
          <div
            className={`relative w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4 shadow-xs transition-colors duration-300 ${
              isApproved
                ? "bg-emerald-500/15 text-emerald-600 dark:text-emerald-400"
                : isRejected
                ? "bg-rose-500/15 text-rose-600 dark:text-rose-400"
                : "bg-amber-500/15 text-amber-600 dark:text-amber-400"
            }`}
          >
            {isApproved ? (
              <CheckCircle2 className="w-11 h-11 text-emerald-500 stroke-[2.2]" />
            ) : isRejected ? (
              <XCircle className="w-11 h-11 text-rose-500 stroke-[2.2]" />
            ) : (
              <Clock className="w-11 h-11 text-amber-500 animate-pulse stroke-[2.2]" />
            )}
            <div
              className={`absolute -top-1 -right-1 w-6 h-6 rounded-full text-white flex items-center justify-center shadow-xs text-xs font-bold ${
                isApproved
                  ? "bg-emerald-500"
                  : isRejected
                  ? "bg-rose-600"
                  : "bg-amber-500"
              }`}
            >
              {isApproved ? "✓" : isRejected ? "✕" : "⌛"}
            </div>
          </div>

          {/* Status Pill Badge */}
          <div
            className={`inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full text-xs font-bold font-bengali mb-3 border transition-colors duration-300 ${
              isApproved
                ? "bg-emerald-500/10 border-emerald-500/25 text-emerald-600 dark:text-emerald-400"
                : isRejected
                ? "bg-rose-500/10 border-rose-500/25 text-rose-600 dark:text-rose-400"
                : "bg-amber-500/10 border-amber-500/25 text-amber-600 dark:text-amber-400"
            }`}
          >
            <span
              className={`w-2 h-2 rounded-full ${
                isApproved
                  ? "bg-emerald-500"
                  : isRejected
                  ? "bg-rose-500"
                  : "bg-amber-500 animate-ping"
              }`}
            />
            <span>
              {isApproved
                ? "পেমেন্ট অনুমোদিত ও সক্রিয় (Approved)"
                : isRejected
                ? "পেমেন্ট রিকোয়েস্ট বাতিল করা হয়েছে (Rejected)"
                : "পেমেন্ট ভেরিফিকেশন প্রক্রিয়াধীন (অপেক্ষমান)"}
            </span>
          </div>

          {/* Heading */}
          <h1 className="text-2xl sm:text-3xl font-extrabold text-text font-bengali tracking-tight mb-2.5">
            {isApproved
              ? "অভিনন্দন! ভর্তি সম্পন্ন হয়েছে"
              : isRejected
              ? "পেমেন্ট রিকোয়েস্টটি প্রত্যাখ্যাত হয়েছে"
              : "পেমেন্ট রিকোয়েস্ট সফলভাবে জমা হয়েছে!"}
          </h1>

          <p className="text-xs sm:text-sm text-text-muted font-bengali mb-4 max-w-md mx-auto leading-relaxed">
            {isApproved ? (
              "আপনার পেমেন্ট ভেরিফিকেশন সফলভাবে সম্পন্ন হয়েছে এবং কোর্সের পূর্ণাঙ্গ অ্যাক্সেস চালু করা হয়েছে। এখনই আপনার ক্লাসরুমে প্রবেশ করতে পারবেন।"
            ) : isRejected ? (
              "আপনার প্রেরিত ট্রানজাকশন আইডি (TrxID) বা পেমেন্ট তথ্যের সাথে অফিসিয়াল স্টেটমেন্ট মেলেনি অথবা অ্যাডমিন কর্তৃক রিকোয়েস্টটি বাতিল করা হয়েছে। অনুগ্রহ করে সঠিক TrxID ও নম্বর দিয়ে পুনরায় ভর্তি সম্পন্ন করুন অথবা জরুরি প্রয়োজনে হেল্পলাইনে যোগাযোগ করুন।"
            ) : (
              <>
                আমাদের টিম আপনার ট্রানজাকশন আইডি (TrxID) ও প্রেরক নম্বরটি স্টেটমেন্টের সাথে মিলিয়ে যাচাই করছে।
                ভেরিফিকেশন সম্পন্ন হওয়া মাত্রই আপনার কোর্স ক্লাসরুম চালু হয়ে যাবে{" "}
                <strong className="text-text font-medium">(সাধারণত ১৫-৩০ মিনিটের মধ্যে)</strong>।
              </>
            )}
          </p>

          {/* Live Monitor Indicator when pending */}
          {isPending && (
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-surface-secondary/80 border border-border/80 text-[11px] text-text-muted font-bengali mb-6">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-amber-500"></span>
              </span>
              <span>লাইভ স্ট্যাটাস মনিটরিং সক্রিয় • পেজ রিফ্রেশ করার প্রয়োজন নেই</span>
            </div>
          )}

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
              <div
                className={`flex items-start gap-2 p-2.5 rounded-lg border transition-colors ${
                  isApproved
                    ? "bg-surface border-emerald-500/30"
                    : isRejected
                    ? "bg-rose-500/10 border-rose-500/30"
                    : "bg-amber-500/10 border-amber-500/30"
                }`}
              >
                <div
                  className={`w-5 h-5 rounded-full flex items-center justify-center font-bold text-[11px] shrink-0 mt-0.5 ${
                    isApproved
                      ? "bg-emerald-500/20 text-emerald-600 dark:text-emerald-400"
                      : isRejected
                      ? "bg-rose-500 text-white"
                      : "bg-amber-500 text-white animate-pulse"
                  }`}
                >
                  {isApproved ? "✓" : isRejected ? "✕" : "২"}
                </div>
                <div>
                  <p
                    className={`font-bold ${
                      isApproved
                        ? "text-text"
                        : isRejected
                        ? "text-rose-700 dark:text-rose-300"
                        : "text-amber-700 dark:text-amber-300"
                    }`}
                  >
                    লেনদেন যাচাইকরণ
                  </p>
                  <p
                    className={`text-[10px] font-semibold ${
                      isApproved
                        ? "text-emerald-600 dark:text-emerald-400"
                        : isRejected
                        ? "text-rose-600 dark:text-rose-400"
                        : "text-amber-600 dark:text-amber-400"
                    }`}
                  >
                    {isApproved
                      ? "যাচাই সম্পন্ন ✓"
                      : isRejected
                      ? "বাতিল / তথ্য মেলেনি ✕"
                      : "অ্যাডমিন রিভিউ চলছে..."}
                  </p>
                </div>
              </div>

              {/* Step 3 */}
              <div
                className={`flex items-start gap-2 p-2.5 rounded-lg border transition-opacity ${
                  isApproved
                    ? "bg-surface border-emerald-500/30 opacity-100"
                    : isRejected
                    ? "bg-surface border-border/80 opacity-60"
                    : "bg-surface border-border/80 opacity-85"
                }`}
              >
                <div
                  className={`w-5 h-5 rounded-full flex items-center justify-center font-bold text-[11px] shrink-0 mt-0.5 ${
                    isApproved
                      ? "bg-emerald-500/20 text-emerald-600 dark:text-emerald-400"
                      : "bg-surface-secondary text-text-muted"
                  }`}
                >
                  {isApproved ? "✓" : isRejected ? "✕" : "৩"}
                </div>
                <div>
                  <p className="font-bold text-text">কোর্স ক্লাসরুম</p>
                  <p
                    className={`text-[10px] ${
                      isApproved
                        ? "text-emerald-600 dark:text-emerald-400 font-semibold"
                        : isRejected
                        ? "text-rose-500 font-semibold"
                        : "text-text-muted"
                    }`}
                  >
                    {isApproved
                      ? "আনলকড ✓"
                      : isRejected
                      ? "অ্যাক্সেস বন্ধ"
                      : "অনুমোদনের পর সক্রিয়"}
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
                    : isRejected
                    ? "bg-rose-500/10 text-rose-600 dark:text-rose-400 border border-rose-500/20"
                    : "bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20"
                }`}
              >
                {isApproved
                  ? "অনুমোদিত (Approved)"
                  : isRejected
                  ? "বাতিলকৃত (Rejected / Failed)"
                  : "অপেক্ষমান (Pending Review)"}
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
            ) : isRejected ? (
              <Link
                href={`/checkout/${courseSlug}`}
                className="w-full py-3 px-5 rounded-xl font-bold text-sm text-white bg-gradient-to-r from-rose-600 via-red-600 to-rose-700 hover:opacity-95 flex items-center justify-center gap-2 shadow-md hover:shadow-lg shadow-rose-600/25 transition-all"
              >
                <RotateCcw className="w-4 h-4" />
                <span>সঠিক TrxID দিয়ে পুনরায় পেমেন্ট করুন</span>
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
              href={`https://wa.me/8801728477095?text=${encodeURIComponent(
                `আসসালামু আলাইকুম, আমি অর্মিশনে একটি কোর্সের পেমেন্ট করেছিলাম। অর্ডার নম্বর: ${orderId}, TrxID: ${txId}। স্ট্যাটাস: ${dbStatus}`
              )}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 text-emerald-600 dark:text-emerald-400 font-bold hover:underline"
            >
              <MessageCircle className="w-3.5 h-3.5 text-emerald-500" />
              <span>হোয়াটসঅ্যাপে দ্রুত সহায়তা নিন</span>
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
