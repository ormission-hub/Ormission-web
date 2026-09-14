"use client";

import { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { CheckCircle2, Play, BookOpen, ArrowRight, Download, ShieldCheck } from "lucide-react";
import { getCourseBySlug, COURSES } from "@/lib/data/courses";

function SuccessContent() {
  const searchParams = useSearchParams();
  const orderId = searchParams.get("orderId") || "ORM-849201";
  const txId = searchParams.get("txId") || "TXN94827104";
  const courseSlug = searchParams.get("course") || "buet-engineering-physics-mastery";
  const amount = searchParams.get("amount") || "3850";
  const method = searchParams.get("method") || "bkash";

  const course = getCourseBySlug(courseSlug) || COURSES[0];
  const firstLessonId = course.curriculum[0]?.lessons[0]?.id || "l-1-1";

  return (
    <div className="bg-background min-h-screen py-12 lg:py-20 flex items-center justify-center">
      <div className="container-main max-w-lg w-full">
        <div className="bg-surface rounded-xl border border-border p-6 sm:p-8 shadow-sm text-center">
          {/* Success Icon */}
          <div className="w-16 h-16 rounded-full bg-success/15 text-success flex items-center justify-center mx-auto mb-4 animate-bounce">
            <CheckCircle2 className="w-10 h-10" />
          </div>

          <h1 className="text-2xl font-bold text-text font-bengali tracking-tight mb-2">
            অভিনন্দন! আপনার ভর্তি সম্পন্ন হয়েছে
          </h1>
          <p className="text-xs lg:text-sm text-text-muted font-bengali mb-6">
            আপনার পেমেন্ট সফলভাবে গৃহীত হয়েছে এবং কোর্সটি আপনার অ্যাকাউন্টে তাৎক্ষণিকভাবে চালু করা হয়েছে।
          </p>

          {/* Receipt Card */}
          <div className="bg-surface-secondary/60 rounded-lg border border-border p-4 text-left text-xs mb-6 space-y-2.5">
            <div className="flex items-center justify-between pb-2 border-b border-border/80">
              <span className="text-text-muted font-bengali">অর্ডার নম্বর</span>
              <span className="font-bold text-text font-sans">{orderId}</span>
            </div>
            <div className="flex items-center justify-between pb-2 border-b border-border/80">
              <span className="text-text-muted font-bengali">ট্রানজ্যাকশন আইডি</span>
              <span className="font-bold text-text font-sans">{txId}</span>
            </div>
            <div className="flex items-center justify-between pb-2 border-b border-border/80">
              <span className="text-text-muted font-bengali">কোর্সের নাম</span>
              <span className="font-bold text-text font-bengali max-w-[200px] truncate">
                {course.titleBn}
              </span>
            </div>
            <div className="flex items-center justify-between pb-2 border-b border-border/80">
              <span className="text-text-muted font-bengali">পেমেন্ট মাধ্যম</span>
              <span className="font-bold text-text uppercase font-sans">{method}</span>
            </div>
            <div className="flex items-center justify-between font-bold text-sm text-text pt-1">
              <span className="font-bengali">পরিশোধিত অর্থ</span>
              <span className="text-primary font-sans">৳{Number(amount).toLocaleString("en-US")}</span>
            </div>
          </div>

          {/* Action CTAs */}
          <div className="space-y-3">
            <Link
              href={`/course/${course.slug}/learn/${firstLessonId}`}
              className="btn btn-primary font-bengali font-bold w-full py-3.5 flex items-center justify-center gap-2 shadow-sm"
            >
              <Play className="w-4 h-4 fill-white" />
              <span>প্রথম ক্লাসটি এখনই শুরু করুন</span>
            </Link>

            <Link
              href="/dashboard"
              className="btn btn-outline font-bengali font-semibold w-full py-2.5 flex items-center justify-center gap-2"
            >
              <BookOpen className="w-4 h-4" />
              <span>শিক্ষার্থী ড্যাশবোর্ডে যান</span>
            </Link>
          </div>

          <div className="mt-6 pt-4 border-t border-border flex items-center justify-center gap-1.5 text-[11px] text-text-muted font-bengali">
            <ShieldCheck className="w-3.5 h-3.5 text-secondary" />
            <span>অর্ডারের নিশ্চিতকরণ এসএমএস আপনার মোবাইলে পাঠানো হয়েছে</span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function CheckoutSuccessPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center">
          <p className="text-sm font-bengali text-text-muted">লোড হচ্ছে...</p>
        </div>
      }
    >
      <SuccessContent />
    </Suspense>
  );
}
