import { notFound } from "next/navigation";
import Link from "next/link";
import { ChevronRight, Sparkles } from "lucide-react";
import { getCategoryWithCourses } from "@/lib/supabase/course-fetcher";
import { CategoryDetailContent } from "@/components/categories/category-detail-content";

// ISR: Cache page HTML/RSC for 60 seconds for ultra-fast response (<10ms)
export const revalidate = 60;

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: PageProps) {
  const { slug } = await params;
  const { category, courses, books } = await getCategoryWithCourses(slug);

  if (!category) {
    return { title: "ক্যাটাগরি পাওয়া যায়নি | Ormission" };
  }

  return {
    title: `${category.nameBn || category.name} — অনলাইন কোর্স ও বইসমূহ | Ormission`,
    description:
      category.description ||
      `${category.nameBn || category.name} এর সকল কোর্স, প্রস্তুতি প্রোগ্রাম এবং স্টাডি বুকলেট`,
  };
}

export default async function CategoryDetailPage({ params }: PageProps) {
  const { slug } = await params;
  const { category, courses, books } = await getCategoryWithCourses(slug);

  if (!category) {
    notFound();
  }

  return (
    <div className="bg-background min-h-screen pt-24 pb-12 sm:pt-28 sm:pb-14 lg:pt-32 lg:pb-16">
      <div className="container-main">
        {/* Breadcrumb Navigation */}
        <nav
          aria-label="Breadcrumb"
          className="flex items-center gap-2 text-xs text-text-muted mb-6 font-bengali"
        >
          <Link href="/" className="hover:text-primary transition-colors">
            হোম
          </Link>
          <ChevronRight className="w-3.5 h-3.5 text-text-muted/60" />
          <Link href="/categories" className="hover:text-primary transition-colors">
            ক্যাটাগরি
          </Link>
          <ChevronRight className="w-3.5 h-3.5 text-text-muted/60" />
          <span className="text-primary font-bold">
            {category.nameBn || category.name}
          </span>
        </nav>

        {/* Header Banner */}
        <div className="relative overflow-hidden rounded-2xl border border-border/80 bg-surface dark:bg-slate-900/90 p-6 sm:p-8 lg:p-10 mb-8 shadow-xs">
          {/* Ambient Glow */}
          <div
            className="absolute top-0 right-0 w-80 h-80 rounded-full opacity-20 pointer-events-none"
            style={{
              background:
                "radial-gradient(circle, rgba(255,95,0,0.3) 0%, transparent 70%)",
            }}
          />

          <div className="relative z-10 max-w-3xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold bg-primary/10 text-primary border border-primary/20 font-bengali mb-4">
              <Sparkles className="w-3.5 h-3.5" />
              <span>শিক্ষা বিভাগ</span>
            </div>

            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black text-text font-bengali tracking-tight mb-2">
              {category.nameBn || category.name}
            </h1>

            {category.name && category.name !== category.nameBn && (
              <p className="text-sm text-text-muted font-sans font-medium mb-3">
                {category.name}
              </p>
            )}

            {category.description && (
              <p className="text-sm sm:text-base text-text-muted font-bengali leading-relaxed mb-5">
                {category.description}
              </p>
            )}

            <div className="flex flex-wrap items-center gap-3 text-xs font-bold font-bengali text-text-muted">
              <span className="px-3.5 py-1.5 rounded-xl bg-surface-secondary border border-border text-primary font-bold shadow-2xs">
                মোট {courses.length} টি কোর্স
              </span>
              <span className="px-3.5 py-1.5 rounded-xl bg-surface-secondary border border-border text-emerald-600 dark:text-emerald-400 font-bold shadow-2xs">
                মোট {books.length} টি বই ও বুকলেট
              </span>
            </div>
          </div>
        </div>

        {/* Dynamic Courses & Books Content */}
        <CategoryDetailContent
          category={category}
          courses={courses}
          books={books}
        />
      </div>
    </div>
  );
}
