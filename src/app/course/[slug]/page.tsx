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
  Check,
  Flame,
  Sparkles,
  GraduationCap,
} from "lucide-react";
import { CurriculumAccordion } from "@/components/courses/curriculum-accordion";
import { StickyPurchasePanel } from "@/components/courses/sticky-purchase-panel";
import { CourseCard } from "@/components/courses/course-card";
import { CourseDescriptionView } from "@/components/courses/course-description-view";
import { getLiveCourseBySlug, getLiveCourses } from "@/lib/supabase/course-fetcher";

// 3D Boy Student Avatar Component matching Home UI
function StudentAvatar3D() {
  return (
    <svg viewBox="0 0 64 64" fill="none" className="w-full h-full drop-shadow-2xs select-none">
      <ellipse cx="32" cy="27" rx="16" ry="17" fill="#1E293B" />
      <circle cx="17" cy="32" r="4" fill="#FED7AA" />
      <circle cx="47" cy="32" r="4" fill="#FED7AA" />
      <circle cx="17" cy="32" r="2.5" fill="#FCA5A5" opacity="0.6" />
      <circle cx="47" cy="32" r="2.5" fill="#FCA5A5" opacity="0.6" />
      <rect x="18" y="19" width="28" height="26" rx="14" fill="#FFEDD5" />
      <path
        d="M17 27C17 18 23.5 13 32 13C40.5 13 47 18 47 27C43 25 39 23.5 35 23.5C30 23.5 26.5 25.5 23 25.5C19.5 25.5 17.5 26.5 17 27Z"
        fill="#1E293B"
      />
      <circle cx="26" cy="31" r="2.5" fill="#0F172A" />
      <circle cx="38" cy="31" r="2.5" fill="#0F172A" />
      <circle cx="25.2" cy="30.2" r="0.8" fill="white" />
      <circle cx="37.2" cy="30.2" r="0.8" fill="white" />
      <ellipse cx="23" cy="34" rx="2.5" ry="1.5" fill="#FDA4AF" opacity="0.75" />
      <ellipse cx="41" cy="34" rx="2.5" ry="1.5" fill="#FDA4AF" opacity="0.75" />
      <path d="M29.5 36.5C30.8 37.8 33.2 37.8 34.5 36.5" stroke="#9A3412" strokeWidth="1.6" strokeLinecap="round" />
      <path
        d="M13 58C13 48.5 19 45 25 45H39C45 45 51 48.5 51 58V64H13V58Z"
        fill="#F95721"
      />
      <path d="M26 45L32 54L38 45H35L32 49.5L29 45H26Z" fill="#F0F9FF" />
      <path d="M28 45L32 51.5L36 45" stroke="#38BDF8" strokeWidth="1.2" fill="none" />
    </svg>
  );
}

export const dynamic = "force-dynamic";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: PageProps) {
  const { slug } = await params;
  const { course } = await getLiveCourseBySlug(slug);

  if (!course) {
    return { title: "কোর্স পাওয়া যায়নি | Ormission" };
  }

  const title = course.titleBn || course.title;
  return {
    title: `${title} | Ormission`,
    description: course.subtitleBn || course.descriptionBn || "Ormission অনলাইন কোর্স",
    openGraph: {
      title: `${title} | Ormission`,
      description: course.subtitleBn || course.descriptionBn,
      images: [{ url: course.thumbnail }],
    },
  };
}

export default async function CourseDetailPage({ params }: PageProps) {
  const { slug } = await params;
  const { course, instructor, instructors } = await getLiveCourseBySlug(slug);

  if (!course) {
    notFound();
  }

  const allCourses = await getLiveCourses();
  const relatedCourses = allCourses
    .filter((c) => c.categorySlug === course.categorySlug && c.id !== course.id)
    .slice(0, 3);

  const title = course.titleBn || course.title;
  const subtitle =
    course.subtitleBn ||
    "দেশসেরা শিক্ষক ও মেন্টরদের তত্ত্বাবধানে সর্বোচ্চ মানের লাইভ ও রেকর্ডেড প্রস্তুতি কোর্স।";

  const rating = course.rating || 5.0;
  const reviewsCount = course.reviewsCount || 125;
  const enrolledCount = course.enrolledCount || 0;
  const durationHours = course.durationHours || 45;
  const totalLessons = course.totalLessons || 48;

  const categoryName = course.categoryNameBn || "একাডেমিক কোর্স";

  return (
    <div className="bg-background min-h-screen pb-24 lg:pb-16">
      {/* Top Breadcrumb & Hero Header */}
      <div className="bg-surface/90 dark:bg-slate-900/90 border-b border-border/80 pt-24 sm:pt-28 lg:pt-32 pb-8 sm:pb-12 lg:pb-14 relative overflow-hidden">
        {/* Subtle Ambient Glow Blobs */}
        <div className="absolute top-0 right-1/4 w-96 h-96 bg-primary/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-10 w-80 h-80 bg-rose-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="container-main relative z-10">
          {/* Breadcrumbs */}
          <nav className="flex items-center gap-2 text-xs text-slate-300 dark:text-slate-300 mb-5 font-bengali overflow-x-auto no-scrollbar py-1">
            <Link href="/" className="hover:text-primary transition-colors shrink-0 font-medium text-slate-300 dark:text-slate-300 hover:underline">
              হোম
            </Link>
            <ChevronRight className="w-3.5 h-3.5 text-slate-400 dark:text-slate-500 shrink-0" />
            <Link href="/courses" className="hover:text-primary transition-colors shrink-0 font-medium text-slate-300 dark:text-slate-300 hover:underline">
              সকল কোর্স
            </Link>
            <ChevronRight className="w-3.5 h-3.5 text-slate-400 dark:text-slate-500 shrink-0" />
            <Link
              href={`/category/${course.categorySlug}`}
              className="hover:text-primary transition-colors shrink-0 font-medium text-slate-300 dark:text-slate-300 hover:underline"
            >
              {categoryName}
            </Link>
            <ChevronRight className="w-3.5 h-3.5 text-slate-400 dark:text-slate-500 shrink-0" />
            <span className="text-white font-bold truncate max-w-xs shrink-0 bg-white/10 dark:bg-white/10 px-2.5 py-0.5 rounded-md border border-white/10">
              {title}
            </span>
          </nav>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
            {/* Left Header Column */}
            <div className="lg:col-span-8">
              {/* Badges Row */}
              <div className="flex flex-wrap items-center gap-2.5 mb-4">
                {/* Popular Badge */}
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-black text-white bg-gradient-to-r from-amber-500 via-orange-500 to-rose-500 shadow-md shadow-orange-500/25 font-bengali">
                  <Flame className="w-3.5 h-3.5 fill-white text-white animate-pulse" />
                  <span>জনপ্রিয় কোর্স</span>
                </span>

                {/* Category Pill */}
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold text-primary bg-primary/10 border border-primary/20 font-bengali">
                  <BookOpen className="w-3.5 h-3.5" />
                  <span>{categoryName}</span>
                </span>
              </div>

              {/* Course Main Title */}
              <h1 className="text-2xl sm:text-3xl lg:text-4xl xl:text-5xl font-black text-text font-bengali leading-tight mb-3 tracking-normal">
                {title}
              </h1>

              {/* Subtitle */}
              <p className="text-sm sm:text-base text-text-muted font-bengali leading-relaxed mb-6 max-w-3xl">
                {subtitle}
              </p>

              {/* Meta Stats Cards Row */}
              <div className="flex flex-wrap items-center gap-3 sm:gap-4 text-xs font-bengali border-t border-border/80 pt-5 mb-6">
                {/* 5-Star Rating Pill */}
                {course.showRating !== false && (
                  <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-amber-400/10 border border-amber-400/25">
                    <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                    <span className="font-black text-amber-600 dark:text-amber-400 text-sm">
                      {rating.toFixed(1)}
                    </span>
                    <span className="text-text-muted">({reviewsCount} রেটিং)</span>
                  </div>
                )}

                {/* 3D Student Avatar Pill matching Home UI */}
                <div className="inline-flex items-center gap-2 p-1 pr-3.5 rounded-2xl bg-white dark:bg-[#180d19]/90 border border-[#FCE7F3] dark:border-[#FB7185]/30 shadow-xs">
                  <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-xl bg-[#FFF0F4] dark:bg-[#2E101F] border border-[#FCE7F3] dark:border-[#FB7185]/20 flex items-center justify-center shrink-0 p-0.5 overflow-hidden">
                    <StudentAvatar3D />
                  </div>
                  <div className="flex items-baseline gap-1">
                    <span className="text-xs sm:text-sm font-black text-[#E11D48] dark:text-[#FB7185] font-sans tracking-tight tabular-nums">
                      {enrolledCount.toLocaleString("en-US")}
                    </span>
                    <span className="text-[11px] font-bold text-slate-800 dark:text-slate-100 font-bengali">
                      জন শিক্ষার্থী
                    </span>
                  </div>
                </div>

                {/* Total Hours Badge */}
                <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-surface-secondary/70 border border-border/60 text-text-muted">
                  <Clock className="w-3.5 h-3.5 text-primary" />
                  <span>{durationHours} ঘণ্টা মোট ক্লাস</span>
                </div>

                {/* Total Lessons Badge */}
                <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-surface-secondary/70 border border-border/60 text-text-muted">
                  <BookOpen className="w-3.5 h-3.5 text-primary" />
                  <span>{totalLessons}টি লেসন</span>
                </div>
              </div>


            </div>

            {/* Right Column on Mobile (Inline purchase card for mobile devices) */}
            <div className="lg:col-span-4 lg:hidden">
              <StickyPurchasePanel course={course} />
            </div>
          </div>
        </div>
      </div>

      {/* Main Course Content & Sidebar Grid */}
      <div className="container-main py-10 lg:py-14">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
          {/* Main Content (Left 8 Cols) */}
          <div className="lg:col-span-8 space-y-8 sm:space-y-10">
            {/* Course Description */}
            <div className="bg-surface rounded-2xl sm:rounded-3xl border border-border/80 p-6 sm:p-8 shadow-sm">
              <h2 className="text-lg sm:text-xl font-black text-text font-bengali mb-5 flex items-center gap-2.5">
                <BookOpen className="w-5 h-5 text-primary" />
                <span>কোর্স বিবরণী ও বিষয়সমূহ</span>
              </h2>

              <CourseDescriptionView
                description={course.descriptionBn || course.description}
                subtitle={course.subtitleBn}
                courseTitle={title}
              />
            </div>

            {/* Prerequisites */}
            {course.prerequisites && course.prerequisites.length > 0 && (
              <div className="bg-surface rounded-2xl sm:rounded-3xl border border-border/80 p-6 sm:p-8 shadow-sm">
                <h3 className="text-base sm:text-lg font-bold text-text font-bengali mb-3 flex items-center gap-2">
                  <GraduationCap className="w-5 h-5 text-amber-500" />
                  <span>কোর্সটি শুরুর পূর্বশর্ত:</span>
                </h3>
                <ul className="space-y-2 text-xs sm:text-sm text-text font-bengali">
                  {course.prerequisites.map((req, idx) => (
                    <li key={idx} className="flex items-center gap-2 text-text-muted">
                      <div className="w-1.5 h-1.5 rounded-full bg-primary shrink-0" />
                      <span>{req}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Curriculum Accordion */}
            <div className="bg-surface rounded-2xl sm:rounded-3xl border border-border/80 p-6 sm:p-8 shadow-sm">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg sm:text-xl font-black text-text font-bengali flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-primary" />
                  <span>কোর্স কারিকুলাম ও সিলেবাস</span>
                </h2>
                <span className="text-xs font-bold text-text-muted font-bengali">
                  {durationHours} ঘণ্টার পূর্ণাঙ্গ সিলেবাস
                </span>
              </div>
              <CurriculumAccordion curriculum={course.curriculum || []} courseSlug={slug} />
            </div>

            {/* Instructor Bio Profile (Single or Multiple) */}
            {((instructors && instructors.length > 0) || instructor) && (
              <div className="bg-surface rounded-2xl sm:rounded-3xl border border-border/80 p-6 sm:p-8 shadow-sm">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-lg sm:text-xl font-black text-text font-bengali flex items-center gap-2">
                    <Award className="w-5 h-5 text-primary" />
                    <span>
                      {instructors && instructors.length > 1
                        ? `ইন্সট্রাক্টর পরিচিতি (${instructors.length} জন শিক্ষক)`
                        : "ইন্সট্রাক্টর পরিচিতি"}
                    </span>
                  </h2>
                  {instructors && instructors.length > 1 && (
                    <span className="text-xs font-bold text-primary bg-primary/10 px-3 py-1 rounded-full font-bengali">
                      এক্সপার্ট মেন্টর প্যানেল
                    </span>
                  )}
                </div>

                <div className="space-y-6 divide-y divide-border/60">
                  {((instructors && instructors.length > 0) ? instructors : [instructor!]).map((inst, index) => (
                    <div
                      key={inst.id || index}
                      className={`flex flex-col sm:flex-row gap-6 items-start ${index > 0 ? "pt-6" : ""}`}
                    >
                      <div className="relative w-24 h-24 rounded-2xl overflow-hidden shrink-0 border-2 border-primary/25 shadow-md">
                        <Image
                          src={inst.avatarUrl || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&q=80"}
                          alt={inst.nameBn}
                          fill
                          sizes="96px"
                          className="object-cover"
                        />
                        {index === 0 && instructors && instructors.length > 1 && (
                          <div className="absolute bottom-0 inset-x-0 bg-primary/90 text-[10px] text-white font-bold font-bengali text-center py-0.5">
                            প্রধান মেন্টর
                          </div>
                        )}
                      </div>

                      <div className="flex-1">
                        <div className="flex flex-wrap items-baseline gap-2 mb-1">
                          <h3 className="font-black text-lg sm:text-xl text-text font-bengali">
                            {inst.nameBn}
                          </h3>
                          {index === 0 && instructors && instructors.length > 1 && (
                            <span className="text-[10px] font-bold text-primary bg-primary/10 border border-primary/20 px-2 py-0.5 rounded-full font-bengali">
                              প্রধান শিক্ষক
                            </span>
                          )}
                        </div>
                        <p className="text-xs text-text-muted font-sans mb-1.5">
                          {inst.name}
                        </p>
                        <p className="text-xs sm:text-sm text-primary font-bold font-bengali mb-3">
                          {inst.institutionBn} • {inst.department}
                        </p>
                        <p className="text-xs sm:text-sm text-text-muted font-bengali leading-relaxed mb-5">
                          {inst.bioBn || "অভিজ্ঞ শিক্ষক ও মেন্টর যিনি দীর্ঘ বছর ধরে শিক্ষার্থীদের সঠিক গাইডলাইন প্রদান করে আসছেন।"}
                        </p>

                        <div className="flex flex-wrap items-center gap-4 text-xs text-text-muted border-t border-border/80 pt-4 font-bengali">
                          <div className="flex items-center gap-1">
                            <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                            <span className="font-bold text-text">{inst.rating || 5.0}</span> রেটিং
                          </div>
                          <div>•</div>
                          <div>
                            <span className="font-bold text-text">
                              {(inst.studentsCount || 12500).toLocaleString("bn-BD")}
                            </span> জন শিক্ষার্থী
                          </div>
                          <div>•</div>
                          <div>
                            <span className="font-bold text-text">
                              {inst.coursesCount || 4}টি
                            </span> কোর্স
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Student Reviews */}
            {course.reviews && course.reviews.length > 0 && (
              <div className="bg-surface rounded-2xl sm:rounded-3xl border border-border/80 p-6 sm:p-8 shadow-sm">
                <h2 className="text-lg sm:text-xl font-black text-text font-bengali mb-5">
                  শিক্ষার্থীদের রিভিউ ({course.reviews.length})
                </h2>

                <div className="space-y-4">
                  {course.reviews.map((rev) => (
                    <div
                      key={rev.id}
                      className="p-4 rounded-xl bg-surface-secondary/40 border border-border/60 space-y-2"
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
                        <div className="flex items-center gap-0.5">
                          {[...Array(rev.rating || 5)].map((_, i) => (
                            <Star
                              key={i}
                              className="w-3.5 h-3.5 fill-amber-400 text-amber-400"
                            />
                          ))}
                        </div>
                      </div>
                      <p className="text-xs sm:text-sm text-text-muted font-bengali leading-relaxed">
                        "{rev.comment}"
                      </p>
                      <div className="text-[11px] text-text-muted font-sans pt-1">
                        {rev.date}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* FAQs */}
            {course.faqs && course.faqs.length > 0 && (
              <div className="bg-surface rounded-2xl sm:rounded-3xl border border-border/80 p-6 sm:p-8 shadow-sm">
                <h2 className="text-lg sm:text-xl font-black text-text font-bengali mb-5">
                  সাধারণ জিজ্ঞাসা (FAQ)
                </h2>

                <div className="space-y-3.5">
                  {course.faqs.map((faq, index) => (
                    <div
                      key={index}
                      className="p-4 rounded-xl bg-surface-secondary/40 border border-border/60 space-y-2"
                    >
                      <h4 className="font-bold text-sm text-text font-bengali flex items-start gap-2.5">
                        <HelpCircle className="w-4 h-4 text-primary shrink-0 mt-0.5" />
                        <span>{faq.question}</span>
                      </h4>
                      <p className="text-xs sm:text-sm text-text-muted font-bengali pl-6.5 leading-relaxed">
                        {faq.answer}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Desktop Right Sticky Column (4 cols) */}
          <div className="hidden lg:col-span-4 lg:block">
            <StickyPurchasePanel course={course} />
          </div>
        </div>

        {/* Related Courses Section */}
        {relatedCourses.length > 0 && (
          <div className="border-t border-border/80 mt-16 pt-12">
            <h2 className="text-xl sm:text-2xl font-black text-text font-bengali mb-8">
              সম্পর্কিত অন্যান্য কোর্সসমূহ
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-7">
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
