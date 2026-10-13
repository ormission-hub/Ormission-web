"use client";

import { useEffect, useState, useTransition, useRef } from "react";
import { usePathname, useSearchParams } from "next/navigation";

export function NavigationProgressBar() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [progress, setProgress] = useState(0);
  const [isVisible, setIsVisible] = useState(false);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const startProgress = () => {
    if (timerRef.current) clearInterval(timerRef.current);
    setIsVisible(true);
    setProgress(25);

    timerRef.current = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 90) {
          if (timerRef.current) clearInterval(timerRef.current);
          return 90;
        }
        // Smooth creeping animation while waiting for route transition
        const inc = Math.max(1, (90 - prev) * 0.15);
        return Math.min(90, prev + inc);
      });
    }, 120);
  };

  const completeProgress = () => {
    if (timerRef.current) clearInterval(timerRef.current);
    setProgress(100);
    setTimeout(() => {
      setIsVisible(false);
      setTimeout(() => setProgress(0), 200);
    }, 200);
  };

  // When pathname or search params change, complete the progress bar
  useEffect(() => {
    completeProgress();
  }, [pathname, searchParams]);

  // Intercept all internal <a> tag clicks for 0ms tactile feedback
  useEffect(() => {
    const handleDocumentClick = (e: MouseEvent) => {
      // Ignore right clicks or clicks with modifier keys (cmd/ctrl/shift/alt)
      if (e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;

      const target = (e.target as HTMLElement).closest("a");
      if (!target) return;

      const href = target.getAttribute("href");
      if (!href) return;

      // Ignore hash links, javascript:, mailto:, tel:, or new tab links
      if (
        href.startsWith("#") ||
        href.startsWith("javascript:") ||
        href.startsWith("mailto:") ||
        href.startsWith("tel:") ||
        target.getAttribute("target") === "_blank" ||
        target.getAttribute("download") !== null
      ) {
        return;
      }

      // Check if it's an internal link
      try {
        const url = new URL(href, window.location.origin);
        if (url.origin === window.location.origin) {
          // If navigating to the same path + search, no need to trigger
          const currentUrl = new URL(window.location.href);
          if (url.pathname === currentUrl.pathname && url.search === currentUrl.search) {
            return;
          }
          startProgress();
        }
      } catch {
        // invalid URL
      }
    };

    document.addEventListener("click", handleDocumentClick, { capture: true });
    return () => {
      document.removeEventListener("click", handleDocumentClick, { capture: true });
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, []);

  if (!isVisible && progress === 0) return null;

  return (
    <div
      aria-hidden="true"
      className="fixed top-0 left-0 right-0 z-[99999] pointer-events-none transition-opacity duration-200"
      style={{ opacity: isVisible ? 1 : 0 }}
    >
      <div
        className="h-[3px] bg-gradient-to-r from-primary via-orange-500 to-rose-500 shadow-[0_0_12px_rgba(255,95,0,0.8)] transition-all ease-out duration-200 relative"
        style={{ width: `${progress}%` }}
      >
        {/* Glow head */}
        <div className="absolute right-0 top-0 bottom-0 w-24 bg-gradient-to-r from-transparent to-white/80 shadow-[0_0_10px_#ffffff]" />
      </div>
    </div>
  );
}
