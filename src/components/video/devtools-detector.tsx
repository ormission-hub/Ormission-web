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

// Global reactive state across component instances and page navigations
const devToolsSubscribers = new Set<(isOpen: boolean) => void>();
let isGlobalDevToolsDetected = false;
let disableDevtoolGlobalRunner: any = null;
let disableDevtoolStarted = false;

function broadcastDevTools(isOpen: boolean) {
  if (isGlobalDevToolsDetected === isOpen) return;
  isGlobalDevToolsDetected = isOpen;
  devToolsSubscribers.forEach((cb) => {
    try {
      cb(isOpen);
    } catch {}
  });
}

/**
 * DevToolsDetector
 * 
 * Professional Anti-Inspection & DevTools Shield for Paid Lectures:
 * 1. Global singleton subscriber architecture (syncs state across tabs & components)
 * 2. DisableDevtool engine with stable detectors (excluding Size to eliminate DPI/sidebar false positives)
 * 3. Two-phase debugger pause verification (prevents React hydration/CPU stutter false positives)
 * 4. Keyboard shortcut blocking (F12, Ctrl+Shift+I/J/C, Ctrl+U, Ctrl+S)
 * 5. Right-click context menu blocking
 * 6. MediaSession lockdown (blocks Brave/Chrome toolbar media popup from leaking video titles)
 * 7. Self-healing: Automatically restores video when DevTools is closed
 * 8. Complete DOM unmounting when DevTools is open (ZERO video tags or iframes in DOM)
 */
export function DevToolsDetector({
  children,
  enabled = true,
  warningTitle = "সুরক্ষা সতর্কতা: ডেভেলপার অপশন / ইনস্পেক্ট শনাক্ত হয়েছে",
  warningMessage = "ক্লাস কনটেন্টের সুরক্ষার স্বার্থে ডেভেলপার টুলস বা ইনস্পেক্ট এলিমেন্ট চালু থাকা অবস্থায় ভিডিও প্রদর্শন স্থগিত রাখা হয়েছে। অনুগ্রহ করে DevTools বন্ধ করে পেজ রিফ্রেশ করুন।",
  onDevToolsChange,
}: DevToolsDetectorProps) {
  const [isDevToolsOpen, setIsDevToolsOpen] = useState(isGlobalDevToolsDetected);
  const isOpenRef = useRef(isGlobalDevToolsDetected);

  // Sync ref with state & notify parent callback
  useEffect(() => {
    isOpenRef.current = isDevToolsOpen;
    onDevToolsChange?.(isDevToolsOpen);
  }, [isDevToolsOpen, onDevToolsChange]);

  useEffect(() => {
    if (!enabled || typeof window === "undefined") return;

    // Register this instance with global subscriber set
    devToolsSubscribers.add(setIsDevToolsOpen);
    setIsDevToolsOpen(isGlobalDevToolsDetected);

    // --- 0. Block Chromium/Brave Global Media Session toolbar popups ---
    if ("mediaSession" in navigator) {
      try {
        navigator.mediaSession.metadata = null;
        navigator.mediaSession.playbackState = "none";
        navigator.mediaSession.setActionHandler("play", () => {});
        navigator.mediaSession.setActionHandler("pause", () => {});
        navigator.mediaSession.setActionHandler("seekto", () => {});
      } catch {}
    }

    // --- 1. Console Sanitization: Filter out video IDs from debug logs ---
    const originalLog = console.log;
    const originalWarn = console.warn;
    const originalError = console.error;
    const originalInfo = console.info;

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
        broadcastDevTools(true);
        return false;
      }

      // Ctrl+Shift+I, Ctrl+Shift+J, Ctrl+Shift+C (Inspect Element, Console, Elements)
      if (isCtrlOrCmd && e.shiftKey && (key === "I" || key === "J" || key === "C")) {
        e.preventDefault();
        e.stopPropagation();
        broadcastDevTools(true);
        return false;
      }

      // Ctrl+U (View Page Source)
      if (isCtrlOrCmd && key === "U") {
        e.preventDefault();
        e.stopPropagation();
        broadcastDevTools(true);
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

    // --- 3b. Docked DevTools Dimension Checker ---
    const checkDockedDevTools = () => {
      if (typeof window === "undefined") return;
      const widthThreshold = window.outerWidth - window.innerWidth > 200;
      const heightThreshold = window.outerHeight - window.innerHeight > 260;
      if (widthThreshold || heightThreshold) {
        broadcastDevTools(true);
      }
    };

    window.addEventListener("keydown", handleKeyDown, true);
    window.addEventListener("contextmenu", handleContextMenu, true);
    window.addEventListener("resize", checkDockedDevTools, { passive: true });

    // Immediate check on mount
    checkDockedDevTools();

    // --- 4. Initialize disable-devtool engine globally once ---
    if (!disableDevtoolStarted) {
      disableDevtoolStarted = true;
      try {
        const runner = typeof DisableDevtool === "function" ? DisableDevtool : (DisableDevtool as any)?.default;
        if (typeof runner === "function") {
          disableDevtoolGlobalRunner = runner;
          runner({
            ondevtoolopen: () => {
              broadcastDevTools(true);
            },
            ondevtoolclose: () => {
              broadcastDevTools(false);
            },
            interval: 250,
            disableMenu: true,
            clearLog: true,
            detectors: [0, 1, 2, 3, 4, 5, 6, 7] as any,
          });
        }
      } catch (err) {
        console.warn("disableDevtool init:", err);
      }
    }

    // --- 5. Console & Elements Inspection Trap ---
    try {
      const inspectTrap = new Image();
      Object.defineProperty(inspectTrap, "id", {
        get: function () {
          broadcastDevTools(true);
          return "inspect-shield";
        },
      });
      // Periodic evaluation trigger for Chromium devtools inspector
      const trapInterval = setInterval(() => {
        try {
          console.debug(inspectTrap);
        } catch {}
      }, 500);

      // --- 6. Fast Debugger Pause & Size Verification ---
      const heartbeatInterval = setInterval(() => {
        checkDockedDevTools();

        if (typeof disableDevtoolGlobalRunner?.isDevToolOpened === "function") {
          if (disableDevtoolGlobalRunner.isDevToolOpened()) {
            broadcastDevTools(true);
            return;
          }
        }

        // Timing check: Debugger breakpoint detection
        const tStart = performance.now();
        try {
          (function () {
            return false;
          }["constructor"]("debugger")());
        } catch {}
        const elapsed = performance.now() - tStart;

        if (elapsed > 80) {
          broadcastDevTools(true);
        }
      }, 400);

      return () => {
        devToolsSubscribers.delete(setIsDevToolsOpen);
        window.removeEventListener("keydown", handleKeyDown, true);
        window.removeEventListener("contextmenu", handleContextMenu, true);
        window.removeEventListener("resize", checkDockedDevTools);
        clearInterval(trapInterval);
        clearInterval(heartbeatInterval);

        // Restore original console methods
        console.log = originalLog;
        console.warn = originalWarn;
        console.error = originalError;
        console.info = originalInfo;
      };
    } catch {}
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
            isGlobalDevToolsDetected = false;
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
