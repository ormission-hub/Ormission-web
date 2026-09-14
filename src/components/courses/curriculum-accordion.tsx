"use client";

import { useState } from "react";
import { ChevronDown, PlayCircle, FileText, Lock } from "lucide-react";
import { type CurriculumSection } from "@/lib/data/courses";

interface CurriculumAccordionProps {
  curriculum: CurriculumSection[];
}

export function CurriculumAccordion({ curriculum }: CurriculumAccordionProps) {
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

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between text-xs text-text-muted mb-2 font-bengali">
        <span>মোট {curriculum.length}টি অধ্যায় • {totalLessons}টি লেসন</span>
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
          className="text-primary hover:underline font-semibold"
        >
          {Object.keys(openSections).length === curriculum.length ? "সব বন্ধ করুন" : "সব খুলুন"}
        </button>
      </div>

      {curriculum.map((section, idx) => {
        const isOpen = !!openSections[section.id];
        return (
          <div
            key={section.id}
            className="border border-border rounded-lg bg-surface overflow-hidden transition-colors"
          >
            {/* Section Header Button */}
            <button
              type="button"
              onClick={() => toggleSection(section.id)}
              className="w-full flex items-center justify-between p-4 text-left hover:bg-surface-secondary/50 transition-colors"
            >
              <div className="flex items-center gap-3">
                <span className="w-6 h-6 rounded-full bg-primary/10 text-primary flex items-center justify-center text-xs font-bold font-sans shrink-0">
                  {idx + 1}
                </span>
                <div>
                  <h4 className="font-bold text-sm lg:text-base text-text font-bengali">
                    {section.titleBn}
                  </h4>
                  <p className="text-xs text-text-muted font-sans font-normal">
                    {section.title}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-xs text-text-muted font-bengali shrink-0">
                  {section.lessons.length}টি ক্লাস
                </span>
                <ChevronDown
                  className={`w-4 h-4 text-text-muted transition-transform duration-200 ${
                    isOpen ? "rotate-180" : ""
                  }`}
                />
              </div>
            </button>

            {/* Lessons List */}
            {isOpen && (
              <div className="border-t border-border bg-surface-secondary/30 divide-y divide-border/60">
                {section.lessons.map((lesson) => (
                  <div
                    key={lesson.id}
                    className="flex items-center justify-between px-4 py-3 text-xs lg:text-sm hover:bg-surface-secondary/70 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      {lesson.isFreePreview ? (
                        <PlayCircle className="w-4 h-4 text-secondary shrink-0" />
                      ) : (
                        <Lock className="w-4 h-4 text-text-muted/60 shrink-0" />
                      )}
                      <div>
                        <span className="text-text font-bengali font-medium">
                          {lesson.titleBn}
                        </span>
                        <div className="text-xs text-text-muted font-sans">
                          {lesson.title}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 shrink-0">
                      {lesson.isFreePreview && (
                        <span className="px-2 py-0.5 rounded text-[11px] font-semibold bg-secondary/10 text-secondary font-bengali">
                          ফ্রি প্রিভিউ
                        </span>
                      )}
                      <span className="text-xs text-text-muted font-sans">
                        {lesson.duration}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
