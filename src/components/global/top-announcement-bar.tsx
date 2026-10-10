"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Megaphone, X, ArrowRight, Sparkles, AlertCircle, Bell } from "lucide-react";
import { type NoticeItem } from "@/lib/data/notices";

interface TopAnnouncementBarProps {
  initialNotices?: NoticeItem[];
}

export function TopAnnouncementBar({ initialNotices = [] }: TopAnnouncementBarProps) {
  const [notices, setNotices] = useState<NoticeItem[]>(initialNotices);
  const [dismissed, setDismissed] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);

  // Filter only active banner notices
  const bannerNotices = notices.filter(
    (n) => n.isActive && n.showTopBanner
  );

  useEffect(() => {
    // Check if user previously dismissed in this session
    const isDismissed = sessionStorage.getItem("ormission_announcement_dismissed");
    if (isDismissed === "true") {
      setDismissed(true);
    }

    if (initialNotices.length === 0) {
      import("@/lib/supabase/public").then(({ createPublicClient }) => {
        const supabase = createPublicClient();
        supabase
          .from("site_settings")
          .select("value")
          .eq("key", "ormission_notices")
          .maybeSingle()
          .then((res: any) => {
            if (res?.data?.value && Array.isArray(res.data.value)) {
              setNotices(res.data.value);
            }
          });
      });
    }
  }, [initialNotices.length]);

  // Cycle multiple banner notices every 6 seconds
  useEffect(() => {
    if (bannerNotices.length <= 1) return;
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % bannerNotices.length);
    }, 6000);
    return () => clearInterval(interval);
  }, [bannerNotices.length]);

  if (dismissed || bannerNotices.length === 0) {
    return null;
  }

  const currentNotice = bannerNotices[currentIndex] || bannerNotices[0];

  const handleDismiss = () => {
    setDismissed(true);
    sessionStorage.setItem("ormission_announcement_dismissed", "true");
  };

  const getBadgeStyle = (type: NoticeItem["type"]) => {
    switch (type) {
      case "emergency":
        return "bg-rose-500 text-white animate-pulse";
      case "offer":
        return "bg-amber-400 text-slate-950 font-black";
      case "exam":
        return "bg-sky-400 text-slate-950 font-black";
      default:
        return "bg-white/20 text-white";
    }
  };

  const getBadgeText = (type: NoticeItem["type"]) => {
    switch (type) {
      case "emergency":
        return "জরুরি";
      case "offer":
        return "অফার";
      case "exam":
        return "পরীক্ষা";
      default:
        return "ঘোষণা";
    }
  };

  return (
    <aside
      aria-label="শীর্ষ নোটিশ ও ঘোষণা"
      className="relative z-50 bg-gradient-to-r from-[#FF5F00] via-orange-600 to-[#E05300] text-white py-2 px-3 sm:px-4 text-xs font-bengali shadow-xs transition-all"
    >
      <div className="container-main flex items-center justify-between gap-3">
        <div className="flex items-center gap-2.5 min-w-0 flex-1 overflow-hidden">
          <span
            className={`px-2 py-0.5 rounded-full text-[10.5px] font-bold shrink-0 tracking-wide ${getBadgeStyle(
              currentNotice.type
            )}`}
          >
            {getBadgeText(currentNotice.type)}
          </span>

          <p className="truncate text-white font-medium text-xs sm:text-[13px] leading-snug">
            {currentNotice.title}
          </p>

          {currentNotice.actionUrl && (
            <Link
              href={currentNotice.actionUrl}
              className="hidden sm:inline-flex items-center gap-1 shrink-0 font-bold underline decoration-white/60 hover:decoration-white hover:text-amber-100 transition-colors ml-1 text-xs"
            >
              <span>{currentNotice.actionText || "বিস্তারিত দেখুন"}</span>
              <ArrowRight className="w-3 h-3" />
            </Link>
          )}
        </div>

        {/* Counter & Dismiss */}
        <div className="flex items-center gap-2 shrink-0">
          {bannerNotices.length > 1 && (
            <span className="text-[10px] text-white/70 font-sans hidden md:inline">
              {currentIndex + 1}/{bannerNotices.length}
            </span>
          )}

          <button
            onClick={handleDismiss}
            aria-label="ঘোষণা বন্ধ করুন"
            className="p-1 rounded-full hover:bg-white/20 transition-colors text-white/90 hover:text-white"
            title="বন্ধ করুন"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </aside>
  );
}
