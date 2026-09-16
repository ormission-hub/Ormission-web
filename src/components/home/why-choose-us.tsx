"use client";

import { useRef, useState } from "react";
import {
  GraduationCap,
  BookOpenCheck,
  BrainCircuit,
  Home,
  FileCheck2,
  Sparkles,
  Headphones,
  CheckCircle2,
  ArrowRight,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import Link from "next/link";
import { motion } from "framer-motion";
import { SectionWrapper } from "@/components/global/section-wrapper";
import { SectionHeading } from "@/components/global/section-heading";
import { cn } from "@/lib/utils";

const features = [
  {
    icon: GraduationCap,
    tag: "ভর্তি পরীক্ষার মাস্টারপ্ল্যান",
    title: "বিশ্ববিদ্যালয় ও মেডিকেল ভর্তি স্পেশাল গাইডলাইন (CU, DU, GST & Medical)",
    description:
      "চট্টগ্রাম বিশ্ববিদ্যালয় (CU 'B', 'D' ও আইন বিভাগ), ঢাকা বিশ্ববিদ্যালয়, মেডিকেল ও গুচ্ছ ভর্তি পরীক্ষায় টপ করার A to Z মাস্টার প্ল্যান ও অভিজ্ঞ মেন্টরদের সঠিক দিকনির্দেশনা।",
    color: "text-primary",
    badgeBg: "bg-primary/10 border-primary/20",
    tagBg: "bg-primary/8 text-primary border-primary/20",
  },
  {
    icon: BookOpenCheck,
    tag: "প্রশ্নব্যাংক সলভিং স্ট্র্যাটেজি",
    title: "বিগত ২০ বছরের প্রশ্নব্যাংক অ্যানালাইসিস ও শর্টকাট টেকনিক",
    description:
      "মুখস্থ ছাড়া প্রশ্নব্যাংক কীভাবে দ্রুত সমাধান করবেন—এডমিশন ও বোর্ড পরীক্ষায় রিপিটেড প্রশ্ন দ্রুত চিহ্নিতকরণ, কনসেপ্টভিত্তিক ব্যাখ্যা ও সময় বাঁচানোর নির্ভুল শর্টকাট হ্যাক্স।",
    color: "text-secondary",
    badgeBg: "bg-secondary/10 border-secondary/20",
    tagBg: "bg-secondary/8 text-secondary border-secondary/20",
  },
  {
    icon: Home,
    tag: "১৪ ঘণ্টার সেলফ-স্টাডি রুটিন",
    title: "কোচিং ছাড়া ঘরে বসেই পূর্ণাঙ্গ প্রস্তুতি (১৪ ঘণ্টার সেরা স্টাডি রুটিন)",
    description:
      "ঢাকায় গিয়ে লাখ টাকা খরচ না করে ঘরে বসেই পূর্ণাঙ্গ সিলেবাস শেষ করার বৈজ্ঞানিক ১৪ ঘণ্টার স্টাডি প্ল্যান, পড়ার সময় ঘুম দূর করার কৌশল ও বাস্তবমুখী সময় ব্যবস্থাপনা।",
    color: "text-accent",
    badgeBg: "bg-accent/10 border-accent/20",
    tagBg: "bg-accent/8 text-accent border-accent/20",
  },
  {
    icon: Sparkles,
    tag: "এডমিশন ইংলিশ স্পেশাল",
    title: "University Admission English — যে ১০টি টপিকে ১৫ মার্ক নিশ্চিত",
    description:
      "ইংরেজি গ্রামারের ৭টি মারাত্মক ভুল এড়িয়ে এডমিশনে নিশ্চিত ১৫ মার্ক তোলার স্পেশাল রুলস, প্রশ্নব্যাংক ভোকাবুলারি হ্যাক্স ও রিটেনে সর্বোচ্চ নম্বর তোলার সহজ স্ট্র্যাটেজি।",
    color: "text-indigo-500 dark:text-indigo-400",
    badgeBg: "bg-indigo-500/10 border-indigo-500/20",
    tagBg: "bg-indigo-500/8 text-indigo-500 dark:text-indigo-400 border-indigo-500/20",
  },
  {
    icon: BrainCircuit,
    tag: "পড়া মনে রাখার টেকনিক",
    title: "পড়া মনে রাখার বৈজ্ঞানিক কৌশল ও কম জিপিএ নিয়ে চান্স পাওয়ার উপায়",
    description:
      "পড়া সহজে ভুলে না যাওয়ার মেমোরি রিটেনশন টেকনিক, পরীক্ষার ভীতি দূর করার উপায় এবং জিপিএ তুলনামূলক কম থাকলেও স্বপ্ন পূরণে সঠিক বিকল্প বিশ্ববিদ্যালয়ের বাস্তবমুখী রোডম্যাপ।",
    color: "text-emerald-500 dark:text-emerald-400",
    badgeBg: "bg-emerald-500/10 border-emerald-500/20",
    tagBg: "bg-emerald-500/8 text-emerald-500 dark:text-emerald-400 border-emerald-500/20",
  },
  {
    icon: FileCheck2,
    tag: "এইচএসসি Top 300+ MCQ",
    title: "এইচএসসি মানবিক, বিজ্ঞান ও বাণিজ্য Top 300+ MCQ ও কমন সাজেশন",
    description:
      "এইচএসসি সমাজবিজ্ঞান, সমাজকর্ম, ফিন্যান্স, বিজ্ঞান ও আইসিটির অধ্যায়ভিত্তিক Top 300+ MCQ সলভিং এবং বোর্ড পরীক্ষায় নিশ্চিত ফলাফলের জন্য শতভাগ কমন উপযোগী এক্সক্লুসিভ সাজেশন শিট।",
    color: "text-rose-500 dark:text-rose-400",
    badgeBg: "bg-rose-500/10 border-rose-500/20",
    tagBg: "bg-rose-500/8 text-rose-500 dark:text-rose-400 border-rose-500/20",
  },
];

function FeatureCard({
  feature,
  isMobile = false,
}: {
  feature: (typeof features)[0];
  isMobile?: boolean;
}) {
  const Icon = feature.icon;
  return (
    <div
      className={cn(
        "group relative flex flex-col p-5 sm:p-6 rounded-2xl border border-border bg-surface transition-all duration-300 h-full",
        "hover:border-primary/30 hover:shadow-lg hover:-translate-y-1",
        isMobile && "shadow-soft-card border-border/90"
      )}
    >
      {/* Header row: Icon & Tag */}
      <div className="flex items-center justify-between mb-3.5 sm:mb-4">
        <div
          className={cn(
            "w-11 h-11 sm:w-12 sm:h-12 rounded-2xl border flex items-center justify-center transition-all duration-300 shadow-xs",
            "group-hover:scale-110",
            feature.badgeBg
          )}
        >
          <Icon className={cn("w-5 h-5 sm:w-6 sm:h-6 transition-transform duration-300", feature.color)} />
        </div>
        <span className={cn("text-[10.5px] sm:text-[11px] font-bold px-2.5 py-1 rounded-full border font-bengali", feature.tagBg)}>
          {feature.tag}
        </span>
      </div>

      <h3 className="text-base sm:text-lg font-bold text-text mb-2 font-bengali group-hover:text-primary transition-colors leading-snug">
        {feature.title}
      </h3>
      <p className="text-xs sm:text-sm text-text-muted leading-relaxed font-bengali">
        {feature.description}
      </p>
    </div>
  );
}

export function WhyChooseUs() {
  const sliderRef = useRef<HTMLDivElement>(null);
  const [activeIndex, setActiveIndex] = useState(0);

  const whyScrollRaf = useRef<number | null>(null);

  const handleScroll = () => {
    if (whyScrollRaf.current) return;
    whyScrollRaf.current = requestAnimationFrame(() => {
      whyScrollRaf.current = null;
      if (!sliderRef.current) return;
      const { scrollLeft, offsetWidth } = sliderRef.current;
      const cardStep = offsetWidth * 0.82;
      if (cardStep <= 0) return;
      const index = Math.round(scrollLeft / cardStep);
      const targetIdx = Math.min(Math.max(index, 0), features.length - 1);
      setActiveIndex((prev) => (prev !== targetIdx ? targetIdx : prev));
    });
  };

  const scrollToIndex = (index: number) => {
    if (!sliderRef.current) return;
    const targetIdx = Math.min(Math.max(index, 0), features.length - 1);
    const cardStep = sliderRef.current.offsetWidth * 0.82;
    sliderRef.current.scrollTo({
      left: targetIdx * cardStep,
      behavior: "smooth",
    });
    setActiveIndex(targetIdx);
  };

  return (
    <SectionWrapper>
      {/* Top Pill Badge */}
      <div className="flex justify-center mb-3">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-bold font-bengali">
          <Sparkles className="w-3.5 h-3.5" />
          <span>আমাদের বিশেষত্ব ও মূল শক্তি (Core USPs)</span>
        </div>
      </div>

      <SectionHeading
        title="কেন Ormission বেছে নেবেন?"
        subtitle="কোচিং ছাড়া ঘরে বসেই কনসেপ্ট ক্লিয়ারিং, বিগত ২০ বছরের প্রশ্নব্যাংক অ্যানালাইসিস ও সঠিক স্টাডি স্ট্র্যাটেজিতে বোর্ড ও ভর্তি পরীক্ষার সেরা প্রস্তুতি"
      />

      {/* Mobile Slideshow View: Cards slide horizontally from the side with touch snap */}
      <div className="block sm:hidden relative mt-2">
        <div
          ref={sliderRef}
          onScroll={handleScroll}
          className="flex overflow-x-auto snap-x snap-mandatory gap-3.5 pb-4 -mx-4 px-4 scrollbar-none scroll-smooth select-none"
        >
          {features.map((feature) => (
            <div
              key={feature.title}
              className="w-[84vw] max-w-[320px] shrink-0 snap-center"
            >
              <FeatureCard feature={feature} isMobile />
            </div>
          ))}
        </div>

        {/* Mobile Navigation Controls: Dot Indicators & Prev/Next Arrows */}
        <div className="flex items-center justify-between pt-1 px-1">
          {/* Dot Indicators */}
          <div className="flex items-center gap-1.5">
            {features.map((_, i) => (
              <button
                key={i}
                type="button"
                onClick={() => scrollToIndex(i)}
                aria-label={`Go to slide ${i + 1}`}
                className={`h-1.5 rounded-full transition-all duration-300 cursor-pointer ${
                  activeIndex === i ? "w-6 bg-primary" : "w-1.5 bg-border/80"
                }`}
              />
            ))}
          </div>

          {/* Prev / Next Chevrons */}
          <div className="flex items-center gap-1.5">
            <button
              type="button"
              onClick={() => scrollToIndex(activeIndex - 1)}
              disabled={activeIndex === 0}
              className="w-7 h-7 rounded-full border border-border bg-surface flex items-center justify-center text-text disabled:opacity-30 transition-opacity cursor-pointer shadow-2xs"
              aria-label="Previous card"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={() => scrollToIndex(activeIndex + 1)}
              disabled={activeIndex === features.length - 1}
              className="w-7 h-7 rounded-full border border-border bg-surface flex items-center justify-center text-text disabled:opacity-30 transition-opacity cursor-pointer shadow-2xs"
              aria-label="Next card"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Desktop / Tablet Grid View (Visible on sm: and up) */}
      <div className="hidden sm:grid sm:grid-cols-2 lg:grid-cols-3 gap-5 lg:gap-6 mt-2">
        {features.map((feature, idx) => (
          <motion.div
            key={feature.title}
            initial={{ opacity: 0, y: 25 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.15 }}
            transition={{ duration: 0.45, delay: idx * 0.08 }}
            className="h-full"
          >
            <FeatureCard feature={feature} />
          </motion.div>
        ))}
      </div>

      {/* 24/7 Personal Mentorship Trust Banner */}
      <div className="mt-8 lg:mt-10 p-5 sm:p-6 rounded-2xl bg-surface-secondary/70 border border-border flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-4 text-center sm:text-left">
          <div className="w-12 h-12 rounded-2xl bg-secondary/15 text-secondary border border-secondary/25 flex items-center justify-center shrink-0">
            <Headphones className="w-6 h-6" />
          </div>
          <div>
            <h4 className="text-sm sm:text-base font-bold text-text font-bengali flex items-center justify-center sm:justify-start gap-1.5">
              <span>সার্বক্ষণিক ব্যক্তিগত মেন্টরশিপ ও ডাউট সলভিং সাপোর্ট</span>
              <CheckCircle2 className="w-4 h-4 text-secondary inline" />
            </h4>
            <p className="text-xs sm:text-sm text-text-muted font-bengali mt-0.5">
              পড়াশোনায় যেকোনো দ্বিধা, কনফিউশন বা মানসিক চাপে Ormission-এর মেন্টর প্যানেল টেলিগ্রাম ও গ্রুপে সার্বক্ষণিক আপনাকে ব্যক্তিগত গাইডলাইন দেবে।
            </p>
          </div>
        </div>

        <Link
          href="/free-resources"
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-primary text-white text-xs sm:text-sm font-bold font-bengali hover:bg-primary-hover shadow-sm hover:shadow transition-all shrink-0"
        >
          <span>ফ্রি স্টাডি মেটেরিয়াল দেখুন</span>
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    </SectionWrapper>
  );
}
