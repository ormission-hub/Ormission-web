"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import {
  GraduationCap,
  Atom,
  Building2,
  Stethoscope,
  BookOpen,
  FlaskConical,
  Calculator,
  Briefcase,
  Globe,
  Code,
  Microscope,
  Award,
  Sparkles,
  Brain,
  Laptop,
  Compass,
  Palette,
  Layers,
  Search,
  ArrowRight,
  ChevronRight,
  Flame,
  Users,
  CheckCircle2,
  BookCheck,
  X,
  type LucideIcon,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export interface RealCategoryCourse {
  id: number | string;
  title: string;
  titleBn?: string | null;
  slug: string;
  price?: number;
  originalPrice?: number;
  thumbnailUrl?: string | null;
  enrollmentCount: number;
}

export interface RealCategoryItem {
  id: number;
  name: string;
  nameBn: string;
  slug: string;
  description: string;
  iconName: string;
  imageUrl?: string | null;
  displayOrder: number;
  courseCount: number;
  courses: RealCategoryCourse[];
}

interface CategoryDirectoryClientProps {
  categories: RealCategoryItem[];
  totalCoursesCount: number;
  totalStudentsCount: number;
}

const ICON_MAP: Record<string, LucideIcon> = {
  graduation: GraduationCap,
  graduationcap: GraduationCap,
  atom: Atom,
  building: Building2,
  building2: Building2,
  stethoscope: Stethoscope,
  book: BookOpen,
  bookopen: BookOpen,
  flask: FlaskConical,
  flaskconical: FlaskConical,
  calculator: Calculator,
  briefcase: Briefcase,
  globe: Globe,
  code: Code,
  microscope: Microscope,
  award: Award,
  sparkles: Sparkles,
  brain: Brain,
  laptop: Laptop,
  compass: Compass,
  palette: Palette,
  layers: Layers,
};

// Distinct theme styles for categories to give rich visual excitement
const CATEGORY_THEMES = [
  {
    gradient: "from-amber-500/10 via-amber-500/5 to-transparent",
    iconBg: "bg-amber-500/15 text-amber-600 dark:text-amber-400 border-amber-500/20",
    badgeBg: "bg-amber-500/10 text-amber-700 dark:text-amber-400 border-amber-500/25",
    borderHover: "hover:border-amber-500/40 dark:hover:border-amber-500/50",
    accentColor: "#F59E0B",
    glow: "rgba(245, 158, 11, 0.12)",
  },
  {
    gradient: "from-blue-500/10 via-blue-500/5 to-transparent",
    iconBg: "bg-blue-500/15 text-blue-600 dark:text-blue-400 border-blue-500/20",
    badgeBg: "bg-blue-500/10 text-blue-700 dark:text-blue-400 border-blue-500/25",
    borderHover: "hover:border-blue-500/40 dark:hover:border-blue-500/50",
    accentColor: "#3B82F6",
    glow: "rgba(59, 130, 246, 0.12)",
  },
  {
    gradient: "from-purple-500/10 via-purple-500/5 to-transparent",
    iconBg: "bg-purple-500/15 text-purple-600 dark:text-purple-400 border-purple-500/20",
    badgeBg: "bg-purple-500/10 text-purple-700 dark:text-purple-400 border-purple-500/25",
    borderHover: "hover:border-purple-500/40 dark:hover:border-purple-500/50",
    accentColor: "#A855F7",
    glow: "rgba(168, 85, 247, 0.12)",
  },
  {
    gradient: "from-emerald-500/10 via-emerald-500/5 to-transparent",
    iconBg: "bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border-emerald-500/20",
    badgeBg: "bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border-emerald-500/25",
    borderHover: "hover:border-emerald-500/40 dark:hover:border-emerald-500/50",
    accentColor: "#10B981",
    glow: "rgba(16, 185, 129, 0.12)",
  },
  {
    gradient: "from-rose-500/10 via-rose-500/5 to-transparent",
    iconBg: "bg-rose-500/15 text-rose-600 dark:text-rose-400 border-rose-500/20",
    badgeBg: "bg-rose-500/10 text-rose-700 dark:text-rose-400 border-rose-500/25",
    borderHover: "hover:border-rose-500/40 dark:hover:border-rose-500/50",
    accentColor: "#F43F5E",
    glow: "rgba(244, 63, 94, 0.12)",
  },
];

function formatBengaliNumber(num: number): string {
  const bengaliDigits = ["০", "১", "২", "৩", "৪", "৫", "৬", "৭", "৮", "৯"];
  return num
    .toString()
    .split("")
    .map((d) => bengaliDigits[parseInt(d, 10)] || d)
    .join("");
}

export function CategoryDirectoryClient({
  categories,
  totalCoursesCount,
  totalStudentsCount,
}: CategoryDirectoryClientProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [filterMode, setFilterMode] = useState<"all" | "active" | "upcoming">("all");

  // Filter categories based on search input & tabs
  const filteredCategories = useMemo(() => {
    return categories.filter((cat) => {
      const q = searchQuery.toLowerCase().trim();
      const matchesSearch =
        !q ||
        cat.name.toLowerCase().includes(q) ||
        cat.nameBn.toLowerCase().includes(q) ||
        cat.description.toLowerCase().includes(q) ||
        cat.courses.some(
          (c) =>
            c.title.toLowerCase().includes(q) ||
            (c.titleBn && c.titleBn.toLowerCase().includes(q))
        );

      if (!matchesSearch) return false;

      if (filterMode === "active") return cat.courseCount > 0;
      if (filterMode === "upcoming") return cat.courseCount === 0;
      return true;
    });
  }, [categories, searchQuery, filterMode]);

  const activeCount = useMemo(
    () => categories.filter((c) => c.courseCount > 0).length,
    [categories]
  );
  const upcomingCount = useMemo(
    () => categories.filter((c) => c.courseCount === 0).length,
    [categories]
  );

  return (
    <div className="min-h-screen bg-background text-text selection:bg-primary/20 selection:text-primary">
      {/* Ambient background glows */}
      <div className="relative overflow-hidden pt-8 pb-16 lg:pt-12 lg:pb-24">
        <div
          className="absolute top-0 left-1/2 -translate-x-1/2 w-[700px] h-[350px] rounded-full opacity-20 pointer-events-none blur-3xl"
          style={{
            background:
              "radial-gradient(circle, rgba(255, 115, 21, 0.4) 0%, rgba(167, 139, 250, 0.2) 50%, transparent 70%)",
          }}
        />

        <div className="container-main relative z-10">
          {/* Breadcrumb */}
          <nav
            aria-label="Breadcrumb"
            className="flex items-center gap-2 text-xs text-text-muted mb-8 font-bengali"
          >
            <Link href="/" className="hover:text-primary transition-colors">
              হোম
            </Link>
            <ChevronRight className="w-3.5 h-3.5 text-text-muted/60" />
            <span className="text-primary font-semibold">কোর্স ক্যাটাগরি</span>
          </nav>

          {/* Hero Header */}
          <div className="max-w-3xl mb-10 lg:mb-12">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold bg-primary/10 text-primary border border-primary/20 font-bengali mb-4 shadow-xs">
              <Sparkles className="w-3.5 h-3.5 animate-pulse" />
              <span>কোর্স ক্যাটাগরি ডিরেক্টরি</span>
            </div>

            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-text font-bengali tracking-tight leading-[1.2] mb-4">
              আপনার প্রয়োজনীয় শিক্ষা বিভাগ{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary via-orange-500 to-amber-400">
                বেছে নিন
              </span>
            </h1>

            <p className="text-text-muted text-base sm:text-lg font-bengali leading-relaxed">
              এইচএসসি, এসএসসি, বিশ্ববিদ্যালয় ও মেডিকেল ভর্তি থেকে শুরু করে বিষয়ভিত্তিক বিশেষ প্রস্তুতি—
              নিজের লক্ষ্য অনুযায়ী সঠিক বিভাগ নির্বাচন করে কোর্সে যুক্ত হোন।
            </p>
          </div>

          {/* Live Platform Stats Bar */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 mb-10">
            <div className="p-4 rounded-xl bg-surface/80 dark:bg-slate-900/80 border border-border/80 backdrop-blur-md shadow-xs flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-primary/10 text-primary flex items-center justify-center shrink-0">
                <GraduationCap className="w-5 h-5" />
              </div>
              <div>
                <p className="text-lg sm:text-xl font-black text-text font-bengali leading-tight">
                  {formatBengaliNumber(categories.length)}টি
                </p>
                <p className="text-xs text-text-muted font-bengali">শিক্ষা বিভাগ</p>
              </div>
            </div>

            <div className="p-4 rounded-xl bg-surface/80 dark:bg-slate-900/80 border border-border/80 backdrop-blur-md shadow-xs flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-secondary/15 text-secondary flex items-center justify-center shrink-0">
                <BookCheck className="w-5 h-5" />
              </div>
              <div>
                <p className="text-lg sm:text-xl font-black text-text font-bengali leading-tight">
                  {formatBengaliNumber(totalCoursesCount)}টি
                </p>
                <p className="text-xs text-text-muted font-bengali">সক্রিয় কোর্স</p>
              </div>
            </div>

            <div className="p-4 rounded-xl bg-surface/80 dark:bg-slate-900/80 border border-border/80 backdrop-blur-md shadow-xs flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-emerald-500/15 text-emerald-500 flex items-center justify-center shrink-0">
                <Users className="w-5 h-5" />
              </div>
              <div>
                <p className="text-lg sm:text-xl font-black text-text font-bengali leading-tight">
                  {totalStudentsCount > 0
                    ? `${formatBengaliNumber(totalStudentsCount)}+`
                    : "১০০+"}
                </p>
                <p className="text-xs text-text-muted font-bengali">শিক্ষার্থী যুক্ত</p>
              </div>
            </div>

            <div className="p-4 rounded-xl bg-surface/80 dark:bg-slate-900/80 border border-border/80 backdrop-blur-md shadow-xs flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-amber-500/15 text-amber-500 flex items-center justify-center shrink-0">
                <Flame className="w-5 h-5" />
              </div>
              <div>
                <p className="text-lg sm:text-xl font-black text-text font-bengali leading-tight">
                  ১০০%
                </p>
                <p className="text-xs text-text-muted font-bengali">প্রস্তুতি নিশ্চয়তা</p>
              </div>
            </div>
          </div>

          {/* Search & Filter Controls */}
          <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4 mb-8 bg-surface/60 dark:bg-slate-900/60 p-3 sm:p-4 rounded-2xl border border-border/80 backdrop-blur-md">
            {/* Search Input */}
            <div className="relative flex-1">
              <Search className="w-4 h-4 text-text-muted absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="ক্যাটাগরি বা কোর্সের নাম দিয়ে খুঁজুন (যেমন: SSC, HSC, ভর্তি)..."
                className="w-full bg-surface-secondary/70 dark:bg-slate-800/70 border border-border rounded-xl pl-10 pr-10 py-2.5 text-sm font-bengali text-text placeholder:text-text-muted/60 focus:outline-hidden focus:border-primary/60 focus:ring-2 focus:ring-primary/20 transition-all"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery("")}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-text-muted hover:text-text p-1"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>

            {/* Filter Tabs */}
            <div className="flex items-center gap-1.5 p-1 bg-surface-secondary/80 dark:bg-slate-800/80 rounded-xl border border-border shrink-0 self-start md:self-auto overflow-x-auto max-w-full">
              <button
                onClick={() => setFilterMode("all")}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold font-bengali transition-all whitespace-nowrap ${
                  filterMode === "all"
                    ? "bg-primary text-white shadow-xs"
                    : "text-text-muted hover:text-text hover:bg-surface/60"
                }`}
              >
                সকল বিভাগ ({categories.length})
              </button>
              <button
                onClick={() => setFilterMode("active")}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold font-bengali transition-all whitespace-nowrap ${
                  filterMode === "active"
                    ? "bg-primary text-white shadow-xs"
                    : "text-text-muted hover:text-text hover:bg-surface/60"
                }`}
              >
                সক্রিয় কোর্স রয়েছে ({activeCount})
              </button>
              <button
                onClick={() => setFilterMode("upcoming")}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold font-bengali transition-all whitespace-nowrap ${
                  filterMode === "upcoming"
                    ? "bg-primary text-white shadow-xs"
                    : "text-text-muted hover:text-text hover:bg-surface/60"
                }`}
              >
                শীঘ্রই আসছে ({upcomingCount})
              </button>
            </div>
          </div>

          {/* Categories Grid */}
          {filteredCategories.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
              {filteredCategories.map((category, idx) => {
                const Icon =
                  ICON_MAP[(category.iconName || "").toLowerCase().trim()] || BookOpen;
                const theme = CATEGORY_THEMES[idx % CATEGORY_THEMES.length];

                return (
                  <motion.div
                    key={category.id}
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: idx * 0.05 }}
                    className={`group relative rounded-2xl border border-border/80 bg-surface dark:bg-slate-900/90 overflow-hidden flex flex-col justify-between hover:shadow-xl hover:-translate-y-1 transition-all duration-300 ${theme.borderHover}`}
                  >
                    {/* Top Glow bar & subtle gradient background */}
                    <div
                      className={`absolute inset-0 bg-gradient-to-b ${theme.gradient} opacity-70 pointer-events-none`}
                    />

                    <div className="relative z-10 p-6 sm:p-7 flex flex-col flex-1">
                      {/* Top Row: Icon + Course Count Badge */}
                      <div className="flex items-center justify-between gap-3 mb-5">
                        <div
                          className={`w-13 h-13 rounded-2xl flex items-center justify-center border shadow-xs transition-transform duration-300 group-hover:scale-105 ${theme.iconBg}`}
                        >
                          <Icon className="w-6 h-6" />
                        </div>

                        {category.courseCount > 0 ? (
                          <span
                            className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold font-bengali border shadow-xs ${theme.badgeBg}`}
                          >
                            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                            <span>{formatBengaliNumber(category.courseCount)}টি কোর্স সক্রিয়</span>
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-surface-secondary border border-border text-text-muted font-bengali">
                            <span>শীঘ্রই আসছে</span>
                          </span>
                        )}
                      </div>

                      {/* Titles */}
                      <Link href={`/category/${category.slug}`}>
                        <h2 className="text-xl sm:text-2xl font-black text-text font-bengali mb-1 group-hover:text-primary transition-colors leading-tight">
                          {category.nameBn || category.name}
                        </h2>
                      </Link>

                      {category.name && category.name !== category.nameBn && (
                        <p className="text-xs font-medium text-text-muted/80 font-sans tracking-wide uppercase mb-3">
                          {category.name}
                        </p>
                      )}

                      {/* Description */}
                      <p className="text-sm text-text-muted font-bengali leading-relaxed mb-6 line-clamp-2">
                        {category.description ||
                          "এই বিভাগের সকল প্রয়োজনীয় লাইভ ও রেকর্ডেড ক্লাস, এক্সাম ও প্রস্তুতি সামগ্রী।"}
                      </p>

                      {/* Real Published Courses Showcase inside this category */}
                      <div className="mt-auto border-t border-border/70 pt-4 mb-6">
                        <h3 className="text-xs font-bold text-text-muted uppercase tracking-wider mb-3 flex items-center justify-between">
                          <span className="font-bengali">উপলব্ধ কোর্সসমূহ</span>
                          <span className="font-sans text-[11px] text-text-muted/70">
                            {category.courseCount} courses
                          </span>
                        </h3>

                        {category.courses.length > 0 ? (
                          <div className="space-y-2">
                            {category.courses.map((course) => (
                              <Link
                                key={course.id}
                                href={`/course/${course.slug}`}
                                className="group/item flex items-center justify-between p-2.5 rounded-xl bg-surface-secondary/70 hover:bg-surface-secondary border border-border/60 hover:border-primary/40 transition-all"
                              >
                                <span className="text-xs sm:text-sm font-semibold font-bengali text-text group-hover/item:text-primary transition-colors line-clamp-1 pr-2">
                                  {course.titleBn || course.title}
                                </span>
                                <div className="flex items-center gap-1.5 shrink-0">
                                  <span className="text-[11px] font-bold px-2 py-0.5 rounded-md bg-primary/10 text-primary font-bengali">
                                    {course.price && course.price > 0
                                      ? `৳${formatBengaliNumber(course.price)}`
                                      : "ফ্রি"}
                                  </span>
                                  <ArrowRight className="w-3.5 h-3.5 text-text-muted group-hover/item:text-primary group-hover/item:translate-x-0.5 transition-all" />
                                </div>
                              </Link>
                            ))}
                          </div>
                        ) : (
                          <div className="p-3.5 rounded-xl bg-surface-secondary/40 border border-border/50 text-center">
                            <p className="text-xs text-text-muted font-bengali">
                              নতুন ও আপডেটেড কোর্স তৈরির কাজ চলছে। দ্রুতই যুক্ত হবে!
                            </p>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Bottom Action CTA Button */}
                    <div className="relative z-10 p-5 sm:p-6 pt-0 mt-auto">
                      <Link
                        href={`/category/${category.slug}`}
                        className="w-full py-2.5 px-4 rounded-xl font-bengali text-sm font-bold flex items-center justify-center gap-2 transition-all duration-200 bg-surface-secondary hover:bg-primary text-text hover:text-white border border-border hover:border-primary shadow-xs group-hover:shadow-md"
                      >
                        <span>ক্যাটাগরির কোর্সসমূহ দেখুন</span>
                        <ArrowRight className="w-4 h-4 transition-transform duration-200 group-hover:translate-x-1" />
                      </Link>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          ) : (
            /* Empty Search State */
            <div className="text-center py-16 px-4 rounded-2xl border border-dashed border-border bg-surface/40 max-w-lg mx-auto">
              <div className="w-14 h-14 rounded-full bg-primary/10 text-primary flex items-center justify-center mx-auto mb-4">
                <Search className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-text font-bengali mb-2">
                কোনো ক্যাটাগরি খুঁজে পাওয়া যায়নি
              </h3>
              <p className="text-sm text-text-muted font-bengali mb-5 leading-relaxed">
                &ldquo;{searchQuery}&rdquo; দিয়ে কোনো বিভাগ বা কোর্স মিলছে না। ফিল্টার পরিবর্তন করে পুনরায় চেষ্টা করুন।
              </p>
              <button
                onClick={() => {
                  setSearchQuery("");
                  setFilterMode("all");
                }}
                className="btn btn-outline btn-sm font-bengali font-semibold"
              >
                ফিল্টার রিসেট করুন
              </button>
            </div>
          )}

          {/* Bottom Advisory / Assistance Banner */}
          <div className="mt-16 sm:mt-20 relative overflow-hidden rounded-2xl sm:rounded-3xl border border-border/80 bg-gradient-to-r from-surface via-surface-secondary to-surface dark:from-slate-900/90 dark:via-slate-800/90 dark:to-slate-900/90 p-8 sm:p-10 lg:p-12 shadow-sm">
            <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-6 sm:gap-8">
              <div className="max-w-xl text-center md:text-left">
                <span className="inline-flex items-center gap-1.5 text-xs font-bold text-primary font-bengali px-2.5 py-1 rounded-md bg-primary/10 mb-3">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  কোর্স সহায়তা ও কাউন্সেলিং
                </span>
                <h3 className="text-xl sm:text-2xl lg:text-3xl font-black text-text font-bengali tracking-tight mb-2">
                  আপনার কাঙ্ক্ষিত কোর্স খুঁজে পাচ্ছেন না?
                </h3>
                <p className="text-sm sm:text-base text-text-muted font-bengali leading-relaxed">
                  কোন কোর্সটি আপনার লক্ষ্য পূরণে সবচেয়ে উপযোগী তা নিয়ে দ্বিধায় থাকলে আমাদের
                  অ্যাকাডেমিক কাউন্সেলরের সাথে কথা বলুন অথবা সরাসরি মেসেজ দিন।
                </p>
              </div>

              <div className="flex flex-col sm:flex-row items-center gap-3 shrink-0 w-full sm:w-auto">
                <Link
                  href="/free-resources"
                  className="w-full sm:w-auto px-5 py-2.5 rounded-xl font-bengali text-sm font-bold bg-surface-secondary hover:bg-surface border border-border text-text transition-all text-center"
                >
                  ফ্রি রিসোর্স দেখুন
                </Link>
                <Link
                  href="/contact"
                  className="w-full sm:w-auto px-5 py-2.5 rounded-xl font-bengali text-sm font-bold bg-primary hover:bg-primary-hover text-white shadow-md hover:shadow-lg transition-all text-center flex items-center justify-center gap-2"
                >
                  <span>যোগাযোগ করুন</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
