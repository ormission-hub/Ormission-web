"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import Image from "next/image";
import { ArrowRight, Sparkles, Star, Clock, Users } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { DbFeaturedCourse } from "./featured-courses";
import {
  staggerContainer,
  scrollReveal,
  zoomIn,
  zoomInUp,
  flipLeft,
  flipRight,
  hoverLiftProps,
} from "@/lib/animations";

// ==========================================
// Bondi Pathshala 3D Illustration Icons
// ==========================================

function SchoolIllustration() {
  return (
    <div className="w-12 h-12 sm:w-14 sm:h-14 flex items-center justify-center shrink-0 select-none">
      <svg viewBox="0 0 64 64" fill="none" className="w-full h-full drop-shadow-sm">
        {/* Bottom red book */}
        <rect x="10" y="44" width="44" height="8" rx="2" fill="#EF4444" />
        <rect x="8" y="46" width="6" height="4" rx="1" fill="#DC2626" />
        <line x1="16" y1="48" x2="52" y2="48" stroke="#FEE2E2" strokeWidth="1.5" strokeLinecap="round" />
        {/* Middle yellow book */}
        <rect x="14" y="36" width="40" height="7" rx="2" fill="#F59E0B" />
        <rect x="12" y="38" width="5" height="3" rx="1" fill="#D97706" />
        {/* Top green book */}
        <rect x="12" y="28" width="42" height="7" rx="2" fill="#10B981" />
        <rect x="10" y="30" width="5" height="3" rx="1" fill="#059669" />
        {/* Dark graduation mortarboard */}
        <path d="M32 12L12 20L32 28L52 20L32 12Z" fill="#334155" />
        <path d="M22 24.5V33C22 36.5 26.5 39 32 39C37.5 39 42 36.5 42 33V24.5" stroke="#334155" strokeWidth="2.5" fill="none" />
        {/* Yellow tassel */}
        <path d="M46 22.5V30" stroke="#FBBF24" strokeWidth="2" strokeLinecap="round" />
        <circle cx="46" cy="31" r="2" fill="#F59E0B" />
        <circle cx="32" cy="20" r="1.5" fill="#FBBF24" />
      </svg>
    </div>
  );
}

function HscIllustration() {
  return (
    <div className="w-12 h-12 sm:w-14 sm:h-14 flex items-center justify-center shrink-0 select-none">
      <svg viewBox="0 0 64 64" fill="none" className="w-full h-full drop-shadow-sm">
        {/* Bottom purple book */}
        <rect x="12" y="44" width="42" height="8" rx="2" fill="#8B5CF6" />
        <rect x="10" y="46" width="5" height="4" rx="1" fill="#7C3AED" />
        {/* Middle cyan book */}
        <rect x="14" y="36" width="38" height="7" rx="2" fill="#06B6D4" />
        <rect x="12" y="38" width="5" height="3" rx="1" fill="#0891B2" />
        {/* Top blue graduation mortarboard */}
        <path d="M32 14L12 22L32 30L52 22L32 14Z" fill="#2563EB" />
        <path d="M22 26V34C22 37.5 26.5 40 32 40C37.5 40 42 37.5 42 34V26" stroke="#1D4ED8" strokeWidth="2.5" fill="none" />
        {/* Cyan tassel */}
        <path d="M46 24V31" stroke="#38BDF8" strokeWidth="2" strokeLinecap="round" />
        <circle cx="46" cy="32" r="2" fill="#0284C7" />
        <circle cx="32" cy="22" r="1.5" fill="#60A5FA" />
        {/* Sparkle */}
        <path d="M50 14L51 16L53 17L51 18L50 20L49 18L47 17L49 16L50 14Z" fill="#38BDF8" />
      </svg>
    </div>
  );
}

function AdmissionIllustration() {
  return (
    <div className="w-12 h-12 sm:w-14 sm:h-14 flex items-center justify-center shrink-0 select-none">
      <svg viewBox="0 0 64 64" fill="none" className="w-full h-full drop-shadow-sm">
        {/* Bottom golden book */}
        <rect x="10" y="44" width="44" height="8" rx="2" fill="#EAB308" />
        <rect x="8" y="46" width="5" height="4" rx="1" fill="#CA8A04" />
        {/* Middle orange/red book */}
        <rect x="12" y="36" width="40" height="7" rx="2" fill="#F97316" />
        <rect x="10" y="38" width="5" height="3" rx="1" fill="#EA580C" />
        {/* Royal Purple graduation mortarboard */}
        <path d="M32 12L12 20L32 28L52 20L32 12Z" fill="#4F46E5" />
        <path d="M22 24.5V33C22 36.5 26.5 39 32 39C37.5 39 42 36.5 42 33V24.5" stroke="#4338CA" strokeWidth="2.5" fill="none" />
        {/* White tassel */}
        <path d="M46 22.5V30" stroke="#E0E7FF" strokeWidth="2" strokeLinecap="round" />
        <circle cx="46" cy="31" r="2" fill="#C7D2FE" />
        <circle cx="32" cy="20" r="1.5" fill="#E0E7FF" />
      </svg>
    </div>
  );
}

function ScienceNursingIllustration() {
  return (
    <div className="w-12 h-12 sm:w-14 sm:h-14 flex items-center justify-center shrink-0 select-none">
      <svg viewBox="0 0 64 64" fill="none" className="w-full h-full drop-shadow-sm">
        {/* Bottom teal book */}
        <rect x="10" y="44" width="44" height="8" rx="2" fill="#0D9488" />
        <rect x="8" y="46" width="5" height="4" rx="1" fill="#0F766E" />
        {/* Middle coral book */}
        <rect x="12" y="36" width="40" height="7" rx="2" fill="#F43F5E" />
        <rect x="10" y="38" width="5" height="3" rx="1" fill="#E11D48" />
        {/* Medical / Science Kit */}
        <rect x="16" y="16" width="32" height="20" rx="4" fill="#EF4444" />
        <rect x="26" y="12" width="12" height="5" rx="1.5" stroke="#DC2626" strokeWidth="2" fill="none" />
        {/* White Cross */}
        <rect x="29.5" y="21" width="5" height="10" rx="1" fill="white" />
        <rect x="27" y="23.5" width="10" height="5" rx="1" fill="white" />
      </svg>
    </div>
  );
}

function ArtsCommerceIllustration() {
  return (
    <div className="w-12 h-12 sm:w-14 sm:h-14 flex items-center justify-center shrink-0 select-none">
      <svg viewBox="0 0 64 64" fill="none" className="w-full h-full drop-shadow-sm">
        {/* Golden circular shield / torch */}
        <circle cx="32" cy="24" r="16" fill="#F59E0B" />
        <circle cx="32" cy="24" r="13" fill="#FBBF24" />
        {/* Graduation cap / Student emblem */}
        <path d="M32 16L22 22L32 28L42 22L32 16Z" fill="#1E293B" />
        <path d="M26 25V30C26 32 28.5 33.5 32 33.5C35.5 33.5 38 32 38 30V25" stroke="#1E293B" strokeWidth="1.5" fill="none" />
        {/* Ribbon hanging below */}
        <path d="M26 36L22 52L28 47L32 50L30 36Z" fill="#0D9488" />
        <path d="M38 36L42 52L36 47L32 50L34 36Z" fill="#059669" />
      </svg>
    </div>
  );
}

function FreeCourseIllustration() {
  return (
    <div className="w-12 h-12 sm:w-14 sm:h-14 flex items-center justify-center shrink-0 select-none">
      <div className="w-11 h-11 sm:w-13 sm:h-13 rounded-full bg-emerald-600 flex items-center justify-center shadow-md shadow-emerald-600/30 text-white font-black text-xs sm:text-sm tracking-wider border-2 border-emerald-400">
        FREE
      </div>
    </div>
  );
}

// ==========================================
// Category Item Model & Dynamic Illustration Resolver
// ==========================================

export interface DbCategoryShowcaseItem {
  id: number | string;
  name: string;
  name_bn?: string | null;
  slug: string;
  icon_name?: string | null;
  description?: string | null;
  display_order?: number | null;
  is_published?: boolean | null;
}

function getCategoryIllustration(cat: {
  icon_name?: string | null;
  slug?: string | null;
  name?: string | null;
}) {
  const icon = (cat.icon_name || "").toLowerCase().trim();
  const slug = (cat.slug || "").toLowerCase().trim();
  const name = (cat.name || "").toLowerCase().trim();

  // 1. School / SSC
  if (
    icon === "graduation" ||
    slug.includes("school") ||
    slug.includes("ssc") ||
    name.includes("school") ||
    name.includes("ssc")
  ) {
    return <SchoolIllustration />;
  }
  // 2. HSC
  if (
    icon === "atom" ||
    icon === "rocket" ||
    slug.includes("hsc") ||
    name.includes("hsc")
  ) {
    return <HscIllustration />;
  }
  // 3. Admission / University
  if (
    icon === "building" ||
    slug.includes("admission") ||
    slug.includes("university") ||
    name.includes("admission")
  ) {
    return <AdmissionIllustration />;
  }
  // 4. Nursing / Medical / Science
  if (
    icon === "stethoscope" ||
    icon === "flask" ||
    slug.includes("nursing") ||
    name.includes("nursing") ||
    slug.includes("medical")
  ) {
    return <ScienceNursingIllustration />;
  }
  // 5. Arts & Commerce / Business
  if (
    icon === "book" ||
    icon === "briefcase" ||
    slug.includes("arts") ||
    slug.includes("commerce") ||
    name.includes("arts") ||
    name.includes("commerce")
  ) {
    return <ArtsCommerceIllustration />;
  }
  // 6. Free Courses / Resources
  if (
    icon === "sparkles" ||
    icon === "award" ||
    slug.includes("free") ||
    name.includes("free")
  ) {
    return <FreeCourseIllustration />;
  }
  // Default fallback
  return <SchoolIllustration />;
}

export function CategoryCoursesShowcase({
  categories = [],
  courses = [],
}: {
  categories?: DbCategoryShowcaseItem[];
  courses?: DbFeaturedCourse[];
}) {
  const [selectedCategory, setSelectedCategory] = useState<string>("all");

  // Real categories from Supabase DB, filtered by is_published and sorted by display_order
  const displayCategories = useMemo(() => {
    if (categories && categories.length > 0) {
      return [...categories]
        .filter((c) => c.is_published !== false)
        .sort((a, b) => (a.display_order || 0) - (b.display_order || 0));
    }
    return [];
  }, [categories]);

  // Filter courses dynamically based on the active DB category
  const filteredCourses = useMemo(() => {
    if (selectedCategory === "all") return courses;

    const currentCat = displayCategories.find((c) => c.slug === selectedCategory);
    const catId = currentCat?.id;

    // Free Courses Filter
    if (selectedCategory === "free-course" || selectedCategory.includes("free")) {
      return courses.filter(
        (c) => c.price === 0 || (catId && c.category_id === catId)
      );
    }

    return courses.filter((c) => {
      // 1. Direct Category ID match
      if (
        catId &&
        (c.category_id === catId ||
          (Array.isArray(c.categories) && c.categories[0]?.id === catId) ||
          (c.categories && !Array.isArray(c.categories) && (c.categories as any).id === catId))
      ) {
        return true;
      }
      // 2. Slug match
      const cSlug = (
        Array.isArray(c.categories) ? c.categories[0]?.slug : c.categories?.slug || ""
      ).toLowerCase();
      if (
        cSlug &&
        (cSlug === selectedCategory ||
          cSlug.includes(selectedCategory) ||
          selectedCategory.includes(cSlug))
      ) {
        return true;
      }
      return false;
    });
  }, [courses, selectedCategory, displayCategories]);

  return (
    <section id="category-courses-section" className="relative py-16 sm:py-20 lg:py-24 bg-background overflow-hidden">
      {/* Ambient background glow */}
      <div
        className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[900px] h-[450px] rounded-full opacity-20 dark:opacity-10 pointer-events-none blur-3xl"
        style={{
          background: "radial-gradient(circle, rgba(255,95,0,0.15) 0%, rgba(124,58,237,0.12) 50%, transparent 70%)",
        }}
        aria-hidden="true"
      />

      <div className="container-main relative z-10">
        {/* Bondi Pathshala Inspired Header */}
        <div className="text-center max-w-3xl mx-auto mb-10 sm:mb-14">
          {/* 1. Scroll Reveal Animation on Title */}
          <motion.h2
            variants={scrollReveal}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-50px" }}
            className="text-3xl sm:text-4xl lg:text-[44px] font-black text-text tracking-tight font-bengali mb-4"
          >
            ক্লাস অনুযায়ী কোর্স দেখুন
          </motion.h2>

          {/* 2. Zoom In Up Animation on Description */}
          <motion.p
            variants={zoomInUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-50px" }}
            className="text-sm sm:text-base text-slate-600 dark:text-slate-300 font-medium font-bengali leading-relaxed"
          >
            ওরমিশন বাংলাদেশের সকল শিক্ষার্থীদের জন্য SSC, HSC, এবং এডমিশন প্রস্তুতিতে কাজ করছে।
            বিজ্ঞানের জন্য রয়েছে TARGET DU, BUET, DMC, GST, এবং বিশ্ববিদ্যালয় প্রস্তুতি
            প্রোগ্রাম। একই সাথে আর্টস ও কমার্স এবং নার্সিংয়ের জন্য রয়েছে পূর্ণাঙ্গ অনলাইন প্ল্যাটফর্ম...
          </motion.p>

          {/* 3. Zoom In Animation on Filter Pill */}
          <motion.div
            variants={zoomIn}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="flex justify-center mt-6"
          >
            <button
              type="button"
              onClick={() => setSelectedCategory("all")}
              className={`px-5 py-2 rounded-full text-xs sm:text-sm font-bold transition-all duration-300 cursor-pointer shadow-sm ${
                selectedCategory === "all"
                  ? "bg-primary text-white shadow-primary/30 shadow-md scale-105"
                  : "bg-surface text-text-muted hover:text-text border border-border/80 hover:border-primary/40"
              }`}
            >
              <span>সকল কোর্স ({courses.length})</span>
            </button>
          </motion.div>
        </div>

        {/* 4. Staggered Animation Container + 3D Perspective */}
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.15 }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 mb-14 sm:mb-16 perspective-1000"
        >
          {displayCategories.map((cat, idx) => {
            const isSelected = selectedCategory === cat.slug;
            const illustration = getCategoryIllustration(cat);
            // 5 & 6. Flip Left (even) & Flip Right (odd) 3D Entrance
            const flipVariant = idx % 2 === 0 ? flipLeft : flipRight;

            return (
              <motion.div
                key={cat.id || cat.slug}
                variants={flipVariant}
                whileHover={hoverLiftProps.whileHover}
                whileTap={hoverLiftProps.whileTap}
                onClick={() => {
                  setSelectedCategory((prev) => (prev === cat.slug ? "all" : cat.slug));
                }}
                className={`group relative flex items-center justify-between p-4 sm:p-5 rounded-2xl cursor-pointer select-none border anim-hover-lift ${
                  isSelected
                    ? "bg-surface text-primary border-2 border-primary ring-4 ring-primary/15 shadow-2xl scale-[1.02]"
                    : "bg-surface/95 hover:bg-surface text-slate-900 dark:text-slate-100 border-border/80 hover:border-primary/50 hover:shadow-2xl hover:shadow-primary/15"
                }`}
              >
                {/* Left Illustration + Title (Zoom In Icon on Hover) */}
                <div className="flex items-center gap-3.5 sm:gap-4 min-w-0">
                  <div className="transition-transform duration-300 group-hover:scale-115 group-hover:rotate-2">
                    {illustration}
                  </div>
                  <div className="flex flex-col min-w-0">
                    <h3 className="text-base sm:text-lg font-black tracking-tight group-hover:text-primary transition-colors truncate">
                      {cat.name || cat.name_bn}
                    </h3>
                  </div>
                </div>

                {/* Right Arrow (Glides right on hover) */}
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center transition-all duration-300 shrink-0 ${
                    isSelected ? "text-primary" : "text-slate-600 dark:text-slate-400 group-hover:text-primary"
                  }`}
                >
                  <ArrowRight className="w-5 h-5 transition-transform duration-300 group-hover:translate-x-2" />
                </div>
              </motion.div>
            );
          })}
        </motion.div>

        {/* Dynamic Course Section (Animated with Framer Motion) */}
        <div>
          <motion.div
            variants={scrollReveal}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="flex items-center justify-between mb-8 pb-3 border-b border-border/60"
          >
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-primary animate-pulse" />
              <h3 className="text-lg sm:text-xl font-black text-text font-bengali">
                {selectedCategory === "all"
                  ? "সকল রানিং ও স্পেশাল কোর্সসমূহ"
                  : `${
                      displayCategories.find((c) => c.slug === selectedCategory)?.name_bn ||
                      displayCategories.find((c) => c.slug === selectedCategory)?.name ||
                      "নির্বাচিত"
                    } কোর্সসমূহ`}
              </h3>
            </div>

            <Link
              href="/courses"
              className="text-xs sm:text-sm font-bold text-primary hover:text-primary-hover flex items-center gap-1 group font-bengali"
            >
              <span>সকল কোর্স দেখুন</span>
              <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
            </Link>
          </motion.div>

          <AnimatePresence mode="wait">
            {filteredCourses.length > 0 ? (
              <motion.div
                key={selectedCategory}
                variants={staggerContainer}
                initial="hidden"
                animate="visible"
                exit={{ opacity: 0, y: -10, transition: { duration: 0.25 } }}
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8"
              >
                {filteredCourses.map((course) => {
                  const title = course.title_bn || course.title;
                  const categoryName = Array.isArray(course.categories)
                    ? course.categories[0]?.name_bn || course.categories[0]?.name
                    : course.categories?.name_bn || course.categories?.name || "কোর্স";

                  return (
                    /* Zoom In Up entrance + Hover Lift Effect */
                    <motion.div
                      key={course.id || course.slug}
                      variants={zoomInUp}
                      whileHover={hoverLiftProps.whileHover}
                      whileTap={hoverLiftProps.whileTap}
                      className="group flex flex-col bg-surface border border-border/80 rounded-2xl overflow-hidden shadow-sm hover:shadow-2xl hover:shadow-primary/15 hover:border-primary/50 transition-all duration-300 h-full anim-hover-lift"
                    >
                      {/* Image Thumbnail with zoom hover */}
                      <Link
                        href={`/course/${course.slug}`}
                        className="relative aspect-video w-full bg-slate-900 overflow-hidden block"
                      >
                        {course.thumbnail_url ? (
                          <Image
                            src={course.thumbnail_url}
                            alt={title}
                            fill
                            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                            className="object-cover group-hover:scale-105 transition-transform duration-500"
                          />
                        ) : (
                          <div className="w-full h-full bg-gradient-to-br from-primary/10 via-surface-secondary to-secondary/15 flex items-center justify-center p-4">
                            <Sparkles className="w-8 h-8 text-primary" />
                          </div>
                        )}

                        {/* Category Tag */}
                        <span className="absolute bottom-3 left-3 px-3 py-1 text-[11px] font-bold rounded-full bg-black/70 backdrop-blur-xs text-white border border-white/20 font-bengali z-10 shadow-sm">
                          {categoryName}
                        </span>

                        {/* Live Batch Badge */}
                        <span className="absolute top-3 right-3 px-2.5 py-0.5 text-[10px] font-bold rounded-full bg-red-600 text-white shadow-sm flex items-center gap-1 z-10 animate-pulse">
                          <span className="w-1.5 h-1.5 rounded-full bg-white" />
                          <span>LIVE BATCH</span>
                        </span>
                      </Link>

                      {/* Card Content */}
                      <div className="flex flex-col flex-1 p-5 sm:p-6">
                        <Link href={`/course/${course.slug}`}>
                          <h4 className="text-base sm:text-lg font-black text-text line-clamp-1 mb-2 font-bengali group-hover:text-primary transition-colors">
                            {title}
                          </h4>
                        </Link>

                        <p className="text-xs sm:text-sm text-text-muted line-clamp-2 mb-4 font-bengali leading-relaxed">
                          {course.short_description ||
                            course.description ||
                            "সেরা মেন্টরদের লাইভ ক্লাস, বিগত ২০ বছরের প্রশ্নব্যাংক সলভিং ও সার্বক্ষণিক ডাউট সলভিং।"}
                        </p>

                        {/* Features Pill Bar */}
                        <div className="flex items-center gap-3 text-xs text-slate-500 dark:text-slate-400 mb-5 font-bengali">
                          <span className="flex items-center gap-1">
                            <Clock className="w-3.5 h-3.5 text-primary" />
                            <span>১০০+ ঘণ্টা লাইভ</span>
                          </span>
                          <span>•</span>
                          <span className="flex items-center gap-1">
                            <Users className="w-3.5 h-3.5 text-emerald-500" />
                            <span>ডাউট সলভিং</span>
                          </span>
                        </div>

                        {/* 5-Star Rating */}
                        <div className="flex items-center gap-1 mb-4">
                          {[...Array(5)].map((_, i) => (
                            <Star key={i} className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                          ))}
                          <span className="text-xs font-bold text-text ml-1">5.0</span>
                          <span className="text-[11px] text-slate-400 ml-1">
                            ({course.enrollment_count || 120}+ শিক্ষার্থী)
                          </span>
                        </div>

                        {/* Pricing & Action */}
                        <div className="mt-auto pt-4 border-t border-border/60 flex items-center justify-between">
                          <div className="flex items-baseline gap-2">
                            <span className="text-xl font-black text-primary tabular-nums">
                              ৳{course.price.toLocaleString("en-US")}
                            </span>
                            {course.original_price && course.original_price > course.price && (
                              <span className="text-xs text-text-muted line-through tabular-nums">
                                ৳{course.original_price.toLocaleString("en-US")}
                              </span>
                            )}
                          </div>

                          <Link
                            href={`/course/${course.slug}`}
                            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold text-white bg-primary hover:bg-primary-hover shadow-md shadow-primary/25 hover:shadow-lg hover:shadow-primary/35 transition-all duration-200 group-hover:scale-105 font-bengali"
                          >
                            <span>বিস্তারিত</span>
                            <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1" />
                          </Link>
                        </div>
                      </div>
                    </motion.div>
                  );
                })}
              </motion.div>
            ) : (
              /* Friendly Empty State with Action */
              <motion.div
                key="empty"
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0 }}
                className="p-10 sm:p-14 rounded-3xl bg-surface border border-border/80 text-center max-w-xl mx-auto shadow-sm"
              >
                <div className="w-14 h-14 rounded-2xl bg-primary/10 text-primary mx-auto flex items-center justify-center mb-4">
                  <Sparkles className="w-7 h-7" />
                </div>
                <h4 className="text-lg sm:text-xl font-black text-text font-bengali mb-2">
                  এই ক্যাটাগরির নতুন ব্যাচ শীঘ্রই শুরু হচ্ছে!
                </h4>
                <p className="text-xs sm:text-sm text-text-muted font-bengali mb-6 leading-relaxed">
                  আমাদের অভিজ্ঞ শিক্ষকমণ্ডলীর নতুন লাইভ ব্যাচ ও প্রশ্নব্যাংক কোর্স খুব শীঘ্রই যুক্ত হচ্ছে।
                  ফ্রি নোট ও প্রশ্নব্যাংকগুলো এখনই দেখে নিন।
                </p>
                <div className="flex flex-wrap items-center justify-center gap-3">
                  <button
                    type="button"
                    onClick={() => setSelectedCategory("all")}
                    className="px-5 py-2.5 rounded-full text-xs font-bold text-white bg-primary hover:bg-primary-hover shadow-md font-bengali transition-colors cursor-pointer"
                  >
                    সকল রানিং কোর্স দেখুন
                  </button>
                  <Link
                    href="/free-resources"
                    className="px-5 py-2.5 rounded-full text-xs font-bold text-text bg-surface-secondary border border-border hover:border-primary/40 font-bengali transition-colors"
                  >
                    ফ্রি রিসোর্স এক্সপ্লোর করুন
                  </Link>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
}
