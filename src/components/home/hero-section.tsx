"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  BookOpen,
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
  order?: number;
  duration?: number;
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
  autoplay_interval?: number;
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
  active_image_url:
    "https://oorovtqwyfrfjfwuufyi.supabase.co/storage/v1/object/public/hero_images/hero_1789478404991_a7wl8n.jpg",
  photos: [
    {
      id: "hero-user-uploaded",
      title: "নতুন আপলোড করা ব্যানার",
      url: "https://oorovtqwyfrfjfwuufyi.supabase.co/storage/v1/object/public/hero_images/hero_1789478404991_a7wl8n.jpg",
      is_active: true,
      primary_cta_text: "Browse Course",
      primary_cta_url: "/courses",
      secondary_cta_text: "Buy Book",
      secondary_cta_url: "/courses",
    },
    {
      id: "hero-admission-2026",
      title: "Admission 2026 Premium Batch",
      url: "https://oorovtqwyfrfjfwuufyi.supabase.co/storage/v1/object/public/hero_images/hero_1789356392635_x4rpk6.webp",
      is_active: true,
      primary_cta_text: "Browse Course",
      primary_cta_url: "/courses",
      secondary_cta_text: "Buy Book",
      secondary_cta_url: "/courses",
    },
  ],
};

// Helper to filter out known mock/test photos
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

  // Sync if server data changes
  useEffect(() => {
    if (initialHeroData) {
      setHeroData({
        ...initialHeroData,
        photos: filterRealPhotos(initialHeroData.photos),
      });
    }
  }, [initialHeroData]);

  // Client load & Realtime sync with Supabase
  useEffect(() => {
    const supabase = createClient();

    async function loadData() {
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

    // Instant Realtime updates whenever admin saves or adds photos
    const channel = supabase
      .channel("realtime-hero-settings")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "site_settings",
          filter: "key=eq.hero_settings",
        },
        (payload: any) => {
          if (payload?.new?.value && typeof payload.new.value === "object") {
            const val = payload.new.value;
            setHeroData((prev) => ({
              ...prev,
              ...val,
              photos: filterRealPhotos(val.photos),
            }));
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const realPhotos = filterRealPhotos(heroData.photos);
  const activePhotos = realPhotos.filter((p) => p.is_active !== false);
  const rawSlides: HeroPhoto[] =
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
            order: 1,
            duration: 5,
          },
        ];

  // Strictly sort by serial order configured in admin panel
  const slides = [...rawSlides].sort((a, b) => (a.order ?? 999) - (b.order ?? 999));

  const nextSlide = () => setCurrentIndex((prev) => (prev + 1) % slides.length);
  const prevSlide = () => setCurrentIndex((prev) => (prev - 1 + slides.length) % slides.length);

  // Dynamic autoplay duration per slide
  useEffect(() => {
    if (slides.length <= 1 || isPaused) return;
    const curSlide = slides[currentIndex] || slides[0];
    const durationSeconds = curSlide?.duration || heroData.autoplay_interval || 5;
    const timer = setTimeout(() => {
      setCurrentIndex((prev) => (prev + 1) % slides.length);
    }, durationSeconds * 1000);
    return () => clearTimeout(timer);
  }, [currentIndex, slides, isPaused, heroData.autoplay_interval]);

  const currentSlide = slides[currentIndex] || slides[0];

  return (
    <section className="relative bg-background overflow-hidden pt-16 pb-6 sm:pb-8">
      {/* Ambient background soft glow */}
      <div
        className="absolute top-12 left-1/2 -translate-x-1/2 w-[800px] h-[500px] rounded-full opacity-25 dark:opacity-15 pointer-events-none blur-3xl"
        style={{
          background: "radial-gradient(circle, rgba(255,95,0,0.16) 0%, transparent 70%)",
        }}
        aria-hidden="true"
      />

      {/* 1. Full-Bleed Edge-to-Edge Banner Slider (Zero side gaps on all screens) */}
      <div className="w-full relative z-10">
        <div className="relative w-full">
          {/* Banner Container: 100% full-width edge-to-edge */}
          <div
            className="relative w-full aspect-video overflow-hidden bg-surface rounded-none border-b border-border/80 shadow-md group select-none"
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
                    sizes="100vw"
                    className="object-cover object-top group-hover:scale-[1.015] transition-transform duration-500"
                  />

                  {/* Cinematic Dark Gradient Overlay for optimal button contrast */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/25 to-transparent pointer-events-none" />

                  {/* Over-Image CTA Buttons (Bottom-Left) */}
                  <div className="absolute bottom-3 sm:bottom-6 md:bottom-8 left-4 sm:left-8 md:left-12 lg:left-16 z-20 flex items-center gap-2 sm:gap-3.5 max-w-[calc(100%-85px)] sm:max-w-none">
                    <Link
                      href={currentSlide.primary_cta_url || heroData.primary_cta_url || "/courses"}
                      className="inline-flex items-center gap-1.5 sm:gap-2 px-3 sm:px-6 py-1.5 sm:py-3 rounded-full text-[11px] sm:text-sm font-bold text-white bg-primary hover:bg-primary-hover shadow-lg shadow-primary/35 hover:shadow-xl hover:shadow-primary/45 hover:-translate-y-0.5 active:translate-y-0 transition-all duration-200 cursor-pointer shrink-0"
                    >
                      <Sparkles className="w-3 h-3 sm:w-4 sm:h-4 text-white shrink-0" />
                      <span className="truncate max-w-[110px] sm:max-w-none">
                        {currentSlide.primary_cta_text || heroData.primary_cta_text || "Browse Course"}
                      </span>
                    </Link>

                    <Link
                      href={currentSlide.secondary_cta_url || heroData.secondary_cta_url || "/courses"}
                      className="inline-flex items-center gap-1.5 sm:gap-2 px-3 sm:px-6 py-1.5 sm:py-3 rounded-full text-[11px] sm:text-sm font-bold text-white bg-black/45 hover:bg-black/65 border border-white/30 hover:border-white/60 backdrop-blur-md shadow-lg hover:-translate-y-0.5 active:translate-y-0 transition-all duration-200 cursor-pointer shrink-0"
                    >
                      <BookOpen className="w-3 h-3 sm:w-4 sm:h-4 text-white shrink-0" />
                      <span className="truncate max-w-[110px] sm:max-w-none">
                        {currentSlide.secondary_cta_text || heroData.secondary_cta_text || "Buy Book"}
                      </span>
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
                  className="absolute left-2 sm:left-6 md:left-8 top-1/2 -translate-y-1/2 z-20 w-8 h-8 sm:w-12 sm:h-12 rounded-full bg-black/45 hover:bg-black/80 text-white backdrop-blur-md flex items-center justify-center opacity-85 sm:opacity-0 group-hover:opacity-100 transition-all duration-300 hover:scale-110 shadow-xl border border-white/20 cursor-pointer"
                  aria-label="Previous Slide"
                >
                  <ChevronLeft className="w-4 h-4 sm:w-6 sm:h-6" />
                </button>
                <button
                  type="button"
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    nextSlide();
                  }}
                  className="absolute right-2 sm:right-6 md:right-8 top-1/2 -translate-y-1/2 z-20 w-8 h-8 sm:w-12 sm:h-12 rounded-full bg-black/45 hover:bg-black/80 text-white backdrop-blur-md flex items-center justify-center opacity-85 sm:opacity-0 group-hover:opacity-100 transition-all duration-300 hover:scale-110 shadow-xl border border-white/20 cursor-pointer"
                  aria-label="Next Slide"
                >
                  <ChevronRight className="w-4 h-4 sm:w-6 sm:h-6" />
                </button>

                {/* Netflix-Style Progress Bar / Dot Indicators on bottom right */}
                <div className="absolute bottom-3 sm:bottom-6 md:bottom-8 right-4 sm:right-8 md:right-12 lg:right-16 z-20 flex items-center gap-1.5 px-2.5 sm:px-3 py-1 sm:py-1.5 rounded-full bg-black/60 backdrop-blur-md border border-white/20 shadow-lg">
                  {slides.map((_, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        setCurrentIndex(idx);
                      }}
                      className={`transition-all duration-300 rounded-full cursor-pointer ${idx === currentIndex
                          ? "w-4 sm:w-7 h-1.5 sm:h-2 bg-primary shadow-sm shadow-primary/60"
                          : "w-1.5 sm:w-2 h-1.5 sm:h-2 bg-white/40 hover:bg-white/70"
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

    </section>
  );
}
