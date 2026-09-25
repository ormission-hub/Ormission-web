"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ChevronDown,
  PlayCircle,
  FileText,
  Lock,
  ExternalLink,
  Sparkles,
  Search,
  X,
  ChevronsUpDown,
  BookOpen,
  CheckCircle2,
  Video,
  Layers,
  GraduationCap,
  ClipboardList,
  Eye,
} from "lucide-react";
import { type CurriculumSection, type Lesson, type SectionType, SECTION_TYPE_LABELS } from "@/lib/data/courses";

interface CurriculumAccordionProps {
  curriculum: CurriculumSection[];
  courseSlug?: string;
}

export function CurriculumAccordion({ curriculum, courseSlug }: CurriculumAccordionProps) {
  const router = useRouter();

  // Active Category / Section Filter Tab
  const [activeTab, setActiveTab] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState("");

  // Track locked lesson modal
  const [lockedModalLesson, setLockedModalLesson] = useState<Lesson | null>(null);

  // Dynamic Tabs with Counts (EdgeCourse BD style)
  const tabs = useMemo(() => {
    if (!curriculum || curriculum.length === 0) return [];

    const demoCount = curriculum.filter(
      (s) => s.sectionType === "demo" || s.lessons?.some((l) => l.isFreePreview)
    ).length;
    const outlineCount = curriculum.filter((s) => s.sectionType === "outline").length;
    const contentCount = curriculum.filter(
      (s) => s.sectionType === "content" || !s.sectionType
    ).length;
    const examCount = curriculum.filter((s) => s.sectionType === "exam").length;
    const otherCount = curriculum.filter((s) => s.sectionType === "other").length;

    const list: { key: string; label: string; count: number; icon: any }[] = [
      { key: "all", label: "সকল অধ্যায়", count: curriculum.length, icon: Layers },
    ];

    if (demoCount > 0) {
      list.push({ key: "demo", label: "ডেমো ক্লাস", count: demoCount, icon: PlayCircle });
    }
    if (outlineCount > 0) {
      list.push({ key: "outline", label: "কোর্স আউটলাইন", count: outlineCount, icon: BookOpen });
    }
    if (contentCount > 0 && (demoCount > 0 || outlineCount > 0 || examCount > 0)) {
      list.push({ key: "content", label: "একাডেমিক প্রস্তুতি", count: contentCount, icon: GraduationCap });
    }
    if (examCount > 0) {
      list.push({ key: "exam", label: "একাডেমিক এক্সাম", count: examCount, icon: ClipboardList });
    }
    if (otherCount > 0) {
      list.push({ key: "other", label: "অন্যান্য", count: otherCount, icon: Layers });
    }

    return list;
  }, [curriculum]);

  // Filter sections by activeTab and searchQuery
  const filteredSections = useMemo(() => {
    let result = [...curriculum];

    // Filter by tab
    if (activeTab === "demo") {
      result = result.filter(
        (s) => s.sectionType === "demo" || s.lessons?.some((l) => l.isFreePreview)
      );
    } else if (activeTab === "outline") {
      result = result.filter((s) => s.sectionType === "outline");
    } else if (activeTab === "content") {
      result = result.filter((s) => s.sectionType === "content" || !s.sectionType);
    } else if (activeTab === "exam") {
      result = result.filter((s) => s.sectionType === "exam");
    } else if (activeTab === "other") {
      result = result.filter((s) => s.sectionType === "other");
    }

    // Filter by search query
    const q = searchQuery.trim().toLowerCase();
    if (q) {
      result = result
        .map((sec) => {
          const secMatches =
            sec.title?.toLowerCase().includes(q) || sec.titleBn?.toLowerCase().includes(q);
          const matchingLessons = (sec.lessons || []).filter(
            (l) =>
              l.title?.toLowerCase().includes(q) ||
              l.titleBn?.toLowerCase().includes(q)
          );
          if (secMatches) return sec;
          if (matchingLessons.length > 0) {
            return { ...sec, lessons: matchingLessons };
          }
          return null;
        })
        .filter(Boolean) as CurriculumSection[];
    }

    return result;
  }, [curriculum, activeTab, searchQuery]);

  // Initial open sections (first section open by default)
  const [openSections, setOpenSections] = useState<Record<string, boolean>>({
    [curriculum[0]?.id || ""]: true,
  });

  const toggleSection = (id: string) => {
    setOpenSections((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  const totalLessons = curriculum.reduce((acc, s) => acc + (s.lessons?.length || 0), 0);
  const totalFreeLessons = curriculum.reduce(
    (acc, s) => acc + (s.lessons?.filter((l) => l.isFreePreview).length || 0),
    0
  );
  const totalFilteredLessons = filteredSections.reduce(
    (acc, s) => acc + (s.lessons?.length || 0),
    0
  );

  const isAllOpen =
    filteredSections.length > 0 &&
    filteredSections.every((s) => !!openSections[s.id]);

  const toggleAll = () => {
    if (isAllOpen) {
      setOpenSections({});
    } else {
      const full: Record<string, boolean> = {};
      filteredSections.forEach((s) => (full[s.id] = true));
      setOpenSections(full);
    }
  };

  const handleLockedClick = (lesson: Lesson) => {
    setLockedModalLesson(lesson);
  };

  if (!curriculum || curriculum.length === 0) {
    return (
      <div className="p-8 rounded-2xl bg-surface-secondary/40 border border-border/60 text-center text-xs sm:text-sm text-text-muted font-bengali">
        সিলেবাস ও কারিকুলাম শীঘ্রই বিস্তারিত যুক্ত হচ্ছে...
      </div>
    );
  }

  return (
    <div className="space-y-5">
      {/* 1. EdgeCourse BD-Style Category Tabs / Pills Navigation */}
      {tabs.length > 1 && (
        <div className="relative">
          <div className="flex items-center gap-2 overflow-x-auto pb-1.5 no-scrollbar scroll-smooth">
            {tabs.map((tab) => {
              const isActive = activeTab === tab.key;
              const Icon = tab.icon;
              return (
                <button
                  key={tab.key}
                  type="button"
                  onClick={() => {
                    setActiveTab(tab.key);
                    // When switching tabs, automatically open the first section in that tab
                    const matching = curriculum.find((s) => {
                      if (tab.key === "all") return true;
                      if (tab.key === "demo")
                        return s.sectionType === "demo" || s.lessons?.some((l) => l.isFreePreview);
                      if (tab.key === "content")
                        return s.sectionType === "content" || !s.sectionType;
                      return s.sectionType === tab.key;
                    });
                    if (matching) {
                      setOpenSections((prev) => ({ ...prev, [matching.id]: true }));
                    }
                  }}
                  className={`px-3.5 sm:px-4 py-2 rounded-xl text-xs sm:text-sm font-bold font-bengali whitespace-nowrap flex items-center gap-2 transition-all cursor-pointer shrink-0 shadow-2xs ${
                    isActive
                      ? "bg-emerald-600 text-white shadow-emerald-500/20 shadow-md ring-2 ring-emerald-500/30"
                      : "bg-surface-secondary/80 hover:bg-surface-secondary text-text-muted hover:text-text border border-border/70"
                  }`}
                >
                  <Icon className={`w-3.5 h-3.5 ${isActive ? "text-white" : "text-emerald-500"}`} />
                  <span>{tab.label}</span>
                  <span
                    className={`px-1.5 py-0.2 rounded-full text-[10.5px] font-mono font-bold ${
                      isActive
                        ? "bg-white/20 text-white"
                        : "bg-surface text-text-muted border border-border/60"
                    }`}
                  >
                    {tab.count}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* 2. Top Controls & Summary Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-1 border-b border-border/60 pb-3">
        {/* Left: Summary Info */}
        <div className="flex items-center gap-2 flex-wrap text-xs font-bengali text-text-muted">
          <span className="font-bold text-text bg-surface-secondary/80 px-2.5 py-1 rounded-lg border border-border/60">
            {filteredSections.length}টি অধ্যায়
          </span>
          <span className="font-semibold text-text-muted">• {totalFilteredLessons}টি ক্লাস</span>
          {totalFreeLessons > 0 && (
            <span className="inline-flex items-center gap-1 font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded-lg border border-emerald-500/20">
              <PlayCircle className="w-3.5 h-3.5" />
              <span>{totalFreeLessons}টি ফ্রি ডেমো</span>
            </span>
          )}
        </div>

        {/* Right: Search & Expand All */}
        <div className="flex items-center gap-2 justify-between sm:justify-end">
          {/* Quick Search */}
          <div className="relative flex-1 sm:flex-initial sm:w-48">
            <Search className="w-3.5 h-3.5 absolute left-2.5 top-1/2 -translate-y-1/2 text-text-muted pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="ক্লাস খুঁজুন..."
              className="w-full pl-8 pr-7 py-1 text-xs bg-surface border border-border/70 rounded-lg text-text placeholder:text-text-muted font-bengali focus:outline-hidden focus:border-emerald-500 transition-colors"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery("")}
                className="absolute right-2 top-1/2 -translate-y-1/2 text-text-muted hover:text-text cursor-pointer"
              >
                <X className="w-3 h-3" />
              </button>
            )}
          </div>

          {/* Toggle All */}
          <button
            type="button"
            onClick={toggleAll}
            className="flex items-center gap-1.5 text-xs text-emerald-600 dark:text-emerald-400 hover:text-emerald-700 dark:hover:text-emerald-300 font-bold font-bengali px-2.5 py-1 rounded-lg hover:bg-emerald-500/10 transition-colors cursor-pointer shrink-0"
          >
            <ChevronsUpDown className="w-3.5 h-3.5" />
            <span>{isAllOpen ? "সব বন্ধ করুন" : "সব খুলুন"}</span>
          </button>
        </div>
      </div>

      {/* 3. Empty Search / Filter State */}
      {filteredSections.length === 0 && (
        <div className="p-8 rounded-2xl bg-surface-secondary/40 border border-border/60 text-center space-y-3 font-bengali">
          <p className="text-sm font-semibold text-text">
            এই ক্যাটাগরি বা সার্চ অনুযায়ী কোনো অধ্যায় পাওয়া যায়নি।
          </p>
          <button
            type="button"
            onClick={() => {
              setActiveTab("all");
              setSearchQuery("");
            }}
            className="btn btn-outline btn-xs font-bold text-emerald-600 border-emerald-500/30"
          >
            সকল অধ্যায় দেখুন
          </button>
        </div>
      )}

      {/* 4. Section Module Cards (EdgeCourse BD Signature Green Bordered Look) */}
      <div className="space-y-4">
        {filteredSections.map((section, idx) => {
          const isOpen = !!openSections[section.id];
          const freeLessons = (section.lessons || []).filter((l) => l.isFreePreview);
          const hasFreeLesson = freeLessons.length > 0;

          // Section Type Badge Label
          const secType = section.sectionType || "content";
          const typeLabel = SECTION_TYPE_LABELS[secType as SectionType] || "কোর্স কন্টেন্ট";

          return (
            <div
              key={section.id}
              className={`rounded-2xl border transition-all duration-200 overflow-hidden shadow-2xs ${
                isOpen
                  ? "border-border/90 bg-surface shadow-xs"
                  : "border-border/70 bg-surface hover:border-border"
              } border-l-4 border-l-emerald-500 hover:border-l-emerald-600`}
            >
              {/* Section Header Button */}
              <button
                type="button"
                onClick={() => toggleSection(section.id)}
                className="w-full flex items-center justify-between p-4 sm:p-5 text-left hover:bg-surface-secondary/40 transition-colors cursor-pointer gap-3"
              >
                {/* Left: Index + Title + Type Badge */}
                <div className="flex items-center gap-3 min-w-0 flex-1">
                  <span className="w-8 h-8 rounded-xl bg-emerald-500/10 border border-emerald-500/25 text-emerald-600 dark:text-emerald-400 flex items-center justify-center text-xs font-black font-mono shrink-0 shadow-2xs">
                    {idx + 1 < 10 ? `০${idx + 1}` : idx + 1}
                  </span>

                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <h4 className="font-bold text-sm sm:text-base text-text font-bengali leading-snug">
                        {section.titleBn}
                      </h4>
                      {activeTab === "all" && secType && secType !== "content" && (
                        <span
                          className={`px-2 py-0.5 rounded-md text-[10px] font-bold font-bengali border ${
                            secType === "demo"
                              ? "bg-emerald-500/10 text-emerald-600 border-emerald-500/20"
                              : secType === "exam"
                              ? "bg-amber-500/10 text-amber-600 border-amber-500/20"
                              : "bg-blue-500/10 text-blue-600 border-blue-500/20"
                          }`}
                        >
                          {typeLabel}
                        </span>
                      )}
                    </div>
                    {section.title && section.title !== section.titleBn && (
                      <p className="text-[11px] text-text-muted font-sans truncate mt-0.5">
                        {section.title}
                      </p>
                    )}
                  </div>
                </div>

                {/* Right: Meta & Toggle Icon */}
                <div className="flex items-center gap-2.5 shrink-0">
                  {hasFreeLesson && (
                    <span className="hidden xs:inline-flex items-center gap-1 text-[11px] font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-500/15 px-2 py-0.5 rounded-lg border border-emerald-500/25 font-bengali">
                      <Sparkles className="w-3 h-3 text-emerald-500" />
                      <span>{freeLessons.length}টি ফ্রি</span>
                    </span>
                  )}
                  <span className="text-xs font-bold text-text-muted font-bengali bg-surface-secondary px-2.5 py-1 rounded-lg border border-border/60">
                    {section.lessons?.length || 0}টি ক্লাস
                  </span>
                  <div
                    className={`w-7 h-7 rounded-lg flex items-center justify-center transition-colors ${
                      isOpen ? "bg-emerald-500/10 text-emerald-600" : "text-text-muted hover:bg-surface-secondary"
                    }`}
                  >
                    <ChevronDown
                      className={`w-4 h-4 transition-transform duration-300 ${
                        isOpen ? "rotate-180" : ""
                      }`}
                    />
                  </div>
                </div>
              </button>

              {/* Lessons List inside Module */}
              {isOpen && (
                <div className="border-t border-border/80 bg-surface divide-y divide-border/40">
                  {(section.lessons || []).map((lesson, lIdx) => {
                    const freeMaterials = (lesson.materials || []).filter(
                      (m) => m.isFree || lesson.isFreePreview
                    );
                    const paidMaterials = (lesson.materials || []).filter(
                      (m) => !m.isFree && !lesson.isFreePreview
                    );

                    // Row Content
                    const lessonRowContent = (
                      <div
                        onClick={() => {
                          if (!lesson.isFreePreview) {
                            handleLockedClick(lesson);
                          }
                        }}
                        className={`flex items-center justify-between px-4 sm:px-6 py-3.5 text-xs sm:text-sm transition-all group cursor-pointer ${
                          lesson.isFreePreview
                            ? "hover:bg-emerald-500/[0.04] bg-emerald-500/[0.015]"
                            : "hover:bg-surface-secondary/40"
                        }`}
                      >
                        {/* Left: Play/Lock Icon + Index + Title */}
                        <div className="flex items-center gap-3 min-w-0 pr-3 flex-1">
                          {lesson.isFreePreview ? (
                            <div className="w-7 h-7 rounded-lg bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform shadow-2xs">
                              <PlayCircle className="w-4 h-4" />
                            </div>
                          ) : (
                            <div className="w-7 h-7 rounded-lg bg-surface-secondary text-text-muted/60 flex items-center justify-center shrink-0">
                              <Lock className="w-3.5 h-3.5" />
                            </div>
                          )}

                          <div className="min-w-0 flex-1">
                            <div className="flex items-center gap-2 flex-wrap">
                              <span className="text-[11px] font-mono text-text-muted/80 shrink-0">
                                {lIdx + 1 < 10 ? `০${lIdx + 1}.` : `${lIdx + 1}.`}
                              </span>
                              <span
                                className={`font-bengali font-semibold truncate ${
                                  lesson.isFreePreview
                                    ? "text-text group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors"
                                    : "text-text/90 group-hover:text-text transition-colors"
                                }`}
                              >
                                {lesson.titleBn}
                              </span>

                              {lesson.isFreePreview && (
                                <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border border-emerald-500/25 font-bengali inline-flex items-center gap-1">
                                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                                  <span>ফ্রি ডেমো</span>
                                </span>
                              )}
                            </div>

                            {lesson.title && lesson.title !== lesson.titleBn && (
                              <span className="text-[11px] text-text-muted font-sans block truncate pl-4.5 mt-0.5">
                                {lesson.title}
                              </span>
                            )}
                          </div>
                        </div>

                        {/* Right: Duration + Action Pill */}
                        <div className="flex items-center gap-2.5 shrink-0 ml-2">
                          <span className="text-[11px] sm:text-xs font-semibold text-text-muted font-mono tabular-nums">
                            {lesson.duration}
                          </span>

                          {lesson.isFreePreview ? (
                            <span className="hidden sm:inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-bold bg-emerald-600 text-white font-bengali shadow-xs group-hover:bg-emerald-700 transition-colors">
                              <Eye className="w-3 h-3" />
                              <span>দেখুন</span>
                            </span>
                          ) : (
                            <span className="text-[10px] text-text-muted font-bold font-bengali bg-surface-secondary px-2 py-1 rounded-md border border-border/60">
                              লক করা
                            </span>
                          )}
                        </div>
                      </div>
                    );

                    return (
                      <div key={lesson.id} className="transition-colors">
                        {lesson.isFreePreview && courseSlug ? (
                          <Link
                            href={`/course/${courseSlug}/learn/${lesson.id}`}
                            className="block"
                            title="ফ্রি ক্লাসটি দেখুন"
                          >
                            {lessonRowContent}
                          </Link>
                        ) : (
                          <div>{lessonRowContent}</div>
                        )}

                        {/* Prominently Highlighted Free Materials (Accessible for preview) */}
                        {freeMaterials.map((mat) => (
                          <div
                            key={mat.id}
                            className="ml-6 sm:ml-12 mr-3 sm:mr-6 my-2 p-2.5 sm:p-3 rounded-xl bg-emerald-500/10 dark:bg-emerald-500/15 border border-emerald-500/25 flex items-center justify-between gap-3 text-xs shadow-2xs group/mat transition-all hover:border-emerald-500/40"
                          >
                            <div className="flex items-center gap-2.5 min-w-0">
                              <div className="w-7 h-7 rounded-lg bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0 shadow-xs">
                                <FileText className="w-4 h-4" />
                              </div>
                              <div className="min-w-0">
                                <div className="flex items-center gap-1.5 flex-wrap">
                                  <span className="font-bold text-text font-bengali truncate text-[11.5px] sm:text-xs">
                                    {mat.title}
                                  </span>
                                  <span className="px-1.5 py-0.5 rounded-md text-[9px] font-bold bg-emerald-500/25 text-emerald-700 dark:text-emerald-300 border border-emerald-500/30 font-bengali flex items-center gap-0.5">
                                    <Sparkles className="w-2.5 h-2.5 text-emerald-500" />
                                    <span>ফ্রি স্টাডি নোট</span>
                                  </span>
                                </div>
                                {mat.fileSize && (
                                  <span className="text-[10px] text-text-muted font-sans block mt-0.5">
                                    {mat.fileSize}
                                  </span>
                                )}
                              </div>
                            </div>

                            <a
                              href={mat.fileUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              onClick={(e) => e.stopPropagation()}
                              className="px-2.5 sm:px-3 py-1 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-bengali font-bold text-[11px] flex items-center gap-1 shrink-0 transition-all shadow-xs hover:shadow-sm active:scale-95 cursor-pointer"
                              title="ফ্রি স্টাডি নোট ওপেন বা ডাউনলোড করুন"
                            >
                              <ExternalLink className="w-3 h-3" />
                              <span className="hidden xs:inline">ফ্রি পড়ুন / ডাউনলোড</span>
                              <span className="xs:hidden">ফ্রি</span>
                            </a>
                          </div>
                        ))}

                        {/* Subtle teaser for paid materials under a paid lesson */}
                        {paidMaterials.length > 0 && (
                          <div
                            onClick={() => handleLockedClick(lesson)}
                            className="ml-6 sm:ml-12 mr-3 sm:mr-6 my-1.5 p-2 rounded-xl bg-surface-secondary/40 border border-border/50 flex items-center justify-between gap-2 text-[11px] text-text-muted hover:border-border transition-colors cursor-pointer"
                          >
                            <div className="flex items-center gap-2 truncate">
                              <Lock className="w-3 h-3 text-rose-500/70 shrink-0" />
                              <span className="font-bengali truncate text-[10.5px] sm:text-[11px]">
                                {paidMaterials.length}টি লক লেকচার শিট ও রিসোর্স
                              </span>
                            </div>
                            <span className="text-[9.5px] text-rose-500 dark:text-rose-400 font-bold font-bengali bg-rose-500/10 px-2 py-0.5 rounded-full border border-rose-500/20 shrink-0">
                              ভর্তির পর অ্যাক্সেস
                            </span>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* 5. Friendly Locked Lesson Modal (EdgeCourse BD enrollment prompt) */}
      {lockedModalLesson && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="bg-surface border border-border rounded-3xl max-w-md w-full p-6 shadow-2xl space-y-5 text-center font-bengali animate-in zoom-in-95 duration-200 relative">
            <button
              type="button"
              onClick={() => setLockedModalLesson(null)}
              className="absolute right-4 top-4 p-1.5 rounded-full text-text-muted hover:text-text hover:bg-surface-secondary transition-colors cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="w-14 h-14 rounded-2xl bg-amber-500/15 border border-amber-500/30 text-amber-500 flex items-center justify-center mx-auto shadow-sm">
              <Lock className="w-7 h-7" />
            </div>

            <div className="space-y-2">
              <span className="px-3 py-1 rounded-full text-xs font-bold bg-amber-500/15 text-amber-600 dark:text-amber-400 border border-amber-500/20 inline-block">
                কোর্সটি লক করা রয়েছে
              </span>
              <h3 className="text-lg font-black text-text leading-snug">
                {lockedModalLesson.titleBn}
              </h3>
              <p className="text-xs sm:text-sm text-text-muted leading-relaxed">
                এই সম্পূর্ণ ক্লাস, ভিডিও লেকচার এবং সংশ্লিষ্ট প্র্যাকটিস শিট অ্যাক্সেস করতে কোর্সে ভর্তি নিশ্চিত করুন।
              </p>
            </div>

            <div className="p-3.5 rounded-2xl bg-surface-secondary/60 border border-border/60 text-left text-xs space-y-2">
              <div className="flex items-center gap-2 text-text font-semibold">
                <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                <span>ফুল এইচডি ১০৮০p রেকর্ডেড ক্লাস ও আনলিমিটেড ভিউ</span>
              </div>
              <div className="flex items-center gap-2 text-text font-semibold">
                <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                <span>ডাউনলোডযোগ্য লেকচার শিট ও অনুশীলন পিডিএফ</span>
              </div>
              <div className="flex items-center gap-2 text-text font-semibold">
                <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                <span>ইন্সট্রাক্টরের সাথে নিয়মিত ডাউট ক্লিয়ারিং সাপোর্ট</span>
              </div>
            </div>

            <div className="flex items-center gap-3 pt-1">
              <button
                type="button"
                onClick={() => setLockedModalLesson(null)}
                className="btn btn-outline flex-1 text-xs font-bold rounded-xl"
              >
                পরে দেখব
              </button>
              <button
                type="button"
                onClick={() => {
                  setLockedModalLesson(null);
                  if (courseSlug) {
                    router.push(`/checkout/${courseSlug}`);
                  }
                }}
                className="btn btn-primary flex-1 text-xs font-bold rounded-xl shadow-md cursor-pointer"
              >
                এখনই ভর্তি হন
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
