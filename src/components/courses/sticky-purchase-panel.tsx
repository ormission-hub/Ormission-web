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
        if (res.ok) {
          const data = await res.json();
          if (isMounted && data?.success) {
            setEnrollmentStatus({
              checking: false,
              isEnrolled: !!data.isEnrolled,
              isPending: !!data.isPending,
              pendingOrder: data.pendingOrder,
            });
          }
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
    course.curriculum?.[0]?.lessons?.[0]?.id;
  const classroomHref = firstLessonId
    ? `/course/${course.slug}/learn/${firstLessonId}`
    : `/course/${course.slug}/learn`;

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
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (!cancelled && data) {
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
        {/* CINEMATIC PREVIEW SCREEN (Luxury MasterClass / Apple TV Style) */}
        {/* ========================================================================= */}
        <div
          className="relative aspect-video w-full overflow-hidden bg-slate-950 group cursor-pointer select-none"
          onClick={() => setShowVideoModal(true)}
          role="button"
          tabIndex={0}
          onKeyDown={(e) => e.key === "Enter" && setShowVideoModal(true)}
          title="কোর্স ট্রেলার ও আনলক ক্লাস দেখুন"
        >
          <Image
            src={thumbnail}
            alt={course.titleBn || course.title}
            fill
            sizes="(max-width: 1200px) 100vw, 450px"
            unoptimized={Boolean(thumbnail.startsWith("http"))}
            className="object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
          />

          {/* Cinematic Vignette Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/20 to-black/40 group-hover:from-black/90 group-hover:via-black/35 transition-all duration-300" />

          {/* Top Left: Minimalist Frosted Chip */}
          <div className="absolute top-3 left-3 z-10 flex items-center gap-1.5 px-3 py-1 rounded-full bg-black/60 backdrop-blur-md border border-white/10 text-white shadow-sm">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
            <span className="text-[11px] font-bold font-bengali tracking-wide text-white/95">
              কোর্স ট্রেলার
            </span>
          </div>

          {/* Top Right: Quality Chip */}
          <div className="absolute top-3 right-3 z-10 flex items-center gap-1 px-2.5 py-1 rounded-full bg-black/60 backdrop-blur-md border border-white/10 text-[10px] font-mono text-white/80 font-bold">
            <Sparkles className="w-3 h-3 text-amber-300" />
            <span>1080p FHD</span>
          </div>

          {/* Center Play Button: Luxury Frosted Glass Circle */}
          <div className="absolute inset-0 flex flex-col items-center justify-center z-10">
            <div className="relative flex items-center justify-center">
              {/* Soft ambient glow on hover */}
              <div className="absolute -inset-2 rounded-full bg-white/20 blur-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

              {/* Outer frosted ring */}
              <div className="w-16 h-16 sm:w-18 sm:h-18 rounded-full bg-white/20 backdrop-blur-md border border-white/30 flex items-center justify-center p-1 group-hover:scale-110 group-hover:bg-white/30 group-hover:border-white/50 transition-all duration-300 shadow-2xl">
                {/* Core White Circular Button */}
                <div className="w-full h-full rounded-full bg-white text-slate-900 flex items-center justify-center shadow-lg group-hover:bg-primary group-hover:text-white transition-colors duration-300">
                  <Play className="w-5 h-5 sm:w-6 sm:h-6 fill-current ml-0.5 transition-transform duration-300 group-hover:scale-110" />
                </div>
              </div>
            </div>

            <span className="mt-3 text-xs sm:text-sm font-bold text-white font-bengali tracking-wide drop-shadow-md group-hover:text-amber-200 transition-colors">
              ট্রেলার ও ডেমো প্রিভিউ দেখুন
            </span>
          </div>

          {/* Bottom Info Strip: Clean & Minimalist */}
          <div className="absolute bottom-0 inset-x-0 px-4 py-2 z-10 flex items-center justify-between text-[11px] text-white/80 font-bengali bg-black/40 backdrop-blur-xs border-t border-white/5">
            <div className="flex items-center gap-1.5 text-white/90">
              <Play className="w-3 h-3 text-primary fill-primary" />
              <span>ফ্রি ডেমো ভিডিওসহ</span>
            </div>
            <span className="text-[10px] text-white/60 font-sans">
              Click to Play
            </span>
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
                href={classroomHref}
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
                  <span>ট্রেলার ও আনলক ক্লাস দেখুন</span>
                </div>
                <span className="px-2 py-0.5 rounded-full text-[10.5px] font-bold bg-emerald-500/15 text-emerald-500 font-bengali">
                  আনলকড
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
              {/* 1. PROFESSIONAL LUXURY ENROLL CTA BUTTON */}
              <button
                type="button"
                onClick={handleEnroll}
                disabled={enrolling}
                className="group relative w-full p-[2px] rounded-2xl overflow-hidden shadow-[0_8px_24px_rgba(255,95,0,0.32)] hover:shadow-[0_12px_32px_rgba(255,95,0,0.48)] active:scale-[0.985] transition-all duration-300 block mb-3.5 cursor-pointer disabled:opacity-80"
              >
                {/* Refined Glowing Conic Beam Border */}
                <div
                  className="absolute inset-[-100%] animate-[spin_4s_linear_infinite] opacity-75 group-hover:opacity-100 transition-opacity"
                  style={{
                    background:
                      "conic-gradient(from 0deg, transparent 0deg, #FF5F00 110deg, #FFFFFF 175deg, #F97316 235deg, transparent 360deg)",
                  }}
                />

                {/* Inner Button Body with Specular Highlight */}
                <div className="relative z-10 w-full py-3.5 sm:py-4 px-6 rounded-[14px] bg-gradient-to-r from-primary via-orange-600 to-amber-600 hover:from-primary-hover hover:via-orange-500 hover:to-amber-500 text-white flex items-center justify-center gap-2.5 overflow-hidden font-bengali shadow-[inset_0_1px_1px_rgba(255,255,255,0.35)] transition-all duration-300">
                  {/* Glass Shimmer Sweep on Hover */}
                  <span className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-1000 bg-gradient-to-r from-transparent via-white/30 to-transparent pointer-events-none" />

                  {enrolling ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin text-white shrink-0" />
                      <span className="text-base sm:text-lg font-bold tracking-wide text-white drop-shadow-sm">
                        যাচাই করা হচ্ছে...
                      </span>
                    </>
                  ) : (
                    <>
                      <span className="text-base sm:text-lg font-bold tracking-wide text-white drop-shadow-sm">
                        এখনই কোর্সে ভর্তি হন
                      </span>
                      <ArrowRight className="w-5 h-5 text-white/95 transition-transform duration-300 group-hover:translate-x-1.5 shrink-0" />
                    </>
                  )}
                </div>
              </button>

              {/* 2. ULTRA-MODERN PREVIEW BUTTON (Glassmorphism with UNLOCKED badge) */}
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
                    ট্রেলার ও আনলক ক্লাস দেখুন
                  </span>
                </div>

                <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-emerald-500/20 text-emerald-500 dark:text-emerald-400 border border-emerald-500/30 font-bengali">
                  আনলকড
                </span>
              </button>
            </>
          )}

          {/* Guarantee Badge */}
          <div className="mt-4 p-3 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex items-center gap-2.5 text-xs text-emerald-700 dark:text-emerald-400 font-bengali font-bold">
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
              href={classroomHref}
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
                className="group relative px-5 py-2.5 rounded-xl text-xs sm:text-sm font-bold text-white bg-gradient-to-r from-primary via-orange-600 to-amber-600 hover:from-primary-hover hover:via-orange-500 hover:to-amber-500 shadow-md shadow-primary/25 font-bengali flex items-center gap-1.5 cursor-pointer active:scale-95 disabled:opacity-80 overflow-hidden shadow-[inset_0_1px_0_rgba(255,255,255,0.3)] transition-all"
              >
                <span className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-1000 bg-gradient-to-r from-transparent via-white/30 to-transparent pointer-events-none" />
                {enrolling ? (
                  <>
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    <span>যাচাই...</span>
                  </>
                ) : (
                  <>
                    <span>ভর্তি হন</span>
                    <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1" />
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
                        referrerPolicy="strict-origin-when-cross-origin"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                        title={`${previewChapters[activeChapterIndex]?.title || course.titleBn || course.title} — ফ্রি প্রিভিউ`}
                      />
                    </div>
                  );
                } else {
                  const isYt = /youtu\.be|youtube\.com|youtube-nocookie\.com/i.test(activeUrl);
                  const isStreamtape = /streamtape\.(com|to|net|pe|xyz|site|cash|cc)|streamta\.pe/i.test(activeUrl);
                  return (
                    <div className="w-full aspect-video bg-black relative flex items-center justify-center overflow-hidden">
                      <iframe
                        src={getEmbedUrl(activeUrl)}
                        className="w-full h-full border-0 absolute inset-0"
                        sandbox={isYt || isStreamtape ? undefined : "allow-scripts allow-same-origin allow-presentation allow-forms"}
                        referrerPolicy="strict-origin-when-cross-origin"
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
                    href={classroomHref}
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
