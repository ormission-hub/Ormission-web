"use client";

import { useState, useMemo, useEffect } from "react";
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
  PenTool,
  Rocket,
  Wrench,
  Radio,
  Link as LinkIcon,
  Award,
  HelpCircle,
  Calendar,
  Clock,
  Download,
  Flame,
} from "lucide-react";
import { type CurriculumSection, type Lesson, type LessonItemType } from "@/lib/data/courses";
import {
  SECTION_TAB_ORDER,
  labelForTabKey,
  matchesCurriculumTab,
  sectionTabKey,
  ITEM_TYPE_INFO,
} from "@/lib/section-types";

interface CurriculumAccordionProps {
  curriculum: CurriculumSection[];
  courseSlug?: string;
}

export function CurriculumAccordion({ curriculum, courseSlug }: CurriculumAccordionProps) {
  const router = useRouter();

  // Active Category / Section Filter Tab
  const [activeTab, setActiveTab] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState("");

  // Track open sections & open subjects
  const [openSections, setOpenSections] = useState<Record<string, boolean>>({
    [curriculum?.[0]?.id || ""]: true,
  });
  const [openSubjects, setOpenSubjects] = useState<Record<string, boolean>>({});

  // Track locked lesson modal
  const [lockedModalLesson, setLockedModalLesson] = useState<Lesson | null>(null);

  const TAB_ICONS: Record<string, any> = {
    all: Layers,
    demo: PlayCircle,
    academic: GraduationCap,
    basic: BookOpen,
    solving: PenTool,
    exam: ClipboardList,
    pre_admission: Rocket,
    admission: GraduationCap,
    outline: BookOpen,
    resource: Wrench,
    other: Layers,
  };

  const tabs = useMemo(() => {
    if (!curriculum || curriculum.length === 0) return [];

    const counts = new Map<string, number>();
    for (const section of curriculum) {
      const key = sectionTabKey(section.sectionType, section.tabLabel);
      counts.set(key, (counts.get(key) || 0) + 1);
    }

    const uniqueKeys = Array.from(counts.keys());
    const list: { key: string; label: string; count: number; icon: any }[] = [];

    const demoCount = curriculum.filter((s) => matchesCurriculumTab(s, "demo")).length;
    if (demoCount > 0) {
      list.push({ key: "demo", label: "ডেমো ক্লাস (Demo)", count: demoCount, icon: PlayCircle });
    }

    list.push({
      key: "all",
      label: "কোর্স আউটলাইন",
      count: curriculum.length,
      icon: Layers,
    });

    const orderedKnown = SECTION_TAB_ORDER.filter((key) => key !== "demo" && (counts.get(key) || 0) > 0);
    for (const key of orderedKnown) {
      list.push({
        key,
        label: labelForTabKey(key),
        count: counts.get(key) || 0,
        icon: TAB_ICONS[key] || BookOpen,
      });
    }

    const customKeys = uniqueKeys.filter((key) => key.startsWith("custom:"));
    for (const key of customKeys) {
      list.push({
        key,
        label: labelForTabKey(key),
        count: counts.get(key) || 0,
        icon: Sparkles,
      });
    }

    const meaningfulTabs = list.filter((tab) => tab.key !== "all");
    if (meaningfulTabs.length <= 1) {
      return [];
    }

    return list;
  }, [curriculum]);

  const filteredSections = useMemo(() => {
    let result = [...curriculum];

    if (activeTab !== "all") {
      result = result.filter((s) => matchesCurriculumTab(s, activeTab));
    }

    // Filter by search query
    const q = searchQuery.trim().toLowerCase();
    if (q) {
      result = result
        .map((sec) => {
          const secMatches =
            sec.title?.toLowerCase().includes(q) ||
            sec.titleBn?.toLowerCase().includes(q) ||
            sec.subject?.toLowerCase().includes(q);
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

  // Set default open section & subject on tab change
  useEffect(() => {
    if (filteredSections.length > 0) {
      const first = filteredSections[0];
      setOpenSections((prev) => ({ ...prev, [first.id]: true }));
      if (first.subject) {
        setOpenSubjects((prev) => ({ ...prev, [first.subject!]: true }));
      }
    }
  }, [activeTab]);

  const toggleSection = (id: string) => {
    setOpenSections((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  const toggleSubject = (subjectName: string) => {
    setOpenSubjects((prev) => ({
      ...prev,
      [subjectName]: !prev[subjectName],
    }));
  };

  // Grouping structure (Phase groups for 'all' tab, Subject groups for specific tabs)
  const groupedStructure = useMemo(() => {
    if (activeTab === "all") {
      const groups: {
        key: string;
        label: string;
        sections: CurriculumSection[];
      }[] = [];

      const map = new Map<string, CurriculumSection[]>();
      for (const sec of filteredSections) {
        const key = sectionTabKey(sec.sectionType, sec.tabLabel);
        if (!map.has(key)) {
          map.set(key, []);
        }
        map.get(key)!.push(sec);
      }

      for (const key of SECTION_TAB_ORDER) {
        if (map.has(key) && map.get(key)!.length > 0) {
          groups.push({
            key,
            label: labelForTabKey(key),
            sections: map.get(key)!,
          });
          map.delete(key);
        }
      }

      for (const [key, secs] of map.entries()) {
        groups.push({
          key,
          label: labelForTabKey(key),
          sections: secs,
        });
      }

      return { isGroupedByPhase: true, phaseGroups: groups, hasSubjects: false, subjectGroups: [], noSubjectSections: [] };
    }

    // Specific tab: Check if sections have subjects
    const subjectMap = new Map<string, CurriculumSection[]>();
    const noSubjectSections: CurriculumSection[] = [];

    for (const sec of filteredSections) {
      const subj = sec.subject?.trim();
      if (subj) {
        if (!subjectMap.has(subj)) {
          subjectMap.set(subj, []);
        }
        subjectMap.get(subj)!.push(sec);
      } else {
        noSubjectSections.push(sec);
      }
    }

    if (subjectMap.size > 0) {
      const subjects: {
        subject: string;
        sections: CurriculumSection[];
        totalLessons: number;
      }[] = [];

      for (const [subj, secs] of subjectMap.entries()) {
        const total = secs.reduce((acc, s) => acc + (s.lessons?.length || 0), 0);
        subjects.push({
          subject: subj,
          sections: secs,
          totalLessons: total,
        });
      }

      return {
        isGroupedByPhase: false,
        phaseGroups: [],
        hasSubjects: true,
        subjectGroups: subjects,
        noSubjectSections,
      };
    }

    return {
      isGroupedByPhase: false,
      phaseGroups: [],
      hasSubjects: false,
      subjectGroups: [],
      noSubjectSections: filteredSections,
    };
  }, [filteredSections, activeTab]);

  const totalLessons = curriculum.reduce((acc, s) => acc + (s.lessons?.length || 0), 0);
  const totalFreeLessons = curriculum.reduce(
    (acc, s) => acc + (s.lessons?.filter((l) => l.isFreePreview).length || 0),
    0
  );
  const totalFilteredLessons = filteredSections.reduce(
    (acc, s) => acc + (s.lessons?.length || 0),
    0
  );

  const isAllOpen = useMemo(() => {
    return filteredSections.length > 0 && filteredSections.every((s) => !!openSections[s.id]);
  }, [filteredSections, openSections]);

  const toggleAll = () => {
    if (isAllOpen) {
      setOpenSections({});
      setOpenSubjects({});
    } else {
      const fullSecs: Record<string, boolean> = {};
      const fullSubjs: Record<string, boolean> = {};
      filteredSections.forEach((s) => {
        fullSecs[s.id] = true;
        if (s.subject) {
          fullSubjs[s.subject] = true;
        }
      });
      setOpenSections(fullSecs);
      setOpenSubjects(fullSubjs);
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

  // ---------------------------------------------------------------------------
  // RENDER SINGLE LESSON ITEM (Heterogeneous 5 Item Types)
  // ---------------------------------------------------------------------------
  const renderLessonRow = (lesson: Lesson, lIdx: number) => {
    const itemType: LessonItemType = lesson.itemType || "video";
    const isFree = Boolean(lesson.isFreePreview);
    const freeMaterials = (lesson.materials || []).filter(
      (m) => m.isFree || lesson.isFreePreview
    );
    const paidMaterials = (lesson.materials || []).filter(
      (m) => !m.isFree && !lesson.isFreePreview
    );

    const handleRowClick = () => {
      if (!isFree) {
        handleLockedClick(lesson);
      }
    };

    return (
      <div key={lesson.id} className="transition-colors">
        <div
          onClick={handleRowClick}
          className={`flex items-center justify-between px-4 sm:px-6 py-3.5 text-xs sm:text-sm transition-all group ${
            isFree
              ? "hover:bg-emerald-500/[0.04] bg-emerald-500/[0.015] cursor-pointer"
              : "hover:bg-surface-secondary/40 cursor-pointer"
          }`}
        >
          {/* Left: Icon + Index + Title + Type Badge */}
          <div className="flex items-center gap-3 min-w-0 pr-3 flex-1">
            {/* Icon based on itemType */}
            {itemType === "video" && (
              isFree ? (
                <div className="w-7 h-7 rounded-lg bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform shadow-2xs">
                  <PlayCircle className="w-4 h-4" />
                </div>
              ) : (
                <div className="w-7 h-7 rounded-lg bg-surface-secondary text-text-muted/60 flex items-center justify-center shrink-0">
                  <Lock className="w-3.5 h-3.5" />
                </div>
              )
            )}

            {itemType === "exam" && (
              <div
                className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 shadow-2xs transition-transform group-hover:scale-110 ${
                  isFree
                    ? "bg-emerald-500/15 text-emerald-600 dark:text-emerald-400"
                    : "bg-surface-secondary text-emerald-600/70 dark:text-emerald-400/70"
                }`}
              >
                <ClipboardList className="w-3.5 h-3.5" />
              </div>
            )}

            {itemType === "material" && (
              <div
                className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 shadow-2xs transition-transform group-hover:scale-110 ${
                  isFree
                    ? "bg-sky-500/15 text-sky-600 dark:text-sky-400"
                    : "bg-surface-secondary text-sky-600/70 dark:text-sky-400/70"
                }`}
              >
                <FileText className="w-3.5 h-3.5" />
              </div>
            )}

            {itemType === "live" && (
              <div
                className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 shadow-2xs transition-transform group-hover:scale-110 ${
                  isFree
                    ? "bg-rose-500/15 text-rose-600 dark:text-rose-400"
                    : "bg-surface-secondary text-rose-600/70 dark:text-rose-400/70"
                }`}
              >
                <Radio className="w-3.5 h-3.5" />
              </div>
            )}

            {itemType === "resource" && (
              <div
                className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 shadow-2xs transition-transform group-hover:scale-110 ${
                  isFree
                    ? "bg-purple-500/15 text-purple-600 dark:text-purple-400"
                    : "bg-surface-secondary text-purple-600/70 dark:text-purple-400/70"
                }`}
              >
                <LinkIcon className="w-3.5 h-3.5" />
              </div>
            )}

            {/* Title and Metadata */}
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-[11px] font-mono text-text-muted/80 shrink-0">
                  {lIdx + 1 < 10 ? `০${lIdx + 1}.` : `${lIdx + 1}.`}
                </span>
                <span
                  className={`font-bengali font-semibold truncate ${
                    isFree
                      ? "text-text group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors"
                      : "text-text/90 group-hover:text-text transition-colors"
                  }`}
                >
                  {lesson.titleBn || lesson.title}
                </span>

                {/* Item Type Badge */}
                {itemType === "exam" && (
                  <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 font-bengali shrink-0">
                    পরীক্ষা
                  </span>
                )}
                {itemType === "material" && (
                  <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-sky-500/10 text-sky-600 dark:text-sky-400 border border-sky-500/20 font-bengali shrink-0">
                    লেকচার শিট
                  </span>
                )}
                {itemType === "live" && (
                  <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-rose-500/10 text-rose-600 dark:text-rose-400 border border-rose-500/20 font-bengali inline-flex items-center gap-1 shrink-0">
                    <span className="w-1.5 h-1.5 rounded-full bg-rose-500 animate-pulse" />
                    <span>লাইভ</span>
                  </span>
                )}
                {itemType === "resource" && (
                  <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-purple-500/10 text-purple-600 dark:text-purple-400 border border-purple-500/20 font-bengali shrink-0">
                    রিসোর্স
                  </span>
                )}

                {/* Free Demo Chip */}
                {isFree && (
                  <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border border-emerald-500/25 font-bengali inline-flex items-center gap-1 shrink-0">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                    <span>ফ্রি ডেমো</span>
                  </span>
                )}
              </div>

              {/* Rich Subtitle Pills: Questions, Marks, Schedule, File size */}
              <div className="flex items-center gap-2 flex-wrap pl-4.5 mt-0.5">
                {lesson.title && lesson.title !== lesson.titleBn && (
                  <span className="text-[11px] text-text-muted font-sans truncate mr-1">
                    {lesson.title}
                  </span>
                )}
                {itemType === "exam" && lesson.questionsCount && (
                  <span className="text-[10px] font-semibold text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 px-1.5 py-0.2 rounded font-sans">
                    {lesson.questionsCount} Questions
                  </span>
                )}
                {itemType === "exam" && lesson.marks && (
                  <span className="text-[10px] font-semibold text-amber-600 dark:text-amber-400 bg-amber-500/10 px-1.5 py-0.2 rounded font-sans">
                    {lesson.marks} Marks
                  </span>
                )}
                {itemType === "live" && lesson.liveTime && (
                  <span className="text-[10px] font-semibold text-rose-600 dark:text-rose-400 bg-rose-500/10 px-1.5 py-0.2 rounded font-bengali flex items-center gap-1">
                    <Clock className="w-2.5 h-2.5" />
                    <span>{lesson.liveTime}</span>
                  </span>
                )}
                {itemType === "material" && lesson.fileSize && (
                  <span className="text-[10px] font-semibold text-sky-600 dark:text-sky-400 bg-sky-500/10 px-1.5 py-0.2 rounded font-mono">
                    {lesson.fileSize}
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Right: Duration + Action Pill */}
          <div className="flex items-center gap-2.5 shrink-0 ml-2">
            {lesson.duration && (
              <span className="text-[11px] sm:text-xs font-semibold text-text-muted font-mono tabular-nums">
                {lesson.duration}
              </span>
            )}

            {isFree ? (
              itemType === "exam" ? (
                lesson.examUrl ? (
                  <a
                    href={lesson.examUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={(e) => e.stopPropagation()}
                    className="px-2.5 py-1 rounded-lg text-xs font-bold bg-emerald-600 hover:bg-emerald-700 text-white font-bengali shadow-xs flex items-center gap-1 cursor-pointer transition-colors"
                  >
                    <Eye className="w-3 h-3" />
                    <span>পরীক্ষা দিন</span>
                  </a>
                ) : courseSlug ? (
                  <Link
                    href={`/course/${courseSlug}/learn/${lesson.id}`}
                    onClick={(e) => e.stopPropagation()}
                    className="px-2.5 py-1 rounded-lg text-xs font-bold bg-emerald-600 hover:bg-emerald-700 text-white font-bengali shadow-xs flex items-center gap-1 cursor-pointer transition-colors"
                  >
                    <Eye className="w-3 h-3" />
                    <span>পরীক্ষা দিন</span>
                  </Link>
                ) : (
                  <span className="px-2.5 py-1 rounded-lg text-xs font-bold bg-emerald-600 text-white font-bengali shadow-xs">
                    ফ্রি
                  </span>
                )
              ) : itemType === "material" ? (
                lesson.fileUrl ? (
                  <a
                    href={lesson.fileUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={(e) => e.stopPropagation()}
                    className="px-2.5 py-1 rounded-lg text-xs font-bold bg-sky-600 hover:bg-sky-700 text-white font-bengali shadow-xs flex items-center gap-1 cursor-pointer transition-colors"
                  >
                    <ExternalLink className="w-3 h-3" />
                    <span>শিট দেখুন</span>
                  </a>
                ) : (
                  <span className="px-2.5 py-1 rounded-lg text-xs font-bold bg-sky-600 text-white font-bengali shadow-xs">
                    ফ্রি নোট
                  </span>
                )
              ) : itemType === "live" ? (
                lesson.liveUrl ? (
                  <a
                    href={lesson.liveUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={(e) => e.stopPropagation()}
                    className="px-2.5 py-1 rounded-lg text-xs font-bold bg-rose-600 hover:bg-rose-700 text-white font-bengali shadow-xs flex items-center gap-1 cursor-pointer transition-colors"
                  >
                    <Radio className="w-3 h-3" />
                    <span>লাইভে যান</span>
                  </a>
                ) : (
                  <span className="px-2.5 py-1 rounded-lg text-xs font-bold bg-rose-600 text-white font-bengali shadow-xs">
                    লাইভ
                  </span>
                )
              ) : itemType === "resource" ? (
                lesson.externalUrl ? (
                  <a
                    href={lesson.externalUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={(e) => e.stopPropagation()}
                    className="px-2.5 py-1 rounded-lg text-xs font-bold bg-purple-600 hover:bg-purple-700 text-white font-bengali shadow-xs flex items-center gap-1 cursor-pointer transition-colors"
                  >
                    <ExternalLink className="w-3 h-3" />
                    <span>লিংক</span>
                  </a>
                ) : (
                  <span className="px-2.5 py-1 rounded-lg text-xs font-bold bg-purple-600 text-white font-bengali shadow-xs">
                    রিসোর্স
                  </span>
                )
              ) : courseSlug ? (
                <Link
                  href={`/course/${courseSlug}/learn/${lesson.id}`}
                  onClick={(e) => e.stopPropagation()}
                  className="hidden sm:inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-bold bg-emerald-600 hover:bg-emerald-700 text-white font-bengali shadow-xs transition-colors cursor-pointer"
                >
                  <Eye className="w-3 h-3" />
                  <span>দেখুন</span>
                </Link>
              ) : (
                <span className="px-2.5 py-1 rounded-lg text-xs font-bold bg-emerald-600 text-white font-bengali shadow-xs">
                  ফ্রি
                </span>
              )
            ) : (
              <span className="text-[10px] text-text-muted font-bold font-bengali bg-surface-secondary px-2 py-1 rounded-md border border-border/60">
                লক করা
              </span>
            )}
          </div>
        </div>

        {/* Prominently Highlighted Free Materials Attached to Lesson */}
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
  };

  // ---------------------------------------------------------------------------
  // RENDER SECTION CARD
  // ---------------------------------------------------------------------------
  const renderSectionCard = (section: CurriculumSection, idx: number) => {
    const isOpen = !!openSections[section.id];
    const freeLessons = (section.lessons || []).filter((l) => l.isFreePreview);
    const hasFreeLesson = freeLessons.length > 0;

    const secType = section.sectionType || "academic";
    const typeLabel =
      secType === "custom"
        ? section.tabLabel || "কাস্টম ট্যাব"
        : labelForTabKey(secType);

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
          <div className="flex items-center gap-3 min-w-0 flex-1">
            <span className="w-8 h-8 rounded-xl bg-emerald-500/10 border border-emerald-500/25 text-emerald-600 dark:text-emerald-400 flex items-center justify-center text-xs font-black font-mono shrink-0 shadow-2xs">
              {idx + 1 < 10 ? `০${idx + 1}` : idx + 1}
            </span>

            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-2 flex-wrap">
                <h4 className="font-bold text-sm sm:text-base text-text font-bengali leading-snug">
                  {section.titleBn}
                </h4>
                {section.subject && (
                  <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-emerald-500/10 text-emerald-600 border border-emerald-500/20 font-bengali">
                    {section.subject}
                  </span>
                )}
                {activeTab === "all" && secType && secType !== "academic" && secType !== "content" && (
                  <span
                    className={`px-2 py-0.5 rounded-md text-[10px] font-bold font-bengali border ${
                      secType === "demo"
                        ? "bg-emerald-500/10 text-emerald-600 border-emerald-500/20"
                        : secType === "exam"
                        ? "bg-amber-500/10 text-amber-600 border-amber-500/20"
                        : secType === "pre_admission" || secType === "admission"
                        ? "bg-violet-500/10 text-violet-600 border-violet-500/20"
                        : secType === "solving"
                        ? "bg-sky-500/10 text-sky-600 border-sky-500/20"
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

          <div className="flex items-center gap-2.5 shrink-0">
            {hasFreeLesson && (
              <span className="hidden xs:inline-flex items-center gap-1 text-[11px] font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-500/15 px-2 py-0.5 rounded-lg border border-emerald-500/25 font-bengali">
                <Sparkles className="w-3 h-3 text-emerald-500" />
                <span>{freeLessons.length}টি ফ্রি</span>
              </span>
            )}
            <span className="text-xs font-bold text-text-muted font-bengali bg-surface-secondary px-2.5 py-1 rounded-lg border border-border/60">
              {section.lessons?.length || 0}টি ক্লাস/আইটেম
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
            {(section.lessons || []).map((lesson, lIdx) => renderLessonRow(lesson, lIdx))}
          </div>
        )}
      </div>
    );
  };

  // ---------------------------------------------------------------------------
  // RENDER SUBJECT ACCORDION (EdgeCourse BD Style Nested Subject Structure)
  // ---------------------------------------------------------------------------
  const renderSubjectGroup = (
    subjectGroup: { subject: string; sections: CurriculumSection[]; totalLessons: number },
    sIdx: number
  ) => {
    const isSubjOpen = openSubjects[subjectGroup.subject] !== false;
    const totalFree = subjectGroup.sections.reduce(
      (acc, sec) => acc + (sec.lessons || []).filter((l) => l.isFreePreview).length,
      0
    );

    return (
      <div
        key={subjectGroup.subject}
        className={`rounded-2xl border transition-all duration-200 overflow-hidden shadow-2xs ${
          isSubjOpen
            ? "border-emerald-500/40 bg-surface shadow-xs"
            : "border-border/70 bg-surface hover:border-border"
        } border-l-4 border-l-emerald-600`}
      >
        {/* Subject Header Button */}
        <button
          type="button"
          onClick={() => toggleSubject(subjectGroup.subject)}
          className="w-full flex items-center justify-between p-4 sm:p-4.5 text-left hover:bg-surface-secondary/40 transition-colors cursor-pointer gap-3 bg-surface"
        >
          <div className="flex items-center gap-3 min-w-0 flex-1">
            <div className="w-8 h-8 rounded-xl bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0 shadow-2xs">
              <BookOpen className="w-4 h-4" />
            </div>

            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-2 flex-wrap">
                <h4 className="font-black text-sm sm:text-base text-text font-bengali leading-snug">
                  {subjectGroup.subject}
                </h4>
                <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-surface-secondary text-text-muted border border-border/60 font-bengali">
                  {subjectGroup.sections.length}টি অধ্যায়
                </span>
                {totalFree > 0 && (
                  <span className="hidden xs:inline-flex items-center gap-1 text-[10.5px] font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-500/15 px-2 py-0.5 rounded-lg border border-emerald-500/25 font-bengali">
                    <Sparkles className="w-3 h-3 text-emerald-500" />
                    <span>{totalFree}টি ফ্রি</span>
                  </span>
                )}
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2.5 shrink-0">
            <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400 font-mono bg-emerald-500/10 px-2.5 py-1 rounded-lg border border-emerald-500/20 tabular-nums">
              {subjectGroup.totalLessons} Items
            </span>
            <div
              className={`w-7 h-7 rounded-lg flex items-center justify-center transition-colors ${
                isSubjOpen ? "bg-emerald-500/10 text-emerald-600" : "text-text-muted hover:bg-surface-secondary"
              }`}
            >
              <ChevronDown
                className={`w-4 h-4 transition-transform duration-300 ${
                  isSubjOpen ? "rotate-180" : ""
                }`}
              />
            </div>
          </div>
        </button>

        {/* Sections under this subject */}
        {isSubjOpen && (
          <div className="border-t border-border/70 bg-surface-secondary/20 p-3 sm:p-4 space-y-3">
            {subjectGroup.sections.map((section, secIdx) => renderSectionCard(section, secIdx))}
          </div>
        )}
      </div>
    );
  };

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
                    const matching = curriculum.find((s) => matchesCurriculumTab(s, tab.key));
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
          <span className="font-semibold text-text-muted">• {totalFilteredLessons}টি আইটেম/ক্লাস</span>
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
              placeholder="ক্লাস বা বিষয় খুঁজুন..."
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
            কোর্স আউটলাইন দেখুন
          </button>
        </div>
      )}

      {/* 4. Curriculum Content Rendering */}
      <div className="space-y-6">
        {/* CASE A: ActiveTab === "all" -> Group by Phase with EdgeCourse BD Headers */}
        {groupedStructure.isGroupedByPhase &&
          groupedStructure.phaseGroups.map((group) => (
            <div key={group.key} className="space-y-3">
              {/* EdgeCourse BD Signature Section/Phase Header */}
              <div className="flex items-center justify-between pt-2 pb-1">
                <div className="flex items-center gap-2">
                  <span className="w-1.5 h-5 bg-emerald-600 rounded-full shrink-0" />
                  <h3 className="text-base sm:text-lg font-black text-text font-bengali">
                    {group.label}
                  </h3>
                </div>
                <span className="px-2.5 py-0.5 rounded-full text-xs font-mono font-bold bg-surface-secondary border border-border/60 text-text-muted">
                  {group.sections.length}
                </span>
              </div>

              {/* Sections inside Phase */}
              <div className="space-y-3.5">
                {group.sections.map((section, idx) => renderSectionCard(section, idx))}
              </div>
            </div>
          ))}

        {/* CASE B: Specific Tab with Subjects -> Render EdgeCourse BD Nested Subject Accordions */}
        {!groupedStructure.isGroupedByPhase && groupedStructure.hasSubjects && (
          <div className="space-y-4">
            {/* Subject Accordions */}
            {groupedStructure.subjectGroups.map((subjectGroup, sIdx) =>
              renderSubjectGroup(subjectGroup, sIdx)
            )}

            {/* Standalone Modules without Subject (if any) */}
            {groupedStructure.noSubjectSections.length > 0 && (
              <div className="space-y-3 pt-2">
                <div className="flex items-center gap-2">
                  <span className="w-1.5 h-4 bg-text-muted/40 rounded-full shrink-0" />
                  <h4 className="text-sm font-bold text-text-muted font-bengali">
                    অন্যান্য সহায়ক মডিউল
                  </h4>
                </div>
                <div className="space-y-3.5">
                  {groupedStructure.noSubjectSections.map((section, idx) =>
                    renderSectionCard(section, idx)
                  )}
                </div>
              </div>
            )}
          </div>
        )}

        {/* CASE C: Specific Tab without Subjects -> Direct Section Cards */}
        {!groupedStructure.isGroupedByPhase &&
          !groupedStructure.hasSubjects &&
          groupedStructure.noSubjectSections.map((section, idx) =>
            renderSectionCard(section, idx)
          )}
      </div>

      {/* 5. Friendly Context-Aware Locked Item Modal (EdgeCourse BD enrollment prompt) */}
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

            {(() => {
              const itemType = lockedModalLesson.itemType || "video";
              const isExam = itemType === "exam";
              const isMaterial = itemType === "material";
              const isLive = itemType === "live";
              const isResource = itemType === "resource";

              return (
                <>
                  <div
                    className={`w-14 h-14 rounded-2xl flex items-center justify-center mx-auto shadow-sm ${
                      isExam
                        ? "bg-emerald-500/15 border border-emerald-500/30 text-emerald-500"
                        : isMaterial
                        ? "bg-sky-500/15 border border-sky-500/30 text-sky-500"
                        : isLive
                        ? "bg-rose-500/15 border border-rose-500/30 text-rose-500"
                        : isResource
                        ? "bg-purple-500/15 border border-purple-500/30 text-purple-500"
                        : "bg-amber-500/15 border border-amber-500/30 text-amber-500"
                    }`}
                  >
                    {isExam ? (
                      <ClipboardList className="w-7 h-7" />
                    ) : isMaterial ? (
                      <FileText className="w-7 h-7" />
                    ) : isLive ? (
                      <Radio className="w-7 h-7" />
                    ) : isResource ? (
                      <LinkIcon className="w-7 h-7" />
                    ) : (
                      <Lock className="w-7 h-7" />
                    )}
                  </div>

                  <div className="space-y-2">
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-bold border inline-block ${
                        isExam
                          ? "bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border-emerald-500/20"
                          : isMaterial
                          ? "bg-sky-500/15 text-sky-600 dark:text-sky-400 border-sky-500/20"
                          : isLive
                          ? "bg-rose-500/15 text-rose-600 dark:text-rose-400 border-rose-500/20"
                          : isResource
                          ? "bg-purple-500/15 text-purple-600 dark:text-purple-400 border-purple-500/20"
                          : "bg-amber-500/15 text-amber-600 dark:text-amber-400 border-amber-500/20"
                      }`}
                    >
                      {isExam
                        ? "পরীক্ষাটি লক করা রয়েছে"
                        : isMaterial
                        ? "লেকচার শিটটি লক করা রয়েছে"
                        : isLive
                        ? "লাইভ ক্লাস সেশনটি লক করা রয়েছে"
                        : isResource
                        ? "রিসোর্স লিংকটি লক করা রয়েছে"
                        : "ক্লাসটি লক করা রয়েছে"}
                    </span>
                    <h3 className="text-lg font-black text-text leading-snug">
                      {lockedModalLesson.titleBn || lockedModalLesson.title}
                    </h3>
                    <p className="text-xs sm:text-sm text-text-muted leading-relaxed">
                      {isExam
                        ? "এই অধ্যায়ের পরীক্ষা, ওএমআর ও নেগেটিভ মার্কিংসহ পূর্ণাঙ্গ সমাধান দেখতে কোর্সে ভর্তি নিশ্চিত করুন।"
                        : isMaterial
                        ? "এই অধ্যায়ের সম্পূর্ণ লেকচার শিট, হ্যান্ডনোট ও প্রশ্নব্যাংক ডাউনলোড করতে কোর্সে ভর্তি নিশ্চিত করুন।"
                        : isLive
                        ? "ইন্সট্রাক্টরের সাথে ইন্টারেক্টিভ লাইভ ক্লাস ও সরাসরি প্রশ্ন-উত্তরে অংশ নিতে কোর্সে ভর্তি নিশ্চিত করুন।"
                        : isResource
                        ? "স্টুডেন্ট ডিসকাশন গ্রুপ, স্টাডি ট্র্যাকার ও ড্রাইভ রিসোর্স অ্যাক্সেস করতে কোর্সে ভর্তি নিশ্চিত করুন।"
                        : "এই সম্পূর্ণ ক্লাস, ভিডিও লেকচার এবং সংশ্লিষ্ট প্র্যাকটিস শিট অ্যাক্সেস করতে কোর্সে ভর্তি নিশ্চিত করুন।"}
                    </p>
                  </div>

                  <div className="p-3.5 rounded-2xl bg-surface-secondary/60 border border-border/60 text-left text-xs space-y-2">
                    <div className="flex items-center gap-2 text-text font-semibold">
                      <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                      <span>ফুল এইচডি ১০৮০p রেকর্ডেড ক্লাস ও আনলিমিটেড ভিউ</span>
                    </div>
                    <div className="flex items-center gap-2 text-text font-semibold">
                      <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                      <span>অধ্যায়ভিত্তিক মডেল টেস্ট, কুইজ ও ওএমআর সমাধান</span>
                    </div>
                    <div className="flex items-center gap-2 text-text font-semibold">
                      <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                      <span>ডাউনলোডযোগ্য লেকচার শিট ও অনুশীলন পিডিএফ</span>
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
                </>
              );
            })()}
          </div>
        </div>
      )}
    </div>
  );
}
