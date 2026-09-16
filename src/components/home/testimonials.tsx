"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { Star, User, ChevronLeft, ChevronRight, Quote, Sparkles } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { SectionWrapper } from "@/components/global/section-wrapper";
import { createClient } from "@/lib/supabase/client";

export interface DbTestimonial {
  id: number | string;
  student_name: string;
  student_photo?: string | null;
  course_name?: string | null;
  batch?: string | null;
  review: string;
  rating: number;
  display_order?: number;
  is_published?: boolean;
}

export function Testimonials({
  initialTestimonials = [],
}: {
  initialTestimonials?: DbTestimonial[];
}) {
  const [testimonials, setTestimonials] = useState<DbTestimonial[]>(initialTestimonials);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [direction, setDirection] = useState(1);
  const [isPaused, setIsPaused] = useState(false);

  useEffect(() => {
    async function loadTestimonials() {
      const supabase = createClient();
      try {
        const { data, error } = await supabase
          .from("testimonials")
          .select("id, student_name, student_photo, course_name, batch, review, rating, display_order")
          .eq("is_published", true)
          .order("display_order", { ascending: true });

        if (!error && data && data.length > 0) {
          setTestimonials(data);
        }
      } catch {
        // Silent fallback to initial
      }
    }

    loadTestimonials();
  }, []);

  const total = testimonials.length;

  // Auto-slide every 6 seconds when not hovered
  useEffect(() => {
    if (total <= 1 || isPaused) return;
    const interval = setInterval(() => {
      setDirection(1);
      setCurrentIndex((prev) => (prev + 1) % total);
    }, 6000);
    return () => clearInterval(interval);
  }, [total, isPaused]);

  if (total === 0) {
    return null;
  }

  const handlePrev = () => {
    setDirection(-1);
    setCurrentIndex((prev) => (prev - 1 + total) % total);
  };

  const handleNext = () => {
    setDirection(1);
    setCurrentIndex((prev) => (prev + 1) % total);
  };

  const current = testimonials[currentIndex];

  // Slide transition variants
  const slideVariants = {
    enter: (dir: number) => ({
      x: dir > 0 ? 80 : -80,
      opacity: 0,
      scale: 0.97,
    }),
    center: {
      x: 0,
      opacity: 1,
      scale: 1,
      transition: {
        x: { type: "spring" as const, stiffness: 300, damping: 30 },
        opacity: { duration: 0.3 },
        scale: { duration: 0.3 },
      },
    },
    exit: (dir: number) => ({
      x: dir > 0 ? -80 : 80,
      opacity: 0,
      scale: 0.97,
      transition: {
        x: { type: "spring" as const, stiffness: 300, damping: 30 },
        opacity: { duration: 0.2 },
      },
    }),
  };

  return (
    <SectionWrapper className="py-14 lg:py-20 overflow-hidden">
      {/* Section Header */}
      <div className="flex flex-col items-center justify-center mb-10 sm:mb-14 text-center">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-bold font-bengali mb-4">
          <Sparkles className="w-3.5 h-3.5" />
          <span>সাফল্যের গল্প ও অনুপ্রেরণা</span>
        </div>

        <div className="flex items-center justify-center gap-3 sm:gap-4">
          <div className="w-10 sm:w-16 h-0.5 bg-primary/30 rounded-full" />
          <h2 className="text-2xl sm:text-4xl font-black text-text font-bengali tracking-tight">
            শিক্ষার্থীদের মতামত
          </h2>
          <div className="w-10 sm:w-16 h-0.5 bg-primary/30 rounded-full" />
        </div>
        <p className="text-xs sm:text-sm text-text-muted font-bengali mt-2.5 max-w-md">
          অর্মিশনের মাধ্যমে প্রস্তুতি নিয়ে দেশের সেরা বিদ্যাপীঠে চান্স পাওয়া শিক্ষার্থীদের বাস্তব অভিজ্ঞতা
        </p>
      </div>

      {/* ─── Testimonial Card Carousel ─── */}
      <div
        className="max-w-3xl mx-auto relative px-2 sm:px-4"
        onMouseEnter={() => setIsPaused(true)}
        onMouseLeave={() => setIsPaused(false)}
      >
        {/* Soft ambient glow behind the card */}
        <div className="absolute inset-x-8 top-8 bottom-4 rounded-3xl bg-primary/8 dark:bg-primary/5 blur-2xl pointer-events-none" />

        {/* Main Card */}
        <div className="relative w-full rounded-2xl sm:rounded-3xl overflow-hidden bg-surface border border-border/60 dark:border-border/40 shadow-lg dark:shadow-2xl">
          {/* Top accent strip */}
          <div className="h-1 w-full bg-gradient-to-r from-primary/60 via-primary to-primary/60" />

          {/* Content area */}
          <div className="relative px-6 sm:px-12 lg:px-16 pt-8 sm:pt-10 pb-6 sm:pb-8">
            {/* Decorative large quote mark */}
            <div className="absolute top-4 left-4 sm:top-6 sm:left-8">
              <Quote className="w-10 h-10 sm:w-14 sm:h-14 text-primary/10 dark:text-primary/8 rotate-180" />
            </div>

            {/* Animated content */}
            <AnimatePresence mode="wait" custom={direction}>
              <motion.div
                key={current.id}
                custom={direction}
                variants={slideVariants}
                initial="enter"
                animate="center"
                exit="exit"
                className="w-full flex flex-col items-center text-center"
              >
                {/* Star Rating */}
                <div className="flex items-center gap-1 mb-5">
                  {[...Array(current.rating || 5)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 sm:w-[18px] sm:h-[18px] fill-amber-400 text-amber-400" />
                  ))}
                  <span className="text-xs font-bold text-text-muted ml-1.5 font-sans">
                    {(current.rating || 5).toFixed(1)}
                  </span>
                </div>

                {/* Quote Text */}
                <blockquote className="relative mb-7 sm:mb-8 max-w-xl mx-auto">
                  <p className="text-base sm:text-lg lg:text-xl font-semibold font-bengali leading-relaxed sm:leading-loose text-text">
                    &ldquo;{current.review}&rdquo;
                  </p>
                </blockquote>

                {/* Divider */}
                <div className="w-12 h-0.5 bg-primary/25 rounded-full mb-5 sm:mb-6" />

                {/* Student Info */}
                <div className="flex flex-col items-center gap-3">
                  {/* Photo */}
                  <div className="relative w-14 h-14 sm:w-16 sm:h-16 rounded-full ring-2 ring-primary/20 ring-offset-2 ring-offset-surface overflow-hidden">
                    {current.student_photo ? (
                      <Image
                        src={current.student_photo}
                        alt={current.student_name}
                        fill
                        sizes="64px"
                        className="rounded-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full rounded-full bg-primary/10 dark:bg-primary/15 flex items-center justify-center text-primary font-bold text-lg font-bengali">
                        {current.student_name ? current.student_name.slice(0, 1) : <User className="w-6 h-6" />}
                      </div>
                    )}
                  </div>

                  {/* Name & batch/course */}
                  <div className="flex flex-col items-center gap-0.5">
                    <span className="text-sm sm:text-base font-bold font-bengali text-text">
                      {current.student_name}
                    </span>
                    {(current.course_name || current.batch) && (
                      <span className="text-xs font-medium text-text-muted font-bengali">
                        {current.course_name}
                        {current.course_name && current.batch ? " · " : ""}
                        {current.batch}
                      </span>
                    )}
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Bottom bar: pagination + nav */}
          <div className="relative px-6 sm:px-12 pb-5 sm:pb-6 flex items-center justify-center gap-4">
            {/* Prev button */}
            <button
              type="button"
              onClick={handlePrev}
              aria-label="Previous Testimonial"
              className="w-9 h-9 sm:w-10 sm:h-10 rounded-full border border-border/80 dark:border-border/50 bg-surface-secondary/60 dark:bg-surface-secondary/40 hover:bg-primary/10 dark:hover:bg-primary/15 text-text-muted hover:text-primary flex items-center justify-center transition-all duration-200 cursor-pointer focus:outline-none"
            >
              <ChevronLeft className="w-4 h-4 sm:w-5 sm:h-5" />
            </button>

            {/* Dots */}
            <div className="flex items-center gap-1.5 sm:gap-2">
              {testimonials.map((_, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => {
                    setDirection(idx > currentIndex ? 1 : -1);
                    setCurrentIndex(idx);
                  }}
                  aria-label={`Go to slide ${idx + 1}`}
                  className={`transition-all duration-300 rounded-full cursor-pointer ${
                    idx === currentIndex
                      ? "w-6 sm:w-7 h-2 bg-primary"
                      : "w-2 h-2 bg-border dark:bg-border/60 hover:bg-primary/40"
                  }`}
                />
              ))}
            </div>

            {/* Next button */}
            <button
              type="button"
              onClick={handleNext}
              aria-label="Next Testimonial"
              className="w-9 h-9 sm:w-10 sm:h-10 rounded-full border border-border/80 dark:border-border/50 bg-surface-secondary/60 dark:bg-surface-secondary/40 hover:bg-primary/10 dark:hover:bg-primary/15 text-text-muted hover:text-primary flex items-center justify-center transition-all duration-200 cursor-pointer focus:outline-none"
            >
              <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5" />
            </button>
          </div>
        </div>
      </div>
    </SectionWrapper>
  );
}
