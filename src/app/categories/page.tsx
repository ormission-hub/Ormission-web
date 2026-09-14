import Link from "next/link";
import { GraduationCap, Compass, BookOpen, Laptop, ArrowRight, ChevronRight } from "lucide-react";
import { CATEGORIES } from "@/lib/data/categories";

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  GraduationCap,
  Compass,
  BookOpen,
  Laptop,
};

export const metadata = {
  title: "কোর্স ক্যাটাগরি — বিষয়ভিত্তিক কোর্সসমূহ",
  description: "এইচএসসি, বিশ্ববিদ্যালয় ভর্তি, এসএসসি ও স্কিলস ডেভেলপমেন্টের সকল ক্যাটাগরির কোর্সসমূহ ব্রাউজ করুন।",
};

export default function CategoriesPage() {
  return (
    <div className="bg-background min-h-screen py-10 lg:py-14">
      <div className="container-main">
        {/* Header */}
        <div className="max-w-2xl mb-10">
          <span className="text-xs font-semibold text-primary font-bengali px-2.5 py-1 rounded bg-primary/10 inline-block mb-3">
            কোর্স ক্যাটাগরি
          </span>
          <h1 className="text-3xl lg:text-4xl font-bold text-text font-bengali tracking-tight mb-3">
            আপনার প্রয়োজনীয় শিক্ষা বিভাগ বেছে নিন
          </h1>
          <p className="text-text-muted text-base font-bengali">
            এইচএসসি থেকে শুরু করে উচ্চশিক্ষা ভর্তি ও পেশাগত দক্ষতা বৃদ্ধির সম্পূর্ণ ক্যাটাগরি ডিরেক্টরি।
          </p>
        </div>

        {/* Categories Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {CATEGORIES.map((category) => {
            const Icon = iconMap[category.iconName] || BookOpen;

            return (
              <div
                key={category.id}
                className="bg-surface rounded-lg border border-border p-6 lg:p-8 flex flex-col justify-between hover:border-primary/40 hover:shadow-md transition-all duration-200"
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <div
                      className="w-12 h-12 rounded-lg flex items-center justify-center"
                      style={{ backgroundColor: `${category.color}15`, color: category.color }}
                    >
                      <Icon className="w-6 h-6" />
                    </div>
                    <span className="text-xs font-semibold px-2.5 py-1 rounded bg-surface-secondary text-text-muted font-bengali">
                      {category.courseCount}+ কোর্স
                    </span>
                  </div>

                  <Link href={`/category/${category.slug}`}>
                    <h2 className="text-xl font-bold text-text font-bengali mb-2 hover:text-primary transition-colors">
                      {category.nameBn}
                    </h2>
                  </Link>
                  <p className="text-xs text-text-muted font-sans font-medium mb-3">
                    {category.name}
                  </p>
                  <p className="text-sm text-text-muted font-bengali leading-relaxed mb-6">
                    {category.description}
                  </p>

                  {/* Subcategories list */}
                  <div className="border-t border-border pt-4 mb-6">
                    <h3 className="text-xs font-semibold text-text-muted uppercase tracking-wider mb-3">
                      শাখা ও বিষয়সমূহ:
                    </h3>
                    <div className="space-y-2">
                      {category.subcategories.map((sub) => (
                        <Link
                          key={sub.id}
                          href={`/courses?category=${category.slug}&sub=${sub.slug}`}
                          className="flex items-center justify-between py-1.5 px-3 rounded text-sm font-bengali text-text hover:bg-surface-secondary transition-colors"
                        >
                          <span className="flex items-center gap-2">
                            <ChevronRight className="w-3.5 h-3.5 text-primary" />
                            {sub.nameBn}
                          </span>
                          <span className="text-xs text-text-muted font-sans">
                            {sub.courseCount} courses
                          </span>
                        </Link>
                      ))}
                    </div>
                  </div>
                </div>

                <Link
                  href={`/category/${category.slug}`}
                  className="btn btn-outline btn-sm w-full font-bengali flex items-center justify-center gap-2 font-semibold"
                >
                  <span>ক্যাটাগরির কোর্সসমূহ দেখুন</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
