"use client";

import { useState } from "react";
import Link from "next/link";
import { ChevronDown, PlayCircle, FileText, Lock, Video, ExternalLink, Sparkles, Download } from "lucide-react";
import { type CurriculumSection } from "@/lib/data/courses";

interface CurriculumAccordionProps {
  curriculum: CurriculumSection[];
  courseSlug?: string;
}

export function CurriculumAccordion({ curriculum, courseSlug }: CurriculumAccordionProps) {
  // First section open by default
  const [openSections, setOpenSections] = useState<Record<string, boolean>>({
    [curriculum[0]?.id || ""]: true,
  });

  const toggleSection = (id: string) => {
    setOpenSections((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  const totalLessons = curriculum.reduce((acc, s) => acc + s.lessons.length, 0);

  if (!curriculum || curriculum.length === 0) {
    return (
      <div className="p-8 rounded-2xl bg-surface-secondary/40 border border-border/60 text-center text-xs sm:text-sm text-text-muted font-bengali">
        সিলেবাস ও কারিকুলাম শীঘ্রই বিস্তারিত যুক্ত হচ্ছে...
      </div>
    );
  }

  return (
    <div className="space-y-3.5">
      <div className="flex items-center justify-between text-xs text-text-muted mb-2 font-bengali">
        <span className="font-semibold text-text">
          মোট {curriculum.length}টি অধ্যায় • {totalLessons}টি ক্লাস
        </span>
        <button
          type="button"
          onClick={() => {
            const allOpen = Object.keys(openSections).length === curriculum.length;
            if (allOpen) {
              setOpenSections({});
            } else {
              const full: Record<string, boolean> = {};
              curriculum.forEach((s) => (full[s.id] = true));
              setOpenSections(full);
            }
          }}
          className="text-primary hover:underline font-bold cursor-pointer"
        >
          {Object.keys(openSections).length === curriculum.length ? "সব বন্ধ করুন" : "সব খুলুন"}
        </button>
      </div>

      {curriculum.map((section, idx) => {
        const isOpen = !!openSections[section.id];
        return (
          <div
            key={section.id}
            className={`border rounded-2xl overflow-hidden transition-all duration-200 ${
              isOpen
                ? "border-primary/40 bg-surface shadow-xs"
                : "border-border/80 bg-surface-secondary/30 hover:border-border"
            }`}
          >
            {/* Section Header Button */}
            <button
              type="button"
              onClick={() => toggleSection(section.id)}
              className="w-full flex items-center justify-between p-4 sm:p-5 text-left hover:bg-surface-secondary/50 transition-colors cursor-pointer"
            >
              <div className="flex items-center gap-3.5 min-w-0">
                <span className="w-7 h-7 rounded-xl bg-primary/10 border border-primary/20 text-primary flex items-center justify-center text-xs font-black font-sans shrink-0">
                  {idx + 1}
                </span>
                <div className="min-w-0">
                  <h4 className="font-bold text-sm sm:text-base text-text font-bengali truncate">
                    {section.titleBn}
                  </h4>
                  {section.title && section.title !== section.titleBn && (
                    <p className="text-[11px] text-text-muted font-sans truncate">
                      {section.title}
                    </p>
                  )}
                </div>
              </div>

              <div className="flex items-center gap-3 shrink-0 ml-2">
                <span className="text-xs font-bold text-text-muted font-bengali bg-surface-secondary px-2.5 py-1 rounded-lg border border-border/60">
                  {section.lessons.length}টি ক্লাস
                </span>
                <ChevronDown
                  className={`w-4 h-4 text-text-muted transition-transform duration-300 ${
                    isOpen ? "rotate-180 text-primary" : ""
                  }`}
                />
              </div>
            </button>

            {/* Lessons List */}
            {isOpen && (
              <div className="border-t border-border/80 bg-surface divide-y divide-border/50">
                {section.lessons.map((lesson) => {
                  const freeMaterials = (lesson.materials || []).filter(
                    (m) => m.isFree || lesson.isFreePreview
                  );
                  const paidMaterials = (lesson.materials || []).filter(
                    (m) => !m.isFree && !lesson.isFreePreview
                  );

                  const lessonRow = (
                    <div className="flex items-center justify-between px-4 sm:px-6 py-3.5 text-xs sm:text-sm hover:bg-surface-secondary/40 transition-colors group cursor-pointer">
                      <div className="flex items-center gap-3 min-w-0 pr-3">
                        {lesson.isFreePreview ? (
                          <div className="w-6 h-6 rounded-lg bg-emerald-500/15 text-emerald-500 flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
                            <PlayCircle className="w-4 h-4" />
                          </div>
                        ) : (
                          <div className="w-6 h-6 rounded-lg bg-surface-secondary text-text-muted/60 flex items-center justify-center shrink-0">
                            <Lock className="w-3.5 h-3.5" />
                          </div>
                        )}
                        <div className="min-w-0">
                          <span className="text-text font-bengali font-medium block truncate group-hover:text-primary transition-colors">
                            {lesson.titleBn}
                          </span>
                          {lesson.title && lesson.title !== lesson.titleBn && (
                            <span className="text-[11px] text-text-muted font-sans block truncate">
                              {lesson.title}
                            </span>
                          )}
                        </div>
                      </div>

                      <div className="flex items-center gap-2 shrink-0">
                        {lesson.isFreePreview && (
                          <span className="px-2 py-0.5 rounded-md text-[10.5px] font-bold bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 font-bengali">
                            আনলক
                          </span>
                        )}
                        <span className="text-xs font-semibold text-text-muted font-sans tabular-nums">
                          {lesson.duration}
                        </span>
                      </div>
                    </div>
                  );

                  return (
                    <div key={lesson.id} className="transition-colors">
                      {courseSlug ? (
                        <Link
                          href={`/course/${courseSlug}/learn/${lesson.id}`}
                          className="block"
                        >
                          {lessonRow}
                        </Link>
                      ) : (
                        <div>{lessonRow}</div>
                      )}

                      {/* Prominently Highlighted Free Materials (Accessible even if class is paid) */}
                      {freeMaterials.map((mat) => (
                        <div
                          key={mat.id}
                          className="ml-6 sm:ml-12 mr-3 sm:mr-6 my-1.5 p-2 sm:p-2.5 rounded-xl bg-emerald-500/10 dark:bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-between gap-3 text-xs shadow-2xs group/mat transition-all hover:border-emerald-500/50"
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
                        <div className="ml-6 sm:ml-12 mr-3 sm:mr-6 my-1 p-1.5 sm:p-2 rounded-lg bg-surface-secondary/40 border border-border/50 flex items-center justify-between gap-2 text-[11px] text-text-muted">
                          <div className="flex items-center gap-1.5 truncate">
                            <Lock className="w-3 h-3 text-rose-500/70 shrink-0" />
                            <span className="font-bengali truncate text-[10.5px] sm:text-[11px]">
                              {paidMaterials.length}টি লক লেকচার শিট ও রিসোর্স
                            </span>
                          </div>
                          <span className="text-[9.5px] text-rose-400 font-bold font-bengali bg-rose-500/10 px-2 py-0.5 rounded-full border border-rose-500/20 shrink-0">
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
  );
}
