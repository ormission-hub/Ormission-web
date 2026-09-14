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
        instructors:instructor_id (*)
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

  // Fallback to static
  const course = COURSES.find((c) => c.slug === slug) || null;
  const instructor = course
    ? INSTRUCTORS.find((i) => i.id === course.instructorId) || INSTRUCTORS[0]
    : null;

  return { course, instructor };
}

/**
 * Fetch all courses (Supabase first, merged with static)
 */
export async function getLiveCourses(): Promise<Course[]> {
  try {
    const supabase = await createServerClient();
    const { data, error } = await supabase
      .from("courses")
      .select(`
        *,
        categories:category_id (*),
        instructors:instructor_id (*)
      `)
      .eq("status", "published")
      .order("created_at", { ascending: false });

    if (!error && data && data.length > 0) {
      const dbMapped = data.map(mapDbCourseToAppCourse);
      const dbSlugs = new Set(dbMapped.map((c) => c.slug));
      const remainingStatic = COURSES.filter((c) => !dbSlugs.has(c.slug));
      return [...dbMapped, ...remainingStatic];
    }
  } catch (err) {
    console.warn("Failed to load courses from DB, using fallback:", err);
  }

  return COURSES;
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
