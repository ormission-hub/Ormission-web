"use client";

import { useRef, useEffect, useState } from "react";
import { useInView } from "framer-motion";

export interface StatsBarProps {
  totalStudents?: number;
  coursesCount?: number;
  instructorsCount?: number;
  totalLessons?: number;
  embedded?: boolean;
  className?: string;
}

function AnimatedNumber({ target, suffix }: { target: number; suffix: string }) {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);
  const isInView = useInView(ref, { once: true });

  useEffect(() => {
    if (!isInView) return;

    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    if (prefersReducedMotion) {
      setCount(target);
      return;
    }

    // Slower, satisfying counting duration so large numbers like 12,500 roll smoothly
    const duration = target > 1000 ? 3000 : 2000;
    const startTime = performance.now();

    function animate(currentTime: number) {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      // Smooth easeOutQuad gives a steady, readable rolling count without rushing
      const eased = progress * (2 - progress);
      const current = Math.round(eased * target);

      setCount(current);

      if (progress < 1) {
        requestAnimationFrame(animate);
      }
    }

    requestAnimationFrame(animate);
  }, [isInView, target]);

  const formatted = count.toLocaleString("en-US");

  return (
    <span ref={ref}>
      {formatted}
      {suffix}
    </span>
  );
}

export function StatsBar({
  totalStudents = 12500,
  coursesCount = 6,
  instructorsCount = 10,
  totalLessons = 200,
  embedded = false,
  className = "",
}: StatsBarProps) {
  const stats = [
    {
      value: totalStudents,
      suffix: "",
      label: "মোট শিক্ষার্থী",
    },
    {
      value: coursesCount,
      suffix: "",
      label: "কোর্স উপলব্ধ",
    },
    {
      value: instructorsCount,
      suffix: "",
      label: "বিশেষজ্ঞ শিক্ষক",
    },
    {
      value: totalLessons,
      suffix: "",
      label: "ভিডিও লেসন",
    },
  ];

  const cardContent = (
    <div className={`bg-surface rounded-2xl sm:rounded-3xl py-3 px-1 sm:py-6 sm:px-6 lg:py-8 border border-border/80 shadow-capsule transition-all duration-300 ${className}`}>
      <div className="grid grid-cols-4 divide-x divide-border/60">
        {stats.map((stat) => (
          <div
            key={stat.label}
            className="flex flex-col items-center justify-center text-center px-1 sm:px-3"
          >
            {/* Number in Bold Signature Purple */}
            <div className="text-base sm:text-2xl md:text-3xl lg:text-4xl xl:text-5xl font-black text-secondary tabular-nums tracking-tight mb-0.5 sm:mb-1 whitespace-nowrap">
              <AnimatedNumber target={stat.value} suffix={stat.suffix} />
            </div>

            {/* Clean Bengali Label (Strictly 1 line, never wraps into 2 lines) */}
            <div className="text-[10px] sm:text-xs lg:text-sm font-bold text-text-muted font-bengali whitespace-nowrap leading-none">
              {stat.label}
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  if (embedded) {
    return cardContent;
  }

  return (
    <section className="relative py-3 sm:py-6 lg:py-8">
      <div className="container-main px-3 sm:px-6">
        {cardContent}
      </div>
    </section>
  );
}
