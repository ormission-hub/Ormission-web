"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Megaphone,
  Search,
  Pin,
  Clock,
  ArrowRight,
  ExternalLink,
  Calendar,
  AlertCircle,
  Flame,
  CheckCircle2,
  Sparkles,
} from "lucide-react";
import { type NoticeItem } from "@/lib/data/notices";

interface NoticesClientProps {
  initialNotices: NoticeItem[];
}

export function NoticesClient({ initialNotices }: NoticesClientProps) {
  const [selectedType, setSelectedType] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState("");

  const activeNotices = initialNotices.filter((n) => n.isActive && n.showNoticeBoard);

  const filteredNotices = activeNotices.filter((notice) => {
    const matchesType =
      selectedType === "all" || notice.type === selectedType;
    const matchesSearch =
      searchQuery.trim() === "" ||
      notice.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (notice.content && notice.content.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesType && matchesSearch;
  });

  // Sort: Pinned first, then newest first
  const sortedNotices = [...filteredNotices].sort((a, b) => {
    if (a.pinned && !b.pinned) return -1;
    if (!a.pinned && b.pinned) return 1;
    return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
  });

  const getTypeBadge = (type: NoticeItem["type"]) => {
    switch (type) {
      case "emergency":
        return (
          <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-rose-500/15 text-rose-500 border border-rose-500/25 flex items-center gap-1">
            <AlertCircle className="w-3 h-3" />
            <span>জরুরি নোটিশ</span>
          </span>
        );
      case "offer":
        return (
          <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-amber-500/15 text-amber-500 border border-amber-500/25 flex items-center gap-1">
            <Flame className="w-3 h-3" />
            <span>স্পেশাল অফার</span>
          </span>
        );
      case "exam":
        return (
          <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-blue-500/15 text-blue-500 border border-blue-500/25 flex items-center gap-1">
            <Calendar className="w-3 h-3" />
            <span>পরীক্ষা ও রুটিন</span>
          </span>
        );
      default:
        return (
          <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-500/15 text-emerald-500 border border-emerald-500/25 flex items-center gap-1">
            <CheckCircle2 className="w-3 h-3" />
            <span>সাধারণ নোটিশ</span>
          </span>
        );
    }
  };

  const categories = [
    { id: "all", label: "সকল নোটিশ" },
    { id: "emergency", label: "জরুরি নোটিশ" },
    { id: "offer", label: "স্পেশাল অফার" },
    { id: "exam", label: "পরীক্ষা ও রুটিন" },
    { id: "general", label: "সাধারণ ঘোষণা" },
  ];

  return (
    <div className="space-y-8 font-bengali">
      {/* Search & Filter Bar */}
      <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4 p-4 rounded-2xl bg-surface border border-border shadow-xs">
        {/* Category Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-1">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedType(cat.id)}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all shrink-0 cursor-pointer ${
                selectedType === cat.id
                  ? "bg-primary text-white shadow-xs"
                  : "bg-surface-secondary text-text-muted hover:text-text hover:bg-surface-secondary/80"
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* Search Input */}
        <div className="relative min-w-[240px]">
          <Search className="w-4 h-4 text-text-muted absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="নোটিশ খুঁজুন..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2 rounded-xl bg-surface-secondary border border-border/80 text-xs text-text placeholder:text-text-muted focus:outline-hidden focus:border-primary transition-colors"
          />
        </div>
      </div>

      {/* Notices Count */}
      <div className="flex items-center justify-between text-xs text-text-muted">
        <span>মোট {sortedNotices.length} টি নোটিশ প্রদর্শিত হচ্ছে</span>
        {searchQuery && (
          <button
            onClick={() => setSearchQuery("")}
            className="text-primary hover:underline font-bold"
          >
            সার্চ রিসেট করুন
          </button>
        )}
      </div>

      {/* Notices Grid / List */}
      {sortedNotices.length === 0 ? (
        <div className="py-16 text-center rounded-3xl border border-dashed border-border bg-surface/50 space-y-3">
          <div className="w-12 h-12 rounded-2xl bg-primary/10 text-primary flex items-center justify-center mx-auto">
            <Megaphone className="w-6 h-6" />
          </div>
          <h3 className="text-base font-bold text-text">কোনো নোটিশ পাওয়া যায়নি</h3>
          <p className="text-xs text-text-muted max-w-sm mx-auto">
            আপনার নির্বাচিত ক্যাটাগরি বা সার্চ কিওয়ার্ডে কোনো সক্রিয় নোটিশ নেই। অন্য ক্যাটাগরি নির্বাচন করুন।
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {sortedNotices.map((notice) => (
            <div
              key={notice.id}
              className={`p-6 rounded-3xl border transition-all hover:shadow-md flex flex-col justify-between relative overflow-hidden ${
                notice.pinned
                  ? "bg-gradient-to-br from-surface to-primary/5 border-primary/40 shadow-xs"
                  : "bg-surface dark:bg-slate-900 border-border"
              }`}
            >
              {notice.pinned && (
                <div className="absolute top-0 right-0 bg-primary text-white px-3 py-0.5 rounded-bl-xl text-[10px] font-bold flex items-center gap-1 shadow-xs">
                  <Pin className="w-3 h-3 fill-current" />
                  <span>গুরুত্বপূর্ণ নোটিশ</span>
                </div>
              )}

              <div className="space-y-3">
                <div className="flex flex-wrap items-center gap-2 pt-1">
                  {getTypeBadge(notice.type)}
                  <span className="text-xs text-text-muted flex items-center gap-1 font-sans">
                    <Clock className="w-3.5 h-3.5" />
                    <span>
                      {new Date(notice.createdAt).toLocaleDateString("bn-BD", {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      })}
                    </span>
                  </span>
                </div>

                <h3 className="text-base sm:text-lg font-bold text-text leading-snug">
                  {notice.title}
                </h3>

                {notice.content && (
                  <p className="text-xs sm:text-sm text-text-muted leading-relaxed">
                    {notice.content}
                  </p>
                )}
              </div>

              {notice.actionUrl && (
                <div className="pt-5 mt-4 border-t border-border/60 flex items-center justify-between">
                  <Link
                    href={notice.actionUrl}
                    className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-bold text-primary hover:text-primary-hover hover:underline transition-colors"
                  >
                    <span>{notice.actionText || "বিস্তারিত ও আবেদন"}</span>
                    <ArrowRight className="w-4 h-4" />
                  </Link>

                  <span className="text-[10px] text-text-muted uppercase tracking-wider font-sans">
                    Ormission Notice
                  </span>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
