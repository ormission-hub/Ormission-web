"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";

export function SplashScreen() {
  const [isVisible, setIsVisible] = useState(true);

  // Fast 350ms entry for an ultra snappy, native-app feel
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(false);
    }, 350);

    return () => clearTimeout(timer);
  }, []);

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          key="ormission-fast-splash"
          initial={{ opacity: 1 }}
          exit={{
            opacity: 0,
            scale: 1.04,
            transition: { duration: 0.35, ease: [0.16, 1, 0.3, 1] },
          }}
          className="fixed inset-0 z-[999999] flex flex-col items-center justify-center bg-[#050A18] select-none"
        >
          {/* Subtle Ambient Glow */}
          <div className="absolute w-72 h-72 rounded-full bg-blue-600/30 blur-3xl pointer-events-none" />

          {/* Minimal Elegant Brand Centerpiece */}
          <motion.div
            initial={{ scale: 0.88, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.35, ease: "easeOut" }}
            className="relative z-10 flex flex-col items-center text-center"
          >
            {/* Glowing Logo Badge */}
            <div className="relative w-20 h-20 sm:w-24 sm:h-24 rounded-2xl bg-white/10 p-3.5 backdrop-blur-md border border-white/20 shadow-[0_8px_32px_rgba(1,44,148,0.7)] flex items-center justify-center overflow-hidden mb-3">
              <span className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/30 to-transparent animate-glass-shimmer pointer-events-none" />
              <Image
                src="/images/brand-logo-v2.png"
                alt="Ormission Logo"
                width={80}
                height={80}
                priority
                className="w-full h-full object-contain drop-shadow-md"
              />
            </div>

            {/* Brand Title */}
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight font-sans text-white">
              <span>Orm</span>
              <span className="bg-gradient-to-r from-blue-400 via-sky-400 to-indigo-300 bg-clip-text text-transparent">
                ission
              </span>
            </h1>

            {/* Subtitle */}
            <p className="text-[10px] sm:text-xs font-bold tracking-[0.25em] text-blue-200/80 uppercase mt-1">
              Learn · Build · Grow
            </p>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
