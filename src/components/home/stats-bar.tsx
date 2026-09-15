"use client";

import { useRef, useEffect, useState } from "react";
import { useInView } from "framer-motion";

interface StatsBarProps {
  totalStudents?: number;
  coursesCount?: number;
  instructorsCount?: number;
  totalLessons?: number;
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

    let start = 0;
    const duration = 1400;
    const startTime = performance.now();

    function animate(currentTime: number) {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
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

  return (
    <section className="relative py-4 sm:py-8">
      <div className="container-main">
        {/* Floating Capsule Card (Reference Mockup Style) */}
        <div className="bg-surface rounded-2xl sm:rounded-3xl p-4 sm:p-6 lg:p-8 border border-border/80 shadow-capsule transition-all duration-300">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 lg:gap-8">
            {stats.map((stat) => (
              <div
                key={stat.label}
                className="flex flex-col items-center justify-center text-center p-2"
              >
                {/* Number in Bold Signature Purple */}
                <div className="text-2xl sm:text-3xl lg:text-4xl xl:text-5xl font-black text-secondary tabular-nums tracking-tight mb-1 whitespace-nowrap">
                  <AnimatedNumber target={stat.value} suffix={stat.suffix} />
                </div>

                {/* Clean Bengali Label (Strictly 1 line, never wraps into 2 lines) */}
                <div className="text-xs sm:text-sm font-bold text-text-muted font-bengali whitespace-nowrap">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
