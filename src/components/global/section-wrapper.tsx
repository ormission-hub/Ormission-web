"use client";

import { useRef, useEffect, useState } from "react";
import { cn } from "@/lib/utils";

interface SectionWrapperProps {
  children: React.ReactNode;
  className?: string;
  id?: string;
  /** Disable animation (for hero or above-fold sections) */
  noAnimation?: boolean;
}

export function SectionWrapper({
  children,
  className,
  id,
  noAnimation = false,
}: SectionWrapperProps) {
  const ref = useRef<HTMLElement>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (noAnimation) return;
    const el = ref.current;
    if (!el) return;

    // Skip animation if user prefers reduced motion
    if (typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setIsVisible(true);
      return;
    }

    if (typeof IntersectionObserver === "undefined") {
      setIsVisible(true);
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { rootMargin: "-60px 0px", threshold: 0 }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [noAnimation]);

  if (noAnimation) {
    return (
      <section id={id} className={cn("w-full py-4 sm:py-6", className)}>
        <div className="container-main">{children}</div>
      </section>
    );
  }

  return (
    <section
      ref={ref}
      id={id}
      className={cn("w-full py-4 sm:py-6", className)}
      style={{
        opacity: isVisible ? 1 : 0,
        transform: isVisible ? "translateY(0)" : "translateY(24px)",
        transition: "opacity 0.5s ease-out, transform 0.5s ease-out",
      }}
    >
      <div className="container-main">{children}</div>
    </section>
  );
}
