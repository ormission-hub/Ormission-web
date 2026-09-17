"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";
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
  const isInView = useInView(ref, { once: true, margin: "-60px" });

  if (noAnimation) {
    return (
      <section id={id} className={cn("w-full py-4 sm:py-6", className)}>
        <div className="container-main">{children}</div>
      </section>
    );
  }

  return (
    <motion.section
      ref={ref}
      id={id}
      className={cn("w-full py-4 sm:py-6", className)}
      initial={{ opacity: 0, y: 24 }}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 24 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
    >
      <div className="container-main">{children}</div>
    </motion.section>
  );
}
