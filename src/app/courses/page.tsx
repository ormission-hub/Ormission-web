"use client";

import { useState, useMemo, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { Search, BookOpen, Sparkles, X } from "lucide-react";
import { CourseCard } from "@/components/courses/course-card";
import { COURSES, type Course } from "@/lib/data/courses";
import { CATEGORIES } from "@/lib/data/categories";
import { createClient } from "@/lib/supabase/client";
import { mapDbCourseToAppCourse } from "@/lib/supabase/course-mapper";

function CoursesContent() {
  const searchParams = useSearchParams();
  const filterParam = searchParams.get("filter");
  const popularParam = searchParams.get("popular");
  const isPopularInitial = filterParam === "popular" || popularParam === "true";

  const [courses, setCourses] = useState<Course[]>(COURSES);
  const [categories, setCategories] = useState<{ slug: string; nameBn: string }[]>(CATEGORIES);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [selectedLevel, setSelectedLevel] = useState<string>("all");
  const [sortBy, setSortBy] = useState<string>("popular");
  const [onlyPopular, setOnlyPopular] = useState(isPopularInitial);
  const [dbCourseSlugs, setDbCourseSlugs] = useState<Set<string>>(new Set());

  useEffect(() => {
    if (isPopularInitial) {
      setOnlyPopular(true);
    }
  }, [isPopularInitial]);

  useEffect(() => {
    const supabase = createClient();

    async function loadLiveData() {
      try {
        const [courseRes, catRes] = await Promise.all([
          supabase
            .from("courses")
            .select(`
              *,
              categories:category_id (*),
              instructors:instructor_id (*)
            `)
            .eq("status", "published")
            .order("created_at", { ascending: false }),
          supabase
            .from("categories")
            .select("slug, name_bn, name")
            .eq("is_published", true)
            .order("display_order", { ascending: true }),
        ]);

        if (courseRes.data && courseRes.data.length > 0) {
          const dbMapped = courseRes.data.map(mapDbCourseToAppCourse);
          const dbSlugs = new Set(dbMapped.map((c) => c.slug));
          setDbCourseSlugs(dbSlugs);
          const remainingStatic = COURSES.filter((c) => !dbSlugs.has(c.slug));
          setCourses([...dbMapped, ...remainingStatic]);
        }

        if (catRes.data && catRes.data.length > 0) {
          setCategories(
            catRes.data.map((c) => ({
              slug: c.slug,
              nameBn: c.name_bn || c.name,
            }))
          );
        }
      } catch (err) {
        console.error("Error loading live courses:", err);
      }
    }

    loadLiveData();
  }, []);

  const filteredCourses = useMemo(() => {
    return courses.filter((course) => {
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

      // Level match
      const matchesLevel =
        selectedLevel === "all" || course.level === selectedLevel;

      // Popular filter (admin-marked popular courses)
      let matchesPopular = true;
      if (onlyPopular) {
        const hasDbPopular = courses.some(c => c.isFeatured && dbCourseSlugs.has(c.slug));
        if (hasDbPopular) {
          matchesPopular = !!course.isFeatured && dbCourseSlugs.has(course.slug);
        } else {
          matchesPopular = !!course.isFeatured;
        }
      }

      return matchesSearch && matchesCategory && matchesLevel && matchesPopular;
    }).sort((a, b) => {
      if (sortBy === "popular") return b.enrolledCount - a.enrolledCount;
      if (sortBy === "rating") return b.rating - a.rating;
      if (sortBy === "price-low") return a.price - b.price;
      if (sortBy === "price-high") return b.price - a.price;
      return 0;
    });
  }, [courses, searchQuery, selectedCategory, selectedLevel, sortBy, onlyPopular, dbCourseSlugs]);

  return (
    <div className="bg-background min-h-screen py-10 lg:py-14">
      <div className="container-main">
        {/* Page Header */}
        <div className="max-w-3xl mb-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-semibold font-bengali mb-3">
            <BookOpen className="w-3.5 h-3.5" />
            <span>সকল অনলাইন কোর্স</span>
          </div>
          <h1 className="text-3xl lg:text-4xl font-bold text-text font-bengali tracking-tight mb-3">
            আপনার অ্যাকাডেমিক ও ক্যারিয়ার লক্ষ্য অর্জনে সেরা কোর্স
          </h1>
          <p className="text-text-muted text-base lg:text-lg font-bengali">
            দেশসেরা বিশ্ববিদ্যালয় ও মেডিকেল কলেজের অভিজ্ঞ ইন্সট্রাক্টরদের তত্ত্বাবধানে সাজানো কোর্সসমূহ।
          </p>
        </div>

        {/* Filter & Search Bar */}
        <div className="bg-surface rounded-lg border border-border p-4 mb-8 shadow-xs">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
            {/* Search Input */}
            <div className="md:col-span-5 relative">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted" />
              <input
                type="text"
                placeholder="কোর্স বা বিষয়ের নাম খুঁজুন..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="input pl-10 text-sm font-bengali w-full"
              />
            </div>

            {/* Category Dropdown */}
            <div className="md:col-span-3">
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="input text-sm font-bengali w-full"
              >
                <option value="all">সকল বিভাগ (All Categories)</option>
                {categories.map((cat) => (
                  <option key={cat.slug} value={cat.slug}>
                    {cat.nameBn}
                  </option>
                ))}
              </select>
            </div>

            {/* Level Dropdown */}
            <div className="md:col-span-2">
              <select
                value={selectedLevel}
                onChange={(e) => setSelectedLevel(e.target.value)}
                className="input text-sm font-bengali w-full"
              >
                <option value="all">সকল লেভেল</option>
                <option value="Beginner">বিগিনার (Beginner)</option>
                <option value="Intermediate">ইন্টারমিডিয়েট</option>
                <option value="Advanced">অ্যাডভান্সড</option>
              </select>
            </div>

            {/* Sort Dropdown */}
            <div className="md:col-span-2">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="input text-sm font-bengali w-full"
              >
                <option value="popular">জনপ্রিয়তা অনুযায়ী</option>
                <option value="rating">সর্বোচ্চ রেটিং</option>
                <option value="price-low">মূল্য: কম থেকে বেশি</option>
                <option value="price-high">মূল্য: বেশি থেকে কম</option>
              </select>
            </div>
          </div>

          {/* Quick Category Chips */}
          <div className="flex items-center gap-2 overflow-x-auto pt-4 mt-4 border-t border-border no-scrollbar">
            <button
              onClick={() => setOnlyPopular(!onlyPopular)}
              className={`px-3 py-1 rounded text-xs font-bold whitespace-nowrap transition-colors font-bengali flex items-center gap-1.5 ${
                onlyPopular
                  ? "bg-amber-500 text-white shadow-sm ring-2 ring-amber-500/30"
                  : "bg-surface-secondary text-text-muted hover:text-text"
              }`}
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>জনপ্রিয় কোর্স</span>
              {onlyPopular && <X className="w-3 h-3 ml-0.5" />}
            </button>
            <button
              onClick={() => {
                setSelectedCategory("all");
                setOnlyPopular(false);
              }}
              className={`px-3 py-1 rounded text-xs font-semibold whitespace-nowrap transition-colors font-bengali ${
                selectedCategory === "all"
                  ? "bg-primary text-white"
                  : "bg-surface-secondary text-text-muted hover:text-text"
              }`}
            >
              সব কোর্স ({courses.length})
            </button>
            {categories.map((cat) => (
              <button
                key={cat.slug}
                onClick={() => setSelectedCategory(cat.slug)}
                className={`px-3 py-1 rounded text-xs font-semibold whitespace-nowrap transition-colors font-bengali ${
                  selectedCategory === cat.slug
                    ? "bg-primary text-white"
                    : "bg-surface-secondary text-text-muted hover:text-text"
                }`}
              >
                {cat.nameBn}
              </button>
            ))}
          </div>
        </div>

        {/* Popular Filter Active Banner */}
        {onlyPopular && (
          <div className="mb-6 p-4 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-between gap-3 font-bengali">
            <div className="flex items-center gap-2 text-amber-700 dark:text-amber-400 font-bold text-sm">
              <Sparkles className="w-4 h-4 shrink-0" />
              <span>অ্যাডমিন প্যানেল থেকে জনপ্রিয় করা কোর্সসমূহ প্রদর্শিত হচ্ছে</span>
            </div>
            <button
              type="button"
              onClick={() => setOnlyPopular(false)}
              className="text-xs px-3 py-1.5 rounded-xl bg-amber-500 text-white font-bold hover:bg-amber-600 transition-colors shrink-0 shadow-xs"
            >
              সকল কোর্স দেখুন
            </button>
          </div>
        )}

        {/* Results Info */}
        <div className="flex items-center justify-between text-sm text-text-muted mb-6 font-bengali">
          <span>মোট {filteredCourses.length}টি কোর্স পাওয়া গেছে</span>
          {(searchQuery || selectedCategory !== "all" || selectedLevel !== "all") && (
            <button
              onClick={() => {
                setSearchQuery("");
                setSelectedCategory("all");
                setSelectedLevel("all");
              }}
              className="text-xs text-primary font-medium hover:underline"
            >
              সব ফিল্টার রিসেট করুন
            </button>
          )}
        </div>

        {/* Course Grid */}
        {filteredCourses.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredCourses.map((course) => (
              <CourseCard key={course.id} course={course} />
            ))}
          </div>
        ) : (
          <div className="bg-surface rounded-lg border border-border p-12 text-center max-w-md mx-auto">
            <BookOpen className="w-12 h-12 text-text-muted/40 mx-auto mb-4" />
            <h3 className="text-lg font-bold text-text font-bengali mb-2">কোনো কোর্স পাওয়া যায়নি</h3>
            <p className="text-sm text-text-muted font-bengali mb-6">
              আপনার খোঁজার সাথে মেলে এমন কোনো কোর্স এই মুহূর্তে নেই। ভিন্ন কোনো কি-ওয়ার্ড দিয়ে চেষ্টা করুন।
            </p>
            <button
              onClick={() => {
                setSearchQuery("");
                setSelectedCategory("all");
                setSelectedLevel("all");
              }}
              className="btn btn-primary btn-sm font-bengali"
            >
              সকল কোর্স দেখুন
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
export default function CoursesPage() {
  return (
    <Suspense fallback={<div className="container-main py-16 text-center text-text-muted font-bengali">কোর্সসমূহ লোড হচ্ছে...</div>}>
      <CoursesContent />
    </Suspense>
  );
}
