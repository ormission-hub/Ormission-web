"use client";

import { useEffect, useState, useRef, type ReactNode } from "react";
import { ShieldAlert, AlertTriangle, RefreshCw } from "lucide-react";
import DisableDevtool from "disable-devtool";

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
 * Military-Grade Anti-Inspection & DevTools Shield for Paid Lectures:
 * 1. Powered by disable-devtool engine (8 distinct detection algorithms)
 * 2. Active debugger timing trap (detects even in Device Emulation / mobile view mode)
 * 3. Console ID getter trap
 * 4. Window dimension differential & resize listeners
 * 5. Aggressive keyboard shortcut blocking (F12, Ctrl+Shift+I/J/C, Ctrl+U, Ctrl+S)
 * 6. Right-click context menu blocking
 * 7. Console sanitization (blocks YouTube/GoogleAds from printing video IDs to console)
 * 8. Complete DOM unmounting when DevTools is open (ZERO video tags or iframes in DOM)
 */
export function DevToolsDetector({
  children,
  enabled = true,
  warningTitle = "সুরক্ষা সতর্কতা: ডেভেলপার অপশন / ইনস্পেক্ট শনাক্ত হয়েছে",
  warningMessage = "ক্লাস কনটেন্টের সুরক্ষার স্বার্থে ডেভেলপার টুলস বা ইনস্পেক্ট এলিমেন্ট চালু থাকা অবস্থায় ভিডিও প্রদর্শন স্থগিত রাখা হয়েছে। অনুগ্রহ করে DevTools বন্ধ করে পেজ রিফ্রেশ করুন।",
  onDevToolsChange,
}: DevToolsDetectorProps) {
  const [isDevToolsOpen, setIsDevToolsOpen] = useState(false);
  const isOpenRef = useRef(false);

  // Sync ref with state
  useEffect(() => {
    isOpenRef.current = isDevToolsOpen;
    onDevToolsChange?.(isDevToolsOpen);
  }, [isDevToolsOpen, onDevToolsChange]);

  useEffect(() => {
    if (!enabled || typeof window === "undefined") return;

    // --- 1. Console Sanitization: Block YouTube & ad scripts from logging video IDs ---
    const originalLog = console.log;
    const originalWarn = console.warn;
    const originalError = console.error;
    const originalInfo = console.info;

    // Filter out video IDs and sensitive embed logs
    const sanitizeArgs = (args: any[]) => {
      return args.filter((a) => {
        if (typeof a === "string") {
          return !a.includes("youtu") && !a.includes("doubleclick") && !a.includes("streamtape") && !a.includes("adapter");
        }
        return true;
      });
    };

    console.log = (...args: any[]) => {
      const filtered = sanitizeArgs(args);
      if (filtered.length > 0) originalLog.apply(console, filtered);
    };
    console.warn = (...args: any[]) => {
      const filtered = sanitizeArgs(args);
      if (filtered.length > 0) originalWarn.apply(console, filtered);
    };
    console.error = (...args: any[]) => {
      const filtered = sanitizeArgs(args);
      if (filtered.length > 0) originalError.apply(console, filtered);
    };
    console.info = (...args: any[]) => {
      const filtered = sanitizeArgs(args);
      if (filtered.length > 0) originalInfo.apply(console, filtered);
    };

    // --- 2. Keyboard shortcuts blocking ---
    const handleKeyDown = (e: KeyboardEvent) => {
      const isCtrlOrCmd = e.ctrlKey || e.metaKey;
      const key = (e.key || "").toUpperCase();

      // F12
      if (e.key === "F12" || e.keyCode === 123) {
        e.preventDefault();
        e.stopPropagation();
        setIsDevToolsOpen(true);
        return false;
      }

      // Ctrl+Shift+I, Ctrl+Shift+J, Ctrl+Shift+C (Inspect Element, Console, Elements)
      if (isCtrlOrCmd && e.shiftKey && (key === "I" || key === "J" || key === "C")) {
        e.preventDefault();
        e.stopPropagation();
        setIsDevToolsOpen(true);
        return false;
      }

      // Ctrl+U (View Page Source)
      if (isCtrlOrCmd && key === "U") {
        e.preventDefault();
        e.stopPropagation();
        setIsDevToolsOpen(true);
        return false;
      }

      // Ctrl+S (Save page)
      if (isCtrlOrCmd && key === "S") {
        e.preventDefault();
        e.stopPropagation();
        return false;
      }
    };

    // --- 3. Right-click context menu blocking ---
    const handleContextMenu = (e: MouseEvent) => {
      e.preventDefault();
      e.stopPropagation();
      return false;
    };

    window.addEventListener("keydown", handleKeyDown, true);
    window.addEventListener("contextmenu", handleContextMenu, true);

    // --- 4. Initialize disable-devtool engine with ALL detectors enabled ---
    try {
      const runner = typeof DisableDevtool === "function" ? DisableDevtool : (DisableDevtool as any)?.default;
      if (typeof runner === "function") {
        runner({
          ondevtoolopen: () => {
            setIsDevToolsOpen(true);
          },
          ondevtoolclose: () => {
            setIsDevToolsOpen(false);
          },
          interval: 100,
          disableMenu: true,
          clearLog: true,
          detectors: "all" as any,
        });

        // Check immediately if already open
        if (typeof runner.isDevToolOpened === "function" && runner.isDevToolOpened()) {
          setIsDevToolsOpen(true);
        }
      }
    } catch (err) {
      console.warn("disableDevtool init:", err);
    }

    // --- 5. Active Debugger Timing Trap (Freezes DevTools & catches Device Toolbar) ---
    const debuggerInterval = setInterval(() => {
      const start = performance.now();
      try {
        // Function constructor prevents bundler dead-code removal
        (function () {
          return false;
        }["constructor"]("debugger")());
      } catch {
        // ignore
      }
      const elapsed = performance.now() - start;
      // If DevTools is open, the browser pauses at debugger statement causing elapsed > 40ms
      if (elapsed > 40) {
        setIsDevToolsOpen(true);
      }
    }, 250);

    // --- 6. Console ID Getter Trap ---
    const idTrapInterval = setInterval(() => {
      try {
        const trapImg = new Image();
        Object.defineProperty(trapImg, "id", {
          get: function () {
            setIsDevToolsOpen(true);
            return "";
          },
        });
        originalLog.call(console, "%c", trapImg);
        console.clear();
      } catch {
        // ignore
      }
    }, 1000);

    // --- 7. Window Dimension Difference Check ---
    const checkDimensions = () => {
      const widthDiff = window.outerWidth - window.innerWidth;
      const heightDiff = window.outerHeight - window.innerHeight;
      const threshold = 160;

      if (widthDiff > threshold || heightDiff > threshold) {
        setIsDevToolsOpen(true);
      }
    };

    window.addEventListener("resize", checkDimensions);
    const dimInterval = setInterval(checkDimensions, 1000);

    return () => {
      window.removeEventListener("keydown", handleKeyDown, true);
      window.removeEventListener("contextmenu", handleContextMenu, true);
      window.removeEventListener("resize", checkDimensions);
      clearInterval(debuggerInterval);
      clearInterval(idTrapInterval);
      clearInterval(dimInterval);

      // Restore original console methods
      console.log = originalLog;
      console.warn = originalWarn;
      console.error = originalError;
      console.info = originalInfo;
    };
  }, [enabled]);

  // When DevTools is detected, UNMOUNT children completely!
  // This guarantees ZERO video tags, ZERO iframes, and ZERO video URLs exist in the DOM.
  if (isDevToolsOpen) {
    return (
      <div className="w-full aspect-video bg-gradient-to-br from-slate-950 via-red-950/60 to-slate-950 flex flex-col items-center justify-center p-6 text-center select-none border-2 border-red-500/40 rounded-2xl relative overflow-hidden shadow-2xl animate-in fade-in duration-200">
        {/* Ambient Security Glow */}
        <div className="absolute -top-24 -left-24 w-60 h-60 bg-red-600/25 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -right-24 w-60 h-60 bg-amber-600/20 rounded-full blur-3xl pointer-events-none" />

        <div className="w-16 h-16 rounded-2xl bg-red-500/15 border border-red-500/40 flex items-center justify-center mb-4 text-red-400 shadow-xl shadow-red-500/10 animate-bounce">
          <ShieldAlert className="w-9 h-9" />
        </div>

        <div className="max-w-md space-y-2">
          <h3 className="text-base sm:text-lg font-black text-white font-bengali flex items-center justify-center gap-2">
            <AlertTriangle className="w-5 h-5 text-amber-400 shrink-0" />
            <span>{warningTitle}</span>
          </h3>

          <p className="text-xs sm:text-sm text-slate-300 font-bengali leading-relaxed">
            {warningMessage}
          </p>

          <p className="text-[11px] text-amber-400/80 font-mono">
            Security Policy: Video unmounted. Content inspection is strictly blocked.
          </p>
        </div>

        <button
          type="button"
          onClick={() => {
            setIsDevToolsOpen(false);
            window.location.reload();
          }}
          className="mt-5 px-6 py-2.5 rounded-xl bg-red-600 hover:bg-red-500 active:scale-95 text-white text-xs font-bold font-bengali transition-all shadow-lg shadow-red-600/25 flex items-center gap-2 cursor-pointer"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          <span>DevTools বন্ধ করে পেজ রিফ্রেশ করুন</span>
        </button>
      </div>
    );
  }

  return <>{children}</>;
}
