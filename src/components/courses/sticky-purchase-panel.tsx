"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Play, Check, ShieldCheck, Smartphone, Clock, Award, FileDown, ArrowRight } from "lucide-react";
import { type Course } from "@/lib/data/courses";

interface StickyPurchasePanelProps {
  course: Course;
}

export function StickyPurchasePanel({ course }: StickyPurchasePanelProps) {
  const [showVideoModal, setShowVideoModal] = useState(false);

  const discountAmount = course.originalPrice - course.price;
  const discountPercent = course.originalPrice > 0 ? Math.round((discountAmount / course.originalPrice) * 100) : 0;
  const thumbnail = (course as any).thumbnail_url || course.thumbnail || "https://images.unsplash.com/photo-1636466497217-26a8cbeaf0aa?q=80&w=800&auto=format&fit=crop";

  return (
    <>
      {/* Desktop Sticky Card */}
      <div className="hidden lg:block sticky top-24 bg-surface rounded-lg border border-border overflow-hidden shadow-sm">
        {/* Preview Video Thumbnail */}
        <div className="relative aspect-video w-full overflow-hidden bg-slate-900 group cursor-pointer" onClick={() => setShowVideoModal(true)}>
          <Image
            src={thumbnail}
            alt={course.titleBn || course.title}
            fill
            className="object-cover group-hover:opacity-85 transition-opacity"
          />
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-14 h-14 rounded-full bg-primary/90 text-white flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
              <Play className="w-6 h-6 fill-white ml-0.5" />
            </div>
          </div>
          <div className="absolute bottom-3 inset-x-0 text-center">
            <span className="px-3 py-1 rounded-full bg-black/75 text-white text-xs font-semibold backdrop-blur-xs font-bengali">
              কোর্স প্রিভিউ ভিডিও দেখুন
            </span>
          </div>
        </div>

        {/* Pricing & CTA */}
        <div className="p-6">
          <div className="flex items-baseline gap-3 mb-2">
            <span className="text-3xl font-extrabold text-text font-sans">
              ৳{course.price.toLocaleString("en-US")}
            </span>
            {course.originalPrice > course.price && (
              <>
                <span className="text-base text-text-muted line-through font-sans">
                  ৳{course.originalPrice.toLocaleString("en-US")}
                </span>
                <span className="px-2 py-0.5 rounded text-xs font-bold bg-accent/15 text-accent font-sans">
                  {discountPercent}% ছাড়
                </span>
              </>
            )}
          </div>
          <p className="text-xs text-secondary font-semibold font-bengali mb-5">
            সীমিত সময়ের জন্য বিশেষ অফার মূল্য
          </p>

          <Link
            href={`/checkout/${course.slug}`}
            className="btn btn-primary w-full py-3.5 text-base font-bold font-bengali flex items-center justify-center gap-2 mb-3 shadow-sm hover:shadow-md transition-all"
          >
            <span>এখনই কোর্সে ভর্তি হন</span>
            <ArrowRight className="w-4 h-4" />
          </Link>

          <button
            type="button"
            onClick={() => setShowVideoModal(true)}
            className="btn btn-outline w-full py-2.5 text-xs font-semibold font-bengali mb-6"
          >
            ফ্রি ক্লাস ও প্রিভিউ দেখুন
          </button>

          {/* Features list */}
          <div className="border-t border-border pt-5 space-y-3 text-xs text-text">
            <h4 className="font-bold text-text font-bengali text-xs uppercase tracking-wider mb-2">
              এই কোর্সের মধ্যে অন্তর্ভুক্ত:
            </h4>
            <div className="flex items-center gap-2.5">
              <Clock className="w-4 h-4 text-primary shrink-0" />
              <span>{course.durationHours} ঘণ্টার রেকর্ডেড ক্লাস</span>
            </div>
            <div className="flex items-center gap-2.5">
              <FileDown className="w-4 h-4 text-primary shrink-0" />
              <span>লেকচার স্লাইড ও প্র্যাকটিস শিট PDF</span>
            </div>
            <div className="flex items-center gap-2.5">
              <Smartphone className="w-4 h-4 text-primary shrink-0" />
              <span>মোবাইল ও পিসিতে আনলিমিটেড অ্যাক্সেস</span>
            </div>
            <div className="flex items-center gap-2.5">
              <Award className="w-4 h-4 text-primary shrink-0" />
              <span>কোর্স সমাপনী সার্টিফিকেট</span>
            </div>
            <div className="flex items-center gap-2.5">
              <ShieldCheck className="w-4 h-4 text-secondary shrink-0" />
              <span>১ বছরের ফুল ভ্যালিডিটি ও সাপোর্ট</span>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Sticky Bottom Bar */}
      <div className="lg:hidden fixed bottom-0 inset-x-0 z-40 bg-surface border-t border-border p-3 shadow-lg flex items-center justify-between gap-4">
        <div>
          <div className="flex items-baseline gap-2">
            <span className="text-xl font-bold text-text font-sans">
              ৳{course.price.toLocaleString("en-US")}
            </span>
            {course.originalPrice > course.price && (
              <span className="text-xs text-text-muted line-through font-sans">
                ৳{course.originalPrice.toLocaleString("en-US")}
              </span>
            )}
          </div>
          <span className="text-[11px] text-secondary font-bengali font-semibold">
            {discountPercent}% ছাড় চলছে
          </span>
        </div>
        <Link
          href={`/checkout/${course.slug}`}
          className="btn btn-primary btn-sm px-6 font-bold font-bengali flex items-center gap-1.5 shrink-0"
        >
          <span>ভর্তি হন</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>

      {/* Video Modal */}
      {showVideoModal && (
        <div
          className="fixed inset-0 z-50 bg-black/80 backdrop-blur-xs flex items-center justify-center p-4"
          onClick={() => setShowVideoModal(false)}
        >
          <div
            className="bg-surface rounded-lg overflow-hidden max-w-2xl w-full border border-border shadow-2xl relative"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="aspect-video w-full">
              <iframe
                src="https://www.youtube-nocookie.com/embed/dQw4w9WgXcQ?autoplay=1"
                title="Course Preview"
                className="w-full h-full border-0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            </div>
            <div className="p-4 flex items-center justify-between bg-surface">
              <h4 className="font-bold text-sm text-text font-bengali">
                {course.titleBn} (ফ্রি প্রিভিউ)
              </h4>
              <button
                type="button"
                onClick={() => setShowVideoModal(false)}
                className="btn btn-sm btn-outline text-xs"
              >
                বন্ধ করুন
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
