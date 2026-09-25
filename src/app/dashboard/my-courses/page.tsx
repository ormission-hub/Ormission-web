"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  Play,
  BookOpen,
  Clock,
  CheckCircle2,
  Receipt,
  RefreshCw,
  ArrowRight,
  Sparkles,
  XCircle,
  RotateCcw,
  Headphones,
} from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { COURSES } from "@/lib/data/courses";

export default function MyCoursesPage() {
  const [filter, setFilter] = useState<"all" | "approved" | "pending" | "rejected">("all");
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const loadCourses = async () => {
    setLoading(true);
    try {
      const supabase = createClient();
      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (session?.user) {
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
          console.warn("API orders fetch warning in my-courses:", fetchErr);
        }

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
            console.warn("Direct Supabase query warning in my-courses:", supaErr);
          }
        }

        setOrders(loadedOrders);
      }
    } catch (e) {
      console.error("Error loading student courses:", e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCourses();
  }, []);

  const approvedOrders = (orders || []).filter(
    (o) => o && (o.status === "paid" || o.status === "completed")
  );
  const approvedCourseIds = new Set(
    approvedOrders
      .map((o) => {
        const c = Array.isArray(o.courses) ? o.courses[0] : o.courses;
        return String(o.course_id || c?.id || "");
      })
      .filter(Boolean)
  );

  const pendingOrders = (orders || []).filter((o) => {
    if (!o || o.status !== "pending") return false;
    const c = Array.isArray(o.courses) ? o.courses[0] : o.courses;
    return !approvedCourseIds.has(String(o.course_id || c?.id || ""));
  });

  const rejectedOrders = (orders || []).filter((o) => {
    if (!o) return false;
    const isRej =
      o.status === "failed" || o.status === "cancelled" || o.status === "rejected";
    if (!isRej) return false;
    const c = Array.isArray(o.courses) ? o.courses[0] : o.courses;
    return !approvedCourseIds.has(String(o.course_id || c?.id || ""));
  });

  const displayedList =
    filter === "approved"
      ? approvedOrders
      : filter === "pending"
      ? pendingOrders
      : filter === "rejected"
      ? rejectedOrders
      : [...approvedOrders, ...pendingOrders, ...rejectedOrders];

  return (
    <div className="space-y-6 font-bengali">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-text">
            আমার নথিভুক্ত কোর্সসমূহ ({orders.length})
          </h1>
          <p className="text-xs text-text-muted mt-0.5">
            আপনার সকল অনুমোদিত, অপেক্ষমান ও সমন্বয়কৃত কোর্সের ক্লাসরুম তালিকা
          </p>
        </div>

        {/* Filter Tabs */}
        <div className="flex flex-wrap items-center gap-1.5 p-1 bg-surface-secondary/80 rounded-xl text-xs font-semibold border border-border/60">
          <button
            type="button"
            onClick={() => setFilter("all")}
            className={`px-3 py-1.5 rounded-lg transition-all ${
              filter === "all"
                ? "bg-surface text-primary shadow-xs font-bold"
                : "text-text-muted hover:text-text"
            }`}
          >
            সকল ({orders.length})
          </button>
          <button
            type="button"
            onClick={() => setFilter("approved")}
            className={`px-3 py-1.5 rounded-lg transition-all flex items-center gap-1 ${
              filter === "approved"
                ? "bg-surface text-emerald-600 dark:text-emerald-400 shadow-xs font-bold"
                : "text-text-muted hover:text-text"
            }`}
          >
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>অনুমোদিত ({approvedOrders.length})</span>
          </button>
          <button
            type="button"
            onClick={() => setFilter("pending")}
            className={`px-3 py-1.5 rounded-lg transition-all flex items-center gap-1 ${
              filter === "pending"
                ? "bg-surface text-amber-600 dark:text-amber-400 shadow-xs font-bold"
                : "text-text-muted hover:text-text"
            }`}
          >
            <Clock className="w-3.5 h-3.5" />
            <span>অপেক্ষমান ({pendingOrders.length})</span>
          </button>
          {rejectedOrders.length > 0 && (
            <button
              type="button"
              onClick={() => setFilter("rejected")}
              className={`px-3 py-1.5 rounded-lg transition-all flex items-center gap-1 ${
                filter === "rejected"
                  ? "bg-surface text-rose-600 dark:text-rose-400 shadow-xs font-bold"
                  : "text-text-muted hover:text-text"
              }`}
            >
              <XCircle className="w-3.5 h-3.5" />
              <span>বাতিলকৃত ({rejectedOrders.length})</span>
            </button>
          )}
        </div>
      </div>

      {/* Grid */}
      {loading ? (
        <div className="bg-surface rounded-2xl border border-border p-12 text-center text-xs text-text-muted">
          <RefreshCw className="w-6 h-6 mx-auto mb-2 animate-spin text-primary" />
          আপনার নথিভুক্ত কোর্সগুলো লোড হচ্ছে...
        </div>
      ) : displayedList.length === 0 ? (
        <div className="bg-surface rounded-2xl border border-border p-12 text-center shadow-xs">
          <BookOpen className="w-12 h-12 mx-auto mb-3 opacity-30 text-text-muted" />
          <h3 className="text-base font-bold text-text mb-1">
            {filter === "pending"
              ? "কোনো কোর্স বর্তমানে অপেক্ষমান নেই"
              : filter === "approved"
              ? "কোনো অনুমোদিত কোর্স এখনো নেই"
              : filter === "rejected"
              ? "কোনো বাতিলকৃত কোর্স নেই"
              : "আপনার কোনো নথিভুক্ত কোর্স নেই"}
          </h3>
          <p className="text-xs text-text-muted mb-4 max-w-sm mx-auto">
            আপনার পছন্দের কোর্সে ভর্তি হয়ে অনলাইন ক্লাস শুরু করুন।
          </p>
          <Link
            href="/courses"
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-primary text-white text-xs font-bold shadow-xs hover:bg-primary-hover transition-colors"
          >
            <span>কোর্সসমূহ এক্সপ্লোর করুন</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {displayedList.map((order) => {
            const isApproved =
              order.status === "paid" || order.status === "completed";
            const isRejected =
              order.status === "failed" ||
              order.status === "cancelled" ||
              order.status === "rejected";
            const isPending = order.status === "pending";

            const courseObj = Array.isArray(order.courses) ? order.courses[0] : order.courses;
            const slug = courseObj?.slug || "test-course";
            const thumb =
              courseObj?.thumbnail_url || COURSES[0]?.thumbnail || "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?q=80&w=800&auto=format&fit=crop";

            return (
              <div
                key={order.id}
                className={`bg-surface rounded-2xl border overflow-hidden flex flex-col justify-between shadow-xs transition-all ${
                  isApproved
                    ? "border-border hover:border-primary/40"
                    : isRejected
                    ? "border-rose-500/30 bg-rose-500/[0.02]"
                    : "border-amber-500/30 bg-amber-500/[0.02]"
                }`}
              >
                <div>
                  <div className="relative aspect-video w-full overflow-hidden bg-slate-900">
                    <Image
                      src={thumb}
                      alt={order.courseTitle || "Course"}
                      fill
                      loading="lazy"
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 400px"
                      className="object-cover"
                    />

                    <div className="absolute top-3 right-3">
                      {isApproved ? (
                        <span className="px-2.5 py-1 rounded-lg bg-emerald-500 text-white text-xs font-bold flex items-center gap-1 shadow-sm">
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          <span>অনুমোদিত</span>
                        </span>
                      ) : isRejected ? (
                        <span className="px-2.5 py-1 rounded-lg bg-rose-500 text-white text-xs font-bold flex items-center gap-1 shadow-sm">
                          <XCircle className="w-3.5 h-3.5" />
                          <span>বাতিলকৃত (Rejected)</span>
                        </span>
                      ) : (
                        <span className="px-2.5 py-1 rounded-lg bg-amber-500 text-white text-xs font-bold flex items-center gap-1 shadow-sm">
                          <Clock className="w-3.5 h-3.5 animate-pulse" />
                          <span>ভেরিফিকেশন চলছে</span>
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="p-5">
                    <div className="flex items-center justify-between text-[11px] text-text-muted mb-1.5 font-sans">
                      <span>অর্ডার: {order.orderNumber}</span>
                      <span className="uppercase font-semibold text-primary">
                        {order.payment_method || "bKash"}
                      </span>
                    </div>

                    <h3 className="font-bold text-base text-text leading-snug mb-2">
                      {order.courseTitle}
                    </h3>

                    {isApproved ? (
                      <p className="text-xs text-text-muted">
                        আপনার এই কোর্সের পূর্ণাঙ্গ ক্লাসরুম অ্যাক্সেস সক্রিয় রয়েছে।
                      </p>
                    ) : isRejected ? (
                      <div className="text-xs text-rose-700 dark:text-rose-300 bg-rose-500/10 p-3 rounded-xl border border-rose-500/20">
                        <div className="flex items-center gap-1.5 font-bold text-rose-600 dark:text-rose-400 mb-1">
                          <XCircle className="w-4 h-4 shrink-0" />
                          <span>পেমেন্ট রিকোয়েস্ট প্রত্যাখ্যাত হয়েছে</span>
                        </div>
                        <p className="text-[11px] leading-relaxed opacity-95">
                          TrxID: <span className="font-mono font-bold">{order.transactionId || "N/A"}</span> • জমাকৃত ট্রানজাকশন তথ্যের সাথে অ্যাকাউন্টের বিবরণ মেলেনি। সহায়তার জন্য সরাসরি সাপোর্ট টিকিট খুলুন।
                        </p>
                      </div>
                    ) : (
                      <div className="text-xs text-amber-700 dark:text-amber-300 bg-amber-500/10 p-2.5 rounded-xl border border-amber-500/20">
                        <p className="font-bold">TrxID: {order.transactionId || "Reviewing"}</p>
                        <p className="text-[11px] opacity-90 mt-0.5">
                          অ্যাডমিন টিম পেমেন্টটি যাচাই করছে, যাচাই সম্পন্ন হলে ক্লাসরুম বাটনটি চালু হবে।
                        </p>
                      </div>
                    )}
                  </div>
                </div>

                <div className="p-5 pt-0">
                  {isApproved ? (
                    <Link
                      href={`/course/${slug}/learn`}
                      className="w-full py-2.5 px-4 rounded-xl font-bold text-xs text-white bg-primary hover:bg-primary-hover flex items-center justify-center gap-2 shadow-xs transition-colors"
                    >
                      <Play className="w-3.5 h-3.5 fill-white" />
                      <span>ক্লাসরুমে প্রবেশ করুন</span>
                    </Link>
                  ) : isRejected ? (
                    <div className="grid grid-cols-2 gap-2 w-full">
                      <Link
                        href={`/dashboard/support?new=true&orderId=${order.orderNumber}&course=${encodeURIComponent(order.courseTitle)}`}
                        className="py-2.5 px-3 rounded-xl font-bold text-xs text-white bg-rose-600 hover:bg-rose-700 flex items-center justify-center gap-1.5 shadow-xs transition-colors text-center"
                      >
                        <Headphones className="w-3.5 h-3.5" />
                        <span>সাপোর্ট টিকিট</span>
                      </Link>
                      <Link
                        href={`/checkout/${slug}`}
                        className="py-2.5 px-3 rounded-xl font-bold text-xs text-text bg-surface-secondary hover:bg-surface-secondary/80 border border-border flex items-center justify-center gap-1.5 transition-colors text-center"
                      >
                        <RotateCcw className="w-3.5 h-3.5 text-primary" />
                        <span>পুনরায় ভর্তি</span>
                      </Link>
                    </div>
                  ) : (
                    <Link
                      href="/dashboard/orders"
                      className="w-full py-2.5 px-4 rounded-xl font-bold text-xs text-text bg-surface-secondary hover:bg-surface-secondary/80 border border-border flex items-center justify-center gap-2 transition-colors"
                    >
                      <Receipt className="w-3.5 h-3.5 text-primary" />
                      <span>অর্ডারের বিবরণ দেখুন</span>
                    </Link>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
