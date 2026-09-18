import { createClient as createServerClient } from "./server";
import { Course, COURSES } from "../data/courses";
import { Instructor, INSTRUCTORS } from "../data/instructors";
import { CATEGORIES } from "../data/categories";
import {
  mapDbCourseToAppCourse,
  mapDbInstructorToAppInstructor,
} from "./course-mapper";

/**
 * Fetch a single course by slug (checks Supabase server client first, falls back to static COURSES)
 */
export async function getLiveCourseBySlug(
  slug: string
): Promise<{ course: Course | null; instructor: Instructor | null }> {
  try {
    const supabase = await createServerClient();
    const { data: dbCourse, error } = await supabase
      .from("courses")
      .select(`
        *,
        categories:category_id (*),
        instructors:instructor_id (*),
        course_sections (
          id,
          title,
          title_bn,
          sort_order,
          lessons (
            id,
            title,
            title_bn,
            video_duration,
            is_preview,
            is_published,
            sort_order,
            lesson_servers (
              id,
              server_name,
              server_type,
              video_url,
              is_enabled,
              sort_order
            )
          )
        )
      `)
      .eq("slug", slug)
      .maybeSingle();

    if (!error && dbCourse) {
      const course = mapDbCourseToAppCourse(dbCourse);
      const instructor =
        mapDbInstructorToAppInstructor(dbCourse.instructors) ||
        INSTRUCTORS.find((i) => i.id === course.instructorId) ||
        INSTRUCTORS[0];
      return { course, instructor };
    }
  } catch (err) {
    console.warn("Supabase fetch course by slug failed, falling back:", err);
  }

  // No static fallback — course must exist in the real DB
  return { course: null, instructor: null };
}

export async function getLiveCourses(): Promise<Course[]> {
  try {
    const supabase = await createServerClient();
    const { data, error } = await supabase
      .from("courses")
      .select(`
        *,
        categories:category_id (*),
        instructors:instructor_id (*),
        course_sections (
          id,
          title,
          title_bn,
          sort_order,
          lessons (
            id,
            title,
            title_bn,
            video_duration,
            is_preview,
            is_published,
            sort_order,
            lesson_servers (
              id,
              server_name,
              server_type,
              video_url,
              is_enabled,
              sort_order
            )
          )
        )
      `)
      .eq("status", "published")
      .order("created_at", { ascending: false });

    if (!error && data && data.length > 0) {
      return data.map(mapDbCourseToAppCourse);
    }
  } catch (err) {
    console.warn("Failed to load courses from DB:", err);
  }

  return [];
}

/**
 * Fetch a category and all its courses (Supabase first, fallback to static)
 */
export async function getCategoryWithCourses(
  slug: string
): Promise<{ category: any; courses: Course[] }> {
  try {
    const supabase = await createServerClient();
    const { data: dbCat } = await supabase
      .from("categories")
      .select("*")
      .eq("slug", slug)
      .maybeSingle();

    const { data: dbCourses } = await supabase
      .from("courses")
      .select(`
        *,
        categories:category_id (*),
        instructors:instructor_id (*)
      `)
      .eq("status", "published")
      .order("created_at", { ascending: false });

    const allMapped = (dbCourses || []).map(mapDbCourseToAppCourse);
    const catCourses = allMapped.filter((c) => c.categorySlug === slug);

    if (dbCat) {
      const category = {
        id: String(dbCat.id),
        name: dbCat.name,
        nameBn: dbCat.name_bn || dbCat.name,
        slug: dbCat.slug,
        description: dbCat.description || "",
        iconName: dbCat.icon_name || "BookOpen",
        color: "#2563EB",
        courseCount: catCourses.length,
        subcategories: [],
      };
      return { category, courses: catCourses };
    }
  } catch (err) {
    console.warn("Failed to load category from DB:", err);
  }

  // Fallback to static data
  const fallbackCat = CATEGORIES.find((c) => c.slug === slug);
  const fallbackCourses = COURSES.filter((c) => c.categorySlug === slug);
  return { category: fallbackCat || null, courses: fallbackCourses };
}
