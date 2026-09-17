"use client";

import { useState } from "react";
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
} from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { type Course } from "@/lib/data/courses";

interface StickyPurchasePanelProps {
  course: Course;
}

export function StickyPurchasePanel({ course }: StickyPurchasePanelProps) {
  const router = useRouter();
  const [showVideoModal, setShowVideoModal] = useState(false);
  const [activeChapterIndex, setActiveChapterIndex] = useState(0);
  const [enrolling, setEnrolling] = useState(false);

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

  const previewChapters = [
    { title: "১. কোর্স পরিচিতি ও প্রস্তুতি কৌশল", duration: "০৮:১৫ মিনিট" },
    { title: "২. বেসিক কনসেপ্ট ও শর্টকাট টেকনিক", duration: "১২:৪০ মিনিট" },
    { title: "৩. বিগত বছরের প্রশ্ন এনালাইসিস", duration: "১৫:২০ মিনিট" },
  ];

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

          {/* =================================================================== */}
          {/* 1. ULTRA-MODERN BUY BUTTON (with rotating laser glow and shine) */}
          {/* =================================================================== */}
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

          {/* =================================================================== */}
          {/* 2. ULTRA-MODERN PREVIEW BUTTON (Glassmorphism with FREE badge) */}
          {/* =================================================================== */}
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

            {/* Video Iframe Container */}
            <div className="aspect-video w-full bg-black relative">
              <iframe
                src="https://www.youtube-nocookie.com/embed/dQw4w9WgXcQ?autoplay=1"
                title="Course Preview"
                className="w-full h-full border-0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            </div>

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

            {/* Modal Footer with Immediate Buy Action */}
            <div className="p-4 sm:p-5 flex items-center justify-between bg-surface dark:bg-slate-900 border-t border-border">
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
            </div>
          </div>
        </div>
      )}
    </>
  );
}
