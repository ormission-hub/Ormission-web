"use client";

import { useState, useMemo, useEffect, Suspense } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import {
  Search,
  BookOpen,
  Sparkles,
  Star,
  CheckCircle2,
  ShoppingBag,
  ArrowRight,
  Filter,
  FileText,
  Truck,
  Eye,
  X,
  ExternalLink,
  ChevronDown,
  Layers,
  ArrowUpDown,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { createClient } from "@/lib/supabase/client";

export interface BookItem {
  id: string;
  title: string;
  subtitle: string;
  author?: string;
  edition?: string;
  publisher?: string;
  category: string;
  price: number;
  original_price: number;
  cover_gradient?: string;
  cover_image?: string;
  pages: string;
  format: string;
  stock_status?: "in_stock" | "low_stock" | "pre_order" | "out_of_stock";
  stock_quantity?: number;
  rating: number;
  reviews_count: number;
  features: string[];
  is_popular: boolean;
  is_pinned: boolean;
  display_order: number;
  order_url?: string;
  preview_pdf_url?: string;
  delivery_info?: string;
}

const DEFAULT_BOOKS: BookItem[] = [
  {
    id: "book-1",
    title: "এইচএসসি পদার্থবিজ্ঞান মাস্টার ফর্মুলা বুক",
    subtitle: "১ম ও ২য় পত্রের সকল সূত্রের প্রমাণ, শর্টকাট ট্রিকস ও বোর্ড প্রশ্ন সমাধান",
    author: "ড. মো. রফিকুল ইসলাম ও টিম",
    edition: "১ম সংস্করণ ২০২৬",
    publisher: "অরমিশন পাবলিকেশন্স",
    category: "এইচএসসি বিজ্ঞান",
    price: 380,
    original_price: 500,
    cover_gradient: "from-blue-600 via-indigo-600 to-sky-700",
    pages: "৩২০ পৃষ্ঠা",
    format: "হার্ডকভার + ই-বুক",
    stock_status: "in_stock",
    rating: 5.0,
    reviews_count: 1420,
    features: ["অধ্যায়ভিত্তিক সকল সূত্র ও মাত্রা", "বিগত ১০ বছরের বোর্ড প্রশ্ন সমাধান", "টাইপভিত্তিক শর্টকাট মেথড"],
    is_popular: true,
    is_pinned: true,
    display_order: 1,
    delivery_info: "সারাদেশে ক্যাশ অন ডেলিভারি ২-৩ কার্যদিবসে",
  },
  {
    id: "book-2",
    title: "বুয়েট ও ইঞ্জিনিয়ারিং বিগত ২০ বছরের প্রশ্নব্যাংক",
    subtitle: "বুয়েট, রুয়েট, কুয়েট, চুয়েটের অধ্যায়ভিত্তিক নিখুঁত প্রশ্ন বিশ্লেষণ ও সমাধান",
    author: "বুয়েট ইঞ্জিনিয়ার্স প্যানেল",
    edition: "১ম সংস্করণ ২০২৬",
    publisher: "অরমিশন পাবলিকেশন্স",
    category: "ইঞ্জিনিয়ারিং ভর্তি",
    price: 550,
    original_price: 720,
    cover_gradient: "from-purple-700 via-indigo-800 to-slate-900",
    pages: "৫৪০ পৃষ্ঠা",
    format: "হার্ডকভার প্রিন্ট",
    stock_status: "in_stock",
    rating: 5.0,
    reviews_count: 980,
    features: ["বিগত ২০ বছরের বুয়েট প্রশ্ন", "অধ্যায়ভিত্তিক ওয়েইটেজ এনালাইসিস", "কঠিন ম্যাথের সহজ বিকল্প টেকনিক"],
    is_popular: true,
    is_pinned: true,
    display_order: 2,
    delivery_info: "সারাদেশে ক্যাশ অন ডেলিভারি ২-৩ কার্যদিবসে",
  },
  {
    id: "book-3",
    title: "মেডিকেল বায়োলজি নেমোনিক্স ও হাই-ইল্ড হ্যান্ডবুক",
    subtitle: "ডিএমসি ও শীর্ষ মেডিকেল শিক্ষার্থীদের তৈরিকৃত মনে রাখার স্পেশাল হ্যান্ডনোট",
    author: "ডা. সৈয়দা নুসরাত জাহান ও ডিএমসি টিম",
    edition: "১ম সংস্করণ ২০২৬",
    publisher: "অরমিশন পাবলিকেশন্স",
    category: "মেডিকেল ভর্তি",
    price: 320,
    original_price: 450,
    cover_gradient: "from-emerald-600 via-teal-700 to-cyan-800",
    pages: "২৮০ পৃষ্ঠা",
    format: "৪ কালার আর্ট প্রিন্ট",
    stock_status: "in_stock",
    rating: 4.9,
    reviews_count: 1650,
    features: ["১০০% চিত্রসহ রঙিন ডায়াগ্রাম", "জাদুকরী নেমোনিক্স ও শর্টকাট", "বোটানি ও জুয়োলজির পূর্ণাঙ্গ কাভারেজ"],
    is_popular: true,
    is_pinned: true,
    display_order: 3,
    delivery_info: "সারাদেশে ক্যাশ অন ডেলিভারি ২-৩ কার্যদিবসে",
  },
  {
    id: "book-4",
    title: "এইচএসসি রসায়ন অর্গানিক রিঅ্যাকশন রঙিন রোডম্যাপ",
    subtitle: "জৈব রসায়নের সকল বিক্রিয়া ও পারস্পরিক রূপান্তরের এক নজরে রঙিন ফ্লোচার্ট",
    author: "অরমিশন কেমিস্ট্রি ফ্যাকাল্টি",
    edition: "১ম সংস্করণ ২০২৬",
    publisher: "অরমিশন পাবলিকেশন্স",
    category: "এইচএসসি একাডেমি",
    price: 290,
    original_price: 390,
    cover_gradient: "from-orange-600 via-amber-600 to-red-600",
    pages: "১৯০ পৃষ্ঠা",
    format: "প্রিমিয়াম আর্ট পেপার",
    stock_status: "in_stock",
    rating: 5.0,
    reviews_count: 840,
    features: ["সম্পূর্ণ বিক্রিয়ার রঙিন মেগা ফ্লোচার্ট", "সকল গুরুত্বপূর্ণ নেম রিঅ্যাকশন", "এডমিশন স্পেশাল কনভার্সন ট্রিকস"],
    is_popular: true,
    is_pinned: true,
    display_order: 4,
    delivery_info: "সারাদেশে ক্যাশ অন ডেলিভারি ২-৩ কার্যদিবসে",
  },
];

function BooksContent() {
  const searchParams = useSearchParams();
  const filterParam = searchParams.get("filter");
  const popularParam = searchParams.get("popular");
  const isPopularQuery = filterParam === "popular" || popularParam === "true";

  const [books, setBooks] = useState<BookItem[]>(DEFAULT_BOOKS);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [onlyPopular, setOnlyPopular] = useState(isPopularQuery);
  const [sortBy, setSortBy] = useState<"default" | "price_asc" | "price_desc" | "rating">("default");
  const [loading, setLoading] = useState(true);

  // PDF Preview Modal
  const [activePdfPreview, setActivePdfPreview] = useState<{ url: string; title: string } | null>(null);

  useEffect(() => {
    if (isPopularQuery) {
      setOnlyPopular(true);
    }
  }, [isPopularQuery]);

  useEffect(() => {
    const supabase = createClient();
    async function loadBooks() {
      try {
        const { data, error } = await supabase
          .from("site_settings")
          .select("value")
          .eq("key", "ormission_books")
          .single();

        if (!error && data?.value && Array.isArray(data.value) && data.value.length > 0) {
          setBooks(data.value);
        }
      } catch {
        // Fallback to default
      } finally {
        setLoading(false);
      }
    }
    loadBooks();
  }, []);

  const categories = useMemo(() => {
    return Array.from(new Set(books.map((b) => b.category).filter(Boolean)));
  }, [books]);

  const filteredBooks = useMemo(() => {
    let result = books.filter((b) => {
      const q = searchQuery.toLowerCase().trim();
      const matchesSearch =
        !q ||
        b.title.toLowerCase().includes(q) ||
        (b.subtitle && b.subtitle.toLowerCase().includes(q)) ||
        (b.author && b.author.toLowerCase().includes(q)) ||
        b.category.toLowerCase().includes(q);

      const matchesCat = selectedCategory === "all" || b.category === selectedCategory;
      const matchesPopular = !onlyPopular || !!b.is_popular;

      return matchesSearch && matchesCat && matchesPopular;
    });

    result.sort((a, b) => {
      if (sortBy === "price_asc") return a.price - b.price;
      if (sortBy === "price_desc") return b.price - a.price;
      if (sortBy === "rating") return (b.rating || 0) - (a.rating || 0);
      return (a.display_order || 0) - (b.display_order || 0);
    });

    return result;
  }, [books, searchQuery, selectedCategory, onlyPopular, sortBy]);

  return (
    <div className="bg-background min-h-screen py-10 lg:py-14">
      <div className="container-main">
        {/* Page Header */}
        <div className="max-w-3xl mb-10">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-primary/10 text-primary text-xs font-bold font-bengali mb-3">
            <BookOpen className="w-3.5 h-3.5" />
            <span>আমাদের প্রকাশনা ও বইসমূহ</span>
          </div>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-text font-bengali tracking-tight mb-3">
            {onlyPopular ? "জনপ্রিয় বই ও প্রশ্নব্যাংক" : "সকল বই ও স্টাডি মেটেরিয়াল"}
          </h1>
          <p className="text-sm sm:text-base text-text-muted font-bengali leading-relaxed">
            এইচএসসি ও শীর্ষ বিশ্ববিদ্যালয় ভর্তি পরীক্ষায় সেরা ফলাফলের জন্য অভিজ্ঞ শিক্ষকমণ্ডলীর রচিত স্পেশাল ফর্মুলা বুক ও প্রশ্নব্যাংক।
          </p>
        </div>

        {/* Filters, Search & Sort Toolbar */}
        <div className="flex flex-col md:flex-row gap-3 mb-8">
          {/* Search */}
          <div className="relative flex-1">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted" />
            <input
              type="text"
              placeholder="বইয়ের নাম, লেখক বা বিষয় দিয়ে খুঁজুন..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="input w-full pl-10 text-xs sm:text-sm font-bengali h-11"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-text-muted hover:text-text cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          <div className="flex flex-wrap items-center gap-2.5">
            {/* Popular Filter Button */}
            <button
              type="button"
              onClick={() => setOnlyPopular(!onlyPopular)}
              className={`inline-flex items-center justify-center gap-2 px-4 h-11 rounded-xl text-xs font-bold transition-all border font-bengali shrink-0 cursor-pointer ${
                onlyPopular
                  ? "bg-primary text-white border-primary shadow-md shadow-primary/25"
                  : "bg-surface border-border text-text hover:border-primary/50"
              }`}
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>জনপ্রিয় বই ({books.filter((b) => b.is_popular).length})</span>
            </button>

            {/* Category Dropdown */}
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="input text-xs sm:text-sm font-bengali h-11"
            >
              <option value="all">সকল ক্যাটাগরি ({books.length})</option>
              {categories.map((cat) => (
                <option key={cat} value={cat}>
                  {cat} ({books.filter((b) => b.category === cat).length})
                </option>
              ))}
            </select>

            {/* Sort Dropdown */}
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="input text-xs sm:text-sm font-bengali h-11"
            >
              <option value="default">প্রস্তাবিত ক্রম</option>
              <option value="price_asc">মূল্য: কম থেকে বেশি</option>
              <option value="price_desc">মূল্য: বেশি থেকে কম</option>
              <option value="rating">সর্বোচ্চ রেটিং</option>
            </select>
          </div>
        </div>

        {/* Active Popular Banner */}
        {onlyPopular && (
          <div className="flex items-center gap-3 mb-6 p-3 rounded-xl bg-primary/10 border border-primary/20">
            <Sparkles className="w-4 h-4 text-primary shrink-0" />
            <span className="text-xs sm:text-sm font-bold text-primary font-bengali">
              এডমিন প্যানেল কর্তৃক নির্বাচিত জনপ্রিয় বইসমূহ প্রদর্শিত হচ্ছে।
            </span>
            <button
              type="button"
              onClick={() => setOnlyPopular(false)}
              className="ml-auto text-xs font-bold text-primary hover:underline font-bengali cursor-pointer"
            >
              সকল বই দেখুন
            </button>
          </div>
        )}

        {/* Books Grid */}
        {filteredBooks.length === 0 ? (
          <div className="p-12 rounded-3xl bg-surface border border-border text-center max-w-lg mx-auto">
            <BookOpen className="w-12 h-12 text-text-muted/40 mx-auto mb-3" />
            <h3 className="text-lg font-bold text-text font-bengali mb-1">কোনো বই পাওয়া যায়নি</h3>
            <p className="text-xs text-text-muted font-bengali mb-4">
              আপনার ফিল্টারের সাথে মিলে এমন কোনো বই নেই।
            </p>
            <button
              type="button"
              onClick={() => {
                setSearchQuery("");
                setSelectedCategory("all");
                setOnlyPopular(false);
                setSortBy("default");
              }}
              className="btn btn-primary btn-sm font-bengali cursor-pointer"
            >
              সকল ফিল্টার রিসেট করুন
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 sm:gap-7">
            {filteredBooks.map((book) => {
              const discountPct =
                book.original_price > book.price
                  ? Math.round(((book.original_price - book.price) / book.original_price) * 100)
                  : 0;

              return (
                <motion.div
                  key={book.id}
                  whileHover={{ y: -5, transition: { duration: 0.2 } }}
                  className="group flex flex-col bg-surface border border-border/80 rounded-2xl overflow-hidden shadow-xs hover:shadow-2xl hover:shadow-primary/15 hover:border-primary/50 transition-all duration-300 h-full"
                >
                  {/* Book Cover Area */}
                  <div
                    className={`relative h-56 w-full bg-gradient-to-br ${
                      book.cover_gradient || "from-blue-600 to-indigo-700"
                    } p-4 flex flex-col justify-between overflow-hidden`}
                  >
                    <div className="absolute -right-8 -bottom-8 w-32 h-32 rounded-full bg-white/10 blur-xl pointer-events-none" />
                    <div className="absolute left-0 top-0 w-full h-full bg-[radial-gradient(circle_at_top_right,rgba(255,255,255,0.18),transparent_65%)] pointer-events-none" />

                    {/* Top Badges */}
                    <div className="relative z-10 flex items-center justify-between gap-2">
                      <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black text-white bg-black/40 backdrop-blur-md border border-white/20 font-bengali">
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

                    {/* 3D Book Mockup Spine & Cover */}
                    <div className="relative z-10 flex items-center gap-3 my-auto">
                      <div className="relative w-16 h-24 rounded bg-white/20 backdrop-blur-md border border-white/30 shadow-[0_12px_24px_rgba(0,0,0,0.4)] flex flex-col items-center justify-center p-1 text-white shrink-0 group-hover:scale-105 transition-transform duration-300">
                        {/* 3D Spine Shadow */}
                        <div className="absolute left-0 top-0 bottom-0 w-1.5 bg-black/35 rounded-l border-r border-white/20 pointer-events-none" />

                        {book.cover_image ? (
                          <img
                            src={book.cover_image}
                            alt={book.title}
                            className="w-full h-full object-cover rounded-xs"
                          />
                        ) : (
                          <div className="flex flex-col items-center justify-center text-center p-1">
                            <BookOpen className="w-6 h-6 text-white drop-shadow-md mb-1" />
                            <span className="text-[7.5px] font-black tracking-widest text-white/90 uppercase">
                              ORMISSION
                            </span>
                          </div>
                        )}
                      </div>

                      <div className="text-white space-y-1 min-w-0 pr-1 font-bengali">
                        <span className="inline-block px-2 py-0.5 rounded bg-white/25 text-[9.5px] font-bold">
                          {book.format}
                        </span>
                        <p className="text-xs font-bold text-white/95">{book.pages}</p>
                        {book.edition && (
                          <p className="text-[10px] text-white/80 truncate">
                            {book.edition}
                          </p>
                        )}
                      </div>
                    </div>

                    {/* Stock status banner */}
                    <div className="relative z-10 flex items-center justify-between">
                      <span className="px-2 py-0.5 rounded-full text-[9.5px] font-bold font-bengali bg-black/50 backdrop-blur-md text-white border border-white/20">
                        {book.stock_status === "pre_order"
                          ? "প্রি-অর্ডার চলছে"
                          : book.stock_status === "low_stock"
                          ? "সীমিত স্টক"
                          : "স্টকে আছে"}
                      </span>
                      {book.publisher && (
                        <span className="text-[10px] text-white/80 font-bengali font-semibold">
                          {book.publisher}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Details */}
                  <div className="p-4 sm:p-5 flex flex-col flex-1 font-bengali">
                    <h3 className="text-base font-black text-text group-hover:text-primary transition-colors line-clamp-1 mb-1 leading-snug">
                      {book.title}
                    </h3>
                    <p className="text-xs text-text-muted line-clamp-2 mb-2.5 leading-relaxed">
                      {book.subtitle}
                    </p>

                    {book.author && (
                      <p className="text-[11.5px] text-primary font-bold mb-3 flex items-center gap-1 truncate">
                        <span className="text-text-muted font-normal">লেখক:</span>
                        <span>{book.author}</span>
                      </p>
                    )}

                    {/* Feature bullets */}
                    {Array.isArray(book.features) && book.features.length > 0 && (
                      <div className="space-y-1.5 mb-4 pt-2.5 border-t border-border/50">
                        {book.features.slice(0, 2).map((feat, fIdx) => (
                          <div
                            key={fIdx}
                            className="flex items-center gap-1.5 text-[11px] font-medium text-text-muted"
                          >
                            <CheckCircle2 className="w-3.5 h-3.5 text-primary shrink-0" />
                            <span className="truncate">{feat}</span>
                          </div>
                        ))}
                      </div>
                    )}

                    {/* Rating & Delivery Info */}
                    <div className="flex items-center justify-between gap-2 mb-4 pt-2.5 border-t border-border/40">
                      <div className="flex items-center gap-1">
                        {[...Array(5)].map((_, i) => (
                          <Star key={i} className="w-3 h-3 fill-amber-400 text-amber-400" />
                        ))}
                        <span className="text-xs font-bold text-text ml-1">{book.rating || 5.0}</span>
                      </div>
                      <span className="text-[11px] text-text-muted">
                        ({(book.reviews_count || 500).toLocaleString("en-US")}+ রিভিউ)
                      </span>
                    </div>

                    {/* Pricing & CTA */}
                    <div className="mt-auto pt-3 border-t border-border/60 flex items-center justify-between gap-2">
                      <div>
                        <div className="flex items-baseline gap-1.5 font-sans">
                          <span className="text-lg sm:text-xl font-black text-text">
                            ৳{book.price.toLocaleString("en-US")}
                          </span>
                          {book.original_price > book.price && (
                            <span className="text-xs text-text-muted line-through">
                              ৳{book.original_price.toLocaleString("en-US")}
                            </span>
                          )}
                        </div>
                        <span className="text-[10px] text-text-muted block mt-0.5">
                          {book.delivery_info || "ক্যাশ অন ডেলিভারি"}
                        </span>
                      </div>

                      <div className="flex items-center gap-1.5">
                        {book.preview_pdf_url && (
                          <button
                            type="button"
                            onClick={() =>
                              setActivePdfPreview({ url: book.preview_pdf_url!, title: book.title })
                            }
                            className="p-2 rounded-xl border border-border hover:border-primary/50 bg-surface-secondary text-text-muted hover:text-primary transition-all cursor-pointer"
                            title="নমুনা পাতা পড়ুন"
                          >
                            <FileText className="w-4 h-4" />
                          </button>
                        )}

                        <Link
                          href={book.order_url || "/contact"}
                          className="inline-flex items-center gap-1.5 px-3 sm:px-3.5 py-2 rounded-xl text-xs font-bold text-white bg-primary hover:bg-primary-hover shadow-md shadow-primary/25 hover:shadow-lg hover:shadow-primary/35 transition-all duration-200 group-hover:scale-105 font-bengali cursor-pointer"
                        >
                          <ShoppingBag className="w-3.5 h-3.5" />
                          <span>সংগ্রহ করুন</span>
                        </Link>
                      </div>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}

        {/* PDF Look-Inside Modal */}
        {activePdfPreview && (
          <div className="fixed inset-0 bg-black/85 z-50 flex items-center justify-center p-3 sm:p-6 backdrop-blur-sm animate-in fade-in duration-200">
            <div className="bg-surface border border-border rounded-3xl max-w-4xl w-full h-[88vh] flex flex-col overflow-hidden shadow-2xl">
              <div className="flex items-center justify-between p-4 border-b border-border bg-surface-secondary/70">
                <div className="flex items-center gap-2.5 min-w-0 pr-3 font-bengali">
                  <div className="w-8 h-8 rounded-xl bg-primary/10 text-primary flex items-center justify-center shrink-0">
                    <FileText className="w-4 h-4" />
                  </div>
                  <div className="truncate">
                    <h3 className="text-sm font-bold text-text truncate">
                      নমুনা পাতা — {activePdfPreview.title}
                    </h3>
                    <p className="text-[11px] text-text-muted">বইটির কিছু গুরুত্বপূর্ণ নমুনা পৃষ্ঠা</p>
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <a
                    href={activePdfPreview.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn btn-outline btn-sm text-xs font-bengali flex items-center gap-1"
                  >
                    <ExternalLink className="w-3.5 h-3.5" />
                    <span className="hidden sm:inline">নতুন ট্যাবে খুলুন</span>
                  </a>
                  <button
                    type="button"
                    onClick={() => setActivePdfPreview(null)}
                    className="p-1.5 rounded-lg text-text-muted hover:text-text hover:bg-surface-secondary cursor-pointer"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
              </div>

              <div className="flex-1 w-full bg-slate-950 relative">
                <iframe
                  src={activePdfPreview.url}
                  className="w-full h-full border-0"
                  title="PDF Sample Look Inside"
                />
              </div>

              <div className="p-3 border-t border-border bg-surface-secondary/60 flex items-center justify-between text-xs text-text-muted font-bengali">
                <span>💡 বইটি সংগ্রহ করতে "সংগ্রহ করুন" বাটনে ক্লিক করুন।</span>
                <button
                  type="button"
                  onClick={() => setActivePdfPreview(null)}
                  className="btn btn-primary btn-sm text-xs font-bold"
                >
                  বন্ধ করুন
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default function BooksPage() {
  return (
    <Suspense
      fallback={
        <div className="container-main py-16 text-center text-text-muted font-bengali">
          বইয়ের তালিকা লোড হচ্ছে...
        </div>
      }
    >
      <BooksContent />
    </Suspense>
  );
}
