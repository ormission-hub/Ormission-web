"use client";

import Image from "next/image";
import { SectionWrapper } from "@/components/global/section-wrapper";

export function AboutPreview() {
  return (
    <SectionWrapper className="py-10 sm:py-14 lg:py-16">
      {/* Top Section Heading: আমাদের সম্পর্কে */}
      <div className="text-center mb-6 sm:mb-8">
        <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black font-bengali tracking-tight">
          <span className="bg-gradient-to-r from-orange-500 via-rose-500 to-amber-500 bg-clip-text text-transparent">
            আমাদের
          </span>{" "}
          <span className="text-text">সম্পর্কে</span>
        </h2>
      </div>

      {/* Main Outer Card Container matching 2nd image */}
      <div className="relative rounded-3xl bg-surface border border-border/80 shadow-sm p-4 sm:p-6 lg:p-9 overflow-hidden">
        {/* Soft background ambient gradient blobs matching reference */}
        <div className="absolute top-0 left-0 w-72 h-72 bg-gradient-to-br from-orange-200/30 via-rose-100/20 to-transparent dark:from-orange-950/20 rounded-full blur-2xl pointer-events-none" />
        <div className="absolute bottom-0 right-0 w-80 h-80 bg-gradient-to-tl from-indigo-200/30 via-purple-100/20 to-transparent dark:from-indigo-950/20 rounded-full blur-2xl pointer-events-none" />

        <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8 lg:gap-10 items-center">
          {/* Left Column: Mentor / Founder Showcase Card */}
          <div className="lg:col-span-5 flex flex-col items-center">
            <div className="w-full max-w-sm lg:max-w-none rounded-3xl bg-gradient-to-b from-orange-50/80 via-rose-50/40 to-slate-50/60 dark:from-slate-800/80 dark:to-slate-900/80 border border-orange-100/80 dark:border-slate-700/60 p-5 sm:p-7 flex flex-col items-center justify-center relative overflow-hidden shadow-xs">
              {/* Top Left Badge: 🔴 ওরমিশন */}
              <div className="absolute top-3.5 left-3.5 sm:top-4 sm:left-4 inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/95 dark:bg-slate-800/95 border border-slate-200/80 dark:border-slate-700 shadow-2xs text-[11px] font-bold text-slate-700 dark:text-slate-200 font-bengali">
                <span className="w-2 h-2 rounded-full bg-rose-500 animate-pulse" />
                <span>ওরমিশন এডুকেশন</span>
              </div>

              {/* Central Circular Avatar Container with Real Portrait */}
              <div className="relative w-48 h-48 sm:w-56 sm:h-56 lg:w-60 lg:h-60 rounded-full bg-slate-900 flex items-center justify-center overflow-hidden shadow-md ring-4 ring-white/80 dark:ring-slate-700/60 mt-4 sm:mt-3">
                <Image
                  src="/images/ohid-rashed.jpg"
                  alt="মোঃ ওহিদ রাশেদ"
                  fill
                  sizes="(max-width: 640px) 200px, (max-width: 1024px) 240px, 260px"
                  className="object-cover object-top"
                  priority
                />
              </div>

              {/* Floating Bottom Name Plate */}
              <div className="relative z-10 -mt-6 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border border-slate-200/90 dark:border-slate-700 rounded-2xl px-5 sm:px-6 py-2 sm:py-2.5 shadow-md text-center min-w-[190px] max-w-[90%]">
                <h4 className="text-sm sm:text-base font-black text-text font-bengali tracking-tight">
                  মোঃ ওহিদ রাশেদ
                </h4>
                <p className="text-[11px] font-medium text-text-muted font-bengali mt-0.5">
                  মালিক ও পরিচালক
                </p>
                <p className="text-[10px] font-bold text-primary tracking-wider font-sans uppercase mt-0.5">
                  Ormission Education
                </p>
              </div>
            </div>
          </div>

          {/* Right Column: Narrative, Headline & 3 Stats Cards */}
          <div className="lg:col-span-7 flex flex-col items-start">
            {/* Top Tag Pill: 🎯 স্বপ্ন ছোঁয়ার প্রস্তুতি */}
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-50 dark:bg-rose-950/40 border border-rose-200/70 dark:border-rose-800/50 text-[11px] sm:text-xs font-bold text-rose-600 dark:text-rose-400 font-bengali mb-3 sm:mb-4">
              <span>🎯</span>
              <span>স্বপ্ন ছোঁয়ার প্রস্তুতি</span>
            </div>

            {/* Big Headline matching reference */}
            <h3 className="text-xl sm:text-2xl lg:text-3xl xl:text-[32px] font-black text-text font-bengali leading-snug lg:leading-[1.35] mb-3 sm:mb-4">
              স্বপ্ন ছোঁয়ার আশা থাকলে সেই স্বপ্নের ভিত তৈরিতে সাথে আছে{" "}
              <span className="text-primary font-black">
                &ldquo;ওরমিশন&rdquo;
              </span>
            </h3>

            {/* Paragraph matching reference text */}
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
