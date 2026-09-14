import { HeroSection } from "@/components/home/hero-section";
import { StatsBar } from "@/components/home/stats-bar";
import { CategoryGrid } from "@/components/home/category-grid";
import { FeaturedCourses } from "@/components/home/featured-courses";
import { AboutPreview } from "@/components/home/about-preview";
import { FreeResourcesPreview } from "@/components/home/free-resources-preview";
import { Testimonials } from "@/components/home/testimonials";
import { BlogPreview } from "@/components/home/blog-preview";
import { FinalCTA } from "@/components/home/final-cta";
import { createClient } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

export default async function Home() {
  let categories: any[] = [];
  let featuredCourses: any[] = [];

  try {
    const supabase = await createClient();
    const [catRes, courseRes] = await Promise.all([
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
          is_featured,
          status,
          thumbnail_url,
          categories:category_id (id, name, name_bn, slug),
          instructors:instructor_id (id, name, name_bn, institution)
        `)
        .eq("status", "published")
        .order("created_at", { ascending: false }),
    ]);

    if (catRes.data) categories = catRes.data;
    if (courseRes.data) featuredCourses = courseRes.data;
  } catch (err) {
    console.error("Error fetching home data:", err);
  }

  return (
    <>
      <HeroSection />
      <StatsBar />
      <CategoryGrid initialCategories={categories} />
      <FeaturedCourses initialCourses={featuredCourses} />
      <AboutPreview />
      <Testimonials />
      <FreeResourcesPreview />
      <BlogPreview />
      <FinalCTA />
    </>
  );
}
