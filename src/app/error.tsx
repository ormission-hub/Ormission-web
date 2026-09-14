"use client";

import { useEffect } from "react";
import Link from "next/link";
import { AlertCircle, RefreshCw, Home } from "lucide-react";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("Application error:", error);
  }, [error]);

  return (
    <div className="bg-background min-h-[75vh] flex items-center justify-center py-16 px-4">
      <div className="max-w-md w-full text-center">
        <div className="w-16 h-16 rounded-full bg-error/10 text-error flex items-center justify-center mx-auto mb-6">
          <AlertCircle className="w-8 h-8" />
        </div>

        <h1 className="text-2xl font-bold text-text font-bengali tracking-tight mb-3">
          একটি অপ্রত্যাশিত সমস্যা দেখা দিয়েছে
        </h1>

        <p className="text-sm text-text-muted font-bengali leading-relaxed mb-8">
          আমাদের কারিগরি দল বিষয়টি সম্পর্কে অবহিত হয়েছে। পৃষ্ঠাটি পুনরায় লোড করে চেষ্টা করতে পারেন।
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
          <button
            type="button"
            onClick={() => reset()}
            className="btn btn-primary font-bengali font-bold w-full sm:w-auto px-6 py-2.5 flex items-center justify-center gap-2"
          >
            <RefreshCw className="w-4 h-4" />
            <span>আবার চেষ্টা করুন</span>
          </button>

          <Link
            href="/"
            className="btn btn-outline font-bengali font-semibold w-full sm:w-auto px-6 py-2.5 flex items-center justify-center gap-2"
          >
            <Home className="w-4 h-4" />
            <span>হোমপেজে ফিরে যান</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
