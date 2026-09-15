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
  title_line_1: "স্বপ্ন যেখানে শীর্ষ বিশ্ববিদ্যালয় ও মেডিকেল",
  title_line_2: "প্রস্তুতি হোক শতভাগ নিখুঁত ও আত্মবিশ্বাসী",
  subtitle:
    "অভিজ্ঞ মেন্টরদের লাইভ ক্লাস, বিগত ২০ বছরের প্রশ্নব্যাংক সলভিং ও সার্বক্ষণিক ডাউট সলভিং নিয়ে ঘরে বসেই নিন সেরা প্রস্তুতি।",
  primary_cta_text: "Start Courses",
  primary_cta_url: "/courses",
  secondary_cta_text: "Free Learning",
  secondary_cta_url: "/free-resources",
  active_image_url:
    "https://oorovtqwyfrfjfwuufyi.supabase.co/storage/v1/object/public/hero_images/hero_1789356392635_x4rpk6.webp",
  photos: [
    {
      id: "real-hero-banner",
      title: "Admission 2026 Premium Batch",
      url: "https://oorovtqwyfrfjfwuufyi.supabase.co/storage/v1/object/public/hero_images/hero_1789356392635_x4rpk6.webp",
      is_active: true,
      primary_cta_text: "Start Courses",
      primary_cta_url: "/courses",
      secondary_cta_text: "Free Learning",
      secondary_cta_url: "/free-resources",
    },
  ],
};

const defaultCategoryList: DbCategoryItem[] = [
  { id: 1, name: "SSC Board Full Preparation", name_bn: "এসএসসি প্রস্তুতি", slug: "ssc-prep", icon_name: "graduation" },
  { id: 2, name: "HSC Humanities & Business Studies", name_bn: "এইচএসসি", slug: "hsc-arts", icon_name: "rocket" },
  { id: 3, name: "HSC Science (Physics, Chem, Math, Bio)", name_bn: "এইচএসসি সায়েন্স", slug: "hsc-science", icon_name: "flask" },
  { id: 4, name: "University Admission (A & B Unit)", name_bn: "বিশ্ববিদ্যালয় ভর্তি", slug: "university-admission", icon_name: "building" },
];

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
  return photos.filter((p) => Boolean(p.url));
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
  const [categories, setCategories] = useState<DbCategoryItem[]>(() => {
    const list =
      initialCategories && initialCategories.length > 0
        ? initialCategories
        : defaultCategoryList;
    return sortCategories(list);
  });
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
  const activePhotos = realPhotos.filter((p) => p.is_active !== false);
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
              heroData.active_image_url ||
              "https://oorovtqwyfrfjfwuufyi.supabase.co/storage/v1/object/public/hero_images/hero_1789356392635_x4rpk6.webp",
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
    <section className="relative bg-background overflow-hidden pt-20 sm:pt-24 pb-8 sm:pb-12">
      {/* Ambient background soft glow */}
      <div
        className="absolute top-12 left-1/2 -translate-x-1/2 w-[800px] h-[500px] rounded-full opacity-25 dark:opacity-15 pointer-events-none blur-3xl"
        style={{
          background: "radial-gradient(circle, rgba(255,95,0,0.16) 0%, transparent 70%)",
        }}
        aria-hidden="true"
      />

      <div className="container-main relative z-10">
        {/* Full Image Banner Slider (Netflix Billboard Style) */}
        <div className="relative w-full max-w-6xl mx-auto">
          {/* Ambient circular glow behind the banner */}
          <div className="absolute inset-0 m-auto w-4/5 h-4/5 rounded-3xl bg-gradient-to-tr from-primary/20 via-secondary/15 to-primary/10 blur-3xl -z-10" />

          {/* Banner Container: 16:9 ratio to fit all admission posters without any cropping */}
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
                transition={{ duration: 0.5, ease: "easeInOut" }}
                className="absolute inset-0 w-full h-full"
              >
                <div className="relative w-full h-full">
                  <Image
                    src={currentSlide.url}
                    alt={currentSlide.title || "Ormission Hero Banner"}
                    fill
                    priority
                    unoptimized={Boolean(currentSlide.url?.startsWith("http"))}
                    sizes="(max-width: 1280px) 100vw, 1200px"
                    className="object-cover object-center group-hover:scale-[1.015] transition-transform duration-500"
                  />

                  {/* Cinematic Dark Gradient Overlay for optimal button contrast */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/25 to-transparent pointer-events-none" />

                  {/* Over-Image CTA Buttons (Netflix Style: Start Courses & Free Learning) */}
                  <div className="absolute bottom-4 sm:bottom-8 left-4 sm:left-8 z-20 flex flex-wrap items-center gap-2.5 sm:gap-4">
                    <Link
                      href={currentSlide.primary_cta_url || heroData.primary_cta_url || "/courses"}
                      className="inline-flex items-center gap-2 px-5 sm:px-7 py-2.5 sm:py-3.5 rounded-full text-xs sm:text-sm font-bold text-white bg-primary hover:bg-primary-hover shadow-lg shadow-primary/35 hover:shadow-xl hover:shadow-primary/45 hover:-translate-y-0.5 active:translate-y-0 transition-all duration-200 cursor-pointer"
                    >
                      <Sparkles className="w-4 h-4 text-white" />
                      <span>{currentSlide.primary_cta_text || heroData.primary_cta_text || "Start Courses"}</span>
                    </Link>

                    <Link
                      href={currentSlide.secondary_cta_url || heroData.secondary_cta_url || "/free-resources"}
                      className="inline-flex items-center gap-2 px-5 sm:px-7 py-2.5 sm:py-3.5 rounded-full text-xs sm:text-sm font-bold text-white bg-black/40 hover:bg-black/60 border border-white/30 hover:border-white/60 backdrop-blur-md shadow-lg hover:-translate-y-0.5 active:translate-y-0 transition-all duration-200 cursor-pointer"
                    >
                      <BookOpen className="w-4 h-4 text-white" />
                      <span>{currentSlide.secondary_cta_text || heroData.secondary_cta_text || "Free Learning"}</span>
                    </Link>
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>

            {/* Netflix-Style Prev / Next Navigation Arrows */}
            {slides.length > 1 && (
              <>
                <button
                  type="button"
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    prevSlide();
                  }}
                  className="absolute left-3 sm:left-6 top-1/2 -translate-y-1/2 z-20 w-9 h-9 sm:w-12 sm:h-12 rounded-full bg-black/45 hover:bg-black/80 text-white backdrop-blur-md flex items-center justify-center opacity-85 sm:opacity-0 group-hover:opacity-100 transition-all duration-300 hover:scale-110 shadow-xl border border-white/20 cursor-pointer"
                  aria-label="Previous Slide"
                >
                  <ChevronLeft className="w-5 h-5 sm:w-6 sm:h-6" />
                </button>
                <button
                  type="button"
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    nextSlide();
                  }}
                  className="absolute right-3 sm:right-6 top-1/2 -translate-y-1/2 z-20 w-9 h-9 sm:w-12 sm:h-12 rounded-full bg-black/45 hover:bg-black/80 text-white backdrop-blur-md flex items-center justify-center opacity-85 sm:opacity-0 group-hover:opacity-100 transition-all duration-300 hover:scale-110 shadow-xl border border-white/20 cursor-pointer"
                  aria-label="Next Slide"
                >
                  <ChevronRight className="w-5 h-5 sm:w-6 sm:h-6" />
                </button>

                {/* Netflix-Style Progress Bar / Dot Indicators on bottom right */}
                <div className="absolute bottom-4 sm:bottom-8 right-4 sm:right-8 z-20 flex items-center gap-2 px-3 py-1.5 rounded-full bg-black/50 backdrop-blur-md border border-white/20 shadow-lg">
                  {slides.map((_, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        setCurrentIndex(idx);
                      }}
                      className={`transition-all duration-300 rounded-full cursor-pointer ${
                        idx === currentIndex
                          ? "w-6 sm:w-8 h-2 bg-primary shadow-sm shadow-primary/60"
                          : "w-2 sm:w-2.5 h-2 bg-white/40 hover:bg-white/70"
                      }`}
                      aria-label={`Slide ${idx + 1}`}
                    />
                  ))}
                </div>
              </>
            )}
          </div>
        </div>

        {/* Highlighted Category Quick Selector Bar (Directly below the Netflix slider) */}
        {sortedCategories.length > 0 && (
          <motion.div
            className="mt-6 sm:mt-8 max-w-5xl mx-auto w-full"
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.2 }}
          >
            <div className="flex items-center justify-center gap-2 mb-3 sm:mb-4 text-xs sm:text-sm font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider font-bengali">
              <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
              <span>আপনার পছন্দের বিভাগ বেছে নিন</span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 sm:gap-4 w-full">
              {sortedCategories.slice(0, 4).map((cat) => {
                const Icon = resolveCategoryIcon(cat.slug, cat.icon_name);
                const label = getCategoryShortLabel(cat);
                const isActive = activeSlug === cat.slug;
                const theme = getCategoryBadgeTheme(cat.slug);

                return (
                  <Link
                    key={cat.id || cat.slug}
                    href={`/category/${cat.slug}`}
                    onClick={() => setActiveSlug(cat.slug)}
                    className={`group relative flex items-center gap-3 p-3 sm:p-3.5 rounded-2xl font-bold transition-all duration-300 cursor-pointer shadow-sm hover:shadow-md ${
                      isActive
                        ? "bg-surface text-primary border-2 border-primary ring-2 ring-primary/20 shadow-md scale-[1.02]"
                        : "bg-surface text-slate-800 dark:text-slate-200 border-2 border-slate-200/90 dark:border-slate-800 hover:border-primary/50 hover:bg-surface-secondary hover:scale-[1.01]"
                    }`}
                  >
                    <div
                      className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 border ${theme.bg} transition-transform group-hover:scale-110 shadow-xs`}
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
    </section>
  );
}
