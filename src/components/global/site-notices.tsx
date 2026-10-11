"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import {
  X,
  ArrowRight,
  Sparkles,
  AlertCircle,
  Bell,
  Megaphone,
  CheckCircle,
} from "lucide-react";
import { type NoticeItem } from "@/lib/data/notices";

export function SiteNotices() {
  const pathname = usePathname();
  const [notices, setNotices] = useState<NoticeItem[]>([]);
  const [dismissedPopups, setDismissedPopups] = useState<Record<string, boolean>>({});
  const [dismissedTopBars, setDismissedTopBars] = useState<Record<string, boolean>>({});
  const [dismissedBottomBars, setDismissedBottomBars] = useState<Record<string, boolean>>({});

  useEffect(() => {
    // Fetch live notices from Supabase site_settings
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

    // Check dismissed states in sessionStorage
    try {
      const storedPopups = sessionStorage.getItem("ormission_dismissed_popups");
      if (storedPopups) setDismissedPopups(JSON.parse(storedPopups));

      const storedTopBars = sessionStorage.getItem("ormission_dismissed_topbars");
      if (storedTopBars) setDismissedTopBars(JSON.parse(storedTopBars));

      const storedBottomBars = sessionStorage.getItem("ormission_dismissed_bottombars");
      if (storedBottomBars) setDismissedBottomBars(JSON.parse(storedBottomBars));
    } catch {}
  }, []);

  // Filter notices that match the current pathname
  const matchesPage = (target?: string) => {
    if (!target || target === "*" || target === "all") return true;
    if (target === "/" && pathname === "/") return true;
    if (target === pathname) return true;
    if (target !== "/" && pathname.startsWith(target)) return true;
    return false;
  };

  const activeNotices = notices.filter((n) => n.isActive && matchesPage(n.targetPage));

  // Determine effective display type
  const getDisplayType = (notice: NoticeItem): "popup" | "top_bar" | "bottom_bar" => {
    if (notice.displayType) return notice.displayType;
    if (notice.showTopBanner) return "top_bar";
    return "top_bar";
  };

  // Handlers for dismissing notices
  const handleDismissPopup = (id: string) => {
    const updated = { ...dismissedPopups, [id]: true };
    setDismissedPopups(updated);
    try {
      sessionStorage.setItem("ormission_dismissed_popups", JSON.stringify(updated));
    } catch {}
  };

  const handleDismissTopBar = (id: string) => {
    const updated = { ...dismissedTopBars, [id]: true };
    setDismissedTopBars(updated);
    try {
      sessionStorage.setItem("ormission_dismissed_topbars", JSON.stringify(updated));
    } catch {}
  };

  const handleDismissBottomBar = (id: string) => {
    const updated = { ...dismissedBottomBars, [id]: true };
    setDismissedBottomBars(updated);
    try {
      sessionStorage.setItem("ormission_dismissed_bottombars", JSON.stringify(updated));
    } catch {}
  };

  // 1. Popup Notice (pick the first un-dismissed matching popup)
  const popupNotice = activeNotices.find(
    (n) => getDisplayType(n) === "popup" && !dismissedPopups[n.id]
  );

  // 2. Top Bar Notice (pick the first un-dismissed matching top bar)
  const topBarNotice = activeNotices.find(
    (n) => getDisplayType(n) === "top_bar" && !dismissedTopBars[n.id]
  );

  // 3. Bottom Bar Notice (pick the first un-dismissed matching bottom bar)
  const bottomBarNotice = activeNotices.find(
    (n) => getDisplayType(n) === "bottom_bar" && !dismissedBottomBars[n.id]
  );

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
    <>
      {/* ========================================================================= */}
      {/* 1. TOP ANNOUNCEMENT BAR */}
      {/* ========================================================================= */}
      {topBarNotice && (
        <aside
          aria-label="শীর্ষ নোটিশ ও ঘোষণা"
          className="relative z-50 bg-gradient-to-r from-[#FF5F00] via-orange-600 to-[#E05300] text-white py-2 px-3 sm:px-4 text-xs font-bengali shadow-xs transition-all"
        >
          <div className="container-main flex items-center justify-between gap-3">
            <div className="flex items-center gap-2.5 min-w-0 flex-1 overflow-hidden">
              <span
                className={`px-2 py-0.5 rounded-full text-[10.5px] font-bold shrink-0 tracking-wide ${getBadgeStyle(
                  topBarNotice.type
                )}`}
              >
                {getBadgeText(topBarNotice.type)}
              </span>

              <p className="truncate text-white font-medium text-xs sm:text-[13px] leading-snug">
                {topBarNotice.title}
              </p>

              {topBarNotice.actionUrl && (
                <Link
                  href={topBarNotice.actionUrl}
                  className="hidden sm:inline-flex items-center gap-1 shrink-0 font-bold underline decoration-white/60 hover:decoration-white hover:text-amber-100 transition-colors ml-1 text-xs"
                >
                  <span>{topBarNotice.actionText || "বিস্তারিত দেখুন"}</span>
                  <ArrowRight className="w-3 h-3" />
                </Link>
              )}
            </div>

            <button
              onClick={() => handleDismissTopBar(topBarNotice.id)}
              aria-label="ঘোষণা বন্ধ করুন"
              className="p-1 rounded-full hover:bg-white/20 transition-colors text-white/90 hover:text-white shrink-0 cursor-pointer"
              title="বন্ধ করুন"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        </aside>
      )}

      {/* ========================================================================= */}
      {/* 2. POPUP MODAL NOTICE (Dialog Popup) */}
      {/* ========================================================================= */}
      {popupNotice && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/75 backdrop-blur-sm animate-in fade-in duration-200">
          <div
            role="dialog"
            aria-modal="true"
            className="relative w-full max-w-md rounded-3xl bg-surface dark:bg-slate-900 border border-border/80 shadow-2xl overflow-hidden font-bengali animate-in zoom-in-95 duration-200"
          >
            {/* Top Close Button */}
            <button
              onClick={() => handleDismissPopup(popupNotice.id)}
              aria-label="পপআপ বন্ধ করুন"
              className="absolute top-3.5 right-3.5 z-10 w-8 h-8 rounded-full bg-slate-900/60 dark:bg-slate-800/80 text-white flex items-center justify-center hover:bg-slate-900 hover:scale-105 transition-all shadow-md cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>

            {/* Optional Banner Image */}
            {popupNotice.imageUrl && (
              <div className="w-full h-44 sm:h-52 overflow-hidden bg-slate-950 relative">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={popupNotice.imageUrl}
                  alt={popupNotice.title}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
              </div>
            )}

            {/* Content Body */}
            <div className="p-5 sm:p-6 space-y-3">
              <div className="flex items-center gap-2">
                <span
                  className={`px-2.5 py-0.5 rounded-full text-[11px] font-bold ${getBadgeStyle(
                    popupNotice.type
                  )}`}
                >
                  {getBadgeText(popupNotice.type)}
                </span>
                <span className="text-xs text-text-muted font-sans font-medium">
                  Ormission Notice
                </span>
              </div>

              <h3 className="text-base sm:text-lg font-bold text-text leading-snug">
                {popupNotice.title}
              </h3>

              {popupNotice.content && (
                <p className="text-xs sm:text-sm text-text-muted leading-relaxed whitespace-pre-line">
                  {popupNotice.content}
                </p>
              )}

              {/* Action Buttons */}
              <div className="pt-3 flex flex-col sm:flex-row items-center gap-2.5">
                {popupNotice.actionUrl ? (
                  <Link
                    href={popupNotice.actionUrl}
                    onClick={() => handleDismissPopup(popupNotice.id)}
                    className="w-full sm:flex-1 py-3 px-4 rounded-xl bg-primary hover:bg-primary-hover text-white text-xs sm:text-sm font-bold flex items-center justify-center gap-2 shadow-md hover:shadow-lg transition-all"
                  >
                    <span>{popupNotice.actionText || "অফারটি গ্রহণ করুন"}</span>
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                ) : null}

                <button
                  type="button"
                  onClick={() => handleDismissPopup(popupNotice.id)}
                  className="w-full sm:w-auto py-2.5 px-4 text-xs font-semibold text-text-muted hover:text-text transition-colors text-center cursor-pointer"
                >
                  আজ আর দেখাবেন না
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 3. BOTTOM FLOATING NOTICE BAR */}
      {/* ========================================================================= */}
      {bottomBarNotice && (
        <aside
          aria-label="গুরুত্বপূর্ণ বিজ্ঞপ্তি"
          className="fixed bottom-20 lg:bottom-6 right-4 sm:right-6 z-40 max-w-sm w-[calc(100%-2rem)] sm:w-auto p-4 rounded-2xl bg-surface/95 dark:bg-slate-900/95 backdrop-blur-md border border-primary/30 shadow-2xl font-bengali animate-in slide-in-from-bottom-5 duration-200"
        >
          <div className="flex items-start gap-3">
            <div className="w-9 h-9 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center text-primary shrink-0">
              <Megaphone className="w-4 h-4 animate-bounce" />
            </div>

            <div className="min-w-0 flex-1 space-y-1">
              <div className="flex items-center justify-between gap-2">
                <span
                  className={`px-1.5 py-0.5 rounded text-[10px] font-bold ${getBadgeStyle(
                    bottomBarNotice.type
                  )}`}
                >
                  {getBadgeText(bottomBarNotice.type)}
                </span>
                <button
                  onClick={() => handleDismissBottomBar(bottomBarNotice.id)}
                  aria-label="বিজ্ঞপ্তি বন্ধ করুন"
                  className="text-text-muted hover:text-text p-0.5 rounded cursor-pointer"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>

              <h4 className="text-xs sm:text-sm font-bold text-text leading-snug line-clamp-1">
                {bottomBarNotice.title}
              </h4>

              {bottomBarNotice.content && (
                <p className="text-[11px] text-text-muted line-clamp-2 leading-relaxed">
                  {bottomBarNotice.content}
                </p>
              )}

              {bottomBarNotice.actionUrl && (
                <div className="pt-1.5">
                  <Link
                    href={bottomBarNotice.actionUrl}
                    onClick={() => handleDismissBottomBar(bottomBarNotice.id)}
                    className="inline-flex items-center gap-1 text-xs font-bold text-primary hover:underline"
                  >
                    <span>{bottomBarNotice.actionText || "বিস্তারিত দেখুন"}</span>
                    <ArrowRight className="w-3 h-3" />
                  </Link>
                </div>
              )}
            </div>
          </div>
        </aside>
      )}
    </>
  );
}
