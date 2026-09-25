"use client";

import { useState, useMemo, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import {
  Search,
  BookOpen,
  Sparkles,
  X,
  GraduationCap,
  ArrowUpDown,
  RefreshCw,
  Flame,
} from "lucide-react";
import { CourseCard } from "@/components/courses/course-card";
import { createClient } from "@/lib/supabase/client";
import { mapDbCourseToAppCourse } from "@/lib/supabase/course-mapper";
import { type Course } from "@/lib/data/courses";

export interface DbCategoryItem {
  id: number;
  slug: string;
  nameBn: string;
  name: string;
}

interface CoursesClientProps {
  initialCourses?: Course[];
  initialCategories?: DbCategoryItem[];
}

export function CoursesClient({
  initialCourses = [],
  initialCategories = [],
}: CoursesClientProps) {
  const searchParams = useSearchParams();
  const filterParam = searchParams.get("filter");
  const popularParam = searchParams.get("popular");
  const isPopularInitial = filterParam === "popular" || popularParam === "true";

  const [courses, setCourses] = useState<Course[]>(initialCourses);
  const [categories, setCategories] = useState<DbCategoryItem[]>(initialCategories);
  const [isLoading, setIsLoading] = useState(initialCourses.length === 0);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [sortBy, setSortBy] = useState<string>("popular");
  const [onlyPopular, setOnlyPopular] = useState(isPopularInitial);

  useEffect(() => {
    if (isPopularInitial) {
      setOnlyPopular(true);
    }
  }, [isPopularInitial]);

  // Sync if server initial data changes
  useEffect(() => {
    if (initialCourses.length > 0) {
      setCourses(initialCourses);
      setIsLoading(false);
    }
  }, [initialCourses]);

  useEffect(() => {
    if (initialCategories.length > 0) {
      setCategories(initialCategories);
    }
  }, [initialCategories]);

  // Live Refresh function from Supabase
  const refreshCourses = async () => {
    const supabase = createClient();
    try {
      const [courseRes, catRes] = await Promise.all([
        supabase
          .from("courses")
          .select(`
            *,
            categories:category_id (id, name, name_bn, slug),
            instructors:instructor_id (id, name, name_bn, institution)
          `)
          .eq("status", "published")
          .order("created_at", { ascending: false }),
        supabase
          .from("categories")
          .select("id, slug, name_bn, name, display_order, is_published")
          .eq("is_published", true)
          .order("display_order", { ascending: true }),
      ]);

      if (courseRes.data) {
        setCourses(courseRes.data.map(mapDbCourseToAppCourse));
      }

      if (catRes.data) {
        setCategories(
          catRes.data.map((c) => ({
            id: c.id,
            slug: c.slug,
            nameBn: c.name_bn || c.name,
            name: c.name,
          }))
        );
      }
    } catch (err) {
      console.error("Live courses refresh error:", err);
    } finally {
      setIsLoading(false);
    }
  };

  // Initial client fetch if SSR had empty data
  useEffect(() => {
    if (initialCourses.length === 0) {
      setIsLoading(true);
      refreshCourses();
    }
  }, []);

  // Realtime subscription connected to Admin Panel
  useEffect(() => {
    const supabase = createClient();
    const channel = supabase
      .channel("courses_client_realtime")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "courses" },
        () => {
          refreshCourses();
        }
      )
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "categories" },
        () => {
          refreshCourses();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const filteredCourses = useMemo(() => {
    return courses
      .filter((course) => {
        // Search match
        const query = searchQuery.toLowerCase().trim();
        const matchesSearch =
          !query ||
          course.title.toLowerCase().includes(query) ||
          course.titleBn.toLowerCase().includes(query) ||
          course.subtitleBn.toLowerCase().includes(query);

        // Category match
        const matchesCategory =
          selectedCategory === "all" || course.categorySlug === selectedCategory;

        // Popular filter (admin-marked popular/featured courses)
        const matchesPopular = !onlyPopular || !!course.isFeatured;

        return matchesSearch && matchesCategory && matchesPopular;
      })
      .sort((a, b) => {
        if (sortBy === "popular") return (b.enrolledCount || 0) - (a.enrolledCount || 0);
        if (sortBy === "rating") return (b.rating || 0) - (a.rating || 0);
        if (sortBy === "price-low") return a.price - b.price;
        if (sortBy === "price-high") return b.price - a.price;
        if (sortBy === "newest") return Number(b.id) - Number(a.id);
        return 0;
      });
  }, [courses, searchQuery, selectedCategory, sortBy, onlyPopular]);

  const resetFilters = () => {
    setSearchQuery("");
    setSelectedCategory("all");
    setOnlyPopular(false);
    setSortBy("popular");
  };

  return (
    <div className="bg-background min-h-screen pt-24 pb-12 sm:pt-28 sm:pb-14 lg:pt-32 lg:pb-16">
      <div className="container-main">
        {/* Page Header matching Home UI aesthetics */}
        <div className="max-w-3xl mb-8 sm:mb-10">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-black font-bengali mb-3.5 shadow-2xs">
            <BookOpen className="w-3.5 h-3.5" />
            <span>সকল অনলাইন কোর্স</span>
          </div>
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black text-text font-bengali leading-snug mb-2.5 sm:mb-3">
            আপনার অ্যাকাডেমিক ও ক্যারিয়ার লক্ষ্য অর্জনে{" "}
            <span className="text-primary font-black">
              সেরা কোর্স
            </span>
          </h1>
          <p className="text-text-muted text-sm sm:text-base font-bengali leading-relaxed">
            দেশসেরা শিক্ষক ও মেন্টরদের তত্ত্বাবধানে পরিচালিত সর্বোচ্চ মানের লাইভ ও রেকর্ডেড প্রস্তুতি কোর্সসমূহ।
          </p>
        </div>

        {/* Filter & Search Bar Container */}
        <div className="bg-surface rounded-2xl sm:rounded-3xl border border-border/80 p-4 sm:p-6 mb-8 shadow-sm">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-3 sm:gap-4">
            {/* Search Input */}
            <div className="md:col-span-6 relative">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted pointer-events-none" />
              <input
                type="text"
                placeholder="কোর্স বা বিষয়ের নাম খুঁজুন..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="input pl-10 pr-9 text-xs sm:text-sm font-bengali w-full rounded-xl"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery("")}
                  className="absolute right-3 top-1/2 -translate-y-1/2 p-1 rounded-full text-text-muted hover:text-text hover:bg-surface-secondary transition-colors"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            {/* Category Dropdown (Syncs with Pills) */}
            <div className="md:col-span-3 relative">
              <select
                value={selectedCategory}
                onChange={(e) => {
                  setSelectedCategory(e.target.value);
                  setOnlyPopular(false);
                }}
                className="input text-xs sm:text-sm font-bengali w-full rounded-xl cursor-pointer"
              >
                <option value="all">সকল বিভাগ (All Categories)</option>
                {categories.map((c) => (
                  <option key={c.slug} value={c.slug}>
                    {c.nameBn}
                  </option>
                ))}
              </select>
            </div>

            {/* Sort Dropdown */}
            <div className="md:col-span-3 relative">
              <div className="relative flex items-center">
                <ArrowUpDown className="absolute left-3.5 pointer-events-none w-3.5 h-3.5 text-text-muted" />
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="input pl-9 text-xs sm:text-sm font-bengali w-full rounded-xl cursor-pointer"
                >
                  <option value="popular">জনপ্রিয়তা অনুযায়ী</option>
                  <option value="newest">নতুন কোর্স (Newest)</option>
                  <option value="price-low">মূল্য: কম থেকে বেশি</option>
                  <option value="price-high">মূল্য: বেশি থেকে কম</option>
                  <option value="rating">সর্বোচ্চ রেটিং</option>
                </select>
              </div>
            </div>
          </div>

          {/* Category Pills (Home UI matching style with smooth active states) */}
          <div className="flex items-center gap-2 overflow-x-auto pt-4 mt-4 border-t border-border/60 no-scrollbar pb-1">
            {/* All Courses Button */}
            <button
              type="button"
              onClick={() => {
                setSelectedCategory("all");
                setOnlyPopular(false);
              }}
              className={`px-4 py-1.5 rounded-full text-xs font-bold whitespace-nowrap transition-all font-bengali shrink-0 cursor-pointer ${
                selectedCategory === "all" && !onlyPopular
                  ? "bg-primary text-white shadow-xs scale-102 ring-2 ring-primary/30"
                  : "bg-surface-secondary text-text-muted hover:text-text hover:bg-surface-secondary/80 border border-border/60"
              }`}
            >
              সব কোর্স ({courses.length})
            </button>

            {/* Popular Featured Filter Pill */}
            <button
              type="button"
              onClick={() => setOnlyPopular(!onlyPopular)}
              className={`px-4 py-1.5 rounded-full text-xs font-bold whitespace-nowrap transition-all font-bengali flex items-center gap-1.5 shrink-0 cursor-pointer ${
                onlyPopular
                  ? "bg-amber-500 text-white shadow-xs scale-102 ring-2 ring-amber-500/40"
                  : "bg-surface-secondary text-text-muted hover:text-amber-500 hover:bg-amber-500/10 border border-border/60"
              }`}
            >
              <Flame className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
              <span>জনপ্রিয় কোর্স</span>
              {onlyPopular && <X className="w-3 h-3 ml-0.5" />}
            </button>

            {/* Real Category Pills directly from Supabase */}
            {categories.map((cat) => {
              const isActive = selectedCategory === cat.slug && !onlyPopular;
              return (
                <button
                  key={cat.slug}
                  type="button"
                  onClick={() => {
                    setSelectedCategory(cat.slug);
                    setOnlyPopular(false);
                  }}
                  className={`px-4 py-1.5 rounded-full text-xs font-bold whitespace-nowrap transition-all font-bengali shrink-0 cursor-pointer ${
                    isActive
                      ? "bg-primary text-white shadow-xs scale-102 ring-2 ring-primary/30"
                      : "bg-surface-secondary text-text-muted hover:text-text hover:bg-surface-secondary/80 border border-border/60"
                  }`}
                >
                  {cat.nameBn}
                </button>
              );
            })}
          </div>
        </div>

        {/* Results Info Bar */}
        <div className="flex items-center justify-between text-xs sm:text-sm text-text-muted mb-6 font-bengali">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-text">
              মোট {filteredCourses.length}টি কোর্স
            </span>
            <span>পাওয়া গেছে</span>
          </div>

          {(searchQuery || selectedCategory !== "all" || onlyPopular || sortBy !== "popular") && (
            <button
              type="button"
              onClick={resetFilters}
              className="text-xs text-primary font-bold hover:underline cursor-pointer flex items-center gap-1"
            >
              <span>ফিল্টার রিসেট করুন</span>
              <X className="w-3 h-3" />
            </button>
          )}
        </div>

        {/* Course Grid with exact Home UI design and zero mock data */}
        {isLoading ? (
          <div className="bg-surface rounded-2xl border border-border p-14 text-center text-xs text-text-muted font-bengali shadow-xs">
            <RefreshCw className="w-6 h-6 mx-auto mb-2.5 animate-spin text-primary" />
            কোর্সসমূহ লোড হচ্ছে...
          </div>
        ) : filteredCourses.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-7">
            {filteredCourses.map((course) => (
              <CourseCard key={course.id} course={course} />
            ))}
          </div>
        ) : (
          <div className="bg-surface rounded-2xl sm:rounded-3xl border border-border p-12 text-center max-w-md mx-auto shadow-xs">
            <GraduationCap className="w-12 h-12 text-text-muted/40 mx-auto mb-3" />
            <h3 className="text-base sm:text-lg font-bold text-text font-bengali mb-1.5">
              কোনো কোর্স পাওয়া যায়নি
            </h3>
            <p className="text-xs sm:text-sm text-text-muted font-bengali mb-5 leading-relaxed">
              আপনার খোঁজার সাথে মেলে এমন কোনো প্রকাশিত কোর্স এই মুহূর্তে নেই। ভিন্ন কোনো শব্দ দিয়ে চেষ্টা করুন।
            </p>
            <button
              type="button"
              onClick={resetFilters}
              className="btn btn-primary btn-sm font-bengali font-bold px-4 cursor-pointer"
            >
              সকল কোর্স দেখুন
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
