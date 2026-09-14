"use client";

import { useState, use } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  CheckCircle2,
  Circle,
  Play,
  FileDown,
  ChevronLeft,
  ChevronRight,
  Menu,
  X,
  BookOpen,
  Download,
  Share2,
} from "lucide-react";
import { getCourseBySlug, COURSES, type Lesson } from "@/lib/data/courses";

interface PlayerPageProps {
  params: Promise<{ slug: string; lesson: string }>;
}

export default function CoursePlayerPage({ params }: PlayerPageProps) {
  const router = useRouter();
  const resolvedParams = use(params);
  const { slug, lesson: lessonId } = resolvedParams;

  const course = getCourseBySlug(slug) || COURSES[0];

  // Find current lesson across all sections
  let currentLesson: Lesson = course.curriculum[0]?.lessons[0];
  let currentSectionTitle = course.curriculum[0]?.titleBn || "";

  for (const section of course.curriculum) {
    const found = section.lessons.find((l) => l.id === lessonId);
    if (found) {
      currentLesson = found;
      currentSectionTitle = section.titleBn;
      break;
    }
  }

  // Completed lessons state
  const [completedLessons, setCompletedLessons] = useState<Record<string, boolean>>({
    "l-1-1": true,
    "l-1-2": true,
  });

  const [sidebarOpen, setSidebarOpen] = useState(true);

  const toggleComplete = (id: string) => {
    setCompletedLessons((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  // Find all lessons in flat order for prev/next navigation
  const allLessons = course.curriculum.flatMap((s) => s.lessons);
  const currentIndex = allLessons.findIndex((l) => l.id === currentLesson.id);
  const prevLesson = currentIndex > 0 ? allLessons[currentIndex - 1] : null;
  const nextLesson = currentIndex < allLessons.length - 1 ? allLessons[currentIndex + 1] : null;

  const totalCompleted = Object.values(completedLessons).filter(Boolean).length;
  const progressPercent = Math.round((totalCompleted / allLessons.length) * 100);

  return (
    <div className="bg-slate-950 text-slate-100 min-h-screen flex flex-col">
      {/* Distraction-Free Top Bar */}
      <header className="h-14 border-b border-slate-800 bg-slate-900/90 px-4 flex items-center justify-between shrink-0 z-30">
        <div className="flex items-center gap-3">
          <Link
            href="/dashboard/my-courses"
            className="p-1.5 rounded hover:bg-slate-800 text-slate-400 hover:text-white transition-colors"
            title="ড্যাশবোর্ডে ফিরে যান"
          >
            <ArrowLeft className="w-4 h-4" />
          </Link>
          <div className="border-l border-slate-800 pl-3">
            <h1 className="font-bold text-xs lg:text-sm text-white font-bengali truncate max-w-xs lg:max-w-md">
              {course.titleBn}
            </h1>
            <span className="text-[11px] text-slate-400 font-bengali">
              {currentSectionTitle}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-4">
          {/* Progress Indicator */}
          <div className="hidden sm:flex items-center gap-2 text-xs text-slate-300 font-bengali">
            <span>অগ্রগতি: {progressPercent}%</span>
            <div className="w-24 h-2 bg-slate-800 rounded-full overflow-hidden">
              <div
                className="h-full bg-primary rounded-full transition-all duration-300"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
          </div>

          <button
            type="button"
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="btn btn-sm btn-outline text-xs text-slate-200 border-slate-700 hover:bg-slate-800 font-bengali flex items-center gap-1.5"
          >
            <BookOpen className="w-3.5 h-3.5" />
            <span>{sidebarOpen ? "কারিকুলাম লুকান" : "কারিকুলাম দেখুন"}</span>
          </button>
        </div>
      </header>

      {/* Main Layout: Video on Left, Curriculum Sidebar on Right */}
      <div className="flex-1 flex flex-col lg:flex-row overflow-hidden">
        {/* Video & Lesson Content (Left) */}
        <div className="flex-1 flex flex-col overflow-y-auto">
          {/* Responsive Video Container */}
          <div className="relative aspect-video w-full bg-black shrink-0">
            <iframe
              src="https://www.youtube-nocookie.com/embed/dQw4w9WgXcQ?rel=0&modestbranding=1"
              title={currentLesson.titleBn}
              className="w-full h-full border-0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          </div>

          {/* Player Controls Bar */}
          <div className="bg-slate-900 border-b border-slate-800 p-4 flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => toggleComplete(currentLesson.id)}
                className={`btn btn-sm text-xs font-bengali flex items-center gap-1.5 transition-colors ${
                  completedLessons[currentLesson.id]
                    ? "bg-success/20 text-success border border-success/30 hover:bg-success/30"
                    : "btn-outline border-slate-700 text-slate-300 hover:bg-slate-800"
                }`}
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>
                  {completedLessons[currentLesson.id] ? "লেসন সম্পন্ন হয়েছে" : "সম্পন্ন হিসেবে চিহ্নিত করুন"}
                </span>
              </button>
            </div>

            {/* Prev / Next buttons */}
            <div className="flex items-center gap-2">
              {prevLesson ? (
                <Link
                  href={`/course/${course.slug}/learn/${prevLesson.id}`}
                  className="btn btn-sm btn-outline border-slate-700 text-slate-300 hover:bg-slate-800 text-xs font-bengali flex items-center gap-1"
                >
                  <ChevronLeft className="w-3.5 h-3.5" />
                  <span>পূর্ববর্তী ক্লাস</span>
                </Link>
              ) : (
                <button
                  disabled
                  className="btn btn-sm btn-outline border-slate-800 text-slate-600 text-xs font-bengali cursor-not-allowed opacity-50"
                >
                  পূর্ববর্তী ক্লাস
                </button>
              )}

              {nextLesson ? (
                <Link
                  href={`/course/${course.slug}/learn/${nextLesson.id}`}
                  className="btn btn-sm btn-primary text-xs font-bengali flex items-center gap-1 font-bold"
                >
                  <span>পরবর্তী ক্লাস</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </Link>
              ) : (
                <button
                  disabled
                  className="btn btn-sm btn-outline border-slate-800 text-slate-600 text-xs font-bengali cursor-not-allowed opacity-50"
                >
                  কোর্সের শেষ ক্লাস
                </button>
              )}
            </div>
          </div>

          {/* Lesson Details & Downloadable Resources */}
          <div className="p-6 lg:p-8 space-y-6 max-w-4xl">
            <div>
              <span className="text-xs font-semibold text-primary font-bengali block mb-1">
                বর্তমান ক্লাস:
              </span>
              <h2 className="text-xl lg:text-2xl font-bold text-white font-bengali">
                {currentLesson.titleBn}
              </h2>
              <p className="text-xs text-slate-400 font-sans mt-0.5">
                {currentLesson.title} • সময়কাল: {currentLesson.duration}
              </p>
            </div>

            {/* Lesson Resources Download Card */}
            <div className="bg-slate-900 rounded-lg border border-slate-800 p-4 sm:p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-primary/15 text-primary flex items-center justify-center shrink-0">
                  <FileDown className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-bold text-sm text-white font-bengali">
                    ক্লাস লেকচার শিট ও প্র্যাকটিস নোট
                  </h4>
                  <p className="text-xs text-slate-400 font-sans">
                    PDF Document • 4.2 MB • High Resolution
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => alert("লেকচার শিট PDF ডাউনলোড শুরু হচ্ছে...")}
                className="btn btn-sm btn-outline border-slate-700 text-slate-200 hover:bg-slate-800 font-bengali text-xs font-semibold flex items-center gap-1.5 shrink-0"
              >
                <Download className="w-3.5 h-3.5" />
                <span>পিডিএফ ডাউনলোড</span>
              </button>
            </div>
          </div>
        </div>

        {/* Curriculum Sidebar (Right) */}
        {sidebarOpen && (
          <aside className="w-full lg:w-96 bg-slate-900 border-l border-slate-800 flex flex-col shrink-0 overflow-y-auto">
            <div className="p-4 border-b border-slate-800 flex items-center justify-between sticky top-0 bg-slate-900 z-10">
              <h3 className="font-bold text-sm text-white font-bengali">
                কোর্স কারিকুলাম
              </h3>
              <span className="text-xs text-slate-400 font-sans">
                {allLessons.length} Lessons
              </span>
            </div>

            <div className="divide-y divide-slate-800/80">
              {course.curriculum.map((section, sIdx) => (
                <div key={section.id} className="p-3">
                  <h4 className="text-xs font-bold text-slate-300 font-bengali mb-2 px-2">
                    {section.titleBn}
                  </h4>
                  <div className="space-y-1">
                    {section.lessons.map((lesson) => {
                      const isActive = lesson.id === currentLesson.id;
                      const isDone = completedLessons[lesson.id];

                      return (
                        <Link
                          key={lesson.id}
                          href={`/course/${course.slug}/learn/${lesson.id}`}
                          className={`flex items-start gap-2.5 p-2 rounded-md text-xs font-bengali transition-colors ${
                            isActive
                              ? "bg-primary text-white font-semibold"
                              : "text-slate-300 hover:bg-slate-800/80"
                          }`}
                        >
                          <button
                            type="button"
                            onClick={(e) => {
                              e.preventDefault();
                              e.stopPropagation();
                              toggleComplete(lesson.id);
                            }}
                            className="shrink-0 mt-0.5"
                          >
                            {isDone ? (
                              <CheckCircle2
                                className={`w-3.5 h-3.5 ${
                                  isActive ? "text-white" : "text-success"
                                }`}
                              />
                            ) : (
                              <Circle
                                className={`w-3.5 h-3.5 ${
                                  isActive ? "text-white/60" : "text-slate-500"
                                }`}
                              />
                            )}
                          </button>
                          <div className="flex-1 min-w-0">
                            <span className="truncate block leading-tight">
                              {lesson.titleBn}
                            </span>
                            <span
                              className={`text-[11px] font-sans ${
                                isActive ? "text-white/80" : "text-slate-500"
                              }`}
                            >
                              {lesson.duration}
                            </span>
                          </div>
                        </Link>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          </aside>
        )}
      </div>
    </div>
  );
}
