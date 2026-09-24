"use client";

import React from "react";
import { ListChecks, Check, Target, BookOpen, Sparkles } from "lucide-react";

interface CourseDescriptionViewProps {
  description?: string | null;
  subtitle?: string | null;
  courseTitle?: string;
}

interface ParsedDescription {
  intro: string;
  pointsTitle: string;
  points: string[];
  goal: string | null;
  paragraphs: string[];
}

export function parseCourseDescription(rawText?: string | null): ParsedDescription {
  if (!rawText || typeof rawText !== "string" || !rawText.trim()) {
    return {
      intro: "",
      pointsTitle: "কোর্সে যা যা থাকছে",
      points: [],
      goal: null,
      paragraphs: [],
    };
  }

  const text = rawText.trim();

  // Pattern 1: Check if text contains line breaks
  const hasLineBreaks = text.includes("\n");

  let intro = "";
  let pointsTitle = "কোর্সে যা যা থাকছে";
  let points: string[] = [];
  let goal: string | null = null;
  let paragraphs: string[] = [];

  // Markers for sections
  const highlightsRegex = /(?:কোর্সে\s*যা\s*থাকছে|কী\s*কী\s*থাকছে|কোর্সের\s*মূল\s*বৈশিষ্ট্য|কোর্সের\s*বৈশিষ্ট্য|যা\s*যা\s*পাবেন|যা\s*যা\s*শিখবেন|ফিচারসমূহ|What's\s*Included)/i;
  const goalRegex = /(?:লক্ষ্য|উদ্দেশ্য|কোর্সের\s*মূল\s*লক্ষ্য|কোর্সের\s*উদ্দেশ্য|Course\s*Goal)\s*[:—\-]/i;

  if (hasLineBreaks) {
    const rawLines = text.split(/\r?\n/).map((l) => l.trim()).filter(Boolean);
    let inHighlights = false;
    let inGoal = false;
    const introLines: string[] = [];
    const goalLines: string[] = [];
    const extraParagraphs: string[] = [];

    for (const line of rawLines) {
      if (highlightsRegex.test(line)) {
        inHighlights = true;
        inGoal = false;
        pointsTitle = line.replace(/[:—\-\.]+$/, "").trim() || "কোর্সে যা যা থাকছে";
        continue;
      }

      if (goalRegex.test(line)) {
        inGoal = true;
        inHighlights = false;
        const cleaned = line.replace(goalRegex, "").trim();
        if (cleaned) goalLines.push(cleaned);
        continue;
      }

      // Check if line is a bullet item
      const bulletMatch = line.match(/^[•\-\*\✓\✔\►\▪\d+\.০-৯+\.]\s*(.+)$/);
      if (bulletMatch || inHighlights) {
        const itemText = bulletMatch ? bulletMatch[1].trim() : line.replace(/^[•\-\*\✓\✔\►\▪\s]+/, "").trim();
        if (itemText && !highlightsRegex.test(itemText) && !goalRegex.test(itemText)) {
          points.push(itemText);
          continue;
        }
      }

      if (inGoal) {
        goalLines.push(line);
      } else if (!inHighlights) {
        introLines.push(line);
      } else {
        extraParagraphs.push(line);
      }
    }

    intro = introLines.join(" ");
    goal = goalLines.join(" ");
    paragraphs = extraParagraphs;
  } else {
    // Single continuous line (e.g. from single-line paste in database)
    let remaining = text;

    // Check goal first if at the end
    const goalMatch = remaining.match(goalRegex);
    if (goalMatch && goalMatch.index !== undefined) {
      goal = remaining.slice(goalMatch.index + goalMatch[0].length).trim();
      remaining = remaining.slice(0, goalMatch.index).trim();
    }

    // Check highlights section
    const hlMatch = remaining.match(highlightsRegex);
    if (hlMatch && hlMatch.index !== undefined) {
      intro = remaining.slice(0, hlMatch.index).trim().replace(/[:—\-\.]+$/, "").trim();
      if (intro && !intro.endsWith("।") && !intro.endsWith(".")) {
        intro += "।";
      }

      const pointsRaw = remaining.slice(hlMatch.index + hlMatch[0].length).trim().replace(/^[:—\-\.]+/, "").trim();

      // Check if points have bullets
      if (/[•\-\*\✓\✔\►\▪]/.test(pointsRaw)) {
        points = pointsRaw
          .split(/[•\-\*\✓\✔\►\▪]/)
          .map((p) => p.trim())
          .filter((p) => p.length > 2);
      } else if (/(?:\d+[\.\)]|[০-৯]+[\.\)])/.test(pointsRaw)) {
        points = pointsRaw
          .split(/(?=\d+[\.\)]|[০-৯]+[\.\)])/)
          .map((p) => p.replace(/^[\d+০-৯\.\)]+\s*/, "").trim())
          .filter((p) => p.length > 2);
      } else {
        // Continuous Bengali text split using known educational sentence/phrase boundaries
        const boundaryRegex = /(?=(?:বাংলা ১ম|গদ্য,|পদ্য|সহপাঠের|ব্যাকরণের|সৃজনশীল|বোর্ড ও|পরীক্ষায়|অধ্যায়ভিত্তিক|গুরুত্বপূর্ণ সাজেশন|রিভিশন ক্লাস|দুর্বল শিক্ষার্থীদের|নিয়মিত ক্লাস|লাইভ ক্লাস|লেকচার শিট|মডেল টেস্ট|প্রশ্ন সমাধান))/g;
        const candidatePoints = pointsRaw
          .split(boundaryRegex)
          .map((p) => p.trim().replace(/[,;]+$/, "").trim())
          .filter((p) => p.length >= 6);

        if (candidatePoints.length >= 2) {
          points = candidatePoints;
        } else {
          // Fallback to splitting by । or . if multiple sentences
          const bySentence = pointsRaw
            .split(/(?<=[।\.])/)
            .map((s) => s.trim())
            .filter((s) => s.length > 4);
          if (bySentence.length >= 2) {
            points = bySentence;
          } else {
            paragraphs.push(pointsRaw);
          }
        }
      }
    } else {
      // No highlights marker: just an intro or paragraph
      intro = remaining;
    }
  }

  return {
    intro: intro.trim(),
    pointsTitle: pointsTitle.trim() || "কোর্সে যা যা থাকছে",
    points: points.filter((p) => p.trim().length > 0),
    goal: goal?.trim() || null,
    paragraphs: paragraphs.filter((p) => p.trim().length > 0),
  };
}

export function CourseDescriptionView({
  description,
  subtitle,
  courseTitle,
}: CourseDescriptionViewProps) {
  const content = description || subtitle || "";
  const parsed = parseCourseDescription(content);

  // If parsed has no points, no goal, and intro is short, display clean paragraph
  const hasStructuredContent = parsed.points.length > 0 || !!parsed.goal;

  return (
    <div className="space-y-6">
      {/* Intro Overview Paragraph */}
      {parsed.intro ? (
        <div className="text-sm sm:text-base text-slate-700 dark:text-slate-300 font-bengali leading-relaxed space-y-3">
          <p className="font-normal text-text/90">
            {parsed.intro}
          </p>
        </div>
      ) : !hasStructuredContent && content ? (
        <div className="text-sm sm:text-base text-slate-700 dark:text-slate-300 font-bengali leading-relaxed space-y-3">
          <p className="font-normal text-text/90">
            {content}
          </p>
        </div>
      ) : null}

      {/* Structured Key Points / Curriculum Highlights */}
      {parsed.points.length > 0 && (
        <div className="pt-2">
          {/* Section Header */}
          <div className="flex items-center gap-2.5 mb-4">
            <span className="w-8 h-8 rounded-xl bg-primary/10 text-primary border border-primary/20 flex items-center justify-center shrink-0">
              <ListChecks className="w-4 h-4" />
            </span>
            <div>
              <h3 className="text-sm sm:text-base font-black text-text font-bengali">
                {parsed.pointsTitle || "কোর্সে যা যা থাকছে"}
              </h3>
              <p className="text-[11px] sm:text-xs text-text-muted font-bengali">
                এই কোর্সে ভর্তি হলে শিক্ষার্থীরা যেসকল সুবিধা ও প্রস্তুতি পাবেন:
              </p>
            </div>
          </div>

          {/* 2-Column Responsive Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5 sm:gap-3">
            {parsed.points.map((point, idx) => (
              <div
                key={idx}
                className="group p-3 sm:p-3.5 rounded-xl sm:rounded-2xl border border-border/80 bg-surface-secondary/40 hover:bg-surface-secondary/80 hover:border-primary/40 transition-all flex items-start gap-2.5 shadow-2xs"
              >
                <span className="w-5 h-5 rounded-lg bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0 mt-0.5 border border-emerald-500/25 group-hover:scale-110 transition-transform">
                  <Check className="w-3 h-3 stroke-[3]" />
                </span>
                <span className="text-xs sm:text-sm font-semibold text-text leading-snug font-bengali">
                  {point}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Target & Goal Highlight Banner */}
      {parsed.goal && (
        <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-r from-primary/10 via-primary/5 to-transparent border border-primary/25 flex items-start gap-3.5 shadow-2xs">
          <span className="w-9 h-9 rounded-xl bg-primary/20 text-primary flex items-center justify-center shrink-0 mt-0.5 border border-primary/30">
            <Target className="w-4 h-4 text-primary" />
          </span>
          <div className="space-y-1">
            <h4 className="text-xs sm:text-sm font-black text-primary font-bengali flex items-center gap-1.5">
              <span>কোর্সের মূল লক্ষ্য ও অর্জন</span>
            </h4>
            <p className="text-xs sm:text-sm text-text/90 font-bengali leading-relaxed">
              {parsed.goal}
            </p>
          </div>
        </div>
      )}

      {/* Extra trailing paragraphs if any */}
      {parsed.paragraphs.length > 0 && (
        <div className="space-y-3 pt-2 text-xs sm:text-sm text-text-muted font-bengali leading-relaxed">
          {parsed.paragraphs.map((para, pIdx) => (
            <p key={pIdx}>{para}</p>
          ))}
        </div>
      )}
    </div>
  );
}
