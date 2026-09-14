"use client";

import { useRef, useEffect, useState } from "react";
import { useInView } from "framer-motion";
import { Users, BookOpen, GraduationCap, Video } from "lucide-react";

interface StatItem {
  value: number;
  suffix: string;
  label: string;
  icon?: any;
}

const stats: StatItem[] = [
  {
    value: 12500,
    suffix: "+",
    label: "মোট শিক্ষার্থী",
    icon: Users,
  },
  {
    value: 200,
    suffix: "+",
    label: "কোর্স উপলব্ধ",
    icon: BookOpen,
  },
  {
    value: 50,
    suffix: "+",
    label: "বিশেষজ্ঞ শিক্ষক",
    icon: GraduationCap,
  },
  {
    value: 1000,
    suffix: "+",
    label: "ভিডিও লেসন",
    icon: Video,
  },
];

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

export function StatsBar() {
  return (
    <section className="relative py-6 sm:py-8">
      <div className="container-main">
        {/* Floating Capsule Card (Reference Mockup Style) */}
        <div className="bg-surface rounded-3xl p-6 sm:p-8 lg:p-10 border border-border/80 shadow-capsule transition-all duration-300">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8 divide-y sm:divide-y-0 sm:divide-x divide-border/60">
            {stats.map((stat, idx) => (
              <div
                key={stat.label}
                className={`flex flex-col items-center text-center ${
                  idx !== 0 ? "pt-4 sm:pt-0 sm:pl-6" : ""
                }`}
              >
                {/* Number in Bold Purple */}
                <div className="text-3xl sm:text-4xl lg:text-5xl font-black text-secondary tabular-nums tracking-tight mb-1.5">
                  <AnimatedNumber target={stat.value} suffix={stat.suffix} />
                </div>

                {/* Clean Bengali Label */}
                <div className="text-xs sm:text-sm font-semibold text-text-muted font-bengali">
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
