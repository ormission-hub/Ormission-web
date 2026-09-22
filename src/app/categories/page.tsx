import { createClient } from "@/lib/supabase/server";
import {
  CategoryDirectoryClient,
  type RealCategoryItem,
} from "@/components/categories/category-directory-client";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "কোর্স ক্যাটাগরি — বিষয়ভিত্তিক শিক্ষা বিভাগসমূহ | Ormission",
  description:
    "এইচএসসি, এসএসসি, বিশ্ববিদ্যালয় ও মেডিকেল ভর্তি এবং স্কিলস প্রোগ্রামের সম্পূর্ণ বিষয়ভিত্তিক কোর্স ডিরেক্টরি।",
};

export default async function CategoriesPage() {
  let categories: RealCategoryItem[] = [];
  let totalCoursesCount = 0;
  let totalStudentsCount = 0;

  try {
    const supabase = await createClient();

    const { data: rawCategories, error } = await supabase
      .from("categories")
      .select(`
        id,
        name,
        name_bn,
        slug,
        description,
        image_url,
        icon_name,
        display_order,
        is_published,
        courses (
          id,
          title,
          title_bn,
          slug,
          price,
          original_price,
          thumbnail_url,
          enrollment_count,
          status
        )
      `)
      .eq("is_published", true)
      .order("display_order", { ascending: true })
      .order("id", { ascending: true });

    if (error) {
      console.error("Error fetching categories from DB:", error);
    }

    if (rawCategories) {
      categories = rawCategories.map((cat) => {
        const publishedCourses = (cat.courses || []).filter(
          (c: any) => c.status === "published"
        );

        totalCoursesCount += publishedCourses.length;
        for (const c of publishedCourses) {
          totalStudentsCount += Number(c.enrollment_count || 0);
        }

        return {
          id: Number(cat.id),
          name: cat.name || "",
          nameBn: cat.name_bn || cat.name || "",
          slug: cat.slug || "",
          description: cat.description || "",
          iconName: cat.icon_name || "graduation",
          imageUrl: cat.image_url,
          displayOrder: Number(cat.display_order || 0),
          courseCount: publishedCourses.length,
          courses: publishedCourses.map((c: any) => ({
            id: c.id,
            title: c.title || "",
            titleBn: c.title_bn || c.title || "",
            slug: c.slug || "",
            price: typeof c.price === "number" ? c.price : undefined,
            originalPrice:
              typeof c.original_price === "number" ? c.original_price : undefined,
            thumbnailUrl: c.thumbnail_url,
            enrollmentCount: Number(c.enrollment_count || 0),
          })),
        };
      });
    }
  } catch (err) {
    console.error("Failed to load categories:", err);
  }

  return (
    <CategoryDirectoryClient
      categories={categories}
      totalCoursesCount={totalCoursesCount}
      totalStudentsCount={totalStudentsCount}
    />
  );
}
