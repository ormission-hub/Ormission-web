import { cache } from "react";
import { createClient as createServerClient } from "./server";
import { Course, COURSES } from "../data/courses";
import { Instructor, INSTRUCTORS } from "../data/instructors";
import { CATEGORIES } from "../data/categories";
import {
  mapDbCourseToAppCourse,
  mapDbInstructorToAppInstructor,
} from "./course-mapper";

export interface CategoryBook {
  id: string;
  title: string;
  subtitle: string;
  author?: string;
  edition?: string;
  publisher?: string;
  category: string;
  category_id?: number | string;
  category_slug?: string;
  price: number;
  original_price: number;
  cover_gradient?: string;
  cover_image?: string;
  pages: string;
  format: string;
  stock_status?: "in_stock" | "low_stock" | "pre_order" | "out_of_stock";
  stock_quantity?: number;
  rating: number;
  reviews_count: number;
  features?: string[];
  is_popular?: boolean;
  is_pinned?: boolean;
  display_order?: number;
  order_url?: string;
  preview_pdf_url?: string;
  delivery_info?: string;
  isbn?: string;
}

/**
 * Fetch a single course by slug (checks Supabase server client first, falls back to static COURSES)
 */
export async function getLiveCourseBySlug(
  slug: string
): Promise<{ course: Course | null; instructor: Instructor | null; instructors: Instructor[] }> {
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
            ),
            lesson_resources (
              id,
              title,
              file_url,
              file_type,
              file_size,
              sort_order
            )
          )
        )
      `)
      .eq("slug", slug)
      .maybeSingle();

    if (!error && dbCourse) {
      const course = mapDbCourseToAppCourse(dbCourse);
      const primaryInstructor =
        mapDbInstructorToAppInstructor(dbCourse.instructors) ||
        INSTRUCTORS.find((i) => i.id === course.instructorId) ||
        INSTRUCTORS[0];

      let instructorsList: Instructor[] = [];
      const instIds = course.instructorIds && course.instructorIds.length > 0
        ? course.instructorIds
        : [course.instructorId];
      const numericIds = instIds.map(Number).filter((n) => !isNaN(n) && n > 0);

      if (numericIds.length > 0) {
        const { data: dbInstructors } = await supabase
          .from("instructors")
          .select("*")
          .in("id", numericIds);

        if (dbInstructors && dbInstructors.length > 0) {
          instructorsList = instIds
            .map((id) => {
              const found = dbInstructors.find((d: any) => String(d.id) === String(id));
              return found ? mapDbInstructorToAppInstructor(found) : undefined;
            })
            .filter((inst): inst is Instructor => Boolean(inst));
        }
      }

      if (instructorsList.length === 0 && primaryInstructor) {
        instructorsList = [primaryInstructor];
      }

      return {
        course,
        instructor: instructorsList[0] || primaryInstructor,
        instructors: instructorsList,
      };
    }

    if (error) {
      console.warn("Supabase fetch course by slug error:", slug, error.message);
    }
  } catch (err) {
    console.warn("Supabase fetch course by slug failed:", err);
  }

  // Fallback to static mock courses if DB does not have it (e.g. previewing demo courses)
  const staticCourse = COURSES.find((c) => c.slug === slug);
  if (staticCourse) {
    const primaryInstructor = INSTRUCTORS.find((i) => i.id === staticCourse.instructorId) || INSTRUCTORS[0];
    return {
      course: staticCourse,
      instructor: primaryInstructor,
      instructors: [primaryInstructor],
    };
  }

  return { course: null, instructor: null, instructors: [] };
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
            ),
            lesson_resources (
              id,
              title,
              file_url,
              file_type,
              file_size,
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
 * Fetch a category, all its courses, and all its books (Supabase first, fallback to static)
 * Wrapped in React cache() to deduplicate requests across generateMetadata and Page render.
 */
export const getCategoryWithCourses = cache(
  async (
    slug: string
  ): Promise<{ category: any; courses: Course[]; books: CategoryBook[] }> => {
    try {
      const supabase = await createServerClient();
      const normalizedSlug = decodeURIComponent(slug).toLowerCase().trim();
      const slugCandidates = [normalizedSlug];
      if (normalizedSlug === "school") slugCandidates.push("ssc");
      if (normalizedSlug === "ssc") slugCandidates.push("school");
      if (normalizedSlug === "nursing-medical") {
        slugCandidates.push("medical-nursing", "medical", "nursing");
      }

      let { data: dbCat } = await supabase
        .from("categories")
        .select("*")
        .in("slug", slugCandidates)
        .maybeSingle();

      if (!dbCat) {
        const { data: catByName } = await supabase
          .from("categories")
          .select("*")
          .ilike("name", normalizedSlug)
          .maybeSingle();
        if (catByName) dbCat = catByName;
      }

      // Concurrently query courses and books
      const coursesPromise = dbCat
        ? supabase
            .from("courses")
            .select(`
              *,
              categories:category_id (*),
              instructors:instructor_id (*)
            `)
            .eq("status", "published")
            .eq("category_id", dbCat.id)
            .order("created_at", { ascending: false })
        : supabase
            .from("courses")
            .select(`
              *,
              categories:category_id (*),
              instructors:instructor_id (*)
            `)
            .eq("status", "published")
            .order("created_at", { ascending: false });

      const booksPromise = supabase
        .from("site_settings")
        .select("value")
        .eq("key", "ormission_books")
        .maybeSingle();

      const [coursesRes, booksRes] = await Promise.all([
        coursesPromise,
        booksPromise,
      ]);

      let catCourses: Course[] = [];
      if (coursesRes.data) {
        catCourses = coursesRes.data.map(mapDbCourseToAppCourse);
      }

      // If dbCat wasn't matched with eq(category_id), filter in JS
      if (!dbCat && coursesRes.data) {
        catCourses = catCourses.filter((c) => {
          const cCatSlug = (c.categorySlug || "").toLowerCase();
          return slugCandidates.includes(cCatSlug);
        });
      }

      // Extract & filter books for this category
      let allBooks: CategoryBook[] = [];
      if (booksRes.data?.value && Array.isArray(booksRes.data.value)) {
        allBooks = booksRes.data.value;
      }

      const activeCatSlug = dbCat?.slug?.toLowerCase() || normalizedSlug;
      const activeCatName = (dbCat?.name || "").toLowerCase();
      const activeCatNameBn = dbCat?.name_bn || "";

      const catBooks = allBooks.filter((b) => {
        // 1. Direct ID match
        if (dbCat && b.category_id && String(b.category_id) === String(dbCat.id)) {
          return true;
        }

        // 2. Direct category_slug match
        if (
          b.category_slug &&
          (b.category_slug.toLowerCase() === activeCatSlug ||
            slugCandidates.includes(b.category_slug.toLowerCase()))
        ) {
          return true;
        }

        // 3. String category match (case-insensitive & Bangla friendly)
        const bookCat = (b.category || "").toLowerCase().trim();
        if (!bookCat) return false;

        if (bookCat === activeCatSlug || bookCat === activeCatName) {
          return true;
        }

        if (activeCatNameBn && b.category && b.category.includes(activeCatNameBn)) {
          return true;
        }

        // Specific category mappings for flexible matching
        if (activeCatSlug === "ssc" || activeCatSlug === "school") {
          return (
            bookCat.includes("ssc") ||
            bookCat.includes("স্কুল") ||
            bookCat.includes("৯ম") ||
            bookCat.includes("১০ম")
          );
        }

        if (activeCatSlug === "hsc") {
          return bookCat.includes("hsc") || b.category.includes("এইচএসসি");
        }

        if (activeCatSlug === "admission") {
          return (
            bookCat.includes("admission") ||
            b.category.includes("ভর্তি") ||
            b.category.includes("এডমিশন") ||
            bookCat.includes("engineering") ||
            b.category.includes("ইঞ্জিনিয়ারিং")
          );
        }

        if (activeCatSlug === "nursing-medical" || activeCatSlug === "medical") {
          return (
            bookCat.includes("medical") ||
            bookCat.includes("nursing") ||
            b.category.includes("মেডিকেল") ||
            b.category.includes("নার্সিং")
          );
        }

        if (activeCatSlug === "arts-commerce") {
          return (
            bookCat.includes("arts") ||
            bookCat.includes("commerce") ||
            b.category.includes("মানবিক") ||
            b.category.includes("ব্যবসায়")
          );
        }

        return false;
      });

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
          bookCount: catBooks.length,
          subcategories: [],
        };
        return { category, courses: catCourses, books: catBooks };
      }
    } catch (err) {
      console.warn("Failed to load category from DB:", err);
    }

    // Fallback to static data
    const fallbackCat = CATEGORIES.find(
      (c) =>
        c.slug.toLowerCase() === slug.toLowerCase() ||
        (slug.toLowerCase() === "ssc" && c.slug === "school")
    );
    const fallbackCourses = COURSES.filter(
      (c) =>
        c.categorySlug.toLowerCase() === slug.toLowerCase() ||
        (slug.toLowerCase() === "ssc" && c.categorySlug === "school")
    );
    return { category: fallbackCat || null, courses: fallbackCourses, books: [] };
  }
);
