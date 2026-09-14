"use client";

import { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { AlertCircle, RefreshCw, Phone, ArrowLeft } from "lucide-react";

function FailedContent() {
  const searchParams = useSearchParams();
  const courseSlug = searchParams.get("course") || "buet-engineering-physics-mastery";

  return (
    <div className="bg-background min-h-screen py-12 lg:py-20 flex items-center justify-center">
      <div className="container-main max-w-md w-full">
        <div className="bg-surface rounded-xl border border-border p-6 sm:p-8 shadow-sm text-center">
          {/* Alert Icon */}
          <div className="w-16 h-16 rounded-full bg-error/15 text-error flex items-center justify-center mx-auto mb-4">
            <AlertCircle className="w-10 h-10" />
          </div>

          <h1 className="text-2xl font-bold text-text font-bengali tracking-tight mb-2">
            পেমেন্ট সফল হতে পারেনি
          </h1>
          <p className="text-xs lg:text-sm text-text-muted font-bengali mb-6">
            লেনদেন প্রক্রিয়া চলাকালে কোনো সমস্যার কারণে পেমেন্ট সম্পন্ন করা যায়নি। আপনার অ্যাকাউন্ট থেকে কোনো টাকা কাটা হয়নি।
          </p>

          {/* Common Reasons Box */}
          <div className="bg-surface-secondary/60 rounded-lg border border-border p-4 text-left text-xs mb-6 space-y-2 font-bengali text-text-muted">
            <h4 className="font-bold text-text text-xs mb-1">সম্ভাব্য কারণসমূহ:</h4>
            <p>• ওটিপি (OTP) বা পিন নম্বর দিতে দেরি হওয়া বা ভুল ইনপুট দেওয়া।</p>
            <p>• মোবাইল ওয়ালেট বা ব্যাংকে পর্যাপ্ত ব্যালেন্স না থাকা।</p>
            <p>• ইন্টারনেট সংযোগ বিঘ্নিত হওয়া অথবা আপনার পক্ষ থেকে পেমেন্ট বাতিল করা।</p>
          </div>

          {/* Actions */}
          <div className="space-y-3">
            <Link
              href={`/checkout/${courseSlug}`}
              className="btn btn-primary font-bengali font-bold w-full py-3 flex items-center justify-center gap-2"
            >
              <RefreshCw className="w-4 h-4" />
              <span>পুনরায় চেষ্টা করুন</span>
            </Link>

            <a
              href="tel:+8801700000000"
              className="btn btn-outline font-bengali font-semibold w-full py-2.5 flex items-center justify-center gap-2"
            >
              <Phone className="w-4 h-4" />
              <span>সরাসরি হেল্পলাইনে যোগাযোগ করুন</span>
            </a>
          </div>

          <div className="mt-6 pt-4 border-t border-border">
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
        <div className="min-h-screen flex items-center justify-center">
          <p className="text-sm font-bengali text-text-muted">লোড হচ্ছে...</p>
        </div>
      }
    >
      <FailedContent />
    </Suspense>
  );
}
