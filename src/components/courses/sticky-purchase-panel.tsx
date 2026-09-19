"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Play,
  Check,
  ShieldCheck,
  Smartphone,
  Clock,
  Award,
  FileDown,
  ArrowRight,
  Sparkles,
  X,
  Flame,
  CheckCircle2,
  Volume2,
  Tv,
  Loader2,
  BookOpen,
} from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { type Course } from "@/lib/data/courses";
import { extractYouTubeId } from "@/components/video/custom-video-player";
import { getEmbedUrl } from "@/lib/video-helpers";

interface StickyPurchasePanelProps {
  course: Course;
}

export function StickyPurchasePanel({ course }: StickyPurchasePanelProps) {
  const router = useRouter();
  const [showVideoModal, setShowVideoModal] = useState(false);
  const [activeChapterIndex, setActiveChapterIndex] = useState(0);
  const [enrolling, setEnrolling] = useState(false);

  // Check user enrollment and order status
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

  useEffect(() => {
    let isMounted = true;
    async function checkStatus() {
      try {
        const supabase = createClient();
        const {
          data: { session },
        } = await supabase.auth.getSession();

        if (!session?.user) {
          if (isMounted) setEnrollmentStatus({ checking: false, isEnrolled: false, isPending: false });
          return;
        }

        const res = await fetch(`/api/course/access?courseSlug=${course.slug}`, {
          headers: session.access_token ? { Authorization: `Bearer ${session.access_token}` } : {},
        });
        const data = await res.json();
        if (isMounted && data.success) {
          setEnrollmentStatus({
            checking: false,
            isEnrolled: !!data.isEnrolled,
            isPending: !!data.isPending,
            pendingOrder: data.pendingOrder,
          });
        }
      } catch {
        if (isMounted) setEnrollmentStatus({ checking: false, isEnrolled: false, isPending: false });
      }
    }
    checkStatus();
    return () => {
      isMounted = false;
    };
  }, [course.slug]);

  const firstLessonId =
    course.curriculum?.[0]?.lessons?.[0]?.id || "les-1";

  const handleEnroll = async (e?: React.MouseEvent) => {
    if (e) e.preventDefault();
    if (enrolling) return;
    setEnrolling(true);
    try {
      const supabase = createClient();
      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (session?.user) {
        router.push(`/checkout/${course.slug}`);
      } else {
        router.push(`/register?redirect=${encodeURIComponent(`/checkout/${course.slug}`)}`);
      }
    } catch {
      router.push(`/register?redirect=${encodeURIComponent(`/checkout/${course.slug}`)}`);
    } finally {
      setEnrolling(false);
    }
  };

  const price = course.price ?? 0;
  const originalPrice = course.originalPrice ?? 0;
  const discountAmount = originalPrice - price;
  const discountPercent =
    originalPrice > price && originalPrice > 0
      ? Math.round((discountAmount / originalPrice) * 100)
      : 0;

  const thumbnail =
    (course as any).thumbnail_url ||
    course.thumbnail ||
    "https://oorovtqwyfrfjfwuufyi.supabase.co/storage/v1/object/public/hero_images/hero_1789356392635_x4rpk6.webp";

  const durationHours = course.durationHours || 45;

  // Extract real free preview lessons from the DB-backed curriculum (no videoUrl stored client-side)
  const previewChapters = course.curriculum
    .flatMap((section) =>
      section.lessons
        .filter((lesson) => lesson.isFreePreview)
        .map((lesson) => ({
          lessonId: lesson.id,
          title: lesson.titleBn || lesson.title,
          duration: lesson.duration ? `${lesson.duration} মিনিট` : "",
        }))
    );

  // State: video URL and servers fetched securely from server API
  const [previewVideoUrl, setPreviewVideoUrl] = useState("");
  const [previewServers, setPreviewServers] = useState<{ name: string; type: string; url: string }[]>([]);
  const [selectedServerIdx, setSelectedServerIdx] = useState(0);
  const [loadingPreview, setLoadingPreview] = useState(false);

  // Fetch video URL and servers from server API when modal opens or chapter changes
  useEffect(() => {
    if (!showVideoModal) return;

    const chapter = previewChapters[activeChapterIndex];
    if (!chapter?.lessonId) {
      // Fallback: use course-level preview URL (if set in DB)
      setPreviewVideoUrl(course.previewVideoUrl || "");
      setPreviewServers([]);
      setSelectedServerIdx(0);
      return;
    }

    let cancelled = false;
    setLoadingPreview(true);
    setPreviewVideoUrl("");
    setPreviewServers([]);
    setSelectedServerIdx(0);

    fetch("/api/course/access", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ courseSlug: course.slug, lessonId: chapter.lessonId }),
    })
      .then((res) => res.json())
      .then((data) => {
        if (!cancelled) {
          if (data.videoUrl) {
            setPreviewVideoUrl(data.videoUrl);
          }
          if (Array.isArray(data.servers)) {
            setPreviewServers(data.servers);
          }
        }
      })
      .catch(() => {})
      .finally(() => {
        if (!cancelled) setLoadingPreview(false);
      });

    return () => { cancelled = true; };
  }, [showVideoModal, activeChapterIndex]);

  return (
    <>
      {/* Desktop Sticky Card */}
      <div className="hidden lg:block sticky top-24 bg-surface/95 dark:bg-slate-900/95 backdrop-blur-md rounded-3xl border border-border/80 hover:border-primary/40 overflow-hidden shadow-2xl transition-all duration-300">
        {/* ========================================================================= */}
        {/* ULTRA-MODERN PREVIEW SCREEN (Cinematic Media Player Look) */}
        {/* ========================================================================= */}
        <div
          className="relative aspect-video w-full overflow-hidden bg-slate-950 group cursor-pointer select-none"
          onClick={() => setShowVideoModal(true)}
        >
          <Image
            src={thumbnail}
            alt={course.titleBn || course.title}
            fill
            sizes="(max-width: 1200px) 100vw, 450px"
            unoptimized={Boolean(thumbnail.startsWith("http"))}
            className="object-cover group-hover:scale-108 transition-transform duration-700 ease-out"
          />

          {/* Vignette Overlays */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/35 to-black/40 group-hover:opacity-75 transition-opacity" />

          {/* Top Left: Live Trailer Pulse Badge */}
          <div className="absolute top-3.5 left-3.5 z-20 flex items-center gap-2 px-3 py-1.5 rounded-full bg-black/70 backdrop-blur-md border border-white/20 shadow-lg">
            <span className="relative flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-rose-500" />
            </span>
            <span className="text-xs font-black text-white font-bengali tracking-wide">
              ট্রেলার প্রিভিউ
            </span>
          </div>

          {/* Top Right: 1080p FHD Quality Chip */}
          <div className="absolute top-3.5 right-3.5 z-20 flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-black/70 backdrop-blur-md border border-white/15 text-[11px] font-black text-amber-300 font-sans shadow-lg">
            <Sparkles className="w-3 h-3 text-amber-400" />
            <span>1080p FHD</span>
          </div>

          {/* Center: Multi-layered Glowing Pulse Play Button */}
          <div className="absolute inset-0 flex flex-col items-center justify-center z-20">
            <div className="relative flex items-center justify-center">
              {/* Outer pulsing ring */}
              <div className="absolute -inset-4 rounded-full bg-gradient-to-r from-primary via-rose-500 to-amber-500 opacity-60 blur-md group-hover:opacity-100 group-hover:scale-125 transition-all duration-500 animate-pulse" />
              <div className="absolute w-20 h-20 rounded-full border border-white/30 animate-ping opacity-40 pointer-events-none" />

              {/* Core Play Icon */}
              <div className="relative w-16 h-16 rounded-2xl bg-gradient-to-tr from-primary via-rose-600 to-amber-500 text-white flex items-center justify-center shadow-[0_8px_30px_rgba(255,95,0,0.6)] group-hover:scale-110 group-hover:rotate-3 transition-all duration-300 border-2 border-white/40">
                <Play className="w-8 h-8 fill-white text-white drop-shadow-md ml-1" />
              </div>
            </div>

            <span className="mt-3.5 px-3.5 py-1 rounded-full bg-black/75 backdrop-blur-md border border-white/20 text-white text-xs font-bold font-bengali shadow-md group-hover:bg-primary group-hover:border-primary transition-all duration-200">
              ভিডিও দেখতে ক্লিক করুন
            </span>
          </div>

          {/* Bottom Audio Wave / Progress Bar Mockup */}
          <div className="absolute bottom-0 inset-x-0 p-3 z-20 bg-gradient-to-t from-black/95 via-black/60 to-transparent">
            <div className="flex items-center justify-between text-[11px] text-white/85 font-sans mb-1.5 px-1">
              <div className="flex items-center gap-1.5">
                <Volume2 className="w-3.5 h-3.5 text-primary" />
                <span className="font-bengali font-semibold">অডিও ও ভিডিও ডেমো ক্লাস</span>
              </div>
              <span className="tabular-nums font-bold text-amber-300">০৩:৪৫ মিনিট</span>
            </div>
            {/* Animated Progress Wave */}
            <div className="w-full h-1.5 rounded-full bg-white/20 overflow-hidden relative">
              <div className="absolute inset-y-0 left-0 w-2/5 bg-gradient-to-r from-primary via-rose-500 to-amber-400 rounded-full animate-pulse" />
            </div>
          </div>
        </div>

        {/* ========================================================================= */}
        {/* PRICING & ULTRA-MODERN BUTTONS */}
        {/* ========================================================================= */}
        <div className="p-6 sm:p-7">
          {enrollmentStatus.isEnrolled ? (
            /* =================================================================== */
            /* ALREADY ENROLLED STUDENT VIEW - DIRECT ACCESS TO CLASSROOM          */
            /* =================================================================== */
            <div className="mb-6">
              <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/25 mb-4 space-y-2">
                <div className="flex items-center gap-2.5">
                  <div className="w-10 h-10 rounded-xl bg-emerald-500 text-white flex items-center justify-center shrink-0 shadow-md shadow-emerald-500/20">
                    <CheckCircle2 className="w-6 h-6" />
                  </div>
                  <div>
                    <span className="text-[11px] font-black uppercase tracking-wider text-emerald-600 dark:text-emerald-400 font-sans block">
                      Active Student • Lifetime Access
                    </span>
                    <h3 className="text-base font-black text-text font-bengali">
                      আপনি এই কোর্সে সফলভাবে ভর্তি আছেন!
                    </h3>
                  </div>
                </div>
                <p className="text-xs text-text-muted font-bengali pl-0.5 leading-relaxed">
                  সবগুলো লাইভ ও ফুল এইচডি রেকর্ডেড ক্লাস, হ্যান্ডনোট ও প্র্যাকটিস শিট আপনার জন্য উন্মুক্ত রয়েছে।
                </p>
              </div>

              {/* Classroom Access Button */}
              <Link
                href={`/course/${course.slug}/learn/${firstLessonId}`}
                className="group relative w-full p-[2px] rounded-2xl overflow-hidden shadow-[0_10px_28px_rgba(16,185,129,0.35)] hover:shadow-[0_14px_36px_rgba(16,185,129,0.55)] active:scale-[0.98] transition-all duration-300 block mb-3 cursor-pointer"
              >
                <div className="relative z-10 w-full py-4 px-6 rounded-[14px] bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-500 text-white flex items-center justify-center gap-2.5 overflow-hidden font-bengali">
                  <Play className="w-5 h-5 fill-white text-white shrink-0" />
                  <span className="text-base sm:text-lg font-black tracking-wide text-white drop-shadow-sm">
                    কোর্সের ক্লাসরুমে যান
                  </span>
                  <ArrowRight className="w-5 h-5 text-white transition-transform duration-300 group-hover:translate-x-1.5 shrink-0" />
                </div>
              </Link>

              {/* Dashboard Link */}
              <Link
                href="/dashboard/my-courses"
                className="w-full py-3 px-4 rounded-2xl border border-border/80 hover:border-primary/50 bg-surface-secondary/60 hover:bg-surface-secondary text-text font-bengali font-bold text-xs sm:text-sm flex items-center justify-center gap-2 transition-all shadow-2xs"
              >
                <BookOpen className="w-4 h-4 text-primary" />
                <span>আমার নথিভুক্ত কোর্স ড্যাশবোর্ড</span>
              </Link>
            </div>
          ) : enrollmentStatus.isPending ? (
            /* =================================================================== */
            /* PENDING ORDER REVIEW VIEW - VERIFICATION IN PROGRESS                */
            /* =================================================================== */
            <div className="mb-6">
              <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/25 mb-4 space-y-2.5">
                <div className="flex items-center gap-2.5">
                  <div className="w-10 h-10 rounded-xl bg-amber-500 text-white flex items-center justify-center shrink-0 shadow-md shadow-amber-500/20">
                    <Clock className="w-5 h-5 animate-pulse" />
                  </div>
                  <div>
                    <span className="text-[11px] font-black uppercase tracking-wider text-amber-600 dark:text-amber-400 font-sans block">
                      Verification Pending
                    </span>
                    <h3 className="text-base font-black text-text font-bengali">
                      পেমেন্ট রিকোয়েস্ট যাচাই করা হচ্ছে
                    </h3>
                  </div>
                </div>
                <div className="text-xs text-text-muted font-bengali space-y-1 bg-surface/60 p-2.5 rounded-xl border border-amber-500/20">
                  <div className="flex items-center justify-between">
                    <span>অর্ডার নম্বর:</span>
                    <span className="font-bold text-text font-sans">
                      #{enrollmentStatus.pendingOrder?.order_number || "অপেক্ষারত"}
                    </span>
                  </div>
                  {enrollmentStatus.pendingOrder?.transaction_id && (
                    <div className="flex items-center justify-between">
                      <span>TrxID:</span>
                      <span className="font-bold text-primary font-sans">
                        {enrollmentStatus.pendingOrder.transaction_id}
                      </span>
                    </div>
                  )}
                </div>
                <p className="text-[11.5px] text-amber-700 dark:text-amber-300 font-bengali leading-relaxed">
                  আপনার পেমেন্ট রিকোয়েস্টটি অ্যাডমিন প্যানেলে যাচাই করা হচ্ছে। অনুমোদন সম্পন্ন হলেই সম্পূর্ণ ক্লাসরুম স্বয়ংক্রিয়ভাবে চালু হবে।
                </p>
              </div>

              {/* View Order Status Button */}
              <Link
                href="/dashboard/my-courses"
                className="group relative w-full p-[2px] rounded-2xl overflow-hidden shadow-[0_10px_28px_rgba(245,158,11,0.3)] hover:shadow-[0_14px_36px_rgba(245,158,11,0.5)] active:scale-[0.98] transition-all duration-300 block mb-3 cursor-pointer"
              >
                <div className="relative z-10 w-full py-4 px-6 rounded-[14px] bg-gradient-to-r from-amber-500 via-orange-500 to-amber-600 text-white flex items-center justify-center gap-2.5 overflow-hidden font-bengali">
                  <Clock className="w-5 h-5 text-white shrink-0" />
                  <span className="text-base sm:text-lg font-black tracking-wide text-white drop-shadow-sm">
                    অর্ডারের স্ট্যাটাস দেখুন
                  </span>
                  <ArrowRight className="w-5 h-5 text-white transition-transform duration-300 group-hover:translate-x-1.5 shrink-0" />
                </div>
              </Link>

              {/* Preview Button */}
              <button
                type="button"
                onClick={() => setShowVideoModal(true)}
                className="w-full py-3 px-4 rounded-2xl border border-border/80 hover:border-primary/50 bg-surface-secondary/60 hover:bg-surface-secondary text-text font-bengali font-bold text-xs sm:text-sm flex items-center justify-between transition-all shadow-2xs cursor-pointer"
              >
                <div className="flex items-center gap-2">
                  <Play className="w-4 h-4 text-primary fill-primary" />
                  <span>ফ্রি ট্রেলার ও ডেমো ক্লাস দেখুন</span>
                </div>
                <span className="px-2 py-0.5 rounded-full text-[10.5px] font-black bg-emerald-500/15 text-emerald-500">
                  FREE
                </span>
              </button>
            </div>
          ) : (
            /* =================================================================== */
            /* UNENROLLED VISITOR VIEW - PRICING & ENROLL CALL TO ACTION          */
            /* =================================================================== */
            <>
              {/* Price Header */}
              <div className="flex items-baseline gap-3 mb-2">
                <span className="text-3xl sm:text-4xl font-black text-primary font-sans tracking-tight tabular-nums">
                  ৳{price.toLocaleString("en-US")}
                </span>
                {originalPrice > price && (
                  <>
                    <span className="text-base sm:text-lg text-text-muted line-through font-sans tabular-nums">
                      ৳{originalPrice.toLocaleString("en-US")}
                    </span>
                    <span className="px-2.5 py-0.5 rounded-full text-xs font-black bg-rose-500/15 text-rose-500 border border-rose-500/30 font-sans">
                      {discountPercent}% ছাড়
                    </span>
                  </>
                )}
              </div>

              <p className="text-xs font-bold text-amber-600 dark:text-amber-400 font-bengali mb-5 flex items-center gap-1.5">
                <Flame className="w-3.5 h-3.5 fill-amber-500 text-amber-500" />
                <span>সীমিত সময়ের জন্য বিশেষ অফার মূল্য</span>
              </p>

              {/* 1. ULTRA-MODERN BUY BUTTON (with rotating laser glow and shine) */}
              <button
                type="button"
                onClick={handleEnroll}
                disabled={enrolling}
                className="group relative w-full p-[2px] rounded-2xl overflow-hidden shadow-[0_10px_28px_rgba(255,95,0,0.45)] hover:shadow-[0_14px_36px_rgba(255,95,0,0.65)] active:scale-[0.98] transition-all duration-300 block mb-3.5 cursor-pointer disabled:opacity-80"
              >
                {/* Animated Conic Laser Border */}
                <div
                  className="absolute inset-[-100%] animate-[spin_3s_linear_infinite]"
                  style={{
                    background:
                      "conic-gradient(from 0deg, transparent 0deg, #FF5F00 120deg, #FFFFFF 180deg, #FF1493 240deg, transparent 360deg)",
                  }}
                />

                {/* Inner Button Content */}
                <div className="relative z-10 w-full py-3.5 sm:py-4 px-6 rounded-[14px] bg-gradient-to-r from-[#FF5F00] via-[#FF3366] to-[#E11D48] text-white flex items-center justify-center gap-2.5 overflow-hidden font-bengali">
                  {/* Glass Shimmer sweep */}
                  <span className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-1000 bg-gradient-to-r from-transparent via-white/35 to-transparent pointer-events-none" />

                  {enrolling ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin text-white shrink-0" />
                      <span className="text-base sm:text-lg font-black tracking-wide text-white drop-shadow-sm">
                        যাচাই করা হচ্ছে...
                      </span>
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-5 h-5 text-amber-300 animate-pulse shrink-0" />
                      <span className="text-base sm:text-lg font-black tracking-wide text-white drop-shadow-sm">
                        এখনই কোর্সে ভর্তি হন
                      </span>
                      <ArrowRight className="w-5 h-5 text-white transition-transform duration-300 group-hover:translate-x-1.5 shrink-0" />
                    </>
                  )}
                </div>
              </button>

              {/* 2. ULTRA-MODERN PREVIEW BUTTON (Glassmorphism with FREE badge) */}
              <button
                type="button"
                onClick={() => setShowVideoModal(true)}
                className="group relative w-full py-3 px-4.5 rounded-2xl border-2 border-primary/30 hover:border-primary bg-surface-secondary/70 hover:bg-primary/10 text-text font-bengali font-bold text-sm sm:text-base flex items-center justify-between transition-all duration-300 shadow-sm hover:shadow-md cursor-pointer mb-6"
              >
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-primary to-rose-500 text-white flex items-center justify-center shadow-md shadow-primary/30 group-hover:scale-110 transition-transform">
                    <Play className="w-4 h-4 fill-white ml-0.5" />
                  </div>
                  <span className="group-hover:text-primary transition-colors">
                    ফ্রি ক্লাস ও প্রিভিউ দেখুন
                  </span>
                </div>

                <span className="px-2.5 py-0.5 rounded-full text-[11px] font-black bg-emerald-500/20 text-emerald-500 dark:text-emerald-400 border border-emerald-500/30 font-sans tracking-wide">
                  FREE
                </span>
              </button>
            </>
          )}

          {/* Course Features list in micro-cards */}
          <div className="border-t border-border/70 pt-5 space-y-3 text-xs sm:text-sm text-text">
            <h4 className="font-black text-text font-bengali text-xs uppercase tracking-wider mb-3 text-text-muted">
              এই কোর্সের সাথে যা যা পাচ্ছেন:
            </h4>

            <div className="flex items-center gap-3 p-2.5 rounded-xl bg-surface-secondary/50 border border-border/50">
              <div className="w-8 h-8 rounded-lg bg-primary/15 border border-primary/25 flex items-center justify-center text-primary shrink-0">
                <Clock className="w-4 h-4" />
              </div>
              <span className="font-bengali font-medium">
                {durationHours} ঘণ্টার ফুল এইচডি রেকর্ডেড ও লাইভ ক্লাস
              </span>
            </div>

            <div className="flex items-center gap-3 p-2.5 rounded-xl bg-surface-secondary/50 border border-border/50">
              <div className="w-8 h-8 rounded-lg bg-rose-500/15 border border-rose-500/25 flex items-center justify-center text-rose-500 shrink-0">
                <FileDown className="w-4 h-4" />
              </div>
              <span className="font-bengali font-medium">
                লেকচার স্লাইড ও প্র্যাকটিস শিট PDF
              </span>
            </div>

            <div className="flex items-center gap-3 p-2.5 rounded-xl bg-surface-secondary/50 border border-border/50">
              <div className="w-8 h-8 rounded-lg bg-emerald-500/15 border border-emerald-500/25 flex items-center justify-center text-emerald-500 shrink-0">
                <Smartphone className="w-4 h-4" />
              </div>
              <span className="font-bengali font-medium">
                মোবাইল ও পিসিতে আনলিমিটেড অ্যাক্সেস
              </span>
            </div>

            <div className="flex items-center gap-3 p-2.5 rounded-xl bg-surface-secondary/50 border border-border/50">
              <div className="w-8 h-8 rounded-lg bg-amber-500/15 border border-amber-500/25 flex items-center justify-center text-amber-500 shrink-0">
                <Award className="w-4 h-4" />
              </div>
              <span className="font-bengali font-medium">
                কোর্স সমাপনী অফিসিয়াল ভেরিফায়েড সার্টিফিকেট
              </span>
            </div>

            <div className="flex items-center gap-3 p-2.5 rounded-xl bg-surface-secondary/50 border border-border/50">
              <div className="w-8 h-8 rounded-lg bg-indigo-500/15 border border-indigo-500/25 flex items-center justify-center text-indigo-500 shrink-0">
                <ShieldCheck className="w-4 h-4" />
              </div>
              <span className="font-bengali font-medium">
                ১ বছরের ফুল ভ্যালিডিটি ও সাপোর্ট
              </span>
            </div>
          </div>

          {/* Guarantee Badge */}
          <div className="mt-6 p-3 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex items-center gap-2.5 text-xs text-emerald-700 dark:text-emerald-400 font-bengali font-bold">
            <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
            <span>১০০% সুরক্ষিত পেমেন্ট ও তাত্ক্ষণিক অ্যাক্সেস</span>
          </div>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* MOBILE STICKY BOTTOM BAR (Modern Floating Bar) */}
      {/* ========================================================================= */}
      <div className="lg:hidden fixed bottom-0 inset-x-0 z-40 bg-surface/95 dark:bg-slate-900/95 backdrop-blur-xl border-t border-border/80 px-4 py-3 shadow-[0_-8px_30px_rgba(0,0,0,0.25)] flex items-center justify-between gap-3">
        {enrollmentStatus.isEnrolled ? (
          <>
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-xl bg-emerald-500/15 text-emerald-500 flex items-center justify-center shrink-0">
                <CheckCircle2 className="w-4.5 h-4.5" />
              </div>
              <div>
                <span className="text-xs font-black text-emerald-600 dark:text-emerald-400 font-bengali block leading-tight">
                  ভর্তি নিশ্চিত
                </span>
                <span className="text-[10px] text-text-muted font-bengali">
                  ফুল অ্যাক্সেস সক্রিয়
                </span>
              </div>
            </div>

            <Link
              href={`/course/${course.slug}/learn/${firstLessonId}`}
              className="px-5 py-2.5 rounded-xl text-xs sm:text-sm font-black text-white bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-500 hover:opacity-95 shadow-lg shadow-emerald-500/25 font-bengali flex items-center gap-1.5 cursor-pointer active:scale-95 shrink-0"
            >
              <Play className="w-3.5 h-3.5 fill-white" />
              <span>ক্লাসরুমে যান</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </>
        ) : enrollmentStatus.isPending ? (
          <>
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-xl bg-amber-500/15 text-amber-500 flex items-center justify-center shrink-0">
                <Clock className="w-4.5 h-4.5 animate-pulse" />
              </div>
              <div>
                <span className="text-xs font-black text-amber-600 dark:text-amber-400 font-bengali block leading-tight">
                  যাচাই চলছে
                </span>
                <span className="text-[10px] text-text-muted font-bengali">
                  #{enrollmentStatus.pendingOrder?.order_number || "অপেক্ষারত"}
                </span>
              </div>
            </div>

            <Link
              href="/dashboard/my-courses"
              className="px-5 py-2.5 rounded-xl text-xs sm:text-sm font-black text-white bg-gradient-to-r from-amber-500 to-orange-600 hover:opacity-95 shadow-lg shadow-amber-500/25 font-bengali flex items-center gap-1.5 cursor-pointer active:scale-95 shrink-0"
            >
              <span>স্ট্যাটাস দেখুন</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </>
        ) : (
          <>
            <div>
              <div className="flex items-baseline gap-2">
                <span className="text-xl sm:text-2xl font-black text-primary font-sans tabular-nums">
                  ৳{price.toLocaleString("en-US")}
                </span>
                {originalPrice > price && (
                  <span className="text-xs text-text-muted line-through font-sans tabular-nums">
                    ৳{originalPrice.toLocaleString("en-US")}
                  </span>
                )}
              </div>
              {discountPercent > 0 && (
                <span className="text-[11px] font-bold text-rose-500 font-bengali">
                  {discountPercent}% ছাড় চলছে
                </span>
              )}
            </div>

            <div className="flex items-center gap-2 shrink-0">
              <button
                type="button"
                onClick={() => setShowVideoModal(true)}
                className="px-3 py-2.5 rounded-xl border border-border bg-surface-secondary text-xs font-bold text-text font-bengali flex items-center gap-1.5 cursor-pointer hover:bg-surface-secondary/80"
              >
                <Play className="w-3.5 h-3.5 text-primary fill-primary" />
                <span>প্রিভিউ</span>
              </button>

              <button
                type="button"
                onClick={handleEnroll}
                disabled={enrolling}
                className="px-5 py-2.5 rounded-xl text-xs sm:text-sm font-black text-white bg-gradient-to-r from-primary via-orange-600 to-rose-600 hover:opacity-95 shadow-lg shadow-primary/30 font-bengali flex items-center gap-1.5 cursor-pointer active:scale-95 disabled:opacity-80"
              >
                {enrolling ? (
                  <>
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    <span>যাচাই...</span>
                  </>
                ) : (
                  <>
                    <span>ভর্তি হন</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </>
                )}
              </button>
            </div>
          </>
        )}
      </div>

      {/* ========================================================================= */}
      {/* CINEMATIC VIDEO PREVIEW MODAL */}
      {/* ========================================================================= */}
      {showVideoModal && (
        <div
          className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4 sm:p-6"
          onClick={() => setShowVideoModal(false)}
        >
          <div
            className="bg-surface dark:bg-slate-900 rounded-3xl overflow-hidden max-w-3xl w-full border border-border/80 shadow-2xl relative animate-in fade-in zoom-in-95 duration-200"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="p-4 sm:p-5 flex items-center justify-between border-b border-border bg-surface/80 dark:bg-slate-900/80 backdrop-blur-md">
              <div className="flex items-center gap-2.5 min-w-0 pr-4">
                <span className="px-2.5 py-1 rounded-full text-[11px] font-black bg-rose-500/15 text-rose-500 border border-rose-500/30 font-bengali shrink-0">
                  ফ্রি প্রিভিউ
                </span>
                <h4 className="font-bold text-sm sm:text-base text-text font-bengali truncate">
                  {course.titleBn || course.title}
                </h4>
              </div>

              <button
                type="button"
                onClick={() => setShowVideoModal(false)}
                className="w-9 h-9 rounded-full bg-surface-secondary text-text hover:text-rose-500 hover:bg-rose-500/10 flex items-center justify-center transition-colors cursor-pointer shrink-0"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Custom Branded Video Player Container */}
            <div className="w-full bg-black relative">
              {loadingPreview ? (
                <div className="aspect-video flex items-center justify-center">
                  <Loader2 className="w-8 h-8 text-primary animate-spin" />
                </div>
              ) : (() => {
                const activeServer = previewServers[selectedServerIdx] || {
                  name: "YouTube",
                  type: "youtube",
                  url: previewVideoUrl,
                };
                const activeUrl = activeServer.url || previewVideoUrl;
                const activeType = activeServer.type || "youtube";

                if (!activeUrl) {
                  return (
                    <div className="aspect-video flex items-center justify-center text-text-muted font-bengali text-sm">
                      ভিডিও লোড হচ্ছে না। পরে আবার চেষ্টা করুন।
                    </div>
                  );
                }

                if (activeType === "youtube") {
                  const ytId = extractYouTubeId(activeUrl);
                  return (
                    <div className="w-full aspect-video bg-black">
                      <iframe
                        src={`https://www.youtube.com/embed/${ytId}?rel=0&autoplay=1`}
                        className="w-full h-full border-0"
                        allowFullScreen
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                        title={`${previewChapters[activeChapterIndex]?.title || course.titleBn || course.title} — ফ্রি প্রিভিউ`}
                      />
                    </div>
                  );
                } else {
                  return (
                    <div className="w-full aspect-video bg-black relative flex items-center justify-center overflow-hidden">
                      <iframe
                        src={getEmbedUrl(activeUrl)}
                        className="w-full h-full border-0 absolute inset-0"
                        sandbox="allow-scripts allow-same-origin allow-presentation allow-forms"
                        referrerPolicy="no-referrer"
                        allowFullScreen
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                        scrolling="no"
                        title={`${previewChapters[activeChapterIndex]?.title || course.titleBn || course.title} — ${activeServer.name}`}
                      />
                    </div>
                  );
                }
              })()}
            </div>

            {/* Server Switcher Bar — only when multiple servers */}
            {previewServers.length > 1 && (
              <div className="w-full bg-surface-secondary/80 border-t border-border px-4 py-1.5 flex items-center gap-2 overflow-x-auto no-scrollbar">
                {previewServers.map((srv, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => setSelectedServerIdx(idx)}
                    className={`px-3 py-1 rounded-full text-xs font-bold font-bengali whitespace-nowrap flex items-center gap-1.5 border transition-all cursor-pointer ${
                      selectedServerIdx === idx
                        ? "bg-primary text-white border-primary shadow-xs"
                        : "bg-surface text-text-muted hover:text-text border-border"
                    }`}
                  >
                    <span className={`w-1.5 h-1.5 rounded-full ${selectedServerIdx === idx ? "bg-white" : "bg-text-muted"}`} />
                    <span>{srv.name}</span>
                  </button>
                ))}
              </div>
            )}

            {/* Preview Chapters Navigation */}
            <div className="p-4 bg-surface-secondary/40 border-t border-border">
              <div className="text-xs font-bold text-text-muted font-bengali mb-2 flex items-center gap-1.5">
                <Tv className="w-3.5 h-3.5 text-primary" />
                <span>প্রিভিউ লেসনসমূহ:</span>
              </div>
              <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-1">
                {previewChapters.map((chap, i) => (
                  <button
                    key={i}
                    type="button"
                    onClick={() => setActiveChapterIndex(i)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold font-bengali whitespace-nowrap transition-all cursor-pointer ${
                      activeChapterIndex === i
                        ? "bg-primary text-white shadow-xs"
                        : "bg-surface text-text-muted hover:text-text border border-border/80"
                    }`}
                  >
                    {chap.title} ({chap.duration})
                  </button>
                ))}
              </div>
            </div>

            {/* Modal Footer with Action */}
            <div className="p-4 sm:p-5 flex items-center justify-between bg-surface dark:bg-slate-900 border-t border-border">
              {enrollmentStatus.isEnrolled ? (
                <>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-5 h-5 text-emerald-500" />
                    <div>
                      <span className="text-xs text-emerald-600 dark:text-emerald-400 font-bold font-bengali block">
                        ভর্তি নিশ্চিত
                      </span>
                      <span className="text-xs text-text-muted font-bengali">পূর্ণাঙ্গ অ্যাক্সেস সক্রিয়</span>
                    </div>
                  </div>

                  <Link
                    href={`/course/${course.slug}/learn/${firstLessonId}`}
                    onClick={() => setShowVideoModal(false)}
                    className="px-6 py-2.5 rounded-xl text-xs sm:text-sm font-black text-white bg-gradient-to-r from-emerald-600 to-teal-600 hover:opacity-95 shadow-md shadow-emerald-500/30 font-bengali flex items-center gap-2 cursor-pointer"
                  >
                    <Play className="w-4 h-4 fill-white" />
                    <span>ক্লাসরুমে যান</span>
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                </>
              ) : enrollmentStatus.isPending ? (
                <>
                  <div className="flex items-center gap-2">
                    <Clock className="w-5 h-5 text-amber-500 animate-pulse" />
                    <div>
                      <span className="text-xs text-amber-600 dark:text-amber-400 font-bold font-bengali block">
                        যাচাইকরণ প্রক্রিয়াধীন
                      </span>
                      <span className="text-xs text-text-muted font-sans">
                        #{enrollmentStatus.pendingOrder?.order_number || "ORM-Review"}
                      </span>
                    </div>
                  </div>

                  <Link
                    href="/dashboard/my-courses"
                    onClick={() => setShowVideoModal(false)}
                    className="px-6 py-2.5 rounded-xl text-xs sm:text-sm font-black text-white bg-gradient-to-r from-amber-500 to-orange-600 hover:opacity-95 shadow-md shadow-amber-500/30 font-bengali flex items-center gap-2 cursor-pointer"
                  >
                    <span>অর্ডার স্ট্যাটাস</span>
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                </>
              ) : (
                <>
                  <div>
                    <span className="text-xs text-text-muted font-bengali block">কোর্স ফি</span>
                    <span className="text-lg sm:text-xl font-black text-primary font-sans">
                      ৳{price.toLocaleString("en-US")}
                    </span>
                  </div>

                  <button
                    type="button"
                    onClick={handleEnroll}
                    disabled={enrolling}
                    className="px-6 py-2.5 rounded-xl text-xs sm:text-sm font-black text-white bg-gradient-to-r from-primary to-rose-600 hover:opacity-95 shadow-md shadow-primary/30 font-bengali flex items-center gap-2 cursor-pointer disabled:opacity-80"
                  >
                    {enrolling ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        <span>যাচাই করা হচ্ছে...</span>
                      </>
                    ) : (
                      <>
                        <span>সম্পূর্ণ কোর্সে ভর্তি হন</span>
                        <ArrowRight className="w-4 h-4" />
                      </>
                    )}
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
