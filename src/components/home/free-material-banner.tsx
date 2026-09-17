"use client";

import Link from "next/link";
import { Headphones, CheckCircle2, ArrowRight, BookOpen, Sparkles } from "lucide-react";
import { SectionWrapper } from "@/components/global/section-wrapper";

export function FreeMaterialBanner() {
  return (
    <SectionWrapper className="!pt-1 !pb-4 sm:!pt-2 sm:!pb-6">
      <div className="relative overflow-hidden p-4 sm:p-6 rounded-2xl bg-gradient-to-r from-surface to-surface-secondary/90 border border-border/90 shadow-sm hover:shadow-md transition-all duration-300">
        {/* Ambient Glows */}
        <div className="absolute top-0 right-0 w-72 h-72 bg-primary/8 rounded-full blur-3xl pointer-events-none -z-10" />
        <div className="absolute bottom-0 left-0 w-60 h-60 bg-secondary/8 rounded-full blur-3xl pointer-events-none -z-10" />

        <div className="flex flex-col lg:flex-row items-center justify-between gap-4 sm:gap-6">
          {/* Left: Icon & Text */}
          <div className="flex flex-col sm:flex-row items-center sm:items-start text-center sm:text-left gap-3.5 sm:gap-4.5 max-w-2xl">
            <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-2xl bg-secondary/15 text-secondary border border-secondary/25 flex items-center justify-center shrink-0 shadow-xs">
              <Headphones className="w-6 h-6 sm:w-7 sm:h-7" />
            </div>

            <div>
              <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2 mb-1">
                <span className="inline-flex items-center gap-1 text-[10px] sm:text-[11px] font-bold text-secondary bg-secondary/10 px-2.5 py-0.5 rounded-full font-bengali">
                  <Sparkles className="w-3 h-3" />
                  ফ্রি রিসোর্স ও মেন্টরশিপ
                </span>
                <span className="hidden sm:inline-flex items-center gap-1 text-[10px] font-medium text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full font-bengali">
                  <CheckCircle2 className="w-3 h-3" />
                  ১০০% উন্মুক্ত
                </span>
              </div>

              <h3 className="text-base sm:text-lg lg:text-xl font-bold text-text font-bengali tracking-tight flex items-center justify-center sm:justify-start gap-1.5">
                <span>সার্বক্ষণিক ব্যক্তিগত মেন্টরশিপ ও ডাউট সলভিং সাপোর্ট</span>
              </h3>

              <p className="text-xs sm:text-sm text-text-muted font-bengali mt-1 leading-relaxed">
                পড়াশোনায় যেকোনো দ্বিধা, কনফিউশন বা মানসিক চাপে Ormission-এর মেন্টর প্যানেল টেলিগ্রাম ও গ্রুপে সার্বক্ষণিক আপনাকে ব্যক্তিগত গাইডলাইন দেবে। সেই সাথে থাকছে ফ্রি অধ্যায়ভিত্তিক নোট ও সাজেশন শিট।
              </p>
            </div>
          </div>

          {/* Right: CTA Button */}
          <div className="flex sm:flex-row items-center gap-2.5 shrink-0 w-full sm:w-auto justify-center">
            <Link
              href="/free-resources"
              className="inline-flex items-center justify-center gap-2 px-5 sm:px-6 py-3 rounded-xl bg-gradient-to-r from-primary to-orange-500 hover:from-primary-hover hover:to-orange-600 text-white text-xs sm:text-sm font-bold font-bengali shadow-md hover:shadow-lg active:scale-98 transition-all shrink-0 w-full sm:w-auto group cursor-pointer"
            >
              <BookOpen className="w-4 h-4" />
              <span>ফ্রি স্টাডি মেটেরিয়াল দেখুন</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
        </div>
      </div>
    </SectionWrapper>
  );
}
