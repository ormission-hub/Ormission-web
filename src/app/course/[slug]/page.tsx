import { notFound } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import {
  Star,
  Users,
  Clock,
  BookOpen,
  CheckCircle2,
  HelpCircle,
  Award,
  ChevronRight,
  ArrowRight,
  ShieldCheck,
  Check,
} from "lucide-react";
import { COURSES } from "@/lib/data/courses";
import { INSTRUCTORS } from "@/lib/data/instructors";
import { CurriculumAccordion } from "@/components/courses/curriculum-accordion";
import { StickyPurchasePanel } from "@/components/courses/sticky-purchase-panel";
import { CourseCard } from "@/components/courses/course-card";
import { getLiveCourseBySlug } from "@/lib/supabase/course-fetcher";

export const dynamic = "force-dynamic";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: PageProps) {
  const { slug } = await params;
  const { course } = await getLiveCourseBySlug(slug);

  if (!course) {
    return { title: "কোর্স পাওয়া যায়নি" };
  }

  return {
    title: `${course.titleBn} | Ormission`,
    description: course.subtitleBn || course.descriptionBn,
    openGraph: {
      title: course.titleBn,
      description: course.subtitleBn,
      images: [{ url: course.thumbnail }],
    },
  };
}

export default async function CourseDetailPage({ params }: PageProps) {
  const { slug } = await params;
  const { course, instructor } = await getLiveCourseBySlug(slug);

  if (!course) {
    notFound();
  }

  const relatedCourses = COURSES.filter(
    (c) => c.categorySlug === course.categorySlug && c.id !== course.id
  ).slice(0, 3);

  return (
    <div className="bg-background min-h-screen">
      {/* Top Breadcrumb & Header Banner */}
      <div className="bg-surface border-b border-border py-8 lg:py-12">
        <div className="container-main">
          {/* Breadcrumbs */}
          <nav className="flex items-center gap-2 text-xs text-text-muted mb-4 font-bengali">
            <Link href="/" className="hover:text-primary transition-colors">
              হোম
            </Link>
            <ChevronRight className="w-3 h-3 text-border" />
            <Link href="/courses" className="hover:text-primary transition-colors">
              সকল কোর্স
            </Link>
            <ChevronRight className="w-3 h-3 text-border" />
            <Link
              href={`/category/${course.categorySlug}`}
              className="hover:text-primary transition-colors"
            >
              {course.categoryNameBn}
            </Link>
            <ChevronRight className="w-3 h-3 text-border" />
            <span className="text-text font-medium truncate max-w-xs">
              {course.titleBn}
            </span>
          </nav>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
            {/* Left Header Column */}
            <div className="lg:col-span-8">
              {course.badge && (
                <span className="inline-block px-2.5 py-1 text-xs font-semibold rounded bg-primary text-white font-bengali mb-3">
                  {course.badge}
                </span>
              )}

              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-text font-bengali tracking-tight leading-snug mb-3">
                {course.titleBn}
              </h1>
              <p className="text-sm lg:text-base text-text-muted font-sans font-medium mb-4">
                {course.title}
              </p>
              <p className="text-sm lg:text-base text-text-muted font-bengali leading-relaxed mb-6">
                {course.subtitleBn}
              </p>

              {/* Meta Stats Row */}
              <div className="flex flex-wrap items-center gap-4 sm:gap-6 text-xs text-text-muted border-t border-border pt-4">
                <div className="flex items-center gap-1.5">
                  <Star className="w-4 h-4 fill-accent text-accent" />
                  <span className="font-bold text-text text-sm">{course.rating}</span>
                  <span>({course.reviewsCount} রেটিং)</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Users className="w-4 h-4 text-secondary" />
                  <span className="font-semibold text-text font-bengali">
                    {course.enrolledCount.toLocaleString("bn-BD")} জন শিক্ষার্থী
                  </span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Clock className="w-4 h-4 text-primary" />
                  <span>{course.durationHours} ঘণ্টা মোট ক্লাস</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <BookOpen className="w-4 h-4 text-primary" />
                  <span>{course.totalLessons}টি লেসন</span>
                </div>
              </div>

              {/* Instructor Snapshot */}
              {instructor && (
                <div className="flex items-center gap-3 mt-6 pt-4 border-t border-border">
                  <div className="relative w-11 h-11 rounded-full overflow-hidden shrink-0 border-2 border-primary/20">
                    <Image
                      src={instructor.avatarUrl}
                      alt={instructor.nameBn}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div>
                    <span className="text-xs text-text-muted font-bengali">কোর্স ইন্সট্রাক্টর:</span>
                    <div className="text-sm font-bold text-text font-bengali">
                      {instructor.nameBn}
                    </div>
                    <div className="text-xs text-secondary font-medium">
                      {instructor.institutionBn} • {instructor.department}
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Right Column on Mobile (shows card inline on mobile, sticky on desktop) */}
            <div className="lg:col-span-4 lg:hidden">
              <StickyPurchasePanel course={course} />
            </div>
          </div>
        </div>
      </div>

      {/* Main Content & Sidebar Layout */}
      <div className="container-main py-10 lg:py-14">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
          {/* Main Course Body (Left) */}
          <div className="lg:col-span-8 space-y-10">
            {/* What you will learn (Highlights) */}
            <div className="bg-surface rounded-lg border border-border p-6 lg:p-8">
              <h2 className="text-lg lg:text-xl font-bold text-text font-bengali mb-4 flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-secondary" />
                <span>এই কোর্স থেকে যা যা শিখবেন</span>
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
                {course.highlights.map((highlight, index) => (
                  <div key={index} className="flex items-start gap-2.5 text-xs lg:text-sm text-text font-bengali">
                    <div className="w-4 h-4 rounded-full bg-secondary/15 text-secondary flex items-center justify-center shrink-0 mt-0.5">
                      <Check className="w-2.5 h-2.5" />
                    </div>
                    <span className="leading-relaxed">{highlight}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Course Description */}
            <div>
              <h2 className="text-lg lg:text-xl font-bold text-text font-bengali mb-3">
                কোর্স বিবরণী
              </h2>
              <div className="prose prose-slate max-w-none text-sm lg:text-base text-text font-bengali leading-relaxed space-y-4">
                <p>{course.descriptionBn}</p>
                <p>{course.description}</p>
              </div>
            </div>

            {/* Prerequisites */}
            {course.prerequisites.length > 0 && (
              <div className="bg-surface-secondary/50 rounded-lg border border-border p-5">
                <h3 className="text-sm font-bold text-text font-bengali mb-2">
                  কোর্সটি শুরুর পূর্বশর্ত:
                </h3>
                <ul className="list-disc list-inside text-xs lg:text-sm text-text-muted font-bengali space-y-1">
                  {course.prerequisites.map((req, idx) => (
                    <li key={idx}>{req}</li>
                  ))}
                </ul>
              </div>
            )}

            {/* Curriculum Accordion */}
            <div>
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg lg:text-xl font-bold text-text font-bengali">
                  কোর্স কারিকুলাম ও সিলেবাস
                </h2>
                <span className="text-xs text-text-muted font-sans font-medium">
                  {course.durationHours} Hours Total
                </span>
              </div>
              <CurriculumAccordion curriculum={course.curriculum} />
            </div>

            {/* Instructor Bio */}
            {instructor && (
              <div className="bg-surface rounded-lg border border-border p-6 lg:p-8">
                <h2 className="text-lg lg:text-xl font-bold text-text font-bengali mb-4">
                  ইন্সট্রাক্টর পরিচিতি
                </h2>
                <div className="flex flex-col sm:flex-row gap-5 items-start">
                  <div className="relative w-20 h-20 rounded-lg overflow-hidden shrink-0 border border-border">
                    <Image
                      src={instructor.avatarUrl}
                      alt={instructor.nameBn}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div>
                    <h3 className="font-bold text-base text-text font-bengali">
                      {instructor.nameBn}
                    </h3>
                    <p className="text-xs text-text-muted font-sans mb-1">
                      {instructor.name}
                    </p>
                    <p className="text-xs text-secondary font-semibold font-bengali mb-3">
                      {instructor.institutionBn} • {instructor.department}
                    </p>
                    <p className="text-sm text-text-muted font-bengali leading-relaxed mb-4">
                      {instructor.bioBn}
                    </p>

                    <div className="flex flex-wrap items-center gap-4 text-xs text-text-muted border-t border-border pt-3">
                      <div>
                        <span className="font-bold text-text">{instructor.rating}</span> রেটিং
                      </div>
                      <div>
                        <span className="font-bold text-text font-bengali">
                          {(instructor.studentsCount || 1200).toLocaleString("bn-BD")}
                        </span> শিক্ষার্থী
                      </div>
                      <div>
                        <span className="font-bold text-text font-bengali">
                          {instructor.coursesCount || 1}টি
                        </span> কোর্স
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Student Reviews */}
            <div>
              <h2 className="text-lg lg:text-xl font-bold text-text font-bengali mb-4">
                শিক্ষার্থীদের রিভিউ ({course.reviews.length})
              </h2>
              <div className="space-y-4">
                {course.reviews.map((rev) => (
                  <div
                    key={rev.id}
                    className="bg-surface rounded-lg border border-border p-5 space-y-2"
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <span className="font-bold text-sm text-text font-bengali">
                          {rev.studentName}
                        </span>
                        <span className="text-xs text-text-muted font-bengali ml-2">
                          ({rev.batch})
                        </span>
                      </div>
                      <div className="flex items-center gap-1">
                        {[...Array(rev.rating)].map((_, i) => (
                          <Star
                            key={i}
                            className="w-3.5 h-3.5 fill-accent text-accent"
                          />
                        ))}
                      </div>
                    </div>
                    <p className="text-xs lg:text-sm text-text-muted font-bengali leading-relaxed">
                      "{rev.comment}"
                    </p>
                    <div className="text-[11px] text-text-muted font-sans pt-1">
                      {rev.date}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* FAQs */}
            {course.faqs.length > 0 && (
              <div>
                <h2 className="text-lg lg:text-xl font-bold text-text font-bengali mb-4">
                  সাধারণ জিজ্ঞাসা (FAQ)
                </h2>
                <div className="space-y-3">
                  {course.faqs.map((faq, index) => (
                    <div
                      key={index}
                      className="bg-surface rounded-lg border border-border p-5 space-y-2"
                    >
                      <h4 className="font-bold text-sm text-text font-bengali flex items-start gap-2">
                        <HelpCircle className="w-4 h-4 text-primary shrink-0 mt-0.5" />
                        <span>{faq.question}</span>
                      </h4>
                      <p className="text-xs lg:text-sm text-text-muted font-bengali pl-6 leading-relaxed">
                        {faq.answer}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Desktop Right Sidebar Column */}
          <div className="hidden lg:col-span-4 lg:block">
            <StickyPurchasePanel course={course} />
          </div>
        </div>

        {/* Related Courses */}
        {relatedCourses.length > 0 && (
          <div className="border-t border-border mt-16 pt-12">
            <h2 className="text-xl font-bold text-text font-bengali mb-6">
              সম্পর্কিত অন্যান্য কোর্সসমূহ
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {relatedCourses.map((c) => (
                <CourseCard key={c.id} course={c} />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
