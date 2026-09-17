import { Suspense } from "react";
import type { Metadata } from "next";
import { createClient } from "@/lib/supabase/server";
import { mapDbCourseToAppCourse } from "@/lib/supabase/course-mapper";
import { CoursesClient, type DbCategoryItem } from "@/components/courses/courses-client";
import { type Course } from "@/lib/data/courses";

export const metadata: Metadata = {
  title: "সকল কোর্স | Ormission",
  description:
    "আপনার অ্যাকাডেমিক ও ক্যারিয়ার লক্ষ্য অর্জনে সেরা অনলাইন কোর্সসমূহ। দেশসেরা শিক্ষক ও মেন্টরদের তত্ত্বাবধানে প্রস্তুত।",
};

export const revalidate = 0;

export default async function CoursesPage() {
  let initialCourses: Course[] = [];
  let initialCategories: DbCategoryItem[] = [];

  try {
    const supabase = await createClient();
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
      initialCourses = courseRes.data.map(mapDbCourseToAppCourse);
    }

    if (catRes.data) {
      initialCategories = catRes.data.map((c) => ({
        id: c.id,
        slug: c.slug,
        nameBn: c.name_bn || c.name,
        name: c.name,
      }));
    }
  } catch (err) {
    console.error("Error loading server courses:", err);
  }

  return (
    <Suspense
      fallback={
        <div className="container-main py-16 text-center text-text-muted font-bengali">
          কোর্সসমূহ লোড হচ্ছে...
        </div>
      }
    >
      <CoursesClient
        initialCourses={initialCourses}
        initialCategories={initialCategories}
      />
    </Suspense>
  );
}
