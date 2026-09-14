"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { Star, User, ChevronLeft, ChevronRight } from "lucide-react";
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
  const [page, setPage] = useState(0);
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

        if (!error && data) {
          setTestimonials(data);
        }
      } catch (err) {
        // Silent fallback
      }
    }

    loadTestimonials();
  }, []);

  const cardsPerPage = 3;
  const maxPages = Math.ceil(testimonials.length / cardsPerPage);

  // Auto slide testimonials every 7 seconds if not paused
  useEffect(() => {
    if (maxPages <= 1 || isPaused) return;
    const timer = setInterval(() => {
      setPage((prev) => (prev + 1) % maxPages);
    }, 7000);
    return () => clearInterval(timer);
  }, [maxPages, isPaused]);

  if (testimonials.length === 0) {
    return null;
  }

  const nextPage = () => setPage((prev) => (prev + 1) % maxPages);
  const prevPage = () => setPage((prev) => (prev - 1 + maxPages) % maxPages);

  const displayed = testimonials.slice(page * cardsPerPage, (page + 1) * cardsPerPage);

  return (
    <SectionWrapper className="py-12 lg:py-16 bg-surface-secondary/40">
      {/* Title with accent lines matching Reference Mockup: —— শিক্ষার্থীদের মতামত —— */}
      <div className="flex items-center justify-center gap-4 mb-10">
        <div className="w-12 sm:w-20 h-0.5 bg-primary/40 rounded-full" />
        <h2 className="text-2xl sm:text-3xl font-black text-text font-bengali tracking-tight text-center">
          শিক্ষার্থীদের মতামত
        </h2>
        <div className="w-12 sm:w-20 h-0.5 bg-primary/40 rounded-full" />
      </div>

      {/* Testimonial Cards Grid */}
      <div
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8"
        onMouseEnter={() => setIsPaused(true)}
        onMouseLeave={() => setIsPaused(false)}
      >
        {displayed.map((t) => (
          <div
            key={t.id}
            className="flex flex-col justify-between bg-surface border border-border/80 rounded-2xl p-6 sm:p-7 shadow-soft-card hover:shadow-floating hover:border-primary/40 transition-all duration-300"
          >
            <div>
              {/* 5 Yellow Stars (Matching Reference Mockup) */}
              <div className="flex items-center gap-1 mb-4 text-amber-400">
                {[...Array(t.rating || 5)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-amber-400" />
                ))}
              </div>

              {/* Student Quote from DB */}
              <p className="text-xs sm:text-sm text-text-muted font-bengali leading-relaxed mb-6">
                &ldquo;{t.review}&rdquo;
              </p>
            </div>

            {/* Student Avatar + Name + University / Batch */}
            <div className="flex items-center gap-3 pt-4 border-t border-border/60">
              <div className="relative w-10 h-10 rounded-full overflow-hidden bg-primary/10 border border-primary/25 shrink-0 flex items-center justify-center text-primary">
                {t.student_photo ? (
                  <Image
                    src={t.student_photo}
                    alt={t.student_name}
                    fill
                    sizes="40px"
                    className="object-cover"
                  />
                ) : (
                  <User className="w-5 h-5 text-primary" />
                )}
              </div>
              <div className="flex flex-col">
                <span className="text-sm font-bold text-text font-bengali leading-tight">
                  {t.student_name}
                </span>
                <span className="text-xs text-primary font-medium font-bengali mt-0.5">
                  {t.batch || t.course_name || "Ormission শিক্ষার্থী"}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Pagination Controls & Dots */}
      {maxPages > 1 && (
        <div className="flex items-center justify-center gap-4">
          <button
            type="button"
            onClick={prevPage}
            className="w-8 h-8 rounded-full border border-border bg-surface text-text-muted hover:text-text hover:border-primary/40 flex items-center justify-center transition-all shadow-xs cursor-pointer active:scale-95"
            aria-label="Previous testimonials"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>

          <div className="flex items-center gap-2">
            {Array.from({ length: maxPages }).map((_, i) => (
              <button
                key={i}
                type="button"
                onClick={() => setPage(i)}
                className={`transition-all duration-200 cursor-pointer rounded-full ${
                  page === i ? "w-6 h-2 bg-primary" : "w-2 h-2 bg-border hover:bg-text-muted"
                }`}
                aria-label={`Go to page ${i + 1}`}
              />
            ))}
          </div>

          <button
            type="button"
            onClick={nextPage}
            className="w-8 h-8 rounded-full border border-border bg-surface text-text-muted hover:text-text hover:border-primary/40 flex items-center justify-center transition-all shadow-xs cursor-pointer active:scale-95"
            aria-label="Next testimonials"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      )}
    </SectionWrapper>
  );
}
