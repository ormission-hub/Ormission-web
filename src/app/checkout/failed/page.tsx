"use client";

import { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { AlertCircle, RefreshCw, Phone, ArrowLeft, ShieldAlert } from "lucide-react";

function FailedContent() {
  const searchParams = useSearchParams();
  const courseSlug = searchParams.get("course") || "buet-engineering-physics-mastery";

  return (
    <div className="relative min-h-screen bg-background py-12 lg:py-20 flex items-center justify-center overflow-hidden px-4">
      {/* Background Ambient Glow */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-96 h-96 bg-error/10 rounded-full blur-3xl pointer-events-none -z-10" />

      <div className="container-main max-w-md w-full">
        <div className="relative bg-surface/90 backdrop-blur-xl rounded-2xl border border-border/90 p-6 sm:p-8 shadow-xl text-center">
          {/* Alert Icon */}
          <div className="w-18 h-18 rounded-full bg-error/15 text-error flex items-center justify-center mx-auto mb-4 shadow-xs">
            <AlertCircle className="w-10 h-10 stroke-[2.2]" />
          </div>

          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-error/10 text-error text-xs font-bold font-bengali mb-3">
            <span>পেমেন্ট সফল হতে পারেনি</span>
          </div>

          <h1 className="text-2xl sm:text-3xl font-extrabold text-text font-bengali tracking-normal mb-2">
            লেনদেন সম্পন্ন হয়নি
          </h1>
          <p className="text-xs sm:text-sm text-text-muted font-bengali mb-6 leading-relaxed">
            লেনদেন প্রক্রিয়া চলাকালে কোনো সমস্যার কারণে পেমেন্ট সম্পন্ন করা যায়নি। আপনার অ্যাকাউন্ট বা ওয়ালেট থেকে কোনো টাকা কাটা হয়নি।
          </p>

          {/* Common Reasons Box */}
          <div className="bg-surface-secondary/60 rounded-xl border border-border/80 p-4 text-left text-xs mb-6 space-y-2 font-bengali text-text-muted">
            <h4 className="font-bold text-text text-xs mb-1.5 flex items-center gap-1.5">
              <ShieldAlert className="w-4 h-4 text-warning" />
              <span>সম্ভাব্য সাধারণ কারণসমূহ:</span>
            </h4>
            <p>• ওটিপি (OTP) বা পিন নম্বর দিতে দেরি হওয়া বা ভুল ইনপুট দেওয়া।</p>
            <p>• বিকাশ/নগদ/রকেট একাউন্ট বা ব্যাংকে পর্যাপ্ত ব্যালেন্স না থাকা।</p>
            <p>• ইন্টারনেট সংযোগ বিঘ্নিত হওয়া অথবা আপনার পক্ষ থেকে পেমেন্ট বাতিল করা।</p>
          </div>

          {/* Actions */}
          <div className="space-y-3">
            <Link
              href={`/checkout/${courseSlug}`}
              className="w-full py-3.5 px-5 rounded-xl font-bengali font-bold text-sm text-white bg-gradient-to-r from-primary to-orange-500 hover:from-primary-hover hover:to-orange-600 flex items-center justify-center gap-2 shadow-md hover:shadow-lg transition-all"
            >
              <RefreshCw className="w-4 h-4" />
              <span>পুনরায় চেষ্টা করুন</span>
            </Link>

            <a
              href="tel:+8801700000000"
              className="w-full py-2.5 px-5 rounded-xl font-bengali font-semibold text-xs sm:text-sm text-text bg-surface border border-border hover:bg-surface-secondary flex items-center justify-center gap-2 transition-colors"
            >
              <Phone className="w-4 h-4 text-text-muted" />
              <span>সরাসরি হেল্পলাইনে যোগাযোগ করুন</span>
            </a>
          </div>

          <div className="mt-6 pt-4 border-t border-border/80">
            <Link
              href="/courses"
              className="inline-flex items-center gap-1.5 text-xs text-text-muted hover:text-primary transition-colors font-bengali"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>সকল কোর্সে ফিরে যান</span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function CheckoutFailedPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center bg-background">
          <p className="text-sm font-bengali text-text-muted">লোড হচ্ছে...</p>
        </div>
      }
    >
      <FailedContent />
    </Suspense>
  );
}
