import { HeroSection } from "@/components/home/hero-section";
import { StatsBar } from "@/components/home/stats-bar";
import { CategoryCoursesShowcase } from "@/components/home/category-courses-showcase";
import { AboutPreview } from "@/components/home/about-preview";
import { Testimonials } from "@/components/home/testimonials";
import { createClient } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

export default async function Home() {
  let categories: any[] = [];
  let featuredCourses: any[] = [];
  let testimonials: any[] = [];
  let instructorsCount = 10;
  let heroSettings: any = null;

  try {
    const supabase = await createClient();
    const [catRes, courseRes, testRes, instRes, heroRes] = await Promise.all([
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
        .select("id", { count: "exact" })
        .eq("is_published", true),
      supabase
        .from("site_settings")
        .select("value")
        .eq("key", "hero_settings")
        .single(),
    ]);

    if (catRes.data) categories = catRes.data;
    if (courseRes.data) featuredCourses = courseRes.data;
    if (testRes.data) testimonials = testRes.data;
    if (instRes.count !== null && instRes.count !== undefined) instructorsCount = instRes.count;
    if (heroRes.data?.value && typeof heroRes.data.value === "object") {
      heroSettings = heroRes.data.value;
    }
  } catch (err) {
    console.error("Error fetching home data from Supabase:", err);
  }

  return (
    <>
      {/* 1. Hero Section: Full-Width Billboard Slider with editable CTA buttons */}
      <HeroSection initialCategories={categories} initialHeroData={heroSettings} />

      {/* 2. Stats Bar: Floating Capsule Card with Real DB Counts */}
      <StatsBar
        coursesCount={featuredCourses.length > 0 ? featuredCourses.length : 6}
        instructorsCount={instructorsCount > 0 ? instructorsCount : 10}
      />

      {/* 3. Bondi Pathshala Style Category & Course Animation Showcase */}
      <CategoryCoursesShowcase courses={featuredCourses} categories={categories} />

      {/* 4. About Us: Authentic Group Photo & Narrative */}
      <AboutPreview />

      {/* 5. Testimonials: Real Student Reviews from Supabase (Zero Mock Data) */}
      <Testimonials initialTestimonials={testimonials} />
    </>
  );
}
