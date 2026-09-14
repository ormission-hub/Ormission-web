"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowRight, CheckCircle2 } from "lucide-react";
import { SectionWrapper } from "@/components/global/section-wrapper";

export function AboutPreview() {
  return (
    <SectionWrapper className="py-12 lg:py-16">
      <div className="grid lg:grid-cols-12 gap-8 lg:gap-12 items-center">
        {/* Left Column: Authentic Student Study Image with Orange Accent Frame */}
        <div className="lg:col-span-6 relative">
          <div className="relative p-2 rounded-3xl bg-gradient-to-tr from-primary/30 via-primary/10 to-transparent border border-primary/30 shadow-soft-card">
            <div className="relative rounded-2xl overflow-hidden aspect-4/3 w-full bg-slate-900 shadow-md">
              <Image
                src="/images/about-students.jpg"
                alt="Ormission Students Studying Together"
                fill
                sizes="(max-width: 1024px) 100vw, 550px"
                className="object-cover object-center hover:scale-105 transition-transform duration-500"
              />
            </div>
          </div>
        </div>

        {/* Right Column: Narrative & Action Button (Matching Reference Mockup) */}
        <div className="lg:col-span-6 flex flex-col items-start">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-primary/10 text-primary text-xs font-bold font-bengali mb-4">
            <span>বিশ্বস্ত শিক্ষামূলক প্ল্যাটফর্ম</span>
          </div>

          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black text-text font-bengali tracking-tight mb-5 leading-tight">
            আমাদের সম্পর্কে
          </h2>

          <p className="text-sm sm:text-base text-text-muted font-bengali leading-relaxed mb-6">
            <span className="font-bold text-text">ORMISSION</span> বাংলাদেশের শিক্ষার্থীদের জন্য একটি আধুনিক অনলাইন শিক্ষা প্ল্যাটফর্ম। আমাদের লক্ষ্য SSC, HSC এবং বিশ্ববিদ্যালয় ভর্তি পরীক্ষার্থীদের মানসম্মত শিক্ষা সহজলভ্য করা। অভিজ্ঞ শিক্ষক, প্রিমিয়াম ভিডিও ক্লাস, PDF নোট, নিয়মিত পরীক্ষা ও নির্ভরযোগ্য গাইডলাইন-এর মাধ্যমে আমরা শিক্ষার্থীদের সফলতার পথে এগিয়ে নিতে কাজ করছি।
          </p>

          <div className="grid grid-cols-2 gap-3 mb-8 w-full max-w-md">
            <div className="flex items-center gap-2 text-xs sm:text-sm font-semibold text-text font-bengali">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>মানসম্মত লাইভ ও রেকর্ডেড ক্লাস</span>
            </div>
            <div className="flex items-center gap-2 text-xs sm:text-sm font-semibold text-text font-bengali">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>সার্বক্ষণিক ডাউট সলভিং সাপোর্ট</span>
            </div>
            <div className="flex items-center gap-2 text-xs sm:text-sm font-semibold text-text font-bengali">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>বিগত ২০ বছরের প্রশ্নব্যাংক সলভিং</span>
            </div>
            <div className="flex items-center gap-2 text-xs sm:text-sm font-semibold text-text font-bengali">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>১০০% কার্যকর পরীক্ষার সাজেশন</span>
            </div>
          </div>

          {/* Orange Action Button: আরও জানুন → */}
          <Link
            href="/about"
            className="inline-flex items-center gap-2 px-7 py-3.5 rounded-full text-sm font-bold text-white bg-primary hover:bg-primary-hover shadow-md hover:shadow-lg hover:-translate-y-0.5 active:translate-y-0 transition-all duration-200 font-bengali cursor-pointer"
          >
            <span>আরও জানুন</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </SectionWrapper>
  );
}
