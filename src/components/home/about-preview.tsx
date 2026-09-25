"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import Image from "next/image";
import { ChevronLeft, ChevronRight, Quote } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { SectionWrapper } from "@/components/global/section-wrapper";
import { createClient } from "@/lib/supabase/client";

export interface AboutInstructor {
  id: number | string;
  name: string;
  name_bn?: string;
  designation?: string;
  institution?: string;
  bio?: string | null;
  photo_url?: string | null;
  credentials?: string | null; // Used for custom headline / motto
  seo_title?: string | null;   // Used for custom badge / tag
  display_order?: number;
  is_featured?: boolean;
}

export interface AboutSettings {
  stat1_value?: string;
  stat1_label?: string;
  stat2_value?: string;
  stat2_label?: string;
  stat3_value?: string;
  stat3_label?: string;
  default_badge?: string;
  default_headline?: string;
  default_description?: string;
}

interface AboutPreviewProps {
  initialInstructors?: AboutInstructor[];
  initialAboutSettings?: AboutSettings | null;
}

const DEFAULT_SETTINGS: AboutSettings = {
  stat1_value: "10+",
  stat1_label: "Courses",
  stat2_value: "10K+",
  stat2_label: "Exams",
  stat3_value: "100K+",
  stat3_label: "Students",
  default_badge: "🎯 স্বপ্ন ছোঁয়ার প্রস্তুতি",
  default_headline: 'স্বপ্ন ছোঁয়ার আশা থাকলে সেই স্বপ্নের ভিত তৈরিতে সাথে আছে "ওরমিশন"',
  default_description:
    'অনলাইন বিশ্ববিদ্যালয় ভর্তি ও বোর্ড পরীক্ষার প্রস্তুতির জন্য দেশের সেরা প্ল্যাটফর্মগুলোর অন্যতম একটি হলো "ওরমিশন"। ভর্তি প্রস্তুতি নেওয়া শিক্ষার্থীদের সঠিক দিকনির্দেশনা, নিয়মিত পরীক্ষা, মানসম্মত ক্লাস এবং ধারাবাহিক প্রস্তুতির মাধ্যমে নিজেদের লক্ষ্যে পৌঁছাতে আমরা কাজ করে যাচ্ছি।',
};

const DEFAULT_FOUNDER: AboutInstructor = {
  id: 4,
  name: "Md. Ohid Rashed",
  name_bn: "মোঃ ওহিদ রাশেদ",
  designation: "মালিক ও পরিচালক",
  institution: "Ormission Education",
  bio: "চট্টগ্রাম বিশ্ববিদ্যালয় আইন বিভাগ। ওরমিশন এডুকেশনের সম্মানিত প্রতিষ্ঠাতা ও পরিচালক। ভর্তি প্রস্তুতি নেওয়া শিক্ষার্থীদের সঠিক দিকনির্দেশনা, নিয়মিত পরীক্ষা, মানসম্মত ক্লাস এবং ধারাবাহিক প্রস্তুতির মাধ্যমে নিজেদের লক্ষ্যে পৌঁছাতে আমরা কাজ করে যাচ্ছি।",
  photo_url: "https://oorovtqwyfrfjfwuufyi.supabase.co/storage/v1/object/public/hero_images/ohid-rashed-founder.jpg",
  credentials: 'স্বপ্ন ছোঁয়ার আশা থাকলে সেই স্বপ্নের ভিত তৈরিতে সাথে আছে "ওরমিশন"',
  seo_title: "🎯 স্বপ্ন ছোঁয়ার প্রস্তুতি",
};

export function AboutPreview({
  initialInstructors,
  initialAboutSettings,
}: AboutPreviewProps) {
  // Instructors list state
  const [instructorsList, setInstructorsList] = useState<AboutInstructor[]>(
    initialInstructors && initialInstructors.length > 0
      ? initialInstructors.filter((inst) => inst.is_featured !== false)
      : [DEFAULT_FOUNDER]
  );

  // Settings state (stats, default headlines, etc.)
  const [settings, setSettings] = useState<AboutSettings>(
    initialAboutSettings || DEFAULT_SETTINGS
  );

  const [activeIndex, setActiveIndex] = useState(0);
  const [direction, setDirection] = useState(1);
  const [touchStart, setTouchStart] = useState<number | null>(null);

  // Sync if initial props change
  useEffect(() => {
    if (initialInstructors && initialInstructors.length > 0) {
      setInstructorsList(initialInstructors.filter((inst) => inst.is_featured !== false));
    }
  }, [initialInstructors]);

  useEffect(() => {
    if (initialAboutSettings) {
      setSettings(initialAboutSettings);
    }
  }, [initialAboutSettings]);

  // Client-side realtime / refresh fallback
  useEffect(() => {
    const supabase = createClient();
    const fetchFresh = async () => {
      try {
        const [instRes, settRes] = await Promise.all([
          supabase
            .from("instructors")
            .select("id, name, name_bn, designation, institution, bio, photo_url, credentials, seo_title, display_order, is_featured")
            .eq("is_published", true)
            .order("display_order", { ascending: true })
            .order("id", { ascending: true }),
          supabase
            .from("site_settings")
            .select("value")
            .eq("key", "about_settings")
            .single(),
        ]);

        if (instRes.data && instRes.data.length > 0) {
          setInstructorsList(instRes.data.filter((i: AboutInstructor) => i.is_featured !== false));
        }
        if (settRes.data?.value && typeof settRes.data.value === "object") {
          setSettings(settRes.data.value);
        }
      } catch (err) {
        console.error("Error refreshing about data client-side:", err);
      }
    };

    fetchFresh();
  }, []);

  const activeList = instructorsList.length > 0 ? instructorsList : [DEFAULT_FOUNDER];
  const safeIndex = activeIndex >= activeList.length ? 0 : activeIndex;
  const currentInstructor = activeList[safeIndex] || DEFAULT_FOUNDER;

  const handleSelectInstructor = useCallback(
    (index: number) => {
      if (index === safeIndex) return;
      setDirection(index > safeIndex ? 1 : -1);
      setActiveIndex(index);
    },
    [safeIndex]
  );

  const handlePrev = useCallback(() => {
    if (activeList.length <= 1) return;
    setDirection(-1);
    setActiveIndex((prev) => (prev - 1 + activeList.length) % activeList.length);
  }, [activeList.length]);

  const handleNext = useCallback(() => {
    if (activeList.length <= 1) return;
    setDirection(1);
    setActiveIndex((prev) => (prev + 1) % activeList.length);
  }, [activeList.length]);

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

  // Dynamic texts for current active instructor
  const activeBadge =
    currentInstructor.seo_title ||
    settings.default_badge ||
    "🎯 স্বপ্ন ছোঁয়ার প্রস্তুতি";

  const activeHeadline =
    currentInstructor.credentials ||
    settings.default_headline ||
    'স্বপ্ন ছোঁয়ার আশা থাকলে সেই স্বপ্নের ভিত তৈরিতে সাথে আছে "ওরমিশন"';

  const activeBio =
    currentInstructor.bio ||
    settings.default_description ||
    'অনলাইন বিশ্ববিদ্যালয় ভর্তি ও বোর্ড পরীক্ষার প্রস্তুতির জন্য দেশের সেরা প্ল্যাটফর্মগুলোর অন্যতম একটি হলো "ওরমিশন"। ভর্তি প্রস্তুতি নেওয়া শিক্ষার্থীদের সঠিক দিকনির্দেশনা, নিয়মিত পরীক্ষা, মানসম্মত ক্লাস এবং ধারাবাহিক প্রস্তুতির মাধ্যমে নিজেদের লক্ষ্যে পৌঁছাতে আমরা কাজ করে যাচ্ছি।';

  // Stats values
  const stat1Val = settings.stat1_value || "10+";
  const stat1Lbl = settings.stat1_label || "Courses";
  const stat2Val = settings.stat2_value || "10K+";
  const stat2Lbl = settings.stat2_label || "Exams";
  const stat3Val = settings.stat3_value || "100K+";
  const stat3Lbl = settings.stat3_label || "Students";

  return (
    <SectionWrapper className="!pt-1 !pb-2 sm:!pt-2 sm:!pb-4">
      {/* Top Section Heading: আমাদের সম্পর্কে */}
      <div className="text-center mb-3 sm:mb-4">
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

        {/* Dynamic Animated Instructor Showcase Frame */}
        <div
          onTouchStart={handleTouchStart}
          onTouchEnd={handleTouchEnd}
          className="relative z-10"
        >
          <AnimatePresence mode="wait" custom={direction}>
            <motion.div
              key={currentInstructor.id}
              custom={direction}
              variants={{
                enter: (dir: number) => ({
                  x: dir > 0 ? 35 : -35,
                  opacity: 0,
                  scale: 0.98,
                }),
                center: {
                  zIndex: 1,
                  x: 0,
                  opacity: 1,
                  scale: 1,
                  transition: {
                    x: { type: "spring", stiffness: 280, damping: 28 },
                    opacity: { duration: 0.28 },
                    scale: { duration: 0.28 },
                  },
                },
                exit: (dir: number) => ({
                  zIndex: 0,
                  x: dir < 0 ? 35 : -35,
                  opacity: 0,
                  scale: 0.98,
                  transition: {
                    x: { type: "spring", stiffness: 280, damping: 28 },
                    opacity: { duration: 0.2 },
                    scale: { duration: 0.2 },
                  },
                }),
              }}
              initial="enter"
              animate="center"
              exit="exit"
              className="grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8 lg:gap-10 items-center"
            >
              {/* Left Column: Mentor / Teacher Showcase Card */}
              <div className="lg:col-span-5 flex flex-col items-center">
                <div className="w-full max-w-sm lg:max-w-none rounded-3xl bg-gradient-to-b from-orange-50/80 via-rose-50/40 to-slate-50/60 dark:from-slate-800/80 dark:to-slate-900/80 border border-orange-100/80 dark:border-slate-700/60 p-5 sm:p-7 flex flex-col items-center justify-center relative overflow-hidden shadow-xs select-none">
                  {/* Top Left Badge: 🔴 ওরমিশন / প্রতিষ্ঠান */}
                  <div className="absolute top-3.5 left-3.5 sm:top-4 sm:left-4 inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/95 dark:bg-slate-800/95 border border-slate-200/80 dark:border-slate-700 shadow-2xs text-[11px] font-bold text-slate-700 dark:text-slate-200 font-bengali z-10">
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
                  <div className="relative w-48 h-48 sm:w-56 sm:h-56 lg:w-60 lg:h-60 rounded-full bg-slate-900 flex items-center justify-center overflow-hidden shadow-md ring-4 ring-white/80 dark:ring-slate-700/60 mt-4 sm:mt-3">
                    <Image
                      src={photoSrc}
                      alt={currentInstructor.name_bn || currentInstructor.name}
                      fill
                      sizes="(max-width: 640px) 192px, (max-width: 1024px) 224px, 240px"
                      className="object-cover object-top"
                      loading="lazy"
                    />
                  </div>

                  {/* Floating Bottom Name & Designation Plate */}
                  <div className="relative z-10 -mt-6 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border border-slate-200/90 dark:border-slate-700 rounded-2xl px-5 sm:px-6 py-2.5 shadow-md text-center min-w-[200px] max-w-[92%] transition-all">
                    <h4 className="text-base sm:text-lg font-black text-text font-bengali tracking-tight">
                      {currentInstructor.name_bn || currentInstructor.name}
                    </h4>
                    {/* Unique Teacher Title / Designation */}
                    <div className="inline-block mt-0.5 px-2.5 py-0.5 rounded-full bg-primary/10 border border-primary/20 text-xs font-bold text-primary font-bengali">
                      {currentInstructor.designation || "শিক্ষক ও মেন্টর"}
                    </div>
                    {currentInstructor.institution && (
                      <p className="text-[10px] font-bold text-text-muted uppercase tracking-wider font-sans mt-1">
                        {currentInstructor.institution}
                      </p>
                    )}
                  </div>

                  {/* Carousel Indicators / Dots */}
                  {activeList.length > 1 && (
                    <div className="flex items-center justify-center gap-1.5 mt-3.5 z-10">
                      {activeList.map((inst, idx) => (
                        <button
                          key={inst.id}
                          type="button"
                          onClick={() => handleSelectInstructor(idx)}
                          className={`transition-all duration-300 rounded-full ${
                            idx === safeIndex
                              ? "w-6 h-1.5 bg-primary shadow-xs"
                              : "w-1.5 h-1.5 bg-slate-300 dark:bg-slate-600 hover:bg-primary/60"
                          }`}
                          aria-label={inst.name_bn || inst.name}
                        />
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* Right Column: Teacher Narrative, Custom Tag, Headline & Bio */}
              <div className="lg:col-span-7 flex flex-col items-start justify-center">
                {/* Top Tag Pill (Specific to active teacher or default) */}
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-50 dark:bg-rose-950/40 border border-rose-200/70 dark:border-rose-800/50 text-[11px] sm:text-xs font-bold text-rose-600 dark:text-rose-400 font-bengali mb-3 sm:mb-4 shadow-2xs">
                  <span>{activeBadge}</span>
                </div>

                {/* Big Headline / Motto */}
                <h3 className="text-xl sm:text-2xl lg:text-3xl xl:text-[32px] font-black text-text font-bengali leading-snug lg:leading-[1.35] mb-3 sm:mb-4">
                  {activeHeadline}
                </h3>

                {/* Detailed Bio / Narrative */}
                <div className="relative mb-5 sm:mb-7 w-full">
                  <div className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 font-medium font-bengali leading-relaxed whitespace-pre-line bg-slate-50/60 dark:bg-slate-800/40 border border-slate-200/60 dark:border-slate-700/50 rounded-2xl p-4 sm:p-5 relative">
                    <Quote className="w-5 h-5 text-primary/30 absolute top-3.5 right-3.5 pointer-events-none" />
                    {activeBio}
                  </div>
                </div>

                {/* 3 Stats Cards: Editable from Admin Settings */}
                <div className="grid grid-cols-3 gap-2.5 sm:gap-4 w-full">
                  <div className="bg-slate-50/90 dark:bg-slate-800/50 border border-slate-200/80 dark:border-slate-700/60 rounded-2xl p-2.5 sm:p-4 text-center transition-all duration-200 hover:border-primary/40 hover:shadow-xs">
                    <div className="text-lg sm:text-2xl lg:text-3xl font-black text-text font-sans tracking-tight">
                      {stat1Val}
                    </div>
                    <div className="text-[10px] sm:text-xs font-semibold text-text-muted font-sans mt-0.5">
                      {stat1Lbl}
                    </div>
                  </div>

                  <div className="bg-slate-50/90 dark:bg-slate-800/50 border border-slate-200/80 dark:border-slate-700/60 rounded-2xl p-2.5 sm:p-4 text-center transition-all duration-200 hover:border-primary/40 hover:shadow-xs">
                    <div className="text-lg sm:text-2xl lg:text-3xl font-black text-text font-sans tracking-tight">
                      {stat2Val}
                    </div>
                    <div className="text-[10px] sm:text-xs font-semibold text-text-muted font-sans mt-0.5">
                      {stat2Lbl}
                    </div>
                  </div>

                  <div className="bg-slate-50/90 dark:bg-slate-800/50 border border-slate-200/80 dark:border-slate-700/60 rounded-2xl p-2.5 sm:p-4 text-center transition-all duration-200 hover:border-primary/40 hover:shadow-xs">
                    <div className="text-lg sm:text-2xl lg:text-3xl font-black text-text font-sans tracking-tight">
                      {stat3Val}
                    </div>
                    <div className="text-[10px] sm:text-xs font-semibold text-text-muted font-sans mt-0.5">
                      {stat3Lbl}
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Quick Switcher Teacher Chips below showcase (If 2+ teachers exist) */}
        {activeList.length > 1 && (
          <div className="relative z-10 pt-4 mt-4 border-t border-border/60 flex items-center justify-center gap-2 sm:gap-3 flex-wrap">
            <span className="text-xs font-bold text-text-muted font-bengali mr-1">
              শিক্ষক নির্বাচন করুন:
            </span>
            {activeList.map((inst, idx) => (
              <button
                key={inst.id}
                type="button"
                onClick={() => handleSelectInstructor(idx)}
                className={`flex items-center gap-2 px-3 py-1.5 rounded-full border text-xs font-bengali transition-all ${
                  idx === safeIndex
                    ? "bg-primary/10 border-primary text-primary font-bold shadow-xs scale-105"
                    : "bg-surface border-border text-text-muted hover:border-primary/40 hover:text-text"
                }`}
              >
                <span className="w-5 h-5 rounded-full overflow-hidden bg-slate-200 dark:bg-slate-700 flex-shrink-0 flex items-center justify-center text-[10px] font-bold">
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
                <span className="font-semibold">{inst.name_bn || inst.name}</span>
                {inst.designation && (
                  <span className="text-[10px] text-text-muted font-normal hidden sm:inline">
                    ({inst.designation})
                  </span>
                )}
              </button>
            ))}
          </div>
        )}
      </div>
    </SectionWrapper>
  );
}
