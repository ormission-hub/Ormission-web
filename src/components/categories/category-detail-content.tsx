"use client";

import { useState } from "react";
import Link from "next/link";
import {
  BookOpen,
  GraduationCap,
  Sparkles,
  ChevronRight,
  ShoppingBag,
  Eye,
  X,
  ExternalLink,
  Star,
  Layers,
  FileText,
  CheckCircle2,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Course } from "@/lib/data/courses";
import { CategoryBook } from "@/lib/supabase/course-fetcher";
import { CourseCard } from "@/components/courses/course-card";

interface CategoryDetailContentProps {
  category: {
    id: string;
    name: string;
    nameBn: string;
    slug: string;
    description: string;
    iconName: string;
    color: string;
  };
  courses: Course[];
  books: CategoryBook[];
}

export function CategoryDetailContent({
  category,
  courses,
  books,
}: CategoryDetailContentProps) {
  // Tabs: 'all' | 'courses' | 'books'
  const [activeTab, setActiveTab] = useState<"all" | "courses" | "books">("all");
  const [activePdfPreview, setActivePdfPreview] = useState<{
    url: string;
    title: string;
  } | null>(null);

  const showCourses = activeTab === "all" || activeTab === "courses";
  const showBooks = activeTab === "all" || activeTab === "books";

  return (
    <div>
      {/* Tab Navigation Pill Bar */}
      <div className="flex flex-wrap items-center justify-between gap-4 mb-8 pb-4 border-b border-border/70">
        <div className="inline-flex p-1.5 rounded-2xl bg-surface border border-border shadow-xs">
          <button
            type="button"
            onClick={() => setActiveTab("all")}
            className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-bold font-bengali transition-all cursor-pointer ${
              activeTab === "all"
                ? "bg-primary text-white shadow-md shadow-primary/25"
                : "text-text-muted hover:text-text"
            }`}
          >
            <Layers className="w-4 h-4" />
            <span>সকল কন্টেন্ট</span>
            <span
              className={`px-2 py-0.5 rounded-full text-[11px] ${
                activeTab === "all"
                  ? "bg-white/20 text-white"
                  : "bg-surface-secondary text-text-muted"
              }`}
            >
              {courses.length + books.length}
            </span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab("courses")}
            className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-bold font-bengali transition-all cursor-pointer ${
              activeTab === "courses"
                ? "bg-primary text-white shadow-md shadow-primary/25"
                : "text-text-muted hover:text-text"
            }`}
          >
            <GraduationCap className="w-4 h-4" />
            <span>কোর্সসমূহ</span>
            <span
              className={`px-2 py-0.5 rounded-full text-[11px] ${
                activeTab === "courses"
                  ? "bg-white/20 text-white"
                  : "bg-surface-secondary text-text-muted"
              }`}
            >
              {courses.length}
            </span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab("books")}
            className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-bold font-bengali transition-all cursor-pointer ${
              activeTab === "books"
                ? "bg-primary text-white shadow-md shadow-primary/25"
                : "text-text-muted hover:text-text"
            }`}
          >
            <BookOpen className="w-4 h-4" />
            <span>বই ও বুকলেট</span>
            <span
              className={`px-2 py-0.5 rounded-full text-[11px] ${
                activeTab === "books"
                  ? "bg-white/20 text-white"
                  : "bg-surface-secondary text-text-muted"
              }`}
            >
              {books.length}
            </span>
          </button>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href="/books"
            className="text-xs sm:text-sm text-text-muted hover:text-primary font-bold font-bengali transition-colors flex items-center gap-1.5"
          >
            <BookOpen className="w-3.5 h-3.5 text-primary" />
            <span>বই কালেকশন দেখুন</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>

      {/* COURSES SECTION */}
      {showCourses && (
        <section className="mb-14">
          <div className="flex items-center justify-between mb-6 pb-2 border-b border-border/50">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-primary/10 text-primary flex items-center justify-center">
                <GraduationCap className="w-4 h-4" />
              </div>
              <h2 className="text-lg sm:text-xl font-bold text-text font-bengali">
                {category.nameBn || category.name} — অনলাইন কোর্সসমূহ
              </h2>
              <span className="text-xs px-2.5 py-0.5 rounded-full bg-primary/15 text-primary font-bold">
                {courses.length} টি কোর্স
              </span>
            </div>
            <Link
              href="/courses"
              className="text-xs text-primary font-bold hover:underline font-bengali flex items-center gap-1"
            >
              <span>সকল কোর্স</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {courses.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {courses.map((course) => (
                <CourseCard key={course.id} course={course} />
              ))}
            </div>
          ) : (
            <div className="rounded-2xl border border-border bg-surface p-10 text-center max-w-md mx-auto my-6 shadow-xs">
              <GraduationCap className="w-10 h-10 text-text-muted/40 mx-auto mb-3" />
              <h3 className="text-base font-bold text-text font-bengali mb-1.5">
                শীঘ্রই নতুন কোর্স যুক্ত হবে
              </h3>
              <p className="text-xs sm:text-sm text-text-muted font-bengali mb-5">
                এই ক্যাটাগরির জন্য নতুন স্পেশাল ব্যাচ তৈরির কাজ চলছে।
              </p>
              <Link href="/courses" className="btn btn-primary btn-sm font-bengali">
                অন্যান্য কোর্স ব্রাউজ করুন
              </Link>
            </div>
          )}
        </section>
      )}

      {/* BOOKS SECTION */}
      {showBooks && (
        <section className="mb-12">
          <div className="flex items-center justify-between mb-6 pb-2 border-b border-border/50">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-primary/10 text-primary flex items-center justify-center">
                <BookOpen className="w-4 h-4" />
              </div>
              <h2 className="text-lg sm:text-xl font-bold text-text font-bengali">
                {category.nameBn || category.name} — বই ও স্টাডি বুকলেট
              </h2>
              <span className="text-xs px-2.5 py-0.5 rounded-full bg-primary/15 text-primary font-bold">
                {books.length} টি বই
              </span>
            </div>
            <Link
              href="/books"
              className="text-xs text-primary font-bold hover:underline font-bengali flex items-center gap-1"
            >
              <span>সকল বই দেখুন</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {books.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {books.map((book) => {
                const discountPct =
                  book.original_price > book.price
                    ? Math.round(
                        ((book.original_price - book.price) / book.original_price) * 100
                      )
                    : 0;

                return (
                  <motion.div
                    key={book.id}
                    whileHover={{ y: -5, transition: { duration: 0.2 } }}
                    className="group flex flex-col bg-surface border border-border/80 rounded-2xl overflow-hidden shadow-xs hover:shadow-2xl hover:shadow-primary/15 hover:border-primary/50 transition-all duration-300 h-full"
                  >
                    {/* Clean Book Cover Area (No background color gradients) */}
                    <Link
                      href={`/books/${book.id}`}
                      className="relative h-52 sm:h-56 w-full bg-slate-50/80 dark:bg-slate-900/50 p-4 flex flex-col items-center justify-center overflow-hidden border-b border-border/60 group/cover"
                    >
                      {/* Top Badges */}
                      <div className="absolute top-3 inset-x-3 z-10 flex items-center justify-between gap-2 pointer-events-none">
                        <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold text-primary bg-primary/10 backdrop-blur-md border border-primary/20 font-bengali">
                          {book.category}
                        </span>
                        <div className="flex items-center gap-1.5">
                          {book.is_popular && (
                            <span className="px-2 py-0.5 rounded-full text-[10px] font-black text-amber-900 bg-amber-400 shadow-xs font-bengali flex items-center gap-1">
                              <Sparkles className="w-3 h-3" />
                              <span>জনপ্রিয়</span>
                            </span>
                          )}
                          {discountPct > 0 && (
                            <span className="px-2 py-0.5 rounded-full text-[10px] font-black text-white bg-rose-500 font-sans shadow-xs">
                              -{discountPct}%
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Clean Book Image */}
                      <div className="relative w-24 sm:w-28 aspect-[3/4] rounded-lg overflow-hidden shadow-md group-hover/cover:shadow-xl group-hover/cover:scale-105 transition-all duration-300 flex items-center justify-center bg-white dark:bg-slate-800 border border-border/40">
                        {book.cover_image ? (
                          /* eslint-disable-next-line @next/next/no-img-element */
                          <img
                            src={book.cover_image}
                            alt={book.title}
                            className="w-full h-full object-contain"
                          />
                        ) : (
                          <div className="flex flex-col items-center justify-center p-2 text-center">
                            <BookOpen className="w-8 h-8 text-primary/70 mb-1" />
                            <span className="text-[10px] font-bold text-text line-clamp-2 font-bengali">
                              {book.title}
                            </span>
                          </div>
                        )}
                      </div>

                      {/* Cover Footer Tags */}
                      <div className="absolute bottom-2.5 inset-x-3 z-10 flex items-center justify-between pointer-events-none">
                        <span className="px-2 py-0.5 rounded-full text-[9px] font-bold font-bengali bg-surface/90 backdrop-blur-md text-text-muted border border-border/60">
                          {book.format}
                        </span>
                        {book.pages && (
                          <span className="px-2 py-0.5 rounded-full text-[9px] font-bold font-bengali bg-surface/90 backdrop-blur-md text-text-muted border border-border/60">
                            {book.pages}
                          </span>
                        )}
                      </div>
                    </Link>

                    {/* Book Details */}
                    <div className="p-4 sm:p-5 flex-1 flex flex-col justify-between space-y-4">
                      <div className="space-y-2">
                        {/* Rating & Review */}
                        <div className="flex items-center justify-between gap-2 text-xs">
                          <div className="flex items-center gap-1 text-amber-500 font-bold">
                            <Star className="w-3.5 h-3.5 fill-current" />
                            <span>{Number(book.rating || 5).toFixed(1)}</span>
                          </div>
                          {book.reviews_count ? (
                            <span className="text-[11px] text-text-muted font-bengali">
                              ({book.reviews_count.toLocaleString("bn-BD")} রিভিউ)
                            </span>
                          ) : null}
                        </div>

                        {/* Title & Subtitle */}
                        <Link href={`/books/${book.id}`} className="block group/title">
                          <h3 className="text-base font-black text-text font-bengali leading-snug group-hover/title:text-primary transition-colors line-clamp-2">
                            {book.title}
                          </h3>
                        </Link>

                        {book.subtitle && (
                          <p className="text-xs text-text-muted font-bengali line-clamp-2 leading-relaxed">
                            {book.subtitle}
                          </p>
                        )}

                        {book.author && (
                          <p className="text-xs text-primary/90 font-bold font-bengali">
                            {book.author}
                          </p>
                        )}
                      </div>

                      {/* Pricing and Action Buttons */}
                      <div className="pt-3 border-t border-border/60 space-y-3">
                        <div className="flex items-baseline gap-2">
                          <span className="text-lg font-black text-text font-sans">
                            ৳ {book.price.toLocaleString("bn-BD")}
                          </span>
                          {book.original_price > book.price && (
                            <span className="text-xs text-text-muted line-through font-sans">
                              ৳ {book.original_price.toLocaleString("bn-BD")}
                            </span>
                          )}
                        </div>

                        <div className="flex items-center gap-2">
                          <Link
                            href={`/books/${book.id}`}
                            className="flex-1 btn btn-primary btn-sm text-xs font-bold font-bengali flex items-center justify-center gap-1.5 shadow-xs"
                          >
                            <ShoppingBag className="w-3.5 h-3.5" />
                            <span>সংগ্রহ করুন</span>
                          </Link>

                          {book.preview_pdf_url && (
                            <button
                              type="button"
                              onClick={() =>
                                setActivePdfPreview({
                                  url: book.preview_pdf_url!,
                                  title: book.title,
                                })
                              }
                              className="btn btn-secondary btn-sm px-3 text-xs font-bold font-bengali flex items-center justify-center gap-1 hover:border-primary/50 cursor-pointer"
                              title="পিডিএফ প্রিভিউ দেখুন"
                            >
                              <Eye className="w-3.5 h-3.5 text-primary" />
                              <span className="hidden sm:inline">প্রিভিউ</span>
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          ) : (
            <div className="rounded-2xl border border-border bg-surface p-10 text-center max-w-md mx-auto my-6 shadow-xs">
              <BookOpen className="w-10 h-10 text-text-muted/40 mx-auto mb-3" />
              <h3 className="text-base font-bold text-text font-bengali mb-1.5">
                শীঘ্রই নতুন বই আসছে
              </h3>
              <p className="text-xs sm:text-sm text-text-muted font-bengali mb-5">
                এই ক্যাটাগরির শিক্ষার্থীদের জন্য মানসম্মত স্পেশাল হ্যান্ডবুক ও ফর্মুলা বুক প্রস্তুত করা হচ্ছে।
              </p>
              <Link href="/books" className="btn btn-secondary btn-sm font-bengali">
                সকল প্রকাশনা দেখুন
              </Link>
            </div>
          )}
        </section>
      )}

      {/* PDF PREVIEW MODAL */}
      <AnimatePresence>
        {activePdfPreview && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-surface border border-border rounded-2xl w-full max-w-4xl h-[85vh] flex flex-col overflow-hidden shadow-2xl"
            >
              {/* Modal Header */}
              <div className="flex items-center justify-between px-5 py-4 border-b border-border bg-surface-secondary">
                <div className="flex items-center gap-2">
                  <FileText className="w-5 h-5 text-primary" />
                  <h3 className="font-bold text-text font-bengali text-sm sm:text-base line-clamp-1">
                    {activePdfPreview.title} — পৃষ্ঠা প্রিভিউ
                  </h3>
                </div>
                <div className="flex items-center gap-2">
                  <a
                    href={activePdfPreview.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-1.5 rounded-lg text-text-muted hover:text-text hover:bg-surface border border-border transition-colors"
                    title="নতুন ট্যাবে খুলুন"
                  >
                    <ExternalLink className="w-4 h-4" />
                  </a>
                  <button
                    type="button"
                    onClick={() => setActivePdfPreview(null)}
                    className="p-1.5 rounded-lg text-text-muted hover:text-text hover:bg-surface border border-border transition-colors cursor-pointer"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* PDF Viewer */}
              <div className="flex-1 bg-slate-100 dark:bg-slate-950 p-2 relative">
                <iframe
                  src={`${activePdfPreview.url}#toolbar=0`}
                  className="w-full h-full rounded-lg border border-border"
                  title={activePdfPreview.title}
                />
              </div>

              {/* Modal Footer */}
              <div className="px-5 py-3 border-t border-border bg-surface flex items-center justify-between">
                <span className="text-xs text-text-muted font-bengali flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                  <span>বইটির সূচিপত্র ও স্যাম্পল পৃষ্ঠা প্রিভিউ</span>
                </span>
                <Link
                  href="/books"
                  className="btn btn-primary btn-sm text-xs font-bengali"
                >
                  পূর্ণাঙ্গ কপি অর্ডার করুন
                </Link>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
