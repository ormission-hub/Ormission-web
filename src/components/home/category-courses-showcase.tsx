"use client";

import { useState, useMemo, useEffect, useRef, type ReactNode } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  ArrowRight,
  Sparkles,
  Star,
  Clock,
  Users,
  BookOpen,
  ShoppingBag,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  Pin,
  Flame,
  ArrowUpRight
} from "lucide-react";
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

// ==========================================
// 3D Illustrations for Action Buttons
// ==========================================

function PopularCoursesIllustration() {
  return (
    <div className="w-10 h-10 sm:w-12 sm:h-12 flex items-center justify-center shrink-0 select-none">
      <svg viewBox="0 0 64 64" fill="none" className="w-full h-full drop-shadow-sm">
        <circle cx="32" cy="34" r="18" fill="url(#popular-fire-glow)" opacity="0.3" />
        <path
          d="M32 10C35 18 42 22 45 30C48 37 45 46 38 51C34 54 28 54 24 51C17 46 14 37 19 28C21 24 23 21 23 18C23 18 27 22 28 25C29 19 32 10 32 10Z"
          fill="url(#popular-flame-outer)"
        />
        <path
          d="M32 20C34 25 39 29 40 35C42 41 39 46 34 49C31 51 27 51 24 49C20 45 20 39 23 33C24.5 30 26 28 26 25C26 25 29 27 30 29C30.5 25 32 20 32 20Z"
          fill="url(#popular-flame-mid)"
        />
        <path
          d="M32 30C33.5 33 36 36 36 40C36 44 34 47 31 48C29 49 27 49 25 48C23 45 23 42 25 38C26 36 27 35 27 33C27 33 29 34 30 35C30.5 33 32 30 32 30Z"
          fill="url(#popular-flame-inner)"
        />
        <circle cx="43" cy="18" r="2" fill="#FDE047" />
        <circle cx="19" cy="22" r="1.5" fill="#FDE047" />
        <circle cx="47" cy="30" r="1.2" fill="#FFA048" />

        <defs>
          <radialGradient id="popular-fire-glow" cx="0.5" cy="0.5" r="0.5">
            <stop offset="0%" stopColor="#FF5F00" />
            <stop offset="100%" stopColor="#FF5F00" stopOpacity="0" />
          </radialGradient>
          <linearGradient id="popular-flame-outer" x1="16" y1="10" x2="46" y2="54" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#FF3300" />
            <stop offset="50%" stopColor="#FF5F00" />
            <stop offset="100%" stopColor="#D92400" />
          </linearGradient>
          <linearGradient id="popular-flame-mid" x1="21" y1="20" x2="41" y2="51" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#FF9900" />
            <stop offset="100%" stopColor="#FF5F00" />
          </linearGradient>
          <linearGradient id="popular-flame-inner" x1="24" y1="30" x2="36" y2="49" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#FFFFFF" />
            <stop offset="40%" stopColor="#FEF08A" />
            <stop offset="100%" stopColor="#FACC15" />
          </linearGradient>
        </defs>
      </svg>
    </div>
  );
}

function OurBooksIllustration() {
  return (
    <div className="w-10 h-10 sm:w-12 sm:h-12 flex items-center justify-center shrink-0 select-none">
      <svg viewBox="0 0 64 64" fill="none" className="w-full h-full drop-shadow-sm">
        <rect x="11" y="44" width="42" height="9" rx="2.5" fill="url(#book-emerald)" />
        <rect x="8" y="46.5" width="5" height="4" rx="1" fill="#047857" />
        <line x1="17" y1="48.5" x2="50" y2="48.5" stroke="#A7F3D0" strokeWidth="1.5" strokeLinecap="round" />

        <rect x="14" y="34" width="39" height="8.5" rx="2.5" fill="url(#book-sapphire)" />
        <rect x="11" y="36.5" width="5" height="3.5" rx="1" fill="#1D4ED8" />
        <line x1="20" y1="38" x2="49" y2="38" stroke="#BFDBFE" strokeWidth="1.5" strokeLinecap="round" />

        <rect x="12" y="24" width="41" height="8.5" rx="2.5" fill="url(#book-orange)" />
        <rect x="9" y="26.5" width="5" height="3.5" rx="1" fill="#C2410C" />
        <path d="M42 24V40L45.5 37L49 40V24H42Z" fill="#FBBF24" />

        <circle cx="32" cy="15" r="7" fill="url(#book-star-glow)" />
        <path d="M32 10L33.5 13.5L37 14L34.5 16.5L35 20L32 18L29 20L29.5 16.5L27 14L30.5 13.5L32 10Z" fill="#FFFFFF" />

        <defs>
          <linearGradient id="book-emerald" x1="11" y1="44" x2="53" y2="53" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#10B981" />
            <stop offset="100%" stopColor="#047857" />
          </linearGradient>
          <linearGradient id="book-sapphire" x1="14" y1="34" x2="53" y2="42.5" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#3B82F6" />
            <stop offset="100%" stopColor="#1E40AF" />
          </linearGradient>
          <linearGradient id="book-orange" x1="12" y1="24" x2="53" y2="32.5" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#F97316" />
            <stop offset="100%" stopColor="#C2410C" />
          </linearGradient>
          <linearGradient id="book-star-glow" x1="25" y1="8" x2="39" y2="22" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#F59E0B" />
            <stop offset="100%" stopColor="#D97706" />
          </linearGradient>
        </defs>
      </svg>
    </div>
  );
}

// Fallback Curated Books
const defaultOrmissionBooks = [
  {
    id: "book-1",
    title: "এইচএসসি পদার্থবিজ্ঞান মাস্টার ফর্মুলা বুক",
    subtitle: "১ম ও ২য় পত্রের সকল সূত্রের প্রমাণ, শর্টকাট ট্রিকস ও বোর্ড প্রশ্ন সমাধান",
    category: "এইচএসসি বিজ্ঞান",
    price: 380,
    original_price: 500,
    cover_gradient: "from-blue-600 via-indigo-600 to-sky-700",
    pages: "৩২০ পৃষ্ঠা",
    format: "হার্ডকভার + ই-বুক",
    rating: 5.0,
    reviews_count: 1420,
    features: ["অধ্যায়ভিত্তিক সকল সূত্র ও মাত্রা", "বিগত ১০ বছরের বোর্ড প্রশ্ন সমাধান", "টাইপভিত্তিক শর্টকাট মেথড"],
    is_pinned: true,
    is_popular: true,
  },
  {
    id: "book-2",
    title: "বুয়েট ও ইঞ্জিনিয়ারিং বিগত ২০ বছরের প্রশ্নব্যাংক",
    subtitle: "বুয়েট, রুয়েট, কুয়েট, চুয়েটের অধ্যায়ভিত্তিক নিখুঁত প্রশ্ন বিশ্লেষণ ও সমাধান",
    category: "ইঞ্জিনিয়ারিং ভর্তি",
    price: 550,
    original_price: 720,
    cover_gradient: "from-purple-700 via-indigo-800 to-slate-900",
    pages: "৫৪০ পৃষ্ঠা",
    format: "হার্ডকভার প্রিন্ট",
    rating: 5.0,
    reviews_count: 980,
    features: ["বিগত ২০ বছরের বুয়েট প্রশ্ন", "অধ্যায়ভিত্তিক ওয়েইটেজ এনালাইসিস", "কঠিন ম্যাথের সহজ বিকল্প টেকনিক"],
    is_pinned: true,
    is_popular: true,
  },
  {
    id: "book-3",
    title: "মেডিকেল বায়োলজি নেমোনিক্স ও হাই-ইল্ড হ্যান্ডবুক",
    subtitle: "ডিএমসি ও শীর্ষ মেডিকেল শিক্ষার্থীদের তৈরিকৃত মনে রাখার স্পেশাল হ্যান্ডনোট",
    category: "মেডিকেল ভর্তি",
    price: 320,
    original_price: 450,
    cover_gradient: "from-emerald-600 via-teal-700 to-cyan-800",
    pages: "২৮০ পৃষ্ঠা",
    format: "৪ কালার আর্ট প্রিন্ট",
    rating: 4.9,
    reviews_count: 1650,
    features: ["১০০% চিত্রসহ রঙিন ডায়াগ্রাম", "জাদুকরী নেমোনিক্স ও শর্টকাট", "বোটানি ও জুয়োলজির পূর্ণাঙ্গ কাভারেজ"],
    is_pinned: true,
    is_popular: true,
  },
  {
    id: "book-4",
    title: "এইচএসসি রসায়ন অর্গানিক রিঅ্যাকশন রঙিন রোডম্যাপ",
    subtitle: "জৈব রসায়নের সকল বিক্রিয়া ও পারস্পরিক রূপান্তরের এক নজরে রঙিন ফ্লোচার্ট",
    category: "এইচএসসি একাডেমি",
    price: 290,
    original_price: 390,
    cover_gradient: "from-orange-600 via-amber-600 to-red-600",
    pages: "১৯০ পৃষ্ঠা",
    format: "প্রিমিয়াম আর্ট পেপার",
    rating: 5.0,
    reviews_count: 840,
    features: ["সম্পূর্ণ বিক্রিয়ার রঙিন মেগা ফ্লোচার্ট", "সকল গুরুত্বপূর্ণ নেম রিঅ্যাকশন", "এডমিশন স্পেশাল কনভার্সন ট্রিকস"],
    is_pinned: true,
    is_popular: true,
  },
];

// 3D Boy Student Avatar Component
export function StudentAvatar3D() {
  return (
    <svg viewBox="0 0 64 64" fill="none" className="w-full h-full drop-shadow-2xs select-none">
      <ellipse cx="32" cy="27" rx="16" ry="17" fill="#1E293B" />
      <circle cx="17" cy="32" r="4" fill="#FED7AA" />
      <circle cx="47" cy="32" r="4" fill="#FED7AA" />
      <circle cx="17" cy="32" r="2.5" fill="#FCA5A5" opacity="0.6" />
      <circle cx="47" cy="32" r="2.5" fill="#FCA5A5" opacity="0.6" />
      <rect x="18" y="19" width="28" height="26" rx="14" fill="#FFEDD5" />
      <path
        d="M17 27C17 18 23.5 13 32 13C40.5 13 47 18 47 27C43 25 39 23.5 35 23.5C30 23.5 26.5 25.5 23 25.5C19.5 25.5 17.5 26.5 17 27Z"
        fill="#1E293B"
      />
      <circle cx="26" cy="31" r="2.5" fill="#0F172A" />
      <circle cx="38" cy="31" r="2.5" fill="#0F172A" />
      <circle cx="25.2" cy="30.2" r="0.8" fill="white" />
      <circle cx="37.2" cy="30.2" r="0.8" fill="white" />
      <ellipse cx="23" cy="34" rx="2.5" ry="1.5" fill="#FDA4AF" opacity="0.75" />
      <ellipse cx="41" cy="34" rx="2.5" ry="1.5" fill="#FDA4AF" opacity="0.75" />
      <path d="M29.5 36.5C30.8 37.8 33.2 37.8 34.5 36.5" stroke="#9A3412" strokeWidth="1.6" strokeLinecap="round" />
      <path
        d="M13 58C13 48.5 19 45 25 45H39C45 45 51 48.5 51 58V64H13V58Z"
        fill="#F95721"
      />
      <path d="M26 45L32 54L38 45H35L32 49.5L29 45H26Z" fill="#F0F9FF" />
      <path d="M28 45L32 51.5L36 45" stroke="#38BDF8" strokeWidth="1.2" fill="none" />
    </svg>
  );
}

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

  if (
    icon === "graduation" ||
    slug.includes("school") ||
    slug.includes("ssc") ||
    name.includes("school") ||
    name.includes("ssc")
  ) {
    return <SchoolIllustration />;
  }
  if (
    icon === "atom" ||
    icon === "rocket" ||
    slug.includes("hsc") ||
    name.includes("hsc")
  ) {
    return <HscIllustration />;
  }
  if (
    icon === "building" ||
    slug.includes("admission") ||
    slug.includes("university") ||
    name.includes("admission")
  ) {
    return <AdmissionIllustration />;
  }
  if (
    icon === "stethoscope" ||
    icon === "flask" ||
    slug.includes("nursing") ||
    name.includes("nursing") ||
    slug.includes("medical")
  ) {
    return <ScienceNursingIllustration />;
  }
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
  if (
    icon === "sparkles" ||
    icon === "award" ||
    slug.includes("free") ||
    name.includes("free")
  ) {
    return <FreeCourseIllustration />;
  }
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
  return <SchoolIllustration />;
}

export function CategoryCoursesShowcase({
  categories = [],
  courses = [],
  statsBar,
  pinnedCourseIds = [],
  initialBooks = [],
}: {
  categories?: DbCategoryShowcaseItem[];
  courses?: DbFeaturedCourse[];
  statsBar?: ReactNode;
  pinnedCourseIds?: (number | string)[];
  initialBooks?: any[];
}) {
  const [categoriesList, setCategoriesList] = useState<DbCategoryShowcaseItem[]>(categories);
  const [coursesList, setCoursesList] = useState<DbFeaturedCourse[]>(courses);
  const [pinnedIds, setPinnedIds] = useState<(number | string)[]>(pinnedCourseIds);
  const [booksList, setBooksList] = useState<any[]>(
    initialBooks && initialBooks.length > 0 ? initialBooks : defaultOrmissionBooks
  );

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

  useEffect(() => {
    if (pinnedCourseIds && pinnedCourseIds.length > 0) {
      setPinnedIds(pinnedCourseIds);
    }
  }, [pinnedCourseIds]);

  useEffect(() => {
    if (initialBooks && initialBooks.length > 0) {
      setBooksList(initialBooks);
    }
  }, [initialBooks]);

  // Client-side fetch & Realtime subscriptions
  useEffect(() => {
    const supabase = createClient();

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
            features,
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

    const fetchSettings = async () => {
      try {
        const { data } = await supabase
          .from("site_settings")
          .select("key, value")
          .in("key", ["homepage_pinned_courses", "ormission_books"]);

        if (data) {
          const pinRow = data.find((r) => r.key === "homepage_pinned_courses");
          if (pinRow && Array.isArray(pinRow.value)) {
            setPinnedIds(pinRow.value);
          }
          const bookRow = data.find((r) => r.key === "ormission_books");
          if (bookRow && Array.isArray(bookRow.value) && bookRow.value.length > 0) {
            setBooksList(bookRow.value);
          }
        }
      } catch (err) {
        console.error("Error fetching site_settings client-side:", err);
      }
    };

    fetchFreshCategories();
    fetchFreshCourses();
    fetchSettings();

    const catChannel = supabase
      .channel("categories_rt_showcase")
      .on("postgres_changes", { event: "*", schema: "public", table: "categories" }, () => {
        fetchFreshCategories();
      })
      .subscribe();

    const coursesChannel = supabase
      .channel("courses_rt_showcase")
      .on("postgres_changes", { event: "*", schema: "public", table: "courses" }, () => {
        fetchFreshCourses();
      })
      .subscribe();

    const settingsChannel = supabase
      .channel("settings_rt_showcase")
      .on("postgres_changes", { event: "*", schema: "public", table: "site_settings" }, () => {
        fetchSettings();
      })
      .subscribe();

    return () => {
      supabase.removeChannel(catChannel);
      supabase.removeChannel(coursesChannel);
      supabase.removeChannel(settingsChannel);
    };
  }, []);

  const displayCategories = useMemo(() => {
    if (categoriesList && categoriesList.length > 0) {
      return [...categoriesList]
        .filter((c) => c.is_published !== false)
        .sort((a, b) => (a.display_order || 0) - (b.display_order || 0));
    }
    return [];
  }, [categoriesList]);

  const [selectedCategory, setSelectedCategory] = useState<string>("");

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

  // Courses to show on the Homepage (Filtered strictly by active category, prioritizing pinned courses)
  const displayedCourses = useMemo(() => {
    // 1. If a category is selected (or active default category)
    if (activeCategory && activeCategory !== "all") {
      const curCat = displayCategories.find(
        (cat) => cat.slug.toLowerCase() === activeCategory.toLowerCase()
      );

      const categoryFiltered = coursesList.filter((c) => {
        const cCatId = c.category_id ?? (Array.isArray(c.categories) ? c.categories[0]?.id : c.categories?.id);
        const cSlug = (Array.isArray(c.categories) ? c.categories[0]?.slug : c.categories?.slug || "").toLowerCase();
        return (
          (curCat?.id && String(cCatId) === String(curCat.id)) ||
          (curCat?.slug && cSlug === curCat.slug.toLowerCase()) ||
          (cSlug && cSlug === activeCategory.toLowerCase())
        );
      });

      // Sort pinned courses to the top within this category
      if (pinnedIds && pinnedIds.length > 0) {
        return [...categoryFiltered].sort((a, b) => {
          const aPinned = pinnedIds.some((pid) => String(pid) === String(a.id));
          const bPinned = pinnedIds.some((pid) => String(pid) === String(b.id));
          if (aPinned && !bPinned) return -1;
          if (!aPinned && bPinned) return 1;
          return 0;
        });
      }

      return categoryFiltered;
    }

    // 2. Default when no category filter is applied:
    let list: DbFeaturedCourse[] = [];
    if (pinnedIds && pinnedIds.length > 0) {
      list = coursesList.filter((c) => pinnedIds.some((pid) => String(pid) === String(c.id)));
    }
    if (list.length === 0) {
      const featured = coursesList.filter((c) => c.is_featured);
      list = featured.length > 0 ? featured : coursesList.slice(0, 6);
    }
    return list;
  }, [coursesList, activeCategory, displayCategories, pinnedIds]);

  const pinnedCourses = displayedCourses;

  // Reset carousel scroll to start whenever category changes
  useEffect(() => {
    if (coursesScrollRef.current) {
      coursesScrollRef.current.scrollTo({ left: 0, behavior: "smooth" });
    }
    setCourseActiveIndex(0);
  }, [activeCategory]);

  // Pinned books to show on the Homepage (Filtered strictly by admin's pinned books)
  const pinnedBooks = useMemo(() => {
    const pinned = booksList.filter((b) => b.is_pinned !== false);
    return pinned.length > 0 ? pinned : booksList;
  }, [booksList]);

  // Horizontal Slideshow Carousel Refs and Controls
  const coursesScrollRef = useRef<HTMLDivElement>(null);
  const booksScrollRef = useRef<HTMLDivElement>(null);

  const [courseActiveIndex, setCourseActiveIndex] = useState(0);
  const [bookActiveIndex, setBookActiveIndex] = useState(0);

  const scrollCourse = (direction: "left" | "right") => {
    if (coursesScrollRef.current) {
      const cardWidth = coursesScrollRef.current.clientWidth > 640 ? 380 : 310;
      coursesScrollRef.current.scrollBy({
        left: direction === "left" ? -cardWidth : cardWidth,
        behavior: "smooth",
      });
    }
  };

  const scrollBook = (direction: "left" | "right") => {
    if (booksScrollRef.current) {
      const cardWidth = booksScrollRef.current.clientWidth > 640 ? 340 : 300;
      booksScrollRef.current.scrollBy({
        left: direction === "left" ? -cardWidth : cardWidth,
        behavior: "smooth",
      });
    }
  };

  const courseScrollRafRef = useRef<number | null>(null);
  const bookScrollRafRef = useRef<number | null>(null);

  const handleCourseScroll = () => {
    if (courseScrollRafRef.current) return;
    courseScrollRafRef.current = requestAnimationFrame(() => {
      courseScrollRafRef.current = null;
      if (coursesScrollRef.current) {
        const cardWidth = coursesScrollRef.current.clientWidth > 640 ? 380 : 310;
        const idx = Math.round(coursesScrollRef.current.scrollLeft / cardWidth);
        const clamped = Math.max(0, Math.min(idx, pinnedCourses.length - 1));
        setCourseActiveIndex((prev) => (prev !== clamped ? clamped : prev));
      }
    });
  };

  const handleBookScroll = () => {
    if (bookScrollRafRef.current) return;
    bookScrollRafRef.current = requestAnimationFrame(() => {
      bookScrollRafRef.current = null;
      if (booksScrollRef.current) {
        const cardWidth = booksScrollRef.current.clientWidth > 640 ? 340 : 300;
        const idx = Math.round(booksScrollRef.current.scrollLeft / cardWidth);
        const clamped = Math.max(0, Math.min(idx, pinnedBooks.length - 1));
        setBookActiveIndex((prev) => (prev !== clamped ? clamped : prev));
      }
    });
  };

  // Clean up RAF on unmount
  useEffect(() => {
    return () => {
      if (courseScrollRafRef.current) cancelAnimationFrame(courseScrollRafRef.current);
      if (bookScrollRafRef.current) cancelAnimationFrame(bookScrollRafRef.current);
    };
  }, []);

  // Category layout: 3 on top row, 2 on bottom row
  const topRowCategories = displayCategories.slice(0, 3);
  const bottomRowCategories = displayCategories.slice(3);

  // Category Pill Component: Lightweight, GPU-accelerated & 60fps smooth
  const renderCategoryPill = (cat: DbCategoryShowcaseItem, idx: number) => {
    const isSelected = activeCategory === cat.slug;
    const illustration = getCategoryIllustration(cat);

    return (
      <motion.button
        key={cat.id || cat.slug}
        type="button"
        variants={zoomIn}
        onClick={() => {
          setSelectedCategory(cat.slug);
        }}
        whileHover={{ y: -2, scale: 1.02, transition: { duration: 0.15 } }}
        whileTap={{ scale: 0.97 }}
        className={`group relative p-[1.5px] sm:p-[2.5px] rounded-xl sm:rounded-2xl cursor-pointer select-none transition-all duration-200 overflow-hidden w-full sm:w-auto min-w-0 sm:min-w-[170px] min-h-[46px] sm:min-h-[56px] ${
          isSelected
            ? "shadow-[0_0_18px_rgba(255,95,0,0.38)] ring-1.5 sm:ring-2 ring-primary/60 bg-primary/20"
            : "border border-border/80 bg-slate-200/60 dark:bg-slate-800/60 hover:border-primary/50 hover:shadow-xs"
        }`}
      >
        {/* Continuous rotating glowing border laser beam on ALL pills */}
        <div
          className="border-beam-sharp"
          style={{
            background: isSelected
              ? "conic-gradient(from 0deg, transparent 0deg, transparent 240deg, #FF5F00 285deg, #FFFFFF 330deg, transparent 360deg)"
              : "conic-gradient(from 0deg, transparent 0deg, transparent 255deg, rgba(255,95,0,0.7) 295deg, rgba(255,255,255,0.95) 335deg, transparent 360deg)",
            animationName: "borderRotate",
            animationDuration: isSelected ? "2.6s" : "3.5s",
            animationTimingFunction: "linear",
            animationIterationCount: "infinite",
            animationDelay: `${idx * -0.7}s`,
            opacity: isSelected ? 1 : 0.75,
          }}
        />

        <div
          className={`relative z-10 w-full h-full rounded-[10px] sm:rounded-[13.5px] flex items-center justify-center gap-1.5 sm:gap-3.5 px-2 py-2.5 sm:px-8 sm:py-3.5 transition-colors duration-200 overflow-hidden ${
            isSelected
              ? "bg-surface dark:bg-slate-900 text-primary"
              : "bg-surface dark:bg-slate-900/95 text-text group-hover:text-primary"
          }`}
        >
          {isSelected && (
            <span
              className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/35 dark:via-white/[0.08] to-transparent pointer-events-none animate-glass-shimmer"
            />
          )}

          <span className="absolute inset-x-0 top-0 h-1/2 rounded-t-[10px] sm:rounded-t-[13.5px] bg-gradient-to-b from-white/60 dark:from-white/[0.06] to-transparent pointer-events-none" />

          <div className="relative z-10 w-6 h-6 sm:w-10 sm:h-10 shrink-0 [&>div]:!w-6 [&>div]:!h-6 sm:[&>div]:!w-10 sm:[&>div]:!w-10 transition-transform duration-200 group-hover:scale-110 drop-shadow-xs">
            {illustration}
          </div>

          <span
            className={`relative z-10 text-xs xs:text-[13px] sm:text-base lg:text-lg tracking-tight transition-colors duration-200 truncate sm:whitespace-nowrap ${
              isSelected
                ? "text-primary font-black"
                : "text-text group-hover:text-primary font-bold"
            }`}
          >
            {cat.name || cat.name_bn}
          </span>

          {isSelected && (
            <span className="relative z-10 w-2 h-2 sm:w-2.5 sm:h-2.5 rounded-full bg-primary animate-pulse shrink-0 ml-1 shadow-[0_0_8px_#FF5F00]" />
          )}
        </div>
      </motion.button>
    );
  };

  // Renders a section heading with animated laser border (text label, not a button/link)
  const renderSectionLabel = (
    title: string,
    illustration: ReactNode,
    idx: number,
    tagText: string
  ) => {
    return (
      <div
        className="group relative p-[2px] sm:p-[2.5px] rounded-xl sm:rounded-2xl select-none transition-all duration-300 overflow-hidden w-auto shadow-[0_0_15px_rgba(255,95,0,0.2)] hover:shadow-[0_0_22px_rgba(255,95,0,0.35)] bg-slate-300/80 dark:bg-slate-800/90 ring-1 ring-border/60 hover:ring-primary/60"
      >
        {/* Hardware-accelerated Single Laser Beam Layer */}
        <div
          className="border-beam-sharp"
          style={{
            background:
              "conic-gradient(from 0deg, transparent 0deg, transparent 260deg, #FF5F00 295deg, #FFFFFF 335deg, transparent 360deg)",
            animationName: "borderRotate",
            animationDuration: "3.5s",
            animationTimingFunction: "linear",
            animationIterationCount: "infinite",
            animationDelay: `${idx * -1.5}s`,
            opacity: 0.9,
          }}
        />

        {/* Inner Container */}
        <div className="relative z-10 w-full h-full rounded-[10px] sm:rounded-[13.5px] flex items-center gap-2 sm:gap-3.5 px-3 py-2 sm:px-5 sm:py-3 bg-surface dark:bg-slate-900 text-text overflow-hidden">
          <span className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/30 dark:via-white/[0.08] to-transparent pointer-events-none group-hover:animate-glass-shimmer" />
          <span className="absolute inset-x-0 top-0 h-1/2 rounded-t-[10px] sm:rounded-t-[13.5px] bg-gradient-to-b from-white/60 dark:from-white/[0.06] to-transparent pointer-events-none" />

          <div className="relative z-10 w-6 h-6 sm:w-8 sm:h-8 shrink-0 [&>div]:!w-6 [&>div]:!h-6 sm:[&>div]:!w-8 sm:[&>div]:!h-8 transition-transform duration-200 group-hover:scale-110 drop-shadow-xs">
            {illustration}
          </div>

          <span className="relative z-10 text-sm xs:text-base sm:text-lg font-black tracking-tight text-text font-bengali">
            {title}
          </span>

          <span className="hidden sm:inline-block relative z-10 px-2 py-0.5 rounded-full text-[10px] font-black bg-primary/15 text-primary border border-primary/20 ml-1">
            {tagText}
          </span>
        </div>
      </div>
    );
  };

  return (
    <section id="category-courses-section" className="relative pt-1 sm:pt-2 pb-1 sm:pb-2 bg-background overflow-hidden">
      {/* Ambient background glow (GPU-friendly radial gradient without expensive blur filter) */}
      <div
        className="hidden sm:block absolute top-1/4 left-1/2 -translate-x-1/2 w-[800px] h-[350px] rounded-full opacity-20 dark:opacity-10 pointer-events-none"
        style={{
          background: "radial-gradient(ellipse at center, rgba(255,95,0,0.12) 0%, rgba(124,58,237,0.08) 50%, transparent 70%)",
        }}
        aria-hidden="true"
      />

      <div className="container-main relative z-10">
        {/* Category Pills: 3 on Top Row, 2 on Bottom Row */}
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
          className="flex flex-col items-center justify-center gap-2.5 sm:gap-3.5 mb-5 sm:mb-7 w-full px-1.5 sm:px-0"
        >
          <div className="grid grid-cols-3 gap-2 sm:gap-4 w-full max-w-[430px] sm:max-w-none sm:flex sm:flex-wrap sm:items-center sm:justify-center">
            {topRowCategories.map((cat, idx) => renderCategoryPill(cat, idx))}
          </div>

          {bottomRowCategories.length > 0 && (
            <div className="grid grid-cols-2 gap-2 sm:gap-4 w-full max-w-[290px] sm:max-w-none sm:flex sm:flex-wrap sm:items-center sm:justify-center">
              {bottomRowCategories.map((cat, idx) =>
                renderCategoryPill(cat, idx + topRowCategories.length)
              )}
            </div>
          )}
        </motion.div>

        {/* Stats Bar (Audience / Students) placed directly between Category Pills and Course Cards */}
        {statsBar && (
          <div className="mb-6 sm:mb-8">
            {statsBar}
          </div>
        )}

        {/* ============================================================ */}
        {/* 1. PINNED COURSES SLIDESHOW (Side-sliding horizontal carousel) */}
        {/* ============================================================ */}
        {(() => {
          const activeCategoryObj = displayCategories.find(
            (cat) => cat.slug.toLowerCase() === activeCategory.toLowerCase()
          );
          const sectionTitle = activeCategoryObj
            ? `${activeCategoryObj.name_bn || activeCategoryObj.name} কোর্সসমূহ`
            : "জনপ্রিয় কোর্স";

          return (
            <div className="mb-6 sm:mb-8">
              <div className="flex items-center justify-between gap-3 mb-3.5 sm:mb-4">
                <div className="flex items-center gap-2.5 sm:gap-3">
                  {renderSectionLabel(sectionTitle, <PopularCoursesIllustration />, 0, activeCategoryObj?.name_bn || "নির্বাচিত")}
                </div>

                {/* Slider Arrows & All Courses Link */}
                <div className="flex items-center gap-2">
                  <Link
                    href={activeCategory && activeCategory !== "all" ? `/courses?category=${activeCategory}` : "/courses?filter=popular"}
                    className="hidden md:inline-flex items-center gap-1 text-xs font-bold text-primary hover:text-primary-hover font-bengali mr-2"
                  >
                    <span>সব কোর্স</span>
                    <ArrowUpRight className="w-3.5 h-3.5" />
                  </Link>
                  {pinnedCourses.length > 1 && (
                    <>
                      <button
                        type="button"
                        onClick={() => scrollCourse("left")}
                        aria-label="Previous Course"
                        className="w-9 h-9 sm:w-10 sm:h-10 rounded-full border border-border bg-surface hover:bg-surface-secondary text-text flex items-center justify-center shadow-xs transition-colors cursor-pointer"
                      >
                        <ChevronLeft className="w-5 h-5" />
                      </button>
                      <button
                        type="button"
                        onClick={() => scrollCourse("right")}
                        aria-label="Next Course"
                        className="w-9 h-9 sm:w-10 sm:h-10 rounded-full border border-border bg-surface hover:bg-surface-secondary text-text flex items-center justify-center shadow-xs transition-colors cursor-pointer"
                      >
                        <ChevronRight className="w-5 h-5" />
                      </button>
                    </>
                  )}
                </div>
              </div>

              {/* Courses Slideshow Track */}
              {pinnedCourses.length === 0 ? (
                <div className="w-full py-12 px-4 rounded-2xl border border-dashed border-border/80 bg-surface/40 flex flex-col items-center justify-center text-center my-3">
                  <div className="w-12 h-12 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center text-primary mb-3">
                    <Sparkles className="w-6 h-6" />
                  </div>
                  <h4 className="text-sm sm:text-base font-bold text-text font-bengali mb-1">
                    {activeCategoryObj ? `${activeCategoryObj.name_bn || activeCategoryObj.name} ক্যাটাগরিতে শীঘ্রই কোর্স যুক্ত করা হবে` : "শীঘ্রই নতুন কোর্স যুক্ত করা হবে"}
                  </h4>
                  <p className="text-xs text-text-muted font-bengali max-w-sm mb-4">
                    আমাদের শিক্ষকমণ্ডলী এই ক্যাটাগরির জন্য নতুন ও আকর্ষণীয় কোর্স প্রস্তুত করছেন।
                  </p>
                  <Link
                    href="/courses"
                    className="px-4 py-2 rounded-xl bg-primary text-white text-xs font-bold font-bengali hover:bg-primary-hover transition-colors shadow-sm"
                  >
                    সকল কোর্স দেখুন
                  </Link>
                </div>
              ) : (
                <div
                  ref={coursesScrollRef}
                  onScroll={handleCourseScroll}
                  className="flex gap-5 sm:gap-6 overflow-x-auto snap-x snap-mandatory scroll-smooth no-scrollbar py-3 px-1 -mx-1"
                >
                  {pinnedCourses.map((course, idx) => {
                    const title = course.title_bn || course.title;
                    const categoryName = Array.isArray(course.categories)
                      ? course.categories[0]?.name_bn || course.categories[0]?.name
                      : course.categories?.name_bn || course.categories?.name || "কোর্স";
                    const isPinned = pinnedIds.some((pid) => String(pid) === String(course.id));

                    return (
                      <div
                        key={course.id || course.slug}
                        className="w-[86vw] xs:w-[320px] sm:w-[360px] lg:w-[380px] shrink-0 snap-start group flex flex-col bg-surface border border-border/80 rounded-2xl overflow-hidden shadow-sm hover:shadow-xl hover:shadow-primary/15 hover:border-primary/50 hover:-translate-y-1 transition-all duration-300 h-full"
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
                              sizes="(max-width: 768px) 100vw, 400px"
                              unoptimized={Boolean(course.thumbnail_url?.startsWith("http"))}
                              className="object-cover group-hover:scale-105 transition-transform duration-500"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center bg-surface-secondary text-text-muted">
                              <Sparkles className="w-10 h-10 opacity-30" />
                            </div>
                          )}
                          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                          {isPinned ? (
                            <span className="absolute top-3 right-3 px-2 py-0.5 rounded-full text-[10.5px] font-black text-white bg-primary shadow-sm font-bengali flex items-center gap-1">
                              <Pin className="w-3 h-3 fill-white/30" /> পিন করা
                            </span>
                          ) : course.is_featured ? (
                            <span className="absolute top-3 right-3 px-2 py-0.5 rounded-full text-[10.5px] font-black text-white bg-amber-500 shadow-sm font-bengali flex items-center gap-1">
                              <Flame className="w-3 h-3 fill-white/30" /> জনপ্রিয়
                            </span>
                          ) : null}
                        </Link>

                  {/* Content */}
                  <div className="p-5 sm:p-6 flex flex-col flex-1">
                    <Link href={`/course/${course.slug}`}>
                      <h4 className="text-base sm:text-lg font-black text-text group-hover:text-primary transition-colors line-clamp-2 mb-2 font-bengali">
                        {title}
                      </h4>
                    </Link>

                    <p className="text-xs sm:text-sm text-text-muted line-clamp-2 mb-4 font-bengali">
                      {course.short_description || course.description || "কোর্সের বিস্তারিত শীঘ্রই যুক্ত হচ্ছে..."}
                    </p>

                    <div className="flex items-center gap-3 text-xs text-text-muted mb-4 font-bengali">
                      <span className="flex items-center gap-1.5">
                        <Users className="w-3.5 h-3.5 text-primary" />
                        <span>লাইভ ক্লাস</span>
                      </span>
                      <span>•</span>
                      <span className="flex items-center gap-1.5">
                        <Clock className="w-3.5 h-3.5 text-primary" />
                        <span>
                          {course.total_duration ? `${course.total_duration} ঘণ্টা` : "ডাউট সলভিং"}
                        </span>
                      </span>
                    </div>

                    <div className="flex items-center justify-between gap-2 mb-4">
                      {((course as any).features?.show_rating !== false && (course as any).show_rating !== false && (course as any).showRating !== false) ? (
                        <div className="flex items-center gap-1">
                          {[...Array(5)].map((_, i) => (
                            <Star key={i} className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                          ))}
                          <span className="text-xs font-bold text-text ml-1">
                            {Number((course as any).features?.rating || (course as any).rating || 5.0).toFixed(1)}
                          </span>
                        </div>
                      ) : (
                        <div />
                      )}

                      <div className="inline-flex items-center gap-2 p-1 pr-3 rounded-2xl bg-white dark:bg-[#180d19]/90 border border-[#FCE7F3] dark:border-[#FB7185]/30 shadow-[0_2px_8px_rgba(225,29,72,0.06)] dark:shadow-[0_4px_14px_rgba(225,29,72,0.2)] transition-all duration-200 hover:shadow-md hover:scale-[1.02] shrink-0">
                        <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-xl bg-[#FFF0F4] dark:bg-[#2E101F] border border-[#FCE7F3] dark:border-[#FB7185]/20 flex items-center justify-center shrink-0 p-0.5 overflow-hidden shadow-2xs">
                          <StudentAvatar3D />
                        </div>
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
                </div>
              );
            })}
          </div>
        )}

        {/* Dots Indicator */}
        {pinnedCourses.length > 1 && (
          <div className="flex items-center justify-center gap-1.5 mt-2.5">
            {pinnedCourses.map((_, i) => (
              <button
                key={i}
                type="button"
                aria-label={`Go to course slide ${i + 1}`}
                onClick={() => {
                  if (coursesScrollRef.current) {
                    const cardWidth = coursesScrollRef.current.clientWidth > 640 ? 380 : 310;
                    coursesScrollRef.current.scrollTo({ left: i * cardWidth, behavior: "smooth" });
                  }
                }}
                className={`h-1.5 rounded-full transition-all duration-300 ${
                  courseActiveIndex === i ? "w-6 bg-primary" : "w-1.5 bg-border hover:bg-text-muted"
                }`}
              />
            ))}
          </div>
        )}
      </div>
    );
  })()}

        {/* ============================================================ */}
        {/* 2. PINNED BOOKS SLIDESHOW (Side-sliding horizontal carousel) */}
        {/* ============================================================ */}
        <div className="pt-5 sm:pt-6 border-t border-border/60">
          <div className="flex items-center justify-between gap-3 mb-3.5 sm:mb-4">
            <div className="flex items-center gap-2.5 sm:gap-3">
              {renderSectionLabel("আমাদের বইসমূহ", <OurBooksIllustration />, 1, "স্পেশাল বুকস")}
            </div>

            {/* Slider Arrows & All Books Link */}
            <div className="flex items-center gap-2">
              <Link
                href="/books"
                className="hidden md:inline-flex items-center gap-1 text-xs font-bold text-primary hover:text-primary-hover font-bengali mr-2"
              >
                <span>সব বইসমূহ</span>
                <ArrowUpRight className="w-3.5 h-3.5" />
              </Link>
              <button
                type="button"
                onClick={() => scrollBook("left")}
                aria-label="Previous Book"
                className="w-9 h-9 sm:w-10 sm:h-10 rounded-full border border-border bg-surface hover:bg-surface-secondary text-text flex items-center justify-center shadow-xs transition-colors cursor-pointer"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <button
                type="button"
                onClick={() => scrollBook("right")}
                aria-label="Next Book"
                className="w-9 h-9 sm:w-10 sm:h-10 rounded-full border border-border bg-surface hover:bg-surface-secondary text-text flex items-center justify-center shadow-xs transition-colors cursor-pointer"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Books Slideshow Track */}
          <div
            ref={booksScrollRef}
            onScroll={handleBookScroll}
            className="flex gap-5 sm:gap-6 overflow-x-auto snap-x snap-mandatory scroll-smooth no-scrollbar py-3 px-1 -mx-1"
          >
            {pinnedBooks.map((book, idx) => (
              <div
                key={book.id}
                className="w-[84vw] xs:w-[300px] sm:w-[320px] lg:w-[340px] shrink-0 snap-start group flex flex-col bg-surface border border-border/80 rounded-2xl overflow-hidden shadow-sm hover:shadow-xl hover:shadow-primary/15 hover:border-primary/50 hover:-translate-y-1 transition-all duration-300 h-full"
              >
                {/* Book Visual Mockup Cover Area */}
                <div
                  className={`relative h-48 sm:h-52 w-full bg-gradient-to-br ${book.cover_gradient || book.coverGradient || "from-blue-600 via-indigo-600 to-sky-700"} p-4 sm:p-5 flex flex-col justify-between overflow-hidden`}
                >
                  <div className="absolute -right-8 -bottom-8 w-32 h-32 rounded-full bg-white/10 blur-xl pointer-events-none" />
                  <div className="absolute left-0 top-0 w-full h-full bg-[radial-gradient(circle_at_top_right,rgba(255,255,255,0.18),transparent_65%)] pointer-events-none" />

                  {/* Badges */}
                  <div className="relative z-10 flex items-center justify-between gap-2">
                    <span className="px-2.5 py-0.5 rounded-full text-[10.5px] font-black text-white bg-black/40 backdrop-blur-md border border-white/20 font-bengali">
                      {book.category}
                    </span>
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-black text-white bg-primary shadow-sm font-bengali flex items-center gap-1">
                      <Pin className="w-2.5 h-2.5 fill-white/30" /> পিন করা
                    </span>
                  </div>

                  {/* 3D Book Spine Mockup */}
                  <div className="relative z-10 flex items-center gap-3 my-auto">
                    <div className="w-14 h-20 rounded-md bg-white/20 backdrop-blur-md border border-white/30 shadow-2xl flex flex-col items-center justify-center p-2 text-white shrink-0 group-hover:scale-105 transition-transform duration-300">
                      <BookOpen className="w-7 h-7 mb-1 text-white drop-shadow-sm" />
                      <span className="text-[8.5px] font-black tracking-widest text-white/90">ORMISSION</span>
                    </div>
                    <div className="text-white space-y-1">
                      <span className="inline-block px-2 py-0.5 rounded bg-white/25 text-[10px] font-bold">
                        {book.format || "হার্ডকভার প্রিন্ট"}
                      </span>
                      <p className="text-xs font-semibold text-white/90 font-bengali">
                        {book.pages || "৩২০ পৃষ্ঠা"}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Book Details */}
                <div className="p-5 flex flex-col flex-1">
                  <h4 className="text-base sm:text-lg font-black text-text group-hover:text-primary transition-colors line-clamp-1 mb-1.5 font-bengali">
                    {book.title}
                  </h4>
                  <p className="text-xs text-text-muted line-clamp-2 mb-3 leading-relaxed font-bengali">
                    {book.subtitle}
                  </p>

                  {/* Key features */}
                  {Array.isArray(book.features) && book.features.length > 0 && (
                    <div className="space-y-1.5 mb-4">
                      {book.features.slice(0, 2).map((feat: string, fIdx: number) => (
                        <div key={fIdx} className="flex items-center gap-1.5 text-[11.5px] font-medium text-slate-600 dark:text-slate-300 font-bengali">
                          <CheckCircle2 className="w-3.5 h-3.5 text-primary shrink-0" />
                          <span className="truncate">{feat}</span>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* 5-Star Rating */}
                  <div className="flex items-center justify-between gap-2 mb-4 pt-2.5 border-t border-border/40">
                    <div className="flex items-center gap-1">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                      ))}
                      <span className="text-xs font-bold text-text ml-1">{book.rating || "5.0"}</span>
                    </div>
                    <span className="text-[11px] text-text-muted font-bengali">
                      ({(book.reviews_count || book.reviewsCount || 1200).toLocaleString("en-US")}+ রিভিউ)
                    </span>
                  </div>

                  {/* Pricing & CTA */}
                  <div className="mt-auto pt-3 border-t border-border/60 flex items-center justify-between">
                    <div className="flex items-baseline gap-2">
                      <span className="text-xl font-black text-primary tabular-nums">
                        ৳{book.price.toLocaleString("en-US")}
                      </span>
                      {(book.original_price || book.originalPrice) > book.price && (
                        <span className="text-xs text-text-muted line-through tabular-nums">
                          ৳{(book.original_price || book.originalPrice).toLocaleString("en-US")}
                        </span>
                      )}
                    </div>

                    <Link
                      href="/books"
                      className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold text-white bg-primary hover:bg-primary-hover shadow-md shadow-primary/25 hover:shadow-lg hover:shadow-primary/35 transition-all duration-200 group-hover:scale-105 font-bengali"
                    >
                      <ShoppingBag className="w-3.5 h-3.5" />
                      <span>সংগ্রহ করুন</span>
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Dots Indicator */}
          {pinnedBooks.length > 1 && (
            <div className="flex items-center justify-center gap-1.5 mt-2.5">
              {pinnedBooks.map((_, i) => (
                <button
                  key={i}
                  type="button"
                  aria-label={`Go to book slide ${i + 1}`}
                  onClick={() => {
                    if (booksScrollRef.current) {
                      const cardWidth = booksScrollRef.current.clientWidth > 640 ? 340 : 300;
                      booksScrollRef.current.scrollTo({ left: i * cardWidth, behavior: "smooth" });
                    }
                  }}
                  className={`h-1.5 rounded-full transition-all duration-300 ${
                    bookActiveIndex === i ? "w-6 bg-primary" : "w-1.5 bg-border hover:bg-text-muted"
                  }`}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
