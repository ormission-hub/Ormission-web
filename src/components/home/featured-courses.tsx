"use client";

import { useEffect, useState, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { ChevronLeft, ChevronRight, Star, Sparkles, BookOpen } from "lucide-react";
import { SectionWrapper } from "@/components/global/section-wrapper";
import { cn } from "@/lib/utils";
import { createClient } from "@/lib/supabase/client";

export interface DbFeaturedCourse {
  id: number | string;
  slug: string;
  title: string;
  title_bn?: string | null;
  price: number;
  original_price?: number | null;
  enrollment_count?: number;
  is_featured?: boolean;
  status?: string;
  thumbnail_url?: string | null;
  categories?: any;
  instructors?: any;
  category_id?: number | string | null;
  short_description?: string | null;
  description?: string | null;
}

function CourseCard({ course }: { course: DbFeaturedCourse }) {
  const price = course.price;
  const originalPrice = course.original_price;
  const title = course.title_bn || course.title;
  const categoryName = Array.isArray(course.categories)
    ? course.categories[0]?.name_bn || course.categories[0]?.name
    : course.categories?.name_bn || course.categories?.name || "কোর্স";

  const description =
    course.short_description ||
    course.description ||
    "সেরা মেন্টরদের লাইভ ক্লাস, বিগত ২০ বছরের প্রশ্নব্যাংক সলভিং ও সার্বক্ষণিক ডাউট সলভিং।";

  return (
    <div
      className={cn(
        "group flex flex-col bg-surface border border-border/80 rounded-2xl overflow-hidden transition-all duration-300",
        "shadow-soft-card hover:shadow-floating hover:border-primary/40 hover:-translate-y-1 h-full"
      )}
    >
      {/* Thumbnail */}
      <Link href={`/course/${course.slug}`} className="relative aspect-video w-full bg-slate-900 overflow-hidden block">
        {course.thumbnail_url ? (
          <Image
            src={course.thumbnail_url}
            alt={title}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            className="object-cover group-hover:scale-105 transition-transform duration-300"
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-primary/10 via-surface-secondary to-secondary/15 flex items-center justify-center p-4">
            <div className="w-12 h-12 rounded-2xl bg-surface/90 border border-border flex items-center justify-center shadow-xs group-hover:scale-110 transition-transform">
              <Sparkles className="w-6 h-6 text-primary" />
            </div>
          </div>
        )}
        <span className="absolute bottom-3 left-3 px-2.5 py-0.5 text-[11px] font-bold rounded-full bg-black/65 backdrop-blur-xs text-white border border-white/20 font-bengali z-10">
          {categoryName}
        </span>
      </Link>

      {/* Content */}
      <div className="flex flex-col flex-1 p-5">
        <Link href={`/course/${course.slug}`}>
          <h3 className="text-base font-extrabold text-text line-clamp-1 mb-2 font-bengali group-hover:text-primary transition-colors">
            {title}
          </h3>
        </Link>
        <p className="text-xs text-text-muted line-clamp-2 mb-3 font-bengali leading-relaxed">
          {description}
        </p>

        {/* 5-Star Rating (Reference Mockup Style) */}
        <div className="flex items-center gap-1 mb-4">
          {[...Array(5)].map((_, i) => (
            <Star key={i} className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
          ))}
          <span className="text-xs font-bold text-text ml-1">5.0</span>
        </div>

        {/* Bottom Pricing & Enroll Action */}
        <div className="mt-auto pt-3 border-t border-border/60 flex items-center justify-between">
          <div className="flex items-baseline gap-2">
            <span className="text-lg font-black text-text tabular-nums">
              ৳{price.toLocaleString("en-US")}
            </span>
            {originalPrice && originalPrice > price && (
              <span className="text-xs text-text-muted line-through tabular-nums">
                ৳{originalPrice.toLocaleString("en-US")}
              </span>
            )}
          </div>

          {/* Deep Forest Green / Teal "Enroll" Button (Matching Reference Mockup) */}
          <Link
            href={`/course/${course.slug}`}
            className="inline-flex items-center justify-center px-5 py-2 rounded-full text-xs sm:text-sm font-bold text-white bg-emerald-600 hover:bg-emerald-700 shadow-sm hover:shadow-md hover:scale-[1.03] active:scale-[0.98] transition-all duration-200"
          >
            Enroll
          </Link>
        </div>
      </div>
    </div>
  );
}

export function FeaturedCourses({ initialCourses = [] }: { initialCourses?: DbFeaturedCourse[] }) {
  const [courses, setCourses] = useState<DbFeaturedCourse[]>(initialCourses);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    async function loadDbCourses() {
      const supabase = createClient();
      try {
        const { data, error } = await supabase
          .from("courses")
          .select(`
            id,
            slug,
            title,
            title_bn,
            price,
            original_price,
            enrollment_count,
            is_featured,
            status,
            thumbnail_url,
            short_description,
            description,
            categories:category_id (id, name, name_bn, slug),
            instructors:instructor_id (id, name, name_bn, institution)
          `)
          .eq("status", "published")
          .order("created_at", { ascending: false });

        if (!error && data) {
          setCourses(data);
        }
      } catch (err) {
        // Silent fallback
      }
    }

    loadDbCourses();
  }, []);

  const scrollLeft = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({ left: -360, behavior: "smooth" });
    }
  };

  const scrollRight = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({ left: 360, behavior: "smooth" });
    }
  };

  if (courses.length === 0) {
    return null;
  }

  return (
    <SectionWrapper className="py-12 lg:py-16">
      {/* Header with Navigation Arrows (Reference Mockup Style) */}
      <div className="flex items-center justify-between mb-8 lg:mb-10">
        <div>
          <h2 className="text-2xl sm:text-3xl font-black text-text font-bengali tracking-tight">
            জনপ্রিয় কোর্স
          </h2>
          <p className="text-xs sm:text-sm text-text-muted font-bengali mt-1">
            শিক্ষার্থীদের সবচেয়ে পছন্দের শীর্ষ প্রস্তুতি কোর্সসমূহ
          </p>
        </div>

        {/* Carousel Arrow Controls (Only show if multiple courses exist) */}
        {courses.length > 1 && (
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={scrollLeft}
              className="w-9 h-9 sm:w-10 sm:h-10 rounded-full border border-border bg-surface text-text-muted hover:text-text hover:border-primary/40 hover:bg-surface-secondary flex items-center justify-center transition-all shadow-xs active:scale-95 cursor-pointer"
              aria-label="Previous courses"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button
              type="button"
              onClick={scrollRight}
              className="w-9 h-9 sm:w-10 sm:h-10 rounded-full border border-border bg-surface text-text-muted hover:text-text hover:border-primary/40 hover:bg-surface-secondary flex items-center justify-center transition-all shadow-xs active:scale-95 cursor-pointer"
              aria-label="Next courses"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        )}
      </div>

      {/* Course Cards Grid / Carousel */}
      <div
        ref={scrollRef}
        className={cn(
          "flex gap-6 overflow-x-auto pb-4 pt-1 scroll-smooth no-scrollbar snap-x snap-mandatory",
          courses.length <= 3 ? "flex-wrap lg:grid lg:grid-cols-3" : ""
        )}
      >
        {courses.map((course) => (
          <div
            key={course.id || course.slug}
            className={cn(
              "snap-start",
              courses.length <= 3
                ? "w-full sm:w-[320px] lg:w-auto"
                : "w-[280px] sm:w-[320px] lg:w-[350px] shrink-0"
            )}
          >
            <CourseCard course={course} />
          </div>
        ))}
      </div>

      {/* Carousel Dot Indicators (if more than 3 courses) */}
      {courses.length > 3 && (
        <div className="flex items-center justify-center gap-2 mt-6">
          <span className="w-6 h-2 rounded-full bg-primary" />
          <span className="w-2 h-2 rounded-full bg-border" />
          <span className="w-2 h-2 rounded-full bg-border" />
        </div>
      )}
    </SectionWrapper>
  );
}
