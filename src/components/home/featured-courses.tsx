"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { ArrowRight, Users, Sparkles } from "lucide-react";
import { SectionWrapper } from "@/components/global/section-wrapper";
import { SectionHeading } from "@/components/global/section-heading";
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
}

// Fallback backup if offline
const fallbackCourses: DbFeaturedCourse[] = [
  {
    id: 4,
    slug: "cu-du-admission-english-masterclass",
    title_bn: "CU, DU ও গুচ্ছ এডমিশন English: ১৫ মার্ক নিশ্চিতকরণ স্পেশাল কোর্স",
    title: "CU, DU & GST Admission English",
    price: 1499,
    original_price: 2999,
    enrollment_count: 2450,
    categories: { name_bn: "এডমিশন ইংলিশ", slug: "university-admission" },
    instructors: { name_bn: "ওহিদ রাশেদ (CU Law)" },
  },
  {
    id: 5,
    slug: "admission-question-bank-shortcut-hacks",
    title_bn: "বিগত ২০ বছরের প্রশ্নব্যাংক অ্যানালাইসিস ও শর্টকাট সলভিং কোর্স",
    title: "Past 20 Years Question Bank Analysis",
    price: 1699,
    original_price: 3499,
    enrollment_count: 3120,
    categories: { name_bn: "প্রশ্নব্যাংক সমাধান", slug: "hsc-science" },
    instructors: { name_bn: "ওহিদ রাশেদ ও মেন্টর প্যানেল" },
  },
  {
    id: 6,
    slug: "hsc-humanities-top-300-mcq-bundle",
    title_bn: "HSC মানবিক Top 300+ MCQ ও ১০০% কমন সাজেশন (সমাজবিজ্ঞান ও সমাজকর্ম)",
    title: "HSC Humanities Top 300+ MCQ",
    price: 999,
    original_price: 1999,
    enrollment_count: 5120,
    categories: { name_bn: "এইচএসসি মানবিক", slug: "hsc-arts" },
    instructors: { name_bn: "ওহিদ রাশেদ" },
  },
  {
    id: 7,
    slug: "medical-admission-biology-special",
    title_bn: "মেডিকেল ভর্তি পূর্ণাঙ্গ জীববিজ্ঞান ও কনসেপ্ট ক্লিয়ারিং মাস্টারক্লাস",
    title: "Medical Admission Biology Masterclass",
    price: 1999,
    original_price: 3999,
    enrollment_count: 2680,
    categories: { name_bn: "মেডিকেল ভর্তি", slug: "medical-admission" },
    instructors: { name_bn: "ড. ফারহানা ইসলাম (DMC)" },
  },
  {
    id: 8,
    slug: "buet-engineering-physics-math",
    title_bn: "বুয়েট ও ইঞ্জিনিয়ারিং ভর্তি — পদার্থবিজ্ঞান ও উচ্চতর গণিত কনসেপ্ট ক্লিয়ারিং",
    title: "BUET & Engineering Admission",
    price: 2499,
    original_price: 4999,
    enrollment_count: 1840,
    categories: { name_bn: "ইঞ্জিনিয়ারিং ভর্তি", slug: "hsc-science" },
    instructors: { name_bn: "ইঞ্জি. সাইফুল আলম (BUET)" },
  },
  {
    id: 9,
    slug: "admission-self-study-14hr-routine",
    title_bn: "কোচিং ছাড়া ঘরে বসে এডমিশন সেলফ-স্টাডি ও ১৪ ঘণ্টার স্টাডি রুটিন মেন্টরশিপ",
    title: "Self-Study Admission Mentorship",
    price: 799,
    original_price: 1599,
    enrollment_count: 6340,
    categories: { name_bn: "এডমিশন গাইডলাইন", slug: "job-preparation" },
    instructors: { name_bn: "ওহিদ রাশেদ" },
  },
];

function CourseCard({ course }: { course: DbFeaturedCourse }) {
  const price = course.price;
  const originalPrice = course.original_price;
  const discount = originalPrice && originalPrice > price
    ? Math.round(((originalPrice - price) / originalPrice) * 100)
    : 0;

  const title = course.title_bn || course.title;

  const instructor = Array.isArray(course.instructors)
    ? course.instructors[0]?.name_bn || course.instructors[0]?.name
    : course.instructors?.name_bn || course.instructors?.name || "অভিজ্ঞ মেন্টর প্যানেল";

  const categoryName = Array.isArray(course.categories)
    ? course.categories[0]?.name_bn || course.categories[0]?.name
    : course.categories?.name_bn || course.categories?.name || "স্পেশাল কোর্স";

  const enrolled = course.enrollment_count || 1200;

  return (
    <Link
      href={`/course/${course.slug}`}
      className={cn(
        "group flex flex-col bg-surface border border-border rounded-2xl overflow-hidden transition-all duration-300",
        "hover:shadow-lg hover:border-primary/40 hover:-translate-y-1"
      )}
    >
      {/* Thumbnail Header */}
      <div className="relative aspect-video w-full bg-slate-900 overflow-hidden">
        {course.thumbnail_url ? (
          <Image
            src={course.thumbnail_url}
            alt={title}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            className="object-cover group-hover:scale-105 transition-transform duration-300"
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-primary/15 via-surface-secondary to-secondary/15 flex items-center justify-center p-4">
            <div className="w-12 h-12 rounded-2xl bg-surface/80 backdrop-blur-xs border border-border flex items-center justify-center shadow-xs group-hover:scale-110 transition-transform">
              <Sparkles className="w-6 h-6 text-primary" />
            </div>
          </div>
        )}
        {discount > 0 && (
          <span className="absolute top-3 left-3 px-2.5 py-0.5 text-[11px] font-bold rounded-full bg-accent text-white shadow-xs font-bengali z-10">
            {discount}% ছাড়
          </span>
        )}
        <span className="absolute bottom-3 left-3 px-2.5 py-0.5 text-[11px] font-bold rounded-full bg-black/60 backdrop-blur-xs text-white border border-white/20 font-bengali z-10">
          {categoryName}
        </span>
      </div>

      {/* Content */}
      <div className="flex flex-col flex-1 p-5">
        <h3 className="text-sm sm:text-base font-bold text-text line-clamp-2 mb-2 font-bengali group-hover:text-primary transition-colors leading-snug">
          {title}
        </h3>
        <p className="text-xs text-text-muted mb-3 font-bengali">{instructor}</p>

        {/* Enrollment count */}
        <div className="flex items-center gap-1.5 text-xs text-text-muted mb-4 font-bengali">
          <Users className="w-3.5 h-3.5 text-secondary" />
          <span>{enrolled.toLocaleString("bn-BD")} জন ভর্তি হয়েছেন</span>
        </div>

        {/* Price */}
        <div className="mt-auto pt-3 border-t border-border/60 flex items-baseline justify-between">
          <div className="flex items-baseline gap-2">
            <span className="text-lg font-extrabold text-text font-bengali">
              ৳{price.toLocaleString("bn-BD")}
            </span>
            {originalPrice && originalPrice > price && (
              <span className="text-xs text-text-muted line-through font-bengali">
                ৳{originalPrice.toLocaleString("bn-BD")}
              </span>
            )}
          </div>
          <span className="text-xs font-bold text-primary group-hover:translate-x-1 transition-transform inline-flex items-center gap-1 font-bengali">
            বিস্তারিত <ArrowRight className="w-3 h-3" />
          </span>
        </div>
      </div>
    </Link>
  );
}

export function FeaturedCourses({ initialCourses }: { initialCourses?: DbFeaturedCourse[] }) {
  const [courses, setCourses] = useState<DbFeaturedCourse[]>(() => {
    if (initialCourses && initialCourses.length > 0) return initialCourses;
    return fallbackCourses;
  });

  useEffect(() => {
    const supabase = createClient();

    async function loadDbCourses() {
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
            categories:category_id (id, name, name_bn, slug),
            instructors:instructor_id (id, name, name_bn, institution)
          `)
          .eq("status", "published")
          .eq("is_featured", true)
          .order("created_at", { ascending: false });

        if (!error && data && data.length > 0) {
          setCourses(data);
        }
      } catch (err) {
        console.error("Error fetching live featured courses:", err);
      }
    }

    loadDbCourses();

    // Listen for realtime course changes (create, update, delete)
    const channel = supabase
      .channel("courses-changes")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "courses" },
        () => {
          loadDbCourses();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  return (
    <SectionWrapper className="bg-surface-secondary">
      <div className="flex items-center justify-between mb-8 lg:mb-10">
        <SectionHeading
          title="জনপ্রিয় কোর্সসমূহ"
          subtitle="বিশ্ববিদ্যালয় ভর্তি ও বোর্ড পরীক্ষার সবচেয়ে বেশি শিক্ষার্থীদের পছন্দের সেরা কোর্সসমূহ"
          centered={false}
          className="mb-0"
        />
        <Link
          href="/courses"
          className="hidden sm:inline-flex items-center gap-1 text-xs sm:text-sm font-bold text-primary hover:text-primary-hover transition-colors font-bengali"
        >
          সব কোর্স দেখুন
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 lg:gap-6">
        {courses.map((course) => (
          <CourseCard key={course.id || course.slug} course={course} />
        ))}
      </div>

      <div className="mt-6 text-center sm:hidden">
        <Link
          href="/courses"
          className="inline-flex items-center gap-1 text-sm font-bold text-primary font-bengali"
        >
          সব কোর্স দেখুন
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    </SectionWrapper>
  );
}

