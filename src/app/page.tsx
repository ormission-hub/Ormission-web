import { HeroSection } from "@/components/home/hero-section";
import { StatsBar } from "@/components/home/stats-bar";
import { CategoryCoursesShowcase } from "@/components/home/category-courses-showcase";
import { AboutPreview } from "@/components/home/about-preview";
import { Testimonials } from "@/components/home/testimonials";
import { createClient } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export default async function Home() {
  let categories: any[] = [];
  let featuredCourses: any[] = [];
  let testimonials: any[] = [];
  let instructorsCount = 10;
  let heroSettings: any = null;
  let pinnedCourseIds: (number | string)[] = [];
  let initialBooks: any[] = [];
  let initialInstructors: any[] = [];

  try {
    const supabase = await createClient();
    const [catRes, courseRes, testRes, instRes, heroRes, pinnedRes, booksRes] = await Promise.all([
      supabase
        .from("categories")
        .select("id, name_bn, name, slug, icon_name, description, display_order, is_published")
        .eq("is_published", true)
        .order("display_order", { ascending: true }),
      supabase
        .from("courses")
        .select(`
          id,
          slug,
          title,
          title_bn,
          price,
          original_price,
          enrollment_count,
          total_lessons,
          total_duration,
          is_featured,
          status,
          thumbnail_url,
          short_description,
          category_id,
          categories:category_id (id, name, name_bn, slug),
          instructors:instructor_id (id, name, name_bn, institution)
        `)
        .eq("status", "published")
        .order("created_at", { ascending: false }),
      supabase
        .from("testimonials")
        .select("id, student_name, student_photo, course_name, batch, review, rating, display_order")
        .eq("is_published", true)
        .order("display_order", { ascending: true }),
      supabase
        .from("instructors")
        .select("id, name, name_bn, designation, institution, bio, photo_url, display_order, is_featured", { count: "exact" })
        .eq("is_published", true)
        .order("display_order", { ascending: true })
        .order("id", { ascending: true }),
      supabase
        .from("site_settings")
        .select("value")
        .eq("key", "hero_settings")
        .single(),
      supabase
        .from("site_settings")
        .select("value")
        .eq("key", "homepage_pinned_courses")
        .single(),
      supabase
        .from("site_settings")
        .select("value")
        .eq("key", "ormission_books")
        .single(),
    ]);

    if (catRes.data) {
      categories = catRes.data;
      console.log("SERVER FETCHED CATEGORIES (" + categories.length + "):", categories.map(c => c.name));
    }
    if (catRes.error) {
      console.error("CAT RES ERROR:", catRes.error);
    }
    if (courseRes.data) featuredCourses = courseRes.data;
    if (testRes.data) testimonials = testRes.data;
    if (instRes.count !== null && instRes.count !== undefined) instructorsCount = instRes.count;
    if (instRes.data && Array.isArray(instRes.data)) initialInstructors = instRes.data;
    if (heroRes.data?.value && typeof heroRes.data.value === "object") {
      heroSettings = heroRes.data.value;
    }
    if (pinnedRes.data?.value && Array.isArray(pinnedRes.data.value)) {
      pinnedCourseIds = pinnedRes.data.value;
    }
    if (booksRes.data?.value && Array.isArray(booksRes.data.value)) {
      initialBooks = booksRes.data.value;
    }
  } catch (err) {
    console.error("Error fetching home data from Supabase:", err);
  }

  return (
    <>
      {/* 1. Hero Section: Full-Width Billboard Slider with editable CTA buttons */}
      <HeroSection initialCategories={categories} initialHeroData={heroSettings} />

      {/* 2. Category & Course Showcase (With Audience / StatsBar placed between Category Pills and Course Cards) */}
      <CategoryCoursesShowcase
        courses={featuredCourses}
        categories={categories}
        pinnedCourseIds={pinnedCourseIds}
        initialBooks={initialBooks}
        statsBar={
          <StatsBar
            embedded
            coursesCount={featuredCourses.length > 0 ? featuredCourses.length : 6}
            instructorsCount={instructorsCount > 0 ? instructorsCount : 10}
          />
        }
      />

      {/* 4. About Us: Authentic Group Photo & Narrative */}
      <div className="content-visibility-auto">
        <AboutPreview initialInstructors={initialInstructors} />
      </div>

      {/* 5. Testimonials: Real Student Reviews from Supabase (Zero Mock Data) */}
      <div className="content-visibility-auto">
        <Testimonials initialTestimonials={testimonials} />
      </div>
    </>
  );
}
