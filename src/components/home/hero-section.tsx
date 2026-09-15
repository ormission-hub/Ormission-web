"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  BookOpen,
  ChevronLeft,
  ChevronRight,
  Sparkles,
  Video,
  FileText,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { createClient } from "@/lib/supabase/client";

interface HeroPhoto {
  id: string;
  title: string;
  url: string;
  is_active?: boolean;
  primary_cta_text?: string;
  primary_cta_url?: string;
  secondary_cta_text?: string;
  secondary_cta_url?: string;
}

interface HeroData {
  badge_text: string;
  title_line_1: string;
  title_line_2: string;
  subtitle: string;
  primary_cta_text: string;
  primary_cta_url: string;
  secondary_cta_text: string;
  secondary_cta_url: string;
  active_image_url: string;
  photos?: HeroPhoto[];
}

export interface DbCategoryItem {
  id: number | string;
  name: string;
  name_bn?: string | null;
  slug: string;
  icon_name?: string | null;
}

const defaultHeroData: HeroData = {
  badge_text: "🔥 নতুন একাডেমিক ও এডমিশন ব্যাচে ভর্তি চলছে",
  title_line_1: "Learn Today.",
  title_line_2: "Lead Tomorrow.",
  subtitle: "আজ শিখুন। আগামীকাল নেতৃত্ব দিন।",
  primary_cta_text: "Browse Course",
  primary_cta_url: "/courses",
  secondary_cta_text: "Buy Book",
  secondary_cta_url: "/courses",
  active_image_url: "/images/hero-student-model.jpg",
  photos: [
    {
      id: "hero-model-student",
      title: "Learn Today. Lead Tomorrow.",
      url: "/images/hero-student-model.jpg",
      is_active: true,
      primary_cta_text: "Browse Course",
      primary_cta_url: "/courses",
      secondary_cta_text: "Buy Book",
      secondary_cta_url: "/courses",
    },
  ],
};

function filterRealPhotos(photos?: HeroPhoto[]): HeroPhoto[] {
  if (!photos || photos.length === 0) return [];
  return photos.filter((p) => Boolean(p.url));
}

export function HeroSection({
  initialHeroData,
}: {
  initialCategories?: any[];
  initialHeroData?: HeroData;
}) {
  const [heroData, setHeroData] = useState<HeroData>(() => {
    if (initialHeroData) {
      return {
        ...initialHeroData,
        photos: filterRealPhotos(initialHeroData.photos),
      };
    }
    return defaultHeroData;
  });
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  useEffect(() => {
    async function loadData() {
      const supabase = createClient();
      try {
        const heroRes = await supabase
          .from("site_settings")
          .select("value")
          .eq("key", "hero_settings")
          .single();

        if (heroRes.data?.value && typeof heroRes.data.value === "object") {
          const val = heroRes.data.value;
          setHeroData((prev) => ({
            ...prev,
            ...val,
            photos: filterRealPhotos(val.photos),
          }));
        }
      } catch (err) {
        // Silent fallback
      }
    }

    loadData();
  }, []);

  const realPhotos = filterRealPhotos(heroData.photos);
  const activePhotos = realPhotos.filter((p) => p.is_active !== false);
  const slides: HeroPhoto[] =
    activePhotos.length > 0
      ? activePhotos
      : realPhotos.length > 0
      ? realPhotos
      : [
          {
            id: "default-hero-slide",
            title: "Learn Today. Lead Tomorrow.",
            url: heroData.active_image_url || "/images/hero-student-model.jpg",
          },
        ];

  const nextSlide = () => setCurrentIndex((prev) => (prev + 1) % slides.length);
  const prevSlide = () => setCurrentIndex((prev) => (prev - 1 + slides.length) % slides.length);

  useEffect(() => {
    if (slides.length <= 1 || isPaused) return;
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % slides.length);
    }, 6000);
    return () => clearInterval(timer);
  }, [slides.length, isPaused]);

  const currentSlide = slides[currentIndex] || slides[0];

  return (
    <section className="relative bg-background overflow-hidden pt-20 sm:pt-24 lg:pt-28 pb-10 sm:pb-14">
      {/* Ambient background soft glow */}
      <div
        className="absolute top-12 left-1/2 -translate-x-1/2 w-[900px] h-[550px] rounded-full opacity-35 dark:opacity-15 pointer-events-none blur-3xl"
        style={{
          background:
            "radial-gradient(circle, rgba(168, 85, 247, 0.14) 0%, rgba(255, 95, 0, 0.08) 50%, transparent 70%)",
        }}
        aria-hidden="true"
      />

      {/* Decorative ambient vector curves matching the photo */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden select-none">
        <svg
          className="absolute -left-16 top-1/4 w-80 h-80 text-purple-500/15 dark:text-purple-400/10"
          viewBox="0 0 200 200"
          fill="none"
        >
          <path
            d="M 20,100 C 60,30 140,170 180,100"
            stroke="currentColor"
            strokeWidth="2"
            strokeDasharray="4 4"
          />
          <circle cx="100" cy="100" r="3.5" fill="currentColor" />
        </svg>

        <svg
          className="absolute -right-12 top-16 w-96 h-96 text-purple-500/15 dark:text-purple-400/10"
          viewBox="0 0 200 200"
          fill="none"
        >
          <path
            d="M 30,60 C 110,20 130,180 180,120"
            stroke="currentColor"
            strokeWidth="1.5"
          />
          <circle cx="160" cy="125" r="4" fill="currentColor" />
        </svg>
      </div>

      <div className="container-main max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          {/* Left Column: Headlines & Action Buttons */}
          <div className="lg:col-span-6 flex flex-col justify-center text-left">
            {/* Top Announcement Pill */}
            {heroData.badge_text && (
              <div className="inline-flex items-center gap-2 self-start px-3.5 py-1.5 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs sm:text-sm font-semibold mb-4 sm:mb-6 shadow-2xs font-bengali">
                <Sparkles className="w-3.5 h-3.5 shrink-0" />
                <span>{heroData.badge_text}</span>
              </div>
            )}

            {/* Main Headline */}
            <h1 className="text-4xl sm:text-5xl lg:text-[56px] font-black tracking-tight text-slate-950 dark:text-white leading-[1.12]">
              <span className="block font-sans">{heroData.title_line_1 || "Learn Today."}</span>
              <span className="block mt-1 sm:mt-1.5 font-sans text-slate-900 dark:text-slate-100">
                {heroData.title_line_2 || "Lead Tomorrow."}
              </span>
            </h1>

            {/* Subtitle in Bengali */}
            <p className="mt-3 sm:mt-4 text-lg sm:text-xl lg:text-2xl font-bold font-bengali text-purple-600 dark:text-purple-400">
              {heroData.subtitle || "আজ শিখুন। আগামীকাল নেতৃত্ব দিন।"}
            </p>

            {/* Action Buttons: Browse Course & Buy Book */}
            <div className="mt-6 sm:mt-8 flex flex-wrap items-center gap-3.5 sm:gap-4">
              {/* Primary Button: Browse Course */}
              <Link
                href={currentSlide.primary_cta_url || heroData.primary_cta_url || "/courses"}
                className="inline-flex items-center justify-center px-7 sm:px-9 py-3 sm:py-3.5 rounded-full text-sm sm:text-base font-bold text-white bg-[#ff5f00] hover:bg-[#e05300] shadow-lg shadow-[#ff5f00]/30 hover:shadow-xl hover:shadow-[#ff5f00]/45 hover:-translate-y-0.5 active:translate-y-0 active:scale-[0.98] transition-all duration-200 cursor-pointer"
              >
                <span>{currentSlide.primary_cta_text || heroData.primary_cta_text || "Browse Course"}</span>
              </Link>

              {/* Secondary Button: Buy Book */}
              <Link
                href={currentSlide.secondary_cta_url || heroData.secondary_cta_url || "/courses"}
                className="inline-flex items-center justify-center px-7 sm:px-9 py-3 sm:py-3.5 rounded-full text-sm sm:text-base font-bold text-[#ff5f00] dark:text-white border-2 border-[#ff5f00] hover:bg-[#ff5f00]/10 dark:hover:bg-white/10 hover:-translate-y-0.5 active:translate-y-0 active:scale-[0.98] transition-all duration-200 cursor-pointer"
              >
                <span>{currentSlide.secondary_cta_text || heroData.secondary_cta_text || "Buy Book"}</span>
              </Link>
            </div>
          </div>

          {/* Right Column: Student Model Photo & Floating Badges */}
          <div
            className="lg:col-span-6 relative flex items-center justify-center pt-2 lg:pt-0"
            onMouseEnter={() => setIsPaused(true)}
            onMouseLeave={() => setIsPaused(false)}
          >
            {/* Ambient circular glow behind the student */}
            <div className="absolute inset-0 m-auto w-4/5 h-4/5 rounded-full bg-gradient-to-tr from-purple-500/25 via-primary/15 to-indigo-500/10 blur-3xl -z-10" />

            <div className="relative w-full max-w-[360px] sm:max-w-[420px] lg:max-w-[450px] mx-auto">
              {/* Main Student Portrait Card */}
              <div className="relative aspect-[3/4] w-full rounded-3xl overflow-hidden shadow-2xl border border-border/60 bg-gradient-to-b from-purple-50/50 via-white to-purple-50/30 dark:from-slate-900 dark:via-slate-950 dark:to-slate-900 group">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={currentSlide.id || currentIndex}
                    initial={{ opacity: 0, scale: 1.01 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.99 }}
                    transition={{ duration: 0.45, ease: "easeInOut" }}
                    className="absolute inset-0 w-full h-full"
                  >
                    <Image
                      src={currentSlide.url || heroData.active_image_url || "/images/hero-student-model.jpg"}
                      alt={currentSlide.title || "Learn Today. Lead Tomorrow."}
                      fill
                      priority
                      unoptimized={Boolean(currentSlide.url?.startsWith("http"))}
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 450px"
                      className="object-cover object-top transition-transform duration-700 group-hover:scale-[1.02]"
                    />
                  </motion.div>
                </AnimatePresence>

                {/* Optional slide navigation controls if multiple active slides exist */}
                {slides.length > 1 && (
                  <>
                    <button
                      type="button"
                      onClick={(e) => {
                        e.preventDefault();
                        prevSlide();
                      }}
                      className="absolute left-2.5 top-1/2 -translate-y-1/2 z-30 w-8 h-8 rounded-full bg-black/45 hover:bg-black/75 text-white flex items-center justify-center backdrop-blur-xs opacity-0 group-hover:opacity-100 transition-opacity"
                      aria-label="Previous"
                    >
                      <ChevronLeft className="w-4 h-4" />
                    </button>
                    <button
                      type="button"
                      onClick={(e) => {
                        e.preventDefault();
                        nextSlide();
                      }}
                      className="absolute right-2.5 top-1/2 -translate-y-1/2 z-30 w-8 h-8 rounded-full bg-black/45 hover:bg-black/75 text-white flex items-center justify-center backdrop-blur-xs opacity-0 group-hover:opacity-100 transition-opacity"
                      aria-label="Next"
                    >
                      <ChevronRight className="w-4 h-4" />
                    </button>

                    <div className="absolute bottom-3 left-1/2 -translate-x-1/2 z-30 flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-black/50 backdrop-blur-xs">
                      {slides.map((_, idx) => (
                        <button
                          key={idx}
                          type="button"
                          onClick={() => setCurrentIndex(idx)}
                          className={`rounded-full transition-all ${
                            idx === currentIndex
                              ? "w-4 h-1.5 bg-primary"
                              : "w-1.5 h-1.5 bg-white/50"
                          }`}
                          aria-label={`Slide ${idx + 1}`}
                        />
                      ))}
                    </div>
                  </>
                )}
              </div>

              {/* Floating Badge 1: Live Classes */}
              <motion.div
                animate={{ y: [0, -6, 0] }}
                transition={{ duration: 3.5, repeat: Infinity, ease: "easeInOut" }}
                className="absolute top-6 sm:top-10 -right-2 sm:-right-4 z-20 flex items-center gap-2.5 px-3.5 sm:px-4 py-2 sm:py-2.5 rounded-2xl bg-white/90 dark:bg-slate-900/90 backdrop-blur-md border border-white/80 dark:border-slate-700/80 shadow-xl shadow-purple-900/10"
              >
                <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-gradient-to-tr from-rose-500 to-amber-500 flex items-center justify-center text-white shadow-xs shrink-0">
                  <Video className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                </div>
                <div className="flex flex-col text-left">
                  <span className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white leading-tight font-sans">
                    Live Classes
                  </span>
                  <span className="text-[10px] text-emerald-500 font-semibold flex items-center gap-1 font-bengali">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                    ইন্টারেক্টিভ ক্লাস
                  </span>
                </div>
              </motion.div>

              {/* Floating Badge 2: PDF Notes */}
              <motion.div
                animate={{ y: [0, 6, 0] }}
                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut", delay: 0.6 }}
                className="absolute top-24 sm:top-32 -right-3 sm:-right-6 z-20 flex items-center gap-2.5 px-3.5 sm:px-4 py-2 sm:py-2.5 rounded-2xl bg-white/90 dark:bg-slate-900/90 backdrop-blur-md border border-white/80 dark:border-slate-700/80 shadow-xl shadow-purple-900/10"
              >
                <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-gradient-to-tr from-indigo-500 to-purple-600 flex items-center justify-center text-white shadow-xs shrink-0">
                  <FileText className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                </div>
                <div className="flex flex-col text-left">
                  <span className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white leading-tight font-sans">
                    PDF Notes
                  </span>
                  <span className="text-[10px] text-text-muted font-medium font-bengali">
                    হ্যান্ডনোট ও প্রশ্নব্যাংক
                  </span>
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
