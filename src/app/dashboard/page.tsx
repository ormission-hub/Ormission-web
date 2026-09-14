import Link from "next/link";
import Image from "next/image";
import { Play, BookOpen, Clock, Award, ArrowRight, CheckCircle2, Flame } from "lucide-react";
import { COURSES } from "@/lib/data/courses";

export default function DashboardOverviewPage() {
  const activeCourse = COURSES[0]; // BUET Physics
  const otherCourses = COURSES.slice(1, 3); // Medical Bio & HSC Math

  return (
    <div className="space-y-8">
      {/* Welcome Banner */}
      <div className="bg-surface rounded-lg border border-border p-6 lg:p-8 shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-semibold text-secondary font-bengali px-2.5 py-0.5 rounded bg-secondary/10 inline-block mb-2">
            আজকের স্টাডি সেশন
          </span>
          <h1 className="text-2xl lg:text-3xl font-bold text-text font-bengali tracking-tight">
            স্বাগতম, সাদমান ইসলাম!
          </h1>
          <p className="text-xs lg:text-sm text-text-muted font-bengali mt-1">
            আপনার লক্ষ্য অর্জনে প্রতিদিনের ধারাবাহিকতাই মূল চাবিকাঠি। আজ ১টি নতুন লেসন সম্পন্ন করার টার্গেট নিন!
          </p>
        </div>
        <div className="flex items-center gap-2 bg-surface-secondary px-4 py-2.5 rounded-lg shrink-0 border border-border">
          <Flame className="w-5 h-5 text-accent animate-pulse" />
          <div>
            <span className="text-xs text-text-muted font-bengali block leading-tight">ধারাবাহিকতা:</span>
            <span className="text-sm font-bold text-text font-sans">৭ দিনের স্ট্রিক!</span>
          </div>
        </div>
      </div>

      {/* KPI Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-surface rounded-lg border border-border p-5 flex items-center gap-4">
          <div className="w-12 h-12 rounded-lg bg-primary/10 text-primary flex items-center justify-center shrink-0">
            <BookOpen className="w-6 h-6" />
          </div>
          <div>
            <span className="text-2xl font-bold text-text font-sans">৩</span>
            <span className="text-xs text-text-muted font-bengali block">চলমান কোর্স</span>
          </div>
        </div>

        <div className="bg-surface rounded-lg border border-border p-5 flex items-center gap-4">
          <div className="w-12 h-12 rounded-lg bg-secondary/10 text-secondary flex items-center justify-center shrink-0">
            <Clock className="w-6 h-6" />
          </div>
          <div>
            <span className="text-2xl font-bold text-text font-sans">৪২</span>
            <span className="text-xs text-text-muted font-bengali block">ঘণ্টা সম্পন্ন হয়েছে</span>
          </div>
        </div>

        <div className="bg-surface rounded-lg border border-border p-5 flex items-center gap-4">
          <div className="w-12 h-12 rounded-lg bg-accent/15 text-accent flex items-center justify-center shrink-0">
            <Award className="w-6 h-6" />
          </div>
          <div>
            <span className="text-2xl font-bold text-text font-sans">১</span>
            <span className="text-xs text-text-muted font-bengali block">অর্জিত সার্টিফিকেট</span>
          </div>
        </div>
      </div>

      {/* Continue Learning Featured Card */}
      <div className="bg-surface rounded-lg border-2 border-primary/30 p-6 shadow-sm relative overflow-hidden">
        <div className="flex flex-col lg:flex-row gap-6 items-start lg:items-center justify-between">
          <div className="flex gap-4 items-start">
            <div className="relative w-24 h-16 rounded-md overflow-hidden shrink-0 bg-slate-900 border border-border">
              <Image
                src={activeCourse.thumbnail}
                alt={activeCourse.titleBn}
                fill
                className="object-cover"
              />
            </div>
            <div>
              <span className="text-xs font-semibold text-primary font-bengali">
                সর্বশেষ দেখা ক্লাস
              </span>
              <h3 className="font-bold text-base lg:text-lg text-text font-bengali leading-snug">
                {activeCourse.titleBn}
              </h3>
              <p className="text-xs text-text-muted font-bengali mt-0.5">
                পরবর্তী লেসন: ৩. পরিবর্তনশীল ভর: রকেটের গতি ও ত্বরণ বিশ্লেষণ
              </p>

              {/* Progress Bar */}
              <div className="w-full max-w-xs mt-3">
                <div className="flex items-center justify-between text-[11px] text-text-muted font-sans mb-1">
                  <span>অগ্রগতি</span>
                  <span className="font-bold text-primary">৬৫%</span>
                </div>
                <div className="w-full h-2 bg-surface-secondary rounded-full overflow-hidden">
                  <div className="h-full bg-primary rounded-full" style={{ width: "65%" }} />
                </div>
              </div>
            </div>
          </div>

          <Link
            href={`/course/${activeCourse.slug}/learn/l-1-3`}
            className="btn btn-primary font-bengali font-bold px-6 py-3 flex items-center gap-2 shrink-0 shadow-sm"
          >
            <Play className="w-4 h-4 fill-white" />
            <span>ক্লাস চালিয়ে যান</span>
          </Link>
        </div>
      </div>

      {/* Enrolled Courses Section */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold text-text font-bengali">
            আমার অন্যান্য কোর্সসমূহ
          </h2>
          <Link
            href="/dashboard/my-courses"
            className="text-xs text-primary font-bold font-bengali hover:underline"
          >
            সকল কোর্স দেখুন
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {otherCourses.map((course, idx) => {
            const progress = idx === 0 ? 40 : 15;

            return (
              <div
                key={course.id}
                className="bg-surface rounded-lg border border-border p-5 flex flex-col justify-between hover:border-primary/40 transition-all"
              >
                <div>
                  <div className="flex gap-3 mb-4">
                    <div className="relative w-20 h-14 rounded overflow-hidden shrink-0 bg-slate-900 border border-border">
                      <Image
                        src={course.thumbnail}
                        alt={course.titleBn}
                        fill
                        className="object-cover"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <span className="text-[11px] text-secondary font-bengali font-semibold block">
                        {course.categoryNameBn}
                      </span>
                      <h4 className="font-bold text-sm text-text font-bengali line-clamp-2 leading-snug">
                        {course.titleBn}
                      </h4>
                    </div>
                  </div>

                  {/* Progress */}
                  <div className="mb-4">
                    <div className="flex items-center justify-between text-xs text-text-muted font-sans mb-1">
                      <span>সম্পন্ন</span>
                      <span className="font-semibold text-text">{progress}%</span>
                    </div>
                    <div className="w-full h-1.5 bg-surface-secondary rounded-full overflow-hidden">
                      <div
                        className="h-full bg-secondary rounded-full"
                        style={{ width: `${progress}%` }}
                      />
                    </div>
                  </div>
                </div>

                <Link
                  href={`/course/${course.slug}/learn/l-1-1`}
                  className="btn btn-outline btn-sm font-bengali font-semibold flex items-center justify-center gap-1.5 text-xs w-full"
                >
                  <Play className="w-3.5 h-3.5" />
                  <span>ক্লাস শুরু করুন</span>
                </Link>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
