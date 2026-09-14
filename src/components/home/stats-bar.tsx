"use client";

import { useRef, useEffect, useState } from "react";
import { useInView } from "framer-motion";
import { Users, BookOpen, GraduationCap, FileText, type LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface StatItem {
  icon: LucideIcon;
  value: number;
  suffix: string;
  label: string;
  colorClass: string;
  badgeBg: string;
}

const stats: StatItem[] = [
  {
    icon: Users,
    value: 15000,
    suffix: "+",
    label: "সফল শিক্ষার্থী",
    colorClass: "text-primary",
    badgeBg: "bg-primary/10 border-primary/20 group-hover:bg-primary/15 group-hover:border-primary/40",
  },
  {
    icon: BookOpen,
    value: 200,
    suffix: "+",
    label: "প্র্যাক্টিক্যাল কোর্স",
    colorClass: "text-secondary",
    badgeBg: "bg-secondary/10 border-secondary/20 group-hover:bg-secondary/15 group-hover:border-secondary/40",
  },
  {
    icon: GraduationCap,
    value: 50,
    suffix: "+",
    label: "টপ মেন্টর ও শিক্ষক",
    colorClass: "text-accent",
    badgeBg: "bg-accent/10 border-accent/20 group-hover:bg-accent/15 group-hover:border-accent/40",
  },
  {
    icon: FileText,
    value: 1000,
    suffix: "+",
    label: "ভিডিও ও রিসোর্স",
    colorClass: "text-indigo-500 dark:text-indigo-400",
    badgeBg: "bg-indigo-500/10 border-indigo-500/20 group-hover:bg-indigo-500/15 group-hover:border-indigo-500/40",
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
    <section className="relative border-y border-border bg-surface/70 backdrop-blur-xs">
      <div className="container-main py-8 lg:py-10">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
          {stats.map((stat, idx) => {
            const Icon = stat.icon;
            return (
              <div
                key={stat.label}
                className="group flex flex-col items-center text-center p-3 sm:p-4 rounded-2xl transition-all duration-300 hover:bg-surface-secondary/50"
              >
                {/* Premium SVG Icon Container */}
                <div
                  className={cn(
                    "w-12 h-12 rounded-2xl border flex items-center justify-center mb-3.5 transition-all duration-300 shadow-xs",
                    "group-hover:scale-110 group-hover:-translate-y-0.5",
                    stat.badgeBg
                  )}
                >
                  <Icon className={cn("w-6 h-6 transition-transform duration-300", stat.colorClass)} />
                </div>

                {/* Animated Value */}
                <div className="text-2xl sm:text-3xl font-extrabold text-text tabular-nums tracking-tight">
                  <AnimatedNumber target={stat.value} suffix={stat.suffix} />
                </div>

                {/* Label */}
                <div className="text-xs sm:text-sm font-semibold text-text-muted font-bengali mt-1">
                  {stat.label}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
