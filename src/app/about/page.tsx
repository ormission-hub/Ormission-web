import { createClient } from "@/lib/supabase/server";
import {
  AboutPageClient,
  type AboutInstructor,
} from "@/components/about/about-page-client";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "আমাদের সম্পর্কে | Ormission — Learn · Build · Grow",
  description:
    "অর্মিশন-এর পরিচিতি, লক্ষ্য, দূরদৃষ্টি এবং শিক্ষার্থীদের সাফল্যের পথ সুগম করার অঙ্গীকার।",
};

export default async function AboutPage() {
  let instructors: AboutInstructor[] = [];
  let totalCourses = 0;
  let totalStudents = 0;
  let totalInstructors = 0;

  try {
    const supabase = await createClient();

    const [instRes, courseRes, enrollRes] = await Promise.all([
      // Fetch published instructors
      supabase
        .from("instructors")
        .select(
          "id, name, name_bn, designation, institution, bio, photo_url, display_order, is_featured",
          { count: "exact" }
        )
        .eq("is_published", true)
        .order("display_order", { ascending: true })
        .order("id", { ascending: true }),

      // Count published courses
      supabase
        .from("courses")
        .select("id", { count: "exact", head: true })
        .eq("status", "published"),

      // Sum enrollment counts
      supabase
        .from("courses")
        .select("enrollment_count")
        .eq("status", "published"),
    ]);

    if (instRes.data) {
      instructors = instRes.data;
    }
    if (instRes.count != null) {
      totalInstructors = instRes.count;
    }

    if (courseRes.count != null) {
      totalCourses = courseRes.count;
    }

    if (enrollRes.data) {
      totalStudents = enrollRes.data.reduce(
        (sum, c) => sum + Number(c.enrollment_count || 0),
        0
      );
    }
  } catch (err) {
    console.error("Failed to load About page data:", err);
  }

  return (
    <AboutPageClient
      instructors={instructors}
      totalCourses={totalCourses}
      totalStudents={totalStudents}
      totalInstructors={totalInstructors}
    />
  );
}
