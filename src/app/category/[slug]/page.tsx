import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, BookOpen } from "lucide-react";
import { getCategoryBySlug, CATEGORIES } from "@/lib/data/categories";
import { COURSES } from "@/lib/data/courses";
import { CourseCard } from "@/components/courses/course-card";

interface PageProps {
  params: Promise<{ slug: string }>;
}

import { getCategoryWithCourses } from "@/lib/supabase/course-fetcher";

export const dynamic = "force-dynamic";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: PageProps) {
  const { slug } = await params;
  const { category } = await getCategoryWithCourses(slug);

  if (!category) {
    return { title: "ক্যাটাগরি পাওয়া যায়নি" };
  }

  return {
    title: `${category.nameBn} — অনলাইন কোর্সসমূহ | Ormission`,
    description: category.description,
  };
}

export default async function CategoryDetailPage({ params }: PageProps) {
  const { slug } = await params;
  const { category, courses } = await getCategoryWithCourses(slug);

  if (!category) {
    notFound();
  }

  return (
    <div className="bg-background min-h-screen py-10 lg:py-14">
      <div className="container-main">
        {/* Back Link */}
        <Link
          href="/categories"
          className="inline-flex items-center gap-1.5 text-xs text-text-muted hover:text-primary mb-6 transition-colors font-bengali"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>সকল ক্যাটাগরিতে ফিরে যান</span>
        </Link>

        {/* Header Banner */}
        <div className="bg-surface rounded-lg border border-border p-6 lg:p-8 mb-10">
          <div className="max-w-2xl">
            <span className="text-xs font-semibold px-2.5 py-1 rounded bg-primary/10 text-primary font-bengali inline-block mb-3">
              শিক্ষা বিভাগ
            </span>
            <h1 className="text-2xl lg:text-3xl font-bold text-text font-bengali mb-2">
              {category.nameBn}
            </h1>
            <p className="text-xs text-text-muted font-sans font-medium mb-3">
              {category.name}
            </p>
            <p className="text-sm text-text-muted font-bengali leading-relaxed mb-6">
              {category.description}
            </p>

            {/* Subcategory Pills */}
            <div className="flex flex-wrap items-center gap-2">
              {(category.subcategories || []).map((sub: any) => (
                <span
                  key={sub.id}
                  className="px-3 py-1 rounded text-xs font-medium bg-surface-secondary text-text border border-border font-bengali"
                >
                  {sub.nameBn} ({sub.courseCount})
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Section Heading */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-text font-bengali">
            উপলব্ধ কোর্সসমূহ ({courses.length})
          </h2>
          <Link
            href="/courses"
            className="text-xs text-primary font-medium hover:underline font-bengali"
          >
            সব কোর্স দেখুন
          </Link>
        </div>

        {/* Courses Grid */}
        {courses.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {courses.map((course) => (
              <CourseCard key={course.id} course={course} />
            ))}
          </div>
        ) : (
          <div className="bg-surface rounded-lg border border-border p-12 text-center max-w-md mx-auto">
            <BookOpen className="w-12 h-12 text-text-muted/40 mx-auto mb-4" />
            <h3 className="text-lg font-bold text-text font-bengali mb-2">শীঘ্রই নতুন কোর্স আসছে</h3>
            <p className="text-sm text-text-muted font-bengali mb-6">
              এই বিভাগের জন্য নতুন ব্যাচের কোর্স তৈরির কাজ চলছে।
            </p>
            <Link href="/courses" className="btn btn-primary btn-sm font-bengali">
              অন্যান্য কোর্স দেখুন
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
