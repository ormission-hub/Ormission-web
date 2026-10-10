"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { Bell, ExternalLink, Sparkles, AlertCircle, Clock, ArrowRight, Check } from "lucide-react";
import { type NoticeItem, FALLBACK_NOTICES } from "@/lib/data/notices";
import { createPublicClient } from "@/lib/supabase/public";

export function NotificationBell() {
  const [isOpen, setIsOpen] = useState(false);
  const [notices, setNotices] = useState<NoticeItem[]>(FALLBACK_NOTICES);
  const [hasUnread, setHasUnread] = useState(true);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Fetch latest notices from Supabase
    async function fetchNotices() {
      try {
        const supabase = createPublicClient();
        const { data } = await supabase
          .from("site_settings")
          .select("value")
          .eq("key", "ormission_notices")
          .maybeSingle();

        if (data?.value && Array.isArray(data.value)) {
          setNotices(data.value);
        }
      } catch (e) {
        // Fallback remains
      }
    }
    fetchNotices();

    // Check last read timestamp
    const lastRead = localStorage.getItem("ormission_notices_last_read");
    if (lastRead) {
      const readTime = new Date(lastRead).getTime();
      const hasNewer = notices.some(
        (n) => n.isActive && new Date(n.createdAt).getTime() > readTime
      );
      setHasUnread(hasNewer);
    }
  }, []);

  // Close on outside click
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    }
    window.addEventListener("mousedown", handleClickOutside);
    return () => window.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleToggle = () => {
    const nextState = !isOpen;
    setIsOpen(nextState);
    if (nextState) {
      setHasUnread(false);
      localStorage.setItem("ormission_notices_last_read", new Date().toISOString());
    }
  };

  const activeNotices = notices.filter((n) => n.isActive);
  const badgeCount = activeNotices.length;

  const getTypeBadge = (type: NoticeItem["type"]) => {
    switch (type) {
      case "emergency":
        return <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-rose-500/15 text-rose-500">জরুরি</span>;
      case "offer":
        return <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-500/15 text-amber-500">অফার</span>;
      case "exam":
        return <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-blue-500/15 text-blue-500">পরীক্ষা</span>;
      default:
        return <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-500/15 text-emerald-500">ঘোষণা</span>;
    }
  };

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Bell Button */}
      <button
        type="button"
        onClick={handleToggle}
        aria-label="নোটিফিকেশন দেখুন"
        className="relative p-2 rounded-xl text-text-muted hover:text-text hover:bg-surface-secondary transition-all cursor-pointer"
        title="নোটিফিকেশন ও ঘোষণা"
      >
        <Bell className="w-4.5 h-4.5" />
        {hasUnread && badgeCount > 0 && (
          <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-primary ring-2 ring-background animate-pulse" />
        )}
      </button>

      {/* Dropdown Card */}
      {isOpen && (
        <div className="animate-in fade-in zoom-in-95 duration-150 absolute right-0 top-full mt-2 w-80 sm:w-96 rounded-2xl bg-surface/95 dark:bg-slate-900/95 backdrop-blur-xl border border-border shadow-2xl p-4 z-50 font-bengali space-y-3">
          {/* Header */}
          <div className="flex items-center justify-between pb-2.5 border-b border-border">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-primary/10 text-primary flex items-center justify-center">
                <Bell className="w-3.5 h-3.5" />
              </div>
              <div>
                <h3 className="text-xs font-bold text-text">নোটিফিকেশন ও নোটিশ</h3>
                <p className="text-[10px] text-text-muted">সর্বশেষ একাডেমিক ও কোর্স আপডেট</p>
              </div>
            </div>

            <Link
              href="/notices"
              onClick={() => setIsOpen(false)}
              className="text-[11px] font-bold text-primary hover:underline flex items-center gap-0.5"
            >
              <span>সকল নোটিশ</span>
              <ArrowRight className="w-3 h-3" />
            </Link>
          </div>

          {/* List */}
          <div className="space-y-2 max-h-80 overflow-y-auto no-scrollbar">
            {activeNotices.length === 0 ? (
              <p className="py-6 text-center text-xs text-text-muted font-bengali">
                কোনো নতুন নোটিফিকেশন নেই।
              </p>
            ) : (
              activeNotices.slice(0, 4).map((notice) => (
                <div
                  key={notice.id}
                  className="p-3 rounded-xl bg-surface-secondary/40 hover:bg-surface-secondary border border-border/50 transition-colors space-y-1.5"
                >
                  <div className="flex items-center justify-between gap-2">
                    {getTypeBadge(notice.type)}
                    <span className="text-[10px] text-text-muted flex items-center gap-1 font-sans">
                      <Clock className="w-2.5 h-2.5" />
                      {new Date(notice.createdAt).toLocaleDateString("bn-BD")}
                    </span>
                  </div>

                  <h4 className="text-xs font-bold text-text leading-snug">
                    {notice.title}
                  </h4>

                  {notice.content && (
                    <p className="text-[11px] text-text-muted line-clamp-2 leading-relaxed">
                      {notice.content}
                    </p>
                  )}

                  {notice.actionUrl && (
                    <div className="pt-1">
                      <Link
                        href={notice.actionUrl}
                        onClick={() => setIsOpen(false)}
                        className="inline-flex items-center gap-1 text-[11px] font-bold text-primary hover:underline"
                      >
                        <span>{notice.actionText || "বিস্তারিত দেখুন"}</span>
                        <ArrowRight className="w-3 h-3" />
                      </Link>
                    </div>
                  )}
                </div>
              ))
            )}
          </div>

          {/* Footer */}
          <div className="pt-2 border-t border-border/60 text-center">
            <Link
              href="/notices"
              onClick={() => setIsOpen(false)}
              className="text-xs font-bold text-text-muted hover:text-primary transition-colors block py-1"
            >
              অফিশিয়াল নোটিশ বোর্ড দেখুন →
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
