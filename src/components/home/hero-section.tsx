"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  ChevronLeft,
  ChevronRight,
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

const defaultHeroData: HeroData = {
  badge_text: "🔥 নতুন একাডেমিক ও এডমিশন ব্যাচে ভর্তি চলছে",
  title_line_1: "স্বপ্ন যেখানে শীর্ষ বিশ্ববিদ্যালয় ও মেডিকেল",
  title_line_2: "প্রস্তুতি হোক শতভাগ নিখুঁত ও আত্মবিশ্বাসী",
  subtitle:
    "অভিজ্ঞ মেন্টরদের লাইভ ক্লাস, বিগত ২০ বছরের প্রশ্নব্যাংক সলভিং ও সার্বক্ষণিক ডাউট সলভিং নিয়ে ঘরে বসেই নিন সেরা প্রস্তুতি।",
  primary_cta_text: "কোর্সগুলো এক্সপ্লোর করুন",
  primary_cta_url: "/courses",
  secondary_cta_text: "ফ্রি নোট ও প্রশ্নব্যাংক",
  secondary_cta_url: "/free-resources",
  active_image_url: "/images/hero-student.jpg",
  photos: [],
};

export function HeroSection() {
  const [heroData, setHeroData] = useState<HeroData>(defaultHeroData);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  useEffect(() => {
    async function loadDynamicHero() {
      try {
        const supabase = createClient();
        const { data } = await supabase
          .from("site_settings")
          .select("value")
          .eq("key", "hero_settings")
          .single();

        if (data?.value && typeof data.value === "object") {
          setHeroData((prev) => ({
            ...prev,
            ...data.value,
          }));
        }
      } catch (err) {
        // Silent fallback
      }
    }

    loadDynamicHero();
  }, []);

  const activePhotos = (heroData.photos || []).filter((p) => p.is_active);
  const slides: HeroPhoto[] =
    activePhotos.length > 0
      ? activePhotos
      : heroData.photos && heroData.photos.length > 0
      ? heroData.photos
      : [
          {
            id: "default-hero-slide",
            title: "Ormission Hero Banner",
            url: heroData.active_image_url || "/images/hero-student.jpg",
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

  return (
    <section className="relative min-h-[85vh] flex flex-col justify-center bg-background overflow-hidden pt-24 pb-12 lg:pt-28 lg:pb-16">
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
          {/* Left Column: Copy & Actions (6 cols) */}
          <div className="lg:col-span-6 max-w-2xl">
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
              className="text-4xl sm:text-5xl lg:text-[54px] font-black text-text tracking-tight leading-[1.18] mb-4 font-bengali"
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
            >
              {heroData.title_line_1} <br />
              <span className="text-primary">{heroData.title_line_2}</span>
            </motion.h1>

            {/* Subtitle */}
            <motion.p
              className="text-base sm:text-lg text-text-muted font-bengali mb-8 max-w-xl leading-relaxed"
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.18 }}
            >
              {heroData.subtitle}
            </motion.p>

            {/* CTA Buttons: Start Learning & Browse Courses */}
            <motion.div
              className="flex flex-wrap items-center gap-4"
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.26 }}
            >
              <Link
                href={heroData.primary_cta_url || "/courses"}
                className="inline-flex items-center justify-center px-8 py-3.5 rounded-full text-sm sm:text-base font-bold text-white bg-primary hover:bg-primary-hover shadow-lg shadow-primary/25 hover:shadow-xl hover:shadow-primary/35 hover:-translate-y-0.5 active:translate-y-0 transition-all duration-200 font-bengali"
              >
                <span>{heroData.primary_cta_text || "কোর্সগুলো এক্সপ্লোর করুন"}</span>
              </Link>

              <Link
                href={heroData.secondary_cta_url || "/free-resources"}
                className="inline-flex items-center justify-center px-8 py-3.5 rounded-full text-sm sm:text-base font-bold text-primary bg-surface border-2 border-primary hover:bg-primary/5 shadow-xs hover:shadow-md hover:-translate-y-0.5 active:translate-y-0 transition-all duration-200 font-bengali"
              >
                <span>{heroData.secondary_cta_text || "ফ্রি নোট ও প্রশ্নব্যাংক"}</span>
              </Link>
            </motion.div>
          </div>

          {/* Right Column: 100% Focused Hero Visual in 16:9 Ratio with Auto Carousel (6 cols) */}
          <div className="lg:col-span-6 relative">
            <div className="relative">
              {/* Glow Border Frame */}
              <div className="relative p-1.5 rounded-3xl bg-gradient-to-tr from-primary/35 via-secondary/25 to-accent/35 shadow-2xl shadow-primary/15">
                <div
                  className="relative rounded-[22px] overflow-hidden bg-surface aspect-video w-full group select-none"
                  onMouseEnter={() => setIsPaused(true)}
                  onMouseLeave={() => setIsPaused(false)}
                >
                  <AnimatePresence mode="wait">
                    <motion.div
                      key={currentSlide.id || currentIndex}
                      initial={{ opacity: 0, scale: 1.02 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.98 }}
                      transition={{ duration: 0.5, ease: "easeInOut" }}
                      className="absolute inset-0 w-full h-full"
                    >
                      <Image
                        src={currentSlide.url}
                        alt={currentSlide.title || "Ormission Hero Banner"}
                        fill
                        priority
                        unoptimized={Boolean(currentSlide.url?.startsWith("http"))}
                        sizes="(max-width: 1024px) 100vw, 650px"
                        className="object-cover object-center"
                      />
                    </motion.div>
                  </AnimatePresence>

                  {/* Multi-photo controls (only shown if more than 1 photo exists) */}
                  {slides.length > 1 && (
                    <>
                      {/* Top-right Counter Pill */}
                      <div className="absolute top-3 right-3 z-20 px-2.5 py-1 rounded-full text-[11px] font-bold bg-black/50 backdrop-blur-md text-white/95 border border-white/15 shadow-sm flex items-center gap-1">
                        <span>{currentIndex + 1}</span>
                        <span className="opacity-50">/</span>
                        <span>{slides.length}</span>
                      </div>

                      {/* Navigation Arrow Left */}
                      <button
                        type="button"
                        onClick={(e) => {
                          e.preventDefault();
                          prevSlide();
                        }}
                        className="absolute left-3 top-1/2 -translate-y-1/2 z-20 w-8 h-8 rounded-full bg-black/40 hover:bg-black/70 text-white backdrop-blur-md flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-200 hover:scale-110 shadow-md border border-white/15 cursor-pointer"
                        aria-label="Previous Slide"
                      >
                        <ChevronLeft className="w-4 h-4" />
                      </button>

                      {/* Navigation Arrow Right */}
                      <button
                        type="button"
                        onClick={(e) => {
                          e.preventDefault();
                          nextSlide();
                        }}
                        className="absolute right-3 top-1/2 -translate-y-1/2 z-20 w-8 h-8 rounded-full bg-black/40 hover:bg-black/70 text-white backdrop-blur-md flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-200 hover:scale-110 shadow-md border border-white/15 cursor-pointer"
                        aria-label="Next Slide"
                      >
                        <ChevronRight className="w-4 h-4" />
                      </button>

                      {/* Bottom Navigation Dots */}
                      <div className="absolute bottom-3 left-1/2 -translate-x-1/2 z-20 flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-black/45 backdrop-blur-md border border-white/15 shadow-lg">
                        {slides.map((_, idx) => (
                          <button
                            key={idx}
                            type="button"
                            onClick={(e) => {
                              e.preventDefault();
                              setCurrentIndex(idx);
                            }}
                            className={`transition-all duration-300 rounded-full cursor-pointer ${
                              idx === currentIndex
                                ? "w-6 h-2 bg-primary shadow-sm"
                                : "w-2 h-2 bg-white/50 hover:bg-white/90"
                            }`}
                            aria-label={`Go to slide ${idx + 1}`}
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
      </div>
    </section>
  );
}
