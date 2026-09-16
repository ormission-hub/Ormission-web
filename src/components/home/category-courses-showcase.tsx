"use client";

import { useState, useMemo, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { ArrowRight, Sparkles, Star, Clock, Users } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { DbFeaturedCourse } from "./featured-courses";
import { createClient } from "@/lib/supabase/client";
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

// 3D Boy Student Avatar Component (Matching 2nd Image)
export function StudentAvatar3D() {
  return (
    <svg viewBox="0 0 64 64" fill="none" className="w-full h-full drop-shadow-2xs select-none">
      {/* Hair Base */}
      <ellipse cx="32" cy="27" rx="16" ry="17" fill="#1E293B" />
      {/* Ears */}
      <circle cx="17" cy="32" r="4" fill="#FED7AA" />
      <circle cx="47" cy="32" r="4" fill="#FED7AA" />
      <circle cx="17" cy="32" r="2.5" fill="#FCA5A5" opacity="0.6" />
      <circle cx="47" cy="32" r="2.5" fill="#FCA5A5" opacity="0.6" />
      {/* Cute Round Face */}
      <rect x="18" y="19" width="28" height="26" rx="14" fill="#FFEDD5" />
      {/* Hair Top & Front Bangs */}
      <path
        d="M17 27C17 18 23.5 13 32 13C40.5 13 47 18 47 27C43 25 39 23.5 35 23.5C30 23.5 26.5 25.5 23 25.5C19.5 25.5 17.5 26.5 17 27Z"
        fill="#1E293B"
      />
      {/* Sparkly Eyes */}
      <circle cx="26" cy="31" r="2.5" fill="#0F172A" />
      <circle cx="38" cy="31" r="2.5" fill="#0F172A" />
      <circle cx="25.2" cy="30.2" r="0.8" fill="white" />
      <circle cx="37.2" cy="30.2" r="0.8" fill="white" />
      {/* Blush Cheeks */}
      <ellipse cx="23" cy="34" rx="2.5" ry="1.5" fill="#FDA4AF" opacity="0.75" />
      <ellipse cx="41" cy="34" rx="2.5" ry="1.5" fill="#FDA4AF" opacity="0.75" />
      {/* Cheerful Smile */}
      <path d="M29.5 36.5C30.8 37.8 33.2 37.8 34.5 36.5" stroke="#9A3412" strokeWidth="1.6" strokeLinecap="round" />
      {/* Orange Jumper / Jacket */}
      <path
        d="M13 58C13 48.5 19 45 25 45H39C45 45 51 48.5 51 58V64H13V58Z"
        fill="#F95721"
      />
      {/* Inner White Collar with Cyan Accent */}
      <path d="M26 45L32 54L38 45H35L32 49.5L29 45H26Z" fill="#F0F9FF" />
      <path d="M28 45L32 51.5L36 45" stroke="#38BDF8" strokeWidth="1.2" fill="none" />
    </svg>
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
  // Admin Panel Additional Icons Mapping
  if (icon === "calculator" || icon === "laptop" || icon === "code") {
    return <HscIllustration />;
  }
  if (icon === "microscope") {
    return <ScienceNursingIllustration />;
  }
  if (icon === "brain" || icon === "compass") {
    return <AdmissionIllustration />;
  }
  if (icon === "palette" || icon === "globe" || icon === "layers") {
    return <ArtsCommerceIllustration />;
  }
  // Default fallback
  return <SchoolIllustration />;
}

// ==========================================
// 2nd Image Inspired Theme & Glassy Styling
// ==========================================

interface CategoryTheme {
  btnGradient: string;
  btnShadow: string;
  cardGlow: string;
  activeBorder: string;
  activeRing: string;
  activeBg: string;
  tagline: string;
}

function getCategoryTheme(cat: {
  slug?: string | null;
  name?: string | null;
  description?: string | null;
}): CategoryTheme {
  const slug = (cat.slug || "").toLowerCase();
  const name = (cat.name || "").toLowerCase();

  // 1. SSC / School (Emerald / Mint Green - Image 2 Card 1)
  if (slug.includes("ssc") || name.includes("ssc") || slug.includes("school")) {
    return {
      btnGradient: "bg-gradient-to-r from-[#00cba0] to-[#00b289] hover:from-[#00baa3] hover:to-[#009e7a]",
      btnShadow: "shadow-lg shadow-[#00cba0]/35 dark:shadow-[#00cba0]/25 hover:shadow-[#00cba0]/50",
      cardGlow: "from-[#00cba0]/20 via-[#00cba0]/5 to-transparent",
      activeBorder: "border-[#00cba0]/80 dark:border-[#00cba0]/70",
      activeRing: "ring-4 ring-[#00cba0]/20",
      activeBg: "bg-[#00cba0]/[0.03] dark:bg-[#00cba0]/[0.08]",
      tagline: "SSC 2027-28",
    };
  }

  // 2. HSC (Cyan / Sky Blue - Image 2 Card 2)
  if (slug.includes("hsc") || name.includes("hsc")) {
    return {
      btnGradient: "bg-gradient-to-r from-[#28b8ff] to-[#0091ff] hover:from-[#1caeff] hover:to-[#0082e6]",
      btnShadow: "shadow-lg shadow-[#28b8ff]/35 dark:shadow-[#28b8ff]/25 hover:shadow-[#28b8ff]/50",
      cardGlow: "from-[#28b8ff]/20 via-[#28b8ff]/5 to-transparent",
      activeBorder: "border-[#28b8ff]/80 dark:border-[#28b8ff]/70",
      activeRing: "ring-4 ring-[#28b8ff]/20",
      activeBg: "bg-[#28b8ff]/[0.03] dark:bg-[#28b8ff]/[0.08]",
      tagline: "HSC 2026-27",
    };
  }

  // 3. Admission / University (Rose / Pink - Image 2 Card 3)
  if (slug.includes("admission") || name.includes("admission") || slug.includes("university")) {
    return {
      btnGradient: "bg-gradient-to-r from-[#ff4099] to-[#ff2a6d] hover:from-[#f5338e] hover:to-[#e81d60]",
      btnShadow: "shadow-lg shadow-[#ff4099]/35 dark:shadow-[#ff4099]/25 hover:shadow-[#ff4099]/50",
      cardGlow: "from-[#ff4099]/20 via-[#ff4099]/5 to-transparent",
      activeBorder: "border-[#ff4099]/80 dark:border-[#ff4099]/70",
      activeRing: "ring-4 ring-[#ff4099]/20",
      activeBg: "bg-[#ff4099]/[0.03] dark:bg-[#ff4099]/[0.08]",
      tagline: "ভর্তি প্রস্তুতি",
    };
  }

  // 4. Arts & Commerce / Business (Ormission Signature Vibrant Orange)
  if (slug.includes("arts") || slug.includes("commerce") || name.includes("commerce")) {
    return {
      btnGradient: "bg-gradient-to-r from-[#ff7a00] to-[#ff5000] hover:from-[#ff6b00] hover:to-[#e64500]",
      btnShadow: "shadow-lg shadow-[#ff6b00]/35 dark:shadow-[#ff6b00]/25 hover:shadow-[#ff6b00]/50",
      cardGlow: "from-[#ff6b00]/20 via-[#ff6b00]/5 to-transparent",
      activeBorder: "border-[#ff6b00]/80 dark:border-[#ff6b00]/70",
      activeRing: "ring-4 ring-[#ff6b00]/20",
      activeBg: "bg-[#ff6b00]/[0.03] dark:bg-[#ff6b00]/[0.08]",
      tagline: "মানবিক ও বাণিজ্য",
    };
  }

  // Default / Free / Others (Royal Violet / Purple)
  return {
    btnGradient: "bg-gradient-to-r from-[#8b5cf6] to-[#7c3aed] hover:from-[#7c3aed] hover:to-[#6d28d9]",
    btnShadow: "shadow-lg shadow-[#8b5cf6]/35 dark:shadow-[#8b5cf6]/25 hover:shadow-[#8b5cf6]/50",
    cardGlow: "from-[#8b5cf6]/20 via-[#8b5cf6]/5 to-transparent",
    activeBorder: "border-[#8b5cf6]/80 dark:border-[#8b5cf6]/70",
    activeRing: "ring-4 ring-[#8b5cf6]/20",
    activeBg: "bg-[#8b5cf6]/[0.03] dark:bg-[#8b5cf6]/[0.08]",
    tagline: cat.description ? cat.description.slice(0, 16) : "প্রস্তুতি শুরু",
  };
}

export function CategoryCoursesShowcase({
  categories = [],
  courses = [],
}: {
  categories?: DbCategoryShowcaseItem[];
  courses?: DbFeaturedCourse[];
}) {
  // Local state initialized with server-fetched categories and courses
  const [categoriesList, setCategoriesList] = useState<DbCategoryShowcaseItem[]>(categories);
  const [coursesList, setCoursesList] = useState<DbFeaturedCourse[]>(courses);

  // Sync if server props change
  useEffect(() => {
    if (categories && categories.length > 0) {
      setCategoriesList(categories);
    }
  }, [categories]);

  useEffect(() => {
    if (courses && courses.length > 0) {
      setCoursesList(courses);
    }
  }, [courses]);

  // Client-side fetch & Realtime subscriptions for categories AND courses
  useEffect(() => {
    const supabase = createClient();

    // 1. Fetch fresh categories on mount
    const fetchFreshCategories = async () => {
      try {
        const { data, error } = await supabase
          .from("categories")
          .select("id, name_bn, name, slug, icon_name, description, display_order, is_published")
          .eq("is_published", true)
          .order("display_order", { ascending: true });

        if (data && data.length > 0 && !error) {
          setCategoriesList(data);
        }
      } catch (err) {
        console.error("Error fetching categories client-side:", err);
      }
    };

    // 2. Fetch fresh courses on mount
    const fetchFreshCourses = async () => {
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
            total_lessons,
            total_duration,
            is_featured,
            status,
            thumbnail_url,
            short_description,
            category_id,
            categories:category_id (id, name, name_bn, slug),
            instructors:instructor_id (id, name, name_bn, institution)
          `)
          .eq("status", "published")
          .order("created_at", { ascending: false });

        if (data && !error) {
          setCoursesList(data);
        }
      } catch (err) {
        console.error("Error fetching courses client-side:", err);
      }
    };

    fetchFreshCategories();
    fetchFreshCourses();

    // 3. Realtime listeners: Whenever categories or courses change in Admin Panel!
    const catChannel = supabase
      .channel("categories_realtime_showcase")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "categories" },
        () => {
          fetchFreshCategories();
        }
      )
      .subscribe();

    const coursesChannel = supabase
      .channel("courses_realtime_showcase")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "courses" },
        () => {
          fetchFreshCourses();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(catChannel);
      supabase.removeChannel(coursesChannel);
    };
  }, []);

  // Real categories from Supabase DB, filtered by is_published and sorted by display_order
  const displayCategories = useMemo(() => {
    if (categoriesList && categoriesList.length > 0) {
      return [...categoriesList]
        .filter((c) => c.is_published !== false)
        .sort((a, b) => (a.display_order || 0) - (b.display_order || 0));
    }
    return [];
  }, [categoriesList]);

  // Selected category state (explicitly selected by user)
  const [selectedCategory, setSelectedCategory] = useState<string>("");

  // Smart default category: If user hasn't selected a category yet,
  // pick the first category that actually has courses; fallback to the first category
  const defaultCategorySlug = useMemo(() => {
    if (displayCategories.length === 0) return "";
    if (coursesList.length === 0) return displayCategories[0].slug;

    const catWithCourses = displayCategories.find((cat) =>
      coursesList.some((c) => {
        const cCatId = c.category_id ?? (Array.isArray(c.categories) ? c.categories[0]?.id : c.categories?.id);
        const cCatSlug = (Array.isArray(c.categories) ? c.categories[0]?.slug : c.categories?.slug || "").toLowerCase();
        return (
          (cat.id && String(cCatId) === String(cat.id)) ||
          (cat.slug && cCatSlug === cat.slug.toLowerCase())
        );
      })
    );

    return catWithCourses ? catWithCourses.slug : displayCategories[0].slug;
  }, [displayCategories, coursesList]);

  const activeCategory = selectedCategory || defaultCategorySlug;

  // Filter courses dynamically based on the active DB category
  const filteredCourses = useMemo(() => {
    if (!activeCategory || activeCategory === "all") return coursesList;

    const currentCat = displayCategories.find((c) => c.slug === activeCategory);
    const catId = currentCat?.id;

    // Free Courses Filter
    if (activeCategory === "free-course" || activeCategory.includes("free")) {
      return coursesList.filter(
        (c) => c.price === 0 || (catId && String(c.category_id) === String(catId))
      );
    }

    return coursesList.filter((c) => {
      // 1. Direct Category ID match (flexible type check)
      const cCatId = c.category_id ?? (Array.isArray(c.categories) ? c.categories[0]?.id : c.categories?.id);
      if (catId && cCatId && String(cCatId) === String(catId)) {
        return true;
      }

      // 2. Slug match
      const cSlug = (
        Array.isArray(c.categories) ? c.categories[0]?.slug : c.categories?.slug || ""
      ).toLowerCase();
      if (
        cSlug &&
        (cSlug === activeCategory.toLowerCase() ||
          cSlug.includes(activeCategory.toLowerCase()) ||
          activeCategory.toLowerCase().includes(cSlug))
      ) {
        return true;
      }

      // 3. Name match fallback
      if (currentCat?.name || currentCat?.name_bn) {
        const cCatName = (
          Array.isArray(c.categories)
            ? c.categories[0]?.name || c.categories[0]?.name_bn
            : c.categories?.name || c.categories?.name_bn || ""
        ).toLowerCase();
        if (
          cCatName &&
          ((currentCat.name && cCatName.includes(currentCat.name.toLowerCase())) ||
            (currentCat.name_bn && cCatName.includes(currentCat.name_bn.toLowerCase())))
        ) {
          return true;
        }
      }

      return false;
    });
  }, [coursesList, activeCategory, displayCategories]);

  // Split categories for 3 on top row, 2 on bottom row (Matching Reference Image)
  const topRowCategories = displayCategories.slice(0, 3);
  const bottomRowCategories = displayCategories.slice(3);

  // Reusable Pill Component with Continuous Animated Rotating Border (Ultra-Fast 60FPS Mobile & Desktop)
  const renderCategoryPill = (cat: DbCategoryShowcaseItem, idx: number) => {
    const isSelected = activeCategory === cat.slug;
    const flipVariant = idx % 2 === 0 ? flipLeft : flipRight;
    const illustration = getCategoryIllustration(cat);

    return (
      <motion.button
        key={cat.id || cat.slug}
        type="button"
        variants={flipVariant}
        onClick={() => setSelectedCategory(cat.slug)}
        whileHover={{ y: -3, scale: 1.02, transition: { duration: 0.2 } }}
        whileTap={{ scale: 0.96 }}
        className={`group relative p-[2px] sm:p-[2.5px] rounded-xl sm:rounded-2xl cursor-pointer select-none transition-all duration-200 overflow-hidden w-full sm:w-auto min-w-0 sm:min-w-[210px] ${
          isSelected
            ? "shadow-[0_0_15px_rgba(255,95,0,0.4)] sm:shadow-[0_0_25px_rgba(255,95,0,0.45)] dark:shadow-[0_0_20px_rgba(255,115,21,0.35)] ring-1.5 sm:ring-2 ring-primary/40 bg-primary/20"
            : "shadow-2xs sm:shadow-soft-card hover:shadow-lg bg-slate-300/80 dark:bg-slate-800/90 hover:bg-primary/20"
        }`}
      >
        {/* Layer 1: Radiant Outer Glow Beam (Rendered on selected pill on desktop for silky mobile scroll) */}
        {isSelected && (
          <div
            className="border-beam-glow hidden sm:block"
            style={{
              background: "conic-gradient(from 0deg, transparent 0deg, transparent 250deg, #FF5F00 300deg, #FFA048 335deg, transparent 360deg)",
              animation: "borderRotate 3s linear infinite",
              opacity: 1,
            }}
          />
        )}

        {/* Layer 2: Sharp Luminous Laser Beam (Hardware-accelerated 60fps beam in 2.5px track) */}
        <div
          className="border-beam-sharp"
          style={{
            background: isSelected
              ? "conic-gradient(from 0deg, transparent 0deg, transparent 250deg, #FF5F00 295deg, #FFFFFF 335deg, transparent 360deg)"
              : "conic-gradient(from 0deg, transparent 0deg, transparent 270deg, rgba(255,95,0,0.55) 310deg, #FFFFFF 340deg, transparent 360deg)",
            animation: `borderRotate ${isSelected ? '2.8s' : '4.5s'} linear infinite`,
            animationDelay: `${idx * -0.9}s`,
            opacity: isSelected ? 1 : 0.65,
          }}
        />

        {/* Layer 3: Inner Pill Content Container */}
        <div
          className={`relative z-10 w-full h-full rounded-[10px] sm:rounded-[13.5px] flex items-center justify-center gap-1 sm:gap-3.5 px-1 py-2 sm:px-8 sm:py-4 transition-colors duration-200 overflow-hidden ${
            isSelected
              ? "bg-surface dark:bg-slate-900 text-primary"
              : "bg-surface dark:bg-slate-900/95 text-text group-hover:text-primary"
          }`}
        >
          {/* Continuous Glass Shimmer Sweep (Only on selected pill to eliminate phone lag) */}
          {isSelected && (
            <span
              className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/35 dark:via-white/[0.08] to-transparent pointer-events-none animate-glass-shimmer"
            />
          )}

          {/* Top Glossy Sheen */}
          <span className="absolute inset-x-0 top-0 h-1/2 rounded-t-[10px] sm:rounded-t-[13.5px] bg-gradient-to-b from-white/60 dark:from-white/[0.06] to-transparent pointer-events-none" />

          {/* 3D Category Illustration: Compact 20px on mobile, 40px on desktop */}
          <div className="relative z-10 w-5 h-5 sm:w-10 sm:h-10 shrink-0 [&>div]:!w-5 [&>div]:!h-5 sm:[&>div]:!w-10 sm:[&>div]:!h-10 transition-transform duration-200 group-hover:scale-110 drop-shadow-xs">
            {illustration}
          </div>

          {/* Category Name: Scaled smoothly for mobile and desktop */}
          <span
            className={`relative z-10 text-[10.5px] xs:text-xs sm:text-base lg:text-lg tracking-tight transition-colors duration-200 truncate sm:whitespace-nowrap ${
              isSelected
                ? "text-primary font-black"
                : "text-text group-hover:text-primary font-bold"
            }`}
          >
            {cat.name || cat.name_bn}
          </span>

          {/* Active indicator dot */}
          {isSelected && (
            <span className="relative z-10 w-1.5 h-1.5 sm:w-2.5 sm:h-2.5 rounded-full bg-primary animate-pulse shrink-0 ml-0.5 shadow-[0_0_8px_#FF5F00]" />
          )}
        </div>
      </motion.button>
    );
  };
  return (
    <section id="category-courses-section" className="relative py-16 sm:py-20 lg:py-24 bg-background overflow-hidden">
      {/* Bulletproof Keyframe Animation for Border Beam */}
      <style
        dangerouslySetInnerHTML={{
          __html: `
            @keyframes borderRotate {
              0% { transform: rotate(0deg); }
              100% { transform: rotate(360deg); }
            }
          `,
        }}
      />
      {/* Ambient background glow */}
      <div
        className="hidden sm:block absolute top-1/4 left-1/2 -translate-x-1/2 w-[900px] h-[450px] rounded-full opacity-20 dark:opacity-10 pointer-events-none blur-3xl"
        style={{
          background: "radial-gradient(circle, rgba(255,95,0,0.15) 0%, rgba(124,58,237,0.12) 50%, transparent 70%)",
        }}
        aria-hidden="true"
      />

      <div className="container-main relative z-10">
        {/* Bondi Pathshala Inspired Header */}
        <div className="text-center max-w-3xl mx-auto mb-10 sm:mb-14">
          {/* 1. Scroll Reveal Animation on Title (Triggers when scrolled into active view) */}
          <motion.h2
            variants={scrollReveal}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.5, margin: "0px 0px -60px 0px" }}
            className="text-3xl sm:text-4xl lg:text-[44px] font-black text-text tracking-tight font-bengali mb-4"
          >
            ক্লাস অনুযায়ী কোর্স দেখুন
          </motion.h2>

          {/* 2. Zoom In Up Animation on Description */}
          <motion.p
            variants={zoomInUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.4, margin: "0px 0px -50px 0px" }}
            className="text-sm sm:text-base text-slate-600 dark:text-slate-300 font-medium font-bengali leading-relaxed"
          >
            ওরমিশন বাংলাদেশের সকল শিক্ষার্থীদের জন্য SSC, HSC, এবং এডমিশন প্রস্তুতিতে কাজ করছে।
            বিজ্ঞানের জন্য রয়েছে TARGET DU, BUET, DMC, GST, এবং বিশ্ববিদ্যালয় প্রস্তুতি
            প্রোগ্রাম। একই সাথে আর্টস ও কমার্স এবং নার্সিংয়ের জন্য রয়েছে পূর্ণাঙ্গ অনলাইন প্ল্যাটফর্ম...
          </motion.p>

          {/* 3. Category filter label */}
          <motion.p
            variants={zoomIn}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.4, margin: "0px 0px -40px 0px" }}
            className="text-xs sm:text-sm text-text-muted font-bengali mt-5 mb-1"
          >
            {"\u0995\u09CD\u09AF\u09BE\u099F\u09BE\u0997\u09B0\u09BF \u09A8\u09BF\u09B0\u09CD\u09AC\u09BE\u099A\u09A8 \u0995\u09B0\u09C1\u09A8"}
          </motion.p>
        </div>

        {/* Category Pills Grid: 3 on Top Row, 2 on Bottom Row (Matching Reference Photo on BOTH Mobile & Desktop) */}
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
          className="flex flex-col items-center justify-center gap-2.5 sm:gap-4 mb-10 sm:mb-16 w-full px-1 sm:px-0"
        >
          {/* Row 1: Exactly 3 Pills Side-by-Side on Mobile & Desktop */}
          <div className="grid grid-cols-3 gap-1.5 sm:gap-4 w-full max-w-sm sm:max-w-none sm:flex sm:flex-wrap sm:items-center sm:justify-center">
            {topRowCategories.map((cat, idx) => renderCategoryPill(cat, idx))}
          </div>

          {/* Row 2: Exactly 2 Pills Side-by-Side Centered Below Row 1 on Mobile & Desktop */}
          {bottomRowCategories.length > 0 && (
            <div className="grid grid-cols-2 gap-1.5 sm:gap-4 w-full max-w-[245px] sm:max-w-none sm:flex sm:flex-wrap sm:items-center sm:justify-center">
              {bottomRowCategories.map((cat, idx) =>
                renderCategoryPill(cat, idx + topRowCategories.length)
              )}
            </div>
          )}
        </motion.div>
        {/* Dynamic Course Section (Animated with Framer Motion) */}
        <div>
          <motion.div
            variants={scrollReveal}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.3, margin: "0px 0px -40px 0px" }}
            className="flex items-center justify-between mb-8 pb-3 border-b border-border/60"
          >
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-primary animate-pulse" />
              <h3 className="text-lg sm:text-xl font-black text-text font-bengali">
                {activeCategory === "all"
                  ? "সকল রানিং ও স্পেশাল কোর্সসমূহ"
                  : `${
                      displayCategories.find((c) => c.slug === activeCategory)?.name_bn ||
                      displayCategories.find((c) => c.slug === activeCategory)?.name ||
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
                key={activeCategory}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0, transition: { duration: 0.2 } }}
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8"
              >
                {filteredCourses.map((course) => {
                  const title = course.title_bn || course.title;
                  const categoryName = Array.isArray(course.categories)
                    ? course.categories[0]?.name_bn || course.categories[0]?.name
                    : course.categories?.name_bn || course.categories?.name || "কোর্স";

                  return (
                    /* Zoom In Up entrance when scrolled into view + Hover Lift Effect */
                    <motion.div
                      key={course.id || course.slug}
                      variants={zoomInUp}
                      initial="hidden"
                      whileInView="visible"
                      viewport={{ once: true, amount: 0.2, margin: "0px 0px -50px 0px" }}
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
                            <span>
                              {course.total_duration && course.total_duration > 0
                                ? `${course.total_duration}+ ঘণ্টা লাইভ`
                                : "১০০+ ঘণ্টা লাইভ"}
                            </span>
                          </span>
                          <span>•</span>
                          <span className="flex items-center gap-1">
                            <Users className="w-3.5 h-3.5 text-emerald-500" />
                            <span>
                              {course.total_lessons && course.total_lessons > 0
                                ? `${course.total_lessons}টি ক্লাস • ডাউট সলভিং`
                                : "ডাউট সলভিং"}
                            </span>
                          </span>
                        </div>

                        {/* 5-Star Rating & 2nd Image Inspired Student Enrollment Badge */}
                        <div className="flex items-center justify-between gap-2 mb-4">
                          {/* 5-Star Rating */}
                          <div className="flex items-center gap-1">
                            {[...Array(5)].map((_, i) => (
                              <Star key={i} className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                            ))}
                            <span className="text-xs font-bold text-text ml-1">5.0</span>
                          </div>

                          {/* 2nd Image Inspired Student Enrollment Capsule */}
                          <div className="inline-flex items-center gap-2 p-1 pr-3 rounded-2xl bg-white dark:bg-[#180d19]/90 border border-[#FCE7F3] dark:border-[#FB7185]/30 shadow-[0_2px_8px_rgba(225,29,72,0.06)] dark:shadow-[0_4px_14px_rgba(225,29,72,0.2)] transition-all duration-200 hover:shadow-md hover:scale-[1.02] shrink-0">
                            {/* 3D Student Avatar in Rounded Square Box */}
                            <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-xl bg-[#FFF0F4] dark:bg-[#2E101F] border border-[#FCE7F3] dark:border-[#FB7185]/20 flex items-center justify-center shrink-0 p-0.5 overflow-hidden shadow-2xs">
                              <StudentAvatar3D />
                            </div>

                            {/* Pink Enrolled Count + 'জন ভর্তি' */}
                            <div className="flex items-baseline gap-1">
                              <span className="text-sm sm:text-base font-black text-[#E11D48] dark:text-[#FB7185] font-sans tracking-tight tabular-nums">
                                {(course.enrollment_count !== undefined && course.enrollment_count !== null
                                  ? course.enrollment_count
                                  : 1250
                                ).toLocaleString("en-US")}
                              </span>
                              <span className="text-[11px] sm:text-xs font-bold text-slate-800 dark:text-slate-100 font-bengali">
                                জন ভর্তি
                              </span>
                            </div>
                          </div>
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
                  {(displayCategories.find((c) => c.slug === activeCategory)?.name_bn || displayCategories.find((c) => c.slug === activeCategory)?.name || "এই ক্যাটাগরির")} এর নতুন ব্যাচ শীঘ্রই শুরু হচ্ছে!
                </h4>
                <p className="text-xs sm:text-sm text-text-muted font-bengali mb-6 leading-relaxed">
                  আমাদের অভিজ্ঞ শিক্ষকমণ্ডলীর নতুন লাইভ ব্যাচ ও প্রশ্নব্যাংক কোর্স খুব শীঘ্রই যুক্ত হচ্ছে।
                  ফ্রি নোট ও প্রশ্নব্যাংকগুলো এখনই দেখে নিন।
                </p>
                <div className="flex flex-wrap items-center justify-center gap-3">
                  <button
                    type="button"
                    onClick={() => {
                      if (defaultCategorySlug && defaultCategorySlug !== activeCategory) {
                        setSelectedCategory(defaultCategorySlug);
                      } else {
                        setSelectedCategory("");
                      }
                    }}
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
