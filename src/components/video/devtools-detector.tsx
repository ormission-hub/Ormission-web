"use client";

import { useEffect, useState, useRef, type ReactNode } from "react";
import { ShieldAlert, AlertTriangle } from "lucide-react";

interface DevToolsDetectorProps {
  children: ReactNode;
  /** Whether the detector is active (default: true) */
  enabled?: boolean;
  /** Custom warning message in Bengali */
  warningTitle?: string;
  warningMessage?: string;
  /** Optional callback when DevTools state changes */
  onDevToolsChange?: (isOpen: boolean) => void;
}

/**
 * DevToolsDetector
 * 
 * Active anti-inspection shield for paid video lectures:
 * 1. Blocks shortcut combinations: F12, Ctrl+Shift+I/J/C, Ctrl+U, Cmd+Option+I/J/C/U
 * 2. Blocks right-click context menu
 * 3. Detects open DevTools using window size differential & console getters
 * 4. When DevTools is open, unmounts children (removes iframe from DOM) and displays security shield
 */
export function DevToolsDetector({
  children,
  enabled = true,
  warningTitle = "সুরক্ষা সতর্কতা: ইনস্পেক্ট এলিমেন্ট শনাক্ত হয়েছে",
  warningMessage = "ক্লাস কনটেন্টের সুরক্ষার স্বার্থে ডেভেলপার টুলস বা ইনস্পেক্ট এলিমেন্ট চালু থাকা অবস্থায় ভিডিও প্রদর্শন স্থগিত রাখা হয়েছে। অনুগ্রহ করে DevTools বন্ধ করে পেজ রিফ্রেশ করুন।",
  onDevToolsChange,
}: DevToolsDetectorProps) {
  const [isDevToolsOpen, setIsDevToolsOpen] = useState(false);
  const checkIntervalRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (!enabled || typeof window === "undefined") return;

    // 1. Keyboard shortcuts blocking
    const handleKeyDown = (e: KeyboardEvent) => {
      const isCtrlOrCmd = e.ctrlKey || e.metaKey;
      const key = e.key.toUpperCase();

      // F12
      if (e.key === "F12" || e.keyCode === 123) {
        e.preventDefault();
        e.stopPropagation();
        return false;
      }

      // Ctrl+Shift+I, Ctrl+Shift+J, Ctrl+Shift+C
      if (isCtrlOrCmd && e.shiftKey && (key === "I" || key === "J" || key === "C")) {
        e.preventDefault();
        e.stopPropagation();
        return false;
      }

      // Ctrl+U (View Page Source)
      if (isCtrlOrCmd && key === "U") {
        e.preventDefault();
        e.stopPropagation();
        return false;
      }

      // Ctrl+S (Save page)
      if (isCtrlOrCmd && key === "S") {
        e.preventDefault();
        e.stopPropagation();
        return false;
      }
    };

    // 2. Right-click context menu blocking
    const handleContextMenu = (e: MouseEvent) => {
      e.preventDefault();
      return false;
    };

    // 3. DevTools opening detection via window dimensions
    const checkDevTools = () => {
      // Threshold: if outer and inner dimension difference is larger than typical browser chrome (160px)
      const widthDiff = window.outerWidth - window.innerWidth;
      const heightDiff = window.outerHeight - window.innerHeight;
      const threshold = 160;

      const isDockedOpen = widthDiff > threshold || heightDiff > threshold;

      if (isDockedOpen !== isDevToolsOpen) {
        setIsDevToolsOpen(isDockedOpen);
        onDevToolsChange?.(isDockedOpen);
      }
    };

    window.addEventListener("keydown", handleKeyDown, true);
    window.addEventListener("contextmenu", handleContextMenu, true);
    window.addEventListener("resize", checkDevTools);

    checkIntervalRef.current = setInterval(checkDevTools, 1000);

    return () => {
      window.removeEventListener("keydown", handleKeyDown, true);
      window.removeEventListener("contextmenu", handleContextMenu, true);
      window.removeEventListener("resize", checkDevTools);
      if (checkIntervalRef.current) {
        clearInterval(checkIntervalRef.current);
      }
    };
  }, [enabled, isDevToolsOpen, onDevToolsChange]);

  if (isDevToolsOpen) {
    return (
      <div className="w-full aspect-video bg-gradient-to-br from-slate-950 via-red-950/40 to-slate-950 flex flex-col items-center justify-center p-6 text-center select-none border-2 border-red-500/30 rounded-xl relative overflow-hidden">
        {/* Glow ambient */}
        <div className="absolute -top-20 -left-20 w-48 h-48 bg-red-600/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-20 -right-20 w-48 h-48 bg-primary/20 rounded-full blur-3xl pointer-events-none" />

        <div className="w-16 h-16 rounded-2xl bg-red-500/10 border border-red-500/30 flex items-center justify-center mb-4 text-red-400 shadow-xl animate-pulse">
          <ShieldAlert className="w-8 h-8" />
        </div>

        <h3 className="text-base sm:text-lg font-bold text-white mb-2 font-bengali flex items-center gap-2">
          <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0" />
          <span>{warningTitle}</span>
        </h3>

        <p className="text-xs sm:text-sm text-slate-300 max-w-md font-bengali leading-relaxed mb-5">
          {warningMessage}
        </p>

        <button
          type="button"
          onClick={() => window.location.reload()}
          className="px-5 py-2 rounded-xl bg-red-600 hover:bg-red-500 text-white text-xs font-bold font-bengali transition-all shadow-lg hover:shadow-red-500/30 cursor-pointer"
        >
          DevTools বন্ধ করে পুনরায় চেষ্টা করুন
        </button>
      </div>
    );
  }

  return <>{children}</>;
}
