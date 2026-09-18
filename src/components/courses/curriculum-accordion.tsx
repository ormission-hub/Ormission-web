"use client";

import { useState } from "react";
import Link from "next/link";
import { ChevronDown, PlayCircle, FileText, Lock, Video } from "lucide-react";
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
                  const lessonContent = (
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
                            ফ্রি প্রিভিউ
                          </span>
                        )}
                        <span className="text-xs font-semibold text-text-muted font-sans tabular-nums">
                          {lesson.duration}
                        </span>
                      </div>
                    </div>
                  );

                  return courseSlug ? (
                    <Link
                      key={lesson.id}
                      href={`/course/${courseSlug}/learn/${lesson.id}`}
                      className="block"
                    >
                      {lessonContent}
                    </Link>
                  ) : (
                    <div key={lesson.id}>{lessonContent}</div>
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
