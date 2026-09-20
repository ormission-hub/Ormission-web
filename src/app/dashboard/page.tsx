"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  Play,
  BookOpen,
  Clock,
  Award,
  ArrowRight,
  CheckCircle2,
  Flame,
  Receipt,
  ExternalLink,
  Sparkles,
  RefreshCw,
} from "lucide-react";
import { createClient } from "@/lib/supabase/client";

export default function DashboardOverviewPage() {
  const [user, setUser] = useState<any>(null);
  const [orders, setOrders] = useState<any[]>([]);
  const [dbCourses, setDbCourses] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const loadData = async () => {
    setLoading(true);
    try {
      const supabase = createClient();
      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (session?.user) {
        setUser(session.user);
        let loadedOrders: any[] = [];
        try {
          const res = await fetch(`/api/orders?userId=${session.user.id}`);
          if (res.ok) {
            const data = await res.json();
            if (data?.success && Array.isArray(data.data)) {
              loadedOrders = data.data;
            }
          }
        } catch (fetchErr) {
          console.warn("API orders fetch warning, attempting fallback:", fetchErr);
        }

        // Direct Supabase query fallback if API returned empty or failed
        if (loadedOrders.length === 0) {
          try {
            const { data: directOrders } = await supabase
              .from("orders")
              .select(`
                *,
                courses:course_id (
                  id,
                  title,
                  title_bn,
                  slug,
                  thumbnail_url
                )
              `)
              .eq("user_id", session.user.id)
              .order("created_at", { ascending: false });

            if (directOrders && directOrders.length > 0) {
              loadedOrders = directOrders.map((ord: any) => {
                let parsedNotes: any = {};
                try {
                  if (ord.notes && ord.notes.startsWith("{")) {
                    parsedNotes = JSON.parse(ord.notes);
                  }
                } catch {}
                return {
                  ...ord,
                  orderNumber: parsedNotes.order_number || ord.id?.slice(0, 8)?.toUpperCase(),
                  senderNumber: parsedNotes.sender_number || "",
                  transactionId: parsedNotes.transaction_id || "",
                  courseTitle:
                    ord.courses?.title_bn ||
                    ord.courses?.title ||
                    parsedNotes.course_title ||
                    "কোর্স",
                };
              });
            }
          } catch (supaErr) {
            console.warn("Direct Supabase query warning:", supaErr);
          }
        }

        setOrders(loadedOrders);
      }

      // Load all published real courses from Supabase
      const { data: coursesData } = await supabase
        .from("courses")
        .select(`
          id,
          title,
          title_bn,
          slug,
          price,
          original_price,
          thumbnail_url,
          is_featured,
          categories:category_id (name, name_bn)
        `)
        .eq("status", "published")
        .order("created_at", { ascending: false });

      if (coursesData) {
        setDbCourses(coursesData);
      }
    } catch (e) {
      console.error("Error loading dashboard overview:", e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const userMeta = user?.user_metadata || {};
  const studentName =
    userMeta.full_name ||
    userMeta.name ||
    user?.email?.split("@")[0] ||
    "শিক্ষার্থী";

  const paidOrders = orders.filter(
    (o) => o.status === "paid" || o.status === "completed"
  );
  const pendingOrders = orders.filter((o) => o.status === "pending");

  // Determine active course
  const activePaidOrder = paidOrders[0];
  const activePendingOrder = pendingOrders[0];

  // Filter out courses that student has already ordered or pending
  const orderedCourseIds = new Set(
    orders.map((o) => o.course_id || o.courses?.id)
  );
  const availableExploreCourses = dbCourses.filter(
    (c) => !orderedCourseIds.has(c.id)
  );

  return (
    <div className="space-y-8 font-bengali">
      {/* Welcome Banner */}
      <div className="bg-surface rounded-2xl border border-border p-6 lg:p-8 shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 relative overflow-hidden">
        <div className="relative z-10">
          <div className="inline-flex items-center gap-1.5 text-xs font-semibold text-primary px-2.5 py-0.5 rounded-full bg-primary/10 mb-2.5">
            <Sparkles className="w-3.5 h-3.5" />
            <span>আজকের স্টাডি সেশন</span>
          </div>

          <h1 className="text-2xl lg:text-3xl font-extrabold text-text tracking-tight">
            স্বাগতম, {studentName}!
          </h1>

          <p className="text-xs lg:text-sm text-text-muted mt-1 max-w-xl leading-relaxed">
            আপনার লক্ষ্য অর্জনে প্রতিদিনের ধারাবাহিকতাই মূল চাবিকাঠি। নিয়মিত ক্লাস করুন ও অনুশীলন চালিয়ে যান!
          </p>
        </div>

        <div className="flex items-center gap-2.5 bg-surface-secondary/80 px-4 py-2.5 rounded-xl shrink-0 border border-border/80">
          <Flame className="w-5 h-5 text-amber-500 animate-bounce" />
          <div>
            <span className="text-[11px] text-text-muted block leading-tight">অধ্যয়ন ধারাবাহিকতা:</span>
            <span className="text-xs font-bold text-text">সক্রিয় শিক্ষার্থী</span>
          </div>
        </div>
      </div>

      {/* Pending Orders Live Alert Banner */}
      {pendingOrders.length > 0 && (
        <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/25 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 shadow-xs">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500 text-white flex items-center justify-center shrink-0">
              <Clock className="w-5 h-5 animate-pulse" />
            </div>
            <div>
              <h4 className="font-bold text-sm text-amber-800 dark:text-amber-300">
                পেমেন্ট ভেরিফিকেশন প্রক্রিয়াধীন ({pendingOrders.length}টি কোর্স)
              </h4>
              <p className="text-xs text-amber-700/90 dark:text-amber-400/90 mt-0.5">
                কোর্স: <strong>{activePendingOrder?.courseTitle}</strong> • TrxID:{" "}
                <span className="font-mono font-bold">{activePendingOrder?.transactionId || "প্রক্রিয়াকরণাধীন"}</span>
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Link
              href="/dashboard/orders"
              className="px-3 py-1.5 rounded-lg bg-amber-500 hover:bg-amber-600 text-white text-xs font-bold transition-colors shadow-xs"
            >
              বিস্তারিত দেখুন
            </Link>
            <button
              type="button"
              onClick={loadData}
              title="স্ট্যাটাস রিফ্রেশ করুন"
              className="p-1.5 rounded-lg hover:bg-amber-500/20 text-amber-800 dark:text-amber-300 transition-colors"
            >
              <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
            </button>
          </div>
        </div>
      )}

      {/* KPI Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {/* Card 1: Active Courses */}
        <div className="bg-surface rounded-2xl border border-border p-5 flex items-center gap-4 shadow-xs">
          <div className="w-12 h-12 rounded-xl bg-primary/10 text-primary flex items-center justify-center shrink-0">
            <BookOpen className="w-6 h-6" />
          </div>
          <div>
            <span className="text-2xl font-black text-text font-sans">
              {paidOrders.length}
            </span>
            <span className="text-xs text-text-muted block">নথিভুক্ত সক্রিয় কোর্স</span>
          </div>
        </div>

        {/* Card 2: Pending Reviews */}
        <div className="bg-surface rounded-2xl border border-border p-5 flex items-center gap-4 shadow-xs">
          <div className="w-12 h-12 rounded-xl bg-amber-500/10 text-amber-600 dark:text-amber-400 flex items-center justify-center shrink-0">
            <Clock className="w-6 h-6" />
          </div>
          <div>
            <span className="text-2xl font-black text-amber-600 dark:text-amber-400 font-sans">
              {pendingOrders.length}
            </span>
            <span className="text-xs text-text-muted block">অপেক্ষমান ভেরিফিকেশন</span>
          </div>
        </div>

        {/* Card 3: Total Orders */}
        <div className="bg-surface rounded-2xl border border-border p-5 flex items-center gap-4 shadow-xs">
          <div className="w-12 h-12 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0">
            <Receipt className="w-6 h-6" />
          </div>
          <div>
            <span className="text-2xl font-black text-text font-sans">
              {orders.length}
            </span>
            <span className="text-xs text-text-muted block">মোট অর্ডার ও ট্রানজাকশন</span>
          </div>
        </div>
      </div>

      {/* Featured Active Course or Pending / Explore State */}
      {activePaidOrder ? (
        <div className="bg-surface rounded-2xl border-2 border-primary/30 p-6 shadow-sm relative overflow-hidden">
          <div className="flex flex-col lg:flex-row gap-6 items-start lg:items-center justify-between">
            <div className="flex gap-4 items-start">
              <div className="relative w-24 h-16 rounded-xl overflow-hidden shrink-0 bg-slate-900 border border-border">
                <Image
                  src={activePaidOrder.courses?.thumbnail_url || "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?q=80&w=600&auto=format&fit=crop"}
                  alt={activePaidOrder.courseTitle}
                  fill
                  className="object-cover"
                />
              </div>
              <div>
                <span className="inline-flex items-center gap-1 text-xs font-semibold text-emerald-600 dark:text-emerald-400 mb-1">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>অনুমোদিত ও সক্রিয় ক্লাস</span>
                </span>
                <h3 className="font-bold text-base lg:text-lg text-text leading-snug">
                  {activePaidOrder.courseTitle}
                </h3>
                <p className="text-xs text-text-muted mt-0.5">
                  অর্ডার আইডি: <span className="font-mono">{activePaidOrder.orderNumber}</span> • পূর্ণাঙ্গ ক্লাসরুম অ্যাক্সেস সক্রিয়
                </p>
              </div>
            </div>

            <Link
              href={`/course/${activePaidOrder.courses?.slug || "test-course"}/learn`}
              className="px-6 py-3 rounded-xl font-bold text-sm text-white bg-gradient-to-r from-primary to-orange-500 hover:from-primary-hover hover:to-orange-600 flex items-center gap-2 shrink-0 shadow-sm transition-all"
            >
              <Play className="w-4 h-4 fill-white" />
              <span>ক্লাস শুরু করুন</span>
            </Link>
          </div>
        </div>
      ) : activePendingOrder ? (
        <div className="bg-surface rounded-2xl border-2 border-amber-500/30 p-6 shadow-sm relative overflow-hidden bg-amber-500/[0.02]">
          <div className="flex flex-col lg:flex-row gap-6 items-start lg:items-center justify-between">
            <div className="flex gap-4 items-start">
              <div className="w-16 h-16 rounded-xl bg-amber-500/15 text-amber-600 dark:text-amber-400 flex items-center justify-center shrink-0">
                <Clock className="w-8 h-8 animate-pulse" />
              </div>
              <div>
                <span className="inline-flex items-center gap-1 text-xs font-bold text-amber-600 dark:text-amber-400 mb-1">
                  <span className="w-2 h-2 rounded-full bg-amber-500 animate-ping" />
                  <span>অ্যাডমিন রিভিউ প্রক্রিয়াধীন</span>
                </span>
                <h3 className="font-bold text-base lg:text-lg text-text leading-snug">
                  {activePendingOrder.courseTitle}
                </h3>
                <p className="text-xs text-text-muted mt-1 leading-relaxed max-w-lg">
                  আপনার জমা দেওয়া ট্রানজাকশন আইডিটি অ্যাডমিন টিম যাচাই করছে। যাচাই শেষ হওয়া মাত্রই ক্লাসরুম বাটনটি সক্রিয় হবে।
                </p>
              </div>
            </div>

            <Link
              href="/dashboard/orders"
              className="px-5 py-2.5 rounded-xl font-bold text-xs bg-surface border border-border hover:bg-surface-secondary text-text flex items-center gap-2 transition-colors"
            >
              <Receipt className="w-4 h-4 text-primary" />
              <span>অর্ডারের অবস্থা দেখুন</span>
            </Link>
          </div>
        </div>
      ) : (
        <div className="bg-surface rounded-2xl border border-border p-6 sm:p-8 text-center shadow-xs">
          <BookOpen className="w-12 h-12 mx-auto mb-3 opacity-30 text-text-muted" />
          <h3 className="text-base font-bold text-text mb-1">
            আপনার অ্যাকাউন্টে এখনো কোনো সক্রিয় কোর্স নেই
          </h3>
          <p className="text-xs text-text-muted mb-4 max-w-md mx-auto">
            আপনার লক্ষ্য অনুযায়ী সেরা কোর্সটি বেছে নিয়ে আজই প্রস্তুতি শুরু করুন।
          </p>
          <Link
            href="/courses"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-primary text-white text-xs font-bold shadow-xs hover:bg-primary-hover transition-all"
          >
            <span>সকল কোর্সসমূহ দেখুন</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      )}

      {/* Real Enrolled Courses or Real Explore Courses */}
      {paidOrders.length > 1 ? (
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg sm:text-xl font-bold text-text">
              আমার অন্যান্য অনুমোদিত কোর্সসমূহ
            </h2>
            <Link
              href="/dashboard/my-courses"
              className="text-xs text-primary font-bold hover:underline"
            >
              সকল কোর্স দেখুন
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {paidOrders.slice(1).map((item: any) => {
              const title = item.courseTitle;
              const slug = item.courses?.slug || "test-course";
              const thumb =
                item.courses?.thumbnail_url ||
                "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?q=80&w=600&auto=format&fit=crop";

              return (
                <div
                  key={item.id}
                  className="bg-surface rounded-2xl border border-border p-4 sm:p-5 flex flex-col justify-between hover:border-primary/40 hover:shadow-xs transition-all"
                >
                  <div className="flex gap-3 mb-3">
                    <div className="relative w-20 h-14 rounded-xl overflow-hidden shrink-0 bg-slate-900 border border-border">
                      <Image
                        src={thumb}
                        alt={title}
                        fill
                        className="object-cover"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-bold block mb-0.5">
                        অনুমোদিত কোর্স
                      </span>
                      <h4 className="font-bold text-xs sm:text-sm text-text line-clamp-2 leading-snug">
                        {title}
                      </h4>
                    </div>
                  </div>

                  <div className="pt-3 border-t border-border flex items-center justify-between">
                    <span className="text-[11px] text-text-muted">
                      অ্যাক্সেস সক্রিয়
                    </span>

                    <Link
                      href={`/course/${slug}/learn`}
                      className="inline-flex items-center gap-1 text-xs font-bold text-primary hover:underline"
                    >
                      <span>ক্লাসরুমে যান</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      ) : availableExploreCourses.length > 0 ? (
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg sm:text-xl font-bold text-text">
              প্ল্যাটফর্মের অন্যান্য কোর্সসমূহ
            </h2>
            <Link
              href="/courses"
              className="text-xs text-primary font-bold hover:underline"
            >
              সকল কোর্স দেখুন
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {availableExploreCourses.map((c: any) => {
              const title = c.title_bn || c.title;
              const thumb =
                c.thumbnail_url ||
                "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?q=80&w=600&auto=format&fit=crop";

              return (
                <div
                  key={c.id}
                  className="bg-surface rounded-2xl border border-border p-4 sm:p-5 flex flex-col justify-between hover:border-primary/40 hover:shadow-xs transition-all"
                >
                  <div className="flex gap-3 mb-3">
                    <div className="relative w-20 h-14 rounded-xl overflow-hidden shrink-0 bg-slate-900 border border-border">
                      <Image
                        src={thumb}
                        alt={title}
                        fill
                        className="object-cover"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <span className="text-[10px] text-primary font-bold block mb-0.5">
                        {c.categories?.name_bn || c.categories?.name || "কোর্স"}
                      </span>
                      <h4 className="font-bold text-xs sm:text-sm text-text line-clamp-2 leading-snug">
                        {title}
                      </h4>
                    </div>
                  </div>

                  <div className="pt-3 border-t border-border flex items-center justify-between">
                    <span className="text-xs font-bold text-text font-sans">
                      ৳{Number(c.price || 0).toLocaleString("en-US")}
                    </span>

                    <Link
                      href={`/course/${c.slug}`}
                      className="inline-flex items-center gap-1 text-xs font-bold text-primary hover:underline"
                    >
                      <span>কোর্স বিবরণী</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      ) : (
        <div className="bg-surface rounded-2xl border border-border p-6 text-center">
          <Sparkles className="w-7 h-7 text-primary mx-auto mb-2" />
          <h3 className="font-bold text-sm text-text">
            আপনি প্ল্যাটফর্মের উপলব্ধ কোর্সে যুক্ত আছেন
          </h3>
          <p className="text-xs text-text-muted mt-1">
            আমাদের নতুন ব্যাচ ও কোর্সসমূহ খুব শীঘ্রই উন্মুক্ত করা হবে।
          </p>
        </div>
      )}
    </div>
  );
}
