import Link from "next/link";
import Image from "next/image";
import { Users, Star, Clock, BookOpen, ArrowRight } from "lucide-react";
import { type Course } from "@/lib/data/courses";
import { INSTRUCTORS } from "@/lib/data/instructors";

interface CourseCardProps {
  course: Course;
  layout?: "grid" | "horizontal";
}

export function CourseCard({ course, layout = "grid" }: CourseCardProps) {
  const anyCourse = course as any;
  const thumbnail = anyCourse.thumbnail_url || course.thumbnail || "https://images.unsplash.com/photo-1636466497217-26a8cbeaf0aa?q=80&w=800&auto=format&fit=crop";
  const instructor = INSTRUCTORS.find((i) => i.id === course.instructorId) || anyCourse.instructorObj;

  const categoryName = course.categoryNameBn || anyCourse.categories?.name_bn || anyCourse.categories?.name || "অনলাইন কোর্স";
  const rating = course.rating || 4.9;
  const reviewsCount = course.reviewsCount || 120;
  const enrolledCount = course.enrolledCount || anyCourse.enrollment_count || 1250;
  const totalLessons = course.totalLessons || anyCourse.total_lessons || 35;
  const durationHours = course.durationHours || 40;

  return (
    <div className="group flex flex-col h-full bg-surface rounded-lg border border-border overflow-hidden hover:border-primary/40 hover:shadow-md transition-all duration-200">
      {/* Thumbnail */}
      <Link href={`/course/${course.slug}`} className="relative aspect-video w-full overflow-hidden bg-surface-secondary block">
        <Image
          src={thumbnail}
          alt={course.titleBn || course.title}
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          className="object-cover group-hover:scale-105 transition-transform duration-300"
        />
        {course.badge && (
          <span className="absolute top-3 left-3 px-2.5 py-1 text-xs font-semibold rounded bg-primary text-white font-bengali shadow-xs">
            {course.badge}
          </span>
        )}
        <span className="absolute bottom-3 right-3 px-2 py-0.5 text-xs font-medium rounded bg-black/75 text-white flex items-center gap-1 backdrop-blur-xs">
          <Clock className="w-3 h-3 text-accent" />
          {durationHours} ঘণ্টা
        </span>
      </Link>

      {/* Content */}
      <div className="flex flex-col flex-1 p-5">
        {/* Category & Rating */}
        <div className="flex items-center justify-between gap-2 text-xs mb-2.5">
          <span className="text-secondary font-medium px-2 py-0.5 rounded bg-secondary/10 font-bengali">
            {categoryName}
          </span>
          <div className="flex items-center gap-1 text-text-muted">
            <Star className="w-3.5 h-3.5 fill-accent text-accent" />
            <span className="font-semibold text-text">{rating.toFixed(1)}</span>
            <span>({reviewsCount})</span>
          </div>
        </div>

        {/* Title */}
        <Link href={`/course/${course.slug}`} className="block mb-2 group-hover:text-primary transition-colors">
          <h3 className="font-bold text-base lg:text-lg text-text font-bengali line-clamp-2 leading-snug">
            {course.titleBn || course.title}
          </h3>
        </Link>

        {/* Instructor */}
        {instructor && (
          <div className="flex items-center gap-2 mb-4 text-xs text-text-muted">
            <div className="relative w-6 h-6 rounded-full overflow-hidden shrink-0 border border-border">
              <Image
                src={instructor.avatarUrl || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&q=80"}
                alt={instructor.nameBn || instructor.name}
                fill
                className="object-cover"
              />
            </div>
            <span className="font-medium text-text font-bengali truncate">{instructor.nameBn || instructor.name}</span>
            <span className="text-border">|</span>
            <span className="truncate">{instructor.institutionBn || instructor.institution}</span>
          </div>
        )}

        {/* Meta details */}
        <div className="grid grid-cols-2 gap-2 text-xs text-text-muted border-t border-border pt-3 mb-4 mt-auto">
          <div className="flex items-center gap-1.5">
            <BookOpen className="w-3.5 h-3.5 text-primary" />
            <span>{course.totalLessons}টি লেসন</span>
          </div>
          <div className="flex items-center gap-1.5 justify-end">
            <Users className="w-3.5 h-3.5 text-secondary" />
            <span>{course.enrolledCount.toLocaleString("bn-BD")} জন</span>
          </div>
        </div>

        {/* Price & Action */}
        <div className="flex items-center justify-between gap-3 pt-2">
          <div>
            <div className="text-xl font-bold text-primary font-sans">
              ৳{course.price.toLocaleString("en-US")}
            </div>
            {course.originalPrice > course.price && (
              <div className="text-xs text-text-muted line-through font-sans">
                ৳{course.originalPrice.toLocaleString("en-US")}
              </div>
            )}
          </div>
          <Link
            href={`/course/${course.slug}`}
            className="btn btn-sm btn-outline group/btn flex items-center gap-1.5 text-xs font-bengali font-semibold"
          >
            <span>বিস্তারিত</span>
            <ArrowRight className="w-3.5 h-3.5 group-hover/btn:translate-x-0.5 transition-transform" />
          </Link>
        </div>
      </div>
    </div>
  );
}
