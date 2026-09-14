import Link from "next/link";
import { BookOpen, ArrowLeft, Home, Search } from "lucide-react";

export default function NotFound() {
  return (
    <div className="bg-background min-h-[75vh] flex items-center justify-center py-16 px-4">
      <div className="max-w-md w-full text-center">
        <div className="w-16 h-16 rounded-full bg-primary/10 text-primary flex items-center justify-center mx-auto mb-6">
          <BookOpen className="w-8 h-8" />
        </div>

        <span className="text-4xl font-extrabold text-primary font-sans block mb-2">
          404
        </span>

        <h1 className="text-2xl font-bold text-text font-bengali tracking-tight mb-3">
          পৃষ্ঠাটি খুঁজে পাওয়া যায়নি
        </h1>

        <p className="text-sm text-text-muted font-bengali leading-relaxed mb-8">
          আপনি যে পাতাটি খুঁজছেন তা হয়তো পরিবর্তিত হয়েছে অথবা সাময়িকভাবে অনুপলব্ধ রয়েছে। অনুগ্রহ করে নিচের লিংকগুলো ব্যবহার করে কাঙ্ক্ষিত পেজে যান।
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
          <Link
            href="/"
            className="btn btn-primary font-bengali font-bold w-full sm:w-auto px-6 py-2.5 flex items-center justify-center gap-2"
          >
            <Home className="w-4 h-4" />
            <span>হোমপেজে ফিরে যান</span>
          </Link>

          <Link
            href="/courses"
            className="btn btn-outline font-bengali font-semibold w-full sm:w-auto px-6 py-2.5 flex items-center justify-center gap-2"
          >
            <Search className="w-4 h-4" />
            <span>সকল কোর্স ব্রাউজ করুন</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
