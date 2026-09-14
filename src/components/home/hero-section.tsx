"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  GraduationCap,
  Rocket,
  Landmark,
  BookOpen,
  FlaskConical,
  LucideIcon,
  ChevronLeft,
  ChevronRight,
  Sparkles,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { createClient } from "@/lib/supabase/client";

interface HeroPhoto {
  id: string;
  title: string;
  url: string;
  is_active?: boolean;
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
  primary_cta_text: "Start Learning",
  primary_cta_url: "/courses",
  secondary_cta_text: "Browse Courses",
  secondary_cta_url: "/courses",
  active_image_url:
    "https://oorovtqwyfrfjfwuufyi.supabase.co/storage/v1/object/public/hero_images/hero_1789356392635_x4rpk6.webp",
  photos: [
    {
      id: "real-hero-banner",
      title: "Admission 2026 Premium Batch",
      url: "https://oorovtqwyfrfjfwuufyi.supabase.co/storage/v1/object/public/hero_images/hero_1789356392635_x4rpk6.webp",
      is_active: true,
    },
  ],
};

function resolveCategoryIcon(slug: string, iconName?: string | null): LucideIcon {
  if (slug.includes("ssc")) return GraduationCap;
  if (slug.includes("hsc-science") || slug.includes("science")) return FlaskConical;
  if (slug.includes("hsc")) return Rocket;
  if (slug.includes("admission") || slug.includes("university")) return Landmark;
  return BookOpen;
}

function getCategoryShortLabel(cat: DbCategoryItem): string {
  const s = cat.slug.toLowerCase();
  if (s.includes("ssc")) return "SSC";
  if (s.includes("hsc-science")) return "HSC Science";
  if (s.includes("hsc") || s.includes("arts")) return "HSC";
  if (s.includes("admission") || s.includes("university")) return "Admission";
  return cat.name_bn || cat.name;
}

function getCategoryBadgeTheme(slug: string) {
  const s = slug.toLowerCase();
  if (s.includes("ssc")) {
    return {
      bg: "bg-orange-500/15 text-orange-600 dark:text-orange-400 border-orange-500/25",
      accentDot: "bg-orange-500",
    };
  }
  if (s === "hsc" || (s.includes("hsc") && !s.includes("science")) || s.includes("arts")) {
    return {
      bg: "bg-purple-500/15 text-purple-600 dark:text-purple-400 border-purple-500/25",
      accentDot: "bg-purple-500",
    };
  }
  if (s.includes("science")) {
    return {
      bg: "bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border-emerald-500/25",
      accentDot: "bg-emerald-500",
    };
  }
  if (s.includes("admission") || s.includes("university")) {
    return {
      bg: "bg-blue-500/15 text-blue-600 dark:text-blue-400 border-blue-500/25",
      accentDot: "bg-blue-500",
    };
  }
  return {
    bg: "bg-primary/15 text-primary border-primary/25",
    accentDot: "bg-primary",
  };
}

// Ensure SSC & HSC are at top (row 1), and HSC Science & Admission are at bottom (row 2)
function sortCategories(list: DbCategoryItem[]): DbCategoryItem[] {
  const getRank = (cat: DbCategoryItem) => {
    const s = cat.slug.toLowerCase();
    if (s.includes("ssc")) return 1;
    if (s === "hsc" || s.includes("hsc-arts") || (s.includes("hsc") && !s.includes("science"))) return 2;
    if (s.includes("science")) return 3;
    if (s.includes("admission") || s.includes("university")) return 4;
    return 5;
  };
  return [...list].sort((a, b) => getRank(a) - getRank(b));
}

// Helper to filter out known mock/test photos
function filterRealPhotos(photos?: HeroPhoto[]): HeroPhoto[] {
  if (!photos || photos.length === 0) return [];
  return photos.filter((p) => {
    if (!p.url) return false;
    const isMock =
      p.id === "hero-1789357574479" ||
      p.url.includes("hero_1789357573544_q5yysw.webp") ||
      p.url.includes("hero-student.jpg");
    return !isMock;
  });
}

export function HeroSection({
  initialCategories = [],
  initialHeroData,
}: {
  initialCategories?: DbCategoryItem[];
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
  const [categories, setCategories] = useState<DbCategoryItem[]>(() =>
    sortCategories(initialCategories)
  );
  const [activeSlug, setActiveSlug] = useState<string>(
    initialCategories[0]?.slug || "ssc-prep"
  );
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  useEffect(() => {
    async function loadData() {
      const supabase = createClient();
      try {
        const [heroRes, catRes] = await Promise.all([
          supabase
            .from("site_settings")
            .select("value")
            .eq("key", "hero_settings")
            .single(),
          supabase
            .from("categories")
            .select("id, name, name_bn, slug, icon_name")
            .eq("is_published", true)
            .order("display_order", { ascending: true }),
        ]);

        if (heroRes.data?.value && typeof heroRes.data.value === "object") {
          const val = heroRes.data.value;
          setHeroData((prev) => ({
            ...prev,
            ...val,
            photos: filterRealPhotos(val.photos),
          }));
        }

        if (catRes.data && catRes.data.length > 0) {
          const sorted = sortCategories(catRes.data);
          setCategories(sorted);
          setActiveSlug(sorted[0].slug);
        }
      } catch (err) {
        // Silent fallback
      }
    }

    loadData();
  }, []);

  const realPhotos = filterRealPhotos(heroData.photos);
  const activePhotos = realPhotos.filter((p) => p.is_active);
  const slides: HeroPhoto[] =
    activePhotos.length > 0
      ? activePhotos
      : realPhotos.length > 0
      ? realPhotos
      : [
          {
            id: "default-hero-slide",
            title: "Ormission Hero Banner",
            url:
              heroData.active_image_url &&
              !heroData.active_image_url.includes("hero_1789357573544_q5yysw.webp") &&
              !heroData.active_image_url.includes("hero-student.jpg")
                ? heroData.active_image_url
                : "https://oorovtqwyfrfjfwuufyi.supabase.co/storage/v1/object/public/hero_images/hero_1789356392635_x4rpk6.webp",
          },
        ];

  const nextSlide = () => setCurrentIndex((prev) => (prev + 1) % slides.length);
  const prevSlide = () => setCurrentIndex((prev) => (prev - 1 + slides.length) % slides.length);

  useEffect(() => {
    if (slides.length <= 1 || isPaused) return;
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % slides.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [slides.length, isPaused]);

  const currentSlide = slides[currentIndex] || slides[0];
  const sortedCategories = sortCategories(categories);

  return (
    <section className="relative min-h-[90vh] flex flex-col justify-center bg-background overflow-hidden pt-24 pb-12 lg:pt-28 lg:pb-16">
      {/* Ambient background soft glow */}
      <div
        className="absolute top-12 left-1/4 w-[500px] h-[500px] rounded-full opacity-30 dark:opacity-15 pointer-events-none blur-3xl"
        style={{
          background: "radial-gradient(circle, rgba(255,95,0,0.18) 0%, transparent 70%)",
        }}
        aria-hidden="true"
      />
      <div
        className="absolute bottom-10 right-10 w-[450px] h-[450px] rounded-full opacity-20 dark:opacity-10 pointer-events-none blur-3xl"
        style={{
          background: "radial-gradient(circle, rgba(124,58,237,0.15) 0%, transparent 70%)",
        }}
        aria-hidden="true"
      />

      <div className="container-main relative z-10">
        <div className="grid lg:grid-cols-12 gap-10 lg:gap-8 items-center">
          {/* Left Column: Copy & Actions & Category Tabs */}
          <div className="lg:col-span-7 max-w-2xl">
            {/* Top punchy badge */}
            <motion.div
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
              className="mb-4"
            >
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-bold font-bengali shadow-xs">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75" />
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-primary" />
                </span>
                <span>{heroData.badge_text}</span>
              </div>
            </motion.div>

            {/* Headline */}
            <motion.h1
              className="text-4xl sm:text-5xl lg:text-[62px] font-black text-text tracking-tight leading-[1.12] mb-3"
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
            >
              {heroData.title_line_1} <br />
              <span>{heroData.title_line_2}</span>
            </motion.h1>

            {/* Subtitle / Description in Refined Color Grading */}
            <motion.p
              className="text-base sm:text-lg lg:text-xl text-slate-600 dark:text-slate-300 font-medium font-bengali leading-relaxed mb-8 max-w-xl"
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.18 }}
            >
              {heroData.subtitle}
            </motion.p>

            {/* CTA Buttons: Start Learning & Browse Courses */}
            <motion.div
              className="flex flex-wrap items-center gap-4 mb-8 sm:mb-10"
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.26 }}
            >
              <Link
                href={heroData.primary_cta_url || "/courses"}
                className="inline-flex items-center justify-center px-8 py-3.5 rounded-full text-sm sm:text-base font-bold text-white bg-primary hover:bg-primary-hover shadow-lg shadow-primary/25 hover:shadow-xl hover:shadow-primary/35 hover:-translate-y-0.5 active:translate-y-0 transition-all duration-200"
              >
                <span>{heroData.primary_cta_text || "Start Learning"}</span>
              </Link>

              <Link
                href={heroData.secondary_cta_url || "/courses"}
                className="inline-flex items-center justify-center px-8 py-3.5 rounded-full text-sm sm:text-base font-bold text-primary bg-surface border-2 border-primary hover:bg-primary/5 shadow-xs hover:shadow-md hover:-translate-y-0.5 active:translate-y-0 transition-all duration-200"
              >
                <span>{heroData.secondary_cta_text || "Browse Courses"}</span>
              </Link>
            </motion.div>

            {/* Category Selector Cards (Highlighted & Eye-Catching: SSC & HSC on top, HSC Science & Admission below) */}
            {sortedCategories.length > 0 && (
              <motion.div
                className="pt-2 w-full max-w-lg"
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.35 }}
              >
                <div className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-3 flex items-center gap-1.5 font-bengali">
                  <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
                  <span>আপনার পছন্দের বিভাগ বেছে নিন:</span>
                </div>

                <div className="grid grid-cols-2 gap-2.5 sm:gap-3.5 w-full">
                  {sortedCategories.map((cat) => {
                    const Icon = resolveCategoryIcon(cat.slug, cat.icon_name);
                    const label = getCategoryShortLabel(cat);
                    const isActive = activeSlug === cat.slug;
                    const theme = getCategoryBadgeTheme(cat.slug);

                    return (
                      <Link
                        key={cat.id || cat.slug}
                        href={`/category/${cat.slug}`}
                        onClick={() => setActiveSlug(cat.slug)}
                        className={`group relative flex items-center gap-2.5 sm:gap-3 p-3 sm:p-3.5 rounded-2xl font-bold transition-all duration-300 cursor-pointer shadow-sm hover:shadow-md ${
                          isActive
                            ? "bg-surface text-primary border-2 border-primary ring-2 ring-primary/20 shadow-md scale-[1.02]"
                            : "bg-surface text-slate-800 dark:text-slate-200 border-2 border-slate-200/90 dark:border-slate-800 hover:border-primary/50 hover:bg-surface-secondary hover:scale-[1.01]"
                        }`}
                      >
                        <div
                          className={`w-9 h-9 sm:w-10 sm:h-10 rounded-xl flex items-center justify-center shrink-0 border ${theme.bg} transition-transform group-hover:scale-110 shadow-xs`}
                        >
                          <Icon className="w-5 h-5" />
                        </div>
                        <div className="flex flex-col min-w-0">
                          <span className="text-sm sm:text-base font-black truncate">{label}</span>
                          <span className="text-[10px] text-slate-400 font-medium font-bengali truncate">
                            কোর্সসমূহ দেখুন
                          </span>
                        </div>
                      </Link>
                    );
                  })}
                </div>
              </motion.div>
            )}
          </div>

          {/* Right Column: 16:9 Real Hero Banner + Compact Floating Badges */}
          <div className="lg:col-span-5 relative flex justify-center items-center">
            <div className="relative w-full max-w-[440px] sm:max-w-[480px] lg:max-w-[500px]">
              {/* Background ambient circular glow */}
              <div className="absolute inset-0 m-auto w-64 h-64 sm:w-80 sm:h-80 rounded-full bg-gradient-to-tr from-primary/20 via-secondary/15 to-accent/20 blur-3xl -z-10" />

              {/* Photo Container: strictly 16:9 aspect-video to fit entire image without cropping */}
              <div
                className="relative rounded-2xl sm:rounded-3xl overflow-hidden bg-surface aspect-video w-full shadow-2xl border border-border/80 group select-none"
                onMouseEnter={() => setIsPaused(true)}
                onMouseLeave={() => setIsPaused(false)}
              >
                <AnimatePresence mode="wait">
                  <motion.div
                    key={currentSlide.id || currentIndex}
                    initial={{ opacity: 0, scale: 1.01 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.99 }}
                    transition={{ duration: 0.4, ease: "easeInOut" }}
                    className="absolute inset-0 w-full h-full"
                  >
                    <Image
                      src={currentSlide.url}
                      alt={currentSlide.title || "Ormission Learning Hero"}
                      fill
                      priority
                      unoptimized={Boolean(currentSlide.url?.startsWith("http"))}
                      sizes="(max-width: 1024px) 100vw, 500px"
                      className="object-cover object-center group-hover:scale-105 transition-transform duration-500"
                    />
                  </motion.div>
                </AnimatePresence>

                {/* Multi-slide controls (only if more than 1 REAL photo exists) */}
                {slides.length > 1 && (
                  <>
                    <button
                      type="button"
                      onClick={(e) => {
                        e.preventDefault();
                        prevSlide();
                      }}
                      className="absolute left-2.5 top-1/2 -translate-y-1/2 z-20 w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-black/40 hover:bg-black/70 text-white backdrop-blur-md flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-200 hover:scale-110 shadow-md border border-white/15 cursor-pointer"
                      aria-label="Previous Slide"
                    >
                      <ChevronLeft className="w-4 h-4" />
                    </button>
                    <button
                      type="button"
                      onClick={(e) => {
                        e.preventDefault();
                        nextSlide();
                      }}
                      className="absolute right-2.5 top-1/2 -translate-y-1/2 z-20 w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-black/40 hover:bg-black/70 text-white backdrop-blur-md flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-200 hover:scale-110 shadow-md border border-white/15 cursor-pointer"
                      aria-label="Next Slide"
                    >
                      <ChevronRight className="w-4 h-4" />
                    </button>

                    <div className="absolute bottom-2.5 left-1/2 -translate-x-1/2 z-20 flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-black/40 backdrop-blur-md border border-white/15">
                      {slides.map((_, idx) => (
                        <button
                          key={idx}
                          type="button"
                          onClick={() => setCurrentIndex(idx)}
                          className={`transition-all duration-300 rounded-full cursor-pointer ${
                            idx === currentIndex ? "w-5 h-1.5 bg-primary" : "w-1.5 h-1.5 bg-white/50"
                          }`}
                          aria-label={`Slide ${idx + 1}`}
                        />
                      ))}
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
