"use client";

import { useState, useEffect, use } from "react";
import Link from "next/link";
import { useRouter, notFound } from "next/navigation";
import {
  ArrowLeft,
  CheckCircle2,
  Play,
  ChevronLeft,
  ChevronRight,
  BookOpen,
  Clock,
  Sparkles,
  Layers,
  Lock,
  Unlock,
  ShieldCheck,
  Loader2,
  Receipt,
  FileText,
  File,
  FolderDown,
  Download,
  ExternalLink,
  Paperclip,
} from "lucide-react";
import { getCourseBySlug, COURSES, type Course, type Lesson } from "@/lib/data/courses";
import { CustomVideoPlayer, extractYouTubeId } from "@/components/video/custom-video-player";
import { HlsVideoPlayer } from "@/components/video/hls-video-player";
import { DevToolsDetector } from "@/components/video/devtools-detector";
import { decryptVideoUrlClient, decryptServersArray } from "@/lib/crypto/decrypt-video-client";
import { createClient } from "@/lib/supabase/client";
import { mapDbCourseToAppCourse } from "@/lib/supabase/course-mapper";
import { getEmbedUrl, isHlsUrl } from "@/lib/video-helpers";

interface PlayerPageProps {
  params: Promise<{ slug: string; lesson: string }>;
}

export default function CoursePlayerPage({ params }: PlayerPageProps) {
  const router = useRouter();
  const resolvedParams = use(params);
  const { slug, lesson: lessonId } = resolvedParams;

  const [course, setCourse] = useState<Course | null>(null);
  const [courseLoading, setCourseLoading] = useState(true);

  // Load live course from Supabase
  useEffect(() => {
    async function loadLiveCourse() {
      try {
        const supabase = createClient();
        const { data: dbCourse } = await supabase
          .from("courses")
          .select(`
            *,
            categories:category_id (*),
            instructors:instructor_id (*),
            course_sections (
              id,
              title,
              title_bn,
              sort_order,
              lessons (
                id,
                title,
                title_bn,
                type,
                content,
                video_url,
                video_duration,
                is_preview,
                is_published,
                sort_order,
                lesson_servers (
                  id,
                  server_name,
                  server_type,
                  video_url,
                  is_enabled,
                  sort_order
                ),
                lesson_resources (
                  id,
                  title,
                  file_url,
                  file_type,
                  file_size,
                  sort_order
                )
              )
            )
          `)
          .eq("slug", slug)
          .maybeSingle();

        if (dbCourse) {
          const mapped = mapDbCourseToAppCourse(dbCourse);
          setCourse(mapped);
        }
      } catch (err) {
        console.warn("Could not load live course:", err);
        // Only use static fallback if DB failed entirely
        const staticFallback = getCourseBySlug(slug);
        if (staticFallback) setCourse(staticFallback);
      } finally {
        setCourseLoading(false);
      }
    }
    loadLiveCourse();
  }, [slug]);

  // Find all lessons in flat order for prev/next navigation
  const allLessons = course?.curriculum
    ? course.curriculum.flatMap((s) => s.lessons || [])
    : [];

  // Find current lesson across all sections
  let currentLesson: Lesson | undefined = undefined;
  let currentSectionTitle = "";

  if (course?.curriculum && course.curriculum.length > 0) {
    for (const section of course.curriculum) {
      const found = section.lessons?.find((l) => String(l.id) === String(lessonId));
      if (found) {
        currentLesson = found;
        currentSectionTitle = section.titleBn || section.title || "";
        break;
      }
    }
  }

  // AUTO-RECOVERY: If the requested lessonId (e.g. "l-1-1" or "les-1") does not exist in the course,
  // but the course DOES have lessons, auto-select the first lesson so the student never sees a 404!
  if (!currentLesson && allLessons.length > 0) {
    currentLesson = allLessons[0];
    for (const section of (course?.curriculum || [])) {
      if (section.lessons?.some((l) => String(l.id) === String(currentLesson?.id))) {
        currentSectionTitle = section.titleBn || section.title || "";
        break;
      }
    }
  }

  // Silently update the browser URL to match the auto-recovered lesson ID
  useEffect(() => {
    if (course && allLessons.length > 0 && currentLesson && String(lessonId) !== String(currentLesson.id)) {
      router.replace(`/course/${slug}/learn/${currentLesson.id}`);
    }
  }, [course, allLessons, currentLesson, lessonId, slug, router]);

  const [isLoggedIn, setIsLoggedIn] = useState(false);

  // Strict Anti-Bypass Access State
  const [accessStatus, setAccessStatus] = useState<{
    checking: boolean;
    authorized: boolean;
    videoUrl?: string;
    servers?: { name: string; type: string; url: string }[];
    isFreePreview?: boolean;
    isEncrypted?: boolean;
    videoSessionToken?: string;
    reason?: string;
    isPending?: boolean;
    orderNumber?: string;
    transactionId?: string;
    message?: string;
  }>({
    checking: true,
    authorized: false,
  });

  const [selectedServerIndex, setSelectedServerIndex] = useState(0);

  // Verify access for current lesson via backend server endpoint
  useEffect(() => {
    let isMounted = true;

    async function checkLessonAccess() {
      setAccessStatus({ checking: true, authorized: false });
      try {
        const supabase = createClient();
        const {
          data: { session },
        } = await supabase.auth.getSession();

        if (isMounted) {
          setIsLoggedIn(!!session?.user);
        }

        const res = await fetch("/api/course/access", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            ...(session?.access_token ? { Authorization: `Bearer ${session.access_token}` } : {}),
          },
          body: JSON.stringify({
            courseSlug: slug,
            lessonId: currentLesson?.id || lessonId,
          }),
        });

        if (!res.ok) {
          const errData = await res.json().catch(() => ({}));
          throw new Error(errData?.error || "Access check failed");
        }
        const data = await res.json();
        if (isMounted) {
          if (data.authorized && data.videoUrl) {
            let finalVideoUrl = data.videoUrl;
            let finalServers = Array.isArray(data.servers) ? data.servers : [];

            // If video is encrypted (AES-256-GCM), fetch key and decrypt in memory
            if (data.isEncrypted) {
              try {
                const keyRes = await fetch("/api/course/video-key", {
                  method: "POST",
                  headers: {
                    "Content-Type": "application/json",
                    ...(session?.access_token ? { Authorization: `Bearer ${session.access_token}` } : {}),
                    ...(data.videoSessionToken ? { "X-Video-Session-Token": data.videoSessionToken } : {}),
                  },
                  body: JSON.stringify({
                    videoSessionToken: data.videoSessionToken,
                  }),
                });
                if (keyRes.ok) {
                  const keyData = await keyRes.json();
                  if (keyData.k) {
                    const decryptedUrl = await decryptVideoUrlClient(data.videoUrl, keyData.k);
                    if (decryptedUrl) {
                      finalVideoUrl = decryptedUrl;
                    }
                    if (finalServers.length > 0) {
                      finalServers = await decryptServersArray(finalServers, keyData.k);
                    }
                  }
                }
              } catch (decryptErr) {
                console.error("Video decryption error:", decryptErr);
              }
            }

            setAccessStatus({
              checking: false,
              authorized: true,
              videoUrl: finalVideoUrl,
              servers: finalServers,
              isFreePreview: data.isFreePreview,
              isEncrypted: data.isEncrypted,
              videoSessionToken: data.videoSessionToken,
            });
            setSelectedServerIndex(0);
          } else {
            setAccessStatus({
              checking: false,
              authorized: data.authorized || false,
              reason: data.reason || "locked",
              isPending: !!data.isPending,
              orderNumber: data.orderNumber,
              transactionId: data.transactionId,
              message: data.message,
            });
          }
        }
      } catch (err) {
        if (isMounted) {
          // SECURITY: No client-side videoUrl fallback — all URLs come from server API only
          setAccessStatus({
            checking: false,
            authorized: false,
            reason: "network_error",
            message: "নেটওয়ার্ক সমস্যা হয়েছে। আবার চেষ্টা করুন।",
          });
        }
      }
    }

    if (currentLesson) {
      checkLessonAccess();
    }

    return () => {
      isMounted = false;
    };
  }, [slug, currentLesson?.id, lessonId]);

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

  // 1. Loading guard
  if (courseLoading) {
    return (
      <div className="bg-slate-950 text-slate-100 min-h-screen flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
          <span className="text-sm text-slate-400 font-bengali">কোর্স লোড হচ্ছে...</span>
        </div>
      </div>
    );
  }

  // 2. Course does not exist -> 404
  if (!course) {
    notFound();
  }

  // 3. Lesson does not exist in this course -> 404 Not Found
  if (!currentLesson) {
    return (
      <div className="bg-slate-950 text-slate-100 min-h-screen flex flex-col items-center justify-center p-6 text-center font-bengali">
        <div className="max-w-md w-full flex flex-col items-center">
          <div className="w-16 h-16 rounded-2xl bg-red-500/10 border border-red-500/20 text-red-400 flex items-center justify-center mb-5 shadow-xl">
            <BookOpen className="w-8 h-8" />
          </div>

          <span className="text-5xl font-extrabold text-primary font-sans block mb-2">
            404
          </span>

          <h1 className="text-xl sm:text-2xl font-bold text-white mb-2">
            লেসনটি খুঁজে পাওয়া যায়নি
          </h1>

          <p className="text-xs sm:text-sm text-slate-400 leading-relaxed mb-6">
            আপনি যে লেসন আইডি (<code className="text-primary font-mono px-1.5 py-0.5 rounded bg-slate-900 border border-slate-800">{lessonId}</code>) খুঁজছেন তা এই কোর্সে বিদ্যমান নেই।
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 w-full">
            {allLessons.length > 0 && (
              <Link
                href={`/course/${slug}/learn/${allLessons[0].id}`}
                className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-primary hover:bg-primary/90 text-white text-xs font-bold transition-all shadow-lg shadow-primary/20 flex items-center justify-center gap-2 cursor-pointer"
              >
                <Play className="w-4 h-4 fill-white" />
                <span>প্রথম লেসন দেখুন</span>
              </Link>
            )}

            <Link
              href={`/course/${slug}`}
              className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium transition-all border border-slate-700 flex items-center justify-center gap-2 cursor-pointer"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>কোর্সের বিস্তারিত পাতা</span>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // 4. If course has no lessons at all yet
  if (allLessons.length === 0) {
    return (
      <div className="bg-slate-950 text-slate-100 min-h-screen flex flex-col font-bengali">
        <header className="h-14 sticky top-0 border-b border-slate-800 bg-slate-900 px-4 flex items-center justify-between shrink-0 z-40">
          <div className="flex items-center gap-3">
            <Link
              href={`/course/${course.slug}`}
              className="p-1.5 rounded hover:bg-slate-800 text-slate-400 hover:text-white transition-colors"
              title="কোর্সে ফিরে যান"
            >
              <ArrowLeft className="w-4 h-4" />
            </Link>
            <div className="border-l border-slate-800 pl-3">
              <h1 className="font-bold text-xs lg:text-sm text-white truncate max-w-xs lg:max-w-md">
                {course.titleBn || course.title}
              </h1>
              <span className="text-[11px] text-slate-400">অনলাইন ক্লাসরুম</span>
            </div>
          </div>

          <Link
            href="/dashboard/my-courses"
            className="btn btn-sm btn-outline text-xs text-slate-200 border-slate-700 hover:bg-slate-800 flex items-center gap-1.5"
          >
            <span>আমার ড্যাশবোর্ড</span>
          </Link>
        </header>

        <div className="flex-1 flex items-center justify-center p-6">
          <div className="max-w-md w-full text-center space-y-5 bg-slate-900/60 border border-slate-800/80 rounded-3xl p-8 backdrop-blur-sm shadow-2xl">
            <div className="w-16 h-16 rounded-2xl bg-primary/10 border border-primary/25 text-primary flex items-center justify-center mx-auto shadow-lg shadow-primary/10">
              <BookOpen className="w-8 h-8 animate-pulse" />
            </div>

            <div className="space-y-2">
              <span className="px-3 py-1 rounded-full text-[11px] font-bold bg-primary/15 text-primary border border-primary/30">
                শীঘ্রই ক্লাস শুরু হচ্ছে
              </span>
              <h2 className="text-xl sm:text-2xl font-black text-white">
                ক্লাসসমূহ আপলোড প্রক্রিয়াধীন রয়েছে
              </h2>
              <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
                '{course.titleBn || course.title}' কোর্সে এখনো কোনো ক্লাস বা ভিডিও আপলোড করা হয়নি। শিক্ষক ও মেন্টর দল খুব শীঘ্রই রুটিন অনুযায়ী ক্লাস আপলোড করবেন।
              </p>
            </div>

            <div className="pt-3 flex flex-col sm:flex-row items-center justify-center gap-3">
              <Link
                href={`/course/${course.slug}`}
                className="btn btn-primary font-bold w-full sm:w-auto px-5 py-2.5 text-xs flex items-center justify-center gap-2 cursor-pointer"
              >
                <span>কোর্সের বিবরণী দেখুন</span>
              </Link>
              <Link
                href="/dashboard/my-courses"
                className="btn btn-outline border-slate-700 text-slate-300 hover:text-white hover:bg-slate-800 w-full sm:w-auto px-5 py-2.5 text-xs flex items-center justify-center gap-2 cursor-pointer"
              >
                <span>আমার কোর্সসমূহ</span>
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const currentIndex = allLessons.findIndex((l) => l.id === currentLesson.id);
  const prevLesson = currentIndex > 0 ? allLessons[currentIndex - 1] : null;
  const nextLesson = currentIndex < allLessons.length - 1 ? allLessons[currentIndex + 1] : null;

  const totalCompleted = Object.values(completedLessons).filter(Boolean).length;
  const progressPercent = allLessons.length > 0
    ? Math.round((totalCompleted / allLessons.length) * 100)
    : 0;

  // Modern Class Selector Playlist UI Renderer
  const renderClassList = () => (
    <div className="space-y-3.5">
      {course.curriculum.map((section, sIdx) => {
        const sectionCompletedCount = section.lessons.filter(
          (l) => completedLessons[l.id]
        ).length;
        const isCurrentSection = section.lessons.some(
          (l) => l.id === currentLesson.id
        );

        return (
          <div
            key={section.id}
            className={`rounded-2xl border transition-all overflow-hidden ${
              isCurrentSection
                ? "border-primary/40 bg-slate-900/90 shadow-lg shadow-primary/5"
                : "border-slate-800/80 bg-slate-900/40"
            }`}
          >
            {/* Chapter Header */}
            <div className="p-3.5 sm:p-4 bg-slate-900/95 border-b border-slate-800/80 flex items-center justify-between gap-3">
              <div className="flex items-center gap-2.5 min-w-0">
                <span className="px-2 py-0.5 rounded-md bg-slate-800 border border-slate-700 text-slate-300 font-mono text-[11px] font-bold shrink-0">
                  {sIdx + 1 < 10 ? `০${sIdx + 1}` : sIdx + 1}
                </span>
                <h4 className="font-bold text-xs sm:text-sm text-white font-bengali truncate">
                  {section.titleBn}
                </h4>
              </div>
              <span className="text-[11px] text-slate-400 font-bengali shrink-0">
                {sectionCompletedCount}/{section.lessons.length} সম্পন্ন
              </span>
            </div>

            {/* Lessons in Chapter */}
            <div className="divide-y divide-slate-800/60 p-1.5 sm:p-2 space-y-1">
              {section.lessons.map((lesson, lIdx) => {
                const isActive = lesson.id === currentLesson.id;
                const isDone = completedLessons[lesson.id];

                return (
                  <Link
                    key={lesson.id}
                    href={`/course/${course.slug}/learn/${lesson.id}`}
                    className={`group flex items-center justify-between gap-3 p-3 rounded-xl transition-all cursor-pointer ${
                      isActive
                        ? "bg-slate-800/95 border-l-4 border-l-primary border-y border-r border-slate-700/80 shadow-md"
                        : isDone
                        ? "bg-slate-900/30 hover:bg-slate-800/50 border-l-4 border-l-emerald-500/70 border-y border-r border-slate-800/50"
                        : "hover:bg-slate-800/60 border border-transparent hover:border-slate-800/80"
                    }`}
                  >
                    {/* Left: Icon, Title, Subtitle */}
                    <div className="flex items-center gap-3 min-w-0">
                      {/* Completion Checkmark Button */}
                      <button
                        type="button"
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          toggleComplete(lesson.id);
                        }}
                        className="shrink-0 p-0.5 rounded hover:scale-110 transition-transform cursor-pointer"
                        title={isDone ? "অসম্পন্ন করুন" : "সম্পন্ন হিসেবে চিহ্নিত করুন"}
                      >
                        {isDone ? (
                          <div className="w-6 h-6 rounded-full bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 flex items-center justify-center">
                            <CheckCircle2 className="w-3.5 h-3.5" />
                          </div>
                        ) : (
                          <div className="w-6 h-6 rounded-full bg-slate-800 border border-slate-700 text-slate-400 group-hover:border-primary/40 flex items-center justify-center text-[10px] font-mono">
                            {lIdx + 1}
                          </div>
                        )}
                      </button>

                      <div className="min-w-0">
                        <div className="flex items-center gap-2">
                          <h5
                            className={`text-xs sm:text-sm font-bengali leading-snug truncate ${
                              isActive
                                ? "text-white font-bold"
                                : isDone
                                ? "text-slate-300 group-hover:text-white"
                                : "text-slate-300 group-hover:text-white"
                            }`}
                          >
                            {lesson.titleBn}
                          </h5>
                        </div>
                        <span className="text-[11px] text-slate-500 font-sans block mt-0.5">
                          {lesson.title}
                        </span>
                      </div>
                    </div>

                    {/* Right: Duration & Free/Paid badge */}
                    <div className="flex items-center gap-2 shrink-0">
                      {lesson.isFreePreview ? (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 text-[10px] font-bengali font-bold">
                          <Unlock className="w-2.5 h-2.5" />
                          <span>আনলক</span>
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-rose-500/15 border border-rose-500/30 text-rose-400 text-[10px] font-bengali font-bold">
                          <Lock className="w-2.5 h-2.5" />
                          <span>লক</span>
                        </span>
                      )}
                      {lesson.materials && lesson.materials.length > 0 && (
                        <span
                          className={`inline-flex items-center gap-1 px-1.5 py-0.5 rounded-md border text-[10px] font-bengali font-semibold ${
                            lesson.materials.some((m) => m.isFree)
                              ? "bg-emerald-500/15 border-emerald-500/30 text-emerald-400"
                              : "bg-sky-500/10 border-sky-500/25 text-sky-400"
                          }`}
                          title={`${lesson.materials.length}টি স্টাডি ম্যাটেরিয়াল ${
                            lesson.materials.some((m) => m.isFree) ? "(আনলক সহ)" : ""
                          }`}
                        >
                          <Paperclip className="w-2.5 h-2.5" />
                          <span>{lesson.materials.length}</span>
                        </span>
                      )}
                      <span className="text-[11px] font-mono text-slate-400 font-semibold bg-slate-800/80 px-2 py-0.5 rounded-md border border-slate-700/60">
                        {lesson.duration}
                      </span>
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>
        );
      })}
    </div>
  );



  return (
    <div className="bg-slate-950 text-slate-100 min-h-screen flex flex-col">
      {/* Distraction-Free Top Bar */}
      <header className="h-14 sticky top-0 border-b border-slate-800 bg-slate-900 px-4 flex items-center justify-between shrink-0 z-40">
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

        <div className="flex items-center gap-3">
          {/* Progress Indicator */}
          <div className="flex items-center gap-2 text-[11px] sm:text-xs text-slate-300 font-bengali">
            <span className="hidden sm:inline">অগ্রগতি:</span>
            <span className="font-mono font-bold text-primary">{progressPercent}%</span>
            <div className="w-16 sm:w-24 h-1.5 sm:h-2 bg-slate-800 rounded-full overflow-hidden">
              <div
                className="h-full bg-primary rounded-full transition-all duration-300"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
          </div>
        </div>
      </header>

      {/* Main Layout: Video & Content on Left, Curriculum Sidebar on Right */}
      <div className="flex-1 flex flex-col lg:flex-row overflow-hidden">
        {/* Main Content Area */}
        <div className="flex-1 flex flex-col overflow-y-auto">
          {/* Custom Branded Video Player OR High-End Anti-Bypass Locked Screen */}
          <div className="w-full bg-black shrink-0 shadow-2xl">
            {accessStatus.checking ? (
              <div className="w-full aspect-video bg-slate-950 flex flex-col items-center justify-center gap-3 text-slate-400 font-bengali">
                <Loader2 className="w-8 h-8 animate-spin text-primary" />
                <span className="text-xs font-medium">ক্লাসের সিকিউরিটি ভেরিফিকেশন চলছে...</span>
              </div>
            ) : accessStatus.authorized && accessStatus.videoUrl ? (
              <div className="w-full">
                {/* Video Player — wrapped in active DevToolsDetector for all paid servers */}
                {(() => {
                  const servers = accessStatus.servers || [];
                  const activeServer = servers[selectedServerIndex] || { name: "Server 1", type: "youtube", url: accessStatus.videoUrl };
                  const activeUrl = activeServer.url || accessStatus.videoUrl || "";
                  const activeType = activeServer.type || "youtube";

                  // Free class & preview videos use normal YouTube embed
                  // Only paid classes use CustomVideoPlayer with custom UI & security logic
                  const isPaidCourse = (course.price || 0) > 0 && !(course as any).is_free;
                  const isFreeClass = Boolean(accessStatus.isFreePreview || currentLesson.isFreePreview || !isPaidCourse);

                  return (
                    <DevToolsDetector enabled={!isFreeClass}>
                      {activeType === "hls" || isHlsUrl(activeUrl) ? (
                        <HlsVideoPlayer
                          src={activeUrl}
                          title={`${course.titleBn} — ${currentLesson.titleBn}`}
                          thumbnailUrl={course.thumbnail}
                          autoPlay={false}
                          initialDuration={currentLesson.duration}
                          token={accessStatus.videoSessionToken}
                          enableDevToolsProtection={!isFreeClass}
                          onEnded={() => {
                            setCompletedLessons((prev) => ({
                              ...prev,
                              [currentLesson.id]: true,
                            }));
                          }}
                        />
                      ) : activeType === "youtube" ? (
                        isFreeClass ? (
                          <div className="w-full aspect-video bg-black">
                            <iframe
                              src={`https://www.youtube.com/embed/${extractYouTubeId(activeUrl)}?rel=0&autoplay=1`}
                              className="w-full h-full border-0"
                              allowFullScreen
                              referrerPolicy="strict-origin-when-cross-origin"
                              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                              title={`${course.titleBn} — ${currentLesson.titleBn} — ফ্রি ক্লাস`}
                            />
                          </div>
                        ) : (
                          <CustomVideoPlayer
                            videoUrlOrId={activeUrl}
                            title={`${course.titleBn} — ${currentLesson.titleBn}`}
                            thumbnailUrl={course.thumbnail}
                            autoPlay={false}
                            initialDuration={currentLesson.duration}
                            enableDevToolsProtection={true}
                            onEnded={() => {
                              setCompletedLessons((prev) => ({
                                ...prev,
                                [currentLesson.id]: true,
                              }));
                            }}
                          />
                        )
                      ) : activeType === "streamtape" || activeType === "embed" || activeType === "abyss" ? (
                        <div className="w-full aspect-video bg-black relative flex items-center justify-center overflow-hidden shadow-2xl">
                          {/* Honeypot decoy trap for Server 2 & 3 & 4 */}
                          <div className="sr-only hidden" aria-hidden="true" tabIndex={-1}>
                            <a
                              href={activeType === "streamtape" ? "https://streamtape.com/e/dQw4w9WgXcQ_decoy/" : activeType === "abyss" ? "https://player.abyssplayer.com/dQw4w9WgXcQ_decoy" : "https://avcaption.com/watch/decoy_68f871a4d6c82a2f841fab1e30da"}
                              className="video-source-stream-ref server-manifest-url"
                              rel="nofollow noreferrer"
                              tabIndex={-1}
                            >
                              Stream Source
                            </a>
                            <input
                              type="hidden"
                              name="source_manifest_url"
                              value={activeType === "streamtape" ? "https://streamtape.com/e/dQw4w9WgXcQ_decoy/" : activeType === "abyss" ? "https://player.abyssplayer.com/dQw4w9WgXcQ_decoy" : "https://avcaption.com/watch/decoy_68f871a4d6c82a2f841fab1e30da"}
                            />
                            <meta
                              itemProp="contentUrl"
                              content={activeType === "streamtape" ? "https://streamtape.com/e/dQw4w9WgXcQ_decoy/" : activeType === "abyss" ? "https://player.abyssplayer.com/dQw4w9WgXcQ_decoy" : "https://avcaption.com/watch/decoy_68f871a4d6c82a2f841fab1e30da"}
                            />
                          </div>

                          {(() => {
                            const isYt = /youtu\.be|youtube\.com|youtube-nocookie\.com/i.test(activeUrl);
                            const isStreamtape = activeType === "streamtape" || /streamtape\.(com|to|net|pe|xyz|site|cash|cc)|streamta\.pe/i.test(activeUrl);
                            const isAbyss = activeType === "abyss" || /abyss/i.test(activeUrl) || activeUrl.includes("/api/player/abyss");
                            return (
                              <iframe
                                src={getEmbedUrl(activeUrl)}
                                className="w-full h-full border-0 absolute inset-0"
                                sandbox={isYt || isStreamtape || isAbyss ? undefined : "allow-scripts allow-same-origin allow-presentation allow-forms"}
                                referrerPolicy="strict-origin-when-cross-origin"
                                allowFullScreen
                                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                                scrolling="no"
                                title={`${course.titleBn} — ${currentLesson.titleBn} — ${activeServer.name}`}
                              />
                            );
                          })()}
                        </div>
                      ) : (
                        <div className="w-full aspect-video bg-black">
                          <video
                            src={activeUrl}
                            className="w-full h-full"
                            controls
                            controlsList="nodownload"
                            onContextMenu={(e) => e.preventDefault()}
                            onEnded={() => {
                              setCompletedLessons((prev) => ({
                                ...prev,
                                [currentLesson.id]: true,
                              }));
                            }}
                          />
                        </div>
                      )}
                    </DevToolsDetector>
                  );
                })()}

                {/* Server Switcher Bar — only when multiple servers */}
                {accessStatus.servers && accessStatus.servers.length > 1 && (
                  <div className="w-full bg-slate-900/95 backdrop-blur-md border-t border-slate-800/90 px-3 sm:px-5 py-2.5 flex flex-wrap items-center justify-between gap-2 shadow-inner">
                    <div className="flex items-center gap-2 overflow-x-auto no-scrollbar py-0.5">
                      <span className="text-[11px] font-bold text-slate-400 font-bengali shrink-0">
                        সার্ভার নির্বাচন:
                      </span>
                      {accessStatus.servers.map((srv, idx) => {
                        const isSelected = selectedServerIndex === idx;
                        return (
                          <button
                            key={idx}
                            type="button"
                            onClick={() => setSelectedServerIndex(idx)}
                            className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all whitespace-nowrap flex items-center gap-2 border cursor-pointer ${
                              isSelected
                                ? "bg-primary text-white border-primary shadow-md shadow-primary/25 font-bold scale-[1.02]"
                                : "bg-slate-800/80 text-slate-300 border-slate-700/80 hover:bg-slate-700/90 hover:text-white"
                            }`}
                          >
                            <span className={`w-1.5 h-1.5 rounded-full ${isSelected ? "bg-white animate-pulse" : "bg-slate-500"}`} />
                            <span>{srv.name}</span>
                          </button>
                        );
                      })}
                    </div>

                    {/* Adblock Shield Protection Indicator for Abyss & sandboxed Embed servers */}
                    {Boolean(
                      accessStatus.servers[selectedServerIndex]?.type === "abyss" ||
                      /abyss/i.test(accessStatus.servers[selectedServerIndex]?.url || "") ||
                      (accessStatus.servers[selectedServerIndex]?.type === "embed" &&
                      !/streamtape\.(com|to|net|pe|xyz|site|cash|cc)|streamta\.pe/i.test(accessStatus.servers[selectedServerIndex]?.url || ""))
                    ) && (
                      <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-xl bg-emerald-500/10 border border-emerald-500/25 text-emerald-400 text-[11px] font-bengali font-semibold shadow-2xs">
                        <ShieldCheck className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                        <span>অ্যাড-ব্লকার সক্রিয় (পপআপ ও বিজ্ঞাপন ১০০% ব্লকড)</span>
                      </div>
                    )}
                  </div>
                )}
              </div>
            ) : accessStatus.isPending ? (
              /* Dedicated Pending Verification Review Screen - User already submitted order */
              <div className="w-full aspect-video bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 flex flex-col items-center justify-center p-6 text-center relative overflow-hidden">
                {/* Radiant Glow */}
                <div className="absolute w-80 sm:w-96 h-80 sm:h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none -top-20" />
                <div className="absolute w-64 h-64 bg-orange-500/10 rounded-full blur-2xl pointer-events-none -bottom-10" />

                <div className="relative z-10 max-w-lg space-y-4 font-bengali">
                  <div className="w-16 h-16 rounded-2xl bg-amber-500/15 border border-amber-500/30 text-amber-400 flex items-center justify-center mx-auto shadow-xl shadow-amber-500/10">
                    <Clock className="w-8 h-8 animate-pulse" />
                  </div>

                  <div className="space-y-1.5">
                    <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-bold bg-amber-500/15 text-amber-400 border border-amber-500/30">
                      <Clock className="w-3.5 h-3.5" />
                      <span>পেমেন্ট যাচাইকরণ প্রক্রিয়াধীন</span>
                    </div>

                    <h3 className="text-lg sm:text-2xl font-black text-white leading-tight">
                      আপনার পেমেন্ট রিকোয়েস্ট যাচাই করা হচ্ছে
                    </h3>

                    <p className="text-xs sm:text-sm text-slate-300 max-w-md mx-auto leading-relaxed">
                      {accessStatus.message ||
                        "আপনার পেমেন্ট রিকোয়েস্ট যাচাইকরণ প্রক্রিয়াধীন রয়েছে। অ্যাডমিন যাচাই সম্পন্ন করলেই ক্লাসটি স্বয়ংক্রিয়ভাবে চালু হয়ে যাবে।"}
                    </p>
                  </div>

                  {(accessStatus.orderNumber || accessStatus.transactionId) && (
                    <div className="bg-slate-900/85 border border-amber-500/25 rounded-2xl p-3 text-xs text-slate-300 max-w-xs mx-auto space-y-1 font-sans">
                      {accessStatus.orderNumber && (
                        <div className="flex justify-between items-center">
                          <span className="text-slate-400 font-bengali">অর্ডার নং:</span>
                          <span className="font-bold text-white font-mono">#{accessStatus.orderNumber}</span>
                        </div>
                      )}
                      {accessStatus.transactionId && (
                        <div className="flex justify-between items-center">
                          <span className="text-slate-400 font-bengali">TrxID:</span>
                          <span className="font-bold text-amber-400 font-mono">{accessStatus.transactionId}</span>
                        </div>
                      )}
                    </div>
                  )}

                  {/* CTAs for Pending */}
                  <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
                    <Link
                      href="/dashboard/my-courses"
                      className="btn btn-primary bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700 border-none px-6 py-2.5 text-xs sm:text-sm font-bold shadow-lg shadow-amber-500/20 hover:scale-105 transition-all flex items-center gap-2 w-full sm:w-auto justify-center text-white cursor-pointer"
                    >
                      <Receipt className="w-4 h-4" />
                      <span>আমার কোর্স ড্যাশবোর্ড দেখুন</span>
                    </Link>

                    <Link
                      href={`/course/${course.slug}`}
                      className="btn btn-outline border-slate-700 text-slate-300 hover:text-white hover:bg-slate-800 px-4 py-2.5 text-xs font-semibold w-full sm:w-auto justify-center"
                    >
                      কোর্স ওভারভিউতে ফিরে যান
                    </Link>
                  </div>
                </div>
              </div>
            ) : (
              /* Anti-Bypass Locked Class Screen - Absolutely NO Video URL leaked to DOM */
              <div className="w-full aspect-video bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 flex flex-col items-center justify-center p-6 text-center relative overflow-hidden">
                {/* Radiant Glow */}
                <div className="absolute w-80 sm:w-96 h-80 sm:h-96 bg-primary/10 rounded-full blur-3xl pointer-events-none -top-20" />
                <div className="absolute w-64 h-64 bg-amber-500/10 rounded-full blur-2xl pointer-events-none -bottom-10" />

                <div className="relative z-10 max-w-lg space-y-4 font-bengali">
                  <div className="w-16 h-16 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-amber-400 flex items-center justify-center mx-auto shadow-xl shadow-amber-500/10">
                    <Lock className="w-8 h-8 animate-pulse" />
                  </div>

                  <div className="space-y-1.5">
                    <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-bold bg-amber-500/15 text-amber-400 border border-amber-500/30">
                      <ShieldCheck className="w-3.5 h-3.5" />
                      <span>লক করা প্রিমিয়াম ক্লাস</span>
                    </div>

                    <h3 className="text-lg sm:text-2xl font-black text-white leading-tight">
                      এই ক্লাসটি শুধুমাত্র এনরোল্ড শিক্ষার্থীদের জন্য সংরক্ষিত
                    </h3>

                    <p className="text-xs sm:text-sm text-slate-300 max-w-md mx-auto leading-relaxed">
                      সম্পূর্ণ কোর্সের কনসেপ্ট বিশ্লেষণ, এইচডি ক্লাস, স্পেশাল প্র্যাকটিস শিট ও মেন্টর সাপোর্ট পেতে এখনই ভর্তি সম্পন্ন করুন।
                    </p>
                  </div>

                  {/* Pricing & CTA */}
                  <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
                    <Link
                      href={`/checkout/${course.slug}`}
                      className="btn btn-primary px-6 py-2.5 text-xs sm:text-sm font-bold shadow-lg shadow-primary/25 hover:scale-105 transition-all flex items-center gap-2 w-full sm:w-auto justify-center"
                    >
                      <Sparkles className="w-4 h-4" />
                      <span>
                        এখনই ভর্তি হোন ({course.price === 0 ? "ফ্রি" : `৳${course.price.toLocaleString()}`})
                      </span>
                    </Link>

                    {isLoggedIn ? (
                      <Link
                        href="/dashboard/my-courses"
                        className="btn btn-outline border-slate-700 text-slate-300 hover:text-white hover:bg-slate-800 px-4 py-2.5 text-xs font-semibold w-full sm:w-auto justify-center"
                      >
                        আমার কোর্স ড্যাশবোর্ড
                      </Link>
                    ) : (
                      <Link
                        href={`/login?redirect=/course/${course.slug}/learn/${currentLesson.id}`}
                        className="btn btn-outline border-slate-700 text-slate-300 hover:text-white hover:bg-slate-800 px-4 py-2.5 text-xs font-semibold w-full sm:w-auto justify-center"
                      >
                        ইতিমধ্যে ভর্তি হলে লগইন করুন
                      </Link>
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Sleek Action Bar Directly Under Video */}
          <div className="bg-slate-900/95 border-b border-slate-800/90 px-4 py-3 sm:px-6 flex flex-wrap items-center justify-between gap-3 shadow-md">
            {/* Completion Toggle Pill */}
            <button
              type="button"
              onClick={() => toggleComplete(currentLesson.id)}
              className={`px-3.5 py-1.5 rounded-full text-xs font-bengali font-bold flex items-center gap-2 transition-all cursor-pointer shadow-sm ${
                completedLessons[currentLesson.id]
                  ? "bg-emerald-500/15 border border-emerald-500/40 text-emerald-400 hover:bg-emerald-500/25"
                  : "bg-slate-800/90 hover:bg-slate-800 border border-slate-700/80 text-slate-300 hover:text-white"
              }`}
            >
              <CheckCircle2
                className={`w-4 h-4 transition-transform ${
                  completedLessons[currentLesson.id] ? "text-emerald-400 scale-110" : "text-slate-400"
                }`}
              />
              <span>
                {completedLessons[currentLesson.id] ? "ক্লাসটি সম্পন্ন হয়েছে" : "সম্পন্ন হিসেবে চিহ্নিত করুন"}
              </span>
            </button>

            {/* Prev / Next Navigation Buttons */}
            <div className="flex items-center gap-2">
              {prevLesson ? (
                <Link
                  href={`/course/${course.slug}/learn/${prevLesson.id}`}
                  className="px-3 py-1.5 rounded-lg bg-slate-800/80 hover:bg-slate-800 border border-slate-700/70 text-slate-200 hover:text-white text-xs font-bengali flex items-center gap-1.5 transition-colors cursor-pointer"
                >
                  <ChevronLeft className="w-3.5 h-3.5" />
                  <span>পূর্ববর্তী ক্লাস</span>
                </Link>
              ) : (
                <span className="px-3 py-1.5 rounded-lg border border-slate-800 text-slate-600 text-xs font-bengali opacity-50 cursor-not-allowed">
                  পূর্ববর্তী ক্লাস
                </span>
              )}

              {nextLesson ? (
                <Link
                  href={`/course/${course.slug}/learn/${nextLesson.id}`}
                  className="px-3.5 py-1.5 rounded-lg bg-gradient-to-r from-primary to-orange-500 hover:brightness-110 text-white text-xs font-bengali font-bold flex items-center gap-1.5 shadow-md shadow-primary/20 transition-all cursor-pointer"
                >
                  <span>পরবর্তী ক্লাস</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </Link>
              ) : (
                <span className="px-3 py-1.5 rounded-lg border border-slate-800 text-slate-600 text-xs font-bengali opacity-50 cursor-not-allowed">
                  কোর্সের শেষ ক্লাস
                </span>
              )}
            </div>
          </div>

          {/* Lesson Details & Class Selector Section */}
          <div className="p-4 sm:p-6 lg:p-8 space-y-6 max-w-5xl">
            {/* Lesson Title Header */}
            <div className="bg-slate-900/60 rounded-2xl border border-slate-800/80 p-4 sm:p-6 backdrop-blur-xs space-y-3">
              <div className="flex flex-wrap items-center gap-2">
                <span className="px-2.5 py-0.5 rounded-full bg-primary/15 border border-primary/30 text-primary text-[11px] font-bold font-bengali">
                  {currentSectionTitle}
                </span>
                <span className="px-2.5 py-0.5 rounded-full bg-slate-800 border border-slate-700 text-slate-300 text-[11px] font-mono flex items-center gap-1">
                  <Clock className="w-3 h-3 text-primary" />
                  {currentLesson.duration}
                </span>
                <span className="px-2.5 py-0.5 rounded-full bg-slate-800 border border-slate-700 text-amber-300 text-[11px] font-mono font-bold">
                  HD 1080p
                </span>
                {currentLesson.isFreePreview && (
                  <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 text-[11px] font-bengali font-bold">
                    আনলক
                  </span>
                )}
              </div>

              <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold text-white font-bengali leading-tight">
                {currentLesson.titleBn}
              </h2>
              <p className="text-xs sm:text-sm text-slate-400 font-sans">
                {currentLesson.title}
              </p>
            </div>

            {/* Class Study Materials & Lecture Sheets */}
            {currentLesson.materials && currentLesson.materials.length > 0 && (
              <div className="bg-slate-900/80 rounded-2xl border border-slate-800/90 p-4 sm:p-6 backdrop-blur-sm shadow-md space-y-4 font-bengali">
                <div className="flex items-center justify-between gap-3 border-b border-slate-800/80 pb-3">
                  <div className="flex items-center gap-2.5">
                    <div className="w-9 h-9 rounded-xl bg-primary/10 border border-primary/25 text-primary flex items-center justify-center shadow-inner">
                      <FolderDown className="w-4.5 h-4.5" />
                    </div>
                    <div>
                      <h3 className="text-sm sm:text-base font-bold text-white leading-tight flex items-center gap-2">
                        <span>ক্লাস স্টাডি ম্যাটেরিয়াল ও লেকচার শিট</span>
                      </h3>
                      <p className="text-[11px] sm:text-xs text-slate-400 mt-0.5">
                        এই ক্লাসের সাথে সংযুক্ত প্রয়োজনীয় রিসোর্স ও ফাইল ডাউনলোড করুন
                      </p>
                    </div>
                  </div>
                  <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-primary/10 text-primary border border-primary/25">
                    {currentLesson.materials.length}টি ফাইল
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {currentLesson.materials.map((mat, mIdx) => {
                    const isPdf =
                      mat.fileType?.toLowerCase().includes("pdf") ||
                      mat.fileUrl?.toLowerCase().endsWith(".pdf");
                    const isZip =
                      mat.fileType?.toLowerCase().includes("zip") ||
                      mat.fileUrl?.toLowerCase().endsWith(".zip");
                    const isDoc =
                      mat.fileType?.toLowerCase().includes("doc") ||
                      mat.fileUrl?.toLowerCase().includes("word");
                    const isPpt =
                      mat.fileType?.toLowerCase().includes("ppt") ||
                      mat.fileUrl?.toLowerCase().includes("presentation");

                    const isGDrive = mat.fileUrl?.includes("drive.google.com");
                    const gDriveMatch =
                      mat.fileUrl?.match(/\/file\/d\/([a-zA-Z0-9_-]+)/) ||
                      mat.fileUrl?.match(/[?&]id=([a-zA-Z0-9_-]+)/);
                    const gDriveId = gDriveMatch?.[1];
                    const previewUrl = gDriveId
                      ? `https://drive.google.com/file/d/${gDriveId}/preview`
                      : mat.fileUrl;
                    const downloadUrl = gDriveId
                      ? `https://drive.google.com/uc?export=download&id=${gDriveId}`
                      : mat.fileUrl;

                    return (
                      <div
                        key={mat.id || mIdx}
                        className={`group flex items-center justify-between gap-3 p-3.5 rounded-xl transition-all shadow-sm ${
                          mat.isFree
                            ? "bg-emerald-950/20 hover:bg-emerald-950/35 border border-emerald-500/30 hover:border-emerald-500/50"
                            : "bg-slate-800/70 hover:bg-slate-800 border border-slate-700/60 hover:border-primary/40"
                        }`}
                      >
                        <div className="flex items-center gap-3 min-w-0">
                          <div
                            className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 border ${
                              mat.isFree
                                ? "bg-emerald-500/15 border-emerald-500/30 text-emerald-400"
                                : isPdf
                                ? "bg-red-500/10 border-red-500/25 text-red-400"
                                : isDoc
                                ? "bg-blue-500/10 border-blue-500/25 text-blue-400"
                                : isPpt
                                ? "bg-orange-500/10 border-orange-500/25 text-orange-400"
                                : isZip
                                ? "bg-amber-500/10 border-amber-500/25 text-amber-400"
                                : "bg-emerald-500/10 border-emerald-500/25 text-emerald-400"
                            }`}
                          >
                            {isPdf ? (
                              <FileText className="w-5 h-5" />
                            ) : (
                              <File className="w-5 h-5" />
                            )}
                          </div>
                          <div className="min-w-0">
                            <div className="flex items-center gap-1.5 flex-wrap">
                              <h4
                                className="text-xs sm:text-sm font-bold text-slate-100 truncate group-hover:text-primary transition-colors"
                                title={mat.title}
                              >
                                {mat.title}
                              </h4>
                              {mat.isFree && (
                                <span className="shrink-0 px-1.5 py-0.5 rounded bg-emerald-500/20 border border-emerald-500/35 text-emerald-400 text-[10px] font-bold font-bengali">
                                  ✨ ফ্রি
                                </span>
                              )}
                            </div>
                            <div className="flex items-center gap-2 mt-0.5 text-[11px] text-slate-400 font-sans">
                              <span className="uppercase font-bold tracking-wider text-[10px] text-slate-300">
                                {isGDrive ? "GOOGLE DRIVE" : (mat.fileType || "FILE")}
                              </span>
                              {mat.fileSize && (
                                <>
                                  <span className="text-slate-600">•</span>
                                  <span>{mat.fileSize}</span>
                                </>
                              )}
                            </div>
                          </div>
                        </div>

                        <div className="flex items-center gap-1.5 shrink-0">
                          {Boolean(accessStatus.authorized || currentLesson.isFreePreview || mat.isFree) ? (
                            <>
                              <a
                                href={previewUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="p-2 rounded-lg bg-slate-700/60 hover:bg-slate-700 text-slate-300 hover:text-white transition-all cursor-pointer"
                                title="ব্রাউজারে দেখুন"
                              >
                                <ExternalLink className="w-4 h-4" />
                              </a>
                              <a
                                href={downloadUrl}
                                download={mat.title}
                                target="_blank"
                                rel="noopener noreferrer"
                                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer shadow-xs ${
                                  mat.isFree && !accessStatus.authorized && !currentLesson.isFreePreview
                                    ? "bg-emerald-500 hover:bg-emerald-600 text-white shadow-emerald-500/20"
                                    : "bg-primary/15 hover:bg-primary border border-primary/30 hover:border-primary text-primary hover:text-white"
                                }`}
                                title="ডাউনলোড করুন"
                              >
                                <Download className="w-3.5 h-3.5" />
                                <span className="hidden xs:inline">
                                  {mat.isFree && !accessStatus.authorized && !currentLesson.isFreePreview
                                    ? "ফ্রি ডাউনলোড"
                                    : "ডাউনলোড"}
                                </span>
                              </a>
                            </>
                          ) : (
                            <span
                              className="px-2 py-1 rounded-md bg-amber-500/10 border border-amber-500/25 text-amber-400 text-[10px] font-bold flex items-center gap-1"
                              title="ম্যাটেরিয়াল ডাউনলোড করতে ক্লাসে ভর্তি হন"
                            >
                              <Lock className="w-3 h-3" />
                              <span>লকড</span>
                            </span>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* ========================================================================= */}
            {/* CLASS SELECTOR (কোর্স কারিকুলাম ও সকল ক্লাস)                              */}
            {/* ========================================================================= */}
            <div className="space-y-4 pt-2">
              {/* Selector Header & Progress Stats */}
              <div className="bg-slate-900/80 rounded-2xl border border-slate-800/90 p-4 sm:p-5 backdrop-blur-sm shadow-md">
                <div className="flex items-center justify-between gap-3 mb-2.5">
                  <div className="flex items-center gap-2">
                    <div className="w-2.5 h-2.5 rounded-full bg-primary animate-pulse" />
                    <h3 className="font-bold text-sm sm:text-base text-white font-bengali">
                      কোর্স কারিকুলাম ও সকল ক্লাস তালিকা
                    </h3>
                  </div>
                  <span className="text-xs font-mono font-bold text-primary bg-primary/10 border border-primary/20 px-2.5 py-1 rounded-full">
                    {progressPercent}% সম্পন্ন
                  </span>
                </div>

                {/* Progress Bar */}
                <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden mb-2">
                  <div
                    className="h-full bg-gradient-to-r from-primary via-orange-500 to-amber-400 rounded-full transition-all duration-500"
                    style={{ width: `${progressPercent}%` }}
                  />
                </div>

                <div className="flex items-center justify-between text-[11px] text-slate-400 font-bengali">
                  <span>সর্বমোট {allLessons.length}টি ক্লাস</span>
                  <span>{totalCompleted}টি ক্লাস সম্পন্ন হয়েছে</span>
                </div>
              </div>

              {/* Class Selector Playlist */}
              {renderClassList()}
            </div>
          </div>
        </div>

        {/* Curriculum Sidebar (Desktop only) */}
        {sidebarOpen && (
          <aside className="hidden lg:flex w-96 bg-slate-900 border-l border-slate-800 flex-col shrink-0 overflow-y-auto">
            <div className="p-4 border-b border-slate-800 flex items-center justify-between sticky top-0 bg-slate-900/95 backdrop-blur-md z-10">
              <h3 className="font-bold text-sm text-white font-bengali flex items-center gap-2">
                <Layers className="w-4 h-4 text-primary" />
                <span>ক্লাস প্লেলিস্ট</span>
              </h3>
              <span className="text-xs text-slate-400 font-sans font-bold">
                {allLessons.length} Lessons
              </span>
            </div>

            <div className="p-3">
              {renderClassList()}
            </div>
          </aside>
        )}
      </div>
    </div>
  );
}
