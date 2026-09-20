import Link from "next/link";
import Image from "next/image";
import { Users, Star, Clock, ArrowRight, Sparkles, Flame, BookOpen } from "lucide-react";

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

export interface CourseCardItem {
  id: number | string;
  slug: string;
  title: string;
  title_bn?: string;
  titleBn?: string;
  short_description?: string;
  subtitleBn?: string;
  description?: string;
  thumbnail_url?: string;
  thumbnail?: string;
  price: number;
  original_price?: number;
  originalPrice?: number;
  enrollment_count?: number;
  enrolledCount?: number;
  total_lessons?: number;
  totalLessons?: number;
  total_duration?: number;
  durationHours?: number;
  is_featured?: boolean;
  isFeatured?: boolean;
  badge?: string;
  category_id?: number;
  categorySlug?: string;
  categories?: any;
  instructors?: any;
}

interface CourseCardProps {
  course: CourseCardItem | any;
}

export function CourseCard({ course }: CourseCardProps) {
  const title =
    course.title_bn || course.titleBn || course.title || "অনলাইন স্পেশাল কোর্স";

  const thumbnail =
    course.thumbnail_url ||
    course.thumbnail ||
    "https://oorovtqwyfrfjfwuufyi.supabase.co/storage/v1/object/public/hero_images/hero_1789356392635_x4rpk6.webp";

  const price = course.price ?? 0;
  const originalPrice = course.original_price ?? course.originalPrice;
  const enrollmentCount =
    course.enrollment_count ?? course.enrolledCount ?? 0;
  const totalDuration =
    course.total_duration ?? course.durationHours;
  const totalLessons =
    course.total_lessons ?? course.totalLessons ?? 1;

  // Check if course is popular / featured
  const isPopular =
    Boolean(course.is_featured) ||
    Boolean(course.isFeatured) ||
    Boolean(course.badge);

  const categoryName =
    (Array.isArray(course.categories)
      ? course.categories[0]?.name_bn || course.categories[0]?.name
      : course.categories?.name_bn || course.categories?.name) ||
    course.categoryName ||
    "একাডেমিক কোর্স";

  const shortDesc =
    course.short_description ||
    course.subtitleBn ||
    course.description ||
    "দেশসেরা শিক্ষক ও মেন্টরদের তত্ত্বাবধানে পূর্ণাঙ্গ প্রস্তুতি নিন ঘরে বসেই।";

  return (
    <div className="w-full group flex flex-col bg-surface border border-border/80 rounded-2xl sm:rounded-3xl overflow-hidden shadow-sm hover:shadow-2xl hover:shadow-primary/15 hover:border-primary/50 hover:-translate-y-1.5 transition-all duration-300 h-full relative">
      {/* Image Thumbnail with zoom hover */}
      <Link
        href={`/course/${course.slug}`}
        className="relative aspect-video w-full bg-slate-950 overflow-hidden block"
      >
        {thumbnail ? (
          <Image
            src={thumbnail}
            alt={title}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 420px"
            unoptimized={Boolean(thumbnail.startsWith("http"))}
            className="object-cover group-hover:scale-108 transition-transform duration-500 ease-out"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-surface-secondary text-text-muted">
            <Sparkles className="w-10 h-10 opacity-30" />
          </div>
        )}

        {/* Cinematic bottom gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/20 to-transparent pointer-events-none" />

        {/* "জনপ্রিয় কোর্স" BADGE ON THE RIGHT SIDE (top-3 right-3) */}
        {isPopular && (
          <span className="absolute top-3 right-3 px-3 py-1 rounded-full text-xs font-black text-white bg-gradient-to-r from-amber-500 via-orange-500 to-rose-500 shadow-[0_4px_14px_rgba(249,115,22,0.45)] font-bengali flex items-center gap-1.5 backdrop-blur-md border border-white/25 z-10">
            <Flame className="w-3.5 h-3.5 fill-white text-white animate-pulse shrink-0" />
            <span>জনপ্রিয় কোর্স</span>
          </span>
        )}


      </Link>

      {/* Content Area */}
      <div className="p-5 sm:p-6 flex flex-col flex-1">
        {/* Category Pill & Rating Header */}
        <div className="flex items-center justify-between gap-2 mb-3">
          <span className="inline-flex items-center gap-1 text-[11.5px] font-bold text-primary bg-primary/10 px-2.5 py-0.5 rounded-full font-bengali border border-primary/20">
            <BookOpen className="w-3 h-3 text-primary shrink-0" />
            <span className="truncate max-w-[150px]">{categoryName}</span>
          </span>

          {course.showRating !== false && (
            <div className="flex items-center gap-1 bg-amber-400/10 px-2.5 py-0.5 rounded-full border border-amber-400/25">
              <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
              <span className="text-xs font-black text-amber-600 dark:text-amber-400">
                {(course.rating || 5.0).toFixed(1)}
              </span>
              <span className="text-[11px] font-bold text-text-muted">
                ({String(course.reviewsCount || 125).replace(/[0-9]/g, (d) => "০১২৩৪৫৬৭৮৯"[+d])})
              </span>
            </div>
          )}
        </div>

        {/* Course Title */}
        <Link href={`/course/${course.slug}`} className="block mb-2 group/title">
          <h3 className="text-base sm:text-lg font-black text-text group-hover/title:text-primary transition-colors line-clamp-2 font-bengali leading-snug">
            {title}
          </h3>
        </Link>

        {/* Subtitle / Short Description */}
        <p className="text-xs sm:text-sm text-text-muted line-clamp-2 mb-4 font-bengali leading-relaxed">
          {shortDesc}
        </p>

        {/* Lessons Count & 3D Student Avatar Pill */}
        <div className="flex items-center justify-between gap-2 py-2 px-3 rounded-2xl bg-surface-secondary/60 border border-border/60 mb-4">
          <div className="flex items-center gap-1.5 text-xs text-text-muted font-bengali">
            <Users className="w-3.5 h-3.5 text-primary" />
            <span>{totalLessons}টি লেসন</span>
          </div>

          {/* 3D Student Avatar Pill matching Home UI */}
          <div className="inline-flex items-center gap-2 p-1 pr-3 rounded-xl bg-white dark:bg-[#180d19]/90 border border-[#FCE7F3] dark:border-[#FB7185]/30 shadow-2xs hover:scale-102 transition-transform shrink-0">
            <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-xl bg-[#FFF0F4] dark:bg-[#2E101F] border border-[#FCE7F3] dark:border-[#FB7185]/20 flex items-center justify-center shrink-0 p-0.5 overflow-hidden shadow-2xs">
              <StudentAvatar3D />
            </div>
            <div className="flex items-baseline gap-1">
              <span className="text-xs sm:text-sm font-black text-[#E11D48] dark:text-[#FB7185] font-sans tracking-tight tabular-nums">
                {enrollmentCount.toLocaleString("en-US")}
              </span>
              <span className="text-[10.5px] sm:text-[11px] font-bold text-slate-800 dark:text-slate-100 font-bengali">
                জন ভর্তি
              </span>
            </div>
          </div>
        </div>

        {/* Footer: Price & Primary Button */}
        <div className="mt-auto pt-3.5 border-t border-border/60 flex items-center justify-between gap-3">
          <div className="flex flex-col">
            {originalPrice && originalPrice > price && (
              <span className="text-xs text-text-muted line-through font-sans tabular-nums">
                ৳{originalPrice.toLocaleString("en-US")}
              </span>
            )}
            <span className="text-xl sm:text-2xl font-black text-primary font-sans tracking-tight tabular-nums">
              ৳{price.toLocaleString("en-US")}
            </span>
          </div>

          <Link
            href={`/course/${course.slug}`}
            className="inline-flex items-center gap-1.5 px-4 sm:px-5 py-2 sm:py-2.5 rounded-xl text-xs sm:text-sm font-black text-white bg-gradient-to-r from-primary via-orange-600 to-rose-600 hover:opacity-95 shadow-md shadow-primary/25 hover:shadow-lg hover:shadow-primary/35 transition-all duration-200 group-hover:scale-105 font-bengali"
          >
            <span>বিস্তারিত</span>
            <ArrowRight className="w-3.5 h-3.5 sm:w-4 sm:h-4 transition-transform group-hover:translate-x-1" />
          </Link>
        </div>
      </div>
    </div>
  );
}
