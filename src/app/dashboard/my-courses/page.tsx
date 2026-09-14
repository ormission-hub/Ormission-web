"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Play, BookOpen, Clock, Award, CheckCircle2 } from "lucide-react";
import { COURSES } from "@/lib/data/courses";

export default function MyCoursesPage() {
  const [filter, setFilter] = useState<"all" | "in-progress" | "completed">("all");

  const myCourses = [
    { course: COURSES[0], progress: 65, completedLessons: 53, totalLessons: 82 },
    { course: COURSES[1], progress: 40, completedLessons: 30, totalLessons: 74 },
    { course: COURSES[2], progress: 100, completedLessons: 90, totalLessons: 90 },
  ];

  const filtered = myCourses.filter((item) => {
    if (filter === "in-progress") return item.progress < 100;
    if (filter === "completed") return item.progress === 100;
    return true;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-text font-bengali">
            আমার নথিভুক্ত কোর্সসমূহ
          </h1>
          <p className="text-xs text-text-muted font-bengali mt-0.5">
            আপনার ক্রয়কৃত সকল কোর্স ও ক্লাসের বর্তমান অগ্রগতি
          </p>
        </div>

        {/* Filter Tabs */}
        <div className="flex items-center gap-1.5 p-1 bg-surface-secondary rounded-lg text-xs font-bengali font-semibold">
          <button
            type="button"
            onClick={() => setFilter("all")}
            className={`px-3 py-1.5 rounded-md transition-all ${
              filter === "all"
                ? "bg-surface text-primary shadow-xs"
                : "text-text-muted hover:text-text"
            }`}
          >
            সকল ({myCourses.length})
          </button>
          <button
            type="button"
            onClick={() => setFilter("in-progress")}
            className={`px-3 py-1.5 rounded-md transition-all ${
              filter === "in-progress"
                ? "bg-surface text-primary shadow-xs"
                : "text-text-muted hover:text-text"
            }`}
          >
            চলমান (২)
          </button>
          <button
            type="button"
            onClick={() => setFilter("completed")}
            className={`px-3 py-1.5 rounded-md transition-all ${
              filter === "completed"
                ? "bg-surface text-primary shadow-xs"
                : "text-text-muted hover:text-text"
            }`}
          >
            সম্পন্ন (১)
          </button>
        </div>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {filtered.map(({ course, progress, completedLessons, totalLessons }) => {
          const isCompleted = progress === 100;

          return (
            <div
              key={course.id}
              className="bg-surface rounded-lg border border-border overflow-hidden flex flex-col justify-between hover:border-primary/40 hover:shadow-xs transition-all"
            >
              <div>
                <div className="relative aspect-video w-full overflow-hidden bg-slate-900">
                  <Image
                    src={course.thumbnail}
                    alt={course.titleBn}
                    fill
                    className="object-cover"
                  />
                  {isCompleted && (
                    <span className="absolute top-3 right-3 px-2.5 py-1 rounded bg-success text-white text-xs font-semibold font-bengali flex items-center gap-1 shadow-xs">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>সম্পন্ন হয়েছে</span>
                    </span>
                  )}
                </div>

                <div className="p-5">
                  <span className="text-xs font-semibold text-secondary font-bengali">
                    {course.categoryNameBn}
                  </span>
                  <h3 className="font-bold text-base text-text font-bengali line-clamp-2 mt-1 mb-4 leading-snug">
                    {course.titleBn}
                  </h3>

                  {/* Progress Bar */}
                  <div className="space-y-1.5 mb-4">
                    <div className="flex items-center justify-between text-xs text-text-muted font-bengali">
                      <span>অগ্রগতি: {completedLessons}/{totalLessons} লেসন</span>
                      <span className="font-bold text-text font-sans">{progress}%</span>
                    </div>
                    <div className="w-full h-2 bg-surface-secondary rounded-full overflow-hidden">
                      <div
                        className={`h-full rounded-full transition-all duration-500 ${
                          isCompleted ? "bg-success" : "bg-primary"
                        }`}
                        style={{ width: `${progress}%` }}
                      />
                    </div>
                  </div>
                </div>
              </div>

              <div className="p-5 pt-0">
                <Link
                  href={`/course/${course.slug}/learn/l-1-1`}
                  className={`btn btn-sm w-full font-bengali font-semibold flex items-center justify-center gap-2 ${
                    isCompleted ? "btn-outline" : "btn-primary"
                  }`}
                >
                  <Play className="w-3.5 h-3.5 fill-current" />
                  <span>{isCompleted ? "পুনরায় ক্লাস রিভিশন করুন" : "ক্লাস চালিয়ে যান"}</span>
                </Link>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
