"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import {
  Search,
  FileDown,
  FileText,
  BookOpen,
  Download,
  Sparkles,
  CheckCircle2,
  ChevronRight,
  ArrowRight,
  X,
  Flame,
  Layers,
  Zap,
  BookMarked,
  ExternalLink,
  GraduationCap,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export interface RealResourceItem {
  id: number;
  title: string;
  titleBn?: string | null;
  description?: string | null;
  category?: string | null;
  subject?: string | null;
  fileType?: string | null;
  fileUrl: string;
  thumbnailUrl?: string | null;
  downloadCount: number;
  displayOrder?: number;
  isPublished: boolean;
  createdAt?: string;
}

interface FreeResourcesClientProps {
  initialResources: RealResourceItem[];
}

function formatBengaliNumber(num: number): string {
  const bengaliDigits = ["০", "১", "২", "৩", "৪", "৫", "৬", "৭", "৮", "৯"];
  return num
    .toLocaleString("en-US")
    .split("")
    .map((d) => (d === "," ? "," : bengaliDigits[parseInt(d, 10)] || d))
    .join("");
}

const CATEGORY_NAMES_BN: Record<string, string> = {
  HSC: "এইচএসসি (HSC)",
  Admission: "ভর্তি প্রস্তুতি (Admission)",
  SSC: "এসএসসি (SSC)",
  General: "সাধারণ / অন্যান্য",
};

const CATEGORY_COLORS: Record<
  string,
  { badgeBg: string; borderHover: string; gradient: string }
> = {
  HSC: {
    badgeBg: "bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20",
    borderHover: "hover:border-blue-500/40",
    gradient: "from-blue-500/10 via-blue-500/5 to-transparent",
  },
  Admission: {
    badgeBg: "bg-purple-500/10 text-purple-600 dark:text-purple-400 border-purple-500/20",
    borderHover: "hover:border-purple-500/40",
    gradient: "from-purple-500/10 via-purple-500/5 to-transparent",
  },
  SSC: {
    badgeBg: "bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20",
    borderHover: "hover:border-amber-500/40",
    gradient: "from-amber-500/10 via-amber-500/5 to-transparent",
  },
  General: {
    badgeBg: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20",
    borderHover: "hover:border-emerald-500/40",
    gradient: "from-emerald-500/10 via-emerald-500/5 to-transparent",
  },
};

export function FreeResourcesClient({ initialResources }: FreeResourcesClientProps) {
  const [resources, setResources] = useState<RealResourceItem[]>(initialResources);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [selectedFormat, setSelectedFormat] = useState<string>("all");
  const [sortBy, setSortBy] = useState<"downloads" | "newest">("downloads");
  const [downloadingId, setDownloadingId] = useState<number | null>(null);

  // Dynamic available categories from real data
  const availableCategories = useMemo(() => {
    const set = new Set<string>();
    resources.forEach((r) => {
      if (r.category) set.add(r.category);
    });
    return Array.from(set);
  }, [resources]);

  // Dynamic available formats from real data
  const availableFormats = useMemo(() => {
    const set = new Set<string>();
    resources.forEach((r) => {
      if (r.fileType) set.add(r.fileType);
    });
    return Array.from(set);
  }, [resources]);

  // Overall platform stats calculated from real data
  const totalDownloads = useMemo(() => {
    return resources.reduce((acc, r) => acc + (r.downloadCount || 0), 0);
  }, [resources]);

  const uniqueSubjectsCount = useMemo(() => {
    const s = new Set<string>();
    resources.forEach((r) => {
      if (r.subject) s.add(r.subject);
    });
    return s.size || 5;
  }, [resources]);

  // Filtered & sorted resources
  const filteredResources = useMemo(() => {
    return resources
      .filter((res) => {
        const q = searchQuery.toLowerCase().trim();
        const matchesSearch =
          !q ||
          res.title.toLowerCase().includes(q) ||
          (res.titleBn && res.titleBn.toLowerCase().includes(q)) ||
          (res.subject && res.subject.toLowerCase().includes(q)) ||
          (res.description && res.description.toLowerCase().includes(q));

        if (!matchesSearch) return false;

        if (selectedCategory !== "all" && res.category !== selectedCategory) {
          return false;
        }

        if (selectedFormat !== "all" && res.fileType !== selectedFormat) {
          return false;
        }

        return true;
      })
      .sort((a, b) => {
        if (sortBy === "downloads") {
          return (b.downloadCount || 0) - (a.downloadCount || 0);
        }
        return (b.id || 0) - (a.id || 0);
      });
  }, [resources, searchQuery, selectedCategory, selectedFormat, sortBy]);

  // Real download handler: opens file and increments DB counter
  const handleDownload = async (res: RealResourceItem) => {
    setDownloadingId(res.id);

    // 1. Immediately trigger download / open in new tab
    if (res.fileUrl) {
      window.open(res.fileUrl, "_blank", "noopener,noreferrer");
    }

    // 2. Optimistically update local download count
    setResources((prev) =>
      prev.map((item) =>
        item.id === res.id
          ? { ...item, downloadCount: (item.downloadCount || 0) + 1 }
          : item
      )
    );

    // 3. Increment download count in Supabase via API
    try {
      await fetch("/api/resources/download", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: res.id }),
      });
    } catch (err) {
      console.warn("Failed to increment count via API:", err);
    } finally {
      setTimeout(() => setDownloadingId(null), 1000);
    }
  };

  return (
    <div className="bg-background min-h-screen py-8 sm:py-12 lg:py-16 text-text selection:bg-secondary/20 selection:text-secondary">
      <div className="container-main relative">
        {/* Ambient radial glow */}
        <div
          className="absolute -top-10 left-1/2 -translate-x-1/2 w-[650px] h-[320px] rounded-full opacity-20 pointer-events-none blur-3xl"
          style={{
            background:
              "radial-gradient(circle, rgba(167, 139, 250, 0.4) 0%, rgba(45, 212, 191, 0.2) 50%, transparent 70%)",
          }}
        />

        {/* Breadcrumb Navigation */}
        <nav
          aria-label="Breadcrumb"
          className="flex items-center gap-2 text-xs text-text-muted mb-8 font-bengali"
        >
          <Link href="/" className="hover:text-primary transition-colors">
            হোম
          </Link>
          <ChevronRight className="w-3.5 h-3.5 text-text-muted/60" />
          <span className="text-secondary font-semibold">ফ্রি রিসোর্স</span>
        </nav>

        {/* Header Hero Section */}
        <div className="max-w-3xl mb-10 lg:mb-12 relative z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-secondary/10 text-secondary text-xs font-bold font-bengali border border-secondary/20 mb-4 shadow-xs">
            <Sparkles className="w-3.5 h-3.5 animate-pulse" />
            <span>১০০% ফ্রি স্টাডি হাব ও লেকচার মেটেরিয়াল</span>
          </div>

          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-text font-bengali tracking-tight leading-[1.2] mb-4">
            পড়াশোনার গতি বাড়াতে{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-secondary via-teal-400 to-emerald-400">
              ফ্রি লেকচার শিট ও ফর্মুলা বুকলেট
            </span>
          </h1>

          <p className="text-text-muted text-base sm:text-lg font-bengali leading-relaxed">
            বোর্ড ও বিশ্ববিদ্যালয়ের বিগত বছরের প্রশ্ন বিশ্লেষণ, অধ্যায়ভিত্তিক গুরুত্বপূর্ণ
            হ্যান্ডনোট ও রঙিন রোডম্যাপ ডাউনলোড করুন সম্পূর্ণ বিনামূল্যে। কোনো সাবস্ক্রিপশন ছাড়াই পড়তে
            পারবেন এখনই।
          </p>
        </div>

        {/* Real Live Stats Bar */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 mb-10 relative z-10">
          <div className="p-4 rounded-xl bg-surface/80 dark:bg-slate-900/80 border border-border/80 backdrop-blur-md shadow-xs flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-secondary/15 text-secondary flex items-center justify-center shrink-0">
              <FileDown className="w-5 h-5" />
            </div>
            <div>
              <p className="text-lg sm:text-xl font-black text-text font-bengali leading-tight">
                {formatBengaliNumber(resources.length)}টি
              </p>
              <p className="text-xs text-text-muted font-bengali">ফ্রি রিসোর্স</p>
            </div>
          </div>

          <div className="p-4 rounded-xl bg-surface/80 dark:bg-slate-900/80 border border-border/80 backdrop-blur-md shadow-xs flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-primary/10 text-primary flex items-center justify-center shrink-0">
              <Download className="w-5 h-5" />
            </div>
            <div>
              <p className="text-lg sm:text-xl font-black text-text font-bengali leading-tight">
                {formatBengaliNumber(totalDownloads)}+
              </p>
              <p className="text-xs text-text-muted font-bengali">সর্বমোট ডাউনলোড</p>
            </div>
          </div>

          <div className="p-4 rounded-xl bg-surface/80 dark:bg-slate-900/80 border border-border/80 backdrop-blur-md shadow-xs flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-emerald-500/15 text-emerald-500 flex items-center justify-center shrink-0">
              <BookMarked className="w-5 h-5" />
            </div>
            <div>
              <p className="text-lg sm:text-xl font-black text-text font-bengali leading-tight">
                {formatBengaliNumber(uniqueSubjectsCount)}টি
              </p>
              <p className="text-xs text-text-muted font-bengali">কভার করা বিষয়</p>
            </div>
          </div>

          <div className="p-4 rounded-xl bg-surface/80 dark:bg-slate-900/80 border border-border/80 backdrop-blur-md shadow-xs flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-amber-500/15 text-amber-500 flex items-center justify-center shrink-0">
              <Zap className="w-5 h-5" />
            </div>
            <div>
              <p className="text-lg sm:text-xl font-black text-text font-bengali leading-tight">
                ১০০%
              </p>
              <p className="text-xs text-text-muted font-bengali">সরাসরি অ্যাক্সেস</p>
            </div>
          </div>
        </div>

        {/* Filter & Search Bar */}
        <div className="bg-surface/80 dark:bg-slate-900/80 rounded-2xl border border-border/80 p-4 sm:p-5 mb-8 shadow-xs backdrop-blur-md relative z-10 space-y-4">
          <div className="flex flex-col md:flex-row gap-4 items-stretch md:items-center justify-between">
            {/* Search Input */}
            <div className="relative flex-1">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted" />
              <input
                type="text"
                placeholder="রিসোর্স বা বিষয়ের নাম খুঁজুন (যেমন: পদার্থবিজ্ঞান, বুয়েট, সূত্র)..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-surface-secondary/70 dark:bg-slate-800/70 border border-border rounded-xl pl-10 pr-10 py-2.5 text-sm font-bengali text-text placeholder:text-text-muted/60 focus:outline-hidden focus:border-secondary/60 focus:ring-2 focus:ring-secondary/20 transition-all"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery("")}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-text-muted hover:text-text p-1"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>

            {/* Sort Dropdown / Toggle */}
            <div className="flex items-center gap-2 self-start md:self-auto">
              <span className="text-xs text-text-muted font-bengali shrink-0">ক্রম:</span>
              <div className="flex items-center gap-1 bg-surface-secondary/80 p-1 rounded-xl border border-border">
                <button
                  onClick={() => setSortBy("downloads")}
                  className={`px-3 py-1 rounded-lg text-xs font-bold font-bengali transition-all ${
                    sortBy === "downloads"
                      ? "bg-secondary text-white shadow-xs"
                      : "text-text-muted hover:text-text"
                  }`}
                >
                  জনপ্রিয়তা
                </button>
                <button
                  onClick={() => setSortBy("newest")}
                  className={`px-3 py-1 rounded-lg text-xs font-bold font-bengali transition-all ${
                    sortBy === "newest"
                      ? "bg-secondary text-white shadow-xs"
                      : "text-text-muted hover:text-text"
                  }`}
                >
                  নতুনতম
                </button>
              </div>
            </div>
          </div>

          {/* Categories and Formats Pill Filters */}
          <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-border/60">
            {/* Category Pills */}
            <div className="flex items-center gap-1.5 overflow-x-auto max-w-full no-scrollbar py-0.5">
              <button
                onClick={() => setSelectedCategory("all")}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold font-bengali transition-all whitespace-nowrap ${
                  selectedCategory === "all"
                    ? "bg-secondary text-white shadow-xs"
                    : "bg-surface-secondary/80 text-text-muted hover:text-text hover:bg-surface-secondary border border-border/70"
                }`}
              >
                সকল রিসোর্স ({resources.length})
              </button>

              {availableCategories.map((cat) => {
                const count = resources.filter((r) => r.category === cat).length;
                const label = CATEGORY_NAMES_BN[cat] || cat;
                return (
                  <button
                    key={cat}
                    onClick={() => setSelectedCategory(cat)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold font-bengali transition-all whitespace-nowrap ${
                      selectedCategory === cat
                        ? "bg-secondary text-white shadow-xs"
                        : "bg-surface-secondary/80 text-text-muted hover:text-text hover:bg-surface-secondary border border-border/70"
                    }`}
                  >
                    {label} ({count})
                  </button>
                );
              })}
            </div>

            {/* Format Filter if multiple formats exist */}
            {availableFormats.length > 1 && (
              <div className="flex items-center gap-1 shrink-0">
                <span className="text-[11px] text-text-muted font-bengali mr-1">ফরম্যাট:</span>
                <button
                  onClick={() => setSelectedFormat("all")}
                  className={`px-2 py-1 rounded text-[11px] font-bold font-sans transition-colors ${
                    selectedFormat === "all"
                      ? "bg-text/10 text-text"
                      : "text-text-muted hover:text-text"
                  }`}
                >
                  All
                </button>
                {availableFormats.map((fmt) => (
                  <button
                    key={fmt}
                    onClick={() => setSelectedFormat(fmt)}
                    className={`px-2 py-1 rounded text-[11px] font-bold font-sans transition-colors ${
                      selectedFormat === fmt
                        ? "bg-secondary/20 text-secondary border border-secondary/30"
                        : "text-text-muted hover:text-text"
                    }`}
                  >
                    {fmt}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Resources Grid */}
        {filteredResources.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 relative z-10">
            {filteredResources.map((res, idx) => {
              const theme =
                CATEGORY_COLORS[res.category || "General"] || CATEGORY_COLORS.General;
              const isDownloading = downloadingId === res.id;

              return (
                <motion.div
                  key={res.id}
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: idx * 0.04 }}
                  className={`group relative rounded-2xl border border-border/80 bg-surface dark:bg-slate-900/90 overflow-hidden flex flex-col justify-between hover:shadow-xl hover:-translate-y-1 transition-all duration-300 ${theme.borderHover}`}
                >
                  {/* Subtle card top gradient */}
                  <div
                    className={`absolute inset-0 bg-gradient-to-b ${theme.gradient} opacity-50 pointer-events-none`}
                  />

                  <div className="relative z-10 p-6 flex flex-col flex-1">
                    {/* Top Row: Category + Subject + Format */}
                    <div className="flex items-center justify-between gap-2 mb-4">
                      <div className="flex items-center gap-1.5 flex-wrap">
                        <span
                          className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-md text-xs font-bold font-bengali border shadow-xs ${theme.badgeBg}`}
                        >
                          <span>{res.category ? CATEGORY_NAMES_BN[res.category] || res.category : "শিক্ষা"}</span>
                          {res.subject && <span>• {res.subject}</span>}
                        </span>
                      </div>

                      <span className="text-[11px] font-bold font-mono px-2 py-0.5 rounded-md bg-surface-secondary border border-border text-text-muted uppercase">
                        {res.fileType || "PDF"}
                      </span>
                    </div>

                    {/* Title */}
                    <h3 className="font-bold text-base sm:text-lg text-text font-bengali mb-1.5 leading-snug group-hover:text-secondary transition-colors">
                      {res.titleBn || res.title}
                    </h3>

                    {res.title && res.title !== res.titleBn && (
                      <p className="text-xs text-text-muted/80 font-sans font-medium line-clamp-1 mb-3">
                        {res.title}
                      </p>
                    )}

                    {/* Description */}
                    <p className="text-xs sm:text-sm text-text-muted font-bengali leading-relaxed mb-6 line-clamp-3">
                      {res.description ||
                        "সম্পূর্ণ অধ্যায়ের গুরুত্বপূর্ণ সূত্রাবলি, প্রশ্ন বিশ্লেষণ ও শর্টকাট টেকনিক সংকলন।"}
                    </p>

                    {/* Meta info footer */}
                    <div className="mt-auto border-t border-border/70 pt-3.5 mb-5 flex items-center justify-between text-xs text-text-muted">
                      <span className="font-bengali flex items-center gap-1">
                        <FileText className="w-3.5 h-3.5 text-secondary" />
                        <span>ডিজিটাল হ্যান্ডনোট</span>
                      </span>

                      <span className="font-sans font-semibold text-text flex items-center gap-1">
                        <Download className="w-3.5 h-3.5 text-text-muted" />
                        <span>{formatBengaliNumber(res.downloadCount || 0)} downloads</span>
                      </span>
                    </div>

                    {/* Real Download Action Button */}
                    <button
                      type="button"
                      onClick={() => handleDownload(res)}
                      disabled={isDownloading}
                      className="w-full py-2.5 px-4 rounded-xl font-bengali text-sm font-bold flex items-center justify-center gap-2 transition-all duration-200 bg-surface-secondary hover:bg-secondary text-text hover:text-white border border-border hover:border-secondary shadow-xs hover:shadow-md cursor-pointer disabled:opacity-75"
                    >
                      <Download
                        className={`w-4 h-4 transition-transform duration-200 ${
                          isDownloading ? "animate-bounce text-white" : "group-hover:-translate-y-0.5"
                        }`}
                      />
                      <span>
                        {isDownloading
                          ? "ডাউনলোড শুরু হচ্ছে..."
                          : "পিডিএফ ডাউনলোড করুন"}
                      </span>
                    </button>
                  </div>
                </motion.div>
              );
            })}
          </div>
        ) : (
          /* Empty State */
          <div className="bg-surface/70 dark:bg-slate-900/70 rounded-2xl border border-dashed border-border p-12 text-center max-w-md mx-auto relative z-10">
            <div className="w-14 h-14 rounded-full bg-secondary/10 text-secondary flex items-center justify-center mx-auto mb-4">
              <FileText className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-text font-bengali mb-2">
              কোনো রিসোর্স পাওয়া যায়নি
            </h3>
            <p className="text-sm text-text-muted font-bengali mb-5 leading-relaxed">
              &ldquo;{searchQuery || selectedCategory}&rdquo; এর সাথে মিল রেখে কোনো লেকচার শিট বা হ্যান্ডনোট পাওয়া যায়নি।
            </p>
            <button
              onClick={() => {
                setSearchQuery("");
                setSelectedCategory("all");
                setSelectedFormat("all");
              }}
              className="btn btn-secondary btn-sm font-bengali font-bold"
            >
              সকল রিসোর্স দেখুন
            </button>
          </div>
        )}

        {/* Bottom Request / Counseling Banner */}
        <div className="mt-16 sm:mt-20 relative overflow-hidden rounded-2xl sm:rounded-3xl border border-border/80 bg-gradient-to-r from-surface via-surface-secondary to-surface dark:from-slate-900/90 dark:via-slate-800/90 dark:to-slate-900/90 p-8 sm:p-10 lg:p-12 shadow-sm relative z-10">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6 sm:gap-8">
            <div className="max-w-xl text-center md:text-left">
              <span className="inline-flex items-center gap-1.5 text-xs font-bold text-secondary font-bengali px-2.5 py-1 rounded-md bg-secondary/10 mb-3">
                <CheckCircle2 className="w-3.5 h-3.5" />
                ফ্রি স্টাডি সাপোর্ট
              </span>
              <h3 className="text-xl sm:text-2xl lg:text-3xl font-black text-text font-bengali tracking-tight mb-2">
                নির্দিষ্ট কোনো অধ্যায়ের শিট কি মিসিং মনে হচ্ছে?
              </h3>
              <p className="text-sm sm:text-base text-text-muted font-bengali leading-relaxed">
                আপনার কাঙ্ক্ষিত টপিক বা অধ্যায়ের নাম আমাদের জানান। আমাদের অ্যাকাডেমিক টিম দ্রুত সেই
                হ্যান্ডনোট তৈরি করে ফ্রি রিসোর্স সেকশনে যুক্ত করবে।
              </p>
            </div>

            <div className="flex flex-col sm:flex-row items-center gap-3 shrink-0 w-full sm:w-auto">
              <Link
                href="/courses"
                className="w-full sm:w-auto px-5 py-2.5 rounded-xl font-bengali text-sm font-bold bg-surface-secondary hover:bg-surface border border-border text-text transition-all text-center"
              >
                অনলাইন কোর্সসমূহ
              </Link>
              <Link
                href="/contact"
                className="w-full sm:w-auto px-5 py-2.5 rounded-xl font-bengali text-sm font-bold bg-secondary hover:bg-secondary-hover text-white shadow-md hover:shadow-lg transition-all text-center flex items-center justify-center gap-2"
              >
                <span>শিটের রিকোয়েস্ট পাঠান</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
