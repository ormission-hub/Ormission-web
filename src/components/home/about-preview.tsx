"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import Image from "next/image";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { SectionWrapper } from "@/components/global/section-wrapper";

export interface AboutInstructor {
  id: number | string;
  name: string;
  name_bn?: string;
  designation?: string;
  institution?: string;
  bio?: string;
  photo_url?: string;
  display_order?: number;
  is_featured?: boolean;
}

interface AboutPreviewProps {
  initialInstructors?: AboutInstructor[];
}

const DEFAULT_FOUNDER: AboutInstructor = {
  id: 4,
  name: "Md. Ohid Rashed",
  name_bn: "মোঃ ওহিদ রাশেদ",
  designation: "মালিক ও পরিচালক",
  institution: "Ormission Education",
  photo_url: "https://oorovtqwyfrfjfwuufyi.supabase.co/storage/v1/object/public/hero_images/ohid-rashed-founder.jpg",
};

export function AboutPreview({ initialInstructors }: AboutPreviewProps) {
  // Use provided instructors or fallback to default
  const instructors =
    initialInstructors && initialInstructors.length > 0
      ? initialInstructors.filter((inst) => inst.is_featured !== false)
      : [DEFAULT_FOUNDER];

  const activeList = instructors.length > 0 ? instructors : [DEFAULT_FOUNDER];
  const [activeIndex, setActiveIndex] = useState(0);
  const [touchStart, setTouchStart] = useState<number | null>(null);
  const [isTransitioning, setIsTransitioning] = useState(false);

  // Safe active instructor
  const currentInstructor = activeList[activeIndex] || activeList[0] || DEFAULT_FOUNDER;

  const handleSelectInstructor = useCallback(
    (index: number) => {
      if (index === activeIndex || isTransitioning) return;
      setIsTransitioning(true);
      setTimeout(() => {
        setActiveIndex(index);
        setIsTransitioning(false);
      }, 150);
    },
    [activeIndex, isTransitioning]
  );

  const handlePrev = useCallback(() => {
    const nextIdx = (activeIndex - 1 + activeList.length) % activeList.length;
    handleSelectInstructor(nextIdx);
  }, [activeIndex, activeList.length, handleSelectInstructor]);

  const handleNext = useCallback(() => {
    const nextIdx = (activeIndex + 1) % activeList.length;
    handleSelectInstructor(nextIdx);
  }, [activeIndex, activeList.length, handleSelectInstructor]);

  // Touch gesture support for mobile
  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchStart(e.targetTouches[0].clientX);
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStart === null) return;
    const touchEnd = e.changedTouches[0].clientX;
    const diff = touchStart - touchEnd;
    if (diff > 45) {
      handleNext();
    } else if (diff < -45) {
      handlePrev();
    }
    setTouchStart(null);
  };

  // Image source with fallback
  const photoSrc = currentInstructor.photo_url || "/images/ohid-rashed.jpg";

  return (
    <SectionWrapper className="!pt-1 !pb-2 sm:!pt-2 sm:!pb-4">
      {/* Top Section Heading: আমাদের সম্পর্কে */}
      <div className="text-center mb-2.5 sm:mb-3.5">
        <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black font-bengali tracking-tight">
          <span className="bg-gradient-to-r from-orange-500 via-rose-500 to-amber-500 bg-clip-text text-transparent">
            আমাদের
          </span>{" "}
          <span className="text-text">সম্পর্কে</span>
        </h2>
      </div>

      {/* Main Outer Card Container */}
      <div className="relative rounded-3xl bg-surface border border-border/80 shadow-sm p-4 sm:p-6 lg:p-9 overflow-hidden">
        {/* Soft background ambient gradient blobs */}
        <div className="absolute top-0 left-0 w-72 h-72 bg-gradient-to-br from-orange-200/30 via-rose-100/20 to-transparent dark:from-orange-950/20 rounded-full blur-2xl pointer-events-none" />
        <div className="absolute bottom-0 right-0 w-80 h-80 bg-gradient-to-tl from-indigo-200/30 via-purple-100/20 to-transparent dark:from-indigo-950/20 rounded-full blur-2xl pointer-events-none" />

        <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8 lg:gap-10 items-center">
          {/* Left Column: Mentor / Teacher Showcase Card */}
          <div className="lg:col-span-5 flex flex-col items-center">
            <div
              onTouchStart={handleTouchStart}
              onTouchEnd={handleTouchEnd}
              className="w-full max-w-sm lg:max-w-none rounded-3xl bg-gradient-to-b from-orange-50/80 via-rose-50/40 to-slate-50/60 dark:from-slate-800/80 dark:to-slate-900/80 border border-orange-100/80 dark:border-slate-700/60 p-5 sm:p-7 flex flex-col items-center justify-center relative overflow-hidden shadow-xs select-none"
            >
              {/* Top Left Badge: 🔴 ওরমিশন */}
              <div className="absolute top-3.5 left-3.5 sm:top-4 sm:left-4 inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/95 dark:bg-slate-800/95 border border-slate-200/80 dark:border-slate-700 shadow-2xs text-[11px] font-bold text-slate-700 dark:text-slate-200 font-bengali">
                <span className="w-2 h-2 rounded-full bg-rose-500 animate-pulse" />
                <span>{currentInstructor.institution || "ওরমিশন এডুকেশন"}</span>
              </div>

              {/* Prev / Next Slider Arrows (Only if multiple teachers) */}
              {activeList.length > 1 && (
                <>
                  <button
                    type="button"
                    onClick={handlePrev}
                    aria-label="Previous Instructor"
                    className="absolute left-2.5 top-1/2 -translate-y-1/2 z-20 w-8 h-8 rounded-full bg-white/90 dark:bg-slate-800/90 border border-slate-200 dark:border-slate-700 shadow-sm flex items-center justify-center text-slate-700 dark:text-slate-200 hover:bg-white dark:hover:bg-slate-700 hover:scale-105 active:scale-95 transition-all"
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </button>
                  <button
                    type="button"
                    onClick={handleNext}
                    aria-label="Next Instructor"
                    className="absolute right-2.5 top-1/2 -translate-y-1/2 z-20 w-8 h-8 rounded-full bg-white/90 dark:bg-slate-800/90 border border-slate-200 dark:border-slate-700 shadow-sm flex items-center justify-center text-slate-700 dark:text-slate-200 hover:bg-white dark:hover:bg-slate-700 hover:scale-105 active:scale-95 transition-all"
                  >
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </>
              )}

              {/* Central Circular Avatar Container with Real Portrait */}
              <div
                className={`relative w-48 h-48 sm:w-56 sm:h-56 lg:w-60 lg:h-60 rounded-full bg-slate-900 flex items-center justify-center overflow-hidden shadow-md ring-4 ring-white/80 dark:ring-slate-700/60 mt-4 sm:mt-3 transition-opacity duration-200 ${
                  isTransitioning ? "opacity-40 scale-95" : "opacity-100 scale-100"
                }`}
              >
                <Image
                  src={photoSrc}
                  alt={currentInstructor.name_bn || currentInstructor.name}
                  fill
                  sizes="(max-width: 640px) 200px, (max-width: 1024px) 240px, 260px"
                  className="object-cover object-top"
                  priority
                  unoptimized={photoSrc.startsWith("http")}
                />
              </div>

              {/* Floating Bottom Name Plate */}
              <div
                className={`relative z-10 -mt-6 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border border-slate-200/90 dark:border-slate-700 rounded-2xl px-5 sm:px-6 py-2 sm:py-2.5 shadow-md text-center min-w-[190px] max-w-[90%] transition-opacity duration-200 ${
                  isTransitioning ? "opacity-40" : "opacity-100"
                }`}
              >
                <h4 className="text-sm sm:text-base font-black text-text font-bengali tracking-tight">
                  {currentInstructor.name_bn || currentInstructor.name}
                </h4>
                <p className="text-[11px] font-medium text-text-muted font-bengali mt-0.5">
                  {currentInstructor.designation || "মালিক ও পরিচালক"}
                </p>
                <p className="text-[10px] font-bold text-primary tracking-wider font-sans uppercase mt-0.5">
                  {currentInstructor.institution || "Ormission Education"}
                </p>
              </div>

              {/* Carousel Indicators / Chips (If multiple instructors exist) */}
              {activeList.length > 1 && (
                <div className="flex items-center justify-center gap-2 mt-4 z-10">
                  {activeList.map((inst, idx) => (
                    <button
                      key={inst.id}
                      type="button"
                      onClick={() => handleSelectInstructor(idx)}
                      className={`transition-all duration-300 rounded-full ${
                        idx === activeIndex
                          ? "w-6 h-1.5 bg-primary shadow-xs"
                          : "w-1.5 h-1.5 bg-slate-300 dark:bg-slate-600 hover:bg-primary/60"
                      }`}
                      aria-label={inst.name_bn || inst.name}
                    />
                  ))}
                </div>
              )}
            </div>

            {/* Quick Switcher Avatar Chips below card (If 2+ teachers exist) */}
            {activeList.length > 1 && (
              <div className="flex items-center justify-center gap-2.5 mt-3 max-w-sm flex-wrap">
                {activeList.map((inst, idx) => (
                  <button
                    key={inst.id}
                    type="button"
                    onClick={() => handleSelectInstructor(idx)}
                    className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full border text-xs font-bengali transition-all ${
                      idx === activeIndex
                        ? "bg-primary/10 border-primary text-primary font-bold shadow-2xs"
                        : "bg-surface border-border text-text-muted hover:border-primary/40"
                    }`}
                  >
                    <span className="w-4 h-4 rounded-full overflow-hidden bg-slate-200 dark:bg-slate-700 flex-shrink-0 flex items-center justify-center text-[9px] font-bold">
                      {inst.photo_url ? (
                        <img
                          src={inst.photo_url}
                          alt=""
                          className="w-full h-full object-cover object-top"
                        />
                      ) : (
                        <span>{(inst.name_bn || inst.name).charAt(0)}</span>
                      )}
                    </span>
                    <span className="truncate max-w-[100px]">
                      {inst.name_bn || inst.name}
                    </span>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Right Column: Narrative, Headline & 3 Stats Cards */}
          <div className="lg:col-span-7 flex flex-col items-start">
            {/* Top Tag Pill: 🎯 স্বপ্ন ছোঁয়ার প্রস্তুতি */}
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-50 dark:bg-rose-950/40 border border-rose-200/70 dark:border-rose-800/50 text-[11px] sm:text-xs font-bold text-rose-600 dark:text-rose-400 font-bengali mb-3 sm:mb-4">
              <span>🎯</span>
              <span>স্বপ্ন ছোঁয়ার প্রস্তুতি</span>
            </div>

            {/* Big Headline */}
            <h3 className="text-xl sm:text-2xl lg:text-3xl xl:text-[32px] font-black text-text font-bengali leading-snug lg:leading-[1.35] mb-3 sm:mb-4">
              স্বপ্ন ছোঁয়ার আশা থাকলে সেই স্বপ্নের ভিত তৈরিতে সাথে আছে{" "}
              <span className="text-primary font-black">
                &ldquo;ওরমিশন&rdquo;
              </span>
            </h3>

            {/* Paragraph */}
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 font-medium font-bengali leading-relaxed mb-5 sm:mb-7">
              অনলাইন বিশ্ববিদ্যালয় ভর্তি ও বোর্ড পরীক্ষার প্রস্তুতির জন্য দেশের সেরা প্ল্যাটফর্মগুলোর অন্যতম একটি হলো &ldquo;ওরমিশন&rdquo;। ভর্তি প্রস্তুতি নেওয়া শিক্ষার্থীদের সঠিক দিকনির্দেশনা, নিয়মিত পরীক্ষা, মানসম্মত ক্লাস এবং ধারাবাহিক প্রস্তুতির মাধ্যমে নিজেদের লক্ষ্যে পৌঁছাতে আমরা কাজ করে যাচ্ছি।
            </p>

            {/* 3 Stats Cards: 10+ Courses, 10K+ Exams, 100K+ Students */}
            <div className="grid grid-cols-3 gap-2.5 sm:gap-4 w-full">
              <div className="bg-slate-50/90 dark:bg-slate-800/50 border border-slate-200/80 dark:border-slate-700/60 rounded-2xl p-2.5 sm:p-4 text-center transition-all duration-200 hover:border-primary/40 hover:shadow-xs">
                <div className="text-lg sm:text-2xl lg:text-3xl font-black text-text font-sans tracking-tight">
                  10+
                </div>
                <div className="text-[10px] sm:text-xs font-semibold text-text-muted font-sans mt-0.5">
                  Courses
                </div>
              </div>

              <div className="bg-slate-50/90 dark:bg-slate-800/50 border border-slate-200/80 dark:border-slate-700/60 rounded-2xl p-2.5 sm:p-4 text-center transition-all duration-200 hover:border-primary/40 hover:shadow-xs">
                <div className="text-lg sm:text-2xl lg:text-3xl font-black text-text font-sans tracking-tight">
                  10K+
                </div>
                <div className="text-[10px] sm:text-xs font-semibold text-text-muted font-sans mt-0.5">
                  Exams
                </div>
              </div>

              <div className="bg-slate-50/90 dark:bg-slate-800/50 border border-slate-200/80 dark:border-slate-700/60 rounded-2xl p-2.5 sm:p-4 text-center transition-all duration-200 hover:border-primary/40 hover:shadow-xs">
                <div className="text-lg sm:text-2xl lg:text-3xl font-black text-text font-sans tracking-tight">
                  100K+
                </div>
                <div className="text-[10px] sm:text-xs font-semibold text-text-muted font-sans mt-0.5">
                  Students
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </SectionWrapper>
  );
}
